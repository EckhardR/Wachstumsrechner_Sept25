import React, { useState } from 'react'
import { API } from '../../services/Api.js';
import { CustomSnackbar, DialogConfirmation } from '../../utils/dialog-notifications.js';
import HandleAxiosError from '../../utils/handle-axios-error.js';
import { EditDesign } from '../../utils/table/edit-design.js';
import { PatientForm } from './patient-form.js';
import { useLocation, useNavigate } from 'react-router-dom';
import { PATIENT } from '../../routes/Routes-Links.js';

export default function PatientEdit() {

    const location = useLocation();
    const patientRef = React.useRef();
    const navigate = useNavigate();
    const [error, setError] = useState([]);
    const [openSnackbar, setSnackbar] = useState(false);

    let handleUpdate = () => {
        const currentPatient = patientRef.current.getPatient();
        if (currentPatient === location.state?.patient) return false;
        DialogConfirmation('Create', `Are you sure you want to update this Patient ${currentPatient?.FirstName}, ${currentPatient?.LastName} in Bed ${currentPatient?.BedNr}?`,
            () => {
                API.PatientV2.update(currentPatient)
                    .then((result) => {
                        if (result.status === 200){
                            setSnackbar(true);
                            navigate(`${PATIENT}`);
                        }
                    })  
                    .catch((error) => {
                        // Handle any unexpected errors here
                        setError(`Unexpected error occurred: ${error.message}`);
                    });
            });
    };


    return (
        <>
            <HandleAxiosError error={error} />
            <CustomSnackbar open={openSnackbar} autoHide={3000} message={"The patient's update was completed successfully."} handleClose={() => {
                setSnackbar(false);
                patientRef.current.cleanPatient();
                navigate(`${PATIENT}`);
            }} severity={"success"} />
            <EditDesign Title='Patient editing' handleSave={handleUpdate}
                cancel={() => {
                    navigate(-1);
                }}>
                <PatientForm ref={patientRef} />
            </EditDesign>

        </>
    )
}
