import React, { useRef } from "react";

const ButtonGroupprint = ({
  Submit,
  handleFocus,
  handleBlur,
  handleSave,
  handleReturn,
  handleClear,
  handlePrint,
  handleFormSubmit,
}) => {
  const Return = useRef(null);
  const Clear = useRef(null);
  const Print = useRef(null);
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "row",
        justifyContent: "center",
        marginBottom: "2px",
        borderTop: "1px solid gray ",
      }}
    >
      <button
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
            Print.current.focus();
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
      <button
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
          backgroundColor: "#3368B5",
          width: "120px",
        }}
        accessKey="p"
        onKeyDown={(event) => {
          if (event.altKey && event.key === "p") {
            handlePrint();
            event.preventDefault();
          } else if (event.key === "ArrowLeft") {
            Clear.current.focus();
            event.preventDefault();
          } else if (event.key === "ArrowRight") {
            Submit.current.focus();
            event.preventDefault();
          }
        }}
        ref={Print}
        onFocus={() => handleFocus(Print)}
        onBlur={() => handleBlur(Print)}
        onClick={handlePrint}
      >
        Print
      </button>
    </div>
  );
};

export default ButtonGroupprint;
