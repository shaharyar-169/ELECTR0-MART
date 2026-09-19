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

// ---------------------------------------------------------------------
// Server / image & document base paths
// ---------------------------------------------------------------------
const API_BASE = "https://crystalsolutions.pk/api";

// Both images and documents live under the SAME root folder:
//   Images:    https://crystalsolutions.pk/DI/DEMOELEC/<filename>
//   Documents: https://crystalsolutions.pk/DI/DEMOELEC/<filename>
const IMAGE_SERVER_BASE = "https://crystalsolutions.pk/DI";

const buildImageBaseForOrg = (orgCode) =>
  `${IMAGE_SERVER_BASE}/${String(orgCode || "DEMOELEC").trim()}/`;

const IMAGE_BASE_URL = buildImageBaseForOrg("DEMOELEC");

// The organisation code we send to the backend.
const ORG_CODE = "DEMOELEC";
const LOC_CODE = "001";

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

  const todayISO = () => {
    const d = new Date();
    const yyyy = d.getFullYear();
    const mm = String(d.getMonth() + 1).padStart(2, "0");
    const dd = String(d.getDate()).padStart(2, "0");
    return `${yyyy}-${mm}-${dd}`;
  };

  const [formStore, setFormStore] = useState({
    status: "Active",
    abb: "",
    description: "",
    contactPerson: "",
    email: "",
    address: "",
    address2: "",
    address3: "",
    expiry: todayISO(),
    phone: "",
    mobile: "",
    mobile2: "",
    mobile3: "",
    nic: "",
    jcName: "",
    jcNumber: "",
    epName: "",
    epNumber: "",
    bank: "",
    accountNumber: "",

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

    dobDate: todayISO(),
    joinDate: todayISO(),
    leaveDate: todayISO(),
    leaveRemarks: "",

    remarks: "",
    documentName: "",
  });

  const [selectedImage1, setSelectedImage1] = useState("");
  const [selectedImage2, setSelectedImage2] = useState("");
  const [photoFileName, setPhotoFileName] = useState("");

  const [code, setCode] = useState("");
  const [maxCode, setMaxCode] = useState("");
  const [organisation, setOrganisation] = useState(null);
  const [isInitialLoad, setIsInitialLoad] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isCoolingDown, setIsCoolingDown] = useState(false);
  const [isSearchModalOpen, setIsSearchModalOpen] = useState(false);
  const [isFetchingNextCode, setIsFetchingNextCode] = useState(false);
  const codeInputRef = useRef(null);

  const fetchCallIdRef = useRef(0);
  const isSavingRef = useRef(false);
  const isCoolingDownRef = useRef(false);

  const [employeeList, setEmployeeList] = useState([]);
  const employeeListRef = useRef([]);
  const pendingCodeRef = useRef("");

  // Refs
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

  const jcNameInputRef = useRef(null);
  const jcNumberInputRef = useRef(null);
  const epNameInputRef = useRef(null);
  const epNumberInputRef = useRef(null);
  const bankInputRef = useRef(null);
  const accountNumberInputRef = useRef(null);
  const saveButtonRef = useRef(null);
  const abbInputRef = useRef(null);

  const dobDateRef = useRef(null);
  const joinDateRef = useRef(null);
  const leaveDateRef = useRef(null);
  const leaveRemarksRef = useRef(null);
  const creditCommRef = useRef(null);
  const cashCommRef = useRef(null);
  const insCommRef = useRef(null);
  const salaryRef = useRef(null);
  const overTimeRef = useRef(null);
  const advanceCodeRef = useRef(null);
  const advanceTextRef = useRef(null);
  const deliveryCodeRef = useRef(null);
  const deliveryTextRef = useRef(null);
  const commissionCodeRef = useRef(null);
  const reference1Ref = useRef(null);
  const reference1NameRef = useRef(null);
  const reference2Ref = useRef(null);
  const reference2NameRef = useRef(null);
  const documentNameRef = useRef(null);
  const remarksRef = useRef(null);

  const photoInputRef = useRef(null);
  const documentInputRef = useRef(null);

  // ============================================================
  // Helpers
  // ============================================================
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

  const deriveAdvanceDelivery = (rawCode, description) => {
    const cleanCode = String(rawCode ?? "").replace(/\D/g, "");
    const upperName = String(description || "").trim().toUpperCase();

    return {
      advanceCode: cleanCode ? `13-03-0${cleanCode}` : "",
      advanceText: upperName ? `${upperName} - ADVANCE` : "- ADVANCE",
      deliveryCode: cleanCode ? `71-02-0${cleanCode}` : "",
      deliveryText: upperName ? `${upperName} - DELIVERY` : "- DELIVERY",
      commissionCode: cleanCode ? `22-03-0${cleanCode}` : "",
      commissionDescription: upperName ? `${upperName} - COMMISSION` : "- COMMISSION",
    };
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

  const formatNIC = (value) => {
    const digits = String(value || "").replace(/\D/g, "");
    const limitedDigits = digits.slice(0, 13);

    if (limitedDigits.length <= 5) {
      return limitedDigits;
    } else if (limitedDigits.length <= 12) {
      return `${limitedDigits.slice(0, 5)}-${limitedDigits.slice(5)}`;
    } else {
      return `${limitedDigits.slice(0, 5)}-${limitedDigits.slice(5, 12)}-${limitedDigits.slice(12, 13)}`;
    }
  };

  const buildImageUrl = (value, orgCode) => {
    const raw = String(value ?? "").trim();
    if (!raw) return "";
    if (raw.startsWith("data:")) return raw;
    if (raw.startsWith("blob:")) return raw;
    if (raw.startsWith("http://") || raw.startsWith("https://")) return raw;
    if (raw.startsWith("/")) {
      return API_BASE.replace(/\/api$/, "") + raw;
    }
    return buildImageBaseForOrg(orgCode || ORG_CODE) + raw;
  };

  const blankFormStore = () => ({
    status: "Active",
    abb: "",
    description: "",
    contactPerson: "",
    email: "",
    address: "",
    address2: "",
    address3: "",
    expiry: todayISO(),
    phone: "",
    mobile: "",
    mobile2: "",
    mobile3: "",
    nic: "",
    jcName: "",
    jcNumber: "",
    epName: "",
    epNumber: "",
    bank: "",
    accountNumber: "",

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

    dobDate: todayISO(),
    joinDate: todayISO(),
    leaveDate: todayISO(),
    leaveRemarks: "",

    remarks: "",
    documentName: "",
  });

  const clearForm = () => {
    setFormStore(blankFormStore());
    setSelectedImage1("");
    setSelectedImage2("");
    setPhotoFileName("");
    if (photoInputRef.current) photoInputRef.current.value = "";
    if (documentInputRef.current) documentInputRef.current.value = "";
  };

  useEffect(() => {
    const orgData = getOrganisationData();
    setOrganisation(orgData);
  }, []);

  useEffect(() => {
    if (!organisation) return;

    const apiUrl = apiLinks + "/NewEmployee.php";
    const formData = new URLSearchParams({
      code: ORG_CODE,
      FLocCod: LOC_CODE,
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

  const loadEmployeeList = () => {
    if (!organisation) return;

    const apiUrl = apiLinks + "/EmployeeList.php";
    const formData = new URLSearchParams({
      code: ORG_CODE,
      FLocCod: LOC_CODE,
    }).toString();

    return axios
      .post(apiUrl, formData)
      .then((response) => {
        let rows = [];

        if (Array.isArray(response.data)) {
          rows = response.data;
        } else if (typeof response.data === "string") {
          try {
            const parsed = JSON.parse(response.data);
            rows = Array.isArray(parsed) ? parsed : [];
          } catch (e) {
            console.error(">>> Could not parse EmployeeList response:", e);
            rows = [];
          }
        } else if (response.data && typeof response.data === "object") {
          const candidates = [
            response.data.data,
            response.data.rows,
            response.data.result,
            response.data.records,
            response.data.list,
          ];
          const nested = candidates.find((c) => Array.isArray(c));
          rows = nested || [];
        }

        console.log(">>> EmployeeList loaded:", rows.length, "rows");

        employeeListRef.current = rows;
        setEmployeeList(rows);

        if (pendingCodeRef.current) {
          const retryCode = pendingCodeRef.current;
          pendingCodeRef.current = "";
          fetchInstallationDataByCode(retryCode);
        }
      })
      .catch((error) => {
        console.error("Error fetching employee list:", error);
        employeeListRef.current = [];
        setEmployeeList([]);
      });
  };

  useEffect(() => {
    loadEmployeeList();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [organisation, apiLinks, getLocationNumber]);

  useEffect(() => {
    try {
      const derived = deriveAdvanceDelivery(code, formStore.description);

      setFormStore((prev) => {
        if (
          prev.advanceCode === derived.advanceCode &&
          prev.deliveryCode === derived.deliveryCode &&
          prev.advanceText === derived.advanceText &&
          prev.deliveryText === derived.deliveryText &&
          prev.commissionCode === derived.commissionCode &&
          prev.commissionDescription === derived.commissionDescription
        ) {
          return prev;
        }

        return {
          ...prev,
          advanceCode: derived.advanceCode,
          deliveryCode: derived.deliveryCode,
          advanceText: derived.advanceText,
          deliveryText: derived.deliveryText,
          commissionCode: derived.commissionCode,
          commissionDescription: derived.commissionDescription,
        };
      });
    } catch (err) {
      console.error(">>> auto-fill effect error:", err);
    }
  }, [code, formStore.description]);

  useEffect(() => {
    if (code && isInitialLoad) {
      const timer = setTimeout(() => {
        if (codeInputRef.current) {
          const input = codeInputRef.current.querySelector("input");
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

  const showToast = (message, type = "success") => {
    console.log("Toast:", message);

    const toast = document.createElement("div");
    const backgroundColor = type === "error" ? "#f44336" : "#4CAF50";
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
      toast.style.animation = "slideOut 0.3s ease-in";
      setTimeout(() => {
        document.body.removeChild(toast);
      }, 300);
    }, 3000);

    if (!document.getElementById("toast-styles")) {
      const style = document.createElement("style");
      style.id = "toast-styles";
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

  const findEmployeeInList = (employeeCode) => {
    const wanted = normaliseCode(employeeCode);
    if (!wanted) return null;

    const list = employeeListRef.current || [];

    return (
      list.find((row) => {
        if (!row || typeof row !== "object") return false;
        const rowCode = row.Code ?? row.code ?? row.tempcod ?? row.FEmpCod;
        return normaliseCode(rowCode) === wanted;
      }) || null
    );
  };

  const applyListRowToForm = (row) => {
    const statusRaw = txt(row.Status);
    const listEmail = txt(row.Email);

    setFormStore((prev) => ({
      ...prev,

      status:
        statusRaw === "A"
          ? "Active"
          : statusRaw === "N"
          ? "Non-Active"
          : prev.status,

      description: txt(row.Employee),
      email: txt(row.Designation),

      mobile: txt(row.Mobile),
      phone: listEmail,
      emailAddress: listEmail,

      nic: row.NIC ? formatNIC(row.NIC) : "",

      dobDate: row.DOB ? toInputDate(row.DOB) : "",
      joinDate: row["Join Date"] ? toInputDate(row["Join Date"]) : "",
    }));

    const rowCode = row.Code ?? row.code ?? row.tempcod ?? row.FEmpCod;
    if (txt(rowCode) !== "") {
      setCode(txt(rowCode));
    }
  };

  const fetchInstallationDataByCode = (installationCode) => {
    const cleanCode = String(installationCode || "").trim();

    if (!organisation || !cleanCode) {
      console.warn(">>> Guard: organisation or code missing", {
        organisation: !!organisation,
        cleanCode,
      });
      return;
    }

    clearForm();

    const listRow = findEmployeeInList(cleanCode);

    if (listRow) {
      console.log(">>> Matched EmployeeList row:", listRow);
      applyListRowToForm(listRow);
      showToast("Employee data found", "success");
    } else if (!(employeeListRef.current || []).length) {
      console.log(">>> EmployeeList not loaded yet, queueing code:", cleanCode);
      pendingCodeRef.current = cleanCode;
    } else {
      console.warn(">>> No EmployeeList row for code:", cleanCode);
      showToast("Data not found", "error");
    }

    const callId = ++fetchCallIdRef.current;

    const apiUrl = apiLinks + "/GetEmployee.php";
    const formData = new URLSearchParams({
      code: ORG_CODE,
      FLocCod: LOC_CODE,
      FEmpCod: cleanCode,
    }).toString();

    console.log(">>> Requesting GetEmployee for code:", cleanCode);

    axios
      .post(apiUrl, formData)
      .then((response) => {
        if (callId !== fetchCallIdRef.current) {
          console.log(">>> Ignoring stale response for:", cleanCode);
          return;
        }

        console.log(">>> RAW response.data:", response.data);

        let rows = [];

        if (Array.isArray(response.data)) {
          rows = response.data;
        } else if (response.data && typeof response.data === "object") {
          const candidates = [
            response.data.data,
            response.data.rows,
            response.data.result,
            response.data.records,
            response.data.list,
          ];
          const nested = candidates.find((c) => Array.isArray(c));
          if (nested) {
            rows = nested;
          } else {
            rows = [response.data];
          }
        } else if (typeof response.data === "string") {
          try {
            const parsed = JSON.parse(response.data);
            rows = Array.isArray(parsed) ? parsed : [parsed];
          } catch (e) {
            console.error(">>> Could not parse string response:", e);
            rows = [];
          }
        }

        const lowerKeys = (obj) => {
          if (!obj || typeof obj !== "object") return obj;
          const out = {};
          Object.keys(obj).forEach((k) => {
            out[k.toLowerCase()] = obj[k];
          });
          return out;
        };
        rows = rows.map(lowerKeys);

        const data =
          rows.find(
            (r) =>
              r &&
              typeof r === "object" &&
              (r.tempcod !== undefined ||
                r.tempnam !== undefined ||
                r.tempsts !== undefined)
          ) ||
          (rows.length === 1 && typeof rows[0] === "object" ? rows[0] : undefined);

        console.log(">>> Normalized rows:", rows);
        console.log(">>> Picked employee object:", data);

        const pickField = (row, candidateKeys) => {
          if (!row) return undefined;
          for (const key of candidateKeys) {
            const val = row[key];
            if (val !== undefined && val !== null && String(val).trim() !== "") {
              return val;
            }
          }
          return undefined;
        };

        if (!data) {
          console.warn(">>> No employee object in GetEmployee response:", rows);
          return;
        }

        setFormStore((prev) => ({
          ...prev,

          status:
            data.tempsts === "A"
              ? "Active"
              : data.tempsts === "N"
              ? "Non-Active"
              : prev.status,
          abb:
            txt(pickField(data, ["tempabb", "empabb", "abb", "fempabb"])) ||
            prev.abb,
          description: txt(data.tempnam) || prev.description,
          contactPerson:
            txt(
              pickField(data, [
                "tempfth",
                "empfth",
                "fth",
                "tempfather",
                "empfathername",
                "fathername",
              ])
            ) || prev.contactPerson,
          email: txt(data.tempdsg) || prev.email,
          address:
            txt(
              pickField(data, [
                "tempdep",
                "empdep",
                "dep",
                "department",
                "tempdept",
              ])
            ) || prev.address,

          address2:
            txt(pickField(data, ["tadd001", "add001", "address1", "addr1"])) ||
            prev.address2,
          address3:
            txt(pickField(data, ["tadd002", "add002", "address2", "addr2"])) ||
            prev.address3,

          phone: txt(data.tphnnum) || prev.phone,
          mobile: txt(data.tmobnum) || prev.mobile,
          mobile2: txt(data.tmob001) || prev.mobile2,
          mobile3: txt(data.tmob002) || prev.mobile3,
          emailAddress: txt(data.temladd) || prev.emailAddress,

          nic: data.tnicnum ? formatNIC(data.tnicnum) : prev.nic,
          expiry: (() => {
            const raw = pickField(data, [
              "tnicexp",
              "nicexp",
              "expirydate",
              "empnicexp",
              "nicexpiry",
            ]);
            return raw ? toInputDate(raw) : prev.expiry;
          })(),

          salary:
            pickField(data, ["tempsal", "empsal", "salary"]) ?? prev.salary,
          overTime:
            pickField(data, ["tovrtim", "ovrtim", "overtime", "overtim"]) ??
            prev.overTime,
          cashComm:
            pickField(data, ["tcshcom", "cshcom", "cashcomm", "cashcommission"]) ??
            prev.cashComm,
          creditComm:
            pickField(data, [
              "tcrtcom",
              "crtcom",
              "creditcomm",
              "creditcommission",
            ]) ?? prev.creditComm,
          insComm: data.tinscom ?? prev.insComm,

          commissionCode: txt(data.tcomcod) || prev.commissionCode,
          commissionDescription:
            data["Commission Dsc"] || prev.commissionDescription,

          reference1:
            txt(pickField(data, ["tmob001", "mob001"])) ||
            prev.reference1,
          reference2:
            txt(pickField(data, ["tmob002", "mob002"])) ||
            prev.reference2,

          reference1Name:
            txt(pickField(data, ["tref001", "ref001"])) ||
            prev.reference1Name,
          reference2Name:
            txt(pickField(data, ["tref002", "ref002"])) ||
            prev.reference2Name,

          dobDate: data.tempdob ? toInputDate(data.tempdob) : prev.dobDate,
          joinDate: data.tjondat ? toInputDate(data.tjondat) : prev.joinDate,
          leaveDate: (() => {
            const raw = pickField(data, [
              "tlevdat",
              "levdat",
              "leavedate",
              "leftdate",
            ]);
            return raw ? toInputDate(raw) : prev.leaveDate;
          })(),
          leaveRemarks: txt(data.tlevrem) || prev.leaveRemarks,

          remarks:
            txt(pickField(data, ["temprem", "emprem", "remarks", "remark"])) ||
            prev.remarks,
          documentName: txt(data.tempdoc) || prev.documentName,
        }));

        if (data.tempcod) {
          setCode(String(data.tempcod).trim());
        }

        // Photo — server returns a filename, image lives at:
        //   https://crystalsolutions.pk/DI/<ORG>/<filename>
        const picRaw = pickField(data, [
          "temppic",
          "tempPic",
          "fempPic",
          "fempic",
          "photo",
          "image",
        ]);
        const picName = String(picRaw ?? "").trim();

        if (picName) {
          setPhotoFileName(picName);

          if (
            picName.startsWith("data:") ||
            picName.startsWith("blob:") ||
            picName.startsWith("http://") ||
            picName.startsWith("https://")
          ) {
            setSelectedImage1(picName);
          } else {
            const url = buildImageBaseForOrg(ORG_CODE) + picName;
            console.log(">>> Image URL:", url);
            setSelectedImage1(url);
          }
        } else {
          setPhotoFileName("");
          setSelectedImage1("");
        }

        if (data.tempdoc) setSelectedImage2(data.tempdoc);
      })
      .catch((error) => {
        if (callId !== fetchCallIdRef.current) return;
        console.error(">>> GetEmployee error for", cleanCode, ":", error);
      });
  };

  const handleNicChange = (e) => {
    const rawValue = e.target.value;
    const formattedValue = formatNIC(rawValue);
    setFormStore((prev) => ({ ...prev, nic: formattedValue }));
  };

  const handleReferencePhoneChange = (key) => (e) => {
    const digitsOnly = String(e.target.value || "").replace(/\D/g, "").slice(0, 11);
    setFormStore((prev) => ({ ...prev, [key]: digitsOnly }));
  };

  const handleReferencePhoneKeyDown = (e, nextRef) => {
    const controlKeys = [
      "Backspace",
      "Delete",
      "ArrowLeft",
      "ArrowRight",
      "Tab",
      "Home",
      "End",
      "Enter",
    ];

    if (controlKeys.includes(e.key) || e.ctrlKey || e.metaKey) {
      if (e.key === "Enter") {
        e.preventDefault();
        e.stopPropagation();
        handleKeyDown(e, nextRef);
      }
      return;
    }

    if (!/[0-9]/.test(e.key)) {
      e.preventDefault();
      e.stopPropagation();
      return;
    }

    const input = e.target;
    const currentLen = input.value.length;
    const hasSelection =
      input.selectionStart !== null &&
      input.selectionEnd !== null &&
      input.selectionStart !== input.selectionEnd;

    if (currentLen >= 11 && !hasSelection) {
      e.preventDefault();
      e.stopPropagation();
    }
  };

  const handleReferenceNameChange = (key) => (e) => {
    const value = String(e.target.value || "").slice(0, 40);
    setFormStore((prev) => ({ ...prev, [key]: value }));
  };

  const handlePhotoButtonClick = () => {
    if (photoInputRef.current) {
      photoInputRef.current.click();
    }
  };

  const handlePhotoFileChange = (e) => {
    const file = e.target.files && e.target.files[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      showToast("Please select an image file", "error");
      return;
    }

    const MAX_BYTES = 5 * 1024 * 1024;
    if (file.size > MAX_BYTES) {
      showToast("Image is too large (max 5 MB)", "error");
      return;
    }

    const previewUrl = URL.createObjectURL(file);
    setSelectedImage1(previewUrl);

    showToast("Image selected", "success");
  };

  // ----------------------------------------------------------------
  // Document upload / download
  // ----------------------------------------------------------------
  const handleDocumentUploadClick = () => {
    if (documentInputRef.current) {
      documentInputRef.current.click();
    }
  };

  const handleDocumentFileChange = (e) => {
    const file = e.target.files && e.target.files[0];
    if (!file) return;

    const MAX_BYTES = 10 * 1024 * 1024;
    if (file.size > MAX_BYTES) {
      showToast("Document is too large (max 10 MB)", "error");
      return;
    }

    setFormStore((prev) => ({ ...prev, documentName: file.name }));

    showToast("Document selected", "success");
  };

  // Download the currently-referenced document from the server.
  // Documents live in the SAME root folder as images:
  //   https://crystalsolutions.pk/DI/<ORG>/<filename>
  //
  // We do NOT use a HEAD probe here — some servers reject HEAD with 405,
  // which would incorrectly report the file as "not found". Instead we
  // just trigger the browser's native download via an <a> element.
  const handleDocumentDownload = () => {
    const fileName = String(formStore.documentName || "").trim();
    if (!fileName) {
      showToast("No document to download", "error");
      return;
    }

    const url = `https://crystalsolutions.pk/DI/${ORG_CODE}/${fileName}`;
    console.log(">>> Downloading document from:", url);

    const a = document.createElement("a");
    a.href = url;
    a.download = fileName;
    a.target = "_blank";
    a.rel = "noopener noreferrer";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);

    showToast("Downloading " + fileName, "success");
  };

  const set = (key) => (e) => {
    const value = e.target.value;
    setFormStore((prev) => ({ ...prev, [key]: value }));
  };

  const handleInstallerSelect = (installerData) => {
    if (!installerData) return;

    const selectedCode =
      installerData.code ??
      installerData.Code ??
      installerData.tempcod ??
      installerData.FEmpCod ??
      "";

    const clean = String(selectedCode || "").trim();
    if (!clean) return;

    setCode(clean);
    fetchInstallationDataByCode(clean);
  };

  const handleInstallerCodeChange = (newCode) => {
    const clean = String(newCode || "").trim();
    if (!clean) return;
    fetchInstallationDataByCode(clean);
  };

  const handleModalClose = () => {
    setIsSearchModalOpen(false);
    setTimeout(() => {
      if (codeInputRef.current) {
        const input = codeInputRef.current.querySelector("input");
        if (input) {
          input.focus();
          input.select();
        }
      }
    }, 100);
  };

  const handleKeyDown = (e, nextRef) => {
    if (e.key === "Enter") {
      e.preventDefault();
      e.stopPropagation();
      if (nextRef && nextRef.current) {
        const element = nextRef.current;
        if (element.tagName === "SELECT" || element.tagName === "INPUT") {
          element.focus();
          if (element.tagName === "INPUT") {
            element.select();
          }
        } else {
          const input = element.querySelector("input, select");
          if (input) {
            input.focus();
            if (input.tagName === "INPUT") {
              input.select();
            }
          }
        }
      }
    }
  };

  const handleNicEnter = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      e.stopPropagation();
      if (descriptionInputRef.current) {
        descriptionInputRef.current.focus();
      }
    }
  };

  const resetForm = () => {
    clearForm();

    setCode("");
    setMaxCode("");

    if (organisation) {
      setIsFetchingNextCode(true);
      const apiUrl = apiLinks + "/NewEmployee.php";
      const formData = new URLSearchParams({
        code: ORG_CODE,
        FLocCod: LOC_CODE,
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
        })
        .finally(() => {
          setIsFetchingNextCode(false);
        });
    }
  };

  const mapStatusForApi = (status) => {
    if (status === "Active") return "A";
    if (status === "Non-Active") return "N";
    return status || "";
  };

  const amountForApi = (value) => {
    const parsed = cleanAmount(value);
    return parsed === "" ? "0" : String(parsed);
  };

  const strForApi = (value) => {
    if (value === null || value === undefined) return "";
    return String(value).trim();
  };

  const buildSavePayload = () => ({
    code: ORG_CODE,
    FLocCod: LOC_CODE,
    FUsrId: strForApi(user?.tusrid) || "sohaib",

    FEmpCod: strForApi(code),
    FEmpSts: mapStatusForApi(formStore.status),
    FEmpNam: strForApi(formStore.description),
    FEmpFth: strForApi(formStore.contactPerson),
    FEmpDsg: strForApi(formStore.email),
    FEmpDep: strForApi(formStore.address),
    FEmpAbb: strForApi(formStore.abb),

    FAdd001: strForApi(formStore.address2),
    FAdd002: strForApi(formStore.address3),

    FMobNum: strForApi(formStore.mobile),
    FMob001: strForApi(formStore.reference1),
    FMob002: strForApi(formStore.reference2),

    FEmlAdd: strForApi(formStore.emailAddress) || strForApi(formStore.phone),

    FEmpSal: amountForApi(formStore.salary),
    FOvrTim: amountForApi(formStore.overTime),
    FCshCom: amountForApi(formStore.cashComm),
    FCrtCom: amountForApi(formStore.creditComm),
    FInsCom: amountForApi(formStore.insComm),

    FAdvCod: strForApi(formStore.advanceCode),
    FAdvDsc: strForApi(formStore.advanceText),
    FDlvCod: strForApi(formStore.deliveryCode),
    FDlvDsc: strForApi(formStore.deliveryText),

      tcomcod: strForApi(formStore.commissionCode),
    FComDsc: strForApi(formStore.commissionDescription),

    FRef001: strForApi(formStore.reference1Name),
    FRef002: strForApi(formStore.reference2Name),

    FNicNum: strForApi(formStore.nic).replace(/-/g, ""),
    FNicExp: formStore.expiry ? toInputDate(formStore.expiry) : "",

    FJonDat: formStore.joinDate ? toInputDate(formStore.joinDate) : "",
    FLevDat: formStore.leaveDate ? toInputDate(formStore.leaveDate) : "",
    FEmpDob: formStore.dobDate ? toInputDate(formStore.dobDate) : "",

    FLevRem: strForApi(formStore.leaveRemarks),
    FEmpRem: strForApi(formStore.remarks),

    FEmpPic: strForApi(photoFileName),

    FEmpDoc: strForApi(formStore.documentName),
    FEmpDocNam: strForApi(formStore.documentName),
    FEmpThb: "",
  });

  const handleSave = async () => {
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

    setIsSaving(true);

    try {
      const apiUrl = apiLinks + "/SaveEmployee.php";

      const payload = buildSavePayload();
      payload.FEmpCod = trimmedCode;

      const formData = new FormData();
      Object.entries(payload).forEach(([key, value]) => {
        formData.append(key, value);
      });

      const photoInput = photoInputRef.current;
      const pickedPhotoFile =
        photoInput && photoInput.files && photoInput.files[0];

      if (pickedPhotoFile) {
        formData.set("FEmpPic", pickedPhotoFile);
        console.log(
          ">>> Attaching photo file to FEmpPic:",
          pickedPhotoFile.name,
          pickedPhotoFile.size,
          "bytes"
        );
      } else {
        console.log(">>> No new photo picked, sending FEmpPic as:", payload.FEmpPic);
      }

      const docInput = documentInputRef.current;
      const pickedDocFile =
        docInput && docInput.files && docInput.files[0];

      if (pickedDocFile) {
        formData.set("FEmpDoc", pickedDocFile);
        console.log(
          ">>> Attaching document file to FEmpDoc:",
          pickedDocFile.name,
          pickedDocFile.size,
          "bytes"
        );
      } else {
        console.log(">>> No new doc picked, sending FEmpDoc as:", payload.FEmpDoc);
      }

      const response = await axios.post(apiUrl, formData, {
        // Axios sets multipart/form-data boundary automatically.
      });

      console.log("Save response:", response.status, response.data);

      if (response.status === 200) {
        showToast("Form saved successfully!", "success");
        await loadEmployeeList();
        resetForm();
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
      console.error("Error saving data:", error);
      console.error("Error response:", error.response?.data);
      console.error("Error status:", error.response?.status);

      let errorMessage = "Error saving data";
      const data = error.response?.data;
      if (typeof data === "string" && data.trim()) {
        errorMessage = data.trim();
      } else if (data && typeof data === "object") {
        errorMessage = data.message || data.error || errorMessage;
      }
      showToast(String(errorMessage).slice(0, 200), "error");
    } finally {
      setIsSaving(false);
      isSavingRef.current = false;
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
                  <div
                    className="el-field-row"
                    onKeyDownCapture={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault();
                        e.stopPropagation();
                        fetchInstallationDataByCode(code);
                        if (abbInputRef.current) {
                          abbInputRef.current.focus();
                        }
                      }
                    }}
                  >
                    <span className="el-field-label-right">
                      Employee Code :
                    </span>
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
                        <div className="el-field-row">
                          <span className="el-field-label-right">Name :</span>
                          <input
                            ref={descriptionInputRef}
                            value={formStore.description}
                            onChange={set("description")}
                            placeholder="Name"
                            className="name-field"
                            maxLength={40}
                            onKeyDown={(e) =>
                              handleKeyDown(e, contactPersonInputRef)
                            }
                          />
                        </div>

                        <div className="el-row-split">
                          <div className="el-row-split-left">
                            <div className="el-field-row">
                              <span className="el-field-label-right">
                                Father Name:
                              </span>
                              <input
                                ref={contactPersonInputRef}
                                value={formStore.contactPerson}
                                onChange={set("contactPerson")}
                                placeholder="Father Name"
                                maxLength={40}
                                onKeyDown={(e) =>
                                  handleKeyDown(e, emailInputRef)
                                }
                              />
                            </div>

                            <div className="el-field-row">
                              <span className="el-field-label-right">
                                Designation:
                              </span>
                              <input
                                ref={emailInputRef}
                                value={formStore.email}
                                onChange={set("email")}
                                placeholder="e.g. Manager, Engineer, etc."
                                maxLength={40}
                                onKeyDown={(e) =>
                                  handleKeyDown(e, address1InputRef)
                                }
                              />
                            </div>

                            <div className="el-field-row">
                              <span className="el-field-label-right">
                                Department:
                              </span>
                              <input
                                ref={address1InputRef}
                                value={formStore.address}
                                onChange={set("address")}
                                placeholder="e.g. IT, etc."
                                maxLength={40}
                                onKeyDown={(e) =>
                                  handleKeyDown(e, address2InputRef)
                                }
                              />
                            </div>

                            <div className="el-field-row">
                              <span className="el-field-label-right">
                                Address:
                              </span>
                              <input
                                ref={address2InputRef}
                                value={formStore.address2}
                                onChange={set("address2")}
                                placeholder="Address"
                                maxLength={40}
                                onKeyDown={(e) =>
                                  handleKeyDown(e, address3InputRef)
                                }
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
                                onKeyDown={(e) =>
                                  handleKeyDown(e, nicInputRef)
                                }
                              />
                            </div>

                            <div className="el-field-row el-cnic-row">
                              <span className="el-field-label-right">
                                CNIC:
                              </span>
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
                              <span className="el-field-label-right">
                                Email:
                              </span>
                              <input
                                ref={phoneInputRef}
                                value={formStore.phone}
                                onChange={set("phone")}
                                placeholder="crystalsolution@gmail.com"
                                className="email-field"
                                maxLength={40}
                                onKeyDown={(e) =>
                                  handleKeyDown(e, mobileInputRef)
                                }
                              />
                            </div>

                            <div className="el-field-row">
                              <span className="el-field-label-right">
                                Mobile:
                              </span>
                              <input
                                ref={mobileInputRef}
                                type="tel"
                                value={formStore.mobile}
                                onChange={set("mobile")}
                                placeholder="03XXXXXXXXX"
                                className="mobile-field"
                                maxLength={11}
                                onKeyDown={(e) => {
                                  if (
                                    !/[0-9]/.test(e.key) &&
                                    e.key.length === 1
                                  ) {
                                    e.preventDefault();
                                  }
                                  handleKeyDown(e, dobDateRef);
                                }}
                              />
                            </div>
                          </div>

                          <div className="el-row-split-right">
                            <div className="el-photo-box">
                              {selectedImage1 ? (
                                <img
                                  src={selectedImage1}
                                  alt="Employee"
                                  className="el-photo-img"
                                  style={{
                                    width: "100%",
                                    height: "100%",
                                    objectFit: "cover",
                                    objectPosition: "center",
                                    display: "block",
                                    borderRadius: "inherit",
                                  }}
                                  onError={(e) => {
                                    e.currentTarget.style.display = "none";
                                  }}
                                  onLoad={(e) => {
                                    e.currentTarget.style.display = "block";
                                  }}
                                />
                              ) : (
                                <span className="el-photo-placeholder">
                                  No Image
                                </span>
                              )}
                            </div>
                            <input
                              ref={photoInputRef}
                              type="file"
                              accept="image/*"
                              style={{ display: "none" }}
                              onChange={handlePhotoFileChange}
                            />
                            <button
                              type="button"
                              className="el-upload-btn"
                              onClick={handlePhotoButtonClick}
                            >
                              ⬆ Upload
                            </button>
                          </div>
                        </div>

                        <hr className="el-mobile-divider" />

                        <div className="el-row-split-pair el-row-dob-join">
                          <div className="el-field-row el-half">
                            <span className="el-field-label-right">
                              DOB Date:
                            </span>
                            <input
                              ref={dobDateRef}
                              type="date"
                              value={formStore.dobDate || ""}
                              onChange={set("dobDate")}
                              className="el-date-inline"
                              onKeyDown={(e) =>
                                handleKeyDown(e, joinDateRef)
                              }
                            />
                          </div>
                          <div className="el-field-row el-half">
                            <span className="el-field-label-right">
                              Join Date:
                            </span>
                            <input
                              ref={joinDateRef}
                              type="date"
                              value={formStore.joinDate || ""}
                              onChange={set("joinDate")}
                              className="el-date-inline"
                              onKeyDown={(e) =>
                                handleKeyDown(e, leaveDateRef)
                              }
                            />
                          </div>
                        </div>

                        <div className="el-row-split-pair el-row-leave">
                          <div className="el-field-row el-half">
                            <span className="el-field-label-right">
                              Leave Date:
                            </span>
                            <input
                              ref={leaveDateRef}
                              type="date"
                              value={formStore.leaveDate || ""}
                              onChange={set("leaveDate")}
                              className="el-date-inline"
                              onKeyDown={(e) =>
                                handleKeyDown(e, leaveRemarksRef)
                              }
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
                              onKeyDown={(e) =>
                                handleKeyDown(e, creditCommRef)
                              }
                            />
                          </div>
                        </div>

                        <hr className="el-mobile-divider" />

                        <div className="el-row-split-pair">
                          <div className="el-field-row el-half">
                            <span className="el-field-label-right">
                              Credit Comm:
                            </span>
                            <input
                              ref={creditCommRef}
                              value={formStore.creditComm || ""}
                              onChange={set("creditComm")}
                              placeholder="0.00"
                              className="el-num-field"
                              maxLength={20}
                              onKeyDown={(e) =>
                                handleKeyDown(e, cashCommRef)
                              }
                            />
                          </div>
                          <div className="el-field-row el-half">
                            <span className="el-field-label-right">
                              Cash Comm:
                            </span>
                            <input
                              ref={cashCommRef}
                              value={formStore.cashComm || ""}
                              onChange={set("cashComm")}
                              placeholder="0.00"
                              className="el-num-field"
                              maxLength={20}
                              onKeyDown={(e) => handleKeyDown(e, insCommRef)}
                            />
                          </div>
                        </div>

                        <div className="el-row-split-pair">
                          <div className="el-field-row el-half">
                            <span className="el-field-label-right">
                              Ins Comm:
                            </span>
                            <input
                              ref={insCommRef}
                              value={formStore.insComm || ""}
                              onChange={set("insComm")}
                              placeholder="0.00"
                              className="el-num-field"
                              maxLength={20}
                              onKeyDown={(e) => handleKeyDown(e, salaryRef)}
                            />
                          </div>
                          <div className="el-field-row el-half" />
                        </div>

                        <div className="el-row-split-pair">
                          <div className="el-field-row el-half">
                            <span className="el-field-label-right">
                              Salary:
                            </span>
                            <input
                              ref={salaryRef}
                              value={formStore.salary || ""}
                              onChange={set("salary")}
                              placeholder="Salary"
                              className="el-num-field"
                              maxLength={20}
                              onKeyDown={(e) =>
                                handleKeyDown(e, overTimeRef)
                              }
                            />
                          </div>
                          <div className="el-field-row el-half">
                            <span className="el-field-label-right">
                              Over Time:
                            </span>
                            <input
                              ref={overTimeRef}
                              value={formStore.overTime || ""}
                              onChange={set("overTime")}
                              placeholder="Over Time"
                              className="el-num-field"
                              maxLength={20}
                              onKeyDown={(e) =>
                                handleKeyDown(e, advanceCodeRef)
                              }
                            />
                          </div>
                        </div>

                        <div className="el-row-code-pair">
                          <div className="el-field-row el-code-field-cell">
                            <span className="el-field-label-right">
                              Advance Code:
                            </span>
                            <input
                              ref={advanceCodeRef}
                              value={formStore.advanceCode || ""}
                              readOnly
                              tabIndex={-1}
                              className="el-code-input"
                              onKeyDown={(e) =>
                                handleKeyDown(e, advanceTextRef)
                              }
                            />
                          </div>
                          <div className="el-field-row el-remark-field-cell">
                            <input
                              ref={advanceTextRef}
                              value={formStore.advanceText || ""}
                              readOnly
                              tabIndex={-1}
                              placeholder="- ADVANCE"
                              className="el-remark-field"
                              onKeyDown={(e) =>
                                handleKeyDown(e, deliveryCodeRef)
                              }
                            />
                          </div>
                        </div>

                        <div className="el-row-code-pair">
                          <div className="el-field-row el-code-field-cell">
                            <span className="el-field-label-right">
                              Delivery Code:
                            </span>
                            <input
                              ref={deliveryCodeRef}
                              value={formStore.deliveryCode || ""}
                              readOnly
                              tabIndex={-1}
                              className="el-code-input"
                              onKeyDown={(e) =>
                                handleKeyDown(e, deliveryTextRef)
                              }
                            />
                          </div>
                          <div className="el-field-row el-remark-field-cell">
                            <input
                              ref={deliveryTextRef}
                              value={formStore.deliveryText || ""}
                              readOnly
                              tabIndex={-1}
                              placeholder="- DELIVERY"
                              className="el-remark-field"
                              onKeyDown={(e) =>
                                handleKeyDown(e, commissionCodeRef)
                              }
                            />
                          </div>
                        </div>

                        <div className="el-row-code-pair">
                          <div className="el-field-row el-code-field-cell">
                            <span className="el-field-label-right">
                              Comm Code:
                            </span>
                            <input
                              ref={commissionCodeRef}
                              value={formStore.commissionCode || ""}
                              readOnly
                              tabIndex={-1}
                              className="el-code-input"
                              onKeyDown={(e) =>
                                handleKeyDown(e, reference1Ref)
                              }
                            />
                          </div>
                          <div className="el-field-row el-remark-field-cell">
                            <input
                              value={formStore.commissionDescription || ""}
                              readOnly
                              tabIndex={-1}
                              placeholder="- COMMISSION"
                              className="el-remark-field"
                            />
                          </div>
                        </div>

                        <hr className="el-mobile-divider" />

                        <div className="el-row-split-pair">
                          <div className="el-field-row el-half">
                            <span className="el-field-label-right">
                              Reference:
                            </span>
                            <input
                              ref={reference1Ref}
                              type="tel"
                              inputMode="numeric"
                              value={formStore.reference1 || ""}
                              onChange={handleReferencePhoneChange("reference1")}
                              placeholder="03XXXXXXXXX"
                              className="el-ref-phone-field"
                              maxLength={11}
                              onKeyDown={(e) =>
                                handleReferencePhoneKeyDown(e, reference1NameRef)
                              }
                            />
                          </div>
                          <div className="el-field-row el-half">
                            <input
                              ref={reference1NameRef}
                              value={formStore.reference1Name || ""}
                              onChange={handleReferenceNameChange("reference1Name")}
                              placeholder="Name"
                              className="el-remark-field"
                              maxLength={40}
                              onKeyDown={(e) =>
                                handleKeyDown(e, reference2Ref)
                              }
                            />
                          </div>
                        </div>

                        <div className="el-row-split-pair">
                          <div className="el-field-row el-half">
                            <span className="el-field-label-right">
                              Reference:
                            </span>
                            <input
                              ref={reference2Ref}
                              type="tel"
                              inputMode="numeric"
                              value={formStore.reference2 || ""}
                              onChange={handleReferencePhoneChange("reference2")}
                              placeholder="03XXXXXXXXX"
                              className="el-ref-phone-field"
                              maxLength={11}
                              onKeyDown={(e) =>
                                handleReferencePhoneKeyDown(e, reference2NameRef)
                              }
                            />
                          </div>
                          <div className="el-field-row el-half">
                            <input
                              ref={reference2NameRef}
                              value={formStore.reference2Name || ""}
                              onChange={handleReferenceNameChange("reference2Name")}
                              placeholder="Name"
                              className="el-remark-field"
                              maxLength={40}
                              onKeyDown={(e) =>
                                handleKeyDown(e, documentNameRef)
                              }
                            />
                          </div>
                        </div>

                        <div className="el-doc-row">
                          <span className="el-field-label-right el-doc-label">
                            Document:
                          </span>
                         <div className="el-doc-input-cell">
  <input
    ref={documentNameRef}
    value={formStore.documentName || ""}
    readOnly
    tabIndex={-1}
    placeholder="Click to upload Document"
    className="el-doc-input"
    maxLength={60}
    onKeyDown={(e) =>
      handleKeyDown(e, remarksRef)
    }
  />
</div>
                          <input
                            ref={documentInputRef}
                            type="file"
                            accept=".pdf,.doc,.docx,.xls,.xlsx,.txt,.csv,.png,.jpg,.jpeg"
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

                        <div className="el-field-row el-remarks-row">
                          <span className="el-field-label-right">
                            Remarks:
                          </span>
                          <textarea
                            ref={remarksRef}
                            value={formStore.remarks || ""}
                            onChange={set("remarks")}
                            placeholder="Remarks"
                            className="el-remarks-textarea"
                            maxLength={255}
                            onKeyDown={(e) => {
                              if (e.key === "Enter" && !e.shiftKey) {
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
                disabled={isSaving || isCoolingDown || isFetchingNextCode}
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