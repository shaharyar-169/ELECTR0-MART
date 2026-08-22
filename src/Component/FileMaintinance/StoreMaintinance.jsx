import React, { useState, useEffect, useRef } from "react";
import { Container, Spinner, Nav } from "react-bootstrap";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import { useTheme } from "../../ThemeContext";
import {
  getUserData,
  getOrganisationData,
  getLocationnumber,
  getYearDescription,
} from "../Auth";

import NavComponent from "../MainComponent/Navform/navbarform";
import SingleButton from "../MainComponent/Button/SingleButton/SingleButton";
import Select from "react-select";
import { components } from "react-select";
import { BsCalendar } from "react-icons/bs";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import jsPDF from "jspdf";
import ExcelJS from "exceljs";
import { saveAs } from "file-saver";
import "react-calendar/dist/Calendar.css";
import { useSelector, useDispatch } from "react-redux";
import { useHotkeys } from "react-hotkeys-hook";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Balance, CreditCard, Description } from "@mui/icons-material";
import { autoTable } from "jspdf-autotable";
import './storemaintenance.css'

// export default function StoreMaintinanace() {

//  const {
//     isSidebarVisible,
//     toggleSidebar,
//     getcolor,
//     fontcolor,
//     toggleChangeColor,
//     apiLinks,
//     getLocationNumber,
//     getyeardescription,
//     getfromdate,
//     gettodate,
//     getfontstyle,
//     getdatafontsize,
//     getnavbarbackgroundcolor,
//   } = useTheme();

//    const contentStyle = {
//     width: "100%", // 100vw ki jagah 100%
//     maxWidth: "900px",
//     height: "calc(100vh - 100px)",
//     position: "absolute",
//     top: "70px",
//     left: isSidebarVisible ? "60vw" : "50vw",
//     transform: "translateX(-50%)",
//     display: "flex",
//     flexDirection: "column",
//     justifyContent: "center",
//     alignItems: "center",
//     overflow: "hidden",
//     textAlign: "center",
//     fontSize: "15px",
//     fontStyle: "normal",
//     fontWeight: "400",
//     lineHeight: "23px",
//     fontFamily: '"Poppins", sans-serif',
//     zIndex: 1,
//     padding: "0 20px", // Side padding for small screens
//     boxSizing: "border-box", // Padding ko width mein include kare
//   };

// const horizontalFieldWrapperStyle = {
//   display: "flex",
//   alignItems: "center",
//   gap: "5px",
// };

// const horizontalLabelStyle = {
//   fontSize: "11px",
//   fontWeight: "600",
//   opacity: "0.85",
//   display: "flex",
//   alignItems: "center",
//   whiteSpace: "nowrap",
//   minWidth: "60px",
//   textAlign: "end",
//   justifyContent: "flex-end",
// };

// const horizontalInputStyle = {
//   height: "22px",
//   padding: "1px 8px",
//   borderWidth: "1px",
//   borderRadius: "4px",
//   fontSize: "11px",
//   transition: "all 0.3s ease",
//   outline: "none",
//   fontFamily: "inherit",
//   flex: 1,
//   minWidth: "0",
// };

// const buttonStyle = {
//   padding: "10px 24px",
//   borderRadius: "8px",
//   fontSize: "14px",
//   fontWeight: "600",
//   cursor: "pointer",
//   transition: "all 0.3s ease",
//   display: "flex",
//   alignItems: "center",
//   gap: "8px",
//   boxShadow: "0 2px 10px rgba(0,0,0,0.05)",
// };
 

//   return (
//   <>
//    <div style={contentStyle}>
 
//    {/* Form section */}
// <div
//   style={{
//     backgroundColor: getcolor,
//     color: fontcolor,
//     border: `1px solid ${fontcolor}`,
//     borderRadius: "12px",
//     boxShadow: "0 10px 40px rgba(0,0,0,0.15), 0 4px 20px rgba(0,0,0,0.08)",
//     overflow: "hidden",
//   }}
// >
//   {/* Store Maintenance Header - Full Width at Top */}
//   <div
//     style={{
//       display: "flex",
//       alignItems: "center",
//       justifyContent: "center",
//       padding: "6px 20px",
//       background: `#3368B5`, // Changed to #3368B5
//       borderBottom: `2px solid rgba(255,255,255,0.2)`,
//       position: "relative",
//       overflow: "hidden",
//       gap: "8px",
//       minHeight: "44px",
//     }}
//   >
//     {/* Decorative Background Elements */}
//     <div
//       style={{
//         position: "absolute",
//         top: "-60%",
//         right: "-10%",
//         width: "300px",
//         height: "300px",
//         borderRadius: "50%",
//         background: "rgba(255,255,255,0.05)",
//         pointerEvents: "none",
//       }}
//     />
//     <div
//       style={{
//         position: "absolute",
//         bottom: "-40%",
//         left: "-5%",
//         width: "200px",
//         height: "200px",
//         borderRadius: "50%",
//         background: "rgba(255,255,255,0.05)",
//         pointerEvents: "none",
//       }}
//     />
    
//     {/* Icon */}
//     <div
//       style={{
//         fontSize: "14px",
//         background: "rgba(255,255,255,0.12)",
//         padding: "4px",
//         borderRadius: "50%",
//         width: "28px",
//         height: "28px",
//         display: "flex",
//         alignItems: "center",
//         justifyContent: "center",
//         border: "1.5px solid rgba(255,255,255,0.2)",
//         backdropFilter: "blur(10px)",
//         zIndex: 1,
//         flexShrink: 0,
//       }}
//     >
//       🏪
//     </div>
    
//     {/* Title */}
//     <h2
//       style={{
//         margin: "0",
//         fontSize: "15px",
//         fontWeight: "600",
//         color: "#ffffff",
//         letterSpacing: "0.5px",
//         textShadow: "0 1px 4px rgba(0,0,0,0.15)",
//         zIndex: 1,
//       }}
//     >
//       Store Maintenance
//     </h2>
//   </div>

//   {/* Form Section */}
//   <div
//     style={{
//       padding: "15px 15px 12px 15px",
//     }}
//   >
//     {/* Row 1: Code + Status (side by side) */}
//     <div
//       style={{
//         display: "grid",
//         gridTemplateColumns: "1fr 1fr",
//         gap: "4px 15px",
//         marginBottom: "4px",
//       }}
//     >
//       {/* Code Field - Number */}
//       <div style={horizontalFieldWrapperStyle}>
//         <label style={horizontalLabelStyle}>Code</label>
//         <input
//           type="number"
//           placeholder="Code"
//           style={{
//             ...horizontalInputStyle,
//             borderColor: fontcolor,
//             color: fontcolor,
//             backgroundColor: `${fontcolor}10`,
//           }}
//           onFocus={(e) => {
//             e.target.style.borderColor = "#3368B5";
//             e.target.style.borderWidth = "1px";
//             e.target.style.boxShadow = "0 0 0 2px rgba(51, 104, 181, 0.2)";
//           }}
//           onBlur={(e) => {
//             e.target.style.borderColor = fontcolor;
//             e.target.style.borderWidth = "1px";
//             e.target.style.boxShadow = "none";
//           }}
//         />
//       </div>

//       {/* Status Field - Select */}
//       <div style={horizontalFieldWrapperStyle}>
//         <label style={horizontalLabelStyle}>Status</label>
//         <select
//           style={{
//             ...horizontalInputStyle,
//             borderColor: fontcolor,
//             color: fontcolor,
//             backgroundColor: `${fontcolor}10`,
//             cursor: "pointer",
//           }}
//           onFocus={(e) => {
//             e.target.style.borderColor = "#3368B5";
//             e.target.style.borderWidth = "1px";
//             e.target.style.boxShadow = "0 0 0 2px rgba(51, 104, 181, 0.2)";
//           }}
//           onBlur={(e) => {
//             e.target.style.borderColor = fontcolor;
//             e.target.style.borderWidth = "1px";
//             e.target.style.boxShadow = "none";
//           }}
//         >
//           <option value="">Select Status</option>
//           <option value="active">Active</option>
//           <option value="inactive">Inactive</option>
//           <option value="pending">Pending</option>
//           <option value="closed">Closed</option>
//         </select>
//       </div>
//     </div>

//     {/* Row 2: Description (full width) */}
//     <div
//       style={{
//         display: "grid",
//         gridTemplateColumns: "1fr",
//         gap: "4px 25px",
//         marginBottom: "4px",
//       }}
//     >
//       <div style={horizontalFieldWrapperStyle}>
//         <label style={horizontalLabelStyle}>Description</label>
//         <input
//           type="text"
//           placeholder="Description"
//           style={{
//             ...horizontalInputStyle,
//             borderColor: fontcolor,
//             color: fontcolor,
//             backgroundColor: `${fontcolor}10`,
//           }}
//           onFocus={(e) => {
//             e.target.style.borderColor = "#3368B5";
//             e.target.style.borderWidth = "1px";
//             e.target.style.boxShadow = "0 0 0 2px rgba(51, 104, 181, 0.2)";
//           }}
//           onBlur={(e) => {
//             e.target.style.borderColor = fontcolor;
//             e.target.style.borderWidth = "1px";
//             e.target.style.boxShadow = "none";
//           }}
//         />
//       </div>
//     </div>

//     {/* Row 3: Store Abb (reduced width - 50%) */}
//     <div
//       style={{
//         display: "grid",
//         gridTemplateColumns: "0.5fr 1fr",
//         gap: "4px 25px",
//         marginBottom: "4px",
//       }}
//     >
//       <div style={horizontalFieldWrapperStyle}>
//         <label style={horizontalLabelStyle}>Store Abb</label>
//         <input
//           type="text"
//           placeholder="Abbreviation"
//           style={{
//             ...horizontalInputStyle,
//             borderColor: fontcolor,
//             color: fontcolor,
//             backgroundColor: `${fontcolor}10`,
//             maxWidth: "250px",
//           }}
//           onFocus={(e) => {
//             e.target.style.borderColor = "#3368B5";
//             e.target.style.borderWidth = "1px";
//             e.target.style.boxShadow = "0 0 0 2px rgba(51, 104, 181, 0.2)";
//           }}
//           onBlur={(e) => {
//             e.target.style.borderColor = fontcolor;
//             e.target.style.borderWidth = "1px";
//             e.target.style.boxShadow = "none";
//           }}
//         />
//       </div>
//     </div>

//     {/* Row 4: Stock (reduced width - 50%) */}
//     <div
//       style={{
//         display: "grid",
//         gridTemplateColumns: "0.5fr 1fr",
//         gap: "4px 25px",
//         marginBottom: "10px",
//       }}
//     >
//       <div style={horizontalFieldWrapperStyle}>
//         <label style={horizontalLabelStyle}>Stock</label>
//         <select
//           style={{
//             ...horizontalInputStyle,
//             borderColor: fontcolor,
//             color: fontcolor,
//             backgroundColor: `${fontcolor}10`,
//             cursor: "pointer",
//             maxWidth: "250px",
//           }}
//           onFocus={(e) => {
//             e.target.style.borderColor = "#3368B5";
//             e.target.style.borderWidth = "1px";
//             e.target.style.boxShadow = "0 0 0 2px rgba(51, 104, 181, 0.2)";
//           }}
//           onBlur={(e) => {
//             e.target.style.borderColor = fontcolor;
//             e.target.style.borderWidth = "1px";
//             e.target.style.boxShadow = "none";
//           }}
//         >
//           <option value="">Select Stock</option>
//           <option value="in-stock">In Stock</option>
//           <option value="out-of-stock">Out of Stock</option>
//           <option value="low-stock">Low Stock</option>
//           <option value="pre-order">Pre-Order</option>
//         </select>
//       </div>
//     </div>

//     {/* Action Buttons for Form - Center Aligned */}
//     <div
//       style={{
//         display: "flex",
//         gap: "10px",
//         marginTop: "6px",
//         justifyContent: "center",
//         borderTop: `1px solid ${fontcolor}20`,
//         paddingTop: "10px",
//       }}
//     >
//       <button
//         style={{
//           ...buttonStyle,
//           padding: "4px 16px",
//           background: `#3368B5`, // Changed to #3368B5
//           color: "#fff",
//           border: "none",
//           fontSize: "12px",
//           borderRadius: "6px",
//         }}
//         onMouseEnter={(e) => {
//           e.target.style.background = `#28528C`; // Darker shade for hover
//           e.target.style.transform = "translateY(-2px)";
//           e.target.style.boxShadow = "0 6px 20px rgba(51, 104, 181, 0.4)";
//         }}
//         onMouseLeave={(e) => {
//           e.target.style.background = `#3368B5`;
//           e.target.style.transform = "translateY(0)";
//           e.target.style.boxShadow = "none";
//         }}
//       >
//         💾 Save
//       </button>
//       <button
//         style={{
//           ...buttonStyle,
//           padding: "4px 16px",
//           background: `#3368B5`, // Changed to #3368B5
//           color: "#fff",
//           border: "none",
//           fontSize: "12px",
//           borderRadius: "6px",
//         }}
//         onMouseEnter={(e) => {
//           e.target.style.background = `#28528C`; // Darker shade for hover
//           e.target.style.transform = "translateY(-2px)";
//           e.target.style.boxShadow = "0 6px 20px rgba(51, 104, 181, 0.4)";
//         }}
//         onMouseLeave={(e) => {
//           e.target.style.background = `#3368B5`;
//           e.target.style.transform = "translateY(0)";
//           e.target.style.boxShadow = "none";
//         }}
//       >
//         🗑️ Return
//       </button>
//       <button
//         style={{
//           ...buttonStyle,
//           padding: "4px 16px",
//           background: `#3368B5`, // Changed to #3368B5
//           color: "#fff",
//           border: "none",
//           fontSize: "12px",
//           borderRadius: "6px",
//         }}
//         onMouseEnter={(e) => {
//           e.target.style.background = `#28528C`; // Darker shade for hover
//           e.target.style.transform = "translateY(-2px)";
//           e.target.style.boxShadow = "0 6px 20px rgba(51, 104, 181, 0.4)";
//         }}
//         onMouseLeave={(e) => {
//           e.target.style.background = `#3368B5`;
//           e.target.style.transform = "translateY(0)";
//           e.target.style.boxShadow = "none";
//         }}
//       >
//         ✏️ New
//       </button>
//     </div>
//   </div>
// </div>




// </div>
//   </>
// );
// }





////////////////////////////////////////////////////



// export default function StoreMaintinanace() {
//   const {
//     isSidebarVisible,
//     toggleSidebar,
//     getcolor,
//     fontcolor,
//     toggleChangeColor,
//     apiLinks,
//     getLocationNumber,
//     getyeardescription,
//     getfromdate,
//     gettodate,
//     getfontstyle,
//     getdatafontsize,
//     getnavbarbackgroundcolor,
//   } = useTheme();

//   const contentStyle = {
//     width: "100%",
//     maxWidth: "900px",
//     height: "calc(100vh - 100px)",
//     position: "absolute",
//     top: "70px",
//     left: isSidebarVisible ? "60vw" : "50vw",
//     transform: "translateX(-50%)",
//     display: "flex",
//     flexDirection: "column",
//     justifyContent: "center",
//     alignItems: "center",
//     overflow: "hidden",
//     textAlign: "center",
//     fontSize: "15px",
//     fontStyle: "normal",
//     fontWeight: "400",
//     lineHeight: "23px",
//     fontFamily: '"Poppins", sans-serif',
//     zIndex: 1,
//     padding: "0 20px",
//     boxSizing: "border-box",
//   };

//   // Enhanced field wrapper with better spacing
//   const horizontalFieldWrapperStyle = {
//     display: "flex",
//     alignItems: "center",
//     gap: "8px",
//     width: "100%",
//   };

//   // Modern label style with better visibility
//   const horizontalLabelStyle = {
//     fontSize: "11px",
//     fontWeight: "600",
//     opacity: "0.85",
//     display: "flex",
//     alignItems: "center",
//     whiteSpace: "nowrap",
//     minWidth: "70px",
//     textAlign: "end",
//     justifyContent: "flex-end",
//     letterSpacing: "0.3px",
//     color: fontcolor,
//     textTransform: "uppercase",
//     fontSize: "10px",
//     fontWeight: "700",
//     opacity: "0.7",
//   };

//   // Enhanced input style with gradient border effect
//   const horizontalInputStyle = {
//     height: "22px",
//     padding: "0 10px",
//     borderWidth: "1.5px",
//     borderRadius: "6px",
//     fontSize: "11px",
//     transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
//     outline: "none",
//     fontFamily: "inherit",
//     flex: 1,
//     minWidth: "0",
//     background: "transparent",
//     borderColor: `${fontcolor}30`,
//     color: fontcolor,
//     fontWeight: "500",
//     letterSpacing: "0.2px",
//   };

//   const buttonStyle = {
//     padding: "4px 18px",
//     borderRadius: "6px",
//     fontSize: "11px",
//     fontWeight: "600",
//     cursor: "pointer",
//     transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
//     display: "flex",
//     alignItems: "center",
//     gap: "6px",
//     textTransform: "uppercase",
//     letterSpacing: "0.5px",
//     border: "none",
//   };

//   // Modern card wrapper with glass effect
//   const cardStyle = {
//     backgroundColor: getcolor,
//     color: fontcolor,
//     border: `1px solid ${fontcolor}15`,
//     borderRadius: "16px",
//     boxShadow: `
//       0 20px 60px rgba(0,0,0,0.12),
//       0 8px 30px rgba(0,0,0,0.06),
//       inset 0 1px 0 rgba(255,255,255,0.1)
//     `,
//     overflow: "hidden",
//     backdropFilter: "blur(10px)",
//     width: "100%",
//     maxWidth: "650px",
//   };

//   return (
//     <>
//       <div style={contentStyle}>
//         <div style={cardStyle}>
//           {/* Store Maintenance Header - Premium Design */}
//           <div
//             style={{
//               display: "flex",
//               alignItems: "center",
//               justifyContent: "space-between",
//               padding: "8px 24px",
//               background: `linear-gradient(135deg, #3368B5 0%, #28528C 100%)`,
//               position: "relative",
//               overflow: "hidden",
//               minHeight: "44px",
//             }}
//           >
//             {/* Decorative Background Elements */}
//             <div
//               style={{
//                 position: "absolute",
//                 top: "-80%",
//                 right: "-5%",
//                 width: "250px",
//                 height: "250px",
//                 borderRadius: "50%",
//                 background: "rgba(255,255,255,0.06)",
//                 pointerEvents: "none",
//               }}
//             />
//             <div
//               style={{
//                 position: "absolute",
//                 bottom: "-60%",
//                 left: "-3%",
//                 width: "180px",
//                 height: "180px",
//                 borderRadius: "50%",
//                 background: "rgba(255,255,255,0.04)",
//                 pointerEvents: "none",
//               }}
//             />

//             {/* Left Section - Icon & Title */}
//             <div
//               style={{
//                 display: "flex",
//                 alignItems: "center",
//                 gap: "12px",
//                 zIndex: 1,
//               }}
//             >
//               <div
//                 style={{
//                   fontSize: "14px",
//                   background: "rgba(255,255,255,0.15)",
//                   padding: "4px",
//                   borderRadius: "50%",
//                   width: "32px",
//                   height: "32px",
//                   display: "flex",
//                   alignItems: "center",
//                   justifyContent: "center",
//                   border: "1.5px solid rgba(255,255,255,0.2)",
//                   backdropFilter: "blur(10px)",
//                   flexShrink: 0,
//                 }}
//               >
//                 🏪
//               </div>
//               <h2
//                 style={{
//                   margin: "0",
//                   fontSize: "14px",
//                   fontWeight: "700",
//                   color: "#ffffff",
//                   letterSpacing: "0.8px",
//                   textShadow: "0 1px 4px rgba(0,0,0,0.15)",
//                 }}
//               >
//                 Store Maintenance
//               </h2>
//             </div>

//             {/* Right Section - Status Badge */}
//             <div
//               style={{
//                 display: "flex",
//                 alignItems: "center",
//                 gap: "8px",
//                 zIndex: 1,
//               }}
//             >
//               <div
//                 style={{
//                   width: "6px",
//                   height: "6px",
//                   borderRadius: "50%",
//                   background: "#4ade80",
//                   boxShadow: "0 0 12px rgba(74, 222, 128, 0.6)",
//                   animation: "pulse 2s infinite",
//                 }}
//               />
//               <span
//                 style={{
//                   fontSize: "10px",
//                   color: "rgba(255,255,255,0.8)",
//                   fontWeight: "500",
//                   letterSpacing: "0.5px",
//                 }}
//               >
//                 ACTIVE
//               </span>
//             </div>
//           </div>

//           {/* Form Section with Enhanced Design */}
//           <div
//             style={{
//               padding: "18px 24px 16px 24px",
//             }}
//           >
//             {/* Row 1: Code + Status */}
//             <div
//               style={{
//                 display: "grid",
//                 gridTemplateColumns: "1fr 1fr",
//                 gap: "6px 20px",
//                 marginBottom: "6px",
//               }}
//             >
//               <div style={horizontalFieldWrapperStyle}>
//                 <label style={horizontalLabelStyle}>Code</label>
//                 <input
//                   type="number"
//                   placeholder="Enter store code"
//                   style={{
//                     ...horizontalInputStyle,
//                     background: `${fontcolor}05`,
//                   }}
//                   onFocus={(e) => {
//                     e.target.style.borderColor = "#3368B5";
//                     e.target.style.boxShadow = "0 0 0 3px rgba(51, 104, 181, 0.15)";
//                     e.target.style.background = `${fontcolor}08`;
//                   }}
//                   onBlur={(e) => {
//                     e.target.style.borderColor = `${fontcolor}30`;
//                     e.target.style.boxShadow = "none";
//                     e.target.style.background = `${fontcolor}05`;
//                   }}
//                 />
//               </div>

//               <div style={horizontalFieldWrapperStyle}>
//                 <label style={horizontalLabelStyle}>Status</label>
//                 <select
//                   style={{
//                     ...horizontalInputStyle,
//                     background: `${fontcolor}05`,
//                     cursor: "pointer",
//                     appearance: "none",
//                     backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='10' height='6'%3E%3Cpath d='M0 0l5 6 5-6z' fill='${fontcolor.replace('#', '%23')}40'/%3E%3C/svg%3E")`,
//                     backgroundRepeat: "no-repeat",
//                     backgroundPosition: "right 10px center",
//                     paddingRight: "28px",
//                   }}
//                   onFocus={(e) => {
//                     e.target.style.borderColor = "#3368B5";
//                     e.target.style.boxShadow = "0 0 0 3px rgba(51, 104, 181, 0.15)";
//                     e.target.style.background = `${fontcolor}08`;
//                   }}
//                   onBlur={(e) => {
//                     e.target.style.borderColor = `${fontcolor}30`;
//                     e.target.style.boxShadow = "none";
//                     e.target.style.background = `${fontcolor}05`;
//                   }}
//                 >
//                   <option value="">Select Status</option>
//                   <option value="active">Active</option>
//                   <option value="inactive">Inactive</option>
//                   <option value="pending">Pending</option>
//                   <option value="closed">Closed</option>
//                 </select>
//               </div>
//             </div>

//             {/* Row 2: Description */}
//             <div
//               style={{
//                 display: "grid",
//                 gridTemplateColumns: "1fr",
//                 gap: "6px 20px",
//                 marginBottom: "6px",
//               }}
//             >
//               <div style={horizontalFieldWrapperStyle}>
//                 <label style={horizontalLabelStyle}>Description</label>
//                 <input
//                   type="text"
//                   placeholder="Enter store description"
//                   style={{
//                     ...horizontalInputStyle,
//                     background: `${fontcolor}05`,
//                   }}
//                   onFocus={(e) => {
//                     e.target.style.borderColor = "#3368B5";
//                     e.target.style.boxShadow = "0 0 0 3px rgba(51, 104, 181, 0.15)";
//                     e.target.style.background = `${fontcolor}08`;
//                   }}
//                   onBlur={(e) => {
//                     e.target.style.borderColor = `${fontcolor}30`;
//                     e.target.style.boxShadow = "none";
//                     e.target.style.background = `${fontcolor}05`;
//                   }}
//                 />
//               </div>
//             </div>

//             {/* Row 3: Store Abb + Stock */}
//             <div
//               style={{
//                 display: "grid",
//                 gridTemplateColumns: "1fr 1fr",
//                 gap: "6px 20px",
//                 marginBottom: "6px",
//               }}
//             >
//               <div style={horizontalFieldWrapperStyle}>
//                 <label style={horizontalLabelStyle}>Store Abb</label>
//                 <input
//                   type="text"
//                   placeholder="Abbreviation"
//                   style={{
//                     ...horizontalInputStyle,
//                     background: `${fontcolor}05`,
//                   }}
//                   onFocus={(e) => {
//                     e.target.style.borderColor = "#3368B5";
//                     e.target.style.boxShadow = "0 0 0 3px rgba(51, 104, 181, 0.15)";
//                     e.target.style.background = `${fontcolor}08`;
//                   }}
//                   onBlur={(e) => {
//                     e.target.style.borderColor = `${fontcolor}30`;
//                     e.target.style.boxShadow = "none";
//                     e.target.style.background = `${fontcolor}05`;
//                   }}
//                 />
//               </div>

//               <div style={horizontalFieldWrapperStyle}>
//                 <label style={horizontalLabelStyle}>Stock</label>
//                 <select
//                   style={{
//                     ...horizontalInputStyle,
//                     background: `${fontcolor}05`,
//                     cursor: "pointer",
//                     appearance: "none",
//                     backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='10' height='6'%3E%3Cpath d='M0 0l5 6 5-6z' fill='${fontcolor.replace('#', '%23')}40'/%3E%3C/svg%3E")`,
//                     backgroundRepeat: "no-repeat",
//                     backgroundPosition: "right 10px center",
//                     paddingRight: "28px",
//                   }}
//                   onFocus={(e) => {
//                     e.target.style.borderColor = "#3368B5";
//                     e.target.style.boxShadow = "0 0 0 3px rgba(51, 104, 181, 0.15)";
//                     e.target.style.background = `${fontcolor}08`;
//                   }}
//                   onBlur={(e) => {
//                     e.target.style.borderColor = `${fontcolor}30`;
//                     e.target.style.boxShadow = "none";
//                     e.target.style.background = `${fontcolor}05`;
//                   }}
//                 >
//                   <option value="">Select Stock</option>
//                   <option value="in-stock">In Stock</option>
//                   <option value="out-of-stock">Out of Stock</option>
//                   <option value="low-stock">Low Stock</option>
//                   <option value="pre-order">Pre-Order</option>
//                 </select>
//               </div>
//             </div>

//             {/* Action Buttons - Premium Design */}
//             <div
//               style={{
//                 display: "flex",
//                 gap: "10px",
//                 marginTop: "12px",
//                 justifyContent: "center",
//                 borderTop: `1px solid ${fontcolor}10`,
//                 paddingTop: "14px",
//               }}
//             >
//               <button
//                 style={{
//                   ...buttonStyle,
//                   background: `linear-gradient(135deg, #3368B5, #28528C)`,
//                   color: "#fff",
//                   boxShadow: "0 4px 12px rgba(51, 104, 181, 0.3)",
//                 }}
//                 onMouseEnter={(e) => {
//                   e.target.style.transform = "translateY(-2px)";
//                   e.target.style.boxShadow = "0 8px 24px rgba(51, 104, 181, 0.4)";
//                 }}
//                 onMouseLeave={(e) => {
//                   e.target.style.transform = "translateY(0)";
//                   e.target.style.boxShadow = "0 4px 12px rgba(51, 104, 181, 0.3)";
//                 }}
//               >
//                 💾 Save
//               </button>
//               <button
//                 style={{
//                   ...buttonStyle,
//                   background: `transparent`,
//                   color: fontcolor,
//                   border: `1.5px solid ${fontcolor}20`,
//                 }}
//                 onMouseEnter={(e) => {
//                   e.target.style.background = `${fontcolor}08`;
//                   e.target.style.transform = "translateY(-2px)";
//                   e.target.style.borderColor = fontcolor;
//                 }}
//                 onMouseLeave={(e) => {
//                   e.target.style.background = "transparent";
//                   e.target.style.transform = "translateY(0)";
//                   e.target.style.borderColor = `${fontcolor}20`;
//                 }}
//               >
//                 🗑️ Return
//               </button>
//               <button
//                 style={{
//                   ...buttonStyle,
//                   background: `transparent`,
//                   color: fontcolor,
//                   border: `1.5px solid ${fontcolor}20`,
//                 }}
//                 onMouseEnter={(e) => {
//                   e.target.style.background = `${fontcolor}08`;
//                   e.target.style.transform = "translateY(-2px)";
//                   e.target.style.borderColor = fontcolor;
//                 }}
//                 onMouseLeave={(e) => {
//                   e.target.style.background = "transparent";
//                   e.target.style.transform = "translateY(0)";
//                   e.target.style.borderColor = `${fontcolor}20`;
//                 }}
//               >
//                 ✏️ New
//               </button>
//             </div>
//           </div>
//         </div>
//       </div>

//       {/* Add this CSS for pulse animation */}
//       <style>{`
//         @keyframes pulse {
//           0%, 100% { opacity: 1; transform: scale(1); }
//           50% { opacity: 0.5; transform: scale(0.8); }
//         }
//       `}</style>
//     </>
//   );
// }



export default function StoreMaintinanace() {
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
    getnavbarbackgroundcolor,
  } = useTheme();

  // Set CSS variables for dynamic theming
  const cardStyle = {
    backgroundColor: getcolor,
    color: fontcolor,
    '--card-bg': getcolor,
    '--font-color': fontcolor,
    '--border-color': `${fontcolor}30`,
    '--input-bg': `${fontcolor}05`,
    '--input-focus-bg': `${fontcolor}08`,
    '--hover-bg': `${fontcolor}08`,
  };

  // Dynamic left position based on sidebar
  const contentPosition = {
    left: isSidebarVisible ? "60vw" : "50vw",
  };

  return (
    <>
      <div 
        className="store-maintenance-content" 
        style={contentPosition}
      >
        <div 
          className="store-maintenance-card" 
          style={cardStyle}
        >
          {/* Store Maintenance Header */}
          <div className="store-header">
            <div className="store-header-bg-1" />
            <div className="store-header-bg-2" />

            {/* Left Section */}
            <div className="store-header-left">
              <div className="store-icon-wrapper">🏪</div>
              <h2 className="store-title">Store Maintenance</h2>
            </div>

            {/* Right Section */}
            <div className="store-header-right">
              <div className="status-dot" />
              <span className="status-text">ACTIVE</span>
            </div>
          </div>

          {/* Form Section */}
          <div className="store-form-section">
            {/* Row 1: Code + Status (2 columns) */}
            <div className="store-row">
              <div className="store-field-wrapper">
                <label className="store-label">Code</label>
                <input
                  type="number"
                  placeholder="code"
                  className="store-input store-input-code"
                />
              </div>

              <div className="store-field-wrapper">
                <label className="store-label">Status</label>
                <select
                  className="store-select store-select-status"
                  style={{
                    backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='10' height='6'%3E%3Cpath d='M0 0l5 6 5-6z' fill='${fontcolor.replace('#', '%23')}40'/%3E%3C/svg%3E")`,
                  }}
                >
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                  <option value="pending">Pending</option>
                  <option value="closed">Closed</option>
                </select>
              </div>
            </div>

            {/* Row 2: Description (1 column - full width) */}
            <div className="store-row">
              <div className="store-field-wrapper" style={{ flex: 1 }}>
                <label className="store-label">Description</label>
                <input
                  type="text"
                  placeholder="Description"
                  className="store-input store-input-description"
                />
              </div>
            </div>

            {/* Row 3: Store Abb + Stock (2 columns) */}
            <div className="store-row">
              <div className="store-field-wrapper">
                <label className="store-label">Store Abb</label>
                <input
                  type="text"
                  placeholder="Abbreviation"
                  className="store-input store-input-abb"
                />
              </div>

              <div className="store-field-wrapper">
                <label className="store-label">Stock</label>
                <select
                  className="store-select store-select-stock"
                  style={{
                    backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='10' height='6'%3E%3Cpath d='M0 0l5 6 5-6z' fill='${fontcolor.replace('#', '%23')}40'/%3E%3C/svg%3E")`,
                  }}
                >
                  <option value="in-stock">In Stock</option>
                  <option value="out-of-stock">Out of Stock</option>
                  <option value="low-stock">Low Stock</option>
                  <option value="pre-order">Pre-Order</option>
                </select>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="store-actions">
              <button className="store-btn store-btn-primary">
                💾 Save
              </button>
              <button className="store-btn store-btn-secondary">
                🗑️ Return
              </button>
              <button className="store-btn store-btn-secondary">
                ✏️ New
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
