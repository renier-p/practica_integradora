import mongoose from "mongoose";

const productCollection = "Productos";

const productSchema = new mongoose.Schema({
  titulo: { type: String, required: true, max: 100 },
  precio: { type: Number, required: true },
  disponible: { type: Boolean, required: true },
});

const productModel = mongoose.model(productCollection, productSchema);

export default productModel;
