import React from "react";
import { IconButton, Tooltip } from "@mui/material";
import { Brightness4, Brightness7 } from "@mui/icons-material";
import { useAppTheme } from "../../theme/ThemeContext";

interface ThemeToggleProps {
  size?: "small" | "medium" | "large";
  color?: "inherit" | "default" | "primary" | "secondary" | "error" | "info" | "success" | "warning";
}

const ThemeToggle: React.FC<ThemeToggleProps> = ({ size = "medium", color = "inherit" }) => {
  const { mode, toggleTheme } = useAppTheme();

  return (
    <Tooltip title={`Switch to ${mode === "light" ? "dark" : "light"} mode`}>
      <IconButton onClick={toggleTheme} color={color} size={size} sx={{ ml: 1 }}>
        {mode === "dark" ? <Brightness7 /> : <Brightness4 />}
      </IconButton>
    </Tooltip>
  );
};

export default ThemeToggle;
