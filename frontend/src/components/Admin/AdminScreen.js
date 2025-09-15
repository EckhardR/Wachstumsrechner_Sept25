import React from 'react'
import { Link } from "react-router-dom";
import * as ROUTES from "../../routes/Routes-Links.js";
import { AbteilungIcon, ArchivIcon, DetailsIcon, ClinicIcon, UserIcon, VerlaufIcon } from "../../utils/global-icons.js";
import { Box, Button, Card, CardActionArea, CardActions, CardContent, CardHeader, CardMedia, Container, Grid, IconButton, Paper, Typography } from '@mui/material';
import OpenedTasks from './tasks/open-tasks.js';
import { BackgroundThird } from '../../utils/global-variables.js';
import { useGlobalTranslation } from '../../services/TranslationProvider.js';



import USER_MANAGEMENT_IMAGE from '../../images/admin/userverwaltung.jpg'
import CLINICS_IMAGE from '../../images/admin/kliniken.jpg'
import STATIONS_IMAGE from '../../images/admin/userverwaltung.jpg'
import PATIENTS_IMAGE from '../../images/admin/patienten.jpg'
import PATIENTS_ARCHIVE_IMAGE from '../../images/admin/archiv.jpg'
import GROWTHDATA_IMAGE from '../../images/admin/growthdata.jpg'
import ADMISSION_IMAGE from '../../images/admin/admissiontasks.jpg'
import ROUTINE_IMAGE from '../../images/admin/routinetasks.jpg'

export default function AdminScreen() {
    const { t } = useGlobalTranslation();

    const navigationCards = [
        {
            type: 'card',
            title: "Admission Tasks",
            description: "Erstelle Aufgaben für die Patientenaufname.",
            imageURL: ADMISSION_IMAGE,
            link: ROUTES.PATIENT_ADMISSION_TASKS
        },
        {
            type: 'card',
            title: "Routine Tasks",
            description: "Erstelle Routine Aufgaben und organisiere sie.",
            imageURL: ROUTINE_IMAGE,
            link: ROUTES.PATIENT_ROUTINE_TASKS
        },
        {
            type: 'card',
            title: "Wachstumsdaten",
            description: "Dokumentiere und analysiere die Wachstumsentwicklung.",
            imageURL: GROWTHDATA_IMAGE,
            link: ROUTES.PATIENTCAPTURE
        },
        {
            type: 'card',
            title: "Patienten",
            description: "Füge Patienten hinzu oder bearbeite deren Daten.",
            imageURL: PATIENTS_IMAGE,
            link: ROUTES.PATIENT
        },
        {
            type: 'card',
            title: "Patienten Archiv",
            description: "Durchsuche und verwalte archivierte Patientendaten.",
            imageURL: PATIENTS_ARCHIVE_IMAGE,
            link: ROUTES.PATIENTARCHIV
        },
        {
            type: 'card',
            title: "User Verwaltung",
            description: "Verwalte Benutzer, Rollen und Zugriffsrechte.",
            imageURL: USER_MANAGEMENT_IMAGE,
            link: ROUTES.USER
        },
        {
            type: 'card',
            title: "Klinik Verwaltung",
            description: "Organisiere Klinken und verwalte sie.",
            imageURL: CLINICS_IMAGE,
            link: ROUTES.CLINIC
        },
        {
            type: 'card',
            title: "Stationen Verwaltung",
            description: "Organisiere Stationen innerhalb der Kliniken.",
            imageURL: STATIONS_IMAGE,
            link: ROUTES.STATION
        }
        
      ];


    return (
        <>

            <Container maxWidth="lg" style={{marginBottom: '100px'}}>

                <Grid container spacing={4}>

                    { navigationCards.map((item, index) => {
                        return (
                            <Grid xs={3} item key={`card-item-${index}`}>
                                
                                { item && item.type === 'card' && 
                                    
                                    <Card sx={{ minHeight: 300 }}>
                                    
                                        <CardActionArea>
                                            <CardMedia
                                                component="img"
                                                width="64"
                                                height="140"
                                                image={item.imageURL}
                                                alt={item.title}
                                                sx={{ padding: "1em 1em 0 1em", objectFit: "contain" }}
                                            />
                                            <CardContent>
                                            <Typography gutterBottom variant="h5" component="div">
                                                 { item.title }
                                            </Typography>
                                            <Typography variant="body2" color="text.secondary">
                                                { item.description }
                                            </Typography>

                                            </CardContent>
                                        </CardActionArea>
                                        
                                        <CardActions>
                                        
                                            <Button size="small" color="primary" component={Link} to={item.link}>
                                                Seite Öffnen
                                            </Button>
                                        </CardActions>
                                        
                                    </Card>

                                }
                                 </Grid>
                            )

                        })
                        
                    }
                    
                
                </Grid>

            </Container>

           { /* 
            <div className="row d-flex flex-wrap justify-content-center pt-2 w-100">
            
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
            */ }

        </>
    )
}