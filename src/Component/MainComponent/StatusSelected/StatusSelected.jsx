import React from "react";
import { Form } from "react-bootstrap"; // Import if using react-bootstrap

const StatusSelect = ({
  formData,
  handleInputChange,
  errors,
  handleEnterKeyPress,
  StatusRef,
}) => {
  return (
    <Form.Control
      as="select"
      name="Status"
      value={formData.Status}
      onChange={handleInputChange}
      className={`form-control-account ${errors.Status ? "border-red" : ""}`}
      style={{
        height: "28px",
        fontSize: "11px",
        padding: "0px",
        paddingLeft: "5px",
      }}
      onKeyDown={(e) => handleEnterKeyPress(e)}
      ref={StatusRef}
    >
      <option value="A">Active</option>
      <option value="N">Non Active</option>
    </Form.Control>
  );
};

export default StatusSelect;
