const nodemailer = require("nodemailer");
const Form = require("../models/formModel");

exports.createForm = async (req, res) => {
  try {
    console.log("Starting form creation process");

    const { name, companyName, phoneNumber, clientEmail, city, message } =
      req.body;

    // Validate the input data
    if (!name || !phoneNumber || !clientEmail || !city || !message) {
      console.warn("Validation failed: Missing required fields");
      return res
        .status(400)
        .json({ message: "All fields except Company Name are required." });
    }

    if (!/^\d{10}$/.test(phoneNumber)) {
      console.warn("Validation failed: Invalid phone number");
      return res
        .status(400)
        .json({ message: "Please enter a valid 10-digit phone number." });
    }

    if (!/^\S+@\S+\.\S+$/.test(clientEmail)) {
      console.warn("Validation failed: Invalid email address");
      return res
        .status(400)
        .json({ message: "Please enter a valid email address." });
    }

    const form = new Form({
      name,
      companyName,
      phoneNumber,
      clientEmail,
      city,
      message,
    });

    await form.save();
    console.log("Form saved to the database");

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: `${clientEmail},mahtopankaj300@gmail.com`,
      subject: "Website Inquiry Submission Confirmation",
      html: `
        <div style="font-family: Arial, sans-serif; color: #333;">
          <h2 style="color: #4CAF50;">Dear ${name},</h2>
          <p>Thank you for reaching out to us. We have received your inquiry. Our team will review the details and get back to you shortly.</p>
          <h3 style="color: #FF5733;">Here is a copy of the details you submitted:</h3>
          <ul>
            <li><strong>Name:</strong> ${name}</li>
            <li><strong>Company Name:</strong> ${companyName || "N/A"}</li>
            <li><strong>Phone Number:</strong> ${phoneNumber}</li>
            <li><strong>Email:</strong> ${clientEmail}</li>
            <li><strong>City:</strong> ${city}</li>
            <li><strong>Message:</strong> ${message}</li>
          </ul>
          <p>We appreciate your interest in our services and look forward to assisting you.</p>
          <p>Best regards,</p>
          <h3 style="color: #4CAF50;">The Nature Hygiene Team</h3>
          <hr>
          <p>If you have any additional questions or need further assistance, please contact us at <a href="mailto:mahtopankaj300@gmail.com" style="color: #1E90FF;">mahtopankaj300@gmail.com</a> or call us at <span style="color: #1E90FF;">91-9205920583</span>.</p>
        </div>
      `,
    };

    await transporter.sendMail(mailOptions);
    console.log("Confirmation email sent");

    res.status(201).json(form);
  } catch (error) {
    console.error("Error creating form", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
};
