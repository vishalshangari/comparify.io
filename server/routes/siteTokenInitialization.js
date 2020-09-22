// Initialize client tokens for public API requests to Spotify
const express = require("express");
const axios = require("axios");
const queryString = require("query-string");

// Firebase db
const db = require("../db/firebase");
const firebase = require("firebase");

// Utils
const generateRandomString = require("../utils/generateRandomString");

// Constants
const {
  HOME_REDIRECT_URI,
  SPOTIFY_AUTH_URL,
  CLIENT_ID,
  CLIENT_SECRET,
  SPOTIFY_AUTH_STATE_KEY,
  SPOTIFY_GET_AUTH_TOKEN_URL,
  DB_SITE_CONFIGURATIONS,
  DB_SITE_TOKENS,
  PRIVATE_TOKEN_ENDPOINTS_ENDPOINT,
} = require("../constants");

const router = express.Router();

router.get("/site-tokens-initialize", (req, res) => {
  const state = generateRandomString(16);
  res.cookie(SPOTIFY_AUTH_STATE_KEY, state);

  res.redirect(
    SPOTIFY_AUTH_URL +
      queryString.stringify({
        response_type: "code",
        client_id: CLIENT_ID,
        redirect_uri: `http://localhost:3001/api/private/${PRIVATE_TOKEN_ENDPOINTS_ENDPOINT}/site-token`,
        state: state,
      })
  );
});

router.get("/site-token", async (req, res) => {
  const code = req.query.code || null;
  const state = req.query.state || null;
  const storedState = req.cookies ? req.cookies[SPOTIFY_AUTH_STATE_KEY] : null;

  // If state sent back from Spotify API does not match local state, reject
  // TODO: better error handler for state mismatch
  if (state === null || state !== storedState) {
    console.log("oops");
    res.redirect(
      HOME_REDIRECT_URI +
        queryString.stringify({
          error: "state_mismatch",
        })
    );
  } else {
    // Clear state cookie, no longer needed
    res.clearCookie(SPOTIFY_AUTH_STATE_KEY);

    // Spotify API request to get Auth Code

    const authRequestConfig = {
      headers: {
        Authorization:
          "Basic " +
          new Buffer.from(CLIENT_ID + ":" + CLIENT_SECRET).toString("base64"),
      },
    };

    const authRequestBody = {
      code: code,
      redirect_uri: `http://localhost:3001/api/private/${PRIVATE_TOKEN_ENDPOINTS_ENDPOINT}/site-token`,
      grant_type: "authorization_code",
    };

    try {
      const { data: authResponseData } = await axios.post(
        SPOTIFY_GET_AUTH_TOKEN_URL,
        queryString.stringify(authRequestBody),
        authRequestConfig
      );
      console.log(
        `Successful authResponse: ` + JSON.stringify(authResponseData)
      );

      const accessToken = authResponseData.access_token,
        newRefreshToken = authResponseData.refresh_token;

      await db.collection(DB_SITE_CONFIGURATIONS).doc(DB_SITE_TOKENS).set({
        accessToken: accessToken,
        accessTokenIssuedAt: Date.now(),
        refreshToken: newRefreshToken,
      });

      res.redirect(
        HOME_REDIRECT_URI +
          queryString.stringify({
            error: "successfully_got_site_tokens",
          })
      );
    } catch (error) {
      // TODO: better error handling
      console.log(`Site token get error: ` + error);
      res.redirect(
        HOME_REDIRECT_URI +
          queryString.stringify({
            error: "could_not_get_site_token",
          })
      );
    }
  }
});

module.exports = router;
