import React, { useState, useEffect, useRef } from "react";
import { Container, Spinner, Nav } from "react-bootstrap";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import { useTheme } from "../../../../ThemeContext";
import { getUserData, getOrganisationData, getLocationnumber, getYearDescription } from "../../../Auth";
import NavComponent from "../../../MainComponent/Navform/navbarform";
import SingleButton from "../../../MainComponent/Button/SingleButton/SingleButton";
import "react-datepicker/dist/react-datepicker.css";
import jsPDF from "jspdf";
import ExcelJS from "exceljs";
import { saveAs } from "file-saver";
import "react-calendar/dist/Calendar.css";
import { useSelector, useDispatch } from "react-redux";
import { fetchGetUser } from "../../../Redux/action";
import { useHotkeys } from "react-hotkeys-hook";
import "react-toastify/dist/ReactToastify.css";

export default function TypeList() {
  const navigate = useNavigate();
  const user = getUserData();
  const organisation = getOrganisationData();
  const yeardescription = getYearDescription();
  const locationnumber = getLocationnumber();
  const saleSelectRef = useRef(null);
  const input1Ref = useRef(null);
  const input2Ref = useRef(null);
  const input3Ref = useRef(null);

  const [sortData, setSortData] = useState("ASC");

  const [isAscendingcode, setisAscendingcode] = useState(true);
  const [isAscendingdec, setisAscendingdec] = useState(true);
  const [isAscendingsts, setisAscendingsts] = useState(true);

  const [searchQuery, setSearchQuery] = useState("");
  const [transectionType, settransectionType] = useState("");

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

  useEffect(() => {
    document.documentElement.style.setProperty("--background-color", getcolor);
  }, [getcolor]);

  const comapnyname = organisation.description;

  //////////////////////// CUSTOM DATE LIMITS ////////////////////////////

  // Toggle the ToDATE && FromDATE CalendarOpen state on each click

  const handleKeyPress = (e, nextInputRef) => {
    if (e.key === "Enter") {
      e.preventDefault();
      if (nextInputRef.current) {
        nextInputRef.current.focus();
      }
    }
  };

  function fetchReceivableReport() {
    const apiUrl = apiLinks + "/TypeList.php";
    setIsLoading(true);
    const formData = new URLSearchParams({
      FTypSts: transectionType,
      code: organisation.code,
      FLocCod: locationnumber || getLocationNumber,

      // code: 'NASIRTRD',
      // FLocCod: '001',
      FSchTxt: searchQuery,
    }).toString();

    axios
      .post(apiUrl, formData)
      .then((response) => {
        setIsLoading(false);

        if (response.data && Array.isArray(response.data)) {
          setTableData(response.data);
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
    if (!hasComponentMountedPreviously || (input1Ref && input1Ref.current)) {
      if (input1Ref && input1Ref.current) {
        setTimeout(() => {
          input1Ref.current.focus();
          // saleSelectRef.current.select();
        }, 0);
      }
      sessionStorage.setItem("componentMounted", "true");
    }
  }, []);

  const handleTransactionTypeChange = (event) => {
    const selectedTransactionType = event.target.value;
    settransectionType(selectedTransactionType);
  };

  ///////////////////////////// DOWNLOAD PDF CODE ////////////////////////////////////////////////////////////
 const exportPDFHandler = () => {
        
     
         // Create a new jsPDF instance with landscape orientation
         const doc = new jsPDF({ orientation: "potraite" });
     
         // Define table data (rows)
         const rows = tableData.map((item) => [
           item.Code,
           item.Description,
           item.Status,
         ]);
     
         // Add summary row to the table
         rows.push([String(formatValue(tableData.length.toLocaleString())), "", ""]);
     
         // Define table column headers and individual column widths
         const headers = ["Code", "Description", "Status"];
         const columnWidths = [22, 110, 18];
     
         // Calculate total table width
         const totalWidth = columnWidths.reduce((acc, width) => acc + width, 0);
     
         // Define page height and padding
         const pageHeight = doc.internal.pageSize.height;
         const paddingTop = 15;
     
         // Set font properties for the table
         doc.setFont("verdana-regular", "normal");
         doc.setFontSize(10);
     
         // Function to add table headers
         const addTableHeaders = (startX, startY) => {
           // Set font style and size for headers
            doc.setFont("verdana", "bold");
         doc.setFontSize(10);
     
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
           
         };
     
         const addTableRows = (startX, startY, startIndex, endIndex) => {
           const rowHeight = 5;
           const fontSize = 10;
           const boldFont = 400;
           const normalFont = getfontstyle;
           const tableWidth = getTotalTableWidth();
     
          
     
           for (let i = startIndex; i < endIndex; i++) {
             const row = rows[i];
             const isOddRow = i % 2 !== 0;
             const isRedRow = row[0] && parseInt(row[0]) > 10000000000;
             const isTotalRow = i === rows.length - 1;
             let textColor = [0, 0, 0];
             let fontName = normalFont;
     
             if (isRedRow) {
               textColor = [255, 0, 0];
               fontName = boldFont;
             }
     
             if (isTotalRow) {
               doc.setFont("verdana", "bold");
               doc.setFontSize(10);
             }
     
             if (isOddRow) {
               doc.setFillColor(240);
               doc.rect(
                 startX,
                 startY + (i - startIndex + 2) * rowHeight,
                 tableWidth,
                 rowHeight,
                 "F"
               );
             }
     
             doc.setDrawColor(0);
     
             if (isTotalRow) {
               const rowTopY = startY + (i - startIndex + 2) * rowHeight;
               const rowBottomY = rowTopY + rowHeight;
     
               doc.setLineWidth(0.3);
               doc.line(startX, rowTopY, startX + tableWidth, rowTopY);
               doc.line(startX, rowTopY + 0.5, startX + tableWidth, rowTopY + 0.5);
     
               doc.line(startX, rowBottomY, startX + tableWidth, rowBottomY);
               doc.line(
                 startX,
                 rowBottomY - 0.5,
                 startX + tableWidth,
                 rowBottomY - 0.5
               );
     
               doc.setLineWidth(0.2);
               doc.line(startX, rowTopY, startX, rowBottomY);
               doc.line(
                 startX + tableWidth,
                 rowTopY,
                 startX + tableWidth,
                 rowBottomY
               );
             } else {
               doc.setLineWidth(0.2);
               doc.rect(
                 startX,
                 startY + (i - startIndex + 2) * rowHeight,
                 tableWidth,
                 rowHeight
               );
             }
     
             row.forEach((cell, cellIndex) => {
               // ⭐ NEW FIX — Perfect vertical centering
               const cellY =
                 startY + (i - startIndex + 2) * rowHeight + rowHeight / 2;
     
               const cellX = startX + 2;
     
               doc.setTextColor(textColor[0], textColor[1], textColor[2]);
     
               if (!isTotalRow) {
                 doc.setFont("verdana-regular", "normal");
                 doc.setFontSize(10);
               }
     
               const cellValue = String(cell);
     
               if (cellIndex === 0 || cellIndex === 2) {
                 const rightAlignX = startX + columnWidths[cellIndex] / 2;
                 doc.text(cellValue, rightAlignX, cellY, {
                   align: "center",
                   baseline: "middle",
                 });
               } else if (
               
                 cellIndex === 12 
              
               
               ) {
                 const rightAlignX = startX + columnWidths[cellIndex] - 2;
                 doc.text(cellValue, rightAlignX, cellY, {
                   align: "right",
                   baseline: "middle",
                 });
               } else {
                 if (isTotalRow && cellIndex === 0 && cell === "") {
                   const totalLabelX = startX + columnWidths[0] / 2;
                   doc.text("", totalLabelX, cellY, {
                     align: "center",
                     baseline: "middle",
                   });
                 } else {
                   doc.text(cellValue, cellX, cellY, {
                     baseline: "middle",
                   });
                 }
               }
     
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
               doc.setFont("verdana-regular", "normal");
               doc.setFontSize(10);
             }
           }
     
           
     
           const lineWidth = tableWidth;
           const lineX = (doc.internal.pageSize.width - tableWidth) / 2;
           const lineY = pageHeight - 15;
           doc.setLineWidth(0.3);
           doc.line(lineX, lineY, lineX + lineWidth, lineY);
           const headingFontSize = 11;
           const headingX = lineX + 2;
           const headingY = lineY + 5;
           doc.setFont("verdana-regular", "normal");
           doc.setFontSize(10);
           doc.text(`Crystal Solution    ${date}    ${time}`, headingX, headingY);
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
         const rowsPerPage = 47; // Adjust this value based on your requirements
     
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
               rightX - 40,
               doc.internal.pageSize.height - 10,
               { align: "right" }
             );
           };
     
           let currentPageIndex = 0;
           let startY = paddingTop; // Initialize startY
           let pageNumber = 1; // Initialize page number
     
           while (currentPageIndex * rowsPerPage < rows.length) {
             doc.setFont("Times New Roman", "normal");
            addTitle(comapnyname, 12, 12, pageNumber, startY, 18); // Render company title with default font size, only date, and page number
            startY += 5; // Adjust vertical position for the company title
            doc.setFont("verdana-regular", "normal");
            addTitle(`Type List`, "", "", pageNumber, startY, 12); // Render sale report title with decreased font size, provide the time, and page number
            startY += -5;
     
             const labelsX = (doc.internal.pageSize.width - totalWidth) / 2;
             const labelsY = startY + 4; // Position the labels below the titles and above the table
     
             // Set font size and weight for the labels
             doc.setFontSize(12);
             doc.setFont(getfontstyle, "300");
     
             let status =
               transectionType === "N"
                 ? "NON-ACTIVE"
                 : transectionType === "A"
                   ? "ACTIVE"
                   : "ALL";
             let search = searchQuery ? searchQuery : "";
     
             // Set font style, size, and family
            doc.setFont("verdana", "bold");
         doc.setFontSize(10);
             doc.text(`Status :`, labelsX, labelsY + 8.5); // Draw bold label
      doc.setFont("verdana-regular", "normal");
         doc.setFontSize(10);
             doc.text(`${status}`, labelsX + 20, labelsY + 8.5); // Draw the value next to the label
     
             if (searchQuery) {
      doc.setFont("verdana", "bold");
         doc.setFontSize(10);
                   doc.text(`Search :`, labelsX + 70, labelsY + 8.5); // Draw bold label
      doc.setFont("verdana-regular", "normal");
         doc.setFontSize(10);
                   doc.text(`${search}`, labelsX + 90, labelsY + 8.5); // Draw the value next to the label
             }
     
           
     
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
         doc.save(`TypeList As On ${date}.pdf`);
       };
       ///////////////////////////// DOWNLOAD PDF CODE ////////////////////////////////////////////////////////////
     
       ///////////////////////////// DOWNLOAD PDF EXCEL //////////////////////////////////////////////////////////
     
     
       const handleDownloadCSV = async () => {
         const workbook = new ExcelJS.Workbook();
         const worksheet = workbook.addWorksheet("Sheet1");
     
         const numColumns = 3; // Ensure this matches the actual number of columns
         const columnAlignments = ["center", "left", "center"];
     
         // Define fonts
         const fontCompanyName = { name: "CustomFont", size: 18, bold: true };
         const fontStoreList = { name: "CustomFont", size: 10, bold: false };
         const fontHeader = { name: "CustomFont", size: 10, bold: true };
         const fontTableContent = { name: "CustomFont", size: 10, bold: false };
     
         // Empty row
         worksheet.addRow([]);
     
         // Company name
         const companyRow = worksheet.addRow([comapnyname]);
         companyRow.eachCell((cell) => {
           cell.font = fontCompanyName;
           cell.alignment = { horizontal: "center" };
         });
         worksheet.getRow(companyRow.number).height = 30;
         worksheet.mergeCells(`A${companyRow.number}:${String.fromCharCode(65 + numColumns - 1)}${companyRow.number}`);
     
         // Store List
         const storeListRow = worksheet.addRow(["Type List"]);
         storeListRow.eachCell((cell) => {
           cell.font = fontStoreList;
           cell.alignment = { horizontal: "center" };
         });
         worksheet.mergeCells(`A${storeListRow.number}:${String.fromCharCode(65 + numColumns - 1)}${storeListRow.number}`);
     
         // Empty row
         worksheet.addRow([]);
     
         // Filter data
         let typestatus =
           transectionType === "N" ? "NON-ACTIVE" :
             transectionType === "A" ? "ACTIVE" : "ALL";
         let typesearch = searchQuery || "";
     
         const typeAndStoreRow3 = worksheet.addRow(
           searchQuery ? ["Status :", typestatus, "Search :", typesearch] : ["Status :", typestatus, ""]
         );
     
         typeAndStoreRow3.eachCell((cell, colIndex) => {
           cell.font = { name: "CustomFont", size: 10, bold: [1, 3].includes(colIndex) };
           cell.alignment = { horizontal: "left", vertical: "middle" };
         });
     
         // Header style
         const headerStyle = {
           font: fontHeader,
           alignment: { horizontal: "center", vertical: "middle" },
           fill: { type: "pattern", pattern: "solid", fgColor: { argb: "FFC6D9F7" } },
           border: {
             top: { style: "thin" },
             left: { style: "thin" },
             bottom: { style: "thin" },
             right: { style: "thin" },
           },
         };
     
         // Headers
         const headers = ["Code", "Description", "Status"];
         const headerRow = worksheet.addRow(headers);
         headerRow.eachCell((cell) => Object.assign(cell, headerStyle));
     
         // ✅ Add data rows with alternating light grey background
         tableData.forEach((item, index) => {
           const row = worksheet.addRow([item.Code, item.Description, item.Status]);
     
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
     
             // ✅ Apply very light grey background to odd rows
             if ((index + 1) % 2 !== 0) {
               cell.fill = {
                 type: "pattern",
                 pattern: "solid",
                 fgColor: { argb: "FFEFEFEF" }, // Very light grey
               };
             }
           });
         });
     
         // Column widths
         [10, 40, 7].forEach((width, index) => {
           worksheet.getColumn(index + 1).width = width;
         });
     
         const totalRow = worksheet.addRow([
           String(formatValue(tableData.length.toLocaleString())),
           "",
            "",
           
         ]);
     
         // total row added
     
         totalRow.eachCell((cell, colNumber) => {
           cell.font = { bold: true };
           cell.border = {
             top: { style: "thin" },
             left: { style: "thin" },
             bottom: { style: "thin" },
             right: { style: "thin" },
           };
     
           // Align only the "Total" text to the right
           if (colNumber === 1) {
             cell.alignment = { horizontal: "center" };
           }
         });
     
     
         // Blank row
         worksheet.addRow([]);
     
         // Date and Time
         const today = new Date();
         const currentTime = today.toLocaleTimeString("en-GB");
         const currentDate = today.toLocaleDateString("en-GB").replace(/\//g, "-");
         const userid = user.tusrid;
     
         const dateTimeRow = worksheet.addRow([`DATE:   ${currentDate}  TIME:   ${currentTime}`]);
         dateTimeRow.eachCell((cell) => {
           cell.font = { name: "CustomFont", size: 10 };
           cell.alignment = { horizontal: "left" };
         });
     
         const dateTimeRow1 = worksheet.addRow([`USER ID:  ${userid}`]);
         dateTimeRow1.eachCell((cell) => {
           cell.font = { name: "CustomFont", size: 10 };
           cell.alignment = { horizontal: "left" };
         });
     
         // Merge cells
         worksheet.mergeCells(`A${dateTimeRow.number}:${String.fromCharCode(65 + numColumns - 1)}${dateTimeRow.number}`);
         worksheet.mergeCells(`A${dateTimeRow1.number}:${String.fromCharCode(65 + numColumns - 1)}${dateTimeRow1.number}`);
     
         // Save Excel
         const buffer = await workbook.xlsx.writeBuffer();
         const blob = new Blob([buffer], {
           type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
         });
         saveAs(blob, `TypeList As On ${currentDate}.xlsx`);
       };

  ///////////////////////////// DOWNLOAD PDF EXCEL ///////////////////////////////////////////////////////////

  const dispatch = useDispatch();

  const tableTopColor = "#3368B5";
  const tableHeadColor = "#3368b5";
  const secondaryColor = "white";
  const btnColor = "#3368B5";
  const textColor = "white";

  const [tableData, setTableData] = useState([]);
  console.log("comapnydata", tableData);
  const [selectedSearch, setSelectedSearch] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { data, loading, error } = useSelector((state) => state.getuser);

  const handleSearch = (e) => {
    setSelectedSearch(e.target.value);
  };

  let totalEntries = 0;

  const [columns, setColumns] = useState({
    Code: [],
    Description: [],
    Status: [],
  });
  const [columnSortOrders, setColumnSortOrders] = useState({
    Code: "",
    Description: "",
    Status: "",
  });

  // When you receive your initial table data, transform it into column-oriented format
  useEffect(() => {
    if (tableData.length > 0) {
      const newColumns = {
        Code: tableData.map((row) => row.Code),
        Description: tableData.map((row) => row.Description),
        Status: tableData.map((row) => row.Status),
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
      Code: null,
      Description: null,
      Status: null,
    });
  };


  const renderTableData = () => {
    
    return (
      <>
        {isLoading ? (
          <>
            <tr style={{ backgroundColor: getcolor }}>
              <td colSpan="3" className="text-center">
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
                {Array.from({ length: 3 }).map((_, colIndex) => (
                  <td key={`blank-${rowIndex}-${colIndex}`}>&nbsp;</td>
                ))}
              </tr>
            ))}
            <tr>
              <td style={firstColWidth}></td>
              <td style={secondColWidth}></td>
              <td style={thirdColWidth}></td>
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
                  <td className="text-center" style={firstColWidth}>
                    {item.Code}
                  </td>
                  <td className="text-start" style={secondColWidth}>
                    {item.Description}
                  </td>
                  <td className="text-center" style={thirdColWidth}>
                    {item.Status}
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
                {Array.from({ length: 3 }).map((_, colIndex) => (
                  <td key={`blank-${rowIndex}-${colIndex}`}>&nbsp;</td>
                ))}
              </tr>
            ))}
            <tr>
              <td style={firstColWidth}></td>
              <td style={secondColWidth}></td>
              <td style={thirdColWidth}></td>
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


  // const handleSorting = (col) => {
  //   // Get current sort order for this column
  //   const currentOrder = columnSortOrders[col];
  //   const newOrder = currentOrder === "ASC" ? "DSC" : "ASC";

  //   // Create a copy of the column data
  //   const columnData = [...columns[col]];

  //   // Sort just this column's data
  //   columnData.sort((a, b) => {
  //     const aValue = a !== null ? a.toString() : "";
  //     const bValue = b !== null ? b.toString() : "";

  //     const numA = parseFloat(aValue.replace(/,/g, ""));
  //     const numB = parseFloat(bValue.replace(/,/g, ""));

  //     if (!isNaN(numA) && !isNaN(numB)) {
  //       return newOrder === "ASC" ? numA - numB : numB - numA;
  //     } else {
  //       return newOrder === "ASC"
  //         ? aValue.localeCompare(bValue)
  //         : bValue.localeCompare(aValue);
  //     }
  //   });

  //   // Update just this column's data
  //   setColumns(prev => ({
  //     ...prev,
  //     [col]: columnData
  //   }));

  //   // Update the sort order for this column
  //   setColumnSortOrders(prev => ({
  //     ...prev,
  //     [col]: newOrder
  //   }));
  // };

  useHotkeys("alt+s", () => {
        fetchReceivableReport();
           resetSorting();
    }, { preventDefault: true, enableOnFormTags: true });

    useHotkeys("alt+p", exportPDFHandler, { preventDefault: true, enableOnFormTags: true });
    useHotkeys("alt+e", handleDownloadCSV, { preventDefault: true, enableOnFormTags: true });
    useHotkeys("alt+r", () => navigate("/MainPage"),  { preventDefault: true, enableOnFormTags: true });


  // const firstColWidth = {
  //   width: "20.2%",
  // };
  // const secondColWidth = {
  //   width: "62%",
  // };
  // const thirdColWidth = {
  //   width: "15%",
  // };

  const firstColWidth = { width: "60px" };
  const secondColWidth = { width: "360px" };
  const thirdColWidth = { width: "60px" };
  
  const sixthcol = { width: "8px" };



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
    maxWidth: "700px",
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


   const formatValue = (val) => {
  return Number(val) === 0 ? "" : val;
};

  return (
    <>
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
          <NavComponent textdata="Type List" />

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
              <div
                className="d-flex align-items-center"
                style={{ marginRight: "21px" }}
              >
                <div
                  style={{
                    marginLeft: "10px",
                    width: "60px",
                    display: "flex",
                    justifyContent: "end",
                  }}
                >
                  <label htmlFor="transactionType">
                    <span
                      style={{
                        fontSize: getdatafontsize,
                        fontFamily: getfontstyle,
                        fontWeight: "bold",
                      }}
                    >
                      Status :
                    </span>
                  </label>
                </div>

              
<div style={{ position: "relative", display: "inline-block" }}>
  <select
    ref={input1Ref}
    onKeyDown={(e) => handleKeyPress(e, input2Ref)}
    id="submitButton"
    name="type"
    onFocus={(e) =>
      (e.currentTarget.style.border = "4px solid red")
    }
    onBlur={(e) =>
      (e.currentTarget.style.border = `1px solid ${fontcolor}`)
    }
    value={transectionType}
    onChange={handleTransactionTypeChange}
    style={{
      width: "150px",
      height: "24px",
      marginLeft: "5px",
      backgroundColor: getcolor,
      border: `1px solid ${fontcolor}`,
      fontSize: getdatafontsize,
      fontFamily: getfontstyle,
      color: fontcolor,
      paddingRight: "25px",
    }}
  >
    <option value="">ALL</option>
    <option value="A">ACTIVE</option>
    <option value="N">NON-ACTIVE</option>
  </select>

  {transectionType !== "" && (
    <span
      onClick={() => settransectionType("")}
      style={{
        position: "absolute",
        right: "25px",
        top: "50%",
        transform: "translateY(-50%)",
        cursor: "pointer",
        fontWeight: "bold",
        color: fontcolor,
        userSelect: "none",
        fontSize: "12px",
      }}
    >
      ✕
    </span>
  )}
</div>
              </div>

              <div id="lastDiv" style={{ marginRight: "5px" }}>
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
                    ref={input2Ref}
                    onKeyDown={(e) => handleKeyPress(e, input3Ref)}
                    type="text"
                    id="searchsubmit"
                    placeholder="Item description"
                    value={searchQuery}
                    autoComplete="off"
                    style={{
                      marginRight: "20px",
                      width: "140px",
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
            <div
              style={{
                overflowY: "auto",
                // width: "98.8%",
              }}
            >
              <table
                className="myTable"
                id="table"
                style={{
                  fontSize: getdatafontsize,
                  fontFamily: getfontstyle,
                  // width: "98%",
                  position: "relative",
                  paddingRight: "2%",
                }}
              >
                <thead
                  style={{
                    fontWeight: "bold",
                    fontSize: getdatafontsize,
                    fontFamily: getfontstyle,
                    height: "24px",
                    position: "sticky",
                    top: 0,
                    boxShadow: "0 2px 4px rgba(0, 0, 0, 0.2)",
                    backgroundColor: tableHeadColor,
                  }}
                >
                  <tr
                    style={{ backgroundColor: tableHeadColor, color: "white" }}
                  >
                    <td
                      className="border-dark"
                      style={firstColWidth}
                      onClick={() => handleSorting("Code")}
                    >
                      Code{" "}
                      <i
                        className="fa-solid fa-caret-down caretIconStyle"
                        style={getIconStyle("Code")}
                      ></i>
                    </td>

                    <td
                      className="border-dark"
                      style={secondColWidth}
                      onClick={() => handleSorting("Description")}
                    >
                      Description{" "}
                      <i
                        className="fa-solid fa-caret-down caretIconStyle"
                        style={getIconStyle("Description")}
                      ></i>
                    </td>

                    <td
                      className="border-dark"
                      style={thirdColWidth}
                      onClick={() => handleSorting("Status")}
                    >
                      Status{" "}
                      <i
                        className="fa-solid fa-caret-down caretIconStyle"
                        style={getIconStyle("Status")}
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
            {/* <div
              className="table-scroll"
              style={{
                backgroundColor: textColor,
                borderBottom: `1px solid ${fontcolor}`,
                overflowY: "auto",
                maxHeight: "55vh",
                width: "100%",
                wordBreak: "break-word",
              }}
            >
              <table
                className="myTable"
                id="tableBody"
                style={{
                  fontSize: "12px",
                  width: "100%",
                  position: "relative",
                  fontSize: getdatafontsize,
                  fontFamily: getfontstyle,
                }}
              >
                <tbody id="tablebody">
                  {renderTableData()} 
                </tbody>
              </table>
            </div> */}

            <div
              className="table-scroll"
              style={{
                // maxHeight: "370px",
                "--scrollbar-track-color": getcolor,
                backgroundColor: textColor,
                // '--selected-bg-color': getnavbarbackgroundcolor,
                borderBottom: `1px solid ${fontcolor}`,
                overflowY: "auto",
                 maxHeight: "55vh",
                wordBreak: "break-word",
              }}
            >

              <table
                className="myTable"
                id="tableBody"
                style={{
                  fontSize: getdatafontsize,
                  fontFamily: getfontstyle,
                  // width: "98%",
                  tableLayout: "fixed",   // FIXED!
                  overflowY: "scroll",
                }}
              >
                <tbody id="tablebody" style={{ overflowY: 'scroll' }}>{renderTableData()}</tbody>
              </table>


            </div>
          </div>

          <div
            style={{
              borderBottom: `1px solid ${fontcolor}`,
              borderTop: `1px solid ${fontcolor}`,
              height: "24px",
              display: "flex",
              paddingRight: "1.2%",
              // width: "101.2%",
            }}
          >
            <div
              style={{
                ...firstColWidth,
                background: getcolor,
                borderRight: `1px solid ${fontcolor}`,
              }}
            >
 <span className="mobileledger_total2">{formatValue(tableData.length.toLocaleString()) }</span>

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
            ></div>



          </div>

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
              highlightFirstLetter={true}
              ref={input3Ref}
              onClick={() => {
                fetchReceivableReport();
                resetSorting();
              }}
              onFocus={(e) => (e.currentTarget.style.border = "2px solid red")}
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

