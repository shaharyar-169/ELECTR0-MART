import React, { useState, useEffect } from "react";
import { Button, Container, Nav } from "react-bootstrap";
import Tab from "react-bootstrap/Tab";
import Tabs from "react-bootstrap/Tabs";
import { Link, useNavigate, useParams } from "react-router-dom";
import axios from "axios";

import Alert from "@mui/material/Alert";
import { useTheme } from "../../../../../ThemeContext";
import { isLoggedIn, getUserData, getOrganisationData } from "../../../../Auth";
import NavComponent from "../../../Navform/navbarform";
import "./MenuAdmin.css";
import SingleButton from "../../../Button/SingleButton/SingleButton";
import { fetchGetUser, fetchMenu } from "../../../../Redux/action";
import { useSelector, useDispatch } from "react-redux";
const MenuAdmin = () => {
  // const { tusrid } = useParams();
  const tusrid = "sohaib";
  const user = getUserData();
  const organisation = getOrganisationData();

  const { apiLinks } = useTheme();
  const [activeTab, setActiveTab] = useState(1);
  const [getdata, setData] = useState({ columns: [], rows: [] });
  const [showAlert, setShowAlert] = useState(false);
  const [allPermissionsY, setAllPermissionsY] = useState(false);
  const [userName, setUserName] = useState("");
  const [userType, setUserType] = useState("");
  const [toggleState, setToggleState] = useState(true);
  const navigate = useNavigate();
  const [alertData, setAlertData] = useState(null);
  const { data, loading, error } = useSelector((state) => state.getuser);
  const dispatch = useDispatch();
  useEffect(() => {
    const userr = data.find((item) => item.tusrid === tusrid);
    setUserName(userr && userr.tusrnam);
    setUserType(userr && userr.Type);
    dispatch(fetchGetUser(organisation.code));
  }, [dispatch, organisation.code]);

  useEffect(() => {
    fetchDataForUserId(tusrid);
  }, [activeTab]);

  const {
    isSidebarVisible,
    toggleSidebar,
    getcolor, // Background color from context
    fontcolor, // Font color from context
    toggleChangeColor,
  } = useTheme();

  function fetchDataForUserId() {
    console.log("call the api");
    const apiUrl = `${apiLinks}/GetMenu.php`;
    const data = { FUsrId: tusrid, code: organisation.code };
    const formData = new URLSearchParams(data).toString();

    return axios
      .post(apiUrl, formData)
      .then((response) => response.data)
      .then((apiData) => {
        const mainMenuItem = apiData.find(
          (item) => item.tmencod === `${activeTab}-00-00`
        );

        if (!mainMenuItem) {
          console.log("Main menu item not found for tab:", activeTab);
          return;
        }

        const subItems = apiData.filter((subItem) => {
          return subItem.tmencod.startsWith(`${activeTab}-`);
        });

        // Transform data for rendering
        const transformedData = subItems.map((item) => ({
          // Sr: `${item.tmencod.split("-")[1]}`,
          Sr: item.tmencod,

          Description: item.tmendsc,
          Permissions: (
            <select
              style={{
                height: "20px",
                fontSize: "12px",
                padding: "0px",
                textAlign: "center",
                color: fontcolor, // Apply dynamic font color
                backgroundColor: getcolor, // Apply dynamic background color
                border: "1px solid #ccc", // Optional: to make sure the border color is visible
              }}
              value={item.Permission}
              onChange={(e) =>
                handlePermissionChange(item.tmencod, e.target.value)
              }
            >
              <option value="Y">Yes</option>
              <option value="N">No</option>
              <option value="S">Skip</option>
            </select>
          ),
        }));

        // Columns configuration for the table
        const columns = [
          { label: "Sr", field: "Sr", sort: "asc" },
          { label: "Description", field: "Description", sort: "asc" },
          { label: "Permissions", field: "Permissions", sort: "asc" },
        ];
        console.log(transformedData, "transformData");

        // Set the transformed data for the table
        setData({ columns, rows: transformedData });
      })
      .catch((error) => {
        console.error("Error:", error.message);
        throw error;
      });
  }

  function handlePermissionChange(menuCode, newPermissionValue) {
    Update_Menu({ id: tusrid, mcode: menuCode, permission: newPermissionValue })
      .then(() => {
        fetchDataForUserId(tusrid);
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  }
  const [getthecustomer, setthecustomer] = useState([]);
  const passthecodegetcustomer = (code) => {
    if (code === "1-00-00") {
      const customerlist = [
        {
          id: "1",
          customer: "Sohaib",
        },
        {
          id: "2",
          customer: "Ahmed",
        },
        {
          id: "3",
          customer: "Arsalan",
        },
      ];
      console.log(customerlist, "customerlist");
      setthecustomer(customerlist);
      return ["Sohaib", "Ali", "Ahmed"];
    } else {
      setthecustomer([]);
    }
  };
  function Update_Menu(users) {
    const apiUrl = `${apiLinks}/SavePermission.php`;
    const data = {
      code: organisation.code,
      FUsrId: tusrid,
      FMenCod: users.mcode,
      FUsrPem: users.permission,
    };
    console.log("Data:", data);
    const formData = new URLSearchParams(data).toString();

    return axios
      .post(apiUrl, formData)
      .then((response) => {
        fetchDataForUserId();
        console.log(
          "Update response:",
          response.data,
          user.userid,
          organisation.code
        );
        dispatch(fetchMenu(user.tusrid, organisation.code));
        setAlertData({
          type: "success",
          message: response.data.message,
        });
        setTimeout(() => {
          setAlertData(null);
        }, 3000);
      })
      .catch((error) => {
        console.error("Error:", error);
        throw error;
      });
  }

  const handleDoubleClick = () => {
    const newPermission = toggleState ? "Y" : "N";
    const updatedRows = getdata.rows.map((row) => {
      return {
        ...row,
        Permissions: (
          <select
            value={newPermission}
            onChange={(e) =>
              handlePermissionChange(row.tmencod, e.target.value)
            }
            className="form-select"
          >
            <option value="Y">Yes</option>
            <option value="N">No</option>
            <option value="S">Skip</option>
          </select>
        ),
      };
    });
    setData({ ...getdata, rows: updatedRows });
    setToggleState(!toggleState);
  };

  const submit = () => {};

  function handleTabClick(tabNumber) {
    console.log("Tab clicked:", tabNumber);
    setActiveTab(tabNumber);
  }

  const contentStyle = {
    backgroundColor: getcolor,
    height: "100vh",
    width: isSidebarVisible ? "calc(100vw - 5vw)" : "100vw",
    marginLeft: isSidebarVisible ? "5vw" : "25vh",
    transition: isSidebarVisible
      ? "margin-left 2s ease-in-out, margin-right 2s ease-in-out"
      : "margin-left 2s ease-in-out, margin-right 2s ease-in-out",
    display: "flex",
    justifyContent: "center",
    alignItems: "start",
    overflowX: "hidden",
    overflowY: "hidden",
    wordBreak: "break-word",
    textAlign: "center",
    maxWidth: "1000px",
    fontSize: "15px",
    fontStyle: "normal",
    fontWeight: "400",
    lineHeight: "23px",
    fontFamily: '"Poppins", sans-serif',
  };
  useEffect(() => {
    document.documentElement.style.setProperty("--font-color", fontcolor);
  }, [fontcolor]);
  useEffect(() => {
    document.documentElement.style.setProperty(
      "--backgroundcolor-color",
      getcolor
    );
  }, [getcolor]);
  const [selectedDescription, setSelectedDescription] = useState(null);
  return (
    <>
      <div
        style={{
          backgroundColor: getcolor,
          height: "100vh",
          width: "80vw",
          overflowX: "hidden",
          overflowY: "hidden",
        }}
      >
        {alertData && (
          <Alert
            severity={alertData.type}
            style={{
              position: "fixed",
              top: 0,
              left: 0,
              width: "30%",
              marginLeft: "35%",
              zIndex: 9999, // Ensuring this is very high
              textAlign: "center",
            }}
          >
            {alertData.message}
          </Alert>
        )}
        <div style={contentStyle}>
          <div
            style={{
              width: "60vw",
              height: "73vh",
              border: `1px solid ${fontcolor}`,
              alignItems: "center",
              justifyContent: "center",
              borderRadius: "8px",
              boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
              backgroundColor: getcolor,
              color: fontcolor,
            }}
          >
            <NavComponent textdata="Menu User" />
            <br />
            <div style={{ display: "flex", height: "100%" }}>
              {/* Vertical Tabs */}
              <div
                style={{
                  width: "25%",
                  backgroundColor: "#5aa4f2",
                  padding: "10px",
                  height: "64vh",
                }}
              >
                <Tabs
                  style={{ width: "100%" }}
                  activeKey={activeTab.toString()}
                  onSelect={(k) => handleTabClick(parseInt(k))}
                  id="vertical-tab-example"
                  className="flex-column"
                >
                  {[
                    "Dashboard   ",
                    "Files       ",
                    "Transactions",
                    "Reports     ",
                    "Utilities   ",
                  ].map((tabLabel, index) => (
                    <Tab
                      eventKey={index}
                      title={
                        <span
                          style={{
                            color: "black",
                            fontSize: "12px",
                          }}
                        >
                          {tabLabel}
                        </span>
                      }
                      key={index}
                    >
                      {/* You can add tab-specific content here if needed */}
                    </Tab>
                  ))}
                </Tabs>
              </div>

              {/* Table Section */}
              <div
                style={{ width: "25%", padding: "0px 2px 0 10px" }}
                className="custom-scrollbar"
              >
                <table
                  className="myTable"
                  style={{
                    fontSize: "14px",
                    width: "100%",
                    borderCollapse: "collapse",
                    backgroundColor: getcolor,
                  }}
                >
                  <thead
                    style={{
                      fontWeight: "bold",
                      height: "40px",
                      backgroundColor: "#3368b5",
                      color: "#fff",
                      boxShadow: "0 2px 4px rgba(0, 0, 0, 0.2)",
                    }}
                  >
                    <tr>
                      <th style={{ padding: "10px", textAlign: "center" }}>
                        Description
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {getdata.rows.map((row, rowIndex) => (
                      <tr
                        key={rowIndex}
                        style={{
                          height: "40px",
                          borderBottom: "1px solid #ddd",
                          backgroundColor: getcolor,
                          color: "black",
                        }}
                      >
                        <td
                          style={{
                            fontSize: "14px",
                            padding: "10px",
                            width: "35%",
                            textAlign: "left",
                            backgroundColor:
                              selectedDescription === row.Description
                                ? "#5aa4f2"
                                : "",
                            color:
                              selectedDescription === row.Description
                                ? "black"
                                : fontcolor,
                          }}
                          onClick={() => {
                            passthecodegetcustomer(row.Sr);
                            setSelectedDescription(row.Description);
                          }}
                        >
                          {row.Description}
                        </td>
                      </tr>
                    ))}
                    {Array.from({
                      length: Math.max(0, 20 - getdata.rows.length),
                    }).map((_, rowIndex) => (
                      <tr
                        key={`blank-${rowIndex}`}
                        style={{
                          height: "40px",
                          backgroundColor: getcolor,
                          color: fontcolor,
                        }}
                      >
                        <td>&nbsp;</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div
                style={{ width: "25%", padding: "0px 1px 0 2px" }}
                className="custom-scrollbar"
              >
                <table
                  className="myTable"
                  style={{
                    fontSize: "14px",
                    width: "100%",
                    borderCollapse: "collapse",
                    backgroundColor: getcolor,
                  }}
                >
                  <thead
                    style={{
                      fontWeight: "bold",
                      height: "40px",
                      backgroundColor: "#3368b5",
                      color: "#fff",
                      boxShadow: "0 2px 4px rgba(0, 0, 0, 0.2)",
                    }}
                  >
                    <tr>
                      <th style={{ padding: "10px", textAlign: "center" }}>
                        Customer
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {getthecustomer.map((row, rowIndex) => (
                      <tr
                        key={rowIndex}
                        style={{
                          height: "40px",
                          borderBottom: "1px solid #ddd",
                          backgroundColor: getcolor,
                          color: "black",
                        }}
                      >
                        <td
                          style={{
                            fontSize: "14px",
                            padding: "10px",
                            width: "35%",
                            textAlign: "left",
                            // backgroundColor: "#5aa4f2",
                            color: fontcolor,
                          }}
                        >
                          {row.customer}
                        </td>
                      </tr>
                    ))}
                    {Array.from({
                      length: Math.max(0, 20 - getdata.rows.length),
                    }).map((_, rowIndex) => (
                      <tr
                        key={`blank-${rowIndex}`}
                        style={{
                          height: "40px",
                          backgroundColor: getcolor,
                          color: fontcolor,
                        }}
                      >
                        <td>&nbsp;</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div
                style={{ width: "25%", padding: "0px 1px 0 2px" }}
                className="custom-scrollbar"
              >
                <table
                  className="myTable"
                  style={{
                    fontSize: "14px",
                    width: "100%",
                    borderCollapse: "collapse",
                    backgroundColor: getcolor,
                  }}
                >
                  <thead
                    style={{
                      fontWeight: "bold",
                      height: "40px",
                      backgroundColor: "#3368b5",
                      color: "#fff",
                      boxShadow: "0 2px 4px rgba(0, 0, 0, 0.2)",
                    }}
                  >
                    <tr>
                      <th style={{ padding: "10px", textAlign: "center" }}>
                        Check
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {getthecustomer.map((row, rowIndex) => (
                      <tr
                        key={rowIndex}
                        style={{
                          height: "40px",
                          borderBottom: "1px solid #ddd",
                          backgroundColor: getcolor,
                          color: "black",
                        }}
                      >
                        <td
                          style={{
                            fontSize: "14px",
                            padding: "10px",
                            width: "35%",
                            textAlign: "left",
                            // backgroundColor: "#5aa4f2",
                            color: fontcolor,
                          }}
                        >
                          {row.customer}
                        </td>
                      </tr>
                    ))}
                    {Array.from({
                      length: Math.max(0, 20 - getdata.rows.length),
                    }).map((_, rowIndex) => (
                      <tr
                        key={`blank-${rowIndex}`}
                        style={{
                          height: "40px",
                          backgroundColor: getcolor,
                          color: fontcolor,
                        }}
                      >
                        <td>&nbsp;</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            <div
              style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <SingleButton
                to="/UserManagement"
                text="Return"
                style={{ backgroundColor: "#186DB7", width: "120px" }}
              />
              <SingleButton
                to="/AddUser1"
                text="User"
                style={{ backgroundColor: "#186DB7", width: "120px" }}
              />
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default MenuAdmin;
