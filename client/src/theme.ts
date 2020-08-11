// Color list def
interface Colors {
  [key: string]: string;
}

// Colors list
const colors: Colors = {
  grey0: "rgb(0, 0, 0)",
  grey1: "rgb(9, 10, 11)",
  grey2: "rgb(18, 20, 22)",
  grey3: "rgb(25, 27, 29)",
  grey4: "rgb(32, 34, 36)",
  grey5: "rgb(39, 41, 43)",
};

// Color assignment object def
interface ThemeColors {
  [key: string]: string;
}

// Color assignment object
const themeColors: ThemeColors = {
  // Text
  textPrimary: colors.grey8,
  textSecondary: colors.grey14,
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
