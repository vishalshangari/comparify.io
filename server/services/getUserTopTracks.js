const {
  GET_ACTIVE_USER_TOP_TRACKS_URL,
  GET_AUDIO_FEATURES_URL,
} = require("../constants");
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
    console.log(`getting top tracks`, time_range);
    const {
      data: { items: userTopTracksResponseData },
    } = await axios.get(GET_ACTIVE_USER_TOP_TRACKS_URL, requestConfig);

    // Shape track data to required format
    let userTopTracks = [];
    let trackIDs = "";
    let stats = {
      danceability: 0,
      energy: 0,
      key: 0,
      loudness: 0,
      mode: 0,
      speechiness: 0,
      acousticness: 0,
      instrumentalness: 0,
      liveness: 0,
      valence: 0,
      tempo: 0,
    };

    userTopTracksResponseData.forEach((track) => {
      trackIDs += track.id + ",";
      userTopTracks.push({
        id: track.id,
        name: track.name,
        popularity: track.popularity,
      });
    });

    // Get audio features of tracks
    const {
      data: { audio_features: audioFeaturesFull },
    } = await axios.get(GET_AUDIO_FEATURES_URL, {
      params: {
        ids: trackIDs.substring(0, trackIDs.length - 1),
      },
      headers: authHeader,
    });

    for (let i = 0; i < audioFeaturesFull.length; i++) {
      // userTopTracks[i]["danceability"] = audioFeaturesFull[i]["danceability"];
      stats["danceability"] += parseFloat(audioFeaturesFull[i]["danceability"]);
      // userTopTracks[i]["energy"] = audioFeaturesFull[i]["energy"];
      stats["energy"] += parseFloat(audioFeaturesFull[i]["energy"]);
      // userTopTracks[i]["key"] = audioFeaturesFull[i]["key"];
      stats["key"] += parseFloat(audioFeaturesFull[i]["key"]);
      // userTopTracks[i]["loudness"] = audioFeaturesFull[i]["loudness"];
      stats["loudness"] += parseFloat(audioFeaturesFull[i]["loudness"]);
      // userTopTracks[i]["mode"] = audioFeaturesFull[i]["mode"];
      stats["mode"] += parseFloat(audioFeaturesFull[i]["mode"]);
      // userTopTracks[i]["speechiness"] = audioFeaturesFull[i]["speechiness"];
      stats["speechiness"] += parseFloat(audioFeaturesFull[i]["speechiness"]);
      // userTopTracks[i]["acousticness"] = audioFeaturesFull[i]["acousticness"];
      stats["acousticness"] += parseFloat(audioFeaturesFull[i]["acousticness"]);
      // userTopTracks[i]["instrumentalness"] =
      audioFeaturesFull[i]["instrumentalness"];
      stats["instrumentalness"] += parseFloat(
        audioFeaturesFull[i]["instrumentalness"]
      );
      // userTopTracks[i]["liveness"] = audioFeaturesFull[i]["liveness"];
      stats["liveness"] += parseFloat(audioFeaturesFull[i]["liveness"]);
      // userTopTracks[i]["valence"] = audioFeaturesFull[i]["valence"];
      stats["valence"] += parseFloat(audioFeaturesFull[i]["valence"]);
      // userTopTracks[i]["tempo"] = audioFeaturesFull[i]["tempo"];
      stats["tempo"] += parseFloat(audioFeaturesFull[i]["tempo"]);
    }

    for (const feature in stats) {
      // Get average danceability and save as fraction / 100
      stats[feature] =
        (stats[feature] / audioFeaturesFull.length) *
        (feature === `tempo` ? 1 : 100);
    }

    return { tracks: userTopTracks, stats: stats };
  } catch (error) {
    console.log(error);
  }
};
