import React, { forwardRef, useImperativeHandle, useState } from "react";
import { useLocation } from "react-router-dom";

import { Autocomplete, FormGroup, Grid, TextField } from "@mui/material";

export const TaskForm = forwardRef((props: Props, ref) => {
    const location = useLocation();
    const [Task, setTask] = useState(location.state?.Task || []);
    const TasksOptions = ["Routine BE", "Routine Sono", "Routine Infusionslösung", "Routine Impfung",
        "Routine Augenarzt", "Routine Medikamente",
        "Aufnahmecheck", "Küster", "G. Fusch",
        "Apgar Studie", "Sepsisstudie", "Lübeckstudie", "Anlegen Aufgabe"]


    useImperativeHandle(ref, () => ({
        getTask() {
            return Task;
        },
        setForceReload() {
            window.location.reload();
        },
    }));


    const handleChange = (event) => {
        const targetName = event.target.name;
        const targetValue = event.target.value;
        setTask((task) => ({
            ...task,
            [targetName]: targetValue,
        }));
    };


    return (
        <>
            <FormGroup sx={{ p: 2 }}>
                <Grid container spacing={2}>
                    <Grid item xs={12} md={6} lg={6}>
                        <TextField
                            className="mb-2"
                            id="Title-Input"
                            label="Task Titel"
                            variant="outlined"
                            name="Title"
                            onChange={handleChange}
                            defaultValue={Task?.Title}
                            InputLabelProps={{
                                shrink: true,
                            }}
                            required
                            fullWidth
                        />
                    </Grid>
                    <Grid item xs={12} md={6} lg={6}>
                        <Autocomplete
                            options={TasksOptions}
                            variant="outlined"
                            name="art"
                            inputValue={Task?.art || ''}
                            onInputChange={(event, newValue) => {
                                setTask((task) => ({
                                    ...task,
                                    "art": newValue,
                                }));
                            }}
                            label="Task Art"
                            fullWidth
                            renderInput={(params) => (
                                <TextField {...params} label="Task Art" variant="outlined" fullWidth
                                    InputLabelProps={{
                                        shrink: true,
                                    }}
                                    required
                                />
                            )}
                            freeSolo
                        />

                    </Grid>
                    <Grid item xs={12} md={12} lg={12}>
                        <TextField
                            className="mb-2"
                            id="Description-Input"
                            label="Task Description"
                            variant="outlined"
                            name="Description"
                            onChange={handleChange}
                            defaultValue={Task?.Description}
                            InputLabelProps={{
                                shrink: true,
                            }}
                            multiline
                            minRows={2}
                            required
                            fullWidth
                        />
                    </Grid>
                    <Grid item xs={6} md={4} lg={4}>
                        <TextField
                            className="mb-2"
                            id="DayOfLife-Input"
                            label="Day Of Life (Lt)"
                            variant="outlined"
                            name="DayOfLife"
                            onChange={handleChange}
                            InputLabelProps={{
                                shrink: true,
                            }}
                            defaultValue={Task?.DayOfLife || 0}
                            fullWidth
                        />
                    </Grid>
                    <Grid item xs={6} md={4} lg={4}>
                        <TextField
                            className="mb-2"
                            id="LowerWeekLimit-Input"
                            label="Lower Pregnancy/Gestational Age Limit (uGA)"
                            variant="outlined"
                            name="LowerWeekLimit"
                            onChange={handleChange}
                            InputLabelProps={{
                                shrink: true,
                            }}
                            helperText="Lower limit for week of pregnancy / gestational age at birth"
                            defaultValue={Task?.LowerWeekLimit || 0}
                            fullWidth
                        />
                    </Grid>
                    <Grid item xs={6} md={4} lg={4}>
                        <TextField
                            className="mb-2"
                            id="UpperWeekLimit-Input"
                            label="Upper Pregnancy/Gestational Age Limit (oGA)"
                            helperText="Upper limit for week of pregnancy / gestational age at birth"
                            variant="outlined"
                            name="UpperWeekLimit"
                            InputLabelProps={{
                                shrink: true,
                            }}
                            onChange={handleChange}
                            defaultValue={Task?.UpperWeekLimit || 0}
                            fullWidth
                        />
                    </Grid>
                    <Grid item xs={6} md={4} lg={4}>
                        <TextField
                            className="mb-2"
                            id="LowerBirthWeight-Input"
                            label="Lower Birth Weight Limit (uG)"
                            helperText="Lower limit birth weight"
                            variant="outlined"
                            name="LowerBirthWeight"
                            InputLabelProps={{
                                shrink: true,
                            }}
                            onChange={handleChange}
                            defaultValue={Task?.LowerBirthWeight || 0}
                            fullWidth
                        />
                    </Grid>
                    <Grid item xs={6} md={4} lg={4}>
                        <TextField
                            className="mb-2"
                            id="UpperBirthWeight-Input"
                            label="Upper Birth Weight Limit (oG)"
                            helperText="Upper limit birth weight"
                            variant="outlined"
                            name="UpperBirthWeight"
                            InputLabelProps={{
                                shrink: true,
                            }}
                            onChange={handleChange}
                            defaultValue={Task?.UpperBirthWeight || 0}
                            fullWidth
                        />
                    </Grid>
                    <Grid item xs={6} md={4} lg={4}>
                        <TextField
                            className="mb-2"
                            id="recurringTaskFrequency-Input"
                            label="Recurring Task Frequency (alleTg)"
                            helperText="Recurring task that repeats every X days"
                            variant="outlined"
                            name="recurringTaskFrequency"
                            InputLabelProps={{
                                shrink: true,
                            }}
                            onChange={handleChange}
                            defaultValue={Task?.recurringTaskFrequency || 0}
                            fullWidth
                        />
                    </Grid>
                    <Grid item xs={6} md={4} lg={4}>
                        <TextField
                            className="mb-2"
                            id="recurringTaskStartDay-Input"
                            label="Recurring Task Start Day (abLt)"
                            helperText="From which day of life it should be started"
                            variant="outlined"
                            name="recurringTaskStartDay"
                            InputLabelProps={{
                                shrink: true,
                            }}
                            onChange={handleChange}
                            defaultValue={Task?.recurringTaskStartDay || 0}
                            fullWidth
                        />
                    </Grid>
                    <Grid item xs={6} md={4} lg={4}>
                        <TextField
                            className="mb-2"
                            id="taskPostmenstrualFrequency-Input"
                            label="Task Postmenstrual Start Frequency (abPMA)"
                            helperText="At what postmenstrual age it should be started"
                            variant="outlined"
                            name="taskPostmenstrualFrequency"
                            InputLabelProps={{
                                shrink: true,
                            }}
                            onChange={handleChange}
                            defaultValue={Task?.taskPostmenstrualFrequency || 0}
                            fullWidth
                        />
                    </Grid>
                    <Grid item xs={6} md={4} lg={4}>
                        <TextField
                            className="mb-2"
                            id="TaskStartPostmenstrualAge-Input"
                            label="Task Postmenstrual Age (PMA)"
                            helperText="Task from which postmenstrual age"
                            variant="outlined"
                            name="TaskStartPostmenstrualAge"
                            InputLabelProps={{
                                shrink: true,
                            }}
                            onChange={handleChange}
                            defaultValue={Task?.TaskStartPostmenstrualAge || 0}
                            fullWidth
                        />
                    </Grid>
                </Grid>
            </FormGroup>
            {props.children ? props.children : null}
        </>
    );
});