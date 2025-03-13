import React, { useState, useEffect, useRef } from "react";
import { Container, Spinner, Nav } from "react-bootstrap";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import { useTheme } from "../../../../ThemeContext";
import { getUserData, getOrganisationData, getYearDescription, getLocationnumber } from "../../../Auth";
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
// import { fetchGetUser } from "../../Redux/action";
import { fetchGetUser } from "../../../Redux/action";
import { useHotkeys } from "react-hotkeys-hook";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function MobileLedgerJob() {
    const navigate = useNavigate();
    const user = getUserData();
    const organisation = getOrganisationData();

    const saleSelectRef = useRef(null);
    const input1Ref = useRef(null);
    const input2Ref = useRef(null);
    const input3Ref = useRef(null);

    const [mobileNumber, setmobileNumber] = useState("");

    const toRef = useRef(null);
    const fromRef = useRef(null);

    const [saleType, setSaleType] = useState("");
    const [searchQuery, setSearchQuery] = useState("");
    const [transectionType, settransectionType] = useState("");
    const [supplierList, setSupplierList] = useState([]);

    const [totalQnty, setTotalQnty] = useState(0);
    const [totalOpening, setTotalOpening] = useState(0);
    const [totalDebit, setTotalDebit] = useState(0);
    const [totalCredit, setTotalCredit] = useState(0);
    const [closingBalance, setClosingBalance] = useState(0);

    // state for from DatePicker
    const [selectedfromDate, setSelectedfromDate] = useState(null);
    const [fromInputDate, setfromInputDate] = useState("");
    const [fromCalendarOpen, setfromCalendarOpen] = useState(false);
    // state for To DatePicker
    const [selectedToDate, setSelectedToDate] = useState(null);
    const [toInputDate, settoInputDate] = useState("");
    const [toCalendarOpen, settoCalendarOpen] = useState(false);

    const yeardescription = getYearDescription();
    const locationnumber = getLocationnumber();

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

    const [selectedRadio, setSelectedRadio] = useState("custom"); // State to track selected radio button

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

    const handlefromKeyPress = (e, inputId) => {
        if (e.key === "Enter") {
            e.preventDefault();
            const fromDateElement = document.getElementById("fromdatevalidation");
            const formattedInput = fromInputDate.replace(
                /^(\d{2})(\d{2})(\d{4})$/,
                "$1-$2-$3"
            );
            const datePattern = /^(0[1-9]|[12][0-9]|3[01])-(0[1-9]|1[0-2])-\d{4}$/;

            if (formattedInput.length === 10 && datePattern.test(formattedInput)) {
                const [day, month, year] = formattedInput.split("-").map(Number);

                if (month > 12 || month === 0) {
                    toast.error("Please enter a valid month (MM) between 01 and 12");
                    return;
                }

                const daysInMonth = new Date(year, month, 0).getDate();
                if (day > daysInMonth || day === 0) {
                    toast.error(`Please enter a valid day (DD) for month ${month}`);
                    return;
                }

                const currentDate = new Date();
                const enteredDate = new Date(year, month - 1, day);

                if (GlobalfromDate && enteredDate < GlobalfromDate) {
                    toast.error(
                        `Date must be after ${GlobalfromDate1} and before ${GlobaltoDate1}`
                    );
                    return;
                }
                if (GlobalfromDate && enteredDate > GlobaltoDate) {
                    toast.error(
                        `Date must be after ${GlobalfromDate1} and before ${GlobaltoDate1}`
                    );
                    return;
                }

                fromDateElement.style.border = `1px solid ${fontcolor}`;
                setfromInputDate(formattedInput);

                const nextInput = document.getElementById(inputId);
                if (nextInput) {
                    nextInput.focus();
                    nextInput.select();
                } else {
                    document.getElementById("submitButton").click();
                }
            } else {
                toast.error("Date must be in the format dd-mm-yyyy");
            }
        }
    };

    const handleToKeyPress = (e, inputid) => {
        if (e.key === "Enter") {
            e.preventDefault();
            const toDateElement = document.getElementById("todatevalidation");
            const formattedInput = toInputDate.replace(
                /^(\d{2})(\d{2})(\d{4})$/,
                "$1-$2-$3"
            );
            const datePattern = /^(0[1-9]|[12][0-9]|3[01])-(0[1-9]|1[0-2])-\d{4}$/;

            if (formattedInput.length === 10 && datePattern.test(formattedInput)) {
                const [day, month, year] = formattedInput.split("-").map(Number);

                if (month > 12 || month === 0) {
                    toast.error("Please enter a valid month (MM) between 01 and 12");
                    return;
                }

                const daysInMonth = new Date(year, month, 0).getDate();
                if (day > daysInMonth || day === 0) {
                    toast.error(`Please enter a valid day (DD) for month ${month}`);
                    return;
                }

                const currentDate = new Date();
                const enteredDate = new Date(year, month - 1, day);

                if (GlobaltoDate && enteredDate > GlobaltoDate) {
                    toast.error(
                        `Date must be after ${GlobalfromDate1} and before ${GlobaltoDate1}`
                    );
                    return;
                }

                if (GlobaltoDate && enteredDate < GlobalfromDate) {
                    toast.error(
                        `Date must be after ${GlobalfromDate1} and before ${GlobaltoDate1}`
                    );
                    return;
                }

                if (fromInputDate) {
                    const fromDate = new Date(
                        fromInputDate.split("-").reverse().join("-")
                    );
                    if (enteredDate <= fromDate) {
                        toast.error("To date must be after from date");
                        return;
                    }
                }

                toDateElement.style.border = `1px solid ${fontcolor}`;
                settoInputDate(formattedInput);
                const nextinut = inputid.current;
                if (nextinut) {
                    e.preventDefault();
                    nextinut.focus();
                }
            } else {
                toast.error("Date must be in the format dd-mm-yyyy");
            }
        }
    };

    const handleToDateChange = (date) => {
        setSelectedToDate(date);
        settoInputDate(date ? formatDate(date) : "");
        settoCalendarOpen(false);
    };
    const handleToInputChange = (e) => {
        settoInputDate(e.target.value);
    };

    const handleSaleKeypress = (event, inputId) => {
        if (event.key === "Enter") {
            const selectedOption = saleSelectRef.current.state.selectValue;
            if (selectedOption && selectedOption.value) {
                setSaleType(selectedOption.value);
            }
            const nextInput = document.getElementById(inputId);
            if (nextInput) {
                nextInput.focus();
                nextInput.select();
            } else {
                document.getElementById("submitButton").click();
            }
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

    function fetchReceivableReport() {
        
        const mobilenumber = document.getElementById("phone");
        let hasError = false;
        let errorType = "";
        switch (true) {
                case mobileNumber.length !== 11 || !mobileNumber.startsWith("03"):
                errorType = "invalidMobileNumber";
                break;
                      
        }
        switch (errorType) {
                    case "invalidMobileNumber":
                    toast.error("Invalid Mobile Number");
                    mobilenumber.style.border = "2px solid red";
                    return;
          
            default:
                break;
        }

        const apiUrl = apiLinks + "/MobileLedgerJob.php";
        setIsLoading(true);
        const formData = new URLSearchParams({
          
            FMobNum: mobileNumber,
            FSchTxt: searchQuery,
            code: organisation.code,
            FLocCod: locationnumber || getLocationNumber,
            FYerDsc: yeardescription || getYearDescription,
        


        }).toString();

        axios
            .post(apiUrl, formData)
            .then((response) => {
                setIsLoading(false);
                setTotalDebit(response.data["Total "]);
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
        if (!hasComponentMountedPreviously || (input2Ref && input2Ref.current)) {
            if (input2Ref && input2Ref.current) {
                setTimeout(() => {
                    input2Ref.current.focus();
                    // saleSelectRef.current.select();
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
          item.Date,
          item['Job#'],
          item.Customer,
          item.Item,
          item.Technician,
          item.Type,
          item.Status,
          item.Day,

        ]);
    
        // Add summary row to the table
        rows.push([ 
            String(totalDebit), "", "", "", "", "", "", ""
            ]);
    
        // Define table column headers and individual column widths
        const headers = ["Date", "Job#", "Customer", "Item","Technician", "Type", "Status","Day"];
        const columnWidths = [22,15, 40,40,40, 20,20,20];
    
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
          const rowHeight = 5; // Adjust this value to decrease row height
          const fontSize = 10; // Adjust this value to decrease font size
          const boldFont = 400; // Bold font
          const normalFont = getfontstyle; // Default font
          const tableWidth = getTotalTableWidth(); // Calculate total table width
    
          doc.setFontSize(fontSize);
    
          for (let i = startIndex; i < endIndex; i++) {
            const row = rows[i];
            const isOddRow = i % 2 !== 0; // Check if the row index is odd
            const isRedRow = row[0] && parseInt(row[0]) > 10000000000; // Check if tctgcod is greater than 100
            let textColor = [0, 0, 0]; // Default text color
            let fontName = normalFont; // Default font
    
            if (isRedRow) {
              textColor = [255, 0, 0]; // Red color
              fontName = boldFont; // Set bold font for red-colored row
            }
    
            // Set background color for odd-numbered rows
            // if (isOddRow) {
            // 	doc.setFillColor(240); // Light background color
            // 	doc.rect(
            // 		startX,
            // 		startY + (i - startIndex + 2) * rowHeight,
            // 		tableWidth,
            // 		rowHeight,
            // 		"F"
            // 	);
            // }
    
            // Draw row borders
            doc.setDrawColor(0); // Set color for borders
            doc.rect(
              startX,
              startY + (i - startIndex + 2) * rowHeight,
              tableWidth,
              rowHeight
            );
    
            row.forEach((cell, cellIndex) => {
              const cellY = startY + (i - startIndex + 2) * rowHeight + 3;
              const cellX = startX + 2;
    
              // Set text color
              doc.setTextColor(textColor[0], textColor[1], textColor[2]);
              // Set font
              doc.setFont(fontName, "normal");
    
              // Ensure the cell value is a string
              const cellValue = String(cell);
    
              if (cellIndex === 5 || cellIndex === 6) {
                const rightAlignX = startX + columnWidths[cellIndex] / 2; // Adjust for right alignment
                doc.text(cellValue, rightAlignX, cellY, {
                    align: "center",
                    baseline: "middle",
                });
            } else if (cellIndex === 7 ) {
                const rightAlignX = startX + columnWidths[cellIndex] - 2; // Adjust for right alignment
                doc.text(cellValue, rightAlignX, cellY, {
                    align: "right",
                    baseline: "middle",
                });
            } else {
                doc.text(cellValue, cellX, cellY, { baseline: "middle" });
            }
    
              // Draw column borders (excluding the last column)
              if (cellIndex < row.length - 1) {
                doc.rect(
                  startX,
                  startY + (i - startIndex + 2) * rowHeight,
                  columnWidths[cellIndex],
                  rowHeight
                );
                startX += columnWidths[cellIndex];
              }
            });
    
            // Draw border for the last column
            doc.rect(
              startX,
              startY + (i - startIndex + 2) * rowHeight,
              columnWidths[row.length - 1],
              rowHeight
            );
            startX = (doc.internal.pageSize.width - tableWidth) / 2; // Adjusted for center alignment
          }
    
          // Draw line at the bottom of the page with padding
          const lineWidth = tableWidth; // Match line width with table width
          const lineX = (doc.internal.pageSize.width - tableWidth) / 2; // Center line
          const lineY = pageHeight - 15; // Position the line 20 units from the bottom
          doc.setLineWidth(0.3);
          doc.line(lineX, lineY, lineX + lineWidth, lineY); // Draw line
          const headingFontSize = 12; // Adjust as needed
    
          // Add heading "Crystal Solution" aligned left bottom of the line
          const headingX = lineX + 2; // Padding from left
          const headingY = lineY + 5; // Padding from bottom
          doc.setFontSize(headingFontSize); // Set the font size for the heading
          doc.setTextColor(0); // Reset text color to default
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
              rightX - 30,
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
    
            addTitle(`Mobile Ledger Job`, "", "", pageNumber, startY, 12); // Render sale report title with decreased font size, provide the time, and page number
            startY += -5;
    
            const labelsX = (doc.internal.pageSize.width - totalWidth) / 2;
            const labelsY = startY + 4; // Position the labels below the titles and above the table
    
            // Set font size and weight for the labels
            doc.setFontSize(12);
            doc.setFont(getfontstyle, "300");
    
           
            let mobile = mobileNumber ? mobileNumber : "";
            let search = searchQuery ? searchQuery : "";

    
            // Set font style, size, and family
            doc.setFont(getfontstyle, "300"); // Font family and style ('normal', 'bold', 'italic', etc.)
            doc.setFontSize(10); // Font size
    
            doc.setFont(getfontstyle, "bold"); // Set font to bold
            doc.text(`Mobile :`, labelsX, labelsY + 8.5); // Draw bold label
            doc.setFont(getfontstyle, "normal"); // Reset font to normal
            doc.text(`${mobile}`, labelsX + 20, labelsY + 8.5); // Draw the value next to the label
    
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
        doc.save(`MobileLedgerJob As On ${date}.pdf`);
      };

    const handleDownloadCSV = async () => {
          const workbook = new ExcelJS.Workbook();
          const worksheet = workbook.addWorksheet("Sheet1");
        
          const numColumns = 3; // Ensure this matches the actual number of columns
        
          const columnAlignments = ["left","left", "left","left", "left","Center", "Center","right"];
        
          // Define fonts for different sections
          const fontCompanyName = { name: 'CustomFont' || "CustomFont", size: 18, bold: true };
          const fontStoreList = { name: 'CustomFont' || "CustomFont", size: 10, bold: false };
          const fontHeader = { name: 'CustomFont' || "CustomFont", size: 10, bold: true };
          const fontTableContent = { name: 'CustomFont' || "CustomFont", size: 10, bold: false };
        
          // Add an empty row at the start
          worksheet.addRow([]);
        
          // Add company name
          const companyRow = worksheet.addRow([comapnyname]);
          companyRow.eachCell((cell) => {
            cell.font = fontCompanyName;
            cell.alignment = { horizontal: "center" };
          });
        
          worksheet.getRow(companyRow.number).height = 30;
          worksheet.mergeCells(`A${companyRow.number}:${String.fromCharCode(70 + numColumns - 1)}${companyRow.number}`);
        
          // Add Store List row
          const storeListRow = worksheet.addRow(["Mobile Ledger Job"]);
          storeListRow.eachCell((cell) => {
            cell.font = fontStoreList;
            cell.alignment = { horizontal: "center" };
          });
        
          worksheet.mergeCells(`A${storeListRow.number}:${String.fromCharCode(70 + numColumns - 1)}${storeListRow.number}`);
        
          // Add an empty row after the title section
          worksheet.addRow([]);
        
          let typesearch = searchQuery || "";
          let mobiletype = mobileNumber || "";
        
          const typeAndStoreRow3 = worksheet.addRow(
            searchQuery
            ? ["MOBILE :", mobiletype, "SEARCH :", typesearch]
            : ["MOBILE :", mobiletype, ""]    );
        
          // Apply styling for the status row
          typeAndStoreRow3.eachCell((cell, colIndex) => {
            cell.font = { name: 'CustomFont' || "CustomFont", size: 10, bold: [1, 3].includes(colIndex) };
            cell.alignment = { horizontal: "left", vertical: "middle" };
          });
        
          // Header style
          const headerStyle = {
            font: fontHeader,
            alignment: { horizontal: "center", vertical: "middle" },
            fill: { type: "pattern", pattern: "solid", fgColor: { argb: "FFC6D9F7" } },
            border: { top: { style: "thin" }, left: { style: "thin" }, bottom: { style: "thin" }, right: { style: "thin" } },
          };
        
          // Add headers
          const headers = ["Date", "Job#", "Customer", "Item","Technician", "Type", "Status","Day"];
          const headerRow = worksheet.addRow(headers);
          headerRow.eachCell((cell) => Object.assign(cell, headerStyle));
        
          // Add data rows
          tableData.forEach((item) => {
            const row = worksheet.addRow([item.Date,
                item['Job#'],
                item.Customer,
                item.Item,
                item.Technician,
                item.Type,
                item.Status,
                item.Day,]);
        
            row.eachCell((cell, colIndex) => {
              cell.font = fontTableContent;
              cell.border = { top: { style: "thin" }, left: { style: "thin" }, bottom: { style: "thin" }, right: { style: "thin" } };
              cell.alignment = { horizontal: columnAlignments[colIndex - 1] || "left", vertical: "middle" };
            });
          });
        
          // Set column widths
          [10,8, 25,25,25,15,15, 12, ].forEach((width, index) => {
            worksheet.getColumn(index + 1).width = width;
          });

          const totalRow = worksheet.addRow([
            String(totalDebit), "", "", "", "", "", "", ""
        ]);

        // total row added
        totalRow.eachCell((cell, colNumber) => {
            cell.font = { name: 'CustomFont', size: 10, bold: true }; // Apply CustomFont
            cell.border = {
                top: { style: "thin" },
                left: { style: "thin" },
                bottom: { style: "thin" },
                right: { style: "thin" },
            };

            // Align only the "Total" text to the right
            if (

                colNumber === 8
            ) {
                cell.alignment = { horizontal: "right" };
            }
        });

        
          // Get current date
          const getCurrentDate = () => {
            const today = new Date();
            const day = String(today.getDate()).padStart(2, "0");
            const month = String(today.getMonth() + 1).padStart(2, "0");
            const year = today.getFullYear();
            return `${day}-${month}-${year}`;
          };
        
          const currentdate = getCurrentDate();
        
          // Generate and save the Excel file
          const buffer = await workbook.xlsx.writeBuffer();
          const blob = new Blob([buffer], { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" });
          saveAs(blob, `MobileLedgerJob As On ${currentdate}.xlsx`);
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

    const handleMobilePress = (e, nextInputRef) => {
        const fromDateElement = document.getElementById("phone");
        const mobileNumber = e.target.value;
        if (e.key === "Enter") {
            e.preventDefault();
            // Mobile number validation
            if (mobileNumber.length !== 11 || !mobileNumber.startsWith("03")) {
                toast.error("Invalid Mobile Number");
                fromDateElement.style.border = "2px solid red";
                return;
            }
            fromDateElement.style.border = "1px solid black";
            // Move focus to next input if validation passes
            if (nextInputRef.current) {
                nextInputRef.current.focus();
                nextInputRef.current.select();
            }
        }
    };

    const handleMobilenumberInputChange = (e) => {
        setmobileNumber(e.target.value);
    };

    const firstColWidth = {
        width: "12%",
    };
    const secondColWidth = {
        width: "8%",
    };
    const thirdColWidth = {
        width: "16%",
    };
    const forthColWidth = {
        width: "16%",
    };
    const fifthColWidth = {
        width: "16%",
    };
    const sixthColWidth = {
        width: "12%",
    };
    const seventhColWidth = {
        width: "10%",
    };

    const eightColWidth = {
        width: "8.3%",
    };

    useHotkeys("s", fetchReceivableReport);
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
        width: isSidebarVisible ? "calc(50vw - 0%)" : "50vw",
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
        maxWidth: "900px",
        fontSize: "15px",
        fontStyle: "normal",
        fontWeight: "400",
        lineHeight: "23px",
        fontFamily: '"Poppins", sans-serif',
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

    function closeAlert(errorType) {
        const alertElement = document.getElementById("someElementId");
        alertElement.innerHTML = ""; // Clears the alert content

        if (errorType === "mobilevalidation") {
            input2Ref.current.focus(); // Focus back on the input field if the error occurred in the 'from date' input field
        }

        if (errorType === "formvalidation") {
            fromRef.current.select();
        }
        if (errorType === "todatevalidation") {
            toRef.current.select();
        }
    }
    // Bind to window
    window.closeAlert = closeAlert;

    return (
        <>
            <div id="someElementId"></div>
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
                    <NavComponent textdata="Mobile Ledger Job" />
                   

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
                            {/* ------ */}

                            <div className="d-flex align-items-center ">
                                <div
                                    style={{
                                        width: "80px",
                                        display: "flex",
                                        justifyContent: "end",
                                    }}
                                >
                                    <label htmlFor="fromDatePicker">
                                        <span style={{ fontSize: getdatafontsize, fontFamily: getfontstyle, fontWeight: "bold" }}>
                                            Mobile :
                                        </span>{" "}
                                        <br />
                                    </label>
                                </div>

                                <input
                                    ref={input2Ref}
                                    value={mobileNumber}
                                    onKeyDown={(e) => handleMobilePress(e, input1Ref)}
                                    onChange={handleMobilenumberInputChange}
                                    autoComplete="off"
                                    type="tel"
                                    id="phone"
                                    name="phone"
                                    placeholder="0302-1127364"
                                    style={{
                                        color: fontcolor,
                                        width: "200px",
                                        height: "24px",
                                        fontSize: getdatafontsize, fontFamily: getfontstyle, border: `1px solid ${fontcolor}`,
                                        backgroundColor: getcolor,
                                        outline: "none",
                                        paddingLeft: "10px",
                                        marginLeft: "3px",
                                    }}
                                    onFocus={(e) =>
                                        (e.currentTarget.style.border = "2px solid red")
                                    }
                                    onBlur={(e) =>
                                        (e.currentTarget.style.border = `1px solid ${fontcolor}`)
                                    }
                                />
                            </div>

                            <div id="lastDiv" style={{ marginRight: "1px" }}>
                                <label for="searchInput" style={{ marginRight: "4px" }}>
                                    <span style={{ fontSize: getdatafontsize, fontFamily: getfontstyle, fontWeight: "bold" }}>
                                        Search :
                                    </span>{" "}
                                </label>
                                <input
                                    // ref={input2Ref}
                                    onKeyDown={(e) => handleKeyPress(e, input3Ref)}
                                    type="text"
                                    id="searchsubmit"
                                    placeholder="Item description"
                                    value={searchQuery}
                                    ref={input1Ref}
                                    autoComplete="off"
                                    style={{
                                        marginRight: "22px",
                                        width: "150px",
                                        height: "24px",
                                        fontSize: getdatafontsize, fontFamily: getfontstyle, color: fontcolor,
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
                                    onChange={(e) =>
                                        setSearchQuery((e.target.value || "").toUpperCase())

                                    } />
                            </div>
                        </div>
                    </div>

                
                    <div>
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
                                    fontSize: getdatafontsize, fontFamily: getfontstyle, width: "100%",
                                    position: "relative",
                                    paddingRight: "2%",
                                }}
                            >
                                <thead
                                    style={{
                                        fontSize: getdatafontsize, fontFamily: getfontstyle,
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
                                            Job#
                                        </td>
                                        <td className="border-dark" style={thirdColWidth}>
                                            Customer
                                        </td>
                                        <td className="border-dark" style={forthColWidth}>
                                            Item
                                        </td>
                                        <td className="border-dark" style={fifthColWidth}>
                                            Technician
                                        </td>

                                        <td className="border-dark" style={sixthColWidth}>
                                            Type
                                        </td>
                                        <td className="border-dark" style={seventhColWidth}>
                                            Status
                                        </td>
                                        <td className="border-dark" style={eightColWidth}>
                                            Day
                                        </td>
                                    </tr>
                                </thead>
                            </table>
                        </div>
                        <div
                            className="table-scroll"
                            style={{
                                backgroundColor: textColor,
                                borderBottom: `1px solid ${fontcolor}`,
                                overflowY: "auto",
                                maxHeight: "53vh",
                                width: "100%",
                                wordBreak: "break-word",
                            }}
                        >
                            <table
                                className="myTable"
                                id="tableBody"
                                style={{
                                    fontSize: getdatafontsize, fontFamily: getfontstyle, width: "100%",
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
                                                <td colSpan="8" className="text-center">
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
                                                        {Array.from({ length: 8 }).map((_, colIndex) => (
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
                                                        className={
                                                            selectedIndex === i ? "selected-background" : ""
                                                        }
                                                        style={{
                                                            backgroundColor: getcolor,
                                                            color: fontcolor,
                                                        }}
                                                    >
                                                        <td className="text-start" style={firstColWidth}>
                                                            {item.Date}
                                                        </td>
                                                        <td className="text-start" style={secondColWidth}>
                                                            {item["Job#"]}
                                                        </td>
                                                        <td className="text-start" style={thirdColWidth}>
                                                            {item.Customer}
                                                        </td>
                                                        <td className="text-stert" style={forthColWidth}>
                                                            {item.Item}
                                                        </td>
                                                        <td className="text-start" style={fifthColWidth}>
                                                            {item.Technician}
                                                        </td>
                                                        <td className="text-center" style={sixthColWidth}>
                                                            {item.Type}
                                                        </td>
                                                        <td className="text-center" style={seventhColWidth}>
                                                            {item.Status}
                                                        </td>
                                                        <td className="text-end" style={eightColWidth}>
                                                            {item.Day}
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
                                                    {Array.from({ length: 8 }).map((_, colIndex) => (
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
                                                <td style={eightColWidth}></td>
                                            </tr>
                                        </>
                                    )}
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
                            paddingRight: "1.2%",
                            width: "101.2%",
                        }}
                    >
                        <div
                            style={{
                                ...firstColWidth,
                                background: getcolor,
                                borderRight: `1px solid ${fontcolor}`,
                            }}
                        >
                       <span className="mobileledger_total1">{totalDebit}</span>

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
                        >
                        </div>
                        <div
                            style={{
                                ...fifthColWidth,
                                background: getcolor,
                                borderRight: `1px solid ${fontcolor}`,
                            }}
                        >
                        </div>
                        <div
                            style={{
                                ...sixthColWidth,
                                background: getcolor,
                                borderRight: `1px solid ${fontcolor}`,
                            }}
                        >
                        </div>
                        <div
                            style={{
                                ...seventhColWidth,
                                background: getcolor,
                                borderRight: `1px solid ${fontcolor}`,
                            }}
                        >
                        </div>
                        <div
                            style={{
                                ...eightColWidth,
                                background: getcolor,
                                borderRight: `1px solid ${fontcolor}`,
                            }}
                        >
                        </div>
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
                            id="submitButton"
                            text="Select"
                            ref={input3Ref}
                            onClick={fetchReceivableReport}
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
