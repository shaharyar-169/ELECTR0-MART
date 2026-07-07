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
//                     <option value="JRV">JOURNAL VORCHER</option>
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
// }s




export default function EmployeePerformanceReport() {
  const navigate = useNavigate();
  const user = getUserData();
  const organisation = getOrganisationData();


const selectButtonRef = useRef(null);
const [mobileNumber, setmobileNumber] = useState("");
  
 const input4Refrate = useRef(null);
 const searchRef = useRef(null);
 const CommissionRef = useRef(null);

  const toRef = useRef(null);
  const fromRef = useRef(null);
  const [tableData, setTableData] = useState([]);
  

  const [transectionType, settransectionType] = useState("P");
 

  const [totalqnty, settotalqnty] = useState(0);
  const [totalcost, settotalcost] = useState(0);
  const [totalamount, settotalamount] = useState(0);
  const [totalmargin, settotalmargin] = useState(0);
  const [totaldelivery, settotaldelivery] = useState(0);
  const [totalProfit, settotalProfit] = useState(0);
  const [totalNetMargin, settotalNetMargin] = useState(0);
  const [totalCom, settotalCom] = useState(0);
  const [totalComPercentage, settotalComPercentage] = useState(0);
  const [totalExpense, settotalExpense] = useState(0);
  const [totalNetCom, settotalNetCom] = useState(0);

  

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
      date.getMonth() + 1,
    ).padStart(2, "0")}-${date.getFullYear()}`;
  };

  const GlobalfromDate1 = formatDate1(GlobalfromDate);
  const GlobaltoDate1 = formatDate1(GlobaltoDate);

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

        if (input4Refrate.current) {
          e.preventDefault();
          input4Refrate.current.focus();
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

    console.log(data);
    document.getElementById("fromdatevalidation").style.border =
      `1px solid ${fontcolor}`;
    document.getElementById("todatevalidation").style.border =
      `1px solid ${fontcolor}`;

    const apiUrl = apiLinks + "/EmployeePerformanceReport.php";
    setIsLoading(true);
    const formData = new URLSearchParams({
      code: organisation.code,
      FLocCod: locationnumber || getLocationNumber,
      FYerDsc: yeardescription || getyeardescription,
      FIntDat: fromInputDate,
      FFnlDat: toInputDate,
       FComPrc:mobileNumber,
       FRepRat:transectionType,

      // code: "BRIGHT",
      // FLocCod: "001",
      // FYerDsc:'2024-2024'
    }).toString();

    axios
      .post(apiUrl, formData)
      .then((response) => {
        setIsLoading(false);
        console.log("Response:", response.data);

    settotalqnty(response.data["Total Qnty"]);
    settotalcost(response.data["Total Cost"]);
    settotalamount(response.data["Total Amount"]);
    settotalmargin(response.data["Total Margin"]);
    settotaldelivery(response.data["Total Delivery"]);
    settotalProfit(response.data["Total Profit"]);
    settotalNetMargin(response.data["Total Net Margin"]);
    settotalCom(response.data["Total Comm"]);
    settotalComPercentage(response.data["Total CommPercentage"]);
    settotalExpense(response.data["Total Expense"]);
    settotalNetCom(response.data["Total Net Comm"]);

        if (response.data && Array.isArray(response.data.Detail)) {
          setTableData(response.data.Detail);
        } else {
          console.warn(
            "Response data structure is not as expected:",
            response.data,
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
        1,
      );
      setSelectedfromDate(firstDateOfCurrentMonth);
      setfromInputDate(formatDate(firstDateOfCurrentMonth));
    }, []);
  
 const handleMobilePress = (e, nextInputRef) => {
  const inputEl = document.getElementById("phone");
  const value = Number(e.target.value);

  if (e.key === "Enter") {
    e.preventDefault();

    // empty validation
    if (value === "" || value === null || isNaN(value)) {
      toast.error("Commission cannot be empty");
      inputEl.style.border = "2px solid red";
      return;
    }

    // range validation
    if (value < 0 || value > 50) {
      toast.error("Commission must be between 0% and 50%");
      inputEl.style.border = "2px solid red";
      return;
    }

    inputEl.style.border = "1px solid black";

    // move to next input
    if (nextInputRef.current) {
      nextInputRef.current.focus();
    //   nextInputRef.current.select();
    }
  }
};


 const handleMobilenumberInputChange = (e) => {
  let value = e.target.value;

  // 🔥 allow only numbers + one decimal point
  value = value.replace(/[^0-9.]/g, "");

  // 🔥 prevent multiple dots
  const parts = value.split(".");
  if (parts.length > 2) {
    value = parts[0] + "." + parts[1];
  }

  // limit integer part to 2 digits (max 50 rule still applies)
  let num = Number(value);

  // empty input → 0
  if (value === "") {
    setmobileNumber("0");
    return;
  }

  // if value > 50 → ignore
  if (num > 50) {
    return;
  }

  setmobileNumber(value);
};

  //  const exportPDFHandler = () => {
         
         
  //         // Create a new jsPDF instance with landscape orientation
  //         const doc = new jsPDF({ orientation: "landscape" });
  
  //         // Define table data (rows)
  //         const rows = tableData.map((item) => [
  //             item.code,
  //             item["Sales Man"],
  //            formatValue(item.Qnty) ,
  //            formatValue(item.Cost) ,
  //         formatValue(item.Amount)    ,
  //        formatValue(item.Margin)      ,
  //         //  formatValue(item.Delivery)    ,
  //         //  formatValue(item["Other Profit"])    ,
  //           formatValue(item["Net Margin"])   ,
  //              formatValue(item.Comm)    ,
  //                 formatValue(item.CommPercentage)    ,
  //                   //  formatValue(item.Expense)    ,
  //                      formatValue(item["Net Comm"])   ,
  //         ]);
  
  //         // Add summary row to the table
  
  //         rows.push([
  //                         String(formatValue(tableData.length.toLocaleString())),
  //            "",
  //             String(formatValue(totalqnty)),
  //             String(formatValue(totalcost)),
  //             String(formatValue(totalamount)),
  //             String(formatValue(totalmargin)),
  //             //  String(formatValue(totaldelivery)),
  //             // String(formatValue(totalProfit)),
  //             String(formatValue(totalNetMargin)),
  //             String(formatValue(totalCom)),
  //             String(formatValue(totalComPercentage)),
  //             // String(formatValue(totalExpense)),
  //             String(formatValue(totalNetMargin)),
  //         ]);
  
  //         // Define table column headers and individual column widths
  //         const headers = [
  //             "Code",
  //             "Sales Man",
  //             "Cost",
  //             "Qnty",
  //             "Amount",
  //             "Margin",
  //             // "Delivery",
  //             // "Other Pro",
  //             "Nwt Mar",
  //             "Comm",
  //             "ComPer",
  //             // "Expense",
  //             "Net Mar"
  //         ];
  //         const columnWidths = [18, 80, 25, 15, 25, 25, 25,25,20,25];
  
  //         // Calculate total table width
  //         const totalWidth = columnWidths.reduce((acc, width) => acc + width, 0);
  
  //         // Define page height and padding
  //         const pageHeight = doc.internal.pageSize.height;
  //         const paddingTop = 15;
  
  //           doc.setFont("verdana-regular", "normal");
  //           doc.setFontSize(10);
  
  //         // Function to add table headers
  //         const addTableHeaders = (startX, startY) => {
  //             // Set font style and size for headers
  //           doc.setFont("verdana", "bold");
  //           doc.setFontSize(10);
  
  //             headers.forEach((header, index) => {
  //                 const cellWidth = columnWidths[index];
  //                 const cellHeight = 6; // Height of the header row
  //                 const cellX = startX + cellWidth / 2; // Center the text horizontally
  //                 const cellY = startY + cellHeight / 2 + 1.5; // Center the text vertically
  
  //                 // Draw the grey background for the header
  //                 doc.setFillColor(200, 200, 200); // Grey color
  //                 doc.rect(startX, startY, cellWidth, cellHeight, "F"); // Fill the rectangle
  
  //                 // Draw the outer border
  //                 doc.setLineWidth(0.2); // Set the width of the outer border
  //                 doc.rect(startX, startY, cellWidth, cellHeight);
  
  //                 // Set text alignment to center
  //                 doc.setTextColor(0); // Set text color to black
  //                 doc.text(header, cellX, cellY, { align: "center" }); // Center the text
  //                 startX += columnWidths[index]; // Move to the next column
  //             });
  
             
  //         };
  
  //         const addTableRows = (startX, startY, startIndex, endIndex) => {
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
  //             "F"
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
  //             rowBottomY - 0.5
  //           );
  
  //           doc.setLineWidth(0.2);
  //           doc.line(startX, rowTopY, startX, rowBottomY);
  //           doc.line(
  //             startX + tableWidth,
  //             rowTopY,
  //             startX + tableWidth,
  //             rowBottomY
  //           );
  //         } else {
  //           doc.setLineWidth(0.2);
  //           doc.rect(
  //             startX,
  //             startY + (i - startIndex + 2) * rowHeight,
  //             tableWidth,
  //             rowHeight
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
  
  //           if (cellIndex === 0) {
  //             const rightAlignX = startX + columnWidths[cellIndex] / 2;
  //             doc.text(cellValue, rightAlignX, cellY, {
  //               align: "center",
  //               baseline: "middle",
  //             });
  //           } else if (
  //             cellIndex > 1  
            
  //           ) {
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
  //               startY + (i - startIndex + 3) * rowHeight
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
  
  //         // Function to calculate total table width
  //         const getTotalTableWidth = () => {
  //             let totalWidth = 0;
  //             columnWidths.forEach((width) => (totalWidth += width));
  //             return totalWidth;
  //         };
  
  //         // Function to add a new page and reset startY
  //         const addNewPage = (startY) => {
  //             doc.addPage();
  //             return paddingTop; // Set startY for each new page
  //         };
  
  //         // Define the number of rows per page
  //         const rowsPerPage = 31; // Adjust this value based on your requirements
  
  //         // Function to handle pagination
  //         const handlePagination = () => {
  //             // Define the addTitle function
  //             const addTitle = (
  //                 title,
  //                 date,
  //                 time,
  //                 pageNumber,
  //                 startY,
  //                 titleFontSize = 18,
  //                 pageNumberFontSize = 10
  //             ) => {
  //                 doc.setFontSize(titleFontSize); // Set the font size for the title
  //                 doc.text(title, doc.internal.pageSize.width / 2, startY, {
  //                     align: "center",
  //                 });
  
  //                 // Calculate the x-coordinate for the right corner
  //                 const rightX = doc.internal.pageSize.width - 10;
  
  //                 // if (date) {
  //                 //     doc.setFontSize(dateTimeFontSize); // Set the font size for the date and time
  //                 //     if (time) {
  //                 //         doc.text(date + " " + time, rightX, startY, { align: "right" });
  //                 //     } else {
  //                 //         doc.text(date, rightX - 10, startY, { align: "right" });
  //                 //     }
  //                 // }
  
  //                 // Add page numbering
  //  doc.setFont("verdana-regular", "normal");
  //             doc.setFontSize(10);
              
  //             doc.text(
  //                     `Page ${pageNumber}`,
  //                     rightX - 20,
  //                     doc.internal.pageSize.height - 10,
  //                     { align: "right" }
  //                 );
  //             };
  
  //             let currentPageIndex = 0;
  //             let startY = paddingTop; // Initialize startY
  //             let pageNumber = 1; // Initialize page number
  
  //             while (currentPageIndex * rowsPerPage < rows.length) {
  //                doc.setFont("Times New Roman", "normal");
  //                 addTitle(comapnyname, 12, 12, pageNumber, startY, 18); // Render company title with default font size, only date, and page number
  //                 startY += 5; // Adjust vertical position for the company title
  //  doc.setFont("verdana-regular", "normal");
  //                 addTitle(
  //                     `Employee Performance Report From: ${fromInputDate} To: ${toInputDate}`,
  //                     "",
  //                     "",
  //                     pageNumber,
  //                     startY,
  //                     12
  //                 ); // Render sale report title with decreased font size, provide the time, and page number
  //                 startY += -5;
  
  //                 const labelsX = (doc.internal.pageSize.width - totalWidth) / 2;
  //                 const labelsY = startY + 4; // Position the labels below the titles and above the table
  
                
  //                 let TypeFilter =
  //                     transectionType === "P"
  //                         ? "PERCHASE RATE"
  //                         : transectionType === "A"
  //                                                   ? "AVERAGE RATE"
  //                                                                 : transectionType === "M"
  //                                                                     ? "LAST SM RATE"
  //                                                                     : transectionType === "W"
  //                                                                         ? "WEIGHTED AVERAGE"
  //                                                                         : transectionType === "F"
  //                                                                         ? "FIFO"
  //                                                                         : "ALL";
  
                 
  
  //  doc.setFont("verdana", "bold");
  //             doc.setFontSize(10);     
  //                        doc.text(`RATE :`, labelsX, labelsY + 8.5); // Draw bold label
  //  doc.setFont("verdana-regular", "normal");
  //             doc.setFontSize(10);
  //                             doc.text(`${TypeFilter}`, labelsX + 20, labelsY + 8.5); // Draw the value next to the label
  
  //  doc.setFont("verdana", "bold");
  //             doc.setFontSize(10);
  //                             doc.text(`Commission :`, labelsX + 180, labelsY + 8.5); // Draw bold label
  //  doc.setFont("verdana-regular", "normal");
  //             doc.setFontSize(10);
  //                             doc.text(`${mobileNumber}`, labelsX + 208, labelsY + 8.5); // Draw the value next to the label
  
                
  //                 startY += 10; // Adjust vertical position for the labels
  
  //                 addTableHeaders((doc.internal.pageSize.width - totalWidth) / 2, 29);
  //                 const startIndex = currentPageIndex * rowsPerPage;
  //                 const endIndex = Math.min(startIndex + rowsPerPage, rows.length);
  //                 startY = addTableRows(
  //                     (doc.internal.pageSize.width - totalWidth) / 2,
  //                     startY,
  //                     startIndex,
  //                     endIndex
  //                 );
  //                 if (endIndex < rows.length) {
  //                     startY = addNewPage(startY); // Add new page and update startY
  //                     pageNumber++; // Increment page number
  //                 }
  //                 currentPageIndex++;
  //             }
  //         };
  
  //         const getCurrentDate = () => {
  //             const today = new Date();
  //             const dd = String(today.getDate()).padStart(2, "0");
  //             const mm = String(today.getMonth() + 1).padStart(2, "0"); // January is 0!
  //             const yyyy = today.getFullYear();
  //             return dd + "/" + mm + "/" + yyyy;
  //         };
  
  //         // Function to get current time in the format HH:MM:SS
  //         const getCurrentTime = () => {
  //             const today = new Date();
  //             const hh = String(today.getHours()).padStart(2, "0");
  //             const mm = String(today.getMinutes()).padStart(2, "0");
  //             const ss = String(today.getSeconds()).padStart(2, "0");
  //             return hh + ":" + mm + ":" + ss;
  //         };
  
  //         const date = getCurrentDate(); // Get current date
  //         const time = getCurrentTime(); // Get current time
  
  //         // Call function to handle pagination
  //         handlePagination();
  
  //         // Save the PDF files
  //         doc.save(
  //             `Employee Performance Report Form ${fromInputDate} To ${toInputDate}.pdf`
  //         );
  //     };

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

  // ─── 2. TABLE DATA (rows) ──────────────────────────────────
  const rows = tableData.map((item) => [
    item.code,
    item["Sales Man"],
   
    formatValue(item.Cost),
     formatValue(item.Qnty),
    formatValue(item.Amount),
    formatValue(item.Margin),
    formatValue(item["Net Margin"]),
    formatValue(item.Comm),
    formatValue(item.CommPercentage),
    formatValue(item["Net Comm"]),
  ]);

  // Add total row
  rows.push([
    String(formatValue(tableData.length.toLocaleString())),
    "",
    String(formatValue(totalqnty)),
    String(formatValue(totalcost)),
    String(formatValue(totalamount)),
    String(formatValue(totalmargin)),
    String(formatValue(totalNetMargin)),
    String(formatValue(totalCom)),
    String(formatValue(totalComPercentage)),
    String(formatValue(totalNetMargin)),
  ]);

  // ─── 3. HEADERS & COLUMN WIDTHS ────────────────────────────
  const headers = [
    "Code",
    "Sales Man",
      "Cost",
    "Qnty",  
    "Amount",
    "Margin",
    "Nwt Mar",
    "Comm",
    "ComPer",
    "Net Mar",
  ];
  const columnWidths = [15, 70, 30, 20, 30, 30, 30, 25, 16, 25];

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

  // ─── 7. DRAW A SINGLE ROW (WITH NO WRAP FOR NUMERIC COLUMNS) ──
  const drawRow = (startX, startY, rowIndex, rowData, isTotalRow) => {
    const lineHeight = 4;
    const tableWidth = getTotalTableWidth();
    const textColor = [0, 0, 0];

    // ── Split each cell, but DO NOT split numeric columns (indices >= 2) ──
    const splitRow = rowData.map((cell, idx) => {
      const text = String(cell).trim();
      // Numeric columns: Qnty, Cost, Amount, Margin, Net Margin, Comm, Comm%, Net Comm
      if (idx >= 2) {
        return [text]; // keep on one line
      }
      // For Code (0) and Sales Man (1) – allow wrapping
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

      // Alignment
      let align = "left";
      if (cellIndex === 0) align = "center";
      else if (cellIndex > 1) align = "right"; // all numeric columns right-aligned
      if (isTotalRow && cellIndex === 0) align = "center"; // total count centred

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

  // ─── 8. ADD PAGE CONTENT (title, labels, headers) ──────────
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
      `Employee Performance Report From: ${fromInputDate} To: ${toInputDate}`,
      startY,
      12
    );
    startY -= 5;

    const labelsX = (doc.internal.pageSize.width - totalWidth) / 2;
    const labelsY = startY + 4;

    let TypeFilter =
      transectionType === "P"
        ? "PERCHASE RATE"
        : transectionType === "A"
        ? "AVERAGE RATE"
        : transectionType === "M"
        ? "LAST SM RATE"
        : transectionType === "W"
        ? "WEIGHTED AVERAGE"
        : transectionType === "F"
        ? "FIFO"
        : "ALL";

    doc.setFont("verdana", "bold");
    doc.setFontSize(10);
    doc.text(`RATE :`, labelsX, labelsY + 8.5);
    doc.setFont("verdana-regular", "normal");
    doc.text(`${TypeFilter}`, labelsX + 20, labelsY + 8.5);

    doc.setFont("verdana", "bold");
    doc.text(`Commission :`, labelsX + 180, labelsY + 8.5);
    doc.setFont("verdana-regular", "normal");
    doc.text(`${mobileNumber}`, labelsX + 208, labelsY + 8.5);

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

        // Estimate row height using the Sales Man column (index 1)
        const salesManText = String(row[1]);
        const maxWidth = columnWidths[1] - 4;
        const lines = doc.splitTextToSize(salesManText, maxWidth);
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
      // Same no-wrap rule for numeric columns
      const splitRow = rowData.map((cell, idx) => {
        const text = String(cell).trim();
        if (idx >= 2) return [text];
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
      // Approximate: title + labels + headers ≈ 34 mm
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
  doc.save(`Employee Performance Report Form ${fromInputDate} To ${toInputDate}.pdf`);
};

  const handleDownloadCSV = async () => {
  const workbook = new ExcelJS.Workbook();
  const worksheet = workbook.addWorksheet("Sheet1");

  const numColumns = 13;

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
    "right",
    "right",
    "right",
    "right",
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
    `Employee Performance Report From ${fromInputDate} To ${toInputDate}`,
  ]);
  storeListRow.eachCell((cell) => {
    cell.font = fontStoreList;
    cell.alignment = { horizontal: "center" };
  });
  worksheet.mergeCells(
    `A${storeListRow.number}:${String.fromCharCode(65 + numColumns - 1)}${storeListRow.number}`
  );

  worksheet.addRow([]);

  let TypeFilter =
    transectionType === "P"
      ? "PERCHASE RATE"
      : transectionType === "A"
      ? "AVERAGE RATE"
      : transectionType === "M"
      ? "LAST SM RATE"
      : transectionType === "W"
      ? "WEIGHTED AVERAGE"
      : transectionType === "F"
      ? "FIFO"
      : "ALL";

  const typeAndStoreRow2 = worksheet.addRow([
    "Rate :",
    TypeFilter,
    "",
    "",
    "",
    "",
    "Commission :",
    mobileNumber,
  ]);

  worksheet.mergeCells(`B${typeAndStoreRow2.number}:D${typeAndStoreRow2.number}`);

  typeAndStoreRow2.eachCell((cell, colIndex) => {
    cell.font = {
      name: "CustomFont",
      size: 10,
      bold: [1, 7].includes(colIndex),
    };
    cell.alignment = { horizontal: "left", vertical: "middle" };
  });

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

  const headers = [
    "Code",
    "Sales Man",
    "Cost",
    "Qnty",
    "Amount",
    "Margin",
    "Delivery",
    "Other Pro",
    "Nwt Mar",
    "Comm",
    "ComPer",
    "Expense",
    "Net Mar",
  ];
  const headerRow = worksheet.addRow(headers);
  headerRow.eachCell((cell) => Object.assign(cell, headerStyle));

  // Data rows with numeric conversion
  tableData.forEach((item) => {
    const row = worksheet.addRow([
      item.code,
      item["Sales Man"],
      
      toNumber(item.Cost),
      toNumber(item.Qnty),
      toNumber(item.Amount),
      toNumber(item.Margin),
      toNumber(item.Delivery),
      toNumber(item["Other Profit"]),
      toNumber(item["Net Margin"]),
      toNumber(item.Comm),
      toNumber(item.CommPercentage),
      toNumber(item.Expense),
      toNumber(item["Net Comm"]),
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
      // Apply number format (no decimals) for columns 3 to 13
      if (colIndex >= 3 && colIndex <= 13) {
        cell.numFmt = "#,##0";
      }
    });
  });

  // Total row – all values as numbers
  const totalRow = worksheet.addRow([
    tableData.length, // record count
    "",
    toNumber(totalqnty),
    toNumber(totalcost),
    toNumber(totalamount),
    toNumber(totalmargin),
    toNumber(totaldelivery),
    toNumber(totalProfit),
    toNumber(totalNetMargin),
    toNumber(totalCom),
    toNumber(totalComPercentage),
    toNumber(totalExpense),
    toNumber(totalNetMargin),
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

  // Set column widths
  [10, 40, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12].forEach((width, index) => {
    worksheet.getColumn(index + 1).width = width;
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
    cell.font = { name: "CustomFont", size: 10 };
    cell.alignment = { horizontal: "left" };
  });

  const dateTimeRow1 = worksheet.addRow([`USER ID:  ${userid}`]);
  // FIXED: was incorrectly using dateTimeRow.eachCell
  dateTimeRow1.eachCell((cell) => {
    cell.font = { name: "CustomFont", size: 10 };
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
  saveAs(blob, `Employee Performance Report  From ${fromInputDate} To ${toInputDate}.xlsx`);
};

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

  
  const isLargeScreen = window.innerWidth > 1500;

  const contentStyle = {
 width: "100%",
  maxWidth: isSidebarVisible
    ? (isLargeScreen ? "1250px" : "1000px")
    : (isLargeScreen ? "1300px" : "1200px"),
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
  fontFamily: "verdana",
  zIndex: 1,
  padding: "0 20px",
  boxSizing: "border-box",
};

    const firstColWidth = {
    width: "45px",
  };
  const secondColWidth = {
    width: isSidebarVisible ? "150px" :'250px',

      width: isSidebarVisible
    ? (isLargeScreen ? "200px" : "80px")
    : (isLargeScreen ? "230px" : "150px"),
  };
  const forthColWidth = {
        width: isSidebarVisible
    ? (isLargeScreen ? "95px" : "95px")
    : (isLargeScreen ? "95px" : "95px"),
  };
  const thirdColWidth = {
        width: isSidebarVisible
    ? (isLargeScreen ? "70px" : "60px")
    : (isLargeScreen ? "70px" : "70px"),
  };
   const fifthColWidth = {
      width: isSidebarVisible
    ? (isLargeScreen ? "95px" : "90px")
    : (isLargeScreen ? "95px" : "95px"),
  };
    const sixthColWidth = {
       width: isSidebarVisible
    ? (isLargeScreen ? "95px" : "90px")
    : (isLargeScreen ? "95px" : "95px"),
    };
  const seventhColWidth = {
      width: isSidebarVisible
    ? (isLargeScreen ? "95px" : "70px")
    : (isLargeScreen ? "95px" : "95px"),
  };
  const eightColWidth = {
     width: isSidebarVisible
    ? (isLargeScreen ? "95px" : "75px")
    : (isLargeScreen ? "95px" : "95px"),
  };
  const ninthColWidth = {
    width: isSidebarVisible
    ? (isLargeScreen ? "95px" : "80px")
    : (isLargeScreen ? "95px" : "95px"),
  };
  const tenthColWidth = {
    width: isSidebarVisible
    ? (isLargeScreen ? "95px" : "70px")
    : (isLargeScreen ? "95px" : "95px"),
  };
  const elewenthColWidth = {
    width: isSidebarVisible
    ? (isLargeScreen ? "60px" : "60px")
    : (isLargeScreen ? "60px" : "60px"),
  };
   const tewelthColWidth = {
     width: isSidebarVisible
    ? (isLargeScreen ? "95px" : "90px")
    : (isLargeScreen ? "95px" : "95px"),
  };
   const thirteenColWidth = {
  width: isSidebarVisible
    ? (isLargeScreen ? "95px" : "80px")
    : (isLargeScreen ? "95px" : "95px"),
  };
  const sixthcol = {
    width: "8px",
  };

  useEffect(() => {
    document.documentElement.style.setProperty("--background-color", getcolor);
  }, [getcolor]);

  const [columns, setColumns] = useState({
    Code: [],
    Description: [],
    Opening: [],
    Debit: [],
    Credit: [],
    Balance: [],
  });
  const [columnSortOrders, setColumnSortOrders] = useState({
    Code: "",
    Description: "",
    Opening: "",
    Debit: "",
    Credit: "",
    Balance: "",
  });

  useEffect(() => {
    if (tableData.length > 0) {
      const newColumns = {
        Code: tableData.map((row) => row.Code),
        Description: tableData.map((row) => row.Description),
        Opening: tableData.map((row) => row.Opening),
        Debit: tableData.map((row) => row.Debit),
        Credit: tableData.map((row) => row.Credit),
        Balance: tableData.map((row) => row.Balance),
      };
      setColumns(newColumns);
    }
  }, [tableData]);

  const handleSorting = (col) => {
    // Determine the new sort order
    const currentOrder = columnSortOrders[col];
    const newOrder = currentOrder === "ASC" ? "DSC" : "ASC";

    // Create a copy of the table data to sort
    const sortedData = [...tableData];

    // Sort the data based on the column and order
    sortedData.sort((a, b) => {
      // Get the values to compare
      const aVal =
        a[col] !== null && a[col] !== undefined ? a[col].toString() : "";
      const bVal =
        b[col] !== null && b[col] !== undefined ? b[col].toString() : "";

      // Special handling for code column
      if (col === "Code" && aVal.includes("-") && bVal.includes("-")) {
        // Split the codes into parts
        const aParts = aVal.split("-");
        const bParts = bVal.split("-");

        // Compare each part numerically
        for (let i = 0; i < Math.max(aParts.length, bParts.length); i++) {
          const aPart = parseInt(aParts[i] || "0", 10);
          const bPart = parseInt(bParts[i] || "0", 10);

          if (aPart !== bPart) {
            return newOrder === "ASC" ? aPart - bPart : bPart - aPart;
          }
        }
        return 0;
      }

      // Try to compare as numbers first
      const numA = parseFloat(aVal.replace(/,/g, ""));
      const numB = parseFloat(bVal.replace(/,/g, ""));

      if (!isNaN(numA) && !isNaN(numB)) {
        return newOrder === "ASC" ? numA - numB : numB - numA;
      }

      // Fall back to string comparison
      return newOrder === "ASC"
        ? aVal.localeCompare(bVal)
        : bVal.localeCompare(aVal);
    });

    // Update the table data with the sorted data
    setTableData(sortedData);

    // Reset all sort orders and set the new one for the clicked column
    const resetSortOrders = Object.keys(columnSortOrders).reduce((acc, key) => {
      acc[key] = key === col ? newOrder : null;
      return acc;
    }, {});

    setColumnSortOrders(resetSortOrders);
  };

  const resetSorting = () => {
    setColumnSortOrders({
      Code: null,
      Description: null,
      Opening: null,
      Debit: null,
      Credit: null,
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

  const formatValue = (val) => {
    return Number(val) === 0 ? "" : val;
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
                <NavComponent textdata="Employee Performnace Report" />
      
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
                    <div className="d-flex align-items-center">
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
                          onKeyDown={(e) => handleToKeyPress(e, input4Refrate)}
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
                            Rate :
                          </span>
                        </label>
                      </div>
      
                      <div style={{ position: "relative", display: "inline-block" }}>
                        <select
                          ref={input4Refrate}
                          onKeyDown={(e) => handleKeyPress(e, CommissionRef)}
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
                            width: "225px",
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
                          <option value="P">PURCHASE RATE</option>
                          <option value="A">AVERAGE RATE</option>
                          <option value="M">LAST SM RATE</option>
                          <option value="W">WEIGHTED AVERAGE</option>
                          <option value="F">FIFO</option>
                        </select>
      
                        {transectionType !== "P" && (
                          <span
                            onClick={() => settransectionType("P")}
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
                  style={{ marginTop: "8px", marginBottom: "8px", margin: "0px" }}
                >
                  <div
                    style={{
                      width: "100%",
                      display: "flex",
                      alignItems: "center",
                      margin: "0px",
                      padding: "0px",
                      justifyContent: "start",
                      border: "1px solid lightgrey",
                      // boxShadow: "0px 2px 6px rgba(0,0,0,0.25)", // 👈 shadow added
                    }}
                  ></div>
                </div>
              
             
                {/* //////////////// FORTH ROW ///////////////////////// */}
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
                      justifyContent: "end",
                    }}
                  >
                                <div className="d-flex align-items-center " style={{marginRight:'21px'}}>
                                      <div
                                          style={{
                                              width: "110px",
                                              display: "flex",
                                              justifyContent: "end",
                                          }}
                                      >
                                          <label htmlFor="fromDatePicker">
                                              <span style={{ fontSize: getdatafontsize, fontFamily: getfontstyle, fontWeight: "bold" }}>
                                                  Commission % :
                                              </span>{" "}
                                              <br />
                                          </label>
                                      </div>
      
                                     <input
        ref={CommissionRef}
        value={mobileNumber}
        onKeyDown={(e) => handleMobilePress(e, selectButtonRef)}
        onChange={handleMobilenumberInputChange}
        autoComplete="off"
        type="number"
        id="phone"
        name="phone"
        placeholder="0"
        style={{
          color: fontcolor,
          width: "225px",
          height: "24px",
          fontSize: getdatafontsize,
          fontFamily: getfontstyle,
          border: `1px solid ${fontcolor}`,
          backgroundColor: getcolor,
          outline: "none",
          paddingLeft: "10px",
          marginLeft: "3px",
        }}
        onFocus={(e) => (e.currentTarget.style.border = "2px solid red")}
        onBlur={(e) => (e.currentTarget.style.border = `1px solid ${fontcolor}`)}
      />
      
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
                          <td className="border-dark" style={firstColWidth}>
                            Code
                          </td>
                          <td className="border-dark" style={secondColWidth}>
                            Sales Man
                          </td>
                          <td className="border-dark" style={thirdColWidth}>
                            Cost
                          </td>
                          <td className="border-dark" style={forthColWidth}>
                            Qnty
                          </td>
                          <td className="border-dark" style={fifthColWidth}>
                            Amount
                          </td>
                          <td className="border-dark" style={sixthColWidth}>
                            Margin
                          </td>                        
                          <td className="border-dark" style={seventhColWidth}>
                            Delivery
                          </td>                         
                           <td className="border-dark" style={eightColWidth}>
                            Oth Pro
                          </td>
                           <td className="border-dark" style={ninthColWidth}>
                            Nt Mar
                          </td>
                           <td className="border-dark" style={tenthColWidth}>
                            Com
                          </td>
                           <td className="border-dark" style={elewenthColWidth}>
                            ComPer
                          </td>
                           <td className="border-dark" style={tewelthColWidth}>
                            Expense
                          </td>
                           <td className="border-dark" style={thirteenColWidth}>
                            Nt Com
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
                      maxHeight: "50vh",
                      // width: "100%",
                      wordBreak: "break-word",
                                  
                    }}
                  >
                    <table
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
                                  {Array.from({ length: 13 }).map((_, colIndex) => (
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
                              <td style={elewenthColWidth}></td>
                              <td style={tewelthColWidth}></td>
                              <td style={thirteenColWidth}></td>
      
                            </tr>
                          </>
                        ) : (
                          <>
                            {tableData.map((item, i) => {
                              totalEnteries += 1;
                              const nQnty = Number(
                                String(item.Qnty).replace(/,/g, "")
                              );
                              const nRate = Number(
                                String(item.Rate).replace(/,/g, "")
                              );
                              const nMargin = Number(
                                String(item.Margin).replace(/,/g, "")
                              );
      
                              const isNegative =
                                nQnty < 0 || nRate < 0;
      
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
                                  <td className="text-center" style={firstColWidth}>
                                    {item.code}
                                  </td>
                                 <td
                    className="text-start"
                    title={item['Sales Man']}
                    style={{
                      ...secondColWidth,
                      whiteSpace: "nowrap",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                    }}
                  >
                    {item['Sales Man']}
                  </td>
                                  <td className="text-end" style={thirdColWidth}>
                                    { formatValue(item.Cost)}
                                  </td>
                                  <td className="text-end" style={forthColWidth}>
                                    {formatValue(item.Qnty)}
                                  </td>
                                  <td className="text-end" style={fifthColWidth}>
                                    {formatValue(item.Amount)}
                                  </td>
                                  <td className="text-end" style={sixthColWidth}>
                                               {item.Margin}
                                             </td>
                                             <td className="text-end" style={seventhColWidth}>
                                    {formatValue(item.Delivery)}
                                  </td>
                                  <td className="text-end" style={eightColWidth}>
                                    {formatValue(item['Other Profit'])}
                                  </td>
                                  
                                  <td className="text-end" style={ninthColWidth}>
                                    {formatValue(item['Net Margin'])}
                                  </td>
                                  <td className="text-end" style={tenthColWidth}>
                                    {formatValue(item.Comm)}
                                  </td>
                                   <td className="text-end" style={elewenthColWidth}>
                                    {formatValue(item.CommPercentage)}
                                  </td>

                                    <td className="text-end" style={tewelthColWidth}>
                                    {formatValue(item.Expense)}
                                  </td>
                                    <td className="text-end" style={thirteenColWidth}>
                                    {formatValue(item['Net Comm'])}
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
                                {Array.from({ length: 13 }).map((_, colIndex) => (
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
                              <td style={elewenthColWidth}></td>
                              <td style={tewelthColWidth}></td>
                              <td style={thirteenColWidth}></td>
      
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
                    <span className="mobileledger_total">{formatValue(totalqnty)}</span>
                  </div>
                  <div
                    style={{
                      ...forthColWidth,
                      background: getcolor,
                      borderRight: `1px solid ${fontcolor}`,
                    }}
                  >
                    <span className="mobileledger_total">{formatValue(totalcost)}</span>
                  </div>
                   <div
                    style={{
                      ...fifthColWidth,
                      background: getcolor,
                      borderRight: `1px solid ${fontcolor}`,
                    }}
                  >
                    <span className="mobileledger_total">{totalamount}</span>
                  </div>
                  <div
                               style={{
                                 ...sixthColWidth,
                                 background: getcolor,
                                 borderRight: `1px solid ${fontcolor}`,
                               }}
                             >
                               <span className="mobileledger_total">{formatValue(totalmargin)}</span>
                             </div>
       <div
                    style={{
                      ...seventhColWidth,
                      background: getcolor,
                      borderRight: `1px solid ${fontcolor}`,
                    }}
                  >
                    <span className="mobileledger_total">{formatValue(totaldelivery)}</span>
                  </div>
                  <div
                    style={{
                      ...eightColWidth,
                      background: getcolor,
                      borderRight: `1px solid ${fontcolor}`,
                    }}
                  >
                    <span className="mobileledger_total">
                      {formatValue(totalProfit)}
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
                      {formatValue(totalNetMargin)}
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
                      {formatValue(totalCom)}
                    </span>
                  </div>
      
                   <div
                    style={{
                      ...elewenthColWidth,
                      background: getcolor,
                      borderRight: `1px solid ${fontcolor}`,
                    }}
                  >
                    <span className="mobileledger_total">
                      {formatValue(totalComPercentage)}
                    </span>
                  </div>
                   <div
                    style={{
                      ...tewelthColWidth,
                      background: getcolor,
                      borderRight: `1px solid ${fontcolor}`,
                    }}
                  >
                    <span className="mobileledger_total">
                      {formatValue(totalExpense)}
                    </span>
                  </div>

                  <div
                    style={{
                      ...thirteenColWidth,
                      background: getcolor,
                      borderRight: `1px solid ${fontcolor}`,
                    }}
                  >
                    <span className="mobileledger_total">
                      {formatValue(totalNetCom)}
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







