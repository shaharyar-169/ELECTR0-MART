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
import { Balance, Description, Store } from "@mui/icons-material";
import '../../../vardana/vardana';
import '../../../vardana/verdana-bold'


export default function ProductionOrderStatusReport() {
  const navigate = useNavigate();
  const user = getUserData();
  const organisation = getOrganisationData();
  const [tableData, setTableData] = useState([]);
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

  const [totalQnty, settotalQnty] = useState(0);
  const [totalRec, settotalRec] = useState(0);
  const [totalBalance, settotalBalance] = useState(0);


  const input1Ref = useRef(null);
  const input2Ref = useRef(null);
  const input3Ref = useRef(null);
  const input4Refrate = useRef(null);
  const input5Ref = useRef(null);
  const input4Ref = useRef(null);
  const input6Ref = useRef(null);

  const [Companyselectdata, setCompanyselectdata] = useState("");

  console.log("Companyselectdata", Companyselectdata);

  const [GetCapacity, setGetCapacity] = useState([]);
  const [GetCompany, setGetCompany] = useState([]);


  const [GetCategory, setGetCategory] = useState([]);




  const [GetType, setGetType] = useState([]);

  const [sortData, setSortData] = useState("ASC");

  const [searchQuery, setSearchQuery] = useState("");
  const [transectionType, settransectionType] = useState("");
  const [transectionType2, settransectionType2] = useState("");

  const [totalqnty, settotalqnty] = useState(0);
  const [totalopening, settotalopening] = useState(0);
  const [ClosingBalance, setClosingBalance] = useState(0);
  const [totaltax, settotaltax] = useState(0);
  const [totalincl, settotalincl] = useState(0);

  const [totaldebit, settotaldebit] = useState(0);
  const [totalcredit, settotalcredit] = useState(0);

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

  const handlefromInputChange = (e) => {
    setfromInputDate(e.target.value);
  };

  const handlefromKeyPress = (e, inputId) => {
    if (e.key === "Enter") {
      e.preventDefault();
      const fromDateElement = document.getElementById("fromdatevalidation");
      const formattedInput = fromInputDate.replace(
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

        if (GlobalfromDate && enteredDate < GlobalfromDate) {
          toast.error(
            `Date must be after ${GlobalfromDate1} and before ${GlobaltoDate1}`
          );
          return;
        }
        if (GlobalfromDate && enteredDate > GlobaltoDate) {
          toast.error(
            `Date must be after ${GlobalfromDate1} and before ${GlobaltoDate1}`
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

  function fetchDailyStatusReport() {
    const fromDateElement = document.getElementById("fromdatevalidation");
    const toDateElement = document.getElementById("todatevalidation");

    const dateRegex = /^\d{2}-\d{2}-\d{4}$/;

    let hasError = false;
    let errorType = "";

    switch (true) {
      //    case !saleType:
      //        errorType = "saleType";
      //        break;
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
      case "saleType":
        toast.error("Please select a Account Code");
        return;

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

    // console.log(data);
    document.getElementById(
      "fromdatevalidation"
    ).style.border = `1px solid ${fontcolor}`;
    document.getElementById(
      "todatevalidation"
    ).style.border = `1px solid ${fontcolor}`;

    const apiUrl = apiLinks + "/ProductionOrderStatusReport.php";
    setIsLoading(true);
    const formData = new URLSearchParams({
      FIntDat: fromInputDate,
      FFnlDat: toInputDate,
      FTrnSts: transectionType,
       code: organisation.code,
      FLocCod: locationnumber || getLocationNumber,
      FYerDsc: yeardescription || getyeardescription,
      // code: "AGFACTORY",
      // FLocCod: "001",
      // FYerDsc: "2025-2025",
    }).toString();

    axios
      .post(apiUrl, formData)
      .then((response) => {
        setIsLoading(false);

        settotalQnty(response.data["Total Order Qnty"])
        settotalRec(response.data["Total Receive Qnty"])
        settotalBalance(response.data["Total Balance Qnty"])

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


  const filteredData = tableData.filter((item) => {
    const query = searchQuery.toUpperCase();

    return (
      item.PRDNo?.toUpperCase().includes(query) ||
      item.titmdsc?.toUpperCase().includes(query) ||
      item.UOM?.toUpperCase().includes(query)
    );
  });

  const totalTbalqnt = filteredData.reduce((sum, item) => {
    return sum + (Number(item.tbalqnt) || 0);
  }, 0);



  // const exportPDFHandler = () => {
  //   // Create a new jsPDF instance with landscape orientation
  //   const doc = new jsPDF({
  //     orientation: "landscape",
  //     unit: "mm",
  //     format: "a4"
  //   });

  //   // Define table data (rows)
  //   const rows = filteredData.map((item) => [
  //     item.PRDNo,
  //     item.Date,
  //     item.titmdsc,
  //     item.UOM,
  //     item.tpurrat,
  //     item.DueDate,
  //     item.ttrnamt,
  //     item.tprdqnt,
  //     item.trecqnt,
  //     item.tbalqnt,

  //   ]);

  //   // Add summary row to the table
  //   rows.push([

  //     String(formatValue(tableData.length.toLocaleString())),
  //     "",
  //     "",
  //     "",
  //     "",
  //     "",
  //     "",
  //     String(formatValue(totalQnty)),
  //     String(formatValue(totalRec)),
  //     String(formatValue(totalBalance)),

  //   ]);

  //   // Define table column headers and individual column widths

  //   const headers = [
  //     "PRD NO",
  //     "Date",
  //     "Item",
  //     "UOM",
  //     "Purchase",
  //     "Due Date",
  //     "Amount",
  //     "Prd Qty",
  //     "Rec Qty",
  //     "Bal Qty",
  //   ];

  //   let columnWidths = [22, 30, 85, 13, 25, 30, 25, 25, 25, 25];

  //   // 🔥 FIX: Scale widths to fit page perfectly
  //   const pageWidth = doc.internal.pageSize.width;
  //   const sideMargin = 10;

  //   // 🔥 IMPORTANT: add -2 safety gap
  //   const printableWidth = pageWidth - sideMargin * 2 - 2;

  //   const originalTotalWidth = columnWidths.reduce((a, b) => a + b, 0);
  //   const scaleFactor = printableWidth / originalTotalWidth;

  //   columnWidths = columnWidths.map((w) => w * scaleFactor);

  //   const totalWidth = columnWidths.reduce((acc, width) => acc + width, 0);



  //   // Define page height and padding
  //   const pageHeight = doc.internal.pageSize.height;
  //   const paddingTop = 15;

  //   // Set font properties for the table
  //   // doc.setFont("verdana-regular", "normal");
  //   // doc.setFontSize(10);

  //   // Function to add table headers
  //   const addTableHeaders = (startX, startY) => {
  //     // Set font style and size for headers
  //     doc.setFont("verdana", "bold"); // Set font to bold
  //     doc.setFontSize(10); // Set font size for headers

  //     headers.forEach((header, index) => {
  //       const cellWidth = columnWidths[index];
  //       const cellHeight = 6; // Height of the header row
  //       const cellX = startX + cellWidth / 2; // Center the text horizontally
  //       const cellY = startY + cellHeight / 2 + 1.5; // Center the text vertically

  //       // Draw the grey background for the header
  //       doc.setFillColor(200, 200, 200); // Grey color
  //       doc.rect(startX, startY, cellWidth, cellHeight, "F"); // Fill the rectangle

  //       // Draw the outer border
  //       doc.setLineWidth(0.2); // Set the width of the outer border
  //       doc.rect(startX, startY, cellWidth, cellHeight);

  //       // Set text alignment to center
  //       doc.setTextColor(0); // Set text color to black
  //       doc.text(header, cellX, cellY, { align: "center" }); // Center the text
  //       startX += columnWidths[index]; // Move to the next column
  //     });


  //   };


  //   const addTableRows = (startX, startY, startIndex, endIndex) => {
  //     const lineHeight = 4;
  //     const tableWidth = getTotalTableWidth();
  //     const pageHeight = doc.internal.pageSize.height;

  //     const footerReserve = 30;

  //     let currentY = startY;

  //     for (let i = startIndex; i < endIndex; i++) {
  //       let row = [...rows[i]];

  //       const isOddRow = i % 2 !== 0;
  //       const isRedRow = row[0] && parseInt(row[0]) > 10000000000;
  //       const isTotalRow = i === rows.length - 1;

  //       let textColor = [0, 0, 0];

  //       if (isRedRow) {
  //         textColor = [255, 0, 0];
  //       }

  //       // ✅ SMART WRAP FIX
  //       const splitRow = row.map((cell, idx) => {
  //         const text = String(cell).trim();
  //         const maxWidth = columnWidths[idx] - 4;

  //         const textWidth =
  //           (doc.getStringUnitWidth(text) * doc.internal.getFontSize()) /
  //           doc.internal.scaleFactor;

  //         if (textWidth <= maxWidth) {
  //           return [text];
  //         }

  //         return doc.splitTextToSize(text, maxWidth);
  //       });

  //       const maxLines = Math.max(...splitRow.map((c) => c.length));
  //       const rowHeight = maxLines * lineHeight + 2;

  //       // 🔥 PAGE BREAK CHECK
  //       if (currentY + rowHeight > pageHeight - footerReserve) {
  //         // footer
  //         const lineWidth = tableWidth;
  //         const lineX = (doc.internal.pageSize.width - tableWidth) / 2;
  //         const lineY = pageHeight - 15;

  //         doc.setLineWidth(0.3);
  //         doc.line(lineX, lineY, lineX + lineWidth, lineY);

  //         const headingX = lineX + 2;
  //         const headingY = lineY + 5;

  //         doc.setFont("verdana-regular", "normal");
  //         doc.setFontSize(10);
  //         doc.text(`Crystal Solution    ${date}    ${time}`, headingX, headingY);

  //         // 🔥 FIX: total row ko next page pe force render
  //         if (isTotalRow) {
  //           doc.addPage();
  //           currentY = paddingTop;
  //           i--; // 🔥 reprocess same row
  //           continue;
  //         }

  //         return {
  //           startX,
  //           startY: currentY,
  //           breakPage: true,
  //         };
  //       }

  //       // row background
  //       if (isOddRow) {
  //         doc.setFillColor(240);
  //         doc.rect(startX, currentY, tableWidth, rowHeight, "F");
  //       }

  //       doc.setDrawColor(0);

  //       // total row styling
  //       if (isTotalRow) {
  //         const topY = currentY;
  //         const bottomY = currentY + rowHeight;

  //         doc.setFont("verdana", "bold");

  //         doc.setLineWidth(0.3);
  //         doc.line(startX, topY, startX + tableWidth, topY);
  //         doc.line(startX, topY + 0.5, startX + tableWidth, topY + 0.5);

  //         doc.line(startX, bottomY, startX + tableWidth, bottomY);
  //         doc.line(startX, bottomY - 0.5, startX + tableWidth, bottomY - 0.5);

  //         doc.setLineWidth(0.2);
  //         doc.line(startX, topY, startX, bottomY);
  //         doc.line(startX + tableWidth, topY, startX + tableWidth, bottomY);
  //       } else {
  //         doc.setLineWidth(0.2);
  //         doc.rect(startX, currentY, tableWidth, rowHeight);
  //         doc.setFont("verdana-regular", "normal");
  //       }

  //       let currentX = startX;

  //       splitRow.forEach((textArray, cellIndex) => {
  //         const cellWidth = columnWidths[cellIndex];

  //         doc.setTextColor(...textColor);
  //         doc.setFontSize(10);

  //         const textY =
  //           currentY +
  //           (rowHeight - textArray.length * lineHeight) / 2 +
  //           lineHeight - 1;

  //         if (cellIndex > 2) {
  //           doc.text(textArray, currentX + cellWidth - 2, textY, {
  //             align: "right",
  //           });
  //         } else {
  //           doc.text(textArray, currentX + 2, textY);
  //         }

  //         if (cellIndex < splitRow.length - 1) {
  //           doc.line(
  //             currentX + cellWidth,
  //             currentY,
  //             currentX + cellWidth,
  //             currentY + rowHeight
  //           );
  //         }

  //         currentX += cellWidth;
  //       });

  //       currentY += rowHeight;

  //       if (isTotalRow) {
  //         doc.setFont("verdana-regular", "normal");
  //       }
  //     }

  //     // 🔥 LAST PAGE FOOTER
  //     const lineWidth = tableWidth;
  //     const lineX = (doc.internal.pageSize.width - tableWidth) / 2;
  //     const lineY = pageHeight - 15;

  //     doc.setLineWidth(0.3);
  //     doc.line(lineX, lineY, lineX + lineWidth, lineY);

  //     const headingX = lineX + 2;
  //     const headingY = lineY + 5;

  //     doc.setFont("verdana-regular", "normal");
  //     doc.setFontSize(10);
  //     doc.text(`Crystal Solution    ${date}    ${time}`, headingX, headingY);

  //     return {
  //       startX,
  //       startY: currentY,
  //       breakPage: false,
  //     };
  //   };

  //   const getTotalTableWidth = () => {
  //     let totalWidth = 0;
  //     columnWidths.forEach((width) => (totalWidth += width));
  //     return totalWidth;
  //   };

  //   // Function to add a new page and reset startY
  //   const addNewPage = (startY) => {
  //     doc.addPage();
  //     return paddingTop; // Set startY for each new page
  //   };

  //   // Define the number of rows per page
  //   const rowsPerPage = 29; // Adjust this value based on your requirements

  //   // Function to handle pagination
  //   const handlePagination = () => {
  //     // Define the addTitle function
  //     const addTitle = (
  //       title,
  //       date,
  //       time,
  //       pageNumber,
  //       startY,
  //       titleFontSize = 18,
  //       pageNumberFontSize = 10
  //     ) => {
  //       doc.setFontSize(titleFontSize); // Set the font size for the title
  //       doc.text(title, doc.internal.pageSize.width / 2, startY, {
  //         align: "center",
  //       });

  //       // Calculate the x-coordinate for the right corner
  //       const rightX = doc.internal.pageSize.width - 10;


  //       // Add page numbering
  //       doc.setFont("verdana-regular", "normal");
  //       doc.setFontSize(10);
  //       doc.text(
  //         `Page ${pageNumber}`,
  //         rightX - 5,
  //         doc.internal.pageSize.height - 10,
  //         { align: "right" }
  //       );
  //     };

  //     let currentPageIndex = 0;
  //     let startY = paddingTop; // Initialize startY
  //     let pageNumber = 1; // Initialize page number

  //     while (currentPageIndex * rowsPerPage < rows.length) {

  //       doc.setFontSize(10);
  //       doc.setFont('helvetica', "300");
  //       addTitle(comapnyname, 12, 12, pageNumber, startY, 18); // Render company title with default font size, only date, and page number
  //       startY += 5; // Adjust vertical position for the company title

  //       doc.setFont('verdana-regular', "normal");
  //       doc.setFontSize(10);
  //       addTitle(
  //         `Production Order Status Report From ${fromInputDate} To ${toInputDate}`,
  //         "",
  //         "",
  //         pageNumber,
  //         startY,
  //         12
  //       ); // Render sale report title with decreased font size, provide the time, and page number
  //       startY += 5;

  //       const labelsX = (doc.internal.pageSize.width - totalWidth) / 2;
  //       const labelsY = startY + 4; // Position the labels below the titles and above the table

  //       // Set font size and weight for the labels
  //       let statuOption =
  //         transectionType === "P"
  //           ? "PENDING"
  //           : transectionType === "C"
  //             ? "COMPLETED"
  //             : "ALL";


  //       let search = searchQuery ? searchQuery : "";


  //       doc.setFont("verdana", "bold");
  //       doc.setFontSize(10);
  //       doc.text(`Status :`, labelsX, labelsY); // Draw bold label
  //       doc.setFont("verdana-regular", "normal");
  //       doc.setFontSize(10);
  //       doc.text(`${statuOption}`, labelsX + 20, labelsY); // Draw the value next to the label


  //       if (searchQuery) {
  //         doc.setFont("verdana", "bold");
  //         doc.setFontSize(10);
  //         doc.text(`Search :`, labelsX + 180, labelsY); // Draw bold label
  //         doc.setFont("verdana-regular", "normal");
  //         doc.setFontSize(10);
  //         doc.text(`${search}`, labelsX + 205, labelsY); // Draw the value next to the label
  //       }

  //       // // Reset font weight to normal if necessary for subsequent text


  //       startY += 13; // Adjust vertical position for the labels

  //       addTableHeaders(Math.floor((doc.internal.pageSize.width - totalWidth) / 2), 32);
  //       const startIndex = currentPageIndex * rowsPerPage;
  //       const endIndex = Math.min(startIndex + rowsPerPage, rows.length);
  //       startY = addTableRows(
  //         Math.floor((doc.internal.pageSize.width - totalWidth) / 2),
  //         startY,
  //         startIndex,
  //         endIndex
  //       );
  //       if (endIndex < rows.length) {
  //         startY = addNewPage(startY); // Add new page and update startY
  //         pageNumber++; // Increment page number
  //       }
  //       currentPageIndex++;
  //     }
  //   };

  //   const getCurrentDate = () => {
  //     const today = new Date();
  //     const dd = String(today.getDate()).padStart(2, "0");
  //     const mm = String(today.getMonth() + 1).padStart(2, "0");
  //     const yyyy = today.getFullYear();
  //     return `${dd}-${mm}-${yyyy}`;
  //   };

  //   // Function to get current time in the format HH:MM:SS
  //   const getCurrentTime = () => {
  //     const today = new Date();
  //     const hh = String(today.getHours()).padStart(2, "0");
  //     const mm = String(today.getMinutes()).padStart(2, "0");
  //     const ss = String(today.getSeconds()).padStart(2, "0");
  //     return hh + ":" + mm + ":" + ss;
  //   };

  //   const date = getCurrentDate(); // Get current date
  //   const time = getCurrentTime(); // Get current time

  //   // Call function to handle pagination
  //   handlePagination();

  //   // Save the PDF files
  //   doc.save(`ProductionOrderstatusReport As On ${date}.pdf`);
  // };

const exportPDFHandler = () => {
  // ─── 1. PAGE SETUP & DATE/TIME ─────────────────────────────
  const doc = new jsPDF({
    orientation: "landscape",
    unit: "mm",
    format: "a4",
  });

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
  const rows = filteredData.map((item) => [
    item.PRDNo,
    item.Date,
    item.titmdsc,
    item.UOM,
    item.tpurrat,
    item.DueDate,
    item.ttrnamt,
    item.tprdqnt,
    item.trecqnt,
    item.tbalqnt,
  ]);

  rows.push([
    String(formatValue(tableData.length.toLocaleString())),
    "",
    "",
    "",
    "",
    "",
    "",
    String(formatValue(totalQnty)),
    String(formatValue(totalRec)),
    String(formatValue(totalBalance)),
  ]);

  // ─── 3. HEADERS & COLUMN WIDTHS ────────────────────────────
  const headers = [
    "PRD NO",
    "Date",
    "Item",
    "UOM",
    "Purchase",
    "Due Date",
    "Amount",
    "Prd Qty",
    "Rec Qty",
    "Bal Qty",
  ];

  let columnWidths = [22, 30, 85, 13, 25, 30, 30, 25, 25, 25];

  const pageWidth = doc.internal.pageSize.width;
  const sideMargin = 10;
  const printableWidth = pageWidth - sideMargin * 2 - 2;
  const originalTotalWidth = columnWidths.reduce((a, b) => a + b, 0);
  const scaleFactor = printableWidth / originalTotalWidth;
  columnWidths = columnWidths.map((w) => w * scaleFactor);
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

  // ─── 5. DRAW HEADERS ────────────────────────────────────────
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

  // ─── 7. DRAW A SINGLE ROW ──────────────────────────────────
  const drawRow = (startX, startY, rowIndex, rowData, isTotalRow) => {
    const lineHeight = 4;
    const tableWidth = getTotalTableWidth();
    const textColor = [0, 0, 0];

    const splitRow = rowData.map((cell, idx) => {
      const text = String(cell).trim();
      // 🔥 NOW UOM (index 3) is also prevented from wrapping
      const noWrapColumns = [0, 1, 3, 4, 5, 6];
      if (noWrapColumns.includes(idx)) return [text];
      const maxWidth = columnWidths[idx] - 4;
      const textWidth =
        (doc.getStringUnitWidth(text) * doc.internal.getFontSize()) /
        doc.internal.scaleFactor;
      if (textWidth <= maxWidth) return [text];
      return doc.splitTextToSize(text, maxWidth);
    });

    const maxLines = Math.max(...splitRow.map((c) => c.length));
    const rowHeight = maxLines * lineHeight + 2;

    if (rowIndex % 2 !== 0 && !isTotalRow) {
      doc.setFillColor(240);
      doc.rect(startX, startY, tableWidth, rowHeight, "F");
    }
    doc.setDrawColor(0);

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

    let currentX = startX;
    splitRow.forEach((textArray, cellIndex) => {
      const cellWidth = columnWidths[cellIndex];
      doc.setTextColor(...textColor);
      doc.setFontSize(10);
      const textY =
        startY + (rowHeight - textArray.length * lineHeight) / 2 + lineHeight - 1;

      let align = "left";
      if (cellIndex === 0 || cellIndex === 1 || cellIndex === 3|| cellIndex === 5) {
        align = "center";
      } else if (cellIndex > 2 && cellIndex !== 5) {
        align = "right";
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

    doc.setFontSize(10);
    doc.setFont("helvetica", "300");
    addTitle(comapnyname, startY, 18);
    startY += 5;

    doc.setFont("verdana-regular", "normal");
    doc.setFontSize(10);
    addTitle(
      `Production Order Status Report From ${fromInputDate} To ${toInputDate}`,
      startY,
      12
    );
    startY += 5;

    const labelsX = (doc.internal.pageSize.width - totalWidth) / 2;
    const labelsY = startY + 4;

    let statuOption =
      transectionType === "P"
        ? "PENDING"
        : transectionType === "C"
        ? "COMPLETED"
        : "ALL";
    let search = searchQuery ? searchQuery : "";

    doc.setFont("verdana", "bold");
    doc.setFontSize(10);
    doc.text(`Status :`, labelsX, labelsY);
    doc.setFont("verdana-regular", "normal");
    doc.text(`${statuOption}`, labelsX + 20, labelsY);

    if (searchQuery) {
      doc.setFont("verdana", "bold");
      doc.text(`Search :`, labelsX + 180, labelsY);
      doc.setFont("verdana-regular", "normal");
      doc.text(`${search}`, labelsX + 205, labelsY);
    }

    startY += 13;

    const headersStartY = 32;
    addTableHeaders(Math.floor((doc.internal.pageSize.width - totalWidth) / 2), headersStartY);

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
      const tableStartX = Math.floor((doc.internal.pageSize.width - totalWidth) / 2);

      while (rowIndex < rows.length) {
        const row = rows[rowIndex];
        const isTotalRow = rowIndex === rows.length - 1;

        // Estimate row height using the Description column (index 2)
        const descText = String(row[2]);
        const maxWidth = columnWidths[2] - 4;
        const descLines = doc.splitTextToSize(descText, maxWidth);
        const lineCount = Math.max(1, descLines.length);
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
    const measureDoc = new jsPDF({
      orientation: "landscape",
      unit: "mm",
      format: "a4",
    });
    measureDoc.setFont("verdana-regular", "normal");
    measureDoc.setFontSize(10);

    const measureRows = [...rows];
    const measureColumnWidths = [...columnWidths];
    const measurePageHeight = measureDoc.internal.pageSize.height;
    const measureFooterReserve = 18;
    const lineHeight = 4;

    const measureDrawRow = (startY, rowIndex, rowData) => {
      const splitRow = rowData.map((cell, idx) => {
        const text = String(cell).trim();
        // Same no‑wrap list for the dry run
        const noWrap = [0, 1, 3, 4, 5, 6];
        if (noWrap.includes(idx)) return [text];
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
  doc.save(`ProductionOrderstatusReport As On ${date}.pdf`);
};

  const handleDownloadCSV = async () => {
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet("Sheet1");

    const numColumns = 10; // Ensure this matches the actual number of columns

    const columnAlignments = [
      "center",
      "center",
      "left",
      "center",
      "right",
      "center",
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
    // Add company name
    const companyRow = worksheet.addRow([comapnyname]);

    companyRow.eachCell((cell) => {
      cell.font = {
        name: "Times New Roman",
        size: 16,       // optional
        bold: true,     // optional
      };
      cell.alignment = { horizontal: "center" };
    });


    worksheet.getRow(companyRow.number).height = 30;
    worksheet.mergeCells(
      `A${companyRow.number}:${String.fromCharCode(65 + numColumns - 1)}${companyRow.number
      }`
    );

    // Add Store List row
    const storeListRow = worksheet.addRow([
      `Producton Order Status Report From ${fromInputDate} To ${toInputDate}`,
    ]);
    storeListRow.eachCell((cell) => {
      cell.font = fontStoreList;
      cell.alignment = { horizontal: "center" };
    });

    worksheet.mergeCells(
      `A${storeListRow.number}:${String.fromCharCode(65 + numColumns - 1)}${storeListRow.number
      }`
    );

    // Add an empty row after the title section
    worksheet.addRow([]);

    // Filter data
    let typestatus =
      transectionType === "P" ? "PENDING" :
        transectionType === "C" ? "COMPLETED" : "ALL";
    let typesearch = searchQuery || "";

    const typeAndStoreRow3 = worksheet.addRow(
      searchQuery ? ["Status :", typestatus, "", "", "", "", "Search :", typesearch] : ["Status: ", typestatus]
    );

    typeAndStoreRow3.eachCell((cell, colIndex) => {
      cell.font = { name: "CustomFont", size: 10, bold: [1, 7].includes(colIndex) };
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

    // Add headers
    const headers = [
      "PRD NO",
      "Date",
      "Item",
      "UOM",
      "Purchase",
      "Due Date",
      "Amount",
      "Prd Qty",
      "Rec Qty",
      "Bal Qty",
    ];
    const headerRow = worksheet.addRow(headers);
    headerRow.eachCell((cell) => Object.assign(cell, headerStyle));

    // Add data rows
    filteredData.forEach((item) => {
      const row = worksheet.addRow([
        item.PRDNo,
        item.Date,
        item.titmdsc,
        item.UOM,
        item.tpurrat,
        item.DueDate,
        item.ttrnamt,
        item.tprdqnt,
        item.trecqnt,
        item.tbalqnt,
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


    // =====================================================================
    // FINAL, RELIABLE DYNAMIC WIDTH FOR DESCRIPTION COLUMN
    // - Uses canvas with the font Excel will actually render (Calibri)
    // - Adds generous but not excessive padding (15px)
    // - Falls back to character-based width if canvas fails
    // - Disables text wrap to prevent hidden clipping
    // =====================================================================
    // Disable text wrap for column 2
    worksheet.getColumn(2).eachCell({ includeEmpty: true }, (cell) => {
      if (cell.alignment) cell.alignment.wrapText = false;
      else cell.alignment = { wrapText: false };
    });

    // Use Calibri 10pt – the most common fallback for 'CustomFont'
    const fontForMeasurement = "10px Calibri";
    const boldFontForMeasurement = "bold 10px Calibri";

    const getTextPixelWidth = (text, fontStyle) => {
      if (!text) return 0;
      const canvas = document.createElement("canvas");
      const context = canvas.getContext("2d");
      context.font = fontStyle;
      return context.measureText(text.toString()).width;
    };

    // Convert pixel width to Excel column width (1 unit ≈ 7 pixels for 10pt font)
    // Add 15px padding to account for Excel's internal cell margins
    const pixelsToExcelWidth = (pixels) => {
      const paddingPx = 15;
      const pixelsPerUnit = 7;
      return (pixels + paddingPx) / pixelsPerUnit;
    };

    // Find the longest pixel width among descriptions + header
    let maxPixels = getTextPixelWidth("Description", boldFontForMeasurement);
    let longestDescLength = "Description".length;

    filteredData.forEach((item) => {
      const desc = item.titmdsc ? item.titmdsc.toString() : "";
      const w = getTextPixelWidth(desc, fontForMeasurement);
      if (w > maxPixels) maxPixels = w;
      if (desc.length > longestDescLength) longestDescLength = desc.length;
    });

    let descriptionWidth = pixelsToExcelWidth(maxPixels);

    // Fallback: if canvas gives a width that is obviously too small (less than 0.8 units per character),
    // use character-based width with multiplier 1.1 (proven for Calibri 10pt)
    const minExpectedWidth = longestDescLength * 0.8;
    if (descriptionWidth < minExpectedWidth) {
      descriptionWidth = longestDescLength * 1.1 + 2; // 1.1 units per char + small safety
    }

    // No upper cap – allow column to be as wide as needed (Excel max is 255)
    descriptionWidth = Math.max(descriptionWidth, 45); // only minimum

    worksheet.getColumn(1).width = 8;
    worksheet.getColumn(2).width = 10;
    worksheet.getColumn(3).width = descriptionWidth;   // exactly fits the longest text
    worksheet.getColumn(4).width = 8;
    worksheet.getColumn(5).width = 12;
    worksheet.getColumn(6).width = 12;
    worksheet.getColumn(7).width = 12;
    worksheet.getColumn(8).width = 12;
    worksheet.getColumn(9).width = 12;
    worksheet.getColumn(10).width = 12;
    // =====================================================================

    const totalRow = worksheet.addRow([
      String(formatValue(filteredData.length.toLocaleString())),
      "",
      "",
      "",
      "",
      "",
      "",
      String(formatValue(totalQnty)),
      String(formatValue(totalRec)),
       String(formatValue(totalBalance)),


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
      if (colNumber === 1) {
        cell.alignment = { horizontal: "center" };
      }
      if (colNumber > 3) {
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
      `A${dateTimeRow.number}:${String.fromCharCode(65 + numColumns - 1)}${dateTimeRow.number
      }`
    );
    worksheet.mergeCells(
      `A${dateTimeRow1.number}:${String.fromCharCode(65 + numColumns - 1)}${dateTimeRow1.number
      }`
    );

    // Generate and save the Excel file
    const buffer = await workbook.xlsx.writeBuffer();
    const blob = new Blob([buffer], {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    });
    saveAs(blob, `ProductionOrderStatusReport As On ${currentdate}.xlsx`);
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

  const firstColWidth = {
    width: "70px",
  };
  const secondColWidth = {
    width: "80px",
  };
  const thirdColWidth = {
    width: isSidebarVisible ? "290px" : '380px',
  };
  const forthColWidth = {
    width: "50px",
  };
  const sixthColWidth = {
    width: isSidebarVisible ? "82px" : '100px',
  };
  const seventhColWidth = {
    width: "80px",
  };
  const eightColWidth = {
    width: isSidebarVisible ? "82px" : '100px',
  };
  const ninthColWidth = {
    width: isSidebarVisible ? "82px" : '100px',
  };
  const tenthColWidth = {
    width: isSidebarVisible ? "82px" : '100px',
  }; const elewenthColWidth = {
    width: isSidebarVisible ? "82px" : '100px',
  };

  const sixthcol = {
    width: "8px",
  };

  const [columns, setColumns] = useState({
    PRDNo: [],
    Date: [],
    titmdsc: [],
  });

  const [columnSortOrders, setColumnSortOrders] = useState({
    PRDNo: "",
    Date: "",
    titmdsc: "",
  });

  // When you receive your initial table data, transform it into column-oriented format
  useEffect(() => {
    if (tableData.length > 0) {
      const newColumns = {

        Date: tableData.map((row) => row.Date),
        PRDNo: tableData.map((row) => row.PRDNo),
        titmdsc: tableData.map((row) => row.titmdsc),

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
      PRDNo: null,
      Date: null,
      titmdsc: null,

    });
  };

  const handleSorting = (col) => {
    const currentOrder = columnSortOrders[col];
    const newOrder = currentOrder === "ASC" ? "DSC" : "ASC";

    const sortedData = [...tableData].sort((a, b) => {
      const aVal = a[col] != null ? a[col].toString().trim() : "";
      const bVal = b[col] != null ? b[col].toString().trim() : "";

      // Attempt numeric conversion
      const numA = Number(aVal.replace(/,/g, ""));
      const numB = Number(bVal.replace(/,/g, ""));

      // Check if numeric sorting is possible
      const bothNumeric =
        !isNaN(numA) && !isNaN(numB) && aVal !== "" && bVal !== "";

      if (bothNumeric) {
        return newOrder === "ASC" ? numA - numB : numB - numA;
      }

      // Alphabetical sorting as fallback
      return newOrder === "ASC"
        ? aVal.localeCompare(bVal)
        : bVal.localeCompare(aVal);
    });

    // Update table
    setTableData(sortedData);

    // Update column sort indicator
    setColumnSortOrders((prev) => {
      const updated = {};
      Object.keys(prev).forEach((key) => {
        updated[key] = key === col ? newOrder : null;
      });
      return updated;
    });
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
    maxWidth: isSidebarVisible ? "1000px" : '1200px',
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

  const [menuStoreIsOpen, setMenuStoreIsOpen] = useState(false);

  const focusNextElement = (currentRef, nextRef) => {
    if (currentRef.current && nextRef.current) {
      currentRef.current.focus();
      nextRef.current.focus();
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
      focusNextElement(toRef, saleSelectRef);
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
          <NavComponent textdata="Production Order Status Report" />

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
                style={{ marginLeft: "15px" }}
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
              <div
                className="d-flex align-items-center"

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
                      Status :
                    </span>
                  </label>
                </div>

                <div style={{ position: "relative", display: "inline-block" }}>
                  <select
                    ref={input1Ref}
                    onKeyDown={(e) => handleKeyPress(e, input2Ref)}
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
                    <option value="">ALL</option>
                    <option value="P">PENDING</option>
                    <option value="C">COMPLETED</option>
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

              <div id="lastDiv" >
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
                    ref={input2Ref}
                    onKeyDown={(e) => handleKeyPress(e, selectButtonRef)}
                    type="text"
                    id="searchsubmit"
                    placeholder="Search"
                    value={searchQuery}
                    autoComplete="off"
                    style={{
                      marginRight: "20px",
                      width: "150px",
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
                      style={firstColWidth}
                      onClick={() => handleSorting("PRDNo")}
                    >
                      PRD NO
                      {" "}
                      <i
                        className="fa-solid fa-caret-down caretIconStyle"
                        style={getIconStyle("PRDNo")}
                      ></i>
                    </td>
                    <td
                      className="border-dark"
                      style={secondColWidth}
                      onClick={() => handleSorting("Date")}
                    >
                      Date
                      {" "}
                      <i
                        className="fa-solid fa-caret-down caretIconStyle"
                        style={getIconStyle("Date")}
                      ></i>
                    </td>
                    <td
                      className="border-dark"
                      style={thirdColWidth}
                      onClick={() => handleSorting("titmdsc")}
                    >
                      Item
                      {" "}
                      <i
                        className="fa-solid fa-caret-down caretIconStyle"
                        style={getIconStyle("titmdsc")}
                      ></i>
                    </td>
                    <td
                      className="border-dark"
                      style={forthColWidth}
                    //   onClick={() => handleSorting("Debit")}
                    >
                      UOM
                      {/* {" "}
                      <i
                        className="fa-solid fa-caret-down caretIconStyle"
                        style={getIconStyle("Debit")}
                      ></i> */}
                    </td>

                    <td
                      className="border-dark"
                      style={sixthColWidth}
                    //   onClick={() => handleSorting("Credit")}
                    >
                      Purchase
                      {/* {" "}
                      <i
                        className="fa-solid fa-caret-down caretIconStyle"
                        style={getIconStyle("Credit")}
                      ></i> */}
                    </td>
                    <td
                      className="border-dark"
                      style={seventhColWidth}
                    //   onClick={() => handleSorting("Balance")}
                    >
                      Due Date
                      {/* {" "}
                      <i
                        className="fa-solid fa-caret-down caretIconStyle"
                        style={getIconStyle("Balance")}
                      ></i> */}
                    </td>

                    <td
                      className="border-dark"
                      style={eightColWidth}
                    >
                      Amount
                    </td>
                    <td
                      className="border-dark"
                      style={ninthColWidth}
                    >
                      Prd QTy
                    </td>
                    <td
                      className="border-dark"
                      style={tenthColWidth}
                    >
                      Rec QTy
                    </td>

                    <td
                      className="border-dark"
                      style={elewenthColWidth}
                    >
                      Bal QTy
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
                maxHeight: "55vh",

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
                <tbody id="tablebody">
                  {isLoading ? (
                    <>
                      <tr
                        style={{
                          backgroundColor: getcolor,
                        }}
                      >
                        <td colSpan="10" className="text-center">
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
                            {Array.from({ length: 10 }).map((_, colIndex) => (
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
                        <td style={sixthColWidth}></td>
                        <td style={seventhColWidth}></td>
                        <td style={eightColWidth}></td>
                        <td style={ninthColWidth}></td>
                        <td style={tenthColWidth}></td>
                        <td style={elewenthColWidth}></td>
                      </tr>
                    </>
                  ) : (
                    <>
                      {filteredData.map((item, i) => {
                        totalEnteries += 1;
                        const isNegative =
                          item.Credit < 0 || item.Balance < 0 || item.Debit < 0;

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


                            <td
                              className="text-start"
                              style={{
                                ...firstColWidth,
                                cursor: "pointer",
                                textDecoration: "underline",
                                // color: "blue",
                                color: selectedIndex === i ? "white" : "blue", // ✅ conditional color
                              }}

                              onDoubleClick={(e) => {
                                e.stopPropagation();
                                // code temporarily store karo
                                sessionStorage.setItem(
                                  "ProductionOrderStatusData",
                                  JSON.stringify({
                                    code: item.PRDNo,

                                  }),
                                );

                                // fixed URL open karo
                                window.open("/crystalsol/ProductionOrderLedger", "_blank");
                              }}
                            >
                              {item.PRDNo}
                            </td>


                            <td className="text-center" style={secondColWidth}>
                              {item.Date}
                            </td>

                            <td
                              className="text-start"
                              title={item.titmdsc}
                              style={{
                                ...thirdColWidth,
                                whiteSpace: "nowrap",
                                overflow: "hidden",
                                textOverflow: "ellipsis",
                              }}
                            >
                              {item.titmdsc}
                            </td>


                            <td className="text-center" style={forthColWidth}>
                              {item.UOM}
                            </td>
                            <td className="text-end" style={sixthColWidth}>
                              {item.tpurrat}
                            </td>
                            <td className="text-center" style={seventhColWidth}>
                              {item.DueDate}
                            </td>
                            <td className="text-end" style={eightColWidth}>
                              {item.ttrnamt}
                            </td>

                            <td className="text-end" style={ninthColWidth}>
                              {item.tprdqnt}
                            </td>
                            <td className="text-end" style={tenthColWidth}>
                              {item.trecqnt}
                            </td>
                            <td className="text-end" style={elewenthColWidth}>
                              {item.tbalqnt}
                            </td>
                          </tr>
                        );
                      })}
                      {Array.from({
                        length: Math.max(0, 27 - filteredData.length),
                      }).map((_, rowIndex) => (
                        <tr
                          key={`blank-${rowIndex}`}
                          style={{
                            backgroundColor: getcolor,
                            color: fontcolor,
                          }}
                        >
                          {Array.from({ length: 10 }).map((_, colIndex) => (
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
                        <td style={sixthColWidth}></td>
                        <td style={seventhColWidth}></td>
                        <td style={eightColWidth}></td>
                        <td style={ninthColWidth}></td>
                        <td style={tenthColWidth}></td>
                        <td style={elewenthColWidth}></td>
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
              {/* <span className="mobileledger_total">
                {formatValue(totalopening)}
              </span> */}
            </div>
            <div
              style={{
                ...forthColWidth,
                background: getcolor,
                borderRight: `1px solid ${fontcolor}`,
              }}
            >
              {/* <span className="mobileledger_total">
                {formatValue(totaldebit)}
              </span> */}
            </div>
            <div
              style={{
                ...sixthColWidth,
                background: getcolor,
                borderRight: `1px solid ${fontcolor}`,
              }}
            >
              {/* <span className="mobileledger_total">
                {formatValue(totalcredit)}
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
                {formatValue(ClosingBalance)}
              </span> */}
            </div>

            <div
              style={{
                ...eightColWidth,
                background: getcolor,
                borderRight: `1px solid ${fontcolor}`,
              }}
            >
            </div>
            <div
              style={{
                ...ninthColWidth,
                background: getcolor,
                borderRight: `1px solid ${fontcolor}`,
              }}
            >
              <span className="mobileledger_total">
                {formatValue(totalQnty)}
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
                {formatValue(totalRec)}
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
                {formatValue(totalBalance)}
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
