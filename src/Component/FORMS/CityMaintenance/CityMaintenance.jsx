// ═══════════════════════════════════════════════════════════════════════════
// CITY MAINTENANCE — Config-driven + SysControl integrated
// ═══════════════════════════════════════════════════════════════════════════

import React, { useState, useEffect, useRef, useCallback } from "react";
import "./citymaintenance.css";
import { useTheme } from "../../../ThemeContext";
import axios from "axios";
import {
  getUserData,
  getOrganisationData,
  getLocationnumber,
} from "../../../Component/Auth";
import FormButtons from "../components/FormButton";
import InstallationCode from "../components/InstallarCode";
import SearchModal from "../components/SearchModel";

// ═══════════════════════════════════════════════════════════════════════════
// SECTION 1 — CONFIG
// ═══════════════════════════════════════════════════════════════════════════

const FORM_FIELDS = {
  status:      { default: "Active" },
  description: { default: "" },
};

const DROPDOWN_STATES = [];

const API_VARIABLES = {
  endpoints: {
    newCode:      "/NewCity.php",
    getByCode:    "/GetCity.php",
    getList:      "/GetCities.php",
    save:         "/SaveCity.php",
    searchByCode: "/GetCities.php",
  },

  saveMap: {
    code:      { source: "orgCode", fallback: "DEMOINS" },
    FLocCod:   { source: "locCode", fallback: "001" },
    FUsrId:    { source: "userId", fallback: "sohaib" },

    // ⭐ City API save fields
    FCtyCod:   { source: "code" },
    FCtyDsc:   { field: "description" },
    FCtySts:   { field: "status", transform: "statusToApi" },
  },

  getMap: {
    description: "tctydsc",
    status:      { key: "tctysts", transform: "apiToStatus" },
  },

  getDropdownCodes: {},

  validResponseKeys: ["tctycod", "tctydsc"],
};

const IMAGE_CONFIG = null;
const DOCUMENT_CONFIG = null;
const MOBILE_CONFIG = null;

const ENTER_FLOW = [
  "status",
  "description",
];

const TOASTS = {
  found:    "City Data Found",
  notFound: "City Not Found",
  updated:  "City Updated Successfully",
  created:  "New City Added Successfully",
  savingFailed: "Error saving data",
};

const CODE_FORMAT = "short";
const CODE_PREFIX = "";
const IMAGE_SERVER_BASE = "https://crystalsolutions.pk/DI";

const CITY_CONFIG = {
  FORM_FIELDS,
  DROPDOWN_STATES,
  API_VARIABLES,
  IMAGE_CONFIG,
  DOCUMENT_CONFIG,
  MOBILE_CONFIG,
  ENTER_FLOW,
  TOASTS,
  CODE_FORMAT,
  CODE_PREFIX,
  IMAGE_SERVER_BASE,
};

// ═══════════════════════════════════════════════════════════════════════════
// SECTION 2 — HELPERS
// ═══════════════════════════════════════════════════════════════════════════

const todayISO = () => {
  const d = new Date();
  const yyyy = d.getFullYear();
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const dd = String(d.getDate()).padStart(2, "0");
  return `${yyyy}-${mm}-${dd}`;
};

const txt = (value) => String(value ?? "").trim();

const extractNewCode = (data) => {
  if (data === null || data === undefined) return "";
  if (Array.isArray(data)) {
    if (data.length === 0) return "";
    const first = data[0];
    if (first === null || first === undefined) return "";
    if (typeof first === "object") {
      return String(
        first.code ?? first.Code ?? first.FCtyCod ?? first.tctycod ?? ""
      ).trim();
    }
    return String(first).trim();
  }
  if (typeof data === "string") {
    let s = data.trim();
    if ((s.startsWith('"') && s.endsWith('"')) ||
        (s.startsWith("'") && s.endsWith("'"))) {
      s = s.slice(1, -1).trim();
    }
    return s;
  }
  if (typeof data === "object") {
    return String(
      data.code ?? data.Code ?? data.FCtyCod ?? data.tctycod ?? ""
    ).trim();
  }
  return "";
};

const bumpCityCode = (value) => {
  const s = String(value || "").trim();
  const digits = s.replace(/\D/g, "");
  if (!digits) return s;
  const n = parseInt(digits, 10) + 1;
  if (isNaN(n)) return s;
  return String(n).padStart(digits.length, "0");
};

const showToast = (message, type = "success") => {
  console.log("Toast:", message);
  const toast = document.createElement("div");
  const backgroundColor = type === "error" ? "#f44336" : "#4CAF50";
  toast.style.cssText = `
    position: fixed; top: 20px; right: 20px;
    background: ${backgroundColor}; color: white;
    padding: 15px 25px; border-radius: 5px; z-index: 99999;
    box-shadow: 0 4px 8px rgba(0,0,0,0.2);
    font-family: Arial, sans-serif; font-size: 14px;
  `;
  toast.textContent = message;
  document.body.appendChild(toast);
  setTimeout(() => {
    document.body.removeChild(toast);
  }, 3000);
};

const focusFirstVisible = (refs) => {
  for (const ref of refs) {
    const el = ref?.current;
    if (!el) continue;
    if (!el.isConnected) continue;
    if (el.disabled) continue;
    if (el.offsetParent === null) continue;
    el.focus();
    if (el.tagName === "INPUT") {
      try { el.select(); } catch (err) {}
    }
    return true;
  }
  return false;
};

const SAVE_TRANSFORMS = {
  statusToApi: (v) => (v === "Active" ? "A" : v === "Non-Active" ? "N" : v || ""),
};

const GET_TRANSFORMS = {
  apiToStatus: (v) => (v === "A" ? "Active" : v === "N" ? "Non-Active" : v),
};

const normalizeRows = (data) => {
  let rows = data;
  if (typeof rows === "string") {
    try { rows = JSON.parse(rows); } catch (e) { rows = []; }
  }
  if (rows && !Array.isArray(rows) && typeof rows === "object") {
    const candidates = [rows.data, rows.rows, rows.result, rows.records, rows.list];
    const nested = candidates.find((c) => Array.isArray(c));
    rows = nested ? nested : [rows];
  }
  if (!Array.isArray(rows)) rows = [];
  const lower = (obj) => {
    if (!obj || typeof obj !== "object") return obj;
    const out = {};
    Object.keys(obj).forEach((k) => { out[k.toLowerCase()] = obj[k]; });
    return out;
  };
  return rows.map(lower);
};

// ═══════════════════════════════════════════════════════════════════════════
// SECTION 3 — useMaintenanceForm HOOK
// ═══════════════════════════════════════════════════════════════════════════

function useMaintenanceForm({ config }) {
  const { apiLinks, getLocationNumber } = useTheme();
  const locationnumber = getLocationnumber();
  const user = getUserData();

  const {
    FORM_FIELDS,
    DROPDOWN_STATES,
    API_VARIABLES,
    ENTER_FLOW,
    TOASTS,
  } = config;

  const buildInitialForm = useCallback(() => {
    const out = {};
    Object.entries(FORM_FIELDS).forEach(([k, v]) => {
      out[k] = v.default === "today" ? todayISO() : (v.default ?? "");
    });
    return out;
  }, [FORM_FIELDS]);

  const [formStore, setFormStore] = useState(buildInitialForm);
  const [code, setCode] = useState("");
  const [maxCode, setMaxCode] = useState("");
  const [organisation, setOrganisation] = useState(null);
//   const [orgCode, setOrgCode] = useState("DEMOINS");
//   const [locCode, setLocCode] = useState("001");

const [orgCode, setOrgCode] = useState(organisation);
const [locCode, setLocCode] = useState(locationnumber || getLocationNumber);


  const [isInitialLoad, setIsInitialLoad] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isCoolingDown, setIsCoolingDown] = useState(false);
  const [isFetchingNextCode, setIsFetchingNextCode] = useState(false);
  const [isExisting, setIsExisting] = useState(false);

  const [sysControl, setSysControl] = useState(null);

  const [isSearchModalOpen, setIsSearchModalOpen] = useState(false);

  const [dropdownCodes, setDropdownCodes] = useState(() => {
    const out = {};
    (DROPDOWN_STATES || []).forEach((k) => { out[k] = ""; });
    return out;
  });

  const refs = useRef({});
  Object.keys(FORM_FIELDS).forEach((k) => {
    if (!refs.current[k]) refs.current[k] = React.createRef();
  });
  const codeInputRef = useRef(null);
  const saveButtonRef = useRef(null);

  const fetchCallIdRef = useRef(0);
  const isSavingRef = useRef(false);
  const isCoolingDownRef = useRef(false);
  const listRef = useRef([]);
  const lastSavedCodeRef = useRef("");

  const vis = useCallback((key) => {
    try {
      if (!sysControl) return true;
      const v = sysControl[key];
      if (v === undefined || v === null) return true;
      return String(v).trim().toLowerCase() === "yes";
    } catch (err) {
      console.error(">>> vis() error for key:", key, err);
      return true;
    }
  }, [sysControl]);

  const setField = useCallback((key) => (e) => {
    const value = e.target.value;
    setFormStore((prev) => ({ ...prev, [key]: value }));
  }, []);

  const handleKeyDown = useCallback((e, nextFieldName) => {
    if (e.key !== "Enter") return;
    e.preventDefault();
    e.stopPropagation();
    if (nextFieldName) {
      const nextRef = refs.current[nextFieldName];
      if (nextRef && focusFirstVisible([nextRef])) return;
    }
    const active = document.activeElement;
    const idx = ENTER_FLOW.findIndex((k) => refs.current[k]?.current === active);
    if (idx === -1) return;
    const remaining = ENTER_FLOW.slice(idx + 1).map((k) => refs.current[k]);
    focusFirstVisible(remaining);
  }, [ENTER_FLOW]);

  const clearForm = useCallback(() => {
    setFormStore(buildInitialForm());
    const emptyCodes = {};
    (DROPDOWN_STATES || []).forEach((k) => { emptyCodes[k] = ""; });
    setDropdownCodes(emptyCodes);
  }, [buildInitialForm, DROPDOWN_STATES]);

  useEffect(() => {
    const orgData = getOrganisationData();
    setOrganisation(orgData);
    if (orgData) {
      const derived =
        orgData.code || orgData.organization || orgData.orgcode ||
        orgData.OrgCode || orgData.FOrgCod;
      if (derived && String(derived).trim() !== "") {
        setOrgCode(String(derived).trim());
      }
    }
    let derivedLoc = "";
    if (typeof getLocationNumber === "function") {
      try { derivedLoc = getLocationNumber(); } catch (e) {}
    }
    if ((!derivedLoc || String(derivedLoc).trim() === "") && locationnumber) {
      derivedLoc = locationnumber;
    }
    if (derivedLoc && String(derivedLoc).trim() !== "") {
      setLocCode(String(derivedLoc).trim());
    }
  }, []);

  useEffect(() => {
    if (!organisation || !orgCode) return;

    const apiUrl = apiLinks + "/GetSysControl.php";
    const formData = new URLSearchParams({
      code: orgCode,
      type: "cityMaintenance",
    }).toString();

    axios
      .post(apiUrl, formData)
      .then((response) => {
        let obj = response.data;
        if (typeof obj === "string") {
          try { obj = JSON.parse(obj); } catch (e) { obj = null; }
        }
        if (Array.isArray(obj) && obj.length > 0 && typeof obj[0] === "object") {
          obj = obj[0];
        }
        if (obj && typeof obj === "object" && !Array.isArray(obj)) {
          setSysControl(obj);
        } else {
          setSysControl({});
        }
      })
      .catch((error) => {
        console.error(">>> GetSysControl error:", error);
        setSysControl({});
      });
  }, [organisation, orgCode, apiLinks]);

  const loadNewCode = useCallback((showFetchingFlag = false, opts = {}) => {
    if (!organisation || !orgCode || !locCode) return Promise.resolve();
    if (showFetchingFlag) setIsFetchingNextCode(true);
    const apiUrl = apiLinks + API_VARIABLES.endpoints.newCode;
    const formData = new URLSearchParams({
      code: orgCode,
      FLocCod: locCode,
    }).toString();
    return axios.post(apiUrl, formData)
      .then((response) => {
        let newCode = extractNewCode(response.data);
        if (newCode && lastSavedCodeRef.current &&
            newCode === lastSavedCodeRef.current) {
          newCode = bumpCityCode(newCode);
        }
        if (newCode !== "") {
          if (!opts.skipSetCode) setCode(newCode);
          setMaxCode(newCode);
        }
        return newCode;
      })
      .catch((err) => {
        console.error("New code fetch error:", err);
        return "";
      })
      .finally(() => {
        if (showFetchingFlag) setIsFetchingNextCode(false);
      });
  }, [organisation, orgCode, locCode, apiLinks, API_VARIABLES]);

  useEffect(() => {
    if (!organisation || !orgCode || !locCode) return;
    loadNewCode(false);
  }, [organisation, orgCode, locCode]);

  useEffect(() => {
    if (code && isInitialLoad) {
      const t = setTimeout(() => {
        const input = codeInputRef.current?.querySelector?.("input");
        if (input) { input.focus(); input.select(); }
        setIsInitialLoad(false);
      }, 100);
      return () => clearTimeout(t);
    }
  }, [code, isInitialLoad]);

  const buildSavePayload = useCallback(() => {
    const payload = {};
    const map = API_VARIABLES.saveMap || {};
    Object.entries(map).forEach(([apiVar, def]) => {
      if (def.constant !== undefined) {
        payload[apiVar] = def.constant;
        return;
      }
      if (def.source === "orgCode") { payload[apiVar] = orgCode; return; }
      if (def.source === "locCode") { payload[apiVar] = locCode; return; }
      if (def.source === "userId") {
        payload[apiVar] = String(user?.tusrid || def.fallback || "").trim();
        return;
      }
      if (def.source === "code") { payload[apiVar] = String(code || "").trim(); return; }
      if (def.state) {
        payload[apiVar] = String(dropdownCodes[def.state] || "").trim();
        return;
      }
      if (def.field) {
        let raw = formStore[def.field];
        if (def.transform && SAVE_TRANSFORMS[def.transform]) {
          raw = SAVE_TRANSFORMS[def.transform](raw);
        } else {
          raw = raw === null || raw === undefined ? "" : String(raw).trim();
        }
        payload[apiVar] = raw;
      }
    });
    return payload;
  }, [API_VARIABLES, code, dropdownCodes, formStore, orgCode, locCode, user]);

  const save = useCallback(async () => {
    if (isSavingRef.current || isCoolingDownRef.current) return;
    isSavingRef.current = true;

    if (!organisation) {
      showToast("Organisation data not available", "error");
      isSavingRef.current = false;
      return;
    }
    if (isFetchingNextCode) {
      showToast("Please wait, fetching next code...", "error");
      isSavingRef.current = false;
      return;
    }
    const trimmedCode = String(code || "").trim();
    if (!trimmedCode) {
      showToast("Code is required", "error");
      isSavingRef.current = false;
      return;
    }

    // ⭐ Description required check
    const trimmedDesc = String(formStore.description || "").trim();
    if (!trimmedDesc && FORM_FIELDS.description) {
      showToast("Please enter Description", "error");
      isSavingRef.current = false;
      const el = refs.current.description?.current;
      if (el) { el.focus(); el.select?.(); }
      return;
    }

    setIsSaving(true);

    try {
      const apiUrl = apiLinks + API_VARIABLES.endpoints.save;
      const payload = buildSavePayload();
      payload.FCtyCod = trimmedCode;

      console.log("=== SAVE PAYLOAD ===");
      console.log(JSON.stringify(payload, null, 2));

      const formData = new FormData();
      Object.entries(payload).forEach(([k, v]) => {
        formData.append(k, v == null ? "" : v);
      });

      const wasExisting = isExisting;
      const response = await axios.post(apiUrl, formData, { validateStatus: () => true });
      const body = response.data;
      const bodyObj = body && typeof body === "object" ? body : null;
      const bodyHardFail = !!(bodyObj && bodyObj.error != null && Number(bodyObj.error) >= 400);

      await loadList();
      const rows = Array.isArray(listRef.current) ? listRef.current : [];
      const descOf = (r) => String(r && r.tctydsc != null ? r.tctydsc : "").trim();
      const codeOf = (r) => String(r && r.tctycod != null ? r.tctycod : "").trim();

      let savedRow = null;
      if (wasExisting) {
        savedRow = rows.find((r) => codeOf(r) === trimmedCode && descOf(r) === trimmedDesc)
          || rows.find((r) => codeOf(r) === trimmedCode);
        if (savedRow && descOf(savedRow) && descOf(savedRow) !== trimmedDesc) {
          savedRow = null;
        }
      } else {
        const matches = rows.filter((r) => descOf(r) === trimmedDesc);
        matches.sort((a, b) => Number(b.id || 0) - Number(a.id || 0));
        savedRow = matches[0] || null;
      }

      if (savedRow && !bodyHardFail) {
        const actualCode = codeOf(savedRow) || trimmedCode;
        lastSavedCodeRef.current = actualCode;
        showToast(wasExisting ? TOASTS.updated : TOASTS.created, "success");
        if (!wasExisting && actualCode !== trimmedCode) {
          showToast(`Saved with code ${actualCode}`, "success");
        }

        clearForm();
        setIsExisting(false);

        const nextCode = await loadNewCode(true, { skipSetCode: true });
        const finalCode = nextCode || bumpCityCode(actualCode);
        setCode(finalCode);
        setMaxCode(finalCode);

        setTimeout(() => {
          const input = codeInputRef.current?.querySelector?.("input");
          if (input) { input.focus(); input.select(); }
        }, 150);

        isCoolingDownRef.current = true;
        setIsCoolingDown(true);
        setTimeout(() => {
          isCoolingDownRef.current = false;
          setIsCoolingDown(false);
        }, 5000);
      } else {
        const reason = response.status === 200 && !bodyHardFail
          ? "Save accepted but record not found in list"
          : `Save failed: ${response.status}${bodyObj && bodyObj.message ? ` — ${String(bodyObj.message).slice(0, 80)}` : ""}`;
        showToast(reason, "error");
      }
    } catch (error) {
      console.error("=== SAVE ERROR ===", error);
      let msg = TOASTS.savingFailed;
      const data = error.response?.data;
      if (typeof data === "string" && data.trim()) msg = data.trim();
      else if (data && typeof data === "object") msg = data.message || data.error || msg;
      showToast(String(msg).slice(0, 200), "error");
    } finally {
      setIsSaving(false);
      isSavingRef.current = false;
    }
  }, [organisation, isFetchingNextCode, code, formStore, isExisting,
      buildSavePayload, apiLinks, API_VARIABLES, TOASTS,
      clearForm, loadNewCode, FORM_FIELDS]);

  const fetchByCode = useCallback((cityCode) => {
    const cleanCode = String(cityCode || "").trim();
    if (!organisation || !orgCode || !locCode || !cleanCode) return Promise.resolve();

    clearForm();
    setIsExisting(false);

    const callId = ++fetchCallIdRef.current;
    const apiUrl = apiLinks + API_VARIABLES.endpoints.getByCode;
    const formData = new URLSearchParams({
      code: orgCode,
      FLocCod: locCode,
      FCtyCod: cleanCode,
    }).toString();

    return axios.post(apiUrl, formData).then((response) => {
      if (callId !== fetchCallIdRef.current) return;
      const rows = normalizeRows(response.data);
      const data = rows.find((r) =>
        API_VARIABLES.validResponseKeys.some((k) => r[k] !== undefined)
      ) || (rows.length === 1 ? rows[0] : undefined);

      if (!data) {
        setIsExisting(false);
        showToast(TOASTS.notFound, "error");
        return;
      }

      const newForm = { ...buildInitialForm() };
      Object.entries(API_VARIABLES.getMap || {}).forEach(([field, def]) => {
        let raw;
        let transformName = null;
        if (typeof def === "string") {
          raw = data[def];
        } else if (def && typeof def === "object") {
          raw = data[def.key];
          transformName = def.transform;
        }
        if (raw === undefined || raw === null) return;
        if (transformName && GET_TRANSFORMS[transformName]) {
          raw = GET_TRANSFORMS[transformName](raw);
        } else {
          raw = String(raw).trim();
        }
        newForm[field] = raw;
      });

      setFormStore(newForm);

      if (data.tctycod) {
        setCode(String(data.tctycod).trim());
        setIsExisting(true);
      }

      showToast(TOASTS.found, "success");
    }).catch((error) => {
      if (callId !== fetchCallIdRef.current) return;
      console.error("GetByCode error:", error);
    });
  }, [organisation, orgCode, locCode, apiLinks, API_VARIABLES,
      TOASTS, clearForm, buildInitialForm]);

  const loadList = useCallback(() => {
    if (!organisation || !orgCode || !locCode) return Promise.resolve();
    const apiUrl = apiLinks + API_VARIABLES.endpoints.getList;
    const formData = new URLSearchParams({
      code: orgCode,
      FLocCod: locCode,
    }).toString();
    return axios.post(apiUrl, formData)
      .then((response) => {
        const rows = normalizeRows(response.data);
        listRef.current = rows;
      })
      .catch((error) => {
        console.error("List load error:", error);
        listRef.current = [];
      });
  }, [organisation, orgCode, locCode, apiLinks, API_VARIABLES]);

  useEffect(() => {
    loadList();
  }, [organisation, orgCode, locCode]);

  const reset = useCallback(() => {
    clearForm();
    setCode("");
    setMaxCode("");
    setIsExisting(false);
    setTimeout(() => {
      const input = codeInputRef.current?.querySelector?.("input");
      if (input) { input.focus(); input.select(); }
    }, 150);
    loadNewCode(true).then((newCode) => {
      if (newCode) {
        setTimeout(() => {
          const input = codeInputRef.current?.querySelector?.("input");
          if (input) { input.focus(); input.select(); }
        }, 100);
      }
    });
  }, [clearForm, loadNewCode]);

  const handleSearchSelect = useCallback((data) => {
    if (!data) return;
    const selectedCode =
      data.code ?? data.tctycod ?? data.Code ?? data.FCtyCod ?? "";
    const clean = String(selectedCode || "").trim();
    if (!clean) return;
    setCode(clean);
    fetchByCode(clean);
  }, [fetchByCode]);

  const handleCodeChange = useCallback((newCode) => {
    const clean = String(newCode || "").trim();
    if (!clean) return;
    fetchByCode(clean);
  }, [fetchByCode]);

  const handleSearchModalClose = useCallback(() => {
    setIsSearchModalOpen(false);
    setTimeout(() => {
      const input = codeInputRef.current?.querySelector?.("input");
      if (input) { input.focus(); input.select(); }
    }, 100);
  }, []);

  return {
    formStore,
    code,
    maxCode,
    organisation,
    orgCode,
    locCode,
    isInitialLoad,
    isSaving,
    isCoolingDown,
    isFetchingNextCode,
    isExisting,
    dropdownCodes,
    isSearchModalOpen,
    sysControl,
    vis,

    refs,
    codeInputRef,
    saveButtonRef,

    setCode,
    setMaxCode,
    setField,
    setFormStore,

    setIsSearchModalOpen,

    save,
    reset,
    fetchByCode,
    loadList,
    loadNewCode,
    handleSearchSelect,
    handleCodeChange,
    handleSearchModalClose,
    handleKeyDown,

    config,
  };
}

// ═══════════════════════════════════════════════════════════════════════════
// SECTION 4 — MAIN COMPONENT + JSX
// ═══════════════════════════════════════════════════════════════════════════

export default function CityMaintenance() {
  const { apiLinks, getLocationNumber } = useTheme();
  const form = useMaintenanceForm({ config: CITY_CONFIG });
  const {
    formStore,
    code,
    maxCode,
    organisation,
    isInitialLoad,
    isSaving,
    isCoolingDown,
    isFetchingNextCode,
    isSearchModalOpen,
    refs,
    codeInputRef,
    saveButtonRef,
    setCode,
    setMaxCode,
    setField,
    setIsSearchModalOpen,
    save,
    reset,
    fetchByCode,
    handleSearchSelect,
    handleCodeChange,
    handleSearchModalClose,
    handleKeyDown,
  } = form;

  const handleSubmit = (e) => e.preventDefault();

  const R = (name) => refs.current[name];
  const V = (name) => formStore[name];

  const focusFirstFromTopBar = () => {
    const first = ["status", "description"]
      .map((k) => R(k))
      .filter(Boolean);
    for (const r of first) {
      const el = r?.current;
      if (el && el.isConnected && !el.disabled && el.offsetParent !== null) {
        el.focus();
        if (el.tagName === "INPUT") el.select();
        return;
      }
    }
  };

  return (
    <div className="el-page-host city-maintenance-scope">
      <div className="el-page-wrapper">
        <div className="el-page">
          <div className="el-card">
            <form onSubmit={handleSubmit}>
              <header className="el-header">
                <h1>City Maintenance</h1>
                <p className="el-subtitle">
                  Enter the City information in the form below
                </p>
              </header>

              <div className="el-scrollable-body">
                {/* ==================== TOP BAR ==================== */}
                <div className="el-top-bar">
                  <div
                    className="el-field-row code-alignment"
                    onKeyDownCapture={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault();
                        e.stopPropagation();
                        fetchByCode(code);
                        focusFirstFromTopBar();
                      }
                    }}
                  >
                    <span className="el-field-label-right">Code :</span>
                    <InstallationCode
                      ref={codeInputRef}
                      organisation={organisation}
                      apiLinks={apiLinks}
                      apiEndpoint={API_VARIABLES.endpoints.newCode}
                      getLocationNumber={getLocationNumber}
                      getLocationnumber={getLocationnumber}
                      code={code}
                      setCode={setCode}
                      onKeyDown={(e) => handleKeyDown(e, "status")}
                      onDoubleClick={() => setIsSearchModalOpen(true)}
                      onCodeChange={handleCodeChange}
                      maxCode={maxCode}
                      onMaxCodeChange={setMaxCode}
                      codeFormat={CODE_FORMAT}
                      codePrefix={CODE_PREFIX}
                    />
                  </div>

                  <div className="el-field-row">
                    <span className="el-field-label-right">Status :</span>
                    <select
                      ref={R("status")}
                      value={V("status")}
                      onChange={setField("status")}
                      onKeyDown={(e) => handleKeyDown(e, "description")}
                    >
                      {["Active", "Non-Active"].map((opt) => (
                        <option key={opt} value={opt}>{opt}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="el-body">
                  <div className="el-main-content">
                    <section className="el-section">
                      <div className="el-stack">

                        {/* ====== DESCRIPTION ====== */}
                        <div className="el-field-row">
                          <span className="el-field-label-right">Description :</span>
                          <input
                            ref={R("description")}
                            value={V("description")}
                            onChange={(e) => {
                              e.target.value = e.target.value.toUpperCase();
                              setField("description")(e);
                            }}
                            placeholder="City Description"
                            maxLength={60}
                            onKeyDown={(e) => handleKeyDown(e, null)}
                            style={{ textTransform: "uppercase" }}
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
                onSave={save}
                onReturn={() => console.log("Return clicked")}
                onNew={reset}
                saveButtonRef={saveButtonRef}
                disabled={isSaving || isCoolingDown || isFetchingNextCode}
              />
            </form>
          </div>
        </div>
      </div>

      {/* ====== SEARCH MODAL ====== */}
      <SearchModal
        isOpen={isSearchModalOpen}
        onClose={handleSearchModalClose}
        onSelectInstaller={handleSearchSelect}
        apiLinks={apiLinks}
        apiEndpoint={API_VARIABLES.endpoints.searchByCode}
        title="Select City"
        codeKey="tctycod"
        descriptionKey="tctydsc"
      />
    </div>
  );
}