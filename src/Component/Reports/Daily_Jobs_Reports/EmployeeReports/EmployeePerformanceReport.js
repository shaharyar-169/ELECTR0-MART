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
import { Code, Collections, Description, Store } from "@mui/icons-material";
import "../../../vardana/vardana";
import "../../../vardana/verdana-bold";

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
  

  const [transectionType, settransectionType] = useState("");
 

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

      // code: "EJAZCENTRE",
      // FLocCod: "001",
      // FYerDsc:'2025-2025'
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

   const exportPDFHandler = () => {
         
         
          // Create a new jsPDF instance with landscape orientation
          const doc = new jsPDF({ orientation: "landscape" });
  
          // Define table data (rows)
          const rows = tableData.map((item) => [
              item.code,
              item["Sales Man"],
             formatValue(item.Qnty) ,
             formatValue(item.Cost) ,
          formatValue(item.Amount)    ,
         formatValue(item.Margin)      ,
          //  formatValue(item.Delivery)    ,
          //  formatValue(item["Other Profit"])    ,
            formatValue(item["Net Margin"])   ,
               formatValue(item.Comm)    ,
                  formatValue(item.CommPercentage)    ,
                    //  formatValue(item.Expense)    ,
                       formatValue(item["Net Comm"])   ,
          ]);
  
          // Add summary row to the table
  
          rows.push([
                          String(formatValue(tableData.length.toLocaleString())),
             "",
              String(formatValue(totalqnty)),
              String(formatValue(totalcost)),
              String(formatValue(totalamount)),
              String(formatValue(totalmargin)),
              //  String(formatValue(totaldelivery)),
              // String(formatValue(totalProfit)),
              String(formatValue(totalNetMargin)),
              String(formatValue(totalCom)),
              String(formatValue(totalComPercentage)),
              // String(formatValue(totalExpense)),
              String(formatValue(totalNetMargin)),
          ]);
  
          // Define table column headers and individual column widths
          const headers = [
              "Code",
              "Sales Man",
              "Qnty",
              "Cost",
              "Amount",
              "Margin",
              // "Delivery",
              // "Other Pro",
              "Nwt Mar",
              "Comm",
              "ComPer",
              // "Expense",
              "Net Mar"
          ];
          const columnWidths = [18, 80, 25, 15, 25, 25, 25,25,20,25];
  
          // Calculate total table width
          const totalWidth = columnWidths.reduce((acc, width) => acc + width, 0);
  
          // Define page height and padding
          const pageHeight = doc.internal.pageSize.height;
          const paddingTop = 15;
  
            doc.setFont("verdana-regular", "normal");
            doc.setFontSize(10);
  
          // Function to add table headers
          const addTableHeaders = (startX, startY) => {
              // Set font style and size for headers
            doc.setFont("verdana", "bold");
            doc.setFontSize(10);
  
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
  
             
          };
  
          const addTableRows = (startX, startY, startIndex, endIndex) => {
        const rowHeight = 5;
        const fontSize = 10;
        const boldFont = 400;
        const normalFont = getfontstyle;
        const tableWidth = getTotalTableWidth();
  
        for (let i = startIndex; i < endIndex; i++) {
          const row = rows[i];
          const isOddRow = i % 2 !== 0;
          const isRedRow = row[0] && parseInt(row[0]) > 10000000000;
          const isTotalRow = i === rows.length - 1;
          let textColor = [0, 0, 0];
          let fontName = normalFont;
  
          if (isRedRow) {
            textColor = [255, 0, 0];
            fontName = boldFont;
          }
  
          if (isTotalRow) {
            doc.setFont("verdana", "bold");
            doc.setFontSize(10);
          }
  
          if (isOddRow) {
            doc.setFillColor(240);
            doc.rect(
              startX,
              startY + (i - startIndex + 2) * rowHeight,
              tableWidth,
              rowHeight,
              "F"
            );
          }
  
          doc.setDrawColor(0);
  
          if (isTotalRow) {
            const rowTopY = startY + (i - startIndex + 2) * rowHeight;
            const rowBottomY = rowTopY + rowHeight;
  
            doc.setLineWidth(0.3);
            doc.line(startX, rowTopY, startX + tableWidth, rowTopY);
            doc.line(startX, rowTopY + 0.5, startX + tableWidth, rowTopY + 0.5);
  
            doc.line(startX, rowBottomY, startX + tableWidth, rowBottomY);
            doc.line(
              startX,
              rowBottomY - 0.5,
              startX + tableWidth,
              rowBottomY - 0.5
            );
  
            doc.setLineWidth(0.2);
            doc.line(startX, rowTopY, startX, rowBottomY);
            doc.line(
              startX + tableWidth,
              rowTopY,
              startX + tableWidth,
              rowBottomY
            );
          } else {
            doc.setLineWidth(0.2);
            doc.rect(
              startX,
              startY + (i - startIndex + 2) * rowHeight,
              tableWidth,
              rowHeight
            );
          }
  
          row.forEach((cell, cellIndex) => {
            // ⭐ NEW FIX — Perfect vertical centering
            const cellY =
              startY + (i - startIndex + 2) * rowHeight + rowHeight / 2;
  
            const cellX = startX + 2;
  
            doc.setTextColor(textColor[0], textColor[1], textColor[2]);
  
            if (!isTotalRow) {
              doc.setFont("verdana-regular", "normal");
              doc.setFontSize(10);
            }
  
            const cellValue = String(cell);
  
            if (cellIndex === 0) {
              const rightAlignX = startX + columnWidths[cellIndex] / 2;
              doc.text(cellValue, rightAlignX, cellY, {
                align: "center",
                baseline: "middle",
              });
            } else if (
              cellIndex > 1  
            
            ) {
              const rightAlignX = startX + columnWidths[cellIndex] - 2;
              doc.text(cellValue, rightAlignX, cellY, {
                align: "right",
                baseline: "middle",
              });
            } else {
              if (isTotalRow && cellIndex === 0 && cell === "") {
                const totalLabelX = startX + columnWidths[0] / 2;
                doc.text("", totalLabelX, cellY, {
                  align: "center",
                  baseline: "middle",
                });
              } else {
                doc.text(cellValue, cellX, cellY, {
                  baseline: "middle",
                });
              }
            }
  
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
  
          if (isTotalRow) {
            doc.setFont("verdana-regular", "normal");
            doc.setFontSize(10);
          }
        }
  
        const lineWidth = tableWidth;
        const lineX = (doc.internal.pageSize.width - tableWidth) / 2;
        const lineY = pageHeight - 15;
        doc.setLineWidth(0.3);
        doc.line(lineX, lineY, lineX + lineWidth, lineY);
        const headingFontSize = 11;
        const headingX = lineX + 2;
        const headingY = lineY + 5;
        doc.setFont("verdana-regular", "normal");
        doc.setFontSize(10);
        doc.text(`Crystal Solution    ${date}    ${time}`, headingX, headingY);
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
          const rowsPerPage = 31; // Adjust this value based on your requirements
  
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
   doc.setFont("verdana-regular", "normal");
              doc.setFontSize(10);
              
              doc.text(
                      `Page ${pageNumber}`,
                      rightX - 20,
                      doc.internal.pageSize.height - 10,
                      { align: "right" }
                  );
              };
  
              let currentPageIndex = 0;
              let startY = paddingTop; // Initialize startY
              let pageNumber = 1; // Initialize page number
  
              while (currentPageIndex * rowsPerPage < rows.length) {
                 doc.setFont("Times New Roman", "normal");
                  addTitle(comapnyname, 12, 12, pageNumber, startY, 18); // Render company title with default font size, only date, and page number
                  startY += 5; // Adjust vertical position for the company title
   doc.setFont("verdana-regular", "normal");
                  addTitle(
                      `Employee Performance Report From: ${fromInputDate} To: ${toInputDate}`,
                      "",
                      "",
                      pageNumber,
                      startY,
                      12
                  ); // Render sale report title with decreased font size, provide the time, and page number
                  startY += -5;
  
                  const labelsX = (doc.internal.pageSize.width - totalWidth) / 2;
                  const labelsY = startY + 4; // Position the labels below the titles and above the table
  
                
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
                         doc.text(`RATE :`, labelsX, labelsY + 8.5); // Draw bold label
   doc.setFont("verdana-regular", "normal");
              doc.setFontSize(10);
                              doc.text(`${TypeFilter}`, labelsX + 20, labelsY + 8.5); // Draw the value next to the label
  
   doc.setFont("verdana", "bold");
              doc.setFontSize(10);
                              doc.text(`Commission :`, labelsX + 180, labelsY + 8.5); // Draw bold label
   doc.setFont("verdana-regular", "normal");
              doc.setFontSize(10);
                              doc.text(`${mobileNumber}`, labelsX + 208, labelsY + 8.5); // Draw the value next to the label
  
                
                  startY += 10; // Adjust vertical position for the labels
  
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
                      startY = addNewPage(startY); // Add new page and update startY
                      pageNumber++; // Increment page number
                  }
                  currentPageIndex++;
              }
          };
  
          const getCurrentDate = () => {
              const today = new Date();
              const dd = String(today.getDate()).padStart(2, "0");
              const mm = String(today.getMonth() + 1).padStart(2, "0"); // January is 0!
              const yyyy = today.getFullYear();
              return dd + "/" + mm + "/" + yyyy;
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
          doc.save(
              `Employee Performance Report Form ${fromInputDate} To ${toInputDate}.pdf`
          );
      };

   const handleDownloadCSV = async () => {
          const workbook = new ExcelJS.Workbook();
          const worksheet = workbook.addWorksheet("Sheet1");
  
          const numColumns = 13; // Ensure this matches the actual number of columns
  
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
          const storeListRow = worksheet.addRow([`Employee Performance Report From ${fromInputDate} To ${toInputDate}`]);
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
  
  
          // Apply styling for the status row
          const typeAndStoreRow2 = worksheet.addRow(
              ["Rate :", TypeFilter, "", "", "", "", "Commission :", mobileNumber]
          );
  
  
          // Merge cells for Accountselect (columns B to D)
          worksheet.mergeCells(`B${typeAndStoreRow2.number}:D${typeAndStoreRow2.number}`);
  
          // Apply styling for the status row
          typeAndStoreRow2.eachCell((cell, colIndex) => {
              cell.font = {
                  name: "CustomFont" || "CustomFont",
                  size: 10,
                  bold: [1, 7].includes(colIndex),
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
               "Code",
              "Sales Man",
              "Qnty",
              "Cost",
              "Amount",
              "Margin",
              "Delivery",
              "Other Pro",
              "Nwt Mar",
              "Comm",
              "ComPer",
              "Expense",
              "Net Mar"
          ];
          const headerRow = worksheet.addRow(headers);
          headerRow.eachCell((cell) => Object.assign(cell, headerStyle));
  
          // Add data rows
          tableData.forEach((item) => {
              const row = worksheet.addRow([
            item.code,
              item["Sales Man"],
             formatValue(item.Qnty) ,
             formatValue(item.Cost) ,
          formatValue(item.Amount)    ,
         formatValue(item.Margin)      ,
           formatValue(item.Delivery)    ,
           formatValue(item["Other Profit"])    ,
            formatValue(item["Net Margin"])   ,
               formatValue(item.Comm)    ,
                  formatValue(item.CommPercentage)    ,
                     formatValue(item.Expense)    ,
                       formatValue(item["Net Comm"])   ,
  
              ]);
  
              row.eachCell((cell, colIndex) => {
                  cell.font = fontTableContent;
                  cell.border = {
                      top: { style: "double" },
                      left: { style: "thin" },
                      bottom: { style: "double" },
                      right: { style: "thin" },
                  };
                  cell.alignment = {
                      horizontal: columnAlignments[colIndex - 1] || "left",
                      vertical: "middle",
                  };
              });
          });
  
          const totalRow = worksheet.addRow([
              String(formatValue(tableData.length.toLocaleString())),
             "",
              String(formatValue(totalqnty)),
              String(formatValue(totalcost)),
              String(formatValue(totalamount)),
              String(formatValue(totalmargin)),
               String(formatValue(totaldelivery)),
              String(formatValue(totalProfit)),
              String(formatValue(totalNetMargin)),
              String(formatValue(totalCom)),
              String(formatValue(totalComPercentage)),
              String(formatValue(totalExpense)),
              String(formatValue(totalNetMargin)),
  
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
              if (colNumber > 2) {
                  cell.alignment = { horizontal: "right" };
              }
                if (colNumber === 1) {
                  cell.alignment = { horizontal: "center" };
              }
          });
  
          // Set column widths
          [10, 40, 12, 12, 12, 12, 12, 12, 12,12,12,12,12].forEach((width, index) => {
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

    const firstColWidth = {
    width: "50px",
  };
  const secondColWidth = {
    width: isSidebarVisible ? "150px" :'250px',
  };
  const thirdColWidth = {
    width: isSidebarVisible ? "70px" :'80px',
  };
  const forthColWidth = {
       width: isSidebarVisible ? "70px" :'80px',

  };
   const fifthColWidth = {
    width: isSidebarVisible ? "70px" :'80px',
  };
    const sixthColWidth = {
     width: isSidebarVisible ? "70px" :'80px',
    };
  const seventhColWidth = {
    width: isSidebarVisible ? "70px" :'80px',
  };
  const eightColWidth = {
    width: isSidebarVisible ? "70px" :'80px',
  };
  const ninthColWidth = {
    width: isSidebarVisible ? "70px" :'80px',
  };
  const tenthColWidth = {
     width: isSidebarVisible ? "70px" :'80px',
  };
  const elewenthColWidth = {
    width: isSidebarVisible ? "70px" :'80px',
  };
   const tewelthColWidth = {
    width: isSidebarVisible ? "70px" :'80px',
  };
   const thirteenColWidth = {
 width: isSidebarVisible ? "70px" :'80px',
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

  const contentStyle = {
    width: "100%", // 100vw ki jagah 100%
    maxWidth: isSidebarVisible ? "1000px":'1200px',
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
                            Qnty
                          </td>
                          <td className="border-dark" style={forthColWidth}>
                            Cost
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
                                  <td className="text-start" style={firstColWidth}>
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
                                    { formatValue(item.Qnty)}
                                  </td>
                                  <td className="text-end" style={forthColWidth}>
                                    {formatValue(item.Cost)}
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
