import React from "react";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Button,
  Drawer,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  ListSubheader,
} from "@mui/material";
import { useTranslation } from "react-i18next";
import LanguageSwitcher from "../../utils/languageSwitcher/LanguageSwitcher.js";
import { ButtonCancel, ButtonFirst } from "../../utils/global-variables.js";
import {
  SettingIcon,
  SendIcon,
  UserSettingIcon,
  UserAccountIcon,
  LogoutIcon,
  UserIcon
} from "../../utils/global-icons.js";
import { ABOUTUS, CONTACTUS, HOME, USERCREDENTIALS } from "../../routes/Routes-Links.js";
import { useAuth } from "../../services/AuthProvider.js";
import DarkMode from "../darkMode/DarkMode.js";
import { getUserName } from '../../services/services-tool.js';

export default function DrawerNavbar() {
  const { t } = useTranslation();
  const { isAuthenticated, logout } = useAuth();
  const [settingDraw, setSettingsDraw] = React.useState(false);
  const navigate = useNavigate();

  const toggleDrawer = (open) => (event) => {
    if (
      event.type === "keydown" &&
      (event.key === "Tab" || event.key === "Shift")
    ) {
      return;
    }

    setSettingsDraw(open);
  };

 

  const list = () => (
    <Box sx={{ width: "auto", height: "100%" }} onClick={toggleDrawer(false)}>
      {isAuthenticated ? (
        <List
          sx={{ width: "100%", height: "100%" }}
          component="nav"
          aria-labelledby="nested-list-subheader"
          subheader={
            <ListSubheader
              component="div"
              id="nested-list-subheader"
              className="d-flex justify-content-center"
            >
              <strong>{t("Settings")}</strong>: {getUserName()}
              
            </ListSubheader>
          }
        >
          <ListItemButton
            onClick={() => navigate(USERCREDENTIALS)}
            style={{
              width: "100%",
              border: `2px solid ${ButtonFirst}`,
              borderTop: `2px solid ${ButtonFirst}`,
            }}            
          >
            <ListItemIcon >
              <UserSettingIcon />
            </ListItemIcon>
            <ListItemText primary={t("Update Credentials")} />
          </ListItemButton>
          <ListItemButton
            onClick={() => navigate(CONTACTUS)}
            style={{
              border: `2px solid ${ButtonFirst}`,
              borderTop: "0px",
            }}
          >
            <ListItemIcon>
              <SendIcon />
            </ListItemIcon>
            <ListItemText primary={t("CONTACTUS")} />
          </ListItemButton>
          <ListItemButton
            onClick={() => navigate(ABOUTUS)}
            style={{
              border: `2px solid ${ButtonFirst}`,
              borderBottom: `2px solid ${ButtonFirst}`,
              borderTop: "0px",
            }}
          >
            <ListItemIcon>
              <SendIcon />
            </ListItemIcon>
            <ListItemText primary={t("About Us")} />
          </ListItemButton>
          <ListItemButton
            style={{
              position: "absolute",
              bottom: "11.5vh",
              width: "100%",
              border: `2px solid ${ButtonFirst}`,
              borderTop: `2px solid ${ButtonFirst}`,
              borderBottom: `2px solid ${ButtonFirst}`,
            }}
            className="d-flex flex-row-reverse"
          >
          <ListItemIcon><DarkMode /></ListItemIcon>
            <ListItemText primary={t("Mode")} />
          </ListItemButton>
          <ListItemButton
            style={{
              position: "absolute",
              bottom: "5.5vh",
              width: "100%",
              border: `2px solid ${ButtonFirst}`,
              borderTop: "0px",
              borderBottom: "0px",
            }}
          >
            <LanguageSwitcher />
          </ListItemButton>
          <ListItemButton
            style={{
              position: "absolute",
              bottom: 0,
              width: "100%",
              border: `2px solid ${ButtonFirst}`,
            }}
            onClick={() => {
              logout();
              navigate(HOME);
            }}
            className="d-flex flex-row-reverse"
          >
            <ListItemIcon><LogoutIcon /></ListItemIcon>
            <ListItemText
              primary={
                <div
                  className="btn p-0 fw-bolder"
                  style={{ textDecoration: "none", color: ButtonCancel  }}
                >
                  {t("log_out")}
                </div>
              }
            />
          </ListItemButton>
        </List>
      ) : (
        <List
          sx={{ width: "100%", height: "100%", minWidth: "16vh" }}
          component="nav"
          aria-labelledby="nested-list-subheader"
        >
          <ListItemButton
            style={{
              position: "absolute",
              bottom: "0",
              width: "100%",
              borderTop: `1px solid ${ButtonFirst}`,
            }}
            className="d-flex flex-row-reverse mb-2"
          >
            <ListItemIcon><DarkMode /></ListItemIcon>
            <ListItemText primary={t("Mode")} />
          </ListItemButton>
        </List>
      )}
    </Box>
  );

  return (
    <React.Fragment key={"left"}>
      <Button onClick={toggleDrawer(true)}>
        <UserAccountIcon color="#ffffff" />
      </Button>
      <Drawer anchor={"right"} open={settingDraw} onClose={toggleDrawer(false)}>
        {list()}
      </Drawer>
    </React.Fragment>
  );
}
