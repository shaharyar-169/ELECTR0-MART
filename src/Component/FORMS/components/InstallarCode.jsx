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
  maxCode,
  onMaxCodeChange,
}, ref) => {

  const padCode = useCallback((val) => {
    if (!val && val !== 0) return val;
    const digits = String(val).replace(/\D/g, '');
    return digits.padStart(3, '0');
  }, []);

  // Fetch installation code
  useEffect(() => {
    if (!organisation) return;

    // Endpoint parent se aa raha hai
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
          // API response ka first value
          const newCode = padCode(response.data[0]);

          // Parent ki code state update
          setCode(newCode);
          if (onMaxCodeChange) {
            onMaxCodeChange(newCode);
          }
        } else {
          console.warn(
            "Response data structure is not as expected:",
            response.data
          );
        }
      })
      .catch((error) => {
        console.error(
          "Error fetching installation code:",
          error
        );
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

  // Manual input change (max 3 characters) — no padding during typing
  const handleCodeChange = (e) => {
    const value = e.target.value;
    if (value.length <= 3) {
      setCode(value);
    }
  };

  // Pad when the user leaves the field
  const handleBlur = () => {
    if (code) {
      setCode(padCode(code));
    }
  };

  // Increase / Decrease
  const bumpCode = (amount) => {
    const numericCode = parseInt(code, 10);

    if (isNaN(numericCode)) return;

    const newNumericCode = numericCode + amount;

    // Don't increment above maxCode
    if (amount > 0 && maxCode) {
      const maxNumeric = parseInt(maxCode, 10);
      if (!isNaN(maxNumeric) && newNumericCode > maxNumeric) return;
    }

    const newCode = padCode(String(newNumericCode));

    setCode(newCode);
    if (onCodeChange) {
      onCodeChange(newCode);
    }
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
        <button
          type="button"
          onClick={() => bumpCode(1)}
        >
          ▲
        </button>
        <button
          type="button"
          onClick={() => bumpCode(-1)}
        >
          ▼
        </button>
      </div>
    </div>
  );
});

export default InstallationCode;