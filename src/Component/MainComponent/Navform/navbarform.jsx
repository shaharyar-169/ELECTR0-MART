import React from "react";
import { Nav } from "react-bootstrap";

const NavComponent = ({ textdata }) => {
  return (
    <Nav
      className="col-12 d-flex justify-content-between"
      style={{
        borderRadius: "10px 10px 0 0",
        backgroundColor: "#3368b5",
        color: "#fff",
        height: "24px",
      }}
    >
      <div style={{ fontSize: "14px", fontWeight:'bold' }} className="col-12 text-center">
        {textdata}
      </div>
    </Nav>
  );
};

export default NavComponent;
