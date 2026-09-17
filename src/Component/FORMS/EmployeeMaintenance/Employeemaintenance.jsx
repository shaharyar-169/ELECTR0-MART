import React, { useState, useEffect, useRef } from "react";
import "./Employeemaintenance.css";
import { useTheme } from "../../../ThemeContext";
import axios from "axios";
import {
  getUserData,
  getOrganisationData,
  getLocationnumber,
  getYearDescription,
} from "../../../Component/Auth";

import FormButtons from "../components/FormButton";
import InstallationCode from "../components/InstallarCode";
import SearchModal from "../components/SearchModel";

const STATUS_OPTIONS = ["Active", "Non-Active"];

function Field({ label, children, className = "" }) {
  return (
    <div className={`el-field ${className}`}>
      <span className="el-field-label">{label}</span>
      {children}
    </div>
  );
}

export default function EmployeeMaintenance() {
  const {
    isSidebarVisible,
    toggleSidebar,
    getcolor,
    fontcolor,
    toggleChangeColor,
    apiLinks,
    getLocationNumber,
    getyeardescription,
    getfromdate,
    gettodate,
    getdatafontsize,
    getfontstyle,
  } = useTheme();

  const locationnumber = getLocationnumber();
  const user = getUserData();

  const [formStore, setFormStore] = useState({
    status: "Active",
    abb: "",                       // FEmpAbb
    description: "",               // FEmpNam
    contactPerson: "",             // FEmpFth
    email: "",                     // FEmpDsg
    address: "",                   // FEmpDep
    address2: "",                  // FAdd001
    address3: "",                  // FAdd002
    expiry: "",                    // FNicExp
    phone: "",                     // FMobNum
    mobile: "",                    // FMob001
    mobile2: "",                   // FMob002
    mobile3: "",                   // (reserved)
    city: "",
    area: "",
    FAreCod: "",
    nic: "",                       // FNicNum
    jcName: "",
    jcNumber: "",
    epName: "",
    epNumber: "",
    bank: "",
    accountNumber: "",
    accountCode: "22-03-0",        // FEmpCod

    // ---- Extra fields for SaveEmployee.php ----
    emailAddress: "",              // FEmlAdd
    salary: "",                    // FEmpSal
    overTime: "",                  // FOvrTim
    cashComm: "",                  // FCshCom
    creditComm: "",                // FCrtCom
    insComm: "",                   // FInsCom

    advanceCode: "",               // FAdvCod
    advanceText: "- ADVANCE",      // FAdvDsc
    deliveryCode: "",              // FDlvCod
    deliveryText: "- DELIVERY",    // FDlvDsc

    commissionCode: "",            // FComCod
    commissionDescription: "",     // FComDsc

    reference1: "",                // FRef001
    reference2: "",                // FRef002
    reference1Name: "",
    reference2Name: "",

    dobDate: "",                   // FEmpDob
    joinDate: "",                  // FJonDat
    leaveDate: "",                 // FLevDat
    leaveRemarks: "",              // FLevRem

    remarks: "",                   // FEmpRem
    documentName: "",              // FEmpDoc
  });

  // Selected image / document (kept outside formStore — same as before)
  const [selectedImage1, setSelectedImage1] = useState("");
  const [selectedImage2, setSelectedImage2] = useState("");

  const [code, setCode] = useState("");
  const [maxCode, setMaxCode] = useState("");
  const [organisation, setOrganisation] = useState(null);
  const [selectedCityCode, setSelectedCityCode] = useState("");
  const [selectedAreaCode, setSelectedAreaCode] = useState("");
  const [cityOptions, setCityOptions] = useState([]);
  const [areaOptions, setAreaOptions] = useState([]);
  const [showDescriptionInUnlabeled, setShowDescriptionInUnlabeled] = useState(false);
  const [isInitialLoad, setIsInitialLoad] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isCoolingDown, setIsCoolingDown] = useState(false);
  const [isSearchModalOpen, setIsSearchModalOpen] = useState(false);
  const codeInputRef = useRef(null);

  // Refs for all form fields for Enter key navigation
  const statusSelectRef = useRef(null);
  const nicInputRef = useRef(null);
  const descriptionInputRef = useRef(null);
  const contactPersonInputRef = useRef(null);
  const emailInputRef = useRef(null);
  const address1InputRef = useRef(null);
  const address2InputRef = useRef(null);
  const address3InputRef = useRef(null);
  const phoneInputRef = useRef(null);
  const mobileInputRef = useRef(null);
  const citySelectRef = useRef(null);
  const areaSelectRef = useRef(null);

  const jcNameInputRef = useRef(null);
  const jcNumberInputRef = useRef(null);
  const epNameInputRef = useRef(null);
  const epNumberInputRef = useRef(null);
  const bankInputRef = useRef(null);
  const accountNumberInputRef = useRef(null);
  const accountCodeInputRef = useRef(null);
  const saveButtonRef = useRef(null);
  const abbInputRef = useRef(null);

  // Refs for the fields added below Mobile
  const dobDateRef = useRef(null);
  const joinDateRef = useRef(null);
  const leaveDateRef = useRef(null);
  const leaveRemarksRef = useRef(null);
  const creditCommRef = useRef(null);
  const cashCommRef = useRef(null);
  const salaryRef = useRef(null);
  const overTimeRef = useRef(null);
  const advanceCodeRef = useRef(null);
  const advanceTextRef = useRef(null);
  const deliveryCodeRef = useRef(null);
  const deliveryTextRef = useRef(null);
  const reference1Ref = useRef(null);
  const reference1NameRef = useRef(null);
  const reference2Ref = useRef(null);
  const reference2NameRef = useRef(null);
  const documentNameRef = useRef(null);
  const remarksRef = useRef(null);

  // ============================================================
  // Helpers
  // ============================================================
  const cleanAmount = (value) => {
    if (value === null || value === undefined || value === "") return "";
    const num = String(value).replace(/,/g, "").trim();
    const parsed = parseFloat(num);
    return isNaN(parsed) ? "" : parsed;
  };

  const formatDate = (value) => {
    if (!value) return "";
    const d = new Date(value);
    if (isNaN(d.getTime())) return value;
    const dd = String(d.getDate()).padStart(2, "0");
    const mm = String(d.getMonth() + 1).padStart(2, "0");
    const yyyy = d.getFullYear();
    return `${dd}-${mm}-${yyyy}`;
  };

  // Extract new code from any of the response shapes:
  //   ["051"]              → "051"
  //   "051"                → "051"
  //   { code: "051" }      → "051"
  //   { FIntCod: "051" }   → "051"
  //   { FEmpCod: "051" }   → "051"
  const extractNewCode = (data) => {
    if (data === null || data === undefined) return "";
    if (Array.isArray(data)) {
      if (data.length === 0) return "";
      const first = data[0];
      if (first === null || first === undefined) return "";
      if (typeof first === "object") {
        return first.code || first.FIntCod || first.FEmpCod || "";
      }
      return String(first);
    }
    if (typeof data === "string") return data;
    if (typeof data === "object") {
      return data.code || data.FIntCod || data.FEmpCod || "";
    }
    return "";
  };

  // Get organisation data
  useEffect(() => {
    const orgData = getOrganisationData();
    setOrganisation(orgData);
  }, []);

  // ------------------------------------------------------------
  // Fetch the latest Employee code on initial load (NewEmployee.php)
  // ------------------------------------------------------------
  useEffect(() => {
    if (!organisation) return;

    const apiUrl = apiLinks + "/NewEmployee.php";
    const formData = new URLSearchParams({
      // code: organisation.code,
         code: "AMRELEC",
           FLocCod: "001",

      // FLocCod: getLocationNumber || getLocationnumber(),
    }).toString();

    axios
      .post(apiUrl, formData)
      .then((response) => {
        const newCode = extractNewCode(response.data);
        if (newCode !== "" && newCode !== null && newCode !== undefined) {
          setCode(String(newCode));
          setMaxCode(String(newCode));
        }
      })
      .catch((error) => {
        console.error("Error fetching next employee code:", error);
      });
  }, [organisation, apiLinks, getLocationNumber]);

  // Auto-focus InstallationCode on initial load
  useEffect(() => {
    if (code && isInitialLoad) {
      const timer = setTimeout(() => {
        if (codeInputRef.current) {
          const input = codeInputRef.current.querySelector('input');
          if (input) {
            input.focus();
            input.select();
          }
        }
        setIsInitialLoad(false);
      }, 100);

      return () => clearTimeout(timer);
    }
  }, [code, isInitialLoad]);

  // Update accountCode whenever code changes
  useEffect(() => {
    if (code) {
      const formattedCode = `22-03-0${code}`;
      setFormStore((prev) => ({ ...prev, accountCode: formattedCode }));
    }
  }, [code]);

  // Fetch cities for the dropdown
  useEffect(() => {
    if (!organisation) return;

    const apiUrl = apiLinks + "/GetActiveCity.php";
    const formData = new URLSearchParams({
      code: organisation.code,
      FLocCod: getLocationNumber || getLocationnumber(),
    }).toString();

    axios
      .post(apiUrl, formData)
      .then((response) => {
        if (response.data && Array.isArray(response.data)) {
          setCityOptions(response.data);
        } else {
          setCityOptions([]);
        }
      })
      .catch((error) => {
        console.error("Error fetching cities:", error);
        setCityOptions([]);
      });
  }, [organisation, apiLinks, getLocationNumber]);

  // Fetch areas for the dropdown
  useEffect(() => {
    if (!organisation) return;

    const apiUrl = apiLinks + "/GetActiveArea.php";
    const formData = new URLSearchParams({
      code: organisation.code,
      FLocCod: getLocationNumber || getLocationnumber(),
    }).toString();

    axios
      .post(apiUrl, formData)
      .then((response) => {
        if (response.data && Array.isArray(response.data)) {
          setAreaOptions(response.data);
        } else {
          setAreaOptions([]);
        }
      })
      .catch((error) => {
        console.error("Error fetching areas:", error);
        setAreaOptions([]);
      });
  }, [organisation, apiLinks, getLocationNumber]);

  // Show toast notification
  const showToast = (message, type = 'success') => {
    console.log("Toast:", message);

    const toast = document.createElement('div');
    const backgroundColor = type === 'error' ? '#f44336' : '#4CAF50';
    toast.style.cssText = `
      position: fixed;
      top: 20px;
      right: 20px;
      background: ${backgroundColor};
      color: white;
      padding: 15px 25px;
      border-radius: 5px;
      z-index: 9999;
      box-shadow: 0 4px 8px rgba(0,0,0,0.2);
      font-family: Arial, sans-serif;
      font-size: 14px;
      animation: slideIn 0.3s ease-out;
    `;
    toast.textContent = message;
    document.body.appendChild(toast);

    setTimeout(() => {
      toast.style.animation = 'slideOut 0.3s ease-in';
      setTimeout(() => {
        document.body.removeChild(toast);
      }, 300);
    }, 3000);

    if (!document.getElementById('toast-styles')) {
      const style = document.createElement('style');
      style.id = 'toast-styles';
      style.textContent = `
        @keyframes slideIn {
          from { transform: translateX(100%); opacity: 0; }
          to { transform: translateX(0); opacity: 1; }
        }
        @keyframes slideOut {
          from { transform: translateX(0); opacity: 1; }
          to { transform: translateX(100%); opacity: 0; }
        }
      `;
      document.head.appendChild(style);
    }
  };

  // ==========================================================
  // Fetch employee data by Code (GetEmployee.php)
  // ==========================================================
  const fetchInstallationDataByCode = (installationCode) => {
    if (!organisation || !installationCode) {
      showToast("Data not found", 'error');
      return;
    }

    const apiUrl = apiLinks + "/GetEmployee.php";
    const formData = new URLSearchParams({
      code: organisation.code,
      FLocCod: locationnumber || getLocationNumber,
      FEmpCod: installationCode,
    }).toString();

    axios
      .post(apiUrl, formData)
      .then((response) => {
        if (response.data && response.data.length > 0) {
          const data = response.data[0];

          let cityName = data.tctycod || "";
          if (cityName && cityOptions.length > 0) {
            const matchedCity = cityOptions.find(
              (city) => String(city.tctycod).trim() === String(cityName).trim()
            );
            if (matchedCity) {
              cityName = matchedCity.tctydsc;
            }
          }

          let areaName = "";
          if (data.tarecod && areaOptions.length > 0) {
            const matchedArea = areaOptions.find(
              (area) => String(area.tarecod).trim() === String(data.tarecod).trim()
            );
            if (matchedArea) {
              areaName = matchedArea.taredsc;
            }
          }

          setFormStore((prev) => ({
            ...prev,
            status: data.tinssts || prev.status,
            abb: data.tabbdsc || prev.abb,
            description: data.tintdsc || prev.description,
            contactPerson: data.tintper || prev.contactPerson,
            email: data.temladd || prev.email,
            address: data.tadd001 || prev.address,
            address2: data.tadd002 || prev.address2,
            phone: data.tphnnum || prev.phone,
            mobile: data.tmobnum || prev.mobile,
            nic: formatNIC(data.tnicnum) || "",
            jcName: data.tjaznam || prev.jcName,
            jcNumber: data.tjaznum || prev.jcNumber,
            epName: data.tespnam || prev.epName,
            epNumber: data.tespnum || prev.epNumber,
            bank: data.tbnknam || prev.bank,
            accountNumber: data.taccnum || prev.accountNumber,
            city: cityName || prev.city,
            area: areaName || "",
            FAreCod: data.tarecod || "",
          }));

          if (data.tctycod) {
            setSelectedCityCode(data.tctycod);
          }

          if (data.tarecod) {
            setSelectedAreaCode(data.tarecod);
          }

          showToast("User data found", 'success');
        } else {
          setFormStore((prev) => ({
            ...prev,
            status: "Active",
            description: "",
            contactPerson: "",
            email: "",
            address: "",
            address2: "",
            address3: "",
            expiry: "",
            phone: "",
            mobile: "",
            city: "",
            area: "",
            FAreCod: "",
            nic: "",
            jcName: "",
            jcNumber: "",
            epName: "",
            epNumber: "",
            bank: "",
            accountNumber: "",
            accountCode: `22-03-0${code}`,
          }));

          setSelectedCityCode("");
          setSelectedAreaCode("");
          showToast("Data not found", 'error');
        }
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
        showToast("Data not found", 'error');
      });
  };

  // Format NIC with automatic hyphens
  const formatNIC = (value) => {
    const digits = String(value || "").replace(/\D/g, '');
    const limitedDigits = digits.slice(0, 13);

    if (limitedDigits.length <= 5) {
      return limitedDigits;
    } else if (limitedDigits.length <= 12) {
      return `${limitedDigits.slice(0, 5)}-${limitedDigits.slice(5)}`;
    } else {
      return `${limitedDigits.slice(0, 5)}-${limitedDigits.slice(5, 12)}-${limitedDigits.slice(12, 13)}`;
    }
  };

  const handleNicChange = (e) => {
    const rawValue = e.target.value;
    const formattedValue = formatNIC(rawValue);
    setFormStore((prev) => ({ ...prev, nic: formattedValue }));
  };

  const set = (key) => (e) => {
    const value = e.target.value;
    setFormStore((prev) => ({ ...prev, [key]: value }));
  };

  const handleInstallerSelect = (installerData) => {
    if (installerData.code) {
      setCode(installerData.code);
      fetchInstallationDataByCode(installerData.code);
    }
  };

  const handleInstallerCodeChange = (newCode) => {
    fetchInstallationDataByCode(newCode);
  };

  const handleModalClose = () => {
    setIsSearchModalOpen(false);
    setTimeout(() => {
      if (codeInputRef.current) {
        const input = codeInputRef.current.querySelector('input');
        if (input) {
          input.focus();
          input.select();
        }
      }
    }, 100);
  };

  const handleKeyDown = (e, nextRef) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      e.stopPropagation();
      if (nextRef && nextRef.current) {
        const element = nextRef.current;
        if (element.tagName === 'SELECT' || element.tagName === 'INPUT') {
          element.focus();
          if (element.tagName === 'INPUT') {
            element.select();
          }
        } else {
          const input = element.querySelector('input, select');
          if (input) {
            input.focus();
            if (input.tagName === 'INPUT') {
              input.select();
            }
          }
        }
      }
    }
  };

  const handleNicEnter = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      e.stopPropagation();
      if (descriptionInputRef.current) {
        descriptionInputRef.current.focus();
      }
    }
  };

  const resetForm = () => {
    setFormStore({
      status: "Active",
      abb: "",
      description: "",
      contactPerson: "",
      email: "",
      address: "",
      address2: "",
      address3: "",
      expiry: "",
      phone: "",
      mobile: "",
      mobile2: "",
      mobile3: "",
      city: "",
      area: "",
      FAreCod: "",
      nic: "",
      jcName: "",
      jcNumber: "",
      epName: "",
      epNumber: "",
      bank: "",
      accountNumber: "",
      accountCode: `22-03-0${code}`,

      emailAddress: "",
      salary: "",
      overTime: "",
      cashComm: "",
      creditComm: "",
      insComm: "",

      advanceCode: "",
      advanceText: "- ADVANCE",
      deliveryCode: "",
      deliveryText: "- DELIVERY",

      commissionCode: "",
      commissionDescription: "",

      reference1: "",
      reference2: "",
      reference1Name: "",
      reference2Name: "",

      dobDate: "",
      joinDate: "",
      leaveDate: "",
      leaveRemarks: "",

      remarks: "",
      documentName: "",
    });
    setSelectedCityCode("");
    setSelectedAreaCode("");
    setSelectedImage1("");
    setSelectedImage2("");

    if (organisation) {
      const apiUrl = apiLinks + "/NewEmployee.php";
      const formData = new URLSearchParams({
        code: organisation.code,
        FLocCod: getLocationNumber || getLocationnumber(),
      }).toString();

      axios
        .post(apiUrl, formData)
        .then((response) => {
          const newCode = extractNewCode(response.data);
          if (newCode !== "" && newCode !== null && newCode !== undefined) {
            setCode(String(newCode));
            setMaxCode(String(newCode));
          }
        })
        .catch((error) => {
          console.error("Error fetching next code:", error);
        });
    }
  };

  const mapStatusForApi = (status) => {
    if (status === "Active") return "A";
    if (status === "Non-Active") return "N";
    return status || "";
  };

  const resolveCityCode = () => {
    if (selectedCityCode) return selectedCityCode;

    if (formStore.city && cityOptions.length > 0) {
      const matched = cityOptions.find(
        (city) =>
          String(city.tctydsc).trim().toLowerCase() ===
          String(formStore.city).trim().toLowerCase()
      );
      if (matched) return matched.tctycod;
    }

    return "";
  };

  // ============================================================
  // SAVE — maps every formStore field to SaveEmployee.php variables
  // ============================================================
  const handleSave = async () => {
    if (!organisation) {
      showToast("Organisation data not available", 'error');
      return;
    }

    if (!code) {
      showToast("Code is required", 'error');
      return;
    }

    setIsSaving(true);

    try {
      const apiUrl = apiLinks + "/SaveEmployee.php";

      const formDataa = new URLSearchParams();

      // -------- Header / location --------
      formDataa.append("code", organisation.code);
      formDataa.append("FUsrId", user?.tusrid || "");
      formDataa.append("FLocCod", locationnumber || getLocationNumber || "");

      // -------- Employee identity --------
      formDataa.append("FEmpCod", formStore.accountCode || code);
      formDataa.append("FEmpSts", mapStatusForApi(formStore.status));
      formDataa.append("FEmpNam", (formStore.description || "").trim());
      formDataa.append("FEmpFth", (formStore.contactPerson || "").trim());
      formDataa.append("FEmpDsg", (formStore.email || "").trim());
      formDataa.append("FEmpDep", (formStore.address || "").trim());
      formDataa.append("FEmpAbb", (formStore.abb || "").trim());

      // -------- Address --------
      formDataa.append("FAdd001", (formStore.address2 || "").trim());
      formDataa.append("FAdd002", (formStore.address3 || "").trim());

      // -------- Contact --------
      formDataa.append("FMobNum", (formStore.phone || "").trim());
      formDataa.append("FMob001", (formStore.mobile || "").trim());
      formDataa.append("FMob002", (formStore.mobile2 || "").trim());
      formDataa.append("FEmlAdd", (formStore.emailAddress || "").trim());

      // -------- Money --------
      formDataa.append("FEmpSal", cleanAmount(formStore.salary));
      formDataa.append("FOvrTim", cleanAmount(formStore.overTime));
      formDataa.append("FCshCom", cleanAmount(formStore.cashComm));
      formDataa.append("FCrtCom", cleanAmount(formStore.creditComm));
      formDataa.append("FInsCom", cleanAmount(formStore.insComm));

      // -------- Advance / Delivery codes --------
      formDataa.append("FAdvCod", (formStore.advanceCode || "").trim());
      formDataa.append("FAdvDsc", (formStore.advanceText || "").trim());
      formDataa.append("FDlvCod", (formStore.deliveryCode || "").trim());
      formDataa.append("FDlvDsc", (formStore.deliveryText || "").trim());

      // -------- Commission --------
      formDataa.append("FComCod", (formStore.commissionCode || "").trim());
      formDataa.append("FComDsc", (formStore.commissionDescription || "").trim());

      // -------- References --------
      formDataa.append("FRef001", (formStore.reference1 || "").trim());
      formDataa.append("FRef002", (formStore.reference2 || "").trim());

      // -------- CNIC --------
      formDataa.append("FNicNum", (formStore.nic || "").replace(/-/g, '').trim());
      formDataa.append(
        "FNicExp",
        formStore.expiry ? formatDate(formStore.expiry) : ""
      );

      // -------- Dates --------
      formDataa.append(
        "FJonDat",
        formStore.joinDate ? formatDate(formStore.joinDate) : ""
      );
      formDataa.append(
        "FLevDat",
        formStore.leaveDate ? formatDate(formStore.leaveDate) : ""
      );
      formDataa.append(
        "FEmpDob",
        formStore.dobDate ? formatDate(formStore.dobDate) : ""
      );

      // -------- Remarks --------
      formDataa.append("FLevRem", (formStore.leaveRemarks || "").trim());
      formDataa.append("FEmpRem", (formStore.remarks || "").trim());

      // -------- Images / Documents --------
      formDataa.append("FEmpPic", selectedImage1 || "");
      formDataa.append("FEmpDoc", selectedImage2 || "");
      formDataa.append("FEmpThb", "");

      const response = await axios.post(apiUrl, formDataa.toString(), {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
      });

      if (response.status === 200) {
        showToast("Form saved successfully!", 'success');
        resetForm();
        setIsCoolingDown(true);
        setTimeout(() => setIsCoolingDown(false), 5000);
      } else {
        showToast(`Save failed: ${response.status}`, 'error');
      }
    } catch (error) {
      console.error("Error saving data:", error);
      let errorMessage = "Error saving data";
      if (error.response?.data) {
        errorMessage = error.response.data.message || error.response.data || errorMessage;
      }
      showToast(errorMessage, 'error');
    } finally {
      setIsSaving(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
  };

  const handleReturn = () => {
    console.log("Return button clicked");
  };

  const handleNew = () => {
    resetForm();
  };

  return (
    <div className="el-page-host">
      <div className="el-page-wrapper">
        <div className="el-page">
          <div className="el-card">
            <form onSubmit={handleSubmit}>
              <header className="el-header">
                <h1>Employee Maintenance</h1>
                <p className="el-subtitle">
                  Enter the Employee Maintenance information in the form below
                </p>
              </header>

              <div className="el-scrollable-body">
                <div className="el-top-bar">
                  {/* ---- Code ---- */}
                  <div
                    className="el-field-row"
                    onKeyDownCapture={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        e.stopPropagation();
                        fetchInstallationDataByCode(code);
                        if (abbInputRef.current) {
                          abbInputRef.current.focus();
                        }
                      }
                    }}
                  >
                    <span className="el-field-label-right">Employee Code :</span>
                    <InstallationCode
                      ref={codeInputRef}
                      organisation={organisation}
                      apiLinks={apiLinks}
                      apiEndpoint="/NewEmployee.php"
                      getLocationNumber={getLocationNumber}
                      getLocationnumber={getLocationnumber}
                      code={code}
                      setCode={setCode}
                      onKeyDown={(e) => handleKeyDown(e, abbInputRef)}
                      onDoubleClick={() => setIsSearchModalOpen(true)}
                      onCodeChange={handleInstallerCodeChange}
                      maxCode={maxCode}
                      onMaxCodeChange={setMaxCode}
                    />
                  </div>

                  {/* ---- Abb ---- */}
                  <div className="el-field-row el-field-abb">
                    <span className="el-field-label-right">Abb :</span>
                    <input
                      ref={abbInputRef}
                      value={formStore.abb}
                      onChange={set("abb")}
                      placeholder="Enter Abb"
                      maxLength={20}
                      onKeyDown={(e) => handleKeyDown(e, statusSelectRef)}
                    />
                  </div>

                  {/* ---- Status ---- */}
                  <div className="el-field-row">
                    <span className="el-field-label-right">Status :</span>
                    <select
                      ref={statusSelectRef}
                      value={formStore.status}
                      onChange={set("status")}
                      onKeyDown={(e) => handleKeyDown(e, descriptionInputRef)}
                    >
                      {STATUS_OPTIONS.map((opt) => (
                        <option key={opt} value={opt}>
                          {opt}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="el-body">
                  <div className="el-main-content">
                    <section className="el-section">
                      <div className="el-stack">

                        {/* ---- Name (full width) ---- */}
                        <div className="el-field-row">
                          <span className="el-field-label-right">Name :</span>
                          <input
                            ref={descriptionInputRef}
                            value={formStore.description}
                            onChange={set("description")}
                            placeholder="Name"
                            className="name-field"
                            maxLength={40}
                            onKeyDown={(e) => handleKeyDown(e, contactPersonInputRef)}
                          />
                        </div>

                        {/* ---- 70% LEFT fields | 30% RIGHT upload ---- */}
                        <div className="el-row-split">
                          <div className="el-row-split-left">

                            <div className="el-field-row">
                              <span className="el-field-label-right">Father Name:</span>
                              <input
                                ref={contactPersonInputRef}
                                value={formStore.contactPerson}
                                onChange={set("contactPerson")}
                                placeholder="Father Name"
                                maxLength={40}
                                onKeyDown={(e) => handleKeyDown(e, emailInputRef)}
                              />
                            </div>

                            <div className="el-field-row">
                              <span className="el-field-label-right">Designation:</span>
                              <input
                                ref={emailInputRef}
                                value={formStore.email}
                                onChange={set("email")}
                                placeholder="e.g. Manager, Engineer, etc."
                                maxLength={40}
                                onKeyDown={(e) => handleKeyDown(e, address1InputRef)}
                              />
                            </div>

                            <div className="el-field-row">
                              <span className="el-field-label-right">Department:</span>
                              <input
                                ref={address1InputRef}
                                value={formStore.address}
                                onChange={set("address")}
                                placeholder="e.g. IT, etc."
                                maxLength={40}
                                onKeyDown={(e) => handleKeyDown(e, address2InputRef)}
                              />
                            </div>

                            <div className="el-field-row">
                              <span className="el-field-label-right">Address:</span>
                              <input
                                ref={address2InputRef}
                                value={formStore.address2}
                                onChange={set("address2")}
                                placeholder="Address"
                                maxLength={40}
                                onKeyDown={(e) => handleKeyDown(e, address3InputRef)}
                              />
                            </div>

                            <div className="el-field-row">
                              <span className="el-field-label-right"></span>
                              <input
                                ref={address3InputRef}
                                value={formStore.address3 || ""}
                                onChange={set("address3")}
                                placeholder="Address"
                                maxLength={40}
                                onKeyDown={(e) => handleKeyDown(e, nicInputRef)}
                              />
                            </div>

                            <div className="el-field-row el-cnic-row">
                              <span className="el-field-label-right">CNIC:</span>
                              <input
                                ref={nicInputRef}
                                value={formStore.nic}
                                onChange={handleNicChange}
                                placeholder="CNIC (35XXX-XXXXXXX-X)"
                                className="cnic-field"
                                onKeyDown={handleNicEnter}
                                maxLength={15}
                              />
                              <span className="el-inline-label">Expiry:</span>
                              <input
                                type="date"
                                value={formStore.expiry || ""}
                                onChange={set("expiry")}
                                className="el-date-inline"
                              />
                            </div>

                            <div className="el-field-row">
                              <span className="el-field-label-right">Email:</span>
                              <input
                                ref={phoneInputRef}
                                value={formStore.phone}
                                onChange={set("phone")}
                                placeholder="crystalsolution@gmail.com"
                                className="email-field"
                                maxLength={40}
                                onKeyDown={(e) => handleKeyDown(e, mobileInputRef)}
                              />
                            </div>

                            <div className="el-field-row">
                              <span className="el-field-label-right">Mobile:</span>
                              <input
                                ref={mobileInputRef}
                                type="tel"
                                value={formStore.mobile}
                                onChange={set("mobile")}
                                placeholder="03XXXXXXXXX"
                                className="mobile-field"
                                maxLength={11}
                                onKeyDown={(e) => {
                                  if (!/[0-9]/.test(e.key) && e.key.length === 1) {
                                    e.preventDefault();
                                  }
                                  handleKeyDown(e, dobDateRef);
                                }}
                              />
                            </div>

                          </div>

                          <div className="el-row-split-right">
                            <div className="el-photo-box">
                              <span className="el-photo-placeholder">No Image</span>
                            </div>
                            <button type="button" className="el-upload-btn">
                              ⬆ Upload
                            </button>
                          </div>
                        </div>

                        <hr className="el-mobile-divider" />

                        {/* ROW 1 — DOB Date | Join Date */}
                        <div className="el-row-split-pair el-row-dob-join">
                          <div className="el-field-row el-half">
                            <span className="el-field-label-right">DOB Date:</span>
                            <input
                              ref={dobDateRef}
                              type="date"
                              value={formStore.dobDate || ""}
                              onChange={set("dobDate")}
                              className="el-date-inline"
                              onKeyDown={(e) => handleKeyDown(e, joinDateRef)}
                            />
                          </div>
                          <div className="el-field-row el-half">
                            <span className="el-field-label-right">Join Date:</span>
                            <input
                              ref={joinDateRef}
                              type="date"
                              value={formStore.joinDate || ""}
                              onChange={set("joinDate")}
                              className="el-date-inline"
                              onKeyDown={(e) => handleKeyDown(e, leaveDateRef)}
                            />
                          </div>
                        </div>

                        {/* ROW 2 — Leave Date | Leave Remarks */}
                        <div className="el-row-split-pair el-row-leave">
                          <div className="el-field-row el-half">
                            <span className="el-field-label-right">Leave Date:</span>
                            <input
                              ref={leaveDateRef}
                              type="date"
                              value={formStore.leaveDate || ""}
                              onChange={set("leaveDate")}
                              className="el-date-inline"
                              onKeyDown={(e) => handleKeyDown(e, leaveRemarksRef)}
                            />
                          </div>
                          <div className="el-field-row el-half">
                            <input
                              ref={leaveRemarksRef}
                              value={formStore.leaveRemarks || ""}
                              onChange={set("leaveRemarks")}
                              placeholder="Leave Remarks"
                              className="el-remark-field"
                              maxLength={40}
                              onKeyDown={(e) => handleKeyDown(e, creditCommRef)}
                            />
                          </div>
                        </div>

                        <hr className="el-mobile-divider" />

                        {/* ROW 3 — Credit Comm | Cash Comm */}
                        <div className="el-row-split-pair">
                          <div className="el-field-row el-half">
                            <span className="el-field-label-right">Credit Comm:</span>
                            <input
                              ref={creditCommRef}
                              value={formStore.creditComm || ""}
                              onChange={set("creditComm")}
                              placeholder="0.00"
                              className="el-num-field"
                              maxLength={20}
                              onKeyDown={(e) => handleKeyDown(e, cashCommRef)}
                            />
                          </div>
                          <div className="el-field-row el-half">
                            <span className="el-field-label-right">Cash Comm:</span>
                            <input
                              ref={cashCommRef}
                              value={formStore.cashComm || ""}
                              onChange={set("cashComm")}
                              placeholder="0.00"
                              className="el-num-field"
                              maxLength={20}
                              onKeyDown={(e) => handleKeyDown(e, salaryRef)}
                            />
                          </div>
                        </div>

                        {/* ROW 4 — Salary | Over Time */}
                        <div className="el-row-split-pair">
                          <div className="el-field-row el-half">
                            <span className="el-field-label-right">Salary:</span>
                            <input
                              ref={salaryRef}
                              value={formStore.salary || ""}
                              onChange={set("salary")}
                              placeholder="Salary"
                              className="el-num-field"
                              maxLength={20}
                              onKeyDown={(e) => handleKeyDown(e, overTimeRef)}
                            />
                          </div>
                          <div className="el-field-row el-half">
                            <span className="el-field-label-right">Over Time:</span>
                            <input
                              ref={overTimeRef}
                              value={formStore.overTime || ""}
                              onChange={set("overTime")}
                              placeholder="Over Time"
                              className="el-num-field"
                              maxLength={20}
                              onKeyDown={(e) => handleKeyDown(e, advanceCodeRef)}
                            />
                          </div>
                        </div>

                        {/* ROW 5 — Advance Code | Advance Text */}
                        <div className="el-row-code-pair">
                          <div className="el-field-row el-code-field-cell">
                            <span className="el-field-label-right">Advance Code:</span>
                            <input
                              ref={advanceCodeRef}
                              value={formStore.advanceCode || ""}
                              onChange={set("advanceCode")}
                              className="el-code-input"
                              maxLength={20}
                              onKeyDown={(e) => handleKeyDown(e, advanceTextRef)}
                            />
                          </div>
                          <div className="el-field-row el-remark-field-cell">
                            <input
                              ref={advanceTextRef}
                              value={formStore.advanceText || ""}
                              onChange={set("advanceText")}
                              placeholder="- ADVANCE"
                              className="el-remark-field"
                              maxLength={40}
                              onKeyDown={(e) => handleKeyDown(e, deliveryCodeRef)}
                            />
                          </div>
                        </div>

                        {/* ROW 6 — Delivery Code | Delivery Text */}
                        <div className="el-row-code-pair">
                          <div className="el-field-row el-code-field-cell">
                            <span className="el-field-label-right">Delivery Code:</span>
                            <input
                              ref={deliveryCodeRef}
                              value={formStore.deliveryCode || ""}
                              onChange={set("deliveryCode")}
                              className="el-code-input"
                              maxLength={20}
                              onKeyDown={(e) => handleKeyDown(e, deliveryTextRef)}
                            />
                          </div>
                          <div className="el-field-row el-remark-field-cell">
                            <input
                              ref={deliveryTextRef}
                              value={formStore.deliveryText || ""}
                              onChange={set("deliveryText")}
                              placeholder="- DELIVERY"
                              className="el-remark-field"
                              maxLength={40}
                              onKeyDown={(e) => handleKeyDown(e, reference1Ref)}
                            />
                          </div>
                        </div>

                        <hr className="el-mobile-divider" />

                        {/* ROW 7 — Reference | Reference Name */}
                        <div className="el-row-split-pair">
                          <div className="el-field-row el-half">
                            <span className="el-field-label-right">Reference:</span>
                            <input
                              ref={reference1Ref}
                              value={formStore.reference1 || ""}
                              onChange={set("reference1")}
                              placeholder="03XXXXXXXXX"
                              className="el-ref-phone-field"
                              maxLength={15}
                              onKeyDown={(e) => handleKeyDown(e, reference1NameRef)}
                            />
                          </div>
                          <div className="el-field-row el-half">
                            <input
                              ref={reference1NameRef}
                              value={formStore.reference1Name || ""}
                              onChange={set("reference1Name")}
                              placeholder="Name"
                              className="el-remark-field"
                              maxLength={40}
                              onKeyDown={(e) => handleKeyDown(e, reference2Ref)}
                            />
                          </div>
                        </div>

                        {/* ROW 8 — Reference | Reference Name */}
                        <div className="el-row-split-pair">
                          <div className="el-field-row el-half">
                            <span className="el-field-label-right">Reference:</span>
                            <input
                              ref={reference2Ref}
                              value={formStore.reference2 || ""}
                              onChange={set("reference2")}
                              placeholder="03XXXXXXXXX"
                              className="el-ref-phone-field"
                              maxLength={15}
                              onKeyDown={(e) => handleKeyDown(e, reference2NameRef)}
                            />
                          </div>
                          <div className="el-field-row el-half">
                            <input
                              ref={reference2NameRef}
                              value={formStore.reference2Name || ""}
                              onChange={set("reference2Name")}
                              placeholder="Name"
                              className="el-remark-field"
                              maxLength={40}
                              onKeyDown={(e) => handleKeyDown(e, documentNameRef)}
                            />
                          </div>
                        </div>

                        {/* ROW 9 — Document | Upload | Download */}
                        <div className="el-doc-row">
                          <span className="el-field-label-right el-doc-label">Document:</span>
                          <div className="el-doc-input-cell">
                            <input
                              ref={documentNameRef}
                              value={formStore.documentName || ""}
                              onChange={set("documentName")}
                              placeholder="Click to upload Document"
                              className="el-doc-input"
                              maxLength={60}
                              onKeyDown={(e) => handleKeyDown(e, remarksRef)}
                            />
                          </div>
                          <button type="button" className="el-doc-btn el-doc-upload">
                            ⬆ Upload
                          </button>
                          <button type="button" className="el-doc-btn el-doc-download">
                            ⬇ Download
                          </button>
                        </div>

                        {/* ROW 10 — Remarks (tall) */}
                        <div className="el-field-row el-remarks-row">
                          <span className="el-field-label-right">Remarks:</span>
                          <textarea
                            ref={remarksRef}
                            value={formStore.remarks || ""}
                            onChange={set("remarks")}
                            placeholder="Remarks"
                            className="el-remarks-textarea"
                            maxLength={255}
                            onKeyDown={(e) => {
                              if (e.key === 'Enter' && !e.shiftKey) {
                                e.preventDefault();
                                if (saveButtonRef.current) {
                                  saveButtonRef.current.focus();
                                }
                              }
                            }}
                          />
                        </div>

                      </div>
                    </section>
                  </div>
                </div>
              </div>

              <FormButtons
                saveText="Save"
                returnText="Return"
                newText="New"
                onSave={handleSave}
                onReturn={handleReturn}
                onNew={handleNew}
                saveButtonRef={saveButtonRef}
                disabled={isSaving || isCoolingDown}
              />
            </form>
          </div>
        </div>
      </div>

      <SearchModal
        isOpen={isSearchModalOpen}
        onClose={handleModalClose}
        onSelectInstaller={handleInstallerSelect}
        apiLinks={apiLinks}
        apiEndpoint="/EmployeeList.php"
        title="Select Employee"
        codeKey="Code"
        descriptionKey="Employee"
      />
    </div>
  );
}