import React, {
  useState,
  useEffect,
  useImperativeHandle,
  forwardRef,
} from "react";
import PropTypes from "prop-types";
import "./Dropdown.css";
import axios from "axios";
import { Autocomplete, TextField, createFilterOptions } from "@mui/material";
import { isLoggedIn, getUserData } from "../../Auth";

const filterOptions = createFilterOptions();

const CustomDropdown = forwardRef(
  (
    {
      value,
      onChange,
      fetchUrl,
      valueKey,
      labelKey,
      placeholder,
      isClearable = false,
      styles = {},
      onKeyDown,
      width,
      postapi,
      postfisrt,
      postsecond,
      postthird,
      postfouth,
      selectRef,
      className,
    },
    ref // This is the forwarded ref from the parent component
  ) => {
    const [options, setOptions] = useState([]);
    const [selectedOption, setSelectedOption] = useState(
      "Select and Search option"
    );
    const [enterPressCount, setEnterPressCount] = useState(0); // Track Enter key presses
    const user = getUserData();
    function fetchData() {
      const data = {
        FPrjId: user?.tprjid, // Ensure that tprjid exists
      };

      const formData = new URLSearchParams(data).toString();

      axios
        .post(fetchUrl, formData, {
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
          },
        })
        .then((response) => {
          // No need to await response.json(), axios already handles it
          const apiData = response.data; // This will give you the data
          console.log("Dropdown data fetched successfully.", apiData);

          // Formatting options
          const formattedOptions = apiData.map((option) => ({
            value: option[valueKey],
            label: option[labelKey],
          }));

          setOptions(formattedOptions);

          // Set the selected option if it matches the current value
          const matchingOption = formattedOptions.find(
            (option) => option.value === value
          );
          if (matchingOption) {
            setSelectedOption(matchingOption);
          }

          if (response.status === 200) {
            // Success handling (optional)
          } else {
            // Error handling (optional)
          }
        })
        .catch((error) => {
          console.error("Error:", error);
        });
    }

    useEffect(() => {
      fetchData();
    }, [fetchUrl, valueKey, labelKey, value, user?.tprjid]); // Add user?.tprjid as a dependency

    useImperativeHandle(ref, () => ({
      focus: () => {
        if (selectRef?.current) {
          selectRef.current.focus();
        }
      },
      reset: () => {
        setSelectedOption(null);
        onChange(null);
      },
    }));

    const handleSelectChange = (event, newValue) => {
      setEnterPressCount(0); // Reset the counter when an option is selected
      if (newValue) {
        if (newValue.inputValue) {
          handleSaveReference({
            label: newValue.inputValue,
            value: newValue.inputValue,
          });
        } else {
          setSelectedOption(newValue);
          // onChange(newValue.value);
          onChange(newValue); // Pass the entire newValue object (contains both value and label)
        }
      } else {
        setSelectedOption(null);
        onChange(null);
      }
    };

    const handleSaveReference = async (customOption) => {
      if (!customOption.label || customOption.label.trim() === "") {
        alert("Please provide a valid option.");
        return;
      }

      try {
        const formData = new FormData();
        formData.append(postfisrt, "999");
        formData.append(postsecond, customOption.label);
        formData.append(postthird, "A");
        formData.append(postfouth, user.tprjid);

        const response = await axios.post(postapi, formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });

        if (response.data.error === 200) {
          await fetchData();
        } else {
          console.error("API Error:", response.data.message);
        }
      } catch (error) {
        console.error("Error submitting form:", error);
      }
    };

    const customStyles = {
      menu: {
        fontSize: "12px",
        overflowY: "auto",
      },
      control: {
        backgroundColor: "#F8F8F8",
        height: "20px",
        marginLeft: "-10px",
        paddingLeft: "10px",
        alignItems: "center",
        width: width,
        fontSize: "11px",
        marginBottom: "2px",
        borderRadius: 0,
        border: className ? "1px solid red" : "1px solid #999999",
        transition: "border-color 0.15s ease-in-out",
        "&:hover": {
          borderColor: "rgb(79, 79, 255)",
        },
      },
      input: {
        height: "100%",
        fontSize: "11px",
        padding: "0px",
        backgroundColor: "white",
        alignItems: "center",
        borderRadius: "4px",
        border: "1px solid #cccccc",
        "&:hover": {
          borderColor: "rgb(79, 79, 255)",
        },
      },
      dropdownIndicator: {
        padding: "5px",
      },
      ...styles,
    };

    return (
      <Autocomplete
        value={selectedOption}
        onChange={handleSelectChange}
        filterOptions={(options, params) => {
          const filtered = filterOptions(options, params);
          const { inputValue } = params;
          const isExisting = options.some(
            (option) => inputValue === option.label
          );

          if (inputValue !== "" && !isExisting) {
            filtered.push({
              inputValue,
              label: `Add "${inputValue}"`,
            });
          }
          return filtered;
        }}
        onFocus={(e) => e.target.select()} // Select the input value when the field gains focus
        selectOnFocus
        clearOnBlur
        handleHomeEndKeys
        options={options}
        isOptionEqualToValue={(option, value) => option.value === value?.value} // Custom equality check
        getOptionLabel={(option) => {
          if (typeof option === "string") return option;
          if (option.inputValue) return option.inputValue;
          return option.label;
        }}
        renderOption={(props, option) => (
          <li {...props} style={customStyles.menu}>
            {option.label}
          </li>
        )}
        renderInput={(params) => (
          <TextField
            {...params}
            inputRef={selectRef} // Apply ref to the input field
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                if (enterPressCount === 0) {
                  setEnterPressCount(1);
                } else if (enterPressCount === 1) {
                  onKeyDown(e);
                  setEnterPressCount(0);
                }
              }
            }}
            onChange={(e) => {
              const uppercaseValue = e.target.value.toUpperCase();
              e.target.value = uppercaseValue;
              params.inputProps.onChange(e);
            }}
            InputProps={{
              ...params.InputProps,
              style: customStyles.control,
            }}
          />
        )}
      />
    );
  }
);

CustomDropdown.propTypes = {
  value: PropTypes.any,
  onChange: PropTypes.func.isRequired,
  fetchUrl: PropTypes.string.isRequired,
  valueKey: PropTypes.string,
  labelKey: PropTypes.string,
  placeholder: PropTypes.string,
  isClearable: PropTypes.bool,
  styles: PropTypes.object,
  onKeyDown: PropTypes.func,
  width: PropTypes.string,
  postapi: PropTypes.string,
  postfisrt: PropTypes.string,
  postsecond: PropTypes.string,
  postthird: PropTypes.string,
  postfouth: PropTypes.string,
  selectRef: PropTypes.object, // Ensure this is a ref object
  className: PropTypes.string,
};

export default CustomDropdown;
