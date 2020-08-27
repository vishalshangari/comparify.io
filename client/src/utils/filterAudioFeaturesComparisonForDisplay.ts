// import {
//   AudioFeaturesComparison,
//   AudioFeaturesComparisonChartData,
// } from "../components/compare/Comparify";
// import { featureGraphLabels } from "../components/AudioFeatures/constants";
// import { colors } from "../theme";

// export default (
//   data: AudioFeaturesComparison
// ): AudioFeaturesComparisonChartData => ({
//   danceability: {
//     labels: featureGraphLabels,
//     datasets: [
//       {
//         label: `visitor.danceability`,
//         backgroundColor: colors.iris,
//         barPercentage: 0.5,
//         hoverBackgroundColor: colors.white,
//         data: data.danceability.visitor,
//       },
//       {
//         label: `creator.danceability`,
//         backgroundColor: colors.neonGreen,
//         barPercentage: 0.5,
//         hoverBackgroundColor: colors.white,
//         data: data.danceability.creator,
//       },
//     ],
//   },
//   energy: {
//     labels: featureGraphLabels,
//     datasets: [
//       {
//         label: `visitor.energy`,
//         backgroundColor: colors.iris,
//         barPercentage: 0.5,
//         hoverBackgroundColor: colors.white,
//         data: data.energy.visitor,
//       },
//       {
//         label: `creator.energy`,
//         backgroundColor: colors.neonGreen,
//         barPercentage: 0.5,
//         hoverBackgroundColor: colors.white,
//         data: data.energy.creator,
//       },
//     ],
//   },
//   valence: {
//     labels: featureGraphLabels,
//     datasets: [
//       {
//         label: `visitor.valence`,
//         backgroundColor: colors.iris,
//         barPercentage: 0.5,
//         hoverBackgroundColor: colors.white,
//         data: data.valence.visitor,
//       },
//       {
//         label: `creator.valence`,
//         backgroundColor: colors.neonGreen,
//         barPercentage: 0.5,
//         hoverBackgroundColor: colors.white,
//         data: data.valence.creator,
//       },
//     ],
//   },
//   tempo: {
//     labels: featureGraphLabels,
//     datasets: [
//       {
//         label: `visitor.tempo`,
//         backgroundColor: colors.iris,
//         barPercentage: 0.5,
//         hoverBackgroundColor: colors.white,
//         data: data.tempo.visitor,
//       },
//       {
//         label: `creator.tempo`,
//         backgroundColor: colors.neonGreen,
//         barPercentage: 0.5,
//         hoverBackgroundColor: colors.white,
//         data: data.tempo.creator,
//       },
//     ],
//   },
// });

export default {};
