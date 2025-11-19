import { Form } from "react-bootstrap";
import Alert from "@mui/material/Alert";
import Header from "../../MainComponent/Header/Header";
import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import "./Account_Code_Maintenance.css";
import Footer from "../../MainComponent/Footer/Footer";
import { Modal } from "react-bootstrap";
import { fetchData } from "../../react_query/React_Query_Function";
import Account_Code_Maintenance_Modal from "./Account_Code_Maintenance_Modal";
import NavComponent from "../../MainComponent/Navform/navbarform";
import ButtonGroupp from "../../MainComponent/Button/ButtonGroup/ButtonGroup";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useHotkeys } from "react-hotkeys-hook";

import {
  fetchNewTechnicianData,
  fetchTechnicians,
} from "./Account_Code_Maintenance_Api";
import StatusSelect from "../../MainComponent/StatusSelected/StatusSelected";

function Account_Code_Maintenance() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const [formData, setFormData] = useState({
    AccountCodeform: "",
    Descriptionform: "",
    Status: "",
    inputform4: "",
    inputform5: "",
    inputform6: "",
    inputform7: "",
    inputform8: "",
    inputform9: "",
    inputform10: "",
    inputform11: "",
    inputform12: "",
  });
  const {
    data: newTechnicians,
    error: newTechniciansError,
    isLoading: isLoadingNewTechnicians,
  } = useQuery({
    queryKey: ["newTechnicians"],
    queryFn: fetchNewTechnicianData,
  });

  const {
    data: technicians,
    error: techniciansError,
    isLoading: isLoadingTechnicians,
    refetch,
  } = useQuery({
    queryKey: ["technicians"],
    queryFn: fetchTechnicians,
  });

  // useEffect(() => {
  //   console.log("sdfsdfsdfsdfsdfsdf");

  //   console.log(technicians);
  //   if (newTechnicians) {
  //     setFormData((prevState) => ({
  //       ...prevState,
  //       AccountCodeform: newTechnicians,
  //     }));
  //   }
  //   if (Code.current) {
  //     Code.current.focus();
  //   }
  // }, [newTechnicians]);
  const handleRefetch = () => {
    console.log("Refetching data...");
    refetch();
  };
  const [selectedStatus2, setSelectedStatus2] = useState("Yes");
  const [selectedStatus3, setSelectedStatus3] = useState("Yes");

  const [alertData, setAlertData] = useState(null);
  const fontFamily = "verdana";
  const apiLinks =
    "https://crystalsolutions.com.pk/umair_electronic/web/GetAccounts.php";

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
  const inputform12ref = useRef(null);

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

  // const newcode = async () => {
  //   try {
  //     const response = await fetch(
  //       `https://crystalsolutions.com.pk/complaint/NewTechnician.php`
  //     );
  //     if (!response.ok) {
  //       throw new Error("Failed to fetch data");
  //     }
  //     const jsonData = await response.json();

  //     setFormData((prevState) => ({
  //       ...prevState,
  //       AccountCodeform: jsonData, // Adjust based on actual data structure
  //     }));
  //     setTimeout(() => {
  //       Code.current.focus();
  //     }, 500);
  //   } catch (error) {
  //     console.error(error);
  //   }
  // };
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
  const [errors, setErrors] = useState({});

  const handleFormSubmit = async (e) => {
    e.preventDefault();

    const checks = [
      {
        value: formData?.Descriptionform,
        message: "Please fill your description",
      },
      {
        value: formData?.inputform11,
        message: "Please fill your NTN Number",
      },
      {
        value: formData?.inputform12,
        message: "Please fill your STRN Number",
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
      formDataa.append("FAccCod", formData.AccountCodeform);
      formDataa.append("FAccDsc", formData.Descriptionform);
      formDataa.append("FAccSts", formData.Status);
      formDataa.append("FDbtAmt", formData.inputform4);
      formDataa.append("FCrtAmt", formData.inputform5);
      formDataa.append("FAdd001", formData.inputform6);
      formDataa.append("FAdd002", formData.inputform7);
      formDataa.append("FMobNum", formData.inputform8);
      formDataa.append("FEmlAdd", formData.inputform9);
      formDataa.append("FNicNum", formData.inputform10);
      formDataa.append("FNtnNum", formData.inputform11);
      formDataa.append("FStnNum", formData.inputform12);
      formDataa.append("FUsrId", 1);

      console.log("Submitting Form Data:", formDataa);

      const response = await axios.post(
        `https://crystalsolutions.com.pk/umair_electronic/web/SaveAccountCode.php`,
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
          inputform9: "",
          inputform10: "",
          inputform11: "",
          inputform12: "",
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

  // useHotkeys("alt+r", handleFormSubmit);

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
  const [textdata, settextdata] = useState(" Account Code Maintenace");

  const handleCloseModal = () => {
    setData({ columns: [], rows: [] });
    setSearchText("");
    setHighlightedRowIndex(0);
    settextdata("Update Account Code Maintenance");

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
    setData({ columns, rows: technicians });
  };
  const [dataa, setDataa] = useState({ columns: [], rows: [] });
  const fetchDataAndDisplayy = async () => {
    const columns = [
      { label: "Code", field: "tacccod", sort: "asc" },
      { label: "Description", field: "taccdsc", sort: "asc" },
      { label: "Status", field: "taccsts", sort: "asc" },
    ];
    if (Array.isArray(technicians)) {
      setDataa({ columns, rows: technicians });
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
    const accountCodeValue = String(formData.AccountCodeform);
    const part1 = "12"; // Fixed part
    const part2 = accountCodeValue.slice(0, 2).padStart(2, "0"); // First 2 digits, padded
    const part3 = accountCodeValue.slice(2).padStart(4, "0"); // Last 4 digits, padded

    // Combine parts to form the desired format
    const formattedValue = `${part1}-${part2}-${part3}`;

    setFormData({
      ...formData,
      AccountCodeform: formattedValue,
    });
    setTimeout(() => {
      const selectedItem = dataa.rows.find(
        (item) => item.tacccod === formattedValue
      );

      console.log("Selected item:", selectedItem);

      if (selectedItem) {
        setFormData({
          ...formData,
          AccountCodeform: selectedItem.tacccod,
          Descriptionform: selectedItem.taccdsc,
          Status: selectedItem.taccsts,
          inputform4: selectedItem.tdbtamt,
          inputform5: selectedItem.tcrtamt,
          inputform6: selectedItem.tadd001,
          inputform7: selectedItem.tadd002,
          inputform8: selectedItem.tmobnum,
          inputform9: selectedItem.temladd,
          inputform10: selectedItem.tnicnum,
          inputform11: selectedItem.tntnnum,
          inputform12: selectedItem.tstnnum,
        });
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
          inputform9: "",
          inputform10: "",
          inputform11: "",
          inputform12: "",
        });
      }
    }, 500);
  };
  const handleInputChangefetchdata = async (e) => {
    console.log("show the value is:", e.target.value);
    let inputValue = e.target.value;
    if (inputValue.length > 8) {
      return;
    }
    setFormData({
      ...formData,
      AccountCodeform: inputValue,
    });
  };
  const formatAmount = (value) => {
    let cleanedValue = value.replace(/[^0-9.]/g, "");
    let num = parseFloat(cleanedValue);
    if (isNaN(num)) {
      return value;
    }
    return num.toLocaleString();
  };
  const formatCNIC = (value) => {
    let cleanedValue = value.replace(/[^0-9]/g, "");
    if (cleanedValue.length > 13) {
      cleanedValue = cleanedValue.slice(0, 13);
    }
    const part1 = cleanedValue.slice(0, 5);
    const part2 = cleanedValue.slice(5, 12);
    const part3 = cleanedValue.slice(12);
    if (cleanedValue.length >= 13) {
      return `${part1}-${part2}-${part3}`;
    } else if (cleanedValue.length >= 6) {
      return `${part1}-${part2}`;
    } else {
      return part1;
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    let formattedValue = value.toUpperCase();
    if (name === "inputform8") {
      if (!value.startsWith("03")) {
        setFormData((prevData) => ({
          ...prevData,
          inputform8: "03",
        }));
        return;
      }
      const numericPart = value.slice(2).replace(/[^0-9]/g, "");
      if (numericPart.length > 9) return;
      setFormData((prevData) => ({
        ...prevData,
        inputform8: "03" + numericPart,
      }));
    }
    if (name === "inputform4") {
      formattedValue = formatAmount(formattedValue);
      console.log("formattedValuee", formattedValue);
      setFormData({
        ...formData,
        inputform4: formattedValue,
      });
    }
    if (name === "inputform5") {
      formattedValue = formatAmount(formattedValue);
      setFormData({
        ...formData,
        inputform5: formattedValue,
      });
    }
    if (name === "inputform10") {
      formattedValue = formatCNIC(formattedValue);
      setFormData({
        ...formData,
        inputform10: formattedValue,
      });
    }
    if (name === "AccountCodeform") {
      console.log("Searching for:", formattedValue);

      const selectedItem = dataa.rows.find(
        (item) => item.tacccod === formatToThreeDigits(formattedValue)
      );

      console.log("Selected item:", selectedItem);

      if (selectedItem) {
        setFormData({
          ...formData,
          AccountCodeform: selectedItem.tacccod,
          Descriptionform: selectedItem.taccdsc,
          Status: selectedItem.taccsts,
          inputform4: selectedItem.tdbtamt,
          inputform5: selectedItem.tcrtamt,
          inputform6: selectedItem.tadd001,
          inputform7: selectedItem.tadd002,
          inputform8: selectedItem.tmobnum,
          inputform9: selectedItem.temladd,
          inputform10: selectedItem.tnicnum,
          inputform11: selectedItem.tntnnum,
          inputform12: selectedItem.tstnnum,
        });
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
          inputform9: "",
          inputform10: "",
          inputform11: "",
          inputform12: "",
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
      AccountCodeform: selectedItem.tacccod,
      Descriptionform: selectedItem.taccdsc,
      Status: selectedItem.taccsts,
      inputform4: selectedItem.tdbtamt,
      inputform5: selectedItem.tcrtamt,
      inputform6: selectedItem.tadd001,
      inputform7: selectedItem.tadd002,
      inputform8: selectedItem.tmobnum,
      inputform9: selectedItem.temladd,
      inputform10: selectedItem.tnicnum,
      inputform11: selectedItem.tntnnum,
      inputform12: selectedItem.tstnnum,
    });
    settextdata("Update Account Code Maintenance");

    resetData();
  };

  const tableRef = useRef(null);

  const firstColWidthModal = "150px";
  const secondColWidthModal = "500px";

  const filteredRows =
    data.rows &&
    data.rows.filter(
      (row) =>
        (row.tacccod &&
          row.tacccod.toLowerCase().includes(searchText.toLowerCase())) ||
        (row.taccdsc &&
          row.taccdsc.toLowerCase().includes(searchText.toLowerCase()))
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
    // newcode();
    setFormData({
      ...formData,
      Descriptionform: "",
      SelectedStatus: "",
      inputform4: "",
      inputform5: "",
      inputform6: "",
      inputform7: "",
      inputform8: "",
      inputform9: "",
      inputform10: "",
      inputform11: "",
      inputform12: "",
    });

    // Set focus to the input element with ref 'Code'
    if (Code.current) {
      Code.current.focus();
    }
  };

  function handleReturn() {
    navigate("/MainPage");
  }

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
                    <div className="col-sm-3 label-item">Account Code:</div>
                    <div className="col-sm-3">
                      <Form.Control
                        type="text"
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
                        maxLength={10}
                        onKeyDown={(e) => {
                          if (e.key === "Enter") {
                            handleBlurRVC();
                            handleEnterKeyPress(Status, e);

                            const upperCaseValue = e.target.value.toUpperCase();

                            if (dataa.rows && dataa.rows.length > 0) {
                              const selectedItem = dataa.rows.find(
                                (item) => item.tacccod === upperCaseValue
                              );
                              if (selectedItem) {
                                console.log("selectedItem:", selectedItem);
                                handleEnterKeyPress(Status, e);
                              } else if (upperCaseValue.length < 3) {
                                setAlertData({
                                  type: "success",
                                  message: "Fetch your Data",
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
                          e.target.select();
                        }}
                        onDoubleClick={(e) => {
                          if (e.target.value.length <= 5) {
                            handleDoubleClick(e);
                            setTimeout(() => {
                              console.log("focus in the search box");
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
                        onKeyDown={(e) => handleEnterKeyPress(inputform4ref, e)}
                      />
                    </div>
                  </div>
                  <div className="row">
                    <div className="col-sm-3 label-item">Debit:</div>
                    <div className="col-sm-3" style={{ display: "flex" }}>
                      <Form.Control
                        type="text"
                        id="inputform4"
                        placeholder="Debit"
                        name="inputform4"
                        className={`form-control-item ${
                          errors.inputform4 ? "border-red" : ""
                        }`}
                        style={{ textAlign: "right" }}
                        value={formData.inputform4}
                        ref={inputform4ref}
                        onFocus={(e) => e.target.select()}
                        onChange={handleInputChange}
                        onBlur={(e) => {
                          const inputValue = parseFloat(e.target.value);
                          if (parseFloat(inputValue) !== 0) {
                            setFormData({
                              ...formData,
                              inputform5: "0",
                            });
                          }
                        }}
                        onKeyDown={(e) => handleEnterKeyPress(inputform5ref, e)}
                      />
                    </div>
                    <div className="col-sm-3 label-item">Credit:</div>
                    <div className="col-sm-3" style={{ display: "flex" }}>
                      <Form.Control
                        type="text"
                        id="inputform5"
                        placeholder="Credit"
                        name="inputform5"
                        className={`form-control-item ${
                          errors.inputform5 ? "border-red" : ""
                        }`}
                        style={{ textAlign: "right" }}
                        value={formData.inputform5}
                        ref={inputform5ref}
                        onFocus={(e) => e.target.select()}
                        onChange={handleInputChange}
                        onBlur={(e) => {
                          const inputValue = parseFloat(e.target.value);
                          if (parseFloat(inputValue) !== 0) {
                            setFormData({
                              ...formData,
                              inputform4: "0",
                            });
                          }
                        }}
                        onKeyDown={(e) => handleEnterKeyPress(inputform6ref, e)}
                      />
                    </div>
                  </div>
                  <hr
                    style={{
                      border: "1px solid black",
                      width: "96%",
                      margin: "0 auto 2px auto",
                      display: "block",
                    }}
                  />

                  <div className="row">
                    <div className="col-sm-3 label-item">Address1:</div>
                    <div className="col-sm-9" style={{ display: "flex" }}>
                      <Form.Control
                        type="text"
                        id="inputform6"
                        placeholder="Address"
                        name="inputform6"
                        className={`form-control-item ${
                          errors.inputform6 ? "border-red" : ""
                        }`}
                        value={formData.inputform6}
                        ref={inputform6ref}
                        onFocus={(e) => e.target.select()}
                        onChange={handleInputChange}
                        onKeyDown={(e) => handleEnterKeyPress(inputform7ref, e)}
                      />
                    </div>
                  </div>
                  <div className="row">
                    <div className="col-sm-3 label-item"></div>
                    <div className="col-sm-9" style={{ display: "flex" }}>
                      <Form.Control
                        type="text"
                        id="inputform7"
                        placeholder="Address"
                        name="inputform7"
                        className={`form-control-item ${
                          errors.inputform7 ? "border-red" : ""
                        }`}
                        value={formData.inputform7}
                        ref={inputform7ref}
                        onFocus={(e) => e.target.select()}
                        onChange={handleInputChange}
                        onKeyDown={(e) => handleEnterKeyPress(inputform8ref, e)}
                      />
                    </div>
                  </div>

                  <div className="row">
                    <div className="col-sm-3 label-item">Mobile:</div>
                    <div className="col-sm-4" style={{ display: "flex" }}>
                      <Form.Control
                        type="text"
                        id="inputform8"
                        placeholder="03XX-XXXXXXX"
                        name="inputform8"
                        className={`form-control-item ${
                          errors.inputform8 ? "border-red" : ""
                        }`}
                        value={formData.inputform8}
                        ref={inputform8ref}
                        maxLength={11}
                        onFocus={(e) => {
                          const length = e.target.value.length;
                          e.target.select();
                          // e.target.setSelectionRange(length, length);
                        }}
                        onChange={handleInputChange}
                        onKeyDown={(e) => handleEnterKeyPress(inputform9ref, e)}
                      />
                    </div>
                  </div>
                  <div className="row">
                    <div className="col-sm-3 label-item">Email:</div>
                    <div className="col-sm-4" style={{ display: "flex" }}>
                      <Form.Control
                        type="text"
                        id="inputform9"
                        placeholder="Email"
                        name="inputform9"
                        className={`form-control-item ${
                          errors.inputform9 ? "border-red" : ""
                        }`}
                        value={formData.inputform9}
                        ref={inputform9ref}
                        onFocus={(e) => e.target.select()}
                        onChange={handleInputChange}
                        onKeyDown={(e) =>
                          handleEnterKeyPress(inputform10ref, e)
                        }
                      />
                    </div>
                    <div className="col-sm-2 label-item">CNIC:</div>
                    <div className="col-sm-3" style={{ display: "flex" }}>
                      <Form.Control
                        type="text"
                        id="inputform10"
                        placeholder="XXXXX-XXXXXXX-X"
                        maxLength={13}
                        name="inputform10"
                        className={`form-control-item ${
                          errors.inputform10 ? "border-red" : ""
                        }`}
                        value={formData.inputform10}
                        ref={inputform10ref}
                        onFocus={(e) => e.target.select()}
                        onChange={handleInputChange}
                        onKeyDown={(e) =>
                          handleEnterKeyPress(inputform11ref, e)
                        }
                      />
                    </div>
                  </div>
                  <hr
                    style={{
                      border: "1px solid black",
                      width: "96%",
                      margin: "0 auto 2px auto",
                      display: "block",
                    }}
                  />
                  <div className="row">
                    <div className="col-sm-3 label-item">NTN:</div>
                    <div className="col-sm-4" style={{ display: "flex" }}>
                      <Form.Control
                        type="text"
                        id="inputform11"
                        placeholder="NTN Number"
                        name="inputform11"
                        className={`form-control-item ${
                          errors.inputform11 ? "border-red" : ""
                        }`}
                        style={{ textAlign: "right" }}
                        value={formData.inputform11}
                        ref={inputform11ref}
                        onFocus={(e) => e.target.select()}
                        onChange={handleInputChange}
                        onKeyDown={(e) =>
                          handleEnterKeyPress(inputform12ref, e)
                        }
                      />
                    </div>
                    <div className="col-sm-2 label-item">STRN:</div>
                    <div className="col-sm-3" style={{ display: "flex" }}>
                      <Form.Control
                        type="text"
                        id="inputform12"
                        placeholder="Stn Number"
                        name="inputform12"
                        className={`form-control-item ${
                          errors.inputform12 ? "border-red" : ""
                        }`}
                        style={{ textAlign: "right" }}
                        value={formData.inputform12}
                        ref={inputform12ref}
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

              <Account_Code_Maintenance_Modal
                isOpen={isModalOpen}
                handleClose={handleCloseModal}
                title="Select Account Code"
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
                firstColKey="tacccod"
                secondColKey="taccdsc"
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

export default Account_Code_Maintenance;
