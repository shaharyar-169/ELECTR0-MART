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

export default function ItemLedgerReport() {
    const navigate = useNavigate();
    const user = getUserData();
    const organisation = getOrganisationData();

    const saleSelectRef = useRef(null);
    const saleSelectRef1 = useRef(null);
    const input1Ref = useRef(null);
    const input2Ref = useRef(null);
    const input3Ref = useRef(null);

    const toRef = useRef(null);
    const fromRef = useRef(null);

    const [saleType, setSaleType] = useState("");
    const [saleType1, setSaleType1] = useState("");
    console.log("saleTypedataset", saleType);
    const [Companyselectdatavalue, setCompanyselectdatavalue] = useState("");
    const [Storeselectdatavalue, setStoreselectdatavalue] = useState("");

    const [searchQuery, setSearchQuery] = useState("");
    const [transectionType, settransectionType] = useState("");
    const [supplierList, setSupplierList] = useState([]);
    const [storeList, setstoreList] = useState([]);
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
    // const [selectedfromDate, setSelectedfromDate] = useState(null);
    // const [fromInputDate, setfromInputDate] = useState();
    const [fromCalendarOpen, setfromCalendarOpen] = useState(false);
    // // state for To DatePicker
    // const [selectedToDate, setSelectedToDate] = useState(null);
    // const [toInputDate, settoInputDate] = useState("");
    const [toCalendarOpen, settoCalendarOpen] = useState(false);

    const storedData = JSON.parse(sessionStorage.getItem("itemLedgerData")) || {};

    // Helper function to parse "dd-mm-yyyy" format to a valid Date object
    const parseDate1 = (dateStr) => {
        if (!dateStr) return null;
        const [day, month, year] = dateStr.split("-").map(Number);
        return new Date(year, month - 1, day); // Convert dd-mm-yyyy to Date object
    };

    // Initialize states from sessionStorage or set default values
    const [selectedfromDate, setSelectedfromDate] = useState(
        parseDate1(storedData.fromInputDate) || null
    );
    const [fromInputDate, setfromInputDate] = useState(
        storedData.fromInputDate || ""
    );

    const [selectedToDate, setSelectedToDate] = useState(
        parseDate1(storedData.toInputDate) || null
    );
    const [toInputDate, settoInputDate] = useState(storedData.toInputDate || "");

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
    const handleStoreKeypress = (event, inputId) => {
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

    function fetchReceivableReport() {
        const fromDateElement = document.getElementById("fromdatevalidation");
        const toDateElement = document.getElementById("todatevalidation");

        const dateRegex = /^\d{2}-\d{2}-\d{4}$/;

        let hasError = false;
        let errorType = "";

        switch (true) {
            case !saleType:
                errorType = "saleType";
                break;
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
            case "saleType":
                toast.error("Please select a Account Code");
                return;

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

        const apiUrl = apiLinks + "/ItemLedger.php";
        setIsLoading(true);
        const formData = new URLSearchParams({
            FIntDat: fromInputDate,
            FFnlDat: toInputDate,
            FTrnTyp: transectionType,
            FItmCod: saleType,
            FStrCod: saleType1,
            code: organisation.code,
            FLocCod: locationnumber || getLocationNumber,
            FYerDsc: yeardescription || getYearDescription,



        }).toString();

        axios
            .post(apiUrl, formData)
            .then((response) => {
                setIsLoading(false);
                // Update total amount and quantity
                settotalpurchase(response.data["Total Purchase "]);
                settotalpurchaseReturn(response.data["Total Pur Return "]);
                settotalReceive(response.data["Total Receive "]);
                settotalissue(response.data["Total Issue "]);
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
        // Check if the report was opened via double-click
        const isOpenedFromDoubleClick =
            sessionStorage.getItem("openedFromDoubleClick") === "true";
        const storedData = sessionStorage.getItem("itemLedgerData");
        const summryclickdata = storedData ? JSON.parse(storedData) : null;

        const currentDate = new Date();
        const firstDateOfCurrentMonth = new Date(
            currentDate.getFullYear(),
            currentDate.getMonth(),
            1
        );

        setSelectedfromDate(firstDateOfCurrentMonth);
        setfromInputDate(formatDate(firstDateOfCurrentMonth));

        if (
            isOpenedFromDoubleClick &&
            summryclickdata?.fromInputDate &&
            summryclickdata?.toInputDate
        ) {
            // Convert stored string to a valid Date format
            const fromDate = parseDate(summryclickdata.fromInputDate);
            const toDate = parseDate(summryclickdata.toInputDate);

            if (fromDate && toDate) {
                // ✅ Use stored session values ONLY when opened via double-click
                setSelectedfromDate(fromDate);
                setfromInputDate(formatDate(fromDate)); // Ensure correct formatting

                setSelectedToDate(toDate);
                settoInputDate(formatDate(toDate)); // Ensure correct formatting
            }

            // ✅ Clear session storage AFTER using stored data
            setTimeout(() => {
                sessionStorage.removeItem("openedFromDoubleClick");
                sessionStorage.removeItem("itemLedgerData");
            }, 2000); // Delay to avoid premature removal
        } else {
            // ❌ Ignore session storage when opened independently
            setSelectedfromDate(firstDateOfCurrentMonth);
            setfromInputDate(formatDate(firstDateOfCurrentMonth));

            setSelectedToDate(currentDate);
            settoInputDate(formatDate(currentDate));
        }
    }, []);

    // useEffect(() => {
    //     if (selectedRadio === "custom") {
    //         // Ensure stored dates are in a valid format before converting to Date objects
    //         const parseDate = (dateStr) => {
    //             if (!dateStr) return null;
    //             const [day, month, year] = dateStr.split("-").map(Number);
    //             return new Date(year, month - 1, day); // Convert dd-mm-yyyy to Date object
    //         };

    //         const fromDate = parseDate(fromInputDate) || new Date();
    //         const toDate = parseDate(toInputDate) || new Date();

    //         setSelectedfromDate(fromDate);
    //         setfromInputDate(formatDate(fromDate)); // Convert back to dd-mm-yyyy
    //         setSelectedToDate(toDate);
    //         settoInputDate(formatDate(toDate)); // Convert back to dd-mm-yyyy
    //     } else {
    //         const days = parseInt(selectedRadio.replace("days", ""), 10);
    //         handleRadioChange(days);
    //     }
    // }, [selectedRadio]);

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
        if (isOptionsLoaded && options.length > 0 && !saleType) {
            const firstOption = options[0];
            setSaleType(firstOption.value);

            // Extract description after the last hyphen
            const fullLabel = firstOption.label;
            const description = fullLabel.split("-").pop()?.trim(); // "M.ABDULLAH ABID MARKET"

            setCompanyselectdatavalue({
                value: firstOption.value,
                label: description, // Only the descriptive part
                fullLabel: fullLabel, // Optional: keep original if needed
            });
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

    useEffect(() => {
        const apiUrl = apiLinks + "/GetActiveStore.php";
        const formData = new URLSearchParams({
            FLocCod: getLocationNumber,
            code: organisation.code,
        }).toString();
        axios
            .post(apiUrl, formData)
            .then((response) => {
                setstoreList(response.data);
            })
            .catch((error) => {
                console.error("Error fetching data:", error);
            });
    }, []);

    const storeoption = storeList.map((item) => ({
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
            width: 430,
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

    const customStyles2 = (hasError) => ({
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
            item.Type,
            item.Str,
            item.Description,
            item.Purchase,
            item["Pur-Ret"],
            item.Receive,
            item.Issue,
            item.Sale,
            item["Sale-Ret"],
            item.Bal,
        ]);

        // Add summary row to the table

        rows.push([
            "",
            "",
            "",
            "",
            "Total",
            String(totalpurchase),
            String(totalpurchaseReturn),
            String(totalReceive),
            String(totalissue),
            String(totalsale),
            String(totalsaleReturn),
            String(totalclosingbalance),
        ]);

        // Define table column headers and individual column widths
        const headers = [
            "Date",
            "Trn#",
            "Type",
            "Str",
            "Description",
            "Purchase",
            "Pur-Ret",
            "Receive",
            "Issue",
            "Sale",
            "Sale-Ret",
            "Bal",
        ];
        const columnWidths = [20, 14, 12, 12, 70, 18, 18, 18, 18, 18, 18, 18];

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
                        cellIndex === 5 ||
                        cellIndex === 6 ||
                        cellIndex === 7 ||
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

                addTitle(
                    `Item Ledger Report From: ${fromInputDate} To: ${toInputDate}`,
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

                let status =
                    transectionType === "A"
                        ? "ALL"
                        : transectionType === "CRV"
                            ? "Cash Receive Voucher"
                            : transectionType === "CPV"
                                ? "Cash Payment Voucher"
                                : transectionType === "BRV"
                                    ? "Bank Receive Voucher"
                                    : transectionType === "BPV"
                                        ? "Bank Payment Voucher"
                                        : transectionType === "JRV"
                                            ? "Journal Voucher"
                                            : transectionType === "INV"
                                                ? "Item Sale"
                                                : transectionType === "SRN"
                                                    ? "Sale Return"
                                                    : transectionType === "BIL"
                                                        ? "Purchase"
                                                        : transectionType === "PRN"
                                                            ? "Purchase Return"
                                                            : transectionType === "ISS"
                                                                ? "Issue"
                                                                : transectionType === "REC"
                                                                    ? "Received"
                                                                    : transectionType === "SLY"
                                                                        ? "Salary"
                                                                        : "ALL";

                let search = Companyselectdatavalue.label
                    ? Companyselectdatavalue.label
                    : "ALL";

                // Set font style, size, and family
                doc.setFont(getfontstyle, "300"); // Font family and style ('normal', 'bold', 'italic', etc.)
                doc.setFontSize(10); // Font size

                doc.setFont(getfontstyle, "bold"); // Set font to bold
                doc.text(`ACCOUNT :`, labelsX, labelsY + 8.5); // Draw bold label
                doc.setFont(getfontstyle, "normal"); // Reset font to normal
                doc.text(`${search}`, labelsX + 25, labelsY + 8.5); // Draw the value next to the label

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
        doc.save(`ItemLedgerReport Form ${fromInputDate} To ${toInputDate}.pdf`);
    };
    ///////////////////////////// DOWNLOAD PDF EXCEL //////////////////////////////////////////////////////////
    const handleDownloadCSV = async () => {
        const workbook = new ExcelJS.Workbook();
        const worksheet = workbook.addWorksheet("Sheet1");

        const numColumns = 6; // Number of columns

        const columnAlignments = [
            "left",
            "left",
            "center",
            "left",
            "left",
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

        [
            comapnyname,
            `Item Ledger Report From ${fromInputDate} To ${toInputDate} `,
        ].forEach((title, index) => {
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
            typestatus = "ALL";
        } else if (transectionType === "CRV") {
            typestatus = "Cash Receive Voucher";
        } else if (transectionType === "CPV") {
            typestatus = "Cash Payment Voucher";
        } else if (transectionType === "BRV") {
            typestatus = "Bank Receive Voucher";
        } else if (transectionType === "BPV") {
            typestatus = "Bank Payment Voucher";
        } else if (transectionType === "JRV") {
            typestatus = "Journal Voucher";
        } else if (transectionType === "INV") {
            typestatus = "Item Sale";
        } else if (transectionType === "SRN") {
            typestatus = "Sale Return";
        } else if (transectionType === "BIL") {
            typestatus = "Purchase";
        } else if (transectionType === "PRN") {
            typestatus = "Purchase Return";
        } else if (transectionType === "ISS") {
            typestatus = "Issue";
        } else if (transectionType === "REC") {
            typestatus = "Received";
        } else if (transectionType === "SLY") {
            typestatus = "Salary";
        } else {
            typestatus = "ALL"; // Default value
        }

        let typesearch = Companyselectdatavalue.label
            ? Companyselectdatavalue.label
            : "ALL";

        const typeAndStoreRow3 = worksheet.addRow([
            "ACCOUNT:",
            typesearch,
            "",
            "",
            "",
            "",
            "",
            "",
            "",
            "TYPE :",
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
            "Trn#",
            "Type",
            "Str",
            "Description",
            "Purchase",
            "Pur-Ret",
            "Receive",
            "Issue",
            "Sale",
            "Sale-Ret",
            "Bal",
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
                item.Type,
                item.Str,
                item.Description,
                item.Purchase,
                item["Pur-Ret"],
                item.Receive,
                item.Issue,
                item.Sale,
                item["Sale-Ret"],
                item.Bal,
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
            "",
            "",
            "Total",
            String(totalpurchase),
            String(totalpurchaseReturn),
            String(totalReceive),
            String(totalissue),
            String(totalsale),
            String(totalsaleReturn),
            String(totalclosingbalance),
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
                colNumber === 6 ||
                colNumber === 7 ||
                colNumber === 8 ||
                colNumber === 9 ||
                colNumber === 10 ||
                colNumber === 11 ||
                colNumber === 12
            ) {
                cell.alignment = { horizontal: "right" };
            }
        });

        // Set column widths

        [12, 8, 7, 7, 40, 11, 11, 11, 11, 11, 11, 11].forEach((width, index) => {
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
        saveAs(
            blob,
            `ItemLedgerReport From ${fromInputDate} To ${toInputDate}.xlsx`
        );
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
        width: "4.8%",
    };
    const sixthColWidth = {
        width: "28%",
    };
    const seventhColWidth = {
        width: "7%",
    };
    const eightColWidth = {
        width: "7%",
    };
    const ninthColWidth = {
        width: "7%",
    };
    const tenthColWidth = {
        width: "7%",
    };

    const elewenthColWidth = {
        width: "7%",
    };
    const tewlthColWidth = {
        width: "7%",
    };

    const thirteenColWidth = {
        width: "7%",
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
        maxWidth: "85vw",
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
                    <NavComponent textdata="Item Ledger Report" />
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
                            <div className="d-flex align-items-center justify-content-center">
                                <div className="mx-5"></div>

                                <div
                                    className="d-flex align-items-center"
                                    style={{ marginRight: "15px" }}
                                >
                                    <div
                                        style={{
                                            display: "flex",
                                            justifyContent: "evenly",
                                        }}
                                    >
                                        <div className="d-flex align-items-baseline mx-2">
                                            <input
                                                type="radio"
                                                name="dateRange"
                                                id="custom"
                                                checked={selectedRadio === "custom"}
                                                onChange={() => handleRadioChange(0)}
                                                onFocus={(e) =>
                                                    (e.currentTarget.style.border = "2px solid red")
                                                }
                                                onBlur={(e) =>
                                                    (e.currentTarget.style.border = `1px solid ${fontcolor}`)
                                                }
                                            />
                                            &nbsp;
                                            <label
                                                htmlFor="custom"
                                                style={{
                                                    fontSize: getdatafontsize,
                                                    fontFamily: getfontstyle,
                                                }}
                                            >
                                                Custom
                                            </label>
                                        </div>
                                        <div className="d-flex align-items-baseline mx-2">
                                            <input
                                                type="radio"
                                                name="dateRange"
                                                id="30"
                                                checked={selectedRadio === "30days"}
                                                onChange={() => handleRadioChange(30)}
                                                onFocus={(e) =>
                                                    (e.currentTarget.style.border = "2px solid red")
                                                }
                                                onBlur={(e) =>
                                                    (e.currentTarget.style.border = `1px solid ${fontcolor}`)
                                                }
                                            />
                                            &nbsp;
                                            <label
                                                htmlFor="30"
                                                style={{
                                                    fontSize: getdatafontsize,
                                                    fontFamily: getfontstyle,
                                                }}
                                            >
                                                30 Days
                                            </label>
                                        </div>
                                        <div className="d-flex align-items-baseline mx-2">
                                            <input
                                                type="radio"
                                                name="dateRange"
                                                id="60"
                                                checked={selectedRadio === "60days"}
                                                onChange={() => handleRadioChange(60)}
                                                onFocus={(e) =>
                                                    (e.currentTarget.style.border = "2px solid red")
                                                }
                                                onBlur={(e) =>
                                                    (e.currentTarget.style.border = `1px solid ${fontcolor}`)
                                                }
                                            />
                                            &nbsp;
                                            <label
                                                htmlFor="60"
                                                style={{
                                                    fontSize: getdatafontsize,
                                                    fontFamily: getfontstyle,
                                                }}
                                            >
                                                60 Days
                                            </label>
                                        </div>
                                        <div className="d-flex align-items-baseline mx-2">
                                            <input
                                                type="radio"
                                                name="dateRange"
                                                id="90"
                                                checked={selectedRadio === "90days"}
                                                onChange={() => handleRadioChange(90)}
                                                onFocus={(e) =>
                                                    (e.currentTarget.style.border = "2px solid red")
                                                }
                                                onBlur={(e) =>
                                                    (e.currentTarget.style.border = `1px solid ${fontcolor}`)
                                                }
                                            />
                                            &nbsp;
                                            <label
                                                htmlFor="90"
                                                style={{
                                                    fontSize: getdatafontsize,
                                                    fontFamily: getfontstyle,
                                                }}
                                            >
                                                90 Days
                                            </label>
                                        </div>
                                    </div>
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
                                            Account :
                                        </span>{" "}
                                        <br />
                                    </label>
                                </div>
                                <div style={{ marginLeft: "5px" }}>
                                    {/* <Select
                                        className="List-select-class "
                                        ref={saleSelectRef}
                                        options={options}
                                        onKeyDown={(e) => handleSaleKeypress(e, "frominputid")}
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
                                                setCompanyselectdatavalue('')
                                            }
                                        }}
                                        components={{ Option: DropdownOption }}
                                        // styles={customStyles1}
                                        styles={customStyles1(!saleType)}
                                        isClearable
                                        placeholder="ALL"
                                    /> */}

                                    <Select
                                        className="List-select-class"
                                        ref={saleSelectRef}
                                        options={options}
                                        value={
                                            options.find((opt) => opt.value === saleType) || null
                                        } // Ensure correct reference
                                        onKeyDown={(e) => handleSaleKeypress(e, "frominputid")}
                                        id="selectedsale"
                                        onChange={(selectedOption) => {
                                            if (selectedOption && selectedOption.value) {
                                                const labelParts = selectedOption.label.split("-"); // Split by "-"
                                                const description = labelParts.slice(3).join("-"); // Remove the first 3 parts
                                                setSaleType(selectedOption ? selectedOption.value : ""); // Correctly update state
                                                setCompanyselectdatavalue({
                                                    value: selectedOption.value,
                                                    label: description, // Keep only the description
                                                });
                                            } else {
                                                setSaleType(""); // Clear the saleType state when selectedOption is null (i.e., when the selection is cleared)
                                                setCompanyselectdatavalue("");
                                            }
                                        }}
                                        components={{ Option: DropdownOption }}
                                        styles={customStyles1(!saleType)}
                                        isClearable
                                        placeholder="ALL"
                                    />
                                </div>
                            </div>

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
                                            Store :
                                        </span>{" "}
                                        <br />
                                    </label>
                                </div>
                                <div style={{ marginLeft: "5px" }}>
                                    <Select
                                        className="List-select-class"
                                        ref={saleSelectRef1}
                                        options={storeoption}
                                        onKeyDown={(e) => handleStoreKeypress(e, "frominputid")}
                                        id="selectedsale"
                                        // value={options.find((option) => option.value === saleType1) || null} // Ensure proper value
                                        onChange={(selectedOption) => {
                                            if (selectedOption && selectedOption.value) {
                                                const labelParts = selectedOption.label.split("-"); // Split by "-"
                                                const description = labelParts.slice(3).join("-"); // Remove the first 3 parts
                                                setSaleType1(
                                                    selectedOption ? selectedOption.value : ""
                                                ); // Correctly update state
                                                setStoreselectdatavalue({
                                                    value: selectedOption.value,
                                                    label: description, // Keep only the description
                                                });
                                            } else {
                                                setSaleType1(""); // Clear the saleType state when selectedOption is null (i.e., when the selection is cleared)
                                                setStoreselectdatavalue("");
                                            }
                                        }}
                                        components={{ Option: DropdownOption }}
                                        styles={customStyles2(!saleType)}
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
                                        fontSize: "12px",
                                        color: fontcolor,
                                    }}
                                >
                                    <option value="">All</option>
                                    <option value="CRV">Cash Receive Vorcher</option>
                                    <option value="CPV">Cash Payment Vorcher</option>
                                    <option value="BRV">Bank Receive Vorcher</option>
                                    <option value="BPV">Bank Payment Vorcher</option>
                                    <option value="JRV">Journal Vorcher</option>
                                    <option value="INV">Item Sale</option>
                                    <option value="SRN">Sale Return</option>
                                    <option value="BIL">Purchase</option>
                                    <option value="PRN">Purchase Return</option>
                                    <option value="ISS">Issue</option>
                                    <option value="REC">Received</option>
                                    <option value="SLY">Salary</option>
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
                                            fontSize: "12px",
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
                            <div
                                className="d-flex align-items-center"
                                style={{ marginLeft: "196px" }}
                            >
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
                                            Trn#
                                        </td>
                                        <td className="border-dark" style={thirdColWidth}>
                                            Typ
                                        </td>
                                        {/* <td className="border-dark" style={forthColWidth}>
                                            Item Code
                                        </td> */}
                                        <td className="border-dark" style={fifthColWidth}>
                                            Str
                                        </td>
                                        <td className="border-dark" style={sixthColWidth}>
                                            Description
                                        </td>
                                        <td className="border-dark" style={seventhColWidth}>
                                            Purchase
                                        </td>
                                        <td className="border-dark" style={eightColWidth}>
                                            Pur Ret
                                        </td>
                                        <td className="border-dark" style={ninthColWidth}>
                                            Receive
                                        </td>
                                        <td className="border-dark" style={tenthColWidth}>
                                            Issue
                                        </td>
                                        <td className="border-dark" style={elewenthColWidth}>
                                            Sale
                                        </td>
                                        <td className="border-dark" style={tewlthColWidth}>
                                            Sale Ret
                                        </td>
                                        <td className="border-dark" style={thirteenColWidth}>
                                            Bal
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
                                maxHeight: "50vh",
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
                                                <td colSpan="12" className="text-center">
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
                                                        {Array.from({ length: 12 }).map((_, colIndex) => (
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
                                                {/* <td style={forthColWidth}></td> */}
                                                <td style={fifthColWidth}></td>
                                                <td style={sixthColWidth}></td>
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
                                                        <td className="text-center" style={thirdColWidth}>
                                                            {item.Type}
                                                        </td>

                                                        <td className="text-start" style={fifthColWidth}>
                                                            {item.Str}
                                                        </td>
                                                        <td className="text-start" style={sixthColWidth}>
                                                            {item.Description}
                                                        </td>
                                                        <td className="text-end" style={seventhColWidth}>
                                                            {item.Purchase}
                                                        </td>
                                                        <td className="text-end" style={eightColWidth}>
                                                            {item["Pur-Ret"]}
                                                        </td>
                                                        <td className="text-end" style={ninthColWidth}>
                                                            {item.Receive}
                                                        </td>
                                                        <td className="text-end" style={tenthColWidth}>
                                                            {item.Issue}
                                                        </td>
                                                        <td className="text-end" style={elewenthColWidth}>
                                                            {item.Sale}
                                                        </td>
                                                        <td className="text-end" style={tewlthColWidth}>
                                                            {item["Sale-Ret"]}
                                                        </td>
                                                        <td className="text-end" style={thirteenColWidth}>
                                                            {item.Bal}
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
                                                    {Array.from({ length: 12 }).map((_, colIndex) => (
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
                                                {/* <td style={forthColWidth}></td> */}
                                                <td style={fifthColWidth}></td>
                                                <td style={sixthColWidth}></td>
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
                        <div
                            style={{
                                ...thirdColWidth,
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
                            <span className="mobileledger_total">{totalReceive}</span>
                        </div>
                        <div
                            style={{
                                ...tenthColWidth,
                                background: getcolor,
                                borderRight: `1px solid ${fontcolor}`,
                            }}
                        >
                            <span className="mobileledger_total">{totalissue}</span>
                        </div>

                        <div
                            style={{
                                ...elewenthColWidth,
                                background: getcolor,
                                borderRight: `1px solid ${fontcolor}`,
                            }}
                        >
                            <span className="mobileledger_total">{totalsale}</span>
                        </div>
                        <div
                            style={{
                                ...tewlthColWidth,
                                background: getcolor,
                                borderRight: `1px solid ${fontcolor}`,
                            }}
                        >
                            <span className="mobileledger_total">{totalsaleReturn}</span>
                        </div>
                        <div
                            style={{
                                ...thirteenColWidth,
                                background: getcolor,
                                borderRight: `1px solid ${fontcolor}`,
                            }}
                        >
                            <span className="mobileledger_total">{totalclosingbalance}</span>
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
