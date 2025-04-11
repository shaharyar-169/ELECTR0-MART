import React, { useEffect, useState } from "react";
import './Dashboard.css'
import "react-datepicker/dist/react-datepicker.css";
import axios from "axios";
import Dounut from "./Chart/DountChart";
import BarChart from "./Chart/Barchart";
import { Spinner } from "react-bootstrap";
import DatePicker from "react-datepicker";
import { BsCalendar } from "react-icons/bs";
import { getOrganisationData, getUserData } from "../../Auth";
import { useTheme } from "../../../ThemeContext";
import Donut1 from "./Chart/SmallChart";
import { Dashboard } from "@mui/icons-material";
export default function Dasboard2() {

  const [saleData, setsaleData] = useState([])
  const [purchaseData, setpurchaseData] = useState([])
  const [isLoading, setIsLoading] = useState(false);

  const [CompanySaleComparison, setCompanySaleComparison] = useState([])

  const [DailyDashboard, setDailyDashboard] = useState([])
  const [DailyDashboardSale, setDailyDashboardSale] = useState([])

  console.log('DailyDashboardSale', DailyDashboardSale)


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


  const [currentDate, setCurrentDate] = useState('');
  const [currentMonth, setCurrentMonth] = useState('');
  const [currentYear, setCurrentYear] = useState('');


  const organisation = getOrganisationData();
  const user = getUserData();
  const LocationNumner = user.tempcod

  const {
    isSidebarVisible,
    getcolor,
    fontcolor,
    apiLinks,

  } = useTheme();


  useEffect(() => {
    const currentDate = new Date();
    setSelectedfromDate(currentDate);
    setfromInputDate(formatDate(currentDate));
  }, []);

  useEffect(() => {

    const apiUrl = apiLinks + "/DashboardSale.php";
    const formData = new URLSearchParams({
      // code: organisation.code,
      code: 'NASIRTRD',
      FLocCod: LocationNumner,
      FYerDsc: '2024-2024'
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

  }, [])

  useEffect(() => {

    const apiUrl = apiLinks + "/DashboardPurchase.php";
    const formData = new URLSearchParams({
      // code: organisation.code,
      code: 'NASIRTRD',
      FLocCod: LocationNumner,
      FYerDsc: '2024-2024'
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

  }, [])

  useEffect(() => {

    const apiUrl = apiLinks + "/DashboardDaily.php";
    const formData = new URLSearchParams({
      FRepDat: fromInputDate,
      code: 'NASIRTRD',
      FLocCod: '001',

    }).toString();

    axios
      .post(apiUrl, formData)
      .then((response) => {
        setDailyDashboard(response.data)
      })

      .catch((error) => {
        console.error("Error:", error);
      });

  }, [fromInputDate])

  function fetchReceivableReport() {


    const apiUrl = apiLinks + "/CompanySaleComparison.php";
    setIsLoading(true);
    const formData = new URLSearchParams({
      FIntDat: fromInputDate,
      FFnlDat: fromInputDate,
      FLocCod: '001',
      code: 'NASIRTRD'

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
  }, [])

  useEffect(() => {

    const apiUrl = apiLinks + "/DashboardDailySale.php";
    const formData = new URLSearchParams({
      FRepDat: fromInputDate,
      code: 'NASIRTRD',
      FLocCod: '001',

    }).toString();

    axios
      .post(apiUrl, formData)
      .then((response) => {
        setDailyDashboardSale(response.data)
      })

      .catch((error) => {
        console.error("Error:", error);
      });

  }, [fromInputDate])

  const contentStyle = {
    backgroundColor: getcolor,
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
    overflowY: "hidden",
    wordBreak: "break-word",
    textAlign: "center",
    // maxWidth: "1000px",
    fontSize: "15px",
    fontStyle: "normal",
    fontWeight: "400",
    lineHeight: "23px",
    fontFamily: '"Poppins", sans-serif',
    padding: '0px',
    Margin: '0px'
  };

  const tableHeadColor = "#3368b5";
  const textColor = "white";

  const firstColWidth = {
    width: "26%",
  };
  const secondColWidth = {
    width: "12%",
  };
  const thirdColWidth = {
    width: "22%",
  };
  const forthColWidth = {
    width: "18%",
  };

  const getDayName = (dateString) => {
    const dateParts = dateString.split("-").map(Number); // Split date string into parts (day, month, year)
    const date = new Date(dateParts[2], dateParts[1] - 1, dateParts[0]); // Create Date object
    return date.toLocaleDateString("en-US", { weekday: "long" }); // Get day name
  };



  useEffect(() => {
    const today = new Date();

    setCurrentDate(today.getDate());

    // Get full month name (e.g., "January")
    setCurrentMonth(today.getMonth());

    setCurrentYear(today.getFullYear());
  }, []);


  return (
    <>

      <div className="row Countair_styling" style={contentStyle} >
        {/* FIRST LEFT COLUMN */}
        {/* SECOND RIGHT COLUMN */}
        <div style={{ height: '100%', width: '100%', padding: '0px' }}>
          {/* FIRST ROW */}
          <div className="row Row_styling" >
            <div className="Card_styling_new" style={{ width: '20%' }}>
              <span className="card_heading">Purchase</span>
              <div className="row card_row_data" style={{ width: '100%' }}>
                <div className="col-md-6 text-start " style={{ color: 'black', paddingLeft: '5px' }}>Today</div>
                <div className="col-md-6 text-end " style={{ color: 'black', }} >{currentDate}</div>
              </div>
              <div className="row card_row_data" style={{ width: '100%' }}>
                <div className="col-md-6 text-start " style={{ color: 'black', paddingLeft: '5px' }}>This Month</div>
                <div className="col-md-6 text-end " style={{ color: 'black', }} >{currentMonth}</div>
              </div>
              <div className="row card_row_data" style={{ width: '100%' }}>
                <div className="col-md-6 text-start" style={{ color: 'black', paddingLeft: '5px' }}>This Year</div>
                <div className="col-md-6 text-end " style={{ color: 'black', }} >{currentYear}</div>
              </div>
            </div>
            <div className="Card_styling_new" style={{ width: '20%' }}>
              <span className="card_heading">Sales</span>
              <div className="row card_row_data" style={{ width: '100%' }}>
                <div className="col-md-6 text-start " style={{ color: 'black', paddingLeft: '5px' }}>Today</div>
                <div className="col-md-6 text-end " style={{ color: 'black' }} >{currentDate}</div>
              </div>
              <div className="row card_row_data" style={{ width: '100%' }}>
                <div className="col-md-6 text-start " style={{ color: 'black', paddingLeft: '5px' }}>This Month</div>
                <div className="col-md-6 text-end " style={{ color: 'black', }} >{currentMonth}</div>
              </div>
              <div className="row card_row_data" style={{ width: '100%' }}>
                <div className="col-md-6 text-start" style={{ color: 'black', paddingLeft: '5px' }}>This Year</div>
                <div className="col-md-6 text-end " style={{ color: 'black', }} >{currentYear}</div>
              </div>
            </div>
            <div className="Card_styling_new" style={{ width: '22%' }}>
              {/* <span className="card_heading">Purchase</span> */}
              <div className="row card_row_data" style={{ width: '100%' }}>
                <div className="col-md-6 text-start " style={{ color: 'black', paddingLeft: '5px', marginTop: '10px' }}>Total</div>
                <div className="col-md-6 text-end " style={{ color: 'black', marginTop: '10px' }} >{75}</div>
              </div>
              <div className="row card_row_data" style={{ width: '100%' }}>
                <div className="col-md-6 text-start " style={{ color: 'black', paddingLeft: '5px' }}>Present</div>
                <div className="col-md-6 text-end " style={{ color: 'black', }} >{11}</div>
              </div>
              <div className="row card_row_data" style={{ width: '100%' }}>
                <div className="col-md-6 text-start" style={{ color: 'black', paddingLeft: '5px' }}>Absent</div>
                <div className="col-md-6 text-end " style={{ color: 'black', }} >{33}</div>
              </div>

              <div className="row card_row_data" style={{ width: '100%' }}>
                <div className="col-md-6 text-start" style={{ color: 'black', paddingLeft: '5px' }}>Late</div>
                <div className="col-md-6 text-end " style={{ color: 'black', }} >{64}</div>
              </div>
            </div>

            <div className="Card_styling_new" style={{ width: '23%', display: 'flex', flexWrap: 'wrap', columnGap: '10px', }}>

              <div style={{ width: '110px', height: '40px', border: '1px solid black', marginTop: '12px', borderRadius: '5px' }}>
                <div style={{ width: '70px', paddingLeft: '3px', marginLeft: '10px', marginTop: '-12px', fontSize: '12px', background: '#F8F8F8', fontWeight: '600' }}>Customers</div>
                <div style={{ textAlign: 'center' }}>584</div>
              </div>

              <div style={{ width: '110px', height: '40px', border: '1px solid black', marginTop: '12px', borderRadius: '5px' }}>
                <div style={{ width: '65px', paddingLeft: '3px', marginLeft: '10px', marginTop: '-12px', fontSize: '12px', background: '#F8F8F8', fontWeight: '600' }}>Salesman</div>
                <div style={{ textAlign: 'center' }}>9</div>
              </div>

              <div style={{ width: '110px', height: '40px', border: '1px solid black', marginTop: '12px', borderRadius: '5px' }}>
                <div style={{ width: '30px', paddingLeft: '5px', marginLeft: '10px', marginTop: '-12px', fontSize: '12px', background: '#F8F8F8', fontWeight: '600' }}>City</div>
                <div style={{ textAlign: 'center' }}>9</div>
              </div>

              <div style={{ width: '110px', height: '40px', border: '1px solid black', marginTop: '12px', borderRadius: '5px' }}>
                <div style={{ width: '35px', paddingLeft: '5px', marginLeft: '10px', marginTop: '-12px', fontSize: '12px', background: '#F8F8F8', fontWeight: '600' }}>Area</div>
                <div style={{ textAlign: 'center' }}>22</div>
              </div>
            </div>
            <div className="Card_styling_new" style={{ width: '11%' }}>
              <div style={{ width: '105px', height: '90px', border: '1px solid black', marginTop: '15px', borderRadius: '5px' }}>
                <div style={{ width: '70px', paddingLeft: '5px', marginLeft: '5px', marginTop: '-12px', fontSize: '12px', background: '#F8F8F8', fontWeight: '600' }}>Technician</div>
                <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '80%', width: '100%' }}>163</div>
              </div>

            </div>

          </div>

          <div className="row Row_styling" style={{ marginTop: '5px' }}>

            <div className="Card_styling_new" style={{ width: '32%', height: '200px', marginTop: '10px', boxShadow: '5px 5px 10px grey' }}>


              {/* <div className="col-md-6 inner_section_first_column"  >
                  <Donut1 />
                </div> */}
              <div className="col-md-12 inner_section_first_column1">
                <div className="row leable_row_styling" >
                  <div className="col-md-4 lable_left_section" style={{ background: '#3368B5', padding: '0px' }}>
                    O/S Cus
                  </div>
                  <div className="col-md-8 lable_right_section">
                    {DailyDashboard.CashBankBal}
                  </div>
                </div>
                <div className="row leable_row_styling" >
                  <div className="col-md-4 lable_left_section" style={{ background: '#3368B5', padding: '0px' }}>
                    Nill Cus
                  </div>
                  <div className="col-md-8 lable_right_section">
                    {DailyDashboard.Receivable}
                  </div>
                </div>
                <div className="row leable_row_styling" >
                  <div className="col-md-4 lable_left_section" style={{ background: '#3368B5', padding: '0px' }}>
                    Adv Cus
                  </div>
                  <div className="col-md-8 lable_right_section">
                    {DailyDashboard.Payable}

                  </div>
                </div>
                <div className="row leable_row_styling" >
                  <div className="col-md-4 lable_left_section" style={{ background: '#3368B5', padding: '0px' }}>
                    Non Active
                  </div>
                  <div className="col-md-8 lable_right_section">
                    {0}
                  </div>
                </div>



              </div>
            </div>

            <div className="Card_styling_new" style={{ width: '32%', height: '200px', marginTop: '10px', boxShadow: '5px 5px 10px grey' }}>

              <div className="col-md-12 inner_section_first_column1">
                <div className="row leable_row_styling" >
                  <div className="col-md-4 lable_left_section" style={{ background: '#3368B5', padding: '0px' }}>
                    C&B
                  </div>
                  <div className="col-md-8 lable_right_section">
                    {DailyDashboard.CashBankBal}
                  </div>
                </div>
                <div className="row leable_row_styling" >
                  <div className="col-md-4 lable_left_section" style={{ background: '#3368B5', padding: '0px' }}>
                    Receivable
                  </div>
                  <div className="col-md-8 lable_right_section">
                    {DailyDashboard.Receivable}
                  </div>
                </div>
                <div className="row leable_row_styling" >
                  <div className="col-md-4 lable_left_section" style={{ background: '#3368B5', padding: '0px' }}>
                    Payable
                  </div>
                  <div className="col-md-8 lable_right_section">
                    {DailyDashboard.Payable}

                  </div>
                </div>
                <div className="row leable_row_styling" >
                  <div className="col-md-4 lable_left_section" style={{ background: '#3368B5', padding: '0px' }}>
                    Stock
                  </div>
                  <div className="col-md-8 lable_right_section">
                    {0}
                  </div>
                </div>


              </div>
            </div>



            <div style={{ backgroundColor: '#F8F8F8', height: '210px', marginTop: '10px', width: '34%', display: 'flex', flexWrap: 'wrap', columnGap: '10px', background: 'white', borderRadius: '10px', boxShadow: 'rgba(50, 50, 93, 0.25) 0px 13px 27px -5px, rgba(0, 0, 0, 0.3) 0px 8px 16px -8px'
            }}>
              {/* <div style={{width:'90px', height:'40px', border:'1px solid black', marginTop:'10px', borderRadius:'5px'}}>
              <div style={{width:'60px',marginLeft:'5px' ,marginTop:'-12px', fontSize:'12px', background:'white'}}>Technician</div>
              <div>163</div>
            </div> */}
              <div style={{ width: '90px', height: '40px', border: '1px solid black', marginTop: '15px', borderRadius: '5px' }}>
                <div style={{ width: '60px', marginLeft: '5px', marginTop: '-12px', fontSize: '12px', background: '#F8F8F8', fontWeight: '600' }}>Total Jobs</div>
                <div>404</div>
              </div>
              <div style={{ width: '90px', height: '40px', border: '1px solid black', marginTop: '15px', borderRadius: '5px' }}>
                <div style={{ width: '60px', marginLeft: '5px', marginTop: '-12px', fontSize: '12px', background: '#F8F8F8', fontWeight: '600' }}>Apr Jobs</div>
                <div>92</div>
              </div>
              <div style={{ width: '90px', height: '40px', border: '1px solid black', marginTop: '15px', borderRadius: '5px' }}>
                <div style={{ width: '60px', marginLeft: '5px', marginTop: '-12px', fontSize: '12px', background: '#F8F8F8', fontWeight: '600' }}>O/S Jobs</div>
                <div>1</div>
              </div>


              <div style={{ width: '100%', height: '60px', border: '1px solid black', marginTop: '10px', borderRadius: '5px', }}>
                <div style={{ width: '100px', marginLeft: '5px', marginTop: '-12px', fontSize: '12px', background: '#F8F8F8', fontWeight: '600' }}>Current Status</div>

                <div style={{ display: 'flex', justifyContent: 'space-evenly', width: '100%', height: '100%' }}>
                  <div style={{ height: '40px', lineHeight: '18px', width: '80px', border: '1px solid black', borderRadius: '5px', boxShadow: ' rgba(0, 0, 0, 0.1) 0px 4px 12px' }}>
                    <span style={{ color: "blue" }}>Unassigned <br /> 4</span>
                  </div>
                  <div style={{ height: '40px', lineHeight: '18px', width: '80px', border: '1px solid black', borderRadius: '5px', boxShadow: ' rgba(0, 0, 0, 0.1) 0px 4px 12px' }}>
                    <span style={{ color: "red" }}>Pending <br /> 61</span>
                  </div>

                  <div style={{ height: '40px', lineHeight: '18px', width: '80px', border: '1px solid black', borderRadius: '5px', boxShadow: ' rgba(0, 0, 0, 0.1) 0px 4px 12px' }}>
                    <span style={{ color: "black" }}>Done <br /> 0</span>
                  </div>

                  <div style={{ height: '40px', lineHeight: '18px', width: '80px', border: '1px solid black', borderRadius: '5px', boxShadow: ' rgba(0, 0, 0, 0.1) 0px 4px 12px' }}>
                    <span style={{ color: "black" }}>Closed <br /> 343</span>
                  </div>
                </div>

              </div>



              <div style={{ background: 'white', width: '100%', height: '60px', border: '1px solid black', marginTop: '10px', borderRadius: '5px', backgroundColor: 'rgb(248, 248, 248)' }}>
                <div style={{ width: '100px', marginLeft: '5px', marginTop: '-12px', fontSize: '12px', background: '#F8F8F8', fontWeight: '600' }}>Pending Jobs</div>

                <div style={{ display: 'flex', justifyContent: 'space-evenly', width: '100%', height: '100%' }}>
                  <div style={{ height: '40px', lineHeight: '18px', width: '60px' }}>
                    <span style={{ color: "black" }}>Two <br /> 36</span>
                  </div>
                  <div style={{ height: '40px', lineHeight: '18px', width: '60px' }}>
                    <span style={{ color: "black" }}>Five <br /> 10</span>
                  </div>

                  <div style={{ height: '40px', lineHeight: '18px', width: '60px' }}>
                    <span style={{ color: "black" }}>Seven <br /> 2</span>
                  </div>

                  <div style={{ height: '40px', lineHeight: '18px', width: '60px' }}>
                    <span style={{ color: "black" }}>Ten <br /> 0</span>
                  </div>

                  <div style={{ height: '40px', lineHeight: '18px', width: '60px' }}>
                    <span style={{ color: "black" }}>Ten + <br /> 13</span>
                  </div>
                </div>

              </div>
            </div>



          </div>
          {/* SECOND GRAPH/CHART ROW */}
          <div className="row Row_styling" style={{ marginTop: '10px' }}>

            <div style={{ width: '50%', padding: '0px' }}>
              {/* <div className="Diamond_section" style={{rowGap:'5px'}}>
                <div className="row  first_diamond" style={{ display: 'flex', alignItems: 'center', justifyContent: 'start', columnGap: '15px', flexDirection: 'row' }}>

                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    padding: '0',
                    fontSize: '12px',
                    height: '40px',
                    width: '40px',
                    boxShadow: '5px 5px 10px grey',
                    background: '#2196F3',
                    color: 'white',
                    transform: 'rotate(45deg)',
                    // position: 'relative',
                    top: '35px',
                    borderRadius: '10px',

                  }}>
                    <div style={{
                      transform: 'rotate(-45deg)',
                      textAlign: 'center'
                    }}>
                      <div style={{ lineHeight: '14px' }}>{DailyDashboard['Day-One']}<br />{DailyDashboard['Date-One']}</div>
                    </div>
                  </div>
                  <div className="Diamond_sale" style={{ padding: '0px', width: '20%', height: '65%', borderRadius: '5px', boxShadow: '5px 5px 10px grey', }}>
                    {DailyDashboard['Qnty-One']}
                  </div>
                  <div className="Diamond_sale" style={{ padding: '0px', width: '40%', height: '65%', borderRadius: '5px', boxShadow: '5px 5px 10px grey', }}>
                    {DailyDashboard['Sale-One']}
                  </div>

                </div>

                <div className="row  first_diamond" style={{ display: 'flex', alignItems: 'center', justifyContent: 'end', columnGap: '15px', flexDirection: 'row' }}>

                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    padding: '0',
                    fontSize: '12px',
                    height: '40px',
                    width: '40px',
                    boxShadow: '5px 5px 10px grey',
                    background: '#2196F3',
                    color: 'white',
                    transform: 'rotate(45deg)',
                    // position: 'relative',
                    top: '35px',
                    borderRadius: '10px',

                  }}>
                    <div style={{
                      transform: 'rotate(-45deg)',
                      textAlign: 'center'
                    }}>
                      <div style={{ lineHeight: '14px' }}>{DailyDashboard['Day-Two']}<br />{DailyDashboard['Date-Two']}</div>
                    </div>
                  </div>
                  <div className="Diamond_sale" style={{ padding: '0px', width: '20%', height: '65%', borderRadius: '5px', boxShadow: '5px 5px 10px grey', }}>
                    {DailyDashboard['Qnty-Two']}
                  </div>
                  <div className="Diamond_sale" style={{ padding: '0px', width: '40%', height: '65%', borderRadius: '5px', boxShadow: '5px 5px 10px grey', }}>
                    {DailyDashboard['Sale-Two']}
                  </div>

                </div>

                <div className="row  first_diamond" style={{ display: 'flex', alignItems: 'center', justifyContent: 'start', columnGap: '15px', flexDirection: 'row' }}>

                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    padding: '0',
                    fontSize: '12px',
                    height: '40px',
                    width: '40px',
                    boxShadow: '5px 5px 10px grey',
                    background: '#2196F3',
                    color: 'white',
                    transform: 'rotate(45deg)',
                    // position: 'relative',
                    top: '35px',
                    borderRadius: '10px',

                  }}>
                    <div style={{
                      transform: 'rotate(-45deg)',
                      textAlign: 'center'
                    }}>
                      <div style={{ lineHeight: '14px' }}>{DailyDashboard['Day-Three']}<br />{DailyDashboard['Date-Three']}</div>
                    </div>
                  </div>
                  <div className="Diamond_sale" style={{ padding: '0px', width: '20%', height: '65%', borderRadius: '5px', boxShadow: '5px 5px 10px grey' }}>
                    {DailyDashboard['Qnty-Three']}
                  </div>
                  <div className="Diamond_sale" style={{ padding: '0px', width: '40%', height: '65%', borderRadius: '5px', boxShadow: '5px 5px 10px grey', }}>
                    {DailyDashboard['Sale-Three']}
                  </div>

                </div>

                <div className="row  first_diamond" style={{ display: 'flex', alignItems: 'center', justifyContent: 'end', columnGap: '15px', flexDirection: 'row' }}>

                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    padding: '0',
                    fontSize: '12px',
                    height: '40px',
                    width: '40px',
                    boxShadow: '5px 5px 10px grey',
                    background: '#2196F3',
                    color: 'white',
                    transform: 'rotate(45deg)',
                    // position: 'relative',
                    top: '35px',
                    borderRadius: '10px',

                  }}>
                    <div style={{
                      transform: 'rotate(-45deg)',
                      textAlign: 'center'
                    }}>
                      <div style={{ lineHeight: '14px' }}>{DailyDashboard['Day-Four']}<br />{DailyDashboard['Date-Four']}</div>
                    </div>
                  </div>
                  <div className="Diamond_sale" style={{ padding: "0px", width: '20%', height: '65%', borderRadius: '5px', boxShadow: '5px 5px 10px grey', }}>
                    {DailyDashboard['Qnty-Four']}
                  </div>
                  <div className="Diamond_sale" style={{ padding: '0px', width: '40%', height: '65%', borderRadius: '5px', boxShadow: '5px 5px 10px grey', }}>
                    {DailyDashboard['Sale-Four']}
                  </div>

                </div>

              </div> */}

              <div className="Card_styling_new" style={{ height: '90px', width: '100%', marginTop: '10px', boxShadow: '5px 5px 10px grey' }}>

                <div style={{ color: '#3368B5' }}>Total Receivable</div>

                <div style={{ display: 'flex', width: '100%', flexWrap: 'wrap', height: '75.5%' }}>
                  <div style={{ height: '50%', width: '16.65%', border: '1px solid lightgrey', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                    {'< 30'}
                  </div>
                  <div style={{ height: '50%', width: '16.65%', border: '1px solid lightgrey', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                    {'31 - 60'}
                  </div>
                  <div style={{ height: '50%', width: '16.65%', border: '1px solid lightgrey', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                    {'61 - 90'}
                  </div>
                  <div style={{ height: '50%', width: '16.65%', border: '1px solid lightgrey', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                    {'91 - 120'}
                  </div>

                  <div style={{ height: '50%', width: '16.65%', border: '1px solid lightgrey', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                    {'121 - 180'}
                  </div>
                  <div style={{ height: '50%', width: '16.65%', border: '1px solid lightgrey', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                    {'180+'}
                  </div>
                  <div style={{ height: '50%', width: '16.65%', border: '1px solid lightgrey' }}></div>
                  <div style={{ height: '50%', width: '16.65%', border: '1px solid lightgrey' }}></div>
                  <div style={{ height: '50%', width: '16.65%', border: '1px solid lightgrey' }}></div>
                  <div style={{ height: '50%', width: '16.65%', border: '1px solid lightgrey' }}></div>
                  <div style={{ height: '50%', width: '16.65%', border: '1px solid lightgrey' }}></div>
                </div>
              </div>
              <div className="Card_styling_new" style={{ height: '90px', width: '100%', marginTop: '10px', boxShadow: '5px 5px 10px lightgrey' }}>

                <div style={{ color: '#3368B5' }}>Outstanding</div>

                <div style={{ display: 'flex', width: '100%', flexWrap: 'wrap', height: '75.5%' }}>


                  <div style={{ height: '50%', width: '16.65%', border: '1px solid lightgrey', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                    {'< 0'}
                  </div>
                  <div style={{ height: '50%', width: '16.65%', border: '1px solid lightgrey', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                    {'< 1M'}
                  </div>

                  <div style={{ height: '50%', width: '16.65%', border: '1px solid lightgrey', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                    {'< 2M'}
                  </div>

                  <div style={{ height: '50%', width: '16.65%', border: '1px solid lightgrey', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                    {'< 5M'}
                  </div>

                  <div style={{ height: '50%', width: '16.65%', border: '1px solid lightgrey', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                    {'< 10M'}
                  </div>
                  <div style={{ height: '50%', width: '16.65%', border: '1px solid lightgrey', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                    {'10M+'}
                  </div>
                  <div style={{ height: '50%', width: '16.65%', border: '1px solid lightgrey' }}></div>
                  <div style={{ height: '50%', width: '16.65%', border: '1px solid lightgrey' }}></div>
                  <div style={{ height: '50%', width: '16.65%', border: '1px solid lightgrey' }}></div>
                  <div style={{ height: '50%', width: '16.65%', border: '1px solid lightgrey' }}></div>
                  <div style={{ height: '50%', width: '16.65%', border: '1px solid lightgrey' }}></div>
                  <div style={{ height: '50%', width: '16.65%', border: '1px solid lightgrey' }}></div>
                </div>
              </div>
            </div>

            <div className="second_container_card2" style={{ display: 'flex', justifyContent: 'space-between', background: 'white' }}>
              <BarChart />
            </div>
          </div>
          {/* THIRD TABLE ROW */}


        </div>
      </div>

    </>
  );
}
