import { Router } from "express";
import Cart from "../dao/models/carts.model.js";
import Product from "../dao/models/products.model.js";

const cartsRouter = Router();

cartsRouter.get("/", async (req, res) => {
  try {
    const carts = await Cart.find().populate("products.product").exec();
    res.send({ status: "success", carts });
  } catch (error) {
    console.error("Error al obtener los carritos:", error);
    res.status(500).send({ error: "Error al obtener los carritos" });
  }
});

cartsRouter.post("/:cid/product", async (req, res) => {
  const { cid } = req.params;
  const { productId, quantity } = req.body;

  try {
    const cart = await Cart.findById(cid);
    if (!cart) {
      return res.status(404).send({ error: "Carrito no encontrado" });
    }

    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).send({ error: "Producto no encontrado" });
    }

    const productInCart = cart.products.find(
      (p) => p.product.toString() === productId
    );
    if (productInCart) {
      productInCart.quantity += quantity;
    } else {
      cart.products.push({ product: productId, quantity });
    }

    await cart.save();
    res.send({ status: "success", cart });
  } catch (error) {
    res.status(500).send({ error: "Error al agregar producto al carrito" });
  }
});

export default cartsRouter;
