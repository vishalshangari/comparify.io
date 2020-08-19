const express = require("express");
const axios = require("axios");

const router = express.Router();

const {
  HOME_REDIRECT_URI,
  COOKIE_DOMAIN,
  RESPONSE_CODES,
} = require("../constants");

router.post("/", (req, res) => {
  console.log("logging out...");
  res.clearCookie("comparifyToken", { domain: "" });
  res.status(200).json({
    status: RESPONSE_CODES.NO_ACTIVE_SESSION,
    errorType: null,
  });
});

module.exports = router;
