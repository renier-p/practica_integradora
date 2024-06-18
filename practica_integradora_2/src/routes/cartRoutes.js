import { Router } from 'express';
import CartManager from "../Dao/mongomanagers/cartManagerMongo.js";
import ProductManager from '../Dao/mongomanagers/productManagerMongo.js';
import cartModel from '../Dao/models/carts.model.js';

const router = Router();
const manager = new CartManager();
const pm = new ProductManager();


const getPopulatedCart = async (cartId) => {
    try {
        const cart = await cartModel.findById(cartId).populate('products.product').lean();
        return cart;
    } catch (error) {
        throw new Error('Error obteniendo el carrito');
    }
};


router.post('/', async (req, res) => {  
    try {
        const cart = await manager.addCart([]);
        res.status(200).json(cart);
    } catch (error) {
        console.error('Error al agregar un carrito:', error);
        res.status(500).json({ message: 'Error del servidor' });
    }
});

router.post('/:cid', async (req, res) => {
    try {
        const cartId = req.params.cid;
        const { productId, quantity } = req.body;

        // Obtener el carrito
        const cart = await cartModel.findById(cartId);

        if (!cart) {
            return res.status(404).json({ message: 'Carrito no encontrado' });
        }

        const productIndex = cart.products.findIndex(p => p.product.toString() === productId);

        if (productIndex !== -1) {
            cart.products[productIndex].quantity += quantity;
        } else {
            cart.products.push({ product: productId, quantity });
        }

        await cart.save();

        res.status(200).json(cart);
    } catch (error) {
        console.error('Error agregando un producto al carrito:', error);
        res.status(500).json({ message: 'Error del servidor' });
    }
});

router.get('/:cid', async (req, res) => {
    const cartId = req.params.cid;
    try {
        const cart = await getPopulatedCart(cartId);
        console.log('carrito obtenido:', cart);
        res.render('cart', {
            user: req.session.user,
            cart
        });
    } catch (error) {
        
        res.status(500).render('cart', { error: error.message });
    }
});

router.delete('/:cid/products/:pid', async (req, res) => {
    const { cid, pid } = req.params;
    try {
        const cart = await manager.deleteProductInCart(cid, pid);

        if (!cart) {
            return res.status(404).json({ message: 'Carrito no encontrado' });
        }

        res.status(200).json(cart);
    } catch (error) {
        res.status(500).json({ message: 'Error eliminando el producto del carrito', error });
    }
});

router.put('/:cid/products/:pid', async (req, res) => {
    try {
        const { quantity } = req.body;
        const cart = await CartManager.updateOneProduct(req.params.cid, { _id: req.params.pid, quantity });
        if (!cart) {
            return res.status(404).json({ status: 'error', message: 'Carro no existe' });
        }
        res.status(200).json({ status: 'success', message: 'Cantidad actualizada' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ status: 'error', message: 'Error del servidor' });
    }
});

router.delete('/:cid', async (req, res) => {
    try {
        const cart = await manager.deleteAllProductsInCart(req.params.cid);

        if (!cart) {
            return res.status(404).json({ message: 'Carrito no encontrado' });
        }

        res.status(200).json({ message: 'Carrito vaciado', cart });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error al vaciar el carrito', error });
    }
});

export default router;
