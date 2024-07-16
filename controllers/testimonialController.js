const Testimonial = require("../models/Testimonial");

// exports.createTestimonial = async (req, res) => {
//   try {
//     console.log("Starting createTestimonial");
//     const { clientName, occupation, review, rating } = req.body;
//     const testimonial = new Testimonial({
//       clientName,
//       clientProfile: req.file.path,
//       occupation,
//       review,
//       rating,
//     });
//     await testimonial.save();
//     console.log("Testimonial created successfully");
//     res.status(201).json(testimonial);
//   } catch (err) {
//     console.error("Error creating testimonial:", err.message);
//     res.status(400).json({ error: err.message });
//   }
// };

exports.createTestimonial = async (req, res) => {
  try {
    console.log("Starting createTestimonial");
    const { clientName, occupation, review, rating } = req.body;
    const testimonial = new Testimonial({
      clientName,
      clientProfile: req.file.path,
      occupation,
      review,
      rating,
    });
    await testimonial.save();
    console.log("Testimonial created successfully");
    res.status(201).json(testimonial);
  } catch (err) {
    console.error("Error creating testimonial:", err.message);
    res.status(400).json({ error: err.message });
  }
};

exports.getTestimonials = async (req, res) => {
  try {
    console.log("Starting getTestimonials");
    const testimonials = await Testimonial.find();
    console.log("Testimonials fetched successfully");
    res.status(200).json(testimonials);
  } catch (err) {
    console.error("Error fetching testimonials:", err.message);
    res.status(400).json({ error: err.message });
  }
};

exports.getTestimonialById = async (req, res) => {
  try {
    console.log("Starting getTestimonialById");
    const testimonial = await Testimonial.findById(req.params.id);
    if (!testimonial) {
      console.warn("Testimonial not found");
      return res.status(404).json({ error: "Testimonial not found" });
    }
    console.log("Testimonial fetched successfully");
    res.status(200).json(testimonial);
  } catch (err) {
    console.error("Error fetching testimonial:", err.message);
    res.status(400).json({ error: err.message });
  }
};

exports.updateTestimonial = async (req, res) => {
  try {
    console.log("Starting updateTestimonial");
    const { clientName, occupation, review, rating } = req.body;
    const updateData = {
      clientName,
      occupation,
      review,
      rating,
    };
    if (req.file) {
      updateData.clientProfile = req.file.path;
    }
    const updatedTestimonial = await Testimonial.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true }
    );
    if (!updatedTestimonial) {
      console.warn("Testimonial not found");
      return res.status(404).json({ error: "Testimonial not found" });
    }
    console.log("Testimonial updated successfully");
    res.status(200).json(updatedTestimonial);
  } catch (err) {
    console.error("Error updating testimonial:", err.message);
    res.status(400).json({ error: err.message });
  }
};

exports.deleteTestimonial = async (req, res) => {
  try {
    console.log("Starting deleteTestimonial");
    const deletedTestimonial = await Testimonial.findByIdAndDelete(
      req.params.id
    );
    if (!deletedTestimonial) {
      console.warn("Testimonial not found");
      return res.status(404).json({ error: "Testimonial not found" });
    }
    console.log("Testimonial deleted successfully");
    res.status(200).json({ message: "Testimonial deleted successfully" });
  } catch (err) {
    console.error("Error deleting testimonial:", err.message);
    res.status(400).json({ error: err.message });
  }
};
