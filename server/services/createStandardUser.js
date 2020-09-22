// Generate standard user using other services
const getUserTopArtistsAndGenres = require("./getUserTopArtistsAndGenres");
const getUserSavedTrackIDs = require("./getUserSavedTrackIDs");
const getUserTopTracks = require("./getUserTopTracks");
const sizeof = require("object-sizeof");
const getUserObscurityScore = require("./getUserObscurityScore");
const { FEATURES } = require("../constants");

// Requires authHeader and userInfo (from main login router)
module.exports = async (authHeader, userInfo) => {
  console.log("started generating...");
  const time = Date.now();

  // const savedTracks = getUserSavedTrackIDs(authHeader);
  const topTracksShortTerm = getUserTopTracks(authHeader, "short_term");
  const topTracksMediumTerm = getUserTopTracks(authHeader, "medium_term");
  const topTracksLongTerm = getUserTopTracks(authHeader, "long_term");
  const topArtistsShortTerm = getUserTopArtistsAndGenres(
    authHeader,
    "short_term"
  );
  const topArtistsMediumTerm = getUserTopArtistsAndGenres(
    authHeader,
    "medium_term"
  );
  const topArtistsLongTerm = getUserTopArtistsAndGenres(
    authHeader,
    "long_term"
  );

  const result = await Promise.allSettled([
    // savedTracks,
    topTracksShortTerm, // result [0]
    topTracksMediumTerm,
    topTracksLongTerm,
    topArtistsShortTerm,
    topArtistsMediumTerm,
    topArtistsLongTerm,
  ]);

  let userCreationErrors = [];

  const getPromiseResult = (result) => {
    if (result.status !== `fulfilled`) {
      userCreationErrors.push({
        name: result.reason.name,
        file: result.reason.fileName || "",
        message: result.reason.message,
        stack: result.reason.stack || "",
      });
      return [];
    }
    return result.value;
  };

  const defaultTopAristsAndGenresObj = {
    topArtists: [],
    topGenres: [],
  };

  const periods = ["shortTerm", "mediumTerm", "longTerm"];
  const reshapeAudioFeatures = (initialScores) => {
    let result = {};
    for (let i = 0; i < FEATURES.length; i++) {
      result[FEATURES[i]] = {};
      for (let j = 0; j < periods.length; j++) {
        result[FEATURES[i]][periods[j]] =
          initialScores[periods[j]][FEATURES[i]] || null;
      }
    }
    return result;
  };

  const standardUserData = {
    info: userInfo,
    spotifyData: {
      // savedTracks: getPromiseResult(result[0]),
      topTracks: {
        shortTerm: getPromiseResult(result[0]).tracks || [],
        mediumTerm: getPromiseResult(result[1]).tracks || [],
        longTerm: getPromiseResult(result[2]).tracks || [],
      },
      topArtistsAndGenres: {
        shortTerm: getPromiseResult(result[3]) || defaultTopAristsAndGenresObj,
        mediumTerm: getPromiseResult(result[4]) || defaultTopAristsAndGenresObj,
        longTerm: getPromiseResult(result[5]) || defaultTopAristsAndGenresObj,
      },
      audioFeatures: reshapeAudioFeatures({
        shortTerm: getPromiseResult(result[0]).stats || {},
        mediumTerm: getPromiseResult(result[1]).stats || {},
        longTerm: getPromiseResult(result[2]).stats || {},
      }),
    },
    _creationErrors: userCreationErrors,
  };

  standardUserData.spotifyData.obscurityScore =
    getUserObscurityScore(
      standardUserData.spotifyData.topArtistsAndGenres,
      standardUserData.spotifyData.topTracks
    ) || null;

  console.log("done generating: " + (Date.now() - time) / 1000 + " seconds");

  return standardUserData;
};
