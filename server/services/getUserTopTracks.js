const { GET_ACTIVE_USER_TOP_TRACKS_URL } = require("../constants");
const axios = require("axios");

module.exports = async (authHeader, time_range = "medium_term") => {
  try {
    const requestConfig = {
      headers: authHeader,
      params: {
        limit: 50,
        time_range: time_range,
      },
    };
    // Get user profile info
    const {
      data: { items: userTopTracksResponseData },
    } = await axios.get(GET_ACTIVE_USER_TOP_TRACKS_URL, requestConfig);

    // Shape track data to required format
    const userTopTracks = [];

    userTopTracksResponseData.forEach((track) => {
      userTopTracks.push({
        id: track.id,
        name: track.name,
        popularity: track.popularity,
      });
    });

    return userTopTracks;
  } catch (error) {
    console.log(error);
  }
};
