// Calculate obscurity score

module.exports = (topArtistsAndGenres, topTracks) => {
  let averageArtistsPopularityScores = {};

  for (let period in topArtistsAndGenres) {
    const list = topArtistsAndGenres[period]["topArtists"];
    let total = 0;
    for (let i = 0; i < list.length; i++) {
      total += list[i].popularity;
    }
    averageArtistsPopularityScores[period] = total / list.length;
  }

  let averageTracksPopularityScores = {};

  for (let period in topTracks) {
    const list = topTracks[period];
    let total = 0;
    for (let i = 0; i < list.length; i++) {
      total += list[i].popularity;
    }
    averageTracksPopularityScores[period] = total / list.length;
  }

  const weightedAverageTracksPopularityScore =
    averageTracksPopularityScores.shortTerm * 0.2 +
    averageTracksPopularityScores.mediumTerm * 0.3 +
    averageTracksPopularityScores.longTerm * 0.5;

  const weightedAverageArtistsPopularityScore =
    averageArtistsPopularityScores.shortTerm * 0.2 +
    averageArtistsPopularityScores.mediumTerm * 0.3 +
    averageArtistsPopularityScores.longTerm * 0.5;

  // Return calculated obscurity score
  return (
    100 -
    (weightedAverageArtistsPopularityScore * 0.6 +
      weightedAverageTracksPopularityScore * 0.4)
  );
};
