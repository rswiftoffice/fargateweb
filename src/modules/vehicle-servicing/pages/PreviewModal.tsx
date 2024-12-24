import { Table } from "@material-ui/core"
import moment from "moment"
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
    Typography,
    TableRow,
} from "@mui/material"
import { Box, styled } from "@mui/system"
import React from "react"

interface Updates {
    updatedAt: string
    dateOfCompletion: string
    notes: string
    Updates: object[]
}

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
    Maintenance_Type: string
    Status: string
    Updates?: Updates[]
    Updates_Notes?: string
    Date: string
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
                      <h2>Vehicle Servicing Detail</h2>
                      <Table>
                          <TableHead>
                              <TableRow>
                                  <StyledTableCell align="left">Id</StyledTableCell>
                                  <StyledTableCell align="left">Maintenance Type</StyledTableCell>
                                  <StyledTableCell align="left">Maintenance Status</StyledTableCell>
                              </TableRow>
                          </TableHead>
                          <TableBody>
                              <TableRow>
                                  <TableCell>{data.Id}</TableCell>
                                  <TableCell>{data.Maintenance_Type}</TableCell>
                                  <TableCell>{data.Status}</TableCell>
                              </TableRow>
                          </TableBody>
                          <TableHead>
                              <TableRow>
                                  <StyledTableCell align="left">Vehicle Number</StyledTableCell>
                                  <StyledTableCell align="left">Date</StyledTableCell>
                                  <StyledTableCell align="left">Created At</StyledTableCell>
                              </TableRow>
                          </TableHead>
                          <TableBody>
                              <TableRow>
                                  <TableCell>{data.Vehicle_Number}</TableCell>
                                  <TableCell>{data.Date}</TableCell>
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
                      <h2>Updates</h2>
                      <Table>
                          <TableHead>
                              <TableRow>
                                  <StyledTableCell align="left">Notes</StyledTableCell>
                                  <StyledTableCell align="left">Updated At</StyledTableCell>
                                  <StyledTableCell align="left">Date of Completion</StyledTableCell>
                              </TableRow>
                          </TableHead>
                          <TableBody>
                              {data?.Updates &&
                               data?.Updates.map((update, index) => (
                                <TableRow key={index}>
                                    <TableCell>{update?.notes ?? "N/A"}</TableCell>
                                    <TableCell>
                                        {update?.updatedAt
                                         ? moment.utc(update.updatedAt).local().format("HH:mm, DD-MMM-YYYY")
                                         : "N/A"}
                                    </TableCell>
                                    <TableCell>
                                        {update?.dateOfCompletion
                                         ? moment.utc(update.dateOfCompletion).local().format("DD MMM, YYYY")
                                         : "N/A"}
                                    </TableCell>
                                </TableRow>
                               ))}
                          </TableBody>
                      </Table>
                      {data?.Updates && !data?.Updates.length && (
                       <Box justifyContent="center" padding="20px" textAlign="center">
                           <Typography variant="body2">No Updates Data</Typography>
                       </Box>
                      )}
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
