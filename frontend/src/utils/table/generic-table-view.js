import * as React from 'react';
import { Box, Divider, Link, Paper, TableBody, TableCell, TableContainer, TableHead, TablePagination, TableRow, Toolbar, Typography } from "@mui/material";
import LoadingSpinner from './table-tools.js';
import HandleAxiosError from '../handle-axios-error.js';
import { Button, Table } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';

type Props = {
    elementCount: Number,
    createLink: string,
    linkState?: any,
    createText: string,
    tableTitle: string,
    error: string,
    header: () => any,
    toolbar: () => any,
    body: any,
    bodyMapper: (data: any) => any,
    disabledLink?: Boolean,
    isLoading?: Boolean,
};

export function GenericTableView(props: Props) {
    const [page, setPage] = React.useState(0);
    const [rowsPerPage, setRowsPerPage] = React.useState(50);
    const navigate = useNavigate();
    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };
    return (
        <>
            {props.isLoading ? <LoadingSpinner /> :
                <Box sx={{ width: "100%"}}>
                    <HandleAxiosError error={props.error} />
                    <Paper sx={{ width: "100%", backgroundColor: props?.backgroundColor, mb:4 }}>
                        {!props.toolbar && props.disabledLink && !props.tableTitle ? null :
                            <Toolbar
                                sx={{
                                    pl: { sm: 2 },
                                    pr: { xs: 1, sm: 1 },
                                }}
                                className='d-flex flex-row'
                            >
                                <Typography sx={{ flex: "1 1 100%" }} variant="h6" id="tableTitle" component="div" className={props.toolbar ? 'col-lg-2 col-md-3 col-sm-6' : 'col-12 d-flex justify-content-center' } >
                                    {props.tableTitle}
                                </Typography>
                                {props.toolbar ?
                                    props.toolbar() : null}
                                {!props.disabledLink ?
                                    <div className={!props.toolbar ? "col-lg-10 col-md-9 col-sm-6 d-flex justify-content-end" : "col-lg-4 col-md-4 col-sm-6  d-flex justify-content-end"}>
                                        <Button onClick={() => navigate(props.createLink, {state:props.linkState})}
                                            className={"btn btn-outline-primary"}
                                            variant='outlined'
                                            >
                                            {props.createText}

                                        </Button>
                                    </div> : null}
                            </Toolbar>}
                        <Divider />
                        <TableContainer sx={{ maxHeight: 700 }} aria-label="custom pagination table">
                            <Table sx={{ minWidth: 750 }} aria-labelledby="tableTitle" size={props.size ? props.size : 'medium'}>
                                <TableHead>
                                    <TableRow key={"header-table-generic"}>
                                        {props.header()}
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {props.body == null && <TableRow key={"Loader-0"}><TableCell colSpan={"100%"} align={"center"}><LoadingSpinner /></TableCell></TableRow>}
                                    {props.body != null && rowsPerPage > -1 ? props.bodyMapper(props.body.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)) : props.bodyMapper(props.body)}                                    
                                </TableBody>
                            </Table>
                        </TableContainer>
                        <TablePagination
                            labelRowsPerPage={props.footerText ? props.footerText : 'Rows per page'}
                            rowsPerPageOptions={[10, 50, 100, 200, 500, { value: -1, label: 'All' }]}
                            component="div"
                            count={props.elementCount ? props.elementCount : 0}
                            rowsPerPage={rowsPerPage}
                            page={page}
                            onPageChange={handleChangePage}
                            onRowsPerPageChange={handleChangeRowsPerPage}
                        />
                    </Paper>
                </Box>
                
                }
        </>
    );
}
