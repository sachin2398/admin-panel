const Product = require("../models/productModel");
const upload = require("../middleware/upload");

exports.createProduct = async (req, res) => {
  try {
    console.log("Starting createProduct");
    const { productCategory, productName, productModels } = req.body;

    const parsedProductModels =
      typeof productModels === "string"
        ? JSON.parse(productModels)
        : productModels;

    const modelIds = parsedProductModels.map((model) => model.modelId);
    const uniqueModelIds = new Set(modelIds);

    if (uniqueModelIds.size !== modelIds.length) {
      console.warn("Duplicate model IDs found");
      return res.status(400).json({ error: "Duplicate model IDs found." });
    }

    const productImagePaths = req.files["productImage"]
      ? req.files["productImage"].map((file) => file.path)
      : [];
    const modelImagePaths = req.files["modelImages"]
      ? req.files["modelImages"].map((file) => file.path)
      : [];

    const productModelsWithImages = parsedProductModels.map((model, index) => {
      const modelImages = modelImagePaths.filter((filePath) =>
        filePath.includes(`model-${model.modelId}-`)
      );

      const formattedSpecifications = new Map();
      model.specifications.forEach((spec) => {
        formattedSpecifications.set(spec.key, spec.values);
      });

      return {
        ...model,
        images: modelImages,
        specifications: formattedSpecifications,
      };
    });

    const newProduct = new Product({
      productCategory,
      productName,
      productImage: productImagePaths,
      productModels: productModelsWithImages,
    });

    await newProduct.save();
    console.log("Product created successfully");
    res.status(201).json(newProduct);
  } catch (err) {
    console.error("Error creating product:", err.message);
    res.status(400).json({ error: err.message });
  }
};

exports.getProducts = async (req, res) => {
  try {
    console.log("Starting getProducts");
    const { name, category, page = 1, limit = 100 } = req.query;
    const query = {};
    if (name) query.productName = new RegExp(name, "i");
    if (category) query.productCategory = category;

    const products = await Product.find(query)
      .skip((page - 1) * limit)
      .limit(parseInt(limit));

    console.log("Products fetched successfully");
    res.status(200).json(products);
  } catch (err) {
    console.error("Error fetching products:", err.message);
    res.status(400).json({ error: err.message });
  }
};

exports.getProductById = async (req, res) => {
  try {
    console.log("Starting getProductById");
    const product = await Product.findById(req.params.id);
    if (!product) {
      console.warn("Product not found");
      return res.status(404).json({ error: "Product not found" });
    }

    console.log("Product fetched successfully");
    res.status(200).json(product);
  } catch (err) {
    console.error("Error fetching product:", err.message);
    res.status(400).json({ error: err.message });
  }
};

exports.getProductByName = async (req, res) => {
  try {
    console.log("Starting getProductByName");
    const product = await Product.findOne({ productName: req.params.name });
    if (!product) {
      console.warn("Product not found");
      return res.status(404).json({ error: "Product not found" });
    }
    console.log("Product fetched successfully");
    res.status(200).json(product);
  } catch (err) {
    console.error("Error fetching product:", err.message);
    res.status(400).json({ error: err.message });
  }
};

exports.getProductByModelId = async (req, res) => {
  try {
    console.log("Starting getProductByModelId");
    const product = await Product.findOne({
      "productModels.modelId": req.params.modelId,
    });
    if (!product) {
      console.warn("Product not found");
      return res.status(404).json({ error: "Product not found" });
    }
    const model = product.productModels.find(
      (model) => model.modelId === req.params.modelId
    );
    console.log("Product model fetched successfully");
    res.status(200).json(model);
  } catch (err) {
    console.error("Error fetching product model:", err.message);
    res.status(400).json({ error: err.message });
  }
};

exports.updateProduct = async (req, res) => {
  try {
    console.log("Starting updateProduct");
    const { productCategory, productName, productModels } = req.body;

    const parsedProductModels =
      typeof productModels === "string"
        ? JSON.parse(productModels)
        : productModels;

    const productImagePaths = req.files["productImage"]
      ? req.files["productImage"].map((file) => file.path)
      : [];
    const modelImagePaths = req.files["modelImages"]
      ? req.files["modelImages"].map((file) => file.path)
      : [];

    const product = await Product.findById(req.params.id);
    if (!product) {
      console.warn("Product not found");
      return res.status(404).json({ error: "Product not found" });
    }

    if (productCategory) product.productCategory = productCategory;
    if (productName) product.productName = productName;
    if (productImagePaths.length > 0) {
      product.productImage = productImagePaths;
    } else if (req.body.existingProductImage) {
      product.productImage = req.body.existingProductImage;
    }

    const updatedModels = parsedProductModels.map((model, index) => {
      const modelImages = modelImagePaths.filter((filePath) =>
        filePath.includes(`model-${model.modelId}-`)
      );

      const existingModel = product.productModels.find(
        (pm) => pm.modelId === model.modelId
      );

      const formattedSpecifications = new Map();
      model.specifications.forEach((spec) => {
        formattedSpecifications.set(spec.key, spec.values);
      });

      return {
        ...model,
        images:
          modelImages.length > 0
            ? modelImages
            : existingModel
            ? existingModel.images
            : [],
        specifications: formattedSpecifications,
      };
    });

    product.productModels = updatedModels;

    await product.save();
    console.log("Product updated successfully");
    res.status(200).json(product);
  } catch (err) {
    console.error("Error updating product:", err.message);
    res.status(400).json({ error: err.message });
  }
};

exports.deleteProduct = async (req, res) => {
  try {
    console.log("Starting deleteProduct");
    const deletedProduct = await Product.findByIdAndDelete(req.params.id);
    if (!deletedProduct) {
      console.warn("Product not found");
      return res.status(404).json({ error: "Product not found" });
    }
    console.log("Product deleted successfully");
    res.status(200).json({ message: "Product deleted successfully" });
  } catch (err) {
    console.error("Error deleting product:", err.message);
    res.status(400).json({ error: err.message });
  }
};
