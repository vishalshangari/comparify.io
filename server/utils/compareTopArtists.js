// Perform a comparison of 2 users' top artists

const intersection = require("lodash/intersection");
const difference = require("lodash/difference");

module.exports = (creatorTopArtistsAndGenres, visitorTopArtistsAndGenres) => {
  let creatorTopArtistsShortTerm = [];

  creatorTopArtistsAndGenres.shortTerm.topArtists.forEach((artist) => {
    creatorTopArtistsShortTerm.push(artist.id);
  });

  let visitorTopArtistsShortTerm = [];
  visitorTopArtistsAndGenres.shortTerm.topArtists.forEach((artist) => {
    visitorTopArtistsShortTerm.push(artist.id);
  });

  let creatorTopArtistsMediumTerm = [];

  creatorTopArtistsAndGenres.mediumTerm.topArtists.forEach((artist) => {
    creatorTopArtistsMediumTerm.push(artist.id);
  });

  let visitorTopArtistsMediumTerm = [];
  visitorTopArtistsAndGenres.mediumTerm.topArtists.forEach((artist) => {
    visitorTopArtistsMediumTerm.push(artist.id);
  });

  let creatorTopArtistsLongTerm = [];

  creatorTopArtistsAndGenres.longTerm.topArtists.forEach((artist) => {
    creatorTopArtistsLongTerm.push(artist.id);
  });

  let visitorTopArtistsLongTerm = [];
  visitorTopArtistsAndGenres.longTerm.topArtists.forEach((artist) => {
    visitorTopArtistsLongTerm.push(artist.id);
  });

  return {
    now: {
      shared: intersection(
        creatorTopArtistsShortTerm,
        visitorTopArtistsShortTerm
      ),
      creatorUnique: difference(
        creatorTopArtistsShortTerm,
        visitorTopArtistsShortTerm
      ),
      visitorUnique: difference(
        visitorTopArtistsShortTerm,
        creatorTopArtistsShortTerm
      ),
    },
    recent: {
      shared: intersection(
        creatorTopArtistsMediumTerm,
        visitorTopArtistsMediumTerm
      ),
      creatorUnique: difference(
        creatorTopArtistsMediumTerm,
        visitorTopArtistsMediumTerm
      ),
      visitorUnique: difference(
        visitorTopArtistsMediumTerm,
        creatorTopArtistsMediumTerm
      ),
    },
    allTime: {
      shared: intersection(
        creatorTopArtistsLongTerm,
        visitorTopArtistsLongTerm
      ),
      creatorUnique: difference(
        creatorTopArtistsLongTerm,
        visitorTopArtistsLongTerm
      ),
      visitorUnique: difference(
        visitorTopArtistsLongTerm,
        creatorTopArtistsLongTerm
      ),
    },
  };
};
