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
// import { fetchGetUser } from "../../Redux/action";
import { fetchGetUser } from "../../../Redux/action";
import { useHotkeys } from "react-hotkeys-hook";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "../../../vardana/vardana";
import "../../../vardana/verdana-bold";

export default function DailyJobReport() {
  const navigate = useNavigate();
  const user = getUserData();
  const organisation = getOrganisationData();

  const input1Ref = useRef(null);
  const input1Reftype = useRef(null);
  const input2Ref = useRef(null);
  const input3Ref = useRef(null);

  const toRef = useRef(null);
  const fromRef = useRef(null);
  const fromRefPur = useRef(null);
  const toRefPur = useRef(null);
  const fromRefCls = useRef(null);
  const toRefCls = useRef(null);
  const WarrantyRef = useRef(null);
  const NatureRef = useRef(null);

  const [saleType, setSaleType] = useState("");
  const [ReferenceCode, setReferenceCode] = useState("");

  const [searchQuery, setSearchQuery] = useState("");
  const [transectionType, settransectionType] = useState("");
  const [transectionType2, settransectionType2] = useState("");
  const [transectionType3, settransectionType3] = useState("H");

  // STATE FOR DROPDOWN SELECTION
  const [Companyselectdata, setCompanyselectdata] = useState("");
  const [Companyselectdatavalue, setCompanyselectdatavalue] = useState("");

  const [Categoryselectdata, setCategoryselectdata] = useState("");
  const [Categoryselectdatavalue, setCategoryselectdatavalue] = useState("");

  const [Technicianselectdata, setTechnicianselectdata] = useState("");
  const [Technicianselectdatavalue, setTechnicianselectdatavalue] =
    useState("");

  const [Referenceselectdata, setReferenceselectdata] = useState("");
  const [Referenceselectdatavalue, setReferenceselectdatavalue] = useState("");

  const [Typeselectdata, setTypeselectdata] = useState("");
  const [Typeselectdatavalue, setTypeselectdatavalue] = useState("");

  const [Areaselectdata, setAreaselectdata] = useState("");
  const [Areaselectdatavalue, setAreaselectdatavalue] = useState("");

  const [Cityselectdata, setCityselectdata] = useState("");
  const [Cityselectdatavalue, setCityselectdatavalue] = useState("");

  const [Complainselectdata, setComplainselectdata] = useState("");
  const [Complainselectdatavalue, setComplainselectdatavalue] = useState("");

  /////////////////////

  //   REF FOR ALL DROPDOWN
  const CompanyRef = useRef(null);
  const CategoryRef = useRef(null);
  const TechnicianRef = useRef(null);
  const ReferenceRef = useRef(null);
  const TypeRef = useRef(null);
  const CityRef = useRef(null);
  const AreaRef = useRef(null);
  const Complainref = useRef(null);
  const SearchRef = useRef(null);
  ////////////////////////

  //   STATE FOR DROPDOWN API DATA
  const [Technicianapidata, setTechnicianapidata] = useState([]);
  const [Referenceapidata, setReferenceapidata] = useState([]);
  const [GetTypeData, setGetTypeData] = useState([]);
  const [GetAreaData, setGetAreaData] = useState([]);
  const [GetACtiveCityData, setGetACtiveCityData] = useState([]);
  const [GetCategory, setGetCategory] = useState([]);
  const [GetCompany, setGetCompany] = useState([]);
  const [GetComplain, setGetComplain] = useState([]);
  //////////////////////////////////////

  const [totalQnty, setTotalQnty] = useState(0);
  const [totalOpening, setTotalOpening] = useState(0);
  const [totalDebit, setTotalDebit] = useState(0);
  const [totalCredit, setTotalCredit] = useState(0);
  const [closingBalance, setClosingBalance] = useState(0);
  const [totalDif, settotalDif] = useState(0);

  // state for from DatePicker
  const [selectedfromDate, setSelectedfromDate] = useState(null);
  const [fromInputDate, setfromInputDate] = useState("");
  const [fromCalendarOpen, setfromCalendarOpen] = useState(false);
  // state for To DatePicker
  const [selectedToDate, setSelectedToDate] = useState(null);
  const [toInputDate, settoInputDate] = useState("");
  const [toCalendarOpen, settoCalendarOpen] = useState(false);

  // state for Purfrom DatePicker
  const [selectedfromDatePur, setselectedfromDatePur] = useState(null);
  const [fromInputDatePur, setfromInputDatePur] = useState("");
  const [fromCalendarOpenPur, setfromCalendarOpenPur] = useState(false);
  // state for PurTo DatePicker
  const [selectedToDatePur, setselectedToDatePur] = useState(null);
  const [toInputDatePur, settoInputDatePur] = useState("");
  const [toCalendarOpenPur, settoCalendarOpenPur] = useState(false);

  // state for Clsfrom DatePicker
  const [selectedfromDateCls, setselectedfromDateCls] = useState(null);
  const [fromInputDateCls, setfromInputDateCls] = useState("");
  const [fromCalendarOpenCls, setfromCalendarOpenCls] = useState(false);
  // state for PurTo DatePicker
  const [selectedToDateCls, setselectedToDateCls] = useState(null);
  const [toInputDateCls, settoInputDateCls] = useState("");
  const [toCalendarOpenCls, settoCalendarOpenCls] = useState(false);

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
    getdatafontsize,
    getfontstyle,
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

  const formatDate = (date) => {
    const day = date.getDate().toString().padStart(2, "0");
    const month = (date.getMonth() + 1).toString().padStart(2, "0");
    const year = date.getFullYear();
    return `${day}-${month}-${year}`;
  };

  // FUNCTION FOR FIRST FROM DATE

  const toggleFromCalendar = () => {
    setfromCalendarOpen((prevOpen) => !prevOpen);
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

  // FUNCTION FOR FIRST TO DATE

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

        if (CompanyRef.current) {
          e.preventDefault();
          CompanyRef.current.focus();
        }
      } else {
        toast.error("Date must be in the format dd-mm-yyyy");
      }
    }
  };
  const toggleToCalendar = () => {
    settoCalendarOpen((prevOpen) => !prevOpen);
  };

  const handleToDateChange = (date) => {
    setSelectedToDate(date);
    settoInputDate(date ? formatDate(date) : "");
    settoCalendarOpen(false);
  };
  const handleToInputChange = (e) => {
    settoInputDate(e.target.value);
  };

  //  FUNCTIONS FOR FROM PUR DATE
  const toggleFromCalendarPur = () => {
    setfromCalendarOpenPur((prevOpen) => !prevOpen);
  };
  const handlefromDateChangePur = (date) => {
    setselectedfromDatePur(date);
    setfromInputDatePur(date ? formatDate(date) : "");
    setfromCalendarOpenPur(false);
  };
  const handlefromInputChangePur = (e) => {
    let value = e.target.value;

    // Remove all non-digit characters
    let cleaned = value.replace(/\D/g, "");

    // Limit to 8 digits (DDMMYYYY)
    cleaned = cleaned.substring(0, 8);

    // Format as user types
    if (cleaned.length > 0) {
      if (cleaned.length <= 2) {
        // Only day portion
        value = cleaned;
      } else if (cleaned.length <= 4) {
        // Day and month
        value = `${cleaned.substring(0, 2)}-${cleaned.substring(2)}`;
      } else {
        // Full date
        value = `${cleaned.substring(0, 2)}-${cleaned.substring(
          2,
          4
        )}-${cleaned.substring(4)}`;
      }
    }

    setfromInputDatePur(value);
  };

  //  FUNCTIONS FOR TO PUR DATE
  const toggleToCalendar2 = () => {
    settoCalendarOpenPur((prevOpen) => !prevOpen);
  };
  const handleToDateChange2 = (date) => {
    setselectedToDatePur(date);
    settoInputDatePur(date ? formatDate(date) : "");
    settoCalendarOpenPur(false);
  };
  const handleToInputChange2 = (e) => {
    let value = e.target.value;

    // Remove all non-digit characters
    let cleaned = value.replace(/\D/g, "");

    // Limit to 8 digits (DDMMYYYY)
    cleaned = cleaned.substring(0, 8);

    // Format as user types
    if (cleaned.length > 0) {
      if (cleaned.length <= 2) {
        // Only day portion
        value = cleaned;
      } else if (cleaned.length <= 4) {
        // Day and month
        value = `${cleaned.substring(0, 2)}-${cleaned.substring(2)}`;
      } else {
        // Full date
        value = `${cleaned.substring(0, 2)}-${cleaned.substring(
          2,
          4
        )}-${cleaned.substring(4)}`;
      }
    }

    settoInputDatePur(value);
  };

  //  FUNCTIONS FOR FROM CLS DATE
  const toggleFromCalendarCls = () => {
    setfromCalendarOpenCls((prevOpen) => !prevOpen);
  };
  const handlefromDateChangeCls = (date) => {
    setselectedfromDateCls(date);
    setfromInputDateCls(date ? formatDate(date) : "");
    setfromCalendarOpenPur(false);
  };
  const handlefromInputChangeCls = (e) => {
    let value = e.target.value;

    // Remove all non-digit characters
    let cleaned = value.replace(/\D/g, "");

    // Limit to 8 digits (DDMMYYYY)
    cleaned = cleaned.substring(0, 8);

    // Format as user types
    if (cleaned.length > 0) {
      if (cleaned.length <= 2) {
        // Only day portion
        value = cleaned;
      } else if (cleaned.length <= 4) {
        // Day and month
        value = `${cleaned.substring(0, 2)}-${cleaned.substring(2)}`;
      } else {
        // Full date
        value = `${cleaned.substring(0, 2)}-${cleaned.substring(
          2,
          4
        )}-${cleaned.substring(4)}`;
      }
    }

    setfromInputDateCls(value);
  };

  //  FUNCTIONS FOR TO CLS DATE
  const toggleToCalendarCls = () => {
    settoCalendarOpenCls((prevOpen) => !prevOpen);
  };
  const handleToDateChangecls = (date) => {
    setselectedToDateCls(date);
    settoInputDateCls(date ? formatDate(date) : "");
    settoCalendarOpenCls(false);
  };
  const handleToInputChangecls = (e) => {
    let value = e.target.value;

    // Remove all non-digit characters
    let cleaned = value.replace(/\D/g, "");

    // Limit to 8 digits (DDMMYYYY)
    cleaned = cleaned.substring(0, 8);

    // Format as user types
    if (cleaned.length > 0) {
      if (cleaned.length <= 2) {
        // Only day portion
        value = cleaned;
      } else if (cleaned.length <= 4) {
        // Day and month
        value = `${cleaned.substring(0, 2)}-${cleaned.substring(2)}`;
      } else {
        // Full date
        value = `${cleaned.substring(0, 2)}-${cleaned.substring(
          2,
          4
        )}-${cleaned.substring(4)}`;
      }
    }

    settoInputDateCls(value);
  };

  //  FUCTINS FOR HANDLE KEY PRESS

  const handlecompanyKeypress = (event, inputId) => {
    if (event.key === "Enter") {
      const selectedOption = CompanyRef.current.state.selectValue;
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
      const selectedOption = CategoryRef.current.state.selectValue;
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
  const handlecityKeypress = (event, inputId) => {
    if (event.key === "Enter") {
      const selectedOption = CityRef.current.state.selectValue;
      if (selectedOption && selectedOption.value) {
        setCityselectdata(selectedOption.value);
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

  const handletypeKeypress = (event, inputId) => {
    if (event.key === "Enter") {
      const selectedOption = TypeRef.current.state.selectValue;
      if (selectedOption && selectedOption.value) {
        setTypeselectdata(selectedOption.value);
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

  const handlerefernceKeypress = (event, inputId) => {
    if (event.key === "Enter") {
      const selectedOption = ReferenceRef.current.state.selectValue;
      if (selectedOption && selectedOption.value) {
        setReferenceselectdata(selectedOption.value);
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

  const handleAreaKeypress = (event, inputId) => {
    if (event.key === "Enter") {
      const selectedOption = AreaRef.current.state.selectValue;
      if (selectedOption && selectedOption.value) {
        setAreaselectdata(selectedOption.value);
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

  const handleTechnicianKeypress = (event, inputId) => {
    if (event.key === "Enter") {
      const selectedOption = TechnicianRef.current.state.selectValue;
      if (selectedOption && selectedOption.value) {
        setTechnicianselectdata(selectedOption.value);
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

    console.log(data);
    document.getElementById(
      "fromdatevalidation"
    ).style.border = `1px solid ${fontcolor}`;
    document.getElementById(
      "todatevalidation"
    ).style.border = `1px solid ${fontcolor}`;

    const apiUrl = apiLinks + "/DailyJobReport.php";
    setIsLoading(true);
    const formData = new URLSearchParams({
      FIntDat: fromInputDate,
      FFnlDat: toInputDate,
      // FROM & TO PUR DATE
      FIntPur: fromInputDatePur,
      FFnlPur: toInputDatePur,
      // FROM & TO Cls DATE
      FIntCls: fromInputDateCls,
      FFnlCls: toInputDateCls,
      // OTHER POST VARIABLES
      FWrnSts: transectionType2,
      FJobNat: transectionType3,
      FJobSts: transectionType,
       
      FCptCod: Complainselectdata,
      FTchCod: Technicianselectdata,
      FJobTyp: Typeselectdata,
    
      FRefCod: Referenceselectdata,
      FCmpCod: Companyselectdata,
      FCtgCod: Categoryselectdata,
      FAreCod: Areaselectdata,
      FCtyCod: Cityselectdata,
      FSchTxt: searchQuery,
      code: organisation.code,
      FLocCod: locationnumber || getLocationNumber,
      FYerDsc: yeardescription || getyeardescription,

      // code: "AGCOMP",
      // FLocCod: "001",
    }).toString();

    axios
      .post(apiUrl, formData)
      .then((response) => {
        setIsLoading(false);

        setTotalDebit(response.data["Total "]);

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

  /////////////// api for Technician code ////////////////////
  useEffect(() => {
    const apiUrl = apiLinks + "/GetActiveTechnicians.php";
    const formData = new URLSearchParams({
      //   FLocCod: locationnumber || getLocationNumber,
      //   code: organisation.code,

      FLocCod: "001",
      code: "IZONECOMP",
    }).toString();
    axios
      .post(apiUrl, formData)
      .then((response) => {
        setTechnicianapidata(response.data);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });
  }, []);
  const Technicianoption = Technicianapidata.map((item) => ({
    value: item.ttchcod,
    label: `${item.ttchcod}-${item.ttchnam.trim()}`,
  }));
  /////////////// api for Reference code ////////////////////

  useEffect(() => {
    const apiUrl = apiLinks + "/GetActiveReference.php";
    const formData = new URLSearchParams({
      FLocCod: locationnumber || getLocationNumber,
      code: organisation.code,
    }).toString();
    axios
      .post(apiUrl, formData)
      .then((response) => {
        setReferenceapidata(response.data);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });
  }, []);
  const refoptions = Referenceapidata.map((item) => ({
    value: item.trefcod,
    label: `${item.trefcod}-${item.trefdsc.trim()}`,
  }));
  /////////////// api for Comany code ////////////////////

  useEffect(() => {
    const apiUrl = apiLinks + "/GetCompany.php";
    const formData = new URLSearchParams({
      code: organisation.code,
      FLocCod: locationnumber || getLocationNumber,
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
  const comptions = GetCompany.map((item) => ({
    value: item.tcmpcod,
    label: `${item.tcmpcod}-${item.tcmpdsc.trim()}`,
  }));
  /////////////// api for Categoy code ////////////////////
  useEffect(() => {
    const apiUrl = apiLinks + "/GetCatg.php";
    const formData = new URLSearchParams({
      code: organisation.code,
      FLocCod: locationnumber || getLocationNumber,
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
  /////////////////////////////////////////////////////////

  /////////////// api for Type code ////////////////////
  useEffect(() => {
    const apiUrl = apiLinks + "/GetActiveType.php";
    const formData = new URLSearchParams({
      code: organisation.code,
      FLocCod: locationnumber || getLocationNumber,
    }).toString();
    axios
      .post(apiUrl, formData)
      .then((response) => {
        if (response.data && Array.isArray(response.data)) {
          setGetTypeData(response.data);
        } else {
          console.warn(
            "Response data structure is not as expected:",
            response.data
          );
          setGetTypeData([]);
        }
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  }, []);
  const Typedataoption = GetTypeData.map((item) => ({
    value: item.ttypcod,
    label: `${item.ttypcod}-${item.ttypdsc.trim()}`,
  }));

  /////////////////////////////////////////////////////////

  /////////////// api for Active Area code ////////////////////
  useEffect(() => {
    const apiUrl = apiLinks + "/GetActiveArea.php";
    const formData = new URLSearchParams({
      code: organisation.code,
      FLocCod: locationnumber || getLocationNumber,
    }).toString();
    axios
      .post(apiUrl, formData)
      .then((response) => {
        if (response.data && Array.isArray(response.data)) {
          setGetAreaData(response.data);
        } else {
          console.warn(
            "Response data structure is not as expected:",
            response.data
          );
          setGetAreaData([]);
        }
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  }, []);
  const AreaDataoption = GetAreaData.map((item) => ({
    value: item.tarecod,
    label: `${item.tarecod}-${item.taredsc.trim()}`,
  }));

  /////////////////////////////////////////////////////////

  /////////////// api for City code ////////////////////
  useEffect(() => {
    const apiUrl = apiLinks + "/GetActiveCity.php";
    const formData = new URLSearchParams({
      code: organisation.code,
      FLocCod: locationnumber || getLocationNumber,
    }).toString();
    axios
      .post(apiUrl, formData)
      .then((response) => {
        if (response.data && Array.isArray(response.data)) {
          setGetACtiveCityData(response.data);
        } else {
          console.warn(
            "Response data structure is not as expected:",
            response.data
          );
          setGetACtiveCityData([]);
        }
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  }, []);
  const CitydataOption = GetACtiveCityData.map((item) => ({
    value: item.tctycod,
    label: `${item.tctycod}-${item.tctydsc.trim()}`,
  }));

  /////////////////////////////////////////////////////////

  /////////////// api for City code ////////////////////
  useEffect(() => {
    const apiUrl = apiLinks + "/GetActiveComplaint.php";
    const formData = new URLSearchParams({
      code: organisation.code,
      FLocCod: locationnumber || getLocationNumber,
    }).toString();
    axios
      .post(apiUrl, formData)
      .then((response) => {
        if (response.data && Array.isArray(response.data)) {
          setGetComplain(response.data);
        } else {
          console.warn(
            "Response data structure is not as expected:",
            response.data
          );
          setGetComplain([]);
        }
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  }, []);
  const ComplaindataOption = GetComplain.map((item) => ({
    value: item.tcptcod,
    label: `${item.tcptcod}-${item.tcptdsc.trim()}`,
  }));

  /////////////////////////////////////////////////////////

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

  const customStyles1 = (hasError, widthpara) => ({
    control: (base, state) => ({
      ...base,
      height: "24px",
      minHeight: "unset",
      width: widthpara,
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

  const handleTransactionTypeChange = (event) => {
    const selectedTransactionType = event.target.value;
    settransectionType(selectedTransactionType);
  };
  const handleTransactionTypeChange2 = (event) => {
    const selectedTransactionType2 = event.target.value;
    settransectionType2(selectedTransactionType2);
  };
  const handleTransactionTypeChange3 = (event) => {
    const selectedTransactionType3 = event.target.value;
    settransectionType3(selectedTransactionType3);
  };

  const exportPDFHandler = () => {
    const globalfontsize = 12;
    console.log("gobal font data", globalfontsize);

    // Create a new jsPDF instance with landscape orientation
    const doc = new jsPDF({ orientation: "landscape" });

    // Define table data (rows)
    const rows = tableData.map((item) => [
      item.Date,
      item["Job#"],
      item.Customer?.substring(0, 10) || "",
      item.Mobile,
      item.Company?.substring(0, 10) || "",
      item.Item?.substring(0, 10) || "",
      item.Technician?.substring(0, 10) || "",
      item.Reference?.substring(0, 10) || "",
      item.Type?.substring(0, 10) || "",
      item.Status,
      formatValue(item.Day),
    ]);

    // Add summary row to the table

    rows.push([
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
      String(formatValue(totalDebit)),
    ]);

    // Define table column headers and individual column widths
    const headers = [
      "Date",
      "job#",
      "Customer",
      "Mobile",
      "Company",
      "Item",
      "Technician",
      "Reference",
      "Type",
      "Status",
      "Day",
    ];
    const columnWidths = [24, 16, 28, 28, 28, 28, 28, 28, 32, 28, 20];

    // Calculate total table width
    const totalWidth = columnWidths.reduce((acc, width) => acc + width, 0);

    // Define page height and padding
    const pageHeight = doc.internal.pageSize.height;
    const paddingTop = 15;

    // Set font properties for the table
    doc.setFont("verdana-regular", "normal"); // Set font to bold
    doc.setFontSize(10);

    // Function to add table headers
    const addTableHeaders = (startX, startY) => {
      // Set font style and size for headers
      doc.setFont("verdana", "bold"); // Set font to bold
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

      // Reset font style and size after adding headers
      doc.setFont(getfontstyle);
      doc.setFontSize(12);
    };

    const addTableRows = (startX, startY, startIndex, endIndex) => {
      const rowHeight = 5;
      const fontSize = 10;
      const boldFont = 400;
      const normalFont = getfontstyle;
      const tableWidth = getTotalTableWidth();

      doc.setFontSize(11);

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
            "F"
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
            rowBottomY - 0.5
          );

          doc.setLineWidth(0.2);
          doc.line(startX, rowTopY, startX, rowBottomY);
          doc.line(
            startX + tableWidth,
            rowTopY,
            startX + tableWidth,
            rowBottomY
          );
        } else {
          doc.setLineWidth(0.2);
          doc.rect(
            startX,
            startY + (i - startIndex + 2) * rowHeight,
            tableWidth,
            rowHeight
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

          if (cellIndex === 20) {
            const rightAlignX = startX + columnWidths[cellIndex] / 2;
            doc.text(cellValue, rightAlignX, cellY, {
              align: "center",
              baseline: "middle",
            });
          } else if (cellIndex === 10) {
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
              startY + (i - startIndex + 3) * rowHeight
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
    const rowsPerPage = 28; // Adjust this value based on your requirements

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
        pageNumberFontSize = 10
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
        doc.setFontSize(pageNumberFontSize);
        doc.text(
          `Page ${pageNumber}`,
          rightX - 1,
          doc.internal.pageSize.height - 10,
          { align: "right" }
        );
      };

      let currentPageIndex = 0;
      let startY = paddingTop; // Initialize startY
      let pageNumber = 1; // Initialize page number

      while (currentPageIndex * rowsPerPage < rows.length) {
        addTitle(comapnyname, 12, 12, pageNumber, startY, 18); // Render company title with default font size, only date, and page number
        startY += 5; // Adjust vertical position for the company title

        addTitle(
          `Monthly Job Comparison Report`,
          "",
          "",
          pageNumber,
          startY,
          12
        ); // Render sale report title with decreased font size, provide the time, and page number
        startY += -5;

        const labelsX = (doc.internal.pageSize.width - totalWidth) / 2;
        const labelsY = startY + 4; // Position the labels below the titles and above the table

        // Set font size and weight for the labels
        doc.setFontSize(12);
        doc.setFont(getfontstyle, "300");
        let search1 = searchQuery ? searchQuery : "";

        let referencecode = Referenceselectdatavalue.label
          ? Referenceselectdatavalue.label
          : "ALL";

        let typececode = Typeselectdatavalue.label
          ? Typeselectdatavalue.label
          : "ALL";

        let Citycode = Cityselectdatavalue.label
          ? Cityselectdatavalue.label
          : "ALL";
        let Areacode = Areaselectdatavalue.label
          ? Areaselectdatavalue.label
          : "ALL";

        let technicianvalue = Technicianselectdatavalue.label
          ? Technicianselectdatavalue.label
          : "ALL";

        let categoryvalue = Categoryselectdatavalue.label
          ? Categoryselectdatavalue.label
          : "ALL";

        let companyvalue = Companyselectdatavalue.label
          ? Companyselectdatavalue.label
          : "ALL";

        let complainvalue = Complainselectdatavalue.label
          ? Complainselectdatavalue.label
          : "ALL";

        let statuscode =
          transectionType === "N"
            ? "UNASSIGN"
            : transectionType === "P"
            ? "PENDING "
            : transectionType === "W"
            ? "WORKING"
            : transectionType === "R"
            ? "PARTS PENDING"
            : transectionType === "K"
            ? "REFER TO WORKSHOP"
            : transectionType === "T"
            ? "NOT SOLVE"
            : transectionType === "O"
            ? "RE-OPEN"
            : transectionType === "E"
            ? "REPLACEMENT"
            : transectionType === "D"
            ? "DONE "
            : transectionType === "S"
            ? "CLOSE"
            : transectionType === "C"
            ? "CANCLE"
            : "ALL";

        let Warrantydata =
          transectionType === "Y"
            ? "YES"
            : transectionType === "N"
            ? "NO"
            : "ALL";

        let Naturedata =
          transectionType === "H"
            ? "FIELD"
            : transectionType === "WORKSHOP"
            ? "W"
            : transectionType === "GODOWN"
            ? "G"
            : transectionType === "SHOW ROOM"
            ? "S"
            : "ALL";

        doc.setFont("verdana", "bold"); // Set font to bold
        doc.setFontSize(10);
        doc.text(`Company :`, labelsX, labelsY + 8.5); // Draw bold label
        doc.setFont("verdana-regular", "normal"); // Set font to bold
        doc.setFontSize(10);
        doc.text(`${companyvalue}`, labelsX + 25, labelsY + 8.5); // Draw the value next to the label

        doc.setFont("verdana", "bold"); // Set font to bold
        doc.setFontSize(10);
        doc.text(`Category :`, labelsX + 100, labelsY + 8.5); // Draw bold label
        doc.setFont("verdana-regular", "normal"); // Set font to bold
        doc.setFontSize(10);
        doc.text(`${categoryvalue}`, labelsX + 125, labelsY + 8.5); // Draw the value next to the label

        doc.setFont("verdana", "bold"); // Set font to bold
        doc.setFontSize(10);
        doc.text(`Type :`, labelsX + 200, labelsY + 8.5); // Draw bold label
        doc.setFont("verdana-regular", "normal"); // Set font to bold
        doc.setFontSize(10);
        doc.text(`${typececode}`, labelsX + 215, labelsY + 8.5); // Draw the value next to the label

        ///////////////////////////////////////////////////////////
        doc.setFont("verdana", "bold"); // Set font to bold
        doc.setFontSize(10);
        doc.text(`Technician :`, labelsX, labelsY + 12.8); // Draw bold label
        doc.setFont("verdana-regular", "normal"); // Set font to bold
        doc.setFontSize(10);
        doc.text(`${technicianvalue}`, labelsX + 28, labelsY + 12.5); // Draw the value next to the label

        doc.setFont("verdana", "bold"); // Set font to bold
        doc.setFontSize(10);
        doc.text(`Reference :`, labelsX + 100, labelsY + 12.8); // Draw bold label
        doc.setFont("verdana-regular", "normal"); // Set font to bold
        doc.setFontSize(10);
        doc.text(`${referencecode}`, labelsX + 128, labelsY + 12.5); // Draw the value next to the label

        doc.setFont("verdana", "bold"); // Set font to bold
        doc.setFontSize(10);
        doc.text(`Status :`, labelsX + 200, labelsY + 12.8); // Draw bold label
        doc.setFont("verdana-regular", "normal"); // Set font to bold
        doc.setFontSize(10);
        doc.text(`${statuscode}`, labelsX + 220, labelsY + 12.5); // Draw the value next to the label

        ///////////////////////////////////////////////////////////////////

        doc.setFont("verdana", "bold"); // Set font to bold
        doc.setFontSize(10);
        doc.text(`City :`, labelsX, labelsY + 16.8); // Draw bold label
        doc.setFont("verdana-regular", "normal"); // Set font to bold
        doc.setFontSize(10);
        doc.text(`${Citycode}`, labelsX + 25, labelsY + 16.8); // Draw the value next to the label

        doc.setFont("verdana", "bold"); // Set font to bold
        doc.setFontSize(10);
        doc.text(`Area :`, labelsX + 100, labelsY + 16.8); // Draw bold label
        doc.setFont("verdana-regular", "normal"); // Set font to bold
        doc.setFontSize(10);
        doc.text(`${Areacode}`, labelsX + 125, labelsY + 16.8); // Draw the value next to the label

        doc.setFont("verdana", "bold"); // Set font to bold
        doc.setFontSize(10);
        doc.text(`Warranty :`, labelsX + 200, labelsY + 16.8); // Draw bold label
        doc.setFont("verdana-regular", "normal"); // Set font to bold
        doc.setFontSize(10);
        doc.text(`${Warrantydata}`, labelsX + 228, labelsY + 16.8); // Draw the value next to the label

        doc.setFont("verdana", "bold"); // Set font to bold
        doc.setFontSize(10);
        doc.text(`Complain :`, labelsX, labelsY + 21.5); // Draw bold label
        doc.setFont("verdana-regular", "normal"); // Set font to bold
        doc.setFontSize(10);
        doc.text(`${complainvalue}`, labelsX + 25, labelsY + 21.5); // Draw the value next to the label

        doc.setFont("verdana", "bold"); // Set font to bold
        doc.setFontSize(10);
        doc.text(`Nature :`, labelsX + 100, labelsY + 21.5); // Draw bold label
        doc.setFont("verdana-regular", "normal"); // Set font to bold
        doc.setFontSize(10);
        doc.text(`${Naturedata}`, labelsX + 125, labelsY + 21.5); // Draw the value next to the label

        if (searchQuery) {
          doc.setFont("verdana", "bold"); // Set font to bold
          doc.setFontSize(10);
          doc.text(`Search :`, labelsX + 200, labelsY + 21.5); // Draw bold label
          doc.setFont("verdana-regular", "normal"); // Set font to bold
          doc.setFontSize(10);
          doc.text(`${search1}`, labelsX + 220, labelsY + 21.5); // Draw the value next to the label
        }

        // // Reset font weight to normal if necessary for subsequent text

        startY += 24; // Adjust vertical position for the labels

        addTableHeaders((doc.internal.pageSize.width - totalWidth) / 2, 43);
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

    // Save the PDF files
    doc.save(`DailyJobReport From ${fromInputDate} To ${toInputDate}.pdf`);
  };

  const handleDownloadCSV = async () => {
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet("Sheet1");

    const numColumns = 11; // Ensure this matches the actual number of columns

    const columnAlignments = [
      "left",
      "left",
      "left",
      "left",
      "left",
      "left",
      "left",
      "left",
      "left",
      "left",
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
      `A${companyRow.number}:${String.fromCharCode(65 + numColumns - 1)}${
        companyRow.number
      }`
    );

    // Add Store List row
    const storeListRow = worksheet.addRow([
      `Daily Job Report From ${fromInputDate} To ${toInputDate}`,
    ]);
    storeListRow.eachCell((cell) => {
      cell.font = fontStoreList;
      cell.alignment = { horizontal: "center" };
    });

    worksheet.mergeCells(
      `A${storeListRow.number}:${String.fromCharCode(65 + numColumns - 1)}${
        storeListRow.number
      }`
    );

    // Add an empty row after the title section
    worksheet.addRow([]);

    let referencecode = Referenceselectdatavalue.label
      ? Referenceselectdatavalue.label
      : "ALL";

    let typececode = Typeselectdatavalue.label
      ? Typeselectdatavalue.label
      : "ALL";

    let Citycode = Cityselectdatavalue.label
      ? Cityselectdatavalue.label
      : "ALL";
    let Areacode = Areaselectdatavalue.label
      ? Areaselectdatavalue.label
      : "ALL";

    let technicianvalue = Technicianselectdatavalue.label
      ? Technicianselectdatavalue.label
      : "ALL";

    let categoryvalue = Categoryselectdatavalue.label
      ? Categoryselectdatavalue.label
      : "ALL";

    let companyvalue = Companyselectdatavalue.label
      ? Companyselectdatavalue.label
      : "ALL";

    let complainvalue = Complainselectdatavalue.label
      ? Complainselectdatavalue.label
      : "ALL";

    let statuscode =
      transectionType === "N"
        ? "UNASSIGN"
        : transectionType === "P"
        ? "PENDING "
        : transectionType === "W"
        ? "WORKING"
        : transectionType === "R"
        ? "PARTS PENDING"
        : transectionType === "K"
        ? "REFER TO WORKSHOP"
        : transectionType === "T"
        ? "NOT SOLVE"
        : transectionType === "O"
        ? "RE-OPEN"
        : transectionType === "E"
        ? "REPLACEMENT"
        : transectionType === "D"
        ? "DONE "
        : transectionType === "S"
        ? "CLOSE"
        : transectionType === "C"
        ? "CANCLE"
        : "ALL";

    let Warrantydata =
      transectionType === "Y" ? "YES" : transectionType === "N" ? "NO" : "ALL";

    let Naturedata =
      transectionType === "H"
        ? "FIELD"
        : transectionType === "WORKSHOP"
        ? "W"
        : transectionType === "GODOWN"
        ? "G"
        : transectionType === "SHOW ROOM"
        ? "S"
        : "ALL";

    // Add first row
    const typeAndStoreRow = worksheet.addRow([
      "Compnay :",
      companyvalue,
      "",
      "",
      "Category :",
      categoryvalue,
      "",
      "",
      "Type :",
      typececode,
    ]);
    worksheet.mergeCells(
      `B${typeAndStoreRow.number}:C${typeAndStoreRow.number}`
    );

    const typeAndStoreRow4 = worksheet.addRow([
      "Technician :",
      technicianvalue,
      "",
      "",
      "Reference :",
      referencecode,
      "",
      "",
      "Status :",
      statuscode,
    ]);

    worksheet.mergeCells(
      `B${typeAndStoreRow4.number}:C${typeAndStoreRow4.number}`
    );

    let typesearch = searchQuery || "";

    const typeAndStoreRow3 = worksheet.addRow([
      "City :",
      Citycode,
      "",
      "",
      "Area :",
      Areacode,
      "",
      "",
      "Warranty :",
      Warrantydata,
    ]);

    worksheet.mergeCells(
      `B${typeAndStoreRow3.number}:C${typeAndStoreRow3.number}`
    );

    const typeAndStoreRow5 = worksheet.addRow(
      searchQuery
        ? [
            "Complain :",
            complainvalue,
            "",
            "",
            "Nature :",
            Naturedata,
            "",
            "",
            "Search :",
            typesearch,
          ]
        : ["Complain :", complainvalue, "", "", "Nature :", Naturedata]
    );

    worksheet.mergeCells(
      `B${typeAndStoreRow5.number}:C${typeAndStoreRow5.number}`
    );

    // Apply styling for the status row
    typeAndStoreRow.eachCell((cell, colIndex) => {
      cell.font = {
        name: "CustomFont" || "CustomFont",
        size: 10,
        bold: [1, 5, 9].includes(colIndex),
      };
      cell.alignment = { horizontal: "left", vertical: "middle" };
    });

    typeAndStoreRow4.eachCell((cell, colIndex) => {
      cell.font = {
        name: "CustomFont" || "CustomFont",
        size: 10,
        bold: [1, 5, 9].includes(colIndex),
      };
      cell.alignment = { horizontal: "left", vertical: "middle" };
    });

    typeAndStoreRow3.eachCell((cell, colIndex) => {
      cell.font = {
        name: "CustomFont" || "CustomFont",
        size: 10,
        bold: [1, 5, 9].includes(colIndex),
      };
      cell.alignment = { horizontal: "left", vertical: "middle" };
    });
    typeAndStoreRow5.eachCell((cell, colIndex) => {
      cell.font = {
        name: "CustomFont" || "CustomFont",
        size: 10,
        bold: [1, 5, 9].includes(colIndex),
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
      "job#",
      "Customer",
      "Mobile",
      "Company",
      "Item",
      "Technician",
      "Reference",
      "Type",
      "Status",
      "Day",
    ];
    const headerRow = worksheet.addRow(headers);
    headerRow.eachCell((cell) => Object.assign(cell, headerStyle));

    // Add data rows
    tableData.forEach((item) => {
      const row = worksheet.addRow([
        item.Date,
        item["Job#"],
        item.Customer,
        item.Mobile,
        item.Company,
        item.Item,
        item.Technician,
        item.Reference,
        item.Type,
        item.Status,
        item.Day,
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
    [12, 7, 30, 12, 30, 45, 30, 30, 15, 13, 8].forEach((width, index) => {
      worksheet.getColumn(index + 1).width = width;
    });

    const totalRow = worksheet.addRow([
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
      String(formatValue(totalDebit)),
    ]);

    // total row added

    totalRow.eachCell((cell, colNumber) => {
      cell.font = { name: "CustomFont", size: 10, bold: true }; // Apply CustomFont
      cell.border = {
        top: { style: "thin" },
        left: { style: "thin" },
        bottom: { style: "thin" },
        right: { style: "thin" },
      };

      // Align only the "Total" text to the right
      if (colNumber === 11) {
        cell.alignment = { horizontal: "right" };
      }
    });

    // Get current date
    const getCurrentDate = () => {
      const today = new Date();
      const day = String(today.getDate()).padStart(2, "0");
      const month = String(today.getMonth() + 1).padStart(2, "0");
      const year = today.getFullYear();
      return `${day}-${month}-${year}`;
    };

    const currentdate = getCurrentDate();

    // Generate and save the Excel file
    const buffer = await workbook.xlsx.writeBuffer();
    const blob = new Blob([buffer], {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    });
    saveAs(blob, `DailyJobReport From ${fromInputDate} To ${toInputDate}.xlsx`);
  };
  /////////////////////////// DOWNLOAD PDF EXCEL ///////////////////////////////////////////////////////////

  const dispatch = useDispatch();

  const tableTopColor = "#3368B5";
  const tableHeadColor = "#3368b5";
  const secondaryColor = "white";
  const btnColor = "#3368B5";
  const textColor = "white";

  const [tableData, setTableData] = useState([]);
  console.log("installment sale reports data", tableData);
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

  const firstColWidth = {
    width: "80px",
  };

  const secondColWidth = {
    width: "55px",
  };
  const thirdColWidth = {
    width: isSidebarVisible ? "100px" : "150px",
  };
  const forthColWidth = {
    width: "90px",
  };
  const fifthColWidth = {
    width: "100px",
  };
  const sixthColWidth = {
    width: isSidebarVisible ? "100px" : "150px",
  };
  const seventhColWidth = {
    width: "100px",
  };
  const eighthColWidth = {
    width: "100px",
  };
  const ninhthColWidth = {
    width: "60px",
  };

  const tenthColWidth = {
    width: isSidebarVisible ? "100px" : "150px",
  };

  const companyColWidth = {
    width: isSidebarVisible ? "100px" : "150px",
  };
  const sixthcol = {
    width: "8px",
  };

  useHotkeys(
    "alt+s",
    () => {
      fetchReceivableReport();
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
    maxWidth: isSidebarVisible ? "1000px" : "1200px",
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
          <NavComponent textdata="Daily Job Report" />
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
                style={{ marginLeft: "18px" }}
              >
                <div
                  style={{
                    width: "110px",
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
                        marginLeft: "2px",
                      }}
                    >
                      Register Date :
                    </span>
                  </label>
                </div>
                <div
                  id="fromdatevalidation"
                  style={{
                    width: "100px",
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
                      width: "75px",
                      paddingLeft: "2px",
                      outline: "none",
                      border: "none",
                      fontFamily: getfontstyle,
                      fontSize: getdatafontsize,
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
                    placeholder="dd-mm-yyy"
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
                            marginLeft: "5px",
                            fontFamily: getfontstyle,
                            fontSize: getdatafontsize,
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

              {/* CODE FOR FROM PUR DATE */}
              <div className="d-flex align-items-center">
                <div
                  style={{
                    width: "110px",
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
                        marginLeft: "2px",
                      }}
                    >
                      Purchase Date :
                    </span>
                  </label>
                </div>
                <div
                  // id="fromdatevalidation"
                  id="purdate"
                  style={{
                    width: "100px",
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
                      width: "75px",
                      paddingLeft: "2px",
                      outline: "none",
                      border: "none",
                      fontFamily: getfontstyle,
                      fontSize: getdatafontsize,
                      backgroundColor: getcolor,
                      color: fontcolor,
                      opacity: selectedRadio === "custom" ? 1 : 0.5,
                      pointerEvents:
                        selectedRadio === "custom" ? "auto" : "none",
                    }}
                    id="frominputidpur"
                    value={fromInputDatePur}
                    ref={fromRefPur}
                    onChange={handlefromInputChangePur}
                    // onKeyDown={(e) => handlefromKeyPress(e, "toDatePicker")}
                    autoComplete="off"
                    placeholder="dd-mm-yyy"
                    aria-label="Date Input"
                    disabled={selectedRadio !== "custom"}
                  />
                  <DatePicker
                    selected={selectedfromDatePur}
                    onChange={handlefromDateChangePur}
                    dateFormat="dd-MM-yyyy"
                    popperPlacement="bottom"
                    showPopperArrow={false}
                    open={fromCalendarOpenPur}
                    dropdownMode="select"
                    customInput={
                      <div>
                        <BsCalendar
                          onClick={
                            selectedRadio === "custom"
                              ? toggleFromCalendarPur
                              : undefined
                          }
                          style={{
                            cursor:
                              selectedRadio === "custom"
                                ? "pointer"
                                : "default",
                            marginLeft: "5px",
                            fontFamily: getfontstyle,
                            fontSize: getdatafontsize,
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

              {/* CODE FOR FROM CLS DATE */}
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
                        fontFamily: getfontstyle,
                        fontSize: getdatafontsize,
                        fontWeight: "bold",
                        marginLeft: "2px",
                      }}
                    >
                      Done Date :
                    </span>
                  </label>
                </div>
                <div
                  // id="fromdatevalidation"
                  id="clsdate"
                  style={{
                    width: "100px",
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
                      width: "75px",
                      paddingLeft: "2px",
                      outline: "none",
                      border: "none",
                      fontFamily: getfontstyle,
                      fontSize: getdatafontsize,
                      backgroundColor: getcolor,
                      color: fontcolor,
                      opacity: selectedRadio === "custom" ? 1 : 0.5,
                      pointerEvents:
                        selectedRadio === "custom" ? "auto" : "none",
                    }}
                    id="frominputidcls"
                    value={fromInputDateCls}
                    ref={fromRefCls}
                    onChange={handlefromInputChangeCls}
                    // onKeyDown={(e) => handlefromKeyPress(e, "toDatePicker")}
                    autoComplete="off"
                    placeholder="dd-mm-yyy"
                    aria-label="Date Input"
                    disabled={selectedRadio !== "custom"}
                  />
                  <DatePicker
                    selected={selectedfromDateCls}
                    onChange={handlefromDateChangeCls}
                    dateFormat="dd-MM-yyyy"
                    popperPlacement="bottom"
                    showPopperArrow={false}
                    open={fromCalendarOpenCls}
                    dropdownMode="select"
                    customInput={
                      <div>
                        <BsCalendar
                          onClick={
                            selectedRadio === "custom"
                              ? toggleFromCalendarCls
                              : undefined
                          }
                          style={{
                            cursor:
                              selectedRadio === "custom"
                                ? "pointer"
                                : "default",
                            marginLeft: "5px",
                            fontFamily: getfontstyle,
                            fontSize: getdatafontsize,
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

              {/* DROPDOWN CODE BLEW */}
              <div
                className="d-flex align-items-center"
                style={{ marginRight: "21px" }}
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
                        fontFamily: getfontstyle,
                        fontSize: getdatafontsize,
                        fontWeight: "bold",
                      }}
                    >
                      Warranty :
                    </span>
                  </label>
                </div>

                <div style={{ position: "relative", display: "inline-block" }}>
                  <select
                    ref={WarrantyRef}
                    // onKeyDown={(e) => handleKeyPress(e, SearchRef)}
                    id="warranty"
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
                      width: "230px",
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
                    <option value="Y">YES</option>
                    <option value="N">NO</option>
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

              {/* SECOND DATE ROW */}
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
              {/* CODE FOR FIRST TO DATE  */}

              <div
                className="d-flex align-items-center"
                // style={{ marginLeft: isSidebarVisible ? "143px" : "243px" }}
                style={{ marginLeft: "18px" }}
              >
                <div
                  style={{
                    width: "110px",
                    display: "flex",
                    justifyContent: "end",
                  }}
                >
                  <label htmlFor="toDatePicker">
                    <span
                      style={{
                        fontFamily: getfontstyle,
                        fontSize: getdatafontsize,
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
                    width: "100px",
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
                      width: "75px",
                      paddingLeft: "2px",
                      outline: "none",
                      border: "none",
                      fontFamily: getfontstyle,
                      fontSize: getdatafontsize,
                      backgroundColor: getcolor,
                      color: fontcolor,
                      opacity: selectedRadio === "custom" ? 1 : 0.5,
                      pointerEvents:
                        selectedRadio === "custom" ? "auto" : "none",
                    }}
                    value={toInputDate}
                    onChange={handleToInputChange}
                    onKeyDown={(e) => handleToKeyPress(e, CompanyRef)}
                    id="toDatePicker"
                    autoComplete="off"
                    placeholder="dd-mm-yyy"
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
                            marginLeft: "5px",
                            fontFamily: getfontstyle,
                            fontSize: getdatafontsize,
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

              {/* CODE FOR TO INPUT PUR DATE */}
              <div
                className="d-flex align-items-center"
                // style={{ marginLeft: isSidebarVisible ? "143px" : "243px" }}
                // style={{marginLeft:'5px'}}
              >
                <div
                  style={{
                    width: "110px",
                    display: "flex",
                    justifyContent: "end",
                  }}
                >
                  <label htmlFor="toDatePicker">
                    <span
                      style={{
                        fontFamily: getfontstyle,
                        fontSize: getdatafontsize,
                        fontWeight: "bold",
                      }}
                    >
                      To :
                    </span>
                  </label>
                </div>
                <div
                  id="TOdatepur"
                  style={{
                    width: "100px",
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
                    ref={toRefPur}
                    style={{
                      height: "20px",
                      width: "75px",
                      paddingLeft: "2px",
                      outline: "none",
                      border: "none",
                      fontFamily: getfontstyle,
                      fontSize: getdatafontsize,
                      backgroundColor: getcolor,
                      color: fontcolor,
                      opacity: selectedRadio === "custom" ? 1 : 0.5,
                      pointerEvents:
                        selectedRadio === "custom" ? "auto" : "none",
                    }}
                    value={toInputDatePur}
                    onChange={handleToInputChange2}
                    // onKeyDown={(e) => handleToKeyPress(e, CompanyRef)}
                    id="toDatePicker"
                    autoComplete="off"
                    placeholder="dd-mm-yyy"
                    aria-label="To Date Input"
                    disabled={selectedRadio !== "custom"}
                  />
                  <DatePicker
                    selected={selectedToDatePur}
                    onChange={handleToDateChange2}
                    dateFormat="dd-MM-yyyy"
                    popperPlacement="bottom"
                    showPopperArrow={false}
                    open={toCalendarOpenPur}
                    dropdownMode="select"
                    customInput={
                      <div>
                        <BsCalendar
                          onClick={
                            selectedRadio === "custom"
                              ? toggleToCalendar2
                              : undefined
                          }
                          style={{
                            cursor:
                              selectedRadio === "custom"
                                ? "pointer"
                                : "default",
                            marginLeft: "5px",
                            fontFamily: getfontstyle,
                            fontSize: getdatafontsize,
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
              {/* CODE FOR TO INPUT CLS DATE */}
              <div
                className="d-flex align-items-center"
                // style={{ marginLeft: isSidebarVisible ? "143px" : "243px" }}
                style={{ marginLeft: "5px" }}
              >
                <div
                  style={{
                    width: "90px",
                    display: "flex",
                    justifyContent: "end",
                  }}
                >
                  <label htmlFor="toDatePicker">
                    <span
                      style={{
                        fontFamily: getfontstyle,
                        fontSize: getdatafontsize,
                        fontWeight: "bold",
                      }}
                    >
                      To :
                    </span>
                  </label>
                </div>
                <div
                  id="TOdatecls"
                  style={{
                    width: "100px",
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
                    ref={toRefCls}
                    style={{
                      height: "20px",
                      width: "75px",
                      paddingLeft: "2px",
                      outline: "none",
                      border: "none",
                      fontFamily: getfontstyle,
                      fontSize: getdatafontsize,
                      backgroundColor: getcolor,
                      color: fontcolor,
                      opacity: selectedRadio === "custom" ? 1 : 0.5,
                      pointerEvents:
                        selectedRadio === "custom" ? "auto" : "none",
                    }}
                    value={toInputDateCls}
                    onChange={handleToInputChangecls}
                    // onKeyDown={(e) => handleToKeyPress(e, CompanyRef)}
                    id="toDatePicker"
                    autoComplete="off"
                    placeholder="dd-mm-yyy"
                    aria-label="To Date Input"
                    disabled={selectedRadio !== "custom"}
                  />
                  <DatePicker
                    selected={selectedToDateCls}
                    onChange={handleToDateChangecls}
                    dateFormat="dd-MM-yyyy"
                    popperPlacement="bottom"
                    showPopperArrow={false}
                    open={toCalendarOpenCls}
                    dropdownMode="select"
                    customInput={
                      <div>
                        <BsCalendar
                          onClick={
                            selectedRadio === "custom"
                              ? toggleToCalendarCls
                              : undefined
                          }
                          style={{
                            cursor:
                              selectedRadio === "custom"
                                ? "pointer"
                                : "default",
                            marginLeft: "5px",
                            fontFamily: getfontstyle,
                            fontSize: getdatafontsize,
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

              {/* DROPDOWN CODE BLEW */}
              <div
                className="d-flex align-items-center"
                style={{ marginRight: "21px" }}
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
                        fontFamily: getfontstyle,
                        fontSize: getdatafontsize,
                        fontWeight: "bold",
                      }}
                    >
                      Nature :
                    </span>
                  </label>
                </div>

                <div style={{ position: "relative", display: "inline-block" }}>
                  <select
                    ref={NatureRef}
                    // onKeyDown={(e) => handleKeyPress(e, SearchRef)}
                    id="warranty"
                    name="type"
                    onFocus={(e) =>
                      (e.currentTarget.style.border = "4px solid red")
                    }
                    onBlur={(e) =>
                      (e.currentTarget.style.border = `1px solid ${fontcolor}`)
                    }
                    value={transectionType3}
                    onChange={handleTransactionTypeChange3}
                    style={{
                      width: "230px",
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
                    <option value="H">FIELD</option>
                    <option value="W">WORKSHOP</option>
                    <option value="S">SHOW ROOM</option>
                    <option value="G">GODOWN</option>
                  </select>

                  {transectionType3 !== "H" && (
                    <span
                      onClick={() => settransectionType3("H")}
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

              {/* CODE FOR SELECT */}
            </div>
          </div>

          {/* SECEOND ROW */}

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
                style={{ marginLeft: "10px" }}
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
                    ref={CompanyRef}
                    options={comptions}
                    onKeyDown={(e) => handlecompanyKeypress(e, CategoryRef)}
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
                      ...customStyles1(!Companyselectdata, 230),
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
                style={{ marginLeft: "12px" }}
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
                      Category :
                    </span>
                  </label>
                </div>

                <div style={{ marginLeft: "3px" }}>
                  <Select
                    className="List-select-class"
                    ref={CategoryRef}
                    options={categoryoptions}
                    onKeyDown={(e) => handlecategoryKeypress(e, TypeRef)}
                    id="selectedsale"
                    onChange={(selectedOption) => {
                      if (selectedOption && selectedOption.value) {
                        const labelPart = selectedOption.label.split("-")[1];
                        setCategoryselectdata(selectedOption.value);
                        setCategoryselectdatavalue({
                          value: selectedOption.value,
                          label: labelPart,
                        });
                      } else {
                        setCategoryselectdata("");
                        setCategoryselectdatavalue("");
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
                      ...customStyles1(!Categoryselectdata, 230),
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
                style={{ marginRight: "21px" }}
              >
                <div
                  style={{
                    marginLeft: "10px",
                    width: "70px",
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
                      Type :
                    </span>
                  </label>
                </div>

                <div style={{ marginLeft: "3px" }}>
                  <Select
                    className="List-select-class"
                    ref={TypeRef}
                    options={Typedataoption}
                    onKeyDown={(e) => handletypeKeypress(e, TechnicianRef)}
                    id="selectedsale"
                    onChange={(selectedOption) => {
                      if (selectedOption && selectedOption.value) {
                        const labelPart = selectedOption.label.split("-")[1];
                        setTypeselectdata(selectedOption.value);
                        setTypeselectdatavalue({
                          value: selectedOption.value,
                          label: labelPart,
                        });
                      } else {
                        setTypeselectdata("");
                        setTypeselectdatavalue("");
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
                      ...customStyles1(!Typeselectdata, 230),
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
          {/* ////////////  THIRD ROW  ///////////// */}

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
                    marginLeft: "10px",
                    width: "90px",
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
                      Technician :
                    </span>
                  </label>
                </div>

                <div style={{ marginLeft: "3px" }}>
                  <Select
                    className="List-select-class"
                    ref={TechnicianRef}
                    options={Technicianoption}
                    onKeyDown={(e) => handleTechnicianKeypress(e, Complainref)}
                    id="selectedsale"
                    onChange={(selectedOption) => {
                      if (selectedOption && selectedOption.value) {
                        const labelPart = selectedOption.label.split("-")[1];
                        setTechnicianselectdata(selectedOption.value);
                        setTechnicianselectdatavalue({
                          value: selectedOption.value,
                          label: labelPart,
                        });
                      } else {
                        setTechnicianselectdata("");
                        setTechnicianselectdatavalue("");
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
                      ...customStyles1(!Technicianselectdata, 230),
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

              <div className="d-flex align-items-center">
                <div
                  style={{
                    // marginLeft: "10px",
                    width: "85px",
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
                      Complain :
                    </span>
                  </label>
                </div>

                <div style={{ marginLeft: "3px" }}>
                  <Select
                    className="List-select-class"
                    ref={Complainref}
                    options={ComplaindataOption}
                    onKeyDown={(e) => handlecityKeypress(e, CityRef)}
                    id="selectedsale"
                    onChange={(selectedOption) => {
                      if (selectedOption && selectedOption.value) {
                        const labelPart = selectedOption.label.split("-")[1];
                        setComplainselectdata(selectedOption.value);
                        setComplainselectdatavalue({
                          value: selectedOption.value,
                          label: labelPart,
                        });
                      } else {
                        setComplainselectdata("");
                        setComplainselectdatavalue("");
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
                      ...customStyles1(!Complainselectdata, 230),
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
                        fontFamily: getfontstyle,
                        fontSize: getdatafontsize,
                        fontWeight: "bold",
                      }}
                    >
                      Status :
                    </span>
                  </label>
                </div>

                <div style={{ position: "relative", display: "inline-block" }}>
                  <select
                    ref={input1Ref}
                    onKeyDown={(e) => handleKeyPress(e, SearchRef)}
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
                      width: "230px",
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
                    <option value="P">PENDING</option>
                    <option value="T">NOT SOLVE</option>
                    <option value="E">REPLACEMENT</option>
                    <option value="D">DONE</option>
                    <option value="C">CANCLE</option>
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

          {/* FORTH ROW */}

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
                    marginLeft: "10px",
                    width: "90px",
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
                      City :
                    </span>
                  </label>
                </div>

                <div style={{ marginLeft: "3px" }}>
                  <Select
                    className="List-select-class"
                    ref={CityRef}
                    options={CitydataOption}
                    onKeyDown={(e) => handlecityKeypress(e, AreaRef)}
                    id="selectedsale"
                    onChange={(selectedOption) => {
                      if (selectedOption && selectedOption.value) {
                        const labelPart = selectedOption.label.split("-")[1];
                        setCityselectdata(selectedOption.value);
                        setCityselectdatavalue({
                          value: selectedOption.value,
                          label: labelPart,
                        });
                      } else {
                        setCityselectdata("");
                        setCityselectdatavalue("");
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
                      ...customStyles1(!Cityselectdata, 230),
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
                style={{ marginRight: "10px" }}
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
                      Area :
                    </span>
                  </label>
                </div>

                <div style={{ marginLeft: "3px" }}>
                  <Select
                    className="List-select-class"
                    ref={AreaRef}
                    options={AreaDataoption}
                    onKeyDown={(e) => handleAreaKeypress(e, ReferenceRef)}
                    id="selectedsale"
                    onChange={(selectedOption) => {
                      if (selectedOption && selectedOption.value) {
                        const labelPart = selectedOption.label.split("-")[1];
                        setAreaselectdata(selectedOption.value);
                        setAreaselectdatavalue({
                          value: selectedOption.value,
                          label: labelPart,
                        });
                      } else {
                        setAreaselectdata("");
                        setAreaselectdatavalue("");
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
                      ...customStyles1(!Areaselectdata, 230),
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
                    ref={SearchRef}
                    onKeyDown={(e) => handleKeyPress(e, input3Ref)}
                    type="text"
                    id="searchsubmit"
                    placeholder="Search"
                    value={searchQuery}
                    autoComplete="off"
                    style={{
                      marginRight: "20px",
                      width: "230px",
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

          {/* LAST ROW */}

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
                style={{ marginRight: "6px" }}
              >
                <div
                  style={{
                    marginLeft: "20px",
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
                      Reference :
                    </span>
                  </label>
                </div>

                <div style={{ marginLeft: "3px" }}>
                  <Select
                    className="List-select-class"
                    ref={ReferenceRef}
                    options={refoptions}
                    onKeyDown={(e) => handlerefernceKeypress(e, input1Ref)}
                    id="selectedsale"
                    onChange={(selectedOption) => {
                      if (selectedOption && selectedOption.value) {
                        const labelPart = selectedOption.label.split("-")[1];
                        setReferenceselectdata(selectedOption.value);
                        setReferenceselectdatavalue({
                          value: selectedOption.value,
                          label: labelPart,
                        });
                      } else {
                        setReferenceselectdata("");
                        setReferenceselectdatavalue("");
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
                      ...customStyles1(!Referenceselectdata, 300),
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

          {/* ///////// */}
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
                  fontFamily: getfontstyle,
                  fontSize: getdatafontsize,
                  // width: "100%",
                  position: "relative",
                  // paddingRight: "2%",
                }}
              >
                <thead
                  style={{
                    fontFamily: getfontstyle,
                    fontSize: getdatafontsize,
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
                    <td className="border-dark" style={firstColWidth}>
                      Date
                    </td>
                    <td className="border-dark" style={secondColWidth}>
                      Job#
                    </td>
                    <td className="border-dark" style={thirdColWidth}>
                      Customer
                    </td>
                    <td className="border-dark" style={forthColWidth}>
                      Mobile
                    </td>

                    <td className="border-dark" style={companyColWidth}>
                      Company
                    </td>

                    <td className="border-dark" style={fifthColWidth}>
                      Item
                    </td>
                    <td className="border-dark" style={sixthColWidth}>
                      Technician
                    </td>
                    <td className="border-dark" style={tenthColWidth}>
                      Reference
                    </td>
                    <td className="border-dark" style={seventhColWidth}>
                      Type
                    </td>
                    <td className="border-dark" style={eighthColWidth}>
                      Status
                    </td>
                    <td className="border-dark" style={ninhthColWidth}>
                      Day
                    </td>

                    <td className="border-dark" style={sixthcol}></td>
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
                maxHeight: "34vh",
                // width: "100%",
                wordBreak: "break-word",
              }}
            >
              <table
                className="myTable"
                id="tableBody"
                style={{
                  fontFamily: getfontstyle,
                  fontSize: getdatafontsize,
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
                        )
                      )}
                      <tr>
                        <td style={firstColWidth}></td>
                        <td style={secondColWidth}></td>
                        <td style={thirdColWidth}></td>
                        <td style={forthColWidth}></td>
                        <td style={companyColWidth}></td>
                        <td style={fifthColWidth}></td>
                        <td style={sixthColWidth}></td>
                        <td style={tenthColWidth}></td>
                        <td style={seventhColWidth}></td>
                        <td style={eighthColWidth}></td>
                        <td style={ninhthColWidth}></td>
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
                            <td className="text-start" style={firstColWidth}>
                              {item.Date}
                            </td>
                            <td className="text-start" style={secondColWidth}>
                              {item["Job#"]}
                            </td>
                            <td
                              className="text-start"
                              title={item.Customer}
                              style={{
                                ...thirdColWidth,
                                whiteSpace: "nowrap",
                                overflow: "hidden",
                                textOverflow: "ellipsis",
                              }}
                            >
                              {item.Customer}
                            </td>
                            <td className="text-start" style={forthColWidth}>
                              {item.Mobile}
                            </td>

                            <td
                              className="text-start"
                              title={item.Company}
                              style={{
                                ...companyColWidth,
                                whiteSpace: "nowrap",
                                overflow: "hidden",
                                textOverflow: "ellipsis",
                              }}
                            >
                              {item.Company}
                            </td>

                            <td
                              className="text-start"
                              title={item.Item}
                              style={{
                                ...fifthColWidth,
                                whiteSpace: "nowrap",
                                overflow: "hidden",
                                textOverflow: "ellipsis",
                              }}
                            >
                              {item.Item}
                            </td>
                            <td
                              className="text-start"
                              title={item.Technician}
                              style={{
                                ...sixthColWidth,
                                whiteSpace: "nowrap",
                                overflow: "hidden",
                                textOverflow: "ellipsis",
                              }}
                            >
                              {item.Technician}
                            </td>
                            <td
                              className="text-start"
                              title={item.Item}
                              style={{
                                ...tenthColWidth,
                                whiteSpace: "nowrap",
                                overflow: "hidden",
                                textOverflow: "ellipsis",
                              }}
                            >
                              {item.Item}
                            </td>
                            <td
                              className="text-start"
                              title={item.Type}
                              style={{
                                ...seventhColWidth,
                                whiteSpace: "nowrap",
                                overflow: "hidden",
                                textOverflow: "ellipsis",
                              }}
                            >
                              {item.Type}
                            </td>
                            <td
                              className="text-start"
                              title={item.Status}
                              style={{
                                ...eighthColWidth,
                                whiteSpace: "nowrap",
                                overflow: "hidden",
                                textOverflow: "ellipsis",
                              }}
                            >
                              {item.Status}
                            </td>
                            <td className="text-end" style={ninhthColWidth}>
                              {formatValue(item.Day)}
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
                        <td style={companyColWidth}></td>
                        <td style={fifthColWidth}></td>
                        <td style={sixthColWidth}></td>
                        <td style={tenthColWidth}></td>
                        <td style={seventhColWidth}></td>
                        <td style={eighthColWidth}></td>
                        <td style={ninhthColWidth}></td>
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
            }}
          >
            <div
              style={{
                ...firstColWidth,
                background: getcolor,
                borderRight: `1px solid ${fontcolor}`,
              }}
            >
              {/* <span className="mobileledger_total2">
                {formatValue(tableData.length.toLocaleString())}
              </span> */}
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
                ...companyColWidth,
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
            ></div>
            <div
              style={{
                ...tenthColWidth,
                background: getcolor,
                borderRight: `1px solid ${fontcolor}`,
              }}
            ></div>
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
            ></div>
            <div
              style={{
                ...ninhthColWidth,
                background: getcolor,
                borderRight: `1px solid ${fontcolor}`,
              }}
            >
              {" "}
              <span className="mobileledger_total2">
                {formatValue(totalDebit)}
              </span>
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
