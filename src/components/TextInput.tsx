import React from 'react';
import {Box, TextFieldProps, TextField} from '@mui/material';
import styled from '@emotion/styled';

type Props = {
  errorMessage?: string;
};

const ErrorText = styled.div`
  color: red;
  margin-top: 1rem;
  margin-bottom: 1rem;
`;

function TextInput(props: Props & TextFieldProps) {
  const {errorMessage, ...rest} = props;
  return (
    <Box sx={{display: 'flex', flexDirection: 'column'}} mb={2}>
      <TextField {...rest} />
      <ErrorText>{errorMessage}</ErrorText>
    </Box>
  );
}

export default TextInput;
