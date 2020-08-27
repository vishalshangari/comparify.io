const express = require("express");
const path = require("path");
const request = require("request");
const cluster = require("cluster");
const queryString = require("query-string");
const cookieParser = require("cookie-parser");
const numCPUs = require("os").cpus().length;
const axios = require("axios");

require("dotenv").config();

// Firebase db
const firebase = require("firebase");
const db = require("./db/firebase");

// Routers
const profile = require("./routes/profile");
// const generate = require("./routes/generate");
const create = require("./routes/create");
const get = require("./routes/get");
const auth = require("./routes/auth");
const logout = require("./routes/logout");
const comparify = require("./routes/comparify");

// Constants
const { PORT, IS_DEV, USERS, STATS } = require("./constants");

// Services
const getUserSavedTrackIDs = require("./services/getUserSavedTrackIDs");
const getUserTopTracks = require("./services/getUserTopTracks");
const getUserTopArtistsAndGenres = require("./services/getUserTopArtistsAndGenres");

const sizeof = require("object-sizeof");

// Firestore initial script
// const songRef = db.collection("songs").doc("jKVoXZPJm0g8aRwarEv2");

// (async () => {
//   const doc = await songRef.get();
//   if (!doc.exists) {
//     console.log("No such document!");
//   } else {
//     console.log("Document data:", doc.data());
//   }
// })();

const datatowrite = {
  name: "Vishal",
  spotifyId: "1233",
  age: "250",
  interests: {
    travel: {},
    reading: {
      books: {
        genres: {
          fiction: ["great gatsby", "sherlock holmes"],
          "non-fiction": ["4 hour work week", "sapiens"],
        },
      },
    },
  },
};

// (async () => {
//   console.log(datatowrite);
//   await db.collection("my users").doc(datatowrite.spotifyId).set(datatowrite);
// })();

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
  app.use(cookieParser()).use(express.json());

  //Add headers
  // app.use(function (req, res, next) {
  //   // Website you wish to allow to connect
  //   res.setHeader("Access-Control-Allow-Origin", "http://localhost:3000");

  //   // Request methods you wish to allow
  //   res.setHeader(
  //     "Access-Control-Allow-Methods",
  //     "GET, POST, OPTIONS, PUT, PATCH, DELETE"
  //   );

  //   // Request headers you wish to allow
  //   res.setHeader(
  //     "Access-Control-Allow-Headers",
  //     "X-Requested-With,content-type"
  //   );

  //   // Set to true if you need the website to include cookies in the requests sent
  //   // to the API (e.g. in case you use sessions)
  //   res.setHeader("Access-Control-Allow-Credentials", true);

  //   // Pass to next layer of middleware
  //   next();
  // });

  // Priority serve any static files.
  app.use(express.static(path.resolve(__dirname, "../client/build")));

  // Enable CORS for dev
  if (IS_DEV) {
    const cors = require("cors");
    app.use(
      cors({
        credentials: true,
        origin: "http://localhost:3000",
      })
    );
    console.log("cors");
  }

  // Answer API requests.
  app.get("/api", (req, res) => {
    res.set("Content-Type", "application/json");
    res.send({ message: "hello from my backend API!" });
  });

  // Routes
  app.use("/api/auth", auth);

  app.use("/api/logout", logout);

  app.use("/api/profile", profile);

  // app.use("/api/generate", generate);

  app.use("/api/create", create);

  app.use("/api/get", get);

  app.use("/api/comparify", comparify);

  app.use("/api/apitest", async (req, res) => {
    const accessT =
      "BQBF6mxoMXJdPO3mT7NOGknS9blPJ9ScCTnGhyZMlwAPX3SaLqM-LODB6-12RFkJFTwJyuW3G004Ur9UcvXsg3q8xDY10gEANIYiHpTu4CbjmPOwSabdKG9b3JK3PEraO-ZK8OQT_dYQdOGf3wSrAqVF1JXFQk2aNHWVvYYkMGVmyL0mRpqQ6VZfWyhARtFD6-zYGQ";
    const authHeader = {
      Authorization: "Bearer " + accessT,
    };
    console.log("started generating...");
    // const userinfo = await createNewUserWithData(authHeader);
    const tracks = await getUserSavedTrackIDs(authHeader);
    const tracksst = await getUserTopTracks(authHeader, "short_term");
    const tracksmt = await getUserTopTracks(authHeader, "medium_term");
    const trackslt = await getUserTopTracks(authHeader, "long_term");
    const artistslt = await getUserTopArtistsAndGenres(authHeader, "long_term");
    const artistsmt = await getUserTopArtistsAndGenres(
      authHeader,
      "medium_term"
    );
    const artistsst = await getUserTopArtistsAndGenres(
      authHeader,
      "short_term"
    );
    const user = {
      // profile: userinfo,
      tracks: tracks,
      tracksst: tracksst,
      tracksmt: tracksmt,
      trackslt: trackslt,
      artistsst: artistsst,
      artistsmt: artistsmt,
      artistslt: artistslt,
    };
    console.log("done generating.");
    console.log(sizeof(user));
    res.send(user);
  });

  app.get("/api/dbtest", async (req, res) => {
    const country = "CN";
    const countryUpdateKey = `countries.${country}`;
    const time = Date.now();

    userAggregationUpdates = {
      [countryUpdateKey]: firebase.firestore.FieldValue.increment(1),
      count: firebase.firestore.FieldValue.increment(1),
      userCreationTimestamps: firebase.firestore.FieldValue.arrayUnion(time),
    };

    try {
      await db.collection(STATS).doc(USERS).update(userAggregationUpdates);
    } catch (error) {
      console.log(error);
    }

    res.send("successful db test!");
  });

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
