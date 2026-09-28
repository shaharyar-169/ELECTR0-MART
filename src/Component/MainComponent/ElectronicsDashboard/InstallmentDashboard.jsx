import React, { useEffect, useRef, useState } from "react";
import "./InstallmentDashboard.css";
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
  BsFilter,
  BsPerson,
  BsClockHistory,
  BsGraphUp,
  BsCashStack,
  BsArrowRepeat,
  BsPersonPlus,
  BsPersonX,
  BsPersonCheck,
  BsArrowUp,
  BsArrowDown,
  BsChevronDown,
} from "react-icons/bs";
import { getOrganisationData, getUserData } from "../../Auth";
import { useTheme } from "../../../ThemeContext";

/* ------------------------------------------------------------------
   REUSABLE UI COMPONENTS
------------------------------------------------------------------ */

const DonutChart = ({ percentage, size = 60, strokeWidth = 6, color = "#22c55e" }) => {
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (percentage / 100) * circumference;

  return (
    <div className="donut-wrapper" style={{ width: size, height: size }}>
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
        <circle
          className="donut-bg"
          cx={size / 2}
          cy={size / 2}
          r={radius}
          strokeWidth={strokeWidth}
          fill="none"
        />
        <circle
          className="donut-progress"
          cx={size / 2}
          cy={size / 2}
          r={radius}
          strokeWidth={strokeWidth}
          fill="none"
          stroke={color}
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          transform={`rotate(-90 ${size / 2} ${size / 2})`}
        />
      </svg>
      <span className="donut-label" style={{ color: color }}>{Math.round(percentage)}%</span>
    </div>
  );
};

const SegmentDonut = ({ segments, size = 100, strokeWidth = 18, centerLabel, centerValue }) => {
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  let accumulated = 0;

  return (
    <div className="segment-donut-wrapper" style={{ width: size, height: size }}>
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          strokeWidth={strokeWidth}
          fill="none"
          stroke="#e2e8f0"
        />
        {segments.map((seg, idx) => {
          const segLength = (seg.value / 100) * circumference;
          const offset = -accumulated;
          accumulated += segLength;
          return (
            <circle
              key={idx}
              cx={size / 2}
              cy={size / 2}
              r={radius}
              strokeWidth={strokeWidth}
              fill="none"
              stroke={seg.color}
              strokeDasharray={`${segLength} ${circumference - segLength}`}
              strokeDashoffset={offset}
              transform={`rotate(-90 ${size / 2} ${size / 2})`}
            />
          );
        })}
      </svg>
      <div className="segment-donut-center">
        <span className="segment-center-label">{centerLabel}</span>
        <span className="segment-center-value">{centerValue}</span>
      </div>
    </div>
  );
};

const ProgressBar = ({ percentage, color = "#3b82f6" }) => (
  <div className="progress-bar-track">
    <div
      className="progress-bar-fill"
      style={{ width: `${Math.min(percentage, 100)}%`, backgroundColor: color }}
    ></div>
  </div>
);

const StatusBadge = ({ status }) => {
  const statusClasses = {
    "On Track": "badge-green",
    "Completed": "badge-green",
    "Partially Paid": "badge-yellow",
    "Pending": "badge-orange",
    "Overdue": "badge-red",
  };
  return (
    <span className={`status-badge ${statusClasses[status] || "badge-gray"}`}>
      {status}
    </span>
  );
};

/* ------------------------------------------------------------------
   MAIN COMPONENT
------------------------------------------------------------------ */

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

  const [loading, setLoading] = useState(true);
  const [dashboardData, setDashboardData] = useState({
    totalCustomers: 0,
    activeInstallments: 0,
    closedAccounts: 0,
    newAccounts: 0,
    expiredAccounts: 0,
    totalCollectors: 0,
    totalInstallments: 0,
    totalReceivable: 0,
    collectionAmount: 0,
    outstandingAmount: 0,

    installmentBreakdown: {
      installment: [],
      amount: [],
      totalCustomers: { total: 0, segments: [0, 0, 0, 0] },
      totalInstallments: { total: 0, segments: [0, 0, 0, 0] },
      totalCustomersAmount: { total: 0, segments: [0, 0, 0, 0] },
      totalInstallmentsAmount: { total: 0, segments: [0, 0, 0, 0] },
    },

    collectorPerformance: [],
    todayCollection: {
      totalCustomers: 0,
      totalCollected: 0,
      avgCollected: 0,
      collectionPercentage: 0,
      customers: [],
    },
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setDashboardData({
          totalCustomers: 1248,
          activeInstallments: 1086,
          closedAccounts: 128,
          newAccounts: 34,
          expiredAccounts: 17,
          totalCollectors: 5,
          totalInstallments: 2450,
          totalReceivable: 5200000,
          collectionAmount: 3800000,
          outstandingAmount: 320000,

          installmentBreakdown: {
            installment: [
              { label: "1 Month",  value: 171, amount: "Rs. 564,434.67" },
              { label: "2 Months", value: 56,  amount: "Rs. 67,467.67" },
              { label: "3 Months", value: 7,   amount: "Rs. 546.40" },
              { label: "3+",       value: 4,   amount: "Rs. 65,464" },
            ],
            amount: [
              { label: "1 Month",  value: 67, amount: "Rs. 564,434.67" },
              { label: "2 Months", value: 7,  amount: "Rs. 67,467.67" },
              { label: "3 Months", value: 7,  amount: "Rs. 546.40" },
              { label: "3+",       value: 4,  amount: "Rs. 65,464" },
            ],
            totalCustomers:          { total: 234, segments: [73, 24, 3, 2] },
            totalInstallments:       { total: 304, segments: [68, 22, 6, 4] },
            totalCustomersAmount:    { total: 234, segments: [73, 24, 3, 2] },
            totalInstallmentsAmount: { total: 304, segments: [68, 22, 6, 4] },
          },

          collectorPerformance: [
            { collector: "Ahmed", todayCustomerNo: 12, todayCollection: 185000, assignedCustomers: 62, toCollect: 50, collected: 48, remaining: 12, target: 1400000, expected: 1100000, collectedAmt: 980000, receivable: 420000, collectionPct: 70 },
            { collector: "Hamza", todayCustomerNo: 9,  todayCollection: 142000, assignedCustomers: 48, toCollect: 45, collected: 41, remaining: 17, target: 1100000, expected: 900000, collectedAmt: 780000, receivable: 310000, collectionPct: 71 },
            { collector: "Ali",   todayCustomerNo: 7,  todayCollection: 98000,  assignedCustomers: 56, toCollect: 41, collected: 51, remaining: 21, target: 900000,  expected: 720000, collectedAmt: 540000, receivable: 280000, collectionPct: 60 },
            { collector: "Zain",  todayCustomerNo: 5,  todayCollection: 65000,  assignedCustomers: 58, toCollect: 62, collected: 30, remaining: 25, target: 800000,  expected: 620000, collectedAmt: 420000, receivable: 320000, collectionPct: 52 },
            { collector: "Bilal", todayCustomerNo: 4,  todayCollection: 48000,  assignedCustomers: 44, toCollect: 48, collected: 38, remaining: 28, target: 600000,  expected: 480000, collectedAmt: 360000, receivable: 160000, collectionPct: 60 },
          ],

          todayCollection: {
            totalCustomers: 28,
            totalCollected: 490000,
            avgCollected: 37400,
            collectionPercentage: 79,
            customers: [
              { name: "Ali Raza", collected: 78000, remaining: 22000, pct: 78, total: 100000 },
              { name: "Hamza Khan", collected: 65000, remaining: 15000, pct: 81, total: 80000 },
              { name: "Faisal Ahmed", collected: 52000, remaining: 18000, pct: 74, total: 70000 },
              { name: "Sana Ahmed", collected: 48000, remaining: 12000, pct: 80, total: 60000 },
              { name: "Hassan Abbas", collected: 42000, remaining: 18000, pct: 70, total: 60000 },
            ],
          },
        });
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [apiLinks]);

  const formatCurrency = (value) => {
    if (value >= 1000000) return `Rs. ${(value / 1000000).toFixed(1)}M`;
    if (value >= 1000) return `Rs. ${(value / 1000).toFixed(0)}K`;
    return `Rs. ${value}`;
  };

  const formatFullCurrency = (value) => {
    return "Rs. " + value.toLocaleString();
  };

  const contentStyle = {
    height: "100vh",
    background: "#f8f8f8",
    fontFamily: "Inter, system-ui, sans-serif",
    fontSize: "12px",
    width: "100%",
    maxWidth: "1920px",
    marginTop: "-55px",
    overflowY: "auto",
    overflowX: "hidden",
    position: "relative",
    zIndex: 1,
    boxSizing: "border-box",
    padding: "15px 15px 110px 15px",
    transition: "background 0.3s ease, color 0.3s ease",
  };

  if (loading) {
    return (
      <div style={contentStyle} className="d-flex justify-content-center align-items-center">
        <Spinner animation="border" variant="primary" />
      </div>
    );
  }

  const d = dashboardData;

  return (
    <div style={contentStyle}>
      {/* ============================================================
          ROW 1 — TOP 6 CARDS
      ============================================================ */}
      <div className="row-grid row-1" style={{ marginBottom: "10px" }}>
        <div className="dashboard-card">
          <div className="card-header">
            <span className="card-title">TOTAL CUSTOMERS</span>
          </div>
          <div className="card-body-top">
            <span className="main-value">{d.totalCustomers.toLocaleString()}</span>
            <DonutChart percentage={92} size={62} strokeWidth={6} color="#22c55e" />
          </div>
          <div className="card-footer-split">
            <div className="footer-item"><span className="footer-label">Targeted</span><span className="footer-value">3434</span></div>
            <div className="footer-item"><span className="footer-label">Avg.</span><span className="footer-value">5466</span></div>
            <div className="footer-item"><span className="footer-label">Avg Per</span><span className="footer-value">676</span></div>
          </div>
        </div>

        <div className="dashboard-card">
          <div className="card-header"><span className="card-title">ACTIVE INSTALLMENTS</span></div>
          <div className="card-body-top">
            <span className="main-value">{d.activeInstallments.toLocaleString()}</span>
            <DonutChart percentage={78} size={62} strokeWidth={6} color="#3b82f6" />
          </div>
          <div className="card-footer-split">
            <div className="footer-item"><span className="footer-label">Targeted</span><span className="footer-value">1400</span></div>
            <div className="footer-item"><span className="footer-label">Avg.</span><span className="footer-value">1086</span></div>
            <div className="footer-item"><span className="footer-label">Avg Per</span><span className="footer-value">217</span></div>
          </div>
        </div>

        <div className="dashboard-card">
          <div className="card-header"><span className="card-title">CLOSED ACCOUNTS</span></div>
          <div className="card-body-top">
            <span className="main-value">{d.closedAccounts}</span>
            <DonutChart percentage={92} size={62} strokeWidth={6} color="#22c55e" />
          </div>
          <div className="card-footer-split">
            <div className="footer-item"><span className="footer-label">Targeted</span><span className="footer-value">140</span></div>
            <div className="footer-item"><span className="footer-label">Avg.</span><span className="footer-value">128</span></div>
            <div className="footer-item"><span className="footer-label">Avg Per</span><span className="footer-value">25.6</span></div>
          </div>
        </div>

        <div className="dashboard-card">
          <div className="card-header"><span className="card-title">NEW ACCOUNTS</span></div>
          <div className="card-body-top">
            <span className="main-value">{d.newAccounts}</span>
            <DonutChart percentage={65} size={62} strokeWidth={6} color="#f59e0b" />
          </div>
          <div className="card-footer-split">
            <div className="footer-item"><span className="footer-label">Targeted</span><span className="footer-value">50</span></div>
            <div className="footer-item"><span className="footer-label">Avg.</span><span className="footer-value">34</span></div>
            <div className="footer-item"><span className="footer-label">Avg Per</span><span className="footer-value">6.8</span></div>
          </div>
        </div>

        <div className="dashboard-card">
          <div className="card-header"><span className="card-title">EXPIRED ACCOUNTS</span></div>
          <div className="card-body-top">
            <span className="main-value">{d.expiredAccounts}</span>
            <DonutChart percentage={34} size={62} strokeWidth={6} color="#ef4444" />
          </div>
          <div className="card-footer-split">
            <div className="footer-item"><span className="footer-label">Targeted</span><span className="footer-value">50</span></div>
            <div className="footer-item"><span className="footer-label">Avg.</span><span className="footer-value">17</span></div>
            <div className="footer-item"><span className="footer-label">Avg Per</span><span className="footer-value">3.4</span></div>
          </div>
        </div>

        <div className="dashboard-card">
          <div className="card-header"><span className="card-title">TOTAL COLLECTORS</span></div>
          <div className="card-body-top">
            <span className="main-value">{d.totalCollectors}</span>
            <DonutChart percentage={100} size={62} strokeWidth={6} color="#8b5cf6" />
          </div>
          <div className="card-footer-split">
            <div className="footer-item"><span className="footer-label">Targeted</span><span className="footer-value">5</span></div>
            <div className="footer-item"><span className="footer-label">Avg.</span><span className="footer-value">5</span></div>
            <div className="footer-item"><span className="footer-label">Avg Per</span><span className="footer-value">1</span></div>
          </div>
        </div>
      </div>

      {/* ============================================================
          ROW 2 — INSTALLMENT SUMMARY
      ============================================================ */}
      <div className="row-grid row-2" style={{ marginBottom: "10px" }}>
        <div className="summary-card">
          <div className="summary-icon"><BsPieChart /></div>
          <div className="summary-info">
            <span className="summary-label">Total Installments</span>
            <span className="summary-value">{d.totalInstallments.toLocaleString()}</span>
          </div>
        </div>
        <div className="summary-card">
          <div className="summary-icon"><BsCurrencyDollar /></div>
          <div className="summary-info">
            <span className="summary-label">Total Receivable</span>
            <span className="summary-value">{formatCurrency(d.totalReceivable)}</span>
          </div>
        </div>
        <div className="summary-card">
          <div className="summary-icon"><BsWallet2 /></div>
          <div className="summary-info">
            <span className="summary-label">Collection Amount</span>
            <span className="summary-value">{formatCurrency(d.collectionAmount)}</span>
          </div>
        </div>
        <div className="summary-card">
          <div className="summary-icon"><BsExclamationTriangle /></div>
          <div className="summary-info">
            <span className="summary-label">Outstanding Amount</span>
            <span className="summary-value">{formatCurrency(d.outstandingAmount)}</span>
          </div>
        </div>
      </div>

      {/* ============================================================
          ROW 3 — INSTALLMENT & AMOUNT COMPARISON
      ============================================================ */}
      <div className="row-grid row-4" style={{ marginBottom: "10px" }}>
        {/* Card 1: INSTALLMENT WISE COMPARISON */}
        <div className="ib-card">
          <div className="ib-card-header">
            <span className="ib-card-title">INSTALLMENT WISE COMPARISON</span>
            <span className="ib-info-icon">ⓘ</span>
          </div>

          <div className="ib-split">
            <div className="ib-columns">
              {d.installmentBreakdown.installment.map((col, i) => {
                const colors = [
                  { bg: "#d1fae5", color: "#059669" },
                  { bg: "#ffedd5", color: "#ea580c" },
                  { bg: "#fee2e2", color: "#dc2626" },
                  { bg: "#ede9fe", color: "#7c3aed" },
                ][i];
                return (
                  <div className="ib-column" key={i}>
                    <div className="ib-icon-wrap" style={{ background: colors.bg, color: colors.color }}>
                      <BsCalendar />
                    </div>
                    <span className="ib-col-label">{col.label}</span>
                    <span className="ib-col-value">{col.value}</span>
                    <span className="ib-col-amount">{col.amount}</span>
                  </div>
                );
              })}
            </div>

            <div className="ib-donuts-pair">
              <div className="ib-donut-block">
                <SegmentDonut
                  segments={[
                    { value: d.installmentBreakdown.totalInstallments.segments[0], color: "#22c55e" },
                    { value: d.installmentBreakdown.totalInstallments.segments[1], color: "#f59e0b" },
                    { value: d.installmentBreakdown.totalInstallments.segments[2], color: "#ef4444" },
                    { value: d.installmentBreakdown.totalInstallments.segments[3], color: "#8b5cf6" },
                  ]}
                  size={90}
                  strokeWidth={18}
                  centerLabel="Count"
                  centerValue={d.installmentBreakdown.totalInstallments.total.toString()}
                />
              </div>

              <div className="ib-donut-block">
                <SegmentDonut
                  segments={[
                    { value: d.installmentBreakdown.totalInstallmentsAmount.segments[0], color: "#22c55e" },
                    { value: d.installmentBreakdown.totalInstallmentsAmount.segments[1], color: "#f59e0b" },
                    { value: d.installmentBreakdown.totalInstallmentsAmount.segments[2], color: "#ef4444" },
                    { value: d.installmentBreakdown.totalInstallmentsAmount.segments[3], color: "#8b5cf6" },
                  ]}
                  size={90}
                  strokeWidth={18}
                  centerLabel="Amount"
                  centerValue={d.installmentBreakdown.totalInstallmentsAmount.total.toString()}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Card 2: AMOUNT WISE COMPARISON */}
        <div className="ib-card">
          <div className="ib-card-header">
            <span className="ib-card-title">AMOUNT WISE COMPARISON</span>
            <span className="ib-info-icon">ⓘ</span>
          </div>

          <div className="ib-split">
            <div className="ib-columns">
              {d.installmentBreakdown.amount.map((col, i) => {
                const colors = [
                  { bg: "#d1fae5", color: "#059669" },
                  { bg: "#ffedd5", color: "#ea580c" },
                  { bg: "#fee2e2", color: "#dc2626" },
                  { bg: "#ede9fe", color: "#7c3aed" },
                ][i];
                return (
                  <div className="ib-column" key={i}>
                    <div className="ib-icon-wrap" style={{ background: colors.bg, color: colors.color }}>
                      <BsCalendar />
                    </div>
                    <span className="ib-col-label">{col.label}</span>
                    <span className="ib-col-value">{col.value}</span>
                    <span className="ib-col-amount">{col.amount}</span>
                  </div>
                );
              })}
            </div>

            <div className="ib-donuts-pair">
              <div className="ib-donut-block">
                <SegmentDonut
                  segments={[
                    { value: d.installmentBreakdown.totalCustomers.segments[0], color: "#22c55e" },
                    { value: d.installmentBreakdown.totalCustomers.segments[1], color: "#f59e0b" },
                    { value: d.installmentBreakdown.totalCustomers.segments[2], color: "#ef4444" },
                    { value: d.installmentBreakdown.totalCustomers.segments[3], color: "#8b5cf6" },
                  ]}
                  size={90}
                  strokeWidth={18}
                  centerLabel="Count"
                  centerValue={d.installmentBreakdown.totalCustomers.total.toString()}
                />
              </div>

              <div className="ib-donut-block">
                <SegmentDonut
                  segments={[
                    { value: d.installmentBreakdown.totalCustomersAmount.segments[0], color: "#22c55e" },
                    { value: d.installmentBreakdown.totalCustomersAmount.segments[1], color: "#f59e0b" },
                    { value: d.installmentBreakdown.totalCustomersAmount.segments[2], color: "#ef4444" },
                    { value: d.installmentBreakdown.totalCustomersAmount.segments[3], color: "#8b5cf6" },
                  ]}
                  size={90}
                  strokeWidth={18}
                  centerLabel="Amount"
                  centerValue={d.installmentBreakdown.totalCustomersAmount.total.toString()}
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ============================================================
          ROW 4 — COLLECTOR COLLECTION PERFORMANCE (Redesigned)
      ============================================================ */}
      <div className="collector-perf-card">
        {/* Header */}
        <div className="cpc-header">
          <div className="cpc-header-left">
            <span className="cpc-title">COLLECTOR COLLECTION PERFORMANCE</span>
            <span className="cpc-live-badge">
              <span className="cpc-live-dot"></span>
              Live Data
            </span>
          </div>
          <button className="cpc-view-btn">
            View All
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="9 18 15 12 9 6"></polyline>
            </svg>
          </button>
        </div>

        {/* Table */}
        <div className="cpc-table-wrap">
          <table className="cpc-table">
            <thead>
              <tr className="cpc-head-row-1">
                <th rowSpan="2" className="cpc-th-collector">COLLECTOR</th>
                <th colSpan="2" className="cpc-group-header">TODAY</th>
                <th colSpan="4" className="cpc-group-header">CUSTOMER PERFORMANCE</th>
                <th colSpan="4" className="cpc-group-header">AMOUNT PERFORMANCE (RS.)</th>
                <th rowSpan="2" className="cpc-th-collection">COLLECTION %</th>
              </tr>
              <tr className="cpc-head-row-2">
                <th>Today's Cus</th>
                <th>Today's Collection</th>
                <th>Assigned Cus</th>
                <th>To Collect</th>
                <th>Collected</th>
                <th>Remaining</th>
                <th>Target</th>
                <th>Expected</th>
                <th>Collected</th>
                <th>Receivable</th>
              </tr>
            </thead>
            <tbody>
              {d.collectorPerformance.map((row, idx) => {
                const avatarColors = ["#c7d2fe", "#bfdbfe", "#fde68a", "#fecaca", "#bae6fd"];
                const avatarColor = avatarColors[idx % avatarColors.length];
                const initials = row.collector.substring(0, 2);
                const pct = row.collectionPct;
                const barColor = pct >= 70 ? "#22c55e" : pct >= 50 ? "#f59e0b" : "#ef4444";

                return (
                  <tr key={idx} className="cpc-body-row">
                    <td className="cpc-collector-cell">
                      <div className="cpc-collector-cell-inner">
                        <div className="cpc-avatar" style={{ background: avatarColor }}>
                          {initials}
                        </div>
                        <span className="cpc-name">{row.collector}</span>
                      </div>
                    </td>

                    <td className="cpc-num-cell">
                      <span>{row.todayCustomerNo}</span>
                      <span className="cpc-arrow down">↓</span>
                    </td>
                    <td className="cpc-num-cell">
                      <span>{row.todayCollection.toLocaleString()}</span>
                    </td>
                    <td className="cpc-num-cell">
                      <span>{row.assignedCustomers}</span>
                      <span className="cpc-arrow up">↗</span>
                    </td>
                    <td className="cpc-num-cell">
                      <span>{row.toCollect}</span>
                      <span className="cpc-arrow up">↑</span>
                    </td>
                    <td className="cpc-num-cell">
                      <span>{row.collected}</span>
                      <span className="cpc-arrow up">↗</span>
                    </td>
                    <td className="cpc-num-cell">
                      <span>{row.remaining}</span>
                      <span className="cpc-rs-tag">Rs</span>
                    </td>

                    <td className="cpc-num-cell bold-num">{row.target.toLocaleString()}</td>
                    <td className="cpc-num-cell bold-num">{row.expected.toLocaleString()}</td>
                    <td className="cpc-num-cell bold-num">{row.collectedAmt.toLocaleString()}</td>
                    <td className="cpc-num-cell bold-num">{row.receivable.toLocaleString()}</td>

                    <td className="cpc-progress-cell">
                      <div className="cpc-progress-cell-inner">
                        <div className="cpc-progress-track">
                          <div
                            className="cpc-progress-fill"
                            style={{ width: `${Math.min(pct, 100)}%`, background: barColor }}
                          ></div>
                        </div>
                        <span className="cpc-progress-label">{pct}%</span>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* ============================================================
          ROW 5 — TODAY'S CUSTOMER COLLECTION
      ============================================================ */}
      <div className="dashboard-card table-card">
        <div className="card-header table-header">
          <span className="card-title">TODAY'S CUSTOMER COLLECTION</span>
        </div>
        <div className="today-summary">
          <div className="summary-strip-item">
            <span className="strip-label">Total Customers</span>
            <span className="strip-value">{d.todayCollection.totalCustomers}</span>
          </div>
          <div className="summary-strip-item">
            <span className="strip-label">Total Collected</span>
            <span className="strip-value">{formatCurrency(d.todayCollection.totalCollected)}</span>
          </div>
          <div className="summary-strip-item">
            <span className="strip-label">Avg. Collected</span>
            <span className="strip-value">{formatCurrency(d.todayCollection.avgCollected)}</span>
          </div>
          <div className="summary-strip-item">
            <span className="strip-label">Collection %</span>
            <span className="strip-value">{d.todayCollection.collectionPercentage}%</span>
          </div>
        </div>
        <div className="table-responsive">
          <table className="dashboard-table today-table">
            <thead>
              <tr>
                <th>Customer</th>
                <th>Collected (Rs.)</th>
                <th>Remaining (Rs.)</th>
                <th>Collection %</th>
                <th>Total</th>
              </tr>
            </thead>
            <tbody>
              {d.todayCollection.customers.map((cust, idx) => (
                <tr key={idx}>
                  <td className="fw-semibold">{cust.name}</td>
                  <td>{cust.collected.toLocaleString()}</td>
                  <td>{cust.remaining.toLocaleString()}</td>
                  <td>
                    <div className="progress-cell">
                      <ProgressBar percentage={cust.pct} color={cust.pct >= 70 ? "#22c55e" : cust.pct >= 50 ? "#f59e0b" : "#ef4444"} />
                      <span className="progress-label">{cust.pct}%</span>
                    </div>
                  </td>
                  <td className="fw-bold">{cust.total.toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}