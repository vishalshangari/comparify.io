const express = require("express");
const {
  SPOTIFY_AUTH_STATE_KEY,
  SPOTIFY_API_SCOPES,
  SPOTIFY_AUTH_URL,
  SPOTIFY_GET_AUTH_TOKEN_URL,
  CLIENT_ID,
  CLIENT_SECRET,
  HOME_REDIRECT_URI,
  AUTH_REDIRECT_URI,
  GET_ACTIVE_USER_PROFILE_URL,
  RESPONSE_CODES,
  ERROR_CODES,
  COMPARIFY_TOKEN_COOKIE_KEY,
  COOKIE_DOMAIN,
  USERS,
  STATS,
  ALPHANUMERIC,
  MAX_COOKIE_AGE,
} = require("../constants");
const router = express.Router();
const queryString = require("query-string");
const axios = require("axios");
const jwt = require("jsonwebtoken");

// Services
const getUserInfo = require("../services/getUserInfo");
const generateRandomString = require("../utils/generateRandomString");
const createStandardUserData = require("../services/createStandardUser");

// Database
const db = require("../db/firebase");
const firebase = require("firebase");

router.get("/login", (req, res) => {
  // Set auth request state cookie
  const state = generateRandomString(16);
  res.cookie(SPOTIFY_AUTH_STATE_KEY, state);

  // Request authorization
  const scopes = SPOTIFY_API_SCOPES;

  res.redirect(
    SPOTIFY_AUTH_URL +
      queryString.stringify({
        response_type: "code",
        client_id: CLIENT_ID,
        scope: scopes,
        redirect_uri: AUTH_REDIRECT_URI,
        state: state,
      })
  );
});

router.get("/login/callback", async (req, res) => {
  const code = req.query.code || null;
  const state = req.query.state || null;
  const storedState = req.cookies ? req.cookies[SPOTIFY_AUTH_STATE_KEY] : null;

  // If state sent back from Spotify API does not match local state, reject
  // TODO: better error handler for state mismatch
  if (state === null || state !== storedState) {
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
    const authRequestOptions = {
      url: SPOTIFY_GET_AUTH_TOKEN_URL,
      form: {
        code: code,
        redirect_uri: AUTH_REDIRECT_URI,
        grant_type: "authorization_code",
      },
      headers: {
        Authorization:
          "Basic " +
          new Buffer.from(CLIENT_ID + ":" + CLIENT_SECRET).toString("base64"),
      },
      json: true,
    };

    const authRequestConfig = {
      headers: {
        Authorization:
          "Basic " +
          new Buffer.from(CLIENT_ID + ":" + CLIENT_SECRET).toString("base64"),
      },
    };

    const authRequestBody = {
      code: code,
      redirect_uri: AUTH_REDIRECT_URI,
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

      const requestConfigAuthHeader = {
        Authorization: `Bearer ${accessToken}`,
      };

      const userInfo = await getUserInfo(requestConfigAuthHeader);
      console.log(`User info: ${JSON.stringify(userInfo)}`);

      // New JWT token (regardless of whether user is new)
      // Shouldn't have existing token as logout will clear old token
      const comparifyToken = jwt.sign(
        { _id: userInfo._id.toString() },
        process.env.JWT_SECRET,
        { expiresIn: "7d" }
      );

      console.log("new token: ", comparifyToken);

      // Set cookie
      res.cookie(COMPARIFY_TOKEN_COOKIE_KEY, comparifyToken, {
        domain: "",
        maxAge: MAX_COOKIE_AGE, // One week
        httpOnly: true,
        path: "/",
      });

      // Check if user exists in firebase
      const userRef = db.collection(USERS).doc(userInfo._id);
      const userDoc = await userRef.get();

      if (!userDoc.exists) {
        // New user
        console.log(`NEW USER with id: ${userInfo._id}`);

        // Create initial user datastore
        const userData = await createStandardUserData(
          requestConfigAuthHeader,
          userInfo
        );

        userData.lastLogin = userInfo.createdAt;
        userData.lastUpdated = userInfo.createdAt;

        // const userData = {
        //   info: userInfo,
        //   lastLogin: userInfo.createdAt,
        // };

        // Add Spotify refresh token to user
        userData.tokens = {
          accessToken: accessToken,
          refreshToken: newRefreshToken,
          accessTokenIssuedAt: userInfo.createdAt,
        };

        // Save full new user to firestore
        userRef.set(userData);

        // Add one to user count aggregation
        // TODO: more aggregation analysis
        await db
          .collection(STATS)
          .doc(USERS)
          .update({ count: firebase.firestore.FieldValue.increment(1) });
      } else {
        // Existing user, update with new Spotify refresh token
        const tokens = {
          accessToken: accessToken,
          refreshToken: newRefreshToken,
          accessTokenIssuedAt: Date.now(),
        };
        console.log(`EXISTING USER with id: ${userInfo._id}`);
        await userRef.update({
          tokens: tokens,
          lastLogin: Date.now(),
        });
      }

      // TODO: redirect back to URL from state
      res.redirect(HOME_REDIRECT_URI + "/");
    } catch (error) {
      // TODO: better error handling
      console.log(`authResponse error: ` + error);
      res.redirect(
        HOME_REDIRECT_URI +
          "/" +
          queryString.stringify({
            error: "invalid_token",
          })
      );
    }
  }
});

router.get("/verifyToken", (req, res) => {
  console.log(`Cookies in request:`, JSON.stringify(req.cookies));
  if (req.cookies["comparifyToken"]) {
    try {
      const jwtresult = jwt.verify(
        req.cookies["comparifyToken"],
        process.env.JWT_SECRET
      );
      console.log(`Validated token:`, jwtresult);
      res
        .status(200)
        .json({ status: RESPONSE_CODES.AUTHENTICATED, errorType: null });
    } catch (error) {
      console.log(`Error in jwt verification:`, error);
      const errorType = error.name;
      if (errorType === `TokenExpiredError`) {
        // TODO: ask user to login again
        res.status(401).json({
          status: RESPONSE_CODES.AUTHENTICATION_ERROR,
          errorType: ERROR_CODES.EXPIRED_TOKEN,
        });
      } else {
        res.status(401).json({
          status: RESPONSE_CODES.AUTHENTICATION_ERROR,
          errorType: ERROR_CODES.INVALID_TOKEN,
        });
      }
    }
  } else {
    res
      .status(200)
      .json({ status: RESPONSE_CODES.NO_ACTIVE_SESSION, errorType: null });
  }
});

router.get("/clearSession", (req, res) => {
  // TODO: on logout
  console.log("clearing session...");
});

module.exports = router;
