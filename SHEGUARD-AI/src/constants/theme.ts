import { Platform } from "react-native";

export const Colors = {
  light: {
    text: "#11181C",
    textSecondary: "#687076",
    background: "#FFFFFF",
    backgroundElement: "#F5F5F5",
    backgroundSelected: "#FFE4EE",
    tint: "#E91E63",
    icon: "#687076",
    tabIconDefault: "#687076",
    tabIconSelected: "#E91E63",
  },

  dark: {
    text: "#ECEDEE",
    textSecondary: "#9BA1A6",
    background: "#151718",
    backgroundElement: "#1E2022",
    backgroundSelected: "#3A202B",
    tint: "#FF80AB",
    icon: "#9BA1A6",
    tabIconDefault: "#9BA1A6",
    tabIconSelected: "#FF80AB",
  },
};

export const Fonts = Platform.select({
  ios: {
    sans: "system-ui",
    serif: "ui-serif",
    rounded: "ui-rounded",
    mono: "ui-monospace",
  },

  android: {
    sans: "normal",
    serif: "serif",
    rounded: "normal",
    mono: "monospace",
  },

  web: {
    sans: "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
    serif: "Georgia, serif",
    rounded: "'Arial Rounded MT Bold', Arial, sans-serif",
    mono: "monospace",
  },

  default: {
    sans: "normal",
    serif: "serif",
    rounded: "normal",
    mono: "monospace",
  },
});

export type ThemeColor = keyof typeof Colors.light;

export const Spacing = {
  half: 2,
  one: 4,
  two: 8,
  three: 12,
  four: 16,
  five: 20,

  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  xxl: 24,
  xxxl: 32,
};

export const MaxContentWidth = 1200;
