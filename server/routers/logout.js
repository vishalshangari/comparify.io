const express = require("express");
const axios = require("axios");

const router = express.Router();

const { HOME_REDIRECT_URI } = require("../constants");

router.post("/", (req, res) => {
  console.log("logging out...");
  res.clearCookie("comparifyToken");
  res.redirect(HOME_REDIRECT_URI);
});

module.exports = router;
