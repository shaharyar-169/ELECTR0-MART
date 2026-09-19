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

// ============================================================
// ✅ NORMALIZE KEYS FUNCTION
// Ye API response ki saari keys ko trim karta hai (whitespace remove)
// Taaki code mein exact match ho jaye
// ============================================================
const normalizeKeys = (obj) => {
  if (Array.isArray(obj)) {
    return obj.map(normalizeKeys);
  }
  if (obj !== null && typeof obj === "object") {
    return Object.keys(obj).reduce((acc, key) => {
      const cleanKey = key.trim();
      acc[cleanKey] = normalizeKeys(obj[key]);
      return acc;
    }, {});
  }
  return obj;
};

// ============================================================
// ✅ SAFE GETTER FUNCTION
// Case-insensitive aur whitespace-insensitive key lookup
// ============================================================
const getValue = (obj, ...keys) => {
  if (!obj || typeof obj !== "object") return "";

  const normalizedKeys = keys.map((k) =>
    String(k).trim().toUpperCase()
  );

  const keyMap = {};
  Object.keys(obj).forEach((key) => {
    keyMap[key.trim().toUpperCase()] = key;
  });

  for (const nk of normalizedKeys) {
    if (keyMap[nk] !== undefined) {
      return obj[keyMap[nk]];
    }
  }

  return "";
};

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

  const [tableData, setTableData] = useState({});

  const [totalQnty, setTotalQnty] = useState(0);
  const [totalOpening, setTotalOpening] = useState(0);
  const [totalDebit, setTotalDebit] = useState(0);
  const [totalCredit, setTotalCredit] = useState(0);
  const [closingBalance, setClosingBalance] = useState(0);

  const [Companyselectdatavalue, setCompanyselectdatavalue] = useState("");
  const [selectedfromDate, setSelectedfromDate] = useState(null);
  const [fromInputDate, setfromInputDate] = useState("");
  const [fromCalendarOpen, setfromCalendarOpen] = useState(false);
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
      date.getMonth() + 1
    ).padStart(2, "0")}-${date.getFullYear()}`;
  };

  const GlobalfromDate1 = formatDate1(GlobalfromDate);
  const GlobaltoDate1 = formatDate1(GlobaltoDate);
  //////////////////////// CUSTOM DATE LIMITS ////////////////////////////

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
        "$1-$2-$3"
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
            `Date must be after ${GlobalfromDate1} and before ${GlobaltoDate1}`
          );
          return;
        }
        if (GlobalfromDate && enteredDate > GlobaltoDate) {
          toast.error(
            `Date must be after ${GlobalfromDate1} and before ${GlobaltoDate1}`
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
        "$1-$2-$3"
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
            `Date must be after ${GlobalfromDate1} and before ${GlobaltoDate1}`
          );
          return;
        }

        if (GlobaltoDate && enteredDate < GlobalfromDate) {
          toast.error(
            `Date must be after ${GlobalfromDate1} and before ${GlobaltoDate1}`
          );
          return;
        }

        if (fromInputDate) {
          const fromDate = new Date(
            fromInputDate.split("-").reverse().join("-")
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

  // ============================================================
  // ✅ FETCH REPORT (with normalizeKeys applied)
  // ============================================================
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
      // code: organisation.code,
    // FLocCod: locationnumber || getLocationNumber,
    // FYerDsc: yeardescription || getyeardescription,
    }).toString();

    axios
      .post(apiUrl, formData)
      .then((response) => {
        setIsLoading(false);

        if (response.data && typeof response.data === "object") {
          // ✅ Normalize all keys (trim whitespace)
          const normalizedData = normalizeKeys(response.data);
          console.log("Normalized Data:", normalizedData);
          setTableData(normalizedData);
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

  // ============================================================
  // ✅ PDF EXPORT
  // ============================================================
  const exportPDFHandler = () => {
    const doc = new jsPDF({
      orientation: "portrait",
      unit: "mm",
      format: "a4",
    });

    const pageWidth = doc.internal.pageSize.width;
    const pageHeight = doc.internal.pageSize.height;

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

    const setNormalFont = () => {
      doc.setFont("verdana-regular", "normal");
      doc.setFontSize(10);
    };

    const setBoldFont = () => {
      doc.setFont("verdana", "bold");
      doc.setFontSize(10);
    };

    doc.setFont("verdana", "bold");
    doc.setFontSize(18);
    doc.text(comapnyname, pageWidth / 2, 15, { align: "center" });

    doc.setFont("verdana-regular", "normal");
    doc.setFontSize(12);
    doc.text(
      `Balance Sheet Report As On ${toInputDate}`,
      pageWidth / 2,
      22,
      { align: "center" }
    );

    // ASSETS SECTION
    setBoldFont();
    doc.setTextColor(255, 0, 0);
    doc.text("ASSETS", 20, 40);

    setNormalFont();
    doc.setTextColor(0, 0, 0);

    let yPos = 50;
    const lineGap = 8;

    // Fixed Assets
    setBoldFont();
    doc.text("FIXED ASSETS", 25, yPos);
    yPos += lineGap;
    setNormalFont();

    const fixedAssets = [
      ["Land & Building", "LAND & BUILDING"],
      ["Vehicles", "VEHICLES"],
      ["Furniture & Fixture", "FURNITURE & FIXTURE"],
      ["Electric Equipment", "ELECTRIC EQUIPMENT"],
      ["Telephone & Mobiles", "TELEPHONE & MOBILES"],
      ["IT Equipment", "IT EQUIPMENT"],
      ["Total", "Total"],
    ];

    fixedAssets.forEach(([label, key]) => {
      const val = getValue(
        tableData?.ASSETS?.["FIXED ASSETS"],
        key
      );
      doc.text(label, 30, yPos);
      doc.text(String(val || "0"), 160, yPos, { align: "right" });
      yPos += lineGap;
    });

    // Cash & Bank
    yPos += 3;
    setBoldFont();
    doc.text("CASH & BANK BALANCES", 25, yPos);
    yPos += lineGap;
    setNormalFont();

    const cashBank = [
      ["Cash Account", "CASH ACCOUNT"],
      ["Banks", "BANKS"],
      ["Credit Cards", "CREDIT CARDS"],
      ["Cheques", "CHEQUES"],
      ["Total", "Total"],
    ];

    cashBank.forEach(([label, key]) => {
      const val = getValue(
        tableData?.ASSETS?.["CASH & BANK BALANCES"],
        key
      );
      doc.text(label, 30, yPos);
      doc.text(String(val || "0"), 160, yPos, { align: "right" });
      yPos += lineGap;
    });

    // Receivable
    yPos += 3;
    setBoldFont();
    doc.text("RECEIVEABLE", 25, yPos);
    yPos += lineGap;
    setNormalFont();

    const receivable = [
      ["Credit Sale Account", "CREDIT SALE ACCOUNT"],
      ["Salesman Receivable", "SALESMAN RECEIVABLE"],
      ["Staff Advances", "STAFF ADVANCES"],
      ["Other Receivables", "OTHER RECEIVEABLES"],
      ["Security Receivables", "SECURITY RECEIVABLES"],
      ["Investments", "INVESTMENTS"],
      ["Total", "Total"],
    ];

    receivable.forEach(([label, key]) => {
      const val = getValue(
        tableData?.ASSETS?.["RECEIVEABLE"],
        key
      );
      doc.text(label, 30, yPos);
      doc.text(String(val || "0"), 160, yPos, { align: "right" });
      yPos += lineGap;
    });

    // Stock
    yPos += 3;
    setBoldFont();
    doc.text("STOCK", 25, yPos);
    yPos += lineGap;
    setNormalFont();

    const stockItems = [
      ["Closing Stock", "CLOSING STOCK"],
      ["Total", "Total"],
    ];

    stockItems.forEach(([label, key]) => {
      const val = getValue(tableData?.ASSETS?.["STOCK"], key);
      doc.text(label, 30, yPos);
      doc.text(String(val || "0"), 160, yPos, { align: "right" });
      yPos += lineGap;
    });

    // Total Assets
    yPos += 3;
    setBoldFont();
    const totalAssets = getValue(tableData?.ASSETS, "Total");
    doc.text("TOTAL ASSETS", 30, yPos);
    doc.text(String(totalAssets || "0"), 160, yPos, { align: "right" });

    // PAGE 2 - LIABILITIES
    doc.addPage();
    setBoldFont();
    doc.setTextColor(255, 0, 0);
    doc.text("LIABILITIES", 20, 20);

    setNormalFont();
    doc.setTextColor(0, 0, 0);

    yPos = 35;

    // Payable
    setBoldFont();
    doc.text("PAYABLE", 25, yPos);
    yPos += lineGap;
    setNormalFont();

    const payable = [
      ["Suppliers", "SUPPLIERS"],
      ["Other Payables", "OTHER PAYABLES"],
      ["Commission Payables", "COMMISSION PAYABLES"],
      ["Investment By Others", "INVESTMENT BY OTHERS"],
      ["Security Payables", "SECURITY PAYABLES"],
      ["Advances Payables", "ADVANCES PAYABLES"],
      ["Total", "Total"],
    ];

    payable.forEach(([label, key]) => {
      const val = getValue(
        tableData?.LIABILITIES?.["PAYABLE"],
        key
      );
      doc.text(label, 30, yPos);
      doc.text(String(val || "0"), 160, yPos, { align: "right" });
      yPos += lineGap;
    });

    // Capital
    yPos += 3;
    setBoldFont();
    doc.text("CAPITAL", 25, yPos);
    yPos += lineGap;
    setNormalFont();

    const capital = [
      ["Capital", "CAPITAL"],
      ["Drawing", "DRAWING"],
      ["Profit Transferd", "PROFIT TRANSFERD"],
      ["Total", "Total"],
    ];

    capital.forEach(([label, key]) => {
      const val = getValue(
        tableData?.LIABILITIES?.["CAPITAL"],
        key
      );
      doc.text(label, 30, yPos);
      doc.text(String(val || "0"), 160, yPos, { align: "right" });
      yPos += lineGap;
    });

    // Total Liabilities
    yPos += 3;
    setBoldFont();
    const totalLiabilities = getValue(tableData?.LIABILITIES, "Total");
    doc.text("TOTAL LIABILITIES", 30, yPos);
    doc.text(String(totalLiabilities || "0"), 160, yPos, {
      align: "right",
    });

    // Footer
    doc.setDrawColor(0);
    doc.line(10, pageHeight - 12, pageWidth - 10, pageHeight - 12);

    setNormalFont();
    doc.text(
      `Crystal Solution    ${date}    ${time}`,
      10,
      pageHeight - 6
    );
    doc.text("Page 1", pageWidth - 10, pageHeight - 6, { align: "right" });

    doc.save(`BalanceSheet Report As On ${toInputDate}.pdf`);
  };

  // ============================================================
  // ✅ EXCEL EXPORT
  // ============================================================
  const handleDownloadCSV = async () => {
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet("BalanceSheet");

    const fontCompanyName = {
      name: "CustomFont",
      size: 18,
      bold: true,
    };
    const fontHeader = {
      name: "CustomFont",
      size: 10,
      bold: true,
    };
    const fontTableContent = {
      name: "CustomFont",
      size: 10,
      bold: false,
    };

    worksheet.addRow([]);

    const companyRow = worksheet.addRow([comapnyname]);
    companyRow.eachCell((cell) => {
      cell.font = fontCompanyName;
      cell.alignment = { horizontal: "center" };
    });
    worksheet.getRow(companyRow.number).height = 30;
    worksheet.mergeCells(`A${companyRow.number}:D${companyRow.number}`);

    const titleRow = worksheet.addRow([
      `Balance Sheet Report As On ${toInputDate}`,
    ]);
    titleRow.eachCell((cell) => {
      cell.font = { name: "CustomFont", size: 10 };
      cell.alignment = { horizontal: "center" };
    });
    worksheet.mergeCells(`A${titleRow.number}:D${titleRow.number}`);

    worksheet.addRow([]);

    // Header
    const headerRow = worksheet.addRow([
      "Particulars",
      "Amount",
      "",
      "",
    ]);
    headerRow.eachCell((cell) => {
      cell.font = fontHeader;
      cell.alignment = { horizontal: "center" };
      cell.fill = {
        type: "pattern",
        pattern: "solid",
        fgColor: { argb: "FFC6D9F7" },
      };
      cell.border = {
        top: { style: "thin" },
        left: { style: "thin" },
        bottom: { style: "thin" },
        right: { style: "thin" },
      };
    });

    // ASSETS
    const addSection = (sectionTitle, sectionKey, items) => {
      const titleRow = worksheet.addRow([sectionTitle]);
      titleRow.eachCell((cell) => {
        cell.font = { name: "CustomFont", size: 11, bold: true };
        cell.alignment = { horizontal: "left" };
      });
      worksheet.mergeCells(`A${titleRow.number}:D${titleRow.number}`);

      items.forEach(([label, key]) => {
        const val = getValue(tableData?.ASSETS?.[sectionKey], key);
        const row = worksheet.addRow([label, val]);
        row.eachCell((cell, colIndex) => {
          cell.font = fontTableContent;
          cell.border = {
            top: { style: "thin" },
            left: { style: "thin" },
            bottom: { style: "thin" },
            right: { style: "thin" },
          };
          cell.alignment = {
            horizontal: colIndex === 2 ? "right" : "left",
          };
        });
      });
    };

    worksheet.addRow(["ASSETS"]).font = { bold: true, color: { argb: "FFFF0000" } };

    addSection("FIXED ASSETS", "FIXED ASSETS", [
      ["Land & Building", "LAND & BUILDING"],
      ["Vehicles", "VEHICLES"],
      ["Furniture & Fixture", "FURNITURE & FIXTURE"],
      ["Electric Equipment", "ELECTRIC EQUIPMENT"],
      ["Telephone & Mobiles", "TELEPHONE & MOBILES"],
      ["IT Equipment", "IT EQUIPMENT"],
      ["Total", "Total"],
    ]);

    addSection("CASH & BANK BALANCES", "CASH & BANK BALANCES", [
      ["Cash Account", "CASH ACCOUNT"],
      ["Banks", "BANKS"],
      ["Credit Cards", "CREDIT CARDS"],
      ["Cheques", "CHEQUES"],
      ["Total", "Total"],
    ]);

    addSection("RECEIVEABLE", "RECEIVEABLE", [
      ["Credit Sale Account", "CREDIT SALE ACCOUNT"],
      ["Salesman Receivable", "SALESMAN RECEIVABLE"],
      ["Staff Advances", "STAFF ADVANCES"],
      ["Other Receivables", "OTHER RECEIVEABLES"],
      ["Security Receivables", "SECURITY RECEIVABLES"],
      ["Investments", "INVESTMENTS"],
      ["Total", "Total"],
    ]);

    addSection("STOCK", "STOCK", [
      ["Closing Stock", "CLOSING STOCK"],
      ["Total", "Total"],
    ]);

    const totalAssetsRow = worksheet.addRow([
      "TOTAL ASSETS",
      getValue(tableData?.ASSETS, "Total"),
    ]);
    totalAssetsRow.eachCell((cell) => {
      cell.font = { bold: true };
      cell.border = {
        top: { style: "double" },
        left: { style: "thin" },
        bottom: { style: "double" },
        right: { style: "thin" },
      };
    });

    worksheet.addRow([]);

    // LIABILITIES
    worksheet.addRow(["LIABILITIES"]).font = {
      bold: true,
      color: { argb: "FFFF0000" },
    };

    const addLiabilitySection = (sectionTitle, sectionKey, items) => {
      const titleRow = worksheet.addRow([sectionTitle]);
      titleRow.eachCell((cell) => {
        cell.font = { name: "CustomFont", size: 11, bold: true };
        cell.alignment = { horizontal: "left" };
      });
      worksheet.mergeCells(`A${titleRow.number}:D${titleRow.number}`);

      items.forEach(([label, key]) => {
        const val = getValue(tableData?.LIABILITIES?.[sectionKey], key);
        const row = worksheet.addRow([label, val]);
        row.eachCell((cell, colIndex) => {
          cell.font = fontTableContent;
          cell.border = {
            top: { style: "thin" },
            left: { style: "thin" },
            bottom: { style: "thin" },
            right: { style: "thin" },
          };
          cell.alignment = {
            horizontal: colIndex === 2 ? "right" : "left",
          };
        });
      });
    };

    addLiabilitySection("PAYABLE", "PAYABLE", [
      ["Suppliers", "SUPPLIERS"],
      ["Other Payables", "OTHER PAYABLES"],
      ["Commission Payables", "COMMISSION PAYABLES"],
      ["Investment By Others", "INVESTMENT BY OTHERS"],
      ["Security Payables", "SECURITY PAYABLES"],
      ["Advances Payables", "ADVANCES PAYABLES"],
      ["Total", "Total"],
    ]);

    addLiabilitySection("CAPITAL", "CAPITAL", [
      ["Capital", "CAPITAL"],
      ["Drawing", "DRAWING"],
      ["Profit Transferd", "PROFIT TRANSFERD"],
      ["Total", "Total"],
    ]);

    const totalLiabRow = worksheet.addRow([
      "TOTAL LIABILITIES",
      getValue(tableData?.LIABILITIES, "Total"),
    ]);
    totalLiabRow.eachCell((cell) => {
      cell.font = { bold: true };
      cell.border = {
        top: { style: "double" },
        left: { style: "thin" },
        bottom: { style: "double" },
        right: { style: "thin" },
      };
    });

    worksheet.getColumn(1).width = 35;
    worksheet.getColumn(2).width = 20;
    worksheet.getColumn(3).width = 10;
    worksheet.getColumn(4).width = 10;

    worksheet.addRow([]);
    const getCurrentDate = () => {
      const today = new Date();
      const day = String(today.getDate()).padStart(2, "0");
      const month = String(today.getMonth() + 1).padStart(2, "0");
      const year = today.getFullYear();
      return `${day}-${month}-${year}`;
    };
    const getCurrentTime = () => {
      const today = new Date();
      const hh = String(today.getHours()).padStart(2, "0");
      const mm = String(today.getMinutes()).padStart(2, "0");
      const ss = String(today.getSeconds()).padStart(2, "0");
      return `${hh}:${mm}:${ss}`;
    };

    const dateTimeRow = worksheet.addRow([
      `DATE:   ${getCurrentDate()}  TIME:   ${getCurrentTime()}`,
    ]);
    dateTimeRow.eachCell((cell) => {
      cell.font = { name: "CustomFont", size: 10 };
      cell.alignment = { horizontal: "left" };
    });
    worksheet.mergeCells(
      `A${dateTimeRow.number}:D${dateTimeRow.number}`
    );

    const userRow = worksheet.addRow([`USER ID:  ${user.tusrid}`]);
    userRow.eachCell((cell) => {
      cell.font = { name: "CustomFont", size: 10 };
      cell.alignment = { horizontal: "left" };
    });
    worksheet.mergeCells(`A${userRow.number}:D${userRow.number}`);

    const buffer = await workbook.xlsx.writeBuffer();
    const blob = new Blob([buffer], {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    });
    saveAs(blob, `BalanceSheet Report As On ${toInputDate}.xlsx`);
  };

  const dispatch = useDispatch();

  const [selectedSearch, setSelectedSearch] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { data, loading, error } = useSelector((state) => state.getuser);

  const handleSearch = (e) => {
    setSelectedSearch(e.target.value);
  };

  useHotkeys(
    "alt+s",
    () => {
      fetchReceivableReport();
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
    padding: "0 20px",
    boxSizing: "border-box",
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

  // ============================================================
  // ✅ HELPER: Row renderer to avoid repetition
  // ============================================================
  const renderRow = (label, value) => (
    <div
      className="row"
      style={{
        display: "flex",
        alignItems: "center",
        height: "20px",
        width: "100%",
        margin: "0px",
        textAlign: "start",
      }}
    >
      <div
        style={{
          width: "45%",
          padding: "0px",
          fontSize: getdatafontsize,
          fontFamily: getfontstyle,
          fontWeight: "bold",
          textAlign: "end",
          paddingRight: "5px",
        }}
      >
        {label}
      </div>
      <div
        style={{
          width: "30%",
          height: "100%",
          padding: "0px",
          display: "flex",
          gap: "2px",
        }}
      >
        <div style={boxStyle}>{value}</div>
        <DotButton />
      </div>
      <div style={{ width: "25%" }}></div>
    </div>
  );

  const renderTotalRow = (value) => (
    <div
      className="row"
      style={{
        display: "flex",
        alignItems: "center",
        height: "20px",
        width: "100%",
        margin: "0px",
        textAlign: "start",
      }}
    >
      <div
        style={{
          width: "50%",
          padding: "0px",
          fontSize: getdatafontsize,
          fontFamily: getfontstyle,
          fontWeight: "bold",
          textAlign: "end",
          paddingRight: "5px",
        }}
      ></div>
      <div style={{ width: "25%" }}></div>
      <div style={{ width: "25%", height: "100%", padding: "0px" }}>
        <div style={boxStyle}>{value}</div>
      </div>
    </div>
  );

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

          <div style={{ border: `1px solid ${fontcolor}` }}></div>

          <div className="row" style={{ display: "flex" }}>
            <div className="col-md-6">
              <span
                style={{
                  color: "red",
                  fontSize: 16,
                  fontFamily: getfontstyle,
                  fontWeight: 600,
                  letterSpacing: "4px",
                }}
              >
                ASSETS
              </span>
            </div>
            <div className="col-md-6">
              <span
                style={{
                  color: "red",
                  fontSize: 16,
                  fontFamily: getfontstyle,
                  fontWeight: 600,
                  letterSpacing: "4px",
                }}
              >
                LIABILITIES
              </span>
            </div>
          </div>

          <div style={{ border: `1px solid ${fontcolor}` }}></div>

          <div
            className="row"
            style={{
              width: "100%",
              margin: "0px",
              maxHeight: "55vh",
              overflowY: "auto",
              overflowX: "hidden",
            }}
          >
            {/* ============================================== */}
            {/* ASSETS SECTION */}
            {/* ============================================== */}
            <div
              style={{
                padding: "0px",
                width: "50%",
                borderRight: `1px solid ${fontcolor}`,
                padding: "0px 10px",
              }}
            >
              {/* FIXED ASSETS SECTION */}
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "2px",
                  justifyContent: "start",
                  alignItems: "start",
                }}
              >
                <div style={{ width: "100%" }}>
                  <div
                    style={{
                      width: "50%",
                      fontSize: getdatafontsize,
                      fontFamily: getfontstyle,
                      fontWeight: "bold",
                      textAlign: "end",
                      color: "red",
                      paddingRight: "5px",
                    }}
                  >
                    FIXED ASSETS
                  </div>
                </div>

                {renderRow(
                  "Land & Building :",
                  getValue(
                    tableData?.ASSETS?.["FIXED ASSETS"],
                    "LAND & BUILDING"
                  )
                )}
                {renderRow(
                  "Vehicles :",
                  getValue(tableData?.ASSETS?.["FIXED ASSETS"], "VEHICLES")
                )}
                {renderRow(
                  "Furniture & Fixture :",
                  getValue(
                    tableData?.ASSETS?.["FIXED ASSETS"],
                    "FURNITURE & FIXTURE"
                  )
                )}
                {renderRow(
                  "Electric Equipment :",
                  getValue(
                    tableData?.ASSETS?.["FIXED ASSETS"],
                    "ELECTRIC EQUIPMENT"
                  )
                )}
                {renderRow(
                  "Telephone & Mobiles :",
                  getValue(
                    tableData?.ASSETS?.["FIXED ASSETS"],
                    "TELEPHONE & MOBILES"
                  )
                )}
                {renderRow(
                  "IT Equipment :",
                  getValue(
                    tableData?.ASSETS?.["FIXED ASSETS"],
                    "IT EQUIPMENT"
                  )
                )}
                {renderTotalRow(
                  getValue(tableData?.ASSETS?.["FIXED ASSETS"], "Total")
                )}
              </div>

              {/* CASH & BANK BALANCES SECTION */}
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "2px",
                  justifyContent: "start",
                  alignItems: "start",
                }}
              >
                <div style={{ width: "100%" }}>
                  <div
                    style={{
                      width: "50%",
                      fontSize: getdatafontsize,
                      fontFamily: getfontstyle,
                      fontWeight: "bold",
                      textAlign: "end",
                      color: "red",
                      paddingRight: "5px",
                    }}
                  >
                    CASH & BANK BALANCES
                  </div>
                </div>

                {renderRow(
                  "Cash Account :",
                  getValue(
                    tableData?.ASSETS?.["CASH & BANK BALANCES"],
                    "CASH ACCOUNT"
                  )
                )}
                {renderRow(
                  "Banks :",
                  getValue(
                    tableData?.ASSETS?.["CASH & BANK BALANCES"],
                    "BANKS"
                  )
                )}
                {renderRow(
                  "Credit Cards :",
                  getValue(
                    tableData?.ASSETS?.["CASH & BANK BALANCES"],
                    "CREDIT CARDS"
                  )
                )}
                {renderRow(
                  "Cheques :",
                  getValue(
                    tableData?.ASSETS?.["CASH & BANK BALANCES"],
                    "CHEQUES"
                  )
                )}
                {renderTotalRow(
                  getValue(
                    tableData?.ASSETS?.["CASH & BANK BALANCES"],
                    "Total"
                  )
                )}
              </div>

              {/* RECEIVEABLE SECTION */}
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "2px",
                  justifyContent: "start",
                  alignItems: "start",
                }}
              >
                <div style={{ width: "100%" }}>
                  <div
                    style={{
                      width: "50%",
                      fontSize: getdatafontsize,
                      fontFamily: getfontstyle,
                      fontWeight: "bold",
                      textAlign: "end",
                      color: "red",
                      paddingRight: "5px",
                    }}
                  >
                    RECEIVEABLE
                  </div>
                </div>

                {renderRow(
                  "Credit Sale Account :",
                  getValue(
                    tableData?.ASSETS?.["RECEIVEABLE"],
                    "CREDIT SALE ACCOUNT"
                  )
                )}
                {renderRow(
                  "Salesman Receivable :",
                  getValue(
                    tableData?.ASSETS?.["RECEIVEABLE"],
                    "SALESMAN RECEIVABLE"
                  )
                )}
                {renderRow(
                  "Staff Advances :",
                  getValue(
                    tableData?.ASSETS?.["RECEIVEABLE"],
                    "STAFF ADVANCES"
                  )
                )}
                {renderRow(
                  "Other Receivables :",
                  getValue(
                    tableData?.ASSETS?.["RECEIVEABLE"],
                    "OTHER RECEIVEABLES"
                  )
                )}
                {renderRow(
                  "Security Receivables :",
                  getValue(
                    tableData?.ASSETS?.["RECEIVEABLE"],
                    "SECURITY RECEIVABLES"
                  )
                )}
                {renderRow(
                  "Investments :",
                  getValue(
                    tableData?.ASSETS?.["RECEIVEABLE"],
                    "INVESTMENTS"
                  )
                )}
                {renderTotalRow(
                  getValue(tableData?.ASSETS?.["RECEIVEABLE"], "Total")
                )}
              </div>

              {/* STOCK SECTION */}
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "2px",
                  justifyContent: "start",
                  alignItems: "start",
                }}
              >
                <div style={{ width: "100%" }}>
                  <div
                    style={{
                      width: "50%",
                      fontSize: getdatafontsize,
                      fontFamily: getfontstyle,
                      fontWeight: "bold",
                      textAlign: "end",
                      color: "red",
                      paddingRight: "5px",
                    }}
                  >
                    STOCK
                  </div>
                </div>

                {renderRow(
                  "Closing Stock :",
                  getValue(tableData?.ASSETS?.["STOCK"], "CLOSING STOCK")
                )}
                {renderTotalRow(
                  getValue(tableData?.ASSETS?.["STOCK"], "Total")
                )}
              </div>
            </div>

            {/* ============================================== */}
            {/* LIABILITIES SECTION */}
            {/* ============================================== */}
            <div
              style={{
                padding: "0px",
                width: "50%",
                padding: "0px 10px",
              }}
            >
              {/* PAYABLE SECTION */}
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "2px",
                  justifyContent: "start",
                  alignItems: "start",
                }}
              >
                <div
                  style={{
                    width: "100%",
                    fontSize: getdatafontsize,
                    fontFamily: getfontstyle,
                    fontWeight: "bold",
                    textAlign: "start",
                    color: "red",
                  }}
                >
                  PAYABLE
                </div>

                {renderRow(
                  "Suppliers :",
                  getValue(tableData?.LIABILITIES?.["PAYABLE"], "SUPPLIERS")
                )}
                {renderRow(
                  "Other Payables :",
                  getValue(
                    tableData?.LIABILITIES?.["PAYABLE"],
                    "OTHER PAYABLES"
                  )
                )}
                {renderRow(
                  "Commission Payables :",
                  getValue(
                    tableData?.LIABILITIES?.["PAYABLE"],
                    "COMMISSION PAYABLES"
                  )
                )}
                {renderRow(
                  "Investment By Others :",
                  getValue(
                    tableData?.LIABILITIES?.["PAYABLE"],
                    "INVESTMENT BY OTHERS"
                  )
                )}
                {renderRow(
                  "Security Payables :",
                  getValue(
                    tableData?.LIABILITIES?.["PAYABLE"],
                    "SECURITY PAYABLES"
                  )
                )}
                {renderRow(
                  "Advance Payables :",
                  getValue(
                    tableData?.LIABILITIES?.["PAYABLE"],
                    "ADVANCES PAYABLES"
                  )
                )}
                {renderTotalRow(
                  getValue(tableData?.LIABILITIES?.["PAYABLE"], "Total")
                )}
              </div>

              {/* CAPITAL SECTION */}
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "2px",
                  justifyContent: "start",
                  alignItems: "start",
                }}
              >
                <div
                  style={{
                    width: "100%",
                    fontSize: getdatafontsize,
                    fontFamily: getfontstyle,
                    fontWeight: "bold",
                    textAlign: "start",
                    color: "red",
                  }}
                >
                  CAPITAL
                </div>

                {renderRow(
                  "Capital :",
                  getValue(tableData?.LIABILITIES?.["CAPITAL"], "CAPITAL")
                )}
                {renderRow(
                  "Drawing :",
                  getValue(tableData?.LIABILITIES?.["CAPITAL"], "DRAWING")
                )}
                {renderRow(
                  "Profit Transferd :",
                  getValue(
                    tableData?.LIABILITIES?.["CAPITAL"],
                    "PROFIT TRANSFERD"
                  )
                )}
                {renderTotalRow(
                  getValue(tableData?.LIABILITIES?.["CAPITAL"], "Total")
                )}
              </div>
            </div>
          </div>

          {/* FOOTER SECTION */}
          <div
            style={{
              width: "100%",
              display: "flex",
              padding: "0",
              margin: "0",
            }}
          >
            <div
              style={{
                width: "50%",
                margin: "5px 0px",
                borderTop: `1px solid ${fontcolor}`,
                borderBottom: `1px solid ${fontcolor}`,
              }}
            >
              <div
                className="row"
                style={{
                  display: "flex",
                  alignItems: "center",
                  height: "22px",
                  padding: "2px 0px",
                  width: "100%",
                  margin: "0px",
                }}
              >
                <div
                  style={{
                    width: "47.5%",
                    padding: "0px",
                    fontSize: getdatafontsize,
                    fontFamily: getfontstyle,
                    fontWeight: "bold",
                    textAlign: "end",
                    paddingRight: "5px",
                  }}
                ></div>
                <div style={{ width: "25%" }}></div>
                <div
                  style={{ width: "23.5%", height: "100%", padding: "0px" }}
                >
                  <div style={boxStyle}>
                    {getValue(tableData?.ASSETS, "Total")}
                  </div>
                </div>
              </div>
            </div>
            <div
              style={{
                width: "50%",
                margin: "5px 0px",
                borderTop: `1px solid ${fontcolor}`,
                borderBottom: `1px solid ${fontcolor}`,
              }}
            >
              <div
                className="row"
                style={{
                  display: "flex",
                  alignItems: "center",
                  height: "22px",
                  padding: "2px 0px",
                  width: "100%",
                  margin: "0px",
                }}
              >
                <div
                  style={{
                    width: "47.5%",
                    padding: "0px",
                    fontSize: getdatafontsize,
                    fontFamily: getfontstyle,
                    fontWeight: "bold",
                    textAlign: "end",
                    paddingRight: "5px",
                  }}
                ></div>
                <div style={{ width: "25%" }}></div>
                <div
                  style={{ width: "23.5%", height: "100%", padding: "0px" }}
                >
                  <div style={boxStyle}>
                    {getValue(tableData?.LIABILITIES, "Total")}
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