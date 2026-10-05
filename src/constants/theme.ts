export const Colors = {
  light: {
    text: "#11181C",
    textSecondary: "#687076",
    background: "#FFF7FA",
    backgroundElement: "#FFFFFF",
    backgroundSelected: "#FFE4EE",
    tint: "#E91E63",
    icon: "#687076",
    tabIconDefault: "#687076",
    tabIconSelected: "#E91E63",
    card: "#FFFFFF",
    border: "#E5E5E5",
    muted: "#888888",
  },

  dark: {
    text: "#ECEDEE",
    textSecondary: "#A0A0A0",
    background: "#151718",
    backgroundElement: "#1E2021",
    backgroundSelected: "#3A202A",
    tint: "#FF4081",
    icon: "#A0A0A0",
    tabIconDefault: "#A0A0A0",
    tabIconSelected: "#FF4081",
    card: "#1E2021",
    border: "#333333",
    muted: "#888888",
  },
};

export type ThemeColor = keyof typeof Colors.light;

export const Fonts = {
  regular: "System",
  medium: "System",
  bold: "System",
  heavy: "System",
  mono: "monospace",
};

export const Spacing = {
  half: 4,
  one: 8,
  two: 12,
  three: 16,
  four: 20,
  five: 24,

  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  xxl: 32,
};

export const MaxContentWidth = 1200;