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
import { Balance, CreditCard, Description } from "@mui/icons-material";
import { autoTable } from "jspdf-autotable";
import { FaWhatsapp } from "react-icons/fa";
// import "./ledger.css";
import { stringify } from "qs";

// export default function GeneralLedger() {
//   const navigate = useNavigate();
//   const user = getUserData();
//   const organisation = getOrganisationData();

//   const saleSelectRef = useRef(null);
//   const input1Ref = useRef(null);
//   const input2Ref = useRef(null);
//   const input3Ref = useRef(null);

//   const toRef = useRef(null);
//   const fromRef = useRef(null);
//   const hasInitialized = useRef(false);

//   const [saleType, setSaleType] = useState("");
//   const [searchQuery, setSearchQuery] = useState("");
//   const [transectionType, settransectionType] = useState("");
//   const [supplierList, setSupplierList] = useState([]);

//   // DOUBLE STATE HANDLE
//   const [isItemInitialized, setIsItemInitialized] = useState(false);
//   const [isCodeReady, setIsCodeReady] = useState(false);
//   const [isDoubleClickOpen, setIsDoubleClickOpen] = useState(false);

//   const [tableData, setTableData] = useState([]);

//   const [totalQnty, setTotalQnty] = useState(0);
//   const [totalOpening, setTotalOpening] = useState(0);
//   const [totalDebit, setTotalDebit] = useState(0);
//   const [totalCredit, setTotalCredit] = useState(0);
//   const [closingBalance, setClosingBalance] = useState(0);

//   const [Companyselectdatavalue, setCompanyselectdatavalue] = useState("");

//   console.log("Companyselectdatavalue", Companyselectdatavalue.label);

//   // state for from DatePicker
//   const [selectedfromDate, setSelectedfromDate] = useState(null);
//   const [fromInputDate, setfromInputDate] = useState("");
//   const [fromCalendarOpen, setfromCalendarOpen] = useState(false);
//   // state for To DatePicker
//   const [selectedToDate, setSelectedToDate] = useState(null);
//   const [toInputDate, settoInputDate] = useState("");
//   const [toCalendarOpen, settoCalendarOpen] = useState(false);

//   const yeardescription = getYearDescription();
//   const locationnumber = getLocationnumber();

//   const {
//     isSidebarVisible,
//     toggleSidebar,
//     getcolor,
//     fontcolor,
//     toggleChangeColor,
//     apiLinks,
//     getLocationNumber,
//     getyeardescription,
//     getfromdate,
//     gettodate,
//     getfontstyle,
//     getdatafontsize,
//     getnavbarbackgroundcolor,
//   } = useTheme();

//   useEffect(() => {
//     document.documentElement.style.setProperty("--background-color", getcolor);
//     document.documentElement.style.setProperty("--font-color", fontcolor);
//   }, [getcolor, fontcolor]);

//   const comapnyname = organisation.description;

//   const [selectedRadio, setSelectedRadio] = useState("custom"); // State to track selected radio button

//   //////////////////////// CUSTOM DATE LIMITS ////////////////////////////

//   const fromdatevalidate = getfromdate;
//   const todatevaliadete = gettodate;

//   const convertToDate = (dateString) => {
//     const [day, month, year] = dateString.split("-");
//     return new Date(year, month - 1, day);
//   };

//   const GlobalfromDate = convertToDate(fromdatevalidate);
//   const GlobaltoDate = convertToDate(todatevaliadete);

//   const formatDate1 = (date) => {
//     return `${String(date.getDate()).padStart(2, "0")}-${String(
//       date.getMonth() + 1,
//     ).padStart(2, "0")}-${date.getFullYear()}`;
//   };

//   const GlobalfromDate1 = formatDate1(GlobalfromDate);
//   const GlobaltoDate1 = formatDate1(GlobaltoDate);

//   //////////////////////// CUSTOM DATE LIMITS ////////////////////////////

//   // Toggle the ToDATE && FromDATE CalendarOpen state on each click
//   const toggleFromCalendar = () => {
//     setfromCalendarOpen((prevOpen) => !prevOpen);
//   };
//   const toggleToCalendar = () => {
//     settoCalendarOpen((prevOpen) => !prevOpen);
//   };
//   const formatDate = (date) => {
//     const day = date.getDate().toString().padStart(2, "0");
//     const month = (date.getMonth() + 1).toString().padStart(2, "0");
//     const year = date.getFullYear();
//     return `${day}-${month}-${year}`;
//   };
//   const handlefromDateChange = (date) => {
//     setSelectedfromDate(date);
//     setfromInputDate(date ? formatDate(date) : "");
//     setfromCalendarOpen(false);
//   };
//   const handlefromInputChange = (e) => {
//     setfromInputDate(e.target.value);
//   };

//   const handlefromKeyPress = (e, inputId) => {
//     if (e.key === "Enter") {
//       e.preventDefault();
//       const fromDateElement = document.getElementById("fromdatevalidation");
//       const formattedInput = fromInputDate.replace(
//         /^(\d{2})(\d{2})(\d{4})$/,
//         "$1-$2-$3",
//       );
//       const datePattern = /^(0[1-9]|[12][0-9]|3[01])-(0[1-9]|1[0-2])-\d{4}$/;

//       if (formattedInput.length === 10 && datePattern.test(formattedInput)) {
//         const [day, month, year] = formattedInput.split("-").map(Number);

//         if (month > 12 || month === 0) {
//           toast.error("Please enter a valid month (MM) between 01 and 12");
//           return;
//         }

//         const daysInMonth = new Date(year, month, 0).getDate();
//         if (day > daysInMonth || day === 0) {
//           toast.error(`Please enter a valid day (DD) for month ${month}`);
//           return;
//         }

//         const currentDate = new Date();
//         const enteredDate = new Date(year, month - 1, day);

//         if (GlobalfromDate && enteredDate < GlobalfromDate) {
//           toast.error(
//             `Date must be after ${GlobalfromDate1} and before ${GlobaltoDate1}`,
//           );
//           return;
//         }
//         if (GlobalfromDate && enteredDate > GlobaltoDate) {
//           toast.error(
//             `Date must be after ${GlobalfromDate1} and before ${GlobaltoDate1}`,
//           );
//           return;
//         }

//         fromDateElement.style.border = `1px solid ${fontcolor}`;
//         setfromInputDate(formattedInput);

//         const nextInput = document.getElementById(inputId);
//         if (nextInput) {
//           nextInput.focus();
//           nextInput.select();
//         } else {
//           document.getElementById("submitButton").click();
//         }
//       } else {
//         toast.error("Date must be in the format dd-mm-yyyy");
//       }
//     }
//   };

//   const handleToKeyPress = (e) => {
//     if (e.key === "Enter") {
//       e.preventDefault();
//       const toDateElement = document.getElementById("todatevalidation");
//       const formattedInput = toInputDate.replace(
//         /^(\d{2})(\d{2})(\d{4})$/,
//         "$1-$2-$3",
//       );
//       const datePattern = /^(0[1-9]|[12][0-9]|3[01])-(0[1-9]|1[0-2])-\d{4}$/;

//       if (formattedInput.length === 10 && datePattern.test(formattedInput)) {
//         const [day, month, year] = formattedInput.split("-").map(Number);

//         if (month > 12 || month === 0) {
//           toast.error("Please enter a valid month (MM) between 01 and 12");
//           return;
//         }

//         const daysInMonth = new Date(year, month, 0).getDate();
//         if (day > daysInMonth || day === 0) {
//           toast.error(`Please enter a valid day (DD) for month ${month}`);
//           return;
//         }

//         const currentDate = new Date();
//         const enteredDate = new Date(year, month - 1, day);

//         if (GlobaltoDate && enteredDate > GlobaltoDate) {
//           toast.error(
//             `Date must be after ${GlobalfromDate1} and before ${GlobaltoDate1}`,
//           );
//           return;
//         }

//         if (GlobaltoDate && enteredDate < GlobalfromDate) {
//           toast.error(
//             `Date must be after ${GlobalfromDate1} and before ${GlobaltoDate1}`,
//           );
//           return;
//         }

//         if (fromInputDate) {
//           const fromDate = new Date(
//             fromInputDate.split("-").reverse().join("-"),
//           );
//           if (enteredDate <= fromDate) {
//             toast.error("To date must be after from date");
//             return;
//           }
//         }

//         toDateElement.style.border = `1px solid ${fontcolor}`;
//         settoInputDate(formattedInput);

//         if (input1Ref.current) {
//           e.preventDefault();
//           input1Ref.current.focus();
//         }
//       } else {
//         toast.error("Date must be in the format dd-mm-yyyy");
//       }
//     }
//   };

//   const handleToDateChange = (date) => {
//     setSelectedToDate(date);
//     settoInputDate(date ? formatDate(date) : "");
//     settoCalendarOpen(false);
//   };
//   const handleToInputChange = (e) => {
//     settoInputDate(e.target.value);
//   };

//   const handleSaleKeypress = (event, inputId) => {
//     if (event.key === "Enter") {
//       const selectedOption = saleSelectRef.current.state.selectValue;
//       if (selectedOption && selectedOption.value) {
//         setSaleType(selectedOption.value);
//       }
//       const nextInput = document.getElementById(inputId);
//       if (nextInput) {
//         nextInput.focus();
//         nextInput.select();
//       } else {
//         document.getElementById("submitButton").click();
//       }
//     }
//   };

//   const handleKeyPress = (e, nextInputRef) => {
//     if (e.key === "Enter") {
//       e.preventDefault();
//       if (nextInputRef.current) {
//         nextInputRef.current.focus();
//       }
//     }
//   };

//   function fetchReceivableReport() {
//     const fromDateElement = document.getElementById("fromdatevalidation");
//     const toDateElement = document.getElementById("todatevalidation");

//     const dateRegex = /^\d{2}-\d{2}-\d{4}$/;

//     let hasError = false;
//     let errorType = "";

//     switch (true) {
//       case !saleType:
//         errorType = "saleType";
//         break;
//       case !fromInputDate:
//         errorType = "fromDate";
//         break;
//       case !toInputDate:
//         errorType = "toDate";
//         break;
//       default:
//         hasError = false;
//         break;
//     }

//     if (!dateRegex.test(fromInputDate)) {
//       errorType = "fromDateInvalid";
//     } else if (!dateRegex.test(toInputDate)) {
//       errorType = "toDateInvalid";
//     } else {
//       const formattedFromInput = fromInputDate.replace(
//         /^(\d{2})(\d{2})(\d{4})$/,
//         "$1-$2-$3",
//       );
//       const [fromDay, fromMonth, fromYear] = formattedFromInput
//         .split("-")
//         .map(Number);
//       const enteredFromDate = new Date(fromYear, fromMonth - 1, fromDay);

//       const formattedToInput = toInputDate.replace(
//         /^(\d{2})(\d{2})(\d{4})$/,
//         "$1-$2-$3",
//       );
//       const [toDay, toMonth, toYear] = formattedToInput.split("-").map(Number);
//       const enteredToDate = new Date(toYear, toMonth - 1, toDay);

//       if (GlobalfromDate && enteredFromDate < GlobalfromDate) {
//         errorType = "fromDateBeforeGlobal";
//       } else if (GlobaltoDate && enteredFromDate > GlobaltoDate) {
//         errorType = "fromDateAfterGlobal";
//       } else if (GlobaltoDate && enteredToDate > GlobaltoDate) {
//         errorType = "toDateAfterGlobal";
//       } else if (GlobaltoDate && enteredToDate < GlobalfromDate) {
//         errorType = "toDateBeforeGlobal";
//       } else if (enteredToDate < enteredFromDate) {
//         errorType = "toDateBeforeFromDate";
//       }
//     }

//     switch (errorType) {
//       case "saleType":
//         toast.error("Please select a Account Code");
//         return;

//       case "fromDate":
//         toast.error("From date is required");
//         return;
//       case "toDate":
//         toast.error("To date is required");
//         return;
//       case "fromDateInvalid":
//         toast.error("From date must be in the format dd-mm-yyyy");
//         return;
//       case "toDateInvalid":
//         toast.error("To date must be in the format dd-mm-yyyy");
//         return;
//       case "fromDateBeforeGlobal":
//         toast.error(
//           `From date must be after ${GlobalfromDate1} and before ${GlobaltoDate1}`,
//         );
//         return;
//       case "fromDateAfterGlobal":
//         toast.error(
//           `From date must be after ${GlobalfromDate1} and before ${GlobaltoDate1}`,
//         );
//         return;
//       case "toDateAfterGlobal":
//         toast.error(
//           `To date must be after ${GlobalfromDate1} and before ${GlobaltoDate1}`,
//         );
//         return;
//       case "toDateBeforeGlobal":
//         toast.error(
//           `To date must be after ${GlobalfromDate1} and before ${GlobaltoDate1}`,
//         );
//         return;
//       case "toDateBeforeFromDate":
//         toast.error("To date must be after from date");
//         return;

//       default:
//         break;
//     }

//     // console.log(data);
//     document.getElementById("fromdatevalidation").style.border =
//       `1px solid ${fontcolor}`;
//     document.getElementById("todatevalidation").style.border =
//       `1px solid ${fontcolor}`;

//     const apiUrl = apiLinks + "/GeneralLedger.php";
//     setIsLoading(true);
//     const formData = new URLSearchParams({
//       FIntDat: fromInputDate,
//       FFnlDat: toInputDate,
//       FTrnTyp: transectionType,
//       FAccCod: saleType,
//       code: organisation.code,
//       FLocCod: locationnumber || getLocationNumber,
//       FYerDsc: yeardescription || getYearDescription,

//       // code: 'AGCOMP',
//       // FLocCod: '001',
//       // FYerDsc: '2025-2025'
//     }).toString();

//     axios
//       .post(apiUrl, formData)
//       .then((response) => {
//         setIsLoading(false);

//         setTotalDebit(response.data["Total Debit "]);
//         setTotalCredit(response.data["Total Credit"]);
//         setClosingBalance(response.data["Closing Bal "]);

//         if (response.data && Array.isArray(response.data.Detail)) {
//           setTableData(response.data.Detail);
//         } else {
//           console.warn(
//             "Response data structure is not as expected:",
//             response.data.Detail,
//           );
//           setTableData([]);
//         }
//       })
//       .catch((error) => {
//         console.error("Error:", error);
//         setIsLoading(false);
//       });
//   }

//   useEffect(() => {
//     const hasComponentMountedPreviously =
//       sessionStorage.getItem("componentMounted");
//     if (
//       !hasComponentMountedPreviously ||
//       (saleSelectRef && saleSelectRef.current)
//     ) {
//       if (saleSelectRef && saleSelectRef.current) {
//         setTimeout(() => {
//           saleSelectRef.current.focus();
//           // saleSelectRef.current.select();
//         }, 0);
//       }
//       sessionStorage.setItem("componentMounted", "true");
//     }
//   }, []);

//      useEffect(() => {
//       const storedData = sessionStorage.getItem("GeneralLedgerData");

//       let toDate = new Date(); // default today
//       let fromDate = new Date(toDate.getFullYear(), toDate.getMonth(), 1);

//       if (storedData) {
//         const parsedData = JSON.parse(storedData);

//         // ✅ TO DATE
//         if (parsedData.toInputDate) {
//           const [day, month, year] = parsedData.toInputDate.split("-").map(Number);
//           toDate = new Date(year, month - 1, day);
//         }

//         // ✅ FROM DATE
//         if (parsedData.fromInputDate) {
//           // Case: Payable Report (both dates)
//           const [day, month, year] = parsedData.fromInputDate.split("-").map(Number);
//           fromDate = new Date(year, month - 1, day);
//         } else {
//           // Case: Payable Aging (only toDate)
//           fromDate = new Date(toDate.getFullYear(), toDate.getMonth(), 1);
//         }
//       }

//       // ✅ Apply states
//       setSelectedToDate(toDate);
//       settoInputDate(formatDate(toDate));

//       setSelectedfromDate(fromDate);
//       setfromInputDate(formatDate(fromDate));

//     }, []);

// useEffect(() => {
//   const apiUrl = apiLinks + "/GetActiveAccounts.php";
//   const formData = new URLSearchParams({
//   code: organisation.code,
//       FLocCod: locationnumber || getLocationNumber,

//     //  FLocCod: '001',
//     // code: 'AGCOMP',
//   }).toString();

//   axios
//     .post(apiUrl, formData)
//     .then((response) => {
//       // Ensure we always have an array
//       const data = response.data || [];
//       setSupplierList(data);
//     })
//     .catch((error) => {
//       console.error("Error fetching data:", error);
//       setSupplierList([]); // fallback to empty array
//     });
// }, []);

// // Create options, filtering out invalid items
// const options = (supplierList || [])
//   .filter(item => item?.tacccod != null) // keep only items with a valid tacccod
//   .map(item => ({
//     value: item.tacccod,
//     label: `${item.tacccod}${item.taccdsc ? ` - ${item.taccdsc.trim()}` : ''}`
//   }));

//   useEffect(() => {
//     if (options.length === 0) return;
//     if (isItemInitialized) return;

//     const storedData = sessionStorage.getItem("GeneralLedgerData");
//     let selectedOption = null;

//     if (storedData) {
//       const parsedData = JSON.parse(storedData);
//       const clickedCode = parsedData.code?.trim();
//       if (parsedData.code) {
//         setIsDoubleClickOpen(true); // ✅ ADD
//       }
//       selectedOption = options.find((opt) => opt.value?.trim() === clickedCode);

//       sessionStorage.removeItem("GeneralLedgerData");
//     }

//     if (!selectedOption) {
//       selectedOption = options[0];
//     }

//     if (selectedOption) {
//       setSaleType(selectedOption.value);

//       const description = selectedOption.label
//         .split("-")
//         .slice(1)
//         .join("-")
//         .trim();

//       setCompanyselectdatavalue({
//         value: selectedOption.value,
//         label: description,
//       });

//       setIsCodeReady(true); // ✅ IMPORTANT
//     }

//     setIsItemInitialized(true);
//   }, [options, isItemInitialized]);

//   useEffect(() => {
//     // 🔥 Dono cheezain ready hon
//     if (isDoubleClickOpen && isCodeReady) {
//       fetchReceivableReport();
//     }
//   }, [isDoubleClickOpen, isCodeReady]);

//   const DropdownOption = (props) => {
//     return (
//       <components.Option {...props}>
//         <div
//           style={{
//             fontSize: getdatafontsize,
//             fontFamily: getfontstyle,
//             paddingBottom: "5px",
//             lineHeight: "3px",
//             // color: fontcolor,
//             textAlign: "start",
//           }}
//         >
//           {props.data.label}
//         </div>
//       </components.Option>
//     );
//   };

//   const customStyles1 = (hasError) => ({
//     control: (base, state) => ({
//       ...base,
//       height: "24px",
//       minHeight: "unset",
//       width: 360,
//       fontSize: getdatafontsize,
//       fontFamily: getfontstyle,
//       backgroundColor: getcolor,
//       color: fontcolor,
//       caretColor: getcolor === "white" ? "black" : "white",
//       borderRadius: 0,
//       border: `1px solid ${fontcolor}`,
//       transition: "border-color 0.15s ease-in-out",
//       "&:hover": {
//         borderColor: state.isFocused ? base.borderColor : fontcolor,
//       },
//       padding: "0 8px",
//       display: "flex",
//       alignItems: "center",
//       justifyContent: "space-between",
//       boxShadow: "none",
//       "&:focus-within": {
//         borderColor: "#3368B5",
//         boxShadow: "0 0 0 1px #3368B5",
//       },
//     }),

//     menu: (base) => ({
//       ...base,
//       marginTop: "5px",
//       borderRadius: 0,
//       backgroundColor: getcolor,
//       border: `1px solid ${fontcolor}`,
//       boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
//       zIndex: 9999,
//     }),
//     menuList: (base) => ({
//       ...base,
//       padding: 0,
//       maxHeight: "200px",
//       // Scrollbar styling for Webkit browsers
//       "&::-webkit-scrollbar": {
//         width: "8px",
//         height: "8px",
//       },
//       "&::-webkit-scrollbar-track": {
//         background: getcolor,
//         borderRadius: "10px",
//       },
//       "&::-webkit-scrollbar-thumb": {
//         backgroundColor: fontcolor,
//         borderRadius: "10px",
//         border: `2px solid ${getcolor}`,
//         "&:hover": {
//           backgroundColor: "#3368B5",
//         },
//       },
//       // Scrollbar styling for Firefox
//       scrollbarWidth: "thin",
//       scrollbarColor: `${fontcolor} ${getcolor}`,
//     }),
//     option: (base, state) => ({
//       ...base,
//       fontSize: getdatafontsize,
//       fontFamily: getfontstyle,
//       backgroundColor: state.isSelected
//         ? "#3368B5"
//         : state.isFocused
//           ? "#3368B5"
//           : getcolor,
//       color: state.isSelected || state.isFocused ? "white" : fontcolor,
//       "&:hover": {
//         backgroundColor: "#3368B5",
//         color: "white",
//         cursor: "pointer",
//       },
//       "&:active": {
//         backgroundColor: "#1a66cc",
//       },
//       transition: "background-color 0.2s ease, color 0.2s ease",
//     }),
//     dropdownIndicator: (base, state) => ({
//       ...base,
//       padding: 0,
//       marginTop: "-5px",
//       fontSize: "18px",
//       display: "flex",
//       textAlign: "center",
//       color: fontcolor,
//       transition: "transform 0.2s ease",
//       transform: state.selectProps.menuIsOpen
//         ? "rotate(180deg)"
//         : "rotate(0deg)",
//       "&:hover": {
//         color: "#3368B5",
//       },
//     }),
//     indicatorSeparator: () => ({
//       display: "none",
//     }),
//     singleValue: (base) => ({
//       ...base,
//       marginTop: "-5px",
//       textAlign: "left",
//       color: fontcolor,
//       fontSize: getdatafontsize,
//       fontFamily: getfontstyle,
//     }),
//     input: (base) => ({
//       ...base,
//       color: getcolor === "white" ? "black" : fontcolor,
//       caretColor: getcolor === "white" ? "black" : "white",
//       marginTop: "-5px",
//     }),
//     clearIndicator: (base) => ({
//       ...base,
//       marginTop: "-5px",
//       padding: "0 4px",
//       color: fontcolor,
//       "&:hover": {
//         color: "#ff4444",
//       },
//     }),
//     placeholder: (base) => ({
//       ...base,
//       color: `${fontcolor}80`, // 50% opacity
//       fontSize: getdatafontsize,
//       fontFamily: getfontstyle,
//       marginTop: "-5px",
//     }),
//     noOptionsMessage: (base) => ({
//       ...base,
//       fontSize: getdatafontsize,
//       fontFamily: getfontstyle,
//       color: fontcolor,
//       backgroundColor: getcolor,
//     }),
//     loadingMessage: (base) => ({
//       ...base,
//       fontSize: getdatafontsize,
//       fontFamily: getfontstyle,
//       color: fontcolor,
//       backgroundColor: getcolor,
//     }),
//     multiValue: (base) => ({
//       ...base,
//       backgroundColor: `${fontcolor}20`, // Light background for tags
//     }),
//     multiValueLabel: (base) => ({
//       ...base,
//       color: fontcolor,
//       fontSize: getdatafontsize,
//       fontFamily: getfontstyle,
//     }),
//     multiValueRemove: (base) => ({
//       ...base,
//       color: `${fontcolor}80`,
//       "&:hover": {
//         backgroundColor: "#ff4444",
//         color: "white",
//       },
//     }),
//   });

//   const handleTransactionTypeChange = (event) => {
//     const selectedTransactionType = event.target.value;
//     settransectionType(selectedTransactionType);
//   };

//   ///////////////////////////// DOWNLOAD PDF CODE ////////////////////////////////////////////////////////////

//   const exportPDFHandler = () => {
//     // Create a new jsPDF instance with landscape orientation
//     const doc = new jsPDF({ orientation: "landscape" });

//     // Define table data (rows)
//     const rows = tableData.map((item) => [
//       item.Date,
//       item["Trn#"],
//       item.Type,
//       item.Description,
//       item.Debit,
//       item.Credit,
//       item.Balance,
//     ]);

//     // Add summary row to the table

//     rows.push([
//       "",
//       "",
//       "",
//       "Total",
//       String(formatValue(totalDebit)),
//       String(formatValue(totalCredit)),
//       String(formatValue(closingBalance)),
//     ]);

//     // Define table column headers and individual column widths
//     const headers = [
//       "Date",
//       "Trn#",
//       "Type",
//       "Description",
//       "Debit",
//       "Credit",
//       "Balance",
//     ];
//     const columnWidths = [24, 17, 15, 110, 30, 30, 30];

//     // Calculate total table width
//     const totalWidth = columnWidths.reduce((acc, width) => acc + width, 0);

//     // Define page height and padding
//     const pageHeight = doc.internal.pageSize.height;
//     const paddingTop = 15;

//     // Set font properties for the table
//     doc.setFont("verdana-regular", "normal");
//     doc.setFontSize(10);

//     // Function to add table headers
//     const addTableHeaders = (startX, startY) => {
//       // Set font style and size for headers
//       doc.setFont("verdana", "bold");
//       doc.setFontSize(10);

//       headers.forEach((header, index) => {
//         const cellWidth = columnWidths[index];
//         const cellHeight = 6; // Height of the header row
//         const cellX = startX + cellWidth / 2; // Center the text horizontally
//         const cellY = startY + cellHeight / 2 + 1.5; // Center the text vertically

//         // Draw the grey background for the header
//         doc.setFillColor(200, 200, 200); // Grey color
//         doc.rect(startX, startY, cellWidth, cellHeight, "F"); // Fill the rectangle

//         // Draw the outer border
//         doc.setLineWidth(0.2); // Set the width of the outer border
//         doc.rect(startX, startY, cellWidth, cellHeight);

//         // Set text alignment to center
//         doc.setTextColor(0); // Set text color to black
//         doc.text(header, cellX, cellY, { align: "center" }); // Center the text
//         startX += columnWidths[index]; // Move to the next column
//       });
//     };

//     const addTableRows = (startX, startY, startIndex, endIndex) => {
//       const rowHeight = 5;
//       const fontSize = 10;
//       const boldFont = 400;
//       const normalFont = getfontstyle;
//       const tableWidth = getTotalTableWidth();

//       for (let i = startIndex; i < endIndex; i++) {
//         const row = rows[i];
//         const isOddRow = i % 2 !== 0;
//         const isRedRow = row[0] && parseInt(row[0]) > 10000000000;
//         const isTotalRow = i === rows.length - 1;
//         let textColor = [0, 0, 0];
//         let fontName = normalFont;

//         if (isRedRow) {
//           textColor = [255, 0, 0];
//           fontName = boldFont;
//         }

//         if (isTotalRow) {
//           doc.setFont("verdana", "bold");
//           doc.setFontSize(10);
//         }

//         if (isOddRow) {
//           doc.setFillColor(240);
//           doc.rect(
//             startX,
//             startY + (i - startIndex + 2) * rowHeight,
//             tableWidth,
//             rowHeight,
//             "F",
//           );
//         }

//         doc.setDrawColor(0);

//         if (isTotalRow) {
//           const rowTopY = startY + (i - startIndex + 2) * rowHeight;
//           const rowBottomY = rowTopY + rowHeight;

//           doc.setLineWidth(0.3);
//           doc.line(startX, rowTopY, startX + tableWidth, rowTopY);
//           doc.line(startX, rowTopY + 0.5, startX + tableWidth, rowTopY + 0.5);

//           doc.line(startX, rowBottomY, startX + tableWidth, rowBottomY);
//           doc.line(
//             startX,
//             rowBottomY - 0.5,
//             startX + tableWidth,
//             rowBottomY - 0.5,
//           );

//           doc.setLineWidth(0.2);
//           doc.line(startX, rowTopY, startX, rowBottomY);
//           doc.line(
//             startX + tableWidth,
//             rowTopY,
//             startX + tableWidth,
//             rowBottomY,
//           );
//         } else {
//           doc.setLineWidth(0.2);
//           doc.rect(
//             startX,
//             startY + (i - startIndex + 2) * rowHeight,
//             tableWidth,
//             rowHeight,
//           );
//         }

//         row.forEach((cell, cellIndex) => {
//           // ⭐ NEW FIX — Perfect vertical centering
//           const cellY =
//             startY + (i - startIndex + 2) * rowHeight + rowHeight / 2;

//           const cellX = startX + 2;

//           doc.setTextColor(textColor[0], textColor[1], textColor[2]);

//           if (!isTotalRow) {
//             doc.setFont("verdana-regular", "normal");
//             doc.setFontSize(10);
//           }

//           const cellValue = String(cell);

//           if (cellIndex === 0 || cellIndex === 1 || cellIndex === 2) {
//             const rightAlignX = startX + columnWidths[cellIndex] / 2;
//             doc.text(cellValue, rightAlignX, cellY, {
//               align: "center",
//               baseline: "middle",
//             });
//           } else if (cellIndex === 4 || cellIndex === 5 || cellIndex === 6) {
//             const rightAlignX = startX + columnWidths[cellIndex] - 2;
//             doc.text(cellValue, rightAlignX, cellY, {
//               align: "right",
//               baseline: "middle",
//             });
//           } else {
//             if (isTotalRow && cellIndex === 0 && cell === "") {
//               const totalLabelX = startX + columnWidths[0] / 2;
//               doc.text("", totalLabelX, cellY, {
//                 align: "center",
//                 baseline: "middle",
//               });
//             } else {
//               doc.text(cellValue, cellX, cellY, {
//                 baseline: "middle",
//               });
//             }
//           }

//           if (cellIndex < row.length - 1) {
//             doc.setLineWidth(0.2);
//             doc.line(
//               startX + columnWidths[cellIndex],
//               startY + (i - startIndex + 2) * rowHeight,
//               startX + columnWidths[cellIndex],
//               startY + (i - startIndex + 3) * rowHeight,
//             );
//             startX += columnWidths[cellIndex];
//           }
//         });

//         startX = (doc.internal.pageSize.width - tableWidth) / 2;

//         if (isTotalRow) {
//           doc.setFont("verdana-regular", "normal");
//           doc.setFontSize(10);
//         }
//       }

//       const lineWidth = tableWidth;
//       const lineX = (doc.internal.pageSize.width - tableWidth) / 2;
//       const lineY = pageHeight - 15;
//       doc.setLineWidth(0.3);
//       doc.line(lineX, lineY, lineX + lineWidth, lineY);
//       const headingFontSize = 11;
//       const headingX = lineX + 2;
//       const headingY = lineY + 5;
//       doc.setFont("verdana-regular", "normal");
//       doc.setFontSize(10);
//       doc.text(`Crystal Solution    ${date}    ${time}`, headingX, headingY);
//     };

//     // Function to calculate total table width
//     const getTotalTableWidth = () => {
//       let totalWidth = 0;
//       columnWidths.forEach((width) => (totalWidth += width));
//       return totalWidth;
//     };

//     // Function to add a new page and reset startY
//     const addNewPage = (startY) => {
//       doc.addPage();
//       return paddingTop; // Set startY for each new page
//     };

//     // Define the number of rows per page
//     const rowsPerPage = 29; // Adjust this value based on your requirements

//     // Function to handle pagination
//     const handlePagination = () => {
//       // Define the addTitle function
//       const addTitle = (
//         title,
//         date,
//         time,
//         pageNumber,
//         startY,
//         titleFontSize = 18,
//         pageNumberFontSize = 10,
//       ) => {
//         doc.setFontSize(titleFontSize); // Set the font size for the title
//         doc.text(title, doc.internal.pageSize.width / 2, startY, {
//           align: "center",
//         });

//         // Calculate the x-coordinate for the right corner
//         const rightX = doc.internal.pageSize.width - 10;

//         // if (date) {
//         //     doc.setFontSize(dateTimeFontSize); // Set the font size for the date and time
//         //     if (time) {
//         //         doc.text(date + " " + time, rightX, startY, { align: "right" });
//         //     } else {
//         //         doc.text(date, rightX - 10, startY, { align: "right" });
//         //     }
//         // }

//         // Add page numbering
//         doc.setFont("verdana-regular", "normal");
//         doc.setFontSize(10);
//         doc.text(
//           `Page ${pageNumber}`,
//           rightX - 10,
//           doc.internal.pageSize.height - 10,
//           { align: "right" },
//         );
//       };

//       let currentPageIndex = 0;
//       let startY = paddingTop; // Initialize startY
//       let pageNumber = 1; // Initialize page number

//       while (currentPageIndex * rowsPerPage < rows.length) {
//         doc.setFont("Times New Roman", "normal");
//         addTitle(comapnyname, 12, 12, pageNumber, startY, 18); // Render company title with default font size, only date, and page number
//         startY += 5; // Adjust vertical position for the company title
//         doc.setFont("verdana-regular", "normal");
//         addTitle(
//           `General Ledger From: ${fromInputDate} To: ${toInputDate}`,
//           "",
//           "",
//           pageNumber,
//           startY,
//           12,
//         ); // Render sale report title with decreased font size, provide the time, and page number
//         startY += -5;

//         const labelsX = (doc.internal.pageSize.width - totalWidth) / 2;
//         const labelsY = startY + 4; // Position the labels below the titles and above the table

//         let status =
//           transectionType === "A"
//             ? "ALL"
//             : transectionType === "CRV"
//               ? "Cash Receive Voucher"
//               : transectionType === "CPV"
//                 ? "Cash Payment Voucher"
//                 : transectionType === "BRV"
//                   ? "Bank Receive Voucher"
//                   : transectionType === "BPV"
//                     ? "Bank Payment Voucher"
//                     : transectionType === "JRV"
//                       ? "Journal Voucher"
//                       : transectionType === "INV"
//                         ? "Item Sale"
//                         : transectionType === "SRN"
//                           ? "Sale Return"
//                           : transectionType === "BIL"
//                             ? "Purchase"
//                             : transectionType === "PRN"
//                               ? "Purchase Return"
//                               : transectionType === "ISS"
//                                 ? "Issue"
//                                 : transectionType === "REC"
//                                   ? "Received"
//                                   : transectionType === "SLY"
//                                     ? "Salary"
//                                     : "ALL";

//         let search = Companyselectdatavalue.label
//           ? Companyselectdatavalue.label
//           : "ALL";

//         doc.setFont("verdana", "bold");
//         doc.setFontSize(10);
//         doc.text(`Account :`, labelsX, labelsY + 8.5); // Draw bold label
//         doc.setFont("verdana-regular", "normal");
//         doc.setFontSize(10);
//         doc.text(`${search}`, labelsX + 25, labelsY + 8.5); // Draw the value next to the label

//         doc.setFont("verdana", "bold");
//         doc.setFontSize(10);
//         doc.text(`Type :`, labelsX + 170, labelsY + 8.5); // Draw bold label
//         doc.setFont("verdana-regular", "normal");
//         doc.setFontSize(10);
//         doc.text(`${status}`, labelsX + 185, labelsY + 8.5); // Draw the value next to the label

//         startY += 10; // Adjust vertical position for the labels

//         addTableHeaders((doc.internal.pageSize.width - totalWidth) / 2, 29);
//         const startIndex = currentPageIndex * rowsPerPage;
//         const endIndex = Math.min(startIndex + rowsPerPage, rows.length);
//         startY = addTableRows(
//           (doc.internal.pageSize.width - totalWidth) / 2,
//           startY,
//           startIndex,
//           endIndex,
//         );
//         if (endIndex < rows.length) {
//           startY = addNewPage(startY); // Add new page and update startY
//           pageNumber++; // Increment page number
//         }
//         currentPageIndex++;
//       }
//     };

//     const getCurrentDate = () => {
//       const today = new Date();
//       const dd = String(today.getDate()).padStart(2, "0");
//       const mm = String(today.getMonth() + 1).padStart(2, "0"); // January is 0!
//       const yyyy = today.getFullYear();
//       return dd + "/" + mm + "/" + yyyy;
//     };

//     // Function to get current time in the format HH:MM:SS
//     const getCurrentTime = () => {
//       const today = new Date();
//       const hh = String(today.getHours()).padStart(2, "0");
//       const mm = String(today.getMinutes()).padStart(2, "0");
//       const ss = String(today.getSeconds()).padStart(2, "0");
//       return hh + ":" + mm + ":" + ss;
//     };

//     const date = getCurrentDate(); // Get current date
//     const time = getCurrentTime(); // Get current time

//     // Call function to handle pagination
//     handlePagination();

//     // Save the PDF files
//     doc.save(`GeneralLedger Form ${fromInputDate} To ${toInputDate}.pdf`);
//   };
//   ///////////////////////////// DOWNLOAD PDF CODE ////////////////////////////////////////////////////////////
//   ///////////////////////////// DOWNLOAD PDF EXCEL //////////////////////////////////////////////////////////
//   const handleDownloadCSV = async () => {
//     const workbook = new ExcelJS.Workbook();
//     const worksheet = workbook.addWorksheet("Sheet1");

//     const numColumns = 4; // Ensure this matches the actual number of columns

//     const columnAlignments = [
//       "center",
//       "left",

//       "right",
//       "right",
//     ];

//     // Define fonts for different sections
//     const fontCompanyName = {
//       name: "CustomFont" || "CustomFont",
//       size: 18,
//       bold: true,
//     };
//     const fontStoreList = {
//       name: "CustomFont" || "CustomFont",
//       size: 10,
//       bold: false,
//     };
//     const fontHeader = {
//       name: "CustomFont" || "CustomFont",
//       size: 10,
//       bold: true,
//     };
//     const fontTableContent = {
//       name: "CustomFont" || "CustomFont",
//       size: 10,
//       bold: false,
//     };

//     // Add an empty row at the start
//     worksheet.addRow([]);

//     // Add company name
//     const companyRow = worksheet.addRow([comapnyname]);
//     companyRow.eachCell((cell) => {
//       cell.font = fontCompanyName;
//       cell.alignment = { horizontal: "center" };
//     });

//     worksheet.getRow(companyRow.number).height = 30;
//     worksheet.mergeCells(
//       `A${companyRow.number}:${String.fromCharCode(66 + numColumns - 1)}${
//         companyRow.number
//       }`,
//     );

//     // Add Store List row
//     const storeListRow = worksheet.addRow([
//       `Supplier Purchase Comparison Report From ${fromInputDate} To ${toInputDate}`,
//     ]);
//     storeListRow.eachCell((cell) => {
//       cell.font = fontStoreList;
//       cell.alignment = { horizontal: "center" };
//     });

//     worksheet.mergeCells(
//       `A${storeListRow.number}:${String.fromCharCode(66 + numColumns - 1)}${
//         storeListRow.number
//       }`,
//     );

//     // Add an empty row after the title section
//     worksheet.addRow([]);

//     let typestatus = "";

//     if (transectionType === "A") {
//       typestatus = "ALL";
//     } else if (transectionType === "CRV") {
//       typestatus = "CASH RECEIVE VOUCHER";
//     } else if (transectionType === "CPV") {
//       typestatus = "CASH PAYMENT VOUCHER";
//     } else if (transectionType === "BRV") {
//       typestatus = "BANK RECEIVE VOUCHER";
//     } else if (transectionType === "BPV") {
//       typestatus = "BANK PAYMENT VOUCHER";
//     } else if (transectionType === "JRV") {
//       typestatus = "JOURNAL VOUCHER";
//     } else if (transectionType === "INV") {
//       typestatus = "ITEM SALE";
//     } else if (transectionType === "SRN") {
//       typestatus = "SALE RETURN";
//     } else if (transectionType === "BIL") {
//       typestatus = "PURCHASE";
//     } else if (transectionType === "PRN") {
//       typestatus = "PURCHASE RETURN";
//     } else if (transectionType === "ISS") {
//       typestatus = "ISSUE";
//     } else if (transectionType === "REC") {
//       typestatus = "RECEIVE";
//     } else if (transectionType === "SLY") {
//       typestatus = "SALARY";
//     } else {
//       typestatus = "ALL"; // Default value
//     }

//     let Accountselect = Companyselectdatavalue.label
//       ? Companyselectdatavalue.label
//       : "ALL";

//     let typesearch = searchQuery || "";

//     // Apply styling for the status row
//     const typeAndStoreRow2 = worksheet.addRow([
//       "ACCOUNT :",
//       Accountselect,
//       "",
//       "",
//       "TYPE :",
//       typestatus,
//     ]);

//     const typeAndStoreRow3 = worksheet.addRow(
//       searchQuery ? ["", "", "", "", "SEARCH :", typesearch] : [""],
//     );

//     // Merge cells for Accountselect (columns B to D)
//     worksheet.mergeCells(
//       `B${typeAndStoreRow2.number}:D${typeAndStoreRow2.number}`,
//     );

//     // Apply styling for the status row
//     typeAndStoreRow2.eachCell((cell, colIndex) => {
//       cell.font = {
//         name: "CustomFont" || "CustomFont",
//         size: 10,
//         bold: [1, 5].includes(colIndex),
//       };
//       cell.alignment = {
//         horizontal: colIndex === 2 ? "left" : "left", // Left align the account name
//         vertical: "middle",
//       };
//     });

//     typeAndStoreRow3.eachCell((cell, colIndex) => {
//       cell.font = {
//         name: "CustomFont" || "CustomFont",
//         size: 10,
//         bold: [5].includes(colIndex),
//       };
//       cell.alignment = { horizontal: "left", vertical: "middle" };
//     });

//     // Header style
//     const headerStyle = {
//       font: fontHeader,
//       alignment: { horizontal: "center", vertical: "middle" },
//       fill: {
//         type: "pattern",
//         pattern: "solid",
//         fgColor: { argb: "FFC6D9F7" },
//       },
//       border: {
//         top: { style: "thin" },
//         left: { style: "thin" },
//         bottom: { style: "thin" },
//         right: { style: "thin" },
//       },
//     };

//     // Add headers
//     const headers = [
//       "Date",
//       "Trn#",
//       "Type",
//       "Description",
//       "Debit",
//       "Credit",
//       "Balance",
//     ];
//     const headerRow = worksheet.addRow(headers);
//     headerRow.eachCell((cell) => Object.assign(cell, headerStyle));

//     // Add data rows
//     tableData.forEach((item) => {
//       const row = worksheet.addRow([
//         item.Date,
//         item["Trn#"],
//         item.Type,
//         item.Description,
//         item.Debit,
//         item.Credit,
//         item.Balance,
//       ]);

//       row.eachCell((cell, colIndex) => {
//         cell.font = fontTableContent;
//         cell.border = {
//           top: { style: "thin" },
//           left: { style: "thin" },
//           bottom: { style: "thin" },
//           right: { style: "thin" },
//         };
//         cell.alignment = {
//           horizontal: columnAlignments[colIndex - 1] || "left",
//           vertical: "middle",
//         };
//       });
//     });

//     const totalRow = worksheet.addRow([
//       "",
//       "",
//       "",
//       "Total",
//       totalDebit,
//       totalCredit,
//       closingBalance,
//     ]);

//     // total row added

//     totalRow.eachCell((cell, colNumber) => {
//       cell.font = { bold: true };
//       cell.border = {
//         top: { style: "double" },
//         left: { style: "thin" },
//         bottom: { style: "double" },
//         right: { style: "thin" },
//       };

//       // Align only the "Total" text to the right
//       if (colNumber === 5 || colNumber === 6 || colNumber === 7) {
//         cell.alignment = { horizontal: "right" };
//       }
//     });

//     // Set column widths
//     [10, 7, 7, 45, 15, 15, 15].forEach((width, index) => {
//       worksheet.getColumn(index + 1).width = width;
//     });

//     // Add a blank row
//     worksheet.addRow([]);
//     // Get current date and time
//     const getCurrentTime = () => {
//       const today = new Date();
//       const hh = String(today.getHours()).padStart(2, "0");
//       const mm = String(today.getMinutes()).padStart(2, "0");
//       const ss = String(today.getSeconds()).padStart(2, "0");
//       return `${hh}:${mm}:${ss}`;
//     };
//     // Get current date
//     const getCurrentDate = () => {
//       const today = new Date();
//       const day = String(today.getDate()).padStart(2, "0");
//       const month = String(today.getMonth() + 1).padStart(2, "0");
//       const year = today.getFullYear();
//       return `${day}-${month}-${year}`;
//     };
//     const currentTime = getCurrentTime();
//     const currentdate = getCurrentDate();
//     const userid = user.tusrid;

//     // Add date and time row
//     const dateTimeRow = worksheet.addRow([
//       `DATE:   ${currentdate}  TIME:   ${currentTime}`,
//     ]);
//     dateTimeRow.eachCell((cell) => {
//       cell.font = {
//         name: "CustomFont" || "CustomFont",
//         size: 10,
//         // bold: true
//         // italic: true,
//       };
//       cell.alignment = { horizontal: "left" };
//     });
//     const dateTimeRow1 = worksheet.addRow([`USER ID:  ${userid}`]);
//     dateTimeRow.eachCell((cell) => {
//       cell.font = {
//         name: "CustomFont" || "CustomFont",
//         size: 10,
//         // bold: true
//         // italic: true,
//       };
//       cell.alignment = { horizontal: "left" };
//     });

//     // Merge across all columns
//     worksheet.mergeCells(
//       `A${dateTimeRow.number}:${String.fromCharCode(65 + numColumns - 1)}${dateTimeRow.number}`,
//     );
//     worksheet.mergeCells(
//       `A${dateTimeRow1.number}:${String.fromCharCode(65 + numColumns - 1)}${dateTimeRow1.number}`,
//     );

//     // Generate and save the Excel file
//     const buffer = await workbook.xlsx.writeBuffer();
//     const blob = new Blob([buffer], {
//       type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
//     });
//     saveAs(blob, `GeneralLedger  From ${fromInputDate} To ${toInputDate}.xlsx`);
//   };
//   ///////////////////////////// DOWNLOAD PDF EXCEL ///////////////////////////////////////////////////////////

//  const [columns, setColumns] = useState({
//       Description: [],
//       Debit: [],
//       Credit: [],
//       Balance: [],
//   });
//   const [columnSortOrders, setColumnSortOrders] = useState({
//     Description: "",
//       Debit: "",
//       Credit: "",
//       Balance: "",
//   });
//   useEffect(() => {
//     if (tableData.length > 0) {
//       const newColumns = {
//         Description: tableData.map((row) => row.Description),
//         Debit: tableData.map((row) => row.Debit),
//         Credit: tableData.map((row) => row.Credit),
//         Balance: tableData.map((row) => row.Balance),

//       };
//       setColumns(newColumns);
//     }
//   }, [tableData]);

//   const handleSorting = (col) => {
//     const currentOrder = columnSortOrders[col];
//     const newOrder = currentOrder === "ASC" ? "DSC" : "ASC";

//     const sortedData = [...tableData].sort((a, b) => {
//       const aVal =
//         a[col] !== null && a[col] !== undefined ? a[col].toString() : "";
//       const bVal =
//         b[col] !== null && b[col] !== undefined ? b[col].toString() : "";

//       const numA = parseFloat(aVal.replace(/,/g, ""));
//       const numB = parseFloat(bVal.replace(/,/g, ""));

//       if (!isNaN(numA) && !isNaN(numB)) {
//         return newOrder === "ASC" ? numA - numB : numB - numA;
//       } else {
//         return newOrder === "ASC"
//           ? aVal.localeCompare(bVal)
//           : bVal.localeCompare(aVal);
//       }
//     });

//     setTableData(sortedData);

//     setColumnSortOrders((prev) => ({
//       ...Object.keys(prev).reduce((acc, key) => {
//         acc[key] = key === col ? newOrder : null;
//         return acc;
//       }, {}),
//     }));
//   };

//   const resetSorting = () => {
//     setColumnSortOrders({
//       Description: null,
//       Debit: null,
//       Credit: null,
//       Balance: null,
//     });
//   };
//   const getIconStyle = (colKey) => {
//     const order = columnSortOrders[colKey];
//     return {
//       transform: order === "DSC" ? "rotate(180deg)" : "rotate(0deg)",
//       color: order === "ASC" || order === "DSC" ? "red" : "white",
//       transition: "transform 0.3s ease, color 0.3s ease",
//     };
//   };

//   const dispatch = useDispatch();

//   const tableTopColor = "#3368B5";
//   const tableHeadColor = "#3368b5";
//   const secondaryColor = "white";
//   const btnColor = "#3368B5";
//   const textColor = "white";

//   const [selectedSearch, setSelectedSearch] = useState("");
//   const [isLoading, setIsLoading] = useState(false);
//   const { data, loading, error } = useSelector((state) => state.getuser);

//   const handleSearch = (e) => {
//     setSelectedSearch(e.target.value);
//   };

//   let totalEntries = 0;

//   const getFilteredTableData = () => {
//     let filteredData = tableData;
//     if (selectedSearch.trim() !== "") {
//       const query = selectedSearch.trim().toLowerCase();
//       filteredData = filteredData.filter(
//         (data) => data.tusrnam && data.tusrnam.toLowerCase().includes(query),
//       );
//     }
//     return filteredData;
//   };

//   const firstColWidth = {
//     width: "80px",
//   };
//   const secondColWidth = {
//     width: "54px",
//   };
//   const thirdColWidth = {
//     width: "32px",
//   };
//   const forthColWidth = {
//     width: "360px",
//   };
//   const fifthColWidth = {
//     width: "90px",
//   };
//   const sixthColWidth = {
//     width: "90px",
//   };
//   const seventhColWidth = {
//     width: "90px",
//   };

//   const sixthcol = { width: "8px" };

//   useHotkeys(
//     "alt+s",
//     () => {
//       fetchReceivableReport();
//          resetSorting();
//     },
//     { preventDefault: true, enableOnFormTags: true },
//   );

//   useHotkeys("alt+p", exportPDFHandler, {
//     preventDefault: true,
//     enableOnFormTags: true,
//   });
//   useHotkeys("alt+e", handleDownloadCSV, {
//     preventDefault: true,
//     enableOnFormTags: true,
//   });
//   useHotkeys("alt+r", () => navigate("/MainPage"), {
//     preventDefault: true,
//     enableOnFormTags: true,
//   });

//   const [windowWidth, setWindowWidth] = useState(window.innerWidth);

//   useEffect(() => {
//     const handleResize = () => {
//       setWindowWidth(window.innerWidth);
//     };
//     window.addEventListener("resize", handleResize);
//     return () => {
//       window.removeEventListener("resize", handleResize);
//     };
//   }, []);

//   const contentStyle = {
//     width: "100%", // 100vw ki jagah 100%
//     maxWidth: "900px",
//     height: "calc(100vh - 100px)",
//     position: "absolute",
//     top: "70px",
//     left: isSidebarVisible ? "60vw" : "50vw",
//     transform: "translateX(-50%)",
//     display: "flex",
//     flexDirection: "column",
//     justifyContent: "center",
//     alignItems: "center",
//     overflow: "hidden",
//     textAlign: "center",
//     fontSize: "15px",
//     fontStyle: "normal",
//     fontWeight: "400",
//     lineHeight: "23px",
//     fontFamily: '"Poppins", sans-serif',
//     zIndex: 1,
//     padding: "0 20px", // Side padding for small screens
//     boxSizing: "border-box", // Padding ko width mein include kare
//   };

//   const [isFilterApplied, setIsFilterApplied] = useState(false);
//   useEffect(() => {
//     if (isFilterApplied || tableData.length > 0) {
//       setSelectedIndex(0);
//       rowRefs.current[0]?.scrollIntoView({
//         behavior: "smooth",
//         block: "start",
//       });
//     } else {
//       setSelectedIndex(-1);
//     }
//   }, [tableData, isFilterApplied]);

//   let totalEnteries = 0;
//   const [selectedRowId, setSelectedRowId] = useState(null);
//   const [selectedIndex, setSelectedIndex] = useState(-1);
//   const rowRefs = useRef([]);
//   const handleRowClick = (index) => {
//     setSelectedIndex(index);
//   };
//   useEffect(() => {
//     if (selectedRowId !== null) {
//       const newIndex = tableData.findIndex(
//         (item) => item.tcmpcod === selectedRowId,
//       );
//       setSelectedIndex(newIndex);
//     }
//   }, [tableData, selectedRowId]);
//   const handleKeyDown = (e) => {
//     if (selectedIndex === -1 || e.target.id === "searchInput") return;
//     if (e.key === "ArrowUp") {
//       e.preventDefault();
//       setSelectedIndex((prevIndex) => Math.max(prevIndex - 1, 0));
//       scrollToSelectedRow();
//     } else if (e.key === "ArrowDown") {
//       e.preventDefault();
//       setSelectedIndex((prevIndex) =>
//         Math.min(prevIndex + 1, tableData.length - 1),
//       );
//       scrollToSelectedRow();
//     }
//   };
//   const scrollToSelectedRow = () => {
//     if (selectedIndex !== -1 && rowRefs.current[selectedIndex]) {
//       rowRefs.current[selectedIndex].scrollIntoView({
//         behavior: "smooth",
//         block: "nearest",
//       });
//     }
//   };
//   useEffect(() => {
//     window.addEventListener("keydown", handleKeyDown);
//     return () => {
//       window.removeEventListener("keydown", handleKeyDown);
//     };
//   }, [selectedIndex]);
//   useEffect(() => {
//     if (selectedIndex !== -1 && rowRefs.current[selectedIndex]) {
//       rowRefs.current[selectedIndex].scrollIntoView({
//         behavior: "smooth",
//         block: "nearest",
//       });
//     }
//   }, [selectedIndex]);

//   const parseDate = (dateString) => {
//     const [day, month, year] = dateString.split("-").map(Number);
//     return new Date(year, month - 1, day);
//   };

//   const handleRadioChange = (days) => {
//     const toDate = parseDate(toInputDate);
//     const fromDate = new Date(toDate);
//     fromDate.setUTCDate(fromDate.getUTCDate() - days);

//     setSelectedfromDate(fromDate);
//     setfromInputDate(formatDate(fromDate));
//     setSelectedRadio(days === 0 ? "custom" : `${days}days`);
//   };

//   // this function for hide the 0 value figure from the table data

//   const formatValue = (val) => {
//     return Number(val) === 0 ? "" : val;
//   };

//   const isMatchedRow = (item) => {
//     if (!searchQuery) return false; // no highlight if search is empty

//     const query = searchQuery.toUpperCase();

//     // you can match anything you want:
//     return (
//       item.Description?.toUpperCase().includes(query) ||
//       item.Type?.toUpperCase().includes(query) ||
//       item.Date?.toUpperCase().includes(query) ||
//       String(item["Trn#"])?.includes(query)
//     );
//   };

//   return (
//     <>
//       <ToastContainer />
//       <div style={contentStyle}>
//         <div
//           style={{
//             backgroundColor: getcolor,
//             color: fontcolor,
//             // width: "100%",
//             border: `1px solid ${fontcolor}`,
//             borderRadius: "9px",
//           }}
//         >
//           <NavComponent textdata="General Ledger" />

//           <div
//             className="row"
//             style={{ height: "20px", marginTop: "8px", marginBottom: "8px" }}
//           >
//             <div
//               style={{
//                 width: "100%",
//                 display: "flex",
//                 alignItems: "center",
//                 margin: "0px",
//                 padding: "0px",
//                 justifyContent: "space-between",
//               }}
//             >
//               {/* ------ */}

//               <div
//                 className="d-flex align-items-center  "
//                 style={{ marginRight: "1px" }}
//               >
//                 <div
//                   style={{
//                     width: "80px",
//                     display: "flex",
//                     justifyContent: "end",
//                   }}
//                 >
//                   <label htmlFor="fromDatePicker">
//                     <span
//                       style={{
//                         fontSize: getdatafontsize,
//                         fontFamily: getfontstyle,
//                         fontWeight: "bold",
//                       }}
//                     >
//                       Account :
//                     </span>{" "}
//                     <br />
//                   </label>
//                 </div>
//                 <div style={{ marginLeft: "5px" }}>
//                   <Select
//                     className="List-select-class"
//                     ref={saleSelectRef}
//                     options={options}
//                     value={
//                       options.find((opt) => opt.value === saleType) || null
//                     } // Ensure correct reference
//                     isDisabled={isDoubleClickOpen}
//                     onKeyDown={(e) => handleSaleKeypress(e, "frominputid")}
//                     id="selectedsale"
//                     onChange={(selectedOption) => {
//                       if (selectedOption && selectedOption.value) {
//                         const labelParts = selectedOption.label.split("-"); // Split by "-"
//                         const description = labelParts.slice(3).join("-"); // Remove the first 3 parts

//                         setSaleType(selectedOption.value);
//                         setCompanyselectdatavalue({
//                           value: selectedOption.value,
//                           label: description, // Keep only the description
//                         });
//                       } else {
//                         setSaleType("");
//                         setCompanyselectdatavalue("");
//                       }
//                     }}
//                     onInputChange={(inputValue, { action }) => {
//                       if (action === "input-change") {
//                         return inputValue.toUpperCase();
//                       }
//                       return inputValue;
//                     }}
//                     components={{ Option: DropdownOption }}
//                     styles={{
//                       ...customStyles1(!saleType),
//                       placeholder: (base) => ({
//                         ...base,
//                         textAlign: "left",
//                         marginLeft: "0",
//                         justifyContent: "flex-start",
//                         color: fontcolor,
//                         marginTop: "-5px",
//                       }),
//                     }}
//                     // isClearable
//                     // placeholder="ALL"
//                   />
//                 </div>
//               </div>

//               <div
//                 className="d-flex align-items-center"
//                 style={{ marginRight: "21px" }}
//               >
//                 <div
//                   style={{
//                     width: "60px",
//                     display: "flex",
//                     justifyContent: "end",
//                   }}
//                 >
//                   <label htmlFor="transactionType">
//                     <span
//                       style={{
//                         fontSize: getdatafontsize,
//                         fontFamily: getfontstyle,
//                         fontWeight: "bold",
//                       }}
//                     >
//                       Type :
//                     </span>
//                   </label>
//                 </div>

//                 <div style={{ position: "relative", display: "inline-block" }}>
//                   <select
//                     ref={input1Ref}
//                     onKeyDown={(e) => handleKeyPress(e, input2Ref)}
//                     id="submitButton"
//                     name="type"
//                     onFocus={(e) =>
//                       (e.currentTarget.style.border = "4px solid red")
//                     }
//                     onBlur={(e) =>
//                       (e.currentTarget.style.border = `1px solid ${fontcolor}`)
//                     }
//                     value={transectionType}
//                     onChange={handleTransactionTypeChange}
//                     style={{
//                       width: "200px",
//                       height: "24px",
//                       marginLeft: "5px",
//                       backgroundColor: getcolor,
//                       border: `1px solid ${fontcolor}`,
//                       fontSize: getdatafontsize,
//                       fontFamily: getfontstyle,
//                       color: fontcolor,
//                       paddingRight: "25px",
//                     }}
//                   >
//                     <option value="">ALL</option>
//                     <option value="CRV">CASH RECEIVE VORCHER</option>
//                     <option value="CPV">Cash PAYMENT VORCHER</option>
//                     <option value="BRV">Bank RECEIVE VORCHER</option>
//                     <option value="BPV">BANK PAYMENT VORCHER</option>
//                     <option value="JVR">JOURNAL VORCHER</option>
//                     <option value="INV">ITEM SALE</option>
//                     <option value="SRN">SALE RETURN</option>
//                     <option value="BIL">PURCHASE</option>
//                     <option value="PRN">PURCHASE RETURN</option>
//                     <option value="ISS">ISSUE</option>
//                     <option value="REC">RECEIVED</option>
//                     <option value="SLY">SALARY</option>
//                   </select>

//                   {transectionType !== "" && (
//                     <span
//                       onClick={() => settransectionType("")}
//                       style={{
//                         position: "absolute",
//                         right: "25px",
//                         top: "50%",
//                         transform: "translateY(-50%)",
//                         cursor: "pointer",
//                         fontWeight: "bold",
//                         color: fontcolor,
//                         userSelect: "none",
//                         fontSize: "12px",
//                       }}
//                     >
//                       ✕
//                     </span>
//                   )}
//                 </div>
//               </div>
//             </div>
//           </div>

//           <div
//             className="row"
//             style={{ height: "20px", marginTop: "8px", marginBottom: "8px" }}
//           >
//             <div
//               style={{
//                 width: "100%",
//                 display: "flex",
//                 alignItems: "center",
//                 margin: "0px",
//                 padding: "0px",
//                 justifyContent: "space-between",
//               }}
//             >
//               <div className="d-flex align-items-center">
//                 <div
//                   style={{
//                     width: "80px",
//                     display: "flex",
//                     justifyContent: "end",
//                   }}
//                 >
//                   <label htmlFor="fromDatePicker">
//                     <span
//                       style={{
//                         fontSize: getdatafontsize,
//                         fontFamily: getfontstyle,
//                         fontWeight: "bold",
//                       }}
//                     >
//                       From :
//                     </span>
//                   </label>
//                 </div>
//                 <div
//                   id="fromdatevalidation"
//                   style={{
//                     width: "135px",
//                     border: `1px solid ${fontcolor}`,
//                     display: "flex",
//                     alignItems: "center",
//                     height: "24px",
//                     justifyContent: "center",
//                     marginLeft: "5px",
//                     background: getcolor,
//                   }}
//                   onFocus={(e) =>
//                     (e.currentTarget.style.border = "2px solid red")
//                   }
//                   onBlur={(e) =>
//                     (e.currentTarget.style.border = `1px solid ${fontcolor}`)
//                   }
//                 >
//                   <input
//                     style={{
//                       height: "20px",
//                       width: "90px",
//                       paddingLeft: "5px",
//                       outline: "none",
//                       border: "none",
//                       fontSize: "12px",
//                       backgroundColor: getcolor,
//                       color: fontcolor,
//                       opacity: selectedRadio === "custom" ? 1 : 0.5,
//                       pointerEvents:
//                         selectedRadio === "custom" ? "auto" : "none",
//                     }}
//                     id="frominputid"
//                     value={fromInputDate}
//                     ref={fromRef}
//                     onChange={handlefromInputChange}
//                     onKeyDown={(e) => handlefromKeyPress(e, "toDatePicker")}
//                     autoComplete="off"
//                     placeholder="dd-mm-yyyy"
//                     aria-label="Date Input"
//                     disabled={selectedRadio !== "custom"}
//                   />
//                   <DatePicker
//                     selected={selectedfromDate}
//                     onChange={handlefromDateChange}
//                     dateFormat="dd-MM-yyyy"
//                     popperPlacement="bottom"
//                     showPopperArrow={false}
//                     open={fromCalendarOpen}
//                     dropdownMode="select"
//                     customInput={
//                       <div>
//                         <BsCalendar
//                           onClick={
//                             selectedRadio === "custom"
//                               ? toggleFromCalendar
//                               : undefined
//                           }
//                           style={{
//                             cursor:
//                               selectedRadio === "custom"
//                                 ? "pointer"
//                                 : "default",
//                             marginLeft: "18px",
//                             fontSize: getdatafontsize,
//                             fontFamily: getfontstyle,
//                             color: fontcolor,
//                             opacity: selectedRadio === "custom" ? 1 : 0.5,
//                           }}
//                           disabled={selectedRadio !== "custom"}
//                         />
//                       </div>
//                     }
//                     disabled={selectedRadio !== "custom"}
//                   />
//                 </div>
//               </div>
//               <div
//                 className="d-flex align-items-center"
//                 style={{ marginLeft: "15px" }}
//               >
//                 <div
//                   style={{
//                     width: "60px",
//                     display: "flex",
//                     justifyContent: "end",
//                   }}
//                 >
//                   <label htmlFor="toDatePicker">
//                     <span
//                       style={{
//                         fontSize: getdatafontsize,
//                         fontFamily: getfontstyle,
//                         fontWeight: "bold",
//                       }}
//                     >
//                       To :
//                     </span>
//                   </label>
//                 </div>
//                 <div
//                   id="todatevalidation"
//                   style={{
//                     width: "135px",
//                     border: `1px solid ${fontcolor}`,
//                     display: "flex",
//                     alignItems: "center",
//                     height: "24px",
//                     justifyContent: "center",
//                     marginLeft: "5px",
//                     background: getcolor,
//                   }}
//                   onFocus={(e) =>
//                     (e.currentTarget.style.border = "2px solid red")
//                   }
//                   onBlur={(e) =>
//                     (e.currentTarget.style.border = `1px solid ${fontcolor}`)
//                   }
//                 >
//                   <input
//                     ref={toRef}
//                     style={{
//                       height: "20px",
//                       width: "90px",
//                       paddingLeft: "5px",
//                       outline: "none",
//                       border: "none",
//                       fontSize: getdatafontsize,
//                       fontFamily: getfontstyle,
//                       backgroundColor: getcolor,
//                       color: fontcolor,
//                       opacity: selectedRadio === "custom" ? 1 : 0.5,
//                       pointerEvents:
//                         selectedRadio === "custom" ? "auto" : "none",
//                     }}
//                     value={toInputDate}
//                     onChange={handleToInputChange}
//                     onKeyDown={(e) => handleToKeyPress(e, "submitButton")}
//                     id="toDatePicker"
//                     autoComplete="off"
//                     placeholder="dd-mm-yyyy"
//                     aria-label="To Date Input"
//                     disabled={selectedRadio !== "custom"}
//                   />
//                   <DatePicker
//                     selected={selectedToDate}
//                     onChange={handleToDateChange}
//                     dateFormat="dd-MM-yyyy"
//                     popperPlacement="bottom"
//                     showPopperArrow={false}
//                     open={toCalendarOpen}
//                     dropdownMode="select"
//                     customInput={
//                       <div>
//                         <BsCalendar
//                           onClick={
//                             selectedRadio === "custom"
//                               ? toggleToCalendar
//                               : undefined
//                           }
//                           style={{
//                             cursor:
//                               selectedRadio === "custom"
//                                 ? "pointer"
//                                 : "default",
//                             marginLeft: "18px",
//                             fontSize: getdatafontsize,
//                             fontFamily: getfontstyle,
//                             color: fontcolor,
//                             opacity: selectedRadio === "custom" ? 1 : 0.5,
//                           }}
//                           disabled={selectedRadio !== "custom"}
//                         />
//                       </div>
//                     }
//                     disabled={selectedRadio !== "custom"}
//                   />
//                 </div>
//               </div>

//               <div id="lastDiv" style={{ marginRight: "1px" }}>
//                 <label for="searchInput" style={{ marginRight: "5px" }}>
//                   <span
//                     style={{
//                       fontSize: getdatafontsize,
//                       fontFamily: getfontstyle,
//                       fontWeight: "bold",
//                     }}
//                   >
//                     Search :
//                   </span>{" "}
//                 </label>
//                 <div style={{ position: "relative", display: "inline-block" }}>
//                   <input
//                     ref={input2Ref}
//                     onKeyDown={(e) => handleKeyPress(e, input3Ref)}
//                     type="text"
//                     id="searchsubmit"
//                     placeholder="Search"
//                     value={searchQuery}
//                     autoComplete="off"
//                     style={{
//                       marginRight: "20px",
//                       width: "200px",
//                       height: "24px",
//                       fontSize: getdatafontsize,
//                       fontFamily: getfontstyle,
//                       color: fontcolor,
//                       backgroundColor: getcolor,
//                       border: `1px solid ${fontcolor}`,
//                       outline: "none",
//                       paddingLeft: "10px",
//                       paddingRight: "25px", // space for the clear icon
//                     }}
//                     onFocus={(e) =>
//                       (e.currentTarget.style.border = "2px solid red")
//                     }
//                     onBlur={(e) =>
//                       (e.currentTarget.style.border = `1px solid ${fontcolor}`)
//                     }
//                     onChange={(e) =>
//                       setSearchQuery((e.target.value || "").toUpperCase())
//                     }
//                   />
//                   {searchQuery && (
//                     <span
//                       onClick={() => setSearchQuery("")}
//                       style={{
//                         position: "absolute",
//                         right: "30px",
//                         top: "50%",
//                         transform: "translateY(-50%)",
//                         cursor: "pointer",
//                         fontSize: "20px",
//                         color: fontcolor,
//                         userSelect: "none",
//                       }}
//                     >
//                       ×
//                     </span>
//                   )}
//                 </div>
//               </div>
//             </div>
//           </div>
//           <div>
//             <div
//               style={{
//                 overflowY: "auto",
//                 // width: "98.8%",
//               }}
//             >
//               <table
//                 className="myTable"
//                 id="table"
//                 style={{
//                   fontSize: getdatafontsize,
//                   fontFamily: getfontstyle,
//                   // width: "100%",
//                   position: "relative",
//                   paddingRight: "2%",
//                 }}
//               >
//                 <thead
//                   style={{
//                     fontSize: getdatafontsize,
//                     fontFamily: getfontstyle,
//                     fontWeight: "bold",
//                     height: "24px",
//                     position: "sticky",
//                     top: 0,
//                     boxShadow: "0 2px 4px rgba(0, 0, 0, 0.2)",
//                     backgroundColor: getnavbarbackgroundcolor,
//                   }}
//                 >
//                   <tr
//                     style={{
//                       backgroundColor: getnavbarbackgroundcolor,
//                       color: "white",
//                     }}
//                   >
//                     <td className="border-dark" style={firstColWidth}>
//                       Date
//                     </td>
//                     <td className="border-dark" style={secondColWidth}>
//                       Trn#
//                     </td>
//                     <td className="border-dark" style={thirdColWidth}>
//                       Typ
//                     </td>
//                      <td
//                       className="border-dark"
//                       style={forthColWidth}
//                       onClick={() => handleSorting("Description")}
//                     >
//                       Description{" "}
//                       <i
//                         className="fa-solid fa-caret-down caretIconStyle"
//                         style={getIconStyle("Description")}
//                       ></i>
//                     </td>
//                     <td
//                       className="border-dark"
//                       style={fifthColWidth}
//                       onClick={() => handleSorting("Debit")}
//                     >
//                       Debit{" "}
//                       <i
//                         className="fa-solid fa-caret-down caretIconStyle"
//                         style={getIconStyle("Debit")}
//                       ></i>
//                     </td>
//                     <td
//                       className="border-dark"
//                       style={sixthColWidth}
//                       onClick={() => handleSorting("Credit")}
//                     >
//                       Credit{" "}
//                       <i
//                         className="fa-solid fa-caret-down caretIconStyle"
//                         style={getIconStyle("Credit")}
//                       ></i>
//                     </td>
//                     <td
//                       className="border-dark"
//                       style={seventhColWidth}
//                       onClick={() => handleSorting("Balance")}
//                     >
//                       Balance{" "}
//                       <i
//                         className="fa-solid fa-caret-down caretIconStyle"
//                         style={getIconStyle("Balance")}
//                       ></i>
//                     </td>

//                     <td className="border-dark" style={sixthcol}></td>
//                   </tr>
//                 </thead>
//               </table>
//             </div>
//             <div
//               className="table-scroll"
//               style={{
//                 backgroundColor: textColor,
//                 borderBottom: `1px solid ${fontcolor}`,
//                 overflowY: "auto",
//                 maxHeight: "48vh",
//                 // width: "100%",
//                 wordBreak: "break-word",
//               }}
//             >
//               <table
//                 id="tableBody"
//                 style={{
//                   fontSize: getdatafontsize,
//                   fontFamily: getfontstyle,
//                   position: "relative",
//                   ...(tableData.length > 0 ? { tableLayout: "fixed" } : {}),
//                 }}
//               >
//                 <tbody id="tablebody">
//                   {isLoading ? (
//                     <>
//                       <tr
//                         style={{
//                           backgroundColor: getcolor,
//                         }}
//                       >
//                         <td colSpan="7" className="text-center">
//                           <Spinner animation="border" variant="primary" />
//                         </td>
//                       </tr>
//                       {Array.from({ length: Math.max(0, 30 - 5) }).map(
//                         (_, rowIndex) => (
//                           <tr
//                             key={`blank-${rowIndex}`}
//                             style={{
//                               backgroundColor: getcolor,
//                               color: fontcolor,
//                             }}
//                           >
//                             {Array.from({ length: 7 }).map((_, colIndex) => (
//                               <td key={`blank-${rowIndex}-${colIndex}`}>
//                                 &nbsp;
//                               </td>
//                             ))}
//                           </tr>
//                         ),
//                       )}
//                       <tr>
//                         <td style={firstColWidth}></td>
//                         <td style={secondColWidth}></td>
//                         <td style={thirdColWidth}></td>
//                         <td style={forthColWidth}></td>
//                         <td style={fifthColWidth}></td>
//                         <td style={sixthColWidth}></td>
//                         <td style={seventhColWidth}></td>
//                       </tr>
//                     </>
//                   ) : (
//                     <>
//                       {tableData.map((item, i) => {
//                         totalEnteries += 1;
//                         return (
//                           <tr
//                             key={`${i}-${selectedIndex}`}
//                             ref={(el) => (rowRefs.current[i] = el)}
//                             onClick={() => handleRowClick(i)}
//                             className={
//                               selectedIndex === i ? "selected-background" : ""
//                             }
//                             style={{
//                               backgroundColor: getcolor,
//                               color: fontcolor,
//                               color: isMatchedRow(item) ? "red" : fontcolor, // 🔥 highlight logic
//                               //  fontWeight: isMatchedRow(item) ? "bold" : "normal", // optional
//                             }}
//                           >
//                             <td className="text-center" style={firstColWidth}>
//                               {item.Date}
//                             </td>
//                             <td className="text-center" style={secondColWidth}>
//                               {item["Trn#"]}
//                             </td>
//                             <td className="text-center" style={thirdColWidth}>
//                               {item.Type}
//                             </td>
//                             <td className="text-start" style={forthColWidth}>
//                               {item.Description}
//                             </td>
//                             <td className="text-end" style={fifthColWidth}>
//                               {formatValue(item.Debit)}
//                             </td>
//                             <td className="text-end" style={sixthColWidth}>
//                               {formatValue(item.Credit)}
//                             </td>
//                             <td className="text-end" style={seventhColWidth}>
//                               {formatValue(item.Balance)}
//                             </td>
//                           </tr>
//                         );
//                       })}
//                       {Array.from({
//                         length: Math.max(0, 27 - tableData.length),
//                       }).map((_, rowIndex) => (
//                         <tr
//                           key={`blank-${rowIndex}`}
//                           style={{
//                             backgroundColor: getcolor,
//                             color: fontcolor,
//                           }}
//                         >
//                           {Array.from({ length: 7 }).map((_, colIndex) => (
//                             <td key={`blank-${rowIndex}-${colIndex}`}>
//                               &nbsp;
//                             </td>
//                           ))}
//                         </tr>
//                       ))}
//                       <tr>
//                         <td style={firstColWidth}></td>
//                         <td style={secondColWidth}></td>
//                         <td style={thirdColWidth}></td>
//                         <td style={forthColWidth}></td>
//                         <td style={fifthColWidth}></td>
//                         <td style={sixthColWidth}></td>
//                         <td style={seventhColWidth}></td>
//                       </tr>
//                     </>
//                   )}
//                 </tbody>
//               </table>
//             </div>
//           </div>

//           <div
//             style={{
//               borderBottom: `1px solid ${fontcolor}`,
//               borderTop: `1px solid ${fontcolor}`,
//               height: "24px",
//               display: "flex",
//               paddingRight: "8px",

//             }}
//           >
//             <div
//               style={{
//                 ...firstColWidth,
//                 background: getcolor,
//                 borderRight: `1px solid ${fontcolor}`,
//               }}
//             ></div>
//             <div
//               style={{
//                 ...secondColWidth,
//                 background: getcolor,
//                 borderRight: `1px solid ${fontcolor}`,
//               }}
//             ></div>
//             <div
//               style={{
//                 ...thirdColWidth,
//                 background: getcolor,
//                 borderRight: `1px solid ${fontcolor}`,
//               }}
//             ></div>
//             <div
//               style={{
//                 ...forthColWidth,
//                 background: getcolor,
//                 borderRight: `1px solid ${fontcolor}`,
//               }}
//             ></div>
//             <div
//               style={{
//                 ...fifthColWidth,
//                 background: getcolor,
//                 borderRight: `1px solid ${fontcolor}`,
//               }}
//             >
//               <span className="mobileledger_total">
//                 {formatValue(totalDebit)}
//               </span>
//             </div>
//             <div
//               style={{
//                 ...sixthColWidth,
//                 background: getcolor,
//                 borderRight: `1px solid ${fontcolor}`,
//               }}
//             >
//               <span className="mobileledger_total">
//                 {formatValue(totalCredit)}
//               </span>
//             </div>
//             <div
//               style={{
//                 ...seventhColWidth,
//                 background: getcolor,
//                 borderRight: `1px solid ${fontcolor}`,
//               }}
//             >
//               <span className="mobileledger_total">
//                 {formatValue(closingBalance)}
//               </span>
//             </div>
//           </div>

//           <div
//             style={{
//               margin: "5px",
//               marginBottom: "2px",
//             }}
//           >
//             <SingleButton
//               to="/MainPage"
//               text="Return"
//               onFocus={(e) => (e.currentTarget.style.border = "2px solid red")}
//               onBlur={(e) =>
//                 (e.currentTarget.style.border = `1px solid ${fontcolor}`)
//               }
//             />
//             <SingleButton
//               text="PDF"
//               onClick={exportPDFHandler}
//               onFocus={(e) => (e.currentTarget.style.border = "2px solid red")}
//               onBlur={(e) =>
//                 (e.currentTarget.style.border = `1px solid ${fontcolor}`)
//               }
//             />
//             <SingleButton
//               text="Excel"
//               onClick={handleDownloadCSV}
//               onFocus={(e) => (e.currentTarget.style.border = "2px solid red")}
//               onBlur={(e) =>
//                 (e.currentTarget.style.border = `1px solid ${fontcolor}`)
//               }
//             />
//             <SingleButton
//               id="searchsubmit"
//               text="Select"
//               ref={input3Ref}
//  onClick={() => {
//                 fetchReceivableReport();
//                 resetSorting();
//               }}              onFocus={(e) => (e.currentTarget.style.border = "2px solid red")}
//               onBlur={(e) =>
//                 (e.currentTarget.style.border = `1px solid ${fontcolor}`)
//               }
//             />
//           </div>
//         </div>
//       </div>
//     </>
//   );
// }

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
  
    // code: "IMAMBARI",
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
                  {tableData?.ASSETS?.["FIXED ASSETS"]?.["LAND & BUILDIND "]}
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
                  {tableData?.ASSETS?.["FIXED ASSETS"]?.["VEHICLES "]}
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
                  {tableData?.ASSETS?.["FIXED ASSETS"]?.["FURNITURE & FIXTURE "]}
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
                  {tableData?.ASSETS?.["FIXED ASSETS"]?.["ELECTRIC EQUIPEMENT "]}
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
                  {tableData?.ASSETS?.["FIXED ASSETS"]?.["TELEPHONE & MOBILES"]}
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
                  {tableData?.ASSETS?.["FIXED ASSETS"]?.["IT EQUIPMENT "]}
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
                  {tableData?.ASSETS?.["FIXED ASSETS"]?.["Total"]}
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
                  {tableData?.ASSETS?.["CASN & BANK BALANCE "]?.["CASH ACCOUNT "]}
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
                  {tableData?.ASSETS?.["CASN & BANK BALANCE "]?.["BANK ACCOUNT "]}
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
                  {tableData?.ASSETS?.["CASN & BANK BALANCE "]?.["CREDIT CARDS "]}
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
                  {tableData?.ASSETS?.["CASN & BANK BALANCE "]?.["CHEQUES "]}
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
                  {tableData?.ASSETS?.["CASN & BANK BALANCE "]?.["Total"]}
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
                  {tableData?.ASSETS?.["RECEIVEABLE "]?.["CREDIT SALE ACCOUNT "]}
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
                  {tableData?.ASSETS?.["RECEIVEABLE "]?.["SALESMAN RECEIVABLE "]}
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
                  {tableData?.ASSETS?.["RECEIVEABLE "]?.["STAFF ADVANCE "]}
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
                  {tableData?.ASSETS?.["RECEIVEABLE "]?.["OTHER RECEIVABLE "]}
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
                  {tableData?.ASSETS?.["RECEIVEABLE "]?.["SECURITY RECEIVABLES"]}
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
                  {tableData?.ASSETS?.["RECEIVEABLE "]?.["INVESTMENTS"]}
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
                  {tableData?.ASSETS?.["RECEIVEABLE "]?.["Total"]}
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
                  {tableData?.ASSETS?.["STOCK"]?.["CLOSING STOCK"]}
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
                  {tableData?.ASSETS?.["STOCK"]?.["Total"]}
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
                  {tableData?.LIABILITIES?.["PAYABLE "]?.["SUPPLIER"]}
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
                  {tableData?.LIABILITIES?.["PAYABLE "]?.["OTHER PAYABLES "]}
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
                  {tableData?.LIABILITIES?.["PAYABLE "]?.["COMMISSION PAYABLES"]}
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
                  {tableData?.LIABILITIES?.["PAYABLE "]?.["INVESTMENT BY OTHER "]}
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
                  {tableData?.LIABILITIES?.["PAYABLE "]?.["SECURITY PAYABLES "]}
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
                  {tableData?.LIABILITIES?.["PAYABLE "]?.["ADVANCE PAYABLE "]}
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
                  {tableData?.LIABILITIES?.["PAYABLE "]?.["Total"]}
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
                  {tableData?.LIABILITIES?.["CAPITAL "]?.["CAPITAL"]}
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
                  {tableData?.LIABILITIES?.["CAPITAL "]?.["DRAWING"]}
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
                  {tableData?.LIABILITIES?.["CAPITAL"]?.["PROFIT TRANSFERD"]}
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
                  {tableData?.LIABILITIES?.["CAPITAL"]?.["Total"]}
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
                  {tableData?.ASSETS?.["Total"]}
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
                  {tableData?.LIABILITIES?.["Total"]}
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



