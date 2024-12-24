import React, {useState} from 'react';
import {LoadingButton} from '@mui/lab';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  Grid,
  DialogContentText,
  DialogActions,
  Button,
  Autocomplete,
  TextField,
} from '@mui/material';
import {Box} from '@mui/system';
import {FormProvider, useForm} from 'react-hook-form';
import {useSelector} from 'react-redux';
import {RootState} from '../../../store';

const entity = 'Command';

interface CommandValues {
  id: number;
  name: string;
}

interface TransferCommandProps {
  currentCommandId: number;
  newCommandId: number;
}

interface Props {
  open: boolean;
  data: CommandValues | null;
  loading?: boolean;
  handleClose: () => void;
  handleConfirm: (data: TransferCommandProps) => void;
}
const TransferCommandAlert = ({
  open,
  data,
  loading,
  handleClose,
  handleConfirm,
}: Props) => {
  const formMethods = useForm();
  const {handleSubmit} = formMethods;
  const [commandService, setCommandService] = useState<CommandValues | null>(
    null,
  );
  const [command, setCommand] = useState<CommandValues | null>(null);

  const services = useSelector((state: RootState) => {
    return state.service.list.map((item) => ({
      name: item.name,
      id: item.id,
    }));
  });

  const commands = useSelector((state: RootState) => {
    return state.command.commands;
  });

  const onSelectionServiceChange = (
    event: any,
    newValue: CommandValues | null,
  ) => {
    setCommandService(newValue);
  };

  const onSelectionCommandChange = (
    event: any,
    newValue: CommandValues | null,
  ) => {
    setCommand(newValue);
  };

  const onSubmit = () => {
    if (data && command)
      handleConfirm({currentCommandId: data.id, newCommandId: command.id});
  };

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      maxWidth={'md'}
      fullWidth
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description">
      <DialogTitle id="alert-dialog-title">Transferring {entity}</DialogTitle>
      <form onSubmit={handleSubmit(onSubmit)}>
        <DialogContent dividers>
          <DialogContentText id="alert-dialog-description">{`Some warning related to this working`}</DialogContentText>
          <Box sx={{flexGrow: 1}}>
            <FormProvider {...formMethods}>
              <Grid container columns={{xs: 4, sm: 8, md: 12}}>
                <Grid item xs={12} md={6} sx={{pl: 2, pr: 6, pt: 3}}>
                  <Box display="flex" justifyContent="flex-end" pt={2}>
                    <Autocomplete
                      disablePortal
                      id="combo-box-demo"
                      options={services}
                      sx={{width: 300}}
                      value={commandService}
                      onChange={onSelectionServiceChange}
                      getOptionLabel={option => option.name}
                      renderInput={params => (
                        <TextField {...params} label="Service" required />
                      )}
                    />
                  </Box>
                </Grid>
                <Grid item xs={12} md={6} sx={{pl: 2, pr: 6, pt: 3}}>
                  <Box display="flex" justifyContent="flex-end" pt={2}>
                    <Autocomplete
                      disablePortal
                      id="combo-box-demo"
                      options={commands}
                      sx={{width: 300}}
                      value={command}
                      onChange={onSelectionCommandChange}
                      getOptionLabel={option => option.name}
                      renderInput={params => (
                        <TextField {...params} label="Command" required />
                      )}
                    />
                  </Box>
                </Grid>
              </Grid>
            </FormProvider>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button
            size="small"
            autoFocus
            disabled={loading}
            onClick={handleClose}>
            Cancel
          </Button>
          <LoadingButton
            size="small"
            color="error"
            disabled={loading}
            loading={loading}
            autoFocus
            type={'submit'}>
            {'Transfer & Delete'}
          </LoadingButton>
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default TransferCommandAlert;
