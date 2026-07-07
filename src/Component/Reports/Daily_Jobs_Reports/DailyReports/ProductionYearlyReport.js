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

export default function ProductionYearlyReport() {
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


    const [Jantotal, setJantotal] = useState(0);
    const [Febtotal, setFebtotal] = useState(0);
    const [Martotal, setMartotal] = useState(0);
    const [Aprtotal, setAprtotal] = useState(0);
    const [Maytotal, setMaytotal] = useState(0);
    const [Junetotal, setJunetotal] = useState(0);
    const [julytotal, setjulytotal] = useState(0);
    const [Augtotal, setAugtotal] = useState(0);
    const [Septotal, setSeptotal] = useState(0);
    const [Octtotal, setOcttotal] = useState(0);
    const [Novtotal, setNovtotal] = useState(0);
    const [Dectotal, setDectotal] = useState(0);
    const [Total, setTotal] = useState(0);



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
        const apiUrl = apiLinks + "/ProductionYearlyReport.php";
        setIsLoading(true);
        const formData = new URLSearchParams({
            code: organisation.code,
            //   FLocCod: locationnumber || getLocationNumber,
            //   FYerDsc: yeardescription || getyeardescription,
            FRepYer: transectionType,
            //   code: 'AGFACTORY',
        }).toString();

        axios
            .post(apiUrl, formData)
            .then((response) => {
                setIsLoading(false);

                setJantotal(response.data.MonthTotal["Jan-2026"]);
                setFebtotal(response.data.MonthTotal["Feb-2026"]);
                setMartotal(response.data.MonthTotal["Mar-2026"]);
                setAprtotal(response.data.MonthTotal["Apr-2026"]);
                setMaytotal(response.data.MonthTotal["May-2026"]);
                setJunetotal(response.data.MonthTotal["Jun-2026"]);
                setjulytotal(response.data.MonthTotal["Jul-2026"]);
                setAugtotal(response.data.MonthTotal["Aug-2026"]);
                setSeptotal(response.data.MonthTotal["Sep-2026"]);
                setOcttotal(response.data.MonthTotal["Oct-2026"]);
                setNovtotal(response.data.MonthTotal["Nov-2026"]);
                setDectotal(response.data.MonthTotal["Dec-2026"]);
                setTotal(response.data.MonthTotal["Total-2026"]);


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

        const numColumns = 21; // Ensure this matches the actual number of columns
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
        companyRow.eachCell((cell) => {
            cell.font = fontCompanyName;
            cell.alignment = { horizontal: "center" };
        });
        worksheet.getRow(companyRow.number).height = 30;
        worksheet.mergeCells(
            `A${companyRow.number}:${String.fromCharCode(65 + numColumns - 1)}${companyRow.number}`,
        );

        // Store List
        const storeListRow = worksheet.addRow(["Production Yearly Report"]);
        storeListRow.eachCell((cell) => {
            cell.font = fontStoreList;
            cell.alignment = { horizontal: "center" };
        });
        worksheet.mergeCells(
            `A${storeListRow.number}:${String.fromCharCode(65 + numColumns - 1)}${storeListRow.number}`,
        );

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
            "Jan",
            "Feb",
            "Mar",
            "Apr",
            "May",
            "June",
            "July",
            "Aug",
            "Sep",
            "Oct",
            "Nov",
            "Dec",
            "Total",
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
                item["Jan-2026"],

                toNumber(item["Feb-2026"]),
                toNumber(item["Mar-2026"]),
                toNumber(item["Apr-2026"]),
                toNumber(item["May-2026"]),
                toNumber(item["Jun-2026"]),
                toNumber(item["Jul-2026"]),
                toNumber(item["Aug-2026"]),
                toNumber(item["Sep-2026"]),
                toNumber(item["Oct-2026"]),
                toNumber(item["Nov-2026"]),
                toNumber(item["Dec-2026"]),
                toNumber(item["Total-2026"]),

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
        [10, 20, 40, 25, 25, 25, 20, 25, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12].forEach((width, index) => {
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
            String(formatValue(Jantotal)),
            String(formatValue(Febtotal)),
            String(formatValue(Martotal)),
            String(formatValue(Aprtotal)),
            String(formatValue(Maytotal)),
            String(formatValue(Junetotal)),
            String(formatValue(julytotal)),
            String(formatValue(Augtotal)),
            String(formatValue(Septotal)),
            String(formatValue(Octtotal)),
            String(formatValue(Novtotal)),
            String(formatValue(Dectotal)),
            String(formatValue(Total)),


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
        saveAs(blob, `ProductionYearlyReport As On ${currentDate}.xlsx`);
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
        "Jan-2026": [],
        "Feb-2026": [],
        "Mar-2026": [],
        "Apr-2026": [],
        "May-2026": [],
        "Jun-2026": [],
        "Jul-2026": [],
        "Aug-2026": [],
        "Sep-2026": [],
        "Oct-2026": [],
        "Nov-2026": [],
        "Dec-2026": [],
        "Total-2026": [],
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
        "Jan-2026": null,
        "Feb-2026": null,
        "Mar-2026": null,
        "Apr-2026": null,
        "May-2026": null,
        "Jun-2026": null,
        "Jul-2026": null,
        "Aug-2026": null,
        "Sep-2026": null,
        "Oct-2026": null,
        "Nov-2026": null,
        "Dec-2026": null,
        "Total-2026": null,
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
            "Jan-2026": null,
            "Feb-2026": null,
            "Mar-2026": null,
            "Apr-2026": null,
            "May-2026": null,
            "Jun-2026": null,
            "Jul-2026": null,
            "Aug-2026": null,
            "Sep-2026": null,
            "Oct-2026": null,
            "Nov-2026": null,
            "Dec-2026": null,
            "Total-2026": null,
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
                "Jan-2026": tableData.map((row) => row["Jan-2026"]),
                "Feb-2026": tableData.map((row) => row["Feb-2026"]),
                "Mar-2026": tableData.map((row) => row["Mar-2026"]),
                "Apr-2026": tableData.map((row) => row["Apr-2026"]),
                "May-2026": tableData.map((row) => row["May-2026"]),
                "Jun-2026": tableData.map((row) => row["Jun-2026"]),
                "Jul-2026": tableData.map((row) => row["Jul-2026"]),
                "Aug-2026": tableData.map((row) => row["Aug-2026"]),
                "Sep-2026": tableData.map((row) => row["Sep-2026"]),
                "Oct-2026": tableData.map((row) => row["Oct-2026"]),
                "Nov-2026": tableData.map((row) => row["Nov-2026"]),
                "Dec-2026": tableData.map((row) => row["Dec-2026"]),
                "Total-2026": tableData.map((row) => row["Total-2026"]),
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
                "Jan-2026": [],
                "Feb-2026": [],
                "Mar-2026": [],
                "Apr-2026": [],
                "May-2026": [],
                "Jun-2026": [],
                "Jul-2026": [],
                "Aug-2026": [],
                "Sep-2026": [],
                "Oct-2026": [],
                "Nov-2026": [],
                "Dec-2026": [],
                "Total-2026": [],


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
                <NavComponent textdata="Production Yearly Report" />

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


                        {/* <div
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
              </div> */}

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
                                    <th style={{ cursor: "pointer" }} onClick={() => handleSorting("Jan-2026")}>
                                        Jan <i className="fa-solid fa-caret-down" style={getIconStyle("Jan-2026")}></i>
                                    </th>

                                    <th style={{ cursor: "pointer" }} onClick={() => handleSorting("Feb-2026")}>
                                        Feb <i className="fa-solid fa-caret-down" style={getIconStyle("Feb-2026")}></i>
                                    </th>

                                    <th style={{ cursor: "pointer" }} onClick={() => handleSorting("Mar-2026")}>
                                        Mar <i className="fa-solid fa-caret-down" style={getIconStyle("Mar-2026")}></i>
                                    </th>

                                    <th style={{ cursor: "pointer" }} onClick={() => handleSorting("Apr-2026")}>
                                        Apr <i className="fa-solid fa-caret-down" style={getIconStyle("Apr-2026")}></i>
                                    </th>

                                    <th style={{ cursor: "pointer" }} onClick={() => handleSorting("May-2026")}>
                                        May <i className="fa-solid fa-caret-down" style={getIconStyle("May-2026")}></i>
                                    </th>

                                    <th style={{ cursor: "pointer" }} onClick={() => handleSorting("Jun-2026")}>
                                        Jun <i className="fa-solid fa-caret-down" style={getIconStyle("Jun-2026")}></i>
                                    </th>

                                    <th style={{ cursor: "pointer" }} onClick={() => handleSorting("Jul-2026")}>
                                        Jul <i className="fa-solid fa-caret-down" style={getIconStyle("Jul-2026")}></i>
                                    </th>

                                    <th style={{ cursor: "pointer" }} onClick={() => handleSorting("Aug-2026")}>
                                        Aug <i className="fa-solid fa-caret-down" style={getIconStyle("Aug-2026")}></i>
                                    </th>

                                    <th style={{ cursor: "pointer" }} onClick={() => handleSorting("Sep-2026")}>
                                        Sep <i className="fa-solid fa-caret-down" style={getIconStyle("Sep-2026")}></i>
                                    </th>

                                    <th style={{ cursor: "pointer" }} onClick={() => handleSorting("Oct-2026")}>
                                        Oct <i className="fa-solid fa-caret-down" style={getIconStyle("Oct-2026")}></i>
                                    </th>

                                    <th style={{ cursor: "pointer" }} onClick={() => handleSorting("Nov-2026")}>
                                        Nov <i className="fa-solid fa-caret-down" style={getIconStyle("Nov-2026")}></i>
                                    </th>

                                    <th style={{ cursor: "pointer" }} onClick={() => handleSorting("Dec-2026")}>
                                        Dec <i className="fa-solid fa-caret-down" style={getIconStyle("Dec-2026")}></i>
                                    </th>

                                    <th style={{ cursor: "pointer" }} onClick={() => handleSorting("Total-2026")}>
                                        Total <i className="fa-solid fa-caret-down" style={getIconStyle("Total-2026")}></i>
                                    </th>
                                </tr>
                            </thead>

                            {/* Table Body */}
                            <tbody>
                                {isLoading ? (
                                    <>
                                        <tr style={{ backgroundColor: getcolor }}>
                                            <td colSpan={21} className="text-center">
                                                <Spinner animation="border" variant="primary" />
                                            </td>
                                        </tr>
                                        {Array.from({ length: totalRows - 5 }).map((_, rowIndex) => (
                                            <tr
                                                key={`blank-${rowIndex}`}
                                                style={{ backgroundColor: getcolor, color: fontcolor }}
                                            >
                                                {Array.from({ length: 21 }).map((_, colIndex) => (
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
                                                    title={item.Company}
                                                    style={{
                                                        ...fifthColWidth,
                                                        whiteSpace: "nowrap",
                                                        overflow: "hidden",
                                                        textOverflow: "ellipsis",
                                                    }}
                                                >
                                                    {item.Company}
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
                                                    {item['Jan-2026']}
                                                </td>

                                                <td
                                                    className="text-end"
                                                    title={item["Feb-2026"]}
                                                    style={{
                                                        ...ColWidth11,
                                                        whiteSpace: "nowrap",
                                                        overflow: "hidden",
                                                        textOverflow: "ellipsis",
                                                    }}
                                                >
                                                    {item["Feb-2026"]}
                                                </td>

                                                <td
                                                    className="text-end"
                                                    title={item["Mar-2026"]}
                                                    style={{
                                                        ...ColWidth12,
                                                        whiteSpace: "nowrap",
                                                        overflow: "hidden",
                                                        textOverflow: "ellipsis",
                                                    }}
                                                >
                                                    {item["Mar-2026"]}
                                                </td>

                                                <td
                                                    className="text-end"
                                                    title={item["Apr-2026"]}
                                                    style={{
                                                        ...ColWidth13,
                                                        whiteSpace: "nowrap",
                                                        overflow: "hidden",
                                                        textOverflow: "ellipsis",
                                                    }}
                                                >
                                                    {item["Apr-2026"]}
                                                </td>

                                                <td
                                                    className="text-end"
                                                    title={item["May-2026"]}
                                                    style={{
                                                        ...ColWidth14,
                                                        whiteSpace: "nowrap",
                                                        overflow: "hidden",
                                                        textOverflow: "ellipsis",
                                                    }}
                                                >
                                                    {item["May-2026"]}
                                                </td>

                                                <td
                                                    className="text-end"
                                                    title={item["Jun-2026"]}
                                                    style={{
                                                        ...ColWidth15,
                                                        whiteSpace: "nowrap",
                                                        overflow: "hidden",
                                                        textOverflow: "ellipsis",
                                                    }}
                                                >
                                                    {item["Jun-2026"]}
                                                </td>

                                                <td
                                                    className="text-end"
                                                    title={item["Jul-2026"]}
                                                    style={{
                                                        ...ColWidth16,
                                                        whiteSpace: "nowrap",
                                                        overflow: "hidden",
                                                        textOverflow: "ellipsis",
                                                    }}
                                                >
                                                    {item["Jul-2026"]}
                                                </td>

                                                <td
                                                    className="text-end"
                                                    title={item["Aug-2026"]}
                                                    style={{
                                                        ...ColWidth17,
                                                        whiteSpace: "nowrap",
                                                        overflow: "hidden",
                                                        textOverflow: "ellipsis",
                                                    }}
                                                >
                                                    {item["Aug-2026"]}
                                                </td>

                                                <td
                                                    className="text-end"
                                                    title={item["Sep-2026"]}
                                                    style={{
                                                        ...ColWidth18,
                                                        whiteSpace: "nowrap",
                                                        overflow: "hidden",
                                                        textOverflow: "ellipsis",
                                                    }}
                                                >
                                                    {item["Sep-2026"]}
                                                </td>

                                                <td
                                                    className="text-end"
                                                    title={item["Oct-2026"]}
                                                    style={{
                                                        ...ColWidth19,
                                                        whiteSpace: "nowrap",
                                                        overflow: "hidden",
                                                        textOverflow: "ellipsis",
                                                    }}
                                                >
                                                    {item["Oct-2026"]}
                                                </td>

                                                <td
                                                    className="text-end"
                                                    title={item["Nov-2026"]}
                                                    style={{
                                                        ...ColWidth20,
                                                        whiteSpace: "nowrap",
                                                        overflow: "hidden",
                                                        textOverflow: "ellipsis",
                                                    }}
                                                >
                                                    {item["Nov-2026"]}
                                                </td>

                                                <td
                                                    className="text-end"
                                                    title={item["Dec-2026"]}
                                                    style={{
                                                        ...ColWidth21,
                                                        whiteSpace: "nowrap",
                                                        overflow: "hidden",
                                                        textOverflow: "ellipsis",
                                                    }}
                                                >
                                                    {item["Dec-2026"]}
                                                </td>

                                                <td
                                                    className="text-end"
                                                    title={item["Total-2026"]}
                                                    style={{
                                                        ...ColWidth22,
                                                        whiteSpace: "nowrap",
                                                        overflow: "hidden",
                                                        textOverflow: "ellipsis",
                                                    }}
                                                >
                                                    {item["Total-2026"]}
                                                </td>
                                            </tr>
                                        ))}
                                        {/* Empty rows if data less than totalRows */}
                                        {Array.from({ length: Math.max(0, totalRows - tableData.length) }).map(
                                            (_, rowIndex) => (
                                                <tr
                                                    key={`blank-${rowIndex}`}
                                                    style={{ backgroundColor: getcolor, color: fontcolor }}
                                                >
                                                    {Array.from({ length: 21 }).map((_, colIndex) => (
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

                                    <td style={{ textAlign: 'right' }}> {Jantotal}</td>
                                    <td style={{ textAlign: 'right' }}> {Febtotal}</td>
                                    <td style={{ textAlign: 'right' }}> {Martotal}</td>
                                    <td style={{ textAlign: 'right' }}> {Aprtotal}</td>
                                    <td style={{ textAlign: 'right' }}> {Maytotal}</td>
                                    <td style={{ textAlign: 'right' }}> {Junetotal}</td>
                                    <td style={{ textAlign: 'right' }}> {julytotal}</td>
                                    <td style={{ textAlign: 'right' }}> {Augtotal}</td>
                                    <td style={{ textAlign: 'right' }}> {Septotal}</td>
                                    <td style={{ textAlign: 'right' }}> {Octtotal}</td>
                                    <td style={{ textAlign: 'right' }}> {Novtotal}</td>
                                    <td style={{ textAlign: 'right' }}> {Dectotal}</td>
                                    <td style={{ textAlign: 'right' }}> {Total}</td>
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