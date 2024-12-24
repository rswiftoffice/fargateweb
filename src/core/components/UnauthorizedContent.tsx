import { Alert, AlertTitle } from "@mui/material"
import { Box } from "@mui/system"
import React from "react"

const UnauthorizedContent = () => {
  return (
    <Box>
      <Alert severity="error">
        <AlertTitle>Unauthorized Access!</AlertTitle>
        You are not allowed to access this page. Try changing role or contact administration for
        access!
      </Alert>
    </Box>
  )
}

export default UnauthorizedContent
