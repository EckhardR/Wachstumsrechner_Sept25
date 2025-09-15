import { Button, ButtonGroup, TableCell, TableRow } from '@mui/material';
import React, { useEffect, useReducer, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom';
import { getClinicum, getStation, globalFetchDataV1, globalFetchDataV2 } from '../../services/services-tool.js';
import { API } from '../../services/Api.js';
import { ADMINSCREEN, CHART } from '../../routes/Routes-Links.js';
import HandleAxiosError from '../../utils/handle-axios-error.js';
import { GenericTableView } from '../../utils/table/generic-table-view.js';
import { DetailsDesign } from '../../utils/table/details-design.js';
import { ArchivIcon, DetailsIcon, OffenIcon, graphIcon, ReplayFormIcon, tasksIcon } from '../../utils/global-icons.js';
import { CustomSnackbar } from '../../utils/dialog-notifications.js';
import { patientDetails } from './patient-view.js';
import { BackgroundThird } from '../../utils/global-variables.js';
import { formatDate } from '../../utils/table/table-tools.js';

export default function PatientArhiv() {
    const location = useLocation();
    const [records, setRecords] = useState([]);
    const [fetchedData, setData] = useState([]);
    const [stationsData, setStation] = useState(location.state?.Station || []);
    const [clinicFetchedData, setClinic] = useState(location.state?.Clinic || []);
    const [mitarbeiterClinic, setMitarbeiterClinic] = useState(getClinicum());
    const [mitarbeiterStation, setMitarbeiterStation] = useState(getStation());
    const [openSnackbar, setSnackbar] = useState(false);
    const [error, setError] = useState([]);
    const [dataToDisplay, setDataToDisplay] = useState([]);
    const [message, setMessage] = useState("Resore done successfully");
    const [isLoading, setIsLoading] = useState(true); // true
    const [selectedDate, setSelectedDate] = useState(false); // true
    const [updateState, forceUpdate] = useReducer((x) => x + 1, 0);
    const navigate = useNavigate();

    useEffect(() => {
        globalFetchDataV1(
            stationsData,
            setStation,
            API.StationV2.getAll,
            setIsLoading,
            setError,
            true,
        ).then(() => globalFetchDataV1(
            clinicFetchedData,
            setClinic,
            API.ClinicV2.getAll,
            setIsLoading,
            setError,
            true,
        ).then(() =>  globalFetchDataV2(
            records,
            setRecords,
            API.PatientV2.getArchiv,
            setIsLoading,
            setData,
            setError,
            false
        ).then(()=> handleUpdateDisplayData(
            mitarbeiterClinic,
            mitarbeiterStation
        ))));
        // globalFetchDataV2(records, setRecords, API.PatientV".getAll, setIsLoading, setDataToDisplay, setError, true);
    }, [updateState, location, records]);

    function searchByDate(date) {
        // Umwandeln des eingegebenen Datums in verschiedene Formate
        const formattedDate = new Date(date);
        const formattedDateISO = formattedDate.toISOString().split('T')[0];
        const formattedDateLocale = formattedDate.toLocaleDateString('de-DE');
      
        // Suche nach dem Element im Array mit demselben Datum
        const result = records.find(element => {
          // Überprüfen, ob das Datum übereinstimmt (auch wenn das Format unterschiedlich ist)
          return (
            element.Birthday === formattedDate ||
            element.Birthday === formattedDateISO ||
            element.Birthday === formattedDateLocale
          );
        });
      
        setDataToDisplay(result);
    }

    
    const restorePatient = (patient) => {
            API.PatientV2.restore(patient.ID)
            .then((result) => {
                if (result.status === 200) {
                    records.splice(records.findIndex((item) => 
                        item.ID === patient.ID
                    ), 1)
                    setSnackbar(true);
                    setMessage(`Restore of ${patient.FirstName} done successfully`);
                }
            })
    }
      

    /**
    
    handleUpdateDisplayData Function
    Updates the display data based on the selected clinic and station.
    Filters the records array to show relevant data.
    @param {number|null} clinic - The ID of the selected clinic, or null if not selected.
    @param {number|null} station - The ID of the selected station, or null if not selected.
    @returns {void}
    */
    const handleUpdateDisplayData = (clinic, station) => {
        // Update the state variables for clinic and station
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
            dataToDisplay = records.filter(element => element.ClinicID === clinic);
        } else if (station !== null) {
            // If only station is selected, filter the records by matching StationID
            dataToDisplay = records.filter(element => element.StationID === station);
        }

        // Update the state variable for dataToDisplay
        setDataToDisplay(dataToDisplay);
    };
    function tableHeader() {
        return (
            <>
                <TableCell key={"FirstName"} align={"center"} padding={"normal"}> 
                    <strong>FirstName</strong>
                </TableCell>
                <TableCell key={"LastName"} align={"center"} padding={"normal"}>
                    <strong>LastName</strong>
                </TableCell>
                <TableCell key={"date"} align={"center"} padding={"normal"}>
                    <strong>Birthday</strong>
                </TableCell>
                <TableCell key={"GrowthChart"} align={"center"} padding={"normal"}>
                    <strong>Growth Chart</strong>
                </TableCell>
                <TableCell key={"details"} align={"center"} padding={"normal"}>
                    <strong>Details</strong>
                </TableCell>
                <TableCell key={"restore"} align={"center"} padding={"normal"}>
                    <strong>Restore</strong>
                </TableCell>
            </>
        );
    }



    const patientToolbar = () => {
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

    function bodyMapper(fetchedData) {
        return fetchedData.map((row, index) => {
            return (
                <TableRow hover role="checkbox" tabIndex={-1} key={index} style={{backgroundColor:BackgroundThird}}>
                    <TableCell align="center" padding={"none"}>{row.FirstName}</TableCell>
                    <TableCell align="center" padding={"none"}>{row.LastName}</TableCell>
                    <TableCell align="center" padding={"none"}>{formatDate(row.Birthday)}</TableCell>
                    <TableCell align="center" padding={"none"}>
                    <Button variant='outlined' onClick={() => navigate(CHART, { state: { patientForChart: row, otherPatient: fetchedData} })}>
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
                        <Button variant='outlined' onClick={() => restorePatient(row) }>
                            {ReplayFormIcon}
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
                tableTitle={<>Patients Archiv {ArchivIcon}</>}
                elementCount={dataToDisplay?.length}
                disabledLink={true}
                toolbar={patientToolbar}
                header={tableHeader}
                body={dataToDisplay}
                bodyMapper={bodyMapper}
                isLoading={false} // isLoading
                footerText='Patient per page'
            />
        </>
    );
}