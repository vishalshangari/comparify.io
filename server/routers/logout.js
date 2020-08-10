const express = require("express");
const axios = require("axios");

const router = express.Router();

const { HOME_REDIRECT_URI, COOKIE_DOMAIN } = require("../constants");

router.post("/", (req, res) => {
  console.log("logging out...");
  res.clearCookie("comparifyToken", COOKIE_DOMAIN);
  res.redirect(HOME_REDIRECT_URI + "/api");
});

module.exports = router;
