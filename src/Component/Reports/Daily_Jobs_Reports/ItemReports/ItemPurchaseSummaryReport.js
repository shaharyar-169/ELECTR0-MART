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
import './itemstyle.css';
import "react-toastify/dist/ReactToastify.css";

export default function ItemPurchaseSummary() {
    const navigate = useNavigate();
    const user = getUserData();
    const organisation = getOrganisationData();
    const yeardescription = getYearDescription();
    const locationnumber = getLocationnumber();

    const saleSelectRef = useRef(null);
    const input1Ref = useRef(null);
    const input2Ref = useRef(null);
    const input3Ref = useRef(null);

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
    const [searchQuery, setSearchQuery] = useState("");
    const [transectionType, settransectionType] = useState("");

    const [storeType, setStoreType] = useState("");
    const [companyType, setCompanyType] = useState("");
    const [categoryType, setCategoryType] = useState("");
    const [capacityType, setCapacityType] = useState("");

    const [storeTypeDataValue, setStoreTypeDataValue] = useState("");
    const [companyTypeDataValue, setCompanyTypeDataValue] = useState("");
    const [categoryTypeDataValue, setCategoryTypeDataValue] = useState("");
    const [capacityTypeDataValue, setCapacityTypeDataValue] = useState("");

    const [storeList, setStoreList] = useState([]);
    const [companyList, setCompanyList] = useState([]);
    const [categoryList, setCategoryList] = useState([]);
    const [capacityList, setCapacityList] = useState([]);

    const [totalQnty, setTotalQnty] = useState(0);
    const [totalOpening, setTotalOpening] = useState(0);
    const [totalDebit, setTotalDebit] = useState(0);
    const [totalCredit, setTotalCredit] = useState(0);
    const [closingBalance, setClosingBalance] = useState(0);
    const [totalAmount, setTotalAmount] = useState(0);

    // state for from DatePicker
    const [selectedfromDate, setSelectedfromDate] = useState(null);
    const [fromInputDate, setfromInputDate] = useState("");
    const [fromCalendarOpen, setfromCalendarOpen] = useState(false);
    // state for To DatePicker
    const [selectedToDate, setSelectedToDate] = useState(null);
    const [toInputDate, settoInputDate] = useState("");
    const [toCalendarOpen, settoCalendarOpen] = useState(false);

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
        getdatafontsize,
        getfontstyle,
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
    const handleKeyPress = (e, nextInputRef) => {
        if (e.key === "Enter") {
            e.preventDefault();
            if (nextInputRef.current) {
                nextInputRef.current.focus();
            }
        }
    };

    function fetchItemPurchaseReport() {
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

        const data = {
            FIntDat: fromInputDate,
            FFnlDat: toInputDate,
            FTrnTyp: transectionType,
            FAccCod: saleType,
            code: organisation.code,
            FLocCod: getLocationNumber,
            FYerDsc: getyeardescription,
        };
        // console.log(data);
        document.getElementById(
            "fromdatevalidation"
        ).style.border = `1px solid ${fontcolor}`;
        document.getElementById(
            "todatevalidation"
        ).style.border = `1px solid ${fontcolor}`;

        const apiMainUrl = apiLinks + "/ItemPurchaseSummary.php";
        setIsLoading(true);
        const formMainData = new URLSearchParams({
            // code: organisation.code,
            // FLocCod: locationnumber || getLocationNumber,
            // FYerDsc: yeardescription || getyeardescription,

            code: 'NASIRTRD',
            FLocCod: '001',
            FYerDsc: '2024-2024',

            FIntDat: fromInputDate,
            FFnlDat: toInputDate,
            FTrnTyp: transectionType,
            FStrCod: storeType,
            FCapCod: capacityType,
            FCmpCod: companyType,
            FCtgCod: categoryType,
            FSchTxt: "",
        }).toString();

        axios
            .post(apiMainUrl, formMainData)
            .then((response) => {
                setIsLoading(false);
                // console.log("Response:", response.data);

                setTotalQnty(response.data["Total Qnty"]);
                setTotalAmount(response.data["Total Amount"]);

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

        //-------------- capacity dropdown
        const apiCapacityUrl = apiLinks + "/GetCapacity.php";
        const formCapacityData = new URLSearchParams({
            // FLocCod: getLocationNumber,
            code: organisation.code,
            // code: "EMART",
        }).toString();
        axios
            .post(apiCapacityUrl, formCapacityData)
            .then((response) => {
                setCapacityList(response.data);
                // console.log("CAPACITY" + response.data);
            })
            .catch((error) => {
                console.error("Error fetching data:", error);
            });

        // ------------company dropdown
        const apiCompanyUrl = apiLinks + "/GetCompany.php";
        const formCompanyData = new URLSearchParams({
            code: organisation.code,
        }).toString();
        axios
            .post(apiCompanyUrl, formCompanyData)
            .then((response) => {
                setCompanyList(response.data);
                // console.log("COMPANY" + response.data);
            })
            .catch((error) => {
                console.error("Error fetching data:", error);
            });

        // -----------category dropdown
        const apiCategoryUrl = apiLinks + "/GetCatg.php";
        const formCategoryData = new URLSearchParams({
            // FLocCod: getLocationNumber,
            code: organisation.code,
            // code: "EMART",
        }).toString();
        axios
            .post(apiCategoryUrl, formCategoryData)
            .then((response) => {
                setCategoryList(response.data);
                // console.log("CATEGORY" + response.data);
            })
            .catch((error) => {
                console.error("Error fetching data:", error);
            });
    }, []);

    // Store List array
    const optionStore = storeList.map((item) => ({
        value: item.tstrcod,
        label: item.tstrdsc.trim(),
    }));

    // Capacity List array
    const optionCapacity = capacityList.map((item) => ({
        value: item.tcapcod,
        label: item.tcapdsc.trim(),
    }));

    // Company List array
    const optionCompany = companyList.map((item) => ({
        value: item.tcmpcod,
        label: item.tcmpdsc.trim(),
    }));

    // Category List array
    const optionCategory = categoryList.map((item) => ({
        value: item.tctgcod,
        label: item.tctgdsc.trim(),
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
   
       const customStylesStore = (hasError) => ({
           control: (base, state) => ({
               ...base,
               height: "24px",
               minHeight: "unset",
               width: 275,
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
               color: state.isSelected ? "white" : fontcolor,
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



    useEffect(() => {
        document.documentElement.style.setProperty("--background-color", getcolor);
    }, [getcolor]);
    // ------------ capacity style customization
    const customStylesCapacity = () => ({
        control: (base, state) => ({
            ...base,
            height: "24px",
            minHeight: "unset",
            width: 275,
            fontSize: parseInt(getdatafontsize),
            backgroundColor: getcolor,
            color: fontcolor,
            borderRadius: 0,
            // border: hasError ? "2px solid red" : `1px solid ${fontcolor}`,
            transition: "border-color 0.15s ease-in-out",
            "&:hover": {
                borderColor: state.isFocused ? base.borderColor : "black",
            },
            padding: "0 8px",
            display: "flex",
            // alignItems: "center",
            justifyContent: "space-between",
        }),
        dropdownIndicator: (base) => ({
            ...base,
            padding: 0,
            marginTop: "-5px",
            fontSize: parseInt(getdatafontsize),
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

    // ------------ company style customization
    const customStylesCompany = () => ({
        control: (base, state) => ({
            ...base,
            height: "24px",
            minHeight: "unset",
            width: 275,
            fontSize: parseInt(getdatafontsize),
            backgroundColor: getcolor,
            color: fontcolor,
            borderRadius: 0,
            // border: hasError ? "2px solid red" : `1px solid ${fontcolor}`,
            transition: "border-color 0.15s ease-in-out",
            "&:hover": {
                borderColor: state.isFocused ? base.borderColor : "black",
            },
            padding: "0 8px",
            display: "flex",
            // alignItems: "center",
            justifyContent: "space-between",
        }),
        dropdownIndicator: (base) => ({
            ...base,
            padding: 0,
            marginTop: "-5px",
            fontSize: parseInt(getdatafontsize),
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

    // ------------ category style customization
    const customStylesCategory = () => ({
        control: (base, state) => ({
            ...base,
            height: "24px",
            minHeight: "unset",
            width: 275,
            fontSize: parseInt(getdatafontsize),
            backgroundColor: getcolor,
            color: fontcolor,
            borderRadius: 0,
            // border: hasError ? "2px solid red" : `1px solid ${fontcolor}`,
            transition: "border-color 0.15s ease-in-out",
            "&:hover": {
                borderColor: state.isFocused ? base.borderColor : "black",
            },
            padding: "0 8px",
            display: "flex",
            // alignItems: "center",
            justifyContent: "space-between",
        }),
        dropdownIndicator: (base) => ({
            ...base,
            padding: 0,
            marginTop: "-5px",
            fontSize: parseInt(getdatafontsize),
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

    const handleTransactionTypeChange = (event) => {
        const selectedTransactionType = event.target.value;
        settransectionType(selectedTransactionType);
    };

    const exportPDFHandler = () => {
        const doc = new jsPDF({ orientation: "portrait" });
        const rows = tableData.map((item) => [
            item.code,
            item.Description,
            item.Rate,
            item.Qnty,
            item["Pur Amount"],
        ]);
        rows.push(["", "Total", "", String(totalQnty), String(totalAmount)]);
        const headers = ["Code", "Description", "Rate", "Qty", "Amount"];
        const columnWidths = [35, 100, 25, 15, 25];
        const totalWidth = columnWidths.reduce((acc, width) => acc + width, 0);
        const pageHeight = doc.internal.pageSize.height;
        const paddingTop = 15;
        doc.setFont(getfontstyle, "normal");
        doc.setFontSize(parseInt(getdatafontsize));

        const addTableHeaders = (startX, startY) => {
            doc.setFont(getfontstyle, "bold");
            doc.setFontSize(parseInt(getdatafontsize));
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
            doc.setFont(getfontstyle, "normal");
            doc.setFontSize(parseInt(getdatafontsize));
        };

        const addTableRows = (startX, startY, startIndex, endIndex) => {
            const rowHeight = 6;
            const fontSize = parseInt(getdatafontsize);
            const boldFont = getfontstyle;
            const normalFont = getfontstyle;
            const tableWidth = getTotalTableWidth();
            doc.setFontSize(fontSize);

            for (let i = startIndex; i < endIndex; i++) {
                const row = rows[i];
                const isTotalRow = i === rows.length - 1;
                const isNegativeQnty = row[3] && row[3].startsWith("-");
                let textColor = [0, 0, 0]; // Default text color
                let fontName = normalFont;
                const bgColor = [255, 255, 255]; // Always white background

                // Set text color to red for negative quantities (except total row)
                if (isNegativeQnty && !isTotalRow) {
                    textColor = [255, 0, 0];
                }

                doc.setDrawColor(0);
                doc.setFillColor(bgColor[0], bgColor[1], bgColor[2]);
                doc.rect(
                    startX,
                    startY + (i - startIndex + 2) * rowHeight,
                    tableWidth,
                    rowHeight,
                    "F"
                );

                row.forEach((cell, cellIndex) => {
                    const cellY = startY + (i - startIndex + 2) * rowHeight + 3;
                    const cellX = startX + 2;
                    doc.setTextColor(textColor[0], textColor[1], textColor[2]);
                    doc.setFont(fontName, "normal");

                    if (isTotalRow) {
                        doc.setFont(boldFont, "bold");
                        doc.setTextColor(textColor[0], textColor[1], textColor[2]);
                    } else {
                        doc.setFont(normalFont, "normal");
                    }

                    doc.setTextColor(textColor[0], textColor[1], textColor[2]);
                    const cellValue = String(cell);
                    if (cellIndex === 2 || cellIndex === 3 || cellIndex === 4) {
                        const rightAlignX = startX + columnWidths[cellIndex] - 2;
                        doc.text(cellValue, rightAlignX, cellY, {
                            align: "right",
                            baseline: "middle",
                        });
                    } else {
                        doc.text(cellValue, cellX, cellY, { baseline: "middle" });
                    }

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

                doc.rect(
                    startX,
                    startY + (i - startIndex + 2) * rowHeight,
                    columnWidths[row.length - 1],
                    rowHeight
                );
                startX = (doc.internal.pageSize.width - tableWidth) / 2;
            }

            const lineWidth = tableWidth;
            const lineX = (doc.internal.pageSize.width - tableWidth) / 2;
            const lineY = pageHeight - 15;
            doc.setLineWidth(0.3);
            doc.line(lineX, lineY, lineX + lineWidth, lineY);
            const headingFontSize = parseInt(getdatafontsize);
            const headingX = lineX + 2;
            const headingY = lineY + 5;
            doc.setFontSize(headingFontSize);
            doc.setTextColor(0);
            doc.text(`Crystal Solution \t ${date} \t ${time}`, headingX, headingY);
        };

        const getTotalTableWidth = () => {
            let totalWidth = 0;
            columnWidths.forEach((width) => (totalWidth += width));
            return totalWidth;
        };

        const addNewPage = (startY) => {
            doc.addPage();
            return paddingTop;
        };

        const rowsPerPage = 37;

        const handlePagination = () => {
            const addTitle = (
                title,
                date,
                time,
                pageNumber,
                startY,
                titleFontSize = 18,
                dateTimeFontSize = 8,
                pageNumberFontSize = 8
            ) => {
                doc.setFontSize(titleFontSize);
                doc.text(title, doc.internal.pageSize.width / 2, startY, {
                    align: "center",
                });
                const rightX = doc.internal.pageSize.width - 10;
                if (date) {
                    doc.setFontSize(dateTimeFontSize);
                    if (time) {
                        doc.text(date + " " + time, rightX, startY, { align: "right" });
                    } else {
                        doc.text(date, rightX - 10, startY, { align: "right" });
                    }
                }
                doc.setFontSize(pageNumberFontSize);
                doc.text(
                    `Page ${pageNumber}`,
                    rightX - 10,
                    doc.internal.pageSize.height - 10,
                    { align: "right" }
                );
            };

            let currentPageIndex = 0;
            let startY = paddingTop;
            let pageNumber = 1;

            while (currentPageIndex * rowsPerPage < rows.length) {
                // Add company name and title
                doc.setFont(getfontstyle, "bold");
                addTitle(comapnyname, "", "", pageNumber, startY, 18);
                doc.setFont(getfontstyle, "normal");
                startY += 7;
                addTitle(
                    `Item Purchase Summary Report From: ${fromInputDate} To: ${toInputDate}`,
                    "",
                    "",
                    pageNumber,
                    startY,
                    parseInt(getdatafontsize)
                );
                startY += 10;

                // New additional line before the table
                const typeWord = "Type: ";
                const typeTerm = transectionType
                    ? transectionType === "BIL"
                        ? "PURCHASE"
                        : "PURCHASE RETURN"
                    : "ALL";

                const searchWord = searchQuery ? "Search: " : "";
                const searchTerm = searchQuery ? searchQuery : "";

                const companyWord = "Company: ";
                const companyTerm = companyTypeDataValue
                    ? companyTypeDataValue.label
                    : "ALL";

                const categoryWord = "Category: ";
                const categoryTerm = categoryTypeDataValue
                    ? categoryTypeDataValue.label
                    : "ALL";

                const capacityWord = "Capacity: ";
                const capacityTerm = capacityTypeDataValue
                    ? capacityTypeDataValue.label
                    : "ALL";

                const storeWord = "Store: ";
                const storeTerm = storeTypeDataValue ? storeTypeDataValue.label : "ALL";

                const labelXLeftWord = doc.internal.pageSize.width - totalWidth;
                const labelXLeftTerm = doc.internal.pageSize.width - totalWidth + 20;

                const labelXRightWord = doc.internal.pageSize.width - totalWidth + 140;
                const labelXRightTerm = doc.internal.pageSize.width - totalWidth + 155;

                doc.setFontSize(parseInt(getdatafontsize));

                doc.setFont(getfontstyle, "bold");
                doc.text(companyWord, labelXLeftWord, startY);
                doc.text(storeWord, labelXRightWord, startY);

                doc.setFont(getfontstyle, "normal");
                doc.text(companyTerm, labelXLeftTerm, startY);
                doc.text(storeTerm, labelXRightTerm, startY);

                startY += 5; // Adjust the Y-position for the next section
                doc.setFont(getfontstyle, "bold");
                doc.text(categoryWord, labelXLeftWord, startY);
                doc.text(typeWord, labelXRightWord, startY);

                doc.setFont(getfontstyle, "normal");
                doc.text(categoryTerm, labelXLeftTerm, startY);
                doc.text(typeTerm, labelXRightTerm, startY);

                startY += 5; // Adjust the Y-position for the next section
                doc.setFont(getfontstyle, "bold");
                doc.text(capacityWord, labelXLeftWord, startY);
                doc.text(searchWord, labelXRightWord, startY);

                doc.setFont(getfontstyle, "normal");
                doc.text(capacityTerm, labelXLeftTerm, startY);
                doc.text(searchTerm, labelXRightTerm, startY);

                // startY += 2; // Adjust the Y-position for the next section
                addTableHeaders(
                    (doc.internal.pageSize.width - totalWidth) / 2,
                    startY + 6
                );
                const startIndex = currentPageIndex * rowsPerPage;
                const endIndex = Math.min(startIndex + rowsPerPage, rows.length);
                startY = addTableRows(
                    (doc.internal.pageSize.width - totalWidth) / 2,
                    startY,
                    startIndex,
                    endIndex
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
            return dd + "/" + mm + "/" + yyyy;
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
        doc.save(
            `ItemPurchaseSummaryReportFrom${fromInputDate}To${toInputDate}.pdf`
        );

        const pdfBlob = doc.output("blob");
        const pdfFile = new File([pdfBlob], "table_data.pdf", {
            type: "application/pdf",
        });
    };

    const handleDownloadCSV = async () => {
        const workbook = new ExcelJS.Workbook();
        const worksheet = workbook.addWorksheet("Sheet1");
        const numColumns = 5;

        const columnAlignments = ["left", "left", "right", "right", "right"];
        worksheet.addRow([]);
    
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
    
         // Add company name
        const companyRow = worksheet.addRow([comapnyname]);
companyRow.eachCell((cell) => {
    cell.font = fontCompanyName;
    cell.alignment = { horizontal: "center", vertical: "middle" };
});

worksheet.getRow(companyRow.number).height = 80;

worksheet.mergeCells(
    `A${companyRow.number}:${String.fromCharCode(65 + numColumns - 1)}${companyRow.number}`
);


        // Add Store List row
        const storeListRow = worksheet.addRow([`Item Purchase Summary Report From${fromInputDate} To ${toInputDate}`]);
        storeListRow.eachCell((cell) => {
            cell.font = fontStoreList;
            cell.alignment = { horizontal: "center" };
        });

        worksheet.mergeCells(
            `A${storeListRow.number}:${String.fromCharCode(65 + numColumns - 1)}${storeListRow.number
            }`
        );
        worksheet.addRow([]);
        worksheet
            .addRow([
                "Company: ",
                companyTypeDataValue ? companyTypeDataValue.label : "ALL",
                "",
                "Store: ",
                storeTypeDataValue ? storeTypeDataValue.label : "ALL",
            ])
            .eachCell((cell, colNumber) => {
                if (colNumber === 1) {
                    // Target the cell containing "Search:"
                    cell.font = {
                        bold: true,
                        size: parseInt(getdatafontsize), // Apply dynamic font size if required
                    };
                }
                if (colNumber === 4) {
                    // Target the cell containing "Search:"
                    cell.font = {
                        bold: true,
                        size: parseInt(getdatafontsize), // Apply dynamic font size if required
                    };
                }
            });
        worksheet
            .addRow([
                "Category: ",
                categoryTypeDataValue ? categoryTypeDataValue.label : "ALL",
                "",
                "Type: ",
                transectionType
                    ? transectionType === "BIL"
                        ? "PURCHASE"
                        : "PURCHASE RETURN"
                    : "ALL",
            ])
            .eachCell((cell, colNumber) => {
                if (colNumber === 1) {
                    // Target the cell containing "Search:"
                    cell.font = {
                        bold: true,
                        size: parseInt(getdatafontsize), // Apply dynamic font size if required
                    };
                }
                if (colNumber === 4) {
                    // Target the cell containing "Search:"
                    cell.font = {
                        bold: true,
                        size: parseInt(getdatafontsize), // Apply dynamic font size if required
                    };
                }
            });
        worksheet
            .addRow([
                "Capacity: ",
                capacityTypeDataValue ? capacityTypeDataValue.label : "ALL",
                "",
                searchQuery ? "Search: " : "",
                searchQuery ? searchQuery : "",
            ])
            .eachCell((cell, colNumber) => {
                if (colNumber === 1) {
                    // Target the cell containing "Search:"
                    cell.font = {
                        bold: true,
                        size: parseInt(getdatafontsize), // Apply dynamic font size if required
                    };
                }
                if (colNumber === 4) {
                    // Target the cell containing "Search:"
                    cell.font = {
                        bold: true,
                        size: parseInt(getdatafontsize), // Apply dynamic font size if required
                    };
                }
            });
        worksheet.addRow([]);
        const headerStyle = {
            font: { bold: true },
            alignment: { horizontal: "center" },
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
        const headers = ["Code", "Description", "Rate", "Qnty", "Amount"];
        const headerRow = worksheet.addRow(headers);
        headerRow.eachCell((cell) => {
            cell.style = {
                ...headerStyle,
                alignment: { horizontal: "center" },
                font: {
                    bold: true,
                    size: parseInt(getdatafontsize),
                },
            };
        });
        tableData.forEach((item) => {
            const row = worksheet.addRow([
                item.code,
                item.Description,
                item.Rate,
                item.Qnty,
                item["Pur Amount"],
            ]);

            // **Check if Qnty is negative**
            const isNegativeQnty = item.Qnty && String(item.Qnty).startsWith("-");

            if (isNegativeQnty) {
                row.eachCell((cell) => {
                    cell.fill = {
                        type: "pattern",
                        pattern: "solid",
                        fgColor: { argb: "FFFFFFFF" },
                    }; // Red color
                    cell.font = { color: { argb: "FFFF0000" } }; // White text for contrast
                });
            }
        });
        const totalRow = worksheet.addRow([
            "",
            "Total",
            "",
            totalQnty,
            totalAmount,
        ]);
        totalRow.eachCell((cell) => {
            cell.font = { bold: true };
        });
        [20, 45, 12, 7, 12].forEach((width, index) => {
            worksheet.getColumn(index + 1).width = width;
        });
        worksheet.eachRow((row, rowNumber) => {
            if (rowNumber > 7) {
                row.eachCell((cell, colNumber) => {
                    if (rowNumber === 8) {
                        cell.alignment = { horizontal: "center" };
                    } else {
                        cell.alignment = { horizontal: columnAlignments[colNumber - 1] };
                    }
                    cell.border = {
                        top: { style: "thin" },
                        left: { style: "thin" },
                        bottom: { style: "thin" },
                        right: { style: "thin" },
                    };
                });
            }
        });
        worksheet.getRow(2).height = 20;
        const buffer = await workbook.xlsx.writeBuffer();
        const blob = new Blob([buffer], {
            type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        });
        saveAs(
            blob,
            `ItemPurchaseSummaryReportFrom${fromInputDate}To${toInputDate}.xlsx`
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

   

    const firstColWidth = {
        width: "135px",
    };
    const secondColWidth = {
        width: "360px",
    };
    const thirdColWidth = {
        width: "90px",
    };
    const forthColWidth = {
        width: "60px",
    };
    const fifthColWidth = {
        width: "90px",
    };

     const sixthCol = {
        width: "13px",
    };

    useHotkeys("s", fetchItemPurchaseReport);
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

    const [menuCompanyIsOpen, setMenuCompanyIsOpen] = useState(false);
    const [menuCategoryIsOpen, setMenuCategoryIsOpen] = useState(false);
    const [menuCapacityIsOpen, setMenuCapacityIsOpen] = useState(false);
    const [menuStoreIsOpen, setMenuStoreIsOpen] = useState(false);


    const focusNextElement = (currentRef, nextRef) => {
        if (currentRef.current && nextRef.current) {
            currentRef.current.focus();
            nextRef.current.focus();
            if(nextRef.current == toRef){
              nextRef.current.select();
            }
            
        }
    };

    const handleFromDateEnter = (e) => {
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
        if (enteredDate < GlobalfromDate || enteredDate > GlobaltoDate) {
            toast.error(
                `Date must be between ${GlobalfromDate1} and ${GlobaltoDate1}`
            );
            return;
        }

        // Update input value and state
        e.target.value = formattedDate;
        setfromInputDate(formattedDate); // Update the state with formatted date

        
        // Move focus to the next element
        focusNextElement(fromRef, toRef);

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
            if (enteredDate < GlobalfromDate || enteredDate > GlobaltoDate) {
                toast.error(
                    `Date must be between ${GlobalfromDate1} and ${GlobaltoDate1}`
                );
                return;
            }

            // Update input value and state
            e.target.value = formattedDate;
            settoInputDate(formattedDate); // Update the state with formatted date

            // Move focus to the next element
            focusNextElement(toRef, companyRef);
        }
    };

    const handleCompanyEnter = (e) => {
        if (e.key === "Enter" && !menuCompanyIsOpen) {
            e.preventDefault();
            focusNextElement(companyRef, categoryRef);
        }
    };

    const handleCategoryEnter = (e) => {
        if (e.key === "Enter" && !menuCategoryIsOpen) {
            e.preventDefault();
            focusNextElement(categoryRef, capacityRef);
        }
    };

    const handleCapacityEnter = (e) => {
        if (e.key === "Enter" && !menuCapacityIsOpen) {
            e.preventDefault();
            focusNextElement(capacityRef, storeRef);
        }
    };

    const handleStoreEnter = (e) => {
        if (e.key === "Enter" && !menuStoreIsOpen) {
            e.preventDefault();
            focusNextElement(storeRef, typeRef);
        }
    };

    const handleTypeEnter = (e) => {
        if (e.key === "Enter") {
            e.preventDefault();
            focusNextElement(typeRef, searchRef);
        }
    };

    const handleSearchEnter = (e) => {
        if (e.key === "Enter") {
            e.preventDefault();
            focusNextElement(searchRef, selectButtonRef);
        }
    };


    const openReport = (code) => {
        sessionStorage.setItem("openedFromDoubleClick", "true");
        sessionStorage.setItem("itemLedgerData", JSON.stringify({ fromInputDate, toInputDate, code }));
        window.open("/crystalsol/ItemLedger", "_blank");
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
                    <NavComponent textdata="Item Purchase Summary" />

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
                                justifyContent: "start",
                            }}
                        >
                            {/* From Date */}
                            <div
                                className="d-flex align-items-center"
                                style={{ marginLeft: "20px" }}
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
                                                fontSize: parseInt(getdatafontsize),
                                                fontWeight: "bold",
                                            }}
                                        >
                                            From :&nbsp;
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
                                            fontSize: parseInt(getdatafontsize),
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
                                        onKeyDown={handleFromDateEnter}
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
                                                        fontSize: parseInt(getdatafontsize),
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

                            {/* To Date */}
                            <div className="d-flex align-items-center" style={{marginLeft:'50px'}}>
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
                                                fontSize: parseInt(getdatafontsize),
                                                fontWeight: "bold",
                                            }}
                                        >
                                            To :&nbsp;
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
                                            fontSize: parseInt(getdatafontsize),
                                            backgroundColor: getcolor,
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
                                                        fontSize: parseInt(getdatafontsize),
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

                            
                        </div>
                    </div>

                    {/* --------2nd row */}
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
                            {/* Company Select */}
                            <div className="d-flex align-items-center">
                                <div
                                    style={{
                                        width: "100px",
                                        display: "flex",
                                        justifyContent: "end",
                                    }}
                                >
                                    <label htmlFor="fromDatePicker">
                                        <span
                                            style={{
                                                fontSize: parseInt(getdatafontsize),
                                                fontWeight: "bold",
                                            }}
                                        >
                                            Company :&nbsp;
                                        </span>{" "}
                                        <br />
                                    </label>
                                </div>
                                <div>
                                    <Select
                                        className="List-select-class "
                                        ref={companyRef}
                                        options={optionCompany}
                                        onKeyDown={handleCompanyEnter}
                                        id="selectedsale"
                                        onChange={(selectedOption) => {
                                            if (selectedOption && selectedOption.value) {
                                                const labelPart = selectedOption.label.split("-")[0];
                                                setCompanyType(selectedOption.value);
                                                setCompanyTypeDataValue({
                                                    value: selectedOption.value,
                                                    label: labelPart,
                                                });
                                            } else {
                                                setCompanyType("");
                                                setCompanyTypeDataValue("");
                                            }
                                        }}
                                        components={{ Option: DropdownOption }}
                                        // styles={customStylesStore}
                                        styles={customStylesStore(!companyType)}
                                        isClearable
                                        placeholder="ALL"
                                        menuIsOpen={menuCompanyIsOpen}
                                        onMenuOpen={() => setMenuCompanyIsOpen(true)}
                                        onMenuClose={() => setMenuCompanyIsOpen(false)}
                                    />
                                </div>
                            </div>

                            {/* Store Select */}
                            <div
                                className="d-flex align-items-center"
                                style={{ marginRight: "20px" }}
                            >
                                <div
                                    style={{
                                        width: "100px",
                                        display: "flex",
                                        justifyContent: "end",
                                    }}
                                >
                                    <label htmlFor="fromDatePicker">
                                        <span
                                            style={{
                                                fontSize: parseInt(getdatafontsize),
                                                fontWeight: "bold",
                                            }}
                                        >
                                            Store :&nbsp;
                                        </span>{" "}
                                        <br />
                                    </label>
                                </div>
                                <div>
                                    <Select
                                        className="List-select-class "
                                        ref={storeRef}
                                        options={optionStore}
                                        onKeyDown={handleStoreEnter}
                                        id="selectedsale"
                                        onChange={(selectedOption) => {
                                            if (selectedOption && selectedOption.value) {
                                                console.log(selectedOption);
                                                const labelPart = selectedOption.label.split("-")[0];
                                                setStoreType(selectedOption.value);
                                                setStoreTypeDataValue({
                                                    value: selectedOption.value,
                                                    label: labelPart,
                                                });
                                            } else {
                                                setStoreType("");
                                                setStoreTypeDataValue("");
                                            }
                                        }}
                                        components={{ Option: DropdownOption }}
                                        // styles={customStylesStore}
                                        styles={customStylesStore()}
                                        isClearable
                                        placeholder="ALL"
                                        menuIsOpen={menuStoreIsOpen}
                                        onMenuOpen={() => setMenuStoreIsOpen(true)}
                                        onMenuClose={() => setMenuStoreIsOpen(false)}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* ------------3rd row */}
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
                            {/* Category Select  */}
                            <div
                                className="d-flex align-items-center  "
                                style={{ marginRight: "20px" }}
                            >
                                <div
                                    style={{
                                        width: "100px",
                                        display: "flex",
                                        justifyContent: "end",
                                    }}
                                >
                                    <label htmlFor="fromDatePicker">
                                        <span
                                            style={{
                                                fontSize: parseInt(getdatafontsize),
                                                fontWeight: "bold",
                                            }}
                                        >
                                            Category :&nbsp;
                                        </span>{" "}
                                        <br />
                                    </label>
                                </div>
                                <div>
                                    <Select
                                        className="List-select-class "
                                        ref={categoryRef}
                                        options={optionCategory}
                                        onKeyDown={handleCategoryEnter}
                                        id="selectedsale"
                                        onChange={(selectedOption) => {
                                            if (selectedOption && selectedOption.value) {
                                                const labelPart = selectedOption.label.split("-")[0];
                                                setCategoryType(selectedOption.value);
                                                setCategoryTypeDataValue({
                                                    value: selectedOption.value,
                                                    label: labelPart,
                                                });
                                            } else {
                                                setCategoryType("");
                                                setCategoryTypeDataValue("");
                                            }
                                        }}
                                        components={{ Option: DropdownOption }}
                                        // styles={customStylesStore}
                                        styles={customStylesStore()}
                                        isClearable
                                        placeholder="ALL"
                                        menuIsOpen={menuCategoryIsOpen}
                                        onMenuOpen={() => setMenuCategoryIsOpen(true)}
                                        onMenuClose={() => setMenuCategoryIsOpen(false)}
                                    />
                                </div>
                            </div>

                            {/* Type */}
                            <div
                                className="d-flex align-items-center"
                                style={{ marginRight: "20px" }}
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
                                                fontSize: parseInt(getdatafontsize),
                                                fontWeight: "bold",
                                            }}
                                        >
                                            Type :&nbsp;
                                        </span>
                                    </label>
                                </div>
                                <select
                                    ref={typeRef}
                                    onKeyDown={handleTypeEnter}
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
                                        width: "275px",
                                        height: "24px",
                                        // marginLeft: "15px",
                                        paddingLeft:'15px',
                                        backgroundColor: getcolor,
                                        border: `1px solid ${fontcolor}`,
                                        fontSize: parseInt(getdatafontsize),
                                        color: fontcolor,
                                    }}
                                >
                                    <option value="">ALL</option>
                                    <option value="BIL">PURCHASE</option>
                                    <option value="PRN">PURCHASE RETURN</option>
                                </select>
                            </div>
                        </div>
                    </div>

                    {/* ------------4th row */}
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
                            {/* Capacity Select */}
                            <div
                                className="d-flex align-items-center  "
                            // style={{ marginRight: "20px" }}
                            >
                                <div
                                    style={{
                                        width: "100px",
                                        display: "flex",
                                        justifyContent: "end",
                                    }}
                                >
                                    <label htmlFor="fromDatePicker">
                                        <span
                                            style={{
                                                fontSize: parseInt(getdatafontsize),
                                                fontWeight: "bold",
                                            }}
                                        >
                                            Capacity :&nbsp;
                                        </span>{" "}
                                        <br />
                                    </label>
                                </div>
                                <div>
                                    <Select
                                        className="List-select-class "
                                        ref={capacityRef}
                                        options={optionCapacity}
                                        onKeyDown={handleCapacityEnter}
                                        id="selectedsale"
                                        onChange={(selectedOption) => {
                                            if (selectedOption && selectedOption.value) {
                                                const labelPart = selectedOption.label.split("-")[0];
                                                setCapacityType(selectedOption.value);
                                                setCapacityTypeDataValue({
                                                    value: selectedOption.value,
                                                    label: labelPart,
                                                });
                                            } else {
                                                setCapacityType("");
                                                setCapacityTypeDataValue("");
                                            }
                                        }}
                                        components={{ Option: DropdownOption }}
                                        // styles={customStylesStore}
                                        styles={customStylesStore()}
                                        isClearable
                                        placeholder="ALL"
                                        menuIsOpen={menuCapacityIsOpen}
                                        onMenuOpen={() => setMenuCapacityIsOpen(true)}
                                        onMenuClose={() => setMenuCapacityIsOpen(false)}
                                    />
                                </div>
                            </div>

                            {/* Search */}
                            <div id="lastDiv" style={{ marginRight: "5px" }}>
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
                                        ref={searchRef}
                                        // onKeyDown={(e) => handleKeyPress(e, input3Ref)}
                                        onKeyDown={handleSearchEnter}
                                        type="text"
                                        id="searchsubmit"
                                        placeholder="Item description"
                                        value={searchQuery}
                                        autoComplete="off"
                                        style={{
                                            marginRight: "15px",
                                            width: "275px",
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
                                    fontSize: parseInt(getdatafontsize),
                                    // width: "100%",
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
                                        <td className="border-dark" style={firstColWidth}>
                                            Code
                                        </td>
                                        <td className="border-dark" style={secondColWidth}>
                                            Description
                                        </td>
                                        <td className="border-dark" style={thirdColWidth}>
                                            Rate
                                        </td>
                                        <td className="border-dark" style={forthColWidth}>
                                            Qnty
                                        </td>
                                        <td className="border-dark" style={fifthColWidth}>
                                            Amount
                                        </td>
                                         <td className="border-dark" style={sixthCol}>
                                            
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
                                maxHeight: "42vh",
                                // width: "100%",
                                wordBreak: "break-word",
                            }}
                        >
                            <table
                                className="myTable"
                                id="tableBody"
                                style={{
                                    fontSize: parseInt(getdatafontsize),
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
                                                <td colSpan="5" className="text-center">
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
                                                        {Array.from({ length: 5 }).map((_, colIndex) => (
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
                                                            color: item.Qnty?.[0] === "-" ? "red" : fontcolor,
                                                        }}
                                                    >
                                                        {/* <td className="text-start" style={firstColWidth}>
                                {item.code}
                              </td> */}

                                                        <td
                                                            className="text-start"
                                                            style={{ firstColWidth, cursor: 'pointer' }}
                                                            onDoubleClick={() => openReport(item.code)} // Open report on double-click
                                                            title="Double-click to open report"
                                                        >
                                                            {item.code}
                                                        </td>

                                                        <td className="text-start" style={secondColWidth}>
                                                            {item.Description}
                                                        </td>
                                                        <td className="text-end" style={thirdColWidth}>
                                                            {item.Rate}
                                                        </td>
                                                        <td className="text-end" style={forthColWidth}>
                                                            {item.Qnty}
                                                        </td>
                                                        <td className="text-end" style={fifthColWidth}>
                                                            {item["Pur Amount"]}
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
                                                    {Array.from({ length: 5 }).map((_, colIndex) => (
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
                            paddingRight: "1.4%",
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
                        >
                            <span className="mobileledger_total">{totalQnty}</span>
                        </div>
                        <div
                            style={{
                                ...fifthColWidth,
                                background: getcolor,
                                borderRight: `1px solid ${fontcolor}`,
                            }}
                        >
                            <span className="mobileledger_total">{totalAmount}</span>
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
                            onClick={fetchItemPurchaseReport}
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
