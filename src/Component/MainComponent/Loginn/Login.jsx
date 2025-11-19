import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../Loginn/Login.css";
import Crystal from "../../../image/logowithname.jpeg";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import Alert from "@mui/material/Alert";
import { useTheme } from "../../../ThemeContext";
import Key from "../../../image/keys.png";
import { Link } from "react-router-dom";
import Crystall from "../../../image/logowithname.jpeg";
import logocrystal from "../../../image/logo.png";

function Loginn() {
  const navigate = useNavigate();
  const [alertData, setAlertData] = useState(null);
  const { primaryColor, secondaryColor, apiLinks } = useTheme();
  const [userData, setUserData] = useState({
    userid: "",
    password: "",
    loading: false,
  });

  const userid = useRef();
  const password = useRef();
  const Code = useRef();

  const [isSignUp, setIsSignUp] = useState(false);

  function UserLogin(e) {
    // Prevent form's default behavior of reloading the page
    e.preventDefault();

    const data = {
      userid: userid.current.value,
      password: password.current.value,
      code: Code.current.value,
    };

    const formData = new URLSearchParams(data).toString();

    axios
      .post(`https://crystalsolutions.com.pk/api/login.php`, formData, {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
      })
      .then((response) => {
        console.log(response, "response");

        if (response.data.error === 200) {
          setAlertData({
            type: "success",
            message: `${response.data.message}`,
          });

          localStorage.setItem("isLoggedIn", "true");
          localStorage.setItem("user", JSON.stringify(response.data.user));
          localStorage.setItem(
            "organisation",
            JSON.stringify(response.data.organisation)
          );

          setTimeout(() => {
            navigate("/MainPage");
            setAlertData(null);
          }, 1000);
        } else {
          console.log(response.data.message);

          // Show error message
          setAlertData({
            type: "error",
            message: `${response.data.message}`,
          });

          // Clear the alert after 2 seconds
          setTimeout(() => {
            setAlertData(null);
          }, 2000);
        }
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  }

  useEffect(() => {
    if (userid.current) {
      userid.current.focus();
    }
  }, []);

  const Enter1 = useRef(null);
  const Enter2 = useRef(null);
  const Enter3 = useRef(null);

  const focusNextInput = (ref) => {
    if (ref.current) {
      ref.current.focus();
    }
  };

  const handleEnterKeyPress = (ref, e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      focusNextInput(ref);
    }
  };

  const handleFocus = (codeparam) => {
    if (codeparam.current) {
      codeparam.current.style.backgroundColor = "orange";
    }
  };

  const handleBlur = (codeparam) => {
    if (codeparam.current) {
      codeparam.current.style.backgroundColor = "#3368B5";
    }
  };

  const toggleSignUp = () => {
    setIsSignUp(!isSignUp);
  };
  const [showPassword, setShowPassword] = useState(false);

  const togglePassword = () => {
    setShowPassword(!showPassword);
  };
  return (
    <div
      style={{
        backgroundColor: "#becedd",
        height: "100vh",
        // width: "80vw",
        overflowX: "hidden",
        overflowY: "hidden",
      }}
    >
      {alertData && (
        <Alert
          severity={alertData.type}
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "30%",
            marginLeft: "35%",
            zIndex: 9999, // Ensuring this is very high
            textAlign: "center",
          }}
        >
          {alertData.message}
        </Alert>
      )}
      <div className="form-login-container">
        <div
          style={{
            fontFamily: "Arial, sans-serif",
            background: "linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)",
            borderRadius: "0px",
            boxShadow:
              "0 10px 20px rgba(0, 0, 0, 0.19), 0 6px 6px rgba(0, 0, 0, 0.23)",
            overflow: "hidden",
            maxWidth: "800px",
            margin: "auto",
          }}
          className={`container ${isSignUp ? "right-panel-active" : ""}`}
          id="container"
        >
          <div className="form-container sign-in-container">
            <form action="#">
              <img
                src={Crystall}
                alt="Logo"
                style={{ width: "70%", margin: "20px 0" }}
              />

              <div className="social-container">
                <a href="#" className="social" style={{ marginRight: "10px" }}>
                  <i
                    className="fab fa-facebook-f"
                    style={{ color: "#3b5998" }}
                  ></i>
                </a>
                <a href="#" className="social" style={{ marginRight: "10px" }}>
                  <i
                    className="fab fa-google-plus-g"
                    style={{ color: "#dd4b39" }}
                  ></i>
                </a>
                <a href="#" className="social">
                  <i
                    className="fab fa-linkedin-in"
                    style={{ color: "#0077b5" }}
                  ></i>
                </a>
              </div>

              <input
                type="text"
                placeholder="User ID"
                ref={userid}
                onKeyDown={(e) => handleEnterKeyPress(password, e)}
                style={{
                  padding: "10px",
                  margin: "10px 0",
                  borderRadius: "5px",
                  border: "1px solid #ccc",
                }}
              />
              <div className="input-container" style={{ position: "relative" }}>
                <input
                  className="eyeball-input"
                  type={showPassword ? "text" : "password"}
                  placeholder="Password"
                  ref={password}
                  onKeyDown={(e) => handleEnterKeyPress(Code, e)}
                  style={{
                    padding: "10px",
                    margin: "10px 0",
                    borderRadius: "5px",
                    border: "1px solid #ccc",
                    width: "100%",
                  }}
                />
                <div className="monkey" onClick={togglePassword}>
                  {showPassword ? (
                    <i class="fa fa-eye" aria-hidden="true"></i>
                  ) : (
                    <i class="fa fa-eye-slash" aria-hidden="true"></i>
                  )}
                </div>
              </div>

              <input
                type="text"
                placeholder="Code"
                ref={Code}
                onChange={(e) =>
                  (e.target.value = e.target.value.toUpperCase())
                }
                onKeyDown={(e) => handleEnterKeyPress(Enter3, e)}
                style={{
                  padding: "10px",
                  margin: "10px 0",
                  borderRadius: "5px",
                  border: "1px solid #ccc",
                }}
              />
              <a
                href="#"
                style={{
                  color: "#6c63ff",
                  fontSize: "14px",
                  display: "block",
                  margin: "10px 0",
                }}
              >
                Forgot your password?
              </a>
              <button
                className="btn-primary-itc"
                ref={Enter3}
                onClick={UserLogin}
                type="submit"
                // disabled={userData.loading}
                onFocus={() => handleFocus(Enter3)}
                onBlur={() => handleBlur(Enter3)}
                style={{
                  background: "#6c63ff",
                  color: "#fff",
                  padding: "10px 20px",
                  border: "none",
                  borderRadius: "5px",
                  cursor: "pointer",
                  fontSize: "12px",
                }}
              >
                Sign In
              </button>
            </form>
          </div>
          <div className="form-container sign-up-container">
            <form action="#">
              <img
                src={Crystall}
                alt="Logo"
                style={{ width: "70%", margin: "20px 0" }}
              />

              <div className="social-container">
                <a href="#" className="social" style={{ marginRight: "10px" }}>
                  <i
                    className="fab fa-facebook-f"
                    style={{ color: "#3b5998" }}
                  ></i>
                </a>
                <a href="#" className="social" style={{ marginRight: "10px" }}>
                  <i
                    className="fab fa-google-plus-g"
                    style={{ color: "#dd4b39" }}
                  ></i>
                </a>
                <a href="#" className="social">
                  <i
                    className="fab fa-linkedin-in"
                    style={{ color: "#0077b5" }}
                  ></i>
                </a>
              </div>

              <input
                type="text"
                placeholder="User ID"
                // ref={userid}
                onKeyDown={(e) => handleEnterKeyPress(password, e)}
                style={{
                  padding: "10px",
                  margin: "10px 0",
                  borderRadius: "5px",
                  border: "1px solid #ccc",
                }}
              />
              <input
                type="password"
                placeholder="Password"
                // ref={password}
                // onKeyDown={(e) => handleEnterKeyPress(Code, e)}
                style={{
                  padding: "10px",
                  margin: "10px 0",
                  borderRadius: "5px",
                  border: "1px solid #ccc",
                }}
              />
              <input
                type="text"
                placeholder="Code"
                // ref={Code}
                onChange={(e) =>
                  (e.target.value = e.target.value.toUpperCase())
                }
                onKeyDown={(e) => handleEnterKeyPress(Enter3, e)}
                style={{
                  padding: "10px",
                  margin: "10px 0",
                  borderRadius: "5px",
                  border: "1px solid #ccc",
                }}
              />
              <a
                href="#"
                style={{
                  color: "#6c63ff",
                  fontSize: "14px",
                  display: "block",
                  margin: "10px 0",
                }}
              >
                Forgot your password?
              </a>
              <button
                className="btn-primary-itc"
                ref={Enter3}
                onClick={UserLogin}
                type="submit"
                // disabled={userData.loading}
                onFocus={() => handleFocus(Enter3)}
                onBlur={() => handleBlur(Enter3)}
                style={{
                  background: "#6c63ff",
                  color: "#fff",
                  padding: "10px 20px",
                  border: "none",
                  borderRadius: "5px",
                  cursor: "pointer",
                  fontSize: "12px",
                }}
              >
                Sign In
              </button>
            </form>
          </div>
          <div className="overlay-container">
            <div className="overlay">
              <div className="overlay-panel overlay-left">
                <img
                  src={logocrystal}
                  alt="Logo"
                  style={{
                    width: "60%",
                    margin: "20px 0",
                    borderRadius: "50%",
                    boxShadow: "0 0 10px #6c63ff",
                  }}
                />
                <h1
                  style={{
                    color: "#fff",
                    fontWeight: "bold",
                    fontFamily: "cursive",
                    fontSize: "24px",
                  }}
                >
                  CRYSTAL SOLUTION
                </h1>
                <p
                  style={{
                    color: "#fff",
                    fontSize: "14px",
                    fontFamily: "cursive",
                  }}
                >
                  Call: +92 304 4770075 +92 423518408 <br />
                  support@crystalsolutions.com.pk
                </p>
                <button
                  className="ghost"
                  id="signUp"
                  onClick={toggleSignUp}
                  style={{
                    background: "#fff",
                    color: "#6c63ff",
                    padding: "10px 20px",
                    border: "none",
                    borderRadius: "5px",
                    cursor: "pointer",
                    fontSize: "12px",
                    marginTop: "20px",
                  }}
                >
                  Sign Up
                </button>
              </div>
              <div className="overlay-panel overlay-right">
                <img
                  src={logocrystal}
                  alt="Logo"
                  style={{
                    width: "60%",
                    margin: "20px 0",
                    borderRadius: "50%",
                    boxShadow: "0 0 10px #6c63ff",
                  }}
                />
                <h1
                  style={{
                    color: "#fff",
                    fontWeight: "bold",
                    fontFamily: "cursive",
                    fontSize: "24px",
                  }}
                >
                  CRYSTAL SOLUTION
                </h1>
                <p
                  style={{
                    color: "#fff",
                    fontSize: "14px",
                    fontFamily: "cursive",
                  }}
                >
                  Call: +92 304 4770075 +92 423518408 <br />
                  support@crystalsolutions.com.pk
                </p>
                <button
                  className="ghost"
                  id="signUp"
                  onClick={toggleSignUp}
                  style={{
                    background: "#fff",
                    color: "#6c63ff",
                    padding: "10px 20px",
                    border: "none",
                    borderRadius: "5px",
                    cursor: "pointer",
                    fontSize: "12px",
                    marginTop: "20px",
                  }}
                >
                  Sign Up
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Loginn;
