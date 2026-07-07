import React, { useEffect, useState } from "react";
import './electronics.css'
import "react-datepicker/dist/react-datepicker.css";
import axios from "axios";
import { Spinner } from "react-bootstrap";
import DatePicker from "react-datepicker";
import { BsCalendar } from "react-icons/bs";
import { getOrganisationData, getUserData } from "../../Auth";
import { useTheme } from "../../../ThemeContext";
import { Dashboard } from "@mui/icons-material";

export default function ElectronicsDasboard() {

 const {
    isSidebarVisible,
    toggleSidebar,
    getcolor,
    fontcolor,
    toggleChangeColor,
    apiLinks,
    getLocationNumber,
    getyeardescription,
    getfromdate,
    gettodate,
    getfontstyle,
    getdatafontsize,
  } = useTheme();


 const contentStyle = {
    // backgroundColor: getcolor,
     backgroundColor: "lightgrey",
    width: isSidebarVisible ? "calc(90vw - 0%)" : "90vw",
    position: "relative",
    top: "42%",
    left: isSidebarVisible ? "50%" : "50%",
    transform: "translate(-50%, -50%)",
    transition: isSidebarVisible
      ? "left 3s ease-in-out, width 2s ease-in-out"
      : "left 3s ease-in-out, width 2s ease-in-out",
    display: "flex",
    justifyContent: "start",
    alignItems: "start",
    overflowX: "hidden",
    overflowY: "hidden",
    wordBreak: "break-word",
    textAlign: "center",
    maxWidth: "90vw",
    fontSize: "15px",
    fontStyle: "normal",
    fontWeight: "400",
    lineHeight: "23px",
    fontFamily: '"Poppins", sans-serif',
    padding: "0px",
    Margin: "0px",
  };


  return (
    <>

       <div className="row Countair_styling" style={contentStyle}>
             <div style={{ gap:'10px',display:'flex',height: "100%", width: "100%", padding: "0px" , padding:'10px'}}>
               {/* main left section */}
              <div style={{width:'75%', height:'100%'}}> 
            <div style={{width:'100%', height:'100%', gap:'10px'}}>
              
               <div style={{display:'flex',flexWrap:'nowrap',gap:'10px',width:'100%', height:'200px'}}>
                <div style={{width:'35%', borderRadius:'10px',backgroundColor:'white',height:'100%', background:'yellow'}}> 
                    <div style={{}}> <span> Sale</span></div>
                    <div></div>
                    <div></div>
                </div>
                <div style={{width:'35%', height:'100%', background:'yellow'}}></div>
                <div style={{width:'35%', height:'100%', background:'yellow'}}></div>
               </div>
                 <div style={{marginTop:'20px' ,display:'flex',flexWrap:'nowrap',gap:'10px',width:'100%', height:'200px', background:'blue'}}>
                <div style={{width:'35%', height:'100%', background:'yellow'}}> hjdhfkjfk</div>
                <div style={{width:'35%', height:'100%', background:'yellow'}}></div>
                <div style={{width:'35%', height:'100%', background:'yellow'}}></div>
               </div>
               </div>
             
              </div>
               {/* main right section */}
              <div style={{width:'25%', height:'100%',background:'green'}}></div>
               
              </div>
            </div>
   

    </>
  );
}
