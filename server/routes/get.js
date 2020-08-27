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
  GET_ARTISTS_URL,
  GET_USER_PROFILE_URL,
  GET_AUDIO_FEATURES_URL,
  CLIENT_ID,
  CLIENT_SECRET,
  RESPONSE_CODES,
  USERS,
  ALPHANUMERIC,
  SPOTIFY_AUTH_STATE_KEY,
  SPOTIFY_GET_AUTH_TOKEN_URL,
  DB_SITE_CONFIGURATIONS,
  DB_SITE_TOKENS,
} = require("../constants");
const getValidAccessToken = require("../services/getValidAccessToken");

router.post("/", (req, res) => {
  console.log("You hit /api/get");
  // res.clearCookie("comparifyToken", { domain: "" });
  // res.status(200).json({
  //   status: RESPONSE_CODES.NO_ACTIVE_SESSION,
  //   errorType: null,
  // });
  res.redirect(HOME_REDIRECT_URI);
});

router.get("/public/user-info/:id", async (req, res) => {
  const userID = req.params.id;
  let accessToken = "";

  // Get valid comparify domain access token for Spotify public API requests
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

  // Do work
  try {
    const {
      data: { display_name: name, images: images, uri: uri },
    } = await axios.get(`${GET_USER_PROFILE_URL}${userID}`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    res.send({ name: name, images: images, uri: uri });
  } catch (error) {
    console.log(error);
  }
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
    spotifyData: {
      topArtistsAndGenres,
      topTracks,
      audioFeatures,
      obscurityScore,
    },
  } = userDoc.data();

  const topGenres = {
    shortTerm: topArtistsAndGenres.shortTerm.topGenres,
    mediumTerm: topArtistsAndGenres.mediumTerm.topGenres,
    longTerm: topArtistsAndGenres.longTerm.topGenres,
  };

  const names = userInfo.displayName.split(" ");

  const responseData = {
    userInfo: {
      names: names,
    },
    topGenres: topGenres,
    obscurityScore: obscurityScore,
    topTracks: topTracks,
    featureScores: audioFeatures,
    topArtists: {
      shortTerm: topArtistsAndGenres.shortTerm.topArtists,
      mediumTerm: topArtistsAndGenres.mediumTerm.topArtists,
      longTerm: topArtistsAndGenres.longTerm.topArtists,
    },
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

router.post("/track-info/multiple", async (req, res) => {
  const trackIDs = req.body.ids;
  let accessToken = "";

  // Get valid comparify domain access token for Spotify public API requests
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

  // Do work
  try {
    const {
      data: { tracks: tracksFull },
    } = await axios.get(GET_TRACKS_URL, {
      params: {
        ids: trackIDs,
      },
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
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

    let reshapedTracks = [];

    for (let i = 0; i < tracksFull.length; i++) {
      reshapedTracks.push(getTrackInfo(tracksFull[i]));
      // if (i < 12) {
      //   shortTermTracks.push(getTrackInfo(tracksFull[i]));
      // } else if (i < 24) {
      //   mediumTermTracks.push(getTrackInfo(tracksFull[i]));
      // } else {
      //   longTermTracks.push(getTrackInfo(tracksFull[i]));
      // }
    }

    res.send(reshapedTracks);
  } catch (error) {
    console.log(error);
  }
});

router.post("/artist-info/multiple", async (req, res) => {
  const artistIDs = req.body.ids;
  let accessToken = "";

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

  // Do work
  try {
    const {
      data: { artists: artistsFull },
    } = await axios.get(GET_ARTISTS_URL, {
      params: {
        ids: artistIDs,
      },
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    // let shortTermArtists = [];
    // let mediumTermArtists = [];
    // let longTermArtists = [];

    const getArtistInfo = (artist) => {
      return {
        name: artist.name,
        images: artist.images,
        href: artist.uri,
        popularity: artist.popularity,
      };
    };

    let reshapedArtists = [];

    for (let i = 0; i < artistsFull.length; i++) {
      reshapedArtists.push(getArtistInfo(artistsFull[i]));
      // if (i < 12) {
      //   shortTermArtists.push(getArtistInfo(artistsFull[i]));
      // } else if (i < 24) {
      //   mediumTermArtists.push(getArtistInfo(artistsFull[i]));
      // } else {
      //   longTermArtists.push(getArtistInfo(artistsFull[i]));
      // }
    }

    res.send(reshapedArtists);
  } catch (error) {
    console.log(error);
    res.send(`There was an error getting your top`);
  }
});

router.post("/artist-info", async (req, res) => {
  const artistIDs = req.body.ids;
  let accessToken = "";

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

  // Do work
  try {
    const {
      data: { artists: artistsFull },
    } = await axios.get(GET_ARTISTS_URL, {
      params: {
        ids: artistIDs,
      },
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    let shortTermArtists = [];
    let mediumTermArtists = [];
    let longTermArtists = [];

    const getArtistInfo = (artist) => {
      return {
        name: artist.name,
        images: artist.images,
        href: artist.uri,
        popularity: artist.popularity,
      };
    };

    for (let i = 0; i < artistsFull.length; i++) {
      if (i < 12) {
        shortTermArtists.push(getArtistInfo(artistsFull[i]));
      } else if (i < 24) {
        mediumTermArtists.push(getArtistInfo(artistsFull[i]));
      } else {
        longTermArtists.push(getArtistInfo(artistsFull[i]));
      }
    }

    res.send({
      shortTerm: shortTermArtists,
      mediumTerm: mediumTermArtists,
      longTerm: longTermArtists,
    });
  } catch (error) {
    console.log(error);
    res.redirect(
      HOME_REDIRECT_URI +
        "/" +
        queryString.stringify({
          error: "unkown_error",
        })
    );
  }
});

// TODO: old route to get all tracks
// router.post("/track-info", async (req, res) => {
//   const trackIDs = req.body.ids;
//   let accessToken = "";

//   // Get valid comparify domain access token for Spotify public API requests
//   try {
//     accessToken = await getValidAccessToken(
//       DB_SITE_CONFIGURATIONS,
//       DB_SITE_TOKENS
//     );
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
//       data: { tracks: tracksFull },
//     } = await axios.get(GET_TRACKS_URL, {
//       params: {
//         ids: trackIDs,
//       },
//       headers: {
//         Authorization: `Bearer ${accessToken}`,
//       },
//     });

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
//       if (i < 12) {
//         shortTermTracks.push(getTrackInfo(tracksFull[i]));
//       } else if (i < 24) {
//         mediumTermTracks.push(getTrackInfo(tracksFull[i]));
//       } else {
//         longTermTracks.push(getTrackInfo(tracksFull[i]));
//       }
//     }

//     res.send({
//       shortTerm: shortTermTracks,
//       mediumTerm: mediumTermTracks,
//       longTerm: longTermTracks,
//     });
//   } catch (error) {
//     console.log(error);
//   }
// });

// TODO: Old route to get track audio features -> moved to createStandardUser process

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
