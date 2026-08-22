import React, { useEffect, useRef, useState } from "react";
import "./electronics.css";
import "react-datepicker/dist/react-datepicker.css";
import axios from "axios";
import { Spinner } from "react-bootstrap";
import DatePicker from "react-datepicker";
import { BsCalendar } from "react-icons/bs";
import { getOrganisationData, getUserData } from "../../Auth";
import { useTheme } from "../../../ThemeContext";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from "chart.js";
import { Line, Bar, Doughnut } from "react-chartjs-2";

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

export default function ElectronicsDashboard() {
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

  const [isDark, setIsDark] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [chartData, setChartData] = useState({
    sales: [0.4, 0.55, 0.65, 0.75, 0.85, 0.95, 1.05, 0.95, 1.15, 0.95, 0.85],
    purchase: [0.3, 0.45, 0.55, 0.65, 0.75, 0.85, 0.95, 0.85, 0.95, 0.75, 0.65],
    expense: [0.1, 0.15, 0.2, 0.18, 0.25, 0.3, 0.28, 0.22, 0.35, 0.3, 0.25],
    margin: [0.05, 0.08, 0.1, 0.12, 0.15, 0.18, 0.2, 0.22, 0.25, 0.2, 0.18],
  });

  // Default: Sales and Purchase active, Expense and Margin inactive
  const [visibleDatasets, setVisibleDatasets] = useState({
    sales: true,
    purchase: true,
    expense: false,
    margin: false,
  });

  // Salesman Data
  const salesmanData = [
    { rank: 1, name: "HAFIZ FAIZ UL HASSAN", qty: 539, sales: "Rs 34,697,120.00", growth: "Rs 2,008,928.90" },
    { rank: 2, name: "ABDUL WAHEED KHAN", qty: 139, sales: "Rs 7,815,600.00", growth: "Rs 374,990.90" },
    { rank: 3, name: "OBAID ULLAH FIAZ", qty: 39, sales: "Rs 3,154,871.00", growth: "Rs 130,243.46" },
    { rank: 4, name: "USMAN MAQBOOL AHMED", qty: 17, sales: "Rs 764,700.00", growth: "Rs 36,933.33" },
    { rank: 5, name: "MUHAMMAD ALI", qty: 12, sales: "Rs 542,300.00", growth: "Rs 28,456.00" },
    { rank: 6, name: "AHMAD HASSAN", qty: 9, sales: "Rs 398,200.00", growth: "Rs 19,876.00" },
    { rank: 7, name: "FAROOQ AHMED", qty: 7, sales: "Rs 276,500.00", growth: "Rs 12,345.00" },
    { rank: 8, name: "KAMRAN SHAH", qty: 5, sales: "Rs 189,000.00", growth: "Rs 8,765.00" },
  ];

  const contentStyle = {
    minHeight: "100vh",
    background: isDark ? "#0B1120" : "#F1F5F9",
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
    color: isDark ? "#F1F5F9" : "#0B1120",
    transition: "background 0.3s ease, color 0.3s ease",
  };

  // Modal Style
  const modalOverlayStyle = {
    position: "fixed",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0, 0, 0, 0.7)",
    backdropFilter: "blur(8px)",
    display: isModalOpen ? "flex" : "none",
    alignItems: "center",
    justifyContent: "center",
    zIndex: 9999,
    padding: "20px",
    animation: "fadeIn 0.3s ease",
  };

  const modalContentStyle = {
    background: isDark ? "rgba(30, 41, 59, 0.95)" : "rgba(255, 255, 255, 0.95)",
    backdropFilter: "blur(12px)",
    borderRadius: "20px",
    padding: "20px 24px 18px",
    maxWidth: "700px",
    width: "100%",
    maxHeight: "80vh",
    border: `1px solid ${isDark ? "rgba(71, 85, 105, 0.3)" : "rgba(203, 213, 225, 0.5)"}`,
    boxShadow: "0 25px 60px rgba(0,0,0,0.5)",
    overflow: "hidden",
    display: "flex",
    flexDirection: "column",
    animation: "slideUp 0.3s ease",
  };

  const modalHeaderStyle = {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "10px",
    paddingBottom: "8px",
    borderBottom: `1px solid ${isDark ? "rgba(71, 85, 105, 0.15)" : "rgba(203, 213, 225, 0.2)"}`,
    flexShrink: 0,
  };

  const modalTitleStyle = {
    fontSize: "16px",
    fontWeight: "700",
    color: isDark ? "#F8FAFC" : "#0B1120",
    display: "flex",
    alignItems: "center",
    gap: "8px",
  };

  const modalCloseStyle = {
    background: "transparent",
    border: "none",
    color: isDark ? "#94A3B8" : "#64748B",
    fontSize: "20px",
    cursor: "pointer",
    transition: "all 0.2s ease",
    padding: "2px 6px",
    borderRadius: "6px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  };

  const modalListStyle = {
    overflowY: "auto",
    overflowX: "hidden",
    flex: 1,
    paddingRight: "4px",
    scrollbarWidth: "thin",
    scrollbarColor: isDark ? "#475569" : "#CBD5E1" + " transparent",
  };

  const modalItemStyle = {
    display: "flex",
    alignItems: "center",
    padding: "6px 10px",
    borderRadius: "8px",
    background: isDark ? "rgba(71, 85, 105, 0.06)" : "rgba(241, 245, 249, 0.05)",
    marginBottom: "4px",
    transition: "all 0.25s ease",
    cursor: "default",
    borderLeft: "3px solid transparent",
    position: "relative",
  };

  const totalRowStyle = {
    display: "flex",
    alignItems: "center",
    padding: "10px 14px",
    borderRadius: "10px",
    background: isDark ? "rgba(56, 189, 248, 0.1)" : "rgba(56, 189, 248, 0.06)",
    marginTop: "8px",
    borderTop: `1px solid ${isDark ? "rgba(71, 85, 105, 0.15)" : "rgba(203, 213, 225, 0.15)"}`,
    fontWeight: "700",
    borderLeft: "3px solid #38BDF8",
  };

  // Toggle theme
  const toggleTheme = () => {
    setIsDark(!isDark);
  };

  // Toggle dataset visibility
  const toggleDataset = (key) => {
    setVisibleDatasets((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  // Bar Chart Data with interactive filtering
  const getBarChartData = () => {
    const datasets = [];
    const colors = {
      sales: { bg: "rgba(20,184,166,0.7)", border: "#14B8A6", label: "Sales" },
      purchase: { bg: "rgba(59,130,246,0.7)", border: "#3B82F6", label: "Purchase" },
      expense: { bg: "rgba(244,63,94,0.7)", border: "#F43F5E", label: "Expense" },
      margin: { bg: "rgba(245,158,11,0.7)", border: "#F59E0B", label: "Margin" },
    };

    Object.keys(visibleDatasets).forEach((key) => {
      if (visibleDatasets[key]) {
        datasets.push({
          label: colors[key].label,
          data: chartData[key],
          backgroundColor: colors[key].bg,
          borderColor: colors[key].border,
          borderWidth: 1,
          borderRadius: 4,
        });
      }
    });

    return {
      labels: ["Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
      datasets: datasets,
    };
  };

  const barChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        callbacks: {
          label: (ctx) => {
            let label = ctx.dataset.label || "";
            if (label) {
              label += ": ";
            }
            if (ctx.parsed.y !== null) {
              label += ctx.parsed.y + "Cr";
            }
            return label;
          },
        },
      },
    },
    scales: {
      x: {
        ticks: { color: isDark ? "#64748B" : "#475569", font: { size: 7 } },
        grid: { color: isDark ? "#1E293B" : "#E2E8F0" },
      },
      y: {
        ticks: {
          color: isDark ? "#64748B" : "#475569",
          font: { size: 7 },
          callback: (v) => v + "Cr",
        },
        grid: { color: isDark ? "#1E293B" : "#E2E8F0" },
        min: 0,
        max: 1.4,
      },
    },
  };

  // Doughnut Chart Data - Green Theme for Receivable
  const receivableDoughnutData = {
    labels: ["CHOUDHARY MUAZ", "ASIF ALI SINDU", "MR ASHARAF", "ALI BASHIR", "Others (16)"],
    datasets: [
      {
        data: [8.8, 1.1, 0.4, 0.3, 110.5],
        backgroundColor: [
          "#10B981",
          "#34D399",
          "#6EE7B7",
          "#A7F3D0",
          "#D1FAE5"
        ],
        borderColor: isDark ? "#0B1120" : "#F1F5F9",
        borderWidth: 2,
        hoverOffset: 8,
        hoverBackgroundColor: [
          "#059669",
          "#10B981",
          "#34D399",
          "#6EE7B7",
          "#A7F3D0"
        ],
      },
    ],
  };

  const receivableDoughnutOptions = {
    responsive: true,
    maintainAspectRatio: true,
    cutout: "70%",
    plugins: {
      legend: { display: false },
      tooltip: {
        callbacks: {
          label: (ctx) => ctx.label + ": " + ctx.parsed + "%",
        },
      },
    },
  };

  // Doughnut Chart Data - Red Theme for Payable
  const payableDoughnutData = {
    labels: ["AM ASSOCIATES", "LOCAL PURCHASE", "SHAHRYAR AHMED", "YOUSAF TRADING", "Others (1)"],
    datasets: [
      {
        data: [61.5, 32.8, 4.9, 0.5, 0.3],
        backgroundColor: [
          "#EF4444",
          "#F87171",
          "#FCA5A5",
          "#FECACA",
          "#FEE2E2"
        ],
        borderColor: isDark ? "#0B1120" : "#F1F5F9",
        borderWidth: 2,
        hoverOffset: 8,
        hoverBackgroundColor: [
          "#DC2626",
          "#EF4444",
          "#F87171",
          "#FCA5A5",
          "#FECACA"
        ],
      },
    ],
  };

  const payableDoughnutOptions = {
    responsive: true,
    maintainAspectRatio: true,
    cutout: "70%",
    plugins: {
      legend: { display: false },
      tooltip: {
        callbacks: {
          label: (ctx) => ctx.label + ": " + ctx.parsed + "%",
        },
      },
    },
  };

  // Doughnut Center Text Plugin - Green
  const receivableCenterText = {
    id: 'receivableCenterText',
    beforeDraw: function(chart) {
      const { width, height, ctx } = chart;
      ctx.save();
      const centerX = width / 2;
      const centerY = height / 2;
      
      ctx.font = 'bold 16px Inter, sans-serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.shadowColor = 'transparent';
      ctx.fillStyle = isDark ? '#F8FAFC' : '#0B1120';
      ctx.fillText('Rs 32.83M', centerX, centerY - 4);
      
      ctx.font = '7px Inter, sans-serif';
      ctx.fillStyle = isDark ? '#94A3B8' : '#64748B';
      ctx.fillText('Total Receivable', centerX, centerY + 14);
      
      ctx.restore();
    }
  };

  // Doughnut Center Text Plugin - Red
  const payableCenterText = {
    id: 'payableCenterText',
    beforeDraw: function(chart) {
      const { width, height, ctx } = chart;
      ctx.save();
      const centerX = width / 2;
      const centerY = height / 2;
      
      ctx.font = 'bold 16px Inter, sans-serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.shadowColor = 'transparent';
      ctx.fillStyle = isDark ? '#F8FAFC' : '#0B1120';
      ctx.fillText('Rs 19.99M', centerX, centerY - 4);
      
      ctx.font = '7px Inter, sans-serif';
      ctx.fillStyle = isDark ? '#94A3B8' : '#64748B';
      ctx.fillText('Total Payable', centerX, centerY + 14);
      
      ctx.restore();
    }
  };

  // Last 10 Days Chart
  const last10Data = {
    labels: ["Day 1", "Day 2", "Day 3", "Day 4", "Day 5", "Day 6", "Day 7", "Day 8", "Day 9", "Day 10"],
    datasets: [
      {
        label: "Sales",
        data: [12.4, 18.6, 14.2, 22.8, 19.5, 26.3, 30.1, 24.7, 28.9, 35.2],
        borderColor: "#A78BFA",
        backgroundColor: (context) => {
          const chart = context.chart;
          const { ctx, chartArea } = chart;
          if (!chartArea) return "rgba(167,139,250,0.1)";
          const gradient = ctx.createLinearGradient(0, chartArea.top, 0, chartArea.bottom);
          gradient.addColorStop(0, "rgba(167,139,250,0.5)");
          gradient.addColorStop(1, "rgba(167,139,250,0.02)");
          return gradient;
        },
        fill: true,
        tension: 0.4,
        pointRadius: 4,
        pointBackgroundColor: "#A78BFA",
        pointBorderColor: isDark ? "#0B1120" : "#F1F5F9",
        pointBorderWidth: 2,
        borderWidth: 3,
      },
    ],
  };

  const last10Options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: {
        callbacks: {
          label: (ctx) => "Rs " + ctx.parsed.y + "k",
        },
      },
    },
    scales: {
      x: {
        ticks: { color: isDark ? "#64748B" : "#475569", font: { size: 8 } },
        grid: { color: isDark ? "#1E293B" : "#E2E8F0" },
      },
      y: {
        ticks: {
          color: isDark ? "#64748B" : "#475569",
          font: { size: 8 },
          callback: (v) => v + "k",
        },
        grid: { color: isDark ? "#1E293B" : "#E2E8F0" },
        min: 0,
      },
    },
  };

  // Yearly Sales Chart
  const yearlyData = {
    labels: ["2017", "2018", "2019", "2020", "2021", "2022", "2023", "2024", "2025"],
    datasets: [
      {
        label: "Sales (Millions)",
        data: [18, 22, 28, 24, 32, 38, 42, 48, 52],
        backgroundColor: (context) => {
          const chart = context.chart;
          const { ctx, chartArea } = chart;
          if (!chartArea) return "rgba(56,189,248,0.7)";
          const gradient = ctx.createLinearGradient(0, chartArea.top, 0, chartArea.bottom);
          gradient.addColorStop(0, "#38BDF8");
          gradient.addColorStop(1, "#34D399");
          return gradient;
        },
        borderRadius: 6,
        borderSkipped: false,
      },
    ],
  };

  const yearlyOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: {
        callbacks: {
          label: (ctx) => "Rs " + ctx.parsed.y + "M",
        },
      },
    },
    scales: {
      x: {
        ticks: { color: isDark ? "#64748B" : "#475569", font: { size: 8 } },
        grid: { display: false },
      },
      y: {
        ticks: {
          color: isDark ? "#64748B" : "#475569",
          font: { size: 8 },
          callback: (v) => v + "M",
        },
        grid: { color: isDark ? "#1E293B" : "#E2E8F0" },
        min: 0,
      },
    },
  };

  // KPI Data
  const kpiData = [
    { label: "TOTAL SALES", value: "Rs 50.2M", sub: <><span className="green"><i className="fas fa-arrow-up"></i> 8.2%</span> Qty: 807</>, icon: "fa-chart-line" },
    { label: "TOTAL PURCHASE", value: "Rs 58.8M", sub: <><span className="red"><i className="fas fa-arrow-down"></i> 2.1%</span> Qty: 959</>, icon: "fa-shopping-cart" },
    { label: "GROSS PROFIT", value: "Rs 2.4M", sub: <><span className="green"><i className="fas fa-arrow-up"></i> 5.17%</span> Margin</>, icon: "fa-coins" },
    { label: "CURRENT STOCK", value: "Rs 17.1M", sub: <><span className="green">325</span> items</>, icon: "fa-boxes" },
    { label: "EXPENSE", value: "—", sub: "view details", icon: "fa-receipt" },
    { label: "CASH & BANK", value: "Rs 29.9M", sub: <><span className="green">Cash 35M</span> <span className="red">Bank -5.1M</span></>, icon: "fa-university" },
    { label: "ITEM STATUS", value: "327", sub: <><span className="green">271 Active</span> <span className="red">56 Inactive</span></>, icon: "fa-tag" },
  ];

  return (
    <div style={contentStyle}>
      <link
        rel="stylesheet"
        href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0-beta3/css/all.min.css"
      />

      {/* Modal Overlay */}
      <div style={modalOverlayStyle} onClick={() => setIsModalOpen(false)}>
        <div style={modalContentStyle} onClick={(e) => e.stopPropagation()}>
          <div style={modalHeaderStyle}>
            <div style={modalTitleStyle}>
              <i className="fas fa-trophy" style={{ color: "#F59E0B", fontSize: "18px" }}></i>
              Top Salesman
            </div>
            <button style={modalCloseStyle} onClick={() => setIsModalOpen(false)}>
              <i className="fas fa-times"></i>
            </button>
          </div>
          <div style={modalListStyle}>
            {salesmanData.map((salesman) => (
              <div 
                key={salesman.rank} 
                style={{
                  ...modalItemStyle,
                  borderLeftColor: salesman.rank === 1 ? "#F59E0B" : 
                                 salesman.rank === 2 ? "#94A3B8" : 
                                 salesman.rank === 3 ? "#CD7F32" : "transparent",
                  background: salesman.rank === 1 ? (isDark ? "rgba(245, 158, 11, 0.08)" : "rgba(245, 158, 11, 0.04)") :
                             salesman.rank === 2 ? (isDark ? "rgba(148, 163, 184, 0.08)" : "rgba(148, 163, 184, 0.04)") :
                             salesman.rank === 3 ? (isDark ? "rgba(205, 127, 50, 0.08)" : "rgba(205, 127, 50, 0.04)") :
                             (isDark ? "rgba(71, 85, 105, 0.06)" : "rgba(241, 245, 249, 0.05)"),
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = salesman.rank === 1 ? (isDark ? "rgba(245, 158, 11, 0.15)" : "rgba(245, 158, 11, 0.08)") :
                                                       salesman.rank === 2 ? (isDark ? "rgba(148, 163, 184, 0.15)" : "rgba(148, 163, 184, 0.08)") :
                                                       salesman.rank === 3 ? (isDark ? "rgba(205, 127, 50, 0.15)" : "rgba(205, 127, 50, 0.08)") :
                                                       (isDark ? "rgba(56, 189, 248, 0.08)" : "rgba(56, 189, 248, 0.04)");
                  e.currentTarget.style.transform = "translateX(4px) scale(1.01)";
                  e.currentTarget.style.boxShadow = isDark ? "0 4px 20px rgba(0,0,0,0.3)" : "0 4px 20px rgba(0,0,0,0.08)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = salesman.rank === 1 ? (isDark ? "rgba(245, 158, 11, 0.08)" : "rgba(245, 158, 11, 0.04)") :
                                                       salesman.rank === 2 ? (isDark ? "rgba(148, 163, 184, 0.08)" : "rgba(148, 163, 184, 0.04)") :
                                                       salesman.rank === 3 ? (isDark ? "rgba(205, 127, 50, 0.08)" : "rgba(205, 127, 50, 0.04)") :
                                                       (isDark ? "rgba(71, 85, 105, 0.06)" : "rgba(241, 245, 249, 0.05)");
                  e.currentTarget.style.transform = "translateX(0) scale(1)";
                  e.currentTarget.style.boxShadow = "none";
                }}
              >
                <span style={{
                  display: "inline-flex",
                  alignItems: "center",
                  justifyContent: "center",
                  minWidth: "24px",
                  height: "24px",
                  borderRadius: "50%",
                  fontSize: "9px",
                  fontWeight: "800",
                  background: salesman.rank === 1 ? "linear-gradient(135deg, #FBBF24, #F59E0B)" :
                             salesman.rank === 2 ? "linear-gradient(135deg, #CBD5E1, #94A3B8)" :
                             salesman.rank === 3 ? "linear-gradient(135deg, #CD7F32, #B8860B)" :
                             isDark ? "rgba(71, 85, 105, 0.3)" : "rgba(203, 213, 225, 0.2)",
                  color: salesman.rank <= 3 ? "white" : (isDark ? "#94A3B8" : "#64748B"),
                  marginRight: "12px",
                  flexShrink: 0,
                  transition: "all 0.3s ease",
                }}>
                  {salesman.rank}
                </span>
                <span style={{
                  flex: 1,
                  fontSize: "12px",
                  fontWeight: "500",
                  color: isDark ? "#E2E8F0" : "#0B1120",
                  minWidth: "0",
                }}>
                  {salesman.name}
                </span>
                <span style={{
                  fontSize: "10px",
                  fontWeight: "500",
                  color: isDark ? "#94A3B8" : "#64748B",
                  minWidth: "50px",
                  textAlign: "right",
                  marginRight: "10px",
                  flexShrink: 0,
                }}>
                  Qty: {salesman.qty}
                </span>
                <span style={{
                  fontSize: "11px",
                  fontWeight: "600",
                  color: isDark ? "#F8FAFC" : "#0B1120",
                  minWidth: "80px",
                  textAlign: "right",
                  marginRight: "10px",
                  flexShrink: 0,
                }}>
                  {salesman.sales}
                </span>
                <span style={{
                  fontSize: "10px",
                  fontWeight: "600",
                  color: "#34D399",
                  minWidth: "70px",
                  textAlign: "right",
                  flexShrink: 0,
                }}>
                  <i className="fas fa-arrow-up" style={{ fontSize: "8px", marginRight: "3px" }}></i>
                  {salesman.growth}
                </span>
              </div>
            ))}
            <div style={totalRowStyle}>
              <span style={{
                flex: 1,
                fontSize: "12px",
                fontWeight: "700",
                color: isDark ? "#F8FAFC" : "#0B1120",
              }}>
                <i className="fas fa-calculator" style={{ marginRight: "6px", color: "#38BDF8", fontSize: "12px" }}></i>
                Total
              </span>
              <span style={{
                fontSize: "10px",
                fontWeight: "600",
                color: isDark ? "#94A3B8" : "#64748B",
                minWidth: "50px",
                textAlign: "right",
                marginRight: "10px",
                flexShrink: 0,
              }}>
                Qty: 734
              </span>
              <span style={{
                fontSize: "11px",
                fontWeight: "700",
                color: isDark ? "#F8FAFC" : "#0B1120",
                minWidth: "80px",
                textAlign: "right",
                marginRight: "10px",
                flexShrink: 0,
              }}>
                Rs 46.43M
              </span>
              <span style={{
                fontSize: "10px",
                fontWeight: "700",
                color: "#34D399",
                minWidth: "70px",
                textAlign: "right",
                flexShrink: 0,
              }}>
                <i className="fas fa-arrow-up" style={{ fontSize: "8px", marginRight: "3px" }}></i>
                Rs 2.55M
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Dashboard Content */}
      <div className="dashboard-container">
        {/* Header */}
        <div className="header">
          <h1>
            <i className="fas fa-bolt"></i> ELECTRONIC · DASH
          </h1>
          <div className="header-right">
            <span className="badge">
              <i className="far fa-calendar-alt"></i> Jan 2026
            </span>
            <span className="badge">
              <i className="fas fa-download"></i> Export
            </span>
            <span className="badge">
              <i className="fas fa-sync-alt"></i> Refresh
            </span>
            <button className="theme-toggle" onClick={toggleTheme}>
              <i className={isDark ? "fas fa-moon" : "fas fa-sun"}></i>
              <span>{isDark ? "Dark" : "Light"}</span>
            </button>
          </div>
        </div>

        {/* KPI Cards */}
        <div className="kpi-grid">
          {kpiData.map((kpi, index) => (
            <div className="kpi-card" key={index}>
              <div className="kpi-label">
                <i className={"fas " + kpi.icon}></i> {kpi.label}
              </div>
              <div className="kpi-value">{kpi.value}</div>
              <div className="kpi-sub">{kpi.sub}</div>
            </div>
          ))}
        </div>

        {/* 3 Charts Row */}
        <div className="chart-row-3">
          {/* Card 1: SALES · PURCHASE · EXPENSE · MARGIN */}
          <div className="chart-card compact-chart-card">
            <div className="chart-header compact-chart-header">
              <h3>
                <i className="fas fa-chart-bar"></i> SALES · PURCHASE · EXPENSE · MARGIN
              </h3>
              <a href="#">View →</a>
            </div>
            <div className="enhanced-legend compact-legend">
              {Object.keys(visibleDatasets).map((key) => {
                const colors = {
                  sales: { bg: "rgba(20,184,166,0.7)", border: "#14B8A6", label: "Sales", icon: "fa-chart-line" },
                  purchase: { bg: "rgba(59,130,246,0.7)", border: "#3B82F6", label: "Purchase", icon: "fa-shopping-cart" },
                  expense: { bg: "rgba(244,63,94,0.7)", border: "#F43F5E", label: "Expense", icon: "fa-receipt" },
                  margin: { bg: "rgba(245,158,11,0.7)", border: "#F59E0B", label: "Margin", icon: "fa-percent" },
                };
                return (
                  <div
                    key={key}
                    className={`legend-item ${visibleDatasets[key] ? "active" : "inactive"}`}
                    onClick={() => toggleDataset(key)}
                    style={{
                      borderColor: visibleDatasets[key] ? colors[key].border : "transparent",
                      opacity: visibleDatasets[key] ? 1 : 0.4,
                    }}
                  >
                    <i className={`fas ${colors[key].icon}`} style={{ color: colors[key].border }}></i>
                    <span className="legend-label">{colors[key].label}</span>
                  </div>
                );
              })}
            </div>
            <div className="chart-container compact-chart">
              <Bar data={getBarChartData()} options={barChartOptions} />
            </div>
          </div>

          {/* Card 2: RECEIVABLE BREAKDOWN - Green Theme */}
          <div className="doughnut-card green-theme">
            <div className="chart-header compact-header">
              <h3>
                <i className="fas fa-chart-pie" style={{ color: "#10B981" }}></i> RECEIVABLE BREAKDOWN
              </h3>
              <a href="#">View All →</a>
            </div>
            
            <div className="doughnut-top-section">
              <div className="chart-container doughnut-chart-container">
                <Doughnut data={receivableDoughnutData} options={receivableDoughnutOptions} plugins={[receivableCenterText]} />
              </div>
              <div className="details-list no-scroll-details">
                <div className="detail-item">
                  <div className="left">
                    <span className="color-dot" style={{ background: "#10B981" }}></span>
                    <span className="name">CHOUDHARY MUAZ</span>
                  </div>
                  <span className="pct">8.8%</span>
                  <span className="amt">
                    <span className="currency">Rs</span>2.38M
                  </span>
                </div>
                <div className="detail-item">
                  <div className="left">
                    <span className="color-dot" style={{ background: "#34D399" }}></span>
                    <span className="name">ASIF ALI SINDU</span>
                  </div>
                  <span className="pct">1.1%</span>
                  <span className="amt">
                    <span className="currency">Rs</span>304k
                  </span>
                </div>
                <div className="detail-item">
                  <div className="left">
                    <span className="color-dot" style={{ background: "#6EE7B7" }}></span>
                    <span className="name">MR ASHARAF</span>
                  </div>
                  <span className="pct">0.4%</span>
                  <span className="amt">
                    <span className="currency">Rs</span>104.8k
                  </span>
                </div>
                <div className="detail-item">
                  <div className="left">
                    <span className="color-dot" style={{ background: "#A7F3D0" }}></span>
                    <span className="name">ALI BASHIR</span>
                  </div>
                  <span className="pct">0.3%</span>
                  <span className="amt">
                    <span className="currency">Rs</span>68k
                  </span>
                </div>
                <div className="detail-item receivable-highlight">
                  <div className="left">
                    <span className="color-dot" style={{ background: "#D1FAE5" }}></span>
                    <span className="name">Other (16 Accounts)</span>
                  </div>
                  <span className="pct">110.5%</span>
                  <span className="amt">
                    <span className="currency">Rs</span>29.97M
                  </span>
                </div>
              </div>
            </div>

            <div className="aging-grid-section compact-aging">
              <div className="aging-grid green-aging">
                <div className="aging-box">
                  <span className="aging-label">0-30 Days</span>
                  <span className="aging-value">Rs 40.8k</span>
                </div>
                <div className="aging-box">
                  <span className="aging-label">31-60 Days</span>
                  <span className="aging-value">Rs 5.42M</span>
                </div>
                <div className="aging-box">
                  <span className="aging-label">61-90 Days</span>
                  <span className="aging-value">Rs 10.48M</span>
                </div>
                <div className="aging-box">
                  <span className="aging-label">91-120 Days</span>
                  <span className="aging-value">Rs 2.91M</span>
                </div>
                <div className="aging-box">
                  <span className="aging-label">121-150 Days</span>
                  <span className="aging-value">Rs 58.1k</span>
                </div>
                <div className="aging-box">
                  <span className="aging-label">150+ Days</span>
                  <span className="aging-value">Rs 1.08M</span>
                </div>
              </div>
            </div>
          </div>

          {/* Card 3: PAYABLE BREAKDOWN - Red Theme */}
          <div className="doughnut-card red-theme">
            <div className="chart-header compact-header">
              <h3>
                <i className="fas fa-chart-pie" style={{ color: "#EF4444" }}></i> PAYABLE BREAKDOWN
              </h3>
              <a href="#">View All →</a>
            </div>
            
            <div className="doughnut-top-section">
              <div className="chart-container doughnut-chart-container">
                <Doughnut data={payableDoughnutData} options={payableDoughnutOptions} plugins={[payableCenterText]} />
              </div>
              <div className="details-list no-scroll-details">
                <div className="detail-item">
                  <div className="left">
                    <span className="color-dot" style={{ background: "#EF4444" }}></span>
                    <span className="name">AM ASSOCIATES</span>
                  </div>
                  <span className="pct">61.5%</span>
                  <span className="amt">
                    <span className="currency">Rs</span>12.30M
                  </span>
                </div>
                <div className="detail-item">
                  <div className="left">
                    <span className="color-dot" style={{ background: "#F87171" }}></span>
                    <span className="name">LOCAL PURCHASE</span>
                  </div>
                  <span className="pct">32.8%</span>
                  <span className="amt">
                    <span className="currency">Rs</span>6.55M
                  </span>
                </div>
                <div className="detail-item">
                  <div className="left">
                    <span className="color-dot" style={{ background: "#FCA5A5" }}></span>
                    <span className="name">SHAHRYAR AHMED</span>
                  </div>
                  <span className="pct">4.9%</span>
                  <span className="amt">
                    <span className="currency">Rs</span>972.8k
                  </span>
                </div>
                <div className="detail-item">
                  <div className="left">
                    <span className="color-dot" style={{ background: "#FECACA" }}></span>
                    <span className="name">YOUSAF TRADING</span>
                  </div>
                  <span className="pct">0.5%</span>
                  <span className="amt">
                    <span className="currency">Rs</span>103.8k
                  </span>
                </div>
                <div className="detail-item payable-highlight">
                  <div className="left">
                    <span className="color-dot" style={{ background: "#FEE2E2" }}></span>
                    <span className="name">Others (1)</span>
                  </div>
                  <span className="pct">0.3%</span>
                  <span className="amt">
                    <span className="currency">Rs</span>62.5k
                  </span>
                </div>
              </div>
            </div>

            <div className="aging-grid-section compact-aging">
              <div className="aging-grid red-aging">
                <div className="aging-box">
                  <span className="aging-label">0-30 Days</span>
                  <span className="aging-value">Rs 45.3k</span>
                </div>
                <div className="aging-box">
                  <span className="aging-label">31-60 Days</span>
                  <span className="aging-value">Rs 10.33M</span>
                </div>
                <div className="aging-box">
                  <span className="aging-label">61-90 Days</span>
                  <span className="aging-value">Rs 7.01M</span>
                </div>
                <div className="aging-box">
                  <span className="aging-label">91-120 Days</span>
                  <span className="aging-value">Rs 1.46M</span>
                </div>
                <div className="aging-box">
                  <span className="aging-label">121-150 Days</span>
                  <span className="aging-value">Rs 1.08M</span>
                </div>
                <div className="aging-box">
                  <span className="aging-label">150+ Days</span>
                  <span className="aging-value">Rs 58.1k</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* New Bottom Row: 4 Cards */}
        <div className="bottom-row-4">
          {/* Card 1: Top Selling Items */}
          <div className="bottom-card selling-card">
            <div className="card-header compact-header">
              <div className="card-title">
                <span className="card-icon selling-icon"><i className="fas fa-arrow-up"></i></span>
                <h3>TOP SELLING ITEM</h3>
              </div>
              <a href="#">View All →</a>
            </div>
            <div className="card-body compact-body">
              <div className="item-row compact-row">
                <span className="item-rank gold">1</span>
                <span className="item-name compact-name">ECOSTAR INV AC 1.5 TON WS-18ARO01W T3 W</span>
                <span className="item-meta compact-meta">22 Pcs</span>
                <span className="item-price">Rs 2.78M</span>
              </div>
              <div className="item-row compact-row">
                <span className="item-rank silver">2</span>
                <span className="item-name compact-name">GREE INV 1.5 TON 18AITH21 WHITE T3</span>
                <span className="item-meta compact-meta">10 Pcs</span>
                <span className="item-price">Rs 1.98M</span>
              </div>
              <div className="item-row compact-row">
                <span className="item-rank bronze">3</span>
                <span className="item-name compact-name">HAIER INV AC 1.5 19HFS SILVER T3</span>
                <span className="item-meta compact-meta">13 Pcs</span>
                <span className="item-price">Rs 1.94M</span>
              </div>
              <div className="item-row compact-row">
                <span className="item-rank">4</span>
                <span className="item-name compact-name">NOBEL LED 32PL15 SMART TV</span>
                <span className="item-meta compact-meta">33 Pcs</span>
                <span className="item-price">Rs 921.2k</span>
              </div>
              <div className="item-row compact-row">
                <span className="item-rank">5</span>
                <span className="item-name compact-name">HAIER INV AC 1.5 TON 20HFTEX T3 WHITE</span>
                <span className="item-meta compact-meta">5 Pcs</span>
                <span className="item-price">Rs 830k</span>
              </div>
            </div>
            <div className="card-footer compact-footer">
              <span className="footer-total-label">Total Items:</span>
              <span className="footer-total-value">5</span>
              <span className="footer-total-label">Total Value:</span>
              <span className="footer-total-value">Rs 8.45M</span>
            </div>
          </div>

          {/* Card 2: Top Purchase Items */}
          <div className="bottom-card purchase-card">
            <div className="card-header compact-header">
              <div className="card-title">
                <span className="card-icon purchase-icon"><i className="fas fa-arrow-up"></i></span>
                <h3>TOP PURCHASE ITEM</h3>
              </div>
              <a href="#">View All →</a>
            </div>
            <div className="card-body compact-body">
              <div className="item-row compact-row">
                <span className="item-rank gold">1</span>
                <span className="item-name compact-name">PEL INV AC 1.0TON JUMBO PRIME T3 INVRTRN</span>
                <span className="item-meta compact-meta">8 Pcs</span>
                <span className="item-price">Rs 8.04M</span>
              </div>
              <div className="item-row compact-row">
                <span className="item-rank silver">2</span>
                <span className="item-name compact-name">ECOSTAR INV AC 1.5 TON WS-18ARO01W T3 W</span>
                <span className="item-meta compact-meta">22 Pcs</span>
                <span className="item-price">Rs 2.75M</span>
              </div>
              <div className="item-row compact-row">
                <span className="item-rank bronze">3</span>
                <span className="item-name compact-name">GREE INV 1.5 TON 18AITH21 WHITE T3</span>
                <span className="item-meta compact-meta">10 Pcs</span>
                <span className="item-price">Rs 1.91M</span>
              </div>
              <div className="item-row compact-row">
                <span className="item-rank">4</span>
                <span className="item-name compact-name">HAIER INV AC 1.5 19HFS SILVER T3</span>
                <span className="item-meta compact-meta">13 Pcs</span>
                <span className="item-price">Rs 1.88M</span>
              </div>
              <div className="item-row compact-row">
                <span className="item-rank">5</span>
                <span className="item-name compact-name">NOBEL LED 32PL15 SMART TV</span>
                <span className="item-meta compact-meta">33 Pcs</span>
                <span className="item-price">Rs 881.5k</span>
              </div>
            </div>
            <div className="card-footer compact-footer">
              <span className="footer-total-label">Total Items:</span>
              <span className="footer-total-value">5</span>
              <span className="footer-total-label">Total Value:</span>
              <span className="footer-total-value">Rs 15.46M</span>
            </div>
          </div>

          {/* Card 3: Low Stock Items */}
          <div className="bottom-card stock-card">
            <div className="card-header compact-header">
              <div className="card-title">
                <span className="card-icon stock-icon"><i className="fas fa-exclamation-triangle"></i></span>
                <h3>LOW STOCK ITEMS</h3>
              </div>
              <a href="#">View All →</a>
            </div>
            <div className="stock-alert compact-alert">
              <i className="fas fa-exclamation-circle"></i>
              <span className="stock-count">189 Items</span>
              <span className="stock-text-white">below minimum stock level</span>
            </div>
            <div className="card-body stock-body compact-body">
              <div className="item-row stock-warning danger compact-row">
                <span className="stock-danger-icon"><i className="fas fa-circle"></i></span>
                <span className="item-name stock-name compact-name">DAWLANCE REF 9169WB CHROME BLACK</span>
                <span className="stock-qty danger">-10 Pcs</span>
              </div>
              <div className="item-row stock-warning danger compact-row">
                <span className="stock-danger-icon"><i className="fas fa-circle"></i></span>
                <span className="item-name stock-name compact-name">HAIER T/P FAWM 100826S6</span>
                <span className="stock-qty danger">-5 Pcs</span>
              </div>
              <div className="item-row stock-warning danger compact-row">
                <span className="stock-danger-icon"><i className="fas fa-circle"></i></span>
                <span className="item-name stock-name compact-name">HAIER T/L FAWM 100316S6</span>
                <span className="stock-qty danger">-4 Pcs</span>
              </div>
              <div className="item-row stock-warning danger compact-row">
                <span className="stock-danger-icon"><i className="fas fa-circle"></i></span>
                <span className="item-name stock-name compact-name">HOMAGE INV AC 1.0 TON 1221S CLASSIC</span>
                <span className="stock-qty danger">-2 Pcs</span>
              </div>
              <div className="item-row stock-warning danger compact-row">
                <span className="stock-danger-icon"><i className="fas fa-circle"></i></span>
                <span className="item-name stock-name compact-name">HOMAGE INV AC 1.0 TON 1221S CLASSIC</span>
                <span className="stock-qty danger">-2 Pcs</span>
              </div>
            </div>
            <div className="card-footer stock-footer compact-footer">
              <span>⚠️ Critical Stock Alert</span>
              <span className="stock-text-white">5 Items Below Minimum</span>
            </div>
          </div>

          {/* Card 4: Top 5 Companies */}
          <div className="bottom-card company-card">
            <div className="card-header compact-header">
              <div className="card-title">
                <span className="card-icon company-icon"><i className="fas fa-building"></i></span>
                <h3>TOP 5 COMPANIES</h3>
              </div>
              <a href="#">View All →</a>
            </div>
            <div className="card-body compact-body company-body">
              <div className="company-item">
                <div className="company-row">
                  <span className="company-rank gold">1</span>
                  <span className="company-name">HAIER</span>
                  <span className="company-qty">130</span>
                  <span className="company-price">Rs 13.89M</span>
                  <span className="company-pct">42.3%</span>
                </div>
                <div className="progress-bar-wrapper">
                  <div className="progress-bar-fill" style={{ width: "42.3%" }}></div>
                </div>
              </div>
              <div className="company-item">
                <div className="company-row">
                  <span className="company-rank silver">2</span>
                  <span className="company-name">GREE</span>
                  <span className="company-qty">39</span>
                  <span className="company-price">Rs 7.03M</span>
                  <span className="company-pct">21.4%</span>
                </div>
                <div className="progress-bar-wrapper">
                  <div className="progress-bar-fill" style={{ width: "21.4%" }}></div>
                </div>
              </div>
              <div className="company-item">
                <div className="company-row">
                  <span className="company-rank bronze">3</span>
                  <span className="company-name">DAWLANCE</span>
                  <span className="company-qty">79</span>
                  <span className="company-price">Rs 4.72M</span>
                  <span className="company-pct">14.4%</span>
                </div>
                <div className="progress-bar-wrapper">
                  <div className="progress-bar-fill" style={{ width: "14.4%" }}></div>
                </div>
              </div>
              <div className="company-item">
                <div className="company-row">
                  <span className="company-rank">4</span>
                  <span className="company-name">PEL</span>
                  <span className="company-qty">38</span>
                  <span className="company-price">Rs 3.71M</span>
                  <span className="company-pct">11.3%</span>
                </div>
                <div className="progress-bar-wrapper">
                  <div className="progress-bar-fill" style={{ width: "11.3%" }}></div>
                </div>
              </div>
              <div className="company-item">
                <div className="company-row">
                  <span className="company-rank">5</span>
                  <span className="company-name">ECOSTAR</span>
                  <span className="company-qty">28</span>
                  <span className="company-price">Rs 3.48M</span>
                  <span className="company-pct">10.6%</span>
                </div>
                <div className="progress-bar-wrapper">
                  <div className="progress-bar-fill" style={{ width: "10.6%" }}></div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* New Row: 4 Cards */}
        <div className="new-row">
          <div className="new-card">
            <div className="chart-header">
              <h3><i className="fas fa-wave-square"></i> LAST 10 DAYS</h3>
              <a href="#">View →</a>
            </div>
            <div className="chart-container">
              <Line data={last10Data} options={last10Options} />
            </div>
          </div>

          <div className="new-card">
            <div className="chart-header">
              <h3><i className="fas fa-calendar-alt"></i> YEARLY SALES</h3>
              <a href="#">View →</a>
            </div>
            <div className="chart-container">
              <Bar data={yearlyData} options={yearlyOptions} />
            </div>
          </div>

          {/* Card 3: TOP SALESMAN */}
          <div className="new-card">
            <div className="chart-header">
              <h3><i className="fas fa-trophy"></i> TOP SALESMAN</h3>
              <a href="#" onClick={(e) => { e.preventDefault(); setIsModalOpen(true); }}>View All →</a>
            </div>
            <div className="salesman-list">
              {salesmanData.slice(0, 4).map((salesman) => (
                <div className="salesman-item" key={salesman.rank}>
                  <span className="salesman-rank">#{salesman.rank}</span>
                  <div className="salesman-info">
                    <div className="name">{salesman.name}</div>
                    <div className="detail"><span>Qty: {salesman.qty}</span></div>
                  </div>
                  <div className="salesman-amount">
                    <div className="total">{salesman.sales}</div>
                    <div className="growth"><i className="fas fa-arrow-up"></i> {salesman.growth}</div>
                  </div>
                </div>
              ))}
              <div className="salesman-footer">
                <div className="footer-left">
                  <span className="footer-label">Total Qty</span>
                  <span className="footer-value">734</span>
                </div>
                <div className="footer-center">
                  <span className="footer-label">Total Sales</span>
                  <span className="footer-value">Rs 46.43M</span>
                </div>
                <div className="footer-right">
                  <span className="footer-label">Growth</span>
                  <span className="footer-value growth-value">↑ Rs 2.55M</span>
                </div>
              </div>
            </div>
          </div>

          {/* Card 4: SALES BY CATEGORY */}
          <div className="new-card category-card">
            <div className="chart-header">
              <h3><i className="fas fa-tags"></i> SALES BY CATEGORY</h3>
              <a href="#">View →</a>
            </div>
            <div className="category-list">
              <div className="category-item">
                <div className="cat-row">
                  <span className="cat-badge" style={{ background: "linear-gradient(135deg, #38BDF8, #3B82F6)" }}>
                    <i className="fas fa-snowflake"></i>
                  </span>
                  <span className="cat-label">AC</span>
                  <span className="cat-qty">168</span>
                  <span className="cat-amt">Rs 24.36M</span>
                  <span className="cat-pct">58.9%</span>
                </div>
                <div className="cat-bar-wrapper">
                  <div className="cat-bar" style={{ width: "58.9%" }}></div>
                </div>
              </div>
              <div className="category-item">
                <div className="cat-row">
                  <span className="cat-badge" style={{ background: "linear-gradient(135deg, #38BDF8, #3B82F6)" }}>
                    <i className="fas fa-thermometer-half"></i>
                  </span>
                  <span className="cat-label">REFRIGERATOR</span>
                  <span className="cat-qty">77</span>
                  <span className="cat-amt">Rs 6.81M</span>
                  <span className="cat-pct">16.5%</span>
                </div>
                <div className="cat-bar-wrapper">
                  <div className="cat-bar" style={{ width: "16.5%" }}></div>
                </div>
              </div>
              <div className="category-item">
                <div className="cat-row">
                  <span className="cat-badge" style={{ background: "linear-gradient(135deg, #38BDF8, #3B82F6)" }}>
                    <i className="fas fa-tv"></i>
                  </span>
                  <span className="cat-label">LED</span>
                  <span className="cat-qty">55</span>
                  <span className="cat-amt">Rs 3.28M</span>
                  <span className="cat-pct">7.9%</span>
                </div>
                <div className="cat-bar-wrapper">
                  <div className="cat-bar" style={{ width: "7.9%" }}></div>
                </div>
              </div>
              <div className="category-item">
                <div className="cat-row">
                  <span className="cat-badge" style={{ background: "linear-gradient(135deg, #38BDF8, #3B82F6)" }}>
                    <i className="fas fa-wind"></i>
                  </span>
                  <span className="cat-label">AIR COOLER</span>
                  <span className="cat-qty">121</span>
                  <span className="cat-amt">Rs 3.07M</span>
                  <span className="cat-pct">7.4%</span>
                </div>
                <div className="cat-bar-wrapper">
                  <div className="cat-bar" style={{ width: "7.4%" }}></div>
                </div>
              </div>
              <div className="category-item">
                <div className="cat-row">
                  <span className="cat-badge" style={{ background: "linear-gradient(135deg, #38BDF8, #3B82F6)" }}>
                    <i className="fas fa-tshirt"></i>
                  </span>
                  <span className="cat-label">FAWM TOP LOAD</span>
                  <span className="cat-qty">31</span>
                  <span className="cat-amt">Rs 2.17M</span>
                  <span className="cat-pct">5.3%</span>
                </div>
                <div className="cat-bar-wrapper">
                  <div className="cat-bar" style={{ width: "5.3%" }}></div>
                </div>
              </div>
              <div className="category-item">
                <div className="cat-row">
                  <span className="cat-badge" style={{ background: "linear-gradient(135deg, #38BDF8, #3B82F6)" }}>
                    <i className="fas fa-ice-cream"></i>
                  </span>
                  <span className="cat-label">DEEP FREEZER</span>
                  <span className="cat-qty">18</span>
                  <span className="cat-amt">Rs 1.66M</span>
                  <span className="cat-pct">4%</span>
                </div>
                <div className="cat-bar-wrapper">
                  <div className="cat-bar" style={{ width: "4%" }}></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        /* Dashboard Container */
        .dashboard-container {
          max-width: 1480px;
          margin: 0 auto;
          width: 100%;
          padding: 0 4px;
        }

        /* Animation Keyframes */
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes slideUp {
          from { 
            opacity: 0;
            transform: translateY(30px) scale(0.95);
          }
          to { 
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }

        /* Header */
        .header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 28px;
          flex-wrap: wrap;
          gap: 12px;
        }
        .header h1 {
          font-size: 28px;
          font-weight: 700;
          background: linear-gradient(145deg, #38BDF8, #A78BFA, #34D399);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          letter-spacing: -0.5px;
          display: flex;
          align-items: center;
          gap: 8px;
        }
        .header h1 i {
          font-size: 28px;
          background: none;
          -webkit-text-fill-color: #38BDF8;
        }
        .header-right {
          display: flex;
          gap: 10px;
          flex-wrap: wrap;
          align-items: center;
        }
        .badge {
          background: ${isDark ? "rgba(30,41,59,0.8)" : "rgba(255,255,255,0.8)"};
          backdrop-filter: blur(4px);
          padding: 8px 18px;
          border-radius: 40px;
          font-size: 12px;
          font-weight: 500;
          color: ${isDark ? "#CBD5E1" : "#1E293B"};
          border: 1px solid ${isDark ? "#334155" : "#CBD5E1"};
          display: flex;
          align-items: center;
          gap: 8px;
          transition: 0.2s;
          cursor: default;
        }
        .badge i {
          color: #38BDF8;
          font-size: 14px;
        }
        .badge:hover {
          border-color: #38BDF8;
          background: ${isDark ? "#1E293B" : "#E2E8F0"};
        }
        .theme-toggle {
          background: ${isDark ? "rgba(30,41,59,0.8)" : "rgba(255,255,255,0.8)"};
          backdrop-filter: blur(4px);
          border: 1px solid ${isDark ? "#334155" : "#CBD5E1"};
          border-radius: 40px;
          padding: 8px 16px;
          color: ${isDark ? "#CBD5E1" : "#1E293B"};
          font-size: 14px;
          cursor: pointer;
          transition: 0.25s;
          display: flex;
          align-items: center;
          gap: 8px;
        }
        .theme-toggle:hover {
          border-color: #38BDF8;
          background: ${isDark ? "#1E293B" : "#E2E8F0"};
        }
        .theme-toggle i {
          font-size: 16px;
        }

        /* KPI Grid */
        .kpi-grid {
          display: grid;
          grid-template-columns: repeat(7, 1fr);
          gap: 16px;
          margin-bottom: 28px;
          width: 100%;
        }
        .kpi-card {
          background: ${isDark ? "rgba(30,41,59,0.7)" : "rgba(255,255,255,0.8)"};
          backdrop-filter: blur(4px);
          border-radius: 20px;
          padding: 18px 16px 16px;
          border: 1px solid ${isDark ? "rgba(71,85,105,0.25)" : "rgba(203,213,225,0.5)"};
          transition: 0.25s;
          position: relative;
          overflow: hidden;
          min-width: 0;
        }
        .kpi-card::before {
          content: '';
          position: absolute;
          top: 0; left: 0; right: 0;
          height: 3px;
          background: linear-gradient(90deg, #38BDF8, #818CF8, #34D399);
          opacity: 0.6;
        }
        .kpi-card:hover {
          transform: translateY(-5px);
          border-color: #38BDF8;
          box-shadow: 0 16px 40px -12px #0f2a3b;
        }
        .kpi-label {
          font-size: 11px;
          text-transform: uppercase;
          letter-spacing: 0.5px;
          color: ${isDark ? "#94A3B8" : "#64748B"};
          font-weight: 500;
          display: flex;
          align-items: center;
          gap: 6px;
        }
        .kpi-label i {
          font-size: 13px;
          color: #38BDF8;
        }
        .kpi-value {
          font-size: 24px;
          font-weight: 700;
          margin: 8px 0 4px;
          background: ${isDark ? "linear-gradient(135deg, #F1F5F9 70%, #94A3B8)" : "linear-gradient(135deg, #0B1120 70%, #475569)"};
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          word-break: break-word;
        }
        .kpi-sub {
          font-size: 11px;
          color: #64748B;
          display: flex;
          gap: 8px;
          align-items: center;
          flex-wrap: wrap;
        }
        .kpi-sub .green {
          color: #34D399;
          font-weight: 500;
        }
        .kpi-sub .red {
          color: #F87171;
          font-weight: 500;
        }

        /* Chart Row */
        .chart-row-3 {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 20px;
          margin-bottom: 28px;
          width: 100%;
        }
        .chart-card {
          background: ${isDark ? "rgba(30,41,59,0.7)" : "rgba(255,255,255,0.8)"};
          backdrop-filter: blur(4px);
          border-radius: 24px;
          padding: 16px 14px 14px;
          border: 1px solid ${isDark ? "rgba(71,85,105,0.25)" : "rgba(203,213,225,0.5)"};
          transition: 0.25s;
          min-width: 0;
        }
        .chart-card:hover {
          border-color: #38BDF8;
          box-shadow: 0 12px 40px -12px #0e2337;
        }

        .compact-chart-card {
          padding: 12px 12px 10px;
        }
        .compact-chart-header {
          margin-bottom: 6px !important;
        }
        .compact-chart-header h3 {
          font-size: 11px !important;
        }
        .compact-legend {
          gap: 6px !important;
          margin-bottom: 6px !important;
          padding: 2px 0 !important;
        }
        .compact-legend .legend-item {
          padding: 2px 8px !important;
          font-size: 8px !important;
          gap: 4px !important;
        }
        .compact-legend .legend-item i {
          font-size: 8px !important;
        }
        .compact-legend .legend-label {
          font-size: 8px !important;
        }
        .compact-chart {
          height: 180px !important;
        }

        .chart-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 14px;
        }
        .chart-header h3 {
          font-size: 13px;
          font-weight: 600;
          color: ${isDark ? "#E2E8F0" : "#0B1120"};
          display: flex;
          align-items: center;
          gap: 8px;
        }
        .chart-header h3 i {
          color: #38BDF8;
          font-size: 14px;
        }
        .chart-header a {
          font-size: 11px;
          color: #38BDF8;
          text-decoration: none;
          font-weight: 500;
          opacity: 0.8;
          transition: 0.2s;
        }
        .chart-header a:hover {
          opacity: 1;
        }
        .chart-container {
          height: 200px;
          position: relative;
          width: 100%;
        }

        /* Enhanced Legend */
        .enhanced-legend {
          display: flex;
          gap: 12px;
          margin-bottom: 12px;
          flex-wrap: nowrap;
          padding: 4px 0;
          justify-content: flex-start;
          align-items: center;
        }
        .legend-item {
          display: flex;
          align-items: center;
          gap: 6px;
          padding: 4px 12px;
          border-radius: 20px;
          border: 1.5px solid transparent;
          cursor: pointer;
          transition: all 0.3s ease;
          background: ${isDark ? "rgba(30,41,59,0.4)" : "rgba(255,255,255,0.4)"};
          font-size: 10px ;
          font-weight: 500;
          white-space: nowrap;
        }
        .legend-item:hover {
          transform: scale(1.05);
          box-shadow: 0 4px 12px rgba(0,0,0,0.15);
        }
        .legend-item.active {
          background: ${isDark ? "rgba(30,41,59,0.6)" : "rgba(255,255,255,0.6)"};
        }
        .legend-item.inactive {
          opacity: 0.4;
        }
        .legend-item i {
          font-size: 11px;
        }
        .legend-label {
          font-size: 10px;
          font-weight: 600;
          color: ${isDark ? "#E2E8F0" : "#0B1120"};
        }

        /* ===== DOUGHNUT CARDS ===== */
        .doughnut-card {
          background: ${isDark ? "rgba(30,41,59,0.7)" : "rgba(255,255,255,0.8)"};
          backdrop-filter: blur(4px);
          border-radius: 24px;
          padding: 14px 14px 12px;
          border: 1px solid ${isDark ? "rgba(71,85,105,0.25)" : "rgba(203,213,225,0.5)"};
          transition: 0.25s;
          min-width: 0;
          display: flex;
          flex-direction: column;
        }

        /* Green Theme */
        .green-theme:hover {
          border-color: #10B981;
          box-shadow: 0 12px 40px -12px rgba(16,185,129,0.15);
        }
        .green-theme .aging-box {
          background: ${isDark ? "rgba(16,185,129,0.06)" : "rgba(16,185,129,0.04)"};
          border-color: ${isDark ? "rgba(16,185,129,0.08)" : "rgba(16,185,129,0.06)"};
        }
        .green-theme .aging-box:hover {
          background: ${isDark ? "rgba(16,185,129,0.12)" : "rgba(16,185,129,0.08)"};
          border-color: #10B981;
        }
        .green-theme .aging-value {
          color: #10B981;
        }
        .receivable-highlight {
          background: rgba(16,185,129,0.06);
          border-radius: 4px;
          padding: 3px 4px;
          margin: 1px -2px;
          border-left: 2px solid #10B981;
        }
        .receivable-highlight .name {
          color: #10B981;
        }

        /* Red Theme */
        .red-theme:hover {
          border-color: #EF4444;
          box-shadow: 0 12px 40px -12px rgba(239,68,68,0.15);
        }
        .red-theme .aging-box {
          background: ${isDark ? "rgba(239,68,68,0.06)" : "rgba(239,68,68,0.04)"};
          border-color: ${isDark ? "rgba(239,68,68,0.08)" : "rgba(239,68,68,0.06)"};
        }
        .red-theme .aging-box:hover {
          background: ${isDark ? "rgba(239,68,68,0.12)" : "rgba(239,68,68,0.08)"};
          border-color: #EF4444;
        }
        .red-theme .aging-value {
          color: #EF4444;
        }
        .payable-highlight {
          background: rgba(239,68,68,0.06);
          border-radius: 4px;
          padding: 3px 4px;
          margin: 1px -2px;
          border-left: 2px solid #EF4444;
        }
        .payable-highlight .name {
          color: #EF4444;
        }

        /* Compact Header */
        .compact-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 4px !important;
          flex-shrink: 0;
        }
        .compact-header h3 {
          font-size: 11px;
          font-weight: 600;
          color: ${isDark ? "#E2E8F0" : "#0B1120"};
          display: flex;
          align-items: center;
          gap: 4px;
          margin: 0;
        }
        .compact-header a {
          font-size: 8px;
          color: #10B981;
          text-decoration: none;
          font-weight: 500;
          opacity: 0.8;
          transition: 0.2s;
        }
        .red-theme .compact-header a {
          color: #EF4444;
        }
        .compact-header a:hover {
          opacity: 1;
        }

        /* Top Section: Doughnut + Details - No Scroll */
        .doughnut-top-section {
          display: flex;
          gap: 10px;
          align-items: center;
          flex: 1;
          min-height: 0;
        }
        .doughnut-chart-container {
          flex: 0 0 90px;
          width: 90px;
          height: 90px;
          position: relative;
        }

        .no-scroll-details {
          flex: 1;
          overflow: visible;
          padding-right: 2px;
        }
        .detail-item {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 2px 0;
          border-bottom: 1px solid ${isDark ? "rgba(71,85,105,0.08)" : "rgba(203,213,225,0.15)"};
          font-size: 8px;
          gap: 2px;
        }
        .detail-item:last-child {
          border-bottom: none;
        }
        .detail-item .left {
          display: flex;
          align-items: center;
          gap: 4px;
          flex: 1;
          min-width: 0;
        }
        .detail-item .color-dot {
          width: 6px;
          height: 6px;
          border-radius: 50%;
          flex-shrink: 0;
        }
        .detail-item .name {
          color: ${isDark ? "#E2E8F0" : "#0B1120"};
          font-weight: 500;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
          font-size: 9px;
        }
        .detail-item .pct {
          color: ${isDark ? "#94A3B8" : "#475569"};
          font-weight: 500;
          min-width: 28px;
          text-align: right;
          font-size: 9px;
        }
        .detail-item .amt {
          color: ${isDark ? "#F8FAFC" : "#0B1120"};
          font-weight: 600;
          min-width: 50px;
          text-align: right;
          font-size: 9px;
        }
        .detail-item .amt .currency {
          color: #64748B;
          font-weight: 400;
          font-size: 6px;
          margin-right: 1px;
        }

        /* Bottom Section: Aging Grid - Compact */
        .compact-aging {
          margin-top: 6px;
          padding-top: 6px;
          border-top: 1px solid ${isDark ? "rgba(71,85,105,0.1)" : "rgba(203,213,225,0.15)"};
        }
        .aging-grid {
          display: grid;
          grid-template-columns: repeat(6, 1fr);
          gap: 3px;
        }
        .aging-box {
          display: flex;
          flex-direction: column;
          align-items: center;
          padding: 3px 2px;
          border-radius: 4px;
          transition: all 0.2s ease;
          text-align: center;
          border: 1px solid transparent;
        }
        .aging-box:hover {
          transform: translateY(-1px);
        }
        .aging-label {
          font-size: 7px;
          font-weight: 600;
          color: ${isDark ? "#94A3B8" : "#64748B"};
          text-transform: uppercase;
          letter-spacing: 0.2px;
          margin-bottom: 1px;
        }
        .aging-value {
          font-size: 9px;
          font-weight: 700;
        }

        /* Bottom Row - 4 Cards */
        .bottom-row-4 {
          display: grid;
          grid-template-columns: 1fr 1fr 1fr 1fr;
          gap: 16px;
          margin-bottom: 28px;
          width: 100%;
        }

        .bottom-card {
          background: ${isDark ? "rgba(30,41,59,0.7)" : "rgba(255,255,255,0.8)"};
          backdrop-filter: blur(4px);
          border-radius: 24px;
          padding: 14px 12px 12px;
          border: 1px solid ${isDark ? "rgba(71,85,105,0.25)" : "rgba(203,213,225,0.5)"};
          transition: all 0.3s ease;
          display: flex;
          flex-direction: column;
          min-width: 0;
          position: relative;
          overflow: hidden;
        }
        .bottom-card:hover {
          transform: translateY(-4px);
          box-shadow: 0 12px 40px -12px rgba(0,0,0,0.3);
        }
        .bottom-card::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          height: 3px;
        }

        .selling-card::before {
          background: linear-gradient(90deg, #34D399, #10B981);
        }
        .selling-card:hover {
          border-color: #34D399;
        }

        .purchase-card::before {
          background: linear-gradient(90deg, #1458C1, #1E6BE8);
        }
        .purchase-card:hover {
          border-color: #1458C1;
        }
        .purchase-icon {
          background: linear-gradient(135deg, #1458C1, #1E6BE8);
        }

        .stock-card::before {
          background: linear-gradient(90deg, #EF4444, #DC2626);
        }
        .stock-card:hover {
          border-color: #EF4444;
        }

        .company-card::before {
          background: linear-gradient(90deg, #8B5CF6, #A78BFA);
        }
        .company-card:hover {
          border-color: #8B5CF6;
        }
        .company-icon {
          background: linear-gradient(135deg, #8B5CF6, #A78BFA);
        }

        /* Card Header */
        .card-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 4px;
          flex-shrink: 0;
        }
        .card-title {
          display: flex;
          align-items: center;
          gap: 4px;
        }
        .card-title h3 {
          font-size: 10px;
          font-weight: 600;
          color: ${isDark ? "#E2E8F0" : "#0B1120"};
          margin: 0;
        }
        .card-icon {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          width: 20px;
          height: 20px;
          border-radius: 4px;
          font-size: 9px;
          color: white;
          flex-shrink: 0;
        }
        .selling-icon {
          background: linear-gradient(135deg, #34D399, #10B981);
        }
        .stock-icon {
          background: linear-gradient(135deg, #EF4444, #DC2626);
        }
        .card-header a {
          font-size: 8px;
          color: #38BDF8;
          text-decoration: none;
          font-weight: 500;
          opacity: 0.8;
          transition: 0.2s;
        }
        .card-header a:hover {
          opacity: 1;
        }

        /* Compact Alert */
        .compact-alert {
          display: flex;
          align-items: center;
          gap: 6px;
          padding: 3px 8px;
          background: ${isDark ? "rgba(239,68,68,0.12)" : "rgba(239,68,68,0.06)"};
          border-radius: 4px;
          margin-bottom: 4px;
          border-left: 2px solid #EF4444;
        }
        .compact-alert i {
          color: #EF4444;
          font-size: 10px;
        }
        .stock-count {
          font-size: 10px;
          font-weight: 700;
          color: #EF4444;
        }
        .stock-text-white {
          font-size: 9px;
          font-weight: 500;
          color: ${isDark ? "#F1F5F9" : "#1E293B"};
        }

        /* Compact Body */
        .compact-body {
          flex: 1;
          display: flex;
          flex-direction: column;
          gap: 2px;
        }
        .stock-body {
          gap: 2px;
        }
        .company-body {
          gap: 3px;
        }

        /* Compact Row - Aligned Layout */
        .compact-row {
          display: flex;
          align-items: center;
          gap: 4px;
          padding: 2px 4px;
          border-radius: 4px;
          background: ${isDark ? "rgba(71,85,105,0.04)" : "rgba(203,213,225,0.03)"};
          transition: all 0.2s ease;
        }
        .compact-row:hover {
          background: ${isDark ? "rgba(56,189,248,0.06)" : "rgba(56,189,248,0.03)"};
          transform: translateX(2px);
        }

        /* Stock Item Rows */
        .stock-warning.danger {
          background: ${isDark ? "rgba(239,68,68,0.08)" : "rgba(239,68,68,0.04)"};
          border-left: 2px solid #EF4444;
          padding: 2px 4px;
        }
        .stock-warning.danger:hover {
          background: ${isDark ? "rgba(239,68,68,0.14)" : "rgba(239,68,68,0.07)"};
        }
        .stock-danger-icon {
          color: #EF4444;
          font-size: 5px;
          flex-shrink: 0;
          animation: pulse-danger 1.5s ease-in-out infinite;
        }
        @keyframes pulse-danger {
          0%, 100% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.5; transform: scale(0.8); }
        }

        /* Rank Badges */
        .item-rank {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          min-width: 16px;
          height: 16px;
          border-radius: 50%;
          font-size: 7px;
          font-weight: 800;
          background: ${isDark ? "rgba(71,85,105,0.15)" : "rgba(203,213,225,0.15)"};
          color: ${isDark ? "#94A3B8" : "#64748B"};
          flex-shrink: 0;
        }
        .item-rank.gold {
          background: linear-gradient(135deg, #FBBF24, #F59E0B);
          color: white;
        }
        .item-rank.silver {
          background: linear-gradient(135deg, #CBD5E1, #94A3B8);
          color: white;
        }
        .item-rank.bronze {
          background: linear-gradient(135deg, #CD7F32, #B8860B);
          color: white;
        }

        /* Item Name - Compact */
        .compact-name {
          font-size: 9px;
          font-weight: 500;
          color: ${isDark ? "#E2E8F0" : "#0B1120"};
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
          flex: 1;
          min-width: 0;
        }
        .stock-name {
          font-size: 9px;
          font-weight: 500;
          color: ${isDark ? "#E2E8F0" : "#0B1120"};
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
          flex: 1;
          min-width: 0;
        }

        /* Item Meta - Pcs / Qty */
        .compact-meta {
          font-size: 9px;
          font-weight: 600;
          color: ${isDark ? "#CBD5E1" : "#334155"};
          flex-shrink: 0;
          min-width: 35px;
          text-align: right;
        }

        /* Stock Qty */
        .stock-qty {
          font-size: 8px;
          font-weight: 700;
          padding: 1px 6px;
          border-radius: 8px;
          flex-shrink: 0;
          text-align: right;
          min-width: 40px;
        }
        .stock-qty.danger {
          color: #EF4444;
          background: ${isDark ? "rgba(239,68,68,0.12)" : "rgba(239,68,68,0.06)"};
        }

        /* Item Price */
        .item-price {
          font-size: 9px;
          font-weight: 700;
          color: ${isDark ? "#F8FAFC" : "#0B1120"};
          text-align: right;
          flex-shrink: 0;
          background: ${isDark ? "rgba(71,85,105,0.06)" : "rgba(203,213,225,0.06)"};
          padding: 1px 6px;
          border-radius: 6px;
          min-width: 50px;
        }
        .compact-row:hover .item-price {
          color: #38BDF8;
        }

        /* Company Card Specific Styles */
        .company-item {
          display: flex;
          flex-direction: column;
          gap: 1px;
          padding: 2px 3px;
          border-radius: 4px;
          transition: all 0.2s ease;
        }
        .company-item:hover {
          background: ${isDark ? "rgba(139,92,246,0.06)" : "rgba(139,92,246,0.03)"};
        }
        .company-row {
          display: flex;
          align-items: center;
          gap: 4px;
          padding: 0 2px;
        }
        .company-rank {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          min-width: 16px;
          height: 16px;
          border-radius: 50%;
          font-size: 7px;
          font-weight: 800;
          background: ${isDark ? "rgba(71,85,105,0.15)" : "rgba(203,213,225,0.15)"};
          color: ${isDark ? "#94A3B8" : "#64748B"};
          flex-shrink: 0;
        }
        .company-rank.gold {
          background: linear-gradient(135deg, #FBBF24, #F59E0B);
          color: white;
        }
        .company-rank.silver {
          background: linear-gradient(135deg, #CBD5E1, #94A3B8);
          color: white;
        }
        .company-rank.bronze {
          background: linear-gradient(135deg, #CD7F32, #B8860B);
          color: white;
        }
        .company-name {
          font-size: 9px;
          font-weight: 600;
          color: ${isDark ? "#E2E8F0" : "#0B1120"};
          flex: 1;
          min-width: 0;
        }
        .company-qty {
          font-size: 8px;
          font-weight: 500;
          color: ${isDark ? "#94A3B8" : "#64748B"};
          min-width: 25px;
          text-align: right;
        }
        .company-price {
          font-size: 8px;
          font-weight: 600;
          color: ${isDark ? "#CBD5E1" : "#334155"};
          min-width: 45px;
          text-align: right;
          background: ${isDark ? "rgba(71,85,105,0.06)" : "rgba(203,213,225,0.04)"};
          padding: 1px 4px;
          border-radius: 4px;
        }
        .company-pct {
          font-size: 8px;
          font-weight: 700;
          color: #8B5CF6;
          min-width: 30px;
          text-align: right;
        }
        .progress-bar-wrapper {
          width: 100%;
          height: 3px;
          background: ${isDark ? "rgba(71,85,105,0.15)" : "rgba(203,213,225,0.2)"};
          border-radius: 3px;
          overflow: hidden;
        }
        .progress-bar-fill {
          height: 100%;
          border-radius: 3px;
          background: linear-gradient(90deg, #8B5CF6, #A78BFA);
          transition: width 0.8s cubic-bezier(0.4, 0, 0.2, 1);
          position: relative;
        }
        .progress-bar-fill::after {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent);
          transform: translateX(-100%);
          animation: shimmer-bar 2s infinite;
        }
        @keyframes shimmer-bar {
          100% { transform: translateX(100%); }
        }
        .company-item:hover .progress-bar-fill {
          box-shadow: 0 0 12px rgba(139,92,246,0.3);
        }

        /* Compact Footer */
        .compact-footer {
          margin-top: 4px;
          padding-top: 4px;
          border-top: 1px solid ${isDark ? "rgba(71,85,105,0.1)" : "rgba(203,213,225,0.12)"};
          display: flex;
          align-items: center;
          justify-content: flex-end;
          gap: 8px;
          font-size: 8px;
          font-weight: 600;
          color: ${isDark ? "#94A3B8" : "#64748B"};
          flex-shrink: 0;
        }
        .stock-footer {
          color: #EF4444;
          border-top-color: ${isDark ? "rgba(239,68,68,0.3)" : "rgba(239,68,68,0.2)"};
          justify-content: space-between;
        }
        .footer-total-label {
          color: ${isDark ? "#94A3B8" : "#64748B"};
          font-weight: 500;
        }
        .footer-total-value {
          color: ${isDark ? "#F8FAFC" : "#0B1120"};
          font-weight: 700;
        }
        .stock-footer .footer-total-label,
        .stock-footer .footer-total-value {
          color: #EF4444;
        }

        /* New Row */
        .new-row {
          display: grid;
          grid-template-columns: 1.4fr 1.2fr 1.2fr 1.2fr;
          gap: 20px;
          margin-bottom: 100px;
          width: 100%;
        }
        .new-card {
          background: ${isDark ? "rgba(30,41,59,0.7)" : "rgba(255,255,255,0.8)"};
          backdrop-filter: blur(4px);
          border-radius: 24px;
          padding: 20px 18px 18px;
          border: 1px solid ${isDark ? "rgba(71,85,105,0.25)" : "rgba(203,213,225,0.5)"};
          transition: 0.25s;
          display: flex;
          flex-direction: column;
          min-width: 0;
        }
        .new-card:hover {
          border-color: #38BDF8;
          box-shadow: 0 12px 40px -12px #0e2337;
        }
        .new-card .chart-container {
          flex: 1;
          min-height: 0;
          position: relative;
          width: 100%;
        }

        /* Category Card - Fixed Overflow */
        .category-card {
          overflow: hidden;
        }
        .category-card .category-list {
          gap: 3px !important;
        }
        .category-card .cat-label {
          font-size: 8px !important;
          min-width: 60px !important;
        }
        .category-card .cat-qty {
          font-size: 7px !important;
          min-width: 22px !important;
        }
        .category-card .cat-amt {
          font-size: 8px !important;
          min-width: 55px !important;
        }
        .category-card .cat-pct {
          font-size: 7px !important;
          min-width: 30px !important;
        }
        .category-card .cat-badge {
          width: 16px !important;
          height: 16px !important;
          font-size: 7px !important;
        }
        .category-card .cat-bar-wrapper {
          height: 4px !important;
        }

        .category-list {
          display: flex;
          flex-direction: column;
          gap: 4px;
          flex: 1;
        }
        .category-item {
          display: flex;
          flex-direction: column;
          gap: 1px;
          padding: 2px 0;
          transition: all 0.2s ease;
          border-radius: 6px;
          padding: 3px 4px;
        }
        .category-item:hover {
          background: rgba(56,189,248,0.05);
          border-radius: 8px;
        }
        .cat-row {
          display: flex;
          align-items: center;
          gap: 6px;
          padding: 0 2px;
          flex-wrap: nowrap;
        }
        .cat-badge {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          width: 18px;
          height: 18px;
          border-radius: 6px;
          color: white;
          font-size: 8px;
          flex-shrink: 0;
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          box-shadow: 0 2px 6px rgba(0,0,0,0.12);
        }
        .category-item:hover .cat-badge {
          transform: scale(1.1) rotate(-5deg);
          box-shadow: 0 4px 12px rgba(56,189,248,0.25);
        }
        .cat-label {
          font-size: 9px;
          font-weight: 600;
          color: ${isDark ? "#E2E8F0" : "#0B1120"};
          min-width: 70px;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
          transition: color 0.3s ease;
        }
        .category-item:hover .cat-label {
          color: #38BDF8;
        }
        .cat-qty {
          font-size: 8px;
          color: #94A3B8;
          min-width: 25px;
          text-align: right;
        }
        .cat-amt {
          font-size: 9px;
          font-weight: 600;
          color: ${isDark ? "#F8FAFC" : "#0B1120"};
          min-width: 65px;
          text-align: right;
          margin-left: auto;
          transition: color 0.3s ease;
        }
        .category-item:hover .cat-amt {
          color: #38BDF8;
        }
        .cat-pct {
          font-size: 8px;
          font-weight: 600;
          color: #38BDF8;
          min-width: 35px;
          text-align: right;
        }
        .cat-bar-wrapper {
          width: 100%;
          height: 5px;
          background: ${isDark ? "rgba(71,85,105,0.15)" : "rgba(203,213,225,0.3)"};
          border-radius: 10px;
          overflow: hidden;
          position: relative;
        }
        .cat-bar {
          height: 100%;
          border-radius: 10px;
          background: linear-gradient(90deg, #38BDF8, #3B82F6);
          transition: width 0.8s cubic-bezier(0.4, 0, 0.2, 1), transform 0.3s ease;
          position: relative;
          width: 0;
          box-shadow: 0 0 15px rgba(56,189,248,0.15);
        }
        .category-item:hover .cat-bar {
          transform: scaleY(1.4);
          box-shadow: 0 0 25px rgba(56,189,248,0.3);
        }
        .cat-bar::after {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: linear-gradient(90deg, transparent, rgba(255,255,255,0.15), transparent);
          transform: translateX(-100%);
          animation: shimmer 2.5s infinite;
        }
        @keyframes shimmer {
          100% { transform: translateX(100%); }
        }

        /* Salesman */
        .salesman-list {
          display: flex;
          flex-direction: column;
          gap: 4px;
          flex: 1;
        }
        .salesman-item {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 5px 8px;
          border-radius: 10px;
          background: rgba(71,85,105,0.08);
          border-left: 2px solid #38BDF8;
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          cursor: default;
          position: relative;
          overflow: hidden;
        }
        .salesman-item:hover {
          transform: translateX(4px) scale(1.02);
          background: rgba(56,189,248,0.12);
          border-left: 3px solid #38BDF8;
          box-shadow: 0 4px 15px rgba(56,189,248,0.15);
        }
        .salesman-item::before {
          content: '';
          position: absolute;
          top: 0;
          left: -100%;
          width: 100%;
          height: 100%;
          background: linear-gradient(90deg, transparent, rgba(56,189,248,0.05), transparent);
          transition: left 0.6s ease;
        }
        .salesman-item:hover::before {
          left: 100%;
        }
        .salesman-item:nth-child(1) { border-left-color: #F59E0B; }
        .salesman-item:nth-child(2) { border-left-color: #94A3B8; }
        .salesman-item:nth-child(3) { border-left-color: #CD7F32; }
        .salesman-item:nth-child(4) { border-left-color: #64748B; }
        .salesman-rank {
          font-size: 11px;
          font-weight: 800;
          color: #38BDF8;
          min-width: 22px;
          transition: transform 0.3s ease;
        }
        .salesman-item:hover .salesman-rank {
          transform: scale(1.2);
        }
        .salesman-item:nth-child(1) .salesman-rank { color: #F59E0B; }
        .salesman-item:nth-child(2) .salesman-rank { color: #94A3B8; }
        .salesman-item:nth-child(3) .salesman-rank { color: #CD7F32; }
        .salesman-info {
          flex: 1;
          min-width: 0;
        }
        .salesman-info .name {
          font-size: 10px;
          font-weight: 600;
          color: ${isDark ? "#E2E8F0" : "#0B1120"};
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
          transition: color 0.3s ease;
        }
        .salesman-item:hover .salesman-info .name {
          color: #38BDF8;
        }
        .salesman-info .detail {
          font-size: 8px;
          color: #94A3B8;
        }
        .salesman-amount {
          text-align: right;
          flex-shrink: 0;
          transition: transform 0.3s ease;
        }
        .salesman-item:hover .salesman-amount {
          transform: scale(1.05);
        }
        .salesman-amount .total {
          font-size: 11px;
          font-weight: 700;
          color: ${isDark ? "#F8FAFC" : "#0B1120"};
          transition: color 0.3s ease;
        }
        .salesman-item:hover .salesman-amount .total {
          color: #38BDF8;
        }
        .salesman-amount .growth {
          font-size: 8px;
          color: #34D399;
        }
        .salesman-amount .growth i { font-size: 7px; }
        .salesman-footer {
          margin-top: 8px;
          padding-top: 8px;
          border-top: 1px solid ${isDark ? "rgba(71,85,105,0.2)" : "rgba(203,213,225,0.3)"};
          display: grid;
          grid-template-columns: 1fr 1fr 1fr;
          gap: 8px;
          flex-shrink: 0;
          background: ${isDark ? "rgba(71,85,105,0.06)" : "rgba(203,213,225,0.1)"};
          border-radius: 10px;
          padding: 8px 10px;
        }
        .footer-left, .footer-center, .footer-right {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 1px;
        }
        .footer-label {
          font-size: 7px;
          text-transform: uppercase;
          letter-spacing: 0.5px;
          color: #94A3B8;
          font-weight: 500;
        }
        .footer-value {
          font-size: 11px;
          font-weight: 700;
          color: ${isDark ? "#F8FAFC" : "#0B1120"};
        }
        .growth-value {
          color: #34D399 !important;
        }

        /* Responsive */
        @media (max-width: 1400px) {
          .kpi-grid {
            grid-template-columns: repeat(4, 1fr);
          }
          .chart-row-3 {
            grid-template-columns: 1fr 1fr;
          }
          .bottom-row-4 {
            grid-template-columns: 1fr 1fr;
          }
          .new-row {
            grid-template-columns: 1fr 1fr;
          }
          .aging-grid {
            grid-template-columns: repeat(3, 1fr);
          }
        }
        @media (max-width: 992px) {
          .kpi-grid {
            grid-template-columns: repeat(3, 1fr);
          }
          .bottom-row-4 {
            grid-template-columns: 1fr 1fr;
          }
          .new-row {
            grid-template-columns: 1fr 1fr;
          }
          .aging-grid {
            grid-template-columns: repeat(2, 1fr);
          }
        }
        @media (max-width: 768px) {
          .kpi-grid {
            grid-template-columns: repeat(2, 1fr);
          }
          .chart-row-3 {
            grid-template-columns: 1fr;
          }
          .bottom-row-4 {
            grid-template-columns: 1fr;
          }
          .new-row {
            grid-template-columns: 1fr;
          }
          .doughnut-top-section {
            flex-direction: column;
            align-items: center;
          }
          .doughnut-chart-container {
            flex: 0 0 120px;
            width: 120px;
            height: 120px;
          }
          .aging-grid {
            grid-template-columns: repeat(3, 1fr);
          }
          .header {
            flex-direction: column;
            align-items: flex-start;
          }
          .header-right {
            width: 100%;
            justify-content: flex-start;
          }
          .enhanced-legend {
            flex-wrap: wrap;
            gap: 6px;
          }
          .legend-item {
            font-size: 9px;
            padding: 3px 10px;
          }
        }
        @media (max-width: 480px) {
          .kpi-grid {
            grid-template-columns: 1fr;
          }
          .kpi-value {
            font-size: 20px;
          }
          .badge {
            font-size: 10px;
            padding: 6px 12px;
          }
          .legend-item {
            font-size: 8px;
            padding: 2px 8px;
          }
          .aging-grid {
            grid-template-columns: repeat(2, 1fr);
          }
        }
      `}</style>
    </div>
  );
}