import React from "react";
import { Link } from "react-router-dom";

const SingleButton = ({ to, text, style, onClick }) => {
  return (
    <Link to={to}>
      <button
        className="btn btn-primary"
        style={{
          fontFamily: "Poppins, sans-serif",
          fontStyle: "normal",
          fontWeight: 400,
          fontSize: "13px",
          lineHeight: "12px",
          color: "rgb(230, 233, 236)",
          backgroundColor: "#186DB7",
          padding: "10px 20px",
          border: "none",
          cursor: "pointer",
          width: "120px",
          textAlign: "center",
          borderRadius: "5px",
          marginRight: "5px",
          textTransform: "capitalize",
          ...style,
        }}
        onClick={onClick}
      >
        {text}
      </button>
    </Link>
  );
};

export default SingleButton;
