const express = require("express");
const request = require("request");
const {
  STATE_KEY,
  SPOTIFY_AUTH_URL,
  CLIENT_ID,
  CLIENT_SECRET,
  HOME_REDIRECT_URI,
  AUTH_REDIRECT_URI,
} = require("../constants");
const router = express.Router();
const queryString = require("query-string");

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
      url: "https://accounts.spotify.com/api/token",
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

    request.post(authOptions, (error, response, body) => {
      if (!error && response.statusCode === 200) {
        const access_token = body.access_token,
          refresh_token = body.refresh_token;

        const options = {
          url: "https://api.spotify.com/v1/me",
          headers: { Authorization: "Bearer " + access_token },
          json: true,
        };

        // // use the access token to access the Spotify Web API
        // request.get(options, (error, response, body) => {
        //   // console.log(body);
        // });

        res.cookie("accessToken", access_token, {
          domain: "",
          maxAge: 3600000,
        });
        res.redirect(HOME_REDIRECT_URI + "/");
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

module.exports = router;
