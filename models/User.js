// const mongoose = require("mongoose");
// const bcrypt = require("bcryptjs");

// const UserSchema = new mongoose.Schema({
//   userName: {
//     type: String,
//     required: true,
//     unique: true,
//   },
//   email: {
//     type: String,
//     required: true,
//     unique: true,
//   },
//   password: {
//     type: String,
//     required: true,
//   },
//   role: {
//     type: String,
//     enum: ["admin", "manager"],
//     default: "manager",
//     required: true,
//   },
//   image: {
//     type: String,
//   },
// });

// UserSchema.pre("save", async function (next) {
//   if (!this.isModified("password")) {
//     return next();
//   }
//   try {
//     const salt = await bcrypt.genSalt(10);
//     this.password = await bcrypt.hash(this.password, salt);
//     next();
//   } catch (err) {
//     next(err);
//   }
// });

// UserSchema.methods.comparePassword = function (candidatePassword) {
//   return bcrypt.compare(candidatePassword, this.password);
// };

// module.exports = mongoose.model("User", UserSchema);




const mongoose = require('mongoose');
// mongoose.connect('mongodb://127.0.0.1:27017/revision');

module.exports = mongoose.model('users',
 {name:String, email: String, password: String, otp: Number,role: {
    type: String,
    enum: ['superadmin', 'supervisor', 'agent'],
    default: 'agent' // Set a default role if not specified
  } });
