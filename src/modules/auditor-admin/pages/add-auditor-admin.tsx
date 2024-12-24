import React, { useEffect } from "react";
import {
  AccessTypes,
  SettingsModules,
  AdminRoles,
} from "auth/permissions/enums";
import usePermissions from "auth/permissions/hooks/usePermissions";
import UnauthorizedContent from "core/components/UnauthorizedContent";
import { LoadingButton } from "@mui/lab";
import {
  Button,
  FormControl,
  FormControlLabel,
  Grid,
  Switch,
  TextField,
} from "@mui/material";
import { Box } from "@mui/system";
import { FormProvider, useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "store";
import { isFulfilled } from "@reduxjs/toolkit";
import { setPageTitle } from "core/layouts/layoutSlice";
import ServiceSelector from "core/components/ServiceSelector";
import CommandSelector from "core/components/CommandSelector";
import BaseSelector from "core/components/BaseSelector";
import SubUnitSelector from "core/components/SubUnitSelector";
import VehicleTypeSelector from "core/components/VehicleTypeSelector";
import VehiclesPlatformSelector from "core/components/VehiclePlatformSelector";
import { AuditorAdminValues } from "../type";
import { createAuditorAdmin } from "../auditorAdminSlice";

const entity = "AuditorAdmin";
const entityName = "Auditor Admin";

const AddAuditorAdmin = () => {
  const { can } = usePermissions();
  const dispatch: AppDispatch = useDispatch();

  useEffect(() => {
    dispatch(setPageTitle(`Add New ${entityName}`));
  }, [dispatch]);

  if (can(AccessTypes.CREATE, SettingsModules.AuditorAdmin)) {
    return <AddAuditorAdminForm />;
  }

  return <UnauthorizedContent />;
};

const AddAuditorAdminForm = () => {
  const dispatch: AppDispatch = useDispatch();
  const navigate = useNavigate();
  const { is, can } = usePermissions();

  const formMethods = useForm<AuditorAdminValues>();
  const { handleSubmit, register, setValue, watch } = formMethods;
  const selectedService = watch("service");
  const selectedCommand = watch("command");
  const selectedBase = watch("base");
  const selectedSubunit = watch("subunit");
  const watchEmail = watch("email");

  const currentUser = useSelector(
    (state: RootState) => state.login.authenticatedUser
  );
  const currentRole = useSelector(
    (state: RootState) => state.login.currentRole
  );

  const createDataLoading = useSelector(
    (state: RootState) => state.auditorAdmin.createStatus === "pending"
  );

  const onSubmit = async (values: AuditorAdminValues) => {
    const { name, description, email, subunit } = values;

    const createAction = await dispatch(
      createAuditorAdmin({
        name,
        description,
        email,
        subUnitId: subunit?.id || -1,
      })
    );
    if (isFulfilled(createAction)) {
      navigate("/auditor-admins");
    }
  };

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
    //@ts-ignore
    if (currentUser && currentRole === AdminRoles.SUB_UNIT)
      setValue("subunit", {
        id: currentUser?.adminSubUnit?.id ?? -1,
        name: currentUser?.adminSubUnit?.name ?? "N/A",
      });
  }, [currentRole, currentUser, setValue]);

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
                <Grid item xs={12} md={6} sx={{ pl: 2, pr: 6, pt: 3 }}>
                  <SubUnitSelector
                    required
                    disabled={!selectedBase}
                    base={selectedBase?.id}
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
                <Grid item xs={12} md={6} sx={{ pl: 2, pr: 6, pt: 3 }}>
                  <SubUnitSelector
                    required
                    disabled={!selectedBase}
                    base={selectedBase?.id}
                  />
                </Grid>
              </>
            )}
            {is(AdminRoles.COMMAND) && (
              <>
                <Grid item xs={12} md={6} sx={{ pl: 2, pr: 6, pt: 3 }}>
                  <BaseSelector
                    required
                    command={currentUser?.command?.id || -1}
                  />
                </Grid>
                <Grid item xs={12} md={6} sx={{ pl: 2, pr: 6, pt: 3 }}>
                  <SubUnitSelector
                    required
                    disabled={!selectedBase}
                    base={selectedBase?.id}
                  />
                </Grid>
              </>
            )}
            {is(AdminRoles.BASE) && (
              <>
                <Grid item xs={12} md={6} sx={{ pl: 2, pr: 6, pt: 3 }}>
                  <SubUnitSelector
                    required
                    base={currentUser?.base?.id ?? -1}
                  />
                </Grid>
              </>
            )}
            <Grid item xs={12} md={12} sx={{ pl: 2, pr: 6, pt: 3 }}>
              <Box display="flex" justifyContent="flex-end" pt={2}>
                <LoadingButton
                  variant="contained"
                  loading={createDataLoading}
                  disabled={createDataLoading}
                  type="submit"
                >
                  {"Submit"}
                </LoadingButton>
                <Button
                  variant={"outlined"}
                  style={{ alignSelf: "end" }}
                  onClick={() => navigate("/auditor-admins")}
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

export default AddAuditorAdmin;
