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
import "../../../vardana/vardana";
import "../../../vardana/verdana-bold";

export default function DailyCollectionSheet() {
  const navigate = useNavigate();
  const user = getUserData();
  const organisation = getOrganisationData();
  const yeardescription = getYearDescription();
  const locationnumber = getLocationnumber();
  const input3Ref = useRef(null);
  const YearRef = useRef(null);
  const MonthRef = useRef(null);
  const TypeRef = useRef(null);
  const SearchRef = useRef(null);

  const [totalBalance, settotalBalance] = useState(0);
    const [TotalCollection, setTotalCollection] = useState(0);

// All totals 01- 31 into a single array 

  const extractDayTotals = (data) => {
  const arr = [""]; // index 0 empty

  for (let i = 1; i <= 31; i++) {
    const key = `Total ${String(i).padStart(2, "0")}`;
    arr.push(data[key] || "0");
  }

  return arr;
};

  const [DayTotalArray, setDayTotalArray] = useState([]);

 
console.log('ALL TOTALS', DayTotalArray)

  const [sortData, setSortData] = useState("ASC");

  const [isAscendingcode, setisAscendingcode] = useState(true);
  const [isAscendingdec, setisAscendingdec] = useState(true);
  const [isAscendingsts, setisAscendingsts] = useState(true);

  const [searchQuery, setSearchQuery] = useState("");

const currentYear = new Date().getFullYear().toString();
const [transectionType, settransectionType] = useState(currentYear);
const years = Array.from({ length: 6 }, (_, i) => currentYear - i);


const months = [
  { label: "January", value: "1" },
  { label: "February", value: "2" },
  { label: "March", value: "3" },
  { label: "April", value: "4" },
  { label: "May", value: "5" },
  { label: "June", value: "6" },
  { label: "July", value: "7" },
  { label: "August", value: "8" },
  { label: "September", value: "9" },
  { label: "October", value: "10" },
  { label: "November", value: "11" },
  { label: "December", value: "12" },
];

const currentMonth = (new Date().getMonth() + 1).toString();
const orderedMonths = [
  ...months.filter((m) => m.value === currentMonth),
  ...months.filter((m) => m.value !== currentMonth),
];
const [transectionType2, settransectionType2] = useState(currentMonth);


console.log('YEAR', transectionType)
console.log('MONTHS', transectionType2)

  const [transectionType3, settransectionType3] = useState("");

   const [tableData, setTableData] = useState([]);
   console.log('tabledata',tableData)
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

  //   const handleKeyPress = (e, nextInputRef) => {
  //     if (e.key === "Enter") {
  //       e.preventDefault();
  //       if (nextInputRef.current) {
  //         nextInputRefs.current.focus();
  //       }
  //     }
  //   };

  function fetchReceivableReport() {
    const apiUrl = apiLinks + "/DailyCollectionSheet.php";
    setIsLoading(true);
    const formData = new URLSearchParams({
      code: organisation.code,
      FLocCod: locationnumber || getLocationNumber,

      FRepYer: transectionType,
      FRepMth: transectionType2,
      FRepTyp: transectionType3,
      FSchTxt:searchQuery,
  

        // code: 'MTSELEC',
        // FLocCod: '002',

    }).toString();

    axios
      .post(apiUrl, formData)
      .then((response) => {
        setIsLoading(false);

         settotalBalance(response.data["Balance"]);
         setTotalCollection(response.data["Collection"]);

          // 🔥 Extract 01–31 totals into single array
    const dayTotals = extractDayTotals(response.data);
    setDayTotalArray(dayTotals);

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
    if (!hasComponentMountedPreviously || (YearRef && YearRef.current)) {
      if (YearRef && YearRef.current) {
        setTimeout(() => {
          YearRef.current.focus();
          // YearRef.current.select();
        }, 0);
      }
      sessionStorage.setItem("componentMounted", "true");
    }
  }, []);

   const handleKeyPress = (e, nextInputRef) => {
    if (e.key === "Enter") {
      e.preventDefault();
      if (nextInputRef.current) {
        nextInputRef.current.focus();
      }
    }
  };

  
   const handleTransactionTypeChange3 = (event) => {
    const selectedTransactionType = event.target.value;
    settransectionType3(selectedTransactionType);
  };

  ///////////////////////////// DOWNLOAD PDF CODE ////////////////////////////////////////////////////////////
  const exportPDFHandler = () => {
    // Create a new jsPDF instance with landscape orientation
    const doc = new jsPDF({ orientation: "landscape" });

    // Define table data (rows)
    const rows = tableData.map((item) => [
      item.tinscod,
    item.Customer,
    item.Balance,
     item.Collection,
   // 🔥 Only first 5 days (01–05)
  ...Array.from({ length: 5 }, (_, i) => {
    const key = String(i + 1).padStart(2, "0");
    return item[key] || "0";
  }),
    ]);

    // Add summary row to the table
    rows.push([
   
   String(formatValue(tableData.length.toLocaleString())),
      "",
      String(formatValue(totalBalance)),
      String(formatValue(TotalCollection)),
 // 🔥 Only first 5 day totals
  ...Array.from({ length: 5 }, (_, i) => {
    const value = DayTotalArray[i + 1] || "0";
    return String(formatValue(value));
  }),
    ]);

    // Define table column headers and individual column widths
    const headers = [
  "Code",
  "Customer",
  "Balance",
  "Collection",

  // 🔥 Only first 5 days
  ...Array.from({ length: 5 }, (_, i) =>
    String(i + 1).padStart(2, "0")
  ),
];

    // const columnWidths = [24, 70, 25, 25, ...Array(5 - 4).fill(25)];

    const columnWidths = [24, 70, 25, 25, 25,25,25,25,25];

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

          if (cellIndex === 0 ) {
            const rightAlignX = startX + columnWidths[cellIndex] / 2;
            doc.text(cellValue, rightAlignX, cellY, {
              align: "center",
              baseline: "middle",
            });
          } else if (cellIndex > 1) {
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
        addTitle(`Daily Collection Sheet`, "", "", pageNumber, startY, 12); // Render sale report title with decreased font size, provide the time, and page number
        startY += -5;

        const labelsX = (doc.internal.pageSize.width - totalWidth) / 2;
        const labelsY = startY + 4; // Position the labels below the titles and above the table

          let typesearch = searchQuery || "";
    const yeardata= transectionType ? transectionType:'';
     const Monthdata= transectionType2 ? transectionType2:'';
         let Typedata =
       transectionType3 === "001" ? "MONTHLY" :
         transectionType3 === "002" ? "DAILY" :
         transectionType3 === "003" ? "WEEKLY" :
         "ALL";

        // Set font style, size, and family
                doc.setFont("verdana", "bold");
             doc.setFontSize(10);
                 doc.text(`Year :`, labelsX, labelsY + 8.5); // Draw bold label
          doc.setFont("verdana-regular", "normal");
             doc.setFontSize(10);
                 doc.text(`${yeardata}`, labelsX + 20, labelsY + 8.5); // Draw the value next to the label


                         doc.setFont("verdana", "bold");
             doc.setFontSize(10);
                 doc.text(`Months :`, labelsX +200, labelsY + 8.5); // Draw bold label
          doc.setFont("verdana-regular", "normal");
             doc.setFontSize(10);
                 doc.text(`${Monthdata}`, labelsX + 220, labelsY + 8.5); // Draw the value next to the label


                    doc.setFont("verdana", "bold");
             doc.setFontSize(10);
                 doc.text(`Type :`, labelsX, labelsY + 12.5); // Draw bold label
          doc.setFont("verdana-regular", "normal");
             doc.setFontSize(10);
                 doc.text(`${Typedata}`, labelsX + 20, labelsY + 12.5); // Draw the value next to the label

      
        if (searchQuery) {
          doc.setFont("verdana", "bold");
          doc.setFontSize(10);
          doc.text(`Search :`, labelsX + 200, labelsY + 12.5); // Draw bold label
          doc.setFont("verdana-regular", "normal");
          doc.setFontSize(10);
          doc.text(`${typesearch}`, labelsX + 220, labelsY + 12.5); // Draw the value next to the label
        }

        startY += 15; // Adjust vertical position for the labels

        addTableHeaders((doc.internal.pageSize.width - totalWidth) / 2, 34);
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
    doc.save(`DailyCollectionSheet As On ${date}.pdf`);
  };
  ///////////////////////////// DOWNLOAD PDF CODE ////////////////////////////////////////////////////////////

  ///////////////////////////// DOWNLOAD PDF EXCEL //////////////////////////////////////////////////////////

  const handleDownloadCSV = async () => {
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet("Sheet1");

    const numColumns = 35; // Ensure this matches the actual number of columns
    const columnAlignments = [
      "center",
      "left",
      ...Array(numColumns - 2).fill("right"),
          ];

    // Define fonts
    const fontCompanyName = { name: "CustomFont", size: 18, bold: true };
    const fontStoreList = { name: "CustomFont", size: 10, bold: false };
    const fontHeader = { name: "CustomFont", size: 10, bold: true };
    const fontTableContent = { name: "CustomFont", size: 10, bold: false };

    // Empty row
    worksheet.addRow([]);

    const getExcelColumnLetter = (col) => {
  let temp = "";
  while (col > 0) {
    let rem = (col - 1) % 26;
    temp = String.fromCharCode(65 + rem) + temp;
    col = Math.floor((col - 1) / 26);
  }
  return temp;
};

   const totalColumns = numColumns;

// =========================
// Company Name Row
// =========================
const companyRow = worksheet.addRow([comapnyname]);

companyRow.eachCell((cell) => {
  cell.font = fontCompanyName;
  cell.alignment = { horizontal: "center", vertical: "middle" };
});

worksheet.mergeCells(
  `A${companyRow.number}:${getExcelColumnLetter(totalColumns)}${companyRow.number}`
);

worksheet.getRow(companyRow.number).height = 30;



// =========================
// Title Row (Daily Collection Sheet)
// =========================
const storeListRow = worksheet.addRow(["Daily Collection Sheet"]);

storeListRow.eachCell((cell) => {
  cell.font = fontStoreList;
  cell.alignment = { horizontal: "center", vertical: "middle" };
});

worksheet.mergeCells(
  `A${storeListRow.number}:${getExcelColumnLetter(totalColumns)}${storeListRow.number}`
);

worksheet.getRow(storeListRow.number).height = 25;

    // Empty row
    worksheet.addRow([]);

    // Filter data
   
    let typesearch = searchQuery || "";
    const yeardata= transectionType ? transectionType:'';
     const Monthdata= transectionType2 ? transectionType2:'';
         let Typedata =
       transectionType3 === "001" ? "MONTHLY" :
         transectionType3 === "002" ? "DAILY" :
         transectionType3 === "003" ? "WEEKLY" :
         "ALL";

           // Apply styling for the status row
        const typeAndStoreRow2 = worksheet.addRow(
            ["Year :", yeardata, "", "", "", "", "Months :", Monthdata]
        );

        const typeAndStoreRow3 = worksheet.addRow(
            searchQuery
                ? ["Type :", Typedata, "", "", "", "", "Search :", typesearch]
                : ["Type :", Typedata, ]
        );

 typeAndStoreRow2.eachCell((cell, colIndex) => {
            cell.font = {
                name: "CustomFont" || "CustomFont",
                size: 10,
                bold: [1, 7].includes(colIndex),
            };
            cell.alignment = {
                horizontal: colIndex === 2 ? "left" : "left", // Left align the account name
                vertical: "middle"
            };
        });

        typeAndStoreRow3.eachCell((cell, colIndex) => {
            cell.font = {
                name: "CustomFont" || "CustomFont",
                size: 10,
                bold: [1,7].includes(colIndex),
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

    // Headers
    const headers = [
      "Code ",
  "Customer",
  "Balance",
  "Collection",
 
  ...days,
    ];
    const headerRow = worksheet.addRow(headers);
    headerRow.eachCell((cell) => Object.assign(cell, headerStyle));

    // ✅ Add data rows with alternating light grey background
    tableData.forEach((item, index) => {
      const row = worksheet.addRow([
    item.tinscod,
    item.Customer,
    item.Balance,
     item.Collection,
     // 🔥 Dynamic 01–31
    ...Array.from({ length: 31 }, (_, i) => {
      const key = String(i + 1).padStart(2, "0");
      return item[key] || "0";
    }),
  
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

   const customWidths = [11, 40, 12, 12]; // first 4 columns

const totalColumnss = 35;

customWidths.forEach((width, index) => {
  worksheet.getColumn(index + 1).width = width;
});

// 🔥 remaining columns = 12
for (let i = customWidths.length + 1; i <= totalColumnss; i++) {
  worksheet.getColumn(i).width = 12;
}

    const totalRow = worksheet.addRow([
      String(formatValue(tableData.length.toLocaleString())),
      "",
      String(formatValue(totalBalance)),
      String(formatValue(TotalCollection)),
        // 🔥 Dynamic 01–31 totals
  ...Array.from({ length: 31 }, (_, i) => {
    const value = DayTotalArray[i + 1] || "0";
    return String(formatValue(value));
  }), 
      
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
      if (colNumber === 1) {
        cell.alignment = { horizontal: "center" };
      }

      if (colNumber > 2) {
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
    saveAs(blob, `DailyCollectionSheet As On ${currentDate}.xlsx`);
  };

  ///////////////////////////// DOWNLOAD PDF EXCEL ///////////////////////////////////////////////////////////

  const dispatch = useDispatch();

  const tableTopColor = "#3368B5";
  const tableHeadColor = "#3368b5";
  const secondaryColor = "white";
  const btnColor = "#3368B5";
  const textColor = "white";

 
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
  "Inv Date": [],
  Code: [],
  Customer: [],
  Mobile: [],
  "Guaranter Name": [],
  "Grn Mob": [],
  "Witness Name": [],
  "Wit Mob": [],
  Item: [],
  Sts: [],
  "Sale Amt": [],
  Advance: [],
  "Ins Mth": [],
  "Ins Amt": [],
  Collection: [],
  "Last Date": [],
  "Last Amt": [],
  Balance: [],
  Receivable: [],
  Collector: [],
});

// State for column sorting order: 'asc', 'desc', or null
const [columnSortOrders, setColumnSortOrders] = useState({
  "Inv Date": null,
  Code: null,
  Customer: null,
  Mobile: null,
  "Guaranter Name": null,
  "Grn Mob": null,
  "Witness Name": null,
  "Wit Mob": null,
  Item: null,
  Sts: null,
  "Sale Amt": null,
  Advance: null,
  "Ins Mth": null,
  "Ins Amt": null,
  Collection: null,
  "Last Date": null,
  "Last Amt": null,
  Balance: null,
  Receivable: null,
  Collector: null,
});

// Reset sorting
const resetSorting = () => {
  setColumnSortOrders({
    "Inv Date": null,
    Code: null,
    Customer: null,
    Mobile: null,
    "Guaranter Name": null,
    "Grn Mob": null,
    "Witness Name": null,
    "Wit Mob": null,
    Item: null,
    Sts: null,
    "Sale Amt": null,
    Advance: null,
    "Ins Mth": null,
    "Ins Amt": null,
    Collection: null,
    "Last Date": null,
    "Last Amt": null,
    Balance: null,
    Receivable: null,
    Collector: null,
  });
};

// Update columns whenever tableData changes
useEffect(() => {
  if (tableData.length > 0) {
    const newColumns = {
      "Inv Date": tableData.map((row) => row["Inv Date"]),
      Code: tableData.map((row) => row.Code),
      Customer: tableData.map((row) => row.Customer),
      Mobile: tableData.map((row) => row.Mobile),
      "Guaranter Name": tableData.map((row) => row["Guaranter Name"]),
      "Grn Mob": tableData.map((row) => row["Grn Mob"]),
      "Witness Name": tableData.map((row) => row["Witness Name"]),
      "Wit Mob": tableData.map((row) => row["Wit Mob"]),
      Item: tableData.map((row) => row.Item),
      Sts: tableData.map((row) => row.Sts),
      "Sale Amt": tableData.map((row) => row["Sale Amt"]),
      Advance: tableData.map((row) => row.Advance),
      "Ins Mth": tableData.map((row) => row["Ins Mth"]),
      "Ins Amt": tableData.map((row) => row["Ins Amt"]),
      Collection: tableData.map((row) => row.Collection),
      "Last Date": tableData.map((row) => row["Last Date"]),
      "Last Amt": tableData.map((row) => row["Last Amt"]),
      Balance: tableData.map((row) => row.Balance),
      Receivable: tableData.map((row) => row.Receivable),
      Collector: tableData.map((row) => row.Collector),
    };
    setColumns(newColumns);
  } else {
    // Clear columns if no data
    setColumns({
      "Inv Date": [],
      Code: [],
      Customer: [],
      Mobile: [],
      "Guaranter Name": [],
      "Grn Mob": [],
      "Witness Name": [],
      "Wit Mob": [],
      Item: [],
      Sts: [],
      "Sale Amt": [],
      Advance: [],
      "Ins Mth": [],
      "Ins Amt": [],
      Collection: [],
      "Last Date": [],
      "Last Amt": [],
      Balance: [],
      Receivable: [],
      Collector: [],
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

  const firstColWidth = { width: isSidebarVisible ? "80px" : "80px" };
  const secondColWidth = { width: isSidebarVisible ? "200px" : "360px"};
  const thirdColWidth = { width: isSidebarVisible ? "90px" : "90px" };
  const forthColWidth = { width: isSidebarVisible ? "90px" : "90px"};
  const fifthColWidth = { width: isSidebarVisible ? "90px" : "90px" };


   

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
  const totalRows = 20; // fixed number of rows
  
   const colWidths = [
    firstColWidth.width,
    secondColWidth.width,
    thirdColWidth.width,
    forthColWidth.width,
    fifthColWidth.width,
  ];


  const days = Array.from({ length: 31 }, (_, i) =>
  String(i + 1).padStart(2, "0")
);

const totalColumns = 4 + 31; // 20 fixed + 31 days


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
          <NavComponent textdata="Daily Collection Sheet" />

 {/* FIRST ROW */}
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
                      Year :
                    </span>
                  </label>
                </div>

                <div style={{ position: "relative", display: "inline-block" }}>
                 <select
  ref={YearRef}
  onKeyDown={(e) => handleKeyPress(e, TypeRef)}
  id="submitButton"
  name="type"
  onFocus={(e) =>
    (e.currentTarget.style.border = "4px solid red")
  }
  onBlur={(e) =>
    (e.currentTarget.style.border = `1px solid ${fontcolor}`)
  }
  value={transectionType}
  onChange={(e) => settransectionType(e.target.value)}
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
  {years.map((year) => (
    <option key={year} value={year}>
      {year}
    </option>
  ))}
</select>

                  {transectionType !== currentYear && (
                    <span
                      onClick={() => settransectionType(currentYear)}
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
                style={{ marginRight: "25px" }}
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
                      Months :
                    </span>
                  </label>
                </div>

                <div style={{ position: "relative", display: "inline-block" }}>
           <select
  ref={MonthRef}
  onKeyDown={(e) => handleKeyPress(e, SearchRef)}
  value={transectionType2}
  onChange={(e) => settransectionType2(e.target.value)}
  style={{
    width: "200px",
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
  {orderedMonths.map((month) => (
    <option key={month.value} value={month.value}>
      {month.label}
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
            </div>
          </div>

          {/* SECOND ROW  */}

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
                      Type :
                    </span>
                  </label>
                </div>

                <div style={{ position: "relative", display: "inline-block" }}>
                  <select
                    ref={TypeRef}
                    onKeyDown={(e) => handleKeyPress(e, MonthRef)}
                    id="submitButton"
                    name="type"
                    onFocus={(e) =>
                      (e.currentTarget.style.border = "4px solid red")
                    }
                    onBlur={(e) =>
                      (e.currentTarget.style.border = `1px solid ${fontcolor}`)
                    }
                    value={transectionType3}
                    onChange={handleTransactionTypeChange3}
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
                  <option value="">ALL</option>
                    <option value="001">MONTHLY</option>
                    <option value="002">DAILY</option>
                    <option value="003">WEEKLY</option>
                  </select>

                  {transectionType3 !== "" && (
                    <span
                      onClick={() => settransectionType3("")}
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
                    ref={SearchRef}
                    onKeyDown={(e) => handleKeyPress(e, input3Ref)}
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
              </div>
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
      style={{ ...secondColWidth, cursor: "pointer" }}
      // onClick={() => handleSorting("tinscod")}
    >
      Code{" "}
      {/* <i
        className="fa-solid fa-caret-down caretIconStyle"
        style={getIconStyle("tinscod")}
      ></i> */}
    </th>

     <th
      className="border-dark"
      style={{ ...firstColWidth, cursor: "pointer" }}
      // onClick={() => handleSorting("Customer")}
    >
      Customer{" "}
      {/* <i
        className="fa-solid fa-caret-down caretIconStyle"
        style={getIconStyle("Customer")}
      ></i> */}
    </th>

    <th
      className="border-dark"
      style={{ ...thirdColWidth, cursor: "pointer" }}
      // onClick={() => handleSorting("Balance")}
    >
      Balance{" "}
      {/* <i
        className="fa-solid fa-caret-down caretIconStyle"
        style={getIconStyle("Balance")}
      ></i> */}
    </th>

    <th
      className="border-dark"
      style={{ ...forthColWidth, cursor: "pointer" }}
      // onClick={() => handleSorting("Collection")}
    >
      Collection{" "}
      {/* <i
        className="fa-solid fa-caret-down caretIconStyle"
        style={getIconStyle("Collection")}
      ></i> */}
    </th>

     {/* 🔥 Dynamic Days Headers */}
  {days.map((day) => (
    <th
      key={day}
      className="border-dark"
       style={{ ...fifthColWidth, cursor: "pointer" }}
      // onClick={() => handleSorting(day)}
    >
      {day}{" "}
      {/* <i
        className="fa-solid fa-caret-down caretIconStyle"
        style={getIconStyle(day)}
      ></i> */}
    </th>
  ))}


  </tr>
</thead>

              {/* Table Body */}
             <tbody>
  {isLoading ? (
    <>
      <tr style={{ backgroundColor: getcolor }}>
        <td colSpan={totalColumns} className="text-center">
          <Spinner animation="border" variant="primary" />
        </td>
      </tr>

      {Array.from({ length: totalRows - 5 }).map((_, rowIndex) => (
        <tr
          key={`blank-${rowIndex}`}
          style={{ backgroundColor: getcolor, color: fontcolor }}
        >
          {Array.from({ length: totalColumns }).map((_, colIndex) => (
            <td key={`blank-${rowIndex}-${colIndex}`}>&nbsp;</td>
          ))}
        </tr>
      ))}
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
          {/* ✅ Fixed Columns (same as tumhara code) */}
          <td className="text-center" style={secondColWidth}>
            {item.tinscod}
          </td>

          <td className="text-start" style={firstColWidth}>
            {item.Customer}
          </td>

          <td className="text-end" style={thirdColWidth}>
            {item.Balance}
          </td>
          <td className="text-end" style={forthColWidth}>
            {item.Collection}
          </td>
                   

          {/* 🔥 Fixed 31 Days */}
         {Array.from({ length: 31 }, (_, i) => {
  const key = String(i + 1).padStart(2, "0");

  return (
    <td key={key} className="text-end" style={fifthColWidth}>
      {item[key] || "0"}
    </td>
  );
})}
        </tr>
      ))}

      {/* ✅ Blank rows */}
      {Array.from({
        length: Math.max(0, totalRows - tableData.length),
      }).map((_, rowIndex) => (
        <tr
          key={`blank-${rowIndex}`}
          style={{ backgroundColor: getcolor, color: fontcolor }}
        >
          {Array.from({ length: totalColumns }).map((_, colIndex) => (
            <td key={`blank-${rowIndex}-${colIndex}`}>&nbsp;</td>
          ))}
        </tr>
      ))}
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
               <tr>
  {/* Total Rows */}
  <td>{tableData.length.toLocaleString()}</td>

  {/* Empty column */}
  <td></td>

  {/* Balance */}
  <td>
    <span className="mobileledger_total">
      {totalBalance}
    </span>
  </td>

  {/* Collection */}
  <td>
    <span className="mobileledger_total">
      {TotalCollection}
    </span>
  </td>

  {/* Empty fixed columns (remaining before days start)
  {Array.from({ length:  }).map((_, i) => (
    <td key={`empty-${i}`}></td>
  ))} */}

  {/* 🔥 Dynamic 01–31 totals */}
  {Array.from({ length: 31 }, (_, i) => (
    <td key={i + 1} className="text-end">
      <span className="mobileledger_total">
        {DayTotalArray[i + 1] || "0"}
      </span>
    </td>
  ))}
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