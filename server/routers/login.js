const express = require("express");
const request = require("request");
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
const getUserInfo = require("../services/getUserInfo");

// Firebase db
const db = require("../db/firebase");
const firebase = require("firebase");
const createStandardUserData = require("../services/createStandardUser");

/**
 * Generates a random string containing numbers and letters
 * @param  {number} length The length of the string
 * @return {string} The generated string
 */
const generateRandomString = (length) => {
  let text = "";

  for (let i = 0; i < length; i++) {
    text += ALPHANUMERIC.charAt(
      Math.floor(Math.random() * ALPHANUMERIC.length)
    );
  }
  return text;
};

router.get("/", (req, res) => {
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

router.get("/callback", async (req, res) => {
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

    // TODO: change to axios

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

      // Set cookie
      res.cookie(COMPARIFY_TOKEN_COOKIE_KEY, comparifyToken, {
        domain: "",
        maxAge: MAX_COOKIE_AGE, // One week
        httpOnly: true,
      });

      // Check if user exists in firebase
      const userRef = db.collection(USERS).doc(userInfo._id);
      const userDoc = await userRef.get();

      if (!userDoc.exists) {
        // New user
        console.log(`NEW USER with id: ${userInfo._id}`);

        // Create initial user datastore
        // const userData = await createStandardUserData(
        //   requestConfigAuthHeader,
        //   userInfo
        // );

        const userData = {
          info: userInfo,
        };

        // Add Spotify refresh token to user
        userData.spotifyRefreshToken = newRefreshToken;

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
        console.log(`EXISTING USER with id: ${userInfo._id}`);
        await userRef.update({ spotifyRefreshToken: newRefreshToken });
      }

      // TODO: redirect back to URL from state
      res.redirect(HOME_REDIRECT_URI + "/");
    } catch (error) {
      console.log(`authResponse error: ` + error);
      res.redirect(
        HOME_REDIRECT_URI +
          "/" +
          queryString.stringify({
            error: "invalid_token",
          })
      );
    }

    // axios.post(SPOTIFY_GET_AUTH_TOKEN_URL);

    // request.post(authRequestOptions, async (error, response, body) => {
    //   if (!error && response.statusCode === 200) {
    //     const access_token = body.access_token,
    //       refresh_token = body.refresh_token;
    //     console.log("access:", access_token);
    //     console.log("refresh:", refresh_token);
    //     const config = {
    //       headers: { Authorization: "Bearer " + access_token },
    //     };

    //     try {
    //       const { data } = await axios.get(GET_ACTIVE_USER_PROFILE_URL, config);
    //       const spotifyUserId = data.id;

    //       // Sign and set jwt token
    //       const comparifyToken = jwt.sign(
    //         { _id: spotifyUserId.toString() },
    //         process.env.JWT_SECRET,
    //         { expiresIn: "7d" }
    //       );
    //       res.cookie("comparifyToken", comparifyToken, {
    //         domain: "",
    //         maxAge: 3600000, // One hour expiration
    //         httpOnly: true,
    //       });
    //       // res.clearCookie("comparifyToken");

    //       // Http-only cookie

    //       // Store user id and token
    //       // const userRef = db.collection(USERS).doc(spotifyUserId);
    //       // const userDoc = await userRef.get();
    //       // if (!userDoc.exists) {
    //       //   // New user
    //       //   console.log(
    //       //     `no such user detected..adding new user with id: ${spotifyUserId}`
    //       //   );
    //       //   // userRef.set({ tokens: [comparifyToken] });
    //       //   // Add one to user count
    //       //   // await db
    //       //   //   .collection(STATS)
    //       //   //   .doc(USERS)
    //       //   //   .update({ count: firebase.firestore.FieldValue.increment(1) });
    //       // } else {
    //       //   // Existing user
    //       //   console.log(
    //       //     `User ${spotifyUserId} already exists... adding token.`
    //       //   );
    //       //   // await userRef.update({
    //       //   //   tokens: firebase.firestore.FieldValue.arrayUnion(comparifyToken),
    //       //   // });
    //       // }

    //       // Redirect
    //       res.redirect(HOME_REDIRECT_URI + "/");
    //     } catch (error) {
    //       console.log(error);
    //       res.redirect(
    //         HOME_REDIRECT_URI +
    //           "/" +
    //           queryString.stringify({
    //             error: "There was a problem getting user data.",
    //           })
    //       );
    //     }
    //   } else {
    //     res.redirect(
    //       HOME_REDIRECT_URI +
    //         "/" +
    //         queryString.stringify({
    //           error: "invalid_token",
    //         })
    //     );
    //   }
    // });
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
  console.log("clearing session...");
});

module.exports = router;
