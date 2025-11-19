import React, { useState, useEffect, useRef } from "react";
import { Container, Spinner, Nav } from "react-bootstrap";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import { useTheme } from "../../ThemeContext";
import { getUserData, getOrganisationData, getLocationnumber, getYearDescription } from "../Auth";
import NavComponent from "../MainComponent/Navform/navbarform";
import SingleButton from "../MainComponent/Button/SingleButton/SingleButton";
import Select from "react-select";
import { components } from "react-select";
import { BsCalendar } from "react-icons/bs";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import jsPDF from "jspdf";
import ExcelJS from "exceljs";
// import { useHotkeys } from "react-hotkeys-hook";
import { saveAs } from "file-saver";
import "react-calendar/dist/Calendar.css";
import { useSelector, useDispatch } from "react-redux";
import { useHotkeys } from "react-hotkeys-hook";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Balance, Collections } from "@mui/icons-material";


export default function MemberRecivableReport() {
    const navigate = useNavigate();
    const user = getUserData();
    const organisation = getOrganisationData();

    const saleSelectRef = useRef(null);
    const input1Ref = useRef(null);
    const input2Ref = useRef(null);
    const input3Ref = useRef(null);
    const input4Ref = useRef(null);

    const storeRef = useRef(null);

    const toRef = useRef(null);
    const fromRef = useRef(null);

    const [saleType, setSaleType] = useState("");
    const [searchQuery, setSearchQuery] = useState("");
    const [transectionType, settransectionType] = useState("R");
    const [supplierList, setSupplierList] = useState([]);

    const [storeList, setStoreList] = useState([]);
    const [Companyselectdatavalue, setCompanyselectdatavalue] = useState("")
    const [storeType, setStoreType] = useState("");

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

    const yeardescription = getYearDescription();
    const locationnumber = getLocationnumber();

    useEffect(() => {
        document.documentElement.style.setProperty("--background-color", getcolor);
    }, [getcolor]);

    const comapnyname = organisation.description;

    const [selectedRadio, setSelectedRadio] = useState("custom"); // State to track selected radio button
    const [menuStoreIsOpen, setMenuStoreIsOpen] = useState(false);
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

        const apiUrl = apiLinks + "/MemberReceivableReport.php";
        setIsLoading(true);
        const formData = new URLSearchParams({
            FIntDat: fromInputDate,
            FFnlDat: toInputDate,
            FRepTyp: transectionType,
            code: organisation.code,
            FLocCod: locationnumber || getLocationNumber,
            FYerDsc: yeardescription || getYearDescription,
            code: 'FITNESSGYM',
            FLocCod: '001',
            FYerDsc: '2025-2025',

            FSchTxt: searchQuery

        }).toString();

        axios
            .post(apiUrl, formData)
            .then((response) => {
                setIsLoading(false);

                setTotalOpening(response.data["Total Opening"]);
                setTotalDebit(response.data["Total Fee"]);
                setTotalCredit(response.data["Total Collection"]);
                setClosingBalance(response.data["Total Balance"]);

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



    const focusNextElement = (currentRef, nextRef) => {
        if (currentRef.current && nextRef.current) {
            currentRef.current.focus();
            nextRef.current.focus();
        }
    };

    const handleStoreEnter = (e) => {
        if (e.key === "Enter" && !menuStoreIsOpen) {
            e.preventDefault();
            focusNextElement(storeRef, input3Ref);
        }
    };

    const handleTransactionTypeChange = (event) => {
        const selectedTransactionType = event.target.value;
        settransectionType(selectedTransactionType);
    };

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





    ///////////////////////////// DOWNLOAD PDF CODE ////////////////////////////////////////////////////////////
    const exportPDFHandler = () => {

        const globalfontsize = 12;
        console.log('gobal font data', globalfontsize)

        // Create a new jsPDF instance with landscape orientation
        const doc = new jsPDF({ orientation: "portraite" });

        // Define table data (rows)
        const rows = tableData.map((item) => [
            item.code,
            item.Description,
            item.Opening,
            item.Fee,
            item.Collection,
            item.Balance,


        ]);

        // Add summary row to the table
        rows.push([
            "",
            "",
            String(totalOpening),
            String(totalDebit),
            String(totalCredit),
            String(closingBalance),

        ]);

        // Define table column headers and individual column widths
        const headers = [
            "code",
            "Description",
            "Opening",
            "Fee",
            "Collection",
            "Balance"


        ];
        const columnWidths = [22, 70, 22, 22, 22, 22]

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

        //     doc.setFontSize(11);

        //     for (let i = startIndex; i < endIndex; i++) {
        //         const row = rows[i];
        //         const isOddRow = i % 2 !== 0; // Check if the row index is odd
        //         const isRedRow = row[0] && parseInt(row[0]) > 10000000000; // Check if tctgcod is greater than 100
        //         const isTotalRow = i === rows.length - 1; // Check if this is the total row
        //         let textColor = [0, 0, 0]; // Default text color
        //         let fontName = normalFont; // Default font

        //         if (isRedRow) {
        //             textColor = [255, 0, 0]; // Red color
        //             fontName = boldFont; // Set bold font for red-colored row
        //         }

        //         // Set background color for odd-numbered rows
        //         if (isOddRow) {
        //             doc.setFillColor(240); // Light background color
        //             doc.rect(
        //                 startX,
        //                 startY + (i - startIndex + 2) * rowHeight,
        //                 tableWidth,
        //                 rowHeight,
        //                 "F"
        //             );
        //         }

        //         // For total row, set bold font and prepare for double border
        //         if (isTotalRow) {
        //             doc.setFont(getfontstyle, 'bold');
        //         }

        //         // Draw row borders
        //         doc.setDrawColor(0); // Set color for borders

        //         // For total row, draw double border
        //         if (isTotalRow) {
        //             // First line of the double border
        //             doc.setLineWidth(0.3);
        //             doc.rect(
        //                 startX,
        //                 startY + (i - startIndex + 2) * rowHeight,
        //                 tableWidth,
        //                 rowHeight
        //             );

        //             // Second line of the double border (slightly offset)
        //             doc.setLineWidth(0.3);
        //             doc.rect(
        //                 startX + 0.5,
        //                 startY + (i - startIndex + 2) * rowHeight + 0.5,
        //                 tableWidth - 1,
        //                 rowHeight - 1
        //             );
        //         } else {
        //             // Normal border for other rows
        //             doc.setLineWidth(0.2);
        //             doc.rect(
        //                 startX,
        //                 startY + (i - startIndex + 2) * rowHeight,
        //                 tableWidth,
        //                 rowHeight
        //             );
        //         }

        //         row.forEach((cell, cellIndex) => {
        //             // For total row, adjust vertical position to center in the double border
        //             const cellY = isTotalRow
        //                 ? startY + (i - startIndex + 2) * rowHeight + rowHeight / 2
        //                 : startY + (i - startIndex + 2) * rowHeight + 3;

        //             const cellX = startX + 2;

        //             // Set text color
        //             doc.setTextColor(textColor[0], textColor[1], textColor[2]);

        //             // For total row, keep bold font
        //             if (!isTotalRow) {
        //                 // Set font
        //                 doc.setFont(fontName, "normal");
        //             }

        //             // Ensure the cell value is a string
        //             const cellValue = String(cell);

        //             if (cellIndex === 2 || cellIndex === 3 || cellIndex === 4 || cellIndex === 5) {
        //                 const rightAlignX = startX + columnWidths[cellIndex] - 2; // Adjust for right alignment
        //                 doc.text(cellValue, rightAlignX, cellY, {
        //                     align: "right",
        //                     baseline: "middle", // This centers vertically
        //                 });
        //             } else {
        //                 // For empty cells in total row, add "Total" label centered
        //                 if (isTotalRow && cellIndex === 0 && cell === "") {
        //                     const totalLabelX = startX + columnWidths[0] / 2;
        //                     doc.text("", totalLabelX, cellY, {
        //                         align: "center",
        //                         baseline: "middle"
        //                     });
        //                 } else {
        //                     doc.text(cellValue, cellX, cellY, {
        //                         baseline: "middle" // This centers vertically
        //                     });
        //                 }
        //             }

        //             // Draw column borders (excluding the last column)
        //             if (cellIndex < row.length - 1) {
        //                 if (isTotalRow) {
        //                     // Double border for total row columns
        //                     doc.setLineWidth(0.3);
        //                     doc.rect(
        //                         startX,
        //                         startY + (i - startIndex + 2) * rowHeight,
        //                         columnWidths[cellIndex],
        //                         rowHeight
        //                     );
        //                     doc.setLineWidth(0.3);
        //                     doc.rect(
        //                         startX + 0.5,
        //                         startY + (i - startIndex + 2) * rowHeight + 0.5,
        //                         columnWidths[cellIndex] - 1,
        //                         rowHeight - 1
        //                     );
        //                 } else {
        //                     // Normal border for other rows
        //                     doc.setLineWidth(0.2);
        //                     doc.rect(
        //                         startX,
        //                         startY + (i - startIndex + 2) * rowHeight,
        //                         columnWidths[cellIndex],
        //                         rowHeight
        //                     );
        //                 }
        //                 startX += columnWidths[cellIndex];
        //             }
        //         });

        //         // Draw border for the last column
        //         if (isTotalRow) {
        //             // Double border for total row last column
        //             doc.setLineWidth(0.3);
        //             doc.rect(
        //                 startX,
        //                 startY + (i - startIndex + 2) * rowHeight,
        //                 columnWidths[row.length - 1],
        //                 rowHeight
        //             );
        //             doc.setLineWidth(0.3);
        //             doc.rect(
        //                 startX + 0.5,
        //                 startY + (i - startIndex + 2) * rowHeight + 0.5,
        //                 columnWidths[row.length - 1] - 1,
        //                 rowHeight - 1
        //             );
        //         } else {
        //             // Normal border for other rows last column
        //             doc.setLineWidth(0.2);
        //             doc.rect(
        //                 startX,
        //                 startY + (i - startIndex + 2) * rowHeight,
        //                 columnWidths[row.length - 1],
        //                 rowHeight
        //             );
        //         }
        //         startX = (doc.internal.pageSize.width - tableWidth) / 2; // Adjusted for center alignment

        //         // Reset font after total row
        //         if (isTotalRow) {
        //             doc.setFont(getfontstyle, "normal");
        //         }
        //     }

        //     // Rest of your function remains the same...
        //     // Draw line at the bottom of the page with padding
        //     const lineWidth = tableWidth; // Match line width with table width
        //     const lineX = (doc.internal.pageSize.width - tableWidth) / 2; // Center line
        //     const lineY = pageHeight - 15; // Position the line 20 units from the bottom
        //     doc.setLineWidth(0.3);
        //     doc.line(lineX, lineY, lineX + lineWidth, lineY); // Draw line
        //     const headingFontSize = 11; // Adjust as needed

        //     // Add heading "Crystal Solution" aligned left bottom of the line
        //     const headingX = lineX + 2; // Padding from left
        //     const headingY = lineY + 5; // Padding from bottom
        //     doc.setFontSize(headingFontSize); // Set the font size for the heading
        //     doc.setTextColor(0); // Reset text color to default
        //     doc.text(`Crystal Solution \t ${date} \t ${time}`, headingX, headingY);
        // };


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

                    if (cellIndex === 2 || cellIndex === 3 || cellIndex === 4 || cellIndex === 5) {
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

                addTitle(`Member Receivable Report From: ${fromInputDate} To: ${toInputDate}`, "", "", pageNumber, startY, 12); // Render sale report title with decreased font size, provide the time, and page number
                startY += -5;

                const labelsX = (doc.internal.pageSize.width - totalWidth) / 2;
                const labelsY = startY + 4; // Position the labels below the titles and above the table

                // Set font size and weight for the labels
                doc.setFontSize(12);
                doc.setFont(getfontstyle, "300");


                let status = transectionType === "P"
                    ? "PAID"
                    : transectionType === "R"
                        ? "RECEIVABLE"
                        : "ALL";

                let search = searchQuery ? searchQuery : "";
                // Set font style, size, and family
                doc.setFont(getfontstyle, "300"); // Font family and style ('normal', 'bold', 'italic', etc.)
                doc.setFontSize(10); // Font size


                doc.setFont(getfontstyle, 'bold'); // Set font to bold
                doc.text(`TYPE :`, labelsX, labelsY + 8.5); // Draw bold label
                doc.setFont(getfontstyle, 'normal'); // Reset font to normal
                doc.text(`${status}`, labelsX + 15, labelsY + 8.5); // Draw the value next to the label

                if (searchQuery) {
                    doc.setFont(getfontstyle, 'bold'); // Set font to bold
                    doc.text(`SEARCH :`, labelsX + 100, labelsY + 8.5); // Draw bold label
                    doc.setFont(getfontstyle, 'normal'); // Reset font to normal
                    doc.text(`${search}`, labelsX + 120, labelsY + 8.5); // Draw the value next to the label
                }


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

        // Save the PDF files
        doc.save(`MemberReceivableReport Form ${fromInputDate} To ${toInputDate}.pdf`);


    };
    ///////////////////////////// DOWNLOAD PDF CODE ////////////////////////////////////////////////////////////

    ///////////////////////////// DOWNLOAD PDF EXCEL //////////////////////////////////////////////////////////
    const handleDownloadCSV = async () => {
        try {
            // Validate required variables
            if (!ExcelJS || !saveAs) {
                throw new Error("Required libraries not loaded");
            }

            // Initialize workbook
            const workbook = new ExcelJS.Workbook();
            workbook.creator = 'Your Application Name';
            workbook.lastModifiedBy = 'Your Application';
            workbook.created = new Date();
            workbook.modified = new Date();

            const worksheet = workbook.addWorksheet("Member Receivable Report", {
                views: [{ showGridLines: false }]
            });

            // Constants
            const numColumns = 6;
            const columnWidths = [12, 40, 14, 15, 15, 15];
            const columnAlignments = ["left", "left", "right", "right", "right", "right"];
            const headerNames = ["Code", "Description", "Opening", "Fee", "Collection", "Balance"];

            // Font definitions
            const fonts = {
                companyName: { name: "Arial", size: 18, bold: true },
                reportTitle: { name: "Arial", size: 10, bold: false },
                header: { name: "Arial", size: 10, bold: true },
                data: { name: "Arial", size: 10, bold: false },
                footer: { name: "Arial", size: 10, bold: false }
            };

            // Styles
            const headerStyle = {
                font: fonts.header,
                alignment: { horizontal: "center", vertical: "middle" },
                fill: {
                    type: "pattern",
                    pattern: "solid",
                    fgColor: { argb: "FFC6D9F7" }
                },
                border: {
                    top: { style: "thin" },
                    left: { style: "thin" },
                    bottom: { style: "thin" },
                    right: { style: "thin" }
                }
            };

            const dataCellStyle = (colIndex) => ({
                font: fonts.data,
                border: {
                    top: { style: "thin" },
                    left: { style: "thin" },
                    bottom: { style: "thin" },
                    right: { style: "thin" }
                },
                alignment: {
                    horizontal: columnAlignments[colIndex] || "left",
                    vertical: "middle"
                }
            });

            // Add title section
            worksheet.addRow([]); // Empty row

            const companyName = organisation.code

            // Company name
            const companyRow = worksheet.addRow([companyName || "Company Name"]);
            companyRow.eachCell(cell => {
                cell.font = fonts.companyName;
                cell.alignment = { horizontal: "center" };
            });
            worksheet.mergeCells(`A${companyRow.number}:F${companyRow.number}`);
            companyRow.height = 30;

            // Report title
            const titleRow = worksheet.addRow([
                `Member Receivable Report From ${fromInputDate} To ${toInputDate}`
            ]);
            titleRow.eachCell(cell => {
                cell.font = fonts.reportTitle;
                cell.alignment = { horizontal: "center" };
            });
            worksheet.mergeCells(`A${titleRow.number}:F${titleRow.number}`);

            // Empty row
            worksheet.addRow([]);

            // Report filters
            const typestatus = transectionType === "R" ? "RECEIVABLE" :
                transectionType === "P" ? "PAID" : "ALL";

            const filterValues = ["TYPE:", typestatus];
            if (searchQuery) {
                filterValues.push("", "", "SEARCH:", searchQuery);
            }

            const filterRow = worksheet.addRow(filterValues);
            filterRow.eachCell((cell, colNumber) => {
                cell.font = fonts.data;
                cell.alignment = { horizontal: "left" };
                if (colNumber === 1 || colNumber === 5) { // Bold the values
                    cell.font = { ...fonts.data, bold: true };
                }
            });

            // Column headers
            const headerRow = worksheet.addRow(headerNames);
            headerRow.eachCell(cell => Object.assign(cell, headerStyle));

            // Data rows
            tableData.forEach(item => {
                const row = worksheet.addRow([
                    item.code || "",
                    item.Description || "",
                    item.Opening || 0,
                    item.Fee || 0,
                    item.Collection || 0,
                    item.Balance || 0
                ]);

                row.eachCell((cell, colNumber) => {
                    Object.assign(cell, dataCellStyle(colNumber - 1));

                    // Format numeric columns
                    if (colNumber >= 3 && colNumber <= 6) {
                        cell.numFmt = '#,##0.00';
                    }
                });
            });

            // Set column widths
            columnWidths.forEach((width, index) => {
                worksheet.getColumn(index + 1).width = width;
            });

            // Total row
            const totalRow = worksheet.addRow([
                "",
                "Total",
                totalOpening || 0,
                totalDebit || 0,
                totalCredit || 0,
                closingBalance || 0
            ]);

            totalRow.eachCell((cell, colNumber) => {
                cell.font = { ...fonts.data, bold: true };
                cell.border = {
                    top: { style: "thin" },
                    left: { style: "thin" },
                    bottom: { style: "thin" },
                    right: { style: "thin" }
                };

                if (colNumber >= 3 && colNumber <= 6) {
                    cell.numFmt = '#,##0.00';
                    cell.alignment = { horizontal: "right" };
                }
            });

            // Footer section
            worksheet.addRow([]); // Empty row

            // Current date and time
            const now = new Date();
            const formatTime = (date) => date.toLocaleTimeString('en-US', { hour12: false });
            const formatDate = (date) => {
                const day = String(date.getDate()).padStart(2, "0");
                const month = String(date.getMonth() + 1).padStart(2, "0");
                const year = date.getFullYear();
                return `${day}-${month}-${year}`;
            };

            const footerRow1 = worksheet.addRow([`DATE: ${formatDate(now)}  TIME: ${formatTime(now)}`]);
            const footerRow2 = worksheet.addRow([`USER ID: ${user?.tusrid || "N/A"}`]);

            [footerRow1, footerRow2].forEach(row => {
                row.eachCell(cell => {
                    cell.font = fonts.footer;
                    cell.alignment = { horizontal: "left" };
                });
                worksheet.mergeCells(`A${row.number}:F${row.number}`);
            });

            // Generate file
            const buffer = await workbook.xlsx.writeBuffer();
            const blob = new Blob([buffer], {
                type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
            });

            saveAs(blob, `MemberReceivableReport_${fromInputDate}_to_${toInputDate}.xlsx`);

        } catch (error) {
            console.error("Error generating Excel report:", error);
            alert("Failed to generate Excel file. Please try again or contact support.");
        }
    };
    ///////////////////////////// DOWNLOAD PDF EXCEL ///////////////////////////////////////////////////////////

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
        width: "10.6%",
    };
    const secondColWidth = {
        width: "40%",
    };
    const thirdColWidth = {
        width: "12%",
    };
    const forthColWidth = {
        width: "12%",
    };
    const fifthColWidth = {
        width: "12%",
    };

    const sixthColWidth = {
        width: "12%",
    };


    const [columns, setColumns] = useState({
        code: [],
        Description: [],
        Opening: [],
        Fee: [],
        Collection: [],
        Balance: [],
    });
    const [columnSortOrders, setColumnSortOrders] = useState({
        code: "",
        Description: "",
        Opening: "",
        Fee: "",
        Collection: "",
        Balance: "",
    });

    useEffect(() => {
        if (tableData.length > 0) {
            const newColumns = {
                code: tableData.map((row) => row.code),
                Description: tableData.map((row) => row.Description),
                Opening: tableData.map((row) => row.Opening),
                Fee: tableData.map((row) => row.Fee),
                Collection: tableData.map((row) => row.Collection),
                Balance: tableData.map((row) => row.Balance),

            };
            setColumns(newColumns);
        }
    }, [tableData]);

    // const handleSorting = (col) => {
    //     // Determine the new sort order
    //     const currentOrder = columnSortOrders[col];
    //     const newOrder = currentOrder === "ASC" ? "DSC" : "ASC";

    //     // Create a copy of the table data to sort
    //     const sortedData = [...tableData];

    //     // Sort the data based on the column and order
    //     sortedData.sort((a, b) => {
    //         // Get the values to compare
    //         const aVal = a[col] !== null && a[col] !== undefined ? a[col].toString() : "";
    //         const bVal = b[col] !== null && b[col] !== undefined ? b[col].toString() : "";

    //         // Try to compare as numbers first
    //         const numA = parseFloat(aVal.replace(/,/g, ""));
    //         const numB = parseFloat(bVal.replace(/,/g, ""));

    //         if (!isNaN(numA) && !isNaN(numB)) {
    //             return newOrder === "ASC" ? numA - numB : numB - numA;
    //         }

    //         // Fall back to string comparison
    //         return newOrder === "ASC"
    //             ? aVal.localeCompare(bVal)
    //             : bVal.localeCompare(aVal);
    //     });

    //     // Update the table data with the sorted data
    //     setTableData(sortedData);

    //     // Update the sort order state for the clicked column
    //     setColumnSortOrders({
    //         ...columnSortOrders,
    //         [col]: newOrder
    //     });
    // };


    const handleSorting = (col) => {
        // Determine the new sort order
        const currentOrder = columnSortOrders[col];
        const newOrder = currentOrder === "ASC" ? "DSC" : "ASC";

        // Create a copy of the table data to sort
        const sortedData = [...tableData];

        // Sort the data based on the column and order
        sortedData.sort((a, b) => {
            // Get the values to compare
            const aVal = a[col] !== null && a[col] !== undefined ? a[col].toString() : "";
            const bVal = b[col] !== null && b[col] !== undefined ? b[col].toString() : "";

            // Special handling for code column
            if (col === "code" && aVal.includes("-") && bVal.includes("-")) {
                // Split the codes into parts
                const aParts = aVal.split("-");
                const bParts = bVal.split("-");

                // Compare each part numerically
                for (let i = 0; i < Math.max(aParts.length, bParts.length); i++) {
                    const aPart = parseInt(aParts[i] || "0", 10);
                    const bPart = parseInt(bParts[i] || "0", 10);

                    if (aPart !== bPart) {
                        return newOrder === "ASC" ? aPart - bPart : bPart - aPart;
                    }
                }
                return 0;
            }

            // Try to compare as numbers first
            const numA = parseFloat(aVal.replace(/,/g, ""));
            const numB = parseFloat(bVal.replace(/,/g, ""));

            if (!isNaN(numA) && !isNaN(numB)) {
                return newOrder === "ASC" ? numA - numB : numB - numA;
            }

            // Fall back to string comparison
            return newOrder === "ASC"
                ? aVal.localeCompare(bVal)
                : bVal.localeCompare(aVal);
        });

        // Update the table data with the sorted data
        setTableData(sortedData);

        // Reset all sort orders and set the new one for the clicked column
        const resetSortOrders = Object.keys(columnSortOrders).reduce((acc, key) => {
            acc[key] = key === col ? newOrder : null;
            return acc;
        }, {});

        setColumnSortOrders(resetSortOrders);
    };

    const resetSorting = () => {
        setColumnSortOrders({
            code: null,
            Description: null,
            Opening: null,
            Fee: null,
            Collection: null,
            Balance: null

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



    useHotkeys("alt+s", () => {
        fetchReceivableReport();
        resetSorting();
    }, { preventDefault: true });

    useHotkeys("alt+p", exportPDFHandler, { preventDefault: true });
    useHotkeys("alt+e", handleDownloadCSV, { preventDefault: true });
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
        width: isSidebarVisible ? "calc(60VW - 0%)" : "60VW",
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
                    <NavComponent textdata="Member Receivable Report" />
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
                            <div className="d-flex align-items-center justify-content-between"
                                style={{ width: '100%' }}
                            >


                                <div
                                    className="d-flex align-items-center"
                                    style={{ marginLeft: "20px" }}
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
                                            <label htmlFor="custom" style={{ fontSize: getdatafontsize, fontFamily: getfontstyle, }}>Custom</label>
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
                                            <label htmlFor="30" style={{ fontSize: getdatafontsize, fontFamily: getfontstyle, }}>30 Days</label>
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
                                            <label htmlFor="60" style={{ fontSize: getdatafontsize, fontFamily: getfontstyle, }}>60 Days</label>
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
                                            <label htmlFor="90" style={{ fontSize: getdatafontsize, fontFamily: getfontstyle, }}>90 Days</label>
                                        </div>
                                    </div>
                                </div>


                                <div
                                    className="d-flex align-items-center"
                                    style={{ marginRight: "30px" }}
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
                                        ref={input1Ref}
                                        onKeyDown={(e) => handleKeyPress(e, input3Ref)}
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
                                            width: "200px",
                                            height: "24px",
                                            marginLeft: "5px",
                                            backgroundColor: getcolor,
                                            border: `1px solid ${fontcolor}`,
                                            fontSize: getdatafontsize, fontFamily: getfontstyle,
                                            color: fontcolor,
                                        }}
                                    >
                                        <option value="">ALL</option>
                                        <option value="R">RECEIVABLE</option>
                                        <option value="P">PAID</option>


                                    </select>
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
                                                        fontSize: getdatafontsize, fontFamily: getfontstyle, color: fontcolor,
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
                                            fontSize: getdatafontsize, fontFamily: getfontstyle, backgroundColor: getcolor,
                                            color: fontcolor,
                                            opacity: selectedRadio === "custom" ? 1 : 0.5,
                                            pointerEvents:
                                                selectedRadio === "custom" ? "auto" : "none",
                                        }}
                                        value={toInputDate}
                                        onChange={handleToInputChange}
                                        onKeyDown={(e) => handleToKeyPress(e, "submitButton")}
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
                                                        fontSize: getdatafontsize, fontFamily: getfontstyle, color: fontcolor,
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




                            <div id="lastDiv" style={{ marginRight: "10px" }}>
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
                                        ref={input3Ref}
                                        onKeyDown={(e) => handleKeyPress(e, input4Ref)}
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
                                            onClick={() => handleSorting("Opening")}
                                        >
                                            Opening{" "}
                                            <i
                                                className="fa-solid fa-caret-down caretIconStyle"
                                                style={getIconStyle("Opening")}
                                            ></i>
                                        </td>
                                        <td
                                            className="border-dark"
                                            style={forthColWidth}
                                            onClick={() => handleSorting("Fee")}
                                        >
                                            Fee{" "}
                                            <i
                                                className="fa-solid fa-caret-down caretIconStyle"
                                                style={getIconStyle("Fee")}
                                            ></i>
                                        </td>
                                        <td
                                            className="border-dark"
                                            style={fifthColWidth}
                                            onClick={() => handleSorting("Collection")}
                                        >
                                            Collection{" "}
                                            <i
                                                className="fa-solid fa-caret-down caretIconStyle"
                                                style={getIconStyle("Collection")}
                                            ></i>
                                        </td>
                                        <td
                                            className="border-dark"
                                            style={sixthColWidth}
                                            onClick={() => handleSorting("Balance")}
                                        >
                                            Balance{" "}
                                            <i
                                                className="fa-solid fa-caret-down caretIconStyle"
                                                style={getIconStyle("Balance")}
                                            ></i>
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
                                maxHeight: "50vh",
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
                                                <td colSpan="6" className="text-center">
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
                                                        {Array.from({ length: 6 }).map((_, colIndex) => (
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
                                                            {item.code}
                                                        </td>
                                                        <td className="text-start" style={secondColWidth}>
                                                            {item.Description}
                                                        </td>
                                                        <td className="text-end" style={thirdColWidth}>
                                                            {item.Opening}
                                                        </td>
                                                        <td className="text-end" style={forthColWidth}>
                                                            {item.Fee}
                                                        </td>
                                                        <td className="text-end" style={fifthColWidth}>
                                                            {item.Collection}
                                                        </td>
                                                        <td className="text-end" style={sixthColWidth}>
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
                                                    {Array.from({ length: 6 }).map((_, colIndex) => (
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
                            <span className="mobileledger_total">{totalOpening}</span>

                        </div>
                        <div
                            style={{
                                ...forthColWidth,
                                background: getcolor,
                                borderRight: `1px solid ${fontcolor}`,
                            }}
                        >
                            <span className="mobileledger_total">{totalDebit}</span>

                        </div>
                        <div
                            style={{
                                ...fifthColWidth,
                                background: getcolor,
                                borderRight: `1px solid ${fontcolor}`,
                            }}
                        >
                            <span className="mobileledger_total">{totalCredit}</span>

                        </div>

                        <div
                            style={{
                                ...sixthColWidth,
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
                            onClick={() => {
                                fetchReceivableReport();
                                resetSorting();
                            }} style={{ backgroundColor: "#186DB7", width: "120px" }}
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

