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

// Create new page / page name already checked for existence client side
router.post("/", async (req, res) => {
  try {
    const pageName = req.body.comparifyPageName;

    const { _id: creatorID } = jwt.verify(
      req.cookies["comparifyToken"],
      process.env.JWT_SECRET
    );

    const pageData = {
      creator: { _id: creatorID, ref: db.collection(USERS).doc(creatorID) },
      createdAt: Date.now(),
    };

    await db
      .collection(DB_COMPARIFYPAGE_COLLECTION)
      .doc(pageName)
      .set(pageData);

    await db
      .collection(USERS)
      .doc(creatorID)
      .update({
        comparifyPage: {
          exists: true,
          ref: db.collection(DB_COMPARIFYPAGE_COLLECTION).doc(pageName),
        },
      });

    res.send(`Created! Creator of the page: ${creatorID} / Page: ${pageName}`);

    // Stats
    await db
      .collection(STATS)
      .doc(DB_COMPARIFYPAGE_COLLECTION)
      .update({ count: firebase.firestore.FieldValue.increment(1) });
  } catch (error) {
    console.error(error);
  }
});

module.exports = router;
