import React, { useState, useEffect, useRef , useCallback} from "react";
import "./customermaintenance.css";
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


// export default function CustomerMaintenance() {
//   const {
//     apiLinks,
//     getLocationNumber,
//     getfontstyle,
//     getdatafontsize,
//   } = useTheme();

//   const locationnumber = getLocationnumber();
//   const user = getUserData();

//   const todayISO = () => {
//     const d = new Date();
//     const yyyy = d.getFullYear();
//     const mm = String(d.getMonth() + 1).padStart(2, "0");
//     const dd = String(d.getDate()).padStart(2, "0");
//     return `${yyyy}-${mm}-${dd}`;
//   };

//   // ============================================================
//   // FORM STATE
//   // ============================================================
//   const [formStore, setFormStore] = useState({
//     man: "",
//     ref: "",
//     status: "Active",
//     mobile: "",
//     name: "",
//     fatherName: "",
//     address1: "",
//     address2: "",
//     email: "",
//     type: "",
//     cnic: "",
//     ntn: "",
//     city: "",
//     area: "",
//     state: "",
//     region: "",
//     manager: "",
//     salesman: "",
//     collector: "",
//     group: "",
//     creditDays: "",
//     creditLimit: "",
//     debit: "",
//     credit: "",
//     amount: "",
//     dueDate: todayISO(),
//     contactName: "",
//     contactMobile: "",
//     ownerName: "",
//     ownerMobile: "",
//     profession: "",
//     companyName: "",
//     companyAddress: "",
//     companyContact: "",
//     guarantorContact: "",
//     guarantorName: "",
//     guarantorFatherName: "",
//     guarantorAddress1: "",
//     guarantorAddress2: "",
//     guarantorCnic: "",
//     witnessContact: "",
//     witnessName: "",
//     witnessFatherName: "",
//     witnessAddress1: "",
//     witnessAddress2: "",
//     witnessCnic: "",
//     verify: "",
//     date: todayISO(),
//     latitude: "",
//     longitude: "",
//     remarks: "",
//     documentName: "",
//   });

//   const [selectedImage1, setSelectedImage1] = useState("");
//   const [selectedGuarantorImage, setSelectedGuarantorImage] = useState("");
//   const [selectedWitnessImage, setSelectedWitnessImage] = useState("");
//   const [isImageModalOpen, setIsImageModalOpen] = useState(false);
//   const [modalImageSrc, setModalImageSrc] = useState("");

//   const [selectedTypeCode, setSelectedTypeCode] = useState("");
//   const [selectedCityCode, setSelectedCityCode] = useState("");
//   const [selectedAreaCode, setSelectedAreaCode] = useState("");
//   const [selectedStateCode, setSelectedStateCode] = useState("");
//   const [selectedRegionCode, setSelectedRegionCode] = useState("");
//   const [selectedManagerCode, setSelectedManagerCode] = useState("");
//   const [selectedSalesmanCode, setSelectedSalesmanCode] = useState("");
//   const [selectedCollectorCode, setSelectedCollectorCode] = useState("");
//   const [selectedGroupCode, setSelectedGroupCode] = useState("");
//   const [selectedVerifyCode, setSelectedVerifyCode] = useState("");

//   const [code, setCode] = useState("");
//   const [maxCode, setMaxCode] = useState("");
//   const [organisation, setOrganisation] = useState(null);
//   const [isInitialLoad, setIsInitialLoad] = useState(true);
//   const [isSaving, setIsSaving] = useState(false);
//   const [isCoolingDown, setIsCoolingDown] = useState(false);
//   const [isSearchModalOpen, setIsSearchModalOpen] = useState(false);
//   const [isMobileModalOpen, setIsMobileModalOpen] = useState(false);
//   const [isGuarantorMobileModalOpen, setIsGuarantorMobileModalOpen] = useState(false);
//   const [isWitnessMobileModalOpen, setIsWitnessMobileModalOpen] = useState(false);
//   const [isFetchingNextCode, setIsFetchingNextCode] = useState(false);
//   const [isExistingCustomer, setIsExistingCustomer] = useState(false);

//   const [orgCode, setOrgCode] = useState("DEMOINS");
//   const [locCode, setLocCode] = useState("001");

//   const codeInputRef = useRef(null);
//   const wasFetchingCodeRef = useRef(false);
//   const fetchCallIdRef = useRef(0);
//   const isSavingRef = useRef(false);
//   const isCoolingDownRef = useRef(false);

//   const [customerList, setCustomerList] = useState([]);
//   const customerListRef = useRef([]);
//   const pendingCodeRef = useRef("");

//   const manRef = useRef(null);
//   const refRef = useRef(null);
//   const statusRef = useRef(null);
//   const mobileRef = useRef(null);
//   const nameRef = useRef(null);
//   const fatherNameRef = useRef(null);
//   const address1Ref = useRef(null);
//   const address2Ref = useRef(null);
//   const emailRef = useRef(null);
//   const typeRef = useRef(null);
//   const cnicRef = useRef(null);
//   const ntnRef = useRef(null);
//   const cityRef = useRef(null);
//   const areaRef = useRef(null);
//   const stateRef = useRef(null);
//   const regionRef = useRef(null);
//   const managerRef = useRef(null);
//   const salesmanRef = useRef(null);
//   const collectorRef = useRef(null);
//   const groupRef = useRef(null);
//   const creditDaysRef = useRef(null);
//   const creditLimitRef = useRef(null);
//   const debitRef = useRef(null);
//   const creditRef = useRef(null);
//   const amountRef = useRef(null);
//   const dueDateRef = useRef(null);
//   const contactNameRef = useRef(null);
//   const contactMobileRef = useRef(null);
//   const ownerNameRef = useRef(null);
//   const ownerMobileRef = useRef(null);
//   const professionRef = useRef(null);
//   const companyNameRef = useRef(null);
//   const companyAddressRef = useRef(null);
//   const companyContactRef = useRef(null);
//   const guarantorContactRef = useRef(null);
//   const guarantorNameRef = useRef(null);
//   const guarantorFatherNameRef = useRef(null);
//   const guarantorAddress1Ref = useRef(null);
//   const guarantorAddress2Ref = useRef(null);
//   const guarantorCnicRef = useRef(null);
//   const witnessContactRef = useRef(null);
//   const witnessNameRef = useRef(null);
//   const witnessFatherNameRef = useRef(null);
//   const witnessAddress1Ref = useRef(null);
//   const witnessAddress2Ref = useRef(null);
//   const witnessCnicRef = useRef(null);
//   const verifyRef = useRef(null);
//   const dateRef = useRef(null);
//   const latitudeRef = useRef(null);
//   const longitudeRef = useRef(null);
//   const documentNameRef = useRef(null);
//   const remarksRef = useRef(null);
//   const saveButtonRef = useRef(null);

//   const photoInputRef = useRef(null);
//   const guarantorPhotoInputRef = useRef(null);
//   const witnessPhotoInputRef = useRef(null);
//   const documentInputRef = useRef(null);

//   const STATUS_OPTIONS = ["Active", "Non-Active"];
//   const API_BASE = apiLinks;
//   const IMAGE_SERVER_BASE = "https://crystalsolutions.pk/DI";

//   // ============================================================
//   // Helpers
//   // ============================================================

//   function buildImageBaseForOrg(org) {
//     return `${IMAGE_SERVER_BASE}/${String(org || "DEMOELEC").trim()}/`;
//   }

//   const formatWithCommas = (value) => {
//     const raw = String(value ?? "").trim();
//     if (raw === "") return "";
//     const cleaned = raw.replace(/[^0-9.]/g, "");
//     const firstDot = cleaned.indexOf(".");
//     let intPart;
//     let decPart = "";
//     if (firstDot === -1) {
//       intPart = cleaned;
//     } else {
//       intPart = cleaned.slice(0, firstDot);
//       decPart = cleaned.slice(firstDot + 1).replace(/\./g, "");
//     }
//     const grouped = intPart.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
//     return decPart !== "" ? `${grouped}.${decPart}` : grouped;
//   };

//   const stripCommas = (value) => {
//     const raw = String(value ?? "").trim();
//     if (raw === "") return "";
//     return raw.replace(/,/g, "");
//   };

//   const handleMoneyChange = (key) => (e) => {
//     const input = e.target;
//     const rawValue = String(input.value ?? "");
//     const selectionStart = input.selectionStart ?? rawValue.length;
//     const digitsBeforeCursor = rawValue
//       .slice(0, selectionStart)
//       .replace(/\D/g, "").length;
//     const formatted = formatWithCommas(rawValue);
//     setFormStore((prev) => ({ ...prev, [key]: formatted }));
//     requestAnimationFrame(() => {
//       if (!input) return;
//       let digitCount = 0;
//       let newCaret = formatted.length;
//       for (let i = 0; i < formatted.length; i++) {
//         if (/[0-9]/.test(formatted[i])) {
//           digitCount++;
//           if (digitCount === digitsBeforeCursor) {
//             newCaret = i + 1;
//             break;
//           }
//         }
//       }
//       if (digitsBeforeCursor === 0) newCaret = 0;
//       try {
//         input.setSelectionRange(newCaret, newCaret);
//       } catch (err) {}
//     });
//   };

//   const cleanAmount = (value) => {
//     if (value === null || value === undefined || value === "") return "";
//     const num = String(value).replace(/,/g, "").trim();
//     const parsed = parseFloat(num);
//     return isNaN(parsed) ? "" : parsed;
//   };

//   const txt = (value) => String(value ?? "").trim();

//   const normaliseCode = (value) => {
//     const digits = String(value ?? "").replace(/\D/g, "");
//     if (!digits) return "";
//     return String(parseInt(digits, 10));
//   };

//   const toInputDate = (val) => {
//     if (!val) return "";
//     const d = new Date(val);
//     if (isNaN(d.getTime())) return "";
//     const yyyy = d.getFullYear();
//     const mm = String(d.getMonth() + 1).padStart(2, "0");
//     const dd = String(d.getDate()).padStart(2, "0");
//     return `${yyyy}-${mm}-${dd}`;
//   };

//   const extractNewCode = (data) => {
//     if (data === null || data === undefined) return "";
//     if (Array.isArray(data)) {
//       if (data.length === 0) return "";
//       const first = data[0];
//       if (first === null || first === undefined) return "";
//       if (typeof first === "object") {
//         return String(
//           first.code ?? first.Code ?? first.FIntCod ?? first.FCusCod ?? ""
//         ).trim();
//       }
//       return String(first).trim();
//     }
//     if (typeof data === "string") {
//       let s = data.trim();
//       if ((s.startsWith('"') && s.endsWith('"')) ||
//           (s.startsWith("'") && s.endsWith("'"))) {
//         s = s.slice(1, -1).trim();
//       }
//       return s;
//     }
//     if (typeof data === "object") {
//       return String(
//         data.code ?? data.Code ?? data.FIntCod ?? data.FCusCod ?? ""
//       ).trim();
//     }
//     return "";
//   };

//   const formatCNIC = (value) => {
//     const digits = String(value || "").replace(/\D/g, "");
//     const limited = digits.slice(0, 13);
//     if (limited.length <= 5) return limited;
//     if (limited.length <= 12) return `${limited.slice(0, 5)}-${limited.slice(5)}`;
//     return `${limited.slice(0, 5)}-${limited.slice(5, 12)}-${limited.slice(12, 13)}`;
//   };

//   const blankFormStore = () => ({
//     man: "",
//     ref: "",
//     status: "Active",
//     mobile: "",
//     name: "",
//     fatherName: "",
//     address1: "",
//     address2: "",
//     email: "",
//     type: "",
//     cnic: "",
//     ntn: "",
//     city: "",
//     area: "",
//     state: "",
//     region: "",
//     manager: "",
//     salesman: "",
//     collector: "",
//     group: "",
//     creditDays: "",
//     creditLimit: "",
//     debit: "",
//     credit: "",
//     amount: "",
//     dueDate: todayISO(),
//     contactName: "",
//     contactMobile: "",
//     ownerName: "",
//     ownerMobile: "",
//     profession: "",
//     companyName: "",
//     companyAddress: "",
//     companyContact: "",
//     guarantorContact: "",
//     guarantorName: "",
//     guarantorFatherName: "",
//     guarantorAddress1: "",
//     guarantorAddress2: "",
//     guarantorCnic: "",
//     witnessContact: "",
//     witnessName: "",
//     witnessFatherName: "",
//     witnessAddress1: "",
//     witnessAddress2: "",
//     witnessCnic: "",
//     verify: "",
//     date: todayISO(),
//     latitude: "",
//     longitude: "",
//     remarks: "",
//     documentName: "",
//   });

//   const clearForm = () => {
//     setFormStore(blankFormStore());
//     setSelectedImage1("");
//     setSelectedGuarantorImage("");
//     setSelectedWitnessImage("");

//     setSelectedTypeCode("");
//     setSelectedCityCode("");
//     setSelectedAreaCode("");
//     setSelectedStateCode("");
//     setSelectedRegionCode("");
//     setSelectedManagerCode("");
//     setSelectedSalesmanCode("");
//     setSelectedCollectorCode("");
//     setSelectedGroupCode("");
//     setSelectedVerifyCode("");

//     if (photoInputRef.current) photoInputRef.current.value = "";
//     if (guarantorPhotoInputRef.current) guarantorPhotoInputRef.current.value = "";
//     if (witnessPhotoInputRef.current) witnessPhotoInputRef.current.value = "";
//     if (documentInputRef.current) documentInputRef.current.value = "";
//   };

//   const set = (key) => (e) => {
//     const value = e.target.value;
//     setFormStore((prev) => ({ ...prev, [key]: value }));
//   };

//   const focusFirstVisible = (refs) => {
//     for (const ref of refs) {
//       const el = ref?.current;
//       if (!el) continue;
//       if (!el.isConnected) continue;
//       if (el.disabled) continue;
//       if (el.offsetParent === null) continue;
//       el.focus();
//       if (el.tagName === "INPUT") el.select();
//       return true;
//     }
//     return false;
//   };

//   const FOCUS_CHAIN = [
//     manRef, refRef, statusRef,
//     mobileRef, nameRef, fatherNameRef,
//     address1Ref, address2Ref, emailRef, typeRef,
//     cnicRef, ntnRef,
//     cityRef, areaRef, stateRef, regionRef,
//     managerRef, salesmanRef, collectorRef, groupRef,
//     creditDaysRef, creditLimitRef, debitRef, creditRef,
//     amountRef, dueDateRef,
//     contactNameRef, contactMobileRef,
//     ownerNameRef, ownerMobileRef,
//     professionRef, companyNameRef, companyAddressRef, companyContactRef,
//     guarantorContactRef, guarantorNameRef, guarantorFatherNameRef,
//     guarantorAddress1Ref, guarantorAddress2Ref, guarantorCnicRef,
//     witnessContactRef, witnessNameRef, witnessFatherNameRef,
//     witnessAddress1Ref, witnessAddress2Ref, witnessCnicRef,
//     verifyRef, dateRef, latitudeRef, longitudeRef,
//     documentNameRef, remarksRef,
//   ];

//   const handleKeyDown = (e, nextRef) => {
//     if (e.key !== "Enter") return;
//     e.preventDefault();
//     e.stopPropagation();
//     if (nextRef && focusFirstVisible([nextRef])) return;
//     const active = document.activeElement;
//     const currentIdx = FOCUS_CHAIN.findIndex((r) => r.current === active);
//     if (currentIdx === -1) return;
//     focusFirstVisible(FOCUS_CHAIN.slice(currentIdx + 1));
//   };

//   const handleDateKeyDown = (e, nextRef) => {
//     if (e.key === "Enter") {
//       e.preventDefault();
//       e.stopPropagation();
//       handleKeyDown(e, nextRef);
//     }
//   };

//   const handleDateChange = (key) => (e) => {
//     const value = String(e.target.value || "");
//     if (!value) {
//       setFormStore((prev) => ({ ...prev, [key]: "" }));
//       return;
//     }
//     const match = value.match(/^(\d{4,})-(\d{2})-(\d{2})$/);
//     if (match) {
//       const [, year, month, day] = match;
//       const trimmedYear = year.slice(0, 4);
//       setFormStore((prev) => ({
//         ...prev,
//         [key]: `${trimmedYear}-${month}-${day}`,
//       }));
//       return;
//     }
//     setFormStore((prev) => ({ ...prev, [key]: value }));
//   };

//   const showToast = (message, type = "success") => {
//     console.log("Toast:", message);
//     const toast = document.createElement("div");
//     const backgroundColor = type === "error" ? "#f44336" : "#4CAF50";
//     toast.style.cssText = `
//       position: fixed; top: 20px; right: 20px;
//       background: ${backgroundColor}; color: white;
//       padding: 15px 25px; border-radius: 5px; z-index: 9999;
//       box-shadow: 0 4px 8px rgba(0,0,0,0.2);
//       font-family: Arial, sans-serif; font-size: 14px;
//     `;
//     toast.textContent = message;
//     document.body.appendChild(toast);
//     setTimeout(() => {
//       document.body.removeChild(toast);
//     }, 3000);
//   };

//   // ============================================================
//   // Fetch customer/guarantor/witness data by mobile number
//   // ============================================================
//   const fetchDataByMobile = async (mobileNumber) => {
//     const cleanMobile = String(mobileNumber || "").trim();
//     if (!cleanMobile) {
//       showToast("Mobile number is empty", "error");
//       return null;
//     }
//     if (!orgCode || !locCode) {
//       showToast("Organisation or location missing", "error");
//       return null;
//     }

//     try {
//       const apiUrl = apiLinks + "/GetMobileNo.php";
//       const formData = new URLSearchParams({
//         FMobNum: cleanMobile,
//         code: orgCode,
//         FLocCod: locCode,
//       }).toString();

//       console.log(">>> GetMobileNo.php request:", { FMobNum: cleanMobile });
//       const response = await axios.post(apiUrl, formData, {
//         headers: { "Content-Type": "application/x-www-form-urlencoded" },
//       });

//       console.log(">>> GetMobileNo.php response:", response.data);

//       let rows = response.data;
//       if (typeof rows === "string") {
//         try { rows = JSON.parse(rows); } catch (e) { rows = []; }
//       }
//       if (rows && !Array.isArray(rows) && typeof rows === "object") {
//         const candidates = [rows.data, rows.rows, rows.result, rows.records, rows.list];
//         const nested = candidates.find((c) => Array.isArray(c));
//         rows = nested || [rows];
//       }
//       if (!Array.isArray(rows) || rows.length === 0) {
//         return null;
//       }
//       return rows[0];
//     } catch (err) {
//       console.error(">>> GetMobileNo.php error:", err);
//       return null;
//     }
//   };

//   // ============================================================
//   // Organisation / Code loading
//   // ============================================================
//   useEffect(() => {
//     const orgData = getOrganisationData();
//     setOrganisation(orgData);
//     if (orgData) {
//       const derivedOrg =
//         orgData.code || orgData.organization || orgData.orgcode ||
//         orgData.OrgCode || orgData.FOrgCod;
//       if (derivedOrg && String(derivedOrg).trim() !== "") {
//         setOrgCode(String(derivedOrg).trim());
//       }
//     }
//     let derivedLoc = "";
//     if (typeof getLocationNumber === "function") {
//       try { derivedLoc = getLocationNumber(); } catch (e) {}
//     }
//     if ((!derivedLoc || String(derivedLoc).trim() === "") && locationnumber) {
//       derivedLoc = locationnumber;
//     }
//     if (derivedLoc && String(derivedLoc).trim() !== "") {
//       setLocCode(String(derivedLoc).trim());
//     }
//   }, []);

//   useEffect(() => {
//     if (!organisation || !orgCode || !locCode) return;
//     const apiUrl = apiLinks + "/NewCustomer.php";
//     const formData = new URLSearchParams({
//       code: orgCode,
//       FLocCod: locCode,
//     }).toString();
//     axios.post(apiUrl, formData).then((response) => {
//       const newCode = extractNewCode(response.data);
//       console.log(">>> NewCustomer.php returned:", response.data, "→ parsed:", newCode);
//       if (newCode !== "") {
//         setCode(newCode);
//         setMaxCode(newCode);
//       }
//     }).catch((error) => {
//       console.error("Error fetching next customer code:", error);
//     });
//   }, [organisation, orgCode, locCode, apiLinks]);

//   useEffect(() => {
//     if (code && isInitialLoad) {
//       const timer = setTimeout(() => {
//         if (codeInputRef.current) {
//           const input = codeInputRef.current.querySelector("input");
//           if (input) { input.focus(); input.select(); }
//         }
//         setIsInitialLoad(false);
//       }, 100);
//       return () => clearTimeout(timer);
//     }
//   }, [code, isInitialLoad]);

//   const loadCustomerList = () => {
//     if (!organisation || !orgCode || !locCode) return;
//     const apiUrl = apiLinks + "/CustomerList.php";
//     const formData = new URLSearchParams({
//       code: orgCode,
//       FLocCod: locCode,
//     }).toString();
//     return axios.post(apiUrl, formData).then((response) => {
//       let rows = [];
//       if (Array.isArray(response.data)) rows = response.data;
//       else if (typeof response.data === "string") {
//         try { rows = JSON.parse(response.data); } catch (e) { rows = []; }
//       } else if (response.data && typeof response.data === "object") {
//         const candidates = [response.data.data, response.data.rows,
//           response.data.result, response.data.records, response.data.list];
//         const nested = candidates.find((c) => Array.isArray(c));
//         rows = nested || [];
//       }
//       customerListRef.current = rows;
//       setCustomerList(rows);
//       if (pendingCodeRef.current) {
//         const retryCode = pendingCodeRef.current;
//         pendingCodeRef.current = "";
//         fetchCustomerDataByCode(retryCode);
//       }
//     }).catch((error) => {
//       console.error("Error fetching customer list:", error);
//       customerListRef.current = [];
//       setCustomerList([]);
//     });
//   };

//   useEffect(() => {
//     loadCustomerList();
//   }, [organisation, orgCode, locCode, apiLinks]);

//   // ============================================================
//   // Fetch by code
//   // ============================================================
//   const findCustomerInList = (customerCode) => {
//     const wanted = normaliseCode(customerCode);
//     if (!wanted) return null;
//     const list = customerListRef.current || [];
//     return list.find((row) => {
//       if (!row || typeof row !== "object") return false;
//       const rowCode = row.Code ?? row.code ?? row.tempcod ?? row.FCusCod ?? row.tcstcod;
//       return normaliseCode(rowCode) === wanted;
//     }) || null;
//   };

//   const fetchCustomerDataByCode = (customerCode) => {
//     const cleanCode = String(customerCode || "").trim();
//     if (!organisation || !orgCode || !locCode || !cleanCode) return;

//     clearForm();
//     setIsExistingCustomer(false);

//     const listRow = findCustomerInList(cleanCode);
//     if (listRow) {
//       console.log(">>> Matched CustomerList row:", listRow);
//     } else if (!(customerListRef.current || []).length) {
//       pendingCodeRef.current = cleanCode;
//     }

//     const callId = ++fetchCallIdRef.current;
//     const apiUrl = apiLinks + "/GetCustomer.php";
//     const formData = new URLSearchParams({
//       code: orgCode,
//       FLocCod: locCode,
//       FCstCod: cleanCode,
//     }).toString();

//     axios.post(apiUrl, formData).then((response) => {
//       if (callId !== fetchCallIdRef.current) return;
//       let rows = [];
//       if (Array.isArray(response.data)) rows = response.data;
//       else if (response.data && typeof response.data === "object") {
//         const candidates = [response.data.data, response.data.rows,
//           response.data.result, response.data.records, response.data.list];
//         const nested = candidates.find((c) => Array.isArray(c));
//         rows = nested ? nested : [response.data];
//       } else if (typeof response.data === "string") {
//         try {
//           const parsed = JSON.parse(response.data);
//           rows = Array.isArray(parsed) ? parsed : [parsed];
//         } catch (e) { rows = []; }
//       }

//       const lowerKeys = (obj) => {
//         if (!obj || typeof obj !== "object") return obj;
//         const out = {};
//         Object.keys(obj).forEach((k) => { out[k.toLowerCase()] = obj[k]; });
//         return out;
//       };
//       rows = rows.map(lowerKeys);
//       const data = rows.find((r) => r && typeof r === "object" &&
//         (r.tcstcod !== undefined || r.tcstnam !== undefined)) ||
//         (rows.length === 1 && typeof rows[0] === "object" ? rows[0] : undefined);

//       const pickField = (row, keys) => {
//         if (!row) return undefined;
//         for (const key of keys) {
//           const val = row[key];
//           if (val !== undefined && val !== null && String(val).trim() !== "")
//             return val;
//         }
//         return undefined;
//       };

//       if (!data) {
//         // ⭐ NEW: Customer Not Found toast
//         setIsExistingCustomer(false);
//         showToast("Customer Not Found", "error");
//         return;
//       }

//       setSelectedTypeCode(txt(data.ttypcod));
//       setSelectedCityCode(txt(data.tctycod));
//       setSelectedAreaCode(txt(data.tarecod));
//       setSelectedStateCode(txt(data.tstacod));
//       setSelectedRegionCode(txt(data.tregcod));
//       setSelectedManagerCode(txt(data.tmgrcod));
//       setSelectedSalesmanCode(txt(data.tsalcod));
//       setSelectedCollectorCode(txt(data.tcolcod));
//       setSelectedGroupCode(txt(data.tgrpcod));
//       setSelectedVerifyCode(txt(data.tvrfcod));

//       setFormStore((prev) => ({
//         ...prev,
//         status: data.tcststs === "A" ? "Active" :
//                 data.tcststs === "N" ? "Non-Active" : prev.status,
//         man: txt(data.tmancod) || prev.man,
//         ref: txt(data.trefcod) || prev.ref,
//         name: txt(data.tcstnam) || prev.name,
//         fatherName: txt(data.tfthnam) || prev.fatherName,
//         mobile: txt(data.tmobnum) || prev.mobile,
//         address1: txt(data.tadd001) || prev.address1,
//         address2: txt(data.tadd002) || prev.address2,
//         email: txt(data.temladd) || prev.email,
//         cnic: data.tnicnum ? formatCNIC(data.tnicnum) : prev.cnic,
//         ntn: txt(data.tntnnum) || prev.ntn,

//         type: "",
//         city: "",
//         area: "",
//         state: "",
//         region: "",
//         manager: "",
//         salesman: "",
//         collector: "",
//         group: "",
//         verify: "",

//         creditDays: txt(data.tcrtday) || prev.creditDays,
//         creditLimit: formatWithCommas(data.tcrtlim ?? prev.creditLimit),
//         debit: formatWithCommas(data.tdbtamt ?? prev.debit),
//         credit: formatWithCommas(data.tcrtamt ?? prev.credit),
//         amount: formatWithCommas(data.tmthamt ?? prev.amount),
//         dueDate: data.tduedat ? toInputDate(data.tduedat) : prev.dueDate,

//         contactName: txt(data.tcntper) || prev.contactName,
//         contactMobile: txt(data.tcntmob) || prev.contactMobile,
//         ownerName: txt(data.townnam) || prev.ownerName,
//         ownerMobile: txt(data.townmob) || prev.ownerMobile,
//         profession: txt(data.tcstprf) || prev.profession,
//         companyName: txt(data.toffadd1) || prev.companyName,
//         companyAddress: txt(data.toffadd2) || prev.companyAddress,
//         companyContact: txt(data.toffcnt) || prev.companyContact,

//         guarantorName: txt(data.tgrnnam) || prev.guarantorName,
//         guarantorFatherName: txt(data.tgrnfth) || prev.guarantorFatherName,
//         guarantorAddress1: txt(data.tgrnadd1) || prev.guarantorAddress1,
//         guarantorAddress2: txt(data.tgrnadd2) || prev.guarantorAddress2,
//         guarantorCnic: data.tgrnnic ? formatCNIC(data.tgrnnic) : prev.guarantorCnic,
//         guarantorContact: txt(data.tgrnmob) || prev.guarantorContact,

//         witnessName: txt(data.twitnam) || prev.witnessName,
//         witnessFatherName: txt(data.twitfth) || prev.witnessFatherName,
//         witnessAddress1: txt(data.twitadd1) || prev.witnessAddress1,
//         witnessAddress2: txt(data.twitadd2) || prev.witnessAddress2,
//         witnessCnic: data.twitnic ? formatCNIC(data.twitnic) : prev.witnessCnic,
//         witnessContact: txt(data.twitmob) || prev.witnessContact,

//         date: data.tvrfdat ? toInputDate(data.tvrfdat) : prev.date,
//         latitude: txt(data.tlatval) || prev.latitude,
//         longitude: txt(data.tlngval) || prev.longitude,
//         remarks: txt(data.tcstrem) || prev.remarks,

//         documentName:
//           txt(pickField(data, ["tcstdoc", "docname", "tempdoc"])) ||
//           prev.documentName,
//       }));

//       if (data.tcstcod) {
//         setCode(String(data.tcstcod).trim());
//         setIsExistingCustomer(true);
//       }

//       // ⭐ NEW: Customer Data Found toast
//       showToast("Customer Data Found", "success");

//       const picRaw = pickField(data, ["tcstpic", "tcpic", "temppic", "photo"]);
//       const picName = String(picRaw ?? "").trim();
//       if (picName) {
//         setSelectedImage1(
//           picName.startsWith("data:") || picName.startsWith("blob:") ||
//           picName.startsWith("http") ? picName :
//           buildImageBaseForOrg(orgCode) + picName
//         );
//       }

//       const gPicRaw = pickField(data, ["tgrnpic", "tgurpic", "guarantorpic"]);
//       const gPicName = String(gPicRaw ?? "").trim();
//       if (gPicName) {
//         setSelectedGuarantorImage(
//           gPicName.startsWith("data:") || gPicName.startsWith("blob:") ||
//           gPicName.startsWith("http") ? gPicName :
//           buildImageBaseForOrg(orgCode) + gPicName
//         );
//       }

//       const wPicRaw = pickField(data, ["twitpic", "witnesspic"]);
//       const wPicName = String(wPicRaw ?? "").trim();
//       if (wPicName) {
//         setSelectedWitnessImage(
//           wPicName.startsWith("data:") || wPicName.startsWith("blob:") ||
//           wPicName.startsWith("http") ? wPicName :
//           buildImageBaseForOrg(orgCode) + wPicName
//         );
//       }
//     }).catch((error) => {
//       if (callId !== fetchCallIdRef.current) return;
//       console.error(">>> GetCustomer error for", cleanCode, ":", error);
//     });
//   };

//   // ============================================================
//   // Image / Document handlers
//   // ============================================================
//   const handlePhotoButtonClick = (ref) => () => {
//     if (ref.current) ref.current.click();
//   };

//   const handlePhotoFileChange = (setter) => (e) => {
//     const file = e.target.files && e.target.files[0];
//     if (!file) return;
//     if (!file.type.startsWith("image/")) {
//       showToast("Please select an image file", "error");
//       return;
//     }
//     if (file.size > 5 * 1024 * 1024) {
//       showToast("Image is too large (max 5 MB)", "error");
//       return;
//     }
//     setter(URL.createObjectURL(file));
//     showToast("Image selected", "success");
//   };

//   const handleDocumentUploadClick = () => {
//     if (documentInputRef.current) documentInputRef.current.click();
//   };

//   const handleDocumentFileChange = (e) => {
//     const file = e.target.files && e.target.files[0];
//     if (!file) return;
//     if (file.size > 10 * 1024 * 1024) {
//       showToast("Document is too large (max 10 MB)", "error");
//       return;
//     }
//     setFormStore((prev) => ({ ...prev, documentName: file.name }));
//     showToast("Document selected", "success");
//   };

//   const handleDocumentDownload = () => {
//     const fileName = String(formStore.documentName || "").trim();
//     if (!fileName) {
//       showToast("No document to download", "error");
//       return;
//     }
//     const url = `${IMAGE_SERVER_BASE}/${encodeURIComponent(orgCode)}/${encodeURIComponent(fileName)}`;
//     console.log(">>> Downloading document from:", url);

//     const a = document.createElement("a");
//     a.href = url;
//     a.download = fileName;
//     a.target = "_blank";
//     a.rel = "noopener noreferrer";
//     document.body.appendChild(a);
//     a.click();
//     document.body.removeChild(a);
//     showToast("Downloading " + fileName, "success");
//   };

//   const openImageModal = (src) => {
//     if (!src) return;
//     setModalImageSrc(src);
//     setIsImageModalOpen(true);
//   };

//   // ============================================================
//   // Save / Reset
//   // ============================================================
//   const resetForm = () => {
//     clearForm();
//     setCode("");
//     setMaxCode("");
//     setIsExistingCustomer(false);

//     // ⭐ Focus + select the Code field immediately
//     setTimeout(() => {
//       if (codeInputRef.current) {
//         const input = codeInputRef.current.querySelector("input");
//         if (input) {
//           input.focus();
//           input.select();
//         }
//       }
//     }, 150);

//     if (organisation && orgCode && locCode) {
//       setIsFetchingNextCode(true);
//       const apiUrl = apiLinks + "/NewCustomer.php";
//       const formData = new URLSearchParams({
//         code: orgCode,
//         FLocCod: locCode,
//       }).toString();

//       axios
//         .post(apiUrl, formData)
//         .then((response) => {
//           const newCode = extractNewCode(response.data);
//           console.log(">>> New button → NewCustomer.php returned:", response.data, "→ parsed:", newCode);
//           if (newCode !== "") {
//             setCode(newCode);
//             setMaxCode(newCode);

//             // ⭐ Re-focus + select after new code arrives
//             setTimeout(() => {
//               if (codeInputRef.current) {
//                 const input = codeInputRef.current.querySelector("input");
//                 if (input) {
//                   input.focus();
//                   input.select();
//                 }
//               }
//             }, 100);
//           }
//         })
//         .catch((error) => {
//           console.error("Error fetching next code:", error);
//         })
//         .finally(() => setIsFetchingNextCode(false));
//     }
//   };

//   const handleNew = () => resetForm();

//   const handleReturn = () => {
//     console.log("Return clicked");
//   };

//   const mapStatusForApi = (status) => {
//     if (status === "Active") return "A";
//     if (status === "Non-Active") return "N";
//     return status || "";
//   };

//   const amountForApi = (value) => {
//     const parsed = cleanAmount(stripCommas(value));
//     return parsed === "" ? "0" : String(parsed);
//   };

//   const strForApi = (value) => {
//     if (value === null || value === undefined) return "";
//     return String(value).trim();
//   };

//   const buildSavePayload = () => ({
//     code: orgCode,
//     FLocCod: locCode,
//     FUsrId: strForApi(user?.tusrid) || "sohaib",

//     FCstCod: strForApi(code),
//     FManCod: strForApi(formStore.man),
//     FRefCod: strForApi(formStore.ref),
//     FCstSts: mapStatusForApi(formStore.status),

//     FCstNam: strForApi(formStore.name),
//     FFthNam: strForApi(formStore.fatherName),
//     FAdd001: strForApi(formStore.address1),
//     FAdd002: strForApi(formStore.address2),
//     FEmlAdd: strForApi(formStore.email),
//     FMobNum: strForApi(formStore.mobile),

//     FTypCod: strForApi(selectedTypeCode),
//     FNicNum: strForApi(formStore.cnic).replace(/-/g, ""),
//     FNtnNum: strForApi(formStore.ntn),

//     FCtyCod: strForApi(selectedCityCode),
//     FAreCod: strForApi(selectedAreaCode),
//     FStaCod: strForApi(selectedStateCode),
//     FRegCod: strForApi(selectedRegionCode),

//     FMgrCod: strForApi(selectedManagerCode),
//     FSalCod: strForApi(selectedSalesmanCode),
//     FColCod: strForApi(selectedCollectorCode),
//     FGrpCod: strForApi(selectedGroupCode),

//     FCrtDay: strForApi(formStore.creditDays),
//     FCrtLim: amountForApi(formStore.creditLimit),
//     FDbtAmt: amountForApi(formStore.debit),
//     FCrtAmt: amountForApi(formStore.credit),
//     FMthAmt: amountForApi(formStore.amount),
//     FDueDat: formStore.dueDate ? toInputDate(formStore.dueDate) : "",

//     FCntPer: strForApi(formStore.contactName),
//     FCntMob: strForApi(formStore.contactMobile),

//     FOwnNam: strForApi(formStore.ownerName),
//     FOwnMob: strForApi(formStore.ownerMobile),

//     FGrnNam: strForApi(formStore.guarantorName),
//     FGrnFth: strForApi(formStore.guarantorFatherName),
//     FGrnAdd1: strForApi(formStore.guarantorAddress1),
//     FGrnAdd2: strForApi(formStore.guarantorAddress2),
//     FGrnNic: strForApi(formStore.guarantorCnic).replace(/-/g, ""),
//     FGrnMob: strForApi(formStore.guarantorContact),

//     FWitNam: strForApi(formStore.witnessName),
//     FWitFth: strForApi(formStore.witnessFatherName),
//     FWitAdd1: strForApi(formStore.witnessAddress1),
//     FWitAdd2: strForApi(formStore.witnessAddress2),
//     FWitNic: strForApi(formStore.witnessCnic).replace(/-/g, ""),
//     FWitMob: strForApi(formStore.witnessContact),

//     FCstPrf: strForApi(formStore.profession),
//     FOffAdd1: strForApi(formStore.companyName),
//     FOffCnt: strForApi(formStore.companyContact),
//     FOffAdd2: strForApi(formStore.companyAddress),

//     FMthInc: "0",

//     FVrfCod: strForApi(selectedVerifyCode),
//     FVrfDat: formStore.date ? toInputDate(formStore.date) : "",
//     FLatVal: strForApi(formStore.latitude),
//     FLngVal: strForApi(formStore.longitude),
//     FCstRem: strForApi(formStore.remarks),
//   });

//   // Save customer/guarantor/witness mobile data
//   const saveMobileRecord = async (payload) => {
//     const apiUrl = apiLinks + "/SaveCustomerMobile.php";
//     const formData = new URLSearchParams();

//     Object.entries(payload).forEach(([key, value]) => {
//       formData.append(key, value === null || value === undefined ? "" : String(value));
//     });

//     console.log(">>> SaveCustomerMobile.php request:", payload);

//     const response = await axios.post(apiUrl, formData.toString(), {
//       headers: { "Content-Type": "application/x-www-form-urlencoded" },
//     });
//     console.log(">>> SaveCustomerMobile.php response:", response.status, response.data);
//     return response;
//   };

//   const handleSave = async () => {
//     if (isSavingRef.current || isCoolingDownRef.current) return;
//     isSavingRef.current = true;

//     if (!organisation) {
//       showToast("Organisation data not available", "error");
//       isSavingRef.current = false;
//       return;
//     }
//     if (isFetchingNextCode) {
//       showToast("Please wait, fetching next code...", "error");
//       isSavingRef.current = false;
//       return;
//     }
//     const trimmedCode = String(code || "").trim();
//     if (!trimmedCode) {
//       showToast("Code is required", "error");
//       isSavingRef.current = false;
//       return;
//     }
//     const trimmedName = String(formStore.name || "").trim();
//     if (!trimmedName) {
//       showToast("Customer Name is required", "error");
//       isSavingRef.current = false;
//       return;
//     }

//     setIsSaving(true);

//     try {
//       // STEP 1: Save Mobile records (Customer / Guarantor / Witness)
//       if (String(formStore.mobile || "").trim()) {
//         try {
//           await saveMobileRecord({
//             FMobNum: strForApi(formStore.mobile),
//             FCstNam: strForApi(formStore.name),
//             FFthNam: strForApi(formStore.fatherName),
//             FMobSts: mapStatusForApi(formStore.status),
//             FAdd001: strForApi(formStore.address1),
//             FAdd002: strForApi(formStore.address2),
//             FPhnNum: strForApi(formStore.contactMobile),
//             FEmlAdd: strForApi(formStore.email),
//             FNicNum: strForApi(formStore.cnic).replace(/-/g, ""),
//             FLatVal: strForApi(formStore.latitude),
//             FLngVal: strForApi(formStore.longitude),
//             FAreCod: strForApi(selectedAreaCode),
//             FCtyCod: strForApi(selectedCityCode),
//             FSmsSts: "N",
//             code: orgCode,
//             FLocCod: locCode,
//           });
//         } catch (e) {
//           console.warn(">>> SaveCustomerMobile (Customer) failed:", e);
//         }
//       }

//       if (String(formStore.guarantorContact || "").trim()) {
//         try {
//           await saveMobileRecord({
//             FMobNum: strForApi(formStore.guarantorContact),
//             FCstNam: strForApi(formStore.guarantorName),
//             FFthNam: strForApi(formStore.guarantorFatherName),
//             FMobSts: "A",
//             FAdd001: strForApi(formStore.guarantorAddress1),
//             FAdd002: strForApi(formStore.guarantorAddress2),
//             FPhnNum: "",
//             FEmlAdd: "",
//             FNicNum: strForApi(formStore.guarantorCnic).replace(/-/g, ""),
//             FLatVal: "",
//             FLngVal: "",
//             FAreCod: "",
//             FCtyCod: "",
//             FSmsSts: "N",
//             code: orgCode,
//             FLocCod: locCode,
//           });
//         } catch (e) {
//           console.warn(">>> SaveCustomerMobile (Guarantor) failed:", e);
//         }
//       }

//       if (String(formStore.witnessContact || "").trim()) {
//         try {
//           await saveMobileRecord({
//             FMobNum: strForApi(formStore.witnessContact),
//             FCstNam: strForApi(formStore.witnessName),
//             FFthNam: strForApi(formStore.witnessFatherName),
//             FMobSts: "A",
//             FAdd001: strForApi(formStore.witnessAddress1),
//             FAdd002: strForApi(formStore.witnessAddress2),
//             FPhnNum: "",
//             FEmlAdd: "",
//             FNicNum: strForApi(formStore.witnessCnic).replace(/-/g, ""),
//             FLatVal: "",
//             FLngVal: "",
//             FAreCod: "",
//             FCtyCod: "",
//             FSmsSts: "N",
//             code: orgCode,
//             FLocCod: locCode,
//           });
//         } catch (e) {
//           console.warn(">>> SaveCustomerMobile (Witness) failed:", e);
//         }
//       }

//       // STEP 2: Save the main Customer record (SaveCustomer.php)
//       const apiUrl = apiLinks + "/SaveCustomer.php";
//       const payload = buildSavePayload();
//       payload.FCstCod = trimmedCode;

//       console.log("=== SaveCustomer PAYLOAD ===");
//       console.log(JSON.stringify(payload, null, 2));

//       const formData = new FormData();

//       Object.entries(payload).forEach(([key, value]) => {
//         formData.append(key, value == null ? "" : value);
//       });

//       const photoInput = photoInputRef.current;
//       const pickedPhotoFile =
//         photoInput && photoInput.files && photoInput.files[0];
//       if (pickedPhotoFile) {
//         formData.set("FCstPic", pickedPhotoFile);
//         console.log(">>> Attaching photo:", pickedPhotoFile.name, pickedPhotoFile.size, "bytes");
//       } else {
//         console.log(">>> No new photo picked");
//       }

//       const gPhotoInput = guarantorPhotoInputRef.current;
//       const pickedGPhoto =
//         gPhotoInput && gPhotoInput.files && gPhotoInput.files[0];
//       if (pickedGPhoto) {
//         formData.set("FGrnPic", pickedGPhoto);
//         console.log(">>> Attaching guarantor photo:", pickedGPhoto.name);
//       } else {
//         console.log(">>> No new guarantor photo picked");
//       }

//       const wPhotoInput = witnessPhotoInputRef.current;
//       const pickedWPhoto =
//         wPhotoInput && wPhotoInput.files && wPhotoInput.files[0];
//       if (pickedWPhoto) {
//         formData.set("FWitPic", pickedWPhoto);
//         console.log(">>> Attaching witness photo:", pickedWPhoto.name);
//       } else {
//         console.log(">>> No new witness photo picked");
//       }

//       const docInput = documentInputRef.current;
//       const pickedDocFile =
//         docInput && docInput.files && docInput.files[0];
//       if (pickedDocFile) {
//         formData.set("FCstDoc", pickedDocFile);
//         console.log(">>> Attaching document:", pickedDocFile.name);
//       } else {
//         console.log(">>> No new document picked");
//       }

//       console.log("=== FORMDATA ENTRIES ===");
//       for (let [k, v] of formData.entries()) {
//         console.log("  ", k, "=", v instanceof File ? `[File: ${v.name}]` : v);
//       }

//       const response = await axios.post(apiUrl, formData, {});

//       console.log("=== RESPONSE ===", response.status, response.data);

//       if (response.status === 200) {
//         // ⭐ Context-aware toast
//         showToast(
//           isExistingCustomer
//             ? "Customer Updated Successfully"
//             : "New Customer Added Successfully",
//           "success"
//         );
//         await loadCustomerList();
//         resetForm();

//         // ⭐ Focus + select the Code field after save
//         setTimeout(() => {
//           if (codeInputRef.current) {
//             const input = codeInputRef.current.querySelector("input");
//             if (input) {
//               input.focus();
//               input.select();
//             }
//           }
//         }, 150);

//         isCoolingDownRef.current = true;
//         setIsCoolingDown(true);
//         setTimeout(() => {
//           isCoolingDownRef.current = false;
//           setIsCoolingDown(false);
//         }, 5000);
//       } else {
//         showToast(`Save failed: ${response.status}`, "error");
//       }
//     } catch (error) {
//       console.error("=== SAVE ERROR ===", error);
//       console.error("Error response:", error.response?.data);
//       console.error("Error status:", error.response?.status);

//       let errorMessage = "Error saving data";
//       const data = error.response?.data;
//       if (typeof data === "string" && data.trim()) {
//         errorMessage = data.trim();
//       } else if (data && typeof data === "object") {
//         errorMessage = data.message || data.error || errorMessage;
//       }
//       showToast(String(errorMessage).slice(0, 200), "error");
//     } finally {
//       setIsSaving(false);
//       isSavingRef.current = false;
//     }
//   };

//   const handleSubmit = (e) => e.preventDefault();

//   // Customer search (dbl-click Code field)
//   const handleInstallerSelect = (data) => {
//     if (!data) return;
//     const selectedCode =
//       data.code ??
//       data.tcstcod ??
//       data.Code ??
//       data.tempcod ??
//       data.FCusCod ??
//       "";
//     const clean = String(selectedCode || "").trim();
//     if (!clean) {
//       console.warn(">>> handleInstallerSelect: no code in selection", data);
//       return;
//     }
//     setCode(clean);
//     fetchCustomerDataByCode(clean);
//   };

//   const handleInstallerCodeChange = (newCode) => {
//     const clean = String(newCode || "").trim();
//     if (!clean) return;
//     fetchCustomerDataByCode(clean);
//   };

//   // Customer Mobile 3-dot select — call GetMobileNo.php
//   const handleMobileSelect = async (data) => {
//     if (!data) return;
//     const pickedMobile = String(data.tmobnum ?? data.Mobile ?? "").trim();
//     setIsMobileModalOpen(false);
//     if (!pickedMobile) return;

//     setFormStore((prev) => ({ ...prev, mobile: pickedMobile }));

//     const mobileData = await fetchDataByMobile(pickedMobile);
//     if (!mobileData) {
//       showToast("No record found for this mobile number", "error");
//       return;
//     }

//     setFormStore((prev) => ({
//       ...prev,
//       mobile: txt(mobileData.tmobnum) || pickedMobile,
//       name: txt(mobileData.tcstnam) || prev.name,
//       fatherName: txt(mobileData.tfthnam) || prev.fatherName,
//       address1: txt(mobileData.tadd001) || prev.address1,
//       address2: txt(mobileData.tadd002) || prev.address2,
//       email: txt(mobileData.temladd) || prev.email,
//       cnic: mobileData.tnicnum ? formatCNIC(mobileData.tnicnum) : prev.cnic,
//       ntn: txt(mobileData.tntnnum) || prev.ntn,
//       latitude: txt(mobileData.tlatval) || prev.latitude,
//       longitude: txt(mobileData.tlngval) || prev.longitude,
//     }));

//     const linkedCode = String(mobileData.tcstcod ?? "").trim();
//     if (linkedCode) {
//       setCode(linkedCode);
//       fetchCustomerDataByCode(linkedCode);
//     }
//   };

//   // Guarantor Mobile 3-dot select — call GetMobileNo.php
//   const handleGuarantorMobileSelect = async (data) => {
//     if (!data) return;
//     const pickedMobile = String(data.tmobnum ?? data.Mobile ?? "").trim();
//     setIsGuarantorMobileModalOpen(false);
//     if (!pickedMobile) return;

//     setFormStore((prev) => ({ ...prev, guarantorContact: pickedMobile }));

//     const mobileData = await fetchDataByMobile(pickedMobile);
//     if (!mobileData) {
//       showToast("Mobile saved. No prior record found.", "success");
//       return;
//     }

//     setFormStore((prev) => ({
//       ...prev,
//       guarantorContact: txt(mobileData.tmobnum) || pickedMobile,
//       guarantorName: txt(mobileData.tcstnam) || prev.guarantorName,
//       guarantorFatherName: txt(mobileData.tfthnam) || prev.guarantorFatherName,
//       guarantorAddress1: txt(mobileData.tadd001) || prev.guarantorAddress1,
//       guarantorAddress2: txt(mobileData.tadd002) || prev.guarantorAddress2,
//       guarantorCnic: mobileData.tnicnum
//         ? formatCNIC(mobileData.tnicnum)
//         : prev.guarantorCnic,
//     }));
//   };

//   // Witness Mobile 3-dot select — call GetMobileNo.php
//   const handleWitnessMobileSelect = async (data) => {
//     if (!data) return;
//     const pickedMobile = String(data.tmobnum ?? data.Mobile ?? "").trim();
//     setIsWitnessMobileModalOpen(false);
//     if (!pickedMobile) return;

//     setFormStore((prev) => ({ ...prev, witnessContact: pickedMobile }));

//     const mobileData = await fetchDataByMobile(pickedMobile);
//     if (!mobileData) {
//       showToast("Mobile saved. No prior record found.", "success");
//       return;
//     }

//     setFormStore((prev) => ({
//       ...prev,
//       witnessContact: txt(mobileData.tmobnum) || pickedMobile,
//       witnessName: txt(mobileData.tcstnam) || prev.witnessName,
//       witnessFatherName: txt(mobileData.tfthnam) || prev.witnessFatherName,
//       witnessAddress1: txt(mobileData.tadd001) || prev.witnessAddress1,
//       witnessAddress2: txt(mobileData.tadd002) || prev.witnessAddress2,
//       witnessCnic: mobileData.tnicnum
//         ? formatCNIC(mobileData.tnicnum)
//         : prev.witnessCnic,
//     }));
//   };

//   const handleModalClose = () => {
//     setIsSearchModalOpen(false);
//     setTimeout(() => {
//       if (codeInputRef.current) {
//         const input = codeInputRef.current.querySelector("input");
//         if (input) { input.focus(); input.select(); }
//       }
//     }, 100);
//   };

//   // ============================================================
//   // RENDER
//   // ============================================================
//   return (
//     <div className="el-page-host">
//       <div className="el-page-wrapper">
//         <div className="el-page">
//           <div className="el-card">
//             <form onSubmit={handleSubmit}>
//               <header className="el-header">
//                 <h1>Customer Maintenance</h1>
//                 <p className="el-subtitle">
//                   Enter the Customer Maintenance information in the form below
//                 </p>
//               </header>

//               <div className="el-scrollable-body">
//                 {/* ==================== TOP BAR ==================== */}
//                 <div className="el-top-bar">
//                   <div className="el-field-row"
//                     onKeyDownCapture={(e) => {
//                       if (e.key === "Enter") {
//                         e.preventDefault();
//                         e.stopPropagation();
//                         fetchCustomerDataByCode(code);
//                         focusFirstVisible([manRef, refRef, statusRef, mobileRef]);
//                       }
//                     }}
//                   >
//                     <span className="el-field-label-right">Code :</span>
//                     <InstallationCode
//                       ref={codeInputRef}
//                       organisation={organisation}
//                       apiLinks={apiLinks}
//                       apiEndpoint="/NewCustomer.php"
//                       getLocationNumber={getLocationNumber}
//                       getLocationnumber={getLocationnumber}
//                       code={code}
//                       setCode={setCode}
//                       onKeyDown={(e) => handleKeyDown(e, manRef)}
//                       onDoubleClick={() => setIsSearchModalOpen(true)}
//                       onCodeChange={handleInstallerCodeChange}
//                       maxCode={maxCode}
//                       onMaxCodeChange={setMaxCode}
//                       codeFormat="long"
//                       codePrefix="14-01"
//                     />
//                   </div>

//                   <div className="el-field-row el-field-abb">
//                     <span className="el-field-label-right">Man :</span>
//                     <input
//                       ref={manRef}
//                       value={formStore.man}
//                       onChange={set("man")}
//                       placeholder="Man"
//                       maxLength={20}
//                       onKeyDown={(e) => handleKeyDown(e, refRef)}
//                     />
//                   </div>

//                   <div className="el-field-row el-field-abb">
//                     <span className="el-field-label-right">Ref :</span>
//                     <input
//                       ref={refRef}
//                       value={formStore.ref}
//                       onChange={set("ref")}
//                       placeholder="Ref"
//                       maxLength={20}
//                       onKeyDown={(e) => handleKeyDown(e, statusRef)}
//                     />
//                   </div>

//                   <div className="el-field-row">
//                     <span className="el-field-label-right">Sts :</span>
//                     <select
//                       ref={statusRef}
//                       value={formStore.status}
//                       onChange={set("status")}
//                       onKeyDown={(e) => handleKeyDown(e, mobileRef)}
//                     >
//                       {STATUS_OPTIONS.map((opt) => (
//                         <option key={opt} value={opt}>{opt}</option>
//                       ))}
//                     </select>
//                   </div>
//                 </div>

//                 <div className="el-body">
//                   <div className="el-main-content">
//                     <section className="el-section">
//                       <div className="el-stack">

//                         {/* ==================== MOBILE ==================== */}
//                         <div className="el-field-row">
//                           <span className="el-field-label-right">Mobile :</span>
//                           <input
//                             ref={mobileRef}
//                             type="tel"
//                             value={formStore.mobile}
//                             onChange={set("mobile")}
//                             placeholder="Customer Mobile"
//                             className="mobile-field"
//                             maxLength={11}
//                             onKeyDown={(e) => {
//                               if (!/[0-9]/.test(e.key) && e.key.length === 1)
//                                 e.preventDefault();
//                               handleKeyDown(e, nameRef);
//                             }}
//                           />
//                           <button
//                             type="button"
//                             className="el-mobile-3dot-btn"
//                             title="Search by Mobile / CNIC / Name"
//                             tabIndex={-1}
//                             onClick={() => setIsMobileModalOpen(true)}
//                           >
//                             ⋮
//                           </button>
//                         </div>

//                         {/* ==================== NAME ==================== */}
//                         <div className="el-field-row">
//                           <span className="el-field-label-right">Name :</span>
//                           <input
//                             ref={nameRef}
//                             value={formStore.name}
//                             onChange={set("name")}
//                             placeholder="Name"
//                             className="name-field"
//                             maxLength={40}
//                             onKeyDown={(e) => handleKeyDown(e, fatherNameRef)}
//                           />
//                         </div>

//                         <hr className="el-mobile-divider" />

//                         {/* ============ FTH NAME / ADDRESS / EMAIL / TYPE / CNIC / NTN ============ */}
//                         <div className="el-row-split">
//                           <div className="el-row-split-left">
//                             <div className="el-field-row">
//                               <span className="el-field-label-right">Fth Name :</span>
//                               <input
//                                 ref={fatherNameRef}
//                                 value={formStore.fatherName}
//                                 onChange={set("fatherName")}
//                                 placeholder="Father Name"
//                                 maxLength={40}
//                                 onKeyDown={(e) => handleKeyDown(e, address1Ref)}
//                               />
//                             </div>

//                             <div className="el-field-row">
//                               <span className="el-field-label-right">Address :</span>
//                               <input
//                                 ref={address1Ref}
//                                 value={formStore.address1}
//                                 onChange={set("address1")}
//                                 placeholder="Customer Address 1"
//                                 maxLength={40}
//                                 onKeyDown={(e) => handleKeyDown(e, address2Ref)}
//                               />
//                             </div>

//                             <div className="el-field-row">
//                               <span className="el-field-label-right"></span>
//                               <input
//                                 ref={address2Ref}
//                                 value={formStore.address2}
//                                 onChange={set("address2")}
//                                 placeholder="Customer Address 2"
//                                 maxLength={40}
//                                 onKeyDown={(e) => handleKeyDown(e, emailRef)}
//                               />
//                             </div>

//                             <div className="el-field-row">
//                               <span className="el-field-label-right">Email :</span>
//                               <input
//                                 ref={emailRef}
//                                 value={formStore.email}
//                                 onChange={set("email")}
//                                 placeholder="Customer Email"
//                                 className="email-field"
//                                 maxLength={40}
//                                 onKeyDown={(e) => handleKeyDown(e, typeRef)}
//                               />
//                             </div>

//                             <div className="el-field-row">
//                               <span className="el-field-label-right">Type :</span>
//                               <DynamicSelect
//                                 ref={typeRef}
//                                 fetchUrl={`${apiLinks}/GetActiveCustTypes.php`}
//                                 valueKey="ttypdsc"
//                                 labelKey="ttypdsc"
//                                 codeKey="ttypcod"
//                                 organisation={organisation}
//                                 locationNumber={getLocationNumber || getLocationnumber()}
//                                 value={isInitialLoad ? "" : (formStore.type || "")}
//                                 initialCode={selectedTypeCode}
//                                 onChange={(desc) => {
//                                   setFormStore((prev) => ({ ...prev, type: desc }));
//                                 }}
//                                 onCodeChange={setSelectedTypeCode}
//                                 placeholder="Search or select..."
//                                 onKeyDown={(e) => handleKeyDown(e, cnicRef)}
//                               />
//                             </div>

//                             <div className="el-row-cnic-ntn">
//                               <div className="el-cnic-cell">
//                                 <span className="el-field-label-right">CNIC :</span>
//                                 <input
//                                   ref={cnicRef}
//                                   value={formStore.cnic}
//                                   onChange={(e) => {
//                                     const formatted = formatCNIC(e.target.value);
//                                     setFormStore((prev) => ({ ...prev, cnic: formatted }));
//                                   }}
//                                   placeholder="eg. (XXXXX-XXXXXXX-X)"
//                                   maxLength={15}
//                                   onKeyDown={(e) => handleKeyDown(e, ntnRef)}
//                                 />
//                               </div>
//                               <div className="el-ntn-cell">
//                                 <span className="el-field-label-right">NTN :</span>
//                                 <input
//                                   ref={ntnRef}
//                                   value={formStore.ntn}
//                                   onChange={set("ntn")}
//                                   placeholder="eg. NTN"
//                                   maxLength={20}
//                                   onKeyDown={(e) => handleKeyDown(e, cityRef)}
//                                 />
//                               </div>
//                             </div>
//                           </div>

//                           <div className="el-row-split-right">
//                             <div
//                               className="el-photo-box"
//                               style={{
//                                 display: "flex", alignItems: "center",
//                                 justifyContent: "center", overflow: "hidden",
//                                 backgroundColor: "#f5f5f5",
//                                 cursor: selectedImage1 ? "pointer" : "default",
//                               }}
//                               onClick={() => openImageModal(selectedImage1)}
//                               title={selectedImage1 ? "Click to view full size" : ""}
//                             >
//                               {selectedImage1 ? (
//                                 <img
//                                   src={selectedImage1}
//                                   alt="Customer"
//                                   style={{ width: "100%", height: "100%",
//                                     objectFit: "contain", objectPosition: "center",
//                                     display: "block", borderRadius: "inherit" }}
//                                   onError={(e) => { e.currentTarget.style.display = "none"; }}
//                                   onLoad={(e) => { e.currentTarget.style.display = "block"; }}
//                                 />
//                               ) : (
//                                 <span className="el-photo-placeholder">No Image</span>
//                               )}
//                             </div>
//                             <input
//                               ref={photoInputRef}
//                               type="file"
//                               accept="image/*"
//                               style={{ display: "none" }}
//                               onChange={handlePhotoFileChange(setSelectedImage1)}
//                             />
//                             <button
//                               type="button"
//                               className="el-upload-btn"
//                               onClick={handlePhotoButtonClick(photoInputRef)}
//                             >
//                               ⬆ Upload
//                             </button>
//                           </div>
//                         </div>

//                         <hr className="el-mobile-divider" />

//                         {/* ==================== CITY / AREA ==================== */}
//                         <div className="el-row-split-pair">
//                           <div className="el-field-row el-half">
//                             <span className="el-field-label-right">City :</span>
//                             <DynamicSelect
//                               ref={cityRef}
//                               fetchUrl={`${apiLinks}/GetActiveCity.php`}
//                               valueKey="tctydsc"
//                               labelKey="tctydsc"
//                               codeKey="tctycod"
//                               organisation={organisation}
//                               locationNumber={getLocationNumber || getLocationnumber()}
//                               value={isInitialLoad ? "" : (formStore.city || "")}
//                               initialCode={selectedCityCode}
//                               onChange={(desc) => {
//                                 setFormStore((prev) => ({ ...prev, city: desc }));
//                               }}
//                               onCodeChange={setSelectedCityCode}
//                               placeholder="Please Select City"
//                               onKeyDown={(e) => handleKeyDown(e, areaRef)}
//                             />
//                           </div>
//                           <div className="el-field-row el-half">
//                             <span className="el-field-label-right">Area :</span>
//                             <DynamicSelect
//                               ref={areaRef}
//                               fetchUrl={`${apiLinks}/GetActiveArea.php`}
//                               valueKey="taredsc"
//                               labelKey="taredsc"
//                               codeKey="tarecod"
//                               organisation={organisation}
//                               locationNumber={getLocationNumber || getLocationnumber()}
//                               value={isInitialLoad ? "" : (formStore.area || "")}
//                               initialCode={selectedAreaCode}
//                               onChange={(desc) => {
//                                 setFormStore((prev) => ({ ...prev, area: desc }));
//                               }}
//                               onCodeChange={setSelectedAreaCode}
//                               placeholder="Please Select Area"
//                               onKeyDown={(e) => handleKeyDown(e, stateRef)}
//                             />
//                           </div>
//                         </div>

//                         {/* ==================== STATE / REGION ==================== */}
//                         <div className="el-row-split-pair">
//                           <div className="el-field-row el-half">
//                             <span className="el-field-label-right">State :</span>
//                             <DynamicSelect
//                               ref={stateRef}
//                               fetchUrl={`${apiLinks}/GetActiveStates.php`}
//                               valueKey="tstadsc"
//                               labelKey="tstadsc"
//                               codeKey="tstacod"
//                               organisation={organisation}
//                               locationNumber={getLocationNumber || getLocationnumber()}
//                               value={isInitialLoad ? "" : (formStore.state || "")}
//                               initialCode={selectedStateCode}
//                               onChange={(desc) => {
//                                 setFormStore((prev) => ({ ...prev, state: desc }));
//                               }}
//                               onCodeChange={setSelectedStateCode}
//                               placeholder="Please Select State"
//                               onKeyDown={(e) => handleKeyDown(e, regionRef)}
//                             />
//                           </div>
//                           <div className="el-field-row el-half">
//                             <span className="el-field-label-right">Region :</span>
//                             <DynamicSelect
//                               ref={regionRef}
//                               fetchUrl={`${apiLinks}/GetActiveRegion.php`}
//                               valueKey="tregdsc"
//                               labelKey="tregdsc"
//                               codeKey="tregcod"
//                               organisation={organisation}
//                               locationNumber={getLocationNumber || getLocationnumber()}
//                               value={isInitialLoad ? "" : (formStore.region || "")}
//                               initialCode={selectedRegionCode}
//                               onChange={(desc) => {
//                                 setFormStore((prev) => ({ ...prev, region: desc }));
//                               }}
//                               onCodeChange={setSelectedRegionCode}
//                               placeholder="Please Select Region"
//                               onKeyDown={(e) => handleKeyDown(e, managerRef)}
//                             />
//                           </div>
//                         </div>

//                         <hr className="el-mobile-divider" />

//                         {/* ==================== MANAGER / SALESMAN ==================== */}
//                         <div className="el-row-split-pair">
//                           <div className="el-field-row el-half">
//                             <span className="el-field-label-right">Manager :</span>
//                             <DynamicSelect
//                               ref={managerRef}
//                               fetchUrl={`${apiLinks}/GetActiveManagers.php`}
//                               valueKey="tmgrnam"
//                               labelKey="tmgrnam"
//                               codeKey="tmgrcod"
//                               organisation={organisation}
//                               locationNumber={getLocationNumber || getLocationnumber()}
//                               value={isInitialLoad ? "" : (formStore.manager || "")}
//                               initialCode={selectedManagerCode}
//                               onChange={(desc) => {
//                                 setFormStore((prev) => ({ ...prev, manager: desc }));
//                               }}
//                               onCodeChange={setSelectedManagerCode}
//                               placeholder="Please Select Manager"
//                               onKeyDown={(e) => handleKeyDown(e, salesmanRef)}
//                             />
//                           </div>
//                           <div className="el-field-row el-half">
//                             <span className="el-field-label-right">Sales Man :</span>
//                             <DynamicSelect
//                               ref={salesmanRef}
//                               fetchUrl={`${apiLinks}/GetActiveSalesMen.php`}
//                               valueKey="tsalnam"
//                               labelKey="tsalnam"
//                               codeKey="tsalcod"
//                               organisation={organisation}
//                               locationNumber={getLocationNumber || getLocationnumber()}
//                               value={isInitialLoad ? "" : (formStore.salesman || "")}
//                               initialCode={selectedSalesmanCode}
//                               onChange={(desc) => {
//                                 setFormStore((prev) => ({ ...prev, salesman: desc }));
//                               }}
//                               onCodeChange={setSelectedSalesmanCode}
//                               placeholder="Please Select Salesman"
//                               onKeyDown={(e) => handleKeyDown(e, collectorRef)}
//                             />
//                           </div>
//                         </div>

//                         {/* ==================== COLLECTOR / GROUP ==================== */}
//                         <div className="el-row-split-pair">
//                           <div className="el-field-row el-half">
//                             <span className="el-field-label-right">Collector :</span>
//                             <DynamicSelect
//                               ref={collectorRef}
//                               fetchUrl={`${apiLinks}/GetActiveCollector.php`}
//                               valueKey="tcolnam"
//                               labelKey="tcolnam"
//                               codeKey="tcolcod"
//                               organisation={organisation}
//                               locationNumber={getLocationNumber || getLocationnumber()}
//                               value={isInitialLoad ? "" : (formStore.collector || "")}
//                               initialCode={selectedCollectorCode}
//                               onChange={(desc) => {
//                                 setFormStore((prev) => ({ ...prev, collector: desc }));
//                               }}
//                               onCodeChange={setSelectedCollectorCode}
//                               placeholder="Please Select Collector"
//                               onKeyDown={(e) => handleKeyDown(e, groupRef)}
//                             />
//                           </div>
//                           <div className="el-field-row el-half">
//                             <span className="el-field-label-right">Group :</span>
//                             <DynamicSelect
//                               ref={groupRef}
//                               fetchUrl={`${apiLinks}/GetActiveGroups.php`}
//                               valueKey="tgrpdsc"
//                               labelKey="tgrpdsc"
//                               codeKey="tgrpcod"
//                               organisation={organisation}
//                               locationNumber={getLocationNumber || getLocationnumber()}
//                               value={isInitialLoad ? "" : (formStore.group || "")}
//                               initialCode={selectedGroupCode}
//                               onChange={(desc) => {
//                                 setFormStore((prev) => ({ ...prev, group: desc }));
//                               }}
//                               onCodeChange={setSelectedGroupCode}
//                               placeholder="Please Select Group"
//                               onKeyDown={(e) => handleKeyDown(e, creditDaysRef)}
//                             />
//                           </div>
//                         </div>

//                         <hr className="el-mobile-divider" />

//                         {/* ==================== CREDIT SECTION ==================== */}
//                         <div className="el-row-split-pair">
//                           <div className="el-field-row el-half">
//                             <span className="el-field-label-right">Credit Days :</span>
//                             <input
//                               ref={creditDaysRef}
//                               value={formStore.creditDays}
//                               onChange={set("creditDays")}
//                               placeholder="CreditDays"
//                               className="el-num-field"
//                               maxLength={5}
//                               onKeyDown={(e) => handleKeyDown(e, creditLimitRef)}
//                             />
//                           </div>
//                           <div className="el-field-row el-half">
//                             <span className="el-field-label-right">Credit Limit :</span>
//                             <input
//                               ref={creditLimitRef}
//                               value={formStore.creditLimit}
//                               onChange={handleMoneyChange("creditLimit")}
//                               placeholder="CreditLimit"
//                               className="el-num-field"
//                               maxLength={20}
//                               onKeyDown={(e) => handleKeyDown(e, debitRef)}
//                             />
//                           </div>
//                         </div>

//                         <div className="el-row-split-pair">
//                           <div className="el-field-row el-half">
//                             <span className="el-field-label-right">Debit :</span>
//                             <input
//                               ref={debitRef}
//                               value={formStore.debit}
//                               onChange={handleMoneyChange("debit")}
//                               placeholder="Debit"
//                               className="el-num-field"
//                               maxLength={20}
//                               onKeyDown={(e) => handleKeyDown(e, creditRef)}
//                             />
//                           </div>
//                           <div className="el-field-row el-half">
//                             <span className="el-field-label-right">Credit :</span>
//                             <input
//                               ref={creditRef}
//                               value={formStore.credit}
//                               onChange={handleMoneyChange("credit")}
//                               placeholder="Credit"
//                               className="el-num-field"
//                               maxLength={20}
//                               onKeyDown={(e) => handleKeyDown(e, amountRef)}
//                             />
//                           </div>
//                         </div>

//                         <div className="el-row-split-pair">
//                           <div className="el-field-row el-half">
//                             <span className="el-field-label-right">Amount :</span>
//                             <input
//                               ref={amountRef}
//                               value={formStore.amount}
//                               onChange={handleMoneyChange("amount")}
//                               placeholder="Amount"
//                               className="el-num-field"
//                               maxLength={20}
//                               onKeyDown={(e) => handleKeyDown(e, dueDateRef)}
//                             />
//                           </div>
//                           <div className="el-field-row el-half">
//                             <span className="el-field-label-right">Due Date :</span>
//                             <input
//                               ref={dueDateRef}
//                               type="date"
//                               value={formStore.dueDate || ""}
//                               onChange={handleDateChange("dueDate")}
//                               className="el-date-inline"
//                               onKeyDown={(e) => handleDateKeyDown(e, contactNameRef)}
//                             />
//                           </div>
//                         </div>

//                         <hr className="el-mobile-divider" />

//                         {/* ==================== CONTACT / OWNER ==================== */}
//                         <div className="el-row-split-pair">
//                           <div className="el-field-row el-half">
//                             <span className="el-field-label-right">Name :</span>
//                             <input
//                               ref={contactNameRef}
//                               value={formStore.contactName}
//                               onChange={set("contactName")}
//                               placeholder="Contact Name"
//                               maxLength={40}
//                               onKeyDown={(e) => handleKeyDown(e, contactMobileRef)}
//                             />
//                           </div>
//                           <div className="el-field-row el-half">
//                             <span className="el-field-label-right">Mobile :</span>
//                             <input
//                               ref={contactMobileRef}
//                               type="tel"
//                               value={formStore.contactMobile}
//                               onChange={set("contactMobile")}
//                               placeholder="Mobile"
//                               maxLength={11}
//                               onKeyDown={(e) => {
//                                 if (!/[0-9]/.test(e.key) && e.key.length === 1)
//                                   e.preventDefault();
//                                 handleKeyDown(e, ownerNameRef);
//                               }}
//                             />
//                           </div>
//                         </div>

//                         <div className="el-row-split-pair">
//                           <div className="el-field-row el-half">
//                             <span className="el-field-label-right">Owner Name :</span>
//                             <input
//                               ref={ownerNameRef}
//                               value={formStore.ownerName}
//                               onChange={set("ownerName")}
//                               placeholder="Owner Name"
//                               maxLength={40}
//                               onKeyDown={(e) => handleKeyDown(e, ownerMobileRef)}
//                             />
//                           </div>
//                           <div className="el-field-row el-half">
//                             <span className="el-field-label-right">Mobile :</span>
//                             <input
//                               ref={ownerMobileRef}
//                               type="tel"
//                               value={formStore.ownerMobile}
//                               onChange={set("ownerMobile")}
//                               placeholder="Mobile"
//                               maxLength={11}
//                               onKeyDown={(e) => {
//                                 if (!/[0-9]/.test(e.key) && e.key.length === 1)
//                                   e.preventDefault();
//                                 handleKeyDown(e, professionRef);
//                               }}
//                             />
//                           </div>
//                         </div>

//                         <hr className="el-mobile-divider" />

//                         <div className="el-row-split-pair">
//                           <div className="el-field-row el-half">
//                             <span className="el-field-label-right">Profession :</span>
//                             <input
//                               ref={professionRef}
//                               value={formStore.profession}
//                               onChange={set("profession")}
//                               placeholder="Company Name"
//                               maxLength={40}
//                               onKeyDown={(e) => handleKeyDown(e, companyNameRef)}
//                             />
//                           </div>
//                           <div className="el-field-row el-half">
//                             <span className="el-field-label-right">Company :</span>
//                             <input
//                               ref={companyNameRef}
//                               value={formStore.companyName}
//                               onChange={set("companyName")}
//                               placeholder="Company Name"
//                               maxLength={40}
//                               onKeyDown={(e) => handleKeyDown(e, companyAddressRef)}
//                             />
//                           </div>
//                         </div>

//                         <div className="el-row-split-pair">
//                           <div className="el-field-row el-half">
//                             <span className="el-field-label-right">Address :</span>
//                             <input
//                               ref={companyAddressRef}
//                               value={formStore.companyAddress}
//                               onChange={set("companyAddress")}
//                               placeholder="Company Address"
//                               maxLength={40}
//                               onKeyDown={(e) => handleKeyDown(e, companyContactRef)}
//                             />
//                           </div>
//                           <div className="el-field-row el-half">
//                             <span className="el-field-label-right">Contact :</span>
//                             <input
//                               ref={companyContactRef}
//                               value={formStore.companyContact}
//                               onChange={set("companyContact")}
//                               placeholder="Company Contact"
//                               maxLength={40}
//                               onKeyDown={(e) => handleKeyDown(e, guarantorContactRef)}
//                             />
//                           </div>
//                         </div>

//                         <hr className="el-mobile-divider" />

//                         {/* ==================== GUARANTOR ==================== */}
//                         <div className="el-row-split">
//                           <div className="el-row-split-left">
//                             <div className="el-field-row">
//                               <span className="el-field-label-right">Contact :</span>
//                               <input
//                                 className="contect-width"
//                                 ref={guarantorContactRef}
//                                 type="tel"
//                                 value={formStore.guarantorContact}
//                                 onChange={set("guarantorContact")}
//                                 placeholder="Guarantor Mobile"
//                                 maxLength={11}
//                                 onKeyDown={(e) => {
//                                   if (!/[0-9]/.test(e.key) && e.key.length === 1)
//                                     e.preventDefault();
//                                   handleKeyDown(e, guarantorNameRef);
//                                 }}
//                               />
//                               <button
//                                 type="button"
//                                 className="el-mobile-3dot-btn"
//                                 title="Search by Mobile / CNIC / Name"
//                                 tabIndex={-1}
//                                 onClick={() => setIsGuarantorMobileModalOpen(true)}
//                               >
//                                 ⋮
//                               </button>
//                             </div>

//                             <div className="el-field-row">
//                               <span className="el-field-label-right">Name :</span>
//                               <input
//                                 ref={guarantorNameRef}
//                                 value={formStore.guarantorName}
//                                 onChange={set("guarantorName")}
//                                 placeholder="Guarantor Name"
//                                 maxLength={40}
//                                 onKeyDown={(e) => handleKeyDown(e, guarantorFatherNameRef)}
//                               />
//                             </div>

//                             <div className="el-field-row">
//                               <span className="el-field-label-right">Fth Name :</span>
//                               <input
//                                 ref={guarantorFatherNameRef}
//                                 value={formStore.guarantorFatherName}
//                                 onChange={set("guarantorFatherName")}
//                                 placeholder="Guarantor Father Name"
//                                 maxLength={40}
//                                 onKeyDown={(e) => handleKeyDown(e, guarantorAddress1Ref)}
//                               />
//                             </div>

//                             <div className="el-field-row">
//                               <span className="el-field-label-right">Address 1 :</span>
//                               <input
//                                 ref={guarantorAddress1Ref}
//                                 value={formStore.guarantorAddress1}
//                                 onChange={set("guarantorAddress1")}
//                                 placeholder="Guarantor Address"
//                                 maxLength={40}
//                                 onKeyDown={(e) => handleKeyDown(e, guarantorAddress2Ref)}
//                               />
//                             </div>

//                             <div className="el-field-row">
//                               <span className="el-field-label-right">Address 2 :</span>
//                               <input
//                                 ref={guarantorAddress2Ref}
//                                 value={formStore.guarantorAddress2}
//                                 onChange={set("guarantorAddress2")}
//                                 placeholder="Guarantor Address"
//                                 maxLength={40}
//                                 onKeyDown={(e) => handleKeyDown(e, guarantorCnicRef)}
//                               />
//                             </div>

//                             <div className="el-field-row">
//                               <span className="el-field-label-right">CNIC :</span>
//                               <input
//                                 ref={guarantorCnicRef}
//                                 value={formStore.guarantorCnic}
//                                 onChange={(e) => {
//                                   const formatted = formatCNIC(e.target.value);
//                                   setFormStore((prev) => ({
//                                     ...prev, guarantorCnic: formatted,
//                                   }));
//                                 }}
//                                 placeholder="Guarantor CNIC"
//                                 className="name-field witnes-field-width"
//                                 maxLength={15}
//                                 onKeyDown={(e) => handleKeyDown(e, witnessContactRef)}
//                               />
//                             </div>
//                           </div>

//                           <div className="el-row-split-right">
//                             <div
//                               className="el-photo-box"
//                               style={{
//                                 display: "flex", alignItems: "center",
//                                 justifyContent: "center", overflow: "hidden",
//                                 backgroundColor: "#f5f5f5",
//                                 cursor: selectedGuarantorImage ? "pointer" : "default",
//                               }}
//                               onClick={() => openImageModal(selectedGuarantorImage)}
//                               title={selectedGuarantorImage ? "Click to view full size" : ""}
//                             >
//                               {selectedGuarantorImage ? (
//                                 <img
//                                   src={selectedGuarantorImage}
//                                   alt="Guarantor"
//                                   style={{ width: "100%", height: "100%",
//                                     objectFit: "contain", objectPosition: "center",
//                                     display: "block", borderRadius: "inherit" }}
//                                   onError={(e) => { e.currentTarget.style.display = "none"; }}
//                                   onLoad={(e) => { e.currentTarget.style.display = "block"; }}
//                                 />
//                               ) : (
//                                 <span className="el-photo-placeholder">No Image</span>
//                               )}
//                             </div>
//                             <input
//                               ref={guarantorPhotoInputRef}
//                               type="file"
//                               accept="image/*"
//                               style={{ display: "none" }}
//                               onChange={handlePhotoFileChange(setSelectedGuarantorImage)}
//                             />
//                             <button
//                               type="button"
//                               className="el-upload-btn"
//                               onClick={handlePhotoButtonClick(guarantorPhotoInputRef)}
//                             >
//                               ⬆ Upload
//                             </button>
//                           </div>
//                         </div>

//                         <hr className="el-mobile-divider" />

//                         {/* ==================== WITNESS ==================== */}
//                         <div className="el-row-split">
//                           <div className="el-row-split-left">
//                             <div className="el-field-row">
//                               <span className="el-field-label-right">Contact :</span>
//                               <input
//                                 className="contect-width"
//                                 ref={witnessContactRef}
//                                 type="tel"
//                                 value={formStore.witnessContact}
//                                 onChange={set("witnessContact")}
//                                 placeholder="Witness Mobile"
//                                 maxLength={11}
//                                 onKeyDown={(e) => {
//                                   if (!/[0-9]/.test(e.key) && e.key.length === 1)
//                                     e.preventDefault();
//                                   handleKeyDown(e, witnessNameRef);
//                                 }}
//                               />
//                               <button
//                                 type="button"
//                                 className="el-mobile-3dot-btn"
//                                 title="Search by Mobile / CNIC / Name"
//                                 tabIndex={-1}
//                                 onClick={() => setIsWitnessMobileModalOpen(true)}
//                               >
//                                 ⋮
//                               </button>
//                             </div>

//                             <div className="el-field-row">
//                               <span className="el-field-label-right">Name :</span>
//                               <input
//                                 ref={witnessNameRef}
//                                 value={formStore.witnessName}
//                                 onChange={set("witnessName")}
//                                 placeholder="Witness Name"
//                                 maxLength={40}
//                                 onKeyDown={(e) => handleKeyDown(e, witnessFatherNameRef)}
//                               />
//                             </div>

//                             <div className="el-field-row">
//                               <span className="el-field-label-right">Fth Name :</span>
//                               <input
//                                 ref={witnessFatherNameRef}
//                                 value={formStore.witnessFatherName}
//                                 onChange={set("witnessFatherName")}
//                                 placeholder="Witness Father Name"
//                                 maxLength={40}
//                                 onKeyDown={(e) => handleKeyDown(e, witnessAddress1Ref)}
//                               />
//                             </div>

//                             <div className="el-field-row">
//                               <span className="el-field-label-right">Address 1 :</span>
//                               <input
//                                 ref={witnessAddress1Ref}
//                                 value={formStore.witnessAddress1}
//                                 onChange={set("witnessAddress1")}
//                                 placeholder="Witness Address"
//                                 maxLength={40}
//                                 onKeyDown={(e) => handleKeyDown(e, witnessAddress2Ref)}
//                               />
//                             </div>

//                             <div className="el-field-row">
//                               <span className="el-field-label-right">Address 2 :</span>
//                               <input
//                                 ref={witnessAddress2Ref}
//                                 value={formStore.witnessAddress2}
//                                 onChange={set("witnessAddress2")}
//                                 placeholder="Witness Address"
//                                 maxLength={40}
//                                 onKeyDown={(e) => handleKeyDown(e, witnessCnicRef)}
//                               />
//                             </div>

//                             <div className="el-field-row">
//                               <span className="el-field-label-right">CNIC :</span>
//                               <input
//                                 ref={witnessCnicRef}
//                                 value={formStore.witnessCnic}
//                                 onChange={(e) => {
//                                   const formatted = formatCNIC(e.target.value);
//                                   setFormStore((prev) => ({
//                                     ...prev, witnessCnic: formatted,
//                                   }));
//                                 }}
//                                 placeholder="Witness CNIC"
//                                 className="name-field witnes-field-width"
//                                 maxLength={15}
//                                 onKeyDown={(e) => handleKeyDown(e, verifyRef)}
//                               />
//                             </div>
//                           </div>

//                           <div className="el-row-split-right">
//                             <div
//                               className="el-photo-box"
//                               style={{
//                                 display: "flex", alignItems: "center",
//                                 justifyContent: "center", overflow: "hidden",
//                                 backgroundColor: "#f5f5f5",
//                                 cursor: selectedWitnessImage ? "pointer" : "default",
//                               }}
//                               onClick={() => openImageModal(selectedWitnessImage)}
//                               title={selectedWitnessImage ? "Click to view full size" : ""}
//                             >
//                               {selectedWitnessImage ? (
//                                 <img
//                                   src={selectedWitnessImage}
//                                   alt="Witness"
//                                   style={{ width: "100%", height: "100%",
//                                     objectFit: "contain", objectPosition: "center",
//                                     display: "block", borderRadius: "inherit" }}
//                                   onError={(e) => { e.currentTarget.style.display = "none"; }}
//                                   onLoad={(e) => { e.currentTarget.style.display = "block"; }}
//                                 />
//                               ) : (
//                                 <span className="el-photo-placeholder">No Image</span>
//                               )}
//                             </div>
//                             <input
//                               ref={witnessPhotoInputRef}
//                               type="file"
//                               accept="image/*"
//                               style={{ display: "none" }}
//                               onChange={handlePhotoFileChange(setSelectedWitnessImage)}
//                             />
//                             <button
//                               type="button"
//                               className="el-upload-btn"
//                               onClick={handlePhotoButtonClick(witnessPhotoInputRef)}
//                             >
//                               ⬆ Upload
//                             </button>
//                           </div>
//                         </div>

//                         <hr className="el-mobile-divider" />

//                         {/* ==================== VERIFY / DATE ==================== */}
//                         <div className="el-row-split-pair">
//                           <div className="el-field-row el-half">
//                             <span className="el-field-label-right">Verify :</span>
//                             <DynamicSelect
//                               ref={verifyRef}
//                               fetchUrl={`${apiLinks}/GetActiveVerifys.php`}
//                               valueKey="tvrfnam"
//                               labelKey="tvrfnam"
//                               codeKey="tvrfcod"
//                               organisation={organisation}
//                               locationNumber={getLocationNumber || getLocationnumber()}
//                               value={isInitialLoad ? "" : (formStore.verify || "")}
//                               initialCode={selectedVerifyCode}
//                               onChange={(desc) => {
//                                 setFormStore((prev) => ({ ...prev, verify: desc }));
//                               }}
//                               onCodeChange={setSelectedVerifyCode}
//                               placeholder="Please Select Verify"
//                               onKeyDown={(e) => handleKeyDown(e, dateRef)}
//                             />
//                           </div>
//                           <div className="el-field-row el-half">
//                             <span className="el-field-label-right">Date :</span>
//                             <input
//                               ref={dateRef}
//                               type="date"
//                               value={formStore.date || ""}
//                               onChange={handleDateChange("date")}
//                               className="el-date-inline"
//                               onKeyDown={(e) => handleDateKeyDown(e, latitudeRef)}
//                             />
//                           </div>
//                         </div>

//                         {/* ==================== LATITUDE / LONGITUDE ==================== */}
//                         <div className="el-row-split-pair">
//                           <div className="el-field-row el-half">
//                             <span className="el-field-label-right">Latitude :</span>
//                             <input
//                               ref={latitudeRef}
//                               value={formStore.latitude}
//                               onChange={set("latitude")}
//                               placeholder="Latitude"
//                               maxLength={20}
//                               onKeyDown={(e) => handleKeyDown(e, longitudeRef)}
//                             />
//                           </div>
//                           <div className="el-field-row el-half">
//                             <span className="el-field-label-right">Longitude :</span>
//                             <input
//                               ref={longitudeRef}
//                               value={formStore.longitude}
//                               onChange={set("longitude")}
//                               placeholder="Longitude"
//                               maxLength={20}
//                               onKeyDown={(e) => handleKeyDown(e, documentNameRef)}
//                             />
//                           </div>
//                         </div>

//                         {/* ==================== DOCUMENT ==================== */}
//                         <div className="el-doc-row">
//                           <span className="el-field-label-right el-doc-label">
//                             Document :
//                           </span>
//                           <div className="el-doc-input-cell">
//                             <input
//                               ref={documentNameRef}
//                               value={formStore.documentName || ""}
//                               readOnly
//                               tabIndex={-1}
//                               placeholder="Click to upload Document"
//                               className="el-doc-input"
//                               maxLength={60}
//                               onKeyDown={(e) => handleKeyDown(e, remarksRef)}
//                             />
//                           </div>
//                           <input
//                             ref={documentInputRef}
//                             type="file"
//                             accept=".pdf,.doc,.docx,.xls,.xlsx,.txt,.csv,.png,.jpg,.jpeg"
//                             style={{ display: "none" }}
//                             onChange={handleDocumentFileChange}
//                           />
//                           <button
//                             type="button"
//                             className="el-doc-btn el-doc-upload"
//                             onClick={handleDocumentUploadClick}
//                           >
//                             ⬆ Upload
//                           </button>
//                           <button
//                             type="button"
//                             className="el-doc-btn el-doc-download"
//                             onClick={handleDocumentDownload}
//                           >
//                             ⬇ Download
//                           </button>
//                         </div>

//                         {/* ==================== REMARKS ==================== */}
//                         <div className="el-field-row el-remarks-row">
//                           <span className="el-field-label-right">Remarks :</span>
//                           <textarea
//                             ref={remarksRef}
//                             value={formStore.remarks || ""}
//                             onChange={set("remarks")}
//                             placeholder="Remarks"
//                             className="el-remarks-textarea"
//                             maxLength={255}
//                             onKeyDown={(e) => {
//                               if (e.key === "Enter" && !e.shiftKey) {
//                                 e.preventDefault();
//                                 if (saveButtonRef.current) saveButtonRef.current.focus();
//                               }
//                             }}
//                           />
//                         </div>

//                       </div>
//                     </section>
//                   </div>
//                 </div>
//               </div>

//               <FormButtons
//                 saveText="Save"
//                 returnText="Return"
//                 newText="New"
//                 onSave={handleSave}
//                 onReturn={handleReturn}
//                 onNew={handleNew}
//                 saveButtonRef={saveButtonRef}
//                 disabled={isSaving || isCoolingDown || isFetchingNextCode}
//               />
//             </form>
//           </div>
//         </div>
//       </div>

//       {/* ==================== CUSTOMER CODE SEARCH ==================== */}
//       <SearchModal
//         isOpen={isSearchModalOpen}
//         onClose={handleModalClose}
//         onSelectInstaller={handleInstallerSelect}
//         apiLinks={apiLinks}
//         apiEndpoint="/GetCustomers.php"
//         title="Select Customer"
//         codeKey="tcstcod"
//         descriptionKey="tcstnam"
//       />

//       {/* ==================== CUSTOMER MOBILE SEARCH ==================== */}
//       <SearchModal
//         isOpen={isMobileModalOpen}
//         onClose={() => setIsMobileModalOpen(false)}
//         onSelectInstaller={handleMobileSelect}
//         apiLinks={apiLinks}
//         apiEndpoint="/GetMobileList.php"
//         title="Select Mobile No"
//         codeKey="tmobnum"
//         descriptionKey="tcstnam"
//         columns={[
//           { key: "tmobnum", label: "Mobile No", width: "150px" },
//           { key: "tnicnum", label: "CNIC",      width: "180px" },
//           { key: "tcstnam", label: "Name",      width: "270px" },
//         ]}
//         searchKeys={["tmobnum", "tnicnum", "tcstnam"]}
//       />

//       {/* ==================== GUARANTOR MOBILE SEARCH ==================== */}
//       <SearchModal
//         isOpen={isGuarantorMobileModalOpen}
//         onClose={() => setIsGuarantorMobileModalOpen(false)}
//         onSelectInstaller={handleGuarantorMobileSelect}
//         apiLinks={apiLinks}
//         apiEndpoint="/GetMobileList.php"
//         title="Select Mobile No"
//         codeKey="tmobnum"
//         descriptionKey="tcstnam"
//         columns={[
//           { key: "tmobnum", label: "Mobile No", width: "150px" },
//           { key: "tnicnum", label: "CNIC",      width: "180px" },
//           { key: "tcstnam", label: "Name",      width: "270px" },
//         ]}
//         searchKeys={["tmobnum", "tnicnum", "tcstnam"]}
//       />

//       {/* ==================== WITNESS MOBILE SEARCH ==================== */}
//       <SearchModal
//         isOpen={isWitnessMobileModalOpen}
//         onClose={() => setIsWitnessMobileModalOpen(false)}
//         onSelectInstaller={handleWitnessMobileSelect}
//         apiLinks={apiLinks}
//         apiEndpoint="/GetMobileList.php"
//         title="Select Mobile No"
//         codeKey="tmobnum"
//         descriptionKey="tcstnam"
//         columns={[
//           { key: "tmobnum", label: "Mobile No", width: "150px" },
//           { key: "tnicnum", label: "CNIC",      width: "180px" },
//           { key: "tcstnam", label: "Name",      width: "270px" },
//         ]}
//         searchKeys={["tmobnum", "tnicnum", "tcstnam"]}
//       />

//       {/* Fullscreen image preview modal */}
//       {isImageModalOpen && modalImageSrc && (
//         <div
//           onClick={() => setIsImageModalOpen(false)}
//           style={{
//             position: "fixed", top: 0, left: 0, width: "100vw", height: "100vh",
//             backgroundColor: "rgba(0, 0, 0, 0.85)", zIndex: 99999,
//             display: "flex", alignItems: "center", justifyContent: "center",
//             cursor: "zoom-out",
//           }}
//         >
//           <img
//             src={modalImageSrc}
//             alt="Preview"
//             onClick={(e) => e.stopPropagation()}
//             style={{
//               maxWidth: "92vw", maxHeight: "92vh", objectFit: "contain",
//               borderRadius: "6px", boxShadow: "0 8px 32px rgba(0,0,0,0.6)",
//               backgroundColor: "#fff", cursor: "default",
//             }}
//           />
//           <button
//             type="button"
//             onClick={() => setIsImageModalOpen(false)}
//             style={{
//               position: "absolute", top: "16px", right: "20px",
//               width: "40px", height: "40px", borderRadius: "50%",
//               border: "none", background: "rgba(255,255,255,0.15)",
//               color: "#fff", fontSize: "22px", fontWeight: "bold",
//               cursor: "pointer", display: "flex", alignItems: "center",
//               justifyContent: "center", lineHeight: 1,
//             }}
//             aria-label="Close preview"
//           >
//             ×
//           </button>
//         </div>
//       )}
//     </div>
//   );
// }


// ═══════════════════════════════════════════════════════════════════════════
// CUSTOMER MAINTENANCE — Config-driven single-file implementation
// ─────────────────────────────────────────────────────────────────────────
// SECTION 1 — CONFIG        (har naye form me ye block replace karo)
// SECTION 2 — IMPORTS & HELPERS   (same for every form)
// SECTION 3 — useMaintenanceForm HOOK  (same for every form)
// SECTION 4 — MAIN COMPONENT + JSX     (same for every form)
// SECTION 5 — MODALS             (part of SECTION 4's JSX)
// ═══════════════════════════════════════════════════════════════════════════

// ═══════════════════════════════════════════════════════════════════════════
// SECTION 1 — CONFIG
// ═══════════════════════════════════════════════════════════════════════════

// ═══════════════════════════════════════════════════════════════════════════
// CUSTOMER MAINTENANCE — Config-driven + SysControl integrated
// ═══════════════════════════════════════════════════════════════════════════

// ═══════════════════════════════════════════════════════════════════════════
// SECTION 1 — CONFIG
// ═══════════════════════════════════════════════════════════════════════════

const FORM_FIELDS = {
  man:              { default: "" },
  ref:              { default: "" },
  status:           { default: "Active" },
  mobile:           { default: "" },
  name:             { default: "" },
  fatherName:       { default: "" },
  address1:         { default: "" },
  address2:         { default: "" },
  email:            { default: "" },
  type:             { default: "" },
  cnic:             { default: "" },
  ntn:              { default: "" },
  city:             { default: "" },
  area:             { default: "" },
  state:            { default: "" },
  region:           { default: "" },
  manager:          { default: "" },
  salesman:         { default: "" },
  collector:        { default: "" },
  group:            { default: "" },
  creditDays:       { default: "" },
  creditLimit:      { default: "" },
  debit:            { default: "" },
  credit:           { default: "" },
  amount:           { default: "" },
  dueDate:          { default: "today" },
  contactName:      { default: "" },
  contactMobile:    { default: "" },
  ownerName:        { default: "" },
  ownerMobile:      { default: "" },
  profession:       { default: "" },
  companyName:      { default: "" },
  companyAddress:   { default: "" },
  companyContact:   { default: "" },
  guarantorContact: { default: "" },
  guarantorName:    { default: "" },
  guarantorFatherName: { default: "" },
  guarantorAddress1: { default: "" },
  guarantorAddress2: { default: "" },
  guarantorCnic:    { default: "" },
  witnessContact:   { default: "" },
  witnessName:      { default: "" },
  witnessFatherName: { default: "" },
  witnessAddress1:  { default: "" },
  witnessAddress2:  { default: "" },
  witnessCnic:      { default: "" },
  verify:           { default: "" },
  date:             { default: "today" },
  latitude:         { default: "" },
  longitude:        { default: "" },
  remarks:          { default: "" },
  documentName:     { default: "" },
};

const DROPDOWN_STATES = [
  "selectedTypeCode",
  "selectedCityCode",
  "selectedAreaCode",
  "selectedStateCode",
  "selectedRegionCode",
  "selectedManagerCode",
  "selectedSalesmanCode",
  "selectedCollectorCode",
  "selectedGroupCode",
  "selectedVerifyCode",
];

const API_VARIABLES = {
  endpoints: {
    newCode:         "/NewCustomer.php",
    getByCode:       "/GetCustomer.php",
    getList:         "/CustomerList.php",
    save:            "/SaveCustomer.php",
    saveMobile:      "/SaveCustomerMobile.php",
    getMobile:       "/GetMobileNo.php",
    getMobileList:   "/GetMobileList.php",
    searchByCode:    "/GetCustomers.php",
  },

  saveMap: {
    code:      { source: "orgCode", fallback: "DEMOINS" },
    FLocCod:   { source: "locCode", fallback: "001" },
    FUsrId:    { source: "userId", fallback: "sohaib" },

    FCstCod:   { source: "code" },

    FManCod:   { field: "man" },
    FRefCod:   { field: "ref" },
    FCstSts:   { field: "status", transform: "statusToApi" },
    FCstNam:   { field: "name" },
    FFthNam:   { field: "fatherName" },
    FAdd001:   { field: "address1" },
    FAdd002:   { field: "address2" },
    FEmlAdd:   { field: "email" },
    FMobNum:   { field: "mobile" },
    FNicNum:   { field: "cnic", transform: "stripDashes" },
    FNtnNum:   { field: "ntn" },

    FTypCod:   { state: "selectedTypeCode" },
    FCtyCod:   { state: "selectedCityCode" },
    FAreCod:   { state: "selectedAreaCode" },
    FStaCod:   { state: "selectedStateCode" },
    FRegCod:   { state: "selectedRegionCode" },
    FMgrCod:   { state: "selectedManagerCode" },
    FSalCod:   { state: "selectedSalesmanCode" },
    FColCod:   { state: "selectedCollectorCode" },
    FGrpCod:   { state: "selectedGroupCode" },
    FVrfCod:   { state: "selectedVerifyCode" },

    FCrtDay:   { field: "creditDays", transform: "stripNonDigits" },
    FCrtLim:   { field: "creditLimit", transform: "toAmount" },
    FDbtAmt:   { field: "debit", transform: "toAmount" },
    FCrtAmt:   { field: "credit", transform: "toAmount" },
    FMthAmt:   { field: "amount", transform: "toAmount" },

    FDueDat:   { field: "dueDate", transform: "toApiDate" },
    FVrfDat:   { field: "date", transform: "toApiDate" },

    FCntPer:   { field: "contactName" },
    FCntMob:   { field: "contactMobile" },
    FOwnNam:   { field: "ownerName" },
    FOwnMob:   { field: "ownerMobile" },

    FGrnNam:   { field: "guarantorName" },
    FGrnFth:   { field: "guarantorFatherName" },
    FGrnAdd1:  { field: "guarantorAddress1" },
    FGrnAdd2:  { field: "guarantorAddress2" },
    FGrnNic:   { field: "guarantorCnic", transform: "stripDashes" },
    FGrnMob:   { field: "guarantorContact" },

    FWitNam:   { field: "witnessName" },
    FWitFth:   { field: "witnessFatherName" },
    FWitAdd1:  { field: "witnessAddress1" },
    FWitAdd2:  { field: "witnessAddress2" },
    FWitNic:   { field: "witnessCnic", transform: "stripDashes" },
    FWitMob:   { field: "witnessContact" },

    FCstPrf:   { field: "profession" },
    FOffAdd1:  { field: "companyName" },
    FOffCnt:   { field: "companyContact" },
    FOffAdd2:  { field: "companyAddress" },

    FMthInc:   { constant: "0" },

    FLatVal:   { field: "latitude" },
    FLngVal:   { field: "longitude" },
    FCstRem:   { field: "remarks" },
  },

  getMap: {
    man:              "tmancod",
    ref:              "trefcod",
    status:           { key: "tcststs", transform: "apiToStatus" },
    name:             "tcstnam",
    fatherName:       "tfthnam",
    mobile:           "tmobnum",
    address1:         "tadd001",
    address2:         "tadd002",
    email:            "temladd",
    cnic:             { key: "tnicnum", transform: "formatCnic" },
    ntn:              "tntnnum",
    creditDays:       "tcrtday",
    creditLimit:      { key: "tcrtlim", transform: "formatCommas" },
    debit:            { key: "tdbtamt", transform: "formatCommas" },
    credit:           { key: "tcrtamt", transform: "formatCommas" },
    amount:           { key: "tmthamt", transform: "formatCommas" },
    dueDate:          { key: "tduedat", transform: "toInputDate" },
    contactName:      "tcntper",
    contactMobile:    "tcntmob",
    ownerName:        "townnam",
    ownerMobile:      "townmob",
    profession:       "tcstprf",
    companyName:      "toffadd1",
    companyAddress:   "toffadd2",
    companyContact:   "toffcnt",
    guarantorName:    "tgrnnam",
    guarantorFatherName: "tgrnfth",
    guarantorAddress1: "tgrnadd1",
    guarantorAddress2: "tgrnadd2",
    guarantorCnic:    { key: "tgrnnic", transform: "formatCnic" },
    guarantorContact: "tgrnmob",
    witnessName:      "twitnam",
    witnessFatherName: "twitfth",
    witnessAddress1:  "twitadd1",
    witnessAddress2:  "twitadd2",
    witnessCnic:      { key: "twitnic", transform: "formatCnic" },
    witnessContact:   "twitmob",
    date:             { key: "tvrfdat", transform: "toInputDate" },
    latitude:         "tlatval",
    longitude:        "tlngval",
    remarks:          "tcstrem",
  },

  getDropdownCodes: {
    selectedTypeCode:     "ttypcod",
    selectedCityCode:     "tctycod",
    selectedAreaCode:     "tarecod",
    selectedStateCode:    "tstacod",
    selectedRegionCode:   "tregcod",
    selectedManagerCode:  "tmgrcod",
    selectedSalesmanCode: "tsalcod",
    selectedCollectorCode: "tcolcod",
    selectedGroupCode:    "tgrpcod",
    selectedVerifyCode:   "tvrfcod",
  },

  validResponseKeys: ["tcstcod", "tcstnam"],
};

const IMAGE_CONFIG = {
  customer: {
    saveKey: "FCstPic",
    getKeys: ["tcstpic", "tcpic", "temppic", "photo"],
    label: "Customer",
  },
  guarantor: {
    saveKey: "FGrnPic",
    getKeys: ["tgrnpic", "tgurpic", "guarantorpic"],
    label: "Guarantor",
  },
  witness: {
    saveKey: "FWitPic",
    getKeys: ["twitpic", "witnesspic"],
    label: "Witness",
  },
};

const DOCUMENT_CONFIG = {
  saveKey: "FCstDoc",
  getKeys: ["tcstdoc", "docname", "tempdoc"],
  fieldName: "documentName",
  maxSizeMB: 10,
  accept: ".pdf,.doc,.docx,.xls,.xlsx,.txt,.csv,.png,.jpg,.jpeg",
};

const MOBILE_CONFIG = {
  slots: {
    mobile: {
      trigger: "mobile",
      requestKey: "tmobnum",
      statusKey: "FMobSts",
      usesStatus: true,
      statusValue: null,
      sourceMap: {
        mobile:          "tmobnum",
        name:            "tcstnam",
        fatherName:      "tfthnam",
        address1:        "tadd001",
        address2:        "tadd002",
        email:           "temladd",
        cnic:            { key: "tnicnum", transform: "formatCnic" },
        ntn:             "tntnnum",
        latitude:        "tlatval",
        longitude:       "tlngval",
      },
      saveExtra: {
        FPhnNum: { field: "contactMobile" },
        FAreCod: { state: "selectedAreaCode" },
        FCtyCod: { state: "selectedCityCode" },
        FSmsSts: { constant: "N" },
      },
    },
    guarantorContact: {
      trigger: "guarantorContact",
      requestKey: "tmobnum",
      statusKey: "FMobSts",
      usesStatus: false,
      statusValue: "A",
      sourceMap: {
        guarantorContact:      "tmobnum",
        guarantorName:         "tcstnam",
        guarantorFatherName:   "tfthnam",
        guarantorAddress1:     "tadd001",
        guarantorAddress2:     "tadd002",
        guarantorCnic:         { key: "tnicnum", transform: "formatCnic" },
      },
      saveExtra: {
        FPhnNum: { constant: "" },
        FAreCod: { constant: "" },
        FCtyCod: { constant: "" },
        FSmsSts: { constant: "N" },
      },
    },
    witnessContact: {
      trigger: "witnessContact",
      requestKey: "tmobnum",
      statusKey: "FMobSts",
      usesStatus: false,
      statusValue: "A",
      sourceMap: {
        witnessContact:        "tmobnum",
        witnessName:           "tcstnam",
        witnessFatherName:     "tfthnam",
        witnessAddress1:       "tadd001",
        witnessAddress2:       "tadd002",
        witnessCnic:           { key: "tnicnum", transform: "formatCnic" },
      },
      saveExtra: {
        FPhnNum: { constant: "" },
        FAreCod: { constant: "" },
        FCtyCod: { constant: "" },
        FSmsSts: { constant: "N" },
      },
    },
  },
};

const ENTER_FLOW = [
  "man", "ref", "status",
  "mobile", "name", "fatherName",
  "address1", "address2", "email", "type",
  "cnic", "ntn",
  "city", "area", "state", "region",
  "manager", "salesman", "collector", "group",
  "creditDays", "creditLimit", "debit", "credit",
  "amount", "dueDate",
  "contactName", "contactMobile",
  "ownerName", "ownerMobile",
  "profession", "companyName", "companyAddress", "companyContact",
  "guarantorContact", "guarantorName", "guarantorFatherName",
  "guarantorAddress1", "guarantorAddress2", "guarantorCnic",
  "witnessContact", "witnessName", "witnessFatherName",
  "witnessAddress1", "witnessAddress2", "witnessCnic",
  "verify", "date", "latitude", "longitude",
  "documentName", "remarks",
];

const TOASTS = {
  found:    "Customer Data Found",
  notFound: "Customer Not Found",
  updated:  "Customer Updated Successfully",
  created:  "New Customer Added Successfully",
  savingFailed: "Error saving data",
};

const CODE_FORMAT = "long";
const CODE_PREFIX = "14-01";
const IMAGE_SERVER_BASE = "https://crystalsolutions.pk/DI";

const CUSTOMER_CONFIG = {
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
// SECTION 2 — IMPORTS & HELPERS
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

const stripCommas = (value) => {
  const raw = String(value ?? "").trim();
  if (raw === "") return "";
  return raw.replace(/,/g, "");
};

const cleanAmount = (value) => {
  if (value === null || value === undefined || value === "") return "";
  const num = String(value).replace(/,/g, "").trim();
  const parsed = parseFloat(num);
  return isNaN(parsed) ? "" : parsed;
};

const txt = (value) => String(value ?? "").trim();

const normaliseCode = (value) => {
  const digits = String(value ?? "").replace(/\D/g, "");
  if (!digits) return "";
  return String(parseInt(digits, 10));
};

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
        first.code ?? first.Code ?? first.FIntCod ?? first.FCusCod ?? ""
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
      data.code ?? data.Code ?? data.FIntCod ?? data.FCusCod ?? ""
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
  stripDashes: (v) => String(v || "").replace(/-/g, ""),
  stripNonDigits: (v) => String(v || "").replace(/\D/g, ""),
  toAmount: (v) => {
    const parsed = cleanAmount(stripCommas(v));
    return parsed === "" ? "0" : String(parsed);
  },
  toApiDate: (v) => (v ? toInputDate(v) : ""),
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
  return `${imageServerBase}/${String(org || "DEMOELEC").trim()}/`;
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
  const [organisation, setOrganisation] = useState(null);
  const [orgCode, setOrgCode] = useState("DEMOINS");
  const [locCode, setLocCode] = useState("001");
  const [isInitialLoad, setIsInitialLoad] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isCoolingDown, setIsCoolingDown] = useState(false);
  const [isFetchingNextCode, setIsFetchingNextCode] = useState(false);
  const [isExisting, setIsExisting] = useState(false);

  // ⭐ SYS CONTROL STATE
  const [sysControl, setSysControl] = useState(null);

  const [isSearchModalOpen, setIsSearchModalOpen] = useState(false);
  const [isMobileModalOpen, setIsMobileModalOpen] = useState(false);
  const [isGuarantorMobileModalOpen, setIsGuarantorMobileModalOpen] = useState(false);
  const [isWitnessMobileModalOpen, setIsWitnessMobileModalOpen] = useState(false);
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
  const pendingCodeRef = useRef("");

  // ⭐ SYS CONTROL HELPER
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

  const setFieldValue = useCallback((key, value) => {
    setFormStore((prev) => ({ ...prev, [key]: value }));
  }, []);

  const setDropdownCode = useCallback((stateKey, value) => {
    setDropdownCodes((prev) => ({ ...prev, [stateKey]: value }));
  }, []);

  const setImage = useCallback((slotKey, value) => {
    setImages((prev) => ({ ...prev, [slotKey]: value }));
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
      try {
        input.setSelectionRange(newCaret, newCaret);
      } catch (err) {}
    });
  }, []);

  const handleCnicChange = useCallback((key) => (e) => {
    const formatted = formatCNIC(e.target.value);
    setFormStore((prev) => ({ ...prev, [key]: formatted }));
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

  // ⭐ SYS CONTROL LOAD
  useEffect(() => {
    if (!organisation || !orgCode) return;

    const apiUrl = apiLinks + "/GetSysControl.php";
    const formData = new URLSearchParams({
      code: orgCode,
      type: "CustomerMaintenance",
    }).toString();

    axios
      .post(apiUrl, formData)
      .then((response) => {
        let obj = response.data;

        if (typeof obj === "string") {
          try {
            obj = JSON.parse(obj);
          } catch (e) {
            console.error(">>> GetSysControl parse error:", e);
            obj = null;
          }
        }

        if (Array.isArray(obj) && obj.length > 0 && typeof obj[0] === "object") {
          obj = obj[0];
        }

        if (obj && typeof obj === "object" && !Array.isArray(obj)) {
          console.log(">>> SysControl loaded:", obj);
          setSysControl(obj);
        } else {
          console.warn(">>> SysControl empty — showing all fields");
          setSysControl({});
        }
      })
      .catch((error) => {
        console.error(">>> GetSysControl error:", error);
        setSysControl({});
      });
  }, [organisation, orgCode, apiLinks]);

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

  const saveMobileRecord = useCallback(async (payload) => {
    const apiUrl = apiLinks + API_VARIABLES.endpoints.saveMobile;
    const formData = new URLSearchParams();
    Object.entries(payload).forEach(([k, v]) => {
      formData.append(k, v === null || v === undefined ? "" : String(v));
    });
    return axios.post(apiUrl, formData.toString(), {
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
    });
  }, [apiLinks, API_VARIABLES]);

  const saveAllMobileRecords = useCallback(async () => {
    if (!MOBILE_CONFIG) return;
    for (const [slotKey, slot] of Object.entries(MOBILE_CONFIG.slots)) {
      const fieldValue = String(formStore[slot.trigger] || "").trim();
      if (!fieldValue) continue;
      try {
        const payload = {};
        Object.entries(API_VARIABLES.saveMap || {}).forEach(([apiVar, def]) => {
          if (def.field) {
            let raw = formStore[def.field];
            if (def.transform && SAVE_TRANSFORMS[def.transform]) {
              raw = SAVE_TRANSFORMS[def.transform](raw);
            } else {
              raw = raw === null || raw === undefined ? "" : String(raw).trim();
            }
            payload[apiVar] = raw;
          } else if (def.state) {
            payload[apiVar] = String(dropdownCodes[def.state] || "").trim();
          } else if (def.constant !== undefined) {
            payload[apiVar] = def.constant;
          }
        });
        payload.FMobNum = fieldValue;
        if (slot.usesStatus) {
          payload[slot.statusKey] = SAVE_TRANSFORMS.statusToApi(formStore.status);
        } else {
          payload[slot.statusKey] = slot.statusValue || "A";
        }
        if (slot.saveExtra) {
          Object.entries(slot.saveExtra).forEach(([k, def]) => {
            if (def.constant !== undefined) payload[k] = def.constant;
            else if (def.field) payload[k] = String(formStore[def.field] || "").trim();
            else if (def.state) payload[k] = String(dropdownCodes[def.state] || "").trim();
          });
        }
        payload.code = orgCode;
        payload.FLocCod = locCode;
        await saveMobileRecord(payload);
      } catch (e) {
        console.warn(`>>> SaveCustomerMobile (${slotKey}) failed:`, e);
      }
    }
  }, [MOBILE_CONFIG, formStore, dropdownCodes, orgCode, locCode, API_VARIABLES, saveMobileRecord]);

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
      showToast("Customer Name is required", "error");
      isSavingRef.current = false;
      return;
    }

    setIsSaving(true);

    try {
      await saveAllMobileRecords();

      const apiUrl = apiLinks + API_VARIABLES.endpoints.save;
      const payload = buildSavePayload();
      payload.FCstCod = trimmedCode;

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

      const response = await axios.post(apiUrl, formData, {});
      if (response.status === 200) {
        showToast(isExisting ? TOASTS.updated : TOASTS.created, "success");
        await loadList();
        reset();
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
        showToast(`Save failed: ${response.status}`, "error");
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
      saveAllMobileRecords, buildSavePayload, apiLinks, API_VARIABLES,
      IMAGE_CONFIG, DOCUMENT_CONFIG, TOASTS]);

  const fetchByCode = useCallback((customerCode) => {
    const cleanCode = String(customerCode || "").trim();
    if (!organisation || !orgCode || !locCode || !cleanCode) return;

    clearForm();
    setIsExisting(false);

    const callId = ++fetchCallIdRef.current;
    const apiUrl = apiLinks + API_VARIABLES.endpoints.getByCode;
    const formData = new URLSearchParams({
      code: orgCode,
      FLocCod: locCode,
      FCstCod: cleanCode,
    }).toString();

    axios.post(apiUrl, formData).then((response) => {
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

      if (DOCUMENT_CONFIG) {
        const docKey = DOCUMENT_CONFIG.getKeys.find((k) => data[k]);
        if (docKey) newForm[DOCUMENT_CONFIG.fieldName] = txt(data[docKey]);
      }

      setFormStore(newForm);

      if (data.tcstcod) {
        setCode(String(data.tcstcod).trim());
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
      data.code ?? data.tcstcod ?? data.Code ?? data.tempcod ?? data.FCusCod ?? "";
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

  const fetchByMobile = useCallback(async (mobile) => {
    if (!MOBILE_CONFIG) return null;
    const clean = String(mobile || "").trim();
    if (!clean || !orgCode || !locCode) return null;
    try {
      const apiUrl = apiLinks + API_VARIABLES.endpoints.getMobile;
      const formData = new URLSearchParams({
        FMobNum: clean,
        code: orgCode,
        FLocCod: locCode,
      }).toString();
      const response = await axios.post(apiUrl, formData, {
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
      });
      const rows = normalizeRows(response.data);
      return rows.length > 0 ? rows[0] : null;
    } catch (err) {
      console.error("GetMobileNo error:", err);
      return null;
    }
  }, [MOBILE_CONFIG, orgCode, locCode, apiLinks, API_VARIABLES]);

  const handleMobileSelectGeneric = useCallback(async (slotKey, data) => {
    if (!data) return;
    const slot = MOBILE_CONFIG?.slots[slotKey];
    if (!slot) return;
    const pickedMobile = String(data[slot.requestKey] ?? data.Mobile ?? "").trim();
    if (!pickedMobile) return;

    setFormStore((prev) => ({ ...prev, [slot.trigger]: pickedMobile }));

    const mobileData = await fetchByMobile(pickedMobile);
    if (!mobileData) {
      showToast("No record found for this mobile number", "error");
      return;
    }

   setFormStore((prev) => {
  const next = { ...prev };
  const sourceMap = slot.sourceMap || {};
  Object.entries(sourceMap).forEach(([field, def]) => {
    let raw;
    let transformName = null;
    if (typeof def === "string") raw = mobileData[def];
    else if (def && typeof def === "object") {
      raw = mobileData[def.key];
      transformName = def.transform;
    }
    if (raw === undefined || raw === null) return;
    if (transformName && GET_TRANSFORMS[transformName]) {
      raw = GET_TRANSFORMS[transformName](raw);
    } else {
      raw = String(raw).trim();
    }
    next[field] = raw;
  });
  return next;
});

    const linkedCode = String(mobileData.tcstcod ?? "").trim();
    if (linkedCode) {
      setCode(linkedCode);
      fetchByCode(linkedCode);
    }
  }, [MOBILE_CONFIG, API_VARIABLES, fetchByMobile, fetchByCode]);

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
    images,
    dropdownCodes,
    isSearchModalOpen,
    isMobileModalOpen,
    isGuarantorMobileModalOpen,
    isWitnessMobileModalOpen,
    isImageModalOpen,
    modalImageSrc,
    sysControl,
    vis,

    refs,
    codeInputRef,
    saveButtonRef,
    fileRefs,
    documentInputRef,

    setCode,
    setMaxCode,
    setField,
    setFieldValue,
    setDropdownCode,
    setImage,
    setFormStore,

    setIsSearchModalOpen,
    setIsMobileModalOpen,
    setIsGuarantorMobileModalOpen,
    setIsWitnessMobileModalOpen,
    setIsImageModalOpen,

    save,
    reset,
    fetchByCode,
    loadList,
    loadNewCode,
    handleSearchSelect,
    handleCodeChange,
    handleSearchModalClose,
    handleMobileSelectGeneric,
    fetchByMobile,
    handleMoneyChange,
    handleCnicChange,
    handleDateChange,
    handleKeyDown,
    handleDateKeyDown,

    handleImageUploadClick,
    handleImageFileChange,
    openImageModal,
    handleDocumentUploadClick,
    handleDocumentFileChange,
    handleDocumentDownload,

    config,
  };
}

// ═══════════════════════════════════════════════════════════════════════════
// SECTION 4 — MAIN COMPONENT + JSX
// ═══════════════════════════════════════════════════════════════════════════

export default function CustomerMaintenance() {
  const { apiLinks, getLocationNumber } = useTheme();
  const form = useMaintenanceForm({ config: CUSTOMER_CONFIG });
  const {
    formStore,
    code,
    maxCode,
    organisation,
    isInitialLoad,
    isSaving,
    isCoolingDown,
    isFetchingNextCode,
    images,
    dropdownCodes,
    isSearchModalOpen,
    isMobileModalOpen,
    isGuarantorMobileModalOpen,
    isWitnessMobileModalOpen,
    isImageModalOpen,
    modalImageSrc,
    vis,
    refs,
    codeInputRef,
    saveButtonRef,
    fileRefs,
    documentInputRef,
    setCode,
    setMaxCode,
    setField,
    setDropdownCode,
    setFormStore,
    setIsSearchModalOpen,
    setIsMobileModalOpen,
    setIsGuarantorMobileModalOpen,
    setIsWitnessMobileModalOpen,
    setIsImageModalOpen,
    save,
    reset,
    fetchByCode,
    handleSearchSelect,
    handleCodeChange,
    handleSearchModalClose,
    handleMobileSelectGeneric,
    handleMoneyChange,
    handleCnicChange,
    handleDateChange,
    handleKeyDown,
    handleDateKeyDown,
    handleImageUploadClick,
    handleImageFileChange,
    openImageModal,
    handleDocumentUploadClick,
    handleDocumentFileChange,
    handleDocumentDownload,
  } = form;

  const handleSubmit = (e) => e.preventDefault();

  const R = (name) => refs.current[name];
  const V = (name) => formStore[name];

  const focusFirstFromTopBar = () => {
    const first = ["man", "ref", "status", "mobile"]
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
                <h1>Customer Maintenance</h1>
                <p className="el-subtitle">
                  Enter the Customer Maintenance information in the form below
                </p>
              </header>

              <div className="el-scrollable-body">
                {/* ==================== TOP BAR ==================== */}
                <div className="el-top-bar">
                  {/* Code — always visible */}
                  <div
                    className="el-field-row"
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
                      onKeyDown={(e) => handleKeyDown(e, "man")}
                      onDoubleClick={() => setIsSearchModalOpen(true)}
                      onCodeChange={handleCodeChange}
                      maxCode={maxCode}
                      onMaxCodeChange={setMaxCode}
                      codeFormat={CODE_FORMAT}
                      codePrefix={CODE_PREFIX}
                    />
                  </div>

                  {/* Man — ManualCode key */}
                  {vis("ManualCode") && (
                    <div className="el-field-row el-field-abb">
                      <span className="el-field-label-right">Man :</span>
                      <input
                        ref={R("man")}
                        value={V("man")}
                        onChange={setField("man")}
                        placeholder="Man"
                        maxLength={20}
                        onKeyDown={(e) => handleKeyDown(e, "ref")}
                      />
                    </div>
                  )}

                  {/* Ref — ReferenceCod key */}
                  {vis("ReferenceCod") && (
                    <div className="el-field-row el-field-abb">
                      <span className="el-field-label-right">Ref :</span>
                      <input
                        ref={R("ref")}
                        value={V("ref")}
                        onChange={setField("ref")}
                        placeholder="Ref"
                        maxLength={20}
                        onKeyDown={(e) => handleKeyDown(e, "status")}
                      />
                    </div>
                  )}

                  {/* Status — always visible */}
                  <div className="el-field-row">
                    <span className="el-field-label-right">Sts :</span>
                    <select
                      ref={R("status")}
                      value={V("status")}
                      onChange={setField("status")}
                      onKeyDown={(e) => handleKeyDown(e, "mobile")}
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

                        {/* MOBILE — Mobile */}
                        {vis("Mobile") && (
                          <div className="el-field-row">
                            <span className="el-field-label-right">Mobile :</span>
                            <input
                              ref={R("mobile")}
                              type="tel"
                              value={V("mobile")}
                              onChange={setField("mobile")}
                              placeholder="Customer Mobile"
                              className="mobile-field"
                              maxLength={11}
                              onKeyDown={(e) => {
                                if (!/[0-9]/.test(e.key) && e.key.length === 1)
                                  e.preventDefault();
                                handleKeyDown(e, "name");
                              }}
                            />
                            {MOBILE_CONFIG && (
                              <button
                                type="button"
                                className="el-mobile-3dot-btn"
                                title="Search by Mobile / CNIC / Name"
                                tabIndex={-1}
                                onClick={() => setIsMobileModalOpen(true)}
                              >
                                ⋮
                              </button>
                            )}
                          </div>
                        )}

                        {/* NAME — always visible */}
                        <div className="el-field-row">
                          <span className="el-field-label-right">Name :</span>
                          <input
                            ref={R("name")}
                            value={V("name")}
                            onChange={setField("name")}
                            placeholder="Name"
                            className="name-field"
                            maxLength={40}
                            onKeyDown={(e) => handleKeyDown(e, "fatherName")}
                          />
                        </div>

                        <hr className="el-mobile-divider" />

                        {/* FTH NAME / ADDRESS / EMAIL / TYPE / CNIC / NTN */}
                        <div className="el-row-split">
                          <div className="el-row-split-left">
                            {vis("FatherName") && (
                              <div className="el-field-row">
                                <span className="el-field-label-right">Fth Name :</span>
                                <input
                                  ref={R("fatherName")}
                                  value={V("fatherName")}
                                  onChange={setField("fatherName")}
                                  placeholder="Father Name"
                                  maxLength={40}
                                  onKeyDown={(e) => handleKeyDown(e, "address1")}
                                />
                              </div>
                            )}

                            {vis("CustomerAddress1") && (
                              <div className="el-field-row">
                                <span className="el-field-label-right">Address :</span>
                                <input
                                  ref={R("address1")}
                                  value={V("address1")}
                                  onChange={setField("address1")}
                                  placeholder="Customer Address 1"
                                  maxLength={40}
                                  onKeyDown={(e) => handleKeyDown(e, "address2")}
                                />
                              </div>
                            )}

                            {vis("CustomerAddress2") && (
                              <div className="el-field-row">
                                <span className="el-field-label-right"></span>
                                <input
                                  ref={R("address2")}
                                  value={V("address2")}
                                  onChange={setField("address2")}
                                  placeholder="Customer Address 2"
                                  maxLength={40}
                                  onKeyDown={(e) => handleKeyDown(e, "email")}
                                />
                              </div>
                            )}

                            {vis("Email") && (
                              <div className="el-field-row">
                                <span className="el-field-label-right">Email :</span>
                                <input
                                  ref={R("email")}
                                  value={V("email")}
                                  onChange={setField("email")}
                                  placeholder="Customer Email"
                                  className="email-field"
                                  maxLength={40}
                                  onKeyDown={(e) => handleKeyDown(e, "type")}
                                />
                              </div>
                            )}

                            {vis("Type") && (
                              <div className="el-field-row">
                                <span className="el-field-label-right">Type :</span>
                                <DynamicSelect
                                  ref={R("type")}
                                  fetchUrl={`${apiLinks}/GetActiveCustTypes.php`}
                                  valueKey="ttypdsc"
                                  labelKey="ttypdsc"
                                  codeKey="ttypcod"
                                  organisation={organisation}
                                  locationNumber={getLocationNumber || getLocationnumber()}
                                  value={isInitialLoad ? "" : (V("type") || "")}
                                  initialCode={dropdownCodes.selectedTypeCode}
                                  onChange={(desc) => setFormStore((p) => ({ ...p, type: desc }))}
                                  onCodeChange={(c) => setDropdownCode("selectedTypeCode", c)}
                                  placeholder="Search or select..."
                                  onKeyDown={(e) => handleKeyDown(e, "cnic")}
                                />
                              </div>
                            )}

                            <div className="el-row-cnic-ntn">
                              {vis("NIC") && (
                                <div className="el-cnic-cell">
                                  <span className="el-field-label-right">CNIC :</span>
                                  <input
                                    ref={R("cnic")}
                                    value={V("cnic")}
                                    onChange={handleCnicChange("cnic")}
                                    placeholder="eg. (XXXXX-XXXXXXX-X)"
                                    maxLength={15}
                                    onKeyDown={(e) => handleKeyDown(e, "ntn")}
                                  />
                                </div>
                              )}
                              {vis("NTN") && (
                                <div className="el-ntn-cell">
                                  <span className="el-field-label-right">NTN :</span>
                                  <input
                                    ref={R("ntn")}
                                    value={V("ntn")}
                                    onChange={setField("ntn")}
                                    placeholder="eg. NTN"
                                    maxLength={20}
                                    onKeyDown={(e) => handleKeyDown(e, "city")}
                                  />
                                </div>
                              )}
                            </div>
                          </div>

                          {vis("Picture") && (
                            <div className="el-row-split-right">
                              <div
                                className="el-photo-box"
                                style={{
                                  display: "flex", alignItems: "center",
                                  justifyContent: "center", overflow: "hidden",
                                  backgroundColor: "#f5f5f5",
                                  cursor: images.customer ? "pointer" : "default",
                                }}
                                onClick={() => openImageModal(images.customer)}
                                title={images.customer ? "Click to view full size" : ""}
                              >
                                {images.customer ? (
                                  <img
                                    src={images.customer}
                                    alt="Customer"
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
                                ref={fileRefs.current.customer}
                                type="file"
                                accept="image/*"
                                style={{ display: "none" }}
                                onChange={handleImageFileChange("customer")}
                              />
                              <button
                                type="button"
                                className="el-upload-btn"
                                onClick={handleImageUploadClick("customer")}
                              >
                                ⬆ Upload
                              </button>
                            </div>
                          )}
                        </div>

                        <hr className="el-mobile-divider" />

                        {/* CITY / AREA */}
                        <div className="el-row-split-pair">
                          {vis("City") && (
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
                          )}
                          {vis("AreaCode") && (
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
                                onKeyDown={(e) => handleKeyDown(e, "state")}
                              />
                            </div>
                          )}
                        </div>

                        {/* STATE / REGION */}
                        <div className="el-row-split-pair">
                          {vis("State") && (
                            <div className="el-field-row el-half">
                              <span className="el-field-label-right">State :</span>
                              <DynamicSelect
                                ref={R("state")}
                                fetchUrl={`${apiLinks}/GetActiveStates.php`}
                                valueKey="tstadsc"
                                labelKey="tstadsc"
                                codeKey="tstacod"
                                organisation={organisation}
                                locationNumber={getLocationNumber || getLocationnumber()}
                                value={isInitialLoad ? "" : (V("state") || "")}
                                initialCode={dropdownCodes.selectedStateCode}
                                onChange={(desc) => setFormStore((p) => ({ ...p, state: desc }))}
                                onCodeChange={(c) => setDropdownCode("selectedStateCode", c)}
                                placeholder="Please Select State"
                                onKeyDown={(e) => handleKeyDown(e, "region")}
                              />
                            </div>
                          )}
                          {vis("Region") && (
                            <div className="el-field-row el-half">
                              <span className="el-field-label-right">Region :</span>
                              <DynamicSelect
                                ref={R("region")}
                                fetchUrl={`${apiLinks}/GetActiveRegion.php`}
                                valueKey="tregdsc"
                                labelKey="tregdsc"
                                codeKey="tregcod"
                                organisation={organisation}
                                locationNumber={getLocationNumber || getLocationnumber()}
                                value={isInitialLoad ? "" : (V("region") || "")}
                                initialCode={dropdownCodes.selectedRegionCode}
                                onChange={(desc) => setFormStore((p) => ({ ...p, region: desc }))}
                                onCodeChange={(c) => setDropdownCode("selectedRegionCode", c)}
                                placeholder="Please Select Region"
                                onKeyDown={(e) => handleKeyDown(e, "manager")}
                              />
                            </div>
                          )}
                        </div>

                        <hr className="el-mobile-divider" />

                        {/* MANAGER / SALESMAN */}
                        <div className="el-row-split-pair">
                          {vis("Manager") && (
                            <div className="el-field-row el-half">
                              <span className="el-field-label-right">Manager :</span>
                              <DynamicSelect
                                ref={R("manager")}
                                fetchUrl={`${apiLinks}/GetActiveManagers.php`}
                                valueKey="tmgrnam"
                                labelKey="tmgrnam"
                                codeKey="tmgrcod"
                                organisation={organisation}
                                locationNumber={getLocationNumber || getLocationnumber()}
                                value={isInitialLoad ? "" : (V("manager") || "")}
                                initialCode={dropdownCodes.selectedManagerCode}
                                onChange={(desc) => setFormStore((p) => ({ ...p, manager: desc }))}
                                onCodeChange={(c) => setDropdownCode("selectedManagerCode", c)}
                                placeholder="Please Select Manager"
                                onKeyDown={(e) => handleKeyDown(e, "salesman")}
                              />
                            </div>
                          )}
                          {vis("SalesMan") && (
                            <div className="el-field-row el-half">
                              <span className="el-field-label-right">Sales Man :</span>
                              <DynamicSelect
                                ref={R("salesman")}
                                fetchUrl={`${apiLinks}/GetActiveSalesMen.php`}
                                valueKey="tsalnam"
                                labelKey="tsalnam"
                                codeKey="tsalcod"
                                organisation={organisation}
                                locationNumber={getLocationNumber || getLocationnumber()}
                                value={isInitialLoad ? "" : (V("salesman") || "")}
                                initialCode={dropdownCodes.selectedSalesmanCode}
                                onChange={(desc) => setFormStore((p) => ({ ...p, salesman: desc }))}
                                onCodeChange={(c) => setDropdownCode("selectedSalesmanCode", c)}
                                placeholder="Please Select Salesman"
                                onKeyDown={(e) => handleKeyDown(e, "collector")}
                              />
                            </div>
                          )}
                        </div>

                        {/* COLLECTOR / GROUP */}
                        <div className="el-row-split-pair">
                          {vis("Collector") && (
                            <div className="el-field-row el-half">
                              <span className="el-field-label-right">Collector :</span>
                              <DynamicSelect
                                ref={R("collector")}
                                fetchUrl={`${apiLinks}/GetActiveCollector.php`}
                                valueKey="tcolnam"
                                labelKey="tcolnam"
                                codeKey="tcolcod"
                                organisation={organisation}
                                locationNumber={getLocationNumber || getLocationnumber()}
                                value={isInitialLoad ? "" : (V("collector") || "")}
                                initialCode={dropdownCodes.selectedCollectorCode}
                                onChange={(desc) => setFormStore((p) => ({ ...p, collector: desc }))}
                                onCodeChange={(c) => setDropdownCode("selectedCollectorCode", c)}
                                placeholder="Please Select Collector"
                                onKeyDown={(e) => handleKeyDown(e, "group")}
                              />
                            </div>
                          )}
                          {vis("Group") && (
                            <div className="el-field-row el-half">
                              <span className="el-field-label-right">Group :</span>
                              <DynamicSelect
                                ref={R("group")}
                                fetchUrl={`${apiLinks}/GetActiveGroups.php`}
                                valueKey="tgrpdsc"
                                labelKey="tgrpdsc"
                                codeKey="tgrpcod"
                                organisation={organisation}
                                locationNumber={getLocationNumber || getLocationnumber()}
                                value={isInitialLoad ? "" : (V("group") || "")}
                                initialCode={dropdownCodes.selectedGroupCode}
                                onChange={(desc) => setFormStore((p) => ({ ...p, group: desc }))}
                                onCodeChange={(c) => setDropdownCode("selectedGroupCode", c)}
                                placeholder="Please Select Group"
                                onKeyDown={(e) => handleKeyDown(e, "creditDays")}
                              />
                            </div>
                          )}
                        </div>

                        <hr className="el-mobile-divider" />

                        {/* CREDIT */}
                        <div className="el-row-split-pair">
                          {vis("CreditDays") && (
                            <div className="el-field-row el-half">
                              <span className="el-field-label-right">Credit Days :</span>
                              <input
                                ref={R("creditDays")}
                                value={V("creditDays")}
                                onChange={handleMoneyChange("creditDays")}
                                placeholder="CreditDays"
                                className="el-num-field"
                                maxLength={20}
                                onKeyDown={(e) => handleKeyDown(e, "creditLimit")}
                              />
                            </div>
                          )}
                          {vis("CreditLimit") && (
                            <div className="el-field-row el-half">
                              <span className="el-field-label-right">Credit Limit :</span>
                              <input
                                ref={R("creditLimit")}
                                value={V("creditLimit")}
                                onChange={handleMoneyChange("creditLimit")}
                                placeholder="CreditLimit"
                                className="el-num-field"
                                maxLength={20}
                                onKeyDown={(e) => handleKeyDown(e, "debit")}
                              />
                            </div>
                          )}
                        </div>

                        <div className="el-row-split-pair">
                          {vis("Debit") && (
                            <div className="el-field-row el-half">
                              <span className="el-field-label-right">Debit :</span>
                              <input
                                ref={R("debit")}
                                value={V("debit")}
                                onChange={handleMoneyChange("debit")}
                                placeholder="Debit"
                                className="el-num-field"
                                maxLength={20}
                                onKeyDown={(e) => handleKeyDown(e, "credit")}
                              />
                            </div>
                          )}
                          {vis("Credit") && (
                            <div className="el-field-row el-half">
                              <span className="el-field-label-right">Credit :</span>
                              <input
                                ref={R("credit")}
                                value={V("credit")}
                                onChange={handleMoneyChange("credit")}
                                placeholder="Credit"
                                className="el-num-field"
                                maxLength={20}
                                onKeyDown={(e) => handleKeyDown(e, "amount")}
                              />
                            </div>
                          )}
                        </div>

                        <div className="el-row-split-pair">
                          {vis("Amount") && (
                            <div className="el-field-row el-half">
                              <span className="el-field-label-right">Amount :</span>
                              <input
                                ref={R("amount")}
                                value={V("amount")}
                                onChange={handleMoneyChange("amount")}
                                placeholder="Amount"
                                className="el-num-field"
                                maxLength={20}
                                onKeyDown={(e) => handleKeyDown(e, "dueDate")}
                              />
                            </div>
                          )}
                          {vis("DueDate") && (
                            <div className="el-field-row el-half">
                              <span className="el-field-label-right">Due Date :</span>
                              <input
                                ref={R("dueDate")}
                                type="date"
                                value={V("dueDate") || ""}
                                onChange={handleDateChange("dueDate")}
                                className="el-date-inline"
                                onKeyDown={(e) => handleDateKeyDown(e, "contactName")}
                              />
                            </div>
                          )}
                        </div>

                        <hr className="el-mobile-divider" />

                        {/* CONTACT / OWNER */}
                        <div className="el-row-split-pair">
                          {vis("ContactPerson") && (
                            <div className="el-field-row el-half">
                              <span className="el-field-label-right">Name :</span>
                              <input
                                ref={R("contactName")}
                                value={V("contactName")}
                                onChange={setField("contactName")}
                                placeholder="Contact Name"
                                maxLength={40}
                                onKeyDown={(e) => handleKeyDown(e, "contactMobile")}
                              />
                            </div>
                          )}
                          {vis("ContactMobile") && (
                            <div className="el-field-row el-half">
                              <span className="el-field-label-right">Mobile :</span>
                              <input
                                ref={R("contactMobile")}
                                type="tel"
                                value={V("contactMobile")}
                                onChange={setField("contactMobile")}
                                placeholder="Mobile"
                                maxLength={11}
                                onKeyDown={(e) => {
                                  if (!/[0-9]/.test(e.key) && e.key.length === 1)
                                    e.preventDefault();
                                  handleKeyDown(e, "ownerName");
                                }}
                              />
                            </div>
                          )}
                        </div>

                        <div className="el-row-split-pair">
                          {vis("OwnerName") && (
                            <div className="el-field-row el-half">
                              <span className="el-field-label-right">Owner Name :</span>
                              <input
                                ref={R("ownerName")}
                                value={V("ownerName")}
                                onChange={setField("ownerName")}
                                placeholder="Owner Name"
                                maxLength={40}
                                onKeyDown={(e) => handleKeyDown(e, "ownerMobile")}
                              />
                            </div>
                          )}
                          {vis("OwnerMobile") && (
                            <div className="el-field-row el-half">
                              <span className="el-field-label-right">Mobile :</span>
                              <input
                                ref={R("ownerMobile")}
                                type="tel"
                                value={V("ownerMobile")}
                                onChange={setField("ownerMobile")}
                                placeholder="Mobile"
                                maxLength={11}
                                onKeyDown={(e) => {
                                  if (!/[0-9]/.test(e.key) && e.key.length === 1)
                                    e.preventDefault();
                                  handleKeyDown(e, "profession");
                                }}
                              />
                            </div>
                          )}
                        </div>

                        <hr className="el-mobile-divider" />

                        <div className="el-row-split-pair">
                          {vis("Profession") && (
                            <div className="el-field-row el-half">
                              <span className="el-field-label-right">Profession :</span>
                              <input
                                ref={R("profession")}
                                value={V("profession")}
                                onChange={setField("profession")}
                                placeholder="Profession"
                                maxLength={40}
                                onKeyDown={(e) => handleKeyDown(e, "companyName")}
                              />
                            </div>
                          )}
                          {vis("OfficeAddress1") && (
                            <div className="el-field-row el-half">
                              <span className="el-field-label-right">Company :</span>
                              <input
                                ref={R("companyName")}
                                value={V("companyName")}
                                onChange={setField("companyName")}
                                placeholder="Company Name"
                                maxLength={40}
                                onKeyDown={(e) => handleKeyDown(e, "companyAddress")}
                              />
                            </div>
                          )}
                        </div>

                        <div className="el-row-split-pair">
                          {vis("OfficeAddress2") && (
                            <div className="el-field-row el-half">
                              <span className="el-field-label-right">Address :</span>
                              <input
                                ref={R("companyAddress")}
                                value={V("companyAddress")}
                                onChange={setField("companyAddress")}
                                placeholder="Company Address"
                                maxLength={40}
                                onKeyDown={(e) => handleKeyDown(e, "companyContact")}
                              />
                            </div>
                          )}
                          {vis("OfficeContact") && (
                            <div className="el-field-row el-half">
                              <span className="el-field-label-right">Contact :</span>
                              <input
                                ref={R("companyContact")}
                                value={V("companyContact")}
                                onChange={setField("companyContact")}
                                placeholder="Company Contact"
                                maxLength={40}
                                onKeyDown={(e) => handleKeyDown(e, "guarantorContact")}
                              />
                            </div>
                          )}
                        </div>

                        <hr className="el-mobile-divider" />

                        {/* GUARANTOR */}
                        <div className="el-row-split">
                          <div className="el-row-split-left">
                            {vis("GuaranterMobile") && (
                              <div className="el-field-row">
                                <span className="el-field-label-right">Contact :</span>
                                <input
                                  className="contect-width"
                                  ref={R("guarantorContact")}
                                  type="tel"
                                  value={V("guarantorContact")}
                                  onChange={setField("guarantorContact")}
                                  placeholder="Guarantor Mobile"
                                  maxLength={11}
                                  onKeyDown={(e) => {
                                    if (!/[0-9]/.test(e.key) && e.key.length === 1)
                                      e.preventDefault();
                                    handleKeyDown(e, "guarantorName");
                                  }}
                                />
                                {MOBILE_CONFIG && (
                                  <button
                                    type="button"
                                    className="el-mobile-3dot-btn"
                                    title="Search by Mobile / CNIC / Name"
                                    tabIndex={-1}
                                    onClick={() => setIsGuarantorMobileModalOpen(true)}
                                  >
                                    ⋮
                                  </button>
                                )}
                              </div>
                            )}

                            {vis("GuaranterName") && (
                              <div className="el-field-row">
                                <span className="el-field-label-right">Name :</span>
                                <input
                                  ref={R("guarantorName")}
                                  value={V("guarantorName")}
                                  onChange={setField("guarantorName")}
                                  placeholder="Guarantor Name"
                                  maxLength={40}
                                  onKeyDown={(e) => handleKeyDown(e, "guarantorFatherName")}
                                />
                              </div>
                            )}

                            {vis("GuaranterFName") && (
                              <div className="el-field-row">
                                <span className="el-field-label-right">Fth Name :</span>
                                <input
                                  ref={R("guarantorFatherName")}
                                  value={V("guarantorFatherName")}
                                  onChange={setField("guarantorFatherName")}
                                  placeholder="Guarantor Father Name"
                                  maxLength={40}
                                  onKeyDown={(e) => handleKeyDown(e, "guarantorAddress1")}
                                />
                              </div>
                            )}

                            {vis("GuaranterAddress1") && (
                              <div className="el-field-row">
                                <span className="el-field-label-right">Address 1 :</span>
                                <input
                                  ref={R("guarantorAddress1")}
                                  value={V("guarantorAddress1")}
                                  onChange={setField("guarantorAddress1")}
                                  placeholder="Guarantor Address"
                                  maxLength={40}
                                  onKeyDown={(e) => handleKeyDown(e, "guarantorAddress2")}
                                />
                              </div>
                            )}

                            {vis("GuaranterAddress2") && (
                              <div className="el-field-row">
                                <span className="el-field-label-right">Address 2 :</span>
                                <input
                                  ref={R("guarantorAddress2")}
                                  value={V("guarantorAddress2")}
                                  onChange={setField("guarantorAddress2")}
                                  placeholder="Guarantor Address"
                                  maxLength={40}
                                  onKeyDown={(e) => handleKeyDown(e, "guarantorCnic")}
                                />
                              </div>
                            )}

                            {vis("GuaranterNIC") && (
                              <div className="el-field-row">
                                <span className="el-field-label-right">CNIC :</span>
                                <input
                                  ref={R("guarantorCnic")}
                                  value={V("guarantorCnic")}
                                  onChange={handleCnicChange("guarantorCnic")}
                                  placeholder="Guarantor CNIC"
                                  className="name-field witnes-field-width"
                                  maxLength={15}
                                  onKeyDown={(e) => handleKeyDown(e, "witnessContact")}
                                />
                              </div>
                            )}
                          </div>

                          {vis("GuaranterPic") && (
                            <div className="el-row-split-right">
                              <div
                                className="el-photo-box"
                                style={{
                                  display: "flex", alignItems: "center",
                                  justifyContent: "center", overflow: "hidden",
                                  backgroundColor: "#f5f5f5",
                                  cursor: images.guarantor ? "pointer" : "default",
                                }}
                                onClick={() => openImageModal(images.guarantor)}
                                title={images.guarantor ? "Click to view full size" : ""}
                              >
                                {images.guarantor ? (
                                  <img
                                    src={images.guarantor}
                                    alt="Guarantor"
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
                                ref={fileRefs.current.guarantor}
                                type="file"
                                accept="image/*"
                                style={{ display: "none" }}
                                onChange={handleImageFileChange("guarantor")}
                              />
                              <button
                                type="button"
                                className="el-upload-btn"
                                onClick={handleImageUploadClick("guarantor")}
                              >
                                ⬆ Upload
                              </button>
                            </div>
                          )}
                        </div>

                        <hr className="el-mobile-divider" />

                        {/* WITNESS — API keys Guaranter2* */}
                        <div className="el-row-split">
                          <div className="el-row-split-left">
                            {vis("Guaranter2Mobile") && (
                              <div className="el-field-row">
                                <span className="el-field-label-right">Contact :</span>
                                <input
                                  className="contect-width"
                                  ref={R("witnessContact")}
                                  type="tel"
                                  value={V("witnessContact")}
                                  onChange={setField("witnessContact")}
                                  placeholder="Witness Mobile"
                                  maxLength={11}
                                  onKeyDown={(e) => {
                                    if (!/[0-9]/.test(e.key) && e.key.length === 1)
                                      e.preventDefault();
                                    handleKeyDown(e, "witnessName");
                                  }}
                                />
                                {MOBILE_CONFIG && (
                                  <button
                                    type="button"
                                    className="el-mobile-3dot-btn"
                                    title="Search by Mobile / CNIC / Name"
                                    tabIndex={-1}
                                    onClick={() => setIsWitnessMobileModalOpen(true)}
                                  >
                                    ⋮
                                  </button>
                                )}
                              </div>
                            )}

                            {vis("Guaranter2Name") && (
                              <div className="el-field-row">
                                <span className="el-field-label-right">Name :</span>
                                <input
                                  ref={R("witnessName")}
                                  value={V("witnessName")}
                                  onChange={setField("witnessName")}
                                  placeholder="Witness Name"
                                  maxLength={40}
                                  onKeyDown={(e) => handleKeyDown(e, "witnessFatherName")}
                                />
                              </div>
                            )}

                            {vis("Guaranter2FName") && (
                              <div className="el-field-row">
                                <span className="el-field-label-right">Fth Name :</span>
                                <input
                                  ref={R("witnessFatherName")}
                                  value={V("witnessFatherName")}
                                  onChange={setField("witnessFatherName")}
                                  placeholder="Witness Father Name"
                                  maxLength={40}
                                  onKeyDown={(e) => handleKeyDown(e, "witnessAddress1")}
                                />
                              </div>
                            )}

                            {vis("Guaranter2Address1") && (
                              <div className="el-field-row">
                                <span className="el-field-label-right">Address 1 :</span>
                                <input
                                  ref={R("witnessAddress1")}
                                  value={V("witnessAddress1")}
                                  onChange={setField("witnessAddress1")}
                                  placeholder="Witness Address"
                                  maxLength={40}
                                  onKeyDown={(e) => handleKeyDown(e, "witnessAddress2")}
                                />
                              </div>
                            )}

                            {vis("Guaranter2Address2") && (
                              <div className="el-field-row">
                                <span className="el-field-label-right">Address 2 :</span>
                                <input
                                  ref={R("witnessAddress2")}
                                  value={V("witnessAddress2")}
                                  onChange={setField("witnessAddress2")}
                                  placeholder="Witness Address"
                                  maxLength={40}
                                  onKeyDown={(e) => handleKeyDown(e, "witnessCnic")}
                                />
                              </div>
                            )}

                            {vis("Guaranter2NIC") && (
                              <div className="el-field-row">
                                <span className="el-field-label-right">CNIC :</span>
                                <input
                                  ref={R("witnessCnic")}
                                  value={V("witnessCnic")}
                                  onChange={handleCnicChange("witnessCnic")}
                                  placeholder="Witness CNIC"
                                  className="name-field witnes-field-width"
                                  maxLength={15}
                                  onKeyDown={(e) => handleKeyDown(e, "verify")}
                                />
                              </div>
                            )}
                          </div>

                          {vis("Guaranter2Pic") && (
                            <div className="el-row-split-right">
                              <div
                                className="el-photo-box"
                                style={{
                                  display: "flex", alignItems: "center",
                                  justifyContent: "center", overflow: "hidden",
                                  backgroundColor: "#f5f5f5",
                                  cursor: images.witness ? "pointer" : "default",
                                }}
                                onClick={() => openImageModal(images.witness)}
                                title={images.witness ? "Click to view full size" : ""}
                              >
                                {images.witness ? (
                                  <img
                                    src={images.witness}
                                    alt="Witness"
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
                                ref={fileRefs.current.witness}
                                type="file"
                                accept="image/*"
                                style={{ display: "none" }}
                                onChange={handleImageFileChange("witness")}
                              />
                              <button
                                type="button"
                                className="el-upload-btn"
                                onClick={handleImageUploadClick("witness")}
                              >
                                ⬆ Upload
                              </button>
                            </div>
                          )}
                        </div>

                        <hr className="el-mobile-divider" />

                        {/* VERIFY / DATE */}
                        <div className="el-row-split-pair">
                          {vis("Verify") && (
                            <div className="el-field-row el-half">
                              <span className="el-field-label-right">Verify :</span>
                              <DynamicSelect
                                ref={R("verify")}
                                fetchUrl={`${apiLinks}/GetActiveVerifys.php`}
                                valueKey="tvrfnam"
                                labelKey="tvrfnam"
                                codeKey="tvrfcod"
                                organisation={organisation}
                                locationNumber={getLocationNumber || getLocationnumber()}
                                value={isInitialLoad ? "" : (V("verify") || "")}
                                initialCode={dropdownCodes.selectedVerifyCode}
                                onChange={(desc) => setFormStore((p) => ({ ...p, verify: desc }))}
                                onCodeChange={(c) => setDropdownCode("selectedVerifyCode", c)}
                                placeholder="Please Select Verify"
                                onKeyDown={(e) => handleKeyDown(e, "date")}
                              />
                            </div>
                          )}
                          {vis("VerifyDate") && (
                            <div className="el-field-row el-half">
                              <span className="el-field-label-right">Date :</span>
                              <input
                                ref={R("date")}
                                type="date"
                                value={V("date") || ""}
                                onChange={handleDateChange("date")}
                                className="el-date-inline"
                                onKeyDown={(e) => handleDateKeyDown(e, "latitude")}
                              />
                            </div>
                          )}
                        </div>

                        {/* LATITUDE / LONGITUDE */}
                        <div className="el-row-split-pair">
                          {vis("Lattitude") && (
                            <div className="el-field-row el-half">
                              <span className="el-field-label-right">Latitude :</span>
                              <input
                                ref={R("latitude")}
                                value={V("latitude")}
                                onChange={setField("latitude")}
                                placeholder="Latitude"
                                maxLength={20}
                                onKeyDown={(e) => handleKeyDown(e, "longitude")}
                              />
                            </div>
                          )}
                          {vis("Longitude") && (
                            <div className="el-field-row el-half">
                              <span className="el-field-label-right">Longitude :</span>
                              <input
                                ref={R("longitude")}
                                value={V("longitude")}
                                onChange={setField("longitude")}
                                placeholder="Longitude"
                                maxLength={20}
                                onKeyDown={(e) => handleKeyDown(e, "documentName")}
                              />
                            </div>
                          )}
                        </div>

                        {/* DOCUMENT */}
                        {vis("documents") && DOCUMENT_CONFIG && (
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
                        {vis("Remarks") && (
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
                        )}

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

      {/* ==================== SECTION 5 — MODALS ==================== */}

      <SearchModal
        isOpen={isSearchModalOpen}
        onClose={handleSearchModalClose}
        onSelectInstaller={handleSearchSelect}
        apiLinks={apiLinks}
        apiEndpoint={API_VARIABLES.endpoints.searchByCode}
        title="Select Customer"
        codeKey="tcstcod"
        descriptionKey="tcstnam"
      />

      {MOBILE_CONFIG && (
        <SearchModal
          isOpen={isMobileModalOpen}
          onClose={() => setIsMobileModalOpen(false)}
          onSelectInstaller={(d) => {
            setIsMobileModalOpen(false);
            handleMobileSelectGeneric("mobile", d);
          }}
          apiLinks={apiLinks}
          apiEndpoint={API_VARIABLES.endpoints.getMobileList}
          title="Select Mobile No"
          codeKey="tmobnum"
          descriptionKey="tcstnam"
          columns={[
            { key: "tmobnum", label: "Mobile No", width: "150px" },
            { key: "tnicnum", label: "CNIC", width: "180px" },
            { key: "tcstnam", label: "Name", width: "270px" },
          ]}
          searchKeys={["tmobnum", "tnicnum", "tcstnam"]}
        />
      )}

      {MOBILE_CONFIG && (
        <SearchModal
          isOpen={isGuarantorMobileModalOpen}
          onClose={() => setIsGuarantorMobileModalOpen(false)}
          onSelectInstaller={(d) => {
            setIsGuarantorMobileModalOpen(false);
            handleMobileSelectGeneric("guarantorContact", d);
          }}
          apiLinks={apiLinks}
          apiEndpoint={API_VARIABLES.endpoints.getMobileList}
          title="Select Mobile No"
          codeKey="tmobnum"
          descriptionKey="tcstnam"
          columns={[
            { key: "tmobnum", label: "Mobile No", width: "150px" },
            { key: "tnicnum", label: "CNIC", width: "180px" },
            { key: "tcstnam", label: "Name", width: "270px" },
          ]}
          searchKeys={["tmobnum", "tnicnum", "tcstnam"]}
        />
      )}

      {MOBILE_CONFIG && (
        <SearchModal
          isOpen={isWitnessMobileModalOpen}
          onClose={() => setIsWitnessMobileModalOpen(false)}
          onSelectInstaller={(d) => {
            setIsWitnessMobileModalOpen(false);
            handleMobileSelectGeneric("witnessContact", d);
          }}
          apiLinks={apiLinks}
          apiEndpoint={API_VARIABLES.endpoints.getMobileList}
          title="Select Mobile No"
          codeKey="tmobnum"
          descriptionKey="tcstnam"
          columns={[
            { key: "tmobnum", label: "Mobile No", width: "150px" },
            { key: "tnicnum", label: "CNIC", width: "180px" },
            { key: "tcstnam", label: "Name", width: "270px" },
          ]}
          searchKeys={["tmobnum", "tnicnum", "tcstnam"]}
        />
      )}

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