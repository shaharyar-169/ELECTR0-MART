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

export default function DailyStatusReport() {
    const navigate = useNavigate();
    const user = getUserData();
    const organisation = getOrganisationData();

    const saleSelectRef = useRef(null);
    const input1Ref = useRef(null);

    const toRef = useRef(null);
    const fromRef = useRef(null);
    const companyRef = useRef(null);
    const categoryRef = useRef(null);
    const capacityRef = useRef(null);
    const storeRef = useRef(null);
    const typeRef = useRef(null);
    const searchRef = useRef(null);
    const selectButtonRef = useRef(null);

    const [tableData, setTableData] = useState([]);
    const [selectedSearch, setSelectedSearch] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    const [saleType, setSaleType] = useState("");
    const [searchQuery, setSearchQuery] = useState("");
    const [transectionType, settransectionType] = useState("");

    const [storeList, setStoreList] = useState([]);
    const [Companyselectdatavalue, setCompanyselectdatavalue] = useState("");
    const [storeType, setStoreType] = useState("");

    const [totalOpening, setTotalOpening] = useState(0);
    const [totalPurchase, setTotalPurchase] = useState(0);
    const [totalPurRet, setTotalPurRet] = useState(0);
    const [totalReceive, setTotalReceive] = useState(0);
    const [totalIssue, setTotalIssue] = useState(0);
    const [totalSale, setTotalSale] = useState(0);
    const [totalSaleRet, setTotalSaleRet] = useState(0);
    const [totalBalance, setTotalBalance] = useState(0);

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

    const [selectedRadio, setSelectedRadio] = useState("custom"); // State to track selected radio button

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
    const GlobaltoDate1 = formatDate1(GlobaltoDate);
    const GlobalfromDate1 = formatDate1(GlobalfromDate);

    //////////////////////// CUSTOM DATE LIMITS ////////////////////////////

    // Toggle the ToDATE CalendarOpen state on each click
    const toggleToCalendar = () => {
        settoCalendarOpen((prevOpen) => !prevOpen);
    };
    const formatDate = (date) => {
        const day = date.getDate().toString().padStart(2, "0");
        const month = (date.getMonth() + 1).toString().padStart(2, "0");
        const year = date.getFullYear();
        return `${day}-${month}-${year}`;
    };

    const handleToDateChange = (date) => {
        setSelectedToDate(date);
        settoInputDate(date ? formatDate(date) : "");
        settoCalendarOpen(false);
    };
    const handleToInputChange = (e) => {
        settoInputDate(e.target.value);
    };



    function fetchDailyStatusReport() {
        const dateRegex = /^\d{2}-\d{2}-\d{4}$/;

        let errorType = "";

        switch (true) {
            case !toInputDate:
                errorType = "toDate";
                break;
            default:
                break;
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

            if (GlobaltoDate && enteredToDate > GlobaltoDate) {
                errorType = "toDateAfterGlobal";
            } else if (GlobaltoDate && enteredToDate < GlobalfromDate) {
                errorType = "toDateBeforeGlobal";
            }
        }

        switch (errorType) {
            case "toDate":
                toast.error("Rep Date is required");
                return;

            case "toDateInvalid":
                toast.error("Rep Date must be in the format dd-mm-yyyy");
                return;

            case "toDateAfterGlobal":
                toast.error(`Rep Date must be before ${GlobaltoDate1}`);
                return;
            case "toDateBeforeGlobal":
                toast.error(`Rep Date must be after ${GlobalfromDate1}`);
                return;

            default:
                break;
        }

        const fromDateElement = document.getElementById("fromdatevalidation");
        const toDateElement = document.getElementById("todatevalidation");

        if (fromDateElement) {
            fromDateElement.style.border = `1px solid ${fontcolor}`;
        }
        if (toDateElement) {
            toDateElement.style.border = `1px solid ${fontcolor}`;
        }

        const apiMainUrl = apiLinks + "/DailyStatusReport.php";
        setIsLoading(true);
        const formMainData = new URLSearchParams({
            // code: organisation.code,
            // FLocCod: locationnumber || getLocationNumber,
            // FYerDsc: yeardescription || getYearDescription,

            code: 'NASIRTRD',
            FLocCod: '001',
            FYerDsc: '2024-2024',
            FRepDat: toInputDate,
            FStrCod: storeType,
            // FSchTxt: "",
        }).toString();

        axios
            .post(apiMainUrl, formMainData)
            .then((response) => {
                setIsLoading(false);
                // console.log("Response:", response.data);

                setTotalOpening(response.data["Opening"]);
                setTotalPurchase(response.data["Purchase"]);
                setTotalPurRet(response.data["Pur Ret"]);
                setTotalReceive(response.data["Receive"]);
                setTotalIssue(response.data["Issue"]);
                setTotalSale(response.data["Sale"]);
                setTotalSaleRet(response.data["Sale Ret"]);
                setTotalBalance(response.data["Balance"]);

                if (response.data && Array.isArray(response.data.Detail)) {
                    setTableData(response.data.Detail);
                } else {
                    console.warn(
                        "Response data structure is not as expected:",
                        response.data.Detail
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
        if (!hasComponentMountedPreviously || (toRef && toRef.current)) {
            if (toRef && toRef.current) {
                setTimeout(() => {
                    toRef.current.focus();
                    toRef.current.select();
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

    // ------------ store style customization
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
                borderColor: "#2684FF",
                boxShadow: "0 0 0 1px #2684FF",
            }
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
                    backgroundColor: "#2684FF",
                }
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
                ? "#2684FF"
                : state.isFocused
                    ? "#2684FF"
                    : getcolor,
            color: state.isSelected
                ? "white"
                : fontcolor,
            "&:hover": {
                backgroundColor: "#2684FF",
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
            transform: state.selectProps.menuIsOpen ? "rotate(180deg)" : "rotate(0deg)",
            "&:hover": {
                color: "#2684FF",
            }
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
            }
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
            }
        }),
    });
    const exportPDFHandler = () => {

        const globalfontsize = 12;
        console.log('gobal font data', globalfontsize)

        // Create a new jsPDF instance with landscape orientation
        const doc = new jsPDF({ orientation: "landscape" });

        // Define table data (rows)
        const rows = tableData.map((item) => [
            item.code,
            item.Description,
            item["Opening"],
            item["Purchase"],
            item["Pur Ret"],
            item["Receive"],
            item["Issue"],
            item["Sale"],
            item["Sale Ret"],
            item["Balance"],
        ]);

        // Add summary row to the table
        rows.push([
            "",
            "Total",
            String(totalOpening),
            String(totalPurchase),
            String(totalPurRet),
            String(totalReceive),
            String(totalIssue),
            String(totalSale),
            String(totalSaleRet),
            String(totalBalance),
        ]);

        // Define table column headers and individual column widths
        const headers = [
            "Code",
            "Description",
            "Open",
            "Pur",
            "Pur Ret",
            "Rec",
            "Iss",
            "Sal",
            "Sal Ret",
            "Bal",
        ];
        const columnWidths = [30, 90, 20, 20, 20, 20, 20, 20, 20, 20];

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
                const isTotalRow = i === rows.length - 1; // Check if this is the total row
                const isOddRow = i % 2 !== 0; // Check if the row index is odd
                let textColor = [0, 0, 0]; // Default text color
                let fontName = normalFont; // Default font
                let currentX = startX; // Track current column position

                // Check if Qnty (column index 6) is negative
                if (parseFloat(row[7]) < 0) {
                    textColor = [255, 0, 0]; // Set red color for negative Qnty
                }

                // For total row, set bold font
                if (isTotalRow) {
                    doc.setFont(getfontstyle, 'bold');
                }

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

                row.forEach((cell, cellIndex) => {
                    // For total row, adjust vertical position to center in the double border
                    const cellY = isTotalRow
                        ? startY + (i - startIndex + 2) * rowHeight + rowHeight / 2
                        : startY + (i - startIndex + 2) * rowHeight + 3;

                    const cellX = currentX + 2;

                    // Set text color
                    doc.setTextColor(textColor[0], textColor[1], textColor[2]);

                    // For total row, keep bold font
                    if (!isTotalRow) {
                        doc.setFont(fontName, "normal");
                    }

                    // Ensure the cell value is a string
                    const cellValue = String(cell);

                    if (cellIndex === 2 ||
                        cellIndex === 3 ||
                        cellIndex === 4 ||
                        cellIndex === 5 ||
                        cellIndex === 6 ||
                        cellIndex === 7 ||
                        cellIndex === 8 ||
                        cellIndex === 9


                    ) {
                        const rightAlignX = currentX + columnWidths[cellIndex] - 2;
                        doc.text(cellValue, rightAlignX, cellY, {
                            align: "right",
                            baseline: "middle",
                        });
                    } else {
                        // For empty cells in total row, add "Total" label centered
                        if (isTotalRow && cellIndex === 0 && cell === "") {
                            const totalLabelX = currentX + columnWidths[0] / 2;
                            doc.text("", totalLabelX, cellY, {
                                align: "center",
                                baseline: "middle"
                            });
                        } else {
                            doc.text(cellValue, cellX, cellY, {
                                baseline: "middle"
                            });
                        }
                    }

                    // Draw borders
                    const rowTopY = startY + (i - startIndex + 2) * rowHeight;
                    const rowBottomY = rowTopY + rowHeight;

                    if (isTotalRow) {
                        // Double horizontal borders for total row
                        doc.setDrawColor(0);

                        // Top border - double line
                        doc.setLineWidth(0.3);
                        doc.line(currentX, rowTopY, currentX + columnWidths[cellIndex], rowTopY);
                        doc.line(currentX, rowTopY + 0.5, currentX + columnWidths[cellIndex], rowTopY + 0.5);

                        // Bottom border - double line
                        doc.line(currentX, rowBottomY, currentX + columnWidths[cellIndex], rowBottomY);
                        doc.line(currentX, rowBottomY - 0.5, currentX + columnWidths[cellIndex], rowBottomY - 0.5);

                        // Single vertical borders
                        doc.setLineWidth(0.2);
                        // Left border (only for first column)
                        if (cellIndex === 0) {
                            doc.line(currentX, rowTopY, currentX, rowBottomY);
                        }
                        // Right border
                        doc.line(currentX + columnWidths[cellIndex], rowTopY, currentX + columnWidths[cellIndex], rowBottomY);
                    } else {
                        // Normal border for other rows
                        doc.setDrawColor(0);
                        doc.setLineWidth(0.2);
                        doc.rect(
                            currentX,
                            rowTopY,
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
                    rightX - 20,
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

                addTitle(`Daily Status Report As on: ${toInputDate}`, "", "", pageNumber, startY, 12); // Render sale report title with decreased font size, provide the time, and page number
                startY += -5;

                const labelsX = (doc.internal.pageSize.width - totalWidth) / 2;
                const labelsY = startY + 4; // Position the labels below the titles and above the table

                // Set font size and weight for the labels
                doc.setFontSize(12);
                doc.setFont(getfontstyle, "300");



                let typeText = Companyselectdatavalue.label ? Companyselectdatavalue.label : "ALL";


                let search = searchQuery ? searchQuery : "";


                // Set font style, size, and family
                doc.setFont(getfontstyle, "300"); // Font family and style ('normal', 'bold', 'italic', etc.)
                doc.setFontSize(10); // Font size


                doc.setFont(getfontstyle, 'bold'); // Set font to bold
                doc.text(`STORE :`, labelsX, labelsY + 8); // Draw bold label
                doc.setFont(getfontstyle, 'normal'); // Reset font to normal
                doc.text(`${typeText}`, labelsX + 15, labelsY + 8); // Draw the value next to the label



                if (searchQuery) {
                    doc.setFont(getfontstyle, 'bold'); // Set font to bold
                    doc.text(`SEARCH :`, labelsX + 170, labelsY + 8.5); // Draw bold label
                    doc.setFont(getfontstyle, 'normal'); // Reset font to normal
                    doc.text(`${search}`, labelsX + 190, labelsY + 8.5); // Draw the value next to the label
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
        doc.save(`DailyStatusReport AS on ${toInputDate}.pdf`);


    };

    const handleDownloadCSV = async () => {
        const workbook = new ExcelJS.Workbook();
        const worksheet = workbook.addWorksheet("Sheet1");

        const numColumns = 6; // Ensure this matches the actual number of columns

        const columnAlignments = [
            "left",
            "left",
            "right",
            "right",
            "right",
            "right",
            "right",
            "right",
            "right",
            "right",
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
            `A${companyRow.number}:${String.fromCharCode(69 + numColumns - 1)}${companyRow.number
            }`
        );

        // Add Store List row
        const storeListRow = worksheet.addRow([`Daily Status Report As on ${toInputDate}`,]);
        storeListRow.eachCell((cell) => {
            cell.font = fontStoreList;
            cell.alignment = { horizontal: "center" };
        });

        worksheet.mergeCells(
            `A${storeListRow.number}:${String.fromCharCode(69 + numColumns - 1)}${storeListRow.number
            }`
        );

        // Add an empty row after the title section
        worksheet.addRow([]);

        let typecompany = Companyselectdatavalue.label ? Companyselectdatavalue.label : "ALL";


        let typesearch = searchQuery ? searchQuery : "";

        //    const typeAndStoreRow2 = worksheet.addRow(["STORE :", typecategory]);
        const typeAndStoreRow3 = worksheet.addRow(
            searchQuery
                ? ["TYPE :", typecompany, "", "", "SEARCH :", typesearch]
                : ["TYPE :", typecompany, ""]
        );



        typeAndStoreRow3.eachCell((cell, colIndex) => {
            cell.font = {
                name: "CustomFont" || "CustomFont",
                size: 10,
                bold: [1, 4].includes(colIndex),
            };
            cell.alignment = { horizontal: "left", vertical: "middle" };
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
            "Code",
            "Description",
            "Open",
            "Pur",
            "Pur Ret",
            "Rec",
            "Iss",
            "Sal",
            "Sal Ret",
            "Bal",
        ];
        const headerRow = worksheet.addRow(headers);
        headerRow.eachCell((cell) => Object.assign(cell, headerStyle));

        // Add data rows
        tableData.forEach((item) => {
            const row = worksheet.addRow([
                item.code,
                item.Description,
                item["Opening"],
                item["Purchase"],
                item["Pur Ret"],
                item["Receive"],
                item["Issue"],
                item["Sale"],
                item["Sale Ret"],
                item["Balance"],
            ]);

            // Check if quantity is negative (parse as float)
            const isNegativeQty = parseFloat(item.Qnty) < 0;

            row.eachCell((cell, colIndex) => {
                // Apply red font to ALL cells if Qnty is negative
                cell.font = {
                    ...fontTableContent,
                    color: isNegativeQty ? { argb: 'FFFF0000' } : fontTableContent.color,
                };

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
        [20, 50, 12, 12, 12, 12, 12, 12, 12, 12].forEach((width, index) => {
            worksheet.getColumn(index + 1).width = width;
        });

        const totalRow = worksheet.addRow([
            "",
            "Total",
            String(totalOpening),
            String(totalPurchase),
            String(totalPurRet),
            String(totalReceive),
            String(totalIssue),
            String(totalSale),
            String(totalSaleRet),
            String(totalBalance),
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
            if (colNumber === 3 ||
                colNumber === 4 ||
                colNumber === 5 ||
                colNumber === 6 ||
                colNumber === 7 ||
                colNumber === 8 ||
                colNumber === 9 ||
                colNumber === 10

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
        const blob = new Blob([buffer], {
            type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        });
        saveAs(blob, `DailyStatusReport From ${fromInputDate} To ${toInputDate}.xlsx`);
    };


    const [columns, setColumns] = useState({
        code: [],
        Description: [],
        Opening: [],
        Purchase: [],
        'Pur Ret': [],
        Receive: [],
        Issue: [],
        Sale: [],
        'Sale Ret': [],
        Balance: [],
    });

    const [columnSortOrders, setColumnSortOrders] = useState({
        code: "",
        Description: "",
        Opening: "",
        Purchase: "",
        'Pur Ret': "",
        Receive: "",
        Issue: "",
        Sale: "",
        'Sale Ret': "",
        Balance: "",
    });

    // Transform table data into column-oriented format
    useEffect(() => {
        if (tableData.length > 0) {
            const newColumns = {
                code: tableData.map((row) => row.code),
                Description: tableData.map((row) => row.Description),
                Opening: tableData.map((row) => row.Opening),
                Purchase: tableData.map((row) => row.Purchase),
                'Pur Ret': tableData.map((row) => row['Pur Ret']),
                Receive: tableData.map((row) => row.Receive),
                Issue: tableData.map((row) => row.Issue),
                Sale: tableData.map((row) => row.Sale),
                'Sale Ret': tableData.map((row) => row['Sale Ret']),
                Balance: tableData.map((row) => row.Balance),

            };
            setColumns(newColumns);
        }
    }, [tableData]);

    const handleSorting = (col) => {
        const currentOrder = columnSortOrders[col];
        const newOrder = currentOrder === "ASC" ? "DSC" : "ASC";

        setTableData(prevData => {
            const sorted = [...prevData].sort((a, b) => {
                const aValue = a[col] !== null ? a[col].toString() : "";
                const bValue = b[col] !== null ? b[col].toString() : "";

                const numA = parseFloat(aValue.replace(/,/g, ""));
                const numB = parseFloat(bValue.replace(/,/g, ""));

                if (!isNaN(numA) && !isNaN(numB)) {
                    return newOrder === "ASC" ? numA - numB : numB - numA;
                } else {
                    return newOrder === "ASC"
                        ? aValue.localeCompare(bValue)
                        : bValue.localeCompare(aValue);
                }
            });
            return sorted;
        });

        // Update sort order state
        setColumnSortOrders(prev => ({
            ...Object.fromEntries(Object.keys(prev).map(key => [key, null])),
            [col]: newOrder
        }));
    };

    const resetSorting = () => {
        setColumnSortOrders({
            Code: null,
            Description: null,
            Company: null,
            Category: null,
            Capacity: null,
            Type: null,
            Status: null,

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


    const dispatch = useDispatch();

    const tableTopColor = "#3368B5";
    const tableHeadColor = "#3368b5";
    const secondaryColor = "white";
    const btnColor = "#3368B5";
    const textColor = "white";


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
        width: "13%",
    };
    const secondColWidth = {
        width: "30.5%",
    };
    const thirdColWidth = {
        width: "7%",
    };
    const forthColWidth = {
        width: "7%",
    };
    const fifthColWidth = {
        width: "7.1%",
    };
    const sixthColWidth = {
        width: "7%",
    };
    const seventhColWidth = {
        width: "7%",
    };
    const eighthColWidth = {
        width: "7%",
    };
    const ninthColWidth = {
        width: "7%",
    };
    const tenthColWidth = {
        width: "7%",
    };

    useHotkeys("alt+s", () => {
        fetchDailyStatusReport();
           resetSorting();
    }, { preventDefault: true, enableOnFormTags: true });

    useHotkeys("alt+p", exportPDFHandler, { preventDefault: true, enableOnFormTags: true });
    useHotkeys("alt+e", handleDownloadCSV, { preventDefault: true, enableOnFormTags: true });
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
        width: isSidebarVisible ? "calc(80vw - 0%)" : "80vw",
        position: "absolute",
        top: "53%",
        left: isSidebarVisible ? "60%" : "50%",
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
        maxWidth: "1100px",
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

    const [menuStoreIsOpen, setMenuStoreIsOpen] = useState(false);

    const focusNextElement = (currentRef, nextRef) => {
        if (currentRef.current && nextRef.current) {
            currentRef.current.focus();
            nextRef.current.focus();
        }
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
            if (enteredDate > GlobaltoDate) {
                toast.error(`Date must be before ${GlobaltoDate1}`);
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
            focusNextElement(storeRef, selectButtonRef);
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
                    <NavComponent textdata="Daily Status Report" />

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
                            {/* To Date */}
                            <div className="d-flex align-items-center">
                                <div
                                    style={{
                                        width: "100px",
                                        display: "flex",
                                        justifyContent: "end",
                                    }}
                                >
                                    <label htmlFor="toDatePicker">
                                        <span style={{ fontSize: getdatafontsize, fontFamily: getfontstyle, fontWeight: "bold" }}>
                                            Rep Date :&nbsp;
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
                                            fontSize: getdatafontsize, fontFamily: getfontstyle, backgroundColor: getcolor,
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

                            {/* Store Select */}
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
                                    <label htmlFor="fromDatePicker">
                                        <span style={{ fontSize: getdatafontsize, fontFamily: getfontstyle, fontWeight: "bold" }}>
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
                                                const labelPart = selectedOption.label.split('-')[1];
                                                setStoreType(selectedOption.value);
                                                setCompanyselectdatavalue({
                                                    value: selectedOption.value,
                                                    label: labelPart,  // Set only the 'NGS' part of the label
                                                });
                                            } else {
                                                setStoreType(""); // Clear the saleType state when selectedOption is null (i.e., when the selection is cleared)
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
                                            ...customStyles1(),
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
                                        menuIsOpen={menuStoreIsOpen}
                                        onMenuOpen={() => setMenuStoreIsOpen(true)}
                                        onMenuClose={() => setMenuStoreIsOpen(false)}
                                    />
                                </div>
                            </div>

                            {/* Search */}
                            {/* <div
                                className="d-flex align-items-center"
                                style={{ marginRight: "25px" }}
                            >
                                <div>
                                    <label for="searchInput">
                                        <span style={{fontSize: getdatafontsize,fontFamily:getfontstyle,  fontWeight: "bold" }}>
                                            Search :
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
                                            width: "200px",
                                            height: "24px",
                                            fontSize: getdatafontsize,fontFamily:getfontstyle,                                             marginLeft: '5px',
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
                                        onChange={(e) => setSearchQuery((e.target.value || "").toUpperCase())} />

                                </div>
                            </div> */}
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
                                    fontSize: getdatafontsize, fontFamily: getfontstyle, width: "100%",
                                    position: "relative",
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
                                            className="border-dark "
                                            style={thirdColWidth}
                                            onClick={() => handleSorting("Opening")}
                                        >
                                            Open{" "}
                                            <i
                                                className="fa-solid fa-caret-down caretIconStyle"
                                                style={getIconStyle("Opening")}
                                            ></i>
                                        </td>


                                        <td
                                            className="border-dark"
                                            style={forthColWidth}
                                            onClick={() => handleSorting("Purchase")}
                                        >
                                            Pur{" "}
                                            <i
                                                className="fa-solid fa-caret-down caretIconStyle"
                                                style={getIconStyle("Purchase")}
                                            ></i>
                                        </td>


                                        <td
                                            className="border-dark"
                                            style={fifthColWidth}
                                            onClick={() => handleSorting("Pur Ret")}
                                        >
                                            Pur Ret{" "}
                                            <i
                                                className="fa-solid fa-caret-down caretIconStyle"
                                                style={getIconStyle("Pur Ret")}
                                            ></i>
                                        </td>


                                        <td
                                            className="border-dark"
                                            style={sixthColWidth}
                                            onClick={() => handleSorting("Receive")}
                                        >
                                            Rec{" "}
                                            <i
                                                className="fa-solid fa-caret-down caretIconStyle"
                                                style={getIconStyle("Receive")}
                                            ></i>
                                        </td>


                                        <td
                                            className="border-dark"
                                            style={seventhColWidth}
                                            onClick={() => handleSorting("Issue")}
                                        >
                                            Iss{" "}
                                            <i
                                                className="fa-solid fa-caret-down caretIconStyle"
                                                style={getIconStyle("Issue")}
                                            ></i>
                                        </td>

                                        <td
                                            className="border-dark"
                                            style={eighthColWidth}
                                            onClick={() => handleSorting("Sale")}
                                        >
                                            Sal{" "}
                                            <i
                                                className="fa-solid fa-caret-down caretIconStyle"
                                                style={getIconStyle("Sale")}
                                            ></i>
                                        </td>

                                        <td
                                            className="border-dark"
                                            style={ninthColWidth}
                                            onClick={() => handleSorting("Sale Ret")}
                                        >
                                            Sal Ret{" "}
                                            <i
                                                className="fa-solid fa-caret-down caretIconStyle"
                                                style={getIconStyle("Sale Ret")}
                                            ></i>
                                        </td>


                                        <td
                                            className="border-dark"
                                            style={tenthColWidth}
                                            onClick={() => handleSorting("Balance")}
                                        >
                                            Bal{" "}
                                            <i
                                                className="fa-solid fa-caret-down caretIconStyle"
                                                style={getIconStyle("Balance")}
                                            ></i>
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
                                maxHeight: "58vh",
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
                                                <td colSpan="10" className="text-center">
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
                                                        {Array.from({ length: 10 }).map((_, colIndex) => (
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
                                                <td style={eighthColWidth}></td>
                                                <td style={ninthColWidth}></td>
                                                <td style={tenthColWidth}></td>
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
                                                            {item["Opening"]}
                                                        </td>
                                                        <td className="text-end" style={forthColWidth}>
                                                            {item["Purchase"]}
                                                        </td>
                                                        <td className="text-end" style={fifthColWidth}>
                                                            {item["Pur Ret"]}
                                                        </td>
                                                        <td className="text-end" style={sixthColWidth}>
                                                            {item["Receive"]}
                                                        </td>
                                                        <td className="text-end" style={seventhColWidth}>
                                                            {item["Issue"]}
                                                        </td>
                                                        <td className="text-end" style={eighthColWidth}>
                                                            {item["Sale"]}
                                                        </td>
                                                        <td className="text-end" style={ninthColWidth}>
                                                            {item["Sale Ret"]}
                                                        </td>
                                                        <td className="text-end" style={tenthColWidth}>
                                                            {item["Balance"]}
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
                                                    {Array.from({ length: 10 }).map((_, colIndex) => (
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
                                                <td style={eighthColWidth}></td>
                                                <td style={ninthColWidth}></td>
                                                <td style={tenthColWidth}></td>
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
                            paddingRight: "10px"
                        }}
                    >
                        <div
                            style={{
                                ...firstColWidth,
                                background: getcolor,
                                marginLeft: "2px",
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
                            <span className="mobileledger_total">{totalPurchase}</span>
                        </div>
                        <div
                            style={{
                                ...fifthColWidth,
                                background: getcolor,
                                borderRight: `1px solid ${fontcolor}`,
                            }}
                        >
                            <span className="mobileledger_total">{totalPurRet}</span>
                        </div>
                        <div
                            style={{
                                ...sixthColWidth,
                                background: getcolor,
                                borderRight: `1px solid ${fontcolor}`,
                            }}
                        >
                            <span className="mobileledger_total">{totalReceive}</span>
                        </div>
                        <div
                            style={{
                                ...seventhColWidth,
                                background: getcolor,
                                borderRight: `1px solid ${fontcolor}`,
                            }}
                        >
                            <span className="mobileledger_total">{totalIssue}</span>
                        </div>
                        <div
                            style={{
                                ...eighthColWidth,
                                background: getcolor,
                                borderRight: `1px solid ${fontcolor}`,
                            }}
                        >
                            <span className="mobileledger_total">{totalSale}</span>
                        </div>
                        <div
                            style={{
                                ...ninthColWidth,
                                background: getcolor,
                                borderRight: `1px solid ${fontcolor}`,
                            }}
                        >
                            <span className="mobileledger_total">{totalSaleRet}</span>
                        </div>
                        <div
                            style={{
                                ...tenthColWidth,
                                background: getcolor,
                                borderRight: `1px solid ${fontcolor}`,
                            }}
                        >
                            <span className="mobileledger_total">{totalBalance}</span>
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
                            // onClick={fetchDailyStatusReport}
                            onClick={()=>{
                                fetchDailyStatusReport();
                                resetSorting();
                            }}
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