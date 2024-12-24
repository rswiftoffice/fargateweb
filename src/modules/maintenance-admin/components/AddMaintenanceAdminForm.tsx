import { useEffect } from "react";
import { AdminRoles } from "auth/permissions/enums";
import usePermissions from "auth/permissions/hooks/usePermissions";
import { LoadingButton } from "@mui/lab";
import { Button, FormControl, Grid, TextField } from "@mui/material";
import { Box } from "@mui/system";
import { FormProvider, useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "store";
import { isFulfilled } from "@reduxjs/toolkit";
import ServiceSelector from "core/components/ServiceSelector";
import CommandSelector from "core/components/CommandSelector";
import BaseSelector from "core/components/BaseSelector";
import { MaintenanceAdminValues } from "../type";
import { createMaintenanceAdmin } from "../maintenanceAdminSlice";

const entityName = "Maintenance Admin";

const AddMaintenanceAdminForm = () => {
  const dispatch: AppDispatch = useDispatch();
  const navigate = useNavigate();
  const { is } = usePermissions();

  const user = useSelector((state: RootState) => state.login.authenticatedUser);
  const createDataLoading = useSelector(
    (state: RootState) => state.maintenanceAdmin.createStatus === "pending"
  );

  const formMethods = useForm<MaintenanceAdminValues>();
  const { handleSubmit, register, watch } = formMethods;
  const selectedService = watch("service");
  const selectedCommand = watch("command");
  const selectedBase = watch("base");
  const watchEmail = watch("email");

  const onSubmit = async (values: MaintenanceAdminValues) => {
    const { name, description, email, base } = values;

    const createAction = await dispatch(
      createMaintenanceAdmin({
        name,
        description,
        email,
        baseId: base?.id ?? -1,
      })
    );
    if (isFulfilled(createAction)) {
      navigate("/maintenance-admins");
    }
  };

  return (
    <Box sx={{ flexGrow: 1 }}>
      <h2 style={{ paddingLeft: 30 }}>Add New {entityName}</h2>
      <FormProvider {...formMethods}>
        <form onSubmit={handleSubmit(onSubmit)}>
          <Grid container columns={{ xs: 4, sm: 8, md: 12 }}>
            <Grid item xs={12} md={6} sx={{ pl: 2, pr: 6, pt: 3 }}>
              <FormControl sx={{ width: "100%" }}>
                <TextField
                  label="Name"
                  placeholder="Enter name"
                  {...register("name")}
                  required
                />
              </FormControl>
            </Grid>
            <Grid item xs={12} md={6} sx={{ pl: 2, pr: 6, pt: 3 }}>
              <FormControl sx={{ width: "100%" }}>
                <TextField
                  label="Description"
                  placeholder="Enter description"
                  {...register("description")}
                  required
                />
              </FormControl>
            </Grid>
            <Grid item xs={12} md={6} sx={{ pl: 2, pr: 6, pt: 3 }}>
              <FormControl sx={{ width: "100%" }}>
                <TextField
                  label="Email"
                  placeholder="Enter Email"
                  {...register("email")}
                  required
                  type="email"
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
                  <CommandSelector required service={user?.service?.id || -1} />
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
                  <BaseSelector required command={user?.commandId || -1} />
                </Grid>
              </>
            )}
            <Grid item xs={12} md={12} sx={{ pl: 2, pr: 6, pt: 3 }}>
              <Box display="flex" justifyContent="flex-end" pt={2}>
                <LoadingButton
                  variant="contained"
                  loading={createDataLoading}
                  disabled={createDataLoading || !selectedBase || !watchEmail}
                  type="submit"
                >
                  {"Submit"}
                </LoadingButton>
                <Button
                  variant={"outlined"}
                  style={{ alignSelf: "end" }}
                  onClick={() => navigate(-1)}
                  disabled={createDataLoading}
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

export default AddMaintenanceAdminForm;
