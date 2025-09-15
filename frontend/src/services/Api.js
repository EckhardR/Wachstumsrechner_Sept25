import * as Routes from '../routes/Routes-Links.js';
import { getUserName } from './services-tool.js';
import axios from "axios";
// import Cookies from 'js-cookie';
// import { useAuth } from "../services/AuthProvider.js";

// const accessToken = Cookies.get('access_token');
// const refreshToken = Cookies.get('refresh_token');

import env from "react-dotenv";
export const BACKENDURI = `${env.BACKEND_HOST}:${env.BACKEND_PORT}`;

export const API = {
    PatientV2: {
        create(newPatient) {
            return axios.post(`${BACKENDURI}/V2/Patient`, {
                newPatient: {
                    ...newPatient,
                    CreatedBy: getUserName(),
                }
            }, {
                headers: {
                    'Content-Type': 'application/json',
                }
            });
        },
        getAll() {
            return axios.get(`${BACKENDURI}/V2/Patient/`);
        },
        getArchiv() {
            return axios.get(`${BACKENDURI}/V2/Patient/Archiv`);
        },
        getWithId(patientId) {
            return axios.get(
                `${BACKENDURI}/V2/Patient/id/${patientId}`
            );
        },
        getWithStation(stationId) {
            return axios.get(
                `${BACKENDURI}/V2/Patient/Station/${stationId}`
            );
        },
        update(newPatient) {
            return axios.put(`${BACKENDURI}/V2/Patient/update`, {
                newPatient: newPatient,
            });
        },
        discharge(patientID) {
            return axios.put(`${BACKENDURI}/V2/Patient/discharge`, {
                ID: patientID,
            });
        },
        restore(patientID) {
            return axios.put(`${BACKENDURI}/V2/Patient/restore`, {
                ID: patientID,
            });
        },
        changeStatus(patientID, actualStatus) {
            return axios.put(`${BACKENDURI}/V2/Patient/changeStatus`, {
                patientID: patientID,
                actualStatus: actualStatus,
            });
        },
        getLastGewitch(patientID) {
            return axios.put(`${BACKENDURI}/V2/Patient/lastGewicht`, {
                patientID: patientID,
            });
        }
    },
    StationV2: {
        create(newStation) {
            return axios.post(`${BACKENDURI}/V2/Station`, {
                newStation: {
                    ...newStation,
                    CreatedBy: getUserName(),
                }
            }, {
                headers: {
                    'Content-Type': 'application/json',
                }
            });
        },
        getAll() {
            return axios.get(`${BACKENDURI}/V2/Station/`);
        },
        getWithId(stationId) {
            return axios.get(
                `${BACKENDURI}/Station/${stationId}`
            );
        },
        update(newStation) {
            return axios.put(`${BACKENDURI}/V2/Station/update`, {
                newStation: newStation,
            });
        },
        discharge(stationId) {
            return axios.post(`${BACKENDURI}/V2/Station/discharge`, {
                ID: stationId
            }, {
                headers: {
                    'Content-Type': 'application/json',
                }
            });
        },
    },
    ClinicV2: {
        getAll() {
            return axios.get(`${BACKENDURI}/V2/Clinic/`);
        },
        create(newClinic) {
            return axios.post(`${BACKENDURI}/V2/Clinic`, {
                newClinic: {
                    ...newClinic,
                    CreatedBy: getUserName(),
                }
            }, {
                headers: {
                    'Content-Type': 'application/json',
                }
            });
        },
        update(newClinic) {
            return axios.put(`${BACKENDURI}/V2/Clinic/update`, {
                newClinic: newClinic,
            });
        },
        delete(clinicId) {
            return axios.post(`${BACKENDURI}/V2/Clinic/delete`, {
                ID: clinicId
            }, {
                headers: {
                    'Content-Type': 'application/json',
                }
            });
        },
    },
    UserV2: {
        login(Email, Password) {
            console.log("LOGIN: ", BACKENDURI)
            return axios.post(
                `${BACKENDURI}/V2/User/`, {
                    Email: Email,
                    Password: Password,
                }, {
                    headers: {
                        'Content-Type': 'application/json',
                    }
                }
            );
        },
        updatePassword(userId, actualPassword, newPassword) {
            return axios.put(`${BACKENDURI}/V2/User/update-password`, {
                userId: userId,
                actualPassword: actualPassword,
                newPassword: newPassword
            });
        },

        getAll() {
            return axios.get(`${BACKENDURI}/V2/User/users`)
        },

        changeStatus(userId, status) {
            return axios.put(`${BACKENDURI}/V2/User/changeStatus`, {
                ID: userId,
                ActualStatus: status,
            });
        },

        changeRole(userId, role) {
            return axios.put(`${BACKENDURI}/V2/User/changeRole`, {
                ID: userId,
                newRole: role
            });
        },
        remove(userId) {
            return axios.put(`${BACKENDURI}/V2/User/remove`, {
                ID: userId,
            });
        },

        
        create(newUser) {
            return axios.post(`${BACKENDURI}/V2/User/signup`, {
                newUser: newUser
            }, {
                headers: {
                    'Content-Type': 'application/json',
                }
            });
        },

        disable(userId) {
            return axios.put(`${BACKENDURI}/V2/User/disable`, {
                userId: userId
            });
        },
        update(newUser, oldNewUser) {
            return axios.put(`${BACKENDURI}/V2/User/update`, {
                newUser: newUser,
                oldNewUser: oldNewUser,
            });
        },
        
        savePassword(userID, password) {
            return axios.put(`${BACKENDURI}/V2/User/savePassword`, {
                ID: userID,
                password: password,
            });
        },
        updateUsername(userId, password, newUsername) {
          return axios.put(`/User/V2/${userId}/username-update`, {
            password: password,
            username: newUsername,
          });
        },

       
    },

    TasksV2: {
        // CREATE
        // createAllPatientTasks(data) {
        //     return axios.post(`${BACKENDURI}/V2/Tasks/all/create`, { data }, {
        //         headers: {
        //             'Content-Type': 'application/json',
        //         }
        //     });
        // },

        // GET
        getPatientsTasks(id) {
            return axios.get(`${BACKENDURI}/V2/Tasks/individual/${id}`);
        },

        todayPatientsTasks(id) {
            return axios.get(`${BACKENDURI}/V2/Tasks/today/patient/${id}`);
        },

        todayMultiplePatientsTasks(list) {
            let apiUrl = `${BACKENDURI}/V2/Tasks/today/all?`;
            list.forEach((x, i) => {
                if (i === 0) {
                  apiUrl += `ids=${x}`;
                } else {
                  apiUrl += `&ids=${x}`;
                }
              });
            return axios.get(apiUrl);
        },

        // CREATE
        createPatientsTask(data) {
            return axios.post(`${BACKENDURI}/V2/Tasks/individual/create`, { data }, {
                headers: {
                    'Content-Type': 'application/json',
                }
            });
        },

        // UPDATE
        updatePatientsTask(id, data) {
            return axios.post(`${BACKENDURI}/V2/Tasks/individual/update/${id}`, {
                data
            }, {
                headers: {
                    'Content-Type': 'application/json',
                }
            });
        },

        // PROCESS
        processPatientsTask(id) {
            return axios.post(`${BACKENDURI}/V2/Tasks/individual/process/${id}`);
        },

        // RESTORE
        unProcessPatientsTask(id) {
            return axios.post(`${BACKENDURI}/V2/Tasks/individual/restore/${id}`);
        },

        // DELETE
        deletePatientsTask(id) {
            return axios.delete(`${BACKENDURI}/V2/Tasks/individual/delete/${id}`)
        },



        /* ADMISSION TASKS */

        // GET
        getAdmissionTasks() {
            return axios.get(`${BACKENDURI}/V2/Tasks/admission/all`);
        },

        // CREATE
        createAdmissionTask(data) {
            return axios.post(`${BACKENDURI}/V2/Tasks/admission/create`, { data }, {
                headers: {
                    'Content-Type': 'application/json',
                }
            });
        },

        // UPDATE
        updateAdmissionTask(id, data) {
            return axios.post(`${BACKENDURI}/V2/Tasks/admission/update/${id}`, { data }, {
                headers: {
                    'Content-Type': 'application/json',
                }
            });
        },

        // DELETE
        deleteAdmissionTask(id) {
            return axios.delete(`${BACKENDURI}/V2/Tasks/admission/delete/${id}`);
        },


        /* ROUTINE TASKS */

        // GET
        getRoutineTasks() {
            return axios.get(`${BACKENDURI}/V2/Tasks/routine/all`);
        },

        // CREATE
        createRoutineTask(data) {
            return axios.post(`${BACKENDURI}/V2/Tasks/routine/create`, { data }, {
                headers: {
                    'Content-Type': 'application/json',
                }
            });
        },

        // UPDATE
        updateRoutineTask(id, data) {
            return axios.post(`${BACKENDURI}/V2/Tasks/routine/update/${id}`, { data }, {
                headers: {
                    'Content-Type': 'application/json',
                }
            });
        },

        // DELETE
        deleteRoutineTask(id) {
            return axios.delete(`${BACKENDURI}/V2/Tasks/routine/delete/${id}`);
        },

        /* end new */

    },

    TodosV2: {
        getOpenTasks(date) {
            return axios.put(`${BACKENDURI}/V2/Todos/search`, {
                searchDate: date
            });
        },
        SaveNewDailyTask(newTask) {
            return axios.post(`${BACKENDURI}/V2/Todos`, {
                newTask: newTask,
                CreatedBy: getUserName()
            }, {
                headers: {
                    'Content-Type': 'application/json',
                }
            });
        },
        UpdateNewDailyTask(newTask) {
            return axios.post(`${BACKENDURI}/V2/Todos/UpdateNewDailyTask`, {
                newTask: newTask,
                CreatedBy: getUserName()
            }, {
                headers: {
                    'Content-Type': 'application/json',
                }
            });
        },
        getAll() {
            return axios.get(`${BACKENDURI}/V2/Todos/`);
        },
        getGrowthDataWithID(ID) {
            return axios.get(
                `${BACKENDURI}/V2/Todos/GrowthData/${ID}`
            );
        },
        taskReset(taskId, patientId) {
            return axios.post(`${BACKENDURI}/V2/Todos/taskreset`, { taskId: taskId, patientId: patientId }, {
                headers: {
                    'Content-Type': 'application/json',
                }
            });
        }       
    }
    
    /*
    Tasks: {
        SaveNewDailyTask(newTask) {
            return axios.post(`${BACKENDURI}/Tasks`, {
                newTask: newTask,
                CreatedBy: getUserName()
            }, {
                headers: {
                    'Content-Type': 'application/json',
                }
            });
        },
        UpdateNewDailyTask(newTask) {
            return axios.post(`${BACKENDURI}/Tasks/UpdateNewDailyTask`, {
                newTask: newTask,
                CreatedBy: getUserName()
            }, {
                headers: {
                    'Content-Type': 'application/json',
                }
            });
        },
        getAll() {
            return axios.get(`${BACKENDURI}/Tasks/`);
        },
       
        createNewTask(newTask) {
            return axios.post(`${BACKENDURI}/Tasks/Create`, {
                newTask: newTask,
                CreatedBy: getUserName()
            }, {
                headers: {
                    'Content-Type': 'application/json',
                }
            });
        },
        newSimpleTask(newTask) {
            return axios.post(`${BACKENDURI}/Tasks/CreateSimpleTask`, {
                newTask: newTask,
                CreatedBy: getUserName()
            }, {
                headers: {
                    'Content-Type': 'application/json',
                }
            });
        },
        newIndvTask(newTask) {
            return axios.post(`${BACKENDURI}/Tasks/CreateIndvTask`, {
                newTask: newTask,
                CreatedBy: getUserName()
            }, {
                headers: {
                    'Content-Type': 'application/json',
                }
            });
        },
        EditTask(newTask) {
            return axios.post(`${BACKENDURI}/Tasks/update`, {
                newTask: newTask
            }, {
                headers: {
                    'Content-Type': 'application/json',
                }
            });
        },
        getAllTasks() {
            return axios.get(`${BACKENDURI}/Tasks/todoTasks`);
        },

        getAllIndvTasks() {
            return axios.get(`${BACKENDURI}/Tasks/todoIndvTasks`);
        },

        getOpenTasks(date) {
            return axios.put(`${BACKENDURI}/Tasks/search`, {
                searchDate: date
            });
        },
        getTodoListToProcess() {
            return axios.get(`${BACKENDURI}/Tasks/todoListToProcess`);
        },
        getTodoListToProcessArchiv(PatientID) {
            return axios.get(`${BACKENDURI}/Tasks/todoListToProcessArchiv/${PatientID}`);
        },
        processTask(newTask) {
            return axios.post(`${BACKENDURI}/Tasks/processTask`, {
                newTask: newTask,
                CreatedBy: getUserName()
            }, {
                headers: {
                    'Content-Type': 'application/json',
                }
            });
        },
        taskReset(taskId, patientId) {
            return axios.post(`${BACKENDURI}/Tasks/taskreset`, { taskId: taskId, patientId: patientId }, {
                headers: {
                    'Content-Type': 'application/json',
                }
            });
        },
        getGrowthDataWithID(ID) {
            return axios.get(
                `${BACKENDURI}/Tasks/GrowthData/${ID}`
            );
        },
    },
    */
    
}


// Add axios interceptor to set the authorization header for all requests
console.log("######### AUTH TOKEN #########");
axios.interceptors.request.use(
    (config) => {
        const user = JSON.parse(localStorage.getItem("authUser"));
    
        if (user) {
        config.headers.Authorization = `Bearer ${user.accessToken}`;
        }
        return config;
    },
    (error) => {
        // console.log("request error", error);
        return Promise.reject(error);
    }
);

// Add axios interceptor to refresh tokens when needed
axios.interceptors.response.use(
    (response) => {
        console.log("IS DONE")
        return response
    },

    async (error) => {
        console.log("CHECK DONE")
        if (error.response.status === 401 || error.response.status === 403) {
            setTimeout(() => {                
                localStorage.clear()
                let allCookies = document.cookie.split(';');

                // The "expire" attribute of every cookie is 
                // Set to "Thu, 01 Jan 1970 00:00:00 GMT"
                for (let i = 0; i < allCookies.length; i++)
                    document.cookie = allCookies[i] + "=;expires=" + new Date(0).toUTCString();                    
                    window.location.assign('http://localhost:3000');
                }, 500)
                
        } else {
            return Promise.reject(error)
        }

    // const refreshToken = JSON.parse(localStorage.getItem('refreshToken')).refreshToken;

    
    //     // const { logout } = useAuth();
    //     // logout();
    //     console.log("HANSEN FAIL", useAuth)
    //     // window.location = 'http://localhost:3000'; // window.location.origin + Routes
        
    //     // return Promise.reject(error);
    //     // const navigate = useNavigate();
        
    //     // console.log("HANSEN FAIL", navigate)
    //     // navigate(window.location.origin + Routes.HOME);
    //     return;
    //     // Refresh the access token
    //     const response = await axios.post(`${BACKENDURI}/V2/User/token`, { token: refreshToken })
    //     .catch((error) => {
    //         console.error("ERROR: ", error);
    //         // useNavigate(`${Routes.LOGIN}`);
    //         return;
            
    //     });

    //     console.log("RESPONSE: ", response)

    //     // Update the stored access token
    //     const newAccessToken = response.data.accessToken;
    //     // Retry the original request with the new access token
    //     const originalRequest = error.config;
    //     originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
    //     return axios(originalRequest);
    // }

    // return Promise.reject(error);
});
