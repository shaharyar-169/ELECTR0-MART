import React, { useEffect, useState } from "react";
import './Dashboard.css'
import "react-datepicker/dist/react-datepicker.css";
import axios from "axios";
import Dounut from "./Chart/DountChart";
import BarChart from "./Chart/Barchart";
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
      code: 'FDEEK',
      FYerDsc: '2025-2025',
      FLocCod: '001'
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

    const formData = new URLSearchParams({
      code: 'FDEEK',
      FYerDsc: '2025-2025',
      FLocCod: '001',
      FIntDat: '25-09-2025',
      FFnlDat: '25-09-2025'
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

    const formData = new URLSearchParams({
      code: 'FDEEK',
      FYerDsc: '2025-2025',
      FLocCod: '001',
      FIntDat: '01-09-2025',
      FFnlDat: '25-09-2025'
    }).toString();

    axios
      .post(apiUrl, formData)
      .then((response) => {
        // Check if response.data exists and has the expected structure
        if (response.data && typeof response.data === 'object') {
          setMonthSaledata(response.data.Report);
        } else {
          console.warn(
            "Response data structure is not as expected:",
            response.data
          );
          setMonthSaledata({}); // Set empty object instead of array
        }
      })
      .catch((error) => {
        console.error("Error:", error);
        setMonthSaledata({}); // Set empty object on error too
      })
      .finally(() => {
        setIsLoading(false); // Make sure to set loading to false
      });
  }, []);


  const contentStyle = {
    backgroundColor: '#efeff0ff',
    width: isSidebarVisible ? "calc(80vw - 0%)" : "80vw",
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
    maxWidth: "80vw",
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


  return (
    <>
      <div className="row Countair_styling" style={contentStyle}>
        {/* first left section */}

        <div className="main_left_section">
          {/* first left inner main 3 section */}
          <div className="left_inner_section1">


            <div className="top_inner_cards">
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
                  <span className="first_span_secondcard">Last 3 Days Summary</span>
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

            </div>







            {/* Last 3 days cards */}

          </div>

          <div className="left_inner_section2">
            {/* first card */}
            <div className="first_card" style={{ margin: '0px' }}>
              <div className="top_span">
                <span className="first_span_secondcard" style={{ paddingBottom: '10px' }}>Counter Sale</span>
              </div>

              {/* Data rows */}
              {Resturentdata.AccountCodeSale && Resturentdata.AccountCodeSale.map((item, index) => (
                <div key={index} className="row  cardrow" style={{ borderBottom: '1px solid grey', borderRight: '1px solid grey', borderTop: '1px solid grey' }}>
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

            <div className="second_card">
              <div className="" style={{ margin: '0px' }}>
                <div className="top_span">
                  <span className="first_span_secondcard" style={{ paddingBottom: '5px' }}>Last 10 Sales</span>
                </div>

                {/* Data rows */}
                {Resturentdata.Last10Sales && Resturentdata.Last10Sales.map((item, index) => (
                  <div key={index} className="row  cardrow" style={{ borderBottom: '1px solid grey', borderRight: '1px solid grey', borderTop: '1px solid grey' }} >
                    <div className=" columnsetting" style={{ paddingLeft: '2px', width: '26%', textAlign: 'start', borderRight: '1px solid grey', borderLeft: '1px solid grey' }}>
                      {item.ttrnnum || 'N/A'}
                    </div>
                    <div style={{ width: '28%', textAlign: 'start', padding: '0px', borderRight: '1px solid grey', }}>
                      {item.ttrntim}
                    </div>
                    <div style={{ width: '19%', textAlign: 'center', padding: '0px', borderRight: '1px solid grey', }}>
                      {item.Qnty}
                    </div>
                    <div style={{ width: '26%', textAlign: 'end', padding: '0px' }}>
                      {item.Sale}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
          {/* Last left main row */}
          <div className="left_inner_section3 ">
            <div className="lastrow_firstchart">
              <div className="row">
                <div className="col-md-12 ">
                  <div
                    className="top_span"
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                    }}
                  >
                    <span
                      className="first_span_secondcard"
                      style={{ paddingBottom: "5px" }}
                    >
                      ToDay Category
                    </span>

                    <div style={{ paddingTop: "5px" }}>
                      <label className="toggle">
                        <input
                          type="checkbox"
                          checked={showSale}
                          onChange={() => setShowSale(!showSale)} // toggle state
                        />
                        <span className="slider"></span>
                      </label>
                    </div>
                  </div>

                  {barData.map((item, index) => {
                    const value = showSale ? item.Sale : item.Qnty;
                    const percentage = maxValue ? (value / maxValue) * 100 : 0;
                    const barColor = categoryColors[item.Category?.toUpperCase().trim()] || "#999999"; // ✅ category-based color

                    return (
                      <div key={index} className="row cardrow">
                        <div
                          className="columnsetting"
                          style={{
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "center",
                            paddingLeft: "2px",
                            width: "100%",
                            textAlign: "start",
                          }}
                        >
                          {item.Category || "N/A"}

                          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                            <div
                              style={{
                                width: "190px",
                                height: "15px",
                                background: "#eee",
                                overflow: "hidden",
                                borderRadius: "6px",
                              }}
                            >
                              <div
                                style={{
                                  width: `${percentage}%`,
                                  height: "100%",
                                  background: barColor, // ✅ match donut color
                                  transition: "width 0.3s ease",
                                }}
                              ></div>
                            </div>

                            <span
                              style={{
                                minWidth: "60px",
                                textAlign: "right",
                                fontSize: "13px",
                                fontWeight: "500",
                              }}
                            >
                              {showSale ? value.toLocaleString() : value}
                            </span>
                          </div>
                        </div>
                      </div>
                    );
                  })}

                </div>

              </div>
            </div>

            <div className="lastrow_secondchat">
              <div
                className="col-md-12"
                style={{ display: "flex", justifyContent: "center", alignItems: "center" }}
              >
                <Donutchart
                  series={donutSeries}
                  labels={donutLabels}
                  colors={donutColors} // ✅ pass matching colors
                // title={showSale ? "Current Month Quantity" : "Current Month Sale"}
                />
              </div>
            </div>
          </div>

          <div className="left_inner_section3 ">
            <div className="lastrow_firstchart">
              <div className="row">
                <div className="col-md-12 ">
                  <div
                    className="top_span"
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                    }}
                  >
                    <span
                      className="first_span_secondcard"
                      style={{ paddingBottom: "5px" }}
                    >
                      Monthly Category
                    </span>

                    <div style={{ paddingTop: "5px" }}>
                      <label className="toggle">
                        <input
                          type="checkbox"
                          checked={showSalemonthly}
                          onChange={() => setshowSalemonthly(!showSalemonthly)} // toggle state
                        />
                        <span className="slider"></span>
                      </label>
                    </div>
                  </div>

                  {currentBarData.map((item, index) => {
                    const value = showSalemonthly ? item.Qnty : item.Sale; // Fixed: Now both use same data type
                    const percentage = currentMaxValue ? (value / currentMaxValue) * 100 : 0;
                    const barColor = categoryColors2[item.Category?.toUpperCase().trim()] || "#999999"; // ✅ category-based color

                    return (
                      <div key={index} className="row cardrow">
                        <div
                          className="columnsetting"
                          style={{
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "center",
                            paddingLeft: "2px",
                            width: "100%",
                            textAlign: "start",
                          }}
                        >
                          {item.Category || "N/A"}

                          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                            <div
                              style={{
                                width: "190px",
                                height: "15px",
                                background: "#eee",
                                overflow: "hidden",
                                borderRadius: "6px",
                              }}
                            >
                              <div
                                style={{
                                  width: `${percentage}%`,
                                  height: "100%",
                                  background: barColor, // ✅ match donut color
                                  transition: "width 0.3s ease",
                                }}
                              ></div>
                            </div>

                            <span
                              style={{
                                minWidth: "70px",
                                textAlign: "right",
                                fontSize: "13px",
                                fontWeight: "500",
                              }}
                            >
                              {value.toLocaleString()}
                            </span>
                          </div>
                        </div>
                      </div>
                    );
                  })}

                </div>


              </div>
            </div>

            <div className="lastrow_secondchat">
              <div
                className="col-md-12"
                style={{ display: "flex", justifyContent: "center", alignItems: "center" }}
              >
                <Donutchart2
                  series={currentDonutSeries}
                  labels={currentDonutLabels}
                  colors={currentDonutColors} // ✅ pass matching colors
                // title={showSalemonthly ? "Current Month Quantity" : "Current Month Sale"}
                />
              </div>
            </div>
          </div>

          <div className="left_inner_section3">
            <div className="lastrow_firstchart">
              <div className="row">
                <div className="col-md-12">
                  <div className="monthwise_graph" >
                    <div
                      style={{
                        width: "100%",
                        // background: "white",
                        borderRadius: "12px",
                        padding: "10px 0px",
                        fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
                        display: "flex",
                        flexDirection: "column",
                        paddingRight: '0px'
                      }}
                    >
                      {/* Header */}
                      <div
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "center",
                          marginBottom: "18px",
                        }}
                      >
                        <h3 style={{ margin: 0, fontSize: "14px", fontWeight: 600, color: "#2d3436" }}>
                          Monthly Graph
                        </h3>
                        <div style={{ display: "flex" }}>
                          <span
                            style={{
                              display: "flex",
                              alignItems: "center",
                              fontSize: "10px",
                              color: "#636e72",
                            }}
                          >
                            <span
                              style={{
                                width: "8px",
                                height: "8px",
                                borderRadius: "50%",
                                marginRight: "6px",
                                background: "linear-gradient(135deg, #6a11cb 0%, #2575fc 100%)",
                              }}
                            ></span>
                            Revenue
                          </span>
                        </div>
                      </div>

                      {/* Chart */}
                      <div style={{ height: "200px", display: "flex" }}>
                        {/* Y-Axis with Labels */}
                        <div
                          style={{
                            display: "flex",
                            flexDirection: "column",
                            justifyContent: "space-between",
                            marginRight: "8px",
                            fontSize: "10px",
                            color: "#65696aff",
                            fontWeight: 500,
                            fontSize: '12px'
                          }}
                        >
                          {[4, 3, 2, 1, 0].map((step) => (
                            <div key={step} style={{ textAlign: "right" }}>
                              {Math.round((monthwisemaxValue / 4) * step).toLocaleString()}
                            </div>
                          ))}
                        </div>

                        {/* Bars + X Axis */}
                        <div
                          style={{
                            flex: 1,
                            display: "flex",
                            alignItems: "flex-end",
                            position: "relative",
                          }}
                        >
                          {/* Y-axis line */}
                          <div
                            style={{
                              position: "absolute",
                              left: 0,
                              top: 0,
                              bottom: 20, // stops above x-axis
                              width: "1px",
                              backgroundColor: "#dfe6e9",
                            }}
                          ></div>

                          {/* X-axis line */}
                          <div
                            style={{
                              position: "absolute",
                              left: 0,
                              right: 0,
                              bottom: "20px",
                              height: "1px",
                              backgroundColor: "#dfe6e9",
                            }}
                          ></div>

                          <div
                            style={{
                              display: "flex",
                              justifyContent: "space-between",
                              width: "100%",
                              height: "100%",
                              padding: "0 4px",
                            }}
                          >
                            {barchartData.map((item, index) => (
                              <div
                                key={index}
                                style={{
                                  display: "flex",
                                  flexDirection: "column",
                                  alignItems: "center",
                                  height: "100%",
                                  flex: 1,
                                  position: "relative",
                                }}
                                onMouseEnter={() => setActiveBar(index)}
                                onMouseLeave={() => setActiveBar(null)}
                              >
                                {/* Bar */}
                                <div
                                  style={{
                                    width: "12px",
                                    background:
                                      activeBar === index
                                        ? "linear-gradient(to top, #2575fc 0%, #009efd 100%)"
                                        : "linear-gradient(to top, #6a11cb 0%, #2575fc 100%)",
                                    borderRadius: "4px 4px 0 0",
                                    transition: "all 0.3s ease",
                                    position: "relative",
                                    marginTop: "auto",
                                    height: `${(item.value / monthwisemaxValue) * 100}%`,
                                    boxShadow:
                                      activeBar === index
                                        ? "0 0 10px rgba(37, 117, 252, 0.4)"
                                        : "none",
                                  }}
                                >
                                  {/* Tooltip */}
                                  <div
                                    style={{
                                      position: "absolute",
                                      top: "-32px",
                                      left: "50%",
                                      transform: "translateX(-50%)",
                                      backgroundColor: "#2d3436",
                                      color: "white",
                                      padding: "4px 8px",
                                      borderRadius: "6px",
                                      fontSize: "11px",
                                      fontWeight: 500,
                                      whiteSpace: "nowrap",
                                      opacity: activeBar === index ? 1 : 0,
                                      transition: "opacity 0.3s ease",
                                      boxShadow: "0 2px 6px rgba(0,0,0,0.2)",
                                      zIndex: 10,
                                    }}
                                  >
                                    {item.value.toLocaleString()}
                                    <div
                                      style={{
                                        position: "absolute",
                                        bottom: "-5px",
                                        left: "50%",
                                        transform: "translateX(-50%)",
                                        width: "0",
                                        height: "0",
                                        borderLeft: "5px solid transparent",
                                        borderRight: "5px solid transparent",
                                        borderTop: "5px solid #2d3436",
                                      }}
                                    ></div>
                                  </div>
                                </div>

                                {/* Month Label */}
                                <div
                                  style={{
                                    marginTop: "8px",
                                    fontSize: "10px",
                                    color: "#636e72",
                                    fontWeight: 500,
                                    fontSize: '12px'
                                  }}
                                >
                                  {item.month}
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>


                </div>
              </div>
            </div>
          </div>


          <div className="left_inner_section3">
            <div className="daywise_graph" >
              <BarChart />
            </div>
          </div>

          <div className="left_inner_section3">
            <div className="todaysale_card">
              <div className="card_header">
                <span>Today Sale </span>
              </div>

              {/* Data rows */}
              {TodaySaledata && TodaySaledata.slice(0, 10).map((item, index) => (
                <div
                  key={index}
                  className="card_row"
                >
                  <div className="col_desc">{item.Description}</div>
                  <div className="col_qty">{item.Qnty}</div>
                  <div className="col_amount">{item.Amount}</div>
                </div>
              ))}
            </div>
            <div className="todaysale_card">
              <div className="card_header" style={{background:'linear-gradient(135deg, #ff7e5f, #feb47b)'}}>
                <span>Monthly Sale </span>
              </div>

              {/* Data rows */}
              {MonthSaledata && MonthSaledata.slice(0, 10).map((item, index) => (
                <div
                  key={index}
                  className="card_row"
                >
                  <div className="col_desc">{item.Description}</div>
                  <div className="col_qty">{item.Qnty}</div>
                  <div className="col_amount">{item.Amount}</div>
                </div>
              ))}
            </div>
          </div>




        </div>



        {/* first right  section */}
        <div className="main_right_section " style={{ padding: "0px", marginTop: "10px", marginRight: '10px' }}>

        </div>





      </div >
    </>
  );
}