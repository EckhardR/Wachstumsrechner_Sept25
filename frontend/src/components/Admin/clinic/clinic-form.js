import React, { forwardRef, useImperativeHandle, useState } from "react";
import { TextField, Grid } from "@mui/material";
import { useLocation } from "react-router-dom";

export const ClinicForm = forwardRef((props, ref) => {
    const location = useLocation();
    const [error, setError] = useState(null);
    const [clinic, setClinic] = useState(
        location.state?.Clinic ? location.state.Clinic : {}
    );

    const [isLoading, setIsLoading] = useState(false);
    

    const getClinic = () => {
        return clinic;
    }

    const cleanClinic = () => {
        setClinic({})
    }

    const handleChange = (event) => {
        const { name, value } = event.target;
        setClinic((prevClinic) => ({
            ...prevClinic,
            [name]: value,
        }));
    };

    const returnIfNotNullOrUndefined = (value) => {
        if (value === null || value === undefined) {
            return "";
        }
        return value;
    }

    useImperativeHandle(ref, () => ({
        getClinic,
        cleanClinic
    }));


    
    return (
        <>
            <Grid container spacing={0.5} className="d-flex justify-content-center" sx={{ width: "80%" }}>                
                <Grid item xs={12} md={6}>
                    <TextField
                        className="mb-2"
                        id="ClinicName-Input"
                        label="Clinic Name"
                        variant="outlined"
                        name="Name"
                        onChange={handleChange}
                        defaultValue={returnIfNotNullOrUndefined(clinic?.Name)}
                        fullWidth
                    />
                </Grid>
            </Grid>
        </>
    );
});
