import { Alert, Snackbar } from '@mui/material';
import Swal from 'sweetalert2'

export function CustomSnackbar({ open, handleClose, message, severity, autoHide }) {
    return (
      <Snackbar open={open} 
                autoHideDuration={autoHide} onClose={handleClose}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}>
        <Alert onClose={handleClose} severity={severity} sx={{ width: '100%' }}>
          {message}
        </Alert>
      </Snackbar>
    );
  }

export function DialogSuccessSaved(target, navigateTo, nextFunction) {
    if (target === null) return;
    Swal.fire({
        title: `<strong>${target} successfully saved!</strong>`,
        icon: 'success',
        html:
            `The <b>${target}</b>,` +
            ' has been successfully saved. Thank you for your work!',
        showCloseButton: true,
        showCancelButton: true,
        focusConfirm: false,
        confirmButtonText:
            '<AiOutlineDatabase size={35} /> Master Data',
        confirmButtonAriaLabel: 'Master Data',
        cancelButtonText:
            '<i className="fa fa-thumbs-down">Create More</i>',
        cancelButtonAriaLabel: 'Create More',
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
    }).then((result) => {
        if (result.isConfirmed) {
            navigateTo();
        }
        else {
            nextFunction();
        }
    })
}

export function DialogSuccessUpdated(target, navigateTo) {
    if (target === null) return;
    Swal.fire({
        title: `<strong>${target} successfully updated!</strong>`,
        icon: 'success',
        html:
            `The <b>${target}</b>,` +
            ' has been successfully updated. Thank you for your work!',
        showCloseButton: true,
        showCancelButton: false,
        focusConfirm: false,
        confirmButtonText:
            '<AiOutlineDatabase size={35} /> Master Data',
        confirmButtonAriaLabel: 'Master Data',
        confirmButtonColor: '#3085d6',
    }).then((result) => {
        if (result.isConfirmed) {
            navigateTo();
        }
    })
}


export function DialogSuccessDone(target, nextFunction) {
    if (target === null) return;
    Swal.fire({
        title: `<strong>${target} successfully completed!</strong>`,
        icon: 'success',
        html:
            `The <b>${target}</b>,` +
            ' has been successfully completed. Thank you for your work!',
        showCloseButton: true,
        showCancelButton: false,
        focusConfirm: false,
        confirmButtonText:
            '<AiOutlineDatabase size={35} /> All Clear',
        confirmButtonAriaLabel: 'All Clear',
        confirmButtonColor: '#3085d6',
    }).then((result) => {
        if (result.isConfirmed) {
            nextFunction();
        }
    })
}

export function DialogConfirmation(target, confirmationDialog, nextFunction) {
    if (target === null) return;
    Swal.fire({
        title: `<strong>${target} Confirmation!</strong>`,
        icon: 'warning',
        html:
            `${confirmationDialog}`,
        showCloseButton: true,
        showCancelButton: true,
        focusConfirm: false,
        confirmButtonText: 'Yes, confirm',
        confirmButtonAriaLabel: 'Yes, confirm',
        cancelButtonText: 'No, cancel',
        cancelButtonAriaLabel: 'No, cancel',
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#EB144C',
    }).then((result) => {
        if (result.isConfirmed) {
            nextFunction();
        }
    })
}

export function DialogWarning(fehlenderElement) {
    if (fehlenderElement === null) return;
    Swal.fire({
        icon: 'warning',
        title:
            `Please add a <b>${fehlenderElement}</b>` +
            ' before proceeding.',
        width: 600,
        padding: '3em',
        color: '#000000',
        confirmButtonText: 'Got it!',
        confirmButtonColor: '#3085d6',
        backdrop: `
              rgba(0,0,123,0.4)
              left top
              no-repeat
            `
    })
}

export function DialogWarningMessage(message) {
    if (message === null) return;
    Swal.fire({
        icon: 'warning',
        title:
            `<b>${message}</b>`,
        width: 600,
        padding: '3em',
        color: '#000000',
        confirmButtonText: 'Got it!',
        confirmButtonColor: '#3085d6',
        backdrop: `
              rgba(0,0,123,0.4)
              left top
              no-repeat
            `
    })
}

export function DialogWarningMessageWithTitle(Title, message) {
    if (message === null) return;
    Swal.fire({
        icon: 'warning',
        title:
            `<b>${Title}</b>`,
        html:
            `<b>${message}</b>`,
        width: 600,
        padding: '3em',
        color: '#000000',
        confirmButtonText: 'Got it!',
        confirmButtonColor: '#3085d6',
        backdrop: `
              rgba(0,0,123,0.4)
              left top
              no-repeat
            `
    })
}

export function BestaetigungDialog(Title, message, nextFunction) {
    if (Title === null) return;
    Swal.fire({
        title: `<strong>${Title}</strong>`,
        icon: 'warning',
        html: `${message}`,
        showCloseButton: true,
        showCancelButton: true,
        focusConfirm: false,
        confirmButtonText: 'Yes, confirm',
        confirmButtonAriaLabel: 'Yes, confirm',
        cancelButtonText: 'No, cancel',
        cancelButtonAriaLabel: 'No, cancel',
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#EB144C',
        appendToBody: true
    }).then((result) => {
        if (result.isConfirmed) {
            nextFunction();
        }
    })
}

export function BuchungBestaetitung(target, nextFunction) {
    if (target === null) return;
    Swal.fire({
        title: `<strong>Confirmation of Booking ${target}</strong>`,
        icon: 'warning',
        html:
            `Are you sure you want to book this list in ${target}?`,
        showCloseButton: true,
        showCancelButton: true,
        focusConfirm: false,
        confirmButtonText: 'Yes, confirm',
        confirmButtonAriaLabel: 'Yes, confirm',
        cancelButtonText: 'No, cancel',
        cancelButtonAriaLabel: 'No, cancel',
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#EB144C',
        appendToBody: true
    }).then((result) => {
        if (result.isConfirmed) {
            nextFunction();
        }
    })
}

export function WarningWithFunctions(Title, message, nextFunction) {
    if (message === null) return;
    Swal.fire({
        title: `<strong>${Title}</strong>`,
        icon: 'warning',
        html: `${message}`,
        showCloseButton: true,
        showCancelButton: true,
        focusConfirm: false,
        confirmButtonText: 'Got it!',
        confirmButtonAriaLabel: 'Got it!',
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#EB144C',
        appendToBody: true
    }).then((result) => {
        if (result.isConfirmed) {
            nextFunction();
        }
    })
}

export function DialogSuccessReported(target, navigateTo) {
    if (target === null) return;
    Swal.fire({
        title: `<strong>${target} successfully reported!</strong>`,
        icon: 'success',
        html:
            `The <b>${target}</b>,` +
            ' was successfully reported. Thank you for your work!',
        showCloseButton: true,
        showCancelButton: false,
        focusConfirm: false,
        confirmButtonText: 'Overview',
        confirmButtonAriaLabel: 'Overview',
        confirmButtonColor: '#3085d6',
    }).then((result) => {
        if (result.isConfirmed) {
            navigateTo();
        }
    })
}



export function showError(errorMessage) {
    Swal.fire({
      icon: 'error',
      title: 'Error',
      text: errorMessage,
      confirmButtonColor: '#3085d6',
      confirmButtonText: 'OK',
    });
  }