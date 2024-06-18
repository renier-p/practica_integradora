import CartModel from "../models/carts.model.js";

export default class CartManager {
    getCarts = async () => {
        try {
            const carts = await CartModel.find().populate('products.product').lean();
            return carts;
        } catch (err) {
            console.error('Error obteniendo los carritos:', err.message);
            return [];
        }
    };

    getCartById = async (id) => {
        try {
            const cart = await CartModel.findById(id).populate('products').lean();
            return cart;
        } catch (err) {
            console.error('Error al obtener el carrito por ID:', err.message);
            return null;
        }
    }

    addCart = async (products) => {
        try {
            const existingCart = await CartModel.findOne().lean();
            if (existingCart) {
                return existingCart;
            }
            const cart = await CartModel.create({ products });
            return cart;
        } catch (err) {
            console.error('Error creando el carrito:', err.message);
            return null;
        }
    }
    

    addProductToCart = async (cid, product, quantity) => {
        try {
            const cart = await CartModel.findOneAndUpdate(
                { _id: cid },
                { $addToSet: { products: { product, quantity } } },
                { new: true }
            ).populate('products.product')
            return cart
        } catch (err) {
            console.error('Error agregando el producto al carrito:', err.message)
            return null
        }
    }

    deleteProductInCart = async (cid, pid) => {
        try {
            const cart = await CartModel.findById(cid);

            if (!cart) {
                return null;
            }

            cart.products = cart.products.filter(item => item.product.toString() !== pid);

            await cart.save();
            return cart;
        } catch (err) {
            console.error('Error eliiminando el producto del carrito:', err.message);
            return null;
        }
    }
    updateCart = async (cartId, products) => {
        try {
            const cart = await CartModel.findByIdAndUpdate(cartId, { products }, { new: true });
            return cart;
        } catch (err) {
            console.error('Error actualizando el carrito:', err.message);
            return null;
        }
    }

    updateOneProduct = async (cid, product) => {
        try {
            const cart = await CartModel.findOneAndUpdate(
                { _id: cid, "products._id": product._id },
                { $set: { "products.$.quantity": product.quantity } },
                { new: true }
            );
            return cart;
        } catch (err) {
            console.error('Error actualizando la cantidad de producto en el carrito:', err.message);
            return null;
        }
    }

    deleteAllProductsInCart = async (cid) => {
        try {
            const cart = await CartModel.findById(cid);

            if (!cart) {
                return null;
            }

            cart.products = [];

            await cart.save();
            return cart;
        } catch (err) {
            console.error('Error eliminando los productos del carrito:', err.message);
            return null;
        }
    }
}

