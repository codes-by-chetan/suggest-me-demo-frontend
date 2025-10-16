import {
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";

export type ThemeMode = "light" | "dark" | "system";
export type ColorTheme =
  | "default"
  | "blue"
  | "green"
  | "purple"
  | "orange"
  | "red";

interface ThemeContextType {
  mode: ThemeMode;
  colorTheme: ColorTheme;
  setMode: (mode: ThemeMode) => void;
  setColorTheme: (theme: ColorTheme) => void;
  actualTheme: "light" | "dark";
}

const ThemeContext = createContext<
  ThemeContextType | undefined
>(undefined);

interface ColorThemeConfig {
  name: string;
  primary: string;
  accent: string;
  muted?: string;
  destructive?: string;
  border?: string;
  ring?: string;

  // Dark mode variants
  primaryDark?: string;
  accentDark?: string;
  mutedDark?: string;
  destructiveDark?: string;
  borderDark?: string;
  ringDark?: string;
}

const colorThemes: Record<ColorTheme, ColorThemeConfig> = {
  default: {
    name: "Default",
    primary: "hsl(224, 71%, 4%)", // --primary
    accent: "hsl(210, 40%, 98%)", // --accent
    muted: "#ececf0", // --muted
    destructive: "#d4183d", // --destructive
    border: "rgba(0, 0, 0, 0.1)", // --border
    ring: "oklch(0.708 0 0)", // --ring

    primaryDark: "oklch(0.985 0 0)", // --primary (dark)
    accentDark: "oklch(0.218 0 0)", // --accent (dark)
    mutedDark: "oklch(0.218 0 0)", // --muted (dark)
    destructiveDark: "oklch(0.627 0.237 25.331)", // --destructive (dark)
    borderDark: "oklch(0.269 0 0)", // --border (dark)
    ringDark: "oklch(0.369 0 0)", // --ring (dark)
  },
  blue: {
    name: "Ocean Blue",
    primary: "hsl(221, 83%, 53%)",
    accent: "hsl(214, 95%, 93%)",
    muted: "hsl(221, 50%, 96%)",
    destructive: "#d4183d",
    border: "hsl(221, 30%, 85%)",
    ring: "hsl(221, 83%, 70%)",

    primaryDark: "hsl(221, 83%, 66%)",
    accentDark: "hsl(221, 45%, 20%)",
    mutedDark: "hsl(221, 40%, 25%)",
    destructiveDark: "#ff4d6d",
    borderDark: "hsl(221, 40%, 30%)",
    ringDark: "hsl(221, 83%, 75%)",
  },
  green: {
    name: "Forest Green",
    primary: "hsl(142, 71%, 45%)",
    accent: "hsl(138, 76%, 97%)",
    muted: "hsl(142, 40%, 95%)",
    destructive: "#d4183d",
    border: "hsl(142, 25%, 85%)",
    ring: "hsl(142, 71%, 60%)",

    primaryDark: "hsl(142, 71%, 55%)",
    accentDark: "hsl(142, 45%, 20%)",
    mutedDark: "hsl(142, 30%, 20%)",
    destructiveDark: "#ff4d6d",
    borderDark: "hsl(142, 30%, 30%)",
    ringDark: "hsl(142, 71%, 65%)",
  },
  purple: {
    name: "Royal Purple",
    primary: "hsl(262, 83%, 58%)",
    accent: "hsl(270, 95%, 98%)",
    muted: "hsl(262, 40%, 96%)",
    destructive: "#d4183d",
    border: "hsl(262, 25%, 85%)",
    ring: "hsl(262, 83%, 70%)",

    primaryDark: "hsl(262, 83%, 65%)",
    accentDark: "hsl(262, 45%, 20%)",
    mutedDark: "hsl(262, 30%, 20%)",
    destructiveDark: "#ff4d6d",
    borderDark: "hsl(262, 30%, 30%)",
    ringDark: "hsl(262, 83%, 75%)",
  },
  orange: {
    name: "Sunset Orange",
    primary: "hsl(25, 95%, 53%)",
    accent: "hsl(24, 95%, 97%)",
    muted: "hsl(25, 40%, 96%)",
    destructive: "#d4183d",
    border: "hsl(25, 25%, 85%)",
    ring: "hsl(25, 95%, 65%)",

    primaryDark: "hsl(25, 95%, 60%)",
    accentDark: "hsl(25, 55%, 18%)",
    mutedDark: "hsl(25, 30%, 20%)",
    destructiveDark: "#ff4d6d",
    borderDark: "hsl(25, 30%, 30%)",
    ringDark: "hsl(25, 95%, 70%)",
  },
  red: {
    name: "Ruby Red",
    primary: "hsl(0, 84%, 60%)",
    accent: "hsl(0, 93%, 97%)",
    muted: "hsl(0, 40%, 96%)",
    destructive: "#d4183d",
    border: "hsl(0, 25%, 85%)",
    ring: "hsl(0, 84%, 65%)",

    primaryDark: "hsl(0, 84%, 65%)",
    accentDark: "hsl(0, 55%, 20%)",
    mutedDark: "hsl(0, 30%, 20%)",
    destructiveDark: "#ff4d6d",
    borderDark: "hsl(0, 30%, 30%)",
    ringDark: "hsl(0, 84%, 70%)",
  },
};

/**
 * Apply the selected theme to CSS variables.
 */
function applyThemeToCSS(
  theme: ColorThemeConfig,
  isDark: boolean,
) {
  const root = document.documentElement;

  const mappings: Record<string, keyof ColorThemeConfig> = {
    "--primary": "primary",
    "--accent": "accent",
    "--muted": "muted",
    "--destructive": "destructive",
    "--border": "border",
    "--ring": "ring",
  };

  Object.entries(mappings).forEach(([cssVar, key]) => {
    const darkKey = (key + "Dark") as keyof ColorThemeConfig;
    const value =
      isDark && theme[darkKey] ? theme[darkKey] : theme[key];
    if (value) {
      root.style.setProperty(cssVar, value);
    }
  });
}

export function ThemeProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [mode, setModeState] = useState<ThemeMode>("system");
  const [colorTheme, setColorThemeState] =
    useState<ColorTheme>("default");
  const [actualTheme, setActualTheme] = useState<
    "light" | "dark"
  >("light");

  // Load theme from localStorage on mount
  useEffect(() => {
    const savedMode = localStorage.getItem(
      "theme-mode",
    ) as ThemeMode;
    const savedColorTheme = localStorage.getItem(
      "color-theme",
    ) as ColorTheme;

    if (savedMode) setModeState(savedMode);
    if (savedColorTheme) setColorThemeState(savedColorTheme);
  }, []);

  // Update actual theme based on mode and system preference
  useEffect(() => {
    const updateTheme = () => {
      let newTheme: "light" | "dark";

      if (mode === "system") {
        newTheme = window.matchMedia(
          "(prefers-color-scheme: dark)",
        ).matches
          ? "dark"
          : "light";
      } else {
        newTheme = mode;
      }

      setActualTheme(newTheme);
      document.documentElement.classList.toggle(
        "dark",
        newTheme === "dark",
      );
    };

    updateTheme();

    // Listen for system theme changes
    const mediaQuery = window.matchMedia(
      "(prefers-color-scheme: dark)",
    );
    const handleChange = () => {
      if (mode === "system") updateTheme();
    };

    mediaQuery.addEventListener("change", handleChange);
    return () =>
      mediaQuery.removeEventListener("change", handleChange);
  }, [mode]);

  // Apply theme colors to CSS variables
  useEffect(() => {
    const theme = colorThemes[colorTheme];
    const isDark = actualTheme === "dark";

    applyThemeToCSS(theme, isDark);

    // Save preference
    localStorage.setItem("color-theme", colorTheme);
  }, [colorTheme, actualTheme]);

  const setMode = (newMode: ThemeMode) => {
    setModeState(newMode);
    localStorage.setItem("theme-mode", newMode);
  };

  const setColorTheme = (newTheme: ColorTheme) => {
    setColorThemeState(newTheme);
  };

  return (
    <ThemeContext.Provider
      value={{
        mode,
        colorTheme,
        setMode,
        setColorTheme,
        actualTheme,
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error(
      "useTheme must be used within a ThemeProvider",
    );
  }
  return context;
}

export { colorThemes };