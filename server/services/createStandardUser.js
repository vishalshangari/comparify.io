const getUserTopArtistsAndGenres = require("./getUserTopArtistsAndGenres");
const getUserSavedTrackIDs = require("./getUserSavedTrackIDs");
const getUserTopTracks = require("./getUserTopTracks");
const sizeof = require("object-sizeof");
const getUserObscurityScore = require("./getUserObscurityScore");

// Requires authHeader and userInfo (from main login router)
module.exports = async (authHeader, userInfo) => {
  console.log("started generating...");
  const time = Date.now();

  const savedTracks = getUserSavedTrackIDs(authHeader);
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

  const result = await Promise.all([
    savedTracks, // result [0]
    topTracksShortTerm,
    topTracksMediumTerm,
    topTracksLongTerm,
    topArtistsShortTerm,
    topArtistsMediumTerm,
    topArtistsLongTerm,
  ]);

  console.log(`TOP ARTISTS SHORT TERM: `, result[4].topArtists);

  const standardUserData = {
    info: userInfo,
    spotifyData: {
      savedTracks: result[0],
      topTracks: {
        shortTerm: result[1].tracks,
        mediumTerm: result[2].tracks,
        longTerm: result[3].tracks,
      },
      topArtistsAndGenres: {
        shortTerm: result[4],
        mediumTerm: result[5],
        longTerm: result[6],
      },
      audioFeatures: {
        shortTerm: result[1].stats,
        mediumTerm: result[2].stats,
        longTerm: result[3].stats,
      },
    },
  };

  standardUserData.spotifyData.obscurityScore = getUserObscurityScore(
    standardUserData.spotifyData.topArtistsAndGenres,
    standardUserData.spotifyData.topTracks
  );

  console.log("done generating: " + (Date.now() - time) / 1000 + " seconds");

  return standardUserData;
};
