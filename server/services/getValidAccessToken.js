const axios = require("axios");
const queryString = require("query-string");
const db = require("../db/firebase");
const {
  CLIENT_ID,
  CLIENT_SECRET,
  SPOTIFY_GET_AUTH_TOKEN_URL,
} = require("../constants");
const getValidAccessToken = async (COLLECTION, DOC) => {
  const tokensDoc = db.collection(COLLECTION).doc(DOC);
  const tokens = await tokensDoc.get();
  let tokenValues = {};
  if (!tokens.exists) {
    throw new Error("noTokenFound");
  } else {
    tokenValues = tokens.data();
  }

  if (Date.now() > tokenValues.accessTokenIssuedAt + 3540000) {
    // Get new refresh token
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
      throw error;
    }
  } else {
    console.log("token is valid");
  }

  return tokenValues.accessToken;
};
module.exports = getValidAccessToken;
