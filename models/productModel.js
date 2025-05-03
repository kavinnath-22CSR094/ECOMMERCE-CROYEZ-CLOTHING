import mongoose from "mongoose";

const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  price: { type: Number, required: true },
  category: { type: mongoose.Schema.Types.ObjectId, ref: "Category", required: true },
  size: { type: [String], required: true },
  color: { type: [String], required: true },
  pattern: { type: [String], required: true },
  description: { type: String },
  stock: { type: Number, default: 0 },
  photo: {
    data: Buffer,
    contentType: String,
  },
  slug: { type: String, unique: true },
});

export default mongoose.model("Product", productSchema);