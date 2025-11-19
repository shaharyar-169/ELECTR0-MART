import React, { useState, useEffect } from "react";
import { Container, Spinner, Nav } from "react-bootstrap";
import axios from "axios";
import { Link } from "react-router-dom";
import { useTheme } from "../../../ThemeContext";

import { isLoggedIn, getUserData, getOrganisationData } from "../../Auth";
import NavComponent from "../../MainComponent/Navform/navbarform";
import "./UserManagement1.css";
import SingleButton from "../../MainComponent/Button/SingleButton/SingleButton";
import { useSelector, useDispatch } from "react-redux";
import { fetchGetUser } from "../../Redux/action";
export default function UserMaintenance() {
  const dispatch = useDispatch();
  const user = getUserData();
  const organisation = getOrganisationData();
  const tableTopColor = "#3368B5";
  const tableHeadColor = "#3368b5";
  const secondaryColor = "white";
  const btnColor = "#3368B5";
  const textColor = "white";

  const [tableData, setTableData] = useState([]);
  const [selectedSearch, setSelectedSearch] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { data, loading, error } = useSelector((state) => state.getuser);

  useEffect(() => {
    setTableData(data);
    dispatch(fetchGetUser(organisation && organisation.code));
  }, [dispatch, organisation.code]);

  const handleSearch = (e) => {
    setSelectedSearch(e.target.value);
  };

  let totalEntries = 0;

  const getFilteredTableData = () => {
    let filteredData = tableData;

    if (selectedSearch.trim() !== "") {
      const query = selectedSearch.trim().toLowerCase();
      filteredData = filteredData.filter(
        (data) => data.tusrnam && data.tusrnam.toLowerCase().includes(query)
      );
    }

    return filteredData;
  };

  const firstColWidth = { width: "6%" };
  const secondColWidth = { width: "10%" };
  const thirdColWidth = { width: "20%" };
  // const forthColWidth = { width: "11%" };
  const fifthColWidth = { width: "8%" };
  const sixthColWidth = { width: "8%" };
  const seventhColWidth = { width: "11%" };
  const eighthColWidth = { width: "21%" };
  const ninthColWidth = { width: "6%" };

  // Adjust the content width based on sidebar state
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);

  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
    };

    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);
  const {
    isSidebarVisible,
    toggleSidebar,
    getcolor,
    fontcolor,
    toggleChangeColor,
  } = useTheme();
  const contentStyle = {
    backgroundColor: getcolor,
    height: "100vh",
    width: isSidebarVisible ? "calc(100vw - 5%)" : "100vw",
    position: "relative",
    top: "50%",
    left: isSidebarVisible ? "50%" : "50%",
    transform: "translate(-50%, -50%)",
    transition: isSidebarVisible
      ? "left 3s ease-in-out, width 2s ease-in-out"
      : "left 3s ease-in-out, width 2s ease-in-out",
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

  return (
    <>
      <div style={contentStyle}>
        <div
          style={{
            backgroundColor: getcolor,
            color: fontcolor,
            width: "100%",
            border: `1px solid ${fontcolor}`,
            borderRadius: "9px",
          }}
        >
          <NavComponent textdata="User Management" />
          <div className="my-1 mx-3">
            <div className="col-12 d-flex justify-content-between mt-1">
              <div className="col-4 d-flex justify-content-start">
                <label
                  className="col-3 text-end"
                  // style={{ fontSize: "0.8rem" }}
                >
                  <strong>Search: &nbsp;&nbsp;</strong>
                </label>
                <input
                  type="text"
                  className="col-6"
                  onChange={handleSearch}
                  placeholder="Search by Name"
                  value={selectedSearch}
                  style={{
                    height: "22px",
                    // fontSize: "0.8rem",
                    backgroundColor: getcolor,
                    border: `1px solid ${fontcolor}`,
                    color: fontcolor,
                    "::placeholder": {
                      color: "white",
                      opacity: 5,
                    },
                  }}
                />
                {/* <Form.Control
                  type="search"
                  placeholder="Search"
                  className="col-6"
                  onChange={handleSearch}
                  value={selectedSearch}
                  style={{
                    height: "22px",
                    // fontSize: "0.8rem",
                    backgroundColor: getcolor,
                    border: `1px solid ${fontcolor}`,
                    color: fontcolor,
                    "::placeholder": {
                      color: "white",
                    },
                  }}
                /> */}
              </div>
            </div>
          </div>
          <div>
            <div
              style={{
                backgroundColor: textColor,
                borderBottom: `1px solid ${fontcolor}`,
                overflowY: getFilteredTableData.length > 10 ? "auto" : "hidden",
                maxHeight: "59vh",
                width: "100%",
                wordBreak: "break-word",
              }}
            >
              <table
                className="myTable"
                id="table"
                style={{
                  width: "100%",
                  position: "relative",
                  wordBreak: "break-word",
                }}
              >
                <thead
                  style={{
                    fontWeight: "bold",
                    height: "24px",
                    position: "sticky",
                    top: 0,
                    boxShadow: "0 2px 4px rgba(0, 0, 0, 0.2)",
                    wordBreak: "break-word",
                  }}
                >
                  <tr
                    style={{
                      backgroundColor: tableHeadColor,
                    }}
                  >
                    <td
                      className="border-dark"
                      style={{
                        ...secondColWidth,
                        wordBreak: "break-word",
                      }}
                    >
                      <a style={{ color: "white" }}>UserId</a>
                    </td>
                    <td
                      className="border-dark"
                      style={{
                        ...thirdColWidth,
                        wordBreak: "break-word",
                      }}
                    >
                      <a style={{ color: "white" }}>Name</a>
                    </td>

                    <td
                      className="border-dark"
                      style={{
                        ...fifthColWidth,
                        wordBreak: "break-word",
                      }}
                    >
                      <a style={{ color: "white" }}>Status</a>
                    </td>
                    <td
                      className="border-dark"
                      style={{
                        ...sixthColWidth,
                        wordBreak: "break-word",
                      }}
                    >
                      <a style={{ color: "white" }}>Type</a>
                    </td>
                    <td
                      className="border-dark"
                      style={{
                        ...seventhColWidth,
                        wordBreak: "break-word",
                      }}
                    >
                      <a style={{ color: "white" }}>Mobile</a>
                    </td>
                    <td
                      className="border-dark"
                      style={{
                        ...eighthColWidth,
                        wordBreak: "break-word",
                      }}
                    >
                      <a style={{ color: "white" }}>Email</a>
                    </td>

                    <td
                      className="border-dark"
                      style={{
                        ...ninthColWidth,
                        wordBreak: "break-word",
                      }}
                    >
                      <a style={{ color: "white" }}>Menu</a>
                    </td>
                  </tr>
                </thead>

                <tbody>
                  {isLoading ? (
                    <>
                      <tr>
                        <td colSpan="10" className="text-center">
                          <Spinner animation="border" variant="primary" />
                        </td>
                      </tr>
                      {Array.from({ length: Math.max(0, 30 - 3) }).map(
                        (_, rowIndex) => (
                          <tr key={`blank-${rowIndex}`}>
                            {Array.from({ length: 7 }).map((_, colIndex) => (
                              <td key={`blank-${rowIndex}-${colIndex}`}>
                                &nbsp;
                              </td>
                            ))}
                          </tr>
                        )
                      )}
                    </>
                  ) : (
                    <>
                      {getFilteredTableData().map((item, i) => {
                        totalEntries += 1;

                        return (
                          <tr
                            key={i}
                            style={{
                              fontSize: "12px !important",
                              wordBreak: "break-word",
                              backgroundColor: getcolor,
                              color: fontcolor,
                            }}
                          >
                            <td
                              className="text-start"
                              style={{
                                ...secondColWidth,
                                color: fontcolor,
                                wordBreak: "break-word",
                              }}
                            >
                              {item.tusrid}
                            </td>
                            <td
                              className="text-start"
                              style={{
                                ...thirdColWidth,
                                color: fontcolor,
                                wordBreak: "break-word",
                              }}
                            >
                              {item.tusrnam}
                            </td>

                            <td
                              className="text-center"
                              style={{
                                ...fifthColWidth,
                                color: fontcolor,
                                wordBreak: "break-word",
                              }}
                            >
                              {item.Status}
                            </td>
                            <td
                              className="text-center"
                              style={{
                                ...sixthColWidth,
                                color: fontcolor,
                                wordBreak: "break-word",
                              }}
                            >
                              {item.Type}
                            </td>
                            <td
                              className="text-center"
                              style={{
                                ...seventhColWidth,
                                color: fontcolor,
                                wordBreak: "break-word",
                              }}
                            >
                              {item.Mobile}
                            </td>
                            <td
                              className="text-start"
                              style={{
                                ...eighthColWidth,
                                color: fontcolor,
                                wordBreak: "break-word",
                              }}
                            >
                              {item.Email}
                            </td>

                            <td
                              className="text-center"
                              style={{
                                ...ninthColWidth,
                                color: fontcolor,
                                wordBreak: "break-word",
                              }}
                            >
                              <Link to={`/MenuUser/${item.tusrid}`}>
                                <i
                                  className="fa fa-list fa-xl"
                                  style={{ color: fontcolor }}
                                ></i>
                              </Link>
                            </td>
                          </tr>
                        );
                      })}
                      {Array.from({ length: Math.max(0, 20 - 3) }).map(
                        (_, rowIndex) => (
                          <tr
                            key={`blank-${rowIndex}`}
                            style={{
                              backgroundColor: getcolor,
                              color: fontcolor,
                            }}
                          >
                            {Array.from({ length: 7 }).map((_, colIndex) => (
                              <td key={`blank-${rowIndex}-${colIndex}`}>
                                &nbsp;
                              </td>
                            ))}
                          </tr>
                        )
                      )}
                    </>
                  )}
                </tbody>
              </table>
            </div>
          </div>
          <div
            style={{
              margin: "5px",
              marginBottom: "2px",
            }}
          >
            <SingleButton
              to="/MainPage"
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
    </>
  );
}
