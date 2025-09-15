import React, { useEffect, useState } from 'react'

import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TablePagination from '@mui/material/TablePagination';
import TableRow from '@mui/material/TableRow';

import { API } from '../../../services/Api.js';
import { globalFetchDataV2 } from '../../../services/services-tool.js';
import {  Button, ButtonGroup, Grid, Paper, Stack, Tooltip } from '@mui/material';
import { EditIcon, DetailsIcon, DoneIcon, RestIcon, DeletIcon, newElemenetIcon } from '../../../utils/global-icons.js';
import { AdmissionDetailsModal } from './admission-details-modal.js';
import { DialogConfirmation } from '../../../utils/dialog-notifications.js';

const columns = [
  { id: 'Title', label: 'Title', minWidth: 170 },
  { id: 'Description', label: 'Description', minWidth: 100 },
  { id: 'Type', label: 'Type', minWidth: 170 }
];


const AdmissionTasksView = () => {
  const [tasks, setTasks] = useState([]);
  const [details, setDetails] = useState(null);
  const [isLoading, setIsLoading] = useState([]);

  const setTasksSecondData = (data) => {
    console.log("setTasksSecondData: ", data);    
  }

  const setError = (e) => {
    console.log(e)
  }

  useEffect(() => {
    loadTasks();
  }, [])

  const loadTasks = () => {
    globalFetchDataV2(tasks, setTasks, () => API.TasksV2.getAdmissionTasks(), setIsLoading, setTasksSecondData, setError, true);
  }

  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(25);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(event.target.value);
    setPage(0);
  };

  const onSaveHandler = async(action, formData) => {
    
    let response;
    switch(action) {
      case 'create':        
        response = await API.TasksV2.createAdmissionTask(formData).catch( (error) => {          
          setError(() => {
              setIsLoading(false);
              return error
          });
          setIsLoading(false);
          return;
        });        
        break;

      case 'edit':
        response = await API.TasksV2.updateAdmissionTask(formData.ID, formData).catch( (error) => {
          setError(() => {
              setIsLoading(false);
              return error
          });
          setIsLoading(false);
          return;
        });
        break;
      default:
        
    }

    if(response && response.data) {
      loadTasks()
      setDetails(null)
    }
  }

  const onDeleteHandler = (data) => {
    DialogConfirmation('DELETE', `Are you sure you want to delete this task: ${data?.Title}?`,
      async () => {
        const response = await API.TasksV2.deleteAdmissionTask(data.ID).catch( (error) => {
          setError(() => {
              setIsLoading(false);
              return error
          });
          setIsLoading(false);          
          return;
        });

        if(response && response.data) {
          loadTasks()
        }        
      });
  }

  return (
    <Grid container spacing={2} sx={{p:2}}>  
      <AdmissionDetailsModal details={details} onSave={onSaveHandler} onClose={ () => setDetails(null)} />
      <Grid item xs={12}>
        <Stack direction="row" spacing={1} sx={{ justifyContent: "space-between", alignItems: "flex-start" }}>
          <h4>Admission Todos</h4>
          <Button
            variant="outlined"
            startIcon={newElemenetIcon}
            onClick={() => setDetails({ Title: 'CREATE', action: 'create' })}
          >NEW</Button>
        </Stack>

        <TableContainer sx={{ mt:2, maxHeight: 'calc(100vh - 350px)' }} component={Paper}>
          <Table stickyHeader aria-label="sticky table" size="sm">
            <TableHead>
              <TableRow>
                {columns.map((column) => (
                  <TableCell
                    key={Math.random().toString()}
                    align={column.align}
                    style={{ minWidth: column.minWidth }}
                  >
                    {column.label}
                  </TableCell>
                  
                ))}
                <TableCell style={{ width: 120 }} align="right">
                  Aktion
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              { tasks && tasks.length > 0 &&
                tasks.filter((item) => !item.Processed)
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((row, index) => {
                  return (
                    <TableRow hover role="checkbox" tabIndex={-1} key={Math.random().toString()}>
                      {columns.map((column) => {
                        const value = row[column.id];
                        return (
                          <TableCell key={column.id} align={column.align}>
                            {column.format && typeof value === 'number'
                              ? column.format(value)
                              : value}
                          </TableCell>
                        );
                      })}
                      <TableCell key={`edit-${index}`}>                        
                        <Stack direction="row" spacing={1} sx={{ justifyContent: "space-around", alignItems: "center" }}>
                          <ButtonGroup>
                            <Button
                              variant="outlined"
                              startIcon={DetailsIcon}
                              onClick={() => setDetails({ action: 'show', Title: 'QUICKVIEW', data: row })}
                            />                            
                            <Button
                              variant="outlined"
                              startIcon={EditIcon}
                              onClick={() => setDetails({ action: 'edit', Title: 'EDIT Task', data: row })}
                            />
                            
                            <Button
                              variant="outlined"
                              startIcon={DeletIcon}
                              onClick={() => onDeleteHandler(row)}
                            />
                            
                          </ButtonGroup>
                          
                        </Stack>
                      </TableCell>
                    </TableRow>
                  );
                })
              }
              { (!tasks || tasks?.length === 0 || tasks.filter((item) => !item.Processed).length === 0) &&
                (
                  <TableRow>
                    <TableCell colSpan={columns.length + 1} align="center">
                      All Tasks done
                    </TableCell>
                  </TableRow>
                )
              }
            </TableBody>
          </Table>
        </TableContainer>
      </Grid>

    { tasks && tasks.length > 0 && 
      <TablePagination
        rowsPerPageOptions={[5, 10, 25, 100, 500]}
        component="div"
        count={tasks.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />
    }
      
    </Grid>
  );

}


export default AdmissionTasksView
