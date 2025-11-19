import React from "react";
import { Outlet } from "react-router-dom";
import SideBar1 from "../SideBar1/SideBar";
import Header from "../Header/Header";
import Footer from "../Footer/Footer";
import { useTheme } from "../../../ThemeContext";

const Layout = () => {
  const { isSidebarVisible, toggleSidebar, getcolor, toggleChangeColor } =
    useTheme();
  return (
    <div
      style={{
        display: "flex",
        backgroundColor: getcolor,
        flexDirection: "column",
        height: "100vh",
        overflowY: "hidden",
      }}
    >
      <Header />

      <div style={{ display: "flex", flex: 1 }}>
        <SideBar1 />

        <div
          style={{
            width: "100%",
            display: "flex",

            padding: "5px",
          }}
        >
          <Outlet />
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default Layout;
