const express = require("express");
const axios = require("axios");

const router = express.Router();

const { HOME_REDIRECT_URI, COOKIE_DOMAIN } = require("../constants");

router.post("/", (req, res) => {
  console.log("logging out...");
  res.clearCookie("comparifyToken", { domain: "" });
  res.status(200).send({ status: "success" });
});

module.exports = router;
