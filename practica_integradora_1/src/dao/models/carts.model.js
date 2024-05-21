import mongoose, { mongo } from "mongoose";

const cartCollection = "Carts";

const cartSchema = new mongoose.Schema({
  products: [
    {
      product: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Products",
      },

      quantity: { type: Number, default: 0 },
      default: [],
    },
  ],
});

const cartModel = mongoose.model(cartCollection, cartSchema);

export default cartModel;
