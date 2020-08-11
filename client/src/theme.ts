// Color list def
interface Colors {
  [key: string]: string;
}

// Colors list
const colors: Colors = {
  white: "rgb(255, 255, 255)",
  grey1: "rgb(235, 235, 235)",
  grey2: "rgb(220, 220, 220)",
  grey3: "rgb(205, 205, 205)",
  grey4: "rgb(175, 175, 175)",
  spotifyGreen: "#1DB954",
  spotifyGreenDim: "#199F48",
};

// Color assignment object def
interface ThemeColors {
  [key: string]: string;
}

// Color assignment object
const themeColors: ThemeColors = {
  // Text
  textPrimary: colors.grey1,
  textSecondary: colors.grey3,
  textTertiary: colors.grey4,
  spotifyGreen: colors.spotifyGreen,
  spotifyGreenDim: colors.spotifyGreenDim,
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
    brand: "lobster two",
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
