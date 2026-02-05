import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { ThemeProvider as MuiThemeProvider } from "@mui/material/styles";
import { CssBaseline } from "@mui/material";
import { theme, ThemeMode } from "./index";

interface ThemeContextType {
  mode: ThemeMode;
  toggleTheme: () => void;
  setTheme: (mode: ThemeMode) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

interface ThemeProviderProps {
  children: ReactNode;
}

export const ThemeProvider: React.FC<ThemeProviderProps> = ({ children }) => {
  const [mode, setMode] = useState<ThemeMode>(() => {
    // Get theme from localStorage or default to 'light'
    const savedTheme = localStorage.getItem("theme-mode");
    return (savedTheme as ThemeMode) || "light";
  });

  useEffect(() => {
    // Save theme preference to localStorage
    localStorage.setItem("theme-mode", mode);
  }, [mode]);

  const toggleTheme = () => {
    setMode((prevMode) => (prevMode === "light" ? "dark" : "light"));
  };

  const setTheme = (newMode: ThemeMode) => {
    setMode(newMode);
  };

  const currentTheme = theme(mode);

  return (
    <ThemeContext.Provider value={{ mode, toggleTheme, setTheme }}>
      <MuiThemeProvider theme={currentTheme}>
        <CssBaseline />
        {children}
      </MuiThemeProvider>
    </ThemeContext.Provider>
  );
};

export const useAppTheme = (): ThemeContextType => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error("useAppTheme must be used within a ThemeProvider");
  }
  return context;
};
