import React, { useState, useEffect, useRef } from "react";
import { Container, Spinner, Nav } from "react-bootstrap";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import { useTheme } from "../../../../ThemeContext";
import { getUserData, getOrganisationData, getLocationnumber, getYearDescription } from "../../../Auth";
import NavComponent from "../../../MainComponent/Navform/navbarform";
import SingleButton from "../../../MainComponent/Button/SingleButton/SingleButton";
import "react-datepicker/dist/react-datepicker.css";
import jsPDF from "jspdf";
import ExcelJS from "exceljs";
import Select from "react-select";
import { components } from "react-select";
import { saveAs } from "file-saver";
import "react-calendar/dist/Calendar.css";
import { useSelector, useDispatch } from "react-redux";
import { fetchGetUser } from "../../../Redux/action";
import { useHotkeys } from "react-hotkeys-hook";
import "react-toastify/dist/ReactToastify.css";
import './list.css';
import './demo.css';



const itemListScrollStyle = `
  .itemlist-vscroll::-webkit-scrollbar { width: 8px; height: 4px; }
  .itemlist-vscroll::-webkit-scrollbar-track { background: transparent; }
  .itemlist-vscroll::-webkit-scrollbar-thumb {
    background-color: rgba(128,128,128,0.6);
    border-radius: 4px;
  }
  .itemlist-vscroll::-webkit-scrollbar-thumb:hover {
    background-color: rgba(128,128,128,0.85);
  }
`;

export default function ItemList() {
  const navigate = useNavigate();
  const user = getUserData();
  const organisation = getOrganisationData();
  const yeardescription = getYearDescription();
  const locationnumber = getLocationnumber();

  // ============================================================
  // REFS
  // ============================================================
  const saleSelectRef = useRef(null);
  const input1Ref = useRef(null);
  const input2Ref = useRef(null);
  const input3Ref = useRef(null);
  const input4Ref = useRef(null);
  const input5Ref = useRef(null);
  const input6Ref = useRef(null);
  const input11Ref = useRef(null);

  // Map from filter key -> ref object, used by the dynamic focus helper.
  const filterRefs = {
    Company: saleSelectRef,
    Type: input3Ref,
    Category: input1Ref,
    Design: input4Ref,
    Capacity: input2Ref,
    Status: input11Ref,
    Search: input5Ref,
  };

  // ============================================================
  // STATE
  // ============================================================
  const [Companyselectdata, setCompanyselectdata] = useState("");
  const [Companyselectdatavalue, setCompanyselectdatavalue] = useState("");
  const [GetCompany, setGetCompany] = useState([]);

  const [Capacityselectdata, setCapacityselectdata] = useState("");
  const [capacityselectdatavalue, setcapacityselectdatavalue] = useState("");
  const [tableData, setTableData] = useState([]);
  const [GetCapacity, setGetCapacity] = useState([]);

  const [Categoryselectdata, setCategoryselectdata] = useState("");
  const [categoryselectdatavalue, setcategoryselectdatavalue] = useState("");
  const [GetCategory, setGetCategory] = useState([]);

  const [Designselectdata, setDesignselectdata] = useState("");
  const [designselectdatavalue, setdesignselectdatavalue] = useState("");
  const [GetDesign, setGetDesign] = useState([]);

  const [Typeselectdata, setTypeselectdata] = useState("");
  const [typeselectdatavalue, settypeselectdatavalue] = useState("");
  const [GetType, setGetType] = useState([]);

  const [sortData, setSortData] = useState("ASC");
  const [searchQuery, setSearchQuery] = useState("");
  const [transectionType, settransectionType] = useState("");

    const [sysControl, setSysControl] = useState({
    Company: "Yes",
    Category: "Yes",
    Capacity: "Yes",
    Design: "Yes",
    Type: "Yes",
    Supplier: "Yes",
    OrderLevel: "Yes",
    OrderQnty: "Yes",
    PurchaseRate: "Yes",
    SaleManRate: "Yes",
    SaleRate: "Yes",
    RetailRate: "Yes",
    FixRate: "Yes",
    ActualRate: "Yes",
    LockRate: "Yes",
    UOM: "Yes",
    UOMQnty: "Yes",
    WebRate: "Yes",
    WebStatus: "Yes",
    PctCode: "Yes",
    TaxRate: "Yes",
    TaxStatus: "Yes",
    WebSKU: "Yes",
    TaxNature: "Yes",
    ItemNumber: "Yes",
    Remarks: "Yes",
    Picture: "Yes",
    Warranty: "Yes",
    SubCategory: "Yes",
    WebDiscountRate: "Yes",
    GroupRate: "Yes",
  });

  // ============================================================
  // FILTER KEY -> REF / SETTER MAPS
  // (declared after all useState setters exist to avoid TDZ error)
  // ============================================================
  const filterSelectRefs = {
    Company: saleSelectRef,
    Type: input3Ref,
    Category: input1Ref,
    Design: input4Ref,
    Capacity: input2Ref,
  };

  const filterValueSetters = {
    Company: setCompanyselectdata,
    Type: setTypeselectdata,
    Category: setCategoryselectdata,
    Design: setDesignselectdata,
    Capacity: setCapacityselectdata,
  };

  const isVisible = (field) => {
    const v = sysControl[field];
    // Only "No" hides the field. Anything else (including missing /
    // unexpected values) keeps the field visible, preserving the
    // original behavior.
    return v !== "No";
  };

  const {
    isSidebarVisible,
    toggleSidebar,
    getcolor,
    fontcolor,
    toggleChangeColor,
    apiLinks,
    getLocationNumber,
    getnavbarbackgroundcolor,
    getyeardescription,
    getfromdate,
    gettodate,
    getdatafontsize,
    getfontstyle,
  } = useTheme();

  useEffect(() => {
    document.documentElement.style.setProperty("--background-color", getcolor);
    document.documentElement.style.setProperty("--font-color", fontcolor);
  }, [getcolor, fontcolor]);

  const comapnyname = organisation.description;

   const FILTER_ORDER = [
    { key: "Company",  col: 0 },
    { key: "Type",     col: 1 },
    { key: "Category", col: 0 },
    { key: "Design",   col: 1 },
    { key: "Capacity", col: 0 },
    { key: "Status",   col: 1 },
    { key: "Search",   col: 1 },
  ];

  // Filters that are always visible regardless of sysControl.
  const ALWAYS_VISIBLE = new Set(["Status", "Search"]);

  const isFilterVisible = (key) =>
    ALWAYS_VISIBLE.has(key) ? true : isVisible(key);

  const columnsOfKeys = [[], []];
  FILTER_ORDER.forEach((f) => columnsOfKeys[f.col].push(f.key));

  const packedColumns = columnsOfKeys.map((colKeys) =>
    colKeys.filter((k) => isFilterVisible(k))
  );

  const rowCount = Math.max(...packedColumns.map((c) => c.length), 0);
  const gridRows = [];
  for (let r = 0; r < rowCount; r++) {
    gridRows.push(
      [packedColumns[0][r], packedColumns[1][r]].filter(Boolean)
    );
  }

  const enterOrder = gridRows.flat().filter(Boolean);

  const focusNextFilter = (currentKey) => {
    const idx = enterOrder.indexOf(currentKey);
    const nextKey = idx >= 0 ? enterOrder[idx + 1] : undefined;

    if (nextKey) {
      const nextRef = filterRefs[nextKey];
      if (nextRef && nextRef.current) {
        nextRef.current.focus();
        return;
      }
    }

   
    const selectBtn = document.getElementById("selectButton");
    if (selectBtn) {
      selectBtn.focus();
      return;
    }
    document.getElementById("submitButton")?.click();
  };

  const filterDisplayValueSetters = {
    Company: setCompanyselectdatavalue,
    Type: settypeselectdatavalue,
    Category: setcategoryselectdatavalue,
    Design: setdesignselectdatavalue,
    Capacity: setcapacityselectdatavalue,
  };

  // ============================================================
  // PER-FILTER ENTER HANDLERS
  // Har react-select filter ka apna handler — Enter par pehle
  // react-select ka committed value read karta hai, phir next
  // filter pe focus move karta hai. (ItemPriceList jaisa pattern)
  // ============================================================
  const handleCompanyKeyDown = (event) => {
    if (event.key === "Enter") {
      const selectedOption = saleSelectRef.current.state.selectValue;
      if (selectedOption && selectedOption.value) {
        setCompanyselectdata(selectedOption.value);
      }
      setTimeout(() => focusNextFilter("Company"), 0);
    }
  };

  const handleTypeKeyDown = (event) => {
    if (event.key === "Enter") {
      const selectedOption = filterSelectRefs.Type.current.state.selectValue;
      if (selectedOption && selectedOption.value) {
        setTypeselectdata(selectedOption.value);
      }
      setTimeout(() => focusNextFilter("Type"), 0);
    }
  };

  const handleCategoryKeyDown = (event) => {
    if (event.key === "Enter") {
      const selectedOption = filterSelectRefs.Category.current.state.selectValue;
      if (selectedOption && selectedOption.value) {
        setCategoryselectdata(selectedOption.value);
      }
      setTimeout(() => focusNextFilter("Category"), 0);
    }
  };

  const handleDesignKeyDown = (event) => {
    if (event.key === "Enter") {
      const selectedOption = filterSelectRefs.Design.current.state.selectValue;
      if (selectedOption && selectedOption.value) {
        setDesignselectdata(selectedOption.value);
      }
      setTimeout(() => focusNextFilter("Design"), 0);
    }
  };

  const handleCapacityKeyDown = (event) => {
    if (event.key === "Enter") {
      const selectedOption = filterSelectRefs.Capacity.current.state.selectValue;
      if (selectedOption && selectedOption.value) {
        setCapacityselectdata(selectedOption.value);
      }
      setTimeout(() => focusNextFilter("Capacity"), 0);
    }
  };

  // Native <select> (Status) aur <input> (Search) ke liye simple handler.
  const handlePlainKeyDown = (event, currentKey) => {
    if (event.key !== "Enter") return;
    event.preventDefault();
    focusNextFilter(currentKey);
  };

  // ============================================================
  // Fetch system control once — controls filters & columns only.
  // ============================================================
  useEffect(() => {
    const apiUrl = apiLinks + "/GetSysControl.php";
    const formData = new URLSearchParams({
      // code: organisation.code,
      code: "DEMOELEC",
      type: "ItemMaintenance",

    }).toString();

    axios
      .post(apiUrl, formData)
      .then((response) => {
        if (response.data && typeof response.data === "object") {
          setSysControl((prev) => ({
            ...prev,
            ...response.data,
          }));
        } else {
          console.warn(
            "GetSysControl response is not an object:",
            response.data
          );
        }
      })
      .catch((error) => {
        console.error("GetSysControl Error:", error);
      });
  }, []);

  // ============================================================
  // DATA FETCH
  // ============================================================
  function fetchReceivableReport() {
    const apiUrl = apiLinks + "/ItemList.php";
    setIsLoading(true);

    const formData = new URLSearchParams({
      FItmSts: transectionType,
      FCapCod: Capacityselectdata,
      FCtgCod: Categoryselectdata,
      FSchTxt: searchQuery,
      FCmpCod: Companyselectdata,
      FTypCod: Typeselectdata, 
      FDsgCod: Designselectdata,
      code: organisation.code,
      FLocCod: locationnumber || getLocationNumber,
      FYerDsc: yeardescription || getyeardescription,
      // code: "AMRELEC",
      // FLocCod: "001",
      // FYerDsc: "2025-2025",
    }).toString();

    axios
      .post(apiUrl, formData)
      .then((response) => {
        setIsLoading(false);

        if (response.data && Array.isArray(response.data)) {
          const transformedData = response.data.map((item) => ({
            Code: item.Code,
            Description: item.Description,
            Company: item.Company,
            Category: item.Category,
            Capacity: item.Capacity,
            Type: item.Type,
            Design: item.Design,
            UOM: item.UOM,
            Purchase: item.Purchase,
            Sale: item.Sale,
            Status:
              item.Status === "N"
                ? "N"
                : item.Status === "A"
                  ? "A"
                  : item.Status,
          }));

          setTableData(transformedData);

          const newColumns = {
            Code: transformedData.map((item) => item.Code),
            Description: transformedData.map((item) => item.Description),
            Company: transformedData.map((item) => item.Company),
            Category: transformedData.map((item) => item.Category),
            Capacity: transformedData.map((item) => item.Capacity),
            Type: transformedData.map((item) => item.Type),
            Design: transformedData.map((item) => item.Design),
            UOM: transformedData.map((item) => item.UOM),
            Purchase: transformedData.map((item) => item.Purchase),
            Sale: transformedData.map((item) => item.Sale),
            Status: transformedData.map((item) => item.Status),
          };
          setColumns(newColumns);
        } else {
          setTableData([]);
          setColumns({
            Code: [],
            Description: [],
            Company: [],
            Category: [],
            Capacity: [],
            Type: [],
            Design: [],
            UOM: [],
            Purchase: [],
            Sale: [],
            Status: [],
          });
        }
      })
      .catch((error) => {
        console.error("Error:", error);
        setIsLoading(false);
      });
  }

  useEffect(() => {
    const hasComponentMountedPreviously =
      sessionStorage.getItem("componentMounted");
    if (
      !hasComponentMountedPreviously ||
      (saleSelectRef && saleSelectRef.current)
    ) {
      if (saleSelectRef && saleSelectRef.current) {
        setTimeout(() => {
          saleSelectRef.current.focus();
        }, 0);
      }
      sessionStorage.setItem("componentMounted", "true");
    }
  }, []);

  const handleTransactionTypeChange = (event) => {
    const selectedTransactionType = event.target.value;
    settransectionType(selectedTransactionType);
  };

  // ============================================================
  // LOOKUPS
  // ============================================================
  useEffect(() => {
    const apiUrl = apiLinks + "/GetCompany.php";
    const formData = new URLSearchParams({
      code: organisation.code,
    }).toString();
    axios
      .post(apiUrl, formData)
      .then((response) => {
        if (response.data && Array.isArray(response.data)) {
          setGetCompany(response.data);
        } else {
          console.warn(
            "Response data structure is not as expected:",
            response.data
          );
          setGetCompany([]);
        }
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  }, []);

  const options = GetCompany.map((item) => ({
    value: item.tcmpcod,
    label: `${item.tcmpcod}-${item.tcmpdsc.trim()}`,
  }));

  useEffect(() => {
    const apiUrl = apiLinks + "/GetCapacity.php";
    const formData = new URLSearchParams({
      code: organisation.code,
    }).toString();
    axios
      .post(apiUrl, formData)
      .then((response) => {
        if (response.data && Array.isArray(response.data)) {
          setGetCapacity(response.data);
        } else {
          console.warn(
            "Response data structure is not as expected:",
            response.data
          );
          setGetCapacity([]);
        }
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  }, []);

  const capacityoptions = GetCapacity.map((item) => ({
    value: item.tcapcod,
    label: `${item.tcapcod}-${item.tcapdsc.trim()}`,
  }));

  useEffect(() => {
    const apiUrl = apiLinks + "/GetCatg.php";
    const formData = new URLSearchParams({
      code: organisation.code,
    }).toString();
    axios
      .post(apiUrl, formData)
      .then((response) => {
        if (response.data && Array.isArray(response.data)) {
          setGetCategory(response.data);
        } else {
          console.warn(
            "Response data structure is not as expected:",
            response.data
          );
          setGetCategory([]);
        }
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  }, []);

  const categoryoptions = GetCategory.map((item) => ({
    value: item.tctgcod,
    label: `${item.tctgcod}-${item.tctgdsc.trim()}`,
  }));

  useEffect(() => {
    const apiUrl = apiLinks + "/GetActiveDesign.php";
    const formData = new URLSearchParams({
      code: "AMRELEC",
    }).toString();
    axios
      .post(apiUrl, formData)
      .then((response) => {
        if (response.data && Array.isArray(response.data)) {
          setGetDesign(response.data);
        } else {
          console.warn(
            "Response data structure is not as expected:",
            response.data
          );
          setGetDesign([]);
        }
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  }, []);

  const designoptions = GetDesign.map((item) => ({
    value: item.tdsgcod,
    label: `${item.tdsgcod}-${item.tdsgdsc.trim()}`,
  }));

  useEffect(() => {
    const apiUrl = apiLinks + "/GetType.php";
    const formData = new URLSearchParams({
      code: organisation.code,
    }).toString();
    axios
      .post(apiUrl, formData)
      .then((response) => {
        if (response.data && Array.isArray(response.data)) {
          setGetType(response.data);
        } else {
          console.warn(
            "Response data structure is not as expected:",
            response.data
          );
          setGetType([]);
        }
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  }, []);

  const typeoptions = GetType.map((item) => ({
    value: item.ttypcod,
    label: `${item.ttypcod}-${item.ttypdsc.trim()}`,
  }));

  // ============================================================
  // SELECT COMPONENTS
  // ============================================================
  const DropdownOption = (props) => {
    return (
      <components.Option {...props}>
        <div
          style={{
            fontSize: getdatafontsize,
            fontFamily: getfontstyle,
            padding: "2px 8px",
            lineHeight: "1.2",
            whiteSpace: "normal",
            wordBreak: "break-word",
            textAlign: "start",
          }}
        >
          {props.data.label}
        </div>
      </components.Option>
    );
  };

  const customStyles1 = (hasError) => ({
    control: (base, state) => ({
      ...base,
      height: "24px",
      minHeight: "unset",
      width: 300,
      fontSize: getdatafontsize,
      fontFamily: getfontstyle,
      backgroundColor: getcolor,
      color: fontcolor,
      caretColor: getcolor === "white" ? "black" : "white",
      borderRadius: 0,
      border: `1px solid ${fontcolor}`,
      transition: "border-color 0.15s ease-in-out",
      "&:hover": {
        borderColor: state.isFocused ? base.borderColor : fontcolor,
      },
      padding: "0 8px",
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      boxShadow: "none",
      "&:focus-within": {
        borderColor: "red",
        boxShadow: "0 0 0 1px red",
      },
    }),

    menu: (base) => ({
      ...base,
      marginTop: "5px",
      borderRadius: 0,
      backgroundColor: getcolor,
      border: `1px solid ${fontcolor}`,
      boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
      zIndex: 9999,
      width: "auto",
      minWidth: "100%",
    }),
    menuList: (base) => ({
      ...base,
      padding: 0,
      maxHeight: "200px",
      "&::-webkit-scrollbar": {
        width: "8px",
        height: "8px",
      },
      "&::-webkit-scrollbar-track": {
        background: getcolor,
        borderRadius: "10px",
      },
      "&::-webkit-scrollbar-thumb": {
        backgroundColor: fontcolor,
        borderRadius: "10px",
        border: `2px solid ${getcolor}`,
        "&:hover": {
          backgroundColor: "#3368B5",
        },
      },
      scrollbarWidth: "thin",
      scrollbarColor: `${fontcolor} ${getcolor}`,
    }),

    option: (base, state) => ({
      ...base,
      fontSize: getdatafontsize,
      fontFamily: getfontstyle,
      backgroundColor: state.isSelected
        ? "#3368B5"
        : state.isFocused
          ? "#3368B5"
          : getcolor,
      color: state.isSelected || state.isFocused ? "white" : fontcolor,
      whiteSpace: "normal",
      wordBreak: "break-word",
      padding: "2px 8px",
      lineHeight: "1.2",
      "&:hover": {
        backgroundColor: "#3368B5",
        color: "white",
        cursor: "pointer",
      },
      "&:active": {
        backgroundColor: "#1a66cc",
      },
      transition: "background-color 0.2s ease, color 0.2s ease",
    }),
    dropdownIndicator: (base, state) => ({
      ...base,
      padding: 0,
      marginTop: "-5px",
      fontSize: "18px",
      display: "flex",
      textAlign: "center",
      color: fontcolor,
      transition: "transform 0.2s ease",
      transform: state.selectProps.menuIsOpen
        ? "rotate(180deg)"
        : "rotate(0deg)",
      "&:hover": {
        color: "#3368B5",
      },
    }),
    indicatorSeparator: () => ({
      display: "none",
    }),
    singleValue: (base) => ({
      ...base,
      marginTop: "-5px",
      textAlign: "left",
      color: fontcolor,
      fontSize: getdatafontsize,
      fontFamily: getfontstyle,
    }),
    input: (base) => ({
      ...base,
      color: getcolor === "white" ? "black" : fontcolor,
      caretColor: getcolor === "white" ? "black" : "white",
      marginTop: "-5px",
    }),
    clearIndicator: (base) => ({
      ...base,
      marginTop: "-5px",
      padding: "0 4px",
      color: fontcolor,
      "&:hover": {
        color: "#ff4444",
      },
    }),
    placeholder: (base) => ({
      ...base,
      color: `${fontcolor}80`,
      fontSize: getdatafontsize,
      fontFamily: getfontstyle,
      marginTop: "-5px",
    }),
    noOptionsMessage: (base) => ({
      ...base,
      fontSize: getdatafontsize,
      fontFamily: getfontstyle,
      color: fontcolor,
      backgroundColor: getcolor,
    }),
    loadingMessage: (base) => ({
      ...base,
      fontSize: getdatafontsize,
      fontFamily: getfontstyle,
      color: fontcolor,
      backgroundColor: getcolor,
    }),
    multiValue: (base) => ({
      ...base,
      backgroundColor: `${fontcolor}20`,
    }),
    multiValueLabel: (base) => ({
      ...base,
      color: fontcolor,
      fontSize: getdatafontsize,
      fontFamily: getfontstyle,
    }),
    multiValueRemove: (base) => ({
      ...base,
      color: `${fontcolor}80`,
      "&:hover": {
        backgroundColor: "#ff4444",
        color: "white",
      },
    }),
  });

  // ============================================================
  // FILTER RENDERERS (dynamic — one per filter key)
  // ============================================================
  const renderFilter = (key) => {
    switch (key) {
      case "Company":
        return (
          <div
            key="Company"
            className="d-flex align-items-center"
            style={{ marginRight: "21px" }}
          >
            <div
              style={{
                marginLeft: "10px",
                width: "80px",
                display: "flex",
                justifyContent: "end",
              }}
            >
              <label htmlFor="transactionType">
                <span
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: getdatafontsize,
                    fontFamily: getfontstyle,
                    fontWeight: "bold",
                  }}
                >
                  Company :
                </span>
              </label>
            </div>

            <div style={{ marginLeft: "3px" }}>
              <Select
                className="List-select-class"
                ref={saleSelectRef}
                options={options}
                onKeyDown={(e) => handleCompanyKeyDown(e)}
                id="selectedsale"
                onChange={(selectedOption) => {
                  if (selectedOption && selectedOption.value) {
                    const labelPart = selectedOption.label.split("-")[1];
                    setCompanyselectdata(selectedOption.value);
                    setCompanyselectdatavalue({
                      value: selectedOption.value,
                      label: labelPart,
                    });
                  } else {
                    setCompanyselectdata("");
                    setCompanyselectdatavalue("");
                  }
                }}
                onInputChange={(inputValue, { action }) => {
                  if (action === "input-change") {
                    return inputValue.toUpperCase();
                  }
                  return inputValue;
                }}
                components={{ Option: DropdownOption }}
                styles={{
                  ...customStyles1(!Companyselectdata),
                  placeholder: (base) => ({
                    ...base,
                    textAlign: "left",
                    marginLeft: "0",
                    justifyContent: "flex-start",
                    color: fontcolor,
                    marginTop: "-5px",
                  }),
                }}
                isClearable
                placeholder="ALL"
              />
            </div>
          </div>
        );

      case "Type":
        return (
          <div
            key="Type"
            className="d-flex align-items-center"
            style={{ marginRight: "21px" }}
          >
            <div
              style={{
                marginLeft: "10px",
                width: "80px",
                display: "flex",
                justifyContent: "end",
              }}
            >
              <label htmlFor="transactionType">
                <span
                  style={{
                    fontSize: getdatafontsize,
                    fontFamily: getfontstyle,
                    fontWeight: "bold",
                  }}
                >
                  Type :
                </span>
              </label>
            </div>

            <div style={{ marginLeft: "3px" }}>
              <Select
                className="List-select-class "
                ref={input3Ref}
                options={typeoptions}
                onKeyDown={(e) => handleTypeKeyDown(e)}
                id="selectedsale"
                onChange={(selectedOption) => {
                  if (selectedOption && selectedOption.value) {
                    const labelPart = selectedOption.label.split("-")[1];
                    setTypeselectdata(selectedOption.value);
                    settypeselectdatavalue({
                      value: selectedOption.value,
                      label: labelPart,
                    });
                  } else {
                    setTypeselectdata("");
                    settypeselectdatavalue("");
                  }
                }}
                onInputChange={(inputValue, { action }) => {
                  if (action === "input-change") {
                    return inputValue.toUpperCase();
                  }
                  return inputValue;
                }}
                components={{ Option: DropdownOption }}
                styles={{
                  ...customStyles1(!Companyselectdata),
                  placeholder: (base) => ({
                    ...base,
                    textAlign: "left",
                    marginLeft: "0",
                    justifyContent: "flex-start",
                    color: fontcolor,
                    marginTop: "-5px",
                  }),
                }}
                isClearable
                placeholder="ALL"
              />
            </div>
          </div>
        );

      case "Category":
        return (
          <div
            key="Category"
            className="d-flex align-items-center"
            style={{ marginRight: "21px" }}
          >
            <div
              style={{
                marginLeft: "10px",
                width: "80px",
                display: "flex",
                justifyContent: "end",
              }}
            >
              <label htmlFor="transactionType">
                <span
                  style={{
                    fontSize: getdatafontsize,
                    fontFamily: getfontstyle,
                    fontWeight: "bold",
                  }}
                >
                  Category :
                </span>
              </label>
            </div>

            <div style={{ marginLeft: "3px" }}>
              <Select
                className="List-select-class "
                ref={input1Ref}
                options={categoryoptions}
                onKeyDown={(e) => handleCategoryKeyDown(e)}
                id="selectedsale"
                onChange={(selectedOption) => {
                  if (selectedOption && selectedOption.value) {
                    const labelPart = selectedOption.label.split("-")[1];
                    setCategoryselectdata(selectedOption.value);
                    setcategoryselectdatavalue({
                      value: selectedOption.value,
                      label: labelPart,
                    });
                  } else {
                    setCategoryselectdata("");
                    setcategoryselectdatavalue("");
                  }
                }}
                onInputChange={(inputValue, { action }) => {
                  if (action === "input-change") {
                    return inputValue.toUpperCase();
                  }
                  return inputValue;
                }}
                components={{ Option: DropdownOption }}
                styles={{
                  ...customStyles1(!Companyselectdata),
                  placeholder: (base) => ({
                    ...base,
                    textAlign: "left",
                    marginLeft: "0",
                    justifyContent: "flex-start",
                    color: fontcolor,
                    marginTop: "-5px",
                  }),
                }}
                isClearable
                placeholder="ALL"
              />
            </div>
          </div>
        );

      case "Design":
        return (
          <div
            key="Design"
            className="d-flex align-items-center"
            style={{ marginRight: "21px" }}
          >
            <div
              style={{
                marginLeft: "10px",
                width: "80px",
                display: "flex",
                justifyContent: "end",
              }}
            >
              <label htmlFor="transactionType">
                <span
                  style={{
                    fontSize: getdatafontsize,
                    fontFamily: getfontstyle,
                    fontWeight: "bold",
                  }}
                >
                  Design :
                </span>
              </label>
            </div>

            <div style={{ marginLeft: "3px" }}>
              <Select
                className="List-select-class "
                ref={input4Ref}
                options={designoptions}
                onKeyDown={(e) => handleDesignKeyDown(e)}
                id="selectedsaleDesign"
                onChange={(selectedOption) => {
                  if (selectedOption && selectedOption.value) {
                    const labelPart = selectedOption.label.split("-")[1];
                    setDesignselectdata(selectedOption.value);
                    setdesignselectdatavalue({
                      value: selectedOption.value,
                      label: labelPart,
                    });
                  } else {
                    setDesignselectdata("");
                    setdesignselectdatavalue("");
                  }
                }}
                onInputChange={(inputValue, { action }) => {
                  if (action === "input-change") {
                    return inputValue.toUpperCase();
                  }
                  return inputValue;
                }}
                components={{ Option: DropdownOption }}
                styles={{
                  ...customStyles1(!Companyselectdata),
                  placeholder: (base) => ({
                    ...base,
                    textAlign: "left",
                    marginLeft: "0",
                    justifyContent: "flex-start",
                    color: fontcolor,
                    marginTop: "-5px",
                  }),
                }}
                isClearable
                placeholder="ALL"
              />
            </div>
          </div>
        );

      case "Capacity":
        return (
          <div
            key="Capacity"
            className="d-flex align-items-center"
            style={{ marginRight: "21px" }}
          >
            <div
              style={{
                marginLeft: "10px",
                width: "80px",
                display: "flex",
                justifyContent: "end",
              }}
            >
              <label htmlFor="transactionType">
                <span
                  style={{
                    fontSize: getdatafontsize,
                    fontFamily: getfontstyle,
                    fontWeight: "bold",
                  }}
                >
                  Capacity :
                </span>
              </label>
            </div>

            <div style={{ marginLeft: "3px" }}>
              <Select
                className="List-select-class "
                ref={input2Ref}
                options={capacityoptions}
                onKeyDown={(e) => handleCapacityKeyDown(e)}
                id="selectedsale2"
                onChange={(selectedOption) => {
                  if (selectedOption && selectedOption.value) {
                    const labelPart = selectedOption.label.split("-")[1];
                    setCapacityselectdata(selectedOption.value);
                    setcapacityselectdatavalue({
                      value: selectedOption.value,
                      label: labelPart,
                    });
                  } else {
                    setCapacityselectdata("");
                    setcapacityselectdatavalue("");
                  }
                }}
                onInputChange={(inputValue, { action }) => {
                  if (action === "input-change") {
                    return inputValue.toUpperCase();
                  }
                  return inputValue;
                }}
                components={{ Option: DropdownOption }}
                styles={{
                  ...customStyles1(!Companyselectdata),
                  placeholder: (base) => ({
                    ...base,
                    textAlign: "left",
                    marginLeft: "0",
                    justifyContent: "flex-start",
                    color: fontcolor,
                    marginTop: "-5px",
                  }),
                }}
                isClearable
                placeholder="ALL"
              />
            </div>
          </div>
        );

      case "Status":
        return (
          <div
            key="Status"
            className="d-flex align-items-center"
            style={{ marginRight: "21px" }}
          >
            <div
              style={{
                marginLeft: "10px",
                width: "80px",
                display: "flex",
                justifyContent: "end",
              }}
            >
              <label htmlFor="transactionType">
                <span
                  style={{
                    fontSize: getdatafontsize,
                    fontFamily: getfontstyle,
                    fontWeight: "bold",
                  }}
                >
                  Status :
                </span>
              </label>
            </div>

            <div style={{ position: "relative", display: "inline-block" }}>
              <select
                ref={input11Ref}
                onKeyDown={(e) => handlePlainKeyDown(e, "Status")}
                id="submitButton"
                name="type"
                onFocus={(e) =>
                  (e.currentTarget.style.border = "4px solid red")
                }
                onBlur={(e) =>
                  (e.currentTarget.style.border = `1px solid ${fontcolor}`)
                }
                value={transectionType}
                onChange={handleTransactionTypeChange}
                style={{
                  width: "300px",
                  height: "24px",
                  marginLeft: "5px",
                  backgroundColor: getcolor,
                  border: `1px solid ${fontcolor}`,
                  fontSize: getdatafontsize,
                  fontFamily: getfontstyle,
                  color: fontcolor,
                  paddingLeft: "12px",
                }}
              >
                <option value="">All</option>
                <option value="A">Active</option>
                <option value="N">Not Active</option>
              </select>

              {transectionType !== "" && (
                <span
                  onClick={() => settransectionType("")}
                  style={{
                    position: "absolute",
                    right: "25px",
                    top: "50%",
                    transform: "translateY(-50%)",
                    cursor: "pointer",
                    fontWeight: "bold",
                    color: fontcolor,
                    userSelect: "none",
                    fontSize: "12px",
                  }}
                >
                  ✕
                </span>
              )}
            </div>
          </div>
        );

      case "Search":
        return (
          <div
            key="Search"
            id="lastDiv"
            className="d-flex align-items-center"
            style={{ marginRight: "1px" }}
          >
            <div
              style={{
                marginLeft: "10px",
                width: "80px",
                display: "flex",
                justifyContent: "end",
              }}
            >
              <label htmlFor="searchInput">
                <span
                  style={{
                    fontSize: getdatafontsize,
                    fontFamily: getfontstyle,
                    fontWeight: "bold",
                  }}
                >
                  Search :
                </span>
              </label>
            </div>

            <div
              style={{
                position: "relative",
                display: "inline-block",
                marginLeft: "3px",
              }}
            >
              <input
                ref={input5Ref}
                onKeyDown={(e) => handlePlainKeyDown(e, "Search")}
                type="text"
                id="searchInput"
                placeholder="Search"
                value={searchQuery}
                autoComplete="off"
                style={{
                  marginRight: "20px",
                  width: "300px",
                  height: "24px",
                  fontSize: getdatafontsize,
                  fontFamily: getfontstyle,
                  color: fontcolor,
                  backgroundColor: getcolor,
                  border: `1px solid ${fontcolor}`,
                  outline: "none",
                  paddingLeft: "10px",
                  paddingRight: "25px",
                }}
                onFocus={(e) =>
                  (e.currentTarget.style.border = "2px solid red")
                }
                onBlur={(e) =>
                  (e.currentTarget.style.border = `1px solid ${fontcolor}`)
                }
                onChange={(e) =>
                  setSearchQuery((e.target.value || "").toUpperCase())
                }
              />
              {searchQuery && (
                <span
                  onClick={() => setSearchQuery("")}
                  style={{
                    position: "absolute",
                    right: "30px",
                    top: "50%",
                    transform: "translateY(-50%)",
                    cursor: "pointer",
                    fontSize: "20px",
                    color: fontcolor,
                    userSelect: "none",
                  }}
                >
                  ×
                </span>
              )}
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  // ============================================================
  // PDF EXPORT
  // ============================================================
 const exportPDFHandler = () => {
    const getfontstyle = window.getfontstyle || "Helvetica";
    const doc = new jsPDF({ orientation: "landscape" });

  
    // ============================================================
    const isDesignVisible = isVisible("Design");

    // Original columns + widths (unchanged reference).
    const ORIGINAL_HEADERS = [
      "Code",
      "Description",
      "Company",
      "Category",
      "Capacity",
      "Type",
      "Design",
      "Sts",
    ];
    const ORIGINAL_WIDTHS = [40, 50, 35, 35, 35, 35, 35, 10];

    // Design column width — this is the amount we must redistribute.
    const DESIGN_INDEX = 6;
    const DESIGN_WIDTH = ORIGINAL_WIDTHS[DESIGN_INDEX]; // = 35

    // Column indices that will receive the distributed Design width.
    // (Description = 1, Company = 2, Category = 3)
    const SHRINK_TARGETS = [1, 2, 3];

    // Build the dynamic headers/widths.
    let headers;
    let columnWidths;

    if (isDesignVisible) {
      headers = [...ORIGINAL_HEADERS];
      columnWidths = [...ORIGINAL_WIDTHS];
    } else {
      // Remove the Design column from headers.
      headers = ORIGINAL_HEADERS.filter(
        (_, idx) => idx !== DESIGN_INDEX
      );

      // Start from the original widths, then remove Design's width.
      columnWidths = ORIGINAL_WIDTHS.filter(
        (_, idx) => idx !== DESIGN_INDEX
      );

      // Distribute the Design width equally among the targets.
      // Integer distribution with remainder handling so the total
      // width is preserved exactly.
      const perTarget = Math.floor(DESIGN_WIDTH / SHRINK_TARGETS.length);
      let remainder = DESIGN_WIDTH - perTarget * SHRINK_TARGETS.length;

      SHRINK_TARGETS.forEach((idx) => {
        // After removing Design, target indices shift by 1
        // for any index greater than DESIGN_INDEX. Description (1),
        // Company (2), and Category (3) are all below DESIGN_INDEX,
        // so their indices remain the same in the new array.
        const newIdx = idx > DESIGN_INDEX ? idx - 1 : idx;
        const extra = perTarget + (remainder > 0 ? 1 : 0);
        if (remainder > 0) remainder--;
        columnWidths[newIdx] = columnWidths[newIdx] + extra;
      });
    }

    // Data rows — same logic: drop Design when hidden.
    const dataRows = tableData.map((item) => {
      const full = [
        item.Code,
        item.Description,
        item.Company,
        item.Category,
        item.Capacity,
        item.Type,
        item.Design,
        item.Status,
      ];
      return isDesignVisible
        ? full
        : full.filter((_, idx) => idx !== DESIGN_INDEX);
    });

    const rows = [...dataRows];
    // Total row — pad to current column count.
    const totalRow = Array(columnWidths.length).fill("");
    totalRow[0] = dataRows.length.toLocaleString();
    rows.push(totalRow);

    const getCurrentDate = () => {
      const today = new Date();
      const dd = String(today.getDate()).padStart(2, "0");
      const mm = String(today.getMonth() + 1).padStart(2, "0");
      const yyyy = today.getFullYear();
      return `${dd}-${mm}-${yyyy}`;
    };
    const getCurrentTime = () => {
      const today = new Date();
      const hh = String(today.getHours()).padStart(2, "0");
      const mm = String(today.getMinutes()).padStart(2, "0");
      const ss = String(today.getSeconds()).padStart(2, "0");
      return `${hh}:${mm}:${ss}`;
    };
    const exportDate = getCurrentDate();
    const exportTime = getCurrentTime();

    const getTotalTableWidth = () =>
      columnWidths.reduce((acc, w) => acc + w, 0);
    const totalWidth = getTotalTableWidth();

    const pageHeight = doc.internal.pageSize.height;
    const paddingTop = 10;
    const footerReserve = 15;
    const headersStartY = 30;

    doc.setFont("verdana-regular", "normal");
    doc.setFontSize(10);

    const drawFooter = () => {
      const tableWidth = getTotalTableWidth();
      const lineX = (doc.internal.pageSize.width - tableWidth) / 2;
      const lineY = pageHeight - 10;
      doc.setLineWidth(0.3);
      doc.line(lineX, lineY, lineX + tableWidth, lineY);
      doc.setFont("verdana-regular", "normal");
      doc.setFontSize(10);
      doc.text(
        `Crystal Solution    ${exportDate}    ${exportTime}`,
        lineX + 2,
        pageHeight - 5
      );
    };

    const drawPageNumber = (pageNum, totalPages) => {
      const rightX = doc.internal.pageSize.width - 10;
      doc.setFont("verdana-regular", "normal");
      doc.setFontSize(10);
      doc.text(`Page ${pageNum} / ${totalPages}`, rightX - 25, pageHeight - 5, {
        align: "right",
      });
    };

    const addTableHeaders = (startX, startY) => {
      doc.setFont("verdana", "bold");
      doc.setFontSize(10);
      let currentX = startX;
      headers.forEach((header, idx) => {
        const cellWidth = columnWidths[idx];
        const cellHeight = 6;
        const cellX = currentX + cellWidth / 2;
        const cellY = startY + cellHeight / 2 + 1.5;
        doc.setFillColor(200, 200, 200);
        doc.rect(currentX, startY, cellWidth, cellHeight, "F");
        doc.setLineWidth(0.2);
        doc.rect(currentX, startY, cellWidth, cellHeight);
        doc.setTextColor(0);
        doc.text(header, cellX, cellY, { align: "center" });
        currentX += cellWidth;
      });
      doc.setFont("verdana-regular", "normal");
      doc.setFontSize(10);
    };

    const addTableRows = (startX, startY, startIndex, pageNum, totalPages) => {
      const lineHeight = 4;
      const tableWidth = getTotalTableWidth();
      let currentY = startY;
      let currentRowIndex = startIndex;

      // Status column index — it shifts left by 1 when Design is hidden.
      const statusColIndex = isDesignVisible
        ? 7
        : 6;

      while (currentRowIndex < rows.length) {
        const row = [...rows[currentRowIndex]];
        const isTotalRow = currentRowIndex === rows.length - 1;
        const isOddRow = currentRowIndex % 2 !== 0 && !isTotalRow;
        const isRedRow = row[0] && parseInt(row[0]) > 10000000000;
        const textColor = isRedRow ? [255, 0, 0] : [0, 0, 0];

        const splitRow = row.map((cell, idx) => {
          const text = String(cell).trim();
          const maxWidth = columnWidths[idx] - 4;
          const textWidth =
            (doc.getStringUnitWidth(text) * doc.internal.getFontSize()) /
            doc.internal.scaleFactor;
          if (textWidth <= maxWidth) return [text];
          return doc.splitTextToSize(text, maxWidth);
        });

        const maxLines = Math.max(...splitRow.map((c) => c.length));
        const rowHeight = maxLines * lineHeight + 2;

        if (currentY + rowHeight > pageHeight - footerReserve) {
          drawFooter();
          drawPageNumber(pageNum, totalPages);
          return currentRowIndex;
        }

        if (isOddRow) {
          doc.setFillColor(240);
          doc.rect(startX, currentY, tableWidth, rowHeight, "F");
        }
        doc.setDrawColor(0);

        if (isTotalRow) {
          doc.setFont("verdana", "bold");
          doc.setLineWidth(0.3);
          doc.line(startX, currentY, startX + tableWidth, currentY);
          doc.line(startX, currentY + 0.5, startX + tableWidth, currentY + 0.5);
          doc.line(
            startX,
            currentY + rowHeight,
            startX + tableWidth,
            currentY + rowHeight
          );
          doc.line(
            startX,
            currentY + rowHeight - 0.5,
            startX + tableWidth,
            currentY + rowHeight - 0.5
          );
          doc.setLineWidth(0.2);
          doc.line(startX, currentY, startX, currentY + rowHeight);
          doc.line(
            startX + tableWidth,
            currentY,
            startX + tableWidth,
            currentY + rowHeight
          );
        } else {
          doc.setLineWidth(0.2);
          doc.rect(startX, currentY, tableWidth, rowHeight);
          doc.setFont("verdana-regular", "normal");
        }

        let currentX = startX;
        splitRow.forEach((textArray, cellIndex) => {
          const cellWidth = columnWidths[cellIndex];
          doc.setTextColor(...textColor);
          doc.setFontSize(10);
          const textY =
            currentY +
            (rowHeight - textArray.length * lineHeight) / 2 +
            lineHeight -
            1;

          const isStatusColumn = cellIndex === statusColIndex;
          const isTotalFirstColumn = isTotalRow && cellIndex === 0;
          if (isStatusColumn || isTotalFirstColumn) {
            doc.text(textArray, currentX + cellWidth / 2, textY, {
              align: "center",
            });
          } else {
            doc.text(textArray, currentX + 2, textY);
          }

          if (cellIndex < splitRow.length - 1) {
            doc.line(
              currentX + cellWidth,
              currentY,
              currentX + cellWidth,
              currentY + rowHeight
            );
          }
          currentX += cellWidth;
        });

        currentY += rowHeight;
        currentRowIndex++;

        if (isTotalRow) {
          doc.setFont("verdana-regular", "normal");
        }
      }

      drawFooter();
      drawPageNumber(pageNum, totalPages);
      return rows.length;
    };

    const getSearchValue = () => (searchQuery ? searchQuery : "");
    const isSearchVisible = () => {
      const s = getSearchValue();
      return s && s.toString().trim() !== "";
    };
    const TABLE_SEARCH_OFFSET = 4;

    const computeTotalPages = () => {
      const measureDoc = new jsPDF({ orientation: "landscape" });
      measureDoc.setFont("verdana-regular", "normal");
      measureDoc.setFontSize(10);
      const measureRows = [...rows];
      const measureColumnWidths = [...columnWidths];
      const measurePageHeight = measureDoc.internal.pageSize.height;
      const measureFooterReserve = 15;
      const lineHeight = 4;

      const measureAddTableRows = (startY, startIndex) => {
        let currentY = startY;
        let currentRowIndex = startIndex;
        while (currentRowIndex < measureRows.length) {
          const row = [...measureRows[currentRowIndex]];
          const splitRow = row.map((cell, idx) => {
            const text = String(cell).trim();
            const maxWidth = measureColumnWidths[idx] - 4;
            const textWidth =
              (measureDoc.getStringUnitWidth(text) *
                measureDoc.internal.getFontSize()) /
              measureDoc.internal.scaleFactor;
            if (textWidth <= maxWidth) return [text];
            return measureDoc.splitTextToSize(text, maxWidth);
          });
          const maxLines = Math.max(...splitRow.map((c) => c.length));
          const rowHeight = maxLines * lineHeight + 2;
          if (currentY + rowHeight > measurePageHeight - measureFooterReserve) {
            return currentRowIndex;
          }
          currentY += rowHeight;
          currentRowIndex++;
        }
        return measureRows.length;
      };

      let pageCount = 0;
      let nextRowIndex = 0;
      const rowsStartY =
        headersStartY + 6 + (isSearchVisible() ? TABLE_SEARCH_OFFSET : 0);
      while (nextRowIndex < measureRows.length) {
        pageCount++;
        nextRowIndex = measureAddTableRows(rowsStartY, nextRowIndex);
        if (nextRowIndex < measureRows.length) {
          measureDoc.addPage();
        }
      }
      return pageCount;
    };

    const totalPages = computeTotalPages();

    const handlePagination = () => {
      const addTitle = (title, startY, titleFontSize = 18) => {
        doc.setFontSize(titleFontSize);
        doc.text(title, doc.internal.pageSize.width / 2, startY, {
          align: "center",
        });
      };

      let currentStartY = paddingTop;
      let nextRowIndex = 0;
      let pageNumber = 1;

      while (nextRowIndex < rows.length) {
        doc.setFont("Times New Roman", "normal");
        addTitle(comapnyname, currentStartY, 18);
        currentStartY += 5;
        doc.setFont("verdana-regular", "normal");
        addTitle("Item List", currentStartY, 12);
        currentStartY += 5;

        const labelsX = (doc.internal.pageSize.width - totalWidth) / 2;
        const labelsY = currentStartY + 0;

        const typeItem = Companyselectdatavalue.label
          ? Companyselectdatavalue.label
          : "ALL";
        const status =
          transectionType === "N"
            ? "Not Active"
            : transectionType === "A"
              ? "Active"
              : "ALL";
        const category = categoryselectdatavalue.label
          ? categoryselectdatavalue.label
          : "ALL";
        const capacitycode = capacityselectdatavalue.label
          ? capacityselectdatavalue.label
          : "ALL";
        const typecode = typeselectdatavalue.label
          ? typeselectdatavalue.label
          : "ALL";
        const designcode = designselectdatavalue.label
          ? designselectdatavalue.label
          : "ALL";

        const search = getSearchValue();
        const hasSearch = search && search.toString().trim() !== "";

        doc.setFont("verdana", "bold");
        doc.setFontSize(10);
        doc.text(`Company :`, labelsX, labelsY);
        doc.setFont("verdana-regular", "normal");
        doc.text(`${typeItem}`, labelsX + 25, labelsY);

        doc.setFont("verdana", "bold");
        doc.text(`Type :`, labelsX + 180, labelsY);
        doc.setFont("verdana-regular", "normal");
        doc.text(`${typecode}`, labelsX + 200, labelsY);

        doc.setFont("verdana", "bold");
        doc.text(`Category :`, labelsX, labelsY + 4.3);
        doc.setFont("verdana-regular", "normal");
        doc.text(`${category}`, labelsX + 25, labelsY + 4.3);

        doc.setFont("verdana", "bold");
        doc.text(`Capacity :`, labelsX, labelsY + 8.3);
        doc.setFont("verdana-regular", "normal");
        doc.text(`${capacitycode}`, labelsX + 25, labelsY + 8.3);

        // Design label/value — only shown when Design is visible.
        if (isDesignVisible) {
          doc.setFont("verdana", "bold");
          doc.text(`Design :`, labelsX + 180, labelsY + 4.3);
          doc.setFont("verdana-regular", "normal");
          doc.text(`${designcode}`, labelsX + 200, labelsY + 4.3);

          doc.setFont("verdana", "bold");
          doc.text(`Status :`, labelsX + 180, labelsY + 8.3);
          doc.setFont("verdana-regular", "normal");
          doc.text(`${status}`, labelsX + 200, labelsY + 8.3);
        } else {
          // Design hidden → Status takes Design's old slot.
          doc.setFont("verdana", "bold");
          doc.text(`Status :`, labelsX + 180, labelsY + 4.3);
          doc.setFont("verdana-regular", "normal");
          doc.text(`${status}`, labelsX + 200, labelsY + 4.3);
        }

        if (hasSearch) {
          // Search position follows Status: row 3 when Design visible,
          // row 2 when Design hidden (matching the filter reflow).
          const searchY = isDesignVisible ? labelsY + 12.6 : labelsY + 8.3;
          doc.setFont("verdana", "bold");
          doc.text(`Search :`, labelsX + 180, searchY);
          doc.setFont("verdana-regular", "normal");
          doc.text(`${search}`, labelsX + 200, searchY);
        }

        currentStartY += 16;

        const tableOffsetY = hasSearch ? TABLE_SEARCH_OFFSET : 0;

        const headersStartX = (doc.internal.pageSize.width - totalWidth) / 2;
        const tableHeadersY = headersStartY + tableOffsetY;
        addTableHeaders(headersStartX, tableHeadersY);

        const rowsStartY = tableHeadersY + 6;
        const newNextRowIndex = addTableRows(
          headersStartX,
          rowsStartY,
          nextRowIndex,
          pageNumber,
          totalPages
        );

        if (newNextRowIndex < rows.length) {
          doc.addPage();
          currentStartY = paddingTop;
          pageNumber++;
          nextRowIndex = newNextRowIndex;
        } else {
          break;
        }
      }
    };

    handlePagination();
    doc.save(`ItemList As On ${exportDate}.pdf`);
  };

  // ============================================================
  // EXCEL EXPORT
  // ============================================================
const handleDownloadCSV = async () => {
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet("Sheet1");

    // ============================================================
    // DYNAMIC COLUMNS — Design is hidden when sysControl.Design = "No".
    // Code and Description are always present. Order matches the UI:
    //   Code, Description, Company, Category, Capacity, Type,
    //   [Design], UOM, Purchase, Sale, Status
    // ============================================================
    const isDesignVisible = isVisible("Design");

    // Build the dynamic column list with their header, key, width,
    // and horizontal alignment. Design is inserted only when visible.
    const dynamicColumns = [
      { header: "Code",        key: "Code",        width: 20,  align: "left"   },
      { header: "Description", key: "Description", width: null, align: "left"  },
      { header: "Company",     key: "Company",     width: 30,  align: "left"   },
      { header: "Category",    key: "Category",    width: 30,  align: "left"   },
      { header: "Capacity",    key: "Capacity",    width: 30,  align: "left"   },
      { header: "Type",        key: "Type",        width: 30,  align: "left"   },
      ...(isDesignVisible
        ? [{ header: "Design", key: "Design", width: 30, align: "left" }]
        : []),
      { header: "UOM",         key: "UOM",         width: 10,  align: "left"   },
      { header: "Purchase",    key: "Purchase",    width: 12,  align: "right"  },
      { header: "Sale",        key: "Sale",        width: 12,  align: "right"  },
      { header: "Status",      key: "Status",      width: 10,  align: "center" },
    ];

    const numColumns = dynamicColumns.length;

    const columnAlignments = dynamicColumns.map((c) => c.align);

    const fontCompanyName = {
      name: "CustomFont" || "CustomFont",
      size: 18,
      bold: true,
    };
    const fontStoreList = {
      name: "CustomFont" || "CustomFont",
      size: 10,
      bold: false,
    };
    const fontHeader = {
      name: "CustomFont" || "CustomFont",
      size: 10,
      bold: true,
    };
    const fontTableContent = {
      name: "CustomFont" || "CustomFont",
      size: 10,
      bold: false,
    };

    worksheet.addRow([]);

    const companyRow = worksheet.addRow([comapnyname]);
    companyRow.eachCell((cell) => {
      cell.font = fontCompanyName;
      cell.alignment = { horizontal: "center" };
    });

    worksheet.getRow(companyRow.number).height = 30;
    worksheet.mergeCells(
      `A${companyRow.number}:${String.fromCharCode(64 + numColumns - 1)}${companyRow.number}`
    );

    const storeListRow = worksheet.addRow(["Item List"]);
    storeListRow.eachCell((cell) => {
      cell.font = fontStoreList;
      cell.alignment = { horizontal: "center" };
    });

    worksheet.mergeCells(
      `A${storeListRow.number}:${String.fromCharCode(64 + numColumns - 1)}${storeListRow.number}`
    );

    worksheet.addRow([]);

    const typeItem = Companyselectdatavalue.label
      ? Companyselectdatavalue.label
      : "ALL";

    const status =
      transectionType === "N"
        ? "Not Active"
        : transectionType === "A"
          ? "Active"
          : "ALL";

    const category = categoryselectdatavalue.label
      ? categoryselectdatavalue.label
      : "ALL";

    const capacitycode = capacityselectdatavalue.label
      ? capacityselectdatavalue.label
      : "ALL";

    const typecode = typeselectdatavalue.label
      ? typeselectdatavalue.label
      : "ALL";

    const designcode = designselectdatavalue.label
      ? designselectdatavalue.label
      : "ALL";

    const searchValue = searchQuery ? searchQuery : "";
    const hasSearch = searchValue && searchValue.toString().trim() !== "";

    // ------------------------------------------------------------
    // FILTER ROWS — dynamic layout matching the UI:
    //   Design = Yes:
    //     Row1: Company | Type
    //     Row2: Category | Design
    //     Row3: Capacity | Status
    //     Row4: (blank)  | Search   (ONLY if search has value)
    //   Design = No:
    //     Row1: Company | Type
    //     Row2: Category | Status
    //     Row3: Capacity | Search   (ONLY if search has value)
    //                                otherwise Capacity | (blank)
    // ------------------------------------------------------------
    const filterRow1 = worksheet.addRow([
      "Company :",
      typeItem,
      "",
      "",
      "",
      "Type :",
      typecode,
    ]);

    const filterRow2 = worksheet.addRow([
      "Category :",
      category,
      "",
      "",
      "",
      isDesignVisible ? "Design :" : "Status :",
      isDesignVisible ? designcode : status,
    ]);

    // When Design is visible → Status sits on row 3.
    // When Design is hidden → Search sits on row 3, but ONLY if a
    // search value exists. If there is no search value, the right
    // side of row 3 is left blank (no "Search :" label).
    let filterRow3 = null;
    if (isDesignVisible) {
      filterRow3 = worksheet.addRow([
        "Capacity :",
        capacitycode,
        "",
        "",
        "",
        "Status :",
        status,
      ]);
    } else if (hasSearch) {
      filterRow3 = worksheet.addRow([
        "Capacity :",
        capacitycode,
        "",
        "",
        "",
        "Search :",
        searchValue,
      ]);
    } else {
      filterRow3 = worksheet.addRow([
        "Capacity :",
        capacitycode,
        "",
        "",
        "",
        "",
        "",
      ]);
    }

    // When Design is visible, Search goes on its own row 4 — but only
    // if a search value actually exists. Otherwise no Search row at all.
    let filterRow4 = null;
    if (isDesignVisible && hasSearch) {
      filterRow4 = worksheet.addRow([
        "",
        "",
        "",
        "",
        "",
        "Search :",
        searchValue,
      ]);
    }

    const applyFilterStyle = (row) => {
      row.eachCell((cell, colIndex) => {
        cell.font = {
          name: "CustomFont" || "CustomFont",
          size: 10,
          bold: [1, 6].includes(colIndex),
        };

        if (colIndex === 1) {
          cell.alignment = { horizontal: "left", vertical: "middle" };
        } else if (colIndex === 2) {
          cell.alignment = { horizontal: "left", vertical: "middle" };
        } else if (colIndex === 6) {
          cell.alignment = { horizontal: "right", vertical: "middle" };
        } else if (colIndex === 7) {
          cell.alignment = { horizontal: "left", vertical: "middle" };
        } else {
          cell.alignment = { horizontal: "left", vertical: "middle" };
        }
      });
    };

    applyFilterStyle(filterRow1);
    applyFilterStyle(filterRow2);
    applyFilterStyle(filterRow3);
    if (filterRow4) applyFilterStyle(filterRow4);

    const headerStyle = {
      font: fontHeader,
      alignment: { horizontal: "center", vertical: "middle" },
      fill: {
        type: "pattern",
        pattern: "solid",
        fgColor: { argb: "FFC6D9F7" },
      },
      border: {
        top: { style: "thin" },
        left: { style: "thin" },
        bottom: { style: "thin" },
        right: { style: "thin" },
      },
    };

    // Dynamic header row — Design included only when visible.
    const headers = dynamicColumns.map((c) => c.header);
    const headerRow = worksheet.addRow(headers);
    headerRow.eachCell((cell) => Object.assign(cell, headerStyle));

    // Dynamic data rows — Design included only when visible.
    tableData.forEach((item, index) => {
      const rowValues = dynamicColumns.map((c) => item[c.key]);
      const row = worksheet.addRow(rowValues);

      for (let colIndex = 1; colIndex <= numColumns; colIndex++) {
        const cell = row.getCell(colIndex);

        cell.font = fontTableContent;
        cell.border = {
          top: { style: "thin" },
          left: { style: "thin" },
          bottom: { style: "thin" },
          right: { style: "thin" },
        };
        cell.alignment = {
          horizontal: columnAlignments[colIndex - 1] || "left",
          vertical: "middle",
        };

        if ((index + 1) % 2 !== 0) {
          cell.fill = {
            type: "pattern",
            pattern: "solid",
            fgColor: { argb: "FFF5F5F5" },
          };
        }
      }
    });

    worksheet.getColumn(2).eachCell({ includeEmpty: true }, (cell) => {
      if (cell.alignment) cell.alignment.wrapText = false;
      else cell.alignment = { wrapText: false };
    });

    const fontForMeasurement = "10px Calibri";
    const boldFontForMeasurement = "bold 10px Calibri";

    const getTextPixelWidth = (text, fontStyle) => {
      if (!text) return 0;
      const canvas = document.createElement("canvas");
      const context = canvas.getContext("2d");
      context.font = fontStyle;
      return context.measureText(text.toString()).width;
    };

    const pixelsToExcelWidth = (pixels) => {
      const paddingPx = 15;
      const pixelsPerUnit = 7;
      return (pixels + paddingPx) / pixelsPerUnit;
    };

    let maxPixels = getTextPixelWidth("Description", boldFontForMeasurement);
    let longestDescLength = "Description".length;

    tableData.forEach((item) => {
      const desc = item.Description ? item.Description.toString() : "";
      const w = getTextPixelWidth(desc, fontForMeasurement);
      if (w > maxPixels) maxPixels = w;
      if (desc.length > longestDescLength) longestDescLength = desc.length;
    });

    let descriptionWidth = pixelsToExcelWidth(maxPixels);
    const minExpectedWidth = longestDescLength * 0.8;
    if (descriptionWidth < minExpectedWidth) {
      descriptionWidth = longestDescLength * 1.1 + 2;
    }
    descriptionWidth = Math.max(descriptionWidth, 45);

    // Apply widths dynamically from the column definition.
    dynamicColumns.forEach((c, idx) => {
      worksheet.getColumn(idx + 1).width =
        c.key === "Description" ? descriptionWidth : c.width;
    });

    // Total row — number of columns now dynamic.
    const totalRowValues = Array(numColumns).fill("");
    totalRowValues[0] = String(formatValue(tableData.length.toLocaleString()));
    const totalRow = worksheet.addRow(totalRowValues);

    totalRow.eachCell((cell, colNumber) => {
      cell.font = { bold: true };
      cell.border = {
        top: { style: "double" },
        left: { style: "thin" },
        bottom: { style: "double" },
        right: { style: "thin" },
      };
      if (colNumber === 1) {
        cell.alignment = { horizontal: "center" };
      }
    });

    worksheet.addRow([]);

    const getCurrentTime = () => {
      const today = new Date();
      const hh = String(today.getHours()).padStart(2, "0");
      const mm = String(today.getMinutes()).padStart(2, "0");
      const ss = String(today.getSeconds()).padStart(2, "0");
      return `${hh}:${mm}:${ss}`;
    };
    const getCurrentDate = () => {
      const today = new Date();
      const day = String(today.getDate()).padStart(2, "0");
      const month = String(today.getMonth() + 1).padStart(2, "0");
      const year = today.getFullYear();
      return `${day}-${month}-${year}`;
    };
    const currentTime = getCurrentTime();
    const currentdate = getCurrentDate();
    const userid = user.tusrid;

    const dateTimeRow = worksheet.addRow([
      `DATE:   ${currentdate}  TIME:   ${currentTime}`,
    ]);
    dateTimeRow.eachCell((cell) => {
      cell.font = {
        name: "CustomFont" || "CustomFont",
        size: 10,
      };
      cell.alignment = { horizontal: "left" };
    });
    const dateTimeRow1 = worksheet.addRow([`USER ID:  ${userid}`]);
    dateTimeRow1.eachCell((cell) => {
      cell.font = {
        name: "CustomFont" || "CustomFont",
        size: 10,
      };
      cell.alignment = { horizontal: "left" };
    });

    worksheet.mergeCells(
      `A${dateTimeRow.number}:${String.fromCharCode(65 + numColumns - 1)}${dateTimeRow.number}`
    );
    worksheet.mergeCells(
      `A${dateTimeRow1.number}:${String.fromCharCode(65 + numColumns - 1)}${dateTimeRow1.number}`
    );

    const buffer = await workbook.xlsx.writeBuffer();
    const blob = new Blob([buffer], {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    });
    saveAs(blob, `ItemList As On ${currentdate}.xlsx`);
  };

  const formatValue = (val) => {
    return Number(val) === 0 ? "" : val;
  };

  // ============================================================
  // MISC
  // ============================================================
  const dispatch = useDispatch();

  const tableTopColor = "#3368B5";
  const tableHeadColor = "#3368b5";
  const secondaryColor = "white";
  const btnColor = "#3368B5";
  const textColor = "white";

  const [selectedSearch, setSelectedSearch] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { data, loading, error } = useSelector((state) => state.getuser);

  const handleSearch = (e) => {
    setSelectedSearch(e.target.value);
  };

  let totalEntries = 0;

  const isLargeScreen = window.innerWidth > 1500;

  const contentStyle = {
    width: "100%",
    maxWidth: isSidebarVisible
      ? isLargeScreen
        ? "1200px"
        : "1000px"
      : isLargeScreen
        ? "1200px"
        : "1200px",
    height: "calc(100vh - 100px)",
    position: "absolute",
    top: "70px",
    left: isSidebarVisible ? "60vw" : "53vw",
    transform: "translateX(-50%)",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    overflow: "hidden",
    textAlign: "center",
    fontSize: "15px",
    fontStyle: "normal",
    fontWeight: "400",
    lineHeight: "23px",
    fontFamily: "verdana",
    zIndex: 1,
    padding: "0 20px",
    boxSizing: "border-box",
  };

  const firstColWidth = { width: "135px" };
  const secondColWidth = { width: "360px" };
  const thirdColWidth = { width: "200px" };
  const forthColWidth = { width: "200px" };
  const forthColWidth1 = { width: "200px" };
  const forthColWidth2 = { width: "200px" };
  const forthColWidth3 = { width: "200px" };
  const seventhColWidth = { width: "40px" };
  const sixthcol = { width: "8px" };

  const [windowWidth, setWindowWidth] = useState(window.innerWidth);

  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
    };
    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  const [isFilterApplied, setIsFilterApplied] = useState(false);
  useEffect(() => {
    if (isFilterApplied || tableData.length > 0) {
      setSelectedIndex(0);
      rowRefs.current[0]?.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    } else {
      setSelectedIndex(-1);
    }
  }, [tableData, isFilterApplied]);

  let totalEnteries = 0;
  const [selectedRowId, setSelectedRowId] = useState(null);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const rowRefs = useRef([]);
  const handleRowClick = (index) => {
    setSelectedIndex(index);
  };
  useEffect(() => {
    if (selectedRowId !== null) {
      const newIndex = tableData.findIndex(
        (item) => item.tcmpcod === selectedRowId
      );
      setSelectedIndex(newIndex);
    }
  }, [tableData, selectedRowId]);
  const handleKeyDown = (e) => {
    if (selectedIndex === -1 || e.target.id === "searchInput") return;
    if (e.key === "ArrowUp") {
      e.preventDefault();
      setSelectedIndex((prevIndex) => Math.max(prevIndex - 1, 0));
      scrollToSelectedRow();
    } else if (e.key === "ArrowDown") {
      e.preventDefault();
      setSelectedIndex((prevIndex) =>
        Math.min(prevIndex + 1, tableData.length - 1)
      );
      scrollToSelectedRow();
    }
  };
  const scrollToSelectedRow = () => {
    if (selectedIndex !== -1 && rowRefs.current[selectedIndex]) {
      rowRefs.current[selectedIndex].scrollIntoView({
        behavior: "smooth",
        block: "nearest",
      });
    }
  };
  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [selectedIndex]);
  useEffect(() => {
    if (selectedIndex !== -1 && rowRefs.current[selectedIndex]) {
      rowRefs.current[selectedIndex].scrollIntoView({
        behavior: "smooth",
        block: "nearest",
      });
    }
  }, [selectedIndex]);

  const [columns, setColumns] = useState({
    Code: [],
    Description: [],
    Company: [],
    Category: [],
    Capacity: [],
    Type: [],
    Design: [],
    Status: [],
  });

  const [columnSortOrders, setColumnSortOrders] = useState({
    Code: "",
    Description: "",
    Company: "",
    Category: "",
    Capacity: "",
    Type: "",
    Design: "",
    Status: "",
  });

  useEffect(() => {
    if (tableData.length > 0) {
      const newColumns = {
        Code: tableData.map((row) => row.Code),
        Description: tableData.map((row) => row.Description),
        Company: tableData.map((row) => row.Company),
        Category: tableData.map((row) => row.Category),
        Capacity: tableData.map((row) => row.Capacity),
        Type: tableData.map((row) => row.Type),
        Design: tableData.map((row) => row.Design),
        Status: tableData.map((row) => row.Status),
      };
      setColumns(newColumns);
    }
  }, [tableData]);

  const handleSorting = (col) => {
    const currentOrder = columnSortOrders[col];
    const newOrder = currentOrder === "ASC" ? "DSC" : "ASC";

    const sortedData = [...tableData].sort((a, b) => {
      const aVal =
        a[col] !== null && a[col] !== undefined ? a[col].toString() : "";
      const bVal =
        b[col] !== null && b[col] !== undefined ? b[col].toString() : "";

      const numA = parseFloat(aVal.replace(/,/g, ""));
      const numB = parseFloat(bVal.replace(/,/g, ""));

      if (!isNaN(numA) && !isNaN(numB)) {
        return newOrder === "ASC" ? numA - numB : numB - numA;
      } else {
        return newOrder === "ASC"
          ? aVal.localeCompare(bVal)
          : bVal.localeCompare(aVal);
      }
    });

    setTableData(sortedData);

    setColumnSortOrders((prev) => ({
      ...Object.keys(prev).reduce((acc, key) => {
        acc[key] = key === col ? newOrder : null;
        return acc;
      }, {}),
    }));
  };

  const resetSorting = () => {
    setColumnSortOrders({
      Code: null,
      Description: null,
      Company: null,
      Category: null,
      Capacity: null,
      Type: null,
      Design: null,
      Status: null,
    });
  };

  // ============================================================
  // BODY RENDERING
  // ============================================================
  const renderBodyRows = () => {
    return (
      <>
        {isLoading ? (
          <>
            <tr style={{ backgroundColor: getcolor }}>
              <td colSpan="8" className="text-center">
                <Spinner animation="border" variant="primary" />
              </td>
            </tr>
            {Array.from({ length: Math.max(0, 30 - 5) }).map((_, rowIndex) => (
              <tr
                key={`blank-${rowIndex}`}
                style={{
                  backgroundColor: getcolor,
                  color: fontcolor,
                }}
              >
                {Array.from({ length: 8 }).map((_, colIndex) => (
                  <td key={`blank-${rowIndex}-${colIndex}`}>&nbsp;</td>
                ))}
              </tr>
            ))}
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
                  className={selectedIndex === i ? "selected-background" : ""}
                  style={{
                    backgroundColor: getcolor,
                    color: fontcolor,
                  }}
                >
                  <td
                    className="text-start"
                    title={item.Code}
                    style={{
                      width: "135px",
                      minWidth: "135px",
                      maxWidth: "135px",
                      whiteSpace: "nowrap",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                    }}
                  >
                    {item.Code}
                  </td>
                  <td
                    className="text-start"
                    title={item.Description}
                    style={{
                      width: "360px",
                      minWidth: "360px",
                      maxWidth: "360px",
                      whiteSpace: "nowrap",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                    }}
                  >
                    {item.Description}
                  </td>
                  {isVisible("Company") && (
                    <td
                      className="text-start"
                      title={item.Company}
                      style={{
                        width: "200px",
                        minWidth: "200px",
                        maxWidth: "200px",
                        whiteSpace: "nowrap",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                      }}
                    >
                      {item.Company}
                    </td>
                  )}
                  {isVisible("Category") && (
                    <td
                      className="text-start"
                      title={item.Category}
                      style={{
                        width: "200px",
                        minWidth: "200px",
                        maxWidth: "200px",
                        whiteSpace: "nowrap",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                      }}
                    >
                      {item.Category}
                    </td>
                  )}
                  {isVisible("Capacity") && (
                    <td
                      className="text-start"
                      title={item.Capacity}
                      style={{
                        width: "200px",
                        minWidth: "200px",
                        maxWidth: "200px",
                        whiteSpace: "nowrap",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                      }}
                    >
                      {item.Capacity}
                    </td>
                  )}
                  {isVisible("Type") && (
                    <td
                      className="text-start"
                      title={item.Type}
                      style={{
                        width: "200px",
                        minWidth: "200px",
                        maxWidth: "200px",
                        whiteSpace: "nowrap",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                      }}
                    >
                      {item.Type}
                    </td>
                  )}
                  {isVisible("Design") && (
                    <td
                      className="text-start"
                      title={item.Design}
                      style={{
                        width: "200px",
                        minWidth: "200px",
                        maxWidth: "200px",
                        whiteSpace: "nowrap",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                      }}
                    >
                      {item.Design}
                    </td>
                  )}
                  <td
                    className="text-center"
                    title={item.Status}
                    style={{
                      width: "40px",
                      minWidth: "40px",
                      maxWidth: "40px",
                      whiteSpace: "nowrap",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                    }}
                  >
                    {item.Status}
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
                {Array.from({ length: 8 }).map((_, colIndex) => (
                  <td key={`blank-${rowIndex}-${colIndex}`}>&nbsp;</td>
                ))}
              </tr>
            ))}
          </>
        )}
      </>
    );
  };

  const getIconStyle = (colKey) => {
    const order = columnSortOrders[colKey];
    return {
      transform: order === "DSC" ? "rotate(180deg)" : "rotate(0deg)",
      color: order === "ASC" || order === "DSC" ? "red" : "white",
      transition: "transform 0.3s ease, color 0.3s ease",
    };
  };

  useHotkeys(
    "alt+s",
    () => {
      fetchReceivableReport();
      resetSorting();
    },
    { preventDefault: true, enableOnFormTags: true }
  );

  useHotkeys("alt+p", exportPDFHandler, {
    preventDefault: true,
    enableOnFormTags: true,
  });
  useHotkeys("alt+e", handleDownloadCSV, {
    preventDefault: true,
    enableOnFormTags: true,
  });
  useHotkeys("alt+r", () => navigate("/MainPage"), {
    preventDefault: true,
    enableOnFormTags: true,
  });

  // Shared constants for the stacked tables
  const HEADER_ROW_HEIGHT = "24px";

  // ============================================================
  // COLUMN DEFINITION (driven by system control)
  // ============================================================
  const allColumns = [
    {
      field: "Code",
      header: "Code",
      width: "135px",
      align: "text-start",
      sortKey: "Code",
      render: (item) => item.Code,
    },
    {
      field: "Description",
      header: "Description",
      width: "360px",
      align: "text-start",
      sortKey: "Description",
      render: (item) => item.Description,
    },
    {
      field: "Company",
      header: "Company",
      width: "200px",
      align: "text-start",
      sortKey: "Company",
      render: (item) => item.Company,
    },
    {
      field: "Category",
      header: "Category",
      width: "200px",
      align: "text-start",
      sortKey: "Category",
      render: (item) => item.Category,
    },
    {
      field: "Capacity",
      header: "Capacity",
      width: "200px",
      align: "text-start",
      sortKey: "Capacity",
      render: (item) => item.Capacity,
    },
    {
      field: "Type",
      header: "Type",
      width: "200px",
      align: "text-start",
      sortKey: "Type",
      render: (item) => item.Type,
    },
    {
      field: "Design",
      header: "Design",
      width: "200px",
      align: "text-start",
      sortKey: "Design",
      render: (item) => item.Design,
    },
    {
      field: "Status",
      header: "Sts",
      width: "40px",
      align: "text-center",
      sortKey: "Status",
      render: (item) => item.Status,
    },
  ];

  const visibleColumns = allColumns.filter(
    (c) => c.field === "Code" || c.field === "Description" || isVisible(c.field)
  );

  const colWidths = visibleColumns.map((c) => c.width);

  const TABLE_TOTAL_WIDTH = colWidths.reduce(
    (sum, w) => sum + parseInt(w, 10),
    0
  );

  const tableBaseStyle = {
    borderCollapse: "collapse",
    tableLayout: "fixed",
    color: fontcolor,
    fontSize: getdatafontsize,
    fontFamily: getfontstyle,
    margin: 0,
    padding: 0,
  };

  const bodyScrollRef = useRef(null);
  const [scrollbarWidth, setScrollbarWidth] = useState(0);

  useEffect(() => {
    const measureScrollbar = () => {
      if (bodyScrollRef.current) {
        const sb =
          bodyScrollRef.current.offsetWidth - bodyScrollRef.current.clientWidth;
        setScrollbarWidth(sb);
      }
    };
    measureScrollbar();
    window.addEventListener("resize", measureScrollbar);
    return () => window.removeEventListener("resize", measureScrollbar);
  }, [tableData, isLoading, visibleColumns.length]);

  // ============================================================
  // RENDER
  // ============================================================
  return (
    <>
      <style>{itemListScrollStyle}</style>
      <div style={contentStyle}>
        <div
          style={{
            backgroundColor: getcolor,
            color: fontcolor,
            border: `1px solid ${fontcolor}`,
            borderRadius: "9px",
            width: "100%",
          }}
        >
          <NavComponent textdata="Item List" />

          {/* ============================================================ */}
          {/* DYNAMIC FILTER GRID                                            */}
          {/* Filters are packed per-column from FILTER_ORDER. Hidden        */}
          {/* filters are removed from their column and the remaining        */}
          {/* visible filters in that column shift up to fill the slot, so   */}
          {/* a hidden Design is replaced by Status, and Status's old slot   */}
          {/* is replaced by Search — no empty slots, no unnecessary gaps.   */}
          {/*                                                                */}
          {/* Design = "Yes": Company/Type, Category/Design,                */}
          {/*                 Capacity/Status, (blank)/Search               */}
          {/* Design = "No":  Company/Type, Category/Status,                */}
          {/*                 Capacity/Search                               */}
          {/*                                                                */}
          {/* Search is always right-aligned by rendering it inside a       */}
          {/* right-side wrapper. When it sits on a row by itself, a        */}
          {/* spacer div occupies the left half so Search stays on the      */}
          {/* right column, lined up under Status/Design.                   */}
          {/* ============================================================ */}
          {gridRows.map((rowKeys, rowIdx) => {
            const isSearchOnlyRow =
              rowKeys.length === 1 && rowKeys[0] === "Search";

            return (
              <div
                key={`filter-row-${rowIdx}`}
                className="row"
                style={{
                  height: "20px",
                  marginTop: "8px",
                  marginBottom: "8px",
                }}
              >
                <div
                  style={{
                    width: "100%",
                    display: "flex",
                    alignItems: "center",
                    margin: "0px",
                    padding: "0px",
                    justifyContent: "space-between",
                  }}
                >
                  {isSearchOnlyRow ? (
                    <>
                      {/* Left spacer so Search stays on the right */}
                      <div style={{ flex: "0 0 auto" }} />
                      {renderFilter("Search")}
                    </>
                  ) : (
                    rowKeys.map((key) => renderFilter(key))
                  )}
                </div>
              </div>
            );
          })}

          {/* ============================================================ */}
          {/* TABLE — header fixed, body scrolls vertically, footer fixed. */}
          {/* ============================================================ */}
          <div
            style={{
              border: `1px solid ${fontcolor}`,
              background: getcolor,
              margin: 0,
              padding: 0,
              overflow: "hidden",
            }}
          >
            <div
              className="itemlist-vscroll"
              style={{
                overflowX: "auto",
                overflowY: "hidden",
                scrollbarWidth: "thin",
                scrollbarColor: `${fontcolor} ${getcolor}`,
              }}
            >
              <div style={{ minWidth: TABLE_TOTAL_WIDTH + scrollbarWidth }}>
                {/* ---------- FIXED HEADER TABLE ---------- */}
                <div
                  style={{
                    width: TABLE_TOTAL_WIDTH + scrollbarWidth,
                    boxSizing: "border-box",
                    paddingRight: scrollbarWidth,
                  }}
                >
                  <table
                    style={{
                      ...tableBaseStyle,
                      width: TABLE_TOTAL_WIDTH,
                      marginBottom: 0,
                    }}
                  >
                    <colgroup>
                      {colWidths.map((w, i) => (
                        <col key={i} style={{ width: w }} />
                      ))}
                    </colgroup>
                    <thead
                      style={{
                        backgroundColor: getnavbarbackgroundcolor,
                        color: "white",
                        fontWeight: "bold",
                        fontSize: getdatafontsize,
                        fontFamily: getfontstyle,
                      }}
                    >
                      <tr
                        style={{
                          backgroundColor: getnavbarbackgroundcolor,
                          height: HEADER_ROW_HEIGHT,
                          margin: 0,
                          padding: 0,
                        }}
                      >
                        {visibleColumns.map((c) => (
                          <th
                            key={c.field}
                            className="border-dark"
                            style={{
                              width: c.width,
                              minWidth: c.width,
                              maxWidth: c.width,
                              cursor: "pointer",
                              backgroundColor: getnavbarbackgroundcolor,
                              padding: 0,
                              margin: 0,
                              lineHeight: 1,
                              verticalAlign: "middle",
                            }}
                            onClick={() => handleSorting(c.sortKey)}
                          >
                            {c.header}{" "}
                            <i
                              className="fa-solid fa-caret-down caretIconStyle"
                              style={getIconStyle(c.sortKey)}
                            ></i>
                          </th>
                        ))}
                      </tr>
                    </thead>
                  </table>
                </div>

                {/* ---------- SCROLLABLE BODY ---------- */}
               <div
  ref={bodyScrollRef}
  style={{
    maxHeight: isVisible("Design") ? "37vh" : "40vh",
    overflowY: "auto",
    overflowX: "hidden",
    scrollbarWidth: "thin",
    scrollbarColor: `${fontcolor} ${getcolor}`,
    margin: 0,
    padding: 0,
    width: TABLE_TOTAL_WIDTH + scrollbarWidth,
    boxSizing: "border-box",
  }}
>
                  <table
                    style={{
                      ...tableBaseStyle,
                      width: TABLE_TOTAL_WIDTH,
                      marginTop: 0,
                    }}
                  >
                    <colgroup>
                      {colWidths.map((w, i) => (
                        <col key={i} style={{ width: w }} />
                      ))}
                    </colgroup>
                    <tbody>{renderBodyRows()}</tbody>
                  </table>
                </div>

                {/* ---------- FIXED FOOTER TABLE ---------- */}
                <div
                  style={{
                    width: TABLE_TOTAL_WIDTH + scrollbarWidth,
                    boxSizing: "border-box",
                    paddingRight: scrollbarWidth,
                  }}
                >
                  <table
                    style={{
                      ...tableBaseStyle,
                      width: TABLE_TOTAL_WIDTH,
                      marginTop: 0,
                    }}
                  >
                    <colgroup>
                      {colWidths.map((w, i) => (
                        <col key={i} style={{ width: w }} />
                      ))}
                    </colgroup>
                    <tfoot
                      style={{
                        background: getcolor,
                        borderTop: `1px solid ${fontcolor}`,
                      }}
                    >
                      <tr
                        style={{
                          height: HEADER_ROW_HEIGHT,
                          color: fontcolor,
                        }}
                      >
                        {visibleColumns.map((c, idx) => (
                          <td
                            key={c.field}
                            style={{
                              width: c.width,
                              minWidth: c.width,
                              maxWidth: c.width,
                              borderRight:
                                idx < visibleColumns.length - 1
                                  ? `1px solid ${fontcolor}`
                                  : undefined,
                              background: getcolor,
                            }}
                          >
                            {idx === 0 && (
                              <span className="mobileledger_total2">
                                {formatValue(tableData.length.toLocaleString())}
                              </span>
                            )}
                          </td>
                        ))}
                      </tr>
                    </tfoot>
                  </table>
                </div>
              </div>
            </div>
          </div>

          {/* ============================================================ */}
          {/* BUTTONS                                                        */}
          {/* ============================================================ */}
          <div
            style={{
              margin: "5px",
              marginBottom: "2px",
            }}
          >
            <SingleButton
              to="/MainPage"
              text="Return"
              onFocus={(e) => (e.currentTarget.style.border = "2px solid red")}
              onBlur={(e) =>
                (e.currentTarget.style.border = `1px solid ${fontcolor}`)
              }
            />
            <SingleButton
              text="PDF"
              onClick={exportPDFHandler}
              onFocus={(e) => (e.currentTarget.style.border = "2px solid red")}
              onBlur={(e) =>
                (e.currentTarget.style.border = `1px solid ${fontcolor}`)
              }
            />
            <SingleButton
              text="Excel"
              onClick={handleDownloadCSV}
              onFocus={(e) => (e.currentTarget.style.border = "2px solid red")}
              onBlur={(e) =>
                (e.currentTarget.style.border = `1px solid ${fontcolor}`)
              }
            />
            <SingleButton
              id="selectButton"
              text="Select"
              ref={input6Ref}
              onClick={() => {
                fetchReceivableReport();
                resetSorting();
              }}
              onFocus={(e) => (e.currentTarget.style.border = "2px solid red")}
              onBlur={(e) =>
                (e.currentTarget.style.border = `1px solid ${fontcolor}`)
              }
            />
          </div>
        </div>
      </div>
    </>
  );
}

