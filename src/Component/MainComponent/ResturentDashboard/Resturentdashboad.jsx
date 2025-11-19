import React, { useEffect, useState } from "react";
import './Dashboard.css'
import "react-datepicker/dist/react-datepicker.css";
import axios from "axios";
import Dounut from "./Chart/DountChart";
import BarChart from "./Chart/Barchart";
import MonthwiseChart from "./Chart/MonthwiseGrapgh";
import Dount from "./Chart/DountChart";
import { Spinner } from "react-bootstrap";
import DatePicker from "react-datepicker";
import { BsCalendar } from "react-icons/bs";
import Chart from "react-apexcharts";
import { TodayOutlined, Tune } from "@mui/icons-material";
import { getOrganisationData, getUserData, getYearDescription, getLocationnumber } from "../../Auth";
import { useTheme } from "../../../ThemeContext";
import { Sparklines, SparklinesBars, SparklinesLine } from "react-sparklines";
import { faToggleOff } from "@fortawesome/free-solid-svg-icons";
import Donut1 from "./Chart/SmallChart";
import Button from 'react-bootstrap/Button';
import { Dashboard } from "@mui/icons-material";
import 'bootstrap/dist/css/bootstrap.min.css';



export default function ResturentDashboard() {
  const [isLoading, setIsLoading] = useState(false);
  const [Resturentdata, setResturentdata] = useState([]);
  const [TodaySaledata, setTodaySaledata] = useState([]);
  const [MonthSaledata, setMonthSaledata] = useState([]);
  const [showSale, setShowSale] = useState(false);
  const [switchgraph, setswitchgraph] = useState(false);
  const [switchgraph2, setswitchgraph2] = useState(false);
  const [monthlysale, setmonthlysale] = useState(false);
  const [MonthlysaleGraph, setMonthlysaleGraph] = useState(false);
  const [DaymonthGraph, setDaymonthGraph] = useState(false);

  const [showTodayCategory, setShowTodayCategory] = useState(false)
  const [showMonthlyCategory, setShowMonthlyCategory] = useState(true); // true = Monthly Category, false = Monthly Sale

  const [todaysaleQnty, settodaysaleQnty] = useState(false);
  const [todaysaleQntyGraph, settodaysaleQntyGraph] = useState(false);
  const [saletodaygrph, setsaletodaygrph] = useState(false);
  const [showSalemonthly, setshowSalemonthly] = useState(false);



  const organisation = getOrganisationData();
  const user = getUserData();
  const yeardescription = getYearDescription();
  const locationnumber = getLocationnumber();
  const {
    isSidebarVisible,
    getcolor,
    fontcolor,
    apiLinks,
    getLocationNumber,
    getyeardescription,
    getfontstyle,
    getdatafontsize,
  } = useTheme();


  useEffect(() => {
    const apiUrl = apiLinks + "/ResDashboard.php";
    setIsLoading(true);

    const formData = new URLSearchParams({
      code: organisation.code,
      FLocCod: locationnumber || getLocationNumber,
      FYerDsc: yeardescription || getyeardescription,
    }).toString();

    axios
      .post(apiUrl, formData)
      .then((response) => {
        // Check if response.data exists and has the expected structure
        if (response.data && typeof response.data === 'object') {
          setResturentdata(response.data);
        } else {
          console.warn(
            "Response data structure is not as expected:",
            response.data
          );
          setResturentdata({}); // Set empty object instead of array
        }
      })
      .catch((error) => {
        console.error("Error:", error);
        setResturentdata({}); // Set empty object on error too
      })
      .finally(() => {
        setIsLoading(false); // Make sure to set loading to false
      });
  }, []);

  useEffect(() => {
    const apiUrl = apiLinks + "/ItemSale.php";
    setIsLoading(true);

     const now = new Date();

    const firstDay = new Date(now.getFullYear(), now.getMonth(), 1);

    const lastDay = new Date(now.getFullYear(), now.getMonth() + 1, 0);

    const formatDate = (date) => {
      const day = String(date.getDate()).padStart(2, "0");
      const month = String(date.getMonth() + 1).padStart(2, "0");
      const year = date.getFullYear();
      return `${day}-${month}-${year}`;
    };

    const FIntDat = formatDate(firstDay);
    const FFnlDat = formatDate(lastDay);

    const formData = new URLSearchParams({
      code: organisation.code,
      FLocCod: locationnumber || getLocationNumber,
      FYerDsc: yeardescription || getyeardescription,
      FIntDat: FIntDat,
      FFnlDat: FFnlDat
    }).toString();

    axios
      .post(apiUrl, formData)
      .then((response) => {
        // Check if response.data exists and has the expected structure
        if (response.data && typeof response.data === 'object') {
          setTodaySaledata(response.data.Report);
        } else {
          console.warn(
            "Response data structure is not as expected:",
            response.data
          );
          setTodaySaledata({}); // Set empty object instead of array
        }
      })
      .catch((error) => {
        console.error("Error:", error);
        setTodaySaledata({}); // Set empty object on error too
      })
      .finally(() => {
        setIsLoading(false); // Make sure to set loading to false
      });
  }, []);

  useEffect(() => {
    const apiUrl = apiLinks + "/ItemSale.php";
    setIsLoading(true);

    const now = new Date();

    const firstDay = new Date(now.getFullYear(), now.getMonth(), 1);

    const lastDay = new Date(now.getFullYear(), now.getMonth() + 1, 0);

    const formatDate = (date) => {
      const day = String(date.getDate()).padStart(2, "0");
      const month = String(date.getMonth() + 1).padStart(2, "0");
      const year = date.getFullYear();
      return `${day}-${month}-${year}`;
    };

    const FIntDat = formatDate(firstDay);
    const FFnlDat = formatDate(lastDay);



    const formData = new URLSearchParams({
      code: organisation.code,
      FLocCod: locationnumber || getLocationNumber,
      FYerDsc: yeardescription || getyeardescription,
      FIntDat, FIntDat,
      FFnlDat, FFnlDat
    }).toString();

    axios
      .post(apiUrl, formData)
      .then((response) => {
        if (response.data && typeof response.data === "object") {
          setTodaySaledata(response.data.Report);
        } else {
          console.warn("Response data structure is not as expected:", response.data);
          setTodaySaledata({});
        }
      })
      .catch((error) => {
        console.error("Error:", error);
        setTodaySaledata({});
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, []);



  const contentStyle = {
    backgroundColor: '#efeff0ff',
    width: isSidebarVisible ? "calc(90vw - 0%)" : "90vw",
    position: "relative",
    top: "42%",
    left: isSidebarVisible ? "50%" : "50%",
    transform: "translate(-50%, -50%)",
    transition: isSidebarVisible
      ? "left 3s ease-in-out, width 2s ease-in-out"
      : "left 3s ease-in-out, width 2s ease-in-out",
    display: "flex",
    justifyContent: "start",
    alignItems: "start",
    overflowX: "hidden",
    overflowY: "scroll",
    wordBreak: "break-word",
    textAlign: "center",
    maxWidth: "90vw",
    fontSize: "15px",
    fontStyle: "normal",
    fontWeight: "400",
    lineHeight: "23px",
    fontFamily: '"Poppins", sans-serif',
    padding: "0px",
    Margin: "0px",
  };


  // const firstColWidth = {
  //   width: "26%",
  // };
  // const secondColWidth = {
  //   width: "12%",
  // };
  // const thirdColWidth = {
  //   width: "22%",
  // };
  // const forthColWidth = {
  //   width: "18%",
  // };



  // ✅ helper to convert month num → short name
  const getMonthName = (num) => {
    const months = [
      "Jan", "Feb", "Mar", "Apr", "May", "Jun",
      "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
    ];
    return months[parseInt(num) - 1] || num;
  };

  // ✅ Step 1: Define all 12 months
  const allMonths = [
    { month: "Jan", value: 0 },
    { month: "Feb", value: 0 },
    { month: "Mar", value: 0 },
    { month: "Apr", value: 0 },
    { month: "May", value: 0 },
    { month: "Jun", value: 0 },
    { month: "Jul", value: 0 },
    { month: "Aug", value: 0 },
    { month: "Sep", value: 0 },
    { month: "Oct", value: 0 },
    { month: "Nov", value: 0 },
    { month: "Dec", value: 0 },
  ];

  // ✅ Step 2: Transform API data
  const apiData = (Resturentdata.MonthWiseGraph || []).map((item) => ({
    month: getMonthName(item.Month),
    value: parseFloat(item.Sale),
  }));

  // ✅ Step 3: Merge API data with all 12 months
  const barchartData = allMonths.map((m) => {
    const found = apiData.find((d) => d.month === m.month);
    return found ? found : m;
  });

  // ✅ max value for scaling bars
  const monthwisemaxValue = Math.max(...barchartData.map((item) => item.value), 1);

  /////////////////////////////////////////////////////
  const [chartData, setChartData] = useState([]);
  const [activeBar, setActiveBar] = useState(null);

  // Generate sample data for the chart
  useEffect(() => {
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const data = months.map(month => ({
      month,
      value: Math.floor(Math.random() * 100) + 20, // Random value between 20-120
    }));
    setChartData(data);
  }, []);



  const palette = [
    "#FF4560", "#008FFB", "#00E396", "#FEB019",
    "#775DD0", "#546E7A", "#26A69A", "#D10CE8",
    "#9C27B0", "#FF9800", "#4CAF50", "#3F51B5"
  ];

  // ✅ Function to capitalize first letter and make others lowercase
  const formatCategoryName2 = (category) => {
    if (!category || category === "N/A") return "N/A";
    return category.charAt(0).toUpperCase() + category.slice(1).toLowerCase();
  };

  // ✅ Store category → color mapping
  const categoryColors = {};

  // ✅ Function to assign consistent colors
  const getCategoryColor = (category) => {
    const formattedCategory = (formatCategoryName2(category));
    const key = (formattedCategory || "N/A").toUpperCase().trim();
    if (!categoryColors[key]) {
      const index = Object.keys(categoryColors).length % palette.length;
      categoryColors[key] = palette[index];
    }
    return categoryColors[key];
  };

  // ---------------- BAR DATA ----------------
  // ✅ Single dataset source depending on showSale
  const barRawData = showSale
    ? Resturentdata?.ToDayCatgSaleAmountWise
    : Resturentdata?.ToDayCatgSaleQntyWise;

  const barData =
    barRawData?.map((item) => ({
      ...item,
      Category: formatCategoryName2(item.Category), // ✅ Format category name
      Qnty: Number((item.Qnty ?? "0").toString().replace(/,/g, "")),
      Sale: Number((item.Sale ?? "0").toString().replace(/,/g, "")),
      Color: getCategoryColor(item.Category), // 👈 assign color here
    })) || [];

  const maxValue = showSale
    ? Math.max(...barData.map((item) => item.Sale), 0)
    : Math.max(...barData.map((item) => item.Qnty), 0);

  // ---------------- DONUT DATA (same as BAR DATA) ----------------
  // ✅ Use the SAME dataset (no swapping)
  const donutData =
    barData?.map((item) => ({
      Category: formatCategoryName2(item.Category), // ✅ Format category name
      Value: showSale ? item.Sale : item.Qnty, // 👈 match Bar chart
      Color: getCategoryColor(item.Category),
    })) || [];

  // ✅ Ensure same categories across both datasets
  const allCategories = [
    ...new Set([...barData.map((b) => b.Category), ...donutData.map((d) => d.Category)]),
  ];

  const alignedDonutData = allCategories.map((cat) => {
    const found = donutData.find((d) => d.Category === cat);
    return {
      Category: cat,
      Value: found ? found.Value : 0,
      Color: getCategoryColor(cat), // ✅ same color as bar
    };
  });

  const donutSeries = alignedDonutData.map((item) => item.Value);
  const donutLabels = alignedDonutData.map((item) => item.Category);
  const donutColors = alignedDonutData.map((item) => item.Color); // 👈 pass to chart

  // ------- DONUT COMPONENT ----------
  const Donutchart = ({ series, labels, colors, title }) => {
    if (!series || series.length === 0 || series.every((val) => val === 0)) {
      return (
        <div style={{ textAlign: "center", fontSize: "13px", color: "gray" }}>
          No Data Available
        </div>
      );
    }

    const options = {
      chart: { type: "donut" },
      title: {
        text: title,
        align: "center",
        style: { fontSize: "14px", fontWeight: "bold", color: "black" },
      },
      labels: labels,
      colors: colors, // ✅ consistent mapping
      legend: { show: false },
      tooltip: {
        enabled: true,
        y: {
          formatter: (val, { seriesIndex }) =>
            `${labels[seriesIndex]}: ${val.toLocaleString()}`,
        },
      },
      // ✅ Show percentage in white
      dataLabels: {
        enabled: true,
        formatter: (val) => `${val.toFixed(1)}%`,
        style: {
          colors: ["#FFFFFF"], // white text
          fontSize: "12px",
          fontWeight: "400",
        },
      },
      plotOptions: { pie: { donut: { size: "0%" } } },
    };

    return (
      <div id="donut-chart">
        <Chart options={options} series={series} type="donut" width={220} />
      </div>
    );
  };




  ////////////////////////// CODE FOR MONTHLY WISE DATA SET //////////////////////////////////
  // ------- CURRENT MONTH DONUT CHART DATA ----------




  const palette2 = [
    "#2563EB", "#DC2626", "#059669", "#7C3AED",
    "#EA580C", "#65A30D", "#DB2777", "#0891B2",
    "#CA8A04", "#9333EA", "#16A34A", "#E11D48"
  ];

  // // ✅ Function to capitalize first letter and make others lowercase
  const formatCategoryName = (category) => {
    if (!category || category === "N/A") return "N/A";
    return category.charAt(0).toUpperCase() + category.slice(1).toLowerCase();
  };

  // ✅ Store category → color mapping for Current Month
  const categoryColors2 = {};

  // ✅ Function to assign consistent colors for Current Month
  const getCategoryColor2 = (category) => {
    const formattedCategory = formatCategoryName(category);
    const key = (formattedCategory || "N/A").toUpperCase().trim();
    if (!categoryColors2[key]) {
      const index = Object.keys(categoryColors2).length % palette2.length;
      categoryColors2[key] = palette2[index];
    }
    return categoryColors2[key];
  };

  // ---------------- CURRENT MONTH DATA (SAME DATASET FOR BOTH CHARTS) ----------------
  const currentRawData = showSalemonthly
    ? Resturentdata?.CurrentMonthCatgSaleQntyWise  // When showSalemonthly is true, show Qnty data
    : Resturentdata?.CurrentMonthCatgSaleAmountWise; // When false, show Sale data

  // ---------------- DONUT CHART DATA ----------------
  const currentDonutData =
    currentRawData?.map((item) => ({
      Category: formatCategoryName(item.Category), // ✅ Format category name
      Value: showSalemonthly
        ? Number((item.Qnty ?? "0").toString().replace(/,/g, ""))
        : Number((item.Sale ?? "0").toString().replace(/,/g, "")),
    })) || [];

  // ✅ Ensure same categories (align for consistency)
  const allCurrentCategories = [
    ...new Set(currentDonutData.map((d) => d.Category)),
  ];

  const alignedCurrentDonutData = allCurrentCategories.map((cat) => {
    const found = currentDonutData.find((d) => d.Category === cat);
    return {
      Category: cat,
      Value: found ? found.Value : 0,
      Color: getCategoryColor2(cat), // ✅ consistent mapping
    };
  });

  const currentDonutSeries = alignedCurrentDonutData.map((item) => item.Value);
  const currentDonutLabels = alignedCurrentDonutData.map((item) => item.Category);
  const currentDonutColors = alignedCurrentDonutData.map((item) => item.Color);

  // ---------------- BAR CHART DATA (USING SAME DATASET) ----------------
  const currentBarData =
    currentRawData?.map((item) => ({
      ...item,
      Category: formatCategoryName(item.Category), // ✅ Format category name
      Qnty: Number((item.Qnty ?? "0").toString().replace(/,/g, "")),
      Sale: Number((item.Sale ?? "0").toString().replace(/,/g, "")),
      Color: getCategoryColor2(item.Category), // ✅ consistent color
    })) || [];

  const currentMaxValue = showSalemonthly
    ? Math.max(...currentBarData.map((item) => item.Qnty), 0)
    : Math.max(...currentBarData.map((item) => item.Sale), 0);

  // ------- DONUT COMPONENT 2 ----------
  const Donutchart2 = ({ series, labels, colors, title }) => {
    if (!series || series.length === 0 || series.every((val) => val === 0)) {
      return (
        <div style={{ textAlign: "center", fontSize: "13px", color: "gray" }}>
          No Data Available
        </div>
      );
    }

    const options = {
      chart: { type: "donut" },
      title: {
        text: title,
        align: "center",
        style: { fontSize: "14px", fontWeight: "bold", color: "black" },
      },
      labels: labels,
      colors: colors,
      legend: { show: false },
      tooltip: {
        enabled: true,
        y: {
          formatter: (val, { seriesIndex }) =>
            `${labels[seriesIndex]}: ${val.toLocaleString()}`,
        },
      },
      dataLabels: { enabled: false },
      dataLabels: {
        enabled: true,
        formatter: (val) => `${val.toFixed(1)}%`,  // show percentage
        style: {
          colors: ["#FFFFFF"], // make text white
          fontSize: "12px",
          fontWeight: "400",
        },
      },
      plotOptions: { pie: { donut: { size: "0%" } } },
    };

    return (
      <div id="donut-chart2">
        <Chart options={options} series={series} type="donut" width={220} />
      </div>
    );
  };
  ///////////////////////////////////////////////////////////////////////////////////////////


  /////////////////////// CODE FOR MONTHLY SALE ///////////////////////////////////////////


  // 🎨 Color Palette
  const palette3 = [
    "#2563EB", "#DC2626", "#059669", "#7C3AED",
    "#EA580C", "#65A30D", "#DB2777", "#0891B2",
    "#CA8A04", "#9333EA", "#16A34A", "#E11D48"
  ];

  // ✅ Format Category Names
  const formatCategoryName3 = (category) => {
    if (!category || category === "N/A") return "N/A";
    const cleaned = category.replace(/\(.*?\)/g, "").trim(); // remove () content
    return cleaned.charAt(0).toUpperCase() + cleaned.slice(1).toLowerCase();
  };

  // ✅ Store category → color mapping
  const categoryColors3 = {};
  const GetCategoryColor2 = (category) => {
    const formattedCategory = formatCategoryName3(category);
    const key = (formattedCategory || "N/A").toUpperCase().trim();
    if (!categoryColors3[key]) {
      const index = Object.keys(categoryColors3).length % palette3.length;
      categoryColors3[key] = palette3[index];
    }
    return categoryColors3[key];
  };

  // ✅ Raw Data from API
  const currentRawData3 = MonthSaledata || [];

  // ✅ Bar Chart Data
  let monthlysaledata =
    currentRawData3?.map((item) => ({
      ...item,
      Category: formatCategoryName3(item.Description),
      Qnty: Number((item.Qnty ?? "0").toString().replace(/,/g, "")),
      Sale: Number((item.Amount ?? "0").toString().replace(/,/g, "")),
      Color: GetCategoryColor2(item.Description),
    })) || [];

  // ✅ Sort by Qnty or Sale & take TOP 10
  monthlysaledata = monthlysaledata
    .sort((a, b) =>
      monthlysale ? b.Qnty - a.Qnty : b.Sale - a.Sale
    )
    .slice(0, 10);

  // ✅ Donut Chart Data
  const currentDonutData3 =
    monthlysaledata?.map((item) => ({
      Category: item.Category,
      Value: monthlysale ? item.Qnty : item.Sale,
      Color: GetCategoryColor2(item.Description),
    })) || [];

  const currentDonutSeries3 = currentDonutData3.map((item) => item.Value);
  const currentDonutLabels3 = currentDonutData3.map((item) => item.Category);
  const currentDonutColors3 = currentDonutData3.map((item) => item.Color);

  // ✅ Find max value for bar %
  const currentMaxValue3 = monthlysale
    ? Math.max(...monthlysaledata.map((item) => item.Qnty), 0)
    : Math.max(...monthlysaledata.map((item) => item.Sale), 0);

  // ✅ Donut Chart Component
  const Donutchart3 = ({ series, labels, colors, title }) => {
    if (!series || series.length === 0 || series.every((val) => val === 0)) {
      return (
        <div style={{ textAlign: "center", fontSize: "13px", color: "gray" }}>
          No Data Available
        </div>
      );
    }

    const options = {
      chart: { type: "donut" },
      title: {
        text: title,
        align: "center",
        style: { fontSize: "14px", fontWeight: "bold", color: "black" },
      },
      labels: labels,
      colors: colors,
      legend: { show: false },
      tooltip: {
        enabled: true,
        y: {
          formatter: (val, { seriesIndex }) =>
            `${labels[seriesIndex]}: ${val.toLocaleString()}`,
        },
      },
      dataLabels: {
        enabled: true,
        formatter: (val) => `${val.toFixed(1)}%`,
        style: {
          colors: ["#FFFFFF"],
          fontSize: "12px",
          fontWeight: "400",
        },
      },
      plotOptions: { pie: { donut: { size: "0%" } } },
    };

    return (
      <div id="donut-chart2">
        <Chart options={options} series={series} type="donut" width={250} />
      </div>
    );
  };


  ///////////////////////////////// TODAY SALE DATA //////////////////////////////////////

  // 🎨 Color Palette
  const palette4 = [
    "#2563EB", "#DC2626", "#059669", "#7C3AED",
    "#EA580C", "#65A30D", "#DB2777", "#0891B2",
    "#CA8A04", "#9333EA", "#16A34A", "#E11D48"
  ];

  // ✅ Format Category Names
  const formatCategoryName4 = (category) => {
    if (!category || category === "N/A") return "N/A";
    const cleaned = category.replace(/\(.*?\)/g, "").trim(); // remove () content
    return cleaned.charAt(0).toUpperCase() + cleaned.slice(1).toLowerCase();
  };

  // ✅ Store category → color mapping
  const categoryColors4 = {};
  const GetCategoryColor4 = (category) => {
    const formattedCategory = formatCategoryName4(category);
    const key = (formattedCategory || "N/A").toUpperCase().trim();
    if (!categoryColors4[key]) {
      const index = Object.keys(categoryColors4).length % palette4.length;
      categoryColors4[key] = palette4[index];
    }
    return categoryColors4[key];
  };

  // ✅ Raw Data from API
  const currentRawData4 = TodaySaledata || [];

  // ✅ Processed Data
  let Todaysaledata =
    currentRawData4?.map((item) => ({
      ...item,
      Category: formatCategoryName4(item.Description),
      Qnty: Number((item.Qnty ?? "0").toString().replace(/,/g, "")),
      Sale: Number((item.Amount ?? "0").toString().replace(/,/g, "")),
      Color: GetCategoryColor4(item.Description),
    })) || [];

  // ✅ Sort by Qnty or Sale & take TOP 10
  Todaysaledata = Todaysaledata
    .sort((a, b) =>
      todaysaleQnty ? b.Qnty - a.Qnty : b.Sale - a.Sale
    )
    .slice(0, 10);

  // ✅ Donut Chart Data
  const currentDonutData4 =
    Todaysaledata?.map((item) => ({
      Category: item.Category,
      Value: todaysaleQnty ? item.Qnty : item.Sale,
      Color: GetCategoryColor4(item.Description),
    })) || [];

  const currentDonutSeries4 = currentDonutData4.map((item) => item.Value);
  const currentDonutLabels4 = currentDonutData4.map((item) => item.Category);
  const currentDonutColors4 = currentDonutData4.map((item) => item.Color);

  // ✅ Find max value for bar %
  const currentMaxValue4 = todaysaleQnty
    ? Math.max(...Todaysaledata.map((item) => item.Qnty), 0)
    : Math.max(...Todaysaledata.map((item) => item.Sale), 0);

  // ✅ Donut Chart Component
  const Donutchart4 = ({ series, labels, colors, title }) => {
    if (!series || series.length === 0 || series.every((val) => val === 0)) {
      return (
        <div style={{ textAlign: "center", fontSize: "13px", color: "gray" }}>
          No Data Available
        </div>
      );
    }

    const options = {
      chart: { type: "donut" },
      title: {
        text: title,
        align: "center",
        style: { fontSize: "14px", fontWeight: "bold", color: "black" },
      },
      labels: labels,
      colors: colors,
      legend: { show: false },
      tooltip: {
        enabled: true,
        y: {
          formatter: (val, { seriesIndex }) =>
            `${labels[seriesIndex]}: ${val.toLocaleString()}`,
        },
      },
      dataLabels: {
        enabled: true,
        formatter: (val) => `${val.toFixed(1)}%`,
        style: {
          colors: ["#FFFFFF"],
          fontSize: "12px",
          fontWeight: "400",
        },
      },
      plotOptions: { pie: { donut: { size: "0%" } } },
    };

    return (
      <div id="donut-chart4">
        <Chart options={options} series={series} type="donut" width={250} />
      </div>
    );
  };


  ///////////////////////////////////////////////////////////////////////////////////////

  ///////////////////////////////////////////////////////////////////////////////

  return (
    <>
      <div className="row Countair_styling" style={contentStyle}>
        {/* first left section */}

        <div className="main_left_section">
          {/* first left inner main 3 section */}
          <div className="left_inner_section1">


            <div className="top_inner_cards1">
              <div className="sep_heading">
                <div className="top_span">
                  <span className="first_span">September</span>
                  <span className="first_span2" style={{ paddingLeft: '20px' }}> {Resturentdata.MonthAmount || '0'}</span>
                  <span className="first_span2" style={{ paddingLeft: '20px' }}>{Resturentdata.MonthInvoices || '0'}</span>
                </div>

                <div className="top_span">
                  <span className="first_span">Today</span>
                  <span className="first_span2" style={{ paddingLeft: '20px' }}> {Resturentdata.DayAmount || '0'}</span>
                  <span className="first_span2" style={{ paddingLeft: '20px' }}>{Resturentdata.DayInvoices || '0'}</span>
                </div>

                {Resturentdata.CurrentMonthMaximum && Resturentdata.CurrentMonthMaximum.length > 0 && (
                  <div className="top_span">
                    {/* <span className="first_day_span" style={{ lineHeight: '0.7', padding: '4px 0' }}>
                      {Resturentdata.CurrentMonthMaximum[0].Day}  {Resturentdata.CurrentMonthMaximum[0].Date}
                    </span> */}
                    <span className="first_span">MonthMax</span>
                    <span className="first_span2" style={{ paddingLeft: '20px' }}> {Resturentdata.CurrentMonthMaximum[0].Sale}</span>
                    <span className="first_span2" style={{ paddingLeft: '20px' }}>{Resturentdata.CurrentMonthMaximum[0].Invoices}</span>
                  </div>
                )}

                {Resturentdata.CurrentMonthMaximum && Resturentdata.CurrentMonthMaximum.length > 0 && (
                  <div className="top_span">
                    <span className="monthmax_date" style={{ lineHeight: '0.1' }}>
                      {Resturentdata.CurrentMonthMaximum[0].Day}  {Resturentdata.CurrentMonthMaximum[0].Date}
                    </span>
                  </div>
                )}


                {Resturentdata.CurrentMonthAverage && Resturentdata.CurrentMonthAverage.length > 0 && (
                  <div className="top_span">
                    {/* <span className="first_day_span" style={{ lineHeight: '0.7', padding: '4px 0' }}>
                      {Resturentdata.CurrentMonthAverage[0].Day}  {Resturentdata.CurrentMonthAverage[0].Date}
                    </span> */}
                    <span className="first_span">Average</span>
                    <span className="first_span2" style={{ paddingLeft: '20px' }}> {Resturentdata.CurrentMonthAverage[0].Sale}</span>
                    <span className="first_span2" style={{ paddingLeft: '20px' }}>{Resturentdata.CurrentMonthAverage[0].Invoices}</span>
                  </div>
                )}

              </div>
            </div>


            <div className="top_inner_cards">
              <div className="sep_heading">
                <div className="top_span">
                  <span className="first_span_secondcard1" >Last 3 Days Summary</span>
                </div>

                {Resturentdata.Last3Days && Resturentdata.Last3Days.map((dayData, index) => (
                  <div key={index} style={{ display: 'flex', marginTop: '5px', alignItems: 'center' }}>
                    <span className="first_day_span2" style={{ lineHeight: '0.7', padding: '4px 0' }}>
                      {dayData.Day} {dayData.ttrndat}
                    </span>
                    <span className="first_span2" style={{ paddingLeft: '20px', lineHeight: '0.7' }}>{dayData.Sale}</span>
                    <span className="first_span2" style={{ paddingLeft: '20px', lineHeight: '0.7' }}>{dayData.Invoices}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="top_inner_cards3">
              <div className="split_section"></div>
              <div className="split_section"></div>
            </div>


            <div className="top_inner_cards4" style={{ margin: '0px' }}>
              <div className="counter_sale">
                Counter Sale
              </div>
              {/* Data rows */}
              <div className="countersale_map" style={{ paddingLeft: '5px', paddingRight: '5px' }}>
                {Resturentdata.AccountCodeSale && Resturentdata.AccountCodeSale.map((item, index) => (
                  <div key={index} className="row  counter_saledata" style={{ lineHeight: '1.5', borderBottom: '1px solid grey', borderRight: '1px solid grey', borderTop: '1px solid grey' }}>
                    <div className="col-md-7 columnsetting" style={{ textAlign: 'start', borderRight: '1px solid grey', borderLeft: '1px solid grey', paddingLeft: '2px' }}>
                      {item.Desc || 'N/A'}
                    </div>
                    <div className="col-md-2 " style={{ textAlign: 'center', padding: '0px', borderRight: '1px solid grey' }}>
                      {item.Invoices}
                    </div>
                    <div className="col-md-3 " style={{ textAlign: 'end', padding: '0px', borderRight: '1px solid grey' }}>
                      {item.Sale}
                    </div>
                  </div>
                ))}
              </div>

            </div>


            {/* Last 3 days cards */}

          </div>


          <div className="left_inner_section3">
            <div className="daywise_graph" >
              <div className="month_day_graph" style={{ paddingLeft: '20px' }}>
                {DaymonthGraph ? 'Monthly Performance Overview' : 'Daily Performance Overview'}
                <div style={{ display: 'flex', alignItems: 'center', marginLeft: '100px', marginTop: '3px' }}>
                  <label className="toggle" title="Switch Graph">
                    <input
                      type="checkbox"
                      checked={DaymonthGraph}
                      onChange={() => setDaymonthGraph(!DaymonthGraph)}
                    />
                    <span className="slider"></span>
                  </label>

                </div>
              </div>

              {/* Conditionally render charts based on toggle state */}
              {DaymonthGraph ? <MonthwiseChart /> : <BarChart />}
            </div>

            <div className="info" >

            </div>

            <div className="info2" >
              <div className="counter_sale">
                Last 10 Sale
              </div>

              <div className="countersale_map" style={{ paddingLeft: '5px', paddingRight: '5px' }}>
                {Resturentdata.Last10Sales && Resturentdata.Last10Sales.map((item, index) => (
                  <div key={index} className="row  counter_saledata" style={{ lineHeight: '1.5', borderBottom: '1px solid grey', borderRight: '1px solid grey', borderTop: '1px solid grey' }}>
                    <div className="columnsetting" style={{ width: '30%', textAlign: 'start', borderRight: '1px solid grey', borderLeft: '1px solid grey', paddingLeft: '2px' }}>
                      {item.ttrnnum || 'N/A'}
                    </div>
                    <div style={{ width: '30%', textAlign: 'start', padding: '0px', borderRight: '1px solid grey' }}>
                      {item.ttrntim}
                    </div>
                    <div style={{ width: '15%', textAlign: 'end', paddingRight: '2px', padding: '0px', borderRight: '1px solid grey' }}>
                      {item.Qnty}
                    </div>
                    <div style={{ width: '25%', textAlign: 'end', paddingRight: '2px', padding: '0px', borderRight: '1px solid grey' }}>
                      {item.Sale}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Last left main row */}
          <div className="left_inner_section3 " >

            <div className="lastrow_firstchart">
              <div className="row" style={{ height: '220px' }}>
                <div className="col-md-12 ">
                  <div
                    className="top_span"
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      borderTopLeftRadius: '5px',
                      borderTopRightRadius: '5px',
                      background: showTodayCategory ? 'linear-gradient(135deg, #fa709a 0%, #fee140 100%));' : 'linear-gradient(135deg, #fa709a 0%, #fee140 100%)'
                    }}
                  >
                    <span
                      className="first_span_secondcard"
                      style={{ paddingBottom: "5px", paddingTop: '5px', paddingLeft: '20px', fontWeight: 'bold' }}
                    >
                      {showTodayCategory ? "TODAY " : "TODAY "}
                    </span>

                    {/* Main Toggle - Switch between Today Category and Today Sale */}
                    <div style={{ paddingTop: "5px", width: '200px', textAlign: 'start' }}>
                      <label className="toggle" title="Switch between Category and Sale">
                        <input
                          type="checkbox"
                          checked={!showTodayCategory}
                          onChange={() => setShowTodayCategory(!showTodayCategory)}
                        />
                        <span className="slider"></span>
                      </label>
                      <span style={{ position: 'relative', bottom: '3px', fontWeight: 'bold', fontSize: '12px', marginLeft: "10px", color: 'white' }} >
                        {showTodayCategory ? 'CATEGORY' : 'ITEM'}
                      </span>
                    </div>

                    {/* Graph Type Toggle */}
                    <div style={{ paddingTop: "5px" }}>
                      <label className="toggle" title="Switch to Pie Chart">
                        <input
                          type="checkbox"
                          checked={showTodayCategory ? switchgraph2 : todaysaleQntyGraph}
                          onChange={() => showTodayCategory ? setswitchgraph2(!switchgraph2) : settodaysaleQntyGraph(!todaysaleQntyGraph)}
                        />
                        <span className="slider"></span>
                      </label>
                      {/* <span style={{ marginLeft: '10px', fontSize: '12px', color: 'white' }}>
                        {showTodayCategory ? (switchgraph2 ? 'Donut' : 'Bar') : (todaysaleQntyGraph ? 'Donut' : 'Bar')}
                      </span> */}
                    </div>

                    {/* Data Type Toggle */}
                    <div style={{ paddingTop: "5px", paddingRight: '20px' }}>
                      <label className="toggle" >
                        <input
                          type="checkbox"
                          checked={showTodayCategory ? showSale : todaysaleQnty}
                          onChange={() => showTodayCategory ? setShowSale(!showSale) : settodaysaleQnty(!todaysaleQnty)}
                        />
                        <span className="slider"></span>
                      </label>
                      {/* <span style={{ marginLeft: '10px', fontSize: '12px', color: 'white' }}>
                        {showTodayCategory ? (showSale ? 'Sale' : 'Qnty') : (todaysaleQnty ? 'Qnty' : 'Sale')}
                      </span> */}
                    </div>
                  </div>

                  <div className="row" style={{ paddingLeft: '10px', paddingRight: '10px' }}>
                    {/* ✅ Category Column */}
                    <div className={showTodayCategory ? "col-md-3" : "col-md-4"}>
                      {(showTodayCategory ? barData : Todaysaledata).map((item, index) => (
                        <div key={index} className="cardrow" style={{ textAlign: "start" }}>
                          {item.Category || "N/A"}
                        </div>
                      ))}
                    </div>

                    {/* ✅ Middle Column (Bars OR Donut) */}
                    <div className={showTodayCategory ? "col-md-6" : "col-md-5"}>
                      {showTodayCategory ? (
                        // TODAY CATEGORY CONTENT
                        !switchgraph2 ? (
                          // 🔹 Bars for Today Category
                          barData.map((item, index) => {
                            const value = showSale ? item.Sale : item.Qnty;
                            const percentage = maxValue ? (value / maxValue) * 100 : 0;
                            const barColor =
                              categoryColors[item.Category?.toUpperCase().trim()] || "#999999";

                            return (
                              <div
                                key={index}
                                className="cardrow"
                                style={{
                                  width: "100%",
                                  height: "15px",
                                  background: "#eee",
                                  borderRadius: "6px",
                                  overflow: "hidden",
                                  margin: "7px 0",
                                  marginLeft: "20px",
                                }}
                              >
                                <div
                                  style={{
                                    width: `${percentage}%`,
                                    height: "100%",
                                    background: barColor,
                                    transition: "width 0.3s ease",
                                  }}
                                ></div>
                              </div>
                            );
                          })
                        ) : (
                          // 🔹 Donut chart for Today Category
                          <div style={{ display: "flex", justifyContent: "center" }}>
                            <Donutchart
                              series={donutSeries}
                              labels={donutLabels}
                              colors={donutColors}
                            />
                          </div>
                        )
                      ) : (
                        // TODAY SALE CONTENT
                        !todaysaleQntyGraph ? (
                          // Bars for Today Sale
                          Todaysaledata.map((item, index) => {
                            const value = todaysaleQnty ? item.Qnty : item.Sale;
                            const percentage = currentMaxValue4
                              ? (value / currentMaxValue4) * 100
                              : 0;
                            return (
                              <div
                                key={index}
                                className="cardrow"
                                style={{
                                  width: "130%",
                                  height: "15px",
                                  background: "#eee",
                                  borderRadius: "6px",
                                  overflow: "hidden",
                                  margin: "8px 0",
                                }}
                              >
                                <div
                                  style={{
                                    width: `${percentage}%`,
                                    height: "100%",
                                    background: item.Color,
                                    transition: "width 0.3s ease",
                                  }}
                                ></div>
                              </div>
                            );
                          })
                        ) : (
                          // Donut for Today Sale
                          <div style={{ display: "flex", justifyContent: "center", alignItems: 'center', marginTop: '10px' }}>
                            <Donutchart4
                              series={currentDonutSeries4}
                              labels={currentDonutLabels4}
                              colors={currentDonutColors4}
                            />
                          </div>
                        )
                      )}
                    </div>

                    {/* ✅ Value Column */}
                    <div className={showTodayCategory ? "col-md-3" : "col-md-3"}>
                      {(showTodayCategory ? barData : Todaysaledata).map((item, index) => {
                        const value = showTodayCategory
                          ? (showSale ? item.Sale : item.Qnty)
                          : (todaysaleQnty ? item.Qnty : item.Sale);
                        return (
                          <div
                            key={index}
                            className="cardrow"
                            style={{ textAlign: "right", fontSize: "13px", fontWeight: "500" }}
                          >
                            {value.toLocaleString()}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="lastrow_firstchart">
              <div className="row" style={{ height: '220px' }}>
                <div className="col-md-12 ">
                  <div
                    className="top_span"
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      borderTopLeftRadius: '5px',
                      borderTopRightRadius: '5px',
                      background: showMonthlyCategory ? ' linear-gradient(135deg, #a465bdff 0%, #ba91caff 100%)' : ' linear-gradient(135deg, #a465bdff 0%, #ba91caff 100%)'
                    }}
                  >
                    <span
                      className="first_span_secondcard"
                      style={{ paddingBottom: "5px", paddingTop: '5px', paddingRight: '5px', paddingLeft: '20px', fontWeight: 'bold' }}
                    >
                      {showMonthlyCategory ? "MONTHLY " : "MONTHLY "}
                    </span>

                    {/* Main Toggle - Switch between Monthly Category and Monthly Sale */}
                    <div style={{ paddingTop: "5px", width: '200px', textAlign: 'start' }}>
                      <label className="toggle" title="Switch between Category and Sale">
                        <input
                          type="checkbox"
                          checked={!showMonthlyCategory}
                          onChange={() => setShowMonthlyCategory(!showMonthlyCategory)}
                        />
                        <span className="slider"></span>
                      </label>
                      <span style={{ position: 'relative', bottom: '3px', fontWeight: '700', paddingLeft: '10px', fontSize: '12px', color: 'white' }}>
                        {showMonthlyCategory ? 'CATEGORY' : 'ITEM'}
                      </span>
                    </div>

                    {/* Graph Type Toggle */}
                    <div style={{ paddingTop: "5px" }}>
                      <label className="toggle" title="Switch to Pie Chart">
                        <input
                          type="checkbox"
                          checked={showMonthlyCategory ? switchgraph : MonthlysaleGraph}
                          onChange={() => showMonthlyCategory ? setswitchgraph(!switchgraph) : setMonthlysaleGraph(!MonthlysaleGraph)}
                        />
                        <span className="slider"></span>
                      </label>
                      {/* <span style={{ marginLeft: '10px', fontSize: '12px', color: 'white' }}>
                        {showMonthlyCategory ? (switchgraph ? 'Donut' : 'Bar') : (MonthlysaleGraph ? 'Donut' : 'Bar')}
                      </span> */}
                    </div>

                    {/* Data Type Toggle */}
                    <div style={{ paddingTop: "5px", paddingRight: '20px' }}>
                      <label className="toggle">
                        <input
                          type="checkbox"
                          checked={showMonthlyCategory ? showSalemonthly : monthlysale}
                          onChange={() => showMonthlyCategory ? setshowSalemonthly(!showSalemonthly) : setmonthlysale(!monthlysale)}
                        />
                        <span className="slider"></span>
                      </label>
                      {/* <span style={{ marginLeft: '10px', fontSize: '12px', color: 'white' }}>
                        {showMonthlyCategory ? (showSalemonthly ? 'Qnty' : 'Sale') : (monthlysale ? 'Qnty' : 'Sale')}
                      </span> */}
                    </div>
                  </div>

                  <div className="row" style={{ paddingLeft: '10px', paddingRight: '10px' }}>
                    {/* ✅ Category Column */}
                    <div className={showMonthlyCategory ? "col-md-3" : "col-md-4"}>
                      {(showMonthlyCategory ? currentBarData : monthlysaledata).map((item, index) => (
                        <div key={index} className="cardrow" style={{ textAlign: "start" }}>
                          {item.Category || "N/A"}
                        </div>
                      ))}
                    </div>

                    {/* ✅ Middle Column (Bars OR Donut) */}
                    <div className={showMonthlyCategory ? "col-md-6" : "col-md-5"}>
                      {showMonthlyCategory ? (
                        // MONTHLY CATEGORY CONTENT
                        !switchgraph ? (
                          // 🔹 Bars for Monthly Category
                          currentBarData.map((item, index) => {
                            const value = showSalemonthly ? item.Qnty : item.Sale;
                            const percentage = currentMaxValue ? (value / currentMaxValue) * 100 : 0;
                            const barColor =
                              categoryColors2[item.Category?.toUpperCase().trim()] || "#999999";

                            return (
                              <div
                                key={index}
                                className="cardrow"
                                style={{
                                  width: "100%",
                                  height: "15px",
                                  background: "#eee",
                                  borderRadius: "6px",
                                  overflow: "hidden",
                                  margin: "7px 0",
                                }}
                              >
                                <div
                                  style={{
                                    width: `${percentage}%`,
                                    height: "100%",
                                    background: barColor,
                                    transition: "width 0.3s ease",
                                  }}
                                ></div>
                              </div>
                            );
                          })
                        ) : (
                          // 🔹 Donut chart for Monthly Category
                          <div style={{ display: "flex", justifyContent: "center" }}>
                            <Donutchart2
                              series={currentDonutSeries}
                              labels={currentDonutLabels}
                              colors={currentDonutColors}
                            />
                          </div>
                        )
                      ) : (
                        // MONTHLY SALE CONTENT
                        !MonthlysaleGraph ? (
                          // Bars for Monthly Sale
                          monthlysaledata.map((item, index) => {
                            const value = monthlysale ? item.Qnty : item.Sale;
                            const percentage = currentMaxValue3
                              ? (value / currentMaxValue3) * 100
                              : 0;
                            return (
                              <div
                                key={index}
                                className="cardrow"
                                style={{
                                  width: "120%",
                                  height: "15px",
                                  background: "#eee",
                                  borderRadius: "6px",
                                  overflow: "hidden",
                                  margin: "8px 0",
                                }}
                              >
                                <div
                                  style={{
                                    width: `${percentage}%`,
                                    height: "100%",
                                    background: item.Color,
                                    transition: "width 0.3s ease",
                                  }}
                                ></div>
                              </div>
                            );
                          })
                        ) : (
                          // Donut for Monthly Sale
                          <div style={{ display: "flex", justifyContent: "center", alignItems: 'center', marginTop: '10px' }}>
                            <Donutchart3
                              series={currentDonutSeries3}
                              labels={currentDonutLabels3}
                              colors={currentDonutColors3}
                            />
                          </div>
                        )
                      )}
                    </div>

                    {/* ✅ Values Column */}
                    <div className={showMonthlyCategory ? "col-md-3" : "col-md-3"}>
                      {(showMonthlyCategory ? currentBarData : monthlysaledata).map((item, index) => {
                        const value = showMonthlyCategory
                          ? (showSalemonthly ? item.Qnty : item.Sale)
                          : (monthlysale ? item.Qnty : item.Sale);
                        return (
                          <div
                            key={index}
                            className="cardrow"
                            style={{ textAlign: "right", fontSize: "13px", fontWeight: "500" }}
                          >
                            {value.toLocaleString()}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="last_info"></div>

          </div>
        </div>

      </div >
    </>
  );
}