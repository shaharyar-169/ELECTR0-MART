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
  onKeyDown,
  maxCode,
  onMaxCodeChange,
  codeFormat = "short",
  codePrefix = "14-01",
}, ref) => {

  // Normalize prefix once
  const normalizedPrefix = (() => {
    const digits = String(codePrefix || "").replace(/\D/g, "");
    if (!digits) return "14-01";
    if (digits.length <= 2) return digits.padStart(2, "0");
    const parts = digits.match(/.{1,2}/g) || [];
    return parts.join("-");
  })();

  // ---- Format helper ----
  const padCode = useCallback((val) => {
    if (!val && val !== 0) return val;

    if (codeFormat === "long") {
      const raw = String(val).trim();
      let counterDigits = "";

      if (raw.includes("-")) {
        const parts = raw.split("-");
        counterDigits = String(parts[parts.length - 1] || "").replace(/\D/g, "");
      } else {
        const digits = raw.replace(/\D/g, "");
        const prefixDigits = normalizedPrefix.replace(/\D/g, "");
        const stripped = prefixDigits && digits.startsWith(prefixDigits)
          ? digits.slice(prefixDigits.length)
          : digits;
        counterDigits = stripped;
      }

      counterDigits = counterDigits.slice(0, 4).padStart(4, "0");
      return `${normalizedPrefix}-${counterDigits}`;
    }

    const digits = String(val).replace(/\D/g, "");
    return digits.padStart(3, "0");
  }, [codeFormat, normalizedPrefix]);

  // ---- Fetch next code ----
  useEffect(() => {
    if (!organisation) return;

    const apiUrl = apiLinks + apiEndpoint;

    const formData = new URLSearchParams({
      code: "AMRELEC",
      FLocCod: "001",
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
    const prefixWithDash = `${normalizedPrefix}-`;

    let counterPart = "";

    if (value.startsWith(prefixWithDash)) {
      counterPart = value.slice(prefixWithDash.length);
    } else {
      let digits = value.replace(/\D/g, "");
      const prefixDigits = normalizedPrefix.replace(/\D/g, "");
      if (prefixDigits && digits.startsWith(prefixDigits)) {
        digits = digits.slice(prefixDigits.length);
      }
      counterPart = digits;
    }

    // Digits only from the counter portion
    let counterDigits = counterPart.replace(/\D/g, "");

    // ⭐ Strip leading zeros, cap significant digits at 4
    const significant = counterDigits.replace(/^0+/, "");
    counterDigits = significant.slice(0, 4);

    const rebuilt = counterDigits === ""
      ? `${normalizedPrefix}-`
      : `${normalizedPrefix}-${counterDigits.padStart(4, "0")}`;

    if (rebuilt !== code) {
      setCode(rebuilt);
    }
  } else {
    const digits = value.replace(/\D/g, "");
    if (digits.length <= 3) {
      setCode(digits);
    }
  }
};

  // Blur — finalize
  const handleBlur = () => {
    if (code) {
      const padded = padCode(code);
      setCode(padded);
      if (onCodeChange && padded !== code) {
        onCodeChange(padded);
      }
    }
  };

  // Enter — pad, fire onCodeChange, then forward to parent's onKeyDown
  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      e.stopPropagation();

      const padded = padCode(code);
      setCode(padded);
      if (onCodeChange) {
        onCodeChange(padded);
      }

      if (onKeyDown) {
        onKeyDown(e);
      }
      return;
    }

    if (onKeyDown) {
      onKeyDown(e);
    }
  };

  // ---- Stepper ----
  const bumpCode = (amount) => {
    if (!code) return;

    let newCode;

    if (codeFormat === "long") {
      const parts = String(code).split("-");
      const last = parseInt(parts[parts.length - 1], 10);
      if (isNaN(last)) return;

      let newLast = last + amount;

      if (amount > 0 && maxCode) {
        const maxParts = String(maxCode).split("-");
        const maxLast = parseInt(maxParts[maxParts.length - 1], 10);
        if (!isNaN(maxLast) && newLast > maxLast) return;
      }

      const counterStr = String(newLast).padStart(4, "0");
      newCode = `${normalizedPrefix}-${counterStr}`;
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
        onKeyDown={handleKeyDown}
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




