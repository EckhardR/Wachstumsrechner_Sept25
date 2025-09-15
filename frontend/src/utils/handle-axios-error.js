import {
    Dialog,
    DialogContent,
    DialogContentText,
    DialogTitle,
    IconButton,
} from "@mui/material";
import { useState } from "react";
import { AiOutlineClose } from "react-icons/ai/index.esm.js";

export default function HandleAxiosError({ error }) {
    const [open, setOpen] = useState(true);

    const handleClose = () => {
        setOpen(false);
    };
    let errorMessage = "An unknown error occurred";
    let errorTitle = "Error";

    if (!error || error.length === 0) return;

    if (error.response) {
        // The request was made and the server responded with a status code
        // that falls out of the range of 2xx
        errorMessage = error.response.data.error;
        errorTitle = `Error ${error.response.status}: ${error.response.data ? error.response.data : error.response.statusText}`;
    } else if (error.request) {
        // The request was made but no response was received
        // `error.request` is an instance of XMLHttpRequest in the browser and an instance of
        // http.ClientRequest in node.js
        errorMessage = "No response received";
        errorTitle = "Error";
    } else if (error.message === "Network Error") {
        errorMessage = "Could not establish a connection to the server";
        errorTitle = "Network Error";
    } else if (error.config && error.config.url) {
        // Axios request was cancelled
        errorMessage = `The request to ${error.config.url} was canceled.`;
        errorTitle = "Error";
    } else if (error.code === "ECONNABORTED") {
        // Axios request timeout
        errorMessage = "The request has timed out.";
        errorTitle = "Error";
    } else if (error.response && error.response.status === 401) {
        errorMessage = "You are not authorized to perform this action";
        errorTitle = "Authentication Error";
    } else if (error.response && error.response.status === 403) {
        errorMessage = "You do not have permission to access this resource";
        errorTitle = "Access Denied";
    } else if (error.response && error.response.status === 429) {
        errorMessage =
            "Too many requests in a short period. Please try again later";
        errorTitle = "Too Many Requests";
    } else if (error.response && error.response.status === 422) {
        errorMessage = "The entered data is invalid";
        errorTitle = "Validation Error";
    } else {
        errorMessage = error.message;
        errorTitle = "Error";
    }

    // Display error message
    return (
        <div>
            <Dialog
                onClose={handleClose}
                aria-labelledby="customized-dialog-Title"
                open={open}
            >
                <BootstrapDialogTitle onClose={handleClose}>
                    {errorTitle}
                </BootstrapDialogTitle>
                <DialogContent>
                    <DialogContentText>{errorMessage}</DialogContentText>
                </DialogContent>
            </Dialog>
        </div>
    );
}



export function BootstrapDialogTitle(props: DialogTitleProps) {
    const { children, onClose, ...other } = props;
  
    return (
      <DialogTitle sx={{ m: 0, p: 2 }} {...other}>
        {children}
        {onClose ? (
          <IconButton
            aria-label="close"
            onClick={onClose}
            sx={{
              position: "absolute",
              right: 8,
              top: 8,
              color: (theme) => theme.palette.grey[500],
            }}
          >
            <AiOutlineClose />
          </IconButton>
        ) : null}
      </DialogTitle>
    );
  }