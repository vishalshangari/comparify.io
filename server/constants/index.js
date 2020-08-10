const isDev = process.env.NODE_ENV !== "production";
const port = process.env.PORT || 3001;

module.exports = Object.freeze({
  // Spotify API config
  CLIENT_ID: "70f7c0f3f8a04350b0957f010488e475",
  CLIENT_SECRET: "a832c80320fc4450a0fa1dbc1465d3c0",

  // Spotify URLs
  SPOTIFY_AUTH_URL: "https://accounts.spotify.com/authorize?",
  SPOTIFY_GET_AUTH_TOKEN: "https://accounts.spotify.com/api/token",
  GET_ACTIVE_USER_PROFILE_URL: "https://api.spotify.com/v1/me",
  GET_ACTIVE_USER_TRACKS_URL: "https://api.spotify.com/v1/me/tracks",

  // Server config
  PORT: port,
  IS_DEV: isDev,
  AUTH_REDIRECT_URI: isDev
    ? "http://localhost:3001/api/login/callback"
    : "https://spotify-compare-app.herokuapp.com/api/login/callback",
  HOME_REDIRECT_URI: isDev ? "http://localhost:3000" : "",
  COOKIE_DOMAIN: isDev ? "" : "https://spotify-compare-app.herokuapp.com",

  // Others
  STATE_KEY: "spotify_auth_state",

  // DB config
  USERS: "users",
  STATS: "stats",
});
