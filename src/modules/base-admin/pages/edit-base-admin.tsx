import { useEffect } from "react";
import {
  AccessTypes,
  AdminRoles,
  SettingsModules,
} from "auth/permissions/enums";
import usePermissions from "auth/permissions/hooks/usePermissions";
import UnauthorizedContent from "core/components/UnauthorizedContent";
import { LoadingButton } from "@mui/lab";
import { Button, FormControl, Grid, TextField } from "@mui/material";
import { Box } from "@mui/system";
import { FormProvider, useForm } from "react-hook-form";
import { useNavigate, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "store";
import { setPageTitle } from "core/layouts/layoutSlice";
import { useCallback } from "react";
import { isFulfilled } from "@reduxjs/toolkit";
import ServiceSelector from "core/components/ServiceSelector";
import CommandSelector from "core/components/CommandSelector";
import { BaseAdminValues } from "../type";
import BaseSelector from "core/components/BaseSelector";
import { getBaseAdminById, updateBaseAdmin } from "../baseAdminSlice";

const entity = "Base Admin";

const EditBaseAdmin = () => {
  const params = useParams<"baseAdminId">();
  const dispatch: AppDispatch = useDispatch();
  const { can, is } = usePermissions();
  const formMethods = useForm<BaseAdminValues>();
  const { handleSubmit, register, setValue, watch } = formMethods;
  const navigate = useNavigate();
  const selectedService = watch("service");
  const selectedCommand = watch("command");
  const currentUser = useSelector(
    (state: RootState) => state.login.authenticatedUser
  );

  console.log(selectedService, "===selectedService", currentUser);

  const updateBaseAdminLoading = useSelector(
    (state: RootState) => state.baseAdmin.updateStatus === "pending"
  );

  const onSubmit = async (values: BaseAdminValues) => {
    const { base } = values;
    if (params.baseAdminId) {
      const action = await dispatch(
        updateBaseAdmin({
          userId: +params.baseAdminId,
          baseId: base.id,
        })
      );
      if (isFulfilled(action)) {
        navigate("/base-admins");
      }
    }
  };

  const setValues = useCallback(
    (record) => {
      if (!record) return;

      setValue("email", record?.email ?? "");
      if (record.base?.command?.service)
        setValue("service", {
          id: record.base.command.service.id,
          name: record.base.command.service.name,
        });
      if (record.base?.command)
        setValue("command", {
          id: record.base.command.id,
          name: record.base.command.name,
        });
      if (record?.baseAdminId && record.base)
        setValue("base", { id: record.base.id, name: record.base.name });
    },
    [setValue]
  );

  useEffect(() => {
    if (!selectedService) setValue("command", null);
  }, [selectedService, setValue]);

  useEffect(() => {
    dispatch(setPageTitle("Update Base Admin"));
  }, [dispatch]);

  useEffect(() => {
    if (params.baseAdminId) {
      dispatch(getBaseAdminById(+params.baseAdminId))
        .unwrap()
        .then((data) => {
          setValues(data);
        });
    }
  }, [dispatch, params.baseAdminId, setValues]);

  if (can(AccessTypes.UPDATE, SettingsModules.Base)) {
    return (
      <Box sx={{ flexGrow: 1 }}>
        <h2 style={{ paddingLeft: 30 }}>Update New {entity}</h2>
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
                <>
                  <Grid item xs={12} md={6} sx={{ pl: 2, pr: 6, pt: 3 }}>
                    <ServiceSelector fieldName="service" required />
                  </Grid>
                  <Grid item xs={12} md={6} sx={{ pl: 2, pr: 6, pt: 3 }}>
                    <CommandSelector
                      required
                      edit={true}
                      disabled={!selectedService}
                      service={selectedService?.id || -1}
                    />
                  </Grid>
                </>
              )}
              {is(AdminRoles.SERVICES) && (
                <>
                  <Grid item xs={12} md={6} sx={{ pl: 2, pr: 6, pt: 3 }}>
                    <CommandSelector
                      required
                      edit={true}
                      disabled={!selectedService}
                      service={selectedService?.id || currentUser?.serviceId}
                    />
                  </Grid>
                </>
              )}
              <Grid item xs={12} md={6} sx={{ pl: 2, pr: 6, pt: 3 }}>
                <BaseSelector
                  required
                  edit={true}
                  disabled={!selectedCommand}
                  command={selectedCommand?.id || currentUser?.baseAdminId}
                />
              </Grid>
              <Grid item xs={12} md={12} sx={{ pl: 2, pr: 6, pt: 3 }}>
                <Box display="flex" justifyContent="flex-end" pt={2}>
                  <LoadingButton
                    variant="contained"
                    loading={updateBaseAdminLoading}
                    disabled={updateBaseAdminLoading}
                    type="submit"
                  >
                    {"Update"}
                  </LoadingButton>
                  <Button
                    variant={"outlined"}
                    style={{ alignSelf: "end" }}
                    onClick={() => navigate("/base-admins")}
                    disabled={updateBaseAdminLoading}
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
  }

  return <UnauthorizedContent />;
};

export default EditBaseAdmin;
