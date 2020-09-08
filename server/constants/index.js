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
  GET_USER_PROFILE_URL: "https://api.spotify.com/v1/users/",
  GET_ACTIVE_USER_TRACKS_URL: "https://api.spotify.com/v1/me/tracks",
  GET_ACTIVE_USER_TOP_TRACKS_URL: "https://api.spotify.com/v1/me/top/tracks",
  GET_ACTIVE_USER_TOP_ARTISTS_URL: "https://api.spotify.com/v1/me/top/artists",
  GET_TRACKS_URL: "https://api.spotify.com/v1/tracks",
  GET_ARTISTS_URL: "https://api.spotify.com/v1/artists",
  GET_AUDIO_FEATURES_URL: "https://api.spotify.com/v1/audio-features",
  GET_RECOMMENDATIONS_URL: "https://api.spotify.com/v1/recommendations",

  // Server config
  PORT: port,
  IS_DEV: isDev,
  AUTH_REDIRECT_URI: isDev
    ? "http://localhost:3001/api/auth/login/callback"
    : "https://spotify-compare-app.herokuapp.com/api/auth/login/callback",
  HOME_REDIRECT_URI: isDev ? "http://localhost:3000/" : "/",
  COMPARIFY_TOKEN_COOKIE_KEY: "comparifyToken",
  COOKIE_DOMAIN: isDev ? "" : "https://spotify-compare-app.herokuapp.com",
  MAX_COOKIE_AGE: 604800000, // One week, should be same as JWT expiration
  SERVER_PRIVATE_KEY: "serverPrivateAPIKey",
  ACCESS_TOKEN_REFRESH_PERIOD: 3420000, // Just less than one hour
  PRIVATE_TOKEN_ENDPOINTS_ENDPOINT: "NMkfJd901xz0uKmuT67sE0pXJFROc1OLvmVsdE7z",

  RESPONSE_CODES: RESPONSE_CODES,
  ERROR_CODES: ERROR_CODES,

  // Client
  DEV_URL: isDev ? "http://localhost:3001" : "",

  // Others
  ALPHANUMERIC:
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789",
  FEATURES: [
    "danceability",
    "energy",
    "key",
    "loudness",
    "mode",
    "speechiness",
    "acousticness",
    "instrumentalness",
    "liveness",
    "valence",
    "tempo",
  ],

  // DB config
  USERS: "users",
  STATS: "stats",
  DB_SITE_CONFIGURATIONS: "config",
  DB_SITE_TOKENS: "tokens",
  DB_COMPARIFYPAGE_COLLECTION: "comparifyPages",
});
