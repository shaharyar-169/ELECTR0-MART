import React, { useState, useEffect, useRef } from "react";
import { Container, Spinner, Nav } from "react-bootstrap";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import { useTheme } from "../../../../ThemeContext";
import { getUserData, getOrganisationData } from "../../../Auth";
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
            // code:'NASIRTRD',
            FCtgCod: Companyselectdata,
            FCapCod: Capacityselectdata,
            FTypCod: Typeselectdata,
            FCmpCod: Companyselectdata,
            FSchTxt: searchQuery
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
                        fontSize: "12px",
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
            fontSize: "12px",
            backgroundColor: getcolor,
            color: fontcolor,
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
            textAlign: "center !important",
        }),
        singleValue: (base) => ({
            ...base,
            marginTop: "-5px",
            textAlign: "left",
            color: fontcolor,
        }),
        clearIndicator: (base) => ({
            ...base,
            marginTop: "-5px",
        }),
    });

    ///////////////////////////// DOWNLOAD PDF CODE ////////////////////////////////////////////////////////////
   const exportPDFHandler = () => {
  
          const globalfontsize = 12;
          console.log('gobal font data', globalfontsize)
  
          // Create a new jsPDF instance with landscape orientation
          const doc = new jsPDF({ orientation: "landscape" });
  
          // Define table data (rows)
          const rows = tableData.map((item) => [
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
  
          // Add summary row to the table
          // rows.push(["", "", "", "", "", ""]);
  
          // Define table column headers and individual column widths
          const headers = [
            "Code",
            "Description",
            "StK",
            "Comm",
            "Act Rate",
            "Pur Rate",
            "SM Rate",
            "Sale Rate",
            "MRP",
            "Fix Rate",
        ];
        const columnWidths = [35, 87, 10, 19, 19, 19, 19, 19, 19, 19];
  
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
  
  
                      if (cellIndex === 2) {
                        const rightAlignX = startX + columnWidths[cellIndex] / 2; // Adjust for right alignment
                        doc.text(cellValue, rightAlignX, cellY, {
                            align: "center",
                            baseline: "middle",
                        });
                    } else if (
                        cellIndex === 3 ||
                        cellIndex === 4 ||
                        cellIndex === 5 ||
                        cellIndex === 6 ||
                        cellIndex === 7 ||
                        cellIndex === 8 ||
                        cellIndex === 9
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
                      rightX - 5,
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
  
                  addTitle(`Item Price List A`, "", "", pageNumber, startY, 12); // Render sale report title with decreased font size, provide the time, and page number
                  startY += 5;
  
                  const labelsX = (doc.internal.pageSize.width - totalWidth) / 2;
                  const labelsY = startY + 4; // Position the labels below the titles and above the table
  
                  // Set font size and weight for the labels
                  doc.setFontSize(12);
                  doc.setFont(getfontstyle, "300");
  
  
                  let typeText = capacityselectdatavalue.label ? capacityselectdatavalue.label : "ALL";
                  let typeItem = Companyselectdatavalue.label ? Companyselectdatavalue.label : "ALL";
                  let category = categoryselectdatavalue.label ? categoryselectdatavalue.label : "ALL";
                  let typename = typeselectdatavalue.label ? typeselectdatavalue.label : "ALL";
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
  
  
                  doc.setFont(getfontstyle, 'bold'); // Set font to bold
                  doc.text(`COMPANY :`, labelsX , labelsY); // Draw bold label
                  doc.setFont(getfontstyle, 'normal'); // Reset font to normal
                  doc.text(`${typeItem}`, labelsX + 25, labelsY); // Draw the value next to the label
  
                  doc.setFont(getfontstyle, 'bold'); // Set font to bold
                  doc.text(`TYPE :`, labelsX + 180, labelsY); // Draw bold label
                  doc.setFont(getfontstyle, 'normal'); // Reset font to normal
                  doc.text(`${typename}`, labelsX + 195, labelsY); // Draw the value next to the label
  
                  doc.setFont(getfontstyle, 'bold'); // Set font to bold
                  doc.text(`CATEGORY :`, labelsX, labelsY + 4.3); // Draw bold label
                  doc.setFont(getfontstyle, 'normal'); // Reset font to normal
                  doc.text(`${category}`, labelsX + 25, labelsY + 4.3); // Draw the value next to the label
  
                //   doc.setFont(getfontstyle, 'bold'); // Set font to bold
                //   doc.text(`TYPE :`, labelsX + 170, labelsY + 4.3); // Draw bold label
                //   doc.setFont(getfontstyle, 'normal'); // Reset font to normal
                //   doc.text(`${typename}`, labelsX + 195, labelsY + 4.3); // Draw the value next to the label
  
                  doc.setFont(getfontstyle, 'bold'); // Set font to bold
                  doc.text(`CAPACITY :`, labelsX, labelsY + 8.5); // Draw bold label
                  doc.setFont(getfontstyle, 'normal'); // Reset font to normal
                  doc.text(`${typeText}`, labelsX + 25, labelsY + 8.5); // Draw the value next to the label
  
                if(searchQuery){
                  doc.setFont(getfontstyle, 'bold'); // Set font to bold
                  doc.text(`SEARCH :`, labelsX + 180, labelsY + 8.5); // Draw bold label
                  doc.setFont(getfontstyle, 'normal'); // Reset font to normal
                  doc.text(`${search}`, labelsX + 200, labelsY + 8.5); // Draw the value next to the label
  }
  
  
                  // // Reset font weight to normal if necessary for subsequent text
                  doc.setFont(getfontstyle, 'bold'); // Set font to bold
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
          doc.save(`ItemPriceListA_${date}.pdf`);
  
  
      };
    ///////////////////////////// DOWNLOAD PDF CODE ////////////////////////////////////////////////////////////

    ///////////////////////////// DOWNLOAD PDF EXCEL //////////////////////////////////////////////////////////
    const handleDownloadCSV = async () => {
           const workbook = new ExcelJS.Workbook();
           const worksheet = workbook.addWorksheet("Sheet1");
   
           const numColumns = 6; // Number of columns
   
           const columnAlignments = [
            "left",
            "left",
            "center",
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
   
           [comapnyname, `Item Price List A`].forEach((title, index) => {
            // Define custom styles for each title
            let customStyle;
            let rowHeight = 20;  // Default row height
            if (index === 0) {
              // Style for company name
              customStyle = {
                font: { family: getfontstyle, size: 18, bold: true },
                alignment: { horizontal: "center" },
              };
              rowHeight = 30; // Increase row height for company name to avoid overlap
            } else {
              // Style for "Item List"
              customStyle = {
                font: { family: getfontstyle, size: getdatafontsize, bold: false },
                alignment: { horizontal: "center" },
              };
            }
          
            // Add row with the title
            worksheet.addRow([title]).eachCell((cell) => (cell.style = customStyle));
          
            // Adjust the row height for the company name or other titles
            worksheet.getRow(index + 2).height = rowHeight;
          
            // Merge the cells for the title
            worksheet.mergeCells(
              `A${index + 2}:${String.fromCharCode(64 + numColumns)}${index + 2}`
            );
          });
   
   
   
           // Add an empty row after the title section
           worksheet.addRow([]);  // This is where you add the empty row
   
           let typecompany = Companyselectdatavalue.label ? Companyselectdatavalue.label : "ALL";
           let typecapacity = capacityselectdatavalue.label ? capacityselectdatavalue.label : "ALL";
           let typecategory = categoryselectdatavalue.label ? categoryselectdatavalue.label : "ALL";
           let typetype = typeselectdatavalue.label ? typeselectdatavalue.label : "ALL ";
           //    let typestatus = transectionType ? transectionType : "All";
           let typesearch = searchQuery ? searchQuery : "";
   
          
           const typeAndStoreRow = worksheet.addRow([
            "COMPANY :", typecompany, "","","", "TYPE :", typetype,
        ]);

        const typeAndStoreRow2 = worksheet.addRow([
            "CATEGORY :", typecategory, "" 
                ]);
        // Add third row with conditional rendering for "SEARCH:"
        const typeAndStoreRow3 = worksheet.addRow(
            searchQuery
                ? ["CAPACITY :", typecapacity, "","","", "SEARCH :", typesearch]
                : ["CAPACITY :", typecapacity, ""]
        );
   
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
           applyStatusRowStyle(typeAndStoreRow, [1, 6]); // Column 1 for "COMPANY:", Column 4 for "CAPACITY:"
           applyStatusRowStyle(typeAndStoreRow2, [1, 6]); // Column 1 for "COMPANY:", Column 4 for "CAPACITY:"
           applyStatusRowStyle(typeAndStoreRow3, [1, 6]); // Column 1 for "COMPANY:", Column 4 for "CAPACITY:"
   
   
   
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
           const headers = [ "Code",
            "Description",
            "StK",
            "Comm",
            "Act Rate",
            "Pur Rate",
            "SM Rate",
            "Sale Rate",
            "MRP",
            "Fix Rate",
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
   
   
           // Set column widths
           [22, 40, 6, 12, 12, 12, 12, 12, 12, 12].forEach((width, index) => {
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
           saveAs(blob, `ItemPriceListA ${currentdate}.xlsx`);
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
        const parseValue = (value) => {
            // Remove commas and parse the string to a float
            return parseFloat(value.replace(/,/g, ""));
        };

        const sorted = [...tableData].sort((a, b) => {
            const aValue = a[col] !== null ? a[col].toString() : "";
            const bValue = b[col] !== null ? b[col].toString() : "";

            const numA = parseValue(aValue);
            const numB = parseValue(bValue);

            if (!isNaN(numA) && !isNaN(numB)) {
                return sortData === "ASC" ? numA - numB : numB - numA;
            } else {
                return sortData === "ASC"
                    ? aValue.localeCompare(bValue)
                    : bValue.localeCompare(aValue);
            }
        });

        setTableData(sorted);
        setSortData(sortData === "ASC" ? "DSC" : "ASC");
    };

    const firstColWidth = {
        width: "12.3%",
    };
    const secondColWidth = {
        width: "24.5%",
    };
    const thirdColWidth = {
        width: "4%",
    };
    const forthColWidth = {
        width: "7%",
    };
    const fifthColWidth = {
        width: "8.5%",
    };
    const sixthColWidth = {
        width: "8.5%",
    };
    const eightColWidth = {
        width: "8.5%",
    };
    const ninthColWidth = {
        width: "8.5%",
    };
    const tenthColWidth = {
        width: "8.5%",
    };
    const elewenthColWidth = {
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
        width: isSidebarVisible ? "calc(85vw - 0%)" : "85vw",
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
                                        <span style={{ fontSize: "15px", fontWeight: "bold" }}>
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
                                                const labelPart = selectedOption.label.split('-')[1];
                                                setCompanyselectdata(selectedOption.value);
                                                setCompanyselectdatavalue({
                                                    value: selectedOption.value,
                                                    label: labelPart,  // Set only the 'NGS' part of the label
                                                  });
                                            } else {
                                                setCompanyselectdata(""); // Clear the saleType state when selectedOption is null (i.e., when the selection is cleared)
                                                setCompanyselectdatavalue('');
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
                                        <span style={{ fontSize: "15px", fontWeight: "bold" }}>
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
                                                const labelPart = selectedOption.label.split('-')[1];
                                                setCapacityselectdata(selectedOption.value);
                                                setcapacityselectdatavalue({
                                                    value: selectedOption.value,
                                                    label: labelPart,  // Set only the 'NGS' part of the label
                                                  });
                                            } else {
                                                setCapacityselectdata(""); // Clear the saleType state when selectedOption is null (i.e., when the selection is cleared)
                                                setcapacityselectdatavalue('');

                                            }
                                        }}
                                        components={{ Option: DropdownOption }}
                                        // styles={customStyles1}
                                        styles={customStyles1(!Capacityselectdata)}
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
                                        <span style={{ fontSize: "15px", fontWeight: "bold" }}>
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
                                                const labelPart = selectedOption.label.split('-')[1];
                                                setCategoryselectdata(selectedOption.value);
                                                setcategoryselectdatavalue({
                                                    value: selectedOption.value,
                                                    label: labelPart,  // Set only the 'NGS' part of the label
                                                  });
                                            } else {
                                                setCategoryselectdata(""); // Clear the saleType state when selectedOption is null (i.e., when the selection is cleared)
                                                setcategoryselectdatavalue('');

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
                                        <span style={{ fontSize: "15px", fontWeight: "bold" }}>
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
                                                const labelPart = selectedOption.label.split('-')[1];
                                                setTypeselectdata(selectedOption.value);
                                                settypeselectdatavalue({
                                                    value: selectedOption.value,
                                                    label: labelPart,  // Set only the 'NGS' part of the label
                                                  });
                                            } else {
                                                setTypeselectdata(""); // Clear the saleType state when selectedOption is null (i.e., when the selection is cleared)
                                                settypeselectdatavalue('');

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
                            <div id="lastDiv" style={{ marginRight: "1px" }}>
                                <label for="searchInput" style={{ marginRight: "3px" }}>
                                    <span style={{ fontSize: "15px", fontWeight: "bold" }}>
                                        Search :
                                    </span>{" "}
                                </label>
                                <input
                                    ref={input4Ref}
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
                                    onChange={(e) => setSearchQuery((e.target.value || "").toUpperCase())}                />

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
                                            style={firstColWidth}
                                            onClick={() => handleSorting("Code")}
                                        >
                                            Code{" "}
                                            <i className="fa-solid fa-caret-down caretIconStyle"></i>
                                        </td>
                                        <td
                                            className="border-dark"
                                            style={secondColWidth}
                                            onClick={() => handleSorting("Description")}
                                        >
                                            Description{" "}
                                            <i className="fa-solid fa-caret-down caretIconStyle"></i>
                                        </td>
                                        <td
                                            className="border-dark"
                                            style={thirdColWidth}
                                            onClick={() => handleSorting("Stk")}
                                        >
                                            Stk{" "}
                                            <i className="fa-solid fa-caret-down caretIconStyle"></i>
                                        </td>
                                        <td
                                            className="border-dark"
                                            style={forthColWidth}
                                            onClick={() => handleSorting("Comm")}
                                        >
                                            Comm{" "}
                                            <i className="fa-solid fa-caret-down caretIconStyle"></i>
                                        </td>
                                        <td
                                            className="border-dark"
                                            style={tenthColWidth}
                                            onClick={() => handleSorting("Act Rate")}
                                        >
                                            Act Rate{" "}
                                            <i className="fa-solid fa-caret-down caretIconStyle"></i>
                                        </td>
                                        <td
                                            className="border-dark"
                                            style={elewenthColWidth}
                                            onClick={() => handleSorting("Pur Rate")}
                                        >
                                            Pur Rate{" "}
                                            <i className="fa-solid fa-caret-down caretIconStyle"></i>
                                        </td>
                                        <td
                                            className="border-dark"
                                            style={fifthColWidth}
                                            onClick={() => handleSorting("SM Rate")}
                                        >
                                            SM Rate{" "}
                                            <i className="fa-solid fa-caret-down caretIconStyle"></i>
                                        </td>
                                        <td
                                            className="border-dark"
                                            style={sixthColWidth}
                                            onClick={() => handleSorting("Sale Rate")}
                                        >
                                            Sale Rate{" "}
                                            <i className="fa-solid fa-caret-down caretIconStyle"></i>
                                        </td>
                                        <td
                                            className="border-dark"
                                            style={eightColWidth}
                                            onClick={() => handleSorting("MRP")}
                                        >
                                            MRP{" "}
                                            <i className="fa-solid fa-caret-down caretIconStyle"></i>
                                        </td>
                                        <td
                                            className="border-dark"
                                            style={ninthColWidth}
                                            onClick={() => handleSorting("Fix Rate")}
                                        >
                                            Fix Rate{" "}
                                            <i className="fa-solid fa-caret-down caretIconStyle"></i>
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
                                maxHeight: "53vh",
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
                                                        className={
                                                            selectedIndex === i ? "selected-background" : ""
                                                        }
                                                        style={{
                                                            backgroundColor: getcolor,
                                                            color: fontcolor,
                                                        }}
                                                    >
                                                        <td className="text-start" style={firstColWidth}>
                                                            {item.Code}
                                                        </td>
                                                        <td
                                                            className="text-start"
                                                            style={secondColWidth}
                                                            title={item.Description || ""}
                                                        >
                                                            {item.Description && item.Description.length > 30
                                                                ? `${item.Description.substring(0, 30)}...`
                                                                : item.Description || ""}
                                                        </td>
                                                        <td className="text-center" style={thirdColWidth}>
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
                                                <td style={fifthColWidth}></td>
                                                <td style={sixthColWidth}></td>
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

                    {/* <div
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
                    </div> */}

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