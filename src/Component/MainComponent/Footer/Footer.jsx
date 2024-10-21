import React from "react";
import "../Footer/Footer.css";

function Footer() {
  return (
    <footer
      className="fixed-bottom  "
      style={{
        backgroundColor: "#021a33",
        borderTop: "1px solid gray",
        zIndex: 9999,
      }}
    >
      <div className="footer" style={{ color: "white" }}>
        <a className="text-light " href="">
          Privacy Policy
        </a>{" "}
        |{" "}
        <a className="text-light" href="">
          Terms of Use
        </a>{" "}
        | © 2024 Crystal Solution. All rights reserved.
      </div>
    </footer>
  );
}

export default Footer;
