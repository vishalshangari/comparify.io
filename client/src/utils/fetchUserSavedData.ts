import axios from "axios";
import { DEV_URL } from "../constants";

export default async () => {
  try {
    const {
      data: {
        topGenres,
        userInfo,
        topTracks,
        topArtists,
        obscurityScore,
        featureScores: userFeatureScores,
        comparifyPage,
      },
    } = await axios.get(`${DEV_URL}/api/get/saved-data`, {
      withCredentials: true,
    });
    return {
      userInfo: userInfo,
      topGenres: topGenres,
      topTracks: topTracks,
      topArtists: topArtists,
      obscurityScore: obscurityScore,
      userFeatureScores: userFeatureScores,
      comparifyPage: comparifyPage,
    };
  } catch (error) {
    throw error;
  }
};
