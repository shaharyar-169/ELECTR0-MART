import React, { useState, useEffect, useRef } from "react";
import { Container, Spinner, Nav } from "react-bootstrap";
import axios from "axios";
import { Link } from "react-router-dom";
import { useTheme } from "../../../../ThemeContext";
import { getUserData, getOrganisationData } from "../../../Auth";
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

export default function DailyCashReceipts() {


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
        gettodate

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
            code: 'NASIRTRD',
            // code: organisation.code,
            // FYerDsc: getyeardescription,
            FYerDsc: '2024-2024',
            // FLocCod: getLocationNumber,
            FLocCod: '001',

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
            code: 'NASIRTRD',
            // code: organisation.code,
            // FYerDsc: getyeardescription,
            FYerDsc: '2024-2024',
            // FLocCod: getLocationNumber,
            FLocCod: '001',

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
            code: 'NASIRTRD',
            // code: organisation.code,
            // FYerDsc: getyeardescription,
            FYerDsc: '2024-2024',
            // FLocCod: getLocationNumber,
            FLocCod: '001',

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

    useEffect(() => {

        const apiUrl = apiLinks + "/GetActiveSupplier.php"
        const formData = new URLSearchParams({
            FLocCod: getLocationNumber,
            code: organisation.code,
        }).toString();
        axios
            .post(apiUrl, formData)
            .then(response => {
                setSupplierList(response.data);

            })
            .catch(error => {
                console.error('Error fetching data:', error);
            });
    }, []);

    // Transforming fetched data into options array
    const options = supplierList.map(item => ({
        value: item.tacccod,
        label: `${item.tacccod}-${item.taccdsc.trim()}`
    }));

    const DropdownOption = (props) => {
        return (
            <components.Option {...props}>
                <div style={{
                    fontSize: '12px',
                    paddingBottom: '5px',
                    lineHeight: '3px',
                    color: 'black',
                    textAlign: 'start',

                }}>
                    {props.data.label}
                </div>
            </components.Option>
        );
    };
    const customStyles1 = (hasError) => ({
        control: (base, state) => ({
            ...base,
            height: '24px',
            minHeight: 'unset',
            width: 418,
            fontSize: '12px',
            backgroundColor: getcolor,
            color: fontcolor,
            borderRadius: 0,
            border: hasError ? '2px solid red' : `1px solid ${fontcolor}`, // Conditionally change border color
            transition: 'border-color 0.15s ease-in-out',
            '&:hover': {
                borderColor: state.isFocused ? base.borderColor : 'black',
            },
            padding: '0 8px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',

        }),
        dropdownIndicator: base => ({
            ...base,
            padding: 0,
            fontSize: '18px',
            display: 'flex',
            textAlign: 'center !important',
        }),
    });

    const handleTransactionTypeChange = (event) => {
        const selectedTransactionType = event.target.value;
        settransectionType(selectedTransactionType);
    };

    const exportPDFHandler = () => {
        // Create a new jsPDF instance with landscape orientation
        const doc = new jsPDF({ orientation: "portrait" });

        // Define table data (rows)
        const rows = CashPaymentData.map((cashPaymentItem, index) => {
            // Retrieve corresponding data from tableData
            const tableItem = tableData[index] || {}; // Fallback to an empty object if index doesn't exist
        
            return [
                tableItem['Trn#'] ? `${tableItem['Trn#']} - ${tableItem.Description}` : "", // First column - From tableData
                tableItem.Amount || "", // Second column - From tableData
                cashPaymentItem['Trn#'] ? `${cashPaymentItem['Trn#']} - ${cashPaymentItem.Description}` : "", // Third column - From CashPaymentData
                cashPaymentItem.Amount || "", // Fourth column - From CashPaymentData
            ];
        });
        

        // Add summary row to the table
        rows.push([
            "",
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
        const columnWidths = [80, 17,80,17];

        // Calculate total table width
        const totalWidth = columnWidths.reduce((acc, width) => acc + width, 0);

        // Define page height and padding
        const pageHeight = doc.internal.pageSize.height;
        const paddingTop = 15;

        // Set font properties for the table
        doc.setFont("verdana");
        doc.setFontSize(10);

        // Function to add table headers
        const addTableHeaders = (startX, startY) => {
            // Set font style and size for headers
            doc.setFont("vardana", "bold"); // Set font to bold
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

            // Reset font style and size after adding headers
            doc.setFont("verdana");
            doc.setFontSize(10);
        };

        const addTableRows = (startX, startY, startIndex, endIndex) => {
            const rowHeight = 5; // Adjust this value to decrease row height
            const fontSize = 8; // Adjust this value to decrease font size
            const boldFont = "verdana"; // Bold font
            const normalFont = "verdana"; // Default font
            const tableWidth = getTotalTableWidth(); // Calculate total table width

            doc.setFontSize(fontSize);

            for (let i = startIndex; i < endIndex; i++) {
                const row = rows[i];
                const isOddRow = i % 2 !== 0; // Check if the row index is odd
                const isRedRow = row[0] && parseInt(row[0]) > 10000000; // Check if tctgcod is greater than 100
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

                   
                    if (cellIndex === 1 || cellIndex === 3 ) {
                        const rightAlignX = startX + columnWidths[cellIndex] - 2; // Adjust for right alignment
                        doc.text(cellValue, rightAlignX, cellY, {
                            align: "right",
                            baseline: "middle",
                        });
                    }

                    else {
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
        const rowsPerPage = 46; // Adjust this value based on your requirements

        // Function to handle pagination
        const handlePagination = () => {
            // Define the addTitle function
            const addTitle = (
                title,
                date,
                time,
                pageNumber,
                startY,
                titleFontSize = 16,
                dateTimeFontSize = 8,
                pageNumberFontSize = 8
            ) => {
                doc.setFontSize(titleFontSize); // Set the font size for the title
                doc.text(title, doc.internal.pageSize.width / 2, startY, {
                    align: "center",
                });

                // Calculate the x-coordinate for the right corner
                const rightX = doc.internal.pageSize.width - 10;

                if (date) {
                    doc.setFontSize(dateTimeFontSize); // Set the font size for the date and time
                    if (time) {
                        doc.text(date + " " + time, rightX, startY, { align: "right" });
                    } else {
                        doc.text(date, rightX - 10, startY, { align: "right" });
                    }
                }

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
                addTitle(
                    comapnyname,
                    "",
                    "",
                    pageNumber,
                    startY,
                    20,
                    10
                ); // Render company title with default font size, only date, and page number
                startY += 7; // Adjust vertical position for the company title
                
                addTitle(
                    `Daily Cash Book Report From: ${fromInputDate} `,
                    "",
                    "",
                    pageNumber,
                    startY,
                    14
                ); // Render sale report title with decreased font size, provide the time, and page number
                startY += 13;

                const labelsX = (doc.internal.pageSize.width - totalWidth) / 2;
                const labelsY = startY + 2; // Position the labels below the titles and above the table

                // Set font size and weight for the labels
                doc.setFontSize(10);
                doc.setFont("verdana", 'bold');

                let typeText = CashBookSummaryData.length > 0 ? CashBookSummaryData[0].Closing : null ? CashBookSummaryData.length > 0 ? CashBookSummaryData[0].Closing : null : "";
                let typeItem = CashBookSummaryData.length > 0 ? CashBookSummaryData[0].Opening : null ? CashBookSummaryData.length > 0 ? CashBookSummaryData[0].Opening : null : "";

                doc.text(`Opening Bal : ${typeItem}`, labelsX, labelsY); // Adjust x-coordinate for From Date
                doc.text(`Closing Bal : ${typeText}`, labelsX + 165, labelsY); // Adjust x-coordinate for From Date

                // Reset font weight to normal if necessary for subsequent text
                doc.setFont("verdana", "normal");

                startY += 0; // Adjust vertical position for the labels

                addTableHeaders((doc.internal.pageSize.width - totalWidth) / 2, 39);
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

        // Save the PDF file
        doc.save("DailyCashBookReport.pdf");

        const pdfBlob = doc.output("blob");
        const pdfFile = new File([pdfBlob], "table_data.pdf", {
            type: "application/pdf",
        });
        // setPdfFile(pdfFile);
        // setShowMailModal(true); // Show the mail modal after downloading PDF
    };

    const handleDownloadCSV = async () => {
        const workbook = new ExcelJS.Workbook();
        const worksheet = workbook.addWorksheet("Sheet1");

        const numColumns = 5; // Number of columns

        // Common styles
        const titleStyle = {
            font: { bold: true, size: 12 },
            alignment: { horizontal: "center" },
        };

        const columnAlignments = ["left", "right","left", "right"];

        // Add an empty row at the start
        worksheet.addRow([]);

               // Add title rows
         [
            comapnyname,
            `Daily Cash Book From ${toInputDate}`,
        ].forEach((title, index) => {
            worksheet.addRow([title]).eachCell((cell) => (cell.style = titleStyle));
            worksheet.mergeCells(
                `A${index + 2}:${String.fromCharCode(64 + numColumns)}${index + 2}`
            );
        });


        worksheet.addRow([]); // Empty row for spacing

        // let typeYear = transectionType ? transectionType : "All";
        // let typeCode = saleType ? saleType : "All";

        // Add type and store row and bold it
        const typeAndStoreRow = worksheet.addRow([
            // "",
            // `Code: ${typeCode}`,
            // "",
            // "",
            // "",
            // `Year: ${typeYear}`,
        ]);

        typeAndStoreRow.eachCell((cell) => {
            cell.font = { bold: true };
        });

        worksheet.addRow([]); // Empty row for spacing

        const headerStyle = {
            font: { bold: true },
            alignment: { horizontal: "center" }, // Keep headers centered
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
            "Receipt",
            "Amount",
            "Payments",
            "Amount",
        ];
        const headerRow = worksheet.addRow(headers);
        headerRow.eachCell((cell) => {
            cell.style = { ...headerStyle, alignment: { horizontal: "center" } };
        });


        // Add data rows
        CashPaymentData.forEach((cashPaymentItem, index) => {
            // Retrieve corresponding data from tableData
            const tableItem = tableData[index] || {}; // Fallback to an empty object if index doesn't exist

            worksheet.addRow([
                tableItem['Trn#'] ? `${tableItem['Trn#']} - ${tableItem.Description}` : "", // First column - From tableData
                tableItem.Amount || "", // Second column - From tableData
                cashPaymentItem['Trn#'] ? `${cashPaymentItem['Trn#']} - ${cashPaymentItem.Description}` : "", // Third column - From CashPaymentData
                cashPaymentItem.Amount || "", // Fourth column - From CashPaymentData
           
            ]);
        });


         // Add total row and bold it
         const totalRow = worksheet.addRow([
            "",
            totalDebit,
            "",
            totalCredit,
           
        ]);
        totalRow.eachCell((cell) => {
            cell.font = { bold: true };
        });


        // Set column widths
        [48, 12, 48, 12].forEach((width, index) => {
            worksheet.getColumn(index + 1).width = width;
        });

        // Apply individual alignment and borders to each column
        worksheet.eachRow((row, rowNumber) => {
            if (rowNumber > 5) {
                // Skip title rows and the empty row
                row.eachCell((cell, colNumber) => {
                    if (rowNumber === 7) {
                        // Keep headers centered
                        cell.alignment = { horizontal: "center" };
                    } else {
                        // Apply individual alignment to body cells
                        cell.alignment = { horizontal: columnAlignments[colNumber - 1] };
                    }
                    cell.border = {
                        top: { style: "thin" },
                        left: { style: "thin" },
                        bottom: { style: "thin" },
                        right: { style: "thin" },
                    };
                });
            }
        });

        // Generate Excel file buffer and save
        const buffer = await workbook.xlsx.writeBuffer();
        const blob = new Blob([buffer], {
            type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        });
        saveAs(blob, "DailyCashReceiptsReport.xlsx");
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
    const [isFilterApplied, setIsFilterApplied] = useState(false);
    useEffect(() => {
        if (isFilterApplied || CashPaymentData.length > 0) {
            setSelectedIndex(0); // Set the selected index to the first row
            rowRefs.current[0]?.scrollIntoView({
                behavior: "smooth",
                block: "start",
            });
        } else {
            setSelectedIndex(-1); // Reset selected index if no filter applied or filtered data is empty
        }
    }, [CashPaymentData, isFilterApplied]);

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
    }, [CashPaymentData, selectedRowId]);
    const handleKeyDown = (e) => {
        if (selectedIndex === -1 || e.target.id === "searchInput") return; // Return if no row is selected or target is search input
        if (e.key === "ArrowUp") {
            e.preventDefault();
            setSelectedIndex((prevIndex) => Math.max(prevIndex - 1, 0));
            scrollToSelectedRow();
        } else if (e.key === "ArrowDown") {
            e.preventDefault();
            setSelectedIndex((prevIndex) =>
                Math.min(prevIndex + 1, CashPaymentData.length - 1)
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
                    <NavComponent textdata="Daily Cash Book Report" />


                    <div className="row " style={{ height: '20px', marginTop: '8px', marginBottom: "8px" }}>
                        <div style={{ width: '97.5%', display: 'flex', alignItems: 'center', margin: '0px', padding: '0px', justifyContent: 'space-between' }}>

                            {/* To Date */}
                            <div className='d-flex align-items-center' style={{ marginLeft: '7px' }}>
                                <div style={{ width: '72px', display: 'flex', justifyContent: 'end', }}>
                                    <label htmlFor="fromDatePicker"><span style={{ fontSize: '15px', fontWeight: 'bold' }}>Date :</span>  <br /></label>
                                </div>
                                <div
                                    id="todatevalidation"
                                    style={{
                                        width: '135px',
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
                                            width: '90px',
                                            paddingLeft: '5px',
                                            outline: 'none',
                                            alignItems: 'center',
                                            // marginTop: '5.5px',
                                            border: 'none',
                                            fontSize: '12px',
                                            backgroundColor: getcolor,
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
                                                            marginLeft: '18px',
                                                            // marginTop: '5px',
                                                            fontSize: '12px'
                                                        }} />
                                                </span>
                                            </div>
                                        }
                                    />
                                </div>
                            </div>

                            {/* Opening Balance  */}
                            <div style={{ display: 'flex' }}>
                                <div style={{ width: '110px' }}>
                                    <label for="searchInput" style={{ marginRight: '5px' }}><span style={{ fontSize: '15px', fontWeight: 'bold' }}>Opening Bal :</span> </label>
                                </div>
                                <div
                                    style={{
                                        width: '100px',
                                        height: '24px',
                                        fontSize: '12px',
                                        color: fontcolor,
                                        backgroundColor: getcolor,
                                        border: `1px solid ${fontcolor}`,

                                    }}
                                >
                                    <span className="mobileledger_total">{CashBookSummaryData.length > 0 ? CashBookSummaryData[0].Opening : null}</span>
                                </div>
                            </div>

                            {/* Closing Balance  */}
                            <div style={{ display: 'flex' }}>
                                <div style={{ width: '110px' }}>
                                    <label for="searchInput" style={{ marginRight: '5px' }}><span style={{ fontSize: '15px', fontWeight: 'bold' }}>Closing Bal :</span> </label>
                                </div>
                                <div
                                    style={{
                                        width: '100px',
                                        height: '24px',
                                        fontSize: '12px',
                                        color: fontcolor,
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
                                    fontSize: "12px",
                                    width: "100%",
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
                                    fontSize: "12px",
                                    width: "100%",
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
                                            {/* {tableData.map((item, i) => {
                                                totalEnteries += 1;
                                                return (
                                                    <tr
                                                        key={`${i}-${selectedIndex}`}
                                                        ref={(el) => (rowRefs.current[i] = el)} // Assign ref to each row
                                                        onClick={() => handleRowClick(i)}
                                                        className={selectedIndex === i ? "selected-background" : ""}
                                                        style={{ backgroundColor: '#021A33' }}
                                                    >
                                                        <td className="text-start" style={firstColWidth}>
                                                            {`${item['Trn#']}-${item['A/C']} - ${item.Description}`}
                                                        </td>
                                                        <td className="text-end" style={secondColWidth}>
                                                            {item.Amount} 
                                                        </td>

                                                        <td className="text-start" style={thirdColWidth}>
                                                        {`${item['Trn#']}-${item['A/C']} - ${item.Description}`}

                                                        </td>
                                                        <td className="text-end" style={forthColWidth}>
                                                            {item.Amount}
                                                        </td>


                                                    </tr>
                                                );
                                            })} */}


                                            {CashPaymentData.map((cashPaymentItem, i) => {
                                                totalEnteries += 1;

                                                // Retrieve corresponding data from tableData if it exists
                                                const tableItem = tableData[i] || {}; // Fallback to an empty object if index doesn't exist

                                                return (
                                                    <tr
                                                        key={`${i}-${selectedIndex}`}
                                                        ref={(el) => (rowRefs.current[i] = el)} // Assign ref to each row
                                                        onClick={() => handleRowClick(i)}
                                                        className={selectedIndex === i ? "selected-background" : ""}
                                                        style={{ backgroundColor: '#021A33' }}
                                                    >
                                                        {/* First Column - From tableData if available */}
                                                        <td className="text-start" style={firstColWidth}>
                                                            {tableItem['Trn#']
                                                                ? `${tableItem['Trn#']}- ${tableItem.Description}`
                                                                : ""}
                                                        </td>

                                                        {/* Second Column - From CashPaymentData */}
                                                        <td className="text-end" style={secondColWidth}>
                                                            {tableItem.Amount || ""}
                                                        </td>

                                                        {/* Third Column - From CashPaymentData */}
                                                        <td className="text-start" style={thirdColWidth}>
                                                            {`${cashPaymentItem['Trn#'] || ""}-${cashPaymentItem.Description || ""}`}
                                                        </td>

                                                        {/* Fourth Column - From tableData if available */}
                                                        <td className="text-end" style={forthColWidth}>
                                                            {cashPaymentItem.Amount || ""}

                                                        </td>
                                                    </tr>
                                                );
                                            })}



                                            {Array.from({
                                                length: Math.max(0, 27 - tableData.length),
                                            }).map((_, rowIndex) => (
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




