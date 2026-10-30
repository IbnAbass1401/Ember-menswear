import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
  {
    name: { type: String, required: [true, "Product name is required"], trim: true, maxlength: 120 },
    slug: { type: String, unique: true, lowercase: true },
    description: { type: String, default: "" },
    price: { type: Number, required: [true, "Price is required"], min: 0 },
    category: {
      type: String,
      required: [true, "Category is required"],
      enum: ["Tops", "Bottoms", "Outerwear", "Footwear", "Accessories"],
    },
    images: [{ type: String }],
    sizes: [{ type: String }],
    stock: { type: Number, default: 0, min: 0 },
    featured: { type: Boolean, default: false },
  },
  { timestamps: true }
);

productSchema.pre("validate", function () {
  if (this.isModified("name")) {
    this.slug = this.name
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "");
  }
});

productSchema.index({ name: "text", description: "text" });
productSchema.index({ category: 1, price: 1 });

export default mongoose.model("Product", productSchema);