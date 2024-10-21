import { Form } from "react-bootstrap";
import Alert from "@mui/material/Alert";
import Header from "../../MainComponent/Header/Header";
import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import "./Complain_Type_Maitenance.css";
import Footer from "../../MainComponent/Footer/Footer";
import { Modal } from "react-bootstrap";
import { fetchData } from "../../react_query/React_Query_Function";
import Complain_Type_Maitenance_Modal from "./Complain_Type_Maitenance_Modal";
import NavComponent from "../../MainComponent/Navform/navbarform";
import ButtonGroupp from "../../MainComponent/Button/ButtonGroup/ButtonGroup";

function Complain_Type_Maitenance() {
  const navigate = useNavigate();
  const [selectedStatus, setSelectedStatus] = useState("Yes");
  const [selectedStatus2, setSelectedStatus2] = useState("Yes");
  const [selectedStatus3, setSelectedStatus3] = useState("Yes");

  const [alertData, setAlertData] = useState(null);
  const fontFamily = "verdana";
  const apiLinks = "https://crystalsolutions.com.pk/complaint/GetType.php";

  //////////////////////// PRESS ENTER TO  MOVE THE NEXT FIELD //////////////////

  const Code = useRef(null);
  const Description = useRef(null);
  const Status = useRef(null);
  const inputform4ref = useRef(null);
  const inputform5ref = useRef(null);
  const inputform6ref = useRef(null);
  const inputform7ref = useRef(null);
  const inputform8ref = useRef(null);
  const inputform9ref = useRef(null);
  const inputform10ref = useRef(null);
  const inputform11ref = useRef(null);
  const Submit = useRef(null);
  const Clear = useRef(null);
  const Return = useRef(null);
  const SearchBox = useRef(null);
  const [AccountCodeform, setAccountCodeform] = useState("");
  const [Descriptionform, setDescriptionform] = useState("");
  const [inputform3, setinputform3] = useState("");
  const [inputform4, setinputform4] = useState("");
  const [inputform5, setinputform5] = useState("");
  const [inputform6, setinputform6] = useState("");
  const [inputform7, setinputform7] = useState("");
  const [inputform8, setinputform8] = useState("");
  const [inputform9, setinputform9] = useState("");
  const [inputform10, setinputform10] = useState("");
  const [inputform11, setinputform11] = useState("");
  const [inputform12, setinputform12] = useState("");
  const [accountdropdown, setAccountdropdown] = useState([]);
  const [selectedCompanyId, setSelectedCompanyId] = useState("");
  console.log(selectedCompanyId);

  //////////////////////// PRESS ENTER TO MOVE THE NEXT FIELD //////////////////
  useEffect(() => {
    // Focus on the first input when the component mounts
    if (Code.current) {
      Code.current.focus();
    }
  }, []);
  const focusNextInput = (ref) => {
    if (ref.current) {
      ref.current.focus();
    }
  };
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(
          `https://crystalsolutions.com.pk/complaint/GetType.php`
        );
        if (!response.ok) {
          throw new Error("Failed to fetch data");
        }
        const jsonData = await response.json();
        const transformedData = jsonData.map((item) => ({
          typid: item.typid,
          typdsc: item.typdsc,
          typsts: item.typsts,
        }));
        setAccountdropdown(transformedData);
      } catch (error) {
        console.error(error);
      }
    };
    fetchData();
  }, []);

  const handleFormSubmit = async (e) => {
    e.preventDefault();

    const value = {
      TechStss: selectedStatus,
      Send_Emaill: selectedStatus2,
      Send_Smss: setSelectedStatus3,
      // TechStss:selectedStatus3,
    };

    try {
      const formData = new FormData();
      // formData.append("itmId", values.itemid);
      formData.append("Typdsc", Descriptionform);
      formData.append("TypSts", value.TechStss);

      // formData.append('FUsrId', UserId);
      const response = await axios
        .post(
          `https://crystalsolutions.com.pk/complaint/TypeMaintenance.php`,
          formData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
              // 'Content-Type': 'application/json;charset=UTF-8',
            },
          }
        )
        .then((response) => {
          if (response.data.error === 200) {
            console.log("response data show", response);

            setAlertData({
              type: "success",
              message: `${response.data.message}`,
            });
            setTimeout(() => {
              setAlertData(null);
            }, 1000);
          } else {
            console.log(response.data.message);
            console.log("response data show", response);

            setAlertData({
              type: "error",
              message: `${response.data.message}`,
            });
            setTimeout(() => {
              setAlertData(null);
            }, 2000);
          }
          // navigate("/Get_Technical");
        })
        .catch((error) => {
          // Handle errors
          console.error("Error:", error);
        });

      console.log(response.data);
      setSelectedStatus("Yes");
    } catch (error) {
      console.error("Error uploading image:", error);
    } finally {
    }
  };

  // Function to handle Enter key press
  const handleEnterKeyPress = (ref, e) => {
    if (e.key === "Enter") {
      e.preventDefault(); // Prevent form submission on Enter key press
      if (ref && ref.current) {
        ref.current.focus();
      }
    }
  };
  const [isModalOpen, setModalOpen] = useState(false);
  const [searchText, setSearchText] = useState("");
  const [data, setData] = useState({ columns: [], rows: [] });
  const [textdata, settextdata] = useState("Complaint Type Maitenance");

  const handleCloseModal = () => {
    setData({ columns: [], rows: [] });
    setSearchText("");
    setHighlightedRowIndex(0);
    settextdata("Update Complaint Type Maintenance");

    setModalOpen(false);
  };
  const firstColWidth = "120px";
  const secondColWidth = "480px";
  const thirdColWidth = "150px";
  const fourthColWidth = "70px";
  const [Length, setLength] = useState("");

  const handleDoubleClick = (e) => {
    focusNextInput(Code);
    console.log("====== handle double click=======");
    // setSearchText(e.target.value);
    setModalOpen(true);
  };

  // const { dataa, error, isLoading } = useQuery("chartOfAccounts", fetchData);

  const fetchDataAndDisplay = async () => {
    try {
      const transformedData = await fetchData(apiLinks);
      const columns = [
        { label: "Code", field: "tacccod", sort: "asc" },
        { label: "Description", field: "taccdsc", sort: "asc" },
        { label: "Status", field: "taccsts", sort: "asc" },
      ];
      setData({ columns, rows: transformedData });
      setLength(transformedData.length);
    } catch (error) {
      // setError(error);
    } finally {
      // setIsLoading(false);
    }
  };
  const [dataa, setDataa] = useState({ columns: [], rows: [] });
  const fetchDataAndDisplayy = async () => {
    try {
      const transformedData = await fetchData(apiLinks);
      const columns = [
        { label: "Code", field: "tacccod", sort: "asc" },
        { label: "Description", field: "taccdsc", sort: "asc" },
        { label: "Status", field: "taccsts", sort: "asc" },
      ];
      setDataa({ columns, rows: transformedData });
      // setLengthh(transformedData.length);
    } catch (error) {
      // setError(error);
    } finally {
      // setIsLoading(false);
    }
  };
  useEffect(() => {
    fetchDataAndDisplayy();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    let formattedValue = value.trim().toUpperCase(); // Trim and convert to uppercase

    if (name === "AccountCodeform") {
      formattedValue = formattedValue;
      console.log("Searching for:", formattedValue);

      const selectedItem = dataa.rows.find(
        (item) => item.typid === formattedValue
      );

      console.log("Selected item:", selectedItem);

      if (selectedItem) {
        setDescriptionform(selectedItem.typdsc);
        setAccountCodeform(selectedItem.typid);
        setSelectedStatus(selectedItem.typsts);
      } else {
        setDescriptionform("");
        setAccountCodeform(formattedValue);
        setSelectedStatus("");
      }
    } else if (name === "Descriptionform") {
      setDescriptionform(formattedValue);
    } else if (name === "inputform3") {
      setinputform3(formattedValue);
    } else if (name === "inputform4") {
      setinputform4(formattedValue);
    } else if (name === "inputform5") {
      setinputform5(formattedValue);
    } else if (name === "inputform6") {
      setinputform6(formattedValue);
    } else if (name === "inputform7") {
      setinputform7(formattedValue);
    } else if (name === "inputform8") {
      setinputform8(formattedValue);
    } else if (name === "inputform9") {
      setinputform9(formattedValue);
    } else if (name === "inputform10") {
      setinputform10(formattedValue);
    } else if (name === "inputform11") {
      setinputform11(formattedValue);
    } else {
      setDescriptionform("");
      setAccountCodeform("");
      setSelectedStatus("");
    }
  };
  const resetData = () => {
    setData({ columns: [], rows: [] });
    setSearchText("");
  };
  const [highlightedRowIndex, setHighlightedRowIndex] = useState(0);
  const firstRowRef = useRef(null);
  const handleRowClick = (rowData, rowIndex) => {
    console.log("handleRowClickAccount", rowData);
    setModalOpen(false);
    setSelectedStatus(rowData.typsts);
    setDescriptionform(rowData.typdsc);
    setAccountCodeform(rowData.typid);

    resetData();
  };
  const tableRef = useRef(null);

  const firstColWidthModal = "150px";
  const secondColWidthModal = "500px";

  const filteredRows =
    data.rows &&
    data.rows.filter(
      (row) =>
        (row.typid &&
          row.typid.toLowerCase().includes(searchText.toLowerCase())) ||
        (row.typdsc &&
          row.typdsc.toLowerCase().includes(searchText.toLowerCase()))
    );
  const handleFocus = (codeparam) => {
    if (codeparam.current) {
      codeparam.current.style.backgroundColor = "orange";
    }
  };
  const handleSearchChange = (event) => {
    const uppercase = event.target.value.toUpperCase();
    setHighlightedRowIndex(0);
    setSearchText(uppercase);
  };
  const handleSave = () => {
    handleFormSubmit();
  };
  const handleClear = () => {
    setAccountCodeform("");
    setDescriptionform("");

    setSelectedStatus("");
    Code.current.focus();
  };
  const handleReturn = () => {
    navigate("/MainPage");
  };

  const handleBlur = (codeparam) => {
    if (codeparam.current) {
      codeparam.current.style.backgroundColor = "#3368B5";
    }
  };

  const handleArrowKeyPress = (direction) => {
    if (filteredRows.length === 0) return;

    let newIndex = highlightedRowIndex;
    let upindex = highlightedRowIndex - 10;
    let bottomindex = highlightedRowIndex + 10;

    if (direction === "up") {
      const rowElement = document.getElementById(`row-${upindex}`);
      if (rowElement) {
        rowElement.scrollIntoView({ behavior: "smooth", block: "nearest" });
      }
      newIndex = Math.max(-1, highlightedRowIndex - 1);
    } else if (direction === "down") {
      const rowElement = document.getElementById(`row-${bottomindex}`);
      if (rowElement) {
        rowElement.scrollIntoView({ behavior: "smooth", block: "nearest" });
      }
      newIndex = Math.min(filteredRows.length - 1, highlightedRowIndex + 1);
    }

    setHighlightedRowIndex(newIndex);
  };

  const [enterCount, setEnterCount] = useState(0);

  return (
    <>
      <div
        style={{
          position: "relative",
          width: "100%",
          height: "100vh",
          overflow: "hidden",
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
              zIndex: 1000,
              textAlign: "center",
            }}
          >
            {alertData.message}
          </Alert>
        )}
        <Header />

        <div
          className="col-12"
          style={{
            backgroundColor: "white",

            color: "black",
            fontWeight: "bold",
            fontFamily: fontFamily,
          }}
        >
          <div
            className="row"
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              padding: "5px",
              // backgroundColor: "#f5f5f5",
              minHeight: "100vh",
            }}
          >
            <div className="col-md-12 form-item-container">
              <NavComponent textdata={textdata} />

              <br />
              <Form onSubmit={handleFormSubmit}>
                <div className="row ">
                  <div className="row">
                    <div className="col-sm-3 label-item">Code:</div>
                    <div className="col-sm-3">
                      <Form.Control
                        type="text"
                        className="form-control-account"
                        placeholder="Code"
                        name="AccountCodeform"
                        value={AccountCodeform}
                        onChange={(e) => handleInputChange(e)}
                        maxLength={6}
                        onKeyDown={(e) => {
                          if (e.key === "Enter") {
                            const upperCaseValue = e.target.value.toUpperCase();
                            const selectedItem = dataa.rows.find(
                              (item) => item.typid === upperCaseValue
                            );

                            if (selectedItem) {
                              console.log("selectedItem:", selectedItem);
                              handleEnterKeyPress(Status, e);
                            } else if (upperCaseValue.length < 2) {
                              // handleEnterKeyPress(Description, e);
                              setAlertData({
                                type: "error",
                                message: `Please enter a valid account code`,
                              });
                              setTimeout(() => {
                                setAlertData(null);
                              }, 3000);
                            } else {
                              handleEnterKeyPress(Status, e);
                            }
                          }
                        }}
                        onFocus={(e) => e.target.select()}
                        onDoubleClick={(e) => {
                          if (e.target.value.length <= 5) {
                            handleDoubleClick(e);
                            setTimeout(() => {
                              focusNextInput(SearchBox);
                            }, 100);
                          }
                        }}
                        ref={Code}
                      />
                    </div>
                    <div className="col-sm-2"></div>

                    <div className="col-sm-2 label-item">Status:</div>
                    <div className="col-sm-2">
                      <Form.Group
                        controlId="status"
                        style={{
                          display: "flex",
                          alignItems: "center",
                        }}
                      >
                        <Form.Control
                          as="select"
                          name="itemStss"
                          value={selectedStatus}
                          onChange={(e) => setSelectedStatus(e.target.value)}
                          className="form-control-item custom-select" // Add the custom CSS class 'custom-select'
                          style={{
                            height: "27px",
                            fontSize: "11px",
                          }}
                          onKeyDown={(e) => handleEnterKeyPress(Description, e)}
                          ref={Status}
                        >
                          <option value="A">Active</option>
                          <option value="N">Non Active</option>
                        </Form.Control>
                      </Form.Group>
                    </div>
                  </div>
                  <div className="row">
                    <div className="col-sm-3 label-item">Description:</div>
                    <div className="col-sm-9" style={{ display: "flex" }}>
                      <Form.Control
                        type="text"
                        id="Descriptionform"
                        placeholder="Description"
                        name="Descriptionform"
                        className="form-control-item"
                        value={Descriptionform}
                        ref={Description}
                        onFocus={(e) => e.target.select()}
                        onChange={handleInputChange}
                        onKeyDown={(e) => handleEnterKeyPress(inputform4ref, e)}
                      />
                    </div>
                  </div>

                  <br />
                  <br />
                </div>
                <br />
              </Form>

              {/* // three button in this  */}
              <ButtonGroupp
                Submit={Submit}
                handleFocus={handleFocus}
                handleBlur={handleBlur}
                handleSave={handleSave}
                handleReturn={handleReturn}
                handleClear={handleClear}
                handleFormSubmit={handleFormSubmit}
              />
              {/* // modal the open  */}

              <Complain_Type_Maitenance_Modal
                isOpen={isModalOpen}
                handleClose={handleCloseModal}
                title="Select Technician"
                searchText={searchText}
                handleSearchChange={handleSearchChange}
                searchRef={SearchBox}
                enterCount={enterCount}
                fetchDataAndDisplay={fetchDataAndDisplay}
                setEnterCount={setEnterCount}
                handleArrowKeyPress={handleArrowKeyPress}
                handleRowClick={handleRowClick}
                filteredRows={filteredRows}
                highlightedRowIndex={highlightedRowIndex}
                tableRef={tableRef}
                firstRowRef={firstRowRef}
                firstColWidth={firstColWidthModal}
                secondColWidth={secondColWidthModal}
                firstColKey="typid"
                secondColKey="typdsc"
              />
            </div>
          </div>
          <br />
        </div>
      </div>
      <Footer />
    </>
  );
}

export default Complain_Type_Maitenance;
