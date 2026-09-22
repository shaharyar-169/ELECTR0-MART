// import React, { useEffect, forwardRef, useCallback } from "react";
// import axios from "axios";

// const InstallationCode = forwardRef(({
//   organisation,
//   apiLinks,
//   apiEndpoint,
//   getLocationNumber,
//   getLocationnumber,
//   code,
//   setCode,
//   onDoubleClick,
//   onCodeChange,
//   maxCode,
//   onMaxCodeChange,
// }, ref) => {

//   const padCode = useCallback((val) => {
//     if (!val && val !== 0) return val;
//     const digits = String(val).replace(/\D/g, '');
//     return digits.padStart(3, '0');
//   }, []);

//   // Fetch installation code
//   useEffect(() => {
//     if (!organisation) return;

//     // Endpoint parent se aa raha hai
//     const apiUrl = apiLinks + apiEndpoint;

//     const formData = new URLSearchParams({
//       code: organisation.code,
//       FLocCod: getLocationNumber || getLocationnumber(),
//     }).toString();

//     axios
//       .post(apiUrl, formData)
//       .then((response) => {
//         if (
//           response.data &&
//           Array.isArray(response.data) &&
//           response.data.length > 0
//         ) {
//           // API response ka first value
//           const newCode = padCode(response.data[0]);

//           // Parent ki code state update
//           setCode(newCode);
//           if (onMaxCodeChange) {
//             onMaxCodeChange(newCode);
//           }
//         } else {
//           console.warn(
//             "Response data structure is not as expected:",
//             response.data
//           );
//         }
//       })
//       .catch((error) => {
//         console.error(
//           "Error fetching installation code:",
//           error
//         );
//       });

//   }, [
//     organisation,
//     apiLinks,
//     apiEndpoint,
//     getLocationNumber,
//     getLocationnumber,
//     setCode,
//     padCode,
//     onMaxCodeChange,
//   ]);

//   // Manual input change (max 3 characters) — no padding during typing
//   const handleCodeChange = (e) => {
//     const value = e.target.value;
//     if (value.length <= 3) {
//       setCode(value);
//     }
//   };

//   // Pad when the user leaves the field
//   const handleBlur = () => {
//     if (code) {
//       setCode(padCode(code));
//     }
//   };

//   // Increase / Decrease
//   const bumpCode = (amount) => {
//     const numericCode = parseInt(code, 10);

//     if (isNaN(numericCode)) return;

//     const newNumericCode = numericCode + amount;

//     // Don't increment above maxCode
//     if (amount > 0 && maxCode) {
//       const maxNumeric = parseInt(maxCode, 10);
//       if (!isNaN(maxNumeric) && newNumericCode > maxNumeric) return;
//     }

//     const newCode = padCode(String(newNumericCode));

//     setCode(newCode);
//     if (onCodeChange) {
//       onCodeChange(newCode);
//     }
//   };

//   return (
//     <div className="el-code-input" ref={ref}>
//       <input
//         value={code}
//         onChange={handleCodeChange}
//         onBlur={handleBlur}
//         onFocus={(e) => e.target.select()}
//         onDoubleClick={onDoubleClick}
//         placeholder="Code"
//       />
//       <div className="el-stepper">
//         <button
//           type="button"
//           onClick={() => bumpCode(1)}
//         >
//           ▲
//         </button>
//         <button
//           type="button"
//           onClick={() => bumpCode(-1)}
//         >
//           ▼
//         </button>
//       </div>
//     </div>
//   );
// });

// export default InstallationCode;


import React, { useEffect, forwardRef, useCallback } from "react";
import axios from "axios";

/**
 * InstallationCode
 * -----------------
 * Supports two code layouts:
 *
 *   • codeFormat="short"  →  "001", "098", "123"        (pads to 3 digits)
 *   • codeFormat="long"   →  "14-01-0005", "14-01-0011" (pads last segment to 4 digits)
 *
 * Default is "short" for backward-compatibility.
 */
const InstallationCode = forwardRef(({
  organisation,
  apiLinks,
  apiEndpoint,
  getLocationNumber,
  getLocationnumber,
  code,
  setCode,
  onDoubleClick,
  onCodeChange,
  maxCode,
  onMaxCodeChange,
  codeFormat = "short",       // "short" | "long"
}, ref) => {

  // ---- Format helpers ----

 const padCode = useCallback((val) => {
  if (!val && val !== 0) return val;

  if (codeFormat === "long") {
    const raw = String(val).trim();

    // ── 1. Already formatted like "14-01-0005" ──
    if (raw.includes("-")) {
      const parts = raw.split("-");
      const last = String(parts[parts.length - 1] || "").replace(/\D/g, "");
      parts[parts.length - 1] = last.padStart(4, "0");
      return parts.join("-");
    }

    // ── 2. Digits only, e.g. "14010005" or "14010011" ──
    const digits = raw.replace(/\D/g, "");

    if (digits.length === 0) return "";

    // If ≤ 4 digits → just pad last segment
    if (digits.length <= 4) {
      return digits.padStart(4, "0");
    }

    // Take the last 4 digits as the counter (0005, 0011, ...)
    const counter = digits.slice(-4).padStart(4, "0");

    // Everything before the counter is the prefix (e.g. "1401")
    const prefixDigits = digits.slice(0, digits.length - 4);

    // Group prefix in 2s → "14-01"
    // If prefix is odd length, keep the leading digit(s) as first group.
    let groupedPrefix = "";
    if (prefixDigits.length <= 2) {
      groupedPrefix = prefixDigits.padStart(2, "0");
    } else {
      // e.g. "1401" → ["14","01"]
      const parts = prefixDigits.match(/.{1,2}/g) || [];
      groupedPrefix = parts.join("-");
    }

    return `${groupedPrefix}-${counter}`;
  }

  // ── Short format (legacy) ──
  const digits = String(val).replace(/\D/g, "");
  return digits.padStart(3, "0");
}, [codeFormat]);

  // ---- Fetch next code ----
  useEffect(() => {
    if (!organisation) return;

    const apiUrl = apiLinks + apiEndpoint;

    const formData = new URLSearchParams({
      code: organisation.code,
      FLocCod: getLocationNumber || getLocationnumber(),
    }).toString();

    axios
      .post(apiUrl, formData)
      .then((response) => {
        if (
          response.data &&
          Array.isArray(response.data) &&
          response.data.length > 0
        ) {
          const newCode = padCode(response.data[0]);
          setCode(newCode);
          if (onMaxCodeChange) onMaxCodeChange(newCode);
        } else {
          console.warn(
            "Response data structure is not as expected:",
            response.data
          );
        }
      })
      .catch((error) => {
        console.error("Error fetching installation code:", error);
      });

  }, [
    organisation,
    apiLinks,
    apiEndpoint,
    getLocationNumber,
    getLocationnumber,
    setCode,
    padCode,
    onMaxCodeChange,
  ]);

  // ---- Manual typing ----

  const handleCodeChange = (e) => {
    const value = e.target.value;

    if (codeFormat === "long") {
      // Allow digits and dashes only, cap at 12 chars ("14-01-0005")
      if (/^[0-9-]*$/.test(value) && value.length <= 12) {
        setCode(value);
      }
    } else {
      // Short — digits only, max 3
      if (value.length <= 3) {
        setCode(value);
      }
    }
  };

  const handleBlur = () => {
    if (code) {
      setCode(padCode(code));
    }
  };

  // ---- Stepper (+/-) ----

  const bumpCode = (amount) => {
    if (!code) return;

    let newCode;

    if (codeFormat === "long") {
      // Work on the last segment only
      const parts = String(code).split("-");
      const last = parseInt(parts[parts.length - 1], 10);
      if (isNaN(last)) return;

      let newLast = last + amount;

      // Don't increment above maxCode's last segment
      if (amount > 0 && maxCode) {
        const maxParts = String(maxCode).split("-");
        const maxLast = parseInt(maxParts[maxParts.length - 1], 10);
        if (!isNaN(maxLast) && newLast > maxLast) return;
      }

      parts[parts.length - 1] = String(newLast).padStart(4, "0");
      newCode = parts.join("-");
    } else {
      const numericCode = parseInt(code, 10);
      if (isNaN(numericCode)) return;

      const newNumericCode = numericCode + amount;

      if (amount > 0 && maxCode) {
        const maxNumeric = parseInt(maxCode, 10);
        if (!isNaN(maxNumeric) && newNumericCode > maxNumeric) return;
      }

      newCode = padCode(String(newNumericCode));
    }

    setCode(newCode);
    if (onCodeChange) onCodeChange(newCode);
  };

  return (
    <div className="el-code-input" ref={ref}>
      <input
        value={code}
        onChange={handleCodeChange}
        onBlur={handleBlur}
        onFocus={(e) => e.target.select()}
        onDoubleClick={onDoubleClick}
        placeholder="Code"
      />
      <div className="el-stepper">
        <button type="button" onClick={() => bumpCode(1)}>▲</button>
        <button type="button" onClick={() => bumpCode(-1)}>▼</button>
      </div>
    </div>
  );
});

export default InstallationCode;