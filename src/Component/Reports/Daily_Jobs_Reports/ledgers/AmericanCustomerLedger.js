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


export default function AmericanCustomerLedger() {
  const navigate = useNavigate();
  const user = getUserData();
  const organisation = getOrganisationData();

  const saleSelectRef = useRef(null);
  const input1Ref = useRef(null);
  const input2Ref = useRef(null);
  const input3Ref = useRef(null);

  const toRef = useRef(null);
  const fromRef = useRef(null);

  const [amt1, setamt1] = useState(0);
  const [amt2, setamt2] = useState(0);
  const [amt3, setamt3] = useState(0);
  const [amt4, setamt4] = useState(0);
  const [amt5, setamt5] = useState(0);
  const [amt6, setamt6] = useState(0);
  const [amt7, setamt7] = useState(0);

  console.log("setamt2", setamt2);
  console.log("setamt3", setamt3);
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

   // DOUBLE STATE HANDLE
    const [isItemInitialized, setIsItemInitialized] = useState(false);
    const [isCodeReady, setIsCodeReady] = useState(false);
    const [isDoubleClickOpen, setIsDoubleClickOpen] = useState(false);

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
        toast.error("Please select an Account Code");
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

    const data = {
      FIntDat: fromInputDate,
      FFnlDat: toInputDate,
      FTrnTyp: transectionType,
      FAccCod: saleType,
      code: organisation.code,
      FLocCod: locationnumber || getLocationNumber,
      FYerDsc: yeardescription || getYearDescription,
      // code: "AMRELEC",
      // FLocCod: "001",
      // FYerDsc: "2019-2025",
    };

    console.log("Sending data:", data);

    document.getElementById(
      "fromdatevalidation"
    ).style.border = `1px solid ${fontcolor}`;
    document.getElementById(
      "todatevalidation"
    ).style.border = `1px solid ${fontcolor}`;

    const apiUrl = apiLinks + "/AmericanCustomerLedger.php";
    setIsLoading(true);

    const formData = new URLSearchParams({
      FIntDat: fromInputDate,
      FFnlDat: toInputDate,
      FTrnTyp: transectionType,
      FAccCod: saleType,
    //   code: organisation.code,
    //   FLocCod: locationnumber || getLocationNumber,
    //   FYerDsc: yeardescription || getYearDescription,
      code: "AMRELEC",
      FLocCod: "001",
      FYerDsc: "2019-2025",
    }).toString();

    axios
      .post(apiUrl, formData)
      .then((response) => {
        setIsLoading(false);
        console.log("API Response:", response.data);
        setamt1(response.data["Balance"]);
        setamt2(response.data["amt001"]);
        setamt3(response.data["amt002"]);
        setamt4(response.data["amt003"]);
        setamt5(response.data["amt004"]);
        setamt6(response.data["amt005"]);
        setamt7(response.data["amt006"]);

        // Transform API response to match UI expected format
        if (response.data && Array.isArray(response.data.Header)) {
          const transformedData = response.data.Header.map((item) => ({
            Date: item.ttrndat,
            "Trn#": item.ttrnnum,
            Type: item.ttrntyp,
            Description: item.ttrndsc?.trim(),
            Qnty: item.titmqnt,
            Rate: item.tsalrat,
            Debit: item.debit,
            Credit: item.credit,
            Balance: item.balance,
            // Additional properties if needed
            tchqsts: item.tchqsts,
            Opening: item.balance, // For opening balance row
          }));

          setTableData(transformedData);

          // Calculate totals from the API response
          // Assuming the last item in Header is the closing balance row
          // if (response.data.Header.length > 0) {
          //   const lastItem =
          //     response.data.Header[response.data.Header.length - 1];
          //   setClosingBalance(lastItem.balance || 0);
          // }

          // If API provides totals directly, use them
          // if (response.data.amt005 !== undefined) {
          //   setamt1(response.data.amt001);
          //   setamt2(response.data.amt002);
          //   setamt3(response.data.amt003);
          //   setamt4(response.data.amt004);
          //   setamt5(response.data.amt005);
          //   setamt6(response.data.amt006);
          //   setamt7(response.data.amt007);
          // }

          console.log("Processed data:", transformedData);
        } else {
          console.warn(
            "Response data structure is not as expected:",
            response.data
          );
        }
      })
      .catch((error) => {
        console.error("Error:", error);
        setIsLoading(false);
        toast.error("Failed to fetch data. Please try again.");
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
      const storedData = sessionStorage.getItem("AmericanReeciableData");
    
      let toDate = new Date(); // default today
      let fromDate = new Date(toDate.getFullYear(), toDate.getMonth(), 1);
    
      if (storedData) {
        const parsedData = JSON.parse(storedData);
    
        // ✅ TO DATE
        if (parsedData.toInputDate) {
          const [day, month, year] = parsedData.toInputDate.split("-").map(Number);
          toDate = new Date(year, month - 1, day);
        }
    
        // ✅ FROM DATE
        if (parsedData.fromInputDate) {
          // Case: Payable Report (both dates)
          const [day, month, year] = parsedData.fromInputDate.split("-").map(Number);
          fromDate = new Date(year, month - 1, day);
        } else {
          // Case: Payable Aging (only toDate)
          fromDate = new Date(toDate.getFullYear(), toDate.getMonth(), 1);
        }
      }
    
      // ✅ Apply states
      setSelectedToDate(toDate);
      settoInputDate(formatDate(toDate));
    
      setSelectedfromDate(fromDate);
      setfromInputDate(formatDate(fromDate));
    
    }, []);

  useEffect(() => {
    const apiUrl = apiLinks + "/GetActiveCustomer.php";
    const formData = new URLSearchParams({
    //   FLocCod: getLocationNumber,
    //   code: organisation.code,
      FLocCod: "001",
      code: "AMRELEC",
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

 
  const options = supplierList.map((item) => ({
    value: item.tacccod,
    label: `${item.tacccod}-${item.taccdsc.trim()}`,
  }));

 useEffect(() => {
    if (options.length === 0) return;
    if (isItemInitialized) return;

    const storedData = sessionStorage.getItem("AmericanReeciableData");
    let selectedOption = null;

    if (storedData) {
      const parsedData = JSON.parse(storedData);
      const clickedCode = parsedData.code?.trim();
      if (parsedData.code) {
        setIsDoubleClickOpen(true); // ✅ ADD
      }
      selectedOption = options.find((opt) => opt.value?.trim() === clickedCode);

      sessionStorage.removeItem("AmericanReeciableData");
    }

    if (!selectedOption) {
      selectedOption = options[0];
    }

    if (selectedOption) {
      setSaleType(selectedOption.value);

      const description = selectedOption.label
        .split("-")
        .slice(1)
        .join("-")
        .trim();

      setCompanyselectdatavalue({
        value: selectedOption.value,
        label: description,
      });

      setIsCodeReady(true); // ✅ IMPORTANT
    }

    setIsItemInitialized(true);
  }, [options, isItemInitialized]);

  useEffect(() => {
    // 🔥 Dono cheezain ready hon
    if (isDoubleClickOpen && isCodeReady) {
      fetchReceivableReport();
    }
  }, [isDoubleClickOpen, isCodeReady]);

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
      width: 400,
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

  const exportPDFHandler = () => {
    const globalfontsize = 12;
    console.log("gobal font data", globalfontsize);

    // Create a new jsPDF instance with landscape orientation
    const doc = new jsPDF({ orientation: "landscape" });

    // Define table data (rows)
    const rows = tableData.map((item) => [
      item.Date,
      item["Trn#"],
      item.Type,
      item.Description,
      formatValue(item.Qnty),
      formatValue(item.Rate),
      formatValue(item.Debit),
      formatValue(item.Credit),
      formatValue(item.Balance),
    ]);

    // Add summary row to the table
    rows.push(["", "", "", "", "", "", "", "", String(formatValue(amt1))]);

    // Define table column headers and individual column widths
    const headers = [
      "Date",
      "Trn#",
      "Type",
      "Description",
      "Qnty",
      "Rate",
      "Debit",
      "Credit",
      "Balance",
    ];

    const columnWidths = [25, 17, 12, 102, 20, 28, 28, 28, 28];

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

    // ================= BALANCE AGING ROW (DO NOT TOUCH OTHER CODE) =================

    const drawBalanceAgingRow = (startX, startY) => {
      const rowHeight = 12;
      const halfHeight = rowHeight / 2;

      // Calculate total table width
      const tableWidth = columnWidths.reduce((acc, w) => acc + w, 0);

      // Divide table width into 6 equal parts for the aging row
      const colWidth = tableWidth / 6;

      const labels = [
        "0 - 30",
        "31 - 60",
        "61 - 90",
        "91 - 120",
        "121 - 150",
        "150 +",
      ];

      const values = [
        String(formatValue(amt2)),
        String(formatValue(amt3)),
        String(formatValue(amt4)),
        String(formatValue(amt5)),
        String(formatValue(amt6)),
        String(formatValue(amt7)),
      ];

      let currentX = startX;

      // Background
      // doc.setFillColor(220, 220, 220);
      // doc.rect(startX, startY, tableWidth, rowHeight, "F");

      
      doc.setTextColor(0);

      for (let i = 0; i < 6; i++) {
        // Outer border
        doc.setLineWidth(0.1);
        doc.rect(currentX, startY, colWidth, rowHeight);

        // Horizontal split
        doc.line(
          currentX,
          startY + halfHeight,
          currentX + colWidth,
          startY + halfHeight
        );

        // Top label
            doc.setFont("verdana", "bold");
          doc.setFontSize(10);
        doc.text(
          labels[i],
          currentX + colWidth / 2,
          startY + halfHeight / 1.5,
          {
            align: "center",
          }
        );

        // Bottom value
           doc.setFont("verdana-regular", "normal");
          doc.setFontSize(10);
        doc.text(
          values[i],
          currentX + colWidth / 2,
          startY + halfHeight + halfHeight / 1.4,
          { align: "center" }
        );

        currentX += colWidth;
      }
    };

    // ================= END BALANCE AGING ROW =================

const addTableRows = (startX, startY, startIndex, endIndex) => {
  const rowHeight = 5;
  const fontSize = 10;
  const boldFont = 300;
  const normalFont = getfontstyle;
  const tableWidth = getTotalTableWidth();
  const totalRowGap = 3;

  // ✅ Default font apply
  doc.setFont("verdana-regular", "normal");
  doc.setFontSize(10);

  doc.setFontSize(fontSize);

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

    const extraGap = isTotalRow ? totalRowGap : 0;

    if (isTotalRow) {
      doc.setFont("verdana", "bold"); // keep bold for total row
      doc.setFontSize(10);
    } else {
      // ✅ ensure normal rows always use verdana-regular
      doc.setFont("verdana-regular", "normal");
    }

    // Background for odd rows
    if (isOddRow && !isTotalRow) {
      doc.setFillColor(230);
      doc.rect(
        startX,
        startY + (i - startIndex + 2) * rowHeight + extraGap,
        tableWidth,
        rowHeight,
        "F"
      );
    }

    doc.setDrawColor(0);
    doc.setLineWidth(0.2);

    // Row border
    doc.rect(
      startX,
      startY + (i - startIndex + 2) * rowHeight + extraGap,
      tableWidth,
      rowHeight
    );

    row.forEach((cell, cellIndex) => {
      const cellY =
        startY +
        (i - startIndex + 2) * rowHeight +
        rowHeight / 2 +
        extraGap;

      const cellX = startX + 2;

      doc.setTextColor(textColor[0], textColor[1], textColor[2]);

      const cellValue = String(cell);

      if (cellIndex === 2) {
        const rightAlignX = startX + columnWidths[cellIndex] / 2;
        doc.text(cellValue, rightAlignX, cellY, {
          align: "center",
          baseline: "middle",
        });
      } else if (
        cellIndex === 4 ||
        cellIndex === 5 ||
        cellIndex === 6 ||
        cellIndex === 7 ||
        cellIndex === 8
      ) {
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
          doc.text(cellValue, cellX, cellY, { baseline: "middle" });
        }
      }

      // Column borders
      if (cellIndex < row.length - 1) {
        doc.setLineWidth(0.2);
        doc.line(
          startX + columnWidths[cellIndex],
          startY + (i - startIndex + 2) * rowHeight + extraGap,
          startX + columnWidths[cellIndex],
          startY + (i - startIndex + 3) * rowHeight + extraGap
        );
        startX += columnWidths[cellIndex];
      }
    });

    startX = (doc.internal.pageSize.width - tableWidth) / 2;

    if (isTotalRow) {
      const agingTableWidth = 40 + 25 * 6;
      const agingStartX =
        (doc.internal.pageSize.width - agingTableWidth) / 2;
      const agingStartY =
        startY + (i - startIndex + 2) * rowHeight + extraGap;

      drawBalanceAgingRow(agingStartX + -49, agingStartY + 6);
      continue;
    }
  }

  // Footer
  const lineWidth = tableWidth;
  const lineX = (doc.internal.pageSize.width - tableWidth) / 2;
  const lineY = pageHeight - 15;

  doc.setLineWidth(0.3);
  doc.line(lineX, lineY, lineX + lineWidth, lineY);

  // ✅ Footer font
  doc.setFont("verdana-regular", "normal");
  doc.setFontSize(10);
  doc.setTextColor(0);

  doc.text(
    `Crystal Solution \t ${date} \t ${time}`,
    lineX + 2,
    lineY + 5
  );
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
          doc.setFontSize(10);
                  doc.text(
          `Page ${pageNumber}`,
          rightX - 20,
          doc.internal.pageSize.height - 10,
          { align: "right" }
        );
      };

      let currentPageIndex = 0;
      let startY = paddingTop; // Initialize startY
      let pageNumber = 1; // Initialize page number

      while (currentPageIndex * rowsPerPage < rows.length) {
          doc.setFont("Times New Roman", "normal");
        addTitle(comapnyname, pageNumber, startY, 18); // Render company title with default font size, only date, and page number
        startY += 5; // Adjust vertical position for the company title

        // addTitle(`Supplier Progress Report From: ${toInputDate}`, "", "", pageNumber, startY, 12); // Render sale report title with decreased font size, provide the time, and page number
          doc.setFont("verdana-regular", "normal");
                 addTitle(
          `Customer Ledger From: ${fromInputDate} To ${toInputDate}`,
          pageNumber,
          startY,
          12
        );
        startY += -5;

        const labelsX = (doc.internal.pageSize.width - totalWidth) / 2;
        const labelsY = startY + 4; // Position the labels below the titles and above the table

       
        let status = transectionType ? transectionType : "ALL";
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
                  doc.text(`Type :`, labelsX + 200, labelsY + 8.5); // Draw bold label
    doc.setFont("verdana-regular", "normal");
          doc.setFontSize(10);
                  doc.text(`${status}`, labelsX + 215, labelsY + 8.5); // Draw the value next to the label


        startY += 10; // Adjust vertical position for the labels

        addTableHeaders((doc.internal.pageSize.width - totalWidth) / 2, 29);
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
  ///////////////////////////// DOWNLOAD PDF CODE ////////////////////////////////////////////////////////////

  ///////////////////////////// DOWNLOAD PDF EXCEL //////////////////////////////////////////////////////////
  // const handleDownloadCSV = async () => {
  //   const workbook = new ExcelJS.Workbook();
  //   const worksheet = workbook.addWorksheet("Sheet1");

  //   const numColumns = 6; // Ensure this matches the actual number of columns

  //   const columnAlignments = [
  //     "center",
  //     "center",
  //     "center",
  //     "left",
  //     "right",
  //     "right",
  //     "right",
  //     "right",
  //     "right",
  //   ];

  //   // Define fonts for different sections
  //   const fontCompanyName = {
  //     name: "CustomFont" || "CustomFont",
  //     size: 18,
  //     bold: true,
  //   };
  //   const fontStoreList = {
  //     name: "CustomFont" || "CustomFont",
  //     size: 10,
  //     bold: false,
  //   };
  //   const fontHeader = {
  //     name: "CustomFont" || "CustomFont",
  //     size: 10,
  //     bold: true,
  //   };
  //   const fontTableContent = {
  //     name: "CustomFont" || "CustomFont",
  //     size: 10,
  //     bold: false,
  //   };

  //   // Add an empty row at the start
  //   worksheet.addRow([]);

  //   // Add company name
  //   const companyRow = worksheet.addRow([comapnyname]);
  //   companyRow.eachCell((cell) => {
  //     cell.font = fontCompanyName;
  //     cell.alignment = { horizontal: "center" };
  //   });

  //   worksheet.getRow(companyRow.number).height = 30;
  //   worksheet.mergeCells(
  //     `A${companyRow.number}:${String.fromCharCode(68 + numColumns - 1)}${
  //       companyRow.number
  //     }`
  //   );

  //   // Add Store List row
  //   const storeListRow = worksheet.addRow([
  //     `Customer Ledger From ${fromInputDate} To ${toInputDate}`,
  //   ]);
  //   storeListRow.eachCell((cell) => {
  //     cell.font = fontStoreList;
  //     cell.alignment = { horizontal: "center" };
  //   });

  //   worksheet.mergeCells(
  //     `A${storeListRow.number}:${String.fromCharCode(68 + numColumns - 1)}${
  //       storeListRow.number
  //     }`
  //   );

  //   // Add an empty row after the title section
  //   worksheet.addRow([]);

  //   let typestatus = "";
  //   if (transectionType === "A") {
  //     typestatus = "ALL";
  //   } else if (transectionType === "CRV") {
  //     typestatus = "CASH RECEIVE VOUCHER";
  //   } else if (transectionType === "CPV") {
  //     typestatus = "CASH PAYMENT VOUCHER";
  //   } else if (transectionType === "BRV") {
  //     typestatus = "BANK RECEIVE VOUCHER";
  //   } else if (transectionType === "BPV") {
  //     typestatus = "BANK PAYMENT VOUCHER";
  //   } else if (transectionType === "JRV") {
  //     typestatus = "JOURNAL VOUCHER";
  //   } else if (transectionType === "INV") {
  //     typestatus = "ITEM SALE";
  //   } else if (transectionType === "SRN") {
  //     typestatus = "SALE RETURN";
  //   } else if (transectionType === "BIL") {
  //     typestatus = "PURCHASE";
  //   } else if (transectionType === "PRN") {
  //     typestatus = "PURCHASE RETURN";
  //   } else if (transectionType === "ISS") {
  //     typestatus = "ISSUE";
  //   } else if (transectionType === "REC") {
  //     typestatus = "RECEIVE";
  //   } else if (transectionType === "SLY") {
  //     typestatus = "SALARY";
  //   } else {
  //     typestatus = "ALL"; // Default value
  //   }
  //   let Accountselect = Companyselectdatavalue.label
  //     ? Companyselectdatavalue.label
  //     : "ALL";
  //   let typesearch = searchQuery || "";

  //   // Apply styling for the status row
  //   const typeAndStoreRow2 = worksheet.addRow([
  //     "ACCOUNT :",
  //     Accountselect,
  //     "",
  //     "",
  //     "",
  //     "",
  //     "TYPE :",
  //     typestatus,
  //   ]);
  //   const typeAndStoreRow3 = worksheet.addRow(
  //     searchQuery ? ["", "", "", "", "", "", "SEARCH :", typesearch] : [""]
  //   );
  //   // Merge cells for Accountselect (columns B to D)
  //   worksheet.mergeCells(
  //     `B${typeAndStoreRow2.number}:D${typeAndStoreRow2.number}`
  //   );
  //   // Apply styling for the status row
  //   typeAndStoreRow2.eachCell((cell, colIndex) => {
  //     cell.font = {
  //       name: "CustomFont" || "CustomFont",
  //       size: 10,
  //       bold: [1, 7].includes(colIndex),
  //     };
  //     cell.alignment = {
  //       horizontal: colIndex === 2 ? "left" : "left", // Left align the account name
  //       vertical: "middle",
  //     };
  //   });
  //   typeAndStoreRow3.eachCell((cell, colIndex) => {
  //     cell.font = {
  //       name: "CustomFont" || "CustomFont",
  //       size: 10,
  //       bold: [7].includes(colIndex),
  //     };
  //     cell.alignment = { horizontal: "left", vertical: "middle" };
  //   });

  //   // Header style
  //   const headerStyle = {
  //     font: fontHeader,
  //     alignment: { horizontal: "center", vertical: "middle" },
  //     fill: {
  //       type: "pattern",
  //       pattern: "solid",
  //       fgColor: { argb: "FFC6D9F7" },
  //     },
  //     border: {
  //       top: { style: "thin" },
  //       left: { style: "thin" },
  //       bottom: { style: "thin" },
  //       right: { style: "thin" },
  //     },
  //   };

  //   // Add headers
  //   const headers = [
  //     "Date",
  //     "Trn#",
  //     "Type",
  //     "Description",
  //     "Qnty",
  //     "Rate",
  //     "Debit",
  //     "Credit",
  //     "Balance",
  //   ];
  //   const headerRow = worksheet.addRow(headers);
  //   headerRow.eachCell((cell) => Object.assign(cell, headerStyle));

  //   // Add data rows
  //   tableData.forEach((item, index) => {
  //     const row = worksheet.addRow([
  //       item.Date,
  //       item["Trn#"],
  //       item.Type,
  //       item.Description,
  //       formatValue(item.Qnty),
  //       formatValue(item.Rate),
  //       formatValue(item.Debit),
  //       formatValue(item.Credit),
  //       formatValue(item.Balance),
  //     ]);

  //     row.eachCell((cell, colIndex) => {
  //       cell.font = fontTableContent;
  //       cell.border = {
  //         top: { style: "thin" },
  //         left: { style: "thin" },
  //         bottom: { style: "thin" },
  //         right: { style: "thin" },
  //       };
  //       cell.alignment = {
  //         horizontal: columnAlignments[colIndex - 1] || "left",
  //         vertical: "middle",
  //       };

  //       // Apply light grey background for odd-numbered rows
  //       if (index % 2 === 0) {
  //         cell.fill = {
  //           type: "pattern",
  //           pattern: "solid",
  //           fgColor: { argb: "FFF2F2F2" }, // light grey
  //         };
  //       }
  //     });
  //   });

  //   // Add an empty row at the start
  //   worksheet.addRow([]);
  //   // const totalRow = worksheet.addRow([
  //   //   "",
  //   //   "",
  //   //   "",
  //   //   "Total",
  //   //   totalQnty,
  //   //   "",
  //   //   totalDebit,
  //   //   totalCredit,
  //   //   closingBalance,
  //   // ]);

  //   // // total row added

  //   // totalRow.eachCell((cell, colNumber) => {
  //   //   cell.font = { bold: true };
  //   //   cell.border = {
  //   //     top: { style: "double" },
  //   //     left: { style: "thin" },
  //   //     bottom: { style: "double" },
  //   //     right: { style: "thin" },
  //   //   };

  //   //   // Align only the "Total" text to the right
  //   //   if (
  //   //     colNumber === 5 ||
  //   //     colNumber === 7 ||
  //   //     colNumber === 8 ||
  //   //     colNumber === 9
  //   //   ) {
  //   //     cell.alignment = { horizontal: "right" };
  //   //   }
  //   // });

  //   // Set column widths

  //   /* ================= AGING LABELS & VALUES ================= */

  //   const agingLabels = [
  //     "0 - 30",
  //     "31 - 60",
  //     "61 - 90",
  //     "91 - 120",
  //     "121 - 150",
  //     "150 +",
  //     "Balance",
  //   ];

  //   const agingValues = [
  //     formatValue(amt2),
  //     formatValue(amt3),
  //     formatValue(amt4),
  //     formatValue(amt5),
  //     formatValue(amt6),
  //     formatValue(amt7),
  //     formatValue(amt1),
  //   ];

  //   /* ================= LABEL ROW ================= */

  //   const agingLabelRow = worksheet.addRow([
  //     "",
  //     agingLabels[0], // A
  //     agingLabels[1], // B
  //     agingLabels[2], // C
  //     agingLabels[3], // D
  //     agingLabels[4], // E
  //     agingLabels[5], // F
  //     "", // G (unchanged)
  //     agingLabels[6], // H
  //     // I (for merge)
  //   ]);

  //   /* ================= VALUE ROW ================= */

  //   const agingValueRow = worksheet.addRow([
  //     "",
  //     agingValues[0], // A
  //     agingValues[1], // B
  //     agingValues[2], // C
  //     agingValues[3], // D
  //     agingValues[4], // E
  //     agingValues[5], // F
  //     "", // G
  //     agingValues[6], // H
  //     // I
  //   ]);

  //   /* ================= MERGE BALANCE ONLY ================= */

  //   worksheet.mergeCells(`H${agingLabelRow.number}:H${agingLabelRow.number}`);
  //   worksheet.mergeCells(`H${agingValueRow.number}:H${agingValueRow.number}`);

  //   /* ================= STYLING ================= */

  //   [agingLabelRow, agingValueRow].forEach((row, rowIndex) => {
  //     row.eachCell((cell, colNumber) => {
  //       cell.font = {
  //         name: "CustomFont",
  //         size: rowIndex === 0 ? 9 : 10,
  //         bold: rowIndex === 0 || colNumber >= 8,
  //       };

  //       cell.alignment = {
  //         horizontal: "center",
  //         vertical: "middle",
  //       };

  //       cell.border = {
  //         top: rowIndex === 0 ? { style: "thin" } : undefined,
  //         bottom: rowIndex === 1 ? { style: "thin" } : undefined,
  //         left: { style: "thin" },
  //         right: { style: "thin" },
  //       };

  //       cell.fill = {
  //         type: "pattern",
  //         pattern: "solid",
  //         fgColor: {
  //           argb: colNumber >= 8 ? "FFF5F5F5" : "FFF5F5F5",
  //         },
  //       };
  //     });
  //   });

  //   /* ================= ROW HEIGHTS ================= */

  //   agingLabelRow.height = 18;
  //   agingValueRow.height = 24; // slightly taller for Balance emphasis

  //   [10, 7, 7, 45, 8, 12, 12, 12, 12].forEach((width, index) => {
  //     worksheet.getColumn(index + 1).width = width;
  //   });

  //   // Add a blank row
  //   worksheet.addRow([]);
  //   // Get current date and time
  //   const getCurrentTime = () => {
  //     const today = new Date();
  //     const hh = String(today.getHours()).padStart(2, "0");
  //     const mm = String(today.getMinutes()).padStart(2, "0");
  //     const ss = String(today.getSeconds()).padStart(2, "0");
  //     return `${hh}:${mm}:${ss}`;
  //   };
  //   // Get current date
  //   const getCurrentDate = () => {
  //     const today = new Date();
  //     const day = String(today.getDate()).padStart(2, "0");
  //     const month = String(today.getMonth() + 1).padStart(2, "0");
  //     const year = today.getFullYear();
  //     return `${day}-${month}-${year}`;
  //   };
  //   const currentTime = getCurrentTime();
  //   const currentdate = getCurrentDate();
  //   const userid = user.tusrid;

  //   // Add date and time row
  //   const dateTimeRow = worksheet.addRow([
  //     `DATE:   ${currentdate}  TIME:   ${currentTime}`,
  //   ]);
  //   dateTimeRow.eachCell((cell) => {
  //     cell.font = {
  //       name: "CustomFont" || "CustomFont",
  //       size: 10,
  //       // bold: true
  //       // italic: true,
  //     };
  //     cell.alignment = { horizontal: "left" };
  //   });
  //   const dateTimeRow1 = worksheet.addRow([`USER ID:  ${userid}`]);
  //   dateTimeRow.eachCell((cell) => {
  //     cell.font = {
  //       name: "CustomFont" || "CustomFont",
  //       size: 10,
  //       // bold: true
  //       // italic: true,
  //     };
  //     cell.alignment = { horizontal: "left" };
  //   });

  //   // Merge across all columns
  //   worksheet.mergeCells(
  //     `A${dateTimeRow.number}:${String.fromCharCode(65 + numColumns - 1)}${
  //       dateTimeRow.number
  //     }`
  //   );
  //   worksheet.mergeCells(
  //     `A${dateTimeRow1.number}:${String.fromCharCode(65 + numColumns - 1)}${
  //       dateTimeRow1.number
  //     }`
  //   );

  //   // Generate and save fthe Excel file
  //   const buffer = await workbook.xlsx.writeBuffer();
  //   const blob = new Blob([buffer], {
  //     type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  //   });
  //   saveAs(blob, `CustomerLedger From ${fromInputDate} To ${toInputDate}.xlsx`);
  // };


  

  
const handleDownloadCSV = async () => {
  const workbook = new ExcelJS.Workbook();
  const worksheet = workbook.addWorksheet("Sheet1");

  const numColumns = 9;

  const columnAlignments = ["center",
      "center",
      "center",
      "left",
      "right",
      "right",
      "right",
      "right",
      "right",];

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
    `Customer Ledger Report As On ${toInputDate}`,
  ]);
  storeListRow.eachCell((cell) => {
    cell.font = fontStoreList;
    cell.alignment = { horizontal: "center" };
  });

  worksheet.mergeCells(
    `A${storeListRow.number}:${String.fromCharCode(64 + numColumns)}${storeListRow.number}`
  );

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
      "Account :",
      Accountselect,
      "",
      "",
      "",
      "",
      "Type :",
      typestatus,
    ]);
    const typeAndStoreRow3 = worksheet.addRow(
      searchQuery ? ["", "", "", "", "", "", "SEARCH :", typesearch] : [""]
    );
    // Merge cells for Accountselect (columns B to D)
    worksheet.mergeCells(
      `B${typeAndStoreRow2.number}:D${typeAndStoreRow2.number}`
    );
    // Apply styling for the status row
    typeAndStoreRow2.eachCell((cell, colIndex) => {
      cell.font = {
        name: "CustomFont" || "CustomFont",
        size: 10,
        bold: [1, 7].includes(colIndex),
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
        bold: [7].includes(colIndex),
      };
      cell.alignment = { horizontal: "left", vertical: "middle" };
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

  const headers = ["Date",
      "Trn#",
      "Type",
      "Description",
      "Qnty",
      "Rate",
      "Debit",
      "Credit",
      "Balance",];
  const headerRow = worksheet.addRow(headers);
  headerRow.eachCell((cell) => Object.assign(cell, headerStyle));

  // ==== TABLE CONTENT ====
  tableData.forEach((item) => {
    const row = worksheet.addRow([
     item.Date,
        item["Trn#"],
        item.Type,
        item.Description,
        formatValue(item.Qnty),
        formatValue(item.Rate),
        formatValue(item.Debit),
        formatValue(item.Credit),
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
    "",
    "",
     "",
    "",
     "",
    "",
    String(formatValue(amt1)),
   
  ]);

  totalRow.eachCell((cell, colNumber) => {
    cell.font = { bold: true };
    cell.border = {
      top: { style: "double" },
      left: { style: "thin" },
      bottom: { style: "double" },
      right: { style: "thin" },
    };
    if (colNumber >= 1 && colNumber <= 9) {
      cell.alignment = { horizontal: "right" };
    }
  });

  // ========= ADD GAP =========
  worksheet.addRow([]);

  // ========= AGING SUMMARY =========
  const agingLabels = ["0 - 30", "31 - 60", "61 - 90", "91 - 120", "121 - 150", "150 +"];
  const agingValues = [
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
    cell.alignment = { horizontal: "center", vertical: "middle" };
    cell.border = {
      top: { style: "thin" },
      left: { style: "thin" },
      bottom: { style: "thin" },
      right: { style: "thin" },
    };
    if (colIndex === 9) {
      cell.font = { bold: false };
      cell.alignment = { horizontal: "center" };
    }
  });
  worksheet.getRow(agingValueRow.number).height = 22;

  // ========= COLUMN WIDTHS =========
  [12,10,8,45, 12, 15, 15, 15,15].forEach((width, index) => {
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
  saveAs(blob, `CustomerLedgerReport As On ${toInputDate}.xlsx`);
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

  // const firstColWidth = {
  //     width: "8%",
  // };
  // const secondColWidth = {
  //     width: "5.5%",
  // };
  // const thirdColWidth = {
  //     width: "3.7%",
  // };
  // const fifthColWidth = {
  //     width: "37.5%",
  // };
  // const sixthColWidth = {
  //     width: "4%",
  // };
  // const seventhColWidth = {
  //     width: "10%",
  // };
  // const eightColWidth = {
  //     width: "10%",
  // };
  // const ninthColWidth = {
  //     width: "10%",
  // };
  // const tenthColWidth = {
  //     width: "10%",
  // };

  const firstColWidth = {
    width: "90px",
  };
  const secondColWidth = {
    width: "54px",
  };
  const thirdColWidth = {
    width: "32px",
  };
  const fifthColWidth = {
    width: "360px",
  };
  const sixthColWidth = {
    width: "70px",
  };
  const seventhColWidth = {
    width: "100px",
  };
  const eightColWidth = {
    width: "100px",
  };
  const ninthColWidth = {
    width: "100px",
  };
  const tenthColWidth = {
    width: "100px",
  };

  const sixthcol = { width: "8px" };

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
    maxWidth: "1000px",
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


  const formatValue = (val) => {
    if (val === undefined || val === null) return "";
    const num = Number(val);
    return num === 0
      ? ""
      : num.toLocaleString("en-US", {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        });
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
          <NavComponent textdata="Customer Ledger" />
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
                    options={options}
                    value={
                      options.find((opt) => opt.value === saleType) || null
                    } // Ensure correct reference
                    isDisabled={isDoubleClickOpen}
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
                      paddingRight: "25px",
                    }}
                  >
                    <option value="">ALL</option>
                    <option value="CRV">CASH RECEIVE VORCHER</option>
                    <option value="CPV">Cash PAYMENT VORCHER</option>
                    <option value="BRV">Bank RECEIVE VORCHER</option>
                    <option value="BPV">BANK PAYMENT VORCHER</option>
                    <option value="JRV">JOURNAL VORCHER</option>
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
                    {/* <td className="border-dark" style={forthColWidth}>
                                            Item Code
                                        </td> */}
                    <td className="border-dark" style={fifthColWidth}>
                      Description
                    </td>
                    <td className="border-dark" style={sixthColWidth}>
                      Qnty
                    </td>
                    <td className="border-dark" style={seventhColWidth}>
                      Rate
                    </td>
                    <td className="border-dark" style={eightColWidth}>
                      Debit
                    </td>
                    <td className="border-dark" style={ninthColWidth}>
                      Credit
                    </td>
                    <td className="border-dark" style={tenthColWidth}>
                      Balance
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
                maxHeight: "38vh",
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
                        <td colSpan="9" className="text-center">
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
                            {Array.from({ length: 9 }).map((_, colIndex) => (
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
                        {/* <td style={forthColWidth}></td> */}
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
                              {item.Date || ""}
                            </td>
                            <td className="text-center" style={secondColWidth}>
                              {item["Trn#"] || ""}
                            </td>
                            <td className="text-center" style={thirdColWidth}>
                              {item.Type || ""}
                            </td>
                            <td className="text-start" style={fifthColWidth}>
                              {item.Description || ""}
                            </td>
                            <td className="text-end" style={sixthColWidth}>
                              {formatValue(item.Qnty)}
                            </td>
                            <td className="text-end" style={seventhColWidth}>
                              {formatValue(item.Rate)}
                            </td>
                            <td className="text-end" style={eightColWidth}>
                              {formatValue(item.Debit)}
                            </td>
                            <td className="text-end" style={ninthColWidth}>
                              {formatValue(item.Credit)}
                            </td>
                            <td className="text-end" style={tenthColWidth}>
                              {formatValue(item.Balance)}
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
                          {Array.from({ length: 9 }).map((_, colIndex) => (
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
                        {/* <td style={forthColWidth}></td> */}
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

          <div
            style={{
              borderBottom: `1px solid ${fontcolor}`,
              borderTop: `1px solid ${fontcolor}`,
              height: "24px",
              display: "flex",
              paddingRight: "8px",
              justifyContent: "end",
              // width: "101.2%",
            }}
          >
            <div
              style={{
                width: "95px",
                background: getcolor,
                borderRight: `1px solid ${fontcolor}`,
              }}
            >
              <span
                style={{ borderLeft: "1px solid grey" }}
                className="mobileledger_total"
              >
                {formatValue(amt1)}
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


