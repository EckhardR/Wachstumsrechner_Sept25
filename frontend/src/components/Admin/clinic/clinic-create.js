import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { checkRequiredProperties } from "../../../utils/table/table-tools.js";
import { API } from "../../../services/Api.js";
import { ClinicForm } from "./clinic-form.js";
import { NewKidIcon, newElemenetIcon } from "../../../utils/global-icons.js";
import { CreateDesign } from "../../../utils/table/create-design.js";
import HandleAxiosError from "../../../utils/handle-axios-error.js";
import { CustomSnackbar } from "../../../utils/dialog-notifications.js";
import { CLINIC } from "../../../routes/Routes-Links.js";

export default function CreateClinic() {
  const location = useLocation();
  const [Clinic, setClinic] = useState(location.state?.Clinics ? location.state?.Clinics : null);
  const navigate = useNavigate();
  const [error, setError] = useState([]);
  const [openSnackbar, setSnackbar] = useState(false);

  const ClinicFormRef = React.useRef();

  let handleSave = () => {
    const currentClinic = ClinicFormRef.current.getClinic();
    if (currentClinic === location.state?.Clinic) return false;
    const requiredProperties = [
      { key: 'Name', label: 'Clinic Name' }
    ];
    console.log("current Clinic", currentClinic)
    if (checkRequiredProperties(currentClinic, requiredProperties))
      API.ClinicV2.create(currentClinic)
        .then((result) => {
          if (result.status === 200) {            
            ClinicFormRef.current.cleanClinic();
            handleClose()
          }
        })
        .catch((error) => {
          // Handle any unexpected errors here
          setError(`Unexpected error occurred: ${error.message}`);
      });
  };

  const handleCancel = () => {
    navigate(`${CLINIC}`);
  };

  const handleClose = () => {
    setSnackbar(false);
    navigate(`${CLINIC}`);
  };

  return (
    <>
      <HandleAxiosError error={error} />
      <CustomSnackbar open={openSnackbar} autoHide={3000} message={`Clinic successfully saved!`} handleClose={handleClose} severity={"success"} />
      <CreateDesign
        Title={<h3> {NewKidIcon} Save new Clinic in System {newElemenetIcon}
        </h3>}
        cancel={handleCancel}
        handleSave={handleSave}
        style={{ marginTop: '2vh' }}
      >
        <ClinicForm
          ref={ClinicFormRef}
          Clinic={Clinic} />
      </CreateDesign>
    </>
  );
}