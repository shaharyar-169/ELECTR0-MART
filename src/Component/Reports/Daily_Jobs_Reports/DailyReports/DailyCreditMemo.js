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
import { Code } from "@mui/icons-material";

export default function DailyCreditReport() {
    const navigate = useNavigate();
    const user = getUserData();
    const organisation = getOrganisationData();

    const [tableData, setTableData] = useState([]);
    const [selectedSearch, setSelectedSearch] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    const saleSelectRef = useRef(null);
    const input1Ref = useRef(null);

    const toRef = useRef(null);
    const input2Ref = useRef(null);
    const input3Ref = useRef(null);
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
    const [transectionType, settransectionType] = useState("A");

    const [storeList, setStoreList] = useState([]);
    const [Companyselectdatavalue, setCompanyselectdatavalue] = useState("");
    const [storeType, setStoreType] = useState("");

    const [totalOpening, setTotalOpening] = useState(0);
    const [totalPurchase, setTotalPurchase] = useState(0);
    const [totalPurRet, setTotalPurRet] = useState(0);
    const [totalReceive, setTotalReceive] = useState(0);
    const [totalIssue, setTotalIssue] = useState(0);
    const [totalSale, setTotalSale] = useState(0);
    const [totalSaleRet, setTotalSaleRet] = useState(0);
    const [totalBalance, setTotalBalance] = useState(0);

    // state for from DatePicker
    const [selectedfromDate, setSelectedfromDate] = useState(null);
    const [fromInputDate, setfromInputDate] = useState("");
    const [fromCalendarOpen, setfromCalendarOpen] = useState(false);
    // state for To DatePicker
    const [selectedToDate, setSelectedToDate] = useState(null);
    const [toInputDate, settoInputDate] = useState("");
    const [toCalendarOpen, settoCalendarOpen] = useState(false);

    const yeardescription = getYearDescription();
    const locationnumber = getLocationnumber()

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
        getdatafontsize
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

    function fetchDailyStatusReport() {
        const dateRegex = /^\d{2}-\d{2}-\d{4}$/;

        let errorType = "";

        switch (true) {
            case !toInputDate:
                errorType = "toDate";
                break;
            default:
                break;
        }

        if (!dateRegex.test(toInputDate)) {
            errorType = "toDateInvalid";
        } else {
            const formattedToInput = toInputDate.replace(
                /^(\d{2})(\d{2})(\d{4})$/,
                "$1-$2-$3"
            );
            const [toDay, toMonth, toYear] = formattedToInput.split("-").map(Number);
            const enteredToDate = new Date(toYear, toMonth - 1, toDay);

            if (GlobaltoDate && enteredToDate > GlobaltoDate) {
                errorType = "toDateAfterGlobal";
            } else if (GlobaltoDate && enteredToDate < GlobalfromDate) {
                errorType = "toDateBeforeGlobal";
            }
        }

        switch (errorType) {
            case "toDate":
                toast.error("Rep Date is required");
                return;

            case "toDateInvalid":
                toast.error("Rep Date must be in the format dd-mm-yyyy");
                return;

            case "toDateAfterGlobal":
                toast.error(`Rep Date must be before ${GlobaltoDate1}`);
                return;
            case "toDateBeforeGlobal":
                toast.error(`Rep Date must be after ${GlobalfromDate1}`);
                return;

            default:
                break;
        }

        const fromDateElement = document.getElementById("fromdatevalidation");
        const toDateElement = document.getElementById("todatevalidation");

        if (fromDateElement) {
            fromDateElement.style.border = `1px solid ${fontcolor}`;
        }
        if (toDateElement) {
            toDateElement.style.border = `1px solid ${fontcolor}`;
        }

        const apiMainUrl = apiLinks + "/DailyCreditMemo.php";
        setIsLoading(true);
        const formMainData = new URLSearchParams({
            // code: organisation.code,
            // FLocCod: locationnumber || getLocationNumber,
            // FYerDsc: yeardescription || getYearDescription,
            code: 'NASIRTRD',
            FLocCod: '001',
            FYerDsc: '2024-2024',
            FRepDat: toInputDate,
            FRepTyp: transectionType,
            FSchTxt: searchQuery,
        }).toString();

        axios
            .post(apiMainUrl, formMainData)
            .then((response) => {
                setIsLoading(false);
                // console.log("Response:", response.data);
                setTotalPurchase(response.data["Total Amount"]);
                setTotalOpening(response.data["Total Received"]);
                setTotalBalance(response.data["Total Balance"]);

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
        if (!hasComponentMountedPreviously || (toRef && toRef.current)) {
            if (toRef && toRef.current) {
                setTimeout(() => {
                    toRef.current.focus();
                    toRef.current.select();
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
                ? "#2684FF"
                : state.isFocused
                    ? "#2684FF"
                    : getcolor,
            color: state.isSelected
                ? "white"
                : fontcolor,
            "&:hover": {
                backgroundColor: "#2684FF",
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
    const exportPDFHandler = () => {

        // Create a new jsPDF instance with landscape orientation
        const doc = new jsPDF({ orientation: "landscape" });

        // Define table data (rows)
        const rows = tableData.map((item) => [
            item['Inv#'],
            item.Date,
            // item.Code,
            item.SalesMan,
            item.Customer,
            item.Mobile,
            item.Amount,
            item.Received,
            item.Balance,
        ]);

        // Add summary row to the table
        rows.push([

            String(formatValue(tableData.length.toLocaleString())),
            "",
            // "",
            "",
            "",
            "",
            String(formatValue(totalPurchase)),
            String(formatValue(totalOpening)),
            String(formatValue(totalBalance)),
        ]);

        // Define table column headers and individual column widths
        const headers = [
            "Inv#",
            "Date",
            // "Code",
            "Salesman",
            "Customer",
            "Mobile",
            "Amount",
            "Received",
            "Balance",

        ];
        const columnWidths = [18,22,68, 68, 28, 28, 28, 28];

        // Calculate total table width
        const totalWidth = columnWidths.reduce((acc, width) => acc + width, 0);

        // Define page height and padding
        const pageHeight = doc.internal.pageSize.height;
        const paddingTop = 15;

        // Set font properties for the table
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

          if (cellIndex === 0 || cellIndex === 1 || cellIndex === 4 ) {
            const rightAlignX = startX + columnWidths[cellIndex] / 2;
            doc.text(cellValue, rightAlignX, cellY, {
              align: "center",
              baseline: "middle",
            });
          } else if (
                        cellIndex === 5 ||
            cellIndex === 6 ||
            cellIndex === 7 
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
        const rowsPerPage = 29; // Adjust this value based on your requirements

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
                addTitle(`Daily Credit Memo Report As on: ${toInputDate}`, "", "", pageNumber, startY, 12); // Render sale report title with decreased font size, provide the time, and page number
                startY += -5;

                const labelsX = (doc.internal.pageSize.width - totalWidth) / 2;
                const labelsY = startY + 4; // Position the labels below the titles and above the table

                // Set font size and weight for the labels
                doc.setFontSize(12);
                doc.setFont(getfontstyle, "300");



                // let typeText = Companyselectdatavalue.label ? Companyselectdatavalue.label : "ALL";


                let typestatus = "";

                if (transectionType === "A") {
                    typestatus = "ALL";
                } else if (transectionType === "O") {
                    typestatus = "OUTSTANDING";
                } else if (transectionType === "N") {
                    typestatus = "NILL";
                }
                else {
                    typestatus = "ALL"; // Default value
                }

                let search = searchQuery ? searchQuery : "";


            

   doc.setFont("verdana", "bold");
          doc.setFontSize(10);
                          doc.text(`Type :`, labelsX, labelsY + 8); // Draw bold label
   doc.setFont("verdana-regular", "normal");
          doc.setFontSize(10);
                          doc.text(`${typestatus}`, labelsX + 15, labelsY + 8); // Draw the value next to the label

                if (searchQuery) {
   doc.setFont("verdana", "bold");
          doc.setFontSize(10);
                              doc.text(`Search :`, labelsX + 170, labelsY + 8.5); // Draw bold label
   doc.setFont("verdana-regular", "normal");
          doc.setFontSize(10);
                              doc.text(`${search}`, labelsX + 190, labelsY + 8.5); // Draw the value next to the label
                }

             

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
        doc.save(`DailyCreditMemoReport AS on ${toInputDate}.pdf`);


    };

    const handleDownloadCSV = async () => {
        const workbook = new ExcelJS.Workbook();
        const worksheet = workbook.addWorksheet("Sheet1");

        const numColumns = 8; // Ensure this matches the actual number of columns

        const columnAlignments = [
            "left",
            "left",
            "left",
            "left",
            "left",
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
            `A${companyRow.number}:${String.fromCharCode(65 + numColumns - 1)}${companyRow.number
            }`
        );

        // Add Store List row
        const storeListRow = worksheet.addRow([`Daily Credit Memo Report As on ${toInputDate}`,]);
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

        // let typecompany = Companyselectdatavalue.label ? Companyselectdatavalue.label : "ALL";


        let typestatus = "";

        if (transectionType === "A") {
            typestatus = "ALL";
        } else if (transectionType === "O") {
            typestatus = "OUTSTANDING";
        } else if (transectionType === "N") {
            typestatus = "NILL";
        }
        else {
            typestatus = "ALL"; // Default value
        }

        let typesearch = searchQuery ? searchQuery : "";

        //    const typeAndStoreRow2 = worksheet.addRow(["STORE :", typecategory]);
        const typeAndStoreRow3 = worksheet.addRow(
            searchQuery
                ? ["Type :", typestatus, "", "", "", "", "Search :", typesearch]
                : ["Type :", typestatus, ""]
        );



        typeAndStoreRow3.eachCell((cell, colIndex) => {
            cell.font = {
                name: "CustomFont" || "CustomFont",
                size: 10,
                bold: [1, 7].includes(colIndex),
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
            "Inv#",
            "Date",
            // "Code",
            "Salesman",
            "Customer",
            "Mobile",
            "Amount",
            "Received",
            "Balance",
        ];
        const headerRow = worksheet.addRow(headers);
        headerRow.eachCell((cell) => Object.assign(cell, headerStyle));

        // Add data rows
        tableData.forEach((item) => {
            const row = worksheet.addRow([
                item['Inv#'],
                item.Date,
                // item.Code,
                item.SalesMan,
                item.Customer,
                item.Mobile,
                item.Amount,
                item.Received,
                item.Balance,
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
        [8, 10,  35, 35, 13, 15, 15, 15].forEach((width, index) => {
            worksheet.getColumn(index + 1).width = width;
        });

        const totalRow = worksheet.addRow([
           String(formatValue(tableData.length.toLocaleString())),
            "",
            "",
            "",
            "",
            String(formatValue(totalPurchase)),
            String(formatValue(totalOpening)),
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
            if (

                colNumber === 6 ||
                colNumber === 7 ||
                colNumber === 8


            ) {
                cell.alignment = { horizontal: "right" };
            }

             if (

                colNumber === 1
             

            ) {
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
        saveAs(blob, `DailyCreditMemoReport As on ${toInputDate}.xlsx`);
    };

    const handleTransactionTypeChange = (event) => {
        const selectedTransactionType = event.target.value;
        settransectionType(selectedTransactionType);
    };

    const handleKeyPress = (e, nextInputRef) => {
        if (e.key === "Enter") {
            e.preventDefault();
            if (nextInputRef.current) {
                nextInputRef.current.focus();
            }
        }
    };

    const [columns, setColumns] = useState({
        'Inv#': [],
        Date: [],
        Code: [],
        SalesMan: [],
        Customer: [],
        Mobile: [],
        Amount: [],
        Received: [],
        Balance: [],
    });

    const [columnSortOrders, setColumnSortOrders] = useState({
        'Inv#': "",
        Date: "",
        Code: "",
        SalesMan: "",
        Customer: "",
        Mobile: "",
        Amount: "",
        Received: "",
        Balance: "",
    });

    // Transform table data into column-oriented format
    useEffect(() => {
        if (tableData.length > 0) {
            const newColumns = {
                'Inv#': tableData.map((row) => row['Inv#']),
                Date: tableData.map((row) => row.Date),
                Code: tableData.map((row) => row.Code),
                SalesMan: tableData.map((row) => row.SalesMan),
                Customer: tableData.map((row) => row.Customer),
                Mobile: tableData.map((row) => row.Mobile),
                Amount: tableData.map((row) => row.Amount),
                Received: tableData.map((row) => row.Received),
                Balance: tableData.map((row) => row.Balance),

            };
            setColumns(newColumns);
        }
    }, [tableData]);

    const handleSorting = (col) => {
        const currentOrder = columnSortOrders[col];
        const newOrder = currentOrder === "ASC" ? "DSC" : "ASC";

        setTableData(prevData => {
            const sorted = [...prevData].sort((a, b) => {
                const aValue = a[col] !== null ? a[col].toString() : "";
                const bValue = b[col] !== null ? b[col].toString() : "";

                const numA = parseFloat(aValue.replace(/,/g, ""));
                const numB = parseFloat(bValue.replace(/,/g, ""));

                if (!isNaN(numA) && !isNaN(numB)) {
                    return newOrder === "ASC" ? numA - numB : numB - numA;
                } else {
                    return newOrder === "ASC"
                        ? aValue.localeCompare(bValue)
                        : bValue.localeCompare(aValue);
                }
            });
            return sorted;
        });

        // Update sort order state
        setColumnSortOrders(prev => ({
            ...Object.fromEntries(Object.keys(prev).map(key => [key, null])),
            [col]: newOrder
        }));
    };

    const resetSorting = () => {
        setColumnSortOrders({
            Code: null,
            Description: null,
            Company: null,
            Category: null,
            Capacity: null,
            Type: null,
            Status: null,

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

    const dispatch = useDispatch();

    const tableTopColor = "#3368B5";
    const tableHeadColor = "#3368b5";
    const secondaryColor = "white";
    const btnColor = "#3368B5";
    const textColor = "white";


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
        width: "55px",
    };
    const secondColWidth = {
        width: "80px",
    };
    const thirdColWidth = {
        width: "80px",
    };
    const forthColWidth = {
        width: isSidebarVisible ? "240px" : "300px",
    };
    const fifthColWidth = {
        width: isSidebarVisible ? "240px" : "300px",
    };
    const sixthColWidth = {
        width: "90px",
    };
    const seventhColWidth = {
        width: "85px",
    };
    const eighthColWidth = {
        width: "85px",
    };
    const ninthColWidth = {
        width: "85px",
    };

    const sixthCol = {
        width: "8px",
    };

    useHotkeys("alt+s", () => {
        fetchDailyStatusReport();
        resetSorting();
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
        maxWidth: isSidebarVisible ? "1000px" : "1200px",
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
            focusNextElement(toRef, storeRef);
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
                    <NavComponent textdata="Credit Memo Report" />

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
                            {/* To Date */}
                            <div className="d-flex align-items-center">
                                <div
                                    style={{
                                        width: "100px",
                                        display: "flex",
                                        justifyContent: "end",
                                    }}
                                >
                                    <label htmlFor="toDatePicker">
                                        <span style={{ fontSize: getdatafontsize, fontFamily: getfontstyle, fontWeight: "bold" }}>
                                            Rep Date :&nbsp;
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
                                            fontSize: getdatafontsize, fontFamily: getfontstyle, backgroundColor: getcolor,
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

                            {/* Type Select */}
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
                                 <div style={{ position: "relative", display: "inline-block" }}>
                  <select
                    ref={storeRef}
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
                      fontSize: getdatafontsize,
                      fontFamily: getfontstyle,
                      color: fontcolor,
                      paddingRight: "25px",
                    }}
                  >
                    <option value="A">ALL</option>
                    <option value="N">NILL</option>
                    <option value="O">OUTSTANDING</option>
                  </select>

                  {transectionType !== "A" && (
                    <span
                      onClick={() => settransectionType("A")}
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

                            {/* Search */}
                            {/* <div
                                className="d-flex align-items-center"
                                style={{ marginRight: "25px" }}
                            >
                                <div>
                                    <label for="searchInput">
                                        <span style={{fontSize: getdatafontsize,fontFamily:getfontstyle,  fontWeight: "bold" }}>
                                            Search :
                                        </span>
                                    </label>
                                </div>
                                <div>
                                    <input
                                        ref={searchRef}
                                        onKeyDown={handleSearchEnter}
                                        type="text"
                                        id="searchsubmit"
                                        placeholder="Item description"
                                        value={searchQuery}
                                        autoComplete="off"
                                        style={{
                                            width: "200px",
                                            height: "24px",
                                            fontSize: getdatafontsize,fontFamily:getfontstyle,                                             marginLeft: '5px',
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
                                        onChange={(e) => setSearchQuery((e.target.value || "").toUpperCase())} />

                                </div>
                            </div> */}
                        </div>
                    </div>
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
                                justifyContent: "end",
                            }}
                        >

                            {/* Search */}
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
                                        placeholder="Item description"
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


                                        <td
                                            className="border-dark"
                                            style={firstColWidth}
                                            onClick={() => handleSorting("Inv#")}
                                        >
                                            Inv#{" "}
                                            <i
                                                className="fa-solid fa-caret-down caretIconStyle"
                                                style={getIconStyle("Inv#")}
                                            ></i>
                                        </td>

                                        <td
                                            className="border-dark"
                                            style={secondColWidth}
                                            onClick={() => handleSorting("Date")}
                                        >
                                            Date{" "}
                                            <i
                                                className="fa-solid fa-caret-down caretIconStyle"
                                                style={getIconStyle("Date")}
                                            ></i>
                                        </td>


                                        {/* <td
                                            className="border-dark"
                                            style={thirdColWidth}
                                            onClick={() => handleSorting("Code")}
                                        >
                                            Code{" "}
                                            <i
                                                className="fa-solid fa-caret-down caretIconStyle"
                                                style={getIconStyle("Code")}
                                            ></i>
                                        </td> */}

                                        <td
                                            className="border-dark"
                                            style={forthColWidth}
                                            onClick={() => handleSorting("SalesMan")}
                                        >
                                            SalesMan{" "}
                                            <i
                                                className="fa-solid fa-caret-down caretIconStyle"
                                                style={getIconStyle("SalesMan")}
                                            ></i>
                                        </td>


                                        <td
                                            className="border-dark"
                                            style={fifthColWidth}
                                            onClick={() => handleSorting("Customer")}
                                        >
                                            Customer{" "}
                                            <i
                                                className="fa-solid fa-caret-down caretIconStyle"
                                                style={getIconStyle("Customer")}
                                            ></i>
                                        </td>


                                        <td
                                            className="border-dark"
                                            style={sixthColWidth}
                                            onClick={() => handleSorting("Mobile")}
                                        >
                                            Mobile{" "}
                                            <i
                                                className="fa-solid fa-caret-down caretIconStyle"
                                                style={getIconStyle("Mobile")}
                                            ></i>
                                        </td>


                                        <td
                                            className="border-dark"
                                            style={seventhColWidth}
                                            onClick={() => handleSorting("Amount")}
                                        >
                                            Amount{" "}
                                            <i
                                                className="fa-solid fa-caret-down caretIconStyle"
                                                style={getIconStyle("Amount")}
                                            ></i>
                                        </td>

                                        <td
                                            className="border-dark"
                                            style={eighthColWidth}
                                            onClick={() => handleSorting("Received")}
                                        >
                                            Received{" "}
                                            <i
                                                className="fa-solid fa-caret-down caretIconStyle"
                                                style={getIconStyle("Received")}
                                            ></i>
                                        </td>


                                        <td
                                            className="border-dark"
                                            style={ninthColWidth}
                                            onClick={() => handleSorting("Balance")}
                                        >
                                            Balance{" "}
                                            <i
                                                className="fa-solid fa-caret-down caretIconStyle"
                                                style={getIconStyle("Balance")}
                                            ></i>
                                        </td>

                                        <td
                                            className="border-dark"
                                            style={sixthCol}
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
                                    // width: "100%",
                                    position: "relative",
                                    // width: "100%",
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
                                                <td colSpan="8" className="text-center">
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
                                                        {Array.from({ length: 8 }).map((_, colIndex) => (
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
                                                <td style={forthColWidth}></td>
                                                <td style={fifthColWidth}></td>
                                                <td style={sixthColWidth}></td>
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
                                                            color: fontcolor,
                                                        }}
                                                    >
                                                        {/* <td className="text-start" style={firstColWidth}>
                                                            {item['Inv#']}
                                                        </td> */}

                                                          <td
  className="text-start"
  style={{...firstColWidth,  cursor:'pointer',
                                textDecoration:"underline",
                                color:'blue'}}
  onDoubleClick={(e) => {
    e.stopPropagation();
    // code temporarily store karo
   sessionStorage.setItem(
  "InvoiveLedgerData",
  JSON.stringify({  
     source: "doubleClick",
      Invoice: item["Inv#"],
      
    })
    
  
);
sessionStorage.setItem(
  "InvoiveLedgerData2",
  JSON.stringify({  
     source: "doubleClick2",
   }) 
);

    // fixed URL open karo
    window.open("/crystalsol/InvoiceLedger", "_blank");
  }}
>
  {item["Inv#"]}
</td>
                                                        <td className="text-start" style={secondColWidth}>
                                                            {item.Date}
                                                        </td>
                                                        {/* <td className="text-start" style={thirdColWidth}>
                                                            {item.Code}
                                                        </td> */}
                                                        <td className="text-start"
                                                            title={item.SalesMan}
                                                            style={{
                                                                ...forthColWidth,
                                                                whiteSpace: "nowrap",
                                                                overflow: "hidden",
                                                                textOverflow: "ellipsis",
                                                            }}
                                                        >
                                                            {item.SalesMan}
                                                        </td>
                                                        <td className="text-start"
                                                            title={item.Customer}
                                                            style={{
                                                                ...fifthColWidth,
                                                                whiteSpace: "nowrap",
                                                                overflow: "hidden",
                                                                textOverflow: "ellipsis",
                                                            }}                                                    >
                                                            {item.Customer}
                                                        </td>
                                                        {/* <td className="text-start" style={sixthColWidth}>
                                                            {item.Mobile}
                                                        </td> */}

                                                      
  <td
  className="text-start"
   style={{...firstColWidth,  cursor:'pointer',
                                textDecoration:"underline",
                                color:'blue'}}
  onDoubleClick={(e) => {
    e.stopPropagation();
    // code temporarily store karo
   sessionStorage.setItem(
  "MobileLedgerData",
  JSON.stringify({  
     source: "doubleClick",
      Mobile: item.Mobile,
        toInputDate: toInputDate,})
  
);

    // fixed URL open karo
    window.open("/crystalsol/MobileLedger", "_blank");
  }}
>
  {item.Mobile}
</td>
                                                        <td className="text-end" style={seventhColWidth}>
                                                            {item.Amount}
                                                        </td>
                                                        <td className="text-end" style={eighthColWidth}>
                                                            {item.Received}
                                                        </td>
                                                        <td className="text-end" style={ninthColWidth}>
                                                            {item.Balance}
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
                                                    {Array.from({ length: 8 }).map((_, colIndex) => (
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
                                                <td style={forthColWidth}></td>
                                                <td style={fifthColWidth}></td>
                                                <td style={sixthColWidth}></td>
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
                            paddingRight: "8px"
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
                            <span className="mobileledger_total2">{formatValue(tableData.length.toLocaleString())}</span>

                        </div>
                        <div
                            style={{
                                ...secondColWidth,
                                background: getcolor,
                                borderRight: `1px solid ${fontcolor}`,
                            }}
                        ></div>
                        {/* <div
                            style={{
                                ...thirdColWidth,
                                background: getcolor,
                                borderRight: `1px solid ${fontcolor}`,
                            }}
                        >
                            <span className="mobileledger_total">{totalOpening}</span>
                        </div> */}
                        <div
                            style={{
                                ...forthColWidth,
                                background: getcolor,
                                borderRight: `1px solid ${fontcolor}`,
                            }}
                        >
                            {/* <span className="mobileledger_total">{totalPurchase}</span> */}
                        </div>
                        <div
                            style={{
                                ...fifthColWidth,
                                background: getcolor,
                                borderRight: `1px solid ${fontcolor}`,
                            }}
                        >
                            {/* <span className="mobileledger_total">{totalPurRet}</span> */}
                        </div>
                        <div
                            style={{
                                ...sixthColWidth,
                                background: getcolor,
                                borderRight: `1px solid ${fontcolor}`,
                            }}
                        >
                            {/* <span className="mobileledger_total">{totalReceive}</span> */}
                        </div>
                        <div
                            style={{
                                ...seventhColWidth,
                                background: getcolor,
                                borderRight: `1px solid ${fontcolor}`,
                            }}
                        >
                            <span className="mobileledger_total">{formatValue(totalPurchase)}</span>
                        </div>
                        <div
                            style={{
                                ...eighthColWidth,
                                background: getcolor,
                                borderRight: `1px solid ${fontcolor}`,
                            }}
                        >
                            <span className="mobileledger_total">{formatValue(totalOpening)}</span>
                        </div>
                        <div
                            style={{
                                ...ninthColWidth,
                                background: getcolor,
                                borderRight: `1px solid ${fontcolor}`,
                            }}
                        >
                            <span className="mobileledger_total">{formatValue(totalBalance)}</span>
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
                            ref={input3Ref}
                            // onClick={fetchDailyStatusReport}
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