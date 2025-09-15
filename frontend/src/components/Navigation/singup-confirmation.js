import { Box, Paper, Link, Button } from "@mui/material";
import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { ButtonSecond, BackgroundSecond, TextFirst } from "../../utils/global-variables.js";
import { t } from "i18next";
import { LOGIN } from "../../routes/Routes-Links.js";
import { LoginButton } from "../../utils/table/table-tools.js";

export default function SingupConfirmation() {
  const location = useLocation();
  
  const navigate = useNavigate();

  const [newUserName, setNewUserName] = useState(
    location.state?.name ? location.state?.name : null
  );

  return (
    <Box
      sx={{ p: 0, m: 6, pt: 4 }}
      className={"row d-flex align-items-center text-center"}
    >
      <Paper
        sx={{
          height: "20vh",
          mt: "10vh",
          backgroundColor: BackgroundSecond,
          justifyContent: "center",
        }}
        className="border-0 mx-6 d-flex align-items-center"
      >
        <h4
          style={{ color: TextFirst }}
          className="d-flexs justify-content-centers"
        >
          <span>{t("Hi")}{" "}</span>
          <span
            style={{ marginLeft: "1vh", marginRight: "1vh" }}
            className="fw-bolder text-danger"
          >
            {newUserName}!
          </span>{" "}<br />
          <span>{t("registration_done_successful")}</span>
        </h4>
      </Paper>
     
      <div className="d-flexs justify-content-centers">
        <p style={{ marginTop: "10vh" }}>
          {t("registration_done_main")}
        </p>

        <h6 className="text-warning">
          ({t("registration_done_small")})
        </h6>

        <LoginButton label="Back to login" path={LOGIN} style={{height: '32px', color: '#ffffff'}}/>
      </div>
    </Box>
  );
}
