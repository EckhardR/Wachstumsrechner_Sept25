import React, { useEffect, useReducer, useState } from "react";
import { API } from "../../../services/Api.js";
import { useLocation, useNavigate } from "react-router-dom";
import { GenericTableView } from "../../../utils/table/generic-table-view.js";
import HandleAxiosError from "../../../utils/handle-axios-error.js";
import { Button, ButtonGroup, Grid, TableCell, TableRow, TextField } from "@mui/material";
import { DateNavigationButton, returnIfNotNullOrUndefined } from "../../../utils/table/table-tools.js";
import { BackgroundFourth, BackgroundThird } from "../../../utils/global-variables.js";
import { EditIcon, SaveIcon, StationIcon, bedIcon } from "../../../utils/global-icons.js";
import { CustomSnackbar } from "../../../utils/dialog-notifications.js";
import { useTranslation } from "react-i18next";

export default function OpenedTasks() {
  const { t } = useTranslation();
  const [tasks, setTasks] = React.useState([]);
  const [error, setError] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const options = { year: 'numeric', month: 'numeric', day: 'numeric' };
  const [actualDate, setActualDate] = useState(new Intl.DateTimeFormat('en-US', options).format(new Date()));
  const [updateState, forceUpdate] = useReducer((state) => state + 1, 0);
  const [updatedData, setUpdatedData] = useState({});
  const [updatedPatientID, setUpdatedPatientID] = useState(null);
  const [openSnackbar, setSnackbar] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const fetchData = async () => {
    try {
      const response = await API.TodosV2.getOpenTasks(actualDate);
      setTasks(response.data);
      setEditMode(false);
      setUpdatedData({});
      setIsLoading(false);
    } catch (error) {
      setError(error.message);
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [updateState, location, actualDate]);

  const handleSave = () => {
    API.TodosV2.SaveNewDailyTask(updatedData)
      .then((result) => {
        if (result.status === 200)
          setSnackbar(true);
      })
      .catch((error) => {
        // Handle any unexpected errors here
        setError(`Unexpected error occurred: ${error.message}`);
      });

  }

  const handleChange = (event, patient) => {
    const { name, value } = event.target;
    const patientID = event.target.getAttribute("data-patientid");
    // Update the updatedData state with the new value
    setUpdatedData((prevData) => ({
      ...prevData,
      [patientID]: {
        ...prevData[patientID],
        [name]: value,
        date: actualDate,
        BedNr: patient?.BedNr,
        ClinicID: patient?.ClinicID,
        StationNr: patient?.StationID,
      },
    }));
    // Set the updatedPatientID state to the current patient ID
    setUpdatedPatientID(patientID);
  };


  const handleOnPreviousDay = () => {
    const currentDate = new Date(actualDate);
    currentDate.setUTCDate(currentDate.getUTCDate() - 1);
    const nextDay = new Intl.DateTimeFormat('en-US', options).format(currentDate);
    setActualDate(nextDay);

  }
  const handleOnNextDay = () => {
    const currentDate = new Date(actualDate);
    currentDate.setUTCDate(currentDate.getUTCDate() + 1);
    const nextDay = new Intl.DateTimeFormat('en-US', options).format(currentDate);
    setActualDate(nextDay);

  }

  const OpenedTasksToolBar = () => {
    const modalId = `OpenedTasksToolBar-table`;
    return (
      <Grid container spacing={2} key={modalId}>
        <Grid item xs={4} style={{ marginRight: 2, m: 4 }} >
          <DateNavigationButton date={actualDate} onNextDay={handleOnNextDay} onPreviousDay={handleOnPreviousDay} />
        </Grid>
        <Grid item xs={4} style={{ marginRight: 2, m: 4, position: 'absolute', right: '0' }}>
          <ButtonGroup>
            <Button variant="contained" style={{ backgroundColor: BackgroundFourth }} onClick={() => setEditMode(!editMode)} startIcon={EditIcon}>
              {!editMode ? 'Active' : 'Disactive'}
            </Button>
            <Button variant="contained" style={{ backgroundColor: BackgroundFourth }} onClick={() => handleSave()} endIcon={SaveIcon}>
              
                  {t("Save")}
                </Button>
          </ButtonGroup>
        </Grid>
      </ Grid>
    );
  };
  const tableHeader = () => (
    <>
      <TableCell
        width="40%"
        key="patientInfos"
        padding="none"
        style={{ backgroundColor: BackgroundFourth, fontWeight: 'bold' }}
      >
       {t("Patient_Infos")} 
      </TableCell>
      <TableCell
        width="10%"
        key="weight"
        align="left"
        padding="none"
        style={{ backgroundColor: BackgroundFourth, fontWeight: 'bold' }}
      >
        {t("Weight")} (g)
      </TableCell>
      <TableCell
        width="10%"
        key="Lengthcm"
        align="left"
        padding="none"
        style={{ backgroundColor: BackgroundFourth, fontWeight: 'bold' }}
      >
        {t("Length")} (cm)
      </TableCell>
      <TableCell
        width="10%"
        key="headCircumference"
        align="left"
        padding="none"
        style={{ backgroundColor: BackgroundFourth, fontWeight: 'bold' }}
      >
        {t("HeadCircumference")} (cm)
      </TableCell>
      <TableCell
        width="10%"
        key="Percent_Fat_Mass"
        align="left"
        padding="none"
        style={{ backgroundColor: BackgroundFourth, fontWeight: 'bold' }}
      >
        {t("Percent_Fat_Mass")} (%)
      </TableCell>
      <TableCell
        width="10%"
        key="FatMass"
        align="left"
        padding="none"
        style={{ backgroundColor: BackgroundFourth, fontWeight: 'bold' }}
      >
        {t("Fat_mas")} (g)
      </TableCell>
      <TableCell
        width="10%"
        key="Fat_Free_mass"
        align="left"
        padding="none"
        style={{ backgroundColor: BackgroundFourth, fontWeight: 'bold' }}
      >
        {t("Fat_Free_mass")} (g)
      </TableCell>
    </>
  );

  const tableBody = (data) =>
    data.map((row, index) => {
      const labelId = `Tasks-table-div-${index}`;
      return (
        <TableRow
          role="div"
          tabIndex={-1}
          key={labelId}
          sx={{ backgroundColor: BackgroundThird }}
        >
          <TableCell padding="none" align="left" sx={{ pl: 1 }} width="30%">
            <span className="fw-bold" style={{ marginRight: '1vh' }}>
              {returnIfNotNullOrUndefined(row?.ID)}:
            </span>
            <span className="fw-bold" style={{ marginRight: '1vh' }}>
              {returnIfNotNullOrUndefined(row?.FirstName)}, {returnIfNotNullOrUndefined(row?.LastName)}
            </span>
            {bedIcon}
            <span className="text-secondary" style={{ marginRight: '1vh', marginLeft: '1vh' }}>
              {returnIfNotNullOrUndefined(row?.BedNr)}
            </span>
            {StationIcon}
            <span className="text-secondary">
              {returnIfNotNullOrUndefined(row?.StationID)}
            </span>
          </TableCell>
          <TableCell padding="none" align="center">
            {editMode || (row?.Weight === null || row?.Weight === undefined) ?
              <TextField
                id={`BirthLength-Input-1-${index}`}
                variant="outlined"
                name="Weight"
                onChange={(event) => handleChange(event, row)}
                inputProps={{
                  style: { height: '8px', padding: '12px' },
                  "data-patientid": row?.ID, // Pass the patient ID as data attribute
                }}
                defaultValue={row?.Weight}
                sx={{ padding: 0, margin: 0 }}
              /> : <span >{row?.Weight}</span>}
          </TableCell>
          <TableCell padding="none" align="center">
            {editMode || (row?.Length === null || row?.Length === undefined) ?
              <TextField
                id={`BirthLength-Input-2-${index}`}
                variant="outlined"
                name="Length"
                onChange={(event) => handleChange(event, row)}
                inputProps={{
                  style: { height: '8px', padding: '12px' },
                  "data-patientid": row?.ID, // Pass the patient ID as data attribute
                }}
                sx={{ padding: 0, margin: 0 }}
                defaultValue={row?.Length}
              /> : <span >{row?.Length}</span>}
          </TableCell>
          <TableCell padding="none" align="center">
            {editMode || (row?.HeadCircumference === null || row?.HeadCircumference === undefined) ?
              <TextField
                id={`Length-Input-1-${index}`}
                variant="outlined"
                name="HeadCircumference"
                onChange={(event) => handleChange(event, row)}
                inputProps={{
                  style: { height: '8px', padding: '12px' },
                  "data-patientid": row?.ID, // Pass the patient ID as data attribute
                }}
                sx={{ padding: 0, margin: 0 }}
                defaultValue={row?.HeadCircumference}
              /> : <span >{row?.HeadCircumference}</span>}
          </TableCell>
          <TableCell padding="none" align="center">
            {editMode || (row?.PercentFatFreeMass === null || row?.PercentFatFreeMass === undefined) ?
              <TextField
                id={`FatFreeMass-Input-1-${index}`}
                variant="outlined"
                name="PercentFatFreeMass"
                onChange={(event) => handleChange(event, row)}
                inputProps={{
                  style: { height: '8px', padding: '12px' },
                  "data-patientid": row?.ID, // Pass the patient ID as data attribute
                }}
                sx={{ padding: 0, margin: 0 }}
                defaultValue={row?.PercentFatFreeMass}
              /> : <span >{row?.PercentFatFreeMass}</span>}
          </TableCell>
          <TableCell padding="none" align="center">
            {editMode || (row?.FatMass === null || row?.FatMass === undefined) ?
              <TextField
                id={`FatMass-Input-1-${index}`}
                variant="outlined"
                name="FatMass"
                onChange={(event) => handleChange(event, row)}
                inputProps={{
                  style: { height: '8px', padding: '12px' },
                  "data-patientid": row?.ID, // Pass the patient ID as data attribute
                }}
                sx={{ padding: 0, margin: 0 }}
                defaultValue={row?.FatMass}
              /> : <span >{row?.FatMass}</span>}
          </TableCell>
          <TableCell padding="none" align="center">
            {editMode || (row?.FatFreeMass === null || row?.FatFreeMass === undefined) ?
              <TextField
                id={`FatFreeMass-Input-2-${index}`}
                variant="outlined"
                name="FatFreeMass"
                onChange={(event) => handleChange(event, row)}
                inputProps={{
                  style: { height: '8px', padding: '12px' },
                  "data-patientid": row?.ID, // Pass the patient ID as data attribute
                }}
                sx={{ padding: 0, margin: 0 }}
                defaultValue={row?.FatFreeMass}
              /> : <span >{row?.FatFreeMass}</span>}
          </TableCell>
        </TableRow>
      );
    });


  return (
    <>
      <HandleAxiosError error={error} />
      <CustomSnackbar open={openSnackbar} autoHide={1500} message={"Your Inputs has been successfully saved"} handleClose={() => {
        setSnackbar(false);
        forceUpdate();
      }} severity={"success"} />
      <GenericTableView
        elementCount={tasks?.length}
        disabledLink
        tableTitle={<div className="d-flex flex-row">
          {t("Open_Tasks")}
        </div>}
        header={tableHeader}
        body={tasks}
        toolbar={OpenedTasksToolBar}
        bodyMapper={tableBody}
        isLoading={isLoading}
        size={'small'}
        footerText={t("Tasks_per_page")}
        backgroundColor={BackgroundThird}
      />
    </>
  );
}