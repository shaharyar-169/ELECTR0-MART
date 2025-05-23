import React, { useState, useEffect, useRef } from "react";
import { Container, Spinner, Nav } from "react-bootstrap";
import axios from "axios";
import { Link } from "react-router-dom";
import { useTheme } from "../../../../ThemeContext";
import { getUserData, getOrganisationData, getLocationnumber, getYearDescription } from "../../../Auth";
import NavComponent from "../../../MainComponent/Navform/navbarform";
import SingleButton from "../../../MainComponent/Button/SingleButton/SingleButton";
import Select from "react-select";
import { components } from 'react-select';
import { BsCalendar } from 'react-icons/bs';
import DatePicker from "react-datepicker";
import 'react-datepicker/dist/react-datepicker.css';
import jsPDF from "jspdf";
import ExcelJS from "exceljs";
import { saveAs } from "file-saver";
import 'react-calendar/dist/Calendar.css';
import { useSelector, useDispatch } from "react-redux";
import { fetchGetUser } from "../../../Redux/action";
import './ledger.css';
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { color } from "@mui/system";

export default function CustomerProgressLedger() {
    const saleSelectRef = useRef(null);
    const input1Ref = useRef(null);
    const input2Ref = useRef(null);
    const input3Ref = useRef(null);

    // Add this at the top of your component
    const hasInitialized = useRef(false);

    const toRef = useRef(null);
    const fromRef = useRef(null);

    const [saleType, setSaleType] = useState("");

    const [Companyselectdatavalue, setCompanyselectdatavalue] = useState("");
    console.log('Companyselectdatavalue', Companyselectdatavalue)
    const [searchQuery, setSearchQuery] = useState("");
    const currentYear1 = new Date().getFullYear().toString();
    const [transectionType, settransectionType] = useState(currentYear1);

    const [supplierList, setSupplierList] = useState([]);

    const [totalQnty, setTotalQnty] = useState(0);
    const [totalDebit, setTotalDebit] = useState(0);
    const [totalde, settotalde] = useState(0);
    const [closingBalance, setClosingBalance] = useState(0);

    const [amt4, setamt4] = useState(0);
    const [amt5, setamt5] = useState(0);
    const [amt6, setamt6] = useState(0);

    // state for from DatePicker
    const [selectedfromDate, setSelectedfromDate] = useState(null);
    const [fromInputDate, setfromInputDate] = useState("");
    const [fromCalendarOpen, setfromCalendarOpen] = useState(false);
    // state for To DatePicker
    const [selectedToDate, setSelectedToDate] = useState(null);
    const [toInputDate, settoInputDate] = useState("");
    const [toCalendarOpen, settoCalendarOpen] = useState(false);

    //////////////////////// CUSTOM DATE LIMITS ////////////////////////////

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

    console.log("select year: " + getyeardescription);

    useEffect(() => {
        document.documentElement.style.setProperty("--background-color", getcolor);
    }, [getcolor]);

    // Assume getfromdate and gettodate are dynamic and fetched from context or state
    const fromdatevalidate = getfromdate; // e.g., "01-01-2023"
    const todatevaliadete = gettodate; // e.g., "31-12-2023"

    // Function to convert "DD-MM-YYYY" string to Date object
    const convertToDate = (dateString) => {
        const [day, month, year] = dateString.split("-"); // Split string into day, month, year
        return new Date(year, month - 1, day); // Create Date object (Month is zero-indexed)
    };

    // Convert dynamic date strings to Date objects
    const GlobalfromDate = convertToDate(fromdatevalidate); // "01-01-2023" -> Date object
    const GlobaltoDate = convertToDate(todatevaliadete); // "31-12-2023" -> Date object

    // If you want to format the Date object back to 'DD-MM-YYYY' format (optional)
    const formatDate1 = (date) => {
        return `${String(date.getDate()).padStart(2, "0")}-${String(
            date.getMonth() + 1
        ).padStart(2, "0")}-${date.getFullYear()}`;
    };

    // Optionally format the Date objects back to string if needed
    const GlobalfromDate1 = formatDate1(GlobalfromDate); // '01-01-2023'
    const GlobaltoDate1 = formatDate1(GlobaltoDate); // '31-12-2023'

    //////////////////////// CUSTOM DATE LIMITS ////////////////////////////

    // Toggle the ToDATE && FromDATE CalendarOpen state on each click

    const toggleToCalendar = () => {
        settoCalendarOpen((prevOpen) => !prevOpen);
    };
    const formatDate = (date) => {
        const day = date.getDate().toString().padStart(2, "0");
        const month = (date.getMonth() + 1).toString().padStart(2, "0");
        const year = date.getFullYear();
        return `${day}-${month}-${year}`;
    };
    const handleToKeyPress = (e) => {
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
                    alert("Please enter a valid month (MM) between 01 and 12");
                    return;
                }

                const daysInMonth = new Date(year, month, 0).getDate();
                if (day > daysInMonth || day === 0) {
                    alert(`Please enter a valid day (DD) for month ${month}`);
                    return;
                }

                const enteredDate = new Date(year, month - 1, day); // Month is zero-based

                // Convert GlobalfromDate and GlobaltoDate to Date objects for comparison
                // const fromDate = new Date(GlobalfromDate.split('-').reverse().join('-'));
                // const toDate = new Date(GlobaltoDate.split('-').reverse().join('-'));

                if (enteredDate < GlobalfromDate || enteredDate > GlobaltoDate) {
                    toast.error(
                        `Date must be after ${GlobalfromDate1} and before ${GlobaltoDate1}`
                    );
                    return;
                }

                toDateElement.style.border = `1px solid ${fontcolor}`; // Add border color
                settoInputDate(formattedInput);

                if (input1Ref.current) {
                    e.preventDefault();
                    console.log("Selected value:", input1Ref); // Log the select value
                    input1Ref.current.focus(); // Move focus to React Select
                }
            } else {
                toast.error(
                    `Date must be after ${GlobalfromDate1} and before ${GlobaltoDate1}`
                );
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
                setSaleType(selectedOption.value); // Set the selected value only if an option is selected
            }
            const nextInput = document.getElementById(inputId);
            if (nextInput) {
                nextInput.focus(); // Move focus to the next input
                nextInput.select();
            } else {
                document.getElementById("submitButton").click(); // Trigger form submission
            }
        }
    };
    // Function to handle keypress and move focus
    const handleKeyPress = (e, nextInputRef) => {
        if (e.key === "Enter") {
            e.preventDefault(); // Prevent form submission
            if (nextInputRef.current) {
                nextInputRef.current.focus(); // Move focus to next input
            }
        }
    };
    const showAlertMessage = (
        elementId,
        message,
        fromDate,
        toDate,
        fromDateElement,
        errortype
    ) => {
        document.getElementById(elementId).innerHTML = `
            <div class="custom-message">
              <svg class='alert_icon' xmlns="http://www.w3.org/2000/svg" class="bi flex-shrink-0 me-2" width="24" height="24" role="img" aria-label="Danger" fill="currentColor" viewBox="0 0 16 16">
                <path d="M8.982 1.566a1.13 1.13 0 0 0-1.965 0L.165 13.233c-.457.778.091 1.767.982 1.767h13.706c.89 0 1.438-.99.982-1.767L8.982 1.566zm-.982 4.905a.905.905 0 1 1 1.81 0l-.146 3.342a.759.759 0 0 1-1.518 0l-.146-3.342zm.002 6.295a1.057 1.057 0 1 1 2.114 0 1.057 1.057 0 0 1-2.114 0z"/>
              </svg>
              ${message} <span style="font-size: 12px; font-weight: bold;">${fromDate}</span> 
              To <span style="font-size: 12px; font-weight: bold;">${toDate}</span>
              <button class='alert_button' id="close-btn" onclick="closeAlert('${errortype}')" style="cursor: pointer;">
                <i class="bi bi-x cross_icon_styling"></i>
              </button>
            </div>
          `;

        // Focus the button after it is added to the DOM
        setTimeout(() => {
            const closeButton = document.getElementById("close-btn");
            if (closeButton) {
                closeButton.click();
            }
        }, 3000);

        fromDateElement.style.border = "2px solid red"; // Add red border to the input
    };
    function closeAlert(errorType) {
        const alertElement = document.getElementById("someElementId");
        alertElement.innerHTML = ""; // Clears the alert content
        if (errorType === "saleType") {
            saleSelectRef.current.focus();
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

    function fetchGeneralLedger() {
        const fromDateElement = document.getElementById("fromdatevalidation");
        const toDateElement = document.getElementById("todatevalidation");

        const dateRegex = /^\d{2}-\d{2}-\d{4}$/;

        let hasError = false;
        let errorType = "";

        // Handle saleType, fromInputDate, and toInputDate errors first
        switch (true) {
            case !saleType:
                errorType = "saleType";
                break;

            case !toInputDate:
                errorType = "toDate";
                break;
            default:
                hasError = false;
                break;
        }

        // Handle date format validation separately
        if (!dateRegex.test(fromInputDate)) {
            errorType = "fromDateInvalid";
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

            if (enteredToDate < GlobalfromDate || enteredToDate > GlobaltoDate) {
                errorType = "toDateAfterGlobal";
            }
        }

        // Handle errors using a separate switch based on errorType
        switch (errorType) {
            case "saleType":
                toast.error(`Please select a Account Code`);
                hasError = true;
                return customStyles1(hasError);

            case "toDate":
                toast.error(
                    `Date must be after ${GlobalfromDate1} and before ${GlobaltoDate1}`
                );
                return;

            case "toDateAfterGlobal":
                toast.error(
                    `Date must be after ${GlobalfromDate1} and before ${GlobaltoDate1}`
                );
                return;

            default:
                break;
        }
        ////////////////////////////////////////////

        // document.getElementById('fromdatevalidation').style.border = `1px solid ${fontcolor}`;
        document.getElementById(
            "todatevalidation"
        ).style.border = `1px solid ${fontcolor}`;

        const apiUrl = apiLinks + "/CustomerProgress.php";
        setIsLoading(true);
        const formData = new URLSearchParams({
            FRepDat: toInputDate,
            FTrnTyp: transectionType,
            FAccCod: saleType,
            code: organisation.code,
            FLocCod: locationnumber || getLocationNumber,
            FYerDsc: yeardescription || getYearDescription,


        }).toString();

        axios
            .post(apiUrl, formData)
            .then((response) => {
                setIsLoading(false);

                setTotalDebit(response.data["amt001"]);
                settotalde(response.data["amt002"]);
                setClosingBalance(response.data["amt002"]);

                setamt4(response.data["amt001"]);
                setamt5(response.data["amt002"]);
                setamt5(response.data["amt002"]);

                if (response.data && Array.isArray(response.data.Progress)) {
                    setTableData(response.data.Progress);
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
        // If it hasn't mounted before or on refresh, select the 'from date' input
        if (
            !hasComponentMountedPreviously ||
            (saleSelectRef && saleSelectRef.current)
        ) {
            if (saleSelectRef && saleSelectRef.current) {
                setTimeout(() => {
                    saleSelectRef.current.focus(); // Focus on the input field
                    // saleSelectRef.current.select(); // Select the text within the input field
                }, 0);
            }
            sessionStorage.setItem("componentMounted", "true"); // Set the flag indicating mount
            // const storedData = localStorage.getItem('globaldata');

            // if (storedData) {
            //     // Parse the JSON string back to an object
            //     const parsedData = JSON.parse(storedData);
            //     setApiData(parsedData);
            // }
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
        const apiUrl = apiLinks + "/GetActiveCustomer.php";
        const formData = new URLSearchParams({
            FLocCod: getLocationNumber,
            code: organisation.code,
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

    const [isOptionsLoaded, setIsOptionsLoaded] = useState(false);
    useEffect(() => {
        if (supplierList.length > 0) {
            setIsOptionsLoaded(true);
        }
    }, [supplierList]);

    // Transforming fetched data into options array
    const options = supplierList.map((item) => ({
        value: item.tacccod,
        label: `${item.tacccod}-${item.taccdsc.trim()}`,
    }));

    useEffect(() => {
        if (isOptionsLoaded && options.length > 0 && !saleType && !hasInitialized.current) {
            const firstOption = options[0];
            setSaleType(firstOption.value);
            
            const fullLabel = firstOption.label;
            const description = fullLabel.split('-').pop()?.trim();
            
            setCompanyselectdatavalue({
                value: firstOption.value,
                label: description,
                fullLabel: fullLabel
            });
    
            // Mark as initialized
            hasInitialized.current = true;
        }
    }, [isOptionsLoaded, options, saleType]);
    
    

    const DropdownOption = (props) => {
        return (
            <components.Option {...props}>
                <div
                    style={{
                        fontSize: getdatafontsize,
                        fontFamily: getfontstyle,
                        paddingBottom: "5px",
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

    const customStyles1 = (hasError) => ({
        control: (base, state) => ({
            ...base,
            height: "24px",
            minHeight: "unset",
            width: 250,
            fontSize: getdatafontsize,
            fontFamily: getfontstyle,
            backgroundColor: getcolor,
            color: fontcolor,
            caretColor: getcolor === "white" ? "black" : "white", // Change cursor color based on background
            borderRadius: 0,
            border: `1px solid ${fontcolor}`, // Fixed Template Literal
            transition: "border-color 0.15s ease-in-out",
            "&:hover": {
                borderColor: state.isFocused ? base.borderColor : "black",
            },
            padding: "0 8px",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
        }),
        dropdownIndicator: (base) => ({
            ...base,
            padding: 0,
            marginTop: "-5px",
            fontSize: "18px",
            display: "flex",
            textAlign: "center",
        }),
        singleValue: (base) => ({
            ...base,
            marginTop: "-5px",
            textAlign: "left",
            color: fontcolor,
        }),
        input: (base) => ({
            ...base,
            color: getcolor === "white" ? "black" : fontcolor, // Text color based on background
            caretColor: getcolor === "white" ? "black" : "white", // Cursor color based on background
        }),
        clearIndicator: (base) => ({
            ...base,
            marginTop: "-5px",
        }),
    });

 

    const handleTransactionTypeChange = (e) => {
        const selectedYear = e.target.value;
        settransectionType(selectedYear);
        
        // If a year is selected (not the empty "Select" option)
        if (selectedYear) {
            const currentYear = new Date().getFullYear();
            
            if (parseInt(selectedYear) === currentYear) {
                // For current year, set today's date
                const today = new Date();
                const day = String(today.getDate()).padStart(2, '0');
                const month = String(today.getMonth() + 1).padStart(2, '0');
                const formattedDate = `${day}-${month}-${currentYear}`;
                settoInputDate(formattedDate);
            } else {
                // For previous years, set 31st December
                const formattedDate = `31-12-${selectedYear}`;
                settoInputDate(formattedDate);
            }
        }
    };

    const exportPDFHandler = () => {

        const globalfontsize = 12;
        console.log('gobal font data', globalfontsize)

        // Create a new jsPDF instance with landscape orientation
        const doc = new jsPDF({ orientation: "landscape" });

        // Define table data (rows)
        const rows = tableData.map((item) => [
            item["Sr#"],
            item.Month,
            item.Debit,
            item.Credit,
            item.Balance,
        ]);

        // Add summary row to the table

        // Function to ensure fixed width for each value
        const formatColumn = (value, width) => {
            return value.toString().padEnd(width, " "); // Adjusting width using spaces
        };

        // Formatting both values to take 25 characters each
        const formattedTotalde = formatColumn(totalde, 12);
        const formattedClosingBalance = formatColumn(closingBalance, 25);

        // Pushing the row with fixed width concatenated values
        rows.push([
            String(totalDebit),
            `${formattedTotalde} | ${formattedClosingBalance}`, // Ensuring equal width for both
            String(amt4),
            String(amt5),
            String(amt6),
        ]);

        // Define table column headers and individual column widths
        const headers = ["Sr#", "Month", "Debit", "Credit", "Balance"];

        const columnWidths = [15, 40, 35, 35, 35];

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

                    if (cellIndex === 2 || cellIndex === 3 || cellIndex === 4) {
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

            const addTitle = (title, pageNumber, startY, titleFontSize = 18, pageNumberFontSize = 10) => {
                if (!title || typeof title !== "string") {
                    console.error("Invalid title:", title);
                    return;
                }
                if (typeof startY !== "number" || isNaN(startY)) {
                    console.error("Invalid startY value:", startY);
                    return;
                }

                doc.setFontSize(titleFontSize);

                // Get page width
                const pageWidth = doc.internal.pageSize.width;

                // Calculate the text width
                const textWidth = doc.getTextWidth(title);

                // Calculate centered X position
                const centerX = (pageWidth - textWidth) / 2;

                // Draw title at center
                doc.text(title, centerX, startY);

                // Page number placement (right-aligned)
                const rightX = doc.internal.pageSize.width - 10;
                doc.setFontSize(pageNumberFontSize);
                doc.text(`Page ${pageNumber}`, rightX - 60, doc.internal.pageSize.height - 10, { align: "right" });
            };


            let currentPageIndex = 0;
            let startY = paddingTop; // Initialize startY
            let pageNumber = 1; // Initialize page number

            while (currentPageIndex * rowsPerPage < rows.length) {

                addTitle(comapnyname, pageNumber, startY, 18); // Render company title with default font size, only date, and page number
                startY += 5; // Adjust vertical position for the company title

                // addTitle(`Supplier Progress Report From: ${toInputDate}`, "", "", pageNumber, startY, 12); // Render sale report title with decreased font size, provide the time, and page number
                addTitle(`Customer Progress Report From: ${toInputDate}`, pageNumber, startY, 12);
                startY += -5;

                const labelsX = (doc.internal.pageSize.width - totalWidth) / 2;
                const labelsY = startY + 4; // Position the labels below the titles and above the table

                // Set font size and weight for the labels
                doc.setFontSize(12);
                doc.setFont(getfontstyle, "300");

                let status = transectionType ? transectionType : 'ALL'
                let search = Companyselectdatavalue.label
                    ? Companyselectdatavalue.label
                    : "ALL";

                // Set font style, size, and family
                doc.setFont(getfontstyle, "300"); // Font family and style ('normal', 'bold', 'italic', etc.)
                doc.setFontSize(10); // Font size


                doc.setFont(getfontstyle, 'bold'); // Set font to bold
                doc.text(`ACCOUNT :`, labelsX, labelsY + 8.5); // Draw bold label
                doc.setFont(getfontstyle, 'normal'); // Reset font to normal
                doc.text(`${search}`, labelsX + 25, labelsY + 8.5); // Draw the value next to the label


                doc.setFont(getfontstyle, 'bold'); // Set font to bold
                doc.text(`TYPE :`, labelsX + 120, labelsY + 8.5); // Draw bold label
                doc.setFont(getfontstyle, 'normal'); // Reset font to normal
                doc.text(`${status}`, labelsX + 135, labelsY + 8.5); // Draw the value next to the label



                // // Reset font weight to normal if necessary for subsequent text
                doc.setFont(getfontstyle, 'bold'); // Set font to bold
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

        const getCurrentDate1 = () => {
            const today = new Date();
            const dd = String(today.getDate()).padStart(2, "0");
            const mm = String(today.getMonth() + 1).padStart(2, "0"); // January is 0!
            const yyyy = today.getFullYear();
            return dd + "-" + mm + "-" + yyyy;
        };

        const currentdate = getCurrentDate1();

        // Save the PDF files
        doc.save(`CustomerProgressReport As On ${currentdate}.pdf`);


    };


    const handleDownloadCSV = async () => {
        const workbook = new ExcelJS.Workbook();
        const worksheet = workbook.addWorksheet("Sheet1");

        const numColumns = 6; // Number of columns

        const columnAlignments = [
            "center", "left", "right", "right", "right"

        ];

        // Add an empty row at the start
        worksheet.addRow([]);

        // Add title rows



        [comapnyname, `Customer Progress Report From`].forEach((title, index) => {
            // Define custom styles for each title
            let customStyle;
            let rowHeight = 20;  // Default row height
            if (index === 0) {
                // Style for company name
                customStyle = {
                    font: { family: getfontstyle, size: 18, bold: true },
                    alignment: { horizontal: "center" },
                };
                rowHeight = 30; // Increase row height for company name to avoid overlap
            } else {
                // Style for "Item List"
                customStyle = {
                    font: { family: getfontstyle, size: getdatafontsize, bold: false },
                    alignment: { horizontal: "center" },
                };
            }

            // Add row with the title
            worksheet.addRow([title]).eachCell((cell) => (cell.style = customStyle));

            // Adjust the row height for the company name or other titles
            worksheet.getRow(index + 2).height = rowHeight;

            // Merge the cells for the title
            worksheet.mergeCells(
                `A${index + 2}:${String.fromCharCode(64 + numColumns)}${index + 2}`
            );
        });




        // Add an empty row after the title section
        worksheet.addRow([]);  // This is where you add the empty row


        const typestatus = Companyselectdatavalue.label ? Companyselectdatavalue.label : 'ALL'
        const typesearch = transectionType ? transectionType : 'ALL'

        const typeAndStoreRow3 = worksheet.addRow(
            ["ACCOUNT :", typestatus, "", "TYPE :", typesearch]

        );

        const applyStatusRowStyle = (row, boldColumns = []) => {
            row.eachCell((cell, colIndex) => {
                // Check if the current cell is in the boldColumns array
                const isBold = boldColumns.includes(colIndex);

                cell.font = {
                    family: getfontstyle, // Your desired font family
                    size: getdatafontsize, // Your desired font size
                    bold: isBold, // Bold only for specific columns
                };

                cell.alignment = {
                    horizontal: "left", // Align text to the left
                    vertical: "middle", // Vertically align to the middle
                };

                cell.border = null; // Remove borders
            });
        };

        // Bold specific columns (labels)

        applyStatusRowStyle(typeAndStoreRow3, [1, 4]); // Column 1 for "COMPANY:", Column 4 for "CAPACITY:"



        // Header style for center alignment
        const headerStyle = {
            font: { bold: true, family: getfontstyle, size: getdatafontsize },
            alignment: { horizontal: "center", vertical: "middle" }, // Center-align horizontally and vertically
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
        const headers = ["Sr#", "Month", "Debit", "Credit", "Balance"];
        const headerRow = worksheet.addRow(headers);

        // Apply styles and center alignment to the header row
        headerRow.eachCell((cell) => {
            cell.style = { ...headerStyle };
        });

        // Add data rows

        // Add data rows
        tableData.forEach((item) => {
            const row = worksheet.addRow([
                item["Sr#"],
                item.Month,
                item.Debit,
                item.Credit,
                item.Balance,
            ]);

            // Apply custom styles to each cell in the row
            row.eachCell((cell, colIndex) => {
                cell.font = {
                    family: getfontstyle, // Set your desired font family
                    size: getdatafontsize, // Set the font size
                    bold: false, // Make the font bold
                };

                cell.border = {
                    top: { style: "thin", color: { argb: "FF000000" } }, // Top border (black)
                    left: { style: "thin", color: { argb: "FF000000" } }, // Left border (black)
                    bottom: { style: "thin", color: { argb: "FF000000" } }, // Bottom border (black)
                    right: { style: "thin", color: { argb: "FF000000" } }, // Right border (black)
                };

                // Align cell content based on columnAlignments array
                const alignment = columnAlignments[colIndex - 1] || "left"; // Default to 'left' if not defined
                cell.alignment = {
                    horizontal: alignment,
                    vertical: "middle", // Vertically align to the middle
                };
            });
        });

        const separator = "   |   "; // Add spaces for better spacing

        const totalRow = worksheet.addRow([
            totalDebit,
            `${totalde}${separator}${closingBalance}`, // Add spacing
            amt4,
            amt5,
            amt6
        ]);

        // Adjust column width (for the second column where totalde & closingBalance are stored)
        worksheet.getColumn(2).width = 20; // Adjust as needed

        // Apply styles
        totalRow.eachCell((cell, colNumber) => {
            cell.font = { bold: true };
            cell.border = {
                top: { style: "thin" },
                left: { style: "thin" },
                bottom: { style: "thin" },
                right: { style: "thin" },
            };

            // Align text to center for better balance
            if (colNumber === 2) {
                cell.alignment = { horizontal: "center" };
            } else {
                cell.alignment = { horizontal: "right" };
            }
        });



        [11, 25, 15, 15, 15].forEach((width, index) => {
            worksheet.getColumn(index + 1).width = width;
        });

        const getCurrentDate = () => {
            const today = new Date();
            const dd = String(today.getDate()).padStart(2, "0");
            const mm = String(today.getMonth() + 1).padStart(2, "0"); // January is 0!
            const yyyy = today.getFullYear();
            return dd + "-" + mm + "-" + yyyy;
        };

        const currentdate = getCurrentDate();

        // Generate Excel file buffer and save
        const buffer = await workbook.xlsx.writeBuffer();
        const blob = new Blob([buffer], {
            type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        });
        saveAs(blob, `CustomerProgressReport As On ${currentdate}.xlsx`);
    };

    ///////////////////////////////////////////////////////////////////////////

    const dispatch = useDispatch();
    const user = getUserData();
    const organisation = getOrganisationData();
    const tableTopColor = "#3368B5";
    const tableHeadColor = "#3368b5";
    const secondaryColor = "white";
    const btnColor = "#3368B5";
    const textColor = "white";

    const [tableData, setTableData] = useState([]);
    const [selectedSearch, setSelectedSearch] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const { data, loading, error } = useSelector((state) => state.getuser);

    const comapnyname = organisation.description;

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
        width: "10%",
    };
    const secondColWidth = {
        width: "30%",
    };
    const thirdColWidth = {
        width: "20%",
    };
    const forthColWidth = {
        width: "20%",
    };
    const fifthColWidth = {
        width: "20%",
    };

    // Adjust the content width based on sidebar state
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
        // height: "100vh",
        width: isSidebarVisible ? "calc(65vw - 0%)" : "65vw",
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
        maxWidth: "700px",
        fontSize: "15px",
        fontStyle: "normal",
        fontWeight: "400",
        lineHeight: "23px",
        fontFamily: '"Poppins", sans-serif',
    };

    //////////////////////////////////////////// ROW HIGHLIGHT CODE ////////////////////////////////////
    const [isFilterApplied, setIsFilterApplied] = useState(false);
    useEffect(() => {
        if (isFilterApplied || tableData.length > 0) {
            setSelectedIndex(0); // Set the selected index to the first row
            rowRefs.current[0]?.scrollIntoView({
                behavior: "smooth",
                block: "start",
            });
        } else {
            setSelectedIndex(-1); // Reset selected index if no filter applied or filtered data is empty
        }
    }, [tableData, isFilterApplied]);

    let totalEnteries = 0;
    const [selectedRowId, setSelectedRowId] = useState(null); // Track the selected row's tctgcod

    // state initialize for table row highlight
    const [selectedIndex, setSelectedIndex] = useState(-1); // Initialize selectedIndex state
    const rowRefs = useRef([]); // Array of refs for rows
    const handleRowClick = (index) => {
        setSelectedIndex(index);
        // setSelectedRowId(getFilteredTableData[index].tcmpdsc); // Save the selected row's tctgcod
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
        if (selectedIndex === -1 || e.target.id === "searchInput") return; // Return if no row is selected or target is search input
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

        // Cleanup event listener on component unmount
        return () => {
            window.removeEventListener("keydown", handleKeyDown);
        };
    }, [selectedIndex]); // Add selectedIndex as a dependency
    useEffect(() => {
        // Scroll the selected row into view
        if (selectedIndex !== -1 && rowRefs.current[selectedIndex]) {
            rowRefs.current[selectedIndex].scrollIntoView({
                behavior: "smooth",
                block: "nearest",
            });
        }
    }, [selectedIndex]); // Add selectedIndex as a dependency
    //////////////////////////////////////////// ROW HIGHLIGHT CODE //////////////////////////////////////


    const currentYear = new Date().getFullYear();
    const years = Array.from({ length: 5 }, (_, index) => currentYear - index); // Generate current year & last 5 years



    return (
        <>
            {/* <div id="someElementId"></div> */}
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
                    <NavComponent textdata="Customer Progress Ledger" />
                    <div
                        className="row "
                        style={{ height: "20px", marginTop: "6px", marginBottom: "10px" }}
                    >
                        <div
                            style={{
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "space-between",
                                margin: "0px",
                                padding: "0px",
                            }}
                        >
                            <div
                                className="d-flex align-items-center  "
                                style={{ marginRight: "1px" }}
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
                                            Account :
                                        </span>{" "}
                                        <br />
                                    </label>
                                </div>
                                <div style={{ marginLeft: "5px" }}>
                                    <Select
                                        className="List-select-class "
                                        ref={saleSelectRef}
                                        value={options.find(opt => opt.value === saleType) || null} // Ensure correct reference
                                        options={options}
                                        onKeyDown={(e) => handleSaleKeypress(e, "toDatePicker")}
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
                                                setSaleType(""); // Clear the saleType state when selectedOption is null (i.e., when the selection is cleared)
                                                setCompanyselectdatavalue("")
                                            }
                                        }}
                                        components={{ Option: DropdownOption }}
                                        // styles={customStyles1}
                                        styles={customStyles1(!saleType)}
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
                                        width: "60px",
                                        display: "flex",
                                        justifyContent: "end",
                                    }}
                                >
                                    <label htmlFor="fromDatePicker">
                                        <span style={{ fontSize: getdatafontsize, fontFamily: getfontstyle, fontWeight: "bold" }}>
                                            Year :
                                        </span>{" "}
                                        <br />
                                    </label>
                                </div>
                                <select
                                    ref={input1Ref}
                                    onKeyDown={(e) => handleKeyPress(e, input2Ref)}
                                    id="submitButton"
                                    name="type"
                                    value={transectionType}
                                    onChange={handleTransactionTypeChange}

                                    style={{
                                        width: "120px",
                                        height: "24px",
                                        marginLeft: "5px",
                                        textAlign: "center",
                                        backgroundColor: getcolor,
                                        border: `1px solid ${fontcolor}`,
                                        fontSize: getdatafontsize, fontFamily: getfontstyle, textAlign: "left",
                                        marginRight: "1px",
                                        color: fontcolor,
                                    }}
                                >
                                   
                                    {years.map((year) => (
                                        <option key={year} value={year}>
                                            {year}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        </div>
                    </div>

                    <div
                        className="row "
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
                            <div
                                className="d-flex align-items-center"
                                style={{ marginLeft: "7px" }}
                            >
                                <div
                                    style={{
                                        width: "72px",
                                        display: "flex",
                                        justifyContent: "end",
                                    }}
                                >
                                    <label htmlFor="fromDatePicker">
                                        <span style={{ fontSize: getdatafontsize, fontFamily: getfontstyle, fontWeight: "bold" }}>
                                            Date :
                                        </span>{" "}
                                        <br />
                                    </label>
                                </div>
                                <div
                                    id="todatevalidation"
                                    style={{
                                        width: "135px",
                                        border: `1px solid ${fontcolor}`,
                                        display: "flex",
                                        alignItems: "center",
                                        height: " 24px",
                                        justifycontent: "center",
                                        marginLeft: "5px",
                                        background: getcolor,
                                    }}
                                >
                                    <input
                                        ref={toRef}
                                        style={{
                                            height: "20px",
                                            width: "90px",
                                            paddingLeft: "5px",
                                            outline: "none",
                                            alignItems: "center",
                                            // marginTop: '5.5px',
                                            border: "none",
                                            fontSize: getdatafontsize, fontFamily: getfontstyle, backgroundColor: getcolor,
                                            color: fontcolor,
                                        }}
                                        value={toInputDate}
                                        onChange={handleToInputChange}
                                        // onKeyPress={handleToKeyPress}
                                        onKeyDown={(e) => handleToKeyPress(e, "submitButton")}
                                        // onKeyDown={(e) => handleKeyPressBoth(e, 'submitButton')}
                                        id="toDatePicker"
                                        autoComplete="off"
                                        placeholder="dd-mm-yyyy"
                                        aria-label="To Date Input"
                                        aria-describedby="todatepicker"
                                    />
                                    <DatePicker
                                        selected={selectedToDate}
                                        onChange={handleToDateChange}
                                        dateFormat="dd-MM-yyyy"
                                        popperPlacement="bottom"
                                        showPopperArrow={false}
                                        // showMonthDropdown
                                        // showYearDropdown
                                        open={toCalendarOpen}
                                        dropdownMode="select"
                                        customInput={
                                            <div>
                                                <span>
                                                    <BsCalendar
                                                        onClick={toggleToCalendar}
                                                        style={{
                                                            cursor: "pointer",
                                                            alignItems: "center",
                                                            marginLeft: "18px",
                                                            // marginTop: '5px',
                                                            fontSize: getdatafontsize, fontFamily: getfontstyle,
                                                        }}
                                                    />
                                                </span>
                                            </div>
                                        }
                                    />
                                </div>
                            </div>

                            {/* Search Item  */}
                            {/* <div id="lastDiv" style={{ marginRight: "1px" }}>
                                <label for="searchInput" style={{ marginRight: "5px" }}>
                                    <span style={{ fontSize: getdatafontsize, fontFamily: getfontstyle, fontWeight: "bold" }}>
                                        Search :
                                    </span>{" "}
                                </label>
                                <input
                                    ref={input2Ref}
                                    onKeyDown={(e) => handleKeyPress(e, input3Ref)}
                                    // onKeyDown={(e) => handlesearchKeypress(e, 'searchsubmit')}
                                    type="text"
                                    id="searchsubmit"
                                    placeholder="Item description"
                                    value={searchQuery}
                                    autoComplete="off"
                                    style={{
                                        marginRight: "20px",
                                        width: "200px",
                                        height: "24px",
                                        fontSize: getdatafontsize, fontFamily: getfontstyle, color: fontcolor,
                                        backgroundColor: getcolor,
                                        border: `1px solid ${fontcolor}`,
                                        outline: "none",
                                        paddingLeft: "10px",
                                    }}
                                    onChange={(e) =>
                                        setSearchQuery((e.target.value || "").toUpperCase())

                                    } />
                            </div> */}
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
                                            Sr#
                                        </td>
                                        <td className="border-dark" style={secondColWidth}>
                                            Month
                                        </td>
                                        <td className="border-dark" style={thirdColWidth}>
                                            Debit
                                        </td>
                                        <td className="border-dark" style={forthColWidth}>
                                            Credit
                                        </td>
                                        <td className="border-dark" style={fifthColWidth}>
                                            Balance
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
                                maxHeight: "55vh",
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
                                                <td colSpan="5" className="text-center">
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
                                                        {Array.from({ length: 5 }).map((_, colIndex) => (
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
                                            </tr>
                                        </>
                                    ) : (
                                        <>
                                            {tableData.map((item, i) => {
                                                totalEnteries += 1;
                                                return (
                                                    <tr
                                                        key={`${i}-${selectedIndex}`}
                                                        ref={(el) => (rowRefs.current[i] = el)} // Assign ref to each row
                                                        onClick={() => handleRowClick(i)}
                                                        className={
                                                            selectedIndex === i ? "selected-background" : ""
                                                        }
                                                        style={{
                                                            backgroundColor: getcolor,
                                                            color: fontcolor,
                                                        }}
                                                    >
                                                        <td className="text-center" style={firstColWidth}>
                                                            {item["Sr#"]}
                                                        </td>
                                                        <td className="text-start" style={secondColWidth}>
                                                            {item.Month}
                                                        </td>
                                                        <td className="text-end" style={thirdColWidth}>
                                                            {item.Debit}
                                                        </td>
                                                        <td className="text-end" style={forthColWidth}>
                                                            {item.Credit}
                                                        </td>
                                                        <td className="text-end" style={fifthColWidth}>
                                                            {item.Balance}
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
                                                    {Array.from({ length: 5 }).map((_, colIndex) => (
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
                                            </tr>
                                        </>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>

                    <div
                        style={{
                            width: "98.5%",
                            borderBottom: `1px solid ${fontcolor}`,
                            height: "24px",
                            display: "flex",
                        }}
                    >
                        <div
                            style={{
                                ...firstColWidth,
                                background: getcolor,
                                borderRight: `1px solid ${fontcolor}`,
                            }}
                        >
                            <span className="mobileledger_total">{totalDebit}</span>


                        </div>
                        <div
                            style={{ display: 'flex', }}
                        >

                            <div
                                style={{
                                    width: '103px',
                                    background: getcolor,
                                    borderRight: `1px solid ${fontcolor}`,
                                }}
                            >
                                <span className="mobileledger_total">{totalde}</span>


                            </div>

                            <div
                                style={{
                                    width: '103px',
                                    background: getcolor,
                                    borderRight: `1px solid ${fontcolor}`,
                                }}
                            >
                                <span className="mobileledger_total">{closingBalance}</span>


                            </div>


                        </div>
                        <div
                            style={{
                                ...thirdColWidth,
                                background: getcolor,
                                borderRight: `1px solid ${fontcolor}`,
                            }}
                        >
                            <span className="mobileledger_total">{amt4}</span>


                        </div>
                        <div
                            style={{
                                ...forthColWidth,
                                background: getcolor,
                                borderRight: `1px solid ${fontcolor}`,
                            }}
                        >
                            <span className="mobileledger_total">{amt5}</span>

                        </div>
                        <div
                            style={{
                                ...fifthColWidth,
                                background: getcolor,
                                borderRight: `1px solid ${fontcolor}`,
                            }}
                        >
                            <span className="mobileledger_total">{amt6}</span>

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
                        />
                        <SingleButton
                            text="PDF"
                            onClick={exportPDFHandler}
                        />
                        <SingleButton
                            text="EXCEL"
                            onClick={handleDownloadCSV}
                        />
                        <SingleButton
                            id="searchsubmit"
                            text="SELECT"
                            ref={input3Ref}
                            onClick={fetchGeneralLedger}
                        />

                    </div>
                </div>
            </div>
        </>
    );
}




