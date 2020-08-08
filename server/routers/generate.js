const express = require("express");
const axios = require("axios");

// Firebase db
const db = require("../db/firebase");

// Constnats
const { GET_ACTIVE_USER_TRACKS_URL } = require("../constants");

const router = express.Router();

router.post("/", async (req, res) => {
  const requestOptions = {
    headers: { Authorization: req.headers.authorization },
    params: {
      limit: 50,
    },
  };

  //Get 50 tracks from provided URL
  const getTracksFromUrl = async (url) => {
    try {
      const response = await axios.get(url, requestOptions);
      return response.data;
    } catch (error) {
      console.error(error);
    }
  };

  // Recursive function to get all of the current user's saved tracks
  const getAllTracks = async (url = GET_ACTIVE_USER_TRACKS_URL) => {
    const response = await getTracksFromUrl(url);
    const trackList = response.items;
    while (response.next) {
      try {
        const nextTracks = await getAllTracks(response.next);
        return trackList.concat(nextTracks);
      } catch (error) {
        console.error(error);
      }
    }
    return trackList;
  };

  // Execute async function to request & process data
  (async () => {
    console.log(`Fetching...`);
    const fullTrackList = await getAllTracks();
    console.log(`Total songs: ${fullTrackList.length}`);
    let total = 0;
    for (let i = 0; i < fullTrackList.length; ++i) {
      total += fullTrackList[i].track.popularity;
    }
    // await db
    //   .collection("users")
    //   .doc("saved-tracks")
    //   .set({ list: fullTrackList });
    await db.collection("testcollection");
    console.log(
      `Total popularity score: ${total}, and average: ${
        total / fullTrackList.length
      }`
    );
    res.json(fullTrackList);
  })();
});

module.exports = router;
