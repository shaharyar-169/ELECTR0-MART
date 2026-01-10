import React, { useState, useEffect, useRef } from "react";
import { Container, Spinner, Nav } from "react-bootstrap";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import { useTheme } from "../../../../ThemeContext";
import {
  getUserData,
  getOrganisationData,
  getLocationnumber,
  getYearDescription,
} from "../../../Auth";
import NavComponent from "../../../MainComponent/Navform/navbarform";
import SingleButton from "../../../MainComponent/Button/SingleButton/SingleButton";
import "react-datepicker/dist/react-datepicker.css";
import jsPDF from "jspdf";
import ExcelJS from "exceljs";
import { saveAs } from "file-saver";
import "react-calendar/dist/Calendar.css";
import Select from "react-select";
import { BsCalendar } from "react-icons/bs";
import DatePicker from "react-datepicker";
import { useSelector, useDispatch } from "react-redux";
import { fetchGetUser } from "../../../Redux/action";
import { useHotkeys } from "react-hotkeys-hook";
import "react-toastify/dist/ReactToastify.css";
import { components } from "react-select";
import { ToastContainer, toast } from "react-toastify";
import "../../../vardana/vardana.js";
import "../../../vardana/verdana-bold.js";

export default function InstallmentCustomerList() {
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

   const [supplierList, setSupplierList] = useState([]);
 const [saleType, setSaleType] = useState("");
 const [Companyselectdatavalue, setCompanyselectdatavalue] = useState("");



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
    const apiUrl = apiLinks + "/InstallmentCustomerList.php";
    setIsLoading(true);
    const formData = new URLSearchParams({
      code: organisation.code,
      FLocCod: locationnumber || getLocationNumber,
      FColCod: saleType,
      FCstSts: transectionType,
      FSchTxt: searchQuery,

      // code: "MTSELEC",
      // FLocCod: "002",
     
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
    if (!hasComponentMountedPreviously || (saleSelectRef && saleSelectRef.current)) {
      if (saleSelectRef && saleSelectRef.current) {
        setTimeout(() => {
          saleSelectRef.current.focus();
          // saleSelectRef.current.select();
        }, 0);
      }
      sessionStorage.setItem("componentMounted", "true");
    }
  }, []);

  useEffect(() => {
        const apiUrl = apiLinks + "/GetActiveCustomers.php";
        const formData = new URLSearchParams({
              code: organisation.code,
              FLocCod: locationnumber || getLocationNumber,
           
        }).toString();
        axios
            .post(apiUrl, formData)
            .then((response) => {
                setSupplierList(response.data);
            })
            .catch((error) => {
                console.error("Error fetching data:", error);
            });
    }, []);

    const options = supplierList.map((item) => ({
        value: item.tcstcod,
        label: `${item.tcstcod}-${item.tcstnam.trim()}`,
    }));


const DropdownOption = (props) => {
        return (
            <components.Option {...props}>
                <div
                    style={{
                        fontSize: getdatafontsize,
                        fontFamily: getfontstyle,
                        paddingBottom: "5px",
                        lineHeight: "3px",
                        // color: fontcolor,
                        textAlign: "start",
                    }}
                >
                    {props.data.label}
                </div>
            </components.Option>
        );
    };

    const customStyles1 = (hasError) => ({
        control: (base, state) => ({
            ...base,
            height: "24px",
            minHeight: "unset",
            width: 380,
            fontSize: getdatafontsize,
            fontFamily: getfontstyle,
            backgroundColor: getcolor,
            color: fontcolor,
            caretColor: getcolor === "white" ? "black" : "white",
            borderRadius: 0,
            border: `1px solid ${fontcolor}`,
            transition: "border-color 0.15s ease-in-out",
            "&:hover": {
                borderColor: state.isFocused ? base.borderColor : fontcolor,
            },
            padding: "0 8px",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            boxShadow: "none",
            "&:focus-within": {
                borderColor: "#3368B5",
                boxShadow: "0 0 0 1px #3368B5",
            },
        }),

        menu: (base) => ({
            ...base,
            marginTop: "5px",
            borderRadius: 0,
            backgroundColor: getcolor,
            border: `1px solid ${fontcolor}`,
            boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
            zIndex: 9999,
        }),
        menuList: (base) => ({
            ...base,
            padding: 0,
            maxHeight: "200px",
            // Scrollbar styling for Webkit browsers
            "&::-webkit-scrollbar": {
                width: "8px",
                height: "8px",
            },
            "&::-webkit-scrollbar-track": {
                background: getcolor,
                borderRadius: "10px",
            },
            "&::-webkit-scrollbar-thumb": {
                backgroundColor: fontcolor,
                borderRadius: "10px",
                border: `2px solid ${getcolor}`,
                "&:hover": {
                    backgroundColor: "#3368B5",
                },
            },
            // Scrollbar styling for Firefox
            scrollbarWidth: "thin",
            scrollbarColor: `${fontcolor} ${getcolor}`,
        }),
        option: (base, state) => ({
            ...base,
            fontSize: getdatafontsize,
            fontFamily: getfontstyle,
            backgroundColor: state.isSelected
                ? "#3368B5"
                : state.isFocused
                    ? "#3368B5"
                    : getcolor,
            color: state.isSelected  || state.isFocused ? "white" : fontcolor,
            "&:hover": {
                backgroundColor: "#3368B5",
                color: "white",
                cursor: "pointer",
            },
            "&:active": {
                backgroundColor: "#1a66cc",
            },
            transition: "background-color 0.2s ease, color 0.2s ease",
        }),
        dropdownIndicator: (base, state) => ({
            ...base,
            padding: 0,
            marginTop: "-5px",
            fontSize: "18px",
            display: "flex",
            textAlign: "center",
            color: fontcolor,
            transition: "transform 0.2s ease",
            transform: state.selectProps.menuIsOpen
                ? "rotate(180deg)"
                : "rotate(0deg)",
            "&:hover": {
                color: "#3368B5",
            },
        }),
        indicatorSeparator: () => ({
            display: "none",
        }),
        singleValue: (base) => ({
            ...base,
            marginTop: "-5px",
            textAlign: "left",
            color: fontcolor,
            fontSize: getdatafontsize,
            fontFamily: getfontstyle,
        }),
        input: (base) => ({
            ...base,
            color: getcolor === "white" ? "black" : fontcolor,
            caretColor: getcolor === "white" ? "black" : "white",
            marginTop: "-5px",
        }),
        clearIndicator: (base) => ({
            ...base,
            marginTop: "-5px",
            padding: "0 4px",
            color: fontcolor,
            "&:hover": {
                color: "#ff4444",
            },
        }),
        placeholder: (base) => ({
            ...base,
            color: `${fontcolor}80`, // 50% opacity
            fontSize: getdatafontsize,
            fontFamily: getfontstyle,
            marginTop: "-5px",
        }),
        noOptionsMessage: (base) => ({
            ...base,
            fontSize: getdatafontsize,
            fontFamily: getfontstyle,
            color: fontcolor,
            backgroundColor: getcolor,
        }),
        loadingMessage: (base) => ({
            ...base,
            fontSize: getdatafontsize,
            fontFamily: getfontstyle,
            color: fontcolor,
            backgroundColor: getcolor,
        }),
        multiValue: (base) => ({
            ...base,
            backgroundColor: `${fontcolor}20`, // Light background for tags
        }),
        multiValueLabel: (base) => ({
            ...base,
            color: fontcolor,
            fontSize: getdatafontsize,
            fontFamily: getfontstyle,
        }),
        multiValueRemove: (base) => ({
            ...base,
            color: `${fontcolor}80`,
            "&:hover": {
                backgroundColor: "#ff4444",
                color: "white",
            },
        }),
    });


const handleSaleKeypress = (event, inputId) => {
        if (event.key === "Enter") {
            const selectedOption = saleSelectRef.current.state.selectValue;
            if (selectedOption && selectedOption.value) {
                setSaleType(selectedOption.value);
            }
            const nextInput = document.getElementById(inputId);
            if (nextInput) {
                nextInput.focus();
                // nextInput.select();
            } else {
                document.getElementById("submitButton").click();
            }
        }
    };


  const handleTransactionTypeChange = (event) => {
    const selectedTransactionType = event.target.value;
    settransectionType(selectedTransactionType);
  };

  ///////////////////////////// DOWNLOAD PDF CODE ////////////////////////////////////////////////////////////
  const exportPDFHandler = () => {
    
 
     // Create a new jsPDF instance with landscape orientation
     const doc = new jsPDF({ orientation: "landscape" });
 
     // Define table data (rows)
     const rows = tableData.map((item) => [
       item.tcstcod ,
      item.tmancod ,
      item.tcstnam ,
      item.tfthnam ,
      item.tnicnum ,
      item.tmobnum ,
      item.Collector ,
      item.tcststs ,
     ]);
 
     // Add summary row to the table
    //  rows.push([
      
    //    "",
    //    "Total",
      
    //    String(totalopening),
    //        String(totaldebit),
    //    String(totalcredit),
    //    String(ClosingBalance),
    //  ]);
 
     // Define table column headers and individual column widths
 
    const headers = ["Code", "Ml No", "Name", "F Name", "CNIC","Mobile", "Collector", "Sts"];
    const columnWidths = [23, 17,70,50,50,30,40,12];
 
     // Calculate total table width
     const totalWidth = columnWidths.reduce((acc, width) => acc + width, 0);
 
     // Define page height and padding
     const pageHeight = doc.internal.pageSize.height;
     const paddingTop = 15;
 
     // Set font properties for the table
     // doc.setFont("verdana-regular", "normal");
     // doc.setFontSize(10);
 
     // Function to add table headers
     const addTableHeaders = (startX, startY) => {
       // Set font style and size for headers
       doc.setFont("verdana", "bold"); // Set font to bold
       doc.setFontSize(10); // Set font size for headers
 
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
 
       doc.setFontSize(11);
 
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
 
        //  if (isTotalRow) {
        //    doc.setFont("verdana", "bold");
        //    doc.setFontSize(10);
        //  }
 
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
 
        
           doc.setLineWidth(0.2);
           doc.rect(
             startX,
             startY + (i - startIndex + 2) * rowHeight,
             tableWidth,
             rowHeight
           );
         
 
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
 
           if (cellIndex === 0 || cellIndex === 1 || cellIndex === 7 || cellIndex === 5) {
             const rightAlignX = startX + columnWidths[cellIndex] / 2;
             doc.text(cellValue, rightAlignX, cellY, {
               align: "center",
               baseline: "middle",
             });
           } else if (
             cellIndex === 20 
                         
           ) {
             const rightAlignX = startX + columnWidths[cellIndex] - 2;
             doc.text(cellValue, rightAlignX, cellY, {
               align: "right",
               baseline: "middle",
             });
           } 
           else {
            //  if (isTotalRow && cellIndex === 0 && cell === "") {
            //    const totalLabelX = startX + columnWidths[0] / 2;
            //    doc.text("", totalLabelX, cellY, {
            //      align: "center",
            //      baseline: "middle",
            //    });
            //  }
            
               doc.text(cellValue, cellX, cellY, {
                 baseline: "middle",
               });
             
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
 
        //  if (isTotalRow) {
        //    doc.setFont("verdana-regular", "normal");
        //    doc.setFontSize(10);
        //  }
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
     const rowsPerPage = 29; // Adjust this value based on your requirements
 
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
           rightX - 5,
           doc.internal.pageSize.height - 10,
           { align: "right" }
         );
       };
 
       let currentPageIndex = 0;
       let startY = paddingTop; // Initialize startY
       let pageNumber = 1; // Initialize page number
 
       while (currentPageIndex * rowsPerPage < rows.length) {
     
            doc.setFontSize(10);
         doc.setFont('helvetica', "300");
         addTitle(comapnyname, 12, 12, pageNumber, startY, 18); // Render company title with default font size, only date, and page number
         startY += 5; // Adjust vertical position for the company title
        
         doc.setFont('verdana-regular', "normal");
          doc.setFontSize(10);
         addTitle(
           `Installment Customer List`,
           "",
           "",
           pageNumber,
           startY,
           12
         ); // Render sale report title with decreased font size, provide the time, and page number
         startY += 5;
 
         const labelsX = (doc.internal.pageSize.width - totalWidth) / 2;
         const labelsY = startY + 4; // Position the labels below the titles and above the table
 
         // Set font size and weight for the labels
     
     
 
         // Set font style, size, and family
        doc.setFont("verdana-regular", "normal");
        doc.setFontSize(10); // Font size

         let typestatus =
      transectionType === "N" ? "NON-ACTIVE" :
        transectionType === "A" ? "ACTIVE" : "ALL";

        let customerdata= Companyselectdatavalue.label 
        ? Companyselectdatavalue.label : 'ALL'
       let typesearch = searchQuery || "";
 
         doc.setFont(getfontstyle, "bold"); // Set font to bold
         doc.text(`Customer :`, labelsX, labelsY); // Draw bold label
         doc.setFont(getfontstyle, "normal"); // Reset font to normal
         doc.text(`${customerdata}`, labelsX + 25, labelsY); // Draw the value next to the label
 
         doc.setFont(getfontstyle, "bold"); // Set font to bold
         doc.text(`Status :`, labelsX + 190, labelsY); // Draw bold label
         doc.setFont(getfontstyle, "normal"); // Reset font to normal
         doc.text(`${typestatus}`, labelsX + 210, labelsY); // Draw the value next to the label
 
     
         // doc.setFont(getfontstyle, "bold"); // Set font to bold
         // doc.text(`CAPACITY :`, labelsX, labelsY + 8.5); // Draw bold label
         // doc.setFont(getfontstyle, "normal"); // Reset font to normal
         // doc.text(`${typeText}`, labelsX + 25, labelsY + 8.5); // Draw the value next to the label
 
         // doc.setFont(getfontstyle, "bold"); // Set font to bold
         // doc.text(`CAPACITY :`, labelsX, labelsY + 8.5); // Draw bold label
         // doc.setFont(getfontstyle, "normal"); // Reset font to normal
         // doc.text(`${typeText}`, labelsX + 25, labelsY + 8.5); // Draw the value next to the label
 
         // doc.setFont(getfontstyle, "bold"); // Set font to bold
         // doc.text(`STATUS :`, labelsX + 180, labelsY + 8.5); // Draw bold label
         // doc.setFont(getfontstyle, "normal"); // Reset font to normal
         // doc.text(`${transectionsts}`, labelsX + 205, labelsY + 8.5); // Draw the value next to the label
 
         if (searchQuery) {
           doc.setFont(getfontstyle, "bold"); // Set font to bold
           doc.text(`Search :`, labelsX + 190, labelsY + 4.5); // Draw bold label
           doc.setFont(getfontstyle, "normal"); // Reset font to normal
           doc.text(`${typesearch}`, labelsX + 210, labelsY + 4.5); // Draw the value next to the label
         }
 
         // // Reset font weight to normal if necessary for subsequent text
         
 
         startY += searchQuery ? 6 : 2; // Adjust vertical position for the labels
 
         addTableHeaders((doc.internal.pageSize.width - totalWidth) / 2, searchQuery ? 35 : 31);
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
       const mm = String(today.getMonth() + 1).padStart(2, "0");
       const yyyy = today.getFullYear();
       return `${dd}-${mm}-${yyyy}`;
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
     doc.save(`InstallmentCustomerList As On ${date}.pdf`);
   };
  ///////////////////////////// DOWNLOAD PDF CODE ////////////////////////////////////////////////////////////

  ///////////////////////////// DOWNLOAD PDF EXCEL //////////////////////////////////////////////////////////

  const handleDownloadCSV = async () => {
     const workbook = new ExcelJS.Workbook();
     const worksheet = workbook.addWorksheet("Sheet1");
 
     const numColumns = 7; // Ensure this matches the actual number of columns
 
     const columnAlignments = [
       "center",
       "center",
       "left",
       "left",
       "left",
       "center",
       "left",
       "center"
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
  // Add company name
 const companyRow = worksheet.addRow([comapnyname]);
 
 companyRow.eachCell((cell) => {
   cell.font = {
     name: "Times New Roman",
     size: 16,       // optional
     bold: true,     // optional
   };
   cell.alignment = { horizontal: "center" };
 });
 
 
     worksheet.getRow(companyRow.number).height = 30;
     worksheet.mergeCells(
       `A${companyRow.number}:${String.fromCharCode(66 + numColumns - 1)}${
         companyRow.number
       }`
     );
 
     // Add Store List row
     const storeListRow = worksheet.addRow([
       `Installment Customer List`,
     ]);
     storeListRow.eachCell((cell) => {
       cell.font = fontStoreList;
       cell.alignment = { horizontal: "center" };
     });
 
     worksheet.mergeCells(
       `A${storeListRow.number}:${String.fromCharCode(66 + numColumns - 1)}${
         storeListRow.number
       }`
     );
 
     // Add an empty row after the title section
     worksheet.addRow([]);

           let typestatus =
      transectionType === "N" ? "NON-ACTIVE" :
        transectionType === "A" ? "ACTIVE" : "ALL";

        let customerdata= Companyselectdatavalue.label 
        ? Companyselectdatavalue.label : 'ALL'
       let typesearch = searchQuery || "";

       const typeAndStoreRow2 = worksheet.addRow(
       ["Customer :", customerdata, "","","","Status :", typestatus] 
    );
         worksheet.mergeCells(`B${typeAndStoreRow2.number}:D${typeAndStoreRow2.number}`);


       const typeAndStoreRow3 = worksheet.addRow(
      searchQuery ? ["", "","","","", "Search :", typesearch] : [""]
    );
         worksheet.mergeCells(`G${typeAndStoreRow3.number}:H${typeAndStoreRow3.number}`);

    typeAndStoreRow2.eachCell((cell, colIndex) => {
      cell.font = { name: "CustomFont", size: 10, bold: [1, 6].includes(colIndex) };
      cell.alignment = { horizontal: "left", vertical: "middle" };
    });
     typeAndStoreRow3.eachCell((cell, colIndex) => {
      cell.font = { name: "CustomFont", size: 10, bold: [1, 6].includes(colIndex) };
      cell.alignment = { horizontal: "left", vertical: "middle" };
    });
 
   
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
      "Code", "Ml No", "Name", "F Name", "CNIC","Mobile", "Collector", "Status"
     ];
     const headerRow = worksheet.addRow(headers);
     headerRow.eachCell((cell) => Object.assign(cell, headerStyle));
 
     // Add data rows
     tableData.forEach((item) => {
       const row = worksheet.addRow([
       item.tcstcod ,
      item.tmancod ,
      item.tcstnam ,
      item.tfthnam ,
      item.tnicnum ,
      item.tmobnum ,
      item.Collector ,
      item.tcststs ,
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
 
     // Set column widths
     [10,8, 35,35,18, 14,20,7].forEach((width, index) => {
       worksheet.getColumn(index + 1).width = width;
     });
 
    //  const totalRow = worksheet.addRow([
    //    "",
    //    "Total",
      
    //    String(totalopening),
    //        String(totaldebit),
    //    String(totalcredit),
    //    String(ClosingBalance),
    //  ]);
 
    //  // total row added
 
    //  totalRow.eachCell((cell, colNumber) => {
    //    cell.font = { bold: true };
    //    cell.border = {
    //      top: { style: "thin" },
    //      left: { style: "thin" },
    //      bottom: { style: "thin" },
    //      right: { style: "thin" },
    //    };
 
    //    // Align only the "Total" text to the right
    //    if (colNumber === 3 || colNumber === 4 || colNumber === 5 || colNumber === 6) {
    //      cell.alignment = { horizontal: "right" };
    //    }
    //  });
 
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
     const dateTimeRow = worksheet.addRow([
       `DATE:   ${currentdate}  TIME:   ${currentTime}`,
     ]);
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
       `A${dateTimeRow.number}:${String.fromCharCode(65 + numColumns - 1)}${
         dateTimeRow.number
       }`
     );
     worksheet.mergeCells(
       `A${dateTimeRow1.number}:${String.fromCharCode(65 + numColumns - 1)}${
         dateTimeRow1.number
       }`
     );
 
     // Generate and save the Excel file
     const buffer = await workbook.xlsx.writeBuffer();
     const blob = new Blob([buffer], {
       type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
     });
     saveAs(blob, `InstallmentCustomerList As On ${currentdate}.xlsx`);
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
    tcstcod: [],
    tmancod: [],
    tcstnam: [],
    tfthnam: [],
    tnicnum: [],
    tmobnum: [],
    Collector: [],
    tcststs: [],
  });
  const [columnSortOrders, setColumnSortOrders] = useState({
    tcstcod: "",
    tmancod: "",
    tcstnam: "",
    tfthnam: "",
    tnicnum: "",
    tmobnum: "",
    Collector: "",
    tcststs: "",
  });

  // When you receive your initial table data, transform it into column-oriented format
  useEffect(() => {
    if (tableData.length > 0) {
      const newColumns = {
        tcstcod: tableData.map((row) => row.tcstcod),
        tmancod: tableData.map((row) => row.tmancod),
        tcstnam: tableData.map((row) => row.tcstnam),
        tfthnam: tableData.map((row) => row.tfthnam),
        tnicnum: tableData.map((row) => row.tnicnum),
        tmobnum: tableData.map((row) => row.tmobnum),
        Collector: tableData.map((row) => row.Collector),
        tcststs: tableData.map((row) => row.tcststs),
      };
      setColumns(newColumns);
    }
  }, [tableData]);

 const handleSorting = (col) => {
  const currentOrder = columnSortOrders[col];
  const newOrder = currentOrder === "ASC" ? "DSC" : "ASC";

  const sortedData = [...tableData].sort((a, b) => {
    const aVal = a[col] != null ? a[col].toString().trim() : "";
    const bVal = b[col] != null ? b[col].toString().trim() : "";

    // Attempt numeric conversion
    const numA = Number(aVal.replace(/,/g, ""));
    const numB = Number(bVal.replace(/,/g, ""));

    // Check if numeric sorting is possible
    const bothNumeric =
      !isNaN(numA) && !isNaN(numB) && aVal !== "" && bVal !== "";

    if (bothNumeric) {
      return newOrder === "ASC" ? numA - numB : numB - numA;
    }

    // Alphabetical sorting as fallback
    return newOrder === "ASC"
      ? aVal.localeCompare(bVal)
      : bVal.localeCompare(aVal);
  });

  // Update table
  setTableData(sortedData);

  // Update column sort indicator
  setColumnSortOrders((prev) => {
    const updated = {};
    Object.keys(prev).forEach((key) => {
      updated[key] = key === col ? newOrder : null;
    });
    return updated;
  });
};
  const resetSorting = () => {
    setColumnSortOrders({
      tcstcod: null,
      tmancod: null,
      tcstnam: null,
      tfthnam: null,
      tnicnum: null,
      tmobnum: null,
      Collector: null,
      tcststs: null,
    });
  };

  const getIconStyle = (colKey) => {
    const order = columnSortOrders[colKey];
    return {
      transform: order === "DSC" ? "rotate(180deg)" : "rotate(0deg)",
      color: order === "ASC" || order === "DSC" ? "red" : "white",
      transition: "transform 0.3s ease, color 0.3s ease",
    };
  };
  const renderTableData = () => {
    return (
      <>
        {isLoading ? (
          <>
            <tr style={{ backgroundColor: getcolor }}>
              <td colSpan="8" className="text-center">
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
                {Array.from({ length: 8 }).map((_, colIndex) => (
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
              <td style={eightColWidth}></td>
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
                    {item.tcstcod}
                  </td>
                  <td className="text-center" style={secondColWidth}>
                    {item.tmancod}
                  </td>
                  <td className="text-start" style={thirdColWidth}>
                    {item.tcstnam}
                  </td>
                  <td className="text-start" style={forthColWidth}>
                    {item.tfthnam}
                  </td>
                  <td className="text-start" style={fifthColWidth}>
                    {item.tnicnum}
                  </td>
                  <td className="text-start" style={sixthColWidth}>
                    {item.tmobnum}
                  </td>
                  <td className="text-start" style={seventhColWidth}>
                    {item.Collector}
                  </td>
                  <td className="text-center" style={eightColWidth}>
                    {item.tcststs}
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
                {Array.from({ length: 8 }).map((_, colIndex) => (
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
              <td style={eightColWidth}></td>
            </tr>
          </>
        )}
      </>
    );
  };

  useHotkeys(
    "alt+s",
    () => {
      fetchReceivableReport();
      resetSorting();
    },
    { preventDefault: true, enableOnFormTags: true }
  );

  useHotkeys("alt+p", exportPDFHandler, {
    preventDefault: true,
    enableOnFormTags: true,
  });
  useHotkeys("alt+e", handleDownloadCSV, {
    preventDefault: true,
    enableOnFormTags: true,
  });
  useHotkeys("alt+r", () => navigate("/MainPage"), {
    preventDefault: true,
    enableOnFormTags: true,
  });

  // const firstColWidth = {
  //   width: "20.2%",
  // };
  // const secondColWidth = {
  //   width: "62%",
  // };
  // const thirdColWidth = {
  //   width: "15%",
  // };

  const firstColWidth = { width: "80px" };
  const secondColWidth = { width: "60px" };
  const thirdColWidth = { width: "270px" };
  const forthColWidth = { width: "150px" };
  const fifthColWidth = { width: "130px" };
  const sixthColWidth = { width: "100px" };
  const seventhColWidth = { width: "150px" };
  const eightColWidth = { width: "40px" };

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
    maxWidth: "1000px",
    height: "calc(100vh - 100px)",
    position: "absolute",
    top: "70px",
    left: isSidebarVisible ? "60vw" : "53vw",
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
          <NavComponent textdata="Installment Customer List" />

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
                                              className="d-flex align-items-center "
                                          style={{marginLeft:'20px'}}
                                         >
                                              <div
                                                  style={{
                                                      width: "80px",
                                                      display: "flex",
                                                      justifyContent: "end",
                                                  }}
                                              >
                                                  <label htmlFor="fromDatePicker">
                                                      <span style={{ fontSize: getdatafontsize, fontFamily: getfontstyle, fontWeight: "bold" }}>
                                                          Collector :
                                                      </span>{" "}
                                                      <br />
                                                  </label>
                                              </div>
                                              <div style={{ marginLeft: "5px" }}>
                                                  <Select
                                                      className="List-select-class"
                                                      ref={saleSelectRef}
                                                      options={options}
                                                      // value={options.find(opt => opt.value === saleType) || null} // Ensure correct reference
                                                      onKeyDown={(e) => handleSaleKeypress(e, "statusid")}
                                                      id="selectedsale"
                                                      onChange={(selectedOption) => {
                                                          if (selectedOption && selectedOption.value) {
                                                              const labelParts = selectedOption.label.split("-"); // Split by "-"
                                                              const description = labelParts.slice(3).join("-"); // Remove the first 3 parts
              
                                                              setSaleType(selectedOption.value);
                                                              setCompanyselectdatavalue({
                                                                  value: selectedOption.value,
                                                                  label: description, // Keep only the description
              
                                                              });
                                                          } else {
                                                              setSaleType("");
                                                              setCompanyselectdatavalue('')
                                                          }
                                                      }}
                                                      onInputChange={(inputValue, { action }) => {
                                                          if (action === "input-change") {
                                                              return inputValue.toUpperCase();
                                                          }
                                                          return inputValue;
                                                      }}
                                                      components={{ Option: DropdownOption }}
                                                      styles={{
                                                          ...customStyles1(!saleType),
                                                          placeholder: (base) => ({
                                                              ...base,
                                                              textAlign: "left",
                                                              marginLeft: "0",
                                                              justifyContent: "flex-start",
                                                              color: fontcolor,
                                                              marginTop: '-5px'
                                                          })
                                                      }}
                                                      isClearable
                                                      placeholder="ALL"
                                                  />
                                              </div>
                                          </div>

               <div
                className="d-flex align-items-center"
                style={{ marginRight: "20px" }}
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
                    id="statusid"
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
                      width: "200px",
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
            </div>
          </div>

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
                justifyContent: "end",
              }}
            >
            

              <div id="lastDiv" >
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
            <div
              style={{
                overflowY: "auto",
                marginTop:'5px'
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
                      onClick={() => handleSorting("tcstcod")}
                    >
                      Code{" "}
                      <i
                        className="fa-solid fa-caret-down caretIconStyle"
                        style={getIconStyle("tcstcod")}
                      ></i>
                    </td>

                    <td
                      className="border-dark"
                      style={secondColWidth}
                      onClick={() => handleSorting("tmancod")}
                    >
                      Ml No{" "}
                      <i
                        className="fa-solid fa-caret-down caretIconStyle"
                        style={getIconStyle("tmancod")}
                      ></i>
                    </td>

                    <td
                      className="border-dark"
                      style={thirdColWidth}
                      onClick={() => handleSorting("tcstnam")}
                    >
                      Name{" "}
                      <i
                        className="fa-solid fa-caret-down caretIconStyle"
                        style={getIconStyle("tcstnam")}
                      ></i>
                    </td>

                    <td
                      className="border-dark"
                      style={forthColWidth}
                      onClick={() => handleSorting("tfthnam")}
                    >
                      F-Name{" "}
                      <i
                        className="fa-solid fa-caret-down caretIconStyle"
                        style={getIconStyle("tfthnam")}
                      ></i>
                    </td>

                    <td
                      className="border-dark"
                      style={fifthColWidth}
                      onClick={() => handleSorting("tnicnum")}
                    >
                      CNIC{" "}
                      <i
                        className="fa-solid fa-caret-down caretIconStyle"
                        style={getIconStyle("tnicnum")}
                      ></i>
                    </td>

                    <td
                      className="border-dark"
                      style={sixthColWidth}
                      onClick={() => handleSorting("tmobnum")}
                    >
                      Mobile{" "}
                      <i
                        className="fa-solid fa-caret-down caretIconStyle"
                        style={getIconStyle("tmobnum")}
                      ></i>
                    </td>

                    <td
                      className="border-dark"
                      style={seventhColWidth}
                      onClick={() => handleSorting("Collector")}
                    >
                      Collector{" "}
                      <i
                        className="fa-solid fa-caret-down caretIconStyle"
                        style={getIconStyle("Collector")}
                      ></i>
                    </td>

                    <td
                      className="border-dark"
                      style={eightColWidth}
                      onClick={() => handleSorting("tcststs")}
                    >
                      Sts{" "}
                      <i
                        className="fa-solid fa-caret-down caretIconStyle"
                        style={getIconStyle("tcststs")}
                      ></i>
                    </td>

                    <td className="border-dark" style={sixthcol}></td>
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
                maxHeight: "50vh",
                wordBreak: "break-word",
              }}
            >
              <table
                className="myTable"
                id="tableBody"
                style={{
                  fontSize: getdatafontsize,
                  fontFamily: getfontstyle,
                  width: "100%",
                  position: "relative",
                  ...(tableData.length > 0 ? { tableLayout: "fixed" } : {}),
                }}
              >
                <tbody id="tablebody" style={{ overflowY: "scroll" }}>
                  {renderTableData()}
                </tbody>
              </table>
            </div>
          </div>

          <div
            style={{
              borderBottom: `1px solid ${fontcolor}`,
              borderTop: `1px solid ${fontcolor}`,
              height: "24px",
              display: "flex",
              paddingRight: "8px",
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
              <span className="mobileledger_total2">
                {formatValue(tableData.length.toLocaleString())}
              </span>
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
            <div
              style={{
                ...forthColWidth,
                background: getcolor,
                borderRight: `1px solid ${fontcolor}`,
              }}
            ></div>
            <div
              style={{
                ...fifthColWidth,
                background: getcolor,
                borderRight: `1px solid ${fontcolor}`,
              }}
            ></div>
            <div
              style={{
                ...sixthColWidth,
                background: getcolor,
                borderRight: `1px solid ${fontcolor}`,
              }}
            ></div>
            <div
              style={{
                ...seventhColWidth,
                background: getcolor,
                borderRight: `1px solid ${fontcolor}`,
              }}
            ></div>
            <div
              style={{
                ...eightColWidth,
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
