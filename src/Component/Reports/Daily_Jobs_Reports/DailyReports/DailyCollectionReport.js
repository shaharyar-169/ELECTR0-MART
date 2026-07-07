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

export default function DailyCollectionReport() {
    const navigate = useNavigate();
    const user = getUserData();
    const organisation = getOrganisationData();

    const saleSelectRef = useRef(null);
    const input1Ref = useRef(null);
    const input2Ref = useRef(null);
    const input3Ref = useRef(null);

    const toRef = useRef(null);
    const fromRef = useRef(null);

    const [saleType, setSaleType] = useState("");
    const [searchQuery, setSearchQuery] = useState("");
    const [transectionType, settransectionType] = useState("");
    const [supplierList, setSupplierList] = useState([]);

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
        getdatafontsize
    } = useTheme();

    const yeardescription = getYearDescription();
    const locationnumber = getLocationnumber()

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

    const handleToDateChange = (date) => {
        setSelectedToDate(date);
        settoInputDate(date ? formatDate(date) : "");
        settoCalendarOpen(false);
    };
    const handleToInputChange = (e) => {
        settoInputDate(e.target.value);
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
                nextInput.select();
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

    function fetchDailyCollectionReport() {
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

        const apiUrl = apiLinks + "/DailyCollectionReport.php";
        setIsLoading(true);
        const formData = new URLSearchParams({
            code: organisation.code,
            FLocCod: locationnumber || getLocationNumber,
            FYerDsc: yeardescription || getYearDescription,
            // code: 'MULTITRD',
            // FLocCod: '001',
            // FYerDsc: '2025-2026',
            FIntDat: fromInputDate,
            FFnlDat: toInputDate,
            FRepTyp: transectionType,
            FSchTxt: searchQuery,
        }).toString();

        axios
            .post(apiUrl, formData)
            .then((response) => {
                setIsLoading(false);
                console.log("Response:", response.data);

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

    const handleTransactionTypeChange = (event) => {
        const selectedTransactionType = event.target.value;
        settransectionType(selectedTransactionType);
    };

   const exportPDFHandler = () => {
  // Create a new jsPDF instance with landscape orientation
  const doc = new jsPDF({ orientation: "landscape" });

  // Define table data (rows)
  const rows = tableData.map((item) => [
    item.Date,
    item["Trn#"],
    item.Type,
    item["A/C Description"],
    item.Description,
    item.Amount,
  ]);

  // Add summary row (total row) – first column empty, "Total" in column 4 (index 4)
  rows.push([
     String(tableData.length.toLocaleString()), // column 0 – empty
    "", // column 1 – empty
    "", // column 2 – empty
    "", // column 3 – empty
    "", // column 4 – label
    String(totalAmount), // column 5 – amount
  ]);

  // Headers and column widths
  const headers = [
    "Date",
    "Trn#",
    "Type",
    "A/C Description",
    "Description",
    "Amount",
  ];
  const columnWidths = [28, 21, 13, 90, 100, 30];

  const totalWidth = columnWidths.reduce((acc, w) => acc + w, 0);
  const pageHeight = doc.internal.pageSize.height;
  const paddingTop = 15;
  const footerReserve = 18; // reduced to pack more rows

  // Set default font
  doc.setFont("verdana-regular", "normal");
  doc.setFontSize(10);

  // ------------------------------------------------------------------
  // Helper: Draw footer line and "Crystal Solution" text
  // ------------------------------------------------------------------
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

  // ------------------------------------------------------------------
  // Helper: Add table headers
  // ------------------------------------------------------------------
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

  // ------------------------------------------------------------------
  // Helper: Draw a single row and return the new Y position
  // ------------------------------------------------------------------
  const drawRow = (startX, startY, rowIndex, rowData, isTotalRow) => {
    const lineHeight = 4;
    const tableWidth = getTotalTableWidth();

    // Check if Amount (column 5) is negative -> red text
    const isNegative = !isTotalRow && parseFloat(rowData[5]) < 0;
    const textColor = isNegative ? [255, 0, 0] : [0, 0, 0];

    // Split each cell for wrapping (especially Description)
    const splitRow = rowData.map((cell, idx) => {
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

    // Alternating background for odd rows (skip total row)
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

    // Draw cell content
    let currentX = startX;
    splitRow.forEach((textArray, cellIndex) => {
      const cellWidth = columnWidths[cellIndex];
      doc.setTextColor(...textColor);
      doc.setFontSize(10);
      const textY =
        startY + (rowHeight - textArray.length * lineHeight) / 2 + lineHeight - 1;

      // Determine alignment:
      // - For total row, centre the "Total" label (cellIndex === 4)
      // - Amount (cellIndex === 5) right aligned
      // - Others left aligned (Date, Trn#, Type, A/C Description, Description)
      let align = "left";
      if (isTotalRow && cellIndex === 4) {
        align = "center";
      } else if (cellIndex === 5) {
        align = "right";
      }

      let xPos;
      if (align === "right") xPos = currentX + cellWidth - 2;
      else if (align === "center") xPos = currentX + cellWidth / 2;
      else xPos = currentX + 2;

      // Draw each line
      textArray.forEach((line, lineIdx) => {
        const y = textY + (lineIdx === 0 ? 0 : lineIdx * lineHeight);
        doc.text(line, xPos, y, { align: align });
      });

      // Vertical line between columns
      if (cellIndex < splitRow.length - 1) {
        doc.line(currentX + cellWidth, startY, currentX + cellWidth, startY + rowHeight);
      }
      currentX += cellWidth;
    });

    // Reset font after total row
    if (isTotalRow) {
      doc.setFont("verdana-regular", "normal");
    }
    return startY + rowHeight;
  };

  // ------------------------------------------------------------------
  // Helper: Add title, labels, and headers on a new page
  // ------------------------------------------------------------------
  const addPageContent = (startY) => {
    const addTitle = (title, y, fontSize = 18) => {
      doc.setFontSize(fontSize);
      doc.text(title, doc.internal.pageSize.width / 2, y, { align: "center" });
    };

    // Company name
    doc.setFont("Times New Roman", "normal");
    addTitle(comapnyname, startY, 18);
    startY += 5;

    // Report title
    doc.setFont("verdana-regular", "normal");
    addTitle(
      `Daily Collection Report From: ${fromInputDate} To: ${toInputDate}`,
      startY,
      12
    );
    startY -= 5;

    // Labels (Type, Search)
    const labelsX = (doc.internal.pageSize.width - totalWidth) / 2;
    const labelsY = startY + 4;

    let status =
      transectionType === "A"
        ? "ALL"
        : transectionType === "C"
        ? "CASH"
        : transectionType === "B"
        ? "BANK"
        : "ALL";
    let search = searchQuery ? searchQuery : "";

    doc.setFont("verdana", "bold");
    doc.setFontSize(10);
    doc.text(`Type :`, labelsX, labelsY + 8.5);
    doc.setFont("verdana-regular", "normal");
    doc.text(`${status}`, labelsX + 15, labelsY + 8.5);

    if (searchQuery) {
      doc.setFont("verdana", "bold");
      doc.text(`Search :`, labelsX + 150, labelsY + 8.5);
      doc.setFont("verdana-regular", "normal");
      doc.text(`${search}`, labelsX + 170, labelsY + 8.5);
    }

    startY += 10;

    // Table headers
    const headersStartY = 29;
    addTableHeaders((doc.internal.pageSize.width - totalWidth) / 2, headersStartY);

    return headersStartY + 6; // Y position after headers (where rows start)
  };

  // ------------------------------------------------------------------
  // Helper: total table width
  // ------------------------------------------------------------------
  const getTotalTableWidth = () => {
    let total = 0;
    columnWidths.forEach((w) => (total += w));
    return total;
  };

  // ------------------------------------------------------------------
  // Main pagination (dynamic, no fixed rowsPerPage)
  // ------------------------------------------------------------------
  const handlePagination = () => {
    let currentY = paddingTop;
    let currentRowIndex = 0;

    // Start first page
    currentY = addPageContent(currentY);

    while (currentRowIndex < rows.length) {
      const row = rows[currentRowIndex];
      const isTotalRow = currentRowIndex === rows.length - 1;

      // Estimate row height based on Description column (index 4)
      const descriptionText = String(row[4]);
      const maxWidth = columnWidths[4] - 4;
      const descLines = doc.splitTextToSize(descriptionText, maxWidth);
      const lineCount = Math.max(1, descLines.length);
      const rowHeight = lineCount * 4 + 2;

      // Check if row fits
      if (currentY + rowHeight > pageHeight - footerReserve) {
        // Draw footer on current page before adding new page
        drawFooter();
        doc.addPage();
        currentY = paddingTop;
        currentY = addPageContent(currentY);
        // Retry the same row on the new page
        continue;
      }

      // Draw the row
      currentY = drawRow(
        (doc.internal.pageSize.width - totalWidth) / 2,
        currentY,
        currentRowIndex,
        row,
        isTotalRow
      );
      currentRowIndex++;
    }

    // Draw footer on the last page
    drawFooter();
  };

  // ------------------------------------------------------------------
  // Date/time helpers
  // ------------------------------------------------------------------
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

  // ------------------------------------------------------------------
  // Generate the PDF
  // ------------------------------------------------------------------
  handlePagination();

  // Add page numbers (Page X / Y) on all pages
  const totalPages = doc.getNumberOfPages();
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

  // Save the PDF
  doc.save(`DailyCollectionReport From ${fromInputDate} To ${toInputDate}.pdf`);
};

   const handleDownloadCSV = async () => {
  const workbook = new ExcelJS.Workbook();
  const worksheet = workbook.addWorksheet("Sheet1");

  const numColumns = 6;

  const columnAlignments = [
    "left",
    "left",
    "center",
    "left",
    "left",
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
    `Daily Collection Report From ${fromInputDate} To ${toInputDate}`,
  ]);
  storeListRow.eachCell((cell) => {
    cell.font = fontStoreList;
    cell.alignment = { horizontal: "center" };
  });

  worksheet.mergeCells(
    `A${storeListRow.number}:${String.fromCharCode(65 + numColumns - 1)}${storeListRow.number}`
  );

  worksheet.addRow([]);

  let typestatus = "";

  if (transectionType === "A") {
    typestatus = "ALL";
  } else if (transectionType === "C") {
    typestatus = "CASH";
  } else if (transectionType === "B") {
    typestatus = "BANK";
  } else {
    typestatus = "ALL";
  }

  let typesearch = searchQuery ? searchQuery : "";

  const typeAndStoreRow3 = worksheet.addRow(
    searchQuery
      ? ["TYPE :", typestatus, "", "", "SEARCH :", typesearch]
      : ["TYPE :", typestatus, ""]
  );

  typeAndStoreRow3.eachCell((cell, colIndex) => {
    cell.font = {
      name: "CustomFont" || "CustomFont",
      size: 10,
      bold: [1, 4].includes(colIndex),
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
    "Date",
    "Trn#",
    "Type",
    "A/C Description",
    "Description",
    "Amount",
  ];

  const headerRow = worksheet.addRow(headers);
  headerRow.eachCell((cell) => Object.assign(cell, headerStyle));

  // Data rows with numeric conversion
  tableData.forEach((item) => {
    const amountNum = toNumber(item.Amount);

    const row = worksheet.addRow([
      item.Date,
      item["Trn#"],
      item.Type,
      item["A/C Description"],
      item.Description,
      amountNum,
    ]);

    const isNegativeQty = parseFloat(item.Qnty) < 0;

    row.eachCell((cell, colIndex) => {
      cell.font = {
        ...fontTableContent,
        color: isNegativeQty ? { argb: "FFFF0000" } : fontTableContent.color,
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

      // Apply number format (no decimals) for Amount (column 6)
      if (colIndex === 6) {
        cell.numFmt = "#,##0";
      }
    });
  });

  // Set column widths
  [12, 10, 8, 40, 45, 12].forEach((width, index) => {
    worksheet.getColumn(index + 1).width = width;
  });

  // Total row – store totalAmount as a number
  const totalAmountNum = toNumber(totalAmount);

  const totalRow = worksheet.addRow([
    "",
    "",
    "",
    "Total",
    "",
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

    if (colNumber === 6) {
      cell.alignment = { horizontal: "right" };
      cell.numFmt = "#,##0";
    }
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
  // FIXED: was incorrectly using dateTimeRow.eachCell – now using dateTimeRow1
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
  saveAs(blob, `DailyCollectionReport From ${fromInputDate} To ${toInputDate}.xlsx`);
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

    const firstColWidth = {
        width: "80px",
    };
    const secondColWidth = {
        width: "60px",
    };
    const thirdColWidth = {
        width: "50px",
    };
    const forthColWidth = {
        width: "300px",
    };
    const fifthColWidth = {
        width: "300px",
    };
    const sixthColWidth = {
        width: "90px",
    };
     const sixthCol = {
        width: "8px",
    };

    useHotkeys("alt+s", () => {
        fetchDailyCollectionReport();
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
    useEffect(() => {
        document.documentElement.style.setProperty("--background-color", getcolor);
    }, [getcolor]);
  const contentStyle = {
    width: "100%", // 100vw ki jagah 100%
    maxWidth: "915px",
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
                    <NavComponent textdata="Daily Collection Report" />
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
                               <div className="d-flex align-items-center">
                                <div
                                    style={{
                                        width: "80px",
                                        display: "flex",
                                        justifyContent: "end",
                                    }}
                                >
                                    <label htmlFor="fromDatePicker">
                                        <span style={{ fontSize: getdatafontsize, fontFamily: getfontstyle, fontWeight: "bold" }}>
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
                                            fontSize: getdatafontsize, fontFamily: getfontstyle, backgroundColor: getcolor,
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
                                                        fontSize: getdatafontsize, fontFamily: getfontstyle, color: fontcolor,
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
                                style={{ marginLeft: "15px" }}
                            >
                                <div
                                    style={{
                                        width: "60px",
                                        display: "flex",
                                        justifyContent: "end",
                                    }}
                                >
                                    <label htmlFor="toDatePicker">
                                        <span style={{ fontSize: getdatafontsize, fontFamily: getfontstyle, fontWeight: "bold" }}>
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
                                            fontSize: getdatafontsize, fontFamily: getfontstyle, backgroundColor: getcolor,
                                            color: fontcolor,
                                            opacity: selectedRadio === "custom" ? 1 : 0.5,
                                            pointerEvents:
                                                selectedRadio === "custom" ? "auto" : "none",
                                        }}
                                        value={toInputDate}
                                        onChange={handleToInputChange}
                                        onKeyDown={(e) => handleToKeyPress(e, "submitButton")}
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
                                                        fontSize: getdatafontsize, fontFamily: getfontstyle, color: fontcolor,
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
                            {/* ------ */}
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
                                        <span style={{ fontSize: getdatafontsize, fontFamily: getfontstyle, fontWeight: "bold" }}>
                                            Type :
                                        </span>
                                    </label>
                                </div>
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
                                        width: "200px",
                                        height: "24px",
                                        marginLeft: "5px",
                                        backgroundColor: getcolor,
                                        border: `1px solid ${fontcolor}`,
                                        fontSize: getdatafontsize, fontFamily: getfontstyle, color: fontcolor,
                                    }}
                                >
                                    <option value="">ALL</option>
                                    <option value="C">CASH </option>
                                    <option value="B">BANK</option>
                                </select>
                            </div>
                        </div>
                    </div>
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
                                        ref={input2Ref}
                                        onKeyDown={(e) => handleKeyPress(e, input3Ref)}
                                        type="text"
                                        id="searchsubmit"
                                        placeholder="Search"
                                        value={searchQuery}
                                        autoComplete="off"
                                        style={{
                                            marginRight: "20px",
                                            width: "200px",
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
                                    fontSize: getdatafontsize, fontFamily: getfontstyle,
                                    //  width: "100%",
                                    position: "relative",
                                }}
                            >
                                <thead
                                    style={{
                                        fontSize: getdatafontsize, fontFamily: getfontstyle,
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
                                            Type
                                        </td>
                                        <td className="border-dark" style={forthColWidth}>
                                            A/C Description
                                        </td>
                                        <td className="border-dark" style={fifthColWidth}>
                                            Description
                                        </td>
                                        <td className="border-dark" style={sixthColWidth}>
                                            Amount
                                        </td>
                                          <td className="border-dark" style={sixthCol}>
                                            
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
                                maxHeight: "52vh",
                                // width: "100%",
                                wordBreak: "break-word",
                            }}
                        >
                            <table
                                className="myTable"
                                id="tableBody"
                                style={{
                                    fontSize: getdatafontsize, fontFamily: getfontstyle,
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
                                                <td colSpan="6" className="text-center">
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
                                                        {Array.from({ length: 6 }).map((_, colIndex) => (
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
                                                        <td className="text-center" style={thirdColWidth}>
                                                            {item.Type}
                                                        </td>
                                                        <td className="text-start" style={forthColWidth}>
                                                            {item["A/C Description"]}
                                                        </td>
                                                        <td className="text-start" style={fifthColWidth}>
                                                            {item.Description}
                                                        </td>
                                                        <td className="text-end" style={sixthColWidth}>
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
                                                    {Array.from({ length: 6 }).map((_, colIndex) => (
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
                        >
                            <span className="mobileledger_total">{totalAmount}</span>
                        </div>
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
                            onClick={fetchDailyCollectionReport}
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