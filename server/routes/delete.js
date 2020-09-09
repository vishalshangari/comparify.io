const express = require("express");
const {
  CLIENT_ID,
  CLIENT_SECRET,
  DB_COMPARIFYPAGE_COLLECTION,
  USERS,
  STATS,
} = require("../constants");
const router = express.Router();
const queryString = require("query-string");
const axios = require("axios");
const jwt = require("jsonwebtoken");

// Services

// Database
const db = require("../db/firebase");
const firebase = require("firebase");
const FieldValue = firebase.firestore.FieldValue;

// Utils
const catchAsync = require("../utils/catchAsync");

// Create new page / page name already checked for existence client side
router.delete(
  "/",
  catchAsync(async (req, res) => {
    const pageName = req.body.comparifyPageName;

    const { _id: creatorID } = jwt.verify(
      req.cookies["comparifyToken"],
      process.env.JWT_SECRET
    );

    // Delete page (document) from comparifyPages collection
    await db.collection(DB_COMPARIFYPAGE_COLLECTION).doc(pageName).delete();

    // Delete page from user info
    await db.collection(USERS).doc(creatorID).update({
      comparifyPage: FieldValue.delete(),
    });

    res.send({
      status: "200",
      message: "Comparify page successfully deleted",
    });

    // Stats
    await db
      .collection(STATS)
      .doc(DB_COMPARIFYPAGE_COLLECTION)
      .update({ count: FieldValue.increment(-1) });
  })
);

// Error handling
router.use(function (err, req, res, next) {
  // LOG ERROR
  console.log(`deletion error: `, err);
  let responseStatus, responseMessage;

  responseStatus = err.statusCode || 500;
  responseMessage = err.message || "Database error";

  res.status(responseStatus).json({
    status: responseStatus,
    message: responseMessage,
  });
});

module.exports = router;
