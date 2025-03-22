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
// import { fetchGetUser } from "../../Redux/action";
import { fetchGetUser } from "../../../Redux/action";
import { useHotkeys } from "react-hotkeys-hook";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function ReferenceMonthlyJobStatusReport() {
    const navigate = useNavigate();
    const user = getUserData();
    const organisation = getOrganisationData();

    const saleSelectRef = useRef(null);

    const input3Ref = useRef(null);

    const input1Ref = useRef(null);
    const input1Reftype = useRef(null);
    const [transectionType2, settransectionType2] = useState("");
    console.log('transectionType2', transectionType2)

    const [supplierList, setSupplierList] = useState([]);


    const [Totaljan, setTotaljan] = useState(0);
    const [Totalfeb, setTotalfeb] = useState(0);
    const [Totalmarch, setTotalmarch] = useState(0);
    const [Totalapr, setTotalapr] = useState(0);
    const [Totalmay, setTotalmay] = useState(0);
    const [Totaljune, setTotaljune] = useState(0);
    const [Totaljuly, setTotaljuly] = useState(0);
    const [Totalaug, setTotalaug] = useState(0);
    const [Totalsep, setTotalsep] = useState(0);
    const [Totaloct, setTotaloct] = useState(0);
    const [Totalnov, setTotalnov] = useState(0);
    const [Totaldec, setTotaldec] = useState(0);
    const [Total, setTotal] = useState(0);


    // state for from DatePicker
    const [selectedfromDate, setSelectedfromDate] = useState(null);
    const [fromInputDate, setfromInputDate] = useState("");
    const [fromCalendarOpen, setfromCalendarOpen] = useState(false);
    // state for To DatePicker
    const [selectedToDate, setSelectedToDate] = useState(null);
    const [toInputDate, settoInputDate] = useState("");
    const [toCalendarOpen, settoCalendarOpen] = useState(false);

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
        getdatafontsize,
        getfontstyle
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


    function fetchReceivableReport() {

        const apiUrl = apiLinks + "/ReferenceMonthlyJobStatus.php";
        setIsLoading(true);
        const formData = new URLSearchParams({

            code: organisation.code,
            FLocCod: locationnumber || getLocationNumber,
            // FRepYer: yeardescription || getyeardescription,
            FRepYer: transectionType2

        }).toString();

        axios
            .post(apiUrl, formData)
            .then((response) => {
                setIsLoading(false);

                setTotaljan(response.data["TotalJan "]);
                setTotalfeb(response.data["TotalFeb "]);
                setTotalmarch(response.data["TotalMar "]);
                setTotalapr(response.data["TotalApr "]);
                setTotalmay(response.data["TotalMay "]);
                setTotaljune(response.data["TotalJun "]);
                setTotaljuly(response.data["TotalJul "]);
                setTotalaug(response.data["TotalAug "]);
                setTotalsep(response.data["TotalSep "]);
                setTotaloct(response.data["TotalOct "]);
                setTotalnov(response.data["TotalNov "]);
                setTotaldec(response.data["TotalDec "]);
                setTotal(response.data["TotalJobs "]);

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
        if (!hasComponentMountedPreviously || (input1Reftype && input1Reftype.current)) {
            if (input1Reftype && input1Reftype.current) {
                setTimeout(() => {
                    input1Reftype.current.focus();
                    // input1Reftype.current.select();
                }, 0);
            }
            sessionStorage.setItem("componentMounted", "true");
        }
    }, []);


    const handleTransactionTypeChange2 = (event) => {
        const selectedTransactionType2 = event.target.value;
        settransectionType2(selectedTransactionType2);
    };


    const handleKeyPress = (e, nextInputRef) => {
        if (e.key === "Enter") {
            e.preventDefault();
            if (nextInputRef.current) {
                nextInputRef.current.focus();
            }
        }
    };

    useEffect(() => {
        const apiUrl = apiLinks + "/GetJobDataYear.php";
        const formData = new URLSearchParams({
            FLocCod: locationnumber || getLocationNumber,
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

    ///////////////////////////// DOWNLOAD PDF CODE ////////////////////////////////////////////////////////////
    const exportPDFHandler = () => {

        const globalfontsize = 12;
        console.log('gobal font data', globalfontsize)

        // Create a new jsPDF instance with landscape orientation
        const doc = new jsPDF({ orientation: "landscape" });

        // Define table data (rows)
        const rows = tableData.map((item) => [
            item.trefcod,
            item.Reference,
            item.Jan,
            item.Feb,
            item.Mar,
            item.Apr,
            item.May,
            item.Jun,
            item.Jul,
            item.Aug,
            item.Sep,
            item.Oct,
            item.Nov,
            item.Dec,
            item.Total,
        ]);

        // Add summary row to the table

        rows.push([
            "",
            "",
            String(Totaljan),
            String(Totalfeb),
            String(Totalmarch),
            String(Totalapr),
            String(Totalmay),
            String(Totaljune),
            String(Totaljuly),
            String(Totalaug),
            String(Totalsep),
            String(Totaloct),
            String(Totalnov),
            String(Totaldec),
            String(Total),

        ]);

        // Define table column headers and individual column widths
        const headers = [

            "Code",
            "Reference",
            "Jan",
            "Feb",
            "Mar",
            "Apr",
            "May",
            "Jun",
            "Jul",
            "Aug",
            "Sep",
            "Oct",
            "Nov",
            "Dec",
            "Total",

        ];
        const columnWidths = [15, 50, 16, 16, 16, 16, 16, 16, 16, 16, 16, 16, 16, 16, 16];

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

                    if (cellIndex === 2 || cellIndex === 3 || cellIndex === 4 || cellIndex === 5 || cellIndex === 6 || cellIndex === 7 || cellIndex === 8 || cellIndex === 9 || cellIndex === 10 || cellIndex === 11 || cellIndex === 12 || cellIndex === 13 || cellIndex === 14) {
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
                    rightX - 1,
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

                addTitle(`Reference Monthly Job Status Report`, "", "", pageNumber, startY, 12); // Render sale report title with decreased font size, provide the time, and page number
                startY += -5;

                const labelsX = (doc.internal.pageSize.width - totalWidth) / 2;
                const labelsY = startY + 4; // Position the labels below the titles and above the table


                // // Reset font weight to normal if necessary for subsequent text
                doc.setFont(getfontstyle, 'bold'); // Set font to bold
                doc.setFontSize(10);


                let search1 = transectionType2 ? transectionType2 : "";

                doc.setFont(getfontstyle, "300"); // Font family and style ('normal', 'bold', 'italic', etc.)
                doc.setFontSize(10); // Font size


                doc.setFont(getfontstyle, 'bold'); // Set font to bold
                doc.text(`Year :`, labelsX, labelsY + 8.5); // Draw bold label
                doc.setFont(getfontstyle, 'normal'); // Reset font to normal
                doc.text(`${search1}`, labelsX + 12, labelsY + 8.5); // Draw the value next to the label


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
            const day = String(today.getDate()).padStart(2, "0");
            const month = String(today.getMonth() + 1).padStart(2, "0");
            const year = today.getFullYear();
            return `${day}-${month}-${year}`;
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
        doc.save(`ReferenceMonthlyJobStatusReport As on ${date}.pdf`);


    };
    ///////////////////////////// DOWNLOAD PDF CODE ////////////////////////////////////////////////////////////


    ///////////////////////////// DOWNLOAD PDF EXCEL //////////////////////////////////////////////////////////
    const handleDownloadCSV = async () => {
        const workbook = new ExcelJS.Workbook();
        const worksheet = workbook.addWorksheet("Sheet1");

        const numColumns = 10; // Ensure this matches the actual number of columns

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
            "right",
            "right",
            "right",
            "right",
            "right",
        ];

        // Define fonts for different sections
        const fontCompanyName = { name: 'CustomFont' || "CustomFont", size: 18, bold: true };
        const fontStoreList = { name: 'CustomFont' || "CustomFont", size: 10, bold: false };
        const fontHeader = { name: 'CustomFont' || "CustomFont", size: 10, bold: true };
        const fontTableContent = { name: 'CustomFont' || "CustomFont", size: 10, bold: false };

        // Add an empty row at the start
        worksheet.addRow([]);

        // Add company name
        const companyRow = worksheet.addRow([comapnyname]);
        companyRow.eachCell((cell) => {
            cell.font = fontCompanyName;
            cell.alignment = { horizontal: "center" };
        });

        worksheet.getRow(companyRow.number).height = 30;
        worksheet.mergeCells(`A${companyRow.number}:${String.fromCharCode(70 + numColumns - 1)}${companyRow.number}`);

        // Add Store List row
        const storeListRow = worksheet.addRow([`Reference Monthly Job Status Report `]);
        storeListRow.eachCell((cell) => {
            cell.font = fontStoreList;
            cell.alignment = { horizontal: "center" };
        });

        worksheet.mergeCells(`A${storeListRow.number}:${String.fromCharCode(70 + numColumns - 1)}${storeListRow.number}`);

        // Add an empty row after the title section
        worksheet.addRow([]);

        let search1 = transectionType2 ? transectionType2 : "";


        const typeAndStoreRow = worksheet.addRow([
                   "Year :",
                   search1,
                   "",
                   "",
                   "",
                   "",
                
               ]);
       
         typeAndStoreRow.eachCell((cell, colIndex) => {
                   cell.font = { name: 'CustomFont' || "CustomFont", size: 10, bold: [1].includes(colIndex) };
                   cell.alignment = { horizontal: "left", vertical: "middle" };
               });


        // Header style
        const headerStyle = {
            font: fontHeader,
            alignment: { horizontal: "center", vertical: "middle" },
            fill: { type: "pattern", pattern: "solid", fgColor: { argb: "FFC6D9F7" } },
            border: { top: { style: "thin" }, left: { style: "thin" }, bottom: { style: "thin" }, right: { style: "thin" } },
        };

        // Add headers
        const headers = [
            "Code",
            "Reference",
            "Jan",
            "Feb",
            "Mar",
            "Apr",
            "May",
            "Jun",
            "Jul",
            "Aug",
            "Sep",
            "Oct",
            "Nov",
            "Dec",
            "Total",
        ];
        const headerRow = worksheet.addRow(headers);
        headerRow.eachCell((cell) => Object.assign(cell, headerStyle));

        // Add data rows
        tableData.forEach((item) => {
            const row = worksheet.addRow([
                item.trefcod,
                item.Reference,
                item.Jan,
                item.Feb,
                item.Mar,
                item.Apr,
                item.May,
                item.Jun,
                item.Jul,
                item.Aug,
                item.Sep,
                item.Oct,
                item.Nov,
                item.Dec,
                item.Total,

            ]);

            row.eachCell((cell, colIndex) => {
                cell.font = fontTableContent;
                cell.border = { top: { style: "thin" }, left: { style: "thin" }, bottom: { style: "thin" }, right: { style: "thin" } };
                cell.alignment = { horizontal: columnAlignments[colIndex - 1] || "left", vertical: "middle" };
            });
        });

        // Set column widths
        [8, 30, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9].forEach((width, index) => {
            worksheet.getColumn(index + 1).width = width;
        });

        const totalRow = worksheet.addRow([
            "",
            "",
            String(Totaljan),
            String(Totalfeb),
            String(Totalmarch),
            String(Totalapr),
            String(Totalmay),
            String(Totaljune),
            String(Totaljuly),
            String(Totalaug),
            String(Totalsep),
            String(Totaloct),
            String(Totalnov),
            String(Totaldec),
            String(Total),
        ]);

        // total row added

        totalRow.eachCell((cell, colNumber) => {
            cell.font = { name: 'CustomFont', size: 10, bold: true }; // Apply CustomFont
            cell.border = {
                top: { style: "thin" },
                left: { style: "thin" },
                bottom: { style: "thin" },
                right: { style: "thin" },
            };

            // Align only the "Total" text to the right
            if (

                colNumber === 3 || colNumber === 4 || colNumber === 5 || colNumber === 6 || colNumber === 7 || colNumber === 8 || colNumber === 9 || colNumber === 10 || colNumber === 11 || colNumber === 12 || colNumber === 13 || colNumber === 14 || colNumber === 15
            ) {
                cell.alignment = { horizontal: "right" };
            }
        });


        // Get current date
        const getCurrentDate = () => {
            const today = new Date();
            const day = String(today.getDate()).padStart(2, "0");
            const month = String(today.getMonth() + 1).padStart(2, "0");
            const year = today.getFullYear();
            return `${day}-${month}-${year}`;
        };

        const currentdate = getCurrentDate();

        // Generate and save the Excel file
        const buffer = await workbook.xlsx.writeBuffer();
        const blob = new Blob([buffer], { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" });
        saveAs(blob, `ReferenceMonthlyJobStatusReport As on ${currentdate}.xlsx`);
    };
    ///////////////////////////// DOWNLOAD PDF EXCEL ///////////////////////////////////////////////////////////



    const tableTopColor = "#3368B5";
    const tableHeadColor = "#3368b5";
    const secondaryColor = "white";
    const btnColor = "#3368B5";
    const textColor = "white";

    const [tableData, setTableData] = useState([]);
    console.log('installment sale reports data', tableData)
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
        width: "6%",
    };
    const secondColWidth = {
        width: "14%",
    };
    const thirdColWidth = {
        width: "6%",
    };
    const forthColWidth = {
        width: "6%",
    };
    const fifthColWidth = {
        width: "6%",
    };
    const sixthColWidth = {
        width: "6%",
    };
    const seventhColWidth = {
        width: "6%",
    };
    const eighthColWidth = {
        width: "6%",
    };
    const ninhthColWidth = {
        width: "6%",
    };
    const tenthColWidth = {
        width: "6%",
    };
    const elawentheColWidth = {
        width: "6%",
    };
    const tweltheColWidth = {
        width: "6%",
    };
    const thirteenColWidth = {
        width: "6%",
    };
    const fourteenColWidth = {
        width: "6%",
    };

    const fifteenColWidth = {
        width: "6.7%",
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
        width: isSidebarVisible ? "calc(85vw - 0%)" : "85vw",
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


    useEffect(() => {
        if (supplierList.length > 0) {
            settransectionType2(supplierList[0].year);  // Set first item as default
        }
    }, [supplierList]);



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
                    <NavComponent textdata="Reference Monthly Job Status Report" />

                    {/* CODE FOR CODE SELECT */}

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
                                        width: "75px",
                                        display: "flex",
                                        justifyContent: "end",
                                    }}
                                >
                                    <label htmlFor="transactionType">
                                        <span style={{ fontFamily: getfontstyle, fontSize: getdatafontsize, fontWeight: "bold" }}>
                                            Year :
                                        </span>
                                    </label>
                                </div>



                                <select
                                    ref={input1Reftype}
                                    onKeyDown={(e) => handleKeyPress(e, input3Ref)}
                                    id="firsttype"
                                    name="type"
                                    onFocus={(e) =>
                                        (e.currentTarget.style.border = "4px solid red")
                                    }
                                    onBlur={(e) =>
                                        (e.currentTarget.style.border = `1px solid ${fontcolor}`)
                                    }
                                    value={transectionType2 || ""}
                                    onChange={handleTransactionTypeChange2}
                                    style={{
                                        width: "150px",
                                        height: "24px",
                                        marginLeft: "5px",
                                        backgroundColor: getcolor,
                                        border: `1px solid ${fontcolor}`,
                                        fontFamily: getfontstyle, fontSize: getdatafontsize,
                                        color: fontcolor,
                                    }}
                                >
                                    {supplierList.map((item, index) => (
                                        <option key={index} value={item.year}>
                                            {item.year}
                                        </option>
                                    ))}


                                </select>
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
                                    fontFamily: getfontstyle, fontSize: getdatafontsize,
                                    width: "100%",
                                    position: "relative",
                                    paddingRight: "2%",
                                }}
                            >
                                <thead
                                    style={{
                                        fontFamily: getfontstyle, fontSize: getdatafontsize,
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
                                            Reference
                                        </td>
                                        <td className="border-dark" style={thirdColWidth}>
                                            Jan
                                        </td>
                                        <td className="border-dark" style={forthColWidth}>
                                            Feb
                                        </td>
                                        <td className="border-dark" style={fifthColWidth}>
                                            Mar
                                        </td>
                                        <td className="border-dark" style={sixthColWidth}>
                                            Apr
                                        </td>
                                        <td className="border-dark" style={seventhColWidth}>
                                            May
                                        </td>
                                        <td className="border-dark" style={eighthColWidth}>
                                            Jun
                                        </td>
                                        <td className="border-dark" style={ninhthColWidth}>
                                            Jul
                                        </td>
                                        <td className="border-dark" style={tenthColWidth}>
                                            Aug
                                        </td>
                                        <td className="border-dark" style={elawentheColWidth}>
                                            Sep
                                        </td>
                                        <td className="border-dark" style={tweltheColWidth}>
                                            Oct
                                        </td>
                                        <td className="border-dark" style={thirdColWidth}>
                                            Nov
                                        </td>
                                        <td className="border-dark" style={fourteenColWidth}>
                                            Dec
                                        </td>
                                        <td className="border-dark" style={fifteenColWidth}>
                                            Total
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
                                    fontFamily: getfontstyle, fontSize: getdatafontsize,
                                    width: "100%",
                                    position: "relative",
                                    ...(tableData.length > 0 ? { tableLayout: "fixed" } : {})
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
                                                <td colSpan="15" className="text-center">
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
                                                        {Array.from({ length: 15 }).map((_, colIndex) => (
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
                                                <td style={ninhthColWidth}></td>
                                                <td style={tenthColWidth}></td>
                                                <td style={elawentheColWidth}></td>
                                                <td style={tweltheColWidth}></td>
                                                <td style={thirteenColWidth}></td>
                                                <td style={fourteenColWidth}></td>
                                                <td style={fifteenColWidth}></td>

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
                                                            {item.trefcod}
                                                        </td>
                                                        <td className="text-start"
                                                            title={item.Reference}
                                                            style={{
                                                                ...secondColWidth,
                                                                whiteSpace: "nowrap",
                                                                overflow: "hidden",
                                                                textOverflow: "ellipsis",
                                                            }}
                                                        >
                                                            {item.Reference}
                                                        </td>

                                                        <td className="text-end"
                                                            title={item.Jan}
                                                            style={{
                                                                ...thirdColWidth,
                                                                whiteSpace: "nowrap",
                                                                overflow: "hidden",
                                                                textOverflow: "ellipsis",
                                                            }}
                                                        >
                                                            {item.Jan}
                                                        </td>
                                                        <td className="text-end" style={forthColWidth}>
                                                            {item.Feb}
                                                        </td>
                                                        <td className="text-end"
                                                            title={item.Mar}
                                                            style={{
                                                                ...fifthColWidth,
                                                                whiteSpace: "nowrap",
                                                                overflow: "hidden",
                                                                textOverflow: "ellipsis",
                                                            }}
                                                        >
                                                            {item.Mar}
                                                        </td>
                                                        <td className="text-end"
                                                            title={item.Apr}
                                                            style={{
                                                                ...sixthColWidth,
                                                                whiteSpace: "nowrap",
                                                                overflow: "hidden",
                                                                textOverflow: "ellipsis",
                                                            }}
                                                        >
                                                            {item.Apr}
                                                        </td>
                                                        <td className="text-end"
                                                            title={item.May}
                                                            style={{
                                                                ...seventhColWidth,
                                                                whiteSpace: "nowrap",
                                                                overflow: "hidden",
                                                                textOverflow: "ellipsis",
                                                            }}
                                                        >
                                                            {item.May}
                                                        </td>
                                                        <td className="text-end"
                                                            title={item.Jun}
                                                            style={{
                                                                ...eighthColWidth,
                                                                whiteSpace: "nowrap",
                                                                overflow: "hidden",
                                                                textOverflow: "ellipsis",
                                                            }}
                                                        >
                                                            {item.Jun}
                                                        </td>
                                                        <td className="text-end" style={ninhthColWidth}>
                                                            {item.Jul}
                                                        </td>
                                                        <td className="text-end" style={tenthColWidth}>
                                                            {item.Aug}
                                                        </td>
                                                        <td className="text-end" style={elawentheColWidth}>
                                                            {item.Sep}
                                                        </td>

                                                        <td className="text-end" style={tweltheColWidth}>
                                                            {item.Oct}
                                                        </td>
                                                        <td className="text-end" style={thirteenColWidth}>
                                                            {item.Nov}
                                                        </td>
                                                        <td className="text-end" style={fourteenColWidth}>
                                                            {item.Dec}
                                                        </td>
                                                        <td className="text-end" style={fifteenColWidth}>
                                                            {item.Total}
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
                                                    {Array.from({ length: 15 }).map((_, colIndex) => (
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
                                                <td style={ninhthColWidth}></td>
                                                <td style={tenthColWidth}></td>
                                                <td style={elawentheColWidth}></td>
                                                <td style={tweltheColWidth}></td>
                                                <td style={thirteenColWidth}></td>
                                                <td style={fourteenColWidth}></td>
                                                <td style={fifteenColWidth}></td>


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
                        >

                        </div>
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
                            <span className="mobileledger_total" style={{ textAlign: 'left' }}>{Totaljan}</span>

                        </div>
                        <div
                            style={{
                                ...forthColWidth,
                                background: getcolor,
                                borderRight: `1px solid ${fontcolor}`,
                            }}
                        >
                            <span className="mobileledger_total" style={{ textAlign: 'left' }}>{Totalfeb}</span>

                        </div>
                        <div
                            style={{
                                ...fifthColWidth,
                                background: getcolor,
                                borderRight: `1px solid ${fontcolor}`,
                            }}
                        >
                            <span className="mobileledger_total" style={{ textAlign: 'left' }}>{Totalmarch}</span>

                        </div>
                        <div
                            style={{
                                ...sixthColWidth,
                                background: getcolor,
                                borderRight: `1px solid ${fontcolor}`,
                            }}
                        >
                            <span className="mobileledger_total" style={{ textAlign: 'left' }}>{Totalapr}</span>

                        </div>
                        <div
                            style={{
                                ...seventhColWidth,
                                background: getcolor,
                                borderRight: `1px solid ${fontcolor}`,
                            }}
                        >
                            <span className="mobileledger_total" style={{ textAlign: 'left' }}>{Totalmay}</span>

                        </div>
                        <div
                            style={{
                                ...eighthColWidth,
                                background: getcolor,
                                borderRight: `1px solid ${fontcolor}`,
                            }}
                        >
                            <span className="mobileledger_total" style={{ textAlign: 'left' }}>{Totaljune}</span>

                        </div>
                        <div
                            style={{
                                ...ninhthColWidth,
                                background: getcolor,
                                borderRight: `1px solid ${fontcolor}`,
                            }}
                        >
                            <span className="mobileledger_total" style={{ textAlign: 'left' }}>{Totaljuly}</span>

                        </div>
                        <div
                            style={{
                                ...tenthColWidth,
                                background: getcolor,
                                borderRight: `1px solid ${fontcolor}`,
                            }}
                        >
                            <span className="mobileledger_total" style={{ textAlign: 'left' }}>{Totalaug}</span>

                        </div>
                        <div
                            style={{
                                ...elawentheColWidth,
                                background: getcolor,
                                borderRight: `1px solid ${fontcolor}`,
                            }}
                        >
                            <span className="mobileledger_total" style={{ textAlign: 'left' }}>{Totalsep}</span>

                        </div>

                        <div
                            style={{
                                ...tweltheColWidth,
                                background: getcolor,
                                borderRight: `1px solid ${fontcolor}`,
                            }}
                        >
                            <span className="mobileledger_total" style={{ textAlign: 'left' }}>{Totalaug}</span>

                        </div>

                        <div
                            style={{
                                ...thirteenColWidth,
                                background: getcolor,
                                borderRight: `1px solid ${fontcolor}`,
                            }}
                        >
                            <span className="mobileledger_total" style={{ textAlign: 'left' }}>{Totalnov}</span>

                        </div>

                        <div
                            style={{
                                ...fourteenColWidth,
                                background: getcolor,
                                borderRight: `1px solid ${fontcolor}`,
                            }}
                        >
                            <span className="mobileledger_total" style={{ textAlign: 'left' }}>{Totaldec}</span>

                        </div>

                        <div
                            style={{
                                ...fifteenColWidth,
                                background: getcolor,
                                borderRight: `1px solid ${fontcolor}`,
                            }}
                        >
                            <span className="mobileledger_total" style={{ textAlign: 'left' }}>{Total}</span>

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
                            ref={input3Ref}
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
