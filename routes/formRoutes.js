// formRoutes.js

const express = require("express");
const router = express.Router();
const { createForm } = require("../controllers/foormControllers");

router.post("/", createForm);

module.exports = router;
