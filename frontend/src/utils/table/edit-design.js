import * as React from 'react';
import { Button, Grid, Typography } from "@mui/material";
import { GrUpdate } from "react-icons/gr/index.esm.js";
import { ButtonCancel, ButtonFirst } from '../global-variables.js';

type Props = {
    Title: string,
    children?: any,
    cancel?: () => any,
    handleSave?: () => any,
    disableButtons?: boolean
};

export const EditDesign = (props: Props) => {
    return (
        <>
            <Grid container spacing={2} className="p-2">
                <Typography
                    sx={{ flex: "1 1 100%" }}
                    variant="h6"
                    id="tableTitle"
                    component="div"
                    className="d-flex justify-content-center p-2"
                >
                    {props.Title}
                </Typography>

                <Grid item container xs={12} className="border p-1" sx={{ marginLeft: 0.4 }} alignItems={"center"} justifyContent={"center"}>
                    {props.children}

                    {props.disableButtons ? <> </> :
                        <Grid item container xs={6} className="p-2" sx={{ marginLeft: 0.4 }}>
                            <EditButtons handleSave={props.handleSave} cancel={props.cancel} />
                        </Grid>
                    }

                </Grid>
            </Grid>
        </>
    );
}

export const EditButtons = ({ cancel, handleSave }) => {
    return (
        <>
            <Grid item container sx={{ margin: 1 }}>
                <Grid item xs={6}>
                    <Button
                        variant="contained"
                        className=" rounded-pill"
                        onClick={handleSave}
                        style={{ width: "95%", marginLeft: "2vh" }}
                    >
                        <GrUpdate size={20} style={{ marginRight: "1vh", backgroundColor: ButtonFirst }} /> Update
                    </Button>
                </Grid>

                <Grid item xs={6}>
                    <Button
                        color="error"
                        variant="contained"
                        className=" rounded-pill"
                        onClick={cancel}
                        style={{ width: "95%", marginLeft: "2vh", border: '1px solid ' + ButtonCancel, background: 'none', color: ButtonCancel }}
                    >
                        Cancel
                    </Button>
                </Grid>
                

            </Grid>
        </>
    );
}

export const CustomerButtons = ({ cancel, handleSave, saveButtonContent }) => {
    return (
        <>
            <Grid item container sx={{ margin: 1 }}>
                <Grid item xs={6}>
                    <Button
                        color="error"
                        variant="contained"
                        className=" rounded-pill"
                        onClick={cancel}
                        style={{ width: "95%", marginLeft: "2vh", backgroundColor: ButtonCancel }}
                    >
                        Cancel
                    </Button>
                </Grid>
                <Grid item xs={6}>
                    <Button
                        variant="contained"
                        className=" rounded-pill"
                        onClick={handleSave}
                        style={{ width: "95%", marginLeft: "2vh", backgroundColor: ButtonFirst }}
                    >
                        {saveButtonContent}
                    </Button>
                </Grid>

            </Grid>
        </>
    );
}
