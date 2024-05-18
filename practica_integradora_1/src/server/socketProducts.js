// import productModel from "../dao/models/products.model.js";

// const socketProducts = (socketServer) => {
//   socketServer.on("connection", (socket) => {
//     console.log("Cliente conectado");

//     socket.on("newProduct", async (data) => {
//       data.price = parseInt(data.price);
//       data.stock = parseInt(data.stock);

//       await productModel.create(data);
//     });

//     socket.on("deleteProduct", async (productId) => {
//       await productModel.deleteOne({ _id: productId });
//     });
//   });
// };

// export default socketProducts;

//------------------

// import productModel from "../dao/models/products.model.js";
// import cartModel from "../dao/models/carts.model.js"; // Importar el modelo de carrito

// const socketProducts = (socketServer) => {
//   socketServer.on("connection", (socket) => {
//     console.log("Cliente conectado");

//     socket.on("newProduct", async (data) => {
//       try {
//         data.price = parseInt(data.price);
//         data.stock = parseInt(data.stock);

//         const newProduct = await productModel.create(data);

//         // Asumiendo que el ID del carrito se envía en `data.cartId`
//         const cartId = data.cartId;
//         if (cartId) {
//           const cart = await cartModel.findById(cartId);
//           if (cart) {
//             cart.products.push({ product: newProduct._id, quantity: 1 });
//             await cart.save();
//           }
//         }

//         // Emitir evento para notificar a los clientes sobre el nuevo producto
//         socketServer.emit("productAdded", newProduct);
//       } catch (error) {
//         console.error("Error al agregar producto:", error);
//       }
//     });

//     socket.on("deleteProduct", async (productId) => {
//       try {
//         await productModel.deleteOne({ _id: productId });

//         // Emitir evento para notificar a los clientes sobre la eliminación del producto
//         socketServer.emit("productDeleted", productId);
//       } catch (error) {
//         console.error("Error al eliminar producto:", error);
//       }
//     });
//   });
// };

// export default socketProducts;

//-------------

import productModel from "../dao/models/products.model.js";
import cartModel from "../dao/models/carts.model.js"; // Importar el modelo de carrito

const socketProducts = (socketServer) => {
  socketServer.on("connection", (socket) => {
    console.log("Cliente conectado");

    socket.on("newProduct", async (data) => {
      try {
        data.price = parseInt(data.price);
        data.stock = parseInt(data.stock);

        // Crear un nuevo producto
        const newProduct = await productModel.create(data);

        // Buscar el carrito activo más reciente o crear uno nuevo
        let cart;
        if (!data.cartId) {
          cart = await cartModel.findOne().sort({ _id: -1 }); // Encontrar el carrito más reciente
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

        // Emitir evento para notificar a los clientes sobre el nuevo producto
        socketServer.emit("productAdded", newProduct);
      } catch (error) {
        console.error("Error al agregar producto:", error);
      }
    });

    socket.on("deleteProduct", async (productId) => {
      try {
        await productModel.deleteOne({ _id: productId });

        // Emitir evento para notificar a los clientes sobre la eliminación del producto
        socketServer.emit("productDeleted", productId);
      } catch (error) {
        console.error("Error al eliminar producto:", error);
      }
    });
  });
};

export default socketProducts;
