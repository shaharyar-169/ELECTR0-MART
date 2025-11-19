import { useNavigate } from "react-router-dom";
import { useTheme } from "../../../ThemeContext";
import React, { useState, useEffect } from "react";
import { styled, alpha } from "@mui/material/styles";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import InputBase from "@mui/material/InputBase";
import Badge from "@mui/material/Badge";
import MenuItem from "@mui/material/MenuItem";
import Menu from "@mui/material/Menu";
import MenuIcon from "@mui/icons-material/Menu";
import AccountCircle from "@mui/icons-material/AccountCircle";
import MailIcon from "@mui/icons-material/Mail";
import NotificationsIcon from "@mui/icons-material/Notifications";
import MoreIcon from "@mui/icons-material/MoreVert";
import { ChromePicker } from "react-color";

// import { useData } from "../../../DataContext";
import "bootstrap-icons/font/bootstrap-icons.css"; // Ensure this is imported
import man from "../../../image/man.png";
import { isLoggedIn, getUserData, getOrganisationData } from "../../Auth";
import { SvgIcon, Button } from "@mui/material";
import { Avatar, Divider, ListItemIcon } from "@mui/material";
import { Settings, ExitToApp, Brightness4, Inbox } from "@mui/icons-material";
import EventAvailableIcon from "@mui/icons-material/EventAvailable";
import EmailIcon from "@mui/icons-material/Email";
import SettingsIcon from "@mui/icons-material/Settings";
import QuikLinks from "./QuickLinks/QuikLinks";
import MessagePopup from "./Message/Message";
import NotificationPopup from "./Notification/Notification";
import BrightnessPopup from "./Brightness/Brightness";
import Admin from "./Admin/Admin";
import CustomDropdown from "../Dropdown/Dropdown";
import { useSelector, useDispatch } from "react-redux";
// import {
//   fetchGetActiveUserLocation,
//   fetchGetActiveUserYear,
// } from "../../Redux/action";
import axios from "axios";

const Threelineiconheader = () => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <line x1="3" y1="12" x2="21" y2="12"></line>
      <line x1="3" y1="6" x2="21" y2="6"></line>
      <line x1="3" y1="18" x2="21" y2="18"></line>
    </svg>
  );
};

const CustomGridIcon = () => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect x="3" y="3" width="7" height="7"></rect>
      <rect x="14" y="3" width="7" height="7"></rect>
      <rect x="14" y="14" width="7" height="7"></rect>
      <rect x="3" y="14" width="7" height="7"></rect>
    </svg>
  );
};

const SearchIcon = () => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      {/* Circle for search icon */}
      <circle cx="11" cy="11" r="8"></circle>
      {/* Line for search icon */}
      <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
    </svg>
  );
};
export default function Header() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const user = getUserData();
  const organisation = getOrganisationData();
  const {
    isSidebarVisible,
    toggleSidebar,
    getcolor,
    fontcolor,
    toggleChangeColor,
    setFromDate,
    setToDate,
    setLocationNumber,
    setYearDescription,
    getnavbarbackgroundcolor,
    getnavbarfontcolor,
    getheaderfontsize,
    getdatafontsize,
    getfontstyle,
  } = useTheme();

  const yeardata = {
    id: 1,
    tyerdsc: "2022",
    tenddat: "2022-12-31",
    tstrdat: "2022-01-01",
  }

  const locationdata = {
    id: 1,
    tlocnam: "Location 1",
  }

  // const {
  //   data: yeardata,
  //   loading: yearloading,
  //   error: yearerror,
  // } = useSelector((state) => state.getactiveuseryear);
  // const {
  //   data: locationdata,
  //   loading: locationloading,
  //   error: locationerror,
  // } = useSelector((state) => state.getactiveuserlocation);

  const [selectedYear, setSelectedYear] = useState(null);
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [tyerdsc, setTyerdsc] = useState("");
  const [tstrdat, setTstrdat] = useState("");
  const [tenddat, setTenddat] = useState("");
  const [tlocnam, setTlocnam] = useState("");

  // useEffect(() => {
  //   dispatch(
  //     fetchGetActiveUserYear(user.tusrid, organisation && organisation.code)
  //   );
  //   dispatch(
  //     fetchGetActiveUserLocation(user.tusrid, organisation && organisation.code)
  //   );
  // }, [dispatch, organisation && organisation.code]);

  // const handleYearChange = (e) => {
  //   const selectedYear =
  //     yeardata.find((year) => year.id === e.target.value) || yeardata[0];
  //   setSelectedYear(selectedYear);
  //   setFromDate(selectedYear.tstrdat);
  //   setToDate(selectedYear.tenddat);
  //   setTyerdsc(selectedYear.tyerdsc);
  //   setYearDescription(selectedYear.tyerdsc);
  //   localStorage.setItem(
  //     "yeardescription",
  //     JSON.stringify(selectedYear.tyerdsc)
  //   );
  //   setTstrdat(selectedYear.tstrdat);
  //   setTenddat(selectedYear.tenddat);
  // };

  // // Handle selection of location
  // const handleLocationChange = (e) => {
  //   const selectedLocation =
  //     locationdata.find((year) => year.id === e.target.value) ||
  //     locationdata[0];
  //   setLocationNumber(selectedLocation.tloccod);
  //   localStorage.setItem(
  //     "locationnumber",
  //     JSON.stringify(selectedLocation.tloccod)
  //   );

  //   setSelectedLocation(selectedLocation);
  //   setTlocnam(selectedLocation.tloccod);
  // };

  useEffect(() => {
    if (!isLoggedIn()) {
    }
  }, [navigate]);

  const { primaryColor, secondaryColor } = useTheme();
  const { apiLinks } = useTheme();

  const imagelink = `https://crystalsolutions.com.pk/images/${organisation && organisation.code
    }`;
  const [anchorEl, setAnchorEl] = React.useState(null);
  const [mobileMoreAnchorEl, setMobileMoreAnchorEl] = React.useState(null);
  const isMenuOpen = Boolean(anchorEl);

  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };
  const isMobileMenuOpen = Boolean(mobileMoreAnchorEl);

  const handleProfileMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMobileMenuClose = () => {
    setMobileMoreAnchorEl(null);
  };

  const handleMobileMenuOpen = (event) => {
    setMobileMoreAnchorEl(event.currentTarget);
  };
  const handleLogout = () => {
    localStorage.removeItem("isLoggedIn");
    localStorage.removeItem("user");
    localStorage.removeItem("organisation");
    setTimeout(() => {
      window.location.reload();
    }, 1000);
    // Optionally, you can also reset your alert data or any other state
    // setAlertData({
    //   type: "info",
    //   message: "You have been logged out.",
    // });
    navigate("/");
  };

  const menuId = "primary-search-account-menu";
  const renderMenu = (
    <div>
      <IconButton onClick={handleMenuOpen}>
        <Avatar alt={user?.tusrnam || ""} src="/path-to-avatar.jpg" />
      </IconButton>

      <Menu
        anchorEl={anchorEl}
        anchorOrigin={{
          vertical: "top",
          horizontal: "right",
        }}
        keepMounted
        transformOrigin={{
          vertical: "top",
          horizontal: "right",
        }}
        open={isMenuOpen}
        onClose={handleMenuClose}
        PaperProps={{
          elevation: 6,
          sx: {
            marginTop: "50px",
            width: 300,
            backgroundColor: "#0A2744", // Dark blue background
            color: "white", // White text
            borderRadius: "12px",
            boxShadow: "0px 8px 24px rgba(0, 0, 0, 0.15)",
          },
        }}
      >
        {/* Profile Info */}
        <div
          style={{
            padding: "20px",
            background: "linear-gradient(135deg, #1f3b56, #3f4e71)",
            borderTopLeftRadius: "12px",
            borderTopRightRadius: "12px",
            display: "flex",
            alignItems: "center", // Align name and avatar
            gap: "16px", // Space between avatar and text
          }}
        >
          <Avatar
            alt={user?.name || "John Deo"}
            src="/path-to-avatar.jpg"
            sx={{
              width: 64,
              height: 64,
              boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.2)",
            }}
          />
          <div style={{ textAlign: "left" }}>
            <Typography
              variant="body1"
              sx={{
                color: "white",
                fontWeight: "bold",
                fontSize: "12px", // Adjusted font size to 12px
              }}
            >
              {user?.tusrnam || "John Deo"}
            </Typography>
            <Typography
              variant="body2"
              sx={{
                color: "lightgray",
                fontSize: "12px", // Adjusted font size to 12px
              }}
            >
              {user?.temladd || `${user?.tusrnam}@gmail.com`}
            </Typography>
          </div>
        </div>

        <Divider sx={{ borderBottom: "2px solid #efefef" }} />

        {/* Menu Items */}
        <MenuItem
          onClick={handleMenuClose}
          sx={{
            color: "white",
            padding: "12px 16px",
            fontSize: "12px", // Adjusted font size to 12px
            transition: "background 0.3s",
            "&:hover": { backgroundColor: "#1f3b56" },
          }}
        >
          My Profile
        </MenuItem>

        <Divider sx={{ borderBottom: "2px solid #efefef" }} />

        {/* Mode and Settings */}
        <MenuItem
          onClick={handleMenuClose}
          sx={{
            color: "white",
            padding: "12px 16px",
            fontSize: "12px", // Adjusted font size to 12px
            transition: "background 0.3s",
            "&:hover": { backgroundColor: "#1f3b56" },
          }}
        >
          <ListItemIcon sx={{ color: "white" }}>
            <Brightness4 fontSize="small" />
          </ListItemIcon>
          Mode
        </MenuItem>
        <MenuItem
          onClick={handleMenuClose}
          sx={{
            color: "white",
            padding: "12px 16px",
            fontSize: "12px", // Adjusted font size to 12px
            transition: "background 0.3s",
            "&:hover": { backgroundColor: "#1f3b56" },
          }}
        >
          <ListItemIcon sx={{ color: "white" }}>
            <Settings fontSize="small" />
          </ListItemIcon>
          Account Settings
        </MenuItem>
        <MenuItem
          onClick={handleLogout}
          sx={{
            color: "white",
            padding: "12px 16px",
            fontSize: "12px", // Adjusted font size to 12px
            transition: "background 0.3s",
            "&:hover": { backgroundColor: "#1f3b56" },
          }}
        >
          <ListItemIcon sx={{ color: "white" }}>
            <ExitToApp fontSize="small" />
          </ListItemIcon>
          Sign Out
        </MenuItem>

        {/* Version and Time */}
        <div
          style={{
            textAlign: "center",
            borderTop: "1px solid #efefef",
          }}
        >
          <Typography
            variant="body2"
            sx={{
              color: "lightgray",
              marginTop: "2%",

              fontSize: "11px",
            }}
          >
            Version: 16.01.2025 | 1:45 PM
          </Typography>
        </div>
      </Menu>
    </div>
  );

  const mobileMenuId = "primary-search-account-menu-mobile";
  const renderMobileMenu = (
    <Menu
      anchorEl={mobileMoreAnchorEl}
      anchorOrigin={{
        vertical: "top",
        horizontal: "right",
      }}
      id={mobileMenuId}
      keepMounted
      transformOrigin={{
        vertical: "top",
        horizontal: "right",
      }}
      open={isMobileMenuOpen}
      onClose={handleMobileMenuClose}
    >
      <MenuItem>
        <IconButton size="large" aria-label="show 4 new mails" color="inherit">
          <Badge badgeContent={4} color="error">
            <MailIcon />
          </Badge>
        </IconButton>
        <p>Messages</p>
      </MenuItem>
      <MenuItem>
        <IconButton
          size="large"
          aria-label="show 17 new notifications"
          color="inherit"
        >
          <Badge badgeContent={17} color="error">
            <NotificationsIcon />
          </Badge>
        </IconButton>
        <p>Notifications</p>
      </MenuItem>
      <MenuItem onClick={handleProfileMenuOpen}>
        <IconButton
          size="large"
          aria-label="account of current user"
          aria-controls="primary-search-account-menu"
          aria-haspopup="true"
          color="inherit"
        >
          <AccountCircle />
        </IconButton>
        <p>Profile</p>
      </MenuItem>
    </Menu>
  );
  const [isOpenmail, setIsOpenmail] = useState(false);
  const [isOpennotification, setIsOpennotification] = useState(false);
  const [isfilesOpen, setIsfilesOpen] = useState(false);
  const [isbrightnessopen, setbrightnessopen] = useState(false);
  const [isadminopen, setadminopen] = useState(false);

  const handleToggle = (type) => {
    if (type === "mail") {
      setIsOpenmail((prev) => !prev);
      setIsOpennotification(false);
      setIsfilesOpen(false);
      setbrightnessopen(false);
      setadminopen(false);
    } else if (type === "notification") {
      setIsOpenmail(false);
      setIsOpennotification((prev) => !prev);
      setIsfilesOpen(false);
      setbrightnessopen(false);
      setadminopen(false);
    } else if (type === "files") {
      setIsOpenmail(false);
      setIsOpennotification(false);
      setIsfilesOpen((prev) => !prev);
      setbrightnessopen(false);
      setadminopen(false);
    } else if (type === "brightness") {
      setIsOpenmail(false);
      setIsOpennotification(false);
      setIsfilesOpen(false);
      setadminopen(false);
      setbrightnessopen((prev) => !prev);
    } else if (type === "admin") {
      setIsOpenmail(false);
      setIsOpennotification(false);
      setIsfilesOpen(false);
      setbrightnessopen(false);
      setadminopen((prev) => !prev);
    }
  };

  const [showColorPicker, setShowColorPicker] = useState(false);
  const [backgroundColor, setBackgroundColor] = useState("#ffffff");
  const [fontColor, setFontColor] = useState("#000000");

  const toggleColorPicker = () => {
    setShowColorPicker(!showColorPicker);
  };

  const handleBackgroundChange = (color) => {
    setBackgroundColor(color.hex);
  };

  const handleFontColorChange = (color) => {
    setFontColor(color.hex);
  };
  const [isDarkMode, setIsDarkMode] = useState(true);

  // Function to toggle the mode
  const toggleChangeColorr = () => {
    setIsDarkMode((prevMode) => !prevMode);
    toggleChangeColor();
    // You can also add logic here to change the theme or colors globally
  };

  return (
   <Box sx={{ flexGrow: 1 }}>
      <AppBar
        position="static"
        style={{
          background: getnavbarbackgroundcolor,
          height: "55px",
          borderBottom: "1px solid gray",
        }}
      >
        <Toolbar>
          <div
            className="header-container"
            style={{
              position: "relative",
            }}
          >
            <img
              className="header-logo"
              src={`${imagelink}01.jpg`}
              alt="Company Logo"
              style={{
                height: "40px",
                marginRight: "5px",
                mixBlendMode: "multiply",
              }}
            />
          </div>

          <h6
            style={{
              fontSize: "15px",
              fontWeight: "400",
              fontStyle: "normal",
              color: getnavbarfontcolor,
              fontFamily: getfontstyle,
              fontWeight: "bold",
              lineHeight: "22.5px",
              textAlign: "center",
              alignItems: "center",
              textTransform: "none",
              textDecoration: "none",
            }}
          >
            {organisation && organisation.description}
          </h6>
          <IconButton
            className="header-icon-button"
            style={{ marginLeft: "60px" }}
            size="small"
            edge="start"
            color="inherit"
            aria-label="open drawer"
            sx={{
              "&:hover": {
                backgroundColor: "rgba(191, 191, 191,0.5)",
                borderRadius: "50%",
              },
            }}
            onClick={() => toggleSidebar(!isSidebarVisible)}
          >
            <Threelineiconheader />
          </IconButton>
          <IconButton
            className="header-icon-button"
            size="small"
            edge="start"
            color="inherit"
            aria-label="open drawer"
            sx={{
              ml: 2,
              "&:hover": {
                backgroundColor: "rgba(191, 191, 191,0.5)",
                borderRadius: "50%",
              },
            }}
            onClick={() => handleToggle("files")}
          >
            <CustomGridIcon />
          </IconButton>
          <QuikLinks isOpen={isfilesOpen} />

          <Box sx={{ flexGrow: 1 }} />

          <Box sx={{ display: { xs: "flex", md: "none" } }}>
            <IconButton
              className="header-icon-button"
              size="small"
              edge="start"
              color="inherit"
              aria-label="open drawer"
              sx={{
                "&:hover": {
                  backgroundColor: "rgba(191, 191, 191,0.5)",
                  borderRadius: "50%",
                },
              }}
              onClick={toggleChangeColor}
            >
              <i className="bi bi-brightness-high fs-5 text-white"></i>
            </IconButton>
            <IconButton
              className="header-icon-button"
              size="large"
              aria-label="show new mails"
              color="inherit"
              onClick={() => handleToggle("mail")}
              sx={{
                "&:hover": {
                  backgroundColor: "rgba(191, 191, 191,0.5)",
                  borderRadius: "50%",
                },
              }}
            >
              <Badge badgeContent={5} color="error">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
                </svg>
              </Badge>
            </IconButton>
            <MessagePopup isOpen={isOpenmail} />
            <IconButton
              className="header-icon-button"
              size="large"
              aria-label="show new notification"
              color="inherit"
              onClick={() => handleToggle("notification")}
              sx={{
                "&:hover": {
                  backgroundColor: "rgba(191, 191, 191,0.5)",
                  borderRadius: "50%",
                },
              }}
            >
              <Badge badgeContent={17} color="error">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
                  <polyline points="22,6 12,13 2,6"></polyline>
                </svg>
              </Badge>
            </IconButton>
            <NotificationPopup isOpen={isOpennotification} />
            <IconButton
              className="header-icon-button"
              size="large"
              edge="end"
              aria-label="account of current user"
              aria-controls={menuId}
              aria-haspopup="true"
              color="inherit"
              onClick={handleProfileMenuOpen}
            >
              <Avatar
                alt="Profile"
                src={man}
                sx={{ height: "30px", width: "30px", marginTop: "-10px" }}
              />
            </IconButton>
          </Box>

          <Box sx={{ display: { xs: "none", md: "flex" } }}>
            <select
              id="yearDropdown"
              // onChange={handleYearChange}
              style={{
                backgroundColor: getnavbarbackgroundcolor,
                color: getnavbarfontcolor,
                height: "25px",
                padding: "5px 30px 5px 10px",
                fontFamily: getfontstyle,
                fontSize: "11px",
                border: `1px solid ${fontcolor}`,
                borderRadius: "8px",
                appearance: "none",
                WebkitAppearance: "none",
                MozAppearance: "none",
                cursor: "pointer",
                marginTop: "11px",
                marginRight: "5px",
                boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
                transition: "border-color 0.3s, box-shadow 0.3s",
              }}
              onFocus={(e) => (e.target.style.borderColor = "#007BFF")}
              onBlur={(e) => (e.target.style.borderColor = fontcolor)}
            >
              {/* {yeardata &&  yeardata.map((year) => (
                  <option key={year.id} value={year.id}>
                    {year.tyerdsc}
                  </option>
                ))} */}

              <option value='2024-2024'>2024-2024</option>

            </select>

            <select
              id="locationDropdown"
              // onChange={handleLocationChange}
              style={{
                backgroundColor: getnavbarbackgroundcolor,
                color: getnavbarfontcolor,
                height: "25px",
                padding: "5px 30px 5px 10px",
                fontFamily: getfontstyle,
                fontSize: "11px",
                border: `1px solid ${fontcolor}`,
                borderRadius: "8px",
                appearance: "none",
                WebkitAppearance: "none",
                MozAppearance: "none",
                cursor: "pointer",
                marginTop: "11px",
                marginRight: "5px",
                boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
                transition: "border-color 0.3s, box-shadow 0.3s",
              }}
              onFocus={(e) => (e.target.style.borderColor = "#007BFF")} // Highlight on focus
              onBlur={(e) => (e.target.style.borderColor = fontcolor)} // Revert on blur
            >
              {/* {locationdata &&
                locationdata.map((location) => (
                  <option key={location.id} value={location.id}>
                    {location.tlocdsc}
                  </option>
                
                ))} */}
                <option value='Nasir Traders Abid Market'>Nasir Traders Abid Market</option>



            </select>

            {/* Add a custom dropdown arrow using CSS */}
            <style>
              {`
    #yearDropdown, #locationDropdown {
      background-image: url("data:image/svg+xml;charset=US-ASCII,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' fill='%23${fontcolor.replace(
                "#",
                ""
              )}' viewBox='0 0 16 16'%3E%3Cpath d='M7.247 11.14L2.451 5.658C1.885 5.013 2.345 4 3.204 4h9.592a1 1 0 0 1 .753 1.659l-4.796 5.48a1 1 0 0 1-1.506 0z'/%3E%3C/svg%3E");
      background-repeat: no-repeat;
      background-position: right 10px center;
      background-size: 12px;
    }
    #yearDropdown:hover, #locationDropdown:hover {
      border-color: #007BFF; // Change border color on hover
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2); // Enhance shadow on hover
    }
  `}
            </style>
            {organisation && organisation.code === "CRYSTAL" && (
              <>
                <IconButton
                  className="header-icon-button"
                  size="small"
                  edge="start"
                  color="inherit"
                  aria-label="open drawer"
                  sx={{
                    mr: 2,
                    "&:hover": {
                      backgroundColor: "rgba(191, 191, 191,0.5)",
                      borderRadius: "50%",
                    },
                  }}
                  onClick={() => handleToggle("admin")}
                >
                  <i className="bi bi-person-workspace fs-5 text-white"></i>
                </IconButton>
              </>
            )}

            <Admin isOpen={isadminopen} handleToggle={handleToggle} />

            {user && user.tusrtyp === "A" && (
              <>
                <IconButton
                  className="header-icon-button"
                  size="small"
                  edge="start"
                  color="inherit"
                  aria-label="open drawer"
                  style={{ marginRight: "10px" }}
                  sx={{
                    "&:hover": {
                      backgroundColor: "rgba(191, 191, 191,0.5)",
                      borderRadius: "50%",
                    },
                  }}
                  onClick={() => navigate("/UserManagement")}
                >
                  <i className="bi bi-people-fill fs-5 text-white"></i>
                </IconButton>
              </>
            )}
            <IconButton
              className="header-icon-button"
              size="small"
              edge="start"
              color="inherit"
              aria-label="open drawer"
              sx={{
                "&:hover": {
                  backgroundColor: "rgba(191, 191, 191, 0.5)",
                  borderRadius: "50%",
                },
              }}
              onClick={toggleChangeColorr}
            >
              {isDarkMode ? (
                <i className="bi bi-moon fs-5" style={{ color: "#ffffff" }}></i>
              ) : (
                <i
                  className="bi bi-brightness-high fs-5"
                  style={{ color: "#ffffff" }}
                ></i>
              )}
            </IconButton>

            <IconButton
              className="header-icon-button"
              size="large"
              aria-label="show new mails"
              color="inherit"
              onClick={() => handleToggle("mail")}
              sx={{
                "&:hover": {
                  backgroundColor: "rgba(191, 191, 191,0.5)",
                  borderRadius: "50%",
                },
              }}
            >
              <Badge badgeContent={5} color="error">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
                </svg>
              </Badge>
            </IconButton>

            <MessagePopup isOpen={isOpenmail} />

            <IconButton
              className="header-icon-button"
              size="large"
              aria-label="show new notification"
              color="inherit"
              onClick={() => handleToggle("notification")}
              sx={{
                "&:hover": {
                  backgroundColor: "rgba(191, 191, 191,0.5)",
                  borderRadius: "50%",
                },
              }}
            >
              <Badge badgeContent={17} color="error">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
                  <polyline points="22,6 12,13 2,6"></polyline>
                </svg>
              </Badge>
            </IconButton>
            <NotificationPopup isOpen={isOpennotification} />

            <IconButton
              className="header-icon-button"
              size="large"
              edge="end"
              aria-label="account of current user"
              aria-controls={menuId}
              aria-haspopup="true"
              color="inherit"
              onClick={handleProfileMenuOpen}
            >
              <Avatar
                alt="Profile"
                src={man}
                sx={{ height: "30px", width: "30px", marginTop: "-10px" }}
              />
            </IconButton>
          </Box>
        </Toolbar>
      </AppBar>
      {renderMobileMenu}
      {renderMenu}
    </Box>
  );
}
