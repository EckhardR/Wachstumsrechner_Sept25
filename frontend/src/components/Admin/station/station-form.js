import React, { forwardRef, useEffect, useImperativeHandle, useState } from "react";
import { Autocomplete, TextField, Grid, Typography } from "@mui/material";
import { useLocation } from "react-router-dom";
import { useReducer } from "react";
import { globalFetchDataV2 } from "../../../services/services-tool.js";
import { API } from "../../../services/Api.js";
import { DragDropContext, Draggable } from "react-beautiful-dnd";
import { MdOutlineDragHandle } from "react-icons/md/index.esm.js";
import { StrictModeDroppable as Droppable } from "../../../utils/stricModeDroppabble.js";

function parseArrayOrStringifiedArray(input) {
    if (Array.isArray(input)) {
        return input;
    }

    try {
        const parsed = JSON.parse(input);
        if (Array.isArray(parsed)) {
            return parsed;
        }
    } catch (error) {
        // Not a valid JSON string
    }

    throw new Error('Input is not an array or a stringified array');
}


export const StationForm = forwardRef((props, ref) => {
    const location = useLocation();

    const [record, setRecord] = useState(location.state?.Stations || []);
    const [fetchedData, setData] = useState(location.state?.Stations || []);
    const [clinicFetchedData, setClinic] = useState(location.state?.Clinics || []);
    const [clinicPreselectedData, setClinicPreselectedData] = useState(null);
    const [error, setError] = useState(null);
    const [Station, setStation] = useState(
        location.state?.Station ? location.state.Station : {}
    );

    const arrayBeds = location.state?.Station?.BedArray ? parseArrayOrStringifiedArray(location.state?.Station?.BedArray) : [];
    const bedArrayFromString = location.state?.Station?.BedArray;
    let bedArray = bedArrayFromString ? JSON.parse(bedArrayFromString) : [];

    // Convert all values in bedArray to float
    bedArray = bedArray.map((value) => parseFloat(value));
    const [sortedBedNr, setSortedBedNr] = useState(arrayBeds);

    const [updateState, forceUpdate] = useReducer((x) => x + 1, 0);
    const [isLoading, setIsLoading] = useState(false);
    const [inputError, setInputError] = useState(false);
    const [BedNr, setBedNr] = useState(arrayBeds);

    const hansen = () => {
        console.log('hansen');
    }


    useEffect(() => {
            globalFetchDataV2(
            fetchedData,
            setData,
            API.StationV2.getAll,
            setIsLoading,
            setRecord,
            setError,
            true
        );

        globalFetchDataV2(
            clinicFetchedData,
            setClinic,
            API.ClinicV2.getAll,
            setIsLoading,
            setError,
            true
        );

       
              
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [updateState]);

    useEffect(() => {
        if(clinicFetchedData && Station?.ClinicID) {
            const v = clinicFetchedData.find((item) => item.ID.toString() === Station?.ClinicID.toString())
            if (v) {
                setClinicPreselectedData(v)                
            }
        }
    }, [clinicFetchedData, Station.ClinicID])

    
    /**
     * Retrieves the Station data
     * @returns The Station data
     */
    const getStation = () => {
        return Station;
    };

    const getSortedBedArray = () => {
        return sortedBedNr;
    };


    const getBedArray = () => {
        return BedNr;
    };

    /**
     * Forces a reload of the page
     */
    const setForceReload = () => {
        window.location.reload();
    };

    /**
     * Forces an update of the component
     */
    const setForceUpdate = () => {
        forceUpdate();
    };

    const cleanStation = () => {
        setStation([]);
        forceUpdate();
    };

    useImperativeHandle(ref, () => ({
        getStation,
        setForceReload,
        getSortedBedArray,
        getBedArray,
        setForceUpdate,
        cleanStation,
    }));

    

     /**
     * Handles the change event for form fields
     * @param event - The change event
     */
     const handleChange = (event) => {
        
        const targetName = event.target.name;
        const targetValue = event.target.value;
        
        setStation((prevStation) => ({
            ...prevStation,
            [targetName]: targetValue,
        }));
        setInputError(false);
    };

    /**
     * Returns the value if it's not null or undefined, otherwise returns an empty string
     * @param value - The value to check
     * @returns The value if not null or undefined, otherwise an empty string
     */
    const returnIfNotNullOrUndefined = (value) => {
        return value !== null && value !== undefined ? value : "";
    };
    const onDragEnd = (result) => {
        if (!result.destination) return;

        const newSortedBedNr = Array.from(sortedBedNr);
        const [removed] = newSortedBedNr.splice(result.source.index, 1);
        newSortedBedNr.splice(result.destination.index, 0, removed);
        setSortedBedNr(newSortedBedNr);

        // Update the bed order in Station object
        setStation((prevStation) => ({
            ...prevStation,
            "BedArray": newSortedBedNr,
        }));
    };

    const stationValue = () => {
        return [{
            name: 'Hamburg Medical Center',
            value: 0
        }]
    }

    return (
        <>

            <Grid container spacing={0.5} className="d-flex justify-content-center" sx={{ width: "80%" }}>
                
                <Grid item xs={12} md={6}>

                    { clinicFetchedData && Station &&
                        <Autocomplete
                            id="ClinicID-demo"
                            options={clinicFetchedData}
                            getOptionLabel={(option) => option.Name }// Set clinic name as the display option
                            getOptionKey={(option) => option.ClinicID} // Set clinic ID as the value option
                            
                            renderInput={(params) => (
                                <TextField
                                    {...params}
                                    label={"Clinic"}
                                    InputProps={{
                                        ...params.InputProps,
                                    }}
                                    InputLabelProps={{
                                        shrink: true,
                                    }}
                                />
                            )}
                            onChange={(event, newValue) => {
                                if (newValue === null || newValue === undefined){
                                    setData(record);
                                } else {
                                    const item = clinicFetchedData.find((item) => item.ID === newValue.ID);
                                    setStation((prevStation) => ({
                                        ...prevStation,
                                        "ClinicID": item ? item.ID : null,
                                    }));
                                }
                            }}
                            value = { clinicPreselectedData }                        
                        />

                    }
                
                
                </Grid>
                <Grid item xs={12} md={6}>
                    <TextField
                        className="mb-2"
                        id="StationName-Input"
                        label="Station Name"
                        variant="outlined"
                        name="Name"
                        onChange={handleChange}
                        defaultValue={returnIfNotNullOrUndefined(Station?.Name)}
                        fullWidth
                    />
                </Grid>
                <Grid item xs={12} md={6}>
                    <TextField
                        className="mb-2"
                        id="StationNr-Input"
                        label="Station N°"
                        variant="outlined"
                        name="StationNr"
                        onChange={handleChange}
                        defaultValue={returnIfNotNullOrUndefined(Station?.StationNr)}
                        fullWidth
                    />
                </Grid>
                <Grid item xs={12} md={6}>
                    <Autocomplete
                        multiple
                        id="tags-outlined"
                        options={typeof BedNr === "string" ? JSON.parse(BedNr) : BedNr}
                        getOptionLabel={(option) => option.toString()}
                        renderInput={(params) => (
                            <TextField {...params} label="Bed N°" placeholder="add another one!" />
                        )}
                        noOptionsText={"Add Bed Numbers which are in this Station!"}
                        onChange={(event, newValue) => {
                            if (newValue === null || newValue === undefined) {
                                setSortedBedNr(BedNr);
                            } else {
                                const newBedArray = [...newValue];
                                setStation((prevStation) => ({
                                    ...prevStation,
                                    BedArray: newBedArray,
                                }));
                                setSortedBedNr(newBedArray);
                            }
                        }}
                        freeSolo
                        value={sortedBedNr} // Add this line to set the value of the Autocomplete component
                    />
                </Grid>
                <Grid item xs={12}>
                    {!location.state?.editingsmode ?
                        <DragDropContext onDragEnd={onDragEnd}>
                            <Droppable droppableId="bedNumbers">
                                {(provided) => (
                                    <div ref={provided.innerRef} {...provided.droppableProps} className="d-flex justify-content-center flex-column p-2 border border-dark">
                                        {sortedBedNr.map((bed, index) => (
                                            <Draggable key={bed} draggableId={bed} index={index}>
                                                {(provided, snapshot) => (
                                                    <div
                                                        ref={provided.innerRef}
                                                        {...provided.draggableProps}
                                                        {...provided.dragHandleProps}
                                                        style={{
                                                            ...provided.draggableProps.style,
                                                            display: "flex",
                                                            alignItems: "center",
                                                            marginBottom: "8px",
                                                            background: snapshot.isDragging ? "lightblue" : "white",
                                                        }}
                                                    >
                                                        <MdOutlineDragHandle
                                                            style={{ marginRight: "8px", cursor: "grab" }}
                                                        />
                                                        <Typography variant="body1" style={{ flexGrow: 1 }}>
                                                            {index + 1} - Bed N°: <span className="fw-bolder">{bed}</span>
                                                        </Typography>
                                                    </div>
                                                )}
                                            </Draggable>
                                        ))}
                                        {provided.placeholder}
                                    </div>
                                )}
                            </Droppable>
                        </DragDropContext>
                        : null}
                </Grid>
            </Grid>
        </>
    );
});
