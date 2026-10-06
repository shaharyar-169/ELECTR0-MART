import React, { useState, useEffect, useRef } from "react";
import { Container, Spinner, Nav } from "react-bootstrap";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import { useTheme } from "../../../../ThemeContext";
import { getUserData, getOrganisationData ,getLocationnumber, getYearDescription} from "../../../Auth";
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


export default function InstallmentMonthWiseReport() {
    const navigate = useNavigate();
    const user = getUserData();
    const organisation = getOrganisationData();

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
      const [CollectorData, setCollectorData] = useState([]);

    const [saleType, setSaleType] = useState("");


    const [storeList, setStoreList] = useState([]);
    const [storeType, setStoreType] = useState("");

    const input1Ref = useRef(null);
    const CustRef = useRef(null);
    const input3Ref = useRef(null);
    const input4Ref = useRef(null);
    const input5Ref = useRef(null);
    const input6Ref = useRef(null);

    const [Companyselectdata, setCompanyselectdata] = useState("");

    console.log("Companyselectdata", Companyselectdata);
    const [Companyselectdatavalue, setCompanyselectdatavalue] = useState("");


    const [Capacityselectdata, setCapacityselectdata] = useState("");
    const [capacityselectdatavalue, setcapacityselectdatavalue] = useState("");

    const [GetCapacity, setGetCapacity] = useState([]);
    const [GetCompany, setGetCompany] = useState([]);
    const [Categoryselectdata, setCategoryselectdata] = useState("");
    const [categoryselectdatavalue, setcategoryselectdatavalue] = useState("");

    const [GetCategory, setGetCategory] = useState([]);

    const [Typeselectdata, setTypeselectdata] = useState("");
    const [typeselectdatavalue, settypeselectdatavalue] = useState("");

    const [GetType, setGetType] = useState([]);

    const [sortData, setSortData] = useState("ASC");

    const [searchQuery, setSearchQuery] = useState("");
    const [transectionType, settransectionType] = useState("");
    const [transectionType2, settransectionType2] = useState("");


    

    const [totalSale, settotalSale] = useState(0);
    const [totalAdvance, settotalAdvance] = useState(0);
    const [totalIns, settotalIns] = useState(0);
    const [totalCollection, settotalCollection] = useState(0);
    const [totalDisc, settotalDisc] = useState(0);
    const [totalBalance, settotalBalance] = useState(0);


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

        const apiMainUrl = apiLinks + "/InstallmentMonthWiseReport.php";
        setIsLoading(true);
        const formMainData = new URLSearchParams({
            FRepDat: toInputDate,
            FRepTyp: transectionType,
            FCstTyp: transectionType2,
            FSchTxt: searchQuery,
            FColCod: Companyselectdata,

            code: organisation.code,
            FLocCod: locationnumber || getLocationNumber,
            // FYerDsc: yeardescription || getYearDescription,

            // code: 'SMART2',
            // FLocCod: '001',
            // FYerDsc: '2025-2025',

        }).toString();

        axios
            .post(apiMainUrl, formMainData)
            .then((response) => {
                setIsLoading(false);
                settotalSale(response.data["Total Sale"]);
                settotalAdvance(response.data["Total Advance"]);
                settotalBalance(response.data["Total Balance"]);
                settotalIns(response.data["Total Ins"]);
                settotalDisc(response.data["Total Disc"]);
                settotalCollection(response.data["Total Collection"]);

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
    const apiUrl = apiLinks + "/GetCollectors.php";
    const formData = new URLSearchParams({
      code: organisation.code,
      FLocCod: locationnumber || getLocationNumber,
    //   FLocCod: "001",
    //   code: "PAKEEZATRD",
    }).toString();
    axios
      .post(apiUrl, formData)
      .then((response) => {
        setCollectorData(response.data);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });
  }, []);

  const Collectoroption = CollectorData?.map((item) => ({
    value: item.tcolcod,
    label: `${item.tcolcod}-${item.tcolnam.trim()}`,
  })) ?? [];

 


 const DropdownOption = (props) => {
    return (
      <components.Option {...props}>
        <div
          style={{
            fontSize: getdatafontsize,
            fontFamily: getfontstyle,
            padding: "2px 8px",            // tighter vertical padding
            lineHeight: "1.2",
            // lineHeight: "3px",
            whiteSpace: "normal",
            wordBreak: "break-word",
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
        borderColor: "#ff0000", // Changed to red
        boxShadow: "0 0 0 1px #ff0000", // Changed to red
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
      width: "auto",
      minWidth: "100%",
    }),
    menuList: (base) => ({
      ...base,
      padding: 0,
      maxHeight: "200px",
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
      whiteSpace: "normal",
      wordBreak: "break-word",
      padding: "2px 8px",
      lineHeight: "1.2",
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
      color: `${fontcolor}80`,
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
      backgroundColor: `${fontcolor}20`,
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

  const exportPDFHandler = () => {
    const doc = new jsPDF({ orientation: "landscape" });

    const rows = tableData.map((item) => [
        item.code,
        item.Customer,
        item["Sale Date"],
        item.Sale,
        item.Advance,
        item.Collection,
        item.Disc,
        item.Balance,
        item.Receiavable,
        item.InsAmt,
        item["Last Date"],
        item.MonthDiff,
    ]);

    rows.push([
        String(tableData.length.toLocaleString()),
        "",
        "",
        String(totalSale),
        String(totalAdvance),
        String(totalCollection),
        String(totalDisc),
        String(totalBalance),
        String(totalIns),
        "",
        "",
        "",
        
    ]);

    const headers = [
        "Code",
        "Customer",
        "SaleDate",
        "Sale",
        "Advance",
        "Collec",
        "Disc",
        "Balance",
        "Recei",
        "InsAmt",
        "LastDate",
        "Diff",
    ];
    const columnWidths = [24, 45, 24, 25, 25, 25, 15, 25, 20, 20, 24, 10];

    const totalWidth = columnWidths.reduce((acc, width) => acc + width, 0);

    const pageHeight = doc.internal.pageSize.height;
    const paddingTop = 15;

    doc.setFont("verdana-regular", "normal");
    doc.setFontSize(10);

    const BASE_ROW_HEIGHT = 5;
    const FOOTER_LINE_Y = pageHeight - 15;
    const FOOTER_GAP = 3;

    // ✅ Helper: measure text width
    const getTextWidth = (text) => doc.getTextWidth(String(text));

    // ✅ Helper: wrap Customer text within fixed column width
    const wrapCustomerText = (text) => {
        const customerColIndex = 1;
        const padding = 4;
        const maxWidth = columnWidths[customerColIndex] - padding;
        const raw = String(text ?? "");
        if (getTextWidth(raw) <= maxWidth) {
            return [raw];
        }
        const words = raw.split(/\s+/);
        const lines = [];
        let current = "";
        for (const word of words) {
            const test = current ? current + " " + word : word;
            if (getTextWidth(test) <= maxWidth) {
                current = test;
            } else {
                if (current) lines.push(current);
                if (getTextWidth(word) > maxWidth) {
                    let chunk = "";
                    for (const ch of word) {
                        if (getTextWidth(chunk + ch) <= maxWidth) {
                            chunk += ch;
                        } else {
                            lines.push(chunk);
                            chunk = ch;
                        }
                    }
                    current = chunk;
                } else {
                    current = word;
                }
            }
        }
        if (current) lines.push(current);
        return lines;
    };

    const addTableHeaders = (startX, startY) => {
        doc.setFont("verdana", "bold");
        doc.setFontSize(10);

        headers.forEach((header, index) => {
            const cellWidth = columnWidths[index];
            const cellHeight = 6;
            const cellX = startX + cellWidth / 2;
            const cellY = startY + cellHeight / 2 + 1.5;

            doc.setFillColor(200, 200, 200);
            doc.rect(startX, startY, cellWidth, cellHeight, "F");
            doc.setLineWidth(0.2);
            doc.rect(startX, startY, cellWidth, cellHeight);
            doc.setTextColor(0);
            doc.text(header, cellX, cellY, { align: "center" });
            startX += columnWidths[index];
        });

        doc.setFont(getfontstyle);
        doc.setFontSize(10);
    };

    const getTotalTableWidth = () => {
        let tw = 0;
        columnWidths.forEach((width) => (tw += width));
        return tw;
    };

    const addTableRows = (startX, startY, startIndex, endIndex) => {
        const normalFont = getfontstyle;
        const tableWidth = getTotalTableWidth();

        doc.setFontSize(10);

        let cumulativeY = startY + 2 * BASE_ROW_HEIGHT;
        let maxBottomY = cumulativeY;

        for (let i = startIndex; i < endIndex; i++) {
            const row = rows[i];
            const isTotalRow = i === rows.length - 1;
            const isOddRow = i % 2 !== 0;

            // ✅ Determine Customer wrapping → double height if needed
            const customerLines = wrapCustomerText(row[1]);
            const isDoubleHeight = customerLines.length > 1;
            const rowHeight = isDoubleHeight ? BASE_ROW_HEIGHT * 2 : BASE_ROW_HEIGHT;

            if (isTotalRow) {
                doc.setFont("verdana-regular", "normal");
                doc.setFontSize(10);
            }

            if (isOddRow && !isTotalRow) {
                doc.setFillColor(240);
                doc.rect(startX, cumulativeY, tableWidth, rowHeight, "F");
            }

            doc.setDrawColor(0);

            if (isTotalRow) {
                const rowTopY = cumulativeY;
                const rowBottomY = cumulativeY + rowHeight;

                doc.setLineWidth(0.3);
                doc.line(startX, rowTopY, startX + tableWidth, rowTopY);
                doc.line(startX, rowTopY + 0.5, startX + tableWidth, rowTopY + 0.5);

                doc.line(startX, rowBottomY, startX + tableWidth, rowBottomY);
                doc.line(
                    startX,
                    rowBottomY - 0.5,
                    startX + tableWidth,
                    rowBottomY - 0.5,
                );

                doc.setLineWidth(0.2);
                doc.line(startX, rowTopY, startX, rowBottomY);
                doc.line(
                    startX + tableWidth,
                    rowTopY,
                    startX + tableWidth,
                    rowBottomY,
                );
            } else {
                doc.setLineWidth(0.2);
                doc.rect(startX, cumulativeY, tableWidth, rowHeight);
            }

            row.forEach((cell, cellIndex) => {
                const cellX = startX + 2;
                doc.setTextColor(0, 0, 0);

                doc.setFont("verdana-regular", "normal");
                doc.setFontSize(10);

                const cellValue = String(cell ?? "");

                if (cellIndex === 1) {
                    // ✅ Customer: wrap text inside fixed column, vertically centered per line
                    const lineHeight = rowHeight / customerLines.length;
                    customerLines.forEach((line, li) => {
                        const lineY = cumulativeY + li * lineHeight + lineHeight / 2;
                        doc.text(line, cellX, lineY, { baseline: "middle" });
                    });
                } else if (cellIndex === 0) {
                    // ✅ Code: center
                    const centerY = cumulativeY + rowHeight / 2;
                    const centerX = startX + columnWidths[cellIndex] / 2;
                    doc.text(cellValue, centerX, centerY, {
                        align: "center",
                        baseline: "middle",
                    });
                } else if (cellIndex === 2 || cellIndex === 10) {
                    // ✅ SaleDate, LastDate: CENTER
                    const centerY = cumulativeY + rowHeight / 2;
                    const centerX = startX + columnWidths[cellIndex] / 2;
                    doc.text(cellValue, centerX, centerY, {
                        align: "center",
                        baseline: "middle",
                    });
                } else {
                    // ✅ Numeric (Sale, Advance, Collection, Disc, Balance, Receivable, InsAmt, Ins): RIGHT
                    const centerY = cumulativeY + rowHeight / 2;
                    const rightAlignX = startX + columnWidths[cellIndex] - 2;
                    doc.text(cellValue, rightAlignX, centerY, {
                        align: "right",
                        baseline: "middle",
                    });
                }

                if (cellIndex < row.length - 1) {
                    doc.setLineWidth(0.2);
                    doc.line(
                        startX + columnWidths[cellIndex],
                        cumulativeY,
                        startX + columnWidths[cellIndex],
                        cumulativeY + rowHeight,
                    );
                    startX += columnWidths[cellIndex];
                }
            });

            startX = (doc.internal.pageSize.width - tableWidth) / 2;
            cumulativeY += rowHeight;
            maxBottomY = cumulativeY;
        }

        const lineX = (doc.internal.pageSize.width - tableWidth) / 2;
        const lineY = FOOTER_LINE_Y;
        doc.setLineWidth(0.3);
        doc.line(lineX, lineY, lineX + tableWidth, lineY);
        const headingX = lineX + 2;
        const headingY = lineY + 5;
        doc.setFont("verdana-regular", "normal");
        doc.setFontSize(10);
        doc.text(`Crystal Solution    ${date}    ${time}`, headingX, headingY);

        return maxBottomY;
    };

    const addNewPage = (startY) => {
        doc.addPage();
        return paddingTop;
    };

    // ✅ Precompute actual row heights for dynamic page-fitting
    const precomputedRowHeights = rows.map((row) => {
        const lines = wrapCustomerText(row[1]);
        return lines.length > 1 ? BASE_ROW_HEIGHT * 2 : BASE_ROW_HEIGHT;
    });

    // ✅ Given a starting table Y and row index, return max rows that fit above footer
    const fitRowsOnPage = (tableStartY, startRowIndex) => {
        let y = tableStartY + 2 * BASE_ROW_HEIGHT;
        const maxY = FOOTER_LINE_Y - FOOTER_GAP;
        let count = 0;
        let idx = startRowIndex;
        while (idx < precomputedRowHeights.length) {
            const h = precomputedRowHeights[idx];
            if (y + h <= maxY) {
                y += h;
                count++;
                idx++;
            } else {
                break;
            }
        }
        return Math.max(1, count);
    };

    const handlePagination = () => {
        const addTitle = (
            title,
            date,
            time,
            pageNumber,
            startY,
            titleFontSize = 18,
            pageNumberFontSize = 10,
            totalPages = 1,
        ) => {
            doc.setFontSize(titleFontSize);
            doc.text(title, doc.internal.pageSize.width / 2, startY, {
                align: "center",
            });

            const rightX = doc.internal.pageSize.width - 10;

            doc.setFont("verdana-regular", "normal");
            doc.setFontSize(10);
            doc.text(
                `Page ${pageNumber} / ${totalPages}`,
                rightX - 20,
                doc.internal.pageSize.height - 10,
                { align: "right" },
            );
        };

        // ✅ Compute tableStartY for first page
        const labelsYFirst = (paddingTop + 5) + 5 + 4;
        const tableStartYFirst = (labelsYFirst + 10) + 0;

        // ✅ Build dynamic page plan based on actual row heights
        const computePagePlan = () => {
            const plan = [];
            let rowIdx = 0;
            while (rowIdx < rows.length) {
                const count = fitRowsOnPage(tableStartYFirst, rowIdx);
                plan.push({ start: rowIdx, count });
                rowIdx += count;
            }
            return plan;
        };

        const pagePlan = computePagePlan();
        const totalPages = Math.max(1, pagePlan.length);

        let currentPageIndex = 0;
        let startY = paddingTop;
        let pageNumber = 1;

        while (currentPageIndex < pagePlan.length) {
            doc.setFont("Times New Roman", "normal");
            doc.setFontSize(10);
            addTitle(comapnyname, 12, 12, pageNumber, startY, 18, 10, totalPages);
            startY += 5;
            doc.setFont("verdana-regular", "normal");
            doc.setFontSize(10);
            addTitle(
                `Installment Month Wise Report As On ${toInputDate}`,
                "",
                "",
                pageNumber,
                startY,
                12,
                10,
                totalPages,
            );
            startY += 5;

            const labelsX = (doc.internal.pageSize.width - totalWidth) / 2;
            const labelsY = startY + 4;

            // ✅ Filters: Collector, Type, CustTyp
            let Typefilter =
                transectionType === "M1"
                    ? "1 Month"
                    : transectionType === "M2"
                        ? "2 Month"
                        : transectionType === "M3"
                            ? "3 Month"
                            : transectionType === "M4"
                                ? "3+ Month"
                                : "ALL";

            let CustTypfilter =
                transectionType2 === "001"
                    ? "Monthly"
                    : transectionType2 === "002"
                        ? "Dailt"
                        : transectionType2 === "003"
                            ? "Weekly"                           
                                : "ALL";

            let collectorData = Companyselectdatavalue.label
                ? Companyselectdatavalue.label
                : "ALL";

                         let search = searchQuery ? searchQuery : "";


            // ✅ Row 1: Collector | Type
            doc.setFont("verdana", "bold");
            doc.setFontSize(10);
            doc.text(`Collector :`, labelsX+ 2, labelsY);
            doc.setFont("verdana-regular", "normal");
            doc.setFontSize(10);
            doc.text(`${collectorData}`, labelsX + 25, labelsY);

            doc.setFont("verdana", "bold");
            doc.setFontSize(10);
            doc.text(`Type :`, labelsX + 184, labelsY);
            doc.setFont("verdana-regular", "normal");
            doc.setFontSize(10);
            doc.text(`${Typefilter}`, labelsX + 200, labelsY);

            // ✅ Row 2: CustTyp
            doc.setFont("verdana", "bold");
            doc.setFontSize(10);
            doc.text(`Cust Type :`, labelsX, labelsY + 4.3);
            doc.setFont("verdana-regular", "normal");
            doc.setFontSize(10);
            doc.text(`${CustTypfilter}`, labelsX + 25, labelsY + 4.3);


if(searchQuery){
  doc.setFont("verdana", "bold");
            doc.setFontSize(10);
            doc.text(`Search :`, labelsX + 180, labelsY+ 4.3);
            doc.setFont("verdana-regular", "normal");
            doc.setFontSize(10);
            doc.text(`${search}`, labelsX + 200, labelsY + 4.3);
}

            startY += 6;

            addTableHeaders((doc.internal.pageSize.width - totalWidth) / 2, 35);

            // ✅ Use dynamic page plan
            const pageSlice = pagePlan[currentPageIndex];
            const startIndex = pageSlice.start;
            const endIndex = Math.min(startIndex + pageSlice.count, rows.length);

            startY = addTableRows(
                (doc.internal.pageSize.width - totalWidth) / 2,
                startY,
                startIndex,
                endIndex,
            );
            if (endIndex < rows.length) {
                startY = addNewPage(startY);
                pageNumber++;
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

    const getCurrentTime = () => {
        const today = new Date();
        const hh = String(today.getHours()).padStart(2, "0");
        const mm = String(today.getMinutes()).padStart(2, "0");
        const ss = String(today.getSeconds()).padStart(2, "0");
        return hh + ":" + mm + ":" + ss;
    };

    const date = getCurrentDate();
    const time = getCurrentTime();

    handlePagination();

    doc.save(`InstallmentMonthWiseReport As On ${date}.pdf`);
};

const handleDownloadCSV = async () => {
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet("Sheet1");

    // 12 columns — matches the PDF layout
    const numColumns = 12;

    const columnAlignments = [
        "center", // 1  Code
        "left",   // 2  Customer
        "center", // 3  SaleDate
        "right",  // 4  Sale
        "right",  // 5  Advance
        "right",  // 6  Collec
        "right",  // 7  Disc
        "right",  // 8  Balance
        "right",  // 9  Recei
        "right",  // 10 InsAmt
        "center", // 11 LastDate
        "right",  // 12 Ins
    ];

    const toNumber = (value) => {
        if (typeof value === "number") return value;
        if (typeof value === "string") {
            const cleaned = value.replace(/,/g, "");
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

    // ===== Company title (Times New Roman, 16, bold, centered) =====
    const companyRow = worksheet.addRow([comapnyname]);
    companyRow.eachCell((cell) => {
        cell.font = {
            name: "Times New Roman",
            size: 16,
            bold: true,
        };
        cell.alignment = { horizontal: "center" };
    });

    worksheet.getRow(companyRow.number).height = 30;
    worksheet.mergeCells(
        `A${companyRow.number}:${String.fromCharCode(65 + numColumns - 1)}${companyRow.number}`
    );

    // ===== Report title =====
    const storeListRow = worksheet.addRow([
        `Installment Month Wise Report As On ${toInputDate}`,
    ]);
    storeListRow.eachCell((cell) => {
        cell.font = fontStoreList;
        cell.alignment = { horizontal: "center" };
    });

    worksheet.mergeCells(
        `A${storeListRow.number}:${String.fromCharCode(65 + numColumns - 1)}${storeListRow.number}`
    );

    worksheet.addRow([]);

    // ===== EXCEL FILTERS: Collector, Type, Cust Type, [Search] =====
     let Typefilter =
                transectionType === "M1"
                    ? "1 Month"
                    : transectionType === "M2"
                        ? "2 Month"
                        : transectionType === "M3"
                            ? "3 Month"
                            : transectionType === "M4"
                                ? "3+ Month"
                                : "ALL";

            let CustTypfilter =
                transectionType2 === "001"
                    ? "Monthly"
                    : transectionType2 === "002"
                        ? "Dailt"
                        : transectionType2 === "003"
                            ? "Weekly"                           
                                : "ALL";

    let collectorData = Companyselectdatavalue.label
        ? Companyselectdatavalue.label
        : "ALL";

    // ✅ Conditional search
    const searchValue = searchQuery ? searchQuery : "";
    const hasSearch = searchValue && searchValue.toString().trim() !== "";

    // Row 1: Collector | Type
    const typeAndStoreRow = worksheet.addRow([
        "Collector :",
        collectorData,
        "",
        "",
        "",
        "Type :",
        Typefilter,
    ]);

    // Row 2: CustType | Search (search only if present)
    const typeAndStoreRow2 = worksheet.addRow([
        "CustType :",
        CustTypfilter,
        "",
        "",
        "",
        hasSearch ? "Search :" : "",
        hasSearch ? searchValue : "",
    ]);

    // ✅ Style Row 1
    typeAndStoreRow.eachCell((cell, colIndex) => {
        cell.font = {
            name: "CustomFont" || "CustomFont",
            size: 10,
            bold: [1, 6].includes(colIndex),
        };
        if (colIndex === 6) {
            cell.alignment = { horizontal: "right", vertical: "middle" };
        } else {
            cell.alignment = { horizontal: "left", vertical: "middle" };
        }
    });

    // ✅ Style Row 2
    typeAndStoreRow2.eachCell((cell, colIndex) => {
        cell.font = {
            name: "CustomFont" || "CustomFont",
            size: 10,
            bold: [1, 6].includes(colIndex),
        };
        if (colIndex === 6) {
            cell.alignment = { horizontal: "right", vertical: "middle" };
        } else {
            cell.alignment = { horizontal: "left", vertical: "middle" };
        }
    });

    // ✅ MERGE: Collector value (B:D) | Type value (G:I) | CustType value (B:D) | Search value (G:I)
    worksheet.mergeCells(
        `B${typeAndStoreRow.number}:D${typeAndStoreRow.number}`
    );
    worksheet.mergeCells(
        `G${typeAndStoreRow.number}:I${typeAndStoreRow.number}`
    );
    worksheet.mergeCells(
        `B${typeAndStoreRow2.number}:D${typeAndStoreRow2.number}`
    );

    if (hasSearch) {
        worksheet.mergeCells(
            `G${typeAndStoreRow2.number}:I${typeAndStoreRow2.number}`
        );
    }

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

    // ✅ 12 headers — matches PDF
    const headers = [
        "Code",
        "Customer",
        "SaleDate",
        "Sale",
        "Advance",
        "Collec",
        "Disc",
        "Balance",
        "Recei",
        "InsAmt",
        "LastDate",
        "Diff",
    ];
    const headerRow = worksheet.addRow(headers);
    headerRow.eachCell((cell) => Object.assign(cell, headerStyle));

    // ===== Data rows — all numeric values stored as real numbers =====
    tableData.forEach((item) => {
        const row = worksheet.addRow([
            item.code,
            item.Customer,
            item["Sale Date"],
            toNumber(item.Sale),
            toNumber(item.Advance),
            toNumber(item.Collection),
            toNumber(item.Disc),
            toNumber(item.Balance),
            toNumber(item.Receiavable),
            toNumber(item.InsAmt),
            item["Last Date"],
            toNumber(item.MonthDiff),
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
            // ✅ Numeric format for numeric columns + force Number type
            if ([4, 5, 6, 7, 8, 9, 10, 12].includes(colIndex)) {
                cell.value = toNumber(cell.value);
                cell.numFmt = "#,##0";
            }
        });
    });

    // Column widths — 12 columns (wider to fill the Excel sheet)
    [
        10, // 1  Code
        30, // 2  Customer
        12, // 3  SaleDate
        12, // 4  Sale
        12, // 5  Advance
        12, // 6  Collec
        8,  // 7  Disc
        12, // 8  Balance
        10, // 9  Recei
        10, // 10 InsAmt
        12, // 11 LastDate
        5,  // 12 Ins
    ].forEach((width, index) => {
        worksheet.getColumn(index + 1).width = width;
    });

    // ===== Totals row =====
    const totalSaleNum = toNumber(totalSale);
    const totalAdvanceNum = toNumber(totalAdvance);
    const totalCollectionNum = toNumber(totalCollection);
    const totalDiscNum = toNumber(totalDisc);
    const totalBalanceNum = toNumber(totalBalance);
    const totalInsNum = toNumber(totalIns);

    const totalRow = worksheet.addRow([
        tableData.length,       // 1  Code — total number of rows (numeric, centered)
        "",                     // 2  Customer
        "",                     // 3  SaleDate
        totalSaleNum,           // 4  Sale
        totalAdvanceNum,        // 5  Advance
        totalCollectionNum,     // 6  Collec
        totalDiscNum,           // 7  Disc
        totalBalanceNum,  
         totalInsNum,       // 8  Balance
        "",                     // 9  Recei
        "",                     // 10 InsAmt
        "",                     // 11 LastDate
                  // 12 Ins
    ]);

    totalRow.eachCell((cell, colNumber) => {
        cell.font = { bold: true };
        cell.border = {
            top: { style: "double" },
            left: { style: "thin" },
            bottom: { style: "double" },
            right: { style: "thin" },
        };
        if (colNumber === 1) {
            cell.alignment = { horizontal: "center" };
            // ✅ Ensure the row count stays a real number
            cell.value = Number(cell.value);
            cell.numFmt = "0";
        } else if (colNumber > 3) {
            cell.alignment = { horizontal: "right" };
        }
        if ([4, 5, 6, 7, 8, 9, 10, 12].includes(colNumber)) {
            cell.value = toNumber(cell.value);
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
        cell.font = { name: "CustomFont" || "CustomFont", size: 10 };
        cell.alignment = { horizontal: "left" };
    });

    const dateTimeRow1 = worksheet.addRow([`USER ID:  ${userid}`]);
    dateTimeRow1.eachCell((cell) => {
        cell.font = { name: "CustomFont" || "CustomFont", size: 10 };
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
    saveAs(blob, `InstallmentMonthWiseReport As On ${currentdate}.xlsx`);
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
     const handleTransactionTypeChange2 = (event) => {
        const selectedTransactionType = event.target.value;
        settransectionType2(selectedTransactionType);
    };


    const isLargeScreen = window.innerWidth > 1500;

  const contentStyle = {
 width: "100%",
  maxWidth: isSidebarVisible
    ? (isLargeScreen ? "1065px" : "1000px")
    : (isLargeScreen ? "1065px" : "1065px"),
  height: "calc(100vh - 100px)",
  position: "absolute",
  top: "70px",
  left: isSidebarVisible ? "60vw" : "53vw",
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
  fontFamily: "verdana",
  zIndex: 1,
  padding: "0 20px",
  boxSizing: "border-box",
};

    const firstColWidth = {
        width: "80px",
    };
    const secondColWidth = {
        width: isSidebarVisible
    ? (isLargeScreen ? "250px" : "205px")
    : (isLargeScreen ? "250px" : "250px"),
  };
    
    const thirdColWidth = {
        width: "85px",
    };
    const forthColWidth = {
        width: "85px",
    };
    const fifthColWidth = {
        width: "85px",
    };
    const sixthColWidth = {
        width: "85px",
    };
    const seventhColWidth = {
        width: "60px",
    };
    const eighthColWidth = {
        width: "85px",
    };
    const ninthColWidth = {
        width: "75px",
    };
    const tenthColWidth = {
        width: "75px",
    };
    const tenthColWidth1 = {
        width: "85px",
    };
   
    const tenthColWidth5 = {
        width: "40px",
    };
         const LastColWidth = {
        width: "8px",
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


     const [columns, setColumns] = useState({
        Qnty: [],
       
      });
      const [columnSortOrders, setColumnSortOrders] = useState({
        Qnty: "",
       
      });
      useEffect(() => {
        if (tableData.length > 0) {
          const newColumns = {
            Qnty: tableData.map((row) => row.Qnty),
          
          };
          setColumns(newColumns);
        }
      }, [tableData]);
    
      const handleSorting = (col) => {
        const currentOrder = columnSortOrders[col];
        const newOrder = currentOrder === "ASC" ? "DSC" : "ASC";
    
        const sortedData = [...tableData].sort((a, b) => {
          const aVal =
            a[col] !== null && a[col] !== undefined ? a[col].toString() : "";
          const bVal =
            b[col] !== null && b[col] !== undefined ? b[col].toString() : "";
    
          const numA = parseFloat(aVal.replace(/,/g, ""));
          const numB = parseFloat(bVal.replace(/,/g, ""));
    
          if (!isNaN(numA) && !isNaN(numB)) {
            return newOrder === "ASC" ? numA - numB : numB - numA;
          } else {
            return newOrder === "ASC"
              ? aVal.localeCompare(bVal)
              : bVal.localeCompare(aVal);
          }
        });
    
        setTableData(sortedData);
    
        setColumnSortOrders((prev) => ({
          ...Object.keys(prev).reduce((acc, key) => {
            acc[key] = key === col ? newOrder : null;
            return acc;
          }, {}),
        }));
      };
    
      const resetSorting = () => {
        setColumnSortOrders({
          Qnty: null,
        
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
                    <NavComponent textdata="Installment Month Wise Report" />

                    {/* ------------ 1st Row: Rep Date + Type ------------ */}
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
          padding: "0px 21px",
          justifyContent: "space-between",
        }}
      >
        <div className="d-flex align-items-center">
                                        <div
                                            style={{
                                                width: "85px",
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

        {/* Type */}
        <div className="d-flex align-items-center">
          <div
            style={{
              width: "80px",
              display: "flex",
              justifyContent: "flex-end",
            }}
          >
            <label htmlFor="transactionType1">
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

          <div
            style={{
              position: "relative",
              display: "inline-block",
              marginLeft: "5px",
            }}
          >
            <select
              ref={input1Ref}
              onKeyDown={(e) => handleKeyPress(e, CustRef)}
              id="transactionType1"
              name="type"
              onFocus={(e) => (e.currentTarget.style.border = "4px solid red")}
              onBlur={(e) =>
                (e.currentTarget.style.border = `1px solid ${fontcolor}`)
              }
              value={transectionType}
              onChange={handleTransactionTypeChange}
              style={{
                width: "200px",
                height: "24px",
                backgroundColor: getcolor,
                border: `1px solid ${fontcolor}`,
                fontSize: getdatafontsize,
                fontFamily: getfontstyle,
                color: fontcolor,
                paddingRight: "25px",
              }}
            >
               <option value="">All</option>
              <option value="M1">1 Month</option>
              <option value="M2">2 Month</option>
              <option value="M3">3 Month</option>
              <option value="M4">3+ Month</option>
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
      </div>
    </div>

    {/* ------------ 2nd Row: Collector + CustTyp ------------ */}
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
          padding: "0px 21px",
          justifyContent: "space-between",
        }}
      >
        {/* Collector */}
        <div className="d-flex align-items-center">
          <div
            style={{
              width: "80px",
              display: "flex",
              justifyContent: "flex-end",
            }}
          >
            <label htmlFor="selectedsale">
              <span
                style={{
                  fontSize: getdatafontsize,
                  fontFamily: getfontstyle,
                  fontWeight: "bold",
                }}
              >
                Collector :
              </span>
            </label>
          </div>

          <div style={{ marginLeft: "5px" }}>
                                            <Select
                                                className="List-select-class"
                                                ref={saleSelectRef}
                                                options={Collectoroption}
                                                onKeyDown={(e) => handlecompanyKeypress(e, input1Ref)}
                                                id="selectedsale"
                                                onChange={(selectedOption) => {
                                                    if (selectedOption && selectedOption.value) {
                                                        const labelPart = selectedOption.label.split("-")[1];
                                                        setCompanyselectdata(selectedOption.value);
                                                        setCompanyselectdatavalue({
                                                            value: selectedOption.value,
                                                            label: labelPart,
                                                        });
                                                    } else {
                                                        setCompanyselectdata("");
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
                                                    ...customStyles1(!Companyselectdata),
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
                                            />
                                        </div>
        </div>

        {/* CustTyp */}
        <div className="d-flex align-items-center">
          <div
            style={{
              width: "80px",
              display: "flex",
              justifyContent: "flex-end",
            }}
          >
            <label htmlFor="transactionType2">
              <span
                style={{
                  fontSize: getdatafontsize,
                  fontFamily: getfontstyle,
                  fontWeight: "bold",
                }}
              >
                CustTyp :
              </span>
            </label>
          </div>

          <div
            style={{
              position: "relative",
              display: "inline-block",
              marginLeft: "5px",
            }}
          >
            <select
              ref={CustRef}
              onKeyDown={(e) => handleKeyPress(e, input5Ref)}
              id="transactionType2"
              name="type"
              onFocus={(e) => (e.currentTarget.style.border = "4px solid red")}
              onBlur={(e) =>
                (e.currentTarget.style.border = `1px solid ${fontcolor}`)
              }
              value={transectionType2}
              onChange={handleTransactionTypeChange2}
              style={{
                width: "200px",
                height: "24px",
                backgroundColor: getcolor,
                border: `1px solid ${fontcolor}`,
                fontSize: getdatafontsize,
                fontFamily: getfontstyle,
                color: fontcolor,
                paddingRight: "25px",
              }}
            >
                         <option value="">All</option>

              <option value="001">Daily</option>
              <option value="002">Monthly</option>
              <option value="003">Weekly </option>
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
      </div>
    </div>

    {/* ------------ 3rd Row: Search ------------ */}
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
          padding: "0px 21px",
          justifyContent: "flex-end",
        }}
      >
        <div id="lastDiv" style={{ display: "flex", alignItems: "center" }}>
          <label
            htmlFor="searchInput"
            style={{ marginRight: "5px" }}
          >
            <span
              style={{
                fontSize: getdatafontsize,
                fontFamily: getfontstyle,
                fontWeight: "bold",
              }}
            >
              Search :
            </span>
          </label>
          <div style={{ position: "relative", display: "inline-block" }}>
            <input
              ref={input5Ref}
              onKeyDown={(e) => handleKeyPress(e, selectButtonRef)}
              type="text"
              id="searchInput"
              placeholder="Search"
              value={searchQuery}
              autoComplete="off"
              style={{
                width: "200px",
                height: "24px",
                fontSize: getdatafontsize,
                fontFamily: getfontstyle,
                color: fontcolor,
                backgroundColor: getcolor,
                border: `1px solid ${fontcolor}`,
                outline: "none",
                paddingLeft: "10px",
                paddingRight: "25px",
              }}
              onFocus={(e) => (e.currentTarget.style.border = "2px solid red")}
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
                  right: "8px",
                  top: "50%",
                  transform: "translateY(-50%)",
                  cursor: "pointer",
                  fontSize: "16px",
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
                                    fontSize: getdatafontsize, fontFamily: getfontstyle, width: "100%",
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
                                            code
                                        </td>
                                        <td className="border-dark" style={secondColWidth}>
                                            Customer
                                        </td>
                                        <td className="border-dark" style={thirdColWidth}>
                                            Sale Date
                                        </td>
                                        <td className="border-dark" style={forthColWidth}>
                                            Sale
                                        </td>
                                        <td className="border-dark" style={fifthColWidth}>
                                            Advance
                                        </td>
                                         <td
                      className="border-dark"
                      style={sixthColWidth}
                      // onClick={() => handleSorting("Qnty")}
                    >
                      Collection{" "}
                      {/* <i
                        className="fa-solid fa-caret-down caretIconStyle"
                        style={getIconStyle("Qnty")}
                      ></i> */}
                    </td>
                                        <td className="border-dark" style={seventhColWidth}>
                                            Disc
                                        </td>
                                        <td className="border-dark" style={eighthColWidth}>
                                            Balance
                                        </td>
                                        {/* <td className="border-dark" style={ninthColWidth}>
                                            Recei                                        </td> */}
                                        <td className="border-dark" style={tenthColWidth}>
                                            InsAmt
                                        </td>
<td className="border-dark" style={tenthColWidth1}>
                                            LastDate
                                        </td>
                                      
                                     
                                       
                                         <td className="border-dark" style={tenthColWidth5}>
                                            Diff
                                        </td>

                                        <td className="border-dark" style={LastColWidth}>
                                            
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
                                maxHeight: "45vh",
                                wordBreak: "break-word",
                            }}
                        >
                            <table
                                className="myTable"
                                id="tableBody"
                                style={{
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
                                                <td style={thirdColWidth}></td>
                                                <td style={forthColWidth}></td>
                                                <td style={fifthColWidth}></td>
                                                <td style={sixthColWidth}></td>
                                                <td style={seventhColWidth}></td>
                                                <td style={eighthColWidth}></td>
                                                {/* <td style={ninthColWidth}></td> */}
                                                <td style={tenthColWidth}></td>
                                                 <td style={tenthColWidth1}></td>
                                                <td style={tenthColWidth5}></td>
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
                                                            {item.code}
                                                        </td>
                                                        <td
                    className="text-start"
                    title={item.Customer}
                    style={{
                      ...secondColWidth,
                      whiteSpace: "nowrap",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                    }}
                  >
                    {item.Customer}
                  </td>
                                                        <td className="text-center" style={thirdColWidth}>
                                                            {item["Sale Date"]}
                                                        </td>
                                                        <td className="text-end" style={forthColWidth}>
                                                            {item["Sale"]}
                                                        </td>
                                                        <td className="text-end" style={fifthColWidth}>
                                                            {item["Advance"]}
                                                        </td>
                                                        <td className="text-end" style={sixthColWidth}>
                                                            {item.Collection}
                                                        </td>
                                                        <td className="text-end" style={seventhColWidth}>
                                                            {item["Disc"]}
                                                        </td>
                                                        <td className="text-end" style={eighthColWidth}>
                                                            {item["Balance"]}
                                                        </td>
                                                        {/* <td className="text-end" style={ninthColWidth}>
                                                            {item["Receiavable"]}
                                                        </td> */}
                                                        <td className="text-end" style={tenthColWidth}>
                                                            {item["Ins Amt"]}
                                                        </td>

                                                         <td className="text-center" style={tenthColWidth1}>
                                                            {item["Last Date"]}
                                                        </td>

                                                        
                                                        <td className="text-end" style={tenthColWidth5}>
                                                            {item["MonthDiff"]}
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
                                                <td style={thirdColWidth}></td>
                                                <td style={forthColWidth}></td>
                                                <td style={fifthColWidth}></td>
                                                <td style={sixthColWidth}></td>
                                                <td style={seventhColWidth}></td>
                                                <td style={eighthColWidth}></td>
                                                {/* <td style={ninthColWidth}></td> */}
                                                <td style={tenthColWidth}></td>
                                                <td style={tenthColWidth1}></td>
                                                <td style={tenthColWidth5}></td>
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
                           <span className="mobileledger_total2">{tableData.length.toLocaleString()}</span>
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
                            {/* <span className="mobileledger_total">{totalOpening}</span> */}
                        </div>
                        <div
                            style={{
                                ...forthColWidth,
                                background: getcolor,
                                borderRight: `1px solid ${fontcolor}`,
                            }}
                        >
                            <span className="mobileledger_total">{totalSale}</span>
                        </div>
                        <div
                            style={{
                                ...fifthColWidth,
                                background: getcolor,
                                borderRight: `1px solid ${fontcolor}`,
                            }}
                        >
                            <span className="mobileledger_total">{totalAdvance}</span>
                        </div>
                        <div
                            style={{
                                ...sixthColWidth,
                                background: getcolor,
                                borderRight: `1px solid ${fontcolor}`,
                            }}
                        >
                            <span className="mobileledger_total">{totalCollection}</span>
                        </div>
                        <div
                            style={{
                                ...seventhColWidth,
                                background: getcolor,
                                borderRight: `1px solid ${fontcolor}`,
                            }}
                        >
                            <span className="mobileledger_total">{totalDisc}</span>
                        </div>
                        <div
                            style={{
                                ...eighthColWidth,
                                background: getcolor,
                                borderRight: `1px solid ${fontcolor}`,
                            }}
                        >
                            <span className="mobileledger_total">{totalBalance}</span>
                        </div>
                        {/* <div
                            style={{
                                ...ninthColWidth,
                                background: getcolor,
                                borderRight: `1px solid ${fontcolor}`,
                            }}
                        >
                            <span className="mobileledger_total">{totalSaleRet}</span>
                        </div> */}
                        <div
                            style={{
                                ...tenthColWidth,
                                background: getcolor,
                                borderRight: `1px solid ${fontcolor}`,
                            }}
                        >
                            <span className="mobileledger_total">{totalIns}</span>
                        </div>

                         <div
                            style={{
                                ...tenthColWidth1,
                                background: getcolor,
                                borderRight: `1px solid ${fontcolor}`,
                            }}
                        >
                            {/* <span className="mobileledger_total">{totalincl}</span> */}
                        </div>
                       
                      
                         <div
                            style={{
                                ...tenthColWidth5,
                                background: getcolor,
                                borderRight: `1px solid ${fontcolor}`,
                            }}
                        >
                            {/* <span className="mobileledger_total">{totalIns}</span> */}
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