import React, { useRef, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom';
import { checkRequiredProperties } from '../../../utils/table/table-tools.js';
import HandleAxiosError from '../../../utils/handle-axios-error.js';
import { CreateDesign } from '../../../utils/table/create-design.js';
import { TaskForm } from './task-form.js';
// import { Task } from './task-model.js';
import { TASKS } from '../../../routes/Routes-Links.js'
import { DialogSuccessSaved } from '../../../utils/dialog-notifications.js';
import { API } from '../../../services/Api.js';
import { FcTodoList } from 'react-icons/fc/index.esm.js';

export default function TaskCreate() {
    const location = useLocation();
    const [task, setTask] = useState(location.state?.Task || []);
    const navigate = useNavigate();
    const [error, setError] = useState([]);

    const taskFormRef = useRef();

    let handleSave = () => {
        const currentTask = taskFormRef.current.getTask();
        console.log("currentTask", currentTask)
        if (currentTask === location.state?.Task) return false;
        const requiredProperties = [
            { key: 'Title', label: 'Title' },
            { key: 'Description', label: 'Description' },
            { key: 'date', label: 'Datum' },
            
        ];
        if (checkRequiredProperties(currentTask, requiredProperties))
            console.log("currentTask", currentTask)
        API.Tasks.createNewTask(currentTask)
                .then((value) => {
                    DialogSuccessSaved('Task', () => {
                        navigate(`${TASKS}`);
                    }, () => {
                        setTask([]);
                    });
                })
            .catch((error) => {
                console.error("error ", error);
                setError(error);
            });
    };

    const handleAbbrechen = () => {
        navigate(`${TASKS}`);
    };

    return (
        <>
            <HandleAxiosError error={error} />
            <CreateDesign
                Title={<h3>
                    Create New Task <FcTodoList style={{ marginLeft: '10px' }} />
                </h3>}
                cancel={handleAbbrechen}
                handleSave={handleSave}
            >
                <TaskForm
                    ref={taskFormRef}
                    Task={task}
                />
            </CreateDesign>
        </>
    );
}