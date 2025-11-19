import { Form } from "react-bootstrap";
import Alert from "@mui/material/Alert";
import Header from "../../MainComponent/Header/Header";
import React, { useState, useEffect, useRef, useCallback } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import "./Mobile_Maintenance.css";
import Footer from "../../MainComponent/Footer/Footer";
import { Modal } from "react-bootstrap";
import Mobile_Maintenance_Modal from "./Mobile_Maintenance_Modal";
import NavComponent from "../../MainComponent/Navform/navbarform";
import ButtonGroupp from "../../MainComponent/Button/ButtonGroup/ButtonGroup";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { fetchMobile } from "./Mobile_Maintenance_Api";
import { components } from "react-select";
import Select from "react-select";
import CustomDropdown from "../../MainComponent/Dropdown/Dropdown";
function Mobile_Maintenance() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const [formData, setFormData] = useState({
    AccountCodeform: "03",
    Descriptionform: "",
    Status: "",
    inputform4: "",
    inputform5: "",
    inputform6: "",
    inputform7: "",
    inputform8: "",
    // inputform9: "",
    // inputform10: "",
    // inputform11: "",
    // inputform12: "",
  });

  const {
    data: mobile,
    error: MobileError,
    isLoading: isLoadingMobile,
    refetch,
  } = useQuery({
    queryKey: ["mobile"],
    queryFn: fetchMobile,
  });

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
  const [selectedOptionCity, setSelectedOptionCity] = useState("");

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

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(
          `https://crystalsolutions.com.pk/complaint/GetTechnician.php`
        );
        if (!response.ok) {
          throw new Error("Failed to fetch data");
        }
        const jsonData = await response.json();
        const transformedData = jsonData.map((item) => ({
          techid: item.techid,
          techdsc: item.techdsc,
          techcontact: item.techcontact,
          techphone: item.techphone,
          techmobile: item.techmobile,
          techemail: item.techemail,
          techstatus: item.techstatus,
        }));
        setAccountdropdown(transformedData);
      } catch (error) {
        console.error(error);
      }
    };
    fetchData();
  }, []);

  const [selectedComplaint, setSelectedComplaint] = useState(null);
  const handleComplaintChange = (selectedOption) => {
    setSelectedComplaint(selectedOption);
    console.log("Selected technician:", selectedOption);
  };
  const [errors, setErrors] = useState({});
  const handleRefetch = () => {
    console.log("Refetching data...");
    refetch();
  };
  const handleFormSubmit = async (e) => {
    e.preventDefault();

    // Validation
    const newErrors = {};
    for (const [key, value] of Object.entries(formData)) {
      if (!value) {
        newErrors[key] = "This field is required";
      }
    }
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      console.log("Validation Errors:", newErrors);
      return;
    }
    setErrors({});
    setTimeout(() => {
      setErrors({});
    }, 3000);
    //create a object of taht has the form data
    const object = {
      AccountCodeform: formData.AccountCodeform,
      Descriptionform: formData.Descriptionform,
      Status: formData.Status,
      inputform4: formData.inputform4,
      inputform5: formData.inputform5,
      inputform6: formData.inputform6,
      inputform7: formData.inputform7,
      inputform8: formData.inputform8,
      selectedComplaint: selectedComplaint.value,
      // inputform9: formData.inputform9,
      // inputform10: formData.inputform10,
      // inputform11: formData.inputform11,
      // inputform12: formData.inputform12,
    };
    console.log("object========", object);
    try {
      const formDataa = new FormData();
      formDataa.append("FMobNum", formData.AccountCodeform);
      formDataa.append("FCstNam", formData.Descriptionform);
      formDataa.append("FMobSts", formData.Status);
      formDataa.append("FAdd001", formData.inputform4);
      formDataa.append("FAdd002", formData.inputform5);
      formDataa.append("FPhnNum", formData.inputform6);
      formDataa.append("FEmlAdd", formData.inputform7);
      formDataa.append("FNicNum", formData.inputform8);
      formDataa.append("FCtyCod", selectedComplaint.value);
      formDataa.append("FLatVal", 31.6543241);
      formDataa.append("FLngVal", 73.4323456);
      // formDataa.append("FCtyCod", selectedComplaint);
      formDataa.append("FUsrId", 74);

      console.log("Submitting Form Data:", formDataa);

      const response = await axios.post(
        `https://crystalsolutions.com.pk/complaint/SaveMobile.php`,
        formDataa,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      console.log("API Response:", response);

      if (response.data.error === 200) {
        // newcode();
        Code.current.focus();
        setTimeout(() => {
          Code.current.select();
        }, 1000);
        handleRefetch();
        setFormData({
          ...formData,
          Descriptionform: "",
          Status: "",
          inputform4: "",
          inputform5: "",
          inputform6: "",
          inputform7: "",
          inputform8: "",
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
  const [textdata, settextdata] = useState(" Mobile Maintenance");

  const handleCloseModal = () => {
    setData({ columns: [], rows: [] });
    setSearchText("");
    setHighlightedRowIndex(0);
    settextdata("Update Mobile Maintenance");

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
    setData({ columns, rows: mobile });
  };
  const [dataa, setDataa] = useState({ columns: [], rows: [] });
  const fetchDataAndDisplayy = useCallback(async () => {
    const columns = [
      { label: "Code", field: "tacccod", sort: "asc" },
      { label: "Description", field: "taccdsc", sort: "asc" },
      { label: "Status", field: "taccsts", sort: "asc" },
    ];

    if (Array.isArray(mobile)) {
      setDataa({ columns, rows: mobile });
    } else {
      console.warn(
        "mobile data is not available or not in the correct format."
      );
    }
  }, []);
  useEffect(() => {
    fetchDataAndDisplayy();
  }, [fetchDataAndDisplayy]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    const formattedValue = value.toUpperCase(); // Trim and convert to uppercase
    if (name === "AccountCodeform") {
      if (!value.startsWith("03")) {
        return;
      }
    }
    if (name === "AccountCodeform") {
      console.log("Searching for:", formattedValue);

      const selectedItem = dataa.rows.find(
        (item) => item.tmobnum === formattedValue
      );

      console.log("Selected item:", selectedItem);

      if (selectedItem) {
        setFormData({
          ...formData,
          AccountCodeform: selectedItem.tmobnum,
          Descriptionform: selectedItem.tcstnam,
          Status: selectedItem.tmobsts,
          inputform4: selectedItem.tadd001,
          inputform5: selectedItem.tadd002,
          inputform6: selectedItem.tphnnum,
          inputform7: selectedItem.temladd,
          inputform8: selectedItem.tnicnum,
        });
        setSelectedComplaint(selectedItem.tctycod);
      } else {
        setFormData({
          ...formData,
          AccountCodeform: formattedValue,
          Descriptionform: "",
          inputform4: "",
          inputform5: "",
          inputform6: "",
          inputform7: "",
          inputform8: "",
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
      AccountCodeform: selectedItem.tmobnum,
      Descriptionform: selectedItem.tcstnam,
      Status: selectedItem.tmobsts,
      inputform4: selectedItem.tadd001,
      inputform5: selectedItem.tadd002,
      inputform6: selectedItem.tphnnum,
      inputform7: selectedItem.temladd,
      inputform8: selectedItem.tnicnum,
    });
    setSelectedComplaint(selectedItem.tctycod);

    settextdata("Update Mobile Maintenance");

    resetData();
  };

  const tableRef = useRef(null);

  const firstColWidthModal = "150px";
  const secondColWidthModal = "500px";

  const filteredRows =
    data.rows &&
    data.rows.filter(
      (row) =>
        (row.tmobnum &&
          row.tmobnum.toLowerCase().includes(searchText.toLowerCase())) ||
        (row.tcstnam &&
          row.tcstnam.toLowerCase().includes(searchText.toLowerCase()))
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
    setFormData({
      ...formData,
      AccountCodeform: "03",
      Descriptionform: "",
      SelectedStatus: "",
      inputform4: "",
      inputform5: "",
      inputform6: "",
      inputform7: "",
      inputform8: "",
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
                    <div className="col-sm-2 label-item">Mobile:</div>
                    <div className="col-sm-4">
                      <Form.Control
                        type="text"
                        className="form-control-account"
                        placeholder="Mobile"
                        name="AccountCodeform"
                        value={formData.AccountCodeform}
                        onChange={handleInputChange}
                        maxLength={11}
                        onKeyDown={(e) => {
                          if (e.key === "Enter") {
                            const upperCaseValue = e.target.value.toUpperCase();

                            if (dataa.rows && dataa.rows.length > 0) {
                              const selectedItem = dataa.rows.find(
                                (item) => item.tmobnum === upperCaseValue
                              );

                              if (selectedItem) {
                                console.log("selectedItem:", selectedItem);
                                handleEnterKeyPress(Status, e);
                              } else if (upperCaseValue.length < 11) {
                                setAlertData({
                                  type: "error",
                                  message: "Please enter a valid mobile code",
                                });
                                setTimeout(() => {
                                  setAlertData(null);
                                }, 3000);
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
                        style={{ display: "flex", alignItems: "center" }}
                      >
                        <Form.Control
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
                        </Form.Control>
                      </Form.Group>
                    </div>
                  </div>
                  <div className="row">
                    <div className="col-sm-2 label-item">Customer:</div>
                    <div className="col-sm-10" style={{ display: "flex" }}>
                      <Form.Control
                        type="text"
                        id="Descriptionform"
                        placeholder="Customer"
                        name="Descriptionform"
                        className={`form-control-item ${
                          errors.Descriptionform ? "border-red" : ""
                        }`}
                        value={formData.Descriptionform}
                        ref={Description}
                        onFocus={(e) => e.target.select()}
                        onChange={handleInputChange}
                        onKeyDown={(e) => handleEnterKeyPress(inputform4ref, e)}
                      />
                    </div>
                  </div>

                  <div className="row">
                    <div className="col-sm-2 label-item">Address1:</div>
                    <div className="col-sm-10" style={{ display: "flex" }}>
                      <Form.Control
                        type="text"
                        id="inputform4"
                        placeholder="Address"
                        name="inputform4"
                        className={`form-control-item ${
                          errors.inputform4 ? "border-red" : ""
                        }`}
                        value={formData.inputform4}
                        ref={inputform4ref}
                        onFocus={(e) => e.target.select()}
                        onChange={handleInputChange}
                        onKeyDown={(e) => handleEnterKeyPress(inputform5ref, e)}
                      />
                    </div>
                  </div>
                  <div className="row">
                    <div className="col-sm-2 label-item"></div>
                    <div className="col-sm-10" style={{ display: "flex" }}>
                      <Form.Control
                        type="text"
                        id="inputform5"
                        placeholder="Address"
                        name="inputform5"
                        className={`form-control-item ${
                          errors.inputform5 ? "border-red" : ""
                        }`}
                        value={formData.inputform5}
                        ref={inputform5ref}
                        onFocus={(e) => e.target.select()}
                        onChange={handleInputChange}
                        onKeyDown={(e) => handleEnterKeyPress(inputform6ref, e)}
                      />
                    </div>
                  </div>
                  <div className="row">
                    <div className="col-sm-2 label-item">Phone:</div>
                    <div className="col-sm-4" style={{ display: "flex" }}>
                      <Form.Control
                        type="text"
                        id="inputform6"
                        placeholder="Phone"
                        name="inputform6"
                        className={`form-control-item ${
                          errors.inputform6 ? "border-red" : ""
                        }`}
                        value={formData.inputform6}
                        ref={inputform6ref}
                        maxLength={11}
                        onFocus={(e) => e.target.select()}
                        onChange={handleInputChange}
                        onKeyDown={(e) => handleEnterKeyPress(inputform7ref, e)}
                      />
                    </div>
                    <div className="col-sm-1 label-item">Email:</div>
                    <div className="col-sm-5" style={{ display: "flex" }}>
                      <Form.Control
                        type="text"
                        id="inputform7"
                        placeholder="Email"
                        name="inputform7"
                        className={`form-control-item ${
                          errors.inputform7 ? "border-red" : ""
                        }`}
                        value={formData.inputform7}
                        ref={inputform7ref}
                        // maxLength={11}
                        onFocus={(e) => e.target.select()}
                        onChange={handleInputChange}
                        onKeyDown={(e) => handleEnterKeyPress(inputform8ref, e)}
                      />
                    </div>
                  </div>
                  <div className="row">
                    <div className="col-sm-2 label-item">CNIC:</div>
                    <div className="col-sm-4" style={{ display: "flex" }}>
                      <Form.Control
                        type="text"
                        id="inputform8"
                        placeholder="CNIC"
                        name="inputform8"
                        className={`form-control-item ${
                          errors.inputform8 ? "border-red" : ""
                        }`}
                        value={formData.inputform8}
                        ref={inputform8ref}
                        onFocus={(e) => e.target.select()}
                        onChange={handleInputChange}
                        onKeyDown={(e) => handleEnterKeyPress(inputform9ref, e)}
                      />
                    </div>

                    <div className="col-sm-1 label-item">City:</div>
                    <div className="col-sm-3">
                      <Form.Group
                        controlId="status"
                        style={{ display: "flex", alignItems: "center" }}
                      >
                        <CustomDropdown
                          value={selectedComplaint}
                          onChange={handleComplaintChange}
                          fetchUrl="https://crystalsolutions.com.pk/complaint/GetCity.php"
                          valueKey="tctycod" // Custom key for value
                          labelKey="tctydsc" // Custom key for label
                          placeholder="Search or select..."
                          isClearable={true}
                          width={250}
                          ref={inputform9ref}
                          onKeyDown={(e) => handleEnterKeyPress(Submit, e)}
                        />
                      </Form.Group>
                    </div>
                  </div>
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

              <Mobile_Maintenance_Modal
                isOpen={isModalOpen}
                handleClose={handleCloseModal}
                title="Select Mobile"
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
                firstColKey="tmobnum"
                secondColKey="tcstnam"
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

export default Mobile_Maintenance;
