import { useColorScheme as useRNColorScheme } from "react-native";
import { Colors, ThemeColor } from "../constants/theme";

export function useColorScheme(): "light" | "dark" {
  return useRNColorScheme() === "dark" ? "dark" : "light";
}

export function useThemeColor(
  props: {
    light?: string;
    dark?: string;
  },
  colorName: ThemeColor
): string {
  const theme = useColorScheme();

  const colorFromProps =
    theme === "dark" ? props.dark : props.light;

  return colorFromProps ?? Colors[theme][colorName];
}

export function useTheme() {
  const theme = useColorScheme();

  return {
    theme,
    colors: Colors[theme],
  };
}