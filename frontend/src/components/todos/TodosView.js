import React from 'react'
import { Box } from '@mui/material';
import OpenedTasks from '../Admin/tasks/open-tasks.js';
import { BackgroundThird } from '../../utils/global-variables.js';

export default function TodosView() {
    
    return (
        <>
            <div className="row d-flex  flex-wrap justify-content-center pt-2 w-100">
                <Box sx={{width:'85%', backgroundColor:BackgroundThird, p:0}}>
                    <OpenedTasks />
                </Box>

                { /* 
                <Link
                    to={ROUTES.USER}
                    className="text-center col-12 col-md-12 col-lg-5 m-1  btn btn-outline-dark border btn-block border-dark fw-bold"
                >
                    {t("user_management")} {UserIcon}
                </Link>
                
               <Link
                    to={ROUTES.PATIENTCAPTURE}
                    className="text-center col-12 col-md-12 col-lg-5 m-1  btn btn-outline-dark border btn-block border-dark fw-bold"
                >
                {t("growth_data")}{VerlaufIcon}
                </Link>

                

                <Link
                    to={ROUTES.CLINIC}
                    className="text-center col-12 col-md-12 col-lg-5 m-1  btn btn-outline-dark border btn-block border-dark fw-bold"
                >
                {t("clinic_management")}{ClinicIcon}
                </Link>
               

                <Link
                    to={ROUTES.PATIENT}
                    className="text-center col-12 col-md-12 col-lg-5 m-1  btn btn-outline-dark border btn-block border-dark fw-bold"
                >
                {t("patient_list")} {DetailsIcon}
                </Link>

                <Link
                    to={ROUTES.STATION}
                    className="text-center col-12 col-md-12 col-lg-5 m-1  btn btn-outline-dark border btn-block border-dark fw-bold"
                >
                {t("station_managemenet")}{AbteilungIcon}
                </Link>
                          
                <Link
                    to={ROUTES.PATIENTARCHIV}
                    className="text-center col-12 col-md-12 col-lg-5 m-1  btn btn-outline-dark border btn-block border-dark fw-bold"
                >
                {t("patient_archiv")}{ArchivIcon}
                </Link>

                */ }
                
            </div>
        </>
    )
}