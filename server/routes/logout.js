// Log-out route
const express = require("express");

const router = express.Router();

const { RESPONSE_CODES } = require("../constants");

router.post("/", (req, res) => {
  console.log("logging out...");
  res.clearCookie("comparifyToken", { domain: "" });
  res.status(200).json({
    status: RESPONSE_CODES.NO_ACTIVE_SESSION,
    errorType: null,
  });
});

module.exports = router;
