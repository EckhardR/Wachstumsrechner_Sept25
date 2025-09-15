import React, { forwardRef, useEffect, useImperativeHandle, useState } from "react";
import { Divider, FormControl, Grid, InputLabel, MenuItem, Select, TextField, Typography } from "@mui/material";
import { useLocation } from "react-router-dom";
import { useReducer } from "react";
import { AutocompleteInput, optionWithoutDuplicates } from "../../utils/table/table-tools.js";
import { globalFetchDataV1, globalFetchDataV2 } from "../../services/services-tool.js";
import { API } from "../../services/Api.js";
import HandleAxiosError from "../../utils/handle-axios-error.js";
import Autocomplete from "@mui/material/Autocomplete/Autocomplete.js";
import { RiContactsBookLine } from "react-icons/ri/index.esm.js";

export const PatientForm = forwardRef((props: Props, ref) => {
    const location = useLocation();
    const [record, setRecord] = useState(location.state?.Station || []);
    const [fetchedData, setData] = useState(location.state?.Station || []);
    const [stationFetchedData, setStation] = useState(location.state?.Station || []);
    const [clinicFetchedData, setClinic] = useState(location.state?.Clinic || []);
    const [error, setError] = useState(null);
    const [patient, setPatient] = useState(
        location.state?.patient ? location.state?.patient : {}
    );
    const [updateState, forceUpdate] = useReducer((x) => x + 1, 0);
    const [isLoading, setIsLoading] = React.useState(false);
    const [isInputError, setInputError] = useState(false);

    useEffect(() => {
        globalFetchDataV2(
            clinicFetchedData,
            setClinic,
            API.ClinicV2.getAll,
            setIsLoading,
            null,
            setError,
            true,
        );
        globalFetchDataV2(
            stationFetchedData,
            setStation,
            API.StationV2.getAll,
            setIsLoading,
            setRecord,
            setError,
            true,
        );
        
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [updateState]);

    /**
     * Retrieves the patient data
     * @returns The patient data
     */
    const getPatient = () => {
        return patient;
    };

    /**
     * Forces a reload of the page
     */
    const setForceReload = () => {
        window.location.reload();
    };

    /**
     * Forces an update of the component
     */
    const setForceUpdate = () => {
        forceUpdate();
    };


    const cleanPatient = () => {
        setPatient({});
        forceUpdate();
        window.location.reload();
    };

    useImperativeHandle(ref, () => ({
        getPatient,
        setForceReload,
        setForceUpdate,
        cleanPatient,
    }));

    /**
     * Handles the change event for form fields
     * @param event - The change event
     */
    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        
        const targetName = event.target.name;
        const targetValue = event.target.value;
        console.log(targetName)
        if (targetValue > 44 && targetName === 'GestationalWeek') {
            setInputError(true);
        } else {
            setPatient((patient) => ({
                ...patient,
                [targetName]: targetValue,
            }));
            setInputError(false);
            // Handle the input value if needed
        }
    };


    const getRealDate = (date) => {
        if(!date || date === '') {
            return ''
        }
        return new Date(date).toISOString().split("T")[0]
    }

    /**
     * Returns the value if it's not null or undefined, otherwise returns an empty string
     * @param value - The value to check
     * @returns The value if not null or undefined, otherwise an empty string
     */
    const returnIfNotNullOrUndefined = (value?: string | number) => {
        return value !== null && value !== undefined ? value : "";
    };

    function getAllUniqueBedElements(array) {
        
        return Array.from(new Set(array.flatMap(obj => {
            if (obj.hasOwnProperty("BedArray")) {
                try {
                    const bedArray = JSON.parse(obj.BedArray);
                    if (Array.isArray(bedArray)) {
                        return bedArray;
                    }
                } catch (error) {
                    console.error("Error parsing BedArray:", error);
                }
            }
            return [];
        })));

    }
    function getClinic(id) {
        // Find the object with the specified ID in the array
        const foundObject = clinicFetchedData.find((obj) => obj.ID === id);
        // console.log('getClinicName', id, foundObject)
        // Return the name of the found object, or null if not found
        return foundObject ? foundObject : null;
    }
    function getStation(id) {
        // Find the object with the specified ID in the array
        const foundObject = stationFetchedData.find((obj) => obj.ID === id);
        // console.log('getStationName', id, foundObject)
        // Return the name of the found object, or null if not found
        return foundObject ? foundObject : null;
    }

    const getFilteredStations = (clinicID) => {
        const ele = stationFetchedData.filter((station) => station.ClinicID === clinicID)
        return ele ?? []
    }

    return (<>
        <HandleAxiosError error={error} />
        <Grid container spacing={.5} className="d-flex justify-content-center" sx={{ width: '80%' }}>
            <Grid item xs={6} md={3} lg={3}>
                <TextField
                    className="mb-2"
                    id="ID-Input"
                    label="ID (auto generated)"
                    variant="outlined"
                    name="ID"
                    disabled
                    onChange={handleChange}
                    defaultValue={returnIfNotNullOrUndefined(patient?.ID)}
                    fullWidth
                />
            </Grid>
            <Grid item xs={6} md={3} lg={3}>
                <Autocomplete
                    options={clinicFetchedData}
                    getOptionLabel={(option) => option.Name}
                    getOptionKey={(option => option.ID)}                    
                    value={getClinic(patient?.ClinicID) } // Set the default value based on the patient's ClinicID
                    onChange={(event, newValue) => {
                        if (newValue === null || newValue === undefined) {
                            setData(record);
                        } else {
                            const filteredStations = record.filter(
                                (station) => station.ClinicID === newValue.ID
                            );
                            setStation(filteredStations);
                            setPatient({
                                ...patient,
                                ClinicID: newValue ? newValue.ID : null,
                                StationID: null,
                                BedNr: null
                            });
                        }
                    }}
                    renderInput={(params) => (
                        <TextField {...params} label="Clinic Name" variant="outlined" fullWidth />
                    )}
                />
            </Grid>

            <Grid item xs={6} md={3} lg={3}>
                {
                <Autocomplete
                    options={getFilteredStations(patient?.ClinicID)}
                    getOptionLabel={(option) => option.Name}
                    value={!getClinic(patient?.ClinicID) ? null: getStation(patient?.StationID)} // Set the default value based on the patient's ClinicID
                    onChange={(event, newValue) => {
                        if (newValue === null || newValue === undefined) {
                            setData(record);
                        } else {
                            setData([newValue]);
                            setPatient({
                                ...patient,
                                StationID: newValue ? newValue.ID : null,                                
                                BedNr: null                               
                            });
                        }
                    }}
                    disabled={!getClinic(patient?.ClinicID)}
                    renderInput={(params) => (
                        <TextField {...params} label="Station Name" variant="outlined" fullWidth />
                    )}
                />
}
            </Grid>
            <Grid item xs={6} md={3} lg={3}>

                <Autocomplete
                    options={getAllUniqueBedElements(fetchedData)}
                    // getOptionLabel={(option) => option.BedNr}
                    value={returnIfNotNullOrUndefined(patient?.BedNr)} // Set the default value based on the patient's ClinicID
                    onChange={(event, newValue) => {
                        if (newValue === null || newValue === undefined) {
                            const item = clinicFetchedData.find(item => item.Name === newValue);
                            setPatient({
                                ...patient,
                                'BedNr': item ? item.BedArray : null,
                            });
                        } else {
                            setPatient({
                                ...patient,
                                'BedNr': newValue,
                            });
                        }
                    }}
                    disabled={!getStation(patient?.StationID)}
                    renderInput={(params) => (
                        <TextField {...params} label="Bed N°" variant="outlined" fullWidth />
                    )}
                />
                { /*  
                <AutocompleteInput
                    options={getAllUniqueBedElements(stationFetchedData)}
                    setInput={(newValue) => {
                        if (newValue === null || newValue === undefined) {
                            const item = clinicFetchedData.find(item => item.Name === newValue);
                            setPatient({
                                ...patient,
                                'BedNr': item ? item.BedArray : null,
                            });
                        } else
                            setPatient({
                                ...patient,
                                'BedNr': newValue,
                            });
                    }}
                    nameOfInput='BedNr'
                    labelName='Bed N°'
                    defaultValueAttribute={returnIfNotNullOrUndefined(patient?.BedNr)}
                    fullWidth
                />

                */ }

               

            </Grid>
            
            <Grid item xs={12} md={12} lg={12}>
                <Divider>
                    <Typography variant="h6" component="h6">
                        personal details
                    </Typography>
                </Divider>
            </Grid>
            <Grid item xs={6} md={6} lg={3}>
                <TextField
                    className="mb-2"
                    id="FirstName-Input"
                    label="First Name"
                    variant="outlined"
                    name="FirstName"
                    onChange={handleChange}
                    defaultValue={returnIfNotNullOrUndefined(patient?.FirstName)}
                    fullWidth
                />
            </Grid>
            <Grid item xs={6} md={6} lg={3}>
                <TextField
                    className="mb-2"
                    id="LastName-Input"
                    label="Last Name"
                    variant="outlined"
                    name="LastName"
                    onChange={handleChange}
                    defaultValue={returnIfNotNullOrUndefined(patient?.LastName)}
                    fullWidth
                />
            </Grid>
            <Grid item xs={6} md={6} lg={3}>
                <FormControl fullWidth>
                    <InputLabel id="gender-select-label">Gender</InputLabel>
                    <Select
                        labelId="gender-select-label"
                        id="demo-simple-select"
                        defaultValue={returnIfNotNullOrUndefined(patient?.Gender)}
                        label="Gender"
                        name="Gender"
                        fullWidth
                        onChange={handleChange}
                    >
                        <MenuItem value="female">Female</MenuItem>
                        <MenuItem value="male">Male</MenuItem>
                    </Select>
                </FormControl>
            </Grid>
            <Grid item xs={6} md={6} lg={3}>
                <TextField
                    className="mb-2"
                    id="Birthday-Input"
                    label="Birth Day"
                    variant="outlined"
                    type="date"
                    name="Birthday"
                    InputLabelProps={{
                        shrink: true,
                    }}
                    onChange={handleChange}
                    value={getRealDate(returnIfNotNullOrUndefined(patient?.Birthday))}                    
                    fullWidth
                />
            </Grid>
            <Grid item xs={12} md={12} lg={12}>
                <Divider>
                    <Typography variant="h6" component="h6">
                        Gestational age
                    </Typography>
                </Divider>
            </Grid>
            <Grid item xs={6} md={6} lg={6}>
                <TextField
                    className="mb-2"
                    id="GestationalWeek-Input"
                    label="Gestational Week"
                    variant="outlined"
                    name="GestationalWeek"
                    type="number"
                    onChange={handleChange}
                    defaultValue={returnIfNotNullOrUndefined(patient?.GestationalWeek)}
                    inputProps={{
                        min: 20,
                        max: 44,
                        step: 1
                    }}
                    fullWidth
                    error={isInputError}
                    helperText={isInputError ? "Gestational Week cannot be greater than 44" : ""}
                />
            </Grid>
            <Grid item xs={6} md={6} lg={6}>
                <FormControl className="mb-2" fullWidth>
                    <InputLabel id="GestationalDay-Label">Gestational Day <span className="text-danger">(if only completed week known)</span></InputLabel>
                    <Select
                        labelId="GestationalDay-Label"
                        id="GestationalDay-Input"
                        variant="outlined"
                        name="GestationalDay"
                        onChange={handleChange}
                        value={returnIfNotNullOrUndefined(patient?.GestationalDay)}
                        fullWidth
                    >
                        {Array.from({ length: 7 }).map((_, index) => (
                            <MenuItem key={index} value={index}>Day {index}</MenuItem>
                        ))}
                    </Select>
                </FormControl>

            </Grid>
            <Grid item xs={12} md={12} lg={12}>
                <Divider>
                    <Typography variant="h6" component="h6">
                        Anthropometry
                    </Typography>
                </Divider>
            </Grid>
            <Grid item xs={6} md={4} lg={4}>
                <TextField
                    className="mb-2"
                    id="BirthWeight-Input"
                    label="Birth Weight (g)"
                    variant="outlined"
                    name="BirthWeight"
                    helperText='Geburtsgewicht'
                    onChange={handleChange}
                    defaultValue={returnIfNotNullOrUndefined(patient?.BirthWeight)}
                    fullWidth
                />
            </Grid>
            <Grid item xs={6} md={4} lg={4}>
                <TextField
                    className="mb-2"
                    id="BirthLength-Input"
                    label="Birth Length (cm)"
                    variant="outlined"
                    name="BirthLength"
                    helperText='Geburtslänge'
                    onChange={handleChange}
                    defaultValue={returnIfNotNullOrUndefined(patient?.BirthLength)}
                    fullWidth
                />
            </Grid>
            <Grid item xs={6} md={4} lg={4}>
                <TextField
                    className="mb-2"
                    id="HeadCircumference-Input"
                    label="HeadCircumference (cm)"
                    variant="outlined"
                    name="HeadCircumference"
                    helperText="Geburtskopfumfang"
                    onChange={handleChange}
                    defaultValue={returnIfNotNullOrUndefined(patient?.HeadCircumference)}
                    fullWidth
                />
            </Grid>
            <Grid item xs={6} md={4} lg={4}>
                <TextField
                    className="mb-2"
                    id="FatMass-Input"
                    label="fat mass"
                    variant="outlined"
                    name="FatMass"
                    helperText='Fettmasse'
                    onChange={handleChange}
                    defaultValue={returnIfNotNullOrUndefined(patient?.FatMass)}
                    fullWidth
                />
            </Grid>
            <Grid item xs={6} md={4} lg={4}>
                <TextField
                    className="mb-2"
                    id="FatFreeMass-Input"
                    label="fat-free mass"
                    variant="outlined"
                    name="FatFreeMass"
                    helperText='Fettfreie Masse'
                    onChange={handleChange}
                    defaultValue={returnIfNotNullOrUndefined(patient?.FatFreeMass)}
                    fullWidth
                />
            </Grid>
        </Grid>
        <Grid container spacing={.5} sx={{ width: '80%' }}>
            <Grid item xs={12} md={12} lg={12}>
                <Divider>
                    <Typography variant="h6" component="h6">
                        Mother information
                    </Typography>
                </Divider>
            </Grid>
            <Grid item xs={6} md={6} lg={3}>
                <TextField
                    className="mb-2"
                    id="MotherAge-Input"
                    label="Mother Age"
                    variant="outlined"
                    name="MotherAge"
                    helperText='Alter'
                    onChange={handleChange}
                    defaultValue={returnIfNotNullOrUndefined(patient?.MotherAge)}
                    fullWidth
                />
            </Grid>
            <Grid item xs={6} md={6} lg={3}>
                <TextField
                    className="mb-2"
                    id="MotherHeight-Input"
                    label="Mother Height"
                    variant="outlined"
                    name="MotherHeight"
                    helperText='Körperhöhe'
                    onChange={handleChange}
                    defaultValue={returnIfNotNullOrUndefined(patient?.MotherHeight)}
                    fullWidth
                />
            </Grid>
            <Grid item xs={6} md={6} lg={3}>
                <TextField
                    className="mb-2"
                    id="MotherPrePregnancyWeight-Input"
                    label="Mother weight before pregnancy"
                    variant="outlined"
                    name="MotherPrePregnancyWeight"
                    helperText='Gewicht vor Schwangerschaft (kg)'
                    onChange={handleChange}
                    defaultValue={returnIfNotNullOrUndefined(patient?.MotherPrePregnancyWeight)}
                    fullWidth
                />
            </Grid>
            <Grid item xs={6} md={6} lg={3}>
                <TextField
                    className="mb-2"
                    id="MotherafterPregnancyWeight-Input"
                    label="Mother weight after pregnancy"
                    variant="outlined"
                    name="MotherafterPregnancyWeight"
                    helperText='Gewicht Ende der Schwangerschaft (kg)'
                    onChange={handleChange}
                    defaultValue={returnIfNotNullOrUndefined(patient?.MotherPrePregnancyWeight)}
                    fullWidth
                />
            </Grid>
            <Grid item xs={12} md={12} lg={12}>
                <Divider>
                    <Typography variant="h6" component="h6">
                        Father information
                    </Typography>
                </Divider>
            </Grid>
            <Grid item xs={6} md={4} lg={4}>
                <TextField
                    className="mb-2"
                    id="FatherAge-Input"
                    label="Father Age"
                    variant="outlined"
                    name="FatherAge"
                    onChange={handleChange}
                    defaultValue={returnIfNotNullOrUndefined(patient?.FatherAge)}
                    fullWidth
                />
            </Grid>
            <Grid item xs={6} md={4} lg={4}>
                <TextField
                    className="mb-2"
                    id="FatherWeight-Input"
                    label="Father Weight"
                    variant="outlined"
                    name="FatherWeight"
                    onChange={handleChange}
                    defaultValue={returnIfNotNullOrUndefined(patient?.FatherWeight)}
                    fullWidth
                />
            </Grid>
            <Grid item xs={6} md={4} lg={4}>
                <TextField
                    className="mb-2"
                    id="FatherHeight-Input"
                    label="Father Height"
                    variant="outlined"
                    name="FatherHeight"
                    onChange={handleChange}
                    defaultValue={returnIfNotNullOrUndefined(patient?.FatherHeight)}
                    fullWidth
                />
            </Grid>
        </Grid>
    </>
    );
});