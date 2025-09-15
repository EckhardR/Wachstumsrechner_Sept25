import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  TextField,
  Button,
  Grid,
  Alert,
  FormGroup,
  FormControlLabel,
  Checkbox,
  InputLabel,
} from "@mui/material";
import { Link, useNavigate } from "react-router-dom";
import { PATIENT, SINGUP } from "../../routes/Routes-Links.js";
import { API } from "../../services/Api.js";
import {
  BackgroundFirst,
  BackgroundSecond,
  ButtonSecond,
  TextFirst,
} from "../../utils/global-variables.js";
import SingInImage from "../../images/SingInImage.png";
import {
  setAuthCookies,
  setUserEmailCookies,
  setUserNameCookies,
} from "../../services/CookiesUtils.js";

//import setAuthToken from "../../services/axios-config";
import { useAuth } from "../../services/AuthProvider.js";
import { useTranslation } from "react-i18next";

/*****************************************************************************************************************************************************
 *
 * The "LoginForm" function is a React component that represents a login form.
 * It consists of a container box that contains a form with text fields for username and password, as well as a login button.
 * There is also an IconButton that allows the user to show or hide the password.
 * When the user clicks the login button, the "handleSubmit" function is called.
 * This function invokes the "navigate" function, which redirects the user to the admin page.
 * There is also a warning that this form is intended for professors only and not for students.
 *
 *****************************************************************************************************************************************************/

interface LoginProps {
  authStatus: any;
  authUser: any;
}

function LoginForm(props: LoginProps) {
  const { t } = useTranslation();
  const [passwordType, setPasswordType] = useState("password");
  const [keepMeLogin, setKeepMeLogin] = useState(false);
  const [wrongPassword, setWrongPassword] = useState(false);
  const [userDeactivated, setUserDeactivated] = useState(false);
  
  const { isAuthenticated, setIsAuthenticated } = useAuth();
  const navigate = useNavigate();

  // useEffect(() => {
  //   if (isAuthenticated) {
  //     navigate(PATIENT);
  //   }
  // }, [isAuthenticated, navigate]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    const Email = event.target.Email.value;
    const Password = event.target.Password.value;
    const loginResults = await API.UserV2.login(Email, Password).catch((error) => {
      if(error?.response?.status === 403){
        setUserDeactivated(true)
        return;
      }
    })
    //console.log('loginResultsloginResults', loginResults)

    if(!loginResults?.data) {
      return;
    } else if (!loginResults.data.user?.Authenticated) {
      setWrongPassword(true);    
    } else {
      const { accessToken, refreshToken, user } = loginResults.data;
      const isAuthenticated = user?.Authenticated;

      // setAuthToken(accessToken);

      setAuthCookies(user?.ID, accessToken, refreshToken, isAuthenticated, user?.Role, user?.ClinicID, user?.StationID);
      setUserNameCookies(user?.Username);
      setIsAuthenticated(isAuthenticated);
      setUserEmailCookies(user?.Email_Address);
      
      localStorage?.setItem(
        "refreshToken",
        JSON.stringify({
          refreshToken: refreshToken,
          authUser: accessToken,
        })
      );

      console.log("### user###: ", user)

      localStorage?.setItem("authStatus", Boolean(user?.AccountStatus));

      localStorage?.setItem(
        "authUser",
        JSON.stringify({
          accessToken: accessToken,
        })
      );

      localStorage?.setItem(
        "user",
        JSON.stringify({
          Username: user?.Username,
          FirstName: user?.First_Name
        })
      );

      localStorage?.setItem(
        "accessToken",
        JSON.stringify({
          accessToken: accessToken,
        })
      );

      localStorage?.setItem(
        "role",
        JSON.stringify({
          role: user?.Role,
        })
      );

      
      
      window.dispatchEvent(new Event("storage"));
      navigate(`${PATIENT}`, { state: { user: user } });
    }
  };

  const togglePasswordType = () => {
    setPasswordType(passwordType === "password" ? "text" : "password");
  };

  return (
    <Grid container spacing={0} sx={{ height: "100vh", pb: 0, mb: 0 }}>
      <Grid
        item
        xs={6}
        sx={{ backgroundColor: BackgroundSecond, minHeight: "52vh", m: 0 }}
      >
        <div className="d-flex flex-column m-4 p-2 pt-4  ml-0 mr-0 text-center text-white fw-bold">
          <Box display="flex" flexDirection="column" alignItems="center" mt={2}
            sx={{
              borderRadius: 1
            }}>
            <Typography variant="h4" className="mb-1 fw-semibold">
              {t("let_sing_you")}
            </Typography>
            <Typography
              variant="h8"
              className="mb-4 fw-semibold d-flex flex-row"
            >
              <div className="d-flex justify-content-start">
                {t("welcome_to_our_page")}
              </div>
              <Link
                className="d-flex justify-content-end"
                style={{ marginLeft: "15px", color: TextFirst }}
                to={SINGUP}
              >
                {t("singup")}
              </Link>
            </Typography>
            <form onSubmit={handleSubmit} className="d-flex flex-column w-100">
              <InputLabel
                htmlFor="my-Emailinput"
                className="d-flex justify-content-start"
                style={{ color: TextFirst }}
              >
                {t("email")}
              </InputLabel>
              <TextField
                id="my-Emailinput"
                margin="normal"
                variant="outlined"
                name="Email"
                className="w-100 border rounded"
                style={{ backgroundColor: BackgroundFirst }}
                InputLabelProps={{
                  shrink: true,
                }}
                required
              />
              <InputLabel
                htmlFor="my-Passwordinput"
                className="d-flex justify-content-start"
                style={{ color: TextFirst }}
              >
                {t("password")}
              </InputLabel>
              <TextField
                id="my-Passwordinput"
                margin="normal"
                variant="outlined"
                type={passwordType}
                name="Password"
                className="w-100 border rounded"
                style={{ backgroundColor: BackgroundFirst }}
                InputLabelProps={{
                  shrink: true,
                }}
                required
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
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={keepMeLogin}
                      onChange={() => setKeepMeLogin(!keepMeLogin)}
                    />
                  }
                  label={t("keepMeLogin")}
                />
              </FormGroup>
              {wrongPassword ? (
                <Typography variant="Warning" sx={{ width: "100%" }}>
                  <Alert severity="error">
                    The login credentials are invalid. Please check your{" "}
                    <strong className="text-nowrap border">
                      email address
                    </strong>{" "}
                    and your{" "}
                    <strong className="text-nowrap border">password</strong> and
                    try again.
                  </Alert>
                </Typography>
              ) : null}

              {userDeactivated ? (
                <Typography variant="Warning" sx={{ width: "100%" }}>
                  <Alert severity="error">
                    Unable to login. Please inform the admin to enable your account.
                  </Alert>
                </Typography>
              ) : null}
              <Button
                variant="contained"
                color="primary"
                type="submit"
                className="mt-2"                
                sx={{
                  fontSize: "2vh",
                  backgroundColor: ButtonSecond,
                }}
              >
                {t("singin")}
              </Button>
            </form>
          </Box>
        </div>
      </Grid>
      <Grid
        item
        xs={6}
        className="rounded"
        sx={{ backgroundColor: BackgroundFirst, display: 'flex', alignItems: 'center' }}
      >
        <img
          src={SingInImage}
          height={"auto"}
          width={"100%"}
          style={{ position: "relative", left: "-13%" }}
          alt=""
        />
      </Grid>
    </Grid>
  );
}

export default LoginForm;
