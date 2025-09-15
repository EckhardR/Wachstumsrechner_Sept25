import { Autocomplete, Button, ButtonGroup, FormGroup, TableCell, TableRow, TextField } from '@mui/material';
import React, { useEffect, useReducer, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom';
import { getClinicum, getStation, globalAutocompleteArray, globalFetchDataV1, globalFetchDataV2, globalHandleSearch } from '../../services/services-tool.js';
import { API } from '../../services/Api.js';
import { ADMINSCREEN, CHART, CREATEPATIENT, EDITPATIENT } from '../../routes/Routes-Links.js';
import HandleAxiosError from '../../utils/handle-axios-error.js';
import { GenericTableView } from '../../utils/table/generic-table-view.js';
import { DetailsIcon, VerlaufIcon, graphIcon } from '../../utils/global-icons.js';
import { BackgroundThird } from '../../utils/global-variables.js';
import { CancelButton, formatDate } from '../../utils/table/table-tools.js';
import { DetailsDesign } from '../../utils/table/details-design.js';
import { patientDetails } from './patient-view.js';

export default function PatientCapture() {
    const location = useLocation();

    const [records, setRecords] = useState([]);
    const [fetchedData, setData] = useState([]);
    const [error, setError] = useState([]);
    const [isLoading, setIsLoading] = useState(false); // true
    const [searchingBirthday, setbirthday] = useState(null);
    const [updateState, forceUpdate] = useReducer((x) => x + 1, 0);
    const navigate = useNavigate();

    useEffect(() => {
        globalFetchDataV2(records, setRecords, API.TodosV2.getAll, setIsLoading, setData, setError, true);
    }, [updateState, location]);

    function tableHeader() {
        return (
            <>
                <TableCell key={"ID"} align={"center"} padding={"normal"}>
                    <Autocomplete
                        id="ID-demo"
                        options={globalAutocompleteArray(fetchedData, "ID")}
                        renderInput={(params) => (
                            <TextField
                                {...params}
                                label={"Patient ID"}
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
                                globalHandleSearch(setData, records, "ID", newValue);
                        }}
                    />
                </TableCell>
                <TableCell key={"FullName"} align={"center"} padding={"normal"}>
                    Full Name
                </TableCell>
                <TableCell key={"Birthday"} align={"center"} padding={"normal"}>
                    <TextField
                        id="BirthdayID"
                        label="Birthday"
                        type="date"
                        value={searchingBirthday}
                        InputLabelProps={{
                            shrink: true,
                        }}
                        onChange={(event) => {
                            const searchTargetValue = event.target.value;
                            setbirthday(searchTargetValue);
                            if (!searchTargetValue)
                                setData(records);
                            else {
                                const filteredData = fetchedData?.filter((element) =>
                                    formatDate(element?.Birthday) === formatDate(searchTargetValue)
                                );
                                setData(filteredData);
                            }
                        }}
                    />
                </TableCell>
                <TableCell key={"GrowthChart"} align={"center"} padding={"normal"}>
                    Growth Chart
                </TableCell>
                <TableCell key={"Weight"} align={"center"} padding={"normal"}>
                    Weight
                </TableCell>
                <TableCell key={"Length"} align={"center"} padding={"normal"}>
                    Length
                </TableCell>
                <TableCell key={"HeadCircumference"} align={"center"} padding={"normal"}>
                    Head Circumference
                </TableCell>
                <TableCell key={"PercentFatMass"} align={"center"} padding={"normal"}>
                    Percent Fatt mass
                </TableCell>
                <TableCell key={"FatMass"} align={"center"} padding={"normal"}>
                    Fatt mass
                </TableCell>
                <TableCell key={"fatFreemass"} align={"center"} padding={"normal"}>
                    Fatt Free mass
                </TableCell>
                <TableCell key={"Date"} align={"center"} padding={"normal"}>
                    Date
                </TableCell>
                <TableCell key={"details"} align={"center"} padding={"normal"}>
                    Details
                </TableCell>
            </>
        );
    }

    function bodyMapper(fetchedData) {
        return fetchedData?.map((row, index) => {
            return (
                <TableRow hover role="checkbox" tabIndex={-1} key={index} style={{ backgroundColor: BackgroundThird }}>
                    <TableCell align="center" padding={"none"}>{row.ID}</TableCell>
                    <TableCell align="center" padding={"none"}>{row.FirstName + ', ' + row.LastName}</TableCell>
                    <TableCell align="center" padding={"none"}>{formatDate(row.Birthday)}</TableCell>
                    <TableCell align="center" padding={"none"}>
                        <Button variant='outlined' onClick={() => navigate(CHART, {
                            state: {
                                patientForChart: row, otherPatient: records.filter((item, index, self) => {
                                    // Check if the item is not empty and has an 'id' property
                                    if (Object.keys(item).length > 0 && 'ID' in item) {
                                        return index === self.findIndex((t) => t.ID === item.ID);
                                    }
                                    return false;
                                })
                            }
                        })}>
                            {graphIcon}
                        </Button>
                    </TableCell>
                    <TableCell align="center" padding={"none"}>
                        {row.Weight ? (row.Weight?.toFixed(0) + ' (g)') : null} </TableCell>
                    <TableCell align="center" padding={"none"}>
                        {row.Length ? (row.Length?.toFixed(0) + ' (cm)') : null} </TableCell>
                    <TableCell align="center" padding={"none"}>
                        {row.HeadCircumference ? (row.HeadCircumference + ' (cm)') : null}
                    </TableCell>
                    <TableCell align="center" padding={"none"}>
                        {row.PercentFatFreeMass ? (row.PercentFatFreeMass?.toFixed(2) + ' (&)') : null}
                    </TableCell>
                    <TableCell align="center" padding={"none"}>
                        {row.FatMass ? (row.FatMass?.toFixed(0) + ' (cm)') : null}
                    </TableCell>
                    <TableCell align="center" padding={"none"}>
                        {row.FatFreeMass ? (row.FatFreeMass?.toFixed(0) + ' (cm)') : null}
                    </TableCell>
                    <TableCell align="center" padding={"none"}>
                        {formatDate(row.TaskDate)}
                    </TableCell>
                    <TableCell align="center" padding={"none"}>
                        <DetailsDesign
                            Title={`Patient Details N°: ${row?.ID}`}
                            children={patientDetails(row)}
                            icon={DetailsIcon}
                            ID={row.ID}
                        />
                    </TableCell>
                </TableRow>
            );
        });
    }


    return (
        <>
            <HandleAxiosError error={error} />
            <CancelButton />

            { fetchedData &&
            
                <GenericTableView
                    tableTitle={<>Patients Capture {VerlaufIcon}</>}
                    elementCount={fetchedData?.length}
                    disabledLink={true}
                    header={tableHeader}
                    body={fetchedData}
                    bodyMapper={bodyMapper}
                    isLoading={isLoading}
                    footerText='Capture per page'
                />
            
            }
            
        </>
    );
}