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
  byzantine: "rgba(185,29,183)",
  byzantine10p: "rgba(185,29,183,0.1)",
  byzantine25p: "rgba(185,29,183,0.25)",
  byzantine50p: "rgba(185,29,183,0.5)",
  blueCityBlue: "rgba(43, 191, 255)",
  blueCityBlue10p: "rgba(43, 191, 255, 0.1)",
  blueCityBlue25p: "rgba(43, 191, 255, 0.25)",
  blueCityBlueDark: "#003B55",
  iris: "rgba(72,77,224)",
  iris10p: "rgba(72,77,224,0.1)",
  iris25p: "rgba(72,77,224,0.25)",
  iris90p: "rgba(72,77,224,0.9)",
  neonGreen: "rgba(78,224,72)",
  neonGreen10p: "rgba(78,224,72,0.1)",
  neonGreen50p: "rgba(78,224,72,0.5)",
  neonGreen90p: "rgba(78,224,72,0.9)",
  spanishViolet: "rgba(161, 123, 204)",
  spanishViolet10p: "rgba(161, 123, 204, 0.1)",
  spanishViolet25p: "rgba(161, 123, 204, 0.25)",
  spanishVioletDark: "#392154",
  seaGreen: "rgba(119, 178, 140)",
  seaGreen10p: "rgba(119, 178, 140, 0.1)",
  seaGreen25p: "rgba(119, 178, 140, 0.25)",
  seaGreenDark: "#1E3627",
  straw: "rgba(239, 224, 107)",
  straw10p: "rgba(239, 224, 107, 0.1)",
  straw25p: "rgba(239, 224, 107, 0.25)",
  strawDark: "#59500A",
  orangeRed: "rgba(255,105,41)",
  orangeRed10p: "rgba(255,105,41,0.1)",
};

// Color assignment object def
interface ThemeColors {
  [key: string]: string;
}

// Color assignment object
const themeColors: ThemeColors = {
  mainAccent: colors.byzantine,
  mainContentBg: colors.grey21,
  mainAccent10p: colors.byzantine10p,
  mainAccent25p: colors.byzantine25p,
  mainAccent50p: colors.byzantine50p,
  bodyBg: colors.grey20,
  darkBodyOverlay: colors.grey19,
  darkBodyOverlayBorder: "rgba(255,255,255,0.07)",
  blueCityBlue: colors.blueCityBlue,
  blueCityBlue10p: colors.blueCityBlue10p,
  blueCityBlue25p: colors.blueCityBlue25p,
  blueCityBlueDark: colors.blueCityBlueDark,
  iris: colors.iris,
  iris10p: colors.iris10p,
  iris25p: colors.iris25p,
  neonGreen: colors.neonGreen,
  neonGreen10p: colors.neonGreen10p,
  neonGreen50p: colors.neonGreen50p,
  spanishViolet: colors.spanishViolet,
  spanishViolet10p: colors.spanishViolet10p,
  spanishViolet25p: colors.spanishViolet25p,
  spanishVioletDark: colors.spanishVioletDark,
  seaGreen: colors.seaGreen,
  seaGreen10p: colors.seaGreen10p,
  seaGreen25p: colors.seaGreen25p,
  seaGreenDark: colors.seaGreenDark,
  straw: colors.straw,
  straw10p: colors.straw10p,
  straw25p: colors.straw25p,
  strawDark: colors.strawDark,
  orangeRed: colors.orangeRed,
  orangeRed10p: colors.orangeRed10p,

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
};
