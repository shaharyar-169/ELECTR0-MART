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

export default function ItemEvaluationReport() {
  const navigate = useNavigate();
  const user = getUserData();
  const organisation = getOrganisationData();

  // Add this at the top of your component
  const hasInitialized = useRef(false);

  const saleSelectRef = useRef(null);
  const input1Ref = useRef(null);
  const input2Ref = useRef(null);
  const input3Ref = useRef(null);

  const toRef = useRef(null);
  const fromRef = useRef(null);

  const [saleType, setSaleType] = useState("");
  console.log("saleTypedataset", saleType);
  const [Companyselectdatavalue, setCompanyselectdatavalue] = useState("");
  // console.log("companyselectdatavalue", Companyselectdatavalue);

  const [searchQuery, setSearchQuery] = useState("");
  const [transectionType, settransectionType] = useState("A");
  console.log("saleTypedataset", transectionType);

  const [supplierList, setSupplierList] = useState([]);
  // console.log("supplierList", supplierList);

  const [totalpurchase, settotalpurchase] = useState(0);
  const [totalpurchaseReturn, settotalpurchaseReturn] = useState(0);
  const [totalReceive, settotalReceive] = useState(0);
  const [totalissue, settotalissue] = useState(0);
  const [totalsale, settotalsale] = useState(0);
  const [totalsaleReturn, settotalsaleReturn] = useState(0);
  const [totalclosingbalance, settotalclosingbalance] = useState(0);

  const [totalQnty, settotalQnty] = useState(0);
  const [totalDebit, setTotalDebit] = useState(0);
  const [totalCredit, setTotalCredit] = useState(0);
  const [closingBalance, setClosingBalance] = useState(0);

  // state for from DatePicker
  const [selectedfromDate, setSelectedfromDate] = useState(null);
  const [fromInputDate, setfromInputDate] = useState();
  const [fromCalendarOpen, setfromCalendarOpen] = useState(false);
  // state for To DatePicker
  const [selectedToDate, setSelectedToDate] = useState(null);
  const [toInputDate, settoInputDate] = useState("");
  const [toCalendarOpen, settoCalendarOpen] = useState(false);

  const storedData = JSON.parse(sessionStorage.getItem("itemLedgerData")) || {};

  // Helper function to parse "dd-mm-yyyy" format to a valid Date object
  const parseDate1 = (dateStr) => {
    if (!dateStr) return null;
    const [day, month, year] = dateStr.split("-").map(Number);
    return new Date(year, month - 1, day); // Convert dd-mm-yyyy to Date object
  };

  // Initialize states from sessionStorage or set default values

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
    getnavbarbackgroundcolor
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

  const handleSaleKeypress = (event, inputId) => {
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
  const handleKeyPress = (e, nextInputRef) => {
    if (e.key === "Enter") {
      e.preventDefault();
      if (nextInputRef.current) {
        nextInputRef.current.focus();
      }
    }
  };

  function fetchReceivableReport() {
    let hasError = false;
    let errorType = "";

    switch (true) {
      case !saleType:
        errorType = "saleType";
        break;

      default:
        hasError = false;
        break;
    }

    switch (errorType) {
      case "saleType":
        toast.error("Please select a Item");
        return;
      default:
        break;
    }
    const apiUrl = apiLinks + "/ItemEvaluation.php";
    setIsLoading(true);
    const formData = new URLSearchParams({
      FRepTyp: transectionType,
      FItmCod: saleType,
      code: organisation.code,
      FLocCod: locationnumber || getLocationNumber,
      FYerDsc: yeardescription || getyeardescription,
    }).toString();

    axios
      .post(apiUrl, formData)
      .then((response) => {
        setIsLoading(false);
        // Update total amount and quantity
        settotalpurchase(response.data["Total Purchase "]);
        settotalpurchaseReturn(response.data["Total Pur Return "]);
        // settotalReceive(response.data["Total Receive "]);
        // settotalissue(response.data["Total Issue "]);
        settotalsale(response.data["Total Sale "]);
        settotalsaleReturn(response.data["Total Sale Return"]);
        settotalclosingbalance(response.data["Closing Balance"]);

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
    const apiUrl = apiLinks + "/GetItem.php";
    const formData = new URLSearchParams({
      FLocCod: getLocationNumber,
      code: organisation.code,
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

  const options = supplierList.map((item) => ({
    value: item.titmcod,
    label: `${item.titmcod}-${item.titmdsc.trim()}`,
  }));

  // useEffect(() => {
  //   if (isOptionsLoaded && options.length > 0 && !saleType && !hasInitialized.current) {
  //     const firstOption = options[0];
  //     setSaleType(firstOption.value);

  //     const fullLabel = firstOption.label;
  //     const description = fullLabel.split('-').pop()?.trim();

  //     setCompanyselectdatavalue({
  //       value: firstOption.value,
  //       label: description,
  //       fullLabel: fullLabel
  //     });

  //     // Mark as initialized
  //     hasInitialized.current = true;
  //   }
  // }, [isOptionsLoaded, options, saleType]);

useEffect(() => {
  if (isOptionsLoaded && options.length > 0 && !saleType && !hasInitialized.current) {
    const firstOption = options[0];
    setSaleType(firstOption.value);

    setCompanyselectdatavalue({
      value: firstOption.value,
      label: firstOption.label,
    });

    hasInitialized.current = true;
  }
}, [isOptionsLoaded, options, saleType]);


  useEffect(() => {
    const storedData = sessionStorage.getItem("itemLedgerData");
    const summryclickdata = storedData ? JSON.parse(storedData) : null;

    if (options.length > 0 && summryclickdata?.code) {
      const searchOption = options.find(
        (option) => option.value === summryclickdata.code
      );

      if (searchOption) {
        setSaleType(searchOption.value);
      }
    }
  }, [supplierList, options]);

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

  const handleTransactionTypeChange = (event) => {
    const selectedTransactionType = event.target.value;
    settransectionType(selectedTransactionType);
  };

  ///////////////////////////// DOWNLOAD PDF CODE ////////////////////////////////////////////////////////////
const exportPDFHandler = () => {
  // ─── 1. PAGE SETUP & DATE/TIME ─────────────────────────────
  const doc = new jsPDF({ orientation: "landscape" });

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

  // ─── 2. TABLE DATA ──────────────────────────────────────────
  const rows = tableData.map((item) => [
    item.Date,
    item["Trn#"],
    item.Description,
    item.Rate,
    item.Purchase,
    item["Pur-Ret"],
    item.Sale,
    item["Sale-Ret"],
    item.Balance,
    item.amount,
    item.Average,
  ]);

  rows.push([
    "",
    "",
    "Total",
    "",
    String(totalpurchase),
    String(totalpurchaseReturn),
    String(totalsale),
    String(totalsaleReturn),
    String(totalclosingbalance),
    "",
    "",
  ]);

  // ─── 3. HEADERS & COLUMN WIDTHS ────────────────────────────
  const headers = [
    "Date",
    "Ref #",
    "Description",
    "Rate",
    "Pur Qnt",
    "P Ret",
    "Sale Qnt",
    "S Ret",
    "Balance",
    "Amount",
    "Average",
  ];
  const columnWidths = [24, 18, 80, 18, 20, 20, 20, 20, 20, 27, 20];

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

  // ─── 7. DRAW A SINGLE ROW (Date & Ref# also do NOT wrap) ──
  const drawRow = (startX, startY, rowIndex, rowData, isTotalRow) => {
    const lineHeight = 4;
    const tableWidth = getTotalTableWidth();
    const textColor = [0, 0, 0];

    // ── Prevent wrapping for: Date(0), Ref#(1), and all numeric columns (3..10) ──
    const noWrapIndices = [0, 1, 3, 4, 5, 6, 7, 8, 9, 10];

    const splitRow = rowData.map((cell, idx) => {
      const text = String(cell).trim();
      if (noWrapIndices.includes(idx)) {
        return [text]; // keep on one line
      }
      // Only Description (index 2) may wrap
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
      if (cellIndex === 0 || cellIndex === 1) {
        align = "center";
      } else if (cellIndex > 2) {
        align = "right";
      }
      if (isTotalRow && cellIndex === 2) {
        align = "center";
      }

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
    addTitle("Item Evaluation Report", startY, 12);
    startY -= 5;

    const labelsX = (doc.internal.pageSize.width - totalWidth) / 2;
    const labelsY = startY + 4;

    let status =
      transectionType === "A"
        ? "AVERAGE"
        : transectionType === "W"
        ? "WEIGHTED AVERAGE"
        : "";
    let search = Companyselectdatavalue.label ? Companyselectdatavalue.label : "ALL";

    doc.setFont("verdana", "bold");
    doc.setFontSize(10);
    doc.text(`ITEM :`, labelsX, labelsY + 8.5);
    doc.setFont("verdana-regular", "normal");
    doc.text(`${search}`, labelsX + 15, labelsY + 8.5);

    doc.setFont("verdana", "bold");
    doc.text(`TYPE :`, labelsX + 200, labelsY + 8.5);
    doc.setFont("verdana-regular", "normal");
    doc.text(`${status}`, labelsX + 215, labelsY + 8.5);

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

        const descText = String(row[2]);
        const maxWidth = columnWidths[2] - 4;
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
    const measureDoc = new jsPDF({ orientation: "landscape" });
    measureDoc.setFont("verdana-regular", "normal");
    measureDoc.setFontSize(10);

    const measureRows = [...rows];
    const measureColumnWidths = [...columnWidths];
    const measurePageHeight = measureDoc.internal.pageSize.height;
    const measureFooterReserve = 18;
    const lineHeight = 4;

    const measureDrawRow = (startY, rowIndex, rowData) => {
      const noWrapIndices = [0, 1, 3, 4, 5, 6, 7, 8, 9, 10];
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
  doc.save(`ItemEvaluationReport As On ${date}.pdf`);
};
  ///////////////////////////// DOWNLOAD PDF EXCEL //////////////////////////////////////////////////////////
 const handleDownloadCSV = async () => {
  const workbook = new ExcelJS.Workbook();
  const worksheet = workbook.addWorksheet("Sheet1");

  const numColumns = 11; // Ensure this matches the actual number of columns

  const columnAlignments = [
    "center",
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
  const storeListRow = worksheet.addRow([`Item Evalution Report`]);
  storeListRow.eachCell((cell) => {
    cell.font = fontStoreList;
    cell.alignment = { horizontal: "center" };
  });

  worksheet.mergeCells(
    `A${storeListRow.number}:${String.fromCharCode(65 + numColumns - 1)}${storeListRow.number}`
  );

  // Add an empty row after the title section
  worksheet.addRow([]);

  let typestatus = "";

  if (transectionType === "A") {
    typestatus = "AVERAGE";
  } else if (transectionType === "W") {
    typestatus = "WEIGHTED AVERAGE";
  } else {
    typestatus = "Average"; // Default value
  }

  let Accountselect = Companyselectdatavalue.label ? Companyselectdatavalue.label : "ALL";

  let typesearch = searchQuery || "";

  // Apply styling for the status row
  const typeAndStoreRow2 = worksheet.addRow(
    ["ITEM :", Accountselect, "", "", "", "", "", "", "TYPE :", typestatus]
  );

  // Merge cells for Accountselect (columns B to D)
  worksheet.mergeCells(`B${typeAndStoreRow2.number}:D${typeAndStoreRow2.number}`);

  // Apply styling for the status row
  typeAndStoreRow2.eachCell((cell, colIndex) => {
    cell.font = {
      name: "CustomFont" || "CustomFont",
      size: 10,
      bold: [1, 9].includes(colIndex),
    };
    cell.alignment = {
      horizontal: colIndex === 2 ? "left" : "left", // Left align the account name
      vertical: "middle"
    };
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
    "Ref #",
    "Description",
    "Rate",
    "Purchase",
    "Pur-Ret",
    "Sale",
    "Sale-Ret",
    "Balance",
    "Amount",
    "Avg Rate",
  ];
  const headerRow = worksheet.addRow(headers);
  headerRow.eachCell((cell) => Object.assign(cell, headerStyle));

  // Add data rows with numeric conversion
  tableData.forEach((item) => {
    const row = worksheet.addRow([
      item.Date,
      item["Trn#"],
      item.Description,
      toNumber(item.Rate),
      toNumber(item.Purchase),
      toNumber(item["Pur-Ret"]),
      toNumber(item.Sale),
      toNumber(item["Sale-Ret"]),
      toNumber(item.Balance),
      toNumber(item.amount),
      toNumber(item.Average),
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
      // Apply number format (no decimals) for columns 4 to 11 (Rate, Purchase, Pur-Ret, Sale, Sale-Ret, Balance, Amount, Average)
      if (colIndex >= 4 && colIndex <= 11) {
        cell.numFmt = "#,##0";
      }
    });
  });

  // Total row – all values as numbers
  const totalRow = worksheet.addRow([
    "",
    "",
    "Total",
    "",
    toNumber(totalpurchase),
    toNumber(totalpurchaseReturn),
    toNumber(totalsale),
    toNumber(totalsaleReturn),
    toNumber(totalclosingbalance),
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

    // Right-align numeric columns and apply number format
    if (colNumber >= 5 && colNumber <= 9) {
      cell.alignment = { horizontal: "right" };
      cell.numFmt = "#,##0";
    }
  });

  // Set column widths
  [12, 8, 40, 11, 11, 11, 11, 11, 11, 14, 11].forEach((width, index) => {
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
  const dateTimeRow = worksheet.addRow([`DATE:   ${currentdate}  TIME:   ${currentTime}`]);
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
  saveAs(blob, `ItemEvalution Report As On ${currentdate}.xlsx`);
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

  const isLargeScreen = window.innerWidth > 1500;

  const contentStyle = {
    width: "100%",
    maxWidth: isSidebarVisible
      ? (isLargeScreen ? "1250px" : "1000px")
      : (isLargeScreen ? "1250px" : "1200px"),
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
    padding: "0 20px",
    boxSizing: "border-box",
  };

  const firstColWidth = {
    width: "80px",
  };
  const secondColWidth = {
    width: "55px",
  };
  const thirdColWidth = {
    width: "3.7%",
  };
  const fifthColWidth = {
    width: "80px",
  };
  const sixthColWidth = {

    width: isSidebarVisible
      ? (isLargeScreen ? "360px" : "200px")
      : (isLargeScreen ? "360px" : "320px"),
  };
  const seventhColWidth = {
    width: isSidebarVisible
      ? (isLargeScreen ? "90px" : "80px")
      : (isLargeScreen ? "90px" : "90px"),
  };
  const eightColWidth = {
    width: isSidebarVisible
      ? (isLargeScreen ? "90px" : "80px")
      : (isLargeScreen ? "90px" : "90px"),
  };
  const ninthColWidth = {
    width: isSidebarVisible
      ? (isLargeScreen ? "90px" : "80px")
      : (isLargeScreen ? "90px" : "90px"),
  };
  const tenthColWidth = {
    width: isSidebarVisible
      ? (isLargeScreen ? "90px" : "80px")
      : (isLargeScreen ? "90px" : "90px"),
  };

  const elewenthColWidth = {
    width: isSidebarVisible
      ? (isLargeScreen ? "90px" : "80px")
      : (isLargeScreen ? "90px" : "90px"),
  };
  const tewlthColWidth = {
    width: isSidebarVisible
      ? (isLargeScreen ? "90px" : "80px")
      : (isLargeScreen ? "90px" : "90px"),
  };

  const thirteenColWidth = {
    width: isSidebarVisible
      ? (isLargeScreen ? "90px" : "80px")
      : (isLargeScreen ? "90px" : "90px"),
  };
  const sixCol = {
    width: "8px",
  };

  useHotkeys("alt+s", () => {
    fetchReceivableReport();
    //    resetSorting();
  }, { preventDefault: true, enableOnFormTags: true });

  useHotkeys("alt+p", exportPDFHandler, { preventDefault: true, enableOnFormTags: true });
  useHotkeys("alt+e", handleDownloadCSV, { preventDefault: true, enableOnFormTags: true });
  useHotkeys("esc", () => navigate("/MainPage"));

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
          <NavComponent textdata="Item  Report" />

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
                      Item :
                    </span>{" "}
                    <br />
                  </label>
                </div>
                <div style={{ marginLeft: "5px" }}>
                  <Select
                    className="List-select-class "
                    ref={saleSelectRef}
                    value={options.find(opt => opt.value === saleType) || null} // Ensure correct reference
                    options={options}
                    onKeyDown={(e) => handleSaleKeypress(e, "typeButton")}
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
                        marginTop: '-5px'
                      })
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

                <select
                  ref={input1Ref}
                  onKeyDown={(e) => handleKeyPress(e, input3Ref)}
                  id="typeButton"
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
                  }}
                >
                  <option value="A">AVERAGE</option>
                  <option value="W">WEIGHTED AVERAGE</option>
                </select>
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
                      Date
                    </td>
                    <td className="border-dark" style={secondColWidth}>
                      Ref #
                    </td>
                    {/* <td className="border-dark" style={thirdColWidth}>
                                            Typ
                                        </td> */}
                    {/* <td className="border-dark" style={forthColWidth}>
                                            Item Code
                                        </td> */}

                    <td className="border-dark" style={sixthColWidth}>
                      Description
                    </td>
                    <td className="border-dark" style={fifthColWidth}>
                      Rate
                    </td>
                    <td className="border-dark" style={seventhColWidth}>
                      Pur Qnt
                    </td>
                    <td className="border-dark" style={eightColWidth}>
                      P Ret
                    </td>
                    <td className="border-dark" style={ninthColWidth}>
                      Sale Qnt
                    </td>
                    <td className="border-dark" style={tenthColWidth}>
                      S Ret
                    </td>
                    <td className="border-dark" style={elewenthColWidth}>
                      Balance
                    </td>
                    <td className="border-dark" style={tewlthColWidth}>
                      Amount
                    </td>
                    <td className="border-dark" style={thirteenColWidth}>
                      Avg Rate
                    </td>
                    <td className="border-dark" style={sixCol}>

                    </td>
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
                maxHeight: "55vh",
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
                  ...(tableData.length > 0 ? { tableLayout: "fixed" } : {})
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
                        {/* <td style={thirdColWidth}></td> */}
                        {/* <td style={forthColWidth}></td> */}
                        <td style={sixthColWidth}></td>
                        <td style={fifthColWidth}></td>
                        <td style={seventhColWidth}></td>
                        <td style={eightColWidth}></td>
                        <td style={ninthColWidth}></td>
                        <td style={tenthColWidth}></td>
                        <td style={elewenthColWidth}></td>
                        <td style={tewlthColWidth}></td>
                        <td style={thirteenColWidth}></td>
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
                              {item["Trn#"]}
                            </td>
                            {/* <td className="text-center" style={thirdColWidth}>
                                                            {item.Type}
                                                        </td> */}
                            <td
                              className="text-start"
                              title={item.Description}
                              style={{
                                ...sixthColWidth,
                                whiteSpace: "nowrap",
                                overflow: "hidden",
                                textOverflow: "ellipsis",
                              }}
                            >
                              {item.Description}
                            </td>

                            <td className="text-end" style={fifthColWidth}>
                              {item.Rate}
                            </td>
                            <td className="text-end" style={seventhColWidth}>
                              {item.Purchase}
                            </td>
                            <td className="text-end" style={eightColWidth}>
                              {item["Pur-Ret"]}
                            </td>
                            <td className="text-end" style={ninthColWidth}>
                              {item.Sale}
                            </td>
                            <td className="text-end" style={tenthColWidth}>
                              {item["Sale-Ret"]}
                            </td>
                            <td className="text-end" style={elewenthColWidth}>
                              {item.Balance}
                            </td>
                            <td
                              className="text-end"
                              title={item.Amount}
                              style={{
                                ...tewlthColWidth,
                                whiteSpace: "nowrap",
                                overflow: "hidden",
                                textOverflow: "ellipsis",
                              }}
                            >
                              {item.Amount}
                            </td>
                            <td className="text-end" style={thirteenColWidth}>
                              {item.Average}
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
                        {/* <td style={thirdColWidth}></td> */}
                        {/* <td style={forthColWidth}></td> */}
                        <td style={sixthColWidth}></td>
                        <td style={fifthColWidth}></td>
                        <td style={seventhColWidth}></td>
                        <td style={eightColWidth}></td>
                        <td style={ninthColWidth}></td>
                        <td style={tenthColWidth}></td>
                        <td style={elewenthColWidth}></td>
                        <td style={tewlthColWidth}></td>
                        <td style={thirteenColWidth}></td>
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
              paddingRight: '8px'
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
            {/* <div style={{ ...thirdColWidth, background: getcolor, borderRight: `1px solid ${fontcolor}` }}></div> */}
            <div
              style={{
                ...sixthColWidth,
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
                ...seventhColWidth,
                background: getcolor,
                borderRight: `1px solid ${fontcolor}`,
              }}
            >
              <span className="mobileledger_total">{totalpurchase}</span>
            </div>

            <div
              style={{
                ...eightColWidth,
                background: getcolor,
                borderRight: `1px solid ${fontcolor}`,
              }}
            >
              <span className="mobileledger_total">{totalpurchaseReturn}</span>
            </div>
            <div
              style={{
                ...ninthColWidth,
                background: getcolor,
                borderRight: `1px solid ${fontcolor}`,
              }}
            >
              <span className="mobileledger_total">{totalsale}</span>
            </div>
            <div
              style={{
                ...tenthColWidth,
                background: getcolor,
                borderRight: `1px solid ${fontcolor}`,
              }}
            >
              <span className="mobileledger_total">{totalsaleReturn}</span>
            </div>

            <div
              style={{
                ...elewenthColWidth,
                background: getcolor,
                borderRight: `1px solid ${fontcolor}`,
              }}
            >
              <span className="mobileledger_total">{totalclosingbalance}</span>
            </div>
            <div
              style={{
                ...tewlthColWidth,
                background: getcolor,
                borderRight: `1px solid ${fontcolor}`,
              }}
            ></div>
            <div
              style={{
                ...thirteenColWidth,
                background: getcolor,
                borderRight: `1px solid ${fontcolor}`,
              }}
            ></div>
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
