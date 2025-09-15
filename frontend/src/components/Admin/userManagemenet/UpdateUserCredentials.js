import React, { useState } from "react";
import PropTypes from "prop-types";
import {
  Box,
  Typography,
  Tabs,
  Tab,
  InputLabel,
  FormGroup,
  FormControlLabel,
  Checkbox,
  Alert,
  TextField,
  Button,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import {
  getAuthentificatedUserId,
  getUserNameCookies,
  setUserNameCookies,
} from "../../../services/CookiesUtils";
import { API } from "../../../services/Api";
import { DialogConfirmation } from "../../../utils/dialog-notifications";
import { ADMINSCREEN } from "../../../routes/Routes-Links";
import { CancelButton } from "../../../utils/table/table-tools";
import { ButtonFirst, ButtonSecond } from "../../../utils/global-variables";
import { PasswordIcon, UserNameIcon } from "../../../utils/global-icons";

function CustomTabPanel({ children, value, index, ...other }) {
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          <Typography>{children}</Typography>
        </Box>
      )}
    </div>
  );
}

CustomTabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.number.isRequired,
  value: PropTypes.number.isRequired,
};

export default function UpdateUserCredentials() {
  const { t } = useTranslation();
  const [value, setValue] = useState(0);
  const [passwordType, setPasswordType] = useState("password");
  const [warning, setWarning] = useState(false);
  const [warningMessage, setWarningMessage] = useState("");
  const [username, setUsername] = useState(getUserNameCookies());
  const navigate = useNavigate();

  const handleUpdatePassword = async (event) => {
    event.preventDefault();
    const actualpassword = event.target.actualpassword.value;
    const newpassword = event.target.newpassword.value;
    const confirmPassword = event.target.confirmPassword.value;

    // Reset warnings
    setWarning(false);
    setWarningMessage("");

    // Check password match
    if (!actualpassword) {
      setWarning(true);
      setWarningMessage(t("failed_password_required"));
      return;
    }
    // Check password match
    if (newpassword !== confirmPassword) {
      setWarning(true);
      setWarningMessage(t("failed_password_not_match"));
      return;
    }

    try {
      // Assuming you have a function that makes the API call
      const response = await API.UserV2.updatePassword(
        getAuthentificatedUserId(),
        actualpassword,
        newpassword
      );

      if (response.status === 200) {
        DialogConfirmation(
          t("conf_success"),
          t("conf_success_passwordUpdate"),
          () => navigate(ADMINSCREEN)
        );
      } else {
        setWarning(true);
        setWarningMessage(t("failed_passwordUpdate"));
      }
    } catch (error) {
      setWarning(true);
      setWarningMessage(`${t("failed_passwordCatch")} ${error}`);
    }
  };

  const handleUpdateUsername = async (event) => {
    event.preventDefault();
    const actualusername = event.target.actualusername.value;
    const newusername = event.target.newusername.value;
    const password = event.target.password.value;

    // Reset warnings
    setWarning(false);
    setWarningMessage("");

    // Check password match
    if (!password) {
      setWarning(true);
      setWarningMessage("Actual Password is required.");
      return;
    }
    // Check if the new username matches the actual username
    if (newusername === actualusername) {
      setWarning(true);
      setWarningMessage(
        "Your new username is the same; you must change something."
      );
      return;
    }
    try {
      // Assuming you have a function that makes the API call
      const response = await API.UserV2.updateUsername(
        getAuthentificatedUserId(),
        password,
        newusername
      );

      if (response.status === 200) {
        setUserNameCookies(newusername);
        DialogConfirmation("success", `Username updated successfully.`, () =>
          navigate(ADMINSCREEN)
        );
      } else {
        setWarning(true);
        setWarningMessage("Failed to update username");
      }
    } catch (error) {
      setWarning(true);
      setWarningMessage(
        `An error occurred while Updating username, try again with right password`
      );
    }
  };
  const togglePasswordType = () => {
    setPasswordType(passwordType === "password" ? "text" : "password");
  };

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  return (
    <Box sx={{ width: "100%", paddingTop: "10vh" }}>
      <CancelButton />
      <Tabs
        value={value}
        onChange={handleChange}
        TabIndicatorProps={{
          sx: {
            backgroundColor: "green",
          },
        }}
      >
        <Tab
          className="d-flex w-100"
          label={
            <div className="InputLabel d-flex justify-content-start">
              {t("update_password")}{" "}
              <span
                style={{
                  verticalAlign: "middle",
                  marginLeft: "3vh",
                  height: "1vh",
                }}
              >
                <PasswordIcon />
              </span>
            </div>
          }
          {...a11yProps(0)}
        />
        <Tab
          label={
            <div className="InputLabel d-flex justify-content-start">
              {t("update_username")}{" "}
              <span
                style={{
                  verticalAlign: "middle",
                  marginLeft: "3vh",
                  height: "1vh",
                }}
              >
                <UserNameIcon />
              </span>
            </div>
          }
          {...a11yProps(1)}
        />
      </Tabs>

      <CustomTabPanel
        value={value}
        index={0}
        style={{ paddingLeft: "40vh", marginRight: "40vh" }}
      >
        <div>
          <form onSubmit={handleUpdatePassword}>
            <InputLabel
              htmlFor="my-ActualPasswordinput"
              className="InputLabel d-flex justify-content-star"
            >
              {t("actual_password")}
            </InputLabel>
            <TextField
              id="my-ActualPasswordinput"
              margin="normal"
              variant="outlined"
              type={passwordType}
              name="actualpassword"
              className="w-100 border rounded"
              InputLabelProps={{
                shrink: true,
              }}
              required
              sx={{
                "& .MuiOutlinedInput-root .MuiOutlinedInput-notchedOutline": {
                  borderColor: ButtonFirst,
                },
              }}
            />
            <InputLabel
              htmlFor="my-NewPasswordinput"
              className="InputLabel d-flex justify-content-start"
            >
              {t("new_password")}
            </InputLabel>
            <TextField
              id="my-NewPasswordinput"
              margin="normal"
              variant="outlined"
              type={passwordType}
              name="newpassword"
              className="w-100 border rounded"
              fullWidth={true}
              InputLabelProps={{
                shrink: true,
              }}
              required
              sx={{
                "& .MuiOutlinedInput-root .MuiOutlinedInput-notchedOutline": {
                  borderColor: ButtonFirst,
                },
              }}
            />
            <InputLabel
              htmlFor="my-ConfirmPassword"
              className="InputLabel d-flex justify-content-start"
            >
              {t("confirm_password")}
            </InputLabel>
            <TextField
              id="my-ConfirmPassword"
              margin="normal"
              variant="outlined"
              type={passwordType}
              name="confirmPassword"
              className="w-100 border rounded"
              InputLabelProps={{
                shrink: true,
              }}
              required
              sx={{
                "& .MuiOutlinedInput-root .MuiOutlinedInput-notchedOutline": {
                  borderColor: ButtonFirst,
                },
              }}
            />
            <FormGroup>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={passwordType !== "password"}
                    onChange={togglePasswordType}
                  />
                }
                label={t("showPassword")}
              />
            </FormGroup>
            {warning ? (
              <Typography variant="Warning" sx={{ width: "100%" }}>
                <Alert severity="error">{warningMessage}</Alert>
              </Typography>
            ) : null}
            <Button
              variant="contained"
              color="primary"
              type="submit"
              className="m-1 mt-2 w-100"
              sx={{
                fontSize: "2vh",
                backgroundColor: ButtonFirst,
                "&:hover": {
                  backgroundColor: ButtonSecond,
                  color: ButtonFirst,
                },
              }}
            >
              {t("update")}
            </Button>
          </form>
        </div>
      </CustomTabPanel>
      <CustomTabPanel
        value={value}
        index={1}
        style={{ paddingLeft: "40vh", marginRight: "40vh" }}
      >
        <div>
          <form onSubmit={handleUpdateUsername}>
            <InputLabel
              htmlFor="my-actualusername"
              className="InputLabel d-flex justify-content-start"
            >
              {t("actual_username")}
            </InputLabel>
            <TextField
              id="my-actualusername"
              margin="normal"
              variant="outlined"
              name="actualusername"
              className="w-100 border rounded"
              InputLabelProps={{
                shrink: true,
              }}
              disabled
              defaultValue={username}
              sx={{
                "& .MuiOutlinedInput-root.Mui-disabled .MuiOutlinedInput-notchedOutline":
                  {
                    borderColor: ButtonFirst,
                  },
              }}
            />
            <InputLabel
              htmlFor="my-newusername"
              className="InputLabel d-flex justify-content-start"
            >
              {t("new_username")}
            </InputLabel>
            <TextField
              id="my-newusername"
              margin="normal"
              variant="outlined"
              name="newusername"
              className="w-100 border rounded"
              InputLabelProps={{
                shrink: true,
              }}
              required
              sx={{
                "& .MuiOutlinedInput-root .MuiOutlinedInput-notchedOutline": {
                  borderColor: ButtonFirst,
                },
              }}
            />
            <InputLabel
              htmlFor="my-Passwordinput"
              className="InputLabel d-flex justify-content-start"
            >
              {t("password")}
            </InputLabel>
            <TextField
              id="my-Passwordinput"
              margin="normal"
              variant="outlined"
              type={passwordType}
              name="password"
              className="w-100 border rounded"
              InputLabelProps={{
                shrink: true,
              }}
              required
              sx={{
                "& .MuiOutlinedInput-root .MuiOutlinedInput-notchedOutline": {
                  borderColor: ButtonFirst,
                },
              }}
            />
            <FormGroup>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={passwordType !== "password"}
                    onChange={togglePasswordType}
                  />
                }
                label="Show password as text"
              />
            </FormGroup>
            {warning ? (
              <Typography variant="Warning" sx={{ width: "100%" }}>
                <Alert severity="error">{warningMessage}</Alert>
              </Typography>
            ) : null}
            <Button
              variant="contained"
              color="primary"
              type="submit"
              className="m-1 mt-2 w-100"
              sx={{
                fontSize: "2vh",
                backgroundColor: ButtonFirst,
                "&:hover": {
                  backgroundColor: ButtonSecond,
                  color: ButtonFirst,
                },
              }}
            >
              {t("update")}
            </Button>
          </form>
        </div>
      </CustomTabPanel>
    </Box>
  );
}

function a11yProps(index) {
  return {
    id: `simple-tab-${index}`,
    "aria-controls": `simple-tabpanel-${index}`,
  };
}
