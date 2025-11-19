import React, { useState, useEffect, useRef } from "react";
import { Container, Spinner, Nav } from "react-bootstrap";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import { useTheme } from "../../../../ThemeContext";
import { getUserData, getOrganisationData, getLocationnumber, getYearDescription } from "../../../Auth";
import NavComponent from "../../../MainComponent/Navform/navbarform";
import SingleButton from "../../../MainComponent/Button/SingleButton/SingleButton";
import "react-datepicker/dist/react-datepicker.css";
import jsPDF from "jspdf";
import ExcelJS from "exceljs";
import { saveAs } from "file-saver";
import "react-calendar/dist/Calendar.css";
import { useSelector, useDispatch } from "react-redux";
import { fetchGetUser } from "../../../Redux/action";
import { useHotkeys } from "react-hotkeys-hook";
import "react-toastify/dist/ReactToastify.css";

export default function GoalList() {
    const navigate = useNavigate();
    const user = getUserData();
    const organisation = getOrganisationData();
    const yeardescription = getYearDescription();
    const locationnumber = getLocationnumber();
    const saleSelectRef = useRef(null);
    const input1Ref = useRef(null);
    const input2Ref = useRef(null);
    const input3Ref = useRef(null);

    const [sortData, setSortData] = useState("ASC");

    const [isAscendingcode, setisAscendingcode] = useState(true);
    const [isAscendingdec, setisAscendingdec] = useState(true);
    const [isAscendingsts, setisAscendingsts] = useState(true);

    const [searchQuery, setSearchQuery] = useState("");
    const [transectionType, settransectionType] = useState("");

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
        const apiUrl = apiLinks + "/GoalList.php";
        setIsLoading(true);
        const formData = new URLSearchParams({
            FAccSts: transectionType,
            code: organisation.code,
            FLocCod: locationnumber || getLocationNumber,
            FGolSts: transectionType,
            code: 'CRYSTALGYM',
            FLocCod: '001',
            FSchTxt: searchQuery,
        }).toString();

        axios
            .post(apiUrl, formData)
            .then((response) => {
                setIsLoading(false);

                if (response.data && Array.isArray(response.data)) {
                    setTableData(response.data);
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
        if (!hasComponentMountedPreviously || (input1Ref && input1Ref.current)) {
            if (input1Ref && input1Ref.current) {
                setTimeout(() => {
                    input1Ref.current.focus();
                    // saleSelectRef.current.select();
                }, 0);
            }
            sessionStorage.setItem("componentMounted", "true");
        }
    }, []);

    const handleTransactionTypeChange = (event) => {
        const selectedTransactionType = event.target.value;
        settransectionType(selectedTransactionType);
    };

    ///////////////////////////// DOWNLOAD PDF CODE ////////////////////////////////////////////////////////////
    const exportPDFHandler = () => {
        const globalfontsize = 12;
        console.log("gobal font data", globalfontsize);

        // Create a new jsPDF instance with landscape orientation
        const doc = new jsPDF({ orientation: "potraite" });

        // Define table data (rows)
        const rows = tableData.map((item) => [
            item.Code,
            item.Description,
            item.Status,
            // item.Amount
        ]);

        // Add summary row to the table
        // rows.push(["", "", "", "", "", ""]);

        // Define table column headers and individual column widths
        const headers = ["Code", "Description", "Status"];
        const columnWidths = [22, 90, 15];

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
                // const isevenRow = i % 2 == 0; // Check if the row index is odd

                const isRedRow = row[0] && parseInt(row[0]) > 10000000000; // Check if tctgcod is greater than 100
                let textColor = [0, 0, 0]; // Default text color
                let fontName = normalFont; // Default font

                if (isRedRow) {
                    textColor = [255, 0, 0]; // Red color
                    fontName = boldFont; // Set bold font for red-colored row
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

                    if (cellIndex === 2) {
                        const rightAlignX = startX + columnWidths[cellIndex] / 2; // Adjust for right alignment
                        doc.text(cellValue, rightAlignX, cellY, {
                            align: "center",
                            baseline: "middle",
                        });
                    }

                    else if (cellIndex === 13) {
                        const rightAlignX = startX + columnWidths[cellIndex] - 2; // Adjust for right alignment
                        doc.text(cellValue, rightAlignX, cellY, {
                            align: "right",
                            baseline: "middle", // This centers vertically
                        });
                    } else {
                        doc.text(cellValue, cellX, cellY, {
                            baseline: "middle" // This centers vertically
                        });
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
                    rightX - 40,
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

                addTitle(`Goal List`, "", "", pageNumber, startY, 12); // Render sale report title with decreased font size, provide the time, and page number
                startY += -5;

                const labelsX = (doc.internal.pageSize.width - totalWidth) / 2;
                const labelsY = startY + 4; // Position the labels below the titles and above the table

                // Set font size and weight for the labels
                doc.setFontSize(12);
                doc.setFont(getfontstyle, "300");

                let status =
                    transectionType === "N"
                        ? "NON-ACTIVE"
                        : transectionType === "A"
                            ? "ACTIVE"
                            : "ALL";
                let search = searchQuery ? searchQuery : "";

                // Set font style, size, and family
                doc.setFont(getfontstyle, "300"); // Font family and style ('normal', 'bold', 'italic', etc.)
                doc.setFontSize(10); // Font size

                doc.setFont(getfontstyle, "bold"); // Set font to bold
                doc.text(`STATUS :`, labelsX, labelsY + 8.5); // Draw bold label
                doc.setFont(getfontstyle, "normal"); // Reset font to normal
                doc.text(`${status}`, labelsX + 20, labelsY + 8.5); // Draw the value next to the label

                if (searchQuery) {
                    doc.setFont(getfontstyle, "bold"); // Set font to bold
                    doc.text(`SEARCH :`, labelsX + 70, labelsY + 8.5); // Draw bold label
                    doc.setFont(getfontstyle, "normal"); // Reset font to normal
                    doc.text(`${search}`, labelsX + 90, labelsY + 8.5); // Draw the value next to the label
                }

                // // Reset font weight to normal if necessary for subsequent text
                doc.setFont(getfontstyle, "bold"); // Set font to bold
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
        doc.save(`GoalList As On ${date}.pdf`);
    };
    ///////////////////////////// DOWNLOAD PDF CODE ////////////////////////////////////////////////////////////

    ///////////////////////////// DOWNLOAD PDF EXCEL //////////////////////////////////////////////////////////
    const handleDownloadCSV = async () => {
        const workbook = new ExcelJS.Workbook();
        const worksheet = workbook.addWorksheet("Sheet1");

        const numColumns = 3; // Ensure this matches the actual number of columns

        const columnAlignments = ["left", "left", "center"]

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
            `A${companyRow.number}:${String.fromCharCode(65 + numColumns - 1)}${companyRow.number
            }`
        );

        // Add Store List row
        const storeListRow = worksheet.addRow(["Goal List"]);
        storeListRow.eachCell((cell) => {
            cell.font = fontStoreList;
            cell.alignment = { horizontal: "center" };
        });

        worksheet.mergeCells(
            `A${storeListRow.number}:${String.fromCharCode(65 + numColumns - 1)}${storeListRow.number
            }`
        );

        // Add an empty row after the title section
        worksheet.addRow([]);

        let typestatus =
            transectionType === "N"
                ? "NON-ACTIVE"
                : transectionType === "A"
                    ? "ACTIVE"
                    : "ALL";
        let typesearch = searchQuery || "";

        const typeAndStoreRow3 = worksheet.addRow(
            searchQuery
                ? ["STATUS :", typestatus, "SEARCH :", typesearch]
                : ["STATUS :", typestatus, ""]
        );

        // Apply styling for the status row
        typeAndStoreRow3.eachCell((cell, colIndex) => {
            cell.font = {
                name: "CustomFont" || "CustomFont",
                size: 10,
                bold: [1, 3].includes(colIndex),
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
        const headers = ["Code", "Description", "Status"];
        const headerRow = worksheet.addRow(headers);
        headerRow.eachCell((cell) => Object.assign(cell, headerStyle));

        // Add data rows
        tableData.forEach((item) => {
            const row = worksheet.addRow([item.Code, item.Description, item.Status]);

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

        // Set column widths
        [11, 50, 13].forEach((width, index) => {
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
        saveAs(blob, `GoalList As On ${currentdate}.xlsx`);
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

    const [columns, setColumns] = useState({
        Code: [],
        Description: [],
        Status: [],
        // Amount: [],
    });
    const [columnSortOrders, setColumnSortOrders] = useState({
        Code: "",
        Description: "",
        Status: "",
        // Amount: "",
    });

    // When you receive your initial table data, transform it into column-oriented format
    useEffect(() => {
        if (tableData.length > 0) {
            const newColumns = {
                Code: tableData.map((row) => row.Code),
                Description: tableData.map((row) => row.Description),
                Status: tableData.map((row) => row.Status),
                // Amount: tableData.map((row) => row.Amount),
            };
            setColumns(newColumns);
        }
    }, [tableData]);

    const handleSorting = (col) => {
        const currentOrder = columnSortOrders[col];
        const newOrder = currentOrder === "ASC" ? "DSC" : "ASC";

        // Copy full rows
        const fullRows = tableData.slice(); // Don't mutate original

        // Perform full-row sorting by the selected column
        fullRows.sort((a, b) => {
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

        // Transform the sorted full rows back into column format
        const newColumns = {
            Code: fullRows.map((row) => row.Code),
            Description: fullRows.map((row) => row.Description),
            Status: fullRows.map((row) => row.Status),
            Amount: fullRows.map((row) => row.Amount),
        };

        setColumns(newColumns);

        // Set the sort order
        const resetSortOrders = Object.keys(columnSortOrders).reduce((acc, key) => {
            acc[key] = key === col ? newOrder : "";
            return acc;
        }, {});
        setColumnSortOrders(resetSortOrders);
    };

    const resetSorting = () => {
        setColumnSortOrders({
            Code: null,
            Description: null,
            Status: null,
            // Amount: null,
        });
    };


    const renderTableData = () => {
        const rowCount = Math.max(
            columns.Code.length,
            columns.Description.length,
            columns.Status.length,
            // columns.Amount.length
        );

        const rows = [];
        for (let i = 0; i < rowCount; i++) {
            rows.push({
                Code: columns.Code[i],
                Description: columns.Description[i],
                Status: columns.Status[i],
                // Amount: columns.Amount[i],
            });
        }

        return (
            <>
                {isLoading ? (
                    <>
                        <tr style={{ backgroundColor: getcolor }}>
                            <td colSpan="3" className="text-center">
                                <Spinner animation="border" variant="primary" />
                            </td>
                        </tr>
                        {Array.from({ length: Math.max(0, 30 - 5) }).map((_, rowIndex) => (
                            <tr
                                key={`blank-${rowIndex}`}
                                style={{
                                    backgroundColor: getcolor,
                                    color: fontcolor,
                                }}
                            >
                                {Array.from({ length: 3 }).map((_, colIndex) => (
                                    <td key={`blank-${rowIndex}-${colIndex}`}>&nbsp;</td>
                                ))}
                            </tr>
                        ))}
                        <tr>
                            <td style={firstColWidth}></td>
                            <td style={secondColWidth}></td>
                            <td style={thirdColWidth}></td>
                            {/* <td style={forthColWidth}></td> */}

                        </tr>
                    </>
                ) : (
                    <>
                        {rows.map((item, i) => {
                            totalEnteries += 1;
                            return (
                                <tr
                                    key={`${i}-${selectedIndex}`}
                                    ref={(el) => (rowRefs.current[i] = el)}
                                    onClick={() => handleRowClick(i)}
                                    className={selectedIndex === i ? "selected-background" : ""}
                                    style={{
                                        backgroundColor: getcolor,
                                        color: fontcolor,
                                    }}
                                >
                                    <td className="text-start" style={firstColWidth}>
                                        {item.Code}
                                    </td>
                                    <td className="text-start" style={secondColWidth}>
                                        {item.Description}
                                    </td>
                                    <td className="text-center" style={thirdColWidth}>
                                        {item.Status}
                                    </td>
                                    {/* <td className="text-end" style={forthColWidth}>
                                        {item.Amount}
                                    </td> */}
                                </tr>
                            );
                        })}
                        {Array.from({
                            length: Math.max(0, 27 - rows.length),
                        }).map((_, rowIndex) => (
                            <tr
                                key={`blank-${rowIndex}`}
                                style={{
                                    backgroundColor: getcolor,
                                    color: fontcolor,
                                }}
                            >
                                {Array.from({ length: 3 }).map((_, colIndex) => (
                                    <td key={`blank-${rowIndex}-${colIndex}`}>&nbsp;</td>
                                ))}
                            </tr>
                        ))}
                        <tr>
                            <td style={firstColWidth}></td>
                            <td style={secondColWidth}></td>
                            <td style={thirdColWidth}></td>
                            {/* <td style={forthColWidth}></td> */}

                        </tr>
                    </>
                )}
            </>
        );
    };

    const getIconStyle = (colKey) => {
        const order = columnSortOrders[colKey];
        return {
            transform: order === "DSC" ? "rotate(180deg)" : "rotate(0deg)",
            color: order === "ASC" || order === "DSC" ? "red" : "white",
            transition: "transform 0.3s ease, color 0.3s ease",
        };
    };


    // const handleSorting = (col) => {
    //   // Get current sort order for this column
    //   const currentOrder = columnSortOrders[col];
    //   const newOrder = currentOrder === "ASC" ? "DSC" : "ASC";

    //   // Create a copy of the column data
    //   const columnData = [...columns[col]];

    //   // Sort just this column's data
    //   columnData.sort((a, b) => {
    //     const aValue = a !== null ? a.toString() : "";
    //     const bValue = b !== null ? b.toString() : "";

    //     const numA = parseFloat(aValue.replace(/,/g, ""));
    //     const numB = parseFloat(bValue.replace(/,/g, ""));

    //     if (!isNaN(numA) && !isNaN(numB)) {
    //       return newOrder === "ASC" ? numA - numB : numB - numA;
    //     } else {
    //       return newOrder === "ASC"
    //         ? aValue.localeCompare(bValue)
    //         : bValue.localeCompare(aValue);
    //     }
    //   });

    //   // Update just this column's data
    //   setColumns(prev => ({
    //     ...prev,
    //     [col]: columnData
    //   }));

    //   // Update the sort order for this column
    //   setColumnSortOrders(prev => ({
    //     ...prev,
    //     [col]: newOrder
    //   }));
    // };

    useHotkeys("alt+s", () => {
        fetchReceivableReport();
        resetSorting();
    }, { preventDefault: true });

    useHotkeys("alt+p", exportPDFHandler, { preventDefault: true });
    useHotkeys("alt+e", handleDownloadCSV, { preventDefault: true });
    useHotkeys("esc", () => navigate("/MainPage"));


    const firstColWidth = {
        width: "15%",
    };
    const secondColWidth = {
        width: "68%",
    };
    const thirdColWidth = {
        width: "15%",
    };
    // const forthColWidth = {
    //     width: "15%",
    // };



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
        width: isSidebarVisible ? "calc(40vw - 0%)" : "40vw",
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


    return (
        <>
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
                    <NavComponent textdata="Goal List" />

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
                                            Status :
                                        </span>
                                    </label>
                                </div>

                                <select
                                    ref={input1Ref}
                                    onKeyDown={(e) => handleKeyPress(e, input2Ref)}
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
                                    }}
                                >
                                    <option value="">ALL</option>
                                    <option value="A">ACTIVE</option>
                                    <option value="N">NON-ACTIVE</option>
                                </select>
                            </div>

                            <div id="lastDiv" style={{ marginRight: "5px" }}>
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
                                        onKeyDown={(e) => handleKeyPress(e, input3Ref)}
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
                                    fontSize: getdatafontsize,
                                    fontFamily: getfontstyle,
                                    width: "99%",
                                    position: "relative",
                                    paddingRight: "2%",
                                }}
                            >
                                <thead
                                    style={{
                                        fontWeight: "bold",
                                        fontSize: getdatafontsize,
                                        fontFamily: getfontstyle,
                                        height: "24px",
                                        position: "sticky",
                                        top: 0,
                                        boxShadow: "0 2px 4px rgba(0, 0, 0, 0.2)",
                                        backgroundColor: tableHeadColor,
                                    }}
                                >
                                    <tr
                                        style={{ backgroundColor: tableHeadColor, color: "white" }}
                                    >
                                        <td
                                            className="border-dark"
                                            style={firstColWidth}
                                            onClick={() => handleSorting("Code")}
                                        >
                                            Code{" "}
                                            <i
                                                className="fa-solid fa-caret-down caretIconStyle"
                                                style={getIconStyle("Code")}
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
                                            onClick={() => handleSorting("Status")}
                                        >
                                            Status{" "}
                                            <i
                                                className="fa-solid fa-caret-down caretIconStyle"
                                                style={getIconStyle("Status")}
                                            ></i>
                                        </td>
                                        {/* 
                                        <td
                                            className="border-dark"
                                            style={forthColWidth}
                                            onClick={() => handleSorting("Amount")}
                                        >
                                            Amount{" "}
                                            <i
                                                className="fa-solid fa-caret-down caretIconStyle"
                                                style={getIconStyle("Amount")}
                                            ></i>
                                        </td> */}
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
                                maxHeight: "60vh",
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
                                    fontSize: getdatafontsize,
                                    fontFamily: getfontstyle,
                                }}
                            >
                                <tbody id="tablebody">
                                    {renderTableData()} {/* Call the function here */}
                                </tbody>
                            </table>
                        </div>
                    </div>

                    {/* <div
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
              ></div>
                        
             
             
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
        </>
    );
}

