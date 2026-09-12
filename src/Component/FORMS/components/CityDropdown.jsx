import React, { useEffect, useState, useRef, useMemo } from "react";
import axios from "axios";

/**
 * DynamicSelect
 * -------------
 * Reusable searchable dropdown.
 * Previously named CitySelect — all existing behavior is preserved.
 * Can be used for City, Area, or any other list-based dropdown
 * by passing different apiEndpoint + valueKey/labelKey/codeKey.
 */
export default function DynamicSelect({
  apiEndpoint,
  apiLinks,
  organisation,
  locationNumber,
  value,
  onChange,
  valueKey = "tctydsc",
  labelKey = "tctydsc",
  codeKey = "tctycod",
  onCityCodeChange,       // kept — City still uses this
  onCodeChange,           // new — generic alias (Area uses this)
  onKeyDown,
  placeholder = "Please Select City",
}) {
  const [cityOptions, setCityOptions] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const [highlightedIndex, setHighlightedIndex] = useState(-1);
  const [searchText, setSearchText] = useState(""); // 🆕 visible search buffer

  const inputRef = useRef(null);
  const listRef = useRef(null);
  const blurTimeoutRef = useRef(null);
  const searchBufferRef = useRef("");
  const searchTimeoutRef = useRef(null);

  // ---------- Fetch options ----------
  useEffect(() => {
    if (!organisation) return;
    const apiUrl = apiLinks + apiEndpoint;
    const formData = new URLSearchParams({
      code: organisation.code,
      FLocCod: locationNumber,
    }).toString();
    axios
      .post(apiUrl, formData)
      .then((response) => {
        if (response.data && Array.isArray(response.data)) {
          setCityOptions(response.data);
        } else {
          console.warn("Response data structure is not as expected:", response.data);
          setCityOptions([]);
        }
      })
      .catch((error) => {
        console.error("Error fetching options:", error);
        setCityOptions([]);
      });
  }, [organisation, apiLinks, apiEndpoint, locationNumber]);

  // ---------- Filtered list based on search text ----------
  const filteredOptions = useMemo(() => {
    if (!searchText) return cityOptions;
    const q = searchText.toLowerCase();
    return cityOptions.filter((city) =>
      String(city[labelKey] || "").toLowerCase().includes(q)
    );
  }, [cityOptions, searchText, labelKey]);

  // Reset highlight if it goes out of filtered range
  useEffect(() => {
    if (highlightedIndex >= filteredOptions.length) {
      setHighlightedIndex(filteredOptions.length > 0 ? 0 : -1);
    }
  }, [filteredOptions, highlightedIndex]);

  // ---------- Helpers ----------
  const openAndHighlightCurrent = () => {
    const idx = filteredOptions.findIndex((city) => city[valueKey] === value);
    setHighlightedIndex(idx >= 0 ? idx : 0);
    setIsOpen(true);
  };

  // Fire both code callbacks — City uses onCityCodeChange, Area uses onCodeChange
  const emitCode = (code) => {
    if (typeof onCityCodeChange === "function") onCityCodeChange(code);
    if (typeof onCodeChange === "function") onCodeChange(code);
  };

  const handleSelect = (city) => {
    if (!city) return;
    onChange(city[valueKey]);
    emitCode(city[codeKey] !== undefined ? city[codeKey] : "");
    setIsOpen(false);
    setSearchText("");           // clear search
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

  // Scroll highlighted option into view
  useEffect(() => {
    if (!isOpen || highlightedIndex < 0 || !listRef.current) return;
    const el = listRef.current.querySelector(`[data-index="${highlightedIndex}"]`);
    if (el) el.scrollIntoView({ block: "nearest" });
  }, [highlightedIndex, isOpen]);

  const resetSearchBuffer = () => {
    searchBufferRef.current = "";
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
      searchTimeoutRef.current = null;
    }
  };

  // ---------- Keyboard handling ----------
  const handleInputKeyDown = (e) => {
    // ---- Ctrl + A (allow default browser select-all) ----
    if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "a") {
      // Do NOT preventDefault – let the browser select all text
      return;
    }

    // ---- Delete (clear all typed text/value like the cross button) ----
    if (e.key === "Delete") {
      e.preventDefault();
      handleClear(e);
      return;
    }

    // ---- Enter ----
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

    // ---- ArrowDown ----
    if (e.key === "ArrowDown") {
      e.preventDefault();
      resetSearchBuffer();
      if (!isOpen) {
        openAndHighlightCurrent();
        return;
      }
      setHighlightedIndex((prev) =>
        Math.min(prev + 1, filteredOptions.length - 1)
      );
      return;
    }

    // ---- ArrowUp ----
    if (e.key === "ArrowUp") {
      e.preventDefault();
      resetSearchBuffer();
      if (!isOpen) {
        openAndHighlightCurrent();
        return;
      }
      setHighlightedIndex((prev) => Math.max(prev - 1, 0));
      return;
    }

    // ---- Escape ----
    if (e.key === "Escape") {
      e.preventDefault();
      if (searchText) {
        // First Escape clears search but keeps dropdown open
        setSearchText("");
        resetSearchBuffer();
        setHighlightedIndex(0);
      } else {
        setIsOpen(false);
        resetSearchBuffer();
      }
      return;
    }

    // ---- Space (open list, don't add to search) ----
    if (e.key === " ") {
      e.preventDefault();
      if (!isOpen) openAndHighlightCurrent();
      return;
    }

    // ---- Backspace ----
    if (e.key === "Backspace") {
      e.preventDefault();
      if (searchText) {
        const newText = searchText.slice(0, -1);
        setSearchText(newText);
        // Rebuild buffer to match
        searchBufferRef.current = newText.toLowerCase();
        if (!isOpen) setIsOpen(true);
        // Reset highlight to top of new filtered list
        setHighlightedIndex(0);
      }
      return;
    }

    // ---- Typing (letters/numbers) ----
    if (e.key.length === 1 && /[a-zA-Z0-9]/.test(e.key)) {
      e.preventDefault();

      // Reset buffer when user types faster than timeout would clear it
      if (searchTimeoutRef.current) clearTimeout(searchTimeoutRef.current);

      // ✅ Force uppercase for displayed text
      const newText = (searchText + e.key).toUpperCase();
      setSearchText(newText);
      searchBufferRef.current = newText.toLowerCase(); // buffer lowercase for filtering
      setIsOpen(true);
      setHighlightedIndex(0); // highlight first filtered match

      // ❌ REMOVED auto-clear timeout – typed text stays until user clears or selects
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

  // ---------- What to display in input ----------
  const displayValue = searchText ? searchText : value || "";

  return (
    <div style={{ position: "relative", display: "inline-block" }}>
      <div style={{ position: "relative", display: "inline-block" }}>
        <input
          ref={inputRef}
          type="text"
          readOnly
          className="city-select-dropdown fixed-width-field"
          value={displayValue}                 /* 🆕 shows typed search text */
          onClick={() => {
            if (isOpen) setIsOpen(false);
            else openAndHighlightCurrent();
          }}
          onKeyDown={handleInputKeyDown}
          onBlur={handleBlur}
          onFocus={handleFocus}
          placeholder={placeholder}
          style={{
            paddingRight: displayValue ? "20px" : "8px",
            fontStyle: "normal",   // ✅ Always normal/roman – never italic
            color: searchText ? "#444" : "inherit",
            textTransform: searchText ? "uppercase" : "none", // ✅ display typed text uppercase
          }}
        />

        {/* Clear (×) icon */}
        {(value || searchText) && (
          <button
            type="button"
            onClick={handleClear}
            style={{
              position: "absolute",
              right: "4px",
              top: "50%",
              transform: "translateY(-50%)",
              background: "none",
              border: "none",
              cursor: "pointer",
              fontSize: "14px",
              color: "#999",
              padding: "2px 4px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              lineHeight: "1",
              borderRadius: "50%",
              transition: "all 0.15s ease",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.color = "#333";
              e.currentTarget.style.backgroundColor = "#f0f0f0";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.color = "#999";
              e.currentTarget.style.backgroundColor = "transparent";
            }}
            aria-label="Clear selection"
          >
            ×
          </button>
        )}
      </div>

      {isOpen && (
        <ul
          ref={listRef}
          role="listbox"
          style={{
            position: "absolute",
            top: "100%",
            left: 0,
            right: 0,
            marginTop: 2,
            maxHeight: 160,
            overflowY: "auto",
            background: "#fff",
            border: "1px solid #ccc",
            borderRadius: 4,
            boxShadow: "0 4px 10px rgba(0,0,0,0.12)",
            zIndex: 1000,
            listStyle: "none",
            padding: 0,
            minWidth: "100%",
          }}
        >
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
            filteredOptions.map((city, index) => (
              <li
                key={city.id || city[codeKey] || index}
                data-index={index}
                role="option"
                aria-selected={index === highlightedIndex}
                onMouseDown={(e) => e.preventDefault()}
                onMouseEnter={() => setHighlightedIndex(index)}
                onClick={() => handleSelect(city)}
                style={{
                  padding: "2px 8px",
                  fontSize: "12px",
                  cursor: "pointer",
                  background:
                    index === highlightedIndex ? "#e6f0ff" : "transparent",
                }}
              >
                {/* Highlight matching part of the text */}
                {highlightMatch(String(city[labelKey] || ""), searchText)}
              </li>
            ))
          )}
        </ul>
      )}
    </div>
  );
}

/* ---------- Inline highlight helper ---------- */
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

/* ---------- Backward-compatibility alias ----------
 * Any existing file that still does
 *   `import CitySelect from "./components/CityDropdown"`
 * keeps working without modification.
 */
export { DynamicSelect as CitySelect };