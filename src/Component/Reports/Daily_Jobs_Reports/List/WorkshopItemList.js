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
import { SkipNextSharp } from "@mui/icons-material";

export default function WorkShopItemList() {
  const navigate = useNavigate();
  const user = getUserData();
  const organisation = getOrganisationData();
  const yeardescription = getYearDescription();
  const locationnumber = getLocationnumber();

  const saleSelectRef = useRef(null);
  const input1Ref = useRef(null);
  const input2Ref = useRef(null);
  const input3Ref = useRef(null);
  const input4Ref = useRef(null);
  const input5Ref = useRef(null);
  const input6Ref = useRef(null);

  const [Companyselectdata, setCompanyselectdata] = useState("");

  console.log("Companyselectdata", Companyselectdata);
  const [Companyselectdatavalue, setCompanyselectdatavalue] = useState("");
  console.log("Companyselectdatavalue", Companyselectdatavalue.label);

  const [GetCompany, setGetCompany] = useState([]);

  const [Capacityselectdata, setCapacityselectdata] = useState("");
  const [capacityselectdatavalue, setcapacityselectdatavalue] = useState("");

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
    getLocationNumber,
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

  //////////////////////// CUSTOM DATE LIMITS ////////////////////////////

  // Toggle the ToDATE && FromDATE CalendarOpen state on each click

  function fetchReceivableReport() {
    const apiUrl = apiLinks + "/WorkshopItemList.php";
    setIsLoading(true);
    const formData = new URLSearchParams({
      FItmSts: transectionType,
      FCtgCod: Categoryselectdata,
      FCmpCod: Companyselectdata,
      FSchTxt: searchQuery,
      FTypCod: Typeselectdata,
      code: organisation.code,
      FLocCod: locationnumber || getLocationNumber,
      FYerDsc: yeardescription || getYearDescription,



      
    }).toString();

    axios
      .post(apiUrl, formData)
      .then((response) => {
        setIsLoading(false);

        if (response.data && Array.isArray(response.data)) {
          setTableData(response.data);
        } else {
          // console.warn(
          //   "Response data structure is not as expected:",
          //   response.data
          // );
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
    const apiUrl = apiLinks + "/GetActiveCompany.php";
    const formData = new URLSearchParams({
        code: organisation.code,
        FLocCod: locationnumber || getLocationNumber,
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
        FLocCod: locationnumber || getLocationNumber,
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
    const apiUrl = apiLinks + "/GetActiveType.php";
    const formData = new URLSearchParams({
        code: organisation.code,
        FLocCod: locationnumber || getLocationNumber,
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
      caretColor: getcolor === "white" ? "black" : "white",
      borderRadius: 0,
      border: `1px solid ${fontcolor}`,
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

  ///////////////////////////// DOWNLOAD PDF CODE ////////////////////////////////////////////////////////////
  const exportPDFHandler = () => {
    const globalfontsize = 12;
    console.log("gobal font data", globalfontsize);

    // Create a new jsPDF instance with landscape orientation
    const doc = new jsPDF({ orientation: "landscape" });

    // Define table data (rows)
    const rows = tableData.map((item) => [
      item.Code,
      item.Description,
      item.Company,
      item.Category,
      item.Status,
      item.Type,
    ]);

    // Add summary row to the table
    // rows.push(["", "", "", "", "", ""]);

    // Define table column headers and individual column widths
    const headers = [
      "Code",
      "Description",
      "Company",
      "Category",
      "Status",
      "Type",
    ];
    const columnWidths = [15, 80, 30, 30, 15, 30];

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

        // Set background color for odd-numbered rows
        // if (isOddRow) {
        // 	doc.setFillColor(240); // Light background color
        // 	doc.rect(
        // 		startX,
        // 		startY + (i - startIndex + 2) * rowHeight,
        // 		tableWidth,
        // 		rowHeight,
        // 		"F"
        // 	);
        // }

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

          if (cellIndex === 4) {
            const rightAlignX = startX + columnWidths[cellIndex] / 2; // Adjust for right alignment
            doc.text(cellValue, rightAlignX, cellY, {
                align: "center",
                baseline: "middle",
            });
        } else if (cellIndex === 13 ) {
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
          rightX - 40,
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

        addTitle(`Workshop Item List`, "", "", pageNumber, startY, 12); // Render sale report title with decreased font size, provide the time, and page number
        startY += 5;

        const labelsX = (doc.internal.pageSize.width - totalWidth) / 2;
        const labelsY = startY + 4; // Position the labels below the titles and above the table

        // Set font size and weight for the labels
        doc.setFontSize(12);
        doc.setFont(getfontstyle, "300");

        let typeText = capacityselectdatavalue.label
          ? capacityselectdatavalue.label
          : "ALL";
        let typeItem = Companyselectdatavalue.label
          ? Companyselectdatavalue.label
          : "ALL";
        let category = categoryselectdatavalue.label
          ? categoryselectdatavalue.label
          : "ALL";
        let typename = typeselectdatavalue.label
          ? typeselectdatavalue.label
          : "ALL";
        let status = transectionType ? transectionType : "All";

        let search = searchQuery ? searchQuery : "";

        // Set font style, size, and family
        doc.setFont(getfontstyle, "300"); // Font family and style ('normal', 'bold', 'italic', etc.)
        doc.setFontSize(10); // Font size

        doc.setFont(getfontstyle, "bold"); // Set font to bold
        doc.text(`COMPANY :`, labelsX, labelsY); // Draw bold label
        doc.setFont(getfontstyle, "normal"); // Reset font to normal
        doc.text(`${typeItem}`, labelsX + 25, labelsY); // Draw the value next to the label

        doc.setFont(getfontstyle, "bold"); // Set font to bold
        doc.text(`TYPE :`, labelsX + 150, labelsY); // Draw bold label
        doc.setFont(getfontstyle, "normal"); // Reset font to normal
        doc.text(`${typename}`, labelsX + 170, labelsY); // Draw the value next to the label

        doc.setFont(getfontstyle, "bold"); // Set font to bold
        doc.text(`CATEGORY :`, labelsX, labelsY + 4.3); // Draw bold label
        doc.setFont(getfontstyle, "normal"); // Reset font to normal
        doc.text(`${category}`, labelsX + 25, labelsY + 4.3); // Draw the value next to the label

        doc.setFont(getfontstyle, "bold"); // Set font to bold
        doc.text(`STATUS :`, labelsX + 150, labelsY + 4.3); // Draw bold label
        doc.setFont(getfontstyle, "normal"); // Reset font to normal
        doc.text(`${status}`, labelsX + 170, labelsY + 4.3); // Draw the value next to the label

        // doc.setFont(getfontstyle, "bold"); // Set font to bold
        // doc.text(`CAPACITY :`, labelsX, labelsY + 8.5); // Draw bold label
        // doc.setFont(getfontstyle, "normal"); // Reset font to normal
        // doc.text(`${typeText}`, labelsX + 25, labelsY + 8.5); // Draw the value next to the label

        if (searchQuery) {
          doc.setFont(getfontstyle, "bold"); // Set font to bold
          doc.text(`SEARCH :`, labelsX + 150, labelsY + 8.5); // Draw bold label
          doc.setFont(getfontstyle, "normal"); // Reset font to normal
          doc.text(`${search}`, labelsX + 170, labelsY + 8.5); // Draw the value next to the label
        }

        // // Reset font weight to normal if necessary for subsequent text
        doc.setFont(getfontstyle, "bold"); // Set font to bold
        doc.setFontSize(10);

        startY += 10; // Adjust vertical position for the labels

        addTableHeaders((doc.internal.pageSize.width - totalWidth) / 2, 39);
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
    doc.save(`WorkshopItemList As On ${date}.pdf`);
  };
  ///////////////////////////// DOWNLOAD PDF CODE ////////////////////////////////////////////////////////////

  ///////////////////////////// DOWNLOAD PDF EXCEL //////////////////////////////////////////////////////////

  const handleDownloadCSV = async () => {
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet("Sheet1");

    const numColumns = 6; // Ensure this matches the actual number of columns

    const columnAlignments = ["left", "left", "left", "left", "center", "left"];

    // Define fonts for different sections
    const fontCompanyName = { name: 'CustomFont' || "CustomFont", size: 18, bold: true };
    const fontStoreList = { name: 'CustomFont' || "CustomFont", size: 10, bold: false };
    const fontHeader = { name: 'CustomFont' || "CustomFont", size: 10, bold: true };
    const fontTableContent = { name: 'CustomFont' || "CustomFont", size: 10, bold: false };

    // Add an empty row at the start
    worksheet.addRow([]);

    // Add company name
    const companyRow = worksheet.addRow([comapnyname]);
    companyRow.eachCell((cell) => {
      cell.font = fontCompanyName;
      cell.alignment = { horizontal: "center" };
    });

    worksheet.getRow(companyRow.number).height = 30;
    worksheet.mergeCells(`A${companyRow.number}:${String.fromCharCode(65 + numColumns - 1)}${companyRow.number}`);

    // Add Store List row
    const storeListRow = worksheet.addRow(["Workshop Item List"]);
    storeListRow.eachCell((cell) => {
      cell.font = fontStoreList;
      cell.alignment = { horizontal: "center" };
    });

    worksheet.mergeCells(`A${storeListRow.number}:${String.fromCharCode(65 + numColumns - 1)}${storeListRow.number}`);

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
    let typestatus = transectionType ? transectionType : "All";
    let typesearch = searchQuery ? searchQuery : "";

    // Add first row
    const typeAndStoreRow = worksheet.addRow([
      "COMPANY :",
      typecompany,
      "",
      "",
      "TYPE :",
      typetype,
    ]);

    // Add second row
    const typeAndStoreRow2 = worksheet.addRow([
      "CATEGORY :",
      typecategory,
      "",
      "",
      "STATUS :",
      typestatus,
    ]);

    // Add third row with conditional rendering for "SEARCH:"
    const typeAndStoreRow3 = worksheet.addRow(
      searchQuery
        ? ["", "", "", "", "SEARCH :", typesearch]
        : [""]
    );

    // Apply styling for the status row
    typeAndStoreRow.eachCell((cell, colIndex) => {
      cell.font = { name: 'CustomFont' || "CustomFont", size: 10, bold: [1, 5].includes(colIndex) };
      cell.alignment = { horizontal: "left", vertical: "middle" };
    });
    typeAndStoreRow2.eachCell((cell, colIndex) => {
      cell.font = { name: 'CustomFont' || "CustomFont", size: 10, bold: [1, 5].includes(colIndex) };
      cell.alignment = { horizontal: "left", vertical: "middle" };
    });
    typeAndStoreRow3.eachCell((cell, colIndex) => {
      cell.font = { name: 'CustomFont' || "CustomFont", size: 10, bold: [1, 5].includes(colIndex) };
      cell.alignment = { horizontal: "left", vertical: "middle" };
    });

    // Header style
    const headerStyle = {
      font: fontHeader,
      alignment: { horizontal: "center", vertical: "middle" },
      fill: { type: "pattern", pattern: "solid", fgColor: { argb: "FFC6D9F7" } },
      border: { top: { style: "thin" }, left: { style: "thin" }, bottom: { style: "thin" }, right: { style: "thin" } },
    };

    // Add headers
    const headers = [
      "Code",
      "Description",
      "Company",
      "Category",
      "Status",
      "Type"
      ,];
    const headerRow = worksheet.addRow(headers);
    headerRow.eachCell((cell) => Object.assign(cell, headerStyle));

    // Add data rows
    tableData.forEach((item) => {
      const row = worksheet.addRow([
        item.Code,
        item.Description,
        item.Company,
        item.Category,
        item.Status,
        item.Type,
    ]);

      row.eachCell((cell, colIndex) => {
        cell.font = fontTableContent;
        cell.border = { top: { style: "thin" }, left: { style: "thin" }, bottom: { style: "thin" }, right: { style: "thin" } };
        cell.alignment = { horizontal: columnAlignments[colIndex - 1] || "left", vertical: "middle" };
      });
    });

    // Set column widths
    [12, 50, 20, 20, 10, 20].forEach((width, index) => {
      worksheet.getColumn(index + 1).width = width;
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
    const blob = new Blob([buffer], { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" });
    saveAs(blob, `WorkshopItemList As On ${currentdate}.xlsx`);
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

  const handleSorting = async (col) => {
    const newSortOrder = sortData === "ASC" ? "DSC" : "ASC"; // Determine new sort order before setting state
  
    const parseValue = (value) => {
      return value ? parseFloat(value.toString().replace(/,/g, "")) || value : ""; // Remove commas, parse numbers, fallback to original value
    };
  
    const sorted = [...tableData].sort((a, b) => {
      const aValue = parseValue(a[col]);
      const bValue = parseValue(b[col]);
  
      if (!isNaN(aValue) && !isNaN(bValue)) {
        return newSortOrder === "ASC" ? aValue - bValue : bValue - aValue; // Numeric sorting
      } else {
        return newSortOrder === "ASC"
          ? String(aValue).localeCompare(String(bValue))
          : String(bValue).localeCompare(String(aValue)); // String sorting
      }
    });
  
    setTableData(sorted);
    setSortData(newSortOrder); // Update sort order
  
    const columnMappings = {
      "Code": setisAscendingcode,
      "Description": setisAscendingemploye,
      "Company": setisAscendingsts,
      "Category": setisAscendingdesig,
      "Status": setisAscendingcontect,
      "Type": setisAscendingadv,
 
    };
  
    if (columnMappings[col]) {
      columnMappings[col](newSortOrder === "ASC");
    }
  };

  const firstColWidth = {
    width: "8%",
  };
  const secondColWidth = {
    width: "39%",
  };
  const thirdColWidth = {
    width: "14.5%",
  };
  const forthColWidth = {
    width: "15%",
  };
  const fifthColWidth = {
    width: "8%",
  };
  const sixthColWidth = {
    width: "14%",
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
    width: isSidebarVisible ? "calc(55vw - 0%)" : "55vw",
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

  return (
    <>
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
          <NavComponent textdata="Workshop Item List" />

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
                    components={{ Option: DropdownOption }}
                    // styles={customStyles1}
                    styles={customStyles1(!Companyselectdata)}
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
                    components={{ Option: DropdownOption }}
                    // styles={customStyles1}
                    styles={customStyles1(!Typeselectdata)}
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
                    onKeyDown={(e) => handlecategoryKeypress(e, input3Ref)}
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
                    components={{ Option: DropdownOption }}
                    // styles={customStyles1}
                    styles={customStyles1(!Categoryselectdata)}
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

                <select
                  ref={input4Ref}
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
                    width: "250px",
                    height: "24px",
                    marginLeft: "3px",
                    backgroundColor: getcolor,
                    border: `1px solid ${fontcolor}`,
                    fontSize: getdatafontsize,
                    fontFamily: getfontstyle,
                    color: fontcolor,
                    paddingLeft: "7px",
                  }}
                >
                  <option value="">ALL</option>
                  <option value="Active">Active</option>
                  <option value="Non-Active">Non-Active</option>
                </select>
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
                justifyContent: "end",
              }}
            >
              {/* <div
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
                    components={{ Option: DropdownOption }}
                    // styles={customStyles1}
                    styles={customStyles1(!Capacityselectdata)}
                    isClearable
                    placeholder="ALL"
                  />
                </div>
              </div> */}

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
                  ref={input5Ref}
                  onKeyDown={(e) => handleKeyPress(e, input6Ref)}
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
                    <td
                      className="border-dark"
                      style={firstColWidth}
                      onClick={() => handleSorting("Code")}
                    >
                      Code{" "}
                      <i className="fa-solid fa-caret-down caretIconStyle"
                       style={{
                        transform: isAscendingcode ? "rotate(0deg)" : "rotate(180deg)", // 180deg for better visual
                        color: isAscendingcode ? "white" : "red",
                        transition: "transform 0.3s ease",
                      }}
                      ></i>
                    </td>
                    <td
                      className="border-dark"
                      style={secondColWidth}
                      onClick={() => handleSorting("Description")}
                    >
                      Description{" "}
                      <i className="fa-solid fa-caret-down caretIconStyle"
                       style={{
                        transform: isAscendingemploye ? "rotate(0deg)" : "rotate(180deg)", // 180deg for better visual
                        color: isAscendingemploye ? "white" : "red",
                        transition: "transform 0.3s ease",
                      }}
                      ></i>
                    </td>
                    <td
                      className="border-dark"
                      style={thirdColWidth}
                      onClick={() => handleSorting("Company")}
                    >
                      Company{" "}
                      <i className="fa-solid fa-caret-down caretIconStyle"
                       style={{
                        transform: isAscendingsts ? "rotate(0deg)" : "rotate(180deg)", // 180deg for better visual
                        color: isAscendingsts ? "white" : "red",
                        transition: "transform 0.3s ease",
                      }}
                      ></i>
                    </td>
                    <td
                      className="border-dark"
                      style={forthColWidth}
                      onClick={() => handleSorting("Category")}
                    >
                      Category{" "}
                      <i className="fa-solid fa-caret-down caretIconStyle"
                       style={{
                        transform: isAscendingdesig ? "rotate(0deg)" : "rotate(180deg)", // 180deg for better visual
                        color: isAscendingdesig ? "white" : "red",
                        transition: "transform 0.3s ease",
                      }}
                      ></i>
                    </td>
                    <td
                      className="border-dark"
                      style={fifthColWidth}
                      onClick={() => handleSorting("Status")}
                    >
                      Status{" "}
                      <i className="fa-solid fa-caret-down caretIconStyle"
                       style={{
                        transform: isAscendingcontect ? "rotate(0deg)" : "rotate(180deg)", // 180deg for better visual
                        color: isAscendingcontect ? "white" : "red",
                        transition: "transform 0.3s ease",
                      }}
                      ></i>
                    </td>
                    <td
                      className="border-dark"
                      style={sixthColWidth}
                      onClick={() => handleSorting("Type")}
                    >
                      Type{" "}
                      <i className="fa-solid fa-caret-down caretIconStyle"
                       style={{
                        transform: isAscendingadv ? "rotate(0deg)" : "rotate(180deg)", // 180deg for better visual
                        color: isAscendingadv ? "white" : "red",
                        transition: "transform 0.3s ease",
                      }}
                      ></i>
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

                            <td
                              className="text-center"
                              title={item.Capacity}
                              style={{
                                ...fifthColWidth,
                                whiteSpace: "nowrap",
                                overflow: "hidden",
                                textOverflow: "ellipsis",
                              }}
                            >
                              {item.Status}
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
                ...sixthColWidth,
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
              ref={input6Ref}
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