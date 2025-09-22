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
import { Tune } from "@mui/icons-material";
import { getOrganisationData, getUserData, getYearDescription, getLocationnumber } from "../../Auth";
import { useTheme } from "../../../ThemeContext";
import { Sparklines, SparklinesBars, SparklinesLine } from "react-sparklines";
import { faToggleOff } from "@fortawesome/free-solid-svg-icons";
import Donut1 from "./Chart/SmallChart";
import Button from 'react-bootstrap/Button';
import { Dashboard } from "@mui/icons-material";
import 'bootstrap/dist/css/bootstrap.min.css';



export default function ResturentDashboard() {
  const [saleData, setsaleData] = useState([]);
  const [purchaseData, setpurchaseData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const [showSale, setShowSale] = useState(false);

  const [CompanySaleComparison, setCompanySaleComparison] = useState([]);

  const [DailyDashboard, setDailyDashboard] = useState([]);
  const [DailyDashboardSale, setDailyDashboardSale] = useState([]);

  const [selectedfromDate, setSelectedfromDate] = useState(null);
  const [fromCalendarOpen, setfromCalendarOpen] = useState(false);
  const [fromInputDate, setfromInputDate] = useState("");

  const handlefromDateChange = (date) => {
    setSelectedfromDate(date);
    setfromInputDate(date ? formatDate(date) : "");
    setfromCalendarOpen(false);
  };

  const toggleFromCalendar = () => {
    setfromCalendarOpen((prevOpen) => !prevOpen);
  };

  const formatDate = (date) => {
    const day = date.getDate().toString().padStart(2, "0");
    const month = (date.getMonth() + 1).toString().padStart(2, "0");
    const year = date.getFullYear();
    return `${day}-${month}-${year}`;
  };

  //  SALE API DATA
  const purchasetoday = purchaseData.length > 0 ? purchaseData[0].today : null;
  const purchasemonth = purchaseData.length > 0 ? purchaseData[0].month : null;
  const purchaseyear = purchaseData.length > 0 ? purchaseData[0].year : null;

  //  PURCHASE API DATA
  const saletoday = saleData.length > 0 ? saleData[0].today : null;
  const salemonth = saleData.length > 0 ? saleData[0].month : null;
  const saleyear = saleData.length > 0 ? saleData[0].year : null;

  const [currentDate, setCurrentDate] = useState("");
  const [currentMonth, setCurrentMonth] = useState("");
  const [currentYear, setCurrentYear] = useState("");

  const organisation = getOrganisationData();
  const user = getUserData();
  const LocationNumner = user.tempcod;
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
    const currentDate = new Date();
    setSelectedfromDate(currentDate);
    setfromInputDate(formatDate(currentDate));
  }, []);

  useEffect(() => {
    const apiUrl = apiLinks + "/DashboardSale.php";
    const formData = new URLSearchParams({
      code: organisation.code,

      FLocCod: locationnumber || getLocationNumber,
      FYerDsc: yeardescription || getyeardescription,
    }).toString();

    axios
      .post(apiUrl, formData)
      .then((response) => {
        if (response.data && Array.isArray(response.data)) {
          setsaleData(response.data);
        } else {
          console.warn(
            "Response data structure is not as expected:",
            response.data
          );
          setsaleData([]);
        }
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  }, []);

  useEffect(() => {
    const apiUrl = apiLinks + "/DashboardPurchase.php";
    const formData = new URLSearchParams({
      code: organisation.code,

      FLocCod: locationnumber || getLocationNumber,
      FYerDsc: yeardescription || getyeardescription,

    }).toString();

    axios
      .post(apiUrl, formData)
      .then((response) => {
        if (response.data && Array.isArray(response.data)) {
          setpurchaseData(response.data);
        } else {
          console.warn(
            "Response data structure is not as expected:",
            response.data
          );
          setpurchaseData([]);
        }
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  }, []);

  useEffect(() => {
    const apiUrl = apiLinks + "/DashboardDaily.php";
    const formData = new URLSearchParams({
      FRepDat: fromInputDate,
      code: organisation.code,
      FLocCod: locationnumber || getLocationNumber,
    }).toString();

    axios
      .post(apiUrl, formData)
      .then((response) => {
        setDailyDashboard(response.data);
      })

      .catch((error) => {
        console.error("Error:", error);
      });
  }, [fromInputDate]);

  function fetchReceivableReport() {
    const apiUrl = apiLinks + "/CompanySaleComparison.php";
    setIsLoading(true);
    const formData = new URLSearchParams({
      FIntDat: fromInputDate,
      FFnlDat: fromInputDate,
      code: organisation.code,
      FLocCod: locationnumber || getLocationNumber,
    }).toString();

    axios
      .post(apiUrl, formData)
      .then((response) => {
        setIsLoading(false);

        if (response.data && Array.isArray(response.data.Detail)) {
          setCompanySaleComparison(response.data.Detail);
        } else {
          console.warn(
            "Response data structure is not as expected:",
            response.data
          );
          setCompanySaleComparison([]);
        }
      })
      .catch((error) => {
        console.error("Error:", error);
        setIsLoading(false);
      });
  }

  useEffect(() => {
    fetchReceivableReport();
  }, []);

  useEffect(() => {
    const apiUrl = apiLinks + "/DashboardDailySale.php";
    const formData = new URLSearchParams({
      FRepDat: fromInputDate,
      code: organisation.code,
      FLocCod: locationnumber || getLocationNumber,
    }).toString();

    axios
      .post(apiUrl, formData)
      .then((response) => {
        setDailyDashboardSale(response.data);
      })

      .catch((error) => {
        console.error("Error:", error);
      });
  }, [fromInputDate]);

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

  const tableHeadColor = "#3368b5";
  const textColor = "white";

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

  const getDayName = (dateString) => {
    const dateParts = dateString.split("-").map(Number); // Split date string into parts (day, month, year)
    const date = new Date(dateParts[2], dateParts[1] - 1, dateParts[0]); // Create Date object
    return date.toLocaleDateString("en-US", { weekday: "long" }); // Get day name
  };



  const [isOn, setIsOn] = useState(false);


  const [isOn2, setIsOn2] = useState(false);


  const [amountData, setAmountData] = useState({});
  console.log("amountData", amountData);



  const [Resturentdata, setResturentdata] = useState([]);
  console.log('Resturentdata', Resturentdata)



  const [CashBankBalancetotal, setCashBankBalancetotal] = useState([]);
  const [TotalReceivable, setTotalReceivable] = useState([]);
  const [TotalReceivabletotal, setTotalReceivabletotal] = useState([]);
  const [TotalPayable, setTotalPayable] = useState([]);
  const [TotalPayabletotal, setTotalPayabletotal] = useState([]);
  const [ItemStock, setItemStock] = useState([]);
  const [ItemStocktotal, setItemStocktotal] = useState([]);


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

  // Find the maximum value for scaling
  // const maxValue = Math.max(...chartData.map(item => item.value));



  // const data = Resturentdata?.ToDayCatgSaleQntyWise || [];

  // pick dataset based on toggle
  // const rawData = showSale
  //   ? Resturentdata?.ToDayCatgSaleAmountWise
  //   : Resturentdata?.ToDayCatgSaleQntyWise;

  // const data =
  //   rawData?.map((item) => ({
  //     ...item,
  //     Qnty: Number(item.Qnty ?? 0), // parse Qnty if exists
  //     Sale: Number((item.Sale ?? "0").toString().replace(/,/g, "")), // parse Sale
  //   })) || [];

  // // calculate max based on active dataset
  // const maxValue = showSale
  //   ? Math.max(...data.map((item) => item.Sale), 0)
  //   : Math.max(...data.map((item) => item.Qnty), 0);

  //   const Donutchart = (props) => {
  //     const options = {
  //       chart: {
  //         type: "donut",
  //         // width: "100px", // Increase chart width
  //         // height: "100px", // Increase chart height
  //       },
  //       title: {
  //         text: props.title, // Add your desired heading
  //         align: 'center', // Align the heading to the top-left
  //         style: {
  //           fontSize: '14px',
  //           fontWeight: 'bold',
  //           color: 'black',

  //         }
  //        },
  //         labels: ["Motor", "Fire", "Helth", "Marine", "Group"], // Labels for the series

  //       legend: {
  //         show: false, // Disable the legend
  //       },
  //       tooltip: {
  //         enabled: Tune, // Disable the tooltip
  //       },
  //       dataLabels: {
  //         enabled: false, // Disable data labels inside the chart
  //       },

  //       dataLabels: {
  //         enabled: true, // Enable data labels inside the chart
  //         style: {
  //           colors: ["black", "black", "black", "black", "black"], // Colors for each label
  //           fontSize: "14px",
  //           fontWeight: "300",
  //         },
  //         formatter: function (val, opts) {
  //           return opts.w.globals.labels[opts.seriesIndex]; // Show the label for each slice
  //         },
  //       },

  //       plotOptions: {
  //         pie: {
  //           donut: {
  //             size: "50%", // Adjust this value to increase or decrease the donut radius
  //           },
  //         },
  //       },

  //       responsive: [
  //         {
  //           breakpoint: 480,
  //           options: {
  //             chart: {
  //               width: 300, // Adjust for smaller screens
  //               height: 300,
  //             },
  //           },
  //         },
  //       ],
  //     };

  //     const series = [44, 55, 41, 17, 15]; // Data for the chart

  //     return (
  //       <div id="chart">
  //         <Chart options={options} series={series} type="donut" width={200} />
  //       </div>
  //     );
  //   };


  // ------- MAIN BAR CHART DATA ----------
  const rawData = showSale
    ? Resturentdata?.ToDayCatgSaleAmountWise
    : Resturentdata?.ToDayCatgSaleQntyWise;

  const data =
    rawData?.map((item) => ({
      ...item,
      Qnty: Number((item.Qnty ?? "0").toString().replace(/,/g, "")), // ✅ strip commas
      Sale: Number((item.Sale ?? "0").toString().replace(/,/g, "")), // ✅ strip commas
    })) || [];

  const maxValue = showSale
    ? Math.max(...data.map((item) => item.Sale), 0)
    : Math.max(...data.map((item) => item.Qnty), 0);

  // ------- DONUT CHART DATA (CURRENT MONTH) ----------
  const donutRawData = showSale
    ? Resturentdata?.CurrentMonthCatgSaleAmountWise
    : Resturentdata?.CurrentMonthCatgSaleQntyWise;

  const donutData =
    donutRawData?.map((item) => ({
      Category: item.Category || "N/A",
      Value: showSale
        ? Number((item.Sale ?? "0").toString().replace(/,/g, "")) // ✅ Sale parsing
        : Number((item.Qnty ?? "0").toString().replace(/,/g, "")), // ✅ Qnty parsing
    })) || [];

  const donutSeries = donutData.map((item) => item.Value);
  const donutLabels = donutData.map((item) => item.Category);


  // ------- DONUT CHART COMPONENT ----------
  // const Donutchart = ({ series, title }) => {
  //   // ✅ Guard: if no data, show "No Data Available"
  //   if (!series || series.length === 0 || series.every((val) => val === 0)) {
  //     return (
  //       <div style={{ textAlign: "center", fontSize: "13px", color: "gray" }}>
  //         No Data Available
  //       </div>
  //     );
  //   }

  //   const options = {
  //     chart: {
  //       type: "donut",
  //     },
  //     title: {
  //       text: title,
  //       align: "center",
  //       style: {
  //         fontSize: "14px",
  //         fontWeight: "bold",
  //         color: "black",
  //       },
  //     },
  //     // ❌ Removed labels
  //     labels: [],

  //     legend: {
  //       show: false, // hide legend also if you don’t want labels outside
  //     },
  //     tooltip: {
  //       enabled: true,
  //     },
  //     dataLabels: {
  //       enabled: false, // ❌ remove text inside slices
  //     },
  //     plotOptions: {
  //       pie: {
  //         donut: {
  //           size: "60%",
  //         },
  //       },
  //     },
  //   };

  //   return (
  //     <div id="donut-chart">
  //       <Chart options={options} series={series} type="donut" width={220} />
  //     </div>
  //   );
  // };

  const Donutchart = ({ series, labels, title }) => {
    // ✅ Guard: if no data, show "No Data Available"
    if (!series || series.length === 0 || series.every((val) => val === 0)) {
      return (
        <div style={{ textAlign: "center", fontSize: "13px", color: "gray" }}>
          No Data Available
        </div>
      );
    }

    const options = {
      chart: {
        type: "donut",
      },
      title: {
        text: title,
        align: "center",
        style: {
          fontSize: "14px",
          fontWeight: "bold",
          color: "black",
        },
      },
      // ✅ keep labels so tooltip shows Category names
      labels: labels,

      legend: {
        show: false, // keep false if you don’t want labels outside the donut
      },
      tooltip: {
        enabled: true,
        y: {
          formatter: function (val) {
            return val.toLocaleString(); // format values with commas
          },
        },
      },
      dataLabels: {
        enabled: false, // ❌ no text inside slices
      },
      plotOptions: {
        pie: {
          donut: {
            size: "55%",
          },
        },
      },
    };

    return (
      <div id="donut-chart">
        <Chart options={options} series={series} type="donut" width={220} />
      </div>
    );
  };




  const [showModal, setShowModal] = useState(false);

  const firstColWidth = {
    width: "16%",
  };
  const secondColWidth = {
    width: "60%",
  };
  const thirdColWidth = {
    width: "20%",
  };

  return (
    <>
      <div className="row Countair_styling" style={contentStyle}>
        {/* first left section */}

        <div className="main_left_section">
          {/* first left inner main 3 section */}
          <div className="left_inner_section1">
            {/* top inner card section */}
            {/* <div className="top_inner_cards_fist">
              <div className="sep_heading">
                <span className="first_span">September</span>
                <span className="first_span2" >{Resturentdata.MonthAmount || "0"} <span className="first_span2" style={{ marginLeft: '20px' }}>{Resturentdata.MonthInvoices || "0"}</span>  </span>
              </div>
              <div className="sep_heading">
                <span className="first_span">Today</span>
                <span className="first_span2">{Resturentdata.DayAmount || "0"}  <span className="first_span2" style={{ marginLeft: '20px' }}>{Resturentdata.DayInvoices || "0"}</span></span>
              </div>
            </div> */}

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
                <div className="col-md-8 ">
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

                  {data.map((item, index) => {
                    const value = showSale ? item.Sale : item.Qnty;
                    const percentage = maxValue ? (value / maxValue) * 100 : 0;

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

                          <div
                            style={{
                              display: "flex",
                              alignItems: "center",
                              gap: "8px",
                            }}
                          >
                            {/* Bar container */}
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
                                  background: showSale ? "#5F93CF" : "#5F93CF",
                                  transition: "width 0.3s ease",
                                }}
                              ></div>
                            </div>

                            {/* Value label */}
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

                <div
                  className="col-md-4"
                  style={{ display: "flex", justifyContent: "center", alignItems: "center" }}
                >
                  <Donutchart
                    series={donutSeries}
                    labels={donutLabels}  // pass Category names
                  // title={showSale ? "Current Month Sale" : "Current Month Quantity"}
                  />

                </div>
              </div>
            </div>;
          </div>
        </div>

        {/* first right  section */}
        <div className="main_right_section"></div>





      </div >
    </>
  );
}