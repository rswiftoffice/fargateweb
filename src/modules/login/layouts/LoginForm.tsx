import React, { ChangeEvent } from "react";
import {
  Avatar,
  Box,
  Button,
  Container,
  Link,
  Typography,
} from "@mui/material";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import TextInput from "../../../components/TextInput";

type Props = {
  email: string;
  emailErrorMessage: string;
  password: string;
  onEmailChange: (event: ChangeEvent<HTMLInputElement>) => void;
  onPasswordChange: (event: ChangeEvent<HTMLInputElement>) => void;
  onDefaultLoginButtonClick: () => void;
  onMicrosoftLoginButtonClick: () => void;
};

function LoginForm({
  email,
  emailErrorMessage,
  password,
  onEmailChange,
  onPasswordChange,
  onDefaultLoginButtonClick,
  onMicrosoftLoginButtonClick,
}: Props) {
  return (
    <Container component="main" maxWidth="xs">
      <Box
        sx={{
          marginTop: 8,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <Avatar sx={{ m: 1, bgcolor: "secondary.main" }}>
          <LockOutlinedIcon />
        </Avatar>
        <Typography component="h1" variant="h5">
          {"Login"}
        </Typography>
        <Box sx={{ mt: 1, width: "100%" }}>
          <Box sx={{ display: "flex", flexDirection: "column" }}>
            <TextInput
              id="email"
              label="Email"
              placeholder="Email"
              variant="outlined"
              value={email}
              onChange={onEmailChange}
              errorMessage={emailErrorMessage}
            />
            <TextInput
              id="password"
              label="Password"
              placeholder="Password"
              type="password"
              variant="outlined"
              value={password}
              onChange={onPasswordChange}
            />
            <Button variant="contained" onClick={onDefaultLoginButtonClick}>
              Login
            </Button>
            {console.log("Login ")}
            {/* <Box sx={{ margin: "auto", paddingTop: 2, paddingBottom: 1 }}>
              OR
            </Box> */}
            <a
              href={
                process.env.REACT_APP_API_URL + "/auth/microsoft/connect-web"
              }
              style={{
                textDecoration: "none",
                width: "100%",
                display: "inline-grid",
              }}
            >
              <Button variant="outlined">Login via Microsoft</Button>
            </a>
          </Box>
        </Box>
      </Box>
    </Container>
  );
}

export default LoginForm;
