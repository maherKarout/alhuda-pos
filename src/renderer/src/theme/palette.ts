/**
 * Color intention that you want to used in your theme
 * @param {JsonObject} theme Theme customization object
 */

export default function themePalette(theme: any) {
  const isDark = theme?.customization?.navType === 'dark'

  return {
    mode: theme?.customization?.navType,
    common: {
      black: theme.colors?.darkPaper
    },
    primary: {
      light: isDark ? theme.colors?.darkPrimaryLight : theme.colors?.primaryLight,
      main: isDark ? theme.colors?.darkPrimaryMain : theme.colors?.primaryMain,
      dark: isDark ? theme.colors?.darkPrimaryDark : theme.colors?.primaryDark,
      200: isDark ? theme.colors?.darkPrimary200 : theme.colors?.primary200,
      700: isDark ? theme.colors?.darkPrimary700 : theme.colors?.primary700,
      800: isDark ? theme.colors?.darkPrimary800 : theme.colors?.primary800
    },
    secondary: {
      light: isDark ? theme.colors?.darkSecondaryLight : theme.colors?.secondaryLight,
      main: isDark ? theme.colors?.darkSecondaryMain : theme.colors?.secondaryMain,
      dark: isDark ? theme.colors?.darkSecondaryDark : theme.colors?.secondaryDark,
      200: isDark ? theme.colors?.darkSecondary200 : theme.colors?.secondary200,
      800: isDark ? theme.colors?.darkSecondary800 : theme.colors?.secondary800
    },
    error: {
      light: theme.colors?.errorLight,
      main: theme.colors?.errorMain,
      dark: theme.colors?.errorDark
    },
    orange: {
      light: theme.colors?.orangeLight,
      main: theme.colors?.orangeMain,
      dark: theme.colors?.orangeDark
    },
    warning: {
      light: theme.colors?.warningLight,
      main: theme.colors?.warningMain,
      dark: theme.colors?.warningDark
    },
    success: {
      light: theme.colors?.successLight,
      200: theme.colors?.success200,
      main: theme.colors?.successMain,
      dark: theme.colors?.successDark
    },
    grey: {
      50: isDark ? theme.colors?.darkLevel1 : theme.colors?.grey50,
      100: isDark ? theme.colors?.darkLevel2 : theme.colors?.grey100,
      200: isDark ? theme.colors?.darkLevel1 : theme.colors?.grey200,
      300: isDark ? theme.colors?.darkLevel2 : theme.colors?.grey300,
      500: theme.darkTextSecondary,
      600: theme.heading,
      700: theme.darkTextPrimary,
      900: theme.textDark
    },
    dark: {
      light: theme.colors?.darkTextPrimary,
      main: theme.colors?.darkLevel1,
      dark: theme.colors?.darkLevel2,
      800: theme.colors?.darkBackground,
      900: theme.colors?.darkPaper
    },
    text: {
      primary: theme.darkTextPrimary,
      secondary: theme.darkTextSecondary,
      dark: theme.textDark,
      hint: isDark ? theme.colors?.darkTextSecondary : theme.colors?.grey100
    },
    background: {
      paper: theme.paper,
      default: theme.backgroundDefault
    }
  }
}
