import React, { useEffect, useState } from 'react'


import { API } from '../../../services/Api.js';
import { globalFetchDataV2 } from '../../../services/services-tool.js';
import {  Button, ButtonGroup, Grid, Stack } from '@mui/material';
import { newElemenetIcon, PdfIcon } from '../../../utils/global-icons.js';
import PatientNavigation from '../../patient/patient-navigation.js';
import { TaskDetailsModal } from './task-details-modal.js';
import { AdmissionDetailsModal } from './admission-details-modal.js';
import { RoutineDetailsModal } from './routine-details-modal.js';
import { DialogConfirmation } from '../../../utils/dialog-notifications.js';

import ExportPatientTasks from "./export-patient-tasks.js";

import { getProcessDate } from '../../../utils/tasks-helper.js';

import { useTranslation } from "react-i18next";

import ExportAllPatientsTasks, {
  ExportMultiplTasksDialog,
} from "./export-all-patients-tasks.js";
import { GlobalDialog } from '../../../utils/table/details-design.js';
import { ButtonFirst, TextFirst } from '../../../utils/global-variables.js';
import TasksViewTable from './tasks-view-table.js';

const columns = [
  { id: 'Title', label: 'Title', minWidth: 170 },
  { id: 'Description', label: 'Description', minWidth: 100 },
  { id: 'Type', label: 'Type', minWidth: 170 },
  { id: 'Deadline', label: 'Date', minWidth: 170, format:'formatDate' },
];

const columnsArchive = [
  { id: 'Title', label: 'Title', minWidth: 170 },
  { id: 'Description', label: 'Description', minWidth: 100 },
  { id: 'Type', label: 'Type', minWidth: 170 },
  { id: 'ProcessedAt', label: 'Processed', minWidth: 170, format:'formatDateTime' }
];


const PatientTasksView = () => {
  const [tasks, setTasks] = useState([]);
  const [patients, setPatients] = useState([]);
  const [patient, setPatient] = useState(null);
  const [details, setDetails] = useState(null);
  const [isLoading, setIsLoading] = useState([]);

  const [selectedToExport, setSelectedToExport] = useState([])

  const { t } = useTranslation();

  const setPatientsSecondData = (data) => {
    console.log("setPatientsSecondData: ", data);
  }

  const setTasksSecondData = (data) => {
    // extend Deadline with a date
    const newData = data.map(item => {
      if(item.Type === 'routine') {
        item.Deadline = getProcessDate(patient, item);
      }      
      return item;
    })
    setTasks(newData)
  }

  const isOverdue = (date) => {
    if(!date) return false;
    const today = new Date();
    const Deadline = new Date(date);
    return Deadline <= today;
  }

  const setError = (e) => {
    console.log(e)
  }

  useEffect(() => {
    globalFetchDataV2(patients, setPatients, API.PatientV2.getAll, setIsLoading, setPatientsSecondData, setError, true);
  }, [])


  const loadPatientTasks = (id) => {
    globalFetchDataV2(tasks, setTasks, () => API.TasksV2.getPatientsTasks(id), setIsLoading, setTasksSecondData, setError, true);
  }


  const setTaskDone = async(data, bool) => {
    let response;  
    if(bool === true) {
      response = await API.TasksV2.processPatientsTask(data.ID).catch( (error) => {  
        setError(() => {
            setIsLoading(false);
            return error
        });
        setIsLoading(false);
        return;
      });
    } else {
      response = await API.TasksV2.unProcessPatientsTask(data.ID).catch( (error) => {
        setError(() => {
            setIsLoading(false);
            return error
        });
        setIsLoading(false);
        return;
      });
    }  
      
    if(response && response.data){
        loadPatientTasks(patient.ID)
    }
  }

  const onSaveHandler = async(action, formData) => {
    
    let response;
    switch(action) {
      case 'create':        
        response = await API.TasksV2.createPatientsTask({ ID: patient.ID, ...formData}).catch( (error) => {          
          setError(() => {
              setIsLoading(false);
              return error
          });
          setIsLoading(false);
          return;
        });        
        break;

      case 'edit':
        response = await API.TasksV2.updatePatientsTask(formData.ID, formData).catch( (error) => {
          setError(() => {
              setIsLoading(false);
              return error
          });
          setIsLoading(false);
          return;
        });
        break;
      default:
        
    }

    if(response && response.data) {
      loadPatientTasks(patient.ID)
      setDetails(null)
    }
  }

  const onDeleteHandler = (data) => {
    DialogConfirmation('DELETE', `Are you sure you want to delete this task: ${data?.Title}?`,
      async () => {
        const response = await API.TasksV2.deletePatientsTask(data.ID).catch( (error) => {
          setError(() => {
              setIsLoading(false);
              return error
          });
          setIsLoading(false);          
          return;
        });

        if(response && response.data) {
          loadPatientTasks(patient.ID)
        }        
      });
  }

  const defaultState = {
    Title: '',
    Description: '',
    type: 'individual',
    Deadline: new Date().toISOString().slice(0, 10)
  }

  return (
    <>   
      { details && details?.data?.Type === 'individual' && <TaskDetailsModal details={details} onSave={onSaveHandler} onClose={ () => setDetails(null)} /> }
      { details && details?.data?.Type === 'admission' && <AdmissionDetailsModal details={details} onSave={onSaveHandler} onClose={ () => setDetails(null)} /> }
      { details && details?.data?.Type === 'routine' && <RoutineDetailsModal details={details} onSave={onSaveHandler} onClose={ () => setDetails(null)} /> }

      <Grid container spacing={2} sx={{p:2}}>

       
        <Grid item xs={6} md={4} lg={3}>

        <ButtonGroup size="small" sx={{marginBottom:2}}>
          <Button
            startIcon={PdfIcon}
            onClick={() => ExportPatientTasks(patient.ID)}
          >PATIENT</Button>
          
          <GlobalDialog
            Title={`Export Multiple Tasks`}
            children={<ExportMultiplTasksDialog rows={patients} selectedToExport={selectedToExport} setSelectedToExport={setSelectedToExport} />}
            textButton={"All"}
            sty={{
              color: '#1976d2',
              width: "100%",
              height: "100%",
              borderColor: "#1976d280",
              borderRadius: "1px",
              borderTopRightRadius: '4px',
              borderBottomRightRadius: '4px'

            }}
            Icon={PdfIcon}
            secondButton={
              <Button
                style={{ backgroundColor: ButtonFirst, color: TextFirst }}
                onClick={() => {
                    ExportAllPatientsTasks(patients, selectedToExport, setSelectedToExport)
                  }
                }
                className="btn btn-lg btn-block"
              >
                {t("Export")}
              </Button>
            }
            ID={"ExportMultipleClasses"}
          />

        </ButtonGroup>

          <PatientNavigation onSelect={(data, index) => {
            if (data && data.ID) {
              setPatient(data)
              loadPatientTasks(data.ID)      
            }
          }} />
        </Grid>
        <Grid item xs={6} md={8} lg={9}>
          <Stack direction="row" spacing={1} sx={{ justifyContent: "space-between", alignItems: "flex-start" }}>
            <h4>Todos</h4>
            { /* <small>{JSON.stringify({ Title: 'CREATE', action: 'create', data: defaultState })}</small> */ }

            <Button
              variant="outlined"
              startIcon={newElemenetIcon}
              onClick={() => setDetails({ Title: 'CREATE', action: 'create', data: defaultState })}
            >NEW</Button>
              
          </Stack>

         
          { tasks && tasks.length > 0 &&
            <TasksViewTable
              columns={columns}
              tasks={tasks.filter((item) => !item.Processed && isOverdue(item.Deadline))}
              setTaskDone={(row, bool) => setTaskDone(row, bool)}
              setDetails={(data) => setDetails(data)}
              onDeleteHandler={(row) => onDeleteHandler(row)}
            />
          } 
        </Grid>

        <Grid item xs={6} md={4} lg={3}></Grid>

        <Grid item xs={6} md={8} lg={9}>
          <h4>Upcomming</h4>
          { tasks && tasks.length > 0 &&
            <TasksViewTable
              columns={columns}
              tasks={tasks.filter((item) => !item.Processed && !isOverdue(item.Deadline))}
              setTaskDone={(row, bool) => setTaskDone(row, bool)}
              setDetails={(data) => setDetails(data)}
              onDeleteHandler={(row) => onDeleteHandler(row)}
            />
          } 
        </Grid>
        

        <Grid item xs={6} md={4} lg={3}></Grid>

          <Grid item xs={6} md={8} lg={9}>
            <h4>Archive</h4>
            { tasks && tasks.length > 0 &&
              <TasksViewTable
                columns={columnsArchive}
                tasks={tasks.filter((item) => item.Processed)}
                setTaskDone={(row, bool) => setTaskDone(row, bool)}
                setDetails={(data) => setDetails(data)}
                onDeleteHandler={(row) => onDeleteHandler(row)}
              />
            } 
          </Grid>
        </Grid>
      
    </>
  );

}


export default PatientTasksView
