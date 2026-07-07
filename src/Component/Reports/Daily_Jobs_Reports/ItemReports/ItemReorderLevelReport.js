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

export default function ItemReorderLevelReport() {
  const navigate = useNavigate();
  const user = getUserData();
  const organisation = getOrganisationData();

  const saleSelectRef = useRef(null);

  const toRef = useRef(null);
  const fromRef = useRef(null);
  const companyRef = useRef(null);
  const categoryRef = useRef(null);
  const capacityRef = useRef(null);
  const storeRef = useRef(null);
  const typeRef = useRef(null);
  const searchRef = useRef(null);
  const selectButtonRef = useRef(null);

  const [saleType, setSaleType] = useState("");

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
  const [GetCompany, setGetCompany] = useState([]);
  const [Categoryselectdata, setCategoryselectdata] = useState("");
  const [categoryselectdatavalue, setcategoryselectdatavalue] = useState("");

  const [GetCategory, setGetCategory] = useState([]);

  const [Typeselectdata, setTypeselectdata] = useState("");
  const [typeselectdatavalue, settypeselectdatavalue] = useState("");

  const [GetType, setGetType] = useState([]);

  const [sortData, setSortData] = useState("ASC");

  const [searchQuery, setSearchQuery] = useState("");
  const [mobileNumber, setmobileNumber] = useState("30");
  const [transectionType, settransectionType] = useState("A");

  console.log("transectionType", transectionType);
  const [transectionType2, settransectionType2] = useState("L");

  const [totalqnty, settotalqnty] = useState(0);
  const [totalexcel, settotalexcel] = useState(0);
  const [totaltax, settotaltax] = useState(0);
  const [totalincl, settotalincl] = useState(0);

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

  function fetchDailyStatusReport() {
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

    const apiMainUrl = apiLinks + "/ItemReOrderLevelReport.php";
    setIsLoading(true);
    const formMainData = new URLSearchParams({
      FRepDat: toInputDate,
      FCtgCod: Categoryselectdata,
      FCmpCod: Companyselectdata,
      code: organisation.code,
      FLocCod: locationnumber || getLocationNumber,
      FYerDsc: yeardescription || getyeardescription,
      FRepTyp: transectionType2,
      FRepDay: mobileNumber,

      // code: "SATZTRD",
      // FLocCod: "001",
      // FYerDsc: "2025-2025",
    }).toString();

    axios
      .post(apiMainUrl, formMainData)
      .then((response) => {
        setIsLoading(false);
        // settotalqnty(response.data["Total Qnty"]);
        // settotalexcel(response.data["Total Rate"]);
        // settotaltax(response.data["Total Amount"]);
        // settotalincl(response.data["Total Incl"]);

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
    const apiUrl = apiLinks + "/GetActiveStore.php";
    const formData = new URLSearchParams({
      code: organisation.code,
    }).toString();
    axios
      .post(apiUrl, formData)
      .then((response) => {
        if (response.data && Array.isArray(response.data)) {
          setGetType(response.data);
        } else {
          console.warn(
            "Response data structure is not as expected:",
            response.data
          );
          setGetType([]);
        }
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  }, []);

  const typeoptions = GetType.map((item) => ({
    value: item.tstrcod,
    label: `${item.tstrcod}-${item.tstrdsc.trim()}`,
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



const exportPDFHandler = () => {
  const globalfontsize = 12;
  console.log("gobal font data", globalfontsize);

  // ---------- Helper: create a new doc for measurement (dry run) ----------
  const createMeasureDoc = () => {
    const dummyDoc = new jsPDF({ orientation: "landscape" });
    dummyDoc.setFont("verdana-regular", "normal");
    dummyDoc.setFontSize(10);
    return dummyDoc;
  };

  // ---------- Dry run: returns total number of pages ----------
  const computeTotalPages = () => {
    const measureDoc = createMeasureDoc();
    const measureRows = [...rows]; // same row data
    const measureColumnWidths = columnWidths;
    const measurePageHeight = measureDoc.internal.pageSize.height;
    const measureFooterReserve = 30;

    const measureAddTableRows = (startY, startIndex) => {
      const lineHeight = 4;
      let currentY = startY;
      let currentRowIndex = startIndex;

      while (currentRowIndex < measureRows.length) {
        const row = [...measureRows[currentRowIndex]];
        const splitRow = row.map((cell, idx) => {
          const text = String(cell).trim();
          const maxWidth = measureColumnWidths[idx] - 4;
          const textWidth =
            (measureDoc.getStringUnitWidth(text) * measureDoc.internal.getFontSize()) /
            measureDoc.internal.scaleFactor;
          if (textWidth <= maxWidth) return [text];
          return measureDoc.splitTextToSize(text, maxWidth);
        });
        const maxLines = Math.max(...splitRow.map((c) => c.length));
        const rowHeight = maxLines * lineHeight + 2;

        if (currentY + rowHeight > measurePageHeight - measureFooterReserve) {
          return currentRowIndex; // row does not fit -> start new page
        }
        currentY += rowHeight;
        currentRowIndex++;
      }
      return measureRows.length;
    };

    let pageCount = 0;
    let nextRowIndex = 0;
    const paddingTop = 15;
    const headersStartY = 35;
    const rowsStartY = headersStartY + 6;

    while (nextRowIndex < measureRows.length) {
      pageCount++;
      nextRowIndex = measureAddTableRows(rowsStartY, nextRowIndex);
      if (nextRowIndex < measureRows.length) {
        // prepare for next page (reset Y)
        measureDoc.addPage();
      }
    }
    return pageCount;
  };

  // ---------- Actual rendering with correct totalPages ----------
  const doc = new jsPDF({ orientation: "landscape" });

  // Define table data (rows)
  const rows = tableData.map((item) => [
   
    item.Code,
    item.Description,
     item.PurDate,
    item.Level,
    item.PurQnty,
    item.Sale,
    item.Stock,
    item.Diff,
  ]);

  // Add summary row (total row) - now as the last row
  rows.push([
    tableData.length.toLocaleString(),
    "",
    "",
    "",
    "",
    "",
    "",
    "",
  ]);

  // Define table column headers and individual column widths
  const headers = [
   
    "Code",
    "Description",
     "L-pur Date",
    "Level",
    "Pur",
    "Sale",
    "Stock",
    "Diff",
  ];
  const columnWidths = [ 40, 110, 28,20, 22, 22, 22, 22];

  // Helper: get current date and time
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
    return `${hh}:${mm}:${ss}`;
  };
  const exportDate = getCurrentDate();
  const exportTime = getCurrentTime();

  // Get accurate total pages (dry run)
  const totalPages = computeTotalPages();

  // Calculate total table width
  const getTotalTableWidth = () => {
    let total = 0;
    columnWidths.forEach((w) => (total += w));
    return total;
  };
  const totalWidth = getTotalTableWidth();

  // Page dimensions
  const pageHeight = doc.internal.pageSize.height;
  const paddingTop = 15;
  const footerReserve = 30;

  doc.setFont("verdana-regular", "normal");
  doc.setFontSize(10);

  // Add table headers
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

  // Add rows until page fills; returns next row index to process
  const addTableRows = (startX, startY, startIndex) => {
    const lineHeight = 4;
    const tableWidth = getTotalTableWidth();
    let currentY = startY;
    let currentRowIndex = startIndex;

    while (currentRowIndex < rows.length) {
      const row = [...rows[currentRowIndex]];
      const isTotalRow = currentRowIndex === rows.length - 1;
      const isOddRow = currentRowIndex % 2 !== 0;
      const isRedRow = row[0] && parseInt(row[0]) > 10000000000;
      const textColor = isRedRow ? [255, 0, 0] : [0, 0, 0];

      // Split text for wrapping
      const splitRow = row.map((cell, idx) => {
        const text = String(cell).trim();
        const maxWidth = columnWidths[idx] - 4;
        const textWidth =
          (doc.getStringUnitWidth(text) * doc.internal.getFontSize()) /
          doc.internal.scaleFactor;
        if (textWidth <= maxWidth) return [text];
        return doc.splitTextToSize(text, maxWidth);
      });

      const maxLines = Math.max(...splitRow.map((c) => c.length));
      const rowHeight = maxLines * lineHeight + 2;

      // Check if row fits
      if (currentY + rowHeight > pageHeight - footerReserve) {
        // Draw footer and return current row index for next page
        const lineX = (doc.internal.pageSize.width - tableWidth) / 2;
        const lineY = pageHeight - 15;
        doc.setLineWidth(0.3);
        doc.line(lineX, lineY, lineX + tableWidth, lineY);
        doc.setFont("verdana-regular", "normal");
        doc.setFontSize(10);
        doc.text(`Crystal Solution    ${exportDate}    ${exportTime}`, lineX + 2, lineY + 5);
        return currentRowIndex;
      }

      // Draw row background
      if (isOddRow) {
        doc.setFillColor(240);
        doc.rect(startX, currentY, tableWidth, rowHeight, "F");
      }
      doc.setDrawColor(0);

      // Borders
      if (isTotalRow) {
        doc.setFont("verdana", "bold");
        doc.setLineWidth(0.3);
        doc.line(startX, currentY, startX + tableWidth, currentY);
        doc.line(startX, currentY + 0.5, startX + tableWidth, currentY + 0.5);
        doc.line(startX, currentY + rowHeight, startX + tableWidth, currentY + rowHeight);
        doc.line(startX, currentY + rowHeight - 0.5, startX + tableWidth, currentY + rowHeight - 0.5);
        doc.setLineWidth(0.2);
        doc.line(startX, currentY, startX, currentY + rowHeight);
        doc.line(startX + tableWidth, currentY, startX + tableWidth, currentY + rowHeight);
      } else {
        doc.setLineWidth(0.2);
        doc.rect(startX, currentY, tableWidth, rowHeight);
        doc.setFont("verdana-regular", "normal");
      }

      let currentX = startX;
      splitRow.forEach((textArray, cellIndex) => {
        const cellWidth = columnWidths[cellIndex];
        doc.setTextColor(...textColor);
        doc.setFontSize(10);
        const textY =
          currentY +
          (rowHeight - textArray.length * lineHeight) / 2 +
          lineHeight -
          1;

        if (cellIndex > 2) {
          doc.text(textArray, currentX + cellWidth - 2, textY, { align: "right" });
        } else if (cellIndex === 2) {
          doc.text(textArray, currentX + cellWidth / 2, textY, { align: "center" });
        } else {
          doc.text(textArray, currentX + 2, textY);
        }

        if (cellIndex < splitRow.length - 1) {
          doc.line(currentX + cellWidth, currentY, currentX + cellWidth, currentY + rowHeight);
        }
        currentX += cellWidth;
      });

      currentY += rowHeight;
      currentRowIndex++;

      if (isTotalRow) {
        doc.setFont("verdana-regular", "normal");
      }
    }

    // All rows processed – final footer
    const lineX = (doc.internal.pageSize.width - tableWidth) / 2;
    const lineY = pageHeight - 15;
    doc.setLineWidth(0.3);
    doc.line(lineX, lineY, lineX + tableWidth, lineY);
    doc.setFont("verdana-regular", "normal");
    doc.setFontSize(10);
    doc.text(`Crystal Solution    ${exportDate}    ${exportTime}`, lineX + 2, lineY + 5);

    return rows.length;
  };

  // Main pagination
  const handlePagination = () => {
    const addTitle = (title, startY, titleFontSize = 18) => {
      doc.setFontSize(titleFontSize);
      doc.text(title, doc.internal.pageSize.width / 2, startY, { align: "center" });
    };

    let currentStartY = paddingTop;
    let nextRowIndex = 0;
    let pageNumber = 1;

    while (nextRowIndex < rows.length) {
      // Title section
      addTitle(comapnyname, currentStartY, 18);
      currentStartY += 5;
      doc.setFont("verdana-regular", "normal");
      addTitle(`Item Reorder Level Report As on ${toInputDate}`, currentStartY, 12);
      currentStartY += 5;

      // Labels (Company, Type, Category, Search)
      const labelsX = (doc.internal.pageSize.width - totalWidth) / 2;
      const labelsY = currentStartY + 4;

      const typeItem = Companyselectdatavalue.label ? Companyselectdatavalue.label : "ALL";
      const status =
        transectionType2 === "P"
          ? "PURCHASE"
          : transectionType2 === "S"
          ? "SALE"
          : transectionType2 === "L"
          ? "LEVEL"
          : "";
      const category = categoryselectdatavalue.label ? categoryselectdatavalue.label : "ALL";
      const search = searchQuery ? searchQuery : "";

      doc.setFont("verdana", "bold");
      doc.setFontSize(10);
      doc.text(`Company :`, labelsX, labelsY);
      doc.setFont("verdana-regular", "normal");
      doc.text(`${typeItem}`, labelsX + 25, labelsY);

      doc.setFont("verdana", "bold");
      doc.text(`Type :`, labelsX + 180, labelsY);
      doc.setFont("verdana-regular", "normal");
      doc.text(`${status}`, labelsX + 195, labelsY);

      doc.setFont("verdana", "bold");
      doc.text(`Category :`, labelsX, labelsY + 4.3);
      doc.setFont("verdana-regular", "normal");
      doc.text(`${category}`, labelsX + 25, labelsY + 4.3);

      if (searchQuery) {
        doc.setFont("verdana", "bold");
        doc.text(`Search :`, labelsX + 180, labelsY + 4.3);
        doc.setFont("verdana-regular", "normal");
        doc.text(`${search}`, labelsX + 205, labelsY + 4.3);
      }

      currentStartY += 16;

      // Headers
      const headersStartX = (doc.internal.pageSize.width - totalWidth) / 2;
      const headersStartY = 35;
      addTableHeaders(headersStartX, headersStartY);

      // Rows
      const rowsStartY = headersStartY + 6;
      const newNextRowIndex = addTableRows(headersStartX, rowsStartY, nextRowIndex);

      // Page numbering with ACCURATE total pages
      const rightX = doc.internal.pageSize.width - 10;
      doc.setFont("verdana-regular", "normal");
      doc.setFontSize(10);
      doc.text(
        `Page ${pageNumber} / ${totalPages}`,
        rightX - 20,
        doc.internal.pageSize.height - 10,
        { align: "right" }
      );

      if (newNextRowIndex < rows.length) {
        doc.addPage();
        currentStartY = paddingTop;
        pageNumber++;
        nextRowIndex = newNextRowIndex;
      } else {
        break;
      }
    }
  };

  // Run the export
  handlePagination();
  doc.save(`ItemReorderLevel Report As On ${exportDate}.pdf`);
};

  const handleDownloadCSV = async () => {
  const workbook = new ExcelJS.Workbook();
  const worksheet = workbook.addWorksheet("Sheet1");

  const numColumns = 8; // Ensure this matches the actual number of columns

  const columnAlignments = [
    "left",
    "left",
    "center",
    "right",
    "right",
    "right",
    "right",
    "right",
  ];

  // Helper: convert any value (including strings with commas) to number
  const toNumber = (value) => {
    if (typeof value === "number") return value;
    if (typeof value === "string") {
      const cleaned = value.replace(/,/g, ""); // remove all commas
      const num = parseFloat(cleaned);
      return isNaN(num) ? 0 : num;
    }
    return 0;
  };

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
    `A${companyRow.number}:${String.fromCharCode(65 + numColumns - 1)}${companyRow.number}`
  );

  // Add Store List row
  const storeListRow = worksheet.addRow([
    `Item Reorder Level Report As On ${toInputDate}`,
  ]);
  storeListRow.eachCell((cell) => {
    cell.font = fontStoreList;
    cell.alignment = { horizontal: "center" };
  });

  worksheet.mergeCells(
    `A${storeListRow.number}:${String.fromCharCode(65 + numColumns - 1)}${storeListRow.number}`
  );

  // Add an empty row after the title section
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
  let typetype = typeselectdatavalue.label
    ? typeselectdatavalue.label
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
    transectionType2 === "P"
      ? "PURCHASE"
      : transectionType2 == "S"
      ? "SALE"
      : transectionType2 == "L"
      ? "LEVEL"
      : "ALL";

  let typesearch = searchQuery ? searchQuery : "";

  // Add first row
  const typeAndStoreRow = worksheet.addRow([
    "COMPANY :",
    typecompany,
    "",
    "",
    "",
    "TYPE :",
    transectionsts,
  ]);

  // Add second row
  const typeAndStoreRow2 = worksheet.addRow(["CATEGORY :", typecategory]);

  // Apply styling for the status row
  typeAndStoreRow.eachCell((cell, colIndex) => {
    cell.font = {
      name: "CustomFont" || "CustomFont",
      size: 10,
      bold: [1, 6].includes(colIndex),
    };
    cell.alignment = { horizontal: "left", vertical: "middle" };
  });
  typeAndStoreRow2.eachCell((cell, colIndex) => {
    cell.font = {
      name: "CustomFont" || "CustomFont",
      size: 10,
      bold: [1, 6].includes(colIndex),
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
  
    "Code",
    "Description",
      "L-Pur Date",
    "Level",
    "Pur",
    "Sale",
    "Stock",
    "Diff",
  ];
  const headerRow = worksheet.addRow(headers);
  headerRow.eachCell((cell) => Object.assign(cell, headerStyle));

  // Add data rows with numeric conversion
  tableData.forEach((item) => {
    const levelNum = toNumber(item.Level);
    const purNum = toNumber(item.PurQnty);
    const saleNum = toNumber(item.Sale);
    const stockNum = toNumber(item.Stock);
    const diffNum = toNumber(item.Diff);

    const row = worksheet.addRow([
     
      item.Code,
      item.Description,
       item.PurDate,
      levelNum,
      purNum,
      saleNum,
      stockNum,
      diffNum,
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
      // Apply number formatting for numeric columns (4-8)
      if (colIndex >= 4 && colIndex <= 8) {
        cell.numFmt = "#,##0"; // thousand separator, no decimals
      }
    });
  });

  const totalRow = worksheet.addRow([
    String(formatValue(tableData.length.toLocaleString())),
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
  });

  // Set column widths
  [ 20, 45,10, 8, 12, 12, 12, 12].forEach((width, index) => {
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
    };
    cell.alignment = { horizontal: "left" };
  });

  const dateTimeRow1 = worksheet.addRow([`USER ID:  ${userid}`]);
  // FIX: previously used dateTimeRow.eachCell incorrectly - now using dateTimeRow1
  dateTimeRow1.eachCell((cell) => {
    cell.font = {
      name: "CustomFont" || "CustomFont",
      size: 10,
    };
    cell.alignment = { horizontal: "left" };
  });

  // Merge across all columns
  worksheet.mergeCells(
    `A${dateTimeRow.number}:${String.fromCharCode(65 + numColumns - 1)}${dateTimeRow.number}`
  );
  worksheet.mergeCells(
    `A${dateTimeRow1.number}:${String.fromCharCode(65 + numColumns - 1)}${dateTimeRow1.number}`
  );

  // Generate and save the Excel file
  const buffer = await workbook.xlsx.writeBuffer();
  const blob = new Blob([buffer], {
    type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  });
  saveAs(blob, `ItemReorderLevelReport As On ${currentdate}.xlsx`);
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
    width: "90px",
  };
  const secondColWidth = {
    width: "135px",
  };
  const thirdColWidth = {
    width: "360px",
  };
  const forthColWidth = {
    width: "80px",
  };
  const sixthColWidth = {
    width: "80px",
  };
  const seventhColWidth = {
    width: "80px",
  };
  const eightColWidth = {
    width: "80px",
  };
  const ninthColWidth = {
    width: "80px",
  };

  const sixthcol = {
    width: "8px",
  };

  const [columns, setColumns] = useState({
    PurDate: [],
    Code: [],
    Description: [],
    Level: [],
    PurQnty: [],
    Sale: [],
    Stock: [],
    Diff: [],
  });

  const [columnSortOrders, setColumnSortOrders] = useState({
    PurDate: "",
    Code: "",
    Description: "",
    Level: "",
    PurQnty: "",
    Sale: "",
    Stock: "",
    Diff: "",
  });

  // When you receive your initial table data, transform it into column-oriented format
  useEffect(() => {
    if (tableData.length > 0) {
      const newColumns = {
        PurDate: tableData.map((row) => row.PurDate),
        Code: tableData.map((row) => row.Code),
        Description: tableData.map((row) => row.Description),
        Level: tableData.map((row) => row.Level),
        PurQnty: tableData.map((row) => row.PurQnty),
        Sale: tableData.map((row) => row.Sale),
        Stock: tableData.map((row) => row.Stock),
        Diff: tableData.map((row) => row.Diff),
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
      PurDate: null,
      Code: null,
      Description: null,
      Level: null,
      PurQnty: null,
      Sale: null,
      Stock: null,
      Diff: null,
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

  const renderTableData = () => {
    return (
      <>
        {isLoading ? (
          <>
            <tr style={{ backgroundColor: getcolor }}>
              <td colSpan="8" className="text-center">
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
                {Array.from({ length: 8 }).map((_, colIndex) => (
                  <td key={`blank-${rowIndex}-${colIndex}`}>&nbsp;</td>
                ))}
              </tr>
            ))}
            <tr>
           
              <td style={secondColWidth}></td>
              <td style={thirdColWidth}></td>
                 <td style={firstColWidth}></td>
              <td style={forthColWidth}></td>
              <td style={sixthColWidth}></td>
              <td style={seventhColWidth}></td>
              <td style={eightColWidth}></td>
              <td style={ninthColWidth}></td>
            </tr>
          </>
        ) : (
          <>
            {tableData.map((item, i) => {
              totalEnteries += 1;
              const isNegative = item.Qnty < 0 || item.Amount < 0;
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
                 
                  <td className="text-start" style={secondColWidth}>
                    {item.Code}
                  </td>
                  <td className="text-start" style={thirdColWidth}>
                    {item.Description}
                  </td>
                   <td className="text-center" style={firstColWidth}>
                    {item.PurDate}
                  </td>
                  <td className="text-end" style={forthColWidth}>
                    {formatValue(item.Level)}
                  </td>
                  <td className="text-end" style={sixthColWidth}>
                    {formatValue(item.PurQnty)}
                  </td>
                  <td className="text-end" style={seventhColWidth}>
                    {formatValue(item.Sale)}
                  </td>
                  <td className="text-end" style={eightColWidth}>
                    {formatValue(item.Stock)}
                  </td>
                  <td className="text-end" style={ninthColWidth}>
                    {formatValue(item.Diff)}
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
                {Array.from({ length: 8 }).map((_, colIndex) => (
                  <td key={`blank-${rowIndex}-${colIndex}`}>&nbsp;</td>
                ))}
              </tr>
            ))}
            <tr>
            
              <td style={secondColWidth}></td>
              <td style={thirdColWidth}></td>
                <td style={firstColWidth}></td>
              <td style={forthColWidth}></td>
              <td style={sixthColWidth}></td>
              <td style={seventhColWidth}></td>
              <td style={eightColWidth}></td>
              <td style={ninthColWidth}></td>
            </tr>
          </>
        )}
      </>
    );
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

  const [menuStoreIsOpen, setMenuStoreIsOpen] = useState(false);

  const focusNextElement = (currentRef, nextRef) => {
    if (currentRef.current && nextRef.current) {
      currentRef.current.focus();
      nextRef.current.focus();
      //   nextRef.current.select();
    }
  };

  const focusNextElement1 = (currentRef, nextRef) => {
    if (currentRef.current && nextRef.current) {
      currentRef.current.focus();
      nextRef.current.focus();
      nextRef.current.select();
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
      focusNextElement1(toRef, input2Ref);
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

  const handleMobilePress = (e, nextInputRef) => {
    const element = document.getElementById("phone");
    const value = e.target.value.trim();

    if (e.key === "Enter") {
      e.preventDefault();

      // 1. Empty check
      if (value === "") {
        toast.error("Field cannot be empty");
        element.style.border = "2px solid red";
        return;
      }

      // Convert to number
      const numValue = Number(value);

      // 2. Allowed days check
      const allowed = [30, 60, 90];

      if (!allowed.includes(numValue)) {
        toast.error("Only 30, 60, or 90 days allowed");
        element.style.border = "2px solid red";
        return;
      }

      // Passed validation
      element.style.border = "1px solid black";

      // 3. Move focus
      if (nextInputRef.current) {
        nextInputRef.current.focus();
        // nextInputRef.current.select();
      }
    }
  };

  const handleMobilenumberInputChange = (e) => {
    let value = e.target.value;

    // Allow only numbers
    value = value.replace(/\D/g, "");

    // Limit to 11 digits
    if (value.length > 11) {
      value = value.slice(0, 11);
    }

    setmobileNumber(value);
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
          <NavComponent textdata="Item Reorder level Report" />

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
              {/* To Date */}
              <div className="d-flex align-items-center">
                <div
                  style={{
                    width: "100px",
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
                      Rep Date :&nbsp;
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

              <div className="d-flex align-items-center ">
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
                      Days :
                    </span>{" "}
                    <br />
                  </label>
                </div>

                <input
                  ref={input2Ref}
                  value={mobileNumber}
                  defaultValue="30"
                  onKeyDown={(e) => handleMobilePress(e, input4Ref)}
                  onChange={(e) => setmobileNumber(e.target.value)}
                  autoComplete="off"
                  type="number"
                  id="phone"
                  name="phone"
                  style={{
                    color: fontcolor,
                    width: "100px",
                    height: "24px",
                    fontSize: getdatafontsize,
                    fontFamily: getfontstyle,
                    border: `1px solid ${fontcolor}`,
                    backgroundColor: getcolor,
                    outline: "none",
                    paddingLeft: "10px",
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
                    onKeyDown={(e) => handleKeyPress(e, saleSelectRef)}
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
                      width: "250px",
                      height: "24px",
                      marginLeft: "5px",
                      backgroundColor: getcolor,
                      border: `1px solid ${fontcolor}`,
                      fontSize: getdatafontsize,
                      fontFamily: getfontstyle,
                      color: fontcolor,
                      paddingLeft: "13px",
                    }}
                  >
                    <option value="L">LEVEL</option>
                    <option value="S">SALE</option>
                    <option value="P">PURCHASE</option>

                  </select>

                  {transectionType2 !== "L" && (
                    <span
                      onClick={() => settransectionType2("L")}
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
                      Category :
                    </span>
                  </label>
                </div>

                <div style={{ marginLeft: "3px" }}>
                  <Select
                    className="List-select-class "
                    ref={input1Ref}
                    options={categoryoptions}
                    onKeyDown={(e) => handlecategoryKeypress(e, selectButtonRef)}
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
                  width: "100%",
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
                      style={firstColWidth}
                      onClick={() => handleSorting("PurDate")}
                    >
                      L-Pur Date{" "}
                      <i
                        className="fa-solid fa-caret-down caretIconStyle"
                        style={getIconStyle("PurDate")}
                      ></i>
                    </td>

                    <td
                      className="border-dark"
                      style={forthColWidth}
                      onClick={() => handleSorting("Level")}
                    >
                      Level{" "}
                      <i
                        className="fa-solid fa-caret-down caretIconStyle"
                        style={getIconStyle("Level")}
                      ></i>
                    </td>

                    <td
                      className="border-dark"
                      style={sixthColWidth}
                      onClick={() => handleSorting("PurQnty")}
                    >
                      Pur{" "}
                      <i
                        className="fa-solid fa-caret-down caretIconStyle"
                        style={getIconStyle("PurQnty")}
                      ></i>
                    </td>

                    <td
                      className="border-dark"
                      style={seventhColWidth}
                      onClick={() => handleSorting("Sale")}
                    >
                      Sale{" "}
                      <i
                        className="fa-solid fa-caret-down caretIconStyle"
                        style={getIconStyle("Sale")}
                      ></i>
                    </td>

                    <td
                      className="border-dark"
                      style={eightColWidth}
                      onClick={() => handleSorting("Stock")}
                    >
                      Stock{" "}
                      <i
                        className="fa-solid fa-caret-down caretIconStyle"
                        style={getIconStyle("Stock")}
                      ></i>
                    </td>


                    <td
                      className="border-dark"
                      style={ninthColWidth}
                      onClick={() => handleSorting("Diff")}
                    >
                      Diff{" "}
                      <i
                        className="fa-solid fa-caret-down caretIconStyle"
                        style={getIconStyle("Diff")}
                      ></i>
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
                maxHeight: "48vh",
                // width: "100%",
                position: "relative",
                ...(tableData.length > 0 ? { tableLayout: "fixed" } : {}),
              }}
            >
              <table
                className="myTable"
                id="tableBody"
                style={{
                  fontSize: getdatafontsize,
                  fontFamily: getfontstyle,
                  width: "100%",
                  // position: "relative",
                }}
              >
                <tbody id="tablebody">{renderTableData()}</tbody>
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
                ...secondColWidth,
                background: getcolor,
                borderRight: `1px solid ${fontcolor}`,
              }}
            >
               <span className="mobileledger_total2">
                {formatValue(tableData.length.toLocaleString())}
              </span>
            </div>
            <div
              style={{
                ...thirdColWidth,
                background: getcolor,
                borderRight: `1px solid ${fontcolor}`,
              }}
            >
              {/* <span className="mobileledger_total">{totalexcel}</span> */}
            </div>
             <div
              style={{
                ...firstColWidth,
                background: getcolor,
                marginLeft: "2px",
                borderRight: `1px solid ${fontcolor}`,
              }}
            >
             
            </div>
            <div
              style={{
                ...forthColWidth,
                background: getcolor,
                borderRight: `1px solid ${fontcolor}`,
              }}
            >
              {/* <span className="mobileledger_total">{totalexcel}</span> */}
            </div>

            <div
              style={{
                ...sixthColWidth,
                background: getcolor,
                borderRight: `1px solid ${fontcolor}`,
              }}
            >
              {/* <span className="mobileledger_total">
                {formatValue(totalqnty)}
              </span> */}
            </div>
            <div
              style={{
                ...seventhColWidth,
                background: getcolor,
                borderRight: `1px solid ${fontcolor}`,
              }}
            >
              {/* <span className="mobileledger_total">
                {formatValue(totaltax)}
              </span> */}
            </div>
            <div
              style={{
                ...eightColWidth,
                background: getcolor,
                borderRight: `1px solid ${fontcolor}`,
              }}
            >
              {/* <span className="mobileledger_total">
                {formatValue(totaltax)}
              </span> */}
            </div>
            <div
              style={{
                ...ninthColWidth,
                background: getcolor,
                borderRight: `1px solid ${fontcolor}`,
              }}
            >
              {/* <span className="mobileledger_total">
                {formatValue(totaltax)}
              </span> */}
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