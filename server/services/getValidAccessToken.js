// Get valid user/site access token from Spotify/DB

const axios = require("axios");
const queryString = require("query-string");
const db = require("../db/firebase");
const {
  CLIENT_ID,
  CLIENT_SECRET,
  SPOTIFY_GET_AUTH_TOKEN_URL,
  ACCESS_TOKEN_REFRESH_PERIOD,
} = require("../constants");

// Models
const AppError = require("../models/AppError");

const getValidAccessToken = async (COLLECTION, DOC) => {
  const tokensDoc = db.collection(COLLECTION).doc(DOC);
  const tokens = await tokensDoc.get();
  let tokenValues = {};
  if (!tokens.exists) {
    throw new AppError("No access tokens found", 500);
  } else {
    tokenValues = tokens.data();
  }

  if (
    Date.now() >
    tokenValues.accessTokenIssuedAt + ACCESS_TOKEN_REFRESH_PERIOD
  ) {
    // Get new access token
    console.log("invalid token, getting new");

    try {
      const authRequestBody = {
        refresh_token: tokenValues.refreshToken,
        grant_type: "refresh_token",
      };

      const authRequestConfig = {
        headers: {
          Authorization:
            "Basic " +
            // FIX THIS LINE
            new Buffer.from(CLIENT_ID + ":" + CLIENT_SECRET).toString("base64"),
        },
      };

      const { data: refreshTokenResponseData } = await axios.post(
        SPOTIFY_GET_AUTH_TOKEN_URL,
        queryString.stringify(authRequestBody),
        authRequestConfig
      );

      tokenValues.accessToken = refreshTokenResponseData.access_token;
      await tokensDoc.update({
        accessToken: refreshTokenResponseData.access_token,
        accessTokenIssuedAt: Date.now(),
      });
    } catch (error) {
      // LOG error
      console.log(error.response.data);
      throw new AppError(
        `Error getting new access tokens for entity: ${COLLECTION}`,
        500
      );
    }
  } else {
    console.log("token is valid");
  }

  return tokenValues.accessToken;
};
module.exports = getValidAccessToken;
