import React, { useCallback, useEffect, useState } from "react";
import { LoadingButton } from "@mui/lab";
import { Button, FormControl, Grid, TextField } from "@mui/material";
import { Box } from "@mui/system";
import { FormProvider, useForm } from "react-hook-form";
import usePermissions from "../../../auth/permissions/hooks/usePermissions";
import ErrorView from "../../../core/components/ShowError";
import CommandSelector from "../../../core/components/CommandSelector";
import { CommandAdmin, CommandAdminValues } from "../type";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { getCommandAdminById, updateCommandAdmin } from "../commandAdminSlice";
import { AppDispatch, RootState } from "../../../store";
import { setPageTitle } from "../../../core/layouts/layoutSlice";
import ServiceSelector from "../../../core/components/ServiceSelector";
import { isFulfilled } from "@reduxjs/toolkit";
import {
  AccessTypes,
  AdminRoles,
  SettingsModules,
} from "auth/permissions/enums";
import UnauthorizedContent from "core/components/UnauthorizedContent";

const entity = "Command Admin";

const EditCommandAdmin = () => {
  const params = useParams<"commandAdminId">();
  const { can } = usePermissions();

  if (can(AccessTypes.UPDATE, SettingsModules.CommandAdmin)) {
    return <Form commandAdminId={+params.commandAdminId!} />;
  }

  return <UnauthorizedContent />;
};

const Form = ({ commandAdminId }: { commandAdminId: number }) => {
  const formMethods = useForm<CommandAdminValues>();
  const { handleSubmit, register, setValue, watch } = formMethods;
  const selectedService = watch("service");
  const selectedCommand = watch("command");
  const dispatch: AppDispatch = useDispatch();
  const user = useSelector((state: RootState) => state.login.authenticatedUser);
  const { is } = usePermissions();
  const navigate = useNavigate();
  const currentRole = useSelector(
    (state: RootState) => state.login.currentRole
  );
  const updateCommandAdminLoading = useSelector(
    (state: RootState) => state.commandAdmin.updateStatus === "pending"
  );

  const [commandAdminData, setCommandAdminData] = useState<CommandAdmin>();

  const getDetailStatus = useSelector(
    (state: RootState) => state.commandAdmin.getDetailStatus
  );

  const setValues = useCallback(
    (record: any) => {
      if (!record) return;
      setValue("email", record?.email || "");
      if (record?.command && record.command.id)
        setValue("command", {
          id: record.command.id,
          name: record.command.name,
        });
      if (record?.command?.service && record.command.service.id)
        setValue("service", {
          id: record?.command.service?.id,
          name: record?.command.service?.name,
        });
      else setValue("service", null);
    },
    [setValue]
  );

  useEffect(() => {
    dispatch(setPageTitle("Update Command Admin"));
  }, [dispatch]);

  useEffect(() => {
    if (commandAdminId) {
      dispatch(getCommandAdminById(commandAdminId))
        .unwrap()
        .then((data: any) => {
          setCommandAdminData(data);
          setValues(data);
        });
    }
  }, [dispatch, commandAdminId, setValues]);

  const onSubmit = async (values: CommandAdminValues) => {
    const { command } = values;
    const action = await dispatch(
      updateCommandAdmin({
        userId: Number(commandAdminId),
        commandId: command?.id,
      })
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
    if (!selectedService) setValue("command", null);
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

  if (getDetailStatus === "failed")
    return (
      <ErrorView
        title={`Loading Failed!`}
        desc={`There has been a problem while getting ${entity} data from the database. Try again or Please contact administration!`}
      />
    );
  return (
    <Box sx={{ flexGrow: 1 }}>
      <h2 style={{ paddingLeft: 30 }}>Update {entity}</h2>
      <FormProvider {...formMethods}>
        <form onSubmit={handleSubmit(onSubmit)}>
          <Grid container columns={{ xs: 4, sm: 8, md: 12 }}>
            <Grid item xs={12} md={6} sx={{ pl: 2, pr: 6, pt: 3 }}>
              <FormControl sx={{ width: "100%" }} variant={"filled"}>
                <TextField
                  label="Microsoft Email"
                  placeholder="Enter email"
                  type="email"
                  InputLabelProps={{ shrink: true }}
                  sx={{ width: "100%" }}
                  disabled
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
                  loading={updateCommandAdminLoading}
                  disabled={
                    updateCommandAdminLoading ||
                    (commandAdminData &&
                      selectedCommand &&
                      selectedCommand?.id === commandAdminData?.command?.id) ||
                    !selectedCommand
                  }
                  type="submit"
                >
                  {"Update"}
                </LoadingButton>
                <Button
                  variant={"outlined"}
                  style={{ alignSelf: "end" }}
                  onClick={() => navigate("/command-admins")}
                  disabled={updateCommandAdminLoading}
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

export default EditCommandAdmin;
