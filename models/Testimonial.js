const mongoose = require("mongoose");

const TestimonialSchema = new mongoose.Schema({
  clientName: {
    type: String,
    required: true,
  },
  clientProfile: {
    type: String,
    required: true,
  },
  occupation: {
    type: String,
    required: true,
  },
  review: {
    type: String,
    required: true,
  },
  rating: {
    type: Number,
    required: true,
    min: 1,
    max: 5,
  },
});

module.exports = mongoose.model("Testimonial", TestimonialSchema);
