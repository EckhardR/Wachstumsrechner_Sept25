import { Autocomplete, Button, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TextField } from '@mui/material';
import React, { useEffect, useReducer, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom';
import { API } from '../../../services/Api.js';
import { globalAutocompleteArray, globalFetchDataV2, globalHandleSearch } from '../../../services/services-tool.js';
import { DetailsIcon, EditIcon, newElemenetIcon, tasksIcon } from '../../../utils/global-icons.js';
import { CREATETASK, EDITTASK } from '../../../routes/Routes-Links.js';
import { GenericTableView } from '../../../utils/table/generic-table-view.js';
import HandleAxiosError from '../../../utils/handle-axios-error.js';
import { DetailsDesign } from '../../../utils/table/details-design.js';
import { BackgroundFourth } from '../../../utils/global-variables.js';
import { formatDate } from '../../../utils/table/table-tools.js';
import { useGlobalTranslation } from '../../../services/TranslationProvider.js';

export const TaskDetails = (row) => {
    const { t } = useGlobalTranslation();
    const bgColor = BackgroundFourth;

    if (row.Type !== 'todo') {
        return (
            <></>
        )
    } else {
       
        return (
            <div className='d-flex justify-content-center row '>
                <TableContainer sx={{ p: 0, m: 0 }}>
                    <Table size='small' aria-label='Patient Details'>
                        <TableHead sx={{ backgroundColor: bgColor }}>
                            <TableRow>
                                <TableCell>{t("Title")}</TableCell>
                                <TableCell>{t("Day_Of_Life")}</TableCell>
                                <TableCell>{t("Art")}</TableCell>
                                <TableCell>{t("Bed")}</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            <TableRow>
                                <TableCell>{row.Title}</TableCell>
                                <TableCell>{row.DayOfLife}</TableCell>
                                <TableCell>{row.art}</TableCell>
                                <TableCell>{row.BedNr}</TableCell>
                            </TableRow>
                        </TableBody>
                    </Table>
                </TableContainer>
                <TableContainer sx={{ p: 0, m: 0 }}>
                    <Table size='small' aria-label='Patient Details'>
                        <TableHead sx={{ backgroundColor: bgColor }}>
                            <TableRow>
                                <TableCell>{t("Lower_Birth_Weight")}</TableCell>
                                <TableCell>{t("Upper_Birth_Weight")}</TableCell>
                                <TableCell>{t("LowerWeekLimit")}</TableCell>
                                <TableCell>{t("UpperWeekLimit")}</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            <TableRow>
                                <TableCell>{row.LowerBirthWeight}</TableCell>
                                <TableCell>{row.UpperBirthWeight}</TableCell>
                                <TableCell>{row.LowerWeekLimit}</TableCell>
                                <TableCell>{row.UpperWeekLimit}</TableCell>
                            </TableRow>
                        </TableBody>
                    </Table>
                </TableContainer>
                <TableContainer sx={{ p: 0, m: 0 }}>
                    <Table size='small' aria-label='Patient Details'>
                        <TableHead sx={{ backgroundColor: bgColor }}>
                            <TableRow>
                                <TableCell>{t("recurringTaskFrequency")}</TableCell>
                                <TableCell>{t("recurringTaskStartDay")}</TableCell>
                                <TableCell>{t("Task_Postmenstrual_Frequency")}</TableCell>
                                <TableCell>{t("Task_Start_Postmenstrual_Age")}</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            <TableRow>
                                <TableCell>{row.recurringTaskFrequency}</TableCell>
                                <TableCell>{row.recurringTaskStartDay}</TableCell>
                                <TableCell>{row.taskPostmenstrualFrequency}</TableCell>
                                <TableCell>{row.TaskStartPostmenstrualAge}</TableCell>
                            </TableRow>
                        </TableBody>
                    </Table>
                </TableContainer>
                <TableContainer sx={{ p: 0, m: 0 }}>
                    <Table size='small' aria-label='Patient Details'>
                        <TableHead sx={{ backgroundColor: bgColor }}>
                            <TableRow>
                                <TableCell>{t("Task_Description")}</TableCell>
                                <TableCell>{t("Created_By")}</TableCell>
                                <TableCell>{t("Created_At")}</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            <TableRow>
                                <TableCell style={{ whiteSpace: 'pre-line' }}>{row.Description}</TableCell>
                                <TableCell>{row.CreatedBy}</TableCell>
                                <TableCell>{formatDate(row.CreatedAt)}</TableCell>
                            </TableRow>
                        </TableBody>
                    </Table>
                </TableContainer>
            </div>
        );
    }
};
export default function TaskView() {
    const location = useLocation();

    const [tasks, setTasksRecord] = useState(location?.state?.Tasks || []);
    const [indvTasks, setIndvTasksRecord] = useState(location?.state?.Tasks || []);
    const [data, setData] = useState(location?.state?.Tasks || []);
    const [indivData, setIndivData] = useState(location?.state?.Tasks || []);
    const [error, setError] = useState([]);
    const [isLoading, setIsLoading] = useState(false); // true
    const [updateState, forceUpdate] = useReducer((x) => x + 1, 0);
    const navigate = useNavigate();

    console.log("Data", tasks, data)


    useEffect(() => {
        globalFetchDataV2(tasks, setTasksRecord, API.Tasks.getAllTasks, setIsLoading, setData, setError, true);
        globalFetchDataV2(indvTasks, setIndvTasksRecord, API.Tasks.getAllIndvTasks, setIsLoading, setIndivData, setError, true);
    }, [updateState, location]);

    function getClinicName(id) {
        // Find the object with the specified ID in the array
        const foundObject = tasks.find((obj) => obj.ClinicID === id);

        // Return the name of the found object, or null if not found
        return foundObject ? foundObject.Name : null;
    }

    function tableHeader() {
        return (
            <>
                <TableCell key={"Title"} align={"center"} padding={"normal"}>
                    <Autocomplete
                        id="Title-demo"
                        options={globalAutocompleteArray(tasks, "Title")}
                        renderInput={(params) => (
                            <TextField
                                {...params}
                                label={"Task Title"}
                                InputProps={{
                                    ...params.InputProps,
                                }}
                                InputLabelProps={{
                                    shrink: true,
                                }}
                            />
                        )}
                        onChange={(event, newValue) => {
                            if (newValue === null || newValue === undefined)
                                setData(tasks);
                            else
                                globalHandleSearch(setData, tasks, "Title", newValue);
                        }}
                    />
                </TableCell>
                <TableCell key={"art"} align={"center"} padding={"normal"}> <Autocomplete
                    id="art-demo"
                    options={globalAutocompleteArray(tasks, "art")}
                    renderInput={(params) => (
                        <TextField
                            {...params}
                            label={"Task Art"}
                            InputProps={{
                                ...params.InputProps,
                            }}
                            InputLabelProps={{
                                shrink: true,
                            }}
                        />
                    )}
                    onChange={(event, newValue) => {
                        if (newValue === null || newValue === undefined)
                            setData(tasks);
                        else
                            globalHandleSearch(setData, setData, "art", newValue);
                    }}
                />

                </TableCell>
                <TableCell key={"DayOfLife"} align={"center"} padding={"normal"}> <Autocomplete
                    id="DayOfLife-demo"
                    options={globalAutocompleteArray(tasks, "DayOfLife").sort()}
                    getOptionLabel={option => option.toString()}
                    renderInput={(params) => (
                        <TextField
                            {...params}
                            label={"Day Of Life"}
                            InputProps={{
                                ...params.InputProps,
                            }}
                            InputLabelProps={{
                                shrink: true,
                            }}
                        />
                    )}
                    onChange={(event, newValue) => {
                        if (newValue === null || newValue === undefined)
                            setData(tasks);
                        else
                            globalHandleSearch(setData, tasks, "DayOfLife", newValue);
                    }}
                />

                </TableCell>
                <TableCell key={"Details"} align={"center"} padding={"normal"}>
                    Details
                </TableCell>
                <TableCell key={"Edit"} align={"center"} padding={"normal"}>
                    Edit
                </TableCell>
            </>
        );
    }

    function bodyMapper(data) {
        return data.map((row, index) => {
            
            console.log(indvTasks)
            return (
                <TableRow hover role="checkbox" tabIndex={-1} key={index}>
                    <TableCell align="center" padding={"none"}>{row.Title}</TableCell>
                    <TableCell align="center" padding={"none"}>{row.art}</TableCell>
                    <TableCell align="center" padding={"none"}>{row.DayOfLife}</TableCell>
                    <TableCell align="center" padding={"none"}>
                        <DetailsDesign
                            Title={`Task Details ${row?.Title}`}
                            children={TaskDetails(row)}
                            icon={DetailsIcon}
                            ID={row.ID}
                        />
                    </TableCell>
                    <TableCell align="center" padding={"none"}>
                        <Button variant='outlined' onClick={() => navigate(EDITTASK, { state: { Task: row, editingsmode: true } })}>
                            {EditIcon}
                        </Button>
                    </TableCell>
                </TableRow>
            );
        });
    }

    return (
        <>
            <HandleAxiosError error={error} />
            <GenericTableView
                tableTitle={<>Todo-List Task <span sx={{ marginLeft: '20px' }}>{tasksIcon}</span></>}
                elementCount={data?.length}
                createLink={CREATETASK}
                createText={<>Create New Task {newElemenetIcon}</>}
                header={tableHeader}
                body={data}
                bodyMapper={bodyMapper}
                isLoading={false} // isLoading
                footerText='Station per page'
            />
        </>
    );
}