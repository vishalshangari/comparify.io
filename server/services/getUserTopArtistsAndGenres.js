const { GET_ACTIVE_USER_TOP_ARTISTS_URL } = require("../constants");
const axios = require("axios");
const { merge } = require("../routers/login");

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
    const userTopGenresListSorted = Object.entries(userTopGenreCounts).sort(
      (a, b) => b[1] - a[1]
    );

    return {
      topArtists: userTopArtists,
      topGenres: userTopGenresListSorted,
    };
  } catch (error) {
    console.log(error);
  }
};
