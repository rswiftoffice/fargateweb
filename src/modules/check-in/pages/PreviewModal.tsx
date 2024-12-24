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
  Work_Center: string
  Images?: [
    {path: string}
  ]
  Telephone_No: string
  Date_In: string
  Speedo_Reading: string
  Swd_Reading: string
  Expected_Check_out_Date: string
  Expected_Check_out_Time: string
  Handed_By: string
  Attender: string
  Check_in_Type: string
  Front_Sensor_Tag: string
  Defect: string
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
              <h2>Check In Detail</h2>
              <Table>
                <TableHead>
                  <TableRow>
                    <StyledTableCell align="left">Id</StyledTableCell>
                    <StyledTableCell align="left">Work Center</StyledTableCell>
                    <StyledTableCell align="left">Telephone Number</StyledTableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  <TableRow>
                    <TableCell>{data.Id}</TableCell>
                    <TableCell>{data.Work_Center}</TableCell>
                    <TableCell>{data.Telephone_No}</TableCell>
                  </TableRow>
                </TableBody>
                <TableHead>
                  <TableRow>
                    <StyledTableCell align="left">Date In</StyledTableCell>
                    <StyledTableCell align="left">Speedo Reading</StyledTableCell>
                    <StyledTableCell align="left">Expected Checkout Date</StyledTableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  <TableRow>
                    <TableCell>{data.Date_In}</TableCell>
                    <TableCell>{data.Speedo_Reading}</TableCell>
                    <TableCell>{data.Expected_Check_out_Date}</TableCell>
                  </TableRow>
                </TableBody>
                <TableHead>
                  <TableRow>
                    <StyledTableCell align="left">Expected Checkout Time</StyledTableCell>
                    <StyledTableCell align="left">Handed By</StyledTableCell>
                    <StyledTableCell align="left">Attender</StyledTableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  <TableRow>
                    <TableCell>{data.Expected_Check_out_Time}</TableCell>
                    <TableCell>{data.Handed_By}</TableCell>
                    <TableCell>{data.Attender}</TableCell>
                  </TableRow>
                </TableBody>
                <TableHead>
                  <TableRow>
                    <StyledTableCell align="left">Check in Type</StyledTableCell>
                    <StyledTableCell align="left">Front Sensor Tag</StyledTableCell>
                    <StyledTableCell align="left">Created At</StyledTableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  <TableRow>
                    <TableCell>{data.Check_in_Type}</TableCell>
                    <TableCell>{data.Front_Sensor_Tag}</TableCell>
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

              <TableHead>
                <TableRow>
                  <StyledTableCell align="left">Images</StyledTableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                <TableRow>
                  <TableCell>
                    {data.Images && data.Images.length
                      ? data.Images.map((image, key) => (
                          <img
                            key={key}
                            style={{
                              height: 200,
                              width: 200,
                              objectFit: "cover",
                              backgroundColor: "#ccc",
                              borderRadius: 10,
                              margin: 5,
                            }}
                            draggable
                            src={process.env.BLITZ_PUBLIC_BACKEND_URL + image.path}
                            alt={"check in Image"}
                          />
                        ))
                      : "No Images"}
                  </TableCell>
                </TableRow>
              </TableBody>
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
                  <Typography variant="body2">No Data</Typography>
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
