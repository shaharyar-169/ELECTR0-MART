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
  const [getfromdate, setFromDate] = useState("");
  const [gettodate, setToDate] = useState("");
  const [getLocationNumber, setLocationNumber] = useState("");
  const [getyeardescription, setYearDescription] = useState("");

  // States for other theme values
  const [getbuttonbackgroundcolor, setbuttonbackgroundcolor] =
    useState("#186DB7");
  // #186DB7
  const [getbuttonfontcolor, setbuttonfontcolor] =
    useState("rgb(230, 233, 236)");
  const [getnavbarbackgroundcolor, setnavbarbackgrouncolor] =
    useState("#3368b5");
  const [getnavbarfontcolor, setnavbarfontcolor] = useState("#fff");

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
    setcolor,
    setfontcolor,
    setFromDate,
    setToDate,
    setLocationNumber,
    setYearDescription,
    toggleChangeColor,
    getfromdate,
    gettodate,
    getLocationNumber,
    getyeardescription,
    getbuttonfontcolor,
    getbuttonbackgroundcolor,
    getnavbarbackgroundcolor,
    getnavbarfontcolor,
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
