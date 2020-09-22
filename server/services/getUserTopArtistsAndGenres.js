// Get user's top artists and genres

const { GET_ACTIVE_USER_TOP_ARTISTS_URL } = require("../constants");
const axios = require("axios");

module.exports = async (authHeader, time_range = "medium_term") => {
  const requestConfig = {
    headers: authHeader,
    params: {
      limit: 50,
      time_range: time_range,
    },
  };
  try {
    // Get user profile info
    console.log(`getting top artists`, time_range);
    const {
      data: { items: userTopArtistsResponseData },
    } = await axios.get(GET_ACTIVE_USER_TOP_ARTISTS_URL, requestConfig);

    // Shape artist and genre data to required format
    let userTopArtists = [];
    let userTopArtistsGenres = [];

    userTopArtistsResponseData.forEach((artist) => {
      userTopArtists.push({
        id: artist.id,
        name: artist.name,
        popularity: artist.popularity,
      });
      userTopArtistsGenres.push(artist.genres);
    });

    // Generate sorted list of genres
    const mergedGenresList = [].concat.apply([], userTopArtistsGenres);
    const userTopGenreCounts = {};
    mergedGenresList.forEach((genre) => {
      userTopGenreCounts[genre] = (userTopGenreCounts[genre] || 0) + 1;
    });
    const userTopGenresListSortedArrays = Object.entries(
      userTopGenreCounts
    ).sort((a, b) => b[1] - a[1]);

    let userTopGenresListSortedObjects = [];

    userTopGenresListSortedArrays.forEach((pair) => {
      userTopGenresListSortedObjects.push({
        name: pair[0],
        count: pair[1],
      });
    });

    return {
      topArtists: userTopArtists,
      topGenres: userTopGenresListSortedObjects,
    };
  } catch (error) {
    // LOG error
    console.log(error);
    throw error;
  }
};
