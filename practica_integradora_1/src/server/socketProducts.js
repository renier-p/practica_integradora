import productModel from "../dao/models/products.model.js";
import cartModel from "../dao/models/carts.model.js";

const socketProducts = (socketServer) => {
  socketServer.on("connection", (socket) => {
    console.log("Cliente conectado");

    socket.on("newProduct", async (data) => {
      try {
        data.price = parseInt(data.price);
        data.stock = parseInt(data.stock);

        const newProduct = await productModel.create(data);

        let cart;
        if (!data.cartId) {
          cart = await cartModel.findOne().sort({ _id: -1 });
          reciente;
          if (!cart) {
            cart = await cartModel.create({ products: [] });
          }
        } else {
          cart = await cartModel.findById(data.cartId);
        }

        if (cart) {
          cart.products.push({ product: newProduct._id, quantity: 1 });
          await cart.save();
        }

        socketServer.emit("productAdded", newProduct);
      } catch (error) {
        console.error("Error al agregar producto:", error);
      }
    });

    socket.on("deleteProduct", async (productId) => {
      try {
        await productModel.deleteOne({ _id: productId });

        socketServer.emit("productDeleted", productId);
      } catch (error) {
        console.error("Error al eliminar producto:", error);
      }
    });
  });
};

export default socketProducts;
