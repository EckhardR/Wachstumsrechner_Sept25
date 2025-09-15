import { Autocomplete, Button, ButtonGroup, FormGroup, TableCell, TableRow, TextField } from '@mui/material';
import React, { useEffect, useReducer, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom';
import { API } from '../../../services/Api.js';
import { globalAutocompleteArray, globalFetchDataV2, globalHandleSearch } from '../../../services/services-tool.js';
import { EditIcon, DeletIcon, OffenIcon, StationIcon, newElemenetIcon, tasksIcon } from '../../../utils/global-icons.js';
import { ADMINSCREEN, CREATESTATION, EDITSTATION } from '../../../routes/Routes-Links.js';
import { GenericTableView } from '../../../utils/table/generic-table-view.js';
import HandleAxiosError from '../../../utils/handle-axios-error.js';
import { DialogConfirmation } from '../../../utils/dialog-notifications.js';


export default function StationView() {
    const location = useLocation();

    const [clinicRecords, setClinicRecords] = useState(location?.state?.clinics || []);
    const [ClinicData, setClinicData] = useState(location?.state?.clinics || []);
    const [stationRecords, setStationRecords] = useState(location?.state?.station || []);
    const [StationData, setStationData] = useState(location?.state?.station || []);
    const [error, setError] = useState([]);
    const [isLoading, setIsLoading] = useState(false); // true
    const [updateState, forceUpdate] = useReducer((x) => x + 1, 0);
    const navigate = useNavigate();

    useEffect(() => {
        updateDataFromDB();
    }, [updateState, location]);


    const updateDataFromDB = () => {
        globalFetchDataV2(clinicRecords, setClinicRecords, API.ClinicV2.getAll, setIsLoading, setClinicData, setError, true);
        globalFetchDataV2(stationRecords, setStationRecords, API.StationV2.getAll, setIsLoading, setStationData, setError, true);
    }

    function getClinicName(id) {
        // Find the object with the specified ID in the array
        const foundObject = clinicRecords.find((obj) => obj.ID === id);

        // Return the name of the found object, or null if not found
        return foundObject ? foundObject.Name : null;
    }


    const handleDeleteStation = (station) => {        
        DialogConfirmation('Discharge', `Are you sure you want to discharge ${station.Name}?`,
            () => {
                API.StationV2.discharge(station.ID)
                    .then((result) => {
                        console.log(result);
                        if (result?.status === 200) {
                            updateDataFromDB();
                        }
                    })
            }
        );
    }

    function tableHeader() {
        return (
            <>
                <TableCell key={"StationNr"} align={"center"} padding={"normal"}>
                    <Autocomplete
                        id="StationNr-demo"
                        options={globalAutocompleteArray(stationRecords, "StationNr")}
                        size="small"
                        renderInput={(params) => (
                            <TextField
                                {...params}
                                label={"Station Nr"}
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
                                setStationData(stationRecords);
                            else
                                globalHandleSearch(setStationData, stationRecords, "StationNr", newValue);
                        }}
                    />
                </TableCell>
                <TableCell key={"ClinicID"} align={"center"} padding={"normal"}>
                    <Autocomplete
                        id="ClinicID-demo"
                        options={clinicRecords}
                        size="small"
                        getOptionLabel={(option) => option.Name } // Set clinic name as the display option
                        getOptionKey={(option) => option.ClinicID} // Set clinic ID as the value option
                        renderInput={(params) => (
                            <TextField
                                {...params}
                                label={"Clinic"}
                                InputProps={{
                                    ...params.InputProps,
                                }}
                                InputLabelProps={{
                                    shrink: true,
                                }}
                            />
                        )}
                        onChange={(event, newValue) => {
                            if (newValue === null || newValue === undefined){
                                setStationData(stationRecords);
                            } else {
                                globalHandleSearch(setStationData, stationRecords, "ClinicID", newValue.ID);
                            }
                        }}
                    />

                </TableCell>
                <TableCell key={"Name"} align={"center"} padding={"normal"}> <Autocomplete
                    id="Name-demo"
                    options={globalAutocompleteArray(stationRecords, "Name")}
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
                    onChange={(event, newValue) => {
                        if (newValue === null || newValue === undefined)
                            setStationData(stationRecords);
                        else
                            globalHandleSearch(setStationData, stationRecords, "Name", newValue);
                    }}
                />

                </TableCell>
                <TableCell key={"Bed"} align={"center"} padding={"normal"}>
                    Bed
                </TableCell>
                <TableCell key={"Edit"} align={"center"} padding={"normal"}>
                    Edit
                </TableCell>
            </>
        );
    }

    function bodyMapper(data) {
        return data.map((row, index) => {
            return (
                <TableRow hover role="checkbox" tabIndex={-1} key={index}>
                    <TableCell align="center" padding={"none"}>{row.StationNr}</TableCell>
                    <TableCell align="center" padding={"none"}>{getClinicName(row.ClinicID)}</TableCell>
                    <TableCell align="center" padding={"none"}>{row.Name}</TableCell>
                    <TableCell align="center" padding={"none"}>{JSON.parse(row.BedArray)?.join(",")}</TableCell>
                    <TableCell align="center" padding={"none"}>
                        <ButtonGroup variant="outlined" size="small" aria-label="Basic button group">
                            <Button variant='outlined' onClick={() => navigate(EDITSTATION, { state: { Station: row, editingsmode: true } })}>
                                {EditIcon}
                            </Button>
                            <Button variant='outlined' padding={"none"} onClick={() => handleDeleteStation(row)}>
                                {DeletIcon}
                            </Button>
                        </ButtonGroup>
                    </TableCell>
                </TableRow>
            );
        });
    }

    const stationToolbar = () => {
        const modalId = `patientToolbar-table`;
        return (
            <div key={modalId}>
                <ButtonGroup>
                    <Button onClick={() => navigate(ADMINSCREEN)} startIcon={OffenIcon} endIcon={tasksIcon}>
                        Tasks
                    </Button>
                </ButtonGroup>

            </ div>
        );
    };
    return (
        <>
            <HandleAxiosError error={error} />
            <GenericTableView
                tableTitle={<>Stations List {StationIcon}</>}
                elementCount={StationData?.length}
                createLink={CREATESTATION}
                toolbar={stationToolbar}
                createText={<>Create New Station {newElemenetIcon}</>}
                header={tableHeader}
                body={StationData}
                bodyMapper={bodyMapper}
                isLoading={false} // isLoading
                footerText='Station per page'
            />
        </>
    );
}