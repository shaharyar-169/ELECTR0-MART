// ═══════════════════════════════════════════════════════════════════════════
// TECHNICIAN MAINTENANCE — Config-driven + SysControl integrated
// ═══════════════════════════════════════════════════════════════════════════

import React, { useState, useEffect, useRef, useCallback } from "react";
import "./technicianmaintenance.css";
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
import DynamicSelect from "../components/CityDropdown";

// ═══════════════════════════════════════════════════════════════════════════
// SECTION 1 — CONFIG
// ═══════════════════════════════════════════════════════════════════════════

const FORM_FIELDS = {
  status:           { default: "Active" },
  name:             { default: "" },
  businessName:     { default: "" },
  address1:         { default: "" },
  address2:         { default: "" },
  cnic:             { default: "" },
  email:            { default: "" },
  mobile:           { default: "" },
  emergencyNo:      { default: "" },
  city:             { default: "" },
  area:             { default: "" },
  commissionCode:   { default: "" },
  commissionText:   { default: "" },
  dobDate:          { default: "today" },
  joinDate:         { default: "today" },
  leaveDate:        { default: "today" },
  leaveRemarks:     { default: "" },
  maxJob:           { default: "" },
  comType:          { default: "1" },
  commission:       { default: "" },
  reference1:       { default: "" },
  reference1Mobile: { default: "" },
  reference2:       { default: "" },
  reference2Mobile: { default: "" },
  remarks:          { default: "" },
  documentName:     { default: "" },
};

const DROPDOWN_STATES = [
  "selectedCityCode",
  "selectedAreaCode",
];

const API_VARIABLES = {
  endpoints: {
    newCode:      "/NewTechnician.php",
    getByCode:    "/GetTechnician.php",
    getList:      "/GetTechnicians.php",
    save:         "/SaveTechnician.php",
    searchByCode: "/GetTechnicians.php",
  },

  saveMap: {
    code:      { source: "orgCode", fallback: "ANEXCOMP" },
    FLocCod:   { source: "locCode", fallback: "001" },
    FUsrId:    { source: "userId", fallback: "sohaib" },

    FTchCod:   { source: "code" },
    FTchSts:   { field: "status", transform: "statusToApi" },
    FTchNam:   { field: "name" },
    FBusNam:   { field: "businessName" },
    FAdd001:   { field: "address1" },
    FAdd002:   { field: "address2" },
    FNicNum:   { field: "cnic", transform: "stripDashes" },
    FEmlAdd:   { field: "email" },
    FMobNum:   { field: "mobile" },
    FPhnNum:   { field: "emergencyNo" },

    FCtyCod:   { state: "selectedCityCode" },
    FAreCod:   { state: "selectedAreaCode" },

    FTchDob:   { field: "dobDate",  transform: "toApiDateFallback" },
    FJonDat:   { field: "joinDate", transform: "toApiDateFallback" },
    FLevDat:   { field: "leaveDate", transform: "toApiDateFallback" },
    FLevRem:   { field: "leaveRemarks" },

    FJobLim:   { field: "maxJob", transform: "toJobLim" },
    FComTyp:   { field: "comType", transform: "toComTyp" },
    FComPrc:   { field: "commission", transform: "toAmount" },

    FRef001:   { field: "reference1" },
    FMob001:   { field: "reference1Mobile" },
    FRef002:   { field: "reference2" },
    FMob002:   { field: "reference2Mobile" },

    FTchRem:   { field: "remarks" },
    FAccCod:   { field: "commissionCode" },
  },

  getMap: {
    status:           { key: "ttchsts", transform: "apiToStatus" },
    name:             "ttchnam",
    businessName:     "tbusnam",
    address1:         "tadd001",
    address2:         "tadd002",
    cnic:             { key: "tnicnum", transform: "formatCnic" },
    email:            "temladd",
    mobile:           "tmobnum",
    emergencyNo:      "tphnnum",
    leaveRemarks:     "tlevrem",
    maxJob:           "tjoblim",
    comType:          "tcomtyp",
    commission:       { key: "tcomprc", transform: "formatCommas" },
    reference1:       "tref001",
    reference1Mobile: "tmob001",
    reference2:       "tref002",
    reference2Mobile: "tmob002",
    remarks:          "ttchrem",

    dobDate:          { key: "ttchdob", transform: "toInputDate" },
    joinDate:         { key: "tjondat", transform: "toInputDate" },
    leaveDate:        { key: "tlevdat", transform: "toInputDate" },
  },

  getDropdownCodes: {
    selectedCityCode: "tctycod",
    selectedAreaCode: "tarecod",
  },

  validResponseKeys: ["ttchcod", "ttchnam"],
};

const IMAGE_CONFIG = {
  technician: {
    saveKey: "FTchPic",
    getKeys: ["ttchpic"],
    label: "Technician",
  },
};

const DOCUMENT_CONFIG = {
  saveKey: "FTchDoc",
  getKeys: ["ttchdoc"],
  fieldName: "documentName",
  maxSizeMB: 10,
  accept: ".pdf,.doc,.docx,.xls,.xlsx,.txt,.csv,.png,.jpg,.jpeg",
};

const MOBILE_CONFIG = null;

const ENTER_FLOW = [
  "status",
  "name", "businessName",
  "address1", "address2",
  "cnic", "email", "mobile", "emergencyNo",
  "city", "area",
  "commissionCode", "commissionText",
  "dobDate", "joinDate",
  "leaveDate", "leaveRemarks",
  "maxJob", "comType", "commission",
  "reference1Mobile", "reference1",
  "reference2Mobile", "reference2",
  "documentName", "remarks",
];

const TOASTS = {
  found:    "Technician Data Found",
  notFound: "Technician Not Found",
  updated:  "Technician Updated Successfully",
  created:  "New Technician Added Successfully",
  savingFailed: "Error saving data",
};

const CODE_FORMAT = "short";
const CODE_PREFIX = "";
const IMAGE_SERVER_BASE = "https://crystalsolutions.pk/DI";

const TECHNICIAN_CONFIG = {
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

const formatWithCommas = (value) => {
  const raw = String(value ?? "").trim();
  if (raw === "") return "";
  const cleaned = raw.replace(/[^0-9.]/g, "");
  const firstDot = cleaned.indexOf(".");
  let intPart;
  let decPart = "";
  if (firstDot === -1) {
    intPart = cleaned;
  } else {
    intPart = cleaned.slice(0, firstDot);
    decPart = cleaned.slice(firstDot + 1).replace(/\./g, "");
  }
  const grouped = intPart.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  return decPart !== "" ? `${grouped}.${decPart}` : grouped;
};

const cleanAmount = (value) => {
  if (value === null || value === undefined || value === "") return "";
  const num = String(value).replace(/,/g, "").trim();
  const parsed = parseFloat(num);
  return isNaN(parsed) ? "" : parsed;
};

const txt = (value) => String(value ?? "").trim();

const toInputDate = (val) => {
  if (!val) return "";
  const d = new Date(val);
  if (isNaN(d.getTime())) return "";
  const yyyy = d.getFullYear();
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const dd = String(d.getDate()).padStart(2, "0");
  return `${yyyy}-${mm}-${dd}`;
};

const formatCNIC = (value) => {
  const digits = String(value || "").replace(/\D/g, "");
  const limited = digits.slice(0, 13);
  if (limited.length <= 5) return limited;
  if (limited.length <= 12) return `${limited.slice(0, 5)}-${limited.slice(5)}`;
  return `${limited.slice(0, 5)}-${limited.slice(5, 12)}-${limited.slice(12, 13)}`;
};

const extractNewCode = (data) => {
  if (data === null || data === undefined) return "";
  if (Array.isArray(data)) {
    if (data.length === 0) return "";
    const first = data[0];
    if (first === null || first === undefined) return "";
    if (typeof first === "object") {
      return String(
        first.code ?? first.Code ?? first.FTchCod ?? first.ttchcod ?? ""
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
      data.code ?? data.Code ?? data.FTchCod ?? data.ttchcod ?? ""
    ).trim();
  }
  return "";
};

const showToast = (message, type = "success") => {
  console.log("Toast:", message);
  const toast = document.createElement("div");
  const backgroundColor = type === "error" ? "#f44336" : "#4CAF50";
  toast.style.cssText = `
    position: fixed; top: 20px; right: 20px;
    background: ${backgroundColor}; color: white;
    padding: 15px 25px; border-radius: 5px; z-index: 9999;
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
    try {
      const style = window.getComputedStyle(el);
      if (style.display === "none") continue;
      if (style.visibility === "hidden") continue;
    } catch (err) {}
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
  stripDashes: (v) => String(v || "").replace(/-/g, ""),
  toAmount: (v) => {
    const parsed = cleanAmount(String(v || "").replace(/,/g, ""));
    return parsed === "" ? "0" : String(parsed);
  },
  toApiDate: (v) => (v ? toInputDate(v) : ""),
  toApiDateFallback: (v) => (v ? toInputDate(v) : toInputDate(new Date())),
  toJobLim: (v) => {
    const parsed = cleanAmount(String(v || "").replace(/,/g, ""));
    return parsed === "" ? "0" : String(parsed);
  },
  toComTyp: (v) => {
    const s = String(v ?? "").trim();
    return s || "1";
  },
};

const GET_TRANSFORMS = {
  apiToStatus: (v) => (v === "A" ? "Active" : v === "N" ? "Non-Active" : v),
  formatCnic: (v) => formatCNIC(v),
  formatCommas: (v) => formatWithCommas(v),
  toInputDate: (v) => toInputDate(v),
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

const buildImageBaseForOrg = (org, imageServerBase) => {
  return `${imageServerBase}/${String(org || "ANEXCOMP").trim()}/`;
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
    IMAGE_CONFIG,
    DOCUMENT_CONFIG,
    MOBILE_CONFIG,
    ENTER_FLOW,
    TOASTS,
    IMAGE_SERVER_BASE,
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
  const [codeKey, setCodeKey] = useState(0);   // ⭐ remount key for InstallationCode
  const [organisation, setOrganisation] = useState(null);
  // const [orgCode, setOrgCode] = useState("AGCOMP");
  // const [locCode, setLocCode] = useState("001");

const [orgCode, setOrgCode] = useState(organisation);
  const [locCode, setLocCode] = useState(locationnumber || getLocationNumber);

  const [isInitialLoad, setIsInitialLoad] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isCoolingDown, setIsCoolingDown] = useState(false);
  const [isFetchingNextCode, setIsFetchingNextCode] = useState(false);
  const [isExisting, setIsExisting] = useState(false);
  const [sysControl, setSysControl] = useState(null);

  const [isSearchModalOpen, setIsSearchModalOpen] = useState(false);
  const [isImageModalOpen, setIsImageModalOpen] = useState(false);
  const [modalImageSrc, setModalImageSrc] = useState("");

  const [images, setImages] = useState(() => {
    if (!IMAGE_CONFIG) return {};
    const out = {};
    Object.keys(IMAGE_CONFIG).forEach((k) => { out[k] = ""; });
    return out;
  });

  const [dropdownCodes, setDropdownCodes] = useState(() => {
    const out = {};
    (DROPDOWN_STATES || []).forEach((k) => { out[k] = ""; });
    return out;
  });

  const fileRefs = useRef({});
  if (IMAGE_CONFIG) {
    Object.keys(IMAGE_CONFIG).forEach((k) => {
      if (!fileRefs.current[k]) fileRefs.current[k] = React.createRef();
    });
  }
  const documentInputRef = useRef(null);

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

  const vis = useCallback((key) => {
    try {
      if (!sysControl) return true;
      const v = sysControl[key];
      if (v === undefined || v === null) return true;
      return String(v).trim().toLowerCase() === "yes";
    } catch (err) {
      return true;
    }
  }, [sysControl]);

  const setField = useCallback((key) => (e) => {
    const value = e.target.value;
    setFormStore((prev) => ({ ...prev, [key]: value }));
  }, []);

  const setDropdownCode = useCallback((stateKey, value) => {
    setDropdownCodes((prev) => ({ ...prev, [stateKey]: value }));
  }, []);

  const setImage = useCallback((slotKey, value) => {
    setImages((prev) => ({ ...prev, [slotKey]: value }));
  }, []);

  const handleCnicChange = useCallback((key) => (e) => {
    const formatted = formatCNIC(e.target.value);
    setFormStore((prev) => ({ ...prev, [key]: formatted }));
  }, []);

  const handleMoneyChange = useCallback((key) => (e) => {
    const input = e.target;
    const rawValue = String(input.value ?? "");
    const selectionStart = input.selectionStart ?? rawValue.length;
    const digitsBeforeCursor = rawValue
      .slice(0, selectionStart)
      .replace(/\D/g, "").length;
    const formatted = formatWithCommas(rawValue);
    setFormStore((prev) => ({ ...prev, [key]: formatted }));
    requestAnimationFrame(() => {
      if (!input) return;
      let digitCount = 0;
      let newCaret = formatted.length;
      for (let i = 0; i < formatted.length; i++) {
        if (/[0-9]/.test(formatted[i])) {
          digitCount++;
          if (digitCount === digitsBeforeCursor) {
            newCaret = i + 1;
            break;
          }
        }
      }
      if (digitsBeforeCursor === 0) newCaret = 0;
      try { input.setSelectionRange(newCaret, newCaret); } catch (err) {}
    });
  }, []);

  const handleDateChange = useCallback((key) => (e) => {
    const value = String(e.target.value || "");
    if (!value) {
      setFormStore((prev) => ({ ...prev, [key]: "" }));
      return;
    }
    const match = value.match(/^(\d{4,})-(\d{2})-(\d{2})$/);
    if (match) {
      const [, year, month, day] = match;
      const trimmedYear = year.slice(0, 4);
      setFormStore((prev) => ({
        ...prev,
        [key]: `${trimmedYear}-${month}-${day}`,
      }));
      return;
    }
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

  const handleDateKeyDown = useCallback((e, nextFieldName) => {
    if (e.key === "Enter") {
      e.preventDefault();
      e.stopPropagation();
      handleKeyDown(e, nextFieldName);
    }
  }, [handleKeyDown]);

  const clearForm = useCallback(() => {
    setFormStore(buildInitialForm());
    if (IMAGE_CONFIG) {
      const empty = {};
      Object.keys(IMAGE_CONFIG).forEach((k) => { empty[k] = ""; });
      setImages(empty);
    }
    const emptyCodes = {};
    (DROPDOWN_STATES || []).forEach((k) => { emptyCodes[k] = ""; });
    setDropdownCodes(emptyCodes);
    if (IMAGE_CONFIG) {
      Object.keys(IMAGE_CONFIG).forEach((k) => {
        const r = fileRefs.current[k];
        if (r && r.current) r.current.value = "";
      });
    }
    if (documentInputRef.current) documentInputRef.current.value = "";
  }, [buildInitialForm, DROPDOWN_STATES, IMAGE_CONFIG]);

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
      type: "TechnicianMaintenance",
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

  // ⭐ Auto-update commissionText when name changes
  useEffect(() => {
    const name = String(formStore.name || "").trim();
    const code = String(formStore.commissionCode || "").trim();

    if (!code) return;

    const newText = name ? `${name.toUpperCase()} - COMMISSION` : "";
    const currentText = String(formStore.commissionText || "").trim();

    if (currentText !== newText) {
      setFormStore((prev) => ({ ...prev, commissionText: newText }));
    }
  }, [formStore.name, formStore.commissionCode]);

  const loadNewCode = useCallback((showFetchingFlag = false) => {
    if (!organisation || !orgCode || !locCode) return Promise.resolve();
    if (showFetchingFlag) setIsFetchingNextCode(true);
    const apiUrl = apiLinks + API_VARIABLES.endpoints.newCode;
    const formData = new URLSearchParams({
      code: orgCode,
     FLocCod: locCode,
    }).toString();
    return axios.post(apiUrl, formData)
      .then((response) => {
        const newCode = extractNewCode(response.data);
        if (newCode !== "") {
          setCode(newCode);
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
    const trimmedName = String(formStore.name || "").trim();
    if (!trimmedName && FORM_FIELDS.name) {
      showToast("Technician Name is required", "error");
      isSavingRef.current = false;
      return;
    }

    setIsSaving(true);

    try {
      const apiUrl = apiLinks + API_VARIABLES.endpoints.save;
      const payload = buildSavePayload();
      payload.FTchCod = trimmedCode;

      console.log("=== SAVE PAYLOAD ===");
      console.log(JSON.stringify(payload, null, 2));

      const formData = new FormData();
      Object.entries(payload).forEach(([k, v]) => {
        formData.append(k, v == null ? "" : v);
      });

      if (IMAGE_CONFIG) {
        Object.entries(IMAGE_CONFIG).forEach(([slotKey, slot]) => {
          const r = fileRefs.current[slotKey];
          const file = r && r.current && r.current.files && r.current.files[0];
          if (file) formData.set(slot.saveKey, file);
        });
      }

      if (DOCUMENT_CONFIG) {
        const f = documentInputRef.current?.files?.[0];
        if (f) formData.set(DOCUMENT_CONFIG.saveKey, f);
      }

      const wasExisting = isExisting;
      const response = await axios.post(apiUrl, formData, { validateStatus: () => true });
      const body = response.data && typeof response.data === "object" ? response.data : null;
      const bodyHardFail = !!(body && body.error != null && Number(body.error) >= 400);
      const bodyMsg = body && body.message != null ? String(body.message).toLowerCase() : "";
      const bodyOk = !!(body && Number(body.error) === 200 && bodyMsg.indexOf("success") !== -1);
      const bodyNewCode = body && body.new_code != null ? String(body.new_code).trim() : "";

      await loadList();
      const rows = Array.isArray(listRef.current) ? listRef.current : [];
      const nameOf = (r) => String(r && r.ttchnam != null ? r.ttchnam : "").trim();
      const codeOf = (r) => String(r && r.ttchcod != null ? r.ttchcod : "").trim();

      let savedRow = null;
      if (wasExisting) {
        savedRow = rows.find((r) => codeOf(r) === trimmedCode && nameOf(r) === trimmedName)
          || rows.find((r) => codeOf(r) === trimmedCode);
        if (savedRow && nameOf(savedRow) && nameOf(savedRow) !== trimmedName) {
          savedRow = null;
        }
      } else {
        const matches = rows.filter((r) => nameOf(r) === trimmedName);
        matches.sort((a, b) => Number(b.techid || b.id || 0) - Number(a.techid || a.id || 0));
        savedRow = matches[0] || null;
      }

        if (!bodyHardFail && (savedRow || bodyOk)) {
        const actualCode = bodyNewCode || (savedRow && codeOf(savedRow)) || trimmedCode;
        showToast(wasExisting ? TOASTS.updated : TOASTS.created, "success");
        if (!wasExisting && actualCode && actualCode !== trimmedCode) {
          showToast(`Saved with code ${actualCode}`, "success");
        }

        // ⭐ Clear all form fields, then set the saved code + focus it
        // Do NOT call fetchByCode here — user wants a blank form for next entry
        clearForm();
        setIsExisting(false);

        setMaxCode(actualCode);
        setCode(actualCode);
        setCodeKey((k) => k + 1);   // remount InstallationCode so it shows the new code

        // Focus + select the code input after remount
        setTimeout(() => {
          const input = codeInputRef.current?.querySelector?.("input");
          if (input) {
            input.focus();
            input.select();
          }
        }, 300);

        isCoolingDownRef.current = true;
        setIsCoolingDown(true);
        setTimeout(() => {
          isCoolingDownRef.current = false;
          setIsCoolingDown(false);
        }, 5000);
      } else {
        const reason = bodyMsg
          ? `Save failed: ${response.status} — ${String(body.message).slice(0, 120)}`
          : response.status === 200
            ? "Save accepted but record not found in list"
            : `Save failed: ${response.status || "network error"}`;
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
      buildSavePayload, apiLinks, API_VARIABLES,
      IMAGE_CONFIG, DOCUMENT_CONFIG, TOASTS]);

  const fetchByCode = useCallback((techCode) => {
    const cleanCode = String(techCode || "").trim();
    if (!organisation || !orgCode || !locCode || !cleanCode) return Promise.resolve();

    clearForm();
    setIsExisting(false);

    const callId = ++fetchCallIdRef.current;
    const apiUrl = apiLinks + API_VARIABLES.endpoints.getByCode;
    const formData = new URLSearchParams({
      code: orgCode,
     FLocCod: locCode,
      FTchCod: cleanCode,
    }).toString();

    return axios.post(apiUrl, formData).then((response) => {
      if (callId !== fetchCallIdRef.current) return;
      const rows = normalizeRows(response.data);
      const data = rows.find((r) =>
        API_VARIABLES.validResponseKeys.some((k) => r[k] !== undefined)
      ) || (rows.length === 1 ? rows[0] : undefined);

      if (!data) {
        setIsExisting(false);
        setFormStore((prev) => ({
          ...prev,
          commissionCode: `22-05-0${cleanCode}`,
          commissionText: "",
        }));
        showToast(TOASTS.notFound, "error");
        return;
      }

      const codes = {};
      Object.entries(API_VARIABLES.getDropdownCodes || {}).forEach(([state, key]) => {
        codes[state] = txt(data[key]);
      });
      setDropdownCodes((prev) => ({ ...prev, ...codes }));

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

      if (data.ttchcod) {
        newForm.commissionCode = `22-05-0${String(data.ttchcod).trim()}`;
        newForm.commissionText = `${String(data.ttchnam || "").trim()} - COMMISSION`;
      } else if (cleanCode) {
        newForm.commissionCode = `22-05-0${cleanCode}`;
        newForm.commissionText = "";
      }

      if (DOCUMENT_CONFIG) {
        const docKey = DOCUMENT_CONFIG.getKeys.find((k) => data[k]);
        if (docKey) newForm[DOCUMENT_CONFIG.fieldName] = txt(data[docKey]);
      }

      setFormStore(newForm);

      if (data.ttchcod) {
        setCode(String(data.ttchcod).trim());
        setIsExisting(true);
      }

      showToast(TOASTS.found, "success");

      if (IMAGE_CONFIG) {
        Object.entries(IMAGE_CONFIG).forEach(([slotKey, slot]) => {
          const foundKey = slot.getKeys.find((k) => data[k]);
          if (!foundKey) return;
          const picName = String(data[foundKey] || "").trim();
          if (!picName) return;
          const src = picName.startsWith("data:") || picName.startsWith("blob:") ||
            picName.startsWith("http")
            ? picName
            : buildImageBaseForOrg(orgCode, IMAGE_SERVER_BASE) + picName;
          setImage(slotKey, src);
        });
      }
    }).catch((error) => {
      if (callId !== fetchCallIdRef.current) return;
      console.error("GetByCode error:", error);
    });
  }, [organisation, orgCode, locCode, apiLinks, API_VARIABLES,
      DOCUMENT_CONFIG, IMAGE_CONFIG, TOASTS,
      clearForm, buildInitialForm, setImage, IMAGE_SERVER_BASE]);

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
    setCodeKey((k) => k + 1);   // ⭐ force remount so InstallationCode clears visually
    setIsExisting(false);

    setTimeout(() => {
      const input = codeInputRef.current?.querySelector?.("input");
      if (input) { input.focus(); input.select(); }
    }, 150);

    loadNewCode(true).then((newCode) => {
      if (newCode) {
        setFormStore((prev) => ({
          ...prev,
          commissionCode: `22-05-0${newCode}`,
          commissionText: "",
        }));
        setCodeKey((k) => k + 1);   // ⭐ remount again so new code is shown
        setTimeout(() => {
          const input = codeInputRef.current?.querySelector?.("input");
          if (input) { input.focus(); input.select(); }
        }, 150);
      }
    });
  }, [clearForm, loadNewCode]);

  const handleSearchSelect = useCallback((data) => {
    if (!data) return;
    const selectedCode =
      data.code ?? data.ttchcod ?? data.Code ?? data.FTchCod ?? "";
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

  const handleImageUploadClick = useCallback((slotKey) => () => {
    const r = fileRefs.current[slotKey];
    if (r && r.current) r.current.click();
  }, []);

  const handleImageFileChange = useCallback((slotKey) => (e) => {
    const file = e.target.files && e.target.files[0];
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      showToast("Please select an image file", "error");
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      showToast("Image is too large (max 5 MB)", "error");
      return;
    }
    setImage(slotKey, URL.createObjectURL(file));
    showToast("Image selected", "success");
  }, [setImage]);

  const openImageModal = useCallback((src) => {
    if (!src) return;
    setModalImageSrc(src);
    setIsImageModalOpen(true);
  }, []);

  const handleDocumentUploadClick = useCallback(() => {
    if (documentInputRef.current) documentInputRef.current.click();
  }, []);

  const handleDocumentFileChange = useCallback((e) => {
    if (!DOCUMENT_CONFIG) return;
    const file = e.target.files && e.target.files[0];
    if (!file) return;
    if (file.size > DOCUMENT_CONFIG.maxSizeMB * 1024 * 1024) {
      showToast(`Document is too large (max ${DOCUMENT_CONFIG.maxSizeMB} MB)`, "error");
      return;
    }
    setFormStore((prev) => ({ ...prev, [DOCUMENT_CONFIG.fieldName]: file.name }));
    showToast("Document selected", "success");
  }, [DOCUMENT_CONFIG]);

  const handleDocumentDownload = useCallback(() => {
    if (!DOCUMENT_CONFIG) return;
    const fileName = String(formStore[DOCUMENT_CONFIG.fieldName] || "").trim();
    if (!fileName) {
      showToast("No document to download", "error");
      return;
    }
    const url = `${IMAGE_SERVER_BASE}/${encodeURIComponent(orgCode)}/${encodeURIComponent(fileName)}`;
    const a = document.createElement("a");
    a.href = url;
    a.download = fileName;
    a.target = "_blank";
    a.rel = "noopener noreferrer";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    showToast("Downloading " + fileName, "success");
  }, [DOCUMENT_CONFIG, formStore, orgCode, IMAGE_SERVER_BASE]);

  const handleSearchModalClose = useCallback(() => {
    setIsSearchModalOpen(false);
    setTimeout(() => {
      const input = codeInputRef.current?.querySelector?.("input");
      if (input) { input.focus(); input.select(); }
    }, 100);
  }, []);

  return {
    formStore, code, maxCode, codeKey, organisation, orgCode, locCode,
    isInitialLoad, isSaving, isCoolingDown, isFetchingNextCode, isExisting,
    images, dropdownCodes, isSearchModalOpen, isImageModalOpen, modalImageSrc,
    sysControl, vis,
    refs, codeInputRef, saveButtonRef, fileRefs, documentInputRef,
    setCode, setMaxCode, setCodeKey, setField, setDropdownCode, setImage, setFormStore,
    setIsSearchModalOpen, setIsImageModalOpen,
    save, reset, fetchByCode, loadList, loadNewCode,
    handleSearchSelect, handleCodeChange, handleSearchModalClose,
    handleCnicChange, handleMoneyChange, handleDateChange,
    handleKeyDown, handleDateKeyDown,
    handleImageUploadClick, handleImageFileChange, openImageModal,
    handleDocumentUploadClick, handleDocumentFileChange, handleDocumentDownload,
    config,
  };
}

// ═══════════════════════════════════════════════════════════════════════════
// SECTION 4 — MAIN COMPONENT + JSX
// ═══════════════════════════════════════════════════════════════════════════

export default function TechnicianMaintenance() {
  const { apiLinks, getLocationNumber } = useTheme();
  const form = useMaintenanceForm({ config: TECHNICIAN_CONFIG });
  const {
    formStore, code, maxCode, codeKey, organisation,
    isInitialLoad, isSaving, isCoolingDown, isFetchingNextCode,
    images, dropdownCodes, isSearchModalOpen, isImageModalOpen, modalImageSrc,
    vis, refs, codeInputRef, saveButtonRef, fileRefs, documentInputRef,
    setCode, setMaxCode, setCodeKey, setField, setDropdownCode, setFormStore,
    setIsSearchModalOpen, setIsImageModalOpen,
    save, reset, fetchByCode, handleSearchSelect, handleCodeChange,
    handleSearchModalClose, handleCnicChange, handleMoneyChange, handleDateChange,
    handleKeyDown, handleDateKeyDown,
    handleImageUploadClick, handleImageFileChange, openImageModal,
    handleDocumentUploadClick, handleDocumentFileChange, handleDocumentDownload,
  } = form;

  const handleSubmit = (e) => e.preventDefault();

  const R = (name) => refs.current[name];
  const V = (name) => formStore[name];

  const focusFirstFromTopBar = () => {
    const first = ["status", "name", "businessName"]
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
    <div className="el-page-host">
      <div className="el-page-wrapper">
        <div className="el-page">
          <div className="el-card">
            <form onSubmit={handleSubmit}>
              <header className="el-header">
                <h1>Technician Maintenance</h1>
                <p className="el-subtitle">
                  Enter the Technician information in the form below
                </p>
              </header>

              <div className="el-scrollable-body">
                {/* TOP BAR */}
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
                    <span className="el-field-label-right"> Code :</span>
                    <InstallationCode
                      key={codeKey}
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
                      onKeyDown={(e) => handleKeyDown(e, "name")}
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

                        {/* NAME + IMAGE */}
                        <div className="el-row-split">
                          <div className="el-row-split-left">
                            <div className="el-field-row">
                              <span className="el-field-label-right">Name :</span>
                              <input
                                ref={R("name")}
                                value={V("name")}
 onChange={(e) =>
      setFormStore((prev) => ({ ...prev, name: e.target.value.toUpperCase() }))
    }                                placeholder="Technician Name"
                                maxLength={40}
                                onKeyDown={(e) => handleKeyDown(e, "businessName")}
                              />
                            </div>

                            <div className="el-field-row">
                              <span className="el-field-label-right">Business :</span>
                              <input
                                ref={R("businessName")}
                                value={V("businessName")}
                                onChange={setField("businessName")}
                                placeholder="Business Name"
                                maxLength={40}
                                onKeyDown={(e) => handleKeyDown(e, "address1")}
                              />
                            </div>

                            <div className="el-field-row">
                              <span className="el-field-label-right">Address 1 :</span>
                              <input
                                ref={R("address1")}
                                value={V("address1")}
                                onChange={setField("address1")}
                                placeholder="Address 1"
                                maxLength={40}
                                onKeyDown={(e) => handleKeyDown(e, "address2")}
                              />
                            </div>

                            <div className="el-field-row">
                              <span className="el-field-label-right">Address 2 :</span>
                              <input
                                ref={R("address2")}
                                value={V("address2")}
                                onChange={setField("address2")}
                                placeholder="Address 2"
                                maxLength={40}
                                onKeyDown={(e) => handleKeyDown(e, "cnic")}
                              />
                            </div>

                            <div className="el-field-row">
                              <span className="el-field-label-right">CNIC :</span>
                              <input
                                ref={R("cnic")}
                                value={V("cnic")}
                                onChange={handleCnicChange("cnic")}
                                placeholder="XXXXX-XXXXXXX-X"
                                className="cnic-field"
                                maxLength={15}
                                onKeyDown={(e) => handleKeyDown(e, "email")}
                              />
                            </div>

                            <div className="el-field-row">
                              <span className="el-field-label-right">Email :</span>
                              <input
                                ref={R("email")}
                                value={V("email")}
                                onChange={setField("email")}
                                placeholder="example@email.com"
                                className="email-field"
                                maxLength={40}
                                onKeyDown={(e) => handleKeyDown(e, "mobile")}
                              />
                            </div>

                            <div className="el-row-split-pair">
                              <div className="el-field-row el-half">
                                <span className="el-field-label-right">Mobile :</span>
                              <input
  ref={R("mobile")}
  type="tel"
  value={V("mobile")}
  onChange={setField("mobile")}
  placeholder="03XXXXXXXXX"
  maxLength={11}
  onKeyDown={(e) => {
    // ✅ Allow Ctrl/Cmd/Alt shortcuts (Ctrl+A, Ctrl+C, Ctrl+V, Ctrl+X, etc.)
    if (e.ctrlKey || e.metaKey || e.altKey) {
      handleKeyDown(e, "emergencyNo");
      return;
    }

    // Block non-numeric printable characters
    if (!/[0-9]/.test(e.key) && e.key.length === 1) {
      e.preventDefault();
      return;
    }

    handleKeyDown(e, "emergencyNo");
  }}
  onPaste={(e) => {
    const pasted = e.clipboardData.getData("text");
    if (!/^\d+$/.test(pasted)) {
      e.preventDefault();
    }
  }}
/>
                              </div>
                              <div className="el-field-row el-half">
                                <span className="el-field-label-right">Emergency :</span>
                               <input
  ref={R("emergencyNo")}
  type="tel"
  value={V("emergencyNo")}
  onChange={setField("emergencyNo")}
  placeholder="03XXXXXXXXX"
  maxLength={11}
  onKeyDown={(e) => {
    // ✅ Allow Ctrl/Cmd/Alt shortcuts (Ctrl+A, Ctrl+C, Ctrl+V, Ctrl+X, etc.)
    if (e.ctrlKey || e.metaKey || e.altKey) {
      handleKeyDown(e, "city");
      return;
    }

    // Block non-numeric printable characters
    if (!/[0-9]/.test(e.key) && e.key.length === 1) {
      e.preventDefault();
      return;
    }

    handleKeyDown(e, "city");
  }}
  onPaste={(e) => {
    const pasted = e.clipboardData.getData("text");
    if (!/^\d+$/.test(pasted)) {
      e.preventDefault();
    }
  }}
/>
                              </div>
                            </div>
                          </div>

                          {vis("Pic") && (
                            <div className="el-row-split-right">
                              <div
                                className="el-photo-box"
                                style={{
                                  display: "flex", alignItems: "center",
                                  justifyContent: "center", overflow: "hidden",
                                  backgroundColor: "#f5f5f5",
                                  cursor: images.technician ? "pointer" : "default",
                                }}
                                onClick={() => openImageModal(images.technician)}
                                title={images.technician ? "Click to view full size" : ""}
                              >
                                {images.technician ? (
                                  <img
                                    src={images.technician}
                                    alt="Technician"
                                    style={{
                                      width: "100%", height: "100%",
                                      objectFit: "contain", objectPosition: "center",
                                      display: "block", borderRadius: "inherit",
                                    }}
                                    onError={(e) => { e.currentTarget.style.display = "none"; }}
                                    onLoad={(e) => { e.currentTarget.style.display = "block"; }}
                                  />
                                ) : (
                                  <span className="el-photo-placeholder">No Image</span>
                                )}
                              </div>
                              <input
                                ref={fileRefs.current.technician}
                                type="file"
                                accept="image/*"
                                style={{ display: "none" }}
                                onChange={handleImageFileChange("technician")}
                              />
                              <button
                                type="button"
                                className="el-upload-btn"
                                onClick={handleImageUploadClick("technician")}
                              >
                                ⬆ Upload
                              </button>
                            </div>
                          )}
                        </div>

                        <hr className="el-mobile-divider" />

                        {/* CITY / AREA */}
                        <div className="el-row-split-pair">
                          <div className="el-field-row el-half">
                            <span className="el-field-label-right">City :</span>
                            <DynamicSelect
                              ref={R("city")}
                              fetchUrl={`${apiLinks}/GetActiveCity.php`}
                              valueKey="tctydsc"
                              labelKey="tctydsc"
                              codeKey="tctycod"
                              organisation={organisation}
                              locationNumber={getLocationNumber || getLocationnumber()}
                              value={isInitialLoad ? "" : (V("city") || "")}
                              initialCode={dropdownCodes.selectedCityCode}
                              onChange={(desc) => setFormStore((p) => ({ ...p, city: desc }))}
                              onCodeChange={(c) => setDropdownCode("selectedCityCode", c)}
                              placeholder="Please Select City"
                              onKeyDown={(e) => handleKeyDown(e, "area")}
                            />
                          </div>
                          <div className="el-field-row el-half">
                            <span className="el-field-label-right">Area :</span>
                            <DynamicSelect
                              ref={R("area")}
                              fetchUrl={`${apiLinks}/GetActiveArea.php`}
                              valueKey="taredsc"
                              labelKey="taredsc"
                              codeKey="tarecod"
                              organisation={organisation}
                              locationNumber={getLocationNumber || getLocationnumber()}
                              value={isInitialLoad ? "" : (V("area") || "")}
                              initialCode={dropdownCodes.selectedAreaCode}
                              onChange={(desc) => setFormStore((p) => ({ ...p, area: desc }))}
                              onCodeChange={(c) => setDropdownCode("selectedAreaCode", c)}
                              placeholder="Please Select Area"
                              onKeyDown={(e) => handleKeyDown(e, "commissionCode")}
                            />
                          </div>
                        </div>

                        <hr className="el-mobile-divider" />

                        {/* COMMISSION CODE ROW */}
                        <div className="el-row-code-pair">
                          <div className="el-field-row el-code-field-cell">
                            <span className="el-field-label-right">Comm Code :</span>
                            <input
                              ref={R("commissionCode")}
                              value={V("commissionCode") || ""}
                              readOnly
                              tabIndex={-1}
                              className="el-code-input"
                              onKeyDown={(e) => handleKeyDown(e, "commissionText")}
                            />
                          </div>
                          <div className="el-field-row el-remark-field-cell">
                            <input
                              ref={R("commissionText")}
                              value={V("commissionText") || ""}
                              readOnly
                              tabIndex={-1}
                              placeholder="- COMMISSION"
                              className="el-remark-field"
                              onKeyDown={(e) => handleKeyDown(e, "dobDate")}
                            />
                          </div>
                        </div>

                        <hr className="el-mobile-divider" />

                        {/* DOB / JOIN DATE */}
                        <div className="el-row-split-pair">
                          <div className="el-field-row el-half">
                            <span className="el-field-label-right">DOB Date :</span>
                            <input
                              ref={R("dobDate")}
                              type="date"
                              value={V("dobDate") || ""}
                              onChange={handleDateChange("dobDate")}
                              className="el-date-inline"
                              onKeyDown={(e) => handleDateKeyDown(e, "joinDate")}
                            />
                          </div>
                          <div className="el-field-row el-half">
                            <span className="el-field-label-right">Join Date :</span>
                            <input
                              ref={R("joinDate")}
                              type="date"
                              value={V("joinDate") || ""}
                              onChange={handleDateChange("joinDate")}
                              className="el-date-inline"
                              onKeyDown={(e) => handleDateKeyDown(e, "leaveDate")}
                            />
                          </div>
                        </div>

                        {/* LEAVE DATE / REMARKS */}
                        <div className="el-row-split-pair el-row-leave leave-date">
                          <div className="el-field-row el-half leavedate">
                            <span className="el-field-label-right">Leave Date :</span>
                            <input
                              ref={R("leaveDate")}
                              type="date"
                              value={V("leaveDate") || ""}
                              onChange={handleDateChange("leaveDate")}
                              className="el-date-inline"
                              onKeyDown={(e) => handleDateKeyDown(e, "leaveRemarks")}
                            />
                          </div>
                          <div className="el-field-row el-half">
                            <input
                              ref={R("leaveRemarks")}
                              value={V("leaveRemarks")}
                              onChange={setField("leaveRemarks")}
                              placeholder="Leave Remarks"
                              className="el-remark-field"
                              maxLength={60}
                              onKeyDown={(e) => handleKeyDown(e, "maxJob")}
                            />
                          </div>
                        </div>

                        <hr className="el-mobile-divider" />

                        {/* MAX JOB / TYPE / COMMISSION */}
                        <div className="el-row-three">
                          <div className="el-field-row el-third">
                            <span className="el-field-label-right">Max Job :</span>
                            <input
                              ref={R("maxJob")}
                              value={V("maxJob")}
                              onChange={setField("maxJob")}
                              placeholder="Max Job"
                              className="el-num-field"
                              maxLength={20}
                              onKeyDown={(e) => handleKeyDown(e, "comType")}
                            />
                          </div>
                          <div className="el-field-row el-third">
                            <span className="el-field-label-right">Type :</span>
                            <select
                              ref={R("comType")}
                              value={V("comType")}
                              onChange={setField("comType")}
                              onKeyDown={(e) => handleKeyDown(e, "commission")}
                            >
                              <option value="1">Per Quantity</option>
                              <option value="2">Charges</option>
                              <option value="3">Profit</option>
                              <option value="4">Charges + Profit</option>
                              <option value="5">Total</option>
                            </select>
                          </div>
                          <div className="el-field-row el-third el-third-right">
                            <span className="el-field-label-right">Commission :</span>
                            <input
                              ref={R("commission")}
                              value={V("commission")}
                              onChange={handleMoneyChange("commission")}
                              placeholder="Commission"
                              className="el-num-field"
                              maxLength={20}
                              onKeyDown={(e) => handleKeyDown(e, "reference1Mobile")}
                            />
                          </div>
                        </div>

                        <hr className="el-mobile-divider" />

                        {/* REFERENCES */}
                        <div className="el-row-split-pair">
                          <div className="el-field-row el-half">
                            <span className="el-field-label-right">Reference 1 :</span>
                            <input
  ref={R("reference1Mobile")}
  type="tel"
  value={V("reference1Mobile")}
  onChange={setField("reference1Mobile")}
  placeholder="03XXXXXXXXX"
  maxLength={11}
  onKeyDown={(e) => {
    // ✅ Allow Ctrl/Cmd/Alt shortcuts (Ctrl+A, Ctrl+C, Ctrl+V, Ctrl+X, etc.)
    if (e.ctrlKey || e.metaKey || e.altKey) {
      handleKeyDown(e, "reference1");
      return;
    }

    // Block non-numeric printable characters
    if (!/[0-9]/.test(e.key) && e.key.length === 1) {
      e.preventDefault();
      return;
    }

    handleKeyDown(e, "reference1");
  }}
  onPaste={(e) => {
    const pasted = e.clipboardData.getData("text");
    if (!/^\d+$/.test(pasted)) {
      e.preventDefault();
    }
  }}
/>
                          </div>
                          <div className="el-field-row el-half">
                            <input
                              ref={R("reference1")}
                              value={V("reference1")}
                              onChange={setField("reference1")}
                              placeholder="Name"
                              className="el-remark-field"
                              maxLength={40}
                              onKeyDown={(e) => handleKeyDown(e, "reference2Mobile")}
                            />
                          </div>
                        </div>

                        <div className="el-row-split-pair">
                          <div className="el-field-row el-half">
                            <span className="el-field-label-right">Reference 2 :</span>
                           <input
  ref={R("reference2Mobile")}
  type="tel"
  value={V("reference2Mobile")}
  onChange={setField("reference2Mobile")}
  placeholder="03XXXXXXXXX"
  maxLength={11}
  onKeyDown={(e) => {
    // ✅ Allow Ctrl/Cmd/Alt shortcuts (Ctrl+A, Ctrl+C, Ctrl+V, Ctrl+X, etc.)
    if (e.ctrlKey || e.metaKey || e.altKey) {
      handleKeyDown(e, "reference2");
      return;
    }

    // Block non-numeric printable characters
    if (!/[0-9]/.test(e.key) && e.key.length === 1) {
      e.preventDefault();
      return;
    }

    handleKeyDown(e, "reference2");
  }}
  onPaste={(e) => {
    const pasted = e.clipboardData.getData("text");
    if (!/^\d+$/.test(pasted)) {
      e.preventDefault();
    }
  }}
/>
                          </div>
                          <div className="el-field-row el-half">
                            <input
                              ref={R("reference2")}
                              value={V("reference2")}
                              onChange={setField("reference2")}
                              placeholder="Name"
                              className="el-remark-field"
                              maxLength={40}
                              onKeyDown={(e) => handleKeyDown(e, "documentName")}
                            />
                          </div>
                        </div>

                        <hr className="el-mobile-divider" />

                        {/* DOCUMENT */}
                        {vis("Document") && (
                          <div className="el-doc-row">
                            <span className="el-field-label-right el-doc-label">
                              Document :
                            </span>
                            <div className="el-doc-input-cell">
                              <input
                                ref={R("documentName")}
                                value={V("documentName") || ""}
                                readOnly
                                tabIndex={-1}
                                placeholder="Click to upload Document"
                                className="el-doc-input"
                                maxLength={60}
                                onKeyDown={(e) => handleKeyDown(e, "remarks")}
                              />
                            </div>
                            <input
                              ref={documentInputRef}
                              type="file"
                              accept={DOCUMENT_CONFIG.accept}
                              style={{ display: "none" }}
                              onChange={handleDocumentFileChange}
                            />
                            <button
                              type="button"
                              className="el-doc-btn el-doc-upload"
                              onClick={handleDocumentUploadClick}
                            >
                              ⬆ Upload
                            </button>
                            <button
                              type="button"
                              className="el-doc-btn el-doc-download"
                              onClick={handleDocumentDownload}
                            >
                              ⬇ Download
                            </button>
                          </div>
                        )}

                        {/* REMARKS */}
                        <div className="el-field-row el-remarks-row">
                          <span className="el-field-label-right">Remarks :</span>
                          <textarea
                            ref={R("remarks")}
                            value={V("remarks") || ""}
                            onChange={setField("remarks")}
                            placeholder="Remarks"
                            className="el-remarks-textarea"
                            maxLength={255}
                            onKeyDown={(e) => {
                              if (e.key === "Enter" && !e.shiftKey) {
                                e.preventDefault();
                                if (saveButtonRef.current) saveButtonRef.current.focus();
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

      {/* SEARCH MODAL */}
      <SearchModal
        isOpen={isSearchModalOpen}
        onClose={handleSearchModalClose}
        onSelectInstaller={handleSearchSelect}
        apiLinks={apiLinks}
        apiEndpoint={API_VARIABLES.endpoints.searchByCode}
        title="Select Technician"
        codeKey="ttchcod"
        descriptionKey="ttchnam"
      />

      {/* IMAGE PREVIEW MODAL */}
      {isImageModalOpen && modalImageSrc && (
        <div
          onClick={() => setIsImageModalOpen(false)}
          style={{
            position: "fixed", top: 0, left: 0, width: "100vw", height: "100vh",
            backgroundColor: "rgba(0, 0, 0, 0.85)", zIndex: 99999,
            display: "flex", alignItems: "center", justifyContent: "center",
            cursor: "zoom-out",
          }}
        >
          <img
            src={modalImageSrc}
            alt="Preview"
            onClick={(e) => e.stopPropagation()}
            style={{
              maxWidth: "92vw", maxHeight: "92vh", objectFit: "contain",
              borderRadius: "6px", boxShadow: "0 8px 32px rgba(0,0,0,0.6)",
              backgroundColor: "#fff", cursor: "default",
            }}
          />
          <button
            type="button"
            onClick={() => setIsImageModalOpen(false)}
            style={{
              position: "absolute", top: "16px", right: "20px",
              width: "40px", height: "40px", borderRadius: "50%",
              border: "none", background: "rgba(255,255,255,0.15)",
              color: "#fff", fontSize: "22px", fontWeight: "bold",
              cursor: "pointer", display: "flex", alignItems: "center",
              justifyContent: "center", lineHeight: 1,
            }}
            aria-label="Close preview"
          >
            ×
          </button>
        </div>
      )}
    </div>
  );
}