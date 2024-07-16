const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const path = require("path");
const bodyParser = require("body-parser");

const config = require("./config/config");
const productRoutes = require("./routes/productRoutes");
const UserController = require("./controllers/user");
const testimonialRoutes = require("./routes/testimonialRoutes");
const formRoutes = require("./routes/formRoutes");

const app = express();

// Increase payload size limit
app.use(express.json({ limit: '50mb' }));
app.use(bodyParser.urlencoded({ extended: true }));

// // Define allowed origins
// const allowedOrigins = [
//   "http://localhost:3000",
//   "https://nature-hg-faui.vercel.app",
// ];

// // CORS options

// const corsOptions = {
//   origin: function (origin, callback) {
//     if (!origin || allowedOrigins.includes(origin)) {
//       callback(null, true);
//     } else {
//       callback(new Error("Not allowed by CORS"));
//     }
//   },
//   methods: "GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS",
//   credentials: true,
//   preflightContinue: false,
//   optionsSuccessStatus: 204,
// };

// // Use CORS middleware with the specified options
// app.use(cors(corsOptions));
const allowedOrigins = [
  "http://localhost:3000",
  "https://nature-hg-faui.vercel.app",
];

const corsOptions = {
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  methods: "GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS",
  credentials: true,
  preflightContinue: false,
  optionsSuccessStatus: 204,
};

app.use(cors(corsOptions));


app.use("/uploads", express.static(path.join(__dirname, "uploads")));

mongoose
  .connect(config.uri)
  .then(() => console.log("mongoDB connected"))
  .catch((err) => {
    console.log(err);
  });

app.get("/", (req, res) => {
  res.send("api is working now");
});

app.use("/api/products", productRoutes);

app.post("/signup", UserController.signup);

app.post("/login", UserController.login);

app.use("/testimonials", testimonialRoutes);
app.use("/form", formRoutes);


const PORT = config.port;
app.listen(PORT, () => {
  console.log(`port is running on localhost ${PORT}`);
});
