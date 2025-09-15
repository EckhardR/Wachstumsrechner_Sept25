import React from 'react'
import { Link } from "react-router-dom";
import * as ROUTES from "../../routes/Routes-Links.js";
import { AbteilungIcon, ArchivIcon, DetailsIcon, ClinicIcon, UserIcon, VerlaufIcon } from "../../utils/global-icons.js";
import { Box } from '@mui/material';
import OpenedTasks from './tasks/open-tasks.js';
import { BackgroundThird } from '../../utils/global-variables.js';
import { useGlobalTranslation } from '../../services/TranslationProvider.js';

export default function AdminScreen() {
    const { t } = useGlobalTranslation();
    return (
        <>
            <div className="row d-flex  flex-wrap justify-content-center pt-2 w-100">
                <Box sx={{width:'85%', backgroundColor:BackgroundThird, p:0}}>
                    <OpenedTasks />
                </Box>
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
                
            </div>
        </>
    )
}