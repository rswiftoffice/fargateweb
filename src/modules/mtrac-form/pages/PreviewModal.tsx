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
    Over_All_Risk: string
    Despatch_Date: string
    Despatch_Time: string
    Release_Date: string
    Release_Time: string
    Status?: string
    Filled_By: string
    Personal_Pin: string
    Rank_And_Name: string
    Trip_Date: string
    AVI_Date: string
    Approving_Officer: string
    Driver: string
    Vehicle_Number: string
    Sub_Unit: string
    Base: string
    Command: string
    Service: string
    Driver_Risk_Assessment_Checklist: string | string[]
    Other_Risk_Assessment_Checklist?: string | string[]
    Quizzes: string | Quizzes[]
    Safety_Measures: string
    Created_At: string
    Updated_At?: string
}
interface Props {
    open: boolean
    data: PreviewProps | null
    handleClose: () => void
}
interface Quizzes {
    question: string
    answer: string
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
                      <h2>MTRAC Details</h2>
                      <Table>
                          <TableHead>
                              <TableRow>
                                  <StyledTableCell align="left">Id</StyledTableCell>
                                  <StyledTableCell align="left">Vehicle Number</StyledTableCell>
                                  <StyledTableCell align="left">Over All Risk</StyledTableCell>
                              </TableRow>
                          </TableHead>
                          <TableBody>
                              <TableRow>
                                  <TableCell>{data.Id}</TableCell>
                                  <TableCell>{data.Vehicle_Number}</TableCell>
                                  <TableCell>{data.Over_All_Risk}</TableCell>
                              </TableRow>
                          </TableBody>
                          <TableHead>
                              <TableRow>
                                  <StyledTableCell align="left">Despatch Date</StyledTableCell>
                                  <StyledTableCell align="left">Despatch Time</StyledTableCell>
                                  <StyledTableCell align="left">Status</StyledTableCell>
                              </TableRow>
                          </TableHead>
                          <TableBody>
                              <TableRow>
                                  <TableCell>{data.Despatch_Date}</TableCell>
                                  <TableCell>{data.Despatch_Time}</TableCell>
                                  <TableCell>{data.Status}</TableCell>
                              </TableRow>
                          </TableBody>
                          <TableHead>
                              <TableRow>
                                  <StyledTableCell align="left">Release Date</StyledTableCell>
                                  <StyledTableCell align="left">Release Time</StyledTableCell>
                                  <StyledTableCell align="left">Filled By</StyledTableCell>
                              </TableRow>
                          </TableHead>
                          <TableBody>
                              <TableRow>
                                  <TableCell>{data.Release_Date}</TableCell>
                                  <TableCell>{data.Release_Time}</TableCell>
                                  <TableCell>{data.Filled_By}</TableCell>
                              </TableRow>
                          </TableBody>
                          <TableHead>
                              <TableRow>
                                  <StyledTableCell align="left">
                                      Vehicle Commander Last 4 Characters of NRIC
                                  </StyledTableCell>
                                  <StyledTableCell align="left">Vehicle Commander Rank and Name</StyledTableCell>
                                  <StyledTableCell align="left">Trip Date</StyledTableCell>
                              </TableRow>
                          </TableHead>
                          <TableBody>
                              <TableRow>
                                  <TableCell>{data.Personal_Pin}</TableCell>
                                  <TableCell>{data.Rank_And_Name}</TableCell>
                                  <TableCell>{data.Trip_Date}</TableCell>
                              </TableRow>
                          </TableBody>
                          <TableHead>
                              <TableRow>
                                  <StyledTableCell align="left">AVI Date</StyledTableCell>
                                  <StyledTableCell align="left">Approving Officer</StyledTableCell>
                                  <StyledTableCell align="left">Driver</StyledTableCell>
                              </TableRow>
                          </TableHead>
                          <TableBody>
                              <TableRow>
                                  <TableCell>{data.AVI_Date}</TableCell>
                                  <TableCell>{data.Approving_Officer}</TableCell>
                                  <TableCell>{data.Driver}</TableCell>
                              </TableRow>
                          </TableBody>
                          <TableHead>
                              <TableRow>
                                  <StyledTableCell align="left">Service</StyledTableCell>
                                  <StyledTableCell align="left">Command</StyledTableCell>
                                  <StyledTableCell align="left">Base</StyledTableCell>
                              </TableRow>
                          </TableHead>
                          <TableBody>
                              <TableRow>
                                  <TableCell>{data.Service}</TableCell>
                                  <TableCell>{data.Command}</TableCell>
                                  <TableCell>{data.Base}</TableCell>
                              </TableRow>
                          </TableBody>
                          <TableHead>
                              <TableRow>
                                  <StyledTableCell align="left">Sub unit</StyledTableCell>
                                  <StyledTableCell align="left">Driver Checklist</StyledTableCell>
                                  <StyledTableCell align="left">{data.Filled_By} Checklist</StyledTableCell>
                              </TableRow>
                          </TableHead>
                          <TableBody>
                              <TableRow>
                                  <TableCell>{data.Sub_Unit}</TableCell>
                                  <TableCell>
                                      {!(typeof data.Driver_Risk_Assessment_Checklist === "string") &&
                                      data.Driver_Risk_Assessment_Checklist.length ? (
                                       <>
                                           {data.Driver_Risk_Assessment_Checklist.map((item, index) => (
                                            <p key={index}>
                                                <b>{index + 1}.</b> {item}
                                            </p>
                                           ))}
                                       </>
                                      ) : (
                                       "N/A"
                                      )}
                                  </TableCell>
                                  <TableCell>
                                      {data?.Other_Risk_Assessment_Checklist &&
                                      !(typeof data?.Other_Risk_Assessment_Checklist === "string") &&
                                      data.Other_Risk_Assessment_Checklist.length ? (
                                       <>
                                           {data.Other_Risk_Assessment_Checklist.map((item, index) => (
                                            <p key={index}>
                                                <b>{index + 1}.</b> {item}
                                            </p>
                                           ))}
                                       </>
                                      ) : (
                                       "N/A"
                                      )}
                                  </TableCell>
                              </TableRow>
                          </TableBody>
                          <TableHead>
                              <TableRow>
                                  <StyledTableCell align="left">Created At</StyledTableCell>
                                  <StyledTableCell align="left">Safety Measures</StyledTableCell>
                              </TableRow>
                          </TableHead>
                          <TableBody>
                              <TableRow>
                                  <TableCell>{data.Created_At}</TableCell>
                                  <TableCell>{data.Safety_Measures}</TableCell>
                              </TableRow>
                          </TableBody>
                      </Table>
                      <h2>Risk Assessment</h2>
                      <Table>
                          <TableHead>
                              <TableRow>
                                  <StyledTableCell align="left">Question</StyledTableCell>
                                  <StyledTableCell align="left">Answer</StyledTableCell>
                              </TableRow>
                          </TableHead>
                          <TableBody>
                              {data?.Quizzes &&
                               typeof data.Quizzes !== "string" &&
                               data?.Quizzes.length > 0 &&
                               data?.Quizzes.map((data, key) => (
                                <TableRow key={key}>
                                    <TableCell>{data?.question}</TableCell>
                                    <TableCell>{data?.answer}</TableCell>
                                </TableRow>
                               ))}
                          </TableBody>
                      </Table>
                      {data?.Quizzes && !data?.Quizzes.length && (
                       <Box justifyContent="center" padding="20px" textAlign="center">
                           <Typography variant="body2">No Data Found</Typography>
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
