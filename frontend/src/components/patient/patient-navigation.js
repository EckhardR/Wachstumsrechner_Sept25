import React, { useEffect, useState } from 'react'
import { API } from '../../services/Api.js';
import { CustomSnackbar, DialogConfirmation } from '../../utils/dialog-notifications.js';
import { DetailsIcon, StationIcon, bedIcon, graphIcon } from '../../utils/global-icons.js';
import { ButtonFirst, TextFirst, TextSecond } from '../../utils/global-variables.js';
import { FcNext, FcPrevious } from 'react-icons/fc/index.esm.js';
import { globalFetchDataV2 } from '../../services/services-tool';
import { patientDetails } from '../patient/patient-view.js';
import { useTranslation } from "react-i18next";
import { Box, Button, ButtonGroup, Divider, Grid, Typography } from '@mui/material';
import { DetailsDesign } from '../../utils/table/details-design.js';

export default function PatientNavigation({ startId, onSelect }) {
  const { t } = useTranslation();
  const [selected, setSelected] = useState(null);
  const [patient, setPatient] = useState(null);
  const [patients, setPatients] = useState([]);
  
  const [isLoading, setIsLoading] = useState([]);

  const setSecondData = (data) => {    
    let startIndex = 0;
    if (startId) {
      startIndex = data.findLastIndex((item) =>item.ID === startId)
      if (startIndex < 0) startIndex = 0;
    }

    setSelected(startIndex)
    setPatient(data[startIndex])
  }

  const setError = (e) => {
    console.log(e)
  }

  useEffect(() => {
    globalFetchDataV2(patients, setPatients, API.PatientV2.getAll, setIsLoading, setSecondData, setError, true);
  }, [])


  useEffect(() => {
    onSelect(patients[selected], selected)
    setPatient(patients[selected])
    localStorage.setItem("patient", JSON.stringify(patients[selected]));
  }, [patients, selected])

  const handlePreviousPatient = () => {
    if (selected > 0) {
      setSelected(selected - 1);
    }
  }

  const handleNextPatient = () => {
    if (selected < patients.length - 1) {    
      setSelected(selected + 1);
    }
  }

  
  return (
      <>
        <Box sx={{ p: 2, border: '1px solid #EAEAEA', borderRadius: '8px' }}>
          { patient && 
            <Grid container spacing={1}>            
              <Typography variant='h7' className='fw-bolder d-flex justify-content-center w-100'>
                {t("Patient_Informations")}
              </Typography>

              <Divider className='mt-1' />
              <Grid container spacing={.4} sx={{ mt: 1 }}>
                <Grid item xs={4}>
                  <Typography className='fw-bold' sx={{ ml: 1 }}>Patient ID:</Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography>{ patient.ID}</Typography>
                </Grid>

                <Grid item xs={4}>
                  <Typography className='fw-bold' sx={{ ml: 1 }}>Name:</Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography>{patient.FirstName} {patient.LastName}</Typography>
                </Grid>
                <Grid item xs={4}>
                  <Typography className='fw-bold' sx={{ ml: 1 }}>Gender:</Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography>{patient.Gender}</Typography>
                </Grid>
                <Grid item xs={4}>
                  <Typography className='fw-bold' sx={{ ml: 1 }}>Station:</Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography>{patient.StationID}</Typography>
                </Grid>
                <Grid item xs={4}>
                  <Typography className='fw-bold' sx={{ ml: 1 }}>Bed:</Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography>{patient.BedNr}</Typography>
                </Grid>
                <Grid item xs={4}>
                  <Typography className='fw-bold' sx={{ ml: 1 }}>Details:</Typography>
                </Grid>

                <Grid item xs={6} className='d-flex justify-content-start'>
                  <DetailsDesign
                    Title={`Patient Details N°: ${patient?.ID}`}
                    children={patientDetails(patient)}
                    icon={DetailsIcon}
                    ID={patient.ID}
                  />
                </Grid>                       
              </Grid>

              <Divider className='mb-1' />
              <Grid item xs={12}>
                <ButtonGroup fullWidth>
                  <Button variant='outlined' disabled={selected === 0 } startIcon={<FcPrevious size={20} />} onClick={handlePreviousPatient}>
                    Previous
                  </Button>
                  <Button variant='outlined' disabled={selected >= patients.length - 1} endIcon={<FcNext size={20} />} onClick={handleNextPatient}>
                    Next
                  </Button>
                </ButtonGroup>
              </Grid>

              <Grid item xs={12} sx={{ m: 0, p: 0 }}>
                <div style={{ maxHeight: '58vh', overflowY: 'auto' }}>
                  { patients?.map((element, index) => (
                    <Button
                      key={index + 'patient'}
                      variant={'text'}
                      onClick={() => setSelected(index)}
                      fullWidth
                      style={{ backgroundColor: index === selected ? ButtonFirst : null, minHeight: '4vh' }}
                      className='border-bottom'
                    >
                      <Grid container spacing={1}>
                        <Grid item xs={6} sx={{ color: index === selected ? TextFirst : TextSecond, textAlign: 'start' }}>
                          { element?.FirstName } { element?.LastName }
                        </Grid>
                        <Grid item xs={3} sx={{ color: index === selected ? TextFirst : TextSecond, textAlign: 'start' }}>
                          {StationIcon} {element?.StationID}
                        </Grid>
                        <Grid item xs={3} sx={{ color: index === selected ? TextFirst : TextSecond, textAlign: 'start' }} >
                          {bedIcon}{element?.BedNr}
                        </Grid>
                      </Grid>
                    </Button>
                  ))}
                </div>
              </Grid>

            </Grid>
            
          } 
          
          { !patient && 
            <p>No Patient found</p>
          }
      </Box>
    </>
  )
}