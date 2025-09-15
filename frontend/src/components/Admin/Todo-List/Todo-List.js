import {
  Box,
  Button,
  ButtonGroup,
  Divider,
  Grid,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";
import React, { useEffect, useReducer, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  BackgroundFirst,
  BackgroundFourth,
  BackgroundThird,
  ButtonFirst,
  TextFirst,
  TextSecond,
} from "../../../utils/global-variables.js";
import {
  DetailsDesign,
  GlobalDialog,
} from "../../../utils/table/details-design.js";
import {
  DetailsIcon,
  DoneIcon,
  EditIcon,
  SaveIcon,
  StationIcon,
  bedIcon,
  downloadIcon,
  graphIcon,
} from "../../../utils/global-icons.js";
import {
  CancelButton,
  returnIfNotNullOrUndefined,
} from "../../../utils/table/table-tools.js";
import { FcNext, FcPrevious, FcTodoList } from "react-icons/fc/index.esm.js";
import { API } from "../../../services/Api.js";
import { patientDetails } from "../../patient/patient-view.js";
import { TaskDetails } from "../tasks/task-view.js";
import {
  CustomSnackbar,
  DialogConfirmation,
} from "../../../utils/dialog-notifications.js";
import HandleAxiosError from "../../../utils/handle-axios-error.js";
import ExportTodoList from "./Export-TodoList.js";
import TodoListToProcessArchiv from "./TodoList-Archiv.js";
import { createSimpleTask, createTodoTask,  } from "./Indiv-Task-Creator.js";
import ExportMultipleTodoList, {
  ExportMultiplTasksDialog,
} from "./Export-TodoList-Multipl.js";
import { useTranslation } from "react-i18next";


import { globalFetchDataV2 } from '../../../services/services-tool.js';

const isBetweenBirthWeight = (patient, lowerValue, upperValue) => {
  if (patient.BirthWeight >= lowerValue && patient.BirthWeight <= upperValue) {
    return true;
  } else {
    return false;
  }
};

const isBetweenGestationsalter = (patient, lowerValue, upperValue) => {
  // Calculate the total gestational age in days
  const gestationalAgeInDays =
    patient.GestationalWeek * 7 + patient.GestationalDay;

  // Check if the gestational age is within the specified range
  return (
    gestationalAgeInDays >= lowerValue && gestationalAgeInDays <= upperValue
  );
};

const needToBeRepeated = (patient, frequencTime, startDay) => {
  // Calculate the current age
  const currentAge = getCurrentAge(patient);

  // Convert the current age to days
  const currentAgeDays = currentAge.weeks * 7 + currentAge.days;

  // Calculate the number of days since the start day
  const startDayDate = new Date(startDay);
  const currentDate = new Date();
  const timeDifference = currentDate - startDayDate;
  const daysSinceStartDay = Math.floor(timeDifference / (1000 * 60 * 60 * 24));

  // Check if the current age has reached the frequency time
  if (currentAgeDays >= frequencTime && daysSinceStartDay >= frequencTime) {
    return true;
  } else {
    return false;
  }
};

const getCurrentAge = (patient) => {
  // Parse the birthday string into a Date object
  const birthDate = new Date(patient.Birthday);

  // Calculate the age in days
  const currentDate = new Date();
  const timeDifference = currentDate - birthDate;
  const ageDays = Math.floor(timeDifference / (1000 * 60 * 60 * 24));

  // Convert the age to weeks and days
  const ageWeeks = Math.floor(ageDays / 7);
  const ageDaysRemainder = ageDays % 7;

  return {
    weeks: ageWeeks,
    days: ageDaysRemainder,
  };
};

const getPostmenstrualAge = (patient) => {
  // Parse the birthday string into a Date object
  const birthDate = new Date(patient.Birthday);

  // Calculate the chronological age in days
  const currentDate = new Date();
  const timeDifference = currentDate - birthDate;
  const chronologicalAgeDays = Math.floor(
    timeDifference / (1000 * 60 * 60 * 24)
  );

  // Calculate the gestational age in days
  const gestationalAgeDays =
    patient.GestationalWeek * 7 + patient.GestationalDay;

  // Calculate the postmenstrual age in days
  const postmenstrualAgeDays = chronologicalAgeDays + gestationalAgeDays;

  // Convert the postmenstrual age to weeks and days
  const postmenstrualAgeWeeks = Math.floor(postmenstrualAgeDays / 7);
  const postmenstrualAgeDaysRemainder = postmenstrualAgeDays % 7;

  return {
    weeks: postmenstrualAgeWeeks,
    days: postmenstrualAgeDaysRemainder,
  };
};

const needToBeRepeatedPostmenstruellen = (
  patient,
  PostmenstruellenFrequencTime,
  PostmenstruellenStartDay
) => {
  // Calculate the current age and postmenstrual age
  const currentAge = getCurrentAge(patient);
  const postmenstrualAge = getPostmenstrualAge(patient);

  // Calculate the number of weeks since the start day
  const startDayDate = new Date(PostmenstruellenStartDay);
  const currentDate = new Date();
  const timeDifference = currentDate - startDayDate;
  const weeksSinceStartDay = Math.floor(
    timeDifference / (1000 * 60 * 60 * 24 * 7)
  );

  // Check if the current age or postmenstrual age has reached the frequency time
  if (
    currentAge.weeks >= PostmenstruellenFrequencTime &&
    weeksSinceStartDay >= PostmenstruellenFrequencTime
  ) {
    return true;
  } else if (
    postmenstrualAge.weeks >= PostmenstruellenFrequencTime &&
    weeksSinceStartDay >= PostmenstruellenFrequencTime
  ) {
    return true;
  } else {
    return false;
  }
};

const weNeedToProcessIt = (patient, task) => {
  // Extract relevant task parameters
  const {
    LowerWeekLimit,
    UpperWeekLimit,
    LowerBirthWeight,
    UpperBirthWeight,
    recurringTaskFrequency,
    recurringTaskStartDay,
    taskPostmenstrualFrequency,
    TaskStartPostmenstrualAge,
  } = task;

  // Check if any of the conditions are true
  if (
    isBetweenGestationsalter(patient, LowerWeekLimit, UpperWeekLimit) &&
    needToBeRepeated(patient, recurringTaskFrequency, recurringTaskStartDay) &&
    isBetweenBirthWeight(patient, LowerBirthWeight, UpperBirthWeight) &&
    needToBeRepeatedPostmenstruellen(
      patient,
      taskPostmenstrualFrequency,
      TaskStartPostmenstrualAge
    )
  ) {
    return {
      needToBeProcessed: true,
      cause: `The patient's gestational age is between ${LowerWeekLimit} and ${UpperWeekLimit} weeks.`,
    };
  }
  // If none of the conditions are true, return a default message
  return {
    needToBeProcessed: false,
    cause: "No matching conditions found for the patient.",
  };
};

const splitDataToPrint = (
  data,
  doSetPatients,
  doSetPatient,
  doCallLastGewicht
) => {

  const groupedByPatient = data.reduce((result, item) => {
    const ID = item.patientInfo.ID;

    const expandedTask = { ...item.Task }
    expandedTask.Type = 'todo';

    // Check if patientID is already in the result
    const existingPatient = result.find((group) => group.ID === ID);

    if (existingPatient) {
      // If patientID exists, push the current item to its tasks array
      existingPatient.tasks.push({ task: expandedTask });
    } else {
      // If patientID doesn't exist, create a new entry
      result.push({
        ID,
        patient: item.patientInfo,
        tasks: [{ task: expandedTask }],
      });
    }

    return result;
  }, []);

  // console.log('groupedByPatient: ', groupedByPatient)

  doSetPatients(groupedByPatient);
  doSetPatient(groupedByPatient[0]?.patient);
  if (groupedByPatient[0]?.patient !== undefined) {
    localStorage.setItem(
      "patient",
      JSON.stringify(groupedByPatient[0]?.patient)
    );
  }
  doCallLastGewicht(groupedByPatient[0]?.patient?.ID);
};

export default function TodoListOverview() {
  const { t } = useTranslation();
  const location = useLocation();
  const [patient, setPatient] = useState(location.state?.patient || null);
  
  const [patients, setPatients] = useState(location.state?.patients || []);
  const [selectedToExport, setSelectedToExport] = useState(
    location.state?.selectedToExport || []
  );
  const [updateState, forceUpdate] = useReducer((state) => state + 1, 0);
  const [openSnackbar, setSnackbar] = useState(false);
  const [editingModus, EnableEditing] = useState(false);
  
  const [newSimpleTask, setNewSimpleTask] = useState([]);
  const [taskToBeIndv, setNewIdvTask] = useState([]);
  const navigate = useNavigate();
  const [message, setMessage] = useState("Task done successfully");
  const tableCellRef = useRef(null);

  const [error, setError] = useState([]);


const updatePatient = async () => {
  try {
    const storedData = await localStorage.getItem("patient");
    if(storedData && storedData !== 'undefined'){

      const p = JSON.parse(storedData);
      setPatient(p)     
    }
  } catch (error) {
    console.log("Error parsing JSON from localStorage:", error);
    
  }

}

  const fetchGrowthData = async () => {
    try {
      const results = await API.Tasks.getTodoListToProcess();
      splitDataToPrint(
        results.data,
        setPatients,
        updatePatient,
        callLastGewicht
      );
    } catch (err) {
      setError([...error, err.message]);
    }
    console.log('PATIENT 1', patient)  };

  useEffect(() => {
      fetchGrowthData();
  }, [location, updateState]);

  const getTasks = () => {
    const existingPatient = patients.find((group) => group.ID === patient.ID);
    // console.log("getTasks", existingPatient, patients, patient.ID);
    return existingPatient?.tasks || [];
  };
  const callLastGewicht = async (PatientID) => {
    let weight = 0;

    try {
      const results = await API.PatientV2.getLastGewitch(PatientID);
      weight = results.data?.Weight || 0;
    } catch (error) {
      console.error("Error fetching weight:", error);
      // Handle the error appropriately based on your requirements
    }

    // updatePatient
    console.log("updatePatient", weight)
    if(weight || weight === 'undefined') {
      
      setPatient((prev) => ({ ...prev, lastGewicht: weight }));
      localStorage.setItem(
        "patient",
        JSON.stringify((prev) => ({ ...prev, lastGewicht: weight }))
      );
    }
    return weight;
  };

  const handleSave = (row) => {
    API.Tasks.processTask({
      patientInfo: patient,
      Task: row,
    }).then((result) => {
      if (result.status === 200) {
        setSnackbar(true);
        setMessage(
          `This Task ${row.Title} for ${patient?.FirstName},  ${patient?.LastName} is done successfully`
        );
        forceUpdate();
      }
    });
  };

  const handlePatientSelect = (selectedPatient, index) => {
    setPatient(selectedPatient);
    localStorage.setItem("patient", JSON.stringify(selectedPatient));
    if (tableCellRef.current) {
      const targetButton = tableCellRef.current.childNodes[index];
      if (targetButton) {
        targetButton.scrollIntoView({
          behavior: "smooth",
          block: "nearest",
          inline: "start",
        });
      }
    }
  };

  const handleNextPatient = () => {
    if (patients.length > 0) {
      const currentIndex = patients.findIndex(
        (group) => group.patient === patient
      );
      const nextIndex = (currentIndex + 1) % patients.length;
      const nextPatientGroup = patients[nextIndex];
      setPatient(nextPatientGroup.patient);
      localStorage.setItem("patient", JSON.stringify(nextPatientGroup.patient));
    }
  };

  const handlePreviousPatient = () => {
    if (patients.length > 0) {
      const currentIndex = patients.findIndex(
        (group) => group.patient === patient
      );
      const prevIndex = (currentIndex - 1 + patients.length) % patients.length;
      const prevPatientGroup = patients[prevIndex];
      setPatient(prevPatientGroup.patient);
      localStorage.setItem("patient", JSON.stringify(prevPatientGroup.patient));
    }
  };

  const isLastPatient = () => {
    if (patients.length === 0) {
      // Handle the case where the array is empty
      return false;
    }

    const lastPatient = patients[patients.length - 1];
    return patient?.ID === lastPatient.patient.ID;
  };
  const isFirstPatient = () => {
    if (patients.length === 0) {
      // Handle the case where the array is empty
      return false;
    }

    const lastPatient = patients[0];
    return patient?.ID === lastPatient.patient.ID;
  };

  const simpleTaskHandleChange = (targetName, targetValue) => {
    setNewSimpleTask({
      ...newSimpleTask,
      [targetName]: targetValue,
      patientID: patient?.ID,
    });
  }

  const handleChange = (targetName, targetValue, oldTask) => {
    if (oldTask?.ID === taskToBeIndv?.ID)
      setNewIdvTask((prev) => ({
        ...prev,
        [targetName]: targetValue,
        patientID: patient?.ID,
      }));
    else
      setNewIdvTask((prev) => ({
        ...oldTask,
        [targetName]: targetValue,
        patientID: patient?.ID,
      }));
    // console.log("target Task:", oldTask, "new Value, ", targetValue, targetName)
  };

  const handleSimpleTaskSave = () => {
    if (newSimpleTask?.length === 0 || newSimpleTask == []) return null;
    else {
      API.Tasks.newSimpleTask({
        Task: newSimpleTask,
      }).then((result) => {
        if (result.status === 200) {
          setSnackbar(true);
          setMessage(
            `This New Task ${newSimpleTask.Title} for ${patient?.FirstName},  ${patient?.LastName} is done successfully`
          );
          forceUpdate();
          window.location.reload();
        }
      });
    }
  };

  const handleTodoSave = () => {
    if (taskToBeIndv?.length === 0 || taskToBeIndv == []) return null;
    else {
      API.Tasks.newIndvTask({
        patientInfo: patient,
        Task: taskToBeIndv,
      }).then((result) => {
        if (result.status === 200) {
          setSnackbar(true);
          setMessage(
            `This New Indv Task ${taskToBeIndv.Title} for ${patient?.FirstName},  ${patient?.LastName} is done successfully`
          );
          forceUpdate();
          window.location.reload();
        }
      });
    }
  };

  // console.log("taskToBeIndv patients", selectedToExport, patients);

  return (
    <>
      {" "}
      <HandleAxiosError error={error} />
      <CustomSnackbar
        open={openSnackbar}
        autoHide={1500}
        message={message}
        handleClose={() => {
          setSnackbar(false);
          forceUpdate();
        }}
        severity={"success"}
      />
      <CancelButton />

     
        <Box>
          <Grid container spacing={1}>

          
          { patient &&
            <Grid
              item
              xs={12}
              md={5}
              lg={3}
              style={{ backgroundColor: BackgroundThird }}
            >
              <Typography
                variant="h7"
                className="fw-bolder d-flex justify-content-center w-100"
              >
                {t("Patient_Informations")}
              </Typography>
              <Divider className="mt-1" />
              <Grid container spacing={0.4} sx={{ mt: 1 }}>
                <Grid item xs={4}>
                  <Typography className="fw-bold" sx={{ ml: 1 }}>
                    {t("Patient_ID")}
                  </Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography>{patient.PatientID}</Typography>
                </Grid>
                <Grid item xs={4}>
                  <Typography className="fw-bold" sx={{ ml: 1 }}>
                    {" "}
                    {t("Name")}
                  </Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography>
                    {patient.FirstName} {patient.LastName}
                  </Typography>
                </Grid>
                <Grid item xs={4}>
                  <Typography className="fw-bold" sx={{ ml: 1 }}>
                    {" "}
                    {t("Gender")}
                  </Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography>{patient.Gender}</Typography>
                </Grid>
                <Grid item xs={4}>
                  <Typography className="fw-bold" sx={{ ml: 1 }}>
                    {" "}
                    {t("Station")}
                  </Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography>{patient.StationID}</Typography>
                </Grid>
                <Grid item xs={4}>
                  <Typography className="fw-bold" sx={{ ml: 1 }}>
                    {" "}
                    {t("Bed")}
                  </Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography>{patient.BedNr}</Typography>
                </Grid>
                <Grid item xs={4}>
                  <Typography className="fw-bold" sx={{ ml: 1 }}>
                    {" "}
                    {t("Details")}
                  </Typography>
                </Grid>
                <Grid item xs={6}>
                  <DetailsDesign
                    Title={`Patient Details N°: ${patient?.PatientID}`}
                    children={patientDetails(patient)}
                    icon={DetailsIcon}
                    ID={patient.PatientID}
                  />
                </Grid>
                <Divider className="mb-1" />
                <Grid item xs={12}>
                  <ButtonGroup fullWidth>
                    <Button
                      variant="outlined"
                      disabled={isFirstPatient()}
                      startIcon={<FcPrevious size={20} />}
                      onClick={handlePreviousPatient}
                    >
                      {t("Previous")}
                    </Button>
                    <Button
                      variant="outlined"
                      disabled={patients.length === 0 || isLastPatient()}
                      endIcon={<FcNext size={20} />}
                      onClick={handleNextPatient}
                    >
                      {t("Next")}
                    </Button>
                  </ButtonGroup>
                </Grid>
                <Grid item xs={12} sx={{ m: 0, p: 0 }}>
                  <div
                    style={{ maxHeight: "58vh", overflowY: "auto" }}
                    ref={tableCellRef}
                  >
                    {patients?.map((elemenetPatient, index) => (
                      <Button
                        key={"patient_" +  index}
                        variant={"text"}
                        onClick={() =>
                          handlePatientSelect(elemenetPatient.patient, index)
                        }
                        fullWidth
                        style={{
                          backgroundColor:
                            patient === elemenetPatient.patient
                              ? ButtonFirst
                              : null,
                          minHeight: "4vh",
                        }}
                        className="border-bottom"
                      >
                        <Grid container spacing={1}>
                          <Grid
                            item
                            xs={6}
                            sx={{
                              color:
                                patient === elemenetPatient.patient
                                  ? TextFirst
                                  : TextSecond,
                              textAlign: "start",
                            }}
                          >
                            {returnIfNotNullOrUndefined(
                              elemenetPatient?.patient.FirstName
                            )}
                          </Grid>
                          <Grid
                            item
                            xs={3}
                            sx={{
                              color:
                                patient === elemenetPatient.patient
                                  ? TextFirst
                                  : TextSecond,
                            }}
                          >
                            {StationIcon}{" "}
                            {returnIfNotNullOrUndefined(
                              elemenetPatient?.patient.StationID
                            )}
                          </Grid>
                          <Grid
                            item
                            xs={3}
                            sx={{
                              color:
                                patient === elemenetPatient.patient
                                  ? TextFirst
                                  : TextSecond,
                            }}
                          >
                            {bedIcon}
                            {returnIfNotNullOrUndefined(
                              elemenetPatient?.patient.BedNr
                            )}
                          </Grid>
                        </Grid>
                      </Button>
                    ))}
                  </div>
                </Grid>
              </Grid>
            </Grid>
          }

          

      
          { patient &&


          
            <Grid item xs={8} md={5} lg={7} sx={{ pr: 2, mt: 6 }}>         
              <Box sx={{ marginTop: -3, justifyContent: "center" }}>
                <Typography className="d-flex justify-content-center">
                  {" "}
                  {t("Todo_List_Tasks")}
                  <FcTodoList className="ml-2" />
                </Typography>
              </Box>
              <Box
                className="border border-dark"
                sx={{ pr: 0, maxHeight: "80vh" }}
              >
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell
                        key="Title"
                        align="left"
                        padding="none"
                        sx={{ pl: 1 }}
                        style={{ backgroundColor: BackgroundFourth }}
                      >
                        {t("Title")}
                      </TableCell>
                      <TableCell
                        key="Art"
                        align="left"
                        padding="none"
                        sx={{ pl: 1 }}
                        style={{ backgroundColor: BackgroundFourth }}
                      >
                        {t("Art")}
                      </TableCell>
                      <TableCell
                        key="TaskDetail"
                        align="center"
                        padding="none"
                        sx={{ pl: 1 }}
                        style={{ backgroundColor: BackgroundFourth }}
                      >
                        {t("Task_Detail")}
                      </TableCell>
                      <TableCell
                        key="Done"
                        align="center"
                        padding="none"
                        sx={{ pl: 1 }}
                        style={{ backgroundColor: BackgroundFourth }}
                      >
                        {t("Task_Done")}
                      </TableCell>
                      { editingModus && (
                        <TableCell
                          key="Task_Edit"
                          align="center"
                          padding="none"
                          sx={{ pl: 1 }}
                          style={{ backgroundColor: BackgroundFourth }}
                        >
                          {t("Edit")}
                        </TableCell>
                      )}
                    </TableRow>
                    
                  </TableHead>


                
                  <TableBody>

                  { patient && 

                    getTasks()?.map((row, index) => {
                      const task = row.task;
                      const checkIt = weNeedToProcessIt(patient, task);
                      // console.log(checkIt);
                      
                      return (
                        <TableRow key={'tRow-' + index}>
                          <TableCell padding="none" align="left" sx={{ pl: 1 }}>
                            <span
                              className="fw-bold"
                              style={{ marginRight: "1vh" }}
                            >
                              { returnIfNotNullOrUndefined(task?.Title) }
                            </span>
                          </TableCell>
                          <TableCell padding="none" align="left" sx={{ pl: 1 }}>
                            <span
                              className="fw-bold"
                              style={{ marginRight: "1vh" }}
                            >
                              { returnIfNotNullOrUndefined(task?.art) }
                            </span>
                          </TableCell>
                          <TableCell padding="none" align="center" sx={{ pl: 1 }}>
                            {
                            <DetailsDesign
                              Title={`Task Details: ${task?.Title}`}
                              children={ TaskDetails(task) }
                              icon={DetailsIcon}
                              ID={task.ID}
                            />
                            }
                          </TableCell>
                          <TableCell padding="none" align="center" sx={{ pl: 1 }}>
                            <Button
                              variant="outlined"
                              color="success"
                              onClick={() => handleSave(task)}
                            >
                              {DoneIcon}
                            </Button>
                          </TableCell>

                          

                          { editingModus && 
                            <TableCell
                              padding="none"
                              align="center"
                              sx={{ pl: 1 }}
                            >

                              <GlobalDialog
                                Title={`Task Bearbeiten: ${task?.Title}`}
                                children={
                                  task?.Type === 'todo' ?
                                    createTodoTask(task, handleChange ) : createSimpleTask(task, simpleTaskHandleChange)
                                }
                                Icon={EditIcon}
                                secondButton={
                                  <Button
                                    style={{
                                      backgroundColor: ButtonFirst,
                                      color: TextFirst,
                                    }}
                                    onClick={() => task?.type === 'todo' ? handleTodoSave() : handleSimpleTaskSave() }
                                    className="btn btn-lg btn-block"
                                  >
                                    {t("Save")}
                                  </Button>
                                }
                                ID={task.ID}
                              />
                            </TableCell>  
                          }
                        </TableRow>
                      );
                      })
                    }                    
                  </TableBody>                 
                </Table>
              </Box>

              
              <Box>
                <TodoListToProcessArchiv
                  patient={patient}
                  forceUpdate2={forceUpdate}
                />
              </Box>

            </Grid>            
          }

          { patient && 
          
              <Grid item xs={4} md={2} lg={2} sx={{ pr: 2, pt: 2, mt: 6 }}>

                <ButtonGroup
                  orientation="vertical"
                  fullWidth
                  variant="contained"
                  sx={{ justifyContent: "start" }}
                >
                  <Button
                    sx={{ backgroundColor: ButtonFirst, color: TextFirst }}
                    endIcon={downloadIcon}
                    onClick={() => ExportTodoList(patient, getTasks())}
                  >
                    {t("todo_list")}
                  </Button>

                
                  <GlobalDialog
                    Title={`Export Multiple Tasks`}
                    // children={
                    //   ExportMultiplTasksDialog(
                    //     patients,
                    //     selectedToExport,
                    //     setSelectedToExport
                    //   )
                    // }
                    textButton={"Multiple Todo-Lists"}
                    sty={{
                      backgroundColor: ButtonFirst,
                      color: TextFirst,
                      width: "100%",
                      height: "100%",
                      borderRadius: "0px",
                    }}
                    Icon={downloadIcon}
                    secondButton={
                      <Button
                        style={{ backgroundColor: ButtonFirst, color: TextFirst }}
                        onClick={() =>
                          ExportMultipleTodoList(patients, selectedToExport)
                        }
                        className="btn btn-lg btn-block"
                      >
                        {t("Export")}
                      </Button>
                    }
                    ID={"ExportMultipleClasses"}
                  />






                  
                  <Button
                    sx={{ backgroundColor: ButtonFirst, color: TextFirst }}
                    endIcon={EditIcon}
                    onClick={() => EnableEditing(!editingModus)}
                  >
                    {t("Adjust_Tasks")}
                  </Button>
                  
                  <GlobalDialog
                    Title={`Add New Task`}
                    children={createSimpleTask({}, simpleTaskHandleChange) }
                    textButton={"Add New Task"}
                    sty={{
                      backgroundColor: ButtonFirst,
                      color: TextFirst,
                      width: "100%",
                      height: "100%",
                      borderRadius: "0px",
                    }}
                    Icon={SaveIcon}
                    secondButton={
                      <Button
                        style={{ backgroundColor: ButtonFirst, color: TextFirst }}
                        onClick={() => handleSimpleTaskSave()}
                        className="btn btn-lg btn-block"
                      >
                        {t("Save")}
                      </Button>
                    }
                    ID={"newTaskCreator"}
                  />
                </ButtonGroup>                
              </Grid>
            }
          </Grid>
        </Box>
    </>
  );
}
