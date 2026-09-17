import React, { useEffect, useRef, useState } from "react";
import "./InstallmentDashboard.css"; // Imported custom styling
import "react-datepicker/dist/react-datepicker.css";
import axios from "axios";
import { Spinner } from "react-bootstrap";
import DatePicker from "react-datepicker";
import { 
  BsCalendar, 
  BsPeople, 
  BsCheckCircle, 
  BsCurrencyDollar, 
  BsWallet2, 
  BsPieChart, 
  BsExclamationTriangle,
  BsBagCheck,
  BsArrowUpRight,
  BsFilter
} from "react-icons/bs";
import { getOrganisationData, getUserData } from "../../Auth";
import { useTheme } from "../../../ThemeContext";

export default function InstallmentDashboard() {

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

  const contentStyle = {
    minHeight: "100vh",
    background: "#e5e6e6",
    fontFamily: "Inter, system-ui, sans-serif",
    fontSize: "12px",
    width: "100%",
    maxWidth: "1920px",
    marginTop: "-55px",
    height: "100vh",
    overflowY: "auto",
    overflowX: "hidden",
    position: "relative",
    zIndex: 1,
    boxSizing: "border-box",
    padding: "28px 32px",
    transition: "background 0.3s ease, color 0.3s ease",
  };

  return (
    <div style={contentStyle}>
      <div className="dashboard-container">
        
        {/* TOP ROW: KPI STAT CARDS */}
        <div className="top-stats-row">
          <div className="stat-card">
            <div className="stat-icon-wrapper blue"><BsPeople /></div>
            <div className="stat-details">
              <span className="stat-label">Total Customers</span>
              <span className="stat-value">1,248</span>
              <span className="stat-change">+ 6.8% vs Apr</span>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon-wrapper teal"><BsCheckCircle /></div>
            <div className="stat-details">
              <span className="stat-label">Active Installments</span>
              <span className="stat-value">1,086</span>
              <span className="stat-change">+ 5.4% vs Apr</span>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon-wrapper dark-blue"><BsCurrencyDollar /></div>
            <div className="stat-details">
              <span className="stat-label">Total Installment Amount</span>
              <span className="stat-value">Rs. 12.80M</span>
              <span className="stat-change">+ 8.2% vs Apr</span>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon-wrapper green"><BsWallet2 /></div>
            <div className="stat-details">
              <span className="stat-label">Total Collections (MTD)</span>
              <span className="stat-value">Rs. 3.80M</span>
              <span className="stat-change">+ 12.6% vs Apr</span>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon-wrapper orange"><BsPieChart /></div>
            <div className="stat-details">
              <span className="stat-label">Installment Status</span>
              <span className="stat-value">Rs. 2.45M</span>
              <span className="stat-change">+ 10.5% vs Apr</span>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon-wrapper red"><BsExclamationTriangle /></div>
            <div className="stat-details">
              <span className="stat-label">Month Status</span>
              <span className="stat-value">Rs. 420K</span>
              <span className="stat-change">+ 2.1% vs Apr</span>
            </div>
          </div>
        </div>

        {/* SECOND ROW: MONTHLY COLLECTION PERFORMANCE & CUSTOMER DETAILS */}
        <div className="dashboard-grid-2">
          {/* Left Box: Monthly Performance */}
          <div className="card-box">
            <div className="card-header">
              <span className="card-title">Monthly Installment Collection Performance</span>
              <button className="card-header-btn">Days Remaining: 3</button>
            </div>

            <div className="metrics-strip">
              <div className="metric-item">
                <div className="metric-title">Monthly Target</div>
                <div className="metric-val blue">Rs. 5.20M</div>
              </div>
              <div className="metric-item">
                <div className="metric-title">Expected Till Today</div>
                <div className="metric-val amber">Rs. 4.10M</div>
              </div>
              <div className="metric-item">
                <div className="metric-title">Collected</div>
                <div className="metric-val green">Rs. 3.80M</div>
              </div>
              <div className="metric-item">
                <div className="metric-title">Receivable</div>
                <div className="metric-val amber">Rs. 1.40M</div>
              </div>
              <div className="metric-item">
                <div className="metric-title">Outstanding</div>
                <div className="metric-val red">Rs. 320K</div>
              </div>
            </div>

            <div className="chart-row">
              <div className="donut-box">
                <div className="donut-wrapper">
                  <svg width="70" height="70" viewBox="0 0 36 36">
                    <path
                      d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                      fill="none" stroke="#e5e7eb" strokeWidth="3.8"
                    />
                    <path
                      d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                      fill="none" stroke="#059669" strokeWidth="3.8"
                      strokeDasharray="73, 100"
                    />
                  </svg>
                  <div className="donut-inner-text">
                    <div className="donut-percentage">73%</div>
                    <div className="donut-sub">Collected</div>
                  </div>
                </div>
                <div className="donut-legend">
                  <div><span className="legend-dot" style={{background: '#059669'}}></span>Collected 73%</div>
                  <div><span className="legend-dot" style={{background: '#d1d5db'}}></span>Remaining 27%</div>
                </div>
              </div>

              <div className="horizontal-bars-container">
                <div className="bar-group">
                  <span className="bar-label">Target</span>
                  <div className="bar-track">
                    <div className="bar-fill" style={{width: '100%', backgroundColor: '#2563eb'}}></div>
                  </div>
                  <span className="bar-value">5.20M</span>
                </div>
                <div className="bar-group">
                  <span className="bar-label">Expected</span>
                  <div className="bar-track">
                    <div className="bar-fill" style={{width: '78%', backgroundColor: '#f59e0b'}}></div>
                  </div>
                  <span className="bar-value">4.10M</span>
                </div>
                <div className="bar-group">
                  <span className="bar-label">Collected</span>
                  <div className="bar-track">
                    <div className="bar-fill" style={{width: '73%', backgroundColor: '#10b981'}}></div>
                  </div>
                  <span className="bar-value">3.80M</span>
                </div>
              </div>
            </div>
          </div>

          {/* Right Box: Customer Collection Details Table */}
          <div className="card-box">
            <div className="card-header">
              <span className="card-title">Customer Collection Details</span>
              <button className="card-header-btn">View All Customers</button>
            </div>
            <div style={{overflowX: 'auto'}}>
              <table className="custom-table">
                <thead>
                  <tr>
                    <th>Customer</th>
                    <th>Ref / ID</th>
                    <th>Target (Rs.)</th>
                    <th>Expected (Rs.)</th>
                    <th>Collected (Rs.)</th>
                    <th>Receivable (Rs.)</th>
                    <th>Outstanding (Rs.)</th>
                    <th>Collection %</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>Ali Raza</td>
                    <td>CUST-1001</td>
                    <td>84,000</td>
                    <td>64,000</td>
                    <td>60,000</td>
                    <td>20,000</td>
                    <td>4,000</td>
                    <td>76%</td>
                    <td><span className="status-pill on-track">On Track</span></td>
                  </tr>
                  <tr>
                    <td>Usman Khan</td>
                    <td>CUST-1002</td>
                    <td>65,000</td>
                    <td>54,000</td>
                    <td>40,000</td>
                    <td>20,000</td>
                    <td>10,000</td>
                    <td>62%</td>
                    <td><span className="status-pill partially-paid">Partially Paid</span></td>
                  </tr>
                  <tr>
                    <td>Sara Ahmed</td>
                    <td>CUST-1003</td>
                    <td>95,000</td>
                    <td>44,000</td>
                    <td>20,000</td>
                    <td>30,000</td>
                    <td>20,000</td>
                    <td>52%</td>
                    <td><span className="status-pill pending">Pending</span></td>
                  </tr>
                  <tr>
                    <td>Faisal Malik</td>
                    <td>CUST-1004</td>
                    <td>90,000</td>
                    <td>72,000</td>
                    <td>60,000</td>
                    <td>30,000</td>
                    <td>10,000</td>
                    <td>67%</td>
                    <td><span className="status-pill partially-paid">Partially Paid</span></td>
                  </tr>
                  <tr>
                    <td>Hassan Abbas</td>
                    <td>CUST-1005</td>
                    <td>70,000</td>
                    <td>56,000</td>
                    <td>56,000</td>
                    <td>14,000</td>
                    <td>0</td>
                    <td>100%</td>
                    <td><span className="status-pill completed">Completed</span></td>
                  </tr>
                  <tr>
                    <td>Nida Fatima</td>
                    <td>CUST-1006</td>
                    <td>60,000</td>
                    <td>48,000</td>
                    <td>30,000</td>
                    <td>30,000</td>
                    <td>18,000</td>
                    <td>97%</td>
                    <td><span className="status-pill overdue">Overdue</span></td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* THIRD ROW: COLLECTOR PERFORMANCE & OVERVIEW */}
        <div className="dashboard-grid-3-1">
          {/* Table: Collector Collection Performance */}
          <div className="card-box">
            <div className="card-header">
              <span className="card-title">Collector Collection Performance</span>
            </div>
            <div style={{overflowX: 'auto'}}>
              <table className="custom-table">
                <thead>
                  <tr>
                    <th>Collector</th>
                    <th>Assigned Customers</th>
                    <th>To Collect From</th>
                    <th>Collected From</th>
                    <th>Remaining Customers</th>
                    <th>Target</th>
                    <th>Expected</th>
                    <th>Collected</th>
                    <th>Receivable</th>
                    <th>Outstanding</th>
                    <th>Collection %</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>Ahmed</td>
                    <td>66</td>
                    <td>68</td>
                    <td>68</td>
                    <td>12</td>
                    <td>1.40M</td>
                    <td>1.10M</td>
                    <td>980K</td>
                    <td>900K</td>
                    <td>120K</td>
                    <td><div className="inline-progress"><div className="inline-progress-fill" style={{width: '76%'}}></div></div></td>
                    <td><span className="status-pill on-track">On Track</span></td>
                  </tr>
                  <tr>
                    <td>Hamza</td>
                    <td>72</td>
                    <td>68</td>
                    <td>81</td>
                    <td>17</td>
                    <td>1.10M</td>
                    <td>800K</td>
                    <td>700K</td>
                    <td>300K</td>
                    <td>120K</td>
                    <td><div className="inline-progress"><div className="inline-progress-fill" style={{width: '70%'}}></div></div></td>
                    <td><span className="status-pill partially-paid">Partially Paid</span></td>
                  </tr>
                  <tr>
                    <td>Adil</td>
                    <td>64</td>
                    <td>60</td>
                    <td>39</td>
                    <td>21</td>
                    <td>900K</td>
                    <td>700K</td>
                    <td>880K</td>
                    <td>550K</td>
                    <td>170K</td>
                    <td><div className="inline-progress"><div className="inline-progress-fill" style={{width: '76%'}}></div></div></td>
                    <td><span className="status-pill pending">Pending</span></td>
                  </tr>
                  <tr>
                    <td>Zain</td>
                    <td>55</td>
                    <td>55</td>
                    <td>30</td>
                    <td>25</td>
                    <td>800K</td>
                    <td>640K</td>
                    <td>420K</td>
                    <td>550K</td>
                    <td>160K</td>
                    <td><div className="inline-progress"><div className="inline-progress-fill" style={{width: '76%'}}></div></div></td>
                    <td><span className="status-pill pending">Pending</span></td>
                  </tr>
                  <tr>
                    <td>Bilal</td>
                    <td>50</td>
                    <td>48</td>
                    <td>20</td>
                    <td>28</td>
                    <td>600K</td>
                    <td>400K</td>
                    <td>300K</td>
                    <td>560K</td>
                    <td>160K</td>
                    <td><div className="inline-progress"><div className="inline-progress-fill" style={{width: '99%', backgroundColor: '#ef4444'}}></div></div></td>
                    <td><span className="status-pill overdue">Overdue</span></td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* Middle Box: Collector Progress Overview */}
          <div className="card-box">
            <div className="card-header">
              <span className="card-title">Collector Progress Overview</span>
            </div>
            <div className="collector-progress-list">
              <div className="collector-progress-item">
                <span className="collector-name">Ahmed</span>
                <span className="collector-count">66 / 80</span>
                <div className="collector-bars">
                  <div className="bar-track" style={{height: '6px'}}><div className="bar-fill" style={{width: '80%', backgroundColor: '#2563eb'}}></div></div>
                  <div className="bar-track" style={{height: '6px'}}><div className="bar-fill" style={{width: '70%', backgroundColor: '#10b981'}}></div></div>
                </div>
                <span className="collector-amt">980K / 1.40M</span>
              </div>

              <div className="collector-progress-item">
                <span className="collector-name">Hamza</span>
                <span className="collector-count">51 / 68</span>
                <div className="collector-bars">
                  <div className="bar-track" style={{height: '6px'}}><div className="bar-fill" style={{width: '75%', backgroundColor: '#2563eb'}}></div></div>
                  <div className="bar-track" style={{height: '6px'}}><div className="bar-fill" style={{width: '63%', backgroundColor: '#10b981'}}></div></div>
                </div>
                <span className="collector-amt">700K / 1.10M</span>
              </div>

              <div className="collector-progress-item">
                <span className="collector-name">Adil</span>
                <span className="collector-count">39 / 86</span>
                <div className="collector-bars">
                  <div className="bar-track" style={{height: '6px'}}><div className="bar-fill" style={{width: '45%', backgroundColor: '#2563eb'}}></div></div>
                  <div className="bar-track" style={{height: '6px'}}><div className="bar-fill" style={{width: '55%', backgroundColor: '#10b981'}}></div></div>
                </div>
                <span className="collector-amt">550K / 500K</span>
              </div>

              <div className="collector-progress-item">
                <span className="collector-name">Zain</span>
                <span className="collector-count">30 / 55</span>
                <div className="collector-bars">
                  <div className="bar-track" style={{height: '6px'}}><div className="bar-fill" style={{width: '54%', backgroundColor: '#2563eb'}}></div></div>
                  <div className="bar-track" style={{height: '6px'}}><div className="bar-fill" style={{width: '40%', backgroundColor: '#10b981'}}></div></div>
                </div>
                <span className="collector-amt">420K / 420K</span>
              </div>

              <div className="collector-progress-item">
                <span className="collector-name">Bilal</span>
                <span className="collector-count">20 / 48</span>
                <div className="collector-bars">
                  <div className="bar-track" style={{height: '6px'}}><div className="bar-fill" style={{width: '41%', backgroundColor: '#2563eb'}}></div></div>
                  <div className="bar-track" style={{height: '6px'}}><div className="bar-fill" style={{width: '50%', backgroundColor: '#10b981'}}></div></div>
                </div>
                <span className="collector-amt">300K / 600K</span>
              </div>
            </div>
          </div>

          {/* Right Box: Top Performers */}
          <div className="card-box">
            <div className="card-header">
              <span className="card-title">Top Performers</span>
            </div>
            <div className="performer-list">
              <div className="performer-item">
                <div className="performer-info">
                  <div className="performer-rank rank-1">1</div>
                  <div className="performer-avatar">A</div>
                  <span className="performer-name">Ahmed</span>
                </div>
                <div className="performer-score">
                  <div className="performer-pct">89%</div>
                  <div className="performer-sub">Rs. 980K</div>
                </div>
              </div>

              <div className="performer-item">
                <div className="performer-info">
                  <div className="performer-rank rank-2">2</div>
                  <div className="performer-avatar">H</div>
                  <span className="performer-name">Hamza</span>
                </div>
                <div className="performer-score">
                  <div className="performer-pct">78%</div>
                  <div className="performer-sub">Rs. 700K</div>
                </div>
              </div>

              <div className="performer-item">
                <div className="performer-info">
                  <div className="performer-rank rank-3">3</div>
                  <div className="performer-avatar">A</div>
                  <span className="performer-name">Adil</span>
                </div>
                <div className="performer-score">
                  <div className="performer-pct">76%</div>
                  <div className="performer-sub">Rs. 550K</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* FOURTH ROW: CUSTOMER LIFECYCLE SUMMARY */}
        <div className="card-box">
          <div className="card-header">
            <span className="card-title">Customer Lifecycle Summary</span>
            <div>
              <button className="card-header-btn" style={{marginRight: '8px'}}><BsFilter /> Filter</button>
              <button className="card-header-btn">View All</button>
            </div>
          </div>

          <div className="dashboard-grid-4">
            {/* Closed Accounts */}
            <div className="lifecycle-card green">
              <div style={{fontWeight: '600', color: '#065f46', fontSize: '11px'}}>CLOSED ACCOUNTS</div>
              <div className="lifecycle-num" style={{color: '#065f46'}}>128</div>
              <div className="lifecycle-footer-info">
                <span>Total Value: Rs. 2.60M</span>
                <span>18 Accounts</span>
              </div>
            </div>

            {/* New Accounts */}
            <div className="lifecycle-card blue">
              <div style={{fontWeight: '600', color: '#1e40af', fontSize: '11px'}}>NEW ACCOUNTS</div>
              <div className="lifecycle-num" style={{color: '#1e40af'}}>34</div>
              <div className="lifecycle-footer-info">
                <span>Avg Value: Rs. 185K</span>
                <span>Next: Nov 1, 2025</span>
              </div>
            </div>

            {/* Expired Accounts */}
            <div className="lifecycle-card red">
              <div style={{fontWeight: '600', color: '#991b1b', fontSize: '11px'}}>EXPIRED ACCOUNTS</div>
              <div className="lifecycle-num" style={{color: '#991b1b'}}>17</div>
              <div className="lifecycle-footer-info">
                <span>Delinquent: 14</span>
                <span>Outstanding: Rs. 80K</span>
              </div>
            </div>

            {/* Expired Details Table */}
            <div style={{overflowX: 'auto'}}>
              <table className="custom-table">
                <thead>
                  <tr>
                    <th>Customer</th>
                    <th>Plan Amount (Rs.)</th>
                    <th>Remaining (Rs.)</th>
                    <th>Paid Inst.</th>
                    <th>Completion Date</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>Ali Raza</td>
                    <td>64,000</td>
                    <td>0</td>
                    <td>10</td>
                    <td>May 20, 2025</td>
                    <td><span className="status-pill completed">Completed</span></td>
                  </tr>
                  <tr>
                    <td>Irfan Sheikh</td>
                    <td>73,000</td>
                    <td>0</td>
                    <td>10</td>
                    <td>May 18, 2025</td>
                    <td><span className="status-pill completed">Completed</span></td>
                  </tr>
                  <tr>
                    <td>Faisal Khan</td>
                    <td>59,000</td>
                    <td>0</td>
                    <td>8</td>
                    <td>May 15, 2025</td>
                    <td><span className="status-pill completed">Completed</span></td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* FIFTH ROW: TODAY'S PERFORMANCE & ANALYTICS */}
        <div className="dashboard-grid-3">
          {/* Today's Sales & Advance */}
          <div className="card-box">
            <div className="card-header">
              <span className="card-title">Today's Performance</span>
            </div>
            <div style={{fontSize: '11px', fontWeight: '600', color: '#4b5563', marginBottom: '8px'}}>
              TODAY'S SALES & ADVANCE
            </div>
            <div className="sales-box-grid">
              <div className="sales-mini-card">
                <BsBagCheck className="sales-mini-icon" />
                <div className="sales-mini-val">42</div>
                <div className="sales-mini-lbl">Customers Sold</div>
              </div>
              <div className="sales-mini-card">
                <BsCurrencyDollar className="sales-mini-icon" />
                <div className="sales-mini-val">Rs. 850K</div>
                <div className="sales-mini-lbl">Today's Sales</div>
              </div>
              <div className="sales-mini-card">
                <BsWallet2 className="sales-mini-icon" />
                <div className="sales-mini-val">Rs. 210K</div>
                <div className="sales-mini-lbl">Advance Received</div>
              </div>
              <div className="sales-mini-card">
                <BsPeople className="sales-mini-icon" />
                <div className="sales-mini-val">Rs. 490K</div>
                <div className="sales-mini-lbl">Total Collection</div>
              </div>
            </div>
          </div>

          {/* Today's Collector Performance */}
          <div className="card-box">
            <div className="card-header">
              <span className="card-title">Today's Collector Performance</span>
            </div>
            <div style={{overflowX: 'auto'}}>
              <table className="custom-table">
                <thead>
                  <tr>
                    <th>Collector</th>
                    <th>Assigned</th>
                    <th>Collected</th>
                    <th>Target (Rs.)</th>
                    <th>Remaining (Rs.)</th>
                    <th>Performance %</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>Ahmed</td>
                    <td>62</td>
                    <td>10</td>
                    <td>120,000</td>
                    <td>120,000</td>
                    <td>89%</td>
                  </tr>
                  <tr>
                    <td>Hamza</td>
                    <td>12</td>
                    <td>0</td>
                    <td>160,000</td>
                    <td>90,000</td>
                    <td>78%</td>
                  </tr>
                  <tr>
                    <td>Adil</td>
                    <td>15</td>
                    <td>8</td>
                    <td>100,000</td>
                    <td>70,000</td>
                    <td>78%</td>
                  </tr>
                  <tr>
                    <td>Zain</td>
                    <td>10</td>
                    <td>4</td>
                    <td>50,000</td>
                    <td>90,000</td>
                    <td>69%</td>
                  </tr>
                  <tr>
                    <td>Bilal</td>
                    <td>10</td>
                    <td>0</td>
                    <td>70,000</td>
                    <td>0</td>
                    <td>0%</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* Monthly Collector Analytics Chart */}
          <div className="card-box">
            <div className="card-header">
              <span className="card-title">Monthly Collector Analytics</span>
              <button className="card-header-btn">May 2023</button>
            </div>
            
            <div className="bar-chart-container">
              {/* Ahmed */}
              <div className="bar-group-col">
                <div className="bars-wrapper">
                  <div className="chart-bar target" style={{height: '90%'}}></div>
                  <div className="chart-bar expected" style={{height: '75%'}}></div>
                  <div className="chart-bar collected" style={{height: '65%'}}></div>
                  <div className="chart-bar receivable" style={{height: '40%'}}></div>
                  <div className="chart-bar outstanding" style={{height: '15%'}}></div>
                </div>
                <span className="bar-group-label">Ahmed</span>
              </div>

              {/* Hamza */}
              <div className="bar-group-col">
                <div className="bars-wrapper">
                  <div className="chart-bar target" style={{height: '80%'}}></div>
                  <div className="chart-bar expected" style={{height: '60%'}}></div>
                  <div className="chart-bar collected" style={{height: '55%'}}></div>
                  <div className="chart-bar receivable" style={{height: '30%'}}></div>
                  <div className="chart-bar outstanding" style={{height: '10%'}}></div>
                </div>
                <span className="bar-group-label">Hamza</span>
              </div>

              {/* Adil */}
              <div className="bar-group-col">
                <div className="bars-wrapper">
                  <div className="chart-bar target" style={{height: '70%'}}></div>
                  <div className="chart-bar expected" style={{height: '50%'}}></div>
                  <div className="chart-bar collected" style={{height: '60%'}}></div>
                  <div className="chart-bar receivable" style={{height: '35%'}}></div>
                  <div className="chart-bar outstanding" style={{height: '20%'}}></div>
                </div>
                <span className="bar-group-label">Adil</span>
              </div>

              {/* Zain */}
              <div className="bar-group-col">
                <div className="bars-wrapper">
                  <div className="chart-bar target" style={{height: '60%'}}></div>
                  <div className="chart-bar expected" style={{height: '45%'}}></div>
                  <div className="chart-bar collected" style={{height: '30%'}}></div>
                  <div className="chart-bar receivable" style={{height: '40%'}}></div>
                  <div className="chart-bar outstanding" style={{height: '25%'}}></div>
                </div>
                <span className="bar-group-label">Zain</span>
              </div>

              {/* Bilal */}
              <div className="bar-group-col">
                <div className="bars-wrapper">
                  <div className="chart-bar target" style={{height: '50%'}}></div>
                  <div className="chart-bar expected" style={{height: '35%'}}></div>
                  <div className="chart-bar collected" style={{height: '20%'}}></div>
                  <div className="chart-bar receivable" style={{height: '45%'}}></div>
                  <div className="chart-bar outstanding" style={{height: '30%'}}></div>
                </div>
                <span className="bar-group-label">Bilal</span>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}