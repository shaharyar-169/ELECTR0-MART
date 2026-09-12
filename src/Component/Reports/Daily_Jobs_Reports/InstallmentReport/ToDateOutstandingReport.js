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
import { Balance, Collections, Description, Store } from "@mui/icons-material";
import "../../../vardana/vardana";
import "../../../vardana/verdana-bold";
import { FaWhatsapp } from "react-icons/fa";

export default function ToDateOutstandingReport() {
  const navigate = useNavigate();
  const user = getUserData();
  const organisation = getOrganisationData();

  const saleSelectRef = useRef(null);
  const collectorRef = useRef(null);

  const toRef = useRef(null);
  const fromRef = useRef(null);
  const companyRef = useRef(null);
  const categoryRef = useRef(null);
  const capacityRef = useRef(null);
  const storeRef = useRef(null);
  const employeeref = useRef(null);
  const CustomerRef = useRef(null);
  const typeRef = useRef(null);
  const searchRef = useRef(null);
  const selectButtonRef = useRef(null);
  const hasInitialized = useRef(false);

  const [saleType, setSaleType] = useState("");

  const [Collector, setCollector] = useState("");
  const [CollectorDataValue, setCollectorDataValue] = useState("");

  const [storeList, setStoreList] = useState([]);
  const [storeType, setStoreType] = useState("");

  const input1Ref = useRef(null);
  const input2Ref = useRef(null);
  const input3Ref = useRef(null);
  const input4Refrate = useRef(null);
  const input5Ref = useRef(null);
  const input4Ref = useRef(null);
  const input6Ref = useRef(null);

  const [Companyselectdata, setCompanyselectdata] = useState("");

  console.log("Companyselectdata", Companyselectdata);
  const [Companyselectdatavalue, setCompanyselectdatavalue] = useState("");

  const [Capacityselectdata, setCapacityselectdata] = useState("");
  const [capacityselectdatavalue, setcapacityselectdatavalue] = useState("");

  const [GetCapacity, setGetCapacity] = useState([]);
  const [GetEmployee, setGetEmployee] = useState([]);
  const [GetCutomers, setGetCutomers] = useState([]);

  console.log("customer daa", GetCutomers);
  const [CollectorData, setCollectorData] = useState([]);

  const [Employeeselectdata, setEmployeeselectdata] = useState("");
  const [Employeeselectdatavalue, setEmployeeselectdatavalue] = useState("");

  const [Customerselectdata, setCustomerselectdata] = useState("");
  const [Customerselectdatavalue, setCustomerselectdatavalue] = useState("");

  console.log("customer code ", Customerselectdata);
  console.log("customer code value ", Customerselectdatavalue);

  const [GetCompany, setGetCompany] = useState([]);
  const [Categoryselectdata, setCategoryselectdata] = useState("");
  const [categoryselectdatavalue, setcategoryselectdatavalue] = useState("");

  const [GetCategory, setGetCategory] = useState([]);

  const [Typeselectdata, setTypeselectdata] = useState("");
  const [typeselectdatavalue, settypeselectdatavalue] = useState("");

  const [GetType, setGetType] = useState([]);

  const [sortData, setSortData] = useState("ASC");

  const [searchQuery, setSearchQuery] = useState("");
  const [transectionType, settransectionType] = useState("A");
  const [transectionType2, settransectionType2] = useState("");

  const [totalqnty, settotalqnty] = useState(0);
  const [totalexcel, settotalexcel] = useState(0);
  const [totaltax, settotaltax] = useState(0);
  const [totalincl, settotalincl] = useState(0);

  const [totalSale, settotalSale] = useState(0);
  const [totalIns, settotalIns] = useState(0);
  const [totalReceive, settotalReceive] = useState(0);
  const [totalCollection, settotalCollection] = useState(0);
  const [totalDisc, settotalDisc] = useState(0);
  const [totalOutstan, settotalOutstan] = useState(0);
  const [totalBalance, settotalBalance] = useState(0);

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

  const [selectedRadio, setSelectedRadio] = useState("custom"); // State to track selected radio button

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
  const GlobaltoDate1 = formatDate1(GlobaltoDate);
  const GlobalfromDate1 = formatDate1(GlobalfromDate);

  //////////////////////// CUSTOM DATE LIMITS ////////////////////////////

  // Toggle the ToDATE CalendarOpen state on each click
  const toggleToCalendar = () => {
    settoCalendarOpen((prevOpen) => !prevOpen);
  };
  const formatDate = (date) => {
    const day = date.getDate().toString().padStart(2, "0");
    const month = (date.getMonth() + 1).toString().padStart(2, "0");
    const year = date.getFullYear();
    return `${day}-${month}-${year}`;
  };

  const handleToDateChange = (date) => {
    setSelectedToDate(date);
    settoInputDate(date ? formatDate(date) : "");
    settoCalendarOpen(false);
  };
  const handleToInputChange = (e) => {
    settoInputDate(e.target.value);
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

  const handlefromDateChange = (date) => {
    setSelectedfromDate(date);
    setfromInputDate(date ? formatDate(date) : "");
    setfromCalendarOpen(false);
  };

  const toggleFromCalendar = () => {
    setfromCalendarOpen((prevOpen) => !prevOpen);
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

        if (collectorRef.current) {
          e.preventDefault();
          collectorRef.current.focus();
        }
      } else {
        toast.error("Date must be in the format dd-mm-yyyy");
      }
    }
  };

  function fetchDailyStatusReport() {
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

    document.getElementById("fromdatevalidation").style.border =
      `1px solid ${fontcolor}`;
    document.getElementById("todatevalidation").style.border =
      `1px solid ${fontcolor}`;

    const apiUrl = apiLinks + "/ToDateOutstandingReport.php";
    setIsLoading(true);
    const formData = new URLSearchParams({
      FIntDat: fromInputDate,
      FFnlDat: toInputDate,
      FRepTyp: transectionType2,
      FColCod: Collector,
      FCstTyp: Customerselectdata,

      code: "MTSELEC",
      FLocCod: "002",
      //   code: organisation.code,
      //   FLocCod: locationnumber || getLocationNumber,
      //   FYerDsc: yeardescription || getyeardescription,
    }).toString();

    axios
      .post(apiUrl, formData)
      .then((response) => {
        setIsLoading(false);

        settotalSale(response.data["Total Sale "]);
        settotalIns(response.data["Total Ins "]);
        settotalReceive(response.data["Total Receivable "]);
        settotalCollection(response.data["Total Collection "]);
        settotalDisc(response.data["Total Disc "]);
        settotalOutstan(response.data["Total Outstanding "]);
        settotalBalance(response.data["Total Balance "]);

        if (response.data && Array.isArray(response.data.Detail)) {
          setTableData(response.data.Detail);
        } else {
          console.warn(
            "Response data structure is not as expected:",
            response.data.Detail,
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

    const firstDateOfCurrentMonth = new Date(
      currentDate.getFullYear(),
      currentDate.getMonth(),
      1,
    );

    const lastDateOfCurrentMonth = new Date(
      currentDate.getFullYear(),
      currentDate.getMonth() + 1,
      0,
    );

    setSelectedfromDate(firstDateOfCurrentMonth);
    setfromInputDate(formatDate(firstDateOfCurrentMonth));

    setSelectedToDate(lastDateOfCurrentMonth);
    settoInputDate(formatDate(lastDateOfCurrentMonth));
  }, []);

  // CUSTOMER SELECT API

  useEffect(() => {
    const apiUrl = apiLinks + "/GetActiveCustTypes.php";
    const formData = new URLSearchParams({
      code: organisation.code,
      FLocCod: locationnumber || getLocationNumber,
    }).toString();
    axios
      .post(apiUrl, formData)
      .then((response) => {
        if (response.data && Array.isArray(response.data)) {
          setGetCutomers(response.data);
        } else {
          console.warn(
            "Response data structure is not as expected:",
            response.data,
          );
          setGetCutomers([]);
        }
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  }, []);
  const customerOption = GetCutomers.map((item) => ({
    value: item.ttypcod,
    label: `${item.ttypcod}-${item.ttypdsc}`,
  }));

  useEffect(() => {
    const apiUrl = apiLinks + "/GetActiveCollector.php";
    const formData = new URLSearchParams({
      code: organisation.code,
      FLocCod: locationnumber || getLocationNumber,
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

  const Collectoroption = CollectorData.map((item) => ({
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
            padding: "2px 8px",
            lineHeight: "1.2",
            whiteSpace: "normal",
            wordBreak: "break-word",
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
      width: 220,
      fontSize: getdatafontsize,
      fontFamily: getfontstyle,
      backgroundColor: getcolor,
      color: fontcolor,
      caretColor: getcolor === "white" ? "black" : "white",
      borderRadius: 0,
      border: `1px solid ${state.isFocused ? "red" : fontcolor}`,
      transition: "border-color 0.15s ease-in-out",
      "&:hover": {
        borderColor: state.isFocused ? "red" : fontcolor,
      },
      padding: "0 8px",
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      boxShadow: state.isFocused ? "0 0 0 1px red" : "none",
    }),

    menu: (base) => ({
      ...base,
      marginTop: "5px",
      borderRadius: 0,
      backgroundColor: getcolor,
      border: `1px solid ${fontcolor}`,
      boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
      zIndex: 9999,
      width: "auto",
      minWidth: "100%",
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
          backgroundColor: "#3368B5",
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
      padding: "2px 8px",
      lineHeight: "1.2",
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

  // ================================================================
  // PDF — Main "PDF" button (now with Mobile column)
  // ================================================================
const exportPDFHandler = () => {
    const doc = new jsPDF({ orientation: "landscape" });

    const rows = tableData.map((item, index) => [
      String(index + 1), // Sr
      item.Code, // A/C Code
      item.ManualNo, // Manual
      item.Customer, // Customer
      item.Mobile, // Mobile
      item.PrmDate, // PrmDate
      item.InsAmt, // InsAmt
      item.Receiavable, // Receivable
      item.LastDate, // LastDate
      item.Collection, // Collection
      item.Outstanding, // Outstanding
      item.Balance, // Balance
    ]);

    rows.push([
      String(formatValue(tableData.length.toLocaleString())),
      "",
      "",
      "",
      "",
      "",
      String(formatValue(totalIns)),
      String(formatValue(totalReceive)),
      "",
      String(formatValue(totalCollection)),
      String(formatValue(totalOutstan)),
      String(formatValue(totalBalance)),
    ]);

    const headers = [
      "Sr",
      "A/C Code",
      "Manual",
      "Customer",
      "Mobile",
      "PrmDate",
      "InsAmt",
      "Receivable",
      "LastDate",
      "Collection",
      "Outstan",
      "Balance",
    ];
    const columnWidths = [10, 22, 20, 50, 28, 22, 22, 26, 23, 23, 23, 23];

    const totalWidth = columnWidths.reduce((acc, width) => acc + width, 0);

    const pageHeight = doc.internal.pageSize.height;
    const paddingTop = 15;

    doc.setFont("verdana-regular", "normal");
    doc.setFontSize(10);

    const BASE_ROW_HEIGHT = 5;
    const FOOTER_LINE_Y = pageHeight - 15;
    const FOOTER_GAP = 3;

    // ✅ Helper: measure text width
    const getTextWidth = (text) => doc.getTextWidth(String(text));

    // ✅ Helper: wrap Customer text within fixed column width
    const wrapCustomerText = (text) => {
      const customerColIndex = 3;
      const padding = 4; // left + right inner padding
      const maxWidth = columnWidths[customerColIndex] - padding;
      const raw = String(text ?? "");
      if (getTextWidth(raw) <= maxWidth) {
        return [raw];
      }
      const words = raw.split(/\s+/);
      const lines = [];
      let current = "";
      for (const word of words) {
        const test = current ? current + " " + word : word;
        if (getTextWidth(test) <= maxWidth) {
          current = test;
        } else {
          if (current) lines.push(current);
          if (getTextWidth(word) > maxWidth) {
            let chunk = "";
            for (const ch of word) {
              if (getTextWidth(chunk + ch) <= maxWidth) {
                chunk += ch;
              } else {
                lines.push(chunk);
                chunk = ch;
              }
            }
            current = chunk;
          } else {
            current = word;
          }
        }
      }
      if (current) lines.push(current);
      return lines;
    };

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

      doc.setFont(getfontstyle);
      doc.setFontSize(10);
    };

    const getTotalTableWidth = () => {
      let tw = 0;
      columnWidths.forEach((width) => (tw += width));
      return tw;
    };

    const addTableRows = (startX, startY, startIndex, endIndex) => {
      const normalFont = getfontstyle;
      const tableWidth = getTotalTableWidth();

      doc.setFontSize(10);

      // ✅ Cumulative Y so double-height rows don't overlap
      let cumulativeY = startY + 2 * BASE_ROW_HEIGHT;
      let maxBottomY = cumulativeY;

      for (let i = startIndex; i < endIndex; i++) {
        const row = rows[i];
        const isTotalRow = i === rows.length - 1;
        const isOddRow = i % 2 !== 0;

        // ✅ Determine Customer wrapping → double height if needed
        const customerLines = wrapCustomerText(row[3]);
        const isDoubleHeight = customerLines.length > 1;
        const rowHeight = isDoubleHeight ? BASE_ROW_HEIGHT * 2 : BASE_ROW_HEIGHT;

        // ✅ Total row: normal font (NOT bold)
        if (isTotalRow) {
          doc.setFont("verdana-regular", "normal");
          doc.setFontSize(10);
        }

        if (isOddRow && !isTotalRow) {
          doc.setFillColor(240);
          doc.rect(startX, cumulativeY, tableWidth, rowHeight, "F");
        }

        doc.setDrawColor(0);

        if (isTotalRow) {
          const rowTopY = cumulativeY;
          const rowBottomY = cumulativeY + rowHeight;

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
          doc.rect(startX, cumulativeY, tableWidth, rowHeight);
        }

        row.forEach((cell, cellIndex) => {
          const cellX = startX + 2;
          doc.setTextColor(0, 0, 0);

          if (!isTotalRow) {
            doc.setFont("verdana-regular", "normal");
            doc.setFontSize(10);
          } else {
            doc.setFont("verdana-regular", "normal");
            doc.setFontSize(10);
          }

          const cellValue = String(cell);

          if (cellIndex === 3) {
            // ✅ Customer: wrap text inside fixed column, vertically centered per line
            const lineHeight = rowHeight / customerLines.length;
            customerLines.forEach((line, li) => {
              const lineY = cumulativeY + li * lineHeight + lineHeight / 2;
              doc.text(line, cellX, lineY, { baseline: "middle" });
            });
          } else if (cellIndex === 2) {
            // ✅ Manual: LEFT aligned
            const centerY = cumulativeY + rowHeight / 2;
            doc.text(cellValue, cellX, centerY, { baseline: "middle" });
          } else if (
            cellIndex === 0 ||
            cellIndex === 1 ||
            cellIndex === 5
          ) {
            // Sr, A/C Code, PrmDate - center
            const centerY = cumulativeY + rowHeight / 2;
            const centerX = startX + columnWidths[cellIndex] / 2;
            doc.text(cellValue, centerX, centerY, {
              align: "center",
              baseline: "middle",
            });
          } else if (cellIndex === 4) {
            // Mobile - left
            const centerY = cumulativeY + rowHeight / 2;
            doc.text(cellValue, cellX, centerY, { baseline: "middle" });
          } else {
            // Numeric - right
            const centerY = cumulativeY + rowHeight / 2;
            const rightAlignX = startX + columnWidths[cellIndex] - 2;
            doc.text(cellValue, rightAlignX, centerY, {
              align: "right",
              baseline: "middle",
            });
          }

          if (cellIndex < row.length - 1) {
            doc.setLineWidth(0.2);
            doc.line(
              startX + columnWidths[cellIndex],
              cumulativeY,
              startX + columnWidths[cellIndex],
              cumulativeY + rowHeight,
            );
            startX += columnWidths[cellIndex];
          }
        });

        startX = (doc.internal.pageSize.width - tableWidth) / 2;
        cumulativeY += rowHeight;
        maxBottomY = cumulativeY;
      }

      const lineX = (doc.internal.pageSize.width - tableWidth) / 2;
      const lineY = FOOTER_LINE_Y;
      doc.setLineWidth(0.3);
      doc.line(lineX, lineY, lineX + tableWidth, lineY);
      const headingX = lineX + 2;
      const headingY = lineY + 5;
      doc.setFont("verdana-regular", "normal");
      doc.setFontSize(10);
      doc.text(`Crystal Solution    ${date}    ${time}`, headingX, headingY);

      return maxBottomY;
    };

    const addNewPage = (startY) => {
      doc.addPage();
      return paddingTop;
    };

    // ✅ Precompute actual row heights for dynamic page-fitting
    const precomputedRowHeights = rows.map((row) => {
      const lines = wrapCustomerText(row[3]);
      return lines.length > 1 ? BASE_ROW_HEIGHT * 2 : BASE_ROW_HEIGHT;
    });

    // ✅ Given a starting table Y and row index, return max rows that fit above footer
    const fitRowsOnPage = (tableStartY, startRowIndex) => {
      let y = tableStartY + 2 * BASE_ROW_HEIGHT;
      const maxY = FOOTER_LINE_Y - FOOTER_GAP;
      let count = 0;
      let idx = startRowIndex;
      while (idx < precomputedRowHeights.length) {
        const h = precomputedRowHeights[idx];
        if (y + h <= maxY) {
          y += h;
          count++;
          idx++;
        } else {
          break;
        }
      }
      return Math.max(1, count);
    };

    const handlePagination = () => {
      const addTitle = (
        title,
        date,
        time,
        pageNumber,
        startY,
        titleFontSize = 18,
        pageNumberFontSize = 10,
        totalPages = 1,
      ) => {
        doc.setFontSize(titleFontSize);
        doc.text(title, doc.internal.pageSize.width / 2, startY, {
          align: "center",
        });

        const rightX = doc.internal.pageSize.width - 10;

        doc.setFont("verdana-regular", "normal");
        doc.setFontSize(10);
        doc.text(
          `Page ${pageNumber} / ${totalPages}`,
          rightX - 20,
          doc.internal.pageSize.height - 10,
          { align: "right" },
        );
      };

      // ✅ Compute tableStartY for first page (same as inside loop)
      const labelsYFirst = (paddingTop + 5) + 5 + 4;
      const tableStartYFirst = (labelsYFirst + 10) + 0;

      // ✅ Build dynamic page plan based on actual row heights
      const computePagePlan = () => {
        const plan = [];
        let rowIdx = 0;
        while (rowIdx < rows.length) {
          const count = fitRowsOnPage(tableStartYFirst, rowIdx);
          plan.push({ start: rowIdx, count });
          rowIdx += count;
        }
        return plan;
      };

      const pagePlan = computePagePlan();
      const totalPages = Math.max(1, pagePlan.length);

      let currentPageIndex = 0;
      let startY = paddingTop;
      let pageNumber = 1;

      while (currentPageIndex < pagePlan.length) {
        doc.setFont("Times New Roman", "normal");
        doc.setFontSize(10);
        addTitle(comapnyname, 12, 12, pageNumber, startY, 18, 10, totalPages);
        startY += 5;
        doc.setFont("verdana-regular", "normal");
        doc.setFontSize(10);
        addTitle(
          `Installment Recovery Report From ${fromInputDate} To ${toInputDate}`,
          "",
          "",
          pageNumber,
          startY,
          12,
          10,
          totalPages,
        );
        startY += 5;

        const labelsX = (doc.internal.pageSize.width - totalWidth) / 2;
        const labelsY = startY + 4;

        let Typefilter =
          transectionType2 === "N"
            ? "NILL COLLECTION"
            : transectionType2 === "A"
              ? "ADVANCE"
              : transectionType2 === "L"
                ? "LESS OUTSTANDING"
                : transectionType2 === "E"
                  ? "EXPIRD ACCOUNT"
                  : transectionType2 === "C"
                    ? "CLOSE"
                    : "ALL";

        let collectorData = CollectorDataValue.label
          ? CollectorDataValue.label
          : "ALL";
        let custTypeData = Customerselectdatavalue.label
          ? Customerselectdatavalue.label
          : "ALL";

        doc.setFont("verdana", "bold");
        doc.setFontSize(10);
        doc.text(`Collector :`, labelsX, labelsY + 4.3);
        doc.setFont("verdana-regular", "normal");
        doc.setFontSize(10);
        doc.text(`${collectorData}`, labelsX + 25, labelsY + 4.3);

        doc.setFont("verdana", "bold");
        doc.setFontSize(10);
        doc.text(`Cust Type :`, labelsX + 180, labelsY + 4.3);
        doc.setFont("verdana-regular", "normal");
        doc.setFontSize(10);
        doc.text(`${custTypeData}`, labelsX + 210, labelsY + 4.3);

        doc.setFont("verdana", "bold");
        doc.setFontSize(10);
        doc.text(`Type :`, labelsX, labelsY + 8.3);
        doc.setFont("verdana-regular", "normal");
        doc.setFontSize(10);
        doc.text(`${Typefilter}`, labelsX + 25, labelsY + 8.3);

        startY += 10;

        addTableHeaders((doc.internal.pageSize.width - totalWidth) / 2, 39);

        // ✅ Use dynamic page plan
        const pageSlice = pagePlan[currentPageIndex];
        const startIndex = pageSlice.start;
        const endIndex = Math.min(startIndex + pageSlice.count, rows.length);

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
      return `${dd}-${mm}-${yyyy}`;
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

    doc.save(`InstallmentRecoveryReport As On ${date}.pdf`);
  };

  // ================================================================
  // EXCEL — Main "Excel" button (now with Mobile column)
  // ================================================================
const handleDownloadCSV = async () => {
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet("Sheet1");

    // 12 original (deduped) + 13 new = 25 columns
    const numColumns = 25;

    const columnAlignments = [
      "center", // 1  Sr
      "center", // 2  A/C Code
      "left",   // 3  Manual
      "left",   // 4  Customer
      "left",   // 5  Mobile
      "center", // 6  PrmDate
      "right",  // 7  InsAmt
      "right",  // 8  Receivable
      "right",  // 9  LastDate
      "right",  // 10 Collection
      "right",  // 11 Outstanding
      "right",  // 12 Balance

      // -------- New columns appended --------
      "left",   // 13 FatherName
      "left",   // 14 Address1
      "left",   // 15 Address2
      "left",   // 16 Collector
      "center", // 17 SaleDate
      "left",   // 18 Item
      "right",  // 19 LastAmt
      "right",  // 20 SaleAmt
      "center", // 21 Day
      "center", // 22 ExpDate
      "right",  // 23 Collected
      "right",  // 24 Opening
      "right",  // 25 Disc
    ];

    const toNumber = (value) => {
      if (typeof value === "number") return value;
      if (typeof value === "string") {
        const cleaned = value.replace(/,/g, "");
        const num = parseFloat(cleaned);
        return isNaN(num) ? 0 : num;
      }
      return 0;
    };

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

    worksheet.addRow([]);

    const companyRow = worksheet.addRow([comapnyname]);
    companyRow.eachCell((cell) => {
      cell.font = {
        name: "Times New Roman",
        size: 16,
        bold: true,
      };
      cell.alignment = { horizontal: "center" };
    });

    worksheet.getRow(companyRow.number).height = 30;
    worksheet.mergeCells(
      `A${companyRow.number}:${String.fromCharCode(65 + numColumns - 1)}${companyRow.number}`,
    );

    const storeListRow = worksheet.addRow([
      `Installment Recovery Report From ${fromInputDate} To ${toInputDate}`,
    ]);
    storeListRow.eachCell((cell) => {
      cell.font = fontStoreList;
      cell.alignment = { horizontal: "center" };
    });

    worksheet.mergeCells(
      `A${storeListRow.number}:${String.fromCharCode(65 + numColumns - 1)}${storeListRow.number}`,
    );

    worksheet.addRow([]);

    // ===== EXCEL FILTERS: Collector, Cust Type, Type only =====
    let collectorData = CollectorDataValue.label
      ? CollectorDataValue.label
      : "ALL";
    let custTypeData = Customerselectdatavalue.label
      ? Customerselectdatavalue.label
      : "ALL";
    let Typefilter =
      transectionType2 === "N"
        ? "NILL COLLECTION"
        : transectionType2 === "A"
          ? "ADVANCE"
          : transectionType2 === "L"
            ? "LESS OUTSTANDING"
            : transectionType2 === "E"
              ? "EXPIRD ACCOUNT"
              : transectionType2 === "C"
                ? "CLOSE"
                : "ALL";

    const typeAndStoreRow = worksheet.addRow([
      "Collec :",
      collectorData,
      "",
      "",
      "",
      "",
      "",
      "",
      "Cust Type :",
      custTypeData,
    ]);

    const typeAndStoreRow2 = worksheet.addRow([
      "Type :",
      Typefilter,
      "",
      "",
      "",
      "",
      "",
      "",
      "",
      "",
    ]);

    typeAndStoreRow.eachCell((cell, colIndex) => {
      cell.font = {
        name: "CustomFont" || "CustomFont",
        size: 10,
        bold: [1, 9].includes(colIndex),
      };
      cell.alignment = { horizontal: "left", vertical: "middle" };
    });
    typeAndStoreRow2.eachCell((cell, colIndex) => {
      cell.font = {
        name: "CustomFont" || "CustomFont",
        size: 10,
        bold: [1].includes(colIndex),
      };
      cell.alignment = { horizontal: "left", vertical: "middle" };
    });

    // ===== MERGE: Collection Type filter value cell (B to C) =====
    // The Collector filter value lives in column B of `typeAndStoreRow`.
    worksheet.mergeCells(
      `B${typeAndStoreRow.number}:C${typeAndStoreRow.number}`,
    );

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
      "Sr",
      "A/C Code",
      "Manual",
      "Customer",
      "Mobile",
      "PrmDate",
      "InsAmt",
      "Receivable",
      "LastDate",
      "Collection",
      "Outstanding",
      "Balance",

      // -------- New columns appended --------
      "FatherName",
      "Address1",
      "Address2",
      "Collector",
      "SaleDate",
      "Item",
      "LastAmt",
      "SaleAmt",
      "Day",
      "ExpDate",
      "Collected",
      "Opening",
      "Disc",
    ];
    const headerRow = worksheet.addRow(headers);
    headerRow.eachCell((cell) => Object.assign(cell, headerStyle));

    tableData.forEach((item, index) => {
      const row = worksheet.addRow([
        String(index + 1), // Sr — generated from row index
        item.Code,
        item.ManualNo,
        item.Customer,
        item.Mobile,
        item.PrmDate,
        toNumber(item.InsAmt),
        toNumber(item.Receivable),
        item.LastDate,
        toNumber(item.Collection),
        toNumber(item.Outstanding),
        toNumber(item.Balance),

        // -------- New columns appended --------
        item.FatherName,
        item.Address1,
        item.Address2,
        item.Collector,
        item.SaleDate,
        item.Item,
        toNumber(item.LastAmt),
        toNumber(item.SaleAmt),
        item.Day,
        item.ExpDate,
        toNumber(item.Collected),
        toNumber(item.Opening),
        toNumber(item.Disc),
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
        if ([7, 8, 10, 11, 12, 19, 20, 23, 24, 25].includes(colIndex)) {
          cell.numFmt = "#,##0";
        }
      });
    });

    // Column widths — 25 columns
    [
      8,  // 1  Sr
      14, // 2  A/C Code
      16, // 3  Manual
      45, // 4  Customer
      12, // 5  Mobile
      12, // 6  PrmDate
      14, // 7  InsAmt
      14, // 8  Receivable
      14, // 9  LastDate
      14, // 10 Collection
      14, // 11 Outstanding
      14, // 12 Balance
      20, // 13 FatherName
      30, // 14 Address1
      30, // 15 Address2
      16, // 16 Collector
      14, // 17 SaleDate
      30, // 18 Item
      14, // 19 LastAmt
      14, // 20 SaleAmt
      10, // 21 Day
      14, // 22 ExpDate
      14, // 23 Collected
      14, // 24 Opening
      14, // 25 Disc
    ].forEach((width, index) => {
      worksheet.getColumn(index + 1).width = width;
    });

    // ===== Totals row (from API response) =====
    const totalSaleNum = toNumber(totalSale);
    const totalInsNum = toNumber(totalIns);
    const totalReceiveNum = toNumber(totalReceive);
    const totalCollectionNum = toNumber(totalCollection);
    const totalDiscNum = toNumber(totalDisc);
    const totalOutstanNum = toNumber(totalOutstan);
    const totalBalanceNum = toNumber(totalBalance);

    const totalRow = worksheet.addRow([
      String(formatValue(tableData.length.toLocaleString())), // col 1  - count
      "",                                                     // col 2
      "",                                                     // col 3
      "",                                                     // col 4
      "",                                                     // col 5
      "",                                                     // col 6
      totalInsNum,                                            // col 7  InsAmt
      totalReceiveNum,                                        // col 8  Receivable
      "",                                                     // col 9
      totalCollectionNum,                                     // col 10 Collection
      totalOutstanNum,                                        // col 11 Outstanding
      totalBalanceNum,                                        // col 12 Balance

      // new columns
      "",                                                     // col 13 FatherName
      "",                                                     // col 14 Address1
      "",                                                     // col 15 Address2
      "",                                                     // col 16 Collector
      "",                                                     // col 17 SaleDate
      "",                                                     // col 18 Item
      "",                                                     // col 19 LastAmt
      "",                                                     // col 20 SaleAmt
      "",                                                     // col 21 Day
      "",                                                     // col 22 ExpDate
      "",                                                     // col 23 Collected
      "",                                                     // col 24 Opening
      totalDiscNum,                                           // col 25 Disc
    ]);

    totalRow.eachCell((cell, colNumber) => {
      cell.font = { bold: true };
      cell.border = {
        top: { style: "double" },
        left: { style: "thin" },
        bottom: { style: "double" },
        right: { style: "thin" },
      };
      if (colNumber > 6) {
        cell.alignment = { horizontal: "right" };
      }
      if (colNumber === 1) {
        cell.alignment = { horizontal: "center" };
      }
      if ([7, 8, 10, 11, 12, 19, 20, 23, 24, 25].includes(colNumber)) {
        cell.numFmt = "#,##0";
      }
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
      cell.font = { name: "CustomFont" || "CustomFont", size: 10 };
      cell.alignment = { horizontal: "left" };
    });

    const dateTimeRow1 = worksheet.addRow([`USER ID:  ${userid}`]);
    dateTimeRow1.eachCell((cell) => {
      cell.font = { name: "CustomFont" || "CustomFont", size: 10 };
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
    saveAs(blob, `InstallmentRecoveryReport As On ${currentdate}.xlsx`);
  };

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

  const handleCustomerSelectKeypress = (event, inputId) => {
    if (event.key === "Enter") {
      const selectedOption = CustomerRef.current.state.selectValue;
      if (selectedOption && selectedOption.value) {
        setCustomerselectdata(selectedOption.value);
      }
      const nextInput = inputId.current;

      if (nextInput) {
        nextInput.focus();
      } else {
        document.getElementById("submitButton").click();
      }
    }
  };

  const handleSaleKeypress = (event, inputId) => {
    if (event.key === "Enter") {
      const selectedOption = collectorRef.current.state.selectValue;
      if (selectedOption && selectedOption.value) {
        setCapacityselectdata(selectedOption.value);
      }
      const nextInput = inputId.current;

      if (nextInput) {
        nextInput.focus();
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

  const handleTransactionTypeChange = (event) => {
    const selectedTransactionType = event.target.value;
    settransectionType(selectedTransactionType);
  };

  const handleTransactionTypeChange2 = (event) => {
    const selectedTransactionType = event.target.value;
    settransectionType2(selectedTransactionType);
  };

  const isLargeScreen = window.innerWidth > 1500;
  const contentStyle = {
    width: "100%",
    maxWidth: isSidebarVisible
      ? isLargeScreen
        ? "1270px"
        : "1000px"
      : isLargeScreen
        ? "1270px"
        : "1200px",
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

  // ================================================================
  // INDIVIDUAL COLUMN WIDTHS — 13 columns
  // (Mobile column added its own dedicated variable `mobileColWidth`)
  // ================================================================
  const firstColWidth = { width: "40px" };
  const secondColWidth = { width: "80px" };
  const thirdColWidth = { width: "90px" };
  const fourthColWidth = {
  width: isSidebarVisible
    ? (isLargeScreen ? "310px" : "90px")
    : (isLargeScreen ? "310px" : "240px"),
  };
  const mobileColWidth = { width: "110px" };
  const fifthColWidth = { width: "80px" };
  const sixthColWidth = {
  width: isSidebarVisible
    ? (isLargeScreen ? "90px" : "85px")
    : (isLargeScreen ? "90px" : "90px"),
  };
   const eighthColWidth = {
  width: isSidebarVisible
    ? (isLargeScreen ? "90px" : "85px")
    : (isLargeScreen ? "90px" : "90px"),
  };
  const ninthColWidth = { width: "85px" };
  const tenthColWidth = {
  width: isSidebarVisible
    ? (isLargeScreen ? "90px" : "85px")
    : (isLargeScreen ? "90px" : "90px"),
  };
   const eleventhColWidth = {
  width: isSidebarVisible
    ? (isLargeScreen ? "90px" : "85px")
    : (isLargeScreen ? "90px" : "90px"),
  };
    const twelfthColWidth = {
  width: isSidebarVisible
    ? (isLargeScreen ? "90px" : "85px")
    : (isLargeScreen ? "90px" : "90px"),
  };
  const sixColWidth = { width: "8px" };

  useHotkeys(
    "alt+s",
    () => {
      fetchDailyStatusReport();
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

  // ================================================================
  // SORT STATE — Sr added
  // ================================================================
  const [columns, setColumns] = useState({
    Sr: [],
    Code: [],
    Manual: [],
    Customer: [],
    Mobile: [],
    PrmDate: [],
    InsAmt: [],
    Receivable: [],
    LastDate: [],
    Collection: [],
    Outstanding: [],
    Balance: [],
  });
  const [columnSortOrders, setColumnSortOrders] = useState({
    Sr: "",
    Code: "",
    Manual: "",
    Customer: "",
    Mobile: "",
    PrmDate: "",
    InsAmt: "",
    Receivable: "",
    LastDate: "",
    Collection: "",
    Outstanding: "",
    Balance: "",
  });

  useEffect(() => {
    if (tableData.length > 0) {
      const newColumns = {
        Sr: tableData.map((_, i) => i + 1),
        Code: tableData.map((row) => row.Code),
        Manual: tableData.map((row) => row.Manual),
        Customer: tableData.map((row) => row.Customer),
        Mobile: tableData.map((row) => row.Mobile),
        PrmDate: tableData.map((row) => row.PrmDate),
        InsAmt: tableData.map((row) => row.InsAmt),
        Receivable: tableData.map((row) => row.Receivable),
        LastDate: tableData.map((row) => row.LastDate),
        Collection: tableData.map((row) => row.Collection),
        Outstanding: tableData.map((row) => row.Outstanding),
        Balance: tableData.map((row) => row.Balance),
      };
      setColumns(newColumns);
    }
  }, [tableData]);

  const handleSorting = (col) => {
    const currentOrder = columnSortOrders[col];
    const newOrder = currentOrder === "ASC" ? "DSC" : "ASC";

    // Special case: Sr is purely index-based, sort on row position.
    if (col === "Sr") {
      const sortedData = [...tableData].sort((a, b) => {
        const aIdx = tableData.indexOf(a) + 1;
        const bIdx = tableData.indexOf(b) + 1;
        return newOrder === "ASC" ? aIdx - bIdx : bIdx - aIdx;
      });

      setTableData(sortedData);

      setColumnSortOrders((prev) => ({
        ...Object.keys(prev).reduce((acc, key) => {
          acc[key] = key === col ? newOrder : null;
          return acc;
        }, {}),
      }));
      return;
    }

    const sortedData = [...tableData].sort((a, b) => {
      let aVal = a[col] ?? "";
      let bVal = b[col] ?? "";

      aVal = aVal.toString();
      bVal = bVal.toString();

      // CODE SORT (13-01-0005)
      if (col === "Code") {
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

      // Numeric sorting
      const numA = parseFloat(aVal.replace(/,/g, ""));
      const numB = parseFloat(bVal.replace(/,/g, ""));

      if (!isNaN(numA) && !isNaN(numB)) {
        return newOrder === "ASC" ? numA - numB : numB - numA;
      }

      // String sorting
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
      Sr: null,
      Code: null,
      Manual: null,
      Customer: null,
      Mobile: null,
      PrmDate: null,
      InsAmt: null,
      Receivable: null,
      LastDate: null,
      Collection: null,
      Outstanding: null,
      Balance: null,
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

  const [menuStoreIsOpen, setMenuStoreIsOpen] = useState(false);

  const focusNextElement = (currentRef, nextRef) => {
    if (currentRef.current && nextRef.current) {
      currentRef.current.focus();
      nextRef.current.focus();
    }
  };

  const handleToDateEnter = (e) => {
    if (e.key === "Enter") {
      if (e.key !== "Enter") return;
      e.preventDefault();

      const inputDate = e.target.value;
      const formattedDate = inputDate.replace(
        /^(\d{2})(\d{2})(\d{4})$/,
        "$1-$2-$3",
      );

      if (
        !/^(0[1-9]|[12][0-9]|3[01])-(0[1-9]|1[0-2])-\d{4}$/.test(formattedDate)
      ) {
        toast.error("Date must be in the format dd-mm-yyyy");
        return;
      }

      const [day, month, year] = formattedDate.split("-").map(Number);
      const enteredDate = new Date(year, month - 1, day);
      const daysInMonth = new Date(year, month, 0).getDate();

      if (month < 1 || month > 12 || day < 1 || day > daysInMonth) {
        toast.error("Invalid date. Please check the day and month.");
        return;
      }
      if (enteredDate > GlobaltoDate) {
        toast.error(`Date must be before ${GlobaltoDate1}`);
        return;
      }

      e.target.value = formattedDate;
      settoInputDate(formattedDate);

      focusNextElement(toRef, saleSelectRef);
    }
  };

  const handleStoreEnter = (e) => {
    if (e.key === "Enter" && !menuStoreIsOpen) {
      e.preventDefault();
      focusNextElement(storeRef, selectButtonRef);
    }
  };

  const handleSearchEnter = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      focusNextElement(searchRef, selectButtonRef);
    }
  };

  const formatValue = (val) => {
    return Number(val) === 0 ? "" : val;
  };

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
          <NavComponent textdata="ToDateOutstanding Report" />

          {/* ------------1st row */}
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
                style={{ marginLeft: "5px" }}
              >
                <div
                  style={{
                    width: "90px",
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
                style={{ marginLeft: "28px" }}
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
                    onKeyDown={(e) => handleToKeyPress(e, collectorRef)}
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

              {/* CUSTOMER DROPDOWN SELECT */}

              <div
                className="d-flex align-items-center"
                style={{ marginRight: "21px" }}
              >
                <div
                  style={{
                    marginLeft: "10px",
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
                      Cust Type :
                    </span>
                  </label>
                </div>

                <div style={{ marginLeft: "3px" }}>
                  <Select
                    className="List-select-class"
                    ref={CustomerRef}
                    options={customerOption}
                    onKeyDown={(e) =>
                      handleCustomerSelectKeypress(e, input4Ref)
                    }
                    id="selectedsale"
                    onChange={(selectedOption) => {
                      if (selectedOption && selectedOption.value) {
                        const labelPart = selectedOption.label.split("-")[1];

                        setCustomerselectdata(selectedOption.value);
                        setCustomerselectdatavalue({
                          value: selectedOption.value,
                          label: labelPart,
                        });
                      } else {
                        setCustomerselectdata("");
                        setCustomerselectdatavalue("");
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
                      ...customStyles1(!Customerselectdata),
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

          {/* //////////////// second ROW ///////////////////////// */}

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
                style={{ marginLeft: "15px" }}
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
                        fontFamily: getfontstyle,
                        fontSize: getdatafontsize,
                        fontWeight: "bold",
                      }}
                    >
                      Collector :
                    </span>{" "}
                    <br />
                  </label>
                </div>
                <div style={{ marginLeft: "5px" }}>
                  <Select
                    className="List-select-class"
                    ref={collectorRef}
                    options={Collectoroption}
                    onKeyDown={(e) => handleSaleKeypress(e, CustomerRef)}
                    id="selectedsale"
                    onChange={(selectedOption) => {
                      if (selectedOption && selectedOption.value) {
                        const labelPart = selectedOption.label.split("-")[1];
                        setCollector(selectedOption.value);
                        setCollectorDataValue({
                          value: selectedOption.value,
                          label: labelPart,
                        });
                      } else {
                        setCollector("");
                        setCollectorDataValue("");
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

              {/* CUSTOMER DROPDOWN SELECT */}

              <div
                className="d-flex align-items-center"
                style={{ marginRight: "21px" }}
              >
                <div
                  style={{
                    marginLeft: "10px",
                    width: "80px",
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
                    ref={input4Ref}
                    onKeyDown={(e) => handleKeyPress(e, input5Ref)}
                    id="submitButton"
                    name="type"
                    onFocus={(e) =>
                      (e.currentTarget.style.border = "4px solid red")
                    }
                    onBlur={(e) =>
                      (e.currentTarget.style.border = `1px solid ${fontcolor}`)
                    }
                    value={transectionType2}
                    onChange={handleTransactionTypeChange2}
                    style={{
                      width: "220px",
                      height: "24px",
                      marginLeft: "5px",
                      backgroundColor: getcolor,
                      border: `1px solid ${fontcolor}`,
                      fontSize: getdatafontsize,
                      fontFamily: getfontstyle,
                      color: fontcolor,
                      paddingLeft: "12px",
                    }}
                  >
                    <option value="">ALL</option>
                    <option value="N">NILL COLLECTION</option>
                    <option value="A">ADVANCE</option>
                    <option value="L">LESS OUTSTANDING</option>
                    <option value="E">EXPIRED ACCOUNT</option>
                    <option value="C">CLOSE</option>
                  </select>

                  {transectionType2 !== "" && (
                    <span
                      onClick={() => settransectionType2("")}
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

          <div>
            {/* Table Head — 13 columns (Mobile added, Sr sortable) */}
            <div style={{ overflowY: "auto" }}>
              <table
                className="myTable"
                id="table"
                style={{
                  fontSize: getdatafontsize,
                  fontFamily: getfontstyle,
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
                    backgroundColor: tableHeadColor,
                  }}
                >
                  <tr
                    style={{
                      backgroundColor: tableHeadColor,
                      color: "white",
                    }}
                  >
                    {/* Sr — now sortable */}
                    <td
                      className="border-dark"
                      style={firstColWidth}
                      onClick={() => handleSorting("Sr")}
                    >
                      Sr{" "}
                      <i
                        className="fa-solid fa-caret-down caretIconStyle"
                        style={getIconStyle("Sr")}
                      ></i>
                    </td>

                    <td
                      className="border-dark"
                      style={secondColWidth}
                      onClick={() => handleSorting("Code")}
                    >
                      Code{" "}
                      <i
                        className="fa-solid fa-caret-down caretIconStyle"
                        style={getIconStyle("Code")}
                      ></i>
                    </td>

                    <td
                      className="border-dark"
                      style={thirdColWidth}
                      onClick={() => handleSorting("Manual")}
                    >
                      Manual{" "}
                      <i
                        className="fa-solid fa-caret-down caretIconStyle"
                        style={getIconStyle("Manual")}
                      ></i>
                    </td>

                    <td
                      className="border-dark"
                      style={fourthColWidth}
                      onClick={() => handleSorting("Customer")}
                    >
                      Customer{" "}
                      <i
                        className="fa-solid fa-caret-down caretIconStyle"
                        style={getIconStyle("Customer")}
                      ></i>
                    </td>

                    {/* NEW Mobile column */}
                    <td
                      className="border-dark"
                      style={mobileColWidth}
                      onClick={() => handleSorting("Mobile")}
                    >
                      Mobile{" "}
                      <i
                        className="fa-solid fa-caret-down caretIconStyle"
                        style={getIconStyle("Mobile")}
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
                      style={sixthColWidth}
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
                      style={eighthColWidth}
                      onClick={() => handleSorting("Receivable")}
                    >
                      Recei{" "}
                      <i
                        className="fa-solid fa-caret-down caretIconStyle"
                        style={getIconStyle("Receivable")}
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
                      style={tenthColWidth}
                      onClick={() => handleSorting("Collection")}
                    >
                      Collection{" "}
                      <i
                        className="fa-solid fa-caret-down caretIconStyle"
                        style={getIconStyle("Collection")}
                      ></i>
                    </td>

                    <td
                      className="border-dark"
                      style={eleventhColWidth}
                      onClick={() => handleSorting("Outstanding")}
                    >
                      Outsta{" "}
                      <i
                        className="fa-solid fa-caret-down caretIconStyle"
                        style={getIconStyle("Outstanding")}
                      ></i>
                    </td>

                    <td
                      className="border-dark"
                      style={twelfthColWidth}
                      onClick={() => handleSorting("Balance")}
                    >
                      Balance{" "}
                      <i
                        className="fa-solid fa-caret-down caretIconStyle"
                        style={getIconStyle("Balance")}
                      ></i>
                    </td>

                    <td className="border-dark" style={sixColWidth}></td>
                  </tr>
                </thead>
              </table>
            </div>

            {/* Table Body */}
            <div
              className="table-scroll"
              style={{
                backgroundColor: textColor,
                borderBottom: `1px solid ${fontcolor}`,
                overflowY: "auto",
                height: "45vh",
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
                  ...(tableData.length > 0 ? { tableLayout: "fixed" } : {}),
                }}
              >
                <tbody id="tablebody">
                  {isLoading ? (
                    <>
                      <tr style={{ backgroundColor: getcolor }}>
                        <td colSpan="13" className="text-center">
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
                            {Array.from({ length: 12 }).map((_, colIndex) => (
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
                        <td style={fourthColWidth}></td>
                        <td style={mobileColWidth}></td>
                        <td style={fifthColWidth}></td>
                        <td style={sixthColWidth}></td>
                        <td style={eighthColWidth}></td>
                        <td style={ninthColWidth}></td>
                        <td style={tenthColWidth}></td>
                        <td style={eleventhColWidth}></td>
                        <td style={twelfthColWidth}></td>
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
                            <td
                              className="text-center"
                              style={firstColWidth}
                            >
                              {i + 1}
                            </td>

                            {/* Code — double-click removed */}
                            <td
                              className="text-center"
                              style={{
                                ...secondColWidth,
                                color:  selectedIndex === i ? "white" : fontcolor,
                              }}
                            >
                              {item.Code}
                            </td>

                            <td className="text-start" style={thirdColWidth}>
                              {item.ManualNo}
                            </td>

                            <td
                              className="text-start"
                              title={item.Customer}
                              style={{
                                ...fourthColWidth,
                                whiteSpace: "nowrap",
                                overflow: "hidden",
                                textOverflow: "ellipsis",
                              }}
                            >
                              {item.Customer}
                            </td>

                            {/* NEW Mobile column */}
                           <td
  className="text-start"
  title={item.Mobile}
  style={{
    ...mobileColWidth,
    whiteSpace: "nowrap",
    overflow: "hidden",
    textOverflow: "ellipsis",
  }}
>
  {item.Mobile}
  {item.Mobile && (
  <a
    href={`https://wa.me/${String(item.Mobile).replace(/\D/g, "").replace(/^0/, "92")}`}
    target="_blank"
    rel="noopener noreferrer"
    style={{
      marginLeft: "5px",
      color: "#25D366",
      textDecoration: "none",
      display: "inline-block",
      lineHeight: "0.1",
      marginTop: "0px",
      marginBottom: "0px",
      cursor: "pointer",
    }}
    title="Chat on WhatsApp"
  >
    <FaWhatsapp
      style={{
        fontSize: "16px",
        verticalAlign: "middle",
      }}
    />
  </a>
)}
</td>



                            <td className="text-center" style={fifthColWidth}>
                              {item.PrmDate}
                            </td>

                            <td className="text-end" style={sixthColWidth}>
                              {item.InsAmt}
                            </td>

                            <td className="text-end" style={eighthColWidth}>
                              {item.Receivable}
                            </td>

                            <td className="text-end" style={ninthColWidth}>
                              {item.LastDate}
                            </td>

                            <td className="text-end" style={tenthColWidth}>
                              {item.Collection}
                            </td>

                            <td className="text-end" style={eleventhColWidth}>
                              {item.Outstanding}
                            </td>

                            <td className="text-end" style={twelfthColWidth}>
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
                          {Array.from({ length: 12 }).map((_, colIndex) => (
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
                        <td style={fourthColWidth}></td>
                        <td style={mobileColWidth}></td>
                        <td style={fifthColWidth}></td>
                        <td style={sixthColWidth}></td>
                        <td style={eighthColWidth}></td>
                        <td style={ninthColWidth}></td>
                        <td style={tenthColWidth}></td>
                        <td style={eleventhColWidth}></td>
                        <td style={twelfthColWidth}></td>
                      </tr>
                    </>
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* Table Footer */}
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
                marginLeft: "2px",
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
                ...fourthColWidth,
                background: getcolor,
                borderRight: `1px solid ${fontcolor}`,
              }}
            ></div>
            <div
              style={{
                ...mobileColWidth,
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
            >
              <span className="mobileledger_total">
                {formatValue(totalIns)}
              </span>
            </div>
            <div
              style={{
                ...eighthColWidth,
                background: getcolor,
                borderRight: `1px solid ${fontcolor}`,
              }}
            >
              <span className="mobileledger_total">
                {formatValue(totalReceive)}
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
                ...tenthColWidth,
                background: getcolor,
                borderRight: `1px solid ${fontcolor}`,
              }}
            >
              <span className="mobileledger_total">
                {formatValue(totalCollection)}
              </span>
            </div>
            <div
              style={{
                ...eleventhColWidth,
                background: getcolor,
                borderRight: `1px solid ${fontcolor}`,
              }}
            >
              <span className="mobileledger_total">
                {formatValue(totalOutstan)}
              </span>
            </div>
            <div
              style={{
                ...twelfthColWidth,
                background: getcolor,
                borderRight: `1px solid ${fontcolor}`,
              }}
            >
              <span className="mobileledger_total">
                {formatValue(totalBalance)}
              </span>
            </div>
          </div>

          {/* Action Buttons */}
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
              ref={input5Ref}
              onClick={() => {
                fetchDailyStatusReport();
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
