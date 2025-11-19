import React, { useState, useEffect, useRef } from "react";
import { Container, Spinner, Nav } from "react-bootstrap";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import { useTheme } from "../../../../ThemeContext";
import { getUserData, getOrganisationData, getLocationnumber, getYearDescription } from "../../../Auth";
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
import './dailydemo.css';

export default function DailyPurchaseReport() {
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
  const capacityRef = useRef(null);
  const storeRef = useRef(null);
  const typeRef = useRef(null);
  const searchRef = useRef(null);
  const selectButtonRef = useRef(null);

  const [saleType, setSaleType] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [transectionType, settransectionType] = useState("");

  const [storeType, setStoreType] = useState("");

  const yeardescription = getYearDescription();
  const locationnumber = getLocationnumber();

  const [Companyselectdatavalue, setCompanyselectdatavalue] = useState("");

  const [companyType, setCompanyType] = useState("");
  const [categoryType, setCategoryType] = useState("");
  const [capacityType, setCapacityType] = useState("");

  const [storeList, setStoreList] = useState([]);
  const [companyList, setCompanyList] = useState([]);
  const [categoryList, setCategoryList] = useState([]);
  const [capacityList, setCapacityList] = useState([]);

  const [totalQnty, setTotalQnty] = useState(0);
  const [totalOpening, setTotalOpening] = useState(0);
  const [totalDebit, setTotalDebit] = useState(0);
  const [totalCredit, setTotalCredit] = useState(0);
  const [closingBalance, setClosingBalance] = useState(0);
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

  function fetchDailySaleReport() {
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

    const apiMainUrl = apiLinks + "/DailyPurchaseReport.php";
    setIsLoading(true);
    const formMainData = new URLSearchParams({
      code: organisation.code,
      FLocCod: locationnumber || getLocationNumber,
      FYerDsc: yeardescription || getYearDescription,
      // code: 'USMANCOPOS',
      code: 'NASIRTRD',
      FLocCod: '001',
      FYerDsc: '2024-2024',
      FIntDat: fromInputDate,
      FFnlDat: toInputDate,
      FTrnTyp: transectionType,
      FStrCod: storeType,
      FSchTxt: searchQuery,
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
    //----------------- store dropdown
    const apiStoreUrl = apiLinks + "/GetStore.php";
    const formStoreData = new URLSearchParams({
      code: organisation.code,
    }).toString();
    axios
      .post(apiStoreUrl, formStoreData)
      .then((response) => {
        setStoreList(response.data);
        // console.log("STORE"+response.data);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });
  }, []);

  // Store List array
  const optionStore = storeList.map((item) => ({
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

  // ------------ store style customization
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
        borderColor: "#2684FF",
        boxShadow: "0 0 0 1px #2684FF",
      }
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
          backgroundColor: "#2684FF",
        }
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
      color: state.isSelected
        ? "white"
        : fontcolor,
      "&:hover": {
        backgroundColor: "#3368B5",
        color: "white",
        cursor: "pointer",
      },
      "&:active": {
        backgroundColor: "#3368B5",
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
        color: "#2684FF",
      }
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
      }
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
      }
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
      item["Trn #"],
      item.Type,
      item.Str,
      item.Description,
      item.Supplier,
      // item.Mobile,
      item.Rate,
      item.Qnty,
      item["Pur Amount"],
    ]);

    // Add summary row to the table
    rows.push([
      "",
      "",
      "",
      "",
      "Total",
      "",
      "",
      String(totalQnty),
      String(totalAmount),
    ]);

    // Define table column headers and individual column widths

    const headers = [
      "Date",
      "Trn#",
      "Type",
      "Str",
      "Description",
      "Customer",
      // "Mobile",
      "Rate",
      "Qnty",
      "Amount",
    ];
    const columnWidths = [22, 13, 10, 10, 90, 60, 20, 17, 20];

    // Calculate total table width
    const totalWidth = columnWidths.reduce((acc, width) => acc + width, 0);

    // Define page height and padding
    const pageHeight = doc.internal.pageSize.height;
    const paddingTop = 15;

    // Set font properties for the table
    doc.setFont(getfontstyle);
    doc.setFontSize(10);

    // Function to add table headers
    const addTableHeaders = (startX, startY) => {
      // Set font style and size for headers
      doc.setFont(getfontstyle, "bold"); // Set font to bold
      doc.setFontSize(12); // Set font size for headers

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
      doc.setFontSize(12);
    };


    const addTableRows = (startX, startY, startIndex, endIndex) => {
      const rowHeight = 5; // Adjust row height
      const fontSize = 10; // Adjust font size
      const boldFont = 400; // Bold font
      const normalFont = getfontstyle; // Default font
      const tableWidth = getTotalTableWidth(); // Calculate total table width

      doc.setFontSize(fontSize);

      for (let i = startIndex; i < endIndex; i++) {
        const row = rows[i];
        const isTotalRow = i === rows.length - 1; // Check if this is the total row
        const isOddRow = i % 2 !== 0; // Check if the row index is odd
        let textColor = [0, 0, 0]; // Default text color
        let fontName = normalFont; // Default font
        let currentX = startX; // Track current column position

        // Check if Qnty (column index 6) is negative
        if (parseFloat(row[7]) < 0) {
          textColor = [255, 0, 0]; // Set red color for negative Qnty
        }

        // For total row, set bold font
        if (isTotalRow) {
          doc.setFont(getfontstyle, 'bold');
        }

        if (isOddRow) {
          doc.setFillColor(240); // Light background color
          doc.rect(
            startX,
            startY + (i - startIndex + 2) * rowHeight,
            tableWidth,
            rowHeight,
            "F"
          );
        }

        row.forEach((cell, cellIndex) => {
          // For total row, adjust vertical position to center in the double border
          const cellY = isTotalRow
            ? startY + (i - startIndex + 2) * rowHeight + rowHeight / 2
            : startY + (i - startIndex + 2) * rowHeight + 3;

          const cellX = currentX + 2;

          // Set text color
          doc.setTextColor(textColor[0], textColor[1], textColor[2]);

          // For total row, keep bold font
          if (!isTotalRow) {
            doc.setFont(fontName, "normal");
          }

          // Ensure the cell value is a string
          const cellValue = String(cell);

          if (cellIndex === 6 || cellIndex === 7 || cellIndex === 8 || cellIndex === 9) {
            const rightAlignX = currentX + columnWidths[cellIndex] - 2;
            doc.text(cellValue, rightAlignX, cellY, {
              align: "right",
              baseline: "middle",
            });
          } else {
            // For empty cells in total row, add "Total" label centered
            if (isTotalRow && cellIndex === 0 && cell === "") {
              const totalLabelX = currentX + columnWidths[0] / 2;
              doc.text("", totalLabelX, cellY, {
                align: "center",
                baseline: "middle"
              });
            } else {
              doc.text(cellValue, cellX, cellY, {
                baseline: "middle"
              });
            }
          }

          // Draw borders
          const rowTopY = startY + (i - startIndex + 2) * rowHeight;
          const rowBottomY = rowTopY + rowHeight;

          if (isTotalRow) {
            // Double horizontal borders for total row
            doc.setDrawColor(0);

            // Top border - double line
            doc.setLineWidth(0.3);
            doc.line(currentX, rowTopY, currentX + columnWidths[cellIndex], rowTopY);
            doc.line(currentX, rowTopY + 0.5, currentX + columnWidths[cellIndex], rowTopY + 0.5);

            // Bottom border - double line
            doc.line(currentX, rowBottomY, currentX + columnWidths[cellIndex], rowBottomY);
            doc.line(currentX, rowBottomY - 0.5, currentX + columnWidths[cellIndex], rowBottomY - 0.5);

            // Single vertical borders
            doc.setLineWidth(0.2);
            // Left border (only for first column)
            if (cellIndex === 0) {
              doc.line(currentX, rowTopY, currentX, rowBottomY);
            }
            // Right border
            doc.line(currentX + columnWidths[cellIndex], rowTopY, currentX + columnWidths[cellIndex], rowBottomY);
          } else {
            // Normal border for other rows
            doc.setDrawColor(0);
            doc.setLineWidth(0.2);
            doc.rect(
              currentX,
              rowTopY,
              columnWidths[cellIndex],
              rowHeight
            );
          }

          // Move to next column
          currentX += columnWidths[cellIndex];
        });

        // Reset font after total row
        if (isTotalRow) {
          doc.setFont(getfontstyle, "normal");
        }
      }

      // Draw line at the bottom of the page with padding
      const lineWidth = tableWidth;
      const lineX = (doc.internal.pageSize.width - tableWidth) / 2;
      const lineY = pageHeight - 15;
      doc.setLineWidth(0.3);
      doc.line(lineX, lineY, lineX + lineWidth, lineY);
      const headingFontSize = 12;

      // Add heading "Crystal Solution" aligned left bottom of the line
      const headingX = lineX + 2;
      const headingY = lineY + 5;
      doc.setFontSize(headingFontSize);
      doc.setTextColor(0);
      doc.text(`Crystal Solution \t ${date} \t ${time}`, headingX, headingY);
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
    const rowsPerPage = 27; // Adjust this value based on your requirements

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
        doc.setFontSize(pageNumberFontSize);
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
        addTitle(comapnyname, 12, 12, pageNumber, startY, 18); // Render company title with default font size, only date, and page number
        startY += 5; // Adjust vertical position for the company title

        addTitle(
          `Purchase Report From ${fromInputDate} To ${toInputDate}`,
          "",
          "",
          pageNumber,
          startY,
          12
        ); // Render sale report title with decreased font size, provide the time, and page number
        startY += 5;

        const labelsX = (doc.internal.pageSize.width - totalWidth) / 2;
        const labelsY = startY + 4; // Position the labels below the titles and above the table

        // Set font size and weight for the labels
        doc.setFontSize(12);
        doc.setFont(getfontstyle, "300");

        let status =
          transectionType === ""
            ? "ALL"
            : transectionType === "BIL"
              ? "PURCHASE"
              : transectionType === "PRN"
                ? "PURCHASE RETURN"
                : "ALL";

        let typeItem = Companyselectdatavalue.label
          ? Companyselectdatavalue.label
          : "ALL";

        // let status = transectionType ? transectionType : "All";
        let search = searchQuery ? searchQuery : "";

        // Set font style, size, and family
        doc.setFont(getfontstyle, "300"); // Font family and style ('normal', 'bold', 'italic', etc.)
        doc.setFontSize(10); // Font size

        // doc.text(`COMPANY : ${typeItem}`, labelsX, labelsY); // Adjust x-coordinate for From Date
        // doc.text(`CAPACITY : ${typeText}`, labelsX + 180, labelsY); // Adjust x-coordinate for From Date
        // doc.text(`CATEGORY : ${category}`, labelsX, labelsY + 4.3); // Adjust x-coordinate for From Date

        // doc.text(`TYPE : ${typename}`, labelsX + 180, labelsY + 4.3); // Adjust x-coordinate for From Date
        // doc.text(`STATUS : ${status}`, labelsX, labelsY + 8.5); // Adjust x-coordinate for From Date
        // doc.text(`SEARCH : ${search}`, labelsX + 180, labelsY + 8.5); // Adjust x-coordinate for From Date

        doc.setFont(getfontstyle, "bold"); // Set font to bold
        doc.text(`STORE :`, labelsX, labelsY); // Draw bold label
        doc.setFont(getfontstyle, "normal"); // Reset font to normal
        doc.text(`${typeItem}`, labelsX + 25, labelsY); // Draw the value next to the label

        doc.setFont(getfontstyle, "bold"); // Set font to bold
        doc.text(`TYPE :`, labelsX, labelsY + 4.3); // Draw bold label
        doc.setFont(getfontstyle, "normal"); // Reset font to normal
        doc.text(`${status}`, labelsX + 25, labelsY + 4.3); // Draw the value next to the label

        //    doc.setFont(getfontstyle, "bold"); // Set font to bold
        //    doc.text(`TYPE :`, labelsX + 180, labelsY + 4.3); // Draw bold label
        //    doc.setFont(getfontstyle, "normal"); // Reset font to normal
        //    doc.text(`${typename}`, labelsX + 195, labelsY + 4.3); // Draw the value next to the label

        //    doc.setFont(getfontstyle, "bold"); // Set font to bold
        //    doc.text(`CAPACITY :`, labelsX, labelsY + 8.5); // Draw bold label
        //    doc.setFont(getfontstyle, "normal"); // Reset font to normal
        //    doc.text(`${typeText}`, labelsX + 25, labelsY + 8.5); // Draw the value next to the label

        if (searchQuery) {
          doc.setFont(getfontstyle, "bold"); // Set font to bold
          doc.text(`SEARCH :`, labelsX + 180, labelsY + 4.3); // Draw bold label
          doc.setFont(getfontstyle, "normal"); // Reset font to normal
          doc.text(`${search}`, labelsX + 200, labelsY + 4.3); // Draw the value next to the label
        }

        // // Reset font weight to normal if necessary for subsequent text
        doc.setFont(getfontstyle, "bold"); // Set font to bold
        doc.setFontSize(10);

        startY += 6; // Adjust vertical position for the labels

        addTableHeaders((doc.internal.pageSize.width - totalWidth) / 2, 35);
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
      const mm = String(today.getMonth() + 1).padStart(2, "0");
      const yyyy = today.getFullYear();
      return `${dd}-${mm}-${yyyy}`;
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
    doc.save(`PurchaseReport From ${fromInputDate} To ${toInputDate}.pdf`);
  };

  useEffect(() => {
    document.documentElement.style.setProperty("--background-color", getcolor);
  }, [getcolor]);

  const handleDownloadCSV = async () => {
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet("Sheet1");

    const numColumns = 6; // Ensure this matches the actual number of columns

    const columnAlignments = [
      "left",
      "left",
      "center",
      "left",
      "left",
      "left",

      "right",
      "right",
      "right",];

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
      `A${companyRow.number}:${String.fromCharCode(68 + numColumns - 1)}${companyRow.number
      }`
    );

    // Add Store List row
    const storeListRow = worksheet.addRow([`Purchase Report From ${fromInputDate} To ${toInputDate}`,]);
    storeListRow.eachCell((cell) => {
      cell.font = fontStoreList;
      cell.alignment = { horizontal: "center" };
    });

    worksheet.mergeCells(
      `A${storeListRow.number}:${String.fromCharCode(68 + numColumns - 1)}${storeListRow.number
      }`
    );

    // Add an empty row after the title section
    worksheet.addRow([]);

    let typecategory = Companyselectdatavalue.label
      ? Companyselectdatavalue.label
      : "ALL";
    let typestatus =
      transectionType === "BIL"
        ? "PURCHASE"
        : transectionType === "PRN"
          ? "PURCHASE RETURN"
          : "ALL";
    let typesearch = searchQuery ? searchQuery : "";

    const typeAndStoreRow2 = worksheet.addRow(["STORE :", typecategory]);
    const typeAndStoreRow3 = worksheet.addRow(
      searchQuery
        ? ["TYPE :", typestatus, "", "", "", "SEARCH :", typesearch]
        : ["TYPE :", typestatus, ""]
    );


    typeAndStoreRow2.eachCell((cell, colIndex) => {
      cell.font = {
        name: "CustomFont" || "CustomFont",
        size: 10,
        bold: [1, 4].includes(colIndex),
      };
      cell.alignment = { horizontal: "left", vertical: "middle" };
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
      "Date",
      "Trn#",
      "Type",
      "Store",
      "Description",
      "Customer",
      // "Mobile",
      "Rate",
      "Qnty",
      "Amount",
    ];
    const headerRow = worksheet.addRow(headers);
    headerRow.eachCell((cell) => Object.assign(cell, headerStyle));

    // Add data rows
    tableData.forEach((item) => {
      const row = worksheet.addRow([
        item.Date,
        item["Trn #"],
        item.Type,
        item.Str,
        item.Description,
        item.Supplier,
        // item.Mobile,
        item.Rate,
        item.Qnty,
        item["Pur Amount"],
      ]);

      // Check if quantity is negative (parse as float)
      const isNegativeQty = parseFloat(item.Qnty) < 0;

      row.eachCell((cell, colIndex) => {
        // Apply red font to ALL cells if Qnty is negative
        cell.font = {
          ...fontTableContent,
          color: isNegativeQty ? { argb: 'FFFF0000' } : fontTableContent.color,
        };

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

    // Set column widths
    [11, 7, 5, 8, 45, 35, 12, 8, 13].forEach((width, index) => {
      worksheet.getColumn(index + 1).width = width;
    });

    const totalRow = worksheet.addRow([
      "",
      // "",
      "",
      "",
      "Total",
      "",
      "",
      "",
      String(totalQnty),
      String(totalAmount),
    ]);

    // total row added

    totalRow.eachCell((cell, colNumber) => {
      cell.font = { bold: true };
      cell.border = {
        top: { style: "thin" },
        left: { style: "thin" },
        bottom: { style: "thin" },
        right: { style: "thin" },
      };

      // Align only the "Total" text to the right
      if (colNumber === 8 || colNumber === 9) {
        cell.alignment = { horizontal: "right" };
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
    const dateTimeRow = worksheet.addRow([`DATE:   ${currentdate}  TIME:   ${currentTime}`]);
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
    saveAs(blob, `PurchaseReport From ${fromInputDate} To ${toInputDate}.xlsx`);
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
  //   width: "8%",
  // };
  // const secondColWidth = {
  //   width: "5.25%",
  // };
  // const thirdColWidth = {
  //   width: "4%",
  // };
  // const tenthColWidth = {
  //   width: "5%",
  // };
  // const forthColWidth = {
  //   width: "28%",
  // };
  // const fifthColWidth = {
  //   width: "28%",
  // };

  // const seventhColWidth = {
  //   width: "8%",
  // };
  // const eighthColWidth = {
  //   width: "5%",
  // };
  // const ninthColWidth = {
  //   width: "9%",
  // };


  const firstColWidth = {
    width: "80px",
  };
  const secondColWidth = {
    width: "55px",
  };
  const thirdColWidth = {
    width: "38px",
  };
  const tenthColWidth = {
    width: "24px",
  };
  const forthColWidth = {
    width: "330px",
  };
  const fifthColWidth = {
    width: "240px",
  };

  const seventhColWidth = {
    width: "70px",
  };
  const eighthColWidth = {
    width: "50px",
  };
  const ninthColWidth = {
    width: "80px",
  };

  const sixthcol = { width: "13px" };

  useHotkeys("alt+s", () => {
    fetchDailySaleReport();
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

  const [menuStoreIsOpen, setMenuStoreIsOpen] = useState(false);

  const focusNextElement = (currentRef, nextRef) => {
    if (currentRef.current && nextRef.current) {
      currentRef.current.focus();
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
      focusNextElement(toRef, storeRef);
    }
  };

  const handleStoreEnter = (e) => {
    if (e.key === "Enter" && !menuStoreIsOpen) {
      e.preventDefault();
      focusNextElement(storeRef, typeRef);
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
          <NavComponent textdata="Purchase Report" />

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
                        fontSize: getdatafontsize,
                        fontFamily: getfontstyle,
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

              {/* To Date */}
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

              {/* radio checks */}
              <div
                className="d-flex align-items-center"
                style={{ marginRight: "15px" }}
              >
                <div
                  style={{
                    display: "flex",
                    justifyContent: "evenly",
                  }}
                >
                  <div className="d-flex align-items-baseline mx-1">
                    <input
                      type="radio"
                      name="dateRange"
                      id="custom"
                      checked={selectedRadio === "custom"}
                      onChange={() => handleRadioChange(0)}
                      onFocus={(e) =>
                        (e.currentTarget.style.border = "2px solid red")
                      }
                      onBlur={(e) =>
                        (e.currentTarget.style.border = `1px solid ${fontcolor}`)
                      }
                    />
                    &nbsp;
                    <label
                      htmlFor="custom"
                      style={{
                        fontSize: getdatafontsize,
                        fontFamily: getfontstyle,
                      }}
                    >
                      Custom
                    </label>
                  </div>
                  <div className="d-flex align-items-baseline mx-1">
                    <input
                      type="radio"
                      name="dateRange"
                      id="30"
                      checked={selectedRadio === "30days"}
                      onChange={() => handleRadioChange(30)}
                      onFocus={(e) =>
                        (e.currentTarget.style.border = "2px solid red")
                      }
                      onBlur={(e) =>
                        (e.currentTarget.style.border = `1px solid ${fontcolor}`)
                      }
                    />
                    &nbsp;
                    <label
                      htmlFor="30"
                      style={{
                        fontSize: getdatafontsize,
                        fontFamily: getfontstyle,
                      }}
                    >
                      30 Days
                    </label>
                  </div>
                  <div className="d-flex align-items-baseline mx-1">
                    <input
                      type="radio"
                      name="dateRange"
                      id="60"
                      checked={selectedRadio === "60days"}
                      onChange={() => handleRadioChange(60)}
                      onFocus={(e) =>
                        (e.currentTarget.style.border = "2px solid red")
                      }
                      onBlur={(e) =>
                        (e.currentTarget.style.border = `1px solid ${fontcolor}`)
                      }
                    />
                    &nbsp;
                    <label
                      htmlFor="60"
                      style={{
                        fontSize: getdatafontsize,
                        fontFamily: getfontstyle,
                      }}
                    >
                      60 Days
                    </label>
                  </div>
                  <div className="d-flex align-items-baseline mx-1">
                    <input
                      type="radio"
                      name="dateRange"
                      id="90"
                      checked={selectedRadio === "90days"}
                      onChange={() => handleRadioChange(90)}
                      onFocus={(e) =>
                        (e.currentTarget.style.border = "2px solid red")
                      }
                      onBlur={(e) =>
                        (e.currentTarget.style.border = `1px solid ${fontcolor}`)
                      }
                    />
                    &nbsp;
                    <label
                      htmlFor="90"
                      style={{
                        fontSize: getdatafontsize,
                        fontFamily: getfontstyle,
                      }}
                    >
                      90 Days
                    </label>
                  </div>
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
              {/* Store Select */}
              <div
                className="d-flex align-items-center"
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
                    <span
                      style={{
                        fontSize: getdatafontsize,
                        fontFamily: getfontstyle,
                        fontWeight: "bold",
                      }}
                    >
                      Store :&nbsp;
                    </span>{" "}
                    <br />
                  </label>
                </div>
                <div>
                  <Select
                    className="List-select-class "
                    ref={storeRef}
                    options={optionStore}
                    onKeyDown={handleStoreEnter}
                    id="selectedsale"
                    onChange={(selectedOption) => {
                      if (selectedOption && selectedOption.value) {
                        const labelPart = selectedOption.label.split("-")[1];
                        setStoreType(selectedOption.value);
                        setCompanyselectdatavalue({
                          value: selectedOption.value,
                          label: labelPart, // Set only the 'NGS' part of the label
                        });
                      } else {
                        setStoreType(""); // Clear the saleType state when selectedOption is null (i.e., when the selection is cleared)
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
                      ...customStyles1(),
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
                    menuIsOpen={menuStoreIsOpen}
                    onMenuOpen={() => setMenuStoreIsOpen(true)}
                    onMenuClose={() => setMenuStoreIsOpen(false)}
                  />
                </div>
              </div>

              <div></div>
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
              {/* Type */}
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
                  <label htmlFor="transactionType">
                    <span
                      style={{
                        fontSize: getdatafontsize,
                        fontFamily: getfontstyle,
                        fontWeight: "bold",
                      }}
                    >
                      Type :&nbsp;
                    </span>
                  </label>
                </div>
                <select
                  ref={typeRef}
                  onKeyDown={handleTypeEnter}
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
                    // marginLeft: "15px",
                    backgroundColor: getcolor,
                    border: `1px solid ${fontcolor}`,
                    fontSize: getdatafontsize,
                    fontFamily: getfontstyle,
                    color: fontcolor,
                    paddingLeft: '7px'
                  }}
                >
                  <option value="">ALL</option>
                  <option value="BIL">PURCHASE</option>
                  <option value="PRN">PURCHASE RETURN</option>
                </select>
              </div>

              {/* Search */}


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
                    ref={searchRef}
                    onKeyDown={handleSearchEnter}
                    type="text"
                    id="searchsubmit"
                    placeholder="Item description"
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
                      Date
                    </td>
                    <td className="border-dark" style={secondColWidth}>
                      Trn#
                    </td>
                    <td className="border-dark" style={thirdColWidth}>
                      Typ
                    </td>
                    <td className="border-dark" style={tenthColWidth}>
                      Str
                    </td>
                    <td className="border-dark" style={forthColWidth}>
                      Description
                    </td>
                    <td className="border-dark" style={fifthColWidth}>
                      Supplier
                    </td>
                    {/* <td className="border-dark" style={sixthColWidth}>
                      Mobile
                    </td> */}
                    <td className="border-dark" style={seventhColWidth}>
                      Rate
                    </td>
                    <td className="border-dark" style={eighthColWidth}>
                      Qnty
                    </td>
                    <td className="border-dark" style={ninthColWidth}>
                      Amount
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
            {/* Table Body */}
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
                  // tableLayout: 'fixed'
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
                        <td style={tenthColWidth}></td>
                        <td style={forthColWidth}></td>
                        <td style={fifthColWidth}></td>
                        {/* <td style={sixthColWidth}></td> */}
                        <td style={seventhColWidth}></td>
                        <td style={eighthColWidth}></td>
                        <td style={ninthColWidth}></td>
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
                              color:
                                item.Qnty?.[0] === "-"
                                  ? "red"
                                  : fontcolor,
                            }}
                          >
                            <td className="text-start" style={firstColWidth}>
                              {item.Date}
                            </td>
                            <td className="text-start" style={secondColWidth}>
                              {item["Trn #"]}
                            </td>
                            <td className="text-center" style={thirdColWidth}>
                              {item.Type}
                            </td>
                            <td className="text-center" style={tenthColWidth}>
                              {item.Str}
                            </td>
                            <td
                              className="text-start"
                              title={item.Description}
                              style={{
                                ...forthColWidth,
                                whiteSpace: "nowrap",
                                overflow: "hidden",
                                textOverflow: "ellipsis",
                              }}
                            >
                              {item.Description}
                            </td>
                            <td
                              className="text-start"
                              title={item.Supplier}
                              style={{
                                ...fifthColWidth,
                                whiteSpace: "nowrap",
                                overflow: "hidden",
                                textOverflow: "ellipsis",
                              }}
                            >
                              {item.Supplier}
                            </td>
                            {/* <td className="text-end" style={sixthColWidth}>
                              {item.Mobile}
                            </td> */}
                            <td
                              className="text-end"
                              title={item.Rate}
                              style={{
                                ...seventhColWidth,
                                whiteSpace: "nowrap",
                                overflow: "hidden",
                                textOverflow: "ellipsis",
                              }}
                            >
                              {item.Rate}
                            </td>
                            <td
                              className="text-end"
                              title={item.Qnty}
                              style={{
                                ...eighthColWidth,
                                whiteSpace: "nowrap",
                                overflow: "hidden",
                                textOverflow: "ellipsis",
                              }}
                            >
                              {item.Qnty}
                            </td>
                            <td className="text-end" style={ninthColWidth}>
                              {item["Pur Amount"]}
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
                        <td style={tenthColWidth}></td>
                        <td style={forthColWidth}></td>
                        <td style={fifthColWidth}></td>
                        {/* <td style={sixthColWidth}></td> */}
                        <td style={seventhColWidth}></td>
                        <td style={eighthColWidth}></td>
                        <td style={ninthColWidth}></td>
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
              paddingRight: "13px",
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
            {/* <div
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
            <div
              style={{
                ...eighthColWidth,
                background: getcolor,
                borderRight: `1px solid ${fontcolor}`,
              }}
            >
              <span className="mobileledger_total">{totalQnty}</span>
            </div>
            <div
              style={{
                ...ninthColWidth,
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
              onClick={fetchDailySaleReport}
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