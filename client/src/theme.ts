import { generateMedia } from "styled-media-query";

export const breakpoints = generateMedia({
  "90": "90em",
  "85": "85em",
  "74": "74em",
  "66": "66em",
});

// Color list def
interface Colors {
  [key: string]: string;
}

// Colors list
export const colors: Colors = {
  white: "rgb(255, 255, 255)",
  grey1: "rgb(235, 237, 239)",
  grey2: "rgb(220, 222, 224)",
  grey3: "rgb(205, 207, 209)",
  grey4: "rgb(175, 177, 179)",
  grey5: "rgb(145, 147, 149)",
  grey16: "rgb(47,49, 51)",
  grey17: "rgb(40, 42, 44)",
  grey18: "rgb(33, 35, 37)",
  grey19: "rgb(26, 28, 30)",
  grey20: "rgb(19, 21, 23)",
  grey21: "rgb(12, 14, 16)",
  spotifyGreen: "#1DB954",
  spotifyGreenDim: "#199F48",
  byzantine: "#B91DB7",
  blueCityBlue: "#2bbfff",
  spanishViolet: "#A17BCC",
  seaGreen: "#77B28C",
  straw: "#EFE06B",
};

// Color assignment object def
interface ThemeColors {
  [key: string]: string;
}

// Color assignment object
const themeColors: ThemeColors = {
  mainAccent: colors.byzantine,
  darkBodyBg: colors.grey19,
  navigationBg: colors.grey20,
  darkBodyOverlay: colors.grey18,
  blueCityBlue: colors.blueCityBlue,
  spanishViolet: colors.spanishViolet,
  seaGreen: colors.seaGreen,
  straw: colors.straw,

  // Text
  textPrimary: colors.grey1,
  textSecondary: colors.grey3,
  textTertiary: colors.grey5,
  spotifyGreen: colors.spotifyGreen,
  spotifyGreenDim: colors.spotifyGreenDim,

  // Others
};

// Main theme object def
export interface Theme {
  colors: ThemeColors;
  breakpoints: {
    xl: string;
    lg: string;
    md: string;
    sm: string;
  };
  fonts: {
    [key: string]: string;
  };
  fontSizes: {
    [key: string]: string;
  };
  flex: {
    column: string;
    row: string;
    centered: string;
    grow: string;
  };
  maxWidth: string;
}

// Main theme object
export const theme: Theme = {
  colors: themeColors,
  breakpoints: {
    xl: "80em",
    lg: "60em",
    md: "37.5em",
    sm: "26.5em",
  },
  fonts: {
    main: "Open Sans",
    brand: "roboto slab",
  },
  fontSizes: {
    base: "1rem",
  },
  flex: {
    column: "display: flex; flex-direction: column;",
    row: "display: flex; flex-direction: row;",
    centered: "display: flex; justify-content: center; align-items: center;",
    grow: "flex-grow: 1;",
  },
  maxWidth: "1500px",
};
