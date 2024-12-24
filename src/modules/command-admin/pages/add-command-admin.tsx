import React, { useCallback, useEffect } from "react";
import { LoadingButton } from "@mui/lab";
import { Button, FormControl, Grid, TextField } from "@mui/material";
import { Box } from "@mui/system";
import { FormProvider, useForm } from "react-hook-form";
import usePermissions from "../../../auth/permissions/hooks/usePermissions";
import CommandSelector from "../../../core/components/CommandSelector";
import { useDispatch, useSelector } from "react-redux";
import { addCommandAdmin } from "../commandAdminSlice";
import { useNavigate } from "react-router-dom";
import { CommandAdminValues } from "../type";
import { AppDispatch, RootState } from "../../../store";
import { setPageTitle } from "../../../core/layouts/layoutSlice";
import ServiceSelector from "../../../core/components/ServiceSelector";
import { isFulfilled } from "@reduxjs/toolkit";
import { AdminRoles } from "auth/permissions/enums";
import { AccessTypes, SettingsModules } from "auth/permissions/enums";
import UnauthorizedContent from "core/components/UnauthorizedContent";

const entity = "Command Admin";

const AddCommandAdmin = () => {
  const { can } = usePermissions();

  if (can(AccessTypes.CREATE, SettingsModules.CommandAdmin)) {
    return <Form />;
  }

  return <UnauthorizedContent />;
};

const Form = () => {
  const formMethods = useForm<CommandAdminValues>();
  const dispatch: AppDispatch = useDispatch();
  const navigate = useNavigate();

  const { handleSubmit, watch, register, setValue } = formMethods;
  const user = useSelector((state: RootState) => state.login.authenticatedUser);
  const currentRole = useSelector(
    (state: RootState) => state.login.currentRole
  );
  const { is } = usePermissions();
  const selectedService = watch("service");

  const isLoading = useSelector(
    (state: RootState) => state.commandAdmin.createStatus === "pending"
  );

  const onSubmit = async (values: CommandAdminValues) => {
    const { email, command } = values;
    const action = await dispatch(
      addCommandAdmin({ email, commandId: command?.id })
    );
    if (isFulfilled(action)) {
      navigate("/command-admins");
    }
  };

  const clearValues = useCallback(() => {
    setValue("service", null);
    setValue("command", null);
  }, [setValue]);

  useEffect(() => {
    dispatch(setPageTitle("Add New Command Admin"));
  }, [dispatch]);

  useEffect(() => {
    if (selectedService) setValue("command", null);
  }, [selectedService, setValue]);

  useEffect(() => {
    if (!user) return;
    // @ts-ignore
    if (currentRole === AdminRoles.SERVICES)
      setValue("service", {
        id: user?.serviceId ?? -1,
        name: user?.service?.name ?? "N/A",
      });
    else clearValues();
  }, [currentRole, setValue, user, clearValues]);

  return (
    <Box sx={{ flexGrow: 1 }}>
      <h2 style={{ paddingLeft: 30 }}>Add New {entity}</h2>
      <FormProvider {...formMethods}>
        <form onSubmit={handleSubmit(onSubmit)}>
          <Grid container columns={{ xs: 4, sm: 8, md: 12 }}>
            <Grid item xs={12} md={6} sx={{ pl: 2, pr: 6, pt: 3 }}>
              <FormControl sx={{ width: "100%" }} variant={"filled"}>
                <TextField
                  label="Microsoft Email"
                  placeholder="Enter email"
                  type="email"
                  sx={{ width: "100%" }}
                  required
                  {...register("email")}
                />
              </FormControl>
            </Grid>
            {is(AdminRoles.SUPER_ADMIN) && (
              <Grid item xs={12} md={6} sx={{ pl: 2, pr: 6, pt: 3 }}>
                <ServiceSelector fieldName="service" required />
              </Grid>
            )}
            <Grid item xs={12} md={6} sx={{ pl: 2, pr: 6, pt: 3 }}>
              <CommandSelector
                required
                disabled={!selectedService}
                service={selectedService?.id}
              />
            </Grid>
            <Grid item xs={12} md={12} sx={{ pl: 2, pr: 6, pt: 3 }}>
              <Box display="flex" justifyContent="flex-end" pt={2}>
                <LoadingButton
                  variant="contained"
                  loading={isLoading}
                  disabled={isLoading}
                  type="submit"
                >
                  {"Submit"}
                </LoadingButton>
                <Button
                  variant={"outlined"}
                  style={{ alignSelf: "end" }}
                  onClick={() => navigate("/command-admins")}
                  disabled={isLoading}
                  disableElevation
                  sx={{ ml: 2 }}
                >
                  {"Cancel"}
                </Button>
              </Box>
            </Grid>
          </Grid>
        </form>
      </FormProvider>
    </Box>
  );
};



export default AddCommandAdmin;
