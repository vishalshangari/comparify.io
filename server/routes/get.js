const express = require("express");
const axios = require("axios");
const retryable = require("async/retryable");
const jwt = require("jsonwebtoken");
const queryString = require("query-string");
const generateRandomString = require("../utils/generateRandomString");

// Firebase db
const db = require("../db/firebase");
const firebase = require("firebase");

const router = express.Router();

const {
  HOME_REDIRECT_URI,
  COOKIE_DOMAIN,
  SPOTIFY_AUTH_URL,
  GET_TRACKS_URL,
  GET_AUDIO_FEATURES_URL,
  CLIENT_ID,
  CLIENT_SECRET,
  RESPONSE_CODES,
  USERS,
  ALPHANUMERIC,
  SPOTIFY_AUTH_STATE_KEY,
  SPOTIFY_GET_AUTH_TOKEN_URL,
} = require("../constants");
const { getValidAccessToken } = require("../services/getValidAccessToken");

router.post("/", (req, res) => {
  console.log("You hit /api/get");
  // res.clearCookie("comparifyToken", { domain: "" });
  // res.status(200).json({
  //   status: RESPONSE_CODES.NO_ACTIVE_SESSION,
  //   errorType: null,
  // });
  res.redirect(HOME_REDIRECT_URI);
});

router.get("/saved-data", async (req, res) => {
  console.log(JSON.stringify(req.cookies));
  const { _id: userId } = jwt.verify(
    req.cookies["comparifyToken"],
    process.env.JWT_SECRET
  );

  const userRef = db.collection(USERS).doc(userId);
  let userDoc;
  try {
    userDoc = await userRef.get();
  } catch (error) {
    res.redirect(
      HOME_REDIRECT_URI +
        "/" +
        queryString.stringify({
          error: "error_retrieving_user_data",
        })
    );
  }

  const {
    info: userInfo,
    spotifyData: { topArtistsAndGenres, topTracks, audioFeatures },
  } = userDoc.data();

  const topGenres = {
    shortTerm: topArtistsAndGenres.shortTerm.topGenres,
    mediumTerm: topArtistsAndGenres.mediumTerm.topGenres,
    longTerm: topArtistsAndGenres.longTerm.topGenres,
  };

  const getArtistsPopularityScores = () => {
    const artistsShortTerm = topArtistsAndGenres.shortTerm.topArtists;
    const artistsMediumTerm = topArtistsAndGenres.mediumTerm.topArtists;
    const artistsLongTerm = topArtistsAndGenres.longTerm.topArtists;

    let shortTermTotal = 0;
    for (let i = 0; i < artistsShortTerm.length; i++) {
      shortTermTotal += artistsShortTerm[i].popularity;
    }

    let mediumTermTotal = 0;
    for (let i = 0; i < artistsMediumTerm.length; i++) {
      mediumTermTotal += artistsMediumTerm[i].popularity;
    }

    let longTermTotal = 0;
    for (let i = 0; i < artistsLongTerm.length; i++) {
      longTermTotal += artistsLongTerm[i].popularity;
    }

    const weightedScore =
      (shortTermTotal / artistsShortTerm.length) * 0.2 +
      (mediumTermTotal / artistsMediumTerm.length) * 0.3 +
      (longTermTotal / artistsLongTerm.length) * 0.5;

    return weightedScore;
  };

  const getTracksPopularityScores = () => {
    const tracksShortTerm = topTracks.shortTerm;
    const tracksMediumTerm = topTracks.mediumTerm;
    const tracksLongTerm = topTracks.longTerm;

    let shortTermTotal = 0;
    for (let i = 0; i < tracksShortTerm.length; i++) {
      shortTermTotal += tracksShortTerm[i].popularity;
    }

    let mediumTermTotal = 0;
    for (let i = 0; i < tracksMediumTerm.length; i++) {
      mediumTermTotal += tracksMediumTerm[i].popularity;
    }

    let longTermTotal = 0;
    for (let i = 0; i < tracksLongTerm.length; i++) {
      longTermTotal += tracksLongTerm[i].popularity;
    }

    const weightedScore =
      (shortTermTotal / tracksShortTerm.length) * 0.2 +
      (mediumTermTotal / tracksMediumTerm.length) * 0.3 +
      (longTermTotal / tracksLongTerm.length) * 0.5;

    return weightedScore;
  };

  const names = userInfo.displayName.split(" ");

  const responseData = {
    userInfo: {
      name: names[0],
    },
    topGenres: topGenres,
    popularityScores: {
      artists: getArtistsPopularityScores(),
      tracks: getTracksPopularityScores(),
    },
    topTracks: topTracks,
    featureScores: audioFeatures,
  };
  // console.log(responseData);
  res.send(responseData);
});

router.get("/site-tokens-initialize", (req, res) => {
  const state = generateRandomString(16);
  res.cookie(SPOTIFY_AUTH_STATE_KEY, state);

  res.redirect(
    SPOTIFY_AUTH_URL +
      queryString.stringify({
        response_type: "code",
        client_id: CLIENT_ID,
        redirect_uri: "http://localhost:3001/api/get/site-token",
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
      redirect_uri: "http://localhost:3001/api/get/site-token",
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

      await db.collection("config").doc("tokens").set({
        accessToken: accessToken,
        accessTokenIssuedAt: Date.now(),
        refreshToken: newRefreshToken,
      });

      res.redirect(
        HOME_REDIRECT_URI +
          "/" +
          queryString.stringify({
            error: "successfully_got_site_tokens",
          })
      );
    } catch (error) {
      // TODO: better error handling
      console.log(`Site token get error: ` + error);
      res.redirect(
        HOME_REDIRECT_URI +
          "/" +
          queryString.stringify({
            error: "could_not_get_site_token",
          })
      );
    }
  }
});

router.post("/track-info", async (req, res) => {
  const trackIDs = req.body.ids;
  let tokenValues = {};

  try {
    tokenValues = await getValidAccessToken();
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

  // Do work
  try {
    const {
      data: { tracks: tracksFull },
    } = await axios.get(GET_TRACKS_URL, {
      params: {
        ids: trackIDs,
      },
      headers: {
        Authorization: `Bearer ${tokenValues.accessToken}`,
      },
    });

    let shortTermTracks = [];
    let mediumTermTracks = [];
    let longTermTracks = [];

    const getArtistNames = (artists) => {
      let names = [];
      artists.forEach((artist) => names.push(artist.name));
      return names;
    };

    const getTrackInfo = (track) => {
      return {
        name: track.name,
        album: track.album.name,
        image: track.album.images[0],
        artists: getArtistNames(track.artists),
        preview_url: track.preview_url,
        href: track.uri,
      };
    };

    for (let i = 0; i < tracksFull.length; i++) {
      if (i < 10) {
        shortTermTracks.push(getTrackInfo(tracksFull[i]));
      } else if (i < 20) {
        mediumTermTracks.push(getTrackInfo(tracksFull[i]));
      } else {
        longTermTracks.push(getTrackInfo(tracksFull[i]));
      }
    }

    res.send({
      shortTerm: shortTermTracks,
      mediumTerm: mediumTermTracks,
      longTerm: longTermTracks,
    });
  } catch (error) {
    console.log(error);
  }
});

// Old route to get track audio features -> moved to createStandardUser process

// router.post("/track-audio-features", async (req, res) => {
//   const trackIDs = req.body.ids;
//   let tokenValues = {};

//   try {
//     tokenValues = await getValidAccessToken();
//   } catch (error) {
//     console.error(error);
//     res.redirect(
//       HOME_REDIRECT_URI +
//         "/" +
//         queryString.stringify({
//           error: "unkown_error",
//         })
//     );
//   }

//   // Do work
//   try {
//     const {
//       data: { audio_features: audioFeaturesFull },
//     } = await axios.get(GET_AUDIO_FEATURES_URL, {
//       params: {
//         ids: trackIDs,
//       },
//       headers: {
//         Authorization: `Bearer ${tokenValues.accessToken}`,
//       },
//     });

//     console.log(audioFeaturesFull);
//     res.send(audioFeaturesFull);
//     return;
//     let shortTermTracks = [];
//     let mediumTermTracks = [];
//     let longTermTracks = [];

//     const getArtistNames = (artists) => {
//       let names = [];
//       artists.forEach((artist) => names.push(artist.name));
//       return names;
//     };

//     const getTrackInfo = (track) => {
//       return {
//         name: track.name,
//         album: track.album.name,
//         image: track.album.images[0],
//         artists: getArtistNames(track.artists),
//         preview_url: track.preview_url,
//         href: track.uri,
//       };
//     };

//     for (let i = 0; i < tracksFull.length; i++) {
//       if (i < 10) {
//         shortTermTracks.push(getTrackInfo(tracksFull[i]));
//       } else if (i < 20) {
//         mediumTermTracks.push(getTrackInfo(tracksFull[i]));
//       } else {
//         longTermTracks.push(getTrackInfo(tracksFull[i]));
//       }
//     }

//     // res.send({
//     //   shortTerm: shortTermTracks,
//     //   mediumTerm: mediumTermTracks,
//     //   longTerm: longTermTracks,
//     // });
//   } catch (error) {
//     console.log(error);
//   }
// });

// TODO: Old test route to delete

// router.get("/refresh-token", async (req, res) => {
//   const tokensRef = db.collection("config").doc("tokens");
//   const tokens = await tokensRef.get();
//   let tokenValues = {};
//   if (!tokens.exists) {
//     res.redirect(
//       HOME_REDIRECT_URI +
//         "/" +
//         queryString.stringify({
//           error: "unkown_error",
//         })
//     );
//   } else {
//     tokenValues = tokens.data();
//   }

//   try {
//     const authRequestBody = {
//       refresh_token: tokenValues.refreshToken,
//       grant_type: "refresh_token",
//     };

//     const authRequestConfig = {
//       headers: {
//         Authorization:
//           "Basic " +
//           new Buffer.from(CLIENT_ID + ":" + CLIENT_SECRET).toString("base64"),
//       },
//     };

//     const { data: refreshTokenResponseData } = await axios.post(
//       SPOTIFY_GET_AUTH_TOKEN_URL,
//       queryString.stringify(authRequestBody),
//       authRequestConfig
//     );
//     res.send(refreshTokenResponseData);
//   } catch (error) {
//     console.error(error);
//     res.redirect(
//       HOME_REDIRECT_URI +
//         "/" +
//         queryString.stringify({
//           error: "unkown_error",
//         })
//     );
//   }
// });

module.exports = router;
