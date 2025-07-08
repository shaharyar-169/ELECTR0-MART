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
import './daily.css';
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import callAddFont from "../../../../vardana-normal";
import { color } from "@mui/system";

export default function DailyCashBook() {

    const saleSelectRef = useRef(null);
    const input1Ref = useRef(null);
    const input2Ref = useRef(null);
    const input3Ref = useRef(null);

    const toRef = useRef(null);
    const fromRef = useRef(null);

    const [CashBookSummaryData, setCashBookSummaryData] = useState([]);
    const [CashPaymentData, setCashPaymentData] = useState([]);

    console.log('CashPaymentData', CashPaymentData)

    const [saleType, setSaleType] = useState('');
    const [searchQuery, setSearchQuery] = useState('');
    const [transectionType, settransectionType] = useState('');
    const [supplierList, setSupplierList] = useState([])

    const [totalQnty, setTotalQnty] = useState(0);
    const [totalDebit, setTotalDebit] = useState(0);
    const [totalCredit, setTotalCredit] = useState(0);
    const [closingBalance, setClosingBalance] = useState(0);

    // state for from DatePicker
    const [selectedfromDate, setSelectedfromDate] = useState(null);
    const [fromInputDate, setfromInputDate] = useState('');
    const [fromCalendarOpen, setfromCalendarOpen] = useState(false);
    // state for To DatePicker
    const [selectedToDate, setSelectedToDate] = useState(null);
    const [toInputDate, settoInputDate] = useState('');
    const [toCalendarOpen, settoCalendarOpen] = useState(false);

    //////////////////////// CUSTOM DATE LIMITS ////////////////////////////   


    //////////////////////// States for row highlights ///////////
    const [isFilterApplied, setIsFilterApplied] = useState(false);
    const [selectedIndex, setSelectedIndex] = useState(-1);
    const [selectedRowId, setSelectedRowId] = useState(null);
    const rowRefs = useRef([]);
    //////////////////////////////////////////////////////////////  

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
        getdatafontsize,

    } = useTheme();

    console.log('select year: ' + getyeardescription)

    useEffect(() => {
        document.documentElement.style.setProperty("--background-color", getcolor);
    }, [getcolor]);


    // Assume getfromdate and gettodate are dynamic and fetched from context or state
    const fromdatevalidate = getfromdate;  // e.g., "01-01-2023"
    const todatevaliadete = gettodate;    // e.g., "31-12-2023"

    // Function to convert "DD-MM-YYYY" string to Date object
    const convertToDate = (dateString) => {
        const [day, month, year] = dateString.split('-');  // Split string into day, month, year
        return new Date(year, month - 1, day);  // Create Date object (Month is zero-indexed)
    };

    // Convert dynamic date strings to Date objects
    const GlobalfromDate = convertToDate(fromdatevalidate);  // "01-01-2023" -> Date object
    const GlobaltoDate = convertToDate(todatevaliadete);      // "31-12-2023" -> Date object

    // If you want to format the Date object back to 'DD-MM-YYYY' format (optional)
    const formatDate1 = (date) => {
        return `${String(date.getDate()).padStart(2, '0')}-${String(date.getMonth() + 1).padStart(2, '0')}-${date.getFullYear()}`;
    };

    // Optionally format the Date objects back to string if needed
    const GlobalfromDate1 = formatDate1(GlobalfromDate);  // '01-01-2023'
    const GlobaltoDate1 = formatDate1(GlobaltoDate);      // '31-12-2023'




    //////////////////////// CUSTOM DATE LIMITS ////////////////////////////  


    // Toggle the ToDATE && FromDATE CalendarOpen state on each click

    const toggleToCalendar = () => {
        settoCalendarOpen(prevOpen => !prevOpen);
    };
    const formatDate = (date) => {
        const day = date.getDate().toString().padStart(2, '0');
        const month = (date.getMonth() + 1).toString().padStart(2, '0');
        const year = date.getFullYear();
        return `${day}-${month}-${year}`;
    };
    const handleToKeyPress = (e, inputref) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            const toDateElement = document.getElementById('todatevalidation');
            const formattedInput = toInputDate.replace(/^(\d{2})(\d{2})(\d{4})$/, '$1-$2-$3');
            const datePattern = /^(0[1-9]|[12][0-9]|3[01])-(0[1-9]|1[0-2])-\d{4}$/;

            if (formattedInput.length === 10 && datePattern.test(formattedInput)) {
                const [day, month, year] = formattedInput.split('-').map(Number);

                if (month > 12 || month === 0) {
                    alert('Please enter a valid month (MM) between 01 and 12');
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

                if (inputref.current) {
                    e.preventDefault();
                    inputref.current.focus(); // Move focus to React Select
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
        settoInputDate(date ? formatDate(date) : '');
        settoCalendarOpen(false);
    };
    const handleToInputChange = (e) => {
        settoInputDate(e.target.value);
    };
    // Function to handle keypress and move focus
    const handleKeyPress = (e, nextInputRef) => {
        if (e.key === 'Enter') {
            e.preventDefault(); // Prevent form submission
            if (nextInputRef.current) {
                nextInputRef.current.focus(); // Move focus to next input
            }
        }
    };
    function closeAlert(errorType) {

        const alertElement = document.getElementById('someElementId');
        alertElement.innerHTML = ''; // Clears the alert content
        // if (errorType === 'saleType') {
        //     saleSelectRef.current.focus();
        // }
        if (errorType === 'formvalidation') {
            fromRef.current.select();
        }
        if (errorType === 'todatevalidation') {
            toRef.current.select();
        }
    }
    // Bind to window
    window.closeAlert = closeAlert;

    function fetchGeneralLedger() {

        const fromDateElement = document.getElementById('fromdatevalidation');
        const toDateElement = document.getElementById('todatevalidation');

        const dateRegex = /^\d{2}-\d{2}-\d{4}$/;

        let hasError = false;
        let errorType = '';

        // Handle saleType, fromInputDate, and toInputDate errors first
        switch (true) {
            case !saleType:
                errorType = 'saleType';
                break;

            case !toInputDate:
                errorType = 'toDate';
                break;
            default:
                hasError = false;
                break;
        }

        // Handle date format validation separately
        if (!dateRegex.test(fromInputDate)) {
            errorType = 'fromDateInvalid';
        }

        if (!dateRegex.test(toInputDate)) {
            errorType = 'toDateInvalid';
        } else {
            const formattedToInput = toInputDate.replace(/^(\d{2})(\d{2})(\d{4})$/, '$1-$2-$3');
            const [toDay, toMonth, toYear] = formattedToInput.split('-').map(Number);
            const enteredToDate = new Date(toYear, toMonth - 1, toDay);



            if (enteredToDate < GlobalfromDate || enteredToDate > GlobaltoDate) {
                errorType = 'toDateAfterGlobal';
            }
        }


        // Handle errors using a separate switch based on errorType
        switch (errorType) {

            case 'toDate':
                toast.error(
                    `Date must be after ${GlobalfromDate1} and before ${GlobaltoDate1}`
                );
                return;

            case 'toDateAfterGlobal':
                toast.error(
                    `Date must be after ${GlobalfromDate1} and before ${GlobaltoDate1}`
                );
                return;


            default:
                break;
        }
        ////////////////////////////////////////////


        // document.getElementById('fromdatevalidation').style.border = `1px solid ${fontcolor}`;
        document.getElementById('todatevalidation').style.border = `1px solid ${fontcolor}`;



        const apiUrl2 = apiLinks + "/DailyCashBookSummary.php";
        setIsLoading(true);
        const formData2 = new URLSearchParams({
            FTrnDat: toInputDate,
            code: organisation.code,
            FLocCod: locationnumber || getLocationNumber,
            FYerDsc: yeardescription || getyeardescription,

            code: 'MAKKAHCOMP',
            FLocCod: '001',
            FYerDsc: '2025-2025',



        }).toString();

        axios
            .post(apiUrl2, formData2)
            .then((response) => {

                if (response.data && Array.isArray(response.data)) {
                    setCashBookSummaryData(response.data);
                } else {
                    console.warn(
                        "Response data structure is not as expected:",
                        response.data
                    );
                    setCashBookSummaryData([]);
                }
            })
            .catch((error) => {
                console.error("Error:", error);
                setIsLoading(false);
            });



        const apiUrl = apiLinks + "/DailyCashReceipts.php";
        setIsLoading(true);
        const formData = new URLSearchParams({
            FTrnDat: toInputDate,
            code: organisation.code,
            FLocCod: locationnumber || getLocationNumber,
            FYerDsc: yeardescription || getyeardescription,

            code: 'MAKKAHCOMP',
            FLocCod: '001',
            FYerDsc: '2025-2025',

        }).toString();

        axios
            .post(apiUrl, formData)
            .then((response) => {
                setIsLoading(false);

                setTotalDebit(response.data["Total"]);


                if (response.data && Array.isArray(response.data.Receipts)) {
                    setTableData(response.data.Receipts);
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


        const apiUrl3 = apiLinks + "/DailyCashPayments.php";
        setIsLoading(true);
        const formData3 = new URLSearchParams({
            FTrnDat: toInputDate,
            code: organisation.code,
            FLocCod: locationnumber || getLocationNumber,
            FYerDsc: yeardescription || getyeardescription,

            code: 'MAKKAHCOMP',
            FLocCod: '001',
            FYerDsc: '2025-2025',


        }).toString();

        axios
            .post(apiUrl3, formData3)
            .then((response) => {

                setTotalCredit(response.data["Total"]);
                if (response.data && Array.isArray(response.data.Receipts)) {
                    setCashPaymentData(response.data.Receipts);
                } else {
                    console.warn(
                        "Response data structure is not as expected:",
                        response.data
                    );
                    setCashPaymentData([]);
                }
            })
            .catch((error) => {
                console.error("Error:", error);
            });

    }

    useEffect(() => {
        const hasComponentMountedPreviously = sessionStorage.getItem('componentMounted');
        // If it hasn't mounted before or on refresh, select the 'from date' input
        if (!hasComponentMountedPreviously || (toRef && toRef.current)) {
            if (toRef && toRef.current) {
                setTimeout(() => {
                    toRef.current.focus(); // Focus on the input field
                    toRef.current.select(); // Select the text within the input field
                }, 0);
            }
            sessionStorage.setItem('componentMounted', 'true'); // Set the flag indicating mount
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

        const firstDateOfCurrentMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
        setSelectedfromDate(firstDateOfCurrentMonth);
        setfromInputDate(formatDate(firstDateOfCurrentMonth));

    }, []);




    const exportPDFHandler = () => {

        // Create a new jsPDF instance with landscape orientation
        const doc = new jsPDF({ orientation: "landscape" });

        // Define table data (rows)
        const rows = Array.from({ length: Math.max(tableData.length, CashPaymentData.length) }).map((_, index) => {
            // Retrieve corresponding data from both arrays, or fallback to an empty object
            const tableItem = tableData[index] || {};
            const cashPaymentItem = CashPaymentData[index] || {};

            return [
                tableItem['Trn#'] ? `${tableItem['Trn#']} - ${tableItem.Description}` : "", // First column - From tableData
                tableItem.Amount || "", // Second column - From tableData
                cashPaymentItem['Trn#'] ? `${cashPaymentItem['Trn#']} - ${cashPaymentItem.Description}` : "", // Third column - From CashPaymentData
                cashPaymentItem.Amount || "", // Fourth column - From CashPaymentData
            ];
        });


        // // Add summary row to the table
        rows.push([
            "Total",
            String(totalDebit),
            "",
            String(totalCredit),

        ]);





        // Define table column headers and individual column widths
        const headers = [
            "Receipts",
            "Amount",
            "Payments",
            "Amount",

        ];
        const columnWidths = [90, 20, 90, 20];

        // Calculate total table width
        const totalWidth = columnWidths.reduce((acc, width) => acc + width, 0);

        // Define page height and padding
        const pageHeight = doc.internal.pageSize.height;
        const paddingTop = 15;

        // Set font properties for the table
        doc.setFont(getfontstyle);
        doc.setFontSize(11);

        // Function to add table headers
        const addTableHeaders = (startX, startY) => {
            // Set font style and size for headers
            doc.setFont(getfontstyle, "bold"); // Set font to bold
            doc.setFontSize(11); // Set font size for headers

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
            doc.setFontSize(11);
        };

        const addTableRows = (startX, startY, startIndex, endIndex) => {
            const rowHeight = 5; // Adjust this value to decrease row height
            const fontSize = 10; // Adjust this value to decrease font size
            const boldFont = 400; // Bold font
            const normalFont = getfontstyle; // Default font
            const tableWidth = getTotalTableWidth(); // Calculate total table width

            doc.setFontSize(11);

            for (let i = startIndex; i < endIndex; i++) {
                const row = rows[i];
                const isOddRow = i % 2 !== 0; // Check if the row index is odd
                const isRedRow = row[0] && parseInt(row[0]) > 10000000000; // Check if tctgcod is greater than 100
                const isTotalRow = i === rows.length - 1; // Check if this is the total row
                let textColor = [0, 0, 0]; // Default text color
                let fontName = normalFont; // Default font

                if (isRedRow) {
                    textColor = [255, 0, 0]; // Red color
                    fontName = boldFont; // Set bold font for red-colored row
                }

                // For total row, set bold font and prepare for double border
                if (isTotalRow) {
                    doc.setFont(getfontstyle, 'bold');
                }

                // Draw row borders
                doc.setDrawColor(0); // Set color for borders

                // For total row, draw double border
                if (isTotalRow) {
                    // First line of the double border
                    doc.setLineWidth(0.3);
                    doc.rect(
                        startX,
                        startY + (i - startIndex + 2) * rowHeight,
                        tableWidth,
                        rowHeight
                    );

                    // Second line of the double border (slightly offset)
                    doc.setLineWidth(0.3);
                    doc.rect(
                        startX + 0.5,
                        startY + (i - startIndex + 2) * rowHeight + 0.5,
                        tableWidth - 1,
                        rowHeight - 1
                    );
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
                    // For total row, adjust vertical position to center in the double border
                    const cellY = isTotalRow
                        ? startY + (i - startIndex + 2) * rowHeight + rowHeight / 2
                        : startY + (i - startIndex + 2) * rowHeight + 3;

                    const cellX = startX + 2;

                    // Set text color
                    doc.setTextColor(textColor[0], textColor[1], textColor[2]);

                    // For total row, keep bold font
                    if (!isTotalRow) {
                        // Set font
                        doc.setFont(fontName, "normal");
                    }

                    // Ensure the cell value is a string
                    const cellValue = String(cell);

                    if (cellIndex === 1 || cellIndex === 3) {
                        const rightAlignX = startX + columnWidths[cellIndex] - 2; // Adjust for right alignment
                        doc.text(cellValue, rightAlignX, cellY, {
                            align: "right",
                            baseline: "middle", // This centers vertically
                        });
                    } else {
                        // For empty cells in total row, add "Total" label centered
                        if (isTotalRow && cellIndex === 0 && cell === "") {
                            const totalLabelX = startX + columnWidths[0] / 2;
                            doc.text("Total", totalLabelX, cellY, {
                                align: "center",
                                baseline: "middle"
                            });
                        } else {
                            doc.text(cellValue, cellX, cellY, {
                                baseline: "middle" // This centers vertically
                            });
                        }
                    }

                    // Draw column borders (excluding the last column)
                    if (cellIndex < row.length - 1) {
                        if (isTotalRow) {
                            // Double border for total row columns
                            doc.setLineWidth(0.3);
                            doc.rect(
                                startX,
                                startY + (i - startIndex + 2) * rowHeight,
                                columnWidths[cellIndex],
                                rowHeight
                            );
                            doc.setLineWidth(0.3);
                            doc.rect(
                                startX + 0.5,
                                startY + (i - startIndex + 2) * rowHeight + 0.5,
                                columnWidths[cellIndex] - 1,
                                rowHeight - 1
                            );
                        } else {
                            // Normal border for other rows
                            doc.setLineWidth(0.2);
                            doc.rect(
                                startX,
                                startY + (i - startIndex + 2) * rowHeight,
                                columnWidths[cellIndex],
                                rowHeight
                            );
                        }
                        startX += columnWidths[cellIndex];
                    }
                });

                // Draw border for the last column
                if (isTotalRow) {
                    // Double border for total row last column
                    doc.setLineWidth(0.3);
                    doc.rect(
                        startX,
                        startY + (i - startIndex + 2) * rowHeight,
                        columnWidths[row.length - 1],
                        rowHeight
                    );
                    doc.setLineWidth(0.3);
                    doc.rect(
                        startX + 0.5,
                        startY + (i - startIndex + 2) * rowHeight + 0.5,
                        columnWidths[row.length - 1] - 1,
                        rowHeight - 1
                    );
                } else {
                    // Normal border for other rows last column
                    doc.setLineWidth(0.2);
                    doc.rect(
                        startX,
                        startY + (i - startIndex + 2) * rowHeight,
                        columnWidths[row.length - 1],
                        rowHeight
                    );
                }
                startX = (doc.internal.pageSize.width - tableWidth) / 2; // Adjusted for center alignment

                // Reset font after total row
                if (isTotalRow) {
                    doc.setFont(getfontstyle, "normal");
                }
            }

            // Rest of your function remains the same...
            // Draw line at the bottom of the page with padding
            const lineWidth = tableWidth; // Match line width with table width
            const lineX = (doc.internal.pageSize.width - tableWidth) / 2; // Center line
            const lineY = pageHeight - 15; // Position the line 20 units from the bottom
            doc.setLineWidth(0.3);
            doc.line(lineX, lineY, lineX + lineWidth, lineY); // Draw line
            const headingFontSize = 11; // Adjust as needed

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

                addTitle(`Daily Cash Book Report From: ${fromInputDate} `, "", "", pageNumber, startY, 12); // Render sale report title with decreased font size, provide the time, and page number
                startY += -5;

                const labelsX = (doc.internal.pageSize.width - totalWidth) / 2;
                const labelsY = startY + 4; // Position the labels below the titles and above the table

                // Set font size and weight for the labels
                doc.setFontSize(11);
                doc.setFont(getfontstyle, "300");



                let status = CashBookSummaryData.length > 0 ? CashBookSummaryData[0].Opening : null
                let search = CashBookSummaryData.length > 0 ? CashBookSummaryData[0].Closing : null;


                // Set font style, size, and family
                doc.setFont(getfontstyle, "300"); // Font family and style ('normal', 'bold', 'italic', etc.)
                doc.setFontSize(11); // Font size


                const fixedWidth = 20; // Set a fixed width for both rectangles
                const fixedHeight = 5; // Keep height constant
                const rightPadding = 3; // Padding from the right side

                doc.setFont(getfontstyle, 'bold'); // Set font to bold
                doc.text(`OPENING BAL :`, labelsX + 58, labelsY + 8.5); // Draw bold label
                doc.setFont(getfontstyle, 'normal'); // Reset font to normal

                // Draw the value inside the border
                const textWidthStatus = doc.getTextWidth(status); // Get the width of the status text
                const statusX = labelsX + 92 + fixedWidth - textWidthStatus - rightPadding; // Right-align with padding
                const statusY = labelsY + 8.5;

                doc.text(`${status}`, statusX, statusY); // Draw the text

                // Draw a rectangle with fixed width and height
                doc.rect(labelsX + 90, statusY - 3.5, fixedWidth, fixedHeight); // Keep the rectangle in place

                // Positioning for CLOSING BALANCE
                const closingLabelX = labelsX + 172; // Space after OPENING BAL
                doc.setFont(getfontstyle, 'bold');
                doc.text(`CLOSING BAL :`, labelsX + 168, labelsY + 8.5); // Draw bold label
                doc.setFont(getfontstyle, 'normal');

                // Draw the value inside the border
                const textWidthSearch = doc.getTextWidth(search); // Get the width of the search text
                const statusX1 = closingLabelX + 30 + fixedWidth - textWidthSearch - rightPadding; // Right-align with padding
                const statusY1 = labelsY + 8.5;

                doc.text(`${search}`, statusX1, statusY1); // Draw the text

                // Draw a rectangle with fixed width and height
                doc.rect(closingLabelX + 28, statusY1 - 3.5, fixedWidth, fixedHeight); // Keep the rectangle in place



                // // Reset font weight to normal if necessary for subsequent text
                doc.setFont(getfontstyle, 'bold'); // Set font to bold
                doc.setFontSize(11);

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
            const dd = String(today.getDate()).padStart(2, "0"); // Get day and pad with 0 if needed
            const mm = String(today.getMonth() + 1).padStart(2, "0"); // Months are 0-based, so +1
            const yyyy = today.getFullYear(); // Get full year
            return `${dd}-${mm}-${yyyy}`; // Format as dd-mm-yyyy
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
        doc.save(`DailyCashBookReport As on ${date}.pdf`);


    };



    const handleDownloadCSV = async () => {
        const workbook = new ExcelJS.Workbook();
        const worksheet = workbook.addWorksheet("Sheet1");

        const numColumns = 10; // Ensure this matches the actual number of columns

        const columnAlignments = [
            "left",
            "right",
            "left",
            "right",

        ];

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
        worksheet.mergeCells(`A${companyRow.number}:${String.fromCharCode(60 + numColumns - 1)}${companyRow.number}`);

        // Add Store List row
        const storeListRow = worksheet.addRow([`Daily Cash Book As on ${toInputDate}`]);
        storeListRow.eachCell((cell) => {
            cell.font = fontStoreList;
            cell.alignment = { horizontal: "center" };
        });

        worksheet.mergeCells(`A${storeListRow.number}:${String.fromCharCode(60 + numColumns - 1)}${storeListRow.number}`);

        // Add an empty row after the title section
        worksheet.addRow([]);


        let status = CashBookSummaryData.length > 0 ? CashBookSummaryData[0].Opening : null;
        let search = CashBookSummaryData.length > 0 ? CashBookSummaryData[0].Closing : null;

        const typeAndStoreRow3 = worksheet.addRow(["OPENING BAL :", status, "CLOSING BAL :", search]);

        typeAndStoreRow3.eachCell((cell, colIndex) => {
            cell.font = { name: 'CustomFont' || "CustomFont", size: 10, bold: true };
            // Apply right alignment to both labels and values
            cell.alignment = {
                horizontal: "right", // Align everything to the right
                vertical: "middle"
            };
        });

        // Header style
        const headerStyle = {
            font: fontHeader,
            alignment: { horizontal: "center", vertical: "middle" },
            fill: { type: "pattern", pattern: "solid", fgColor: { argb: "FFC6D9F7" } },
            border: { top: { style: "thin" }, left: { style: "thin" }, bottom: { style: "thin" }, right: { style: "thin" } },
        };

        // Add headers
        const headers = [
            "Receipt",
            "Amount",
            "Payments",
            "Amount",
        ];
        const headerRow = worksheet.addRow(headers);
        headerRow.eachCell((cell) => Object.assign(cell, headerStyle));

        // Add data rows
        const maxRows = Math.max(tableData.length, CashPaymentData.length);

        Array.from({ length: maxRows }).forEach((_, index) => {
            // Retrieve corresponding data from both arrays, or fallback to an empty object
            const tableItem = tableData[index] || {};
            const cashPaymentItem = CashPaymentData[index] || {};

            // Add a new row and store the reference
            const row = worksheet.addRow([
                tableItem['Trn#'] ? `${tableItem['Trn#']} - ${tableItem.Description}` : "", // First column - From tableData
                tableItem.Amount || "", // Second column - From tableData
                cashPaymentItem['Trn#'] ? `${cashPaymentItem['Trn#']} - ${cashPaymentItem.Description}` : "", // Third column - From CashPaymentData
                cashPaymentItem.Amount || "", // Fourth column - From CashPaymentData
            ]);

            // Apply custom styles to each cell in the row
            row.eachCell((cell, colIndex) => {
                cell.font = fontTableContent;
                cell.border = { top: { style: "thin" }, left: { style: "thin" }, bottom: { style: "thin" }, right: { style: "thin" } };
                cell.alignment = { horizontal: columnAlignments[colIndex - 1] || "left", vertical: "middle" };
            });
        });



        // Set column widths
        [48, 12, 48, 12].forEach((width, index) => {
            worksheet.getColumn(index + 1).width = width;
        });

        const totalRow = worksheet.addRow([
            "Total",
            totalDebit,
            "",
            totalCredit,
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

                colNumber === 2 || colNumber === 4
            ) {
                cell.alignment = { horizontal: "right" };
            }
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
        const blob = new Blob([buffer], { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" });
        saveAs(blob, `DailyCashBook As on ${toInputDate}.xlsx`);
    };


    const getDayName = (dateString) => {
        const dateParts = dateString.split("-").map(Number); // Split date string into parts (day, month, year)
        const date = new Date(dateParts[2], dateParts[1] - 1, dateParts[0]); // Create Date object
        return date.toLocaleDateString("en-US", { weekday: "long" }); // Get day name
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

    // useEffect(() => {
    //     setTableData(data);
    //     dispatch(fetchGetUser(organisation && organisation.code));
    // }, [dispatch, organisation.code]);


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
        width: "40%",
    };
    const secondColWidth = {
        width: "10%",
    };
    const thirdColWidth = {
        width: "40%",
    };
    const forthColWidth = {
        width: "10%",
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


    //////////////////////////////////////////// ROW HIGHLIGHT CODE ////////////////////////////////////

    // Calculate the maximum number of rows between both datasets
    const maxRows = Math.max(CashPaymentData.length, tableData.length);

    useEffect(() => {
        if (isFilterApplied || maxRows > 0) {
            setSelectedIndex(0);
            rowRefs.current[0]?.scrollIntoView({
                behavior: "smooth",
                block: "start",
            });
        } else {
            setSelectedIndex(-1);
        }
    }, [CashPaymentData, tableData, isFilterApplied]);

    const handleRowClick = (index) => {
        setSelectedIndex(index);
    };

    useEffect(() => {
        if (selectedRowId !== null) {
            const newIndex = tableData.findIndex((item) => item.tcmpcod === selectedRowId);
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
            setSelectedIndex((prevIndex) => Math.min(prevIndex + 1, maxRows - 1));
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

    //////////////////////////////////////////// ROW HIGHLIGHT CODE //////////////////////////////////////



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
                    <NavComponent textdata="Daily Cash Book" />


                    <div className="row " style={{ height: '20px', marginTop: '8px', marginBottom: "8px" }}>
                        <div style={{ width: '97.5%', display: 'flex', alignItems: 'center', margin: '0px', padding: '0px', justifyContent: 'start' }}>

                            {/* To Date */}
                            <div className='d-flex align-items-center' style={{ marginLeft: '7px' }}>
                                <div style={{ width: '72px', display: 'flex', justifyContent: 'end', }}>
                                    <label htmlFor="fromDatePicker"><span style={{ fontSize: getdatafontsize, fontFamily: getfontstyle, fontWeight: 'bold' }}>Date :</span>  <br /></label>
                                </div>
                                <div
                                    id="todatevalidation"
                                    style={{
                                        width: '100px',
                                        border: `1px solid ${fontcolor}`,
                                        display: 'flex',
                                        alignItems: 'center',
                                        height: ' 24px',
                                        justifycontent: 'center',
                                        marginLeft: '5px',
                                        background: getcolor
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
                                            height: '20px',
                                            width: '80px',
                                            paddingLeft: '5px',
                                            outline: 'none',
                                            alignItems: 'center',
                                            // marginTop: '5.5px',
                                            border: 'none',
                                            fontSize: getdatafontsize, fontFamily: getfontstyle, backgroundColor: getcolor,
                                            color: fontcolor

                                        }} value={toInputDate}
                                        onChange={handleToInputChange}
                                        // onKeyPress={handleToKeyPress}
                                        onKeyDown={(e) => handleToKeyPress(e, input3Ref)}
                                        // onKeyDown={(e) => handleKeyPressBoth(e, 'submitButton')}
                                        id="toDatePicker"
                                        autoComplete="off"
                                        placeholder="dd-mm-yyyy"
                                        aria-label="To Date Input"
                                        aria-describedby="todatepicker"
                                    />
                                    <DatePicker
                                        style={{ marginRight: "20px" }}
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
                                                            cursor: 'pointer',
                                                            alignItems: 'center',
                                                            // marginLeft: '18px',
                                                            // marginTop: '5px',
                                                            fontSize: getdatafontsize, fontFamily: getfontstyle,
                                                        }} />
                                                </span>
                                            </div>
                                        }
                                    />
                                </div>
                            </div>

                            {/* box for selected date name  */}

                            <div
                                style={{
                                    marginLeft: '5px',
                                    width: '90px',
                                    height: '24px',
                                    fontSize: getdatafontsize, fontFamily: getfontstyle,
                                    color: fontcolor,
                                    backgroundColor: getcolor,
                                    border: `1px solid ${fontcolor}`,

                                }}
                            >
                                <span style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }} className="mobileledger_total">{getDayName(toInputDate)}</span>
                            </div>

                            {/* Opening Balance  */}
                            <div style={{ display: 'flex', marginLeft: '27px' }}>
                                <div style={{ width: '100px' }}>
                                    <label for="searchInput" ><span style={{ fontSize: getdatafontsize, fontFamily: getfontstyle, fontWeight: 'bold' }}>Opening Bal :</span> </label>
                                </div>
                                <div
                                    style={{
                                        width: '100px',
                                        height: '24px',
                                        fontSize: getdatafontsize, fontFamily: getfontstyle, color: fontcolor,
                                        backgroundColor: getcolor,
                                        border: `1px solid ${fontcolor}`,
                                    }}
                                >
                                    <span className="mobileledger_total">{CashBookSummaryData.length > 0 ? CashBookSummaryData[0].Opening : null}</span>
                                </div>
                            </div>

                            {/* Closing Balance  */}
                            <div style={{ display: 'flex', marginLeft: '295px' }}>
                                <div style={{ width: '95px' }}>
                                    <label for="searchInput" ><span style={{ fontSize: getdatafontsize, fontFamily: getfontstyle, fontWeight: 'bold' }}>Closing Bal :</span> </label>
                                </div>
                                <div
                                    style={{
                                        width: '100px',
                                        height: '24px',
                                        fontSize: getdatafontsize, fontFamily: getfontstyle, color: fontcolor,
                                        backgroundColor: getcolor,
                                        border: `1px solid ${fontcolor}`,

                                    }}
                                >
                                    <span className="mobileledger_total">{CashBookSummaryData.length > 0 ? CashBookSummaryData[0].Closing : null}</span>
                                </div>
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
                                            color: 'white'
                                        }}
                                    >
                                        <td className="border-dark" style={firstColWidth}>
                                            Receipts
                                        </td>
                                        <td className="border-dark" style={secondColWidth}>
                                            Amount
                                        </td>
                                        <td className="border-dark" style={thirdColWidth}>
                                            Payments
                                        </td>
                                        <td className="border-dark" style={forthColWidth}>
                                            Amount
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
                                <tbody id="tablebody" >
                                    {isLoading ? (
                                        <>
                                            <tr
                                                style={{
                                                    backgroundColor: getcolor
                                                }}
                                            >
                                                <td colSpan="4" className="text-center">
                                                    <Spinner animation="border" variant="primary" />
                                                </td>
                                            </tr>
                                            {Array.from({ length: Math.max(0, 30 - 5) }).map(
                                                (_, rowIndex) => (
                                                    <tr key={`blank-${rowIndex}`}
                                                        style={{
                                                            backgroundColor: getcolor,
                                                            color: fontcolor,
                                                        }}
                                                    >
                                                        {Array.from({ length: 4 }).map((_, colIndex) => (
                                                            <td key={`blank-${rowIndex}-${colIndex}`}
                                                            >
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

                                            </tr>
                                        </>
                                    ) : (
                                        <>


                                            {Array.from({ length: Math.max(tableData.length, CashPaymentData.length) }).map((_, i) => {
                                                // totalEnteries += 1;

                                                // Get corresponding data from both arrays, or fallback to an empty object
                                                const tableItem = tableData[i] || {};
                                                const cashPaymentItem = CashPaymentData[i] || {};

                                                return (
                                                    <tr
                                                        key={`${i}-${selectedIndex}`}
                                                        ref={(el) => (rowRefs.current[i] = el)} // Assign ref to each row
                                                        onClick={() => handleRowClick(i)}
                                                        className={selectedIndex === i ? "selected-background" : ""}
                                                        style={{
                                                            backgroundColor: getcolor,
                                                            color: fontcolor,
                                                        }}

                                                    >
                                                        {/* First Column - From tableData if available */}
                                                        <td className="text-start" style={firstColWidth}>
                                                            {tableItem['Trn#'] ? `${tableItem['Trn#']}- ${tableItem.Description}` : ""}
                                                        </td>

                                                        {/* Second Column - From tableData if available */}
                                                        <td className="text-end" style={secondColWidth}>
                                                            {tableItem.Amount || ""}
                                                        </td>

                                                        {/* Third Column - From CashPaymentData if available */}
                                                        <td className="text-start" style={thirdColWidth}>
                                                            {cashPaymentItem['Trn#'] ? `${cashPaymentItem['Trn#']}-${cashPaymentItem.Description}` : ""}
                                                        </td>

                                                        {/* Fourth Column - From CashPaymentData if available */}
                                                        <td className="text-end" style={forthColWidth}>
                                                            {cashPaymentItem.Amount || ""}
                                                        </td>
                                                    </tr>
                                                );
                                            })}

                                            {/* Fill blank rows if needed */}
                                            {Array.from({ length: Math.max(0, 27 - Math.max(tableData.length, CashPaymentData.length)) }).map((_, rowIndex) => (
                                                <tr key={`blank-${rowIndex}`}
                                                    style={{
                                                        backgroundColor: getcolor,
                                                        color: fontcolor,
                                                    }}
                                                >
                                                    {Array.from({ length: 4 }).map((_, colIndex) => (
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



                                            </tr>
                                        </>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>

                    <div style={{ width: '98.8%', borderTop: `1px solid ${fontcolor}`, borderBottom: `1px solid ${fontcolor}`, height: '24px', display: 'flex' }}>

                        <div style={{ ...firstColWidth, background: getcolor, borderRight: `1px solid ${fontcolor}` }}></div>
                        <div style={{ ...secondColWidth, background: getcolor, borderRight: `1px solid ${fontcolor}` }}>
                            <span className="mobileledger_total">{totalDebit}</span>

                        </div>
                        <div style={{ ...thirdColWidth, background: getcolor, borderRight: `1px solid ${fontcolor}` }}>

                        </div>
                        <div style={{ ...forthColWidth, background: getcolor, borderRight: `1px solid ${fontcolor}` }}>
                            <span className="mobileledger_total">{totalCredit}</span>

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
                        />
                        <SingleButton
                            text="PDF"
                            onClick={exportPDFHandler}
                            style={{ backgroundColor: "#186DB7", width: "120px" }}
                        />
                        <SingleButton
                            text="EXCEL"
                            onClick={handleDownloadCSV}
                            style={{ backgroundColor: "#186DB7", width: "120px" }}
                        />
                        <SingleButton
                            id="searchsubmit"
                            text="SELECT"
                            ref={input3Ref}
                            onClick={fetchGeneralLedger}
                            style={{ backgroundColor: "#186DB7", width: "120px" }}
                        />


                    </div>
                </div>
            </div>
        </>
    );
}




