import React from "react";
import { useTheme } from "../../../../ThemeContext";

const QuikLinks = ({ isOpen }) => {
  const { getcolor, fontcolor, setcolor, setfontcolor } = useTheme(); // Use the theme context

  console.log("menu open");
  if (!isOpen) return null;

  return (
    <div
      className="menu"
      style={{
        position: "absolute",
        top: "60px",
        left: "18%",
        width: "650px",
        backgroundColor: getcolor,
        color: fontcolor,
        padding: "20px",
        borderRadius: "10px",
        boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)",
        zIndex: 9999,
      }}
    >
      <div
        className="menu-section"
        style={{
          display: "flex",
          justifyContent: "space-between",
        }}
      >
        <div className="menu-applications" style={{ width: "60%" }}>
          <ul style={{ listStyle: "none", padding: 0 }}>
            <li style={{ marginBottom: "15px" }}>
              <div
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                }}
              >
                <div
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    justifyContent: "center",
                    width: "40px",
                    height: "40px",
                    borderRadius: "50%",
                    backgroundColor: "rgba(255, 0, 0, 0.5)",
                    color: "#fff",
                    marginRight: "10px", // Add margin to space out from text
                  }}
                >
                  <span
                    style={{
                      fontSize: "16px",
                      color: "#ADB7C1",
                    }}
                  >
                    💬
                  </span>
                </div>
                <div style={{ display: "flex", flexDirection: "column" }}>
                  <strong
                    style={{
                      color: "#d4d2d2",
                      fontSize: "14px",
                    }}
                  >
                    Chat Application
                  </strong>
                  <span
                    style={{
                      fontSize: "12px",
                      color: "#7fbef3",
                    }}
                  >
                    New messages arrived
                  </span>
                </div>
              </div>
            </li>

            <li style={{ marginBottom: "15px" }}>
              <div
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                }}
              >
                <div
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    justifyContent: "center",
                    width: "40px",
                    height: "40px",
                    borderRadius: "50%",
                    backgroundColor: "rgba(96, 154, 247, 0.5)",
                    color: "#fff",
                    marginRight: "10px", // Add margin to space out from text
                  }}
                >
                  <span
                    style={{
                      fontSize: "16px",
                      color: "#ADB7C1",
                    }}
                  >
                    📝
                  </span>
                </div>
                <div style={{ display: "flex", flexDirection: "column" }}>
                  <strong
                    style={{
                      color: "#d4d2d2",
                      fontSize: "14px",
                    }}
                  >
                    Notes App
                  </strong>
                  <span
                    style={{
                      fontSize: "12px",
                      color: "#7fbef3",
                    }}
                  >
                    Get latest invoice
                  </span>
                </div>
              </div>
            </li>

            <li style={{ marginBottom: "15px" }}>
              <div
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                }}
              >
                <div
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    justifyContent: "center",
                    width: "40px",
                    height: "40px",
                    borderRadius: "50%",
                    backgroundColor: "rgba(30, 186, 2, 0.5)",
                    color: "#fff",
                    marginRight: "10px", // Add margin to space out from text
                  }}
                >
                  <span
                    style={{
                      fontSize: "16px",
                      color: "#ADB7C1",
                    }}
                  >
                    📇
                  </span>
                </div>
                <div style={{ display: "flex", flexDirection: "column" }}>
                  <strong
                    style={{
                      color: "#d4d2d2",
                      fontSize: "14px",
                    }}
                  >
                    Contact Application
                  </strong>
                  <span
                    style={{
                      fontSize: "12px",
                      color: "#7fbef3",
                    }}
                  >
                    2 Unsaved Contacts
                  </span>
                </div>
              </div>
            </li>

            <li style={{ marginBottom: "15px" }}>
              <div
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                }}
              >
                <div
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    justifyContent: "center",
                    width: "40px",
                    height: "40px",
                    borderRadius: "50%",
                    backgroundColor: "rgba(161, 49, 14, 0.5)",
                    color: "#fff",
                    marginRight: "10px", // Add margin to space out from text
                  }}
                >
                  <span
                    style={{
                      fontSize: "16px",
                      color: "#ADB7C1",
                    }}
                  >
                    📧
                  </span>
                </div>
                <div style={{ display: "flex", flexDirection: "column" }}>
                  <strong
                    style={{
                      color: "#d4d2d2",
                      fontSize: "14px",
                    }}
                  >
                    Email Application
                  </strong>
                  <span
                    style={{
                      fontSize: "12px",
                      color: "#7fbef3",
                    }}
                  >
                    2 unread messages
                  </span>
                </div>
              </div>
            </li>
          </ul>
        </div>
        <div className="menu-applications" style={{ width: "60%" }}>
          <ul style={{ listStyle: "none", padding: 0 }}>
            <li style={{ marginBottom: "15px" }}>
              <div
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                }}
              >
                <div
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    justifyContent: "center",
                    width: "40px",
                    height: "40px",
                    borderRadius: "50%",
                    backgroundColor: "rgba(184, 147, 17, 0.5)",
                    color: "#fff",
                    marginRight: "10px", // Add margin to space out from text
                  }}
                >
                  <span
                    style={{
                      fontSize: "16px",
                      color: "#ADB7C1",
                    }}
                  >
                    📅
                  </span>
                </div>
                <div style={{ display: "flex", flexDirection: "column" }}>
                  <strong
                    style={{
                      color: "#d4d2d2",
                      fontSize: "14px",
                    }}
                  >
                    Calendar App
                  </strong>
                  <span
                    style={{
                      fontSize: "12px",
                      color: "#7fbef3",
                    }}
                  >
                    Get dates
                  </span>
                </div>
              </div>
            </li>

            <li style={{ marginBottom: "15px" }}>
              <div
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                }}
              >
                <div
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    justifyContent: "center",
                    width: "40px",
                    height: "40px",
                    borderRadius: "50%",
                    backgroundColor: "rgba(164, 222, 29, 0.5)",
                    color: "#fff",
                    marginRight: "10px", // Add margin to space out from text
                  }}
                >
                  <span
                    style={{
                      fontSize: "16px",
                      color: "#ADB7C1",
                    }}
                  >
                    🎟️
                  </span>
                </div>
                <div style={{ display: "flex", flexDirection: "column" }}>
                  <strong
                    style={{
                      color: "#d4d2d2",
                      fontSize: "14px",
                    }}
                  >
                    Ticket Application
                  </strong>
                  <span
                    style={{
                      fontSize: "12px",
                      color: "#7fbef3",
                    }}
                  >
                    Get new tickets
                  </span>
                </div>
              </div>
            </li>

            <li style={{ marginBottom: "15px" }}>
              <div
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                }}
              >
                <div
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    justifyContent: "center",
                    width: "40px",
                    height: "40px",
                    borderRadius: "50%",
                    backgroundColor: "rgba(25, 240, 22, 0.5)",
                    color: "#fff",
                    marginRight: "10px", // Add margin to space out from text
                  }}
                >
                  <span
                    style={{
                      fontSize: "16px",
                      color: "#ADB7C1",
                    }}
                  >
                    🛒
                  </span>
                </div>
                <div style={{ display: "flex", flexDirection: "column" }}>
                  <strong
                    style={{
                      color: "#d4d2d2",
                      fontSize: "14px",
                    }}
                  >
                    eCommerce
                  </strong>
                  <span
                    style={{
                      fontSize: "12px",
                      color: "#7fbef3",
                    }}
                  >
                    Buy more products
                  </span>
                </div>
              </div>
            </li>
          </ul>
        </div>
        {/* Right Section: Quick Links */}
        <div className="menu-quick-links" style={{ width: "35%" }}>
          <strong
            style={{
              color: "white",
              fontSize: "16px",
            }}
          >
            Quick Links
          </strong>
          <ul style={{ listStyle: "none", padding: 0 }}>
            <br />
            {[
              "Pricing Page",
              "Authentication",
              "Register Now",
              "404 Error Page",
              "Notes App",
              "User Application",
              "Account Settings",
            ].map((linkText) => (
              <li
                key={linkText}
                style={{
                  marginBottom: "15px",
                  fontSize: "14px",
                  cursor: "pointer",
                  color: "#b0c8e4",
                  transition: "color 0.3s ease",
                }}
                onMouseEnter={(e) => (e.target.style.color = "#ffffff")}
                onMouseLeave={(e) => (e.target.style.color = "#b0c8e4")}
              >
                {linkText}
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Bottom "Check" Button */}
      <button
        style={{
          backgroundColor: "#0090e7",
          border: "none",
          color: "white",
          padding: "10px 20px",
          borderRadius: "20px",
          cursor: "pointer",
          marginTop: "20px",
          display: "block",
          width: "100px",
          transition: "background-color 0.3s ease",
        }}
        onMouseEnter={(e) => (e.target.style.backgroundColor = "#007bb5")}
        onMouseLeave={(e) => (e.target.style.backgroundColor = "#0090e7")}
      >
        Check
      </button>
    </div>
  );
};

export default QuikLinks;
