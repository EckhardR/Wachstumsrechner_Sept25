import { Autocomplete, Button, ButtonGroup, FormGroup, TableCell, TableRow, TextField } from '@mui/material';
import React, { useEffect, useReducer, useState } from 'react'
import { useNavigate } from 'react-router-dom';
import { globalAutocompleteArray, globalAutocompleteOptionsLabel, globalFetchDataV2, globalHandleSearch } from '../../services/services-tool.js';
import { API } from '../../services/Api.js';
import { PATIENT_TASKS, CHART, CREATEPATIENT, EDITPATIENT } from '../../routes/Routes-Links.js';
import HandleAxiosError from '../../utils/handle-axios-error.js';
import { GenericTableView } from '../../utils/table/generic-table-view.js';
import { DetailsDesign } from '../../utils/table/details-design.js';
import { DetailsIcon, EditIcon, NewKidIcon, OffenIcon, dischargeIcon, graphIcon, newElemenetIcon, tasksIcon } from '../../utils/global-icons.js';
import { CustomSnackbar, DialogConfirmation } from '../../utils/dialog-notifications.js';
import { Table, TableBody, TableContainer, TableHead, } from '@mui/material';
import { formatDate } from '../../utils/table/table-tools.js';

export const patientDetails = (row) => {
    return (
        <div className='d-flex justify-content-center row '>
            <TableContainer sx={{ p: 0, m: 0 }}>
                <Table size='small' aria-label='Patient Details'>
                    <TableHead>
                        <TableRow>
                            <TableCell>Patient</TableCell>
                            <TableCell>ClinicID</TableCell>
                            <TableCell>Station ID</TableCell>
                            <TableCell>Bed N°</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        <TableRow>
                            <TableCell>{row.ID}</TableCell>
                            <TableCell>{row.ClinicID}</TableCell>
                            <TableCell>{row.StationID}</TableCell>
                            <TableCell>{row.BedNr}</TableCell>
                        </TableRow>
                    </TableBody>
                </Table>
            </TableContainer>
            <TableContainer sx={{ p: 0, m: 0 }}>
                <Table size='small' aria-label='Patient Details'>
                    <TableHead>
                        <TableRow>
                            <TableCell>First Name</TableCell>
                            <TableCell>Last Name</TableCell>
                            <TableCell>Gender</TableCell>
                            <TableCell>Birthday</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        <TableRow>
                            <TableCell>{row.FirstName}</TableCell>
                            <TableCell>{row.LastName}</TableCell>
                            <TableCell>{row.Gender}</TableCell>
                            <TableCell>{formatDate(row.Birthday)}</TableCell>
                        </TableRow>
                    </TableBody>
                </Table>
            </TableContainer>
            <TableContainer sx={{ p: 0, m: 0 }}>
                <Table size='small' aria-label='Patient Details'>
                    <TableHead>
                        <TableRow>
                            <TableCell>Birth Weight</TableCell>
                            <TableCell>Birth Length</TableCell>
                            <TableCell>Head Circumference</TableCell>
                            <TableCell>Gestational Week</TableCell>
                            <TableCell>Gestational Day</TableCell>
                            <TableCell>Due Date</TableCell>
                            <TableCell>Gestational Age</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        <TableRow>
                            <TableCell>{row.BirthWeight?.toFixed(0)}</TableCell>
                            <TableCell>{row.BirthLength?.toFixed(0)}</TableCell>
                            <TableCell>{row.HeadCircumference?.toFixed(0)}</TableCell>
                            <TableCell>{row.GestationalWeek}</TableCell>
                            <TableCell>{row.GestationalDay}</TableCell>
                            <TableCell>{row.FatFreeMass?.toFixed(0)}</TableCell>
                            <TableCell>{row.FatMass?.toFixed(0)}</TableCell>
                        </TableRow>
                    </TableBody>
                </Table>
            </TableContainer>
            <TableContainer sx={{ p: 0, m: 0 }}>
                <Table size='small' aria-label='Patient Details'>
                    <TableHead>
                        <TableRow>
                            <TableCell>Mother Age</TableCell>
                            <TableCell>Mother Pre-Pregnancy Weight</TableCell>
                            <TableCell>Mother After-Pregnancy Weight</TableCell>
                            <TableCell>Mother Height</TableCell>
                            <TableCell>Father Age</TableCell>
                            <TableCell>Father Weight</TableCell>
                            <TableCell>Father Height</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        <TableRow>
                            <TableCell>{row.MotherAge}</TableCell>
                            <TableCell>{row.MotherPrePregnancyWeight}</TableCell>
                            <TableCell>{row.MotherafterPregnancyWeight}</TableCell>
                            <TableCell>{row.MotherHeight}</TableCell>
                            <TableCell>{row.FatherAge}</TableCell>
                            <TableCell>{row.FatherWeight}</TableCell>
                            <TableCell>{row.FatherHeight}</TableCell>
                        </TableRow>
                    </TableBody>
                </Table>
            </TableContainer>
        </div>
    );
};


export default function PatientView() {
    

    const [records, setRecords] = useState([]);
    const [fetchedData, setData] = useState([]);
    // const [stationsData, setStation] = useState(location.state?.Station || []);
    // const [clinicFetchedData, setClinic] = useState(location.state?.Clinic || []);
    const [mitarbeiterClinic, setMitarbeiterClinic] = useState(null);  // getClinicum()
    const [mitarbeiterStation, setMitarbeiterStation] = useState(null); // getStation()

    const [allStations, setAllStations] = useState(null);
    const [allClinics, setAllClinics] = useState(null);

    const [error, setError] = useState([]);
    const [dataToDisplay, setDataToDisplay] = useState([]);
    const [isLoading, setIsLoading] = useState(false); // true
    const [updateState, forceUpdate] = useReducer((x) => x + 1, 0);
    const [openSnackbar, setSnackbar] = useState(false);
    const [message, setMessage] = useState("Discharge done successfully");
    const navigate = useNavigate();


    useEffect(() => {
        globalFetchDataV2(allStations, setAllStations, API.StationV2.getAll, setIsLoading, null, setError, true);
        globalFetchDataV2(allClinics, setAllClinics, API.ClinicV2.getAll, setIsLoading, null, setError, true);
        loadRecords();
    }, [])

    const loadRecords = () => {
        globalFetchDataV2(records, setRecords, API.PatientV2.getAll, setIsLoading, (data) => {
            setData(data)
            setDataToDisplay(data)
        }, setError, true);
    }

    const handleDischarge = (patient) => {
        DialogConfirmation('Discharge', `Are you sure you want to discharge ${patient.FirstName}?`,
            () => {
                API.PatientV2.discharge(patient.ID)
                    .then((result) => {
                        if (result.status === 200) {
                            loadRecords();
                            setSnackbar(true);
                            setMessage(`Discharge of ${patient.FirstName} done successfully`);
                        }
                    })
            });
    }

    // Update the state variables for clinic and station
    const handleUpdateDisplayData = (clinic, station) => {
        setMitarbeiterClinic(clinic);        
        setMitarbeiterStation(station);
        
        let dataToDisplay = records; // Initialize dataToDisplay with all records

        if (clinic !== null && station !== null) {
            // If both clinic and station are selected, filter the records by matching ClinicID and StationID
            dataToDisplay = records.filter(
                element => element.ClinicID === clinic && element.StationID === station
            );
        } else if (clinic !== null) {
            // If only clinic is selected, filter the records by matching ClinicID
            dataToDisplay = records.filter(element => {
                return element.ClinicID === clinic
            });
        } else if (station !== null) {
            // If only station is selected, filter the records by matching StationID
            dataToDisplay = records.filter(element => {
                return element.StationID === station
            });            
        }

        // Update the state variable for dataToDisplay
        setDataToDisplay(dataToDisplay);    
    };
    function tableHeader() {
        return (
            <>  
                <TableCell key={"ID"} align={"center"} padding={"normal"}> <Autocomplete
                    id="FirstName-demo"
                    options={globalAutocompleteArray(dataToDisplay, "FirstName")}
                    size="small"
                    renderInput={(params) => (
                        <TextField
                            {...params}
                            label={"First Name"}
                            InputProps={{
                                ...params.InputProps,
                            }}
                            InputLabelProps={{
                                shrink: true,
                            }}
                        />
                    )}
                    onChange={(event, newValue) => {
                        if (newValue === null || newValue === undefined)
                            setData(records);
                        else
                            globalHandleSearch(setData, records, "FirstName", newValue);
                    }}
                />

                </TableCell>
                <TableCell key={"LastName"} align={"center"} padding={"normal"}> <Autocomplete
                    id="LastName-demo"
                    options={globalAutocompleteArray(dataToDisplay, "LastName")}
                    size="small"
                    renderInput={(params) => (
                        <TextField
                            {...params}
                            label={"Last Name"}
                            InputProps={{
                                ...params.InputProps,
                            }}
                            InputLabelProps={{
                                shrink: true,
                            }}
                        />
                    )}
                    onChange={(event, newValue) => {
                        if (newValue === null || newValue === undefined)
                            setData(records);
                        else
                            globalHandleSearch(setData, records, "LastName", newValue);
                    }}
                />

                </TableCell>
                <TableCell key={"GrowthChart"} align={"center"} padding={"normal"}>
                    <strong>Growth Chart</strong>
                </TableCell>
                <TableCell key={"details"} align={"center"} padding={"normal"}>
                    <strong>Details</strong>
                </TableCell>
                <TableCell key={"Edit"} align={"center"} padding={"normal"}>
                    <strong>Edit</strong>
                </TableCell>
                <TableCell key={"Discharge"} align={"center"} padding={"normal"}>
                    <strong>Discharge</strong>
                </TableCell>
            </>
        );
    }



    const patientToolbar = () => {
        const modalId = `patientToolbar-table`;
        return (
            <div key={modalId}>
                <ButtonGroup>
                    <FormGroup style={{ minWidth: '25vh', paddingRight: '10px' }}>
                        <Autocomplete
                            id="ClinicID-demo"
                            getOptionLabel={option => option.label ? option.label : ''}
                            isOptionEqualToValue={(option, value) => option.id === value.id}
                            options={globalAutocompleteOptionsLabel(allClinics, "ID",  "Name")}
                            size="small"
                            renderInput={(params) => (
                                <TextField
                                    {...params}
                                    label={"Clinic Name"}
                                    InputProps={{
                                        ...params.InputProps,
                                    }}
                                    InputLabelProps={{
                                        shrink: true,
                                    }}
                                />
                            )}
                            // defaultValue={mitarbeiterClinic}
                            onChange={(event, newValue, reason) => {
                                if(reason === 'clear'){
                                    setData(records);
                                    handleUpdateDisplayData(null, null);
                                    return;
                                }
                                if (newValue === null || newValue === undefined) {
                                    setData(records);
                                    handleUpdateDisplayData(null, mitarbeiterStation);
                                } else {
                                    const item = allClinics.find((element) => element.ID === newValue.id);
                                    globalHandleSearch(setData, records, "ClinicID", item.ID);
                                    handleUpdateDisplayData(item.ID, mitarbeiterStation);
                                }
                            }}
                        />
                    </FormGroup>
                    <FormGroup style={{ minWidth: '20vh', paddingRight: '10px' }}>
                        <Autocomplete
                            id="StationName-demo"
                            getOptionLabel={option => option.label ? option.label : ''}
                            isOptionEqualToValue={(option, value) => option.id === value.id}
                            options={globalAutocompleteOptionsLabel(allStations, "ID",  "Name")}
                            size="small"
                            renderInput={(params) => (
                                <TextField
                                    {...params}
                                    label={"Station Name"}
                                    InputProps={{
                                        ...params.InputProps,
                                    }}
                                    InputLabelProps={{
                                        shrink: true,
                                    }}
                                />
                            )}
                            // defaultValue={mitarbeiterStation}                            
                            onChange={(event, newValue, reason) => {
                                if(reason === 'clear'){
                                    setData(records);
                                    handleUpdateDisplayData(null, null);
                                    return;
                                }
                                if (newValue === null || newValue === undefined) {
                                    setData(records);
                                    handleUpdateDisplayData(mitarbeiterClinic, null);
                                } else {
                                    const item = allStations.find((element) => element.ID === newValue.id);
                                    globalHandleSearch(setData, records, "StationID", item.ID);
                                    handleUpdateDisplayData(mitarbeiterClinic, item.ID);
                                }
                            }}
                        />
                    </FormGroup>
                    <Button onClick={() => navigate(PATIENT_TASKS)} startIcon={OffenIcon} endIcon={tasksIcon} >
                        Tasks
                    </Button>
                </ButtonGroup>

            </ div>
        );
    };

    function bodyMapper(data) {
        return data.map((row, index) => {
            return (
                <TableRow hover role="checkbox" tabIndex={-1} key={index}>
                    <TableCell align="left" padding={"none"}>{row.FirstName}</TableCell>
                    <TableCell align="left" padding={"none"}>{row.LastName}</TableCell>
                    <TableCell align="center" padding={"none"}>
                        <Button variant='outlined' onClick={() => navigate(CHART, { state: { patientForChart: row, otherPatient: records } })}>
                            {graphIcon}
                        </Button>
                    </TableCell>
                    <TableCell align="center" padding={"none"}>
                        <DetailsDesign
                            Title={`Patient Details N°: ${row?.ID}`}
                            children={patientDetails(row)}
                            icon={DetailsIcon}
                            ID={row.ID}
                        />
                    </TableCell>
                    <TableCell align="center" padding={"none"}>
                        <Button variant='outlined' onClick={() => navigate(EDITPATIENT, { state: { patient: row } })}>
                            {EditIcon}
                        </Button>
                    </TableCell>
                    <TableCell align="center" padding={"none"}>
                        <Button variant='outlined' color='warning' onClick={() => handleDischarge(row)}>
                            {dischargeIcon}
                        </Button>
                    </TableCell>
                </TableRow>
            );
        });
    }


    return (
        <>
            <HandleAxiosError error={error} />
            <CustomSnackbar open={openSnackbar} autoHide={3000} message={message} handleClose={() => {
                setSnackbar(false);
                forceUpdate();
            }} severity={"success"} />
            
            <GenericTableView
                tableTitle={<>Patients List {NewKidIcon}</>}
                elementCount={dataToDisplay?.length}
                createLink={CREATEPATIENT}
                createText={<>Create New Patient {newElemenetIcon}</>}
                toolbar={patientToolbar}
                header={tableHeader}
                body={fetchedData}
                bodyMapper={bodyMapper}
                isLoading={false} // isLoading
                footerText='Patient per page'
            />
            
        </>
    );
}