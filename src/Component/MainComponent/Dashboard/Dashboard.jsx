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
export default function Dasboard() {

  const [saleData, setsaleData] = useState([])
  const [purchaseData, setpurchaseData] = useState([])
  const [isLoading, setIsLoading] = useState(false);

  const [CompanySaleComparison, setCompanySaleComparison] = useState([])

  const [DailyDashboard, setDailyDashboard] = useState([])


  const [selectedfromDate, setSelectedfromDate] = useState(null);
  const [fromCalendarOpen, setfromCalendarOpen] = useState(false);
  const [fromInputDate, setfromInputDate] = useState("11-11-2024");


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


  const organisation = getOrganisationData();
  const user = getUserData();
  const LocationNumner = user.tempcod

  const {
    isSidebarVisible,
    toggleSidebar,
    getcolor,
    fontcolor,
    toggleChangeColor,
    getLocationNumber,
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

  return (
    <>

      <div className="row Countair_styling" style={contentStyle} >
        {/* FIRST LEFT COLUMN */}
        <div style={{ height: "100%", width: "22%", padding: '0px' }}>
          <div className="Card_styling">
            <div className="Card_Heading_div">
              <span className="Span_Heading">
               {fromInputDate}

                <DatePicker
                  selected={selectedfromDate}
                  onChange={handlefromDateChange}
                  dateFormat="dd-MM-yyyy"
                  popperPlacement="bottom"
                  showPopperArrow={false}
                  open={fromCalendarOpen}
                  dropdownMode="select"
                  customInput={
                    <div>
                      <BsCalendar
                        onClick={toggleFromCalendar}
                        style={{
                          cursor:'pointer',                           
                          marginLeft: "18px",
                          fontSize: "14px",
                          color: 'red',
                          marginBottom:'5px'
                        }}
                      />
                    </div>
                  }
                />
              </span>
            </div>

            {Object.entries(DailyDashboard).map(([key, value], index) => (
              <div key={index} className="row" style={{ width: '100%' }}>
                <div className="col-md-6 text-start" style={{ color: 'grey', paddingLeft: '25px' }}>
                  {key}
                </div>
                <div className="col-md-6 text-end" style={{ color: 'black' }}>
                  {value}
                </div>
              </div>
            ))}

          </div>




        </div>
        {/* SECOND RIGHT COLUMN */}
        <div style={{ height: '100%', width: '78%', padding: '0px' }}>
          {/* FIRST ROW */}
          <div className="row Row_styling" >
            <div className="Card_styling_new">
              <span className="card_heading">Purchase</span>
              <div className="row" style={{ width: '100%' }}>
                <div className="col-md-6 text-start " style={{ color: 'grey', paddingLeft: '25px' }}>Stock</div>
                <div className="col-md-6 text-end " style={{ color: 'black', }} >{purchasetoday}</div>
              </div>
              <div className="row" style={{ width: '100%' }}>
                <div className="col-md-6 text-start " style={{ color: 'grey', paddingLeft: '25px' }}>Receivable</div>
                <div className="col-md-6 text-end " style={{ color: 'black', }} >{purchasemonth}</div>
              </div>
              <div className="row" style={{ width: '100%' }}>
                <div className="col-md-6 text-start" style={{ color: 'grey', paddingLeft: '25px' }}>Payable</div>
                <div className="col-md-6 text-end " style={{ color: 'black', }} >{purchaseyear}</div>
              </div>
            </div>


            <div className="Card_styling_new">
              <span className="card_heading">Sales</span>
              <div className="row" style={{ width: '100%' }}>
                <div className="col-md-6 text-start " style={{ color: 'grey', paddingLeft: '25px' }}>Today</div>
                <div className="col-md-6 text-end " style={{ color: 'black' }} >{saletoday}</div>
              </div>
              <div className="row" style={{ width: '100%' }}>
                <div className="col-md-6 text-start " style={{ color: 'grey', paddingLeft: '25px' }}>This Month</div>
                <div className="col-md-6 text-end " style={{ color: 'black', }} >{salemonth}</div>
              </div>
              <div className="row" style={{ width: '100%' }}>
                <div className="col-md-6 text-start" style={{ color: 'grey', paddingLeft: '25px' }}>This Year</div>
                <div className="col-md-6 text-end " style={{ color: 'black', }} >{saleyear}</div>
              </div>
            </div>

            <div className="Card_styling_new"> </div>
          </div>

          {/* SECOND GRAPH/CHART ROW */}
          <div className="row Row_styling" style={{ marginTop: '10px' }}>

            <div className="second_container_card1">
              <div className="row " style={{ display: 'flex', justifyContent: 'space-between' }}>
                <div className="dunut_chart">
                  <Dounut title='Category-wise Claim' />
                </div>
              </div>

            </div>

            <div className="second_container_card2" style={{ display: 'flex', justifyContent: 'space-between', background: 'white' }}>
              <BarChart />
            </div>
          </div>

          {/* THIRD TABLE ROW */}
          <div className="row Row_styling">

            <div className="second_container_card" style={{ display: 'flex', justifyContent: 'space-around', padding: '0px' }}>


              {/* FIRST TABLE  */}
              <div className="table_container" style={{ display: 'flex', flexDirection: 'column', border: '1px solid white' }}>

                <div
                  style={{
                    // overflowY: "auto",
                    width: "95.8%",

                  }}
                >
                  <table
                    className="myTable"
                    id="table"
                    style={{
                      fontSize: "12px",
                      width: "100%",
                      position: "relative",
                      paddingRight: "2%",
                    }}
                  >
                    <thead
                      style={{
                        fontWeight: "bold",
                        height: "24px",
                        position: "sticky",
                        top: 0,
                        boxShadow: "0 2px 4px rgba(0, 0, 0, 0.2)",
                        backgroundColor: tableHeadColor,
                      }}
                    >
                      <tr
                        style={{
                          backgroundColor: tableHeadColor,
                          color: 'white',
                        }}
                      >
                        <td
                          className="border-dark"
                          style={firstColWidth}
                        >
                          Company
                        </td>
                        <td
                          className="border-dark"
                          style={secondColWidth}
                        >
                          Qnty
                        </td>
                        <td
                          className="border-dark"
                          style={thirdColWidth}
                        >
                          Amount
                        </td>
                        <td
                          className="border-dark"
                          style={forthColWidth}
                        >
                          Margin
                        </td>

                      </tr>

                    </thead>
                  </table>
                </div>
                <div
                  className="table-scroll"
                  style={{
                    backgroundColor: textColor,
                    borderBottom: `1px solid ${fontcolor}`,
                    overflowY: "auto",
                    maxHeight: "100%",
                    width: "100%",
                    wordBreak: "break-word",
                  }}
                >
                  <table
                    className="myTable"
                    id="tableBody"
                    style={{
                      fontSize: "12px",
                      width: "100%",
                      position: "relative",
                    }}
                  >
                    <tbody id="tablebody">
                      {isLoading ? (
                        <>
                          <tr
                            style={{
                              backgroundColor: getcolor,
                            }}
                          >
                            <td colSpan="4" className="text-center">
                              <Spinner animation="border" variant="primary" />
                            </td>
                          </tr>
                          {Array.from({ length: Math.max(0, 30 - 5) }).map(
                            (_, rowIndex) => (
                              <tr
                                key={`blank-${rowIndex}`}
                                style={{
                                  backgroundColor: getcolor,
                                  color: fontcolor,
                                }}
                              >
                                {Array.from({ length: 4 }).map((_, colIndex) => (
                                  <td key={`blank-${rowIndex}-${colIndex}`}>
                                    &nbsp;
                                  </td>
                                ))}
                              </tr>
                            )
                          )}
                          <tr>
                            <td style={firstColWidth}></td>
                            <td style={secondColWidth}></td>
                            <td style={thirdColWidth}></td>
                            <td style={forthColWidth}></td>


                          </tr>
                        </>
                      ) : (
                        <>
                          {CompanySaleComparison.map((item, i) => {
                            // totalEnteries += 1;
                            return (
                              <tr
                                // key={`${i}-${selectedIndex}`}
                                // ref={(el) => (rowRefs.current[i] = el)}
                                // onClick={() => handleRowClick(i)}
                                // className={
                                //   selectedIndex === i ? "selected-background" : ""
                                // }
                                style={{
                                  backgroundColor: getcolor,
                                  color: fontcolor,
                                }}
                              >
                                <td className="text-start" style={firstColWidth}>
                                  {item.Company}
                                </td>
                                <td className="text-center" style={secondColWidth}>
                                  {item.Qnty}
                                </td>
                                <td className="text-end" style={thirdColWidth}>
                                  {item.Amount}
                                </td>
                                <td className="text-end" style={forthColWidth}>
                                  {item.Margin}
                                </td>


                              </tr>
                            );
                          })}
                          {Array.from({
                            length: Math.max(0, 27 - CompanySaleComparison.length),
                          }).map((_, rowIndex) => (
                            <tr
                              key={`blank-${rowIndex}`}
                              style={{
                                backgroundColor: getcolor,
                                color: fontcolor,
                              }}
                            >
                              {Array.from({ length: 4 }).map((_, colIndex) => (
                                <td key={`blank-${rowIndex}-${colIndex}`}>
                                  &nbsp;
                                </td>
                              ))}
                            </tr>
                          ))}
                          <tr>
                            <td style={firstColWidth}></td>
                            <td style={secondColWidth}></td>
                            <td style={thirdColWidth}></td>
                            <td style={forthColWidth}></td>

                          </tr>
                        </>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
              {/* SECOND TABLE  */}
              <div className="table_container" style={{ display: 'flex', flexDirection: 'column', border: '1px solid white' }}>

                <div
                  style={{
                    // overflowY: "auto",
                    width: "95.8%",

                  }}
                >
                  <table
                    className="myTable"
                    id="table"
                    style={{
                      fontSize: "12px",
                      width: "100%",
                      position: "relative",
                      paddingRight: "2%",
                    }}
                  >
                    <thead
                      style={{
                        fontWeight: "bold",
                        height: "24px",
                        position: "sticky",
                        top: 0,
                        boxShadow: "0 2px 4px rgba(0, 0, 0, 0.2)",
                        backgroundColor: tableHeadColor,
                      }}
                    >
                      <tr
                        style={{
                          backgroundColor: tableHeadColor,
                          color: 'white',
                        }}
                      >
                        <td
                          className="border-dark"
                          style={firstColWidth}
                        >
                          Company
                        </td>
                        <td
                          className="border-dark"
                          style={secondColWidth}
                        >
                          Qnty
                        </td>
                        <td
                          className="border-dark"
                          style={thirdColWidth}
                        >
                          Amount
                        </td>
                        <td
                          className="border-dark"
                          style={forthColWidth}
                        >
                          Margin
                        </td>

                      </tr>

                    </thead>
                  </table>
                </div>
                <div
                  className="table-scroll"
                  style={{
                    backgroundColor: textColor,
                    borderBottom: `1px solid ${fontcolor}`,
                    overflowY: "auto",
                    maxHeight: "100%",
                    width: "100%",
                    wordBreak: "break-word",
                  }}
                >
                  <table
                    className="myTable"
                    id="tableBody"
                    style={{
                      fontSize: "12px",
                      width: "100%",
                      position: "relative",
                    }}
                  >
                    <tbody id="tablebody">
                      {isLoading ? (
                        <>
                          <tr
                            style={{
                              backgroundColor: getcolor,
                            }}
                          >
                            <td colSpan="4" className="text-center">
                              <Spinner animation="border" variant="primary" />
                            </td>
                          </tr>
                          {Array.from({ length: Math.max(0, 30 - 5) }).map(
                            (_, rowIndex) => (
                              <tr
                                key={`blank-${rowIndex}`}
                                style={{
                                  backgroundColor: getcolor,
                                  color: fontcolor,
                                }}
                              >
                                {Array.from({ length: 4 }).map((_, colIndex) => (
                                  <td key={`blank-${rowIndex}-${colIndex}`}>
                                    &nbsp;
                                  </td>
                                ))}
                              </tr>
                            )
                          )}
                          <tr>
                            <td style={firstColWidth}></td>
                            <td style={secondColWidth}></td>
                            <td style={thirdColWidth}></td>
                            <td style={forthColWidth}></td>


                          </tr>
                        </>
                      ) : (
                        <>
                          {CompanySaleComparison.map((item, i) => {
                            // totalEnteries += 1;
                            return (
                              <tr
                                // key={`${i}-${selectedIndex}`}
                                // ref={(el) => (rowRefs.current[i] = el)}
                                // onClick={() => handleRowClick(i)}
                                // className={
                                //   selectedIndex === i ? "selected-background" : ""
                                // }
                                style={{
                                  backgroundColor: getcolor,
                                  color: fontcolor,
                                }}
                              >
                                <td className="text-start" style={firstColWidth}>
                                  {item.Company}
                                </td>
                                <td className="text-center" style={secondColWidth}>
                                  {item.Qnty}
                                </td>
                                <td className="text-end" style={thirdColWidth}>
                                  {item.Amount}
                                </td>
                                <td className="text-end" style={forthColWidth}>
                                  {item.Margin}
                                </td>


                              </tr>
                            );
                          })}
                          {Array.from({
                            length: Math.max(0, 27 - CompanySaleComparison.length),
                          }).map((_, rowIndex) => (
                            <tr
                              key={`blank-${rowIndex}`}
                              style={{
                                backgroundColor: getcolor,
                                color: fontcolor,
                              }}
                            >
                              {Array.from({ length: 4 }).map((_, colIndex) => (
                                <td key={`blank-${rowIndex}-${colIndex}`}>
                                  &nbsp;
                                </td>
                              ))}
                            </tr>
                          ))}
                          <tr>
                            <td style={firstColWidth}></td>
                            <td style={secondColWidth}></td>
                            <td style={thirdColWidth}></td>
                            <td style={forthColWidth}></td>

                          </tr>
                        </>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
              {/* THIRD TABLE  */}
              <div className="table_container" style={{ display: 'flex', flexDirection: 'column', border: '1px solid white' }}>

                <div
                  style={{
                    // overflowY: "auto",
                    width: "95.8%",

                  }}
                >
                  <table
                    className="myTable"
                    id="table"
                    style={{
                      fontSize: "12px",
                      width: "100%",
                      position: "relative",
                      paddingRight: "2%",
                    }}
                  >
                    <thead
                      style={{
                        fontWeight: "bold",
                        height: "24px",
                        position: "sticky",
                        top: 0,
                        boxShadow: "0 2px 4px rgba(0, 0, 0, 0.2)",
                        backgroundColor: tableHeadColor,
                      }}
                    >
                      <tr
                        style={{
                          backgroundColor: tableHeadColor,
                          color: 'white',
                        }}
                      >
                        <td
                          className="border-dark"
                          style={firstColWidth}
                        >
                          Company
                        </td>
                        <td
                          className="border-dark"
                          style={secondColWidth}
                        >
                          Qnty
                        </td>
                        <td
                          className="border-dark"
                          style={thirdColWidth}
                        >
                          Amount
                        </td>
                        <td
                          className="border-dark"
                          style={forthColWidth}
                        >
                          Margin
                        </td>

                      </tr>

                    </thead>
                  </table>
                </div>
                <div
                  className="table-scroll"
                  style={{
                    backgroundColor: textColor,
                    borderBottom: `1px solid ${fontcolor}`,
                    overflowY: "auto",
                    maxHeight: "100%",
                    width: "100%",
                    wordBreak: "break-word",
                  }}
                >
                  <table
                    className="myTable"
                    id="tableBody"
                    style={{
                      fontSize: "12px",
                      width: "100%",
                      position: "relative",
                    }}
                  >
                    <tbody id="tablebody">
                      {isLoading ? (
                        <>
                          <tr
                            style={{
                              backgroundColor: getcolor,
                            }}
                          >
                            <td colSpan="4" className="text-center">
                              <Spinner animation="border" variant="primary" />
                            </td>
                          </tr>
                          {Array.from({ length: Math.max(0, 30 - 5) }).map(
                            (_, rowIndex) => (
                              <tr
                                key={`blank-${rowIndex}`}
                                style={{
                                  backgroundColor: getcolor,
                                  color: fontcolor,
                                }}
                              >
                                {Array.from({ length: 4 }).map((_, colIndex) => (
                                  <td key={`blank-${rowIndex}-${colIndex}`}>
                                    &nbsp;
                                  </td>
                                ))}
                              </tr>
                            )
                          )}
                          <tr>
                            <td style={firstColWidth}></td>
                            <td style={secondColWidth}></td>
                            <td style={thirdColWidth}></td>
                            <td style={forthColWidth}></td>


                          </tr>
                        </>
                      ) : (
                        <>
                          {CompanySaleComparison.map((item, i) => {
                            // totalEnteries += 1;
                            return (
                              <tr
                                // key={`${i}-${selectedIndex}`}
                                // ref={(el) => (rowRefs.current[i] = el)}
                                // onClick={() => handleRowClick(i)}
                                // className={
                                //   selectedIndex === i ? "selected-background" : ""
                                // }
                                style={{
                                  backgroundColor: getcolor,
                                  color: fontcolor,
                                }}
                              >
                                <td className="text-start" style={firstColWidth}>
                                  {item.Company}
                                </td>
                                <td className="text-center" style={secondColWidth}>
                                  {item.Qnty}
                                </td>
                                <td className="text-end" style={thirdColWidth}>
                                  {item.Amount}
                                </td>
                                <td className="text-end" style={forthColWidth}>
                                  {item.Margin}
                                </td>


                              </tr>
                            );
                          })}
                          {Array.from({
                            length: Math.max(0, 27 - CompanySaleComparison.length),
                          }).map((_, rowIndex) => (
                            <tr
                              key={`blank-${rowIndex}`}
                              style={{
                                backgroundColor: getcolor,
                                color: fontcolor,
                              }}
                            >
                              {Array.from({ length: 4 }).map((_, colIndex) => (
                                <td key={`blank-${rowIndex}-${colIndex}`}>
                                  &nbsp;
                                </td>
                              ))}
                            </tr>
                          ))}
                          <tr>
                            <td style={firstColWidth}></td>
                            <td style={secondColWidth}></td>
                            <td style={thirdColWidth}></td>
                            <td style={forthColWidth}></td>

                          </tr>
                        </>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>

            </div>

          </div>

        </div>
      </div>

    </>
  );
}
