const express = require("express");
const axios = require("axios");
const sizeof = require("object-sizeof");

// Firebase db
const db = require("../db/firebase");

// Constnats
const { GET_ACTIVE_USER_TRACKS_URL } = require("../constants");

const router = express.Router();

router.post("/", async (req, res) => {
  // Get 50 tracks from provided URL
  const getTracksFromUrl = async (url) => {
    // Generic request options including auth token from client
    const requestOptions = {
      headers: { Authorization: req.headers.authorization },
      params: {
        limit: 50,
      },
    };

    try {
      const response = await axios.get(url, requestOptions);
      const {
        data: { items: fetchedTracks },
      } = response;

      const savedTracks = [];

      // Re-shape tracks into format to be saved
      fetchedTracks.forEach((fetchedTrack) => {
        artists = [];
        fetchedTrack.track.artists.forEach((artist) => {
          artists.push(artist.uri);
        });

        savedTracks.push({
          name: fetchedTrack.track.name,
          album: {
            id: fetchedTrack.track.album.id,
            name: fetchedTrack.track.album.name,
            uri: fetchedTrack.track.album.uri,
          },
          artists: artists,
          id: fetchedTrack.track.id,
          popularity: fetchedTrack.track.popularity,
          preview_url: fetchedTrack.track.preview_url,
          uri: fetchedTrack.track.uri,
        });
      });

      // console.log(
      //   `Size difference: ${sizeof(fetchedTracks[0])} -- ${sizeof(
      //     savedTracks[0]
      //   )}`
      // );

      // Return tracks to be saved and next fetch URL
      return { tracks: savedTracks, next: response.data.next };
    } catch (error) {
      console.error(error);
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
        console.error(error);
      }
    }

    return tracks;
  };

  // Execute async function to process & write data
  const processData = async () => {
    console.log(`fetching...`);
    const fullTrackList = await getAllTracks();
    console.log("finished fetching");
    console.log(`total songs: ${fullTrackList.length}`);
    // let total = 0;
    // fullTrackList.forEach((track) => {
    //   total += track.popularity;
    // });

    // Write test data
    console.log("writing...");
    await db.collection("users").doc("1").set({ list: fullTrackList });
    console.log("finished writing");

    // Display stats
    console.log(sizeof(fullTrackList), "bytes");

    // console.log(
    //   `Total popularity score: ${total}, and average: ${
    //     total / fullTrackList.length
    //   }`
    // );

    // Read test data
    console.log("reading...");
    const doc = await db.collection("users").doc("1").get();
    const data = doc.data();
    console.log("finished reading");

    // Send test data
    console.log("sending...");
    res.json(data);
    console.log("sent");
  };

  processData();
});

module.exports = router;
