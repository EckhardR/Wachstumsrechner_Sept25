import { Box, Grid } from '@mui/material';
import React, { useEffect, useReducer, useRef, useState } from 'react';
import { useLocation } from 'react-router-dom';
import GrowthChart from './growth-chart.js';
import { CancelButton } from '../../../utils/table/table-tools.js';
import PatientNavigation from '../../patient/patient-navigation.js';
import { API } from '../../../services/Api.js';

export default function ProcessChart() {
  const location = useLocation();
  const [patient, setPatient] = useState(location.state?.patientForChart || []);
  const [growthDataForActualPatient, setGrowthDataForActualPatient] = useState(location.state?.growthDataForActualPatient || []);
  
  const tableCellRef = useRef(null);
  const [updateState, forceUpdate] = useReducer((x) => x + 1, 0);

  const [error, setError] = useState([]);

  const fetchGrowthData = async (ID) => {
    try {
      setPatient(location.state?.patientForChart || null);
      if (ID) {
        const results = await API.TodosV2.getGrowthDataWithID(ID);
        setGrowthDataForActualPatient(results.data);
      }
    } catch (err) {
      setError([...error, err.message]);
    }
  };

  const loadPatientChart = (selectedPatient) => {
    handlePatientSelect(selectedPatient, 0);
  }

  useEffect(() => {
    if (location.state?.patientForChart?.ID) {
      fetchGrowthData(location.state?.patientForChart?.ID);
    } else {
      if (patient){
        handlePatientSelect(patient, 0);
      } else {
        console.log("##### NODDATA #####");
      }
    }
  }, [location, updateState]);

  const handlePatientSelect = (selectedPatient, index) => {
    console.log('>>>>>>>>>>', index)
    fetchGrowthData(selectedPatient?.ID);
    setPatient(selectedPatient);
    if (tableCellRef.current) {
      const targetButton = tableCellRef.current.childNodes[index];
      if (targetButton) {
        targetButton.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'start' });
      }
    }
  };


  return (
    <>
      <CancelButton />
      <Box>
        <Grid container spacing={1}>
          <Grid item xs={12} md={5} lg={3}>

            <PatientNavigation startId={location.state?.patientForChart?.ID} onSelect={(data, index) => {
              if (data && data.ID) {
                setPatient(data)
                loadPatientChart(data)
              }
            }} />

          </Grid>
          <Grid item xs={12} md={7} lg={9} sx={{ pr: 2, pt: 2, mt: 6 }}>
            <Box className='border border-dark' sx={{ p: 1, pr: 0, height: '100%' }}>
              <GrowthChart childData={patient} selected={patient} growthData={growthDataForActualPatient} forceUpdate={forceUpdate} updateState={updateState} />
            </Box>
          </Grid>
        </Grid>
      </Box>
    </>
  );
}
