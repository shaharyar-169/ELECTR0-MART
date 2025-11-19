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
import { saveAs } from "file-saver";
import "react-calendar/dist/Calendar.css";
import { useSelector, useDispatch } from "react-redux";
import { useHotkeys } from "react-hotkeys-hook";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
// import './dailydemo.css';

export default function MemberCreditMemo() {
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

        const apiMainUrl = apiLinks + "/MemberCreditMemo.php";
        setIsLoading(true);
        const formMainData = new URLSearchParams({
            // code: organisation.code,
            // FLocCod: locationnumber || getLocationNumber,
            // FYerDsc: yeardescription || getYearDescription,

            code: 'CRYSTALGYM',
            FLocCod: '001',
            FYerDsc: '2025-2025',
            FTrnDat: toInputDate,

            FSchTxt: "",
        }).toString();

        axios
            .post(apiMainUrl, formMainData)
            .then((response) => {
                setIsLoading(false);
                // console.log("Response:", response.data);

                setTotalOpening(response.data["TotalArrear"]);
                setTotalPurchase(response.data["TotalFee"]);
              
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
        const columnWidths = [30, 90, 15, 15, 15, 15, 15, 15, 15, 15];

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


                    if (
                        cellIndex === 2 ||
                        cellIndex === 3 ||
                        cellIndex === 4 ||
                        cellIndex === 5 ||
                        cellIndex === 6 ||
                        cellIndex === 7 ||
                        cellIndex === 8 ||
                        cellIndex === 9
                    ) {
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

                addTitle(`Daily Status Report Rep Date: ${toInputDate}`, "", "", pageNumber, startY, 12); // Render sale report title with decreased font size, provide the time, and page number
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

        const numColumns = 6; // Number of columns

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

        // Add an empty row at the start
        worksheet.addRow([]);

        // Add title rows

        [comapnyname, `Daily Status Report Rep Date ${toInputDate}`].forEach((title, index) => {
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




        let typecompany = Companyselectdatavalue.label ? Companyselectdatavalue.label : "ALL";

        let typesearch = searchQuery ? searchQuery : "";

        const typeAndStoreRow3 = worksheet.addRow(
            searchQuery
                ? ["STORE :", typecompany, "", "", "", "", '', "SEARCH :", typesearch]
                : ["STORE :", typecompany, ""]
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

        applyStatusRowStyle(typeAndStoreRow3, [1, 8]); // Column 1 for "COMPANY:", Column 4 for "CAPACITY:"



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

        // Apply styles and center alignment to the header row
        headerRow.eachCell((cell) => {
            cell.style = { ...headerStyle };
        });

        // Add data rows

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
                top: { style: "thin" },
                left: { style: "thin" },
                bottom: { style: "thin" },
                right: { style: "thin" },
            };

            // Align only the "Total" text to the right
            if (colNumber === 2 || colNumber === 3 || colNumber === 4 || colNumber === 5 || colNumber === 6 || colNumber === 7 || colNumber === 8 || colNumber === 9) {
                cell.alignment = { horizontal: "right" };
            }
        });


        // Set column widths


        [25, 50, 10, 10, 10, 10, 10, 10, 10, 10].forEach((width, index) => {
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
        saveAs(blob, `DailyStatusReport As on ${toInputDate}.xlsx`);
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
        width: "6.2%",
    };
    const secondColWidth = {
        width: "12%",
    };
    const thirdColWidth = {
        width: "40%",
    };
    const forthColWidth = {
        width: "13%",
    };
    const fifthColWidth = {
        width: "14%",
    };
    const sixthColWidth = {
        width: "14%",
    };
    // const seventhColWidth = {
    //     width: "7%",
    // };
    // const eighthColWidth = {
    //     width: "7%",
    // };
    // const ninthColWidth = {
    //     width: "7%",
    // };
    // const tenthColWidth = {
    //     width: "7%",
    // };

    useHotkeys("s", fetchDailyStatusReport);
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

    const handlestoreref = (e) => {
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
                    <NavComponent textdata="Member Credit Memo Report" />

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
                                            Date :&nbsp;
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


                            {/* Search */}
                            <div
                                className="d-flex align-items-center"
                                style={{ marginRight: "25px" }}
                            >
                                <div>
                                    <label for="searchInput">
                                        <span style={{ fontSize: getdatafontsize, fontFamily: getfontstyle, fontWeight: "bold" }}>
                                            Search :
                                        </span>
                                    </label>
                                </div>
                                <div>
                                    <input

                                        ref={storeRef}
                                        onKeyDown={handlestoreref}
                                        type="text"
                                        id="searchsubmit"
                                        placeholder="Item description"
                                        value={searchQuery}
                                        autoComplete="off"
                                        style={{
                                            width: "200px",
                                            height: "24px",
                                            fontSize: getdatafontsize, fontFamily: getfontstyle, marginLeft: '5px',
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
                                        <td className="border-dark" style={firstColWidth}>
                                            Sr
                                        </td>
                                        <td className="border-dark" style={secondColWidth}>
                                            Code
                                        </td>
                                        <td className="border-dark" style={thirdColWidth}>
                                            Member
                                        </td>
                                        <td className="border-dark" style={forthColWidth}>
                                            Mobile
                                        </td>
                                        <td className="border-dark" style={fifthColWidth}>
                                            Arrear
                                        </td>
                                        <td className="border-dark" style={sixthColWidth}>
                                            Fee
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
                                maxHeight: "60vh",
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
                                                            {item.Sr}
                                                        </td>
                                                        <td className="text-start" style={secondColWidth}>
                                                            {item.Code}
                                                        </td>
                                                        <td className="text-start" style={thirdColWidth}>
                                                            {item.Member}
                                                        </td>
                                                        <td className="text-start" style={forthColWidth}>
                                                            {item.Mobile}
                                                        </td>
                                                        <td className="text-end" style={fifthColWidth}>
                                                            {item.Arrear}
                                                        </td>
                                                        <td className="text-end" style={sixthColWidth}>
                                                            {item.Fee}
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
                            <span className="mobileledger_total">{totalOpening}</span>
                        </div>
                        <div
                            style={{
                                ...sixthColWidth,
                                background: getcolor,
                                borderRight: `1px solid ${fontcolor}`,
                            }}
                        >
                            <span className="mobileledger_total">{totalPurchase}</span>
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
                            onClick={fetchDailyStatusReport}
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