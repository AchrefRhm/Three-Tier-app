const express = require("express");
const { generateCV } = require("../controllers/Cv");

const router = express.Router();

router.post("/generate", generateCV);

module.exports = router;
