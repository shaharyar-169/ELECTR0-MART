// Admin.js
import React from "react";
import { styled, alpha } from "@mui/material/styles";
import { useTheme } from "../../../../ThemeContext";
import { useNavigate } from "react-router-dom";

const Admin = ({ isOpen }) => {
  const navigate = useNavigate();
  const { getcolor, fontcolor } = useTheme(); // Use the theme context

  const PopupContainer = styled("div")({
    position: "absolute",
    top: "60px",
    right: "10vw",
    width: "200px",
    backgroundColor: getcolor, // Get from context
    borderRadius: "10px",
    boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)",
    zIndex: 1,
    padding: "10px",
    color: fontcolor, // Get from context
    fontFamily: "Arial, sans-serif",
    transition: "all 0.3s ease",
  });

  const MenuItem = styled("div")({
    padding: "10px",
    cursor: "pointer",
    "&:hover": {
      backgroundColor: "#3368B5",
      color: getcolor,
    },
  });

  return (
    isOpen && (
      <PopupContainer>
        <MenuItem
          onClick={() => {
            navigate("/Customer");
          }}
        >
          Customer
        </MenuItem>
        <MenuItem
          onClick={() => {
            navigate("/MenuAdmin");
          }}
        >
          Menu
        </MenuItem>
      </PopupContainer>
    )
  );
};

export default Admin;
