const getUserTopArtistsAndGenres = require("./getUserTopArtistsAndGenres");
const getUserSavedTrackIDs = require("./getUserSavedTrackIDs");
const getUserTopTracks = require("./getUserTopTracks");
const sizeof = require("object-sizeof");

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

  const standardUserData = {
    info: userInfo,
    spotifyData: {
      savedTracks: result[0],
      topTracks: {
        shortTerm: result[1],
        mediumTerm: result[2],
        longTerm: result[3],
      },
      topArtists: {
        shortTerm: result[4],
        mediumTerm: result[5],
        longTerm: result[6],
      },
    },
    // TODO: analysis data
  };

  console.log("done generating: " + (Date.now() - time) / 1000 + " seconds");

  console.log(sizeof(standardUserData));

  return standardUserData;
};
