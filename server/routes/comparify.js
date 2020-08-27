const express = require("express");
const { DB_COMPARIFYPAGE_COLLECTION, USERS, STATS } = require("../constants");
const router = express.Router();
const jwt = require("jsonwebtoken");

// Utils
const compareTopGenres = require("../utils/compareTopGenres");
const compareTopArtists = require("../utils/compareTopArtists");
const compareTopTracks = require("../utils/compareTopTracks");

// Database
const db = require("../db/firebase");
const firebase = require("firebase");

// Create new page / page name already checked for existence client side
router.get("/:comparifyPageName", async (req, res) => {
  try {
    const { comparifyPageName } = req.params;

    const { _id: visitorID } = jwt.verify(
      req.cookies["comparifyToken"],
      process.env.JWT_SECRET
    );

    const comparifyPageRef = db
      .collection(DB_COMPARIFYPAGE_COLLECTION)
      .doc(comparifyPageName);
    const { creator } = (await comparifyPageRef.get()).data();

    const creatorRef = db.collection(USERS).doc(creator._id).get();
    const visitorRef = db.collection(USERS).doc(visitorID).get();

    const refResponse = await Promise.all([creatorRef, visitorRef]);

    const {
      info: creatorUserInfo,
      spotifyData: creatorSpotifyData,
    } = refResponse[0].data();
    const {
      info: visitorUserInfo,
      spotifyData: visitorSpotifyData,
    } = refResponse[1].data();

    // Analyze top genres

    const genresComparison = compareTopGenres(
      creatorSpotifyData.topArtistsAndGenres,
      visitorSpotifyData.topArtistsAndGenres
    );

    const artistsComparison = compareTopArtists(
      creatorSpotifyData.topArtistsAndGenres,
      visitorSpotifyData.topArtistsAndGenres
    );

    const tracksComparison = compareTopTracks(
      creatorSpotifyData.topTracks,
      visitorSpotifyData.topTracks
    );

    // let genresComparison = {
    //   allTime: {
    //     shared: intersection(
    //       creatorSpotifyData.topArtistsAndGenres.longTerm.topGenres,
    //       visitorSpotifyData.topArtistsAndGenres.longTerm.topGenres
    //     ),
    //   },
    // };

    // genresComparison.allTime.visitorUnique = difference(
    //   visitorSpotifyData.topArtistsAndGenres.longTerm.topGenres,
    //   genresComparison.allTime.shared
    // );

    // genresComparison.allTime.creatorUnique = difference(
    //   creatorSpotifyData.topArtistsAndGenres.longTerm.topGenres,
    //   genresComparison.allTime.shared
    // );

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
            visitorSpotifyData.audioFeatures[periods[j]][features[i]] || 0
          )
        );
        creatorData.push(
          Math.round(
            creatorSpotifyData.audioFeatures[periods[j]][features[i]] || 0
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
    };
    res.send(responseData);
    // Stats
    // await db
    //   .collection(STATS)
    //   .doc(DB_COMPARIFYPAGE_COLLECTION)
    //   .update({ count: firebase.firestore.FieldValue.increment(1) });
  } catch (error) {
    console.error(error);
  }
});

module.exports = router;
