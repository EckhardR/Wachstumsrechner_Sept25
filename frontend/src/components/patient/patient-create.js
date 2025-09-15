import React, { useState } from "react";
import * as ROUTES from "../../routes/Routes-Links.js";
import { useLocation, useNavigate } from "react-router-dom";
import { checkRequiredProperties } from "../../utils/table/table-tools.js";
import { API } from "../../services/Api.js";
import { PatientForm } from "./patient-form.js";
import { NewKidIcon, newElemenetIcon } from "../../utils/global-icons.js";
import { CreateDesign } from "../../utils/table/create-design.js";
import HandleAxiosError from "../../utils/handle-axios-error.js";
import { DialogConfirmation, DialogSuccessSaved } from "../../utils/dialog-notifications.js";

/**
 * Component for creating a new patient
 */
export default function CreatePatient() {
  const location = useLocation();
  const [patient, setPatient] = useState(location.state?.patient ? location.state?.patient : null);
  const navigate = useNavigate();
  const [error, setError] = useState([]);

  const PatientFormRef = React.useRef();

  let handleSave = () => {
    const currentPatient = PatientFormRef.current.getPatient();
    console.log('Item to save', currentPatient)
    if (currentPatient === location.state?.patient) return false;
    const requiredProperties = [
      { key: 'StationID', label: 'Station Name' },
      { key: 'ClinicID', label: 'Clinic Name' },
      { key: 'BedNr', label: 'bed N°' },
      { key: 'FirstName', label: 'First Name' },
      { key: 'LastName', label: 'Last Name' },
      { key: 'Gender', label: 'Gender' },
      { key: 'BirthWeight', label: 'Birth Weight' },
      { key: 'Birthday', label: 'Birthday' },
      { key: 'BirthLength', label: 'Birth Length' },
      { key: 'HeadCircumference', label: 'Head Circumference' },
      { key: 'GestationalWeek', label: 'Gestational Week' },
      { key: 'GestationalDay', label: 'Gestational Day' },
      { key: 'FatMass', label: 'Fat mass' },
      { key: 'FatFreeMass', label: 'Fat free mass' },
      { key: 'MotherAge', label: 'Mother Age' },
      { key: 'MotherPrePregnancyWeight', label: 'Mother Pre-Pregnancy Weight' },
      { key: 'MotherHeight', label: 'Mother Height' },
      { key: 'FatherAge', label: 'Father Age' },
      { key: 'FatherWeight', label: 'Father Weight' },
      { key: 'FatherHeight', label: 'Father Height' },
    ];
    
    if (checkRequiredProperties(currentPatient, requiredProperties))
    DialogConfirmation('Create', `Are you sure you want to create new Patient ${currentPatient?.FirstName}, ${currentPatient?.LastName} in Bed ${currentPatient?.BedNr}?`,
    () => {
      Promise.all([
        new Promise((resolve, reject) => {
          API.PatientV2.create(currentPatient).then((result) => {
            console.log("result: ", result)
            if (result.status === 200) {
              resolve(true);
            } else {
              reject();
            }
          })
        })
      ]).then(results => {

        if(results.every((item) => item === true)) {
          DialogSuccessSaved('Patient', () => {
              navigate(`${ROUTES.PATIENT}`);
            }, () => PatientFormRef.current.cleanPatient()
          );
        }
      }).catch(err => {
        console.log("result: ", error)
        // Handle any unexpected errors here
        setError(`Unexpected error occurred: ${error.message}`);
      });
    });
  };

  const handleCancel = () => {
    navigate(`${ROUTES.PATIENT}`);
  };

  return (
    <>
      <HandleAxiosError error={error} />
      <CreateDesign
        Title={<h3> {NewKidIcon} Save new Patient im System {newElemenetIcon}
        </h3>}
        cancel={handleCancel}
        handleSave={handleSave}
        style={{ marginTop: '2vh' }}
      >
        <PatientForm
          ref={PatientFormRef}
          patient={patient} />
      </CreateDesign>
    </>
  );
}