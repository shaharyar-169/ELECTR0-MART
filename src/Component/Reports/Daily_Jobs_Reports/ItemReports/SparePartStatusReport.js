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
import { Description, Store } from "@mui/icons-material";


export default function SparePartsStatusReport() {
  const navigate = useNavigate();
  const user = getUserData();
  const organisation = getOrganisationData();
  const saleSelectRef = useRef(null);
  const toRef = useRef(null);
  const fromRef = useRef(null);
  const companyRef = useRef(null);
  const categoryRef = useRef(null);
  const capacityRef = useRef(null);
  const employeeref = useRef(null);
  const storeRef = useRef(null);
  const typeRef = useRef(null);
  const searchRef = useRef(null);
  const selectButtonRef = useRef(null);

  const [saleType, setSaleType] = useState("");
  const [storeType, setStoreType] = useState("");

  const input1Ref = useRef(null);
  const input2Ref = useRef(null);
  const input3Ref = useRef(null);
  const input4Refrate = useRef(null);
  const input5Ref = useRef(null);
  const input4Ref = useRef(null);
  const input6Ref = useRef(null);
  const saleSelectRef1 = useRef(null)

  const [Companyselectdata, setCompanyselectdata] = useState("");

  console.log("Companyselectdata", Companyselectdata);
  const [Companyselectdatavalue, setCompanyselectdatavalue] = useState("");

  const [Capacityselectdata, setCapacityselectdata] = useState("");
  const [capacityselectdatavalue, setcapacityselectdatavalue] = useState("");

   const [Storeselectdata, setStoreselectdata] = useState("");
  const [Storeselectdatavalue, setStoreselectdatavalue] = useState("");

  const [GetCapacity, setGetCapacity] = useState([]);
  const [GetCompany, setGetCompany] = useState([]);
  const [Categoryselectdata, setCategoryselectdata] = useState("");
  const [categoryselectdatavalue, setcategoryselectdatavalue] = useState("");

  const [GetCategory, setGetCategory] = useState([]);

  const [Typeselectdata, setTypeselectdata] = useState("");
  const [typeselectdatavalue, settypeselectdatavalue] = useState("");

  const [storeList, setstoreList] = useState([]);

  const [sortData, setSortData] = useState("ASC");

  const [searchQuery, setSearchQuery] = useState("");
  const [transectionType, settransectionType] = useState("A");
  const [transectionType2, settransectionType2] = useState("");

  const [totalqnty, settotalqnty] = useState(0);
  const [totalexcel, settotalexcel] = useState(0);
  const [totaltax, settotaltax] = useState(0);
  const [totalincl, settotalincl] = useState(0);

  const [totalOpening, settotalOpening] = useState(0);
  const [totalPurchase, settotalPurchase] = useState(0);
  const [totalPurRet, settotalPurRet] = useState(0);
  const [totalreceive, settotalreceive] = useState(0);
  const [totalIssue, settotalIssue] = useState(0);
  const [totalSale, settotalSale] = useState(0);
  const [totalSaleRet, settotalSaleRet] = useState(0);
  const [totalQnty, settotalQnty] = useState(0);

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
      date.getMonth() + 1
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

        if (saleSelectRef.current) {
          e.preventDefault();
          saleSelectRef.current.focus();
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
      //    case !saleType:
      //        errorType = "saleType";
      //        break;
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

    const apiUrl = apiLinks + "/SparePartsStatusReport.php";
    setIsLoading(true);
    const formData = new URLSearchParams({
      FIntDat: fromInputDate,
      FFnlDat: toInputDate,
      FCtgCod: Categoryselectdata,
      FSchTxt: searchQuery,
      FCmpCod: Companyselectdata,
      FStrCod: Storeselectdata,
      FCapCod: Capacityselectdata,
      code: organisation.code,
      FLocCod: locationnumber || getLocationNumber,
      FYerDsc: yeardescription || getyeardescription,
      // code: "MULTITRD",
      // FLocCod: "001",
      // FYerDsc: "2025-2026",
    }).toString();

    axios
      .post(apiUrl, formData)
      .then((response) => {
        setIsLoading(false);

        settotalOpening(response.data["Total Opening"]);
        settotalPurchase(response.data["Total Purchase"]);
        settotalPurRet(response.data["Total Pur-Ret"]);
        settotalreceive(response.data["Total Receive"]);
        settotalIssue(response.data["Total Issue"]);
        settotalSale(response.data["Total Sale"]);
        settotalSaleRet(response.data["Total Sale-Ret"]);
        settotalQnty(response.data["Total Qnty"]);

        if (response.data && Array.isArray(response.data.Detail)) {
          setTableData(response.data.Detail);
        } else {
          console.warn(
            "Response data structure is not as expected:",
            response.data.Detail
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
    const apiUrl = apiLinks + "/GetCompany.php";
    const formData = new URLSearchParams({
      code: organisation.code,
    }).toString();
    axios
      .post(apiUrl, formData)
      .then((response) => {
        if (response.data && Array.isArray(response.data)) {
          setGetCompany(response.data);
        } else {
          console.warn(
            "Response data structure is not as expected:",
            response.data
          );
          setGetCompany([]);
        }
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  }, []);
  const options = GetCompany.map((item) => ({
    value: item.tcmpcod,
    label: `${item.tcmpcod}-${item.tcmpdsc.trim()}`,
  }));

  useEffect(() => {
    const apiUrl = apiLinks + "/GetCatg.php";
    const formData = new URLSearchParams({
      code: organisation.code,
    }).toString();
    axios
      .post(apiUrl, formData)
      .then((response) => {
        if (response.data && Array.isArray(response.data)) {
          setGetCategory(response.data);
        } else {
          console.warn(
            "Response data structure is not as expected:",
            response.data
          );
          setGetCategory([]);
        }
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  }, []);

  const categoryoptions = GetCategory.map((item) => ({
    value: item.tctgcod,
    label: `${item.tctgcod}-${item.tctgdsc.trim()}`,
  }));

   useEffect(() => {
    const apiUrl = apiLinks + "/GetCapacity.php";
    const formData = new URLSearchParams({
      code: organisation.code,
    }).toString();
    axios
      .post(apiUrl, formData)
      .then((response) => {
        if (response.data && Array.isArray(response.data)) {
          setGetCapacity(response.data);
        } else {
          console.warn(
            "Response data structure is not as expected:",
            response.data
          );
          setGetCapacity([]);
        }
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  }, []);

  const capacityoptions = GetCapacity.map((item) => ({
    value: item.tcapcod,
    label: `${item.tcapcod}-${item.tcapdsc.trim()}`,
  }));

   useEffect(() => {
          const apiUrl = apiLinks + "/GetActiveStore.php";
          const formData = new URLSearchParams({
              FLocCod: getLocationNumber,
              code: organisation.code,
          }).toString();
          axios
              .post(apiUrl, formData)
              .then((response) => {
                  setstoreList(response.data);
              })
              .catch((error) => {
                  console.error("Error fetching data:", error);
              });
      }, []);
     
      const storeoption = storeList.map((item) => ({
          value: item.tstrcod,
          label: `${item.tstrcod}-${item.tstrdsc.trim()}`,
      }));

       const handleStoreKeypress = (event, inputId) => {
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
      borderColor: "red",            // ✅ changed to red
      boxShadow: "0 0 0 1px red",   // ✅ changed to red
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
    transform: state.selectProps.menuIsOpen ? "rotate(180deg)" : "rotate(0deg)",
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



const exportPDFHandler = () => {
  // Create a new jsPDF instance with landscape orientation
  const doc = new jsPDF({ orientation: "landscape" });

  // --- Define table data (unchanged) ---
  const rows = tableData.map((item) => [
    item.Code,
    item.Description,
    formatValue(item.Opening),
    formatValue(item.Purchase),
    formatValue(item["Pur-Ret"]),
    formatValue(item.Receive),
    formatValue(item.Issue),
    formatValue(item.Sale),
    formatValue(item["Sale-Ret"]),
    formatValue(item.Balance),
  ]);

  // Total row
  rows.push([
    String(formatValue(tableData.length.toLocaleString())),
    "",
    String(formatValue(totalOpening)),
    String(formatValue(totalPurchase)),
    String(formatValue(totalPurRet)),
    String(formatValue(totalreceive)),
    String(formatValue(totalIssue)),
    String(formatValue(totalSale)),
    String(formatValue(totalSaleRet)),
    String(formatValue(totalQnty)),
  ]);

  // --- Table headers and column widths ---
  const headers = [
    "Code",
    "Description",
    "Opening",
    "Purchase",
    "Pur Ret",
    "Rece",
    "Issue",
    "Sale",
    "Sl-Ret",
    "Bal",
  ];

  const leftMargin = 10;
  const columnWidths = [20, 80, 25, 25, 20, 20, 20, 25, 20, 25];
  const totalWidth = columnWidths.reduce((acc, w) => acc + w, 0);

  const pageHeight = doc.internal.pageSize.height;
  const paddingTop = 15;

  // --- Helper: Draw table headers ---
  const addTableHeaders = (startX, startY) => {
    doc.setFont("verdana", "bold");
    doc.setFontSize(10);
    let currentX = startX;
    headers.forEach((header, index) => {
      const cellWidth = columnWidths[index];
      const cellHeight = 6;
      doc.setFillColor(200, 200, 200);
      doc.rect(currentX, startY, cellWidth, cellHeight, "F");
      doc.setLineWidth(0.2);
      doc.rect(currentX, startY, cellWidth, cellHeight);
      doc.setTextColor(0);
      doc.text(header, currentX + cellWidth / 2, startY + cellHeight / 2 + 1.5, {
        align: "center",
      });
      currentX += cellWidth;
    });
  };

  // --- Helper: Draw footer line and Crystal Solution text (with 14 mm bottom margin) ---
  const drawFooter = () => {
    const lineY = pageHeight - 14;    // line 14 mm from bottom
    const lineX = leftMargin;
    doc.setLineWidth(0.3);
    doc.line(lineX, lineY, lineX + totalWidth, lineY);
    doc.setFont("verdana-regular", "normal");
    doc.setFontSize(10);
    // text placed 5 mm above the line, so at pageHeight - 9
    doc.text(`Crystal Solution    ${date}    ${time}`, lineX + 2, lineY + 5);
  };

  // --- Helper: Draw a single row (unchanged) ---
  const drawRow = (startX, startY, rowIndex, rowData, isTotalRow = false) => {
    const rowHeightBase = 5;
    const fontSize = 10;
    doc.setFontSize(fontSize);

    const descriptionText = String(rowData[1]);
    const descriptionWidth = columnWidths[1];
    const descriptionLines = doc.splitTextToSize(descriptionText, descriptionWidth - 4);
    const lineCount = Math.max(1, descriptionLines.length);
    const rowHeight = rowHeightBase * lineCount;

    if (rowIndex % 2 !== 0 && !isTotalRow) {
      doc.setFillColor(240);
      doc.rect(startX, startY, totalWidth, rowHeight, "F");
    }

    if (isTotalRow) {
      doc.setLineWidth(0.3);
      doc.line(startX, startY, startX + totalWidth, startY);
      doc.line(startX, startY + 0.5, startX + totalWidth, startY + 0.5);
      doc.line(startX, startY + rowHeight, startX + totalWidth, startY + rowHeight);
      doc.line(startX, startY + rowHeight - 0.5, startX + totalWidth, startY + rowHeight - 0.5);
      doc.setLineWidth(0.2);
      doc.line(startX, startY, startX, startY + rowHeight);
      doc.line(startX + totalWidth, startY, startX + totalWidth, startY + rowHeight);
    } else {
      doc.setLineWidth(0.2);
      doc.rect(startX, startY, totalWidth, rowHeight);
    }

    let currentX = startX;
    for (let i = 0; i < columnWidths.length; i++) {
      doc.line(currentX, startY, currentX, startY + rowHeight);
      currentX += columnWidths[i];
    }

    currentX = startX;
    rowData.forEach((cell, colIndex) => {
      const cellValue = String(cell);
      const cellWidth = columnWidths[colIndex];
      const isNumericCol = colIndex >= 2 && colIndex <= 9;
      const isCodeCol = colIndex === 0;

      let align = "left";
      if (isNumericCol) align = "right";
      else if (isCodeCol) align = "center";

      let textX = currentX;
      if (align === "right") textX = currentX + cellWidth - 2;
      else if (align === "center") textX = currentX + cellWidth / 2;
      else textX = currentX + 2;

      let lines;
      if (colIndex === 1) {
        lines = descriptionLines;
      } else {
        lines = doc.splitTextToSize(cellValue, cellWidth - 4);
      }

      const isRedRow = !isTotalRow && rowData[0] && parseInt(rowData[0]) > 10000000000;
      if (isRedRow) {
        doc.setTextColor(255, 0, 0);
      } else {
        doc.setTextColor(0, 0, 0);
      }

      if (!isTotalRow) {
        doc.setFont("verdana-regular", "normal");
      } else {
        doc.setFont("verdana", "bold");
        // Center the first column of total row
        if (colIndex === 0) align = "center";
      }

      for (let lineIdx = 0; lineIdx < lines.length; lineIdx++) {
        const lineY = startY + (lineIdx + 0.5) * rowHeightBase;
        doc.text(lines[lineIdx], textX, lineY, {
          align: align,
          baseline: "middle",
        });
      }

      currentX += cellWidth;
    });

    doc.setTextColor(0);
    if (isTotalRow) doc.setFont("verdana-regular", "normal");

    return startY + rowHeight;
  };

  // --- Helper: Add page content (title, labels, headers) ---
  const addPageContent = (startY) => {
    const addTitle = (title, y, fontSize = 18) => {
      doc.setFont("verdana-regular", "normal");
      doc.setFontSize(fontSize);
      doc.text(title, doc.internal.pageSize.width / 2, y, { align: "center" });
    };

    addTitle(comapnyname, startY, 18);
    startY += 5;
    addTitle(
      `Spare Part Status Report From ${fromInputDate} To ${toInputDate}`,
      startY,
      12
    );
    startY -= 5;

    const labelsX = leftMargin;
    const labelsY = startY + 4;

    let companydata = Companyselectdatavalue.label ? Companyselectdatavalue.label : "ALL";
    let categoydata = categoryselectdatavalue.label ? categoryselectdatavalue.label : "ALL";
    let Capacitydata = capacityselectdatavalue.label ? capacityselectdatavalue.label : "ALL";
    let Storedata = Storeselectdatavalue.label ? Storeselectdatavalue.label : "ALL";
    let search = searchQuery ? searchQuery : "";

    doc.setFont("verdana", "bold");
    doc.setFontSize(10);
    doc.text(`Company :`, labelsX, labelsY + 8.5);
    doc.setFont("verdana-regular", "normal");
    doc.text(`${companydata}`, labelsX + 25, labelsY + 8.5);

    doc.setFont("verdana", "bold");
    doc.text(`Capacity :`, labelsX + 180, labelsY + 8.5);
    doc.setFont("verdana-regular", "normal");
    doc.text(`${Capacitydata}`, labelsX + 205, labelsY + 8.5);

    doc.setFont("verdana", "bold");
    doc.text(`Category :`, labelsX, labelsY + 12.5);
    doc.setFont("verdana-regular", "normal");
    doc.text(`${categoydata}`, labelsX + 25, labelsY + 12.5);

    doc.setFont("verdana", "bold");
    doc.text(`Store :`, labelsX + 180, labelsY + 12.5);
    doc.setFont("verdana-regular", "normal");
    doc.text(`${Storedata}`, labelsX + 205, labelsY + 12.5);

    if (search) {
      doc.setFont("verdana", "bold");
      doc.text(`Search :`, labelsX + 200, labelsY + 16.8);
      doc.setFont("verdana-regular", "normal");
      doc.text(`${search}`, labelsX + 225, labelsY + 16.8);
    }

    startY += search ? 20 : 15;

    const headersStartY = search ? 39 : 34;
    addTableHeaders(leftMargin, headersStartY);

    return headersStartY + 6;
  };

  // --- Main pagination logic (dynamic, footer on every page) ---
  const handlePagination = () => {
    const rowHeightBase = 5;
    let pageNumber = 1;
    let currentY = paddingTop;
    let currentRowIndex = 0;

    // First page
    currentY = addPageContent(currentY);

    while (currentRowIndex < rows.length) {
      const descriptionText = String(rows[currentRowIndex][1]);
      const descriptionLines = doc.splitTextToSize(descriptionText, columnWidths[1] - 4);
      const lineCount = Math.max(1, descriptionLines.length);
      const rowHeight = rowHeightBase * lineCount;

      // Leave 14 mm bottom margin for the footer line and text
      if (currentY + rowHeight > pageHeight - 14) {
        // Draw footer on current page before adding new page
        drawFooter();
        doc.addPage();
        pageNumber++;
        currentY = paddingTop;
        currentY = addPageContent(currentY);
        // After new page, try the same row again
        continue;
      }

      const isTotalRow = currentRowIndex === rows.length - 1;
      currentY = drawRow(leftMargin, currentY, currentRowIndex, rows[currentRowIndex], isTotalRow);
      currentRowIndex++;
    }

    // After all rows, draw footer on the last page
    drawFooter();
  };

  // --- Date/time helpers ---
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

  // Generate all pages
  handlePagination();

  // --- Now add page numbers (Page X / Y) on every page, aligned with footer text ---
  const totalPages = doc.getNumberOfPages();
  for (let p = 1; p <= totalPages; p++) {
    doc.setPage(p);
    doc.setFont("verdana-regular", "normal");
    doc.setFontSize(10);
    // Position at bottom right, same Y as footer text (pageHeight - 9)
    doc.text(
      `Page ${p} / ${totalPages}`,
      doc.internal.pageSize.width - 10,
      pageHeight - 9,
      { align: "right" }
    );
  }

  doc.save(`SparePartStatusReport As On ${date}.pdf`);
};

 const handleDownloadCSV = async () => {
  const workbook = new ExcelJS.Workbook();
  const worksheet = workbook.addWorksheet("Sheet1");

  const numColumns = 10;

  const columnAlignments = [
    "left",   // Code
    "left",   // Description
    "right",  // Opening
    "right",  // Purchase
    "right",  // Pur Ret
    "right",  // Receive
    "right",  // Issue
    "right",  // Sale
    "right",  // Sl-Ret
    "right",  // Balance
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
    cell.font = fontCompanyName;
    cell.alignment = { horizontal: "center" };
  });

  worksheet.getRow(companyRow.number).height = 30;
  worksheet.mergeCells(
    `A${companyRow.number}:${String.fromCharCode(65 + numColumns - 1)}${companyRow.number}`
  );

  const storeListRow = worksheet.addRow([
    `Spare Part Status Report From ${fromInputDate} To ${toInputDate}`,
  ]);
  storeListRow.eachCell((cell) => {
    cell.font = fontStoreList;
    cell.alignment = { horizontal: "center" };
  });

  worksheet.mergeCells(
    `A${storeListRow.number}:${String.fromCharCode(65 + numColumns - 1)}${storeListRow.number}`
  );

  worksheet.addRow([]);

  let typecompany = Companyselectdatavalue.label
    ? Companyselectdatavalue.label
    : "ALL";
  let typecapacity = capacityselectdatavalue.label
    ? capacityselectdatavalue.label
    : "ALL";
  let typecategory = categoryselectdatavalue.label
    ? categoryselectdatavalue.label
    : "ALL";
  let Storedata = Storeselectdatavalue.label
    ? Storeselectdatavalue.label
    : "ALL ";

  let RATE =
    transectionType === "P"
      ? "PURCHASE RATE"
      : transectionType == "M"
      ? "SM RATE"
      : transectionType == "A"
      ? "AVERAGE RATE"
      : transectionType == "W"
      ? "WEIGHTRD AVERAGE"
      : transectionType == "F"
      ? "FIFP"
      : "";

  let transectionsts =
    transectionType === "BIL"
      ? "PURCHASE"
      : transectionType == "SRN"
      ? "PURCHASE RETURN"
      : "PRN";

  let typesearch = searchQuery ? searchQuery : "";

  const typeAndStoreRow = worksheet.addRow([
    "Company :",
    typecompany,
    "",
    "",
    "",
    "",
    "Capacity :",
    typecapacity,
  ]);

  const typeAndStoreRow2 = worksheet.addRow([
    "Category :",
    typecategory,
    "",
    "",
    "",
    "",
    "Store :",
    Storedata,
  ]);

  const typeAndStoreRow4 = worksheet.addRow(
    searchQuery ? ["", "", "", "", "", "", "Search :", typesearch] : [""]
  );

  [typeAndStoreRow, typeAndStoreRow2, typeAndStoreRow4].forEach((row) => {
    row.eachCell((cell, colIndex) => {
      cell.font = {
        name: "CustomFont",
        size: 10,
        bold: [1, 7].includes(colIndex),
      };
      cell.alignment = { horizontal: "left", vertical: "middle" };
    });
  });

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
    "Description",
    "Opening",
    "Purchase",
    "Pur Rate",
    "Rece",
    "Issue",
    "Sale",
    "Sl-Rate",
    "Bal",
  ];

  const headerRow = worksheet.addRow(headers);
  headerRow.eachCell((cell) => Object.assign(cell, headerStyle));

  // Add data rows with numeric conversion
  tableData.forEach((item) => {
    const row = worksheet.addRow([
      item.Code,
      item.Description,
      toNumber(item.Opening),
      toNumber(item.Purchase),
      toNumber(item["Pur-Ret"]),
      toNumber(item.Receive),
      toNumber(item.Issue),
      toNumber(item.Sale),
      toNumber(item["Sale-Ret"]),
      toNumber(item.Balance),
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
      // Apply number format (no decimals) for columns 3 to 10
      if (colIndex >= 3 && colIndex <= 10) {
        cell.numFmt = "#,##0";
      }
    });
  });

  // =====================================================================
  // DYNAMIC WIDTH FOR DESCRIPTION COLUMN (unchanged)
  // =====================================================================
  worksheet.getColumn(2).eachCell({ includeEmpty: true }, (cell) => {
    if (cell.alignment) cell.alignment.wrapText = false;
    else cell.alignment = { wrapText: false };
  });

  const fontForMeasurement = "10px Calibri";
  const boldFontForMeasurement = "bold 10px Calibri";

  const getTextPixelWidth = (text, fontStyle) => {
    if (!text) return 0;
    const canvas = document.createElement("canvas");
    const context = canvas.getContext("2d");
    context.font = fontStyle;
    return context.measureText(text.toString()).width;
  };

  const pixelsToExcelWidth = (pixels) => {
    const paddingPx = 15;
    const pixelsPerUnit = 7;
    return (pixels + paddingPx) / pixelsPerUnit;
  };

  let maxPixels = getTextPixelWidth("Description", boldFontForMeasurement);
  let longestDescLength = "Description".length;

  tableData.forEach((item) => {
    const desc = item.Description ? item.Description.toString() : "";
    const w = getTextPixelWidth(desc, fontForMeasurement);
    if (w > maxPixels) maxPixels = w;
    if (desc.length > longestDescLength) longestDescLength = desc.length;
  });

  let descriptionWidth = pixelsToExcelWidth(maxPixels);
  const minExpectedWidth = longestDescLength * 0.8;
  if (descriptionWidth < minExpectedWidth) {
    descriptionWidth = longestDescLength * 1.1 + 2;
  }
  descriptionWidth = Math.max(descriptionWidth, 45);

  worksheet.getColumn(1).width = 10;
  worksheet.getColumn(2).width = descriptionWidth;
  worksheet.getColumn(3).width = 12;
  worksheet.getColumn(4).width = 12;
  worksheet.getColumn(5).width = 12;
  worksheet.getColumn(6).width = 12;
  worksheet.getColumn(7).width = 12;
  worksheet.getColumn(8).width = 12;
  worksheet.getColumn(9).width = 12;
  worksheet.getColumn(10).width = 12;
  // =====================================================================

  // Total row – convert totals to numbers and store count as number
  const totalRow = worksheet.addRow([
    tableData.length, // store as number
    "",
    toNumber(totalOpening),
    toNumber(totalPurchase),
    toNumber(totalPurRet),
    toNumber(totalreceive),
    toNumber(totalIssue),
    toNumber(totalSale),
    toNumber(totalSaleRet),
    toNumber(totalQnty),
  ]);

  totalRow.eachCell((cell, colNumber) => {
    cell.font = { bold: true };
    cell.border = {
      top: { style: "double" },
      left: { style: "thin" },
      bottom: { style: "double" },
      right: { style: "thin" },
    };

    if (colNumber > 2) {
      cell.alignment = { horizontal: "right" };
      cell.numFmt = "#,##0";
    }
    if (colNumber === 1) {
      cell.alignment = { horizontal: "center" };
      cell.numFmt = "#,##0";
    }
  });

  worksheet.addRow([]);

  // Get current date and time
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
  // FIX: was incorrectly using dateTimeRow.eachCell
  dateTimeRow1.eachCell((cell) => {
    cell.font = { name: "CustomFont" || "CustomFont", size: 10 };
    cell.alignment = { horizontal: "left" };
  });

  worksheet.mergeCells(
    `A${dateTimeRow.number}:${String.fromCharCode(65 + numColumns - 1)}${dateTimeRow.number}`
  );
  worksheet.mergeCells(
    `A${dateTimeRow1.number}:${String.fromCharCode(65 + numColumns - 1)}${dateTimeRow1.number}`
  );

  const buffer = await workbook.xlsx.writeBuffer();
  const blob = new Blob([buffer], {
    type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  });
  saveAs(blob, `SparePartStatusReport As On ${currentdate}.xlsx`);
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
  const handlecompanyKeypress = (event, inputId) => {
    if (event.key === "Enter") {
      const selectedOption = saleSelectRef.current.state.selectValue;
      if (selectedOption && selectedOption.value) {
        setCompanyselectdata(selectedOption.value);
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
  const handlecategoryKeypress = (event, inputId) => {
    if (event.key === "Enter") {
      const selectedOption = saleSelectRef.current.state.selectValue;
      if (selectedOption && selectedOption.value) {
        setCategoryselectdata(selectedOption.value);
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
  const handlecapacityKeypress = (event, inputId) => {
    if (event.key === "Enter") {
      const selectedOption = saleSelectRef.current.state.selectValue;
      if (selectedOption && selectedOption.value) {
        setCapacityselectdata(selectedOption.value);
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

  // const firstColWidth = {
  //     width: "10%",
  // };
  // const secondColWidth = {
  //     width: "30.6%",
  // };
  // const thirdColWidth = {
  //     width: "9%",
  // };
  // const forthColWidth = {
  //     width: "9%",
  // };
  // const fifthColWidth = {
  //     width: "9%",
  // };
  // const sixthColWidth = {
  //     width: "5%",
  // };
  // const seventhColWidth = {
  //     width: "9%",
  // };
  // const eighthColWidth = {
  //     width: "9%",
  // };
  // const ninthColWidth = {
  //     width: "9%",
  // };
  // const tenthColWidth = {
  //     width: "9%",
  // };

  const firstColWidth = {
    width: "60px",
  };
  const secondColWidth = {
    width: "360px",
  };
  const thirdColWidth = {
    width: "70px",
  };
  const forthColWidth = {
    width: "70px",
  };
  const fifthColWidth = {
    width: "70px",
  };
  const sixthColWidth = {
    width: "70px",
  };
  const seventhColWidth = {
    width: "70px",
  };
  const eightColWidth = {
    width: "70px",
  };
  const ninthColWidth = {
    width: "70px",
  };
  const tenthColWidth = {
    width: "70px",
  };

  const sixthcol = {
    width: "8px",
  };

  const [columns, setColumns] = useState({
    Code: [],
    Description: [],
    Opening: [],
    Purchase: [],
    ["Pur-Ret"]: [],
    Receive: [],
    Issue: [],
    Sale: [],
    ["Sale-Ret"]: [],
    Balance: [],
  });

  const [columnSortOrders, setColumnSortOrders] = useState({
    Code: "",
    Description: "",
    Opening: "",
    Purchase: "",
    ["Pur-Ret"]: "",
    Receive: "",
    Issue: "",
    Sale: "",
    ["Sale-Ret"]: "",
    Balance: "",
  });

  // When you receive your initial table data, transform it into column-oriented format
  useEffect(() => {
    if (tableData.length > 0) {
      const newColumns = {
        Code: tableData.map((row) => row.Code),
        Description: tableData.map((row) => row.Description),
        Opening: tableData.map((row) => row.Opening),
        Purchase: tableData.map((row) => row.Purchase),

        ["Pur-Ret"]: tableData.map((row) => row["Pur-Ret"]),
        Receive: tableData.map((row) => row.Receive),
        Issue: tableData.map((row) => row.Issue),
        Sale: tableData.map((row) => row.Sale),
        ["Sale-Ret"]: tableData.map((row) => row["Sale-Ret"]),
        Balance: tableData.map((row) => row.Balance),
      };
      setColumns(newColumns);
    }
  }, [tableData]);

  const getIconStyle = (colKey) => {
    const order = columnSortOrders[colKey];
    return {
      transform: order === "DSC" ? "rotate(180deg)" : "rotate(0deg)",
      color: order === "ASC" || order === "DSC" ? "red" : "white",
      transition: "transform 0.3s ease, color 0.3s ease",
    };
  };

  const resetSorting = () => {
    setColumnSortOrders({
      Code: null,
      Description: null,
      Opening: null,
      Purchase: null,
      ["Pur-Ret"]: null,
      Receive: null,
      Issue: null,
      Sale: null,
      ["Sale-Ret"]: null,
      Balance: null,
    });
  };

  const handleSorting = (col) => {
    const currentOrder = columnSortOrders[col];
    const newOrder = currentOrder === "ASC" ? "DSC" : "ASC";

    const sortedData = [...tableData].sort((a, b) => {
      const aVal =
        a[col] !== null && a[col] !== undefined ? a[col].toString() : "";
      const bVal =
        b[col] !== null && b[col] !== undefined ? b[col].toString() : "";

      // ⭐ SPECIAL CASE: Sort "Last Date" by YEAR
      if (col === "Last Date") {
        const aYear = parseInt(aVal.split("-")[2]) || 0; // Extract YYYY
        const bYear = parseInt(bVal.split("-")[2]) || 0;

        return newOrder === "ASC" ? aYear - bYear : bYear - aYear;
      }

      // ⭐ NORMAL NUMBER SORT
      const numA = parseFloat(aVal.replace(/,/g, ""));
      const numB = parseFloat(bVal.replace(/,/g, ""));

      if (!isNaN(numA) && !isNaN(numB)) {
        return newOrder === "ASC" ? numA - numB : numB - numA;
      }

      // ⭐ NORMAL STRING SORT
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

  useHotkeys(
    "alt+s",
    () => {
      fetchDailyStatusReport();
      resetSorting();
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
    width: "100%", // 100vw ki jagah 100%
    maxWidth: "1000px",
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
    fontSize: "10px",
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
        "$1-$2-$3"
      );

      // Basic format validation (dd-mm-yyyy)
      if (
        !/^(0[1-9]|[12][0-9]|3[01])-(0[1-9]|1[0-2])-\d{4}$/.test(formattedDate)
      ) {
        toast.error("Date must be in the format dd-mm-yyyy");
        return;
      }

      const [day, month, year] = formattedDate.split("-").map(Number);
      const enteredDate = new Date(year, month - 1, day);
      const daysInMonth = new Date(year, month, 0).getDate();

      // Validate month, day, and date range
      if (month < 1 || month > 12 || day < 1 || day > daysInMonth) {
        toast.error("Invalid date. Please check the day and month.");
        return;
      }
      if (enteredDate > GlobaltoDate) {
        toast.error(`Date must be before ${GlobaltoDate1}`);
        return;
      }

      // Update input value and state
      e.target.value = formattedDate;
      settoInputDate(formattedDate); // Update the state with formatted date

      // Move focus to the next element
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
            // width: "100%",
            border: `1px solid ${fontcolor}`,
            borderRadius: "9px",
          }}
        >
          <NavComponent textdata="Spare Part Status Report" />

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
              <div className="d-flex align-items-center" >
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
                        Capacity :
                      </span>
                    </label>
                  </div>
  
                  <div style={{ marginLeft: "3px" }}>
                    <Select
                      className="List-select-class "
                      ref={input2Ref}
                      options={capacityoptions}
                      onKeyDown={(e) => handlecapacityKeypress(e, saleSelectRef1)}
                      id="selectedsale2"
                      onChange={(selectedOption) => {
                        if (selectedOption && selectedOption.value) {
                          const labelPart = selectedOption.label.split("-")[1];
                          setCapacityselectdata(selectedOption.value);
                          setcapacityselectdatavalue({
                            value: selectedOption.value,
                            label: labelPart, // Set only the 'NGS' part of the label
                          });
                        } else {
                          setCapacityselectdata(""); // Clear the saleType state when selectedOption is null (i.e., when the selection is cleared)
                          setcapacityselectdatavalue("");
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
                        ...customStyles1(!Companyselectdata),
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
                className="d-flex align-items-center"
                style={{ marginLeft: "7px" }}
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
                      Company :
                    </span>
                  </label>
                </div>

                <div style={{ marginLeft: "3px" }}>
                  <Select
                    className="List-select-class"
                    ref={saleSelectRef}
                    options={options}
                    onKeyDown={(e) => handlecompanyKeypress(e, input1Ref)}
                    id="selectedsale"
                    onChange={(selectedOption) => {
                      if (selectedOption && selectedOption.value) {
                        const labelPart = selectedOption.label.split("-")[1];
                        setCompanyselectdata(selectedOption.value);
                        setCompanyselectdatavalue({
                          value: selectedOption.value,
                          label: labelPart,
                        });
                      } else {
                        setCompanyselectdata("");
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
                      ...customStyles1(!Companyselectdata),
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
                                className="d-flex align-items-center  "
                                style={{ marginRight: "21px" }}
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
                                            Store :
                                        </span>{" "}
                                        <br />
                                    </label>
                                </div>
                                <div style={{ marginLeft: "5px" }}>
                                    <Select
                                        className="List-select-class"
                                        ref={saleSelectRef1}
                                        options={storeoption}
                                        onKeyDown={(e) => handleStoreKeypress(e, 'searchsubmit')}
                                        id="selectedsale"
                                      
                                        onChange={(selectedOption) => {
  if (selectedOption && selectedOption.value) {

    // Split only once and remove the numeric prefix
    const description = selectedOption.label.split("-").slice(1).join("-");

    setStoreselectdata(selectedOption.value);

    setStoreselectdatavalue({
      value: selectedOption.value,
      label: description, // FG-STOCK / FG-HOLD
    });

  } else {
    setStoreselectdata("");
    setStoreselectdatavalue("");
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
                                            ...customStyles1(!Storeselectdata),
                                            placeholder: (base) => ({
                                                ...base,
                                                textAlign: "left",
                                                marginLeft: "0",
                                                justifyContent: "flex-start",
                                                color: fontcolor,
                                                marginTop: '-5px',
                                                
                                            })
                                        }}
                                        isClearable
                                        placeholder="ALL"
                                    />
                                </div>
                            </div>
            </div>
          </div>

           {/* //////////////// third ROW ///////////////////////// */}

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
                style={{ marginLeft: "7px" }}
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
                      Category :
                    </span>
                  </label>
                </div>

                <div style={{ marginLeft: "3px" }}>
                  <Select
                    className="List-select-class "
                    ref={input1Ref}
                    options={categoryoptions}
                    onKeyDown={(e) => handlecategoryKeypress(e, input2Ref)}
                    id="selectedsale"
                    onChange={(selectedOption) => {
                      if (selectedOption && selectedOption.value) {
                        const labelPart = selectedOption.label.split("-")[1];
                        setCategoryselectdata(selectedOption.value);
                        setcategoryselectdatavalue({
                          value: selectedOption.value,
                          label: labelPart, // Set only the 'NGS' part of the label
                        });
                      } else {
                        setCategoryselectdata(""); // Clear the saleType state when selectedOption is null (i.e., when the selection is cleared)
                        setcategoryselectdatavalue("");
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
                      ...customStyles1(!Companyselectdata),
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

              <div id="lastDiv" style={{ marginRight: "1px" }}>
                <label for="searchInput" style={{ marginRight: "3px" }}>
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
                    ref={input5Ref}
                    onKeyDown={(e) => handleKeyPress(e, selectButtonRef)}
                    type="text"
                    id="searchsubmit"
                    placeholder="Search"
                    value={searchQuery}
                    autoComplete="off"
                    style={{
                      marginRight: "20px",
                      width: "250px",
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
            {/* Table Head */}
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
                    <td
                      className="border-dark"
                      style={firstColWidth}
                      // onClick={() => handleSorting("Code")}
                    >
                      Code
                      {/* {" "}
                      <i
                        className="fa-solid fa-caret-down caretIconStyle"
                        style={getIconStyle("Code")}
                      ></i> */}
                    </td>
                    <td
                      className="border-dark"
                      style={secondColWidth}
                      onClick={() => handleSorting("Description")}
                    >
                      Description{" "}
                      <i
                        className="fa-solid fa-caret-down caretIconStyle"
                        style={getIconStyle("Description")}
                      ></i>
                    </td>
                    <td
                      className="border-dark"
                      style={thirdColWidth}
                      // onClick={() => handleSorting("Opening")}
                    >
                      Open
                      {/* {" "}
                      <i
                        className="fa-solid fa-caret-down caretIconStyle"
                        style={getIconStyle("Opening")}
                      ></i> */}
                    </td>
                    <td
                      className="border-dark"
                      style={forthColWidth}
                      // onClick={() => handleSorting("Purchase")}
                    >
                      Pur
                      {/* {" "}
                      <i
                        className="fa-solid fa-caret-down caretIconStyle"
                        style={getIconStyle("Purchase")}
                      ></i> */}
                    </td>

                    <td
                      className="border-dark"
                      style={fifthColWidth}
                      // onClick={() => handleSorting("Pur-Ret")}
                    >
                      P Rat
                      {/* {" "}
                      <i
                        className="fa-solid fa-caret-down caretIconStyle"
                        style={getIconStyle("Pur-Ret")}
                      ></i> */}
                    </td>
                    <td
                      className="border-dark"
                      style={sixthColWidth}
                      // onClick={() => handleSorting("Receive")}
                    >
                      Rece
                      {/* {" "}
                      <i
                        className="fa-solid fa-caret-down caretIconStyle"
                        style={getIconStyle("Receive")}
                      ></i> */}
                    </td>
                    <td
                      className="border-dark"
                      style={seventhColWidth}
                      // onClick={() => handleSorting("Issue")}
                    >
                      Issue
                      {/* {" "}
                      <i
                        className="fa-solid fa-caret-down caretIconStyle"
                        style={getIconStyle("Issue")}
                      ></i> */}
                    </td>
                    <td
                      className="border-dark"
                      style={eightColWidth}
                      // onClick={() => handleSorting("Sale")}
                    >
                      Sale
                      {/* {" "}
                      <i
                        className="fa-solid fa-caret-down caretIconStyle"
                        style={getIconStyle("Sale")}
                      ></i> */}
                    </td>
                    <td
                      className="border-dark"
                      style={ninthColWidth}
                      // onClick={() => handleSorting("Saleb-Rate")}
                    >
                      S Rat
                      {/* {" "}
                      <i
                        className="fa-solid fa-caret-down caretIconStyle"
                        style={getIconStyle("Sale-Ret")}
                      ></i> */}
                    </td>
                    <td
                      className="border-dark"
                      style={tenthColWidth}
                      // onClick={() => handleSorting("Balance")}
                    >
                      Bal
                      {/* {" "}
                      <i
                        className="fa-solid fa-caret-down caretIconStyle"
                        style={getIconStyle("Balance")}
                      ></i> */}
                    </td>
                    <td className="border-dark" style={sixthcol}></td>
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
                maxHeight: "45vh",
               
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
                        <td style={fifthColWidth}></td>
                        <td style={sixthColWidth}></td>
                        <td style={seventhColWidth}></td>
                        <td style={eightColWidth}></td>
                        <td style={ninthColWidth}></td>
                        <td style={tenthColWidth}></td>
                      </tr>
                    </>
                  ) : (
                    <>
                      {tableData.map((item, i) => {
                        totalEnteries += 1;
                        const isNegative =
                          item.Opening < 0 ||
                          item.Sale < 0 ||
                          item.Balance < 0 ||
                          item.Purchase < 0 ||
                          item.Receive < 0 ||
                          item["Pur-Ret"] < 0 ||
                          item["Sale-Ret"] < 0;

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
                              // color: fontcolor,
                              color: isNegative ? "red" : fontcolor,
                            }}
                          >
                            <td
                              className="text-center"
                              title={item.Code}
                              style={{
                                ...firstColWidth,
                                whiteSpace: "nowrap",
                                overflow: "hidden",
                                textOverflow: "ellipsis",
                              }}
                            >
                              {item.Code}
                            </td>
                            <td
                              className="text-start"
                              title={item.Description}
                              style={{
                                ...secondColWidth,
                                whiteSpace: "nowrap",
                                overflow: "hidden",
                                textOverflow: "ellipsis",
                              }}
                            >
                              {item.Description}
                            </td>
                            <td className="text-end" style={thirdColWidth}>
                              {formatValue(item.Opening)}
                            </td>
                            <td className="text-end" style={forthColWidth}>
                              {formatValue(item.Purchase)}
                            </td>
                            <td className="text-end" style={fifthColWidth}>
                              {formatValue(item["Pur-Ret"])}
                            </td>
                            <td className="text-end" style={sixthColWidth}>
                              {formatValue(item["Receive"])}
                            </td>
                            <td className="text-end" style={seventhColWidth}>
                              {formatValue(item["Issue"])}
                            </td>
                            <td className="text-end" style={eightColWidth}>
                              {formatValue(item["Sale"])}
                            </td>
                            <td className="text-end" style={ninthColWidth}>
                              {formatValue(item["Sale-Ret"])}
                            </td>
                            <td className="text-end" style={tenthColWidth}>
                              {formatValue(item["Balance"])}
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
                        <td style={fifthColWidth}></td>
                        <td style={sixthColWidth}></td>
                        <td style={seventhColWidth}></td>
                        <td style={eightColWidth}></td>
                        <td style={ninthColWidth}></td>
                        <td style={tenthColWidth}></td>
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
            >
              <span className="mobileledger_total">
                {formatValue(totalOpening)}
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
                {formatValue(totalPurchase)}
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
                {formatValue(totalPurRet)}
              </span>
            </div>
            <div
              style={{
                ...sixthColWidth,
                background: getcolor,
                borderRight: `1px solid ${fontcolor}`,
              }}
            >
              <span className="mobileledger_total">
                {formatValue(totalreceive)}
              </span>
            </div>
            <div
              style={{
                ...seventhColWidth,
                background: getcolor,
                borderRight: `1px solid ${fontcolor}`,
              }}
            >
              <span className="mobileledger_total">
                {formatValue(totalIssue)}
              </span>
            </div>
            <div
              style={{
                ...eightColWidth,
                background: getcolor,
                borderRight: `1px solid ${fontcolor}`,
              }}
            >
              <span className="mobileledger_total">
                {formatValue(totalSale)}
              </span>
            </div>
            <div
              style={{
                ...ninthColWidth,
                background: getcolor,
                borderRight: `1px solid ${fontcolor}`,
              }}
            >
              <span className="mobileledger_total">
                {formatValue(totalSaleRet)}
              </span>
            </div>
            <div
              style={{
                ...tenthColWidth,
                background: getcolor,
                borderRight: `1px solid ${fontcolor}`,
              }}
            >
              <span className="mobileledger_total">
                {formatValue(totalQnty)}
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
              ref={selectButtonRef}
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