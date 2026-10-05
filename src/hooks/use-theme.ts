import { Colors, ThemeColor } from "../constants/theme";
import {
  useColorScheme,
  useThemeColor as getThemeColor,
} from "./use-color-scheme";

export { useColorScheme };

export function useTheme() {
  const theme = useColorScheme();

  return {
    theme,
    colors: Colors[theme],
  };
}

export function useThemeColor(
  props: {
    light?: string;
    dark?: string;
  },
  colorName: ThemeColor
): string {
  return getThemeColor(props, colorName);
}