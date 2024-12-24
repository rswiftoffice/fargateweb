import { LoadingButton } from "@mui/lab";
import { Box, Grid, FormControl, TextField, Button } from "@mui/material";
import { isFulfilled } from "@reduxjs/toolkit";
import { AdminRoles } from "auth/permissions/enums";
import usePermissions from "auth/permissions/hooks/usePermissions";
import BaseSelector from "core/components/BaseSelector";
import CommandSelector from "core/components/CommandSelector";
import ServiceSelector from "core/components/ServiceSelector";
import ErrorView from "core/components/ShowError";
import { useCallback, useEffect, useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { AppDispatch, RootState } from "store";
import {
  getMaintenanceAdminById,
  updateMaintenanceAdmin,
} from "../maintenanceAdminSlice";
import { MaintenanceAdmin, MaintenanceAdminValues } from "../type";

const entityName = "Maintenance Admin";

const EditMaintenanceAdminForm = ({ id }: { id: number }) => {
  const dispatch: AppDispatch = useDispatch();
  const { can, is } = usePermissions();
  const navigate = useNavigate();

  const formMethods = useForm<MaintenanceAdminValues>();
  const { handleSubmit, register, setValue, watch } = formMethods;
  const selectedService = watch("service");
  const selectedCommand = watch("command");
  const selectedBase = watch("base");

  const user = useSelector((state: RootState) => state.login.authenticatedUser);
  const currentRole = useSelector(
    (state: RootState) => state.login.currentRole
  );

  const [details, setDetails] = useState<MaintenanceAdmin>();
  const updateDataLoading = useSelector(
    (state: RootState) => state.maintenanceAdmin.updateStatus === "pending"
  );
  const getDetailStatus = useSelector(
    (state: RootState) => state.maintenanceAdmin.getDetailStatus
  );

  const onSubmit = async (values: MaintenanceAdminValues) => {
    const { name, description, email, base } = values;
    const action = await dispatch(
      updateMaintenanceAdmin({
        id: id,
        name,
        email,
        description,
        baseId: base?.id ?? -1,
      })
    );
    if (isFulfilled(action)) {
      navigate("/maintenance-admins");
    }
  };

  const setValues = useCallback(
    (record: MaintenanceAdmin) => {
      if (!record) return;
      setValue("name", record.name);
      setValue("description", record.description);
      setValue("email", record.user.email);
      setValue("service", {
        id: record.base?.command?.service?.id ?? -1,
        name: record.base?.command?.service?.name ?? "N/A",
      });
      setValue("command", {
        id: record.base?.command?.id ?? -1,
        name: record.base?.command?.name ?? "N/A",
      });
      setValue("base", { id: record.base.id, name: record.base.name });
    },
    [setValue]
  );

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
    //@ts-ignore
    if (user && currentRole === AdminRoles.BASE)
      setValue("base", {
        id: user?.base?.id ?? -1,
        name: user?.base?.name ?? "N/A",
      });
  }, [currentRole, user, setValue]);

  useEffect(() => {
    dispatch(getMaintenanceAdminById(id))
      .unwrap()
      .then((data: MaintenanceAdmin) => {
        setValues(data);
        setDetails(data);
      });
  }, [dispatch, id, setValues]);

  if (getDetailStatus === "failed")
    return (
      <ErrorView
        title={`Loading Failed!`}
        desc={`There has been a problem while getting ${entityName} data from the database. Try again or Please contact administration!`}
      />
    );

  if (details) {
    return (
      <Box sx={{ flexGrow: 1 }}>
        <h2 style={{ paddingLeft: 30 }}>Edit {entityName}</h2>
        <FormProvider {...formMethods}>
          <form onSubmit={handleSubmit(onSubmit)}>
            <Grid container columns={{ xs: 4, sm: 8, md: 12 }}>
              <Grid item xs={12} md={6} sx={{ pl: 2, pr: 6, pt: 3 }}>
                <FormControl sx={{ width: "100%" }}>
                  <TextField
                    label="Name"
                    placeholder="Enter name"
                    InputLabelProps={{ shrink: true }}
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
                    InputLabelProps={{ shrink: true }}
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
                    InputLabelProps={{ shrink: true }}
                    {...register("email")}
                    required
                    disabled
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
                    <CommandSelector
                      required
                      service={user?.service?.id || -1}
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
                    <BaseSelector required command={user?.command?.id || -1} />
                  </Grid>
                </>
              )}

              <Grid item xs={12} md={12} sx={{ pl: 2, pr: 6, pt: 3 }}>
                <Box display="flex" justifyContent="flex-end" pt={2}>
                  <LoadingButton
                    variant="contained"
                    loading={updateDataLoading}
                    disabled={updateDataLoading || !selectedBase}
                    type="submit"
                  >
                    {"Update"}
                  </LoadingButton>
                  <Button
                    variant={"outlined"}
                    style={{ alignSelf: "end" }}
                    onClick={() => navigate(-1)}
                    disabled={updateDataLoading}
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
  return <></>;
};

export default EditMaintenanceAdminForm;
