import { Table } from "@material-ui/core"
import {
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    Paper,
    TableBody,
    TableCell,
    tableCellClasses,
    TableContainer,
    TableHead,
    TableRow,
} from "@mui/material"
import { Box, styled } from "@mui/system"
import React from "react"

const StyledTableCell = styled(TableCell)(() => ({
    [`&.${tableCellClasses.head}`]: {
        backgroundColor: "#fafafa",
        color: "rgba(0,0,0,.85)",
        fontWeight: "600",
        fontSize: 14,
    },
    [`&.${tableCellClasses.body}`]: {
        fontSize: 14,
    },
}))

interface PreviewProps {
    Id: number
    Vehicle_Number: string
    Trip_Date: string
    Requisitioner_Purpose: string
    Start_Time: string
    End_Time: string
    Current_Meter_Reading: string | number
    // Stationary_Running_Time: number | string
    End_Meter_Reading: number
    Fuel_Received: number | string
    Fuel_Type: string
    Driver_Name: string
}
interface Props {
    open: boolean
    data: PreviewProps | null
    handleClose: () => void
}
const PreviewModal = ({ open, data, handleClose }: Props) => {
    return (
     <Dialog
      open={open}
      onClose={handleClose}
      maxWidth={"lg"}
      fullWidth
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
     >
         <DialogContent dividers>
             <Box sx={{ flexGrow: 1 }}>
                 {data && (
                  <TableContainer component={Paper}>
                      <h2>BOS/AOS/POL/DI/AHS Detail</h2>
                      <Table>
                          <TableHead>
                              <TableRow>
                                  <StyledTableCell align="left">Id</StyledTableCell>
                                  <StyledTableCell align="left">Current Meter Reading</StyledTableCell>
                                  <StyledTableCell align="left">Vehicle Number</StyledTableCell>
                              </TableRow>
                          </TableHead>
                          <TableBody>
                              <TableRow>
                                  <TableCell>{data.Id}</TableCell>
                                  <TableCell>{data.Current_Meter_Reading}</TableCell>
                                  <TableCell>{data.Vehicle_Number}</TableCell>
                              </TableRow>
                          </TableBody>
                          <TableHead>
                              <TableRow>
                                  <StyledTableCell align="left">Driver Name</StyledTableCell>
                                  <StyledTableCell align="left">Requisitioner Purpose</StyledTableCell>
                              </TableRow>
                          </TableHead>
                          <TableBody>
                              <TableRow>
                                  <TableCell>{data.Driver_Name}</TableCell>
                                  <TableCell>{data.Requisitioner_Purpose}</TableCell>
                              </TableRow>
                          </TableBody>
                      </Table>
                      <h2>ELog Detail</h2>
                      <Table>
                          <TableHead>
                              <TableRow>
                                  <StyledTableCell align="left">Start Time</StyledTableCell>
                                  <StyledTableCell align="left">End Time</StyledTableCell>
                                  <StyledTableCell align="left">Fuel Received</StyledTableCell>
                                  {/* <StyledTableCell align="left">Stationary Running Time</StyledTableCell> */}
                              </TableRow>
                          </TableHead>
                          <TableBody>
                              <TableRow>
                                  <TableCell>{data.Start_Time}</TableCell>
                                  <TableCell>{data.End_Time}</TableCell>
                                  <TableCell>{data.Fuel_Received}</TableCell>
                                  {/* <TableCell>{data.Stationary_Running_Time}</TableCell> */}
                              </TableRow>
                          </TableBody>
                          <TableHead>
                              <TableRow>
                                  <StyledTableCell align="left">Driver Name</StyledTableCell>
                                  <StyledTableCell align="left">Fuel Type</StyledTableCell>
                              </TableRow>
                          </TableHead>
                          <TableBody>
                              <TableRow>
                                  <TableCell>{data.Driver_Name}</TableCell>
                                  <TableCell>{data.Fuel_Type}</TableCell>
                              </TableRow>
                          </TableBody>
                      </Table>
                  </TableContainer>
                 )}
             </Box>
         </DialogContent>
         <DialogActions>
             <Button size="small" autoFocus onClick={handleClose}>
                 Close
             </Button>
         </DialogActions>
     </Dialog>
    )
}

export default PreviewModal
