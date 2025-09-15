
import { Autocomplete, FormGroup, Grid, TableBody, TableCell, TableContainer, TableHead, TableRow, TextField } from "@mui/material";
import { Table } from "react-bootstrap";
import { formatDate } from "../../../utils/table/table-tools.js";
import { BackgroundFourth } from "../../../utils/global-variables.js";


// const createTask = (row, handleChange) => {
//     if(row.Type === 'todo') {
//         return createTodoTask(row, handleChange)
//     } else  if(row.Type === 'individual') {
//         return createSimpleTask(row, handleChange)
//     } else {
//         return <><p>no task</p></>
//     }    
// }

export const createSimpleTask  = (row, handleChange) => {

    // let row = {...data}

    // if(data.Type !== 'individual') {
    //     row.Type = 'individial';
    //     row.Title =  '';
    //     row.Description ='';
    //     row.date = '2025-02-06 00:00:00';
    //     console.log("DATAAAAAA: row", row)

    // }
        
    return (
        <div className='d-flex justify-content-center row '>
            <FormGroup sx={{ p: 2 }}>
                <Grid container spacing={2}>
                    <Grid item xs={12} md={6} lg={6}>
                        <TextField
                            className="mb-2"
                            id="Title-Input"
                            label="Task Titel"
                            variant="outlined"
                            name="Title"
                            // defaultValue={row.Title}
                            onChange={(e) => handleChange(e.target.name, e.target.value)}
                            InputLabelProps={{
                                shrink: true,
                            }}
                            required
                            fullWidth
                        />
                    </Grid>

                    <Grid item xs={12} md={6} lg={6}>
                        
                        <TextField
                            id="taskDate-Input"
                            className="mb-2"
                            variant="outlined"
                            name="date"
                            type="date"
                            // defaultValue={row.date}
                            onChange={(e) => handleChange(e.target.name, formatDate(e.target.value))}
                            sx={{ padding: 0, margin: 0 }}
                            InputLabelProps={{
                                shrink: true,
                            }}
                            required
                            fullWidth
                        />
                    </Grid>

                    <Grid item xs={12}>
                        <TextField
                            className="mb-2"
                            id="Description-Input"
                            label="Task Description"
                            variant="outlined"
                            name="Description"
                            // defaultValue={row.Description}
                            onChange={(e) => handleChange(e.target.name, e.target.value)}
                            InputLabelProps={{
                                shrink: true,
                            }}
                            required
                            fullWidth
                        />
                       
                    </Grid>
                </Grid>
            </FormGroup>
        </div>
    );
}

export const createTodoTask = (row, handleChange) => {
    const bgColor = BackgroundFourth;
    const TasksOptions = ["Routine BE", "Routine Sono", "Routine Infusionslösung", "Routine Impfung",
        "Routine Augenarzt", "Routine Medikamente",
        "Aufnahmecheck", "Küster", "G. Fusch",
        "Apgar Studie", "Sepsisstudie", "Lübeckstudie", "Anlegen Aufgabe"]

        /*

        console.log("****** START");
        console.log('Title: ', row.Title)
        console.log('DayOfLife: ', row.DayOfLife)   
        console.log('LowerBirthWeight: ', row.LowerBirthWeight)
        console.log('UpperBirthWeight: ', row.UpperBirthWeight)
        console.log('LowerWeekLimit: ', row.LowerWeekLimit)
        console.log('UpperWeekLimit: ', row.UpperWeekLimit);
        console.log('recurringTaskFrequency: ', row.recurringTaskFrequency)
        console.log('recurringTaskStartDay: ', row.recurringTaskStartDay)
        console.log('taskPostmenstrualFrequency', row.taskPostmenstrualFrequency)
        console.log('TaskStartPostmenstrualAge', row.TaskStartPostmenstrualAge)
        console.log('Description', row.Description)
        console.log("****** END");

        */

    return (
        <div className='d-flex justify-content-center row '>
            <TableContainer sx={{ p: 0, m: 0 }}>
                <Table size='small' aria-label='Patient Details'>
                    <TableHead sx={{ backgroundColor: bgColor }}>
                        <TableRow>
                            <TableCell>Title</TableCell>
                            <TableCell>Day Of Life</TableCell>
                            <TableCell>Art</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        <TableRow>
                            <TableCell>
                                <TextField
                                    className="mb-2"
                                    id="Title-Input"
                                    variant="outlined"
                                    name="Title"
                                    onChange={(e) => handleChange(e.target.name, e.target.value, row)}
                                    defaultValue={row.Title}
                                    InputLabelProps={{
                                        shrink: true,
                                    }}
                                    required
                                    fullWidth
                                /></TableCell>
                            <TableCell>
                                <TextField
                                    className="mb-2"
                                    id="DayOfLife-Input"
                                    variant="outlined"
                                    name="DayOfLife"
                                    onChange={(e) => handleChange(e.target.name, e.target.value, row)}
                                    defaultValue={row.DayOfLife}
                                    InputLabelProps={{
                                        shrink: true,
                                    }}
                                    type="number"
                                    required
                                    fullWidth
                                /></TableCell>
                            <TableCell>
                                <Autocomplete
                                    options={TasksOptions}
                                    variant="outlined"
                                    name="art"
                                    size="small"
                                    inputValue={row?.art || ''}
                                    onInputChange={(event, newValue) => {
                                        handleChange("art", newValue, row)
                                    }}
                                    fullWidth
                                    renderInput={(params) => (
                                        <TextField {...params} variant="outlined" fullWidth
                                            InputLabelProps={{
                                                shrink: true,
                                            }}
                                            required
                                        />
                                    )}
                                    disabled
                                    freeSolo
                                />
                            </TableCell>
                        </TableRow>
                    </TableBody>
                </Table>
            </TableContainer>
            <TableContainer sx={{ p: 0, m: 0 }}>
                <Table size='small' aria-label='Patient Details'>
                    <TableHead sx={{ backgroundColor: bgColor }}>
                        <TableRow>
                            <TableCell>Lower Birth Weight</TableCell>
                            <TableCell>Upper Birth Weight</TableCell>
                            <TableCell>LowerWeekLimit</TableCell>
                            <TableCell>UpperWeekLimit</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        <TableRow>
                            <TableCell>
                                <TextField
                                    className="mb-2"
                                    id="LowerBirthWeight-Input"
                                    variant="outlined"
                                    name="LowerBirthWeight"
                                    onChange={(e) => handleChange(e.target.name, e.target.value, row)}
                                    defaultValue={row.LowerBirthWeight}
                                    InputLabelProps={{
                                        shrink: true,
                                    }}
                                    type="number"
                                    required
                                    fullWidth
                                /></TableCell>
                            <TableCell>
                                <TextField
                                    className="mb-2"
                                    id="UpperBirthWeight-Input"
                                    variant="outlined"
                                    name="UpperBirthWeight"
                                    onChange={(e) => handleChange(e.target.name, e.target.value, row)}
                                    defaultValue={row.UpperBirthWeight}
                                    InputLabelProps={{
                                        shrink: true,
                                    }}
                                    type="number"
                                    required
                                    fullWidth
                                /></TableCell>
                            <TableCell>
                                <TextField
                                    className="mb-2"
                                    id="LowerWeekLimit-Input"
                                    variant="outlined"
                                    name="LowerWeekLimit"
                                    onChange={(e) => handleChange(e.target.name, e.target.value, row)}
                                    defaultValue={row.LowerWeekLimit}
                                    InputLabelProps={{
                                        shrink: true,
                                    }}
                                    type="number"
                                    required
                                    fullWidth
                                /></TableCell>
                            <TableCell>
                                <TextField
                                    className="mb-2"
                                    id="UpperWeekLimit-Input"
                                    variant="outlined"
                                    name="UpperWeekLimit"
                                    onChange={(e) => handleChange(e.target.name, e.target.value, row)}
                                    defaultValue={row.UpperWeekLimit}
                                    InputLabelProps={{
                                        shrink: true,
                                    }}
                                    type="number"
                                    required
                                    fullWidth
                                /></TableCell>
                        </TableRow>
                    </TableBody>
                </Table>
            </TableContainer>
            <TableContainer sx={{ p: 0, m: 0 }}>
                <Table size='small' aria-label='Patient Details'>
                    <TableHead sx={{ backgroundColor: bgColor }}>
                        <TableRow>
                            <TableCell>recurringTaskFrequency</TableCell>
                            <TableCell>recurringTaskStartDay</TableCell>
                            <TableCell>Task Postmenstrual Frequency</TableCell>
                            <TableCell>Task Start Postmenstrual Age</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        <TableRow>
                            <TableCell>
                                <TextField
                                    className="mb-2"
                                    id="recurringTaskFrequency-Input"
                                    variant="outlined"
                                    name="recurringTaskFrequency"
                                    onChange={(e) => handleChange(e.target.name, e.target.value, row)}
                                    defaultValue={row.recurringTaskFrequency}
                                    InputLabelProps={{
                                        shrink: true,
                                    }}
                                    type="number"
                                    required
                                    fullWidth
                                /></TableCell>
                            <TableCell>
                                <TextField
                                    className="mb-2"
                                    id="recurringTaskStartDay-Input"
                                    variant="outlined"
                                    name="recurringTaskStartDay"
                                    onChange={(e) => handleChange(e.target.name, e.target.value, row)}
                                    defaultValue={row.recurringTaskStartDay}
                                    InputLabelProps={{
                                        shrink: true,
                                    }}
                                    type="number"
                                    required
                                    fullWidth
                                /></TableCell>
                            <TableCell>
                                <TextField
                                    className="mb-2"
                                    id="taskPostmenstrualFrequency-Input"
                                    variant="outlined"
                                    name="taskPostmenstrualFrequency"
                                    onChange={(e) => handleChange(e.target.name, e.target.value, row)}
                                    defaultValue={row.taskPostmenstrualFrequency}
                                    InputLabelProps={{
                                        shrink: true,
                                    }}
                                    type="number"
                                    required
                                    fullWidth
                                /></TableCell>
                            <TableCell>
                                <TextField
                                    className="mb-2"
                                    id="TaskStartPostmenstrualAge-Input"
                                    variant="outlined"
                                    name="TaskStartPostmenstrualAge"
                                    onChange={(e) => handleChange(e.target.name, e.target.value, row)}
                                    defaultValue={row.TaskStartPostmenstrualAge}
                                    InputLabelProps={{
                                        shrink: true,
                                    }}
                                    type="number"
                                    required
                                    fullWidth
                                /></TableCell>
                        </TableRow>
                    </TableBody>
                </Table>
            </TableContainer>
            <TableContainer sx={{ p: 0, m: 0 }}>
                <Table size='small' aria-label='Patient Details'>
                    <TableHead sx={{ backgroundColor: bgColor }}>
                        <TableRow>
                            <TableCell>Task Description</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        <TableRow>
                            <TextField
                                className="mb-2"
                                id="Description-Input"
                                variant="outlined"
                                name="Description"
                                onChange={(e) => handleChange(e.target.name, e.target.value, row)}
                                defaultValue={row.Description}
                                InputLabelProps={{
                                    shrink: true,
                                }}
                                required
                                fullWidth
                            />
                        </TableRow>
                    </TableBody>
                </Table>
            </TableContainer>
        </div>
    );
};
