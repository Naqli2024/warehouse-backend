const mongoose = require("mongoose");

const subCategorySchema = new mongoose.Schema({
  name: { type: String, required: true },
  productList: { type: [String], default: [] },
});

const categorySchema = new mongoose.Schema(
  {
    categoryName: {
      type: String,
      required: true,
      unique: true,
      trim: true
    },
    subCategories: [subCategorySchema],
  },
  { timestamps: true }
);

const category = mongoose.model("category", categorySchema);
module.exports = category;
