import React, { useState, useEffect, useRef } from "react";
import { Container, Spinner, Nav } from "react-bootstrap";
import axios from "axios";
import { Link } from "react-router-dom";
import { useTheme } from "../../../../ThemeContext";
import { getUserData, getOrganisationData } from "../../../Auth";
import NavComponent from "../../../MainComponent/Navform/navbarform";
import SingleButton from "../../../MainComponent/Button/SingleButton/SingleButton";
import Select from "react-select";
import { components } from 'react-select';
import { BsCalendar } from 'react-icons/bs';
import DatePicker from "react-datepicker";
import 'react-datepicker/dist/react-datepicker.css';
import jsPDF from "jspdf";
import ExcelJS from "exceljs";
import { saveAs } from "file-saver";
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import { useSelector, useDispatch } from "react-redux";
import { fetchGetUser } from "../../../Redux/action";
import './ledger.css';
import { color } from "@mui/system";

export default function SupplierprogressReport() {


    const saleSelectRef = useRef(null);
    const input1Ref = useRef(null);
    const input2Ref = useRef(null);
    const input3Ref = useRef(null);

    const toRef = useRef(null);
    const fromRef = useRef(null);

    const [saleType, setSaleType] = useState('');
    const [searchQuery, setSearchQuery] = useState('');
    const [transectionType, settransectionType] = useState('');
    const [supplierList, setSupplierList] = useState([])

    const [totalQnty, setTotalQnty] = useState(0);
    const [totalDebit, setTotalDebit] = useState(0);
    const [totalCredit, setTotalCredit] = useState(0);
    const [closingBalance, setClosingBalance] = useState(0);

    // state for from DatePicker
    const [selectedfromDate, setSelectedfromDate] = useState(null);
    const [fromInputDate, setfromInputDate] = useState('');
    const [fromCalendarOpen, setfromCalendarOpen] = useState(false);
    // state for To DatePicker
    const [selectedToDate, setSelectedToDate] = useState(null);
    const [toInputDate, settoInputDate] = useState('');
    const [toCalendarOpen, settoCalendarOpen] = useState(false);

    //////////////////////// CUSTOM DATE LIMITS ////////////////////////////    

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
        gettodate

    } = useTheme();

  // Assume getfromdate and gettodate are dynamic and fetched from context or state
  const fromdatevalidate = getfromdate;  // e.g., "01-01-2023"
  const todatevaliadete = gettodate;    // e.g., "31-12-2023"

  // Function to convert "DD-MM-YYYY" string to Date object
  const convertToDate = (dateString) => {
      const [day, month, year] = dateString.split('-');  // Split string into day, month, year
      return new Date(year, month - 1, day);  // Create Date object (Month is zero-indexed)
  };

  // Convert dynamic date strings to Date objects
  const GlobalfromDate = convertToDate(fromdatevalidate);  // "01-01-2023" -> Date object
  const GlobaltoDate = convertToDate(todatevaliadete);      // "31-12-2023" -> Date object

  // If you want to format the Date object back to 'DD-MM-YYYY' format (optional)
  const formatDate1 = (date) => {
      return `${String(date.getDate()).padStart(2, '0')}-${String(date.getMonth() + 1).padStart(2, '0')}-${date.getFullYear()}`;
  };

  // Optionally format the Date objects back to string if needed
  const GlobalfromDate1 = formatDate1(GlobalfromDate);  // '01-01-2023'
  const GlobaltoDate1 = formatDate1(GlobaltoDate);      // '31-12-2023'


    const comapnyname = 'ELECTRO-MART'

    //////////////////////// CUSTOM DATE LIMITS ////////////////////////////  


    // Toggle the ToDATE && FromDATE CalendarOpen state on each click
    const toggleFromCalendar = () => {
        setfromCalendarOpen(prevOpen => !prevOpen);
    };
    const toggleToCalendar = () => {
        settoCalendarOpen(prevOpen => !prevOpen);
    };
    const formatDate = (date) => {
        const day = date.getDate().toString().padStart(2, '0');
        const month = (date.getMonth() + 1).toString().padStart(2, '0');
        const year = date.getFullYear();
        return `${day}-${month}-${year}`;
    };
    const handlefromDateChange = (date) => {
        setSelectedfromDate(date);
        setfromInputDate(date ? formatDate(date) : '');
        setfromCalendarOpen(false);
    };
    const handlefromInputChange = (e) => {
        setfromInputDate(e.target.value);
    };

  
    const handlefromKeyPress = (e, inputId) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            const fromDateElement = document.getElementById('fromdatevalidation');
            const formattedInput = fromInputDate.replace(/^(\d{2})(\d{2})(\d{4})$/, '$1-$2-$3');
            const datePattern = /^(0[1-9]|[12][0-9]|3[01])-(0[1-9]|1[0-2])-\d{4}$/;

            if (formattedInput.length === 10 && datePattern.test(formattedInput)) {
                const [day, month, year] = formattedInput.split('-').map(Number);

                if (month > 12 || month === 0) {
                    alert('Please enter a valid month (MM) between 01 and 12');
                    return;
                }

                const daysInMonth = new Date(year, month, 0).getDate();
                if (day > daysInMonth || day === 0) {
                    alert(`Please enter a valid day (DD) for month ${month}`);
                    return;
                }

                const currentDate = new Date(); // Get the current date
                const enteredDate = new Date(year, month - 1, day); // Month in JavaScript Date starts from 0 (0 - January, 1 - February, ...)
                // Ensure GlobalfromDate is a Date object


                // Check if the entered date is less than GlobaltoDate
                if (GlobalfromDate && enteredDate < GlobalfromDate) {
                    showAlertMessage('someElementId', 'Date must be from', GlobalfromDate1, GlobaltoDate1, fromDateElement, 'formvalidation');
                    return;
                }
                if (GlobalfromDate && enteredDate > GlobaltoDate) {
                    showAlertMessage('someElementId', 'Date must be from', GlobalfromDate1, GlobaltoDate1, fromDateElement, 'formvalidation');
                    return;
                }

                fromDateElement.style.border = `1px solid ${fontcolor}`; // Clear the red border
                setfromInputDate(formattedInput);

                const nextInput = document.getElementById(inputId);
                if (nextInput) {
                    nextInput.focus();
                    nextInput.select();
                } else {
                    document.getElementById('submitButton').click(); // Trigger form submission
                }
            } else {
                showAlertMessage('someElementId', 'Date must be from', GlobalfromDate1, GlobaltoDate1, fromDateElement, 'formvalidation');
            }
        }
    };

    const handleToKeyPress = (e) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            const toDateElement = document.getElementById('todatevalidation');
            const formattedInput = toInputDate.replace(/^(\d{2})(\d{2})(\d{4})$/, '$1-$2-$3');
            const datePattern = /^(0[1-9]|[12][0-9]|3[01])-(0[1-9]|1[0-2])-\d{4}$/;

            if (formattedInput.length === 10 && datePattern.test(formattedInput)) {
                const [day, month, year] = formattedInput.split('-').map(Number);

                if (month > 12 || month === 0) {
                    alert('Please enter a valid month (MM) between 01 and 12');
                    return;
                }

                const daysInMonth = new Date(year, month, 0).getDate();
                if (day > daysInMonth || day === 0) {
                    alert(`Please enter a valid day (DD) for month ${month}`);
                    return;
                }

                const currentDate = new Date(); // Get the current date
                const enteredDate = new Date(year, month - 1, day); // Month in JavaScript Date starts from 0 (0 - January, 1 - February, ...)

                if (GlobaltoDate && enteredDate > GlobaltoDate) {
                    showAlertMessage('someElementId', 'Date must be from', GlobalfromDate1, GlobaltoDate1, toDateElement, 'todatevalidation');
                    return;
                }

                if (GlobaltoDate && enteredDate < GlobalfromDate) {
                    showAlertMessage('someElementId', 'Date must be from', GlobalfromDate1, GlobaltoDate1, toDateElement, 'todatevalidation');
                    return;
                }


                if (fromInputDate) {
                    const fromDate = new Date(fromInputDate.split('-').reverse().join('-'));
                    if (enteredDate <= fromDate) {
                        showAlertMessage('someElementId', 'Date must be from', GlobalfromDate1, GlobaltoDate1, toDateElement, 'todatevalidation');
                        return;
                    }
                }

                toDateElement.style.border = `1px solid ${fontcolor}`; // Add red border to the input
                settoInputDate(formattedInput);

                if (input1Ref.current) {
                    e.preventDefault();
                    console.log('Selected value:', input1Ref); // Log the select value
                    input1Ref.current.focus(); // Move focus to React Select
                }

            } else {
                showAlertMessage('someElementId', 'Date must be from', GlobalfromDate1, GlobaltoDate1, toDateElement, 'todatevalidation');
            }
        }
    };
    const handleToDateChange = (date) => {
        setSelectedToDate(date);
        settoInputDate(date ? formatDate(date) : '');
        settoCalendarOpen(false);
    };
    const handleToInputChange = (e) => {
        settoInputDate(e.target.value);
    };
    const handleSaleKeypress = (event, inputId) => {
        if (event.key === 'Enter') {
            const selectedOption = saleSelectRef.current.state.selectValue;
            if (selectedOption && selectedOption.value) {
                setSaleType(selectedOption.value); // Set the selected value only if an option is selected
            }
            const nextInput = document.getElementById(inputId);
            if (nextInput) {
                nextInput.focus(); // Move focus to the next input
                nextInput.select();
            } else {
                document.getElementById('submitButton').click(); // Trigger form submission
            }
        }
    };
    // Function to handle keypress and move focus
    const handleKeyPress = (e, nextInputRef) => {
        if (e.key === 'Enter') {
            e.preventDefault(); // Prevent form submission
            if (nextInputRef.current) {
                nextInputRef.current.focus(); // Move focus to next input
            }
        }
    };
    const showAlertMessage = (elementId, message, fromDate, toDate, fromDateElement, errortype) => {
        document.getElementById(elementId).innerHTML = `
		  <div class="custom-message">
			<svg class='alert_icon' xmlns="http://www.w3.org/2000/svg" class="bi flex-shrink-0 me-2" width="24" height="24" role="img" aria-label="Danger" fill="currentColor" viewBox="0 0 16 16">
			  <path d="M8.982 1.566a1.13 1.13 0 0 0-1.965 0L.165 13.233c-.457.778.091 1.767.982 1.767h13.706c.89 0 1.438-.99.982-1.767L8.982 1.566zm-.982 4.905a.905.905 0 1 1 1.81 0l-.146 3.342a.759.759 0 0 1-1.518 0l-.146-3.342zm.002 6.295a1.057 1.057 0 1 1 2.114 0 1.057 1.057 0 0 1-2.114 0z"/>
			</svg>
			${message} <span style="font-size: 12px; font-weight: bold;">${fromDate}</span> 
			To <span style="font-size: 12px; font-weight: bold;">${toDate}</span>
			<button class='alert_button' id="close-btn" onclick="closeAlert('${errortype}')" style="cursor: pointer;">
			  <i class="bi bi-x cross_icon_styling"></i>
			</button>
		  </div>
		`;

        // Focus the button after it is added to the DOM
        setTimeout(() => {
            const closeButton = document.getElementById('close-btn');
            if (closeButton) {
                closeButton.click();
            }
        }, 3000);

        fromDateElement.style.border = "2px solid red"; // Add red border to the input
    };
    function closeAlert(errorType) {

        const alertElement = document.getElementById('someElementId');
        alertElement.innerHTML = ''; // Clears the alert content
        if (errorType === 'saleType') {
            saleSelectRef.current.focus();
        }
        if (errorType === 'formvalidation') {
            fromRef.current.select();
        }
        if (errorType === 'todatevalidation') {
            toRef.current.select();
        }
    }
    // Bind to window
    window.closeAlert = closeAlert;

    function fetchGeneralLedger() {

        const fromDateElement = document.getElementById('fromdatevalidation');
        const toDateElement = document.getElementById('todatevalidation');

        const dateRegex = /^\d{2}-\d{2}-\d{4}$/;

        let hasError = false;
        let errorType = '';

        // Handle saleType, fromInputDate, and toInputDate errors first
        switch (true) {
            case !saleType:
                errorType = 'saleType';
                break;
            case !fromInputDate:
                errorType = 'fromDate';
                break;
            case !toInputDate:
                errorType = 'toDate';
                break;
            default:
                hasError = false;
                break;
        }

        // Handle date format validation separately
        if (!dateRegex.test(fromInputDate)) {
            errorType = 'fromDateInvalid';
        } else if (!dateRegex.test(toInputDate)) {
            errorType = 'toDateInvalid';
        } else {
            // Format and compare dates if both pass the regex validation
            const formattedFromInput = fromInputDate.replace(/^(\d{2})(\d{2})(\d{4})$/, '$1-$2-$3');
            const [fromDay, fromMonth, fromYear] = formattedFromInput.split('-').map(Number);
            const enteredFromDate = new Date(fromYear, fromMonth - 1, fromDay);

            const formattedToInput = toInputDate.replace(/^(\d{2})(\d{2})(\d{4})$/, '$1-$2-$3');
            const [toDay, toMonth, toYear] = formattedToInput.split('-').map(Number);
            const enteredToDate = new Date(toYear, toMonth - 1, toDay);

            // Now handle date range validation
            if (GlobalfromDate && enteredFromDate < GlobalfromDate) {
                errorType = 'fromDateBeforeGlobal';
            } else if (GlobaltoDate && enteredFromDate > GlobaltoDate) {
                errorType = 'fromDateAfterGlobal';
            } else if (GlobaltoDate && enteredToDate > GlobaltoDate) {
                errorType = 'toDateAfterGlobal';
            } else if (GlobaltoDate && enteredToDate < GlobalfromDate) {
                errorType = 'toDateBeforeGlobal';
            } else if (enteredToDate < enteredFromDate) {
                errorType = 'toDateBeforeFromDate';
            }
        }


        // Handle errors using a separate switch based on errorType
        switch (errorType) {
            case 'saleType':
                document.getElementById('someElementId').innerHTML = `
		  <div class="custom-message">
		  <svg class='alert_icon' xmlns="http://www.w3.org/2000/svg" class="bi flex-shrink-0 me-2" width="24" height="24" role="img" aria-label="Danger" fill="currentColor" viewBox="0 0 16 16">
					<path d="M8.982 1.566a1.13 1.13 0 0 0-1.965 0L.165 13.233c-.457.778.091 1.767.982 1.767h13.706c.89 0 1.438-.99.982-1.767L8.982 1.566zm-.982 4.905a.905.905 0 1 1 1.81 0l-.146 3.342a.759.759 0 0 1-1.518 0l-.146-3.342zm.002 6.295a1.057 1.057 0 1 1 2.114 0 1.057 1.057 0 0 1-2.114 0z"/>
				</svg>
            <p>Please Select a Account Code</p>
            <button class='alert_button'  id="close-btn" onclick="closeAlert('saleType')"  cursor: pointer;">
               
				<i class="bi bi-x  cross_icon_styling"></i>
            </button>
        </div>
		  `;
                setTimeout(() => {
                    const closeButton = document.getElementById('close-btn');
                    if (closeButton) {
                        closeButton.click();

                    }
                }, 3000);

                hasError = true;
                return customStyles1(hasError);


            case 'fromDate':
                showAlertMessage('someElementId', 'Date must be from', GlobalfromDate1, GlobaltoDate1, fromDateElement, 'formvalidation');

                return;
            case 'toDate':
                showAlertMessage('someElementId', 'Date must be from', GlobalfromDate1, GlobaltoDate1, toDateElement, 'todatevalidation');

                return;
            case 'fromDateInvalid':
                showAlertMessage('someElementId', 'Date must be from', GlobalfromDate1, GlobaltoDate1, fromDateElement, 'formvalidation');

                return;
            case 'toDateInvalid':
                showAlertMessage('someElementId', 'Date must be from', GlobalfromDate1, GlobaltoDate1, toDateElement, 'todatevalidation');

                return;
            case 'fromDateBeforeGlobal':
                showAlertMessage('someElementId', 'Date must be from', GlobalfromDate1, GlobaltoDate1, fromDateElement, 'formvalidation');

                return;
            case 'fromDateAfterGlobal':
                showAlertMessage('someElementId', 'Date must be from', GlobalfromDate1, GlobaltoDate1, fromDateElement, 'formvalidation');
                return;
            case 'toDateAfterGlobal':
                showAlertMessage('someElementId', 'Date must be from', GlobalfromDate1, GlobaltoDate1, toDateElement, 'todatevalidation');

                return;
            case 'toDateBeforeGlobal':
                showAlertMessage('someElementId', 'Date must be from', GlobalfromDate1, GlobaltoDate1, toDateElement, 'todatevalidation');

                return;
            case 'toDateBeforeFromDate':
                showAlertMessage('someElementId', 'Date must be from', GlobalfromDate1, GlobaltoDate1, toDateElement, 'todatevalidation');

                return;
            default:
                break;
        }
        ////////////////////////////////////////////


        document.getElementById('fromdatevalidation').style.border = `1px solid ${fontcolor}`;
        document.getElementById('todatevalidation').style.border = `1px solid ${fontcolor}`;

       const apiUrl = apiLinks + "/SupplierprogressReport.php";
        setIsLoading(true);
        const formData = new URLSearchParams({
            FIntDat: fromInputDate,
            FFnlDat: toInputDate,
            FTrnTyp: transectionType,
            FAccCod: saleType,
            code: organisation.name,
            FLocCod: getLocationNumber,
            FYerDsc: getyeardescription,


        }).toString();

        axios
            .post(apiUrl, formData)
            .then((response) => {
                setIsLoading(false);

                // Update total amount and quantity
                setTotalQnty(response.data["Total Qnty  "]);
                setTotalDebit(response.data["Total Debit "]);
                setTotalCredit(response.data["Total Credit"]);
                setClosingBalance(response.data["Closing Bal "]);

                // Check if response.data is an object and has keys
                if (
                    response.data &&
                    typeof response.data === "object" &&
                    Object.keys(response.data).length > 0
                ) {
                    // Extract detail objects from the response
                    const data = Object.keys(response.data)
                        .filter(
                            (key) =>
                                ![
                                    "Total Qnty",
                                    "Total Debit",
                                    "Total Credit",
                                    "Closing Bal",
                                ].includes(key)
                        )
                        .map((key) => response.data[key]?.Detail)
                        .filter((detail) => detail !== undefined);

                    // Update the table data state
                    setTableData(data);
                } else {
                    console.warn("Response data is not as expected:", response.data);
                    setTableData([]);
                }
            })
            .catch((error) => {
                console.error("Error:", error);
                setIsLoading(false);
            });
    }

    useEffect(() => {
        const hasComponentMountedPreviously = sessionStorage.getItem('componentMounted');
        // If it hasn't mounted before or on refresh, select the 'from date' input
        if (!hasComponentMountedPreviously || (saleSelectRef && saleSelectRef.current)) {
            if (saleSelectRef && saleSelectRef.current) {
                setTimeout(() => {
                    saleSelectRef.current.focus(); // Focus on the input field
                    // saleSelectRef.current.select(); // Select the text within the input field
                }, 0);
            }
            sessionStorage.setItem('componentMounted', 'true'); // Set the flag indicating mount
            // const storedData = localStorage.getItem('globaldata');

            // if (storedData) {
            //     // Parse the JSON string back to an object
            //     const parsedData = JSON.parse(storedData);
            //     setApiData(parsedData);
            // }
        }


    }, []);

    useEffect(() => {
        const currentDate = new Date();
        setSelectedToDate(currentDate);
        settoInputDate(formatDate(currentDate));

        const firstDateOfCurrentMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
        setSelectedfromDate(firstDateOfCurrentMonth);
        setfromInputDate(formatDate(firstDateOfCurrentMonth));

    }, []);

    useEffect(() => {

        const apiUrl = apiLinks + "/GetActiveSupplier.php"
        const formData = new URLSearchParams({
            FLocCod: getLocationNumber,
            code: organisation.code,
        }).toString();
        axios
            .post(apiUrl, formData)
            .then(response => {
                setSupplierList(response.data);

            })
            .catch(error => {
                console.error('Error fetching data:', error);
            });
    }, []);

    // Transforming fetched data into options array
    const options = supplierList.map(item => ({
        value: item.tacccod,
        label: `${item.tacccod}-${item.taccdsc.trim()}`
    }));

    const DropdownOption = (props) => {
        return (
            <components.Option {...props}>
                <div style={{
                    fontSize: '12px',
                    paddingBottom: '5px',
                    lineHeight: '3px',
                    color: 'black',
                    textAlign: 'start',

                }}>
                    {props.data.label}
                </div>
            </components.Option>
        );
    };
    const customStyles1 = (hasError) => ({
        control: (base, state) => ({
            ...base,
            height: '24px',
            minHeight: 'unset',
            width: 418,
            fontSize: '12px',
            backgroundColor: getcolor,
            color: fontcolor,
            borderRadius: 0,
            border: hasError ? '2px solid red' : `1px solid ${fontcolor}`, // Conditionally change border color
            transition: 'border-color 0.15s ease-in-out',
            '&:hover': {
                borderColor: state.isFocused ? base.borderColor : 'black',
            },
            padding: '0 8px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',

        }),
        dropdownIndicator: base => ({
            ...base,
            padding: 0,
            fontSize: '18px',
            display: 'flex',
            textAlign: 'center !important',
        }),
    });

    const handleTransactionTypeChange = (event) => {
        const selectedTransactionType = event.target.value;
        settransectionType(selectedTransactionType);
    };

    ///////////////////////////// DOWNLOAD PDF CODE ////////////////////////////////////////////////////////////
    const exportPDFHandler = () => {
        // Create a new jsPDF instance with landscape orientation
        const doc = new jsPDF({ orientation: "landscape" });

        // Define table data (rows)
        const rows = tableData.map((item) => [
            item.Date,
            item["Trn#"],
            item.Type,
            item.Description,
            item.Qnty,
            item.Rate,
            item.Debit,
            item.Credit,
            item.Balance,
        ]);

        // Add summary row to the table
        rows.push([
            "",
            "",
            "",
            "Total",
            String(totalQnty),
            "",
            String(totalDebit),
            String(totalCredit),
            String(closingBalance),
        ]);

        // Define table column headers and individual column widths
        const headers = [
            "Date",
            "Trn#",
            "Type",
            "Description",
            "Qnty",
            "Rate",
            "Debit",
            "Credit",
            "Balance",
        ];
        const columnWidths = [16, 11, 9, 80,10,25, 25, 25, 25];

        // Calculate total table width
        const totalWidth = columnWidths.reduce((acc, width) => acc + width, 0);

        // Define page height and padding
        const pageHeight = doc.internal.pageSize.height;
        const paddingTop = 15;

        // Set font properties for the table
        doc.setFont("verdana");
        doc.setFontSize(10);

        // Function to add table headers
        const addTableHeaders = (startX, startY) => {
            // Set font style and size for headers
            doc.setFont("bold"); // Set font to bold
            doc.setFontSize(10); // Set font size for headers

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
            doc.setFont("verdana");
            doc.setFontSize(10);
        };

        const addTableRows = (startX, startY, startIndex, endIndex) => {
            const rowHeight = 5; // Adjust this value to decrease row height
            const fontSize = 8; // Adjust this value to decrease font size
            const boldFont = "verdana"; // Bold font
            const normalFont = "verdana"; // Default font
            const tableWidth = getTotalTableWidth(); // Calculate total table width

            doc.setFontSize(fontSize);

            for (let i = startIndex; i < endIndex; i++) {
                const row = rows[i];
                const isOddRow = i % 2 !== 0; // Check if the row index is odd
                const isRedRow = row[0] && parseInt(row[0]) > 100; // Check if tctgcod is greater than 100
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

                    if (cellIndex === 4 || cellIndex === 5 || cellIndex === 6) {
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
        const rowsPerPage = 46; // Adjust this value based on your requirements

        // Function to handle pagination
        const handlePagination = () => {
            // Define the addTitle function
            const addTitle = (
                title,
                date,
                time,
                pageNumber,
                startY,
                titleFontSize = 16,
                dateTimeFontSize = 8,
                pageNumberFontSize = 8
            ) => {
                doc.setFontSize(titleFontSize); // Set the font size for the title
                doc.text(title, doc.internal.pageSize.width / 2, startY, {
                    align: "center",
                });

                // Calculate the x-coordinate for the right corner
                const rightX = doc.internal.pageSize.width - 10;

                if (date) {
                    doc.setFontSize(dateTimeFontSize); // Set the font size for the date and time
                    if (time) {
                        doc.text(date + " " + time, rightX, startY, { align: "right" });
                    } else {
                        doc.text(date, rightX - 10, startY, { align: "right" });
                    }
                }

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
                addTitle(
                    comapnyname,
                    "",
                    "",
                    pageNumber,
                    startY,
                    20,
                    10
                ); // Render company title with default font size, only date, and page number
                startY += 7; // Adjust vertical position for the company title
                // addTitle(
                // 	"38-Shadman Colony 1, Lahore Ph: 0311-1111111",
                // 	time,
                // 	"",
                // 	pageNumber,
                // 	startY,
                // 	14,
                // 	10
                // ); // Render sale report title with decreased font size, provide the time, and page number
                // startY += 7;
                addTitle(
                    `Supplier Ledger From: ${fromInputDate} To: ${toInputDate}`,
                    "",
                    "",
                    pageNumber,
                    startY,
                    14
                ); // Render sale report title with decreased font size, provide the time, and page number
                startY += 13;

                const labelsX = (doc.internal.pageSize.width - totalWidth) / 2;
                const labelsY = startY + 2; // Position the labels below the titles and above the table

                // Set font size and weight for the labels
                doc.setFontSize(14);
                doc.setFont("verdana", "bold");

                let typeText = transectionType ? transectionType : "";
                let typeItem = saleType ? saleType : "";

                doc.text(`Account: ${typeItem}`, labelsX, labelsY); // Adjust x-coordinate for From Date
                doc.text(`Type: ${typeText}`, labelsX + 160, labelsY); // Adjust x-coordinate for From Date

                // Reset font weight to normal if necessary for subsequent text
                doc.setFont("verdana", "normal");

                startY += 0; // Adjust vertical position for the labels

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

        // Save the PDF file
        doc.save("SupplierLedger.pdf");

        const pdfBlob = doc.output("blob");
        const pdfFile = new File([pdfBlob], "table_data.pdf", {
            type: "application/pdf",
        });
        // setPdfFile(pdfFile);
        // setShowMailModal(true); // Show the mail modal after downloading PDF
    };
    ///////////////////////////// DOWNLOAD PDF CODE ////////////////////////////////////////////////////////////


    ///////////////////////////// DOWNLOAD PDF EXCEL //////////////////////////////////////////////////////////
    const handleDownloadCSV = async () => {
        const workbook = new ExcelJS.Workbook();
        const worksheet = workbook.addWorksheet("Sheet1");

        const numColumns = 7; // Number of columns

        // Common styles
        const titleStyle = {
            font: { bold: true, size: 12 },
            alignment: { horizontal: "center" },
        };

        const columnAlignments = [
            "center",
            "center",
            "center",
            "left",
            "center",
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
            `Supplier Ledger From ${fromInputDate} To ${toInputDate}`,
        ].forEach((title, index) => {
            worksheet.addRow([title]).eachCell((cell) => (cell.style = titleStyle));
            worksheet.mergeCells(
                `A${index + 2}:${String.fromCharCode(64 + numColumns)}${index + 2}`
            );
        });

        worksheet.addRow([]); // Empty row for spacing

        let typeText = transectionType ? transectionType : "All";
        let typeItem = saleType ? saleType : "All";

        // Add type and store row and bold it
        const typeAndStoreRow = worksheet.addRow([
            " ",
            "",
            "",
            `Account: ${typeItem}`,
            "",
            "",
            `Type: ${typeText}`,
            "",
            "",
            "",
        ]);
        typeAndStoreRow.eachCell((cell) => {
            cell.font = { bold: true };
        });

        worksheet.addRow([]); // Empty row for spacing

        const headerStyle = {
            font: { bold: true },
            alignment: { horizontal: "center" }, // Keep headers centered
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
            "Description",
            "Qnty",
            "Rate",
            "Debit",
            "Credit",
            "Balance",
        ];
        const headerRow = worksheet.addRow(headers);
        headerRow.eachCell((cell) => {
            cell.style = { ...headerStyle, alignment: { horizontal: "center" } };
        });

        // Add data rows
        tableData.forEach((item) => {
            worksheet.addRow([
                item.Date,
                item["Trn#"],
                item.Type,
                item.Description,
                item.Qnty,
                item.Rate,
                item.Debit,
                item.Credit,
                item.Balance,
            ]);
        });

        // Add total row and bold it
        const totalRow = worksheet.addRow([
            "",
            "",
            "",
            "Total",
            totalQnty,
            "",
            totalDebit,
            totalCredit,
            closingBalance,
        ]);
        totalRow.eachCell((cell) => {
            cell.font = { bold: true };
        });

        // Set column widths
        [10, 8, 5, 50,5,12, 12, 12, 15].forEach((width, index) => {
            worksheet.getColumn(index + 1).width = width;
        });

        // Apply individual alignment and borders to each column
        worksheet.eachRow((row, rowNumber) => {
            if (rowNumber > 5) {
                // Skip title rows and the empty row
                row.eachCell((cell, colNumber) => {
                    if (rowNumber === 7) {
                        // Keep headers centered
                        cell.alignment = { horizontal: "center" };
                    } else {
                        // Apply individual alignment to body cells
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

        // Generate Excel file buffer and save
        const buffer = await workbook.xlsx.writeBuffer();
        const blob = new Blob([buffer], {
            type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        });
        saveAs(blob, "SupplierLedger.xlsx");
    };
    ///////////////////////////// DOWNLOAD PDF EXCEL ///////////////////////////////////////////////////////////

    ///////////////////////////////////////////////////////////////////////////

    const dispatch = useDispatch();
    const user = getUserData();
    const organisation = getOrganisationData();
    const tableTopColor = "#3368B5";
    const tableHeadColor = "#3368b5";
    const secondaryColor = "white";
    const btnColor = "#3368B5";
    const textColor = "white";

    const [tableData, setTableData] = useState([]);
    const [selectedSearch, setSelectedSearch] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const { data, loading, error } = useSelector((state) => state.getuser);

    // useEffect(() => {
    //     setTableData(data);
    //     dispatch(fetchGetUser(organisation && organisation.code));
    // }, [dispatch, organisation.code]);



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
        width: "5.5%",
    };
    const thirdColWidth = {
        width: "3.7%",
    };
    // const forthColWidth = {
    //     width: "8%",
    // };
    const fifthColWidth = {
        width: "37.5%",
    };
    const sixthColWidth = {
        width: "4%",
    };
    const seventhColWidth = {
        width: "10%",
    };
    const eightColWidth = {
        width: "10%",
    };
    const ninthColWidth = {
        width: "10%",
    };
    const tenthColWidth = {
        width: "10%",
    };
    // Adjust the content width based on sidebar state
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
        // height: "100vh",
        width: isSidebarVisible ? "calc(75vw - 0%)" : "75vw",
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

    
    //////////////////////////////////////////// ROW HIGHLIGHT CODE ////////////////////////////////////
    const [isFilterApplied, setIsFilterApplied] = useState(false);
    useEffect(() => {
        if (isFilterApplied || tableData.length > 0) {
            setSelectedIndex(0); // Set the selected index to the first row
            rowRefs.current[0]?.scrollIntoView({
                behavior: "smooth",
                block: "start",
            });
        } else {
            setSelectedIndex(-1); // Reset selected index if no filter applied or filtered data is empty
        }
    }, [tableData, isFilterApplied]);

    let totalEnteries = 0;
    const [selectedRowId, setSelectedRowId] = useState(null); // Track the selected row's tctgcod

    // state initialize for table row highlight
    const [selectedIndex, setSelectedIndex] = useState(-1); // Initialize selectedIndex state
    const rowRefs = useRef([]); // Array of refs for rows
    const handleRowClick = (index) => {
        setSelectedIndex(index);
        // setSelectedRowId(getFilteredTableData[index].tcmpdsc); // Save the selected row's tctgcod
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
        if (selectedIndex === -1 || e.target.id === "searchInput") return; // Return if no row is selected or target is search input
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

        // Cleanup event listener on component unmount
        return () => {
            window.removeEventListener("keydown", handleKeyDown);
        };
    }, [selectedIndex]); // Add selectedIndex as a dependency
    useEffect(() => {
        // Scroll the selected row into view
        if (selectedIndex !== -1 && rowRefs.current[selectedIndex]) {
            rowRefs.current[selectedIndex].scrollIntoView({
                behavior: "smooth",
                block: "nearest",
            });
        }
    }, [selectedIndex]); // Add selectedIndex as a dependency
    //////////////////////////////////////////// ROW HIGHLIGHT CODE //////////////////////////////////////



    return (
        <>
            <div id="someElementId"></div>
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
                    <NavComponent textdata="Supplier Progress Ledger" />
                    <div className="row " style={{ height: '20px', marginTop: '6px', marginBottom: '10px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', margin: '0px', padding: '0px' }}>

                            <div className="d-flex align-items-center  " style={{ marginRight: '1px' }}>
                                <div style={{ width: '80px', display: 'flex', justifyContent: 'end' }}>
                                    <label htmlFor="fromDatePicker"><span style={{ fontSize: '15px', fontWeight: 'bold' }}>Account :</span>  <br /></label>
                                </div>
                                <div style={{ marginLeft: '3px' }} >
                                    <Select
                                          
                                        className="List-select-class "
                                        ref={saleSelectRef}
                                        options={options}
                                        onKeyDown={(e) => handleSaleKeypress(e, "frominputid")}
                                        id="selectedsale"
                                        onChange={(selectedOption) => {
                                            if (selectedOption && selectedOption.value) {
                                                setSaleType(selectedOption.value);
                                            } else {
                                                setSaleType(""); // Clear the saleType state when selectedOption is null (i.e., when the selection is cleared)
                                            }
                                        }}
                                        components={{ Option: DropdownOption }}
                                        // styles={customStyles1}
                                        styles={customStyles1(!saleType)}
                                        isClearable
                                        placeholder="Search or select..."
                                    />

                                </div>


                            </div>

                            <div className="d-flex align-items-center" style={{ marginRight: '20px' }} >
                                <div style={{ width: '60px', display: 'flex', justifyContent: 'end' }}>
                                    <label htmlFor="fromDatePicker"><span style={{ fontSize: '15px', fontWeight: 'bold' }}>Type :</span>  <br /></label>
                                </div>
                                <select
                                    ref={input1Ref}
                                    onKeyDown={(e) => handleKeyPress(e, input2Ref)}
                                    // ref={typeSelectRef}
                                    // onKeyDown={(e) => handleTypeKeypress(e, 'submitButton')}
                                    // id="selectedtype"
                                    id="submitButton"
                                    name="type"
                                    value={transectionType}
                                    onChange={handleTransactionTypeChange}
                                    // onChange={(e) => {
                                    //   settransectionType(e.target.value);
                                    //   handleTransactionTypeChange(e.target.value);
                                    // }}
                                    style={{
                                        width: '200px',
                                        height: '24px',
                                        marginLeft: '15px',
                                        textAlign: 'center',
                                        backgroundColor: getcolor,
                                        border: `1px solid ${fontcolor}`,
                                        fontSize: '12px',
                                        textAlign: 'left',
                                        marginRight: '1px',
                                        color: fontcolor

                                    }}>

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

                    <div className="row " style={{ height: '20px', marginTop: '8px', marginBottom: "8px" }}>
                        <div style={{ width: '100%', display: 'flex', alignItems: 'center', margin: '0px', padding: '0px', justifyContent: 'space-between' }}>
                            {/* From Date */}
                            <div className='d-flex align-items-center ' >
                                <div style={{ width: '80px', display: 'flex', justifyContent: 'end' }}>
                                    <label htmlFor="fromDatePicker"><span style={{ fontSize: '15px', fontWeight: 'bold' }}>From :</span>  <br /></label>
                                </div>
                                <div
                                    id="fromdatevalidation"
                                    style={{
                                        width: '135px',
                                        border: `1px solid ${fontcolor}`,
                                        display: 'flex',
                                        alignItems: 'center',
                                        height: ' 24px',
                                        justifycontent: 'center',
                                        marginLeft: '3px',
                                        background: getcolor


                                    }}>
                                    <input
                                        style={{
                                            height: '20px',
                                            width: '90px',
                                            paddingLeft: '5px',
                                            outline: 'none',
                                            alignItems: 'center',
                                            // marginTop: '5.5px',
                                            border: 'none',
                                            fontSize: '12px',
                                            backgroundColor: getcolor,
                                            color: fontcolor


                                        }}
                                        id="frominputid"
                                        value={fromInputDate}
                                        ref={fromRef}
                                        onChange={handlefromInputChange}
                                        // onKeyPress={handlefromKeyPress}
                                        onKeyDown={(e) => handlefromKeyPress(e, 'toDatePicker')}
                                        // onKeyUp={(e) => handlefromKeyPress(e, 'toDatePicker')}
                                        autoComplete="off"
                                        placeholder="dd-mm-yyyy"
                                        aria-label="Date Input"
                                        aria-describedby="datepicker"
                                    />
                                    <DatePicker
                                        selected={selectedfromDate}
                                        onChange={handlefromDateChange}
                                        dateFormat="dd-MM-yyyy"
                                        popperPlacement="bottom"
                                        showPopperArrow={false}
                                        // showMonthDropdown
                                        // showYearDropdown
                                        open={fromCalendarOpen}
                                        dropdownMode="select"
                                        customInput={
                                            <div  >
                                                <span >
                                                    <BsCalendar
                                                        onClick={toggleFromCalendar}
                                                        style={{
                                                            cursor: 'pointer',
                                                            alignItems: 'center',
                                                            marginLeft: '18px',
                                                            // marginTop: '5px',
                                                            fontSize: '12px',
                                                            color: fontcolor,

                                                        }} />
                                                </span>
                                            </div>
                                        }
                                    />


                                </div>
                            </div>

                            {/* To Date */}
                            <div className='d-flex align-items-center' style={{marginLeft:'15px'}}>
                                <div style={{ width: '60px', display: 'flex', justifyContent: 'end' }}>
                                    <label htmlFor="fromDatePicker"><span style={{ fontSize: '15px', fontWeight: 'bold' }}>To :</span>  <br /></label>
                                </div>
                                <div
                                    id="todatevalidation"
                                    style={{
                                        width: '135px',
                                        border: `1px solid ${fontcolor}`,
                                        display: 'flex',
                                        alignItems: 'center',
                                        height: ' 24px',
                                        justifycontent: 'center',
                                        marginLeft: '15px',
                                        background: getcolor

                                    }} >
                                    <input
                                        ref={toRef}
                                        style={{
                                            height: '20px',
                                            width: '90px',
                                            paddingLeft: '5px',
                                            outline: 'none',
                                            alignItems: 'center',
                                            // marginTop: '5.5px',
                                            border: 'none',
                                            fontSize: '12px',
                                            backgroundColor: getcolor,
                                            color: fontcolor

                                        }} value={toInputDate}
                                        onChange={handleToInputChange}
                                        // onKeyPress={handleToKeyPress}
                                        onKeyDown={(e) => handleToKeyPress(e, 'submitButton')}
                                        // onKeyDown={(e) => handleKeyPressBoth(e, 'submitButton')}
                                        id="toDatePicker"
                                        autoComplete="off"
                                        placeholder="dd-mm-yyyy"
                                        aria-label="To Date Input"
                                        aria-describedby="todatepicker"
                                    />
                                    <DatePicker

                                        selected={selectedToDate}
                                        onChange={handleToDateChange}
                                        dateFormat="dd-MM-yyyy"
                                        popperPlacement="bottom"
                                        showPopperArrow={false}
                                        // showMonthDropdown
                                        // showYearDropdown
                                        open={toCalendarOpen}
                                        dropdownMode="select"
                                        customInput={
                                            <div>
                                                <span>
                                                    <BsCalendar
                                                        onClick={toggleToCalendar}
                                                        style={{
                                                            cursor: 'pointer',
                                                            alignItems: 'center',
                                                            marginLeft: '18px',
                                                            // marginTop: '5px',
                                                            fontSize: '12px'
                                                        }} />
                                                </span>
                                            </div>
                                        }
                                    />
                                </div>
                            </div>

                            {/* Search Item  */}
                            <div id="lastDiv" style={{ marginRight: '1px' }}>
                                <label for="searchInput" style={{ marginRight: '15px' }}><span style={{ fontSize: '15px', fontWeight: 'bold' }}>Search :</span> </label>
                                <input
                                    ref={input2Ref}
                                    onKeyDown={(e) => handleKeyPress(e, input3Ref)}
                                    // onKeyDown={(e) => handlesearchKeypress(e, 'searchsubmit')}
                                    type="text"
                                    id="searchsubmit"
                                    placeholder="Item description"
                                    value={searchQuery}
                                    style={{
                                        marginRight: '20px',
                                        width: '200px',
                                        height: '24px',
                                        fontSize: '12px',
                                        color: fontcolor,
                                        backgroundColor: getcolor,
                                        border: `1px solid ${fontcolor}`,
                                        outline: 'none',
                                        paddingLeft: '10px'
                                    }}
                                    onChange={(e) => setSearchQuery(e.target.value)}
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
                                            Description
                                        </td>
                                        <td className="border-dark" style={sixthColWidth}>
                                            Qnty
                                        </td>
                                        <td className="border-dark" style={seventhColWidth}>
                                            Rate
                                        </td>
                                        <td className="border-dark" style={eightColWidth}>
                                            Debit
                                        </td>
                                        <td className="border-dark" style={ninthColWidth}>
                                            Credit
                                        </td>
                                        <td className="border-dark" style={tenthColWidth}>
                                            Balance
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
                                    fontSize: "12px",
                                    width: "100%",
                                    position: "relative",
                                }}
                            >
                                <tbody id="tablebody" >
                                    {isLoading ? (
                                        <>
                                            <tr
                                                style={{
                                                    backgroundColor: getcolor
                                                }}
                                            >
                                                <td colSpan="9" className="text-center">
                                                    <Spinner animation="border" variant="primary" />
                                                </td>
                                            </tr>
                                            {Array.from({ length: Math.max(0, 30 - 5) }).map(
                                                (_, rowIndex) => (
                                                    <tr key={`blank-${rowIndex}`}
                                                        style={{
                                                            backgroundColor: getcolor,
                                                            color: fontcolor,
                                                        }}
                                                    >
                                                        {Array.from({ length: 9 }).map((_, colIndex) => (
                                                            <td key={`blank-${rowIndex}-${colIndex}`}
                                                            >
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
                                            </tr>
                                        </>
                                    ) : (
                                        <>
                                            {tableData.map((item, i) => {
                                              totalEnteries += 1;
                                                return (
                                                    <tr
                                                        key={`${i}-${selectedIndex}`}
                                                        ref={(el) => (rowRefs.current[i] = el)} // Assign ref to each row
                                                        onClick={() => handleRowClick(i)}
                                                        className={selectedIndex === i ? "selected-background" : ""}
                                                        style={{backgroundColor:'#021A33'}}
                                                    >
                                                        <td className="text-center" style={firstColWidth}>
                                                            {item.Date}
                                                        </td>
                                                        <td className="text-center" style={secondColWidth}>
                                                            {item["Trn#"]}
                                                        </td>
                                                        <td className="text-center" style={thirdColWidth}>
                                                            {item.Type}
                                                        </td>
                                                        {/* <td className="text-center" style={forthColWidth}>
                                                            {item["Item Code"]}
                                                        </td> */}
                                                        <td className="text-start" style={fifthColWidth}>
                                                            {item.Description}
                                                        </td>
                                                        <td className="text-center" style={sixthColWidth}>
                                                            {item.Qnty}
                                                        </td>
                                                        <td className="text-end" style={seventhColWidth}>
                                                            {item.Rate}
                                                        </td>                                                        
                                                        <td className="text-end" style={eightColWidth}>
                                                            {item.Debit}
                                                        </td>
                                                        <td className="text-end" style={ninthColWidth}>
                                                            {item.Credit}
                                                        </td>
                                                        <td className="text-end" style={tenthColWidth}>
                                                            {item.Balance}
                                                        </td>
                                                    </tr>
                                                );
                                            })}
                                            {Array.from({
                                                length: Math.max(0, 27 - tableData.length),
                                            }).map((_, rowIndex) => (
                                                <tr key={`blank-${rowIndex}`}
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
                                                {/* <td style={forthColWidth}></td> */}
                                                <td style={fifthColWidth}></td>
                                                <td style={sixthColWidth}></td>
                                                <td style={seventhColWidth}></td>
                                                <td style={eightColWidth}></td>
                                                <td style={ninthColWidth}></td>
                                                <td style={tenthColWidth}></td>
                                            </tr>
                                        </>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>

                    <div style={{  borderBottom: `1px solid ${fontcolor}`, borderTop: `1px solid ${fontcolor}`, height: '24px', display: 'flex' }}>

                        <div style={{ ...firstColWidth, background: getcolor, borderRight: `1px solid ${fontcolor}` }}></div>
                        <div style={{ ...secondColWidth, background: getcolor, borderRight: `1px solid ${fontcolor}` }}></div>
                        <div style={{ ...thirdColWidth, background: getcolor, borderRight: `1px solid ${fontcolor}` }}></div>
                        {/* <div style={{ ...forthColWidth, background: getcolor, borderRight: `1px solid ${fontcolor}` }}></div> */}
                        <div style={{ ...fifthColWidth, background: getcolor, borderRight: `1px solid ${fontcolor}` }}></div>
                        <div style={{ ...sixthColWidth, background: getcolor, borderRight: `1px solid ${fontcolor}` }}>
                        <span className="mobileledger_total">{totalQnty}</span>
                        </div>
                        <div style={{ ...seventhColWidth, background: getcolor, borderRight: `1px solid ${fontcolor}` }}></div>
                                                
                        <div style={{ ...eightColWidth, background: getcolor, borderRight: `1px solid ${fontcolor}` }}>
                            <span className="mobileledger_total">{totalDebit}</span>
                        </div>
                        <div style={{ ...ninthColWidth, background: getcolor, borderRight: `1px solid ${fontcolor}` }}>
                            <span className="mobileledger_total">{totalCredit}</span>
                        </div>
                        <div style={{ ...tenthColWidth, background: getcolor, borderRight: `1px solid ${fontcolor}` }}>
                            <span className="mobileledger_total">{closingBalance}</span>
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
                        />
                        <SingleButton
                            text="PDF"
                            onClick={exportPDFHandler}
                            style={{ backgroundColor: "#186DB7", width: "120px" }}
                        />
                        <SingleButton
                            text="EXCEL"
                            onClick={handleDownloadCSV}
                            style={{ backgroundColor: "#186DB7", width: "120px" }}
                        />
                        <SingleButton
                            id="searchsubmit"
                            text="SELECT"
                            ref={input3Ref}
                            onClick={fetchGeneralLedger}
                            style={{ backgroundColor: "#186DB7", width: "120px" }}
                        />
                          {/* <button className="reportBtn" id="searchsubmit" ref={input3Ref}  onClick={fetchGeneralLedger}>
                    Select
                </button>{" "} */}

                    </div>
                </div>
            </div>
        </>
    );
}




