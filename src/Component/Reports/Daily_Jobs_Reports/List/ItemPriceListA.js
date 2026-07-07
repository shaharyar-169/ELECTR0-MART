import React, { useState, useEffect, useRef } from "react";
import { Container, Spinner, Nav } from "react-bootstrap";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import { useTheme } from "../../../../ThemeContext";
import { getUserData, getOrganisationData, getLocationnumber, getYearDescription } from "../../../Auth";
import NavComponent from "../../../MainComponent/Navform/navbarform";
import SingleButton from "../../../MainComponent/Button/SingleButton/SingleButton";
import "react-datepicker/dist/react-datepicker.css";
import jsPDF from "jspdf";
import ExcelJS from "exceljs";
import Select from "react-select";
import { components } from "react-select";
import { saveAs } from "file-saver";
import "react-calendar/dist/Calendar.css";
import { useSelector, useDispatch } from "react-redux";
import { fetchGetUser } from "../../../Redux/action";
import { useHotkeys } from "react-hotkeys-hook";
import "react-toastify/dist/ReactToastify.css";
import './list.css';
import './demo.css';
import { getcompanyData } from "../../../File/Category_Maintenance/Category_Maintenance_Api";

export default function ItemPriceListA() {
  const navigate = useNavigate();
  const user = getUserData();
  const organisation = getOrganisationData();

  const saleSelectRef = useRef(null);
  const input1Ref = useRef(null);
  const input2Ref = useRef(null);
  const input3Ref = useRef(null);
  const input4Ref = useRef(null);
  const input5Ref = useRef(null);
  const input6Ref = useRef(null);

  const [Companyselectdata, setCompanyselectdata] = useState("");
  const [GetCompany, setGetCompany] = useState([]);

  const [Capacityselectdata, setCapacityselectdata] = useState("");
  const [GetCapacity, setGetCapacity] = useState([]);

  const [Categoryselectdata, setCategoryselectdata] = useState("");
  const [GetCategory, setGetCategory] = useState([]);

  const [Typeselectdata, setTypeselectdata] = useState("");
  const [GetType, setGetType] = useState([]);

  const [sortData, setSortData] = useState("ASC");

  const [searchQuery, setSearchQuery] = useState("");
  const [transectionType, settransectionType] = useState("");

  const [Companyselectdatavalue, setCompanyselectdatavalue] = useState("");
  const [capacityselectdatavalue, setcapacityselectdatavalue] = useState("");
  const [categoryselectdatavalue, setcategoryselectdatavalue] = useState("");
  const [typeselectdatavalue, settypeselectdatavalue] = useState("");

  const yeardescription = getYearDescription();
  const locationnumber = getLocationnumber();

  const [isAscendingcode, setisAscendingcode] = useState(true);
  const [isAscendingemploye, setisAscendingemploye] = useState(true);
  const [isAscendingsts, setisAscendingsts] = useState(true);
  const [isAscendingdesig, setisAscendingdesig] = useState(true);
  const [isAscendingcontect, setisAscendingcontect] = useState(true);
  const [isAscendingadv, setisAscendingadv] = useState(true);
  const [isAscendingdlv, setisAscendingdlv] = useState(true);
  const [isAscendingsaleret, setisAscendingsaleret] = useState(true);
  const [isAscendingmrp, setisAscendingmrp] = useState(true);
  const [isAscendingfix, setisAscendingfix] = useState(true);

  const {
    isSidebarVisible,
    toggleSidebar,
    getcolor,
    fontcolor,
    toggleChangeColor,
    apiLinks,
    getLocationNumber, getnavbarbackgroundcolor,
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

  // Toggle the ToDATE && FromDATE CalendarOpen state on each click

  function fetchReceivableReport() {
    const apiUrl = apiLinks + "/ItemPriceListA.php";
    setIsLoading(true);
    const formData = new URLSearchParams({
      code: organisation.code,
      FLocCod: locationnumber || getLocationNumber,
      FYerDsc: yeardescription || getYearDescription,
      FCtgCod: Companyselectdata,
      FCapCod: Capacityselectdata,
      FTypCod: Typeselectdata,
      FCmpCod: Companyselectdata,
      FSchTxt: searchQuery,
      
      // code: 'NASIRTRD',
      // FLocCod: '001',
    }).toString();

    axios
      .post(apiUrl, formData)
      .then((response) => {
        setIsLoading(false);

        if (response.data && Array.isArray(response.data)) {
          setTableData(response.data);
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
  const handletypeKeypress = (event, inputId) => {
    if (event.key === "Enter") {
      const selectedOption = saleSelectRef.current.state.selectValue;
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

  const handleKeyPress = (e, nextInputRef) => {
    if (e.key === "Enter") {
      e.preventDefault();
      if (nextInputRef.current) {
        nextInputRef.current.focus();
      }
    }
  };

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

  //////////////////// CODE FOR COMPANY SELECT///////////////////

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
    const apiUrl = apiLinks + "/GetType.php";
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
    value: item.ttypcod,
    label: `${item.ttypcod}-${item.ttypdsc.trim()}`,
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

  ///////////////////////////// DOWNLOAD PDF CODE ////////////////////////////////////////////////////////////



   const exportPDFHandler = () => {
    // Ensure font style is defined (fallback to 'Helvetica')
    const getfontstyle = window.getfontstyle || "Helvetica";
  
    // Create a new jsPDF instance with landscape orientation
    const doc = new jsPDF({ orientation: "landscape" });
  
    // Define table data (rows) without total row initially
    const dataRows = tableData.map((item) => [
      item.Code,
      item.Description,
      item.Stk,
      item.Comm,
      item["Act Rate"],
      item["Pur Rate"],
      item["SM Rate"],
      item["Sale Rate"],
      item.MRP,
      item["Fix Rate"],
    ]);
  
    // Add total row at the end
    const rows = [...dataRows];
    rows.push([
      dataRows.length.toLocaleString(), // total count
      "",
      "",
      "",
      "",
      "",
      "",
      "",
       "",
      "",
    ]);
  
    // Define table column headers and column widths
    const headers = [
      "Code",
      "Description",
      "Stk",
      "Comm",
      "A.Rate",
      "P. Rate",
      "SM Rate",
      "Sale Rate",
      "MRP",
      "Fix Rate",
    ];
    const columnWidths = [40, 100, 15,15,20, 20, 20, 20, 20, 20];
  
    // Helper: get current date and time for footer
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
  
    // Calculate total table width
    const getTotalTableWidth = () => {
      return columnWidths.reduce((acc, w) => acc + w, 0);
    };
    const totalWidth = getTotalTableWidth();
  
    // Page dimensions – MAXIMISED ROWS (only a tiny bottom margin)
    const pageHeight = doc.internal.pageSize.height;
    const paddingTop = 15;
    const footerReserve = 18;          // <-- REDUCED from 30 to 18 (minimal bottom space)
    const headersStartY = 39;          // unchanged (fits original layout)
  
    // Set default font
    doc.setFont("verdana-regular", "normal");
    doc.setFontSize(10);
  
    // ----- Helper: Draw footer line and "Crystal Solution" text -----
    const drawFooter = () => {
      const tableWidth = getTotalTableWidth();
      const lineX = (doc.internal.pageSize.width - tableWidth) / 2;
      const lineY = pageHeight - 12;   // moved slightly lower to fit in the 18-unit reserve
      doc.setLineWidth(0.3);
      doc.line(lineX, lineY, lineX + tableWidth, lineY);
      doc.setFont("verdana-regular", "normal");
      doc.setFontSize(10);
      doc.text(`Crystal Solution    ${exportDate}    ${exportTime}`, lineX + 2, lineY + 5);
    };
  
    // ----- Helper: Draw page number (vertically aligned with footer text) -----
    const drawPageNumber = (pageNum, totalPages) => {
      const rightX = doc.internal.pageSize.width - 10;
      doc.setFont("verdana-regular", "normal");
      doc.setFontSize(10);
      doc.text(`Page ${pageNum} / ${totalPages}`, rightX - 25, pageHeight - 7, { align: "right" });
    };
  
    // ----- Add table headers (unchanged) -----
    const addTableHeaders = (startX, startY) => {
      doc.setFont("verdana", "bold");
      doc.setFontSize(10);
      let currentX = startX;
      headers.forEach((header, idx) => {
        const cellWidth = columnWidths[idx];
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
      doc.setFont("verdana-regular", "normal");
      doc.setFontSize(10);
    };
  
    // ----- Add rows until page fills; returns next row index to process -----
    const addTableRows = (startX, startY, startIndex, pageNum, totalPages) => {
      const lineHeight = 4;
      const tableWidth = getTotalTableWidth();
      let currentY = startY;
      let currentRowIndex = startIndex;
  
      while (currentRowIndex < rows.length) {
        const row = [...rows[currentRowIndex]];
        const isTotalRow = currentRowIndex === rows.length - 1;
        const isOddRow = (currentRowIndex % 2 !== 0) && !isTotalRow;
        const isRedRow = row[0] && parseInt(row[0]) > 10000000000;
        const textColor = isRedRow ? [255, 0, 0] : [0, 0, 0];
  
        // Split text for wrapping (especially Description)
        const splitRow = row.map((cell, idx) => {
          const text = String(cell).trim();
          const maxWidth = columnWidths[idx] - 4;
          const textWidth = (doc.getStringUnitWidth(text) * doc.internal.getFontSize()) / doc.internal.scaleFactor;
          if (textWidth <= maxWidth) return [text];
          return doc.splitTextToSize(text, maxWidth);
        });
  
        const maxLines = Math.max(...splitRow.map((c) => c.length));
        const rowHeight = maxLines * lineHeight + 2;
  
        // Check if row fits on current page (using reduced footerReserve)
        if (currentY + rowHeight > pageHeight - footerReserve) {
          drawFooter();
          drawPageNumber(pageNum, totalPages);
          return currentRowIndex; // this row will be rendered on next page
        }
  
        // Draw row background (alternating)
        if (isOddRow) {
          doc.setFillColor(240);
          doc.rect(startX, currentY, tableWidth, rowHeight, "F");
        }
        doc.setDrawColor(0);
  
        // Draw borders (total row has double top/bottom)
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
  
        // Fill cell content
        let currentX = startX;
        splitRow.forEach((textArray, cellIndex) => {
          const cellWidth = columnWidths[cellIndex];
          doc.setTextColor(...textColor);
          doc.setFontSize(10);
          const textY = currentY + (rowHeight - textArray.length * lineHeight) / 2 + lineHeight - 1;
  
          const isNumericColumn = cellIndex >1;
          const isTotalFirstColumn = isTotalRow && cellIndex === 0;
          if (isTotalFirstColumn) {
            doc.text(textArray, currentX + cellWidth / 2, textY, { align: "center" });
          } else if (isNumericColumn) {
            doc.text(textArray, currentX + cellWidth - 2, textY, { align: "right" });
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
  
      // All rows processed – final footer and page number
      drawFooter();
      drawPageNumber(pageNum, totalPages);
      return rows.length;
    };
  
    // ----- Dry run: compute total pages without drawing (using same footerReserve) -----
    const computeTotalPages = () => {
      const measureDoc = new jsPDF({ orientation: "landscape" });
      measureDoc.setFont("verdana-regular", "normal");
      measureDoc.setFontSize(10);
      const measureRows = [...rows];
      const measureColumnWidths = [...columnWidths];
      const measurePageHeight = measureDoc.internal.pageSize.height;
      const measureFooterReserve = 18;   // same as footerReserve
      const lineHeight = 4;
  
      const measureAddTableRows = (startY, startIndex) => {
        let currentY = startY;
        let currentRowIndex = startIndex;
        while (currentRowIndex < measureRows.length) {
          const row = [...measureRows[currentRowIndex]];
          const splitRow = row.map((cell, idx) => {
            const text = String(cell).trim();
            const maxWidth = measureColumnWidths[idx] - 4;
            const textWidth = (measureDoc.getStringUnitWidth(text) * measureDoc.internal.getFontSize()) / measureDoc.internal.scaleFactor;
            if (textWidth <= maxWidth) return [text];
            return measureDoc.splitTextToSize(text, maxWidth);
          });
          const maxLines = Math.max(...splitRow.map((c) => c.length));
          const rowHeight = maxLines * lineHeight + 2;
          if (currentY + rowHeight > measurePageHeight - measureFooterReserve) {
            return currentRowIndex;
          }
          currentY += rowHeight;
          currentRowIndex++;
        }
        return measureRows.length;
      };
  
      let pageCount = 0;
      let nextRowIndex = 0;
      const rowsStartY = headersStartY + 6;
      while (nextRowIndex < measureRows.length) {
        pageCount++;
        nextRowIndex = measureAddTableRows(rowsStartY, nextRowIndex);
        if (nextRowIndex < measureRows.length) {
          measureDoc.addPage();
        }
      }
      return pageCount;
    };
  
    const totalPages = computeTotalPages();
  
    // ----- Main pagination rendering -----
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
        doc.setFont("Times New Roman", "normal");
        addTitle(comapnyname, currentStartY, 18);
        currentStartY += 5;
        doc.setFont("verdana-regular", "normal");
        addTitle("Price List A", currentStartY, 12);
        currentStartY += 5;
  
        // Labels (unchanged)
        const labelsX = (doc.internal.pageSize.width - totalWidth) / 2;
        const labelsY = currentStartY + 4;
  
        const typeItem = Companyselectdatavalue.label ? Companyselectdatavalue.label : "ALL";
        const category = categoryselectdatavalue.label ? categoryselectdatavalue.label : "ALL";
        const typename = typeselectdatavalue.label ? typeselectdatavalue.label : "ALL";
        const typeText = capacityselectdatavalue.label ? capacityselectdatavalue.label : "ALL";
        const search = searchQuery ? searchQuery : "";
  
        doc.setFont("verdana", "bold");
        doc.setFontSize(10);
        doc.text(`Company :`, labelsX, labelsY);
        doc.setFont("verdana-regular", "normal");
        doc.text(`${typeItem}`, labelsX + 25, labelsY);
  
        doc.setFont("verdana", "bold");
        doc.text(`Category :`, labelsX, labelsY + 4.3);
        doc.setFont("verdana-regular", "normal");
        doc.text(`${category}`, labelsX + 25, labelsY + 4.3);
  
        doc.setFont("verdana", "bold");
        doc.text(`Type :`, labelsX + 180, labelsY + 4.3);
        doc.setFont("verdana-regular", "normal");
        doc.text(`${typename}`, labelsX + 195, labelsY + 4.3);
  
        doc.setFont("verdana", "bold");
        doc.text(`Capacity :`, labelsX, labelsY + 8.5);
        doc.setFont("verdana-regular", "normal");
        doc.text(`${typeText}`, labelsX + 25, labelsY + 8.5);
  
        if (searchQuery) {
          doc.setFont("verdana", "bold");
          doc.text(`Search :`, labelsX + 180, labelsY + 8.5);
          doc.setFont("verdana-regular", "normal");
          doc.text(`${search}`, labelsX + 200, labelsY + 8.5);
        }
  
        currentStartY += 16;
  
        // Headers
        const headersStartX = (doc.internal.pageSize.width - totalWidth) / 2;
        addTableHeaders(headersStartX, headersStartY);
  
        // Rows
        const rowsStartY = headersStartY + 6;
        const newNextRowIndex = addTableRows(headersStartX, rowsStartY, nextRowIndex, pageNumber, totalPages);
  
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
  
    handlePagination();
    doc.save(`ItemPriceListA As On ${exportDate}.pdf`);
  };
  ///////////////////////////// DOWNLOAD PDF CODE ////////////////////////////////////////////////////////////

  ///////////////////////////// DOWNLOAD PDF EXCEL //////////////////////////////////////////////////////////
 const handleDownloadCSV = async () => {
   const workbook = new ExcelJS.Workbook();
   const worksheet = workbook.addWorksheet("Sheet1");
 
   const numColumns = 8; // 8 data columns: Code, Description, Stock, Comm, SM Rate, Sale Rate, MRP, Fix Rate
 
   const columnAlignments = [
     "left",   // Code
     "left",   // Description
     "right",  // Stock
     "right",  // Comm
     "right",  // SM Rate
     "right",  // Sale Rate
     "right",  // MRP
     "right",  // Fix Rate
      "right",  // MRP
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
 
   // Title row
   const storeListRow = worksheet.addRow(["Price List A"]);
   storeListRow.eachCell((cell) => {
     cell.font = fontStoreList;
     cell.alignment = { horizontal: "center" };
   });
   worksheet.mergeCells(
     `A${storeListRow.number}:${String.fromCharCode(65 + numColumns - 1)}${storeListRow.number}`
   );
 
   worksheet.addRow([]);
 
   // Filter values
   let typecompany = Companyselectdatavalue.label ? Companyselectdatavalue.label : "ALL";
   let typecapacity = capacityselectdatavalue.label ? capacityselectdatavalue.label : "ALL";
   let typecategory = categoryselectdatavalue.label ? categoryselectdatavalue.label : "ALL";
   let typetype = typeselectdatavalue.label ? typeselectdatavalue.label : "ALL ";
   let typesearch = searchQuery ? searchQuery : "";
 
   // Filter rows
   const typeAndStoreRow = worksheet.addRow(["Company :", typecompany]);
 
   const typeAndStoreRow2 = worksheet.addRow([
     "Category :",
     typecategory,
     "",
     "",
     "",
     "Type :",
     typetype,
   ]);
 
   const typeAndStoreRow3 = worksheet.addRow(
     searchQuery
       ? ["Capacity :", typecapacity, "", "", "", "Search :", typesearch]
       : ["Capacity :", typecapacity, ""]
   );
 
   // Apply styling for filter rows
   typeAndStoreRow.eachCell((cell, colIndex) => {
     cell.font = { name: "CustomFont", size: 10, bold: [1, 6].includes(colIndex) };
     cell.alignment = { horizontal: "left", vertical: "middle" };
   });
   typeAndStoreRow2.eachCell((cell, colIndex) => {
     cell.font = { name: "CustomFont", size: 10, bold: [1, 6].includes(colIndex) };
     cell.alignment = { horizontal: "left", vertical: "middle" };
   });
   typeAndStoreRow3.eachCell((cell, colIndex) => {
     cell.font = { name: "CustomFont", size: 10, bold: [1, 6].includes(colIndex) };
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
 
   // Headers (fixed trailing comma)
   const headers = [
     "Code",
     "Description",
     "Stock",
     "Comm",
     "Act Rate",
     "Pur Rate",
     "SM Rate",
     "Sale Rate",
     "MRP",
     "Fix Rate",
   ];
   const headerRow = worksheet.addRow(headers);
   headerRow.eachCell((cell) => Object.assign(cell, headerStyle));
 
   // Data rows with numeric conversion
   tableData.forEach((item, index) => {
     const row = worksheet.addRow([
       item.Code,
       item.Description,
       toNumber(item.Stk),
       toNumber(item.Comm),
       toNumber(item["Act Rate"]),
       toNumber(item["Pur Rate"]),
       toNumber(item["SM Rate"]),
       toNumber(item["Sale Rate"]),
       toNumber(item.MRP),
       toNumber(item["Fix Rate"]),
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
       // Apply number format for numeric columns (colIndex 3..8)
       if (colIndex >= 3 && colIndex <= 8) {
         cell.numFmt = "#,##0";
       }
       // Light grey background for odd rows
       if ((index + 1) % 2 !== 0) {
         cell.fill = {
           type: "pattern",
           pattern: "solid",
           fgColor: { argb: "FFF5F5F5" },
         };
       }
     });
   });
 
   // =====================================================================
   // DYNAMIC WIDTH FOR DESCRIPTION COLUMN (unchanged logic, but fixed column indices)
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
 
   worksheet.getColumn(1).width = 20;   // Code
   worksheet.getColumn(2).width = descriptionWidth; // Description
   worksheet.getColumn(3).width = 14;   // Stock
   worksheet.getColumn(4).width = 14;   // Comm
   worksheet.getColumn(5).width = 14;   // SM Rate
   worksheet.getColumn(6).width = 14;   // Sale Rate
   worksheet.getColumn(7).width = 14;   // MRP
   worksheet.getColumn(8).width = 14;   // Fix Rate
     worksheet.getColumn(9).width = 14;   // MRP
   worksheet.getColumn(10).width = 14;   // Fix Rate
   // =====================================================================
 
   // Total row (only the count in first column, centered)
   const totalRow = worksheet.addRow([
     String(formatValue(tableData.length.toLocaleString())),
     "",
     "",
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
 
   worksheet.addRow([]);
 
   // Date and time
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
   saveAs(blob, `PriceListA As On ${currentdate}.xlsx`);
 };
  ///////////////////////////// DOWNLOAD PDF EXCEL ///////////////////////////////////////////////////////////

  const dispatch = useDispatch();

  const tableTopColor = "#3368B5";
  const tableHeadColor = "#3368b5";
  const secondaryColor = "white";
  const btnColor = "#3368B5";
  const textColor = "white";

  const [tableData, setTableData] = useState([]);
  console.log("comapnydata", tableData);
  const [selectedSearch, setSelectedSearch] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { data, loading, error } = useSelector((state) => state.getuser);

  const handleSearch = (e) => {
    setSelectedSearch(e.target.value);
  };

  let totalEntries = 0;

  const [columns, setColumns] = useState({
    Code: [],
    Description: [],
    Stk: [],
    Comm: [],
    "Act Rate": [],
    "Pur Rate": [],
    "SM Rate": [],
    "Sale Rate": [],
    MRP: [],
    "Fix Rate": [],
  });

  const [columnSortOrders, setColumnSortOrders] = useState({
    Code: "",
    Description: "",
    Stk: "",
    Comm: "",
    "Act Rate": "",
    "Pur Rate": "",
    "SM Rate": "",
    "Sale Rate": "",
    MRP: "",
    "Fix Rate": "",
  });

  // Transform table data into column-oriented format
  useEffect(() => {
    if (tableData.length > 0) {
      const newColumns = {
        Code: tableData.map((row) => row.Code),
        Description: tableData.map((row) => row.Description),
        Stk: tableData.map((row) => row.Stk),
        Comm: tableData.map((row) => row.Comm),
        "Act Rate": tableData.map((row) => row["Act Rate"]),
        "Pur Rate": tableData.map((row) => row["Pur Rate"]),
        "SM Rate": tableData.map((row) => row["SM Rate"]),
        "Sale Rate": tableData.map((row) => row["Sale Rate"]),
        MRP: tableData.map((row) => row.MRP),
        "Fix Rate": tableData.map((row) => row["Fix Rate"]),
      };
      setColumns(newColumns);
    }
  }, [tableData]);

  
 const handleSorting = (col) => {
  const currentOrder = columnSortOrders[col];
  const newOrder = currentOrder === "ASC" ? "DSC" : "ASC";

  const sortedData = [...tableData].sort((a, b) => {
    const aVal = a[col] !== null && a[col] !== undefined ? a[col].toString() : "";
    const bVal = b[col] !== null && b[col] !== undefined ? b[col].toString() : "";

    const numA = parseFloat(aVal.replace(/,/g, ""));
    const numB = parseFloat(bVal.replace(/,/g, ""));

    if (!isNaN(numA) && !isNaN(numB)) {
      return newOrder === "ASC" ? numA - numB : numB - numA;
    } else {
      return newOrder === "ASC" ? aVal.localeCompare(bVal) : bVal.localeCompare(aVal);
    }
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
      Description: null,
      Stk: null,
      Comm: null,
      "Act Rate": null,
      "Pur Rate": null,
      "SM Rate": null,
      "Sale Rate": null,
      MRP: null,
      "Fix Rate": null,
    });
  };

  const renderTableData = () => {
   
  
    return (
      <>
        {isLoading ? (
          <>
            <tr style={{ backgroundColor: getcolor }}>
              <td colSpan="10" className="text-center">
                <Spinner animation="border" variant="primary" />
              </td>
            </tr>
            {Array.from({ length: Math.max(0, 30 - 5) }).map((_, rowIndex) => (
              <tr
                key={`blank-${rowIndex}`}
                style={{
                  backgroundColor: getcolor,
                  color: fontcolor,
                }}
              >
                {Array.from({ length: 10 }).map((_, colIndex) => (
                  <td key={`blank-${rowIndex}-${colIndex}`}>&nbsp;</td>
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
              <td style={eightColWidth}></td>
              <td style={ninthColWidth}></td>
              <td style={tenthColWidth}></td>
              <td style={elewenthColWidth}></td>
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
                  className={selectedIndex === i ? "selected-background" : ""}
                  style={{
                    backgroundColor: getcolor,
                    color: fontcolor,
                  }}
                >
                  <td className="text-start" 
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
                    {item.Stk}
                  </td>
                  <td className="text-end" style={forthColWidth}>
                    {item.Comm}
                  </td>
                  <td className="text-end" style={tenthColWidth}>
                    {item["Act Rate"]}
                  </td>
                  <td className="text-end" style={elewenthColWidth}>
                    {item["Pur Rate"]}
                  </td>
                  <td className="text-end" style={fifthColWidth}>
                    {item["SM Rate"]}
                  </td>
                  <td className="text-end" style={sixthColWidth}>
                    {item["Sale Rate"]}
                  </td>
                  <td className="text-end" style={eightColWidth}>
                    {item.MRP}
                  </td>
                  <td className="text-end" style={ninthColWidth}>
                    {item["Fix Rate"]}
                  </td>
                </tr>
              );
            })}
            {Array.from({ length: Math.max(0, 27 - tableData.length) }).map(
              (_, rowIndex) => (
                <tr
                  key={`blank-${rowIndex}`}
                  style={{
                    backgroundColor: getcolor,
                    color: fontcolor,
                  }}
                >
                  {Array.from({ length: 10 }).map((_, colIndex) => (
                    <td key={`blank-${rowIndex}-${colIndex}`}>&nbsp;</td>
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
              <td style={eightColWidth}></td>
              <td style={ninthColWidth}></td>
              <td style={tenthColWidth}></td>
              <td style={elewenthColWidth}></td>
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

 useHotkeys("alt+s", () => {
        fetchReceivableReport();
           resetSorting();
    }, { preventDefault: true, enableOnFormTags: true });

    useHotkeys("alt+p", exportPDFHandler, { preventDefault: true, enableOnFormTags: true });
    useHotkeys("alt+e", handleDownloadCSV, { preventDefault: true, enableOnFormTags: true });
    useHotkeys("alt+r", () => navigate("/MainPage"),  { preventDefault: true, enableOnFormTags: true });

  const firstColWidth = {
    width: "100px",
  };
  const secondColWidth = {
    width: "270px",
  };
  const thirdColWidth = {
    width: "50px",
  };
  const forthColWidth = {
    width: "50px",
  };
  const fifthColWidth = {
    width: "80px",
  };
  const sixthColWidth = {
    width: "80px",
  };
  const eightColWidth = {
    width: "80px",
  };
  const ninthColWidth = {
    width: "80px",
  };
  const tenthColWidth = {
    width: "80px",
  };
  const elewenthColWidth = {
    width: "80px",
  };

  const sixthcol = { width: "8px" };



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

   const formatValue = (val) => {
    return Number(val) === 0 ? "" : val;
  };

  return (
    <>
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
          <NavComponent textdata="Item Price List A " />

          {/* //////////////// FIRST ROW ///////////////////////// */}

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
                    onKeyDown={(e) => handlecompanyKeypress(e, input1Ref)}
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
          {/* //////////////// SECOND ROW ///////////////////////// */}
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

                <div style={{ marginLeft: "3px" }}>
                  <Select
                    className="List-select-class "
                    ref={input3Ref}
                    options={typeoptions}
                    onKeyDown={(e) => handletypeKeypress(e, input4Ref)}
                    id="selectedsale"
                    onChange={(selectedOption) => {
                      if (selectedOption && selectedOption.value) {
                        const labelPart = selectedOption.label.split("-")[1];
                        setTypeselectdata(selectedOption.value);
                        settypeselectdatavalue({
                          value: selectedOption.value,
                          label: labelPart, // Set only the 'NGS' part of the label
                        });
                      } else {
                        setTypeselectdata(""); // Clear the saleType state when selectedOption is null (i.e., when the selection is cleared)
                        settypeselectdatavalue("");
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

          {/* //////////////// THIRD ROW ///////////////////////// */}
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
                    onKeyDown={(e) => handlecapacityKeypress(e, input3Ref)}
                    id="selectedsale"
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
                <input
                  ref={input4Ref}
                  onKeyDown={(e) => handleKeyPress(e, input6Ref)}
                  type="text"
                  id="searchsubmit"
                  placeholder="Search"
                  value={searchQuery}
                  autoComplete="off"
                  style={{
                    marginRight: "20px",
                    width: "250px",
                    height: "24px",
                    fontSize: "12px",
                    color: fontcolor,
                    backgroundColor: getcolor,
                    border: `1px solid ${fontcolor}`,
                    outline: "none",
                    paddingLeft: "10px",
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
              </div>
            </div>
          </div>

          {/* //////////////// TABLE HEADER SECTION ///////////////////////// */}
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
                      onClick={() => handleSorting("Stk")}
                    >
                      Stk{" "}
                      <i
                        className="fa-solid fa-caret-down caretIconStyle"
                        style={getIconStyle("Stk")}
                      ></i>
                    </td>
                    <td
                      className="border-dark"
                      style={forthColWidth}
                      onClick={() => handleSorting("Comm")}
                    >
                      Com{" "}
                      <i
                        className="fa-solid fa-caret-down caretIconStyle"
                        style={getIconStyle("Comm")}
                      ></i>
                    </td>
                    <td
                      className="border-dark"
                      style={tenthColWidth}
                      onClick={() => handleSorting("Act Rate")}
                    >
                      Act Rate{" "}
                      <i
                        className="fa-solid fa-caret-down caretIconStyle"
                        style={getIconStyle("Act Rate")}
                      ></i>
                    </td>
                    <td
                      className="border-dark"
                      style={elewenthColWidth}
                      onClick={() => handleSorting("Pur Rate")}
                    >
                      Pur Rate{" "}
                      <i
                        className="fa-solid fa-caret-down caretIconStyle"
                        style={getIconStyle("Pur Rate")}
                      ></i>
                    </td>
                    <td
                      className="border-dark"
                      style={fifthColWidth}
                      onClick={() => handleSorting("SM Rate")}
                    >
                      SM Rate{" "}
                      <i
                        className="fa-solid fa-caret-down caretIconStyle"
                        style={getIconStyle("SM Rate")}
                      ></i>
                    </td>
                    <td
                      className="border-dark"
                      style={sixthColWidth}
                      onClick={() => handleSorting("Sale Rate")}
                    >
                      Sal Rate{" "}
                      <i
                        className="fa-solid fa-caret-down caretIconStyle"
                        style={getIconStyle("Sale Rate")}
                      ></i>
                    </td>
                    <td
                      className="border-dark"
                      style={eightColWidth}
                      onClick={() => handleSorting("MRP")}
                    >
                      MRP{" "}
                      <i
                        className="fa-solid fa-caret-down caretIconStyle"
                        style={getIconStyle("MRP")}
                      ></i>
                    </td>
                    <td
                      className="border-dark"
                      style={ninthColWidth}
                      onClick={() => handleSorting("Fix Rate")}
                    >
                      Fix Rate{" "}
                      <i
                        className="fa-solid fa-caret-down caretIconStyle"
                        style={getIconStyle("Fix Rate")}
                      ></i>
                    </td>

                    <td
                      className="border-dark"
                      style={sixthcol}
                    ></td>
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
                maxHeight: "48vh",
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
                <tbody id="tablebody">{renderTableData()}</tbody>
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
              // width: "101.2%",
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
                ...eightColWidth,
                background: getcolor,
                borderRight: `1px solid ${fontcolor}`,
              }}
            ></div>
            <div
              style={{
                ...ninthColWidth,
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
                ...elewenthColWidth,
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
              highlightFirstLetter={true}
              ref={input6Ref}
              // onClick={fetchReceivableReport}
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