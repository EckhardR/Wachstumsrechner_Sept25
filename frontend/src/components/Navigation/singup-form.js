import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  TextField,
  Button,
  Grid,
  Alert,
  InputLabel,
  Autocomplete,
} from "@mui/material";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { LOGIN, SINGUPSUCESS } from "../../routes/Routes-Links.js";
import { globalFetchDataV2 } from "../../services/services-tool.js";
import { API } from "../../services/Api.js";
import {
  BackgroundFirst,
  BackgroundSecond,
  ButtonSecond,
  TextFirst,
} from "../../utils/global-variables.js";
import singUpImage from "../../images/SingUpImage.png";
import { useTranslation } from "react-i18next";

function SingupForm(props: SingupProps) {
  const { t } = useTranslation();
  const location = useLocation();
  const [warning, setWarning] = useState(false);
  const [warningMessage, setWarningMessage] = useState("");
  const [stationFetchedData, setStation] = useState([]);
  const [clinicFetchedData, setClinic] = useState([]);
  const [ClinicID, setClinicID] = useState(null);
  const [stationID, setStationId] = useState(null);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    globalFetchDataV2(
      clinicFetchedData,
      setClinic,
      API.ClinicV2.getAll,
      setIsLoading,
      console.log,
      () => {
        setWarning(true);
        setWarningMessage('Fehler beim laden der Clinic')
      },
      true
    );

    globalFetchDataV2(
      stationFetchedData,
      setStation,
      API.StationV2.getAll,
      setIsLoading,
      console.log,
      () => {
        setWarning(true);
        setWarningMessage('Fehler beim laden der Station')
      },
      true
    );
          
    // eslint-disable-next-line react-hooks/exhaustive-deps
}, []);


  const handleSubmit = async (event) => {
    event.preventDefault();
    const FirstName = event.target.FirstName.value;
    const LastName = event.target.LastName.value;
    const Email = event.target.Email.value;
    const Birthdate = event.target.Birthdate.value;
    const newUser = {      
      FirstName: FirstName,
      LastName: LastName,
      Email_Address: Email,
      ClinicID: ClinicID,
      StationID: stationID,
      Birthdate: Birthdate,
    };
    try {
      await API.UserV2.create(newUser).then((results) => {
        if (results.data === "Email already exists") {
          setWarning(true);
          setWarningMessage(results.data);
          // navigate(`${SINGUPSUCESS}`, { state: { name: FullName } });
        } else navigate(`${SINGUPSUCESS}`, { state: { name: FirstName + ' ' + LastName} });
      });
    } catch (error) {
      setWarning(true);
      setWarningMessage(error);
    }
  };


  return (
    <>
      <Grid container sx={{ height: "100%", pb: 0, mb: 0 }}>
        <Grid
          item
          xs={12}
          sm={6}
          sx={{ backgroundColor: BackgroundSecond, minHeight: "calc(100vh - 25px)", mb: 0 }}
        >
          <div className="d-flex flex-column m-4 p-2 pt-4  ml-0 mr-0 text-center text-white fw-bold">
            <Box
              display="flex"
              flexDirection="column"
              alignItems="center"
              p={2}
              mt={1}
            >
              <Typography variant="h4" className="mb-1 fw-semibold">
                {t("let_sing_you_up")}
              </Typography>
              <Typography
                variant="h8"
                className="mb-2 fw-semibold d-flex flex-row"
              >
                <div className="d-flex justify-content-start">
                  Welcome to our Page
                </div>
                <Link
                  className="d-flex justify-content-end"
                  style={{ marginLeft: "15px", color: TextFirst }}
                  to={LOGIN}
                >
                  {t("singin")}
                </Link>
              </Typography>
              <form
                onSubmit={handleSubmit}
                className="d-flex flex-column w-100"
              >
                <InputLabel
                  htmlFor="my-FirstName"
                  className="d-flex justify-content-start "
                  style={{ color: TextFirst }}
                >
                  {t("First_Name")}*
                </InputLabel>
                <TextField
                  id="my-FirstName"
                  margin="normal"
                  variant="outlined"
                  name="FirstName"
                  className="w-100 border rounded m-1"
                  style={{ backgroundColor: BackgroundFirst }}
                  InputLabelProps={{
                    shrink: true,
                  }}
                  required
                />
                <InputLabel
                  htmlFor="my-LastName"
                  className="d-flex justify-content-start "
                  style={{ color: TextFirst }}
                >
                  {t("Last_Name")}*
                </InputLabel>
                <TextField
                  id="my-LastName"
                  margin="normal"
                  variant="outlined"
                  name="LastName"
                  className="w-100 border rounded m-1"
                  style={{ backgroundColor: BackgroundFirst }}
                  InputLabelProps={{
                    shrink: true,
                  }}
                  required
                />
                <InputLabel
                  htmlFor="my-E-Mail"
                  className="d-flex justify-content-start"
                  style={{ color: TextFirst }}
                >
                  {t("email")}*
                </InputLabel>
                <TextField
                  id="my-E-Mail"
                  margin="normal"
                  variant="outlined"
                  name="Email"
                  className="w-100 border rounded m-1"
                  style={{ backgroundColor: BackgroundFirst }}
                  InputLabelProps={{
                    shrink: true,
                  }}
                  required
                />
                <InputLabel
                  htmlFor="my-birthdate"
                  className="d-flex justify-content-start"
                  style={{ color: TextFirst }}
                >
                  {t("Birth_date")}
                </InputLabel>
                <TextField
                  id="my-birthdate"
                  margin="normal"
                  variant="outlined"
                  type="date"
                  name="Birthdate"
                  defaultValue={"1985-01-01"}
                  className="w-100 border rounded m-1"
                  InputLabelProps={{
                    shrink: true,
                  }}
                  sx={{
                    backgroundColor: BackgroundFirst,
                  }}
                  required
                />
                <InputLabel
                  htmlFor="my-Department"
                  className="d-flex justify-content-start"
                  style={{ color: TextFirst }}
                >
                  {t("Clinic")}
                </InputLabel>
                <Autocomplete
                  id="ClinicID-demo"
                  options={clinicFetchedData}
                  getOptionLabel={(option) => option.Name}
                  getOptionKey={(option) => option.ID}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      InputProps={{
                        ...params.InputProps,
                      }}
                      InputLabelProps={{
                        shrink: true,
                      }}
                      sx={{
                        backgroundColor: BackgroundFirst,
                      }}
                    />
                  )}
                  onChange={(event, newValue) => {
                    setClinicID(newValue ? newValue.ID : null);
                  }}
                />
                <InputLabel
                  htmlFor="my-Department"
                  className="d-flex justify-content-start"
                  style={{ color: TextFirst }}
                >
                  {t("Station")}
                </InputLabel>
                <Autocomplete
                  id="ClinicID-demo"
                  options={stationFetchedData.filter((item) => {
                    if (!ClinicID) {
                      return false
                    }
                    return item.ClinicID === ClinicID
                  })}
                  getOptionLabel={(option) => option.Name}
                  getOptionKey={(option) => option.ID}
                  disabled={!ClinicID}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      InputProps={{
                        ...params.InputProps,
                      }}
                      InputLabelProps={{
                        shrink: true,
                      }}
                      sx={{
                        backgroundColor: BackgroundFirst,
                      }}
                    />
                  )}
                  onChange={(event, newValue) => {
                    setStationId(newValue ? newValue.ID : null);
                  }}
                />
                {warning ? (
                  <Typography variant="Warning" sx={{ width: "100%" }}>
                    <Alert severity="error">{warningMessage}</Alert>
                  </Typography>
                ) : null}
                <Button
                  variant="contained"
                  color="primary"
                  type="submit"
                  className="mt-4"
                  sx={{
                    width: "100%",
                    fontSize: "2vh",
                    backgroundColor: ButtonSecond,
                  }}
                >
                  {t("singup")}
                </Button>
              </form>
            </Box>
          </div>
        </Grid>
        <Grid
          item
          xs={12}
          sm={6}
          className="rounded"
          sx={{ backgroundColor: BackgroundFirst, minHeight: "calc(100vh - 25px)", mb: 0, order: 2 }}
        >
          <img
            src={singUpImage}
            width={"100%"}
            style={{ marginTop: "15vh" }}
            height={"auto"}
            alt="Dr."
          />
        </Grid>
      </Grid>
    </>
  );
}

export default SingupForm;
