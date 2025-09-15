import React, { useEffect } from "react";
import { Grid, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";
import BiggerLogo from "../../images/BiggerLogo.png";
import {
  BackgroundFirst,
  BackgroundSecond,
  ButtonFirst,
  ButtonSecond,
  TextFirst,
} from "../../utils/global-variables.js";
import { ADMINSCREEN, LOGIN, PATIENT, SINGUP } from "../../routes/Routes-Links.js";
import { NavigationsButton } from "../../utils/table/table-tools.js";
import { useAuth } from "../../services/AuthProvider";
import { useTranslation } from "react-i18next";

export default function Home() {
  const { isAuthenticated } = useAuth();
  const { t } = useTranslation();
  const navigate = useNavigate();

  useEffect(() => {
    if (isAuthenticated) {
      navigate(PATIENT);
    }
  }, [isAuthenticated, navigate]);

  return (
    <Grid container

      sx={(theme) => ({
        // [theme.breakpoints.up("sm")]: {
        //   minHeight: 'calc(100vh - 25px)'
        // },
        minHeight: 'calc(100vh - 25px)',
        pb: 0,
        mb: 0
      })}
      
    
    >
      <Grid
        item
        xs={12}
        md={6}
        className="rounded"
        alignItems={'center'}
        sx={{ backgroundColor: BackgroundFirst, display: 'flex', alignItems: 'center', justifyContent: 'center' }}
      >
        <div style={{marginBottom: '30px'}}>
          <img
            src={BiggerLogo}
            alt="KraftDat Small Logo"
            width={"100%"}
            height={"auto"}
            style={{maxWidth: '500px'}}
          />
          <div className="d-flex flex-column align-items-center">
            <NavigationsButton
              className="btn btn-primary mb-2 w-100"
              style={{
                backgroundColor: ButtonFirst,
                color: TextFirst,
                maxWidth: "60%",
                fontSize: "2vh",
              }}
              path={LOGIN}
              inhalt={"Login"}
            />
            <NavigationsButton
              className="btn btn-primary w-100"
              style={{
                backgroundColor: ButtonSecond,
                color: TextFirst,
                maxWidth: "60%",
                fontSize: "2vh",
              }}
              path={SINGUP}
              inhalt={"Sign Up"}
            />
          </div>
        </div>
      </Grid>
      <Grid
        item
        xs={12}
        md={6}
        sx={{ backgroundColor: BackgroundSecond, mb: 0, display: 'flex', alignItems: 'center' }}
      >
       
          <Typography
          className="m-4 p-2 pt-4 text-center text-white fw-bold"
            sx={{
              fontSize: {
                lg: 30,
                md: 20,
                sm: 15,
                xs: 16
              }
            }}
          >
            Welcome to our management app designed to help doctors monitor the
          growth and development of children. Our app provides a comprehensive
          platform to keep track of the child's weight, height, and other key
          indicators, and notifies doctors when it's time for a check-up. With
          this app, we can be sure that this child is growing healthily and
          meeting all the important milestones along the way.
          </Typography>
          
      </Grid>

    </Grid>
  );
}
