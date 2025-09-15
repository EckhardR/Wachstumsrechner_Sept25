import { Paper, Grid, Button, ButtonGroup, TableCell, TableRow } from '@mui/material';
import React, { useEffect, useReducer, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom';
import { API } from '../../../services/Api.js';
import { globalFetchDataV2 } from '../../../services/services-tool.js';
import { EditIcon, DeletIcon, ClinicIcon, newElemenetIcon } from '../../../utils/global-icons.js';
import { CLINIC_CREATE, CLINIC_EDIT } from '../../../routes/Routes-Links.js';
import { GenericTableView } from '../../../utils/table/generic-table-view.js';
import HandleAxiosError from '../../../utils/handle-axios-error.js';
import { DialogConfirmation } from '../../../utils/dialog-notifications.js';


export default function ClinicView() {
    const location = useLocation();

    const [clinicRecords, setClinicRecords] = useState(location?.state?.clinics || []);
    const [ClinicData, setClinicData] = useState(location?.state?.clinics || []);
    const [error, setError] = useState([]);
    const [isLoading, setIsLoading] = useState(false); // true
    const [updateState, forceUpdate] = useReducer((x) => x + 1, 0);
    const navigate = useNavigate();

    useEffect(() => {
        updateDataFromDB();
    }, [updateState, location]);


    const updateDataFromDB = () => {
        globalFetchDataV2(clinicRecords, setClinicRecords, API.ClinicV2.getAll, setIsLoading, setClinicData, setError, true);
    }


    const handleDeleteStation = (clinic) => {        
        DialogConfirmation('Discharge', `Are you sure you want to discharge ${clinic.Name}?`,
            () => {
                API.ClinicV2.delete(clinic.ID)
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
                <TableCell key={"Id"} align={"left"} padding={"normal"}>
                    <strong>ID</strong>
                </TableCell>

                <TableCell key={"Name"} align={"left"} padding={"normal"}>
                    <strong>Name</strong>
                </TableCell>
                <TableCell key={"Action"} align={"right"} padding={"normal"}>
                    <strong>Action</strong>
                </TableCell>
            </>
        );
    }

    function bodyMapper(data) {
        return data.map((row, index) => {
            return (
                <TableRow hover role="checkbox" tabIndex={-1} key={index}>
                    <TableCell align="left" padding={"none"}>{row.ID}</TableCell>
                    <TableCell align="left" padding={"none"}>{row.Name}</TableCell>
                    <TableCell align="right" padding={"none"}>
                        <ButtonGroup variant="outlined" size="small" aria-label="Basic button group">
                            <Button variant='outlined' onClick={() => navigate(CLINIC_EDIT, { state: { Clinic: row, editingsmode: true } })}>
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

    return (
        <>
            <Grid
                container
                spacing={0}
                alignItems="center"
                justify="center"                
            >
                <Grid item xs={12} md={12} lg={12} xl={12} sx={{ padding: '0px', margin: '0px' }}>
                    <Paper elevation={0} sx={{ padding: 2, marginBottom: 2 }}>
                        <HandleAxiosError error={error} />
                        
                        <GenericTableView
                            tableTitle={<>Clinics List {ClinicIcon}</>}
                            elementCount={ClinicData?.length}
                            createLink={CLINIC_CREATE}                            
                            createText={<>Create New Clinic {newElemenetIcon}</>}
                            header={tableHeader}
                            body={ClinicData}
                            bodyMapper={bodyMapper}
                            isLoading={false} // isLoading
                            footerText='Clinics per page'
                        />
                    </Paper>
                </Grid>
            </Grid>
        </>
    );
}