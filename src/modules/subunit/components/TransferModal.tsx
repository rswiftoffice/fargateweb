import React, { useCallback, useEffect, useState } from "react";
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
import { FormProvider, useForm } from "react-hook-form";
import ServiceSelector from "core/components/ServiceSelector";
import usePermissions from "auth/permissions/hooks/usePermissions";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "store";
import CommandSelector from "core/components/CommandSelector";
import BaseSelector from "core/components/BaseSelector";
import { AdminRoles } from "auth/permissions/enums";
import SubUnitSelector from "core/components/SubUnitSelector";
import { getSubunitById } from "../subunitSlice";
import { SubUnit } from "../types";
import { GenericSelector } from "core/types/form";

const entity = "SubUnit";

interface SubUnitValues {
  id: number;
  name: string;
}

interface TransferSubUnitProps {
  currentSubUnitId: number;
  newSubUnitId: number;
}

interface TransferForm {
  base: GenericSelector | null;
  service: GenericSelector | null;
  command: GenericSelector | null;
  subunit: GenericSelector | null;
}

interface Props {
  open: boolean;
  data: SubUnitValues | undefined;
  loading?: boolean;
  handleClose: () => void;
  handleConfirm: (data: TransferSubUnitProps) => void;
}
const TransferSubUnitModal = ({
  open,
  data,
  loading = false,
  handleClose,
  handleConfirm,
}: Props) => {
  const formMethods = useForm<TransferForm>();
  const currentUser = useSelector(
    (state: RootState) => state.login.authenticatedUser
  );
  const currentRole = useSelector(
    (state: RootState) => state.login.currentRole
  );
  const { watch, setValue, handleSubmit } = formMethods;
  const { is } = usePermissions();
  const [subUnitDetail, setSubUnitDetails] = useState<SubUnit>();
  const dispatch: AppDispatch = useDispatch();

  const selectedService = watch("service");
  const selectedCommand = watch("command");
  const selectedBase = watch("base");
  const selectedSubUnit = watch("subunit");

  const onSubmit = async (values: TransferForm) => {
    if (!data || !values) return;
    const { subunit } = values;
    if (subunit) {
      handleConfirm({ currentSubUnitId: data.id, newSubUnitId: subunit.id });
    }
  };

  const setValues = useCallback(() => {
    if (subUnitDetail && subUnitDetail?.base) {
      setValue("service", {
        id: subUnitDetail.base?.command?.serviceId ?? -1,
        name: subUnitDetail.base.command?.service?.name ?? "N/A",
      });
      setValue("command", {
        id: subUnitDetail.base?.commandId ?? -1,
        name: subUnitDetail.base.command?.name ?? "N/A",
      });
      setValue("base", {
        id: subUnitDetail.baseId ?? -1,
        name: subUnitDetail.base?.name ?? "N/A",
      });
      if (data) setValue("subunit", data);
    }
  }, [setValue, data, subUnitDetail]);

  useEffect(() => {
    if (data?.id) {
      dispatch(getSubunitById(data.id))
        .unwrap()
        .then((response: SubUnit) => {
          setSubUnitDetails(response);
        });
    }
  }, [dispatch, data]);

  useEffect(() => {
    if (!selectedService) {
      setValue("command", null);
      setValue("base", null);
      setValue("subunit", null);
    }
  }, [selectedService, setValue]);

  useEffect(() => {
    if (!selectedCommand) {
      setValue("base", null);
      setValue("subunit", null);
    }
  }, [selectedCommand, setValue]);

  useEffect(() => {
    if (!selectedBase) {
      setValue("subunit", null);
    }
  }, [selectedBase, setValue]);

  useEffect(() => {
    // @ts-ignore
    if (currentUser && currentRole === AdminRoles.BASE) {
      setValue("base", {
        id: currentUser?.baseAdminId ?? -1,
        name: currentUser?.base?.name ?? "N/A",
      });
    }
  }, [currentRole, currentUser, setValue]);

  useEffect(() => {
    if (currentRole) {
      setValue("service", null);
      setValue("command", null);
      setValue("subunit", null);
    }
  }, [currentRole, setValue]);

  useEffect(() => {
    setValues();
  }, [data, subUnitDetail, setValues]);
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
                      <ServiceSelector fieldName="service" required />
                    </Grid>
                    <Grid item xs={12} md={6} sx={{ pl: 2, pr: 6, pt: 3 }}>
                      <CommandSelector
                        required
                        disabled={!selectedService}
                        service={selectedService?.id}
                      />
                    </Grid>
                    <Grid item xs={12} md={6} sx={{ pl: 2, pr: 6, pt: 3 }}>
                      <BaseSelector
                        required
                        disabled={!selectedCommand}
                        command={selectedCommand?.id}
                      />
                    </Grid>
                  </>
                )}
                {is(AdminRoles.SERVICES) && (
                  <>
                    <Grid item xs={12} md={6} sx={{ pl: 2, pr: 6, pt: 3 }}>
                      <CommandSelector
                        required
                        service={currentUser?.service?.id || -1}
                      />
                    </Grid>
                    <Grid item xs={12} md={6} sx={{ pl: 2, pr: 6, pt: 3 }}>
                      <BaseSelector
                        required
                        disabled={!selectedCommand}
                        command={selectedCommand?.id}
                      />
                    </Grid>
                  </>
                )}
                {is(AdminRoles.COMMAND) && (
                  <>
                    <Grid item xs={12} md={6} sx={{ pl: 2, pr: 6, pt: 3 }}>
                      <BaseSelector
                        required
                        command={currentUser?.commandId || -1}
                      />
                    </Grid>
                  </>
                )}
                <>
                  <Grid item xs={12} md={6} sx={{ pl: 2, pr: 6, pt: 3 }}>
                    <SubUnitSelector
                      disabled={!selectedBase}
                      base={selectedBase?.id}
                      fieldName="subunit"
                      required
                    />
                  </Grid>
                </>
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
            disabled={selectedSubUnit?.id === data?.id || !selectedSubUnit}
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

export default TransferSubUnitModal;
