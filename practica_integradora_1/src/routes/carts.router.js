import { Router } from "express";
import Cart from "../dao/models/carts.model.js";
import Product from "../dao/models/products.model.js";

// const cartsRouter = Router();

// cartsRouter.post("/api/carts/", async (req, res) => {
//   try {
//     await cartModel.create({ products: [] });
//     res.send({ message: "Se creó el carrito correctamente" });
//   } catch (error) {
//     console.log(error);
//   }
// });

// cartsRouter.get("/api/carts/:cid", async (req, res) => {
//   try {
//     const cartId = req.params.cid;
//     const cartContent = await cartModel.findOne({ _id: cartId });

//     if (cartContent) {
//       res.send({ cartContent });
//     } else {
//       res.send({ message: "El carrito con el ID ingresado no existe" });
//     }
//   } catch (error) {
//     console.log(error);
//   }
// });

// cartsRouter.post("/api/carts/:cid/product/:pid", async (req, res) => {
//   try {
//     const cartId = req.params.cid;
//     const productId = req.params.pid;

//     const cart = await cartModel.findOne({ _id: cartId });

//     if (cart) {
//       const cartContent = cart.products;

//       const productToCart = cartContent.some(
//         (product) => product === productId
//       );

//       if (!productToCart) {
//         const addToCart = await cartModel.create({ _id: cartId, quantity: 1 });

//         res.send({
//           message: "Producto agregado al carrito correctamente",
//           payload: addToCart,
//         });

//         // else {
//         //     const addToCart = await cartModel.updateOne({_id: productId, quantity: quantity + 1});
//         //     res.send({message: "Producto sumado al carrito correctamente", payload: addToCart});
//         // };
//       }
//     } else {
//       console.log("El carrito no existe");
//     }
//   } catch (error) {
//     console.log(error);
//   }
// });

// export default cartsRouter;

const cartsRouter = Router();

// cartsRouter.get("/api/carts/:cid", async (req, res) => {
//   try {
//     const cartId = req.params.cid;
//     const cartContent = await cartModel.findOne({ _id: cartId });

//     if (cartContent) {
//       res.send({ cartContent });
//     } else {
//       res.send({ message: "El carrito con el ID ingresado no existe" });
//     }
//   } catch (error) {
//     console.log(error);
//   }
// });

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
