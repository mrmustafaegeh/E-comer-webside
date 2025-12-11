import mongoose from "mongoose";

const ProductSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: String,
  price: Number,
  offerPrice: Number,
  rating: Number,
  category: String,
  image: String,
  stock: Number,
  numReviews: Number,
  featured: Boolean,
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.models.Product ||
  mongoose.model("Product", ProductSchema);
