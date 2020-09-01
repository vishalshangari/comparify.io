const express = require("express");
const router = express.Router();
const AppError = require("../models/AppError");

// Services
const getUserSavedTrackIDs = require("../services/getUserSavedTrackIDs");
const getUserTopTracks = require("../services/getUserTopTracks");
const getUserTopArtistsAndGenres = require("../services/getUserTopArtistsAndGenres");

// Utils
const catchAsync = require("../utils/catchAsync");

router.get(
  "/test",
  catchAsync(async (req, res, next) => {
    const accessT =
      "BQBF6mxoMXJdPO3mT7NOGknS9blPJ9ScCTnGhyZMlwAPX3SaLqM-LODB6-12RFkJFTwJyuW3G004Ur9UcvXsg3q8xDY10gEANIYiHpTu4CbjmPOwSabdKG9b3JK3PEraO-ZK8OQT_dYQdOGf3wSrAqVF1JXFQk2aNHWVvYYkMGVmyL0mRpqQ6VZfWyhARtFD6-zYGQ";
    const authHeader = {
      Authorization: "Bearer " + accessT,
    };
    console.log("started generating...");
    // const userinfo = await createNewUserWithData(authHeader);
    // try {
    const tracks = await getUserSavedTrackIDs(authHeader);
    const tracksst = await getUserTopTracks(authHeader, "short_term");
    const tracksmt = await getUserTopTracks(authHeader, "medium_term");
    const trackslt = await getUserTopTracks(authHeader, "long_term");
    const artistslt = await getUserTopArtistsAndGenres(authHeader, "long_term");
    const artistsmt = await getUserTopArtistsAndGenres(
      authHeader,
      "medium_term"
    );
    const artistsst = await getUserTopArtistsAndGenres(
      authHeader,
      "short_term"
    );
    const user = {
      // profile: userinfo,
      tracks: tracks,
      tracksst: tracksst,
      tracksmt: tracksmt,
      trackslt: trackslt,
      artistsst: artistsst,
      artistsmt: artistsmt,
      artistslt: artistslt,
    };
    console.log("done generating.");
    console.log(sizeof(user));
    res.send(user);
    // } catch (error) {
    //   next(new AppError(error.message, 502));
    // }
  })
);

module.exports = router;
