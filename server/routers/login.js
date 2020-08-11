const express = require("express");
const request = require("request");
const {
  STATE_KEY,
  SPOTIFY_AUTH_URL,
  SPOTIFY_GET_AUTH_TOKEN,
  CLIENT_ID,
  CLIENT_SECRET,
  HOME_REDIRECT_URI,
  AUTH_REDIRECT_URI,
  GET_ACTIVE_USER_PROFILE_URL,
  COOKIE_DOMAIN,
  USERS,
  STATS,
} = require("../constants");
const router = express.Router();
const queryString = require("query-string");
const axios = require("axios");
const jwt = require("jsonwebtoken");

// Firebase db
const db = require("../db/firebase");
const firebase = require("firebase");

/**
 * Generates a random string containing numbers and letters
 * @param  {number} length The length of the string
 * @return {string} The generated string
 */
const generateRandomString = (length) => {
  var text = "";
  const possible =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

  for (let i = 0; i < length; i++) {
    text += possible.charAt(Math.floor(Math.random() * possible.length));
  }
  return text;
};

router.get("/", (req, res) => {
  // Set auth request state cookie
  const state = generateRandomString(16);
  res.cookie(STATE_KEY, state);

  // Request authorization
  const scope = "user-read-private user-read-email user-library-read";

  res.redirect(
    SPOTIFY_AUTH_URL +
      queryString.stringify({
        response_type: "code",
        client_id: CLIENT_ID,
        scope: scope,
        redirect_uri: AUTH_REDIRECT_URI,
        state: state,
      })
  );
});

router.get("/callback", (req, res) => {
  const code = req.query.code || null;
  const state = req.query.state || null;
  const storedState = req.cookies ? req.cookies[STATE_KEY] : null;

  if (state === null || state !== storedState) {
    res.redirect(
      HOME_REDIRECT_URI +
        queryString.stringify({
          error: "state_mismatch",
        })
    );
  } else {
    res.clearCookie(STATE_KEY);
    const authOptions = {
      url: SPOTIFY_GET_AUTH_TOKEN,
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

    request.post(authOptions, async (error, response, body) => {
      if (!error && response.statusCode === 200) {
        const access_token = body.access_token,
          refresh_token = body.refresh_token;

        const config = {
          headers: { Authorization: "Bearer " + access_token },
          json: true,
        };

        try {
          const { data } = await axios.get(GET_ACTIVE_USER_PROFILE_URL, config);
          const spotifyUserId = data.id;

          // Sign and set jwt token
          const comparifyToken = jwt.sign(
            { _id: spotifyUserId.toString() },
            process.env.JWT_SECRET,
            { expiresIn: "1h" }
          );
          res.cookie("comparifyToken", comparifyToken, {
            domain: "",
            maxAge: 3600000, // One hour expiration
            httpOnly: true,
          });
          // res.clearCookie("comparifyToken");

          // Http-only cookie

          // Store user id and token
          // const userRef = db.collection(USERS).doc(spotifyUserId);
          // const userDoc = await userRef.get();
          // if (!userDoc.exists) {
          //   // New user
          //   console.log(
          //     `no such user detected..adding new user with id: ${spotifyUserId}`
          //   );
          //   // userRef.set({ tokens: [comparifyToken] });
          //   // Add one to user count
          //   // await db
          //   //   .collection(STATS)
          //   //   .doc(USERS)
          //   //   .update({ count: firebase.firestore.FieldValue.increment(1) });
          // } else {
          //   // Existing user
          //   console.log(
          //     `User ${spotifyUserId} already exists... adding token.`
          //   );
          //   // await userRef.update({
          //   //   tokens: firebase.firestore.FieldValue.arrayUnion(comparifyToken),
          //   // });
          // }

          // Redirect
          res.redirect(HOME_REDIRECT_URI + "/");
        } catch (error) {
          console.log(error);
          res.redirect(
            HOME_REDIRECT_URI +
              "/" +
              queryString.stringify({
                error: "There was a problem getting user data.",
              })
          );
        }
      } else {
        res.redirect(
          HOME_REDIRECT_URI +
            "/" +
            queryString.stringify({
              error: "invalid_token",
            })
        );
      }
    });
  }
});

router.get("/verifyToken", (req, res) => {
  console.log(JSON.stringify(req.cookies));
  if (req.cookies["comparifyToken"]) {
    try {
      const jwtresult = jwt.verify(
        req.cookies["comparifyToken"],
        process.env.JWT_SECRET
      );
      console.log(jwtresult);
      res.status(200).json({ status: "authenticated" });
    } catch (error) {
      res
        .status(401)
        .json({ status: "error", error: "User not authenticated" });
    }
  } else {
    res.status(200).json({ status: "no-user" });
  }
});

router.get("/clearSession", (req, res) => {
  console.log("clearing session...");
});

module.exports = router;
