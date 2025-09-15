import React, { forwardRef, useState } from "react";
import { GenericTableView } from "../../../utils/table/generic-table-view.js";
import {
  Alert,
  Box,
  Button,
  ButtonGroup,
  Modal,
  TableCell,
  TableRow,
  TextField,
  Typography,
} from "@mui/material";
import { CustomSnackbar } from "../../../utils/dialog-notifications.js";
import { API } from "../../../services/Api.js";
import { formatDate } from "../../../utils/table/table-tools.js";
import { BackgroundFourth } from "../../../utils/global-variables.js";
import { EditIcon, SaveIcon } from "../../../utils/global-icons.js";
import { createNewDataInChart } from "./addNewDataInChart.js";
import { useTranslation } from "react-i18next";

const GrowthDataShower = forwardRef((props, ref) => {
  const { t } = useTranslation();
  const [editMode, setEditMode] = useState(false);
  const options = { year: "numeric", month: "numeric", day: "numeric" };
  const [actualDate, setActualDate] = useState(
    new Intl.DateTimeFormat("en-US", options).format(new Date())
  );
  const [newData, setNewData] = useState();
  
  const [error, setError] = useState([]);
  const [openSnackbar, setSnackbar] = useState(false);
  const [modalMessage, setModalMessage] = useState()
  const [snackMessage, setSnackMessage] = useState(
    "Your new inputs has been successfully saved"
  );
  const [show, setShow] = useState(false);
  
  const handleUpdateSave = () => {
    setEditMode(!editMode);
    API.TodosV2.UpdateNewDailyTask(newData)
      .then((result) => {
        // navigate(0);
        //     return;
        if (result.status === 200) setSnackbar(true);
        setNewData({});
        props?.forceUpdate();        
      })
      .catch((error) => {
        // Handle any unexpected errors here
        setError(`Unexpected error occurred: ${error.message}`);
      })
      .finally(props?.forceUpdate());
  };
  const handleNewSave = () => {

    if(!newData) {
      setModalMessage('Please insert any data')
      return;
    }

    // Get the keys of the object newData
    const newDataKeys = Object.keys(newData);
    // Check if the array is not empty
    if (newDataKeys.length > 0) {
      const firstKey = newDataKeys[0];
      const firstElement = newData[firstKey];
      
      // Check if the first element has the 'date' property defined and not undefined
      if (firstElement && firstElement.date !== undefined) {
        console.log("start results successfully saved");
        API.TodosV2.SaveNewDailyTask(newData)
          .then((result) => {
            setNewData(null);
            setShow(false)
            if (result.status === 200) {
              setSnackbar(true);
              setSnackMessage("Your new inputs has been successfully saved");
            }
            props?.forceUpdate();
          })
          .catch((error) => {
            // Handle any unexpected errors here
            setError(`Unexpected error occurred: ${error.message}`);
          })
          .finally(props?.forceUpdate());
      } else {
        setSnackbar(false);
        setModalMessage("Please add a Task Date first");        
        return;
      }
    }
  };

  const HandleCreateNewData = (name, value) => {
    // Update the updatedData state with the new value
    const patientID = props?.childData?.ID;
    const BedNr = props?.childData?.BedNr;
    const ClinicID = props?.childData?.ClinicID;
    const StationID = props?.childData?.StationID;

    setNewData((prevData) => {
      const pData  = !prevData || prevData === undefined ? {} : prevData
      return {
        ...pData,
        [patientID]: {
          ...pData[patientID],
          [name]: value,
          patientID: patientID,
          BedNr: BedNr,
          ClinicID: ClinicID,
          StationNr: StationID,
        },
      }
    });
  };


  const handleUpdateChange = (event, row) => {
    const { name, value } = event.target;
    let currentData = {}
    if (newData === undefined) {
      currentData[row.ID] = {...row}
    } else {
      currentData = {...newData}
    }

    if (!currentData[row.ID]) {
      currentData[row.ID] = {...row}
    }

    if(value === '') {
      currentData[row.ID][name] = '';
    } else {
      currentData[row.ID][name] = name === 'TaskDate' ? value.toString() : parseFloat(value.toString().split(',').join('.'))
    }
    
    
    
    // Update the updatedData state with the new value
    setNewData(currentData)
    
  };


  


  
  
  const OpenedTasksToolBar = () => {
    

    const style = {
      position: 'absolute',
      top: '50%',
      left: '50%',
      transform: 'translate(-50%, -50%)',
      width: '80vw',
      maxWidth: '740px',
      bgcolor: 'background.paper',
      borderRadius: '16px',
      boxShadow: 24,
      p: 4,
    }

    return (
         <div>
          <Modal
            open={show}
            onClose={() => setShow(false)}
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description"
            size="xl"
          >   
            <Box sx={style}>
              <Typography style={{textAlign: 'left'}} variant="h5" component="h2">
                Add new Data
              </Typography>
              { createNewDataInChart(HandleCreateNewData) }

              { modalMessage && modalMessage !== '' && 
                  <Alert severity="error" className="my-4" >{ modalMessage }</Alert>
              }              
              <div className="d-flex flex-wrap justify-content-between">
                <Button
                    onClick={() => setShow(false)}
                    className="btn btn-lg btn-block"
                    variant="text"
                  >
                    Close
                </Button>

                <Button
                  variant="primary"
                  style={{ color: '#ffffff', backgroundColor: "#0693E3" }}
                  className="btn btn-sm btn-block d-flex row"
                  onClick={() => handleNewSave()}
                >
                  Save Data
                </Button>
              </div>
            </Box>
            
          </Modal>

            <ButtonGroup variant="outlined" size="small" aria-label="Basic button group">
              <Button
                variant="contained"
                style={{ backgroundColor: BackgroundFourth, whiteSpace: 'nowrap' }}
                onClick={() => setShow(true)}
                startIcon={SaveIcon}
              >
                Add new Values
              </Button>
              
              <Button
                variant="contained"
                style={{ backgroundColor: BackgroundFourth }}
                onClick={() => setEditMode(!editMode)}
                startIcon={EditIcon}
              >
                {!editMode ? "Active" : "Disactive"}
              </Button>
              <Button
                variant="contained"
                style={{ backgroundColor: BackgroundFourth }}
                onClick={() => handleUpdateSave()}
                endIcon={SaveIcon}
              >
                {t("Save")}
              </Button>
            </ButtonGroup>
          </div>
        
    );
  };

  function tableHeader() {
    return (
      <>
        <TableCell align="center">{t("Date")} {props?.patient?.ID}</TableCell>
        <TableCell align="center">{t("Weight")}</TableCell>
        <TableCell align="center">{t("Length")}</TableCell>
        <TableCell align="center">{t("HeadCircumference")}</TableCell>
        <TableCell align="center">{t("Percent_Fat_Mass")}</TableCell>
        <TableCell align="center">{t("Fat_mas")}</TableCell>
        <TableCell align="center">{t("Fat_Free_mass")}</TableCell>
      </>
    );
  }

  function bodyMapper(fetchedData) {
    return fetchedData?.map((row, index) => {
      return (
        <TableRow key={row.ID}>
          <TableCell padding="none" align="center">
            {editMode ? (
              <TextField
                id="BirthLength-Input"
                variant="outlined"
                name="TaskDate"
                type="date"
                onChange={(event) => handleUpdateChange(event, row)}
                inputProps={{
                  style: { height: "8px", padding: "12px" },
                  "data-patientid": row?.ID, // Pass the patient ID as data attribute
                }}
                defaultValue={formatDate(row.TaskDate)}
                sx={{ padding: 0, margin: 0 }}
              />
            ) : (
              <span>{formatDate(row.TaskDate)}</span>
            )}
          </TableCell>
          <TableCell padding="none" align="center">
            {editMode ? (
              <TextField
                id="BirthLength-Input"
                variant="outlined"
                name="Weight"
                onChange={(event) => handleUpdateChange(event, row)}
                inputProps={{
                  style: { height: "8px", padding: "12px" },
                  "data-patientid": row?.ID, // Pass the patient ID as data attribute
                }}
                defaultValue={row?.Weight}
                sx={{ padding: 0, margin: 0 }}
              />
            ) : (
              <span>{row?.Weight}</span>
            )}
          </TableCell>
          <TableCell padding="none" align="center">
            {editMode ? (
              <TextField
                id="BirthLength-Input"
                variant="outlined"
                name="Length"
                onChange={(event) => handleUpdateChange(event, row)}
                inputProps={{
                  style: { height: "8px", padding: "12px" },
                  "data-patientid": row?.ID, // Pass the patient ID as data attribute
                }}
                sx={{ padding: 0, margin: 0 }}
                defaultValue={row?.Length}
              />
            ) : (
              <span>{row?.Length}</span>
            )}
          </TableCell>
          <TableCell padding="none" align="center">
            {editMode ? (
              <TextField
                id="Length-Input"
                variant="outlined"
                name="HeadCircumference"
                onChange={(event) => handleUpdateChange(event, row)}
                inputProps={{
                  style: { height: "8px", padding: "12px" },
                  "data-patientid": row?.ID, // Pass the patient ID as data attribute
                }}
                sx={{ padding: 0, margin: 0 }}
                defaultValue={row?.HeadCircumference}
              />
            ) : (
              <span>{row?.HeadCircumference}</span>
            )}
          </TableCell>
          
          <TableCell padding="none" align="center">
            {editMode ? (
              <TextField
                id="PercentFatFreeMass-Input"
                variant="outlined"
                name="PercentFatFreeMass"
                onChange={(event) => handleUpdateChange(event, row)}
                inputProps={{
                  style: { height: "8px", padding: "12px" },
                  "data-patientid": row?.ID, // Pass the patient ID as data attribute
                }}
                sx={{ padding: 0, margin: 0 }}
                defaultValue={row?.PercentFatFreeMass}
              />
            ) : (
              <span>{row?.PercentFatFreeMass}</span>
            )}
          </TableCell>
          <TableCell padding="none" align="center">
            {editMode ? (
              <TextField
                id="FatMass-Input"
                variant="outlined"
                name="FatMass"
                onChange={(event) => handleUpdateChange(event, row)}
                inputProps={{
                  style: { height: "8px", padding: "12px" },
                  "data-patientid": row?.ID, // Pass the patient ID as data attribute
                }}
                sx={{ padding: 0, margin: 0 }}
                defaultValue={row?.FatMass}
              />
            ) : (
              <span>{row?.FatMass}</span>
            )}
          </TableCell>
          
          <TableCell padding="none" align="center">
            
            {editMode ? (
              <TextField
                id="FatFreeMass-Input"
                variant="outlined"
                name="FatFreeMass"
                onChange={(event) => handleUpdateChange(event, row)}
                inputProps={{
                  style: { height: "8px", padding: "12px" },
                  "data-patientid": row?.ID, // Pass the patient ID as data attribute
                }}
                sx={{ padding: 0, margin: 0 }}
                defaultValue={row?.FatFreeMass}
              />
            ) : (
              <span>{row?.FatFreeMass}</span>
            )}
          </TableCell>
        </TableRow>
      );
    });
  }

  return (
    <div ref={ref}>
      <CustomSnackbar
        open={openSnackbar}
        autoHide={2000}
        message={snackMessage}
        handleClose={() => {
          setSnackbar(false);
          props?.forceUpdate();
        }}
        severity={
          snackMessage == "Your new inputs has been successfully saved"
            ? "success"
            : "error"
        }
      />
      <GenericTableView
        tableTitle={<>Growth Data List</>}
        elementCount={props?.growthData?.length}
        disabledLink={true}
        toolbar={OpenedTasksToolBar}
        header={tableHeader}
        body={props?.growthData || []}
        bodyMapper={bodyMapper}
        isLoading={false} // isLoading
        footerText={t("Data_per_page")}
      />
    </div>
  );
});

export default GrowthDataShower;
