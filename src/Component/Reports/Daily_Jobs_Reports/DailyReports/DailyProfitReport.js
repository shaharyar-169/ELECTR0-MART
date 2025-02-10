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
import { Height } from "@mui/icons-material";

export default function DailyProfitReport() {
    const navigate = useNavigate();
    const user = getUserData();
    const organisation = getOrganisationData();

    const saleSelectRef = useRef(null);
    const input1Ref = useRef(null);
    const input2Ref = useRef(null);
    const input3Ref = useRef(null);
    const input4Ref = useRef(null);


    const toRef = useRef(null);
    const fromRef = useRef(null);

    const [Profits, setProfits] = useState([]);
    const [Expenses, setExpenses] = useState([]);

    console.log('Profits array data', Profits)
    console.log('Expenses array data', Expenses)


    const [saleType, setSaleType] = useState("");
    const [searchQuery, setSearchQuery] = useState("");
    const [transectionType, settransectionType] = useState("");
    const [Retrate, setRetrate] = useState("P");
    const [supplierList, setSupplierList] = useState([]);

    const [totalQnty, setTotalQnty] = useState(0);
    const [totalOpening, setTotalOpening] = useState(0);
    const [totalDebit, setTotalDebit] = useState(0);
    const [totalCredit, setTotalCredit] = useState(0);
    const [closingBalance, setClosingBalance] = useState(0);
    const [totalExpense, settotalExpense] = useState(0);
    const [Netprofit, setNetprofit] = useState(0);
    const [Otherincome, setOtherincome] = useState(0);
    const [totalprofit, settotalprofit] = useState(0);


    // state for from DatePicker
    const [selectedfromDate, setSelectedfromDate] = useState(null);
    const [fromInputDate, setfromInputDate] = useState("");
    const [fromCalendarOpen, setfromCalendarOpen] = useState(false);
    // state for To DatePicker
    const [selectedToDate, setSelectedToDate] = useState(null);
    const [toInputDate, settoInputDate] = useState("");
    const [toCalendarOpen, settoCalendarOpen] = useState(false);


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

                if (input1Ref.current) {
                    e.preventDefault();
                    input1Ref.current.focus();
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

        const apiUrl = apiLinks + "/DailyProfitReport.php";
        setIsLoading(true);

        const formData = new URLSearchParams({
            FIntDat: fromInputDate,
            FFnlDat: toInputDate,
            FRepTyp: transectionType,
            FRepRat: Retrate,
            code: 'NASIRTRD',
            FLocCod: '001',
            FYerDsc: '2024-2024',

            FSchTxt: searchQuery
        }).toString();

        axios
            .post(apiUrl, formData)
            .then((response) => {
                setIsLoading(false);

                setTotalDebit(response.data["Total Qnty"]);
                setTotalCredit(response.data["Total Amount"]);
                setClosingBalance(response.data["Total Margin"]);
                settotalExpense(response.data["Total Expense"]);

                setNetprofit(response.data["Net Profit"]);
                setOtherincome(response.data["Other Income"]);
                settotalprofit(response.data["Total Profit"]);

                // Store Profit and Expense data into separate states
                if (response.data) {
                    if (Array.isArray(response.data.Profit)) {
                        setProfits(response.data.Profit); // Store Profit array in profits state
                    } else {
                        console.warn(
                            "Response data 'Profit' is not an array:",
                            response.data.Profit
                        );
                        setProfits([]); // Fallback to an empty array
                    }

                    if (Array.isArray(response.data.Expense)) {
                        setExpenses(response.data.Expense); // Store Expense array in expenses state
                    } else {
                        console.warn(
                            "Response data 'Expense' is not an array:",
                            response.data.Expense
                        );
                        setExpenses([]); // Fallback to an empty array
                    }
                }

                else {
                    console.warn("Response data is null or undefined:", response.data);
                    setProfits([]);
                    setExpenses([]);
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



    const handleTransactionTypeChange = (event) => {
        const selectedTransactionType = event.target.value;
        settransectionType(selectedTransactionType);
    };

    const handleReprateChange = (event) => {
        const selectedTransactionType = event.target.value;
        setRetrate(selectedTransactionType);
    };

    ///////////////////////////// DOWNLOAD PDF CODE ////////////////////////////////////////////////////////////
    const exportPDFHandler = () => {
        const globalfontsize = 12;
        console.log("gobal font data", globalfontsize);

        // Create a new jsPDF instance with landscape orientation
        const doc = new jsPDF({ orientation: "landscape" });

        const profitRows = Profits.map((item) => [
            item.Date,
            item["Trn#"],
            item.Type,
            item.Code,
            item.Item,
            item["Sale Rt"],
            item["Sale Amt"],
            item.Qnty,
            item["Cost Rate"],
            item.Margin,
            item.Emp,
            "",

        ]);

        const expenseRows = Expenses.map((expense) => [
            expense.Date || "",
            expense["Trn#"] || "",
            "", // Empty column for "Type"
            "", // Empty column for "Code"
            expense.Item || "",
            "", // Empty column for "Qnty"
            "", // Empty column for "Sale Rt"
            "", // Empty column for "Sale Amt"
            "", // Empty column for "Cost Rate"
            "", // Empty column for "Margin"
            "",
            expense.Amount || "",]);

        const rows = [...profitRows, ...expenseRows];

        // Add summary row to the table
        // Add "Total" row
        rows.push([
            "",
            "",
            "",
            "",
            "Total",
            "",
            "",
            String(totalDebit),
            String(totalCredit),
            String(closingBalance),
            "",
            "",
        ]);

        // Add "Opening Balance" row
        rows.push([
            "",
            "",
            "",
            "",
            "OPENING BAL :",
            "",
            "",
            "",
            "",
            String(totalDebit), // Right-aligned inside the box
            "",
            "",
        ]);

        // Add "Closing Balance" row
        rows.push([
            "",
            "",
            "",
            "",
            "CLOSING BAL :",
            "",
            "",
            "",
            "",
            String(totalDebit), // Right-aligned inside the box
            "",
            "",
        ]);






        // Define table column headers and individual column widths

        const headers = [
            "Date",
            "Trn#",
            "Type",
            "Code",
            "Item",
            "Sale Rt",
            "Sale Amt",
            "Qnty",
            "Cost Rate",
            "Margin",
            "Emp",
            "Exp Amt"
        ];
        const columnWidths = [19, 15, 10, 20, 90, 16, 18, 13, 22, 17, 17, 18];

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
                if (parseFloat(row[8]) < 0) {
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

                    if (cellIndex === 5 || cellIndex === 6 || cellIndex === 7 || cellIndex === 8 || cellIndex === 9 || cellIndex === 10 || cellIndex === 11) {
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

                addTitle(`Daily Profit Report From: ${fromInputDate} To: ${toInputDate}`
                    , "", "", pageNumber, startY, 12); // Render sale report title with decreased font size, provide the time, and page number
                startY += 5;

                const labelsX = (doc.internal.pageSize.width - totalWidth) / 2;
                const labelsY = startY + 4; // Position the labels below the titles and above the table

                // Set font size and weight for the labels
                doc.setFontSize(12);
                doc.setFont(getfontstyle, "300");


                let RepRate = Retrate === "A"
                    ? "ALL"
                    : Retrate === "P"
                        ? "PURCHASE RATE"
                        : Retrate === "S"
                            ? "SALE MAN RATE "
                            : Retrate === "A"
                                ? "ACTUAL RATE "
                                : "ALL";


                let Typefilter = transectionType === "A"
                    ? "ALL"
                    : transectionType === "S"
                        ? "CASH"
                        : transectionType === "R"
                            ? "CREDIT"
                            : "ALL";






                // let status = transectionType ? transectionType : "All";
                let search = searchQuery ? searchQuery : "";

                // Set font style, size, and family
                doc.setFont(getfontstyle, "300"); // Font family and style ('normal', 'bold', 'italic', etc.)
                doc.setFontSize(10); // Font size


                doc.setFont(getfontstyle, "bold"); // Set font to bold
                doc.text(`REP RATE :`, labelsX, labelsY); // Draw bold label
                doc.setFont(getfontstyle, "normal"); // Reset font to normal
                doc.text(`${RepRate}`, labelsX + 25, labelsY); // Draw the value next to the label


                doc.setFont(getfontstyle, "bold"); // Set font to bold
                doc.text(`TYPE :`, labelsX, labelsY + 4.3); // Draw bold label
                doc.setFont(getfontstyle, "normal"); // Reset font to normal
                doc.text(`${Typefilter}`, labelsX + 25, labelsY + 4.3); // Draw the value next to the label

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
        doc.save(`DailyProfitReport From ${fromInputDate} To ${toInputDate}.pdf`);
    };


    const handleDownloadCSV = async () => {
        const workbook = new ExcelJS.Workbook();
        const worksheet = workbook.addWorksheet("Sheet1");

        const numColumns = 6;
        const columnAlignments = [
            "left",
            "left",
            "center",
            "left",
            "left",
            "right",
            "right",
            "center",
            "right",
            "right",
            "right",
            "right"];

        worksheet.addRow([]);

        [comapnyname, `Daily Profit Report From ${fromInputDate} To ${toInputDate}`].forEach((title, index) => {
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

        let raprate = Retrate === "P" ?
            "PURCHASE RATE" : Retrate === "S" ? "SALE MAN RATE" : "ALL";


        let typestatus = transectionType === "S" ?
            "CASH" : transectionType === "C" ? "CREDIT" : "ALL";


        let typesearch = searchQuery ? searchQuery : "";

        const typeAndStoreRow2 = worksheet.addRow(["REP RATE :", raprate]);
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

        const headers = [
            "Date",
            "Trn#",
            "Type",
            "Code",
            "Item",
            "Sale Rt",
            "Sale Amt",
            "Qnty",
            "Cost Rate",
            "Margin",
            "Emp",
            "Exp Amt"
        ];


        const headerRow = worksheet.addRow(headers);

        headerRow.eachCell((cell) => {
            cell.style = { ...headerStyle };
        });


        const profitRows = Profits.map((item) => [
            item.Date,
            item["Trn#"],
            item.Type,
            item.Code,
            item.Item,
            item["Sale Rt"],
            item["Sale Amt"],
            item.Qnty,
            item["Cost Rate"],
            item.Margin,
            item.Emp,
            ""
        ]);

        const expenseRows = Expenses.map((expense) => [
            expense.Date || "",
            expense["Trn#"] || "",
            "", // Empty column for "Type"
            "", // Empty column for "Code"
            expense.Item || "",
            "", // Empty column for "Sale Rt"
            "", // Empty column for "Sale Amt"
            "", // Empty column for "Qnty"
            "", // Empty column for "Cost Rate"
            "", // Empty column for "Margin"
            "",
            expense.Amount || "", // "Emp" column used for expense amount
        ]);

        const rows = [...profitRows, ...expenseRows];

        rows.forEach((row) => worksheet.addRow(row));

        const totalRow = worksheet.addRow([
            "",
            "",
            "",
            "",
            "Total",
            "",
            "",
            totalDebit,
            totalCredit,
            closingBalance,
            totalExpense,
            "",]
        );

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


        [10, 7, 5, 10, 45, 15, 15, 6, 12, 12, 12, 12].forEach((width, index) => {
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
        saveAs(blob, `DailyProfitReport From ${fromInputDate} To ${toInputDate}.xlsx`);
    };

    ///////////////////////////// DOWNLOAD PDF EXCEL ///////////////////////////////////////////////////////////


    const dispatch = useDispatch();

    const tableTopColor = "#3368B5";
    const tableHeadColor = "#3368b5";
    const secondaryColor = "white";
    const btnColor = "#3368B5";
    const textColor = "white";

    const [tableData, setTableData] = useState([]);

    console.log('tableData', tableData);

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
    const forthColWidth = {
        width: "8%",
    };
    const fifthColWidth = {
        width: "28.8%",
    };
    const sixthColWidth = {
        width: "4%",
    };
    const seventhColWidth = {
        width: "8%",
    };
    const eightColWidth = {
        width: "8%",
    };
    const ninthColWidth = {
        width: "8%",
    };
    const tenthColWidth = {
        width: "8%",
    };
    const elewnthColWidth = {
        width: "8%",
    };


    //////////////////// COLUMN WIDTH FOR BOTTOM TABLE  /////////////////////////////////
    const bottomfirstColWidth = {
        width: "14%",
    };
    const bottomsecondColWidth = {
        width: "10%",
    };
    const bottomthirdColWidth = {
        width: "59%",
    };
    const bottomforthColWidth = {
        width: "15%",
    };

    /////////////////////////////////////////////////////////////////////////////////////


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
        width: isSidebarVisible ? "calc(75vw - 0%)" : "75vw",
        Height: '55vh',
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



    const [isFilterApplied, setIsFilterApplied] = useState(false);
    useEffect(() => {
        if (isFilterApplied || Profits.length > 0) {
            setSelectedIndex(0);
            rowRefs.current[0]?.scrollIntoView({
                behavior: "smooth",
                block: "start",
            });
        } else {
            setSelectedIndex(-1);
        }
    }, [Profits, isFilterApplied]);

    let totalEnteries = 0;
    const [selectedRowId, setSelectedRowId] = useState(null);
    const [selectedIndex, setSelectedIndex] = useState(-1);
    const rowRefs = useRef([]);
    const handleRowClick = (index) => {
        setSelectedIndex(index);
    };
    useEffect(() => {
        if (selectedRowId !== null) {
            const newIndex = Profits.findIndex(
                (item) => item.tcmpcod === selectedRowId
            );
            setSelectedIndex(newIndex);
        }
    }, [Profits, selectedRowId]);
    const handleKeyDown = (e) => {
        if (selectedIndex === -1 || e.target.id === "searchInput") return;
        if (e.key === "ArrowUp") {
            e.preventDefault();
            setSelectedIndex((prevIndex) => Math.max(prevIndex - 1, 0));
            scrollToSelectedRow();
        } else if (e.key === "ArrowDown") {
            e.preventDefault();
            setSelectedIndex((prevIndex) =>
                Math.min(prevIndex + 1, Profits.length - 1)
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
                    <NavComponent textdata="Daily Profit Report" />
                    <div className="row"
                        style={{ height: "20px", marginTop: "8px", marginBottom: "8px" }}>

                        <div style={{
                            width: "100%",
                            display: "flex",
                            alignItems: "center",
                            margin: "0px",
                            padding: "0px",
                            justifyContent: "space-between",
                        }}>

                            <div className="d-flex align-items-center justify-content-center">
                                <div className="mx-5">
                                </div>

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
                                            <label htmlFor="custom" style={{ fontSize: getdatafontsize, fontFamily: getfontstyle }}>Custom</label>
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
                                            <label htmlFor="30" style={{ fontSize: getdatafontsize, fontFamily: getfontstyle }}>30 Days</label>
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
                                            <label htmlFor="60" style={{ fontSize: getdatafontsize, fontFamily: getfontstyle }}>60 Days</label>
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
                                            <label htmlFor="90" style={{ fontSize: getdatafontsize, fontFamily: getfontstyle }}>90 Days</label>
                                        </div>
                                    </div>

                                </div>

                            </div>

                            <div
                                className="d-flex align-items-center"
                                style={{ marginRight: "25px" }}
                            >
                                <div
                                    style={{
                                        width: "90px",
                                        display: "flex",
                                        justifyContent: "end",
                                    }}
                                >
                                    <label htmlFor="transactionType">
                                        <span style={{ fontSize: getdatafontsize, fontFamily: getfontstyle, fontWeight: "bold" }}>
                                            Rep Rate :
                                        </span>
                                    </label>
                                </div>



                                <select
                                    ref={input1Ref}
                                    onKeyDown={(e) => handleKeyPress(e, input2Ref)}
                                    id="Repdateid"
                                    name="type"
                                    onFocus={(e) =>
                                        (e.currentTarget.style.border = "4px solid red")
                                    }
                                    onBlur={(e) =>
                                        (e.currentTarget.style.border = `1px solid ${fontcolor}`)
                                    }
                                    value={Retrate}
                                    onChange={handleReprateChange}
                                    style={{
                                        width: "200px",
                                        height: "24px",
                                        marginLeft: "5px",
                                        backgroundColor: getcolor,
                                        border: `1px solid ${fontcolor}`,
                                        fontSize: "12px",
                                        color: fontcolor,
                                    }}
                                >
                                    <option value="P">Purchase Rate </option>
                                    <option value="S">Sale Man Rate</option>


                                </select>
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
                                justifyContent: "space-between",
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
                                        <span style={{ fontSize: getdatafontsize, fontFamily: getfontstyle, fontWeight: "bold" }}>
                                            From :
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
                                        marginLeft: "5px",
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
                                            fontSize: getdatafontsize, fontFamily: getfontstyle, backgroundColor: getcolor,
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
                                                        fontSize: getdatafontsize, fontFamily: getfontstyle,
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
                                        <span style={{ fontSize: getdatafontsize, fontFamily: getfontstyle, fontWeight: "bold" }}>
                                            To :
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
                                        marginLeft: "5px",
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
                                            fontSize: getdatafontsize, fontFamily: getfontstyle,
                                            backgroundColor: getcolor,
                                            color: fontcolor,
                                            opacity: selectedRadio === "custom" ? 1 : 0.5,
                                            pointerEvents:
                                                selectedRadio === "custom" ? "auto" : "none",
                                        }}
                                        value={toInputDate}
                                        onChange={handleToInputChange}
                                        onKeyDown={(e) => handleToKeyPress(e, "Repdateid")}
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
                                                        fontSize: getdatafontsize, fontFamily: getfontstyle,
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
                                style={{ marginRight: "25px" }}
                            >
                                <div
                                    style={{
                                        width: "60px",
                                        display: "flex",
                                        justifyContent: "end",
                                    }}
                                >
                                    <label htmlFor="transactionType">
                                        <span style={{ fontSize: getdatafontsize, fontFamily: getfontstyle, fontWeight: "bold" }}>
                                            Type :
                                        </span>
                                    </label>
                                </div>



                                <select
                                    ref={input2Ref}
                                    onKeyDown={(e) => handleKeyPress(e, input3Ref)}
                                    id="typeselecet"
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
                                        fontSize: getdatafontsize, fontFamily: getfontstyle,
                                        color: fontcolor,
                                    }}
                                >
                                    <option value="A">All</option>
                                    <option value="S">Cash </option>
                                    <option value="R">Credit</option>

                                </select>
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
                            <div id="lastDiv" style={{ marginRight: "5px" }}>
                                <label for="searchInput" style={{ marginRight: "5px" }}>
                                    <span style={{ fontSize: getdatafontsize, fontFamily: getfontstyle, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: getdatafontsize, fontFamily: getfontstyle, fontWeight: "bold" }}>
                                        Search :
                                    </span>{" "}
                                </label>
                                <input
                                    ref={input3Ref}
                                    onKeyDown={(e) => handleKeyPress(e, input4Ref)}
                                    type="text"
                                    // id="searchsubmit"
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
                                    fontSize: getdatafontsize, fontFamily: getfontstyle,
                                    width: "100%",
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
                                            Trn#
                                        </td>
                                        <td className="border-dark" style={thirdColWidth}>
                                            Type
                                        </td>
                                        <td className="border-dark" style={forthColWidth}>
                                            Code
                                        </td>
                                        <td className="border-dark" style={fifthColWidth}>
                                            Item
                                        </td>

                                        <td className="border-dark" style={seventhColWidth}>
                                            Sale Rt
                                        </td>

                                        <td className="border-dark" style={ninthColWidth}>
                                            Cost Rate
                                        </td>
                                        <td className="border-dark" style={sixthColWidth}>
                                            Qty
                                        </td>
                                        <td className="border-dark" style={eightColWidth}>
                                            Sale Amt
                                        </td>
                                        <td className="border-dark" style={tenthColWidth}>
                                            Margin
                                        </td>
                                        <td className="border-dark" style={elewnthColWidth}>
                                            Emp
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
                                maxHeight: "22vh",
                                width: "100%",
                                wordBreak: "break-word",
                            }}
                        >
                            <table
                                className="myTable"
                                id="tableBody"
                                style={{
                                    fontSize: getdatafontsize, fontFamily: getfontstyle,
                                    width: "100%",
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
                                                <td colSpan="11" className="text-center">
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
                                                        {Array.from({ length: 11 }).map((_, colIndex) => (
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
                                                <td style={seventhColWidth}></td>
                                                <td style={eightColWidth}></td>
                                                <td style={sixthColWidth}></td>
                                                <td style={ninthColWidth}></td>
                                                <td style={tenthColWidth}></td>
                                                <td style={elewnthColWidth}></td>

                                            </tr>
                                        </>
                                    ) : (
                                        <>
                                            {Profits.map((item, i) => {
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
                                                            {item['Trn#']}
                                                        </td>
                                                        <td className="text-center" style={thirdColWidth}>
                                                            {item.Type}
                                                        </td>
                                                        <td className="text-start" style={forthColWidth}>
                                                            {item.Code}
                                                        </td>
                                                        <td
                                                            className="text-start"
                                                            style={fifthColWidth}
                                                            title={item.Item || ""}
                                                        >
                                                            {item.Item && item.Item.length > 30
                                                                ? `${item.Item.substring(0, 30)}...`
                                                                : item.Item || ""}
                                                        </td>

                                                        <td className="text-end" style={seventhColWidth}>
                                                            {item['Sale Rt']}
                                                        </td>

                                                        <td className="text-end" style={ninthColWidth}>
                                                            {item['Cost Rate']}
                                                        </td>
                                                        <td className="text-center" style={sixthColWidth}>
                                                            {item.Qnty}
                                                        </td>
                                                        <td className="text-end" style={eightColWidth}>
                                                            {item['Sale Amt']}
                                                        </td>

                                                        <td className="text-end" style={tenthColWidth}>
                                                            {item.Margin}
                                                        </td>
                                                        <td className="text-end" style={elewnthColWidth}>
                                                            {item.Emp}
                                                        </td>

                                                    </tr>
                                                );
                                            })}
                                            {Array.from({
                                                length: Math.max(0, 27 - Profits.length),
                                            }).map((_, rowIndex) => (
                                                <tr
                                                    key={`blank-${rowIndex}`}
                                                    style={{
                                                        backgroundColor: getcolor,
                                                        color: fontcolor,
                                                    }}
                                                >
                                                    {Array.from({ length: 11 }).map((_, colIndex) => (
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
                                                <td style={seventhColWidth}></td>
                                                <td style={eightColWidth}></td>
                                                <td style={sixthColWidth}></td>
                                                <td style={ninthColWidth}></td>
                                                <td style={tenthColWidth}></td>
                                                <td style={elewnthColWidth}></td>

                                            </tr>
                                        </>
                                    )}
                                </tbody>
                            </table>
                        </div>

                        <div
                            style={{
                                borderBottom: `1px solid ${fontcolor}`,
                                borderTop: `1px solid ${fontcolor}`,
                                height: "24px",
                                display: "flex",
                                paddingRight: "1.2%",
                                width: '101.2%',

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
                            </div>
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
                            <div
                                style={{
                                    ...sixthColWidth,
                                    background: getcolor,
                                    borderRight: `1px solid ${fontcolor}`,
                                }}
                            >
                                <span className="mobileledger_total">{totalDebit}</span>

                            </div>
                            <div
                                style={{
                                    ...ninthColWidth,
                                    background: getcolor,
                                    borderRight: `1px solid ${fontcolor}`,
                                }}
                            >
                                <span className="mobileledger_total">{totalCredit}</span>
                            </div>
                            <div
                                style={{
                                    ...tenthColWidth,
                                    background: getcolor,
                                    borderRight: `1px solid ${fontcolor}`,
                                }}
                            >
                                <span className="mobileledger_total">{closingBalance}</span>

                            </div>
                            <div
                                style={{
                                    ...elewnthColWidth,
                                    background: getcolor,
                                    borderRight: `1px solid ${fontcolor}`,
                                }}
                            >

                            </div>


                        </div>

                        <div style={{ display: 'flex' }}>
                            <div style={{ width: '60%', border: '1px solid white' }}>
                                <div
                                    style={{
                                        overflowY: "auto",
                                        width: "98%",
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
                                                <td className="border-dark" style={bottomfirstColWidth}>
                                                    Date
                                                </td>
                                                <td className="border-dark" style={bottomsecondColWidth}>
                                                    Trn#
                                                </td>
                                                <td className="border-dark" style={bottomthirdColWidth}>
                                                    Item
                                                </td>
                                                <td className="border-dark" style={bottomforthColWidth}>
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
                                        maxHeight: "25vh",
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
                                                    <tr
                                                        style={{
                                                            backgroundColor: getcolor,
                                                        }}
                                                    >
                                                        <td colSpan="4" className="text-center">
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
                                                                {Array.from({ length: 4 }).map((_, colIndex) => (
                                                                    <td key={`blank-${rowIndex}-${colIndex}`}>
                                                                        &nbsp;
                                                                    </td>
                                                                ))}
                                                            </tr>
                                                        )
                                                    )}
                                                    <tr>
                                                        <td style={bottomfirstColWidth}></td>
                                                        <td style={bottomsecondColWidth}></td>
                                                        <td style={bottomthirdColWidth}></td>
                                                        <td style={bottomforthColWidth}></td>

                                                    </tr>
                                                </>
                                            ) : (
                                                <>
                                                    {Expenses.map((item, i) => {
                                                        // totalEnteries += 1;
                                                        return (
                                                            <tr
                                                                // key={`${i}-${selectedIndex}`}
                                                                // ref={(el) => (rowRefs.current[i] = el)}
                                                                // onClick={() => handleRowClick(i)}
                                                                // className={
                                                                //     selectedIndex === i ? "selected-background" : ""

                                                                // }
                                                                style={{
                                                                    backgroundColor: getcolor,
                                                                    color: fontcolor,
                                                                }}
                                                            >
                                                                <td className="text-start" style={bottomfirstColWidth}>
                                                                    {item.Date}
                                                                </td>
                                                                <td className="text-start" style={bottomsecondColWidth}>
                                                                    {item['Trn#']}
                                                                </td>
                                                                <td className="text-start" style={bottomthirdColWidth}>
                                                                    {item.Item}
                                                                </td>
                                                                <td className="text-end" style={bottomforthColWidth}>
                                                                    {item.Amount}
                                                                </td>

                                                            </tr>
                                                        );
                                                    })}
                                                    {Array.from({
                                                        length: Math.max(0, 27 - Expenses.length),
                                                    }).map((_, rowIndex) => (
                                                        <tr
                                                            key={`blank-${rowIndex}`}
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
                                                        <td style={bottomfirstColWidth}></td>
                                                        <td style={bottomsecondColWidth}></td>
                                                        <td style={bottomthirdColWidth}></td>
                                                        <td style={bottomforthColWidth}></td>


                                                    </tr>
                                                </>
                                            )}
                                        </tbody>
                                    </table>
                                </div>


                            </div>

                            <div style={{ width: "40%" }}>

                                <div className="row" style={{ width: '100%', height: '24px', display: 'flex', margin: "0px" }}>
                                    <div style={{ width: '57%', textAlign: 'end', fontSize: getdatafontsize, fontFamily: getfontstyle }}>Total Expenses :</div>
                                    <div style={{ width: '20%', border: `1px solid ${fontcolor} `, padding: '0px', fontSize: getdatafontsize, fontFamily: getfontstyle }}>
                                        <span className="mobileledger_total">{totalExpense}</span>


                                    </div>

                                </div>
                                <div className="row" style={{ width: '100%', height: '24px', display: 'flex', margin: "0px" }}>
                                    <div style={{ width: '57%', textAlign: 'end', fontSize: getdatafontsize, fontFamily: getfontstyle }}>Net Profit :</div>
                                    <div style={{ width: '20%', border: `1px solid ${fontcolor} `, fontSize: getdatafontsize, fontFamily: getfontstyle, padding: '0px' }}>
                                        <span className="mobileledger_total">{Netprofit}</span>

                                    </div>
                                </div>
                                <div className="row simple_line" style={{ display: 'flex', justifyContent: 'center' }}>
                                    <div style={{ width: '80%', border: `1px solid ${fontcolor} ` }}></div>
                                    <div >
                                    </div>
                                </div>
                                <div className="row" style={{ width: '100%', height: '24px', display: 'flex', margin: "0px" }}>
                                    <div style={{ width: '57%', textAlign: 'end', fontSize: getdatafontsize, fontFamily: getfontstyle }}>Other Income :</div>
                                    <div style={{ width: '20%', border: `1px solid ${fontcolor} `, fontSize: getdatafontsize, fontFamily: getfontstyle, padding: '0px' }}>
                                        <span className="mobileledger_total">{Otherincome}</span>

                                    </div>

                                </div>
                                <div className="row" style={{ width: '100%', height: '24px', display: 'flex', margin: "0px" }}>
                                    <div style={{ width: '57%', textAlign: 'end', fontSize: getdatafontsize, fontFamily: getfontstyle }}>Total Profit :</div>
                                    <div style={{ width: '20%', border: `1px solid ${fontcolor} `, fontSize: getdatafontsize, fontFamily: getfontstyle, padding: '0px' }}>
                                        <span className="mobileledger_total">{totalprofit}</span>

                                    </div>

                                </div>

                            </div>

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
                            id="searchsubmit"
                            text="Select"
                            ref={input4Ref}
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
