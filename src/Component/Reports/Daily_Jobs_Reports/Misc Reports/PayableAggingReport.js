import React, { useState, useEffect, useRef } from "react";
import { Container, Spinner, Nav } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";

import axios from "axios";
import { useTheme } from "../../../../ThemeContext";
import {
  getUserData,
  getOrganisationData,
  getLocationnumber,
  getYearDescription,
} from "../../../Auth";
import NavComponent from "../../../MainComponent/Navform/navbarform";
import SingleButton from "../../../MainComponent/Button/SingleButton/SingleButton";
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
import { fetchGetUser } from "../../../Redux/action";
import "./misc.css";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function PayableAggingReport() {
  const navigate = useNavigate();
  const user = getUserData();
  const organisation = getOrganisationData();
  const yeardescription = getYearDescription();
  const locationnumber = getLocationnumber();
  const saleSelectRef = useRef(null);
  const input1Ref = useRef(null);

  const toRef = useRef(null);
  const fromRef = useRef(null);
  const companyRef = useRef(null);
  const categoryRef = useRef(null);
  const capacityRef = useRef(null);
  const storeRef = useRef(null);
  const typeRef = useRef(null);
  const searchRef = useRef(null);
  const selectButtonRef = useRef(null);

  const [saleType, setSaleType] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [transectionType, settransectionType] = useState("");

  const [totalAmt1, setTotalAmt1] = useState(0);
  const [totalAmt2, setTotalAmt2] = useState(0);
  const [totalAmt3, setTotalAmt3] = useState(0);
  const [totalAmt4, setTotalAmt4] = useState(0);
  const [totalAmt5, setTotalAmt5] = useState(0);
  const [totalAmt6, setTotalAmt6] = useState(0);
  const [total, setTotal] = useState(0);
  const [totalAmount, setTotalAmount] = useState(0);

  // state for from DatePicker
  const [selectedfromDate, setSelectedfromDate] = useState(null);
  const [fromInputDate, setfromInputDate] = useState("");
  const [fromCalendarOpen, setfromCalendarOpen] = useState(false);
  // state for To DatePicker
  const [selectedToDate, setSelectedToDate] = useState(null);
  const [toInputDate, settoInputDate] = useState("");
  const [toCalendarOpen, settoCalendarOpen] = useState(false);

  const [selectedRadio, setSelectedRadio] = useState("custom"); // State to track selected radio button

  const {
    isSidebarVisible,
    toggleSidebar,
    getcolor,
    fontcolor,
    toggleChangeColor,getnavbarbackgroundcolor,
    apiLinks,
    getLocationNumber,
    getyeardescription,
    getfromdate,
    gettodate,
    getdatafontsize,
    getfontstyle,
  } = useTheme();

  useEffect(() => {
    document.documentElement.style.setProperty("--background-color", getcolor);
  }, [getcolor]);

  const comapnyname = organisation.description;

  //////////////////////// CUSTOM DATE LIMITS ////////////////////////////
  const fromdatevalidate = getfromdate;
  const todatevaliadete = gettodate;

  const convertToDate = (dateString) => {
    const [day, month, year] = dateString.split("-");
    return new Date(year, month - 1, day);
  };

  const GlobalfromDate = convertToDate(fromdatevalidate);
  const GlobaltoDate = convertToDate(todatevaliadete);

  const formatDate1 = (date) => {
    return `${String(date.getDate()).padStart(2, "0")}-${String(
      date.getMonth() + 1
    ).padStart(2, "0")}-${date.getFullYear()}`;
  };
  const GlobaltoDate1 = formatDate1(GlobaltoDate);
  const GlobalfromDate1 = formatDate1(GlobalfromDate);

  //////////////////////// CUSTOM DATE LIMITS ////////////////////////////

  // Toggle the ToDATE CalendarOpen state on each click
  const toggleToCalendar = () => {
    settoCalendarOpen((prevOpen) => !prevOpen);
  };
  const formatDate = (date) => {
    const day = date.getDate().toString().padStart(2, "0");
    const month = (date.getMonth() + 1).toString().padStart(2, "0");
    const year = date.getFullYear();
    return `${day}-${month}-${year}`;
  };

  const handleToDateChange = (date) => {
    setSelectedToDate(date);
    settoInputDate(date ? formatDate(date) : "");
    settoCalendarOpen(false);
  };
  const handleToInputChange = (e) => {
    settoInputDate(e.target.value);
  };

  function fetchReceivableAging() {
    const dateRegex = /^\d{2}-\d{2}-\d{4}$/;

    let errorType = "";

    switch (true) {
      case !toInputDate:
        errorType = "toDate";
        break;
      default:
        break;
    }

    if (!dateRegex.test(toInputDate)) {
      errorType = "toDateInvalid";
    } else {
      const formattedToInput = toInputDate.replace(
        /^(\d{2})(\d{2})(\d{4})$/,
        "$1-$2-$3"
      );
      const [toDay, toMonth, toYear] = formattedToInput.split("-").map(Number);
      const enteredToDate = new Date(toYear, toMonth - 1, toDay);

      if (GlobaltoDate && enteredToDate > GlobaltoDate) {
        errorType = "toDateAfterGlobal";
      } else if (GlobaltoDate && enteredToDate < GlobalfromDate) {
        errorType = "toDateBeforeGlobal";
      }
    }

    switch (errorType) {
      case "toDate":
        toast.error("Rep Date is required");
        return;

      case "toDateInvalid":
        toast.error("Rep Date must be in the format dd-mm-yyyy");
        return;

      case "toDateAfterGlobal":
        toast.error(`Rep Date must be before ${GlobaltoDate1}`);
        return;
      case "toDateBeforeGlobal":
        toast.error(`Rep Date must be after ${GlobalfromDate1}`);
        return;

      default:
        break;
    }

    const fromDateElement = document.getElementById("fromdatevalidation");
    const toDateElement = document.getElementById("todatevalidation");

    if (fromDateElement) {
      fromDateElement.style.border = `1px solid ${fontcolor}`;
    }
    if (toDateElement) {
      toDateElement.style.border = `1px solid ${fontcolor}`;
    }

    const apiMainUrl = apiLinks + "/PayableAging.php";
    setIsLoading(true);
    const formMainData = new URLSearchParams({
    
    //    code: 'NASIRTRD',
    //   FLocCod: '001',
    //   FYerDsc: '2024-2024',

      code: organisation.code,
      FLocCod: locationnumber || getLocationNumber,
      FYerDsc: yeardescription || getyeardescription,
      FRepDat: toInputDate,
      FSchTxt: searchQuery,

    }).toString();

    axios
      .post(apiMainUrl, formMainData)
      .then((response) => {
        setIsLoading(false);
        // console.log("Response:", response.data);

        setTotalAmt1(response.data["amt001"]);
        setTotalAmt2(response.data["amt002"]);
        setTotalAmt3(response.data["amt003"]);
        setTotalAmt4(response.data["amt004"]);
        setTotalAmt5(response.data["amt005"]);
        setTotalAmt6(response.data["amt006"]);
        setTotal(response.data["total"]);

        if (response.data && Array.isArray(response.data.Detail)) {
          setTableData(response.data.Detail);
        } else {
          console.warn(
            "Response data structure is not as expected:",
            response.data
          );
          setTableData([]);
        }
      })
      .catch((error) => {
        console.error("Error:", error);
        setIsLoading(false);
      });
  }

  useEffect(() => {
    const hasComponentMountedPreviously =
      sessionStorage.getItem("componentMounted");
    if (!hasComponentMountedPreviously || (toRef && toRef.current)) {
      if (toRef && toRef.current) {
        setTimeout(() => {
          toRef.current.focus();
          toRef.current.select();
        }, 0);
      }
      sessionStorage.setItem("componentMounted", "true");
    }
  }, []);

  useEffect(() => {
    const currentDate = new Date();
    setSelectedToDate(currentDate);
    settoInputDate(formatDate(currentDate));

    const firstDateOfCurrentMonth = new Date(
      currentDate.getFullYear(),
      currentDate.getMonth(),
      1
    );
    setSelectedfromDate(firstDateOfCurrentMonth);
    setfromInputDate(formatDate(firstDateOfCurrentMonth));
  }, []);

  const exportPDFHandler = () => {
       const globalfontsize = 12;
       console.log("gobal font data", globalfontsize);
   
       // Create a new jsPDF instance with landscape orientation
       const doc = new jsPDF({ orientation: "landscape" });
   
       // Define table data (rows)
       const rows = tableData.map((item) => [
       item.Code,
      item.Customer,
      item["Amt001"],
      item["Amt002"],
      item["Amt003"],
      item["Amt004"],
      item["Amt005"],
      item["Amt006"],
      item["Total"],
       ]);
   
       // Add summary row to the table
       rows.push([
        "",
      "Total",
      String(totalAmt1),
      String(totalAmt2),
      String(totalAmt3),
      String(totalAmt4),
      String(totalAmt5),
      String(totalAmt6),
      String(total),
    ]);
   
       // Define table column headers and individual column widths
       const headers = [
 "Code",
      "Description",
      "0 - 30",
      "31 - 60",
      "61 - 90",
      "91 - 120",
      "121 - 150",
      "150+",
      "Balance",
     ];
       const columnWidths = [25, 100, 25, 25, 25, 25, 25, 25, 25];
   
       // Calculate total table width
       const totalWidth = columnWidths.reduce((acc, width) => acc + width, 0);
   
       // Define page height and padding
       const pageHeight = doc.internal.pageSize.height;
       const paddingTop = 15;
   
       // Set font properties for the table
       doc.setFont(getfontstyle);
       doc.setFontSize(10);
   
       // Function to add table headers
       const addTableHeaders = (startX, startY) => {
         // Set font style and size for headers
         doc.setFont(getfontstyle, "bold"); // Set font to bold
         doc.setFontSize(12); // Set font size for headers
   
         headers.forEach((header, index) => {
           const cellWidth = columnWidths[index];
           const cellHeight = 6; // Height of the header row
           const cellX = startX + cellWidth / 2; // Center the text horizontally
           const cellY = startY + cellHeight / 2 + 1.5; // Center the text vertically
   
           // Draw the grey background for the header
           doc.setFillColor(200, 200, 200); // Grey color
           doc.rect(startX, startY, cellWidth, cellHeight, "F"); // Fill the rectangle
   
           // Draw the outer border
           doc.setLineWidth(0.2); // Set the width of the outer border
           doc.rect(startX, startY, cellWidth, cellHeight);
   
           // Set text alignment to center
           doc.setTextColor(0); // Set text color to black
           doc.text(header, cellX, cellY, { align: "center" }); // Center the text
           startX += columnWidths[index]; // Move to the next column
         });
   
         // Reset font style and size after adding headers
         doc.setFont(getfontstyle);
         doc.setFontSize(12);
       };
   
       const addTableRows = (startX, startY, startIndex, endIndex) => {
             const rowHeight = 5;
             const fontSize = 10;
             const boldFont = 400;
             const normalFont = getfontstyle;
             const tableWidth = getTotalTableWidth();
 
             doc.setFontSize(11);
 
             for (let i = startIndex; i < endIndex; i++) {
                 const row = rows[i];
                 const isOddRow = i % 2 !== 0; // Check if the row index is odd
                 const isRedRow = row[0] && parseInt(row[0]) > 10000000000;
                 const isTotalRow = i === rows.length - 1;
                 let textColor = [0, 0, 0];
                 let fontName = normalFont;
 
                 if (isRedRow) {
                     textColor = [255, 0, 0];
                     fontName = boldFont;
                 }
 
                 if (isTotalRow) {
                     doc.setFont(getfontstyle, 'bold');
                 }
 
                 // Set background color for odd-numbered rows
                 if (isOddRow) {
                     doc.setFillColor(240); // Light background color
                     doc.rect(
                         startX,
                         startY + (i - startIndex + 2) * rowHeight,
                         tableWidth,
                         rowHeight,
                         "F"
                     );
                 }
 
                 doc.setDrawColor(0);
 
                 // For total row - special border handling
                 if (isTotalRow) {
                     const rowTopY = startY + (i - startIndex + 2) * rowHeight;
                     const rowBottomY = rowTopY + rowHeight;
 
                     // Draw double top border
                     doc.setLineWidth(0.3);
                     doc.line(startX, rowTopY, startX + tableWidth, rowTopY);
                     doc.line(startX, rowTopY + 0.5, startX + tableWidth, rowTopY + 0.5);
 
                     // Draw double bottom border
                     doc.line(startX, rowBottomY, startX + tableWidth, rowBottomY);
                     doc.line(startX, rowBottomY - 0.5, startX + tableWidth, rowBottomY - 0.5);
 
                     // Draw single vertical borders
                     doc.setLineWidth(0.2);
                     doc.line(startX, rowTopY, startX, rowBottomY); // Left border
                     doc.line(startX + tableWidth, rowTopY, startX + tableWidth, rowBottomY); // Right border
                 } else {
                     // Normal border for other rows
                     doc.setLineWidth(0.2);
                     doc.rect(
                         startX,
                         startY + (i - startIndex + 2) * rowHeight,
                         tableWidth,
                         rowHeight
                     );
                 }
 
                 row.forEach((cell, cellIndex) => {
                     const cellY = isTotalRow
                         ? startY + (i - startIndex + 2) * rowHeight + rowHeight / 2
                         : startY + (i - startIndex + 2) * rowHeight + 3;
 
                     const cellX = startX + 2;
 
                     doc.setTextColor(textColor[0], textColor[1], textColor[2]);
 
                     if (!isTotalRow) {
                         doc.setFont(fontName, "normal");
                     }
 
                     const cellValue = String(cell);
 
                     if (cellIndex === 12) {
                         const rightAlignX = startX + columnWidths[cellIndex] / 2; // Adjust for right alignment
                         doc.text(cellValue, rightAlignX, cellY, {
                             align: "center",
                             baseline: "middle",
                         });
                     }
 
                     else if (cellIndex === 2 || cellIndex === 3 || cellIndex === 4 || cellIndex === 5
                        || cellIndex === 6 || cellIndex === 7 || cellIndex === 8
                     ) {
                         const rightAlignX = startX + columnWidths[cellIndex] - 2; // Adjust for right alignment
                         doc.text(cellValue, rightAlignX, cellY, {
                             align: "right",
                             baseline: "middle", // This centers vertically
                         });
                     } else {
                         // For empty cells in total row, add "Total" label centered
                         if (isTotalRow && cellIndex === 0 && cell === "") {
                             const totalLabelX = startX + columnWidths[0] / 2;
                             doc.text("", totalLabelX, cellY, {
                                 align: "center",
                                 baseline: "middle"
                             });
                         } else {
                             doc.text(cellValue, cellX, cellY, {
                                 baseline: "middle" // This centers vertically
                             });
                         }
 
                     }
 
                     // Draw column borders
                     if (cellIndex < row.length - 1) {
                         doc.setLineWidth(0.2);
                         doc.line(
                             startX + columnWidths[cellIndex],
                             startY + (i - startIndex + 2) * rowHeight,
                             startX + columnWidths[cellIndex],
                             startY + (i - startIndex + 3) * rowHeight
                         );
                         startX += columnWidths[cellIndex];
                     }
                 });
 
                 startX = (doc.internal.pageSize.width - tableWidth) / 2;
 
                 if (isTotalRow) {
                     doc.setFont(getfontstyle, "normal");
                 }
             }
 
             // Footer section
             const lineWidth = tableWidth;
             const lineX = (doc.internal.pageSize.width - tableWidth) / 2;
             const lineY = pageHeight - 15;
             doc.setLineWidth(0.3);
             doc.line(lineX, lineY, lineX + lineWidth, lineY);
             const headingFontSize = 11;
             const headingX = lineX + 2;
             const headingY = lineY + 5;
             doc.setFontSize(headingFontSize);
             doc.setTextColor(0);
             doc.text(`Crystal Solution \t ${date} \t ${time}`, headingX, headingY);
         };
   
       // Function to calculate total table width
       const getTotalTableWidth = () => {
         let totalWidth = 0;
         columnWidths.forEach((width) => (totalWidth += width));
         return totalWidth;
       };
   
       // Function to add a new page and reset startY
       const addNewPage = (startY) => {
         doc.addPage();
         return paddingTop; // Set startY for each new page
       };
   
       // Define the number of rows per page
       const rowsPerPage = 31; // Adjust this value based on your requirements
   
       // Function to handle pagination
       const handlePagination = () => {
         // Define the addTitle function
         const addTitle = (
           title,
           date,
           time,
           pageNumber,
           startY,
           titleFontSize = 18,
           pageNumberFontSize = 10
         ) => {
           doc.setFontSize(titleFontSize); // Set the font size for the title
           doc.text(title, doc.internal.pageSize.width / 2, startY, {
             align: "center",
           });
   
           // Calculate the x-coordinate for the right corner
           const rightX = doc.internal.pageSize.width - 10;
   
           // if (date) {
           //     doc.setFontSize(dateTimeFontSize); // Set the font size for the date and time
           //     if (time) {
           //         doc.text(date + " " + time, rightX, startY, { align: "right" });
           //     } else {
           //         doc.text(date, rightX - 10, startY, { align: "right" });
           //     }
           // }
   
           // Add page numbering
           doc.setFontSize(pageNumberFontSize);
           doc.text(
             `Page ${pageNumber}`,
             rightX - 10,
             doc.internal.pageSize.height - 10,
             { align: "right" }
           );
         };
   
         let currentPageIndex = 0;
         let startY = paddingTop; // Initialize startY
         let pageNumber = 1; // Initialize page number
   
         while (currentPageIndex * rowsPerPage < rows.length) {
           addTitle(comapnyname, 12, 12, pageNumber, startY, 18); // Render company title with default font size, only date, and page number
           startY += 5; // Adjust vertical position for the company title
   
           addTitle(`Payable Agging Report From ${toInputDate}`, "", "", pageNumber, startY, 12); // Render sale report title with decreased font size, provide the time, and page number
           startY += -5;
   
           const labelsX = (doc.internal.pageSize.width - totalWidth) / 2;
           const labelsY = startY + 4; // Position the labels below the titles and above the table
   
           // Set font size and weight for the labels
           doc.setFontSize(12);
           doc.setFont(getfontstyle, "300");
   
           let status =
             transectionType === "R"
               ? "RECEIVABLE"
               : transectionType === "P"
                 ? "PAYABLE"
                 : "ALL";
           let search = searchQuery ? searchQuery : "";
   
           // Set font style, size, and family
           doc.setFont(getfontstyle, "300"); // Font family and style ('normal', 'bold', 'italic', etc.)
           doc.setFontSize(10); // Font size
   
           doc.setFont(getfontstyle, "bold"); // Set font to bold
           doc.text(`TYPE :`, labelsX, labelsY + 8.5); // Draw bold label
           doc.setFont(getfontstyle, "normal"); // Reset font to normal
           doc.text(`${status}`, labelsX + 20, labelsY + 8.5); // Draw the value next to the label
   
           if (searchQuery) {
             doc.setFont(getfontstyle, "bold"); // Set font to bold
             doc.text(`SEARCH :`, labelsX + 70, labelsY + 8.5); // Draw bold label
             doc.setFont(getfontstyle, "normal"); // Reset font to normal
             doc.text(`${search}`, labelsX + 90, labelsY + 8.5); // Draw the value next to the label
           }
   
           // // Reset font weight to normal if necessary for subsequent text
           doc.setFont(getfontstyle, "bold"); // Set font to bold
           doc.setFontSize(10);
   
           startY += 10; // Adjust vertical position for the labels
   
           addTableHeaders((doc.internal.pageSize.width - totalWidth) / 2, 29);
           const startIndex = currentPageIndex * rowsPerPage;
           const endIndex = Math.min(startIndex + rowsPerPage, rows.length);
           startY = addTableRows(
             (doc.internal.pageSize.width - totalWidth) / 2,
             startY,
             startIndex,
             endIndex
           );
           if (endIndex < rows.length) {
             startY = addNewPage(startY); // Add new page and update startY
             pageNumber++; // Increment page number
           }
           currentPageIndex++;
         }
       };
   
       const getCurrentDate = () => {
         const today = new Date();
         const dd = String(today.getDate()).padStart(2, "0");
         const mm = String(today.getMonth() + 1).padStart(2, "0"); // January is 0!
         const yyyy = today.getFullYear();
         return dd + "/" + mm + "/" + yyyy;
       };
   
       // Function to get current time in the format HH:MM:SS
       const getCurrentTime = () => {
         const today = new Date();
         const hh = String(today.getHours()).padStart(2, "0");
         const mm = String(today.getMinutes()).padStart(2, "0");
         const ss = String(today.getSeconds()).padStart(2, "0");
         return hh + ":" + mm + ":" + ss;
       };
   
       const date = getCurrentDate(); // Get current date
       const time = getCurrentTime(); // Get current time
   
       // Call function to handle pagination
       handlePagination();
   
       // Save the PDF files
       doc.save(`PayableAggingReport As On ${date}.pdf`);
     };

  const handleDownloadCSV = async () => {
           const workbook = new ExcelJS.Workbook();
           const worksheet = workbook.addWorksheet("Sheet1");
   
           const numColumns = 9; // Ensure this matches the actual number of columns
   
           const columnAlignments = [
               "left",
               "left",
              "right",
               "right",
               "right",
               "right",
                "right",
               "right",
               "right",
                
              ];
   
           // Define fonts for different sections
           const fontCompanyName = {
               name: "CustomFont" || "CustomFont",
               size: 18,
               bold: true,
           };
           const fontStoreList = {
               name: "CustomFont" || "CustomFont",
               size: 10,
               bold: false,
           };
           const fontHeader = {
               name: "CustomFont" || "CustomFont",
               size: 10,
               bold: true,
           };
           const fontTableContent = {
               name: "CustomFont" || "CustomFont",
               size: 10,
               bold: false,
           };
   
           // Add an empty row at the start
           worksheet.addRow([]);
   
           // Add company name
           const companyRow = worksheet.addRow([comapnyname]);
           companyRow.eachCell((cell) => {
               cell.font = fontCompanyName;
               cell.alignment = { horizontal: "center" };
           });
   
           worksheet.getRow(companyRow.number).height = 30;
           worksheet.mergeCells(
               `A${companyRow.number}:${String.fromCharCode(65 + numColumns - 1)}${companyRow.number
               }`
           );
   
           // Add Store List row
           const storeListRow = worksheet.addRow([`Payable Agging Report From ${toInputDate}`]);
           storeListRow.eachCell((cell) => {
               cell.font = fontStoreList;
               cell.alignment = { horizontal: "center" };
           });
   
           worksheet.mergeCells(
               `A${storeListRow.number}:${String.fromCharCode(65 + numColumns - 1)}${storeListRow.number
               }`
           );
   
           // Add an empty row after the title section
           worksheet.addRow([]);
   
           let typestatus = "";
   
           if (transectionType === "R") {
               typestatus = "RECEIABLE";
           } else if (transectionType === "P") {
               typestatus = "PAYABLE";
           } 
            else {
               typestatus = "ALL"; // Default value
           }
   
   
           let typesearch = searchQuery || "";
   
           // Apply styling for the status row
          
   
           const typeAndStoreRow3 = worksheet.addRow(
               searchQuery
                   ? ["", "", "", "","", "", "SEARCH :", typesearch]
                   : ["" ]
           );
   
   
           // Merge cells for Accountselect (columns B to D)
          //  worksheet.mergeCells(`B${typeAndStoreRow2.number}:D${typeAndStoreRow2.number}`);
   
           // Apply styling for the status row
         
   
           typeAndStoreRow3.eachCell((cell, colIndex) => {
               cell.font = {
                   name: "CustomFont" || "CustomFont",
                   size: 10,
                   bold: [7].includes(colIndex),
               };
               cell.alignment = { horizontal: "left", vertical: "middle" };
           });
   
           // Header style
           const headerStyle = {
               font: fontHeader,
               alignment: { horizontal: "center", vertical: "middle" },
               fill: {
                   type: "pattern",
                   pattern: "solid",
                   fgColor: { argb: "FFC6D9F7" },
               },
               border: {
                   top: { style: "thin" },
                   left: { style: "thin" },
                   bottom: { style: "thin" },
                   right: { style: "thin" },
               },
           };
   
           // Add headers
           const headers = [
     "Code",
      "Description",
      "0 - 30",
      "31 - 60",
      "61 - 90",
      "91 - 120",
      "121 - 150",
      "150+",
      "Balance",
  
           ];
           const headerRow = worksheet.addRow(headers);
           headerRow.eachCell((cell) => Object.assign(cell, headerStyle));
   
           // Add data rows
           tableData.forEach((item) => {
               const row = worksheet.addRow([
                 item.Code,
      item.Customer,
      item["Amt001"],
      item["Amt002"],
      item["Amt003"],
      item["Amt004"],
      item["Amt005"],
      item["Amt006"],
      item["Total"],
  
               ]);
   
               row.eachCell((cell, colIndex) => {
                   cell.font = fontTableContent;
                   cell.border = {
                       top: { style: "thin" },
                       left: { style: "thin" },
                       bottom: { style: "thin" },
                       right: { style: "thin" },
                   };
                   cell.alignment = {
                       horizontal: columnAlignments[colIndex - 1] || "left",
                       vertical: "middle",
                   };
               });
           });
   
           const totalRow = worksheet.addRow([
            "",
      "Total",
      String(totalAmt1),
      String(totalAmt2),
      String(totalAmt3),
      String(totalAmt4),
      String(totalAmt5),
      String(totalAmt6),
      String(total),
   
           ]);
   
           // total row added
   
           totalRow.eachCell((cell, colNumber) => {
               cell.font = { bold: true };
               cell.border = {
                   top: { style: "double" },
                   left: { style: "thin" },
                   bottom: { style: "double" },
                   right: { style: "thin" },
               };
   
               // Align only the "Total" text to the right
               if (colNumber === 3 || colNumber === 4 || colNumber === 5 || colNumber === 6
                || colNumber === 7 || colNumber === 8 || colNumber === 9
               ) {
                   cell.alignment = { horizontal: "right" };
               }
           });
   
           // Set column widths
           [10, 45, 12, 12, 12, 12, 12,12,12].forEach((width, index) => {
               worksheet.getColumn(index + 1).width = width;
           });
   
           // Add a blank row
           worksheet.addRow([]);
           // Get current date and time
           const getCurrentTime = () => {
               const today = new Date();
               const hh = String(today.getHours()).padStart(2, "0");
               const mm = String(today.getMinutes()).padStart(2, "0");
               const ss = String(today.getSeconds()).padStart(2, "0");
               return `${hh}:${mm}:${ss}`;
           };
           // Get current date
           const getCurrentDate = () => {
               const today = new Date();
               const day = String(today.getDate()).padStart(2, "0");
               const month = String(today.getMonth() + 1).padStart(2, "0");
               const year = today.getFullYear();
               return `${day}-${month}-${year}`;
           };
           const currentTime = getCurrentTime();
           const currentdate = getCurrentDate();
           const userid = user.tusrid;
   
           // Add date and time row
           const dateTimeRow = worksheet.addRow([`DATE:   ${currentdate}  TIME:   ${currentTime}`]);
           dateTimeRow.eachCell((cell) => {
               cell.font = {
                   name: "CustomFont" || "CustomFont",
                   size: 10,
                   // bold: true
                   // italic: true,
               };
               cell.alignment = { horizontal: "left" };
           });
           const dateTimeRow1 = worksheet.addRow([`USER ID:  ${userid}`]);
           dateTimeRow.eachCell((cell) => {
               cell.font = {
                   name: "CustomFont" || "CustomFont",
                   size: 10,
                   // bold: true
                   // italic: true,
               };
               cell.alignment = { horizontal: "left" };
           });
   
           // Merge across all columns
           worksheet.mergeCells(
               `A${dateTimeRow.number}:${String.fromCharCode(65 + numColumns - 1)}${dateTimeRow.number}`
           );
           worksheet.mergeCells(
               `A${dateTimeRow1.number}:${String.fromCharCode(65 + numColumns - 1)}${dateTimeRow1.number}`
           );
   
           // Generate and save the Excel file
           const buffer = await workbook.xlsx.writeBuffer();
           const blob = new Blob([buffer], {
               type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
           });
           saveAs(blob, `PayableAggingReport As on ${currentdate}.xlsx`);
       };

  const dispatch = useDispatch();

  const tableTopColor = "#3368B5";
  const tableHeadColor = "#3368b5";
  const secondaryColor = "white";
  const btnColor = "#3368B5";
  const textColor = "white";

  const [tableData, setTableData] = useState([]);
  const [selectedSearch, setSelectedSearch] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { data, loading, error } = useSelector((state) => state.getuser);

  const handleSearch = (e) => {
    setSelectedSearch(e.target.value);
  };

  const firstColWidth = {
    width: "80px",
  };
  const secondColWidth = {
    width: "350px",
  };
  const thirdColWidth = {
    width: "80px",
  };
  const forthColWidth = {
    width: "80px",
  };
  const fifthColWidth = {
    width: "80px",
  };
  const sixthColWidth = {
    width: "80px",
  };
  const seventhColWidth = {
    width: "80px",
  };
  const eighthColWidth = {
    width: "80px",
  };
  const ninthColWidth = {
    width: "80px",
  };
   const sixthcol = {
    width: "8px",
  };



   const [columns, setColumns] = useState({
        code: [],
          Customer: [],
          Amt001: [],
            Amt002: [],
             Amt003: [],
            Amt004: [],
             Amt005: [],
            Amt006: [],
             Total: [],
      });
      const [columnSortOrders, setColumnSortOrders] = useState({
        code: "",
          Customer: "",
          Amt001: "",
            Amt002: "",
             Amt003: "",
            Amt004: "",
             Amt005: "",
            Amt006: "",
             Total: "",
      });
        // When you receive your initial table data, transform it into column-oriented format
      useEffect(() => {
        if (tableData.length > 0) {
          const newColumns = {
            code: tableData.map((row) => row.code),
            Customer: tableData.map((row) => row.Customer),
            Amt001: tableData.map((row) => row.Amt001),
             Amt002: tableData.map((row) => row.Amt002),
              Amt003: tableData.map((row) => row.Amt003),
               Amt004: tableData.map((row) => row.Amt004),
                Amt005: tableData.map((row) => row.Amt005),
                 Amt006: tableData.map((row) => row.Amt006),
                  Total: tableData.map((row) => row.Total),
            
  
          };
          setColumns(newColumns);
        }
      }, [tableData]);
    
     const handleSorting = (col) => {
      const currentOrder = columnSortOrders[col];
      const newOrder = currentOrder === "ASC" ? "DSC" : "ASC";
    
      const sortedData = [...tableData].sort((a, b) => {
        const aVal = a[col] !== null && a[col] !== undefined ? a[col].toString() : "";
        const bVal = b[col] !== null && b[col] !== undefined ? b[col].toString() : "";
    
        const numA = parseFloat(aVal.replace(/,/g, ""));
        const numB = parseFloat(bVal.replace(/,/g, ""));
    
        if (!isNaN(numA) && !isNaN(numB)) {
          return newOrder === "ASC" ? numA - numB : numB - numA;
        } else {
          return newOrder === "ASC" ? aVal.localeCompare(bVal) : bVal.localeCompare(aVal);
        }
      });
    
      setTableData(sortedData);
    
      setColumnSortOrders((prev) => ({
        ...Object.keys(prev).reduce((acc, key) => {
          acc[key] = key === col ? newOrder : null;
          return acc;
        }, {}),
      }));
    };
     
      const resetSorting = () => {
        setColumnSortOrders({
          code: null,
          Customer: null,
          Amt001: null,
            Amt002: null,
             Amt003: null,
            Amt004: null,
             Amt005: null,
            Amt006: null,
             Total: null,
             
        });
      };
    
      const renderTableData = () => {
       
        return (
          <>
            {isLoading ? (
              <>
                <tr style={{ backgroundColor: getcolor }}>
                  <td colSpan="9" className="text-center">
                    <Spinner animation="border" variant="primary" />
                  </td>
                </tr>
                {Array.from({ length: Math.max(0, 25 - 5) }).map((_, rowIndex) => (
                  <tr
                    key={`blank-${rowIndex}`}
                    style={{
                      backgroundColor: getcolor,
                      color: fontcolor,
                    }}
                  >
                    {Array.from({ length: 9 }).map((_, colIndex) => (
                      <td key={`blank-${rowIndex}-${colIndex}`}>&nbsp;</td>
                    ))}
                  </tr>
                ))}
                <tr>
                  <td style={firstColWidth}></td>
                        <td style={secondColWidth}></td>
                        <td style={thirdColWidth}></td>
                        <td style={forthColWidth}></td>
                        <td style={fifthColWidth}></td>
                        <td style={sixthColWidth}></td>
                        <td style={seventhColWidth}></td>
                        <td style={eighthColWidth}></td>
                        <td style={ninthColWidth}></td>
                </tr>
              </>
            ) : (
              <>
                {tableData.map((item, i) => {
                  totalEnteries += 1;
                  return (
                    <tr
                      key={`${i}-${selectedIndex}`}
                      ref={(el) => (rowRefs.current[i] = el)}
                      onClick={() => handleRowClick(i)}
                      className={selectedIndex === i ? "selected-background" : ""}
                      style={{
                        backgroundColor: getcolor,
                        color: fontcolor,
                      }}
                    >
                     <td className="text-start" style={firstColWidth}>
                              {item.Code}
                            </td>
                            <td className="text-start" style={secondColWidth}>
                              {item.Customer}
                            </td>
                            <td className="text-end" style={thirdColWidth}>
                              {formatValue(item["Amt001"]) }
                            </td>
                            <td className="text-end" style={forthColWidth}>
                                  {formatValue(item["Amt002"]) }
                            </td>
                            <td className="text-end" style={fifthColWidth}>
                                  {formatValue(item["Amt003"]) }
                            </td>
                            <td className="text-end" style={sixthColWidth}>
                                  {formatValue(item["Amt004"]) }
                            </td>
                            <td className="text-end" style={seventhColWidth}>
                                  {formatValue(item["Amt005"]) }
                            </td>
                            <td className="text-end" style={eighthColWidth}>
                                  {formatValue(item["Amt006"]) }
                            </td>
                            <td className="text-end" style={ninthColWidth}>
                                  {formatValue(item["Total"]) }   
                                                           </td>
                    </tr>
                  );
                })}
                {Array.from({
                  length: Math.max(0, 25 - tableData.length),
                }).map((_, rowIndex) => (
                  <tr
                    key={`blank-${rowIndex}`}
                    style={{
                      backgroundColor: getcolor,
                      color: fontcolor,
                    }}
                  >
                    {Array.from({ length: 9}).map((_, colIndex) => (
                      <td key={`blank-${rowIndex}-${colIndex}`}>&nbsp;</td>
                    ))}
                  </tr>
                ))}
                <tr>
                 <td style={firstColWidth}></td>
                        <td style={secondColWidth}></td>
                        <td style={thirdColWidth}></td>
                        <td style={forthColWidth}></td>
                        <td style={fifthColWidth}></td>
                        <td style={sixthColWidth}></td>
                        <td style={seventhColWidth}></td>
                        <td style={eighthColWidth}></td>
                        <td style={ninthColWidth}></td>
                </tr>
              </>
            )}
          </>
        );
      };
    
      const getIconStyle = (colKey) => {
        const order = columnSortOrders[colKey];
        return {
          transform: order === "DSC" ? "rotate(180deg)" : "rotate(0deg)",
          color: order === "ASC" || order === "DSC" ? "red" : "white",
          transition: "transform 0.3s ease, color 0.3s ease",
        };
      };

 useHotkeys("alt+s", () => {
        fetchReceivableAging();
           resetSorting();
    }, { preventDefault: true, enableOnFormTags: true });

    useHotkeys("alt+p", exportPDFHandler, { preventDefault: true, enableOnFormTags: true });
    useHotkeys("alt+e", handleDownloadCSV, { preventDefault: true, enableOnFormTags: true });
    useHotkeys("alt+r", () => navigate("/MainPage"),  { preventDefault: true, enableOnFormTags: true });


  const [windowWidth, setWindowWidth] = useState(window.innerWidth);

  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
    };
    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  const contentStyle = {
        width: "100%", // 100vw ki jagah 100%
        maxWidth: "1000px",
        height: "calc(100vh - 100px)",
        position: "absolute",
        top: "70px",
        left: isSidebarVisible ? "60vw" : "50vw",
        transform: "translateX(-50%)",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        overflow: "hidden",
        textAlign: "center",
        fontSize: "15px",
        fontStyle: "normal",
        fontWeight: "400",
        lineHeight: "23px",
        fontFamily: '"Poppins", sans-serif',
        zIndex: 1,
        padding: "0 20px", // Side padding for small screens
        boxSizing: "border-box", // Padding ko width mein include kare
    };

  const [isFilterApplied, setIsFilterApplied] = useState(false);
  useEffect(() => {
    if (isFilterApplied || tableData.length > 0) {
      setSelectedIndex(0);
      rowRefs.current[0]?.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    } else {
      setSelectedIndex(-1);
    }
  }, [tableData, isFilterApplied]);

  let totalEnteries = 0;
  const [selectedRowId, setSelectedRowId] = useState(null);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const rowRefs = useRef([]);
  const handleRowClick = (index) => {
    setSelectedIndex(index);
  };

  useEffect(() => {
    if (selectedRowId !== null) {
      const newIndex = tableData.findIndex(
        (item) => item.tcmpcod === selectedRowId
      );
      setSelectedIndex(newIndex);
    }
  }, [tableData, selectedRowId]);

  const handleKeyDown = (e) => {
    if (selectedIndex === -1 || e.target.id === "searchInput") return;
    if (e.key === "ArrowUp") {
      e.preventDefault();
      setSelectedIndex((prevIndex) => Math.max(prevIndex - 1, 0));
      scrollToSelectedRow();
    } else if (e.key === "ArrowDown") {
      e.preventDefault();
      setSelectedIndex((prevIndex) =>
        Math.min(prevIndex + 1, tableData.length - 1)
      );
      scrollToSelectedRow();
    }
  };

  const scrollToSelectedRow = () => {
    if (selectedIndex !== -1 && rowRefs.current[selectedIndex]) {
      rowRefs.current[selectedIndex].scrollIntoView({
        behavior: "smooth",
        block: "nearest",
      });
    }
  };

  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [selectedIndex]);

  useEffect(() => {
    if (selectedIndex !== -1 && rowRefs.current[selectedIndex]) {
      rowRefs.current[selectedIndex].scrollIntoView({
        behavior: "smooth",
        block: "nearest",
      });
    }
  }, [selectedIndex]);

  const focusNextElement = (currentRef, nextRef) => {
    if (currentRef.current && nextRef.current) {
      currentRef.current.focus();
      nextRef.current.focus();
    }
  };


   const handleKeyPress = (e, nextInputRef) => {
    if (e.key === "Enter") {
      e.preventDefault();
      if (nextInputRef.current) {
        nextInputRef.current.focus();
      }
    }
  };

  const handleToDateEnter = (e) => {
    if (e.key === "Enter") {
      if (e.key !== "Enter") return;
      e.preventDefault();

      const inputDate = e.target.value;
      const formattedDate = inputDate.replace(
        /^(\d{2})(\d{2})(\d{4})$/,
        "$1-$2-$3"
      );

      // Basic format validation (dd-mm-yyyy)
      if (
        !/^(0[1-9]|[12][0-9]|3[01])-(0[1-9]|1[0-2])-\d{4}$/.test(formattedDate)
      ) {
        toast.error("Date must be in the format dd-mm-yyyy");
        return;
      }

      const [day, month, year] = formattedDate.split("-").map(Number);
      const enteredDate = new Date(year, month - 1, day);
      const daysInMonth = new Date(year, month, 0).getDate();

      // Validate month, day, and date range
      if (month < 1 || month > 12 || day < 1 || day > daysInMonth) {
        toast.error("Invalid date. Please check the day and month.");
        return;
      }
      if (enteredDate > GlobaltoDate) {
        toast.error(`Date must be before ${GlobaltoDate1}`);
        return;
      }

      // Update input value and state
      e.target.value = formattedDate;
      settoInputDate(formattedDate); // Update the state with formatted date

      // Move focus to the next element
      focusNextElement(toRef, searchRef);
    }
  };

  const handleSearchEnter = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      focusNextElement(searchRef, selectButtonRef);
    }
  };
  useEffect(() => {
    document.documentElement.style.setProperty("--background-color", getcolor);
  }, [getcolor]);

   const formatValue = (val) => {
  return Number(val) === 0 ? "" : val;
};

  return (
    <>
      <ToastContainer />
      <div style={contentStyle}>
        <div
          style={{
            backgroundColor: getcolor,
            color: fontcolor,
            // width: "100%",
            border: `1px solid ${fontcolor}`,
            borderRadius: "9px",
          }}
        >
          <NavComponent textdata="Payable Agging Report" />

          {/* ------------1st row */}
          <div
            className="row"
            style={{ height: "20px", marginTop: "8px", marginBottom: "8px" }}
          >
            <div
              style={{
                width: "100%",
                display: "flex",
                alignItems: "center",
                margin: "0px",
                padding: "0px",
                justifyContent: "space-between",
              }}
            >
              {/* To Date */}
              <div className="d-flex align-items-center">
                <div
                  style={{
                    width: "100px",
                    display: "flex",
                    justifyContent: "end",
                  }}
                >
                  <label htmlFor="toDatePicker">
                    <span
                      style={{
                        fontSize: parseInt(getdatafontsize),
                        fontWeight: "bold",
                      }}
                    >
                      Rep Date:&nbsp;&nbsp;
                    </span>
                  </label>
                </div>
                <div
                  id="todatevalidation"
                  style={{
                    width: "135px",
                    border: `1px solid ${fontcolor}`,
                    display: "flex",
                    alignItems: "center",
                    height: "24px",
                    justifyContent: "center",
                    background: getcolor,
                  }}
                  onFocus={(e) =>
                    (e.currentTarget.style.border = "2px solid red")
                  }
                  onBlur={(e) =>
                    (e.currentTarget.style.border = `1px solid ${fontcolor}`)
                  }
                >
                  <input
                    ref={toRef}
                    style={{
                      height: "20px",
                      width: "90px",
                      paddingLeft: "5px",
                      outline: "none",
                      border: "none",
                      fontSize: parseInt(getdatafontsize),
                      backgroundColor: getcolor,
                      color: fontcolor,
                      opacity: selectedRadio === "custom" ? 1 : 0.5,
                      pointerEvents:
                        selectedRadio === "custom" ? "auto" : "none",
                    }}
                    value={toInputDate}
                    onChange={handleToInputChange}
                    onKeyDown={handleToDateEnter}
                    id="toDatePicker"
                    autoComplete="off"
                    placeholder="dd-mm-yyyy"
                    aria-label="To Date Input"
                    disabled={selectedRadio !== "custom"}
                  />
                  <DatePicker
                    selected={selectedToDate}
                    onChange={handleToDateChange}
                    dateFormat="dd-MM-yyyy"
                    popperPlacement="bottom"
                    showPopperArrow={false}
                    open={toCalendarOpen}
                    dropdownMode="select"
                    customInput={
                      <div>
                        <BsCalendar
                          onClick={
                            selectedRadio === "custom"
                              ? toggleToCalendar
                              : undefined
                          }
                          style={{
                            cursor:
                              selectedRadio === "custom"
                                ? "pointer"
                                : "default",
                            marginLeft: "18px",
                            fontSize: parseInt(getdatafontsize),
                            color: fontcolor,
                            opacity: selectedRadio === "custom" ? 1 : 0.5,
                          }}
                          disabled={selectedRadio !== "custom"}
                        />
                      </div>
                    }
                    disabled={selectedRadio !== "custom"}
                  />
                </div>
              </div>

              {/* Search */}
              <div id="lastDiv" style={{ marginRight: "1px" }}>
                                <label for="searchInput" style={{ marginRight: "5px" }}>
                                    <span
                                        style={{
                                            fontSize: getdatafontsize,
                                            fontFamily: getfontstyle,
                                            fontWeight: "bold",
                                        }}
                                    >
                                        Search :
                                    </span>{" "}
                                </label>
                                <div style={{ position: "relative", display: "inline-block" }}>
                                    <input
                                        ref={searchRef}
                                        onKeyDown={(e) => handleKeyPress(e, selectButtonRef)}
                                        type="text"
                                        id="searchsubmit"
                                        placeholder="Item description"
                                        value={searchQuery}
                                        autoComplete="off"
                                        style={{
                                            marginRight: "20px",
                                            width: "200px",
                                            height: "24px",
                                            fontSize: getdatafontsize,
                                            fontFamily: getfontstyle,
                                            color: fontcolor,
                                            backgroundColor: getcolor,
                                            border: `1px solid ${fontcolor}`,
                                            outline: "none",
                                            paddingLeft: "10px",
                                            paddingRight: "25px", // space for the clear icon
                                        }}
                                        onFocus={(e) =>
                                            (e.currentTarget.style.border = "2px solid red")
                                        }
                                        onBlur={(e) =>
                                            (e.currentTarget.style.border = `1px solid ${fontcolor}`)
                                        }
                                        onChange={(e) =>
                                            setSearchQuery((e.target.value || "").toUpperCase())
                                        }
                                    />
                                    {searchQuery && (
                                        <span
                                            onClick={() => setSearchQuery("")}
                                            style={{
                                                position: "absolute",
                                                right: "30px",
                                                top: "50%",
                                                transform: "translateY(-50%)",
                                                cursor: "pointer",
                                                fontSize: "20px",
                                                color: fontcolor,
                                                userSelect: "none",
                                            }}
                                        >
                                            ×
                                        </span>
                                    )}
                                </div>
                            </div>
            </div>
          </div>

          <div>
            {/* Table Head */}
            <div
              style={{
                overflowY: "auto",
                // width: "98.7%",
              }}
            >
              <table
                className="myTable"
                id="table"
                style={{
                  fontSize: parseInt(getdatafontsize),
                //   width: "100%",
                  position: "relative",
                }}
              >
                <thead
                  style={{
                    fontWeight: "bold",
                    height: "24px",
                    position: "sticky",
                    top: 0,
                    boxShadow: "0 2px 4px rgba(0, 0, 0, 0.2)",
                    backgroundColor: getnavbarbackgroundcolor,
                  }}
                >
                  <tr
                    style={{
                      backgroundColor: getnavbarbackgroundcolor,
                      color: "white",
                    }}
                  >
                    <td
                      className="border-dark"
                      style={firstColWidth}
                      onClick={() => handleSorting("code")}
                    >
                      Code{" "}
                      <i
                        className="fa-solid fa-caret-down caretIconStyle"
                        style={getIconStyle("code")}
                      ></i>
                    </td>
                    <td
                      className="border-dark"
                      style={secondColWidth}
                      onClick={() => handleSorting("Customer")}
                    >
                      Description{" "}
                      <i
                        className="fa-solid fa-caret-down caretIconStyle"
                        style={getIconStyle("Customer")}
                      ></i>
                    </td>
                   <td
                      className="border-dark"
                      style={thirdColWidth}
                      onClick={() => handleSorting("Amt001")}
                    >
                      0 - 30{" "}
                      <i
                        className="fa-solid fa-caret-down caretIconStyle"
                        style={getIconStyle("Amt001")}
                      ></i>
                    </td>
                   <td
                      className="border-dark"
                      style={forthColWidth}
                      onClick={() => handleSorting("Amt002")}
                    >
                      30 - 60{" "}
                      <i
                        className="fa-solid fa-caret-down caretIconStyle"
                        style={getIconStyle("Amt002")}
                      ></i>
                    </td>
                   <td
                      className="border-dark"
                      style={fifthColWidth}
                      onClick={() => handleSorting("Amt003")}
                    >
                      61 - 90{" "}
                      <i
                        className="fa-solid fa-caret-down caretIconStyle"
                        style={getIconStyle("Amt003")}
                      ></i>
                    </td>
                   <td
                      className="border-dark"
                      style={sixthColWidth}
                      onClick={() => handleSorting("Amt004")}
                    >
                      91 - 120{" "}
                      <i
                        className="fa-solid fa-caret-down caretIconStyle"
                        style={getIconStyle("Amt004")}
                      ></i>
                    </td>
                   <td
                      className="border-dark"
                      style={seventhColWidth}
                      onClick={() => handleSorting("Amt005")}
                    >
                      121-150{" "}
                      <i
                        className="fa-solid fa-caret-down caretIconStyle"
                        style={getIconStyle("Amt005")}
                      ></i>
                    </td>
                   <td
                      className="border-dark"
                      style={eighthColWidth}
                      onClick={() => handleSorting("Amt006")}
                    >
                      150+{" "}
                      <i
                        className="fa-solid fa-caret-down caretIconStyle"
                        style={getIconStyle("Amt006")}
                      ></i>
                    </td>
                     <td
                      className="border-dark"
                      style={ninthColWidth}
                      onClick={() => handleSorting("Total")}
                    >
                      Balance{" "}
                      <i
                        className="fa-solid fa-caret-down caretIconStyle"
                        style={getIconStyle("Total")}
                      ></i>
                    </td>

<td
                      className="border-dark"
                      style={sixthcol}
                   >
                     
                     
                    </td>
                    
                  </tr>
                </thead>
              </table>
            </div>
            {/* Table Body */}
            <div
              className="table-scroll"
              style={{
                backgroundColor: textColor,
                borderBottom: `1px solid ${fontcolor}`,
                overflowY: "auto",
                maxHeight: "55vh",
                // width: "100%",
                wordBreak: "break-word",
              }}
            >
              <table
                className="myTable"
                id="tableBody"
                style={{
                  fontSize: getdatafontsize,
                  fontFamily: getfontstyle,
                //   width: "100%",
                    tableLayout: "fixed",   // FIXED!
                  overflowY: "scroll",
                }}
              >

            <tbody id="tablebody" style={{ overflowY: 'scroll' }}>{renderTableData()}</tbody>


                {/* <tbody id="tablebody">
                  {isLoading ? (
                    <>
                      <tr
                        style={{
                          backgroundColor: getcolor,
                        }}
                      >
                        <td colSpan="9" className="text-center">
                          <Spinner animation="border" variant="primary" />
                        </td>
                      </tr>
                      {Array.from({ length: Math.max(0, 30 - 9) }).map(
                        (_, rowIndex) => (
                          <tr
                            key={`blank-${rowIndex}`}
                            style={{
                              backgroundColor: getcolor,
                              color: fontcolor,
                            }}
                          >
                            {Array.from({ length: 9 }).map((_, colIndex) => (
                              <td key={`blank-${rowIndex}-${colIndex}`}>
                                &nbsp;
                              </td>
                            ))}
                          </tr>
                        )
                      )}
                      <tr>
                        <td style={firstColWidth}></td>
                        <td style={secondColWidth}></td>
                        <td style={thirdColWidth}></td>
                        <td style={forthColWidth}></td>
                        <td style={fifthColWidth}></td>
                        <td style={sixthColWidth}></td>
                        <td style={seventhColWidth}></td>
                        <td style={eighthColWidth}></td>
                        <td style={ninthColWidth}></td>
                      </tr>
                    </>
                  ) : (
                    <>
                      {tableData.map((item, i) => {
                        totalEnteries += 1;
                        return (
                          <tr
                            key={`${i}-${selectedIndex}`}
                            ref={(el) => (rowRefs.current[i] = el)}
                            onClick={() => handleRowClick(i)}
                            className={
                              selectedIndex === i ? "selected-background" : ""
                            }
                            style={{
                              backgroundColor: getcolor,
                              color: fontcolor,
                            }}
                          >
                            <td className="text-start" style={firstColWidth}>
                              {item.Code}
                            </td>
                            <td className="text-start" style={secondColWidth}>
                              {item.Customer}
                            </td>
                            <td className="text-end" style={thirdColWidth}>
                              {item["Amt001"]}
                            </td>
                            <td className="text-end" style={forthColWidth}>
                              {item["Amt002"]}
                            </td>
                            <td className="text-end" style={fifthColWidth}>
                              {item["Amt003"]}
                            </td>
                            <td className="text-end" style={sixthColWidth}>
                              {item["Amt004"]}
                            </td>
                            <td className="text-end" style={seventhColWidth}>
                              {item["Amt005"]}
                            </td>
                            <td className="text-end" style={eighthColWidth}>
                              {item["Amt006"]}
                            </td>
                            <td className="text-end" style={ninthColWidth}>
                              {item["Total"]}
                            </td>
                          </tr>
                        );
                      })}
                      {Array.from({
                        length: Math.max(0, 27 - tableData.length),
                      }).map((_, rowIndex) => (
                        <tr
                          key={`blank-${rowIndex}`}
                          style={{
                            backgroundColor: getcolor,
                            color: fontcolor,
                          }}
                        >
                          {Array.from({ length: 9 }).map((_, colIndex) => (
                            <td key={`blank-${rowIndex}-${colIndex}`}>
                              &nbsp;
                            </td>
                          ))}
                        </tr>
                      ))}
                      <tr>
                        <td style={firstColWidth}></td>
                        <td style={secondColWidth}></td>
                        <td style={thirdColWidth}></td>
                        <td style={forthColWidth}></td>
                        <td style={fifthColWidth}></td>
                        <td style={sixthColWidth}></td>
                        <td style={seventhColWidth}></td>
                        <td style={eighthColWidth}></td>
                        <td style={ninthColWidth}></td>
                      </tr>
                    </>
                  )}
                </tbody> */}
              </table>
            </div>
          </div>
          {/* Table Footer */}
          <div
            style={{
              borderBottom: `1px solid ${fontcolor}`,
              borderTop: `1px solid ${fontcolor}`,
              height: "24px",
              display: "flex",
              paddingRight: "8px",
            }}
          >
            <div
              style={{
                ...firstColWidth,
                background: getcolor,
                borderRight: `1px solid ${fontcolor}`,
              }}
            >
            <span className="mobileledger_total2">{formatValue(tableData.length.toLocaleString())}</span>
            </div>
            <div
              style={{
                ...secondColWidth,
                background: getcolor,
                borderRight: `1px solid ${fontcolor}`,
              }}
            ></div>
            <div
              style={{
                ...thirdColWidth,
                background: getcolor,
                borderRight: `1px solid ${fontcolor}`,
              }}
            >
              <span className="mobileledger_total">{formatValue(totalAmt1)}</span>
            </div>
            <div
              style={{
                ...forthColWidth,
                background: getcolor,
                borderRight: `1px solid ${fontcolor}`,
              }}
            >
              <span className="mobileledger_total">{formatValue(totalAmt2)}</span>
            </div>
            <div
              style={{
                ...fifthColWidth,
                background: getcolor,
                borderRight: `1px solid ${fontcolor}`,
              }}
            >
              <span className="mobileledger_total">{formatValue(totalAmt3)}</span>
            </div>
            <div
              style={{
                ...sixthColWidth,
                background: getcolor,
                borderRight: `1px solid ${fontcolor}`,
              }}
            >
              <span className="mobileledger_total">{formatValue(totalAmt4)}</span>
            </div>
            <div
              style={{
                ...seventhColWidth,
                background: getcolor,
                borderRight: `1px solid ${fontcolor}`,
              }}
            >
              <span className="mobileledger_total">{formatValue(totalAmt5)}</span>
            </div>
            <div
              style={{
                ...eighthColWidth,
                background: getcolor,
                borderRight: `1px solid ${fontcolor}`,
              }}
            >
              <span className="mobileledger_total">{formatValue(totalAmt6)}</span>
            </div>
            <div
              style={{
                ...ninthColWidth,
                background: getcolor,
                borderRight: `1px solid ${fontcolor}`,
              }}
            >
              <span className="mobileledger_total">{formatValue(total) }</span>
            </div>
          </div>
          {/* Action Buttons */}
          <div
            style={{
              margin: "5px",
              marginBottom: "2px",
            }}
          >
            <SingleButton
              to="/MainPage"
              text="Return"
              onFocus={(e) => (e.currentTarget.style.border = "2px solid red")}
              onBlur={(e) =>
                (e.currentTarget.style.border = `1px solid ${fontcolor}`)
              }
            />
            <SingleButton
              text="PDF"
              onClick={exportPDFHandler}
              onFocus={(e) => (e.currentTarget.style.border = "2px solid red")}
              onBlur={(e) =>
                (e.currentTarget.style.border = `1px solid ${fontcolor}`)
              }
            />
            <SingleButton
              text="Excel"
              onClick={handleDownloadCSV}
              onFocus={(e) => (e.currentTarget.style.border = "2px solid red")}
              onBlur={(e) =>
                (e.currentTarget.style.border = `1px solid ${fontcolor}`)
              }
            />
            <SingleButton
              id="searchsubmit"
              text="Select"
              ref={selectButtonRef}
 onClick={() => {
                fetchReceivableAging();
                resetSorting();
              }}               onFocus={(e) => (e.currentTarget.style.border = "2px solid red")}
              onBlur={(e) =>
                (e.currentTarget.style.border = `1px solid ${fontcolor}`)
              }
            />
          </div>
        </div>
      </div>
    </>
  );
}
