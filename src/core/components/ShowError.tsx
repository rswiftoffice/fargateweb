import { Alert, AlertTitle } from "@mui/material";
import { Box } from "@mui/system";
import React from "react";

interface IErrorViewProps {
  title: string;
  desc: string;
}

const ErrorView = ({ title, desc }: IErrorViewProps) => {
  return (
    <Box sx={{ mt: 5 }}>
      <Alert severity="error">
        <AlertTitle>{title}</AlertTitle>
        {desc}
      </Alert>
    </Box>
  );
};

export default ErrorView;
