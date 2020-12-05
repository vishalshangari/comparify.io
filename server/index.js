const express = require("express");
const path = require("path");
const request = require("request");
const cluster = require("cluster");
const queryString = require("query-string");
const cookieParser = require("cookie-parser");
const numCPUs = require("os").cpus().length;
const axios = require("axios");
const fs = require("fs");

require("dotenv").config();

// Firebase db
const firebase = require("firebase");
const db = require("./db/firebase");

// Routers
const profile = require("./routes/profile");
const create = require("./routes/create");
const deletePage = require("./routes/delete");
const get = require("./routes/get");
const auth = require("./routes/auth");
const logout = require("./routes/logout");
const comparify = require("./routes/comparify");
// TODO: recommendations route
const recommend = require("./routes/recommend");
const feedback = require("./routes/feedback");
const siteTokenInitialization = require("./routes/siteTokenInitialization");

// Models
const AppError = require("./models/AppError");

// Constants
const {
  PORT,
  IS_DEV,
  USERS,
  STATS,
  PRIVATE_TOKEN_ENDPOINTS_ENDPOINT,
} = require("./constants");

// Services
const getUserSavedTrackIDs = require("./services/getUserSavedTrackIDs");
const getUserTopTracks = require("./services/getUserTopTracks");
const getUserTopArtistsAndGenres = require("./services/getUserTopArtistsAndGenres");

// MISC
const sizeof = require("object-sizeof");

// Logging
const expressWinston = require("express-winston");
const winston = require("winston");
const { createLogger } = require("winston");

// Force HTTPS
function requireHTTPS(req, res, next) {
  // The 'x-forwarded-proto' check is for Heroku
  if (
    !req.secure &&
    req.get("x-forwarded-proto") !== "https" &&
    process.env.NODE_ENV !== "development"
  ) {
    return res.redirect("https://" + req.get("host") + req.url);
  }
  next();
}

// Force www
function wwwRedirect(req, res, next) {
  if (req.hostname.slice(0, 4) !== "www.") {
    return res.redirect(
      301,
      req.protocol + "://www." + req.hostname + req.originalUrl
    );
  }
  next();
}

const isDev = process.env.NODE_ENV !== "production";
const port = process.env.PORT || 3001;

// Multi-process to utilize all CPU cores in production
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

  if (IS_DEV) {
    const cors = require("cors");
    app.use(
      cors({
        credentials: true,
        origin: "http://localhost:3000",
      })
    );
    console.log("cors");
  } else {
    app.use(wwwRedirect);
  }

  app.use(cookieParser()).use(express.json()).use(requireHTTPS);

  // Dynamic Meta tags on static pages
  app.get("/", function (request, response) {
    console.log("Home page visited!");
    const filePath = path.resolve(__dirname, "../client/build", "index.html");

    // read in the index.html file
    fs.readFile(filePath, "utf8", function (err, data) {
      if (err) {
        return console.log(err);
      }

      // replace the special strings with server generated strings
      data = data.replace(/\$OG_TITLE/g, "Comparify");
      data = data.replace(
        /\$OG_DESCRIPTION/g,
        "Compare taste in music with others and the world"
      );
      result = data.replace(/\$OG_URL/g, "https://www.comparify.io/");
      response.send(result);
    });
  });

  app.get("/compare", function (request, response) {
    console.log("Compare page visited!");
    const filePath = path.resolve(__dirname, "../client/build", "index.html");

    // read in the index.html file
    fs.readFile(filePath, "utf8", function (err, data) {
      if (err) {
        return console.log(err);
      }

      // replace the special strings with server generated strings
      data = data.replace(/\$OG_TITLE/g, "Create a Comparify Page");
      data = data.replace(
        /\$OG_DESCRIPTION/g,
        "Comparify lets you compare taste in music with others' and the world"
      );
      result = data.replace(/\$OG_URL/g, "https://www.comparify.io/compare");
      response.send(result);
    });
  });

  app.get("/feedback", function (request, response) {
    console.log("Feedback page visited!");
    const filePath = path.resolve(__dirname, "../client/build", "index.html");

    // read in the index.html file
    fs.readFile(filePath, "utf8", function (err, data) {
      if (err) {
        return console.log(err);
      }

      // replace the special strings with server generated strings
      data = data.replace(/\$OG_TITLE/g, "Feedback | Comparify");
      data = data.replace(
        /\$OG_DESCRIPTION/g,
        "Provide feedback to the developers of Comparify."
      );
      result = data.replace(/\$OG_URL/g, "https://www.comparify.io/feedback");
      response.send(result);
    });
  });

  app.get("/:id", function (request, response) {
    const id = request.params.id;
    console.log("Comparify page visited!");
    const filePath = path.resolve(__dirname, "../client/build", "index.html");

    // read in the index.html file
    fs.readFile(filePath, "utf8", function (err, data) {
      if (err) {
        return console.log(err);
      }

      // replace the special strings with server generated strings
      data = data.replace(/\$OG_TITLE/g, `${id} | Comparify`);
      data = data.replace(
        /\$OG_DESCRIPTION/g,
        "Compare your taste in music with me! Comparify lets you compare taste in music with others and the world"
      );
      result = data.replace(/\$OG_URL/g, `https://www.comparify.io/${id}`);
      response.send(result);
    });
  });

  // Priority serve any static files.
  app.use(express.static(path.resolve(__dirname, "../client/build")));

  // Answer API requests.
  app.get("/api", (req, res) => {
    res.set("Content-Type", "application/json");
    res.send({ message: "hello from my backend API!" });
  });

  // Routes
  app.use("/api/auth", auth);

  app.use("/api/logout", logout);

  app.use("/api/profile", profile);

  app.use("/api/create", create);

  app.use("/api/delete", deletePage);

  app.use("/api/get", get);

  app.use("/api/comparify", comparify);

  app.use("/api/feedback", feedback);

  app.use(
    `/api/private/${PRIVATE_TOKEN_ENDPOINTS_ENDPOINT}`,
    siteTokenInitialization
  );

  // All remaining requests return the React app, so React Router can handle forwarding.
  app.get("*", (req, res) => {
    res.sendFile(path.resolve(__dirname, "../client/build", "index.html"));
  });

  app.listen(PORT, () => {
    console.error(
      `Node ${
        IS_DEV ? "dev server" : "cluster worker " + process.pid
      }: listening on port ${PORT}`
    );
  });
}
