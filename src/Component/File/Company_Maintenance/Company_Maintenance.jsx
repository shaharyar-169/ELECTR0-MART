import { Form } from "react-bootstrap";
import Alert from "@mui/material/Alert";
import Header from "../../MainComponent/Header/Header";
import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import "./Company_Maintenance.css";
import Footer from "../../MainComponent/Footer/Footer";
import NavComponent from "../../MainComponent/Navform/navbarform";
import ButtonGroupp from "../../MainComponent/Button/ButtonGroup/ButtonGroup";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import StatusSelect from "../../MainComponent/StatusSelected/StatusSelected";
import { isLoggedIn, getUserData } from "../../Auth";
import GeneralTwoFieldsModal from "./Company_Maintenance_Modal";
import { newCompanyData, getcompanyData } from "./Company_Maintenance_Api";
import { useMutation } from "@tanstack/react-query";
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
function Company_Maintenance() {
  const user = getUserData();
  const navigate = useNavigate();
  const imageurl = "https://crystalsolutions.com.pk/csorder3/";

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
    // inputform6: "",
    // inputform7: "",
    // inputform8: "",
    // inputform9: "",
    // inputform10: "",
    // inputform11: "",
    // inputform12: "",
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
  const mutation = useMutation({
    mutationFn: newCompanyData,
    onSuccess: (data) => {
      setFormData((prevState) => ({
        ...prevState,
        AccountCodeform: data,
      }));

      if (data.error === 200) {
      } else {
      }
    },
    onError: (error) => {
      console.error("Error:", error);
    },
  });

  const newcode = () => {
    const data = {
      FPrjId: user?.tprjid,
    };
    mutation.mutate(data);
  };
  const GetDataList = () => {
    const data = {
      FPrjId: user?.tprjid,
    };
    mutation2.mutate(data);
  };
  useEffect(() => {
    GetDataList();
    newcode();
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
      formDataa.append("FCmpCod", formData.AccountCodeform);
      formDataa.append("FCmpDsc", formData.Descriptionform);
      formDataa.append("FCmpSts", formData.Status);
      formDataa.append("FUrdDsc", geturdu);
      formDataa.append("FWebInd", formData.inputform4);
      formDataa.append("FCmpRem", formData.inputform5);
      formDataa.append(
        "pic",
        selectedImage1 && imageurl + removeParentDirectories(selectedImage1)
      );
      formDataa.append("FPrjId", user?.tprjid);

      console.log("Submitting Form Data:", formDataa);

      const response = await axios.post(
        `https://crystalsolutions.com.pk/csorder3/files/companymaintenance/SaveCompany.php`,
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
        GetDataList();
        Codefocus();
        setFormData({
          ...formData,
          Descriptionform: "",
          Status: "",
          inputform4: "",
          inputform5: "",
          // inputform6: "",
          // inputform7: "",
          // inputform8: "",
          // inputform9: "",
          // inputform10: "",
          // inputform11: "",
          // inputform12: "",
        });
        // imageblank
        const imgElement = document.getElementById("pic-preview");
        imgElement.src = "";
        setSelectedImage1(null);
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
  const [textdata, settextdata] = useState("Company Maintenance");

  const handleCloseModal = () => {
    setData({ columns: [], rows: [] });
    setSearchText("");
    setHighlightedRowIndex(0);
    settextdata("Update Company Maintenance");

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
      const selectedItem = dataa.find((item) => item.tcmpcod === value);

      console.log("Selected item:", selectedItem);

      if (selectedItem) {
        setFormData({
          ...formData,
          AccountCodeform: selectedItem.tcmpcod,
          Descriptionform: selectedItem.tcmpdsc,
          Status: selectedItem.tcmpsts,
          inputform4: selectedItem.twebind,
          inputform5: selectedItem.tcmprem,
          // inputform6: selectedItem.tphnnum,
          // inputform7: selectedItem.tmobnum,
          // inputform8: selectedItem.temladd,
        });
        handlePrediction(selectedItem.tcmpdsc).then((result) => {
          setGeturdu(result);
        });
        setSelectedImage1(selectedItem.tcmppic);
        const imgElement = document.getElementById("pic-preview");
        imgElement.src = selectedItem.tcmppic;
      } else {
        setFormData({
          ...formData,
          AccountCodeform: value,
          Descriptionform: "",
          inputform4: "",
          inputform5: "",
          // inputform6: "",
          // inputform7: "",
          // inputform8: "",
          //   inputform9: "",
          //   inputform10: "",
          //   inputform11: "",
          //   inputform12: "",
        });
        //upload image null
        const imgElement = document.getElementById("pic-preview");
        imgElement.src = "";
        setSelectedImage1(null);
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
    if (name === "UrduFormDescription") {
      console.log("Searching for:", formattedValue);
      setGeturdu(formattedValue);
    }
    if (name === "AccountCodeform") {
      console.log("Searching for:", formattedValue);

      const selectedItem = dataa.find(
        (item) => item.tctgcod === formatToThreeDigits(formattedValue)
      );

      console.log("Selected item:", selectedItem);

      if (selectedItem) {
        setFormData({
          ...formData,
          AccountCodeform: selectedItem.tcmpcod,
          Descriptionform: selectedItem.tcmpdsc,
          Status: selectedItem.tcmpsts,
          inputform4: selectedItem.twebind,
          inputform5: selectedItem.tcmprem,
          // inputform6: selectedItem.tphnnum,
          // inputform7: selectedItem.tmobnum,
          // inputform8: selectedItem.temladd,
        });
        handlePrediction(selectedItem.tcmpdsc).then((result) => {
          setGeturdu(result);
        });
        setSelectedImage1(selectedItem.tcmppic);
        const imgElement = document.getElementById("pic-preview");
        imgElement.src = selectedItem.tcmppic;
      } else {
        setFormData({
          ...formData,
          AccountCodeform: formattedValue,
          Descriptionform: "",
          inputform4: "",
          inputform5: "",
          // inputform6: "",
          // inputform7: "",
          // inputform8: "",
          //   inputform9: "",
          //   inputform10: "",
          //   inputform11: "",
          //   inputform12: "",
        });
        const imgElement = document.getElementById("pic-preview");
        imgElement.src = "";
        setSelectedImage1(null);
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
      AccountCodeform: selectedItem.tcmpcod,
      Descriptionform: selectedItem.tcmpdsc,
      Status: selectedItem.tcmpsts,
      inputform4: selectedItem.twebind,
      inputform5: selectedItem.tcmprem,
      // inputform6: selectedItem.tphnnum,
      // inputform7: selectedItem.tmobnum,
      // inputform8: selectedItem.temladd,
    });
    handlePrediction(selectedItem.tcmpdsc).then((result) => {
      setGeturdu(result);
    });
    setSelectedImage1(selectedItem.tcmppic);
    const imgElement = document.getElementById("pic-preview");
    imgElement.src = selectedItem.tcmppic;
    settextdata("Update Company Maintenance");

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
    newcode();
    setFormData({
      ...formData,
      Descriptionform: "",
      SelectedStatus: "",
      inputform4: "",
      inputform5: "",
      // inputform6: "",
      // inputform7: "",
      // inputform8: "",
      // inputform9: "",
      // inputform10: "",
      // inputform11: "",
      // inputform12: "",
    });
    const imgElement = document.getElementById("pic-preview");
    imgElement.src = "";
    setSelectedImage1(null);
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
            <div className="col-md-12 form-category-container">
              <NavComponent textdata={textdata} />

              <br />
              <Form onSubmit={handleFormSubmit}>
                <div className="row">
                  <div className="col-sm-12">
                    <br />

                    <div className="row">
                      <div className="col-sm-2 label-item">Code:</div>
                      <div className="col-sm-3">
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
                              const upperCaseValue =
                                e.target.value.toUpperCase();

                              if (dataa && dataa.length > 0) {
                                const selectedItem = dataa.find(
                                  (item) => item.tcmpcod === upperCaseValue
                                );

                                if (selectedItem) {
                                  console.log("selectedItem:", selectedItem);
                                  handleEnterKeyPress(Status, e);
                                } else if (upperCaseValue.length < 3) {
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
                      <div className="col-sm-3">
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
                        </Form.Group>
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
                          className={`form-control-item ${
                            errors.Descriptionform ? "border-red" : ""
                          }`}
                          value={formData.Descriptionform}
                          ref={Description}
                          onFocus={(e) => e.target.select()}
                          onChange={handleInputChange}
                          onKeyDown={(e) =>
                            handleEnterKeyPress(inputform4ref, e)
                          }
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
                      <div className="col-sm-2 label-item">Index:</div>
                      <div className="col-sm-3">
                        <Form.Control
                          type="text"
                          id="inputform4"
                          placeholder="Index"
                          name="inputform4"
                          className={`form-control-item ${
                            errors.inputform4 ? "border-red" : ""
                          }`}
                          style={{ textAlign: "right" }}
                          value={formData.inputform4}
                          ref={inputform4ref}
                          onFocus={(e) => e.target.select()}
                          onChange={handleInputChange}
                          onKeyDown={(e) =>
                            handleEnterKeyPress(inputform5ref, e)
                          }
                        />
                      </div>
                    </div>
                    <div className="row">
                      <div
                        className="col-sm-2 label-item"
                        style={{
                          display: "flex",
                          alignItems: "center",
                        }}
                      >
                        Remarks:
                      </div>
                      <div className="col-sm-10">
                        <Form.Control
                          as="textarea"
                          rows={4}
                          placeholder="Remarks"
                          name="inputform5"
                          onFocus={(e) => e.target.select()}
                          className="form-control-remarks"
                          value={formData.inputform5}
                          onKeyDown={(e) =>
                            handleEnterKeyPress(inputform6ref, e)
                          }
                          ref={inputform5ref}
                          style={{ width: "100%", height: "80px" }}
                          onChange={handleInputChange}
                        />
                      </div>
                    </div>
                    <div className="row">
                      <div
                        className="col-sm-2 label-item"
                        style={{
                          display: "flex",
                          alignItems: "center",
                        }}
                      >
                        Picture:
                      </div>
                      <div className="col-3">
                        <div className="row">
                          <label style={{ display: "block" }}>
                            <div
                              style={{
                                width: "110%",
                                height: "100px",
                                border: "2px dashed #ababab",
                                marginLeft: "-4%",
                                borderRadius: "0px",
                                display: "flex",
                                justifyContent: "center",
                                alignItems: "center",
                                backgroundColor: "#E7E7E7",
                                boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)",
                                transition: "background-color 0.3s ease",
                                // cursor: "pointer",
                                overflow: "hidden",
                              }}
                              onMouseEnter={(e) =>
                                (e.currentTarget.style.backgroundColor =
                                  "#f0f0f0")
                              }
                              onMouseLeave={(e) =>
                                (e.currentTarget.style.backgroundColor =
                                  "#f9f9f9")
                              }
                            >
                              <img
                                id="pic1-preview"
                                src={
                                  imageurl +
                                  removeParentDirectories(selectedImage1)
                                }
                                alt="Upload"
                                style={{
                                  width: "100px",
                                  height: "90px",
                                  display: "block",
                                }}
                              />
                            </div>
                          </label>
                        </div>
                      </div>
                      <div
                        className="col-4"
                        style={{ alignItems: "end", display: "flex" }}
                      >
                        <div className="row">
                          <input
                            type="file"
                            id="pic1"
                            style={{ display: "none" }}
                            onChange={handleImageChange1}
                          />
                          <label
                            htmlFor="pic1"
                            style={{
                              border: "1px solid #FFFFFF",
                              width: "100%",
                              marginLeft: "2px",
                              height: "25px",
                              marginTop: "2px",
                              color: "black",
                              backgroundColor: "#8ab7f7",
                              display: "flex",
                              justifyContent: "center",
                              alignItems: "center",
                              cursor: "pointer",
                            }}
                            ref={inputform6ref}
                            onKeyDown={(e) => handleEnterKeyPress(Submit, e)}
                          >
                            <i
                              className="fas fa-upload"
                              style={{ marginRight: "5px" }}
                            ></i>
                            Upload Image
                          </label>
                        </div>
                      </div>
                      <div className="col-6"></div>
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
                title="Select Company"
                technicians={dataa}
                searchRef={SearchBox}
                handleRowClick={handleRowClick}
                firstColKey="tcmpcod"
                secondColKey="tcmpdsc"
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

export default Company_Maintenance;
