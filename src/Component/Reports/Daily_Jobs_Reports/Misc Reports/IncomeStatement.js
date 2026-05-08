import React, { useState, useEffect, useRef } from "react";
import { Container, Spinner, Nav } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";

import axios from "axios";

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
import { useHotkeys } from "react-hotkeys-hook";
import { fetchGetUser } from "../../../Redux/action";
import "./misc.css";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";


export default function IncomeStatement() {
  const navigate = useNavigate();
  const user = getUserData();
  const organisation = getOrganisationData();

  const saleSelectRef = useRef(null);
  const input1Ref = useRef(null);
  const input2Ref = useRef(null);
  const input3Ref = useRef(null);

  const toRef = useRef(null);
  const fromRef = useRef(null);
  const hasInitialized = useRef(false);

  const [saleType, setSaleType] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [transectionType, settransectionType] = useState("");
  const [supplierList, setSupplierList] = useState([]);

  // DOUBLE STATE HANDLE
  const [isItemInitialized, setIsItemInitialized] = useState(false);
  const [isCodeReady, setIsCodeReady] = useState(false);
  const [isDoubleClickOpen, setIsDoubleClickOpen] = useState(false);

  const [tableData, setTableData] = useState([]);
  console.log('incomesatatment data', tableData)

  const [totalQnty, setTotalQnty] = useState(0);
  const [totalOpening, setTotalOpening] = useState(0);
  const [totalDebit, setTotalDebit] = useState(0);
  const [totalCredit, setTotalCredit] = useState(0);
  const [closingBalance, setClosingBalance] = useState(0);

  const [Companyselectdatavalue, setCompanyselectdatavalue] = useState("");

  console.log("Companyselectdatavalue", Companyselectdatavalue.label);

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
    getfontstyle,
    getdatafontsize,
    getnavbarbackgroundcolor,
  } = useTheme();

  useEffect(() => {
    document.documentElement.style.setProperty("--background-color", getcolor);
    document.documentElement.style.setProperty("--font-color", fontcolor);
  }, [getcolor, fontcolor]);

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
      date.getMonth() + 1,
    ).padStart(2, "0")}-${date.getFullYear()}`;
  };

  const GlobalfromDate1 = formatDate1(GlobalfromDate);
  const GlobaltoDate1 = formatDate1(GlobaltoDate);

  //////////////////////// CUSTOM DATE LIMITS ////////////////////////////

  // Toggle the ToDATE && FromDATE CalendarOpen state on each click
  const toggleFromCalendar = () => {
    setfromCalendarOpen((prevOpen) => !prevOpen);
  };
  const toggleToCalendar = () => {
    settoCalendarOpen((prevOpen) => !prevOpen);
  };
  const formatDate = (date) => {
    const day = date.getDate().toString().padStart(2, "0");
    const month = (date.getMonth() + 1).toString().padStart(2, "0");
    const year = date.getFullYear();
    return `${day}-${month}-${year}`;
  };
  const handlefromDateChange = (date) => {
    setSelectedfromDate(date);
    setfromInputDate(date ? formatDate(date) : "");
    setfromCalendarOpen(false);
  };
  const handlefromInputChange = (e) => {
    setfromInputDate(e.target.value);
  };

  const handlefromKeyPress = (e, inputId) => {
    if (e.key === "Enter") {
      e.preventDefault();
      const fromDateElement = document.getElementById("fromdatevalidation");
      const formattedInput = fromInputDate.replace(
        /^(\d{2})(\d{2})(\d{4})$/,
        "$1-$2-$3",
      );
      const datePattern = /^(0[1-9]|[12][0-9]|3[01])-(0[1-9]|1[0-2])-\d{4}$/;

      if (formattedInput.length === 10 && datePattern.test(formattedInput)) {
        const [day, month, year] = formattedInput.split("-").map(Number);

        if (month > 12 || month === 0) {
          toast.error("Please enter a valid month (MM) between 01 and 12");
          return;
        }

        const daysInMonth = new Date(year, month, 0).getDate();
        if (day > daysInMonth || day === 0) {
          toast.error(`Please enter a valid day (DD) for month ${month}`);
          return;
        }

        const currentDate = new Date();
        const enteredDate = new Date(year, month - 1, day);

        if (GlobalfromDate && enteredDate < GlobalfromDate) {
          toast.error(
            `Date must be after ${GlobalfromDate1} and before ${GlobaltoDate1}`,
          );
          return;
        }
        if (GlobalfromDate && enteredDate > GlobaltoDate) {
          toast.error(
            `Date must be after ${GlobalfromDate1} and before ${GlobaltoDate1}`,
          );
          return;
        }

        fromDateElement.style.border = `1px solid ${fontcolor}`;
        setfromInputDate(formattedInput);

        const nextInput = document.getElementById(inputId);
        if (nextInput) {
          nextInput.focus();
          nextInput.select();
        } else {
          document.getElementById("submitButton").click();
        }
      } else {
        toast.error("Date must be in the format dd-mm-yyyy");
      }
    }
  };

  const handleToKeyPress = (e) => {
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
          toast.error("Please enter a valid month (MM) between 01 and 12");
          return;
        }

        const daysInMonth = new Date(year, month, 0).getDate();
        if (day > daysInMonth || day === 0) {
          toast.error(`Please enter a valid day (DD) for month ${month}`);
          return;
        }

        const currentDate = new Date();
        const enteredDate = new Date(year, month - 1, day);

        if (GlobaltoDate && enteredDate > GlobaltoDate) {
          toast.error(
            `Date must be after ${GlobalfromDate1} and before ${GlobaltoDate1}`,
          );
          return;
        }

        if (GlobaltoDate && enteredDate < GlobalfromDate) {
          toast.error(
            `Date must be after ${GlobalfromDate1} and before ${GlobaltoDate1}`,
          );
          return;
        }

        if (fromInputDate) {
          const fromDate = new Date(
            fromInputDate.split("-").reverse().join("-"),
          );
          if (enteredDate <= fromDate) {
            toast.error("To date must be after from date");
            return;
          }
        }

        toDateElement.style.border = `1px solid ${fontcolor}`;
        settoInputDate(formattedInput);

        if (input1Ref.current) {
          e.preventDefault();
          input1Ref.current.focus();
        }
      } else {
        toast.error("Date must be in the format dd-mm-yyyy");
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

  const handleKeyPress = (e, nextInputRef) => {
    if (e.key === "Enter") {
      e.preventDefault();
      if (nextInputRef.current) {
        nextInputRef.current.focus();
      }
    }
  };

  function fetchReceivableReport() {
    const fromDateElement = document.getElementById("fromdatevalidation");
    const toDateElement = document.getElementById("todatevalidation");

    const dateRegex = /^\d{2}-\d{2}-\d{4}$/;

    let hasError = false;
    let errorType = "";

    switch (true) {
   
      case !fromInputDate:
        errorType = "fromDate";
        break;
      case !toInputDate:
        errorType = "toDate";
        break;
      default:
        hasError = false;
        break;
    }

    if (!dateRegex.test(fromInputDate)) {
      errorType = "fromDateInvalid";
    } else if (!dateRegex.test(toInputDate)) {
      errorType = "toDateInvalid";
    } else {
      const formattedFromInput = fromInputDate.replace(
        /^(\d{2})(\d{2})(\d{4})$/,
        "$1-$2-$3",
      );
      const [fromDay, fromMonth, fromYear] = formattedFromInput
        .split("-")
        .map(Number);
      const enteredFromDate = new Date(fromYear, fromMonth - 1, fromDay);

      const formattedToInput = toInputDate.replace(
        /^(\d{2})(\d{2})(\d{4})$/,
        "$1-$2-$3",
      );
      const [toDay, toMonth, toYear] = formattedToInput.split("-").map(Number);
      const enteredToDate = new Date(toYear, toMonth - 1, toDay);

      if (GlobalfromDate && enteredFromDate < GlobalfromDate) {
        errorType = "fromDateBeforeGlobal";
      } else if (GlobaltoDate && enteredFromDate > GlobaltoDate) {
        errorType = "fromDateAfterGlobal";
      } else if (GlobaltoDate && enteredToDate > GlobaltoDate) {
        errorType = "toDateAfterGlobal";
      } else if (GlobaltoDate && enteredToDate < GlobalfromDate) {
        errorType = "toDateBeforeGlobal";
      } else if (enteredToDate < enteredFromDate) {
        errorType = "toDateBeforeFromDate";
      }
    }

    switch (errorType) {
      
      case "fromDate":
        toast.error("From date is required");
        return;
      case "toDate":
        toast.error("To date is required");
        return;
      case "fromDateInvalid":
        toast.error("From date must be in the format dd-mm-yyyy");
        return;
      case "toDateInvalid":
        toast.error("To date must be in the format dd-mm-yyyy");
        return;
      case "fromDateBeforeGlobal":
        toast.error(
          `From date must be after ${GlobalfromDate1} and before ${GlobaltoDate1}`,
        );
        return;
      case "fromDateAfterGlobal":
        toast.error(
          `From date must be after ${GlobalfromDate1} and before ${GlobaltoDate1}`,
        );
        return;
      case "toDateAfterGlobal":
        toast.error(
          `To date must be after ${GlobalfromDate1} and before ${GlobaltoDate1}`,
        );
        return;
      case "toDateBeforeGlobal":
        toast.error(
          `To date must be after ${GlobalfromDate1} and before ${GlobaltoDate1}`,
        );
        return;
      case "toDateBeforeFromDate":
        toast.error("To date must be after from date");
        return;

      default:
        break;
    }

    // console.log(data);
    document.getElementById("fromdatevalidation").style.border =
      `1px solid ${fontcolor}`;
    document.getElementById("todatevalidation").style.border =
      `1px solid ${fontcolor}`;

   const apiUrl = apiLinks + "/IncomeStatement.php";

setIsLoading(true);

const formData = new URLSearchParams({
  FIntDat: fromInputDate,
  FFnlDat: toInputDate,
  FRepRat: transectionType,

   code: organisation.code,
      FLocCod: locationnumber || getLocationNumber,
      FYerDsc: yeardescription || getyeardescription,

  // code: "EJAZCENTRE",
  // FLocCod: "001",
  // FYerDsc: "2025-2025",
}).toString();

axios
  .post(apiUrl, formData)
  .then((response) => {
    setIsLoading(false);

    if (response.data && typeof response.data === "object") {
      setTableData(response.data);
    } else {
      console.warn(
        "Response data structure is not as expected:",
        response.data
      );

      setTableData({});
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
     if (!hasComponentMountedPreviously || (fromRef && fromRef.current)) {
       if (fromRef && fromRef.current) {
         setTimeout(() => {
           fromRef.current.focus();
           fromRef.current.select();
         }, 0);
       }
       sessionStorage.setItem("componentMounted", "true");
     }
   }, []);
 
   useEffect(() => {
     const currentDate = new Date();
     setSelectedToDate(currentDate);
     settoInputDate(formatDate(currentDate));
 
     const firstDateOfCurrentMonth = new Date(
       currentDate.getFullYear(),
       currentDate.getMonth(),
       1
     );
     setSelectedfromDate(firstDateOfCurrentMonth);
     setfromInputDate(formatDate(firstDateOfCurrentMonth));
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
      item.Date,
      item["Trn#"],
      item.Type,
      item.Description,
      item.Debit,
      item.Credit,
      item.Balance,
    ]);

    // Add summary row to the table

    rows.push([
      "",
      "",
      "",
      "Total",
      String(formatValue(totalDebit)),
      String(formatValue(totalCredit)),
      String(formatValue(closingBalance)),
    ]);

    // Define table column headers and individual column widths
    const headers = [
      "Date",
      "Trn#",
      "Type",
      "Description",
      "Debit",
      "Credit",
      "Balance",
    ];
    const columnWidths = [24, 17, 15, 110, 30, 30, 30];

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
          rightX - 10,
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
        addTitle(
          `General Ledger From: ${fromInputDate} To: ${toInputDate}`,
          "",
          "",
          pageNumber,
          startY,
          12,
        ); // Render sale report title with decreased font size, provide the time, and page number
        startY += -5;

        const labelsX = (doc.internal.pageSize.width - totalWidth) / 2;
        const labelsY = startY + 4; // Position the labels below the titles and above the table

        let status =
          transectionType === "A"
            ? "ALL"
            : transectionType === "CRV"
              ? "Cash Receive Voucher"
              : transectionType === "CPV"
                ? "Cash Payment Voucher"
                : transectionType === "BRV"
                  ? "Bank Receive Voucher"
                  : transectionType === "BPV"
                    ? "Bank Payment Voucher"
                    : transectionType === "JRV"
                      ? "Journal Voucher"
                      : transectionType === "INV"
                        ? "Item Sale"
                        : transectionType === "SRN"
                          ? "Sale Return"
                          : transectionType === "BIL"
                            ? "Purchase"
                            : transectionType === "PRN"
                              ? "Purchase Return"
                              : transectionType === "ISS"
                                ? "Issue"
                                : transectionType === "REC"
                                  ? "Received"
                                  : transectionType === "SLY"
                                    ? "Salary"
                                    : "ALL";

        let search = Companyselectdatavalue.label
          ? Companyselectdatavalue.label
          : "ALL";

        doc.setFont("verdana", "bold");
        doc.setFontSize(10);
        doc.text(`Account :`, labelsX, labelsY + 8.5); // Draw bold label
        doc.setFont("verdana-regular", "normal");
        doc.setFontSize(10);
        doc.text(`${search}`, labelsX + 25, labelsY + 8.5); // Draw the value next to the label

        doc.setFont("verdana", "bold");
        doc.setFontSize(10);
        doc.text(`Type :`, labelsX + 170, labelsY + 8.5); // Draw bold label
        doc.setFont("verdana-regular", "normal");
        doc.setFontSize(10);
        doc.text(`${status}`, labelsX + 185, labelsY + 8.5); // Draw the value next to the label

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
    doc.save(`GeneralLedger Form ${fromInputDate} To ${toInputDate}.pdf`);
  };
  ///////////////////////////// DOWNLOAD PDF CODE ////////////////////////////////////////////////////////////
  ///////////////////////////// DOWNLOAD PDF EXCEL //////////////////////////////////////////////////////////
  const handleDownloadCSV = async () => {
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet("Sheet1");

    const numColumns = 4; // Ensure this matches the actual number of columns

    const columnAlignments = [
      "center",
      "left",
     
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
      cell.font = fontCompanyName;
      cell.alignment = { horizontal: "center" };
    });

    worksheet.getRow(companyRow.number).height = 30;
    worksheet.mergeCells(
      `A${companyRow.number}:${String.fromCharCode(66 + numColumns - 1)}${
        companyRow.number
      }`,
    );

    // Add Store List row
    const storeListRow = worksheet.addRow([
      `Supplier Purchase Comparison Report From ${fromInputDate} To ${toInputDate}`,
    ]);
    storeListRow.eachCell((cell) => {
      cell.font = fontStoreList;
      cell.alignment = { horizontal: "center" };
    });

    worksheet.mergeCells(
      `A${storeListRow.number}:${String.fromCharCode(66 + numColumns - 1)}${
        storeListRow.number
      }`,
    );

    // Add an empty row after the title section
    worksheet.addRow([]);

    let typestatus = "";

    if (transectionType === "A") {
      typestatus = "ALL";
    } else if (transectionType === "CRV") {
      typestatus = "CASH RECEIVE VOUCHER";
    } else if (transectionType === "CPV") {
      typestatus = "CASH PAYMENT VOUCHER";
    } else if (transectionType === "BRV") {
      typestatus = "BANK RECEIVE VOUCHER";
    } else if (transectionType === "BPV") {
      typestatus = "BANK PAYMENT VOUCHER";
    } else if (transectionType === "JRV") {
      typestatus = "JOURNAL VOUCHER";
    } else if (transectionType === "INV") {
      typestatus = "ITEM SALE";
    } else if (transectionType === "SRN") {
      typestatus = "SALE RETURN";
    } else if (transectionType === "BIL") {
      typestatus = "PURCHASE";
    } else if (transectionType === "PRN") {
      typestatus = "PURCHASE RETURN";
    } else if (transectionType === "ISS") {
      typestatus = "ISSUE";
    } else if (transectionType === "REC") {
      typestatus = "RECEIVE";
    } else if (transectionType === "SLY") {
      typestatus = "SALARY";
    } else {
      typestatus = "ALL"; // Default value
    }

    let Accountselect = Companyselectdatavalue.label
      ? Companyselectdatavalue.label
      : "ALL";

    let typesearch = searchQuery || "";

    // Apply styling for the status row
    const typeAndStoreRow2 = worksheet.addRow([
      "ACCOUNT :",
      Accountselect,
      "",
      "",
      "TYPE :",
      typestatus,
    ]);

    const typeAndStoreRow3 = worksheet.addRow(
      searchQuery ? ["", "", "", "", "SEARCH :", typesearch] : [""],
    );

    // Merge cells for Accountselect (columns B to D)
    worksheet.mergeCells(
      `B${typeAndStoreRow2.number}:D${typeAndStoreRow2.number}`,
    );

    // Apply styling for the status row
    typeAndStoreRow2.eachCell((cell, colIndex) => {
      cell.font = {
        name: "CustomFont" || "CustomFont",
        size: 10,
        bold: [1, 5].includes(colIndex),
      };
      cell.alignment = {
        horizontal: colIndex === 2 ? "left" : "left", // Left align the account name
        vertical: "middle",
      };
    });

    typeAndStoreRow3.eachCell((cell, colIndex) => {
      cell.font = {
        name: "CustomFont" || "CustomFont",
        size: 10,
        bold: [5].includes(colIndex),
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
      "Date",
      "Trn#",
      "Type",
      "Description",
      "Debit",
      "Credit",
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
        item.Debit,
        item.Credit,
        item.Balance,
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

    const totalRow = worksheet.addRow([
      "",
      "",
      "",
      "Total",
      totalDebit,
      totalCredit,
      closingBalance,
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
      if (colNumber === 5 || colNumber === 6 || colNumber === 7) {
        cell.alignment = { horizontal: "right" };
      }
    });

    // Set column widths
    [10, 7, 7, 45, 15, 15, 15].forEach((width, index) => {
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
      `A${dateTimeRow.number}:${String.fromCharCode(65 + numColumns - 1)}${dateTimeRow.number}`,
    );
    worksheet.mergeCells(
      `A${dateTimeRow1.number}:${String.fromCharCode(65 + numColumns - 1)}${dateTimeRow1.number}`,
    );

    // Generate and save the Excel file
    const buffer = await workbook.xlsx.writeBuffer();
    const blob = new Blob([buffer], {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    });
    saveAs(blob, `GeneralLedger  From ${fromInputDate} To ${toInputDate}.xlsx`);
  };
  ///////////////////////////// DOWNLOAD PDF EXCEL ///////////////////////////////////////////////////////////

  const dispatch = useDispatch();

  const tableTopColor = "#3368B5";
  const tableHeadColor = "#3368b5";
  const secondaryColor = "white";
  const btnColor = "#3368B5";
  const textColor = "white";

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
        (data) => data.tusrnam && data.tusrnam.toLowerCase().includes(query),
      );
    }
    return filteredData;
  };
 

  const firstColWidth = {
    width: "80px",
  };
  const secondColWidth = {
    width: "54px",
  };
  const thirdColWidth = {
    width: "32px",
  };
  const forthColWidth = {
    width: "360px",
  };
  const fifthColWidth = {
    width: "90px",
  };
  const sixthColWidth = {
    width: "90px",
  };
  const seventhColWidth = {
    width: "90px",
  };

  const sixthcol = { width: "8px" };

  useHotkeys(
    "alt+s",
    () => {
      fetchReceivableReport();
      //    resetSorting();
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
    maxWidth: "600px",
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

  const parseDate = (dateString) => {
    const [day, month, year] = dateString.split("-").map(Number);
    return new Date(year, month - 1, day);
  };

  const handleRadioChange = (days) => {
    const toDate = parseDate(toInputDate);
    const fromDate = new Date(toDate);
    fromDate.setUTCDate(fromDate.getUTCDate() - days);

    setSelectedfromDate(fromDate);
    setfromInputDate(formatDate(fromDate));
    setSelectedRadio(days === 0 ? "custom" : `${days}days`);
  };

 

  // this function for hide the 0 value figure from the table data

  const formatValue = (val) => {
    return Number(val) === 0 ? "" : val;
  };

  const isMatchedRow = (item) => {
    if (!searchQuery) return false; // no highlight if search is empty

    const query = searchQuery.toUpperCase();

    // you can match anything you want:
    return (
      item.Description?.toUpperCase().includes(query) ||
      item.Type?.toUpperCase().includes(query) ||
      item.Date?.toUpperCase().includes(query) ||
      String(item["Trn#"])?.includes(query)
    );
  };


  const boxStyle = {
  fontSize: getdatafontsize,
  fontFamily: getfontstyle,
  width: "100%",
  height: "100%",
  border: `1px solid ${fontcolor}`,
  display: "flex",
  alignItems: "center",
  justifyContent: "end",
  paddingRight: "5px",
};

  return (
    <>
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
          <NavComponent textdata="Income Statement" />

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
              {/* ------ */}

 <div className="d-flex align-items-center">
                <div
                  style={{
                    width: "80px",
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
                      From :
                    </span>
                  </label>
                </div>
                <div
                  id="fromdatevalidation"
                  style={{
                    width: "135px",
                    border: `1px solid ${fontcolor}`,
                    display: "flex",
                    alignItems: "center",
                    height: "24px",
                    justifyContent: "center",
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
                    style={{
                      height: "20px",
                      width: "90px",
                      paddingLeft: "5px",
                      outline: "none",
                      border: "none",
                      fontSize: "12px",
                      backgroundColor: getcolor,
                      color: fontcolor,
                      opacity: selectedRadio === "custom" ? 1 : 0.5,
                      pointerEvents:
                        selectedRadio === "custom" ? "auto" : "none",
                    }}
                    id="frominputid"
                    value={fromInputDate}
                    ref={fromRef}
                    onChange={handlefromInputChange}
                    onKeyDown={(e) => handlefromKeyPress(e, "toDatePicker")}
                    autoComplete="off"
                    placeholder="dd-mm-yyyy"
                    aria-label="Date Input"
                    disabled={selectedRadio !== "custom"}
                  />
                  <DatePicker
                    selected={selectedfromDate}
                    onChange={handlefromDateChange}
                    dateFormat="dd-MM-yyyy"
                    popperPlacement="bottom"
                    showPopperArrow={false}
                    open={fromCalendarOpen}
                    dropdownMode="select"
                    customInput={
                      <div>
                        <BsCalendar
                          onClick={
                            selectedRadio === "custom"
                              ? toggleFromCalendar
                              : undefined
                          }
                          style={{
                            cursor:
                              selectedRadio === "custom"
                                ? "pointer"
                                : "default",
                            marginLeft: "18px",
                            fontSize: getdatafontsize,
                            fontFamily: getfontstyle,
                            color: fontcolor,
                            opacity: selectedRadio === "custom" ? 1 : 0.5,
                          }}
                          disabled={selectedRadio !== "custom"}
                        />
                      </div>
                    }
                    disabled={selectedRadio !== "custom"}
                  />
                </div>
              </div>
              <div
                className="d-flex align-items-center"
                style={{ marginLeft: "15px" }}
              >
                <div
                  style={{
                    width: "60px",
                    display: "flex",
                    justifyContent: "end",
                  }}
                >
                  <label htmlFor="toDatePicker">
                    <span
                      style={{
                        fontSize: getdatafontsize,
                        fontFamily: getfontstyle,
                        fontWeight: "bold",
                      }}
                    >
                      To :
                    </span>
                  </label>
                </div>
                <div
                  id="todatevalidation"
                  style={{
                    width: "135px",
                    border: `1px solid ${fontcolor}`,
                    display: "flex",
                    alignItems: "center",
                    height: "24px",
                    justifyContent: "center",
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
                      border: "none",
                      fontSize: getdatafontsize,
                      fontFamily: getfontstyle,
                      backgroundColor: getcolor,
                      color: fontcolor,
                      opacity: selectedRadio === "custom" ? 1 : 0.5,
                      pointerEvents:
                        selectedRadio === "custom" ? "auto" : "none",
                    }}
                    value={toInputDate}
                    onChange={handleToInputChange}
                    onKeyDown={(e) => handleToKeyPress(e, "submitButton")}
                    id="toDatePicker"
                    autoComplete="off"
                    placeholder="dd-mm-yyyy"
                    aria-label="To Date Input"
                    disabled={selectedRadio !== "custom"}
                  />
                  <DatePicker
                    selected={selectedToDate}
                    onChange={handleToDateChange}
                    dateFormat="dd-MM-yyyy"
                    popperPlacement="bottom"
                    showPopperArrow={false}
                    open={toCalendarOpen}
                    dropdownMode="select"
                    customInput={
                      <div>
                        <BsCalendar
                          onClick={
                            selectedRadio === "custom"
                              ? toggleToCalendar
                              : undefined
                          }
                          style={{
                            cursor:
                              selectedRadio === "custom"
                                ? "pointer"
                                : "default",
                            marginLeft: "18px",
                            fontSize: getdatafontsize,
                            fontFamily: getfontstyle,
                            color: fontcolor,
                            opacity: selectedRadio === "custom" ? 1 : 0.5,
                          }}
                          disabled={selectedRadio !== "custom"}
                        />
                      </div>
                    }
                    disabled={selectedRadio !== "custom"}
                  />
                </div>
              </div>
              

              <div
                className="d-flex align-items-center"
                style={{ marginRight: "21px" }}
              >
                <div
                  style={{
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
                      width: "100px",
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
              </div>
            </div>
          </div>

        <div style={{border:`1px solid ${fontcolor}`}}></div>
          <div style={{ 
              maxHeight: "65vh",
    overflowY: "auto",
    overflowX: "hidden",
    }}>
         
         {/* SALE SECTION */}
         <div style={{display:'flex', flexDirection:'column', justifyContent:'start', alignItems:'start'}}>
         
          <div 
          style={{       
            width:'100%',
            paddingLeft:'20px',
            fontSize: getdatafontsize,
            fontFamily: getfontstyle,
            fontWeight: "bold",
            textAlign:'start',
            color:'red'
                        
            }} >SALES</div>

           <div className="row" style={{display:'flex',alignItems:'center', height:'20px',width:'100%', margin:'0px', textAlign:'start'}}>
            <div style={{ width:'10%'}} ></div>
            <div style={{ 
              width:'30%', 
              padding:'0px',
               fontSize: getdatafontsize,
            fontFamily: getfontstyle,
            fontWeight: "bold",
              }} >Total Sale For the Period:</div>

             <div style={{width:"20%"}} ></div>
              <div style={{width:'20%', height:'100%', padding:'0px'}} >
                <div style={boxStyle}>
                  {tableData["Total Sales"]}
                </div>
              </div>
               <div style={{width:"20%"}} ></div>
           </div>
         </div>

         {/* PURCHASE SECTION */}
         <div style={{display:'flex', flexDirection:'column', gap:"2px",justifyContent:'start', alignItems:'start'}}>
         
          <div 
          style={{       
            width:'100%',
            paddingLeft:'20px',
            fontSize: getdatafontsize,
            fontFamily: getfontstyle,
            fontWeight: "bold",
            textAlign:'start',
            color:'red'
                        
            }} >PURCHASE</div>

           <div className="row" style={{display:'flex', alignItems:'center',width:'100%', height:'20px',margin:'0px', textAlign:'start'}}>
            <div style={{ width:'10%'}} ></div>
            <div style={{ 
              width:'30%', 
              padding:'0px',
               fontSize: getdatafontsize,
            fontFamily: getfontstyle,
            fontWeight: "bold",
            display:'flex',
            textAlign:"center"
              }} >Opening Stock</div>

             
              <div style={{width:'20%', height:'100%', padding:'0px'}} >
                <div style={boxStyle}>
{tableData["Opening Stock"]}
                </div>
              </div>
              <div style={{width:"20%"}} ></div>
               <div style={{width:"20%"}} ></div>
           </div>

            <div className="row" style={{display:'flex', alignItems:'center',width:'100%', height:'20px',margin:'0px', textAlign:'start'}}>
            <div style={{ width:'10%'}} ></div>
            <div style={{ 
              width:'30%', 
              padding:'0px',
               fontSize: getdatafontsize,
            fontFamily: getfontstyle,
            fontWeight: "bold",
            display:'flex',
            textAlign:"center"
              }} >Purchases</div>

             
              <div style={{width:'20%', height:'100%', padding:"0px"}} >
                <div style={boxStyle}>
  {tableData["Purchases During The Period"]}
</div>
              </div>
              <div style={{width:"20%"}} ></div>
               <div style={{width:"20%"}} ></div>
           </div>

  <div className="row" style={{display:'flex', alignItems:'center',width:'100%', height:'20px',margin:'0px', textAlign:'start'}}>
            <div style={{ width:'10%'}} ></div>
            <div style={{ 
              width:'30%', 
              padding:'0px',
               fontSize: getdatafontsize,
            fontFamily: getfontstyle,
            fontWeight: "bold",
            display:'flex',
            textAlign:"center"
              }} >Stock Available for Sale</div>

             
              <div style={{width:'20%', height:'100%', padding:'0px'}} >
                <div style={boxStyle}>
                  {tableData["Goods Available For Sale"]}
                </div>
              </div>
              <div style={{width:"20%"}} ></div>
               <div style={{width:"20%"}} ></div>
           </div>

           <div className="row" style={{display:'flex', alignItems:'center',width:'100%', height:'20px',margin:'0px', textAlign:'start'}}>
            <div style={{ width:'10%'}} ></div>
            <div style={{ 
              width:'30%', 
              padding:'0px',
               fontSize: getdatafontsize,
            fontFamily: getfontstyle,
            fontWeight: "bold",
            display:'flex',
            textAlign:"center"
              }} >Less Closing Stock</div>

             
              <div style={{width:'20%', height:'100%', padding:"0px"}} >
                <div style={boxStyle}>
                  {tableData["Less Closing Stock"]}
                </div>
              </div>
              <div style={{width:"20%"}} ></div>
               <div style={{width:"20%"}} ></div>
           </div>
            <div className="row" style={{display:'flex', alignItems:'center',width:'100%', height:'20px',margin:'0px', textAlign:'start'}}>
            <div style={{ width:'10%'}} ></div>
            <div style={{ 
              width:'30%', 
              padding:'0px',
               fontSize: getdatafontsize,
            fontFamily: getfontstyle,
            fontWeight: "bold",
            display:'flex',
            textAlign:"center",
            color:'red'
              }} >Less Cost of Goods Sold</div>

             
              <div style={{width:'20%', height:'100%', padding:'0px'}} >
                <div style={boxStyle}>
                  {tableData["Cost Of Goods Sold"]}
                </div>
              </div>
              <div style={{width:"20%"}} ></div>
               <div style={{width:"20%"}} ></div>
           </div>


             <div className="row" style={{display:'flex', alignItems:'center',width:'100%', height:'20px',margin:'0px', textAlign:'start'}}>
            <div style={{ width:'30%'}} ></div>
            <div style={{ 
              width:'30%', 
              padding:'0px',
               fontSize: getdatafontsize,
            fontFamily: getfontstyle,
            fontWeight: "bold",
            display:'flex',
            textAlign:"center",
            color:'green'
              }} >GROSS PROFIT</div>

             
              <div style={{width:'20%', height:'100%', padding:'0px'}} >
                <div style={boxStyle}>{tableData["GROSS PROFIT"]}</div>
              </div>
              <div style={{width:"12%", height:'100%', padding:'0px', marginLeft:"10px"}} >
                                <div style={boxStyle}>{tableData["GROSS PROFIT Percentage"]}</div>

              </div>
               <div style={{width:"5%", display:'flex', justifyContent:'start'}} >%</div>
           </div>

         </div>


         {/* EXPENSE SECTION */}

           <div style={{display:'flex', flexDirection:'column', gap:"2px",justifyContent:'start', alignItems:'start'}}>
         
          <div 
          style={{       
            width:'100%',
            paddingLeft:'20px',
            fontSize: getdatafontsize,
            fontFamily: getfontstyle,
            fontWeight: "bold",
            textAlign:'start',
            color:'red'
                        
            }} >EXPENSES</div>

           <div className="row" style={{display:'flex', alignItems:'center',width:'100%', height:'20px',margin:'0px', textAlign:'start'}}>
            <div style={{ width:'10%'}} ></div>
            <div style={{ 
              width:'30%', 
              padding:'0px',
               fontSize: getdatafontsize,
            fontFamily: getfontstyle,
            fontWeight: "bold",
            display:'flex',
           justifyContent:'end',
           paddingRight:'10px'
              }} >Admin Expenses</div>

             
              <div style={{width:'20%', height:'100%', padding:'0px'}} >
                <div style={boxStyle}>{tableData["Admin Expenses"]}</div>
              </div>
              <div style={{width:"20%"}} ></div>
               <div style={{width:"20%"}} ></div>
           </div>

            <div className="row" style={{display:'flex', alignItems:'center',width:'100%', height:'20px',margin:'0px', textAlign:'start'}}>
            <div style={{ width:'10%'}} ></div>
            <div style={{ 
              width:'30%', 
              padding:'0px',
               fontSize: getdatafontsize,
            fontFamily: getfontstyle,
            fontWeight: "bold",
            display:'flex',
            justifyContent:'end',
           paddingRight:'10px'
              }} >Marketing Expenses</div>

             
              <div style={{width:'20%', height:'100%', padding:"0px"}} >
                <div style={boxStyle}>{tableData["Marketting Expenses"]}</div>
              </div>
              <div style={{width:"20%"}} ></div>
               <div style={{width:"20%"}} ></div>
           </div>

  <div className="row" style={{display:'flex', alignItems:'center',width:'100%', height:'20px',margin:'0px', textAlign:'start'}}>
            <div style={{ width:'10%'}} ></div>
            <div style={{ 
              width:'30%', 
              padding:'0px',
               fontSize: getdatafontsize,
            fontFamily: getfontstyle,
            fontWeight: "bold",
            display:'flex',
         justifyContent:'end',
           paddingRight:'10px'
              }} >Financail Expenses</div>

             
              <div style={{width:'20%', height:'100%', padding:'0px'}} >
                <div style={boxStyle}>{tableData["Financial Expenses"]}</div>
              </div>
              <div style={{width:"20%"}} ></div>
               <div style={{width:"20%"}} ></div>
           </div>


           
           <div className="row" style={{display:'flex', alignItems:'center',width:'100%', height:'20px',margin:'0px', textAlign:'start'}}>
            
           </div>

             <div className="row" style={{display:'flex', alignItems:'center',width:'100%', height:'20px',margin:'0px', textAlign:'start'}}>
            <div style={{ width:'10%'}} ></div>
            <div style={{ 
              width:'30%', 
              padding:'0px',
               fontSize: getdatafontsize,
            fontFamily: getfontstyle,
            fontWeight: "bold",
            display:'flex',
            textAlign:"center",
            color:"red"
              }} >Less Total Expenses</div>

             
              <div style={{width:'20%', height:'100%', padding:"0px"}} >
                <div style={boxStyle}>{tableData[ "Total Expenses"]}</div>
              </div>

             <div style={{width:'20%', height:'100%', padding:'0px'}} >
                {/* <div style={{width:'100%',height:'100%', border:`1px solid ${fontcolor}`}}></div> */}
              </div>
              <div style={{width:"12%", height:'100%', padding:'0px', marginLeft:"10px"}} >
                                <div style={boxStyle}>{tableData["Expenses Percentage"]}</div>

              </div>
               <div style={{width:"5%", display:'flex', justifyContent:'start'}} >%</div>


               
           </div>
            <div className="row" style={{display:'flex', alignItems:'center',width:'100%', height:'20px',margin:'0px', textAlign:'start'}}>
            <div style={{ width:'30%'}} ></div>
            <div style={{ 
              width:'30%', 
              padding:'0px',
               fontSize: getdatafontsize,
            fontFamily: getfontstyle,
            fontWeight: "bold",
            display:'flex',
            textAlign:"center",
            color:'green'
              }} >NET PROFIT</div>

             
              <div style={{width:'20%', height:'100%', padding:'0px'}} >
                <div style={boxStyle}>{tableData["NET PROFIT"]}</div>
              </div>
              <div style={{width:"12%", height:'100%', padding:'0px', marginLeft:"10px"}} >
                                <div style={boxStyle}>{tableData["NET PROFIT Percentage"]}</div>

              </div>
               <div style={{width:"5%", display:'flex', justifyContent:'start'}} >%</div>
           </div>

        
          

         </div>

{/* OTHER INCOME */}
 <div style={{display:'flex', flexDirection:'column', gap:"2px",justifyContent:'start', alignItems:'start'}}>
         
          <div 
          style={{       
            width:'100%',
            paddingLeft:'20px',
            fontSize: getdatafontsize,
            fontFamily: getfontstyle,
            fontWeight: "bold",
            textAlign:'start',
            color:'red'
                        
            }} >OTHER INCOME</div>

           <div className="row" style={{display:'flex', alignItems:'center',width:'100%', height:'20px',margin:'0px', textAlign:'start'}}>
            <div style={{ width:'10%'}} ></div>
            <div style={{ 
              width:'30%', 
              padding:'0px',
               fontSize: getdatafontsize,
            fontFamily: getfontstyle,
            fontWeight: "bold",
            display:'flex',
            textAlign:"center"
              }} >Other Profit</div>

             
              <div style={{width:'20%', height:'100%', padding:'0px'}} >
                <div style={boxStyle}>{tableData["Other Profit"]}</div>
              </div>
              <div style={{width:"20%"}} ></div>
               <div style={{width:"20%"}} ></div>
           </div>

            {/* <div className="row" style={{display:'flex', alignItems:'center',width:'100%', height:'20px',margin:'0px', textAlign:'start'}}>
            <div style={{ width:'10%'}} ></div>
            <div style={{ 
              width:'30%', 
              padding:'0px',
               fontSize: getdatafontsize,
            fontFamily: getfontstyle,
            fontWeight: "bold",
            display:'flex',
            textAlign:"center"
              }} >Purchases</div>

             
              <div style={{width:'20%', height:'100%', padding:"0px"}} >
                <div style={{width:'100%',height:'100%', border:`1px solid ${fontcolor}`}}></div>
              </div>
              <div style={{width:"20%"}} ></div>
               <div style={{width:"20%"}} ></div>
           </div> */}

  {/* <div className="row" style={{display:'flex', alignItems:'center',width:'100%', height:'20px',margin:'0px', textAlign:'start'}}>
            <div style={{ width:'10%'}} ></div>
            <div style={{ 
              width:'30%', 
              padding:'0px',
               fontSize: getdatafontsize,
            fontFamily: getfontstyle,
            fontWeight: "bold",
            display:'flex',
            textAlign:"center"
              }} >Stock Available for Sale</div>

             
              <div style={{width:'20%', height:'100%', padding:'0px'}} >
                <div style={{width:'100%',height:'100%', border:`1px solid ${fontcolor}`}}></div>
              </div>
              <div style={{width:"20%"}} ></div>
               <div style={{width:"20%"}} ></div>
           </div> */}

           {/* <div className="row" style={{display:'flex', alignItems:'center',width:'100%', height:'20px',margin:'0px', textAlign:'start'}}>
            <div style={{ width:'10%'}} ></div>
            <div style={{ 
              width:'30%', 
              padding:'0px',
               fontSize: getdatafontsize,
            fontFamily: getfontstyle,
            fontWeight: "bold",
            display:'flex',
            textAlign:"center"
              }} >Less Closing Stock</div>

             
              <div style={{width:'20%', height:'100%', padding:"0px"}} >
                <div style={{width:'100%',height:'100%', border:`1px solid ${fontcolor}`}}></div>
              </div>
              <div style={{width:"20%"}} ></div>
               <div style={{width:"20%"}} ></div>
           </div>
            <div className="row" style={{display:'flex', alignItems:'center',width:'100%', height:'20px',margin:'0px', textAlign:'start'}}>
            <div style={{ width:'10%'}} ></div>
            <div style={{ 
              width:'30%', 
              padding:'0px',
               fontSize: getdatafontsize,
            fontFamily: getfontstyle,
            fontWeight: "bold",
            display:'flex',
            textAlign:"center",
            color:'red'
              }} >Less Cost of Goods Sold</div>

             
              <div style={{width:'20%', height:'100%', padding:'0px'}} >
                <div style={{width:'100%',height:'100%', border:`1px solid ${fontcolor}`}}></div>
              </div>
              <div style={{width:"20%"}} ></div>
               <div style={{width:"20%"}} ></div>
           </div> */}


             <div className="row" style={{display:'flex', alignItems:'center',width:'100%', height:'20px',margin:'0px', textAlign:'start'}}>
            <div style={{ width:'30%'}} ></div>
            <div style={{ 
              width:'30%', 
              padding:'0px',
               fontSize: getdatafontsize,
            fontFamily: getfontstyle,
            fontWeight: "bold",
            display:'flex',
            textAlign:"center",
            color:'green'
              }} >TOTAL PROFIT</div>

             
              <div style={{width:'20%', height:'100%', padding:'0px'}} >
                <div style={boxStyle}>{tableData["TOTAL PROFIT"]}</div>
              </div>
              <div style={{width:"12%", height:'100%', padding:'0px', marginLeft:"10px"}} >
                                <div style={boxStyle}>{tableData["TOTAL PROFIT Percentage"]}</div>

              </div>
               <div style={{width:"5%", display:'flex', justifyContent:'start'}} >%</div>
           </div>

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
              ref={input3Ref}
              onClick={fetchReceivableReport}
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
