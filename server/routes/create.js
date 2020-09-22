// Comparify page creation route
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

// Utils
const catchAsync = require("../utils/catchAsync");
const AppError = require("../models/AppError");

// Create new page / page name already checked for existence client side
router.post(
  "/",
  catchAsync(async (req, res) => {
    const pageName = req.body.comparifyPageName;

    const { _id: creatorID } = jwt.verify(
      req.cookies["comparifyToken"],
      process.env.JWT_SECRET
    );

    const pageData = {
      creator: { _id: creatorID, ref: db.collection(USERS).doc(creatorID) },
      createdAt: Date.now(),
    };

    const comparifyPageRef = db
      .collection(DB_COMPARIFYPAGE_COLLECTION)
      .doc(pageName);

    const comparifyPageDoc = await comparifyPageRef.get();

    if (comparifyPageDoc.exists) {
      throw new AppError(
        "This page already exists. Please try a different name.",
        500
      );
    }

    await comparifyPageRef.set(pageData);

    await db
      .collection(USERS)
      .doc(creatorID)
      .update({
        comparifyPage: {
          exists: true,
          ref: db.collection(DB_COMPARIFYPAGE_COLLECTION).doc(pageName),
          id: pageName,
        },
      });

    res.status(201).send({
      status: "201",
      message: "Comparify page successfully created",
    });

    // Stats
    await db
      .collection(STATS)
      .doc(DB_COMPARIFYPAGE_COLLECTION)
      .update({ count: firebase.firestore.FieldValue.increment(1) });
  })
);

// Error handling
router.use(function (err, req, res, next) {
  // LOG ERROR
  console.log(`creation error: `, err);
  let responseStatus, responseMessage;

  responseStatus = err.statusCode || 500;
  responseMessage = err.message || "Database error";

  res.status(responseStatus).json({
    status: responseStatus,
    message: responseMessage,
  });
});

module.exports = router;
