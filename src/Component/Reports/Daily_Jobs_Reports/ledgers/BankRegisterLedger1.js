import React, { useState, useEffect, useRef } from "react";
import { Container, Spinner, Nav } from "react-bootstrap";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import { useTheme } from "../../../../ThemeContext";
import { getUserData, getOrganisationData, getLocationnumber, getYearDescription } from "../../../Auth";
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

export default function BankRegisterLedger1() {
  const navigate = useNavigate();
  const user = getUserData();
  const organisation = getOrganisationData();

  const saleSelectRef = useRef(null);
  const input1Ref = useRef(null);
  const input2Ref = useRef(null);
  const input3Ref = useRef(null);

  // Add this at the top of your component
  const hasInitialized = useRef(false);

  const toRef = useRef(null);
  const fromRef = useRef(null);

  const [saleType, setSaleType] = useState("");
  const [Companyselectdatavalue, setCompanyselectdatavalue] = useState("");

  const [searchQuery, setSearchQuery] = useState("");
  const [transectionType, settransectionType] = useState("");
  const [supplierList, setSupplierList] = useState([]);

  const [totalQnty, setTotalQnty] = useState(0);
  const [totalOpening, setTotalOpening] = useState(0);
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
    getnavbarbackgroundcolor
  } = useTheme();

  useEffect(() => {
    document.documentElement.style.setProperty("--background-color", getcolor);
  }, [getcolor]);

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
      date.getMonth() + 1
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

        const currentDate = new Date();
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

        const currentDate = new Date();
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

  function fetchReceivableReport() {
    const fromDateElement = document.getElementById("fromdatevalidation");
    const toDateElement = document.getElementById("todatevalidation");

    const dateRegex = /^\d{2}-\d{2}-\d{4}$/;

    let hasError = false;
    let errorType = "";

    switch (true) {
      case !saleType:
        errorType = "saleType";
        break;
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
        "$1-$2-$3"
      );
      const [fromDay, fromMonth, fromYear] = formattedFromInput
        .split("-")
        .map(Number);
      const enteredFromDate = new Date(fromYear, fromMonth - 1, fromDay);

      const formattedToInput = toInputDate.replace(
        /^(\d{2})(\d{2})(\d{4})$/,
        "$1-$2-$3"
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
      case "saleType":
        toast.error("Please select a Account Code");
        return;

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
          `From date must be after ${GlobalfromDate1} and before ${GlobaltoDate1}`
        );
        return;
      case "fromDateAfterGlobal":
        toast.error(
          `From date must be after ${GlobalfromDate1} and before ${GlobaltoDate1}`
        );
        return;
      case "toDateAfterGlobal":
        toast.error(
          `To date must be after ${GlobalfromDate1} and before ${GlobaltoDate1}`
        );
        return;
      case "toDateBeforeGlobal":
        toast.error(
          `To date must be after ${GlobalfromDate1} and before ${GlobaltoDate1}`
        );
        return;
      case "toDateBeforeFromDate":
        toast.error("To date must be after from date");
        return;

      default:
        break;
    }

    // console.log(data);
    document.getElementById(
      "fromdatevalidation"
    ).style.border = `1px solid ${fontcolor}`;
    document.getElementById(
      "todatevalidation"
    ).style.border = `1px solid ${fontcolor}`;

    const apiUrl = apiLinks + "/BankRegister.php";
    setIsLoading(true);
    const formData = new URLSearchParams({
      FIntDat: fromInputDate,
      FFnlDat: toInputDate,
      FTrnTyp: transectionType,
      FAccCod: saleType,
      code: organisation.code,
      FLocCod: locationnumber || getLocationNumber,
      FYerDsc: yeardescription || getYearDescription,

      // code: 'ZSTRD',
      // FLocCod: '001',
      // FYerDsc: '2025-2025',
    }).toString();

    axios
      .post(apiUrl, formData)
      .then((response) => {
        setIsLoading(false);
        console.log("Response:", response.data);
        // setTotalOpening(response.data["Total Opening"]);
        setTotalDebit(response.data["Total Debit "]);
        setTotalCredit(response.data["Total Credit"]);
        setClosingBalance(response.data["Closing Bal "]);

        if (response.data && Array.isArray(response.data.Detail)) {
          setTableData(response.data.Detail);
        } else {
          console.warn(
            "Response data structure is not as expected:",
            response.data
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
    if (
      !hasComponentMountedPreviously ||
      (saleSelectRef && saleSelectRef.current)
    ) {
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

  useEffect(() => {
    const apiUrl = apiLinks + "/GetActiveBanks.php";
    const formData = new URLSearchParams({
      FLocCod: getLocationNumber,
      code: organisation.code,
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

  const [isOptionsLoaded, setIsOptionsLoaded] = useState(false);
  useEffect(() => {
    if (supplierList.length > 0) {
      setIsOptionsLoaded(true);
    }
  }, [supplierList]);

  const options = supplierList.map((item) => ({
    value: item.tacccod,
    label: `${item.tacccod}-${item.taccdsc.trim()}`,
  }));

  useEffect(() => {
    if (isOptionsLoaded && options.length > 0 && !saleType && !hasInitialized.current) {
      const firstOption = options[0];
      setSaleType(firstOption.value);

      const fullLabel = firstOption.label;
      const description = fullLabel.split('-').pop()?.trim();

      setCompanyselectdatavalue({
        value: firstOption.value,
        label: description,
        fullLabel: fullLabel
      });

      // Mark as initialized
      hasInitialized.current = true;
    }
  }, [isOptionsLoaded, options, saleType]);



const DropdownOption = (props) => {
    return (
      <components.Option {...props}>
        <div
          style={{
            fontSize: getdatafontsize,
            fontFamily: getfontstyle,
            padding: "2px 8px",            // tighter vertical padding
            lineHeight: "1.2",
            // lineHeight: "3px",
            whiteSpace: "normal",
            wordBreak: "break-word",
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
        borderColor: "red", // Changed from #3368B5 to red
        boxShadow: "0 0 0 1px red", // Changed from #3368B5 to red
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
          backgroundColor: "#3368B5", // unchanged
        },
      },
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
      whiteSpace: "normal",
      wordBreak: "break-word",
      padding: "2px 8px",        // reduced padding
      lineHeight: "1.2",         // ✅ compact line height
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
        color: "#3368B5", // unchanged
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
        color: "#ff4444", // unchanged
      },
    }),
    placeholder: (base) => ({
      ...base,
      color: `${fontcolor}80`,
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
      backgroundColor: `${fontcolor}20`,
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


  const handleTransactionTypeChange = (event) => {
    const selectedTransactionType = event.target.value;
    settransectionType(selectedTransactionType);
  };

  ///////////////////////////// DOWNLOAD PDF CODE ////////////////////////////////////////////////////////////
const exportPDFHandler = () => {
  // ─── 1. PAGE SETUP & DATE/TIME ─────────────────────────────
  const doc = new jsPDF({ orientation: "landscape" });

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

  // ─── 2. TABLE DATA ──────────────────────────────────────────
  const rows = tableData.map((item) => [
    item.Date,
    item["Trn#"],
    item.Type,
    item.Description,
    item["Chq Date"],
    item["Chq #"],
    item.Debit,
    item.Credit,
    item.Balance,
  ]);

  // Add total row
  rows.push([
    String(tableData.length.toLocaleString()),
    "",
    "",
    "",
    "",
    "",
    String(totalDebit),
    String(totalCredit),
    String(closingBalance),
  ]);

  // ─── 3. HEADERS & COLUMN WIDTHS ────────────────────────────
  const headers = [
    "Date",
    "Trn#",
    "Type",
    "Description",
    "Chq Date",
    "Chq #",
    "Debit",
    "Credit",
    "Balance",
  ];
  const columnWidths = [24, 17, 12, 90, 24, 40, 27, 27, 30];

  const totalWidth = columnWidths.reduce((acc, w) => acc + w, 0);
  const pageHeight = doc.internal.pageSize.height;
  const paddingTop = 15;
  const footerReserve = 18;

  // ─── 4. HELPERS ─────────────────────────────────────────────
  const getTotalTableWidth = () => {
    let total = 0;
    columnWidths.forEach((w) => (total += w));
    return total;
  };

  // ─── 5. DRAW TABLE HEADERS ──────────────────────────────────
  const addTableHeaders = (startX, startY) => {
    doc.setFont("verdana", "bold");
    doc.setFontSize(10);
    let currentX = startX;
    headers.forEach((header, index) => {
      const cellWidth = columnWidths[index];
      const cellHeight = 6;
      const cellX = currentX + cellWidth / 2;
      const cellY = startY + cellHeight / 2 + 1.5;
      doc.setFillColor(200, 200, 200);
      doc.rect(currentX, startY, cellWidth, cellHeight, "F");
      doc.setLineWidth(0.2);
      doc.rect(currentX, startY, cellWidth, cellHeight);
      doc.setTextColor(0);
      doc.text(header, cellX, cellY, { align: "center" });
      currentX += cellWidth;
    });
  };

  // ─── 6. DRAW FOOTER ─────────────────────────────────────────
  const drawFooter = () => {
    const tableWidth = getTotalTableWidth();
    const lineX = (doc.internal.pageSize.width - tableWidth) / 2;
    const lineY = pageHeight - 12;
    doc.setLineWidth(0.3);
    doc.line(lineX, lineY, lineX + tableWidth, lineY);
    doc.setFont("verdana-regular", "normal");
    doc.setFontSize(10);
    doc.setTextColor(0, 0, 0);
    doc.text(`Crystal Solution    ${date}    ${time}`, lineX + 2, lineY + 4);
  };

  // ─── 7. DRAW A SINGLE ROW ──────────────────────────────────
  const drawRow = (startX, startY, rowIndex, rowData, isTotalRow) => {
    const lineHeight = 4;
    const tableWidth = getTotalTableWidth();
    const textColor = [0, 0, 0];

    // ── PREVENT WRAPPING for: Date(0), Trn#(1), Type(2), Chq Date(4), Chq #(5), and numeric columns ──
    const noWrapIndices = [0, 1, 2, 4, 5, 6, 7, 8];

    const splitRow = rowData.map((cell, idx) => {
      const text = String(cell).trim();
      if (noWrapIndices.includes(idx)) {
        return [text]; // keep on one line
      }
      // Only Description (3) may wrap
      const maxWidth = columnWidths[idx] - 4;
      const textWidth =
        (doc.getStringUnitWidth(text) * doc.internal.getFontSize()) /
        doc.internal.scaleFactor;
      if (textWidth <= maxWidth) return [text];
      return doc.splitTextToSize(text, maxWidth);
    });

    const maxLines = Math.max(...splitRow.map((c) => c.length));
    const rowHeight = maxLines * lineHeight + 2;

    // Alternating background
    if (rowIndex % 2 !== 0 && !isTotalRow) {
      doc.setFillColor(240);
      doc.rect(startX, startY, tableWidth, rowHeight, "F");
    }
    doc.setDrawColor(0);

    // Borders (double for total row)
    if (isTotalRow) {
      doc.setFont("verdana", "bold");
      doc.setLineWidth(0.3);
      doc.line(startX, startY, startX + tableWidth, startY);
      doc.line(startX, startY + 0.5, startX + tableWidth, startY + 0.5);
      doc.line(startX, startY + rowHeight, startX + tableWidth, startY + rowHeight);
      doc.line(startX, startY + rowHeight - 0.5, startX + tableWidth, startY + rowHeight - 0.5);
      doc.setLineWidth(0.2);
      doc.line(startX, startY, startX, startY + rowHeight);
      doc.line(startX + tableWidth, startY, startX + tableWidth, startY + rowHeight);
    } else {
      doc.setLineWidth(0.2);
      doc.rect(startX, startY, tableWidth, rowHeight);
      doc.setFont("verdana-regular", "normal");
    }

    // Cell content
    let currentX = startX;
    splitRow.forEach((textArray, cellIndex) => {
      const cellWidth = columnWidths[cellIndex];
      doc.setTextColor(...textColor);
      doc.setFontSize(10);
      const textY =
        startY + (rowHeight - textArray.length * lineHeight) / 2 + lineHeight - 1;

      let align = "left";
      if (cellIndex === 2) {
        align = "center";
      } else if (cellIndex >= 6) {
        align = "right";
      }
      // For total row, center the first column (record count) and "Total" label (column 3)
      if (isTotalRow && (cellIndex === 0 || cellIndex === 3)) {
        align = "center";
      }

      let xPos;
      if (align === "right") xPos = currentX + cellWidth - 2;
      else if (align === "center") xPos = currentX + cellWidth / 2;
      else xPos = currentX + 2;

      textArray.forEach((line, lineIdx) => {
        const y = textY + (lineIdx === 0 ? 0 : lineIdx * lineHeight);
        doc.text(line, xPos, y, { align: align });
      });

      if (cellIndex < splitRow.length - 1) {
        doc.line(currentX + cellWidth, startY, currentX + cellWidth, startY + rowHeight);
      }
      currentX += cellWidth;
    });

    if (isTotalRow) doc.setFont("verdana-regular", "normal");
    return startY + rowHeight;
  };

  // ─── 8. ADD PAGE CONTENT ──────────────────────────────────
  const addPageContent = (startY) => {
    const addTitle = (title, y, fontSize = 18) => {
      doc.setFontSize(fontSize);
      doc.text(title, doc.internal.pageSize.width / 2, y, { align: "center" });
    };

    doc.setFont("Times New Roman", "normal");
    addTitle(comapnyname, startY, 18);
    startY += 5;

    doc.setFont("verdana-regular", "normal");
    addTitle(
      `Bank Register From: ${fromInputDate} To: ${toInputDate}`,
      startY,
      12
    );
    startY -= 5;

    const labelsX = (doc.internal.pageSize.width - totalWidth) / 2;
    const labelsY = startY + 4;

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
        : transectionType === "JVR"
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
    doc.text(`Account :`, labelsX, labelsY + 8.5);
    doc.setFont("verdana-regular", "normal");
    doc.text(`${search}`, labelsX + 25, labelsY + 8.5);

    doc.setFont("verdana", "bold");
    doc.text(`Type :`, labelsX + 200, labelsY + 8.5);
    doc.setFont("verdana-regular", "normal");
    doc.text(`${status}`, labelsX + 215, labelsY + 8.5);

    startY += 10;

    const headersStartY = 29;
    addTableHeaders((doc.internal.pageSize.width - totalWidth) / 2, headersStartY);

    return headersStartY + 6;
  };

  // ─── 9. DYNAMIC PAGINATION ─────────────────────────────────
  const renderPages = () => {
    let currentY = paddingTop;
    let rowIndex = 0;
    let pageNumber = 1;

    while (rowIndex < rows.length) {
      if (pageNumber > 1) {
        doc.addPage();
        currentY = paddingTop;
      }

      currentY = addPageContent(currentY);
      const tableStartX = (doc.internal.pageSize.width - totalWidth) / 2;

      while (rowIndex < rows.length) {
        const row = rows[rowIndex];
        const isTotalRow = rowIndex === rows.length - 1;

        // Estimate row height using the Description column (index 3)
        const descText = String(row[3]);
        const maxWidth = columnWidths[3] - 4;
        const lines = doc.splitTextToSize(descText, maxWidth);
        const lineCount = Math.max(1, lines.length);
        const rowHeight = lineCount * 4 + 2;

        if (currentY + rowHeight > pageHeight - footerReserve) {
          drawFooter();
          break;
        }

        currentY = drawRow(tableStartX, currentY, rowIndex, row, isTotalRow);
        rowIndex++;
      }

      if (rowIndex >= rows.length) {
        drawFooter();
        break;
      }
      pageNumber++;
    }
  };

  // ─── 10. DRY RUN: COMPUTE TOTAL PAGES ──────────────────────
  const computeTotalPages = () => {
    const measureDoc = new jsPDF({ orientation: "landscape" });
    measureDoc.setFont("verdana-regular", "normal");
    measureDoc.setFontSize(10);

    const measureRows = [...rows];
    const measureColumnWidths = [...columnWidths];
    const measurePageHeight = measureDoc.internal.pageSize.height;
    const measureFooterReserve = 18;
    const lineHeight = 4;

    const measureDrawRow = (startY, rowIndex, rowData) => {
      const noWrapIndices = [0, 1, 2, 4, 5, 6, 7, 8];
      const splitRow = rowData.map((cell, idx) => {
        const text = String(cell).trim();
        if (noWrapIndices.includes(idx)) return [text];
        const maxWidth = measureColumnWidths[idx] - 4;
        const textWidth =
          (measureDoc.getStringUnitWidth(text) * measureDoc.internal.getFontSize()) /
          measureDoc.internal.scaleFactor;
        if (textWidth <= maxWidth) return [text];
        return measureDoc.splitTextToSize(text, maxWidth);
      });
      const maxLines = Math.max(...splitRow.map((c) => c.length));
      return maxLines * lineHeight + 2;
    };

    const measureAddPageContent = (startY) => {
      return startY + 34;
    };

    let pageCount = 0;
    let rowIndex = 0;
    let currentY = paddingTop;

    while (rowIndex < measureRows.length) {
      if (pageCount > 0) {
        currentY = paddingTop;
      }
      currentY = measureAddPageContent(currentY);
      while (rowIndex < measureRows.length) {
        const row = measureRows[rowIndex];
        const rowHeight = measureDrawRow(currentY, rowIndex, row);
        if (currentY + rowHeight > measurePageHeight - measureFooterReserve) {
          break;
        }
        currentY += rowHeight;
        rowIndex++;
      }
      pageCount++;
      if (rowIndex >= measureRows.length) break;
    }
    return pageCount;
  };

  const totalPages = computeTotalPages();

  // ─── 11. GENERATE PDF ──────────────────────────────────────
  renderPages();

  // ─── 12. ADD PAGE NUMBERS (Page X / Y) ────────────────────
  for (let p = 1; p <= totalPages; p++) {
    doc.setPage(p);
    doc.setFont("verdana-regular", "normal");
    doc.setFontSize(10);
    doc.setTextColor(0, 0, 0);
    doc.text(
      `Page ${p} / ${totalPages}`,
      doc.internal.pageSize.width - 10,
      pageHeight - 8,
      { align: "right" }
    );
  }

  // ─── 13. SAVE ──────────────────────────────────────────────
  doc.save(`BankRegister Form ${fromInputDate} To ${toInputDate}.pdf`);
};
  ///////////////////////////// DOWNLOAD PDF CODE ////////////////////////////////////////////////////////////

  ///////////////////////////// DOWNLOAD PDF EXCEL //////////////////////////////////////////////////////////
  const handleDownloadCSV = async () => {
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet("Sheet1");

    const numColumns = 6; // Ensure this matches the actual number of columns

    const columnAlignments = [
      "center",
      "center",
      "center",
      "left",
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

    // Helper function to format numbers - preserves original decimal places
    const formatNumber = (value) => {
      if (value === null || value === undefined || value === "") return "";
      
      // If it's already a number, return it directly
      if (typeof value === 'number') {
        return value;
      }
      
      // If it's a string, remove commas and convert to number
      if (typeof value === 'string') {
        const cleaned = value.replace(/,/g, '');
        const num = parseFloat(cleaned);
        if (isNaN(num)) return value;
        return num;
      }
      
      return value;
    };

    // Helper function to determine if a number has decimal places
    const hasDecimal = (value) => {
      if (typeof value === 'number') {
        return value % 1 !== 0;
      }
      if (typeof value === 'string') {
        const cleaned = value.replace(/,/g, '');
        return cleaned.includes('.');
      }
      return false;
    };

    // Helper function to get appropriate number format
    const getNumberFormat = (value) => {
      if (value === null || value === undefined || value === "") return '';
      
      let num;
      if (typeof value === 'string') {
        num = parseFloat(value.replace(/,/g, ''));
      } else {
        num = value;
      }
      
      if (isNaN(num)) return '';
      
      // Check if original value has decimal places
      const hasDecimals = hasDecimal(value);
      
      if (hasDecimals) {
        // Count decimal places in original value
        let decimalPlaces = 0;
        if (typeof value === 'string') {
          const match = value.replace(/,/g, '').match(/\.(\d+)/);
          if (match) {
            decimalPlaces = match[1].length;
          }
        } else if (typeof value === 'number') {
          const str = value.toString();
          const match = str.match(/\.(\d+)/);
          if (match) {
            decimalPlaces = match[1].length;
          }
        }
        // Limit to 2 decimal places max
        decimalPlaces = Math.min(decimalPlaces, 2);
        return `#,##0.${'0'.repeat(decimalPlaces)}`;
      } else {
        // No decimals - show whole numbers with commas but no decimal places
        return '#,##0';
      }
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
      `A${companyRow.number}:${String.fromCharCode(68 + numColumns - 1)}${companyRow.number
      }`
    );

    // Add Store List row
    const storeListRow = worksheet.addRow([`Bank Register From ${fromInputDate} To ${toInputDate}`]);
    storeListRow.eachCell((cell) => {
      cell.font = fontStoreList;
      cell.alignment = { horizontal: "center" };
    });

    worksheet.mergeCells(
      `A${storeListRow.number}:${String.fromCharCode(68 + numColumns - 1)}${storeListRow.number
      }`
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
    } else if (transectionType === "JVR") {
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

    let Accountselect = Companyselectdatavalue.label ? Companyselectdatavalue.label : "ALL";

    let typesearch = searchQuery || "";

    // Apply styling for the status row
    const typeAndStoreRow2 = worksheet.addRow(
      ["Account :", Accountselect, "", "", "", "", "Type :", typestatus]
    );

    const typeAndStoreRow3 = worksheet.addRow(
      searchQuery
        ? ["", "", "", "", "", "", "Search :", typesearch]
        : [""]
    );


    // Merge cells for Accountselect (columns B to D)
    worksheet.mergeCells(`B${typeAndStoreRow2.number}:D${typeAndStoreRow2.number}`);

    // Apply styling for the status row
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
        bold: [7].includes(colIndex),
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
      "Chq Date",
      "Chq #",
      "Debit",
      "Credit",
      "Balance",
    ];
    const headerRow = worksheet.addRow(headers);
    headerRow.eachCell((cell) => Object.assign(cell, headerStyle));

    // Add data rows
    tableData.forEach((item) => {
      // Format numeric values
      const debitValue = formatNumber(item.Debit);
      const creditValue = formatNumber(item.Credit);
      const balanceValue = formatNumber(item.Balance);

      const row = worksheet.addRow([
        item.Date,
        item["Trn#"],
        item.Type,
        item.Description,
        item["Chq Date"],
        item["Chq #"],
        debitValue,
        creditValue,
        balanceValue,
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
        
        // Apply appropriate number format for numeric columns (7, 8, 9)
        if (colIndex >= 7 && colIndex <= 9) {
          const originalValue = colIndex === 7 ? item.Debit : 
                               colIndex === 8 ? item.Credit : 
                               item.Balance;
          const numFormat = getNumberFormat(originalValue);
          if (numFormat) {
            cell.numFmt = numFormat;
          }
        }
      });
    });

    // Format total values
    const totalDebitValue = formatNumber(totalDebit);
    const totalCreditValue = formatNumber(totalCredit);
    const closingBalanceValue = formatNumber(closingBalance);

    const totalRow = worksheet.addRow([
      String(tableData.length.toLocaleString()),
      "",
      "",
      "",
      "",
      "",
      totalDebitValue,
      totalCreditValue,
      closingBalanceValue,
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

      // Apply appropriate number format for numeric columns (7, 8, 9)
      if (colNumber >= 7 && colNumber <= 9) {
        const originalValue = colNumber === 7 ? totalDebit : 
                             colNumber === 8 ? totalCredit : 
                             closingBalance;
        const numFormat = getNumberFormat(originalValue);
        if (numFormat) {
          cell.numFmt = numFormat;
        }
      }

      // Align only the "Total" text to the right
      if (colNumber > 6 ) {
        cell.alignment = { horizontal: "right" };
      }
      if (colNumber === 1 ) {
        cell.alignment = { horizontal: "center" };
      }
    });

    // Set column widths
    [10,7, 5, 45, 10, 18, 12, 12, 15].forEach((width, index) => {
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
    const dateTimeRow = worksheet.addRow([`DATE:   ${currentdate}  TIME:   ${currentTime}`]);
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
    dateTimeRow1.eachCell((cell) => {
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
      `A${dateTimeRow.number}:${String.fromCharCode(65 + numColumns - 1)}${dateTimeRow.number}`
    );
    worksheet.mergeCells(
      `A${dateTimeRow1.number}:${String.fromCharCode(65 + numColumns - 1)}${dateTimeRow1.number}`
    );

    // Generate and save the Excel file
    const buffer = await workbook.xlsx.writeBuffer();
    const blob = new Blob([buffer], {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    });
    saveAs(blob, `BankRegister From ${fromInputDate} To ${toInputDate}.xlsx`);
  };
  ///////////////////////////// DOWNLOAD PDF EXCEL ///////////////////////////////////////////////////////////

  const dispatch = useDispatch();

  const tableTopColor = "#3368B5";
  const tableHeadColor = "#3368b5";
  const secondaryColor = "white";
  const btnColor = "#3368B5";
  const textColor = "white";

  const [tableData, setTableData] = useState([]);
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
        (data) => data.tusrnam && data.tusrnam.toLowerCase().includes(query)
      );
    }
    return filteredData;
  };


    const isLargeScreen = window.innerWidth > 1500;

  const contentStyle = {
 width: "100%",
  maxWidth: isSidebarVisible
    ? (isLargeScreen ? "1200px" : "1000px")
    : (isLargeScreen ? "1200px" : "1200px"),
  height: "calc(100vh - 100px)",
  position: "absolute",
  top: "70px",
  left: isSidebarVisible ? "60vw" : "53vw",
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
  fontFamily: "verdana",
  zIndex: 1,
  padding: "0 20px",
  boxSizing: "border-box",
};


    const firstColWidth = {
    width: "80px",
  };
  const secondColWidth = {
    width: "60px",
  };
  const thirdColWidth = {
    width: "30px",
  };
  const forthColWidth = {
       width: isSidebarVisible
    ? (isLargeScreen ? "360px" : "300px")
    : (isLargeScreen ? "360px" : "360px"),
  };
  const fifthColWidth = {
    width: "75px",
  };
  const sixthColWidth = {
    width: "75px",
  };
  const seventhColWidth = {
      width: isSidebarVisible
    ? (isLargeScreen ? "100px" : "100px")
    : (isLargeScreen ? "100px" : "100px"),
  };
  const eightColWidth = {
    width: "80px",
  };
  const ninthColWidth = {
    width: "150px",
  };
  const CheckColWidth = {
    width: "20px",
  };

  const sixthcol = {
    width: "8px",
  };

  useHotkeys("alt+s", () => {
        fetchReceivableReport();
        //    resetSorting();
    }, { preventDefault: true, enableOnFormTags: true });

    useHotkeys("alt+p", exportPDFHandler, { preventDefault: true, enableOnFormTags: true });
    useHotkeys("alt+e", handleDownloadCSV, { preventDefault: true, enableOnFormTags: true });
    useHotkeys("alt+r", () => navigate("/MainPage"),  { preventDefault: true, enableOnFormTags: true });


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
        1
      );
      setSelectedfromDate(firstDateOfCurrentMonth);
      setfromInputDate(formatDate(firstDateOfCurrentMonth));
      setSelectedToDate(currentDate);
      settoInputDate(formatDate(currentDate));
    } else {
      const days = parseInt(selectedRadio.replace("days", ""));
      handleRadioChange(days);
    }
  }, [selectedRadio]);


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
          <NavComponent textdata="Bank Register" />
        
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
                className="d-flex align-items-center  "
                style={{ marginRight: "1px" }}
              >
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
                      Account :
                    </span>{" "}
                    <br />
                  </label>
                </div>
                <div style={{ marginLeft: "5px" }}>
                  <Select
                    className="List-select-class "
                    ref={saleSelectRef}
                    value={options.find(opt => opt.value === saleType) || null} // Ensure correct reference
                    options={options}
                    onKeyDown={(e) => handleSaleKeypress(e, "frominputid")}
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
                        setSaleType(""); // Clear the saleType state when selectedOption is null (i.e., when the selection is cleared)
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
                        marginTop: '-5px'
                      })
                    }}
                    isClearable
                    placeholder="ALL"
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
    onKeyDown={(e) => handleKeyPress(e, input2Ref)}
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
      width: "200px",
      height: "24px",
      marginLeft: "5px",
      backgroundColor: getcolor,
      border: `1px solid ${fontcolor}`,
      fontSize: getdatafontsize,
      fontFamily: getfontstyle,
      color: fontcolor,
      paddingLeft: "10px",
    }}
  >
   <option value="">ALL</option>
                                    <option value="CRV">CASH RECEIVE VORCHER</option>
                                    <option value="CPV">Cash PAYMENT VORCHER</option>
                                    <option value="BRV">Bank RECEIVE VORCHER</option>
                                    <option value="BPV">BANK PAYMENT VORCHER</option>
                                    <option value="JVR">JOURNAL VORCHER</option>
                                    <option value="INV">ITEM SALE</option>
                                    <option value="SRN">SALE RETURN</option>
                                    <option value="BIL">PURCHASE</option>
                                    <option value="PRN">PURCHASE RETURN</option>
                                    <option value="ISS">ISSUE</option>
                                    <option value="REC">RECEIVED</option>
                                    <option value="SLY">SALARY</option>
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
                      fontSize: getdatafontsize,
                      fontFamily: getfontstyle,
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
              <div id="lastDiv" style={{ marginRight: "1px" }}>
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
                  fontSize: getdatafontsize,
                  fontFamily: getfontstyle,
                  // width: "100%",
                  position: "relative",
                  paddingRight: "2%",
                }}
              >
                <thead
                  style={{
                    fontSize: getdatafontsize,
                    fontFamily: getfontstyle,
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
                      Typ
                    </td>
                    <td className="border-dark" style={forthColWidth}>
                      Description
                    </td>

                    <td className="border-dark" style={eightColWidth}>
                      Chq Date
                    </td>

                    <td className="border-dark" style={ninthColWidth}>
                      Chq #
                    </td>

                    <td className="border-dark" style={fifthColWidth}>
                      Debit
                    </td>
                    <td className="border-dark" style={sixthColWidth}>
                      Credit
                    </td>
                    <td className="border-dark" style={seventhColWidth}>
                      Balance
                    </td>
                    <td
                      className="border-dark"
                      style={{
                        ...CheckColWidth,
                        textAlign: "right",
                        paddingRight: "3px",
                      }}
                    >
                      <input type="checkbox" disabled />
                    </td>

                    <td className="border-dark" style={sixthcol}>
                      
                    </td>
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
                maxHeight: "48vh",
                // width: "100%",
                wordBreak: "break-word",
              }}
            >
              <table
                className="myTable"
                id="tableBody"
                style={{
                  fontSize: getdatafontsize,
                  fontFamily: getfontstyle,
                  // width: "100%",
                  position: "relative",
                  ...(tableData.length > 0 ? { tableLayout: "fixed" } : {})
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
                        <td colSpan="10" className="text-center">
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
                            {Array.from({ length: 10 }).map((_, colIndex) => (
                              <td key={`blank-${rowIndex}-${colIndex}`}>
                                &nbsp;
                              </td>
                            ))}
                          </tr>
                        )
                      )}
                      <tr>
                        <td style={firstColWidth}></td>
                        <td style={secondColWidth}></td>
                        <td style={thirdColWidth}></td>
                        <td style={forthColWidth}></td>
                        <td style={eightColWidth}></td>
                        <td style={ninthColWidth}></td>
                        <td style={fifthColWidth}></td>
                        <td style={sixthColWidth}></td>
                        <td style={seventhColWidth}></td>
                        <td style={CheckColWidth}></td>
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
                              color: isMatchedRow(item) ? "red" : fontcolor, // 🔥 highlight logic

                            }}
                          >
                            <td className="text-center" style={firstColWidth}>
                              {item.Date}
                            </td>
                            <td className="text-center" style={secondColWidth}>
                              {item["Trn#"]}
                            </td>
                            <td className="text-center" style={thirdColWidth}>
                              {item.Type}
                            </td>
                            <td
                              className="text-start"
                              title={item.Description}
                              style={{
                                ...forthColWidth,
                                whiteSpace: "nowrap",
                                overflow: "hidden",
                                textOverflow: "ellipsis",
                              }}
                            >
                              {item.Description}
                            </td>

                            <td className="text-start" style={eightColWidth}>
                              {item["Chq Date"]}
                            </td>

                            <td
                              className="text-start"
                              title={item["Chq #"]}
                              style={{
                                ...ninthColWidth,
                                whiteSpace: "nowrap",
                                overflow: "hidden",
                                textOverflow: "ellipsis",
                              }}
                            >
                              {item["Chq #"]}
                            </td>

                            <td className="text-end" style={fifthColWidth}>
                              {formatValue(item.Debit) }
                            </td>
                            <td className="text-end" style={sixthColWidth}>
                             {formatValue(item.Credit) }
                            </td>
                            <td className="text-end" style={seventhColWidth}>
                             {formatValue(item.Balance) }
                            </td>
                            <td className="text-end" style={CheckColWidth}>
                              <input type="checkbox" />
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
                          {Array.from({ length: 10 }).map((_, colIndex) => (
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
                        <td style={eightColWidth}></td>
                        <td style={ninthColWidth}></td>
                        <td style={fifthColWidth}></td>
                        <td style={sixthColWidth}></td>
                        <td style={seventhColWidth}></td>
                        <td style={CheckColWidth}></td>
                      </tr>
                    </>
                  )}
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
              paddingRight: "8px",
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
                            <span className="mobileledger_total2">{tableData.length.toLocaleString()}</span>

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
            <div
              style={{
                ...eightColWidth,
                background: getcolor,
                borderRight: `1px solid ${fontcolor}`,
              }}
            ></div>

            <div
              style={{
                ...ninthColWidth,
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
            >
              <span className="mobileledger_total">{totalDebit}</span>
            </div>
            <div
              style={{
                ...sixthColWidth,
                background: getcolor,
                borderRight: `1px solid ${fontcolor}`,
              }}
            >
              <span className="mobileledger_total">{totalCredit}</span>
            </div>
            <div
              style={{
                ...seventhColWidth,
                background: getcolor,
                borderRight: `1px solid ${fontcolor}`,
              }}
            >
              <span className="mobileledger_total">{closingBalance}</span>
            </div>
            <div
              style={{
                ...CheckColWidth,
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

