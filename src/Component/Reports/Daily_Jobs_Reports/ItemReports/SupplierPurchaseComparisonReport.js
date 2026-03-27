import React, { useState, useEffect, useRef } from "react";
import { Container, Spinner, Nav } from "react-bootstrap";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import { useTheme } from "../../../../ThemeContext";
import {
  getUserData,
  getOrganisationData,
  getLocationnumber,
  getYearDescription,
} from "../../../Auth";
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

export default function SupplierPurchaseComparison() {
  const navigate = useNavigate();
  const user = getUserData();
  const organisation = getOrganisationData();

  const saleSelectRef = useRef(null);
  const input1Ref = useRef(null);
  const input2Ref = useRef(null);
  const input3Ref = useRef(null);

  const toRef = useRef(null);
  const fromRef = useRef(null);
  const companyRef = useRef(null);
  const categoryRef = useRef(null);
  const accountRef = useRef(null);
  const storeRef = useRef(null);
  const typeRef = useRef(null);
  const searchRef = useRef(null);
  const selectButtonRef = useRef(null);

  const [saleType, setSaleType] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [transectionType, settransectionType] = useState("");

  const [isAccountValid, setIsAccountValid] = useState(true);

  const [companyType, setCompanyType] = useState("");
  const [categoryType, setCategoryType] = useState("");
  const [accountType, setAccountType] = useState("");

  const [companyList, setCompanyList] = useState([]);
  const [categoryList, setCategoryList] = useState([]);
  const [AccountList, setAccountList] = useState([]);

  const [companyTypeDataValue, setCompanyTypeDataValue] = useState("");
  const [categoryTypeDataValue, setCategoryTypeDataValue] = useState("");
  const [accountTypeDataValue, setAccountTypeDataValue] = useState("");

  const [totalQnty, setTotalQnty] = useState(0);
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
    getnavbarbackgroundcolor,
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

  const handleToDateChange = (date) => {
    setSelectedToDate(date);
    settoInputDate(date ? formatDate(date) : "");
    settoCalendarOpen(false);
  };
  const handleToInputChange = (e) => {
    settoInputDate(e.target.value);
  };

  function fetchSupplierPurchaseComparison() {
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

    document.getElementById(
      "fromdatevalidation"
    ).style.border = `1px solid ${fontcolor}`;
    document.getElementById(
      "todatevalidation"
    ).style.border = `1px solid ${fontcolor}`;

    const apiMainUrl = apiLinks + "/SupplierPurchaseComparison.php";
    setIsLoading(true);
    const formMainData = new URLSearchParams({
    //   code: organisation.code,
    //   FLocCod: locationnumber || getLocationNumber,
    //   FYerDsc: yeardescription || getyeardescription,
      FIntDat: fromInputDate,
      FFnlDat: toInputDate,
      FAccCod: "21-01-0001",
    //   FAccCod: accountType,
      FCmpCod: companyType,
      FCtgCod: categoryType,
      FRepTyp: transectionType,
      FSchTxt: searchQuery,

       code: 'NASIRTRD',
      FLocCod: "001",
      FYerDsc: "2024-2024",
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
    //-------------- Account dropdown
    const apiAccountUrl = apiLinks + "/GetActiveSupplier.php";
    const formAccountData = new URLSearchParams({
      // FLocCod: getLocationNumber,
      // code: organisation.code,
      code: organisation.code,
    }).toString();
    axios
      .post(apiAccountUrl, formAccountData)
      .then((response) => {
        setAccountList(response.data);
        // console.log("Account" + response.data);
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
      // code: organisation.code,
      code: organisation.code,
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

  // Account List array
  const optionAccount = AccountList.map((item) => ({
    value: item.tacccod,
    label: item.taccdsc.trim(),
    // label: `${item.tacccod}-${item.taccdsc.trim()}`,
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

  // ------------ Account style customization
  const customStylesAccount = () => ({
    control: (base, state) => ({
      ...base,
      height: "24px",
      minHeight: "unset",
      width: 275,
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

  // ------------ Company style customization
  const customStylesCompany = () => ({
    control: (base, state) => ({
      ...base,
      height: "24px",
      minHeight: "unset",
      width: 275,
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

  // ------------ Category style customization
  const customStylesCategory = () => ({
    control: (base, state) => ({
      ...base,
      height: "24px",
      minHeight: "unset",
      width: 275,
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

  const exportPDFHandler = () => {
    const doc = new jsPDF({ orientation: "portrait" });
    const rows = tableData.map((item) => [
      item.code,
      item.Description,
      item.Qnty,
      item["Amount"],
    ]);
    rows.push(["", "Total", String(totalQnty), String(totalAmount)]);
    const headers = ["Code", "Description", "Qnty", "Amount"];
    const columnWidths = [30, 100, 15, 30];
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
          if (cellIndex === 2 || cellIndex === 3) {
            const rightAlignX = startX + columnWidths[cellIndex] - 0.5;
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
          `Supplier Purchase Comparison Report From: ${fromInputDate} To: ${toInputDate}`,
          "",
          "",
          pageNumber,
          startY,
          parseInt(getdatafontsize)
        );
        startY += 10;

        const searchWord = searchQuery ? "Search: " : "";
        const searchTerm = searchQuery ? searchQuery : "";

        const companyWord = "Company: ";
        const companyTerm = companyTypeDataValue
          ? companyTypeDataValue.label
          : "ALL";

        const accountWord = "Account: ";
        const accountTerm = accountTypeDataValue
          ? accountTypeDataValue.label
          : "ALL";

        const categoryWord = "Category: ";
        const categoryTerm = categoryTypeDataValue
          ? categoryTypeDataValue.label
          : "ALL";

        const typeWord = "Type: ";
        const typeTerm = transectionType
          ? transectionType === "BIL"
            ? "PURCHASE"
            : "PURCHASE RETURN"
          : "ALL";

        const labelXLeftWord = doc.internal.pageSize.width - totalWidth - 10;
        const labelXLeftTerm = doc.internal.pageSize.width - totalWidth + 12;

        const labelXRightWord = doc.internal.pageSize.width - totalWidth + 100;
        const labelXRightTerm = doc.internal.pageSize.width - totalWidth + 115;

        doc.setFontSize(parseInt(getdatafontsize));

        doc.setFont(getfontstyle, "bold");
        doc.text(accountWord, labelXLeftWord, startY);

        doc.setFont(getfontstyle, "normal");
        doc.text(accountTerm, labelXLeftTerm, startY);
        startY += 5;

        doc.setFont(getfontstyle, "bold");
        doc.text(companyWord, labelXLeftWord, startY);
        doc.text(typeWord, labelXRightWord, startY);

        doc.setFont(getfontstyle, "normal");
        doc.text(companyTerm, labelXLeftTerm, startY);
        doc.text(typeTerm, labelXRightTerm, startY);
        startY += 5;

        doc.setFont(getfontstyle, "bold");
        doc.text(categoryWord, labelXLeftWord, startY);
        doc.text(searchWord, labelXRightWord, startY);

        doc.setFont(getfontstyle, "normal");
        doc.text(categoryTerm, labelXLeftTerm, startY);
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
      `SupplierPurchaseComparisonReportFrom${fromInputDate}To${toInputDate}.pdf`
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

    const columnAlignments = ["left", "left", "right", "right"];
    worksheet.addRow([]);
    [
      comapnyname,
      `Supplier Purchase Comparison Report From: ${fromInputDate} to ${toInputDate}`,
    ].forEach((title, index) => {
      worksheet.addRow([title]).eachCell((cell) => {
        cell.style = {
          font: {
            bold: index === 0 ? true : false,
            size: index === 0 ? 18 : parseInt(getdatafontsize),
          },
          alignment: { horizontal: "center" },
        };
      });
      worksheet.mergeCells(
        `A${index + 2}:${String.fromCharCode(64 + numColumns)}${index + 2}`
      );
    });
    worksheet.addRow([]);
    worksheet
      .addRow([
        "Account: ",
        accountTypeDataValue ? accountTypeDataValue.label : "ALL",
      ])
      .eachCell((cell, colNumber) => {
        if (colNumber === 1) {
          cell.font = {
            bold: true,
            size: parseInt(getdatafontsize), // Apply dynamic font size if required
          };
        }
      });
    worksheet
      .addRow([
        "Company: ",
        companyTypeDataValue ? companyTypeDataValue.label : "ALL",
        "Type: ",
        transectionType
          ? transectionType === "BIL"
            ? "PURCHASE"
            : "PURCHASE RETURN"
          : "ALL",
      ])
      .eachCell((cell, colNumber) => {
        if (colNumber === 1 || colNumber === 3) {
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
        searchQuery ? "Search: " : "",
        searchQuery ? searchQuery : "",
      ])
      .eachCell((cell, colNumber) => {
        if (colNumber === 1 || colNumber === 3) {
          // Target the cell containing "Search:"
          cell.font = {
            bold: true,
            size: parseInt(getdatafontsize), // Apply dynamic font size if required
          };
        }
      });

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
    const headers = ["Code", "Description", "Qnty", "Amount"];
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
        item.Qnty,
        item["Amount"],
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
    const totalRow = worksheet.addRow(["", "Total", totalQnty, totalAmount]);
    totalRow.eachCell((cell) => {
      cell.font = { bold: true };
    });
    [15, 45, 7, 15].forEach((width, index) => {
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
      `SupplierPurchaseComparisonReportFrom${fromInputDate}To${toInputDate}.xlsx`
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
    width: "12%",
  };
  const secondColWidth = {
    width: "65%",
  };
  const thirdColWidth = {
    width: "8%",
  };
  const forthColWidth = {
    width: "15%",
  };

  useHotkeys("s", fetchSupplierPurchaseComparison);
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
    width: isSidebarVisible ? "calc(65vw - 0%)" : "65vw",
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
    maxWidth: "800px",
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

  const [menuCompanyIsOpen, setMenuCompanyIsOpen] = useState(false);
  const [menuCategoryIsOpen, setMenuCategoryIsOpen] = useState(false);
  const [menuAccountIsOpen, setMenuAccountIsOpen] = useState(false);
  const [menuStoreIsOpen, setMenuStoreIsOpen] = useState(false);

  const focusNextElement = (currentRef, nextRef) => {
    if (currentRef.current && nextRef.current) {
      currentRef.current.focus();
      nextRef.current.focus();
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
      focusNextElement(toRef, accountRef);
    }
  };

  const handleAccountEnter = (e) => {
    if (e.key === "Enter" && !menuAccountIsOpen) {
      e.preventDefault();
      focusNextElement(accountRef, companyRef);
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
      focusNextElement(categoryRef, typeRef);
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

  const handleSelectButtonClick = () => {
    if (!accountType) {
      toast.error("Account code is required");
      setIsAccountValid(false);
      return;
    }
    fetchSupplierPurchaseComparison();
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
          <NavComponent textdata="Supplier Purchase Comparison Report" />

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
                    <span style={{  
                        fontSize: getdatafontsize,
                        fontFamily: getfontstyle,
                        fontWeight: "bold",
 }}>
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
                            fontSize: "12px",
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
              <div className="d-flex align-items-center" style={{marginLeft:'80px'}}>
                <div
                  style={{
                    width: "60px",
                    display: "flex",
                    justifyContent: "end",
                  }}
                >
                  <label htmlFor="toDatePicker">
                    <span style={{ 
                         fontSize: getdatafontsize,
                        fontFamily: getfontstyle,
                        fontWeight: "bold",
}}>
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
                      fontSize: "12px",
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
                            fontSize: "12px",
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
              {/* Account Select */}
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
                    <span style={{ 
                         fontSize: getdatafontsize,
                        fontFamily: getfontstyle,
                        fontWeight: "bold",
 }}>
                      Account :&nbsp;
                    </span>{" "}
                    <br />
                  </label>
                </div>
                <div>
                  <Select
                    className="List-select-class "
                    ref={accountRef}
                    options={optionAccount}
                    onKeyDown={handleAccountEnter}
                    id="selectedsale"
                    onChange={(selectedOption) => {
                      if (selectedOption && selectedOption.value) {
                        const labelPart = selectedOption.label;
                        setAccountType(selectedOption.value);
                        setAccountTypeDataValue({
                          value: selectedOption.value,
                          label: labelPart,
                        });
                        setIsAccountValid(true);
                      } else {
                        setAccountType("");
                        setAccountTypeDataValue("");
                        setIsAccountValid(false);
                      }
                    }}
                    components={{ Option: DropdownOption }}
                    // styles={customStylesCategory}
                    styles={customStylesAccount()}
                    isClearable
                    placeholder="Search or select..."
                    menuIsOpen={menuAccountIsOpen}
                    onMenuOpen={() => setMenuAccountIsOpen(true)}
                    onMenuClose={() => setMenuAccountIsOpen(false)}
                  />
                </div>
              </div>

              <div></div>
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
                    <span style={{  fontSize: getdatafontsize,
                        fontFamily: getfontstyle,
                        fontWeight: "bold",
 }}>
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
                        const labelPart = selectedOption.label;
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
                    // styles={customStylesCategory}
                    styles={customStylesCompany()}
                    isClearable
                    placeholder="Search or select..."
                    menuIsOpen={menuCompanyIsOpen}
                    onMenuOpen={() => setMenuCompanyIsOpen(true)}
                    onMenuClose={() => setMenuCompanyIsOpen(false)}
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
                    <span style={{  fontSize: getdatafontsize,
                        fontFamily: getfontstyle,
                        fontWeight: "bold",
 }}>
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
                    backgroundColor: getcolor,
                    border: `1px solid ${fontcolor}`,
                    fontSize: "12px",
                    color: fontcolor,
                  }}
                >
                  <option value="">All</option>
                  <option value="BIL">Purchase</option>
                  <option value="PRN">Purchase Return</option>
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
                    <span style={{ fontSize: getdatafontsize,
                        fontFamily: getfontstyle,
                        fontWeight: "bold",
 }}>
                      Category :&nbsp;
                    </span>
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
                        const labelPart = selectedOption.label;
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
                    // styles={customStylesCategory}
                    styles={customStylesCategory()}
                    isClearable
                    placeholder="Search or select..."
                    menuIsOpen={menuCategoryIsOpen}
                    onMenuOpen={() => setMenuCategoryIsOpen(true)}
                    onMenuClose={() => setMenuCategoryIsOpen(false)}
                  />
                </div>
              </div>

              {/* Search */}
              <div
                className="d-flex align-items-center"
                style={{ marginRight: "20px" }}
              >
                <div>
                  <label for="searchInput">
                    <span style={{  fontSize: getdatafontsize,
                        fontFamily: getfontstyle,
                        fontWeight: "bold",
 }}>
                      Search :&nbsp;
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
                    style={{
                      width: "275px",
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
                    onChange={(e) =>
                      setSearchQuery(e.target.value.toUpperCase())
                    }
                  />
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
                    backgroundColor: getnavbarbackgroundcolor,
                  }}
                >
                  <tr
                    style={{
                      backgroundColor: getnavbarbackgroundcolor,
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
                      Qnty
                    </td>
                    <td className="border-dark" style={forthColWidth}>
                      Amount
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
                        <td colSpan="4" className="text-center">
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
                            {Array.from({ length: 4 }).map((_, colIndex) => (
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
                            <td className="text-start" style={firstColWidth}>
                              {item.code}
                            </td>
                            <td className="text-start" style={secondColWidth}>
                              {item.Description}
                            </td>
                            <td className="text-end" style={thirdColWidth}>
                              {item.Qnty}
                            </td>
                            <td className="text-end" style={forthColWidth}>
                              {item["Amount"]}
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
                          {Array.from({ length: 4 }).map((_, colIndex) => (
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
            >
              <span className="mobileledger_total">{totalQnty}</span>
            </div>
            <div
              style={{
                ...forthColWidth,
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
              onClick={handleSelectButtonClick}
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
