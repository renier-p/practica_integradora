import { Router } from 'express';
import ProductManager from '../Dao/mongomanagers/productManagerMongo.js';
import cartManager from '../Dao/mongomanagers/cartManagerMongo.js';
import { __dirname } from "../utils.js"
import { isAuthenticated, isNotAuthenticated } from '../middleware/auth.js';

const pm = new ProductManager()
const cm = new cartManager()
const router = Router()

let cart = []

router.get('/', async (req, res) => {
    try {
        let { limit, page, sort, category } = req.query
        const options = {
            page: Number(page) || 1,
            limit: Number(limit) || 10,
            sort: { price: Number(sort) },
            lean: true
        }
        if (!(options.sort.price === -1 || options.sort.price === 1)) {
            delete options.sort
        }
        const links = (products) => {
            let prevLink;
            let nextLink;
            if (req.originalUrl.includes('pagina')) {
                prevLink = products.hasPrevPage ? req.originalUrl.replace(`pagina=${products.page}`, `pagina=${products.prevPage}`) : null;
                nextLink = products.hasNextPage ? req.originalUrl.replace(`pagina=${products.page}`, `pagina=${products.nextPage}`) : null;
                return { prevLink, nextLink }
            }
            if (!req.originalUrl.includes('?')) {
                prevLink = products.hasPrevPage ? req.originalUrl.concat(`?pagina=${products.prevPage}`) : null;
                nextLink = products.hasNextPage ? req.originalUrl.concat(`?pagina=${products.nextPage}`) : null;
                return { prevLink, nextLink }
            }
            prevLink = products.hasPrevPage ? req.originalUrl.concat(`&pagina=${products.prevPage}`) : null;
            nextLink = products.hasNextPage ? req.originalUrl.concat(`&pagina=${products.nextPage}`) : null;
            return { prevLink, nextLink }

        }
        const categories = await pm.categories()
        const result = categories.some(categ => categ === category)
        if (result) {
            const products = await pm.getProducts({ category }, options);
            const { prevLink, nextLink } = links(products);
            const { totalPages, prevPage, nextPage, hasNextPage, hasPrevPage, docs, page } = products
            if (page > totalPages) return res.render('notFound', { pageNotFound: '/products' })
            return res.render('products', { user: req.session.user, products: docs, totalPages, prevPage, nextPage, hasNextPage, hasPrevPage, prevLink, nextLink, page, cart: cart.length });
        }
        const products = await pm.getProducts({}, options);
        const { totalPages, prevPage, nextPage, hasNextPage, hasPrevPage, docs } = products
        const { prevLink, nextLink } = links(products);
        if (page > totalPages) return res.render('notFound', { pageNotFound: '/products' })
        return res.render('products', { user: req.session.user, products: docs, totalPages, prevPage, nextPage, hasNextPage, hasPrevPage, prevLink, nextLink, page, cart: cart.length });
    } catch (error) {
        console.log(error);
    }
})

router.get('/products/:pid', async (req, res) => {
    try {
        const product = await pm.getProductById(req.params.pid);
        if (product) {
            res.render('details', { product });
        } else {
            res.status(404).send('Producto no encontrado');
        }
    } catch (err) {
        res.status(500).send('Error obteniendo el producto');
    }
})


router.post('/products', async (req, res) => {
    try {
        const { product, finishBuy } = req.body
        
        if (product) {
            if (product.quantity > 0) {
                const findId = cart.findIndex(productCart => productCart._id === product._id);
                (findId !== -1) ? cart[findId].quantity += product.quantity : cart.push(product)
            }
            else {
                return res.render('products', { message: 'Debe ser mayor que 0' })
            }
        }
        if (finishBuy) {
            await cm.addCart(cart)
            cart.splice(0, cart.length)
        }

        return res.render('products')
    } catch (error) {
        console.log(error);
    }
})

router.get("/realtimeproducts",(req,res)=>{
res.render("realtimeproducts")
})



router.get("/chat",(req,res)=>{
    res.render("chat")
})

router.get('/login', isNotAuthenticated, (req, res) => {
    res.render('login');
});

router.get('/register', isNotAuthenticated, (req, res) => {
    res.render('register');
});

router.get('/profile', isAuthenticated, (req, res) => {
    res.render('profile', { user: req.session.user });
});


export default router