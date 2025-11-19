import { React, useState } from "react";
import "../../../menu.css";
import "./Homepage.css";

import { useTheme } from "../../../ThemeContext";
function HomePage1() {
  const { isSidebarVisible, toggleSidebar, getcolor, toggleChangeColor } =
    useTheme();

  return (
    <>
      <div style={{ backgroundColor: getcolor, height: "100vh" }}></div>
    </>
  );
}

export default HomePage1;
