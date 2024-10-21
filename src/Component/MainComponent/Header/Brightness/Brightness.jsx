// BrightnessPopup.js
import React, { useState } from "react";
import { styled } from "@mui/material/styles";
import { useTheme } from "../../../../ThemeContext";

const BrightnessPopup = ({ isOpen }) => {
  const { getcolor, fontcolor, setcolor, setfontcolor } = useTheme(); // Use the theme context

  const PopupContainer = styled("div")({
    position: "absolute",
    top: "60px",
    right: "20px",
    width: "360px",
    backgroundColor: getcolor, // Get from context
    borderRadius: "10px",
    boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)",
    zIndex: 1,
    padding: "10px",
    color: fontcolor, // Get from context
    fontFamily: "Arial, sans-serif",
    transition: "all 0.3s ease",
  });

  const Header = styled("h3")({
    margin: "0 0 10px 0",
    padding: "10px",
    backgroundColor: "#007BFF",
    borderRadius: "5px",
    textAlign: "center",
    fontSize: "16px", // Small but still readable
  });

  const ColorSelectorContainer = styled("div")({
    display: "flex",
    justifyContent: "space-between",
    marginBottom: "20px",
  });

  const ColorSelector = styled("div")({
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    width: "48%",
  });

  const ColorLabel = styled("label")({
    fontSize: "12px",
    marginBottom: "5px",
  });

  const ColorInput = styled("input")({
    width: "100%",
    padding: "5px",
    borderRadius: "5px",
    border: "1px solid #007BFF",
    cursor: "pointer",
  });

  const CheckButton = styled("button")({
    backgroundColor: "#007BFF",
    color: "#fff",
    width: "100%",
    padding: "10px",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
    fontWeight: "bold",
    fontSize: "12px",
  });

  return (
    isOpen && (
      <PopupContainer>
        <Header>Brightness</Header>

        <ColorSelectorContainer>
          <ColorSelector>
            <ColorLabel htmlFor="bgColor">Background Color</ColorLabel>
            <ColorInput
              type="color"
              id="bgColor"
              value={getcolor}
              onChange={(e) => setcolor(e.target.value)} // Update background color in context
            />
          </ColorSelector>

          <ColorSelector>
            <ColorLabel htmlFor="fontColor">Font Color</ColorLabel>
            <ColorInput
              type="color"
              id="fontColor"
              value={fontcolor}
              onChange={(e) => setfontcolor(e.target.value)} // Update font color in context
            />
          </ColorSelector>
        </ColorSelectorContainer>

        <CheckButton>Check All Messages</CheckButton>
      </PopupContainer>
    )
  );
};

export default BrightnessPopup;
