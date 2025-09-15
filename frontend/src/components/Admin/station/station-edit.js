import React, { useState } from 'react'
import { API } from '../../../services/Api.js';
import { DialogSuccessUpdated } from '../../../utils/dialog-notifications.js';
import HandleAxiosError from '../../../utils/handle-axios-error.js';
import { EditButtons, EditDesign } from '../../../utils/table/edit-design.js';
import { StationForm } from './station-form.js';
import { useLocation, useNavigate } from 'react-router-dom';

export default function StationEdit() {

    const location = useLocation();
    const StationRef = React.useRef();
    const navigate = useNavigate();
    const [error, setError] = useState([]);

    let handleUpdate = () => {
        const currentStation = StationRef.current.getStation();
        if (currentStation === location.state?.Station) return false;
        API.StationV2.update(currentStation)
            .then((result) => {
                    console.log('results', result)
                    navigate(-1);
                // DialogSuccessUpdated('Station', () => navigate(-1))
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
                Title='Station editing'
                handleSave={handleUpdate}
                cancel={() => {
                    navigate(-1);
                }}>
                <StationForm ref={StationRef} />

            </EditDesign>

        </>
    )
}
