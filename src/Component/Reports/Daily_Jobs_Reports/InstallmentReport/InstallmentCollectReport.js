import React, { useState, useEffect, useRef } from "react";
import { Container, Spinner, Nav } from "react-bootstrap";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import { useTheme } from "../../../../ThemeContext";
import { getUserData, getOrganisationData, getLocationnumber, getYearDescription} from "../../../Auth";
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
// import { fetchGetUser } from "../../Redux/action";
import { fetchGetUser } from "../../../Redux/action";
import { useHotkeys } from "react-hotkeys-hook";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function InstallmentCollectReport() {
    const navigate = useNavigate();
    const user = getUserData();
    const organisation = getOrganisationData();

    const saleSelectRef = useRef(null);
    const input1Ref = useRef(null);
    const input1Reftype = useRef(null);
    const input2Ref = useRef(null);
    const input3Ref = useRef(null);

    const toRef = useRef(null);
    const fromRef = useRef(null);

    const [saleType, setSaleType] = useState("");
    const [searchQuery, setSearchQuery] = useState("");
    const [transectionType, settransectionType] = useState("A");
    const [transectionType2, settransectionType2] = useState("");

    const [supplierList, setSupplierList] = useState([]);
    console.log('getactivecollectordata', supplierList)

    const [Companyselectdatavalue, setCompanyselectdatavalue] = useState("");


    const [totalQnty, setTotalQnty] = useState(0);
    const [totalOpening, setTotalOpening] = useState(0);
    const [totalDebit, setTotalDebit] = useState(0);
    const [totalCredit, setTotalCredit] = useState(0);
    const [closingBalance, setClosingBalance] = useState(0);
    const [totalDif, settotalDif] = useState(0);


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
        getdatafontsize,
        getfontstyle
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

                if (saleSelectRef.current) {
                    e.preventDefault();
                    saleSelectRef.current.focus();
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


        console.log(data);
        document.getElementById(
            "fromdatevalidation"
        ).style.border = `1px solid ${fontcolor}`;
        document.getElementById(
            "todatevalidation"
        ).style.border = `1px solid ${fontcolor}`;

        const apiUrl = apiLinks + "/InstallmentCollectionReport.php";
        setIsLoading(true);
        const formData = new URLSearchParams({
            FIntDat: fromInputDate,
            FFnlDat: toInputDate,
            FColCod: saleType,
            FRepTyp: transectionType,
            FCstTyp: transectionType2,
             FSchTxt: searchQuery,
            code: organisation.code,
            FLocCod: locationnumber || getLocationNumber,
            FYerDsc: yeardescription || getyeardescription,
            
            // code: 'MTSELEC',
            // FLocCod: '002',

        }).toString();

        axios
            .post(apiUrl, formData)
            .then((response) => {
                setIsLoading(false);

                setTotalDebit(response.data["Total Cnt"]);
                setTotalCredit(response.data["Total Ins"]);
                setClosingBalance(response.data["Total Col"]);
                settotalDif(response.data["Total Dif"]);


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
        const apiUrl = apiLinks + "/GetActiveCollector.php";
        const formData = new URLSearchParams({
        //   code: organisation.code,
        //    FLocCod: getLocationNumber,
             FLocCod: '001',
            code: 'MTSELEC',
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

    const options = supplierList.map((item) => ({
        value: item.tcolcod,
        label: `${item.tcolcod}-${item.tcolnam.trim()}`,
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
            borderColor: "#3368B5",
            boxShadow: "0 0 0 1px #3368B5",
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
              backgroundColor: "#3368B5",
            },
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
          color: state.isSelected || state.isFocused ? "white" : fontcolor,
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
          transform: state.selectProps.menuIsOpen
            ? "rotate(180deg)"
            : "rotate(0deg)",
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
          },
        }),
      });

    const handleTransactionTypeChange = (event) => {
        const selectedTransactionType = event.target.value;
        settransectionType(selectedTransactionType);
    };
    const handleTransactionTypeChange2 = (event) => {
        const selectedTransactionType2 = event.target.value;
        settransectionType2(selectedTransactionType2);
    };

    ///////////////////////////// DOWNLOAD PDF CODE ////////////////////////////////////////////////////////////
    const exportPDFHandler = () => {
        // Create a new jsPDF instance with landscape orientation
        const doc = new jsPDF({ orientation: "landscape" });

        // Define table data (rows)
        const rows = tableData.map((item) => [
            item.Date,
            item['Trn#'],
            // item.Type,
            
            item['Manual #'],
            item.Customer,
           item.Mobile,
            item['Ins Amt'],
            item.Collection,
            item.Diff,
             item.Collector,
        ]);

        // Add summary row to the table
        rows.push([
            String(formatValue(tableData.length.toLocaleString())),
            "",
            "",
            // "",
            "",
            "",
            // String(formatValue(totalDebit)),
            String(formatValue(totalCredit)),
            String(formatValue(closingBalance)),
            String(formatValue(totalDif)),
             "",
        ]);

        // Define table column headers and individual column widths
        const headers = [
            "Date",
            "Trn#",
            // "Type",
           
            "Manual#",
            "Customer",
             "Mobile",
            "Ins Amt",
            "Collection",
            "Diff",
            "Col",
        ];
        const columnWidths = [23, 16,  25, 90,26, 30, 30, 30, 15];

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
            cellIndex === 7 ||
            cellIndex === 8
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
        const rowsPerPage = 30; // Adjust this value based on your requirements

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
                    rightX - 15,
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
                addTitle(`Installment Collection Report From ${fromInputDate} To ${toInputDate}`, "", "", pageNumber, startY, 12); // Render sale report title with decreased font size, provide the time, and page number
                startY += -5;

                const labelsX = (doc.internal.pageSize.width - totalWidth) / 2;
                const labelsY = startY + 4; // Position the labels below the titles and above the table

             
                let status =
                    transectionType2 === "001"
                        ? "MONTHLY"
                        : transectionType2 === "002"
                            ? "DAILY"
                            : transectionType2 === "003"
                            ? "WEEKLY"
                            : "ALL";


                let status2 =
                    transectionType === "L"
                        ? "LESS INS"
                        : transectionType === "F"
                            ? "FULL INS" :
                            transectionType === "E"
                                ? "EXTRA INS"
                                : "ALL";


                let Accountcode = Companyselectdatavalue.label
                    ? Companyselectdatavalue.label
                    : "ALL";

              
doc.setFont("verdana", "bold");
          doc.setFontSize(10);
                          doc.text(`Collector :`, labelsX, labelsY + 8.5); // Draw bold label
doc.setFont("verdana-regular", "normal");
          doc.setFontSize(10);
                          doc.text(`${Accountcode}`, labelsX + 23, labelsY + 8.5); // Draw the value next to the label


doc.setFont("verdana", "bold");
          doc.setFontSize(10);
                          doc.text(`A/C Types :`, labelsX + 140, labelsY + 8.5); // Draw bold label
doc.setFont("verdana-regular", "normal");
          doc.setFontSize(10);
                          doc.text(`${status}`, labelsX + 165, labelsY + 8.5); // Draw the value next to the label


doc.setFont("verdana", "bold");
          doc.setFontSize(10);
                          doc.text(`Type :`, labelsX + 230, labelsY + 8.5); // Draw bold label
doc.setFont("verdana-regular", "normal");
          doc.setFontSize(10);
                          doc.text(`${status2}`, labelsX + 245, labelsY + 8.5); // Draw the value next to the label


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
        doc.save(`InastallmentcollectReport from ${fromInputDate} to ${toInputDate}.pdf`);
    };
    ///////////////////////////// DOWNLOAD PDF CODE ////////////////////////////////////////////////////////////
    ///////////////////////////// DOWNLOAD PDF EXCEL //////////////////////////////////////////////////////////
    const handleDownloadCSV = async () => {
        const workbook = new ExcelJS.Workbook();
        const worksheet = workbook.addWorksheet("Sheet1");

        const numColumns = 9; // Ensure this matches the actual number of columns

        const columnAlignments = [
            "center",
            "center",
            "left",
            // "center",
            "left",
            "center",
            "right",
            "right",
            "right",
            "right",
        ];

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
        const storeListRow = worksheet.addRow([`Installment Collection Report From ${fromInputDate} To ${toInputDate}`]);
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

        let actype = transectionType2 === "001" ?
            "MONTHLY" : transectionType2 === "002"
                ? "DAILY": transectionType2 === "003"
                ? "WEEKLY" : "ALL"

        let type = transectionType === "L" ?
            "LESS INS" : transectionType === "F"
                ? "FULL INS" : transectionType === "E"
                    ? "EXTRA INS" : "ALL";



      const typeAndStoreRow = worksheet.addRow([
  "Collector :",
  typecompany,
  "",
  "",
  "",
  "A/C Type :",
  actype,
  "",
  "Type :",
  type
]);

worksheet.mergeCells(`B${typeAndStoreRow.number}:E${typeAndStoreRow.number}`);

// Columns that should be RIGHT aligned (values)
const rightAlignCols = [6,9];

// Columns that should be BOLD (labels)
const boldCols = [1, 6, 9];

typeAndStoreRow.eachCell((cell, colIndex) => {
  cell.font = {
    name: "CustomFont",
    size: 10,
    bold: boldCols.includes(colIndex),
  };

  cell.alignment = {
    horizontal: rightAlignCols.includes(colIndex) ? "right" : "left",
    vertical: "middle",
  };
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
            "Date",
            "Trn#",
            // "Type",
           
            "Manual#",
            "Customer",
             "Mobile",
            "Ins Amt",
            "Collection",
            "Diff",
             "Col",
        ];
        const headerRow = worksheet.addRow(headers);
        headerRow.eachCell((cell) => Object.assign(cell, headerStyle));

        // Add data rows
        tableData.forEach((item) => {
            const row = worksheet.addRow([
                item.Date,
                item['Trn#'],
                // item.Type,
               
                item['Manual #'],
                item.Customer,
               item.Mobile,
                item['Ins Amt'],
                item.Collection,
                item.Diff,
                  item.Collector,
            ]);

            row.eachCell((cell, colIndex) => {
                cell.font = fontTableContent;
                cell.border = { top: { style: "thin" }, left: { style: "thin" }, bottom: { style: "thin" }, right: { style: "thin" } };
                cell.alignment = { horizontal: columnAlignments[colIndex - 1] || "left", vertical: "middle" };
            });
        });

        // Set column widths
        [11, 8, 10, 45, 12,12, 14, 14, 6].forEach((width, index) => {
            worksheet.getColumn(index + 1).width = width;
        });


        const totalRow = worksheet.addRow([
        String(formatValue(tableData.length.toLocaleString())),
            "",
            "",
            "",
            "",
           
        //  String(formatValue(totalDebit)),
         String(formatValue(totalCredit)),
         String(formatValue(closingBalance)),
         String(formatValue(totalDif)),
          "",
        ]);

        // total row added

        totalRow.eachCell((cell, colNumber) => {
            cell.font = { name: 'CustomFont', size: 10, bold: true }; // Apply CustomFont
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


        // Add an empty row after the title section
        worksheet.addRow([]);
        // Date and Time
     const today = new Date();
     const currentTime = today.toLocaleTimeString("en-GB");
     const currentDate = today.toLocaleDateString("en-GB").replace(/\//g, "-");
     const userid = user.tusrid;
 
     const dateTimeRow = worksheet.addRow([`DATE:   ${currentDate}  TIME:   ${currentTime}`]);
     dateTimeRow.eachCell((cell) => {
       cell.font = { name: "CustomFont", size: 10 };
       cell.alignment = { horizontal: "left" };
     });
 
     const dateTimeRow1 = worksheet.addRow([`USER ID:  ${userid}`]);
     dateTimeRow1.eachCell((cell) => {
       cell.font = { name: "CustomFont", size: 10 };
       cell.alignment = { horizontal: "left" };
     });
 
     // Merge cells
     worksheet.mergeCells(`A${dateTimeRow.number}:${String.fromCharCode(65 + numColumns - 1)}${dateTimeRow.number}`);
     worksheet.mergeCells(`A${dateTimeRow1.number}:${String.fromCharCode(65 + numColumns - 1)}${dateTimeRow1.number}`);
 

        // Generate and save the Excel file
        const buffer = await workbook.xlsx.writeBuffer();
        const blob = new Blob([buffer], { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" });
        saveAs(blob, `InstallmentCollectionReport From ${fromInputDate} To ${toInputDate}.xlsx`);
    };
    ///////////////////////////// DOWNLOAD PDF EXCEL ///////////////////////////////////////////////////////////


    const dispatch = useDispatch();

    const tableTopColor = "#3368B5";
    const tableHeadColor = "#3368b5";
    const secondaryColor = "white";
    const btnColor = "#3368B5";
    const textColor = "white";

    const [tableData, setTableData] = useState([]);
    console.log('installment sale reports data', tableData)
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
        width: "55px",
    };
    const thirdColWidth = {
        width: "40px",
    };
    const forthColWidth = {
        width: "90px",
    };
    const fifthColWidth = {
        width: "70px",
    };
    const sixthColWidth = {
        width: "300px",
    };
    const seventhColWidth = {
        width: "40px",
    };
    const eighthColWidth = {
        width: "85px",
    };
    const ninhthColWidth = {
        width: "85px",
    };
    const tenthColWidth = {
        width: "85px",
    };
        const sixColWidth = {
        width: "8px",
    };


    useHotkeys(
      "alt+s",
      () => {
        fetchReceivableReport();
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

    const formatValue = (val) => {
    return Number(val) === 0  ? "" : val;
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
                    <NavComponent textdata="Installment Collectoin Report" />
                    <div className="row"
                        style={{ height: "20px", marginTop: "8px", marginBottom: "8px", }}>

                        <div style={{
                            width: "100%",
                            display: "flex",
                            alignItems: "center",
                            margin: "0px",
                            padding: "0px",
                            justifyContent: "start",
                        }}>
                               <div className="d-flex align-items-center" style={{marginLeft:'10px'}}>
                                <div
                                    style={{
                                        width: "80px",
                                        display: "flex",
                                        justifyContent: "end",
                                        marginLeft: '5px'
                                    }}
                                >
                                    <label htmlFor="fromDatePicker">
                                        <span style={{ fontFamily: getfontstyle, fontSize: getdatafontsize, fontWeight: "bold", marginLeft: '2px' }}>
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
                                            fontFamily: getfontstyle, fontSize: getdatafontsize,
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
                                                        fontFamily: getfontstyle, fontSize: getdatafontsize,
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
                                className="d-flex align-items-center" style={{marginLeft:'50px'}}
                            >
                                <div
                                    style={{
                                        width: "60px",
                                        display: "flex",
                                        justifyContent: "end",
                                    }}
                                >
                                    <label htmlFor="toDatePicker">
                                        <span style={{ fontFamily: getfontstyle, fontSize: getdatafontsize, fontWeight: "bold" }}>
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
                                            fontFamily: getfontstyle, fontSize: getdatafontsize,
                                            backgroundColor: getcolor,
                                            color: fontcolor,
                                            opacity: selectedRadio === "custom" ? 1 : 0.5,
                                            pointerEvents:
                                                selectedRadio === "custom" ? "auto" : "none",
                                        }}
                                        value={toInputDate}
                                        onChange={handleToInputChange}
                                        onKeyDown={(e) => handleToKeyPress(e, saleSelectRef)}
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
                                                        fontFamily: getfontstyle, fontSize: getdatafontsize,
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

                              

                            {/* CODE FOR SELECT */}

                           

                        </div>



                    </div>

                    {/* CODE FOR CODE SELECT */}

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

<div className="d-flex align-items-center  " style={{ marginLeft: '15px' }}>
                                <div style={{ width: '80px', display: 'flex', justifyContent: 'end' }}>
                                    <label htmlFor="fromDatePicker"><span style={{ fontFamily: getfontstyle, fontSize: getdatafontsize, fontWeight: 'bold' }}>Collector :</span>  <br /></label>
                                </div>
                                <div style={{ marginLeft: '5px' }} >
                                    <Select
                                        className="List-select-class"
                                        ref={saleSelectRef}
                                        options={options}
                                        onKeyDown={(e) => handleSaleKeypress(e, 'AcountType')}
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
                                         onInputChange={(inputValue, { action }) => {
                                                             if (action === "input-change") {
                                                               return inputValue.toUpperCase();
                                                             }
                                                             return inputValue;
                                                           }}
                                                           components={{ Option: DropdownOption }}
                                                           styles={{
                                                             ...customStyles1(!saleType),
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
                                        width: "60px",
                                        display: "flex",
                                        justifyContent: "end",
                                    }}
                                >
                                    <label htmlFor="transactionType">
                                        <span style={{ fontFamily: getfontstyle, fontSize: getdatafontsize, fontWeight: "bold" }}>
                                            Type :
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
                    <option value="L">LESS INS</option>
                    <option value="F">FULL INS</option>
                    <option value="E">EXTRA INS</option>

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

                        </div>
                    </div>
                    {/* ///////////////////////// */}
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
                                style={{ marginLeft: "20px" }}
                            >
                                <div
                                    style={{
                                        width: "75px",
                                        display: "flex",
                                        justifyContent: "end",
                                    }}
                                >
                                    <label htmlFor="transactionType">
                                        <span style={{ fontFamily: getfontstyle, fontSize: getdatafontsize, fontWeight: "bold" }}>
                                            A/C Type :
                                        </span>
                                    </label>
                                </div>



                               <div style={{ position: "relative", display: "inline-block" }}>
                  <select
                    ref={input1Reftype}
                    onKeyDown={(e) => handleKeyPress(e, input1Ref)}
                    id="AcountType"
                    name="type"
                    onFocus={(e) =>
                      (e.currentTarget.style.border = "4px solid red")
                    }
                    onBlur={(e) =>
                      (e.currentTarget.style.border = `1px solid ${fontcolor}`)
                    }
                    value={transectionType2}
                    onChange={handleTransactionTypeChange2}
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
                    <option value="">ALL</option>
                    <option value="001">MONTHLY</option>
                    <option value="002">DAILY</option>
                                        <option value="003">WEEKLY</option>

                  </select>

                  {transectionType2 !== "" && (
                    <span
                      onClick={() => settransectionType2("")}
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

                             <div id="lastDiv"style={{ marginRight: "1px" }} >
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
                                // width: "98.8%",
                            }}
                        >
                            <table
                                className="myTable"
                                id="table"
                                style={{
                                    fontFamily: getfontstyle, fontSize: getdatafontsize,
                                    // width: "100%",
                                    position: "relative",
                                    paddingRight: "2%",
                                }}
                            >
                                <thead
                                    style={{
                                        fontFamily: getfontstyle, fontSize: getdatafontsize,
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
                                        {/* <td className="border-dark" style={thirdColWidth}>
                                            Type
                                        </td> */}
                                       
                                        <td className="border-dark" style={fifthColWidth}>
                                            Manual #
                                        </td>
                                        <td className="border-dark" style={sixthColWidth}>
                                            Customer
                                        </td>
                                         <td className="border-dark" style={forthColWidth}>
                                            Mobile
                                        </td>
                                       
                                        <td className="border-dark" style={eighthColWidth}>
                                            Ins Amt
                                        </td>
                                        <td className="border-dark" style={eighthColWidth}>
                                            Collection
                                        </td>
                                        <td className="border-dark" style={eighthColWidth}>
                                            Diff
                                        </td>
                                         <td className="border-dark" style={seventhColWidth}>
                                            Col
                                        </td>
                                          <td className="border-dark" style={sixColWidth}>
                                            
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
                                maxHeight: "40vh",
                                // width: "100%",
                                wordBreak: "break-word",
                            }}
                        >
                            <table
                                className="myTable"
                                id="tableBody"
                                style={{
                                    fontFamily: getfontstyle, fontSize: getdatafontsize,
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
                                                {/* <td style={thirdColWidth}></td> */}
                                                <td style={fifthColWidth}></td>
                                                <td style={sixthColWidth}></td>
                                                                                                <td style={forthColWidth}></td>

                                                <td style={eighthColWidth}></td>
                                                <td style={ninhthColWidth}></td>
                                                <td style={tenthColWidth}></td>
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
                                                        className={
                                                            selectedIndex === i ? "selected-background" : ""
                                                        }
                                                        style={{
                                                            backgroundColor: getcolor,
                                                            color: fontcolor,
                                                        }}
                                                    >
                                                        <td className="text-center" style={firstColWidth}>
                                                            {item.Date}
                                                        </td>
                                                        <td className="text-center" style={secondColWidth}>
                                                            {item['Trn#']}
                                                        </td>
                                                        {/* <td className="text-center" style={thirdColWidth}>
                                                            {item.Type}
                                                        </td> */}
                                                       
                                                        <td className="text-start" style={fifthColWidth}>
                                                            {item['Manual #']}
                                                        </td>
                                                        <td className="text-start" style={sixthColWidth}>
                                                            {item.Customer}
                                                        </td>
                                                         <td className="text-center" style={forthColWidth}>
                                                            {item.Mobile}
                                                        </td>
                                                       
                                                        <td className="text-end" style={eighthColWidth}>
                                                            {item['Ins Amt']}
                                                        </td>
                                                        <td className="text-end" style={ninhthColWidth}>
                                                            {item.Collection}
                                                        </td>
                                                        <td className="text-end" style={tenthColWidth}>
                                                            {item.Diff}
                                                        </td>
                                                         <td className="text-end" style={seventhColWidth}>
                                                            {item.Collector}
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
                                                {/* <td style={thirdColWidth}></td> */}
                                                <td style={fifthColWidth}></td>
                                                <td style={sixthColWidth}></td>
                                                                                                <td style={forthColWidth}></td>

                                                <td style={eighthColWidth}></td>
                                                <td style={ninhthColWidth}></td>
                                                <td style={tenthColWidth}></td>
                                                <td style={seventhColWidth}></td>


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
                            // width: '101.2%'
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
                        {/* <div
                            style={{
                                ...thirdColWidth,
                                background: getcolor,
                                borderRight: `1px solid ${fontcolor}`,
                            }}
                        >
                        </div> */}
                       
                        <div
                            style={{
                                ...fifthColWidth,
                                background: getcolor,
                                borderRight: `1px solid ${fontcolor}`,
                            }}
                        >
                        </div>
                        <div
                            style={{
                                ...sixthColWidth,
                                background: getcolor,
                                borderRight: `1px solid ${fontcolor}`,
                            }}
                        >
                        </div>
                         <div
                            style={{
                                ...forthColWidth,
                                background: getcolor,
                                borderRight: `1px solid ${fontcolor}`,
                            }}
                        >
                        </div>
                       
                        <div
                            style={{
                                ...eighthColWidth,
                                background: getcolor,
                                borderRight: `1px solid ${fontcolor}`,
                            }}
                        >
                            <span className="mobileledger_total">{formatValue(totalCredit)}</span>

                        </div>
                        <div
                            style={{
                                ...ninhthColWidth,
                                background: getcolor,
                                borderRight: `1px solid ${fontcolor}`,
                            }}
                        >
                            <span className="mobileledger_total">{formatValue(closingBalance)}</span>

                        </div>
                        <div
                            style={{
                                ...tenthColWidth,
                                background: getcolor,
                                borderRight: `1px solid ${fontcolor}`,
                            }}
                        >
                            <span className="mobileledger_total">{formatValue(totalDif)}</span>

                        </div>
                         <div
                            style={{
                                ...seventhColWidth,
                                background: getcolor,
                                borderRight: `1px solid ${fontcolor}`,
                            }}
                        >
                            {/* <span className="mobileledger_total">{formatValue(totalDebit)}</span> */}

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
