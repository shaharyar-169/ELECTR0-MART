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
import { Height } from "@mui/icons-material";

export default function FbrDataReport() {
  const navigate = useNavigate();
  const user = getUserData();
  const organisation = getOrganisationData();

  const saleSelectRef = useRef(null);
  const input1Ref = useRef(null);
  const input2Ref = useRef(null);
  const input3Ref = useRef(null);
  const input4Ref = useRef(null);

  const Referenceref = useRef(null);
  const [selectedInvoice, setSelectedInvoice] = useState("");
  const [selectedTrnNum, setSelectedTrnNum] = useState("");
  const [selectedTrnTyp, setSelectedTrnTyp] = useState("");

  const [selectedLocationCode, setSelectedLocationCode] = useState("");

  const [selectedFBRNO, setSelectedFBRNO] = useState("");

  // console.log("selectedInvoice", selectedInvoice);

  const toRef = useRef(null);
  const fromRef = useRef(null);

  const [Profits, setProfits] = useState([]);
  const [Expenses, setExpenses] = useState([]);

  const [fbrheader, setfbrheader] = useState([]);
  const [fbrdetail, setfbrdetail] = useState([]);

  // console.log('fbrheader', fbrheader[0].Mobile )

  const [searchQuery, setSearchQuery] = useState("");
  const [transectionType, settransectionType] = useState("");
  const [Retrate, setRetrate] = useState("P");
  const [supplierList, setSupplierList] = useState([]);

  const [Technicianselectdatavalue, setTechnicianselectdatavalue] =
    useState("");
  const [saleType, setSaleType] = useState("");

  ////////////////// total for fbrdetaillist //////////////////////////
  const [TotalSaleAmt, setTotalSaleAmt] = useState(0);
  const [TotalQnty, setTotalQnty] = useState(0);
  const [TotalTaxAmt, setTotalTaxAmt] = useState(0);
  const [TotalTotalSale, setTotalTotalSale] = useState(0);
  const [TotalDiscount, setTotalDiscount] = useState(0);
  ////////////////////////////////////////////////////////////////

  ////////////////// total for fbrdetail //////////////////////////
  const [fbrTotalSaleAmt, setfbrTotalSaleAmt] = useState(0);
  const [fbrTotalQnty, setfbrTotalQnty] = useState(0);
  const [fbrTotalTaxAmt, setfbrTotalTaxAmt] = useState(0);
  const [fbrTotalTotalSale, setfbrTotalTotalSale] = useState(0);
  const [fbrTotalDiscount, setfbrTotalDiscount] = useState(0);
  ////////////////////////////////////////////////////////////////

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
    getposid,
    getdatafontsize,
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

        if (input2Ref.current) {
          e.preventDefault();
          input2Ref.current.focus();
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
  const [openmodel, setopenmodel] = useState(false);
  const [getmodelshowingdata, setmodelshowingdata] = useState([]);

  const handleCloseModal = () => {
    setopenmodel(false);
  };
  const handleCloseModalUpdate = () => {
    setopenmodelUpdate(false);
  };
  function fetchReceivableReport() {
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

    const apiUrl = apiLinks + "/FBRInvoiceList.php";
    setIsLoading(true);

    const formData = new URLSearchParams({
      FIntDat: fromInputDate,
      FFnlDat: toInputDate,
      FRepTyp: transectionType,
      FLocCod: saleType,
      code: organisation.code,
      // FLocCod: locationnumber || getLocationNumber,
      FYerDsc: yeardescription || getyeardescription,

      FSchTxt: searchQuery,
    }).toString();

    axios
      .post(apiUrl, formData)
      .then((response) => {
        setIsLoading(false);

        setTotalSaleAmt(response.data["TotalSaleAmt "]);
        setTotalQnty(response.data["TotalQnty "]);
        setTotalTaxAmt(response.data["TotalTaxAmt "]);
        setTotalTotalSale(response.data["TotalTotalSale "]);
        setTotalDiscount(response.data["TotalDiscount "]);

        // Store Profit and Expense data into separate states
        if (response.data) {
          if (Array.isArray(response.data.Detail)) {
            setProfits(response.data.Detail); // Store Profit array in profits state
          } else {
            console.warn(
              "Response data 'Profit' is not an array:",
              response.data.Detail
            );
            setProfits([]); // Fallback to an empty array
          }

          if (Array.isArray(response.data.Expense)) {
            setExpenses(response.data.Expense); // Store Expense array in expenses state
          } else {
            console.warn(
              "Response data 'Expense' is not an array:",
              response.data.Expense
            );
            setExpenses([]); // Fallback to an empty array
          }
        } else {
          console.warn("Response data is null or undefined:", response.data);
          setProfits([]);
          setExpenses([]);
        }
      })
      .catch((error) => {
        console.error("Error:", error);
        setIsLoading(false);
      });
  }

  useEffect(() => {
    const apiUrl = apiLinks + "/FBRInvoiceDetail.php";
    // setIsLoading(true);
    const formData = new URLSearchParams({
      // FInvNum:'139235-110325142719-006803',
      code: organisation.code,
      FInvNum: selectedInvoice,
      FTrnNum: selectedTrnNum,
      FTrnTyp: selectedTrnTyp,
      FLocCod: locationnumber || getLocationNumber,
      FYerDsc: yeardescription || getyeardescription,

      // FLocCod: "001",
      // code: "NASIRTPOS",
      // FYerDsc: "2021-2025",
      // FTrnNum: "000001",
      // FTrnTyp: "INV",
    }).toString();

    axios
      .post(apiUrl, formData)
      .then((response) => {
        // setIsLoading(false);
        console.log(response, "response");
        setfbrTotalSaleAmt(response.data["TotalSaleAmt "]);
        setfbrTotalQnty(response.data["TotalQnty "]);
        setfbrTotalTaxAmt(response.data["TotalTaxAmt "]);
        setfbrTotalTotalSale(response.data["TotalTotalSale "]);
        setfbrTotalDiscount(response.data["TotalDiscount "]);

        // Store Profit and Expense data into separate states
        if (response.data) {
          if (Array.isArray(response.data.Header)) {
            setfbrheader(response.data.Header); // Store Profit array in profits state
          } else {
            console.warn(
              "Response data 'Profit' is not an array:",
              response.data.Header
            );
            setfbrheader([]); // Fallback to an empty array
          }

          if (Array.isArray(response.data.Detail)) {
            setfbrdetail(response.data.Detail); // Store Expense array in expenses state
          } else {
            console.warn(
              "Response data 'Expense' is not an array:",
              response.data.Detail
            );
            setfbrdetail([]); // Fallback to an empty array
          }
        } else {
          console.warn("Response data is null or undefined:", response.data);
          setfbrheader([]);
          setfbrdetail([]);
        }
      })
      .catch((error) => {
        console.error("Error:", error);
        setIsLoading(false);
      });
  }, [selectedTrnNum, selectedTrnTyp]);
  const fetchSaleData = async () => {
    const apiUrl = apiLinks + "/SavePOSSaleJason.php";
    console.log("savepossalejson", selectedLocationCode, selectedTrnNum);
    const formData = new URLSearchParams({
      code: organisation.code,
      FLocCod: locationnumber || getLocationNumber,

      FTrnNum: selectedTrnNum,
      // FInvTyp: selectedTrnNum,
      // FRefNum: selectedTrnNum,

      // FInvNum: selectedInvoice,
    }).toString();

    try {
      const response = await axios.post(apiUrl, formData);
      setmodelshowingdata(response.data);
      // setopenmodel(true);
      setTimeout(() => {
        setopenmodel(true);
      }, 1000);
      // console.log("response.data:", response.data);
    } catch (error) {
      // console.error("Error fetching sale data:", error);
    }
  };

  const [openmodelUpdate, setopenmodelUpdate] = useState(false);
  const [getmodelshowingdataUpdate, setmodelshowingdataUpdate] = useState([]);
  const fetchSaleDataUpdate = async () => {
    const apiUrl = apiLinks + "/SavePOSSale.php";
    const formData = new URLSearchParams({
      code: organisation.code,
      FLocCod: locationnumber || getLocationNumber,
      FTrnNum: selectedTrnNum,
    }).toString();

    try {
      const response = await axios.post(apiUrl, formData);
      console.log(response.data, "response", formData);
      fetchReceivableReport();
      setmodelshowingdataUpdate(response.data);
      // setopenmodel(true);
      setTimeout(() => {
        setopenmodelUpdate(true);
      }, 500);
      // console.log("response.data:", response.data);
    } catch (error) {
      // console.error("Error fetching sale data:", error);
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

  const handleReprateChange = (event) => {
    const selectedTransactionType = event.target.value;
    setRetrate(selectedTransactionType);
  };

  ///////////////////////////// DOWNLOAD PDF CODE ////////////////////////////////////////////////////////////
  const exportPDFHandler = () => {
    // Create a new jsPDF instance with landscape orientation
    const doc = new jsPDF({ orientation: "landscape" });

    // Define table data (rows)
    const rows = Profits.map((item) => [
      item.FBRNo,
      item.Location,
      item["Trn#"],
      item.Type,
      item.Date,
      item.Customer,
      item.Mobile,
      item.SaleAmt,
      item.Qnty,
      item.TaxAmt,
      item.TotalSale,
      item.Discount,
    ]);

    // Add summary row to the table

    rows.push([
      "",
      "",
      "",
      "",
      "",
      "",
      "",
      String(TotalSaleAmt),
      String(TotalQnty),
      String(TotalTaxAmt),
      String(TotalTotalSale),
      String(TotalDiscount),
    ]);

    // Define table column headers and individual column widths
    const headers = [
      "FBRNo",
      "Location",
      "Trn#",
      "Type",
      "Date",
      "Customer",
      "Mobile",
      "SaleAmt",
      "Qnty",
      "TaxAmt",
      "TotalSale",
      "Discount",
    ];
    const columnWidths = [40, 18, 15, 25, 20, 30, 25, 20, 20, 20, 20, 20];

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
      const rowHeight = 5; // Adjust this value to decrease row height
      const fontSize = 10; // Adjust this value to decrease font size
      const boldFont = 400; // Bold font
      const normalFont = getfontstyle; // Default font
      const tableWidth = getTotalTableWidth(); // Calculate total table width

      doc.setFontSize(fontSize);

      for (let i = startIndex; i < endIndex; i++) {
        const row = rows[i];
        const isOddRow = i % 2 !== 0; // Check if the row index is odd
        const isRedRow =
          row[0] && parseInt(row[0]) > 1000000000000000000000000000000; // Check if tctgcod is greater than 100
        let textColor = [0, 0, 0]; // Default text color
        let fontName = normalFont; // Default font

        if (isRedRow) {
          textColor = [255, 0, 0]; // Red color
          fontName = boldFont; // Set bold font for red-colored row
        }

        // Draw row borders
        doc.setDrawColor(0); // Set color for borders
        doc.rect(
          startX,
          startY + (i - startIndex + 2) * rowHeight,
          tableWidth,
          rowHeight
        );

        row.forEach((cell, cellIndex) => {
          const cellY = startY + (i - startIndex + 2) * rowHeight + 3;
          const cellX = startX + 2;

          // Set text color
          doc.setTextColor(textColor[0], textColor[1], textColor[2]);
          // Set font
          //   doc.setFont(fontName, "normal");
          doc.setFont(getfontstyle, "300");
          // Ensure the cell value is a string
          const cellValue = String(cell);

          if (cellIndex === 3) {
            const rightAlignX = startX + columnWidths[cellIndex] / 2; // Adjust for right alignment
            doc.text(cellValue, rightAlignX, cellY, {
              align: "center",
              baseline: "middle",
            });
          } else if (
            cellIndex === 6 ||
            cellIndex === 8 ||
            cellIndex === 9 ||
            cellIndex === 10 ||
            cellIndex === 11
          ) {
            const rightAlignX = startX + columnWidths[cellIndex] - 2; // Adjust for right alignment
            doc.text(cellValue, rightAlignX, cellY, {
              align: "right",
              baseline: "middle",
            });
          } else {
            doc.text(cellValue, cellX, cellY, { baseline: "middle" });
          }

          // Draw column borders (excluding the last column)
          if (cellIndex < row.length - 1) {
            doc.rect(
              startX,
              startY + (i - startIndex + 2) * rowHeight,
              columnWidths[cellIndex],
              rowHeight
            );
            startX += columnWidths[cellIndex];
          }
        });

        // Draw border for the last column
        doc.rect(
          startX,
          startY + (i - startIndex + 2) * rowHeight,
          columnWidths[row.length - 1],
          rowHeight
        );
        startX = (doc.internal.pageSize.width - tableWidth) / 2; // Adjusted for center alignment
      }

      // Draw line at the bottom of the page with padding
      const lineWidth = tableWidth; // Match line width with table width
      const lineX = (doc.internal.pageSize.width - tableWidth) / 2; // Center line
      const lineY = pageHeight - 15; // Position the line 20 units from the bottom
      doc.setLineWidth(0.3);
      doc.line(lineX, lineY, lineX + lineWidth, lineY); // Draw line
      const headingFontSize = 12; // Adjust as needed

      // Add heading "Crystal Solution" aligned left bottom of the line
      const headingX = lineX + 2; // Padding from left
      const headingY = lineY + 5; // Padding from bottom
      doc.setFontSize(headingFontSize); // Set the font size for the heading
      doc.setTextColor(0); // Reset text color to default
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
    const rowsPerPage = 25; // Adjust this value based on your requirements

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
          rightX - 1,
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
          `FBR Data From: ${fromInputDate} To: ${toInputDate}`,
          "",
          "",
          pageNumber,
          startY,
          12
        ); // Render sale report title with decreased font size, provide the time, and page number
        startY += -5;

        const labelsX = (doc.internal.pageSize.width - totalWidth) / 2;
        const labelsY = startY + 4; // Position the labels below the titles and above the table

        // Set font size and weight for the labels
        doc.setFontSize(12);
        doc.setFont(getfontstyle, "300");

        let status = transectionType === "O" ? "Outstanding" : "ALL";

        let categorycodelable = Technicianselectdatavalue.label
          ? Technicianselectdatavalue.label
          : "ALL";

        let search1 = searchQuery ? searchQuery : "";

        // Set font style, size, and family
        doc.setFont(getfontstyle, "300"); // Font family and style ('normal', 'bold', 'italic', etc.)
        doc.setFontSize(10); // Font size

        doc.setFont(getfontstyle, "bold"); // Set font to bold
        doc.text(`SALE :`, labelsX, labelsY + 8.5); // Draw bold label
        doc.setFont(getfontstyle, "normal"); // Reset font to normal
        doc.text(`${categorycodelable}`, labelsX + 15, labelsY + 8.5); // Draw the value next to the label

        doc.setFont(getfontstyle, "bold"); // Set font to bold
        doc.text(`TYPE :`, labelsX + 200, labelsY + 8.5); // Draw bold label
        doc.setFont(getfontstyle, "normal"); // Reset font to normal
        doc.text(`${status}`, labelsX + 215, labelsY + 8.5); // Draw the value next to the label

        // // Reset font weight to normal if necessary for subsequent text
        doc.setFont(getfontstyle, "bold"); // Set font to bold
        doc.setFontSize(10);

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
    doc.save(`FBRDataReport Form ${fromInputDate} To ${toInputDate}.pdf`);
  };

  const handleDownloadCSV = async () => {
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet("Sheet1");

    const numColumns = 13; // Ensure this matches the actual number of columns

    const columnAlignments = [
      "left",
      "left",
      "left",
      "left",
      "left",
      "right",
      "left",
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
      `A${companyRow.number}:${String.fromCharCode(65 + numColumns - 1)}${
        companyRow.number
      }`
    );

    // Add Store List row
    const storeListRow = worksheet.addRow([
      `FBR Data Report From ${fromInputDate} To ${toInputDate}`,
    ]);
    storeListRow.eachCell((cell) => {
      cell.font = fontStoreList;
      cell.alignment = { horizontal: "center" };
    });

    worksheet.mergeCells(
      `A${storeListRow.number}:${String.fromCharCode(65 + numColumns - 1)}${
        storeListRow.number
      }`
    );

    // Add an empty row after the title section
    worksheet.addRow([]);

    let categoryvalue = Technicianselectdatavalue.label
      ? Technicianselectdatavalue.label
      : "ALL";

    let status = transectionType === "O" ? "Outstanding" : "ALL";

    // Add first row
    const typeAndStoreRow = worksheet.addRow([
      "SALE :",
      categoryvalue,
      "",
      "",
      "",
      "",
      "",
      "",
      "",
      "",
      "type :",
      status,
    ]);

    // Apply styling for the status row
    typeAndStoreRow.eachCell((cell, colIndex) => {
      cell.font = {
        name: "CustomFont" || "CustomFont",
        size: 10,
        bold: [1, 11].includes(colIndex),
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
      "FBRNo",
      "Location",
      "Trn#",
      "Type",
      "Date",
      "Customer",
      "Mobile",
      "SaleAmt",
      "Qnty",
      "TaxAmt",
      "TotalSale",
      "Discount",
    ];
    const headerRow = worksheet.addRow(headers);
    headerRow.eachCell((cell) => Object.assign(cell, headerStyle));

    // Add data rows
    Profits.forEach((item) => {
      const row = worksheet.addRow([
        item.FBRNo,
        item.Location,
        item["Trn#"],
        item.Type,
        item.Date,
        item.Customer,
        item.Mobile,
        item.SaleAmt,
        item.Qnty,
        item.TaxAmt,
        item.TotalSale,
        item.Discount,
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

    // Set column widths
    [23, 10, 8, 10, 10, 15, 12, 15, 15, 15, 15, 15].forEach((width, index) => {
      worksheet.getColumn(index + 1).width = width;
    });

    const totalRow = worksheet.addRow([
      "",
      "",
      "",
      "",
      "",
      "",
      "",
      String(TotalSaleAmt),
      String(TotalQnty),
      String(TotalTaxAmt),
      String(TotalTotalSale),
      String(TotalDiscount),
    ]);

    // total row added

    totalRow.eachCell((cell, colNumber) => {
      cell.font = { name: "CustomFont", size: 10, bold: true }; // Apply CustomFont
      cell.border = {
        top: { style: "thin" },
        left: { style: "thin" },
        bottom: { style: "thin" },
        right: { style: "thin" },
      };

      // Align only the "Total" text to the right
      if (
        colNumber === 9 ||
        colNumber === 10 ||
        colNumber === 11 ||
        colNumber === 12 ||
        colNumber === 13
      ) {
        cell.alignment = { horizontal: "right" };
      }
    });

    // Get current date
    const getCurrentDate = () => {
      const today = new Date();
      const day = String(today.getDate()).padStart(2, "0");
      const month = String(today.getMonth() + 1).padStart(2, "0");
      const year = today.getFullYear();
      return `${day}-${month}-${year}`;
    };

    const currentdate = getCurrentDate();

    // Generate and save the Excel file
    const buffer = await workbook.xlsx.writeBuffer();
    const blob = new Blob([buffer], {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    });
    saveAs(blob, `FBRDataReport From ${fromInputDate} To ${toInputDate}.xlsx`);
  };

  ///////////////////////////// DOWNLOAD PDF EXCEL ///////////////////////////////////////////////////////////

  const handleSaleKeypress = (event, inputId) => {
    if (event.key === "Enter") {
      const selectedOption = saleSelectRef.current.state.selectValue;
      if (selectedOption && selectedOption.value) {
        setSaleType(selectedOption.value);
      }
      // const nextInput = document.getElementById(inputId);
      const nextInput = inputId.current;
      if (nextInput) {
        nextInput.focus();
        nextInput.select();
      } else {
        document.getElementById("submitButton").click();
      }
    }
  };

  useEffect(() => {
    const apiUrl = apiLinks + "/GetActiveUserLocations.php";
    const formData = new URLSearchParams({
      FUsrId: user.tusrid,
      code: organisation.code,
      // code: "MAKKAHCOMP",
    }).toString();
    axios
      .post(apiUrl, formData)
      .then((response) => {
        setSupplierList(response.data);
      })
      .catch((error) => {
        // console.error("Error fetching data:", error);
      });
  }, []);

  const options = supplierList.map((item) => ({
    value: item.tloccod,
    label: `${item.tloccod}-${item.tlocdsc.trim()}`,
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
            color: "black",
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
      caretColor: getcolor === "white" ? "black" : "white", // Change cursor color based on background
      borderRadius: 0,
      border: `1px solid ${fontcolor}`, // Fixed Template Literal
      transition: "border-color 0.15s ease-in-out",
      "&:hover": {
        borderColor: state.isFocused ? base.borderColor : "black",
      },
      padding: "0 8px",
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
    }),
    dropdownIndicator: (base) => ({
      ...base,
      padding: 0,
      marginTop: "-5px",
      fontSize: "18px",
      display: "flex",
      textAlign: "center",
    }),
    singleValue: (base) => ({
      ...base,
      marginTop: "-5px",
      textAlign: "left",
      color: fontcolor,
    }),
    input: (base) => ({
      ...base,
      color: getcolor === "white" ? "black" : fontcolor, // Text color based on background
      caretColor: getcolor === "white" ? "black" : "white", // Cursor color based on background
    }),
    clearIndicator: (base) => ({
      ...base,
      marginTop: "-5px",
    }),
  });

  const dispatch = useDispatch();

  const tableTopColor = "#3368B5";
  const tableHeadColor = "#3368b5";
  const secondaryColor = "white";
  const btnColor = "#3368B5";
  const textColor = "white";

  const [tableData, setTableData] = useState([]);

  // console.log("tableData", tableData);

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
    width: "5%",
  };
  const secondColWidth = {
    width: "9%",
  };
  const thirdColWidth = {
    width: "8%",
  };
  const forthColWidth = {
    width: "6%",
  };
  const fifthColWidth = {
    width: "6%",
  };
  const sixthColWidth = {
    width: "10%",
  };
  const seventhColWidth = {
    width: "8%",
  };
  const eightColWidth = {
    width: "8%",
  };
  const ninthColWidth = {
    width: "10.8%",
  };
  const tenthColWidth = {
    width: "5%",
  };
  const elewnthColWidth = {
    width: "7%",
  };
  const tweltheColWidth = {
    width: "8%",
  };
  const thirteenColWidth = {
    width: "8%",
  };

  //////////////////// COLUMN WIDTH FOR BOTTOM TABLE  /////////////////////////////////
  const bottomfirstColWidth = {
    width: "13%",
  };
  const bottomsecondColWidth = {
    width: "11%",
  };
  const bottomthirdColWidth = {
    width: "10%",
  };
  const bottomforthColWidth = {
    width: "6%",
  };
  const bottomfifthColWidth = {
    width: "6%",
  };
  const bottomsixthColWidth = {
    width: "9%",
  };
  const bottomseventhColWidth = {
    width: "8%",
  };
  const bottomeightColWidth = {
    width: "10%",
  };
  const bottomninthColWidth = {
    width: "10%",
  };
  const bottomtenthColWidth = {
    width: "10%",
  };
  const bottomelewenthColWidth = {
    width: "5.3%",
  };

  /////////////////////////////////////////////////////////////////////////////////////

  useHotkeys("s", fetchReceivableReport);
  useHotkeys("alt+p", exportPDFHandler);
  useHotkeys("alt+e", handleDownloadCSV);
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
    backgroundColor: getcolor,
    width: isSidebarVisible ? "calc(90vw - 0%)" : "90vw",
    Height: "55vh",
    position: "relative",
    top: "40%",
    left: isSidebarVisible ? "50%" : "50%",
    transform: "translate(-50%, -50%)",
    transition: isSidebarVisible
      ? "left 3s ease-in-out, width 2s ease-in-out"
      : "left 3s ease-in-out, width 2s ease-in-out",
    display: "flex",
    justifyContent: "center",
    alignItems: "start",
    overflowX: "hidden",
    overflowY: "hidden",
    wordBreak: "break-word",
    textAlign: "center",
    maxWidth: "1100px",
    fontSize: "15px",
    fontStyle: "normal",
    fontWeight: "400",
    lineHeight: "23px",
    fontFamily: '"Poppins", sans-serif',
  };

  const [isFilterApplied, setIsFilterApplied] = useState(false);
  useEffect(() => {
    if (isFilterApplied || Profits.length > 0) {
      setSelectedIndex(0);
      rowRefs.current[0]?.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    } else {
      setSelectedIndex(-1);
    }
  }, [Profits, isFilterApplied]);

  let totalEnteries = 0;
  const [selectedRowId, setSelectedRowId] = useState(null);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const rowRefs = useRef([]);
  const handleRowClick = (index) => {
    setSelectedIndex(index);
  };
  useEffect(() => {
    if (selectedRowId !== null) {
      const newIndex = Profits.findIndex(
        (item) => item.tcmpcod === selectedRowId
      );
      setSelectedIndex(newIndex);
    }
  }, [Profits, selectedRowId]);
  const handleKeyDown = (e) => {
    if (selectedIndex === -1 || e.target.id === "searchInput") return;
    if (e.key === "ArrowUp") {
      e.preventDefault();
      setSelectedIndex((prevIndex) => Math.max(prevIndex - 1, 0));
      scrollToSelectedRow();
    } else if (e.key === "ArrowDown") {
      e.preventDefault();
      setSelectedIndex((prevIndex) =>
        Math.min(prevIndex + 1, Profits.length - 1)
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
  if (Profits.length > 0) {
    setSelectedIndex(Profits.length - 1); // Select the last row
  }
}, [Profits]);

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
            width: "100%",
            border: `1px solid ${fontcolor}`,
            borderRadius: "9px",
          }}
        >
          <NavComponent textdata="FBR Data" />

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
                className="d-flex align-items-center  "
                style={{ marginLeft: "18px" }}
              >
                <div
                  style={{
                    width: "90x",
                    display: "flex",
                    justifyContent: "end",
                  }}
                >
                  <label htmlFor="fromDatePicker">
                    <span
                      style={{
                        fontFamily: getfontstyle,
                        fontSize: getdatafontsize,
                        fontWeight: "bold",
                      }}
                    >
                      Shop :
                    </span>{" "}
                    <br />
                  </label>
                </div>
                <div style={{ marginLeft: "5px" }}>
                  <Select
                    className="List-select-class"
                    ref={saleSelectRef}
                    options={options}
                    onKeyDown={(e) => handleSaleKeypress(e, fromRef)}
                    id="selectedsale"
                    onChange={(selectedOption) => {
                      if (selectedOption && selectedOption.value) {
                        const labelPart = selectedOption.label.split("-")[1];
                        setSaleType(selectedOption.value);
                        setSelectedLocationCode(selectedOption);
                        setTechnicianselectdatavalue({
                          value: selectedOption.value,
                          label: labelPart, // Set only the 'NGS' part of the label
                        });
                      } else {
                        setSaleType(""); // Clear the saleType state when selectedOption is null (i.e., when the selection is cleared)
                        setTechnicianselectdatavalue("");
                      }
                    }}
                    components={{ Option: DropdownOption }}
                    // styles={customStyles1}
                    styles={customStyles1(!saleType)}
                    isClearable
                    placeholder="ALL"
                  />
                </div>
              </div>

              <div className="d-flex align-items-center">
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
                    onKeyDown={(e) => handleToKeyPress(e, "Repdateid")}
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
                style={{ marginRight: "25px" }}
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
                  ref={input2Ref}
                  onKeyDown={(e) => handleKeyPress(e, input3Ref)}
                  id="typeselecet"
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
                  }}
                >
                  <option value="">All</option>
                  <option value="O">Outstanding </option>
                </select>
              </div>
            </div>
          </div>

          <div>
            <div
              style={{
                overflowY: "auto",
                width: "98.8%",
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
                      SrNo
                    </td>
                    <td className="border-dark" style={secondColWidth}>
                      FBRNo
                    </td>
                    <td className="border-dark" style={thirdColWidth}>
                      Location
                    </td>
                    <td className="border-dark" style={forthColWidth}>
                      Trn#
                    </td>
                    <td className="border-dark" style={fifthColWidth}>
                      Type
                    </td>

                    <td className="border-dark" style={seventhColWidth}>
                      Date
                    </td>

                    <td className="border-dark" style={ninthColWidth}>
                      Customer
                    </td>
                    <td className="border-dark" style={sixthColWidth}>
                      Mobile
                    </td>
                    <td className="border-dark" style={eightColWidth}>
                      SaleAmt
                    </td>
                    <td className="border-dark" style={tenthColWidth}>
                      Qnty
                    </td>
                    <td className="border-dark" style={elewnthColWidth}>
                      TaxAmt
                    </td>
                    <td className="border-dark" style={tweltheColWidth}>
                      TotalSale
                    </td>
                    <td className="border-dark" style={thirteenColWidth}>
                      Discount
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
                maxHeight: "30vh",
                width: "100%",
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
                  ...(Profits.length > 0 ? { tableLayout: "fixed" } : {}),
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
                        <td style={seventhColWidth}></td>
                        <td style={eightColWidth}></td>
                        <td style={sixthColWidth}></td>
                        <td style={ninthColWidth}></td>
                        <td style={tenthColWidth}></td>
                        <td style={elewnthColWidth}></td>
                        <td style={tweltheColWidth}></td>
                        <td style={thirteenColWidth}></td>
                      </tr>
                    </>
                  ) : (
                    <>
                      {Profits.map((item, i) => {
                        totalEnteries += 1;
                        return (
                          <tr
                            // onClick={() => setSelectedInvoice(item.InvNo)}

                            key={`${i}-${selectedIndex}`}
                            ref={(el) => (rowRefs.current[i] = el)}
                            // onClick={() => handleRowClick(i)}
                            onClick={() => {
                              console.log("item", item);
                              setSelectedInvoice(item.InvNo);
                              setSelectedFBRNO(item.FBRNo || "");
                              setSelectedTrnNum(item["Trn#"]);
                              setSelectedTrnTyp(item.Type);

                              handleRowClick(i);
                            }}
                            className={
                              selectedIndex === i ? "selected-background" : ""
                            }
                            style={{
                              backgroundColor: getcolor,
                              color: fontcolor,
                            }}
                          >
                            <td
                              className="text-start"
                              title={item.InvNo}
                              style={{
                                ...firstColWidth,
                                whiteSpace: "nowrap",
                                overflow: "hidden",
                                textOverflow: "ellipsis",
                              }}
                            >
                              {item.SrNo}
                            </td>
                            <td
                              className="text-start"
                              title={item.FBRNo}
                              style={{
                                ...secondColWidth,
                                whiteSpace: "nowrap",
                                overflow: "hidden",
                                textOverflow: "ellipsis",
                              }}
                            >
                              {item.FBRNo}
                            </td>
                            <td
                              className="text-start"
                              title={item.Location}
                              style={{
                                ...thirdColWidth,
                                whiteSpace: "nowrap",
                                overflow: "hidden",
                                textOverflow: "ellipsis",
                              }}
                            >
                              {item.Location}
                            </td>
                            <td
                              className="text-start"
                              title={item["Trn#"]}
                              style={{
                                ...forthColWidth,
                                whiteSpace: "nowrap",
                                overflow: "hidden",
                                textOverflow: "ellipsis",
                              }}
                            >
                              {item["Trn#"]}
                            </td>
                            <td
                              className="text-center"
                              title={item.Type}
                              style={{
                                ...fifthColWidth,
                                whiteSpace: "nowrap",
                                overflow: "hidden",
                                textOverflow: "ellipsis",
                              }}
                            >
                              {item.Type}
                            </td>

                            <td
                              className="text-start"
                              title={item.Date}
                              style={{
                                ...seventhColWidth,
                                whiteSpace: "nowrap",
                                overflow: "hidden",
                                textOverflow: "ellipsis",
                              }}
                            >
                              {item.Date}
                            </td>

                            <td
                              className="text-start"
                              title={item.Customer}
                              style={{
                                ...ninthColWidth,
                                whiteSpace: "nowrap",
                                overflow: "hidden",
                                textOverflow: "ellipsis",
                              }}
                            >
                              {item.Customer}
                            </td>
                            <td
                              className="text-end"
                              title={item.Mobile}
                              style={{
                                ...sixthColWidth,
                                whiteSpace: "nowrap",
                                overflow: "hidden",
                                textOverflow: "ellipsis",
                              }}
                            >
                              {item.Mobile}
                            </td>
                            <td
                              className="text-end"
                              title={item.SaleAmt}
                              style={{
                                ...eightColWidth,
                                whiteSpace: "nowrap",
                                overflow: "hidden",
                                textOverflow: "ellipsis",
                              }}
                            >
                              {item.SaleAmt}
                            </td>

                            <td
                              className="text-end"
                              title={item.Qnty}
                              style={{
                                ...tenthColWidth,
                                whiteSpace: "nowrap",
                                overflow: "hidden",
                                textOverflow: "ellipsis",
                              }}
                            >
                              {item.Qnty}
                            </td>
                            <td
                              className="text-end"
                              title={item.TaxAmt}
                              style={{
                                ...elewnthColWidth,
                                whiteSpace: "nowrap",
                                overflow: "hidden",
                                textOverflow: "ellipsis",
                              }}
                            >
                              {item.TaxAmt}
                            </td>

                            <td
                              className="text-end"
                              title={item.TotalSale}
                              style={{
                                ...tweltheColWidth,
                                whiteSpace: "nowrap",
                                overflow: "hidden",
                                textOverflow: "ellipsis",
                              }}
                            >
                              {item.TotalSale}
                            </td>
                            <td
                              className="text-end"
                              title={item.Discount}
                              style={{
                                ...thirteenColWidth,
                                whiteSpace: "nowrap",
                                overflow: "hidden",
                                textOverflow: "ellipsis",
                              }}
                            >
                              {item.Discount}
                            </td>
                          </tr>
                        );
                      })}
                      {Array.from({
                        length: Math.max(0, 27 - Profits.length),
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
                        <td style={seventhColWidth}></td>
                        <td style={eightColWidth}></td>
                        <td style={sixthColWidth}></td>
                        <td style={ninthColWidth}></td>
                        <td style={tenthColWidth}></td>
                        <td style={elewnthColWidth}></td>
                        <td style={tweltheColWidth}></td>
                        <td style={thirteenColWidth}></td>
                      </tr>
                    </>
                  )}
                </tbody>
              </table>
            </div>

            <div
              style={{
                borderBottom: `1px solid ${fontcolor}`,
                borderTop: `1px solid ${fontcolor}`,
                height: "24px",
                display: "flex",
                paddingRight: "1.2%",
                width: "101.2%",
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
                  ...seventhColWidth,
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
              >
                <span className="mobileledger_total">{TotalSaleAmt}</span>
              </div>
              <div
                style={{
                  ...tenthColWidth,
                  background: getcolor,
                  borderRight: `1px solid ${fontcolor}`,
                }}
              >
                <span className="mobileledger_total">{TotalQnty}</span>
              </div>
              <div
                style={{
                  ...elewnthColWidth,
                  background: getcolor,
                  borderRight: `1px solid ${fontcolor}`,
                }}
              >
                <span className="mobileledger_total">{TotalTaxAmt}</span>
              </div>
              <div
                style={{
                  ...tweltheColWidth,
                  background: getcolor,
                  borderRight: `1px solid ${fontcolor}`,
                }}
              >
                <span className="mobileledger_total">{TotalTotalSale}</span>
              </div>
              <div
                style={{
                  ...thirteenColWidth,
                  background: getcolor,
                  borderRight: `1px solid ${fontcolor}`,
                }}
              >
                <span className="mobileledger_total">{TotalDiscount}</span>
              </div>
            </div>

            <div style={{ display: "flex" }}>
              <div style={{ width: "30%", marginTop: "5px" }}>
                <div
                  className="row"
                  style={{
                    width: "100%",
                    height: "24px",
                    display: "flex",
                    margin: "0px",
                  }}
                >
                  <div
                    style={{
                      width: "25%",
                      textAlign: "end",
                      fontSize: getdatafontsize,
                      fontFamily: getfontstyle,
                    }}
                  >
                    Sale # :
                  </div>
                  <div
                    style={{
                      width: "20%",
                      border: `1px solid ${fontcolor} `,
                      padding: "0px",
                      fontSize: getdatafontsize,
                      fontFamily: getfontstyle,
                      textAlign: "left",
                    }}
                  >
                    <span className="mobileledger_total1">
                      {fbrheader.length > 0 ? fbrheader[0].SaleNo : ""}
                    </span>
                  </div>
                </div>
                <div
                  className="row"
                  style={{
                    width: "100%",
                    height: "24px",
                    display: "flex",
                    margin: "0px",
                  }}
                >
                  <div
                    style={{
                      width: "25%",
                      textAlign: "end",
                      fontSize: getdatafontsize,
                      fontFamily: getfontstyle,
                    }}
                  >
                    Date :
                  </div>
                  <div
                    style={{
                      width: "30%",
                      border: `1px solid ${fontcolor} `,
                      fontSize: getdatafontsize,
                      fontFamily: getfontstyle,
                      textAlign: "left",
                      padding: "0px",
                    }}
                  >
                    <span className="mobileledger_total1">
                      {fbrheader.length > 0 ? fbrheader[0].Date : ""}
                    </span>
                  </div>
                </div>

                <div
                  className="row"
                  style={{
                    width: "100%",
                    height: "24px",
                    display: "flex",
                    margin: "0px",
                  }}
                >
                  <div
                    style={{
                      width: "25%",
                      textAlign: "end",
                      fontSize: getdatafontsize,
                      fontFamily: getfontstyle,
                    }}
                  >
                    Mobile :
                  </div>
                  <div
                    style={{
                      width: "35%",
                      border: `1px solid ${fontcolor} `,
                      fontSize: getdatafontsize,
                      fontFamily: getfontstyle,
                      textAlign: "left",
                    }}
                  >
                    <span className="mobileledger_total">
                      {fbrheader.length > 0 ? fbrheader[0].Mobile : ""}
                    </span>
                  </div>
                </div>
                <div
                  className="row"
                  style={{
                    width: "100%",
                    height: "24px",
                    display: "flex",
                    margin: "0px",
                  }}
                >
                  <div
                    style={{
                      width: "25%",
                      textAlign: "end",
                      fontSize: getdatafontsize,
                      fontFamily: getfontstyle,
                    }}
                  >
                    Name :
                  </div>
                  <div
                    style={{
                      width: "60%",
                      border: `1px solid ${fontcolor} `,
                      fontSize: getdatafontsize,
                      fontFamily: getfontstyle,
                      padding: "0px",
                      textAlign: "left",
                    }}
                  >
                    <span className="mobileledger_total2">
                      {fbrheader.length > 0 ? fbrheader[0].Customer : ""}
                    </span>
                  </div>
                </div>

                <div
                  className="row"
                  style={{
                    width: "100%",
                    height: "24px",
                    display: "flex",
                    margin: "0px",
                  }}
                >
                  <div
                    style={{
                      width: "25%",
                      textAlign: "end",
                      fontSize: getdatafontsize,
                      fontFamily: getfontstyle,
                    }}
                  >
                    NIC :
                  </div>
                  <div
                    style={{
                      width: "40%",
                      border: `1px solid ${fontcolor} `,
                      fontSize: getdatafontsize,
                      fontFamily: getfontstyle,
                      textAlign: "left",

                      padding: "0px",
                    }}
                  >
                    <span className="mobileledger_total1">
                      {fbrheader.length > 0 ? fbrheader[0].CNIC : ""}
                    </span>
                  </div>
                </div>
                <div
                  className="row"
                  style={{
                    width: "100%",
                    height: "24px",
                    display: "flex",
                    margin: "0px",
                  }}
                >
                  <div
                    style={{
                      width: "25%",
                      textAlign: "end",
                      fontSize: getdatafontsize,
                      fontFamily: getfontstyle,
                    }}
                  >
                    NTN :
                  </div>
                  <div
                    style={{
                      width: "30%",
                      border: `1px solid ${fontcolor} `,
                      fontSize: getdatafontsize,
                      fontFamily: getfontstyle,
                      textAlign: "left",
                      padding: "0px",
                    }}
                  >
                    <span className="mobileledger_total2">
                      {fbrheader.length > 0 ? fbrheader[0].NTN : ""}
                    </span>
                  </div>
                </div>
              </div>

              <div style={{ width: "70%", border: "1px solid white" }}>
                <div
                  style={{
                    overflowY: "auto",
                    width: "98%",
                  }}
                >
                  <table
                    className="myTable"
                    id="table"
                    style={{
                      fontSize: "12px",
                      width: "100%",
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
                          style={bottomelewenthColWidth}
                        >
                          Sr
                        </td>
                        <td className="border-dark" style={bottomfirstColWidth}>
                          code
                        </td>
                        <td
                          className="border-dark"
                          style={bottomsecondColWidth}
                        >
                          Name
                        </td>
                        <td className="border-dark" style={bottomthirdColWidth}>
                          PCT
                        </td>
                        <td className="border-dark" style={bottomforthColWidth}>
                          Type
                        </td>
                        <td className="border-dark" style={bottomfifthColWidth}>
                          Qnty
                        </td>
                        <td className="border-dark" style={bottomsixthColWidth}>
                          Sale
                        </td>
                        <td
                          className="border-dark"
                          style={bottomseventhColWidth}
                        >
                          Tax Rt
                        </td>
                        <td className="border-dark" style={bottomeightColWidth}>
                          Tax Amt
                        </td>
                        <td className="border-dark" style={bottomninthColWidth}>
                          Tot Sale
                        </td>
                        <td className="border-dark" style={bottomtenthColWidth}>
                          Discont
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
                    maxHeight: "20vh",
                    width: "100%",
                    wordBreak: "break-word",
                  }}
                >
                  <table
                    className="myTable"
                    id="tableBody"
                    style={{
                      fontSize: "12px",
                      width: "100%",
                      position: "relative",
                      ...(fbrdetail.length > 0 ? { tableLayout: "fixed" } : {}),
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
                                {Array.from({ length: 11 }).map(
                                  (_, colIndex) => (
                                    <td key={`blank-${rowIndex}-${colIndex}`}>
                                      &nbsp;
                                    </td>
                                  )
                                )}
                              </tr>
                            )
                          )}
                          <tr>
                            <td style={bottomelewenthColWidth}></td>
                            <td style={bottomfirstColWidth}></td>
                            <td style={bottomsecondColWidth}></td>
                            <td style={bottomthirdColWidth}></td>
                            <td style={bottomforthColWidth}></td>
                            <td style={bottomfifthColWidth}></td>
                            <td style={bottomsixthColWidth}></td>
                            <td style={bottomseventhColWidth}></td>
                            <td style={bottomeightColWidth}></td>
                            <td style={bottomninthColWidth}></td>
                            <td style={bottomtenthColWidth}></td>
                          </tr>
                        </>
                      ) : (
                        <>
                          {fbrdetail.map((item, i) => {
                            // totalEnteries += 1;
                            return (
                              <tr
                                // key={`${i}-${selectedIndex}`}
                                // ref={(el) => (rowRefs.current[i] = el)}
                                // onClick={() => handleRowClick(i)}
                                // className={
                                //     selectedIndex === i ? "selected-background" : ""

                                // }
                                style={{
                                  backgroundColor: getcolor,
                                  color: fontcolor,
                                }}
                              >
                                <td
                                  className="text-center"
                                  title={item.Sr}
                                  style={{
                                    ...bottomelewenthColWidth,
                                    whiteSpace: "nowrap",
                                    overflow: "hidden",
                                    textOverflow: "ellipsis",
                                  }}
                                >
                                  {item.Sr}
                                </td>
                                <td
                                  className="text-start"
                                  title={item.ItemCode}
                                  style={{
                                    ...bottomfirstColWidth,
                                    whiteSpace: "nowrap",
                                    overflow: "hidden",
                                    textOverflow: "ellipsis",
                                  }}
                                >
                                  {item.ItemCode}
                                </td>
                                <td
                                  className="text-start"
                                  title={item.ItemName}
                                  style={{
                                    ...bottomsecondColWidth,
                                    whiteSpace: "nowrap",
                                    overflow: "hidden",
                                    textOverflow: "ellipsis",
                                  }}
                                >
                                  {item.ItemName}
                                </td>
                                <td
                                  className="text-start"
                                  title={item.PCTCode}
                                  style={{
                                    ...bottomthirdColWidth,
                                    whiteSpace: "nowrap",
                                    overflow: "hidden",
                                    textOverflow: "ellipsis",
                                  }}
                                >
                                  {item.PCTCode}
                                </td>
                                <td
                                  className="text-end"
                                  title={item.InvoiceType}
                                  style={{
                                    ...bottomforthColWidth,
                                    whiteSpace: "nowrap",
                                    overflow: "hidden",
                                    textOverflow: "ellipsis",
                                  }}
                                >
                                  {item.InvoiceType}
                                </td>
                                <td
                                  className="text-end"
                                  title={item.Quantity}
                                  style={{
                                    ...bottomfifthColWidth,
                                    whiteSpace: "nowrap",
                                    overflow: "hidden",
                                    textOverflow: "ellipsis",
                                  }}
                                >
                                  {item.Quantity}
                                </td>
                                <td
                                  className="text-end"
                                  title={item.SaleValue}
                                  style={{
                                    ...bottomsixthColWidth,
                                    whiteSpace: "nowrap",
                                    overflow: "hidden",
                                    textOverflow: "ellipsis",
                                  }}
                                >
                                  {item.SaleValue}
                                </td>
                                <td
                                  className="text-end"
                                  title={item.TaxRate}
                                  style={{
                                    ...bottomseventhColWidth,
                                    whiteSpace: "nowrap",
                                    overflow: "hidden",
                                    textOverflow: "ellipsis",
                                  }}
                                >
                                  {item.TaxRate}
                                </td>
                                <td
                                  className="text-end"
                                  title={item.TaxCharged}
                                  style={{
                                    ...bottomeightColWidth,
                                    whiteSpace: "nowrap",
                                    overflow: "hidden",
                                    textOverflow: "ellipsis",
                                  }}
                                >
                                  {item.TaxCharged}
                                </td>
                                <td
                                  className="text-end"
                                  title={item.TotalAmount}
                                  style={{
                                    ...bottomninthColWidth,
                                    whiteSpace: "nowrap",
                                    overflow: "hidden",
                                    textOverflow: "ellipsis",
                                  }}
                                >
                                  {item.TotalAmount}
                                </td>
                                <td
                                  className="text-end"
                                  title={item.Discount}
                                  style={{
                                    ...bottomtenthColWidth,
                                    whiteSpace: "nowrap",
                                    overflow: "hidden",
                                    textOverflow: "ellipsis",
                                  }}
                                >
                                  {item.Discount}
                                </td>
                              </tr>
                            );
                          })}
                          {Array.from({
                            length: Math.max(0, 27 - Expenses.length),
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
                            <td style={bottomelewenthColWidth}></td>
                            <td style={bottomfirstColWidth}></td>
                            <td style={bottomsecondColWidth}></td>
                            <td style={bottomthirdColWidth}></td>
                            <td style={bottomforthColWidth}></td>
                            <td style={bottomfifthColWidth}></td>
                            <td style={bottomsixthColWidth}></td>
                            <td style={bottomseventhColWidth}></td>
                            <td style={bottomeightColWidth}></td>
                            <td style={bottomninthColWidth}></td>
                            <td style={bottomtenthColWidth}></td>
                          </tr>
                        </>
                      )}
                    </tbody>
                  </table>
                </div>

                <div
                  style={{
                    borderBottom: `1px solid ${fontcolor}`,
                    borderTop: `1px solid ${fontcolor}`,
                    height: "24px",
                    display: "flex",
                    paddingRight: "1.2%",
                    width: "101.2%",
                  }}
                >
                  <div
                    style={{
                      ...bottomelewenthColWidth,
                      background: getcolor,
                      borderRight: `1px solid ${fontcolor}`,
                    }}
                  ></div>
                  <div
                    style={{
                      ...bottomfirstColWidth,
                      background: getcolor,
                      borderRight: `1px solid ${fontcolor}`,
                    }}
                  ></div>
                  <div
                    style={{
                      ...bottomsecondColWidth,
                      background: getcolor,
                      borderRight: `1px solid ${fontcolor}`,
                    }}
                  ></div>
                  <div
                    style={{
                      ...bottomthirdColWidth,
                      background: getcolor,
                      borderRight: `1px solid ${fontcolor}`,
                    }}
                  ></div>
                  <div
                    style={{
                      ...bottomforthColWidth,
                      background: getcolor,
                      borderRight: `1px solid ${fontcolor}`,
                    }}
                  ></div>
                  <div
                    style={{
                      ...bottomfifthColWidth,
                      background: getcolor,
                      borderRight: `1px solid ${fontcolor}`,
                    }}
                  >
                    <span className="mobileledger_total">{fbrTotalQnty}</span>
                  </div>

                  <div
                    style={{
                      ...bottomsixthColWidth,
                      background: getcolor,
                      borderRight: `1px solid ${fontcolor}`,
                    }}
                  >
                    <span className="mobileledger_total">
                      {fbrTotalSaleAmt}
                    </span>
                  </div>

                  <div
                    style={{
                      ...bottomseventhColWidth,
                      background: getcolor,
                      borderRight: `1px solid ${fontcolor}`,
                    }}
                  ></div>
                  <div
                    style={{
                      ...bottomeightColWidth,
                      background: getcolor,
                      borderRight: `1px solid ${fontcolor}`,
                    }}
                  >
                    <span className="mobileledger_total">{fbrTotalTaxAmt}</span>
                  </div>
                  <div
                    style={{
                      ...bottomninthColWidth,
                      background: getcolor,
                      borderRight: `1px solid ${fontcolor}`,
                    }}
                  >
                    <span className="mobileledger_total">
                      {fbrTotalTotalSale}
                    </span>
                  </div>
                  <div
                    style={{
                      ...bottomtenthColWidth,
                      background: getcolor,
                      borderRight: `1px solid ${fontcolor}`,
                    }}
                  >
                    <span className="mobileledger_total">
                      {fbrTotalDiscount}
                    </span>
                  </div>
                </div>
              </div>
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
              // id="searchsubmit"
              text="JSON "
              // ref={input3Ref}
              onClick={fetchSaleData}
              onFocus={(e) => (e.currentTarget.style.border = "2px solid red")}
              onBlur={(e) =>
                (e.currentTarget.style.border = `1px solid ${fontcolor}`)
              }
            />

            <SingleButton
              text="Update"
              ref={input3Ref}
              onClick={() => {
                // Check if selectedFBRNO is blank/null/undefined
                if (!selectedFBRNO) {
                  fetchSaleDataUpdate();
                  // alert(`1 alert ${selectedFBRNO}`);
                  // alert(`${getposid}2 alert ${selectedFBRNO}`);

                  return;
                }

                // Check if first 6 characters match (you need to define what they should match with)
                // Assuming you want to compare first 6 chars of getposid and selectedFBRNO
                if (
                  getposid.substring(0, 6) === selectedFBRNO.substring(0, 6)
                ) {
                  toast.dismiss();
                  toast.error("Already Updated");
                } else {
                  toast.error("Problem your FBR Number");
                }
              }}
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
            {/* <CustomerModal
              isOpen={openmodel}
              handleClose={handleCloseModal}
              title="FBR DATA"
              invoiceData={getmodelshowingdata}
            />
            <CustomerModalUpdate
              isOpen={openmodelUpdate}
              handleClose={handleCloseModalUpdate}
              title="FBR DATA UPDATE"
              invoiceData={getmodelshowingdataUpdate}
            /> */}
          </div>
        </div>
      </div>
    </>
  );
}
