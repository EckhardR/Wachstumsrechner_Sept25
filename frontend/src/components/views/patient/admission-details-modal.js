import React, { useEffect, useState } from 'react'
import { FormControl, FormHelperText, Grid, InputLabel, MenuItem, Select, TextField } from "@mui/material";
import { Modal } from "react-bootstrap";
import Button from "react-bootstrap/esm/Button.js";
import { ButtonFirst } from "../../../utils/global-variables.js";
import { DoneIcon } from '../../../utils/global-icons.js';

export const AdmissionDetailsModal = (props) => {

  const formatDate = (dateString) => {
    if (!dateString) {
      return '';
    }
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  }

  const defaultState = {
    Title: '',
    Description: '',
    Type: 'admission'
  }

  const SIZE = 'small';
  const [formData, setFormData] = useState(defaultState);
  const [error, setError] = useState({Title: false})
  const [isLoading, setIsLoading] = useState(false);

  const { details, onSave, onClose} = props;

  const action = details?.action || '';
  const data = details?.data
  
  
  const handleChange = (event) => {  
    setFormData({
      ...formData,
      [event.target.name]: event.target.value
    });
  }

  const onDataLoaded = () => {    
    if (data) {
      setFormData(data);
    } else {
      setFormData(defaultState)
    }   
  }

  const [TitleError, setTitleError] = useState(false);
  const [DescriptionError, setDescriptionError] = useState(false);
  const [typeError, setTypeError] = useState(false);

  const isFormValid = () => {
    setTitleError(formData.Title.length <= 1)
    setDescriptionError(formData.Description.length <= 1)
    setTypeError(formData.Type.length <= 1)

    const err = [formData.Title, formData.Description, formData.Type]
    
    const valid =  err.every((item) => {
      return item.length >= 2
    })
    return valid
  }

  const onSaveHandler = async() => {
    if (isFormValid()) {
      props.onSave(action, formData)      
    }
  }

  useEffect(() => {
      onDataLoaded()
    }, [action])

  return (    
    <Modal
      show={props.details ? true : false}
      onClose={onClose}
      aria-labelledby="parent-modal-Title"
      aria-describedby="parent-modal-Description"
      size="lg"
    > 
      <Modal.Header closeButton onHide={onClose}>
        <Modal.Title className="d-flex flex-row">
          { details?.Title && 
            <h3>
              { details?.data?.Processed &&
                <span style={{ display: 'inline-block', marginRight: '8px' }}>{  DoneIcon  }</span>
              }             
              { details?.Title }
            </h3>
          }
          { /*  details && <p style={{fontSize: '8px'}}>{ JSON.stringify(formData)}</p> */ }
          </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        
        <Grid>
          <Grid item xs={6}>
            <TextField 
              id="Title-Input"
              className="mb-3"
              name="Title"
              label="Title"
              variant={action === 'show' ? 'standard' : 'outlined'}              
              size={SIZE}
              required
              fullWidth
              InputLabelProps={{ shrink: true}}
              InputProps={{ readOnly: action === 'show', pattern: '' }}
              onChange={handleChange}
              value={formData.Title || ''}
              error={TitleError}
              helperText={
                TitleError? 'Please enter a valid Title' : ''
              }
            />
          </Grid>

          <Grid item xs={6}>
            <TextField 
              id="Description-Input"
              className="mb-3"
              required
              label="Description"
              variant={action === 'show' ? 'standard' : 'outlined'}
              name="Description"
              size={SIZE}
              InputLabelProps={{ shrink: true }}
              InputProps={{ readOnly: action === 'show', pattern: '' }}
              multiline={true}
              minRows={4}
              onChange={handleChange}
              value={formData.Description || ''}
              fullWidth
              error={DescriptionError}
              helperText={
                DescriptionError? 'Please enter a Description' : ''
              }
            />
          </Grid>

          <Grid item xs={6}>            
            <FormControl
              size={SIZE}
              fullWidth
              className="mb-3"
            >
              <InputLabel id="type-select-label">Type</InputLabel>
              <Select
                labelId="type-select-label"
                id="type-select"
                name="type"
                label="Type"
                variant={action === 'show' ? 'standard' : 'outlined'}
                value={formData?.Type}
                onChange={handleChange}
                required
                disabled
                error={typeError}
              >
                <MenuItem value="" disabled><em>Select Type</em></MenuItem>
                <MenuItem value="admission">Admission</MenuItem>
                <MenuItem value="routine">Routine</MenuItem>
                <MenuItem value="individual">Individual</MenuItem>
              </Select>
              { typeError && <FormHelperText error={typeError}>Please select a type</FormHelperText> }
            </FormControl>
          </Grid>

          <Grid item xs={6}>
            <TextField 
              className="mb-3"
              id="Deadline-Input"
              label="Todo Date"
              variant={action === 'show' ? 'standard' : 'outlined'}
              name="Deadline"
              type="date"
              size={SIZE}
              InputLabelProps={{ shrink: true }}
              InputProps={{ readOnly: action === 'show', pattern: '' }}
              onChange={handleChange}
              value={formatDate(formData?.Deadline)}
              fullWidth              
            />
          </Grid>

        </Grid>
      </Modal.Body>
        <Modal.Footer>

        { action !== 'show' && 
          <Button
            variant="secondary"
            style={{ backgroundColor: ButtonFirst}}
            onClick={() => onSaveHandler()}
            // type="submit"
            className="btn btn-lg btn-block"
          >
            Save
          </Button>
        
        }

        <Button
          variant="outlined"
          // style={{ backgroundColor: ButtonCancel}}
          onClick={() => onClose()}
          className="btn btn-lg btn-block"
        >
          Close
        </Button>
      </Modal.Footer>      
    </Modal>
  );
};
