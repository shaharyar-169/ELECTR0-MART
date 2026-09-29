import React, { useState, useEffect, useRef } from "react";
import { Container, Spinner, Nav } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";

import axios from "axios";
import { useTheme } from "../../../../ThemeContext";

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
import { useSelector, useDispatch } from "react-redux";
import { useHotkeys } from "react-hotkeys-hook";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";


import {
  getUserData,
  getOrganisationData,
  getYearDescription,
  getLocationnumber,
} from "../../../Auth";




export default function ItemSaleComparison() {
  const navigate = useNavigate();
  const user = getUserData();
  const organisation = getOrganisationData();

  const input1Ref = useRef(null);

  const toRef = useRef(null);
  const fromRef = useRef(null);
  const saleSelectRef =useRef(null);
  const input4Ref=useRef(null)
 const input6Ref=useRef(null)
  const companyRef = useRef(null);
  const typeRef = useRef(null);
  const searchRef = useRef(null);
  const selectButtonRef = useRef(null);

  const [GetCompany, setGetCompany] = useState([])
 const [Companyselectdata, setCompanyselectdata] = useState("");
  const [Companyselectdatavalue, setCompanyselectdatavalue] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [transectionType, settransectionType] = useState("");
  const [companyType, setCompanyType] = useState("");

  const [companyTypeDataValue, setCompanyTypeDataValue] = useState("");

  const [CompanyList, setCompanyList] = useState([]);

  const [totalQnty, setTotalQnty] = useState(0);
  const [totalAmount, setTotalAmount] = useState(0);
  const [totalMargin, setTotalMargin] = useState(0);

  // state for from DatePicker
  const [selectedfromDate, setSelectedfromDate] = useState(null);
  const [fromInputDate, setfromInputDate] = useState("");
  const [fromCalendarOpen, setfromCalendarOpen] = useState(false);
  // state for To DatePicker
  const [selectedToDate, setSelectedToDate] = useState(null);
  const [toInputDate, settoInputDate] = useState("");
  const [toCalendarOpen, settoCalendarOpen] = useState(false);

  const [selectedRadio, setSelectedRadio] = useState("custom"); // State to track selected radio button

  const {
    isSidebarVisible,
    toggleSidebar,
    getcolor,
    fontcolor,
    toggleChangeColor,
    apiLinks,getnavbarbackgroundcolor,
    getLocationNumber,
    getyeardescription,
    getfromdate,
    gettodate,
    getfontstyle,
    getdatafontsize,
  } = useTheme();

  const yeardescription = getYearDescription();
  const locationnumber = getLocationnumber();

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

  function fetchItemSaleComparison() {
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

    const apiMainUrl = apiLinks + "/ItemSaleComparison.php";
    setIsLoading(true);
    const formMainData = new URLSearchParams({
          FIntDat: fromInputDate,
      FFnlDat: toInputDate,
      FCmpCod: Companyselectdata,
        code: organisation.code,
      FLocCod: locationnumber || getLocationNumber,
      FYerDsc: yeardescription || getyeardescription,

    
    }).toString();

    axios
      .post(apiMainUrl, formMainData)
      .then((response) => {
        setIsLoading(false);
        // console.log("Response:", response.data);

        setTotalQnty(response.data["Total Qnty"]);
        setTotalAmount(response.data["Total Amount"]);
        setTotalMargin(response.data["Total MArgin"]);

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
        width: 200,
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
          borderColor: "red",               // ✅ changed to red
          boxShadow: "0 0 0 1px red",      // ✅ changed to red
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

   const handleKeyPress = (e, nextInputRef) => {
    if (e.key === "Enter") {
      e.preventDefault();
      if (nextInputRef.current) {
        nextInputRef.current.focus();
      }
    }
  };
 

const exportPDFHandler = () => {
  // Create a new jsPDF instance with portrait orientation
  const doc = new jsPDF({ orientation: "portrait" });

  // Define table data (rows) — Margin column removed
  const rows = tableData.map((item) => [
    item.tctgcod,
    item.Category,
    item.Qnty,
    item.Amount,
  ]);

  // Add total row
  rows.push([
    "",
    "Total",
    String(totalQnty),
    String(totalAmount),
  ]);

  // Define table column headers and individual column widths — Margin removed
  const headers = ["Code", "Category", "Qnty", "Amount"];
  const columnWidths = [22, 110, 18, 25];

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

    doc.setFont("verdana-regular", "normal");
    doc.setFontSize(10);
  };

  const addTableRows = (startX, startY, startIndex, endIndex) => {
    const rowHeight = 5;
    const tableWidth = getTotalTableWidth();

    for (let i = startIndex; i < endIndex; i++) {
      const row = rows[i];
      const isTotalRow = i === rows.length - 1;
      const isNegativeQnty = row[2] && String(row[2]).startsWith("-");

      let textColor = [0, 0, 0];

      // Red color for negative quantity (except total row)
      if (isNegativeQnty && !isTotalRow) {
        textColor = [255, 0, 0];
      }

      // ✅ BOLD font for total row, normal for others
      if (isTotalRow) {
        doc.setFont("verdana-regular", "bold");
        doc.setFontSize(10);
      } else {
        doc.setFont("verdana-regular", "normal");
        doc.setFontSize(10);
      }

      doc.setDrawColor(0);

      // ✅ TOTAL ROW: double border on top & bottom (like ToDateOutstanding)
      if (isTotalRow) {
        const rowTopY = startY + (i - startIndex + 2) * rowHeight;
        const rowBottomY = rowTopY + rowHeight;

        // Top double border
        doc.setLineWidth(0.3);
        doc.line(startX, rowTopY, startX + tableWidth, rowTopY);
        doc.line(startX, rowTopY + 0.5, startX + tableWidth, rowTopY + 0.5);

        // Bottom double border
        doc.line(startX, rowBottomY, startX + tableWidth, rowBottomY);
        doc.line(
          startX,
          rowBottomY - 0.5,
          startX + tableWidth,
          rowBottomY - 0.5
        );

        // Left & right vertical borders
        doc.setLineWidth(0.2);
        doc.line(startX, rowTopY, startX, rowBottomY);
        doc.line(
          startX + tableWidth,
          rowTopY,
          startX + tableWidth,
          rowBottomY
        );
      } else {
        // Normal row: single border
        doc.setLineWidth(0.2);
        doc.rect(
          startX,
          startY + (i - startIndex + 2) * rowHeight,
          tableWidth,
          rowHeight
        );
      }

      row.forEach((cell, cellIndex) => {
        const cellY =
          startY + (i - startIndex + 2) * rowHeight + rowHeight / 2;
        const cellX = startX + 2;

        // ✅ VERDANA font — bold for total row, normal otherwise
        if (isTotalRow) {
          doc.setFont("verdana-regular", "bold");
          doc.setFontSize(10);
        } else {
          doc.setFont("verdana-regular", "normal");
          doc.setFontSize(10);
        }

        doc.setTextColor(...textColor);

        const cellValue = String(cell ?? "");

        if (cellIndex === 2 || cellIndex === 3) {
          // Right align numeric columns (Qnty, Amount)
          const rightX = startX + columnWidths[cellIndex] - 2;
          doc.text(cellValue, rightX, cellY, {
            align: "right",
            baseline: "middle",
          });
        } else {
          doc.text(cellValue, cellX, cellY, {
            baseline: "middle",
          });
        }

        // Column borders
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
    }

    // ✅ Footer: Crystal Solution + Date + Time on the SAME line (left side)
    const lineX = (doc.internal.pageSize.width - tableWidth) / 2;
    const lineY = pageHeight - 15;

    doc.setLineWidth(0.3);
    doc.line(lineX, lineY, lineX + tableWidth, lineY);

    doc.setFont("verdana-regular", "normal");
    doc.setFontSize(10);
    doc.setTextColor(0);

    // ✅ All together on left side
    doc.text(
      `Crystal Solution    ${date}    ${time}`,
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
    return paddingTop;
  };

  // Define the number of rows per page
  const rowsPerPage = 47;

  // ✅ Calculate total pages BEFORE rendering (for "Page X/Y")
  const getTotalPages = () => {
    return Math.ceil(rows.length / rowsPerPage);
  };

  // Function to handle pagination
  const handlePagination = () => {
    const totalPages = getTotalPages();

    const addTitle = (
      title,
      date,
      time,
      pageNumber,
      startY,
      titleFontSize = 18,
      pageNumberFontSize = 10
    ) => {
      doc.setFontSize(titleFontSize);
      doc.text(title, doc.internal.pageSize.width / 2, startY, {
        align: "center",
      });

      const rightX = doc.internal.pageSize.width - 10;

      doc.setFont("verdana-regular", "normal");
      doc.setFontSize(10);
      // ✅ Page X/Y format
      doc.text(
        `Page ${pageNumber}/${totalPages}`,
        rightX - 40,
        doc.internal.pageSize.height - 10,
        { align: "right" }
      );
    };

    let currentPageIndex = 0;
    let startY = paddingTop;
    let pageNumber = 1;

    while (currentPageIndex * rowsPerPage < rows.length) {
      doc.setFont("Times New Roman", "normal");
      addTitle(comapnyname, 12, 12, pageNumber, startY, 18);
      startY += 5;

      doc.setFont("verdana-regular", "normal");
      addTitle(
        `Item Sale Comparison Report From: ${fromInputDate} To: ${toInputDate}`,
        "",
        "",
        pageNumber,
        startY,
        12
      );
      startY += -5;

      const labelsX = (doc.internal.pageSize.width - totalWidth) / 2;
      const labelsY = startY + 4;

      doc.setFontSize(12);
      doc.setFont(getfontstyle, "300");

      const search = searchQuery ? searchQuery : "";
      let companyTerm = Companyselectdatavalue.label
        ? Companyselectdatavalue.label
        : "ALL";

      // Company label
      doc.setFont("verdana", "bold");
      doc.setFontSize(10);
      doc.text(`Company :`, labelsX, labelsY + 8.5);

      doc.setFont("verdana-regular", "normal");
      doc.setFontSize(10);
      doc.text(`${companyTerm}`, labelsX + 25, labelsY + 8.5);

      // Search label
      if (searchQuery) {
        doc.setFont("verdana", "bold");
        doc.setFontSize(10);
        doc.text(`Search :`, labelsX + 70, labelsY + 8.5);

        doc.setFont("verdana-regular", "normal");
        doc.setFontSize(10);
        doc.text(`${search}`, labelsX + 90, labelsY + 8.5);
      }

      startY += 10;

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

  handlePagination();

  doc.save(
    `ItemSaleComparisonReport From ${fromInputDate} To ${toInputDate}.pdf`
  );
};

  const handleDownloadCSV = async () => {
  const workbook = new ExcelJS.Workbook();
  const worksheet = workbook.addWorksheet("Sheet1");

  const numColumns = 4; // ✅ Margin removed → 4 columns
  const columnAlignments = ["center", "left", "center", "right"]; // Code, Category, Qnty, Amount

  // Define fonts (same as Company List)
  const fontCompanyName = { name: "CustomFont", size: 18, bold: true };
  const fontStoreList = { name: "CustomFont", size: 10, bold: false };
  const fontHeader = { name: "CustomFont", size: 10, bold: true };
  const fontTableContent = { name: "CustomFont", size: 10, bold: false };

  // Empty row
  worksheet.addRow([]);

  // Company name
  const companyRow = worksheet.addRow([comapnyname]);
  companyRow.eachCell((cell) => {
    cell.font = fontCompanyName;
    cell.alignment = { horizontal: "center" };
  });
  worksheet.getRow(companyRow.number).height = 30;
  worksheet.mergeCells(
    `A${companyRow.number}:${String.fromCharCode(65 + numColumns - 1)}${companyRow.number}`
  );

  // Report title
  const storeListRow = worksheet.addRow([
    `Item Sale Comparison Report From: ${fromInputDate} To: ${toInputDate}`,
  ]);
  storeListRow.eachCell((cell) => {
    cell.font = fontStoreList;
    cell.alignment = { horizontal: "center" };
  });
  worksheet.mergeCells(
    `A${storeListRow.number}:${String.fromCharCode(65 + numColumns - 1)}${storeListRow.number}`
  );

  // Empty row
  worksheet.addRow([]);

  // Filter data
          let companyTerm = Companyselectdatavalue.label ? Companyselectdatavalue.label : "ALL";

  const search = searchQuery || "";

  const filterRow = worksheet.addRow(
    searchQuery
      ? ["Company :", companyTerm, "Search :", search]
      : ["Company :", companyTerm, "", ""]
  );

  filterRow.eachCell((cell, colIndex) => {
    cell.font = {
      name: "CustomFont",
      size: 10,
      bold: [1, 3].includes(colIndex),
    };
    cell.alignment = { horizontal: "left", vertical: "middle" };
  });

  // Header style
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

  // Headers — Margin removed
  const headers = ["Code", "Category", "Qnty", "Amount"];
  const headerRow = worksheet.addRow(headers);
  headerRow.eachCell((cell) => Object.assign(cell, headerStyle));

  // ✅ Data rows with alternating light grey background
  tableData.forEach((item, index) => {
    const row = worksheet.addRow([
      item.tctgcod,
      item.Category,
      item.Qnty,
      item.Amount,
    ]);

    // Check if Qnty is negative
    const isNegativeQnty =
      item.Qnty && String(item.Qnty).startsWith("-");

    row.eachCell((cell, colIndex) => {
      cell.font = isNegativeQnty
        ? { ...fontTableContent, color: { argb: "FFFF0000" } }
        : fontTableContent;

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

      // ✅ Apply very light grey background to odd rows
      if ((index + 1) % 2 !== 0) {
        cell.fill = {
          type: "pattern",
          pattern: "solid",
          fgColor: { argb: "FFEFEFEF" },
        };
      }
    });
  });

  // Column widths — Margin removed
  [10, 45, 10, 13].forEach((width, index) => {
    worksheet.getColumn(index + 1).width = width;
  });

  // Total row
  const totalRow = worksheet.addRow([
    "",
    "Total",
    String(totalQnty),
    String(totalAmount),
  ]);

  totalRow.eachCell((cell, colNumber) => {
    cell.font = { bold: true };
    cell.border = {
      top: { style: "double" },
      left: { style: "thin" },
      bottom: { style: "double" },
      right: { style: "thin" },
    };

    // Right-align numeric columns
    if (colNumber === 3 || colNumber === 4) {
      cell.alignment = { horizontal: "right" };
    } else if (colNumber === 2) {
      cell.alignment = { horizontal: "left" };
    } else {
      cell.alignment = { horizontal: "center" };
    }
  });

  // Blank row
  worksheet.addRow([]);

  // Date and Time
  const today = new Date();
  const currentTime = today.toLocaleTimeString("en-GB");
  const currentDate = today
    .toLocaleDateString("en-GB")
    .replace(/\//g, "-");
  const userid = user.tusrid;

  const dateTimeRow = worksheet.addRow([
    `DATE:   ${currentDate}  TIME:   ${currentTime}`,
  ]);
  dateTimeRow.eachCell((cell) => {
    cell.font = { name: "CustomFont", size: 10 };
    cell.alignment = { horizontal: "left" };
  });

  const dateTimeRow1 = worksheet.addRow([`USER ID:  ${userid}`]);
  dateTimeRow1.eachCell((cell) => {
    cell.font = { name: "CustomFont", size: 10 };
    cell.alignment = { horizontal: "left" };
  });

  // Merge cells
  worksheet.mergeCells(
    `A${dateTimeRow.number}:${String.fromCharCode(65 + numColumns - 1)}${dateTimeRow.number}`
  );
  worksheet.mergeCells(
    `A${dateTimeRow1.number}:${String.fromCharCode(65 + numColumns - 1)}${dateTimeRow1.number}`
  );

  // Save Excel
  const buffer = await workbook.xlsx.writeBuffer();
  const blob = new Blob([buffer], {
    type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  });
  saveAs(
    blob,
    `ItemSaleComparisonReport From ${fromInputDate} To ${toInputDate}.xlsx`
  );
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

  const firstColWidth = {
    width: "55px",
  };
  const secondColWidth = {
    width: "360px",
  };
  const thirdColWidth = {
    width: "90px",
  };
  const forthColWidth = {
    width: "90px",
  };
  const sixColWidth = {
    width: "8px",
  };

  


  useHotkeys(
    "alt+s",
    () => {
      fetchItemSaleComparison();
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
    maxWidth: "610px",
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

  // Radio Functionality
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

  const focusNextElement = (currentRef, nextRef) => {
    if (currentRef.current && nextRef.current) {
      currentRef.current.focus();
      if(nextRef === toRef){
  nextRef.current.focus();
    nextRef.current.select();
      }
      nextRef.current.focus();
    }
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
      focusNextElement(toRef, saleSelectRef);
    }
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
          <NavComponent textdata="Item Sale Comparison Report" />

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
                justifyContent: "start",
              }}
            >
              {/* From Date */}
              <div
                className="d-flex align-items-center"
                // style={{ marginLeft: "20px" }}
              >
                <div
                  style={{
                    width: "100px",
                    display: "flex",
                    justifyContent: "end",
                  }}
                >
                  <label htmlFor="fromDatePicker">
                    <span
                      style={{
                        fontSize: parseInt(getdatafontsize),
                        fontWeight: "bold",
                      }}
                    >
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
                      fontSize: parseInt(getdatafontsize),
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

              {/* To Date */}
              <div className="d-flex align-items-center" style={{marginLeft:'50px'}}>
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
                      fontSize: parseInt(getdatafontsize),
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
                justifyContent: "start",
              }}
            >
              {/* Company Select */}
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
                                   Company :
                                 </span>
                               </label>
                             </div>
             
                             <div style={{ marginLeft: "3px" }}>
                               <Select
                                 className="List-select-class "
                                 ref={saleSelectRef}
                                 options={options}
                                 onKeyDown={(e) => handlecompanyKeypress(e, selectButtonRef)}
                                 id="selectedsale"
                                 onChange={(selectedOption) => {
                                   if (selectedOption && selectedOption.value) {
                                     const labelPart = selectedOption.label.split("-")[1];
                                     setCompanyselectdata(selectedOption.value);
                                     setCompanyselectdatavalue({
                                       value: selectedOption.value,
                                       label: labelPart, // Set only the 'NGS' part of the label
                                     });
                                   } else {
                                     setCompanyselectdata(""); // Clear the saleType state when selectedOption is null (i.e., when the selection is cleared)
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

             
            </div>
          </div>

          <div>
            {/* Table Head */}
            <div
              style={{
                overflowY: "auto",
                // width: "98.6%",
              }}
            >
              <table
                className="myTable"
                id="table"
                style={{
                  fontSize: parseInt(getdatafontsize),
                //   width: "100%",
                  position: "relative",
                  // paddingRight: "2%",
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
                    <td className="border-dark" style={firstColWidth}>
                      Code
                    </td>
                    <td className="border-dark" style={secondColWidth}>
                      Category{" "}
                    </td>
                    <td className="border-dark" style={thirdColWidth}>
                      Qnty
                    </td>
                    <td className="border-dark" style={forthColWidth}>
                      Amount
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
                maxHeight: "55vh",
                // width: "100%",
                wordBreak: "break-word",
              }}
            >
              <table
                className="myTable"
                id="tableBody"
                style={{
                  fontSize: parseInt(getdatafontsize),
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
                        <td colSpan="4" className="text-center">
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
                            {Array.from({ length: 4 }).map((_, colIndex) => (
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
                              {item.tctgcod}
                            </td>
                            <td className="text-start" style={secondColWidth}>
                              {item.Category}
                            </td>
                            <td className="text-end" style={thirdColWidth}>
                              {item.Qnty}
                            </td>
                            <td className="text-end" style={forthColWidth}>
                              {item.Amount}
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
                          {Array.from({ length: 4 }).map((_, colIndex) => (
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
            ></div>
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
              onClick={fetchItemSaleComparison}
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
