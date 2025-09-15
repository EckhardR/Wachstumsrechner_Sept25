import * as ROUTES from "./Routes-Links.js";
import Home from "../components/HomePage/HomePage.js";
import Footer from "../components/Navigation/Footer.js";
import TopNavbar from "../components/Navigation/TopNavbar.js";
import { Route, Routes } from "react-router-dom";
import LoginForm from "../components/Navigation/login-form.js";
import LogoutView from "../components/Navigation/LogoutView.js";

import CreatePatient from "../components/patient/patient-create.js";
import SingupForm from "../components/Navigation/singup-form.js";
import SingupConfirmation from "../components/Navigation/singup-confirmation.js";
import AdminScreen from "../components/Admin/AdminScreen.js";
import PatientView from "../components/patient/patient-view.js";
import ContactUs from "../components/HomePage/contact-us.js";
import AboutUs from "../components/HomePage/about-us.js";
import PatientEdit from "../components/patient/patient-edit.js";
import ProcessChart from "../components/Admin/charts/process-chart.js";
import PatientArhiv from "../components/patient/patient-archiv.js";
import PatientCapture from "../components/patient/patient-capture.js";
import ClinicView from "../components/Admin/clinic/clinic-view.js";
import ClinicCreate from "../components/Admin/clinic/clinic-create.js";
import ClinicEdit from "../components/Admin/clinic/clinic-edit.js";
import StationView from "../components/Admin/station/station-view.js";
import CreateStation from "../components/Admin/station/station-create.js";
import StationEdit from "../components/Admin/station/station-edit.js";
import UserManagement from "../components/Admin/userManagemenet/user-managemenet.js";
import TaskCreate from "../components/Admin/tasks/Task-create.js";
import TaskView from "../components/Admin/tasks/task-view.js";
import TaskEdit from "../components/Admin/tasks/Task-edit.js";
import TodoListToProcessArchiv from "../components/Admin/Todo-List/TodoList-Archiv.js";
import TodoListOverview from "../components/Admin/Todo-List/Todo-List.js";

import TodosView from "../components/todos/TodosView.js"

/* new */
import PatientTasksView from "../components/views/patient/tasks-view.js";
import PatientAdmissionTasksView from "../components/views/patient/admission-tasks-view.js";
import PatientRoutineTasksView from "../components/views/patient/routine-tasks-view.js";
import UpdateUserCredentials from "../components/Admin/userManagemenet/UpdateUserCredentials.js";
import RequiredAuth from './Required-Route.js'
// import setAuthToken from "../services/axios-config";

const AppRouter = () => {
  return (
    <div style={{ width: "100%", height: "100%", margin: 0, padding: 0 }}>
      <TopNavbar />
      <div className="main-container body mb-0 pb-0" style={{ minHeight: "0px" }}>
        <Routes>
          {/* Navigations Routes (Public) */}
          <Route exact path={ROUTES.HOME} element={<Home />} />
          <Route exact path={ROUTES.LOGIN} element={<LoginForm />} />
          <Route exact path={ROUTES.SINGUP} element={<SingupForm />} />
          <Route exact path={ROUTES.SINGUPSUCESS} element={<SingupConfirmation />} />
          <Route exact path={ROUTES.LOGOUT} element={<LogoutView />} />

          <Route exact path={ROUTES.CONTACTUS} element={<ContactUs />} />
          <Route exact path={ROUTES.ABOUTUS} element={<AboutUs />} />
          {/* Private Routes */}
          <Route element={<RequiredAuth />}>
            <Route exact path={ROUTES.ADMINSCREEN} element={<AdminScreen/>} />
          
            {/* Patient */}
            <Route exact path={ROUTES.CREATEPATIENT} element={<CreatePatient />} />
            <Route exact path={ROUTES.PATIENT} element={<PatientView />} />
            <Route exact path={ROUTES.EDITPATIENT} element={<PatientEdit />} />
            <Route exact path={ROUTES.PATIENTARCHIV} element={<PatientArhiv />} />
            <Route exact path={ROUTES.PATIENTCAPTURE} element={<PatientCapture />} />

            { /* Parient Tasks */ }
            <Route exact path={ROUTES.PATIENT_TASKS} element={<PatientTasksView />} />
            <Route exact path={ROUTES.PATIENT_ADMISSION_TASKS} element={<PatientAdmissionTasksView />} />
            <Route exact path={ROUTES.PATIENT_ROUTINE_TASKS} element={<PatientRoutineTasksView />} />
            
            {/* Tasks */}
            <Route exact path={ROUTES.CHART} element={<ProcessChart />} />
            <Route exact path={ROUTES.CREATETASK} element={<TaskCreate />} />
            <Route exact path={ROUTES.EDITTASK} element={<TaskEdit />} />
            <Route exact path={ROUTES.TASKS} element={<TaskView />} />
            <Route exact path={ROUTES.TASKSTODOLIST} element={<TodoListOverview />} />
            <Route exact path={ROUTES.PATIENTTASKSHISTORY} element={<TodoListToProcessArchiv />} />

            {/* Todos */}
            <Route exact path={ROUTES.TODOS} element={<TodosView />} />
            {/* Clinic */}
            <Route exact path={ROUTES.CLINIC} element={<ClinicView />} />
            <Route exact path={ROUTES.CLINIC_CREATE} element={<ClinicCreate />} />
            <Route exact path={ROUTES.CLINIC_EDIT} element={<ClinicEdit />} />

            {/* Station */}
            <Route exact path={ROUTES.STATION} element={<StationView />} />
            <Route exact path={ROUTES.CREATESTATION} element={<CreateStation />} />
            <Route exact path={ROUTES.EDITSTATION} element={<StationEdit />} />
            
            {/* User Managemenet */}
            <Route exact path={ROUTES.USER} element={<UserManagement />} />
            <Route exact path={ROUTES.USERCREDENTIALS} element={<UpdateUserCredentials />} />
          </Route>
        </Routes>
      </div>
      <Footer className="navbar fixed-bottom navbar-fixed-bottom" />
    </div>
  );
};

export default AppRouter;

