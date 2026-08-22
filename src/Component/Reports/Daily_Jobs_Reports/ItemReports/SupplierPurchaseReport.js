
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

export default function SupplierPurchaseReport() {
  const navigate = useNavigate();
  const user = getUserData();
  const organisation = getOrganisationData();

  const saleSelectRef = useRef(null);
  const input1Ref = useRef(null);
  const input2Ref = useRef(null);
  const input3Ref = useRef(null);

  const toRef = useRef(null);
  const fromRef = useRef(null);
  const companyRef = useRef(null);
  const categoryRef = useRef(null);
  const accountRef = useRef(null);
  const storeRef = useRef(null);
  const typeRef = useRef(null);
  const searchRef = useRef(null);
  const selectButtonRef = useRef(null);
  
  // DOUBLE STATE HANDLE
  const [isItemInitialized, setIsItemInitialized] = useState(false);
  const [isCodeReady, setIsCodeReady] = useState(false);
  const [isDoubleClickOpen, setIsDoubleClickOpen] = useState(false);
    const [saleType, setaccountsty] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [transectionType, settransectionType] = useState("");

  const [isAccountValid, setIsAccountValid] = useState(true);

  const [companyType, setCompanyType] = useState("");
  const [categoryType, setCategoryType] = useState("");
  const [accountType, setAccountType] = useState("");

  const [companyList, setCompanyList] = useState([]);
  const [categoryList, setCategoryList] = useState([]);
  const [AccountList, setAccountList] = useState([]);

  const [companyTypeDataValue, setCompanyTypeDataValue] = useState("");
  const [categoryTypeDataValue, setCategoryTypeDataValue] = useState("");
  const [accountTypeDataValue, setAccountTypeDataValue] = useState("");

  const [totalQnty, setTotalQnty] = useState(0);
  const [totalAmount, setTotalAmount] = useState(0);

  // state for from DatePicker
  const [selectedfromDate, setSelectedfromDate] = useState(null);
  const [fromInputDate, setfromInputDate] = useState("");
  const [fromCalendarOpen, setfromCalendarOpen] = useState(false);
  // state for To DatePicker
  const [selectedToDate, setSelectedToDate] = useState(null);
  const [toInputDate, settoInputDate] = useState("");
  const [toCalendarOpen, settoCalendarOpen] = useState(false);

  const [selectedRadio, setSelectedRadio] = useState("custom"); // State to track selected radio button

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

  const handleToDateChange = (date) => {
    setSelectedToDate(date);
    settoInputDate(date ? formatDate(date) : "");
    settoCalendarOpen(false);
  };
  const handleToInputChange = (e) => {
    settoInputDate(e.target.value);
  };

  function fetchSupplierPurchaseComparison() {
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

    document.getElementById(
      "fromdatevalidation"
    ).style.border = `1px solid ${fontcolor}`;
    document.getElementById(
      "todatevalidation"
    ).style.border = `1px solid ${fontcolor}`;

    const apiMainUrl = apiLinks + "/SupplierPurchaseReport.php";
    setIsLoading(true);
    const formMainData = new URLSearchParams({
      code: organisation.code,
      FLocCod: locationnumber || getLocationNumber,
      FYerDsc: yeardescription || getyeardescription,
      FIntDat: fromInputDate,
      FFnlDat: toInputDate,
    //   FAccCod: "21-01-0001",
      FAccCod: accountType,
      FCmpCod: companyType,
      FCtgCod: categoryType,
      FRepTyp: transectionType,
      FSchTxt: searchQuery,

      //  code: 'AGFACTORY',
      // FLocCod: "001",
      // FYerDsc: "2025-2025",
    }).toString();

    axios
      .post(apiMainUrl, formMainData)
      .then((response) => {
        setIsLoading(false);
        // console.log("Response:", response.data);

        setTotalQnty(response.data["Total Qnty"]);
        setTotalAmount(response.data["Total Amount"]);

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
    if (!hasComponentMountedPreviously || (saleSelectRef && saleSelectRef.current)) {
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
      const apiUrl = apiLinks + "/GetActiveSupplier.php";
      const formData = new URLSearchParams({
        FLocCod: getLocationNumber,
        code: organisation.code,
        // FLocCod: '001',
        // code: 'AGFACTORY',
      }).toString();
      axios
        .post(apiUrl, formData)
        .then((response) => {
          setAccountList(response.data);
        })
        .catch((error) => {
          console.error("Error fetching data:", error);
        });
    }, []);
  
    const Accountoption = AccountList.map((item) => ({
      value: item.tacccod,
      label: `${item.tacccod}-${item.taccdsc?.trim() || ""}`,
    }));

     useEffect(() => {
        if (Accountoption.length === 0) return;
        if (isItemInitialized) return;
    
        const storedData = sessionStorage.getItem("GeneralLedgerData");
        let selectedOption = null;
    
        if (storedData) {
          const parsedData = JSON.parse(storedData);
          const clickedCode = parsedData.code?.trim();
          if (parsedData.code) {
            setIsDoubleClickOpen(true); // ✅ ADD
          }
          selectedOption = Accountoption.find((opt) => opt.value?.trim() === clickedCode);
    
          sessionStorage.removeItem("GeneralLedgerData");
        }
    
        if (!selectedOption) {
          selectedOption = Accountoption[0];
        }
    
        if (selectedOption) {
          setAccountType(selectedOption.value);
    
          const description = selectedOption.label
            .split("-")
            .slice(1)
            .join("-")
            .trim();
    
          setAccountTypeDataValue({
            value: selectedOption.value,
            label: description,
          });
    
          setIsCodeReady(true); // ✅ IMPORTANT
        }
    
        setIsItemInitialized(true);
      }, [Accountoption, isItemInitialized]);


 useEffect(() => {
      const apiUrl = apiLinks + "/GetCompany.php";
      const formData = new URLSearchParams({
        FLocCod: getLocationNumber,
        code: organisation.code,
        // FLocCod: '001',
        // code: 'NASIRTRD',
      }).toString();
      axios
        .post(apiUrl, formData)
        .then((response) => {
          setCompanyList(response.data);
        })
        .catch((error) => {
          console.error("Error fetching data:", error);
        });
    }, []);
  
    const Companyoption = companyList.map((item) => ({
      value: item.tcmpcod,
      label: `${item.tcmpcod}-${item.tcmpdsc?.trim() || ""}`,
    }));


     useEffect(() => {
      const apiUrl = apiLinks + "/GetCatg.php";
      const formData = new URLSearchParams({
        FLocCod: getLocationNumber,
        code: organisation.code,
        // FLocCod: '001',
        // code: 'NASIRTRD',
      }).toString();
      axios
        .post(apiUrl, formData)
        .then((response) => {
          setCategoryList(response.data);
        })
        .catch((error) => {
          console.error("Error fetching data:", error);
        });
    }, []);
  
    const Categoryoption = categoryList.map((item) => ({
      value: item.tctgcod,
      label: `${item.tctgcod}-${item.tctgdsc?.trim() || ""}`,
    }));



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
    width: 300,
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

  ///////////////////////////// DOWNLOAD PDF CODE ////////////////////////////////////////////////////////////
  
    const exportPDFHandler = () => {
  // ─── 1. PAGE SETUP & DATE/TIME ─────────────────────────────
  const doc = new jsPDF({ orientation: "portrait" });

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
    item.code,
    item.Description,
    item.Rate,
    item.Qnty,
    item.Amount,
  ]);

  // Add total row
  rows.push([
    String(formatValue(tableData.length.toLocaleString())),
    "",
    "",
    String(formatValue(totalQnty)),
    String(formatValue(totalAmount)),
  ]);

  // ─── 3. HEADERS & COLUMN WIDTHS ────────────────────────────
  const headers = [
    "Code",
    "Description",
    "Rate",
    "Qnty",
    "Amount",
  ];
  const columnWidths = [38, 95, 20, 15, 30];

  const totalWidth = columnWidths.reduce((acc, w) => acc + w, 0);
  const pageHeight = doc.internal.pageSize.height;
  const paddingTop = 15;
  const footerReserve = 18; // reduced for more rows

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

  // ─── 7. DRAW A SINGLE ROW (numeric columns do NOT wrap) ──
  const drawRow = (startX, startY, rowIndex, rowData, isTotalRow) => {
    const lineHeight = 4;
    const tableWidth = getTotalTableWidth();
    const textColor = [0, 0, 0];

    // Numeric columns: Rate (2), Qnty (3), Amount (4)
    const noWrapIndices = [2, 3, 4];

    const splitRow = rowData.map((cell, idx) => {
      const text = String(cell).trim();
      if (noWrapIndices.includes(idx)) {
        return [text]; // keep on one line
      }
      // Description (1) may wrap
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
      if (cellIndex === 10) {
        align = "center";
      } else if (cellIndex > 1) {
        align = "right";
      }
      // For total row, first cell (record count) should be centered
      if (isTotalRow && cellIndex === 0) align = "center";

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
      `Supplier Purchase Report From: ${fromInputDate} To: ${toInputDate}`,
      startY,
      12
    );
    startY -= 5;

    const labelsX = (doc.internal.pageSize.width - totalWidth) / 2;
    const labelsY = startY + 4;

    let searchdata = searchQuery ? searchQuery : "";
    let typecode =
      transectionType === "BIL"
        ? "PRUCHASE"
        : transectionType === "PN"
        ? "PRUCHASE RETURN"
        : "ALL";
    let search = accountTypeDataValue.label
      ? accountTypeDataValue.label
      : "ALL";
    let Companycode = companyTypeDataValue.label
      ? companyTypeDataValue.label
      : "ALL";
    let Categorycode = categoryTypeDataValue.label
      ? categoryTypeDataValue.label
      : "ALL";

    doc.setFont("verdana", "bold");
    doc.setFontSize(10);
    doc.text(`Account :`, labelsX, labelsY + 8.5);
    doc.setFont("verdana-regular", "normal");
    doc.text(`${search}`, labelsX + 25, labelsY + 8.5);

    doc.setFont("verdana", "bold");
    doc.text(`Company :`, labelsX + 130, labelsY + 8.5);
    doc.setFont("verdana-regular", "normal");
    doc.text(`${Companycode}`, labelsX + 155, labelsY + 8.5);

    doc.setFont("verdana", "bold");
    doc.text(`Category :`, labelsX, labelsY + 12.5);
    doc.setFont("verdana-regular", "normal");
    doc.text(`${Categorycode}`, labelsX + 25, labelsY + 12.5);

    doc.setFont("verdana", "bold");
    doc.text(`Type :`, labelsX + 130, labelsY + 12.5);
    doc.setFont("verdana-regular", "normal");
    doc.text(`${typecode}`, labelsX + 150, labelsY + 12.5);

    startY += 16;

    const headersStartY = 35;
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

        // Estimate row height using the Description column (index 1)
        const descText = String(row[1]);
        const maxWidth = columnWidths[1] - 4;
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
    const measureDoc = new jsPDF({ orientation: "portrait" });
    measureDoc.setFont("verdana-regular", "normal");
    measureDoc.setFontSize(10);

    const measureRows = [...rows];
    const measureColumnWidths = [...columnWidths];
    const measurePageHeight = measureDoc.internal.pageSize.height;
    const measureFooterReserve = 18;
    const lineHeight = 4;

    const measureDrawRow = (startY, rowIndex, rowData) => {
      const noWrapIndices = [2, 3, 4];
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
      // Approximate height of title + labels + headers = 34 mm
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
  doc.save(`SupplierPurchaseComparisonReport Form ${fromInputDate} To ${toInputDate}.pdf`);
};
    ///////////////////////////// DOWNLOAD PDF CODE ////////////////////////////////////////////////////////////
    ///////////////////////////// DOWNLOAD PDF EXCEL //////////////////////////////////////////////////////////
  const handleDownloadCSV = async () => {
  const workbook = new ExcelJS.Workbook();
  const worksheet = workbook.addWorksheet("Sheet1");

  const numColumns = 5;

  const columnAlignments = [
    "left",
    "left",
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
    `Supplier Purchase Report From ${fromInputDate} To ${toInputDate}`,
  ]);
  storeListRow.eachCell((cell) => {
    cell.font = fontStoreList;
    cell.alignment = { horizontal: "center" };
  });

  worksheet.mergeCells(
    `A${storeListRow.number}:${String.fromCharCode(65 + numColumns - 1)}${storeListRow.number}`
  );

  worksheet.addRow([]);

  let searchdata = searchQuery ? searchQuery : "";

  let typestatus = "";

  if (transectionType === "BIL") {
    typestatus = "PRUCHASE";
  } else if (transectionType === "PRN") {
    typestatus = "PRUCHASE RETURN";
  } else {
    typestatus = "ALL"; // Default value
  }

  let accountcode = accountTypeDataValue.label
    ? accountTypeDataValue.label
    : "ALL";

  let Companycode = companyTypeDataValue.label
    ? companyTypeDataValue.label
    : "ALL";

  let Categorycode = categoryTypeDataValue.label
    ? categoryTypeDataValue.label
    : "ALL";

  let typesearch = searchQuery || "";

  const typeAndStoreRow2 = worksheet.addRow([
    "Account :",
    accountcode,
    "Company :",
    Companycode,
  ]);

  const typeAndStoreRow3 = worksheet.addRow([
    "Category :",
    Categorycode,
    "Type :",
    typestatus,
  ]);

  worksheet.mergeCells(`B${typeAndStoreRow2.number}:B${typeAndStoreRow2.number}`);

  typeAndStoreRow2.eachCell((cell, colIndex) => {
    cell.font = {
      name: "CustomFont" || "CustomFont",
      size: 10,
      bold: [1, 3].includes(colIndex),
    };
    cell.alignment = {
      horizontal: colIndex === 2 ? "left" : "left",
      vertical: "middle",
    };
  });

  typeAndStoreRow3.eachCell((cell, colIndex) => {
    cell.font = {
      name: "CustomFont" || "CustomFont",
      size: 10,
      bold: [1, 3].includes(colIndex),
    };
    cell.alignment = { horizontal: "left", vertical: "middle" };
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
    "Rate",
    "Qnty",
    "Amount",
  ];
  const headerRow = worksheet.addRow(headers);
  headerRow.eachCell((cell) => Object.assign(cell, headerStyle));

  // Data rows with numeric conversion
  tableData.forEach((item) => {
    const row = worksheet.addRow([
      item.code,
      item.Description,
      toNumber(item.Rate),
      toNumber(item.Qnty),
      toNumber(item.Amount),
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
      // Apply number format (no decimals) for columns 3,4,5
      if (colIndex === 3 || colIndex === 4 || colIndex === 5) {
        cell.numFmt = "#,##0";
      }
    });
  });

  // Total row – convert totals to numbers
  const totalQntyNum = toNumber(totalQnty);
  const totalAmountNum = toNumber(totalAmount);

  const totalRow = worksheet.addRow([
    tableData.length, // record count as number
    "",
    "",
    totalQntyNum,
    totalAmountNum,
  ]);

  totalRow.eachCell((cell, colNumber) => {
    cell.font = { bold: true };
    cell.border = {
      top: { style: "double" },
      left: { style: "thin" },
      bottom: { style: "double" },
      right: { style: "thin" },
    };

    if (colNumber === 4 || colNumber === 5) {
      cell.alignment = { horizontal: "right" };
      cell.numFmt = "#,##0";
    }
    if (colNumber === 1) {
      cell.alignment = { horizontal: "center" };
      cell.numFmt = "#,##0";
    }
  });

  // Set column widths
  [20, 45, 12, 10, 14].forEach((width, index) => {
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
    cell.font = {
      name: "CustomFont" || "CustomFont",
      size: 10,
    };
    cell.alignment = { horizontal: "left" };
  });

  const dateTimeRow1 = worksheet.addRow([`USER ID:  ${userid}`]);
  // FIXED: was incorrectly using dateTimeRow.eachCell – now using dateTimeRow1
  dateTimeRow1.eachCell((cell) => {
    cell.font = {
      name: "CustomFont" || "CustomFont",
      size: 10,
    };
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
  saveAs(blob, `SupplierPurchaseReport  From ${fromInputDate} To ${toInputDate}.xlsx`);
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

  const firstColWidth = {
    width: "135px",
  };
  const secondColWidth = {
    width: "400px",
  };
  const fifthColWidth = {
    width: "90px",
  };
  const thirdColWidth = {
    width: "80px",
  };
  const forthColWidth = {
    width: "100px",
  };

   const sixColWidth = {
    width: "8px",
  };

   useHotkeys(
      "alt+s",
      () => {
        fetchSupplierPurchaseComparison();
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

  const [menuCompanyIsOpen, setMenuCompanyIsOpen] = useState(false);
  const [menuCategoryIsOpen, setMenuCategoryIsOpen] = useState(false);
  const [menuAccountIsOpen, setMenuAccountIsOpen] = useState(false);
  const [menuStoreIsOpen, setMenuStoreIsOpen] = useState(false);

    const [columns, setColumns] = useState({
      code: [],
        Description: [],
        Rate: [],
        Qnty: [],
        Amount: [],
    });
    const [columnSortOrders, setColumnSortOrders] = useState({
      code: "",
        Description: "",
        Rate: "",
        Qnty: "",
        Amount: "",
    });
    // When you receive your initial table data, transform it into column-oriented format
    useEffect(() => {
      if (tableData.length > 0) {
        const newColumns = {
          code: tableData.map((row) => row.code),
          Description: tableData.map((row) => row.Description),
          Rate: tableData.map((row) => row.Rate),
          Qnty: tableData.map((row) => row.Qnty),
          Amount: tableData.map((row) => row.Amount),
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
        if (col === "code" || col === "code") {
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
        code: null,
        Description: null,
        Rate: null,
        Qnty: null,
        Amount: null,
       
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
 

  const handleFromDateEnter = (e) => {
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
    if (enteredDate < GlobalfromDate || enteredDate > GlobaltoDate) {
      toast.error(
        `Date must be between ${GlobalfromDate1} and ${GlobaltoDate1}`
      );
      return;
    }

    // Update input value and state
    e.target.value = formattedDate;
    setfromInputDate(formattedDate); // Update the state with formatted date

    // Move focus to the next element
    focusNextElement(fromRef, toRef);
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
      if (enteredDate < GlobalfromDate || enteredDate > GlobaltoDate) {
        toast.error(
          `Date must be between ${GlobalfromDate1} and ${GlobaltoDate1}`
        );
        return;
      }

      // Update input value and state
      e.target.value = formattedDate;
      settoInputDate(formattedDate); // Update the state with formatted date

      // Move focus to the next element
      focusNextElement(toRef, categoryRef);
    }
  };

  const handleAccountEnter = (e) => {
        if (e.key === "Enter" && !menuAccountIsOpen) {
      e.preventDefault();
      focusNextElement(saleSelectRef, fromRef);
    }
  };

  const handleCompanyEnter = (e) => {
    if (e.key === "Enter" && !menuCompanyIsOpen) {
      e.preventDefault();
      focusNextElement(companyRef, input1Ref);
    }
  };

  const handleCategoryEnter = (e) => {
    if (e.key === "Enter" && !menuCategoryIsOpen) {
      e.preventDefault();
      focusNextElement(categoryRef, companyRef);
    }
  };

  const handleTypeEnter = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      focusNextElement(typeRef, searchRef);
    }
  };

  const handleSearchEnter = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      focusNextElement(searchRef, selectButtonRef);
    }
  };

 const focusNextElement = (currentRef, nextRef) => {
    if (currentRef.current && nextRef.current) {
      currentRef.current.focus();
      nextRef.current.focus();
      if(currentRef === fromRef){
        nextRef.current.focus();
         nextRef.current.select();
      }
       if(nextRef === toRef){
        nextRef.current.focus();
        nextRef.current.select();
      }
     
    }
  };

  const handleSelectButtonClick = () => {
    if (!accountType) {
      toast.error("Account code is required");
      setIsAccountValid(false);
      return;
    }
    fetchSupplierPurchaseComparison();
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
          <NavComponent textdata="Supplier Purchase Report" />

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

               {/* Account Select */}
              <div
                className="d-flex align-items-center  "
                // style={{ marginRight: "20px" }}
              >
                <div
                  style={{
                    width: "100px",
                    display: "flex",
                    justifyContent: "end",
                  }}
                >
                  <label htmlFor="fromDatePicker">
                    <span style={{ 
                         fontSize: getdatafontsize,
                        fontFamily: getfontstyle,
                        fontWeight: "bold",
 }}>
                      Account :&nbsp;
                    </span>{" "}
                    <br />
                  </label>
                </div>
                <div>
                 <Select
                    className="List-select-class"
                    ref={saleSelectRef}
                    options={Accountoption}
                    value={
                      Accountoption.find((opt) => opt.value === accountType) || null
                    } // Ensure correct reference
                    // isDisabled={isDoubleClickOpen}
                    onKeyDown={(e) => handleAccountEnter(e)}
                    id="selectedsale"
                       onChange={(selectedOption) => {
  if (selectedOption && selectedOption.value) {
    setAccountType(selectedOption.value);

    const labelWithoutCode = selectedOption.label.replace(/^[\d-]+-/, "");

    setAccountTypeDataValue({
      value: selectedOption.value,
      label: labelWithoutCode,
    });
  } else {
    setAccountType("");
    setAccountTypeDataValue("");
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
                      ...customStyles1(!accountType, 380),
                      placeholder: (base) => ({
                        ...base,
                        textAlign: "left",
                        marginLeft: "0",
                        justifyContent: "flex-start",
                        color: fontcolor,
                        marginTop: "-5px",
                      }),
                    }}
                    // isClearable
                    // placeholder="ALL"
                  />
                </div>
              </div>
              {/* From Date */}
              <div
                className="d-flex align-items-center"
              >
                <div
                  style={{
                    width: "80px",
                    display: "flex",
                    justifyContent: "end",
                  }}
                >
                  <label htmlFor="fromDatePicker">
                    <span style={{  
                        fontSize: getdatafontsize,
                        fontFamily: getfontstyle,
                        fontWeight: "bold",
 }}>
                      From :&nbsp;
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
                    onKeyDown={handleFromDateEnter}
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
                            fontSize: "12px",
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

              {/* To Date */}
              <div className="d-flex align-items-center" style={{marginRight:'21px'}} >
                <div
                  style={{
                    width: "60px",
                    display: "flex",
                    justifyContent: "end",
                  }}
                >
                  <label htmlFor="toDatePicker">
                    <span style={{ 
                         fontSize: getdatafontsize,
                        fontFamily: getfontstyle,
                        fontWeight: "bold",
}}>
                      To :&nbsp;
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
                      fontSize: "12px",
                      backgroundColor: getcolor,
                      color: fontcolor,
                      opacity: selectedRadio === "custom" ? 1 : 0.5,
                      pointerEvents:
                        selectedRadio === "custom" ? "auto" : "none",
                    }}
                    value={toInputDate}
                    onChange={handleToInputChange}
                    onKeyDown={handleToDateEnter}
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
                            fontSize: "12px",
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
          {/* --------2nd row */}
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
             

              {/* Category Select  */}
              <div
                className="d-flex align-items-center  "
                style={{ marginRight: "21px" }}
              >
                <div
                  style={{
                    width: "100px",
                    display: "flex",
                    justifyContent: "end",
                  }}
                >
                  <label htmlFor="fromDatePicker">
                    <span style={{ fontSize: getdatafontsize,
                        fontFamily: getfontstyle,
                        fontWeight: "bold",
 }}>
                      Category :&nbsp;
                    </span>
                    <br />
                  </label>
                </div>
                <div>
                  <Select
                    className="List-select-class"
                    ref={categoryRef}
                    options={Categoryoption}
                    // value={
                    //   Accountoption.find((opt) => opt.value === saleType) || null
                    // } 
                    // Ensure correct reference
                    // isDisabled={isDoubleClickOpen}
                    onKeyDown={(e) => handleCategoryEnter(e)}
                    id="selectedsale"
                     onChange={(selectedOption) => {
  if (selectedOption && selectedOption.value) {
    setCategoryType(selectedOption.value);

    const labelWithoutCode = selectedOption.label.replace(/^[\d-]+-/, "");

    setCategoryTypeDataValue({
      value: selectedOption.value,
      label: labelWithoutCode,
    });
  } else {
    setCategoryType("");
    setCategoryTypeDataValue("");
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
                      ...customStyles1(!categoryType, 250),
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

               {/* Type Select  */}
              <div
                className="d-flex align-items-center"
                style={{ marginRight: "21px" }}
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
                    onKeyDown={(e) => handleKeyPress(e, searchRef)}
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
                      width: "250px",
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
                    <option value="BIL">PURCHASE</option>
                    <option value="PRN">PURCHASE RETURN </option>
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

          {/* ------------3rd row */}
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
              {/* Company Select */}
              <div className="d-flex align-items-center">
                <div
                  style={{
                    width: "100px",
                    display: "flex",
                    justifyContent: "end",
                  }}
                >
                  <label htmlFor="fromDatePicker">
                    <span style={{  fontSize: getdatafontsize,
                        fontFamily: getfontstyle,
                        fontWeight: "bold",
 }}>
                      Company :&nbsp;
                    </span>{" "}
                    <br />
                  </label>
                </div>
                <div>
                   <Select
                    className="List-select-class"
                    ref={companyRef}
                    options={Companyoption}
                    // value={
                    //   Accountoption.find((opt) => opt.value === saleType) || null
                    // } 
                    // Ensure correct reference
                    // isDisabled={isDoubleClickOpen}
                    onKeyDown={(e) => handleCompanyEnter(e)}
                    id="selectedsale"
                                 onChange={(selectedOption) => {
  if (selectedOption && selectedOption.value) {
    setCompanyType(selectedOption.value);

    const labelWithoutCode = selectedOption.label.replace(/^[\d-]+-/, "");

    setCompanyTypeDataValue({
      value: selectedOption.value,
      label: labelWithoutCode,
    });
  } else {
    setCompanyType("");
    setCompanyTypeDataValue("");
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
                      ...customStyles1(!companyType, 250),
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

             

               {/* Search */}
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
                    ref={searchRef}
                    onKeyDown={(e) => handleSearchEnter(e)}
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
                  fontSize: "12px",
                //   width: "100%",
                  position: "relative",
                  paddingRight: "2%",
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
                  <tr
                    style={{
                      backgroundColor: getnavbarbackgroundcolor,
                      color: "white",
                    }}
                  >
                    <td
                      className="border-dark"
                      style={firstColWidth}
                      onClick={() => handleSorting("code")}
                    >
                      Code{" "}
                      <i
                        className="fa-solid fa-caret-down caretIconStyle"
                        style={getIconStyle("code")}
                      ></i>
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
                      style={fifthColWidth}
                      onClick={() => handleSorting("Rate")}
                    >
                      Rate{" "}
                      <i
                        className="fa-solid fa-caret-down caretIconStyle"
                        style={getIconStyle("Rate")}
                      ></i>
                    </td>
                     <td
                      className="border-dark"
                      style={thirdColWidth}
                      onClick={() => handleSorting("Qnty")}
                    >
                      Qnty{" "}
                      <i
                        className="fa-solid fa-caret-down caretIconStyle"
                        style={getIconStyle("Qnty")}
                      ></i>
                    </td>
                     <td
                      className="border-dark"
                      style={forthColWidth}
                      onClick={() => handleSorting("Amount")}
                    >
                      Amount{" "}
                      <i
                        className="fa-solid fa-caret-down caretIconStyle"
                        style={getIconStyle("Amount")}
                      ></i>
                    </td>
                     <td className="border-dark" style={sixColWidth}>
                      
                    </td>
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
                // width: "100%",
                wordBreak: "break-word",
              }}
            >
              <table
                id="tableBody"
                style={{
                  fontSize: "12px",
                //   width: "100%",
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
                        <td colSpan="5" className="text-center">
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
                          <td style={fifthColWidth}></td>
                        <td style={thirdColWidth}></td>
                        <td style={forthColWidth}></td>
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
                              color: item.Qnty?.[0] === "-" ? "red" : fontcolor,
                            }}
                          >
                            <td className="text-start" style={firstColWidth}>
                              {item.code}
                            </td>
                       
                            <td className="text-start" style={secondColWidth}>
                              {item.Description}
                            </td>
                            <td className="text-end" style={fifthColWidth}>
                              {item.Rate}
                            </td>
                            <td className="text-end" style={thirdColWidth}>
                              {item.Qnty}
                            </td>
                            <td className="text-end" style={forthColWidth}>
                              {item["Amount"]}
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
                        <td style={fifthColWidth}></td>
                        <td style={thirdColWidth}></td>
                        <td style={forthColWidth}></td>
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
                ...fifthColWidth,
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
              <span className="mobileledger_total">{totalQnty}</span>
            </div>
            <div
              style={{
                ...forthColWidth,
                background: getcolor,
                borderRight: `1px solid ${fontcolor}`,
              }}
            >
                            <span className="mobileledger_total">{totalAmount}</span>

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
              onClick={handleSelectButtonClick}
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