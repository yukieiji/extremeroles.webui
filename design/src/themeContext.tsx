/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useState, useEffect, type ReactNode } from "react";
import {
  BASIC_TEXT_COLOR,
  BASIC_TEXT_COLOR_DARK,
  PRIMARY_ACTION_COLOR,
  PRIMARY_ACTION_COLOR_DARK,
  SEMANTIC_COLORS,
  SEMANTIC_COLORS_DARK,
  NEUTRAL_COLORS,
  NEUTRAL_COLORS_DARK,
  SEARCH_HIGHLIGHT_COLOR,
  SEARCH_HIGHLIGHT_COLOR_DARK,
} from "./designConstants";

// テーマ情報のインターフェース
interface ThemeContextType {
  isDark: boolean;
  setIsDark: (dark: boolean) => void;
}

// テーマのコンテキストを作成
const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

interface ThemeProviderProps {
  children: ReactNode;
}

// テーマのプロバイダーコンポーネント
export function ThemeProvider({ children }: ThemeProviderProps) {
  const [isDark, setIsDarkState] = useState(() => {
    if (typeof window !== "undefined" && typeof localStorage !== "undefined") {
      const stored = localStorage.getItem("design-theme");
      if (stored !== null) {
        return stored === "dark";
      }
    }
    if (typeof document !== "undefined") {
      return document.documentElement.classList.contains("dark");
    }
    return false;
  });

  const setIsDark = (dark: boolean) => {
    setIsDarkState(dark);
    if (typeof localStorage !== "undefined") {
      localStorage.setItem("design-theme", dark ? "dark" : "light");
    }
  };

  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [isDark]);

  return (
    <ThemeContext.Provider value={{ isDark, setIsDark }}>
      {children}
    </ThemeContext.Provider>
  );
}

// テーマ状態を取得する汎用フック
export function useTheme() {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
}

// ダークテーマ有効・無効に応じたデザインシステム用カラー定数を自動返却するフック
export function useDesignTheme() {
  const { isDark } = useTheme();

  const neutralColorsBase = isDark ? NEUTRAL_COLORS_DARK : NEUTRAL_COLORS;
  const neutralColors = {
    ...neutralColorsBase,
    neutral1: {
      ...neutralColorsBase.neutral1,
      hex: isDark ? "#000000" : "#FFFFFF",
      bg: isDark ? "bg-black" : "bg-white",
    },
  };

  return {
    isDark,
    basicTextColor: isDark ? BASIC_TEXT_COLOR_DARK : BASIC_TEXT_COLOR,
    primaryActionColor: isDark ? PRIMARY_ACTION_COLOR_DARK : PRIMARY_ACTION_COLOR,
    semanticColors: isDark ? SEMANTIC_COLORS_DARK : SEMANTIC_COLORS,
    neutralColors,
    searchHighlightColor: isDark ? SEARCH_HIGHLIGHT_COLOR_DARK : SEARCH_HIGHLIGHT_COLOR,
  };
}
