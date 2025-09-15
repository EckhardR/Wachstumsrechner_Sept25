import React, { createContext, useContext, useEffect, useState } from "react";

// Create a context for the theme state
const ThemeContext = createContext({
  theme: "light",
  setTheme: () => {},
});

export const useTheme = () => useContext(ThemeContext);

export const ThemeProvider = ({ children }) => {
  const [theme, setTheme] = useState("light");

  useEffect(() => {
    const savedTheme = localStorage.getItem("selectedTheme") || "light";
    setTheme(savedTheme);
    document.querySelector("body").setAttribute("data-theme", savedTheme);
  }, []);

  useEffect(() => {
    document.querySelector("body").setAttribute("data-theme", theme);
  }, [theme]);

  return (
    <ThemeContext.Provider value={{ theme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};
