import React, { useEffect, useState } from 'react'
import { Box, FormControl, FormHelperText, Grid, InputLabel, MenuItem, Stack, Select, TextField } from "@mui/material";
import { Modal } from "react-bootstrap";
import Button from "react-bootstrap/esm/Button.js";
import { ButtonFirst } from "../../../utils/global-variables.js";
import { DoneIcon } from '../../../utils/global-icons.js';

export const RoutineDetailsModal = (props) => {

  const defaultState = {
    Title: '',
    Description: '',
    Type: 'routine'
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
  const [minFillOut, setMinFillOut] = useState(true);
  
  const isFormValid = () => {
    setTitleError(formData.Title.length <= 1)
    setDescriptionError(formData.Description.length <= 1)
    setTypeError(formData.Type.length <= 1)

    const err = [formData.Title, formData.Description, formData.Type]

    const valid1 = err.every((item) => {
      return item.length >= 2
    })

    const list = [
      formData.DayOfLife,
      formData.LowerWeekLimit,
      formData.UpperWeekLimit,
      formData.LowerBirthWeight,
      formData.UpperBirthWeight,
      formData.TaskStartPostmenstrualAge
    ]

    const valid2 = list.some((item) => {
      return Number(item) > 0
    })

    
    setMinFillOut(valid2)
    
    return valid1 && valid2
  }

  const onSaveHandler = async() => {
    if (isFormValid()) {
      onSave(action, formData)      
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
      size="xl"
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
          { /* details && <p style={{fontSize: '8px'}}>{ JSON.stringify(formData)}</p> */ }
          </Modal.Title>
      </Modal.Header>
      <Modal.Body>
          
        <Stack direction="row" spacing={2}>
          <Box component="section" sx={{ py: 2, px:1, flex:0.5, border: '1px solid #ffffff00' }}>
            <Grid container spacing={1}>
              <Grid item xs={12}>
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

              <Grid item xs={12}>
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
                  minRows={5}
                  onChange={handleChange}
                  value={formData.Description || ''}
                  fullWidth
                  error={DescriptionError}
                  helperText={
                    DescriptionError? 'Please enter a Description' : ''
                  }
                />
              </Grid>

              <Grid item xs={12}>
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
              
            </Grid>
          </Box>
          <Box component="section" sx={{ py: 2, px:1, m:0, flex:1, border: minFillOut === true ? '1px solid #ffffff00' :  '1px solid #d32f2f'}}>
            <Grid container spacing={1}>

            <Grid item xs={6}>
                <TextField 
                  id="DayOfLife-Input"
                  className="mb-3"
                  name="DayOfLife"
                  label="Day Of Life (Lt)"
                  type="number"
                  variant={action === 'show' ? 'standard' : 'outlined'}              
                  size={SIZE}
                  fullWidth
                  InputLabelProps={{ shrink: true}}
                  InputProps={{ readOnly: action === 'show', pattern: '[0-9]' }}
                  onChange={handleChange}
                  value={formData.DayOfLife || ''}                  
                />
              </Grid>

              <Grid item xs={6}>
                <TextField 
                  id="TaskStartPostmenstrualAge-Input"
                  className="mb-3"
                  name="TaskStartPostmenstrualAge"
                  label="Task Postmenstrual Age (PMA)"
                  type="number"
                  variant={action === 'show' ? 'standard' : 'outlined'}              
                  size={SIZE}
                  fullWidth
                  InputLabelProps={{ shrink: true}}
                  InputProps={{ readOnly: action === 'show', pattern: '[0-9]' }}
                  onChange={handleChange}
                  value={formData.TaskStartPostmenstrualAge || ''}
                  helperText="Task from which postmenstrual age"
                />
              </Grid>
              

              <Grid item xs={12}>
                <TextField 
                  id="LowerWeekLimit-Input"
                  className="mb-3"
                  name="LowerWeekLimit"
                  label="Lower Pregnancy/Gestational Age Limit (uGA)"
                  type="number"
                  variant={action === 'show' ? 'standard' : 'outlined'}              
                  size={SIZE}
                  fullWidth
                  InputLabelProps={{ shrink: true}}
                  InputProps={{ readOnly: action === 'show', pattern: '[0-9]' }}
                  onChange={handleChange}
                  value={formData.LowerWeekLimit || ''}
                  helperText="Lower limit for week of pregnancy / gestational age at birth"
                />
              </Grid>

              <Grid item xs={12}>
                <TextField 
                  id="UpperWeekLimit-Input"
                  className="mb-3"
                  name="UpperWeekLimit"
                  label="Upper Pregnancy/Gestational Age Limit (oGA)"
                  type="number"
                  variant={action === 'show' ? 'standard' : 'outlined'}              
                  size={SIZE}
                  fullWidth
                  InputLabelProps={{ shrink: true}}
                  InputProps={{ readOnly: action === 'show', pattern: '[0-9]' }}
                  onChange={handleChange}
                  value={formData.UpperWeekLimit || ''}   
                  helperText="Upper limit for week of pregnancy / gestational age at birth"
                />
              </Grid>

              <Grid item xs={12}>
                <TextField 
                  id="LowerBirthWeight-Input"
                  className="mb-3"
                  name="LowerBirthWeight"
                  label="Lower Birth Weight Limit (uG)"
                  type="number"
                  variant={action === 'show' ? 'standard' : 'outlined'}              
                  size={SIZE}
                  fullWidth
                  InputLabelProps={{ shrink: true}}
                  InputProps={{ readOnly: action === 'show', pattern: '[0-9]' }}
                  onChange={handleChange}
                  value={formData.LowerBirthWeight || ''}  
                  helperText="Lower limit birth weight"                
                />
              </Grid>
              

              <Grid item xs={12}>
                <TextField 
                  id="UpperBirthWeight-Input"
                  className="mb-3"
                  name="UpperBirthWeight"
                  label="Upper Birth Weight Limit (oG)"
                  type="number"
                  variant={action === 'show' ? 'standard' : 'outlined'}              
                  size={SIZE}
                  fullWidth
                  InputLabelProps={{ shrink: true}}
                  InputProps={{ readOnly: action === 'show', pattern: '[0-9]' }}
                  onChange={handleChange}
                  value={formData.UpperBirthWeight || ''}
                  helperText="Upper limit birth weight"
                />
              </Grid>
             
            </Grid>
            { !minFillOut && 
              <FormHelperText error fullWidth sx={{textAlign: 'center'}}>
                Please fill in at least one field
              </FormHelperText>
            }
          </Box>
        </Stack>

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
