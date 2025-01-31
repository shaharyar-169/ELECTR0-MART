import React, { useState, useEffect, useRef } from "react";
import { Container, Spinner, Nav } from "react-bootstrap";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import { useTheme } from "../../../../ThemeContext";
import { getUserData, getOrganisationData, getLocationnumber, getYearDescription } from "../../../Auth";
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
import { fetchGetUser } from "../../../Redux/action";
import { useHotkeys } from "react-hotkeys-hook";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import './dailydemo.css';

export default function DailyPurchaseReport() {
    const navigate = useNavigate();
    const user = getUserData();
    const organisation = getOrganisationData();
  
    const input1Ref = useRef(null);
  
    const toRef = useRef(null);
    const fromRef = useRef(null);
  
    const storeRef = useRef(null);
    const typeRef = useRef(null);
    const searchRef = useRef(null);
    const selectButtonRef = useRef(null);
  
    const [searchQuery, setSearchQuery] = useState("");
    const [transectionType, settransectionType] = useState("");
    const [storeType, setStoreType] = useState("");
    const [Companyselectdatavalue, setCompanyselectdatavalue] = useState("");
    const [storeList, setStoreList] = useState([]);
  
    const [totalQnty, setTotalQnty] = useState(0);
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
  
    const yeardescription = getYearDescription();
  const locationnumber = getLocationnumber()
  
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
        getdatafontsize
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
  
    const GlobalfromDate1 = formatDate1(GlobalfromDate);
    const GlobaltoDate1 = formatDate1(GlobaltoDate);
  
    //////////////////////// CUSTOM DATE LIMITS ////////////////////////////
  
    // Toggle the ToDATE && FromDATE CalendarOpen state on each click
    const toggleFromCalendar = () => {
      setfromCalendarOpen((prevOpen) => !prevOpen);
    };
    const toggleToCalendar = () => {
      settoCalendarOpen((prevOpen) => !prevOpen);
    };
    const formatDate = (date) => {
      const day = date.getDate().toString().padStart(2, "0");
      const month = (date.getMonth() + 1).toString().padStart(2, "0");
      const year = date.getFullYear();
      return `${day}-${month}-${year}`;
    };
    const handlefromDateChange = (date) => {
      setSelectedfromDate(date);
      setfromInputDate(date ? formatDate(date) : "");
      setfromCalendarOpen(false);
    };
    const handlefromInputChange = (e) => {
      setfromInputDate(e.target.value);
    };
  
    const handleToDateChange = (date) => {
      setSelectedToDate(date);
      settoInputDate(date ? formatDate(date) : "");
      settoCalendarOpen(false);
    };
    const handleToInputChange = (e) => {
      settoInputDate(e.target.value);
    };
  
    function fetchDailyPurchaseReport() {
      const fromDateElement = document.getElementById("fromdatevalidation");
      const toDateElement = document.getElementById("todatevalidation");
  
      const dateRegex = /^\d{2}-\d{2}-\d{4}$/;
  
      let hasError = false;
      let errorType = "";
  
      switch (true) {
        case !fromInputDate:
          errorType = "fromDate";
          break;
        case !toInputDate:
          errorType = "toDate";
          break;
        default:
          hasError = false;
          break;
      }
  
      if (!dateRegex.test(fromInputDate)) {
        errorType = "fromDateInvalid";
      } else if (!dateRegex.test(toInputDate)) {
        errorType = "toDateInvalid";
      } else {
        const formattedFromInput = fromInputDate.replace(
          /^(\d{2})(\d{2})(\d{4})$/,
          "$1-$2-$3"
        );
        const [fromDay, fromMonth, fromYear] = formattedFromInput
          .split("-")
          .map(Number);
        const enteredFromDate = new Date(fromYear, fromMonth - 1, fromDay);
  
        const formattedToInput = toInputDate.replace(
          /^(\d{2})(\d{2})(\d{4})$/,
          "$1-$2-$3"
        );
        const [toDay, toMonth, toYear] = formattedToInput.split("-").map(Number);
        const enteredToDate = new Date(toYear, toMonth - 1, toDay);
  
        if (GlobalfromDate && enteredFromDate < GlobalfromDate) {
          errorType = "fromDateBeforeGlobal";
        } else if (GlobaltoDate && enteredFromDate > GlobaltoDate) {
          errorType = "fromDateAfterGlobal";
        } else if (GlobaltoDate && enteredToDate > GlobaltoDate) {
          errorType = "toDateAfterGlobal";
        } else if (GlobaltoDate && enteredToDate < GlobalfromDate) {
          errorType = "toDateBeforeGlobal";
        } else if (enteredToDate < enteredFromDate) {
          errorType = "toDateBeforeFromDate";
        }
      }
  
      switch (errorType) {
        case "fromDate":
          toast.error("From date is required");
          return;
        case "toDate":
          toast.error("To date is required");
          return;
        case "fromDateInvalid":
          toast.error("From date must be in the format dd-mm-yyyy");
          return;
        case "toDateInvalid":
          toast.error("To date must be in the format dd-mm-yyyy");
          return;
        case "fromDateBeforeGlobal":
          toast.error(
            `From date must be after ${GlobalfromDate1} and before ${GlobaltoDate1}`
          );
          return;
        case "fromDateAfterGlobal":
          toast.error(
            `From date must be after ${GlobalfromDate1} and before ${GlobaltoDate1}`
          );
          return;
        case "toDateAfterGlobal":
          toast.error(
            `To date must be after ${GlobalfromDate1} and before ${GlobaltoDate1}`
          );
          return;
        case "toDateBeforeGlobal":
          toast.error(
            `To date must be after ${GlobalfromDate1} and before ${GlobaltoDate1}`
          );
          return;
        case "toDateBeforeFromDate":
          toast.error("To date must be after from date");
          return;
        default:
          break;
      }
  
      document.getElementById(
        "fromdatevalidation"
      ).style.border = `1px solid ${fontcolor}`;
      document.getElementById(
        "todatevalidation"
      ).style.border = `1px solid ${fontcolor}`;
  
      const apiMainUrl = apiLinks + "/DailyPurchaseReport.php";
      setIsLoading(true);
      const formMainData = new URLSearchParams({
        code: organisation.code,
        FLocCod: locationnumber || getLocationNumber,
        FYerDsc: yeardescription || getYearDescription,
        FIntDat: fromInputDate,
        FFnlDat: toInputDate,
        FTrnTyp: transectionType,
        FStrCod: storeType,
        FSchTxt: searchQuery,
      }).toString();
  
      axios
        .post(apiMainUrl, formMainData)
        .then((response) => {
          setIsLoading(false);
          // console.log("Response:", response.data);
  
          setTotalQnty(response.data["Total Qnty"]);
          setTotalAmount(response.data["Total Amount"]);
  
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
      if (!hasComponentMountedPreviously || (fromRef && fromRef.current)) {
        if (fromRef && fromRef.current) {
          setTimeout(() => {
            fromRef.current.focus();
            fromRef.current.select();
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
  
    useEffect(() => {
      //----------------- store dropdown
      const apiStoreUrl = apiLinks + "/GetStore.php";
      const formStoreData = new URLSearchParams({
        code: organisation.code,
      }).toString();
      axios
        .post(apiStoreUrl, formStoreData)
        .then((response) => {
          setStoreList(response.data);
          // console.log("STORE"+response.data);
        })
        .catch((error) => {
          console.error("Error fetching data:", error);
        });
    }, []);
  
    // Store List array
    const optionStore = storeList.map((item) => ({
      value: item.tstrcod,
      label: `${item.tstrcod}-${item.tstrdsc.trim()}`,
    }));
  
    const DropdownOption = (props) => {
      return (
        <components.Option {...props}>
          <div
            style={{
                fontSize: getdatafontsize,fontFamily:getfontstyle,              paddingBottom: "5px",
              lineHeight: "3px",
              color: "black",
              textAlign: "start",
            }}
          >
            {props.data.label}
          </div>
        </components.Option>
      );
    };
  
    // ------------ store style customization
    const customStylesStore = () => ({
      control: (base, state) => ({
        ...base,
        height: "24px",
        minHeight: "unset",
        width: "275px",
        fontSize: getdatafontsize,fontFamily:getfontstyle,        backgroundColor: getcolor,
        color: fontcolor,
        borderRadius: 0,
        // border: hasError ? "2px solid red" : `1px solid ${fontcolor}`,
        transition: "border-color 0.15s ease-in-out",
        "&:hover": {
          borderColor: state.isFocused ? base.borderColor : "black",
        },
        padding: "0 8px",
        display: "flex",
        // alignItems: "center",
        justifyContent: "space-between",
      }),
      dropdownIndicator: (base) => ({
        ...base,
        padding: 0,
        marginTop: "-5px",
        fontSize: "18px",
        display: "flex",
        textAlign: "center !important",
      }),
      singleValue: (base) => ({
        ...base,
        marginTop: "-5px",
        textAlign: "left",
        color: fontcolor,
      }),
      clearIndicator: (base) => ({
        ...base,
        marginTop: "-5px",
      }),
    });
  
    const handleTransactionTypeChange = (event) => {
      const selectedTransactionType = event.target.value;
      settransectionType(selectedTransactionType);
    };
  
     const exportPDFHandler = () => {
            const globalfontsize = 12;
            console.log("gobal font data", globalfontsize);
    
            // Create a new jsPDF instance with landscape orientation
            const doc = new jsPDF({ orientation: "landscape" });
    
            // Define table data (rows)
            const rows = tableData.map((item) => [
                item.Date,
                item["Trn #"],
                item.Type,
                item.Str,
                item.Description,
                item.Supplier,
                item.Rate,
                item.Qnty,
                item["Pur Amount"],

                
            ]);
    
            // Add summary row to the table
            rows.push([
               "",
        "",
        "",
        "",
        "Total",
        "",
        "",
        String(totalQnty),
        String(totalAmount),]);
    
            // Define table column headers and individual column widths
    
            const headers = [
                "Date",
                "Trn#",
                "Type",
                "Store",
                "Description",
                "Supplier",
                "Rate",
                "Qnty",
                "Amount",
              ];
              const columnWidths = [22, 18, 12,12, 90, 70, 18, 10, 18];
    
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
    
            // const addTableRows = (startX, startY, startIndex, endIndex) => {
            //     const rowHeight = 5; // Adjust this value to decrease row height
            //     const fontSize = 10; // Adjust this value to decrease font size
            //     const boldFont = 400; // Bold font
            //     const normalFont = getfontstyle; // Default font
            //     const tableWidth = getTotalTableWidth(); // Calculate total table width
    
            //     doc.setFontSize(fontSize);
    
            //     for (let i = startIndex; i < endIndex; i++) {
            //         const row = rows[i];
            //         const isOddRow = i % 2 !== 0; // Check if the row index is odd
            //         const isRedRow = row[0] && parseInt(row[0]) > 10000000000; // Check if tctgcod is greater than 100
            //         let textColor = [0, 0, 0]; // Default text color
            //         let fontName = normalFont; // Default font
    
            //         if (isRedRow) {
            //             textColor = [255, 0, 0]; // Red color
            //             fontName = boldFont; // Set bold font for red-colored row
            //         }
    
            //         // Set background color for odd-numbered rows
            //         // if (isOddRow) {
            //         // 	doc.setFillColor(240); // Light background color
            //         // 	doc.rect(
            //         // 		startX,
            //         // 		startY + (i - startIndex + 2) * rowHeight,
            //         // 		tableWidth,
            //         // 		rowHeight,
            //         // 		"F"
            //         // 	);
            //         // }
    
            //         // Draw row borders
            //         doc.setDrawColor(0); // Set color for borders
            //         doc.rect(
            //             startX,
            //             startY + (i - startIndex + 2) * rowHeight,
            //             tableWidth,
            //             rowHeight
            //         );
    
            //         row.forEach((cell, cellIndex) => {
            //             const cellY = startY + (i - startIndex + 2) * rowHeight + 3;
            //             const cellX = startX + 2;
    
            //             // Set text color
            //             doc.setTextColor(textColor[0], textColor[1], textColor[2]);
            //             // Set font
            //             doc.setFont(fontName, "normal");
    
            //             // Ensure the cell value is a string
            //             const cellValue = String(cell);
    
            //             if (
            //                 cellIndex === 1 ||
            //                 cellIndex === 5 ||
            //                 cellIndex === 6 ||
            //                 cellIndex === 7
            //               ) {
            //                 const rightAlignX = startX + columnWidths[cellIndex] - 2;
            //                 doc.text(cellValue, rightAlignX, cellY, {
            //                   align: "right",
            //                   baseline: "middle",
            //                 });
            //               } else {
            //                 doc.text(cellValue, cellX, cellY, { baseline: "middle" });
            //               }
    
            //             // Draw column borders (excluding the last column)
            //             if (cellIndex < row.length - 1) {
            //                 doc.rect(
            //                     startX,
            //                     startY + (i - startIndex + 2) * rowHeight,
            //                     columnWidths[cellIndex],
            //                     rowHeight
            //                 );
            //                 startX += columnWidths[cellIndex];
            //             }
            //         });
    
            //         // Draw border for the last column
            //         doc.rect(
            //             startX,
            //             startY + (i - startIndex + 2) * rowHeight,
            //             columnWidths[row.length - 1],
            //             rowHeight
            //         );
            //         startX = (doc.internal.pageSize.width - tableWidth) / 2; // Adjusted for center alignment
            //     }
    
            //     // Draw line at the bottom of the page with padding
            //     const lineWidth = tableWidth; // Match line width with table width
            //     const lineX = (doc.internal.pageSize.width - tableWidth) / 2; // Center line
            //     const lineY = pageHeight - 15; // Position the line 20 units from the bottom
            //     doc.setLineWidth(0.3);
            //     doc.line(lineX, lineY, lineX + lineWidth, lineY); // Draw line
            //     const headingFontSize = 12; // Adjust as needed
    
            //     // Add heading "Crystal Solution" aligned left bottom of the line
            //     const headingX = lineX + 2; // Padding from left
            //     const headingY = lineY + 5; // Padding from bottom
            //     doc.setFontSize(headingFontSize); // Set the font size for the heading
            //     doc.setTextColor(0); // Reset text color to default
            //     doc.text(`Crystal Solution \t ${date} \t ${time}`, headingX, headingY);
            // };
    
          
            const addTableRows = (startX, startY, startIndex, endIndex) => {
                const rowHeight = 5; // Adjust row height
                const fontSize = 10; // Adjust font size
                const boldFont = 400; // Bold font
                const normalFont = getfontstyle; // Default font
                const tableWidth = getTotalTableWidth(); // Calculate total table width
            
                doc.setFontSize(fontSize);
            
                for (let i = startIndex; i < endIndex; i++) {
                    const row = rows[i];
                    let textColor = [0, 0, 0]; // Default text color
                    let fontName = normalFont; // Default font
            
                    // Check if Qnty (column index 6) is negative
                    if (parseFloat(row[7]) < 0) {
                        textColor = [255, 0, 0]; // Set red color for negative Qnty
                    }
            
                    // Draw row borders
                    doc.setDrawColor(0);
                    doc.rect(startX, startY + (i - startIndex + 2) * rowHeight, tableWidth, rowHeight);
            
                    row.forEach((cell, cellIndex) => {
                        const cellY = startY + (i - startIndex + 2) * rowHeight + 3;
                        const cellX = startX + 2;
            
                        // Set text color
                        doc.setTextColor(textColor[0], textColor[1], textColor[2]);
                        // Set font
                        doc.setFont(fontName, "normal");
            
                        // Ensure the cell value is a string
                        const cellValue = String(cell);
            
                        if (cellIndex === 1 || cellIndex === 5 || cellIndex === 6 || cellIndex === 7) {
                            const rightAlignX = startX + columnWidths[cellIndex] - 2;
                            doc.text(cellValue, rightAlignX, cellY, {
                                align: "right",
                                baseline: "middle",
                            });
                        } else {
                            doc.text(cellValue, cellX, cellY, { baseline: "middle" });
                        }
            
                        // Draw column borders (excluding the last column)
                        if (cellIndex < row.length - 1) {
                            doc.rect(startX, startY + (i - startIndex + 2) * rowHeight, columnWidths[cellIndex], rowHeight);
                            startX += columnWidths[cellIndex];
                        }
                    });
            
                    // Draw border for the last column
                    doc.rect(startX, startY + (i - startIndex + 2) * rowHeight, columnWidths[row.length - 1], rowHeight);
                    startX = (doc.internal.pageSize.width - tableWidth) / 2; // Adjusted for center alignment
                }
            
                // Draw line at the bottom of the page with padding
                const lineWidth = tableWidth;
                const lineX = (doc.internal.pageSize.width - tableWidth) / 2;
                const lineY = pageHeight - 15;
                doc.setLineWidth(0.3);
                doc.line(lineX, lineY, lineX + lineWidth, lineY);
                const headingFontSize = 12;
            
                // Add heading "Crystal Solution" aligned left bottom of the line
                const headingX = lineX + 2;
                const headingY = lineY + 5;
                doc.setFontSize(headingFontSize);
                doc.setTextColor(0);
                doc.text(`Crystal Solution \t ${date} \t ${time}`, headingX, headingY);
            };
            
            
            
            
            
          
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
            const rowsPerPage = 27; // Adjust this value based on your requirements
    
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
                    addTitle(comapnyname, 12, 12, pageNumber, startY, 18); // Render company title with default font size, only date, and page number
                    startY += 5; // Adjust vertical position for the company title
    
                    addTitle(`Daily Purchse Report From: ${fromInputDate} To: ${toInputDate}`
                        , "", "", pageNumber, startY, 12); // Render sale report title with decreased font size, provide the time, and page number
                    startY += 5;
    
                    const labelsX = (doc.internal.pageSize.width - totalWidth) / 2;
                    const labelsY = startY + 4; // Position the labels below the titles and above the table
    
                    // Set font size and weight for the labels
                    doc.setFontSize(12);
                    doc.setFont(getfontstyle, "300");
    
                    let status = transectionType === "A"
                        ? "ALL"
                        : transectionType === "BIL"
                            ? "PURCHASE"
                            : transectionType === "PRN"
                                ? "PURCHASE RETURN"
                                : "ALL";
    
    
    
    
                    let typeItem = Companyselectdatavalue.label
                        ? Companyselectdatavalue.label
                        : "ALL";
    
    
                    // let status = transectionType ? transectionType : "All";
                    let search = searchQuery ? searchQuery : "";
    
                    // Set font style, size, and family
                    doc.setFont(getfontstyle, "300"); // Font family and style ('normal', 'bold', 'italic', etc.)
                    doc.setFontSize(10); // Font size
    
                    // doc.text(`COMPANY : ${typeItem}`, labelsX, labelsY); // Adjust x-coordinate for From Date
                    // doc.text(`CAPACITY : ${typeText}`, labelsX + 180, labelsY); // Adjust x-coordinate for From Date
                    // doc.text(`CATEGORY : ${category}`, labelsX, labelsY + 4.3); // Adjust x-coordinate for From Date
    
                    // doc.text(`TYPE : ${typename}`, labelsX + 180, labelsY + 4.3); // Adjust x-coordinate for From Date
                    // doc.text(`STATUS : ${status}`, labelsX, labelsY + 8.5); // Adjust x-coordinate for From Date
                    // doc.text(`SEARCH : ${search}`, labelsX + 180, labelsY + 8.5); // Adjust x-coordinate for From Date
    
                    doc.setFont(getfontstyle, "bold"); // Set font to bold
                    doc.text(`STORE :`, labelsX, labelsY); // Draw bold label
                    doc.setFont(getfontstyle, "normal"); // Reset font to normal
                    doc.text(`${typeItem}`, labelsX + 25, labelsY); // Draw the value next to the label
    
    
                    doc.setFont(getfontstyle, "bold"); // Set font to bold
                    doc.text(`TYPE :`, labelsX, labelsY + 4.3); // Draw bold label
                    doc.setFont(getfontstyle, "normal"); // Reset font to normal
                    doc.text(`${status}`, labelsX + 25, labelsY + 4.3); // Draw the value next to the label
    
                    //    doc.setFont(getfontstyle, "bold"); // Set font to bold
                    //    doc.text(`TYPE :`, labelsX + 180, labelsY + 4.3); // Draw bold label
                    //    doc.setFont(getfontstyle, "normal"); // Reset font to normal
                    //    doc.text(`${typename}`, labelsX + 195, labelsY + 4.3); // Draw the value next to the label
    
                    //    doc.setFont(getfontstyle, "bold"); // Set font to bold
                    //    doc.text(`CAPACITY :`, labelsX, labelsY + 8.5); // Draw bold label
                    //    doc.setFont(getfontstyle, "normal"); // Reset font to normal
                    //    doc.text(`${typeText}`, labelsX + 25, labelsY + 8.5); // Draw the value next to the label
    
                    if (searchQuery) {
                        doc.setFont(getfontstyle, "bold"); // Set font to bold
                        doc.text(`SEARCH :`, labelsX + 180, labelsY + 4.3); // Draw bold label
                        doc.setFont(getfontstyle, "normal"); // Reset font to normal
                        doc.text(`${search}`, labelsX + 200, labelsY + 4.3); // Draw the value next to the label
                    }
    
                    // // Reset font weight to normal if necessary for subsequent text
                    doc.setFont(getfontstyle, "bold"); // Set font to bold
                    doc.setFontSize(10);
    
                    startY += 6; // Adjust vertical position for the labels
    
                    addTableHeaders((doc.internal.pageSize.width - totalWidth) / 2, 35);
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
            doc.save(`DailyPurchaseReport From ${fromInputDate} To ${toInputDate}.pdf`);
        };
  


const handleDownloadCSV = async () => {
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet("Sheet1");

    const numColumns = 6;
    const columnAlignments = ["left", "left", "center","left", "left", "left", "right", "right", "right"];

    worksheet.addRow([]);

    [comapnyname, `Daily Purchase Report From ${fromInputDate} To ${toInputDate}`].forEach((title, index) => {
        let customStyle;
        let rowHeight = 20;
        if (index === 0) {
            customStyle = {
                font: { family: getfontstyle, size: 18, bold: true },
                alignment: { horizontal: "center" },
            };
            rowHeight = 30;
        } else {
            customStyle = {
                font: { family: getfontstyle, size: getdatafontsize, bold: false },
                alignment: { horizontal: "center" },
            };
        }

        worksheet.addRow([title]).eachCell((cell) => (cell.style = customStyle));
        worksheet.getRow(index + 2).height = rowHeight;
        worksheet.mergeCells(`A${index + 2}:${String.fromCharCode(64 + numColumns)}${index + 2}`);
    });

    worksheet.addRow([]);

    let typecategory = Companyselectdatavalue.label ? Companyselectdatavalue.label : "ALL";
    let typestatus = transectionType === "BIL" ? "PURCHASE" : transectionType === "PRN" ? "PURCHASE RETURN" : "ALL";
    let typesearch = searchQuery ? searchQuery : "";

    const typeAndStoreRow2 = worksheet.addRow(["STORE :", typecategory]);
    const typeAndStoreRow3 = worksheet.addRow(
        searchQuery ? ["TYPE :", typestatus, "", "", "", "SEARCH :", typesearch] : ["TYPE :", typestatus, ""]
    );

    const applyStatusRowStyle = (row, boldColumns = []) => {
        row.eachCell((cell, colIndex) => {
            const isBold = boldColumns.includes(colIndex);
            cell.font = {
                family: getfontstyle,
                size: getdatafontsize,
                bold: isBold,
            };
            cell.alignment = {
                horizontal: "left",
                vertical: "middle",
            };
            cell.border = null;
        });
    };

    applyStatusRowStyle(typeAndStoreRow2, [1, 4]);
    applyStatusRowStyle(typeAndStoreRow3, [1, 6]);

    const headerStyle = {
        font: { bold: true, family: getfontstyle, size: getdatafontsize },
        alignment: { horizontal: "center", vertical: "middle" },
        fill: { type: "pattern", pattern: "solid", fgColor: { argb: "FFC6D9F7" } },
        border: { top: { style: "thin" }, left: { style: "thin" }, bottom: { style: "thin" }, right: { style: "thin" } },
    };

    const headers = ["Date", "Trn#", "Type", 'Store',"Description", "Supplier", "Rate", "Qnty", "Amount"];
    const headerRow = worksheet.addRow(headers);

    headerRow.eachCell((cell) => {
        cell.style = { ...headerStyle };
    });

    tableData.forEach((item) => {
        const row = worksheet.addRow([
            item.Date,
            item["Trn #"],
            item.Type,
            item.Str,
            item.Description,
            item.Supplier,
            item.Rate,
            item.Qnty,
            item["Pur Amount"],
        ]);

        const isNegative = item.Qnty < 0;

        row.eachCell((cell, colIndex) => {
            cell.font = {
                family: getfontstyle,
                size: getdatafontsize,
                bold: false,
                color: isNegative ? { argb: "FFFF0000" } : { argb: "FF000000" },
            };

            cell.border = {
                top: { style: "thin", color: { argb: "FF000000" } },
                left: { style: "thin", color: { argb: "FF000000" } },
                bottom: { style: "thin", color: { argb: "FF000000" } },
                right: { style: "thin", color: { argb: "FF000000" } },
            };

            const alignment = columnAlignments[colIndex - 1] || "left";
            cell.alignment = {
                horizontal: alignment,
                vertical: "middle",
            };
        });
    });

    const totalRow = worksheet.addRow(["", "", "",  "", "Total", "", "", String(totalQnty), String(totalAmount)]);

    totalRow.eachCell((cell, colNumber) => {
        cell.font = { bold: true };
        cell.border = {
            top: { style: "thin" },
            left: { style: "thin" },
            bottom: { style: "thin" },
            right: { style: "thin" },
        };

        if (colNumber === 8 || colNumber === 9) {
            cell.alignment = { horizontal: "right" };
        }
    });

    [13, 11, 7,7, 50, 30, 11, 6, 11].forEach((width, index) => {
        worksheet.getColumn(index + 1).width = width;
    });

    const getCurrentDate = () => {
        const today = new Date();
        const dd = String(today.getDate()).padStart(2, "0");
        const mm = String(today.getMonth() + 1).padStart(2, "0");
        const yyyy = today.getFullYear();
        return dd + "/" + mm + "/" + yyyy;
    };

    const currentdate = getCurrentDate();
    const buffer = await workbook.xlsx.writeBuffer();
    const blob = new Blob([buffer], {
        type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    });
    saveAs(blob, `DailyPurchaseReport From ${fromInputDate} To ${toInputDate}.xlsx`);
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
  
    let totalEntries = 0;
  
    const getFilteredTableData = () => {
      let filteredData = tableData;
      if (selectedSearch.trim() !== "") {
        const query = selectedSearch.trim().toLowerCase();
        filteredData = filteredData.filter(
          (data) => data.tusrnam && data.tusrnam.toLowerCase().includes(query)
        );
      }
      return filteredData;
    };
  
    const firstColWidth = {
      width: "8%",
    };
    const secondColWidth = {
      width: "6%",
    };
    const thirdColWidth = {
      width: "4%",
    };
    const ninthColWidth = {
        width: "6%",
      };
    const forthColWidth = {
      width: "27%",
    };
    const fifthColWidth = {
      width: "26%",
    };
    const sixthColWidth = {
      width: "8%",
    };
    const seventhColWidth = {
      width: "5%",
    };
    const eighthColWidth = {
      width: "10%",
    };

    
  
    useHotkeys("s", fetchDailyPurchaseReport);
    useHotkeys("alt+p", exportPDFHandler);
    useHotkeys("alt+e", handleDownloadCSV);
    useHotkeys("esc", () => navigate("/MainPage"));
  
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
      backgroundColor: getcolor,
      width: isSidebarVisible ? "calc(75vw - 0%)" : "75vw",
      position: "relative",
      top: "40%",
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
      maxWidth: "1000px",
      fontSize: "15px",
      fontStyle: "normal",
      fontWeight: "400",
      lineHeight: "23px",
      fontFamily: '"Poppins", sans-serif',
    };
    useEffect(() => {
      document.documentElement.style.setProperty("--background-color", getcolor);
    }, [getcolor]);
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
  
    // Radio Functionality
    const parseDate = (dateString) => {
      const [day, month, year] = dateString.split("-").map(Number);
      return new Date(year, month - 1, day);
    };
  
    const handleRadioChange = (days) => {
      const toDate = parseDate(toInputDate);
      const fromDate = new Date(toDate);
      fromDate.setUTCDate(fromDate.getUTCDate() - days);
  
      setSelectedfromDate(fromDate);
      setfromInputDate(formatDate(fromDate));
      setSelectedRadio(days === 0 ? "custom" : `${days}days`);
    };
  
    useEffect(() => {
      if (selectedRadio === "custom") {
        const currentDate = new Date();
        const firstDateOfCurrentMonth = new Date(
          currentDate.getFullYear(),
          currentDate.getMonth(),
          1
        );
        setSelectedfromDate(firstDateOfCurrentMonth);
        setfromInputDate(formatDate(firstDateOfCurrentMonth));
        setSelectedToDate(currentDate);
        settoInputDate(formatDate(currentDate));
      } else {
        const days = parseInt(selectedRadio.replace("days", ""));
        handleRadioChange(days);
      }
    }, [selectedRadio]);
  
    const [menuStoreIsOpen, setMenuStoreIsOpen] = useState(false);
  
    const focusNextElement = (currentRef, nextRef) => {
      if (currentRef.current && nextRef.current) {
        currentRef.current.focus();
        nextRef.current.focus();
      }
    };
  
    const handleFromDateEnter = (e) => {
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
      if (enteredDate < GlobalfromDate || enteredDate > GlobaltoDate) {
        toast.error(
          `Date must be between ${GlobalfromDate1} and ${GlobaltoDate1}`
        );
        return;
      }
  
      // Update input value and state
      e.target.value = formattedDate;
      setfromInputDate(formattedDate); // Update the state with formatted date
  
      // Move focus to the next element
      focusNextElement(fromRef, toRef);
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
        if (enteredDate < GlobalfromDate || enteredDate > GlobaltoDate) {
          toast.error(
            `Date must be between ${GlobalfromDate1} and ${GlobaltoDate1}`
          );
          return;
        }
  
        // Update input value and state
        e.target.value = formattedDate;
        settoInputDate(formattedDate); // Update the state with formatted date
  
        // Move focus to the next element
        focusNextElement(toRef, storeRef);
      }
    };
  
    const handleStoreEnter = (e) => {
      if (e.key === "Enter" && !menuStoreIsOpen) {
        e.preventDefault();
        focusNextElement(storeRef, typeRef);
      }
    };
  
    const handleTypeEnter = (e) => {
      if (e.key === "Enter") {
        e.preventDefault();
        focusNextElement(typeRef, searchRef);
      }
    };
  
    const handleSearchEnter = (e) => {
      if (e.key === "Enter") {
        e.preventDefault();
        focusNextElement(searchRef, selectButtonRef);
      }
    };
  
    return (
      <>
        <ToastContainer />
        <div style={contentStyle}>
          <div
            style={{
              backgroundColor: getcolor,
              color: fontcolor,
              width: "100%",
              border: `1px solid ${fontcolor}`,
              borderRadius: "9px",
            }}
          >
            <NavComponent textdata="Daily Purchase Report" />
  
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
                {/* From Date */}
                <div
                  className="d-flex align-items-center"
                  // style={{ marginLeft: "20px" }}
                >
                  <div
                    style={{
                      width: "100px",
                      display: "flex",
                      justifyContent: "end",
                    }}
                  >
                    <label htmlFor="fromDatePicker">
                      <span style={{ fontSize: getdatafontsize,fontFamily:getfontstyle, fontWeight: "bold" }}>
                        From :&nbsp;
                      </span>
                    </label>
                  </div>
                  <div
                    id="fromdatevalidation"
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
                      style={{
                        height: "20px",
                        width: "90px",
                        paddingLeft: "5px",
                        outline: "none",
                        border: "none",
                        fontSize: getdatafontsize,fontFamily:getfontstyle,                        backgroundColor: getcolor,
                        color: fontcolor,
                        opacity: selectedRadio === "custom" ? 1 : 0.5,
                        pointerEvents:
                          selectedRadio === "custom" ? "auto" : "none",
                      }}
                      id="frominputid"
                      value={fromInputDate}
                      ref={fromRef}
                      onChange={handlefromInputChange}
                      onKeyDown={handleFromDateEnter}
                      autoComplete="off"
                      placeholder="dd-mm-yyyy"
                      aria-label="Date Input"
                      disabled={selectedRadio !== "custom"}
                    />
                    <DatePicker
                      selected={selectedfromDate}
                      onChange={handlefromDateChange}
                      dateFormat="dd-MM-yyyy"
                      popperPlacement="bottom"
                      showPopperArrow={false}
                      open={fromCalendarOpen}
                      dropdownMode="select"
                      customInput={
                        <div>
                          <BsCalendar
                            onClick={
                              selectedRadio === "custom"
                                ? toggleFromCalendar
                                : undefined
                            }
                            style={{
                              cursor:
                                selectedRadio === "custom"
                                  ? "pointer"
                                  : "default",
                              marginLeft: "18px",
                              fontSize: getdatafontsize,fontFamily:getfontstyle,                              color: fontcolor,
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
  
                {/* To Date */}
                <div className="d-flex align-items-center">
                  <div
                    style={{
                      width: "60px",
                      display: "flex",
                      justifyContent: "end",
                    }}
                  >
                    <label htmlFor="toDatePicker">
                      <span style={{ fontSize: getdatafontsize,fontFamily:getfontstyle, fontWeight: "bold" }}>
                        To :&nbsp;
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
                        fontSize: getdatafontsize,fontFamily:getfontstyle,                        backgroundColor: getcolor,
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
                              fontSize: getdatafontsize,fontFamily:getfontstyle,                              color: fontcolor,
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
  
                {/* radio checks */}
                <div
                  className="d-flex align-items-center"
                  style={{ marginRight: "15px" }}
                >
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "evenly",
                    }}
                  >
                    <div className="d-flex align-items-baseline mx-1">
                      <input
                        type="radio"
                        name="dateRange"
                        id="custom"
                        checked={selectedRadio === "custom"}
                        onChange={() => handleRadioChange(0)}
                        onFocus={(e) =>
                          (e.currentTarget.style.border = "2px solid red")
                        }
                        onBlur={(e) =>
                          (e.currentTarget.style.border = `1px solid ${fontcolor}`)
                        }
                      />
                      &nbsp;
                      <label htmlFor="custom" style={{ fontSize: getdatafontsize,fontFamily:getfontstyle, }}>
                        Custom
                      </label>
                    </div>
                    <div className="d-flex align-items-baseline mx-1">
                      <input
                        type="radio"
                        name="dateRange"
                        id="30"
                        checked={selectedRadio === "30days"}
                        onChange={() => handleRadioChange(30)}
                        onFocus={(e) =>
                          (e.currentTarget.style.border = "2px solid red")
                        }
                        onBlur={(e) =>
                          (e.currentTarget.style.border = `1px solid ${fontcolor}`)
                        }
                      />
                      &nbsp;
                      <label htmlFor="30" style={{ fontSize: getdatafontsize,fontFamily:getfontstyle, }}>
                        30 Days
                      </label>
                    </div>
                    <div className="d-flex align-items-baseline mx-1">
                      <input
                        type="radio"
                        name="dateRange"
                        id="60"
                        checked={selectedRadio === "60days"}
                        onChange={() => handleRadioChange(60)}
                        onFocus={(e) =>
                          (e.currentTarget.style.border = "2px solid red")
                        }
                        onBlur={(e) =>
                          (e.currentTarget.style.border = `1px solid ${fontcolor}`)
                        }
                      />
                      &nbsp;
                      <label htmlFor="60" style={{ fontSize: getdatafontsize,fontFamily:getfontstyle, }}>
                        60 Days
                      </label>
                    </div>
                    <div className="d-flex align-items-baseline mx-1">
                      <input
                        type="radio"
                        name="dateRange"
                        id="90"
                        checked={selectedRadio === "90days"}
                        onChange={() => handleRadioChange(90)}
                        onFocus={(e) =>
                          (e.currentTarget.style.border = "2px solid red")
                        }
                        onBlur={(e) =>
                          (e.currentTarget.style.border = `1px solid ${fontcolor}`)
                        }
                      />
                      &nbsp;
                      <label htmlFor="90" style={{ fontSize: getdatafontsize,fontFamily:getfontstyle, }}>
                        90 Days
                      </label>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            {/* --------2nd row */}
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
                {/* Store Select */}
                <div
                  className="d-flex align-items-center"
                  // style={{ marginRight: "20px" }}
                >
                  <div
                    style={{
                      width: "100px",
                      display: "flex",
                      justifyContent: "end",
                    }}
                  >
                    <label htmlFor="fromDatePicker">
                      <span style={{ fontSize: getdatafontsize,fontFamily:getfontstyle, fontWeight: "bold" }}>
                        Store :&nbsp;
                      </span>{" "}
                      <br />
                    </label>
                  </div>
                  <div>
                    <Select
                      className="List-select-class "
                      ref={storeRef}
                      options={optionStore}
                      onKeyDown={handleStoreEnter}
                      id="selectedsale"
                      onChange={(selectedOption) => {
                        if (selectedOption && selectedOption.value) {
                            const labelPart = selectedOption.label.split("-")[1];

                          setStoreType(selectedOption.value);
                          setCompanyselectdatavalue({
                            value: selectedOption.value,
                            label: labelPart, // Set only the 'NGS' part of the label
                          });

                        } else {
                          setStoreType(""); // Clear the saleType state when selectedOption is null (i.e., when the selection is cleared)
                          setCompanyselectdatavalue('')
                        }
                      }}
                      components={{ Option: DropdownOption }}
                      // styles={customStylesStore}
                      styles={customStylesStore()}
                      isClearable
                      placeholder="ALL"
                      menuIsOpen={menuStoreIsOpen}
                      onMenuOpen={() => setMenuStoreIsOpen(true)}
                      onMenuClose={() => setMenuStoreIsOpen(false)}
                    />
                  </div>
                </div>
  
                <div></div>
              </div>
            </div>
  
            {/* ------------3rd row */}
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
                {/* Type */}
                <div
                  className="d-flex align-items-center"
                  // style={{ marginLeft: "20px" }}
                >
                  <div
                    style={{
                      width: "100px",
                      display: "flex",
                      justifyContent: "end",
                    }}
                  >
                    <label htmlFor="transactionType">
                      <span style={{ fontSize: getdatafontsize,fontFamily:getfontstyle, fontWeight: "bold" }}>
                        Type :&nbsp;
                      </span>
                    </label>
                  </div>
                  <select
                    ref={typeRef}
                    onKeyDown={handleTypeEnter}
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
                      width: "275px",
                      height: "24px",
                      // marginLeft: "15px",
                      backgroundColor: getcolor,
                      border: `1px solid ${fontcolor}`,
                      fontSize: getdatafontsize,fontFamily:getfontstyle,                      color: fontcolor,
                    }}
                  >
                    <option value="">All</option>
                    <option value="BIL">Purchase</option>
                    <option value="PRN">Purchase Return</option>
                  </select>
                </div>
  
                {/* Search */}
                <div
                  className="d-flex align-items-center"
                  style={{ marginRight: "20px" }}
                >
                  <div>
                    <label for="searchInput">
                      <span style={{ fontSize: getdatafontsize,fontFamily:getfontstyle, fontWeight: "bold" }}>
                        Search :&nbsp;
                      </span>
                    </label>
                  </div>
                  <div>
                    <input
                      ref={searchRef}
                      onKeyDown={handleSearchEnter}
                      type="text"
                      id="searchsubmit"
                      placeholder="Item description"
                      value={searchQuery}
                      autoComplete="off"
                      style={{
                        width: "275px",
                        height: "24px",
                        fontSize: getdatafontsize,fontFamily:getfontstyle,                        color: fontcolor,
                        backgroundColor: getcolor,
                        border: `1px solid ${fontcolor}`,
                        outline: "none",
                        paddingLeft: "10px",
                      }}
                      onFocus={(e) =>
                        (e.currentTarget.style.border = "2px solid red")
                      }
                      onBlur={(e) =>
                        (e.currentTarget.style.border = `1px solid ${fontcolor}`)
                      }
                      onChange={(e) => setSearchQuery((e.target.value || "").toUpperCase())}                />

                  </div>
                </div>
              </div>
            </div>
  
            <div>
              {/* Table Head */}
              <div
                style={{
                  overflowY: "auto",
                  width: "98.8%",
                }}
              >
                <table
                  className="myTable"
                  id="table"
                  style={{
                    fontSize: getdatafontsize,fontFamily:getfontstyle,                    width: "100%",
                    position: "relative",
                    // paddingRight: "2%",
                  }}
                >
                  <thead
                    style={{
                        fontSize: getdatafontsize,fontFamily:getfontstyle,
                      fontWeight: "bold",
                      height: "24px",
                      position: "sticky",
                      top: 0,
                      boxShadow: "0 2px 4px rgba(0, 0, 0, 0.2)",
                      backgroundColor: tableHeadColor,
                    }}
                  >
                    <tr
                      style={{
                        backgroundColor: tableHeadColor,
                        color: "white",
                      }}
                    >
                      <td className="border-dark" style={firstColWidth}>
                        Date
                      </td>
                      <td className="border-dark" style={secondColWidth}>
                        Trn#
                      </td>
                      <td className="border-dark" style={thirdColWidth}>
                        Type
                      </td>
                      <td className="border-dark" style={ninthColWidth}>
                        Store
                      </td>
                      <td className="border-dark" style={forthColWidth}>
                        Description
                      </td>
                      <td className="border-dark" style={fifthColWidth}>
                        Supplier
                      </td>
                      <td className="border-dark" style={sixthColWidth}>
                        Rate
                      </td>
                      <td className="border-dark" style={seventhColWidth}>
                        Qnty
                      </td>
                      <td className="border-dark" style={eighthColWidth}>
                        Amount
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
                  maxHeight: "50vh",
                  width: "100%",
                  wordBreak: "break-word",
                }}
              >
                <table
                  className="myTable"
                  id="tableBody"
                  style={{
                    fontSize: getdatafontsize,fontFamily:getfontstyle,                    width: "100%",
                    position: "relative",
                  }}
                >
                  <tbody id="tablebody">
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
                        {Array.from({ length: Math.max(0, 30 - 5) }).map(
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
                          <td style={ninthColWidth}></td>

                          <td style={forthColWidth}></td>
                          <td style={fifthColWidth}></td>
                          <td style={sixthColWidth}></td>
                          <td style={seventhColWidth}></td>
                          <td style={eighthColWidth}></td>
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
                                color:
                                  item["Pur Amount"]?.[0] === "-"
                                    ? "red"
                                    : fontcolor,
                              }}
                            >
                              <td className="text-start" style={firstColWidth}>
                                {item.Date}
                              </td>
                              <td className="text-end" style={secondColWidth}>
                                {item["Trn #"]}
                              </td>
                              <td className="text-center" style={thirdColWidth}>
                                {item.Type}
                              </td>
                              <td className="text-center" style={ninthColWidth}>
                                {item.Str}
                              </td>
                              <td
                                className="text-start"
                                style={forthColWidth}
                                title={item.Description || ""}
                              >
                                {item.Description.length > 30
                                  ? `${item.Description.substring(0, 30)}...`
                                  : item.Description}
                              </td>
                              <td
                                className="text-start"
                                style={fifthColWidth}
                                title={item.Supplier || ""}
                              >
                                {item.Supplier && item.Supplier.length > 30
                                  ? `${item.Supplier.substring(0, 30)}...`
                                  : item.Supplier || " "}
                              </td>
                              <td className="text-end" style={sixthColWidth}>
                                {item.Rate}
                              </td>
                              <td className="text-end" style={seventhColWidth}>
                                {item.Qnty}
                              </td>
                              <td className="text-end" style={eighthColWidth}>
                                {item["Pur Amount"]}
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
                          <td style={ninthColWidth}></td>

                          <td style={forthColWidth}></td>
                          <td style={fifthColWidth}></td>
                          <td style={sixthColWidth}></td>
                          <td style={seventhColWidth}></td>
                          <td style={eighthColWidth}></td>
                        </tr>
                      </>
                    )}
                  </tbody>
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
                paddingRight: "1.3%",
              }}
            >
              <div
                style={{
                  ...firstColWidth,
                  background: getcolor,
                  borderRight: `1px solid ${fontcolor}`,
                }}
              ></div>
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
                  ...ninthColWidth,
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
              >
                <span className="mobileledger_total">{totalQnty}</span>
              </div>
              <div
                style={{
                  ...eighthColWidth,
                  background: getcolor,
                  borderRight: `1px solid ${fontcolor}`,
                }}
              >
                <span className="mobileledger_total">{totalAmount}</span>
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
                style={{ backgroundColor: "#186DB7", width: "120px" }}
                onFocus={(e) => (e.currentTarget.style.border = "2px solid red")}
                onBlur={(e) =>
                  (e.currentTarget.style.border = `1px solid ${fontcolor}`)
                }
              />
              <SingleButton
                text="PDF"
                onClick={exportPDFHandler}
                style={{ backgroundColor: "#186DB7", width: "120px" }}
                onFocus={(e) => (e.currentTarget.style.border = "2px solid red")}
                onBlur={(e) =>
                  (e.currentTarget.style.border = `1px solid ${fontcolor}`)
                }
              />
              <SingleButton
                text="Excel"
                onClick={handleDownloadCSV}
                style={{ backgroundColor: "#186DB7", width: "120px" }}
                onFocus={(e) => (e.currentTarget.style.border = "2px solid red")}
                onBlur={(e) =>
                  (e.currentTarget.style.border = `1px solid ${fontcolor}`)
                }
              />
              <SingleButton
                id="searchsubmit"
                text="Select"
                ref={selectButtonRef}
                onClick={fetchDailyPurchaseReport}
                style={{ backgroundColor: "#186DB7", width: "120px" }}
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