import { Form } from "react-bootstrap";
import Alert from "@mui/material/Alert";
import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import "./Admin.css";
import NavComponent from "../../../MainComponent/Navform/navbarform";
import ButtonGroupp from "../../../MainComponent/Button/ButtonGroup/ButtonGroup";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import StatusSelect from "../../../MainComponent/StatusSelected/StatusSelected";
import { isLoggedIn, getUserData, getOrganisationData } from "../../../Auth";
import CustomerModal from "./CustomerModal";
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
function Customer() {
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
  const [textdata, settextdata] = useState("Customer Management");

  const handleCloseModal = () => {
    setData({ columns: [], rows: [] });
    setSearchText("");
    setHighlightedRowIndex(0);
    settextdata("Customer Management");

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
    } else if (name === "inputform7") {
      const lowercaseValue = value.toLowerCase();
      setFormData({
        ...formData,
        inputform7: lowercaseValue,
      });
    } else {
      setFormData({
        ...formData,
        [name]: formattedValue,
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

    settextdata("Customer Management");

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
    navigate("/MainPage");
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
    width: isSidebarVisible ? "calc(100vw - 55%)" : "70%",
    position: "relative",
    top: "50%",
    left: isSidebarVisible ? "50%" : "60%",
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
  useEffect(() => {
    document.documentElement.style.setProperty("--background-color", getcolor);
  }, [getcolor]);
  useEffect(() => {
    document.documentElement.style.setProperty("--font-color", fontcolor);
  }, [fontcolor]);

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
                    <div className="col-sm-2 label-customer">Code:</div>
                    <div className="col-sm-3">
                      <Form.Control
                        type="text"
                        className="form-control-customer custom-input"
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
                            handleEnterKeyPress(Status, e);
                            const upperCaseValue = e.target.value.toUpperCase();

                            if (dataa && dataa.length > 0) {
                              const selectedItem = dataa.find(
                                (item) => item.tusrid === upperCaseValue
                              );

                              if (selectedItem) {
                                console.log("selectedItem:", selectedItem);
                                handleEnterKeyPress(Status, e);
                              } else if (upperCaseValue.length < 10) {
                                // setAlertData({
                                //   type: "success",
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
                          handleDoubleClick(e);
                          setTimeout(() => {
                            focusNextInput(SearchBox);
                          }, 100);
                        }}
                        ref={Code}
                      />
                    </div>
                    <div className="col-sm-2"></div>
                    <div className="col-sm-2 label-customer">Status:</div>
                    <div className="col-sm-3">
                      <Form.Control
                        as="select"
                        name="Status"
                        value={formData.Status}
                        onChange={handleInputChange}
                        className={`form-control-customer ${
                          errors.Status ? "border-red" : ""
                        }`}
                        style={{
                          height: "28px",
                          fontSize: "11px",
                          padding: "0px",
                          paddingLeft: "5px",
                        }}
                        onKeyDown={(e) => handleEnterKeyPress(Description, e)}
                        ref={Status}
                      >
                        <option value="A">Active</option>
                        <option value="C">Cancell</option>
                        <option value="S">Suspend</option>
                      </Form.Control>
                    </div>
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
                        className={`form-control-customer ${
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
                        className={`form-control-customer ${
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
                    <div className="col-sm-2 label-customer">Address:</div>
                    <div className="col-sm-10">
                      <Form.Control
                        type="text"
                        id="inputform4"
                        placeholder="Address"
                        name="inputform4"
                        className={`form-control-customer ${
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
                    <div className="col-sm-2 label-customer">Contact NO:</div>
                    <div className="col-sm-3">
                      <Form.Control
                        type="text"
                        id="inputform5"
                        placeholder="Contact"
                        name="inputform5"
                        className={`form-control-customer ${
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
                    <div className="col-sm-2"></div>
                    <div className="col-sm-2 label-customer">Mobile:</div>
                    <div className="col-sm-3">
                      <Form.Control
                        type="text"
                        id="inputform6"
                        placeholder="Mobile"
                        name="inputform6"
                        className={`form-control-customer ${
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
                  </div>
                  <div className="row">
                    <div className="col-sm-2 label-customer">Due Date:</div>
                    <div className="col-sm-3">
                      <Form.Control
                        type="date"
                        id="inputform7"
                        placeholder="Due Date"
                        name="inputform7"
                        className={`form-control-customer ${
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
                    <div className="col-sm-1"></div>
                    <div className="col-sm-3 label-customer">Due Payment:</div>
                    <div className="col-sm-3">
                      <Form.Control
                        type="text"
                        id="inputform8"
                        placeholder="Due Payment"
                        name="inputform8"
                        className={`form-control-customer ${
                          errors.inputform8 ? "border-red" : ""
                        }`}
                        style={{ textAlign: "right" }}
                        value={formData.inputform8}
                        ref={inputform8ref}
                        onFocus={(e) => e.target.select()}
                        onChange={handleInputChange}
                        onKeyDown={(e) => handleEnterKeyPress(inputform9ref, e)}
                      />
                    </div>
                  </div>
                  <div className="row">
                    <div className="col-sm-2 label-customer">Email:</div>
                    <div className="col-sm-5">
                      <Form.Control
                        type="text"
                        id="inputform9"
                        placeholder="Email"
                        name="inputform9"
                        className={`form-control-customer ${
                          errors.inputform9 ? "border-red" : ""
                        }`}
                        style={{ textAlign: "left" }}
                        value={formData.inputform9}
                        ref={inputform9ref}
                        onFocus={(e) => e.target.select()}
                        onChange={handleInputChange}
                        onKeyDown={(e) => handleEnterKeyPress(Submit, e)}
                      />
                    </div>
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
            <CustomerModal
              isOpen={isModalOpen}
              handleClose={handleCloseModal}
              title="Select Customer"
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

export default Customer;
