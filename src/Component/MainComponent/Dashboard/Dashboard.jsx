import React from "react";
import './Dashboard.css'
import "react-datepicker/dist/react-datepicker.css";
import { useTheme } from "../../../ThemeContext";
export default function Dasboard() {

  const {
    isSidebarVisible,
    toggleSidebar,
    getcolor,
    fontcolor,
    
    toggleChangeColor,
    apiLinks,

  } = useTheme();

  const contentStyle = {
    backgroundColor: getcolor,
    width: isSidebarVisible ? "calc(80vw - 0%)" : "80vw",
    position: "relative",
    top: "43%",
    left: isSidebarVisible ? "50%" : "50%",
    transform: "translate(-50%, -50%)",
    transition: isSidebarVisible
      ? "left 3s ease-in-out, width 2s ease-in-out"
      : "left 3s ease-in-out, width 2s ease-in-out",
    display: "flex",
    justifyContent: "center",
    alignItems: "start",
    overflowX: "hidden",
    overflowY: "hidden",
    wordBreak: "break-word",
    textAlign: "center",
    // maxWidth: "1000px",
    fontSize: "15px",
    fontStyle: "normal",
    fontWeight: "400",
    lineHeight: "23px",
    fontFamily: '"Poppins", sans-serif',
    padding: '0px',
    Margin: '0px'
  };

  return (
    <>

      <div className="Countair_styling" style={contentStyle} >
        <div className="row Row_styling">
          <div className="Card_styling">
            <div className="row" style={{width:'100%'}}>
              <div className="col-md-5 text-start "style={{color:fontcolor, paddingLeft:'25px'}}>Today</div>
            <div className="col-md-7 text-start " style={{color:fontcolor, fontWeight:'bold'}} >999,999,99</div>
            </div>
            <div className="row" style={{width:'100%'}}>
              <div className="col-md-5 text-start "style={{color:fontcolor,  paddingLeft:'25px'}}>This Month</div>
            <div className="col-md-7 text-start " style={{color:fontcolor, fontWeight:'bold'}} >999,999,99</div>
            </div>
            <div className="row" style={{width:'100%'}}>
              <div className="col-md-5 text-start"style={{color:fontcolor,  paddingLeft:'25px'}}>This Year</div>
            <div className="col-md-7 text-start " style={{color:fontcolor, fontWeight:'bold'}} >999,999,99</div>
            </div>
          </div>
          <div className="Card_styling">
          <div className="row" style={{width:'100%'}}>
              <div className="col-md-5 text-start "style={{color:fontcolor, paddingLeft:'25px'}}>Stock</div>
            <div className="col-md-7 text-start " style={{color:fontcolor, fontWeight:'bold'}} >999,999,99</div>
            </div>
            <div className="row" style={{width:'100%'}}>
              <div className="col-md-5 text-start "style={{color:fontcolor,  paddingLeft:'25px'}}>Receivable</div>
            <div className="col-md-7 text-start " style={{color:fontcolor, fontWeight:'bold'}} >999,999,99</div>
            </div>
            <div className="row" style={{width:'100%'}}>
              <div className="col-md-5 text-start"style={{color:fontcolor,  paddingLeft:'25px'}}>Payable</div>
            <div className="col-md-7 text-start " style={{color:fontcolor, fontWeight:'bold'}} >999,999,99</div>
            </div>
          </div>
          <div className="Card_styling"></div>
          <div className="Card_styling"></div>

        </div>
      </div>
    </>
  );
}
