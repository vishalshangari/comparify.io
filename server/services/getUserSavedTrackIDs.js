// Get active user's saved tracks - (not being used)

const { GET_ACTIVE_USER_TRACKS_URL } = require("../constants");
const axios = require("axios");

module.exports = (authHeader) => {
  // Get 50 tracks from provided URL
  // TODO: can be optimized by making first request, then creating array of promises = the total # of tracks in the response / 50 per request -> Promise.all
  const getTracksFromUrl = async (url) => {
    const requestConfig = {
      headers: authHeader,
      params: {
        limit: 50,
      },
    };

    try {
      const {
        data: { items: userSavedTracksResponseData, next },
      } = await axios.get(url, requestConfig);

      const userSavedTrackIDs = [];

      // Re-shape tracks into format to be saved
      userSavedTracksResponseData.forEach((track) => {
        userSavedTrackIDs.push(track.track.id);
      });

      // Return tracks to be saved and next fetch URL
      return { tracks: userSavedTrackIDs, next: next };
    } catch (error) {
      throw error;
    }
  };

  // Recursive function to get all of the current user's saved tracks
  const getAllTracks = async (url = GET_ACTIVE_USER_TRACKS_URL) => {
    const { tracks, next } = await getTracksFromUrl(url);

    while (next) {
      try {
        const nextTracks = await getAllTracks(next);
        return tracks.concat(...nextTracks);
      } catch (error) {
        throw error;
      }
    }
    return tracks;
  };

  console.log("getting saved track IDs");
  return getAllTracks();
};
