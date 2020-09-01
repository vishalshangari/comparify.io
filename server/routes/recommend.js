const express = require("express");
const { DB_COMPARIFYPAGE_COLLECTION, USERS, STATS } = require("../constants");
const router = express.Router();
const jwt = require("jsonwebtoken");

// Utils
const compareTopGenres = require("../utils/compareTopGenres");
const compareTopArtists = require("../utils/compareTopArtists");
const compareTopTracks = require("../utils/compareTopTracks");

// Database
const db = require("../db/firebase");
const firebase = require("firebase");

// Create new page / page name already checked for existence client side
router.get("/:comparifyPageName", async (req, res) => {
  try {
    accessToken = await getValidAccessToken(
      DB_SITE_CONFIGURATIONS,
      DB_SITE_TOKENS
    );
  } catch (error) {
    console.error(error);
    res.redirect(
      HOME_REDIRECT_URI +
        "/" +
        queryString.stringify({
          error: "unkown_error",
        })
    );
  }

  try {
  } catch (error) {
    console.error(error);
  }
});

module.exports = router;
