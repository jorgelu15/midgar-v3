import { createContext, useContext, useEffect, useState } from "react";
import type { ReactNode } from "react"

type ThemeOption = "light" | "dark";
type FontSizeOption = 0 | 1 | 2 | 3 | 4;

interface ThemeContextType {
  theme: ThemeOption;
  setTheme: (theme: ThemeOption) => void;
  fontSize: FontSizeOption;
  setFontSize: (size: FontSizeOption) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider = ({ children }: { children: ReactNode }) => {
  const [theme, setThemeState] = useState<ThemeOption>(() => {
    const stored = localStorage.getItem("app_theme");
    return (stored as ThemeOption) || "light";
  });

  const [fontSize, setFontSizeState] = useState<FontSizeOption>(() => {
    const stored = localStorage.getItem("font_size");
    const parsed = parseInt(stored || "2", 10);
    return (isNaN(parsed) ? 2 : parsed) as FontSizeOption;
  });

  // Actualizar theme en el DOM y en localStorage
  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
    localStorage.setItem("app_theme", theme);
  }, [theme]);

  // Actualizar font-size global y guardar
  useEffect(() => {
    document.documentElement.style.setProperty("--font-scale", `${1 + fontSize * 0.1}`);
    localStorage.setItem("font_size", fontSize.toString());
  }, [fontSize]);

  const setTheme = (newTheme: ThemeOption) => setThemeState(newTheme);
  const setFontSize = (size: FontSizeOption) => setFontSizeState(size);

  return (
    <ThemeContext.Provider value={{ theme, setTheme, fontSize, setFontSize }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error("useTheme debe usarse dentro de ThemeProvider");
  return ctx;
};
