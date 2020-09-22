// Perform a comparison of 2 users' top tracks

const intersection = require("lodash/intersection");
const difference = require("lodash/difference");

module.exports = (creatorTopTracks, visitorTopTracks) => {
  let creatorTopTracksShortTerm = [];

  creatorTopTracks.shortTerm.forEach((track) => {
    creatorTopTracksShortTerm.push(track.id);
  });

  let visitorTopTracksShortTerm = [];
  visitorTopTracks.shortTerm.forEach((track) => {
    visitorTopTracksShortTerm.push(track.id);
  });

  let creatorTopTracksMediumTerm = [];

  creatorTopTracks.mediumTerm.forEach((track) => {
    creatorTopTracksMediumTerm.push(track.id);
  });

  let visitorTopTracksMediumTerm = [];
  visitorTopTracks.mediumTerm.forEach((track) => {
    visitorTopTracksMediumTerm.push(track.id);
  });

  let creatorTopTracksLongTerm = [];

  creatorTopTracks.longTerm.forEach((track) => {
    creatorTopTracksLongTerm.push(track.id);
  });

  let visitorTopTracksLongTerm = [];
  visitorTopTracks.longTerm.forEach((track) => {
    visitorTopTracksLongTerm.push(track.id);
  });

  return {
    now: {
      shared: intersection(
        creatorTopTracksShortTerm,
        visitorTopTracksShortTerm
      ),
      creatorUnique: difference(
        creatorTopTracksShortTerm,
        visitorTopTracksShortTerm
      ),
      visitorUnique: difference(
        visitorTopTracksShortTerm,
        creatorTopTracksShortTerm
      ),
    },
    recent: {
      shared: intersection(
        creatorTopTracksMediumTerm,
        visitorTopTracksMediumTerm
      ),
      creatorUnique: difference(
        creatorTopTracksMediumTerm,
        visitorTopTracksMediumTerm
      ),
      visitorUnique: difference(
        visitorTopTracksMediumTerm,
        creatorTopTracksMediumTerm
      ),
    },
    allTime: {
      shared: intersection(creatorTopTracksLongTerm, visitorTopTracksLongTerm),
      creatorUnique: difference(
        creatorTopTracksLongTerm,
        visitorTopTracksLongTerm
      ),
      visitorUnique: difference(
        visitorTopTracksLongTerm,
        creatorTopTracksLongTerm
      ),
    },
  };
};
