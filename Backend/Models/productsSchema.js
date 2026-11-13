import mongoose from "mongoose";

//Product Schema
const productSchema = new mongoose.Schema({
  name: {
    type: String,
    requried: true,
  },
  price: {
    type: Number,
    requried: true,
  },
  description: {
    type: String,
    required: true,
  },
  status: {
    type: String,
    enum: ["Active", "Out of Stock"],
    default: "Active",
  },
  deleted: {
    type: Boolean,
    default: false,
  },
  quantity: {
    type: Number,
    required: true,
  },
  image: {
    type: String,
    required: false,
  },
  discount: {
    type: Number,
    required: false,
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User"
  }
}, { timestamps: true });

//Model
const Products = mongoose.model("Products", productSchema);
export default Products;