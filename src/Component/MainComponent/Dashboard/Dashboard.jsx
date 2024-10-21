import React, { useState, useEffect } from "react";
import "./Dashboard.css"; // Import your CSS file if using an external stylesheet
import { Doughnut, Radar, Pie, Bar, Line } from "react-chartjs-2";
import Card from "react-bootstrap/Card";

import {
  Chart as ChartJS,
  ArcElement,
  BarElement,
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement,
  LineController,
  BarController,
  PieController,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import axios from "axios";
const Dashboard = () => {
  const [getunassign, setgetunassign] = useState(0);
  const [getpending, setgetpending] = useState(0);
  const [getinstalled, setgetinstalled] = useState(0);
  const [getcancelled, setgetcancelled] = useState(0);
  const [getclosed, setgetclosed] = useState(0);

  const [getdailycomparison, setdailycomparison] = useState(0);
  const Cardd = ({ date, day, jobs, pending, installed }) => {
    return (
      <div className="card">
        <div className="card-header">
          <span className="date">{date}</span>
          <span className="day">{day}</span>
        </div>
        <div className="card-body">
          <div className="jobs">Jobs: {jobs}</div>
          <div className="pending">Pending: {pending}</div>
          <div className="installed">Installed: {installed}</div>
        </div>
      </div>
    );
  };
  const cardStyles = {
    background: "#fff",
    border: "1px solid #ddd",
    borderRadius: "8px",
    boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
    margin: "10px",
    padding: "15px",
    width: "200px",
    textAlign: "center",
  };

  const headerStyles = {
    borderBottom: "1px solid #eee",
    paddingBottom: "10px",
    marginBottom: "10px",
  };

  const dateStyles = {
    display: "block",
    fontSize: "1.5em",
    fontWeight: "bold",
  };

  const dayStyles = {
    display: "block",
    fontSize: "1em",
    color: "#888",
  };

  const bodyStyles = {
    fontSize: "0.9em",
  };

  const infoStyles = {
    margin: "5px 0",
  };
  const [dailyComparison, setDailyComparison] = useState([]);

  useEffect(() => {
    // Fetch the data on component mount
    const fetchData = async () => {
      const data = { FDayNum: 7 };
      const formData = new URLSearchParams(data).toString();

      try {
        const response = await axios.post(
          `https://crystalsolutions.com.pk/complaint/DailyComparison.php`,
          formData,
          {
            headers: {
              "Content-Type": "application/x-www-form-urlencoded",
            },
          }
        );

        console.log("Datda:", response.data);
        setDailyComparison(response.data);

        if (response.data.error === 200) {
        } else {
          console.log(response.data.message);
        }
      } catch (error) {
        console.error("Error:", error);
      }
    };

    fetchData();
  }, []);
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(
          "https://crystalsolutions.com.pk/complaint/JobStatus.php"
        );
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        const data = await response.json();
        console.log("Data:", data);
        setgetunassign(data[0].Unassigned);
        setgetpending(data[0].Pending);
        setgetinstalled(data[0].Installed);
        setgetcancelled(data[0].Cancelled);
        setgetclosed(data[0].Closed);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);
  const [gettechniciancomparison, settechniciancomparison] = useState([]);
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(
          "https://crystalsolutions.com.pk/complaint/TechnicianComparison.php"
        );
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        const data = await response.json();
        console.log("TechnicianComparison:", data);
        settechniciancomparison(data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);
  const headerStyle = {
    fontSize: "24px",
    textAlign: "center",
    marginBottom: "20px",
    color: "#333",
  };

  const cardContainerStyle = {
    display: "flex",
    flexDirection: "column",
    gap: "20px",
    padding: "20px",
  };

  const cardStyle = {
    backgroundColor: "#fff",
    border: "1px solid #e0e0e0",
    borderRadius: "8px",
    padding: "15px",
    boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
    transition: "transform 0.2s, box-shadow 0.2s",
    maxWidth: "300px",
    margin: "0 auto", // Center the card
  };

  const cardHeaderStyle = {
    display: "flex",
    alignItems: "center",
    marginBottom: "10px",
  };

  const cardTitleStyle = {
    fontSize: "18px",
    fontWeight: "bold",
    color: "#FFB200",
  };

  const cardRowStyle = {
    marginBottom: "8px",
    fontSize: "14px",
    color: "#666",
  };

  const labelStyle = {
    fontWeight: "bold",
    color: "#333",
  };

  const iconStyle = {
    fontSize: "20px",
    marginRight: "8px",
    color: "#FFB200",
  };
  return (
    <div className="row dashboard">
      <div className="col-sm-8">
        <div
          className="row "
          style={{
            display: "flex",
            justifyContent: "center",
            textAlign: "center",
          }}
        >
          <div class="card">
            <div class="card-header">UnAssign</div>
            <div class="card-body">{getunassign} </div>
          </div>
          <div class="card">
            <div class="card-header">Pending</div>
            <div class="card-body">{getpending} </div>
          </div>
          <div class="card">
            <div class="card-header">Installed</div>
            <div class="card-body">{getinstalled} </div>
          </div>
          <div class="card">
            <div class="card-header">Cancelled</div>
            <div class="card-body">{getcancelled} </div>
          </div>
          <div class="card">
            <div class="card-header">Closed</div>
            <div class="card-body">{getclosed} </div>
          </div>
        </div>
        <div
          className="row"
          style={{ marginTop: "2%", border: "1px solid black" }}
        >
          <div className="flex flex-wrap gap-4">
            <div
              style={{ backgroundColor: "#63aeff", color: "white" }}
              className="shadow-lg rounded-lg overflow-hidden flex flex-col md:flex-row"
            >
              <div className="p-3 flex-1">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-white-700">
                  <div className="row">
                    <div
                      className="col-12 text-center"
                      style={{ fontSize: "14px", fontWeight: "bold" }}
                    >
                      TECHNICIAN COMPARISON
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div
              style={{ backgroundColor: "#007BFF", color: "white" }}
              className="shadow-lg rounded-lg overflow-hidden flex flex-col md:flex-row"
            >
              <div className="p-3 flex-1">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-white-700">
                  <div className="row">
                    <div
                      className="col-2 text-center"
                      style={{ fontSize: "14px", fontWeight: "bold" }}
                    >
                      NAME
                    </div>
                    <div
                      className="col-2 text-center"
                      style={{ fontSize: "14px", fontWeight: "bold" }}
                    >
                      TECHNICIAN
                    </div>
                    <div
                      className="col-2 text-center"
                      style={{ fontSize: "14px", fontWeight: "bold" }}
                    >
                      MOBILE
                    </div>
                    <div
                      className="col-2 text-center"
                      style={{ fontSize: "14px", fontWeight: "bold" }}
                    >
                      ASSIGNED
                    </div>
                    <div
                      className="col-2 text-center"
                      style={{ fontSize: "14px", fontWeight: "bold" }}
                    >
                      PENDING
                    </div>
                    <div
                      className="col-2 text-center"
                      style={{ fontSize: "14px", fontWeight: "bold" }}
                    >
                      INSTALLED
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div
              style={{
                maxHeight: "400px", // Adjust the height as needed
                overflowY: "auto",
              }}
              className="bg-white shadow-lg rounded-lg overflow-hidden flex flex-col md:flex-row"
            >
              <div className="p-2 flex-1">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-gray-700">
                  {gettechniciancomparison.slice(0, 5).map((item, index) => (
                    <div key={index} className="row">
                      <div
                        className="col-2"
                        style={{ fontSize: "14px", fontWeight: "bold" }}
                      >
                        {item.Name}
                      </div>
                      <div className="col-2 text-center">{item.ttchcod}</div>
                      <div className="col-2 text-center">{item.Mobile}</div>
                      <div className="col-2 text-center">{item.Assigned}</div>
                      <div className="col-2 text-center">{item.Pending}</div>
                      <div className="col-2 text-center">{item.Installed}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="col-sm-4 " style={{ border: "1px solid black" }}>
        <div
          style={{ backgroundColor: "#63aeff", color: "white" }}
          className="row shadow-lg rounded-lg overflow-hidden flex flex-col md:flex-row"
        >
          <div className="p-3 flex-1">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-white-700">
              <div className="row">
                <div
                  className="col-12 text-center"
                  style={{ fontSize: "14px", fontWeight: "bold" }}
                >
                  DAILY COMPARISON
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="row">
          {dailyComparison.map((item, index) => (
            <div className="col-sm-6" key={index}>
              <div style={cardStyles}>
                <div style={headerStyles}>
                  <span style={dateStyles}>{item.Date}</span>
                  <span style={dayStyles}>{item.Day}</span>
                </div>
                <div style={bodyStyles}>
                  <div style={infoStyles}>Jobs: {item.Jobs}</div>
                  <div style={infoStyles}>Pending: {item.Pending}</div>
                  <div style={infoStyles}>Installed: {item.Installed}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
