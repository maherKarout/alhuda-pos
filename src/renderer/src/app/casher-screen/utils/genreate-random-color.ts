/**
 * Generate random colors based on the POS interface design palette
 * Colors inspired by the modern, professional look of the cashier screen
 */

// Color palette based on the POS interface design
const designColorPalette = [
  // Primary Blues (like "All Categories" and main elements)
  "#1976d2",
  "#0d47a1",
  "#1565c0",
  "#1e88e5",
  "#2196f3",

  // Secondary Blues (lighter variations)
  "#64b5f6",
  "#90caf9",
  "#bbdefb",
  "#5c6bc0",
  "#7986cb",

  // Grays (like Category 2)
  "#9e9e9e",
  "#bdbdbd",
  "#e0e0e0",
  "#757575",
  "#616161",

  // Golds/Yellows (like Category 3)
  "#ffc107",
  "#ffb300",
  "#ffa000",
  "#ff8f00",
  "#fff3c4",

  // Light Blues (like Category 4)
  "#03a9f4",
  "#29b6f6",
  "#4fc3f7",
  "#81d4fa",
  "#b3e5fc",

  // Dark Blues/Purples (like Category 5)
  "#3f51b5",
  "#3949ab",
  "#303f9f",
  "#283593",
  "#1a237e",

  // Additional modern colors for variety
  "#4caf50", // Green
  "#ff9800", // Orange
  "#9c27b0", // Purple
  "#e91e63", // Pink
  "#00bcd4", // Cyan
  "#795548", // Brown
  "#607d8b", // Blue Grey
];

/**
 * Generates a random color from the design palette
 * @returns A hex color string from the predefined palette
 */
export const generateRandomColor = (): string => {
  const randomIndex = Math.floor(Math.random() * designColorPalette.length);
  return designColorPalette[randomIndex];
};

/**
 * Generates a random color with specific brightness preference
 * @param preference - 'light', 'dark', or 'any' (default)
 * @returns A hex color string based on brightness preference
 */
export const generateRandomColorByBrightness = (preference: "light" | "dark" | "any" = "any"): string => {
  let filteredColors = designColorPalette;

  if (preference === "light") {
    // Light colors for better dark text readability
    filteredColors = [
      "#64b5f6",
      "#90caf9",
      "#bbdefb",
      "#bdbdbd",
      "#e0e0e0",
      "#fff3c4",
      "#81d4fa",
      "#b3e5fc",
      "#c8e6c9",
      "#ffcc80",
      "#f8bbd9",
      "#b2dfdb",
    ];
  } else if (preference === "dark") {
    // Dark colors for better light text readability
    filteredColors = [
      "#1976d2",
      "#0d47a1",
      "#1565c0",
      "#757575",
      "#616161",
      "#ff8f00",
      "#3f51b5",
      "#303f9f",
      "#283593",
      "#1a237e",
      "#2e7d32",
      "#f57c00",
      "#7b1fa2",
      "#c2185b",
      "#0097a7",
    ];
  }

  const randomIndex = Math.floor(Math.random() * filteredColors.length);
  return filteredColors[randomIndex];
};

/**
 * Generates multiple unique random colors
 * @param count - Number of colors to generate
 * @param avoidDuplicates - Whether to avoid duplicate colors (default: true)
 * @returns Array of hex color strings
 */
export const generateMultipleRandomColors = (count: number, avoidDuplicates: boolean = true): string[] => {
  const colors: string[] = [];
  const usedColors = new Set<string>();

  for (let i = 0; i < count; i++) {
    let color: string;

    if (avoidDuplicates) {
      // Try to find a unique color (max 50 attempts to avoid infinite loop)
      let attempts = 0;
      do {
        color = generateRandomColor();
        attempts++;
      } while (usedColors.has(color) && attempts < 50);

      usedColors.add(color);
    } else {
      color = generateRandomColor();
    }

    colors.push(color);
  }

  return colors;
};

/**
 * Generates a random color similar to a reference color
 * @param referenceColor - Hex color to base the generation on
 * @param variance - How much the color can vary (0-100, default: 30)
 * @returns A hex color string similar to the reference
 */
export const generateSimilarRandomColor = (referenceColor: string, variance: number = 30): string => {
  // Remove # if present
  const hex = referenceColor.replace("#", "");

  // Convert to RGB
  const r = parseInt(hex.substring(0, 2), 16);
  const g = parseInt(hex.substring(2, 4), 16);
  const b = parseInt(hex.substring(4, 6), 16);

  // Apply random variance
  const varyAmount = (variance / 100) * 255;

  const newR = Math.max(0, Math.min(255, r + (Math.random() - 0.5) * varyAmount));
  const newG = Math.max(0, Math.min(255, g + (Math.random() - 0.5) * varyAmount));
  const newB = Math.max(0, Math.min(255, b + (Math.random() - 0.5) * varyAmount));

  // Convert back to hex
  const toHex = (value: number) => Math.round(value).toString(16).padStart(2, "0");

  return `#${toHex(newR)}${toHex(newG)}${toHex(newB)}`;
};

/**
 * Get a random color for category cards (optimized for the POS interface)
 * @returns A hex color that works well for category cards
 */
export const getRandomCategoryColor = (): string => {
  const categoryColors = [
    "#1976d2", // Primary blue
    "#9e9e9e", // Gray
    "#ffc107", // Gold
    "#03a9f4", // Light blue
    "#3f51b5", // Dark blue
    "#4caf50", // Green
    "#ff9800", // Orange
    "#9c27b0", // Purple
    "#e91e63", // Pink
    "#00bcd4", // Cyan
  ];

  return categoryColors[Math.floor(Math.random() * categoryColors.length)];
};

export default generateRandomColor;
