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

export default function AmericanCustomerProgress() {
  const saleSelectRef = useRef(null);
  const input1Ref = useRef(null);
  const input2Ref = useRef(null);
  const input3Ref = useRef(null);

  // Add this at the top of your component
  const hasInitialized = useRef(false);

  const toRef = useRef(null);
  const fromRef = useRef(null);

  const [saleType, setSaleType] = useState("");
 const [tableData, setTableData] = useState([]);

  const [TableDataHeading, setTableDataHeading] = useState([]);

  const [Companyselectdatavalue, setCompanyselectdatavalue] = useState("");
  console.log("Companyselectdatavalue", Companyselectdatavalue);
  const [searchQuery, setSearchQuery] = useState("");
  const currentYear1 = new Date().getFullYear().toString();
  const [transectionType, settransectionType] = useState(currentYear1);

  const [supplierList, setSupplierList] = useState([]);

  const [totalQnty, setTotalQnty] = useState(0);
  const [totalDebit, setTotalDebit] = useState(0);
  const [totalde, settotalde] = useState(0);
  const [closingBalance, setClosingBalance] = useState(0);

  const [amt1, setamt1] = useState(0);
  const [amt2, setamt2] = useState(0);
  const [amt3, setamt3] = useState(0);
  const [amt4, setamt4] = useState(0);
  const [amt5, setamt5] = useState(0);
  const [amt6, setamt6] = useState(0);
  const [amt7, setamt7] = useState(0);


  const [totalAggingBal, settotalAggingBal] = useState(0);

const cleanNumber = (val) => {
  return Number(String(val || 0).replace(/,/g, "")) || 0;
};

useEffect(() => {
  const values = [amt2, amt3, amt4, amt5, amt6, amt7];

  const total = values.reduce((sum, val) => {
    return sum + cleanNumber(val);
  }, 0);

  settotalAggingBal(total);
}, [amt2, amt3, amt4, amt5, amt6, amt7]);

  // state for from DatePicker
  const [selectedfromDate, setSelectedfromDate] = useState(null);
  const [fromInputDate, setfromInputDate] = useState("");
  const [fromCalendarOpen, setfromCalendarOpen] = useState(false);
  // state for To DatePicker
  const [selectedToDate, setSelectedToDate] = useState(null);
  const [toInputDate, settoInputDate] = useState("");
  const [toCalendarOpen, settoCalendarOpen] = useState(false);

  //////////////////////// CUSTOM DATE LIMITS ////////////////////////////

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
    return `${String(date.getDate()).padStart(2, "0")}-${String(
      date.getMonth() + 1
    ).padStart(2, "0")}-${date.getFullYear()}`;
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
            `Date must be after ${GlobalfromDate1} and before ${GlobaltoDate1}`
          );
          return;
        }

        toDateElement.style.border = `1px solid ${fontcolor}`; // Add border color
        settoInputDate(formattedInput);

        if (input1Ref.current) {
          e.preventDefault();
          console.log("Selected value:", input1Ref); // Log the select value
          input1Ref.current.focus(); // Move focus to React Select
        }
      } else {
        toast.error(
          `Date must be after ${GlobalfromDate1} and before ${GlobaltoDate1}`
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
  const handleSaleKeypress = (event, inputId) => {
    if (event.key === "Enter") {
      const selectedOption = saleSelectRef.current.state.selectValue;
      if (selectedOption && selectedOption.value) {
        setSaleType(selectedOption.value); // Set the selected value only if an option is selected
      }
      const nextInput = document.getElementById(inputId);
      if (nextInput) {
        nextInput.focus(); // Move focus to the next input
        nextInput.select();
      } else {
        document.getElementById("submitButton").click(); // Trigger form submission
      }
    }
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
  const showAlertMessage = (
    elementId,
    message,
    fromDate,
    toDate,
    fromDateElement,
    errortype
  ) => {
    document.getElementById(elementId).innerHTML = `
            <div class="custom-message">
              <svg class='alert_icon' xmlns="http://www.w3.org/2000/svg" class="bi flex-shrink-0 me-2" width="24" height="24" role="img" aria-label="Danger" fill="currentColor" viewBox="0 0 16 16">
                <path d="M8.982 1.566a1.13 1.13 0 0 0-1.965 0L.165 13.233c-.457.778.091 1.767.982 1.767h13.706c.89 0 1.438-.99.982-1.767L8.982 1.566zm-.982 4.905a.905.905 0 1 1 1.81 0l-.146 3.342a.759.759 0 0 1-1.518 0l-.146-3.342zm.002 6.295a1.057 1.057 0 1 1 2.114 0 1.057 1.057 0 0 1-2.114 0z"/>
              </svg>
              ${message} <span style="font-size: 12px; font-weight: bold;">${fromDate}</span> 
              To <span style="font-size: 12px; font-weight: bold;">${toDate}</span>
              <button class='alert_button' id="close-btn" onclick="closeAlert('${errortype}')" style="cursor: pointer;">
                <i class="bi bi-x cross_icon_styling"></i>
              </button>
            </div>
          `;

    // Focus the button after it is added to the DOM
    setTimeout(() => {
      const closeButton = document.getElementById("close-btn");
      if (closeButton) {
        closeButton.click();
      }
    }, 3000);

    fromDateElement.style.border = "2px solid red"; // Add red border to the input
  };
  function closeAlert(errorType) {
    const alertElement = document.getElementById("someElementId");
    alertElement.innerHTML = ""; // Clears the alert content
    if (errorType === "saleType") {
      saleSelectRef.current.focus();
    }
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
      case !saleType:
        errorType = "saleType";
        break;

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
        "$1-$2-$3"
      );
      const [toDay, toMonth, toYear] = formattedToInput.split("-").map(Number);
      const enteredToDate = new Date(toYear, toMonth - 1, toDay);

      if (enteredToDate < GlobalfromDate || enteredToDate > GlobaltoDate) {
        errorType = "toDateAfterGlobal";
      }
    }

    // Handle errors using a separate switch based on errorType
    switch (errorType) {
      case "saleType":
        toast.error(`Please select a Account Code`);
        hasError = true;
        return customStyles1(hasError);

      case "toDate":
        toast.error(
          `Date must be after ${GlobalfromDate1} and before ${GlobaltoDate1}`
        );
        return;

      case "toDateAfterGlobal":
        toast.error(
          `Date must be after ${GlobalfromDate1} and before ${GlobaltoDate1}`
        );
        return;

      default:
        break;
    }
    ////////////////////////////////////////////

    // document.getElementById('fromdatevalidation').style.border = `1px solid ${fontcolor}`;
    document.getElementById(
      "todatevalidation"
    ).style.border = `1px solid ${fontcolor}`;

    const apiUrl = apiLinks + "/AmericanCustomerProgress.php";
    setIsLoading(true);
    const formData = new URLSearchParams({
      code: organisation.code,
      FLocCod: locationnumber || getLocationNumber,
      FYerDsc: yeardescription || getYearDescription,

      cusDate: toInputDate,
      cusYear: transectionType,
      cusId: saleType,
    //   code: "AMRELEC",
    //   FLocCod: "001",
    //   FYerDsc: "2019-2025",
    }).toString();

    axios
      .post(apiUrl, formData)
      .then((response) => {
        setIsLoading(false);

        setamt1(response.data["credit amount"]);
        setamt2(response.data["amt001"]);
        setamt3(response.data["amt002"]);
        setamt4(response.data["amt003"]);
        setamt5(response.data["amt004"]);
        setamt6(response.data["amt005"]);
        setamt7(response.data["amt006"]);

        if (response.data && Array.isArray(response.data.Progress)) {
          setTableData(response.data.Progress);
        } 

         if (response.data && Array.isArray(response.data.Heading)) {
          setTableDataHeading(response.data.Heading);
        } 
        
        else {
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
      1
    );
    setSelectedfromDate(firstDateOfCurrentMonth);
    setfromInputDate(formatDate(firstDateOfCurrentMonth));
  }, []);

  useEffect(() => {
    const apiUrl = apiLinks + "/GetCustomers.php";
    const formData = new URLSearchParams({
      FLocCod: getLocationNumber,
      code: organisation.code,
    //   FLocCod: "001",
    //   code: "AMRELEC",
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

  // Transforming fetched data into options array
  const options = supplierList.map((item) => ({
    value: item.tcstcod,
    label: `${item.tcstcod}-${item.tcstdsc.trim()}`,
  }));

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
      width: 450,
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

  const handleTransactionTypeChange = (e) => {
    const selectedYear = e.target.value;
    settransectionType(selectedYear);

    // If a year is selected (not the empty "Select" option)
    if (selectedYear) {
      const currentYear = new Date().getFullYear();

      if (parseInt(selectedYear) === currentYear) {
        // For current year, set today's date
        const today = new Date();
        const day = String(today.getDate()).padStart(2, "0");
        const month = String(today.getMonth() + 1).padStart(2, "0");
        const formattedDate = `${day}-${month}-${currentYear}`;
        settoInputDate(formattedDate);
      } else {
        // For previous years, set 31st December
        const formattedDate = `31-12-${selectedYear}`;
        settoInputDate(formattedDate);
      }
    }
  };

    const exportPDFHandler = () => {
      const globalfontsize = 12;
      console.log("gobal font data", globalfontsize);
  
      // Create a new jsPDF instance with landscape orientation
      const doc = new jsPDF({ orientation: "portraite" });
  
      // Define table data (rows)
      const rows = tableData.map((item) => [
      
        item["Sr#"],
     item.Month,
        formatValue(item.Debit),
        formatValue(item.Credit),
                formatValue(item.Other),
        formatValue(item.Balance),
      ]);
  
      // Add summary row to the table
      rows.push([
        "", "",
         formatValue(tableData.at(-1)?.Debit),
         formatValue(tableData.at(-1)?.Credit),
         "",
        formatValue(tableData.at(-1)?.Balance)]);
  
      // Define table column headers and individual column widths
      const headers = [
        "Sr#",
        "Month",
        "Debit",
        "Credit",
        "Other",
        "Balance",
      ];
  
      const columnWidths = [15, 50,30, 30, 30,30];
  
      // Calculate total table width
      const totalWidth = columnWidths.reduce((acc, width) => acc + width, 0);
  
      // Define page height and padding
      const pageHeight = doc.internal.pageSize.height;
      const paddingTop = 15;
  
     
  
      // Function to add table headers
     const addTableHeaders = (startX, startY) => {
  doc.setFont("verdana", "bold");
  doc.setFontSize(10);

  const cellHeight = 6;
  const tableWidth = columnWidths.reduce((a, b) => a + b, 0);

  let currentX = startX;

  headers.forEach((header, index) => {
    const cellWidth = columnWidths[index];

    const cellCenterX = currentX + cellWidth / 2;
    const cellCenterY = startY + cellHeight / 2 + 1.5;

    // 🔹 Header text
    doc.setTextColor(0);
    doc.text(header, cellCenterX, cellCenterY, { align: "center" });

    // 🔹 Optional: vertical column lines
    doc.setLineWidth(0.2);
    doc.line(currentX, startY, currentX, startY + cellHeight);

    currentX += cellWidth;
  });

  // Last vertical line (right side)
  doc.line(startX + tableWidth, startY, startX + tableWidth, startY + cellHeight);

  // 🔸 DOUBLE TOP BORDER
  doc.setLineWidth(0.3);
  doc.line(startX, startY, startX + tableWidth, startY);
  doc.line(startX, startY + 0.7, startX + tableWidth, startY + 0.7);

  // 🔸 DOUBLE BOTTOM BORDER
  doc.line(startX, startY + cellHeight, startX + tableWidth, startY + cellHeight);
  doc.line(
    startX,
    startY + cellHeight - 0.7,
    startX + tableWidth,
    startY + cellHeight - 0.7
  );
};
  
      
const drawBalanceAgingRow = (startX, startY) => {
  const rowHeight = 12;
  const halfHeight = rowHeight / 2;

  // Individual column widths (adjust as needed)
  const agingColWidths = [
    35,   // Balance
    25,   // 0 - 30
    25,   // 31 - 60
    25,   // 61 - 90
    25,   // 91 - 120
    25,   // 121 - 150
    25,   // 150 +
  ];

  const labels = [
    "Balance",
    "0 - 30",
    "31 - 60",
    "61 - 90",
    "91 - 120",
    "121 - 150",
    "150 +",
  ];

  const values = [
    String(formatValue(totalAggingBal.toLocaleString())),   // Balance
    String(formatValue(amt2)),   // 0-30
    String(formatValue(amt3)),   // 31-60
    String(formatValue(amt4)),   // 61-90
    String(formatValue(amt5)),   // 91-120
    String(formatValue(amt6)),   // 121-150
    String(formatValue(amt7)),   // 150+
  ];

  const numCols = labels.length;
  let currentX = startX;

  doc.setFont("verdana", "bold");
  doc.setFontSize(10);
  doc.setTextColor(0);

  for (let i = 0; i < numCols; i++) {
    const colWidth = agingColWidths[i];

    // Draw cell border
    doc.setLineWidth(0.1);
    doc.rect(currentX, startY, colWidth, rowHeight);

    // ✅ Horizontal split line – skip for Balance column (i === 0)
    if (i !== 0) {
      doc.line(
        currentX,
        startY + halfHeight,
        currentX + colWidth,
        startY + halfHeight
      );
    }

    // Top label – centered
    doc.setFont("verdana", "bold");
    doc.setFontSize(10);
    doc.text(
      labels[i],
      currentX + colWidth / 2,
      startY + halfHeight / 1.5,
      { align: "center" }
    );

    // Bottom value – right-aligned
    doc.setFont("verdana-regular", "normal");
    doc.setFontSize(10);
    doc.text(
      values[i],
      currentX + colWidth - 2,
      startY + halfHeight + halfHeight / 1.4,
      { align: "right" }
    );

    currentX += colWidth;
  }
};
          
  
      // ================= END BALANCE AGING ROW =================
  


// const addTableRows = (startX, startY, startIndex, endIndex) => {
//   const rowHeight = 5;
//   const fontSize = 10;
//   const tableWidth = getTotalTableWidth();
//   doc.setFont("verdana-regular", "normal");
//   doc.setFontSize(10);
//   for (let i = startIndex; i < endIndex; i++) {
//     const row = rows[i];
//     const isTotalRow = i === rows.length - 1;
//     const isRedRow = row[0] && parseInt(row[0]) > 10000000000;
//     let textColor = [0, 0, 0];
//     if (isRedRow) textColor = [255, 0, 0];
//     doc.setDrawColor(0);
//     doc.setLineWidth(0.2);
//     const currentY = startY + (i - startIndex + 2) * rowHeight;
//     let currentX = startX;

//     // =========================
//     // ✅ TOTAL ROW (MERGE 1st + 2nd COLUMN)
//     // =========================
//     if (isTotalRow) {
//       const cellY = currentY + rowHeight / 2;
//       // Merge first 2 columns
//       const mergedText = `${row[0] || ""} ${row[1] || ""}`;
//       const mergedWidth = columnWidths[0] + columnWidths[1];
//       doc.setFont("verdana-regular", "normal");
//       doc.setTextColor(0);
//       doc.rect(currentX, currentY, mergedWidth, rowHeight);
//       doc.text(mergedText, currentX + 2, cellY, { baseline: "middle" });
//       currentX += mergedWidth;

//       // Remaining columns
//       for (let cellIndex = 2; cellIndex < row.length; cellIndex++) {
//         const cellValue = String(row[cellIndex] ?? "");
//         const cellWidth = columnWidths[cellIndex];
//         doc.rect(currentX, currentY, cellWidth, rowHeight);
      
//         if (      cellIndex === 0 || cellIndex === 2 || cellIndex === 3 ||
//         cellIndex === 4 || cellIndex === 5  ) {
//           doc.text(cellValue, currentX + cellWidth - 2, cellY, {
//             align: "right",
//             baseline: "middle",
//           });
//         } else if (cellIndex === 20) {
//           doc.text(cellValue, currentX + cellWidth / 2, cellY, {
//             align: "center",
//             baseline: "middle",
//           });
//         } else {
//           doc.text(cellValue, currentX + 2, cellY, { baseline: "middle" });
//         }

        
//         currentX += cellWidth;
//       }

//       // Aging Row (below total row)
//       const agingTableWidth = 40 + 25 * 6;
//       const agingStartX = (doc.internal.pageSize.width - agingTableWidth) / 2;
//       const agingStartY = currentY;
//       drawBalanceAgingRow(agingStartX + 3, agingStartY + 10);

//       // =========================
//       // ✅ ADDED NOTICE BELOW AGING ROW
//       // =========================
//       const noticeText = "In case of any Balance Difference, Contect 0321-4597625 (Accounts Department)";
//       doc.setFont("verdana-regular", "normal");
//       doc.setFontSize(11);               // smaller font for notice
//       doc.setTextColor(0);
//       const agingRowHeight = 12;        // fixed height from drawBalanceAgingRow
//       const noticeY = agingStartY + 10 + agingRowHeight + 5; // 4px gap below aging row
//       doc.text(noticeText, agingStartX + agingTableWidth / 2, noticeY, {
//         align: "center",
//       });

//       continue;
//     }

//     // =========================
//     // ✅ NORMAL ROWS
//     // =========================
//     doc.rect(startX, currentY, tableWidth, rowHeight);
//     row.forEach((cell, cellIndex) => {
//       const cellValue = String(cell ?? "");
//       const cellWidth = columnWidths[cellIndex];
//       const cellY = currentY + rowHeight / 2;
//       doc.setTextColor(...textColor);
//       doc.setFont("verdana-regular", "normal");
//       if (cellIndex === 20) {
//         doc.text(cellValue, currentX + cellWidth / 2, cellY, {
//           align: "center",
//           baseline: "middle",
//         });
//       } else if (
//         cellIndex === 0 || cellIndex === 2 || cellIndex === 3 ||
//         cellIndex === 4 || cellIndex === 5
//       ) {
//         doc.text(cellValue, currentX + cellWidth - 2, cellY, {
//           align: "right",
//           baseline: "middle",
//         });
//       } else {
//         doc.text(cellValue, currentX + 2, cellY, { baseline: "middle" });
//       }
//       if (cellIndex < row.length - 1) {
//         doc.line(
//           currentX + cellWidth,
//           currentY,
//           currentX + cellWidth,
//           currentY + rowHeight
//         );
//       }
//       currentX += cellWidth;
//     });
//   }

//   // =========================
//   // ✅ FOOTER
//   // =========================
//   const lineWidth = tableWidth;
//   const lineX = (doc.internal.pageSize.width - tableWidth) / 2;
//   const lineY = pageHeight - 15;
//   doc.setLineWidth(0.3);
//   doc.line(lineX, lineY, lineX + lineWidth, lineY);
//   doc.setFontSize(fontSize);
//   doc.setTextColor(0);
//   doc.text(`Crystal Solution \t ${date} \t ${time}`, lineX + 2, lineY + 5);
// };

const addTableRows = (startX, startY, startIndex, endIndex) => {
  const rowHeight = 5;
  const fontSize = 10;
  const tableWidth = getTotalTableWidth();

  doc.setFont("verdana-regular", "normal");
  doc.setFontSize(10);

  for (let i = startIndex; i < endIndex; i++) {
    const row = rows[i];
    const isTotalRow = i === rows.length - 1;
    const isRedRow = row[0] && parseInt(row[0]) > 10000000000;

    let textColor = [0, 0, 0];
    if (isRedRow) textColor = [255, 0, 0];

    doc.setDrawColor(0);
    doc.setLineWidth(0.2);

    const currentY = startY + (i - startIndex + 2) * rowHeight;
    let currentX = startX;

    // =========================
    // ❌ TOTAL ROW UI REMOVED (ONLY COMMENTED)
    // =========================
    if (isTotalRow) {
      /*
      const cellY = currentY + rowHeight / 2;

      const mergedText = `${row[0] || ""} ${row[1] || ""}`;
      const mergedWidth = columnWidths[0] + columnWidths[1];

      doc.setFont("verdana-regular", "normal");
      doc.setTextColor(0);

      doc.rect(currentX, currentY, mergedWidth, rowHeight);
      doc.text(mergedText, currentX + 2, cellY, { baseline: "middle" });

      currentX += mergedWidth;

      for (let cellIndex = 2; cellIndex < row.length; cellIndex++) {
        const cellValue = String(row[cellIndex] ?? "");
        const cellWidth = columnWidths[cellIndex];

        doc.rect(currentX, currentY, cellWidth, rowHeight);

        if (
          cellIndex === 0 ||
          cellIndex === 2 ||
          cellIndex === 3 ||
          cellIndex === 4 ||
          cellIndex === 5
        ) {
          doc.text(cellValue, currentX + cellWidth - 2, cellY, {
            align: "right",
            baseline: "middle",
          });
        } else if (cellIndex === 20) {
          doc.text(cellValue, currentX + cellWidth / 2, cellY, {
            align: "center",
            baseline: "middle",
          });
        } else {
          doc.text(cellValue, currentX + 2, cellY, {
            baseline: "middle",
          });
        }

        currentX += cellWidth;
      }
      */

      // =========================
      // ✅ KEEP AGING ROW
      // =========================
      const agingTableWidth = 40 + 25 * 6;
      const agingStartX =
        (doc.internal.pageSize.width - agingTableWidth) / 2;
      const agingStartY = currentY;

      drawBalanceAgingRow(agingStartX + 3, agingStartY + 10);

      // =========================
      // ✅ NOTICE TEXT
      // =========================
      const noticeText =
        "In case of any Balance Difference, Contect 0321-4597625 (Accounts Department)";

      doc.setFont("verdana-regular", "normal");
      doc.setFontSize(11);
      doc.setTextColor(0);

      const agingRowHeight = 12;
      const noticeY = agingStartY + 10 + agingRowHeight + 5;

      doc.text(
        noticeText,
        agingStartX + agingTableWidth / 2,
        noticeY,
        { align: "center" }
      );

      continue;
    }

    // =========================
    // ✅ NORMAL ROWS
    // =========================
    doc.rect(startX, currentY, tableWidth, rowHeight);

    row.forEach((cell, cellIndex) => {
      const cellValue = String(cell ?? "");
      const cellWidth = columnWidths[cellIndex];
      const cellY = currentY + rowHeight / 2;

      doc.setTextColor(...textColor);
      doc.setFont("verdana-regular", "normal");

      if (cellIndex === 20) {
        doc.text(cellValue, currentX + cellWidth / 2, cellY, {
          align: "center",
          baseline: "middle",
        });
      } else if (
        cellIndex === 0 ||
        cellIndex === 2 ||
        cellIndex === 3 ||
        cellIndex === 4 ||
        cellIndex === 5
      ) {
        doc.text(cellValue, currentX + cellWidth - 2, cellY, {
          align: "right",
          baseline: "middle",
        });
      } else {
        doc.text(cellValue, currentX + 2, cellY, {
          baseline: "middle",
        });
      }

      if (cellIndex < row.length - 1) {
        doc.line(
          currentX + cellWidth,
          currentY,
          currentX + cellWidth,
          currentY + rowHeight
        );
      }

      currentX += cellWidth;
    });
  }

  // =========================
  // ✅ FOOTER
  // =========================
  const lineWidth = tableWidth;
  const lineX = (doc.internal.pageSize.width - tableWidth) / 2;
  const lineY = pageHeight - 15;

  doc.setLineWidth(0.3);
  doc.line(lineX, lineY, lineX + lineWidth, lineY);

  doc.setFontSize(fontSize);
  doc.setTextColor(0);

  doc.text(
    `Crystal Solution \t ${date} \t ${time}`,
    lineX + 2,
    lineY + 5
  );
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
          pageNumber,
          startY,
          titleFontSize = 18,
          pageNumberFontSize = 10
        ) => {
          if (!title || typeof title !== "string") {
            console.error("Invalid title:", title);
            return;
          }
          if (typeof startY !== "number" || isNaN(startY)) {
            console.error("Invalid startY value:", startY);
            return;
          }
  
          doc.setFontSize(titleFontSize);
  
          // Get page width
          const pageWidth = doc.internal.pageSize.width;
  
          // Calculate the text width
          const textWidth = doc.getTextWidth(title);
  
          // Calculate centered X position
          const centerX = (pageWidth - textWidth) / 2;
  
          // Draw title at center
          doc.text(title, centerX, startY);
  
          // Page number placement (right-aligned)
          const rightX = doc.internal.pageSize.width - 10;
        doc.setFont("verdana-regular", "normal");
  doc.setFontSize(10)
          doc.text(
            `Page ${pageNumber}`,
            rightX - 40,
            doc.internal.pageSize.height - 10,
            { align: "right" }
          );
        };
  
        let currentPageIndex = 0;
        let startY = paddingTop; // Initialize startY
        let pageNumber = 1; // Initialize page number
  
        while (currentPageIndex * rowsPerPage < rows.length) {
        doc.setFont("verdana", "bold");
 
          addTitle(comapnyname, pageNumber, startY, 18); // Render company title with default font size, only date, and page number
          startY += 5; // Adjust vertical position for the company title
  doc.setFont("verdana", "bold");
          // addTitle(`Supplier Progress Report From: ${toInputDate}`, "", "", pageNumber, startY, 12); // Render sale report title with decreased font size, provide the time, and page number
          addTitle(
            `Customer Ledger Report From: ${fromInputDate} To ${toInputDate}`,
            pageNumber,
            startY,
            10
          );
          startY += -5;
  
          const labelsX = (doc.internal.pageSize.width - totalWidth) / 2;
          const labelsY = startY + 4; // Position the labels below the titles and above the table
  
          // Set font size and weight for the labels
          doc.setFontSize(12);
          doc.setFont(getfontstyle, "300");
  
          let status = transectionType ? transectionType : "ALL";
          let search = Companyselectdatavalue.label
            ? Companyselectdatavalue.label
            : "ALL";
  
        
  
  doc.setFont("verdana", "bold");
  doc.setFontSize(10)
            doc.text(`Code `, labelsX, labelsY + 8.5); // Draw bold label
doc.setFont("verdana", "bold");
  doc.setFontSize(10)
            // doc.text(`${search}`, labelsX + 25, labelsY + 8.5); // Draw the value next to the label
            doc.text(`: ${TableDataHeading[0].Code}`, labelsX + 36, labelsY + 8.5); // Draw the value next to the label


doc.setFont("verdana", "bold");
  doc.setFontSize(10)
            doc.text(`SalesMan`, labelsX + 120, labelsY + 8.5); // Draw bold label
doc.setFont("verdana-regular", "normal");
  doc.setFontSize(10)
            doc.text(`: ${TableDataHeading[0].SalesMan}`, labelsX + 141, labelsY + 8.5); // Draw the value next to the label
  
     

              doc.setFont("verdana", "bold");
  doc.setFontSize(10)
            doc.text(`Customer`, labelsX, labelsY + 12.8); // Draw bold label
doc.setFont("verdana-regular", "normal");
  doc.setFontSize(10)
            // doc.text(`${search}`, labelsX + 25, labelsY + 8.5); // Draw the value next to the label
            doc.text(`: ${TableDataHeading[0].Customer}`, labelsX + 36, labelsY + 12.8); // Draw the value next to the label

  doc.setFont("verdana", "bold");
  doc.setFontSize(10)
            doc.text(`Audit Date`, labelsX + 118, labelsY + 12.8); // Draw bold label
doc.setFont("verdana-regular", "normal");
  doc.setFontSize(10)
doc.text(
  `: ${TableDataHeading[0].tauddat || ""}`,
  labelsX + 141,
  labelsY + 12.8
);  

               doc.setFont("verdana", "bold");
  doc.setFontSize(10)
            doc.text(`Contect Person`, labelsX, labelsY + 16.8); // Draw bold label
doc.setFont("verdana-regular", "normal");
  doc.setFontSize(10)
            // doc.text(`${search}`, labelsX + 25, labelsY + 8.5); // Draw the value next to the label
            doc.text(`: ${TableDataHeading[0]['Contact Person']}`, labelsX + 36, labelsY + 16.8); // Draw the value next to the label


             doc.setFont("verdana", "bold");
  doc.setFontSize(10)
            doc.text(`Audit Amount`, labelsX + 112, labelsY + 16.8); // Draw bold label
doc.setFont("verdana-regular", "normal");
  doc.setFontSize(10)
            doc.text(`: ${TableDataHeading[0].taudamt || ""}`, labelsX + 141, labelsY + 16.8); // Draw the value next to the label
  
                   doc.setFont("verdana", "bold");
  doc.setFontSize(10)
            doc.text(`Address1`, labelsX, labelsY + 20.8); // Draw bold label
doc.setFont("verdana-regular", "normal");
  doc.setFontSize(10)
            // doc.text(`${search}`, labelsX + 25, labelsY + 8.5); // Draw the value next to the label
            doc.text(`: ${TableDataHeading[0].Address1}`, labelsX + 36, labelsY + 20.8); // Draw the value next to the label

             doc.setFont("verdana", "bold");
  doc.setFontSize(10)
            doc.text(`Grade`, labelsX + 125, labelsY + 20.8); // Draw bold label
doc.setFont("verdana-regular", "normal");
  doc.setFontSize(10)
            doc.text(`: ${TableDataHeading[0].Grade || ""}`, labelsX + 141, labelsY + 20.8); // Draw the value next to the label
  
                      doc.setFont("verdana", "bold");
  doc.setFontSize(10)
            doc.text(`Address2`, labelsX, labelsY + 24.8); // Draw bold label
doc.setFont("verdana-regular", "normal");
  doc.setFontSize(10)
            // doc.text(`${search}`, labelsX + 25, labelsY + 8.5); // Draw the value next to the label
            doc.text(`: ${TableDataHeading[0].Address2}`, labelsX + 36, labelsY + 24.8); // Draw the value next to the label


                         doc.setFont("verdana", "bold");
  doc.setFontSize(10)
            doc.text(`City`, labelsX, labelsY + 28.8); // Draw bold label
doc.setFont("verdana-regular", "normal");
  doc.setFontSize(10)
            // doc.text(`${search}`, labelsX + 25, labelsY + 8.5); // Draw the value next to the label
            doc.text(`: ${TableDataHeading[0].City}`, labelsX + 36, labelsY + 28.8); // Draw the value next to the label


          startY += 32; // Adjust vertical position for the labels
  
          addTableHeaders((doc.internal.pageSize.width - totalWidth) / 2, 51);
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
  
      const getCurrentDate1 = () => {
        const today = new Date();
        const dd = String(today.getDate()).padStart(2, "0");
        const mm = String(today.getMonth() + 1).padStart(2, "0"); // January is 0!
        const yyyy = today.getFullYear();
        return dd + "-" + mm + "-" + yyyy;
      };
  
      const currentdate = getCurrentDate1();
  
      // Save the PDF files
      doc.save(`CustomerLedger As On ${currentdate}.pdf`);
    };

  
const handleDownloadCSV = async () => {
  const workbook = new ExcelJS.Workbook();
  const worksheet = workbook.addWorksheet("Sheet1");

  const numColumns = 6;

  const columnAlignments = ["right", "left", "right", "right", "right","right"];

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
    `A${companyRow.number}:${String.fromCharCode(64 + numColumns)}${companyRow.number}`
  );

  const storeListRow = worksheet.addRow([
    `Customer Progress Report As On ${toInputDate}`,
  ]);
  storeListRow.eachCell((cell) => {
    cell.font = fontStoreList;
    cell.alignment = { horizontal: "center" };
  });

  worksheet.mergeCells(
    `A${storeListRow.number}:${String.fromCharCode(64 + numColumns)}${storeListRow.number}`
  );

  worksheet.addRow([]);

  let Accountselect = Companyselectdatavalue.label
    ? Companyselectdatavalue.label
    : "ALL";
  let status = transectionType ? transectionType : "ALL";

  const typeAndStoreRow2 = worksheet.addRow([
    "Code :",
    TableDataHeading[0].Code,
    "",
    "SaleMan :",
    TableDataHeading[0].SalesMan,
   
  ]);

       worksheet.mergeCells(`B${typeAndStoreRow2.number}:C${typeAndStoreRow2.number}`);

         const typeAndStoreRow3 = worksheet.addRow([
    "Customer :",
    TableDataHeading[0].Customer,
    "",
    "Audit Date :",
    TableDataHeading[0].tauddat,
   
  ]);

       worksheet.mergeCells(`B${typeAndStoreRow3.number}:C${typeAndStoreRow3.number}`);


  const typeAndStoreRow4 = worksheet.addRow([
    "Contect Person :",
    TableDataHeading[0]['Contact Person'],
    "",
    "Audit Amount :",
    TableDataHeading[0].taudamt,
   
  ]);

       worksheet.mergeCells(`B${typeAndStoreRow4.number}:C${typeAndStoreRow4.number}`);

        const typeAndStoreRow5 = worksheet.addRow([
    "Address1 :",
    TableDataHeading[0].Address1,
    "",
    "Grade :",
    TableDataHeading[0].Grade,
   
  ]);

       worksheet.mergeCells(`B${typeAndStoreRow5.number}:C${typeAndStoreRow5.number}`);

          const typeAndStoreRow6 = worksheet.addRow([
    "Address2 :",
    TableDataHeading[0].Address2,
  
   
  ]);

       worksheet.mergeCells(`B${typeAndStoreRow6.number}:C${typeAndStoreRow6.number}`);


          const typeAndStoreRow7 = worksheet.addRow([
    "City :",
    TableDataHeading[0].City,
  
   
  ]);

       worksheet.mergeCells(`B${typeAndStoreRow7.number}:C${typeAndStoreRow7.number}`);

 typeAndStoreRow2.eachCell((cell, colIndex) => {
  cell.font = { name: "CustomFont", size: 10, bold: [1, 4].includes(colIndex) };

  cell.alignment = {
    horizontal: [1, 4].includes(colIndex) ? "right" : "left",
    vertical: "middle",
  };
});

typeAndStoreRow3.eachCell((cell, colIndex) => {
  cell.font = { name: "CustomFont", size: 10, bold: [1, 4].includes(colIndex) };

  cell.alignment = {
    horizontal: [1, 4].includes(colIndex) ? "right" : "left",
    vertical: "middle",
  };
});

typeAndStoreRow4.eachCell((cell, colIndex) => {
  cell.font = { name: "CustomFont", size: 10, bold: [1, 4].includes(colIndex) };

  cell.alignment = {
    horizontal: [1, 4].includes(colIndex) ? "right" : "left",
    vertical: "middle",
  };
});

typeAndStoreRow5.eachCell((cell, colIndex) => {
  cell.font = { name: "CustomFont", size: 10, bold: [1, 4].includes(colIndex) };

  cell.alignment = {
    horizontal: [1, 4].includes(colIndex) ? "right" : "left",
    vertical: "middle",
  };
});
typeAndStoreRow6.eachCell((cell, colIndex) => {
  cell.font = { name: "CustomFont", size: 10, bold: [1, 4].includes(colIndex) };

  cell.alignment = {
    horizontal: [1, 4].includes(colIndex) ? "right" : "left",
    vertical: "middle",
  };
});
typeAndStoreRow7.eachCell((cell, colIndex) => {
  cell.font = { name: "CustomFont", size: 10, bold: [1, 4].includes(colIndex) };

  cell.alignment = {
    horizontal: [1, 4].includes(colIndex) ? "right" : "left",
    vertical: "middle",
  };
});
  // ==== TABLE HEADER ====
  const headerStyle = {
    font: fontHeader,
    alignment: { horizontal: "center", vertical: "middle" },
    fill: { type: "pattern", pattern: "solid", fgColor: { argb: "FFC6D9F7" } },
    border: {
      top: { style: "thin" },
      left: { style: "thin" },
      bottom: { style: "thin" },
      right: { style: "thin" },
    },
  };

  const headers = ["Sr#", "Month", "Debit", "Credit", "Other","Balance"];
  const headerRow = worksheet.addRow(headers);
  headerRow.eachCell((cell) => Object.assign(cell, headerStyle));

  // ==== TABLE CONTENT ====
  tableData.slice(0, -1).forEach((item) => {
    const row = worksheet.addRow([
      item["Sr#"],
      item.Month,
      formatValue(item.Debit),
      formatValue(item.Credit),
       formatValue(item.Other),
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

  // ==== TOTAL ROW ====
  const totalRow = worksheet.addRow([
    "",
    "",
    String(formatValue(tableData.at(-1).Debit)),
    String(formatValue(tableData.at(-1).Credit)),
    "",
    String(formatValue(tableData.at(-1).Balance)),
   
  ]);

  totalRow.eachCell((cell, colNumber) => {
    cell.font = { bold: true };
    cell.border = {
      top: { style: "double" },
      left: { style: "thin" },
      bottom: { style: "double" },
      right: { style: "thin" },
    };
    if (colNumber >= 1 && colNumber <= 6) {
      cell.alignment = { horizontal: "right" };
    }
  });

  // ========= ADD GAP =========
  worksheet.addRow([]);

  // ========= AGING SUMMARY =========
  const agingLabels = ["Balance","0 - 30", "31 - 60", "61 - 90", "91 - 120", "121 - 150", "150 +"];
  const agingValues = [
  formatValue(totalAggingBal.toLocaleString()), 
    formatValue(amt2), 
    formatValue(amt3),
    formatValue(amt4),
    formatValue(amt5), 
   formatValue(amt6),
   formatValue(amt7),
  ];

  const agingLabelRow = worksheet.addRow(agingLabels);
  agingLabelRow.eachCell((cell) => {
    cell.font = { bold: true, size: 10 };
    cell.alignment = { horizontal: "center", vertical: "middle" };
    cell.border = {
      top: { style: "thin" },
      left: { style: "thin" },
      bottom: { style: "thin" },
      right: { style: "thin" },
    };
  });
  worksheet.getRow(agingLabelRow.number).height = 20;

  const agingValueRow = worksheet.addRow(agingValues);
  agingValueRow.eachCell((cell, colIndex) => {
    cell.font = { size: 10 };
    cell.alignment = { horizontal: "right", vertical: "middle" };
    cell.border = {
      top: { style: "thin" },
      left: { style: "thin" },
      bottom: { style: "thin" },
      right: { style: "thin" },
    };
    if (colIndex === 5) {
      cell.font = { bold: false };
      cell.alignment = { horizontal: "center" };
    }
  });
  worksheet.getRow(agingValueRow.number).height = 22;

  // ========= COLUMN WIDTHS =========
  [16, 20, 18, 18, 18,15].forEach((width, index) => {
    worksheet.getColumn(index + 1).width = width;
  });

 
  worksheet.addRow([]);

  const getCurrentTime = () => {
    const today = new Date();
    return `${String(today.getHours()).padStart(2, "0")}:${String(
      today.getMinutes()
    ).padStart(2, "0")}:${String(today.getSeconds()).padStart(2, "0")}`;
  };

  const getCurrentDate = () => {
    const today = new Date();
    return `${String(today.getDate()).padStart(2, "0")}-${String(
      today.getMonth() + 1
    ).padStart(2, "0")}-${today.getFullYear()}`;
  };

  const dateTimeRow = worksheet.addRow([
    `DATE:   ${getCurrentDate()}  TIME:   ${getCurrentTime()}`,
  ]);
  dateTimeRow.alignment = { horizontal: "left" };

  const dateTimeRow1 = worksheet.addRow([`USER ID:  ${user.tusrid}`]);
  dateTimeRow1.alignment = { horizontal: "left" };

  worksheet.mergeCells(
    `A${dateTimeRow.number}:${String.fromCharCode(64 + numColumns)}${dateTimeRow.number}`
  );
  worksheet.mergeCells(
    `A${dateTimeRow1.number}:${String.fromCharCode(64 + numColumns)}${dateTimeRow1.number}`
  );

  const buffer = await workbook.xlsx.writeBuffer();
  const blob = new Blob([buffer], {
    type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  });
  saveAs(blob, `Customer Progress Report As On ${toInputDate}.xlsx`);
};


  const dispatch = useDispatch();
  const user = getUserData();
  const organisation = getOrganisationData();
  const tableTopColor = "#3368B5";
  const tableHeadColor = "#3368b5";
  const secondaryColor = "white";
  const btnColor = "#3368B5";
  const textColor = "white";

 
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
        (data) => data.tusrnam && data.tusrnam.toLowerCase().includes(query)
      );
    }

    return filteredData;
  };

  const firstColWidth = {
    width: "40px",
  };
  const secondColWidth = {
    width: "130px",
  };
  const thirdColWidth = {
    width: "130px",
  };
  const forthColWidth = {
    width: "130px",
  };
  const fifthColWidth = {
    width: "130px",
  };

  const sixcol = {
    width: "8px",
  };

  useHotkeys(
    "alt+s",
    () => {
      fetchGeneralLedger();
      //    resetSorting();
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
  // useHotkeys("esc", () => navigate("/MainPage"));

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
        (item) => item.tcmpcod === selectedRowId
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

  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 5 }, (_, index) => currentYear - index); // Generate current year & last 5 years

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
          <NavComponent textdata="Customer Progress Ledger" />
          <div
            className="row "
            style={{ height: "20px", marginTop: "6px", marginBottom: "10px" }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                margin: "0px",
                padding: "0px",
              }}
            >
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
                    value={
                      options.find((opt) => opt.value === saleType) || null
                    } // Ensure correct reference
                    options={options}
                    onKeyDown={(e) => handleSaleKeypress(e, "toDatePicker")}
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
                        marginTop: "-5px",
                      }),
                    }}
                    isClearable
                    placeholder="ALL"
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
              {/* To Date */}
              <div
                className="d-flex align-items-center"
                style={{ marginLeft: "7px" }}
              >
                <div
                  style={{
                    width: "72px",
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
                      Date :
                    </span>{" "}
                    <br />
                  </label>
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
                      fontSize: getdatafontsize,
                      fontFamily: getfontstyle,
                      backgroundColor: getcolor,
                      color: fontcolor,
                    }}
                    value={toInputDate}
                    onChange={handleToInputChange}
                    // onKeyPress={handleToKeyPress}
                    onKeyDown={(e) => handleToKeyPress(e, "submitButton")}
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
                              fontSize: getdatafontsize,
                              fontFamily: getfontstyle,
                            }}
                          />
                        </span>
                      </div>
                    }
                  />
                </div>
              </div>

              <div
                className="d-flex align-items-center"
                style={{ marginRight: "22px" }}
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
                      Year :
                    </span>{" "}
                    <br />
                  </label>
                </div>
                <select
                  ref={input1Ref}
                  onKeyDown={(e) => handleKeyPress(e, input3Ref)}
                  id="submitButton"
                  name="type"
                  value={transectionType}
                  onChange={handleTransactionTypeChange}
                  style={{
                    width: "120px",
                    height: "24px",
                    marginLeft: "5px",
                    textAlign: "center",
                    backgroundColor: getcolor,
                    border: `1px solid ${fontcolor}`,
                    fontSize: getdatafontsize,
                    fontFamily: getfontstyle,
                    textAlign: "left",
                    marginRight: "1px",
                    color: fontcolor,
                  }}
                >
                  {years.map((year) => (
                    <option key={year} value={year}>
                      {year}
                    </option>
                  ))}
                </select>
              </div>

              {/* Search Item  */}
              {/* <div id="lastDiv" style={{ marginRight: "1px" }}>
                                <label for="searchInput" style={{ marginRight: "5px" }}>
                                    <span style={{ fontSize: getdatafontsize, fontFamily: getfontstyle, fontWeight: "bold" }}>
                                        Search :
                                    </span>{" "}
                                </label>
                                <input
                                    ref={input2Ref}
                                    onKeyDown={(e) => handleKeyPress(e, input3Ref)}
                                    // onKeyDown={(e) => handlesearchKeypress(e, 'searchsubmit')}
                                    type="text"
                                    id="searchsubmit"
                                    placeholder="Item description"
                                    value={searchQuery}
                                    autoComplete="off"
                                    style={{
                                        marginRight: "20px",
                                        width: "200px",
                                        height: "24px",
                                        fontSize: getdatafontsize, fontFamily: getfontstyle, color: fontcolor,
                                        backgroundColor: getcolor,
                                        border: `1px solid ${fontcolor}`,
                                        outline: "none",
                                        paddingLeft: "10px",
                                    }}
                                    onChange={(e) =>
                                        setSearchQuery((e.target.value || "").toUpperCase())

                                    } />
                            </div> */}
            </div>
          </div>

          <div>
            <div
              style={{
                overflowY: "auto",
                // width: "97%",
              }}
            >
              <table
                className="myTable"
                id="table"
                style={{
                  fontSize: getdatafontsize,
                  fontFamily: getfontstyle,
                  //  width: "100%",
                  position: "relative",
                  // paddingRight: "2%",
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
                      Sr#
                    </td>
                    <td className="border-dark" style={secondColWidth}>
                      Month
                    </td>
                    <td className="border-dark" style={thirdColWidth}>
                      Debit
                    </td>
                    <td className="border-dark" style={forthColWidth}>
                      Credit
                    </td>
                    <td className="border-dark" style={fifthColWidth}>
                      Balance
                    </td>
                    <td className="border-dark" style={sixcol}></td>
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
                maxHeight: "40vh",
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
                  width: "100%",
                  position: "relative",
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
                        <td colSpan="5" className="text-center">
                          <Spinner animation="border" variant="primary" />
                        </td>
                      </tr>
                      {Array.from({ length: Math.max(0, 12 - 5) }).map(
                        (_, rowIndex) => (
                          <tr
                            key={`blank-${rowIndex}`}
                            style={{
                              backgroundColor: getcolor,
                              color: fontcolor,
                            }}
                          >
                            {Array.from({ length: 5 }).map((_, colIndex) => (
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
                        <td style={fifthColWidth}></td>
                      </tr>
                    </>
                  ) : (
                    <>
                      {tableData.slice(0,-1).map((item, i) => {
                        totalEnteries += 1;
                        return (
                          <tr
                            key={`${i}-${selectedIndex}`}
                            ref={(el) => (rowRefs.current[i] = el)} // Assign ref to each row
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
                              {item["Sr#"]}
                            </td>
                            <td className="text-start" style={secondColWidth}>
                              {item.Month}
                            </td>
                            <td className="text-end" style={thirdColWidth}>
                              {formatValue(item.Debit)}
                            </td>
                            <td className="text-end" style={forthColWidth}>
                              {formatValue(item.Credit)}
                            </td>
                            <td className="text-end" style={fifthColWidth}>
                              {formatValue(item.Balance)}
                            </td>
                          </tr>
                        );
                      })}
                      {Array.from({
                        length: Math.max(0, 12 - tableData.length),
                      }).map((_, rowIndex) => (
                        <tr
                          key={`blank-${rowIndex}`}
                          style={{
                            backgroundColor: getcolor,
                            color: fontcolor,
                          }}
                        >
                          {Array.from({ length: 5 }).map((_, colIndex) => (
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
              <span className="mobileledger_total">
                {formatValue(tableData.at(-1)?.Debit)}
              </span>
            </div>
            <div
              style={{
                ...forthColWidth,
                background: getcolor,
                borderRight: `1px solid ${fontcolor}`,
              }}
            >
              <span className="mobileledger_total">
                {formatValue(tableData.at(-1)?.Credit)}
              </span>
            </div>
            <div
              style={{
                ...fifthColWidth,
                background: getcolor,
                borderRight: `1px solid ${fontcolor}`,
              }}
            >
              <span className="mobileledger_total">
                {formatValue(tableData.at(-1)?.Balance)}
              </span>
            </div>
          </div>

          <div
            style={{
              margin: "10px 0px",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <div
              style={{
                border: "1px solid grey ",
                padding: "5px",
                borderRadius: "5px",
                display: "flex",
                flexDirection: "column",
              }}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  borderBottom: "1px solid grey",
                }}
              >
                <div
                  style={{
                    width: "80px ",
                    padding: "0px 5px",
                    fontSize: "12px",
                    borderRight: "1px solid grey",
                  }}
                >
                  01 - 30
                </div>
                <div
                  style={{
                    width: "80px ",
                    padding: "0px 5px",
                    fontSize: "12px",
                    borderRight: "1px solid grey",
                  }}
                >
                  31 - 60
                </div>
                <div
                  style={{
                    width: "80px ",
                    padding: "0px 5px",
                    fontSize: "12px",
                    borderRight: "1px solid grey",
                  }}
                >
                  61 - 90
                </div>
                <div
                  style={{
                    width: "80px ",
                    padding: "0px 5px",
                    fontSize: "12px",
                    borderRight: "1px solid grey",
                  }}
                >
                  91 - 120
                </div>
                <div
                  style={{
                    width: "80px ",
                    padding: "0px 5px",
                    fontSize: "12px",
                    borderRight: "1px solid grey",
                  }}
                >
                  121 - 150
                </div>
                <div
                  style={{
                    width: "80px ",
                    padding: "0px 5px",
                    fontSize: "12px",
                  }}
                >
                  150 +
                </div>
              </div>
              <div style={{ display: "flex", alignItems: "center" }}>
                <div
                  style={{
                    fontWeight: "bold",
                    width: "80px",
                    padding: "0px 5px",
                    fontSize: "12px",
                    borderRight: "1px solid grey",
                  }}
                >
                  {amt2}
                </div>
                <div
                  style={{
                    fontWeight: "bold",
                    width: "80px",
                    padding: "0px 5px",
                    fontSize: "12px",
                    borderRight: "1px solid grey",
                  }}
                >
                  {amt3}
                </div>
                <div
                  style={{
                    fontWeight: "bold",
                    width: "80px",
                    padding: "0px 5px",
                    fontSize: "12px",
                    borderRight: "1px solid grey",
                  }}
                >
                  {amt4}
                </div>
                <div
                  style={{
                    fontWeight: "bold",
                    width: "80px",
                    padding: "0px 5px",
                    fontSize: "12px",
                    borderRight: "1px solid grey",
                  }}
                >
                  {amt5}
                </div>
                <div
                  style={{
                    fontWeight: "bold",
                    width: "80px",
                    padding: "0px 5px",
                    fontSize: "12px",
                    borderRight: "1px solid grey",
                  }}
                >
                  {amt6}
                </div>
                <div
                  style={{
                    fontWeight: "bold",
                    width: "80px",
                    padding: "0px 5px",
                    fontSize: "12px",
                  }}
                >
                  {amt7}
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