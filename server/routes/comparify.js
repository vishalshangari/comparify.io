// Comparify (comparison) route
const express = require("express");
const { DB_COMPARIFYPAGE_COLLECTION, USERS, STATS } = require("../constants");
const router = express.Router();
const jwt = require("jsonwebtoken");

// Utils
const compareTopGenres = require("../utils/compareTopGenres");
const compareTopArtists = require("../utils/compareTopArtists");
const compareTopTracks = require("../utils/compareTopTracks");
const catchAsync = require("../utils/catchAsync");

// Database
const db = require("../db/firebase");
const firebase = require("firebase");

// Models
const AppError = require("../models/AppError");

// Execute comparison
router.get(
  "/:comparifyPageName",
  catchAsync(async (req, res) => {
    const { comparifyPageName } = req.params;

    // Only auth'd users so token will be verified
    const { _id: visitorID } = jwt.verify(
      req.cookies["comparifyToken"],
      process.env.JWT_SECRET
    );

    const comparifyPageRef = db
      .collection(DB_COMPARIFYPAGE_COLLECTION)
      .doc(comparifyPageName);

    const comparifyPageDoc = await comparifyPageRef.get();

    if (!comparifyPageDoc.exists) {
      throw new AppError(
        "This page was not found, it may have been deleted.",
        404
      );
    }

    const { creator } = comparifyPageDoc.data();

    const creatorRef = db.collection(USERS).doc(creator._id).get();
    const visitorRef = db.collection(USERS).doc(visitorID).get();

    const refResponse = await Promise.all([creatorRef, visitorRef]);

    const {
      info: creatorUserInfo,
      spotifyData: creatorSpotifyData,
      _insufficientUserData: creatorInsufficientUserData = false,
    } = refResponse[0].data();
    const {
      info: visitorUserInfo,
      spotifyData: visitorSpotifyData,
      _insufficientUserData: visitorInsufficientUserData = false,
    } = refResponse[1].data();

    if (creatorInsufficientUserData || visitorInsufficientUserData) {
      throw new AppError(
        `Looks like ${
          creatorInsufficientUserData
            ? creatorUserInfo.displayName + ` doesn't `
            : `you don't`
        } have sufficient Spotify data to make comparisons yet. Keep listening and check back soon!`,
        500
      );
    }

    // Analyze top genres
    const genresComparison = compareTopGenres(
      creatorSpotifyData.topArtistsAndGenres,
      visitorSpotifyData.topArtistsAndGenres
    );

    // Analyze top artists
    const artistsComparison = compareTopArtists(
      creatorSpotifyData.topArtistsAndGenres,
      visitorSpotifyData.topArtistsAndGenres
    );

    // Analyze top tracks
    const tracksComparison = compareTopTracks(
      creatorSpotifyData.topTracks,
      visitorSpotifyData.topTracks
    );

    // Audio features comparison
    const periods = ["shortTerm", "mediumTerm", "longTerm"];
    const features = ["valence", "energy", "danceability", "tempo"];

    let audioFeaturesComparison = {};

    for (let i = 0; i < features.length; i++) {
      let visitorData = [];
      let creatorData = [];
      for (let j = 0; j < periods.length; j++) {
        visitorData.push(
          Math.round(
            visitorSpotifyData.audioFeatures[features[i]][periods[j]] || 0
          )
        );
        creatorData.push(
          Math.round(
            creatorSpotifyData.audioFeatures[features[i]][periods[j]] || 0
          )
        );
      }
      audioFeaturesComparison[features[i]] = {
        visitor: visitorData,
        creator: creatorData,
      };
    }

    // console.log(audioFeaturesComparison);

    const responseData = {
      visitor: {
        info: visitorUserInfo,
      },
      creator: {
        info: creatorUserInfo,
      },
      genresComparison: genresComparison,
      artistsComparison: artistsComparison,
      tracksComparison: tracksComparison,
      audioFeaturesComparison: audioFeaturesComparison,
      obscurityComparison: {
        visitor: Math.round(visitorSpotifyData.obscurityScore || 0),
        creator: Math.round(creatorSpotifyData.obscurityScore || 0),
      },
    };
    res.send(responseData);
    // Stats
    // await db
    //   .collection(STATS)
    //   .doc(DB_COMPARIFYPAGE_COLLECTION)
    //   .update({ count: firebase.firestore.FieldValue.increment(1) });
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

module.exports = router;
