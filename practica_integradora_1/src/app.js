import express from "express";
import mongoose from "mongoose";
import userRouter from "./routes/user.router.js";
import productRouter from "./routes/products.router.js";
import messageRouter from "./routes/message.router.js";

const app = express();
const PORT = 8080;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

mongoose
  .connect(
    "mongodb+srv://rainer:2025@cluster0.1fy9xjh.mongodb.net/ecommerce?retryWrites=true&w=majority&appName=Cluster0"
  )
  .then(() => {
    console.log("Conectado a la base de datos");
  })
  .catch((error) => console.error("Error en la conexion", error));

app.use("/api/users", userRouter);
app.use("/api/products", productRouter);
app.use("/api/message", messageRouter);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
