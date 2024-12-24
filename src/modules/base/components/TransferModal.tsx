import { LoadingButton } from "@mui/lab";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Grid,
} from "@mui/material";
import { Box } from "@mui/system";
import { AdminRoles } from "auth/permissions/enums";
import usePermissions from "auth/permissions/hooks/usePermissions";
import BaseSelector from "core/components/BaseSelector";
import CommandSelector from "core/components/CommandSelector";
import ServiceSelector from "core/components/ServiceSelector";
import { GenericSelector } from "core/types/form";
import React, { useEffect, useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "store";
import { getBaseById } from "../baseSlice";
import { Base } from "../type";

const entity = "Base";

interface BaseValues {
  id: number;
  name: string;
}

interface TransferBaseProps {
  currentBaseId: number;
  newBaseId: number;
}

interface Props {
  open: boolean;
  data: BaseValues;
  loading?: boolean;
  handleClose: () => void;
  handleConfirm: (data: TransferBaseProps) => void;
}
const TransferCommandModal = ({
  open,
  data,
  loading = false,
  handleClose,
  handleConfirm,
}: Props) => {
  interface TransferForm {
    base: BaseValues | null;
    service: GenericSelector | null;
    command: GenericSelector | null;
  }

  const formMethods = useForm<TransferForm>();
  const { watch, setValue } = formMethods;
  const { handleSubmit } = formMethods;
  const { is } = usePermissions();
  const currentUser = useSelector(
    (state: RootState) => state.login.authenticatedUser
  );
  const currentRole = useSelector(
    (state: RootState) => state.login.currentRole
  );
  const dispatch: AppDispatch = useDispatch();

  const selectedService: GenericSelector | null = watch("service");
  const selectedCommand: GenericSelector | null = watch("command");
  const selectedBase = watch("base");

  const [baseDetails, setBaseDetails] = useState<Base>();

  const onSubmit = async (values: TransferForm) => {
    const { base } = values;
    handleConfirm({ currentBaseId: data.id, newBaseId: base!.id });
  };

  const setValues = () => {
    if (baseDetails?.command?.serviceId) {
      setValue("service", {
        id: baseDetails.command.service?.id ?? -1,
        name: baseDetails.command.service?.name,
      });
      setValue("command", {
        id: baseDetails.command.id ?? -1,
        name: baseDetails.command.name,
      });
      setValue("base", data);
    }
  };

  useEffect(() => {
    if (data.id) {
      dispatch(getBaseById(data.id))
        .unwrap()
        .then((response) => {
          setBaseDetails(response);
        });
    }
  }, [dispatch, data]);

  useEffect(() => {
    if (!selectedService) {
      setValue("command", null);
      setValue("base", null);
    }
  }, [selectedService, setValue]);

  useEffect(() => {
    if (!selectedCommand) {
      setValue("base", null);
    }
  }, [selectedCommand, setValue]);

  useEffect(() => {
    if (currentRole) {
      setValue("service", null);
      setValue("command", null);
      setValue("base", null);
    }
  }, [currentRole, setValue]);

  useEffect(() => {
    baseDetails && setValues();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data, baseDetails]);
  return (
    <Dialog
      open={open}
      onClose={handleClose}
      maxWidth={"md"}
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
                {is(AdminRoles.SUPER_ADMIN) && (
                  <>
                    <Grid item xs={12} md={6} sx={{ pl: 2, pr: 6, pt: 3 }}>
                      <Box display="flex" justifyContent="flex-end" pt={2}>
                        <ServiceSelector
                          variant={"filled"}
                          fieldName="service"
                          required
                        />
                      </Box>
                    </Grid>
                    <Grid item xs={12} md={6} sx={{ pl: 2, pr: 6, pt: 3 }}>
                      <Box display="flex" justifyContent="flex-end" pt={2}>
                        <CommandSelector
                          variant={"filled"}
                          disabled={!selectedService}
                          service={selectedService?.id}
                          fieldName="command"
                          required
                        />
                      </Box>
                    </Grid>
                  </>
                )}
                {is(AdminRoles.SERVICES) && (
                  <Grid item xs={12} md={6} sx={{ pl: 2, pr: 6, pt: 3 }}>
                    <Box display="flex" justifyContent="flex-end" pt={2}>
                      <CommandSelector
                        variant={"filled"}
                        service={currentUser?.serviceId ?? -1}
                        required
                      />
                    </Box>
                  </Grid>
                )}
                <Grid item xs={12} md={6} sx={{ pl: 2, pr: 6, pt: 3 }}>
                  <Box display="flex" justifyContent="flex-end" pt={2}>
                    <BaseSelector
                      variant={"filled"}
                      disabled={!selectedCommand}
                      command={selectedCommand?.id}
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
            disabled={selectedBase?.id === data?.id || !selectedBase}
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

export default TransferCommandModal;
