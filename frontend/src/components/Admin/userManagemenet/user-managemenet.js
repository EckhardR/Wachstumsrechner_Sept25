import React, { useEffect, useReducer, useState } from 'react';
import { Autocomplete, Button, ButtonGroup, FormControl, Grid, InputLabel, MenuItem, Paper, Select, TableCell, TableRow, TextField, Typography } from '@mui/material';
import { useLocation, useNavigate } from 'react-router-dom';
import { getUserName, globalAutocompleteArray, globalFetchDataV2, globalHandleSearch } from '../../../services/services-tool.js';
import { API } from '../../../services/Api.js';
import { CustomSnackbar, DialogConfirmation } from '../../../utils/dialog-notifications.js';
import { DeletIcon, UserIcon } from '../../../utils/global-icons.js';
import { GenericTableView } from '../../../utils/table/generic-table-view.js';
import HandleAxiosError from '../../../utils/handle-axios-error.js';
import { BiRefresh } from 'react-icons/bi/index.esm.js';
import { AppName, ButtonCancel, ButtonFirst, ButtonOff, ButtonOn, ButtonSecond, SupportEmail, SupportTele, TextSecond } from '../../../utils/global-variables.js';
import { AiOutlineCheckCircle, AiTwotoneDelete } from 'react-icons/ai/index.esm.js';
import { DetailsDesign } from '../../../utils/table/details-design.js';
import { MdEmail, MdOutlineDisabledByDefault, MdOutlineTitle } from 'react-icons/md/index.esm.js';
import { CopyToClipboard } from '../../../utils/table/copy-to-clipboard.js';
import { RiLockPasswordLine } from 'react-icons/ri/index.esm.js';
import { CancelButton } from '../../../utils/table/table-tools.js';
import { useAuth } from "../../../services/AuthProvider";

import {
    setAuthentificatedState
  } from "../../../services/CookiesUtils.js";

export default function UserManagement() {
    const location = useLocation();

    const [records, setRecords] = useState(location.state?.userList || []);
    const [fetchedData, setData] = useState(location.state?.userList || []);
    const [error, setError] = useState([]);
    const [isLoading, setIsLoading] = useState(false); // true
    const [updateState, forceUpdate] = useReducer((x) => x + 2, 0);
    const [generatedPassword, setGeneratedPassword] = useState(null); // true
    const [openSnackbar, setSnackbar] = useState(false);
    const [message, setMessage] = useState("Password");
    const [severity, setSeverity] = useState("success");


    const [stationFetchedData, setStation] = useState([]);
    const [clinicFetchedData, setClinic] = useState([]);
    const [clinic, setClinicID] = useState(null);
    const [station, setStationId] = useState(null);

    const [role, setUserRole] = useState();
    

    const { isAuthenticated, hasRole } = useAuth();

    useEffect(() => {
        globalFetchDataV2(
            clinicFetchedData,
            setClinic,
            API.ClinicV2.getAll,
            setIsLoading,
            console.log,
            setError,
            true
        );
    
        globalFetchDataV2(
            stationFetchedData,
            setStation,
            API.StationV2.getAll,
            setIsLoading,
            console.log,
            setError,
            true
        );
    }, []); //  [records, isAuthenticated, hasRole, updateState, location]);

    useEffect(() => {
        generateStrongPassword(12)
        if(hasRole){
            setUserRole(hasRole)
        }
    }, [hasRole]); //  [records, isAuthenticated, hasRole, updateState, location]);

    useEffect(() => {
        globalFetchDataV2(
            records,
            setRecords,
            API.UserV2.getAll,
            setIsLoading,
            setData,
            setError,
            true,
        );
        
    }, [updateState]); //  [records, isAuthenticated, hasRole, updateState, location]);


    const handleChangeStatus = (user, actualStatus) => {
        DialogConfirmation(`${actualStatus ? 'Disable' : 'Enable'}`, `Are you sure you want to ${actualStatus ? 'disable' : 'enable'} ${user.First_Name}?`,
            () => {
                API.UserV2.changeStatus(user.ID, actualStatus)
                    .then((result) => {
                        if (result.status === 200) {
                            // localStorage?.setItem("authStatus", actualStatus);
                            // setAuthentificatedState(actualStatus)
                            setSnackbar(true);
                            forceUpdate();
                            setMessage(`${actualStatus ? 'Disable' : 'Enable'} of ${user.First_Name} done successfully`);
                        }
                    })
                    .catch((error) => {
                        // Handle any unexpected errors here
                        setError(`Unexpected error occurred: ${error.message}`);
                    });
            });
    }

    const handleDelete = (user) => {
        DialogConfirmation(
            `Delete`,
            `Are you sure you want to delete ${user.First_Name}?`,
            () => {
                setIsLoading(true);
                API.UserV2.remove(user.ID)
                    .then((result) => {
                        setIsLoading(false);
                        if (result.status === 200 || result.success === true) {
                            // Remove the deleted user from the records state
                            setRecords((prevRecords) => prevRecords.filter((u) => u.ID !== user.ID));
                            setSnackbar(true);
                            setMessage(`Delete of ${user.First_Name} done successfully`);
                        } else {
                            // Handle API errors here, show an error dialog or toast message
                            setError(`Error occurred while deleting user: ${result.error}`);
                        }
                    })
                    .catch((error) => {
                        setIsLoading(false);
                        // Handle any unexpected errors here
                        setError(`Unexpected error occurred: ${error.message}`);
                    });
            }
        );
    };


    const handleChangeRole = (user, actualRole, newRole) => {
        if(actualRole === newRole) {
            return
        }
        DialogConfirmation(`Change Role`, `Are you sure you want to change the actual role of ${user.First_Name} form ${actualRole} to ${newRole}?`,
            () => {
                API.UserV2.changeRole(user.ID, newRole )
                    .then((result) => {
                        if (result.status === 200) {
                            setSnackbar(true);
                            forceUpdate();
                            setMessage(`${actualRole} of ${user.First_Name} changed to ${newRole} is done successfully!`);
                        }
                    })
                    .catch((error) => {
                        if (error.response.status === 403) {
                            setError(error)
                            setSnackbar(true);
                            forceUpdate();
                            setMessage(`${actualRole} of ${user.First_Name} changed to ${newRole} is not done!`);
                        } else {
                            console.log(error)
                            // Handle any unexpected errors here
                            setError(`Unexpected error occurred: ${error.message}`);
                        }
                    });
            });
    }

    const getNameOf = (data, id, key) => {
        if (!data) return 'no data';
        const ele = data.find((item) => item.ID === id);
        if (!ele || !ele[key]) return 'not found';
        return ele[key]
    }

    function generateStrongPassword(length = 12) {
        const uppercaseLetters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
        const lowercaseLetters = 'abcdefghijklmnopqrstuvwxyz';
        const numbers = '0123456789';
        const symbols = '!@#$%^&*()_+-=<>?';

        const allCharacters = uppercaseLetters + lowercaseLetters + numbers + symbols;

        let password = '';
        for (let i = 0; i < length; i++) {
            const randomIndex = Math.floor(Math.random() * allCharacters.length);
            password += allCharacters[randomIndex];
        }

        setGeneratedPassword(password);
    }



    const handleSavePassword = (user) => {
        DialogConfirmation('Password', `Are you sure you want to set this password to ${user.First_Name}`,
            () => {
                API.UserV2.savePassword(user.ID, generatedPassword)
                    .then((result) => {
                        if (result.status === 200) {
                            setSnackbar(true);
                            setMessage(`The new password is set to ${user.First_Name}`);
                        };
                    })
                    .catch((error) => {
                        // Handle any unexpected errors here
                        setError(`Unexpected error occurred: ${error.message}`);
                    });
            });

    }


    function tableHeader() {
        return (
            <>
                <TableCell key={"Firstname"} align={"center"} padding={"normal"}>
                    <Autocomplete
                        id="Firstname-demo"
                        options={globalAutocompleteArray(fetchedData, "First_Name")}
                        size="small"
                        renderInput={(params) => (
                            <TextField
                                {...params}
                                label={"Name"}
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
                                setData(records);
                            else
                                globalHandleSearch(setData, records, "First_Name", newValue);
                        }}
                    />
                </TableCell>
                <TableCell key={"Email_Address"} align={"center"} padding={"normal"}> <Autocomplete
                    id="Email_Address-demo"
                    options={globalAutocompleteArray(fetchedData, "Email_Address")}
                    size="small"
                    renderInput={(params) => (
                        <TextField
                            {...params}
                            label={"E-Mail"}
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
                            setData(records);
                        else
                            globalHandleSearch(setData, records, "Email_Address", newValue);
                    }}
                />

                </TableCell>
                <TableCell key={"ClinicID"} align={"center"} padding={"normal"}>
                    { clinicFetchedData && 
                        <Autocomplete
                            id="ClinicID-demo"
                            options={clinicFetchedData}
                            getOptionLabel={(option) => option.Name }// Set clinic name as the display option
                            getOptionKey={(option) => option.ClinicID} // Set clinic ID as the value option
                            size="small"
                            renderInput={(params) => (
                                <TextField
                                    {...params}
                                    label={"clinic ID"}
                                    InputProps={{
                                        ...params.InputProps,
                                    }}
                                    InputLabelProps={{
                                        shrink: true,
                                    }}
                                />
                            )}
                            onChange={(event, newValue) => {
                                if (newValue === null || newValue === undefined) {
                                    setData(records);
                                } else {
                                    globalHandleSearch(setData, records, "ClinicID", newValue.ID);
                                }
                            }}
                        />
                    }
                </TableCell>
                <TableCell key={"ID"} align={"center"} padding={"normal"}>
                    <Autocomplete
                        id="StationID-demo"
                        options={stationFetchedData}
                        getOptionLabel={(option) => option.Name } // Set clinic name as the display option
                        getOptionKey={(option) => option.Station.ID} // Set clinic ID as the value option
                        size="small"
                        renderInput={(params) => (
                            <TextField
                                {...params}
                                label={"Station ID"}
                                InputProps={{
                                    ...params.InputProps,
                                }}
                                InputLabelProps={{
                                    shrink: true,
                                }}
                            />
                        )}
                        onChange={(event, newValue) => {
                            console.log(records, newValue)
                            if (newValue === null || newValue === undefined) {
                                setData(records);
                            } else {
                                globalHandleSearch(setData, records, "StationID", newValue.ID);
                            }
                        }}
                    />
                </TableCell>
                <TableCell key={"passwordGenerated"} align={"center"} padding={"normal"}>
                    Password Generate
                </TableCell>
                <TableCell key={"Role"} align={"center"} padding={"normal"}>
                    ROLE
                </TableCell>
                <TableCell key={"Aktiv"} align={"center"} padding={"normal"}>
                    Aktiv
                </TableCell>
                <TableCell key={"Delete"} align={"center"} padding={"normal"}>
                    Delete
                </TableCell>
            </>
        );
    };

    const passwordGenerated = (patient) => {
        const modalId = `passwordGenerated-table + ${patient.ID}`;
        return (
            <div key={modalId}>
                <Grid container>
                    <Grid item xs={9}>
                        <Paper>
                            <Typography variant='h7' className='fw-bolder d-flex justify-content-center w-100'>
                                Subject: Your New Strong Password for {AppName}
                            </Typography>
                            <div className='p-4 m-2'>
                                Dear {patient.First_Name},<br /><br />

                                We hope this email finds you well. As a part of our commitment to enhancing security, we have generated a new strong password for your account on {AppName}. Please find your new password below:<br /><br />

                                <span className='fw-bolder'>Generated Password:</span> {generatedPassword !== null ? generatedPassword : 'Not generated'}<br /><br />

                                We highly recommend that you change this password upon logging in for the first time.

                                Please log in to your account using your email and the provided password. Once logged in, navigate to your account settings to update your password to something more memorable to you.<br /> <br />

                                If you encounter any issues or require further assistance, please feel free to reach out to our support team at [{SupportEmail} / {SupportTele}]. We are here to help you. <br /> <br />

                                Thank you for being a valued user of {AppName}. We appreciate your cooperation in maintaining the security of your account. <br /> <br />

                                Best regards, <br />
                                {getUserName()}
                            </div>
                        </Paper>
                    </Grid>
                    <Grid item xs={3}>
                        <ButtonGroup
                            orientation="vertical"
                            fullWidth
                            variant='contained'>
                            <Button variant='outlined' onClick={() => generateStrongPassword(12)} endIcon={<RiLockPasswordLine size={25} />}>
                                Generate New Password
                            </Button>
                            <Button variant='outlined' endIcon={<MdOutlineTitle size={25} />}>
                                <CopyToClipboard
                                    clipboardText={`Your New Strong Password for ${AppName}`}
                                > Copy Subject
                                </CopyToClipboard>
                            </Button>
                            <Button variant='outlined' endIcon={<MdEmail size={25} />}>
                                <CopyToClipboard
                                    clipboardText={`
Dear ${patient.First_Name},
    
We hope this email finds you well. As a part of our commitment to enhancing security, we have generated a new strong password for your account on ${AppName}. Please find your new password below:
    
    Generated Password: ${generatedPassword}
    
We highly recommend that you change this password upon logging in for the first time.
    
Please log in to your account using your email and the provided password. Once logged in, navigate to your account settings to update your password to something more memorable to you. 
    
If you encounter any issues or require further assistance, please feel free to reach out to our support team at [${SupportEmail} / ${SupportTele}]. We are here to help you.  
    
Thank you for being a valued user of ${AppName}. We appreciate your cooperation in maintaining the security of your account.  
    
Best regards, 
${getUserName()}`}
                                > Copy Email
                                </CopyToClipboard>
                            </Button>
                            <Button variant='outlined' endIcon={<RiLockPasswordLine size={25} />}>
                                <CopyToClipboard
                                    clipboardText={generatedPassword}
                                > Copy Password
                                </CopyToClipboard>
                            </Button>
                            <Button onClick={() => handleSavePassword(patient)}>
                                Set Password
                            </Button>

                        </ButtonGroup>
                    </Grid>

                </Grid>

            </ div>
        );
    };

    function bodyMapper(fetchedData) {
        return fetchedData.map((row, index) => {
            const isActive = row?.Status === true || row?.Status === 'true' || row?.Status === 1 || row?.Status === '1';
            return (
                <TableRow hover role="checkbox" tabIndex={-1} key={index} style={{ backgroundColor: !isActive ? '#F78DA7' : null }}>
                    <TableCell align="left" padding={"none"}>{row.First_Name + ' ' + row.Last_Name}</TableCell>
                    <TableCell align="left" padding={"none"}>{row.Email_Address}</TableCell>
                    <TableCell align="left" padding={"none"}>
                        { getNameOf(clinicFetchedData, row.ClinicID, 'Name') }
                    </TableCell>
                    <TableCell align="left" padding={"none"}>
                        { getNameOf(stationFetchedData, row.StationID, 'Name') }
                    </TableCell>
                    <TableCell align="center" padding={"none"}>
                        <DetailsDesign
                            Title={`Password Generated for ${row?.First_Name}`}
                            children={passwordGenerated(row)}
                            icon={<BiRefresh style={{ color: TextSecond }} size={25} />}
                            ID={row.User_ID}
                        />
                    </TableCell>
                    <TableCell align="center" padding={"none"}>
                        <FormControl fullWidth size="small">
                            <InputLabel id="role-select-label">Role</InputLabel>
                            <Select
                                labelId="role-select-label"
                                id="role-select-label"
                                value={row?.Role}
                                label="Role"
                                disabled={!isAuthenticated || role !== 'admin'}
                                onChange={(event) => handleChangeRole(row, row?.Role, event.target.value)}
                            >
                                <MenuItem value={'admin'}>Admin</MenuItem>
                                <MenuItem value={'user'}>User</MenuItem>
                            </Select>
                        </FormControl>
                        
                    </TableCell>
                    <TableCell align="center" padding={"none"}>
                        <Button variant='outlined' style={{ backgroundColor: !isActive ?  ButtonOff: ButtonOn, color: !isActive ? '#FFFFFF' : '#FFFFFF' }} onClick={() => handleChangeStatus(row, isActive)}> {isActive ? <AiOutlineCheckCircle size={18} /> : <AiOutlineCheckCircle size={18} />}</Button>
                    </TableCell>
                    <TableCell align="center" padding={"none"}>
                        <Button variant='outlined' color='error' style={{backgroundColor: ButtonCancel, color: '#FFFFFF' }} onClick={() => handleDelete(row)}>
                            {
                                <AiTwotoneDelete size={20} color={'#FFFFFF'} />
                            }
                            </Button>
                    </TableCell>
                </TableRow>
            );
        });
    };



    return (
        <>
            <HandleAxiosError error={error} />
            <CancelButton />
            <CustomSnackbar open={openSnackbar} autoHide={3000} message={message} handleClose={() => {
                setSnackbar(false);
                forceUpdate();
            }} severity={severity} />
            <GenericTableView
                tableTitle={<>User list {UserIcon}</>}
                elementCount={fetchedData?.length}
                disabledLink={true}
                header={tableHeader}
                body={fetchedData}
                bodyMapper={bodyMapper}
                isLoading={isLoading} // isLoading
                footerText='User per page'
            />
        </>
    );
}