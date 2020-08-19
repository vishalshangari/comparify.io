import { colors } from "../../../theme";

export const labels = [
  "0",
  "0.05",
  "0.1",
  "0.15",
  "0.2",
  "0.25",
  "0.3",
  "0.35",
  "0.4",
  "0.45",
  "0.5",
  "0.55",
  "0.6",
  "0.65",
  "0.7",
  "0.75",
  "0.8",
  "0.85",
  "0.9",
  "0.95",
  "1.0",
];

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
