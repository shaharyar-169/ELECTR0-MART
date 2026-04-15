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
import { Balance } from "@mui/icons-material";

export default function AmericanReceivableAggingReport() {
  const navigate = useNavigate();
  const user = getUserData();
  const organisation = getOrganisationData();
  const yeardescription = getYearDescription();
  const locationnumber = getLocationnumber();
  const DaysRef = useRef(null);
  const input1Ref = useRef(null);
  const input2Ref = useRef(null);
  const input3Ref = useRef(null);
  const input4Ref = useRef(null);
    const AreaRef = useRef(null);
  const TypeRef = useRef(null);
  const SearchRef = useRef(null);
  const Type2Ref = useRef(null);


  const toRef = useRef(null);
  const fromRef = useRef(null);

  const [GetAreaData,setGetAreaData]= useState([])
  const [GetTypeData,setGetTypeData]= useState([])
  const [saleType, setSaleType] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [transectionType, settransectionType] = useState("");
  const [supplierList, setSupplierList] = useState([]);

  const [Amt001, setAmt001] = useState(0);
  const [Amt002, setAmt002] = useState(0);
 const [Amt003, setAmt003] = useState(0);
  const [Amt004, setAmt004] = useState(0);
 const [Amt005, setAmt005] = useState(0);
  const [Amt006, setAmt006] = useState(0);
   const [Total, setTotal] = useState(0);

  const [Companyselectdata, setCompanyselectdata] = useState("");
  const [Companyselectdatavalue, setCompanyselectdatavalue] = useState("");

  console.log('Companyselectdatavalue', )
  const [mobileNumber, setmobileNumber] = useState("30");
  const interval = Number(mobileNumber) || 0;

 const getRanges = (n) => {
  if (!n) return [];

  return [
    { label: `0 - ${n}`, key: "Amt001" },
    { label: `${n} - ${n * 2}`, key: "Amt002" },
    { label: `${n * 2} - ${n * 3}`, key: "Amt003" },
    { label: `${n * 3} - ${n * 4}`, key: "Amt004" },
    { label: `${n * 4} - ${n * 5}`, key: "Amt005" },
    { label: `${n * 5}+`, key: "Amt006" },
  ];
};

const ranges = getRanges(interval);


  const [Cityselectdata, setCityselectdata] = useState("");
  const [Cityselectdatavalue, setCityselectdatavalue] = useState("");

  const [Regionselectdata, setRegionselectdata] = useState("");
  const [Regionselectdatavalue, setRegionselectdatavalue] = useState("");

    const [Typeselectdata, setTypeselectdata] = useState("");
  const [Typeselectdatavalue, setTypeselectdatavalue] = useState("");

   const [Areaselectdata, setAreaselectdata] = useState("");
  const [Areaselectdatavalue, setAreaselectdatavalue] = useState("");

  const [GetCompany, setGetCompany] = useState([]);
    const [GetCity, setGetCity] = useState([]);
      const [GetRegion, setGetRegion] = useState([]);

  console.log('dropdowndata', saleType)

  // state for from DatePicker
  const [selectedfromDate, setSelectedfromDate] = useState(null);
  const [fromInputDate, setfromInputDate] = useState("");
  const [fromCalendarOpen, setfromCalendarOpen] = useState(false);
  // state for To DatePicker
  const [selectedToDate, setSelectedToDate] = useState(null);
  const [toInputDate, settoInputDate] = useState("");
  const [toCalendarOpen, settoCalendarOpen] = useState(false);

  const {
    isSidebarVisible,
    toggleSidebar,
    getcolor,
    fontcolor,
    toggleChangeColor,
    apiLinks,
    getLocationNumber,
    getyeardescription,
    getnavbarbackgroundcolor,
    getfromdate,
    gettodate,
    getfontstyle,
    getdatafontsize,
  } = useTheme();

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
      const selectedOption = input1Ref.current.state.selectValue;
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
  
    const apiUrl = apiLinks + "/AmericanReceivableAgging.php";
    setIsLoading(true);
    const formData = new URLSearchParams({
    //   FLocCod: "001",
    //   FYerDsc: "2025-2025",
    //   code: "AMRELEC",
    
      FRepDat: toInputDate,
      FSalCod : saleType,      
      FCtyCod: Cityselectdata,
      FRegCod: Regionselectdata,
      FTypCod: Typeselectdata,
      FAreCod: Areaselectdata,
      FRepDay: mobileNumber,
      FSchTxt: searchQuery,
    //   FRepTyp: transectionType,

      FLocCod: locationnumber || getLocationNumber,
      FYerDsc: yeardescription || getyeardescription,
      code: organisation.code,
   
   
    }).toString();

    axios
      .post(apiUrl, formData)
      .then((response) => {
        setIsLoading(false);
        console.log("Response:", response.data);

        setAmt001(response.data["Amt001"]);
        setAmt002(response.data["Amt002"]);
        setAmt003(response.data["Amt003"]);
           setAmt004(response.data["Amt004"]);
            setAmt005(response.data["Amt005"]);
             setAmt006(response.data["Amt006"]);
              setTotal(response.data["Total"]);

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

  useEffect(() => {
    const apiUrl = apiLinks + "/GetActiveSalesman.php";
    const formData = new URLSearchParams({
   code: organisation.code,
        FLocCod: locationnumber || getLocationNumber,
                    // code: 'AMRELEC',

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
    value: item.tsalcod,
    label: `${item.tsalcod}-${item.tsaldsc.trim()}`,
  }));

    useEffect(() => {
    const apiUrl = apiLinks + "/GetActiveCity.php";
    const formData = new URLSearchParams({
   code: organisation.code,
        FLocCod: locationnumber || getLocationNumber,
                          // code: 'AMRELEC',

    }).toString();
    axios
      .post(apiUrl, formData)
      .then((response) => {
        if (response.data && Array.isArray(response.data)) {
          setGetCity(response.data);
        } else {
          console.warn(
            "Response data structure is not as expected:",
            response.data
          );
          setGetCity([]);
        }
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  }, []);
  const Cityoptions = GetCity.map((item) => ({
    value: item.tctycod,
    label: `${item.tctycod}-${item.tctydsc.trim()}`,
  }));


  useEffect(() => {
    const apiUrl = apiLinks + "/GetActiveRegion.php";
    const formData = new URLSearchParams({
   code: organisation.code,
        FLocCod: locationnumber || getLocationNumber,
                          // code: 'AMRELEC',
    }).toString();
    axios
      .post(apiUrl, formData)
      .then((response) => {
        if (response.data && Array.isArray(response.data)) {
          setGetRegion(response.data);
        } else {
          console.warn(
            "Response data structure is not as expected:",
            response.data
          );
          setGetRegion([]);
        }
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  }, []);
  const Regionoptions = GetRegion.map((item) => ({
    value: item.tregcod,
    label: `${item.tregcod}-${item.tregdsc.trim()}`,
  }));

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

     useEffect(() => {
      const apiUrl = apiLinks + "/GetActiveType.php";
      const formData = new URLSearchParams({
        code: organisation.code,
        FLocCod: locationnumber || getLocationNumber,
        // code: 'AGFACTORY',
        // FLocCod: '001',

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
    const TypeDataoption = GetTypeData.map((item) => ({
      value: item.ttypcod,
      label: `${item.ttypcod}-${item.ttypdsc.trim()}`,
    }));

  const handleTransactionTypeChange = (event) => {
    const selectedTransactionType = event.target.value;
    settransectionType(selectedTransactionType);
  };

  const handlecompanyKeypress = (event, inputId) => {
    if (event.key === "Enter") {
      const selectedOption = input1Ref.current.state.selectValue;
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

  const exportPDFHandler = () => {
    const globalfontsize = 10;
    console.log("gobal font data", globalfontsize);

    // Create a new jsPDF instance with landscape orientation
    const doc = new jsPDF({ orientation: "landscape" });

    // Define table data (rows)
    const rows = tableData.map((item) => [
      item.Code,
      (item.Customer?.substring(0, 28) || "") ,
      item.Amt001,
      item.Amt002,
      item.Amt003,
      item.Amt004,
      item.Amt005,
      item.Amt006,
      item.Total,
    ]);

    // Add summary row to the table
    rows.push([
         String(formatValue(tableData.length.toLocaleString())),
         "",
       String(formatValue(Amt001)),
       String(formatValue(Amt002)),
       String(formatValue(Amt003)),
       String(formatValue(Amt004)),
       String(formatValue(Amt005)),
       String(formatValue(Amt006)),
       String(formatValue(Total)),
    ]);

  const getRanges = (n) => {
  if (!n) return [];

  return [
    `0 - ${n}`,
    `${n} - ${n * 2}`,
    `${n * 2} - ${n * 3}`,
    `${n * 3} - ${n * 4}`,
    `${n * 4} - ${n * 5}`,
    `${n * 5}+`,
  ];
};

    // Define table column headers and individual column widths
    const headers = [
      "Code",
      "Customer",
        ...getRanges(interval),
       "Total",
    ];
    const columnWidths = [23,70,28,28,28, 28, 28, 28,28];

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

      // Reset font style and size after adding headers
      doc.setFont(getfontstyle);
      doc.setFontSize(10);
    };

     const addTableRows = (startX, startY, startIndex, endIndex) => {
      const rowHeight = 5;
      const fontSize = 10;
      const boldFont = 400;
      const normalFont = getfontstyle;
      const tableWidth = getTotalTableWidth();

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
         doc.setFont("verdana-regular", "normal");
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

          if (cellIndex === 0 ) {
            const rightAlignX = startX + columnWidths[cellIndex] / 2;
            doc.text(cellValue, rightAlignX, cellY, {
              align: "center",
              baseline: "middle",
            });
          } else if (
            cellIndex > 1
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
    const rowsPerPage = 29; // Adjust this value based on your requirements

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
doc.setFont("verdana-regular", "normal");
          doc.setFontSize(10);
                  doc.text(
          `Page ${pageNumber}`,
          rightX - 10,
          doc.internal.pageSize.height - 10,
          { align: "right" }
        );
      };

      let currentPageIndex = 0;
      let startY = paddingTop; // Initialize startY
      let pageNumber = 1; // Initialize page number

      while (currentPageIndex * rowsPerPage < rows.length) {
  doc.setFont("Times New Roman", "normal");
        addTitle(comapnyname, 12, 12, pageNumber, startY, 18); // Render company title with default font size, only date, and page number
        startY += 5; // Adjust vertical position for the company title
  doc.setFont("verdana-regular", "normal");
        addTitle(
          `American Receivable Agging Report From ${fromInputDate} To ${toInputDate}`,
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
        doc.setFontSize(10);
        doc.setFont(getfontstyle, "300");

        let status =
          transectionType === "R"
            ? "RECEIVABLE"
            : transectionType === "P"
            ? "PAYABLE"
            : "ALL";
        let searchdata = searchQuery ? searchQuery : "";

        let accoount = Companyselectdatavalue.label
          ? Companyselectdatavalue.label
          : "ALL";

           let Citycode = Cityselectdatavalue.label
          ? Cityselectdatavalue.label
          : "ALL";

           let Regioncode = Regionselectdatavalue.label
          ? Regionselectdatavalue.label
          : "ALL";

           let Typecode = Typeselectdatavalue.label
          ? Typeselectdatavalue.label
          : "ALL";

           let Areacode = Areaselectdatavalue.label
          ? Areaselectdatavalue.label
          : "ALL";

        // Set font style, size, and family
      

        doc.setFont("verdana", "bold");
        doc.setFontSize(10);
        doc.text(`Saleman :`, labelsX, labelsY + 8.5); // Draw bold label
  doc.setFont("verdana-regular", "normal");
            doc.setFontSize(10);
                    doc.text(`${accoount}`, labelsX + 25, labelsY + 8.5); // Draw the value next to the label

  doc.setFont("verdana", "bold");
            doc.setFontSize(10);  
                  doc.text(`City :`, labelsX + 200, labelsY + 8.5); // Draw bold label
  doc.setFont("verdana-regular", "normal");
            doc.setFontSize(10);
                    doc.text(`${Citycode}`, labelsX + 220, labelsY + 8.5); // Draw the value next to the label

      
  doc.setFont("verdana", "bold");
            doc.setFontSize(10);
                      doc.text(`CustType :`, labelsX , labelsY + 12.5); // Draw bold label
  doc.setFont("verdana-regular", "normal");
            doc.setFontSize(10);
                      doc.text(`${Typecode}`, labelsX + 25, labelsY + 12.5); // Draw the value next to the label
      
  doc.setFont("verdana", "bold");
            doc.setFontSize(10);
                      doc.text(`Region :`, labelsX+200 , labelsY + 12.5); // Draw bold label
  doc.setFont("verdana-regular", "normal");
            doc.setFontSize(10);
                      doc.text(`${Regioncode}`, labelsX + 220, labelsY + 12.5); // Draw the value next to the label
      

  doc.setFont("verdana", "bold");
            doc.setFontSize(10);
                      doc.text(`Area :`, labelsX , labelsY + 16.5); // Draw bold label
  doc.setFont("verdana-regular", "normal");
            doc.setFontSize(10);
                      doc.text(`${Areacode}`, labelsX +25, labelsY + 16.5); // Draw the value next to the label
      
if(searchQuery){
doc.setFont("verdana", "bold");
doc.setFontSize(10);
doc.text(`Search :`, labelsX+200 , labelsY + 16.5); // Draw bold label
doc.setFont("verdana-regular", "normal");
doc.setFontSize(10);
doc.text(`${searchdata}`, labelsX +220, labelsY + 16.5); // Draw the value next to the label
}
     

        startY +=  19 ; // Adjust vertical position for the labels

        addTableHeaders((doc.internal.pageSize.width - totalWidth) / 2, 38);
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
    doc.save(`AmericanReceivableAggingReport As On ${date}.pdf`);
  };

  const handleDownloadCSV = async () => {
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet("Sheet1");

    const numColumns = 9; // Ensure this matches the actual number of columns

    const columnAlignments = [
      "center",
      "left",
       "right",
      "right",
      
      "right",
      "right",
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
      `American Receiable Agging Report From ${fromInputDate} To ${toInputDate}`,
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

    let typestatus = "";

    if (transectionType === "R") {
      typestatus = "RECEIABLE";
    } else if (transectionType === "P") {
      typestatus = "PAYABLE";
    } else {
      typestatus = "ALL"; // Default value
    }

    let typesearch = searchQuery || "";

    let account = Companyselectdatavalue.label
     ? Companyselectdatavalue.label :
     "ALL";

     let Citycode = Cityselectdatavalue.label
     ? Cityselectdatavalue.label :
     "ALL";

     let Regioncode = Regionselectdatavalue.label
     ? Regionselectdatavalue.label :
     "ALL";

      let Typecode = Typeselectdatavalue.label
     ? Typeselectdatavalue.label :
     "ALL";

      let Areacode = Areaselectdatavalue.label
     ? Areaselectdatavalue.label :
     "ALL";

    // Apply styling for the status row
     const typeAndStoreRow2 = worksheet.addRow(
            ["Saleman :", account, "", "", "", "City :", Citycode]
    );

    const typeAndStoreRow3 = worksheet.addRow(
             ["CustType :", Typecode, "", "", "", "Region :", Regioncode]
 );
   const typeAndStoreRow4 = worksheet.addRow(
          searchQuery ?   ["Area :", Areacode, "", "", "", "Search :", typesearch]
          : ["Area :", Areacode]
 );

    // Merge cells for Accountselect (columns B to D)
    //  worksheet.mergeCells(`B${typeAndStoreRow2.number}:D${typeAndStoreRow2.number}`);

    // Apply styling for the status row
 typeAndStoreRow2.eachCell((cell, colIndex) => {
      cell.font = {
        name: "CustomFont" || "CustomFont",
        size: 10,
        bold: [1, 6].includes(colIndex),
      };
      cell.alignment = { horizontal: "left", vertical: "middle" };
    });
    typeAndStoreRow3.eachCell((cell, colIndex) => {
      cell.font = {
        name: "CustomFont" || "CustomFont",
        size: 10,
        bold: [1,6].includes(colIndex),
      };
      cell.alignment = { horizontal: "left", vertical: "middle" };
    });
     typeAndStoreRow4.eachCell((cell, colIndex) => {
      cell.font = {
        name: "CustomFont" || "CustomFont",
        size: 10,
        bold: [1,6].includes(colIndex),
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
  const getRanges = (n) => {
  if (!n) return [];

  return [
    `0 - ${n}`,
    `${n} - ${n * 2}`,
    `${n * 2} - ${n * 3}`,
    `${n * 3} - ${n * 4}`,
    `${n * 4} - ${n * 5}`,
    `${n * 5}+`,
  ];
};

    // Define table column headers and individual column widths
    const headers = [
      "Code",
      "Customer",
        ...getRanges(interval),
       "Total",
    ];
    const headerRow = worksheet.addRow(headers);
    headerRow.eachCell((cell) => Object.assign(cell, headerStyle));

    // Add data rows
    tableData.forEach((item) => {
      const row = worksheet.addRow([
      item.Code,
      item.Customer ,
      item.Amt001 ,
      item.Amt002,
      //  item.Area,
      item.Amt003,
      item.Amt004,
      item.Amt005,
      item.Amt006,
      item.Total,
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
       String(formatValue(tableData.length.toLocaleString())),
       "",
       String(formatValue(Amt001)),
       String(formatValue(Amt002)),
       String(formatValue(Amt003)),
       String(formatValue(Amt004)),
       String(formatValue(Amt005)),
       String(formatValue(Amt006)),
       String(formatValue(Total)),
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

    // Set column widths
    [10, 45,14,14,14,14, 14, 14, 14, ].forEach((width, index) => {
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
      `A${dateTimeRow.number}:${String.fromCharCode(65 + numColumns - 1)}${
        dateTimeRow.number
      }`
    );
    worksheet.mergeCells(
      `A${dateTimeRow1.number}:${String.fromCharCode(65 + numColumns - 1)}${
        dateTimeRow1.number
      }`
    );

    // Generate and save the Excel file
    const buffer = await workbook.xlsx.writeBuffer();
    const blob = new Blob([buffer], {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    });
    saveAs(blob, `AmericanReceivableAggingReport As on ${currentdate}.xlsx`);
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

  const firstColWidth = {
    width: "80px",
  };
  const secondColWidth = {
    width: isSidebarVisible ? "220px" : "380px",
  };
  const thirdColWidth = {
  width: isSidebarVisible ? "95px" : "100px",
  };
  const forthColWidth = {
    width: isSidebarVisible ? "95px" : "100px",
  };
  // const fifthColWidth = {
  // width: isSidebarVisible ? "115px" : "165px",
  // };
  const sixthColWidth = {
   width: isSidebarVisible ? "95px" : "100px",
  };
    const seventhColWidth = {
     width: isSidebarVisible ? "95px" : "100px",
  };
    const eightColWidth = {
      width: isSidebarVisible ? "95px" : "100px",
  };
    const ninthColWidth = {
      width: isSidebarVisible ? "95px" : "100px",
  };
    const tenthColWidth = {
      width: isSidebarVisible ? "95px" : "100px",
  };
  const sixthcol = {
    width: "8px",
  };

  const [columns, setColumns] = useState({
     Code: [],
      Customer: [],
      Amt001: [],
      Amt002: [],
      Amt003: [],
      Amt004: [],
      Amt005: [],
      Amt006: [],
      Total: [],
  });
  const [columnSortOrders, setColumnSortOrders] = useState({
    Code: "",
      Customer: "",
      Amt001: "",
      Amt002: "",
      Amt003: "",
      Amt004: "",
      Amt005: "",
      Amt006: "",
      Total: "",
  });
  // When you receive your initial table data, transform it into column-oriented format
  useEffect(() => {
    if (tableData.length > 0) {
      const newColumns = {
        Code: tableData.map((row) => row.Code),
        Customer: tableData.map((row) => row.Customer),
        Amt001: tableData.map((row) => row.Amt001),
        Amt002: tableData.map((row) => row.Amt002),
        // Area: tableData.map((row) => row.Area),
        Amt003: tableData.map((row) => row.Amt003),
        Amt004: tableData.map((row) => row.Amt004),
        Amt005: tableData.map((row) => row.Amt005),
        Amt006: tableData.map((row) => row.Amt006),
        Total: tableData.map((row) => row.Total),
      };
      setColumns(newColumns);
    }
  }, [tableData]);

  const handleSorting = (col) => {
    const currentOrder = columnSortOrders[col];
    const newOrder = currentOrder === "ASC" ? "DSC" : "ASC";

    const sortedData = [...tableData].sort((a, b) => {
      let aVal = a[col] ?? "";
      let bVal = b[col] ?? "";

      aVal = aVal.toString();
      bVal = bVal.toString();

      // ⭐ SPECIAL CASE: Sort CODE from the RIGHT side
      if (col === "tcstcod" || col === "tcstcod") {
        // Reverse strings → compare from right side
        const revA = aVal.split("").reverse().join("");
        const revB = bVal.split("").reverse().join("");

        return newOrder === "ASC"
          ? revA.localeCompare(revB)
          : revB.localeCompare(revA);
      }

      // ⭐ Numeric sorting
      const numA = parseFloat(aVal.replace(/,/g, ""));
      const numB = parseFloat(bVal.replace(/,/g, ""));

      if (!isNaN(numA) && !isNaN(numB)) {
        return newOrder === "ASC" ? numA - numB : numB - numA;
      }

      // Default → normal string sorting
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
      Code: null,
      Customer: null,
      Amt001: null,
      Amt002: null,
      Amt003: null,
      Amt004: null,
      Amt005: null,
      Amt006: null,
      Total: null,
    });
  };

  const renderTableData = () => {
    return (
      <>
        {isLoading ? (
          <>
            <tr style={{ backgroundColor: getcolor }}>
              <td colSpan="9" className="text-center">
                <Spinner animation="border" variant="primary" />
              </td>
            </tr>
            {Array.from({ length: Math.max(0, 25 - 5) }).map((_, rowIndex) => (
              <tr
                key={`blank-${rowIndex}`}
                style={{
                  backgroundColor: getcolor,
                  color: fontcolor,
                }}
              >
                {Array.from({ length: 9 }).map((_, colIndex) => (
                  <td key={`blank-${rowIndex}-${colIndex}`}>&nbsp;</td>
                ))}
              </tr>
            ))}
            <tr>
              <td style={firstColWidth}></td>
              <td style={secondColWidth}></td>
              <td style={thirdColWidth}></td>
              <td style={forthColWidth}></td>
              {/* <td style={fifthColWidth}></td> */}
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
              const openingNum = Number(
                item.Opening?.toString().replace(/,/g, "")
              );
              const balanceNum = Number(
                item.Balance?.toString().replace(/,/g, "")
              );
              const balancecre = Number(
                item.Credit?.toString().replace(/,/g, "")
              );
              const balancedeb = Number(
                item.Debit?.toString().replace(/,/g, "")
              );

              const isNegative =
                openingNum < 0 ||
                balanceNum < 0 ||
                balancecre < 0 ||
                balancedeb < 0;

              totalEnteries += 1;
              return (
                <tr
                  key={`${i}-${selectedIndex}`}
                  ref={(el) => (rowRefs.current[i] = el)}
                  onClick={() => handleRowClick(i)}
                  className={selectedIndex === i ? "selected-background" : ""}
                  style={{
                    backgroundColor: getcolor,
                    color: isNegative ? "red" : fontcolor,
                  }}
                >
                  <td className="text-start" style={firstColWidth}>
                    {item.Code}
                  </td>

                  {/* <td
                    className="text-start"
                    style={{
                      ...firstColWidth,
                      cursor: "pointer",
                      textDecoration: "underline",
                      // color: "blue",
                      color: selectedIndex === i ? (isNegative ? "white" : 'white') : "blue", // ✅ conditional color
                    }}
                    onDoubleClick={(e) => {
                      e.stopPropagation();
                      // code temporarily store karo
                      sessionStorage.setItem(
                        "AmericanReeciableData",
                        JSON.stringify({
                          code: item.tacccod,
                          fromInputDate: fromInputDate,
                          toInputDate: toInputDate,
                        }),
                      );

                      // fixed URL open karo
                      window.open("/crystalsol/AmericanCustomerLedger", "_blank");
                    }}
                  >
                    {item.tacccod}
                  </td> */}
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
                              {item.Customer}
                            </td>
                  <td
                              className="text-end"
                              title={item.Amt001}
                              style={{
                                ...thirdColWidth,
                                whiteSpace: "nowrap",
                                overflow: "hidden",
                                textOverflow: "ellipsis",
                              }}
                            >
                              {item.Amt001}
                            </td>
                  <td className="text-end" style={forthColWidth}>
                    {item.Amt002}
                  </td>
                {/* <td
                              className="text-start"
                              title={item.Area}
                              style={{
                                ...fifthColWidth,
                                whiteSpace: "nowrap",
                                overflow: "hidden",
                                textOverflow: "ellipsis",
                              }}
                            >
                              {item.Area}
                            </td> */}
                  <td
                              className="text-end"
                              title={item.Amt003}
                              style={{
                                ...sixthColWidth,
                                whiteSpace: "nowrap",
                                overflow: "hidden",
                                textOverflow: "ellipsis",
                              }}
                            >
                              {item.Amt003}
                            </td>
                   <td className="text-end" style={seventhColWidth}>
                    {item.Amt004}
                  </td>
                   <td className="text-end" style={eightColWidth}>
                    {item.Amt005}
                  </td>
                   <td className="text-end" style={ninthColWidth}>
                    {item.Amt006}
                  </td>
                   <td className="text-end" style={tenthColWidth}>
                    {item.Total}
                  </td>
                </tr>
              );
            })}
            {Array.from({
              length: Math.max(0, 25 - tableData.length),
            }).map((_, rowIndex) => (
              <tr
                key={`blank-${rowIndex}`}
                style={{
                  backgroundColor: getcolor,
                  color: fontcolor,
                }}
              >
                {Array.from({ length: 9 }).map((_, colIndex) => (
                  <td key={`blank-${rowIndex}-${colIndex}`}>&nbsp;</td>
                ))}
              </tr>
            ))}
            <tr>
            <td style={firstColWidth}></td>
              <td style={secondColWidth}></td>
              <td style={thirdColWidth}></td>
              <td style={forthColWidth}></td>
              {/* <td style={fifthColWidth}></td> */}
              <td style={sixthColWidth}></td>
              <td style={seventhColWidth}></td>
              <td style={eightColWidth}></td>
              <td style={ninthColWidth}></td>
              <td style={tenthColWidth}></td>
            </tr>
          </>
        )}
      </>
    );
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
  useEffect(() => {
    document.documentElement.style.setProperty("--background-color", getcolor);
  }, [getcolor]);

  const contentStyle = {
     width: "100%", // 100vw ki jagah 100%
    maxWidth: isSidebarVisible ? "1000px" : "1200px",
        // maxWidth: "1000px",

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


const handleMobilenumberInputChange = (e) => {
  let value = e.target.value;

  // Allow only numbers
  value = value.replace(/\D/g, "");

  // Limit to 11 digits
  if (value.length > 11) {
    value = value.slice(0, 11);
  }

  // ❌ if empty or 0 → DO NOTHING (keep previous value)
  if (value === "" || Number(value) === 0) {
    return;
  }

  setmobileNumber(value);
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
          <NavComponent textdata="American Receivable Agging Report" />
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
              
              <div className="d-flex align-items-center" style={{marginLeft:'30px'}}>
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
                        fontSize: parseInt(getdatafontsize),
                        fontWeight: "bold",

                      }}
                    >
                      Date :
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
                    marginLeft: "3px",
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
                      fontSize: parseInt(getdatafontsize),
                      backgroundColor: getcolor,
                      color: fontcolor,
                      opacity: selectedRadio === "custom" ? 1 : 0.5,
                      pointerEvents:
                        selectedRadio === "custom" ? "auto" : "none",
                    }}
                    value={toInputDate}
                    onChange={handleToInputChange}
                    onKeyDown={(e) => handleToKeyPress(e, input1Ref)}
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
                            fontSize: parseInt(getdatafontsize),
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

              {/* ------ */}
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
                      Region :
                    </span>
                  </label>
                </div>

                <div style={{ marginLeft: "3px" }}>
                  <Select
                    className="List-select-class"
                    ref={input2Ref}
                    options={Regionoptions}
                    onKeyDown={(e) => handlecompanyKeypress(e, TypeRef)}
                    id="selectedsale"
                   onChange={(selectedOption) => {
  if (selectedOption && selectedOption.value) {
    setRegionselectdata(selectedOption.value);

    const labelWithoutCode = selectedOption.label.replace(/^[\d-]+-/, "");

    setRegionselectdatavalue({
      value: selectedOption.value,
      label: labelWithoutCode,
    });
  } else {
    setRegionselectdata("");
    setRegionselectdatavalue("");
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
                      ...customStyles1(!Regionselectdata),
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
                      Salesman :
                    </span>
                  </label>
                </div>

                <div style={{ marginLeft: "3px" }}>
                  <Select
                    className="List-select-class"
                    ref={input1Ref}
                    options={options}
                    onKeyDown={(e) => handlecompanyKeypress(e, input3Ref)}
                    id="selectedsale"
                        onChange={(selectedOption) => {
  if (selectedOption && selectedOption.value) {
    setSaleType(selectedOption.value);

    const labelWithoutCode = selectedOption.label.replace(/^[\d-]+-/, "");

    setCompanyselectdatavalue({
      value: selectedOption.value,
      label: labelWithoutCode,
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
                      CustType :
                    </span>
                  </label>
                </div>

                <div style={{ marginLeft: "3px" }}>
                  <Select
                    className="List-select-class"
                    ref={TypeRef}
                    options={TypeDataoption}
                    onKeyDown={(e) => handlecompanyKeypress(e, DaysRef)}
                    id="selectedsale"
                                                  onChange={(selectedOption) => {
  if (selectedOption && selectedOption.value) {
    setTypeselectdata(selectedOption.value);

    const labelWithoutCode = selectedOption.label.replace(/^[\d-]+-/, "");

    setTypeselectdatavalue({
      value: selectedOption.value,
      label: labelWithoutCode,
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
                      ...customStyles1(!Regionselectdata),
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
                      City :
                    </span>
                  </label>
                </div>

                <div style={{ marginLeft: "3px" }}>
                  <Select
                    className="List-select-class"
                    ref={input3Ref}
                    options={Cityoptions}
                    onKeyDown={(e) => handlecompanyKeypress(e, AreaRef)}
                    id="selectedsale"
                    onChange={(selectedOption) => {
  if (selectedOption && selectedOption.value) {
    setCityselectdata(selectedOption.value);

    const labelWithoutCode = selectedOption.label.replace(/^[\d-]+-/, "");

    setCityselectdatavalue({
      value: selectedOption.value,
      label: labelWithoutCode,
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
                      ...customStyles1(!Cityselectdata),
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

            <div className="d-flex align-items-center " style={{marginRight:'21px'}}>
                                <div
                                    style={{
                                        width: "80px",
                                        display: "flex",
                                        justifyContent: "end",
                                    }}
                                >
                                    <label htmlFor="fromDatePicker">
                                        <span style={{ fontSize: getdatafontsize, fontFamily: getfontstyle, fontWeight: "bold" }}>
                                            Days :
                                        </span>{" "}
                                        <br />
                                    </label>
                                </div>

                                <input
                                    ref={DaysRef}
                                    value={mobileNumber}
                                    onKeyDown={(e) => handleKeyPress(e, SearchRef)}
                                    onChange={handleMobilenumberInputChange}
                                    autoComplete="off"
                                    type="tel"
                                    id="phone"
                                    name="phone"
                                    // placeholder="0302-1127364"
                                    style={{
                                        color: fontcolor,
                                        width: "250px",
                                        height: "24px",
                                        fontSize: getdatafontsize, fontFamily: getfontstyle, border: `1px solid ${fontcolor}`,
                                        backgroundColor: getcolor,
                                        outline: "none",
                                        paddingLeft: "10px",
                                        cursor: "text",
                                        marginLeft: "3px",
                                    }}
                                    onFocus={(e) =>
                                        (e.currentTarget.style.border = "2px solid red")
                                    }
                                    onBlur={(e) =>
                                        (e.currentTarget.style.border = `1px solid ${fontcolor}`)
                                    }
                                />
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
                      Aera :
                    </span>
                  </label>
                </div>

                <div style={{ marginLeft: "3px" }}>
                  <Select
                    className="List-select-class"
                    ref={AreaRef}
                    options={AreaDataoption}
                    onKeyDown={(e) => handleKeyPress(e, input2Ref)}
                    id="selectedsale"
                                onChange={(selectedOption) => {
  if (selectedOption && selectedOption.value) {
    setAreaselectdata(selectedOption.value);

    const labelWithoutCode = selectedOption.label.replace(/^[\d-]+-/, "");

    setAreaselectdatavalue({
      value: selectedOption.value,
      label: labelWithoutCode,
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

              <div id="lastDiv"  style={{marginRight:'1px'}}>
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
                    onKeyDown={(e) => handleKeyPress(e, input4Ref)}
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
            <div
              style={{
                overflowY: "auto",
                // width: "98.3%",
              }}
            >
              <table
                className="myTable"
                id="table"
                style={{
                  fontSize: parseInt(getdatafontsize),
                  //   width: "100%",
                  position: "relative",
                }}
              >
                <thead
                  style={{
                    fontWeight: "bold",
                    height: "24px",
                    position: "sticky",
                    top: 0,
                    boxShadow: "0 2px 4px rgba(0, 0, 0, 0.2)",
                    backgroundColor: getnavbarbackgroundcolor,
                  }}
                >
                  {/* <tr
                    style={{
                      backgroundColor: getnavbarbackgroundcolor,
                      color: "white",
                    }}
                  >
                    <td
                      className="border-dark"
                      style={firstColWidth}
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
                      style={secondColWidth}
                      onClick={() => handleSorting("Customer")}
                    >
                      Customer{" "}
                      <i
                        className="fa-solid fa-caret-down caretIconStyle"
                        style={getIconStyle("Customer")}
                      ></i>
                    </td>

                    <td
                      className="border-dark"
                      style={thirdColWidth}
                      onClick={() => handleSorting("Amt001")}
                    >
                      0 - 30{" "}
                      <i
                        className="fa-solid fa-caret-down caretIconStyle"
                        style={getIconStyle("Amt001")}
                      ></i>
                    </td>

                    <td
                      className="border-dark"
                      style={forthColWidth}
                      onClick={() => handleSorting("Amt002")}
                    >
                      30 - 60{" "}
                      <i
                        className="fa-solid fa-caret-down caretIconStyle"
                        style={getIconStyle("Amt002")}
                      ></i>
                    </td>

                                       <td
                      className="border-dark"
                      style={sixthColWidth}
                      onClick={() => handleSorting("Amt003")}
                    >
                      61 - 90{" "}
                      <i
                        className="fa-solid fa-caret-down caretIconStyle"
                        style={getIconStyle("Amt003")}
                      ></i>
                    </td>

                     <td
                      className="border-dark"
                      style={seventhColWidth}
                      onClick={() => handleSorting("Amt004")}
                    >
                      91 - 120{" "}
                      <i
                        className="fa-solid fa-caret-down caretIconStyle"
                        style={getIconStyle("Amt004")}
                      ></i>
                    </td>

                     <td
                      className="border-dark"
                      style={eightColWidth}
                      onClick={() => handleSorting("Amt005")}
                    >
                      121 - 180{" "}
                      <i
                        className="fa-solid fa-caret-down caretIconStyle"
                        style={getIconStyle("Amt005")}
                      ></i>
                    </td>

                     <td
                      className="border-dark"
                      style={ninthColWidth}
                      onClick={() => handleSorting("Amt006")}
                    >
                      180+{" "}
                      <i
                        className="fa-solid fa-caret-down caretIconStyle"
                        style={getIconStyle("Amt006")}
                      ></i>
                    </td>
                     <td
                      className="border-dark"
                      style={tenthColWidth}
                      onClick={() => handleSorting("Total")}
                    >
                      Total{" "}
                      <i
                        className="fa-solid fa-caret-down caretIconStyle"
                        style={getIconStyle("Total")}
                      ></i>
                    </td>

                    <td className="border-dark" style={sixthcol}></td>
                  </tr> */}

                  

<tr
  style={{
    backgroundColor: getnavbarbackgroundcolor,
    color: "white",
    cursor:'pointer'
  }}
>
  <td style={firstColWidth} onClick={() => handleSorting("Code")}>
    Code {" "}
    
 <i
                        className="fa-solid fa-caret-down caretIconStyle"
                        style={getIconStyle("Code")}
                      ></i>  </td>

  <td style={secondColWidth} onClick={() => handleSorting("Customer")}>
    Customer{" "}
 <i
                        className="fa-solid fa-caret-down caretIconStyle"
                        style={getIconStyle("Customer")}
                      ></i>  </td>

  {/* 🔥 Dynamic Range Columns */}
  {ranges.map((r, i) => (
    <td
      key={i}
      style={thirdColWidth}
      onClick={() => handleSorting(r.key)}
    >
      {r.label}{" "}
      <i
        className="fa-solid fa-caret-down caretIconStyle"
        style={getIconStyle(r.key)}
      />
    </td>
  ))}

  <td style={tenthColWidth} onClick={() => handleSorting("Total")}>
    Total{" "}

     <i
                        className="fa-solid fa-caret-down caretIconStyle"
                        style={getIconStyle("Total")}
                      ></i>
  </td>

  <td style={sixthcol}></td>
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
                  ...(tableData.length > 0 ? { tableLayout: "fixed" } : {}),
                }}
              >
                <tbody id="tablebody" >
                  {renderTableData()}
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
              <span className="mobileledger_total2">
                {formatValue(tableData.length.toLocaleString()) }
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
              <span className="mobileledger_total">{formatValue(Amt001)}</span>
            </div>
            <div
              style={{
                ...forthColWidth,
                background: getcolor,
                borderRight: `1px solid ${fontcolor}`,
              }}
            >
              <span className="mobileledger_total">{formatValue(Amt002)}</span>
            </div>
            {/* <div
              style={{
                ...fifthColWidth,
                background: getcolor,
                borderRight: `1px solid ${fontcolor}`,
              }}
            >
              <span className="mobileledger_total">{totalCredit}</span>
            </div> */}
            <div
              style={{
                ...sixthColWidth,
                background: getcolor,
                borderRight: `1px solid ${fontcolor}`,
              }}
            >
              <span className="mobileledger_total">{formatValue(Amt003)}</span>
            </div>
             <div
              style={{
                ...seventhColWidth,
                background: getcolor,
                borderRight: `1px solid ${fontcolor}`,
              }}
            >
              <span className="mobileledger_total">{formatValue(Amt004)}</span>
            </div>
             <div
              style={{
                ...eightColWidth,
                background: getcolor,
                borderRight: `1px solid ${fontcolor}`,
              }}
            >
              <span className="mobileledger_total">{formatValue(Amt005)}</span>
            </div>
             <div
              style={{
                ...ninthColWidth,
                background: getcolor,
                borderRight: `1px solid ${fontcolor}`,
              }}
            >
              <span className="mobileledger_total">{formatValue(Amt006)}</span>
            </div>
             <div
              style={{
                ...tenthColWidth,
                background: getcolor,
                borderRight: `1px solid ${fontcolor}`,
              }}
            >
              <span className="mobileledger_total">{formatValue(Total)}</span>
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
              ref={input4Ref}
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
    </>
  );
}
