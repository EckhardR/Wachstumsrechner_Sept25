import * as React from "react";
import { styled, Tooltip, tooltipClasses } from "@mui/material";

export const HtmlTooltip = styled(({ className, ...props }) => (
    <Tooltip {...props} classes={{ popper: className }}></Tooltip>
))(({ theme }) => ({
    [`& .${tooltipClasses.tooltip}`]: {
        backgroundColor: "#f5f5f9",
        color: "rgba(0, 0, 0, 0.87)",
        maxWidth: 500,
        fontSize: theme.typography.pxToRem(12),
        border: "1px solid #dadde9",
    },
}));