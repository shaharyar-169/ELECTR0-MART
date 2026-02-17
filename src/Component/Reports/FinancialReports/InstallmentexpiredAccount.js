import React, { useState, useEffect, useRef } from "react";
import { Container, Spinner, Nav } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";

import axios from "axios";

import { useTheme } from "../../../ThemeContext";
import {
  getUserData,
  getOrganisationData,
  getLocationnumber,
  getYearDescription,
} from "../../Auth";

import NavComponent from "../../MainComponent/Navform/navbarform";
import SingleButton from "../../MainComponent/Button/SingleButton/SingleButton";
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
import { useHotkeys } from "react-hotkeys-hook";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { formHelperTextClasses } from "@mui/material";
import { Balance } from "@mui/icons-material";

export default function InstallmentExpiredAccountReport() {
  const navigate = useNavigate();
  const saleSelectRef = useRef(null);
  const input1Ref = useRef(null);
  const input2Ref = useRef(null);
  const input3Ref = useRef(null);

  const toRef = useRef(null);
  const fromRef = useRef(null);

  const [CashBookSummaryData, setCashBookSummaryData] = useState([]);
  const [CashPaymentData, setCashPaymentData] = useState([]);

  const [Companyselectdatavalue, setCompanyselectdatavalue] = useState("");

  const [saleType, setSaleType] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [transectionType, settransectionType] = useState("");
  const [supplierList, setSupplierList] = useState([]);

  const [TotalSale, setTotalSale] = useState(0);
  const [TotalAdvance, setTotalAdvance] = useState(0);
  const [TotalIns, setTotalIns] = useState(0);
  const [TotalaBalance, setTotalaBalance] = useState(0);
  const [TotalCollection, setTotalCollection] = useState(0);

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
  } = useTheme();

  const yeardescription = getYearDescription();
  const locationnumber = getLocationnumber();

  console.log("select year: " + getyeardescription);

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
    return `${String(date.getDate()).padStart(2, "0")}-${String(date.getMonth() + 1).padStart(2, "0")}-${date.getFullYear()}`;
  };

  // Optionally format the Date objects back to string if needed
  const GlobalfromDate1 = formatDate1(GlobalfromDate); // '01-01-2023'
  const GlobaltoDate1 = formatDate1(GlobaltoDate); // '31-12-2023'

  //////////////////////// CUSTOM DATE LIMITS ////////////////////////////

  // Toggle the ToDATE && FromDATE CalendarOpen state on each click

  const toggleToCalendar = () => {
    settoCalendarOpen((prevOpen) => !prevOpen);
  };
  const formatDate = (date) => {
    const day = date.getDate().toString().padStart(2, "0");
    const month = (date.getMonth() + 1).toString().padStart(2, "0");
    const year = date.getFullYear();
    return `${day}-${month}-${year}`;
  };
  const handleToKeyPress = (e, inputref) => {
    if (e.key === "Enter") {
      e.preventDefault();
      const toDateElement = document.getElementById("todatevalidation");
      const formattedInput = toInputDate.replace(
        /^(\d{2})(\d{2})(\d{4})$/,
        "$1-$2-$3",
      );
      const datePattern = /^(0[1-9]|[12][0-9]|3[01])-(0[1-9]|1[0-2])-\d{4}$/;

      if (formattedInput.length === 10 && datePattern.test(formattedInput)) {
        const [day, month, year] = formattedInput.split("-").map(Number);

        if (month > 12 || month === 0) {
          alert("Please enter a valid month (MM) between 01 and 12");
          return;
        }

        const daysInMonth = new Date(year, month, 0).getDate();
        if (day > daysInMonth || day === 0) {
          alert(`Please enter a valid day (DD) for month ${month}`);
          return;
        }

        const enteredDate = new Date(year, month - 1, day); // Month is zero-based

        // Convert GlobalfromDate and GlobaltoDate to Date objects for comparison
        // const fromDate = new Date(GlobalfromDate.split('-').reverse().join('-'));
        // const toDate = new Date(GlobaltoDate.split('-').reverse().join('-'));

        if (enteredDate < GlobalfromDate || enteredDate > GlobaltoDate) {
          toast.error(
            `Date must be after ${GlobalfromDate1} and before ${GlobaltoDate1}`,
          );
          return;
        }

        toDateElement.style.border = `1px solid ${fontcolor}`; // Add border color
        settoInputDate(formattedInput);

        if (saleSelectRef.current) {
          e.preventDefault();
          saleSelectRef.current.focus(); // Move focus to React Select
        }
      } else {
        toast.error(
          `Date must be after ${GlobalfromDate1} and before ${GlobaltoDate1}`,
        );
      }
    }
  };
  const handleToDateChange = (date) => {
    setSelectedToDate(date);
    settoInputDate(date ? formatDate(date) : "");
    settoCalendarOpen(false);
  };
  const handleToInputChange = (e) => {
    settoInputDate(e.target.value);
  };
  // Function to handle keypress and move focus
  const handleKeyPress = (e, nextInputRef) => {
    if (e.key === "Enter") {
      e.preventDefault(); // Prevent form submission
      if (nextInputRef.current) {
        nextInputRef.current.focus(); // Move focus to next input
      }
    }
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
    const fromDateElement = document.getElementById("fromdatevalidation");
    const toDateElement = document.getElementById("todatevalidation");

    const dateRegex = /^\d{2}-\d{2}-\d{4}$/;

    let hasError = false;
    let errorType = "";

    // Handle saleType, fromInputDate, and toInputDate errors first
    switch (true) {
      //   case !saleType:
      //     errorType = "saleType";
      //     break;

      case !toInputDate:
        errorType = "toDate";
        break;
      default:
        hasError = false;
        break;
    }

    // Handle date format validation separately
    if (!dateRegex.test(fromInputDate)) {
      errorType = "fromDateInvalid";
    }

    if (!dateRegex.test(toInputDate)) {
      errorType = "toDateInvalid";
    } else {
      const formattedToInput = toInputDate.replace(
        /^(\d{2})(\d{2})(\d{4})$/,
        "$1-$2-$3",
      );
      const [toDay, toMonth, toYear] = formattedToInput.split("-").map(Number);
      const enteredToDate = new Date(toYear, toMonth - 1, toDay);

      if (enteredToDate < GlobalfromDate || enteredToDate > GlobaltoDate) {
        errorType = "toDateAfterGlobal";
      }
    }

    // Handle errors using a separate switch based on errorType
    switch (errorType) {
      //   case "saleType":
      //     toast.error("Please select a Account Code");
      //     return;
      case "toDate":
        toast.error(
          `Date must be after ${GlobalfromDate1} and before ${GlobaltoDate1}`,
        );
        return;

      case "toDateAfterGlobal":
        toast.error(
          `Date must be after ${GlobalfromDate1} and before ${GlobaltoDate1}`,
        );
        return;

      default:
        break;
    }
    ////////////////////////////////////////////

    // document.getElementById('fromdatevalidation').style.border = `1px solid ${fontcolor}`;
    document.getElementById("todatevalidation").style.border =
      `1px solid ${fontcolor}`;

    const apiUrl2 = apiLinks + "/InstallmentExpiredAccount.php";
    setIsLoading(true);
    const formData2 = new URLSearchParams({
      FRepDat: toInputDate,
      FColCod: saleType,
      FSchTxt: searchQuery,
      code: organisation.code,
      FLocCod: locationnumber || getLocationNumber,

    //   code: "MTSELEC",
    //   FLocCod: "002",
    }).toString();

    axios
      .post(apiUrl2, formData2)
      .then((response) => {
        setTotalSale(response.data["Total Sale "]);
        setTotalIns(response.data["Total Ins "]);
        setTotalaBalance(response.data["Total Balance "]);
       

        if (response.data && Array.isArray(response.data.Detail)) {
          setTableData(response.data.Detail);
          setIsLoading(false);
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
    // If it hasn't mounted before or on refresh, select the 'from date' input
    if (!hasComponentMountedPreviously || (toRef && toRef.current)) {
      if (toRef && toRef.current) {
        setTimeout(() => {
          toRef.current.focus(); // Focus on the input field
          toRef.current.select(); // Select the text within the input field
        }, 0);
      }
      sessionStorage.setItem("componentMounted", "true"); // Set the flag indicating mount
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
    const apiUrl = apiLinks + "/GetCollectors.php";
    const formData = new URLSearchParams({
 code: organisation.code,
      FLocCod: locationnumber || getLocationNumber,
    //         code: "MTSELEC",
    //   FLocCod: "002",
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
    value: item.tcolcod,
    label: `${item.tcolcod}-${item.tcolnam.trim()}`,
  }));

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
      width: 250,
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

  ///////////////////////////// DOWNLOAD PDF CODE ////////////////////////////////////////////////////////////
  const exportPDFHandler = () => {
    // Create a new jsPDF instance with landscape orientation
    const doc = new jsPDF({ orientation: "landscape" });

    // Define table data (rows)
    const rows = tableData.map((item) => [
      item.code,
      item.Customer,
      item.SaleDate,
      item.SaleAmt,
      item.PrmDate,
      item.InsNum,
      item.InsAmt,
      item.LastDate,
      item.Balance,
      item.ExpiryDate,
      item.Col,
    ]);

    // Add summary row to the table
    rows.push([
      String(formatValue(tableData.length.toLocaleString())),
      "",
      "",
      String(formatValue(TotalSale)),
      "",
      "",
      String(formatValue(TotalIns)),
      "",
      String(formatValue(TotalaBalance)),
"",
      "",
    ]);

    // Define table column headers and individual column widths
    const headers = [
      "Code",
      "Customer",
      "SaleDate",
      "SaleAmt",
      "PrmDate",
      "Ins#",
      "Ins Amt",
      "Last Date",
      "Balance",
      "Expiry",
      "Col",
    ];
    const columnWidths = [24, 80, 23, 23, 23, 14, 23, 24, 23, 23, 10];

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
          doc.setFont("verdana-regular", "normal");
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

          if (cellIndex === 0 || cellIndex == 2 || cellIndex ==4 || cellIndex == 9) {
            const rightAlignX = startX + columnWidths[cellIndex] / 2;
            doc.text(cellValue, rightAlignX, cellY, {
              align: "center",
              baseline: "middle",
            });
          } else if (cellIndex == 3 || cellIndex == 5 || cellIndex == 6 || cellIndex == 8 || cellIndex == 10) {
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
        pageNumberFontSize = 8,
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
        doc.setFont("verdana-regular", "normal");
        doc.setFontSize(10);
        doc.text(
          `Page ${pageNumber}`,
          rightX - 20,
          doc.internal.pageSize.height - 10,
          { align: "right" },
        );
      };

      let currentPageIndex = 0;
      let startY = paddingTop; // Initialize startY
      let pageNumber = 1; // Initialize page number

      while (currentPageIndex * rowsPerPage < rows.length) {
        doc.setFont("Times New Roman", "normal");
        doc.setFontSize(10);
        addTitle(comapnyname, "", "", pageNumber, startY, 20, 10); // Render company title with default font size, only date, and page number
        startY += 7; // Adjust vertical position for the company title
        doc.setFont("verdana-regular", "normal");
        addTitle(`Installment Expired Account Report`, "", "", pageNumber, startY, 14); // Render sale report title with decreased font size, provide the time, and page number
        startY += 13;

        const labelsX = (doc.internal.pageSize.width - totalWidth) / 2;
        const labelsY = startY + 2; // Position the labels below the titles and above the table

        let typename = Companyselectdatavalue.label
          ? Companyselectdatavalue.label
          : "ALL";

        let searchdata = searchQuery ? searchQuery : "";

        doc.setFont("verdana", "bold");
        doc.setFontSize(10);
        doc.text(`Collector :`, labelsX, labelsY); // Draw bold label
        doc.setFont("verdana-regular", "normal");
        doc.setFontSize(10);
        doc.text(`${typename}`, labelsX + 25, labelsY); // Draw the value next to the label

        if (searchQuery) {
          doc.setFont("verdana", "bold");
          doc.setFontSize(10);
          doc.text(`Search :`, labelsX + 200, labelsY); // Draw bold label
          doc.setFont("verdana-regular", "normal");
          doc.setFontSize(10);
          doc.text(`${searchdata}`, labelsX + 220, labelsY); // Draw the value next to the label
        }

        startY += 0; // Adjust vertical position for the labels

        addTableHeaders((doc.internal.pageSize.width - totalWidth) / 2, 39);
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

    // Save the PDF file
    doc.save("InstallmentExpiredAccountReport.pdf");

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

    const numColumns = 11; // Ensure this matches the actual number of columns

    const columnAlignments = [
      "center",
      "left",
      "center",
      "right",
      "center",
      "right",
      "right",
      "center",
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
    const storeListRow = worksheet.addRow([
      `Installment Expired Account Report As On ${toInputDate}`,
    ]);
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

    let collectordata = Companyselectdatavalue.label
      ? Companyselectdatavalue.label
      : "ALL";

    let typesearch = searchQuery ? searchQuery : "";

    const typeAndStoreRow4 = worksheet.addRow(
      searchQuery
        ? [
            "Collector :",
            collectordata,
            "",
            "",
            "",
            "",
            "",
            "Search :",
            typesearch,
          ]
        : ["Collector :", collectordata],
    );

    //   worksheet.mergeCells(`B${typeAndStoreRow4.number}:D${typeAndStoreRow4.number}`);

    typeAndStoreRow4.eachCell((cell, colIndex) => {
      cell.font = {
        name: "CustomFont" || "CustomFont",
        size: 10,
        bold: [1, 6].includes(colIndex),
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
    const headers = [
      "Code",
      "Customer",
      "SaleDate",
      "SaleAmt",
      "PrmDate",
      "Ins#",
      "Ins Amt",
      "Last Date",
      "Balance",
      "Expiry",
      "Col",
    ];
    const headerRow = worksheet.addRow(headers);
    headerRow.eachCell((cell) => Object.assign(cell, headerStyle));

    // Add data rows
    tableData.forEach((item) => {
      const row = worksheet.addRow([
        item.code,
      item.Customer,
      item.SaleDate,
      item.SaleAmt,
      item.PrmDate,
      item.InsNum,
      item.InsAmt,
      item.LastDate,
      item.Balance,
      item.ExpiryDate,
      item.Col,
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
    [11, 45, 11, 14, 11, 7, 14, 11, 11, 14, 7].forEach((width, index) => {
      worksheet.getColumn(index + 1).width = width;
    });

    const totalRow = worksheet.addRow([
      String(formatValue(tableData.length.toLocaleString())),
      "",
      "",
      String(formatValue(TotalSale)),
      "",
      "",
      String(formatValue(TotalIns)),
      "",
      String(formatValue(TotalaBalance)),
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
      if (colNumber >= 4) {
        cell.alignment = { horizontal: "right" };
      }
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
    saveAs(blob, `InstallmentExpiredAccountReport As On ${currentdate}.xlsx`);
  };
  ///////////////////////////// DOWNLOAD PDF EXCEL ///////////////////////////////////////////////////////////

  useHotkeys(
    "alt+s",
    () => {
      fetchGeneralLedger();
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

  console.log("HAJVARY DATE", tableData);

  const [selectedSearch, setSelectedSearch] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { data, loading, error } = useSelector((state) => state.getuser);

  // useEffect(() => {
  //     setTableData(data);
  //     dispatch(fetchGetUser(organisation && organisation.code));
  // }, [dispatch, organisation.code]);

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

  const handleSaleKeypress = (event, inputId) => {
    if (event.key === "Enter") {
      const selectedOption = saleSelectRef.current.state.selectValue;
      if (selectedOption && selectedOption.value) {
        setSaleType(selectedOption.value);
      }
      const nextInput = document.getElementById(inputId);
      if (nextInput) {
        nextInput.focus();
        nextInput.select();
      } else {
        document.getElementById("submitButton").click();
      }
    }
  };

  const firstColWidth = {
    width: "80px",
  };
  const secondColWidth = {
    width: isSidebarVisible ? "240px" : "360px",
  };
  const thirdColWidth = {
    width: "80px",
  };
  const forthColWidth = {
    width: isSidebarVisible ? "80px" : "100px",
  };
  const fifthColWidth = {
    width: "80px" ,
  };
  const sixthColWidth = {
    width: isSidebarVisible ? "80px" : "100px",
  };
  const seventhColWidth = {
    width: "55px",
  };
  const eighthColWidth = {
    width: isSidebarVisible ? "80px" : "100px",
  };
  const ninthColWidth = {
    width: "80px",
  };
  const tenthColWidth = {
    width:  "80px" ,
  };
  const elewenthColWidth = {
    width: "40px",
  };

  const sixCol = {
    width: "8px",
  };

  const [columns, setColumns] = useState({
    code: [],
    Customer: [],
    SaleDate: [],
    SaleAmt: [],
    PrmDate: [],
    InsNum: [],
    InsAmt: [],
    LastDate: [],
    Balance: [],
    ExpiryDate: [],
    Col: [],
  });
  const [columnSortOrders, setColumnSortOrders] = useState({
    code: "",
    Customer: "",
    SaleDate: "",
    SaleAmt: "",
    PrmDate: "",
    InsNum: "",
    InsAmt: "",
    LastDate: "",
    Balance: "",
    ExpiryDate: "",
    Col: "",
  });

  // When you receive your initial table data, transform it into column-oriented format
  useEffect(() => {
    if (tableData.length > 0) {
      const newColumns = {
        code: tableData.map((row) => row.code),
        Customer: tableData.map((row) => row.Customer),
        SaleDate: tableData.map((row) => row.SaleDate),
        SaleAmt: tableData.map((row) => row.SaleAmt),
        PrmDate: tableData.map((row) => row.PrmDate),
        InsNum: tableData.map((row) => row.InsNum),
        InsAmt: tableData.map((row) => row.InsAmt),
        LastDate: tableData.map((row) => row.LastDate),
        Balance: tableData.map((row) => row.Balance),
        ExpiryDate: tableData.map((row) => row.ExpiryDate),
        Col: tableData.map((row) => row.Col),
      };
      setColumns(newColumns);
    }
  }, [tableData]);

  const handleSorting = (col) => {
    const currentOrder = columnSortOrders[col];
    const newOrder = currentOrder === "ASC" ? "DSC" : "ASC";

    const sortedData = [...tableData].sort((a, b) => {
      let aVal = a[col] ?? "";
      let bVal = b[col] ?? "";

      aVal = aVal.toString();
      bVal = bVal.toString();

      // ⭐ CODE SORT (13-01-0005)
      if (col === "code") {
        const aParts = aVal.split("-").map((p) => parseInt(p, 10));
        const bParts = bVal.split("-").map((p) => parseInt(p, 10));

        for (let i = 0; i < Math.max(aParts.length, bParts.length); i++) {
          const diff = (aParts[i] || 0) - (bParts[i] || 0);
          if (diff !== 0) {
            return newOrder === "ASC" ? diff : -diff;
          }
        }
        return 0;
      }

      // ⭐ Numeric sorting
      const numA = parseFloat(aVal.replace(/,/g, ""));
      const numB = parseFloat(bVal.replace(/,/g, ""));

      if (!isNaN(numA) && !isNaN(numB)) {
        return newOrder === "ASC" ? numA - numB : numB - numA;
      }

      // ⭐ String sorting
      return newOrder === "ASC"
        ? aVal.localeCompare(bVal)
        : bVal.localeCompare(aVal);
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
      code: null,
      Customer: null,
      SaleDate: null,
      SaleAmt: null,
      PrmDate: null,
      InsNum: null,
      InsAmt: null,
      LastDate: null,
      Balance: null,
      ExpiryDate: null,
      Col: null,
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

  //////////////////////////////////////////// ROW HIGHLIGHT CODE ////////////////////////////////////
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

const parseDDMMYYYY = (dateStr) => {
  if (!dateStr) return null;
  const [dd, mm, yyyy] = dateStr.split("-");
  return new Date(`${yyyy}-${mm}-${dd}`);
};


  const formatValue = (val) => {
    return Number(val) === 0 ? "" : val;
  };

  return (
    <>
      {/* <div id="someElementId"></div> */}
      <ToastContainer />
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
          <NavComponent textdata="Installment Expired Account Report" />

          <div
            className="row "
            style={{ height: "20px", marginTop: "8px", marginBottom: "8px" }}
          >
            <div
              style={{
                width: "97.5%",
                display: "flex",
                alignItems: "center",
                margin: "0px",
                padding: "0px",
                justifyContent: "start",
              }}
            >
              {/* To Date */}
              <div
                className="d-flex align-items-center"
                style={{ marginLeft: "10px" }}
              >
                <div
                  style={{
                    width: "72px",
                    display: "flex",
                    justifyContent: "end",
                  }}
                >
                  <label htmlFor="transactionType">
                    <span
                      style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontSize: getdatafontsize,
                        fontFamily: getfontstyle,
                        fontWeight: "bold",
                      }}
                    >
                      Date :
                    </span>
                  </label>{" "}
                </div>
                <div
                  id="todatevalidation"
                  style={{
                    width: "135px",
                    border: `1px solid ${fontcolor}`,
                    display: "flex",
                    alignItems: "center",
                    height: " 24px",
                    justifycontent: "center",
                    marginLeft: "5px",
                    background: getcolor,
                  }}
                  onFocus={(e) =>
                    (e.currentTarget.style.border = "2px solid red")
                  }
                  onBlur={(e) =>
                    (e.currentTarget.style.border = `1px solid ${fontcolor}`)
                  }
                >
                  <input
                    ref={toRef}
                    style={{
                      height: "20px",
                      width: "90px",
                      paddingLeft: "5px",
                      outline: "none",
                      alignItems: "center",
                      // marginTop: '5.5px',
                      border: "none",
                      fontSize: "12px",
                      backgroundColor: getcolor,
                      color: fontcolor,
                    }}
                    value={toInputDate}
                    onChange={handleToInputChange}
                    // onKeyPress={handleToKeyPress}
                    onKeyDown={(e) => handleToKeyPress(e, saleSelectRef)}
                    // onKeyDown={(e) => handleKeyPressBoth(e, 'submitButton')}
                    id="toDatePicker"
                    autoComplete="off"
                    placeholder="dd-mm-yyyy"
                    aria-label="To Date Input"
                    aria-describedby="todatepicker"
                  />
                  <DatePicker
                    selected={selectedToDate}
                    onChange={handleToDateChange}
                    dateFormat="dd-MM-yyyy"
                    popperPlacement="bottom"
                    showPopperArrow={false}
                    // showMonthDropdown
                    // showYearDropdown
                    open={toCalendarOpen}
                    dropdownMode="select"
                    customInput={
                      <div>
                        <span>
                          <BsCalendar
                            onClick={toggleToCalendar}
                            style={{
                              cursor: "pointer",
                              alignItems: "center",
                              marginLeft: "18px",
                              // marginTop: '5px',
                              fontSize: "12px",
                            }}
                          />
                        </span>
                      </div>
                    }
                  />
                </div>
              </div>
            </div>
          </div>

          <div
            className="row "
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
              {/* SELECT TH CODE  */}
              <div
                className="d-flex align-items-center  "
                style={{ marginLeft: "5px" }}
              >
                <div
                  style={{
                    width: "80px",
                    display: "flex",
                    justifyContent: "end",
                  }}
                >
                  <label htmlFor="transactionType">
                    <span
                      style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontSize: getdatafontsize,
                        fontFamily: getfontstyle,
                        fontWeight: "bold",
                      }}
                    >
                      Collector :
                    </span>
                  </label>{" "}
                </div>
                <div style={{ marginLeft: "3px" }}>
                  <Select
                    className="List-select-class"
                    ref={saleSelectRef}
                    options={options}
                    onKeyDown={(e) => handleSaleKeypress(e, "searchsubmit")}
                    id="selectedsale"
                    onChange={(selectedOption) => {
                      if (selectedOption && selectedOption.value) {
                        const labelPart = selectedOption.label.split("-")[1];
                        setSaleType(selectedOption.value);
                        setCompanyselectdatavalue({
                          value: selectedOption.value,
                          label: labelPart,
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
              <div id="lastDiv">
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
                      color: "white",
                    }}
                  >
                    <td
                      className="border-dark"
                      style={firstColWidth}
                      onClick={() => handleSorting("code")}
                    >
                      Code{" "}
                      <i
                        className="fa-solid fa-caret-down caretIconStyle"
                        style={getIconStyle("code")}
                      ></i>
                    </td>

                    <td
                      className="border-dark"
                      style={secondColWidth}
                      onClick={() => handleSorting("Customer")}
                    >
                      Customer{" "}
                      <i
                        className="fa-solid fa-caret-down caretIconStyle"
                        style={getIconStyle("Customer")}
                      ></i>
                    </td>
                    <td
                      className="border-dark"
                      style={thirdColWidth}
                      onClick={() => handleSorting("SaleDate")}
                    >
                      SaleDate{" "}
                      <i
                        className="fa-solid fa-caret-down caretIconStyle"
                        style={getIconStyle("SaleDate")}
                      ></i>
                    </td>
                    <td
                      className="border-dark"
                      style={forthColWidth}
                      onClick={() => handleSorting("SaleAmt")}
                    >
                      SaleAmt{" "}
                      <i
                        className="fa-solid fa-caret-down caretIconStyle"
                        style={getIconStyle("SaleAmt")}
                      ></i>
                    </td>

                    <td
                      className="border-dark"
                      style={fifthColWidth}
                      onClick={() => handleSorting("PrmDate")}
                    >
                      PrmDate{" "}
                      <i
                        className="fa-solid fa-caret-down caretIconStyle"
                        style={getIconStyle("PrmDate")}
                      ></i>
                    </td>

                    <td
                      className="border-dark"
                      style={seventhColWidth}
                      onClick={() => handleSorting("InsNum")}
                    >
                      Ins#{" "}
                      <i
                        className="fa-solid fa-caret-down caretIconStyle"
                        style={getIconStyle("InsNum")}
                      ></i>
                    </td>
                    <td
                      className="border-dark"
                      style={eighthColWidth}
                      onClick={() => handleSorting("InsAmt")}
                    >
                      InsAmt{" "}
                      <i
                        className="fa-solid fa-caret-down caretIconStyle"
                        style={getIconStyle("InsAmt")}
                      ></i>
                    </td>
                    <td
                      className="border-dark"
                      style={ninthColWidth}
                      onClick={() => handleSorting("LastDate")}
                    >
                      LastDate{" "}
                      <i
                        className="fa-solid fa-caret-down caretIconStyle"
                        style={getIconStyle("LastDate")}
                      ></i>
                    </td>
                    <td
                      className="border-dark"
                      style={sixthColWidth}
                      onClick={() => handleSorting("Balance")}
                    >
                      Balance{" "}
                      <i
                        className="fa-solid fa-caret-down caretIconStyle"
                        style={getIconStyle("Balance")}
                      ></i>
                    </td>
                    <td
                      className="border-dark"
                      style={tenthColWidth}
                      onClick={() => handleSorting("ExpiryDate")}
                    >
                      Expiry {" "}
                      <i
                        className="fa-solid fa-caret-down caretIconStyle"
                        style={getIconStyle("ExpiryDate")}
                      ></i>
                    </td>
                    <td
                      className="border-dark"
                      style={elewenthColWidth}
                      onClick={() => handleSorting("Col")}
                    >
                      Col{" "}
                      <i
                        className="fa-solid fa-caret-down caretIconStyle"
                        style={getIconStyle("Col")}
                      ></i>
                    </td>
                    <td className="border-dark" style={sixCol}></td>
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
                maxHeight: "50vh",
                // width: "100%",
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
                        <td colSpan="11" className="text-center">
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
                            {Array.from({ length: 11 }).map((_, colIndex) => (
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

                        <td style={seventhColWidth}></td>
                        <td style={eighthColWidth}></td>
                        <td style={ninthColWidth}></td>
                        <td style={sixthColWidth}></td>
                        <td style={tenthColWidth}></td>
                        <td style={elewenthColWidth}></td>
                      </tr>
                    </>
                  ) : (
                    <>
                      {tableData.map((item, i) => {
                    const lastDate = parseDDMMYYYY(item.LastDate);
const expiryDate = parseDDMMYYYY(item.ExpiryDate);

const isNegative = lastDate < expiryDate;


              
              
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
                            //   color: fontcolor,
                             color: isNegative ? "red" : fontcolor,
                            }}
                          >
                            {/* <td className="text-start" style={firstColWidth}>
                              {item.tinscod}
                            </td> */}
                            <td
                              className="text-start"
                              style={{
                                ...firstColWidth,
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
                                    code: item.code,
                                  }),
                                );

                                // fixed URL open karo
                                window.open(
                                  "/crystalsol/InstallmentLedger",
                                  "_blank",
                                );
                              }}
                            >
                              {item.code}
                            </td>

                            <td
                              className="text-start"
                              title={item.Customer}
                              style={{
                                ...secondColWidth,
                                whiteSpace: "nowrap",
                                overflow: "hidden",
                                textOverflow: "ellipsis",
                              }}
                            >
                              {item.Customer}
                            </td>
                            <td className="text-start" style={thirdColWidth}>
                              {item.SaleDate}
                            </td>
                            <td className="text-end" style={forthColWidth}>
                              {item.SaleAmt}
                            </td>

                            <td className="text-end" style={fifthColWidth}>
                              {item.PrmDate}
                            </td>

                            <td className="text-end" style={seventhColWidth}>
                              {item.InsNum}
                            </td>
                            <td className="text-end" style={eighthColWidth}>
                              {item.InsAmt}
                            </td>
                            <td className="text-end" style={ninthColWidth}>
                              {item.LastDate}
                            </td>
                            <td className="text-end" style={sixthColWidth}>
                              {item.Balance}
                            </td>
                            <td className="text-end" style={tenthColWidth}>
                              {item.ExpiryDate}
                            </td>
                            <td className="text-end" style={elewenthColWidth}>
                              {item.Col}
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
                          {Array.from({ length: 11 }).map((_, colIndex) => (
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
                        <td style={seventhColWidth}></td>
                        <td style={eighthColWidth}></td>
                        <td style={ninthColWidth}></td>
                        <td style={sixthColWidth}></td>

                        <td style={tenthColWidth}></td>
                        <td style={elewenthColWidth}></td>
                      </tr>
                    </>
                  )}
                </tbody>
              </table>
            </div>
          </div>

          <div
            style={{
              paddingRight: "8px",
              borderTop: `1px solid ${fontcolor}`,
              borderBottom: `1px solid ${fontcolor}`,
              height: "24px",
              display: "flex",
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
            >
              <span className="mobileledger_total">
                {formatValue(TotalSale)}
              </span>
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
                ...seventhColWidth,
                background: getcolor,
                borderRight: `1px solid ${fontcolor}`,
              }}
            ></div>
            <div
              style={{
                ...eighthColWidth,
                background: getcolor,
                borderRight: `1px solid ${fontcolor}`,
              }}
            >
              <span className="mobileledger_total">
                {formatValue(TotalIns)}
              </span>
            </div>
            <div
              style={{
                ...ninthColWidth,
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
            >
              <span className="mobileledger_total">
                {formatValue(TotalaBalance)}
              </span>
            </div>
            <div
              style={{
                ...tenthColWidth,
                background: getcolor,
                borderRight: `1px solid ${fontcolor}`,
              }}
            >
              {" "}
            
            </div>
            <div
              style={{
                ...elewenthColWidth,
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
            <SingleButton to="/MainPage" text="Return" />
            <SingleButton text="PDF" onClick={exportPDFHandler} />
            <SingleButton text="EXCEL" onClick={handleDownloadCSV} />
            <SingleButton
              id="searchsubmit"
              text="SELECT"
              ref={input3Ref}
              onClick={() => {
                fetchGeneralLedger();
                resetSorting();
              }}
            />
          </div>
        </div>
      </div>
    </>
  );
}
