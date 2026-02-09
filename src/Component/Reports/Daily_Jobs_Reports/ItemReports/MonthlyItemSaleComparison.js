import React, { useState, useEffect, useRef, useMemo } from "react";
import { Modal, Spinner, Button } from "react-bootstrap";
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
import Chart from "react-apexcharts";
import ReactApexChart from "react-apexcharts";
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
import "./itemstyle.css";
import barlogo from "../../../../../src/image/barchart (2).png"
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
);

export default function MonthlyItemSaleComparisonReport() {
  const currentYear = new Date().getFullYear();

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

  const tabs = ["ITEM SALE", "CATEGORY SALE", "COMPANY SALE"];
  const [activeIndex, setActiveIndex] = useState(0);
  const tabRefs = useRef([]);
  const lineRef = useRef(null);

  const [saleType, setSaleType] = useState("");

  const [storeList, setStoreList] = useState([]);
  const [storeType, setStoreType] = useState("");

  const [tableData, setTableData] = useState([]);
  const [CategoryTableData, setCategoryTableData] = useState([]);
  const [CompantTableData, setCompantTableData] = useState([]);

  console.log("table data", tableData);
  console.log("Category table data", CategoryTableData);

  const input1Ref = useRef(null);
  const input2Ref = useRef(null);
  const input3Ref = useRef(null);
  const input4Refrate = useRef(null);
  const input5Ref = useRef(null);
  const input4Ref = useRef(null);
  const input6Ref = useRef(null);

  const [Companyselectdata1, setCompanyselectdata1] = useState("");
  const [Companyselectdatavalue1, setCompanyselectdatavalue1] = useState("");

  const [Companyselectdata, setCompanyselectdata] = useState("");
  const [Companyselectdatavalue, setCompanyselectdatavalue] = useState("");

  const [Capacityselectdata, setCapacityselectdata] = useState("");
  const [capacityselectdatavalue, setcapacityselectdatavalue] = useState("");

  const [GetCapacity, setGetCapacity] = useState([]);
  const [GetCompany, setGetCompany] = useState([]);

  const [Categoryselectdata, setCategoryselectdata] = useState("");
  const [categoryselectdatavalue, setcategoryselectdatavalue] = useState("");

  const [Categoryselectdata1, setCategoryselectdata1] = useState("");
  const [categoryselectdatavalue1, setcategoryselectdatavalue1] = useState("");

  const [GetCategory, setGetCategory] = useState([]);

  const [Typeselectdata, setTypeselectdata] = useState("");
  const [typeselectdatavalue, settypeselectdatavalue] = useState("");

  const [GetType, setGetType] = useState([]);

  const [sortData, setSortData] = useState("ASC");

  const [searchQuery, setSearchQuery] = useState("");
  const [CategorySearchQuery, setCategorySearchQuery] = useState("");
  const [CompanySearchQuery, setCompanySearchQuery] = useState("");

  const [transectionType, settransectionType] = useState(currentYear);
  const [CategoryYear, setCategoryYear] = useState(currentYear);
  const [CompanyYear, setCompanyYear] = useState(currentYear);

  const [transectionType2, settransectionType2] = useState("A");

  const [CategoryType, setCategoryType] = useState("A");
  const [companyType, setcompanyType] = useState("A");

  const [totaldebit, settotaldebit] = useState(0);
  const [totalcredit, settotalcredit] = useState(0);

  const [monthTotals, setMonthTotals] = useState({
    Jan: 0,
    Feb: 0,
    Mar: 0,
    Apr: 0,
    May: 0,
    Jun: 0,
    Jul: 0,
    Aug: 0,
    Sep: 0,
    Oct: 0,
    Nov: 0,
    Dec: 0,
    Total: 0,
  });

  const [CategorymonthTotals, setCategorymonthTotals] = useState({
    Jan: 0,
    Feb: 0,
    Mar: 0,
    Apr: 0,
    May: 0,
    Jun: 0,
    Jul: 0,
    Aug: 0,
    Sep: 0,
    Oct: 0,
    Nov: 0,
    Dec: 0,
    Total: 0,
  });
  const [CompanymonthTotals, setCompanymonthTotals] = useState({
    Jan: 0,
    Feb: 0,
    Mar: 0,
    Apr: 0,
    May: 0,
    Jun: 0,
    Jul: 0,
    Aug: 0,
    Sep: 0,
    Oct: 0,
    Nov: 0,
    Dec: 0,
    Total: 0,
  });

  const [categortQnty, setcategortQnty] = useState(0);
  const [categoryAmount, setcategoryAmount] = useState(0);
  const [categoryMargin, setcategoryMargin] = useState(0);

  const [CompanyQnty, setCompanyQnty] = useState(0);
  const [CompanyAmount, setCompanyAmount] = useState(0);
  const [CompanyMargin, setCompanyMargin] = useState(0);

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

  //  MODLE CODE

  const [show, setShow] = useState(false);
  const [selectedRow, setSelectedRow] = useState(null);

  const handleClose = () => setShow(false);

  const handleShow = (row) => {
    setSelectedRow(row); // store clicked row data
    setShow(true); // open modal
  };

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
    getdatafontsize,
  } = useTheme();

  useEffect(() => {
    document.documentElement.style.setProperty("--background-color", getcolor);
  }, [getcolor]);

  const comapnyname = organisation.description;

  //////////////////////// CUSTOM DATE LIMITS ////////////////////////////

  function fetchDailyStatusReport() {
    const apiUrl = apiLinks + "/MonthlyItemSaleComparison.php";

    setIsLoading(true);
    const formData = new URLSearchParams({
      FCtgCod: Categoryselectdata,
      FRepTyp: transectionType2,
      FRepYer: transectionType,
      FCmpCod: Companyselectdata,

      // code: organisation.code,
      // FLocCod: locationnumber || getLocationNumber,
      // FYerDsc: yeardescription || getyeardescription,

      code: "NASIRTRD",
      FLocCod: "001",
      FYerDsc: "2024-2024",
    }).toString();

    axios
      .post(apiUrl, formData)
      .then((response) => {
        setIsLoading(false);

        axios.post(apiUrl, formData).then((response) => {
          setIsLoading(false);

          setMonthTotals({
            Jan: Number(response.data["Total Jan"]?.replace(/,/g, "") || 0),
            Feb: Number(response.data["Total Feb"]?.replace(/,/g, "") || 0),
            Mar: Number(response.data["Total Mar"]?.replace(/,/g, "") || 0),
            Apr: Number(response.data["Total Apr"]?.replace(/,/g, "") || 0),
            May: Number(response.data["Total May"]?.replace(/,/g, "") || 0),
            Jun: Number(response.data["Total Jun"]?.replace(/,/g, "") || 0),
            Jul: Number(response.data["Total Jul"]?.replace(/,/g, "") || 0),
            Aug: Number(response.data["Total Aug"]?.replace(/,/g, "") || 0),
            Sep: Number(response.data["Total Sep"]?.replace(/,/g, "") || 0),
            Oct: Number(response.data["Total Oct"]?.replace(/,/g, "") || 0),
            Nov: Number(response.data["Total Nov"]?.replace(/,/g, "") || 0),
            Dec: Number(response.data["Total Dec"]?.replace(/,/g, "") || 0),
            Total: Number(response.data["Total"]?.replace(/,/g, "") || 0),
          });
        });

        if (response.data && Array.isArray(response.data.Detail)) {
          setTableData(response.data.Detail);
        } else {
          console.warn(
            "Response data structure is not as expected:",
            response.data.Detail,
          );
          setTableData([]);
        }
      })

      .catch((error) => {
        console.error("Error:", error);
        setIsLoading(false);
      });
  }

  function fetchCategorySaleComparisonReport() {
    const apiUrl = apiLinks + "/MonthlyCategorySaleComparison.php";

    setIsLoading(true);
    const formData = new URLSearchParams({
      FRepTyp: CategoryType,
      FRepYer: CategoryYear,
      FCmpCod: Companyselectdata1,

      // code: organisation.code,
      // FLocCod: locationnumber || getLocationNumber,
      // FYerDsc: yeardescription || getyeardescription,

      code: "NASIRTRD",
      FLocCod: "001",
    }).toString();

    axios
      .post(apiUrl, formData)
      .then((response) => {
        setIsLoading(false);

        axios.post(apiUrl, formData).then((response) => {
          setIsLoading(false);

          setCategorymonthTotals({
            Jan: Number(response.data["Total Jan"]?.replace(/,/g, "") || 0),
            Feb: Number(response.data["Total Feb"]?.replace(/,/g, "") || 0),
            Mar: Number(response.data["Total Mar"]?.replace(/,/g, "") || 0),
            Apr: Number(response.data["Total Apr"]?.replace(/,/g, "") || 0),
            May: Number(response.data["Total May"]?.replace(/,/g, "") || 0),
            Jun: Number(response.data["Total Jun"]?.replace(/,/g, "") || 0),
            Jul: Number(response.data["Total Jul"]?.replace(/,/g, "") || 0),
            Aug: Number(response.data["Total Aug"]?.replace(/,/g, "") || 0),
            Sep: Number(response.data["Total Sep"]?.replace(/,/g, "") || 0),
            Oct: Number(response.data["Total Oct"]?.replace(/,/g, "") || 0),
            Nov: Number(response.data["Total Nov"]?.replace(/,/g, "") || 0),
            Dec: Number(response.data["Total Dec"]?.replace(/,/g, "") || 0),
            Total: Number(response.data["Total"]?.replace(/,/g, "") || 0),
          });
        });

        if (response.data && Array.isArray(response.data.Detail)) {
          setCategoryTableData(response.data.Detail);
        } else {
          console.warn(
            "Response data structure is not as expected:",
            response.data.Detail,
          );
          setCategoryTableData([]);
        }
      })

      .catch((error) => {
        console.error("Error:", error);
        setIsLoading(false);
      });
  }

  function fetchCompanySaleComparisonReport() {
    const apiUrl = apiLinks + "/MonthlyCompanySaleComparison.php";

    setIsLoading(true);
    const formData = new URLSearchParams({
      FRepTyp: companyType,
      FRepYer: CompanyYear,
      FCtgCod: Categoryselectdata1,

      // code: organisation.code,
      // FLocCod: locationnumber || getLocationNumber,
      // FYerDsc: yeardescription || getyeardescription,

      code: "NASIRTRD",
      FLocCod: "001",
        FYerDsc: "2024-2024",
    }).toString();

    axios
      .post(apiUrl, formData)
      .then((response) => {
        setIsLoading(false);

        setCompanymonthTotals({
          Jan: Number(response.data["Total Jan"]?.replace(/,/g, "") || 0),
          Feb: Number(response.data["Total Feb"]?.replace(/,/g, "") || 0),
          Mar: Number(response.data["Total Mar"]?.replace(/,/g, "") || 0),
          Apr: Number(response.data["Total Apr"]?.replace(/,/g, "") || 0),
          May: Number(response.data["Total May"]?.replace(/,/g, "") || 0),
          Jun: Number(response.data["Total Jun"]?.replace(/,/g, "") || 0),
          Jul: Number(response.data["Total Jul"]?.replace(/,/g, "") || 0),
          Aug: Number(response.data["Total Aug"]?.replace(/,/g, "") || 0),
          Sep: Number(response.data["Total Sep"]?.replace(/,/g, "") || 0),
          Oct: Number(response.data["Total Oct"]?.replace(/,/g, "") || 0),
          Nov: Number(response.data["Total Nov"]?.replace(/,/g, "") || 0),
          Dec: Number(response.data["Total Dec"]?.replace(/,/g, "") || 0),
          Total: Number(response.data["Total"]?.replace(/,/g, "") || 0),
        });

        if (response.data && Array.isArray(response.data.Detail)) {
          setCompantTableData(response.data.Detail);
        } else {
          console.warn(
            "Response data structure is not as expected:",
            response.data.Detail,
          );
          setCompantTableData([]);
        }
      })

      .catch((error) => {
        console.error("Error:", error);
        setIsLoading(false);
      });
  }

  // useEffect(() => {
  //   const currentTab = tabRefs.current[activeIndex];
  //   const line = lineRef.current;

  //   if (currentTab && line) {
  //     line.style.width = `${currentTab.offsetWidth}px`;
  //     line.style.left = `${currentTab.offsetLeft}px`;
  //   }
  // }, [activeIndex]);

  useEffect(() => {
  const currentTab = tabRefs.current[activeIndex];
  const line = lineRef.current;

  if (currentTab && line) {
    line.style.width = `${currentTab.offsetWidth}px`;
    line.style.left = `${currentTab.offsetLeft}px`;
  }
}, [activeIndex, isSidebarVisible]);


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
            response.data,
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
            response.data,
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

  const customStyles1 = (hasError, width) => ({
    control: (base, state) => ({
      ...base,
      height: "24px",
      minHeight: "unset",
      width: width,
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

  const years = [currentYear, currentYear - 1, currentYear - 2];

  const activeTableData =
    activeIndex === 0
      ? tableData
      : activeIndex === 1
        ? CategoryTableData
        : activeIndex === 2
          ? CompantTableData
          : [];

  const exportPDFHandler = () => {
    // Create a new jsPDF instance with landscape orientation
    const doc = new jsPDF({ orientation: "landscape" });

    const months = [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ];
    const sourceData =
      activeIndex === 1
        ? CategoryTableData
        : activeIndex === 2
          ? CompantTableData
          : tableData;

    // Define table data (rows)
    const rows = sourceData.map((item) => [
      // item.Code ?? item.code ?? "", // Code
      // item.Description ?? "", // Description

      item.Jan ?? "0",
      item.Feb ?? "0",
      item.Mar ?? "0",
      item.Apr ?? "0",
      item.May ?? "0",
      item.Jun ?? "0",
      item.Jul ?? "0",
      item.Aug ?? "0",
      item.Sep ?? "0",
      item.Oct ?? "0",
      item.Nov ?? "0",
      item.Dec ?? "0",

      item.Total ?? "0",
    ]);

    const summaryTotals =
      activeIndex === 1
        ? CategorymonthTotals
        : activeIndex === 2
          ? CompanymonthTotals
          : monthTotals;

    rows.push([
      // Code column → total rows count
      // String(
      //   activeIndex === 1
      //     ? CategoryTableData.length.toLocaleString()
      //     : activeIndex === 2
      //       ? CompantTableData.length.toLocaleString()
      //       : tableData.length.toLocaleString()
      // ),

      // // Description column
      // "Total",

      // Month columns (VERY IMPORTANT: spread here)
      ...months.map((m) => (summaryTotals[m] ?? "0").toLocaleString()),

      // Final Total column
      summaryTotals.Total?.toLocaleString() ?? "0",
    ]);

    // Define table column headers and individual column widths

    const headers = [...months, "Total"];

    const columnWidths = [
      ...months.map(() => 22), // 12 months
      22,
    ];

    // Calculate total table width
    const totalWidth = columnWidths.reduce((acc, width) => acc + width, 0);

    // Define page height and padding
    const pageHeight = doc.internal.pageSize.height;
    const paddingTop = 15;

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
            "F",
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
          doc.rect(
            startX,
            startY + (i - startIndex + 2) * rowHeight,
            tableWidth,
            rowHeight,
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

          const monthStartIndex = 2;
          const totalIndex = months.length;

          if (cellIndex === 20) {
            const rightAlignX = startX + columnWidths[cellIndex] / 2;
            doc.text(cellValue, rightAlignX, cellY, {
              align: "center",
              baseline: "middle",
            });
          } else if (
            cellIndex <= totalIndex &&
            cellValue !== "" && // skip empty cells
            typeof cellValue !== "object" // skip merged cells
          ) {
            const rightAlignX = startX + columnWidths[cellIndex] - 2;

            doc.text(String(cellValue), rightAlignX, cellY, {
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
              startY + (i - startIndex + 3) * rowHeight,
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
    const rowsPerPage = 28; // Adjust this value based on your requirements

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
        pageNumberFontSize = 10,
      ) => {
        doc.setFontSize(titleFontSize); // Set the font size for the title
        doc.text(title, doc.internal.pageSize.width / 2, startY, {
          align: "center",
        });

        // Calculate the x-coordinate for the right corner
        const rightX = doc.internal.pageSize.width - 10;

        // Add page numbering
        doc.setFont("verdana-regular", "normal");
        doc.setFontSize(10);
        doc.text(
          `Page ${pageNumber}`,
          rightX - 5,
          doc.internal.pageSize.height - 10,
          { align: "right" },
        );
      };

      let currentPageIndex = 0;
      let startY = paddingTop; // Initialize startY
      let pageNumber = 1; // Initialize page number

      while (currentPageIndex * rowsPerPage < rows.length) {
        addTitle(comapnyname, 12, 12, pageNumber, startY, 18); // Render company title with default font size, only date, and page number
        startY += 5; // Adjust vertical position for the company title

        addTitle(
          activeIndex === 1
            ? `Monthly Category Sale Comparison Report`
            : activeIndex === 2
              ? `Monthly Company Sale Comparison Report`
              : `Monthly Item Sale Sale Comparison Report`,
          "",
          "",
          pageNumber,
          startY,
          12,
        ); // Render sale report title with decreased font size, provide the time, and page number
        startY += 5;

        const labelsX = (doc.internal.pageSize.width - totalWidth) / 2;
        const labelsY = startY + 4; // Position the labels below the titles and above the table

        let itemCategory = categoryselectdatavalue?.label || "ALL";
        let itemCompany = Companyselectdatavalue?.label || "ALL";

        let itemType =
          transectionType2 == "Q"
            ? "QUNATITY"
            : transectionType2 == "A"
              ? "AMOUNT"
              : "ALL";

        let itemYear = transectionType ? transectionType : "ALL";
        let CateCompany = Companyselectdatavalue1?.label || "ALL";
        let CateType =
          CategoryType == "Q"
            ? "QUNATITY"
            : CategoryType == "A"
              ? "AMOUNT"
              : "ALL";

        let ComCategory = categoryselectdatavalue1?.label || "ALL";
        let ComType =
          companyType == "Q"
            ? "QUNATITY"
            : companyType == "A"
              ? "AMOUNT"
              : "ALL";

        if (activeIndex === 0 || activeIndex === 1) {
          doc.setFont("verdana", "bold");
          doc.setFontSize(10);
          doc.text(`Company :`, labelsX, labelsY);
          doc.setFont("verdana-regular", "normal");
          doc.setFontSize(10);
          doc.text(
            `${activeIndex === 0 ? itemCompany : CateCompany}`,
            labelsX + 25,
            labelsY,
          );
        }

        if (activeIndex === 0) {
          doc.setFont("verdana", "bold");
          doc.setFontSize(10);
          doc.text(`Year :`, labelsX + 200, labelsY); // Draw bold label
          doc.setFont("verdana-regular", "normal");
          doc.setFontSize(10);
          doc.text(`${itemYear}`, labelsX + 215, labelsY); // Draw the value next to the label
        }

        if (activeIndex === 0 || activeIndex === 2) {
          const yOffset = activeIndex === 0 ? 4.3 : 0;

          doc.setFont("verdana", "bold");
          doc.setFontSize(10);
          doc.text(`Category :`, labelsX, labelsY + yOffset);

          doc.setFont("verdana-regular", "normal");
          doc.setFontSize(10);
          doc.text(
            `${activeIndex === 0 ? itemCategory : ComCategory}`,
            labelsX + 25,
            labelsY + yOffset,
          );
        }

        if (activeIndex === 0 || activeIndex === 1 || activeIndex === 2) {
          doc.setFont("verdana", "bold");
          doc.setFontSize(10);
          doc.text(`Type :`, labelsX + 200, labelsY + 4.3); // Draw bold label
          doc.setFont("verdana-regular", "normal");
          doc.setFontSize(10);
          doc.text(
            `${activeIndex === 0 ? itemType : activeIndex === 1 ? CateType : ComType}`,
            labelsX + 215,
            labelsY + 4.3,
          ); // Draw the value next to the label
        }

        startY += activeIndex === 1 || activeIndex === 2 ? 1 : 6; // Adjust vertical position for the labels

        addTableHeaders(
          (doc.internal.pageSize.width - totalWidth) / 2,
          activeIndex === 1 || activeIndex === 2 ? 30 : 35,
        );
        const startIndex = currentPageIndex * rowsPerPage;
        const endIndex = Math.min(startIndex + rowsPerPage, rows.length);
        startY = addTableRows(
          (doc.internal.pageSize.width - totalWidth) / 2,
          startY,
          startIndex,
          endIndex,
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
    const pdfFileNames = {
      0: "MonthlyItemSaleComparison",
      1: "MonthlyCategorySaleComparison",
      2: "MonthlyCompanySaleComparison",
    };

    doc.save(`${pdfFileNames[activeIndex]} As On ${date}.pdf`);
  };
  const handleDownloadCSV = async () => {
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet("Sheet1");

    const numColumns = 15; // Ensure this matches the actual number of columns

    const columnAlignments = [
      "left", // Code
      "left", // Description / Category / Company
      "right", // Jan
      "right", // Feb
      "right", // Mar
      "right", // Apr
      "right", // May
      "right", // Jun
      "right", // Jul
      "right", // Aug
      "right", // Sep
      "right", // Oct
      "right", // Nov
      "right", // Dec
      "right", // Total
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
      `A${companyRow.number}:${String.fromCharCode(65 + numColumns - 1)}${
        companyRow.number
      }`,
    );

    // Add Store List row
    const reportTitle =
      activeIndex === 0
        ? `Monthly Item Sale Comparison Report From ${fromInputDate} To ${toInputDate}`
        : activeIndex === 1
          ? `Monthly Category Sale Comparison Report From ${fromInputDate} To ${toInputDate}`
          : `Monthly Company Sale Comparison Report From ${fromInputDate} To ${toInputDate}`;

    const storeListRow = worksheet.addRow([reportTitle]);

    storeListRow.eachCell((cell) => {
      cell.font = fontStoreList;
      cell.alignment = { horizontal: "center" };
    });

    worksheet.mergeCells(
      `A${storeListRow.number}:${String.fromCharCode(65 + numColumns - 1)}${
        storeListRow.number
      }`,
    );

    // Add an empty row after the title section
    worksheet.addRow([]);

    let itemCategory = categoryselectdatavalue?.label || "ALL";
    let itemCompany = Companyselectdatavalue?.label || "ALL";

    let itemType =
      transectionType2 == "Q"
        ? "QUNATITY"
        : transectionType2 == "A"
          ? "AMOUNT"
          : "ALL";

    let itemYear = transectionType ? transectionType : "ALL";

    let CateCompany = Companyselectdatavalue1?.label || "ALL";
    let CateType =
      CategoryType == "Q" ? "QUNATITY" : CategoryType == "A" ? "AMOUNT" : "ALL";

    let ComCategory = categoryselectdatavalue1?.label || "ALL";
    let ComType =
      companyType == "Q" ? "QUNATITY" : companyType == "A" ? "AMOUNT" : "ALL";

    let typeAndStoreRow;
    let typeAndStoreRow2;
    let typeAndStoreRow4;

    // 🔹 Apply styling function
    const styleRow = (row) => {
      if (!row) return;
      row.eachCell((cell, colIndex) => {
        cell.font = {
          name: "CustomFont",
          size: 10,
          bold: colIndex === 1 || colIndex === 12,
        };
        cell.alignment = {
          horizontal: "left",
          vertical: "middle",
        };
      });
    };

    if (activeIndex === 0) {
      // First row
      typeAndStoreRow = worksheet.addRow([
        "Company :",
        itemCompany,
        "",
        "",
        "",
        "",
        "",
        "",
        "",
        "",
        "",
        "Year :",
        itemYear,
      ]);

      // Second row
      typeAndStoreRow2 = worksheet.addRow([
        "Category :",
        itemCategory,
        "",
        "",
        "",
        "",
        "",
        "",
        "",
        "",
        "",
        "Type :",
        itemType,
      ]);

      styleRow(typeAndStoreRow);
      styleRow(typeAndStoreRow2);
    }

    if (activeIndex === 1) {
      typeAndStoreRow4 = worksheet.addRow([
        "Company :",
        CateCompany,
        "",
        "",
        "",
        "",
        "",
        "",
        "",
        "",
        "",
        "Type :",
        CateType,
      ]);
      styleRow(typeAndStoreRow4);
    }
    if (activeIndex === 2) {
      typeAndStoreRow4 = worksheet.addRow([
        "Category :",
        ComCategory,
        "",
        "",
        "",
        "",
        "",
        "",
        "",
        "",
        "",
        "Type :",
        ComType,
      ]);
      styleRow(typeAndStoreRow4);
    }

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

    const months = [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ];

    const headers = ["Code", "Description", ...months, "Total"];

    const headerRow = worksheet.addRow(headers);

    headerRow.eachCell((cell) => {
      Object.assign(cell, headerStyle);
    });

    // Add data rows
    const dataToExport =
      activeIndex === 0
        ? tableData
        : activeIndex === 1
          ? CategoryTableData
          : CompantTableData;

    dataToExport.forEach((item) => {
      let rowValues = [
        item.Code,
        item.Description,
        // Months Jan → Dec
        ...months.map((m) => item[m] ?? "0"),
        // Total
        item.Total ?? "0",
      ];

      const row = worksheet.addRow(rowValues);

      // ✅ common styling
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
    [
      activeIndex === 1 || activeIndex === 2 ? 10 : 20,
      45,
      ...months.map(() => 12),
      12,
    ].forEach((width, index) => {
      worksheet.getColumn(index + 1).width = width;
    });

    // Select correct totals object based on activeIndex
    const summaryTotals =
      activeIndex === 0
        ? monthTotals
        : activeIndex === 1
          ? CategorymonthTotals
          : CompanymonthTotals;

    // Build total row values
    const totalRowValues = [
      // Total rows count in Code column
      activeIndex === 0
        ? formatValue(tableData.length.toLocaleString())
        : activeIndex === 1
          ? formatValue(CategoryTableData.length.toLocaleString())
          : formatValue(CompantTableData.length.toLocaleString()),

      // Label
      "Total",

      // Months Jan → Dec
      ...months.map((m) => formatValue(summaryTotals[m] ?? 0)),

      // Grand Total
      formatValue(summaryTotals.Total ?? "0"),
    ];

    // Add row to worksheet
    const totalRow = worksheet.addRow(totalRowValues);

    // Apply same styling as other rows
    totalRow.eachCell((cell, colIndex) => {
      cell.font = fontTableContent;
      cell.border = {
        top: { style: "thin" },
        left: { style: "thin" },
        bottom: { style: "thin" },
        right: { style: "thin" },
      };
      cell.alignment = {
        horizontal: colIndex <= 2 ? "left" : "right", // Code + Label left, months + total right
        vertical: "middle",
      };
    });

    // total row styling

    totalRow.eachCell((cell, colNumber) => {
      cell.font = { bold: true };
      cell.border = {
        top: { style: "double" },
        left: { style: "thin" },
        bottom: { style: "double" },
        right: { style: "thin" },
      };

      if (colNumber === 1) {
        cell.alignment = { horizontal: "center", vertical: "middle" };
      } else if (colNumber === 2) {
        cell.alignment = { horizontal: "left", vertical: "middle" };
      } else {
        // All months + total (col 3 → last) align right
        cell.alignment = { horizontal: "right", vertical: "middle" };
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
    const dateTimeRow = worksheet.addRow([
      `DATE:   ${currentdate}  TIME:   ${currentTime}`,
    ]);
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
      `A${dateTimeRow.number}:${String.fromCharCode(65 + numColumns - 1)}${dateTimeRow.number}`,
    );
    worksheet.mergeCells(
      `A${dateTimeRow1.number}:${String.fromCharCode(65 + numColumns - 1)}${dateTimeRow1.number}`,
    );

    // Generate and save the Excel file
    const buffer = await workbook.xlsx.writeBuffer();
    const blob = new Blob([buffer], {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    });

    const fileNames = {
      0: "MonthlyItemSaleComparison",
      1: "MonthlyCategorySaleComparison",
      2: "MonthlyCompanySaleComparison",
    };

    saveAs(blob, `${fileNames[activeIndex]} As On ${currentdate}.xlsx`);
  };

  const activeTotals =
    activeIndex === 0
      ? monthTotals
      : activeIndex === 1
        ? CategorymonthTotals
        : activeIndex === 2
          ? CompanymonthTotals
          : monthTotals;

  const dispatch = useDispatch();

  const tableTopColor = "#3368B5";
  const tableHeadColor = "#3368b5";
  const secondaryColor = "white";
  const btnColor = "#3368B5";
  const textColor = "white";

  const [selectedSearch, setSelectedSearch] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { data, loading, error } = useSelector((state) => state.getuser);

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

  const handleKeyPress = (e, nextInputRef) => {
    if (e.key === "Enter") {
      e.preventDefault();
      if (nextInputRef.current) {
        nextInputRef.current.focus();
      }
    }
  };

  const handleYearChange = (e) => {
    const value = e.target.value;

    if (activeIndex === 0) {
      settransectionType(value);
    } else if (activeIndex === 1) {
      setCategoryYear(value);
    } else if (activeIndex === 2) {
      setCompanyYear(value);
    }
  };

  const selectedYear =
    activeIndex === 0
      ? transectionType
      : activeIndex === 1
        ? CategoryYear
        : CompanyYear;

  const handleTransactionTypeChange2 = (event) => {
    const selectedTransactionType = event.target.value;
    settransectionType2(selectedTransactionType);
  };

  const firstColWidth = {
    width: activeIndex === 1 || activeIndex === 2 ? "55px" : "85px",
  };
  const secondColWidth = {
    width: activeIndex === 1 || activeIndex === 2 ? "105px" : "100px",
  };
  const thirdColWidth = {
    width: isSidebarVisible ? "65px" : "80px",
  };
  const forthColWidth = {
    width: isSidebarVisible ? "65px" : "80px",
  };

  const iconColwidth = {
    width: "20px",
  };

  const sixthcol = {
    width: "8px",
  };

  const resetSorting = () => {
    let resetState = {};

    // if (activeIndex === 0) {
    //   // Item tab
    //   resetState = {
    //     code: null,
    //     Description: null,
    //     Rate: null,
    //     Qnty: null,
    //     "Sale Amount": null,
    //   };
    // } else if (activeIndex === 1) {
    //   // Category tab
    //   resetState = {
    //     tctgcod: null,
    //     Category: null,
    //     Qnty: null,
    //     Amount: null,
    //     Margin: null,
    //   };
    // } else if (activeIndex === 2) {
    //   // Company tab
    //    resetState = {
    //     tcmpcod: null,
    //     Company: null,
    //     Qnty: null,
    //     Amount: null,
    //     Margin: null,
    //   };
    // }

    setColumnSortOrders(resetState);
  };

  const getIconStyle = (colKey) => {
    const order = columnSortOrders[colKey];
    return {
      transform: order === "DSC" ? "rotate(180deg)" : "rotate(0deg)",
      color: order ? "red" : "white",
      transition: "transform 0.2s ease, color 0.2s ease",
      marginLeft: "4px",
    };
  };
  const columnMap = {
    0: [
      // { label: "Code", key: "Code", width: firstColWidth },
      { label: "Description", key: "Description", width: secondColWidth },
      { label: "Total", key: "Total", width: forthColWidth },
      { label: "Jan", key: "Jan", width: thirdColWidth },
      { label: "Feb", key: "Feb", width: thirdColWidth },
      { label: "Mar", key: "Mar", width: thirdColWidth },
      { label: "Apr", key: "Apr", width: thirdColWidth },
      { label: "May", key: "May", width: thirdColWidth },
      { label: "Jun", key: "Jun", width: thirdColWidth },
      { label: "Jul", key: "Jul", width: thirdColWidth },
      { label: "Aug", key: "Aug", width: thirdColWidth },
      { label: "Sep", key: "Sep", width: thirdColWidth },
      { label: "Oct", key: "Oct", width: thirdColWidth },
      { label: "Nov", key: "Nov", width: thirdColWidth },
      { label: "Dec", key: "Dec", width: thirdColWidth },

    
    ],

    1: [
      // { label: "Code", key: "Code", width: firstColWidth },
      { label: "Description", key: "Description", width: secondColWidth },
      { label: "Total", key: "Total", width: forthColWidth },

      { label: "Jan", key: "Jan", width: thirdColWidth },
      { label: "Feb", key: "Feb", width: thirdColWidth },
      { label: "Mar", key: "Mar", width: thirdColWidth },
      { label: "Apr", key: "Apr", width: thirdColWidth },
      { label: "May", key: "May", width: thirdColWidth },
      { label: "Jun", key: "Jun", width: thirdColWidth },
      { label: "Jul", key: "Jul", width: thirdColWidth },
      { label: "Aug", key: "Aug", width: thirdColWidth },
      { label: "Sep", key: "Sep", width: thirdColWidth },
      { label: "Oct", key: "Oct", width: thirdColWidth },
      { label: "Nov", key: "Nov", width: thirdColWidth },
      { label: "Dec", key: "Dec", width: thirdColWidth },

    ],
    2: [
      // { label: "Code", key: "Code", width: firstColWidth },
      { label: "Description", key: "Description", width: secondColWidth },
      { label: "Total", key: "Total", width: forthColWidth },

      { label: "Jan", key: "Jan", width: thirdColWidth },
      { label: "Feb", key: "Feb", width: thirdColWidth },
      { label: "Mar", key: "Mar", width: thirdColWidth },
      { label: "Apr", key: "Apr", width: thirdColWidth },
      { label: "May", key: "May", width: thirdColWidth },
      { label: "Jun", key: "Jun", width: thirdColWidth },
      { label: "Jul", key: "Jul", width: thirdColWidth },
      { label: "Aug", key: "Aug", width: thirdColWidth },
      { label: "Sep", key: "Sep", width: thirdColWidth },
      { label: "Oct", key: "Oct", width: thirdColWidth },
      { label: "Nov", key: "Nov", width: thirdColWidth },
      { label: "Dec", key: "Dec", width: thirdColWidth },

    ],
  };
  const [columnSortOrders, setColumnSortOrders] = useState({});

  const handleSorting = (col) => {
    let data = [];
    let setData = () => {};

    // 🔹 pick correct data by tab
    if (activeIndex === 0) {
      data = tableData;
      setData = setTableData;
    } else if (activeIndex === 1) {
      data = CategoryTableData;
      setData = setCategoryTableData;
    } else if (activeIndex === 2) {
      data = CompantTableData;
      setData = setCompantTableData;
    }

    // safety check
    if (!data.length || !(col in data[0])) return;

    // toggle order
    const currentOrder = columnSortOrders[col];
    const newOrder = currentOrder === "ASC" ? "DSC" : "ASC";

    const sortedData = [...data].sort((a, b) => {
      let aVal = a[col] ?? "";
      let bVal = b[col] ?? "";

      aVal = aVal.toString().replace(/,/g, "").trim();
      bVal = bVal.toString().replace(/,/g, "").trim();

      const numA = Number(aVal);
      const numB = Number(bVal);

      // 🔢 number sorting
      if (!isNaN(numA) && !isNaN(numB)) {
        return newOrder === "ASC" ? numA - numB : numB - numA;
      }

      // 🔤 string sorting
      return newOrder === "ASC"
        ? aVal.localeCompare(bVal)
        : bVal.localeCompare(aVal);
    });

    // update correct table
    setData(sortedData);

    // reset other arrows
    setColumnSortOrders({ [col]: newOrder });
  };

  useHotkeys(
    "alt+s",
    () => {
      if (activeIndex === 0) {
        fetchDailyStatusReport();
        resetSorting();
      } else if (activeIndex === 1) {
        fetchCategorySaleComparisonReport();
        resetSorting();
      } else if (activeIndex === 2) {
        fetchCompanySaleComparisonReport();
        resetSorting();
      }
    },
    {
      preventDefault: true,
      enableOnFormTags: true,
    },
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
        (item) => item.tcmpcod === selectedRowId,
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
        Math.min(prevIndex + 1, tableData.length - 1),
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

  const formatValue = (value) => {
    if (!value) return "0";

    const number = Number(value.toString().replace(/,/g, ""));
    return number.toLocaleString("en-IN"); // or en-US
  };

  const companyValue =
    activeIndex === 1 ? Companyselectdatavalue1 : Companyselectdatavalue;

  const setCompanyData =
    activeIndex === 1 ? setCompanyselectdata1 : setCompanyselectdata;

  const setCompanyValue =
    activeIndex === 1 ? setCompanyselectdatavalue1 : setCompanyselectdatavalue;

  const monthLabels = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];

  const barData = selectedRow
    ? {
        labels: monthLabels,
        datasets: [
          {
            label: "Sales",
            data: monthLabels.map(
              (m) =>
                Number((selectedRow[m] ?? 0).toString().replace(/,/g, "")) || 0,
            ),
            backgroundColor: "rgba(75, 192, 192, 0.6)",
            borderColor: "rgba(75, 192, 192, 1)",
            borderWidth: 2,
          },
        ],
      }
    : {};

  const barOptions = {
    responsive: true,
    plugins: {
      legend: { display: false },
      tooltip: {
        callbacks: {
          label: function (context) {
            // format with commas
            return context.raw.toLocaleString();
          },
        },
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          callback: (value) => value.toLocaleString(),
        },
      },
    },
  };

  return (
    <>
      <Modal
        show={show}
        onHide={handleClose}
        dialogClassName="custom-modal"
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title style={{ fontSize: "18px" }}>
            {activeIndex === 0
              ? "Monthly Item Sale Comparison"
              : activeIndex === 1
                ? "Monthly Category Sale Comparison"
                : activeIndex === 2
                  ? "Monthly Company Sale Comparison"
                  : "Details"}
          </Modal.Title>
        </Modal.Header>

        <Modal.Body style={{ marginLeft: "10px", marginRight: "20px" }}>
          {selectedRow && (
            <>
              {/* If Code exists, show Code & Description above chart */}
              {selectedRow.Code && selectedRow.Description ? (
                <>
                  <p style={{ fontSize: "12px", margin: "0px" }}>
                    <span style={{ fontSize: "12px", fontWeight: "bold" }}>
                      Code :
                    </span>{" "}
                    {selectedRow.Code}
                  </p>
                  <p
                    style={{
                      fontSize: "12px",
                      marginTop: "0px",
                      marginBottom: "10px",
                    }}
                  >
                    <span style={{ fontSize: "12px", fontWeight: "bold" }}>
                      Description :
                    </span>{" "}
                    {selectedRow.Description}
                  </p>
                </>
              ) : (
                // If no Code/Description, show Total in this place
                <p
                  style={{
                    fontSize: "12px",
                    marginBottom: "20px",
                    marginTop: "2px",
                  }}
                >
                  <span style={{ fontSize: "12px", fontWeight: "bold" }}>
                    Total :
                  </span>{" "}
                  {formatValue(selectedRow.Total)}
                </p>
              )}

              {/* Chart */}
              <div style={{ height: "250px", marginLeft: "20px" }}>
                <Bar data={barData} options={barOptions} />
              </div>

              {/* If Code exists, show Total below chart */}
              {selectedRow.Code && selectedRow.Description && (
                <p
                  style={{
                    fontSize: "12px",
                    marginTop: "0px",
                    marginBottom: "10px",
                  }}
                >
                  <span style={{ fontSize: "12px", fontWeight: "bold" }}>
                    Total :
                  </span>{" "}
                  {formatValue(selectedRow.Total)}
                </p>
              )}
            </>
          )}
        </Modal.Body>
      </Modal>
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
          <NavComponent
            textdata={
              activeIndex === 0
                ? "Monthly Item Sale Comparison Report"
                : activeIndex === 1
                  ? "Monthly Category Sale Comparison Report"
                  : activeIndex === 2
                    ? "Monthly Company Sale Comparison Report"
                    : ""
            }
          />

          <div
            className="row"
            style={{ height: "20px", marginTop: "2px", marginBottom: "12px" }}
          >
            <div
              style={{
                display: "flex",
                position: "relative",
                justifyContent: "space-around",
                cursor: "pointer",
              }}
            >
              {tabs.map((tab, index) => (
                <div
                  key={tab}
                  ref={(el) => (tabRefs.current[index] = el)}
                  onClick={() => setActiveIndex(index)}
                  style={{
                    padding: "2px 12px",
                    fontWeight: activeIndex === index ? "600" : "400",
                    whiteSpace: "nowrap",
                  }}
                >
                  {tab}
                </div>
              ))}

              {/* Sliding underline */}
              <span
                ref={lineRef}
                style={{
                  position: "absolute",
                  bottom: 0,
                  height: "2px",
                  backgroundColor: fontcolor,
                  transition: "all 0.35s ease",
                }}
              />
            </div>
          </div>

          {/* //////////////// second ROW ///////////////////////// */}

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
              {/* SHOW COMPANY DROPDOWN IN BOTH ITEM & CATEGORY */}

              {(activeIndex === 0 || activeIndex === 1) && (
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
                      value={companyValue}
                      onKeyDown={(e) => handlecompanyKeypress(e, input1Ref)}
                      id="selectedsale"
                      onChange={(selectedOption) => {
                        if (selectedOption?.value) {
                          const labelPart = selectedOption.label.split("-")[1];

                          setCompanyData(selectedOption.value);
                          setCompanyValue({
                            value: selectedOption.value,
                            label: labelPart,
                          });
                        } else {
                          setCompanyData("");
                          setCompanyValue(null);
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
                        ...customStyles1(!companyValue, 270),
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
              )}

              {activeIndex === 2 && (
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
                      value={categoryselectdatavalue1}
                      onKeyDown={(e) => handlecategoryKeypress(e, input2Ref)}
                      id="selectedsale"
                      onChange={(selectedOption) => {
                        if (selectedOption && selectedOption.value) {
                          const labelPart = selectedOption.label.split("-")[1];
                          setCategoryselectdata1(selectedOption.value);
                          setcategoryselectdatavalue1({
                            value: selectedOption.value,
                            label: labelPart, // Set only the 'NGS' part of the label
                          });
                        } else {
                          setCategoryselectdata1(""); // Clear the saleType state when selectedOption is null (i.e., when the selection is cleared)
                          setcategoryselectdatavalue1("");
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
                        ...customStyles1(!Companyselectdata, 270),
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
              )}

              {/* Year Show for all tab */}
              {(activeIndex === 0 ||
                activeIndex === 1 ||
                activeIndex === 2) && (
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
                        Year :
                      </span>
                    </label>
                  </div>

                  <div
                    style={{ position: "relative", display: "inline-block" }}
                  >
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
                      value={selectedYear}
                      onChange={handleYearChange}
                      style={{
                        width: "150px",
                        height: "24px",
                        marginLeft: "5px",
                        backgroundColor: getcolor,
                        border: `1px solid ${fontcolor}`,
                        fontSize: getdatafontsize,
                        fontFamily: getfontstyle,
                        color: fontcolor,
                        paddingLeft: "12px",
                      }}
                    >
                      {years.map((year) => (
                        <option key={year} value={year}>
                          {year}
                        </option>
                      ))}
                    </select>

                    {selectedYear && selectedYear !== currentYear && (
                      <span
                        onClick={() => {
                          if (activeIndex === 0)
                            settransectionType(currentYear);
                          if (activeIndex === 1) setCategoryYear(currentYear);
                          if (activeIndex === 2) setCompanyYear(currentYear);
                        }}
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
              )}
            </div>
          </div>

          {/* show type filter for category and sale   */}
          {(activeIndex === 1 || activeIndex === 2) && (
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
                        Type :
                      </span>
                    </label>
                  </div>

                  <div
                    style={{ position: "relative", display: "inline-block" }}
                  >
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
                      value={activeIndex === 1 ? CategoryType : companyType}
                      onChange={(e) => {
                        if (activeIndex === 1) {
                          setCategoryType(e.target.value);
                        } else {
                          setcompanyType(e.target.value);
                        }
                      }}
                      style={{
                        width: "150px",
                        height: "24px",
                        marginLeft: "5px",
                        backgroundColor: getcolor,
                        border: `1px solid ${fontcolor}`,
                        fontSize: getdatafontsize,
                        fontFamily: getfontstyle,
                        color: fontcolor,
                        paddingLeft: "12px",
                      }}
                    >
                      <option value="A">AMOUNT</option>
                      <option value="Q">QUANTITY</option>
                    </select>

                    {(activeIndex === 1 ? CategoryType : companyType) !==
                      "A" && (
                      <span
                        onClick={() => {
                          if (activeIndex === 1) {
                            setCategoryType("A");
                          } else {
                            setcompanyType("A");
                          }
                        }}
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
          )}

          {/* //////////////// THIRD ROW ///////////////////////// */}

          {/* HIDE CATEGORY & TYPE FOR BOTH CATEGORY , COMPANY TAB  SHOW IN ITEM*/}
          {activeIndex !== 1 && activeIndex !== 2 && (
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
                      value={categoryselectdatavalue}
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
                        ...customStyles1(!Companyselectdata, 270),
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
                        Type :
                      </span>
                    </label>
                  </div>

                  <div
                    style={{ position: "relative", display: "inline-block" }}
                  >
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
                      value={transectionType2}
                      onChange={handleTransactionTypeChange2}
                      style={{
                        width: "150px",
                        height: "24px",
                        marginLeft: "5px",
                        backgroundColor: getcolor,
                        border: `1px solid ${fontcolor}`,
                        fontSize: getdatafontsize,
                        fontFamily: getfontstyle,
                        color: fontcolor,
                        paddingLeft: "12px",
                      }}
                    >
                      <option value="A">AMOUNT</option>
                      <option value="Q">QUANTITY</option>
                    </select>

                    {transectionType2 !== "A" && (
                      <span
                        onClick={() => settransectionType2("A")}
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
          )}

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
                  fontSize: getdatafontsize,
                  fontFamily: getfontstyle,
                  // width: "100%",
                  position: "relative",
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
                      <td
                      className="border-dark text-center "
                      style={iconColwidth}
                    >
                      {/* <i
                        className="fa fa-chart-bar"
                        style={{ fontSize: "14px", color: "white" }}
                      ></i> */}
                      <img src={barlogo} style={{cursor:'pointer', width:'14px'}}/>
                    </td>

                    {columnMap[activeIndex].map((col) => (
                      <td
                        key={col.key}
                        className="border-dark"
                        style={col.width}
                        onClick={() => handleSorting(col.key)}
                      >
                        {col.label}
                        <i
                          className="fa-solid fa-caret-down caretIconStyle"
                          style={getIconStyle(col.key)}
                        />
                      </td>
                    ))}
                  
                    <td className="border-dark" style={sixthcol}></td>
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
                        <td colSpan="15" className="text-center">
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
                            {Array.from({ length: 15 }).map((_, colIndex) => (
                              <td key={`blank-${rowIndex}-${colIndex}`}>
                                &nbsp;
                              </td>
                            ))}
                          </tr>
                        ),
                      )}
                      <tr>
                        {/* <td style={firstColWidth}></td> */}
                        <td style={iconColwidth}></td>
                        <td style={secondColWidth}></td>
                        <td style={thirdColWidth}></td>
                        <td style={thirdColWidth}></td>
                        <td style={thirdColWidth}></td>
                        <td style={thirdColWidth}></td>
                        <td style={thirdColWidth}></td>
                        <td style={thirdColWidth}></td>
                        <td style={thirdColWidth}></td>
                        <td style={thirdColWidth}></td>
                        <td style={thirdColWidth}></td>
                        <td style={thirdColWidth}></td>
                        <td style={thirdColWidth}></td>
                        <td style={thirdColWidth}></td>
                        <td style={forthColWidth}></td>
                     
                      </tr>
                    </>
                  ) : (
                    <>
                      {activeIndex === 0 &&
                        tableData.map((item, i) => {
                          totalEnteries += 1;

                          const totalValue = Number(item.Total ?? 0);
                          const isNegative = totalValue < 0;

                          return (
                            <tr
                              key={i}
                              ref={(el) => (rowRefs.current[i] = el)}
                              //   onClick={() => handleRowClick(i)}
                              onClick={() => {
                                handleRowClick(i);
                              }}
                              className={
                                selectedIndex === i ? "selected-background" : ""
                              }
                              style={{
                                backgroundColor: getcolor,
                                color: isNegative ? "red" : fontcolor,
                              }}
                            >
                              {/* Code */}
                                <td
                                onClick={() => handleShow(item)}
                                className="border-dark text-center"
                                style={iconColwidth}
                              >
                                {/* <i
                                  className="fa fa-chart-bar"
                                  style={{
                                    fontSize: "16px",
                                    color: fontcolor,
                                    cursor: "pointer",
                                  }}
                                ></i> */}
                                                      <img src={barlogo} style={{cursor:'pointer', width:'14px'}}/>

                              </td>

                              {/* Description */}
                              <td
                                className="text-start"
                                title={item.Description}
                                style={{
                                  ...secondColWidth,
                                  whiteSpace: "nowrap",
                                  overflow: "hidden",
                                  textOverflow: "ellipsis",
                                }}
                              >
                                {item.Description}
                              </td> 
                              
                              {/* Total */}
                              <td
                                className="text-end"
                                title={item.Total}
                                style={{
                                  ...forthColWidth,
                                  whiteSpace: "nowrap",
                                  overflow: "hidden",
                                  textOverflow: "ellipsis",
                                }}
                              >
                                {item.Total}
                              </td>

                              {/* Months */}
                              {[
                                "Jan",
                                "Feb",
                                "Mar",
                                "Apr",
                                "May",
                                "Jun",
                                "Jul",
                                "Aug",
                                "Sep",
                                "Oct",
                                "Nov",
                                "Dec",
                              ].map((month) => (
                                <td
                                  key={month}
                                  className="text-end"
                                  title={item[month]}
                                  style={{
                                    ...thirdColWidth,
                                    whiteSpace: "nowrap",
                                    overflow: "hidden",
                                    textOverflow: "ellipsis",
                                  }}
                                >
                                  {item[month]}
                                </td>
                              ))}                            

                            
                            </tr>
                          );
                        })}

                      {activeIndex === 1 &&
                        CategoryTableData.map((item, i) => {
                          totalEnteries += 1;

                          const totalValue = Number(item.Total ?? 0);
                          const isNegative = totalValue < 0;

                          return (
                            <tr
                              key={i}
                              ref={(el) => (rowRefs.current[i] = el)}
                              // onClick={() => handleRowClick(i)}
                              onClick={() => {
                                handleRowClick(i);
                              }}
                              className={
                                selectedIndex === i ? "selected-background" : ""
                              }
                              style={{
                                backgroundColor: getcolor,
                                color: isNegative ? "red" : fontcolor,
                              }}
                            >
                              {/* Code */}
                               <td
                                onClick={() => handleShow(item)}
                                className="border-dark text-center"
                                style={iconColwidth}
                              >
                                                                                      <img src={barlogo} style={{cursor:'pointer', width:'14px'}}/>

                              </td>

                              {/* Description */}
                              <td
                                className="text-start"
                                title={item.Description}
                                style={{
                                  ...secondColWidth,
                                  whiteSpace: "nowrap",
                                  overflow: "hidden",
                                  textOverflow: "ellipsis",
                                }}
                              >
                                {item.Description}
                              </td>
  {/* Total */}
                              <td
                                className="text-end"
                                title={item.Total}
                                style={{
                                  ...forthColWidth,
                                  whiteSpace: "nowrap",
                                  overflow: "hidden",
                                  textOverflow: "ellipsis",
                                }}
                              >
                                {item.Total}
                              </td>

                              {/* Months */}
                              {[
                                "Jan",
                                "Feb",
                                "Mar",
                                "Apr",
                                "May",
                                "Jun",
                                "Jul",
                                "Aug",
                                "Sep",
                                "Oct",
                                "Nov",
                                "Dec",
                              ].map((month) => (
                                <td
                                  key={month}
                                  className="text-end"
                                  title={item[month]}
                                  style={{
                                    ...thirdColWidth,
                                    whiteSpace: "nowrap",
                                    overflow: "hidden",
                                    textOverflow: "ellipsis",
                                  }}
                                >
                                  {item[month]}
                                </td>
                              ))}

                            
                             
                            </tr>
                          );
                        })}

                      {activeIndex === 2 &&
                        CompantTableData.map((item, i) => {
                          totalEnteries += 1;

                          const totalValue = Number(item.Total ?? 0);
                          const isNegative = totalValue < 0;

                          return (
                            <tr
                              key={i}
                              ref={(el) => (rowRefs.current[i] = el)}
                              // onClick={() => handleRowClick(i)}
                              onClick={() => {
                                handleRowClick(i);
                              }}
                              className={
                                selectedIndex === i ? "selected-background" : ""
                              }
                              style={{
                                backgroundColor: getcolor,
                                color: isNegative ? "red" : fontcolor,
                              }}
                            >
                              
                              <td
                                onClick={() => handleShow(item)}
                                className="border-dark text-center"
                                style={iconColwidth}
                              >
                              <img src={barlogo} style={{cursor:'pointer', width:'14px'}}/>

                              </td>

                              {/* Description */}
                              <td
                                className="text-start"
                                title={item.Description}
                                style={{
                                  ...secondColWidth,
                                  whiteSpace: "nowrap",
                                  overflow: "hidden",
                                  textOverflow: "ellipsis",
                                }}
                              >
                                {item.Description}
                              </td>
  {/* Total */}
                              <td
                                className="text-end"
                                title={item.Total}
                                style={{
                                  ...forthColWidth,
                                  whiteSpace: "nowrap",
                                  overflow: "hidden",
                                  textOverflow: "ellipsis",
                                }}
                              >
                                {item.Total}
                              </td>

                              {/* Months */}
                              {[
                                "Jan",
                                "Feb",
                                "Mar",
                                "Apr",
                                "May",
                                "Jun",
                                "Jul",
                                "Aug",
                                "Sep",
                                "Oct",
                                "Nov",
                                "Dec",
                              ].map((month) => (
                                <td
                                  key={month}
                                  className="text-end"
                                  title={item[month]}
                                  style={{
                                    ...thirdColWidth,
                                    whiteSpace: "nowrap",
                                    overflow: "hidden",
                                    textOverflow: "ellipsis",
                                  }}
                                >
                                  {item[month]}
                                </td>
                              ))}
                             
                            </tr>
                          );
                        })}

                      {Array.from({
                        length: Math.max(
                          0,
                          27 -
                            (activeIndex === 0
                              ? tableData.length
                              : activeIndex === 1
                                ? CategoryTableData.length
                                : activeIndex === 2
                                  ? CompantTableData.length
                                  : 0),
                        ),
                      }).map((_, rowIndex) => (
                        <tr
                          key={`blank-${rowIndex}`}
                          style={{
                            backgroundColor: getcolor,
                            color: fontcolor,
                          }}
                        >
                          {Array.from({ length: 15 }).map((_, colIndex) => (
                            <td key={`blank-${rowIndex}-${colIndex}`}>
                              &nbsp;
                            </td>
                          ))}
                        </tr>
                      ))}
                      <tr>
                        {/* <td style={firstColWidth}></td> */}
                        <td style={iconColwidth}></td>
                        <td style={secondColWidth}></td>   
                        <td style={thirdColWidth}></td>
                        <td style={thirdColWidth}></td>
                        <td style={thirdColWidth}></td>
                        <td style={thirdColWidth}></td>
                        <td style={thirdColWidth}></td>
                        <td style={thirdColWidth}></td>
                        <td style={thirdColWidth}></td>
                        <td style={thirdColWidth}></td>
                        <td style={thirdColWidth}></td>
                        <td style={thirdColWidth}></td>
                        <td style={thirdColWidth}></td>
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
              paddingRight: "8px"
            }}
          >

 <div
              style={{
                ...iconColwidth,
                background: getcolor,
                borderRight: `1px solid ${fontcolor}`,
                cursor:'pointer'
              }}
            >
              {activeTableData.length > 0 && (
                // <i
                //   onClick={() => handleShow(activeTotals)}
                //   className="fa fa-chart-bar"
                //   style={{
                //     fontSize: "16px",
                //     color: fontcolor,
                //     cursor: "pointer",
                //   }}
                // ></i>
            <img  onClick={() => handleShow(activeTotals)} src={barlogo} style={{fontSize:'14px', width:'14px'}}/>

              )}
            </div>

            <div
              style={{
                ...secondColWidth,
                background: getcolor,
                borderRight: `1px solid ${fontcolor}`,
              }}
            >
              <span className="mobileledger_total2">
                {activeIndex === 0
                  ? formatValue(tableData.length.toLocaleString())
                  : activeIndex === 1
                    ? formatValue(CategoryTableData.length.toLocaleString())
                    : activeIndex === 2
                      ? formatValue(CompantTableData.length.toLocaleString())
                      : ""}
              </span>
            </div>

            {/* Total */}
            <div
              style={{
                ...forthColWidth,
                background: getcolor,
                borderRight: `1px solid ${fontcolor}`,
              }}
            >
              <span className="mobileledger_total">
                {formatValue(activeTotals.Total)}
              </span>
            </div>
            

            {/* {[
              "Jan",
              "Feb",
              "Mar",
              "Apr",
              "May",
              "Jun",
              "Jul",
              "Aug",
              "Sep",
              "Oct",
              "Nov",
              "Dec",
            ].map((m) => (
              <div
                key={m}
                style={{
                  ...thirdColWidth,
                  background: getcolor,
                  borderRight: `1px solid ${fontcolor}`,
                }}
              >
                <span className="mobileledger_total">
                  {formatValue(activeTotals[m])}
                </span>
              </div>
            ))} */}

            {Object.keys(activeTotals)
              .filter((m) => m !== "Total") // skip Total for now
              .map((m) => (
                <div
                  key={m}
                  style={{
                    ...thirdColWidth,
                    background: getcolor,
                    borderRight: `1px solid ${fontcolor}`,
                  }}
                >
                  <span className="mobileledger_total">
                    {formatValue(activeTotals[m])}
                  </span>
                </div>
              ))}

            
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
                if (activeIndex === 0) {
                  fetchDailyStatusReport();
                  resetSorting();
                }
                if (activeIndex === 1) {
                  fetchCategorySaleComparisonReport();
                  resetSorting();
                }
                if (activeIndex === 2) {
                  fetchCompanySaleComparisonReport();
                  resetSorting();
                }
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
