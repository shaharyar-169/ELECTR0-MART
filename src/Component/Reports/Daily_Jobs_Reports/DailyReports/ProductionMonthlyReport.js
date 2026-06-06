import React, { useState, useEffect, useRef } from "react";
import { Container, Spinner, Nav } from "react-bootstrap";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import { useTheme } from "../../../../ThemeContext";
import {
    getUserData,
    getOrganisationData,
    getLocationnumber,
    getYearDescription,
} from "../../../Auth";
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
import { Balance, Description, Store } from "@mui/icons-material";
import '../../../vardana/vardana';
import '../../../vardana/verdana-bold'

export default function ProductionMonthlyReport() {
    const navigate = useNavigate();
    const user = getUserData();
    const organisation = getOrganisationData();
    const yeardescription = getYearDescription();
    const locationnumber = getLocationnumber();
    const saleSelectRef = useRef(null);
    const input1Ref = useRef(null);
    const input2Ref = useRef(null);
    const input3Ref = useRef(null);
    const MonthRef = useRef(null);

    const [sortData, setSortData] = useState("ASC");

    const [isAscendingcode, setisAscendingcode] = useState(true);
    const [isAscendingdec, setisAscendingdec] = useState(true);
    const [isAscendingsts, setisAscendingsts] = useState(true);

    const [searchQuery, setSearchQuery] = useState("");
    const [transectionType, settransectionType] = useState("2026");
    const currentMonth = String(new Date().getMonth() + 1);
    const [transectionType2, settransectionType2] = useState(currentMonth);

    console.log('MONTHS', transectionType2)


    const [total1, settotal1] = useState(0);
    const [total2, settotal2] = useState(0);
    const [total3, settotal3] = useState(0);
    const [total4, settotal4] = useState(0);
    const [total5, settotal5] = useState(0);
    const [total6, settotal6] = useState(0);
    const [total7, settotal7] = useState(0);
    const [total8, settotal8] = useState(0);
    const [total9, settotal9] = useState(0);
    const [total10, settotal10] = useState(0);
    const [total11, settotal11] = useState(0);
    const [total12, settotal12] = useState(0);
    const [total13, settotal13] = useState(0);
    const [total14, settotal14] = useState(0);
    const [total15, settotal15] = useState(0);
    const [total16, settotal16] = useState(0);
    const [total17, settotal17] = useState(0);
    const [total18, settotal18] = useState(0);
    const [total19, settotal19] = useState(0);
    const [total20, settotal20] = useState(0);
    const [total21, settotal21] = useState(0);
    const [total22, settotal22] = useState(0);
    const [total23, settotal23] = useState(0);
    const [total24, settotal24] = useState(0);
    const [total25, settotal25] = useState(0);
    const [total26, settotal26] = useState(0);
    const [total27, settotal27] = useState(0);
    const [total28, settotal28] = useState(0);
    const [total29, settotal29] = useState(0);
    const [total30, settotal30] = useState(0);

    const [GrandTotal, setGrandTotal] = useState(0);



    const months = [
        "January",
        "February",
        "March",
        "April",
        "May",
        "June",
        "July",
        "August",
        "September",
        "October",
        "November",
        "December",
    ];
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

    //////////////////////// CUSTOM DATE LIMITS ////////////////////////////

    // Toggle the ToDATE && FromDATE CalendarOpen state on each click

    const handleKeyPress = (e, nextInputRef) => {
        if (e.key === "Enter") {
            e.preventDefault();
            if (nextInputRef.current) {
                nextInputRef.current.focus();
            }
        }
    };

    function fetchReceivableReport() {
        const apiUrl = apiLinks + "/ProductionMonthlyReport.php";
        setIsLoading(true);
        const formData = new URLSearchParams({
            code: organisation.code,
            FLocCod: locationnumber || getLocationNumber,
            FYerDsc: yeardescription || getyeardescription,
            FRepYer: transectionType,
            FRepMon: transectionType2,
            // FRepMon: '6',
            // code: 'AGFACTORY',
        }).toString();

        axios
            .post(apiUrl, formData)
            .then((response) => {
                setIsLoading(false);

                settotal1(response.data.TotalQty["01-Jun-26"]);
                settotal2(response.data.TotalQty["02-Jun-26"]);
                settotal3(response.data.TotalQty["03-Jun-26"]);
                settotal4(response.data.TotalQty["04-Jun-26"]);
                settotal5(response.data.TotalQty["05-Jun-26"]);
                settotal6(response.data.TotalQty["06-Jun-26"]);
                settotal7(response.data.TotalQty["07-Jun-26"]);
                settotal8(response.data.TotalQty["08-Jun-26"]);
                settotal9(response.data.TotalQty["09-Jun-26"]);
                settotal10(response.data.TotalQty["10-Jun-26"]);
                settotal11(response.data.TotalQty["11-Jun-26"]);
                settotal12(response.data.TotalQty["12-Jun-26"]);
                settotal13(response.data.TotalQty["13-Jun-26"]);
                settotal14(response.data.TotalQty["14-Jun-26"]);
                settotal15(response.data.TotalQty["15-Jun-26"]);
                settotal16(response.data.TotalQty["16-Jun-26"]);
                settotal17(response.data.TotalQty["17-Jun-26"]);
                settotal18(response.data.TotalQty["18-Jun-26"]);
                settotal19(response.data.TotalQty["19-Jun-26"]);
                settotal20(response.data.TotalQty["20-Jun-26"]);
                settotal21(response.data.TotalQty["21-Jun-26"]);
                settotal22(response.data.TotalQty["22-Jun-26"]);
                settotal23(response.data.TotalQty["23-Jun-26"]);
                settotal24(response.data.TotalQty["24-Jun-26"]);
                settotal25(response.data.TotalQty["25-Jun-26"]);
                settotal26(response.data.TotalQty["26-Jun-26"]);
                settotal27(response.data.TotalQty["27-Jun-26"]);
                settotal28(response.data.TotalQty["28-Jun-26"]);
                settotal29(response.data.TotalQty["29-Jun-26"]);
                settotal30(response.data.TotalQty["30-Jun-26"]);
                setGrandTotal(response.data["GrandTotal"]);






                if (response.data && Array.isArray(response.data.Detail)) {
                    setTableData(response.data.Detail);
                } else {
                    console.warn(
                        "Response data structure is not as expected:",
                        response.data,
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
        if (!hasComponentMountedPreviously || (input1Ref && input1Ref.current)) {
            if (input1Ref && input1Ref.current) {
                setTimeout(() => {
                    input1Ref.current.focus();
                    // input1Ref.current.select();
                }, 0);
            }
            sessionStorage.setItem("componentMounted", "true");
        }
    }, []);

    const handleTransactionTypeChange = (event) => {
        const selectedTransactionType = event.target.value;
        settransectionType(selectedTransactionType);
    };
    const handleTransactionTypeChange2 = (event) => {
        const selectedTransactionType = event.target.value;
        settransectionType2(selectedTransactionType);
    };

    ///////////////////////////// DOWNLOAD PDF CODE ////////////////////////////////////////////////////////////
    const exportPDFHandler = () => {
        // Create a new jsPDF instance with landscape orientation
        const doc = new jsPDF({ orientation: "landscape" });

        // Define table data (rows)
        const rows = tableData.map((item) => [
            item.Code,
            item.Customer,
            item.Sts,
            item["Guaranter Name"],
            item["Witness Name"],
            item.Balance,
        ]);

        // Add summary row to the table
        rows.push([
            String(formatValue(tableData.length.toLocaleString())),
            "",
            "",
            "",
            "",
            "",
        ]);

        // Define table column headers and individual column widths
        const headers = [
            "Code",
            "Customer",
            "Sts",
            "Guaranter Name",
            "Witness Name",
            "Balace",
        ];
        const columnWidths = [24, 70, 15, 70, 70, 30];

        // Calculate total table width
        const totalWidth = columnWidths.reduce((acc, width) => acc + width, 0);

        // Define page height and padding
        const pageHeight = doc.internal.pageSize.height;
        const paddingTop = 15;

        // Set font properties for the table
        doc.setFont("verdana-regular", "normal");
        doc.setFontSize(10);

        // Function to add table headers
        const addTableHeaders = (startX, startY) => {
            // Set font style and size for headers
            doc.setFont("verdana", "bold");
            doc.setFontSize(10);

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
        };

        const addTableRows = (startX, startY, startIndex, endIndex) => {
            const rowHeight = 5;
            const fontSize = 10;
            const boldFont = 400;
            const normalFont = getfontstyle;
            const tableWidth = getTotalTableWidth();

            for (let i = startIndex; i < endIndex; i++) {
                const row = rows[i];
                const isOddRow = i % 2 !== 0;
                const isRedRow = row[0] && parseInt(row[0]) > 10000000000;
                const isTotalRow = i === rows.length - 1;
                let textColor = [0, 0, 0];
                let fontName = normalFont;

                if (isRedRow) {
                    textColor = [255, 0, 0];
                    fontName = boldFont;
                }

                if (isTotalRow) {
                    doc.setFont("verdana", "bold");
                    doc.setFontSize(10);
                }

                if (isOddRow) {
                    doc.setFillColor(240);
                    doc.rect(
                        startX,
                        startY + (i - startIndex + 2) * rowHeight,
                        tableWidth,
                        rowHeight,
                        "F",
                    );
                }

                doc.setDrawColor(0);

                if (isTotalRow) {
                    const rowTopY = startY + (i - startIndex + 2) * rowHeight;
                    const rowBottomY = rowTopY + rowHeight;

                    doc.setLineWidth(0.3);
                    doc.line(startX, rowTopY, startX + tableWidth, rowTopY);
                    doc.line(startX, rowTopY + 0.5, startX + tableWidth, rowTopY + 0.5);

                    doc.line(startX, rowBottomY, startX + tableWidth, rowBottomY);
                    doc.line(
                        startX,
                        rowBottomY - 0.5,
                        startX + tableWidth,
                        rowBottomY - 0.5,
                    );

                    doc.setLineWidth(0.2);
                    doc.line(startX, rowTopY, startX, rowBottomY);
                    doc.line(
                        startX + tableWidth,
                        rowTopY,
                        startX + tableWidth,
                        rowBottomY,
                    );
                } else {
                    doc.setLineWidth(0.2);
                    doc.rect(
                        startX,
                        startY + (i - startIndex + 2) * rowHeight,
                        tableWidth,
                        rowHeight,
                    );
                }

                row.forEach((cell, cellIndex) => {
                    // ⭐ NEW FIX — Perfect vertical centering
                    const cellY =
                        startY + (i - startIndex + 2) * rowHeight + rowHeight / 2;

                    const cellX = startX + 2;

                    doc.setTextColor(textColor[0], textColor[1], textColor[2]);

                    if (!isTotalRow) {
                        doc.setFont("verdana-regular", "normal");
                        doc.setFontSize(10);
                    }

                    const cellValue = String(cell);

                    if (cellIndex === 0 || cellIndex === 2) {
                        const rightAlignX = startX + columnWidths[cellIndex] / 2;
                        doc.text(cellValue, rightAlignX, cellY, {
                            align: "center",
                            baseline: "middle",
                        });
                    } else if (cellIndex === 5) {
                        const rightAlignX = startX + columnWidths[cellIndex] - 2;
                        doc.text(cellValue, rightAlignX, cellY, {
                            align: "right",
                            baseline: "middle",
                        });
                    } else {
                        if (isTotalRow && cellIndex === 0 && cell === "") {
                            const totalLabelX = startX + columnWidths[0] / 2;
                            doc.text("", totalLabelX, cellY, {
                                align: "center",
                                baseline: "middle",
                            });
                        } else {
                            doc.text(cellValue, cellX, cellY, {
                                baseline: "middle",
                            });
                        }
                    }

                    if (cellIndex < row.length - 1) {
                        doc.setLineWidth(0.2);
                        doc.line(
                            startX + columnWidths[cellIndex],
                            startY + (i - startIndex + 2) * rowHeight,
                            startX + columnWidths[cellIndex],
                            startY + (i - startIndex + 3) * rowHeight,
                        );
                        startX += columnWidths[cellIndex];
                    }
                });

                startX = (doc.internal.pageSize.width - tableWidth) / 2;

                if (isTotalRow) {
                    doc.setFont("verdana-regular", "normal");
                    doc.setFontSize(10);
                }
            }

            const lineWidth = tableWidth;
            const lineX = (doc.internal.pageSize.width - tableWidth) / 2;
            const lineY = pageHeight - 15;
            doc.setLineWidth(0.3);
            doc.line(lineX, lineY, lineX + lineWidth, lineY);
            const headingFontSize = 11;
            const headingX = lineX + 2;
            const headingY = lineY + 5;
            doc.setFont("verdana-regular", "normal");
            doc.setFontSize(10);
            doc.text(`Crystal Solution    ${date}    ${time}`, headingX, headingY);
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
        const rowsPerPage = 29; // Adjust this value based on your requirements

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
                pageNumberFontSize = 10,
            ) => {
                doc.setFontSize(titleFontSize); // Set the font size for the title
                doc.text(title, doc.internal.pageSize.width / 2, startY, {
                    align: "center",
                });

                // Calculate the x-coordinate for the right corner
                const rightX = doc.internal.pageSize.width - 10;

                // Add page numbering
                doc.setFont("verdana-regular", "normal");
                doc.setFontSize(10);
                doc.text(
                    `Page ${pageNumber}`,
                    rightX - 40,
                    doc.internal.pageSize.height - 10,
                    { align: "right" },
                );
            };

            let currentPageIndex = 0;
            let startY = paddingTop; // Initialize startY
            let pageNumber = 1; // Initialize page number

            while (currentPageIndex * rowsPerPage < rows.length) {
                doc.setFont("Times New Roman", "normal");
                addTitle(comapnyname, 12, 12, pageNumber, startY, 18); // Render company title with default font size, only date, and page number
                startY += 5; // Adjust vertical position for the company title
                doc.setFont("verdana-regular", "normal");
                addTitle(`Customer Search`, "", "", pageNumber, startY, 12); // Render sale report title with decreased font size, provide the time, and page number
                startY += -5;

                const labelsX = (doc.internal.pageSize.width - totalWidth) / 2;
                const labelsY = startY + 4; // Position the labels below the titles and above the table

                let status =
                    transectionType === "N"
                        ? "NON-ACTIVE"
                        : transectionType === "A"
                            ? "ACTIVE"
                            : "ALL";
                let search = searchQuery ? searchQuery : "";

                // Set font style, size, and family
                //         doc.setFont("verdana", "bold");
                //      doc.setFontSize(10);
                //          doc.text(`Status :`, labelsX, labelsY + 8.5); // Draw bold label
                //   doc.setFont("verdana-regular", "normal");
                //      doc.setFontSize(10);
                //          doc.text(`${status}`, labelsX + 20, labelsY + 8.5); // Draw the value next to the label

                if (searchQuery) {
                    doc.setFont("verdana", "bold");
                    doc.setFontSize(10);
                    doc.text(`Search :`, labelsX + 200, labelsY + 8.5); // Draw bold label
                    doc.setFont("verdana-regular", "normal");
                    doc.setFontSize(10);
                    doc.text(`${search}`, labelsX + 220, labelsY + 8.5); // Draw the value next to the label
                }

                startY += 10; // Adjust vertical position for the labels

                addTableHeaders((doc.internal.pageSize.width - totalWidth) / 2, 29);
                const startIndex = currentPageIndex * rowsPerPage;
                const endIndex = Math.min(startIndex + rowsPerPage, rows.length);
                startY = addTableRows(
                    (doc.internal.pageSize.width - totalWidth) / 2,
                    startY,
                    startIndex,
                    endIndex,
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
        doc.save(`CustomerSearch As On ${date}.pdf`);
    };
    ///////////////////////////// DOWNLOAD PDF CODE ////////////////////////////////////////////////////////////

    ///////////////////////////// DOWNLOAD PDF EXCEL //////////////////////////////////////////////////////////

    const handleDownloadCSV = async () => {
        const workbook = new ExcelJS.Workbook();
        const worksheet = workbook.addWorksheet("Sheet1");

        const numColumns = 39; // Ensure this matches the actual number of columns
        const columnAlignments = [
            "left",
            "left",
            "left",
            "left",
            "left",
            "left",
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
            "right",
            "right",
            "right",
            "right",
            "right",
            "right",
            "right",
            "right",
            "right",
            "right",
            "right",
            "right",
            "right",
            "right",
            "right",
            "right",
            "right",
            "right",
            "right",
            "right",
            "right",
            "right",
            "right",
        ];

        // Define fonts
        const fontCompanyName = { name: "CustomFont", size: 18, bold: true };
        const fontStoreList = { name: "CustomFont", size: 10, bold: false };
        const fontHeader = { name: "CustomFont", size: 10, bold: true };
        const fontTableContent = { name: "CustomFont", size: 10, bold: false };

        // Empty row
        worksheet.addRow([]);

        // Company name
        const companyRow = worksheet.addRow([comapnyname]);

        worksheet.mergeCells(
            companyRow.number,
            1,
            companyRow.number,
            numColumns
        );

        companyRow.getCell(1).font = fontCompanyName;
        companyRow.getCell(1).alignment = {
            horizontal: "center",
            vertical: "middle",
        };

        worksheet.getRow(companyRow.number).height = 30;

        const storeListRow = worksheet.addRow(["Production Monthly Report"]);

        worksheet.mergeCells(
            storeListRow.number,
            1,
            storeListRow.number,
            numColumns
        );

        storeListRow.getCell(1).font = fontStoreList;
        storeListRow.getCell(1).alignment = {
            horizontal: "center",
            vertical: "middle",
        };

        // Empty row
        worksheet.addRow([]);

        // Filter data

        let typesearch = searchQuery || "";



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

        // Headers
        const headers = [
            "SrNo",
            "Code",
            "Description",
            "Company",
            "Category",
            "Design",
            "Type",
            "Capacity",
            "01-Jun-26",
            "02-Jun-26",
            "03-Jun-26",
            "04-Jun-26",
            "05-Jun-26",
            "06-Jun-26",
            "07-Jun-26",
            "08-Jun-26",
            "09-Jun-26",
            "10-Jun-26",
            "11-Jun-26",
            "12-Jun-26",
            "13-Jun-26",
            "14-Jun-26",
            "15-Jun-26",
            "16-Jun-26",
            "17-Jun-26",
            "18-Jun-26",
            "19-Jun-26",
            "20-Jun-26",
            "21-Jun-26",
            "22-Jun-26",
            "23-Jun-26",
            "24-Jun-26",
            "25-Jun-26",
            "26-Jun-26",
            "27-Jun-26",
            "28-Jun-26",
            "29-Jun-26",
            "30-Jun-26",
            "Total Pro",
        ];
        const headerRow = worksheet.addRow(headers);
        headerRow.eachCell((cell) => Object.assign(cell, headerStyle));

        const toNumber = (value) =>
            Number(String(value || 0).replace(/,/g, ""));
        // ✅ Add data rows with alternating light grey background
        tableData.forEach((item, index) => {
            const row = worksheet.addRow([
                item["SrNo"],
                item.Code,
                item.Description,
                item.Company,
                item["Category"],
                item["Design"],
                item["Type"],
                item["Capacity"],
                toNumber(item["01-Jun-26"]),
                toNumber(item["02-Jun-26"]),
                toNumber(item["03-Jun-26"]),
                toNumber(item["04-Jun-26"]),
                toNumber(item["05-Jun-26"]),
                toNumber(item["06-Jun-26"]),
                toNumber(item["07-Jun-26"]),
                toNumber(item["08-Jun-26"]),
                toNumber(item["09-Jun-26"]),
                toNumber(item["10-Jun-26"]),
                toNumber(item["11-Jun-26"]),
                toNumber(item["12-Jun-26"]),
                toNumber(item["13-Jun-26"]),
                toNumber(item["14-Jun-26"]),
                toNumber(item["15-Jun-26"]),
                toNumber(item["16-Jun-26"]),
                toNumber(item["17-Jun-26"]),
                toNumber(item["18-Jun-26"]),
                toNumber(item["19-Jun-26"]),
                toNumber(item["20-Jun-26"]),
                toNumber(item["21-Jun-26"]),
                toNumber(item["22-Jun-26"]),
                toNumber(item["23-Jun-26"]),
                toNumber(item["24-Jun-26"]),
                toNumber(item["25-Jun-26"]),
                toNumber(item["26-Jun-26"]),
                toNumber(item["27-Jun-26"]),
                toNumber(item["28-Jun-26"]),
                toNumber(item["29-Jun-26"]),
                toNumber(item["30-Jun-26"]),
                toNumber(item["Total Production"]),
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

                // ✅ Apply very light grey background to odd rows
                if ((index + 1) % 2 !== 0) {
                    cell.fill = {
                        type: "pattern",
                        pattern: "solid",
                        fgColor: { argb: "FFEFEFEF" }, // Very light grey
                    };
                }
            });
        });

        // Column widths
        [10, 20, 40, 25, 25, 25, 20, 25, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12].forEach((width, index) => {
            worksheet.getColumn(index + 1).width = width;
        });

        const totalRow = worksheet.addRow([
            String(formatValue(tableData.length.toLocaleString())),
            "",
            "",
            "",
            "",
            "",
            "",
            "",
            String(formatValue(total1)),
            String(formatValue(total2)),
            String(formatValue(total3)),
            String(formatValue(total4)),
            String(formatValue(total5)),
            String(formatValue(total6)),
            String(formatValue(total7)),
            String(formatValue(total8)),
            String(formatValue(total9)),
            String(formatValue(total10)),
            String(formatValue(total11)),
            String(formatValue(total12)),
            String(formatValue(total13)),
            String(formatValue(total14)),
            String(formatValue(total15)),
            String(formatValue(total16)),
            String(formatValue(total17)),
            String(formatValue(total18)),
            String(formatValue(total19)),
            String(formatValue(total20)),
            String(formatValue(total21)),
            String(formatValue(total22)),
            String(formatValue(total23)),
            String(formatValue(total24)),
            String(formatValue(total25)),
            String(formatValue(total26)),
            String(formatValue(total27)),
            String(formatValue(total28)),
            String(formatValue(total29)),
            String(formatValue(total30)),
            String(formatValue(GrandTotal)),


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

            if (colNumber > 8) {
                cell.alignment = { horizontal: "right" };
            }
            // Align only the "Total" text to the right
            if (colNumber === 1) {
                cell.alignment = { horizontal: "center" };
            }
        });

        // Blank row
        worksheet.addRow([]);

        // Date and Time
        const today = new Date();
        const currentTime = today.toLocaleTimeString("en-GB");
        const currentDate = today.toLocaleDateString("en-GB").replace(/\//g, "-");
        const userid = user.tusrid;

        const dateTimeRow = worksheet.addRow([
            `DATE:   ${currentDate}  TIME:   ${currentTime}`,
        ]);
        dateTimeRow.eachCell((cell) => {
            cell.font = { name: "CustomFont", size: 10 };
            cell.alignment = { horizontal: "left" };
        });

        const dateTimeRow1 = worksheet.addRow([`USER ID:  ${userid}`]);
        dateTimeRow1.eachCell((cell) => {
            cell.font = { name: "CustomFont", size: 10 };
            cell.alignment = { horizontal: "left" };
        });

        // Merge cells
        worksheet.mergeCells(
            `A${dateTimeRow.number}:${String.fromCharCode(65 + numColumns - 1)}${dateTimeRow.number}`,
        );
        worksheet.mergeCells(
            `A${dateTimeRow1.number}:${String.fromCharCode(65 + numColumns - 1)}${dateTimeRow1.number}`,
        );

        // Save Excel
        const buffer = await workbook.xlsx.writeBuffer();
        const blob = new Blob([buffer], {
            type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        });
        saveAs(blob, `ProductionMonthlyReport As On ${currentDate}.xlsx`);
    };

    ///////////////////////////// DOWNLOAD PDF EXCEL ///////////////////////////////////////////////////////////

    const dispatch = useDispatch();

    const tableTopColor = "#3368B5";
    const tableHeadColor = "#3368b5";
    const secondaryColor = "white";
    const btnColor = "#3368B5";
    const textColor = "white";

    const [tableData, setTableData] = useState([]);
    console.log("comapnydata", tableData);
    const [selectedSearch, setSelectedSearch] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const { data, loading, error } = useSelector((state) => state.getuser);

    const handleSearch = (e) => {
        setSelectedSearch(e.target.value);
    };

    let totalEntries = 0;

    // State for column data
    const [columns, setColumns] = useState({
        SrNo: [],
        Code: [],
        Description: [],
        Company: [],
        "Category": [],
        "Design": [],
        "Type": [],
        "Capacity": [],
        "01-Jun-26": [],
        "02-Jun-26": [],
        "03-Jun-26": [],
        "04-Jun-26": [],
        "05-Jun-26": [],
        "06-Jun-26": [],
        "07-Jun-26": [],
        "08-Jun-26": [],
        "09-Jun-26": [],
        "10-Jun-26": [],
        "11-Jun-26": [],
        "12-Jun-26": [],
        "13-Jun-26": [],
        "14-Jun-26": [],
        "151-Jun-26": [],
        "16-Jun-26": [],
        "17-Jun-26": [],
        "18-Jun-26": [],
        "19-Jun-26": [],
        "20-Jun-26": [],
        "21-Jun-26": [],
        "22-Jun-26": [],
        "23-Jun-26": [],
        "24-Jun-26": [],
        "25-Jun-26": [],
        "26-Jun-26": [],
        "27-Jun-26": [],
        "28-Jun-26": [],
        "29-Jun-26": [],
        "30-Jun-26": [],
        "Total Production": [],
    });

    // State for column sorting order: 'asc', 'desc', or null
    const [columnSortOrders, setColumnSortOrders] = useState({
        SrNo: null,
        Code: null,
        Description: null,
        Company: null,
        "Category": null,
        "Design": null,
        "Type": null,
        "Capacity": null,
        "01-Jun-26": null,
        "02-Jun-26": null,
        "03-Jun-26": null,
        "04-Jun-26": null,
        "05-Jun-26": null,
        "06-Jun-26": null,
        "07-Jun-26": null,
        "08-Jun-26": null,
        "09-Jun-26": null,
        "10-Jun-26": null,
        "11-Jun-26": null,
        "12-Jun-26": null,
        "13-Jun-26": null,
        "14-Jun-26": null,
        "151-Jun-26": null,
        "16-Jun-26": null,
        "17-Jun-26": null,
        "18-Jun-26": null,
        "19-Jun-26": null,
        "20-Jun-26": null,
        "21-Jun-26": null,
        "22-Jun-26": null,
        "23-Jun-26": null,
        "24-Jun-26": null,
        "25-Jun-26": null,
        "26-Jun-26": null,
        "27-Jun-26": null,
        "28-Jun-26": null,
        "29-Jun-26": null,
        "30-Jun-26": null,
        "Total Production": null,
    });

    // Reset sorting
    const resetSorting = () => {
        setColumnSortOrders({
            SrNo: null,
            Code: null,
            Description: null,
            Company: null,
            "Category": null,
            "Design": null,
            "Type": null,
            "Capacity": null,
            "01-Jun-26": null,
            "02-Jun-26": null,
            "03-Jun-26": null,
            "04-Jun-26": null,
            "05-Jun-26": null,
            "06-Jun-26": null,
            "07-Jun-26": null,
            "08-Jun-26": null,
            "09-Jun-26": null,
            "10-Jun-26": null,
            "11-Jun-26": null,
            "12-Jun-26": null,
            "13-Jun-26": null,
            "14-Jun-26": null,
            "151-Jun-26": null,
            "16-Jun-26": null,
            "17-Jun-26": null,
            "18-Jun-26": null,
            "19-Jun-26": null,
            "20-Jun-26": null,
            "21-Jun-26": null,
            "22-Jun-26": null,
            "23-Jun-26": null,
            "24-Jun-26": null,
            "25-Jun-26": null,
            "26-Jun-26": null,
            "27-Jun-26": null,
            "28-Jun-26": null,
            "29-Jun-26": null,
            "30-Jun-26": null,
            "Total Production": null,
        });
    };

    // Update columns whenever tableData changes
    useEffect(() => {
        if (tableData.length > 0) {
            const newColumns = {
                "SrNo": tableData.map((row) => row["SrNo"]),
                Code: tableData.map((row) => row.Code),
                Description: tableData.map((row) => row.Description),
                Company: tableData.map((row) => row.Company),
                "Category": tableData.map((row) => row["Category"]),
                "Design": tableData.map((row) => row["Design"]),
                "type": tableData.map((row) => row["type"]),
                "01-Jun-26": tableData.map((row) => row["01-Jun-26"]),
                "02-Jun-26": tableData.map((row) => row["02-Jun-26"]),
                "03-Jun-26": tableData.map((row) => row["03-Jun-26"]),
                "04-Jun-26": tableData.map((row) => row["04-Jun-26"]),
                "05-Jun-26": tableData.map((row) => row["05-Jun-26"]),
                "06-Jun-26": tableData.map((row) => row["06-Jun-26"]),
                "07-Jun-26": tableData.map((row) => row["07-Jun-26"]),
                "08-Jun-26": tableData.map((row) => row["08-Jun-26"]),
                "09-Jun-26": tableData.map((row) => row["09-Jun-26"]),
                "10-Jun-26": tableData.map((row) => row["10-Jun-26"]),
                "11-Jun-26": tableData.map((row) => row["11-Jun-26"]),
                "12-Jun-26": tableData.map((row) => row["12-Jun-26"]),
                "13-Jun-26": tableData.map((row) => row["13-Jun-26"]),
                "14-Jun-26": tableData.map((row) => row["14-Jun-26"]),
                "15-Jun-26": tableData.map((row) => row["15-Jun-26"]),
                "16-Jun-26": tableData.map((row) => row["16-Jun-26"]),
                "17-Jun-26": tableData.map((row) => row["17-Jun-26"]),
                "18-Jun-26": tableData.map((row) => row["18-Jun-26"]),
                "19-Jun-26": tableData.map((row) => row["19-Jun-26"]),
                "20-Jun-26": tableData.map((row) => row["10-Jun-26"]),
                "21-Jun-26": tableData.map((row) => row["21-Jun-26"]),
                "22-Jun-26": tableData.map((row) => row["22-Jun-26"]),
                "23-Jun-26": tableData.map((row) => row["23-Jun-26"]),
                "24-Jun-26": tableData.map((row) => row["24-Jun-26"]),
                "25-Jun-26": tableData.map((row) => row["25-Jun-26"]),
                "26-Jun-26": tableData.map((row) => row["26-Jun-26"]),
                "27-Jun-26": tableData.map((row) => row["27-Jun-26"]),
                "28-Jun-26": tableData.map((row) => row["28-Jun-26"]),
                "29-Jun-26": tableData.map((row) => row["29-Jun-26"]),
                "30-Jun-26": tableData.map((row) => row["20-Jun-26"]),
                "Total Production": tableData.map((row) => row["Total Production"]),

            };
            setColumns(newColumns);
        } else {
            // Clear columns if no data
            setColumns({
                SrNo: [],
                Code: [],
                Description: [],
                Company: [],
                "Category": [],
                "Design": [],
                "Type": [],
                "Capacity": [],
                "01-Jun-26": [],
                "02-Jun-26": [],
                "03-Jun-26": [],
                "04-Jun-26": [],
                "05-Jun-26": [],
                "06-Jun-26": [],
                "07-Jun-26": [],
                "08-Jun-26": [],
                "09-Jun-26": [],
                "10-Jun-26": [],
                "11-Jun-26": [],
                "12-Jun-26": [],
                "13-Jun-26": [],
                "14-Jun-26": [],
                "151-Jun-26": [],
                "16-Jun-26": [],
                "17-Jun-26": [],
                "18-Jun-26": [],
                "19-Jun-26": [],
                "20-Jun-26": [],
                "21-Jun-26": [],
                "22-Jun-26": [],
                "23-Jun-26": [],
                "24-Jun-26": [],
                "25-Jun-26": [],
                "26-Jun-26": [],
                "27-Jun-26": [],
                "28-Jun-26": [],
                "29-Jun-26": [],
                "30-Jun-26": [],
                "Total Production": [],




            });
        }
    }, [tableData]);

    const handleSorting = (col) => {
        const currentOrder = columnSortOrders[col];
        const newOrder = currentOrder === "ASC" ? "DSC" : "ASC";

        const sortedData = [...tableData].sort((a, b) => {
            const aVal =
                a[col] !== null && a[col] !== undefined ? a[col].toString() : "";
            const bVal =
                b[col] !== null && b[col] !== undefined ? b[col].toString() : "";

            const numA = parseFloat(aVal.replace(/,/g, ""));
            const numB = parseFloat(bVal.replace(/,/g, ""));

            if (!isNaN(numA) && !isNaN(numB)) {
                return newOrder === "ASC" ? numA - numB : numB - numA;
            } else {
                return newOrder === "ASC"
                    ? aVal.localeCompare(bVal)
                    : bVal.localeCompare(aVal);
            }
        });

        setTableData(sortedData);

        setColumnSortOrders((prev) => ({
            ...Object.keys(prev).reduce((acc, key) => {
                acc[key] = key === col ? newOrder : null;
                return acc;
            }, {}),
        }));
    };


    const getIconStyle = (colKey) => {
        const order = columnSortOrders[colKey];
        return {
            transform: order === "DSC" ? "rotate(180deg)" : "rotate(0deg)",
            color: order === "ASC" || order === "DSC" ? "red" : "white",
            transition: "transform 0.3s ease, color 0.3s ease",
        };
    };


    useHotkeys(
        "alt+s",
        () => {
            fetchReceivableReport();
            resetSorting();
        },
        { preventDefault: true, enableOnFormTags: true },
    );

    useHotkeys("alt+p", exportPDFHandler, {
        preventDefault: true,
        enableOnFormTags: true,
    });
    useHotkeys("alt+e", handleDownloadCSV, {
        preventDefault: true,
        enableOnFormTags: true,
    });
    useHotkeys("alt+r", () => navigate("/MainPage"), {
        preventDefault: true,
        enableOnFormTags: true,
    });


    const firstColWidth = { width: isSidebarVisible ? "60px" : "60px" };
    const thirdColWidth = { width: isSidebarVisible ? "135px" : "135px" };
    const forthColWidth = { width: isSidebarVisible ? "300px" : "300px" };
    const fifthColWidth = { width: isSidebarVisible ? "200px" : "200px" };
    const sixthColWidth = { width: isSidebarVisible ? "200px" : "200px" };
    const seventhColWidth = { width: isSidebarVisible ? "200px" : "360px" };
    const eighthColWidth = { width: isSidebarVisible ? "90px" : "90px" };
    const ninthColWidth = { width: isSidebarVisible ? "100px" : "160px" };


    const tenthColWidth = { width: isSidebarVisible ? "90px" : "90px" };
    const ColWidth11 = { width: isSidebarVisible ? "90px" : "90px" };
    const ColWidth12 = { width: isSidebarVisible ? "90px" : "90px" };
    const ColWidth13 = { width: isSidebarVisible ? "90px" : "90px" };
    const ColWidth14 = { width: isSidebarVisible ? "90px" : "90px" };
    const ColWidth15 = { width: isSidebarVisible ? "90px" : "90px" };
    const ColWidth16 = { width: isSidebarVisible ? "90px" : "90px" };
    const ColWidth17 = { width: isSidebarVisible ? "90px" : "90px" };
    const ColWidth18 = { width: isSidebarVisible ? "90px" : "90px" };
    const ColWidth19 = { width: isSidebarVisible ? "90px" : "90px" };
    const ColWidth20 = { width: isSidebarVisible ? "90px" : "90px" };
    const ColWidth21 = { width: isSidebarVisible ? "90px" : "90px" };
    const ColWidth22 = { width: isSidebarVisible ? "90px" : "90px" };

    const ColWidth23 = { width: isSidebarVisible ? "90px" : "90px" };
    const ColWidth24 = { width: isSidebarVisible ? "90px" : "90px" };
    const ColWidth25 = { width: isSidebarVisible ? "90px" : "90px" };
    const ColWidth26 = { width: isSidebarVisible ? "90px" : "90px" };
    const ColWidth27 = { width: isSidebarVisible ? "90px" : "90px" };
    const ColWidth28 = { width: isSidebarVisible ? "90px" : "90px" };
    const ColWidth29 = { width: isSidebarVisible ? "90px" : "90px" };
    const ColWidth30 = { width: isSidebarVisible ? "90px" : "90px" };
    const ColWidth31 = { width: isSidebarVisible ? "90px" : "90px" };
    const ColWidth32 = { width: isSidebarVisible ? "90px" : "90px" };
    const ColWidth33 = { width: isSidebarVisible ? "90px" : "90px" };
    const ColWidth34 = { width: isSidebarVisible ? "90px" : "90px" };
    const ColWidth35 = { width: isSidebarVisible ? "90px" : "90px" };
    const ColWidth36 = { width: isSidebarVisible ? "90px" : "90px" };
    const ColWidth37 = { width: isSidebarVisible ? "90px" : "90px" };
    const ColWidth38 = { width: isSidebarVisible ? "90px" : "90px" };
    const ColWidth39 = { width: isSidebarVisible ? "90px" : "90px" };
    const ColWidth40 = { width: isSidebarVisible ? "90px" : "90px" };

    const sixthcol = { width: "8px" };

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
        width: "100%", // 100vw ki jagah 100%
        maxWidth: isSidebarVisible ? "1000px" : "1200px",
        height: "calc(100vh - 100px)",
        position: "absolute",
        top: "70px",
        left: isSidebarVisible ? "60vw" : "52vw",
        transform: "translateX(-50%)",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        overflow: "hidden",
        textAlign: "center",
        fontSize: "15px",

        fontStyle: "normal",
        fontWeight: "400",
        lineHeight: "23px",
        fontFamily: '"Poppins", sans-serif',
        zIndex: 1,
        padding: "0 20px", // Side padding for small screens
        boxSizing: "border-box", // Padding ko width mein include kare
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
                (item) => item.tcmpcod === selectedRowId,
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
                Math.min(prevIndex + 1, tableData.length - 1),
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

    const formatValue = (val) => {
        return Number(val) === 0 ? "" : val;
    };
    const totalRows = 22; // fixed number of rows

    const colWidths = [

        firstColWidth.width,
        thirdColWidth.width,
        forthColWidth.width,
        fifthColWidth.width,
        sixthColWidth.width,
        seventhColWidth.width,
        eighthColWidth.width,
        ninthColWidth.width,
        tenthColWidth.width,
        ColWidth11.width,
        ColWidth12.width,
        ColWidth13.width,
        ColWidth14.width,
        ColWidth15.width,
        ColWidth16.width,
        ColWidth17.width,
        ColWidth18.width,
        ColWidth19.width,
        ColWidth20.width,
        ColWidth21.width,
        ColWidth22.width,
        ColWidth23.width,
        ColWidth24.width,
        ColWidth25.width,
        ColWidth26.width,
        ColWidth27.width,
        ColWidth28.width,
        ColWidth29.width,
        ColWidth30.width,
        ColWidth31.width,
        ColWidth32.width,
        ColWidth33.width,
        ColWidth34.width,
        ColWidth35.width,
        ColWidth36.width,
        ColWidth37.width,
        ColWidth38.width,
        ColWidth39.width,
        ColWidth40.width,





    ];

    return (
        <div
            style={contentStyle}
        >
            <div
                style={{
                    backgroundColor: getcolor,
                    color: fontcolor,
                    width: "100%",
                    border: `1px solid ${fontcolor}`,
                    borderRadius: "9px",
                }}
            >
                <NavComponent textdata="Production Monthly Report" />

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
                            justifyContent: "start",
                        }}
                    >
                        <div
                            className="d-flex align-items-center"
                            style={{ marginRight: "21px" }}
                        >
                            <div
                                style={{
                                    marginLeft: "10px",
                                    width: "60px",
                                    display: "flex",
                                    justifyContent: "end",
                                }}
                            >
                                <label htmlFor="transactionType">
                                    <span
                                        style={{
                                            fontSize: getdatafontsize,
                                            fontFamily: getfontstyle,
                                            fontWeight: "bold",
                                        }}
                                    >
                                        Year :
                                    </span>
                                </label>
                            </div>

                            <div style={{ position: "relative", display: "inline-block" }}>
                                <select
                                    ref={input1Ref}
                                    onKeyDown={(e) => handleKeyPress(e, MonthRef)}
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
                                        width: "150px",
                                        height: "24px",
                                        marginLeft: "5px",
                                        backgroundColor: getcolor,
                                        border: `1px solid ${fontcolor}`,
                                        fontSize: getdatafontsize,
                                        fontFamily: getfontstyle,
                                        color: fontcolor,
                                        paddingRight: "25px",
                                    }}
                                >

                                    <option value="2026">2026</option>
                                    <option value="2025">2025</option>
                                    <option value="2027">2027</option>
                                    <option value="2028">2028</option>
                                    <option value="2029">2029</option>
                                </select>

                                {transectionType !== "2026" && (
                                    <span
                                        onClick={() => settransectionType("2026")}
                                        style={{
                                            position: "absolute",
                                            right: "25px",
                                            top: "50%",
                                            transform: "translateY(-50%)",
                                            cursor: "pointer",
                                            fontWeight: "bold",
                                            color: fontcolor,
                                            userSelect: "none",
                                            fontSize: "12px",
                                        }}
                                    >
                                        ✕
                                    </span>
                                )}
                            </div>
                        </div>


                        <div
                            className="d-flex align-items-center"
                            style={{ marginLeft: "100px" }}
                        >
                            <div
                                style={{
                                    marginLeft: "10px",
                                    width: "60px",
                                    display: "flex",
                                    justifyContent: "end",
                                }}
                            >
                                <label htmlFor="transactionType">
                                    <span
                                        style={{
                                            fontSize: getdatafontsize,
                                            fontFamily: getfontstyle,
                                            fontWeight: "bold",
                                        }}
                                    >
                                        Month :
                                    </span>
                                </label>
                            </div>

                            <div style={{ position: "relative", display: "inline-block" }}>
                                <select
                                    ref={MonthRef}
                                    onKeyDown={(e) => handleKeyPress(e, input3Ref)}
                                    id="submitButton"
                                    name="type"
                                    value={transectionType2}
                                    onChange={handleTransactionTypeChange2}
                                    onFocus={(e) =>
                                        (e.currentTarget.style.border = "4px solid red")
                                    }
                                    onBlur={(e) =>
                                        (e.currentTarget.style.border = `1px solid ${fontcolor}`)
                                    }
                                    style={{
                                        width: "150px",
                                        height: "24px",
                                        marginLeft: "5px",
                                        backgroundColor: getcolor,
                                        border: `1px solid ${fontcolor}`,
                                        fontSize: getdatafontsize,
                                        fontFamily: getfontstyle,
                                        color: fontcolor,
                                        paddingRight: "25px",
                                    }}
                                >
                                    {months.map((month, index) => (
                                        <option key={index + 1} value={String(index + 1)}>
                                            {month}
                                        </option>
                                    ))}
                                </select>

                                {transectionType2 !== currentMonth && (
                                    <span
                                        onClick={() => settransectionType2(currentMonth)}
                                        style={{
                                            position: "absolute",
                                            right: "25px",
                                            top: "50%",
                                            transform: "translateY(-50%)",
                                            cursor: "pointer",
                                            fontWeight: "bold",
                                            color: fontcolor,
                                            userSelect: "none",
                                            fontSize: "12px",
                                        }}
                                    >
                                        ✕
                                    </span>
                                )}
                            </div>
                        </div>

                        {/* <div id="lastDiv" style={{ marginRight: "5px" }}>
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
                    ref={input2Ref}
                    // onKeyDown={(e) => handleKeyPress(e, input1Ref)}
                    type="text"
                    id="searchsubmit"
                    placeholder="Search"
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
              </div> */}

                    </div>
                </div>
                {/* Horizontal scroll container */}
                <div
                    style={{
                        overflowX: "auto",
                        border: `1px solid ${fontcolor}`,
                        background: getcolor,
                    }}
                >
                    {/* Vertical scroll + fixed height */}
                    <div style={{ maxHeight: "60vh", overflowY: "auto" }}>
                        <table
                            style={{
                                width: "100%",
                                minWidth: "1400px",
                                borderCollapse: "collapse",
                                tableLayout: "fixed",
                                color: fontcolor,
                            }}
                        >
                            {/* Column widths */}
                            <colgroup>
                                {colWidths.map((w, i) => (
                                    <col key={i} style={{ width: w }} />
                                ))}
                            </colgroup>

                            {/* Sticky Header */}
                            {/* 🔥 TABLE HEADER WITH SORTING */}
                            <thead
                                style={{
                                    position: "sticky",
                                    top: 0,
                                    zIndex: 2,
                                    backgroundColor: tableHeadColor,
                                    color: "#fff",
                                }}
                            >
                                <tr>



                                    <th
                                        className="border-dark"
                                        style={{ ...firstColWidth, cursor: "pointer" }}
                                        onClick={() => handleSorting("SrNo")}
                                    >
                                        SrNo{" "}
                                        <i
                                            className="fa-solid fa-caret-down caretIconStyle"
                                            style={getIconStyle("SrNo")}
                                        ></i>
                                    </th>

                                    <th
                                        className="border-dark"
                                        style={{ ...thirdColWidth, cursor: "pointer" }}
                                        onClick={() => handleSorting("Code")}
                                    >
                                        Code{" "}
                                        <i
                                            className="fa-solid fa-caret-down caretIconStyle"
                                            style={getIconStyle("Code")}
                                        ></i>
                                    </th>

                                    <th
                                        className="border-dark"
                                        style={{ ...forthColWidth, cursor: "pointer" }}
                                        onClick={() => handleSorting("Description")}
                                    >
                                        Description{" "}
                                        <i
                                            className="fa-solid fa-caret-down caretIconStyle"
                                            style={getIconStyle("Description")}
                                        ></i>
                                    </th>

                                    <th
                                        className="border-dark"
                                        style={{ ...fifthColWidth, cursor: "pointer" }}
                                        onClick={() => handleSorting("Company")}
                                    >
                                        Company{" "}
                                        <i
                                            className="fa-solid fa-caret-down caretIconStyle"
                                            style={getIconStyle("Company")}
                                        ></i>
                                    </th>

                                    <th
                                        className="border-dark"
                                        style={{ ...sixthColWidth, cursor: "pointer" }}
                                        onClick={() => handleSorting("Category")}
                                    >
                                        Category{" "}
                                        <i
                                            className="fa-solid fa-caret-down caretIconStyle"
                                            style={getIconStyle("Category")}
                                        ></i>
                                    </th>

                                    <th
                                        className="border-dark"
                                        style={{ ...seventhColWidth, cursor: "pointer" }}
                                        onClick={() => handleSorting("Design")}
                                    >
                                        Design{" "}
                                        <i
                                            className="fa-solid fa-caret-down caretIconStyle"
                                            style={getIconStyle("Design")}
                                        ></i>
                                    </th>

                                    <th
                                        className="border-dark"
                                        style={{ ...eighthColWidth, cursor: "pointer" }}
                                        onClick={() => handleSorting("Type")}
                                    >
                                        Type{" "}
                                        <i
                                            className="fa-solid fa-caret-down caretIconStyle"
                                            style={getIconStyle("Type")}
                                        ></i>
                                    </th>

                                    <th
                                        className="border-dark"
                                        style={{ ...ninthColWidth, cursor: "pointer" }}
                                        onClick={() => handleSorting("Capacity")}
                                    >
                                        Capacity{" "}
                                        <i
                                            className="fa-solid fa-caret-down caretIconStyle"
                                            style={getIconStyle("Capacity")}
                                        ></i>
                                    </th>

                                    {/* Additional columns */}
                                    <th style={{ cursor: "pointer" }} onClick={() => handleSorting("01-Jun-26")}>
                                        01-Jun-26 <i className="fa-solid fa-caret-down" style={getIconStyle("01-Jun-26")}></i>
                                    </th>

                                    <th style={{ cursor: "pointer" }} onClick={() => handleSorting("02-Jun-26")}>
                                        02-Jun-26 <i className="fa-solid fa-caret-down" style={getIconStyle("02-Jun-26")}></i>
                                    </th>

                                    <th style={{ cursor: "pointer" }} onClick={() => handleSorting("03-Jun-26")}>
                                        03-Jun-26 <i className="fa-solid fa-caret-down" style={getIconStyle("03-Jun-26")}></i>
                                    </th>

                                    <th style={{ cursor: "pointer" }} onClick={() => handleSorting("04-Jun-26")}>
                                        04-Jun-26 <i className="fa-solid fa-caret-down" style={getIconStyle("04-Jun-26")}></i>
                                    </th>

                                    <th style={{ cursor: "pointer" }} onClick={() => handleSorting("05-Jun-26")}>
                                        05-Jun-26 <i className="fa-solid fa-caret-down" style={getIconStyle("05-Jun-26")}></i>
                                    </th>

                                    <th style={{ cursor: "pointer" }} onClick={() => handleSorting("06-Jun-26")}>
                                        06-Jun-26 <i className="fa-solid fa-caret-down" style={getIconStyle("06-Jun-26")}></i>
                                    </th>

                                    <th style={{ cursor: "pointer" }} onClick={() => handleSorting("07-Jun-26")}>
                                        07-Jun-26 <i className="fa-solid fa-caret-down" style={getIconStyle("07-Jun-26")}></i>
                                    </th>

                                    <th style={{ cursor: "pointer" }} onClick={() => handleSorting("08-Jun-26")}>
                                        08-Jun-26 <i className="fa-solid fa-caret-down" style={getIconStyle("08-Jun-26")}></i>
                                    </th>

                                    <th style={{ cursor: "pointer" }} onClick={() => handleSorting("09-Jun-26")}>
                                        09-Jun-26 <i className="fa-solid fa-caret-down" style={getIconStyle("09-Jun-26")}></i>
                                    </th>

                                    <th style={{ cursor: "pointer" }} onClick={() => handleSorting("10-Jun-26")}>
                                        10-Jun-26 <i className="fa-solid fa-caret-down" style={getIconStyle("10-Jun-26")}></i>
                                    </th>

                                    <th style={{ cursor: "pointer" }} onClick={() => handleSorting("11-Jun-26")}>
                                        11-Jun-26 <i className="fa-solid fa-caret-down" style={getIconStyle("11-Jun-26")}></i>
                                    </th>
                                    <th style={{ cursor: "pointer" }} onClick={() => handleSorting("12-Jun-26")}>
                                        12-Jun-26 <i className="fa-solid fa-caret-down" style={getIconStyle("12-Jun-26")}></i>
                                    </th>
                                    <th style={{ cursor: "pointer" }} onClick={() => handleSorting("13-Jun-26")}>
                                        13-Jun-26 <i className="fa-solid fa-caret-down" style={getIconStyle("13-Jun-26")}></i>
                                    </th>




                                    <th style={{ cursor: "pointer" }} onClick={() => handleSorting("14-Jun-26")}>
                                        14-Jun-26 <i className="fa-solid fa-caret-down" style={getIconStyle("14-Jun-26")}></i>
                                    </th>
                                    <th style={{ cursor: "pointer" }} onClick={() => handleSorting("15-Jun-26")}>
                                        15-Jun-26 <i className="fa-solid fa-caret-down" style={getIconStyle("15-Jun-26")}></i>
                                    </th>
                                    <th style={{ cursor: "pointer" }} onClick={() => handleSorting("16-Jun-26")}>
                                        16-Jun-26 <i className="fa-solid fa-caret-down" style={getIconStyle("16-Jun-26")}></i>
                                    </th>
                                    <th style={{ cursor: "pointer" }} onClick={() => handleSorting("17-Jun-26")}>
                                        17-Jun-26 <i className="fa-solid fa-caret-down" style={getIconStyle("17-Jun-26")}></i>
                                    </th>
                                    <th style={{ cursor: "pointer" }} onClick={() => handleSorting("18-Jun-26")}>
                                        18-Jun-26 <i className="fa-solid fa-caret-down" style={getIconStyle("18-Jun-26")}></i>
                                    </th>
                                    <th style={{ cursor: "pointer" }} onClick={() => handleSorting("19-Jun-26")}>
                                        19-Jun-26 <i className="fa-solid fa-caret-down" style={getIconStyle("19-Jun-26")}></i>
                                    </th>
                                    <th style={{ cursor: "pointer" }} onClick={() => handleSorting("20-Jun-26")}>
                                        20-Jun-26 <i className="fa-solid fa-caret-down" style={getIconStyle("20-Jun-26")}></i>
                                    </th>
                                    <th style={{ cursor: "pointer" }} onClick={() => handleSorting("21-Jun-26")}>
                                        21-Jun-26 <i className="fa-solid fa-caret-down" style={getIconStyle("21-Jun-26")}></i>
                                    </th>
                                    <th style={{ cursor: "pointer" }} onClick={() => handleSorting("22-Jun-26")}>
                                        22-Jun-26 <i className="fa-solid fa-caret-down" style={getIconStyle("22-Jun-26")}></i>
                                    </th>
                                    <th style={{ cursor: "pointer" }} onClick={() => handleSorting("23-Jun-26")}>
                                        23-Jun-26 <i className="fa-solid fa-caret-down" style={getIconStyle("23-Jun-26")}></i>
                                    </th>
                                    <th style={{ cursor: "pointer" }} onClick={() => handleSorting("24-Jun-26")}>
                                        24-Jun-26 <i className="fa-solid fa-caret-down" style={getIconStyle("24-Jun-26")}></i>
                                    </th>
                                    <th style={{ cursor: "pointer" }} onClick={() => handleSorting("25-Jun-26")}>
                                        25-Jun-26 <i className="fa-solid fa-caret-down" style={getIconStyle("25-Jun-26")}></i>
                                    </th>
                                    <th style={{ cursor: "pointer" }} onClick={() => handleSorting("26-Jun-26")}>
                                        26-Jun-26 <i className="fa-solid fa-caret-down" style={getIconStyle("26-Jun-26")}></i>
                                    </th>
                                    <th style={{ cursor: "pointer" }} onClick={() => handleSorting("27-Jun-26")}>
                                        27-Jun-26 <i className="fa-solid fa-caret-down" style={getIconStyle("27-Jun-26")}></i>
                                    </th>
                                    <th style={{ cursor: "pointer" }} onClick={() => handleSorting("28-Jun-26")}>
                                        28-Jun-26 <i className="fa-solid fa-caret-down" style={getIconStyle("28-Jun-26")}></i>
                                    </th>
                                    <th style={{ cursor: "pointer" }} onClick={() => handleSorting("29-Jun-26")}>
                                        29-Jun-26 <i className="fa-solid fa-caret-down" style={getIconStyle("29-Jun-26")}></i>
                                    </th>
                                    <th style={{ cursor: "pointer" }} onClick={() => handleSorting("30-Jun-26")}>
                                        30-Jun-26 <i className="fa-solid fa-caret-down" style={getIconStyle("30-Jun-26")}></i>
                                    </th>
                                    <th style={{ cursor: "pointer" }} onClick={() => handleSorting("Total Production")}>
                                        Total Prod <i className="fa-solid fa-caret-down" style={getIconStyle("Total Production")}></i>
                                    </th>


                                </tr>
                            </thead>

                            {/* Table Body */}
                            <tbody>
                                {isLoading ? (
                                    <>
                                        <tr style={{ backgroundColor: getcolor }}>
                                            <td colSpan={39} className="text-center">
                                                <Spinner animation="border" variant="primary" />
                                            </td>
                                        </tr>
                                        {Array.from({ length: totalRows - 5 }).map((_, rowIndex) => (
                                            <tr
                                                key={`blank-${rowIndex}`}
                                                style={{ backgroundColor: getcolor, color: fontcolor }}
                                            >
                                                {Array.from({ length: 39 }).map((_, colIndex) => (
                                                    <td key={`blank-${rowIndex}-${colIndex}`}>&nbsp;</td>
                                                ))}
                                            </tr>
                                        ))}
                                        <tr>
                                            <td style={thirdColWidth}></td>
                                            <td style={forthColWidth}></td>
                                            <td style={fifthColWidth}></td>
                                            <td style={sixthColWidth}></td>
                                            <td style={seventhColWidth}></td>
                                            <td style={eighthColWidth}></td>
                                            <td style={ninthColWidth}></td>
                                            <td style={tenthColWidth}></td>
                                            <td style={ColWidth11}></td>
                                            <td style={ColWidth12}></td>
                                            <td style={ColWidth13}></td>
                                            <td style={ColWidth14}></td>
                                            <td style={ColWidth15}></td>
                                            <td style={ColWidth16}></td>
                                            <td style={ColWidth17}></td>
                                            <td style={ColWidth18}></td>
                                            <td style={ColWidth19}></td>
                                            <td style={ColWidth20}></td>
                                            <td style={ColWidth21}></td>
                                            <td style={ColWidth22}></td>

                                            <td style={ColWidth23}></td>
                                            <td style={ColWidth24}></td>
                                            <td style={ColWidth25}></td>
                                            <td style={ColWidth26}></td>
                                            <td style={ColWidth27}></td>
                                            <td style={ColWidth28}></td>
                                            <td style={ColWidth29}></td>
                                            <td style={ColWidth30}></td>
                                            <td style={ColWidth31}></td>
                                            <td style={ColWidth32}></td>
                                            <td style={ColWidth33}></td>
                                            <td style={ColWidth34}></td>
                                            <td style={ColWidth35}></td>
                                            <td style={ColWidth36}></td>
                                            <td style={ColWidth37}></td>
                                            <td style={ColWidth38}></td>
                                            <td style={ColWidth39}></td>
                                            <td style={ColWidth40}></td>
                                        </tr>
                                    </>
                                ) : (
                                    <>
                                        {tableData.map((item, i) => (
                                            <tr
                                                key={i}
                                                ref={(el) => (rowRefs.current[i] = el)}
                                                onClick={() => handleRowClick(i)}
                                                className={selectedIndex === i ? "selected-background" : ""}
                                                style={{ backgroundColor: getcolor, color: fontcolor }}
                                            >



                                                <td className="text-center" style={firstColWidth}>
                                                    {item.SrNo}
                                                </td>
                                                <td
                                                    className="text-start"
                                                    title={item.Code}
                                                    style={{
                                                        ...thirdColWidth,
                                                        whiteSpace: "nowrap",
                                                        overflow: "hidden",
                                                        textOverflow: "ellipsis",
                                                    }}
                                                >
                                                    {item.Code}
                                                </td>
                                                <td
                                                    className="text-start"
                                                    title={item.Description}
                                                    style={{
                                                        ...forthColWidth,
                                                        whiteSpace: "nowrap",
                                                        overflow: "hidden",
                                                        textOverflow: "ellipsis",
                                                    }}
                                                >
                                                    {item.Description}
                                                </td>
                                                <td
                                                    className="text-start"
                                                    title={item.company}
                                                    style={{
                                                        ...fifthColWidth,
                                                        whiteSpace: "nowrap",
                                                        overflow: "hidden",
                                                        textOverflow: "ellipsis",
                                                    }}
                                                >
                                                    {item.company}
                                                </td>
                                                <td className="text-start" style={sixthColWidth}>
                                                    {item.Category}
                                                </td>
                                                <td
                                                    className="text-start"
                                                    title={item.Design}
                                                    style={{
                                                        ...seventhColWidth,
                                                        whiteSpace: "nowrap",
                                                        overflow: "hidden",
                                                        textOverflow: "ellipsis",
                                                    }}
                                                >
                                                    {item.Design}
                                                </td>
                                                <td className="text-start" style={eighthColWidth}>
                                                    {item.Type}
                                                </td>
                                                <td
                                                    className="text-start"
                                                    title={item.Capacity}
                                                    style={{
                                                        ...ninthColWidth,
                                                        whiteSpace: "nowrap",
                                                        overflow: "hidden",
                                                        textOverflow: "ellipsis",
                                                    }}
                                                >
                                                    {item.Capacity}
                                                </td>
                                                <td className="text-end" style={tenthColWidth}>
                                                    {item['01-Jun-26']}
                                                </td>

                                                <td
                                                    className="text-end"
                                                    title={item["02-Jun-26"]}
                                                    style={{
                                                        ...ColWidth11,
                                                        whiteSpace: "nowrap",
                                                        overflow: "hidden",
                                                        textOverflow: "ellipsis",
                                                    }}
                                                >
                                                    {item["02-Jun-26"]}
                                                </td>

                                                <td
                                                    className="text-end"
                                                    title={item["03-Jun-26"]}
                                                    style={{
                                                        ...ColWidth12,
                                                        whiteSpace: "nowrap",
                                                        overflow: "hidden",
                                                        textOverflow: "ellipsis",
                                                    }}
                                                >
                                                    {item["03-Jun-26"]}
                                                </td>

                                                <td
                                                    className="text-end"
                                                    title={item["04-Jun-26"]}
                                                    style={{
                                                        ...ColWidth13,
                                                        whiteSpace: "nowrap",
                                                        overflow: "hidden",
                                                        textOverflow: "ellipsis",
                                                    }}
                                                >
                                                    {item["04-Jun-26"]}
                                                </td>

                                                <td
                                                    className="text-end"
                                                    title={item["05-Jun-26"]}
                                                    style={{
                                                        ...ColWidth14,
                                                        whiteSpace: "nowrap",
                                                        overflow: "hidden",
                                                        textOverflow: "ellipsis",
                                                    }}
                                                >
                                                    {item["05-Jun-26"]}
                                                </td>

                                                <td
                                                    className="text-end"
                                                    title={item["06-Jun-26"]}
                                                    style={{
                                                        ...ColWidth15,
                                                        whiteSpace: "nowrap",
                                                        overflow: "hidden",
                                                        textOverflow: "ellipsis",
                                                    }}
                                                >
                                                    {item["06-Jun-26"]}
                                                </td>

                                                <td
                                                    className="text-end"
                                                    title={item["07-Jun-26"]}
                                                    style={{
                                                        ...ColWidth16,
                                                        whiteSpace: "nowrap",
                                                        overflow: "hidden",
                                                        textOverflow: "ellipsis",
                                                    }}
                                                >
                                                    {item["07-Jun-26"]}
                                                </td>

                                                <td
                                                    className="text-end"
                                                    title={item["08-Jun-26"]}
                                                    style={{
                                                        ...ColWidth17,
                                                        whiteSpace: "nowrap",
                                                        overflow: "hidden",
                                                        textOverflow: "ellipsis",
                                                    }}
                                                >
                                                    {item["08-Jun-26"]}
                                                </td>

                                                <td
                                                    className="text-end"
                                                    title={item["09-Jun-26"]}
                                                    style={{
                                                        ...ColWidth18,
                                                        whiteSpace: "nowrap",
                                                        overflow: "hidden",
                                                        textOverflow: "ellipsis",
                                                    }}
                                                >
                                                    {item["09-Jun-26"]}
                                                </td>

                                                <td
                                                    className="text-end"
                                                    title={item["10-Jun-26"]}
                                                    style={{
                                                        ...ColWidth19,
                                                        whiteSpace: "nowrap",
                                                        overflow: "hidden",
                                                        textOverflow: "ellipsis",
                                                    }}
                                                >
                                                    {item["10-Jun-26"]}
                                                </td>

                                                <td
                                                    className="text-end"
                                                    title={item["11-Jun-26"]}
                                                    style={{
                                                        ...ColWidth20,
                                                        whiteSpace: "nowrap",
                                                        overflow: "hidden",
                                                        textOverflow: "ellipsis",
                                                    }}
                                                >
                                                    {item["11-Jun-26"]}
                                                </td>

                                                <td
                                                    className="text-end"
                                                    title={item["12-Jun-26"]}
                                                    style={{
                                                        ...ColWidth21,
                                                        whiteSpace: "nowrap",
                                                        overflow: "hidden",
                                                        textOverflow: "ellipsis",
                                                    }}
                                                >
                                                    {item["12-Jun-26"]}
                                                </td>

                                                <td
                                                    className="text-end"
                                                    title={item["13-Jun-26"]}
                                                    style={{
                                                        ...ColWidth22,
                                                        whiteSpace: "nowrap",
                                                        overflow: "hidden",
                                                        textOverflow: "ellipsis",
                                                    }}
                                                >
                                                    {item["13-Jun-26"]}
                                                </td>


                                                <td className="text-end" style={ColWidth23}>{item['14-Jun-26']} </td>
                                                <td className="text-end" style={ColWidth24}>{item['15-Jun-26']} </td>
                                                <td className="text-end" style={ColWidth25}>{item['16-Jun-26']} </td>
                                                <td className="text-end" style={ColWidth26}>{item['17-Jun-26']} </td>
                                                <td className="text-end" style={ColWidth27}>{item['18-Jun-26']} </td>
                                                <td className="text-end" style={ColWidth28}>{item['19-Jun-26']} </td>
                                                <td className="text-end" style={ColWidth29}>{item['20-Jun-26']} </td>
                                                <td className="text-end" style={ColWidth30}>{item['21-Jun-26']} </td>
                                                <td className="text-end" style={ColWidth31}>{item['22-Jun-26']} </td>
                                                <td className="text-end" style={ColWidth32}>{item['23-Jun-26']} </td>
                                                <td className="text-end" style={ColWidth33}>{item['24-Jun-26']} </td>
                                                <td className="text-end" style={ColWidth34}>{item['25-Jun-26']} </td>
                                                <td className="text-end" style={ColWidth35}>{item['26-Jun-26']} </td>
                                                <td className="text-end" style={ColWidth36}>{item['27-Jun-26']} </td>
                                                <td className="text-end" style={ColWidth37}>{item['28-Jun-26']} </td>
                                                <td className="text-end" style={ColWidth38}>{item['29-Jun-26']} </td>
                                                <td className="text-end" style={ColWidth39}>{item['30-Jun-26']} </td>
                                                <td className="text-end" style={ColWidth40}>{item['Total Production']} </td>

                                            </tr>
                                        ))}
                                        {/* Empty rows if data less than totalRows */}
                                        {Array.from({ length: Math.max(0, totalRows - tableData.length) }).map(
                                            (_, rowIndex) => (
                                                <tr
                                                    key={`blank-${rowIndex}`}
                                                    style={{ backgroundColor: getcolor, color: fontcolor }}
                                                >
                                                    {Array.from({ length: 39 }).map((_, colIndex) => (
                                                        <td key={`blank-${rowIndex}-${colIndex}`}>&nbsp;</td>
                                                    ))}
                                                </tr>
                                            )
                                        )}
                                        <tr>
                                            <td style={firstColWidth}></td>
                                            <td style={thirdColWidth}></td>
                                            <td style={forthColWidth}></td>
                                            <td style={fifthColWidth}></td>
                                            <td style={sixthColWidth}></td>
                                            <td style={seventhColWidth}></td>
                                            <td style={eighthColWidth}></td>
                                            <td style={ninthColWidth}></td>
                                            <td style={tenthColWidth}></td>
                                            <td style={ColWidth11}></td>
                                            <td style={ColWidth12}></td>
                                            <td style={ColWidth13}></td>
                                            <td style={ColWidth14}></td>
                                            <td style={ColWidth15}></td>
                                            <td style={ColWidth16}></td>
                                            <td style={ColWidth17}></td>
                                            <td style={ColWidth18}></td>
                                            <td style={ColWidth19}></td>
                                            <td style={ColWidth20}></td>
                                            <td style={ColWidth21}></td>
                                            <td style={ColWidth22}></td>
                                            <td style={ColWidth23}></td>
                                            <td style={ColWidth24}></td>
                                            <td style={ColWidth25}></td>
                                            <td style={ColWidth26}></td>
                                            <td style={ColWidth27}></td>
                                            <td style={ColWidth28}></td>
                                            <td style={ColWidth29}></td>
                                            <td style={ColWidth30}></td>
                                            <td style={ColWidth31}></td>
                                            <td style={ColWidth32}></td>
                                            <td style={ColWidth33}></td>
                                            <td style={ColWidth34}></td>
                                            <td style={ColWidth35}></td>
                                            <td style={ColWidth36}></td>
                                            <td style={ColWidth37}></td>
                                            <td style={ColWidth38}></td>
                                            <td style={ColWidth39}></td>
                                            <td style={ColWidth40}></td>
                                        </tr>
                                    </>
                                )}
                            </tbody>

                            {/* Sticky Footer */}
                            <tfoot
                                style={{
                                    position: "sticky",
                                    bottom: 0,
                                    zIndex: 2,
                                    background: getcolor,
                                    borderTop: `1px solid ${fontcolor}`,
                                }}
                            >
                                <tr >
                                    <td>{tableData.length}</td>
                                    <td> </td>
                                    <td></td>
                                    <td></td>
                                    <td></td>
                                    <td></td>
                                    <td></td>
                                    <td></td>

                                    <td style={{ textAlign: 'right' }}> {total1}</td>
                                    <td style={{ textAlign: 'right' }}> {total2}</td>
                                    <td style={{ textAlign: 'right' }}> {total3}</td>
                                    <td style={{ textAlign: 'right' }}> {total4}</td>
                                    <td style={{ textAlign: 'right' }}> {total5}</td>
                                    <td style={{ textAlign: 'right' }}> {total6}</td>
                                    <td style={{ textAlign: 'right' }}> {total7}</td>
                                    <td style={{ textAlign: 'right' }}> {total8}</td>
                                    <td style={{ textAlign: 'right' }}> {total9}</td>
                                    <td style={{ textAlign: 'right' }}> {total10}</td>
                                    <td style={{ textAlign: 'right' }}> {total11}</td>
                                    <td style={{ textAlign: 'right' }}> {total12}</td>
                                    <td style={{ textAlign: 'right' }}> {total13}</td>
                                    <td style={{ textAlign: 'right' }}> {total14}</td>
                                    <td style={{ textAlign: 'right' }}> {total15}</td>
                                    <td style={{ textAlign: 'right' }}> {total16}</td>
                                    <td style={{ textAlign: 'right' }}> {total17}</td>
                                    <td style={{ textAlign: 'right' }}> {total18}</td>
                                    <td style={{ textAlign: 'right' }}> {total19}</td>
                                    <td style={{ textAlign: 'right' }}> {total20}</td>
                                    <td style={{ textAlign: 'right' }}> {total21}</td>
                                    <td style={{ textAlign: 'right' }}> {total22}</td>
                                    <td style={{ textAlign: 'right' }}> {total23}</td>
                                    <td style={{ textAlign: 'right' }}> {total24}</td>
                                    <td style={{ textAlign: 'right' }}> {total25}</td>
                                    <td style={{ textAlign: 'right' }}> {total26}</td>
                                    <td style={{ textAlign: 'right' }}> {total27}</td>
                                    <td style={{ textAlign: 'right' }}> {total28}</td>
                                    <td style={{ textAlign: 'right' }}> {total29}</td>
                                    <td style={{ textAlign: 'right' }}> {total30}</td>
                                    <td style={{ textAlign: 'right' }}> {GrandTotal}</td>

                                </tr>
                            </tfoot>
                        </table>
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
                        highlightFirstLetter={true}
                        ref={input3Ref}
                        onClick={() => {
                            fetchReceivableReport();
                            resetSorting();
                        }}
                        onFocus={(e) => (e.currentTarget.style.border = "2px solid red")}
                        onBlur={(e) =>
                            (e.currentTarget.style.border = `1px solid ${fontcolor}`)
                        }
                    />
                </div>
            </div>


        </div>




    );
}