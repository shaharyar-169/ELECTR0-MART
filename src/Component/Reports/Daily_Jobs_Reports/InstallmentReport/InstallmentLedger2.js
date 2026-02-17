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
import "../../../vardana/vardana";
import "../../../vardana/verdana-bold";

export default function InstallmentLedger2() {
  const saleSelectRef = useRef(null);
  const input1Ref = useRef(null);
  const input2Ref = useRef(null);
  const input3Ref = useRef(null);
  const navigate = useNavigate();
  const toRef = useRef(null);
  const fromRef = useRef(null);

  const [CashBookSummaryData, setCashBookSummaryData] = useState([]);
  const [CashPaymentData, setCashPaymentData] = useState([]);
  const [Companyselectdatavalue, setCompanyselectdatavalue] = useState("");
  const [isItemInitialized, setIsItemInitialized] = useState(false);
  const [isCodeReady, setIsCodeReady] = useState(false);
  const [isDoubleClickOpen, setIsDoubleClickOpen] = useState(false);
  const [saleType, setSaleType] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [transectionType, settransectionType] = useState("");
  const [supplierList, setSupplierList] = useState([]);

  const [totalQnty, setTotalQnty] = useState(0);
  const [totalDebit, setTotalDebit] = useState(0);
  const [totalCredit, setTotalCredit] = useState(0);
  const [closingBalance, setClosingBalance] = useState(0);

  // state for from DatePicker
  const [selectedfromDate, setSelectedfromDate] = useState(null);
  const [fromInputDate, setfromInputDate] = useState("");
  const [fromCalendarOpen, setfromCalendarOpen] = useState(false);
  // state for To DatePicker
  const [selectedToDate, setSelectedToDate] = useState(null);
  const [toInputDate, settoInputDate] = useState("");
  const [toCalendarOpen, settoCalendarOpen] = useState(false);

  //////////////////////// CUSTOM DATE LIMITS ////////////////////////////

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
    getnavbarbackgroundcolor,
  } = useTheme();

  console.log("select year: " + getyeardescription);

  const yeardescription = getYearDescription();
  const locationnumber = getLocationnumber();

  useEffect(() => {
    document.documentElement.style.setProperty("--background-color", getcolor);
  }, [getcolor]);

  // Assume getfromdate and gettodate are dynamic and fetched from context or state
  const fromdatevalidate = getfromdate; // e.g., "01-01-2023"
  const todatevaliadete = gettodate; // e.g., "31-12-2023"

  // Function to convert "DD-MM-YYYY" string to Date object
  const convertToDate = (dateString) => {
    const [day, month, year] = dateString.split("-"); // Split string into day, month, year
    return new Date(year, month - 1, day); // Create Date object (Month is zero-indexed)
  };

  // Convert dynamic date strings to Date objects
  const GlobalfromDate = convertToDate(fromdatevalidate); // "01-01-2023" -> Date object
  const GlobaltoDate = convertToDate(todatevaliadete); // "31-12-2023" -> Date object

  // If you want to format the Date object back to 'DD-MM-YYYY' format (optional)
  const formatDate1 = (date) => {
    return `${String(date.getDate()).padStart(2, "0")}-${String(
      date.getMonth() + 1,
    ).padStart(2, "0")}-${date.getFullYear()}`;
  };

  // Optionally format the Date objects back to string if needed
  const GlobalfromDate1 = formatDate1(GlobalfromDate); // '01-01-2023'
  const GlobaltoDate1 = formatDate1(GlobaltoDate); // '31-12-2023'

  //////////////////////// CUSTOM DATE LIMITS ////////////////////////////

  // Toggle the ToDATE && FromDATE CalendarOpen state on each click

  const formatDate = (date) => {
    const day = date.getDate().toString().padStart(2, "0");
    const month = (date.getMonth() + 1).toString().padStart(2, "0");
    const year = date.getFullYear();
    return `${day}-${month}-${year}`;
  };

  function closeAlert(errorType) {
    const alertElement = document.getElementById("someElementId");
    alertElement.innerHTML = ""; // Clears the alert content
    // if (errorType === 'saleType') {
    //     saleSelectRef.current.focus();
    // }
    if (errorType === "formvalidation") {
      fromRef.current.select();
    }
    if (errorType === "todatevalidation") {
      toRef.current.select();
    }
  }
  // Bind to window
  window.closeAlert = closeAlert;

  function fetchGeneralLedger() {
    const apiUrl = apiLinks + "/InstallmentLedger.php";
    setIsLoading(true);

    const formData = new URLSearchParams({
      code: "MTSELEC",
      FLocCod: "002",
      // code: organisation.code,
      // FLocCod: locationnumber || getLocationNumber,
      FInsCod: saleType,
    }).toString();

    axios
      .post(apiUrl, formData)
      .then((response) => {
        setIsLoading(false);

        // Store Profit and Expense data into separate states
        if (response.data) {
          if (Array.isArray(response.data.Detail)) {
            setTableData(response.data.Detail); // Store Profit array in profits state
          } else {
            console.warn(
              "Response data 'Profit' is not an array:",
              response.data.Detail,
            );
            setTableData([]); // Fallback to an empty array
          }

          if (response.data.Header) {
            setheaderData(response.data.Header); // Store Expense array in expenses state
          } else {
            console.warn(
              "Response data 'Expense' is not an array:",
              response.data.Header,
            );
            setheaderData([]); // Fallback to an empty array
          }
        } else {
          console.warn("Response data is null or undefined:", response.data);
          setTableData([]);
          setheaderData([]);
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
    // If it hasn't mounted before or on refresh, select the 'from date' input
    if (
      !hasComponentMountedPreviously ||
      (saleSelectRef && saleSelectRef.current)
    ) {
      if (saleSelectRef && saleSelectRef.current) {
        setTimeout(() => {
          saleSelectRef.current.focus(); // Focus on the input field
          // saleSelectRef.current.select(); // Select the text within the input field
        }, 0);
      }
      sessionStorage.setItem("componentMounted", "true"); // Set the flag indicating mount
      // const storedData = localStorage.getItem('globaldata');

      // if (storedData) {
      //     // Parse the JSON string back to an object
      //     const parsedData = JSON.parse(storedData);
      //     setApiData(parsedData);
      // }
    }
  }, []);

  useEffect(() => {
    const currentDate = new Date();
    setSelectedToDate(currentDate);
    settoInputDate(formatDate(currentDate));

    const firstDateOfCurrentMonth = new Date(
      currentDate.getFullYear(),
      currentDate.getMonth(),
      1,
    );
    setSelectedfromDate(firstDateOfCurrentMonth);
    setfromInputDate(formatDate(firstDateOfCurrentMonth));
  }, []);

  useEffect(() => {
    const apiUrl = apiLinks + "/GetActiveCustomers.php";
    const formData = new URLSearchParams({
      // code: organisation.code,
      // FLocCod: locationnumber || getLocationNumber,
      FLocCod: "002",
      code: "MTSELEC",
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

  // Transforming fetched data into options array
  const options = supplierList.map((item) => ({
    value: item.tcstcod,
    label: `${item.tcstcod}-${item.tcstnam.trim()}`,
  }));

  useEffect(() => {
    if (options.length === 0) return;
    if (isItemInitialized) return;

    const storedData = sessionStorage.getItem("InstallmentLedger");
    let selectedOption = null;

    if (storedData) {
      const parsedData = JSON.parse(storedData);
      const clickedCode = parsedData.code?.trim();
      if (parsedData.code) {
        setIsDoubleClickOpen(true); // ✅ ADD
      }
      selectedOption = options.find((opt) => opt.value?.trim() === clickedCode);

      sessionStorage.removeItem("InstallmentLedger");
    }

    if (!selectedOption) {
      selectedOption = options[0];
    }

    if (selectedOption) {
      setSaleType(selectedOption.value);

      const description = selectedOption.label
        .split("-")
        .slice(1)
        .join("-")
        .trim();

      setCompanyselectdatavalue({
        value: selectedOption.value,
        label: description,
      });

      setIsCodeReady(true); // ✅ IMPORTANT
    }

    setIsItemInitialized(true);
  }, [options, isItemInitialized]);

  useEffect(() => {
    // 🔥 Dono cheezain ready hon
    if (isDoubleClickOpen && isCodeReady) {
      fetchGeneralLedger();
    }
  }, [isDoubleClickOpen, isCodeReady]);

  const DropdownOption = (props) => {
    return (
      <components.Option {...props}>
        <div
          style={{
            fontSize: getdatafontsize,
            fontFamily: getfontstyle,
            paddingBottom: "5px",
            lineHeight: "2px",
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
      height: "20px",
      minHeight: "unset",
      width: 350,
      marginLeft: "5px",
      fontSize: getdatafontsize,
      fontFamily: getfontstyle,
      backgroundColor: getcolor,
      color: fontcolor,
      caretColor: getcolor === "white" ? "black" : "white",
      borderRadius: 0,
      //   border: `1px solid ${fontcolor}`,
      border: `1px solid grey`,
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

    valueContainer: (base) => ({
      ...base,
      padding: "0 6px",
      height: "100%",
      display: "flex",
      alignItems: "center",
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
      "&:hover": { color: "#3368B5" },
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
      "&:hover": { color: "#ff4444" },
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

  const formatValue = (val) => {
    return Number(val) === 0 ? "" : val;
  };

  ///////////////////////////// DOWNLOAD PDF CODE ////////////////////////////////////////////////////////////
  const exportPDFHandler = () => {
    // Create a new jsPDF instance with landscape orientation
    const doc = new jsPDF({ orientation: "landscape" });

    // Define table data (rows)
    const rows = tableData.map((item) => [
      item.Date,
      item["Trn#"],
      item.Type,
      item.Description,
      formatValue(item.Sale),
      formatValue(item.Collection),
      formatValue(item.Balance),
    ]);

       // Define table column headers and individual column widths

    const headers = [
      "Date",
      "Trn#",
      "Type",
      "Description",
      "Sale",
      "Collection",
      "Balance",
    ];
    const columnWidths = [25, 20, 17, 110, 25, 25, 25];

    // Calculate total table width
    const totalWidth = columnWidths.reduce((acc, width) => acc + width, 0);

    // Define page height and padding
    const pageHeight = doc.internal.pageSize.height;
    const paddingTop = 15;

const drawFormHeader = (doc, startY) => {
  const pageWidth = doc.internal.pageSize.width;
  const formWidth = 300;
  const startX = (pageWidth - formWidth) / 2;

  // Left column (for A/C, Name, Address, Profession)
  const leftX = startX;

  // Right column (Sale Date, Sale Amt, Rent Amt, Balance, Ins Num)
  const rightX = startX + formWidth / 2; // shift more to right

  // Middle-right / third column (Ins Amt, center between officeContact and right)
  const thirdColX = rightX + 60; // adjust width so Ins Amt aligns in middle

  const centerFieldWidth = 50;
  const rightFieldWidth = 50;
  const labelWidth = 28;
  const fieldHeight = 6;
  const gapY = 2;

  doc.setFont("verdana-regular", "normal");
  doc.setFontSize(10);

  const drawField = (label, value, x, y, fieldWidth, alignRight = false, valueColor = [0, 0, 0]) => {
    const fieldX = x + labelWidth + 2;

    if (label) doc.text(`${label} :`, x + labelWidth, y + 4, { align: "right" });
    doc.rect(fieldX, y, fieldWidth, fieldHeight);

    if (value) {
      doc.setTextColor(...valueColor);
      doc.text(
        String(value),
        alignRight ? fieldX + fieldWidth - 2 : fieldX + 2,
        y + 4,
        { align: alignRight ? "right" : "left" }
      );
    }
    doc.setTextColor(0, 0, 0);
  };

  let y = startY;

  // ───────────── ROW 1 ─────────────
  drawField("A/C", "14-01-0001-ADIL MASIH", leftX, y, 90);
  drawField("Sale Date", "", rightX, y, 50, true);
  y += fieldHeight + gapY;

  // ───────────── ROW 2 ─────────────
  drawField("Name", "AFTAB AHMAD ( AFTAB AHMAD )", leftX, y, 90);
  drawField("Sale Amt", "", rightX, y, 50, true);
  y += fieldHeight + gapY;

  // ───────────── ROW 3 ─────────────
  drawField("Address", "", leftX, y, 90);
  drawField("Rent Amt", "", rightX, y, 50, true);
  y += fieldHeight + gapY;

  // ───────────── ROW 4 ─────────────
  drawField("", "", leftX, y, 90);
  drawField("Total Amount", "", rightX, y, 50, true);
  y += fieldHeight + gapY;

  // ───────────── ROW 5 ─────────────
  drawField("Sales Man", "AFTAB AHMAD", leftX, y, 90);
  drawField("Balance", "", rightX, y, 50, true, [255, 0, 0]);
  y += fieldHeight + gapY;

  // ───────────── ROW 6 ─────────────
  drawField("Collector", "ZUBAIR", leftX, y, 90);
  drawField("PrmDate", "", rightX, y, 50, true);
  y += fieldHeight + gapY;

  // ───────────── ROW 7 ─────────────
  drawField("Verify By", "", leftX, y, 90);
  drawField("Ins Num", "", rightX, y, 50, true); // stay under Balance
  y += fieldHeight + gapY;

  // ───────────── PARTIAL LINE ─────────────
  doc.setLineWidth(0.4);
  doc.line(startX, y + 4, rightX + 50, y + 4); // line ends at Ins Num
  y += 8;

  // ───────────── PROFESSION / OFFICE CONTACT / INS AMT ─────────────
  drawField("Profession", "", leftX, y, 90); // left
  drawField("officeContact", "", rightX + 10, y, centerFieldWidth); // center between Prof & Ins Amt
  drawField("Ins Amt", "", thirdColX, y, rightFieldWidth, true); // Ins Amt aligned in middle-right
  y += fieldHeight + gapY;

  drawField("OfficeAdd1", "", leftX, y, 90);
  y += fieldHeight + gapY;

  drawField("officeAdd2", "", leftX, y, 90);
  y += fieldHeight + gapY;

  // ───────────── FINAL LINE ─────────────
  doc.setLineWidth(0.4);
  doc.line(startX, y + 4, startX + formWidth, y + 4);

  return y + 10;
};


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

      doc.setFontSize(11);

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

        doc.setLineWidth(0.2);
        doc.rect(
          startX,
          startY + (i - startIndex + 2) * rowHeight,
          tableWidth,
          rowHeight,
        );

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

          if (cellIndex === 0 || cellIndex === 1 || cellIndex === 2) {
            const rightAlignX = startX + columnWidths[cellIndex] / 2;
            doc.text(cellValue, rightAlignX, cellY, {
              align: "center",
              baseline: "middle",
            });
          } else if (cellIndex === 4 || cellIndex === 5 || cellIndex === 6) {
            const rightAlignX = startX + columnWidths[cellIndex] - 2;
            doc.text(cellValue, rightAlignX, cellY, {
              align: "right",
              baseline: "middle",
            });
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
        pageNumberFontSize = 10,
      ) => {
        doc.setFontSize(titleFontSize); // Set the font size for the title
        doc.text(title, doc.internal.pageSize.width / 2, startY, {
          align: "center",
        });

        // Calculate the x-coordinate for the right corner
        const rightX = doc.internal.pageSize.width - 10;

               // Add page numbering
        doc.setFontSize(pageNumberFontSize);
        doc.text(
          `Page ${pageNumber}`,
          rightX - 5,
          doc.internal.pageSize.height - 10,
          { align: "right" },
        );
      };

      let currentPageIndex = 0;
      let startY = paddingTop; // Initialize startY
      let pageNumber = 1; // Initialize page number

      // while (currentPageIndex * rowsPerPage < rows.length) {
      //   doc.setFontSize(10);
      //   doc.setFont("helvetica", "300");
      //   addTitle(comapnyname, 12, 12, pageNumber, startY, 18); // Render company title with default font size, only date, and page number
      //   startY += 5; // Adjust vertical position for the company title

      //   doc.setFont("verdana-regular", "normal");
      //   doc.setFontSize(10);
      //   addTitle(
      //     `Installment Ledger Report From ${fromInputDate} To ${toInputDate}`,
      //     "",
      //     "",
      //     pageNumber,
      //     startY,
      //     12,
      //   ); // Render sale report title with decreased font size, provide the time, and page number
      //   startY += 5;
      //   startY += 1; // Adjust vertical position for the labels

      //   addTableHeaders((doc.internal.pageSize.width - totalWidth) / 2, 30);
      //   const startIndex = currentPageIndex * rowsPerPage;
      //   const endIndex = Math.min(startIndex + rowsPerPage, rows.length);
      //   startY = addTableRows(
      //     (doc.internal.pageSize.width - totalWidth) / 2,
      //     startY,
      //     startIndex,
      //     endIndex,
      //   );
      //   if (endIndex < rows.length) {
      //     startY = addNewPage(startY); // Add new page and update startY
      //     pageNumber++; // Increment page number
      //   }
      //   currentPageIndex++;
      // }

      while (currentPageIndex * rowsPerPage < rows.length) {
  doc.setFontSize(10);
  doc.setFont("helvetica", "300");

  // Company Name
  addTitle(comapnyname, 12, 12, pageNumber, startY, 18);
  startY += 5;

  // Report Title
  doc.setFont("verdana-regular", "normal");
  doc.setFontSize(10);

  addTitle(
    `Installment Ledger Report From ${fromInputDate} To ${toInputDate}`,
    "",
    "",
    pageNumber,
    startY,
    12
  );

  startY += 8;

  // 🟢 1️⃣ DRAW FORM HEADER (YOUR IMAGE LAYOUT)
  let currentY = drawFormHeader(doc, startY);

  // 🟢 2️⃣ TABLE HEADERS BELOW FORM
  addTableHeaders(
    (doc.internal.pageSize.width - totalWidth) / 2,
    currentY
  );

  const startIndex = currentPageIndex * rowsPerPage;
  const endIndex = Math.min(startIndex + rowsPerPage, rows.length);

  // 🟢 3️⃣ TABLE ROWS
  startY = addTableRows(
    (doc.internal.pageSize.width - totalWidth) / 2,
    currentY,
    startIndex,
    endIndex
  );

  if (endIndex < rows.length) {
    startY = addNewPage(startY);
    pageNumber++;
  }

  currentPageIndex++;
}

    };

    const getCurrentDate = () => {
      const today = new Date();
      const dd = String(today.getDate()).padStart(2, "0");
      const mm = String(today.getMonth() + 1).padStart(2, "0");
      const yyyy = today.getFullYear();
      return `${dd}-${mm}-${yyyy}`;
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
    doc.save(`InstallmentLedgerReport As On ${date}.pdf`);
  };


  const handleDownloadCSV = async () => {
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet("Sheet1");

    const numColumns = 7; // Ensure this matches the actual number of columns

    const columnAlignments = [
      "center",
      "center",
      "center",
      "left",
      "right",
      "right",
      "right",
    ];

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
    // Add company name
    const companyRow = worksheet.addRow([comapnyname]);

    companyRow.eachCell((cell) => {
      cell.font = {
        name: "Times New Roman",
        size: 16, // optional
        bold: true, // optional
      };
      cell.alignment = { horizontal: "center" };
    });

    worksheet.getRow(companyRow.number).height = 30;
    worksheet.mergeCells(
      `A${companyRow.number}:${String.fromCharCode(65 + numColumns - 1)}${
        companyRow.number
      }`,
    );

    // Add Store List row
    const storeListRow = worksheet.addRow([`Installment Ledger Report`]);
    storeListRow.eachCell((cell) => {
      cell.font = fontStoreList;
      cell.alignment = { horizontal: "center" };
    });

    worksheet.mergeCells(
      `A${storeListRow.number}:${String.fromCharCode(65 + numColumns - 1)}${
        storeListRow.number
      }`,
    );

    // Add an empty row after the title section
    worksheet.addRow([]);

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
    const headers = [
      "Date",
      "Trn#",
      "Type",
      "Description",
      "Sale",
      "Collection",
      "Balance",
    ];
    const headerRow = worksheet.addRow(headers);
    headerRow.eachCell((cell) => Object.assign(cell, headerStyle));

    // Add data rows
    tableData.forEach((item) => {
      const row = worksheet.addRow([
        item.Date,
        item["Trn#"],
        item.Type,
        item.Description,
        formatValue(item.Sale),
        formatValue(item.Collection),
        formatValue(item.Balance),
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
      });
    });

    // Set column widths
    [10, 8, 7, 45, 12, 12, 12].forEach((width, index) => {
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
    const dateTimeRow = worksheet.addRow([
      `DATE:   ${currentdate}  TIME:   ${currentTime}`,
    ]);
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
      `A${dateTimeRow.number}:${String.fromCharCode(65 + numColumns - 1)}${
        dateTimeRow.number
      }`,
    );
    worksheet.mergeCells(
      `A${dateTimeRow1.number}:${String.fromCharCode(65 + numColumns - 1)}${
        dateTimeRow1.number
      }`,
    );

    // Generate and save the Excel file
    const buffer = await workbook.xlsx.writeBuffer();
    const blob = new Blob([buffer], {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    });
    saveAs(blob, `InstallmentLedgerReport As On ${currentdate}.xlsx`);
  };
  ///////////////////////////// DOWNLOAD PDF EXCEL ///////////////////////////////////////////////////////////
  useHotkeys(
    "alt+s",
    () => {
      fetchGeneralLedger();
      // resetSorting();
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
  ///////////////////////////////////////////////////////////////////////////

  const dispatch = useDispatch();
  const user = getUserData();
  const organisation = getOrganisationData();
  const tableTopColor = "#3368B5";
  const tableHeadColor = "#3368b5";
  const secondaryColor = "white";
  const btnColor = "#3368B5";
  const textColor = "white";

  const [tableData, setTableData] = useState([]);
  const [headerData, setheaderData] = useState([]);

  console.log("HAJVARY TbaleDate", tableData);
  console.log("HAJVARY HeaderData", headerData);

  const [selectedSearch, setSelectedSearch] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { data, loading, error } = useSelector((state) => state.getuser);

  const comapnyname = organisation.description;

  const handleSearch = (e) => {
    setSelectedSearch(e.target.value);
  };

  let totalEntries = 0;

  const getFilteredTableData = () => {
    let filteredData = tableData;

    if (selectedSearch.trim() !== "") {
      const query = selectedSearch.trim().toLowerCase();
      filteredData = filteredData.filter(
        (data) => data.tusrnam && data.tusrnam.toLowerCase().includes(query),
      );
    }

    return filteredData;
  };

  const firstColWidth = {
    width: "80px",
  };
  const secondColWidth = {
    width: "60px",
  };
  const thirdColWidth = {
    width: "50px",
  };
  const forthColWidth = {
    width: "500px",
  };
  const fifthColWidth = {
    width: "100px",
  };
  const sixthColWidth = {
    width: "100px",
  };
  const seventhColWidth = {
    width: "100px",
  };
  const sixthcol = {
    width: "8px",
  };

  // Adjust the content width based on sidebar state
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
    maxWidth: "900px",
    height: "calc(100vh - 100px)",
    position: "absolute",
    top: "70px",
    left: isSidebarVisible ? "60vw" : "50vw",
    transform: "translateX(-50%)",
    display: "flex",
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "start",
    overflowX: "hidden",
    // overflowY: "hidden",
    wordBreak: "break-word",
    textAlign: "center",
    maxWidth: "1000px",
    fontSize: "15px",
    fontStyle: "normal",
    fontWeight: "400",
    lineHeight: "23px",
    fontFamily: '"Poppins", sans-serif',
  };

  ////////////////////////////////////////// ROW HIGHLIGHT CODE ////////////////////////////////////

  const [isFilterApplied, setIsFilterApplied] = useState(false);
  useEffect(() => {
    if (isFilterApplied || tableData.length > 0) {
      setSelectedIndex(0); // Set the selected index to the first row
      rowRefs.current[0]?.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    } else {
      setSelectedIndex(-1); // Reset selected index if no filter applied or filtered data is empty
    }
  }, [tableData, isFilterApplied]);

  let totalEnteries = 0;
  const [selectedRowId, setSelectedRowId] = useState(null); // Track the selected row's tctgcod

  // state initialize for table row highlight
  const [selectedIndex, setSelectedIndex] = useState(-1); // Initialize selectedIndex state
  const rowRefs = useRef([]); // Array of refs for rows
  const handleRowClick = (index) => {
    setSelectedIndex(index);
    // setSelectedRowId(getFilteredTableData[index].tcmpdsc); // Save the selected row's tctgcod
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
    if (selectedIndex === -1 || e.target.id === "searchInput") return; // Return if no row is selected or target is search input
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

    // Cleanup event listener on component unmount
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [selectedIndex]); // Add selectedIndex as a dependency
  useEffect(() => {
    // Scroll the selected row into view
    if (selectedIndex !== -1 && rowRefs.current[selectedIndex]) {
      rowRefs.current[selectedIndex].scrollIntoView({
        behavior: "smooth",
        block: "nearest",
      });
    }
  }, [selectedIndex]); // Add selectedIndex as a dependency
  //////////////////////////////////////////// ROW HIGHLIGHT CODE //////////////////////////////////////

  return (
    <>
      {/* <div id="someElementId"></div> */}
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
          <NavComponent textdata="Installment Ledger Report" />

          {/* TOP HEADER SECTIO SECTION */}
          <div
            className="row "
            style={{
              display: "flex",
              //   flexWrap: "wrap",
              height: "220px",
              marginTop: "5px",
              marginBottom: "2px",
              marginRight: "2px",
            }}
          >
            {/* FIRST SECTION OF HEADER */}
            <div
              className="row"
              style={{
                height: "100%",
                width: "100%",
                margin: "0px",
                padding: "0px",
              }}
            >
              {/* LEFT PART OF THE HEADER FIRST SECTION  */}
              <div
                className="col-md-10"
                style={{ height: "20px", padding: "0px" }}
              >
                <div
                  className="row"
                  style={{
                    height: "100%",
                    width: "100%",
                    margin: "0px",
                    marginTop: "2px",
                  }}
                >
                  <div
                    className="col-md-8"
                    style={{ height: "100%", display: "flex", padding: "0px" }}
                  >
                    <div
                      style={{
                        height: "100%",
                        width: "98px",
                        display: "flex",
                        justifyContent: "end",
                        alignItems: "center",
                        fontSize: "12px",
                        fontWeight: "bold",
                        color: fontcolor,
                      }}
                    >
                      A/C :
                    </div>

                    <div>
                      <Select
                        className="List-select-class"
                        ref={saleSelectRef}
                        options={options}
                        value={
                          options.find((opt) => opt.value === saleType) || null
                        }
                        isDisabled={isDoubleClickOpen}
                        onKeyDown={(e) => handleSaleKeypress(e, "searchsubmit")}
                        id="selectedsale"
                        onChange={(selectedOption) => {
                          if (selectedOption && selectedOption.value) {
                            const labelParts = selectedOption.label.split("-"); // Split by "-"
                            const description = labelParts.slice(3).join("-"); // Remove the first 3 parts

                            setSaleType(selectedOption.value);
                            setCompanyselectdatavalue({
                              value: selectedOption.value,
                              label: description, // Keep only the description
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
                        isClearable
                        placeholder="ALL"
                      />
                    </div>
                  </div>
                  <div
                    className="col-md-4"
                    style={{ height: "100%", display: "flex", padding: "0px" }}
                  >
                    <div
                      style={{
                        width: "147px",
                        height: "100%",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "end",
                        fontSize: "12px",
                        fontWeight: "bold",
                      }}
                    >
                      Sale Date :
                    </div>
                    <div
                      style={{
                        paddingLeft: "3px",
                        color: fontcolor,
                        fontSize: "12px",
                        height: "100%",
                        backgroundColor: getcolor,
                        width: "132px",
                        marginLeft: "3px",
                        border: "1px solid grey",
                        borderRadius: "0px",
                        display: "flex",
                        justifyContent: "end",
                        alignItems: "center",
                        paddingRight: "5px",
                      }}
                    >
                      {headerData.InvDate}
                    </div>
                  </div>
                </div>

                <div
                  className="row"
                  style={{
                    height: "100%",
                    width: "100%",
                    margin: "0px",
                    marginTop: "2px",
                  }}
                >
                  <div
                    className="col-md-8"
                    style={{ height: "100%", display: "flex", padding: "0px" }}
                  >
                    <div
                      style={{
                        height: "100%",
                        width: "100px",
                        display: "flex",
                        justifyContent: "end",
                        alignItems: "center",
                        fontSize: "12px",
                        fontWeight: "bold",
                        color: fontcolor,
                      }}
                    >
                      Name :
                    </div>
                    <input
                      value={headerData.Name}
                      disabled
                      style={{
                        paddingLeft: "3px",
                        color: fontcolor,
                        fontSize: "12px",
                        height: "100%",
                        backgroundColor: getcolor,
                        width: "293px",
                        marginLeft: "3px",
                        border: "1px solid grey",
                        borderRadius: "0px",
                      }}
                    ></input>
                  </div>
                  <div
                    className="col-md-4"
                    style={{ height: "100%", display: "flex", padding: "0px" }}
                  >
                    <div
                      style={{
                        width: "147px",
                        height: "100%",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "end",
                        fontSize: "12px",
                        fontWeight: "bold",
                      }}
                    >
                      Sale Amt :
                    </div>
                    <div
                      style={{
                        paddingLeft: "3px",
                        color: fontcolor,
                        fontSize: "12px",
                        height: "100%",
                        backgroundColor: getcolor,
                        width: "132px",
                        marginLeft: "3px",
                        border: "1px solid grey",
                        borderRadius: "0px",
                        display: "flex",
                        justifyContent: "end",
                        alignItems: "center",
                        paddingRight: "5px",
                      }}
                    >
                      {headerData.SaleAmt}
                    </div>
                  </div>
                </div>

                <div
                  className="row"
                  style={{
                    height: "100%",
                    width: "100%",
                    margin: "0px",
                    marginTop: "2px",
                  }}
                >
                  <div
                    className="col-md-8"
                    style={{ height: "100%", display: "flex", padding: "0px" }}
                  >
                    <div
                      style={{
                        height: "100%",
                        width: "100px",
                        display: "flex",
                        justifyContent: "end",
                        alignItems: "center",
                        fontSize: "12px",
                        fontWeight: "bold",
                        color: fontcolor,
                      }}
                    >
                      Address :
                    </div>
                    <input
                      value={headerData.Address1}
                      disabled
                      style={{
                        paddingLeft: "3px",
                        color: fontcolor,
                        fontSize: "12px",
                        height: "100%",
                        backgroundColor: getcolor,
                        width: "293px",
                        marginLeft: "3px",
                        border: "1px solid grey",
                        borderRadius: "0px",
                      }}
                    ></input>
                  </div>
                  <div
                    className="col-md-4"
                    style={{ height: "100%", display: "flex", padding: "0px" }}
                  >
                    <div
                      style={{
                        width: "147px",
                        height: "100%",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "end",
                        fontSize: "12px",
                        fontWeight: "bold",
                      }}
                    >
                      Rent Amt :
                    </div>
                    <div
                      style={{
                        paddingLeft: "3px",
                        color: fontcolor,
                        fontSize: "12px",
                        height: "100%",
                        backgroundColor: getcolor,
                        width: "132px",
                        marginLeft: "3px",
                        border: "1px solid grey",
                        borderRadius: "0px",
                        display: "flex",
                        justifyContent: "end",
                        alignItems: "center",
                        paddingRight: "5px",
                      }}
                    >
                      {headerData.RentAmt}
                    </div>
                  </div>
                </div>
                 <div
                  className="row"
                  style={{
                    height: "100%",
                    width: "100%",
                    margin: "0px",
                    marginTop: "2px",
                  }}
                >
                  <div
                    className="col-md-8"
                    style={{ height: "100%", display: "flex", padding: "0px" }}
                  >
                    <div
                      style={{
                        height: "100%",
                        width: "100px",
                        display: "flex",
                        justifyContent: "end",
                        alignItems: "center",
                        fontSize: "12px",
                        fontWeight: "bold",
                        color: fontcolor,
                      }}
                    >
                    
                    </div>
                    <input
                      value={headerData.Name}
                      disabled
                      style={{
                        paddingLeft: "3px",
                        color: fontcolor,
                        fontSize: "12px",
                        height: "100%",
                        backgroundColor: getcolor,
                        width: "293px",
                        marginLeft: "3px",
                        border: "1px solid grey",
                        borderRadius: "0px",
                      }}
                    ></input>
                  </div>
                  <div
                    className="col-md-4"
                    style={{ height: "100%", display: "flex", padding: "0px" }}
                  >
                    <div
                      style={{
                        width: "147px",
                        height: "100%",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "end",
                        fontSize: "12px",
                        fontWeight: "bold",
                      }}
                    >
                      Total Amount :
                    </div>
                    <div
                      style={{
                        paddingLeft: "3px",
                        color: fontcolor,
                        fontSize: "12px",
                        height: "100%",
                        backgroundColor: getcolor,
                        width: "132px",
                        marginLeft: "3px",
                        border: "1px solid grey",
                        borderRadius: "0px",
                        display: "flex",
                        justifyContent: "end",
                        alignItems: "center",
                        paddingRight: "5px",
                      }}
                    >
                      {headerData.TotalAmt}
                    </div>
                  </div>
                </div>
                <div
                  className="row"
                  style={{
                    height: "100%",
                    width: "100%",
                    margin: "0px",
                    marginTop: "1px",
                  }}
                >
                  <div
                    className="col-md-8"
                    style={{ height: "100%", display: "flex", padding: "0px" }}
                  >
                    <div
                      style={{
                        height: "100%",
                        width: "100px",
                        display: "flex",
                        justifyContent: "end",
                        alignItems: "center",
                        fontSize: "12px",
                        fontWeight: "bold",
                        color: fontcolor,
                      }}
                    >
                      Sales Man :
                    </div>
                    <input
                      value={headerData.SalesMan}
                      disabled
                      style={{
                        paddingLeft: "3px",
                        color: fontcolor,
                        fontSize: "12px",
                        height: "100%",
                        backgroundColor: getcolor,
                        width: "293px",
                        marginLeft: "3px",
                        border: "1px solid grey",
                        borderRadius: "0px",
                      }}
                    ></input>
                  </div>
                  <div
                    className="col-md-4"
                    style={{ height: "100%", display: "flex", padding: "0px" }}
                  >
                    <div
                      style={{
                        width: "147px",
                        height: "100%",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "end",
                        fontSize: "12px",
                        fontWeight: "bold",
                      }}
                    >
                      Balance :
                    </div>
                    <div
                      style={{
                        paddingLeft: "3px",
                        color: "red",
                        fontSize: "12px",
                        height: "100%",
                        backgroundColor: getcolor,
                        width: "132px",
                        marginLeft: "3px",
                        border: "1px solid grey",
                        borderRadius: "0px",
                        display: "flex",
                        justifyContent: "end",
                        alignItems: "center",
                        paddingRight: "5px",
                      }}
                    >
                      {(
                        parseFloat(
                          headerData?.TotalAmt?.replace(/,/g, "") || 0,
                        ) -
                        parseFloat(headerData?.Advance?.replace(/,/g, "") || 0)
                      ).toLocaleString()}
                    </div>
                  </div>
                </div>
                <div
                  className="row"
                  style={{
                    height: "100%",
                    width: "100%",
                    margin: "0px",
                    marginTop: "1px",
                  }}
                >
                  <div
                    className="col-md-8"
                    style={{ height: "100%", display: "flex", padding: "0px" }}
                  >
                    <div
                      style={{
                        height: "100%",
                        width: "100px",
                        display: "flex",
                        justifyContent: "end",
                        alignItems: "center",
                        fontSize: "12px",
                        fontWeight: "bold",
                        color: fontcolor,
                      }}
                    >
                      Collector:
                    </div>
                    <input
                      value={headerData.Collector}
                      disabled
                      style={{
                        paddingLeft: "3px",
                        color: fontcolor,
                        fontSize: "12px",
                        height: "100%",
                        backgroundColor: getcolor,
                        width: "293px",
                        marginLeft: "3px",
                        border: "1px solid grey",
                        borderRadius: "0px",
                      }}
                    ></input>
                  </div>
                  <div
                    className="col-md-4"
                    style={{ height: "100%", display: "flex", padding: "0px" }}
                  >
                    <div
                      style={{
                        width: "147px",
                        height: "100%",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "end",
                        fontSize: "12px",
                        fontWeight: "bold",
                      }}
                    >
                      PrmDate :
                    </div>
                    <div
                      style={{
                        paddingLeft: "3px",
                        color: fontcolor,
                        fontSize: "12px",
                        height: "100%",
                        backgroundColor: getcolor,
                        width: "132px",
                        marginLeft: "3px",
                        border: "1px solid grey",
                        borderRadius: "0px",
                        display: "flex",
                        justifyContent: "end",
                        alignItems: "center",
                        paddingRight: "5px",
                      }}
                    >
                      {headerData.PrmDate}
                    </div>
                  </div>
                </div>

                <div
                  className="row"
                  style={{
                    height: "100%",
                    width: "100%",
                    margin: "0px",
                    marginTop: "1px",
                  }}
                >
                  <div
                    className="col-md-8"
                    style={{ height: "100%", display: "flex", padding: "0px" }}
                  >
                    <div
                      style={{
                        height: "100%",
                        width: "100px",
                        display: "flex",
                        justifyContent: "end",
                        alignItems: "center",
                        fontSize: "12px",
                        fontWeight: "bold",
                        color: fontcolor,
                      }}
                    >
                      Verify By :
                    </div>
                    <input
                      value={headerData.verify}
                      disabled
                      style={{
                        paddingLeft: "3px",
                        color: fontcolor,
                        fontSize: "12px",
                        height: "100%",
                        backgroundColor: getcolor,
                        width: "293px",
                        marginLeft: "3px",
                        border: "1px solid grey",
                        borderRadius: "0px",
                      }}
                    ></input>
                  </div>
                  <div
                    className="col-md-4"
                    style={{ height: "100%", display: "flex", padding: "0px" }}
                  >
                    <div
                      style={{
                        width: "147px",
                        height: "100%",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "end",
                        fontSize: "12px",
                        fontWeight: "bold",
                      }}
                    >
                      Ins Num :
                    </div>
                    <div
                      style={{
                        paddingLeft: "3px",
                        color: fontcolor,
                        fontSize: "12px",
                        height: "100%",
                        backgroundColor: getcolor,
                        width: "132px",
                        marginLeft: "3px",
                        border: "1px solid grey",
                        borderRadius: "0px",
                        display: "flex",
                        justifyContent: "end",
                        alignItems: "center",
                        paddingRight: "5px",
                      }}
                    >
                      {headerData.InsNum}
                    </div>
                  </div>
                </div>
                <div
                  style={{
                    width: "75%",
                    border: "1px solid grey",
                    margin: "2px 0px",
                  }}
                ></div>

                <div
                  className="row"
                  style={{
                    height: "100%",
                    width: "100%",
                    margin: "0px",
                    marginTop: "1px",
                    display: "flex",
                    justifyContent: "space-between",
                  }}
                >
                  <div
                    // className="col-md-6"
                    style={{
                      width: "50%",
                      height: "100%",
                      display: "flex",
                      padding: "0px",
                    }}
                  >
                    <div
                      style={{
                        height: "100%",
                        width: "100px",
                        display: "flex",
                        justifyContent: "end",
                        alignItems: "center",
                        fontSize: "12px",
                        fontWeight: "bold",
                        color: fontcolor,
                      }}
                    >
                      Profession :
                    </div>
                    <input
                      value={headerData.Profession}
                      disabled
                      style={{
                        paddingLeft: "3px",
                        color: fontcolor,
                        fontSize: "12px",
                        height: "100%",
                        backgroundColor: getcolor,
                        width: "293px",
                        marginLeft: "3px",
                        border: "1px solid grey",
                        borderRadius: "0px",
                      }}
                    ></input>
                  </div>
                  <div
                    // className="col-md-3"
                    style={{
                      width: "24%",
                      height: "100%",
                      display: "flex",
                      padding: "0px",
                    }}
                  >
                    <div
                      style={{
                        width: "147px",
                        height: "100%",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "end",
                        fontSize: "12px",
                        fontWeight: "bold",
                      }}
                    >
                      OfficeContact :
                    </div>
                    <div
                      style={{
                        paddingLeft: "3px",
                        color: fontcolor,
                        fontSize: "12px",
                        height: "100%",
                        backgroundColor: getcolor,
                        width: "132px",
                        marginLeft: "3px",
                        border: "1px solid grey",
                        borderRadius: "0px",
                        display: "flex",
                        justifyContent: "end",
                        alignItems: "center",
                        paddingRight: "5px",
                      }}
                    >
                      {headerData.OfficeContact}
                    </div>
                  </div>
                  <div
                    // className="col-md-3"
                    style={{
                      width: "24%",
                      height: "100%",
                      display: "flex",
                      padding: "0px",
                    }}
                  >
                    <div
                      style={{
                        width: "147px",
                        height: "100%",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "end",
                        fontSize: "12px",
                        fontWeight: "bold",
                      }}
                    >
                      Ins Amt :
                    </div>
                    <div
                      style={{
                        paddingLeft: "3px",
                        color: fontcolor,
                        fontSize: "12px",
                        height: "100%",
                        backgroundColor: getcolor,
                        width: "270px",
                        marginLeft: "3px",
                        border: "1px solid grey",
                        borderRadius: "0px",
                        display: "flex",
                        justifyContent: "end",
                        alignItems: "center",
                        paddingRight: "5px",
                      }}
                    >
                      {headerData.InsAmt}
                    </div>
                  </div>
                </div>
                <div
                  className="row"
                  style={{
                    height: "100%",
                    width: "100%",
                    margin: "0px",
                    marginTop: "1px",
                  }}
                >
                  <div
                    className="col-md-8"
                    style={{ height: "100%", display: "flex", padding: "0px" }}
                  >
                    <div
                      style={{
                        height: "100%",
                        width: "100px",
                        display: "flex",
                        justifyContent: "end",
                        alignItems: "center",
                        fontSize: "12px",
                        fontWeight: "bold",
                        color: fontcolor,
                      }}
                    >
                      OfficeAdd1 :
                    </div>
                    <input
                      value={headerData.OfficeAdd1}
                      disabled
                      style={{
                        paddingLeft: "3px",
                        color: fontcolor,
                        fontSize: "12px",
                        height: "100%",
                        backgroundColor: getcolor,
                        width: "293px",
                        marginLeft: "3px",
                        border: "1px solid grey",
                        borderRadius: "0px",
                      }}
                    ></input>
                  </div>
                  {/* <div
                    className="col-md-5"
                    style={{ height: "100%", display: "flex", padding: "0px" }}
                  >
                    <div
                      style={{
                        width: "147px",
                        height: "100%",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "end",
                        fontSize: "12px",
                        fontWeight: "bold",
                      }}
                    >
                      Profession :
                    </div>
                    <div
                      style={{
                        paddingLeft: "3px",
                        color: fontcolor,
                        fontSize: "12px",
                        height: "100%",
                        backgroundColor: getcolor,
                        width: "132px",
                        marginLeft: "3px",
                        border: "2px solid grey",
                        borderRadius: "0px",
                        display: "flex",
                        justifyContent: "end",
                        alignItems: "center",
                        paddingRight:'5px'
                      }}
                    >
{headerData.Profession}                  
  </div>
                  </div> */}
                </div>
                <div
                  className="row"
                  style={{
                    height: "100%",
                    width: "100%",
                    margin: "0px",
                    marginTop: "1px",
                  }}
                >
                  <div
                    className="col-md-8"
                    style={{ height: "100%", display: "flex", padding: "0px" }}
                  >
                    <div
                      style={{
                        height: "100%",
                        width: "100px",
                        display: "flex",
                        justifyContent: "end",
                        alignItems: "center",
                        fontSize: "12px",
                        fontWeight: "bold",
                        color: fontcolor,
                      }}
                    >
                      OfficeAdd2 :
                    </div>
                    <input
                      value={headerData.OfficeAdd2}
                      disabled
                      style={{
                        paddingLeft: "3px",
                        color: fontcolor,
                        fontSize: "12px",
                        height: "100%",
                        backgroundColor: getcolor,
                        width: "293px",
                        marginLeft: "3px",
                        border: "1px solid grey",
                        borderRadius: "0px",
                      }}
                    ></input>
                  </div>
                  {/* <div
                    className="col-md-5"
                    style={{ height: "100%", display: "flex", padding: "0px" }}
                  >
                    <div
                      style={{
                        width: "147px",
                        height: "100%",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "end",
                        fontSize: "12px",
                        fontWeight: "bold",
                      }}
                    >
                      NicNum :
                    </div>
                    <div
                      style={{
                        paddingLeft: "3px",
                        color: fontcolor,
                        fontSize: "12px",
                        height: "100%",
                        backgroundColor: getcolor,
                        width: "132px",
                        marginLeft: "3px",
                        border: "2px solid grey",
                        borderRadius: "0px",
                        display: "flex",
                        justifyContent: "end",
                        alignItems: "center",
                        paddingRight:'5px'
                      }}
                    >
{headerData.NicNum}                  
  </div>
                  </div> */}
                </div>
              </div>

              {/* RIGHT PART OF THE HEADER FIRST SECTION  */}
              <div
                className="col-md-2"
                style={{
                  flexWrap: "wrap",
                  height: "20px",
                  padding: "0px",
                  display: "flex",
                  gap: "0px",
                }}
              >
                <div
                  style={{
                    height: "150px",
                    width: "200px",
                    border: "1px solid grey",
                    position: "relative",
                    marginLeft: "10px",
                  }}
                >
                  {/* <div
                    style={{
                      position: "absolute",
                      top: 0,
                      left: 0,
                      width: "100%",
                      height: "100%",
                      background:
                        "linear-gradient(40deg, transparent 49%, grey 49%, grey 40%, transparent 51%)",
                      pointerEvents: "none", // So it doesn't interfere with clicks
                    }}
                  ></div>
                  <div
                    style={{
                      position: "absolute",
                      top: 0,
                      left: 0,
                      width: "100%",
                      height: "100%",
                      background:
                        "linear-gradient(-40deg, transparent 49%, grey 49%, grey 40%, transparent 51%)",
                      pointerEvents: "none", // So it doesn't interfere with clicks
                    }}
                  ></div> */}
                  <img
                  style={{
                    width:"100%",
                    height:"100%",
                  backgroundRepeat:"no-repeat",
                 backgroundSize:'auto'
                  }}
                    src={
                      headerData.Picture
                        ? `https://crystalsolutions.pk/DI/${organisation.code}/${headerData.Picture}`
                        : ""
                    }
                  />
                </div>

                <div
                  style={{
                    display: "flex",
                    height: "20px",
                    marginTop: "2px",
                    marginLeft: "2px",
                  }}
                >
                  <div
                    style={{
                      width: "80px",
                      height: "100%",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "end",
                      fontSize: "12px",
                      fontWeight: "bold",
                    }}
                  >
                    Expiry Date :
                  </div>
                  <div
                    style={{
                      paddingLeft: "3px",
                      color: fontcolor,
                      fontSize: "12px",
                      height: "100%",
                      backgroundColor: getcolor,
                      width: "80px",
                      marginLeft: "3px",
                      border: "1px solid grey",
                      borderRadius: "0px",
                      display: "flex",
                      justifyContent: "end",
                      alignItems: "center",
                      paddingRight: "5px",
                    }}
                  >
                    {headerData.ExpiryDate}
                  </div>
                </div>
              </div>
            </div>

            {/* CENTER SECTION  */}
            <div style={{padding:'0px'}}>
              {/* line center */}
              <div
                className="col-md-12"
                style={{ height: "1px", border: "1px solid grey" }}
              ></div>
            </div>
          </div>

          <div>
            <div
              className="col-md-12"
              style={{
                marginTop: "2px",
                marginBottom: "1px",
                display: "flex",
                padding: "0px",
                marginTop:'4px'
              }}
            >
              <div
                style={{
                  width: "98px",
                  display: "flex",
                  justifyContent: "end",
                  alignItems: "center",
                  fontSize: "12px",
                  fontWeight: "bold",
                  color: fontcolor,
                }}
              >
                Guaranter :
              </div>
              <input
                value={headerData.GrnName}
                disabled
                style={{
                  paddingLeft: "3px",
                  color: fontcolor,
                  fontSize: "12px",
                  height: "20px",
                  backgroundColor: getcolor,
                  width: "370px",
                  marginLeft: "3px",
                  border: "1px solid grey",
                  borderRadius: "0px",
                }}
              ></input>

              <div
                style={{
                  width: "110px",
                  display: "flex",
                  justifyContent: "end",
                  alignItems: "center",
                  fontSize: "12px",
                  fontWeight: "bold",
                  color: fontcolor,
                }}
              >
                Witness Name :
              </div>
              <input
                value={headerData.WitName}
                disabled
                style={{
                  paddingLeft: "3px",
                  color: fontcolor,
                  fontSize: "12px",
                  height: "20px",
                  backgroundColor: getcolor,
                  width: "370px",
                  marginLeft: "3px",
                  border: "1px solid grey",
                  borderRadius: "0px",
                }}
              ></input>
            </div>
            <div
              className="col-md-12"
              style={{
                marginTop: "2px",
                marginBottom: "1px",
                display: "flex",
                padding: "0px",
              }}
            >
              <div
                style={{
                  width: "98px",
                  display: "flex",
                  justifyContent: "end",
                  alignItems: "center",
                  fontSize: "12px",
                  fontWeight: "bold",
                  color: fontcolor,
                }}
              >
                Father Name :
              </div>
              <input
                value={headerData.GrnName}
                disabled
                style={{
                  paddingLeft: "3px",
                  color: fontcolor,
                  fontSize: "12px",
                  height: "20px",
                  backgroundColor: getcolor,
                  width: "370px",
                  marginLeft: "3px",
                  border: "1px solid grey",
                  borderRadius: "0px",
                }}
              ></input>

              <div
                style={{
                  width: "110px",
                  display: "flex",
                  justifyContent: "end",
                  alignItems: "center",
                  fontSize: "12px",
                  fontWeight: "bold",
                  color: fontcolor,
                }}
              >
                Father Name :
              </div>
              <input
                value={headerData.WitFather}
                disabled
                style={{
                  paddingLeft: "3px",
                  color: fontcolor,
                  fontSize: "12px",
                  height: "20px",
                  backgroundColor: getcolor,
                  width: "370px",
                  marginLeft: "3px",
                  border: "1px solid grey",
                  borderRadius: "0px",
                }}
              ></input>
            </div>

            <div
              className="col-md-12"
              style={{
                marginTop: "1px",
                marginBottom: "1px",
                display: "flex",
                padding: "0px",
              }}
            >
              <div
                style={{
                  width: "98px",
                  display: "flex",
                  justifyContent: "end",
                  alignItems: "center",
                  fontSize: "12px",
                  fontWeight: "bold",
                  color: fontcolor,
                }}
              >
                Address :
              </div>
              <input
                value={headerData.GrnAdd1}
                disabled
                style={{
                  paddingLeft: "3px",
                  color: fontcolor,
                  fontSize: "12px",
                  height: "20px",
                  backgroundColor: getcolor,
                  width: "370px",
                  marginLeft: "3px",
                  border: "1px solid grey",
                  borderRadius: "0px",
                }}
              ></input>

              <div
                style={{
                  width: "110px",
                  display: "flex",
                  justifyContent: "end",
                  alignItems: "center",
                  fontSize: "12px",
                  fontWeight: "bold",
                  color: fontcolor,
                }}
              >
                Address :
              </div>
              <input
                value={headerData.WitAdd1}
                disabled
                style={{
                  paddingLeft: "3px",
                  color: fontcolor,
                  fontSize: "12px",
                  height: "20px",
                  backgroundColor: getcolor,
                  width: "370px",
                  marginLeft: "3px",
                  border: "1px solid grey",
                  borderRadius: "0px",
                }}
              ></input>
            </div>
            <div
              className="col-md-12"
              style={{
                marginTop: "1px",
                marginBottom: "1px",
                display: "flex",
                padding: "0px",
              }}
            >
              <div
                style={{
                  width: "98px",
                  display: "flex",
                  justifyContent: "end",
                  alignItems: "center",
                  fontSize: "12px",
                  fontWeight: "bold",
                  color: fontcolor,
                }}
              ></div>
              <input
                value={headerData.GrnAdd2}
                disabled
                style={{
                  paddingLeft: "3px",
                  color: fontcolor,
                  fontSize: "12px",
                  height: "20px",
                  backgroundColor: getcolor,
                  width: "370px",
                  marginLeft: "3px",
                  border: "1px solid grey",
                  borderRadius: "0px",
                }}
              ></input>

              <div
                style={{
                  width: "110px",
                  display: "flex",
                  justifyContent: "end",
                  alignItems: "center",
                  fontSize: "12px",
                  fontWeight: "bold",
                  color: fontcolor,
                }}
              ></div>
              <input
                value={headerData.WitAdd2}
                disabled
                style={{
                  paddingLeft: "3px",
                  color: fontcolor,
                  fontSize: "12px",
                  height: "20px",
                  backgroundColor: getcolor,
                  width: "370px",
                  marginLeft: "3px",
                  border: "1px solid grey",
                  borderRadius: "0px",
                }}
              ></input>
            </div>
            <div
              className="col-md-12"
              style={{
                marginTop: "1px",
                marginBottom: "1px",
                display: "flex",
                padding: "0px",
              }}
            >
              <div
                style={{
                  width: "98px",
                  display: "flex",
                  justifyContent: "end",
                  alignItems: "center",
                  fontSize: "12px",
                  fontWeight: "bold",
                  color: fontcolor,
                }}
              >
                Mobile :
              </div>
              <input
                value={headerData.GrnMobile}
                disabled
                style={{
                  paddingLeft: "3px",
                  color: fontcolor,
                  fontSize: "12px",
                  height: "20px",
                  backgroundColor: getcolor,
                  width: "146px",
                  marginLeft: "3px",
                  border: "1px solid grey",
                  borderRadius: "0px",
                }}
              ></input>

              <div
                style={{
                  width: "75px",
                  display: "flex",
                  justifyContent: "end",
                  alignItems: "center",
                  fontSize: "12px",
                  fontWeight: "bold",
                  color: fontcolor,
                }}
              >
                CNIC :
              </div>
              <input
                value={headerData.GrnNic}
                disabled
                style={{
                  paddingLeft: "3px",
                  color: fontcolor,
                  fontSize: "12px",
                  height: "20px",
                  backgroundColor: getcolor,
                  width: "146px",
                  marginLeft: "3px",
                  border: "1px solid grey",
                  borderRadius: "0px",
                }}
              ></input>

              <div
                style={{
                  width: "110px",
                  display: "flex",
                  justifyContent: "end",
                  alignItems: "center",
                  fontSize: "12px",
                  fontWeight: "bold",
                  color: fontcolor,
                }}
              >
                Mobile :
              </div>
              <input
                value={headerData.WitMobile}
                disabled
                style={{
                  paddingLeft: "3px",
                  color: fontcolor,
                  fontSize: "12px",
                  height: "20px",
                  backgroundColor: getcolor,
                  width: "146px",
                  marginLeft: "3px",
                  border: "1px solid grey",
                  borderRadius: "0px",
                }}
              ></input>

              <div
                style={{
                  width: "75px",
                  display: "flex",
                  justifyContent: "end",
                  alignItems: "center",
                  fontSize: "12px",
                  fontWeight: "bold",
                  color: fontcolor,
                }}
              >
                CNIC :
              </div>
              <input
                value={headerData.WitNic}
                disabled
                style={{
                  paddingLeft: "3px",
                  color: fontcolor,
                  fontSize: "12px",
                  height: "20px",
                  backgroundColor: getcolor,
                  width: "146px",
                  marginLeft: "3px",
                  border: "1px solid grey",
                  borderRadius: "0px",
                }}
              ></input>
            </div>
          </div>

          {/* TABLE HEADER BODY DATA SECTION */}
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
                  fontSize: "12px",
                  //   width: "100%",
                  position: "relative",
                  //   paddingRight: "2%",
                }}
              >
                <thead
                  style={{
                    fontWeight: "bold",
                    height: "24px",
                    position: "sticky",
                    top: 0,
                    boxShadow: "0 2px 4px rgba(0, 0, 0, 0.2)",
                    backgroundColor: getnavbarbackgroundcolor,
                  }}
                >
                  <tr
                    style={{
                      backgroundColor: getnavbarbackgroundcolor,
                      color: "white",
                    }}
                  >
                    <td className="border-dark" style={firstColWidth}>
                      Date
                    </td>
                    <td className="border-dark" style={secondColWidth}>
                      Trn#
                    </td>
                    <td className="border-dark" style={thirdColWidth}>
                      Type
                    </td>
                    <td className="border-dark" style={forthColWidth}>
                      Description
                    </td>
                    <td className="border-dark" style={fifthColWidth}>
                      Sale
                    </td>
                    <td className="border-dark" style={sixthColWidth}>
                      Collection
                    </td>
                    <td className="border-dark" style={seventhColWidth}>
                      Balance
                    </td>
                    <td className="border-dark" style={sixthcol}></td>
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
                maxHeight: "18vh",
                // width: "100%",
                wordBreak: "break-word",
              }}
            >
              <table
                className="myTable"
                id="tableBody"
                style={{
                  fontSize: "12px",
                  // width: "100%",
                  position: "relative",
                  ...(tableData.length > 0 ? { tableLayout: "fixed" } : {}),
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
                        <td colSpan="7" className="text-center">
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
                            {Array.from({ length: 7 }).map((_, colIndex) => (
                              <td key={`blank-${rowIndex}-${colIndex}`}>
                                &nbsp;
                              </td>
                            ))}
                          </tr>
                        ),
                      )}
                      <tr>
                        <td style={firstColWidth}></td>
                        <td style={secondColWidth}></td>
                        <td style={thirdColWidth}></td>
                        <td style={forthColWidth}></td>
                        <td style={fifthColWidth}></td>
                        <td style={sixthColWidth}></td>
                        <td style={seventhColWidth}></td>
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
                              {item.Date}
                            </td>
                            <td className="text-start" style={secondColWidth}>
                              {item["Trn#"]}
                            </td>
                            <td className="text-center" style={thirdColWidth}>
                              {item.Type}
                            </td>
                            <td className="text-start" style={forthColWidth}>
                              {item.Description}
                            </td>
                            <td className="text-end" style={fifthColWidth}>
                              {item.Sale}
                            </td>
                            <td className="text-end" style={sixthColWidth}>
                              {item.Collection}
                            </td>
                            <td className="text-end" style={seventhColWidth}>
                              {item.Balance}
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
                          {Array.from({ length: 7 }).map((_, colIndex) => (
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
                      </tr>
                    </>
                  )}
                </tbody>
              </table>
            </div>
          </div>
          {/* TOTAL ROW SECTION */}
          <div
            style={{
              //   width: "100%",
              borderTop: `1px solid ${fontcolor}`,
              borderBottom: `1px solid ${fontcolor}`,
              height: "24px",
              display: "flex",
              paddingRight: "8px",
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
            <div
              style={{
                ...forthColWidth,
                background: getcolor,
                borderRight: `1px solid ${fontcolor}`,
              }}
            ></div>
            <div
              style={{
                ...fifthColWidth,
                background: getcolor,
                borderRight: `1px solid ${fontcolor}`,
              }}
            ></div>
            <div
              style={{
                ...sixthColWidth,
                background: getcolor,
                borderRight: `1px solid ${fontcolor}`,
              }}
            ></div>
            <div
              style={{
                ...seventhColWidth,
                background: getcolor,
                borderRight: `1px solid ${fontcolor}`,
              }}
            ></div>
          </div>
          {/* LAST BUTTONS SECTION SELECT, PDF, EXCEL AND RETURN */}
          <div
            style={{
              margin: "5px",
              marginBottom: "2px",
            }}
          >
            <SingleButton to="/MainPage" text="Return" />
            <SingleButton text="PDF" onClick={exportPDFHandler} />
            <SingleButton text="EXCEL" onClick={handleDownloadCSV} />
            <SingleButton
              id="searchsubmit"
              text="SELECT"
              ref={input3Ref}
              onClick={fetchGeneralLedger}
            />
          </div>
        </div>
      </div>
    </>
  );
}
