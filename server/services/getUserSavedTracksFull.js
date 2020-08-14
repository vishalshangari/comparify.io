const { GET_ACTIVE_USER_TRACKS_URL } = require("../constants");

// Get 50 tracks from provided URL
const getTracksFromUrl = async (access_token) => {
  const requestConfig = {
    headers: { Authorization: "Bearer " + access_token },
    params: {
      limit: 50,
    },
  };

  try {
    const response = await axios.get(
      GET_ACTIVE_USER_TRACKS_URL,
      requestOptions
    );
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
