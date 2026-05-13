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

export default function BalanceSheet() {
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
  const [transectionType, settransectionType] = useState("A");
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
    const dateRegex = /^\d{2}-\d{2}-\d{4}$/;

    let errorType = "";

    switch (true) {
      case !toInputDate:
        errorType = "toDate";
        break;
      default:
        break;
    }

    if (!dateRegex.test(toInputDate)) {
      errorType = "toDateInvalid";
    } else {
      const formattedToInput = toInputDate.replace(
        /^(\d{2})(\d{2})(\d{4})$/,
        "$1-$2-$3"
      );
      const [toDay, toMonth, toYear] = formattedToInput.split("-").map(Number);
      const enteredToDate = new Date(toYear, toMonth - 1, toDay);

      if (GlobaltoDate && enteredToDate > GlobaltoDate) {
        errorType = "toDateAfterGlobal";
      } else if (GlobaltoDate && enteredToDate < GlobalfromDate) {
        errorType = "toDateBeforeGlobal";
      }
    }

    switch (errorType) {
      case "toDate":
        toast.error("Rep Date is required");
        return;

      case "toDateInvalid":
        toast.error("Rep Date must be in the format dd-mm-yyyy");
        return;

      case "toDateAfterGlobal":
        toast.error(`Rep Date must be before ${GlobaltoDate1}`);
        return;
      case "toDateBeforeGlobal":
        toast.error(`Rep Date must be after ${GlobalfromDate1}`);
        return;

      default:
        break;
    }

    const fromDateElement = document.getElementById("fromdatevalidation");
    const toDateElement = document.getElementById("todatevalidation");

    if (fromDateElement) {
      fromDateElement.style.border = `1px solid ${fontcolor}`;
    }
    if (toDateElement) {
      toDateElement.style.border = `1px solid ${fontcolor}`;
    }

    const apiUrl = apiLinks + "/BalanceSheet.php";
    setIsLoading(true);
  const formData = new URLSearchParams({
  
    FRepDat: toInputDate,
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
     if (!hasComponentMountedPreviously || (toRef && toRef.current)) {
       if (toRef && toRef.current) {
         setTimeout(() => {
           toRef.current.focus();
           toRef.current.select();
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
  const doc = new jsPDF({
    orientation: "portrait",
    unit: "mm",
    format: "a4",
  });

  // =========================
  // PAGE SETTINGS
  // =========================
  const pageWidth = doc.internal.pageSize.width;
  const pageHeight = doc.internal.pageSize.height;

  // =========================
  // DATE & TIME
  // =========================
  const getCurrentDate = () => {
    const today = new Date();
    const dd = String(today.getDate()).padStart(2, "0");
    const mm = String(today.getMonth() + 1).padStart(2, "0");
    const yyyy = today.getFullYear();

    return `${dd}/${mm}/${yyyy}`;
  };

  const getCurrentTime = () => {
    const today = new Date();

    const hh = String(today.getHours()).padStart(2, "0");
    const mm = String(today.getMinutes()).padStart(2, "0");
    const ss = String(today.getSeconds()).padStart(2, "0");

    return `${hh}:${mm}:${ss}`;
  };

  const date = getCurrentDate();
  const time = getCurrentTime();

  // =========================
  // FONT HELPERS
  // =========================
  const setNormalFont = () => {
    doc.setFont("verdana-regular", "normal");
    doc.setFontSize(10);
  };

  const setBoldFont = () => {
    doc.setFont("verdana", "bold");
    doc.setFontSize(10);
  };

  // =========================
  // HEADER
  // =========================
   doc.setFont("verdana", "bold");
    doc.setFontSize(18);

  doc.text(comapnyname, pageWidth / 2, 15, {
    align: "center",
  });

   doc.setFont("verdana-regular", "normal");
    doc.setFontSize(12);

  doc.text(`Income Statement Report From ${fromInputDate} To ${toInputDate} `, pageWidth / 2, 22, {
    align: "center",
  });

  setNormalFont();

 
  // =========================
  // FIELD DRAW FUNCTION
  // =========================
  const drawField = ({
    label = "",
    value = "",
    labelX = 10,
    labelY = 10,
    fieldX = 100,
    fieldY = 10,
    fieldWidth = 45,
    fieldHeight = 7,
    labelColor = [0, 0, 0],
    valueAlign = "right",
    labelBold = true,
  }) => {
    // LABEL
    if (labelBold) {
      setBoldFont();
    } else {
      setNormalFont();
    }

    doc.setTextColor(
      labelColor[0],
      labelColor[1],
      labelColor[2],
    );

    if (label) {
      doc.text(label, labelX, labelY);
    }

    // BOX
    doc.setDrawColor(0);
    doc.setLineWidth(0.2);

    doc.rect(fieldX, fieldY - 5, fieldWidth, fieldHeight);

    // VALUE
    setNormalFont();

    doc.setTextColor(0, 0, 0);

    const textX =
      valueAlign === "right"
        ? fieldX + fieldWidth - 2
        : fieldX + 2;

    doc.text(String(value || 0), textX, fieldY, {
      align: valueAlign,
    });
  };

  // =========================
  // SALES
  // =========================
  setBoldFont();

  doc.setTextColor(255, 0, 0);

  doc.text("SALES", 10, 40);

  drawField({
    label: "Total Sale For the Period :",
    value: tableData["Total Sales"],
    labelX: 20,
    labelY: 50,
    fieldX: 122,
    fieldY: 50,
    fieldWidth: 35,
  });

  // =========================
  // PURCHASE
  // =========================
  setBoldFont();

  doc.setTextColor(255, 0, 0);

  doc.text("PURCHASE", 10, 62);

  drawField({
    label: "Opening Stock",
    value: tableData["Opening Stock"],
    labelX: 20,
    labelY: 72,
    fieldX: 72,
    fieldY: 72,
    fieldWidth: 35,
  });

  drawField({
    label: "Purchases",
    value: tableData["Purchases During The Period"],
    labelX: 20,
    labelY: 80,
    fieldX: 72,
    fieldY: 80,
    fieldWidth: 35,
  });

  drawField({
    label: "Stock Available for Sale",
    value: tableData["Goods Available For Sale"],
    labelX: 20,
    labelY: 88,
    fieldX: 72,
    fieldY: 88,
    fieldWidth: 35,
  });

  drawField({
    label: "Less Closing Stock",
    value: tableData["Less Closing Stock"],
    labelX: 20,
    labelY: 96,
    fieldX: 72,
    fieldY: 96,
    fieldWidth: 35,
  });

  drawField({
    label: "Less Cost of Goods Sold",
    value: tableData["Cost Of Goods Sold"],
    labelX: 20,
    labelY: 104,
    fieldX: 72,
    fieldY: 104,
    fieldWidth: 35,
    labelColor: [255, 0, 0],
  });

  // =========================
  // GROSS PROFIT
  // =========================
  setBoldFont();

  doc.setTextColor(0, 128, 0);

  doc.text("GROSS PROFIT", 65, 114);

  drawField({
    value: tableData["GROSS PROFIT"],
    fieldX: 122,
    fieldY: 114,
    fieldWidth: 35,
  });

  drawField({
    value: tableData["GROSS PROFIT Percentage"],
    fieldX: 165,
    fieldY: 114,
    fieldWidth: 25,
  });

  setBoldFont();

  doc.setTextColor(0, 0, 0);

  doc.text("%", 192, 114);

  // =========================
  // EXPENSES
  // =========================
  setBoldFont();

  doc.setTextColor(255, 0, 0);

  doc.text("EXPENSES", 10, 122);

  drawField({
    label: "Admin Expenses",
    value: tableData["Admin Expenses"],
    labelX: 35,
    labelY: 130,
    fieldX: 72,
    fieldY: 130,
    fieldWidth: 35,
  });

  drawField({
    label: "Marketing Expenses",
    value: tableData["Marketting Expenses"],
    labelX: 28,
    labelY: 138,
    fieldX: 72,
    fieldY: 138,
    fieldWidth: 35,
  });

  drawField({
    label: "Financial Expenses",
    value: tableData["Financial Expenses"],
    labelX: 31,
    labelY: 146,
    fieldX: 72,
    fieldY: 146,
    fieldWidth: 35,
  });

  drawField({
    label: "Less Total Expenses",
    value: tableData["Total Expenses"],
    labelX: 20,
    labelY: 172,
    fieldX: 72,
    fieldY: 172,
    fieldWidth: 35,
    labelColor: [255, 0, 0],
  });

  drawField({
    value: tableData["Expenses Percentage"],
    fieldX: 165,
    fieldY: 172,
    fieldWidth: 25,
  });

  setBoldFont();

  doc.setTextColor(0, 0, 0);

  doc.text("%", 192, 172);

  // =========================
  // NET PROFIT
  // =========================
  setBoldFont();

  doc.setTextColor(0, 128, 0);

  doc.text("NET PROFIT", 65, 180);

  drawField({
    value: tableData["NET PROFIT"],
    fieldX: 122,
    fieldY: 180,
    fieldWidth: 35,
  });

  drawField({
    value: tableData["NET PROFIT Percentage"],
    fieldX: 165,
    fieldY: 180,
    fieldWidth: 25,
  });

  setBoldFont();

  doc.setTextColor(0, 0, 0);

  doc.text("%", 192, 180);

  // =========================
  // OTHER INCOME
  // =========================
  setBoldFont();

  doc.setTextColor(255, 0, 0);

  doc.text("OTHER INCOME", 10, 185);

  drawField({
    label: "Other Profit",
    value: tableData["Other Profit"],
    labelX: 20,
    labelY: 192,
    fieldX: 72,
    fieldY: 192,
    fieldWidth: 35,
  });

  // =========================
  // TOTAL PROFIT
  // =========================
  setBoldFont();

  doc.setTextColor(0, 128, 0);

  doc.text("TOTAL PROFIT", 65, 200);

  drawField({
    value: tableData["TOTAL PROFIT"],
    fieldX: 122,
    fieldY: 200,
    fieldWidth: 35,
  });

  drawField({
    value: tableData["TOTAL PROFIT Percentage"],
    fieldX: 165,
    fieldY: 200,
    fieldWidth: 25,
  });

  setBoldFont();

  doc.setTextColor(0, 0, 0);

  doc.text("%", 192, 200);

  // =========================
  // FOOTER
  // =========================
  doc.setDrawColor(0);

  doc.line(
    10,
    pageHeight - 12,
    pageWidth - 10,
    pageHeight - 12,
  );

  setNormalFont();

  doc.text(
    `Crystal Solution    ${date}    ${time}`,
    10,
    pageHeight - 6,
  );

  doc.text(
    "Page 1",
    pageWidth - 10,
    pageHeight - 6,
    {
      align: "right",
    },
  );

  // =========================
  // SAVE PDF
  // =========================
  doc.save(
    `IncomeStatement Report From ${fromInputDate} To ${toInputDate}.pdf`,
  );
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
    maxWidth: "900px",
   
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

const DotButton = ({ onClick }) => {
  return (
    <div
      onClick={onClick}
      style={{
        width: "20px",
        height: "100%",
        cursor: "pointer",
        border: "1px solid darkgrey",
        background: "lightgrey",
        textAlign: "center",
      }}
    >
      <span style={{ fontWeight: "bold" }}>...</span>
    </div>
  );
};

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
          <NavComponent textdata="BalanceSheet" />

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
                        As on :
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
                    <option value="A">AVERAGE</option>
 <option value="P">LAST PURCHASE</option>
  <option value="M">SALESMAN RATE</option>
   <option value="W">WEIGHTED AVERURY</option>
                     <option value="F">FIFO</option>
                   
                  </select>

                  {transectionType !== "A" && (
                    <span
                      onClick={() => settransectionType("A")}
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
       <div className="row" style={{display:'flex'}}>
        <div className="col-md-6">
            <span style={{
                color:'red',
                  fontSize: 16,
            fontFamily: getfontstyle,
            fontWeight: 600,
             letterSpacing: "4px",

            }}>ASSETS</span>
        </div>
         <div className="col-md-6">
              <span style={{
                color:'red',
                  fontSize: 16,
            fontFamily: getfontstyle,
            fontWeight: 600,
             letterSpacing: "4px",

            }}>LIABILITIES</span>
         </div>
       </div>

        <div style={{border:`1px solid ${fontcolor}`}}></div>
       
<div className="row" 
  style={{  
    width:'100%',
    margin:'0px',
    maxHeight: "55vh",
    overflowY: "auto",
    overflowX: "hidden",
    }}
>
    {/* ASSETS SECTION */}

       <div 
            style={{ 
          padding:'0px',
          width:'50%',
          borderRight:`1px solid ${fontcolor}`,
          padding:"0px 10px"
    }}
    >
         
         {/* FIXED ASSETS SECTION */}
         <div style={{display:'flex', flexDirection:'column', gap:'2px',justifyContent:'start', alignItems:'start'}}>
         
       <div style={{width:'100%'}}>
          <div 
          style={{       
            width:'50%',
            fontSize: getdatafontsize,
            fontFamily: getfontstyle,
            fontWeight: "bold",
            textAlign:'end',
            color:'red',
            paddingRight:"5px"
                        
            }} >FIXED ASSETS</div>
<div style={{width:"25%"}}></div>
<div style={{width:"25%"}}></div>
</div>

           <div className="row" style={{display:'flex',alignItems:'center', height:'20px',width:'100%', margin:'0px', textAlign:'start'}}>
            <div style={{ 
              width:'45%', 
              padding:'0px',
               fontSize: getdatafontsize,
            fontFamily: getfontstyle,
            fontWeight: "bold",
            textAlign:'end',
            paddingRight:'5px'
              }} >Land & Building :</div>
               <div style={{width:'30%', height:'100%', padding:'0px', display:"flex", gap:"2px"}} >
            <div style={boxStyle}>
                  {tableData.ASSETS["FIXED ASSETS"]["LAND & BUILDING"]}
                </div>
<DotButton />
              </div>
               <div style={{width:"25%"}} ></div>
           </div>
            <div className="row" style={{display:'flex',alignItems:'center', height:'20px',width:'100%', margin:'0px', textAlign:'start'}}>
            <div style={{ 
              width:'45%', 
              padding:'0px',
               fontSize: getdatafontsize,
            fontFamily: getfontstyle,
            fontWeight: "bold",
            textAlign:'end',
            paddingRight:'5px'
              }} >Vehicles :</div>
               <div style={{width:'30%', height:'100%', padding:'0px', display:'flex', gap:'2px'}} >
                <div style={boxStyle}>
                  {tableData.ASSETS["FIXED ASSETS"]["VEHICLES"]}
                </div>
                <DotButton/>
              </div>
               <div style={{width:"25%"}} ></div>
           </div>
           <div className="row" style={{display:'flex',alignItems:'center', height:'20px',width:'100%', margin:'0px', textAlign:'start'}}>
            <div style={{ 
              width:'45%', 
              padding:'0px',
               fontSize: getdatafontsize,
            fontFamily: getfontstyle,
            fontWeight: "bold",
            textAlign:'end',
            paddingRight:'5px'
              }} >Furniture & Fixture :</div>
               <div style={{width:'30%', height:'100%', padding:'0px',display:'flex', gap:'2px'}} >
                <div style={boxStyle}>
                  {tableData.ASSETS["FIXED ASSETS"]["FURNITURE & FIXTURE"]}
                </div>
                <DotButton/>
              </div>
               <div style={{width:"25%"}} ></div>
           </div>
            <div className="row" style={{display:'flex',alignItems:'center', height:'20px',width:'100%', margin:'0px', textAlign:'start'}}>
            <div style={{ 
              width:'45%', 
              padding:'0px',
               fontSize: getdatafontsize,
            fontFamily: getfontstyle,
            fontWeight: "bold",
            textAlign:'end',
            paddingRight:'5px'
              }} >Electric Equipment :</div>
               <div style={{width:'30%', height:'100%', padding:'0px', display:'flex', gap:'2px'}} >
                <div style={boxStyle}>
                  {tableData.ASSETS["FIXED ASSETS"]["ELECTRIC EQUIPMENT"]}
                </div>
                <DotButton/>
              </div>
               <div style={{width:"25%"}} ></div>
           </div>
               <div className="row" style={{display:'flex',alignItems:'center', height:'20px',width:'100%', margin:'0px', textAlign:'start'}}>
            <div style={{ 
              width:'45%', 
              padding:'0px',
               fontSize: getdatafontsize,
            fontFamily: getfontstyle,
            fontWeight: "bold",
            textAlign:'end',
            paddingRight:'5px'
              }} >Telephone & Mobiles :</div>
               <div style={{width:'30%', height:'100%', padding:'0px',display:'flex', gap:'2px'}} >
                <div style={boxStyle}>
                  {tableData.ASSETS["FIXED ASSETS"]["TELEPHONE & MOBILES"]}
                </div>
                <DotButton/>
              </div>
               <div style={{width:"25%"}} ></div>
           </div>
            <div className="row" style={{display:'flex',alignItems:'center', height:'20px',width:'100%', margin:'0px', textAlign:'start'}}>
            <div style={{ 
              width:'45%', 
              padding:'0px',
               fontSize: getdatafontsize,
            fontFamily: getfontstyle,
            fontWeight: "bold",
            textAlign:'end',
            paddingRight:'5px'
              }} >IT Equipment :</div>
               <div style={{width:'30%', height:'100%', padding:'0px',display:'flex', gap:'2px'}} >
                <div style={boxStyle}>
                  {tableData.ASSETS["FIXED ASSETS"]["IT EQUIPMENT"]}
                </div>
                <DotButton/>
              </div>
               <div style={{width:"25%"}} ></div>
           </div>
            <div className="row" style={{display:'flex',alignItems:'center', height:'20px',width:'100%', margin:'0px', textAlign:'start'}}>
            <div style={{ 
              width:'50%', 
              padding:'0px',
               fontSize: getdatafontsize,
            fontFamily: getfontstyle,
            fontWeight: "bold",
            textAlign:'end',
            paddingRight:'5px'
              }} ></div>
                 <div style={{width:"25%"}} ></div>
               <div style={{width:'25%', height:'100%', padding:'0px'}} >
                <div style={boxStyle}>
                  {tableData.ASSETS["FIXED ASSETS"]["Total"]}
                </div>
              </div>
            
           </div>
         </div>

          {/* CASH & BANK BALANCES SECTION */}
         <div style={{display:'flex', flexDirection:'column', gap:'2px',justifyContent:'start', alignItems:'start'}}>
         
         
         <div style={{width:'100%'}}>
          <div 
          style={{       
            width:'50%',
            fontSize: getdatafontsize,
            fontFamily: getfontstyle,
            fontWeight: "bold",
            textAlign:'end',
            color:'red',
            paddingRight:"5px"
                        
            }} >CASH & BANK BALANCES</div>
<div style={{width:"25%"}}></div>
<div style={{width:"25%"}}></div>
</div>
         
            <div className="row" style={{display:'flex',alignItems:'center', height:'20px',width:'100%', margin:'0px', textAlign:'start'}}>
            <div style={{ 
              width:'45%', 
              padding:'0px',
               fontSize: getdatafontsize,
            fontFamily: getfontstyle,
            fontWeight: "bold",
            textAlign:'end',
            paddingRight:'5px'
              }} >Cash Account :</div>
               <div style={{width:'30%', height:'100%', padding:'0px',display:'flex', gap:'2px'}} >
                <div style={boxStyle}>
                  {tableData.ASSETS["CASH & BANK BALANCES"]["CASH ACCOUNT"]}
                </div>
                <DotButton/>
              </div>
               <div style={{width:"25%"}} ></div>
           </div>
           <div className="row" style={{display:'flex',alignItems:'center', height:'20px',width:'100%', margin:'0px', textAlign:'start'}}>
            <div style={{ 
              width:'45%', 
              padding:'0px',
               fontSize: getdatafontsize,
            fontFamily: getfontstyle,
            fontWeight: "bold",
            textAlign:'end',
            paddingRight:'5px'
              }} >Banks :</div>
               <div style={{width:'30%', height:'100%', padding:'0px',display:'flex', gap:'2px'}} >
                <div style={boxStyle}>
                  {tableData.ASSETS["CASH & BANK BALANCES"]["BANKS"]}
                </div>
                <DotButton/>
              </div>
               <div style={{width:"25%"}} ></div>
           </div>
            <div className="row" style={{display:'flex',alignItems:'center', height:'20px',width:'100%', margin:'0px', textAlign:'start'}}>
            <div style={{ 
              width:'45%', 
              padding:'0px',
               fontSize: getdatafontsize,
            fontFamily: getfontstyle,
            fontWeight: "bold",
            textAlign:'end',
            paddingRight:'5px'
              }} >Credit Cards :</div>
               <div style={{width:'30%', height:'100%', padding:'0px',display:'flex', gap:'2px'}} >
                <div style={boxStyle}>
                  {tableData.ASSETS["CASH & BANK BALANCES"]["CREDIT CARDS"]}
                </div>
                <DotButton/>
              </div>
               <div style={{width:"25%"}} ></div>
           </div>
            <div className="row" style={{display:'flex',alignItems:'center', height:'20px',width:'100%', margin:'0px', textAlign:'start'}}>
            <div style={{ 
              width:'45%', 
              padding:'0px',
               fontSize: getdatafontsize,
            fontFamily: getfontstyle,
            fontWeight: "bold",
            textAlign:'end',
            paddingRight:'5px'
              }} >Cheques :</div>
               <div style={{width:'30%', height:'100%', padding:'0px',display:'flex', gap:'2px'}} >
                <div style={boxStyle}>
                  {tableData.ASSETS["CASH & BANK BALANCES"]["CHEQUES"]}
                </div>
                <DotButton/>
              </div>
               <div style={{width:"25%"}} ></div>
           </div>
            
            <div className="row" style={{display:'flex',alignItems:'center', height:'20px',width:'100%', margin:'0px', textAlign:'start'}}>
            <div style={{ 
              width:'45%', 
              padding:'0px',
               fontSize: getdatafontsize,
            fontFamily: getfontstyle,
            fontWeight: "bold",
            textAlign:'end',
            paddingRight:'5px'
              }} ></div>
                 <div style={{width:"30%"}} ></div>
               <div style={{width:'25%', height:'100%', padding:'0px'}} >
                <div style={boxStyle}>
                  {tableData.ASSETS["CASH & BANK BALANCES"]["Total"]}
                </div>
              </div>
            
           </div>
         </div>

 {/* RECEIVEABLE SECTION */}
         <div style={{display:'flex', flexDirection:'column', gap:'2px',justifyContent:'start', alignItems:'start'}}>
         
       <div style={{width:'100%'}}>
          <div 
          style={{       
            width:'50%',
            fontSize: getdatafontsize,
            fontFamily: getfontstyle,
            fontWeight: "bold",
            textAlign:'end',
            color:'red',
            paddingRight:"5px"
                        
            }} >RECEIVEABLE</div>
<div style={{width:"25%"}}></div>
<div style={{width:"25%"}}></div>
</div>

           <div className="row" style={{display:'flex',alignItems:'center', height:'20px',width:'100%', margin:'0px', textAlign:'start'}}>
            <div style={{ 
              width:'45%', 
              padding:'0px',
               fontSize: getdatafontsize,
            fontFamily: getfontstyle,
            fontWeight: "bold",
            textAlign:'end',
            paddingRight:'5px'
              }} >Credit Sale Account :</div>
               <div style={{width:'30%', height:'100%', padding:'0px',display:'flex', gap:'2px'}} >
                <div style={boxStyle}>
                  {tableData.ASSETS["RECEIVEABLE"]["CREDIT SALE ACCOUNT"]}
                </div>
                <DotButton/>
              </div>
               <div style={{width:"25%"}} ></div>
           </div>
            <div className="row" style={{display:'flex',alignItems:'center', height:'20px',width:'100%', margin:'0px', textAlign:'start'}}>
            <div style={{ 
              width:'45%', 
              padding:'0px',
               fontSize: getdatafontsize,
            fontFamily: getfontstyle,
            fontWeight: "bold",
            textAlign:'end',
            paddingRight:'5px'
              }} >Salesman Receivable :</div>
               <div style={{width:'30%', height:'100%', padding:'0px',display:'flex', gap:'2px'}} >
                <div style={boxStyle}>
                  {tableData.ASSETS["RECEIVEABLE"]["SALESMAN RECEIVABLE"]}
                </div>
                <DotButton/>
              </div>
               <div style={{width:"25%"}} ></div>
           </div>
           <div className="row" style={{display:'flex',alignItems:'center', height:'20px',width:'100%', margin:'0px', textAlign:'start'}}>
            <div style={{ 
              width:'45%', 
              padding:'0px',
               fontSize: getdatafontsize,
            fontFamily: getfontstyle,
            fontWeight: "bold",
            textAlign:'end',
            paddingRight:'5px'
              }} >Staff Advances :</div>
               <div style={{width:'30%', height:'100%', padding:'0px',display:'flex', gap:'2px'}} >
                <div style={boxStyle}>
                  {tableData.ASSETS["RECEIVEABLE"]["STAFF ADVANCES"]}
                </div>
                <DotButton/>
              </div>
               <div style={{width:"25%"}} ></div>
           </div>
            <div className="row" style={{display:'flex',alignItems:'center', height:'20px',width:'100%', margin:'0px', textAlign:'start'}}>
            <div style={{ 
              width:'45%', 
              padding:'0px',
               fontSize: getdatafontsize,
            fontFamily: getfontstyle,
            fontWeight: "bold",
            textAlign:'end',
            paddingRight:'5px'
              }} >Other Receivables :</div>
               <div style={{width:'30%', height:'100%', padding:'0px',display:'flex', gap:'2px'}} >
                <div style={boxStyle}>
                  {tableData.ASSETS["RECEIVEABLE"]["OTHER RECEIVEABLES"]}
                </div>
                <DotButton/>
              </div>
               <div style={{width:"25%"}} ></div>
           </div>
               <div className="row" style={{display:'flex',alignItems:'center', height:'20px',width:'100%', margin:'0px', textAlign:'start'}}>
            <div style={{ 
              width:'45%', 
              padding:'0px',
               fontSize: getdatafontsize,
            fontFamily: getfontstyle,
            fontWeight: "bold",
            textAlign:'end',
            paddingRight:'5px'
              }} >Security Receiables :</div>
               <div style={{width:'30%', height:'100%', padding:'0px',display:'flex', gap:'2px'}} >
                <div style={boxStyle}>
                  {tableData.ASSETS["RECEIVEABLE"]["SECURITY RECEIVABLES"]}
                </div>
                <DotButton/>
              </div>
               <div style={{width:"25%"}} ></div>
           </div>
            <div className="row" style={{display:'flex',alignItems:'center', height:'20px',width:'100%', margin:'0px', textAlign:'start'}}>
            <div style={{ 
              width:'45%', 
              padding:'0px',
               fontSize: getdatafontsize,
            fontFamily: getfontstyle,
            fontWeight: "bold",
            textAlign:'end',
            paddingRight:'5px'
              }} >Investments :</div>
               <div style={{width:'30%', height:'100%', padding:'0px',display:'flex', gap:'2px'}} >
                <div style={boxStyle}>
                  {tableData.ASSETS["RECEIVEABLE"]["INVESTMENTS"]}
                </div>
                <DotButton/>
              </div>
               <div style={{width:"25%"}} ></div>
           </div>
            <div className="row" style={{display:'flex',alignItems:'center', height:'20px',width:'100%', margin:'0px', textAlign:'start'}}>
            <div style={{ 
              width:'50%', 
              padding:'0px',
               fontSize: getdatafontsize,
            fontFamily: getfontstyle,
            fontWeight: "bold",
            textAlign:'end',
            paddingRight:'5px'
              }} ></div>
                 <div style={{width:"25%"}} ></div>
               <div style={{width:'25%', height:'100%', padding:'0px'}} >
                <div style={boxStyle}>
                  {tableData.ASSETS["RECEIVEABLE"]["Total"]}
                </div>
              </div>
            
           </div>
         </div>
      
        {/* STOCK SECTION */}
         <div style={{display:'flex', flexDirection:'column', gap:'2px',justifyContent:'start', alignItems:'start'}}>
         
         
         <div style={{width:'100%'}}>
          <div 
          style={{       
            width:'50%',
            fontSize: getdatafontsize,
            fontFamily: getfontstyle,
            fontWeight: "bold",
            textAlign:'end',
            color:'red',
            paddingRight:"5px"
                        
            }} >STOCK</div>
<div style={{width:"25%"}}></div>
<div style={{width:"25%"}}></div>
</div>
         
            <div className="row" style={{display:'flex',alignItems:'center', height:'20px',width:'100%', margin:'0px', textAlign:'start'}}>
            <div style={{ 
              width:'45%', 
              padding:'0px',
               fontSize: getdatafontsize,
            fontFamily: getfontstyle,
            fontWeight: "bold",
            textAlign:'end',
            paddingRight:'5px'
              }} >Closing Stock :</div>
               <div style={{width:'30%', height:'100%', padding:'0px',display:'flex', gap:'2px'}} >
                <div style={boxStyle}>
                  {tableData.ASSETS["STOCK"]["CLOSING STOCK"]}
                </div>
                <DotButton/>
              </div>
               <div style={{width:"25%"}} ></div>
           </div>
                      
            <div className="row" style={{display:'flex',alignItems:'center', height:'20px',width:'100%', margin:'0px', textAlign:'start'}}>
            <div style={{ 
              width:'50%', 
              padding:'0px',
               fontSize: getdatafontsize,
            fontFamily: getfontstyle,
            fontWeight: "bold",
            textAlign:'end',
            paddingRight:'5px'
              }} ></div>
                 <div style={{width:"25%"}} ></div>
               <div style={{width:'25%', height:'100%', padding:'0px'}} >
                <div style={boxStyle}>
                  {tableData.ASSETS["STOCK"]["Total"]}
                </div>
              </div>
            
           </div>
         </div>




          </div>
       
      {/* LIABILITIES SECTION */}
           <div 
            style={{ 
          padding:'0px',
          width:'50%',
           padding:"0px 10px"
    }}
    >
         
         {/* PAYABLE SECTION */}
         <div style={{display:'flex', flexDirection:'column', gap:'2px',justifyContent:'start', alignItems:'start'}}>
         
          <div 
          style={{       
            width:'100%',
            fontSize: getdatafontsize,
            fontFamily: getfontstyle,
            fontWeight: "bold",
            textAlign:'start',
            color:'red'
                        
            }} >PAYABLE</div>

           <div className="row" style={{display:'flex',alignItems:'center', height:'20px',width:'100%', margin:'0px', textAlign:'start'}}>
            <div style={{ 
              width:'45%', 
              padding:'0px',
               fontSize: getdatafontsize,
            fontFamily: getfontstyle,
            fontWeight: "bold",
            textAlign:'end',
            paddingRight:'5px'
              }} >Suppliers :</div>
               <div style={{width:'30%', height:'100%', padding:'0px',display:'flex', gap:'2px'}} >
                <div style={boxStyle}>
                  {tableData.LIABILITIES["PAYABLE"]["SUPPLIERS"]}
                </div>
                <DotButton/>
              </div>
               <div style={{width:"25%"}} ></div>
           </div>
            <div className="row" style={{display:'flex',alignItems:'center', height:'20px',width:'100%', margin:'0px', textAlign:'start'}}>
            <div style={{ 
              width:'45%', 
              padding:'0px',
               fontSize: getdatafontsize,
            fontFamily: getfontstyle,
            fontWeight: "bold",
            textAlign:'end',
            paddingRight:'5px'
              }} >Other Payables :</div>
               <div style={{width:'30%', height:'100%', padding:'0px', display:'flex', gap:'2px'}} >
                <div style={boxStyle}>
                  {tableData.LIABILITIES["PAYABLE"]["OTHER PAYABLES"]}
                </div>
                <DotButton/>
              </div>
               <div style={{width:"25%"}} ></div>
           </div>
           <div className="row" style={{display:'flex',alignItems:'center', height:'20px',width:'100%', margin:'0px', textAlign:'start'}}>
            <div style={{ 
              width:'45%', 
              padding:'0px',
               fontSize: getdatafontsize,
            fontFamily: getfontstyle,
            fontWeight: "bold",
            textAlign:'end',
            paddingRight:'5px'
              }} >Commission Payables :</div>
               <div style={{width:'30%', height:'100%', padding:'0px', display:'flex', gap:'2px'}} >
                <div style={boxStyle}>
                  {tableData.LIABILITIES["PAYABLE"]["COMMISSION PAYABLES"]}
                </div>
                <DotButton/>
              </div>
               <div style={{width:"25%"}} ></div>
           </div>
            <div className="row" style={{display:'flex',alignItems:'center', height:'20px',width:'100%', margin:'0px', textAlign:'start'}}>
            <div style={{ 
              width:'45%', 
              padding:'0px',
               fontSize: getdatafontsize,
            fontFamily: getfontstyle,
            fontWeight: "bold",
            textAlign:'end',
            paddingRight:'5px'
              }} >Investment By Others :</div>
               <div style={{width:'30%', height:'100%', padding:'0px',display:'flex', gap:'2px'}} >
                <div style={boxStyle}>
                  {tableData.LIABILITIES["PAYABLE"]["INVESTMENT BY OTHERS"]}
                </div>
                <DotButton/>
              </div>
               <div style={{width:"25%"}} ></div>
           </div>
               <div className="row" style={{display:'flex',alignItems:'center', height:'20px',width:'100%', margin:'0px', textAlign:'start'}}>
            <div style={{ 
              width:'45%', 
              padding:'0px',
               fontSize: getdatafontsize,
            fontFamily: getfontstyle,
            fontWeight: "bold",
            textAlign:'end',
            paddingRight:'5px'
              }} >Security Payables :</div>
               <div style={{width:'30%', height:'100%', padding:'0px',display:'flex', gap:'2px'}} >
                <div style={boxStyle}>
                  {tableData.LIABILITIES["PAYABLE"]["SECURITY PAYABLES"]}
                </div>
                <DotButton/>
              </div>
               <div style={{width:"25%"}} ></div>
           </div>
            <div className="row" style={{display:'flex',alignItems:'center', height:'20px',width:'100%', margin:'0px', textAlign:'start'}}>
            <div style={{ 
              width:'45%', 
              padding:'0px',
               fontSize: getdatafontsize,
            fontFamily: getfontstyle,
            fontWeight: "bold",
            textAlign:'end',
            paddingRight:'5px'
              }} >Advance Payables :</div>
               <div style={{width:'30%', height:'100%', padding:'0px',display:'flex', gap:'2px'}} >
                <div style={boxStyle}>
                  {tableData.LIABILITIES["PAYABLE"]["ADVANCES PAYABLES"]}
                </div>
                <DotButton/>
              </div>
               <div style={{width:"25%"}} ></div>
           </div>
            <div className="row" style={{display:'flex',alignItems:'center', height:'20px',width:'100%', margin:'0px', textAlign:'start'}}>
            <div style={{ 
              width:'50%', 
              padding:'0px',
               fontSize: getdatafontsize,
            fontFamily: getfontstyle,
            fontWeight: "bold",
            textAlign:'end',
            paddingRight:'5px'
              }} ></div>
                 <div style={{width:"25%"}} ></div>
               <div style={{width:'25%', height:'100%', padding:'0px'}} >
                <div style={boxStyle}>
                  {tableData.LIABILITIES["PAYABLE"]["Total"]}
                </div>
              </div>
            
           </div>
         </div>

          {/* CAPITAL SECTION */}
         <div style={{display:'flex', flexDirection:'column', gap:'2px',justifyContent:'start', alignItems:'start'}}>
         
          <div 
          style={{       
            width:'100%',
            fontSize: getdatafontsize,
            fontFamily: getfontstyle,
            fontWeight: "bold",
            textAlign:'start',
            color:'red'
                        
            }} >CAPITAL</div>

         
            <div className="row" style={{display:'flex',alignItems:'center', height:'20px',width:'100%', margin:'0px', textAlign:'start'}}>
            <div style={{ 
              width:'45%', 
              padding:'0px',
               fontSize: getdatafontsize,
            fontFamily: getfontstyle,
            fontWeight: "bold",
            textAlign:'end',
            paddingRight:'5px'
              }} >Capital :</div>
               <div style={{width:'30%', height:'100%', padding:'0px',display:'flex', gap:'2px'}} >
                <div style={boxStyle}>
                  {tableData.LIABILITIES["CAPITAL"]["CAPITAL"]}
                </div>
                <DotButton/>
              </div>
               <div style={{width:"25%"}} ></div>
           </div>
           <div className="row" style={{display:'flex',alignItems:'center', height:'20px',width:'100%', margin:'0px', textAlign:'start'}}>
            <div style={{ 
              width:'45%', 
              padding:'0px',
               fontSize: getdatafontsize,
            fontFamily: getfontstyle,
            fontWeight: "bold",
            textAlign:'end',
            paddingRight:'5px'
              }} >Drawing :</div>
               <div style={{width:'30%', height:'100%', padding:'0px',display:'flex', gap:'2px'}} >
                <div style={boxStyle}>
                  {tableData.LIABILITIES["CAPITAL"]["DRAWING"]}
                </div>
                <DotButton/>
              </div>
               <div style={{width:"25%"}} ></div>
           </div>
            <div className="row" style={{display:'flex',alignItems:'center', height:'20px',width:'100%', margin:'0px', textAlign:'start'}}>
            <div style={{ 
              width:'45%', 
              padding:'0px',
               fontSize: getdatafontsize,
            fontFamily: getfontstyle,
            fontWeight: "bold",
            textAlign:'end',
            paddingRight:'5px'
              }} >Profit Transferd :</div>
               <div style={{width:'30%', height:'100%', padding:'0px',display:'flex', gap:'2px'}} >
                <div style={boxStyle}>
                  {tableData.LIABILITIES["CAPITAL"]["PROFIT TRANSFERD"]}
                </div>
                <DotButton/>
              </div>
               <div style={{width:"25%"}} ></div>
           </div>
            
            <div className="row" style={{display:'flex',alignItems:'center', height:'20px',width:'100%', margin:'0px', textAlign:'start'}}>
            <div style={{ 
              width:'50%', 
              padding:'0px',
               fontSize: getdatafontsize,
            fontFamily: getfontstyle,
            fontWeight: "bold",
            textAlign:'end',
            paddingRight:'5px'
              }} ></div>
                 <div style={{width:"25%"}} ></div>
               <div style={{width:'25%', height:'100%', padding:'0px'}} >
                <div style={boxStyle}>
                  {tableData.LIABILITIES["CAPITAL"]["Total"]}
                </div>
              </div>
            
           </div>
         </div>

      

          </div>
</div>

     {/* FOOTER SECTION */}
     
     <div style={{width:'100%', display:'flex',padding:'0', margin:'0' }}>
         <div style={{width:'50%', margin:'5px 0px',borderTop:`1px solid ${fontcolor}`,borderBottom:`1px solid ${fontcolor}` }}>
          <div className="row" style={{display:'flex',alignItems:'center', height:'22px',padding:'2px 0px',width:'100%', margin:'0px' }}>
            <div style={{ 
              width:'47.5%', 
              padding:'0px',
               fontSize: getdatafontsize,
            fontFamily: getfontstyle,
            fontWeight: "bold",
            textAlign:'end',
            paddingRight:'5px'
              }} ></div>
                 <div style={{width:"25%"}} ></div>
               <div style={{width:'23.5%', height:'100%', padding:'0px'}} >
                <div style={boxStyle}>
                  {tableData.ASSETS["Total"]}
                </div>
              </div>
            
           </div>
         </div>
          <div style={{width:'50%', margin:'5px 0px',borderTop:`1px solid ${fontcolor}`,borderBottom:`1px solid ${fontcolor}` }}>
          <div className="row" style={{display:'flex',alignItems:'center', height:'22px',padding:'2px 0px',width:'100%', margin:'0px' }}>
            <div style={{ 
              width:'47.5%', 
              padding:'0px',
               fontSize: getdatafontsize,
            fontFamily: getfontstyle,
            fontWeight: "bold",
            textAlign:'end',
            paddingRight:'5px'
              }} ></div>
                 <div style={{width:"25%"}} ></div>
               <div style={{width:'23.5%', height:'100%', padding:'0px'}} >
                <div style={boxStyle}>
                  {tableData.LIABILITIES["Total"]}
                </div>
              </div>
            
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
