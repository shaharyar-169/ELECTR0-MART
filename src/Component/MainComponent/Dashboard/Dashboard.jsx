import React, { useEffect, useState } from "react";
import './Dashboard.css'
import "react-datepicker/dist/react-datepicker.css";
import axios from "axios";
import Dounut from "./Chart/DountChart";
import BarChart from "./Chart/Barchart";
import { getOrganisationData, getUserData } from "../../Auth";
import { useTheme } from "../../../ThemeContext";
export default function Dasboard() {

  const [saleData, setsaleData] = useState([])
  const [purchaseData, setpurchaseData] = useState([])

  console.log('purchaseData data', purchaseData)
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

    const apiUrl = apiLinks + "/DashboardSale.php";
    const formData = new URLSearchParams({
      // code: organisation.code,
      code: 'NASIRTRD',
      FLocCod: LocationNumner,
      FYerDsc:'2024-2024'
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
       FYerDsc:'2024-2024'
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


  const contentStyle = {
    backgroundColor: getcolor,
    width: isSidebarVisible ? "calc(80vw - 0%)" : "80vw",
    position: "relative",
    top: "44%",
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

  return (
    <>

      <div className="Countair_styling" style={contentStyle} >
        {/* CARD ROW */}
        <div className="row Row_styling" >
          <div className="Card_styling">
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
          <div className="Card_styling">
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
          <div className="Card_styling"></div>
          <div className="Card_styling"></div>

        </div>
        {/* GRAPH/CHART ROW */}
        <div className="row Row_styling" style={{ marginTop: '10px' }}>
          <div className="second_container_card">
            <div className="row innercontainer" style={{ display: 'flex', justifyContent: 'space-between' }}>
              <div className="dunut_chart">
                <Dounut title='Category-wise Premiun' />
              </div>
              <div className="dunut_chart">
                <Dounut title='Dept-wise Premiun' />
              </div>
              <div className="dunut_chart">
                <Dounut title='Category-wise Claim' />
              </div>
            </div>

          </div>
          <div className="second_container_card" style={{ display: 'flex', justifyContent: 'space-between', background: 'white' }}>
            <BarChart />
          </div>
        </div>
        {/* Table ROW */}
        <div className="row Row_styling">
          <div className="second_container_card" style={{ display: 'flex', justifyContent: 'space-between', padding: '0px' }}>
            <div className="table_container">
              <span className="table_heading">Top 5 Branches</span>

              {/* <div
                            style={{
                                overflowY: "auto",
                                width: "98.8%",
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
                                            color:'white',
                                        }}
                                    >
                                        <td
                                            className="border-dark"
                                            style={firstColWidth}
                                            onClick={() => handleSorting("Code")}
                                        >
                                            Code{" "}
                                            <i className="fa-solid fa-caret-down caretIconStyle"></i>
                                        </td>
                                        <td
                                            className="border-dark"
                                            style={secondColWidth}
                                            onClick={() => handleSorting("Description")}
                                        >
                                            Description{" "}
                                            <i className="fa-solid fa-caret-down caretIconStyle"></i>
                                        </td>
                                        <td
                                            className="border-dark"
                                            style={thirdColWidth}
                                            onClick={() => handleSorting("Status")}
                                        >
                                            Status{" "}
                                            <i className="fa-solid fa-caret-down caretIconStyle"></i>
                                        </td>
                                        <td
                                            className="border-dark"
                                            style={forthColWidth}
                                            onClick={() => handleSorting("Ins ID")}
                                        >
                                            Ins ID{" "}
                                            <i className="fa-solid fa-caret-down caretIconStyle"></i>
                                        </td>
                                        <td
                                            className="border-dark"
                                            style={fifthColWidth}
                                            onClick={() => handleSorting("Ins Date")}
                                        >
                                            Ins Date{" "}
                                            <i className="fa-solid fa-caret-down caretIconStyle"></i>
                                        </td>
                                        <td
                                            className="border-dark"
                                            style={sixthColWidth}
                                            onClick={() => handleSorting("Upd ID")}
                                        >
                                            Upd ID{" "}
                                            <i className="fa-solid fa-caret-down caretIconStyle"></i>
                                        </td>
                                        <td
                                            className="border-dark"
                                            style={seventhColWidth}
                                            onClick={() => handleSorting("Upd Date")}
                                        >
                                            Upd Date{" "}
                                            <i className="fa-solid fa-caret-down caretIconStyle"></i>
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
                                                <td colSpan="2" className="text-center">
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
                                                        {Array.from({ length: 2 }).map((_, colIndex) => (
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
                                              
                                            </tr>
                                        </>
                                    ) : (
                                        <>
                                            {tableData.map((item, i) => {
                                                totalEnteries += 1;
                                                return (
                                                    <tr
                                                        key={`${i}-${selectedIndex}`}
                                                        ref={(el) => (rowRefs.current[i] = el)}
                                                        onClick={() => handleRowClick(i)}
                                                        className={
                                                            selectedIndex === i ? "selected-background" : ""
                                                        }
                                                        style={{
                                                            backgroundColor: getcolor,
                                                            color: fontcolor,
                                                        }}
                                                    >
                                                        <td className="text-start" style={firstColWidth}>
                                                            {item.Code}
                                                        </td>
                                                        <td className="text-start" style={secondColWidth}>
                                                            {item.Description}
                                                        </td>
                                                                                                               
                                                    </tr>
                                                );
                                            })}
                                            {Array.from({
                                                length: Math.max(0, 27 - tableData.length),
                                            }).map((_, rowIndex) => (
                                                <tr
                                                    key={`blank-${rowIndex}`}
                                                    style={{
                                                        backgroundColor: getcolor,
                                                        color: fontcolor,
                                                    }}
                                                >
                                                    {Array.from({ length: 2 }).map((_, colIndex) => (
                                                        <td key={`blank-${rowIndex}-${colIndex}`}>
                                                            &nbsp;
                                                        </td>
                                                    ))}
                                                </tr>
                                            ))}
                                            <tr>
                                                <td style={firstColWidth}></td>
                                                <td style={secondColWidth}></td>
                                                
                                            </tr>
                                        </>
                                    )}
                                </tbody>
                            </table>
                        </div> */}

            </div>
            <div className="table_container">
              <span className="table_heading">Top 5 Branches</span>

            </div>

          </div>
          <div className="second_container_card">second container</div>
        </div>
      </div>
    </>
  );
}
