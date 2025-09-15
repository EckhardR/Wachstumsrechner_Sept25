import React, { useEffect } from "react";
import { ReactComponent as Sun } from "./Sun.svg";
import { ReactComponent as Moon } from "./Moon.svg";
import "./DarkMode.css";
import { useTheme } from "./ThemeProvider";

const DarkMode = () => {
  const { theme, setTheme } = useTheme();

  const toggleTheme = () => {
    setTheme(theme === "light" ? "dark" : "light");
    localStorage.setItem("selectedTheme", theme === "light" ? "dark" : "light");
  };

  return (
    <div
      className="dark_mode"
      data-bs-toggle="tooltip"
      data-bs-placement="top"
      title="Enable dark or light mode"
      style={{ marginRight: "1vh" }}
    >
      <input
        className="dark_mode_input"
        type="checkbox"
        id="darkmode-toggle"
        onChange={toggleTheme}
        defaultChecked={theme === "dark"}
      />
      <label className="dark_mode_label" htmlFor="darkmode-toggle">
        <Sun style={{ marginRight: "10%" }} />
        <Moon />
      </label>
    </div>
  );
};

export default DarkMode;
