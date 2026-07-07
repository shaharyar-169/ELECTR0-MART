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


export default function ItemList() {
  const navigate = useNavigate();
  const user = getUserData();
  const organisation = getOrganisationData();
  const yeardescription = getYearDescription();
  const locationnumber = getLocationnumber();

  const saleSelectRef = useRef(null);
  const input1Ref = useRef(null);
  const input2Ref = useRef(null);
  const input3Ref = useRef(null);
  const input11Ref = useRef(null);
  const input4Ref = useRef(null);
  const input5Ref = useRef(null);
  const input6Ref = useRef(null);

  const [Companyselectdata, setCompanyselectdata] = useState("");

  const [Companyselectdatavalue, setCompanyselectdatavalue] = useState("");

  const [GetCompany, setGetCompany] = useState([]);

  const [Capacityselectdata, setCapacityselectdata] = useState("");
  const [capacityselectdatavalue, setcapacityselectdatavalue] = useState("");
  const [tableData, setTableData] = useState([]);
  console.log("Tbaledata", tableData);
  const [GetCapacity, setGetCapacity] = useState([]);

  const [Categoryselectdata, setCategoryselectdata] = useState("");
  const [categoryselectdatavalue, setcategoryselectdatavalue] = useState("");

  const [GetCategory, setGetCategory] = useState([]);

  const [Typeselectdata, setTypeselectdata] = useState("");
  const [typeselectdatavalue, settypeselectdatavalue] = useState("");

  const [GetType, setGetType] = useState([]);

  const [sortData, setSortData] = useState("ASC");

  const [searchQuery, setSearchQuery] = useState("");
  const [transectionType, settransectionType] = useState("");

  const [isAscendingcode, setisAscendingcode] = useState(true);
  const [isAscendingemploye, setisAscendingemploye] = useState(true);
  const [isAscendingsts, setisAscendingsts] = useState(true);

  const [isAscendingdesig, setisAscendingdesig] = useState(true);
  const [isAscendingcontect, setisAscendingcontect] = useState(true);
  const [isAscendingadv, setisAscendingadv] = useState(true);

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
    getdatafontsize,
    getfontstyle,
  } = useTheme();

  useEffect(() => {
    document.documentElement.style.setProperty("--background-color", getcolor);
    document.documentElement.style.setProperty("--font-color", fontcolor);
  }, [getcolor, fontcolor]);

  const comapnyname = organisation.description;


  function fetchReceivableReport() {
    const apiUrl = apiLinks + "/ItemList.php";
    setIsLoading(true);

    const formData = new URLSearchParams({
      FItmSts: transectionType,

      FCapCod: Capacityselectdata,
      FCtgCod: Categoryselectdata,
      FSchTxt: searchQuery,
      FCmpCod: Companyselectdata,
      FTypCod: Typeselectdata,
      code: organisation.code,
      FLocCod: locationnumber || getLocationNumber,
      FYerDsc: yeardescription || getyeardescription,

      // code: 'NASIRTRD',
      // FLocCod: '001',
      // FYerDsc: '2025-2025',
    }).toString();

    axios
      .post(apiUrl, formData)
      .then((response) => {
        setIsLoading(false);

        if (response.data && Array.isArray(response.data)) {
          // Transform API data to match your table structure
          const transformedData = response.data.map((item) => ({
            Code: item.Code,
            Description: item.Description,
            Company: item.Company,
            Category: item.Category,
            Capacity: item.Capacity,
            Type: item.Type,
            UOM: item.UOM,
            Purchase: item.Purchase,
            Sale: item.Sale,
            Status:
              item.Status === "N"
                ? "N"
                : item.Status === "A"
                  ? "A"
                  : item.Status, // fallback
          }));

          setTableData(transformedData);

          // If you still need columns structure for some reason
          const newColumns = {
            Code: transformedData.map((item) => item.Code),
            Description: transformedData.map((item) => item.Description),
            Company: transformedData.map((item) => item.Company),
            Category: transformedData.map((item) => item.Category),
            Capacity: transformedData.map((item) => item.Capacity),
            Type: transformedData.map((item) => item.Type),
            UOM: transformedData.map((item) => item.UOM),
            Purchase: transformedData.map((item) => item.Purchase),
            Sale: transformedData.map((item) => item.Sale),
            Status: transformedData.map((item) => item.Status),
          };
          setColumns(newColumns);
        } else {
          setTableData([]);
          setColumns({
            Code: [],
            Description: [],
            Company: [],
            Category: [],
            Capacity: [],
            Type: [],
            UOM: [],
            Purchase: [],
            Sale: [],
            Status: [],
          });
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

  const handleTransactionTypeChange = (event) => {
    const selectedTransactionType = event.target.value;
    settransectionType(selectedTransactionType);
  };

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

    // Define table data (rows)
    const dataRows = tableData.map((item) => [
      item.Code,
      item.Description,
      item.Company,
      item.Category,
      item.Status,
    ]);

    // Add total row at the end
    const rows = [...dataRows];
    rows.push([
      dataRows.length.toLocaleString(),
      "",
      "",
      "",
      "",
    ]);

    // Headers and column widths
    const headers = ["Code", "Description", "Company", "Category", "Status"];
    const columnWidths = [40, 100, 70, 60, 15];

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

    // Total table width
    const getTotalTableWidth = () => columnWidths.reduce((acc, w) => acc + w, 0);
    const totalWidth = getTotalTableWidth();

    // Page dimensions (maximised rows)
    const pageHeight = doc.internal.pageSize.height;
    const paddingTop = 10;
    const footerReserve = 15;
    const headersStartY = 30;

    doc.setFont("verdana-regular", "normal");
    doc.setFontSize(10);

    // ----- Helper: Draw footer line (now with more space above the text) -----
    const drawFooter = () => {
      const tableWidth = getTotalTableWidth();
      const lineX = (doc.internal.pageSize.width - tableWidth) / 2;
      const lineY = pageHeight - 10;        // line placed lower (more gap above)
      doc.setLineWidth(0.3);
      doc.line(lineX, lineY, lineX + tableWidth, lineY);
      doc.setFont("verdana-regular", "normal");
      doc.setFontSize(10);
      // text placed at pageHeight - 5 (same as page number)
      doc.text(`Crystal Solution    ${exportDate}    ${exportTime}`, lineX + 2, pageHeight - 5);
    };

    // ----- Helper: Draw page number (same Y as footer text) -----
    const drawPageNumber = (pageNum, totalPages) => {
      const rightX = doc.internal.pageSize.width - 10;
      doc.setFont("verdana-regular", "normal");
      doc.setFontSize(10);
      doc.text(`Page ${pageNum} / ${totalPages}`, rightX - 25, pageHeight - 5, { align: "right" });
    };

    // ----- Table headers (unchanged) -----
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

    // ----- Add rows (dynamic pagination) -----
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

        const splitRow = row.map((cell, idx) => {
          const text = String(cell).trim();
          const maxWidth = columnWidths[idx] - 4;
          const textWidth = (doc.getStringUnitWidth(text) * doc.internal.getFontSize()) / doc.internal.scaleFactor;
          if (textWidth <= maxWidth) return [text];
          return doc.splitTextToSize(text, maxWidth);
        });

        const maxLines = Math.max(...splitRow.map((c) => c.length));
        const rowHeight = maxLines * lineHeight + 2;

        if (currentY + rowHeight > pageHeight - footerReserve) {
          drawFooter();
          drawPageNumber(pageNum, totalPages);
          return currentRowIndex;
        }

        if (isOddRow) {
          doc.setFillColor(240);
          doc.rect(startX, currentY, tableWidth, rowHeight, "F");
        }
        doc.setDrawColor(0);

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
          const textY = currentY + (rowHeight - textArray.length * lineHeight) / 2 + lineHeight - 1;

          const isStatusColumn = cellIndex === 4;
          const isTotalFirstColumn = isTotalRow && cellIndex === 0;
          if (isStatusColumn || isTotalFirstColumn) {
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

      drawFooter();
      drawPageNumber(pageNum, totalPages);
      return rows.length;
    };

    // ----- Dry run to compute total pages -----
    const computeTotalPages = () => {
      const measureDoc = new jsPDF({ orientation: "landscape" });
      measureDoc.setFont("verdana-regular", "normal");
      measureDoc.setFontSize(10);
      const measureRows = [...rows];
      const measureColumnWidths = [...columnWidths];
      const measurePageHeight = measureDoc.internal.pageSize.height;
      const measureFooterReserve = 15;
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

    // ----- Main rendering loop -----
    const handlePagination = () => {
      const addTitle = (title, startY, titleFontSize = 18) => {
        doc.setFontSize(titleFontSize);
        doc.text(title, doc.internal.pageSize.width / 2, startY, { align: "center" });
      };

      let currentStartY = paddingTop;
      let nextRowIndex = 0;
      let pageNumber = 1;

      while (nextRowIndex < rows.length) {
        doc.setFont("Times New Roman", "normal");
        addTitle(comapnyname, currentStartY, 18);
        currentStartY += 5;
        doc.setFont("verdana-regular", "normal");
        addTitle("Item List", currentStartY, 12);
        currentStartY += 5;

        const labelsX = (doc.internal.pageSize.width - totalWidth) / 2;
        const labelsY = currentStartY + 4;

        const typeItem = Companyselectdatavalue.label ? Companyselectdatavalue.label : "ALL";
        const status = transectionType === "N" ? "Not Active" : transectionType === "A" ? "Active" : "ALL";
        const category = categoryselectdatavalue.label ? categoryselectdatavalue.label : "ALL";
        const search = searchQuery ? searchQuery : "";

        doc.setFont("verdana", "bold");
        doc.setFontSize(10);
        doc.text(`Company :`, labelsX, labelsY);
        doc.setFont("verdana-regular", "normal");
        doc.text(`${typeItem}`, labelsX + 25, labelsY);

        doc.setFont("verdana", "bold");
        doc.text(`Status :`, labelsX + 180, labelsY);
        doc.setFont("verdana-regular", "normal");
        doc.text(`${status}`, labelsX + 200, labelsY);

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

        const headersStartX = (doc.internal.pageSize.width - totalWidth) / 2;
        addTableHeaders(headersStartX, headersStartY);

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
    doc.save(`ItemList As On ${exportDate}.pdf`);
  };
  ///////////////////////////// DOWNLOAD PDF EXCEL //////////////////////////////////////////////////////////

 const handleDownloadCSV = async () => {
  const workbook = new ExcelJS.Workbook();
  const worksheet = workbook.addWorksheet("Sheet1");

  const numColumns = 9; // Ensure this matches the actual number of columns

  const columnAlignments = [
    "left",
    "left",
    "left",
    "left",
    "left",
    "right",
    "right",
    "center",
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
    `A${companyRow.number}:${String.fromCharCode(64 + numColumns - 1)}${companyRow.number}`
  );

  // Add Store List row
  const storeListRow = worksheet.addRow(["Item List"]);
  storeListRow.eachCell((cell) => {
    cell.font = fontStoreList;
    cell.alignment = { horizontal: "center" };
  });

  worksheet.mergeCells(
    `A${storeListRow.number}:${String.fromCharCode(64 + numColumns - 1)}${storeListRow.number}`
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

  let typestatus =
    transectionType === "N"
      ? "Not Active"
      : transectionType === "A"
      ? "Active"
      : "ALL";

  let typesearch = searchQuery ? searchQuery : "";

  // Add first row
  const typeAndStoreRow = worksheet.addRow([
    "Company :",
    typecompany,
    "",
    "Status :",
    typestatus,
  ]);

  // Add third row with conditional rendering for "SEARCH:"
  const typeAndStoreRow3 = worksheet.addRow(
    searchQuery
      ? ["Category :", typecategory, "", "Search :", typesearch]
      : ["Category :", typecategory, ""]
  );

  // Apply styling for the status row – with Status label right‑aligned, value left‑aligned
  typeAndStoreRow.eachCell((cell, colIndex) => {
    cell.font = {
      name: "CustomFont" || "CustomFont",
      size: 10,
      bold: [1, 4].includes(colIndex), // bold for labels (col1 & col4)
    };
    // Status label (colIndex 4) -> right align, Status value (colIndex 5) -> left align
    if (colIndex === 4) {
      cell.alignment = { horizontal: "right", vertical: "middle" };
    } else if (colIndex === 5) {
      cell.alignment = { horizontal: "left", vertical: "middle" };
    } else {
      cell.alignment = { horizontal: "left", vertical: "middle" };
    }
  });

  typeAndStoreRow3.eachCell((cell, colIndex) => {
    cell.font = {
      name: "CustomFont" || "CustomFont",
      size: 10,
      bold: [1, 4].includes(colIndex),
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
    "Company",
    "Category",
    "UOM",
    "Purchase",
    "Sale",
    "Status",
  ];
  const headerRow = worksheet.addRow(headers);
  headerRow.eachCell((cell) => Object.assign(cell, headerStyle));

  // Add data rows
  tableData.forEach((item, index) => {
    const row = worksheet.addRow([
      item.Code,
      item.Description,
      item.Company,
      item.Category,
      item.UOM,
      item.Purchase,
      item.Sale,
      item.Status,
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

      // ✅ Apply light grey background for odd-numbered rows
      if ((index + 1) % 2 !== 0) {
        cell.fill = {
          type: "pattern",
          pattern: "solid",
          fgColor: { argb: "FFF5F5F5" }, // Light grey background
        };
      }
    });
  });

  // =====================================================================
  // DYNAMIC WIDTH FOR DESCRIPTION COLUMN (unchanged)
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

  worksheet.getColumn(1).width = 20;
  worksheet.getColumn(2).width = descriptionWidth;
  worksheet.getColumn(3).width = 30;
  worksheet.getColumn(4).width = 30;
  worksheet.getColumn(5).width = 8;
  worksheet.getColumn(5).width = 12;   // repeated – kept as in original
  worksheet.getColumn(5).width = 12;   // repeated – kept as in original
  worksheet.getColumn(5).width = 7;    // repeated – kept as in original
  // =====================================================================

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
  // FIX: was incorrectly using dateTimeRow.eachCell
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
  saveAs(blob, `ItemList As On ${currentdate}.xlsx`);
};

  const formatValue = (val) => {
    return Number(val) === 0 ? "" : val;
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

  // const firstColWidth = {
  //   width: "15%",
  // };
  // const secondColWidth = {
  //   width: "40%",
  // };
  // const thirdColWidth = {
  //   width: "15.4%",
  // };
  // const forthColWidth = {
  //   width: "18%",
  // };
  // const fifthColWidth = {
  //   width: "10%",
  // };
  // const sixthColWidth = {
  //   width: "20%",
  // };
  // const seventhColWidth = {
  //   width: "10%",
  // };



  const firstColWidth = {
    width: "135px",
  };
  const secondColWidth = {
    width: "360px",
  };
  const thirdColWidth = {
    width: "200px",
  };
  const forthColWidth = {
    width: "200px",
  };

  const seventhColWidth = {
    width: "60px",
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
    maxWidth: "970px",
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

  const [columns, setColumns] = useState({
    Code: [],
    Description: [],
    Company: [],
    Category: [],
    // Capacity: [],
    // Type: [],
    Status: [],
  });

  const [columnSortOrders, setColumnSortOrders] = useState({
    Code: "",
    Description: "",
    Company: "",
    Category: "",
    // Capacity: "",
    // Type: "",
    Status: "",
  });

  // Transform table data into column-oriented format
  useEffect(() => {
    if (tableData.length > 0) {
      const newColumns = {
        Code: tableData.map((row) => row.Code),
        Description: tableData.map((row) => row.Description),
        Company: tableData.map((row) => row.Company),
        Category: tableData.map((row) => row.Category),
        // Capacity: tableData.map((row) => row.Capacity),
        // Type: tableData.map((row) => row.Type),
        Status: tableData.map((row) => row.Status),
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
      Company: null,
      Category: null,
      // Capacity: null,
      // Type: null,
      Status: null,
    });
  };

  const renderTableData = () => {
    return (
      <>
        {isLoading ? (
          <>
            <tr style={{ backgroundColor: getcolor }}>
              <td colSpan="5" className="text-center">
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
                {Array.from({ length: 5 }).map((_, colIndex) => (
                  <td key={`blank-${rowIndex}-${colIndex}`}>&nbsp;</td>
                ))}
              </tr>
            ))}
            <tr>
              <td style={firstColWidth}></td>
              <td style={secondColWidth}></td>
              <td style={thirdColWidth}></td>
              <td style={forthColWidth}></td>
              {/* <td style={fifthColWidth}></td>
              <td style={sixthColWidth}></td> */}
              <td style={seventhColWidth}></td>
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
                  <td
                    className="text-start"
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
                  <td
                    className="text-start"
                    title={item.Company}
                    style={{
                      ...thirdColWidth,
                      whiteSpace: "nowrap",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                    }}
                  >
                    {item.Company}
                  </td>
                  <td
                    className="text-start"
                    title={item.Category}
                    style={{
                      ...forthColWidth,
                      whiteSpace: "nowrap",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                    }}
                  >
                    {item.Category}
                  </td>
                  {/* <td
                    className="text-start"
                    title={item.Capacity}
                    style={{
                      ...fifthColWidth,
                      whiteSpace: "nowrap",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                    }}
                  >
                    {item.Capacity}
                  </td>
                  <td
                    className="text-start"
                    title={item.Type}
                    style={{
                      ...sixthColWidth,
                      whiteSpace: "nowrap",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                    }}
                  >
                    {item.Type}
                  </td> */}

                  <td
                    className="text-center"
                    title={item.Status}
                    style={{
                      ...seventhColWidth,
                      whiteSpace: "nowrap",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                    }}
                  >
                    {item.Status}
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
                  <td key={`blank-${rowIndex}-${colIndex}`}>&nbsp;</td>
                ))}
              </tr>
            ))}
            <tr>
              <td style={firstColWidth}></td>
              <td style={secondColWidth}></td>
              <td style={thirdColWidth}></td>
              <td style={forthColWidth}></td>
              {/* <td style={fifthColWidth}></td>
              <td style={sixthColWidth}></td> */}
              <td style={seventhColWidth}></td>
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
  useHotkeys("alt+r", () => navigate("/MainPage"), { preventDefault: true, enableOnFormTags: true });

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
          <NavComponent textdata="Item List" />

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
                      Type :
                    </span>
                  </label>
                </div>

                <div style={{ marginLeft: "3px" }}>
                  <Select
                    className="List-select-class "
                    ref={input3Ref}
                    options={typeoptions}
                    onKeyDown={(e) => handletypeKeypress(e, input11Ref)}
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
                      Status :
                    </span>
                  </label>
                </div>


                <div style={{ position: "relative", display: "inline-block" }}>
                  <select
                    ref={input11Ref}
                    onKeyDown={(e) => handleKeyPress(e, input5Ref)}
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
                      width: "300px",
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
                    <option value="">All</option>
                    <option value="A">Active</option>
                    <option value="N">Not Active</option>
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
                    id="selectedsale2"
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
                <div style={{ position: "relative", display: "inline-block" }}>
                  <input
                    ref={input5Ref}
                    onKeyDown={(e) => handleKeyPress(e, input6Ref)}
                    type="text"
                    id="searchsubmit"
                    placeholder="Search"
                    value={searchQuery}
                    autoComplete="off"
                    style={{
                      marginRight: "20px",
                      width: "300px",
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

          {/* //////////////// TABLE HEADER SECTION ///////////////////////// */}
          <div>
            <div
              style={{
                overflowY: "auto",
                // width: "98.5%",
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
                    style={{ backgroundColor: getnavbarbackgroundcolor, color: "white" }}
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
                      onClick={() => handleSorting("Company")}
                    >
                      Company{" "}
                      <i
                        className="fa-solid fa-caret-down caretIconStyle"
                        style={getIconStyle("Company")}
                      ></i>
                    </td>

                    <td
                      className="border-dark"
                      style={forthColWidth}
                      onClick={() => handleSorting("Category")}
                    >
                      Category{" "}
                      <i
                        className="fa-solid fa-caret-down caretIconStyle"
                        style={getIconStyle("Category")}
                      ></i>
                    </td>

                    {/* <td
                      className="border-dark"
                      style={fifthColWidth}
                      onClick={() => handleSorting("Capacity")}
                    >
                      Capacity{" "}
                      <i
                        className="fa-solid fa-caret-down caretIconStyle"
                        style={getIconStyle("Capacity")}
                      ></i>
                    </td>

                    <td
                      className="border-dark"
                      style={sixthColWidth}
                      onClick={() => handleSorting("Type")}
                    >
                      Type{" "}
                      <i
                        className="fa-solid fa-caret-down caretIconStyle"
                        style={getIconStyle("Type")}
                      ></i>
                    </td> */}

                    <td
                      className="border-dark"
                      style={seventhColWidth}
                      onClick={() => handleSorting("Status")}
                    >
                      Status{" "}
                      <i
                        className="fa-solid fa-caret-down caretIconStyle"
                        style={getIconStyle("Status")}
                      ></i>
                    </td>

                    <td
                      className="border-dark"
                      style={sixthcol}
                    >


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
                maxHeight: "45vh",
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
              <span className="mobileledger_total2">{formatValue(tableData.length.toLocaleString())}</span>

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
            {/* <div
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
            ></div> */}
            <div
              style={{
                ...seventhColWidth,
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
              // highlightFirstLetter={true}
              ref={input6Ref}
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

