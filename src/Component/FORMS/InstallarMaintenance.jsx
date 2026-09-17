import React, { useState, useEffect, useRef } from "react";
import "./Installarmaintenance.css";
import { useTheme } from "../../ThemeContext";
import axios from "axios";
import {
  getUserData,
  getOrganisationData,
  getLocationnumber,
  getYearDescription,
} from "../../Component/Auth";

import DynamicSelect from "./components/CityDropdown";
import FormButtons from "./components/FormButton";
import InstallationCode from "./components/InstallarCode";
import SearchModal from "./components/SearchModel";

const STATUS_OPTIONS = ["Active", "Non-Active"];

function Field({ label, children, className = "" }) {
  return (
    <div className={`el-field ${className}`}>
      <span className="el-field-label">{label}</span>
      {children}
    </div>
  );
}

export default function InstallarMaintenance() {
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

  const [formStore, setFormStore] = useState({
    status: "Active",
    description: "",
    contactPerson: "",
    email: "",
    address: "",
    address2: "",
    phone: "",
    mobile: "",
    city: "",
    area: "",
    FAreCod: "",          // ← NEW: holds selected Area code for Save API
    nic: "",
    jcName: "",
    jcNumber: "",
    epName: "",
    epNumber: "",
    bank: "",
    accountNumber: "",
    accountCode: "22-03-0",
  });

  const [code, setCode] = useState("");
  const [maxCode, setMaxCode] = useState("");
  const [organisation, setOrganisation] = useState(null);
  const [selectedCityCode, setSelectedCityCode] = useState("");
  console.log('CITYCODE', selectedCityCode)
  const [selectedAreaCode, setSelectedAreaCode] = useState("");
  console.log('AREACODE', selectedAreaCode)
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

  console.log("FormStore", formStore);
  console.log("InstallationCode", code);
  console.log("SelectedCityCode", selectedCityCode);
  console.log("SelectedAreaCode", selectedAreaCode);

  // Get organisation data
  useEffect(() => {
    const orgData = getOrganisationData();
    setOrganisation(orgData);
  }, []);

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
          console.warn("Response data structure is not as expected:", response.data);
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
  // Fetch installation data by Code  ---  FIXED 3 FIELDS
  // ==========================================================
  const fetchInstallationDataByCode = (installationCode) => {
    if (!organisation || !installationCode) {
      showToast("Data not found", 'error');
      return;
    }

    const apiUrl = apiLinks + "/GetInstallar.php";
    const formData = new URLSearchParams({
      code: organisation.code,
      FIntCod: installationCode,
    }).toString();

    axios
      .post(apiUrl, formData)
      .then((response) => {
        if (response.data && response.data.length > 0) {
          const data = response.data[0];

          // Find the city name from city code
          let cityName = data.tctycod || "";
          if (cityName && cityOptions.length > 0) {
            const matchedCity = cityOptions.find(
              (city) => String(city.tctycod).trim() === String(cityName).trim()
            );
            if (matchedCity) {
              cityName = matchedCity.tctydsc;
            }
          }

          // Find the area name from area code
          let areaName = "";
          if (data.tarecod && areaOptions.length > 0) {
            const matchedArea = areaOptions.find(
              (area) => String(area.tarecod).trim() === String(data.tarecod).trim()
            );
            if (matchedArea) {
              areaName = matchedArea.taredsc;
            }
          }

          // ---------- FIXED MAPPING ----------
          setFormStore((prev) => ({
            ...prev,
            status: data.tinssts || prev.status,
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

          // Update selected city code
          if (data.tctycod) {
            setSelectedCityCode(data.tctycod);
          }

          // Update selected area code
          if (data.tarecod) {
            setSelectedAreaCode(data.tarecod);
          }

          showToast("User data found", 'success');
        } else {
          // No data found - clear form fields
          setFormStore((prev) => ({
            status: "Active",
            description: "",
            contactPerson: "",
            email: "",
            address: "",
            address2: "",
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

          console.warn("No data found for installation code:", installationCode);
        }
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
        showToast("Data not found", 'error');
      });
  };

  // ==========================================================
  // Fetch installation data by NIC  ---  FIXED 3 FIELDS
  // ==========================================================
  const fetchInstallationDataByNIC = (nicNumber) => {
    if (!organisation || !nicNumber) {
      console.error("[NIC Lookup] Missing organisation or nicNumber:", { organisation, nicNumber });
      showToast("Data not found", 'error');
      return;
    }

    const cleanNic = nicNumber.replace(/-/g, '');
    console.log("[NIC Lookup] Input NIC:", nicNumber, "| Cleaned NIC:", cleanNic);
    console.log("[NIC Lookup] Organisation code:", organisation.code);

    const apiUrl = apiLinks + "/GetInstallarbyCNIC.php";
    const formData = new URLSearchParams({
      code: organisation.code,
      FNicNum: cleanNic,
    }).toString();

    console.log("[NIC Lookup] API URL:", apiUrl);
    console.log("[NIC Lookup] Request body:", formData);

    axios
      .post(apiUrl, formData)
      .then((response) => {
        console.log("[NIC Lookup] Raw response.data:", response.data);

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

          // Find the area name from area code
          let areaName = "";
          if (data.tarecod && areaOptions.length > 0) {
            const matchedArea = areaOptions.find(
              (area) => String(area.tarecod).trim() === String(data.tarecod).trim()
            );
            if (matchedArea) {
              areaName = matchedArea.taredsc;
            }
          }

          // ---------- FIXED MAPPING ----------
          setFormStore((prev) => ({
            ...prev,
            status: data.tinssts || prev.status,
            description: data.tintdsc || prev.description,
            contactPerson: data.tintper || prev.contactPerson,
            email: data.temladd || prev.email,
            address: data.tadd001 || prev.address,
            address2: data.tadd002 || prev.address2,
            phone: data.tphnnum || prev.phone,
            mobile: data.tmobnum || prev.mobile,
            nic: formatNIC(data.tnicnum) || prev.nic,
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

          if (data.tintcod) {
            setCode(data.tintcod);
          }

          showToast("User data found", 'success');
        } else {
          console.warn("[NIC Lookup] No data found. response.data:", response.data);

          setFormStore((prev) => ({
            status: "Active",
            description: "",
            contactPerson: "",
            email: "",
            address: "",
            address2: "",
            phone: "",
            mobile: "",
            city: "",
            area: "",
            FAreCod: "",
            nic: prev.nic,
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

          console.warn("[NIC Lookup] No data found for NIC:", nicNumber);
        }
      })
      .catch((error) => {
        console.error("[NIC Lookup] API error:", error);
        console.error("[NIC Lookup] Error response:", error.response?.data);
        console.error("[NIC Lookup] Error status:", error.response?.status);
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
      console.log("[NIC Enter] formStore.nic:", formStore.nic);
      if (formStore.nic && organisation) {
        fetchInstallationDataByNIC(formStore.nic);
      }
      if (descriptionInputRef.current) {
        descriptionInputRef.current.focus();
      }
    }
  };

  const resetForm = () => {
    setFormStore({
      status: "Active",
      description: "",
      contactPerson: "",
      email: "",
      address: "",
      address2: "",
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
    });
    setSelectedCityCode("");
    setSelectedAreaCode("");

    if (organisation) {
      const apiUrl = apiLinks + "/NewInstallar.php";
      const formData = new URLSearchParams({
        code: organisation.code,
        FLocCod: getLocationNumber || getLocationnumber(),
      }).toString();

      axios
        .post(apiUrl, formData)
        .then((response) => {
          if (response.data) {
            let newCode = "";
            if (Array.isArray(response.data) && response.data.length > 0) {
              newCode = response.data[0];
            } else if (typeof response.data === "string") {
              newCode = response.data;
            } else {
              newCode = response.data.code || response.data.FIntCod || "";
            }
            if (newCode) {
              setCode(String(newCode));
              setMaxCode(String(newCode));
            }
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

  const handleSave = async () => {
    if (!organisation) {
      console.error("Organisation data not available");
      showToast("Organisation data not available", 'error');
      return;
    }

    if (!code) {
      console.error("Code is required");
      showToast("Code is required", 'error');
      return;
    }

    const cityCodeToSend = resolveCityCode();

    if (formStore.city && !cityCodeToSend) {
      console.error("Could not resolve a city code for:", formStore.city);
      showToast("Please re-select the City before saving", 'error');
      return;
    }

    setIsSaving(true);

    try {
      const apiUrl = apiLinks + "/SaveInstallar.php";

      const payload = {
        code: organisation.code,
        FUsrId: "sohaib" || "",
        FIntCod: code,
        FIntDsc: (formStore.description || "").trim(),
        FAdd001: (formStore.address || "").trim(),
        FAdd002: (formStore.address2 || "").trim(),
        FPhnNum: (formStore.phone || "").trim(),
        FMobNum: (formStore.mobile || "").trim(),
        FCtyCod: cityCodeToSend || "",
        FAreCod: (formStore.FAreCod || "").trim(),   // ← NEW: Area code sent to Save API
        FInsCod: formStore.accountCode || "",
        FInsSts: mapStatusForApi(formStore.status),
        FNicNum: (formStore.nic || "").replace(/-/g, '').trim(),
        FJazNum: (formStore.jcNumber || "").trim(),
        FJazNam: (formStore.jcName || "").trim(),
        FEspNum: (formStore.epNumber || "").trim(),
        FEspNam: (formStore.epName || "").trim(),
        FBnkNam: (formStore.bank || "").trim(),
        FAccNum: (formStore.accountNumber || "").trim(),
        FEmlAdd: (formStore.email || "").trim(),
        FConPer: (formStore.contactPerson || "").trim(),
        FIntPer: (formStore.contactPerson || "").trim(),
      };

      console.log("Saving payload:", payload);

      const formData = new URLSearchParams(payload).toString();

      const response = await axios.post(apiUrl, formData, {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        }
      });

      console.log("Save response:", response);

      if (response.status === 200) {
        console.log("Save successful:", response.data);
        showToast("Form saved successfully!", 'success');
        resetForm();
        setIsCoolingDown(true);
        setTimeout(() => setIsCoolingDown(false), 5000);
      } else {
        console.error("Save failed with status:", response.status, response.data);
        showToast(`Save failed: ${response.status}`, 'error');
      }
    } catch (error) {
      console.error("Error saving data:", error);
      console.error("Error response:", error.response?.data);
      console.error("Error status:", error.response?.status);

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
    console.log("Form submission prevented - use Save button");
  };

  const handleReturn = () => {
    console.log("Return button clicked");
  };

  const handleNew = () => {
    console.log("New button clicked");
    resetForm();
  };

  return (
    <div className="el-page-host">
      <div className="el-page-wrapper">
        <div className="el-page">
          <div className="el-card">
            <form onSubmit={handleSubmit}>
              <header className="el-header">
                <h1>Installer Maintenance</h1>
                <p className="el-subtitle">
                  Enter the Installar Maintenance information in the form below
                </p>
              </header>

              <div className="el-scrollable-body">
                <div className="el-top-bar">
                  <div
                    className="el-field-row"
                    onKeyDownCapture={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        e.stopPropagation();
                        fetchInstallationDataByCode(code);
                        if (statusSelectRef.current) {
                          statusSelectRef.current.focus();
                        }
                      }
                    }}
                  >
                    <span className="el-field-label-right">Code :</span>
                    <InstallationCode
                      ref={codeInputRef}
                      organisation={organisation}
                      apiLinks={apiLinks}
                      apiEndpoint="/NewInstallar.php"
                      getLocationNumber={getLocationNumber}
                      getLocationnumber={getLocationnumber}
                      code={code}
                      setCode={setCode}
                      onKeyDown={(e) => handleKeyDown(e, statusSelectRef)}
                      onDoubleClick={() => setIsSearchModalOpen(true)}
                      onCodeChange={handleInstallerCodeChange}
                      maxCode={maxCode}
                      onMaxCodeChange={setMaxCode}
                    />
                  </div>

                  <div className="el-field-row">
                    <span className="el-field-label-right">Status :</span>
                    <select
                      ref={statusSelectRef}
                      value={formStore.status}
                      onChange={set("status")}
                      onKeyDown={(e) => handleKeyDown(e, nicInputRef)}
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
                        <div className="el-field-row">
                          <span className="el-field-label-right">NIC # :</span>
                          <input
                            ref={nicInputRef}
                            value={formStore.nic}
                            onChange={handleNicChange}
                            placeholder="Enter NIC # "
                            className="fixed-width-field"
                            onKeyDown={handleNicEnter}
                            maxLength={15}
                          />
                        </div>

                        <div className="el-field-row">
                          <span className="el-field-label-right">
                            Description :
                          </span>
                          <input
                            ref={descriptionInputRef}
                            value={formStore.description}
                            onChange={set("description")}
                            placeholder="Enter Description"
                            maxLength={40}
                            onKeyDown={(e) => handleKeyDown(e, contactPersonInputRef)}
                          />
                        </div>

                        <div className="el-field-row">
                          <span className="el-field-label-right">
                            Contact Per :
                          </span>
                          <input
                            ref={contactPersonInputRef}
                            value={formStore.contactPerson}
                            onChange={set("contactPerson")}
                            placeholder="Enter Contact Person"
                            maxLength={40}
                            onKeyDown={(e) => handleKeyDown(e, emailInputRef)}
                          />
                        </div>

                        <div className="el-field-row">
                          <span className="el-field-label-right">
                            Email :
                          </span>
                          <input
                            ref={emailInputRef}
                            value={formStore.email}
                            onChange={set("email")}
                            placeholder="Enter Email"
                            maxLength={40}
                            onKeyDown={(e) => handleKeyDown(e, address1InputRef)}
                          />
                        </div>

                        <div className="el-field-row">
                          <span className="el-field-label-right">
                            Address 1 :
                          </span>
                          <input
                            ref={address1InputRef}
                            value={formStore.address}
                            onChange={set("address")}
                            placeholder="Enter Address 1"
                            maxLength={40}
                            onKeyDown={(e) => handleKeyDown(e, address2InputRef)}
                          />
                        </div>

                        <div className="el-field-row">
                          <span className="el-field-label-right">
                            Address 2 :
                          </span>
                          <input
                            ref={address2InputRef}
                            value={formStore.address2}
                            onChange={set("address2")}
                            placeholder="Enter Address 2"
                            maxLength={40}
                            onKeyDown={(e) => handleKeyDown(e, phoneInputRef)}
                          />
                        </div>

                        <div className="el-field-row el-row-2-fields">
                          <div className="el-field-row-inner el-field-left">
                            <span className="el-field-label-right">
                              Phone No :
                            </span>
                            <input
                              ref={phoneInputRef}
                              type="tel"
                              value={formStore.phone}
                              onChange={set("phone")}
                              placeholder="Enter Phone No"
                              className="fixed-width-field"
                              maxLength={25}
                              onKeyDown={(e) => {
                                if (!/[0-9]/.test(e.key) && e.key.length === 1) {
                                  e.preventDefault();
                                }
                                handleKeyDown(e, mobileInputRef);
                              }}
                            />
                          </div>
                          <div className="el-field-row-inner el-field-right">
                            <span className="el-field-label-right">
                              Mobile No :
                            </span>
                            <input
                              ref={mobileInputRef}
                              type="tel"
                              value={formStore.mobile}
                              onChange={set("mobile")}
                              placeholder="Enter Mobile No"
                              maxLength={11}
                              onKeyDown={(e) => {
                                if (!/[0-9]/.test(e.key) && e.key.length === 1) {
                                  e.preventDefault();
                                }
                                handleKeyDown(e, citySelectRef);
                              }}
                            />
                          </div>
                        </div>

                        {/* -------- CITY + AREA on the same row -------- */}
                        <div className="el-field-row el-row-2-fields">
                          {/* CITY (left) */}
                          <div className="el-field-row-inner el-field-left" style={{marginLeft:"25px"}}>
                            <span className="el-field-label-right">City :</span>
                            <div ref={citySelectRef} style={{ width: '200px', maxWidth: '200px', flex: '0 0 auto' }}>
                              <DynamicSelect
                                apiEndpoint="/GetActiveCity.php"
                                apiLinks={apiLinks}
                                organisation={organisation}
                                locationNumber={
                                  getLocationNumber || getLocationnumber()
                                }
                                value={isInitialLoad ? "" : (formStore.city || "")}
                                onChange={(selectedCity) => {
                                  setFormStore((prev) => ({ ...prev, city: selectedCity }));
                                }}
                                valueKey="tctydsc"
                                labelKey="tctydsc"
                                codeKey="tctycod"
                                onCityCodeChange={setSelectedCityCode}
                                placeholder="Please Select City"
                                onKeyDown={(e) => handleKeyDown(e, areaSelectRef)}
                              />
                            </div>
                          </div>

                          {/* AREA (right, same row) */}
                          <div className="el-field-row-inner el-field-right">
                            <span className="el-field-label-right">Area :</span>
                            <div ref={areaSelectRef}>
                              <DynamicSelect
                                apiEndpoint="/GetActiveArea.php"
                                apiLinks={apiLinks}
                                organisation={organisation}
                                locationNumber={
                                  getLocationNumber || getLocationnumber()
                                }
                                value={isInitialLoad ? "" : (formStore.area || "")}
                                onChange={(selectedArea) => {
                                  setFormStore((prev) => ({ ...prev, area: selectedArea }));
                                }}
                                valueKey="taredsc"
                                labelKey="taredsc"
                                codeKey="tarecod"
                                onCodeChange={(areaCode) => {
                                  setFormStore((prev) => ({
                                    ...prev,
                                    FAreCod: areaCode || "",
                                  }));
                                  setSelectedAreaCode(areaCode || "");
                                }}
                                placeholder="Please Select Area"
                                onKeyDown={(e) => {
                                  if (e.key === 'Enter') {
                                    e.preventDefault();
                                    e.stopPropagation();
                                    if (jcNameInputRef.current) {
                                      jcNameInputRef.current.focus();
                                    }
                                  }
                                }}
                              />
                            </div>
                          </div>
                        </div>

                        <div className="el-field-row">
                          <span className="el-field-label-right">
                            JC Name :
                          </span>
                          <input
                            ref={jcNameInputRef}
                            value={formStore.jcName}
                            onChange={set("jcName")}
                            placeholder="Enter JC Name"
                            maxLength={40}
                            onKeyDown={(e) => handleKeyDown(e, jcNumberInputRef)}
                          />
                        </div>

                        <div className="el-field-row">
                          <span className="el-field-label-right">JC # :</span>
                          <input
                            ref={jcNumberInputRef}
                            value={formStore.jcNumber}
                            onChange={set("jcNumber")}
                            placeholder="Enter JC #"
                            className="fixed-width-field"
                            maxLength={40}
                            onKeyDown={(e) => handleKeyDown(e, epNameInputRef)}
                          />
                        </div>

                        <div className="el-field-row">
                          <span className="el-field-label-right">
                            EP Name :
                          </span>
                          <input
                            ref={epNameInputRef}
                            value={formStore.epName}
                            onChange={set("epName")}
                            placeholder="Enter EP Name"
                            maxLength={40}
                            onKeyDown={(e) => handleKeyDown(e, epNumberInputRef)}
                          />
                        </div>

                        <div className="el-field-row">
                          <span className="el-field-label-right">EP # :</span>
                          <input
                            ref={epNumberInputRef}
                            value={formStore.epNumber}
                            onChange={set("epNumber")}
                            placeholder="Enter EP #"
                            className="fixed-width-field"
                            maxLength={40}
                            onKeyDown={(e) => handleKeyDown(e, bankInputRef)}
                          />
                        </div>

                        <div className="el-field-row">
                          <span className="el-field-label-right">Bank :</span>
                          <input
                            ref={bankInputRef}
                            value={formStore.bank}
                            onChange={set("bank")}
                            placeholder="Enter Bank"
                            maxLength={40}
                            onKeyDown={(e) => handleKeyDown(e, accountNumberInputRef)}
                          />
                        </div>

                        <div className="el-field-row">
                          <span className="el-field-label-right">A/C # :</span>
                          <input
                            ref={accountNumberInputRef}
                            value={formStore.accountNumber}
                            onChange={set("accountNumber")}
                            placeholder="Enter A/C #"
                            maxLength={40}
                            onKeyDown={(e) => handleKeyDown(e, accountCodeInputRef)}
                          />
                        </div>
                      </div>
                    </section>
                  </div>
                </div>
              </div>

              <div className="el-account-code-section">
                <div className="el-account-code-row">
                  <span className="el-field-label-right">A/C Code :</span>
                  <input
                    ref={accountCodeInputRef}
                    className="el-account-code-input"
                    value={formStore.accountCode}
                    onChange={set("accountCode")}
                    placeholder="Enter A/C Code"
                    maxLength={40}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        e.stopPropagation();
                        if (saveButtonRef.current) {
                          saveButtonRef.current.focus();
                        }
                      }
                    }}
                  />
                  <input
                    className="el-account-code-input"
                    value={formStore.description}
                    readOnly
                    disabled
                    placeholder=""
                  />
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
        apiEndpoint="/GetInstallars.php"
        title="Select Installar"
        codeKey="tintcod"
        descriptionKey="tintdsc"
      />
    </div>
  );
}