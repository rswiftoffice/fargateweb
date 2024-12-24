import { Grid } from "@material-ui/core"
import { DateRangePicker } from "@matharumanpreet00/react-daterange-picker"
import AccessTimeFilledSharpIcon from "@mui/icons-material/AccessTimeFilledSharp"
import ArrowDownwardSharpIcon from "@mui/icons-material/ArrowDownwardSharp"
import SimCardDownloadSharpIcon from "@mui/icons-material/SimCardDownloadSharp"
import { Button } from "@mui/material"
import { Box } from "@mui/system"
import moment from "moment"
import React, { useState } from "react"

interface DateRangeProps {
  startDate: Date
  endDate: Date
}
interface Props {
  dateRange: DateRangeProps
  handleDateRangeChange: (range: DateRangeProps) => void
  onExportPress: (range: DateRangeProps) => void
}

const CustomDateRangePicker = ({ dateRange, handleDateRangeChange, onExportPress }: Props) => {
  const [open, setOpen] = useState(true)
  const toggleOpen = () => setOpen(!open)

  const handleRangeSelect = (range: any) => {
    handleDateRangeChange(range)
    toggleOpen()
  }

  return (
    <Box sx={{ minWidth: 800 }}>
      <Grid container>
        <Grid item xs={12} md={open ? 12 : 6} style={{ backgroundColor: "#000033" }}>
          <Box sx={{ m: 2 }}>
            <h2 style={{ color: "white" }}>Export Data</h2>
            {!open ? (
              <>
                <Box sx={{ display: "flex" }}>
                  <Button
                    variant={"outlined"}
                    startIcon={<AccessTimeFilledSharpIcon />}
                    onClick={toggleOpen}
                    sx={{ border: "1px solid #ccc", color: "white" }}
                  >
                    Select Date Range
                  </Button>
                </Box>
                <Box>
                  <Button
                    sx={{
                      m: 2,
                      ml: 0,
                    }}
                    variant={"contained"}
                    color={"info"}
                    startIcon={<SimCardDownloadSharpIcon />}
                    disabled={!dateRange}
                    onClick={() => onExportPress(dateRange)}
                  >
                    Download
                  </Button>
                </Box>
              </>
            ) : (
              <DateRangePicker open={open} maxDate={new Date()} onChange={handleRangeSelect} />
            )}
          </Box>
        </Grid>
        {!open && (
          <Grid item xs={12} md={6}>
            <Box sx={{ px: 5 }}>
              <div
                style={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  flexDirection: "column",
                  width: "100%",
                  minHeight: 150,
                  margin: 15,
                }}
              >
                <div
                  style={{
                    display: "flex",
                    minHeight: 40,
                    backgroundColor: "#000033",
                    borderRadius: 10,
                    color: "white",
                    fontSize: 15,
                    fontWeight: "bold",
                    padding: "0px 15px",
                    alignItems: "center",
                    justifyContent: "flex-start",
                  }}
                >
                  <AccessTimeFilledSharpIcon sx={{ mr: 3 }} />
                  {moment(dateRange.startDate).format("DD MMMM YYYY")}
                </div>
                <ArrowDownwardSharpIcon />
                <div
                  style={{
                    display: "flex",
                    minHeight: 40,
                    padding: "0px 15px",
                    backgroundColor: "#000033",
                    borderRadius: 10,
                    color: "white",
                    fontSize: 15,
                    fontWeight: "bold",
                    alignItems: "center",
                    justifyContent: "flex-start",
                  }}
                >
                  <AccessTimeFilledSharpIcon sx={{ mr: 3 }} />
                  {moment(dateRange.endDate).subtract(1, "d").format("DD MMMM YYYY")}
                </div>
              </div>
            </Box>
          </Grid>
        )}
      </Grid>
    </Box>
  )
}

export default CustomDateRangePicker
