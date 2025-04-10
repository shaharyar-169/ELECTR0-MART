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
  console.log("companyselectdatavalue", Companyselectdatavalue);

  const [searchQuery, setSearchQuery] = useState("");
  const [transectionType, settransectionType] = useState("A");
  const [supplierList, setSupplierList] = useState([]);
  console.log("supplierList", supplierList);

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
      FltmCod: saleType,
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

  useEffect(() => {
    if (isOptionsLoaded && options.length > 0 && !saleType && !hasInitialized.current) {
        const firstOption = options[0];
        setSaleType(firstOption.value);
        
        const fullLabel = firstOption.label;
        const description = fullLabel.split('-').pop()?.trim();
        
        setCompanyselectdatavalue({
            value: firstOption.value,
            label: description,
            fullLabel: fullLabel
        });

        // Mark as initialized
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
      width: 450,
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

  const handleTransactionTypeChange = (event) => {
    const selectedTransactionType = event.target.value;
    settransectionType(selectedTransactionType);
  };

  ///////////////////////////// DOWNLOAD PDF CODE ////////////////////////////////////////////////////////////
  const exportPDFHandler = () => {
    const globalfontsize = 12;
    console.log("gobal font data", globalfontsize);

    // Create a new jsPDF instance with landscape orientation
    const doc = new jsPDF({ orientation: "landscape" });

    // Define table data (rows)
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

    // Add summary row to the table
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

    // Define table column headers and individual column widths
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
      "Average",
    ];
    const columnWidths = [20, 14, 70, 18, 18, 18, 18, 18, 18, 22, 18];

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
        const isRedRow = row[0] && parseInt(row[0]) > 10000000000; // Check if tctgcod is greater than 100
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
          doc.setFont(fontName, "normal");

          // Ensure the cell value is a string
          const cellValue = String(cell);

          if (
            cellIndex === 3 ||
            cellIndex === 4 ||
            cellIndex === 5 ||
            cellIndex === 6 ||
            cellIndex === 7 ||
            cellIndex === 8 ||
            cellIndex === 9 ||
            cellIndex === 10
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

        addTitle(`Item Evalution Report`, "", "", pageNumber, startY, 12); // Render sale report title with decreased font size, provide the time, and page number
        startY += -5;

        const labelsX = (doc.internal.pageSize.width - totalWidth) / 2;
        const labelsY = startY + 4; // Position the labels below the titles and above the table

        // Set font size and weight for the labels
        doc.setFontSize(12);
        doc.setFont(getfontstyle, "300");

        let status =
          transectionType === "A"
            ? "Average"
            : transectionType === "W"
            ? "Weighted Average"
            : "";

        let search = Companyselectdatavalue.label
          ? Companyselectdatavalue.label
          : "ALL";
        // Set font style, size, and family
        doc.setFont(getfontstyle, "300"); // Font family and style ('normal', 'bold', 'italic', etc.)
        doc.setFontSize(10); // Font size

        doc.setFont(getfontstyle, "bold"); // Set font to bold
        doc.text(`Item :`, labelsX, labelsY + 8.5); // Draw bold label
        doc.setFont(getfontstyle, "normal"); // Reset font to normal
        doc.text(`${search}`, labelsX + 15, labelsY + 8.5); // Draw the value next to the label

        doc.setFont(getfontstyle, "bold"); // Set font to bold
        doc.text(`Type :`, labelsX + 200, labelsY + 8.5); // Draw bold label
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
    doc.save(`ItemEvaluationReport As On ${date}.pdf`);
  };
  ///////////////////////////// DOWNLOAD PDF EXCEL //////////////////////////////////////////////////////////
  const handleDownloadCSV = async () => {
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet("Sheet1");

    const numColumns = 6; // Number of columns

    const columnAlignments = [
      "left",
      "left",
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

    // Add an empty row at the start
    worksheet.addRow([]);

    // Add title rows

    [comapnyname, `Item Evaluation Report`].forEach((title, index) => {
      // Define custom styles for each title
      let customStyle;
      let rowHeight = 20; // Default row height
      if (index === 0) {
        // Style for company name
        customStyle = {
          font: { family: getfontstyle, size: 18, bold: true },
          alignment: { horizontal: "center" },
        };
        rowHeight = 30; // Increase row height for company name to avoid overlap
      } else {
        // Style for "Document Edit Report From"
        customStyle = {
          font: { family: getfontstyle, size: getdatafontsize, bold: false },
          alignment: { horizontal: "center" },
        };
      }

      // Add row with empty columns before the title
      let row = worksheet.addRow(["", "", title]);

      // Apply styles only to the title cell (third column)
      row.getCell(3).style = customStyle;

      // Adjust row height
      worksheet.getRow(row.number).height = rowHeight;

      // Merge the cells for the title, shifting 2 columns forward
      worksheet.mergeCells(
        `C${row.number}:${String.fromCharCode(66 + numColumns)}${row.number}`
      );
    });

    // Add an empty row after the title section
    worksheet.addRow([]); // This is where you add the empty row

    let typestatus = "";

    if (transectionType === "A") {
      typestatus = "Average";
    } else if (transectionType === "W") {
      typestatus = "Weighted Average";
    } else {
      typestatus = "Average"; // Default value
    }

    let typesearch = Companyselectdatavalue.label
      ? Companyselectdatavalue.label
      : "ALL";
    const typeAndStoreRow3 = worksheet.addRow([
      "Item :",
      typesearch,
      "",
      "",
      "",
      "",
      "",
      "",
      "",
      "Type :",
      typestatus,
    ]);

    const applyStatusRowStyle = (row, boldColumns = []) => {
      row.eachCell((cell, colIndex) => {
        // Check if the current cell is in the boldColumns array
        const isBold = boldColumns.includes(colIndex);

        cell.font = {
          family: getfontstyle, // Your desired font family
          size: getdatafontsize, // Your desired font size
          bold: isBold, // Bold only for specific columns
        };

        cell.alignment = {
          horizontal: "left", // Align text to the left
          vertical: "middle", // Vertically align to the middle
        };

        cell.border = null; // Remove borders
      });
    };

    // Bold specific columns (labels)

    applyStatusRowStyle(typeAndStoreRow3, [1, 10]); // Column 1 for "COMPANY:", Column 4 for "CAPACITY:"

    // Header style for center alignment
    const headerStyle = {
      font: { bold: true, family: getfontstyle, size: getdatafontsize },
      alignment: { horizontal: "center", vertical: "middle" }, // Center-align horizontally and vertically
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
      "Amoount",
      "Avg Rete",
    ];
    const headerRow = worksheet.addRow(headers);

    // Apply styles and center alignment to the header row
    headerRow.eachCell((cell) => {
      cell.style = { ...headerStyle };
    });

    // Add data rows

    // Add data rows
    tableData.forEach((item) => {
      const row = worksheet.addRow([
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

      // Apply custom styles to each cell in the row
      row.eachCell((cell, colIndex) => {
        cell.font = {
          family: getfontstyle, // Set your desired font family
          size: getdatafontsize, // Set the font size
          bold: false, // Make the font bold
        };

        cell.border = {
          top: { style: "thin", color: { argb: "FF000000" } }, // Top border (black)
          left: { style: "thin", color: { argb: "FF000000" } }, // Left border (black)
          bottom: { style: "thin", color: { argb: "FF000000" } }, // Bottom border (black)
          right: { style: "thin", color: { argb: "FF000000" } }, // Right border (black)
        };

        // Align cell content based on columnAlignments array
        const alignment = columnAlignments[colIndex - 1] || "left"; // Default to 'left' if not defined
        cell.alignment = {
          horizontal: alignment,
          vertical: "middle", // Vertically align to the middle
        };
      });
    });

    const totalRow = worksheet.addRow([
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
      if (
        colNumber === 5 ||
        colNumber === 6 ||
        colNumber === 7 ||
        colNumber === 8 ||
        colNumber === 9
      ) {
        cell.alignment = { horizontal: "right" };
      }
    });

    // Set column widths

    [12, 8, 40, 11, 11, 11, 11, 11, 11, 14, 11].forEach((width, index) => {
      worksheet.getColumn(index + 1).width = width;
    });

    const getCurrentDate = () => {
      const today = new Date();
      const dd = String(today.getDate()).padStart(2, "0");
      const mm = String(today.getMonth() + 1).padStart(2, "0"); // January is 0!
      const yyyy = today.getFullYear();
      return dd + "/" + mm + "/" + yyyy;
    };

    const currentdate = getCurrentDate();

    // Generate Excel file buffer and save
    const buffer = await workbook.xlsx.writeBuffer();
    const blob = new Blob([buffer], {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    });
    saveAs(blob, `ItemEvaluationReport As on ${currentdate}.xlsx`);
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

  const firstColWidth = {
    width: "8%",
  };
  const secondColWidth = {
    width: "5.5%",
  };
  const thirdColWidth = {
    width: "3.7%",
  };
  const fifthColWidth = {
    width: "7%",
  };
  const sixthColWidth = {
    width: "22.8%",
  };
  const seventhColWidth = {
    width: "7.5%",
  };
  const eightColWidth = {
    width: "7.5%",
  };
  const ninthColWidth = {
    width: "7.5%",
  };
  const tenthColWidth = {
    width: "7.5%",
  };

  const elewenthColWidth = {
    width: "8.5%",
  };
  const tewlthColWidth = {
    width: "8.5%",
  };

  const thirteenColWidth = {
    width: "8.5%",
  };

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
    width: isSidebarVisible ? "calc(80vw - 0%)" : "80vw",
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
    maxWidth: "1000px",
    fontSize: "15px",
    fontStyle: "normal",
    fontWeight: "400",
    lineHeight: "23px",
    fontFamily: '"Poppins", sans-serif',
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
          <NavComponent textdata="Item Evaluation Report" />

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
                        const labelPart = selectedOption.label.split("-")[1];
                        setSaleType(selectedOption.value);
                        setCompanyselectdatavalue({
                          value: selectedOption.value,
                          label: labelPart, // Set only the 'NGS' part of the label
                        });
                      } else {
                        setSaleType(""); // Clear the saleType state when selectedOption is null (i.e., when the selection is cleared)
                        setCompanyselectdatavalue("");
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
                  <option value="A">Average</option>
                  <option value="W">Weighted Average</option>
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
                              title={item.amount}
                              style={{
                                ...tewlthColWidth,
                                whiteSpace: "nowrap",
                                overflow: "hidden",
                                textOverflow: "ellipsis",
                              }}
                            >
                              {item.amount}
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
