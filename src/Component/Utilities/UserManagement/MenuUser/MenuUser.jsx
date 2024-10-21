import React, { useState, useEffect } from "react";
import { Button, Container, Nav } from "react-bootstrap";
import Tab from "react-bootstrap/Tab";
import Tabs from "react-bootstrap/Tabs";
import { Link, useNavigate, useParams } from "react-router-dom";
import axios from "axios";

import Alert from "@mui/material/Alert";
import { useTheme } from "../../../../ThemeContext";
import { isLoggedIn, getUserData, getOrganisationData } from "../../../Auth";
import NavComponent from "../../../MainComponent/Navform/navbarform";
import "./MenuUser.css";
import SingleButton from "../../../MainComponent/Button/SingleButton/SingleButton";
import { fetchGetUser, fetchMenu } from "../../../Redux/action";
import { useSelector, useDispatch } from "react-redux";
const MenuUser = () => {
  const { tusrid } = useParams();
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
              width: "50vw",
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
            <div
              className="row"
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <div className="col-5 label-item" style={{ textAlign: "left" }}>
                <span style={{ fontSize: "1.2rem", fontWeight: "bold" }}>
                  User:
                </span>{" "}
                <span style={{ fontSize: "1.2rem", color: "#2196F3" }}>
                  {userName}
                </span>
              </div>

              <div className="col-6 label-item" style={{ textAlign: "right" }}>
                <span style={{ fontSize: "1.2rem", fontWeight: "bold" }}>
                  {" Type:"}
                </span>
                <span style={{ fontSize: "1.2rem", color: "#4CAF50" }}>
                  {userType === "Admin"
                    ? "Admin"
                    : userType === "User"
                    ? "User"
                    : userType}
                </span>
              </div>
            </div>
            <Tabs
              activeKey={activeTab.toString()}
              onSelect={(k) => handleTabClick(parseInt(k))}
              id="fill-tab-example"
              fill
              style={{ backgroundColor: "#5aa4f2" }}
            >
              {[
                "Dashboard",
                "Files",
                "Transactions",
                "Reports",
                "Utilities",
              ].map((tabLabel, index) => (
                <Tab
                  eventKey={index}
                  title={
                    <span style={{ color: "white", fontSize: "11px" }}>
                      {tabLabel}
                    </span>
                  }
                  key={index}
                >
                  <div
                    style={{
                      overflowY: getdata.rows.length > 10 ? "auto" : "hidden",
                    }}
                    className="custom-scrollbar-user"
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
                          position: "sticky",
                          top: 0,
                          backgroundColor: "#3368b5",
                          color: "#fff",
                          boxShadow: "0 2px 4px rgba(0, 0, 0, 0.2)",
                        }}
                      >
                        <tr>
                          {getdata.columns.map((column, index) => (
                            <th
                              key={index}
                              style={{
                                width: column.field === "Sr" ? "60px" : "auto",
                                padding: "10px",
                                textAlign: "center",
                                height: "40px",
                              }}
                              onDoubleClick={
                                column.field === "Permissions"
                                  ? handleDoubleClick
                                  : null
                              }
                            >
                              {column.label}
                            </th>
                          ))}
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
                            {Object.keys(row).map((key, index) => (
                              <td
                                key={index}
                                style={{
                                  fontSize: "14px",
                                  padding: "10px",
                                  width:
                                    index === 0
                                      ? "20%"
                                      : index === 1
                                      ? "55%"
                                      : "25%",
                                  textAlign:
                                    key === "Description" ? "left" : "center",
                                  height: "40px",
                                  color: fontcolor,
                                }}
                              >
                                {row[key]}
                              </td>
                            ))}
                          </tr>
                        ))}
                        {Array.from({ length: Math.max(0, 20 - 3) }).map(
                          (_, rowIndex) => (
                            <tr
                              key={`blank-${rowIndex}`}
                              style={{
                                height: "40px",
                                backgroundColor: getcolor,
                                color: fontcolor,
                              }}
                            >
                              {Array.from({ length: 3 }).map((_, colIndex) => (
                                <td key={`blank-${rowIndex}-${colIndex}`}>
                                  &nbsp;
                                </td>
                              ))}
                            </tr>
                          )
                        )}
                      </tbody>
                    </table>
                  </div>
                </Tab>
              ))}
            </Tabs>
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

export default MenuUser;
