import React, { useState } from 'react'
import { API } from '../../../services/Api.js';
import HandleAxiosError from '../../../utils/handle-axios-error.js';
import { EditDesign } from '../../../utils/table/edit-design.js';
import { ClinicForm } from './clinic-form.js';
import { useLocation, useNavigate } from 'react-router-dom';

export default function ClinicEdit() {

    const location = useLocation();
    const ClinicRef = React.useRef();
    const navigate = useNavigate();
    const [error, setError] = useState([]);

    let handleUpdate = () => {
        const currentClinic = ClinicRef.current.getClinic();
        if (currentClinic === location.state?.Clinic) return false;
        API.ClinicV2.update(currentClinic)
            .then((result) => {
                console.log('results', result)
                navigate(-1);            
            })
            .catch((error) => {
                console.error("error ", error);
                setError(error);
            });
    };


    return (
        <>
            <HandleAxiosError error={error} />
            <EditDesign
                Title='Clinic editing'
                handleSave={handleUpdate}
                cancel={() => {
                    navigate(-1);
                }}>
                <ClinicForm ref={ClinicRef} />

            </EditDesign>

        </>
    )
}
