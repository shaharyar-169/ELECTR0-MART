import React, { useEffect, forwardRef } from "react";
import axios from "axios";

const InstallationCode = forwardRef(({
  organisation,
  apiLinks,
  apiEndpoint,
  getLocationNumber,
  getLocationnumber,
  code,
  setCode,
}, ref) => {

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
          const newCode = response.data[0];

          // Parent ki code state update
          setCode(newCode);
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
  ]);

  // Manual input change
  const handleCodeChange = (e) => {
    setCode(e.target.value);
  };

  // Increase / Decrease
  const bumpCode = (amount) => {
    const numericCode = parseInt(code, 10);

    if (isNaN(numericCode)) return;

    const newCode = String(numericCode + amount);

    setCode(newCode);
  };

  return (
    <div className="el-code-input" ref={ref}>
      <input
        value={code}
        onChange={handleCodeChange}
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