const firebase = require("firebase-admin");

const serviceAccount = require("./config.js");

firebase.initializeApp({
  credential: firebase.credential.cert(serviceAccount),
  databaseURL: "https://spotify-compare.firebaseio.com",
});

const db = firebase.firestore();

module.exports = db;
