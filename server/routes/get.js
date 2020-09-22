// Fetch routes - Spotify API and db data
const express = require("express");
const axios = require("axios");
const retryable = require("async/retryable");
const jwt = require("jsonwebtoken");
const queryString = require("query-string");
const generateRandomString = require("../utils/generateRandomString");

// Firebase db
const db = require("../db/firebase");
const firebase = require("firebase");

// Services
const getValidAccessToken = require("../services/getValidAccessToken");

// Utils
const catchAsync = require("../utils/catchAsync");

// Models
const AppError = require("../models/AppError");

// Constants
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
  GET_RECOMMENDATIONS_URL,
} = require("../constants");

const router = express.Router();

router.post("/", (req, res) => {
  console.log("You hit /api/get");
  // res.clearCookie("comparifyToken", { domain: "" });
  // res.status(200).json({
  //   status: RESPONSE_CODES.NO_ACTIVE_SESSION,
  //   errorType: null,
  // });
  res.redirect(HOME_REDIRECT_URI);
});

const oldGetPublicUserInfoId = () => {
  // router.get("/public/user-info/:id", async (req, res) => {
  //   const userID = req.params.id;
  //   let accessToken = "";
  //   // Get valid comparify domain access token for Spotify public API requests
  //   try {
  //     accessToken = await getValidAccessToken(
  //       DB_SITE_CONFIGURATIONS,
  //       DB_SITE_TOKENS
  //     );
  //   } catch (error) {
  //     console.log(error);
  //   }
  //   // Do work
  //   try {
  //     const {
  //       data: { display_name: name, images: images, uri: uri },
  //     } = await axios.get(`${GET_USER_PROFILE_URL}${userID}`, {
  //       headers: {
  //         Authorization: `Bearer ${accessToken}`,
  //       },
  //     });
  //     res.send({ name: name, images: images, uri: uri });
  //   } catch (error) {
  //     // LOG error
  //     // console.log(Object.getOwnPropertyNames(error));
  //     console.log(error.response.data);
  //     res.status(500).send({ message: "Error getting user public profile" });
  //   }
  // });
};

router.get(
  "/current-user-id",
  catchAsync(async (req, res, next) => {
    if (req.cookies["comparifyToken"]) {
      const { _id: userId } = jwt.verify(
        req.cookies["comparifyToken"],
        process.env.JWT_SECRET
      );
      res.send({ id: userId });
      console.log(userId);
    } else {
      res.send({ id: "" });
    }
  })
);

router.get(
  "/public/user-info/:id",
  catchAsync(async (req, res, next) => {
    const userID = req.params.id;

    // Get valid comparify domain access token for Spotify public API requests
    const accessToken = await getValidAccessToken(
      DB_SITE_CONFIGURATIONS,
      DB_SITE_TOKENS
    );

    // Do work
    const {
      data: { display_name: name, images: images, uri: uri },
    } = await axios.get(`${GET_USER_PROFILE_URL}${userID}`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    res.send({ name: name, images: images, uri: uri });
  })
);

router.get(
  "/saved-data",
  catchAsync(async (req, res) => {
    console.log(JSON.stringify(req.cookies));
    // Token will already be validated by auth provider (call to auth/verifyToken)
    // This should never fail
    const { _id: userId } = jwt.verify(
      req.cookies["comparifyToken"],
      process.env.JWT_SECRET
    );

    const userRef = db.collection(USERS).doc(userId);
    const userDoc = await userRef.get();
    if (!userDoc.exists) {
      throw new AppError(
        "User not found in database. Please try logging out and logging in again.",
        404
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
      comparifyPage: {
        exists: comparifyPageExists = false,
        id: comparifyPageID = null,
      } = { exists: false, ref: null },
    } = userDoc.data();

    const names = userInfo.displayName.split(" ");

    const responseData = {
      userInfo: {
        names: names,
        profileImageUrl: userInfo.profileImageUrl,
      },
      obscurityScore: obscurityScore,
      topTracks: topTracks,
      featureScores: audioFeatures,
      topArtists: {
        shortTerm: topArtistsAndGenres.shortTerm.topArtists,
        mediumTerm: topArtistsAndGenres.mediumTerm.topArtists,
        longTerm: topArtistsAndGenres.longTerm.topArtists,
      },
      topGenres: {
        shortTerm: topArtistsAndGenres.shortTerm.topGenres,
        mediumTerm: topArtistsAndGenres.mediumTerm.topGenres,
        longTerm: topArtistsAndGenres.longTerm.topGenres,
      },
      comparifyPage: {
        exists: comparifyPageExists,
        id: comparifyPageID,
      },
    };
    // console.log(responseData);
    res.send(responseData);
  })
);

// GET tracks info
router.get(
  "/track-info/multiple",
  catchAsync(async (req, res) => {
    const { ids } = req.query;

    // Get valid comparify domain access token for Spotify public API requests
    const accessToken = await getValidAccessToken(
      DB_SITE_CONFIGURATIONS,
      DB_SITE_TOKENS
    );

    // Do work
    const {
      data: { tracks: tracksFull },
    } = await axios.get(GET_TRACKS_URL, {
      params: {
        ids: ids,
      },
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    if (!tracksFull || tracksFull[0] === null) {
      throw new AppError(
        "There was an error loading tracks from the Spotify database.",
        500
      );
    }

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
    }

    res.send(reshapedTracks);
  })
);

router.get(
  "/artist-info/multiple",
  catchAsync(async (req, res) => {
    const { ids } = req.query;

    // Get valid comparify domain access token for Spotify public API requests
    let accessToken = await getValidAccessToken(
      DB_SITE_CONFIGURATIONS,
      DB_SITE_TOKENS
    );

    // Do work
    const {
      data: { artists: artistsFull },
    } = await axios.get(GET_ARTISTS_URL, {
      params: {
        ids: ids,
      },
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    if (!artistsFull || artistsFull[0] === null) {
      throw new AppError(
        "There was an error loading artists from the Spotify database.",
        500
      );
    }

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
    }

    res.send(reshapedArtists);
  })
);

router.get(
  "/recommendations",
  catchAsync(async (req, res) => {
    const { seed_genres, seed_artists, seed_tracks } = req.query;

    // Get valid comparify domain access token for Spotify public API requests
    const accessToken = await getValidAccessToken(
      DB_SITE_CONFIGURATIONS,
      DB_SITE_TOKENS
    );

    // Do work
    const {
      data: { tracks: tracksFull },
    } = await axios.get(GET_RECOMMENDATIONS_URL, {
      params: {
        seed_genres: seed_genres,
        seed_artists: seed_artists,
        seed_tracks: seed_tracks,
        limit: 25,
      },
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    if (!tracksFull || tracksFull[0] === null) {
      throw new AppError(
        "There was an error loading recommendations from the Spotify database. Please try again later.",
        500
      );
    }

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
    }
    res.send(reshapedTracks);
  })
);

// Error handling
router.use(function (err, req, res, next) {
  // LOG ERROR
  let responseStatus, responseMessage;
  if (err.isAxiosError) {
    console.log(err.response.data);
    // Error in communicating with Spotify API
    const {
      response: {
        data: {
          error: { status, message },
        },
      },
    } = err;

    // Forward Spotify API response in case of 404
    if (status === 404) {
      responseStatus = status;
      responseMessage = message;
    } else {
      responseStatus = 500;
      responseMessage = "Server error";
    }
  } else {
    console.log(err);
    responseStatus = err.statusCode || 500;
    responseMessage = err.message || "Unknown error";
  }

  res.status(responseStatus).json({
    status: responseStatus,
    message: responseMessage,
  });
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
