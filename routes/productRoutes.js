const express = require("express");
const router = express.Router();
const productController = require("../controllers/productController");
const upload = require("../middleware/upload");

router.post(
  "/",
  upload.fields([
    { name: "productImage", maxCount: 10 },
    { name: "modelImages", maxCount: 20 },
  ]),
  productController.createProduct
);
router.get("/", productController.getProducts);
router.get("/:id", productController.getProductById);
router.get("/name/:name", productController.getProductByName);
router.get("/model/:modelId", productController.getProductByModelId);
router.put(
  "/:id",
  upload.fields([
    { name: "productImage", maxCount: 10 },
    { name: "modelImages", maxCount: 20 },
  ]),
  productController.updateProduct
);
router.delete("/:id", productController.deleteProduct);

module.exports = router;
