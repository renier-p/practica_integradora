// import express from "express";
// import handlebars from "express-handlebars";
// import { Server } from "socket.io";
// import mongoose from "mongoose";
// import socketProducts from "./server/socketProducts.js";
// import productsRouter from "./routes/products.router.js";
// import cartsRouter from "./routes/carts.router.js";
// import viewsRouter from "./routes/views.router.js";
// import __dirname from "./utils.js";

// const app = express();
// const PORT = 8080;

// app.use(express.json());
// app.use(express.urlencoded({ extended: true }));
// app.use(express.static(__dirname + "/public"));

// mongoose.connect(
//   "mongodb+srv://rainer:2025@cluster0.1fy9xjh.mongodb.net/ecommerce?retryWrites=true&w=majority&appName=Cluster0"
// );

// app.engine("handlebars", handlebars.engine());
// app.set("views", __dirname + "/views");
// app.set("view engine", "handlebars");

// app.use("/", productsRouter);
// // app.use("/", messageRouter);
// app.use("/", cartsRouter);
// app.use("/", viewsRouter);

// let messages = [];

// // let messages = [];
// // io.on("connection", (socket) => {
// //   console.log("Nuevo cliente conectado");

// //   socket.on("message", (data) => {
// //     messages.push(data);
// //     io.emit("messageLogs", messages);
// //   });
// // });

// const httpServer = app.listen(PORT, () => {
//   console.log(`Server running on port ${PORT}`);
// });

// const socketServer = new Server(httpServer);

// socketServer.on("connection", (socket) => {
//   // console.log("Nuevo cliente conectado");
//   socket.on("message", (data) => {
//     messages.push(data);
//     socketServer.emit("messageLogs", messages);
//   });
//   socket.on("clearChat", () => {
//     messages = []; // Vacía el array de mensajes
//     socketServer.emit("messageLogs", messages); // Envía el array vacío a todos los clientes
//   });
// });
// socketProducts(socketServer);

import express from "express";
import handlebars from "express-handlebars";
import { Server } from "socket.io";
import mongoose from "mongoose";
import socketProducts from "./server/socketProducts.js";
import productsRouter from "./routes/products.router.js";
import cartsRouter from "./routes/carts.router.js";
import viewsRouter from "./routes/views.router.js";
import __dirname from "./utils.js";
import cartModel from "./dao/models/carts.model.js"; // Importar el modelo de carrito

const app = express();
const PORT = 8080;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(__dirname + "/public"));

mongoose.connect(
  "mongodb+srv://rainer:2025@cluster0.1fy9xjh.mongodb.net/ecommerce?retryWrites=true&w=majority&appName=Cluster0"
);

app.engine("handlebars", handlebars.engine());
app.set("views", __dirname + "/views");
app.set("view engine", "handlebars");

app.use("/", productsRouter);
// app.use("/", messageRouter);
app.use("/", cartsRouter);
app.use("/", viewsRouter);

const httpServer = app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

const socketServer = new Server(httpServer);

socketServer.on("connection", (socket) => {
  console.log("Nuevo cliente conectado");

  socket.on("getOrCreateCart", async (data, callback) => {
    try {
      let cart = await cartModel.findOne().sort({ _id: -1 }); // Encontrar el carrito más reciente
      if (!cart) {
        cart = await cartModel.create({ products: [] });
      }
      callback({ cartId: cart._id });
    } catch (error) {
      console.error("Error al obtener o crear carrito:", error);
      callback({ error: "Error al obtener o crear carrito" });
    }
  });

  socket.on("message", (data) => {
    messages.push(data);
    socketServer.emit("messageLogs", messages);
  });

  socket.on("clearChat", () => {
    messages = [];
    socketServer.emit("messageLogs", messages);
  });
});

socketProducts(socketServer);
