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


export default function ItemStockReportPos() {
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

    const [saleType, setSaleType] = useState("");


    const [storeList, setStoreList] = useState([]);
    const [storeType, setStoreType] = useState("");

    const input1Ref = useRef(null);
    const input2Ref = useRef(null);
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

    const [totalqnty, settotalqnty] = useState(0);
    const [totalexcel, settotalexcel] = useState(0);
    const [totaltax, settotaltax] = useState(0);
    const [totalincl, settotalincl] = useState(0);


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

        const apiMainUrl = apiLinks + "/ItemStockReportPos.php";
        setIsLoading(true);
        const formMainData = new URLSearchParams({
            FRepDat: toInputDate,
            FItmSts: transectionType,
            FCtgCod: Categoryselectdata,
            FCapCod: Capacityselectdata,
            FSchTxt: searchQuery,
            FCmpCod: Companyselectdata,
            // code: organisation.code,
            // FLocCod: locationnumber || getLocationNumber,
            // FYerDsc: yeardescription || getYearDescription,

            code: 'UMAIRPOS',
            FLocCod: '001',
            FYerDsc: '2021-2025',

        }).toString();

        axios
            .post(apiMainUrl, formMainData)
            .then((response) => {
                setIsLoading(false);
                settotalqnty(response.data["Total Qnty"]);
                settotalexcel(response.data["Total Excl"]);
                settotaltax(response.data["Total Tax"]);
                settotalincl(response.data["Total Incl"]);

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
                        fontSize: getdatafontsize,
                        fontFamily: getfontstyle,
                        paddingBottom: "5px",
                        lineHeight: "3px",
                        color: fontcolor,
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
        const globalfontsize = 12;
        console.log("gobal font data", globalfontsize);

        // Create a new jsPDF instance with landscape orientation
        const doc = new jsPDF({ orientation: "landscape" });

        // Define table data (rows)
        const rows = tableData.map((item) => [
            item.Code,
            item.Description,
            item.PCTCode,
            item['Excl Rate'],
            item.Qnty,
            item.ExclAmount,
            item.TaxRate,
            item.TaxAmt,
            item.InclAmount,
        ]);

        // Add summary row to the table
        rows.push(["", "Total", "", String(totalexcel), String(totalqnty), "", String(totaltax), "", String(totalincl),]);


        // Define table column headers and individual column widths

        const headers = [
            "Code",
            "Description",
            "PTC Code",
            "Ex Rate",
            "Qnty",
            "Ex Amt",
            "Tax Rate",
            "Tax Amt",
            "Inc Amt",
        ];
        const columnWidths = [30, 90, 25, 25, 14, 25, 25, 25, 25];

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
            const rowHeight = 5; // Adjust row height
            const fontSize = 10; // Adjust font size
            const boldFont = 400; // Bold font
            const normalFont = getfontstyle; // Default font
            const tableWidth = getTotalTableWidth(); // Calculate total table width

            doc.setFontSize(fontSize);

            for (let i = startIndex; i < endIndex; i++) {
                const row = rows[i];
                const isTotalRow = i === rows.length - 1; // Check if this is the total row
                let textColor = [0, 0, 0]; // Default text color
                let fontName = normalFont; // Default font
                let currentX = startX; // Track current column position

                // Check if Qnty (column index 6) is negative
                if (parseFloat(row[8]) < 0) {
                    textColor = [255, 0, 0]; // Set red color for negative Qnty
                }

                // For total row, set bold font and prepare for double border
                if (isTotalRow) {
                    doc.setFont(getfontstyle, 'bold');
                }

                // Draw row borders
                doc.setDrawColor(0);

                // For total row, draw double border
                if (isTotalRow) {
                    // First line of the double border
                    doc.setLineWidth(0.3);
                    doc.rect(
                        currentX,
                        startY + (i - startIndex + 2) * rowHeight,
                        tableWidth,
                        rowHeight
                    );

                    // Second line of the double border (slightly offset)
                    doc.setLineWidth(0.3);
                    doc.rect(
                        currentX + 0.5,
                        startY + (i - startIndex + 2) * rowHeight + 0.5,
                        tableWidth - 1,
                        rowHeight - 1
                    );
                } else {
                    // Normal border for other rows
                    doc.setLineWidth(0.2);
                    doc.rect(
                        currentX,
                        startY + (i - startIndex + 2) * rowHeight,
                        tableWidth,
                        rowHeight
                    );
                }

                row.forEach((cell, cellIndex) => {
                    // For total row, adjust vertical position to center in the double border
                    const cellY = isTotalRow
                        ? startY + (i - startIndex + 2) * rowHeight + rowHeight / 2
                        : startY + (i - startIndex + 2) * rowHeight + 3;

                    const cellX = currentX + 2;

                    // Set text color
                    doc.setTextColor(textColor[0], textColor[1], textColor[2]);

                    // For total row, keep bold font
                    if (!isTotalRow) {
                        // Set font
                        doc.setFont(fontName, "normal");
                    }

                    // Ensure the cell value is a string
                    const cellValue = String(cell);

                    if (cellIndex === 3 || cellIndex === 4 || cellIndex === 5 || cellIndex === 6 || cellIndex === 7 || cellIndex === 8) {
                        const rightAlignX = currentX + columnWidths[cellIndex] - 2;
                        doc.text(cellValue, rightAlignX, cellY, {
                            align: "right",
                            baseline: "middle",
                        });
                    } else {
                        // For empty cells in total row, add "Total" label centered
                        if (isTotalRow && cellIndex === 0 && cell === "") {
                            const totalLabelX = currentX + columnWidths[0] / 2;
                            doc.text("", totalLabelX, cellY, {
                                align: "center",
                                baseline: "middle"
                            });
                        } else {
                            doc.text(cellValue, cellX, cellY, {
                                baseline: "middle"
                            });
                        }
                    }

                    // Draw column borders
                    if (isTotalRow) {
                        // Double border for total row columns
                        doc.setLineWidth(0.3);
                        doc.rect(
                            currentX,
                            startY + (i - startIndex + 2) * rowHeight,
                            columnWidths[cellIndex],
                            rowHeight
                        );
                        doc.setLineWidth(0.3);
                        doc.rect(
                            currentX + 0.5,
                            startY + (i - startIndex + 2) * rowHeight + 0.5,
                            columnWidths[cellIndex] - 1,
                            rowHeight - 1
                        );
                    } else {
                        // Normal border for other rows
                        doc.setLineWidth(0.2);
                        doc.rect(
                            currentX,
                            startY + (i - startIndex + 2) * rowHeight,
                            columnWidths[cellIndex],
                            rowHeight
                        );
                    }

                    // Move to next column
                    currentX += columnWidths[cellIndex];
                });

                // Reset font after total row
                if (isTotalRow) {
                    doc.setFont(getfontstyle, "normal");
                }
            }

            // Draw line at the bottom of the page with padding
            const lineWidth = tableWidth;
            const lineX = (doc.internal.pageSize.width - tableWidth) / 2;
            const lineY = pageHeight - 15;
            doc.setLineWidth(0.3);
            doc.line(lineX, lineY, lineX + lineWidth, lineY);
            const headingFontSize = 12;

            // Add heading "Crystal Solution" aligned left bottom of the line
            const headingX = lineX + 2;
            const headingY = lineY + 5;
            doc.setFontSize(headingFontSize);
            doc.setTextColor(0);
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

                addTitle(
                    `Item Stock Report Pos As on ${toInputDate}`,
                    "",
                    "",
                    pageNumber,
                    startY,
                    12
                ); // Render sale report title with decreased font size, provide the time, and page number
                startY += 5;

                const labelsX = (doc.internal.pageSize.width - totalWidth) / 2;
                const labelsY = startY + 4; // Position the labels below the titles and above the table

                // Set font size and weight for the labels
                doc.setFontSize(12);
                doc.setFont(getfontstyle, "300");

                let status =
                    transectionType === "O"
                        ? "OUTSTANDING"
                        : "ALL";


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


                let search = searchQuery ? searchQuery : "";

                // Set font style, size, and family
                doc.setFont(getfontstyle, "300"); // Font family and style ('normal', 'bold', 'italic', etc.)
                doc.setFontSize(10); // Font size

                doc.setFont(getfontstyle, "bold"); // Set font to bold
                doc.text(`COMPANY :`, labelsX, labelsY); // Draw bold label
                doc.setFont(getfontstyle, "normal"); // Reset font to normal
                doc.text(`${typeItem}`, labelsX + 25, labelsY); // Draw the value next to the label

                doc.setFont(getfontstyle, "bold"); // Set font to bold
                doc.text(`CAPACITY :`, labelsX + 180, labelsY); // Draw bold label
                doc.setFont(getfontstyle, "normal"); // Reset font to normal
                doc.text(`${typeText}`, labelsX + 205, labelsY); // Draw the value next to the label

                doc.setFont(getfontstyle, "bold"); // Set font to bold
                doc.text(`CATEGORY :`, labelsX, labelsY + 4.3); // Draw bold label
                doc.setFont(getfontstyle, "normal"); // Reset font to normal
                doc.text(`${category}`, labelsX + 25, labelsY + 4.3); // Draw the value next to the label

                doc.setFont(getfontstyle, "bold"); // Set font to bold
                doc.text(`STATUS :`, labelsX + 180, labelsY + 4.3); // Draw bold label
                doc.setFont(getfontstyle, "normal"); // Reset font to normal
                doc.text(`${status}`, labelsX + 205, labelsY + 4.3); // Draw the value next to the label

                // doc.setFont(getfontstyle, "bold"); // Set font to bold
                // doc.text(`CAPACITY :`, labelsX, labelsY + 8.5); // Draw bold label
                // doc.setFont(getfontstyle, "normal"); // Reset font to normal
                // doc.text(`${typeText}`, labelsX + 25, labelsY + 8.5); // Draw the value next to the label

                if (searchQuery) {
                    doc.setFont(getfontstyle, "bold"); // Set font to bold
                    doc.text(`SEARCH :`, labelsX + 180, labelsY + 8.5); // Draw bold label
                    doc.setFont(getfontstyle, "normal"); // Reset font to normal
                    doc.text(`${search}`, labelsX + 205, labelsY + 8.5); // Draw the value next to the label
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
        doc.save(`ItemStockReportPos As On ${toInputDate}.pdf`);
    };

    const handleDownloadCSV = async () => {
        const workbook = new ExcelJS.Workbook();
        const worksheet = workbook.addWorksheet("Sheet1");

        const numColumns = 6; // Ensure this matches the actual number of columns

        const columnAlignments = ["left", "left", "left", "right", "right", "right", "right", "right", "right"];

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
        const storeListRow = worksheet.addRow([`Item Stock Report Pos As On ${toInputDate}`]);
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
        let status =
            transectionType === "O"
                ? "OUTSTANDING"
                : "ALL";

        let typesearch = searchQuery ? searchQuery : "";

        // Add first row
        const typeAndStoreRow = worksheet.addRow([
            "COMPANY :",
            typecompany,
            "",
            "",
            "",
            "",
            "CAPACITY :",
            typecapacity,
        ]);

        // Add second row
        const typeAndStoreRow2 = worksheet.addRow([
            "CATEGORY :",
            typecategory,
            "",
            "",
            "",
            "",
            "STATUS :",
            status,
        ]);

        // Add third row with conditional rendering for "SEARCH:"
        const typeAndStoreRow3 = worksheet.addRow(
            searchQuery
                ? ["", "", "", "", "", "", "SEARCH :", typesearch]
                : [""]
        );

        // Apply styling for the status row
        typeAndStoreRow.eachCell((cell, colIndex) => {
            cell.font = {
                name: "CustomFont" || "CustomFont",
                size: 10,
                bold: [1, 7].includes(colIndex),
            };
            cell.alignment = { horizontal: "left", vertical: "middle" };
        });
        typeAndStoreRow2.eachCell((cell, colIndex) => {
            cell.font = {
                name: "CustomFont" || "CustomFont",
                size: 10,
                bold: [1, 7].includes(colIndex),
            };
            cell.alignment = { horizontal: "left", vertical: "middle" };
        });
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
            "Code",
            "Description",
            "PTC Code",
            "Ex Rate",
            "Qnty",
            "Ex Amt",
            "Tax Rate",
            "Tax Amt",
            "Inc Amt",
        ];
        const headerRow = worksheet.addRow(headers);
        headerRow.eachCell((cell) => Object.assign(cell, headerStyle));

        // Add data rows
        tableData.forEach((item) => {
            const row = worksheet.addRow([
                item.Code,
                item.Description,
                item.PCTCode,
                item['Excl Rate'],
                item.Qnty,
                item.ExclAmount,
                item.TaxRate,
                item.TaxAmt,
                item.InclAmount,
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
        [17, 50, 15, 15, 8, 15, 15, 15, 15].forEach((width, index) => {
            worksheet.getColumn(index + 1).width = width;
        });

        const totalRow = worksheet.addRow([
            "", "Total", "", String(totalexcel), String(totalqnty), "", String(totaltax), "", String(totalincl),

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
            if (colNumber === 4 || colNumber === 5 || colNumber === 7 || colNumber === 9) {
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
        saveAs(blob, `ItemStockReportPos As On ${currentdate}.xlsx`);
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



    const firstColWidth = {
        width: "10%",
    };
    const secondColWidth = {
        width: "30.6%",
    };
    const thirdColWidth = {
        width: "9%",
    };
    const forthColWidth = {
        width: "9%",
    };
    const fifthColWidth = {
        width: "9%",
    };
    const sixthColWidth = {
        width: "5%",
    };
    const seventhColWidth = {
        width: "9%",
    };
    const eighthColWidth = {
        width: "9%",
    };
    const ninthColWidth = {
        width: "9%",
    };
    const tenthColWidth = {
        width: "9%",
    };

    useHotkeys("s", fetchDailyStatusReport);
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
        position: "absolute",
        top: "53%",
        left: isSidebarVisible ? "60%" : "50%",
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
                        width: "100%",
                        border: `1px solid ${fontcolor}`,
                        borderRadius: "9px",
                    }}
                >
                    <NavComponent textdata="Item Stock Report Pos" />

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
                                            Capacity :
                                        </span>
                                    </label>
                                </div>

                                <div style={{ marginLeft: "3px" }}>
                                    <Select
                                        className="List-select-class "
                                        ref={input2Ref}
                                        options={capacityoptions}
                                        onKeyDown={(e) => handlecapacityKeypress(e, input4Ref)}
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
                                justifyContent: "space-between",
                            }}
                        >
                            <div
                                className="d-flex align-items-center"
                                style={{ marginLeft: "7px" }}
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
                                        className="List-select-class"
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
                                        paddingLeft: "12px",
                                    }}
                                >
                                    <option value="">ALL</option>
                                    <option value="O">OUTSTANDING</option>
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
                                justifyContent: "space-between",
                            }}
                        >
                            <div
                                className="d-flex align-items-center"
                                style={{ marginLeft: "7px" }}
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
                                        onKeyDown={(e) => handlecategoryKeypress(e, input2Ref)}
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
                                        }} isClearable
                                        placeholder="ALL"
                                    />
                                </div>
                            </div>

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
                                <div style={{ position: "relative", display: "inline-block" }}>
                                    <input
                                        ref={input5Ref}
                                        onKeyDown={(e) => handleKeyPress(e, selectButtonRef)}
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
                                width: "98.8%",
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
                                            Code
                                        </td>
                                        <td className="border-dark" style={secondColWidth}>
                                            Description
                                        </td>
                                        <td className="border-dark" style={thirdColWidth}>
                                            PCT Code
                                        </td>
                                        <td className="border-dark" style={forthColWidth}>
                                            Ex Rate
                                        </td>
                                        {/* <td className="border-dark" style={fifthColWidth}>
                                            Pur Ret
                                        </td> */}
                                        <td className="border-dark" style={sixthColWidth}>
                                            Qnty
                                        </td>
                                        <td className="border-dark" style={seventhColWidth}>
                                            Ex Amt
                                        </td>
                                        <td className="border-dark" style={eighthColWidth}>
                                            Tax Rate
                                        </td>
                                        <td className="border-dark" style={ninthColWidth}>
                                            Tax Amt
                                        </td>
                                        <td className="border-dark" style={tenthColWidth}>
                                            Inc Amt
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
                                maxHeight: "50vh",
                                width: "100%",
                                wordBreak: "break-word",
                            }}
                        >
                            <table
                                className="myTable"
                                id="tableBody"
                                style={{
                                    fontSize: getdatafontsize, fontFamily: getfontstyle, width: "100%",
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
                                                <td style={thirdColWidth}></td>
                                                <td style={forthColWidth}></td>
                                                {/* <td style={fifthColWidth}></td> */}
                                                <td style={sixthColWidth}></td>
                                                <td style={seventhColWidth}></td>
                                                <td style={eighthColWidth}></td>
                                                <td style={ninthColWidth}></td>
                                                <td style={tenthColWidth}></td>
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
                                                        <td className="text-start" style={secondColWidth}>
                                                            {item.Description}
                                                        </td>
                                                        <td className="text-start" style={thirdColWidth}>
                                                            {item.PCTCode}
                                                        </td>
                                                        <td className="text-end" style={forthColWidth}>
                                                            {item["Excl Rate"]}
                                                        </td>
                                                        {/* <td className="text-end" style={fifthColWidth}>
                                                            {item["Pur Ret"]}
                                                        </td> */}
                                                        <td className="text-end" style={sixthColWidth}>
                                                            {item.Qnty}
                                                        </td>
                                                        <td className="text-end" style={seventhColWidth}>
                                                            {item["ExclAmount"]}
                                                        </td>
                                                        <td className="text-end" style={eighthColWidth}>
                                                            {item["TaxRate"]}
                                                        </td>
                                                        <td className="text-end" style={ninthColWidth}>
                                                            {item["TaxAmt"]}
                                                        </td>
                                                        <td className="text-end" style={tenthColWidth}>
                                                            {item["InclAmount"]}
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
                                                <td style={thirdColWidth}></td>
                                                <td style={forthColWidth}></td>
                                                {/* <td style={fifthColWidth}></td> */}
                                                <td style={sixthColWidth}></td>
                                                <td style={seventhColWidth}></td>
                                                <td style={eighthColWidth}></td>
                                                <td style={ninthColWidth}></td>
                                                <td style={tenthColWidth}></td>
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
                            paddingRight: "10px"
                        }}
                    >
                        <div
                            style={{
                                ...firstColWidth,
                                background: getcolor,
                                marginLeft: "2px",
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
                            <span className="mobileledger_total">{totalexcel}</span>
                        </div>
                        {/* <div
                            style={{
                                ...fifthColWidth,
                                background: getcolor,
                                borderRight: `1px solid ${fontcolor}`,
                            }}
                        >
                            <span className="mobileledger_total">{totalPurRet}</span>
                        </div> */}
                        <div
                            style={{
                                ...sixthColWidth,
                                background: getcolor,
                                borderRight: `1px solid ${fontcolor}`,
                            }}
                        >
                            <span className="mobileledger_total">{totalqnty}</span>
                        </div>
                        <div
                            style={{
                                ...seventhColWidth,
                                background: getcolor,
                                borderRight: `1px solid ${fontcolor}`,
                            }}
                        >
                            {/* <span className="mobileledger_total">{totalIssue}</span> */}
                        </div>
                        <div
                            style={{
                                ...eighthColWidth,
                                background: getcolor,
                                borderRight: `1px solid ${fontcolor}`,
                            }}
                        >
                            <span className="mobileledger_total">{totaltax}</span>
                        </div>
                        <div
                            style={{
                                ...ninthColWidth,
                                background: getcolor,
                                borderRight: `1px solid ${fontcolor}`,
                            }}
                        >
                            {/* <span className="mobileledger_total">{totalSaleRet}</span> */}
                        </div>
                        <div
                            style={{
                                ...tenthColWidth,
                                background: getcolor,
                                borderRight: `1px solid ${fontcolor}`,
                            }}
                        >
                            <span className="mobileledger_total">{totalincl}</span>
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
                            style={{ backgroundColor: "#186DB7", width: "120px" }}
                            onFocus={(e) => (e.currentTarget.style.border = "2px solid red")}
                            onBlur={(e) =>
                                (e.currentTarget.style.border = `1px solid ${fontcolor}`)
                            }
                        />
                        <SingleButton
                            text="PDF"
                            onClick={exportPDFHandler}
                            style={{ backgroundColor: "#186DB7", width: "120px" }}
                            onFocus={(e) => (e.currentTarget.style.border = "2px solid red")}
                            onBlur={(e) =>
                                (e.currentTarget.style.border = `1px solid ${fontcolor}`)
                            }
                        />
                        <SingleButton
                            text="Excel"
                            onClick={handleDownloadCSV}
                            style={{ backgroundColor: "#186DB7", width: "120px" }}
                            onFocus={(e) => (e.currentTarget.style.border = "2px solid red")}
                            onBlur={(e) =>
                                (e.currentTarget.style.border = `1px solid ${fontcolor}`)
                            }
                        />
                        <SingleButton
                            id="searchsubmit"
                            text="Select"
                            ref={selectButtonRef}
                            onClick={fetchDailyStatusReport}
                            style={{ backgroundColor: "#186DB7", width: "120px" }}
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