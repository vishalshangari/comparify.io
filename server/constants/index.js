const isDev = process.env.NODE_ENV !== "production";
const port = process.env.PORT || 3001;

const RESPONSE_CODES = {
  // Auth response status codes
  NO_ACTIVE_SESSION: "NO_ACTIVE_SESSION",
  AUTHENTICATED: "SESSION_AUTHENTICATED",
  AUTHENTICATION_ERROR: "AUTHENTICATION_ERROR",
};

const ERROR_CODES = {
  // Server error codes
  EXPIRED_TOKEN: "EXPIRED_TOKEN",
  INVALID_TOKEN: "INVALID_TOKEN",
};

module.exports = Object.freeze({
  // Spotify API config
  CLIENT_ID: "70f7c0f3f8a04350b0957f010488e475",
  CLIENT_SECRET: "a832c80320fc4450a0fa1dbc1465d3c0",
  SPOTIFY_AUTH_STATE_KEY: "spotify_auth_state",
  SPOTIFY_API_SCOPES:
    "playlist-read-collaborative playlist-read-private user-read-private user-library-modify user-library-read user-top-read user-read-recently-played",

  // Spotify URLs
  SPOTIFY_AUTH_URL: "https://accounts.spotify.com/authorize?",
  SPOTIFY_GET_AUTH_TOKEN_URL: "https://accounts.spotify.com/api/token",
  GET_ACTIVE_USER_PROFILE_URL: "https://api.spotify.com/v1/me",
  GET_ACTIVE_USER_TRACKS_URL: "https://api.spotify.com/v1/me/tracks",
  GET_ACTIVE_USER_TOP_TRACKS_URL: "https://api.spotify.com/v1/me/top/tracks",
  GET_ACTIVE_USER_TOP_ARTISTS_URL: "https://api.spotify.com/v1/me/top/artists",

  // Server config
  PORT: port,
  IS_DEV: isDev,
  AUTH_REDIRECT_URI: isDev
    ? "http://localhost:3001/api/login/callback"
    : "https://spotify-compare-app.herokuapp.com/api/login/callback",
  HOME_REDIRECT_URI: isDev ? "http://localhost:3000" : "",
  COMPARIFY_TOKEN_COOKIE_KEY: "comparifyToken",
  COOKIE_DOMAIN: isDev ? "" : "https://spotify-compare-app.herokuapp.com",
  MAX_COOKIE_AGE: 604800, // One week, should be same as JWT expiration

  RESPONSE_CODES: RESPONSE_CODES,
  ERROR_CODES: ERROR_CODES,

  // Others
  ALPHANUMERIC:
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789",

  // DB config
  USERS: "users",
  STATS: "stats",
});
