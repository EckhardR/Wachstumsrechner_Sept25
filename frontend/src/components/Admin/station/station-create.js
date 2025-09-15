import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { checkRequiredProperties } from "../../../utils/table/table-tools.js";
import { API } from "../../../services/Api.js";
import { StationForm } from "./station-form.js";
import { NewKidIcon, newElemenetIcon } from "../../../utils/global-icons.js";
import { CreateDesign } from "../../../utils/table/create-design.js";
import HandleAxiosError from "../../../utils/handle-axios-error.js";
import { CustomSnackbar, DialogConfirmation } from "../../../utils/dialog-notifications.js";
import { STATION } from "../../../routes/Routes-Links.js";

export default function CreateStation() {
  const location = useLocation();
  const [Station, setStation] = useState(location.state?.Stations ? location.state?.Stations : null);
  const navigate = useNavigate();
  const [error, setError] = useState([]);
  const [openSnackbar, setSnackbar] = useState(false);

  const StationFormRef = React.useRef();

  let handleSave = () => {
    const currentStation = StationFormRef.current.getStation();
    if (currentStation === location.state?.Station) return false;
    const requiredProperties = [
      { key: 'StationNr', label: 'Station N°' },
      { key: 'Name', label: 'Station Name' },
      { key: 'ClinicID', label: 'Clinic Name' },
      { key: 'BedArray', label: 'Bed N°' },
    ];
    console.log("current Statte", currentStation)
    if (checkRequiredProperties(currentStation, requiredProperties))
      DialogConfirmation('Create', `Are you sure you want to create new Station ${currentStation?.Name} with Bed ${currentStation?.BedArray}?`,
        () => {
          API.StationV2.create(currentStation)
            .then((result) => {
              if (result.status === 200) {
                setSnackbar(true);
                StationFormRef.current.cleanStation();
              }
            })
            .catch((error) => {
              // Handle any unexpected errors here
              setError(`Unexpected error occurred: ${error.message}`);
            });
        });
  };

  const handleCancel = () => {
    navigate(`${STATION}`);
  };

  const handleClose = () => {
    setSnackbar(false);
    navigate(`${STATION}`);
  };

  return (
    <>
      <HandleAxiosError error={error} />
      <CustomSnackbar open={openSnackbar} autoHide={3000} message={`Station successfully saved!`} handleClose={handleClose} severity={"success"} />
      <CreateDesign
        Title={<h3> {NewKidIcon} Save new Station im System {newElemenetIcon}
        </h3>}
        cancel={handleCancel}
        handleSave={handleSave}
        style={{ marginTop: '2vh' }}
      >
        <StationForm
          ref={StationFormRef}
          Station={Station} />
      </CreateDesign>
    </>
  );
}