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
import "react-datepicker/dist/react-datepicker.css";
import jsPDF from "jspdf";
import ExcelJS from "exceljs";
import { saveAs } from "file-saver";
import "react-calendar/dist/Calendar.css";
import Select from "react-select";
import { BsCalendar } from "react-icons/bs";
import DatePicker from "react-datepicker";
import { useSelector, useDispatch } from "react-redux";
import { fetchGetUser } from "../../../Redux/action";
import { useHotkeys } from "react-hotkeys-hook";
import "react-toastify/dist/ReactToastify.css";
import { components } from "react-select";
import { ToastContainer, toast } from "react-toastify";
import "../../../vardana/vardana.js";
import "../../../vardana/verdana-bold.js";
import { forceReRender } from "@storybook/react";
import { Balance } from "@mui/icons-material";

export default function CustomerSearch() {
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

  //   const handleKeyPress = (e, nextInputRef) => {
  //     if (e.key === "Enter") {
  //       e.preventDefault();
  //       if (nextInputRef.current) {
  //         nextInputRefs.current.focus();
  //       }
  //     }
  //   };

  function fetchReceivableReport() {
    const apiUrl = apiLinks + "/CustomerSearch.php";
    setIsLoading(true);
    const formData = new URLSearchParams({
      code: organisation.code,
      FLocCod: locationnumber || getLocationNumber,
      FYerDsc: yeardescription || getyeardescription,
      FSchTxt: searchQuery,

      // FYerDsc:'2025-2025',
      //   code: 'USMANMTR',
      //   FLocCod: '002',
    }).toString();

    axios
      .post(apiUrl, formData)
      .then((response) => {
        setIsLoading(false);

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
    if (!hasComponentMountedPreviously || (input3Ref && input3Ref.current)) {
      if (input3Ref && input3Ref.current) {
        setTimeout(() => {
          input3Ref.current.focus();
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

    const numColumns = 20; // Ensure this matches the actual number of columns
    const columnAlignments = [
      "center",
      "center",
      "left",
      "center",
      "left",
      "center",
      "left",
      "center",
      "left",
      "center",
       "right",
        "right",
         "right",
          "right",
           "right",
            "right",
             "right",
              "right",
               "right",
                "left",
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
    const storeListRow = worksheet.addRow(["Customer Search"]);
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
      "Inv Date",
  "Code",
  "Customer",
  "Mobile",
  "Guaranter Name",
  "Grn Mob",
  "Witness Name",
  "Wit Mob",
  "Item",
  "Sts",
  "Sale Amt",
  "Advance",
  "Ins Mth",
  "Ins Amt",
  "Collection",
  "Last Date",
  "Last Amt",
  "Balance",
  "Receivable",
  "Collector",
    ];
    const headerRow = worksheet.addRow(headers);
    headerRow.eachCell((cell) => Object.assign(cell, headerStyle));

    // ✅ Add data rows with alternating light grey background
    tableData.forEach((item, index) => {
      const row = worksheet.addRow([
         item["Inv Date"],
    item.Code,
    item.Customer,
    item.Mobile,
    item["Guaranter Name"],
    item["Grn Mobile"],
    item["Witness Name"],
    item["Wit Mobile"],
    item.Item,
    item.Sts,
    item["Sale Amt"],
    item.Advance,
    item["Ins Mth"],
    item["Ins Amt"],
    item.Collection,
    item["Last Date"],
    item["Last Amt"],
    item.Balance,
    item.Receivable,
    item.Collector,
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
    [10,10, 40,13, 40,13, 45,13,40,8, 12,12,12,12,12,12,12,12,12,40].forEach((width, index) => {
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
      "",
      "",
      "",
      "",
      "",
      "",
      "",
      "",
      "",
      "",
      "",
      "",
      
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
    saveAs(blob, `CustomerSearch As On ${currentDate}.xlsx`);
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
  const renderTableData = () => {
    return (
      <>
        {isLoading ? (
          <>
            <tr style={{ backgroundColor: getcolor }}>
              <td colSpan="20" className="text-center">
                <Spinner animation="border" variant="primary" />
              </td>
            </tr>
            {Array.from({ length: Math.max(0, 25 - 5) }).map((_, rowIndex) => (
              <tr
                key={`blank-${rowIndex}`}
                style={{
                  backgroundColor: getcolor,
                  color: fontcolor,
                }}
              >
                {Array.from({ length: 9 }).map((_, colIndex) => (
                  <td key={`blank-${rowIndex}-${colIndex}`}>&nbsp;</td>
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
                  className={selectedIndex === i ? "selected-background" : ""}
                  style={{
                    backgroundColor: getcolor,
                    color: fontcolor,
                  }}
                >
                  <td className="text-center" style={firstColWidth}>
                    {item['Inv Date']}
                  </td>
                  <td
                    className="text-start"
                    title={item.Code}
                    style={{
                      ...secondColWidth,
                      whiteSpace: "nowrap",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                    }}
                  >
                    {item.Code}
                  </td>
                   <td
                    className="text-start"
                    title={item.Customer}
                    style={{
                      ...thirdColWidth,
                      whiteSpace: "nowrap",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                    }}
                  >
                    {item.Customer}
                  </td>
                  <td
                    className="text-start"
                    title={item.Mobile}
                    style={{
                      ...forthColWidth,
                      whiteSpace: "nowrap",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                    }}
                  >
                    {item.Mobile}
                  </td>
                  <td
                    className="text-start"
                    title={item["Guaranter Name"]}
                    style={{
                      ...fifthColWidth,
                      whiteSpace: "nowrap",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                    }}
                  >
                    {item["Guaranter Name"]}
                  </td>
                  <td className="text-end" style={sixthColWidth}>
                    {item["Grn Mobile"]}
                  </td>

                  <td
                    className="text-start"
                    title={item["Witness Name"]}
                    style={{
                      ...seventhColWidth,
                      whiteSpace: "nowrap",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                    }}
                  >
                    {item["Witness Name"]}
                  </td>
                  <td className="text-end" style={eighthColWidth}>
                    {item["Wit Mobile"]}
                  </td>

                   <td
                    className="text-start"
                    title={item["Item"]}
                    style={{
                      ...eighthColWidth,
                      whiteSpace: "nowrap",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                    }}
                  >
                    {item["Item"]}
                  </td>
                </tr>
              );
            })}
            {Array.from({
              length: Math.max(0, 25 - tableData.length),
            }).map((_, rowIndex) => (
              <tr
                key={`blank-${rowIndex}`}
                style={{
                  backgroundColor: getcolor,
                  color: fontcolor,
                }}
              >
                {Array.from({ length: 9 }).map((_, colIndex) => (
                  <td key={`blank-${rowIndex}-${colIndex}`}>&nbsp;</td>
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
            </tr>
          </>
        )}
      </>
    );
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
  const secondColWidth = { width: isSidebarVisible ? "80px" : "80px"};
  const thirdColWidth = { width: isSidebarVisible ? "200px" : "360px" };
  const forthColWidth = { width: isSidebarVisible ? "90px" : "90px"};
  const fifthColWidth = { width: isSidebarVisible ? "200px" : "360px" };
  const sixthColWidth = { width: isSidebarVisible ? "90px" : "90px" };
  const seventhColWidth = { width: isSidebarVisible ? "200px" : "360px" };
  const eighthColWidth = { width: isSidebarVisible ? "90px" : "90px" };
  const ninthColWidth = { width: isSidebarVisible ? "200px" : "360px" };


  const tenthColWidth = { width: isSidebarVisible ? "50px" : "50px" };
  const ColWidth11 = { width: isSidebarVisible ? "90px" : "90px"};
  const ColWidth12 = { width: isSidebarVisible ? "90px" : "90px" };
  const ColWidth13 = { width: isSidebarVisible ? "90px" : "90px"};
  const ColWidth14 = { width: isSidebarVisible ? "90px" : "90px" };
  const ColWidth15 = { width: isSidebarVisible ? "90px" : "90px" };
  const ColWidth16 = { width: isSidebarVisible ? "90px" : "90px" };
  const ColWidth17 = { width: isSidebarVisible ? "90px" : "90px" };
  const ColWidth18 = { width: isSidebarVisible ? "90px" : "90px" };
  const ColWidth19 = { width: isSidebarVisible ? "90px" : "90px" };
  const ColWidth20 = { width: isSidebarVisible ? "200px" : "360px" };

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
          <NavComponent textdata="Customer Search" />

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
                justifyContent: "end",
              }}
            >
              {/* <div
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

                <div style={{ position: "relative", display: "inline-block" }}>
                  <select
                    ref={input1Ref}
                    // onKeyDown={(e) => handleKeyPress(e, input2Ref)}
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
                    <option value="">ALL</option>
                    <option value="A">ACTIVE</option>
                    <option value="N">NON-ACTIVE</option>
                  </select>

                  {transectionType !== "" && (
                    <span
                      onClick={() => settransectionType("")}
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
                    // onKeyDown={(e) => handleKeyPress(e, input3Ref)}
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
      style={{ ...firstColWidth, cursor: "pointer" }}
      onClick={() => handleSorting("Inv Date")}
    >
      Inv Date{" "}
      <i
        className="fa-solid fa-caret-down caretIconStyle"
        style={getIconStyle("Inv Date")}
      ></i>
    </th>

    <th
      className="border-dark"
      style={{ ...secondColWidth, cursor: "pointer" }}
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
      style={{ ...thirdColWidth, cursor: "pointer" }}
      onClick={() => handleSorting("Customer")}
    >
      Customer{" "}
      <i
        className="fa-solid fa-caret-down caretIconStyle"
        style={getIconStyle("Customer")}
      ></i>
    </th>

    <th
      className="border-dark"
      style={{ ...forthColWidth, cursor: "pointer" }}
      onClick={() => handleSorting("Mobile")}
    >
      Mobile{" "}
      <i
        className="fa-solid fa-caret-down caretIconStyle"
        style={getIconStyle("Mobile")}
      ></i>
    </th>

    <th
      className="border-dark"
      style={{ ...fifthColWidth, cursor: "pointer" }}
      onClick={() => handleSorting("Guaranter Name")}
    >
      Guaranter Name{" "}
      <i
        className="fa-solid fa-caret-down caretIconStyle"
        style={getIconStyle("Guaranter Name")}
      ></i>
    </th>

    <th
      className="border-dark"
      style={{ ...sixthColWidth, cursor: "pointer" }}
      onClick={() => handleSorting("Grn Mob")}
    >
      Grn Mob{" "}
      <i
        className="fa-solid fa-caret-down caretIconStyle"
        style={getIconStyle("Grn Mob")}
      ></i>
    </th>

    <th
      className="border-dark"
      style={{ ...seventhColWidth, cursor: "pointer" }}
      onClick={() => handleSorting("Witness Name")}
    >
      Witness Name{" "}
      <i
        className="fa-solid fa-caret-down caretIconStyle"
        style={getIconStyle("Witness Name")}
      ></i>
    </th>

    <th
      className="border-dark"
      style={{ ...eighthColWidth, cursor: "pointer" }}
      onClick={() => handleSorting("Wit Mob")}
    >
      Wit Mob{" "}
      <i
        className="fa-solid fa-caret-down caretIconStyle"
        style={getIconStyle("Wit Mob")}
      ></i>
    </th>

    <th
      className="border-dark"
      style={{ ...ninthColWidth, cursor: "pointer" }}
      onClick={() => handleSorting("Item")}
    >
      Item{" "}
      <i
        className="fa-solid fa-caret-down caretIconStyle"
        style={getIconStyle("Item")}
      ></i>
    </th>

    {/* Additional columns */}
    <th style={{ cursor: "pointer" }} onClick={() => handleSorting("Sts")}>
      Sts <i className="fa-solid fa-caret-down" style={getIconStyle("Sts")}></i>
    </th>

    <th style={{ cursor: "pointer" }} onClick={() => handleSorting("Sale Amt")}>
      Sale Amt <i className="fa-solid fa-caret-down" style={getIconStyle("Sale Amt")}></i>
    </th>

    <th style={{ cursor: "pointer" }} onClick={() => handleSorting("Advance")}>
      Advance <i className="fa-solid fa-caret-down" style={getIconStyle("Advance")}></i>
    </th>

    <th style={{ cursor: "pointer" }} onClick={() => handleSorting("Ins Mth")}>
      Ins Mth <i className="fa-solid fa-caret-down" style={getIconStyle("Ins Mth")}></i>
    </th>

    <th style={{ cursor: "pointer" }} onClick={() => handleSorting("Ins Amt")}>
      Ins Amt <i className="fa-solid fa-caret-down" style={getIconStyle("Ins Amt")}></i>
    </th>

    <th style={{ cursor: "pointer" }} onClick={() => handleSorting("Collection")}>
      Collection <i className="fa-solid fa-caret-down" style={getIconStyle("Collection")}></i>
    </th>

    <th style={{ cursor: "pointer" }} onClick={() => handleSorting("Last Date")}>
      Last Date <i className="fa-solid fa-caret-down" style={getIconStyle("Last Date")}></i>
    </th>

    <th style={{ cursor: "pointer" }} onClick={() => handleSorting("Last Amt")}>
      Last Amt <i className="fa-solid fa-caret-down" style={getIconStyle("Last Amt")}></i>
    </th>

    <th style={{ cursor: "pointer" }} onClick={() => handleSorting("Balance")}>
      Balance <i className="fa-solid fa-caret-down" style={getIconStyle("Balance")}></i>
    </th>

    <th style={{ cursor: "pointer" }} onClick={() => handleSorting("Receivable")}>
      Receivable <i className="fa-solid fa-caret-down" style={getIconStyle("Receivable")}></i>
    </th>

    <th style={{ cursor: "pointer" }} onClick={() => handleSorting("Collector")}>
      Collector <i className="fa-solid fa-caret-down" style={getIconStyle("Collector")}></i>
    </th>
  </tr>
</thead>

              {/* Table Body */}
              <tbody>
                {isLoading ? (
                  <>
                    <tr style={{ backgroundColor: getcolor }}>
                      <td colSpan={9} className="text-center">
                        <Spinner animation="border" variant="primary" />
                      </td>
                    </tr>
                    {Array.from({ length: totalRows - 5 }).map((_, rowIndex) => (
                      <tr
                        key={`blank-${rowIndex}`}
                        style={{ backgroundColor: getcolor, color: fontcolor }}
                      >
                        {Array.from({ length: 20 }).map((_, colIndex) => (
                          <td key={`blank-${rowIndex}-${colIndex}`}>&nbsp;</td>
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
                       
                        <td
                          className="text-ceter"
                          title={item.Code}
                          style={{
                            ...secondColWidth,
                            whiteSpace: "nowrap",
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                          }}
                        >
                          {item.Code}
                        </td>
                         <td className="text-center" style={firstColWidth}>
                          {item["Inv Date"]}
                        </td>
                        <td
                          className="text-start"
                          title={item.Customer}
                          style={{
                            ...thirdColWidth,
                            whiteSpace: "nowrap",
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                          }}
                        >
                          {item.Customer}
                        </td>
                        <td
                          className="text-center"
                          title={item.Mobile}
                          style={{
                            ...forthColWidth,
                            whiteSpace: "nowrap",
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                          }}
                        >
                          {item.Mobile}
                        </td>
                        <td
                          className="text-start"
                          title={item["Guaranter Name"]}
                          style={{
                            ...fifthColWidth,
                            whiteSpace: "nowrap",
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                          }}
                        >
                          {item["Guaranter Name"]}
                        </td>
                        <td className="text-center" style={sixthColWidth}>
                          {item["Grn Mobile"]}
                        </td>
                        <td
                          className="text-start"
                          title={item["Witness Name"]}
                          style={{
                            ...seventhColWidth,
                            whiteSpace: "nowrap",
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                          }}
                        >
                          {item["Witness Name"]}
                        </td>
                        <td className="text-center" style={eighthColWidth}>
                          {item["Wit Mobile"]}
                        </td>
                        <td
                          className="text-start"
                          title={item["Item"]}
                          style={{
                            ...ninthColWidth,
                            whiteSpace: "nowrap",
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                          }}
                        >
                          {item["Item"]}
                        </td>
                         <td className="text-center" style={tenthColWidth}>
                          {item.Sts}
                        </td>

                         <td
                          className="text-end"
                          title={item["Sale Amt"]}
                          style={{
                            ...ColWidth11,
                            whiteSpace: "nowrap",
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                          }}
                        >
                          {item["Sale Amt"]}
                        </td>

                        <td
                          className="text-end"
                          title={item.Advance}
                          style={{
                            ...ColWidth12,
                            whiteSpace: "nowrap",
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                          }}
                        >
                          {item.Advance}
                        </td>

                          <td
                          className="text-end"
                          title={item["Ins Mth"]}
                          style={{
                            ...ColWidth13,
                            whiteSpace: "nowrap",
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                          }}
                        >
                          {item["Ins Mth"]}
                        </td>

                          <td
                          className="text-end"
                          title={item["Ins Amt"]}
                          style={{
                            ...ColWidth14,
                            whiteSpace: "nowrap",
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                          }}
                        >
                          {item["Ins Amt"]}
                        </td>

                         <td
                          className="text-end"
                          title={item.Collection}
                          style={{
                            ...ColWidth15,
                            whiteSpace: "nowrap",
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                          }}
                        >
                          {item.Collection}
                        </td>

                        <td
                          className="text-end"
                          title={item["Last Date"]}
                          style={{
                            ...ColWidth16,
                            whiteSpace: "nowrap",
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                          }}
                        >
                          {item["Last Date"]}
                        </td>

                         <td
                          className="text-end"
                          title={item["Last Amt"]}
                          style={{
                            ...ColWidth17,
                            whiteSpace: "nowrap",
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                          }}
                        >
                          {item["Last Amt"]}
                        </td>

                        <td
                          className="text-end"
                          title={item.Balance}
                          style={{
                            ...ColWidth18,
                            whiteSpace: "nowrap",
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                          }}
                        >
                          {item.Balance}
                        </td>

                         <td
                          className="text-end"
                          title={item.Receivable}
                          style={{
                            ...ColWidth19,
                            whiteSpace: "nowrap",
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                          }}
                        >
                          {item.Receivable}
                        </td>

                         <td
                          className="text-start"
                          title={item.Collector}
                          style={{
                            ...ColWidth20,
                            whiteSpace: "nowrap",
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                          }}
                        >
                          {item.Collector}
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
                          {Array.from({ length: 20 }).map((_, colIndex) => (
                            <td key={`blank-${rowIndex}-${colIndex}`}>&nbsp;</td>
                          ))}
                        </tr>
                      )
                    )}
                    <tr>
                      <td style={secondColWidth}></td>
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
                  <td style={{  borderRight: `1px solid ${fontcolor}`,}}></td>
                  <td></td>
                  <td></td>
                  <td></td>
                  <td></td>
                  <td></td>
                  <td></td>
                  <td></td>
                   <td></td>
                    <td></td>
                  <td></td>
                  <td></td>
                  <td></td>
                  <td></td>
                  <td></td>
                  <td></td>
                   <td></td>
                    <td></td>
                   <td></td>
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
