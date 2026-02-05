import { createTheme } from '@mui/material/styles'
import type { ThemeOptions, TypographyVariantsOptions } from '@mui/material/styles'

// assets
import colors from 'src/assets/scss/_themes-vars.module.scss'

// project imports
import componentStyleOverrides from './compStyleOverride'
import themePalette from './palette'
import themeTypography from './typography'

/**
 * Represent theme style and structure as per Material-UI
 * @param {JsonObject} customization customization parameter objecta
 */

import useGetIsRtlDirection from 'src/hooks/use-get-is-rtl-direction'

export type ThemeMode = 'light' | 'dark'

export const theme = (mode: ThemeMode = 'light') => {
  const color = colors
  const customization = {
    isOpen: [],
    defaultId: 'default',
    fontFamily: 'roboto',
    borderRadius: 12,
    opened: true,
    navType: mode
  }

  // Choose colors based on theme mode
  const themeColors =
    mode === 'dark'
      ? {
          // Dark theme colors
          paper: color.darkPaper,
          backgroundDefault: color.darkBackground,
          background: color.darkBackground,
          heading: color.darkTextTitle,
          darkTextPrimary: color.darkTextPrimary,
          darkTextSecondary: color.darkTextSecondary,
          textDark: color.darkTextTitle,
          menuSelected: color.darkSecondaryMain,
          menuSelectedBack: color.darkSecondaryLight,
          divider: color.darkLevel1
        }
      : {
          // Light theme colors
          paper: color.paper,
          backgroundDefault: color.default,
          background: color.primaryLight,
          heading: color.grey900,
          darkTextPrimary: color.grey700,
          darkTextSecondary: color.grey500,
          textDark: color.grey900,
          menuSelected: color.secondaryDark,
          menuSelectedBack: color.secondaryLight,
          divider: color.grey200
        }

  const themeOption = {
    colors: color,
    ...themeColors,
    customization
  } as const

  const themeOptions: ThemeOptions = {
    direction: useGetIsRtlDirection() ? 'rtl' : 'ltr',
    palette: themePalette(themeOption),
    mixins: {
      toolbar: {
        minHeight: '48px',
        padding: '16px',
        '@media (min-width: 600px)': {
          minHeight: '48px'
        }
      }
    },
    typography: themeTypography(themeOption) as TypographyVariantsOptions,
    components: componentStyleOverrides(themeOption)
  }

  const themes = createTheme(themeOptions)

  return themes
}

export default theme
