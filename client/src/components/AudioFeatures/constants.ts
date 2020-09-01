import { colors } from "../../theme";

export const audioFeatureDescriptions = {
  valence: {
    desc: `A description of the musical positiveness conveyed by a track. Tracks
  with high valence sound more positive (e.g. happy, cheerful,
  euphoric), while tracks with low valence sound more negative (e.g.
  sad, depressed, angry).`,
    measurement: `score out of 100`,
  },
  energy: {
    desc: `A perceptual measure of intensity and activity.
  Typically, energetic tracks feel fast, loud, and noisy. For
  example, death metal has high energy, while a Bach prelude scores
  low on the scale.`,
    measurement: `score out of 100`,
  },
  danceability: {
    desc: `A description of how suitable a track is for dancing based on a
  combination of musical elements including tempo, rhythm stability,
  beat strength, and overall regularity.`,
    measurement: `score out of 100`,
  },
  tempo: {
    desc: `The overall estimated tempo of a track in beats per minute
  (BPM). In musical terminology, tempo is the speed or pace of a
  given piece and derives directly from the average beat duration.`,
    measurement: `in beats per minute`,
  },
};
// const data = [
//   17,
//   35,
//   72,
//   159,
//   185,
//   251,
//   361,
//   451,
//   595,
//   751,
//   951,
//   1032,
//   1038,
//   1061,
//   1017,
//   832,
//   636,
//   338,
//   147,
//   72,
//   0,
// ];

export const featureGraphLabels = ["All-Time", "Recent", "Now"];

export const featureGraphOptions = {
  tooltips: {
    displayColors: false,
  },
  legend: {
    display: false,
  },
  scales: {
    xAxes: [
      {
        ticks: {
          fontColor: colors.grey1,
          fontSize: 16,
          fontFamily: "'open sans', sans-serif",
          fontStyle: "bold",
        },
        gridLines: {
          display: false,
        },
      },
    ],
    yAxes: [
      {
        ticks: {
          fontColor: colors.grey1,
        },
        gridLines: {
          color: "rgb(255,255,255,0.1)",
          zeroLineColor: "rgb(255,255,255,0.1)",
        },
      },
    ],
  },
};
