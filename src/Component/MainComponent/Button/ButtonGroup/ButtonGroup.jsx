import React, { useRef } from "react";

const ButtonGroup = ({
  Submit,
  handleFocus,
  handleBlur,
  handleSave,
  handleReturn,
  handleClear,
  handleFormSubmit,
}) => {
  const Return = useRef(null);
  const Clear = useRef(null);

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "row",
        justifyContent: "center",
        marginBottom: "2px",
        borderTop: "1px solid gray",
        marginTop: "5px",
      }}
    >
      <button
        style={{
          fontFamily: "Poppins, sans-serif",
          fontStyle: "normal",
          fontWeight: 400,
          fontSize: "13px",
          lineHeight: "10px",
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
          backgroundColor: "#3368B5",
          width: "120px",
        }}
        onFocus={() => handleFocus(Submit)}
        onBlur={() => handleBlur(Submit)}
        accessKey="s"
        onKeyDown={(event) => {
          if (event.altKey && event.key === "s") {
            handleSave();
            event.preventDefault();
          } else if (event.key === "ArrowRight") {
            Return.current.focus();
            event.preventDefault();
          }
        }}
        onClick={handleFormSubmit}
        ref={Submit}
      >
        Save
      </button>

      <button
        style={{
          fontFamily: "Poppins, sans-serif",
          fontStyle: "normal",
          fontWeight: 400,
          fontSize: "13px",
          lineHeight: "10px",
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
          backgroundColor: "#3368B5",
          width: "120px",
        }}
        accessKey="r"
        onKeyDown={(event) => {
          if (event.altKey && event.key === "r") {
            handleReturn();
            event.preventDefault();
          } else if (event.key === "ArrowRight") {
            Clear.current.focus();
            event.preventDefault();
          } else if (event.key === "ArrowLeft") {
            Submit.current.focus();
            event.preventDefault();
          }
        }}
        onFocus={() => handleFocus(Return)}
        onBlur={() => handleBlur(Return)}
        ref={Return}
        onClick={handleReturn}
      >
        Return
      </button>

      <button
        style={{
          fontFamily: "Poppins, sans-serif",
          fontStyle: "normal",
          fontWeight: 400,
          fontSize: "13px",
          lineHeight: "10px",
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
          backgroundColor: "#3368B5",
          width: "120px",
        }}
        accessKey="c"
        onKeyDown={(event) => {
          if (event.altKey && event.key === "c") {
            handleClear();
            event.preventDefault();
          } else if (event.key === "ArrowLeft") {
            Return.current.focus();
            event.preventDefault();
          } else if (event.key === "ArrowRight") {
            Submit.current.focus();
            event.preventDefault();
          }
        }}
        ref={Clear}
        onFocus={() => handleFocus(Clear)}
        onBlur={() => handleBlur(Clear)}
        onClick={handleClear}
      >
        New
      </button>
    </div>
  );
};

export default ButtonGroup;
