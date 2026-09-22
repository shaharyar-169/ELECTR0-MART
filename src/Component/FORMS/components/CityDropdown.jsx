// import React, { useEffect, useState, useRef, useMemo } from "react";
// import axios from "axios";

// /**
//  * DynamicSelect
//  * -------------
//  * Reusable searchable dropdown.
//  *
//  * - Supports `fetchUrl` (full URL) OR `apiEndpoint + apiLinks`.
//  * - `valueKey` / `labelKey` / `codeKey` are ALL dynamic.
//  * - On select:
//  *      • `onChange(description)`      → what shows in the input + gets stored
//  *      • `onCodeChange(code)` /
//  *        `onCityCodeChange(code)`     → separate callback for backend code
//  */
// export default function DynamicSelect({
//   // --- endpoint ---
//   fetchUrl,
//   apiEndpoint,
//   apiLinks,

//   // --- context ---
//   organisation,
//   locationNumber,

//   // --- value / handlers ---
//   value,
//   onChange,
//   valueKey = "name",        // field to store in `value` (description)
//   labelKey = "name",        // field to display
//   codeKey = "code",         // field whose value gets emitted as code
//   onCityCodeChange,         // kept for backwards-compat (City uses this)
//   onCodeChange,             // generic alias

//   // --- misc ---
//   onKeyDown,
//   placeholder = "Search or select...",
// }) {
//   const [options, setOptions] = useState([]);
//   const [isOpen, setIsOpen] = useState(false);
//   const [highlightedIndex, setHighlightedIndex] = useState(-1);
//   const [searchText, setSearchText] = useState("");

//   const inputRef = useRef(null);
//   const listRef = useRef(null);
//   const blurTimeoutRef = useRef(null);
//   const searchBufferRef = useRef("");
//   const searchTimeoutRef = useRef(null);

//   // ---------- Resolve URL ----------
//   const resolvedUrl = useMemo(() => {
//     if (fetchUrl) return fetchUrl;
//     if (apiEndpoint && apiLinks) return apiLinks + apiEndpoint;
//     return "";
//   }, [fetchUrl, apiEndpoint, apiLinks]);

//   // ---------- Fetch options ----------
//   useEffect(() => {
//     if (!resolvedUrl) return;

//     const formData = new URLSearchParams({
//       code:
//         (organisation && (organisation.code || organisation.organization)) ||
//         "DEMOELEC",
//       FLocCod: locationNumber || "001",
//     }).toString();

//     axios
//       .post(resolvedUrl, formData)
//       .then((response) => {
//         let rows = response.data;

//         if (typeof rows === "string") {
//           try { rows = JSON.parse(rows); } catch (e) { rows = []; }
//         }

//         if (rows && !Array.isArray(rows) && typeof rows === "object") {
//           const candidates = [
//             rows.data, rows.rows, rows.result,
//             rows.records, rows.list,
//           ];
//           const nested = candidates.find((c) => Array.isArray(c));
//           rows = nested || [];
//         }

//         if (Array.isArray(rows)) {
//           setOptions(rows);
//         } else {
//           console.warn("DynamicSelect: unexpected response:", response.data);
//           setOptions([]);
//         }
//       })
//       .catch((error) => {
//         console.error("DynamicSelect: fetch error:", error);
//         setOptions([]);
//       });
//   }, [resolvedUrl, organisation, locationNumber]);

//   // ---------- Filtered list ----------
//   const filteredOptions = useMemo(() => {
//     if (!searchText) return options;
//     const q = searchText.toLowerCase();
//     return options.filter((row) =>
//       String(row[labelKey] ?? "").toLowerCase().includes(q)
//     );
//   }, [options, searchText, labelKey]);

//   useEffect(() => {
//     if (highlightedIndex >= filteredOptions.length) {
//       setHighlightedIndex(filteredOptions.length > 0 ? 0 : -1);
//     }
//   }, [filteredOptions, highlightedIndex]);

//   // ---------- Helpers ----------
//   const openAndHighlightCurrent = () => {
//     const idx = filteredOptions.findIndex(
//       (row) => String(row[valueKey]) === String(value)
//     );
//     setHighlightedIndex(idx >= 0 ? idx : 0);
//     setIsOpen(true);
//   };

//   const emitCode = (code) => {
//     if (typeof onCityCodeChange === "function") onCityCodeChange(code);
//     if (typeof onCodeChange === "function") onCodeChange(code);
//   };

//   // ⭐ KEY CHANGE — emit DESCRIPTION for value, CODE separately
//   const handleSelect = (row) => {
//     if (!row) return;

//     const desc = row[labelKey] !== undefined ? row[labelKey] : "";
//     const code = row[codeKey] !== undefined ? row[codeKey] : "";

//     onChange(desc);     // store & display description
//     emitCode(code);     // fire code callback

//     setIsOpen(false);
//     setSearchText("");
//     resetSearchBuffer();
//     setHighlightedIndex(-1);
//   };

//   const handleClear = (e) => {
//     e.stopPropagation();
//     onChange("");
//     emitCode("");
//     setIsOpen(false);
//     setSearchText("");
//     setHighlightedIndex(-1);
//     resetSearchBuffer();
//     if (inputRef.current) inputRef.current.focus();
//   };

//   useEffect(() => {
//     if (!isOpen || highlightedIndex < 0 || !listRef.current) return;
//     const el = listRef.current.querySelector(
//       `[data-index="${highlightedIndex}"]`
//     );
//     if (el) el.scrollIntoView({ block: "nearest" });
//   }, [highlightedIndex, isOpen]);

//   const resetSearchBuffer = () => {
//     searchBufferRef.current = "";
//     if (searchTimeoutRef.current) {
//       clearTimeout(searchTimeoutRef.current);
//       searchTimeoutRef.current = null;
//     }
//   };

//   // ---------- Keyboard handling ----------
//   const handleInputKeyDown = (e) => {
//     if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "a") return;

//     if (e.key === "Delete") {
//       e.preventDefault();
//       handleClear(e);
//       return;
//     }

//     if (e.key === "Enter") {
//       e.preventDefault();
//       e.stopPropagation();
//       if (isOpen && highlightedIndex >= 0 && filteredOptions[highlightedIndex]) {
//         handleSelect(filteredOptions[highlightedIndex]);
//       } else {
//         setIsOpen(false);
//         setSearchText("");
//         resetSearchBuffer();
//       }
//       if (onKeyDown) onKeyDown(e);
//       return;
//     }

//     if (e.key === "ArrowDown") {
//       e.preventDefault();
//       resetSearchBuffer();
//       if (!isOpen) { openAndHighlightCurrent(); return; }
//       setHighlightedIndex((prev) =>
//         Math.min(prev + 1, filteredOptions.length - 1)
//       );
//       return;
//     }

//     if (e.key === "ArrowUp") {
//       e.preventDefault();
//       resetSearchBuffer();
//       if (!isOpen) { openAndHighlightCurrent(); return; }
//       setHighlightedIndex((prev) => Math.max(prev - 1, 0));
//       return;
//     }

//     if (e.key === "Escape") {
//       e.preventDefault();
//       if (searchText) {
//         setSearchText("");
//         resetSearchBuffer();
//         setHighlightedIndex(0);
//       } else {
//         setIsOpen(false);
//         resetSearchBuffer();
//       }
//       return;
//     }

//     if (e.key === " ") {
//       e.preventDefault();
//       if (!isOpen) openAndHighlightCurrent();
//       return;
//     }

//     if (e.key === "Backspace") {
//       e.preventDefault();
//       if (searchText) {
//         const newText = searchText.slice(0, -1);
//         setSearchText(newText);
//         searchBufferRef.current = newText.toLowerCase();
//         if (!isOpen) setIsOpen(true);
//         setHighlightedIndex(0);
//       }
//       return;
//     }

//     if (e.key.length === 1 && /[a-zA-Z0-9]/.test(e.key)) {
//       e.preventDefault();
//       if (searchTimeoutRef.current) clearTimeout(searchTimeoutRef.current);
//       const newText = (searchText + e.key).toUpperCase();
//       setSearchText(newText);
//       searchBufferRef.current = newText.toLowerCase();
//       setIsOpen(true);
//       setHighlightedIndex(0);
//     }
//   };

//   const handleBlur = () => {
//     blurTimeoutRef.current = setTimeout(() => {
//       setIsOpen(false);
//       setSearchText("");
//       resetSearchBuffer();
//     }, 150);
//   };

//   const handleFocus = () => {
//     if (blurTimeoutRef.current) clearTimeout(blurTimeoutRef.current);
//   };

//   useEffect(() => {
//     return () => {
//       if (blurTimeoutRef.current) clearTimeout(blurTimeoutRef.current);
//       if (searchTimeoutRef.current) clearTimeout(searchTimeoutRef.current);
//     };
//   }, []);

//   const displayValue = searchText ? searchText : value || "";

//   return (
//     <div style={{ position: "relative", display: "inline-block" }}>
//       <div style={{ position: "relative", display: "inline-block" }}>
//         <input
//           ref={inputRef}
//           type="text"
//           readOnly
//           className="city-select-dropdown fixed-width-field"
//           value={displayValue}
//           onClick={() => {
//             if (isOpen) setIsOpen(false);
//             else openAndHighlightCurrent();
//           }}
//           onKeyDown={handleInputKeyDown}
//           onBlur={handleBlur}
//           onFocus={handleFocus}
//           placeholder={placeholder}
//           style={{
//             paddingRight: displayValue ? "20px" : "8px",
//             fontStyle: "normal",
//             color: searchText ? "#444" : "inherit",
//             textTransform: searchText ? "uppercase" : "none",
//             width: "100%",
//           }}
//         />

//         {(value || searchText) && (
//           <button
//             type="button"
//             onClick={handleClear}
//             style={{
//               position: "absolute",
//               right: "4px",
//               top: "50%",
//               transform: "translateY(-50%)",
//               background: "none",
//               border: "none",
//               cursor: "pointer",
//               fontSize: "14px",
//               color: "#999",
//               padding: "2px 4px",
//               display: "flex",
//               alignItems: "center",
//               justifyContent: "center",
//               lineHeight: "1",
//               borderRadius: "50%",
//               transition: "all 0.15s ease",
//             }}
//             onMouseEnter={(e) => {
//               e.currentTarget.style.color = "#333";
//               e.currentTarget.style.backgroundColor = "#f0f0f0";
//             }}
//             onMouseLeave={(e) => {
//               e.currentTarget.style.color = "#999";
//               e.currentTarget.style.backgroundColor = "transparent";
//             }}
//             aria-label="Clear selection"
//           >
//             ×
//           </button>
//         )}
//       </div>

//       {isOpen && (
//         <ul
//           ref={listRef}
//           role="listbox"
//           style={{
//             position: "absolute",
//             top: "100%",
//             left: 0,
//             right: 0,
//             marginTop: 2,
//             maxHeight: 160,
//             overflowY: "auto",
//             background: "#fff",
//             border: "1px solid #ccc",
//             borderRadius: 4,
//             boxShadow: "0 4px 10px rgba(0,0,0,0.12)",
//             zIndex: 1000,
//             listStyle: "none",
//             padding: 0,
//             minWidth: "100%",
//           }}
//         >
//           {filteredOptions.length === 0 ? (
//             <li
//               style={{
//                 padding: "6px 8px",
//                 fontSize: "12px",
//                 color: "#999",
//                 textAlign: "center",
//               }}
//             >
//               No options found
//             </li>
//           ) : (
//             filteredOptions.map((row, index) => (
//               <li
//                 key={row.id || row[codeKey] || index}
//                 data-index={index}
//                 role="option"
//                 aria-selected={index === highlightedIndex}
//                 onMouseDown={(e) => e.preventDefault()}
//                 onMouseEnter={() => setHighlightedIndex(index)}
//                 onClick={() => handleSelect(row)}
//                 style={{
//                   padding: "2px 8px",
//                   fontSize: "12px",
//                   cursor: "pointer",
//                   background:
//                     index === highlightedIndex ? "#e6f0ff" : "transparent",
//                 }}
//               >
//                 {highlightMatch(String(row[labelKey] ?? ""), searchText)}
//               </li>
//             ))
//           )}
//         </ul>
//       )}
//     </div>
//   );
// }

// /* ---------- Inline highlight helper ---------- */
// function highlightMatch(text, query) {
//   if (!query) return text;
//   const idx = text.toLowerCase().indexOf(query.toLowerCase());
//   if (idx === -1) return text;
//   return (
//     <>
//       {text.slice(0, idx)}
//       <strong style={{ color: "#0d47a1", backgroundColor: "#fff59d" }}>
//         {text.slice(idx, idx + query.length)}
//       </strong>
//       {text.slice(idx + query.length)}
//     </>
//   );
// }

// /* ---------- Backward-compatibility alias ---------- */
// export { DynamicSelect as CitySelect };


import React, { useEffect, useState, useRef, useMemo } from "react";
import axios from "axios";

export default function DynamicSelect({
  fetchUrl,
  apiEndpoint,
  apiLinks,
  organisation,
  locationNumber,
  value,
  initialCode,          // ⭐ NEW
  onChange,
  valueKey = "name",
  labelKey = "name",
  codeKey = "code",
  onCityCodeChange,
  onCodeChange,
  onKeyDown,
  placeholder = "Search or select...",
}) {
  const [options, setOptions] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const [highlightedIndex, setHighlightedIndex] = useState(-1);
  const [searchText, setSearchText] = useState("");

  const inputRef = useRef(null);
  const listRef = useRef(null);
  const blurTimeoutRef = useRef(null);
  const searchBufferRef = useRef("");
  const searchTimeoutRef = useRef(null);

  const resolvedUrl = useMemo(() => {
    if (fetchUrl) return fetchUrl;
    if (apiEndpoint && apiLinks) return apiLinks + apiEndpoint;
    return "";
  }, [fetchUrl, apiEndpoint, apiLinks]);

  useEffect(() => {
    if (!resolvedUrl) return;
    const formData = new URLSearchParams({
      code:
        (organisation && (organisation.code || organisation.organization)) ||
        "DEMOELEC",
      FLocCod: locationNumber || "001",
    }).toString();

    axios
      .post(resolvedUrl, formData)
      .then((response) => {
        let rows = response.data;
        if (typeof rows === "string") {
          try { rows = JSON.parse(rows); } catch (e) { rows = []; }
        }
        if (rows && !Array.isArray(rows) && typeof rows === "object") {
          const candidates = [rows.data, rows.rows, rows.result, rows.records, rows.list];
          const nested = candidates.find((c) => Array.isArray(c));
          rows = nested || [];
        }
        setOptions(Array.isArray(rows) ? rows : []);
      })
      .catch((error) => {
        console.error("DynamicSelect: fetch error:", error);
        setOptions([]);
      });
  }, [resolvedUrl, organisation, locationNumber]);

  // ⭐ Auto-select by initialCode: when code changes and options are loaded
  useEffect(() => {
    if (!initialCode) return;
    if (!options.length) return;

    const match = options.find(
      (row) => String(row[codeKey]) === String(initialCode)
    );

    if (match) {
      const desc = match[labelKey] !== undefined ? match[labelKey] : "";
      // Only call onChange if value doesn't already match desc
      if (String(value) !== String(desc)) {
        onChange(desc);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initialCode, options, codeKey, labelKey]);

  const filteredOptions = useMemo(() => {
    if (!searchText) return options;
    const q = searchText.toLowerCase();
    return options.filter((row) =>
      String(row[labelKey] ?? "").toLowerCase().includes(q)
    );
  }, [options, searchText, labelKey]);

  useEffect(() => {
    if (highlightedIndex >= filteredOptions.length) {
      setHighlightedIndex(filteredOptions.length > 0 ? 0 : -1);
    }
  }, [filteredOptions, highlightedIndex]);

  const openAndHighlightCurrent = () => {
    const idx = filteredOptions.findIndex(
      (row) => String(row[valueKey]) === String(value)
    );
    setHighlightedIndex(idx >= 0 ? idx : 0);
    setIsOpen(true);
  };

  const emitCode = (code) => {
    if (typeof onCityCodeChange === "function") onCityCodeChange(code);
    if (typeof onCodeChange === "function") onCodeChange(code);
  };

  const handleSelect = (row) => {
    if (!row) return;
    const desc = row[labelKey] !== undefined ? row[labelKey] : "";
    const code = row[codeKey] !== undefined ? row[codeKey] : "";
    onChange(desc);
    emitCode(code);
    setIsOpen(false);
    setSearchText("");
    resetSearchBuffer();
    setHighlightedIndex(-1);
  };

  const handleClear = (e) => {
    e.stopPropagation();
    onChange("");
    emitCode("");
    setIsOpen(false);
    setSearchText("");
    setHighlightedIndex(-1);
    resetSearchBuffer();
    if (inputRef.current) inputRef.current.focus();
  };

  useEffect(() => {
    if (!isOpen || highlightedIndex < 0 || !listRef.current) return;
    const el = listRef.current.querySelector(
      `[data-index="${highlightedIndex}"]`
    );
    if (el) el.scrollIntoView({ block: "nearest" });
  }, [highlightedIndex, isOpen]);

  const resetSearchBuffer = () => {
    searchBufferRef.current = "";
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
      searchTimeoutRef.current = null;
    }
  };

  const handleInputKeyDown = (e) => {
    if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "a") return;

    if (e.key === "Delete") {
      e.preventDefault();
      handleClear(e);
      return;
    }

    if (e.key === "Enter") {
      e.preventDefault();
      e.stopPropagation();
      if (isOpen && highlightedIndex >= 0 && filteredOptions[highlightedIndex]) {
        handleSelect(filteredOptions[highlightedIndex]);
      } else {
        setIsOpen(false);
        setSearchText("");
        resetSearchBuffer();
      }
      if (onKeyDown) onKeyDown(e);
      return;
    }

    if (e.key === "ArrowDown") {
      e.preventDefault();
      resetSearchBuffer();
      if (!isOpen) { openAndHighlightCurrent(); return; }
      setHighlightedIndex((prev) =>
        Math.min(prev + 1, filteredOptions.length - 1)
      );
      return;
    }

    if (e.key === "ArrowUp") {
      e.preventDefault();
      resetSearchBuffer();
      if (!isOpen) { openAndHighlightCurrent(); return; }
      setHighlightedIndex((prev) => Math.max(prev - 1, 0));
      return;
    }

    if (e.key === "Escape") {
      e.preventDefault();
      if (searchText) {
        setSearchText("");
        resetSearchBuffer();
        setHighlightedIndex(0);
      } else {
        setIsOpen(false);
        resetSearchBuffer();
      }
      return;
    }

    if (e.key === " ") {
      e.preventDefault();
      if (!isOpen) openAndHighlightCurrent();
      return;
    }

    if (e.key === "Backspace") {
      e.preventDefault();
      if (searchText) {
        const newText = searchText.slice(0, -1);
        setSearchText(newText);
        searchBufferRef.current = newText.toLowerCase();
        if (!isOpen) setIsOpen(true);
        setHighlightedIndex(0);
      }
      return;
    }

    if (e.key.length === 1 && /[a-zA-Z0-9]/.test(e.key)) {
      e.preventDefault();
      if (searchTimeoutRef.current) clearTimeout(searchTimeoutRef.current);
      const newText = (searchText + e.key).toUpperCase();
      setSearchText(newText);
      searchBufferRef.current = newText.toLowerCase();
      setIsOpen(true);
      setHighlightedIndex(0);
    }
  };

  const handleBlur = () => {
    blurTimeoutRef.current = setTimeout(() => {
      setIsOpen(false);
      setSearchText("");
      resetSearchBuffer();
    }, 150);
  };

  const handleFocus = () => {
    if (blurTimeoutRef.current) clearTimeout(blurTimeoutRef.current);
  };

  useEffect(() => {
    return () => {
      if (blurTimeoutRef.current) clearTimeout(blurTimeoutRef.current);
      if (searchTimeoutRef.current) clearTimeout(searchTimeoutRef.current);
    };
  }, []);

  const displayValue = searchText ? searchText : value || "";

  return (
    <div className="dynamic-select-wrapper">
      <div className="dynamic-select-inner">
        <input
          ref={inputRef}
          type="text"
          readOnly
          className="city-select-dropdown"
          value={displayValue}
          onClick={() => {
            if (isOpen) setIsOpen(false);
            else openAndHighlightCurrent();
          }}
          onKeyDown={handleInputKeyDown}
          onBlur={handleBlur}
          onFocus={handleFocus}
          placeholder={placeholder}
          style={{
            fontStyle: "normal",
            color: searchText ? "#444" : "inherit",
            textTransform: searchText ? "uppercase" : "none",
          }}
        />

        {(value || searchText) && (
          <button
            type="button"
            className="dynamic-select-clear"
            onClick={handleClear}
            aria-label="Clear selection"
          >
            ×
          </button>
        )}
      </div>

      {isOpen && (
        <ul ref={listRef} role="listbox" className="dynamic-select-list">
          {filteredOptions.length === 0 ? (
            <li
              style={{
                padding: "6px 8px",
                fontSize: "12px",
                color: "#999",
                textAlign: "center",
              }}
            >
              No options found
            </li>
          ) : (
            filteredOptions.map((row, index) => (
              <li
                key={row.id || row[codeKey] || index}
                data-index={index}
                role="option"
                aria-selected={index === highlightedIndex}
                onMouseDown={(e) => e.preventDefault()}
                onMouseEnter={() => setHighlightedIndex(index)}
                onClick={() => handleSelect(row)}
                style={{
                  padding: "2px 8px",
                  fontSize: "12px",
                  cursor: "pointer",
                  background:
                    index === highlightedIndex ? "#e6f0ff" : "transparent",
                }}
              >
                {highlightMatch(String(row[labelKey] ?? ""), searchText)}
              </li>
            ))
          )}
        </ul>
      )}
    </div>
  );
}

function highlightMatch(text, query) {
  if (!query) return text;
  const idx = text.toLowerCase().indexOf(query.toLowerCase());
  if (idx === -1) return text;
  return (
    <>
      {text.slice(0, idx)}
      <strong style={{ color: "#0d47a1", backgroundColor: "#fff59d" }}>
        {text.slice(idx, idx + query.length)}
      </strong>
      {text.slice(idx + query.length)}
    </>
  );
}

export { DynamicSelect as CitySelect };