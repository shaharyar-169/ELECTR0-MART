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

import CitySelect from "./components/CityDropdown";
import FormButtons from "./components/FormButton";
import InstallationCode from "./components/InstallarCode";

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
    nic: "",
    jcName: "",
    jcNumber: "",
    epName: "",
    epNumber: "",
    bank: "",
    accountNumber: "",
    accountCode: "22-03-0",
  });

  console.log('getUserData', getUserData.user)

  const [code, setCode] = useState("");
  const [organisation, setOrganisation] = useState(null);
  const [selectedCityCode, setSelectedCityCode] = useState("");
  const [cityOptions, setCityOptions] = useState([]);
  const [showDescriptionInUnlabeled, setShowDescriptionInUnlabeled] = useState(false);
  const [isInitialLoad, setIsInitialLoad] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
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
 
  // Get organisation data
  useEffect(() => {
    const orgData = getOrganisationData();
    setOrganisation(orgData);
  }, []);

  // Auto-focus InstallationCode on initial load
  useEffect(() => {
    if (code && isInitialLoad) {
      // Focus the code input after it gets its initial value
      const timer = setTimeout(() => {
        if (codeInputRef.current) {
          // Find the input element inside InstallationCode component
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
          console.warn(
            "Response data structure is not as expected:",
            response.data
          );
          setCityOptions([]);
        }
      })
      .catch((error) => {
        console.error("Error fetching cities:", error);
        setCityOptions([]);
      });
  }, [organisation, apiLinks, getLocationNumber]);

  // Show toast notification with optional type (success or error)
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

  // Fetch installation data by Code
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
          
          // Update formStore
          setFormStore((prev) => ({
            ...prev,
            status: data.tinssts || prev.status,
            description: data.tintdsc || prev.description,
            contactPerson: data.temladd || prev.contactPerson,
            email: data.FEmlAdd || prev.email,
            address: data.tadd001 || prev.address,
            address2: data.tadd002 || prev.address2,
            phone: data.tphnnum || prev.phone,
            mobile: data.tmobnum || prev.mobile,
            nic: data.tnicnum || prev.nic,
            jcName: data.tjaznam || prev.jcName,
            jcNumber: data.tjaznum || prev.jcNumber,
            epName: data.tespnam || prev.epName,
            epNumber: data.tespnum || prev.epNumber,
            bank: data.tbnknam || prev.bank,
            accountNumber: data.tinscod || prev.accountNumber,
            city: cityName || prev.city,
          }));

          // Update selected city code
          if (data.tctycod) {
            setSelectedCityCode(data.tctycod);
          }

          // Show success toast
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
            nic: "",
            jcName: "",
            jcNumber: "",
            epName: "",
            epNumber: "",
            bank: "",
            accountNumber: "",
            accountCode: `22-03-0${code}`,
          }));
          
          // Clear selected city code
          setSelectedCityCode("");
          
          // Show error toast
          showToast("Data not found", 'error');
          
          console.warn(
            "No data found for installation code:",
            installationCode
          );
        }
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
        // Show error toast on API failure
        showToast("Data not found", 'error');
      });
  };

  // Fetch installation data by NIC
  const fetchInstallationDataByNIC = (nicNumber) => {
    if (!organisation || !nicNumber) {
      showToast("Data not found", 'error');
      return;
    }

    const apiUrl = apiLinks + "/GetInstallarbyCNIC.php";
    const formData = new URLSearchParams({
      code: organisation.code,
      FNicNum: nicNumber,
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
          
          // Update formStore
          setFormStore((prev) => ({
            ...prev,
            status: data.tinssts || prev.status,
            description: data.tintdsc || prev.description,
            contactPerson: data.temladd || prev.contactPerson,
            email: data.FEmlAdd || prev.email,
            address: data.tadd001 || prev.address,
            address2: data.tadd002 || prev.address2,
            phone: data.tphnnum || prev.phone,
            mobile: data.tmobnum || prev.mobile,
            nic: data.tnicnum || prev.nic,
            jcName: data.tjaznam || prev.jcName,
            jcNumber: data.tjaznum || prev.jcNumber,
            epName: data.tespnam || prev.epName,
            epNumber: data.tespnum || prev.epNumber,
            bank: data.tbnknam || prev.bank,
            accountNumber: data.tinscod || prev.accountNumber,
            city: cityName || prev.city,
          }));

          // Update selected city code
          if (data.tctycod) {
            setSelectedCityCode(data.tctycod);
          }

          // Update code field with the found installation code
          if (data.tintcod) {
            setCode(data.tintcod);
          }

          // Show success toast
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
            nic: "",
            jcName: "",
            jcNumber: "",
            epName: "",
            epNumber: "",
            bank: "",
            accountNumber: "",
            accountCode: `22-03-0${code}`,
          }));
          
          // Clear selected city code
          setSelectedCityCode("");
          
          // Show error toast
          showToast("Data not found", 'error');
          
          console.warn(
            "No data found for NIC:",
            nicNumber
          );
        }
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
        // Show error toast on API failure
        showToast("Data not found", 'error');
      });
  };

  const set = (key) => (e) => {
    const value = e.target.value;
    setFormStore((prev) => ({ ...prev, [key]: value }));
  };

  const handleCodeChange = (e) => {
    setCode(e.target.value);
  };

  const bumpCode = (dir) => {
    setCode((prevCode) => {
      const currentCode = parseInt(prevCode, 10) || 0;
      const next = Math.max(0, currentCode + dir);
      const newCode = String(next).padStart(4, "0");
      return newCode;
    });
  };

  // Handle Enter key navigation - moves focus to next field
  const handleKeyDown = (e, nextRef) => {
    if (e.key === 'Enter') {
      e.preventDefault(); // PREVENT FORM SUBMISSION
      e.stopPropagation(); // Prevent any default select/highlight behavior
      if (nextRef && nextRef.current) {
        // For select elements, focus works directly
        // For custom components, we need to find the actual input/select element
        const element = nextRef.current;
        if (element.tagName === 'SELECT' || element.tagName === 'INPUT') {
          element.focus();
          // If it's an input, select its content for better UX
          if (element.tagName === 'INPUT') {
            element.select();
          }
        } else {
          // For custom components like InstallationCode or CitySelect
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

  // Handle Enter key on NIC field - triggers API call then moves to Description
  const handleNicEnter = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      e.stopPropagation();
      // Call the API with current NIC value
      if (formStore.nic && organisation) {
        fetchInstallationDataByNIC(formStore.nic);
      }
      // Move focus to Description field after API call
      if (descriptionInputRef.current) {
        descriptionInputRef.current.focus();
      }
    }
  };

  // Reset form to default/empty values (full reset)
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
  };

  // Reset form but keep code, status, and accountCode
  const resetFormKeepCodeAndStatus = () => {
    setFormStore({
      status: formStore.status, // Keep current status
      description: "",
      contactPerson: "",
      email: "",
      address: "",
      address2: "",
      phone: "",
      mobile: "",
      city: "",
      nic: "",
      jcName: "",
      jcNumber: "",
      epName: "",
      epNumber: "",
      bank: "",
      accountNumber: "",
      accountCode: formStore.accountCode, // Keep current accountCode
    });
    setSelectedCityCode("");
  };

  // Resolve the backend city code (FCtyCod) that should be sent on Save.
  //
  // `selectedCityCode` is normally kept in sync by the CitySelect component's
  // onCityCodeChange callback. That path is exercised reliably when a record
  // is loaded via GetInstallar (we set it directly from data.tctycod), which
  // is why the "populate then save" flow always worked.
  //
  // When a user types/selects a city by hand, formStore.city (the display
  // name) can end up set without selectedCityCode being updated in the same
  // tick (or at all, depending on how CitySelect fires its callbacks) — the
  // Save request then goes out with FCtyCod empty, and the backend rejects
  // the insert with a 500. This helper re-derives the code from the already
  // fetched cityOptions list as a fallback, so Save is correct regardless of
  // which path set formStore.city.
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

  
// Handle Save API
const handleSave = async () => {
  if (!organisation) {
    console.error("Organisation data not available");
    showToast("Organisation data not available", 'error');
    return;
  }

  // Validate required fields
  if (!code) {
    console.error("Code is required");
    showToast("Code is required", 'error');
    return;
  }

  // Log the API URL for debugging
  console.log("=== API URL ===");
  console.log("apiLinks:", apiLinks);
  console.log("Full URL:", apiLinks + "/SaveInstallar.php");

  setIsSaving(true);

  try {
    // Try with the correct URL - note the trailing slash might be needed
    const apiUrl = apiLinks + "/SaveInstallar.php";
    
    // Prepare form data for API
    const payload = {
      // code: organisation.code,
      code: "AMRELEC",
      FUsrId: "sohaib",
      FIntCod: code,
      FIntDsc: formStore.description || "",
      FAdd001: formStore.address || "",
      FAdd002: formStore.address2 || "",
      FPhnNum: formStore.phone || "",
      FMobNum: formStore.mobile || "",
      FCtyCod: selectedCityCode || "",
      FInsCod: formStore.accountCode || "",
      FInsSts: formStore.status || "",
      FNicNum: formStore.nic || "",
      FJazNum: formStore.jcNumber || "",
      FJazNam: formStore.jcName || "",
      FEspNum: formStore.epNumber || "",
      FEspNam: formStore.epName || "",
      FBnkNam: formStore.bank || "",
      FAccNum: formStore.accountNumber || "",
      FIntPer: "",
    };

    // Log the payload for debugging
    console.log("=== SAVE PAYLOAD ===");
    console.log("Payload:", payload);

    // Build form data string manually to ensure proper format
    const formDataString = Object.keys(payload)
      .map(key => encodeURIComponent(key) + '=' + encodeURIComponent(payload[key]))
      .join('&');
    
    console.log("Form data string:", formDataString);

    // Try with fetch API instead of axios to see if it's an axios-specific issue
    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: formDataString,
    });

    const responseText = await response.text();
    console.log("=== SAVE RESPONSE ===");
    console.log("Response status:", response.status);
    console.log("Response text:", responseText);

    // Try to parse response as JSON if possible
    let responseData;
    try {
      responseData = JSON.parse(responseText);
    } catch (e) {
      responseData = { message: responseText };
    }

    if (response.status === 200) {
      console.log("Save successful:", responseData);
      showToast("Form saved successfully!", 'success');
      resetForm();
    } else {
      console.error("Save failed with status:", response.status, responseData);
      showToast(`Save failed: ${response.status} - ${responseData.message || responseText}`, 'error');
    }
  } catch (error) {
    console.error("=== SAVE ERROR ===");
    console.error("Error:", error);
    showToast("Error saving data: " + (error.message || 'Unknown error'), 'error');
  } finally {
    setIsSaving(false);
  }
};

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Form submission prevented - use Save button");
  };

  const handleUnlabeledFocus = () => {
    setShowDescriptionInUnlabeled(true);
  };

  const handleUnlabeledBlur = () => {
    setShowDescriptionInUnlabeled(false);
  };

  const handleReturn = () => {
    console.log("Return button clicked");
  };

  const handleNew = () => {
    console.log("New button clicked");
    resetFormKeepCodeAndStatus();
  };

  return (
    <div className="el-page-host">
      <div className="el-page-wrapper">
        <div className="el-page">
          <div className="el-card">
            <form onSubmit={handleSubmit}>
              {/* Header */}
              <header className="el-header">
                <h1>Installer Maintenance</h1>
                <p className="el-subtitle">
                  Enter the Installar Maintenance information in the form below
                </p>
              </header>

              {/* Scrollable Body */}
              <div className="el-scrollable-body">
                {/* TOP BAR: Code + Status */}
                <div className="el-top-bar">
                  <div
                    className="el-field-row"
                    onKeyDownCapture={(e) => {
                      // Intercept Enter in the capture phase so it always fires,
                      // even if the Code value is selected/highlighted, and
                      // regardless of InstallationCode's internal key handling.
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        e.stopPropagation();
                        // Trigger the existing installation-data API using the
                        // current Code value, then move focus to Status.
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
                  {/* LEFT COLUMN */}
                  <div className="el-main-content">
                    {/* Personal Information - No heading */}
                    <section className="el-section">
                      <div className="el-stack">
                        {/* NIC # field - moved before Description */}
                        <div className="el-field-row">
                          <span className="el-field-label-right">NIC # :</span>
                          <input
                            ref={nicInputRef}
                            value={formStore.nic}
                            onChange={set("nic")}
                            placeholder="Enter NIC #"
                            className="fixed-width-field"
                            onKeyDown={handleNicEnter}
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
                            type="email"
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
                              onKeyDown={(e) => handleKeyDown(e, mobileInputRef)}
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
                              onKeyDown={(e) => handleKeyDown(e, citySelectRef)}
                            />
                          </div>
                        </div>

                        <div className="el-field-row">
                          <span className="el-field-label-right">City :</span>

                          <div ref={citySelectRef}>
                            <CitySelect
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
                              onKeyDown={(e) => {
                                // Only intercept Enter - leave arrow keys / typeahead
                                // to the native select for picking options.
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

                        <div className="el-field-row">
                          <span className="el-field-label-right">
                            JC Name :
                          </span>
                          <input
                            ref={jcNameInputRef}
                            value={formStore.jcName}
                            onChange={set("jcName")}
                            placeholder="Enter JC Name"
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
                            onKeyDown={(e) => handleKeyDown(e, accountCodeInputRef)}
                          />
                        </div>
                      </div>
                    </section>
                  </div>
                </div>
              </div>

              {/* A/C Code Section */}
              <div className="el-account-code-section">
                <div className="el-account-code-row">
                  <span className="el-field-label-right">A/C Code :</span>
                  <input
                    ref={accountCodeInputRef}
                    className="el-account-code-input"
                    value={formStore.accountCode}
                    onChange={set("accountCode")}
                    placeholder="Enter A/C Code"
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        e.stopPropagation();
                        // Move focus to Save button
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

              {/* Buttons */}
              <FormButtons 
                saveText="Save" 
                returnText="Return" 
                newText="New"
                onSave={handleSave}
                onReturn={handleReturn}
                onNew={handleNew}
                saveButtonRef={saveButtonRef}
              />
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
