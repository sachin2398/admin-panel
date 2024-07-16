const mongoose = require("mongoose");

const ProductSchema = new mongoose.Schema({
  productCategory: {
    type: [String],
    enum: ["Entrance Automation", "Hygiene Automation"],
    required: true,
  },
  productName: {
    type: String,
    required: true,
  },
  productImage: {
    type: [String], // Array to support multiple images
    required: true,
  },
  productModels: [
    {
      modelId: {
        type: String,
        required: true,
        unique: true,
      },
      modelName: {
        type: String,
        required: true,
      },
      images: [String],
      descriptions: [String],
      specifications: {
        type: Map,
        of: [String],
      },
    },
  ],
});

module.exports = mongoose.model("Product", ProductSchema);
