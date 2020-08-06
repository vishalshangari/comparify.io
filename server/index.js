const express = require("express");
const path = require("path");
const cluster = require("cluster");
const queryString = require("query-string");
const cookieParser = require("cookie-parser");
const numCPUs = require("os").cpus().length;
require("dotenv").config();

const isDev = process.env.NODE_ENV !== "production";
const port = process.env.PORT || 3001;

// Spotify API config
const client_id = "70f7c0f3f8a04350b0957f010488e475";
const client_secret = "a832c80320fc4450a0fa1dbc1465d3c0";
const redirect_uri = "http://localhost:3001/api/callback";
const spotify_auth_url = "https://accounts.spotify.com/authorize?";

/**
 * Generates a random string containing numbers and letters
 * @param  {number} length The length of the string
 * @return {string} The generated string
 */
const generateRandomString = (length) => {
  var text = "";
  const possible =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

  for (let i = 0; i < length; i++) {
    text += possible.charAt(Math.floor(Math.random() * possible.length));
  }
  return text;
};

const stateKey = "spotify_auth_state";

// Multi-process to utilize all CPU cores.
if (!isDev && cluster.isMaster) {
  console.error(`Node cluster master ${process.pid} is running`);

  // Fork workers.
  for (let i = 0; i < numCPUs; i++) {
    cluster.fork();
  }

  cluster.on("exit", (worker, code, signal) => {
    console.error(
      `Node cluster worker ${worker.process.pid} exited: code ${code}, signal ${signal}`
    );
  });
} else {
  const app = express();
  app.use(cookieParser());

  // Priority serve any static files.
  app.use(express.static(path.resolve(__dirname, "../client/build")));

  if (process.env.NODE_ENV === "development") {
    const cors = require("cors");
    app.use(cors());
  }

  // Answer API requests.
  app.get("/api", (req, res) => {
    res.set("Content-Type", "application/json");
    res.send({ message: "hello from my backend API!" });
  });

  app.get("/api/login", (req, res) => {
    // Set auth request state cookie
    const state = generateRandomString(16);
    res.cookie(stateKey, state);

    // Request authorization
    const scope = "user-read-private user-read-email";

    res.redirect(
      spotify_auth_url +
        queryString.stringify({
          response_type: "code",
          client_id: client_id,
          scope: scope,
          redirect_uri: redirect_uri,
          state: state,
        })
    );
  });

  app.get("/api/callback", (req, res) => {
    const code = req.query.code || null;
    const state = req.query.state || null;
    const storedState = req.cookies ? req.cookies[stateKey] : null;

    res.set("Content-Type", "application/json");
    res.send({ state: state, code: code, storedState: storedState });
  });

  // All remaining requests return the React app, so it can handle routing.
  app.get("*", (req, res) => {
    res.sendFile(path.resolve(__dirname, "../rclient/build", "index.html"));
  });

  app.listen(port, () => {
    console.error(
      `Node ${
        isDev ? "dev server" : "cluster worker " + process.pid
      }: listening on port ${port}`
    );
  });
}
