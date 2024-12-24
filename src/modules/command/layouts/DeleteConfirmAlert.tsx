import * as React from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import {LoadingButton} from '@mui/lab';

interface Props {
  open: boolean;
  title?: string;
  desc?: string;
  loading: boolean;
  handleClose: () => void;
  handleConfirm: () => void;
}

export default function DeleteConfirmAlert({
  open,
  title,
  desc,
  loading,
  handleClose,
  handleConfirm,
}: Props) {
  return (
    <Dialog
      open={open}
      maxWidth="xs"
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description">
      <DialogTitle id="alert-dialog-title">
        {title ?? 'Are you sure?'}
      </DialogTitle>
      <DialogContent dividers>
        <DialogContentText id="alert-dialog-description">
          {desc}
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button size="small" autoFocus disabled={loading} onClick={handleClose}>
          Cancel
        </Button>
        <LoadingButton
          size="small"
          color="error"
          loading={loading}
          onClick={handleConfirm}
          autoFocus>
          Delete
        </LoadingButton>
      </DialogActions>
    </Dialog>
  );
}
