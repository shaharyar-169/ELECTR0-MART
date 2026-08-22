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

export default function InstallmentInvestmentStatusReport() {
  const navigate = useNavigate();
  const user = getUserData();
  const organisation = getOrganisationData();

  const saleSelectRef = useRef(null);
  const input1Ref = useRef(null);
  const input2Ref = useRef(null);
  const input3Ref = useRef(null);

  const toRef = useRef(null);
  const fromRef = useRef(null);
  const currentDateRef = useRef(null);

  const [saleType, setSaleType] = useState("");
  const [transectionType, settransectionType] = useState("");
  const [supplierList, setSupplierList] = useState([]);

  // Updated total states
  const [totalCost, setTotalCost] = useState(0);
  const [totalSale, setTotalSale] = useState(0);
  const [totalProfit, setTotalProfit] = useState(0);
  const [totalAdvance, setTotalAdvance] = useState(0);
  const [totalCollection, setTotalCollection] = useState(0);
  const [totalBalance, setTotalBalance] = useState(0);
  const [totalInvestment, setTotalInvestment] = useState(0);

  // state for from DatePicker
  const [selectedfromDate, setSelectedfromDate] = useState(null);
  const [fromInputDate, setfromInputDate] = useState("");
  const [fromCalendarOpen, setfromCalendarOpen] = useState(false);

  // state for To DatePicker
  const [selectedToDate, setSelectedToDate] = useState(null);
  const [toInputDate, settoInputDate] = useState("");
  const [toCalendarOpen, settoCalendarOpen] = useState(false);

  // state for Current DatePicker
  const [selectedCurrentDate, setSelectedCurrentDate] = useState(null);
  const [currentInputDate, setCurrentInputDate] = useState("");
  const [currentCalendarOpen, setCurrentCalendarOpen] = useState(false);

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

const locationnumber = getLocationnumber();

  useEffect(() => {
    document.documentElement.style.setProperty("--background-color", getcolor);
  }, [getcolor]);

  const comapnyname = organisation.description;

  const [selectedRadio, setSelectedRadio] = useState("custom");

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

  // Toggle the CalendarOpen state on each click
  const toggleFromCalendar = () => {
    setfromCalendarOpen((prevOpen) => !prevOpen);
  };
  const toggleToCalendar = () => {
    settoCalendarOpen((prevOpen) => !prevOpen);
  };
  const toggleCurrentCalendar = () => {
    setCurrentCalendarOpen((prevOpen) => !prevOpen);
  };

  const formatDate = (date) => {
    const day = date.getDate().toString().padStart(2, "0");
    const month = (date.getMonth() + 1).toString().padStart(2, "0");
    const year = date.getFullYear();
    return `${day}-${month}-${year}`;
  };

  // Get first day of current month
  const getFirstDayOfMonth = () => {
    const now = new Date();
    return new Date(now.getFullYear(), now.getMonth(), 1);
  };

  // Get last day of current month
  const getLastDayOfMonth = () => {
    const now = new Date();
    return new Date(now.getFullYear(), now.getMonth() + 1, 0);
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

  // ============================================
  // POINT 1: UPDATED - Sirf focus karo, select nahi
  // ============================================
  const handleToKeyPress = (e, nextref) => {
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

        // CHANGED: Sirf focus karo, select nahi
        if (currentDateRef.current) {
          e.preventDefault();
          currentDateRef.current.focus();
          currentDateRef.current.select();
          // REMOVED: currentDateRef.current.select();
        }
      } else {
        toast.error("Date must be in the format dd-mm-yyyy");
      }
    }
  };

  const handleCurrentKeyPress = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      const currentDateElement = document.getElementById(
        "currentdatevalidation",
      );
      const formattedInput = currentInputDate.replace(
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

        currentDateElement.style.border = `1px solid ${fontcolor}`;
        setCurrentInputDate(formattedInput);

        document.getElementById("submitButton").click();
        document.getElementById("submitButton").focus();
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

  const handleCurrentDateChange = (date) => {
    setSelectedCurrentDate(date);
    setCurrentInputDate(date ? formatDate(date) : "");
    setCurrentCalendarOpen(false);
  };
  const handleCurrentInputChange = (e) => {
    setCurrentInputDate(e.target.value);
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

  function fetchReceivableReport() {
    const fromDateElement = document.getElementById("fromdatevalidation");
    const toDateElement = document.getElementById("todatevalidation");
    const currentDateElement = document.getElementById("currentdatevalidation");

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
      case !currentInputDate:
        errorType = "currentDate";
        break;
      default:
        hasError = false;
        break;
    }

    if (!dateRegex.test(fromInputDate)) {
      errorType = "fromDateInvalid";
    } else if (!dateRegex.test(toInputDate)) {
      errorType = "toDateInvalid";
    } else if (!dateRegex.test(currentInputDate)) {
      errorType = "currentDateInvalid";
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

      const formattedCurrentInput = currentInputDate.replace(
        /^(\d{2})(\d{2})(\d{4})$/,
        "$1-$2-$3",
      );
      const [currentDay, currentMonth, currentYear] = formattedCurrentInput
        .split("-")
        .map(Number);
      const enteredCurrentDate = new Date(
        currentYear,
        currentMonth - 1,
        currentDay,
      );

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
      } else if (GlobaltoDate && enteredCurrentDate > GlobaltoDate) {
        errorType = "currentDateAfterGlobal";
      } else if (GlobaltoDate && enteredCurrentDate < GlobalfromDate) {
        errorType = "currentDateBeforeGlobal";
      }
    }

    switch (errorType) {
      case "fromDate":
        toast.error("From date is required");
        return;
      case "toDate":
        toast.error("To date is required");
        return;
      case "currentDate":
        toast.error("Current date is required");
        return;
      case "fromDateInvalid":
        toast.error("From date must be in the format dd-mm-yyyy");
        return;
      case "toDateInvalid":
        toast.error("To date must be in the format dd-mm-yyyy");
        return;
      case "currentDateInvalid":
        toast.error("Current date must be in the format dd-mm-yyyy");
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
      case "currentDateAfterGlobal":
        toast.error(
          `Current date must be after ${GlobalfromDate1} and before ${GlobaltoDate1}`,
        );
        return;
      case "currentDateBeforeGlobal":
        toast.error(
          `Current date must be after ${GlobalfromDate1} and before ${GlobaltoDate1}`,
        );
        return;
      default:
        break;
    }

    document.getElementById("fromdatevalidation").style.border =
      `1px solid ${fontcolor}`;
    document.getElementById("todatevalidation").style.border =
      `1px solid ${fontcolor}`;
    document.getElementById("currentdatevalidation").style.border =
      `1px solid ${fontcolor}`;

    const apiUrl = apiLinks + "/InstallmentInvestmentStatusReport.php";
    setIsLoading(true);
    const formData = new URLSearchParams({
      FIntDat: fromInputDate,
      FFnlDat: toInputDate,
      FRepDat: currentInputDate,
      code: organisation.code,
      FLocCod: locationnumber || getLocationNumber,
    //   code: "REHMANTRD",
    //   FLocCod: "001",
    }).toString();

    axios
      .post(apiUrl, formData)
      .then((response) => {
        setIsLoading(false);

        setTotalCost(response.data["Total Cost "] || 0);
        setTotalSale(response.data["Total Sale "] || 0);
        setTotalProfit(response.data["Total Profit "] || 0);
        setTotalAdvance(response.data["Total Advance "] || 0);
        setTotalCollection(response.data["Total Collection "] || 0);
        setTotalBalance(response.data["Total Balance "] || 0);
        setTotalInvestment(response.data["Total Investment "] || 0);

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
    const firstDay = getFirstDayOfMonth();
    const lastDay = getLastDayOfMonth();

    setSelectedfromDate(firstDay);
    setfromInputDate(formatDate(firstDay));
    setSelectedToDate(lastDay);
    settoInputDate(formatDate(lastDay));
    setSelectedCurrentDate(currentDate);
    setCurrentInputDate(formatDate(currentDate));
  }, []);

  const handleTransactionTypeChange = (event) => {
    const selectedTransactionType = event.target.value;
    settransectionType(selectedTransactionType);
  };

  ///////////////////////////// DOWNLOAD PDF CODE ////////////////////////////////////////////////////////////
 const exportPDFHandler = () => {
  const doc = new jsPDF({ orientation: "landscape" });

  const rows = tableData.map((item) => [
    item.Code || "",
    item.Customer || "",
    item.Cost || "",
    item.SaleAmt || "",
    item.InsNo || "",
    item.AdvanceAmt || "",
    item.Collection || "",
    item.Profit || "",
    item.ProfitPrc || "",
    item.Balance || "",
    item.Investment || "",
  ]);

  rows.push([
   String(tableData.length.toLocaleString()),
    "",
    String(totalCost),
    String(totalSale),
    "",
    String(totalAdvance),
    String(totalCollection),
    String(totalProfit),
    "",
    String(totalBalance),
    String(totalInvestment),
  ]);

  const headers = [
    "Code",
    "Customer",
    "Cost",
    "Sale Amt",
    "InsNo",
    "Adv Amt",
    "Coll",
    "Profit",
    "Profit %",
    "Balance",
    "Inves",
  ];

  const columnWidths = [24, 75, 22, 22, 15, 25, 22, 22, 18, 22, 22];

  const totalWidth = columnWidths.reduce((acc, width) => acc + width, 0);
  const pageHeight = doc.internal.pageSize.height;
  const paddingTop = 15;

  doc.setFont("verdana-regular", "normal");
  doc.setFontSize(10);

  const addTableHeaders = (startX, startY) => {
    doc.setFont("verdana", "bold");
    doc.setFontSize(10);

    headers.forEach((header, index) => {
      const cellWidth = columnWidths[index];
      const cellHeight = 6;
      const cellX = startX + cellWidth / 2;
      const cellY = startY + cellHeight / 2 + 1.5;

      doc.setFillColor(200, 200, 200);
      doc.rect(startX, startY, cellWidth, cellHeight, "F");
      doc.setLineWidth(0.2);
      doc.rect(startX, startY, cellWidth, cellHeight);
      doc.setTextColor(0);
      doc.text(header, cellX, cellY, { align: "center" });
      startX += columnWidths[index];
    });
  };

  const addTableRows = (startX, startY, startIndex, endIndex) => {
    const rowHeight = 5;
    const tableWidth = getTotalTableWidth();

    for (let i = startIndex; i < endIndex; i++) {
      const row = rows[i];
      const isOddRow = i % 2 !== 0;
      const isTotalRow = i === rows.length - 1;
      let textColor = [0, 0, 0];

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
        const cellY =
          startY + (i - startIndex + 2) * rowHeight + rowHeight / 2;
        const cellX = startX + 2;

        doc.setTextColor(textColor[0], textColor[1], textColor[2]);

        if (!isTotalRow) {
          doc.setFont("verdana-regular", "normal");
          doc.setFontSize(10);
        }

        const cellValue = String(cell);

        // UPDATED: Column alignment logic
        if (cellIndex === 0) {
          // Code - Center
          const centerX = startX + columnWidths[cellIndex] / 2;
          doc.text(cellValue, centerX, cellY, {
            align: "center",
            baseline: "middle",
          });
        } else if (cellIndex === 1) {
          // Customer - Left
          const leftX = startX + 2;
          doc.text(cellValue, leftX, cellY, {
            align: "left",
            baseline: "middle",
          });
        } else if (cellIndex === 4) {
          // InsNo - Center
          const centerX = startX + columnWidths[cellIndex] / 2;
          doc.text(cellValue, centerX, cellY, {
            align: "center",
            baseline: "middle",
          });
        } else {
          // Baki sab columns (Cost, Sale Amt, Adv Amt, Coll, Profit, Profit %, Balance, Investment) - Right
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
    const headingX = lineX + 2;
    const headingY = lineY + 5;
    doc.setFont("verdana-regular", "normal");
    doc.setFontSize(10);
    doc.text(`Crystal Solution    ${date}    ${time}`, headingX, headingY);
  };

  const getTotalTableWidth = () => {
    let totalWidth = 0;
    columnWidths.forEach((width) => (totalWidth += width));
    return totalWidth;
  };

  const addNewPage = (startY) => {
    doc.addPage();
    return paddingTop;
  };

  const rowsPerPage = 30;

  const handlePagination = () => {
    const addTitle = (
      title,
      date,
      time,
      pageNumber,
      startY,
      titleFontSize = 16,
    ) => {
      doc.setFontSize(titleFontSize);
      doc.text(title, doc.internal.pageSize.width / 2, startY, {
        align: "center",
      });

      const rightX = doc.internal.pageSize.width - 10;
      if (date) {
        doc.setFontSize(8);
        if (time) {
          doc.text(date + " " + time, rightX, startY, { align: "right" });
        }
      }

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
    let startY = paddingTop;
    let pageNumber = 1;

    while (currentPageIndex * rowsPerPage < rows.length) {
      doc.setFont("Times New Roman", "normal");
      addTitle(comapnyname, "", "", pageNumber, startY, 20);
      startY += 7;
      doc.setFont("verdana-regular", "normal");
      addTitle(
        `Installment Investment Status Report From: ${fromInputDate} To: ${toInputDate}`,
        "",
        "",
        pageNumber,
        startY,
        14,
      );
      startY += 13;
      startY += -10;

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
  doc.save(`InstallmentInvestmentStatusReport As On ${date}.pdf`);
};
  ///////////////////////////// DOWNLOAD PDF CODE ////////////////////////////////////////////////////////////

  ///////////////////////////// DOWNLOAD EXCEL CODE //////////////////////////////////////////////////////////
  const handleDownloadCSV = async () => {
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet("Sheet1");

    const numColumns = 11;

    const columnAlignments = [
      "center",
      "left",
      "right",
      "right",
      "center",
      "right",
      "right",
      "right",
      "right",
      "right",
      "right",
    ];

    const fontCompanyName = { name: "CustomFont", size: 18, bold: true };
    const fontStoreList = { name: "CustomFont", size: 10, bold: false };
    const fontHeader = { name: "CustomFont", size: 10, bold: true };
    const fontTableContent = { name: "CustomFont", size: 10, bold: false };

    worksheet.addRow([]);
    const companyRow = worksheet.addRow([comapnyname]);
    companyRow.eachCell((cell) => {
      cell.font = fontCompanyName;
      cell.alignment = { horizontal: "center" };
    });
    worksheet.getRow(companyRow.number).height = 30;
    worksheet.mergeCells(
      `A${companyRow.number}:${String.fromCharCode(65 + numColumns - 1)}${companyRow.number}`,
    );

    const storeListRow = worksheet.addRow([
      `Installment Investment Status Report From ${fromInputDate} To ${toInputDate}`,
    ]);
    storeListRow.eachCell((cell) => {
      cell.font = fontStoreList;
      cell.alignment = { horizontal: "center" };
    });
    worksheet.mergeCells(
      `A${storeListRow.number}:${String.fromCharCode(65 + numColumns - 1)}${storeListRow.number}`,
    );

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

    const headers = [
      "Code",
      "Customer",
      "Cost",
      "Sale Amt",
      "InsNo",
      "Adv Amt",
      "Coll",
      "Profit",
      "Profit",
      "Balance",
      "Inves",
    ];
    const headerRow = worksheet.addRow(headers);
    headerRow.eachCell((cell) => Object.assign(cell, headerStyle));

    tableData.forEach((item) => {
      const row = worksheet.addRow([
        item.Code || "",
        item.Customer || "",
        item.Cost || "",
        item.SaleAmt || "",
        item.InsNo || "",
        item.AdvanceAmt || "",
        item.Collection || "",
        item.Profit || "",
        item.ProfitPrc || "",
        item.Balance || "",
        item.Investment || "",
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
       String(tableData.length.toLocaleString()),
      "",
      String(totalCost),
      String(totalSale),
      "",
      String(totalAdvance),
      String(totalCollection),
      String(totalProfit),
      "",
      String(totalBalance),
      String(totalInvestment),
    ]);

    totalRow.eachCell((cell, colNumber) => {
      cell.font = { bold: true };
      cell.border = {
        top: { style: "double" },
        left: { style: "thin" },
        bottom: { style: "double" },
        right: { style: "thin" },
      };
      if (
        colNumber > 2      
      ) {
        cell.alignment = { horizontal: "right" };
      }
       if (
        colNumber === 1      
      ) {
        cell.alignment = { horizontal: "center" };
      }
    });

    [11, 45, 12, 12, 7, 12, 12, 12, 12, 12, 12].forEach((width, index) => {
      worksheet.getColumn(index + 1).width = width;
    });

    worksheet.addRow([]);
    const getCurrentTime = () => {
      const today = new Date();
      const hh = String(today.getHours()).padStart(2, "0");
      const mm = String(today.getMinutes()).padStart(2, "0");
      const ss = String(today.getSeconds()).padStart(2, "0");
      return `${hh}:${mm}:${ss}`;
    };
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

    const dateTimeRow = worksheet.addRow([
      `DATE:   ${currentdate}  TIME:   ${currentTime}`,
    ]);
    dateTimeRow.eachCell((cell) => {
      cell.font = { name: "CustomFont", size: 10 };
      cell.alignment = { horizontal: "left" };
    });
    const dateTimeRow1 = worksheet.addRow([`USER ID:  ${userid}`]);
    dateTimeRow.eachCell((cell) => {
      cell.font = { name: "CustomFont", size: 10 };
      cell.alignment = { horizontal: "left" };
    });

    worksheet.mergeCells(
      `A${dateTimeRow.number}:${String.fromCharCode(65 + numColumns - 1)}${dateTimeRow.number}`,
    );
    worksheet.mergeCells(
      `A${dateTimeRow1.number}:${String.fromCharCode(65 + numColumns - 1)}${dateTimeRow1.number}`,
    );

    const buffer = await workbook.xlsx.writeBuffer();
    const blob = new Blob([buffer], {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    });
    saveAs(
      blob,
      `InstallmentInvestmentStatusReport From ${fromInputDate} To ${toInputDate}.xlsx`,
    );
  };
  ///////////////////////////// DOWNLOAD EXCEL CODE //////////////////////////////////////////////////////////

  const dispatch = useDispatch();

  const tableHeadColor = "#3368b5";
  const textColor = "white";

  const [tableData, setTableData] = useState([]);
  console.log("installment investment status reports data", tableData);
  const [isLoading, setIsLoading] = useState(false);
  const { data, loading, error } = useSelector((state) => state.getuser);

  // Updated column widths
  const firstColWidth = { width: "80px" };
  const secondColWidth = { width: isSidebarVisible ? "200px" : "365px" };
  const thirdColWidth = { width: isSidebarVisible ? "80px" : "85px" };
  const forthColWidth = { width: isSidebarVisible ? "80px" : "85px" };
  const fifthColWidth = { width: "50px" };
  const sixthColWidth = { width: isSidebarVisible ? "80px" : "85px" };
  const seventhColWidth = { width: isSidebarVisible ? "80px" : "85px" };
  const eighthColWidth = { width: isSidebarVisible ? "80px" : "85px" };
  const ninthColWidth = { width: "60px" };
  const tenthColWidth = { width: isSidebarVisible ? "80px" : "85px" };
  const elewenthColWidth = { width: isSidebarVisible ? "80px" : "85px" };
  const sixthCol = { width: "8px" };

  useHotkeys(
    "alt+s",
    () => {
      fetchReceivableReport();
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
    width: "100%",
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
    padding: "0 20px",
    boxSizing: "border-box",
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

  useEffect(() => {
    if (selectedRadio === "custom") {
      const currentDate = new Date();
      const firstDateOfCurrentMonth = new Date(
        currentDate.getFullYear(),
        currentDate.getMonth(),
        1,
      );
      setSelectedfromDate(firstDateOfCurrentMonth);
      setfromInputDate(formatDate(firstDateOfCurrentMonth));
      const lastDateOfCurrentMonth = new Date(
        currentDate.getFullYear(),
        currentDate.getMonth() + 1,
        0,
      );
      setSelectedToDate(lastDateOfCurrentMonth);
      settoInputDate(formatDate(lastDateOfCurrentMonth));
    } else {
      const days = parseInt(selectedRadio.replace("days", ""));
      handleRadioChange(days);
    }
  }, [selectedRadio]);

  return (
    <>
      <ToastContainer />
      <div style={contentStyle}>
        <div
          style={{
            backgroundColor: getcolor,
            color: fontcolor,
            border: `1px solid ${fontcolor}`,
            borderRadius: "9px",
          }}
        >
          <NavComponent textdata="Installment Investment Status Report" />

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
              {/* From Date */}
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
                            fontSize: "12px",
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

              {/* To Date */}
              <div
                className="d-flex align-items-center"
                style={{ marginRight: "40px" }}
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
                      fontSize: "12px",
                      backgroundColor: getcolor,
                      color: fontcolor,
                      opacity: selectedRadio === "custom" ? 1 : 0.5,
                      pointerEvents:
                        selectedRadio === "custom" ? "auto" : "none",
                    }}
                    value={toInputDate}
                    onChange={handleToInputChange}
                    onKeyDown={(e) => handleToKeyPress(e, input2Ref)}
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
                            fontSize: "12px",
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

              {/* Current Date */}
              <div
                className="d-flex align-items-center"
                style={{ marginRight: "40px" }}
              >
                <div
                  style={{
                    width: "60px",
                    display: "flex",
                    justifyContent: "end",
                  }}
                >
                  <label htmlFor="currentDatePicker">
                    <span
                      style={{
                        fontSize: getdatafontsize,
                        fontFamily: getfontstyle,
                        fontWeight: "bold",
                      }}
                    >
                      Curr :
                    </span>
                  </label>
                </div>
                <div
                  id="currentdatevalidation"
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
                    ref={currentDateRef}
                    style={{
                      height: "20px",
                      width: "90px",
                      paddingLeft: "5px",
                      outline: "none",
                      border: "none",
                      fontSize: "12px",
                      backgroundColor: getcolor,
                      color: fontcolor,
                    }}
                    value={currentInputDate}
                    onChange={handleCurrentInputChange}
                    onKeyDown={handleCurrentKeyPress}
                    id="currentDatePicker"
                    autoComplete="off"
                    placeholder="dd-mm-yyyy"
                    aria-label="Current Date Input"
                  />
                  <DatePicker
                    selected={selectedCurrentDate}
                    onChange={handleCurrentDateChange}
                    dateFormat="dd-MM-yyyy"
                    popperPlacement="bottom"
                    showPopperArrow={false}
                    open={currentCalendarOpen}
                    dropdownMode="select"
                    customInput={
                      <div>
                        <BsCalendar
                          onClick={toggleCurrentCalendar}
                          style={{
                            cursor: "pointer",
                            marginLeft: "18px",
                            fontSize: "12px",
                            color: fontcolor,
                          }}
                        />
                      </div>
                    }
                  />
                </div>
              </div>

              <div id="lastDiv" style={{ marginRight: "5px" }}></div>
            </div>
          </div>

          {/* Table - POINT 2: Hamesha tableLayout: "fixed" */}
          <div>
            <div style={{ overflowY: "auto" }}>
              <table
                className="myTable"
                id="table"
                style={{
                  fontSize: "12px",
                  width: "100%",
                  position: "relative",
                  tableLayout: "fixed", // Hamesha fixed
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
                    style={{ backgroundColor: tableHeadColor, color: "white" }}
                  >
                    <td className="border-dark" style={firstColWidth}>
                      Code
                    </td>
                    <td className="border-dark" style={secondColWidth}>
                      Customer
                    </td>
                    <td className="border-dark" style={thirdColWidth}>
                      Cost
                    </td>
                    <td className="border-dark" style={forthColWidth}>
                      Sale Amt
                    </td>
                    <td className="border-dark" style={fifthColWidth}>
                      InsNo
                    </td>
                    <td className="border-dark" style={sixthColWidth}>
                      Adv Amt
                    </td>
                    <td className="border-dark" style={seventhColWidth}>
                      Coll
                    </td>
                    <td className="border-dark" style={eighthColWidth}>
                      Profit
                    </td>
                    <td className="border-dark" style={ninthColWidth}>
                      Profit
                    </td>
                    <td className="border-dark" style={tenthColWidth}>
                      Balance
                    </td>
                    <td className="border-dark" style={elewenthColWidth}>
                      Inves
                    </td>
                    <td className="border-dark" style={sixthCol}></td>
                  </tr>
                </thead>
              </table>
            </div>

            {/* Table Body - POINT 2: Hamesha tableLayout: "fixed" */}
            <div
              className="table-scroll"
              style={{
                backgroundColor: textColor,
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
                  fontSize: "12px",
                  width: "100%",
                  position: "relative",
                  tableLayout: "fixed", // Hamesha fixed
                }}
              >
                <tbody id="tablebody">
                  {isLoading ? (
                    <>
                      <tr style={{ backgroundColor: getcolor }}>
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
                            <td style={firstColWidth}>&nbsp;</td>
                            <td style={secondColWidth}>&nbsp;</td>
                            <td style={thirdColWidth}>&nbsp;</td>
                            <td style={forthColWidth}>&nbsp;</td>
                            <td style={fifthColWidth}>&nbsp;</td>
                            <td style={sixthColWidth}>&nbsp;</td>
                            <td style={seventhColWidth}>&nbsp;</td>
                            <td style={eighthColWidth}>&nbsp;</td>
                            <td style={ninthColWidth}>&nbsp;</td>
                            <td style={tenthColWidth}>&nbsp;</td>
                            <td style={elewenthColWidth}>&nbsp;</td>
                          </tr>
                        ),
                      )}
                    </>
                  ) : (
                    <>
                      {tableData.map((item, i) => {
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
                            <td className="text-center" style={firstColWidth}>
                              {item.Code || ""}
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
                              {item.Customer || ""}
                            </td>
                            <td className="text-end" style={thirdColWidth}>
                              {item.Cost || ""}
                            </td>
                            <td className="text-end" style={forthColWidth}>
                              {item.SaleAmt || ""}
                            </td>
                            <td className="text-center" style={fifthColWidth}>
                              {item.InsNo || ""}
                            </td>
                            <td className="text-end" style={sixthColWidth}>
                              {item.AdvanceAmt || ""}
                            </td>
                            <td className="text-end" style={seventhColWidth}>
                              {item.Collection || ""}
                            </td>
                            <td className="text-end" style={eighthColWidth}>
                              {item.Profit || ""}
                            </td>
                            <td className="text-end" style={ninthColWidth}>
                              {item.ProfitPrc || ""}
                            </td>
                            <td className="text-end" style={tenthColWidth}>
                              {item.Balance || ""}
                            </td>
                            <td className="text-end" style={elewenthColWidth}>
                              {item.Investment || ""}
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
                          <td style={firstColWidth}>&nbsp;</td>
                          <td style={secondColWidth}>&nbsp;</td>
                          <td style={thirdColWidth}>&nbsp;</td>
                          <td style={forthColWidth}>&nbsp;</td>
                          <td style={fifthColWidth}>&nbsp;</td>
                          <td style={sixthColWidth}>&nbsp;</td>
                          <td style={seventhColWidth}>&nbsp;</td>
                          <td style={eighthColWidth}>&nbsp;</td>
                          <td style={ninthColWidth}>&nbsp;</td>
                          <td style={tenthColWidth}>&nbsp;</td>
                          <td style={elewenthColWidth}>&nbsp;</td>
                        </tr>
                      ))}
                    </>
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* Totals Row */}
          <div
            style={{
              borderBottom: `1px solid ${fontcolor}`,
              borderTop: `1px solid ${fontcolor}`,
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
            >
              <span className="mobileledger_total">{totalCost}</span>
            </div>
            <div
              style={{
                ...forthColWidth,
                background: getcolor,
                borderRight: `1px solid ${fontcolor}`,
              }}
            >
              <span className="mobileledger_total">{totalSale}</span>
            </div>
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
            >
              <span className="mobileledger_total">{totalAdvance}</span>
            </div>
            <div
              style={{
                ...seventhColWidth,
                background: getcolor,
                borderRight: `1px solid ${fontcolor}`,
              }}
            >
              <span className="mobileledger_total">{totalCollection}</span>
            </div>
            <div
              style={{
                ...eighthColWidth,
                background: getcolor,
                borderRight: `1px solid ${fontcolor}`,
              }}
            >
              <span className="mobileledger_total">{totalProfit}</span>
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
                ...tenthColWidth,
                background: getcolor,
                borderRight: `1px solid ${fontcolor}`,
              }}
            >
              <span className="mobileledger_total">{totalBalance}</span>
            </div>
            <div
              style={{
                ...elewenthColWidth,
                background: getcolor,
                borderRight: `1px solid ${fontcolor}`,
              }}
            >
              <span className="mobileledger_total">{totalInvestment}</span>
            </div>
          </div>

          {/* Buttons */}
          <div style={{ margin: "5px", marginBottom: "2px" }}>
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
              id="submitButton"
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
