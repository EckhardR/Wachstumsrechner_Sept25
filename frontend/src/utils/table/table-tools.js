import { Autocomplete, Button, CircularProgress, IconButton, Typography, createFilterOptions } from "@mui/material";
import { useNavigate } from "react-router-dom";
import React from "react";
import { TextField } from "@mui/material";
import { DialogWarning } from "../dialog-notifications.js";
import { FcNext, FcPrevious } from "react-icons/fc/index.esm.js";

export const CancelButton = () => {
    const navigate = useNavigate();
    return <Button
                variant="contained"
                component="label"
                color='error'
                style={{
                    position: 'absolute',
                    top: 0,
                    right: 10,
                    zIndex: 100,
                    width: '20vh',
                    marginTop: "110px"
                }}
                onClick={() => { navigate(-1) }}>Back</Button >
};

export const NavigationsButton = ({ path, startIcon, className, endIcon, inhalt, color, style, customerColor }) => {
    const navigate = useNavigate();
    return <Button
        onClick={() => navigate(path)}
        className={className}
        variant="contained"
        color={color}
        style={style}
        startIcon={startIcon}
        >{inhalt}</Button>
};

export const LoginButton = ({ path, startIcon, className, label, color, style }) => {
    const navigate = useNavigate();
    return <Button
        onClick={() => navigate(path)}
        className={className}
        variant="contained"
        color={color}
        style={style}
        startIcon={startIcon}
        >{label}</Button>
};

export function returnIfNotNullOrUndefined(input) {
    if (input !== undefined && input !== 'undefined' && input !== null && input !== 'null') {
        return input;
    } else
        return ''
}

export const optionWithoutDuplicates = (data, attribut) => {
    if (data?.length === 0) return [];
    return [...new Set(data.map((element) => element[attribut]))];
};


export function hasEmptyAttribute(obj, attribute) {
    return obj[attribute] === undefined || obj[attribute] === null || obj[attribute] === '' || obj[attribute]?.length === 0;
}

export function checkRequiredProperties(obj, properties) {
    const missingProperties = properties.filter(({ key }) => hasEmptyAttribute(obj, key));
    if (missingProperties.length > 0) {
        DialogWarning(missingProperties.map(item => item['label'])?.join());
        return false;
    } else return true;
}



export default function LoadingSpinner() {
    return <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        textAlign: 'center',
        minHeight: '80vh',
        backgroundColor: 'rgba(149, 213, 233, 0.05)',
    }}>
        <CircularProgress size={50} />
    </div>

}



/**
 * AutocompleteInput is a component that allows users to search and select from a list of options.
 * The component also supports the creation of new options dynamically.
 *
 * @param {array} options - An array of options to display in the autocomplete dropdown.
 * @param {function} setInput - A function that sets the input value for the selected option.
 * @param {string} nameOfInput - The name of the input field that the selected option will be set to.
 */
export function AutocompleteInput({ options, setInput, nameOfInput, labelName, defaultValueAttribute }) {
    // createFilterOptions is a function from the Autocomplete component that helps filter options based on user input
    const filter = createFilterOptions();
    return (
        <Autocomplete
            className="mb-2"
            options={options}
            // getOptionLabel is a function that determines how the options should be displayed in the dropdown
            getOptionLabel={(option) => {
                // Value selected with enter, right from the input
                if (typeof option === "string") {
                    return option;
                }
                // Add "xxx" option created dynamically
                if (option.inputValue) {
                    return option.inputValue;
                }
                if (typeof option === "number") {
                    return option.toString();
                }
                // Regular option
                return option;
            }}
            // onChange is a function that is called when the user selects an option from the dropdown or inputs a new value
            onChange={(event, newValue) => {
                if (newValue && newValue.inputValue) {
                    // Create a new value from the user input
                    setInput(newValue.inputValue, nameOfInput);
                } else {
                    setInput(newValue, nameOfInput);
                }
            }}
            // filterOptions is a function that filters the options based on the user input
            filterOptions={(options, params) => {
                const filtered = filter(options, params);
                // params is an object that contains information about the user input, such as the input value
                const { inputValue } = params;
                // Suggest the creation of a new value if the input value is not an existing option
                const isExisting = options.some((option) => inputValue === option);
                if (inputValue !== "" && !isExisting) {
                    filtered.push(inputValue);
                }
                return filtered;
            }}
            // renderInput is a function that determines how the input field should be rendered
            renderInput={(params) => (
                <TextField {...params} label={labelName} variant="outlined" fullWidth />
            )}
            defaultValue={defaultValueAttribute}
        />
    );
}

export const DateNavigationButton = ({ date, onPreviousDay, onNextDay }) => {
    const options = { year: 'numeric', month: 'numeric', day: 'numeric' };
    const today = new Intl.DateTimeFormat('en-US', options).format(new Date());
    const isToday = date === today;

    return (
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', justifyItems: "center", justifySelf: 'center' }}>
            <IconButton className="border" onClick={onPreviousDay}><FcPrevious size={20} /></IconButton>
            <Typography variant="h6" sx={{mr:1, ml:1}}>{date}</Typography>
            {!isToday ? (
                <IconButton className="border" onClick={onNextDay}><FcNext size={20} /></IconButton>
            ) : <IconButton className="border" onClick={onNextDay} disabled><FcNext size={20} /></IconButton>}
        </div>
    );
};


export const DateInputs = ({
    startDate,
    setStartDate,
    endDate,
    setEndDate,
  }) => {
    const handleStartDateChange = (event) => {
      const formattedDate = formatDate(event.target.value);
      setStartDate(formattedDate);
      if (!endDate) {
        setEndDate(formattedDate);
      }
    };
  
    return (
      <div className="d-flex flex-row">
        <TextField
          id="start-date"
          label="Start Date"
          type="date"
          value={startDate}
          onChange={handleStartDateChange}
        />
        <TextField
          id="end-date"
          label="End Date"
          type="date"
          value={endDate}
          onChange={(event) => setEndDate(formatDate(event.target.value))}
        />
      </div>
    );
  };
  
  export const formatDate = (date) => {
    const options = { year: "numeric", month: "2-digit", day: "2-digit" };
    return new Date(date)
      .toLocaleDateString("en-US", options)
      .replace(/(\d+)\/(\d+)\/(\d+)/, "$3-$1-$2");
  };