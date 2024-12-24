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
    Driver_Name: string
    Service: string
    Command: string
    Base: string
    Sub_Unit: string
    License_Classes: string
    Roles: string
    Created_At: string
    Updated_At: string
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
                      <h2>Check out Detail</h2>
                      <Table>
                          <TableHead>
                              <TableRow>
                                  <StyledTableCell align="left">Id</StyledTableCell>
                                  <StyledTableCell align="left">Driver Name</StyledTableCell>
                                  <StyledTableCell align="left">Service</StyledTableCell>
                              </TableRow>
                          </TableHead>
                          <TableBody>
                              <TableRow>
                                  <TableCell>{data.Id}</TableCell>
                                  <TableCell>{data.Driver_Name}</TableCell>
                                  <TableCell>{data.Service}</TableCell>
                              </TableRow>
                          </TableBody>
                          <TableHead>
                              <TableRow>
                                  <StyledTableCell align="left">Command</StyledTableCell>
                                  <StyledTableCell align="left">Base</StyledTableCell>
                                  <StyledTableCell align="left">Sub unit</StyledTableCell>
                              </TableRow>
                          </TableHead>
                          <TableBody>
                              <TableRow>
                                  <TableCell>{data.Command}</TableCell>
                                  <TableCell>{data.Base}</TableCell>
                                  <TableCell>{data.Sub_Unit}</TableCell>
                              </TableRow>
                          </TableBody>
                          <TableHead>
                              <TableRow>
                                  <StyledTableCell align="left">License Classes</StyledTableCell>
                                  <StyledTableCell align="left">Roles</StyledTableCell>
                                  <StyledTableCell align="left">Created At</StyledTableCell>
                              </TableRow>
                          </TableHead>
                          <TableBody>
                              <TableRow>
                                  <TableCell>{data.License_Classes}</TableCell>
                                  <TableCell>{data.Roles}</TableCell>
                                  <TableCell>{data.Created_At}</TableCell>
                              </TableRow>
                          </TableBody>
                          <TableHead>
                              <TableRow>
                                  <StyledTableCell align="left">Updated At</StyledTableCell>
                              </TableRow>
                          </TableHead>
                          <TableBody>
                              <TableRow>
                                  <TableCell>{data.Updated_At}</TableCell>
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
