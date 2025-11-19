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
import { useHotkeys } from "react-hotkeys-hook";
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
        getdatafontsize,
        getnavbarbackgroundcolor
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
            // code: organisation.code,
            // FLocCod: locationnumber || getLocationNumber,
            // FYerDsc: yeardescription || getYearDescription,

            code: 'NASIRTRD',
            FLocCod: '001',
            FYerDsc: '2024-2024',


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
            width: 340,
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
            color: state.isSelected ? "white" : fontcolor,
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

        const columnWidths = [18, 40, 35, 35, 35];

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

                    if (cellIndex === 12) {
                        const rightAlignX = startX + columnWidths[cellIndex] / 2; // Adjust for right alignment
                        doc.text(cellValue, rightAlignX, cellY, {
                            align: "center",
                            baseline: "middle",
                        });
                    }

                    else if (cellIndex === 2 || cellIndex === 3 || cellIndex === 4) {
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

        const numColumns = 6; // Ensure this matches the actual number of columns

        const columnAlignments = [
            "left", "left", "right", "right", "right"

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
        const companyRow = worksheet.addRow([comapnyname]);
        companyRow.eachCell((cell) => {
            cell.font = fontCompanyName;
            cell.alignment = { horizontal: "center" };
        });

        worksheet.getRow(companyRow.number).height = 30;
        worksheet.mergeCells(
            `A${companyRow.number}:${String.fromCharCode(64 + numColumns - 1)}${companyRow.number
            }`
        );

        // Add Store List row
        const storeListRow = worksheet.addRow([`Customer Progress Report As On ${toInputDate}`]);
        storeListRow.eachCell((cell) => {
            cell.font = fontStoreList;
            cell.alignment = { horizontal: "center" };
        });

        worksheet.mergeCells(
            `A${storeListRow.number}:${String.fromCharCode(64 + numColumns - 1)}${storeListRow.number
            }`
        );

        // Add an empty row after the title section
        worksheet.addRow([]);


        let Accountselect = Companyselectdatavalue.label ? Companyselectdatavalue.label : "ALL";
        let status = transectionType ? transectionType : "ALL";
        let typesearch = searchQuery || "";

        // Apply styling for the status row
        const typeAndStoreRow2 = worksheet.addRow(
            ["ACCOUNT :", Accountselect, "", "YEAR :", status]
        );

        // Merge cells for Accountselect (columns B to D)
        worksheet.mergeCells(`B${typeAndStoreRow2.number}:C${typeAndStoreRow2.number}`);

        // Apply styling for the status row
        typeAndStoreRow2.eachCell((cell, colIndex) => {
            cell.font = {
                name: "CustomFont" || "CustomFont",
                size: 10,
                bold: [1, 4].includes(colIndex),
            };
            cell.alignment = {
                horizontal: colIndex === 2 ? "left" : "left", // Left align the account name
                vertical: "middle"
            };
        });


        // Header style
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
            "Sr#", "Month", "Debit", "Credit", "Balance"
        ];
        const headerRow = worksheet.addRow(headers);
        headerRow.eachCell((cell) => Object.assign(cell, headerStyle));

        // Add data rows
        tableData.forEach((item) => {
            const row = worksheet.addRow([
                item["Sr#"],
                item.Month,
                item.Debit,
                item.Credit,
                item.Balance,
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

        const totalRow = worksheet.addRow([
            totalDebit,
            `${totalde} | ${closingBalance}`, // Add spacing
            amt4,
            amt5,
            amt6,

        ]);

        // total row added

        totalRow.eachCell((cell, colNumber) => {
            cell.font = { bold: true };
            cell.border = {
                top: { style: "double" },
                left: { style: "thin" },
                bottom: { style: "double" },
                right: { style: "thin" },
            };

            // Align only the "Total" text to the right
            if (colNumber === 1 || colNumber === 2 || colNumber === 3 || colNumber === 4 || colNumber === 5) {
                cell.alignment = { horizontal: "right" };
            }
        });

        // Set column widths
        [11, 25, 15, 15, 15].forEach((width, index) => {
            worksheet.getColumn(index + 1).width = width;
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
        const blob = new Blob([buffer], {
            type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        });
        saveAs(blob, `Customer Progress Report As On ${toInputDate}.xlsx`);
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
        width: "14%",
    };
    const secondColWidth = {
        width: "25%",
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

    useHotkeys("alt+s", () => {
        fetchGeneralLedger();
        //    resetSorting();
    }, { preventDefault: true, enableOnFormTags: true });

    useHotkeys("alt+p", exportPDFHandler, { preventDefault: true, enableOnFormTags: true });
    useHotkeys("alt+e", handleDownloadCSV, { preventDefault: true, enableOnFormTags: true });
    // useHotkeys("esc", () => navigate("/MainPage"));

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
        width: isSidebarVisible ? "calc(35vw - 0%)" : "35vw",
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

                            <div
                                className="d-flex align-items-center"
                                style={{ marginRight: "22px" }}
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
                                    onKeyDown={(e) => handleKeyPress(e, input3Ref)}
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
                                width: "97%",
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
                                        backgroundColor: getnavbarbackgroundcolor,
                                    }}
                                >
                                    <tr
                                        style={{
                                            backgroundColor: getnavbarbackgroundcolor,
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
                                maxHeight: "52vh",
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
                                                        <td className="text-start" style={firstColWidth}>
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
                                //  width: "43px",
                                ...firstColWidth,
                                background: getcolor,
                                borderRight: `1px solid ${fontcolor}`,
                            }}
                        >
                            <span className="mobileledger_total">{totalDebit}</span>
                        </div>

                        <div
                            style={{
                                //  width: "43px",
                                ...secondColWidth,
                                background: getcolor,
                                borderRight: `1px solid ${fontcolor}`,
                            }}
                        >
                            <span className="mobileledger_total">{closingBalance}</span>
                        </div>

                        <div
                            style={{
                                //  width: "43px",
                                ...thirdColWidth,
                                background: getcolor,
                                borderRight: `1px solid ${fontcolor}`,
                            }}
                        >
                            <span className="mobileledger_total">{amt4}</span>
                        </div>
                        <div
                            style={{
                                //  width: "43px",
                                ...forthColWidth,
                                background: getcolor,
                                borderRight: `1px solid ${fontcolor}`,
                            }}
                        >
                            <span className="mobileledger_total">{amt5}</span>
                        </div>
                        <div
                            style={{
                                //  width: "43px",
                                ...fifthColWidth,
                                background: getcolor,
                                borderRight: `1px solid ${fontcolor}`,
                            }}
                        >
                            <span className="mobileledger_total">{amt6}</span>
                        </div>

                    </div>

                    {/* <div
                        style={{
                            width: "98.5%",
                            borderBottom: `1px solid ${fontcolor}`,
                            height: "24px",
                            display: "flex",
                        }}
                    >
                        <div
                            style={{
                                width: '58px',
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
                                    width: '54px',
                                    background: getcolor,
                                    borderRight: `1px solid ${fontcolor}`,
                                }}
                            >
                                <span className="mobileledger_total">{totalde}</span>


                            </div>

                            <div
                                style={{
                                    width: '54px',
                                    background: getcolor,
                                    borderRight: `1px solid ${fontcolor}`,
                                }}
                            >
                                <span className="mobileledger_total">{closingBalance}</span>


                            </div>


                        </div>
                        <div
                            style={{
                               width: '82px',
                                background: getcolor,
                                borderRight: `1px solid ${fontcolor}`,
                            }}
                        >
                            <span className="mobileledger_total">{amt4}</span>


                        </div>
                        <div
                            style={{
                              width: '82px',
                                background: getcolor,
                                borderRight: `1px solid ${fontcolor}`,
                            }}
                        >
                            <span className="mobileledger_total">{amt5}</span>

                        </div>
                        <div
                            style={{
                                 width: '82px',
                                background: getcolor,
                                borderRight: `1px solid ${fontcolor}`,
                            }}
                        >
                            <span className="mobileledger_total">{amt6}</span>

                        </div>
                    </div> */}

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




