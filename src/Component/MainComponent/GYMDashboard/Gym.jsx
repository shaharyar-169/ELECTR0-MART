import React, { useEffect, useState } from "react";
import './gymstyling.css'
import "react-datepicker/dist/react-datepicker.css";
import axios from "axios";
import { Spinner } from "react-bootstrap";
import DatePicker from "react-datepicker";
import { BsCalendar } from "react-icons/bs";
import Chart from "react-apexcharts";
import { TodayOutlined, Tune } from "@mui/icons-material";
import { getOrganisationData, getUserData, getYearDescription, getLocationnumber } from "../../Auth";
import { useTheme } from "../../../ThemeContext";
import { Sparklines, SparklinesBars, SparklinesLine } from "react-sparklines";
import { faToggleOff } from "@fortawesome/free-solid-svg-icons";
import { FaDollarSign, FaAddressBook} from "react-icons/fa6";
import { FaBalanceScale } from "react-icons/fa";

import Button from 'react-bootstrap/Button';
import { Dashboard } from "@mui/icons-material";
import 'bootstrap/dist/css/bootstrap.min.css';



export default function GYMDashboard() {
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
        overflowY: "hidden",
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



    return (
        <>
            <div className="row Countair_styling" style={contentStyle}>
                <div className="main_section1">
                    <div className="main_inner_section1">
                        <div className="row  inner_section_card" >
                            <div className="col-md-7 text-start pt-2 ">
                                <div>
                                    <span className="heading_styling">
                                        Total
                                    </span>
                                </div>
                                <div>
                                    <span className="  heading_styling">
                                        Today
                                    </span>
                                </div>
                                <div>
                                    <span className="heading_styling">
                                        This Month
                                    </span>
                                </div>
                                <div>
                                    <span className="heading_styling">
                                        Left
                                    </span>
                                </div>
                            </div>
                            <div className="col-md-5 text-end pt-2">
                                <div>
                                    <span className="heading_styling">
                                        1352
                                    </span>
                                </div>
                                <div>
                                    <span className="heading_styling">
                                        1
                                    </span>
                                </div>
                                <div>
                                    <span className="heading_styling">
                                        193
                                    </span>
                                </div>
                                <div>
                                    <span className="heading_styling">
                                        0
                                    </span>
                                </div>

                            </div>
                        </div>



                        <div className="attendence_card " style={{ marginLeft: '20px' }}>
                            <div className="attendance_heading">
                                <div className="atten">Attendence</div>
                                <div className="date">Fri, 03-10-2025 <span className="dijit">56</span></div>
                            </div>

                            <div className="car_container">
                                <div className="card">
                                    <span className="inner_span">Tue</span>
                                    <span className="inner_span">30/9</span>
                                    <span className="inner_span2">5</span>

                                </div>
                                <div className="card">
                                    <span className="inner_span">Tue</span>
                                    <span className="inner_span">30/9</span>
                                    <span className="inner_span2">5</span>

                                </div>
                                <div className="card">
                                    <span className="inner_span">Tue</span>
                                    <span className="inner_span">30/9</span>
                                    <span className="inner_span2">5</span>

                                </div>
                                <div className="card">
                                    <span className="inner_span">Tue</span>
                                    <span className="inner_span">30/9</span>
                                    <span className="inner_span2">5</span>

                                </div>
                            </div>
                        </div>

                        <div className="attendence_card " style={{ marginLeft: '10px' }}>
                            <div className="attendance_heading">
                                <div className="absent" style={{ color: 'orange' }}>Absent Aging</div>
                                {/* <div className="date">Fri, 03-10-2025 <span className="dijit">56</span></div> */}
                            </div>

                            <div className="car_container">
                                <div className="card2" style={{ backgroundColor: 'rgb(253, 230, 161)', borderColor: 'orange' }}>
                                    <span className="inner_span1">7 Days</span>
                                    <span className="inner_span3" style={{ backgroundColor: "orange" }}>5</span>

                                </div>
                                <div className="card2" style={{ backgroundColor: 'rgb(253, 230, 161)', borderColor: 'orange' }}>
                                    <span className="inner_span1">15 Days</span>
                                    <span className="inner_span3" style={{ backgroundColor: "orange" }}>5</span>

                                </div>
                                <div className="card2" style={{ backgroundColor: 'rgb(253, 230, 161)', borderColor: 'orange' }}>
                                    <span className="inner_span1">30 Days</span>
                                    <span className="inner_span3" style={{ backgroundColor: "orange" }}>5</span>

                                </div>
                                <div className="card2" style={{ backgroundColor: 'rgb(253, 230, 161)', borderColor: 'orange' }}>
                                    <span className="inner_span1">30 + Days</span>
                                    <span className="inner_span3" style={{ backgroundColor: "orange" }}>5</span>

                                </div>
                            </div>
                        </div>

                        <div className="attendence_card " style={{ marginLeft: '10px' }}>
                            <div className="attendance_heading">
                                <div className="absent" style={{ color: 'purple' }}>Non-Payment Aging</div>
                                {/* <div className="date">Fri, 03-10-2025 <span className="dijit">56</span></div> */}
                            </div>

                            <div className="car_container">
                                <div className="card2" style={{ borderColor: 'purple', backgroundColor: 'rgb(250, 213, 250)' }}>
                                    <span className="inner_span1">30 Days</span>
                                    <span className="inner_span3" style={{ backgroundColor: 'purple' }}>5</span>

                                </div>
                                <div className="card2" style={{ borderColor: 'purple', backgroundColor: 'rgb(250, 213, 250)' }}>
                                    <span className="inner_span1">60 Days</span>
                                    <span className="inner_span3" style={{ backgroundColor: 'purple' }}>5</span>

                                </div>
                                <div className="card2" style={{ borderColor: 'purple', backgroundColor: 'rgb(250, 213, 250)' }}>
                                    <span className="inner_span1">90 Days</span>
                                    <span className="inner_span3" style={{ backgroundColor: 'purple' }}>5</span>

                                </div>
                                <div className="card2" style={{ borderColor: 'purple', backgroundColor: 'rgb(250, 213, 250)' }}>
                                    <span className="inner_span1">90 + Days</span>
                                    <span className="inner_span3" style={{ backgroundColor: 'purple' }}>5</span>

                                </div>
                            </div>
                        </div>

                    </div>


                    <div className="main_inner_section2">
                        <div className="row  inner_section_split_card" >
                            <div className="verticle_split">
                                <span className="total_slot">Total Slot</span><br />
                                <span className="numer">24</span>
                            </div>
                            <div className="verticle_split">
                                <span className="total_slot">Total Trainers</span><br />
                                <span className="numer">8</span>
                            </div>
                        </div>

                        <div className="expenes_card_section" style={{ marginLeft: '20px' }}>
                            <div className="inner_expense_card">
                                <span className="icon_styling"><FaDollarSign /></span>
                                <span className="icon_heading">Receivable</span>
                                <span className="icon_number">1,179,850</span>

                            </div>
                            <div className="inner_expense_card">
                                <span className="icon_styling"><FaAddressBook /></span>
                                <span className="icon_heading">Collected</span>
                                <span className="icon_number">1,179,850</span>

                            </div>
                            <div className="inner_expense_card">
                                <span className="icon_styling"><FaBalanceScale /></span>
                                <span className="icon_heading">Balance</span>
                                <span className="icon_number">1,179,850</span>

                            </div>
                        </div>
                    </div>
                </div>
            </div >
        </>
    );
}