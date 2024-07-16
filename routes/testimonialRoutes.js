const express = require("express");
const router = express.Router();
const testimonialController = require("../controllers/testimonialController");
const uploadTestimonial = require("../middleware/uploadTestimonial");

router.post(
  "/",
  uploadTestimonial.single("clientProfile"),
  testimonialController.createTestimonial
);
router.get("/", testimonialController.getTestimonials);
router.get("/:id", testimonialController.getTestimonialById);
router.put(
  "/:id",
  uploadTestimonial.single("clientProfile"),
  testimonialController.updateTestimonial
);
router.delete("/:id", testimonialController.deleteTestimonial);

module.exports = router;
