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

export default function ReceipItemList() {
  const navigate = useNavigate();
  const user = getUserData();
  const organisation = getOrganisationData();
  const yeardescription = getYearDescription();
  const locationnumber = getLocationnumber();
  const saleSelectRef = useRef(null);
  const input1Ref = useRef(null);
  const input2Ref = useRef(null);
  const [isOptionsLoaded, setIsOptionsLoaded] = useState(false);
  const hasInitialized = useRef(false);
  const [filteredData, setFilteredData] = useState([]);

  const input3Ref = useRef(null);
  const [tableData, setTableData] = useState([]);
  const [Companyselectdatavalue, setCompanyselectdatavalue] = useState("");
  const [saleType, setSaleType] = useState("");
  const [sortData, setSortData] = useState("ASC");

  const [supplierList, setSupplierList] = useState([]);
  console.log("supplierList", supplierList);

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
    const apiUrl = apiLinks + "/GetItemReceipe.php";
    setIsLoading(true);
    const formData = new URLSearchParams({
      //   code: organisation.code,
      //   FLocCod: locationnumber || getLocationNumber,
      //   FYerDsc: yeardescription || getYearDescription,

      code: "IZONECOMP",
      FLocCod: "001",
      FTrnNum: saleType,
      FYerDsc: "2025-2025",
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

  useEffect(() => {
    const apiUrl = apiLinks + "/GetItemReceipeList.php";
    const formData = new URLSearchParams({
      // code: organisation.code,
      code: "IZONECOMP",
      FLocCod: "001",
      FYerDsc: "2025-2025",
    }).toString();
    axios
      .post(apiUrl, formData)
      .then((response) => {
        if (response.data && Array.isArray(response.data.List)) {
          setSupplierList(response.data.List);
        } else {
          console.warn(
            "Response data structure is not as expected:",
            response.data.List
          );
          setSupplierList([]);
        }
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  }, []);

  const options = supplierList.map((item) => ({
    value: item.ttrnnum,
    label: `${item.ttrnnum}-${item.titmdsc}`,
  }));

  useEffect(() => {
    setFilteredData(tableData);
  }, [tableData]);

  ///////////////////////////// DOWNLOAD PDF CODE ////////////////////////////////////////////////////////////
  const exportPDFHandler = () => {
    // Create a new jsPDF instance with landscape orientation
    const doc = new jsPDF({ orientation: "potraite" });

    // Define table data (rows)
    const rows = tableData.map((item) => [
      item.titmcod,
      item.ttrndsc,
      item.titmuom,
      item.trcpqnt
    ]);

    // Add summary row to the table
    // rows.push(["", "", "", "", "", ""]);

    // Define table column headers and individual column widths
    const headers = ["Code", "Description", "UOM", "Qnty"];
    const columnWidths = [15, 110, 15, 20];

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
      doc.setFont("verdana", "bold"); // Set font to bold
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
        let textColor = [0, 0, 0];
        let fontName = normalFont;

        if (isRedRow) {
          textColor = [255, 0, 0];
          fontName = boldFont;
        }

        if (isOddRow) {
          doc.setFillColor(240);
          doc.rect(
            startX,
            startY + (i - startIndex + 2) * rowHeight,
            tableWidth,
            rowHeight,
            "F"
          );
        }

        // Draw row border
        doc.setDrawColor(0);
        doc.rect(
          startX,
          startY + (i - startIndex + 2) * rowHeight,
          tableWidth,
          rowHeight
        );

        let cellStartX = startX;

         row.forEach((cell, cellIndex) => {

      // NEW → Vertically centered text
      const cellCenterY =
        startY + (i - startIndex + 2) * rowHeight + rowHeight / 2;

      // Original X logic same
      let textX = cellStartX + 2;

      doc.setTextColor(textColor[0], textColor[1], textColor[2]);
      doc.setFont("verdana-regular", "normal");
      doc.setFontSize(fontSize);

      const cellValue = String(cell);

      if (cellIndex === 0 || cellIndex === 2 || cellIndex === 3) {
        doc.text(cellValue, cellStartX + columnWidths[cellIndex] / 2, cellCenterY, {
          align: "center",
          baseline: "middle",
        });
      } else {
        doc.text(cellValue, textX, cellCenterY, {
          baseline: "middle",
        });
      }

      if (cellIndex < row.length - 1) {
        doc.rect(
          cellStartX,
          startY + (i - startIndex + 2) * rowHeight,
          columnWidths[cellIndex],
          rowHeight
        );
        cellStartX += columnWidths[cellIndex];
      }
    });
        // Draw last column border
        doc.rect(
          cellStartX,
          startY + (i - startIndex + 2) * rowHeight,
          columnWidths[row.length - 1],
          rowHeight
        );
      }

      // Same footer and line logic
      const lineWidth = tableWidth;
      const lineX = (doc.internal.pageSize.width - tableWidth) / 2;
      const lineY = pageHeight - 15;
      doc.setLineWidth(0.3);
      doc.line(lineX, lineY, lineX + lineWidth, lineY);

      const headingX = lineX + 2;
      const headingY = lineY + 5;
      doc.setFont("verdana-regular", "normal");
      doc.setFontSize(10);
      doc.setTextColor(0);
      doc.text(`Crystal Solution \t ${date} \t ${time}`, headingX, headingY);
    };

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
        titleFontSize = 18
      ) => {
        doc.setFont("verdana-regular", "normal");
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
        doc.setFont("verdana-regular", "normal");
        doc.setFontSize(10);
        doc.text(
          `Page ${pageNumber}`,
          rightX - 30,
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

        addTitle(`Receipe Item List`, "", "", pageNumber, startY, 12); // Render sale report title with decreased font size, provide the time, and page number
        startY += -5;

        const labelsX = (doc.internal.pageSize.width - totalWidth) / 2;
        const labelsY = startY + 4; // Position the labels below the titles and above the table

        let status = Companyselectdatavalue.label
        ? Companyselectdatavalue.label :''
         
        let search = searchQuery ? searchQuery : "";

        doc.setFont("verdana", "bold"); // Set font to bold
        doc.setFontSize(10);
        doc.text(`A/C :`, labelsX, labelsY + 8.5); // Draw bold label
        doc.setFont("verdana-regular", "normal"); // Reset font to normal
        doc.setFontSize(10);
        doc.text(`${status}`, labelsX + 20, labelsY + 8.5); // Draw the value next to the label

        if (searchQuery) {
          doc.setFont("verdana", "bold"); // Set font to bold
          doc.setFontSize(10);
          doc.text(`Search :`, labelsX + 100, labelsY + 8.5); // Draw bold label
          doc.setFont("verdana-regular", "normal"); // Reset font to normal
          doc.setFontSize(10);
          doc.text(`${search}`, labelsX + 120, labelsY + 8.5); // Draw the value next to the label
        }

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
    doc.save(`ReceipeItemList As On ${date}.pdf`);
  };
  ///////////////////////////// DOWNLOAD PDF CODE ////////////////////////////////////////////////////////////

  ///////////////////////////// DOWNLOAD PDF EXCEL //////////////////////////////////////////////////////////

  const handleDownloadCSV = async () => {
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet("Sheet1");

    const numColumns = 4; // Ensure this matches the actual number of columns
    const columnAlignments = ["center", "left", "center", "right"];

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
      `A${companyRow.number}:${String.fromCharCode(65 + numColumns - 1)}${
        companyRow.number
      }`
    );

    // Store List
    const storeListRow = worksheet.addRow(["Receipe Item List"]);
    storeListRow.eachCell((cell) => {
      cell.font = fontStoreList;
      cell.alignment = { horizontal: "center" };
    });
    worksheet.mergeCells(
      `A${storeListRow.number}:${String.fromCharCode(65 + numColumns - 1)}${
        storeListRow.number
      }`
    );

    // Empty row
    worksheet.addRow([]);

    // Filter data
    let typestatus = Companyselectdatavalue.label
    ? Companyselectdatavalue.label : ''
    
    let typesearch = searchQuery || "";

    const typeAndStoreRow3 = worksheet.addRow(
      searchQuery
        ? ["A/C :", typestatus, "SEARCH :", typesearch]
        : ["A/C :", typestatus, ""]
    );

    typeAndStoreRow3.eachCell((cell, colIndex) => {
      cell.font = {
        name: "CustomFont",
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

    // Headers
    const headers = ["Code", "Description", "UOM", "Qnty"];
    const headerRow = worksheet.addRow(headers);
    headerRow.eachCell((cell) => Object.assign(cell, headerStyle));

    // ✅ Add data rows with alternating light grey background
    tableData.forEach((item, index) => {
      const row = worksheet.addRow([
         item.titmcod,
      item.ttrndsc,
      item.titmuom,
      item.trcpqnt
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
    // Column widths
    [10, 45, 7,12].forEach((width, index) => {
      worksheet.getColumn(index + 1).width = width;
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
      `A${dateTimeRow.number}:${String.fromCharCode(65 + numColumns - 1)}${
        dateTimeRow.number
      }`
    );
    worksheet.mergeCells(
      `A${dateTimeRow1.number}:${String.fromCharCode(65 + numColumns - 1)}${
        dateTimeRow1.number
      }`
    );

    // Save Excel
    const buffer = await workbook.xlsx.writeBuffer();
    const blob = new Blob([buffer], {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    });
    saveAs(blob, `ReceipeItemList As On ${currentDate}.xlsx`);
  };

  const handleSaleKeypress = (event, inputId) => {
    if (event.key === "Enter") {
      const selectedOption = saleSelectRef.current.state.selectValue;
      if (selectedOption && selectedOption.value) {
        setSaleType(selectedOption.value);
      }
      const nextInput = document.getElementById(inputId);
      if (nextInput) {
        nextInput.focus();
        // nextInput.select();
      } else {
        document.getElementById("submitButton").click();
      }
    }
  };

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

  const customStyles1 = (hasError) => ({
    control: (base, state) => ({
      ...base,
      height: "24px",
      minHeight: "unset",
      width: 400,
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
        borderColor: "#3368B5",
        boxShadow: "0 0 0 1px #3368B5",
      },
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
          backgroundColor: "#3368B5",
        },
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
        ? "#3368B5"
        : state.isFocused
        ? "#3368B5"
        : getcolor,
      color: state.isSelected || state.isFocused ? "white" : fontcolor,
      "&:hover": {
        backgroundColor: "#3368B5",
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
      transform: state.selectProps.menuIsOpen
        ? "rotate(180deg)"
        : "rotate(0deg)",
      "&:hover": {
        color: "#3368B5",
      },
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
      },
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
      },
    }),
  });

  ///////////////////////////// DOWNLOAD PDF EXCEL ///////////////////////////////////////////////////////////
  const handleSearchChange = (e) => {
    const value = (e.target.value || "").toUpperCase();
    setSearchQuery(value);

    const filtered = tableData.filter(
      (item) =>
        item.ttrndsc?.toUpperCase().includes(value) || // description
        item.titmcod?.toString().includes(value) // item code
    );

    setFilteredData(filtered);
  };

  useEffect(() => {
    if (supplierList.length > 0) {
      setIsOptionsLoaded(true);
    }
  }, [supplierList]);
  useEffect(() => {
    if (
      isOptionsLoaded &&
      options.length > 0 &&
      !saleType &&
      !hasInitialized.current
    ) {
      const firstOption = options[0];
      setSaleType(firstOption.value);

      const fullLabel = firstOption.label;
      const description = fullLabel.split("-").pop()?.trim();

      setCompanyselectdatavalue({
        value: firstOption.value,
        label: description,
        fullLabel: fullLabel,
      });

      // Mark as initialized
      hasInitialized.current = true;
    }
  }, [isOptionsLoaded, options, saleType]);

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

  const [columns, setColumns] = useState({
    Code: [],
    ttrndsc: [],
    Status: [],
  });
  const [columnSortOrders, setColumnSortOrders] = useState({
    Code: "",
    ttrndsc: "",
    Status: "",
  });

  // When you receive your initial table data, transform it into column-oriented format
  useEffect(() => {
    if (tableData.length > 0) {
      const newColumns = {
        Code: tableData.map((row) => row.Code),
        ttrndsc: tableData.map((row) => row.ttrndsc),
        Status: tableData.map((row) => row.Status),
      };
      setColumns(newColumns);
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

  const resetSorting = () => {
    setColumnSortOrders({
      Code: null,
      ttrndsc: null,
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
  const renderTableData = () => {
    return (
      <>
        {isLoading ? (
          <>
            <tr style={{ backgroundColor: getcolor }}>
              <td colSpan="4" className="text-center">
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
                {Array.from({ length: 4 }).map((_, colIndex) => (
                  <td key={`blank-${rowIndex}-${colIndex}`}>&nbsp;</td>
                ))}
              </tr>
            ))}
            <tr>
              <td style={firstColWidth}></td>
              <td style={secondColWidth}></td>
              <td style={thirdColWidth}></td>
              <td style={forthColWidth}></td>
            </tr>
          </>
        ) : (
          <>
            {filteredData.map((item, i) => {
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
                    {item.titmcod}
                  </td>
                  <td className="text-start" style={secondColWidth}>
                    {item.ttrndsc}
                  </td>
                  <td className="text-center" style={thirdColWidth}>
                    {item.titmuom}
                  </td>
                  <td className="text-end" style={forthColWidth}>
                    {item.trcpqnt}
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
                {Array.from({ length: 4 }).map((_, colIndex) => (
                  <td key={`blank-${rowIndex}-${colIndex}`}>&nbsp;</td>
                ))}
              </tr>
            ))}
            <tr>
              <td style={firstColWidth}></td>
              <td style={secondColWidth}></td>
              <td style={thirdColWidth}></td>
              <td style={forthColWidth}></td>
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
    { preventDefault: true, enableOnFormTags: true }
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

  const firstColWidth = { width: "55px" };
  const secondColWidth = { width: "300px" };
  const thirdColWidth = { width: "45px" };
  const forthColWidth = { width: "60px" };

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
    maxWidth: "700px",
    height: "calc(100vh - 100px)",
    position: "absolute",
    top: "70px",
    left: isSidebarVisible ? "60vw" : "50vw",
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

  const formatValue = (val) => {
    return Number(val) === 0 ? "" : val;
  };

  return (
    <>
      <div style={contentStyle}>
        <div
          style={{
            backgroundColor: getcolor,
            color: fontcolor,
            // width: "100%",
            border: `1px solid ${fontcolor}`,
            borderRadius: "9px",
          }}
        >
          <NavComponent textdata="Receipe Item List" />

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
                className="d-flex align-items-center  "
                style={{ marginRight: "1px" }}
              >
                <div
                  style={{
                    width: "60px",
                    display: "flex",
                    justifyContent: "end",
                  }}
                >
                  <label htmlFor="fromDatePicker">
                    <span
                      style={{
                        fontSize: getdatafontsize,
                        fontFamily: getfontstyle,
                        fontWeight: "bold",
                      }}
                    >
                      A/C :
                    </span>{" "}
                    <br />
                  </label>
                </div>
                <div style={{ marginLeft: "5px" }}>
                  <Select
                    className="List-select-class"
                    ref={saleSelectRef}
                    options={options}
                    value={
                      options.find((opt) => opt.value === saleType) || null
                    } // Ensure correct reference
                    onKeyDown={(e) => handleSaleKeypress(e, "searchsubmit")}
                    id="selectedsale"
                    onChange={(selectedOption) => {
                    if (selectedOption && selectedOption.value) {
                        const labelPart = selectedOption.label.split("-")[1];
                        setSaleType(selectedOption.value);
                        setCompanyselectdatavalue({
                          value: selectedOption.value,
                          label: labelPart, // Keep only the description
                        });
                      } else {
                        setSaleType("");
                        setCompanyselectdatavalue("");
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
                      ...customStyles1(!saleType),
                      placeholder: (base) => ({
                        ...base,
                        textAlign: "left",
                        marginLeft: "0",
                        justifyContent: "flex-start",
                        color: fontcolor,
                        marginTop: "-5px",
                      }),
                    }}
                    // isClearable
                    // placeholder="ALL"
                  />
                </div>
              </div>

           
            </div>
          </div>

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
             

              <div id="lastDiv" style={{ marginRight: "8px" }}>
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
                      width: "180px",
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
                    // onChange={(e) =>
                    //   setSearchQuery((e.target.value || "").toUpperCase())
                    // }
                    onChange={handleSearchChange}
                  />
                  {searchQuery && (
                    <span
                      //   onClick={() => setSearchQuery("")}
                      onClick={() => {
                        setSearchQuery("");
                        setFilteredData(tableData);
                      }}
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
                // width: "98.8%",
              }}
            >
              <table
                className="myTable"
                id="table"
                style={{
                  fontSize: getdatafontsize,
                  fontFamily: getfontstyle,
                  // width: "98%",
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
                      //   onClick={() => handleSorting("Code")}
                    >
                      Code
                      {/* {" "}
                      <i
                        className="fa-solid fa-caret-down caretIconStyle"
                        style={getIconStyle("Code")}
                      ></i> */}
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
                      //   onClick={() => handleSorting("Status")}
                    >
                      UOM
                      {/* {" "}
                      <i
                        className="fa-solid fa-caret-down caretIconStyle"
                        style={getIconStyle("Status")}
                      ></i> */}
                    </td>

                    <td className="border-dark" style={forthColWidth}>
                      Qnty
                    </td>

                    <td className="border-dark" style={sixthcol}></td>
                  </tr>
                </thead>
              </table>
            </div>
            {/* <div
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
                  fontSize: "12px",
                  width: "100%",
                  position: "relative",
                  fontSize: getdatafontsize,
                  fontFamily: getfontstyle,
                }}
              >
                <tbody id="tablebody">
                  {renderTableData()}
                </tbody>
              </table>
            </div> */}

            <div
              className="table-scroll"
              style={{
                // maxHeight: "370px",
                "--scrollbar-track-color": getcolor,
                backgroundColor: textColor,
                // '--selected-bg-color': getnavbarbackgroundcolor,
                borderBottom: `1px solid ${fontcolor}`,
                overflowY: "auto",
                maxHeight: "50vh",
                wordBreak: "break-word",
              }}
            >
              <table
                className="myTable"
                id="tableBody"
                style={{
                  fontSize: getdatafontsize,
                  fontFamily: getfontstyle,
                  // width: "98%",
                  tableLayout: "fixed", // FIXED!
                  overflowY: "scroll",
                }}
              >
                <tbody id="tablebody" style={{ overflowY: "scroll" }}>
                  {renderTableData()}
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
              // width: "101.2%",
            }}
          >
            <div
              style={{
                ...firstColWidth,
                background: getcolor,
                borderRight: `1px solid ${fontcolor}`,
              }}
            >
              <span className="mobileledger_total2">
                {formatValue(tableData.length.toLocaleString())}
              </span>
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
            ></div>
            <div
              style={{
                ...forthColWidth,
                background: getcolor,
                borderRight: `1px solid ${fontcolor}`,
              }}
            ></div>
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
    </>
  );
}
