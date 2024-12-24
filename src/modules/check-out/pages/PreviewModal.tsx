import { Table, Typography } from "@material-ui/core"
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
  Date_Out: string
  Speedo_Reading: string
  Swd_Reading: string
  Time: string
  Remark: string
  Attender: string
  Work_Center: string
  Vehicle_Taken_Over: string
  Check_out_Type: string
  Basic_Issue_Tools?: string
  Basic_Issue_Tools_List?: BasicIssueTools[]
  Created_At: string
  Updated_At: string
}

interface BasicIssueTools {
  id: number,
  name: string,
  quantity: number,
  checkInId: number,
  checkOutId: number,
  createdAt: string,
  updatedAt: string
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
                    <StyledTableCell align="left">Date Out</StyledTableCell>
                    <StyledTableCell align="left">Work Center</StyledTableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  <TableRow>
                    <TableCell>{data.Id}</TableCell>
                    <TableCell>{data.Date_Out}</TableCell>
                    <TableCell>{data.Work_Center}</TableCell>
                  </TableRow>
                </TableBody>
                <TableHead>
                  <TableRow>
                    <StyledTableCell align="left">Speedo Reading</StyledTableCell>
                    <StyledTableCell align="left">Swd Reading</StyledTableCell>
                    <StyledTableCell align="left">Remark</StyledTableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  <TableRow>
                    <TableCell>{data.Speedo_Reading}</TableCell>
                    <TableCell>{data.Swd_Reading}</TableCell>
                    <TableCell>{data.Remark}</TableCell>
                  </TableRow>
                </TableBody>
                <TableHead>
                  <TableRow>
                    <StyledTableCell align="left">Check in Type</StyledTableCell>
                    <StyledTableCell align="left">Attended By</StyledTableCell>
                    <StyledTableCell align="left">Vehicle Taken Over</StyledTableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  <TableRow>
                    <TableCell>{data.Check_out_Type}</TableCell>
                    <TableCell>{data.Attender}</TableCell>
                    <TableCell>{data.Vehicle_Taken_Over}</TableCell>
                  </TableRow>
                </TableBody>
                <TableHead>
                  <TableRow>
                    <StyledTableCell align="left">Created At</StyledTableCell>
                    <StyledTableCell align="left">Updated At</StyledTableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  <TableRow>
                    <TableCell>{data.Created_At}</TableCell>
                    <TableCell>{data.Updated_At}</TableCell>
                  </TableRow>
                </TableBody>
              </Table>
              <h2>Basic Tools Columns</h2>
              <Table>
                <TableHead>
                  <TableRow>
                    <StyledTableCell align="left">Name</StyledTableCell>
                    <StyledTableCell align="left">Quantity</StyledTableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {data?.Basic_Issue_Tools_List &&
                    data?.Basic_Issue_Tools_List.length > 0 &&
                    data?.Basic_Issue_Tools_List.map((data, key) => (
                      <TableRow key={key}>
                        <TableCell>{data?.name}</TableCell>
                        <TableCell>{data?.quantity}</TableCell>
                      </TableRow>
                    ))}
                </TableBody>
              </Table>
              {data?.Basic_Issue_Tools_List && !data?.Basic_Issue_Tools_List.length && (
                <Box justifyContent="center" padding="20px" textAlign="center">
                  <Typography variant="body2">No Basic Tools Data</Typography>
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
