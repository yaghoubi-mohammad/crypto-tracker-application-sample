"use client";

import {
  createContext,
  useContext,
  useState,
  ReactNode,
  useEffect,
} from "react";

interface ThemeContextProps {
  theme: "light" | "dark";
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextProps | undefined>(undefined);

export const ThemeProvider = ({ children }: { children: ReactNode }) => {
  const [theme, setTheme] = useState<"light" | "dark">(() => {
    try {
      // Attempt to retrieve the theme from localStorage, fallback to "light" if unavailable
      if (typeof window !== "undefined") {
        const savedTheme = localStorage.getItem("theme");
        return savedTheme === "dark" ? "dark" : "light";
      }
    } catch (error) {
      console.error("Failed to retrieve theme from localStorage:", error);
    }
    return "dark";
  });

  const toggleTheme = () => {
    setTheme((prevTheme) => {
      const newTheme = prevTheme === "light" ? "dark" : "light";
      try {
        // Save the new theme to localStorage
        localStorage.setItem("theme", newTheme);
      } catch (error) {
        console.error("Failed to save theme to localStorage:", error);
      }
      return newTheme;
    });
  };

  useEffect(() => {
    try {
      // Apply the current theme to the document element
      if (theme === "dark") {
        document.documentElement.classList.add("dark");
      } else {
        document.documentElement.classList.remove("dark");
      }
    } catch (error) {
      console.error("Failed to apply theme to document:", error);
    }
  }, [theme]);

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);

  // Ensure the hook is used within a ThemeProvider
  if (!context) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
};
