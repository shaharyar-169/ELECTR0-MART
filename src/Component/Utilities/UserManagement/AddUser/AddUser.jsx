import { Form } from "react-bootstrap";
import Alert from "@mui/material/Alert";
import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import "./AddUser.css";
import NavComponent from "../../../MainComponent/Navform/navbarform";
import ButtonGroupp from "../../../MainComponent/Button/ButtonGroup/ButtonGroup";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import StatusSelect from "../../../MainComponent/StatusSelected/StatusSelected";
import { isLoggedIn, getUserData, getOrganisationData } from "../../../Auth";
import GeneralTwoFieldsModal from "./AddUser_Modal";
import { getcompanyData } from "./AddUser_Api";
import { useMutation } from "@tanstack/react-query";

import { useTheme } from "../../../../ThemeContext";
function formatToThreeDigits(number) {
  // Convert the number to a string and pad with leading zeros if necessary
  return number.toString().padStart(3, "0");
}
function removeParentDirectories(path) {
  if (typeof path === "string") {
    return path.replace("../../", "");
  }
  console.error("Invalid path:", path);
  return "";
}
function AddUser1() {
  const user = getUserData();
  const organisation = getOrganisationData();
  const { apiLinks } = useTheme();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isLoggedIn()) {
      navigate("/login");
    }
  }, [navigate]);

  const [formData, setFormData] = useState({
    AccountCodeform: "",
    Descriptionform: "",
    UrduFormDescription: "",
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
    inputform13: "",
    inputform14: "",
  });
  const [dataa, setDataa] = useState([]);

  const mutation2 = useMutation({
    mutationFn: getcompanyData,
    onSuccess: (data) => {
      const columns = [
        { label: "Code", field: "tacccod", sort: "asc" },
        { label: "Description", field: "taccdsc", sort: "asc" },
        { label: "Status", field: "taccsts", sort: "asc" },
      ];
      if (Array.isArray(data)) {
        setDataa(data);
      } else {
        console.warn(
          "Technicians data is not available or not in the correct format."
        );
      }

      if (data.error === 200) {
      } else {
      }
    },
    onError: (error) => {
      console.error("Error:", error);
    },
  });

  const GetDataList = () => {
    const data = {
      code: organisation.code,
    };
    mutation2.mutate(data);
  };
  useEffect(() => {
    GetDataList();

    Codefocus();
  }, []);
  const Codefocus = () => {
    if (Code.current) {
      Code.current.focus();
    }
  };
  const [alertData, setAlertData] = useState(null);
  const fontFamily = "verdana";
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
  const inputform13ref = useRef(null);
  const inputform14ref = useRef(null);
  const Submit = useRef(null);
  const Clear = useRef(null);
  const Return = useRef(null);
  const SearchBox = useRef(null);
  //////////////////////// PRESS ENTER TO MOVE THE NEXT FIELD //////////////////

  const focusNextInput = (ref) => {
    if (ref.current) {
      ref.current.focus();
    }
  };

  const [errors, setErrors] = useState({});

  const [selectedImage1, setSelectedImage1] = useState(null);

  const handleImageChange1 = (event) => {
    const file = event.target.files[0];
    if (file) {
      setSelectedImage1(file);
      console.log("file", file);
      const imgElement = document.getElementById("pic1-preview");
      imgElement.src = URL.createObjectURL(file);
    }
  };

  const [geturdu, setGeturdu] = useState("");

  const handleFormSubmit = async (e) => {
    e.preventDefault();

    const checks = [
      {
        value: formData?.AccountCodeform,
        message: "Please fill your Userid",
      },
      {
        value: formData?.Descriptionform,
        message: "Please fill your User Name",
      },

      {
        value: formData?.Descriptionform,
        message: "Please fill your User Name",
      },
      {
        value: formData?.inputform8,
        message: "Please select your Status",
      },
      {
        value: formData?.inputform9,
        message: "Please select your Type",
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
      formDataa.append("FUsrId", formData.AccountCodeform);
      formDataa.append("FUsrNam", formData.Descriptionform);
      // formDataa.append("FUsrSts", formData.Status);
      // formDataa.append("FUrdDsc", geturdu);
      formDataa.append("FCshCod", formData.inputform4);
      formDataa.append("FStrCod", formData.inputform5);
      formDataa.append("FEmpCod", formData.inputform6);
      formDataa.append("FPwdExp", formData.inputform7);
      formDataa.append("FUsrSts", formData.inputform8);
      formDataa.append("FUsrTyp", formData.inputform9);
      formDataa.append("FMobNum", formData.inputform10);
      formDataa.append("FEmlAdd", formData.inputform11);
      formDataa.append("FTimFrm", formData.inputform12);
      formDataa.append("FTimToo", formData.inputform13);
      formDataa.append("FUsrPwd", formData.inputform14);
      formDataa.append("code", organisation.code);
      formDataa.append("FCurUsr", user.tusrid);
      console.log("Submitting Form Data:", formDataa);

      const response = await axios.post(`${apiLinks}/SaveUser.php`, formDataa, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      console.log("API Response:", response);

      if (response.data.error === 200) {
        GetDataList();
        Codefocus();
        setFormData({
          ...formData,
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
          inputform13: "",
          inputform14: "",
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
  const [textdata, settextdata] = useState("User Management ");

  const handleCloseModal = () => {
    setData({ columns: [], rows: [] });
    setSearchText("");
    setHighlightedRowIndex(0);
    settextdata("User Management");

    setModalOpen(false);
  };

  const handleDoubleClick = (e) => {
    focusNextInput(Code);
    console.log("====== handle double click=======");
    // setSearchText(e.target.value);
    setModalOpen(true);
  };

  const handleBlurRVC = (e) => {
    // Convert nextItemId to string before calling padStart
    const value = String(formData.AccountCodeform).padStart(3, "0");
    console.log("dataa item:", dataa);

    setFormData({
      ...formData,
      AccountCodeform: value,
    });
    console.log("value", value);
    setTimeout(() => {
      const selectedItem = dataa.find((item) => item.tusrid === value);

      console.log("Selected item:", selectedItem);

      if (selectedItem) {
        setFormData({
          ...formData,
          AccountCodeform: selectedItem.tusrid,
          Descriptionform: selectedItem.tusrnam,
          inputform4: selectedItem["Cash Code"],
          inputform5: selectedItem["Store Code"],
          inputform6: selectedItem["Emp Code"],
          inputform7: selectedItem.Expiry,
          inputform8: selectedItem.Status,
          inputform9: selectedItem.Type,
          inputform10: selectedItem.Mobile,
          inputform11: selectedItem.Email,
          inputform12: selectedItem["Time From"],
          inputform13: selectedItem["Time Too"],
          inputform14: selectedItem.Password,
        });
        handlePrediction(selectedItem.tusrnam).then((result) => {
          setGeturdu(result);
        });
      } else {
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
          inputform13: "",
          inputform14: "",
        });
      }
    }, 500);
  };
  const handleInputChangefetchdata = async (e) => {
    console.log("show the value is:", e.target.value);
    let inputValue = e.target.value;
    setFormData({
      ...formData,
      AccountCodeform: e.target.value,
    });
  };

  const handlePrediction = async (name) => {
    const url = "https://rehman1603-english-to-urdu.hf.space/run/predict";
    const payload = {
      data: [name],
    };

    try {
      const response = await axios.post(url, payload, {
        headers: { "Content-Type": "application/json" },
      });

      console.log(response, "response");

      if (response.status === 200) {
        const result = response.data.data[0];

        console.log(result, "result");
        return result; // Return the result for use in the calling function
      } else {
        console.error("Failed to fetch prediction");
        return null; // Return null or some default value if the request failed
      }
    } catch (error) {
      console.error("Error during prediction:", error);
      return null; // Return null or some default value in case of an error
    }
  };
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    const formattedValue = value.toUpperCase();

    if (name === "Descriptionform") {
      console.log("Searching for:", formattedValue);

      handlePrediction(formattedValue).then((result) => {
        setGeturdu(result);
        console.log("resulttttttttttt");
      });
    }
    if (name === "inputform11") {
      const lowercaseValue = value.toLowerCase();
      setFormData({
        ...formData,
        inputform11: lowercaseValue,
      });
    } else {
      setFormData({
        ...formData,
        [name]: value,
      });
    }
    if (name === "UrduFormDescription") {
      console.log("Searching for:", formattedValue);
      setGeturdu(formattedValue);
    }
    if (name === "AccountCodeform") {
      console.log("Searching for:", value);

      const selectedItem = dataa.find((item) => item.tusrid === value);

      console.log("Selected item:", selectedItem);

      if (selectedItem) {
        setFormData({
          ...formData,
          AccountCodeform: selectedItem.tusrid,
          Descriptionform: selectedItem.tusrnam,
          inputform4: selectedItem["Cash Code"],
          inputform5: selectedItem["Store Code"],
          inputform6: selectedItem["Emp Code"],
          inputform7: selectedItem.Expiry,
          inputform8: selectedItem.Status,
          inputform9: selectedItem.Type,
          inputform10: selectedItem.Mobile,
          inputform11: selectedItem.Email,
          inputform12: selectedItem["Time From"],
          inputform13: selectedItem["Time Too"],
          inputform14: selectedItem.Password,
        });
        handlePrediction(selectedItem.tcmpdsc).then((result) => {
          setGeturdu(result);
        });
      } else {
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
          inputform13: "",
          inputform14: "",
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
  const handleRowClick = (selectedItem, rowIndex) => {
    console.log("handleRowClickAccount", selectedItem);
    setModalOpen(false);
    setFormData({
      ...formData,
      AccountCodeform: selectedItem.tusrid,
      Descriptionform: selectedItem.tusrnam,
      inputform4: selectedItem["Cash Code"],
      inputform5: selectedItem["Store Code"],
      inputform6: selectedItem["Emp Code"],
      inputform7: selectedItem.Expiry,
      inputform8: selectedItem.Status,
      inputform9: selectedItem.Type,
      inputform10: selectedItem.Mobile,
      inputform11: selectedItem.Email,
      inputform12: selectedItem["Time From"],
      inputform13: selectedItem["Time Too"],
      inputform14: selectedItem.Password,
    });
    handlePrediction(selectedItem.tcmpdsc).then((result) => {
      setGeturdu(result);
    });

    settextdata("User Management");

    resetData();
  };

  const handleFocus = (codeparam) => {
    if (codeparam.current) {
      codeparam.current.style.backgroundColor = "orange";
    }
  };

  const handleSave = () => {
    handleFormSubmit();
  };
  const handleClear = () => {
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
      inputform13: "",
      inputform14: "",
    });

    if (Code.current) {
      Code.current.focus();
    }
  };

  const handleReturn = () => {
    navigate("/UserManagement");
  };

  const handleBlur = (codeparam) => {
    if (codeparam.current) {
      codeparam.current.style.backgroundColor = "#3368B5";
    }
  };
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
    width: isSidebarVisible ? "calc(100vw - 5vw)" : "100vw",
    marginLeft: isSidebarVisible ? "15vw" : "45vh",
    transition: isSidebarVisible
      ? "margin-left 2s ease-in-out, margin-right 2s ease-in-out"
      : "margin-left 2s ease-in-out, margin-right 2s ease-in-out",
    display: "flex",
    justifyContent: "center",
    alignItems: "start",
    overflowX: "hidden",
    overflowY: "hidden",
    textAlign: "center",
    maxWidth: "720px",
  };
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
            className="col-md-12 "
            style={{
              border: `1px solid ${fontcolor}`,
              borderRadius: "9px",
            }}
          >
            <NavComponent textdata={textdata} />

            <br />
            <Form
              onSubmit={handleFormSubmit}
              style={{
                backgroundColor: getcolor,
                color: fontcolor,
              }}
            >
              <div className="row">
                <div className="col-sm-12">
                  <br />

                  <div className="row">
                    <div className="col-sm-2 label-item">Userid:</div>
                    <div className="col-sm-3">
                      <Form.Control
                        type="text"
                        className="form-control-account custom-input"
                        placeholder="Code"
                        name="AccountCodeform"
                        value={formData.AccountCodeform}
                        onChange={(e) =>
                          handleInputChangefetchdata({
                            target: {
                              value: e.target.value.toLowerCase(),
                            },
                          })
                        }
                        style={{
                          fontSize: "15px",
                          padding: "10px",
                          textAlign: "left",
                          borderRadius: "8px",
                        }}
                        onKeyDown={(e) => {
                          if (e.key === "Enter") {
                            handleBlurRVC();
                            handleEnterKeyPress(Description, e);
                            const upperCaseValue = e.target.value.toUpperCase();

                            if (dataa && dataa.length > 0) {
                              const selectedItem = dataa.find(
                                (item) => item.tusrid === upperCaseValue
                              );

                              if (selectedItem) {
                                console.log("selectedItem:", selectedItem);
                                handleEnterKeyPress(Description, e);
                              } else if (upperCaseValue.length < 10) {
                                // setAlertData({
                                //   type: "success",
                                //   message: "Fetch Data",
                                // });
                                // setTimeout(() => {
                                //   setAlertData(null);
                                // }, 3000);
                              } else {
                                handleEnterKeyPress(Description, e);
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
                          handleDoubleClick(e);
                          setTimeout(() => {
                            focusNextInput(SearchBox);
                          }, 100);
                        }}
                        ref={Code}
                      />
                    </div>
                    <div className="col-sm-2"></div>
                  </div>
                  <div className="row">
                    <div className="col-sm-2 label-item">Description:</div>
                    <div
                      className="col-sm-10"
                      style={{ display: "flex", gap: "10px" }}
                    >
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
                        style={{ flex: "1", marginRight: "4px" }}
                      />
                      <Form.Control
                        type="text"
                        id="UrduFormDescription"
                        placeholder="اردو میں"
                        name="UrduFormDescription"
                        className={`form-control-item ${
                          errors.Descriptionform ? "border-red" : ""
                        }`}
                        style={{
                          fontSize: "16px",
                          fontWeight: "bold",
                          flex: "1",
                          marginRight: "10px",
                          textAlign: "right",
                          fontFamily: "Noto Nastaliq Urdu",
                        }}
                        value={geturdu}
                        onFocus={(e) => e.target.select()}
                        onChange={handleInputChange}
                      />
                    </div>
                  </div>
                  <div className="row">
                    <div className="col-sm-2 label-item">Cash Code:</div>
                    <div className="col-sm-4">
                      <Form.Control
                        type="text"
                        id="inputform4"
                        placeholder="Cash Code"
                        name="inputform4"
                        className={`form-control-item ${
                          errors.inputform4 ? "border-red" : ""
                        }`}
                        style={{ textAlign: "right" }}
                        value={formData.inputform4}
                        ref={inputform4ref}
                        onFocus={(e) => e.target.select()}
                        onChange={handleInputChange}
                        onKeyDown={(e) => handleEnterKeyPress(inputform5ref, e)}
                      />
                    </div>
                    <div className="col-sm-2 label-item">Store Code:</div>
                    <div className="col-sm-4">
                      <Form.Control
                        type="text"
                        id="inputform5"
                        placeholder="Store Code"
                        name="inputform5"
                        className={`form-control-item ${
                          errors.inputform5 ? "border-red" : ""
                        }`}
                        style={{ textAlign: "right" }}
                        value={formData.inputform5}
                        ref={inputform5ref}
                        onFocus={(e) => e.target.select()}
                        onChange={handleInputChange}
                        onKeyDown={(e) => handleEnterKeyPress(inputform6ref, e)}
                      />
                    </div>
                  </div>
                  <div className="row">
                    <div className="col-sm-2 label-item">Emp Code:</div>
                    <div className="col-sm-4">
                      <Form.Control
                        type="text"
                        id="inputform6"
                        placeholder="Employee Code"
                        name="inputform6"
                        className={`form-control-item ${
                          errors.inputform6 ? "border-red" : ""
                        }`}
                        style={{ textAlign: "right" }}
                        value={formData.inputform6}
                        ref={inputform6ref}
                        onFocus={(e) => e.target.select()}
                        onChange={handleInputChange}
                        onKeyDown={(e) => handleEnterKeyPress(inputform7ref, e)}
                      />
                    </div>

                    <div className="col-sm-2 label-item">Pswd Exp:</div>
                    <div className="col-sm-4">
                      <Form.Control
                        type="text"
                        id="inputform7"
                        placeholder="Pswd Exp"
                        name="inputform7"
                        className={`form-control-item ${
                          errors.inputform7 ? "border-red" : ""
                        }`}
                        style={{ textAlign: "right" }}
                        value={formData.inputform7}
                        ref={inputform7ref}
                        onFocus={(e) => e.target.select()}
                        onChange={handleInputChange}
                        onKeyDown={(e) => handleEnterKeyPress(inputform8ref, e)}
                      />
                    </div>
                  </div>

                  <div className="row">
                    <div className="col-sm-2 label-item">Status:</div>
                    <div className="col-sm-4">
                      <Form.Control
                        as="select"
                        name="inputform8"
                        value={formData.inputform8}
                        onChange={handleInputChange}
                        className={`form-control-account ${
                          errors.Status ? "border-red" : ""
                        }`}
                        style={{
                          height: "28px",
                          fontSize: "11px",
                          padding: "0px",
                          paddingLeft: "5px",
                        }}
                        onKeyDown={(e) => handleEnterKeyPress(inputform9ref, e)}
                        ref={inputform8ref}
                      >
                        <option value="A">Active</option>
                        <option value="C">Cancell</option>
                        <option value="S">Suspend</option>
                      </Form.Control>
                    </div>

                    <div className="col-sm-2 label-item">User Type:</div>
                    <div className="col-sm-4">
                      <Form.Control
                        as="select"
                        name="inputform9"
                        value={formData.inputform9}
                        onChange={handleInputChange}
                        className={`form-control-account ${
                          errors.Status ? "border-red" : ""
                        }`}
                        style={{
                          height: "28px",
                          fontSize: "11px",
                          padding: "0px",
                          paddingLeft: "5px",
                        }}
                        onKeyDown={(e) =>
                          handleEnterKeyPress(inputform10ref, e)
                        }
                        ref={inputform9ref}
                      >
                        <option value="A">Admin</option>
                        <option value="U">User</option>
                        <option value="S">Super User</option>
                        <option value="G">Guest</option>
                      </Form.Control>
                    </div>
                  </div>
                  <div className="row">
                    <div className="col-sm-2 label-item">Mobile:</div>
                    <div className="col-sm-4">
                      <Form.Control
                        type="text"
                        id="inputform10"
                        placeholder="Mobile No"
                        name="inputform10"
                        className={`form-control-item ${
                          errors.inputform10 ? "border-red" : ""
                        }`}
                        style={{ textAlign: "left" }}
                        value={formData.inputform10}
                        ref={inputform10ref}
                        onFocus={(e) => e.target.select()}
                        onChange={handleInputChange}
                        onKeyDown={(e) =>
                          handleEnterKeyPress(inputform11ref, e)
                        }
                      />
                    </div>

                    <div className="col-sm-2 label-item">Email:</div>
                    <div className="col-sm-4">
                      <Form.Control
                        type="text"
                        id="inputform11"
                        placeholder="Email"
                        name="inputform11"
                        className={`form-control-item ${
                          errors.inputform11 ? "border-red" : ""
                        }`}
                        style={{ textAlign: "left" }}
                        value={formData.inputform11}
                        ref={inputform11ref}
                        onFocus={(e) => e.target.select()}
                        onChange={handleInputChange}
                        onKeyDown={(e) =>
                          handleEnterKeyPress(inputform12ref, e)
                        }
                      />
                    </div>
                  </div>
                  <div className="row">
                    <div className="col-sm-2 label-item">Time From:</div>
                    <div className="col-sm-4">
                      <Form.Control
                        type="time"
                        id="inputform12"
                        placeholder="Time From"
                        name="inputform12"
                        className={`form-control-item ${
                          errors.inputform12 ? "border-red" : ""
                        }`}
                        style={{ textAlign: "right" }}
                        value={formData.inputform12}
                        ref={inputform12ref}
                        onFocus={(e) => e.target.select()}
                        onChange={handleInputChange}
                        onKeyDown={(e) =>
                          handleEnterKeyPress(inputform13ref, e)
                        }
                      />
                    </div>

                    <div className="col-sm-2 label-item">Time To:</div>
                    <div className="col-sm-4">
                      <Form.Control
                        type="time"
                        id="inputform13"
                        placeholder="Time To"
                        name="inputform13"
                        className={`form-control-item ${
                          errors.inputform13 ? "border-red" : ""
                        }`}
                        style={{ textAlign: "right" }}
                        value={formData.inputform13}
                        ref={inputform13ref}
                        onFocus={(e) => e.target.select()}
                        onChange={handleInputChange}
                        onKeyDown={(e) =>
                          handleEnterKeyPress(inputform14ref, e)
                        }
                      />
                    </div>
                  </div>
                  <div className="row">
                    <div className="col-sm-2 label-item">Password:</div>
                    <div className="col-sm-4">
                      <Form.Control
                        type="text"
                        id="inputform14"
                        placeholder="Password"
                        name="inputform14"
                        className={`form-control-item ${
                          errors.inputform14 ? "border-red" : ""
                        }`}
                        style={{ textAlign: "left" }}
                        value={formData.inputform14}
                        ref={inputform14ref}
                        onFocus={(e) => e.target.select()}
                        onChange={handleInputChange}
                        onKeyDown={(e) => handleEnterKeyPress(Submit, e)}
                      />
                    </div>
                    <div className="col-sm-2"></div>
                  </div>
                </div>
              </div>
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
            <GeneralTwoFieldsModal
              isOpen={isModalOpen}
              handleClose={handleCloseModal}
              title="Select User"
              technicians={dataa}
              searchRef={SearchBox}
              handleRowClick={handleRowClick}
              firstColKey="tusrid"
              secondColKey="tusrnam"
            />
          </div>
        </div>
      </div>
    </>
  );
}

export default AddUser1;
