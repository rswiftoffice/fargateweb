import { LoadingButton } from "@mui/lab";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  Grid,
  DialogContentText,
  DialogActions,
  Button,
} from "@mui/material";
import { Box } from "@mui/system";
import React, { useEffect } from "react";
import { FormProvider, useForm } from "react-hook-form";
import ServiceSelector from "../../../core/components/ServiceSelector";

const entity = "Service";

interface ServiceValues {
  id: number;
  name: string;
}

interface TransferServiceProps {
  currentServiceId: number;
  newServiceId: number;
}

interface Props {
  open: boolean;
  data: ServiceValues | undefined;
  loading?: boolean;
  handleClose: () => void;
  handleConfirm: (data: TransferServiceProps) => void;
}
const TransferServiceModal = ({
  open,
  data,
  loading = false,
  handleClose,
  handleConfirm,
}: Props) => {
  const formMethods = useForm<{ service: ServiceValues }>();
  const { watch, setValue } = formMethods;
  const { handleSubmit } = formMethods;
  const serviceData = watch("service");

  const onSubmit = async (values: { service: ServiceValues }) => {
    if (!data || !values) return;
    const { service } = values;
    handleConfirm({ currentServiceId: data.id, newServiceId: service.id });
  };
  useEffect(() => {
    if (data) setValue("service", data);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data]);
  return (
    <Dialog
      open={open}
      onClose={handleClose}
      maxWidth={"xs"}
      fullWidth
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
    >
      <DialogTitle id="alert-dialog-title">Transferring {entity}</DialogTitle>
      {/* //TODO: write a proper line to alert the user to know what will happen */}
      <form onSubmit={handleSubmit(onSubmit)}>
        <DialogContent dividers>
          <DialogContentText id="alert-dialog-description">{`Some warning related to this working`}</DialogContentText>
          <Box sx={{ flexGrow: 1 }}>
            <FormProvider {...formMethods}>
              <Grid container columns={{ xs: 4, sm: 8, md: 12 }}>
                <Grid item xs={12} md={12} sx={{ pl: 2, pr: 6, pt: 3 }}>
                  <Box display="flex" justifyContent="flex-end" pt={2}>
                    <ServiceSelector
                      variant={"filled"}
                      fieldName="service"
                      required
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
            onClick={handleClose}
          >
            Cancel
          </Button>
          <LoadingButton
            size="small"
            color="error"
            disabled={serviceData?.id === data?.id || !serviceData}
            loading={loading}
            autoFocus
            type={"submit"}
          >
            {"Transfer & Delete"}
          </LoadingButton>
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default TransferServiceModal;
