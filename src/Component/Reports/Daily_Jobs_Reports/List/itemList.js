import React, { useState, useEffect, useRef } from "react";
import { Container, Spinner, Nav } from "react-bootstrap";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import { useTheme } from "../../../../ThemeContext";
import { getUserData, getOrganisationData } from "../../../Auth";
import NavComponent from "../../../MainComponent/Navform/navbarform";
import SingleButton from "../../../MainComponent/Button/SingleButton/SingleButton";
import "react-datepicker/dist/react-datepicker.css";
import jsPDF from "jspdf";
import ExcelJS from "exceljs";
import Select from "react-select";
import { components } from "react-select";
import { saveAs } from "file-saver";
import "react-calendar/dist/Calendar.css";
import { useSelector, useDispatch } from "react-redux";
import { fetchGetUser } from "../../../Redux/action";
import { useHotkeys } from "react-hotkeys-hook";
import "react-toastify/dist/ReactToastify.css";
import './list.css';
import { getcompanyData } from "../../../File/Category_Maintenance/Category_Maintenance_Api";

export default function ItemList() {

    const navigate = useNavigate();
    const user = getUserData();
    const organisation = getOrganisationData();

    const saleSelectRef = useRef(null);
    const input1Ref = useRef(null);
    const input2Ref = useRef(null);
    const input3Ref = useRef(null);
    const input4Ref = useRef(null);
    const input5Ref = useRef(null);
    const input6Ref = useRef(null);

    const [Companyselectdata, setCompanyselectdata] = useState("");
    const [GetCompany, setGetCompany] = useState([]);

    const [Capacityselectdata, setCapacityselectdata] = useState("");
    const [GetCapacity, setGetCapacity] = useState([]);

    const [Categoryselectdata, setCategoryselectdata] = useState("");
    const [GetCategory, setGetCategory] = useState([]);

    const [Typeselectdata, setTypeselectdata] = useState("");
    const [GetType, setGetType] = useState([]);


    const [sortData, setSortData] = useState("ASC");

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
    } = useTheme();

    useEffect(() => {
        document.documentElement.style.setProperty("--background-color", getcolor);
    }, [getcolor]);

    const comapnyname = organisation.description;



    //////////////////////// CUSTOM DATE LIMITS ////////////////////////////

    // Toggle the ToDATE && FromDATE CalendarOpen state on each click




    function fetchReceivableReport() {


        const apiUrl = apiLinks + "/ItemList.php";
        setIsLoading(true);
        const formData = new URLSearchParams({
            FItmSts: transectionType,
            code: organisation.code,
            FCtgCod: Companyselectdata,
            FCapCod: Capacityselectdata,
            FTypCod: Typeselectdata,
            FCmpCod: Companyselectdata

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
        if (!hasComponentMountedPreviously || (saleSelectRef && saleSelectRef.current)) {
            if (saleSelectRef && saleSelectRef.current) {
                setTimeout(() => {
                    saleSelectRef.current.focus();
                    // saleSelectRef.current.select();
                }, 0);
            }
            sessionStorage.setItem("componentMounted", "true");
        }
    }, []);


    const handlecompanyKeypress = (event, inputId) => {
        if (event.key === "Enter") {
            const selectedOption = saleSelectRef.current.state.selectValue;
            if (selectedOption && selectedOption.value) {
                setCompanyselectdata(selectedOption.value);
            }
            // const nextInput = document.getElementById(inputId);
            const nextInput = inputId.current;

            if (nextInput) {
                nextInput.focus();
                // nextInput.select();
            } else {
                document.getElementById("submitButton").click();
            }
        }
    };
    const handlecategoryKeypress = (event, inputId) => {
        if (event.key === "Enter") {
            const selectedOption = saleSelectRef.current.state.selectValue;
            if (selectedOption && selectedOption.value) {
                setCategoryselectdata(selectedOption.value);
            }
            // const nextInput = document.getElementById(inputId);
            const nextInput = inputId.current;

            if (nextInput) {
                nextInput.focus();
                // nextInput.select();
            } else {
                document.getElementById("submitButton").click();
            }
        }
    };

    const handlecapacityKeypress = (event, inputId) => {
        if (event.key === "Enter") {
            const selectedOption = saleSelectRef.current.state.selectValue;
            if (selectedOption && selectedOption.value) {
                setCapacityselectdata(selectedOption.value);
            }
            // const nextInput = document.getElementById(inputId);
            const nextInput = inputId.current;

            if (nextInput) {
                nextInput.focus();
                // nextInput.select();
            } else {
                document.getElementById("submitButton").click();
            }
        }
    };
    const handletypeKeypress = (event, inputId) => {
        if (event.key === "Enter") {
            const selectedOption = saleSelectRef.current.state.selectValue;
            if (selectedOption && selectedOption.value) {
                setTypeselectdata(selectedOption.value);
            }
            // const nextInput = document.getElementById(inputId);
            const nextInput = inputId.current;
            if (nextInput) {
                nextInput.focus();
                // nextInput.select();
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

    const handleTransactionTypeChange = (event) => {
        const selectedTransactionType = event.target.value;
        settransectionType(selectedTransactionType);
    };



    //////////////////// CODE FOR COMPANY SELECT///////////////////

    useEffect(() => {
        const apiUrl = apiLinks + "/GetCompany.php";
        const formData = new URLSearchParams({
            code: organisation.code,

        }).toString();
        axios
            .post(apiUrl, formData)
            .then((response) => {

                if (response.data && Array.isArray(response.data)) {
                    setGetCompany(response.data);
                } else {
                    console.warn(
                        "Response data structure is not as expected:",
                        response.data
                    );
                    setGetCompany([]);
                }
            })
            .catch((error) => {
                console.error("Error:", error);

            });
    }, []);
    const options = GetCompany.map((item) => ({
        value: item.tcmpcod,
        label: `${item.tcmpcod}-${item.tcmpdsc.trim()}`,
    }));

    useEffect(() => {
        const apiUrl = apiLinks + "/GetCapacity.php";
        const formData = new URLSearchParams({
            code: organisation.code,

        }).toString();
        axios
            .post(apiUrl, formData)
            .then((response) => {

                if (response.data && Array.isArray(response.data)) {
                    setGetCapacity(response.data);
                } else {
                    console.warn(
                        "Response data structure is not as expected:",
                        response.data
                    );
                    setGetCapacity([]);
                }
            })
            .catch((error) => {
                console.error("Error:", error);

            });
    }, []);

    const capacityoptions = GetCapacity.map((item) => ({
        value: item.tcapcod,
        label: `${item.tcapcod}-${item.tcapdsc.trim()}`,
    }));

    useEffect(() => {
        const apiUrl = apiLinks + "/GetCatg.php";
        const formData = new URLSearchParams({
            code: organisation.code,

        }).toString();
        axios
            .post(apiUrl, formData)
            .then((response) => {

                if (response.data && Array.isArray(response.data)) {
                    setGetCategory(response.data);
                } else {
                    console.warn(
                        "Response data structure is not as expected:",
                        response.data
                    );
                    setGetCategory([]);
                }
            })
            .catch((error) => {
                console.error("Error:", error);

            });
    }, []);

    const categoryoptions = GetCategory.map((item) => ({
        value: item.tctgcod,
        label: `${item.tctgcod}-${item.tctgdsc.trim()}`,
    }));

    useEffect(() => {
        const apiUrl = apiLinks + "/GetType.php";
        const formData = new URLSearchParams({
            code: organisation.code,

        }).toString();
        axios
            .post(apiUrl, formData)
            .then((response) => {

                if (response.data && Array.isArray(response.data)) {
                    setGetType(response.data);
                } else {
                    console.warn(
                        "Response data structure is not as expected:",
                        response.data
                    );
                    setGetType([]);
                }
            })
            .catch((error) => {
                console.error("Error:", error);

            });
    }, []);

    const typeoptions = GetType.map((item) => ({
        value: item.ttypcod,
        label: `${item.ttypcod}-${item.ttypdsc.trim()}`,
    }));

    const DropdownOption = (props) => {
        return (
            <components.Option {...props}>
                <div
                    style={{
                        fontSize: "12px",
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
            fontSize: "12px",
            backgroundColor: getcolor,
            color: fontcolor,
            borderRadius: 0,
            border: `1px solid ${fontcolor}`,
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
            fontSize: "18px",
            display: "flex",
            textAlign: "center !important",
        }),
    });

    ///////////////////////////// DOWNLOAD PDF CODE ////////////////////////////////////////////////////////////
    const exportPDFHandler = () => {
        // Create a new jsPDF instance with landscape orientation
        const doc = new jsPDF({ orientation: "landscape" });

        // Define table data (rows)
        const rows = tableData.map((item) => [
            item.Code,
            item.Description,
            item.Company,
            item.Category,
            item.Capacity,
            item.Type,
        ]);

        // Add summary row to the table
        rows.push([
            "",
            "",
            "",
            "",
            "",
            "",

        ]);

        // Define table column headers and individual column widths
        const headers = [
            "Code",
            "Description",
            "Company",
            "Category",
            "Capacity",
            "Type",


        ];
        const columnWidths = [35, 80, 20, 27, 30, 25,];

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
            doc.setFont("bold"); // Set font to bold
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

                    if (cellIndex === 4 || cellIndex === 5 || cellIndex === 6) {
                        const rightAlignX = startX + columnWidths[cellIndex] - 2; // Adjust for right alignment
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
                // addTitle(
                // 	"38-Shadman Colony 1, Lahore Ph: 0311-1111111",
                // 	time,
                // 	"",
                // 	pageNumber,
                // 	startY,
                // 	14,
                // 	10
                // ); // Render sale report title with decreased font size, provide the time, and page number
                // startY += 7;
                addTitle(
                    `Item List`,
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
                doc.setFontSize(14);
                doc.setFont("verdana", "bold");

                // let typeText = selectedOptionType ? selectedOptionType : "All";
                // let typeItem = selectedOptionCustomer ? selectedOptionCustomer : "All";

                // let typeText = transectionType ? transectionType : "";
                let typeItem = transectionType ? transectionType : "All";

                doc.text(`Status: ${typeItem}`, labelsX, labelsY); // Adjust x-coordinate for From Date
                // doc.text(`Type: ${typeText}`, labelsX + 160, labelsY); // Adjust x-coordinate for From Date

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
        doc.save("ItemList.pdf");

        const pdfBlob = doc.output("blob");
        const pdfFile = new File([pdfBlob], "table_data.pdf", {
            type: "application/pdf",
        });
        // setPdfFile(pdfFile);
        // setShowMailModal(true); // Show the mail modal after downloading PDF
    };
    ///////////////////////////// DOWNLOAD PDF CODE ////////////////////////////////////////////////////////////


    ///////////////////////////// DOWNLOAD PDF EXCEL //////////////////////////////////////////////////////////
    const handleDownloadCSV = async () => {
        const workbook = new ExcelJS.Workbook();
        const worksheet = workbook.addWorksheet("Sheet1");

        const numColumns = 7; // Number of columns

        // Common styles
        const titleStyle = {
            font: { bold: true, size: 12 },
            alignment: { horizontal: "center" },
        };

        const columnAlignments = [
            "left",
            "left",
            "left",
            "left",
            "left",
            "left",


        ];

        // Add an empty row at the start
        worksheet.addRow([]);

        // Add title rows
        [
            comapnyname,
            `Item List`,
        ].forEach((title, index) => {
            worksheet.addRow([title]).eachCell((cell) => (cell.style = titleStyle));
            worksheet.mergeCells(
                `A${index + 2}:${String.fromCharCode(64 + numColumns)}${index + 2}`
            );
        });

        worksheet.addRow([]); // Empty row for spacing

        // let typeText = selectedOptionType ? selectedOptionType : "All";
        let typeItem = transectionType ? transectionType : "All";

        // Add type and store row and bold it
        const typeAndStoreRow = worksheet.addRow([
            // " ",
            // "",
            // "",
            `Status: ${typeItem}`,
            "",
            "",
            // `Type: ${typeText}`,
            "",
            "",
            "",
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

            "Code",
            "Description",
            "Company",
            'Category',
            'Capacity',
            'Type',


        ];
        const headerRow = worksheet.addRow(headers);
        headerRow.eachCell((cell) => {
            cell.style = { ...headerStyle, alignment: { horizontal: "center" } };
        });

        // Add data rows
        tableData.forEach((item) => {
            worksheet.addRow([
                item.Code,
                item.Description,
                item.Company,
                item.Category,
                item.Capacity,
                item.Type,
            ]);
        });

        // Add total row and bold it
        const totalRow = worksheet.addRow([
            "",
            "",
            "",
            "",
            "",
            "",


        ]);
        totalRow.eachCell((cell) => {
            cell.font = { bold: true };
        });

        // Set column widths
        [22, 40, 20, 20, 20, 20,].forEach((width, index) => {
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
        saveAs(blob, "ItemList.xlsx");
    };
    ///////////////////////////// DOWNLOAD PDF EXCEL ///////////////////////////////////////////////////////////


    const dispatch = useDispatch();

    const tableTopColor = "#3368B5";
    const tableHeadColor = "#3368b5";
    const secondaryColor = "white";
    const btnColor = "#3368B5";
    const textColor = "white";

    const [tableData, setTableData] = useState([]);
    console.log('comapnydata', tableData)
    const [selectedSearch, setSelectedSearch] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const { data, loading, error } = useSelector((state) => state.getuser);

    const handleSearch = (e) => {
        setSelectedSearch(e.target.value);
    };

    let totalEntries = 0;



    const handleSorting = async (col) => {
        const parseValue = (value) => {
            // Remove commas and parse the string to a float
            return parseFloat(value.replace(/,/g, ""));
        };

        const sorted = [...tableData].sort((a, b) => {
            const aValue = a[col] !== null ? a[col].toString() : "";
            const bValue = b[col] !== null ? b[col].toString() : "";

            const numA = parseValue(aValue);
            const numB = parseValue(bValue);

            if (!isNaN(numA) && !isNaN(numB)) {
                return sortData === "ASC" ? numA - numB : numB - numA;
            } else {
                return sortData === "ASC"
                    ? aValue.localeCompare(bValue)
                    : bValue.localeCompare(aValue);
            }
        });

        setTableData(sorted);
        setSortData(sortData === "ASC" ? "DSC" : "ASC");
    };

    const firstColWidth = {
        width: "16.5%",
    };
    const secondColWidth = {
        width: "40%",
    };
    const thirdColWidth = {
        width: "10%",
    };
    const forthColWidth = {
        width: "13%",
    };
    const fifthColWidth = {
        width: "9%",
    };
    const sixthColWidth = {
        width: "10%",
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
        width: isSidebarVisible ? "calc(65vw - 0%)" : "65vw",
        position: "relative",
        top: "35%",
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
                    <NavComponent textdata="Item List" />

                    {/* //////////////// FIRST ROW ///////////////////////// */}

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
                                        marginLeft: '10px',
                                        width: "80px",
                                        display: "flex",
                                        justifyContent: "end",

                                    }}

                                >
                                    <label htmlFor="transactionType">
                                        <span style={{ fontSize: "15px", fontWeight: "bold" }}>
                                            Company :
                                        </span>
                                    </label>
                                </div>

                                <div style={{ marginLeft: '3px' }}
                                  
                                >
                                    <Select

                                        className="List-select-class "
                                        ref={saleSelectRef}
                                        options={options}
                                        onKeyDown={(e) => handlecompanyKeypress(e, input1Ref)}
                                        id="selectedsale"
                                        onChange={(selectedOption) => {
                                            if (selectedOption && selectedOption.value) {
                                                setCompanyselectdata(selectedOption.value);
                                            } else {
                                                setCompanyselectdata(""); // Clear the saleType state when selectedOption is null (i.e., when the selection is cleared)
                                            }
                                        }}
                                        components={{ Option: DropdownOption }}
                                        // styles={customStyles1}
                                        styles={customStyles1(!Companyselectdata)}
                                        isClearable
                                        placeholder="Search or select..."
                                    />

                                </div>
                            </div>

                            <div
                                className="d-flex align-items-center"
                                style={{ marginRight: "21px" }}
                            >
                                <div
                                    style={{
                                        marginLeft: '10px',
                                        width: "80px",
                                        display: "flex",
                                        justifyContent: "end",
                                    }}
                                >
                                    <label htmlFor="transactionType">
                                        <span style={{ fontSize: "15px", fontWeight: "bold" }}>
                                            Capacity :
                                        </span>
                                    </label>
                                </div>

                                <div style={{ marginLeft: '3px' }} >
                                    <Select

                                        className="List-select-class "
                                        ref={input2Ref}
                                        options={capacityoptions}
                                        onKeyDown={(e) => handlecapacityKeypress(e, input3Ref)}
                                        id="selectedsale2"
                                        onChange={(selectedOption) => {
                                            if (selectedOption && selectedOption.value) {
                                                setCapacityselectdata(selectedOption.value);
                                            } else {
                                                setCapacityselectdata(""); // Clear the saleType state when selectedOption is null (i.e., when the selection is cleared)
                                            }
                                        }}
                                        components={{ Option: DropdownOption }}
                                        // styles={customStyles1}
                                        styles={customStyles1(!Capacityselectdata)}
                                        isClearable
                                        placeholder="Search or select..."
                                    />

                                </div>
                            </div>
                        </div>
                    </div>
                    {/* //////////////// SECOND ROW ///////////////////////// */}
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
                                        marginLeft: '10px',
                                        width: "80px",
                                        display: "flex",
                                        justifyContent: "end",
                                    }}
                                >
                                    <label htmlFor="transactionType">
                                        <span style={{ fontSize: "15px", fontWeight: "bold" }}>
                                            Category :
                                        </span>
                                    </label>
                                </div>

                                <div style={{ marginLeft: '3px' }} >
                                    <Select

                                        className="List-select-class "
                                        ref={input1Ref}
                                        options={categoryoptions}
                                        onKeyDown={(e) => handlecategoryKeypress(e, input2Ref)}
                                        id="selectedsale"
                                        onChange={(selectedOption) => {
                                            if (selectedOption && selectedOption.value) {
                                                setCategoryselectdata(selectedOption.value);
                                            } else {
                                                setCategoryselectdata(""); // Clear the saleType state when selectedOption is null (i.e., when the selection is cleared)
                                            }
                                        }}
                                        components={{ Option: DropdownOption }}
                                        // styles={customStyles1}
                                        styles={customStyles1(!Categoryselectdata)}
                                        isClearable
                                        placeholder="Search or select..."
                                    />

                                </div>
                            </div>

                            <div
                                className="d-flex align-items-center"
                                style={{ marginRight: "21px" }}
                            >
                                <div
                                    style={{
                                        marginLeft: '10px',
                                        width: "80px",
                                        display: "flex",
                                        justifyContent: "end",
                                    }}
                                >
                                    <label htmlFor="transactionType">
                                        <span style={{ fontSize: "15px", fontWeight: "bold" }}>
                                            Type :
                                        </span>
                                    </label>
                                </div>

                                <div style={{ marginLeft: '3px' }} >
                                    <Select

                                        className="List-select-class "
                                        ref={input3Ref}
                                        options={typeoptions}
                                        onKeyDown={(e) => handletypeKeypress(e, input4Ref)}
                                        id="selectedsale"
                                        onChange={(selectedOption) => {
                                            if (selectedOption && selectedOption.value) {
                                                setTypeselectdata(selectedOption.value);
                                            } else {
                                                setTypeselectdata(""); // Clear the saleType state when selectedOption is null (i.e., when the selection is cleared)
                                            }
                                        }}
                                        components={{ Option: DropdownOption }}
                                        // styles={customStyles1}
                                        styles={customStyles1(!Typeselectdata)}
                                        isClearable
                                        placeholder="Search or select..."
                                    />

                                </div>
                            </div>
                        </div>
                    </div>

                    {/* //////////////// THIRD ROW ///////////////////////// */}
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
                                        marginLeft: '10px',
                                        width: "80px",
                                        display: "flex",
                                        justifyContent: "end",
                                    }}
                                >
                                    <label htmlFor="transactionType">
                                        <span style={{ fontSize: "15px", fontWeight: "bold" }}>
                                            Status :
                                        </span>
                                    </label>
                                </div>



                                <select
                                    ref={input4Ref}
                                    onKeyDown={(e) => handleKeyPress(e, input5Ref)}
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
                                        width: "250px",
                                        height: "24px",
                                        marginLeft: "3px",
                                        backgroundColor: getcolor,
                                        border: `1px solid ${fontcolor}`,
                                        fontSize: "12px",
                                        color: fontcolor,
                                    }}
                                >
                                    <option value="">All</option>
                                    <option value="Active">Active</option>
                                    <option value="Non-Active">Non-Active</option>

                                </select>
                            </div>

                            <div id="lastDiv" style={{ marginRight: "1px" }}>
                                <label for="searchInput" style={{ marginRight: "3px" }}>
                                    <span style={{ fontSize: "15px", fontWeight: "bold" }}>
                                        Search :
                                    </span>{" "}
                                </label>
                                <input
                                    ref={input5Ref}
                                    onKeyDown={(e) => handleKeyPress(e, input6Ref)}
                                    type="text"
                                    id="searchsubmit"
                                    placeholder="Item description"
                                    value={searchQuery}
                                    style={{
                                        marginRight: "20px",
                                        width: "250px",
                                        height: "24px",
                                        fontSize: "12px",
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
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                />
                            </div>
                        </div>
                    </div>

                    {/* //////////////// TABLE HEADER SECTION ///////////////////////// */}
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
                                            color: 'white',
                                        }}
                                    >
                                        <td
                                            className="border-dark"
                                            style={firstColWidth}
                                            onClick={() => handleSorting("Code")}
                                        >
                                            Code{" "}
                                            <i className="fa-solid fa-caret-down caretIconStyle"></i>
                                        </td>
                                        <td
                                            className="border-dark"
                                            style={secondColWidth}
                                            onClick={() => handleSorting("Description")}
                                        >
                                            Description{" "}
                                            <i className="fa-solid fa-caret-down caretIconStyle"></i>
                                        </td>
                                        <td
                                            className="border-dark"
                                            style={thirdColWidth}
                                            onClick={() => handleSorting("Company")}
                                        >
                                            Company{" "}
                                            <i className="fa-solid fa-caret-down caretIconStyle"></i>
                                        </td>
                                        <td
                                            className="border-dark"
                                            style={forthColWidth}
                                            onClick={() => handleSorting("Category")}
                                        >
                                            Category{" "}
                                            <i className="fa-solid fa-caret-down caretIconStyle"></i>
                                        </td>
                                        <td
                                            className="border-dark"
                                            style={fifthColWidth}
                                            onClick={() => handleSorting("Capacity")}
                                        >
                                            Capacity{" "}
                                            <i className="fa-solid fa-caret-down caretIconStyle"></i>
                                        </td>
                                        <td
                                            className="border-dark"
                                            style={sixthColWidth}
                                            onClick={() => handleSorting("Type")}
                                        >
                                            Type{" "}
                                            <i className="fa-solid fa-caret-down caretIconStyle"></i>
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
                                maxHeight: "35vh",
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
                                                            {item.Code}
                                                        </td>
                                                        <td className="text-start" style={secondColWidth}>
                                                            {item.Description}
                                                        </td>
                                                        <td className="text-start" style={thirdColWidth}>
                                                            {item.Company}
                                                        </td>
                                                        <td className="text-start" style={forthColWidth}>
                                                            {item.Category}
                                                        </td>
                                                        <td className="text-start" style={fifthColWidth}>
                                                            {item.Capacity}
                                                        </td>
                                                        <td className="text-start" style={sixthColWidth}>
                                                            {item.Type}
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
                            width: '101.2%'
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
                                ...sixthColWidth,
                                background: getcolor,
                                borderRight: `1px solid ${fontcolor}`,
                            }}
                        >
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
                            ref={input6Ref}
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
