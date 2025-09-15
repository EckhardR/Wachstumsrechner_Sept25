import React, { useState } from 'react'

import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TablePagination from '@mui/material/TablePagination';
import TableRow from '@mui/material/TableRow';

import {  Button, ButtonGroup, Paper, Stack, Tooltip } from '@mui/material';
import { EditIcon, DetailsIcon, RestIcon, DoneIcon, DeletIcon } from '../../../utils/global-icons.js';

import { useTranslation } from "react-i18next";



const TasksViewTable = ({columns, tasks, setTaskDone, setDetails, onDeleteHandler}) => {
  const { t } = useTranslation();
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(500);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(event.target.value);
    setPage(0);
  };

  return (
    <>
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
                Action
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>

          { tasks && tasks.length > 0 &&
            tasks.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
            .sort(function(a,b){
              return new Date(a.ProcessedAt) - new Date(b.ProcessedAt);
            })
            .sort(function(a,b){
              return new Date(a.Deadline) - new Date(b.Deadline);
            })
            .map((row, index) => {
              return (
                <TableRow hover role="checkbox" tabIndex={-1} key={Math.random().toString()}>
                  {columns.map((column) => {
                    const value = row[column.id];
                    let fValue = value;
                    
                    if (column.format && column.format === 'formatDate') {
                      fValue = new Date(value).toLocaleDateString('de-DE', {
                        year: 'numeric',
                        month: '2-digit',
                        day: '2-digit'                        
                      });
                      if(!value || value === '') {
                        fValue = 'unknown'
                      }
                    }

                    if (column.format && column.format === 'formatDateTime') {
                      fValue = new Date(value).toLocaleDateString('de-DE', {
                        year: 'numeric',
                        month: '2-digit',
                        day: '2-digit',
                        hour: '2-digit',
                        minute: '2-digit',
                        second: '2-digit',
                      });
                      fValue = fValue.replace(',', ' ');
                      fValue += 'Uhr';
                    }

                    return (
                      <TableCell key={column.id} align={column.align}>
                        {fValue}
                      </TableCell>
                    );
                  })}
                  <TableCell key={`edit-${index}`}>
                    <Stack direction="row" spacing={1} sx={{ justifyContent: "flex-start", alignItems: "center" }}>
                      <Tooltip title="Restore form archive">
                        <Button
                          variant="plane"
                          startIcon={row.Processed === 1? RestIcon : DoneIcon}
                          onClick={() => setTaskDone(row, row.Processed !== 1)}
                        />
                      </Tooltip>
                      <ButtonGroup>
                        <Button
                          variant="outlined"
                          startIcon={DetailsIcon}
                          onClick={() => setDetails({ action: 'show', Title: 'QUICKVIEW', data: row })}
                        />
                      
                        <Button
                          variant="outlined"
                          startIcon={EditIcon}
                          onClick={() => setDetails({ action: 'edit', Title: 'Edit task', data: row })}
                        />
                        
                        <Button
                          variant="outlined"
                          startIcon={DeletIcon}
                          onClick={ () => onDeleteHandler(row)}
                        />
                      </ButtonGroup>
                    </Stack>
                  </TableCell>
                </TableRow>
              );
            })
          }
          </TableBody>
        </Table>
      </TableContainer>
      { tasks && tasks.length > 0 && 
        <TablePagination
          rowsPerPageOptions={[2, 5, 10, 25, 100, 500]}
          component="div"
          count={tasks.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      }
    </>
  );

}


export default TasksViewTable
