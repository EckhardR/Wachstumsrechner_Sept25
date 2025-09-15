import React, { useRef, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom';
import { checkRequiredProperties } from '../../../utils/table/table-tools.js';
import HandleAxiosError from '../../../utils/handle-axios-error.js';
import { CreateDesign } from '../../../utils/table/create-design.js';
import { TaskForm } from './task-form.js';
import { Task } from './task-model.js';
import { TASKS } from '../../../routes/Routes-Links.js'
import { DialogSuccessSaved } from '../../../utils/dialog-notifications.js';
import { API } from '../../../services/Api.js';
import { FcTodoList } from 'react-icons/fc/index.esm.js';
import { EditDesign } from '../../../utils/table/edit-design.js';

export default function TaskEdit() {
    const location = useLocation();
    const [Task: Task, setTask] = useState(location.state?.Task || []);
    const navigate = useNavigate();
    const [error, setError] = useState([]);

    const TaskFormRef = useRef();

    let handleSave = () => {
        const currentTask = TaskFormRef.current.getTask();
        if (currentTask === location.state?.Task) return false;
        const requiredProperties = [
            { key: 'Title', label: 'Task Title' },
            { key: 'Description', label: 'Task Description' },
            { key: 'art', label: 'Task Art' },
        ];
        if (checkRequiredProperties(currentTask, requiredProperties))
        API.Tasks.EditTask(currentTask)
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
            <EditDesign
                Title={<h3>Task editing <FcTodoList style={{ marginLeft: '10px' }} />
                </h3>}
                cancel={handleAbbrechen}
                handleSave={handleSave}
            >
                <TaskForm
                    ref={TaskFormRef}
                    Task={Task}
                />
            </EditDesign>
        </>
    );
}