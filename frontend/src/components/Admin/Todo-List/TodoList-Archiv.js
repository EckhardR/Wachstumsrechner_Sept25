import { useEffect, useReducer, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  Autocomplete,
  Button,
  ButtonGroup,
  Grid,
  TableCell,
  TableRow,
  TextField,
} from "@mui/material";
import {
  DateNavigationButton,
  returnIfNotNullOrUndefined,
} from "../../../utils/table/table-tools.js";
import { API } from "../../../services/Api.js";
import {
  CustomSnackbar,
  DialogConfirmation,
} from "../../../utils/dialog-notifications.js";
import HandleAxiosError from "../../../utils/handle-axios-error.js";
import {
  BackgroundFourth,
  BackgroundThird,
} from "../../../utils/global-variables.js";
import { GenericTableView } from "../../../utils/table/generic-table-view.js";
import {
  DetailsIcon,
  DoneIcon,
  OffenIcon,
  RestIcon,
  tasksIcon,
} from "../../../utils/global-icons.js";
import { TaskDetails } from "../tasks/task-view.js";
import { DetailsDesign } from "../../../utils/table/details-design.js";
import { ADMINSCREEN } from "../../../routes/Routes-Links.js";
import {
  globalAutocompleteArray,
  globalHandleSearch,
} from "../../../services/services-tool.js";
import { useTranslation } from "react-i18next";

export default function TodoListToProcessArchiv({ patient, forceUpdate2 }) {
  const { t } = useTranslation();
  const [tasks, setTasks] = useState([]);
  const [records, setRecords] = useState([]);
  const [error, setError] = useState([]);
  const [openSnackbar, setSnackbar] = useState(false);
  const [message, setMessage] = useState("Task reset successfully");
  const [isLoading, setIsLoading] = useState(false);
  const [updateState, forceUpdate] = useReducer((state) => state + 1, 0);
  const navigate = useNavigate();
  const location = useLocation();

  const fetchData = async () => {
    try {
      if (patient?.ID !== undefined) {
        const response = await API.Tasks.getTodoListToProcessArchiv(
          patient?.ID
        );
        setTasks(response.data);
        setRecords(response.data);
        setIsLoading(false);
      }
    } catch (error) {
      setError(error.message);
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [updateState, location, patient]);

  const handleTaskRest = (task) => {
    if (task?.length === 0 || task == []) return null;
    else {
      API.Tasks.taskReset(task?.ID, patient?.ID).then((result) => {
        if (result.status === 200) {
          setSnackbar(true);
          setMessage(`This Task is Rest successfully`);
          forceUpdate();
          forceUpdate2();
        }
      });
    }
  };

  const TodoListToolBar = () => {
    return (
      <Button
        onClick={() => navigate(ADMINSCREEN)}
        startIcon={OffenIcon}
        endIcon={tasksIcon}
      >
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
        style={{ backgroundColor: BackgroundFourth }}
      >
        <Autocomplete
          id="Title-demo"
          options={globalAutocompleteArray(
            records.map((record) => record),
            "Title"
          )}
          renderInput={(params) => (
            <TextField
              {...params}
              label={t("Title")}
              InputProps={{
                ...params.InputProps,
              }}
              InputLabelProps={{
                shrink: true,
              }}
            />
          )}
          onChange={(event, newValue) => {
            if (newValue === null || newValue === undefined) setTasks(records);
            else {
              const filteredData = records?.filter(
                (element) => (element.Title = newValue)
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
        {t("Art")}
      </TableCell>
      <TableCell
        key="TaskDetail"
        align="left"
        padding="none"
        style={{ backgroundColor: BackgroundFourth }}
      >
        {t("Task_Detail")}
      </TableCell>
      <TableCell
        key="Reset"
        align="left"
        padding="none"
        style={{ backgroundColor: BackgroundFourth }}
      >
        {t("Reset")}
      </TableCell>
    </>
  );

  const tableBody = (data) =>
    data.map((row, index) => {
      const labelId = `Tasks-table-div-${index}`;
      return (
        <TableRow
          role="div"
          tabIndex={-1}
          key={labelId}
          sx={{ backgroundColor: BackgroundThird }}
        >
          <TableCell padding="none" align="left" sx={{ pl: 1 }}>
            <span className="fw-bold" style={{ marginRight: "1vh" }}>
              {returnIfNotNullOrUndefined(row.Title)}
            </span>
          </TableCell>
          <TableCell padding="none" align="left" sx={{ pl: 1 }}>
            <span className="fw-bold" style={{ marginRight: "1vh" }}>
              {returnIfNotNullOrUndefined(row.art)}
            </span>
          </TableCell>
          <TableCell padding="none" align="left" sx={{ pl: 1 }}>
            <DetailsDesign
              Title={`Task Details: ${row?.Title}`}
              children={TaskDetails(row)}
              icon={DetailsIcon}
              ID={row.ID}
            />
          </TableCell>
          <TableCell padding="none" align="left" sx={{ pl: 1 }}>
            <Button onClick={() => handleTaskRest(row)}>{RestIcon}</Button>
          </TableCell>
        </TableRow>
      );
    });

  return (
    <>
      {" "}
      <HandleAxiosError error={error} />
      <CustomSnackbar
        open={openSnackbar}
        autoHide={1500}
        message={message}
        handleClose={() => {
          setSnackbar(false);
          forceUpdate();
        }}
        severity={"success"}
      />
      <GenericTableView
        elementCount={tasks?.length}
        disabledLink
        tableTitle={
          <div className="d-flex flex-row">
            {t("Archiv_for")} {patient?.FirstName}{" "}
          </div>
        }
        header={tableHeader}
        body={tasks}
        toolbar={TodoListToolBar}
        bodyMapper={tableBody}
        isLoading={isLoading}
        size={"small"}
        footerText={t("Data_per_page")}
        backgroundColor={BackgroundThird}
      />
    </>
  );
}
