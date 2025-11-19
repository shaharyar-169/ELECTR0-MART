// MessagePopup.js
import React from "react";
import { styled, alpha } from "@mui/material/styles";
import { Avatar, Divider, ListItemIcon } from "@mui/material";

import EventAvailableIcon from "@mui/icons-material/EventAvailable";
import EmailIcon from "@mui/icons-material/Email";
import SettingsIcon from "@mui/icons-material/Settings";
import { useTheme } from "../../../../ThemeContext";

const NotificationPopup = ({ isOpen }) => {
  const { getcolor, fontcolor, setcolor, setfontcolor } = useTheme(); // Use the theme context

  const PopupContainer = styled("div")({
    position: "absolute",
    top: "60px",
    right: "20px",
    width: "360px",
    backgroundColor: getcolor,
    borderRadius: "10px",
    boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)",
    zIndex: 1,
    padding: "10px",
    color: fontcolor,
    fontFamily: "Arial, sans-serif",
  });

  const Header = styled("h3")({
    margin: "0 0 10px 0",
    padding: "10px",
    backgroundColor: "#007BFF",
    borderRadius: "5px",
    textAlign: "center",
    fontSize: "16px", // Small but still readable
  });

  const MessageCount = styled("p")({
    margin: "0 0 10px 0",
    textAlign: "center",
    fontSize: "12px", // Reduced font size for count
  });

  const MessageList = styled("div")({
    maxHeight: "370px",
    overflowY: "auto",
    marginBottom: "10px",
  });

  const MessageItem = styled("div")({
    display: "flex",
    alignItems: "center",
    padding: "10px",
    backgroundColor: "#1E3A5F",
    borderRadius: "5px",
    marginBottom: "10px",
  });

  const MessageDetails = styled("div")({
    flex: 1,
    marginLeft: "10px",
  });

  const MessageTitle = styled("div")({
    fontWeight: "bold",
    fontSize: "12px", // Smaller font size
  });

  const MessageText = styled("p")({
    margin: "5px 0 0 0",
    fontSize: "10px",
    color: "#ccc",
  });

  const CheckButton = styled("button")({
    backgroundColor: "#007BFF",
    color: "#fff",
    width: "100%",
    padding: "10px",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
    fontWeight: "bold",
    fontSize: "12px",
  });

  return (
    isOpen && (
      <PopupContainer>
        <Header>Notification</Header>
        <MessageCount>You have 5 new notification</MessageCount>

        {/* Message List */}
        <MessageList>
          {[
            {
              title: "Event Today",
              time: "9:10 PM",
              message: "Just a reminder of the event.",
              icon: <EventAvailableIcon />,
              avatarColor: "#FF5722",
            },
            {
              title: "Send Email",
              time: "9:02 AM",
              message: "Just send my admin!",
              icon: <EmailIcon />,
              avatarColor: "#2196F3",
            },
            {
              title: "Check Email",
              time: "9:02 AM",
              message: "Just check emails for today.",
              icon: <EmailIcon />,
              avatarColor: "#4CAF50",
            },
            {
              title: "Settings",
              time: "9:08 AM",
              message: "You can customize this template as you...",
              icon: <SettingsIcon />,
              avatarColor: "#FF9800",
            },
            {
              title: "Send Email",
              time: "9:02 AM",
              message: "Just send my admin!",
              icon: <EmailIcon />,
              avatarColor: "#9C27B0",
            },
          ].map((msg, index) => (
            <MessageItem key={index}>
              <Avatar style={{ backgroundColor: msg.avatarColor }}>
                {msg.title[0]}
              </Avatar>
              <MessageDetails>
                <MessageTitle>
                  {msg.time} - {msg.title}
                </MessageTitle>
                <MessageText>{msg.message}</MessageText>
              </MessageDetails>
            </MessageItem>
          ))}
        </MessageList>

        <CheckButton>Check All Notification</CheckButton>
      </PopupContainer>
    )
  );
};

export default NotificationPopup;
