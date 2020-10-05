// Perform a comparison of 2 users' top genres

const intersection = require("lodash/intersection");
const difference = require("lodash/difference");

module.exports = (creatorTopArtistsAndGenres, visitorTopArtistsAndGenres) => {
  let creatorTopGenresShortTerm = [];

  creatorTopArtistsAndGenres.shortTerm.topGenres.forEach((genre) => {
    creatorTopGenresShortTerm.push(genre.name);
  });

  let visitorTopGenresShortTerm = [];
  visitorTopArtistsAndGenres.shortTerm.topGenres.forEach((genre) => {
    visitorTopGenresShortTerm.push(genre.name);
  });

  let creatorTopGenresMediumTerm = [];

  creatorTopArtistsAndGenres.mediumTerm.topGenres.forEach((genre) => {
    creatorTopGenresMediumTerm.push(genre.name);
  });

  let visitorTopGenresMediumTerm = [];
  visitorTopArtistsAndGenres.mediumTerm.topGenres.forEach((genre) => {
    visitorTopGenresMediumTerm.push(genre.name);
  });

  let creatorTopGenresLongTerm = [];

  creatorTopArtistsAndGenres.longTerm.topGenres.forEach((genre) => {
    creatorTopGenresLongTerm.push(genre.name);
  });

  let visitorTopGenresLongTerm = [];
  visitorTopArtistsAndGenres.longTerm.topGenres.forEach((genre) => {
    visitorTopGenresLongTerm.push(genre.name);
  });

  return {
    now: {
      shared: intersection(
        creatorTopGenresShortTerm,
        visitorTopGenresShortTerm
      ),
      creatorUnique: difference(
        creatorTopGenresShortTerm,
        visitorTopGenresShortTerm
      ),
      visitorUnique: difference(
        visitorTopGenresShortTerm,
        creatorTopGenresShortTerm
      ),
    },
    recent: {
      shared: intersection(
        creatorTopGenresMediumTerm,
        visitorTopGenresMediumTerm
      ),
      creatorUnique: difference(
        creatorTopGenresMediumTerm,
        visitorTopGenresMediumTerm
      ),
      visitorUnique: difference(
        visitorTopGenresMediumTerm,
        creatorTopGenresMediumTerm
      ),
    },
    allTime: {
      shared: intersection(creatorTopGenresLongTerm, visitorTopGenresLongTerm),
      creatorUnique: difference(
        creatorTopGenresLongTerm,
        visitorTopGenresLongTerm
      ),
      visitorUnique: difference(
        visitorTopGenresLongTerm,
        creatorTopGenresLongTerm
      ),
    },
  };
};
