import { Form } from "react-bootstrap";
import Alert from "@mui/material/Alert";
import Header from "../../MainComponent/Header/Header";
import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import "./Capacity_Maintenance.css";
import Footer from "../../MainComponent/Footer/Footer";
import { Modal } from "react-bootstrap";
import { fetchData } from "../../react_query/React_Query_Function";
import Capacity_Maintenance_Modal from "./Capacity_Maintenance_Modal";
import NavComponent from "../../MainComponent/Navform/navbarform";
import ButtonGroupp from "../../MainComponent/Button/ButtonGroup/ButtonGroup";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { fetchNewCompanyData, fetchCompany } from "./Capacity_Maintenance_Api";
import StatusSelect from "../../MainComponent/StatusSelected/StatusSelected";

function Capacity_Maintenance() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const [formData, setFormData] = useState({
    AccountCodeform: "",
    Descriptionform: "",
    Status: "",
    // inputform4: "",
    // inputform5: "",
    // inputform6: "",
    // inputform7: "",
    // inputform8: "",
    // inputform9: "",
    // inputform10: "",
    // inputform11: "",
    // inputform12: "",
  });
  const {
    data: newCompany,
    error: newCompanyError,
    isLoading: isLoadingNewCompany,
  } = useQuery({
    queryKey: ["newCompany"],
    queryFn: fetchNewCompanyData,
  });

  const {
    data: company,
    error: CompanyError,
    isLoading: isLoadingCompany,
    refetch,
  } = useQuery({
    queryKey: ["company"],
    queryFn: fetchCompany,
  });

  useEffect(() => {
    console.log("sdfsdfsdfsdfsdfsdf");

    console.log(company);
    if (newCompany) {
      setFormData((prevState) => ({
        ...prevState,
        AccountCodeform: newCompany,
      }));
    }
    if (Code.current) {
      Code.current.focus();
    }
  }, [newCompany]);
  const handleButtonClick = () => {
    queryClient.invalidateQueries(["technicians"]);
  };
  const [selectedStatus2, setSelectedStatus2] = useState("Yes");
  const [selectedStatus3, setSelectedStatus3] = useState("Yes");

  const [alertData, setAlertData] = useState(null);
  const fontFamily = "verdana";
  const apiLinks =
    "https://crystalsolutions.com.pk/complaint/GetTechnician.php";

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
  const [accountdropdown, setAccountdropdown] = useState([]);

  //////////////////////// PRESS ENTER TO MOVE THE NEXT FIELD //////////////////

  const focusNextInput = (ref) => {
    if (ref.current) {
      ref.current.focus();
    }
  };

  const newcode = async () => {
    try {
      const response = await fetch(
        `https://crystalsolutions.com.pk/umair_electronic/web/NewCompany.php`
      );
      if (!response.ok) {
        throw new Error("Failed to fetch data");
      }
      const jsonData = await response.json();

      setFormData((prevState) => ({
        ...prevState,
        AccountCodeform: jsonData, // Adjust based on actual data structure
      }));
      setTimeout(() => {
        Code.current.focus();
      }, 500);
    } catch (error) {
      console.error(error);
    }
  };

  const [errors, setErrors] = useState({});
  const handleRefetch = () => {
    console.log("Refetching data...");
    refetch();
  };
  const handleFormSubmit = async (e) => {
    e.preventDefault();

    const checks = [
      {
        value: formData?.Descriptionform,
        message: "Please fill your description",
      },
    ];

    for (const check of checks) {
      if (!check.value) {
        setAlertData({
          type: "error",
          message: check.message,
        });
        setTimeout(() => {
          setAlertData(null);
        }, 3000);
        return;
      }
    }

    try {
      const formDataa = new FormData();
      formDataa.append("FCapCod", formData.AccountCodeform);
      formDataa.append("FCapDsc", formData.Descriptionform);
      formDataa.append("FCapSts", formData.Status);
      // formDataa.append("FAdd001", formData.inputform4);
      // formDataa.append("FAdd002", formData.inputform5);
      // formDataa.append("FPhnNum", formData.inputform6);
      // formDataa.append("FMobNum", formData.inputform7);
      // formDataa.append("FEmlAdd", formData.inputform8);
      formDataa.append("FUsrId", 74);

      console.log("Submitting Form Data:", formDataa);

      const response = await axios.post(
        `https://crystalsolutions.com.pk/umair_electronic/web/SaveCapacity.php`,
        formDataa,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      console.log("API Response:", response);

      if (response.data.error === 200) {
        newcode();
        Code.current.focus();
        setTimeout(() => {
          Code.current.select();
        }, 1000);
        handleRefetch();
        setFormData({
          ...formData,
          Descriptionform: "",
          Status: "",
          // inputform4: "",
          // inputform5: "",
          // inputform6: "",
          // inputform7: "",
          // inputform8: "",
          // inputform9: "",
          // inputform10: "",
          // inputform11: "",
          // inputform12: "",
        });

        setAlertData({
          type: "success",
          message: `${response.data.message}`,
        });
        setTimeout(() => {
          setAlertData(null);
        }, 1000);
      } else {
        setAlertData({
          type: "error",
          message: `${response.data.message}`,
        });
        setTimeout(() => {
          setAlertData(null);
        }, 2000);
      }
    } catch (error) {
      console.error("Error submitting form:", error);
    } finally {
      console.log("Form submission process completed.");
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
  const [textdata, settextdata] = useState(" Capacity Maintenance");

  const handleCloseModal = () => {
    setData({ columns: [], rows: [] });
    setSearchText("");
    setHighlightedRowIndex(0);
    settextdata("Update Capacity Maintenance");

    setModalOpen(false);
  };

  const handleDoubleClick = (e) => {
    focusNextInput(Code);
    console.log("====== handle double click=======");
    // setSearchText(e.target.value);
    setModalOpen(true);
  };

  // const { dataa, error, isLoading } = useQuery("chartOfAccounts", fetchData);

  const fetchDataAndDisplay = async () => {
    const columns = [
      { label: "Code", field: "tacccod", sort: "asc" },
      { label: "Description", field: "taccdsc", sort: "asc" },
      { label: "Status", field: "taccsts", sort: "asc" },
    ];
    setData({ columns, rows: company });
  };
  const [dataa, setDataa] = useState({ columns: [], rows: [] });
  const fetchDataAndDisplayy = async () => {
    const columns = [
      { label: "Code", field: "tacccod", sort: "asc" },
      { label: "Description", field: "taccdsc", sort: "asc" },
      { label: "Status", field: "taccsts", sort: "asc" },
    ];
    if (Array.isArray(company)) {
      setDataa({ columns, rows: company });
    } else {
      console.warn(
        "Technicians data is not available or not in the correct format."
      );
    }
  };
  useEffect(() => {
    fetchDataAndDisplayy();
  }, [fetchDataAndDisplayy]);
  function formatToThreeDigits(number) {
    // Convert the number to a string and pad with leading zeros if necessary
    return number.toString().padStart(3, "0");
  }
  const handleBlurRVC = (e) => {
    // Convert nextItemId to string before calling padStart
    const value = String(formData.AccountCodeform).padStart(3, "0");
    setFormData({
      ...formData,
      AccountCodeform: value,
    });
    console.log("value", value);
    setTimeout(() => {
      const selectedItem = dataa.rows.find((item) => item.tcapcod === value);

      console.log("Selected item:", selectedItem);

      if (selectedItem) {
        setFormData({
          ...formData,
          AccountCodeform: selectedItem.tcapcod,
          Descriptionform: selectedItem.tcapdsc,
          Status: selectedItem.tcapsts,
          // inputform4: selectedItem.tadd001,
          // inputform5: selectedItem.tadd002,
          // inputform6: selectedItem.tphnnum,
          // inputform7: selectedItem.tmobnum,
          // inputform8: selectedItem.temladd,
        });
      } else {
        setFormData({
          ...formData,
          AccountCodeform: value,
          Descriptionform: "",
          // inputform4: "",
          // inputform5: "",
          // inputform6: "",
          // inputform7: "",
          // inputform8: "",
          //   inputform9: "",
          //   inputform10: "",
          //   inputform11: "",
          //   inputform12: "",
        });
      }
    }, 500);
  };
  const handleInputChangefetchdata = async (e) => {
    console.log("show the value is:", e.target.value);
    let inputValue = e.target.value;
    if (inputValue.length > 3) {
      return;
    }
    setFormData({
      ...formData,
      AccountCodeform: inputValue,
    });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    const formattedValue = value.toUpperCase(); // Trim and convert to uppercase

    if (name === "AccountCodeform") {
      console.log("Searching for:", formattedValue);

      const selectedItem = dataa.rows.find(
        (item) => item.tcapcod === formatToThreeDigits(formattedValue)
      );

      console.log("Selected item:", selectedItem);

      if (selectedItem) {
        setFormData({
          ...formData,
          AccountCodeform: selectedItem.tcapcod,
          Descriptionform: selectedItem.tcapdsc,
          Status: selectedItem.tcapsts,
          // inputform4: selectedItem.tadd001,
          // inputform5: selectedItem.tadd002,
          // inputform6: selectedItem.tphnnum,
          // inputform7: selectedItem.tmobnum,
          // inputform8: selectedItem.temladd,
        });
      } else {
        setFormData({
          ...formData,
          AccountCodeform: formattedValue,
          Descriptionform: "",
          // inputform4: "",
          // inputform5: "",
          // inputform6: "",
          // inputform7: "",
          // inputform8: "",
          //   inputform9: "",
          //   inputform10: "",
          //   inputform11: "",
          //   inputform12: "",
        });
      }
    } else {
      setFormData({
        ...formData,
        [name]: formattedValue,
      });
    }
  };

  const resetData = () => {
    setData({ columns: [], rows: [] });
    setSearchText("");
  };
  const [highlightedRowIndex, setHighlightedRowIndex] = useState(0);
  const firstRowRef = useRef(null);
  const handleRowClick = (selectedItem, rowIndex) => {
    console.log("handleRowClickAccount", selectedItem);
    setModalOpen(false);
    setFormData({
      ...formData,
      AccountCodeform: selectedItem.tcapcod,
      Descriptionform: selectedItem.tcapdsc,
      Status: selectedItem.tcapsts,
      // inputform4: selectedItem.tadd001,
      // inputform5: selectedItem.tadd002,
      // inputform6: selectedItem.tphnnum,
      // inputform7: selectedItem.tmobnum,
      // inputform8: selectedItem.temladd,
    });
    settextdata("Update Capacity Maintenance");

    resetData();
  };

  const tableRef = useRef(null);

  const firstColWidthModal = "150px";
  const secondColWidthModal = "500px";

  const filteredRows =
    data.rows &&
    data.rows.filter(
      (row) =>
        (row.tcapcod &&
          row.tcapcod.toLowerCase().includes(searchText.toLowerCase())) ||
        (row.tcapdsc &&
          row.tcapdsc.toLowerCase().includes(searchText.toLowerCase()))
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
    newcode();
    setFormData({
      ...formData,
      Descriptionform: "",
      SelectedStatus: "",
      // inputform4: "",
      // inputform5: "",
      // inputform6: "",
      // inputform7: "",
      // inputform8: "",
      // inputform9: "",
      // inputform10: "",
      // inputform11: "",
      // inputform12: "",
    });

    // Set focus to the input element with ref 'Code'
    if (Code.current) {
      Code.current.focus();
    }
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
        if
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
                <div className="row">
                  <div className="row">
                    <div className="col-sm-3 label-item">Code:</div>
                    <div className="col-sm-2">
                      <Form.Control
                        type="number"
                        className="form-control-account custom-input"
                        placeholder="Code"
                        name="AccountCodeform"
                        value={formData.AccountCodeform}
                        onChange={handleInputChangefetchdata}
                        style={{
                          fontSize: "15px",
                          padding: "10px",
                          textAlign: "center",
                          borderRadius: "8px",
                        }}
                        maxLength={3}
                        onKeyDown={(e) => {
                          if (e.key === "Enter") {
                            handleBlurRVC();
                            handleEnterKeyPress(Status, e);
                            const upperCaseValue = e.target.value.toUpperCase();

                            if (dataa.rows && dataa.rows.length > 0) {
                              const selectedItem = dataa.rows.find(
                                (item) => item.tcmpcod === upperCaseValue
                              );

                              if (selectedItem) {
                                console.log("selectedItem:", selectedItem);
                                handleEnterKeyPress(Status, e);
                              } else if (upperCaseValue.length < 3) {
                                // setAlertData({
                                //   type: "error",
                                //   message: "Fetch Data",
                                // });
                                // setTimeout(() => {
                                //   setAlertData(null);
                                // }, 3000);
                              } else {
                                handleEnterKeyPress(Status, e);
                              }
                            } else {
                              console.warn(
                                "Data rows are not available or empty."
                              );
                            }
                          }
                        }}
                        onFocus={(e) => {
                          setTimeout(() => {
                            e.target.select();
                          }, 500);
                        }}
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
                    <div className="col-sm-3"></div>

                    <div className="col-sm-2 label-item">Status:</div>
                    <div className="col-sm-2">
                      <Form.Group
                        controlId="status"
                        style={{ display: "flex", alignItems: "center" }}
                      >
                        <StatusSelect
                          formData={formData}
                          handleInputChange={handleInputChange}
                          errors={errors}
                          handleEnterKeyPress={(e) =>
                            handleEnterKeyPress(Description, e)
                          }
                          StatusRef={Status}
                        />
                        {/* <Form.Control
                          as="select"
                          name="Status"
                          value={formData.Status}
                          onChange={handleInputChange}
                          className={`form-control-item ${
                            errors.Status ? "border-red" : ""
                          }`}
                          // className="form-control-item custom-select"
                          style={{
                            height: "27px",
                            fontSize: "11px",
                            padding: "5px",
                          }}
                          onKeyDown={(e) => handleEnterKeyPress(Description, e)}
                          ref={Status}
                        >
                          <option value="A">Active</option>
                          <option value="N">Non Active</option>
                        </Form.Control> */}
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
                        className={`form-control-item ${
                          errors.Descriptionform ? "border-red" : ""
                        }`}
                        value={formData.Descriptionform}
                        ref={Description}
                        onFocus={(e) => e.target.select()}
                        onChange={handleInputChange}
                        onKeyDown={(e) => handleEnterKeyPress(Submit, e)}
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

              <Capacity_Maintenance_Modal
                isOpen={isModalOpen}
                handleClose={handleCloseModal}
                title="Select Capacity"
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
                firstColKey="tcapcod"
                secondColKey="tcapdsc"
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

export default Capacity_Maintenance;
