const userModel = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const secretKey = "your-secret-key";
const saltRounds = 10;

module.exports.signup = async (req, res) => {
  try {
    console.log("Starting signup process");

    // Check if the user already exists
    const existingUser = await userModel.findOne({
      $or: [
        { name: { $regex: new RegExp(req.body.name, "i") } },
        { email: { $regex: new RegExp(req.body.email, "i") } },
      ],
    });

    if (existingUser) {
      console.warn("User already exists");
      return res.status(400).json({
        code: 400,
        message: "User already exists",
      });
    }

    if (req.body.role.toLowerCase() === "superadmin") {
      const superAdminExists = await userModel.exists({ role: "superadmin" });
      if (superAdminExists) {
        console.warn("Superadmin already exists");
        return res.status(400).json({
          code: 400,
          message: "Superadmin already exists",
        });
      }
    }

    // User does not exist, so proceed with registration
    const hashedPassword = await bcrypt.hash(req.body.password, saltRounds);

    const newUser = new userModel({
      name: req.body.name,
      email: req.body.email,
      password: hashedPassword, // Save the hashed password
      role: req.body.role,
    });

    await newUser.save();

    console.log("Signup success");
    return res.status(200).json({ code: 200, message: "Signup success" });
  } catch (error) {
    console.error("Signup failed", error.message);
    return res
      .status(500)
      .json({ code: 500, message: "Signup failed", error: error.message });
  }
};

module.exports.login = async (req, res) => {
  try {
    console.log("Starting login process");

    const { name, password } = req.body;

    // Find a user by name in the userModel
    const user = await userModel.findOne({ name });

    if (!user) {
      console.warn("User Not Found");
      return res.status(404).json({ code: 404, message: "User Not Found" });
    }

    // Compare the provided password with the hashed password in the database
    const passwordMatch = await bcrypt.compare(password, user.password);

    if (!passwordMatch) {
      console.warn("Password Wrong");
      return res.status(404).json({ code: 404, message: "Password Wrong" });
    }

    // Passwords match, generate JWT token
    const token = jwt.sign({ userId: user._id, name: user.name }, secretKey, {
      expiresIn: "1h",
    });

    console.log("Login successful");
    return res.status(200).json({
      code: 200,
      message: "Login successful",
      token,
      name: user.name,
      role: user.role,
      email: user.email,
    });
  } catch (error) {
    console.error("Server Error", error.message);
    return res
      .status(500)
      .json({ code: 500, message: "Server Error", error: error.message });
  }
};
