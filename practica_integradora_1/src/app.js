import express from "express";
import handlebars from "express-handlebars";
import { Server } from "socket.io";
import mongoose from "mongoose";
import socketProducts from "./server/socketProducts.js";
import productsRouter from "./routes/products.router.js";
import cartsRouter from "./routes/carts.router.js";
import viewsRouter from "./routes/views.router.js";
import __dirname from "./utils.js";
import dotenv from "dotenv";
dotenv.config();
console.log(process.env.MONGO_URL);

const app = express();
const PORT = 8080;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(__dirname + "/public"));

mongoose
  .connect(process.env.MONGO_URL)
  .then(() => {
    console.log("Conectado a la base de datos");
  })
  .catch((error) => console.error("Error en la conexion", error));

app.engine("handlebars", handlebars.engine());
app.set("views", __dirname + "/views");
app.set("view engine", "handlebars");

app.use("/api/products", productsRouter);
app.use("/api/carts", cartsRouter);
app.use("/", viewsRouter);

const httpServer = app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

const socketServer = new Server(httpServer);

socketServer.on("connection", (socket) => {
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
