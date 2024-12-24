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
  Name: string
  Description: string
  Current_Role: string
  Added_By: string
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
              <h2>Audit Log Detail</h2>
              <Table>
                <TableHead>
                  <TableRow>
                    <StyledTableCell>Id</StyledTableCell>
                    <StyledTableCell>Name</StyledTableCell>
                    <StyledTableCell>Description</StyledTableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  <TableRow>
                    <TableCell>{data.Id}</TableCell>
                    <TableCell>{data.Name}</TableCell>
                    <TableCell>{data.Description}</TableCell>
                  </TableRow>
                </TableBody>
                <TableHead>
                  <TableRow>
                    <StyledTableCell>Created At</StyledTableCell>
                    <StyledTableCell>Updated At</StyledTableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  <TableRow>
                    <TableCell>{data.Created_At}</TableCell>
                    <TableCell>{data.Updated_At}</TableCell>
                  </TableRow>
                </TableBody>
              </Table>
              <h2>Added By</h2>
              <Table>
                <TableHead>
                  <TableRow>
                    <StyledTableCell>Email</StyledTableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  <TableRow>
                    <TableCell>{data?.Added_By}</TableCell>
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
