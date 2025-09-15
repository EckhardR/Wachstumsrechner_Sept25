import React from "react";
import { Button, Menu, MenuItem } from '@mui/material';
import { Link } from "react-router-dom";
import { HOME, ADMINSCREEN, CHART, PATIENT_TASKS, TODOS, PATIENTCAPTURE, PATIENT, PATIENTARCHIV } from '../../routes/Routes-Links.js';
import smallLogo from "../../images/smallLogo.png";
import IconButton from '@mui/material/IconButton';
import { useNavigate } from 'react-router-dom';

import { API } from '../../services/Api.js';

import DrawerNavbar from "./DrawerBox.js";
import { useAuth } from "../../services/AuthProvider";

import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';

export default function TopNavbar() {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  let linkTo = isAuthenticated ? PATIENT : HOME;

  const [tasksEl, setTasksEl] = React.useState(null);
  const [patientsEl, setPatientsEl] = React.useState(null);
  
  const tasksOpen = Boolean(tasksEl);
  const patientsOpen = Boolean(patientsEl);

  const handleClose = () => {
    setTasksEl(null);
    setPatientsEl(null);
  };
  
  return (
    <>
     { isAuthenticated &&
      <Box sx={{ flexGrow: 1, marginBottom: '30px' }}>
        <AppBar className="appbar" position="static">
          <Toolbar>
            <IconButton
              size="sm"
              edge="start"
              color="inherit"
              aria-label="menu"
              sx={{ mr: 2 }}
              disableRipple
            >
              <Link to={linkTo}>
                <img
                  className="menu-icon"
                  src={smallLogo}
                  alt="Growth Calculator"                
                />
              </Link>
            </IconButton>
            <Typography variant="h6" component="div" sx={{ flexGrow: 1 }} />
            
            <Button onClick={() => navigate(PATIENT)} color="inherit">
              Patients
            </Button>


            <Button onClick={ (event) => setTasksEl(event.currentTarget)} color="inherit">
              TASKS
            </Button>
            
            <Menu
              id="tasks-menu"
              anchorEl={tasksEl}
              open={tasksOpen}
              onClose={handleClose}
              MenuListProps={{
                'aria-labelledby': 'basic-button',
              }}
            >
              <MenuItem onClick={() => { handleClose(); navigate(PATIENT_TASKS) }}>COMMON</MenuItem>
              <MenuItem onClick={() => { handleClose(); navigate(TODOS) }}>DAILY</MenuItem>
              
            </Menu>

            <Button onClick={() => navigate(CHART)} color="inherit">
              {/* navigate(CHART, { state: { patientForChart: row, otherPatient: records } })}> */}
              Charts
            </Button>

            <Button onClick={() => navigate(PATIENTCAPTURE)} color="inherit">
              Capture
            </Button>

            <Button onClick={() => navigate(ADMINSCREEN)} color="inherit">
              Administration
            </Button>
            <DrawerNavbar />
          </Toolbar>
        </AppBar>
      </Box>
    }    
    </>
  );
}
