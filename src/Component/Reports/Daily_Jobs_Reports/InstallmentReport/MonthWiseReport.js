import React, { useState, useEffect, useRef } from "react";
import { Container, Spinner, Nav } from "react-bootstrap";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import { useTheme } from "../../../../ThemeContext";
import { getUserData, getOrganisationData ,getLocationnumber, getYearDescription} from "../../../Auth";
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
// import { fetchGetUser } from "../../Redux/action";
import { fetchGetUser } from "../../../Redux/action";
import { useHotkeys } from "react-hotkeys-hook";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";


export default function MonthWiseReport() {
  const navigate = useNavigate();
  const user = getUserData();
  const organisation = getOrganisationData();
  const yeardescription = getYearDescription();
  const locationnumber = getLocationnumber();
  const saleSelectRef = useRef(null);
  const input1Ref = useRef(null);
  const input2Ref = useRef(null);
  const input3Ref = useRef(null);
  const collectorRef = useRef(null);
  const fromRef = useRef(null);
    const toRef = useRef(null);   
 
  const [CollectorData, setCollectorData] = useState([]);
  const [sortData, setSortData] = useState("ASC");

  const [isAscendingcode, setisAscendingcode] = useState(true);
  const [isAscendingdec, setisAscendingdec] = useState(true);
  const [isAscendingsts, setisAscendingsts] = useState(true);
  const [tableData, setTableData] = useState([]);

  const [Collector, setCollector] = useState("");
  const [CollectorDataValue, setCollectorDataValue] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [transectionType, settransectionType] = useState("M1");

  const [selectedRadio, setSelectedRadio] = useState("custom");


  const [selectedfromDate, setSelectedfromDate] = useState(null);
  const [fromInputDate, setfromInputDate] = useState("");
  const [fromCalendarOpen, setfromCalendarOpen] = useState(false);
  // state for To DatePicker
  const [selectedToDate, setSelectedToDate] = useState(null);
  const [toInputDate, settoInputDate] = useState("");
  const [toCalendarOpen, settoCalendarOpen] = useState(false); 


  const [Companyselectdatavalue, setCompanyselectdatavalue] = useState("");
  const [saleType, setSaleType] = useState("");

  const [TotalRecords, setTotalRecords] = useState(0);
  const [TotalBill, setTotalBill] = useState(0);
  const [TotalAdvance, setTotalAdvance] = useState(0);
  const [TotalInstallmentPaid, setTotalInstallmentPaid] = useState(0);
  const [TotalPaidAdvanceInstallment, setTotalPaidAdvanceInstallment] = useState(0);
  const [TotalLastPaid, setTotalLastPaid] = useState(0);
  const [TotalInstAmount, setTotalInstAmount] = useState(0);
  const [TotalShortAmount, setTotalShortAmount] = useState(0);
  const [TotalReceivable, setTotalReceivable] = useState(0);
  const [TotalBalance, setTotalBalance] = useState(0);

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


  const comapnyname = organisation.description;
 
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

const formatDate = (date) => {
    const day = date.getDate().toString().padStart(2, "0");
    const month = (date.getMonth() + 1).toString().padStart(2, "0");
    const year = date.getFullYear();
    return `${day}-${month}-${year}`;
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


 const handlefromDateChange = (date) => {
    setSelectedfromDate(date);
    setfromInputDate(date ? formatDate(date) : "");
    setfromCalendarOpen(false);
  };


  const toggleFromCalendar = () => {
    setfromCalendarOpen((prevOpen) => !prevOpen);
  };


  const handleToInputChange = (e) => {
    settoInputDate(e.target.value);
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

  const toggleToCalendar = () => {
    settoCalendarOpen((prevOpen) => !prevOpen);
  };



   function fetchReceivableReport(codeParam) {
      const fromDateElement = document.getElementById("fromdatevalidation");
      const toDateElement = document.getElementById("todatevalidation");
  
      const dateRegex = /^\d{2}-\d{2}-\d{4}$/;
  
      let hasError = false;
      let errorType = "";
  
      switch (true) {
        // case !saleType:
        //     errorType = "saleType";
        //     break;
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
        // case "saleType":
        //     toast.error("Please select a Account Code");
        //     return;
  
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
  
  
  
      document.getElementById(
        "fromdatevalidation"
      ).style.border = `1px solid ${fontcolor}`;
      document.getElementById(
        "todatevalidation"
      ).style.border = `1px solid ${fontcolor}`;
  
      const apiUrl = apiLinks + "/CollectorCustomers.php";
      setIsLoading(true);
      const formData = new URLSearchParams({
        FIntDat: fromInputDate,
        FFnlDat: toInputDate,
        FRepTyp: transectionType,
        FColCod: saleType,
        code: organisation.code,
        FLocCod: locationnumber || getLocationNumber,
  
        // code: 'BAJWATRD',
        // FLocCod: '001',
  
      }).toString();
  
      axios
        .post(apiUrl, formData)
        .then((response) => {
          setIsLoading(false);
          // Update total amount and quantity
          
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
    // If it hasn't mounted before or on refresh, select the 'from date' input
    if (
      !hasComponentMountedPreviously ||
      (fromRef && fromRef.current)
    ) {
      if (fromRef && fromRef.current) {
        setTimeout(() => {
          fromRef.current.focus(); // Focus on the input field
          fromRef.current.select(); // Select the text within the input field
        }, 0);
      }
      sessionStorage.setItem("componentMounted", "true"); // Set the flag indicating mount

    }
  }, []);

  useEffect(() => {
    const currentDate = new Date();

    // First date of current month
    const firstDateOfCurrentMonth = new Date(
      currentDate.getFullYear(),
      currentDate.getMonth(),
      1
    );

    // Last date of current month
    const lastDateOfCurrentMonth = new Date(
      currentDate.getFullYear(),
      currentDate.getMonth() + 1,
      0
    );

    setSelectedfromDate(firstDateOfCurrentMonth);
    setfromInputDate(formatDate(firstDateOfCurrentMonth));

    setSelectedToDate(lastDateOfCurrentMonth);
    settoInputDate(formatDate(lastDateOfCurrentMonth));
  }, []);

  const handleTransactionTypeChange = (event) => {
    const selectedTransactionType = event.target.value;
    settransectionType(selectedTransactionType);
  };

  useEffect(() => {
    const apiUrl = apiLinks + "/GetCollectors.php";
    const formData = new URLSearchParams({
      code: organisation.code,
      FLocCod: locationnumber || getLocationNumber,
      // FLocCod: "002",
      // code: "USMANMTR",
    }).toString();
    axios
      .post(apiUrl, formData)
      .then((response) => {
        setCollectorData(response.data);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });
  }, []);

  const Collectoroption = CollectorData?.map((item) => ({
    value: item.tcolcod,
    label: `${item.tcolcod}-${item.tcolnam.trim()}`,
  })) ?? [];

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
      borderColor: "red",               // Changed from #3368B5 to red
      boxShadow: "0 0 0 1px red",       // Changed from #3368B5 to red
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
        backgroundColor: "#3368B5",     // unchanged
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
    color:
      state.isSelected || state.isFocused
        ? "white"
        : fontcolor,
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
      color: "#3368B5",                // unchanged
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
      color: "#ff4444",                // unchanged
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


  const handleSaleKeypress = (event, inputId) => {
    if (event.key === "Enter") {
      const selectedOption = saleSelectRef.current.state.selectValue;
      if (selectedOption && selectedOption.value) {
        setCollectorData(selectedOption.value);
      }
      // const nextInput = document.getElementById(inputId);
      const nextInput = inputId.current;

      if (nextInput) {
        nextInput.focus();
        // nextInput.select();
      } else {
        document.getElementById("submitButton").click();
      }
    }
  };



const exportPDFHandler = () => {
  // Create a new jsPDF instance with landscape orientation
  const doc = new jsPDF({ orientation: "landscape" });

  // ------------------------------------------------------------------
  // 1. Build table rows with combined Customer and Mobile (no CNIC)
  // ------------------------------------------------------------------
  const rows = tableData.map((item) => {
    // Combine Customer and Mobile – each on a new line
    const customerCombined = `${item.Customer || ""}\n${item.Mobile || ""}`;

    return [
      item.Code,
      customerCombined,
      item.InvNo,
      item.SaleDate,
      item.Item,
      item.NoOfIns,
      item.InsAmt,
      item.Receiavable,
      item.Collected,
      item.Advance,
      item.MonthCst01,
      item.MonthCst02,
      item.MonthCst03,
      item.OB,
      item.Sale,
      item.Rent,
      item.LastCol,
      item.CurMonthCol,
      item.CB,
    ];
  });

  // ------------------------------------------------------------------
  // 2. Add summary row (totals)
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
    "",
    "",
    "",
  ]);

  // ------------------------------------------------------------------
  // 3. Column headers
  // ------------------------------------------------------------------
  const headers = [
    "Code",
    "Customer",
    "In No",
    "S.Date",
    "Item",
    "Ins",
    "I.Amt",
    "Rec",
    "Coll",
    "Adv",
    "M.Cos1",
    "M.Cos2",
    "M.Cos3",
    "OB",
    "Sale",
    "Rent",
    "L.Col",
    "C.M.Col",
    "CB",
  ];

  // Column widths – **Customer column reduced from 28 to 22**
  const columnWidths = [16, 22, 12, 17, 28, 7, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14];

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

  // Table headers
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

  // Add a single row
  const addSingleRow = (row, i, startX, currentY, isTotalRow) => {
    const isOddRow = i % 2 !== 0;
    const isRedRow = row[0] && parseInt(row[0]) > 10000000000;
    let textColor = [0, 0, 0];
    if (isRedRow) textColor = [255, 0, 0];

    const cellLines = row.map((cell, colIdx) => {
      const maxWidth = columnWidths[colIdx] - 2 * cellPadding;
      const cellText = String(cell);
      return splitTextToLines(cellText, maxWidth);
    });
    const maxLines = Math.max(...cellLines.map(lines => lines.length), 1);
    const rowHeight = maxLines * lineIncrement + cellTopPadding + cellBottomPadding;

    if (isOddRow && !isTotalRow) {
      doc.setFillColor(240);
      doc.rect(startX, currentY, getTotalTableWidth(), rowHeight, "F");
    }

    doc.setDrawColor(0);
    let currentX = startX;
    for (let colIdx = 0; colIdx < row.length; colIdx++) {
      const cellWidth = columnWidths[colIdx];
      const lines = cellLines[colIdx];

      doc.setLineWidth(0.2);
      doc.rect(currentX, currentY, cellWidth, rowHeight);

      doc.setTextColor(textColor[0], textColor[1], textColor[2]);
      doc.setFont("verdana-regular", "normal");

      let currentFontSize = fontSize;
      if (isTotalRow && colIdx > 7) {
        currentFontSize = 6;
      }
      doc.setFontSize(currentFontSize);

      let startY = currentY + cellTopPadding;
      lines.forEach((line, lineIdx) => {
        const lineY = startY + lineIdx * lineIncrement;
        let xPos;
        if (colIdx === 0 || colIdx === 2 || colIdx === 3 || colIdx === 5) {
          xPos = currentX + cellWidth / 2;
          doc.text(line, xPos, lineY, { align: "center", baseline: "top" });
        } else if (colIdx > 5) {
          xPos = currentX + cellWidth - cellPadding;
          doc.text(line, xPos, lineY, { align: "right", baseline: "top" });
        } else {
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

  // Dynamic pagination
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
      doc.text(`Month Wise Report From ${fromInputDate} To ${toInputDate}`, doc.internal.pageSize.width / 2, currentY, { align: "center" });
      currentY += -5;

      const labelsX = (doc.internal.pageSize.width - totalWidth) / 2;
      const labelsY = currentY + 4;
      let collectordata = Companyselectdatavalue.label ? Companyselectdatavalue.label : "ALL";

      let Typefilter =
        transectionType === "M1"
          ? "2 Month"
          : transectionType === "M2"
          ? "3 Month"
          : transectionType === "M3"
          ? "4+ Month"
          : "ALL";

      doc.setFont("verdana", "bold");
      doc.setFontSize(8);
      doc.text(`Collector :`, labelsX, labelsY + 8.5);
      doc.setFont("verdana-regular", "normal");
      doc.setFontSize(8);
      doc.text(`${collectordata}`, labelsX + 20, labelsY + 8.5);

      doc.setFont("verdana", "bold");
      doc.setFontSize(8);
      doc.text(`Type :`, labelsX + 200, labelsY + 8.5);
      doc.setFont("verdana-regular", "normal");
      doc.setFontSize(8);
      doc.text(`${Typefilter}`, labelsX + 215, labelsY + 8.5);

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

  doc.save(`MonthWiseReport As On ${date}.pdf`);
};


 const handleDownloadCSV = async () => {
  const workbook = new ExcelJS.Workbook();
  const worksheet = workbook.addWorksheet("Sheet1");

  const numColumns = 24; // Ensure this matches the actual number of columns
  const columnAlignments = [
    "center",
    "left",
    "left",
    "center",
    "center",
    "center",
    "left",
    "center",
    "right",
    "right",
    "right",
    "right",
    "center",
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
    "center",
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
  const storeListRow = worksheet.addRow([`Month Wise Report From ${fromInputDate} To ${toInputDate}`]);
  storeListRow.eachCell((cell) => {
    cell.font = fontStoreList;
    cell.alignment = { horizontal: "center" };
  });
  worksheet.mergeCells(
    `A${storeListRow.number}:${String.fromCharCode(65 + numColumns - 1)}${storeListRow.number}`
  );

  // Empty row
  worksheet.addRow([]);

  // Filter data
  let Collectorcode = Companyselectdatavalue.label ? Companyselectdatavalue.label : "ALL";
 

   let Typefilter =
           transectionType === "M1"
             ? "2 Month"
             : transectionType === "M2"
               ? "3 Month"
                : transectionType === "M3"
               ? "4+ Month"
               : "ALL";

  const typeAndStoreRow3 = worksheet.addRow(
    ["Collector :", Collectorcode, "", "", "", "", "", "","","Type :", Typefilter]
     
  );
  worksheet.mergeCells(`B${typeAndStoreRow3.number}:C${typeAndStoreRow3.number}`);

  typeAndStoreRow3.eachCell((cell, colIndex) => {
    cell.font = {
      name: "CustomFont" || "CustomFont",
      size: 10,
      bold: [1, 10].includes(colIndex),
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
  const headers = [
  "Code",
  "Customer",
  "Old Code",
  "Mobile",
  "Invoice No",
  "Sale Date",
  "Item",
  "Ins",
  "Ins Amt",
  "Receivable",
  "Collected",
  "Advance",
  "Prm Date",
  "Last Date",
  "MthCost01",
  "MthCost02",
  "MthCost03",
  "OB",
  "Sale",
  "Rent",
  "LasCol",
  "CurMthCol",
  "CB",
  "ExpDate",
 
  ];
  const headerRow = worksheet.addRow(headers);
  headerRow.eachCell((cell) => Object.assign(cell, headerStyle));

  // Add data rows with numeric conversion
  tableData.forEach((item, index) => {
    const row = worksheet.addRow([
    item.Code,
    item.Customer,
    item.OldCode,
    item.Mobile,
    item.InvNo,
    item.SaleDate,
    item.Item,
    item.NoOfIns,
    item.InsAmt,
    item.Receiavable,
    item.Collected,
    item.Advance,
    item.PrmDate,
    item.LastDate,
    item.MonthCst01,
    item.MonthCst02,
    item.MonthCst03,
    item.OB,
    item.Sale,
    item.Rent,
    item.LastCol,
    item.CurMonthCol,
    item.CB,
    item.ExpDate,     
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

      // Apply number format (#,##0) for numeric columns (colIndex 15-18, 20-24)
      if (
        (colIndex >= 15 && colIndex <= 18) ||
        (colIndex >= 20 && colIndex <= 24)
      ) {
        cell.numFmt = "#,##0";
      }

      // Apply very light grey background to odd rows
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
  [
    10, 45, 10, 12, 10, 10, 40, 6, 12, 12, 12, 12, 10, 10, 12, 12, 12, 12, 12,
    12, 12, 12, 12, 10,
  ].forEach((width, index) => {
    worksheet.getColumn(index + 1).width = width;
  });

  // Convert totals to numbers
  const totalBillNum = toNumber(TotalBill);
  const totalAdvanceNum = toNumber(TotalAdvance);
  const totalInstallmentPaidNum = toNumber(TotalInstallmentPaid);
  const totalPaidAdvanceInstallmentNum = toNumber(TotalPaidAdvanceInstallment);
  const totalLastPaidNum = toNumber(TotalLastPaid);
  const totalInstAmountNum = toNumber(TotalInstAmount);
  const totalShortAmountNum = toNumber(TotalShortAmount);
  const totalReceivableNum = toNumber(TotalReceivable);
  const totalBalanceNum = toNumber(TotalBalance);

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
    if (colNumber > 8) {
      cell.alignment = { horizontal: "right" };
    }
    // Apply number format to total row numeric cells
    if (
      (colNumber >= 15 && colNumber <= 18) ||
      (colNumber >= 20 && colNumber <= 24)
    ) {
      cell.numFmt = "#,##0";
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
  saveAs(blob, `MonthWiseReport As On ${currentDate}.xlsx`);
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


  const [selectedSearch, setSelectedSearch] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { data, loading, error } = useSelector((state) => state.getuser);

  const handleSearch = (e) => {
    setSelectedSearch(e.target.value);
  };

  let totalEntries = 0;

  // State for column data
const [columns, setColumns] = useState({
  Code: [],
  Customer: [],
  OldCode: [],
  Mobile: [],
  InvNo: [],
  SaleDate: [],
  Item: [],
  NoOfIns: [],
  InsAmt: [],
  Receiavable: [],
  Collected: [],
  Advance: [],
  PrmDate: [],
  LastDate: [],
  MonthCst01: [],
  MonthCst02: [],
  MonthCst03: [],
  OB: [],
  Sale: [],
  Rent: [],
  LastCol: [],
  CurMonthCol: [],
  CB: [],
  ExpDate: [],
});

// State for column sorting order: 'asc', 'desc', or null
const [columnSortOrders, setColumnSortOrders] = useState({
  Code: null,
  Customer: null,
  OldCode: null,
  Mobile: null,
  InvNo: null,
  SaleDate: null,
  Item: null,
  NoOfIns: null,
  InsAmt: null,
  Receiavable: null,
  Collected: null,
  Advance: null,
  PrmDate: null,
  LastDate: null,
  MonthCst01: null,
  MonthCst02: null,
  MonthCst03: null,
  OB: null,
  Sale: null,
  Rent: null,
  LastCol: null,
  CurMonthCol: null,
  CB: null,
  ExpDate: null,
});

// Reset sorting
const resetSorting = () => {
  setColumnSortOrders({
    Code: null,
    Customer: null,
    OldCode: null,
    Mobile: null,
    InvNo: null,
    SaleDate: null,
    Item: null,
    NoOfIns: null,
    InsAmt: null,
    Receiavable: null,
    Collected: null,
    Advance: null,
    PrmDate: null,
    LastDate: null,
    MonthCst01: null,
    MonthCst02: null,
    MonthCst03: null,
    OB: null,
    Sale: null,
    Rent: null,
    LastCol: null,
    CurMonthCol: null,
    CB: null,
    ExpDate: null,
  });
};

// Update columns whenever tableData changes
useEffect(() => {
  if (tableData.length > 0) {
    const newColumns = {
      Code: tableData.map((row) => row.Code),
      Customer: tableData.map((row) => row.Customer),
      OldCode: tableData.map((row) => row.OldCode),
      Mobile: tableData.map((row) => row.Mobile),
      InvNo: tableData.map((row) => row.InvNo),
      SaleDate: tableData.map((row) => row.SaleDate),
      Item: tableData.map((row) => row.Item),
      NoOfIns: tableData.map((row) => row.NoOfIns),
      InsAmt: tableData.map((row) => row.InsAmt),
      Receiavable: tableData.map((row) => row.Receiavable),
      Collected: tableData.map((row) => row.Collected),
      Advance: tableData.map((row) => row.Advance),
      PrmDate: tableData.map((row) => row.PrmDate),
      LastDate: tableData.map((row) => row.LastDate),
      MonthCst01: tableData.map((row) => row.MonthCst01),
      MonthCst02: tableData.map((row) => row.MonthCst02),
      MonthCst03: tableData.map((row) => row.MonthCst03),
      OB: tableData.map((row) => row.OB),
      Sale: tableData.map((row) => row.Sale),
      Rent: tableData.map((row) => row.Rent),
      LastCol: tableData.map((row) => row.LastCol),
      CurMonthCol: tableData.map((row) => row.CurMonthCol),
      CB: tableData.map((row) => row.CB),
      ExpDate: tableData.map((row) => row.ExpDate),
    };
    setColumns(newColumns);
  } else {
    // Clear columns if no data
    setColumns({
      Code: [],
      Customer: [],
      OldCode: [],
      Mobile: [],
      InvNo: [],
      SaleDate: [],
      Item: [],
      NoOfIns: [],
      InsAmt: [],
      Receiavable: [],
      Collected: [],
      Advance: [],
      PrmDate: [],
      LastDate: [],
      MonthCst01: [],
      MonthCst02: [],
      MonthCst03: [],
      OB: [],
      Sale: [],
      Rent: [],
      LastCol: [],
      CurMonthCol: [],
      CB: [],
      ExpDate: [],
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
  const secondColWidth = { width: isSidebarVisible ? (isLargeScreen ? "300px" : "300px") : (isLargeScreen ? "300px" : "300px") };
  const thirdColWidth = { width: isSidebarVisible ? (isLargeScreen ? "70px" : "70px") : (isLargeScreen ? "70px" : "70px") };
  const thirdColWidth1 = { width: isSidebarVisible ? (isLargeScreen ? "100px" : "100px") : (isLargeScreen ? "100px" : "100px") };
  const forthColWidth = { width: isSidebarVisible ? (isLargeScreen ? "60px" : "60px") : (isLargeScreen ? "60px" : "60px") };
  const fifthColWidth = { width: isSidebarVisible ? (isLargeScreen ? "90px" : "90px") : (isLargeScreen ? "90px" : "90px") };
  const fifthColWidth1 = { width: isSidebarVisible ? (isLargeScreen ? "200px" : "200px") : (isLargeScreen ? "200px" : "200px") };
  const sixthColWidth = { width: isSidebarVisible ? (isLargeScreen ? "50px" : "50px") : (isLargeScreen ? "50px" : "50px") };
  const seventhColWidth = { width: isSidebarVisible ? (isLargeScreen ? "90px" : "90px") : (isLargeScreen ? "90px" : "90px") };
  const seventhColWidth1 = { width: isSidebarVisible ? (isLargeScreen ? "90px" : "90px") : (isLargeScreen ? "90px" : "90px") };
  const eighthColWidth = { width: isSidebarVisible ? (isLargeScreen ? "90px" : "90px") : (isLargeScreen ? "90px" : "90px") };
  const ninthColWidth = { width: isSidebarVisible ? (isLargeScreen ? "90px" : "90px") : (isLargeScreen ? "90px" : "90px") };


  const tenthColWidth = { width: isSidebarVisible ? (isLargeScreen ? "80px" : "80px") : (isLargeScreen ? "80px" : "80px") };
  const ColWidth11 = { width: isSidebarVisible ? (isLargeScreen ? "80px" : "80px") : (isLargeScreen ? "80px" : "80px") };
  const ColWidth12 = { width: isSidebarVisible ? (isLargeScreen ? "100px" : "100px") : (isLargeScreen ? "100px" : "100px") };
  const ColWidth13 = { width: isSidebarVisible ? (isLargeScreen ? "100px" : "100px") : (isLargeScreen ? "100px" : "100px") };
  const ColWidth14 = { width: isSidebarVisible ? (isLargeScreen ? "100px" : "100px") : (isLargeScreen ? "100px" : "100px") };
  const ColWidth15 = { width: isSidebarVisible ? (isLargeScreen ? "100px" : "100px") : (isLargeScreen ? "100px" : "100px") };
  const ColWidth16 = { width: isSidebarVisible ? (isLargeScreen ? "100px" : "100px") : (isLargeScreen ? "100px" : "100px") };
  const ColWidth17 = { width: isSidebarVisible ? (isLargeScreen ? "100px" : "100px") : (isLargeScreen ? "100px" : "100px") };
  const ColWidth18 = { width: isSidebarVisible ? (isLargeScreen ? "100px" : "100px") : (isLargeScreen ? "100px" : "100px") };
  const ColWidth19 = { width: isSidebarVisible ? (isLargeScreen ? "100px" : "100px") : (isLargeScreen ? "100px" : "100px") };
  const ColWidth20 = { width: isSidebarVisible ? (isLargeScreen ? "100px" : "100px") : (isLargeScreen ? "100px" : "100px") };
  const ColWidth21 = { width: isSidebarVisible ? (isLargeScreen ? "80px" : "80px") : (isLargeScreen ? "80px" : "80px") };

 
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
  const totalRows = 20; // fixed number of rows

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
    ColWidth21.width,

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
        <NavComponent textdata="Month Wise Report" />

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
                       justifyContent: "start",
                     }}
                   >
                   <div className="d-flex align-items-center" style={{ marginLeft: '3px' }}>
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
         style={{marginLeft:'200px'}}
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
                           onKeyDown={(e) => handleToKeyPress(e, saleSelectRef)}
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
                           options={Collectoroption}
                           onKeyDown={(e) => handleSaleKeypress(e, input1Ref)}
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
                      <div
                       className="d-flex align-items-center"
              style={{marginRight:'20px'}}
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
                             width: "200px",
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
                           <option value="M1">2 Month</option>
                           <option value="M2">2 Month</option>
                           <option value="M3">4+ Month</option>
                         
                         </select>
       
                         {transectionType !== "M1" && (
                           <span
                             onClick={() => settransectionType("M1")}
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
                    style={{ ...thirdColWidth, cursor: "pointer" }}
                    onClick={() => handleSorting("OldCode")}
                  >
                    OldCode{" "}
                    <i
                      className="fa-solid fa-caret-down caretIconStyle"
                      style={getIconStyle("OldCode")}
                    ></i>
                  </th>

                  <th
                    className="border-dark"
                    style={{ ...thirdColWidth1, cursor: "pointer" }}
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
                    style={{ ...forthColWidth, cursor: "pointer" }}
                    onClick={() => handleSorting("InvNo")}
                  >
                    InvNo{" "}
                    <i
                      className="fa-solid fa-caret-down caretIconStyle"
                      style={getIconStyle("InvNo")}
                    ></i>
                  </th>

                  <th
                    className="border-dark"
                    style={{ ...fifthColWidth, cursor: "pointer" }}
                    onClick={() => handleSorting("SaleDate")}
                  >
                    SaleDate{" "}
                    <i
                      className="fa-solid fa-caret-down caretIconStyle"
                      style={getIconStyle("SaleDate")}
                    ></i>
                  </th>
                  <th
                    className="border-dark"
                    style={{ ...fifthColWidth1, cursor: "pointer" }}
                    onClick={() => handleSorting("Item")}
                  >
                    Item{" "}
                    <i
                      className="fa-solid fa-caret-down caretIconStyle"
                      style={getIconStyle("Item")}
                    ></i>
                  </th>

                  <th
                    className="border-dark"
                    style={{ ...sixthColWidth, cursor: "pointer" }}
                    onClick={() => handleSorting("NoOfIns")}
                  >
                    Ins{" "}
                    <i
                      className="fa-solid fa-caret-down caretIconStyle"
                      style={getIconStyle("NoOfIns")}
                    ></i>
                  </th>

                  <th
                    className="border-dark"
                    style={{ ...seventhColWidth, cursor: "pointer" }}
                    onClick={() => handleSorting("InsAmt")}
                  >
                    InsAmt{" "}
                    <i
                      className="fa-solid fa-caret-down caretIconStyle"
                      style={getIconStyle("InsAmt")}
                    ></i>
                  </th>

                  <th
                    className="border-dark"
                    style={{ ...seventhColWidth1, cursor: "pointer" }}
                    onClick={() => handleSorting("Receiavable")}
                  >
                    Recei{" "}
                    <i
                      className="fa-solid fa-caret-down caretIconStyle"
                      style={getIconStyle("Receiavable")}
                    ></i>
                  </th>

                  <th
                    className="border-dark"
                    style={{ ...eighthColWidth, cursor: "pointer" }}
                    onClick={() => handleSorting("Collected")}
                  >
                    Collected{" "}
                    <i
                      className="fa-solid fa-caret-down caretIconStyle"
                      style={getIconStyle("Collected")}
                    ></i>
                  </th>

                  <th
                    className="border-dark"
                    style={{ ...ninthColWidth, cursor: "pointer" }}
                    onClick={() => handleSorting("Advance")}
                  >
                    Advance{" "}
                    <i
                      className="fa-solid fa-caret-down caretIconStyle"
                      style={getIconStyle("Advance")}
                    ></i>
                  </th>

                  {/* Additional columns */}
                  <th style={{ cursor: "pointer" }} onClick={() => handleSorting("PrmDate")}>
                    PrmDate <i className="fa-solid fa-caret-down" style={getIconStyle("PrmDate")}></i>
                  </th>

                  <th style={{ cursor: "pointer" }} onClick={() => handleSorting("LastDate")}>
                    LastDate <i className="fa-solid fa-caret-down" style={getIconStyle("LastDate")}></i>
                  </th>

                  <th style={{ cursor: "pointer" }} onClick={() => handleSorting("MonthCst01")}>
                    MonthCst01 <i className="fa-solid fa-caret-down" style={getIconStyle("MonthCst01")}></i>
                  </th>

                  <th style={{ cursor: "pointer" }} onClick={() => handleSorting("MonthCst02")}>
                    MonthCst02 <i className="fa-solid fa-caret-down" style={getIconStyle("MonthCst02")}></i>
                  </th>

                  <th style={{ cursor: "pointer" }} onClick={() => handleSorting("MonthCst03")}>
                    MonthCst03 <i className="fa-solid fa-caret-down" style={getIconStyle("MonthCst03")}></i>
                  </th>

                  <th style={{ cursor: "pointer" }} onClick={() => handleSorting("OB")}>
                    OB <i className="fa-solid fa-caret-down" style={getIconStyle("OB")}></i>
                  </th>

                  <th style={{ cursor: "pointer" }} onClick={() => handleSorting("Sale")}>
                    Sale <i className="fa-solid fa-caret-down" style={getIconStyle("Sale")}></i>
                  </th>

                  <th style={{ cursor: "pointer" }} onClick={() => handleSorting("Rent")}>
                    Rent <i className="fa-solid fa-caret-down" style={getIconStyle("Rent")}></i>
                  </th>

                  <th style={{ cursor: "pointer" }} onClick={() => handleSorting("LastCol")}>
                    LastCol <i className="fa-solid fa-caret-down" style={getIconStyle("LastCol")}></i>
                  </th>

                  <th style={{ cursor: "pointer" }} onClick={() => handleSorting("CurMonthCol")}>
                    CurMonthCol <i className="fa-solid fa-caret-down" style={getIconStyle("CurMonthCol")}></i>
                  </th>

                  <th style={{ cursor: "pointer" }} onClick={() => handleSorting("CB)")}>
                    CB <i className="fa-solid fa-caret-down" style={getIconStyle("CB")}></i>
                  </th>

                  <th style={{ cursor: "pointer" }} onClick={() => handleSorting("ExpDate")}>
                    ExpDate <i className="fa-solid fa-caret-down" style={getIconStyle("ExpDate")}></i>
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

                        {/* <td
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
                        </td> */}

                         <td className="text-center" style={secondColWidth}>
                          {item.Code}
                        </td>

                        <td
                          className="text-start"
                          title={item.Customer}
                          style={{
                            ...firstColWidth,
                            whiteSpace: "nowrap",
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                          }}
                        >
                          {item.Customer}
                        </td>
                        <td
                          className="text-start"
                          title={item.OldCode}
                          style={{
                            ...thirdColWidth,
                            whiteSpace: "nowrap",
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                          }}
                        >
                          {item.OldCode}
                        </td>
                        <td
                          className="text-center"
                          title={item.Mobile}
                          style={{
                            ...thirdColWidth1,
                            whiteSpace: "nowrap",
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                          }}
                        >
                          {item.Mobile}
                        </td>
                        <td
                          className="text-center"
                          title={item.InvNo}
                          style={{
                            ...forthColWidth,
                            whiteSpace: "nowrap",
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                          }}
                        >
                          {item.InvNo}
                        </td>
                        <td
                          className="text-center"
                          title={item["SaleDate"]}
                          style={{
                            ...fifthColWidth,
                            whiteSpace: "nowrap",
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                          }}
                        >
                          {item["SaleDate"]}
                        </td>
                        <td
                          className="text-start"
                          title={item["Item"]}
                          style={{
                            ...fifthColWidth1,
                            whiteSpace: "nowrap",
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                          }}
                        >
                          {item["Item"]}
                        </td>
                        <td className="text-center" style={sixthColWidth}>
                          {item["NoOfIns"]}
                        </td>
                        <td
                          className="text-end"
                          title={item["InsAmt"]}
                          style={{
                            ...seventhColWidth,
                            whiteSpace: "nowrap",
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                          }}
                        >
                          {item["InsAmt"]}
                        </td>

                        <td
                          className="text-end"
                          title={item["Receiavable"]}
                          style={{
                            ...seventhColWidth1,
                            whiteSpace: "nowrap",
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                          }}
                        >
                          {item["Receiavable"]}
                        </td>
                        <td className="text-end" style={eighthColWidth}>
                          {item["Collected"]}
                        </td>
                        <td
                          className="text-end"
                          title={item["Advance"]}
                          style={{
                            ...ninthColWidth,
                            whiteSpace: "nowrap",
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                          }}
                        >
                          {item["Advance"]}
                        </td>


                        <td
                          className="text-center"
                          title={item.PrmDate}
                          style={{
                            ...tenthColWidth,
                            whiteSpace: "nowrap",
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                          }}
                        >
                          {item.PrmDate}
                        </td>

                        <td
                          className="text-center"
                          title={item["LastDate"]}
                          style={{
                            ...ColWidth11,
                            whiteSpace: "nowrap",
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                          }}
                        >
                          {item["LastDate"]}
                        </td>

                        <td
                          className="text-end"
                          title={item["MonthCst01"]}
                          style={{
                            ...ColWidth12,
                            whiteSpace: "nowrap",
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                          }}
                        >
                          {item["MonthCst01"]}
                        </td>

                        <td
                          className="text-end"
                          title={item["MonthCst02"]}
                          style={{
                            ...ColWidth13,
                            whiteSpace: "nowrap",
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                          }}
                        >
                          {item["MonthCst02"]}
                        </td>

                        <td
                          className="text-end"
                          title={item["MonthCst03"]}
                          style={{
                            ...ColWidth14,
                            whiteSpace: "nowrap",
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                          }}
                        >
                          {item["MonthCst03"]}
                        </td>

                        <td
                          className="text-end"
                          title={item["OB"]}
                          style={{
                            ...ColWidth15,
                            whiteSpace: "nowrap",
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                          }}
                        >
                          {item["OB"]}
                        </td>

                        <td
                          className="text-end"
                          title={item["Sale"]}
                          style={{
                            ...ColWidth16,
                            whiteSpace: "nowrap",
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                          }}
                        >
                          {item["Sale"]}
                        </td>

                        <td
                          className="text-end"
                          title={item["Rent"]}
                          style={{
                            ...ColWidth17,
                            whiteSpace: "nowrap",
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                          }}
                        >
                          {item["Rent"]}
                        </td>

                        <td
                          className="text-end"
                          title={item["LastCol"]}
                          style={{
                            ...ColWidth18,
                            whiteSpace: "nowrap",
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                          }}
                        >
                          {item["LastCol"]}
                        </td>

                        <td
                          className="text-end"
                          title={item["CurMonthCol"]}
                          style={{
                            ...ColWidth19,
                            whiteSpace: "nowrap",
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                          }}
                        >
                          {item["CurMonthCol"]}
                        </td>

                        <td
                          className="text-end"
                          title={item["CB"]}
                          style={{
                            ...ColWidth20,
                            whiteSpace: "nowrap",
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                          }}
                        >
                          {item["CB"]}
                        </td>

                        <td
                          className="text-end"
                          title={item.ExpDate}
                          style={{
                            ...ColWidth21,
                            whiteSpace: "nowrap",
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                          }}
                        >
                          {item.ExpDate}
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
                  <td>{tableData.length.toLocaleString()}</td>
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