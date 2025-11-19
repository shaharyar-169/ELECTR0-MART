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
// import { fetchGetUser } from "../../Redux/action";
import { fetchGetUser } from "../../../Redux/action";
import { useHotkeys } from "react-hotkeys-hook";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function DailyJobReport() {
    const navigate = useNavigate();
    const user = getUserData();
    const organisation = getOrganisationData();

    const saleSelectRef = useRef(null);
    const Referenceref = useRef(null);
    const CompanySelectRef = useRef(null);
    const CategorySelectRef= useRef(null);

    const input1Ref = useRef(null);
    const input1Reftype = useRef(null);
    const input2Ref = useRef(null);
    const input3Ref = useRef(null);

    const toRef = useRef(null);
    const fromRef = useRef(null);

    const [saleType, setSaleType] = useState("");
    const [ReferenceCode, setReferenceCode] = useState("");

    const [Companyselectdata, setCompanyselectdata] = useState("");

    console.log("Companyselectdata", Companyselectdata);
    const [Companyselectdatavalue, setCompanyselectdatavalue] = useState("");
    console.log("Companyselectdatavalue", Companyselectdatavalue.label);
    const [GetCompany, setGetCompany] = useState([]);

    const [searchQuery, setSearchQuery] = useState("");
    const [transectionType, settransectionType] = useState("");
    const [transectionType2, settransectionType2] = useState("");

    const [supplierList, setSupplierList] = useState([]);
    const [Referenceapidata, setReferenceapidata] = useState([]);

    const [Technicianselectdatavalue, setTechnicianselectdatavalue] = useState("");
    const [referenceselectdatavalue, setreferenceselectdatavalue] = useState("");

    const [Categoryselectdata, setCategoryselectdata] = useState("");
    const [categoryselectdatavalue, setcategoryselectdatavalue] = useState("");

    const [GetCategory, setGetCategory] = useState([]);


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

    const handleReferenceKeypress = (event, inputId) => {
        if (event.key === "Enter") {
            const selectedOption = Referenceref.current.state.selectValue;
            if (selectedOption && selectedOption.value) {
                setSaleType(selectedOption.value);
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

    const handlecompanyKeypress = (event, inputId) => {
        if (event.key === "Enter") {
            const selectedOption = CompanySelectRef.current.state.selectValue;
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
            const selectedOption = CategorySelectRef.current.state.selectValue;
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

        const apiUrl = apiLinks + "/DailyJobReport.php";
        setIsLoading(true);
        const formData = new URLSearchParams({

            FIntDat: fromInputDate,
            FFnlDat: toInputDate,
            FTchCod: saleType,
            FRefCod: ReferenceCode,
            FCtgCod: categoryselectdatavalue,
            FCmpCod: Companyselectdatavalue,
            FJobSts: transectionType,
            FJobTyp: transectionType2,
            FSchTxt: searchQuery,
            code: organisation.code,
            FLocCod: locationnumber || getLocationNumber,
            FYerDsc: yeardescription || getyeardescription,

        }).toString();

        axios
            .post(apiUrl, formData)
            .then((response) => {
                setIsLoading(false);

                setTotalDebit(response.data["Total "]);



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
        const apiUrl = apiLinks + "/GetActiveTechnician.php";
        const formData = new URLSearchParams({
            FLocCod: locationnumber || getLocationNumber,
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

    const options = supplierList.map((item) => ({
        value: item.ttchcod,
        label: `${item.ttchcod}-${item.ttchdsc.trim()}`,
    }));

    /////////////// api for Reference code ////////////////////

    useEffect(() => {
        const apiUrl = apiLinks + "/GetActiveReference.php";
        const formData = new URLSearchParams({
            FLocCod: locationnumber || getLocationNumber,
            code: organisation.code,
        }).toString();
        axios
            .post(apiUrl, formData)
            .then((response) => {
                setReferenceapidata(response.data);
            })
            .catch((error) => {
                console.error("Error fetching data:", error);
            });
    }, []);

    const refoptions = Referenceapidata.map((item) => ({
        value: item.trefcod,
        label: `${item.trefcod}-${item.trefdsc.trim()}`,
    }));


    useEffect(() => {
        const apiUrl = apiLinks + "/GetCompany.php";
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
    const comptions = GetCompany.map((item) => ({
        value: item.tcmpcod,
        label: `${item.tcmpcod}-${item.tcmpdsc.trim()}`,
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

    /////////////////////////////////////////////////////////

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

        const globalfontsize = 12;
        console.log('gobal font data', globalfontsize)

        // Create a new jsPDF instance with landscape orientation
        const doc = new jsPDF({ orientation: "landscape" });

        // Define table data (rows)
        const rows = tableData.map((item) => [
            item.Date,
            item["Job#"],
            item.Customer,
            item.Mobile,
            item.Company,
            item.Item,
            item.Technician,
            item.Type,
            item.Status,
            item.Day
        ]);

        // Add summary row to the table

        rows.push([
            String(totalDebit),
            "",
            "",
            "",
            "",
            "",
            "",
            "",
            "",
            "",

        ]);

        // Define table column headers and individual column widths
        const headers = [
            "Date",
            "job#",
            "Customer",
            "Mobile",
            "Company",
            "Item",
            "Technician",
            "Type",
            "Status",
            "Day"
        ];
        const columnWidths = [19, 14, 40, 23,40, 40, 40, 29, 27, 15];

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

                    if (cellIndex === 7 ) {
                        const rightAlignX = startX + columnWidths[cellIndex] / 2; // Adjust for right alignment
                        doc.text(cellValue, rightAlignX, cellY, {
                            align: "center",
                            baseline: "middle",
                        });
                    } else if (cellIndex === 8) {
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

                addTitle(`Daily Job Report From: ${fromInputDate} To: ${toInputDate}`, "", "", pageNumber, startY, 12); // Render sale report title with decreased font size, provide the time, and page number
                startY += -5;

                const labelsX = (doc.internal.pageSize.width - totalWidth) / 2;
                const labelsY = startY + 4; // Position the labels below the titles and above the table

                // Set font size and weight for the labels
                doc.setFontSize(12);
                doc.setFont(getfontstyle, "300");


                let status = transectionType === "N"
                    ? "UnAssign"
                    : transectionType === "P"
                        ? "Pending "
                        : transectionType === "W"
                            ? "Workshop"
                            : transectionType === "R"
                                ? "Spare Parts"
                                : transectionType === "D"
                                    ? "Done "
                                    : transectionType === "S"
                                        ? "Closed"
                                        : transectionType === "C"
                                            ? "Cancel"
                                            : "ALL"


                let type = transectionType2 === "REPAIRING"
                    ? "Repairing"
                    : transectionType2 === "INSTALLATION"
                        ? "Installation"
                        : transectionType2 === "SERVICE"
                            ? "Services"
                            : transectionType2 === "WORKSHO"
                                ? "Workshop"
                                : "ALL"


                let search = Technicianselectdatavalue.label
                    ? Technicianselectdatavalue.label
                    : "ALL";

                let Referencecodelable = referenceselectdatavalue.label
                    ? referenceselectdatavalue.label
                    : "ALL";

                    
                let companycodelable =  Companyselectdatavalue.label
                ?  Companyselectdatavalue.label
                : "ALL";

                let categorycodelable =  categoryselectdatavalue.label
                ?  categoryselectdatavalue.label
                : "ALL";



                let search1 = searchQuery ? searchQuery : "";

                // Set font style, size, and family
                doc.setFont(getfontstyle, "300"); // Font family and style ('normal', 'bold', 'italic', etc.)
                doc.setFontSize(10); // Font size


                doc.setFont(getfontstyle, 'bold'); // Set font to bold
                doc.text(`TECNICIAN :`, labelsX, labelsY + 8.5); // Draw bold label
                doc.setFont(getfontstyle, 'normal'); // Reset font to normal
                doc.text(`${search}`, labelsX + 25, labelsY + 8.5); // Draw the value next to the label


                doc.setFont(getfontstyle, 'bold'); // Set font to bold
                doc.text(`CATEGORY :`, labelsX + 200, labelsY + 8.5); // Draw bold label
                doc.setFont(getfontstyle, 'normal'); // Reset font to normal
                doc.text(`${categorycodelable}`, labelsX + 225, labelsY + 8.5); // Draw the value next to the label



                doc.setFont(getfontstyle, 'bold'); // Set font to bold
                doc.text(`REFERENCE :`, labelsX, labelsY + 14); // Draw bold label
                doc.setFont(getfontstyle, 'normal'); // Reset font to normal
                doc.text(`${Referencecodelable}`, labelsX + 25, labelsY + 14); // Draw the value next to the label


                doc.setFont(getfontstyle, 'bold'); // Set font to bold
                doc.text(`STATUS :`, labelsX + 200, labelsY + 14); // Draw bold label
                doc.setFont(getfontstyle, 'normal'); // Reset font to normal
                doc.text(`${status}`, labelsX + 220, labelsY + 14); // Draw the value next to the label


                doc.setFont(getfontstyle, 'bold'); // Set font to bold
                doc.text(`COMPANY :`, labelsX, labelsY + 19.5); // Draw bold label
                doc.setFont(getfontstyle, 'normal'); // Reset font to normal
                doc.text(`${companycodelable}`, labelsX + 25, labelsY + 19.5); // Draw the value next to the label


                doc.setFont(getfontstyle, 'bold'); // Set font to bold
                doc.text(`TYPE :`, labelsX + 200, labelsY + 19.5); // Draw bold label
                doc.setFont(getfontstyle, 'normal'); // Reset font to normal
                doc.text(`${type}`, labelsX + 215, labelsY + 19.5); // Draw the value next to the label



                if (searchQuery) {
                    doc.setFont(getfontstyle, 'bold'); // Set font to bold
                    doc.text(`SEARCH :`, labelsX + 200, labelsY + 24.5); // Draw bold label
                    doc.setFont(getfontstyle, 'normal'); // Reset font to normal
                    doc.text(`${search1}`, labelsX + 220, labelsY + 24.5); // Draw the value next to the label

                }

                // // Reset font weight to normal if necessary for subsequent text
                doc.setFont(getfontstyle, 'bold'); // Set font to bold
                doc.setFontSize(10);

                startY += 26; // Adjust vertical position for the labels

                addTableHeaders((doc.internal.pageSize.width - totalWidth) / 2, 45);
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
        doc.save(`DailyJobReport Form ${fromInputDate} To ${toInputDate}.pdf`);


    };
    ///////////////////////////// DOWNLOAD PDF CODE ////////////////////////////////////////////////////////////


    ///////////////////////////// DOWNLOAD PDF EXCEL //////////////////////////////////////////////////////////
    const handleDownloadCSV = async () => {
        const workbook = new ExcelJS.Workbook();
        const worksheet = workbook.addWorksheet("Sheet1");

        const numColumns = 11; // Ensure this matches the actual number of columns

        const columnAlignments = [
            "left",
            "left",
            "left",
            "left",
            "left",
            "left",
            "left",
            "left",
            "center",
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
        const storeListRow = worksheet.addRow([`Daily Job Report From ${fromInputDate} To ${toInputDate}`]);
        storeListRow.eachCell((cell) => {
            cell.font = fontStoreList;
            cell.alignment = { horizontal: "center" };
        });

        worksheet.mergeCells(`A${storeListRow.number}:${String.fromCharCode(65 + numColumns - 1)}${storeListRow.number}`);

        // Add an empty row after the title section
        worksheet.addRow([]);

        let typereferencecode = referenceselectdatavalue.label
            ? referenceselectdatavalue.label
            : "ALL";

        let technicianvalue = Technicianselectdatavalue.label
            ? Technicianselectdatavalue.label
            : "ALL";

            let categoryvalue = categoryselectdatavalue.label
            ? categoryselectdatavalue.label
            : "ALL";

            let companyvalue = Companyselectdatavalue.label
            ? Companyselectdatavalue.label
            : "ALL";

        let status = transectionType === "N"
            ? "UnAssign"
            : transectionType === "P"
                ? "Pending "
                : transectionType === "W"
                    ? "Workshop"
                    : transectionType === "R"
                        ? "Spare Parts"
                        : transectionType === "D"
                            ? "Done "
                            : transectionType === "S"
                                ? "Closed"
                                : transectionType === "C"
                                    ? "Cancel"
                                    : "ALL"


        let type = transectionType2 === "REPAIRING"
            ? "Repairing"
            : transectionType2 === "INSTALLATION"
                ? "Installation"
                : transectionType2 === "SERVICE"
                    ? "Services"
                    : transectionType2 === "WORKSHO"
                        ? "Workshop"
                        : "ALL"



        // Add first row
        const typeAndStoreRow = worksheet.addRow([
            "TECHNICIAN :",
            technicianvalue,
            "",
            "",
            "",
            "",
            "CATEGORY :",
            categoryvalue
        ]);

        const typeAndStoreRow4 = worksheet.addRow([
            "REFERENCE :",
            typereferencecode,
            "",
            "",
            "",
            "",
            "STATUS :",
            status
        ]);

        const typeAndStoreRow5 = worksheet.addRow([
            "COMPANY :",
            companyvalue,
            "",
            "",
            "",
            "",
            "TYPE :",
            type
        ]);

        let typesearch = searchQuery || "";

        const typeAndStoreRow3 = worksheet.addRow(
            searchQuery
                ? ["", "", "", "", "", "", "SEARCH :", typesearch]
                : [""]);



        // Apply styling for the status row
        typeAndStoreRow.eachCell((cell, colIndex) => {
            cell.font = { name: 'CustomFont' || "CustomFont", size: 10, bold: [1, 7].includes(colIndex) };
            cell.alignment = { horizontal: "left", vertical: "middle" };
        });

        typeAndStoreRow4.eachCell((cell, colIndex) => {
            cell.font = { name: 'CustomFont' || "CustomFont", size: 10, bold: [1, 7].includes(colIndex) };
            cell.alignment = { horizontal: "left", vertical: "middle" };
        });

        typeAndStoreRow5.eachCell((cell, colIndex) => {
            cell.font = { name: 'CustomFont' || "CustomFont", size: 10, bold: [1, 7].includes(colIndex) };
            cell.alignment = { horizontal: "left", vertical: "middle" };
        });

        typeAndStoreRow3.eachCell((cell, colIndex) => {
            cell.font = { name: 'CustomFont' || "CustomFont", size: 10, bold: [1, 7].includes(colIndex) };
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
            "Date",
            "job#",
            "Customer",
            "Mobile",
            "Company",
            "Item",
            "Technician",
            "Type",
            "Status",
            "Day"
        ];
        const headerRow = worksheet.addRow(headers);
        headerRow.eachCell((cell) => Object.assign(cell, headerStyle));

        // Add data rows
        tableData.forEach((item) => {
            const row = worksheet.addRow([
                item.Date,
                item["Job#"],
                item.Customer,
                item.Mobile,
                item.Company,
                item.Item,
                item.Technician,
                item.Type,
                item.Status,
                item.Day
            ]);

            row.eachCell((cell, colIndex) => {
                cell.font = fontTableContent;
                cell.border = { top: { style: "thin" }, left: { style: "thin" }, bottom: { style: "thin" }, right: { style: "thin" } };
                cell.alignment = { horizontal: columnAlignments[colIndex - 1] || "left", vertical: "middle" };
            });
        });

        // Set column widths
        [14, 7, 20, 12,20,20, 20, 15, 13, 13,].forEach((width, index) => {
            worksheet.getColumn(index + 1).width = width;
        });

        const totalRow = worksheet.addRow([
            String(totalDebit),
            "",
            "",
            "",
            "",
            "",
            "",
            "",
            "",
            "",
        ]);

        // total row added

        totalRow.eachCell((cell, colNumber) => {
            cell.font = { name: 'CustomFont', size: 10, bold: true }; // Apply CustomFont
            cell.border = {
                top: { style: "thin" },
                left: { style: "thin" },
                bottom: { style: "thin" },
                right: { style: "thin" },
            };

            // Align only the "Total" text to the right
            if (

                colNumber === 9
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
        const blob = new Blob([buffer], { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" });
        saveAs(blob, `DailyJobReport From ${fromInputDate} To ${toInputDate}.xlsx`);
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
        width: "8%",
    };
    const secondColWidth = {
        width: "6%",
    };
    const thirdColWidth = {
        width: "10%",
    };
    const forthColWidth = {
        width: "9%",
    };
    const fifthColWidth = {
        width: "10%",
    };
    const sixthColWidth = {
        width: "10%",
    };
    const seventhColWidth = {
        width: "10.7%",
    };
    const eighthColWidth = {
        width: "8%",
    };
    const ninhthColWidth = {
        width: "5%",
    };

    const tenthColWidth = {
        width: "10%",
    };

    const companyColWidth={
        width: "12%",
    }


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
        top: "35%",
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
                    <NavComponent textdata="Daily Job Report" />
                    <div className="row"
                        style={{ height: "20px", marginTop: "8px", marginBottom: "8px", }}>

                        <div style={{
                            width: "100%",
                            display: "flex",
                            alignItems: "center",
                            margin: "0px",
                            padding: "0px",
                            justifyContent: "space-between",
                        }}>

                            <div className="d-flex align-items-center" style={{ marginLeft: '19px' }}>
                                <div
                                    style={{
                                        width: "80px",
                                        display: "flex",
                                        justifyContent: "end",

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
                                className="d-flex align-items-center"
                                style={{ marginLeft: "22px" }}
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
                                        onKeyDown={(e) => handleToKeyPress(e, 'firsttype')}
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

                            <div
                                className="d-flex align-items-center"
                                style={{ marginRight: "21px" }}
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
                                            Type :
                                        </span>
                                    </label>
                                </div>



                                <select
                                    ref={input1Reftype}
                                    onKeyDown={(e) => handleKeyPress(e, input1Ref)}
                                    id="firsttype"
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
                                        width: "150px",
                                        height: "24px",
                                        marginLeft: "5px",
                                        backgroundColor: getcolor,
                                        border: `1px solid ${fontcolor}`,
                                        fontFamily: getfontstyle, fontSize: getdatafontsize,
                                        color: fontcolor,
                                    }}
                                >
                                    <option value="">ALL</option>
                                    <option value="REPAIRING">Repairing</option>
                                    <option value="INSTALLATION">Installation</option>
                                    <option value="SERVICE">Services</option>
                                    <option value="WORKSHOP">Workshop</option>


                                </select>
                            </div>

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



                            {/* ------ */}


                            <div className="d-flex align-items-center  " style={{ marginLeft: '18px' }}>
                                <div style={{ width: '90x', display: 'flex', justifyContent: 'end' }}>
                                    <label htmlFor="fromDatePicker"><span style={{ fontFamily: getfontstyle, fontSize: getdatafontsize, fontWeight: 'bold' }}>Technician :</span>  <br /></label>
                                </div>
                                <div style={{ marginLeft: '5px' }} >
                                    <Select
                                        className="List-select-class"
                                        ref={saleSelectRef}
                                        options={options}
                                        onKeyDown={(e) => handleSaleKeypress(e, Referenceref)}
                                        id="selectedsale"
                                        onChange={(selectedOption) => {
                                            if (selectedOption && selectedOption.value) {
                                                const labelPart = selectedOption.label.split("-")[1];
                                                setSaleType(selectedOption.value);
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
                                        ref={CompanySelectRef}
                                        options={comptions}
                                        onKeyDown={(e) => handlecompanyKeypress(e, CategorySelectRef)}
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
                                        width: "60px",
                                        display: "flex",
                                        justifyContent: "end",
                                    }}
                                >
                                    <label htmlFor="transactionType">
                                        <span style={{ fontFamily: getfontstyle, fontSize: getdatafontsize, fontWeight: "bold" }}>
                                            Status :
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
                                        width: "150px",
                                        height: "24px",
                                        marginLeft: "5px",
                                        backgroundColor: getcolor,
                                        border: `1px solid ${fontcolor}`,
                                        fontFamily: getfontstyle, fontSize: getdatafontsize,
                                        color: fontcolor,
                                    }}
                                >
                                    <option value="">ALL</option>
                                    <option value="N">UnAssign</option>
                                    <option value="P">Pending </option>
                                    <option value="W">Workshop</option>
                                    <option value="R">Spare Parts</option>
                                    <option value="D">Done </option>
                                    <option value="S">Closed</option>
                                    <option value="C">Cancel</option>

                                </select>
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
                            <div className="d-flex align-items-center  " style={{ marginLeft: '22.5px' }}>
                                <div style={{ width: '90x', display: 'flex', justifyContent: 'end' }}>
                                    <label htmlFor="fromDatePicker"><span style={{ fontFamily: getfontstyle, fontSize: getdatafontsize, fontWeight: 'bold' }}>Reference :</span>  <br /></label>
                                </div>
                                <div style={{ marginLeft: '5px' }} >
                                    <Select
                                        className="List-select-class"
                                        ref={Referenceref}
                                        options={refoptions}
                                        onKeyDown={(e) => handleReferenceKeypress(e, CompanySelectRef)}
                                        id="referencecodee"
                                        onChange={(selectedOption) => {
                                            if (selectedOption && selectedOption.value) {
                                                const labelPart = selectedOption.label.split("-")[1];
                                                setReferenceCode(selectedOption.value);
                                                setreferenceselectdatavalue({
                                                    value: selectedOption.value,
                                                    label: labelPart, // Set only the 'NGS' part of the label
                                                });
                                            } else {
                                                setReferenceCode(""); // Clear the saleType state when selectedOption is null (i.e., when the selection is cleared)
                                                setreferenceselectdatavalue("");
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
                                style={{ marginRight: "25px" }}
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
                                        ref={CategorySelectRef}
                                        options={categoryoptions}
                                        onKeyDown={(e) => handlecategoryKeypress(e, input1Reftype)}
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


                            <div id="lastDiv" style={{ marginRight: "1px" }}>
                                <label for="searchInput" style={{ marginRight: "5px" }}>
                                    <span style={{ fontFamily: getfontstyle, fontSize: getdatafontsize, fontWeight: "bold" }}>
                                        Search :
                                    </span>{" "}
                                </label>
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
                                        width: "150px",
                                        height: "24px",
                                        fontFamily: getfontstyle,
                                        fontSize: getdatafontsize,
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
                                    } />
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
                                    fontFamily: getfontstyle, fontSize: getdatafontsize,
                                    width: "100%",
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
                                            Job#
                                        </td>
                                        <td className="border-dark" style={thirdColWidth}>
                                            Customer
                                        </td>
                                        <td className="border-dark" style={forthColWidth}>
                                            Mobile
                                        </td>

                                        <td className="border-dark" style={companyColWidth}>
                                            Company
                                        </td>

                                        <td className="border-dark" style={fifthColWidth}>
                                            Item
                                        </td>
                                        <td className="border-dark" style={sixthColWidth}>
                                            Technician
                                        </td>
                                        <td className="border-dark" style={tenthColWidth}>
                                            Reference
                                        </td>
                                        <td className="border-dark" style={seventhColWidth}>
                                            Type
                                        </td>
                                        <td className="border-dark" style={eighthColWidth}>
                                            Status
                                        </td>
                                        <td className="border-dark" style={ninhthColWidth}>
                                            Day
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
                                maxHeight: "45vh",
                                width: "100%",
                                wordBreak: "break-word",
                            }}
                        >
                            <table
                                className="myTable"
                                id="tableBody"
                                style={{
                                    fontFamily: getfontstyle, fontSize: getdatafontsize,
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
                                                <td style={thirdColWidth}></td>
                                                <td style={forthColWidth}></td>
                                                <td style={companyColWidth}></td>
                                                <td style={fifthColWidth}></td>
                                                <td style={sixthColWidth}></td>
                                                <td style={tenthColWidth}></td>
                                                <td style={seventhColWidth}></td>
                                                <td style={eighthColWidth}></td>
                                                <td style={ninhthColWidth}></td>

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
                                                            {item['Job#']}
                                                        </td>
                                                        <td className="text-start"
                                                            title={item.Customer}
                                                            style={{
                                                                ...thirdColWidth,
                                                                whiteSpace: "nowrap",
                                                                overflow: "hidden",
                                                                textOverflow: "ellipsis",
                                                            }}
                                                        >
                                                            {item.Customer}
                                                        </td>
                                                        <td className="text-start" style={forthColWidth}>
                                                            {item.Mobile}
                                                        </td>

                                                        <td className="text-start"
                                                            title={item.Company}
                                                            style={{
                                                                ...companyColWidth,
                                                                whiteSpace: "nowrap",
                                                                overflow: "hidden",
                                                                textOverflow: "ellipsis",
                                                            }}
                                                        >
                                                            {item.Company}
                                                            </td>

                                                        <td className="text-start"
                                                            title={item.Item}
                                                            style={{
                                                                ...fifthColWidth,
                                                                whiteSpace: "nowrap",
                                                                overflow: "hidden",
                                                                textOverflow: "ellipsis",
                                                            }}
                                                        >
                                                            {item.Item}
                                                        </td>
                                                        <td className="text-start"
                                                            title={item.Technician}
                                                            style={{
                                                                ...sixthColWidth,
                                                                whiteSpace: "nowrap",
                                                                overflow: "hidden",
                                                                textOverflow: "ellipsis",
                                                            }}
                                                        >
                                                            {item.Technician}
                                                        </td>
                                                        <td className="text-start"
                                                            title={referenceselectdatavalue?.label}
                                                            style={{
                                                                ...tenthColWidth,
                                                                whiteSpace: "nowrap",
                                                                overflow: "hidden",
                                                                textOverflow: "ellipsis",
                                                            }}
                                                        >
                                                            {referenceselectdatavalue?.label}
                                                        </td>
                                                        <td className="text-start"
                                                            title={item.Type}
                                                            style={{
                                                                ...seventhColWidth,
                                                                whiteSpace: "nowrap",
                                                                overflow: "hidden",
                                                                textOverflow: "ellipsis",
                                                            }}
                                                        >
                                                            {item.Type}
                                                        </td>
                                                        <td className="text-center"
                                                            title={item.Status}
                                                            style={{
                                                                ...eighthColWidth,
                                                                whiteSpace: "nowrap",
                                                                overflow: "hidden",
                                                                textOverflow: "ellipsis",
                                                            }}
                                                        >
                                                            {item.Status}
                                                        </td>
                                                        <td className="text-end" style={ninhthColWidth}>
                                                            {item.Day}
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
                                                <td style={companyColWidth}></td>
                                                <td style={fifthColWidth}></td>
                                                <td style={sixthColWidth}></td>
                                                <td style={tenthColWidth}></td>
                                                <td style={seventhColWidth}></td>
                                                <td style={eighthColWidth}></td>
                                                <td style={ninhthColWidth}></td>


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
                            width: '101.2%'
                        }}
                    >
                        <div
                            style={{
                                ...firstColWidth,
                                background: getcolor,
                                borderRight: `1px solid ${fontcolor}`,
                            }}
                        >
                            <span className="mobileledger_total1" style={{ textAlign: 'left' }}>{totalDebit}</span>

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
                                ...companyColWidth,
                                background: getcolor,
                                borderRight: `1px solid ${fontcolor}`,
                            }}
                        >
                        </div>
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
                                ...tenthColWidth,
                                background: getcolor,
                                borderRight: `1px solid ${fontcolor}`,
                            }}
                        >
                        </div>
                        <div
                            style={{
                                ...seventhColWidth,
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

                        </div>
                        <div
                            style={{
                                ...ninhthColWidth,
                                background: getcolor,
                                borderRight: `1px solid ${fontcolor}`,
                            }}
                        >

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
                            ref={input3Ref}
                            onClick={fetchReceivableReport}
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
