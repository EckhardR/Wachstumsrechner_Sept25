import { BackgroundFourth } from "../../../utils/global-variables.js";
import {
  Autocomplete,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
} from "@mui/material";
import { Table } from "react-bootstrap";

export const createNewDataInChart = (handleChange) => {
  const bgColor = BackgroundFourth;
  return (
    <div className="d-flex justify-content-center row ">
      <TableContainer sx={{ p: 0, m: 0 }}>
        <Table size="small" aria-label="Patient Details">
          <TableHead sx={{ backgroundColor: bgColor }}>
            <TableRow>
              <TableCell>Weight</TableCell>
              <TableCell>Length</TableCell>
              <TableCell>HeadCircumference</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            <TableRow>
              <TableCell>
                <TextField
                  className="mb-2"
                  id="Weight-Input"
                  variant="outlined"
                  type="number"
                  name="Weight"                  
                  onChange={(e) => handleChange(e.target.name, e.target.value)}
                  InputLabelProps={{
                    shrink: true,
                  }}
                  fullWidth
                />
              </TableCell>
              <TableCell>
                <TextField
                  className="mb-2"
                  id="Length-Input"
                  variant="outlined"
                  type="number"
                  name="Length"
                  onChange={(e) => handleChange(e.target.name, e.target.value)}
                  InputLabelProps={{
                    shrink: true,
                  }}
                  
                  fullWidth
                />
              </TableCell>
              <TableCell>
                <TextField
                  className="mb-2"
                  id="HeadCircumference-Input"
                  variant="outlined"
                  type="number"
                  name="HeadCircumference"
                  onChange={(e) => handleChange(e.target.name, e.target.value)}
                  InputLabelProps={{
                    shrink: true,
                  }}
                  
                  fullWidth
                />
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </TableContainer>


      <TableContainer sx={{ p: 0, m: 0 }}>
        <Table size="small" aria-label="Patient Details">
          <TableHead sx={{ backgroundColor: bgColor }}>
            <TableRow>
              <TableCell>Procent Fat Mass</TableCell>
              <TableCell>Fat Mass</TableCell>
              <TableCell>Fat Free Mass</TableCell>
              <TableCell>Task Date</TableCell>
            </TableRow>
          </TableHead>


          <TableBody>
            <TableRow>
              <TableCell>
                <TextField
                  className="mb-2"
                  id="PercentFatFreeMass-Input"
                  variant="outlined"
                  type="number"
                  name="PercentFatFreeMass"
                  onChange={(e) => handleChange(e.target.name, e.target.value)}
                  InputLabelProps={{
                    shrink: true,
                  }}                  
                  fullWidth
                />
              </TableCell>
              <TableCell>
                <TextField
                  className="mb-2"
                  id="FatMass-Input"
                  variant="outlined"
                  name="FatMass"
                  type="number"
                  onChange={(e) => handleChange(e.target.name, e.target.value)}
                  InputLabelProps={{
                    shrink: true,
                  }}                  
                  fullWidth
                />
              </TableCell>
              <TableCell>
                <TextField
                  className="mb-2"
                  id="FatFreeMass-Input"
                  variant="outlined"
                  name="FatFreeMass"
                  onChange={(e) => handleChange(e.target.name, e.target.value)}
                  InputLabelProps={{
                    shrink: true,
                  }}
                  type="number"
                  fullWidth
                />
              </TableCell>
              <TableCell>
                <TextField
                  id="Task Date-Input"
                  className="mb-2"
                  variant="outlined"
                  name="date"
                  type="date"
                  onChange={(e) => handleChange(e.target.name, e.target.value)}
                  sx={{ padding: 0, margin: 0 }}
                  required
                  fullWidth
                />
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
};
