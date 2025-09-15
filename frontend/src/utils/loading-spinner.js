import {CircularProgress} from "@mui/material";

export default function LoadingSpinner({center}) {
    return <div className={center && {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        textAlign: 'center',
        minHeight: '50vh',
    }}>
        <CircularProgress/>
    </div>

}