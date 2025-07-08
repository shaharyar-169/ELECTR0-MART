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

export default function CashFlowReport() {
    const navigate = useNavigate();
    const user = getUserData();
    const organisation = getOrganisationData();
    const yeardescription = getYearDescription();
    const locationnumber = getLocationnumber();
    const saleSelectRef = useRef(null);
    const input1Ref = useRef(null);
    const input2Ref = useRef(null);
    const input3Ref = useRef(null);

    const toRef = useRef(null);
    const fromRef = useRef(null);

    const [tableData, setTableData] = useState([]);
    const [Paymentdata, setPaymentdata] = useState([]);

    console.log("Recept data", tableData);
    console.log("payment data", Paymentdata);

    const [saleType, setSaleType] = useState("");
    const [searchQuery, setSearchQuery] = useState("");
    const [transectionType, settransectionType] = useState("");
    const [supplierList, setSupplierList] = useState([]);

    const [totalQnty, setTotalQnty] = useState(0);
    const [openingbalance, setopeningbalance] = useState(0);
    console.log("opening balance", openingbalance);
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

    const handleToKeyPress = (e, inputref) => {
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

                if (inputref.current) {
                    e.preventDefault();
                    inputref.current.focus();
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

    function fetchReceivableReport() {
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

        const apiUrl = apiLinks + "/CashFlow.php";
        setIsLoading(true);
        const formData = new URLSearchParams({
            FIntDat: fromInputDate,
            FFnlDat: toInputDate,
            //   code: organisation.code,
            //   FLocCod: locationnumber || getLocationNumber,
            //   FYerDsc: yeardescription || getyeardescription,

            code: 'MAKKAHCOMP',
            FLocCod: '001',
            FYerDsc: '2025-2025',


            FAccCod: "12-01-0001",
        }).toString();

        axios
            .post(apiUrl, formData)
            .then((response) => {
                setIsLoading(false);
                setTableData(response.data);
                setopeningbalance(response.data.Opening);
                setTotalDebit(response.data["Total Receipts"]);
                setTotalCredit(response.data["Total Payments"]);
                setClosingBalance(response.data["Closing"]);

                if (response.data) {
                    if (Array.isArray(response.data.Receipts)) {
                        setTableData(response.data.Receipts); // Store Profit array in profits state
                    } else {
                        console.warn(
                            "Response data 'Profit' is not an array:",
                            response.data.Receipts
                        );
                        setTableData([]); // Fallback to an empty array
                    }

                    if (Array.isArray(response.data.Payments)) {
                        setPaymentdata(response.data.Payments); // Store Expense array in expenses state
                    } else {
                        console.warn(
                            "Response data 'Expense' is not an array:",
                            response.data.Payments
                        );
                        setPaymentdata([]); // Fallback to an empty array
                    }
                } else {
                    console.warn("Response data is null or undefined:", response.data);
                    setTableData([]);
                    setPaymentdata([]);
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

    ///////////////////////////// DOWNLOAD PDF CODE ////////////////////////////////////////////////////////////
    const exportPDFHandler = () => {
        const globalfontsize = 12;
        console.log("gobal font data", globalfontsize);

        // Create a new jsPDF instance with landscape orientation
        const doc = new jsPDF({ orientation: "potraite" });

        // Add Opening Balance row
        const openingBalanceRow = [
            "-",
            "Opening Balance",
            "-",
            "-",
            openingbalance,
        ];

        // Map receipt data with the "Receipt" header
        const receipt =
            tableData.length > 0
                ? [
                    ["", "Receipt", "", "", ""],
                    ...tableData.map((item) => [
                        item.tacccod,
                        item.Description,
                        item.Receipts,
                        "",
                        "",
                    ]),
                ]
                : [];

        // Map payment data with the "Payment" header
        const payment =
            Paymentdata.length > 0
                ? [
                    ["", "Payment", "", "", ""],
                    ...Paymentdata.map((item) => [
                        item.tacccod,
                        item.Description,
                        "",
                        item.Payments,
                        "",
                    ]),
                ]
                : [];

        // Combine all rows
        const rows = [openingBalanceRow, ...receipt, ...payment];

        // Add summary row to the table
        rows.push([
            "",
            "",
            String(totalDebit),
            String(totalCredit),
            String(closingBalance),
        ]);

        // Define table column headers and individual column widths

        const headers = ["Code", "Description", "Receipt", "Patyment", "Balance"];
        const columnWidths = [20, 80, 25, 25, 25];

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
            const rowHeight = 5; // Adjust row height
            const fontSize = 10; // Adjust font size for regular text
            const boldFont = "bold"; // Bold font
            const normalFont = getfontstyle; // Default font
            const tableWidth = getTotalTableWidth(); // Calculate total table width

            doc.setFontSize(fontSize);

            for (let i = startIndex; i < endIndex; i++) {
                const row = rows[i];
                const isTotalRow = i === rows.length - 1; // Check if this is the total row
                let textColor = [0, 0, 0]; // Default text color
                let fontName = normalFont; // Default font
                let currentX = startX; // Track current column position

                // For total row, set bold font and prepare for double border
                if (isTotalRow) {
                    doc.setFont(getfontstyle, 'bold');
                }

                row.forEach((cell, cellIndex) => {
                    // For total row, adjust vertical position to center in the double border
                    const cellY = isTotalRow
                        ? startY + (i - startIndex + 2) * rowHeight + rowHeight / 2 
                        : startY + (i - startIndex + 2) * rowHeight + 3;

                    const cellX = currentX + 2;

                    // Reset default colors for each cell
                    let backgroundColor = null;

                    // Apply styling only for "Receipt" or "Payment" in column index 1
                    if (cellIndex === 1) {
                        if (cell === "Receipt") {
                            backgroundColor = [169, 169, 169]; // Light grey background
                            textColor = [0, 0, 0]; // White text
                            fontName = boldFont;
                        } else if (cell === "Payment") {
                            backgroundColor = [169, 169, 169]; // Light grey background
                            textColor = [0, 0, 0]; // White text
                            fontName = boldFont;
                        }
                    }

                    // Draw cell background if applicable
                    if (backgroundColor) {
                        doc.setFillColor(...backgroundColor);
                        doc.rect(
                            currentX,
                            startY + (i - startIndex + 2) * rowHeight,
                            columnWidths[cellIndex],
                            rowHeight,
                            "F"
                        );
                    }

                    // Set text color and font
                    doc.setTextColor(...textColor);

                    // For total row, keep bold font
                    if (!isTotalRow) {
                        doc.setFont(fontName, "normal");
                    }

                    // Ensure the cell value is a string
                    const cellValue = String(cell);

                    // Right-align specific columns (like Balance column)
                    if (cellIndex === 2 || cellIndex === 3 || cellIndex === 4) {
                        const rightAlignX = currentX + columnWidths[cellIndex] - 2; // Adjust for right alignment
                        doc.text(cellValue, rightAlignX, cellY, {
                            align: "right",
                            baseline: "middle",
                        });
                    } else {
                        // For empty cells in total row, add "Total" label centered
                        if (isTotalRow && cellIndex === 0 && cell === "") {
                            const totalLabelX = currentX + columnWidths[0] / 2;
                            doc.text("Total", totalLabelX, cellY, {
                                align: "center",
                                baseline: "middle"
                            });
                        } else {
                            doc.text(cellValue, cellX, cellY, {
                                baseline: "middle"
                            });
                        }
                    }

                    // Draw column borders
                    if (isTotalRow) {
                        // Double border for total row columns
                        doc.setLineWidth(0.3);
                        doc.rect(
                            currentX,
                            startY + (i - startIndex + 2) * rowHeight,
                            columnWidths[cellIndex],
                            rowHeight
                        );
                        doc.setLineWidth(0.3);
                        doc.rect(
                            currentX + 0.5,
                            startY + (i - startIndex + 2) * rowHeight + 0.5,
                            columnWidths[cellIndex] - 1,
                            rowHeight - 1
                        );
                    } else {
                        // Normal border for other rows
                        doc.setLineWidth(0.2);
                        doc.rect(
                            currentX,
                            startY + (i - startIndex + 2) * rowHeight,
                            columnWidths[cellIndex],
                            rowHeight
                        );
                    }

                    // Move to next column
                    currentX += columnWidths[cellIndex];
                });

                // Reset font after total row
                if (isTotalRow) {
                    doc.setFont(getfontstyle, "normal");
                }
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

                // Add page numbering
                doc.setFontSize(pageNumberFontSize);
                doc.text(
                    `Page ${pageNumber}`,
                    rightX - 50,
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

                addTitle(
                    `Cash Flow From ${fromInputDate} To ${toInputDate}`,
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
                doc.setFontSize(12);
                doc.setFont(getfontstyle, "300");

                //   let RepRate = Retrate === "A"
                //       ? "ALL"
                //       : Retrate === "P"
                //           ? "PURCHASE RATE"
                //           : Retrate === "S"
                //               ? "SALE MAN RATE "
                //               : Retrate === "A"
                //                   ? "ACTUAL RATE "
                //                   : "ALL";

                //   let Typefilter = transectionType === "A"
                //       ? "ALL"
                //       : transectionType === "S"
                //           ? "CASH"
                //           : transectionType === "R"
                //               ? "CREDIT"
                //               : "ALL";

                //   let typeItem = Companyselectdatavalue.label
                //       ? Companyselectdatavalue.label
                //       : "ALL";

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

                //   doc.setFont(getfontstyle, "bold"); // Set font to bold
                //   doc.text(`REP RATE :`, labelsX, labelsY); // Draw bold label
                //   doc.setFont(getfontstyle, "normal"); // Reset font to normal
                //   doc.text(`${RepRate}`, labelsX + 25, labelsY); // Draw the value next to the label

                //   doc.setFont(getfontstyle, "bold"); // Set font to bold
                //   doc.text(`TYPE :`, labelsX, labelsY + 4.3); // Draw bold label
                //   doc.setFont(getfontstyle, "normal"); // Reset font to normal
                //   doc.text(`${Typefilter}`, labelsX + 25, labelsY + 4.3); // Draw the value next to the label

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

                startY += -4; // Adjust vertical position for the labels

                addTableHeaders((doc.internal.pageSize.width - totalWidth) / 2, 25);
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
        doc.save(`CashFlowReport From ${fromInputDate} To ${toInputDate}.pdf`);
    };
    ///////////////////////////// DOWNLOAD PDF CODE ////////////////////////////////////////////////////////////
    ///////////////////////////// DOWNLOAD PDF EXCEL //////////////////////////////////////////////////////////
    const handleDownloadCSV = async () => {
        const workbook = new ExcelJS.Workbook();
        const worksheet = workbook.addWorksheet("Sheet1");

        const numColumns = 6; // Number of columns

        const columnAlignments = ["left", "left", "right", "right", "right"];

        // Add an empty row at the start
        worksheet.addRow([]);

        // Add title rows

        [
            comapnyname,
            `Cash Flow From ${fromInputDate} To ${toInputDate}`,
        ].forEach((title, index) => {
            // Define custom styles for each title
            let customStyle;
            let rowHeight = 20; // Default row height
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
        worksheet.addRow([]); // This is where you add the empty row

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
        const headers = ["Code", "Description", "Receipt", "Payment", "Balance"];
        const headerRow = worksheet.addRow(headers);

        // Apply styles and center alignment to the header row
        headerRow.eachCell((cell) => {
            cell.style = { ...headerStyle };
        });

        // Add data rows

        // Add Opening Balance Row
        const openingBalanceRow = [
            "-",
            "Opening Balance",
            "-",
            "-",
            openingbalance,
        ];

        // Map Receipt Data
        const receipt =
            tableData.length > 0
                ? [["", "Receipt", "", "", ""]].concat(
                    tableData.map((item) => [
                        item.tacccod || "",
                        item.Description || "",
                        item.Receipts || "",
                        "",
                        "",
                    ])
                )
                : [];

        // Map Payment Data
        const payment =
            Paymentdata.length > 0
                ? [["", "Payment", "", "", ""]].concat(
                    Paymentdata.map((item) => [
                        item.tacccod || "",
                        item.Description || "",
                        "",
                        item.Payments || "",
                        "",
                    ])
                )
                : [];

        // Combine Rows for Final Data
        const rows = [openingBalanceRow, ...receipt, ...payment];

        // Add Data Rows to Worksheet
        rows.forEach((rowData) => {
            const row = worksheet.addRow(rowData);

            // Apply styles to each row
            row.eachCell((cell, colIndex) => {
                cell.font = {
                    family: getfontstyle,
                    size: getdatafontsize,
                    bold: false,
                };

                cell.border = {
                    top: { style: "thin", color: { argb: "FF000000" } },
                    left: { style: "thin", color: { argb: "FF000000" } },
                    bottom: { style: "thin", color: { argb: "FF000000" } },
                    right: { style: "thin", color: { argb: "FF000000" } },
                };

                // Align content based on column index
                if (colIndex === 3 || colIndex === 4 || colIndex === 5) {
                    cell.alignment = { horizontal: "right", vertical: "middle" };
                } else {
                    cell.alignment = { horizontal: "left", vertical: "middle" };
                }
            });

            // Apply specific styling for "Receipt" and "Payment" header rows
            if (rowData[1] === "Receipt" || rowData[1] === "Payment") {
                const targetCell = row.getCell(2); // Column index 2 (1-based index in ExcelJS)

                targetCell.font = { bold: true }; // Make text bold
                targetCell.fill = {
                    type: "pattern",
                    pattern: "solid",
                    fgColor: { argb: "FFC6D9F7" }, // Light Orange Background
                };
                targetCell.alignment = { horizontal: "left", vertical: "middle" };
            }
        });

        // Add Total Row
        const totalRow = worksheet.addRow([
            "",
            "Total",
            String(totalDebit),
            String(totalCredit),
            String(closingBalance),
        ]);

        // Apply Styles to Total Row
        totalRow.eachCell((cell, colNumber) => {
            cell.font = { bold: true };
            cell.border = {
                top: { style: "thin" },
                left: { style: "thin" },
                bottom: { style: "thin" },
                right: { style: "thin" },
            };

            if (colNumber === 3 || colNumber === 4 || colNumber === 5) {
                cell.alignment = { horizontal: "right" };
            }
        });

        // Set column widths

        [12, 40, 20, 20, 20].forEach((width, index) => {
            worksheet.getColumn(index + 1).width = width;
        });

        const getCurrentDate = () => {
            const today = new Date();
            const dd = String(today.getDate()).padStart(2, "0");
            const mm = String(today.getMonth() + 1).padStart(2, "0"); // January is 0!
            const yyyy = today.getFullYear();
            return dd + "/" + mm + "/" + yyyy;
        };

        const currentdate = getCurrentDate();

        // Generate Excel file buffer and save
        const buffer = await workbook.xlsx.writeBuffer();
        const blob = new Blob([buffer], {
            type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        });
        saveAs(
            blob,
            `CashFlowReport From ${fromInputDate} To ${toInputDate}.xlsx`
        );
    };
    ///////////////////////////// DOWNLOAD PDF EXCEL ///////////////////////////////////////////////////////////

    const dispatch = useDispatch();

    const tableTopColor = "#3368B5";
    const tableHeadColor = "#3368b5";
    const secondaryColor = "white";
    const btnColor = "#3368B5";
    const textColor = "white";

    console.log("cash flow data ", tableData);
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
        width: "10%",
    };
    const secondColWidth = {
        width: "43.5%",
    };
    const thirdColWidth = {
        width: "15%",
    };
    const forthColWidth = {
        width: "15%",
    };
    const fifthColWidth = {
        width: "15%",
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
        width: isSidebarVisible ? "calc(80vw - 0%)" : "90vw",
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

    const [selectedIndex, setSelectedIndex] = useState(-1);
    const rowRefs = useRef([]);

    // Merge Receipts and Payments with section headings
    const mergedData = [
        { type: "receipt-heading" }, // Receipt Section Heading
        ...tableData.map((item, i) => ({ ...item, type: "receipt", index: i })),
        { type: "payment-heading" }, // Payment Section Heading
        ...Paymentdata.map((item, i) => ({
            ...item,
            type: "payment",
            index: tableData.length + i,
        })),
    ];

    // Function to find the first selectable row (non-heading)
    const getFirstSelectableRow = () =>
        mergedData.findIndex((row) => !row.type.includes("heading"));

    // Set the first selectable row when data is loaded
    useEffect(() => {
        const firstRow = getFirstSelectableRow();
        if (firstRow !== -1) {
            setSelectedIndex(firstRow);
            setTimeout(() => scrollToSelectedRow(firstRow), 100); // Prevent too many re-renders
        }
    }, [tableData, Paymentdata]); // Runs when data changes

    // Handle row click
    const handleRowClick = (index) => {
        if (mergedData[index]?.type.includes("heading")) return; // Prevent selection of headings
        setSelectedIndex(index);
    };

    // Scroll to selected row
    const scrollToSelectedRow = (index) => {
        if (index !== -1 && rowRefs.current[index]) {
            rowRefs.current[index].scrollIntoView({
                behavior: "smooth",
                block: "nearest",
            });
        }
    };

    // Handle keyboard navigation
    const handleKeyDown = (e) => {
        if (selectedIndex === -1 || e.target.id === "searchInput") return;

        let newIndex = selectedIndex;

        if (e.key === "ArrowUp") {
            e.preventDefault();
            do {
                newIndex = Math.max(newIndex - 1, 0);
            } while (mergedData[newIndex]?.type.includes("heading") && newIndex > 0);
        } else if (e.key === "ArrowDown") {
            e.preventDefault();
            do {
                newIndex = Math.min(newIndex + 1, mergedData.length - 1);
            } while (
                mergedData[newIndex]?.type.includes("heading") &&
                newIndex < mergedData.length - 1
            );
        }

        if (newIndex !== selectedIndex) {
            setSelectedIndex(newIndex);
            setTimeout(() => scrollToSelectedRow(newIndex), 50); // Prevent excessive scrolling
        }
    };

    // Attach event listener
    useEffect(() => {
        window.addEventListener("keydown", handleKeyDown);
        return () => {
            window.removeEventListener("keydown", handleKeyDown);
        };
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
                    <NavComponent textdata="Cash Flow Report" />

                    <div
                        className="row"
                        style={{
                            height: "20px",
                            marginTop: "8px",
                            marginBottom: "8px",
                            display: "flex",
                        }}
                    >
                        <div
                            style={{
                                width: "100%",
                                display: "flex",
                                alignItems: "center",
                                margin: "0px",
                                padding: "0px",
                                // justifyContent: "space-between",
                            }}
                        >
                            <div className="d-flex align-items-center">
                                <div
                                    style={{
                                        width: "80px",
                                        display: "flex",
                                        justifyContent: "end",
                                    }}
                                >
                                    <label htmlFor="fromDatePicker">
                                        <span style={{ fontSize: "15px", fontWeight: "bold" }}>
                                            From:
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
                                        marginLeft: "3px",
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
                                            fontSize: "12px",
                                            backgroundColor: getcolor,
                                            color: fontcolor,
                                            opacity: selectedRadio === "custom" ? 1 : 0.5,
                                            pointerEvents:
                                                selectedRadio === "custom" ? "auto" : "none",
                                        }}
                                        id="frominputid"
                                        value={fromInputDate}
                                        ref={fromRef}
                                        onChange={handlefromInputChange}
                                        onKeyDown={(e) => handlefromKeyPress(e, "toDatePicker")}
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
                                                        fontSize: "12px",
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
                            <div
                                className="d-flex align-items-center"
                                style={{ marginLeft: "15px" }}
                            >
                                <div
                                    style={{
                                        width: "60px",
                                        display: "flex",
                                        justifyContent: "end",
                                    }}
                                >
                                    <label htmlFor="toDatePicker">
                                        <span style={{ fontSize: "15px", fontWeight: "bold" }}>
                                            To:
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
                                        marginLeft: "15px",
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
                                            fontSize: "12px",
                                            backgroundColor: getcolor,
                                            color: fontcolor,
                                            opacity: selectedRadio === "custom" ? 1 : 0.5,
                                            pointerEvents:
                                                selectedRadio === "custom" ? "auto" : "none",
                                        }}
                                        value={toInputDate}
                                        onChange={handleToInputChange}
                                        onKeyDown={(e) => handleToKeyPress(e, input3Ref)}
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
                                                        fontSize: "12px",
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

                            <div
                                style={{ marginLeft: "50px" }}
                                className="d-flex align-items-center justify-content-center"
                            >
                                <div className="d-flex align-items-center">
                                    <div
                                        style={{
                                            display: "flex",
                                            justifyContent: "evenly",
                                        }}
                                    >
                                        <div className="d-flex align-items-baseline mx-2">
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
                                            <label htmlFor="custom">Custom</label>
                                        </div>
                                        <div className="d-flex align-items-baseline mx-2">
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
                                            <label htmlFor="30">30 Days</label>
                                        </div>
                                        <div className="d-flex align-items-baseline mx-2">
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
                                            <label htmlFor="60">60 Days</label>
                                        </div>
                                        <div className="d-flex align-items-baseline mx-2">
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
                                            <label htmlFor="90">90 Days</label>
                                        </div>
                                    </div>
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
                                            color: "white",
                                        }}
                                    >
                                        <td className="border-dark" style={firstColWidth}>
                                            Code
                                        </td>
                                        <td className="border-dark" style={secondColWidth}>
                                            Description
                                        </td>
                                        <td className="border-dark" style={thirdColWidth}>
                                            Receipt
                                        </td>
                                        <td className="border-dark" style={forthColWidth}>
                                            Payment
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
                                    fontSize: "12px",
                                    width: "100%",
                                    position: "relative",
                                }}
                            >
                                <tbody id="tablebody">
                                    {isLoading ? (
                                        <>
                                            <tr style={{ backgroundColor: getcolor }}>
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
                                            {mergedData.map((item, i) => {
                                                // Handle Payment Heading Row
                                                const hasPaymentData = mergedData.some(
                                                    (data) => data.type === "payment"
                                                );
                                                if (item.type === "payment-heading" && hasPaymentData) {
                                                    return (
                                                        <tr
                                                            key={`payment-heading-${i}`}
                                                            style={{
                                                                backgroundColor: getcolor,
                                                                color: fontcolor,
                                                            }}
                                                        >
                                                            <td
                                                                style={{
                                                                    ...firstColWidth,
                                                                    backgroundColor: getcolor,
                                                                }}
                                                            ></td>
                                                            <td
                                                                style={{
                                                                    textAlign: "start",
                                                                    fontWeight: "bold",
                                                                    backgroundColor: "#3368B5",
                                                                    color: "white",
                                                                }}
                                                            >
                                                                Payment
                                                            </td>
                                                            <td
                                                                style={{
                                                                    ...thirdColWidth,
                                                                    backgroundColor: getcolor,
                                                                }}
                                                            ></td>
                                                            <td
                                                                style={{
                                                                    ...forthColWidth,
                                                                    backgroundColor: getcolor,
                                                                }}
                                                            ></td>
                                                            <td
                                                                style={{
                                                                    ...fifthColWidth,
                                                                    backgroundColor: getcolor,
                                                                }}
                                                            ></td>
                                                        </tr>
                                                    );
                                                }

                                                // Normal & Payment Rows
                                                return (
                                                    <tr
                                                        key={`row-${i}`}
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
                                                        {/* First Column */}
                                                        <td
                                                            className="text-start"
                                                            style={{
                                                                ...firstColWidth,
                                                                textAlign: "center",
                                                                fontWeight: "normal",
                                                                backgroundColor: "transparent",
                                                            }}
                                                        >
                                                            {item.type === "receipt"
                                                                ? item.index === 0
                                                                    ? "-"
                                                                    : item.index === 1
                                                                        ? ""
                                                                        : item.tacccod
                                                                : item.tacccod}
                                                        </td>

                                                        {/* Second Column (Description) */}
                                                        <td
                                                            className={`text-start ${item.index === 1 ? "heading-cell" : ""
                                                                }`}
                                                            style={{
                                                                ...secondColWidth,
                                                                textAlign: "center",
                                                                fontWeight:
                                                                    item.index === 1 ? "bold" : "normal",
                                                                backgroundColor:
                                                                    item.index === 1 ? "#3368B5" : "transparent",
                                                                // color: fontcolor,
                                                                color: item.index === 1 ? "white" : "",
                                                            }}
                                                        >
                                                            {item.type === "receipt"
                                                                ? item.index === 0
                                                                    ? "Opening Balance"
                                                                    : item.index === 1
                                                                        ? "Receipt"
                                                                        : item.Description
                                                                : item.Description}
                                                        </td>

                                                        {/* Third Column */}
                                                        <td className="text-end" style={thirdColWidth}>
                                                            {item.type === "receipt"
                                                                ? item.index === 0
                                                                    ? "-"
                                                                    : item.index === 1
                                                                        ? ""
                                                                        : item.Receipts
                                                                : ""}
                                                        </td>

                                                        {/* Fourth Column (Payment) */}
                                                        <td className="text-end" style={forthColWidth}>
                                                            {item.type === "receipt"
                                                                ? item.index === 0
                                                                    ? "-"
                                                                    : item.Payment
                                                                : item.Payments}
                                                        </td>

                                                        {/* Fifth Column (Opening Balance) */}
                                                        <td className="text-end" style={fifthColWidth}>
                                                            {item.type === "receipt"
                                                                ? item.index === 0
                                                                    ? openingbalance
                                                                    : ""
                                                                : ""}
                                                        </td>
                                                    </tr>
                                                );
                                            })}

                                            {/* Blank Rows */}
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
                        >
                            <span className="mobileledger_total">{totalDebit}</span>
                        </div>
                        <div
                            style={{
                                ...forthColWidth,
                                background: getcolor,
                                borderRight: `1px solid ${fontcolor}`,
                            }}
                        >
                            <span className="mobileledger_total">{totalCredit}</span>
                        </div>
                        <div
                            style={{
                                ...fifthColWidth,
                                background: getcolor,
                                borderRight: `1px solid ${fontcolor}`,
                            }}
                        >
                            <span className="mobileledger_total">{closingBalance}</span>
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
                            ref={input3Ref}
                            onClick={fetchReceivableReport}
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
