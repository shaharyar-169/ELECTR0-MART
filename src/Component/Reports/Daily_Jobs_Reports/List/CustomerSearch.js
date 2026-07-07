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

 
  function fetchReceivableReport() {
    const apiUrl = apiLinks + "/CustomerSearch.php";
    setIsLoading(true);
    const formData = new URLSearchParams({
      code: organisation.code,
      FLocCod: locationnumber || getLocationNumber,
      FYerDsc: yeardescription || getyeardescription,
      FSchTxt: searchQuery,

      // FYerDsc: '2025-2025',
      // code: 'ZAHIDELEC',
      // FLocCod: '001',
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
    if (!hasComponentMountedPreviously || (input2Ref && input2Ref.current)) {
      if (input2Ref && input2Ref.current) {
        setTimeout(() => {
          input2Ref.current.focus();
          // input2Ref.current.select();
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

  // ------------------------------------------------------------------
  // 1. Build table rows with combined Customer and Guarantor columns
  // ------------------------------------------------------------------
  const rows = tableData.map((item) => {
    // Combine Customer, Mobile, CNIC – each on a new line
    const customerCombined = `${item.Customer || ""}\n${item.Mobile || ""}\n${item["Cust NIC"]|| ""}`;
    // Combine Guarantor Name, Mobile, CNIC
    const guarantorCombined = `${item["Guaranter Name"] || ""}\n${item["Grn Mobile"] || ""}\n${item["Grn NIC"] || ""}`;
    const witnessCombined = `${item["Witness Name"] || ""}\n${item["Wit Mobile"] || ""}\n${item["Wit NIC"] || ""}`;

    return [
      item.Code,
      item["Inv Date"],
      customerCombined,
      guarantorCombined,
      witnessCombined,
      item["Item"],
      item["Sts"],
      item["Sale Amt"],
      item["Advance"],
      item["Ins Mth"],
      item["Ins Amt"],
      item["Collection"],
      item["Last Date"],
       item["Last Amt"],
      item["Balance"],
      item["Receivable"],
     
    ];
  });

  // ------------------------------------------------------------------
  // 2. Add summary row (totals) with matching 17 columns
  // ------------------------------------------------------------------
  rows.push([
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
  ]);

  // ------------------------------------------------------------------
  // 3. Column headers (17 columns)
  // ------------------------------------------------------------------
  const headers = [
    "Code", "Inv Date", "Customer", "Guaranter", "Witness",
    "Item", "Sts", "S.Amt", "Adv", "I.Mth", "I.Amt",
    "Coll", "L.Date","L.Amt", "Balance", "Rec" 
  ];

  // Column widths (unchanged)
  const columnWidths = [16, 18, 28, 28, 28, 25, 7, 16, 14, 10, 17, 17,17, 17, 17, 17];

  const totalWidth = columnWidths.reduce((acc, width) => acc + width, 0);
  const pageHeight = doc.internal.pageSize.height;
  const paddingTop = 15;
  const bottomMargin = 12;

  doc.setFont("verdana-regular", "normal");
  doc.setFontSize(7);

  const cellPadding = 1;
  const fontSize = 7;
  const lineIncrement = 5;
  const cellTopPadding = 1;
  const cellBottomPadding = 1;

  // --------------------------------------------------------------
  // splitTextToLines – handles explicit newlines and word wrapping
  //   now uses a maxWidth reduced by 2*cellPadding to avoid overflow
  // --------------------------------------------------------------
  const splitTextToLines = (text, maxWidth) => {
    if (!text) return [""];
    const rawLines = String(text).split(/\r?\n/);
    const allLines = [];

    for (let rawLine of rawLines) {
      if (rawLine === "") {
        allLines.push("");
        continue;
      }
      const words = rawLine.split(/(?<= )|(?=\s)/);
      let currentLine = "";
      for (let word of words) {
        const testLine = currentLine + word;
        if (doc.getTextWidth(testLine) <= maxWidth) {
          currentLine = testLine;
        } else {
          if (currentLine) allLines.push(currentLine.trimEnd());
          currentLine = word;
        }
      }
      if (currentLine) allLines.push(currentLine.trimEnd());
    }
    return allLines.length ? allLines : [""];
  };

  // Table headers (unchanged)
  const addTableHeaders = (startX, startY) => {
    doc.setFont("verdana-regular", "normal");
    doc.setFontSize(8);
    headers.forEach((header, index) => {
      const cellWidth = columnWidths[index];
      const cellHeight = 6;
      const cellX = startX + cellWidth / 2;
      const cellY = startY + cellHeight / 2 + 1.5;
      doc.setLineWidth(0.2);
      doc.rect(startX, startY, cellWidth, cellHeight);
      doc.setTextColor(0);
      doc.text(header, cellX, cellY, { align: "center" });
      startX += columnWidths[index];
    });
  };

  // Add a single row (returns row height)
  const addSingleRow = (row, i, startX, currentY, isTotalRow) => {
    const isOddRow = i % 2 !== 0;
    const isRedRow = row[0] && parseInt(row[0]) > 10000000000;
    let textColor = [0, 0, 0];
    if (isRedRow) textColor = [255, 0, 0];

    // Calculate required lines for each cell, using reduced maxWidth to avoid overflow
    const cellLines = row.map((cell, colIdx) => {
      const maxWidth = columnWidths[colIdx] - 2 * cellPadding;
      const cellText = String(cell);
      return splitTextToLines(cellText, maxWidth);
    });
    const maxLines = Math.max(...cellLines.map(lines => lines.length), 1);
    const rowHeight = maxLines * lineIncrement + cellTopPadding + cellBottomPadding;

    // Alternating row background
    if (isOddRow && !isTotalRow) {
      doc.setFillColor(240);
      doc.rect(startX, currentY, getTotalTableWidth(), rowHeight, "F");
    }

    // Draw cell borders and content
    doc.setDrawColor(0);
    let currentX = startX;
    for (let colIdx = 0; colIdx < row.length; colIdx++) {
      const cellWidth = columnWidths[colIdx];
      const lines = cellLines[colIdx];

      doc.setLineWidth(0.2);
      doc.rect(currentX, currentY, cellWidth, rowHeight);

      doc.setTextColor(textColor[0], textColor[1], textColor[2]);
      doc.setFont("verdana-regular", "normal");

      // --- Adjust font size for total row numeric values ---
      let currentFontSize = fontSize; // default 7
      if (isTotalRow && colIdx > 7) {
        currentFontSize = 6; // smaller for total figures
      }
      doc.setFontSize(currentFontSize);

      let startY = currentY + cellTopPadding;
      lines.forEach((line, lineIdx) => {
        const lineY = startY + lineIdx * lineIncrement;
        let xPos;
        if (colIdx === 0 || colIdx === 1 || colIdx === 6) {
          // center aligned
          xPos = currentX + cellWidth / 2;
          doc.text(line, xPos, lineY, { align: "center", baseline: "top" });
        } else if (colIdx > 6) {
          // right aligned (numeric)
          xPos = currentX + cellWidth - cellPadding;
          doc.text(line, xPos, lineY, { align: "right", baseline: "top" });
        } else {
          // left aligned
          xPos = currentX + cellPadding;
          doc.text(line, xPos, lineY, { baseline: "top" });
        }
      });

      if (colIdx < row.length - 1) {
        doc.setLineWidth(0.2);
        doc.line(currentX + cellWidth, currentY, currentX + cellWidth, currentY + rowHeight);
      }
      currentX += cellWidth;
    }

    // Extra thick lines for total row
    if (isTotalRow) {
      const tableWidth = getTotalTableWidth();
      doc.setLineWidth(0.3);
      doc.line(startX, currentY, startX + tableWidth, currentY);
      doc.line(startX, currentY + 0.5, startX + tableWidth, currentY + 0.5);
      doc.line(startX, currentY + rowHeight, startX + tableWidth, currentY + rowHeight);
      doc.line(startX, currentY + rowHeight - 0.5, startX + tableWidth, currentY + rowHeight - 0.5);
    }

    return rowHeight;
  };

  const getTotalTableWidth = () => {
    let totalWidth = 0;
    columnWidths.forEach((width) => (totalWidth += width));
    return totalWidth;
  };

  const addFooter = () => {
    const tableWidth = getTotalTableWidth();
    const lineX = (doc.internal.pageSize.width - tableWidth) / 2;
    const lineY = pageHeight - 12;
    doc.setLineWidth(0.3);
    doc.line(lineX, lineY, lineX + tableWidth, lineY);
    const headingX = lineX + 2;
    const headingY = lineY + 5;
    doc.setFont("verdana-regular", "normal");
    doc.setFontSize(7);
    doc.text(`Crystal Solution    ${date}    ${time}`, headingX, headingY);
  };

  // Dynamic pagination (unchanged)
  const handlePagination = () => {
    let currentPage = 1;
    let currentRowIndex = 0;
    const tableStartX = (doc.internal.pageSize.width - totalWidth) / 2;

    while (currentRowIndex < rows.length) {
      if (currentPage > 1) {
        doc.addPage();
      }

      let currentY = paddingTop;
      doc.setFont("Times New Roman", "normal");
      doc.setFontSize(24);
      doc.text(comapnyname, doc.internal.pageSize.width / 2, currentY, { align: "center" });
      currentY += 5;
      doc.setFont("verdana-regular", "normal");
      doc.setFontSize(14);
      doc.text("Customer Search Report", doc.internal.pageSize.width / 2, currentY, { align: "center" });
      currentY += -5;

      const labelsX = (doc.internal.pageSize.width - totalWidth) / 2;
      const labelsY = currentY + 4;
      // let collectordata = CollectorDataValue.label ? CollectorDataValue.label : "ALL";
      let search = searchQuery ? searchQuery : "";

      // doc.setFont("verdana", "bold");
      // doc.setFontSize(8);
      // doc.text(`Collector :`, labelsX, labelsY + 8.5);
      // doc.setFont("verdana-regular", "normal");
      // doc.setFontSize(8);
      // doc.text(`${collectordata}`, labelsX + 20, labelsY + 8.5);

      if (searchQuery) {
        doc.setFont("verdana", "bold");
        doc.setFontSize(8);
        doc.text(`Search :`, labelsX , labelsY + 8.5);
        doc.setFont("verdana-regular", "normal");
        doc.setFontSize(8);
        doc.text(`${search}`, labelsX + 25, labelsY + 8.5);
      }

      currentY += 15;
      addTableHeaders(tableStartX, currentY);
      currentY += 6;

      const maxY = pageHeight - bottomMargin;

      while (currentRowIndex < rows.length) {
        const row = rows[currentRowIndex];
        const isTotalRow = currentRowIndex === rows.length - 1;

        const cellLines = row.map((cell, colIdx) => {
          const maxWidth = columnWidths[colIdx] - 2 * cellPadding;
          const cellText = String(cell);
          return splitTextToLines(cellText, maxWidth);
        });
        const maxLines = Math.max(...cellLines.map(lines => lines.length), 1);
        const rowHeight = maxLines * lineIncrement + cellTopPadding + cellBottomPadding;

        if (currentY + rowHeight > maxY) {
          addFooter();
          break;
        }

        addSingleRow(row, currentRowIndex, tableStartX, currentY, isTotalRow);
        currentY += rowHeight;
        currentRowIndex++;
      }

      if (currentRowIndex >= rows.length) {
        addFooter();
        break;
      }
      currentPage++;
    }

    const totalPages = doc.getNumberOfPages();
    for (let p = 1; p <= totalPages; p++) {
      doc.setPage(p);
      doc.setFont("verdana-regular", "normal");
      doc.setFontSize(7);
      doc.text(`Page ${p} / ${totalPages}`, doc.internal.pageSize.width - 30, doc.internal.pageSize.height - 7, { align: "right" });
    }
  };

  const getCurrentDate = () => {
    const today = new Date();
    const dd = String(today.getDate()).padStart(2, "0");
    const mm = String(today.getMonth() + 1).padStart(2, "0");
    const yyyy = today.getFullYear();
    return dd + "/" + mm + "/" + yyyy;
  };

  const getCurrentTime = () => {
    const today = new Date();
    const hh = String(today.getHours()).padStart(2, "0");
    const mm = String(today.getMinutes()).padStart(2, "0");
    const ss = String(today.getSeconds()).padStart(2, "0");
    return hh + ":" + mm + ":" + ss;
  };

  const date = getCurrentDate();
  const time = getCurrentTime();

  handlePagination();

  doc.save(`CustomerSearchReport As On ${date}.pdf`);
};
  ///////////////////////////// DOWNLOAD PDF EXCEL //////////////////////////////////////////////////////////

 const handleDownloadCSV = async () => {
  const workbook = new ExcelJS.Workbook();
  const worksheet = workbook.addWorksheet("Sheet1");

  const numColumns = 23; // Ensure this matches the actual number of columns
  const columnAlignments = [
    "center",
    "center",
    "left",
    "center",
    "center",
    "left",
    "center",
    "center",
    "left",
    "center",
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

  // Helper: convert any value (including strings with commas) to a safe number
  const toNumber = (value) => {
    if (typeof value === "number") return value;
    if (typeof value === "string") {
      const cleaned = value.replace(/,/g, ""); // remove all commas
      const num = parseFloat(cleaned);
      return isNaN(num) ? 0 : num;
    }
    return 0;
  };

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
    `A${companyRow.number}:${String.fromCharCode(65 + numColumns - 1)}${companyRow.number}`
  );

  // Store List
  const storeListRow = worksheet.addRow(["Customer Search"]);
  storeListRow.eachCell((cell) => {
    cell.font = fontStoreList;
    cell.alignment = { horizontal: "center" };
  });
  worksheet.mergeCells(
    `A${storeListRow.number}:${String.fromCharCode(65 + numColumns - 1)}${storeListRow.number}`
  );

  // Empty row
  worksheet.addRow([]);

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
    "Code",
    "Inv Date",
    "Customer",
    "Mobile",
    "CNIC",
    "Guaranter",
    "Mobile",
    "CNIC",
    "Witness",
    "Mobile",
    "CNIC",
    "Item",
    "Sts",
    "S.Amt",
    "Adv",
    "I.Mth",
    "I.Amt",
    "Coll",
    "L.Date",
    "L.Amt",
    "Balance",
    "Rec",
    "Collector",
  ];
  const headerRow = worksheet.addRow(headers);
  headerRow.eachCell((cell) => Object.assign(cell, headerStyle));

  // Add data rows with numeric conversion
  tableData.forEach((item, index) => {
    const row = worksheet.addRow([
      item.Code,
      item["Inv Date"],
      item.Customer,
      item.Mobile,
      item["Cust NIC"],
      item["Guaranter Name"],
      item["Grn Mobile"],
      item["Grn NIC"],
      item["Witness Name"],
      item["Wit Mobile"],
      item["Wit NIC"],
      item.Item,
      item.Sts,
      toNumber(item["Sale Amt"]), // column 14
      toNumber(item.Advance),     // column 15
      toNumber(item["Ins Mth"]),  // column 16
      toNumber(item["Ins Amt"]),  // column 17
      toNumber(item.Collection),  // column 18
      item["Last Date"],
      toNumber(item["Last Amt"]), // column 20
      toNumber(item.Balance),     // column 21
      toNumber(item.Receivable),  // column 22
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

      // Apply number format for numeric columns (indices 14-18 and 20-22)
      if (
        (colIndex >= 14 && colIndex <= 18) ||
        (colIndex >= 20 && colIndex <= 22)
      ) {
        cell.numFmt = "#,##0"; // no decimals, thousand separator
      }

      // Apply light grey background to odd rows
      if ((index + 1) % 2 !== 0) {
        cell.fill = {
          type: "pattern",
          pattern: "solid",
          fgColor: { argb: "FFEFEFEF" },
        };
      }
    });
  });

  // Column widths
  [
    10, 10, 40, 13, 17, 40, 13, 17, 45, 13, 17, 40, 8, 12, 12, 12, 12, 12, 12,
    12, 12, 12, 30,
  ].forEach((width, index) => {
    worksheet.getColumn(index + 1).width = width;
  });

  // Total row (only count in first column, centered)
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
    "",
    "",
    "",
  ]);

  totalRow.eachCell((cell, colNumber) => {
    cell.font = { bold: true };
    cell.border = {
      top: { style: "double" },
      left: { style: "thin" },
      bottom: { style: "double" },
      right: { style: "thin" },
    };
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
    `A${dateTimeRow.number}:${String.fromCharCode(65 + numColumns - 1)}${dateTimeRow.number}`
  );
  worksheet.mergeCells(
    `A${dateTimeRow1.number}:${String.fromCharCode(65 + numColumns - 1)}${dateTimeRow1.number}`
  );

  // Save Excel
  const buffer = await workbook.xlsx.writeBuffer();
  const blob = new Blob([buffer], {
    type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  });
  saveAs(blob, `CustomerSearch As On ${currentDate}.xlsx`);
};

  const handleKeyPress = (e, nextInputRef) => {
    if (e.key === "Enter") {
      e.preventDefault();
      if (nextInputRef.current) {
        nextInputRef.current.focus();
      }
    }
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

  const isLargeScreen = window.innerWidth > 1500;

  const contentStyle = {
    width: "100%", // 100vw ki jagah 100%
    // maxWidth: isSidebarVisible ? "1000px" : "1200px",

    maxWidth: isSidebarVisible
      ? (isLargeScreen ? "1270px" : "1000px")
      : (isLargeScreen ? "1500px" : "1200px"),

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

  const firstColWidth = { width: isSidebarVisible ? (isLargeScreen ? "80px" : "80px") : (isLargeScreen ? "80px" : "80px") };
  const secondColWidth = { width: isSidebarVisible ? (isLargeScreen ? "80px" : "80px") : (isLargeScreen ? "80px" : "80px") };
  const thirdColWidth = { width: isSidebarVisible ? (isLargeScreen ? "180px" : "180px") : (isLargeScreen ? "180px" : "180px") };
  const thirdColWidth1 = { width: isSidebarVisible ? (isLargeScreen ? "120px" : "120px") : (isLargeScreen ? "120px" : "120px") };
  const forthColWidth = { width: isSidebarVisible ? (isLargeScreen ? "90px" : "90px") : (isLargeScreen ? "90px" : "90px") };
  const fifthColWidth = { width: isSidebarVisible ? (isLargeScreen ? "180px" : "180px") : (isLargeScreen ? "180px" : "180px") };
  const fifthColWidth1 = { width: isSidebarVisible ? (isLargeScreen ? "125px" : "125px") : (isLargeScreen ? "125px" : "125px") };
  const sixthColWidth = { width: isSidebarVisible ? (isLargeScreen ? "90px" : "90px") : (isLargeScreen ? "90px" : "90px") };
  const seventhColWidth = { width: isSidebarVisible ? (isLargeScreen ? "180px" : "180px") : (isLargeScreen ? "180px" : "180px") };
  const seventhColWidth1 = { width: isSidebarVisible ? (isLargeScreen ? "120px" : "120px") : (isLargeScreen ? "120px" : "120px") };
  const eighthColWidth = { width: isSidebarVisible ? (isLargeScreen ? "90px" : "90px") : (isLargeScreen ? "90px" : "90px") };
  const ninthColWidth = { width: isSidebarVisible ? (isLargeScreen ? "180px" : "180px") : (isLargeScreen ? "180px" : "180px") };


  const tenthColWidth = { width: isSidebarVisible ? (isLargeScreen ? "50px" : "50px") : (isLargeScreen ? "50px" : "50px") };
  const ColWidth11 = { width: isSidebarVisible ? (isLargeScreen ? "90px" : "90px") : (isLargeScreen ? "90px" : "90px") };
  const ColWidth12 = { width: isSidebarVisible ? (isLargeScreen ? "90px" : "90px") : (isLargeScreen ? "90px" : "90px") };
  const ColWidth13 = { width: isSidebarVisible ? (isLargeScreen ? "90px" : "90px") : (isLargeScreen ? "90px" : "90px") };
  const ColWidth14 = { width: isSidebarVisible ? (isLargeScreen ? "90px" : "90px") : (isLargeScreen ? "90px" : "90px") };
  const ColWidth15 = { width: isSidebarVisible ? (isLargeScreen ? "90px" : "90px") : (isLargeScreen ? "90px" : "90px") };
  const ColWidth16 = { width: isSidebarVisible ? (isLargeScreen ? "90px" : "90px") : (isLargeScreen ? "90px" : "90px") };
  const ColWidth17 = { width: isSidebarVisible ? (isLargeScreen ? "90px" : "90px") : (isLargeScreen ? "90px" : "90px") };
  const ColWidth18 = { width: isSidebarVisible ? (isLargeScreen ? "90px" : "90px") : (isLargeScreen ? "90px" : "90px") };
  const ColWidth19 = { width: isSidebarVisible ? (isLargeScreen ? "90px" : "90px") : (isLargeScreen ? "90px" : "90px") };
  const ColWidth20 = { width: isSidebarVisible ? (isLargeScreen ? "180px" : "180px") : (isLargeScreen ? "180px" : "180px") };



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
  const totalRows = 23; // fixed number of rows

  const colWidths = [
    firstColWidth.width,
    secondColWidth.width,
    thirdColWidth.width,
    thirdColWidth1.width,
    forthColWidth.width,
    fifthColWidth.width,
    fifthColWidth1.width,
    sixthColWidth.width,
    seventhColWidth.width,
    seventhColWidth1.width,
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
              justifyContent: "start",
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

            <div id="lastDiv" style={{ marginLeft: "20px" }}>
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
                    style={{ ...thirdColWidth1, cursor: "pointer" }}
                    onClick={() => handleSorting("Cust NIC")}
                  >
                    CNIC{" "}
                    <i
                      className="fa-solid fa-caret-down caretIconStyle"
                      style={getIconStyle("Cust NIC")}
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
                    style={{ ...fifthColWidth1, cursor: "pointer" }}
                    onClick={() => handleSorting("Grn NIC")}
                  >
                    Grn NIC{" "}
                    <i
                      className="fa-solid fa-caret-down caretIconStyle"
                      style={getIconStyle("Grn NIC")}
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
                    style={{ ...seventhColWidth1, cursor: "pointer" }}
                    onClick={() => handleSorting("Wit NIC")}
                  >
                    Wit NIC{" "}
                    <i
                      className="fa-solid fa-caret-down caretIconStyle"
                      style={getIconStyle("Wit NIC")}
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
                      <td colSpan={23} className="text-center">
                        <Spinner animation="border" variant="primary" />
                      </td>
                    </tr>
                    {Array.from({ length: totalRows - 5 }).map((_, rowIndex) => (
                      <tr
                        key={`blank-${rowIndex}`}
                        style={{ backgroundColor: getcolor, color: fontcolor }}
                      >
                        {Array.from({ length: 23 }).map((_, colIndex) => (
                          <td key={`blank-${rowIndex}-${colIndex}`}>&nbsp;</td>
                        ))}
                      </tr>
                    ))}
                    <tr>
                      <td style={firstColWidth}></td>
                      <td style={secondColWidth}></td>
                      <td style={thirdColWidth}></td>
                       <td style={thirdColWidth1}></td>
                      <td style={forthColWidth}></td>
                      <td style={fifthColWidth}></td>
                      <td style={fifthColWidth1}></td>
                      <td style={sixthColWidth}></td>
                      <td style={seventhColWidth}></td>
                      <td style={seventhColWidth1}></td>
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
                          className="text-center"
                          style={{
                            ...secondColWidth,
                            cursor: "pointer",
                            textDecoration: "underline",
                            color: selectedIndex === i ? "white" : "blue", // ✅ conditional color
                          }}
                          onDoubleClick={(e) => {
                            e.stopPropagation();
                            // code temporarily store karo
                            sessionStorage.setItem(
                              "InstallmentLedger",
                              JSON.stringify({
                                code: item.Code,
                              }),
                            );

                            // fixed URL open karo
                            window.open("/crystalsol/InstallmentLedger", "_blank");
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
                          className="text-start"
                          title={item["Cust NIC"]}
                          style={{
                            ...thirdColWidth1,
                            whiteSpace: "nowrap",
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                          }}
                        >
                          {item["Cust NIC"]}
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
                        <td className="text-center" style={fifthColWidth1}>
                          {item["Grn NIC"]}
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
                        <td className="text-center" style={seventhColWidth1}>
                          {item["Wit NIC"]}
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
                          {Array.from({ length: 23 }).map((_, colIndex) => (
                            <td key={`blank-${rowIndex}-${colIndex}`}>&nbsp;</td>
                          ))}
                        </tr>
                      )
                    )}
                    <tr>
                      <td style={secondColWidth}></td>
                      <td style={firstColWidth}></td>
                      <td style={thirdColWidth}></td>
                      <td style={thirdColWidth1}></td>
                      <td style={forthColWidth}></td>
                      <td style={fifthColWidth}></td>
                      <td style={fifthColWidth1}></td>
                      <td style={sixthColWidth}></td>
                      <td style={seventhColWidth}></td>
                      <td style={seventhColWidth1}></td>
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
                  <td style={{ borderRight: `1px solid ${fontcolor}`, }}></td>
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