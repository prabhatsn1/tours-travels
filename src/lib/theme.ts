/* eslint-disable @typescript-eslint/no-explicit-any */
import { createTheme, ThemeOptions } from "@mui/material/styles";

// Theme configuration interface for easy customization
export interface TravelThemeConfig {
  primaryColor: string;
  secondaryColor: string;
  accentColor: string;
  backgroundColor: string;
  surfaceColor: string;
  textColor: string;
  logoUrl: string;
  companyName: string;
  borderRadius: number;
  shadowLevel: number;
}

// Default theme configuration - easily customizable
export const defaultThemeConfig: TravelThemeConfig = {
  primaryColor: "#2196F3", // Blue - travel/sky theme
  secondaryColor: "#FF9800", // Orange - sunset/adventure
  accentColor: "#4CAF50", // Green - nature/eco-friendly
  backgroundColor: "#FAFAFA",
  surfaceColor: "#FFFFFF",
  textColor: "#333333",
  logoUrl: "/logo.png",
  companyName: "Wanderlust Travel",
  borderRadius: 12,
  shadowLevel: 2,
};

// Create MUI theme based on configuration
export const createTravelTheme = (
  config: TravelThemeConfig = defaultThemeConfig
) => {
  const themeOptions: ThemeOptions = {
    palette: {
      mode: "light",
      primary: {
        main: config.primaryColor,
        light: `${config.primaryColor}20`,
        dark: config.primaryColor,
      },
      secondary: {
        main: config.secondaryColor,
        light: `${config.secondaryColor}20`,
        dark: config.secondaryColor,
      },
      background: {
        default: config.backgroundColor,
        paper: config.surfaceColor,
      },
      text: {
        primary: config.textColor,
        secondary: `${config.textColor}80`,
      },
      success: {
        main: config.accentColor,
      },
    },
    typography: {
      fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
      h1: {
        fontSize: "3.5rem",
        fontWeight: 700,
        lineHeight: 1.2,
      },
      h2: {
        fontSize: "2.5rem",
        fontWeight: 600,
        lineHeight: 1.3,
      },
      h3: {
        fontSize: "2rem",
        fontWeight: 600,
        lineHeight: 1.3,
      },
      h4: {
        fontSize: "1.5rem",
        fontWeight: 500,
        lineHeight: 1.4,
      },
      h5: {
        fontSize: "1.25rem",
        fontWeight: 500,
        lineHeight: 1.4,
      },
      h6: {
        fontSize: "1.125rem",
        fontWeight: 500,
        lineHeight: 1.4,
      },
      body1: {
        fontSize: "1rem",
        lineHeight: 1.6,
      },
      body2: {
        fontSize: "0.875rem",
        lineHeight: 1.6,
      },
    },
    shape: {
      borderRadius: config.borderRadius,
    },
    shadows: [
      "none",
      "0px 2px 4px rgba(0,0,0,0.1)",
      "0px 4px 8px rgba(0,0,0,0.12)",
      "0px 8px 16px rgba(0,0,0,0.14)",
      "0px 12px 24px rgba(0,0,0,0.16)",
      // Add more shadow levels as needed
      ...Array(20).fill("0px 12px 24px rgba(0,0,0,0.16)"),
    ] as any,
    components: {
      MuiButton: {
        styleOverrides: {
          root: {
            borderRadius: config.borderRadius,
            textTransform: "none",
            fontWeight: 500,
            padding: "12px 24px",
            fontSize: "1rem",
          },
          contained: {
            boxShadow: `0px ${config.shadowLevel * 2}px ${
              config.shadowLevel * 4
            }px rgba(0,0,0,0.1)`,
            "&:hover": {
              boxShadow: `0px ${config.shadowLevel * 3}px ${
                config.shadowLevel * 6
              }px rgba(0,0,0,0.15)`,
            },
          },
        },
      },
      MuiCard: {
        styleOverrides: {
          root: {
            borderRadius: config.borderRadius,
            boxShadow: `0px ${config.shadowLevel}px ${
              config.shadowLevel * 2
            }px rgba(0,0,0,0.1)`,
          },
        },
      },
      MuiTextField: {
        styleOverrides: {
          root: {
            "& .MuiOutlinedInput-root": {
              borderRadius: config.borderRadius,
            },
          },
        },
      },
      MuiChip: {
        styleOverrides: {
          root: {
            borderRadius: config.borderRadius / 2,
          },
        },
      },
    },
  };

  return createTheme(themeOptions);
};

// Export the default theme
export const travelTheme = createTravelTheme();
