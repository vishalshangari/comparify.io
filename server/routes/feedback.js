// Feedback collection route
const express = require("express");
const { DB_FEEDBACK_COLLECTION } = require("../constants");
const router = express.Router();

// Services

// Database
const db = require("../db/firebase");
const firebase = require("firebase");

// Utils
const catchAsync = require("../utils/catchAsync");

// Create new page / page name already checked for existence client side
router.post(
  "/",
  catchAsync(async (req, res) => {
    console.log("feedback ping");
    const authorName = req.body.name;
    const authorEmail = req.body.email || null;
    const message = req.body.message;

    const date = new Date(Date.now()).toLocaleString();
    const datestr = date.split(",")[0];
    console.log(datestr);

    const data = {
      name: authorName,
      email: authorEmail,
      message: message,
      date: date,
    };

    await db
      .collection(DB_FEEDBACK_COLLECTION)
      .doc(date.replace("/", "-").replace("/", "-"))
      .set(data);

    res.send({
      status: "200",
      message: "Feedback sent",
    });
  })
);

// Error handling
router.use(function (err, req, res, next) {
  // LOG ERROR
  console.log(`Feedback error: `, err);
  let responseStatus, responseMessage;

  responseStatus = err.statusCode || 500;
  responseMessage = err.message || "Database error";

  res.status(responseStatus).json({
    status: responseStatus,
    message: responseMessage,
  });
});

module.exports = router;
