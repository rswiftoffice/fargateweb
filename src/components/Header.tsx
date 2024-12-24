import React from 'react';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import PowerSettingsNewIcon from '@mui/icons-material/PowerSettingsNew';
import {Box} from '@mui/material';

type Props = {
  title: string;
  onLogout: () => void;
};

function Header({onLogout, title}: Props) {
  return (
    <Box
      display="flex"
      flexDirection="row"
      alignItems="center"
      sx={{padding: 1.5}}>
      <Typography variant="h6" noWrap component="div" sx={{flexGrow: 1}}>
        {title}
      </Typography>
      <IconButton color="secondary" onClick={onLogout}>
        <PowerSettingsNewIcon />
      </IconButton>
    </Box>
  );
}

export default Header;
