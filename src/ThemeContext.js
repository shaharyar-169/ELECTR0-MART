import React, { createContext, useContext, useState } from "react";

const ThemeContext = createContext();

// Custom hook to use the theme context
export function useTheme() {
  return useContext(ThemeContext);
}

export function ThemeProvider({ children }) {
  // States for colors and sidebar
  const [isSidebarVisible, setSidebarVisible] = useState(false);
  const [getcolor, setcolor] = useState("#021A33");
  const [fontcolor, setfontcolor] = useState("white");

  // States for other theme values
  const [primaryColor, setPrimaryColor] = useState("#1f2670");
  const [secondaryColor, setSecondaryColor] = useState("white");
  const [navbarHeight, setNavbarHeight] = useState(30);
  const [pathHeight, setPathbarHeight] = useState(30);
  const [apiLinks, setApiLinks] = useState(
    "https://crystalsolutions.com.pk/api"
  );

  // Sidebar toggle function
  const toggleSidebar = (visible) => {
    setSidebarVisible(visible);
  };

  // Toggle sidebar colors (existing functionality)
  const toggleChangeColor = () => {
    setcolor((prev) => (prev === "#021A33" ? "white" : "#021A33"));
    setfontcolor((prev) => (prev === "white" ? "black" : "white"));
  };

  // Provide both states and set functions to allow updates from other components
  const theme = {
    isSidebarVisible,
    toggleSidebar,
    getcolor,
    fontcolor,
    setcolor, // Expose setter for background color
    setfontcolor, // Expose setter for font color
    primaryColor,
    secondaryColor,
    navbarHeight,
    pathHeight,
    apiLinks,
  };

  return (
    <ThemeContext.Provider value={theme}>{children}</ThemeContext.Provider>
  );
}
