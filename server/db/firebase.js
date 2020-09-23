// // Firebase db config
// const firebase = require("firebase/app");

// require("firebase/firestore");

// const firebaseConfig = {
//   apiKey: "AIzaSyDpSApoqhZJCFY4H8CBJ2PAIJAR7P9nwio",
//   authDomain: "spotify-compare.firebaseapp.com",
//   databaseURL: "https://spotify-compare.firebaseio.com",
//   projectId: "spotify-compare",
//   storageBucket: "spotify-compare.appspot.com",
//   messagingSenderId: "85006330262",
//   appId: "1:85006330262:web:35ec12fa290e9e278515b7",
//   measurementId: "G-D9JD04E6LC",
// };

// firebase.initializeApp(firebaseConfig);

// const db = firebase.firestore();

// module.exports = db;

const firebase = require("firebase-admin");

const serviceAccount = require("./config.js");

firebase.initializeApp({
  credential: firebase.credential.cert(serviceAccount),
  databaseURL: "https://spotify-compare.firebaseio.com",
});

const db = firebase.firestore();

module.exports = db;
