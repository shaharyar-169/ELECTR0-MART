import { Form } from "react-bootstrap";
import Alert from "@mui/material/Alert";
import Header from "../../MainComponent/Header/Header";
import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import "./City_Maintenance.css";
import Footer from "../../MainComponent/Footer/Footer";
import { Modal } from "react-bootstrap";
import { fetchData } from "../../react_query/React_Query_Function";
import City_Maintenance_Modal from "./City_Maintenance_Modal";
import NavComponent from "../../MainComponent/Navform/navbarform";
import ButtonGroupp from "../../MainComponent/Button/ButtonGroup/ButtonGroup";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { fetchNewCityData, fetchCity } from "./City_Maintenance_Api";
import { components } from "react-select";
import Select from "react-select";

function City_Maintenance() {
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
    data: newCity,
    error: newCityError,
    isLoading: isLoadingNewCity,
  } = useQuery({
    queryKey: ["newCity"],
    queryFn: fetchNewCityData,
  });

  const {
    data: city,
    error: CityError,
    isLoading: isLoadingCity,
    refetch,
  } = useQuery({
    queryKey: ["city"],
    queryFn: fetchCity,
  });

  useEffect(() => {
    console.log("sdfsdfsdfsdfsdfsdf");

    console.log(city);
    if (newCity) {
      setFormData((prevState) => ({
        ...prevState,
        AccountCodeform: newCity,
      }));
    }
    if (Code.current) {
      Code.current.focus();
    }
  }, [newCity]);
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
  const [selectedOptionTechnician, setSelectedOptionTechnician] = useState("");

  //////////////////////// PRESS ENTER TO MOVE THE NEXT FIELD //////////////////

  const focusNextInput = (ref) => {
    if (ref.current) {
      ref.current.focus();
    }
  };

  const newcode = async () => {
    try {
      const response = await fetch(
        `https://crystalsolutions.com.pk/complaint/NewCity.php`
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

    try {
      const formDataa = new FormData();
      formDataa.append("FCtyCod", formData.AccountCodeform);
      formDataa.append("FCtyDsc", formData.Descriptionform);
      formDataa.append("FCtySts", formData.Status);
      // formDataa.append("FAdd001", formData.inputform4);
      // formDataa.append("FAdd002", formData.inputform5);
      // formDataa.append("FPhnNum", formData.inputform6);
      // formDataa.append("FMobNum", formData.inputform7);
      // formDataa.append("FEmlAdd", formData.inputform8);
      formDataa.append("FUsrId", 74);

      console.log("Submitting Form Data:", formDataa);

      const response = await axios.post(
        `https://crystalsolutions.com.pk/complaint/SaveCity.php`,
        formDataa,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      console.log("API Response:", response);

      if (response.data.error === 200) {
        Code.current.focus();
        setTimeout(() => {
          Code.current.select();
        }, 1000);
        handleRefetch();
        newcode();
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
  const isClearable = true;
  const handleSelectChangeTechnician = (selectedOption) => {
    console.log("selectedOptioselectedOptionn", selectedOption);
    setSelectedOptionTechnician(selectedOption);

    if (selectedOption === null) {
      console.log("Selection cleared");
    }
    if (selectedOption) {
      console.log("selectedOption:", selectedOption);
      const selectedValue = selectedOption.value;
      setSelectedOptionTechnician(selectedOption);
    } else {
    }
  };
  const CustomInput = (props) => {
    return (
      <components.Input
        {...props}
        onChange={(e) => {
          e.target.value = e.target.value.toUpperCase();
          props.onChange(e);
        }}
      />
    );
  };
  const DropdownOption = (props) => {
    return (
      <components.Option {...props}>
        <div
          style={{
            // borderBottom: "1px solid #ccc",
            fontSize: "12px",
            padding: "0",
            lineHeight: "5px",
            margin: "0",
            width: "auto",
          }}
        >
          {props.data.label}
        </div>
      </components.Option>
    );
  };
  const customStyles = {
    menu: (provided, state) => ({
      ...provided,
      // difference between the menu and the control

      fontSize: "10px",
    }),
    control: (base, state) => ({
      ...base,
      height: "24px",
      minHeight: "24px",
      maxHeight: "24px",
      marginLeft: "-10px",
      paddingLeft: "10px",
      width: "300px",
      fontSize: "11px",
      marginBottom: "5px",
      borderRadius: 0,
      border: "1px solid black",
      transition: "border-color 0.15s ease-in-out",
      "&:hover": {
        borderColor: state.isFocused ? base.borderColor : "black",
      },
      // padding: "0 1px",
      // marginLeft: 10,
    }),
    dropdownIndicator: (base) => ({
      ...base,
      padding: "5px",
    }),
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
  const [textdata, settextdata] = useState(" City Maintenance");

  const handleCloseModal = () => {
    setData({ columns: [], rows: [] });
    setSearchText("");
    setHighlightedRowIndex(0);
    settextdata("Update City Maintenance");

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
    setData({ columns, rows: city });
  };
  const [dataa, setDataa] = useState({ columns: [], rows: [] });
  const fetchDataAndDisplayy = async () => {
    const columns = [
      { label: "Code", field: "tacccod", sort: "asc" },
      { label: "Description", field: "taccdsc", sort: "asc" },
      { label: "Status", field: "taccsts", sort: "asc" },
    ];
    if (Array.isArray(city)) {
      setDataa({ columns, rows: city });
    } else {
      console.warn("City data is not available or not in the correct format.");
    }
  };
  useEffect(() => {
    fetchDataAndDisplayy();
  }, [fetchDataAndDisplayy]);
  const [techniciandata, setTechniciandata] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(
          `https://crystalsolutions.com.pk/complaint/GetTechnician.php`
        );
        const apiData = await response.json();
        setTechniciandata(apiData);
      } catch (error) {
        console.error(error);
      }
    };

    fetchData();
  }, []);
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
      const selectedItem = dataa.rows.find((item) => item.tctycod === value);

      console.log("Selected item:", selectedItem);

      if (selectedItem) {
        setFormData({
          ...formData,
          AccountCodeform: selectedItem.tctycod,
          Descriptionform: selectedItem.tctydsc,
          Status: selectedItem.tctysts,
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
        (item) => item.tctycod === formatToThreeDigits(formattedValue)
      );

      console.log("Selected item:", selectedItem);

      if (selectedItem) {
        setFormData({
          ...formData,
          AccountCodeform: selectedItem.tctycod,
          Descriptionform: selectedItem.tctydsc,
          Status: selectedItem.tctysts,
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
      AccountCodeform: selectedItem.tctycod,
      Descriptionform: selectedItem.tctydsc,
      Status: selectedItem.tctysts,
      // inputform4: selectedItem.tadd001,
      // inputform5: selectedItem.tadd002,
      // inputform6: selectedItem.tphnnum,
      // inputform7: selectedItem.tmobnum,
      // inputform8: selectedItem.temladd,
    });
    settextdata("Update City Maintenance");

    resetData();
  };

  const tableRef = useRef(null);

  const firstColWidthModal = "150px";
  const secondColWidthModal = "500px";

  const filteredRows =
    data.rows &&
    data.rows.filter(
      (row) =>
        (row.tctycod &&
          row.tctycod.toLowerCase().includes(searchText.toLowerCase())) ||
        (row.tctydsc &&
          row.tctydsc.toLowerCase().includes(searchText.toLowerCase()))
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
                                (item) => item.tctycod === upperCaseValue
                              );

                              if (selectedItem) {
                                console.log("selectedItem:", selectedItem);
                                handleEnterKeyPress(Status, e);
                              } else if (upperCaseValue.length < 3) {
                                setAlertData({
                                  type: "success",
                                  message: "fetch data",
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
                  {/* <div className="row">
                    <div className="col-sm-3 label-item">Technician:</div>
                    <div className="col-sm-4">
                      <Form.Group
                        controlId="status"
                        style={{ display: "flex", alignItems: "center" }}
                      >
                        <Select
                          value={selectedOptionTechnician}
                          onChange={handleSelectChangeTechnician}
                          options={techniciandata.map((option) => ({
                            value: option.techid,
                            label: option.techdsc,
                          }))}
                          ref={inputform4ref}
                          placeholder="Search or select..."
                          styles={customStyles}
                          isClearable={isClearable}
                          components={{
                            Option: DropdownOption,
                            Input: CustomInput,
                          }}
                        />
                      </Form.Group>
                    </div>
                  </div> */}
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

              <City_Maintenance_Modal
                isOpen={isModalOpen}
                handleClose={handleCloseModal}
                title="Select City"
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
                firstColKey="tctycod"
                secondColKey="tctydsc"
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

export default City_Maintenance;
