import { Form } from "react-bootstrap";
import Alert from "@mui/material/Alert";
import Header from "../../MainComponent/Header/Header";
import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import "./Item_Maintenance.css";
import Footer from "../../MainComponent/Footer/Footer";
import NavComponent from "../../MainComponent/Navform/navbarform";
import ButtonGroupp from "../../MainComponent/Button/ButtonGroup/ButtonGroup";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import StatusSelect from "../../MainComponent/StatusSelected/StatusSelected";
import { isLoggedIn, getUserData } from "../../Auth";
import GeneralTwoFieldsModal from "./Item_Maintenance_Modal";
import CustomDropdown from "../../MainComponent/Dropdown/Dropdown";
import { newCompanyData, getcompanyData } from "./Item_Maintenance_Api";
import { useMutation } from "@tanstack/react-query";

function Item_Maintenance() {
  const user = getUserData();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isLoggedIn()) {
      // If user is not logged in, redirect to login page
      navigate("/login");
    }
  }, [navigate]);
  const formatAmount = (value) => {
    let cleanedValue = value.replace(/[^0-9.]/g, "");
    let num = parseFloat(cleanedValue);
    if (isNaN(num)) {
      return value;
    }
    return num.toLocaleString();
  };
  const removeCommas = (value) => {
    if (typeof value !== "string") {
      value = String(value);
    }
    return value.replace(/,/g, "");
  };
  const queryClient = useQueryClient();

  const [formData, setFormData] = useState({
    AccountCodeform: "",
    Descriptionform: "",
    UrduFormDescription: "",

    UOM: "",
    Status: "",
    inputform4: "",
    inputform5: "",
    inputform6: "",
    inputform7: 0.0,
    inputform8: 0.0,
    inputform9: 0.0,
    inputform10: "",
    // inputform11: "",
    // inputform12: "",
  });
  const [dataa, setDataa] = useState([]);

  const mutation2 = useMutation({
    mutationFn: getcompanyData,
    onSuccess: (data) => {
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
    if (Code.current) {
      Code.current.focus();
    }
  }, []);

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
  const UOMRef = useRef(null);
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

  const [errors, setErrors] = useState({});

  const [selectedCompany, setSelectedCompany] = useState(null);
  const [companyurdu, setCompanyurdu] = useState("");
  const handleCompanyChange = (selectedOption) => {
    setSelectedCompany(selectedOption);
    handlePrediction(selectedOption.label).then((result) => {
      setCompanyurdu(result);
    });
    console.log("Selected technician:", selectedOption);
  };
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [categoryurdu, setCategoryurdu] = useState("");
  const handleCategoryChange = (selectedOption) => {
    setSelectedCategory(selectedOption);
    handlePrediction(selectedOption.label).then((result) => {
      setCategoryurdu(result);
    });
    console.log("Selected technician:", selectedOption);
  };
  const [selectedImage1, setSelectedImage1] = useState(null);

  const handleImageChange1 = (event) => {
    const file = event.target.files[0];
    if (file) {
      setSelectedImage1(file);
      const imgElement = document.getElementById("pic1-preview");
      imgElement.src = URL.createObjectURL(file);
    }
  };
  const [selectedImage2, setSelectedImage2] = useState(null);

  const handleImageChange2 = (event) => {
    const file = event.target.files[0];
    if (file) {
      setSelectedImage2(file);
      const imgElement = document.getElementById("pic2-preview");
      imgElement.src = URL.createObjectURL(file);
    }
  };
  const [selectedImage3, setSelectedImage3] = useState(null);

  const handleImageChange3 = (event) => {
    const file = event.target.files[0];
    if (file) {
      setSelectedImage3(file);
      const imgElement = document.getElementById("pic3-preview");
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
      {
        value: formData?.inputform4 || selectedCompany?.value,
        message: "Please select a Company",
      },
      {
        value: formData?.inputform5 || selectedCategory?.value,
        message: "Please select a Category",
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
      formDataa.append(
        "company",
        selectedCompany?.value || formData.inputform4 || ""
      );
      formDataa.append(
        "category",
        selectedCategory?.value || formData.inputform5 || ""
      );
      formDataa.append("webindex", formData.inputform6);
      formDataa.append("purchase", formData.inputform7);
      formDataa.append("sale", formData.inputform8);
      formDataa.append("discount", formData.inputform9);
      formDataa.append("FCmpRem", formData.inputform10);
      formDataa.append("pic1", selectedImage1);
      formDataa.append("pic2", selectedImage2);
      formDataa.append("pic3", selectedImage3);
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
  const [textdata, settextdata] = useState(" Item Maintenance");

  const handleCloseModal = () => {
    setData({ columns: [], rows: [] });
    setSearchText("");
    setHighlightedRowIndex(0);
    settextdata("Update Item Maintenance");

    setModalOpen(false);
  };

  const handleDoubleClick = (e) => {
    focusNextInput(Code);
    console.log("====== handle double click=======");
    // setSearchText(e.target.value);
    setModalOpen(true);
  };

  // const { dataa, error, isLoading } = useQuery("chartOfAccounts", fetchData);

  const fetchDataAndDisplayy = async () => {};
  useEffect(() => {
    fetchDataAndDisplayy();
  }, []);

  function formatToThreeDigits(number) {
    // Convert the number to a string and pad with leading zeros if necessary
    return number.toString().padStart(3, "0");
  }
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
          inputform6: selectedItem.tphnnum,
          inputform7: selectedItem.tmobnum,
          inputform8: selectedItem.temladd,
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
          inputform6: "",
          inputform7: "",
          inputform8: "",
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
    let formattedValue = value.toUpperCase(); // Trim and convert to uppercase
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
          inputform6: selectedItem.tphnnum,
          inputform7: selectedItem.tmobnum,
          inputform8: selectedItem.temladd,
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
          inputform6: "",
          inputform7: "",
          inputform8: "",
          //   inputform9: "",
          //   inputform10: "",
          //   inputform11: "",
          //   inputform12: "",
        });
        const imgElement = document.getElementById("pic-preview");
        imgElement.src = "";
        setSelectedImage1(null);
      }
    }
    if (name === "inputform7") {
      formattedValue = formatAmount(formattedValue);
      setFormData({
        ...formData,
        inputform7: formattedValue,
      });
    }
    if (name === "inputform8") {
      formattedValue = formatAmount(formattedValue);
      setFormData({
        ...formData,
        inputform8: formattedValue,
      });
    }
    if (name === "inputform9") {
      formattedValue = formatAmount(formattedValue);
      setFormData({
        ...formData,
        inputform9: formattedValue,
      });
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
      inputform6: selectedItem.tphnnum,
      inputform7: selectedItem.tmobnum,
      inputform8: selectedItem.temladd,
    });
    handlePrediction(selectedItem.tcmpdsc).then((result) => {
      setGeturdu(result);
    });
    setSelectedImage1(selectedItem.tcmppic);
    const imgElement = document.getElementById("pic-preview");
    imgElement.src = selectedItem.tcmppic;
    settextdata("Update Item Maintenance");

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
      inputform6: "",
      inputform7: "",
      inputform8: "",
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
            <div className="col-md-12 form-item-container">
              <NavComponent textdata={textdata} />

              <br />
              <Form onSubmit={handleFormSubmit}>
                <div className="row">
                  <div className="col-sm-12">
                    <br />

                    <div className="row">
                      <div className="col-sm-2 label-item">Code:</div>
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
                      <div className="col-sm-4"></div>

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
                        </Form.Group>
                      </div>
                    </div>
                    <div className="row">
                      <div
                        className="col-sm-2 label-item"
                        style={{ color: "red" }}
                      >
                        Description:
                      </div>
                      <div className="col-sm-6">
                        <Form.Control
                          type="text"
                          id="Descriptionform"
                          placeholder="Description"
                          name="Descriptionform"
                          className={`form-control-item ${
                            errors.Descriptionform ? "border-red" : ""
                          }`}
                          style={{ width: "337px" }}
                          value={formData.Descriptionform}
                          ref={Description}
                          onFocus={(e) => e.target.select()}
                          onChange={handleInputChange}
                          onKeyDown={(e) =>
                            handleEnterKeyPress(inputform4ref, e)
                          }
                        />
                      </div>
                      <div className="col-sm-4">
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
                      <div
                        className="col-sm-2 label-item"
                        style={{ color: "red" }}
                      >
                        Company:
                      </div>
                      <div className="col-sm-6">
                        <Form.Group
                          controlId="status"
                          style={{ display: "flex", alignItems: "center" }}
                        >
                          <CustomDropdown
                            value={selectedCompany}
                            onChange={handleCompanyChange}
                            fetchUrl="https://crystalsolutions.com.pk/csorder3/files/companymaintenance/GetCompany.php"
                            valueKey="tcmpcod" // Custom key for value
                            labelKey="tcmpdsc" // Custom key for label
                            placeholder="Search or select..."
                            isClearable={true}
                            selectRef={inputform4ref}
                            required
                            className={errors.inputform4}
                            width={337}
                            styles={{
                              placeholder: (base) => ({
                                ...base,
                                fontWeight: "normal",
                              }),
                            }}
                            onKeyDown={(e) =>
                              handleEnterKeyPress(inputform5ref, e)
                            }
                            postapi="https://crystalsolutions.com.pk/csorder3/files/companymaintenance/SaveCompany.php"
                            postfisrt="FCmpCod"
                            postsecond="FCmpDsc"
                            postthird="FCmpSts"
                            postfouth="FPrjId"
                          />
                        </Form.Group>
                      </div>
                      <div className="col-sm-4">
                        <Form.Control
                          type="text"
                          id="companyurdu"
                          placeholder="اردو میں"
                          name="companyurdu"
                          className={`form-control-item ${
                            errors.Descriptionform ? "border-red" : ""
                          }`}
                          style={{
                            fontSize: "16px",
                            fontWeight: "bold",
                            height: "30px",
                            marginRight: "10px",
                            textAlign: "right",
                            fontFamily: "Noto Nastaliq Urdu",
                          }}
                          value={companyurdu}
                          onFocus={(e) => e.target.select()}
                          onChange={handleInputChange}
                        />
                      </div>
                    </div>
                    <div className="row">
                      <div
                        className="col-sm-2 label-item"
                        style={{ color: "red" }}
                      >
                        Category:
                      </div>
                      <div className="col-sm-6">
                        <Form.Group
                          controlId="status"
                          style={{ display: "flex", alignItems: "center" }}
                        >
                          <CustomDropdown
                            value={selectedCategory}
                            onChange={handleCategoryChange}
                            fetchUrl="https://crystalsolutions.com.pk/csorder3/files/categorymaintenance/GetCategory.php"
                            valueKey="tctgcod"
                            labelKey="tctgdsc"
                            placeholder="Search or select..."
                            isClearable={true}
                            selectRef={inputform5ref}
                            required
                            className={errors.inputform5}
                            width={337}
                            styles={{
                              placeholder: (base) => ({
                                ...base,
                                fontWeight: "normal",
                              }),
                            }}
                            onKeyDown={(e) =>
                              handleEnterKeyPress(inputform6ref, e)
                            }
                            postapi="https://crystalsolutions.com.pk/csorder3/files/categorymaintenance/SaveCatg.php"
                            postfisrt="FCtgCod"
                            postsecond="FCtgDsc"
                            postthird="FCtgSts"
                            postfouth="FPrjId"
                          />
                        </Form.Group>
                      </div>
                      <div className="col-sm-4">
                        <Form.Control
                          type="text"
                          id="categoryurdu"
                          placeholder="اردو میں"
                          name="categoryurdu"
                          className={`form-control-item ${
                            errors.Descriptionform ? "border-red" : ""
                          }`}
                          style={{
                            fontSize: "16px",
                            fontWeight: "bold",
                            marginRight: "10px",
                            height: "30px",
                            textAlign: "right",
                            fontFamily: "Noto Nastaliq Urdu",
                          }}
                          value={categoryurdu}
                          onFocus={(e) => e.target.select()}
                          onChange={handleInputChange}
                        />
                      </div>
                    </div>
                    <div className="row">
                      <div className="col-sm-2 label-item">UOM:</div>
                      <div className="col-sm-3">
                        <Form.Control
                          as="select"
                          name="UOMRef"
                          value={formData.UOMRef}
                          onChange={handleInputChange}
                          className={`form-control-item ${
                            errors.Status ? "border-red" : ""
                          }`}
                          style={{
                            height: "28px",
                            fontSize: "11px",
                            padding: "0px",
                            paddingLeft: "5px",
                          }}
                          onKeyDown={(e) => handleEnterKeyPress(e)}
                          ref={UOMRef}
                        >
                          <option value="NOS">NOS</option>
                          <option value="KGS">KGS</option>
                          <option value="LTR">LTR</option>
                          <option value="FET">FET</option>
                          <option value="MTR">MTR</option>
                        </Form.Control>
                      </div>
                      <div className="col-sm-2"></div>
                      <div className="col-sm-2 label-item">Index:</div>
                      <div className="col-sm-3">
                        <Form.Control
                          type="text"
                          id="inputform6"
                          placeholder="Index"
                          name="inputform6"
                          className={`form-control-item ${
                            errors.inputform6 ? "border-red" : ""
                          }`}
                          style={{ textAlign: "right" }}
                          value={formData.inputform6}
                          ref={inputform6ref}
                          onFocus={(e) => e.target.select()}
                          onChange={handleInputChange}
                          onKeyDown={(e) =>
                            handleEnterKeyPress(inputform7ref, e)
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
                      <div className="col-sm-2 label-item">Purchase:</div>
                      <div className="col-sm-3" style={{ display: "flex" }}>
                        <Form.Control
                          type="text"
                          id="inputform7"
                          placeholder="Purchase Rate"
                          name="inputform7"
                          className={`form-control-item ${
                            errors.inputform7 ? "border-red" : ""
                          }`}
                          style={{ textAlign: "right" }}
                          value={formData.inputform7}
                          ref={inputform7ref}
                          onFocus={(e) => e.target.select()}
                          onChange={handleInputChange}
                          onKeyDown={(e) =>
                            handleEnterKeyPress(inputform8ref, e)
                          }
                        />
                      </div>
                      <div className="col-sm-4 label-item">Sale:</div>
                      <div className="col-sm-3" style={{ display: "flex" }}>
                        <Form.Control
                          type="text"
                          id="inputform8"
                          placeholder="Sale Rate"
                          name="inputform8"
                          className={`form-control-item ${
                            errors.inputform8 ? "border-red" : ""
                          }`}
                          style={{ textAlign: "right" }}
                          value={formData.inputform8}
                          ref={inputform8ref}
                          onFocus={(e) => e.target.select()}
                          onChange={handleInputChange}
                          onKeyDown={(e) =>
                            handleEnterKeyPress(inputform9ref, e)
                          }
                        />
                      </div>
                    </div>
                    <div className="row">
                      <div className="col-sm-2 label-item">Discount:</div>
                      <div className="col-sm-3" style={{ display: "flex" }}>
                        <Form.Control
                          type="text"
                          id="inputform9"
                          placeholder="Discount Rate"
                          name="inputform9"
                          className={`form-control-item ${
                            errors.inputform9 ? "border-red" : ""
                          }`}
                          style={{ textAlign: "right" }}
                          value={formData.inputform9}
                          ref={inputform9ref}
                          onFocus={(e) => e.target.select()}
                          onChange={handleInputChange}
                          onKeyDown={(e) =>
                            handleEnterKeyPress(inputform10ref, e)
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
                          name="inputform10"
                          onFocus={(e) => e.target.select()}
                          className="form-control-remarks"
                          value={formData.inputform10}
                          onKeyDown={(e) =>
                            handleEnterKeyPress(inputform11ref, e)
                          }
                          ref={inputform10ref}
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
                      <div className="col-2">
                        <div className="row">
                          <label style={{ display: "block" }}>
                            <div
                              style={{
                                width: "100%",
                                height: "95px",
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
                                  "#E7E7E7")
                              }
                            >
                              <img
                                id="pic1-preview"
                                src=""
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
                            ref={inputform11ref}
                            onKeyDown={(e) => handleEnterKeyPress(Submit, e)}
                          >
                            <i
                              className="fas fa-upload"
                              style={{ marginRight: "5px" }}
                            ></i>
                            Image
                          </label>
                        </div>
                      </div>
                      <div className="col-2">
                        <div className="row">
                          <label style={{ display: "block" }}>
                            <div
                              style={{
                                width: "100%",
                                height: "95px",
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
                                  "#E7E7E7")
                              }
                            >
                              <img
                                id="pic2-preview"
                                src=""
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
                        <div className="row">
                          <input
                            type="file"
                            id="pic2"
                            style={{ display: "none" }}
                            onChange={handleImageChange2}
                          />
                          <label
                            htmlFor="pic2"
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
                            // ref={inputform10ref}
                            // onKeyDown={(e) => handleEnterKeyPress(Submit, e)}
                          >
                            <i
                              className="fas fa-upload"
                              style={{ marginRight: "5px" }}
                            ></i>
                            Image
                          </label>
                        </div>
                      </div>
                      <div className="col-2">
                        <div className="row">
                          <label style={{ display: "block" }}>
                            <div
                              style={{
                                width: "100%",
                                height: "95px",
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
                                  "#E7E7E7")
                              }
                            >
                              <img
                                id="pic3-preview"
                                src=""
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
                        <div className="row">
                          <input
                            type="file"
                            id="pic3"
                            style={{ display: "none" }}
                            onChange={handleImageChange3}
                          />
                          <label
                            htmlFor="pic3"
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
                            Image
                          </label>
                        </div>
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
              <GeneralTwoFieldsModal
                isOpen={isModalOpen}
                handleClose={handleCloseModal}
                title="Select Item"
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

export default Item_Maintenance;
