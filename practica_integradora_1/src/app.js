import express from "express";
import mongoose from "mongoose";
import userRouter from "../src/routes/user.router.js";
import productRouter from "../src/routes/products.router.js";
import messageRouter from "../src/routes/message.router.js";
import cartRouter from "../src/routes/cart.router.js";
import viewsRouter from "../src/routes/views.router.js";
import handlebars from "express-handlebars";
import { Server } from "socket.io";
import __dirname from "./utils.js";
import socketProducts from "./server/socketProducts.js";

const app = express();
const PORT = 8080;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(__dirname + "public"));

mongoose
  .connect(
    "mongodb+srv://rainer:2025@cluster0.1fy9xjh.mongodb.net/ecommerce?retryWrites=true&w=majority&appName=Cluster0"
  )
  .then(() => {
    console.log("Conectado a la base de datos");
  })
  .catch((error) => console.error("Error en la conexion", error));

app.engine("handlebars", handlebars.engine());
app.set("views", __dirname + "/api/views");
app.set("view engine", "handlebars");

app.use("/api/users", userRouter);
app.use("/api/products", productRouter);
app.use("/api/message", messageRouter);
app.use("/api/cart", cartRouter);
app.use("/", viewsRouter);

const httpServer = app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

const socketServer = new Server(httpServer);
socketProducts(socketServer);
