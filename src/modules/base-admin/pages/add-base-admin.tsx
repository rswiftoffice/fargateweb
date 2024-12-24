import { useEffect } from "react";
import {
  AccessTypes,
  SettingsModules,
  AdminRoles,
} from "auth/permissions/enums";
import usePermissions from "auth/permissions/hooks/usePermissions";
import UnauthorizedContent from "core/components/UnauthorizedContent";
import { LoadingButton } from "@mui/lab";
import { Button, FormControl, Grid, TextField } from "@mui/material";
import { Box } from "@mui/system";
import { FormProvider, useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "store";
import { isFulfilled } from "@reduxjs/toolkit";
import { setPageTitle } from "core/layouts/layoutSlice";
import ServiceSelector from "core/components/ServiceSelector";
import CommandSelector from "core/components/CommandSelector";
import { BaseAdminValues } from "../type";
import BaseSelector from "core/components/BaseSelector";
import { createBaseAdmin } from "../baseAdminSlice";

const entity = "Base Admin";

const AddBaseAdmin = () => {
  const dispatch: AppDispatch = useDispatch();
  const { can, is } = usePermissions();
  const formMethods = useForm<BaseAdminValues>();
  const { handleSubmit, register, watch } = formMethods;
  const selectedService = watch("service");
  const selectedCommand = watch("command");
  const navigate = useNavigate();
  const currentUser = useSelector(
    (state: RootState) => state.login.authenticatedUser
  );
  console.log(selectedService, selectedCommand);
  const createLoading = useSelector(
    (state: RootState) => state.baseAdmin.createStatus === "pending"
  );

  const onSubmit = async (values: BaseAdminValues) => {
    const { email, base } = values;
    const createAction = await dispatch(
      createBaseAdmin({ email, baseId: base.id })
    );
    if (isFulfilled(createAction)) {
      navigate("/base-admins");
    }
  };

  useEffect(() => {
    dispatch(setPageTitle("Add New Base Admin"));
  }, [dispatch]);

  if (can(AccessTypes.CREATE, SettingsModules.BaseAdmin)) {
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
              {(is(AdminRoles.SUPER_ADMIN) || is(AdminRoles.COMMAND)) && (
                <>
                  <Grid item xs={12} md={6} sx={{ pl: 2, pr: 6, pt: 3 }}>
                    <ServiceSelector fieldName="service" required />
                  </Grid>
                  <Grid item xs={12} md={6} sx={{ pl: 2, pr: 6, pt: 3 }}>
                    <CommandSelector
                      required
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
                      service={selectedService?.id || currentUser?.serviceId}
                    />
                  </Grid>
                </>
              )}
              <Grid item xs={12} md={6} sx={{ pl: 2, pr: 6, pt: 3 }}>
                <BaseSelector
                  required
                  disabled={!selectedCommand}
                  command={selectedCommand?.id || -1}
                />
              </Grid>
              <Grid item xs={12} md={12} sx={{ pl: 2, pr: 6, pt: 3 }}>
                <Box display="flex" justifyContent="flex-end" pt={2}>
                  <LoadingButton
                    variant="contained"
                    loading={createLoading}
                    disabled={createLoading}
                    type="submit"
                  >
                    {"Submit"}
                  </LoadingButton>
                  <Button
                    variant={"outlined"}
                    style={{ alignSelf: "end" }}
                    onClick={() => navigate("/base-admins")}
                    disabled={createLoading}
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

export default AddBaseAdmin;
