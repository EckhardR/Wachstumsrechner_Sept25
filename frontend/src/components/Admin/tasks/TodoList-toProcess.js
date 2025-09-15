import { useEffect, useReducer, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Autocomplete, Button, ButtonGroup, Grid, TableCell, TableRow, TextField } from "@mui/material";
import { DateNavigationButton, returnIfNotNullOrUndefined } from "../../../utils/table/table-tools.js";
import { API } from "../../../services/Api.js";
import { CustomSnackbar, DialogConfirmation } from "../../../utils/dialog-notifications.js";
import HandleAxiosError from "../../../utils/handle-axios-error.js";
import { BackgroundFourth, BackgroundThird } from "../../../utils/global-variables.js";
import { GenericTableView } from "../../../utils/table/generic-table-view.js";
import { DetailsIcon, DoneIcon, OffenIcon, StationIcon, bedIcon, tasksIcon } from "../../../utils/global-icons.js";
import { TaskDetails } from "./task-view.js";
import { DetailsDesign } from "../../../utils/table/details-design.js";
import { patientDetails } from "../../patient/patient-view.js";
import { FcTodoList } from "react-icons/fc/index.esm.js";
import { ADMINSCREEN } from "../../../routes/Routes-Links.js";
import { globalAutocompleteArray, globalHandleSearch } from "../../../services/services-tool.js";
import { useTranslation } from "react-i18next";

const isBetweenBirthWeight = (patient, lowerValue, upperValue) => {
    if (patient.BirthWeight >= lowerValue && patient.BirthWeight <= upperValue) {
        return true;
    } else {
        return false;
    }
}

const isBetweenGestationsalter = (patient, lowerValue, upperValue) => {
    // Calculate the total gestational age in days
    const gestationalAgeInDays = patient.GestationalWeek * 7 + patient.GestationalDay;

    // Check if the gestational age is within the specified range
    return gestationalAgeInDays >= lowerValue && gestationalAgeInDays <= upperValue;
};

const needToBeRepeated = (patient, frequencTime, startDay) => {
    // Calculate the current age
    const currentAge = getCurrentAge(patient);

    // Convert the current age to days
    const currentAgeDays = currentAge.weeks * 7 + currentAge.days;

    // Calculate the number of days since the start day
    const startDayDate = new Date(startDay);
    const currentDate = new Date();
    const timeDifference = currentDate - startDayDate;
    const daysSinceStartDay = Math.floor(timeDifference / (1000 * 60 * 60 * 24));

    // Check if the current age has reached the frequency time
    if (currentAgeDays >= frequencTime && daysSinceStartDay >= frequencTime) {
        return true;
    } else {
        return false;
    }
}

const getCurrentAge = (patient) => {
    // Parse the birthday string into a Date object
    const birthDate = new Date(patient.Birthday);

    // Calculate the age in days
    const currentDate = new Date();
    const timeDifference = currentDate - birthDate;
    const ageDays = Math.floor(timeDifference / (1000 * 60 * 60 * 24));

    // Convert the age to weeks and days
    const ageWeeks = Math.floor(ageDays / 7);
    const ageDaysRemainder = ageDays % 7;

    return {
        weeks: ageWeeks,
        days: ageDaysRemainder
    };
}

const getPostmenstrualAge = (patient) => {
    // Parse the birthday string into a Date object
    const birthDate = new Date(patient.Birthday);

    // Calculate the chronological age in days
    const currentDate = new Date();
    const timeDifference = currentDate - birthDate;
    const chronologicalAgeDays = Math.floor(timeDifference / (1000 * 60 * 60 * 24));

    // Calculate the gestational age in days
    const gestationalAgeDays = patient.GestationalWeek * 7 + patient.GestationalDay;

    // Calculate the postmenstrual age in days
    const postmenstrualAgeDays = chronologicalAgeDays + gestationalAgeDays;

    // Convert the postmenstrual age to weeks and days
    const postmenstrualAgeWeeks = Math.floor(postmenstrualAgeDays / 7);
    const postmenstrualAgeDaysRemainder = postmenstrualAgeDays % 7;

    return {
        weeks: postmenstrualAgeWeeks,
        days: postmenstrualAgeDaysRemainder
    };
}

const needToBeRepeatedPostmenstruellen = (patient, PostmenstruellenFrequencTime, PostmenstruellenStartDay) => {
    // Calculate the current age and postmenstrual age
    const currentAge = getCurrentAge(patient);
    const postmenstrualAge = getPostmenstrualAge(patient);

    // Calculate the number of weeks since the start day
    const startDayDate = new Date(PostmenstruellenStartDay);
    const currentDate = new Date();
    const timeDifference = currentDate - startDayDate;
    const weeksSinceStartDay = Math.floor(timeDifference / (1000 * 60 * 60 * 24 * 7));

    // Check if the current age or postmenstrual age has reached the frequency time
    if (currentAge.weeks >= PostmenstruellenFrequencTime && weeksSinceStartDay >= PostmenstruellenFrequencTime) {
        return true;
    } else if (postmenstrualAge.weeks >= PostmenstruellenFrequencTime && weeksSinceStartDay >= PostmenstruellenFrequencTime) {
        return true;
    } else {
        return false;
    }
}

const weNeedToProcessIt = (patient, task) => {
    // Extract relevant task parameters
    const {
        LowerWeekLimit,
        UpperWeekLimit,
        LowerBirthWeight,
        UpperBirthWeight,
        recurringTaskFrequency,
        recurringTaskStartDay,
        taskPostmenstrualFrequency,
        TaskStartPostmenstrualAge
    } = task;

    // Check if any of the conditions are true
    if (isBetweenGestationsalter(patient, LowerWeekLimit, UpperWeekLimit)) {
        return { "needToBeProcessed": true, "cause": `The patient's gestational age is between ${LowerWeekLimit} and ${UpperWeekLimit} weeks.` };
    }

    if (isBetweenBirthWeight(patient, LowerBirthWeight, UpperBirthWeight)) {
        return { "needToBeProcessed": true, "cause": `The patient's birth weight is between ${LowerBirthWeight} and ${UpperBirthWeight} grams.` };
    }

    if (needToBeRepeated(patient, recurringTaskFrequency, recurringTaskStartDay)) {
        return { "needToBeProcessed": true, "cause": `It's time for a recurring task based on current age.` };
    }

    if (needToBeRepeatedPostmenstruellen(patient, taskPostmenstrualFrequency, TaskStartPostmenstrualAge)) {
        return { "needToBeProcessed": true, "cause": `It's time for a recurring task based on postmenstrual age.` };
    }

    // If none of the conditions are true, return a default message
    return { "needToBeProcessed": false, "cause": "No matching conditions found for the patient." };
}


export default function TodoListToProcess() {
    const { t } = useTranslation();
    const [tasks, setTasks] = useState([]);
    const [records, setRecords] = useState([]);
    const [error, setError] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [updateState, forceUpdate] = useReducer((state) => state + 1, 0);
    const [openSnackbar, setSnackbar] = useState(false);
    const navigate = useNavigate();
    const [message, setMessage] = useState("Task done successfully");
    const location = useLocation();

    const fetchData = async () => {
        try {
            const response = await API.Tasks.getTodoListToProcess();
            console.log("responsess", response)
            setTasks(response.data);
            setRecords(response.data);
            setIsLoading(false);
        } catch (error) {
            setError(error.message);
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [updateState, location]);


    const handleSave = (row) => {
        API.Tasks.processTask(row)
            .then((result) => {
                if (result.status === 200) {
                    setSnackbar(true);
                    setMessage(`This Task ${row.Task.Title} for ${row.patientInfo?.FirstName},  ${row.patientInfo?.LastName} is done successfully`);
                }
            })

    }
    const TodoListToolBar = () => {
        const modalId = `OpenedTasksToolBar-table`;
        return (
            <Button onClick={() => navigate(ADMINSCREEN)} startIcon={OffenIcon} endIcon={tasksIcon}>
                Tasks
            </Button>
        );
    };
    const tableHeader = () => (
        <>
            <TableCell
                key="patientTitle"
                align="left"
                padding="none"
                width={'15%'}
                style={{ backgroundColor: BackgroundFourth }}
            >
                    <Autocomplete
                        id="Title-demo"
                        options={globalAutocompleteArray(records.map((record) => record.Task), "Title")}
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
                                setTasks(records);
                            else {
                                const filteredData = records?.filter((element) =>
                                    element.Task.Title = newValue
                                );
                                setTasks(filteredData);
                            }
                        }}
                    />
            </TableCell>
            <TableCell
                key="Patient"
                align="left"
                padding="none"
                style={{ backgroundColor: BackgroundFourth }}
            >
                Patient
            </TableCell>
            <TableCell
                key="TaskDetail"
                align="left"
                padding="none"
                style={{ backgroundColor: BackgroundFourth }}
            >
                Task Detail
            </TableCell>
            <TableCell
                key="PatientDetail"
                align="left"
                padding="none"
                style={{ backgroundColor: BackgroundFourth }}
            >
                Patient Detail
            </TableCell>
            <TableCell
                key="PatientDetail"
                align="left"
                padding="none"
                style={{ backgroundColor: BackgroundFourth }}
            >
                Reason
            </TableCell>
            <TableCell
                key="Done"
                align="left"
                padding="none"
                style={{ backgroundColor: BackgroundFourth }}
            >
                Done
            </TableCell>
        </>
    );

    const tableBody = (data) =>
        data.map((row, index) => {
            const labelId = `Tasks-table-div-${index}`;
            const checkIt = weNeedToProcessIt(row.patientInfo, row.Task);
            if (checkIt.needToBeProcessed)
                return (
                    <TableRow
                        role="div"
                        tabIndex={-1}
                        key={labelId}
                        sx={{ backgroundColor: BackgroundThird }}
                    >
                        <TableCell padding="none" align="left" sx={{ pl: 1 }}>
                            <span className="fw-bold" style={{ marginRight: '1vh' }}>
                                {returnIfNotNullOrUndefined(row.Task.Title)}
                            </span>
                        </TableCell>
                        <TableCell padding="none" align="left" sx={{ pl: 1 }}>
                            <span className="fw-bold" style={{ marginRight: '1vh' }}>
                                <span className="fw-bold" style={{ marginRight: '1vh' }}>
                                    {returnIfNotNullOrUndefined(row.patientInfo?.FirstName)}, {returnIfNotNullOrUndefined(row.patientInfo?.LastName)}
                                </span>
                                {bedIcon}
                                <span className="text-secondary" style={{ marginRight: '1vh', marginLeft: '1vh' }}>
                                    {returnIfNotNullOrUndefined(row.patientInfo?.BedNr)}
                                </span>
                                {StationIcon}
                                <span className="text-secondary">
                                    {returnIfNotNullOrUndefined(row.patientInfo?.StationID)}
                                </span>
                            </span>
                        </TableCell>
                        <TableCell padding="none" align="left" sx={{ pl: 1 }}>
                            <DetailsDesign
                                Title={`Task Details: ${row.Task?.Title}`}
                                children={TaskDetails(row.Task)}
                                icon={DetailsIcon}
                                ID={row.Task.ID}
                            />
                        </TableCell>
                        <TableCell padding="none" align="left" sx={{ pl: 1 }}>
                            <DetailsDesign
                                Title={`Patient Details N°: ${row.patientInfo?.PatientID}`}
                                children={patientDetails(row.patientInfo)}
                                icon={DetailsIcon}
                                ID={row.patientInfo.PatientID}
                            />
                        </TableCell>
                        <TableCell padding="none" align="left" sx={{ pl: 1 }}>
                            <span className="fw-bold" style={{ marginRight: '1vh' }}>
                                {returnIfNotNullOrUndefined(checkIt?.cause)}
                            </span>
                        </TableCell>
                        <TableCell padding="none" align="left" sx={{ pl: 1 }}>
                            <Button variant='outlined' color='success' onClick={() => handleSave(row)}>
                                {DoneIcon}
                            </Button>
                        </TableCell>
                    </TableRow>
                );
        });


    return (
        <>  <HandleAxiosError error={error} />
            <CustomSnackbar open={openSnackbar} autoHide={1500} message={message} handleClose={() => {
                setSnackbar(false);
                forceUpdate();
            }} severity={"success"} />
            <GenericTableView
                elementCount={tasks?.length}
                disabledLink
                tableTitle={<div className="d-flex flex-row">Open Todo-List <FcTodoList style={{ marginLeft: '10px' }} /></div>}
                header={tableHeader}
                body={tasks}
                toolbar={TodoListToolBar}
                bodyMapper={tableBody}
                isLoading={isLoading}
                size={'small'}
                footerText={'Tasks per page'}
                backgroundColor={BackgroundThird}
            />
        </>)
}