import React, { useEffect, useState, useRef } from "react";
import axios from "axios";

export default function CitySelect({
  apiEndpoint,
  apiLinks,
  organisation,
  locationNumber,
  value,
  onChange,
  valueKey = "tctydsc",
  labelKey = "tctydsc",
  codeKey = "tctycod",
  onCityCodeChange,
  onKeyDown,
}) {
  const [cityOptions, setCityOptions] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const [highlightedIndex, setHighlightedIndex] = useState(-1);
  const inputRef = useRef(null);
  const listRef = useRef(null);
  const blurTimeoutRef = useRef(null);
  const searchBufferRef = useRef("");
  const searchTimeoutRef = useRef(null);

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
          console.warn(
            "Response data structure is not as expected:",
            response.data
          );
          setCityOptions([]);
        }
      })
      .catch((error) => {
        console.error("Error fetching cities:", error);
        setCityOptions([]);
      });
  }, [organisation, apiLinks, apiEndpoint, locationNumber]);

  // Keep highlighted index pointed at the current value whenever the list opens
  const openAndHighlightCurrent = () => {
    const idx = cityOptions.findIndex((city) => city[valueKey] === value);
    setHighlightedIndex(idx >= 0 ? idx : 0);
    setIsOpen(true);
  };

  // Selecting a city via mouse click - same logic/behavior as before
  const handleSelect = (city) => {
    const selectedValue = city[valueKey];
    onChange(selectedValue);
    if (city && city[codeKey] !== undefined) {
      onCityCodeChange(city[codeKey]);
    } else {
      onCityCodeChange("");
    }
    setIsOpen(false);
  };

  // Scroll the highlighted option into view
  useEffect(() => {
    if (!isOpen || highlightedIndex < 0 || !listRef.current) return;
    const el = listRef.current.querySelector(
      `[data-index="${highlightedIndex}"]`
    );
    if (el) {
      el.scrollIntoView({ block: "nearest" });
    }
  }, [highlightedIndex, isOpen]);

  const resetSearchBuffer = () => {
    searchBufferRef.current = "";
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
      searchTimeoutRef.current = null;
    }
  };

  const handleInputKeyDown = (e) => {
    if (e.key === "Enter") {
      // Select the highlighted option (if any), then move to next field (NIC).
      e.preventDefault();
      e.stopPropagation();
      if (isOpen && highlightedIndex >= 0 && cityOptions[highlightedIndex]) {
        handleSelect(cityOptions[highlightedIndex]);
      }
      setIsOpen(false);
      resetSearchBuffer();
      if (onKeyDown) onKeyDown(e);
      return;
    }

    if (e.key === "ArrowDown") {
      e.preventDefault();
      resetSearchBuffer();
      if (!isOpen) {
        openAndHighlightCurrent();
        return;
      }
      setHighlightedIndex((prev) =>
        Math.min(prev + 1, cityOptions.length - 1)
      );
      return;
    }

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

    if (e.key === "Escape") {
      setIsOpen(false);
      resetSearchBuffer();
      return;
    }

    if (e.key === " ") {
      // Space opens the list (like native select) instead of doing nothing.
      e.preventDefault();
      if (!isOpen) openAndHighlightCurrent();
      return;
    }

    // Typeahead search - typing letters/numbers jumps to a matching city,
    // same as native <select> search behavior.
    if (e.key.length === 1 && /[a-zA-Z0-9]/.test(e.key)) {
      searchBufferRef.current += e.key.toLowerCase();
      if (searchTimeoutRef.current) clearTimeout(searchTimeoutRef.current);
      searchTimeoutRef.current = setTimeout(resetSearchBuffer, 600);

      const query = searchBufferRef.current;
      const matchIndex = cityOptions.findIndex((city) =>
        String(city[labelKey] || "")
          .toLowerCase()
          .startsWith(query)
      );

      if (matchIndex >= 0) {
        setHighlightedIndex(matchIndex);
        if (!isOpen) setIsOpen(true);
      }
    }
  };

  const handleBlur = () => {
    // Delay closing so a click on an option registers first
    blurTimeoutRef.current = setTimeout(() => {
      setIsOpen(false);
      resetSearchBuffer();
    }, 150);
  };

  const handleFocus = () => {
    if (blurTimeoutRef.current) {
      clearTimeout(blurTimeoutRef.current);
    }
  };

  useEffect(() => {
    return () => {
      if (blurTimeoutRef.current) clearTimeout(blurTimeoutRef.current);
      if (searchTimeoutRef.current) clearTimeout(searchTimeoutRef.current);
    };
  }, []);

  return (
    <div style={{ position: "relative" }}>
      <input
        ref={inputRef}
        type="text"
        readOnly
        className="city-select-dropdown fixed-width-field"
        value={value || ""}
        onClick={() => {
          if (isOpen) {
            setIsOpen(false);
          } else {
            openAndHighlightCurrent();
          }
        }}
        onKeyDown={handleInputKeyDown}
        onBlur={handleBlur}
        onFocus={handleFocus}
      />

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
          }}
        >
          {cityOptions.map((city, index) => (
            <li
              key={city.id}
              data-index={index}
              role="option"
              aria-selected={index === highlightedIndex}
              onMouseDown={(e) => e.preventDefault()} // keep input focus until click completes
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
              {city[labelKey]}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}