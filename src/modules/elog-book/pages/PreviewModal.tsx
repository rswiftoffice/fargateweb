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
    To_Destination: string
    Requisitioner_Purpose: string
    Start_Time: string
    End_Time: string
    Stationary_Running_Time: number | string
    End_Meter_Reading: number
    Total_Distance: number
    Driver_Name: string
    Approving_Officer: string
    Remarks: string
    // Destination_Status: string
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
                            <h2>ELog Detail</h2>
                            <Table>
                                <TableHead>
                                    <TableRow>
                                        <StyledTableCell align="left">Id</StyledTableCell>
                                        <StyledTableCell align="left">Start Time</StyledTableCell>
                                        <StyledTableCell align="left">End Time</StyledTableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    <TableRow>
                                        <TableCell>{data.Id}</TableCell>
                                        <TableCell>{data.Start_Time}</TableCell>
                                        <TableCell>{data.End_Time}</TableCell>
                                    </TableRow>
                                </TableBody>
                                <TableHead>
                                    <TableRow>
                                        <StyledTableCell align="left">Stationary Time</StyledTableCell>
                                        <StyledTableCell align="left">End Meter Reading</StyledTableCell>
                                        <StyledTableCell align="left">Total Distance (Km/Miles) </StyledTableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    <TableRow>
                                        <TableCell>{data.Stationary_Running_Time}</TableCell>
                                        <TableCell>{data.End_Meter_Reading}</TableCell>
                                        <TableCell>{data.Total_Distance}</TableCell>
                                    </TableRow>
                                </TableBody>
                                {/* <TableHead>
                  <TableRow>
                    <StyledTableCell align="left">Fuel Receieved</StyledTableCell>
                    <StyledTableCell align="left">PO/SO Number</StyledTableCell>
                    <StyledTableCell align="left">Fuel Type</StyledTableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  <TableRow>
                    <TableCell>{data.Fuel_Received}</TableCell>
                    <TableCell>{data.POSO_Number}</TableCell>
                    <TableCell>{data.Fuel_Type}</TableCell>
                  </TableRow>
                </TableBody> */}
                                <TableHead>
                                    <TableRow>
                                        <StyledTableCell align="left">Remarks</StyledTableCell>
                                        {/* <StyledTableCell align="left">Created At</StyledTableCell> */}
                                        {/* <StyledTableCell align="left">Updated At</StyledTableCell> */}
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    <TableRow>
                                        <TableCell>{data.Remarks ?? "N/A"}</TableCell>
                                        {/* <TableCell>{data.Created_At}</TableCell> */}
                                        {/* <TableCell>{data.Updated_At}</TableCell> */}
                                    </TableRow>
                                </TableBody>
                            </Table>
                            <h2>Destination Detail</h2>
                            <Table>
                                <TableHead>
                                    <TableRow>
                                        <StyledTableCell>To</StyledTableCell>
                                        <StyledTableCell align="left">Vehicle Number</StyledTableCell>
                                        <StyledTableCell align="left">Trip Date</StyledTableCell>
                                        {/* <StyledTableCell align="left">Destination Status</StyledTableCell> */}
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    <TableRow>
                                        <TableCell>{data?.To_Destination}</TableCell>
                                        <TableCell>{data?.Vehicle_Number}</TableCell>
                                        <TableCell>{data?.Trip_Date}</TableCell>
                                        {/* <TableCell>{data?.Destination_Status}</TableCell> */}
                                    </TableRow>
                                </TableBody>
                                <TableHead>
                                    <TableRow>
                                        <StyledTableCell align="left">Driver Name</StyledTableCell>
                                        <StyledTableCell align="left">Approving Officer</StyledTableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    <TableRow>
                                        <TableCell>{data?.Driver_Name}</TableCell>
                                        <TableCell>{data?.Approving_Officer}</TableCell>
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
