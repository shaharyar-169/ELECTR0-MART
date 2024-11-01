import React, { useEffect, useState } from "react";
import {
  Box,
  Drawer,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Collapse,
  IconButton,
  Divider,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import {
  FaFile,
  FaExchangeAlt,
  FaChartBar,
  FaTools,
  FaToggleOn,
  FaToggleOff,
} from "react-icons/fa";
import { ExpandLess, ExpandMore, Opacity } from "@mui/icons-material";
import { useSelector, useDispatch } from "react-redux";
import {
  fetchGetCrystalCustomer,
  fetchGetCrystalMenu,
  fetchGetUser,
  fetchMenu,
} from "../../Redux/action";
import { getUserData, getOrganisationData, isLoggedIn } from "../../Auth";
import { Avatar } from "@mui/material"; // Import Avatar component
import { Typography } from "@mui/material";
import { Row, Col } from "react-bootstrap";
import imagebackground from "../../../image/homeapp.jpg";
import man from "../../../image/man.png";
// import "./Sidebar.css";
import Filemenu from "../../../image/filemenu.png";
import Transactionmenu from "../../../image/transactionmenu.png";
import Reportmenu from "../../../image/reportmenu.png";
import Utilitymenu from "../../../image/utilitimenu.png";
import Dashboard11menu from "../../../image/Dashboard1.png";
import { useTheme } from "../../../ThemeContext";
// import Dashboard2 from "../../../image/dashboard2.png";
// import Dashboard3 from "../../../image/dashboard3.png";
const SidebarHeader = ({ userName, userAvatar }) => {
  const { isSidebarVisible, toggleSidebar, getcolor, toggleChangeColor } =
    useTheme();
  return (
    <Box
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        padding: 2,
        backgroundImage: `url(${imagebackground})`,
        backgroundSize: "100% 100%",
        backgroundPosition: "center",
        position: "relative",
        height: "100px",
        justifyContent: "center",
        opacity: 0.8,
        zIndex: -1,
      }}
    >
      {/* Avatar Row */}
      <Row style={{ marginBottom: "20px" }}>
        <Avatar
          alt={userName}
          src={userAvatar}
          sx={{ width: 80, height: 50 }}
        />
      </Row>
      {isSidebarVisible && (
        <Row
          style={{
            backgroundColor: "rgba(0, 0, 0, 0.8)",
            width: "100%",
            justifyContent: "center", // Center the contents horizontally
            alignItems: "start", // Center the contents vertically
            padding: "10px",
            position: "absolute",
            height: "33px",
            bottom: 0,
          }}
        >
          <Col
            className="col-9"
            style={{ display: "flex", justifyContent: "center" }}
          >
            <Typography
              sx={{
                color: "#FFFFFF",
                display: "flex",
                fontSize: "13px",
                justifyContent: "left", // Center text horizontally
              }}
            >
              {userName}
            </Typography>
          </Col>
          <Col
            className="col-3"
            style={{ display: "flex", justifyContent: "center" }} // Center the IconButton
          >
            <IconButton
              sx={{ color: "#FFFFFF", marginTop: "-7px", fontSize: "13px" }}
            >
              {/* <ExpandMore /> */}
              <i className="bi bi-caret-down-fill"></i>
            </IconButton>
          </Col>
        </Row>
      )}
    </Box>
  );
};
const SideBar1 = () => {
  const dispatch = useDispatch();
  const user = getUserData();
  const organisation = getOrganisationData();
  const navigate = useNavigate();
  const { data, loading, error } = useSelector((state) => state.item);

  const [expanded, setExpanded] = useState(true);
  const [menuData, setMenuData] = useState([]);
  console.log('menu Data', menuData)
  const [openMenu, setOpenMenu] = useState({}); // To track open/closed top-level menus
  const [openSubMenu, setOpenSubMenu] = useState({}); // To track open/closed sub-menus
  const [isToggled, setIsToggled] = useState(true);

  // const { isSidebarOpen, toggleSidebarr } = useSidebar();

  useEffect(() => {
    if (!isLoggedIn()) {
      navigate("/login");
    }
  }, [navigate]);

  useEffect(() => {
    setMenuData([]);
    console.log(
      user && user.tusrid,
      organisation && organisation.code,
      "user && user.tusrid, organisation && organisation.code"
    );
    dispatch(fetchGetUser(organisation && organisation.code));
    dispatch(fetchMenu(user && user.tusrid, organisation && organisation.code));
    // dispatch(fetchGetCrystalCustomer());
    // dispatch(fetchGetCrystalMenu());
  }, [dispatch, user.tusrid, organisation.code]);

  useEffect(() => {
    const filteredData = data.filter((item) => item.tusrpem !== "S");
    if (Array.isArray(data)) {
      setMenuData(
        filteredData.sort((a, b) => a.tmencod.localeCompare(b.tmencod))
      );
    }
  }, [data]);

  const handleToggle = () => {
    setIsToggled(!isToggled);
    setExpanded(!expanded);
  };

  const handleMenuClick = (menuKey) => {
    setOpenMenu((prevOpenMenu) => ({
      ...Object.keys(prevOpenMenu).reduce((acc, key) => {
        acc[key] = key === menuKey ? !prevOpenMenu[key] : false;
        return acc;
      }, {}),
      [menuKey]: !prevOpenMenu[menuKey],
    }));
  };

  const handleSubMenuClick = (menuKey, subMenuKey) => {
    setOpenSubMenu((prevOpenSubMenu) => ({
      ...prevOpenSubMenu,
      [`${menuKey}-${subMenuKey}`]:
        !prevOpenSubMenu[`${menuKey}-${subMenuKey}`],
    }));
  };

  const customLinks = {
    "1-01-00": "/AccountCodeMaintenance",
    "1-02-01": "/CompanyMaintenance",
    "1-02-02": "/CategoryMaintenance",
    "1-02-03": "/CapacityMaintenance",
    "1-02-04": "/TypeMaintenance",
    "1-02-05": "/ItemMaintenance",
    "1-05-00": "/Get_Complain",
    "1-08-00": "/Get_Mobile",
    "1-09-00": "/Get_Category",
    "2-06-00": "/ItemPurchase",
    "2-07-00": "/ItemSale",
    "3-01-00": "/DailyJobReport",
    "3-02-00": "/Get_Comparison_Report",
    "3-03-00": "/Item_Comparison_Report",
    "4-01-00": "/UserManagement",
  };

  const hierarchicalMenuData = {};
  menuData.forEach((item) => {
    const [topLevel, middleLevel] = item.tmencod.split("-");
    if (!hierarchicalMenuData[topLevel]) {
      hierarchicalMenuData[topLevel] = { label: item.tmendsc, items: {} };
    }
    if (!hierarchicalMenuData[topLevel].items[middleLevel]) {
      hierarchicalMenuData[topLevel].items[middleLevel] = [];
    }
    hierarchicalMenuData[topLevel].items[middleLevel].push({
      label: item.tmendsc,
      to: item.tmenurl,
      disabledd: item.tusrpem == "N",
    });
  });

  
  const renderSubSubMenu = (topLevel, middleLevel, subItems) => {
    // Exclude the first item if it is meant to be a header or non-clickable
    const filteredSubItems = subItems.slice(1);

    return filteredSubItems.map((subItem, index) => (
      <ListItem
        button
        key={index}
        onClick={() => {
          if (!subItem.disabledd) {
            navigate(subItem.to); 
          } else {
            console.log("This menu item is disabled");
          }
        }}
        disabled={subItem.disabledd}
        sx={{
          pl: 9,
          height: "30px",
          "&:hover": {
            backgroundColor: "#01172e",
            color: "rgb(33, 193, 214)",
          },
        }}
      >
        <ListItemText
          primary={subItem.label}
          sx={{
            fontSize: "15px",
            fontFamily: "Poppins, sans-serif",
            lineHeight: "22.5px",
            textAlign: "left",
            textTransform: "none",
            textDecoration: "none",
            fontWeight: 500,
            color: subItem.disabledd === true ? "gray" : "white",
            "&:hover": {
              backgroundColor: "#01172e",
              color: "rgb(33, 193, 214)",
            },
          }}
        />
      </ListItem>
    ));
  };
  const renderSubMenu = (topLevel, middleLevelItems) => {
    return Object.keys(middleLevelItems)
      .filter((middleLevel) => middleLevel !== "000")
      .map((middleLevel) => {
        const subItems = middleLevelItems[middleLevel];
        const hasSubSubMenu = subItems.length > 1;

        return (
          <React.Fragment key={middleLevel}>
            {isSidebarVisible && (
              <ListItem
                button
                onClick={() => {
                  if (subItems[0].disabledd == true) {
                    return console.log("not working");
                  }
                  hasSubSubMenu
                    ? handleSubMenuClick(topLevel, middleLevel)
                    : subItems[0].to && navigate(subItems[0].to); // Directly navigate if no sub-sub-menu
                }}
                sx={{
                  pl: 7,
                  // "&:hover": {

                  //   backgroundColor: "#01172e",
                  //   color: "rgb(33, 193, 214)",
                  // },
                  "&:hover": {
                    backgroundColor: "#01172e",
                    color: "rgb(33, 193, 214)",
                  },
                  disabled: subItems[0].disabledd,
                  height: "30px",
                }}
              >
                <ListItemText
                  primary={subItems[0].label}
                  sx={{
                    fontSize: "15px",
                    fontFamily: "Poppins, sans-serif",
                    lineHeight: "22.5px",
                    textAlign: "left",
                    textTransform: "none",
                    textDecoration: "none",
                    fontWeight: 500,
                    color: subItems[0].disabledd ? "gray" : "white",
                    "&:hover": {
                      backgroundColor: "#01172e",
                      color: "rgb(33, 193, 214)",
                    },
                  }}
                />
                {hasSubSubMenu ? (
                  openSubMenu[`${topLevel}-${middleLevel}`] ? (
                    <ExpandLess />
                  ) : (
                    <ExpandMore />
                  )
                ) : null}
              </ListItem>
            )}

            {hasSubSubMenu && (
              <Collapse
                in={openSubMenu[`${topLevel}-${middleLevel}`]}
                timeout="auto"
                unmountOnExit
              >
                {renderSubSubMenu(topLevel, middleLevel, subItems)}
              </Collapse>
            )}
          </React.Fragment>
        );
      });
  };

  const imagelink = `https://crystalsolutions.com.pk/images/${
    organisation && organisation.code
  }`;

  const { isSidebarVisible, toggleSidebar, getcolor, toggleChangeColor } =
    useTheme();
  const [hovered, setHovered] = useState(false); // track if opened via hover
  return (
    <>
      <Box sx={{ display: "flex" }}>
        <Drawer
          sx={{
            overflowY: "auto",
            width: isSidebarVisible ? 250 : 60,
            flexShrink: 0,
            transition: "width 0.3s ease-in-out",
            "& .MuiDrawer-paper": {
              marginTop: "56px",
              width: isSidebarVisible ? 250 : 60,
              boxSizing: "border-box",
              backgroundColor: "#021A33",
              borderRight: "1px solid gray",
              color: "white",
              overflowX: isSidebarVisible ? "auto" : "hidden",
              transition: "width 1s ease-in-out",
              "&::-webkit-scrollbar": {
                width: "0.4em",
              },
              "&::-webkit-scrollbar-track": {
                backgroundColor: "#021A33",
              },
              "&::-webkit-scrollbar-thumb": {
                backgroundColor: "#0d2d4c",
                borderRadius: "10px",
              },
            },
          }}
          onMouseEnter={() => {
            if (!isSidebarVisible) {
              toggleSidebar(true);
              setHovered(true);
            }
          }}
          onMouseLeave={() => {
            if (hovered) {
              toggleSidebar(false);
              setHovered(false);
            }
          }}
          variant="permanent"
          anchor="left"
          open={isSidebarVisible}
        >
          <SidebarHeader userName={user.tusrnam} userAvatar={man} />
          <Divider />
          {/* <IconButton onClick={handleToggle}>
            {isToggled ? <FaToggleOn /> : <FaToggleOff />}
          </IconButton> */}
          <br />
          <br />
          <List>
            {Object.keys(hierarchicalMenuData)
              .filter((topLevel) => topLevel !== "000")
              .map((topLevel, index) => (
                <React.Fragment key={topLevel}>
                  <ListItem
                    button
                    onClick={() => {
                      handleMenuClick(topLevel);
                      console.log("clicked", topLevel);
                    }}
                    sx={{
                      pl: 2,
                      "&:hover": {
                        backgroundColor: "#01172e",
                        color: "rgb(33, 193, 214)",
                      },
                    }}
                  >
                    <ListItemIcon sx={{ color: "white" }}>
                      {hierarchicalMenuData[topLevel].label.includes(
                        "File"
                      ) && (
                        <img
                          src={Filemenu}
                          style={{ width: "25px", height: "25px" }}
                        />
                      )}
                      {hierarchicalMenuData[topLevel].label.includes(
                        "Transaction"
                      ) && (
                        <img
                          src={Transactionmenu}
                          style={{ width: "25px", height: "25px" }}
                        />
                      )}
                      {hierarchicalMenuData[topLevel].label.includes(
                        "Report"
                      ) && (
                        <img
                          src={Reportmenu}
                          style={{ width: "25px", height: "25px" }}
                        />
                      )}
                      {hierarchicalMenuData[topLevel].label.includes(
                        "Utilities"
                      ) && (
                        <img
                          src={Utilitymenu}
                          style={{ width: "30px", height: "30px" }}
                        />
                      )}
                      {hierarchicalMenuData[topLevel].label.includes(
                        "DASHBOARD"
                      ) &&
                        index === 0 && (
                          <img
                            src={Dashboard11menu}
                            style={{ width: "25px", height: "25px" }}
                          />
                        )}
                    </ListItemIcon>
                    {isSidebarVisible && (
                      <ListItemText
                        sx={{
                          marginLeft: "-33px",
                          "& .MuiTypography-root": {
                            fontSize: "15px",
                            fontWeight: 400,
                            fontFamily: "Poppins, sans-serif",
                            marginLeft: "10px",
                            backgroundColor: "rgba(0, 0, 0, 0)",
                            textAlign: "left",
                            lineHeight: "22.5px",
                            textDecoration: "none solid rgb(33, 193, 214)",
                          },
                        }}
                        primary={hierarchicalMenuData[topLevel].label}
                      />
                    )}
                    {openMenu[topLevel] ? <ExpandLess /> : <ExpandMore />}
                  </ListItem>
                  <Collapse
                    in={openMenu[topLevel]}
                    timeout="auto"
                    unmountOnExit
                  >
                    {renderSubMenu(
                      topLevel,
                      hierarchicalMenuData[topLevel].items
                    )}
                  </Collapse>
                </React.Fragment>
              ))}
          </List>
          <Divider />
        </Drawer>
      </Box>
    </>
  );
};

export default SideBar1;
