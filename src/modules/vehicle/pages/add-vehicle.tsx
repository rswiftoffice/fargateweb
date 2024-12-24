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
import { VehicleValues } from "../type";
import { createVehicle } from "../vehicleSlice";
import BaseSelector from "core/components/BaseSelector";
import SubUnitSelector from "core/components/SubUnitSelector";
import VehicleTypeSelector from "core/components/VehicleTypeSelector";
import VehiclesPlatformSelector from "core/components/VehiclePlatformSelector";

const entity = "Vehicle";

const AddVehicle = () => {
  const { can } = usePermissions();
  const dispatch: AppDispatch = useDispatch();

  useEffect(() => {
    dispatch(setPageTitle(`Add New ${entity}`));
  }, [dispatch]);

  if (can(AccessTypes.CREATE, SettingsModules.Vehicle)) {
    return <AddVehicleForm />;
  }

  return <UnauthorizedContent />;
};

const AddVehicleForm = () => {
  const dispatch: AppDispatch = useDispatch();
  const navigate = useNavigate();
  const { is } = usePermissions();

  const formMethods = useForm<VehicleValues>();
  const { handleSubmit, register, watch, setValue } = formMethods;
  const selectedService = watch("service");
  const selectedCommand = watch("command");
  const selectedBase = watch("base");
  const isServiceable = watch("isServiceable");

  const currentUser = useSelector(
    (state: RootState) => state.login.authenticatedUser
  );
  const currentRole = useSelector(
    (state: RootState) => state.login.currentRole
  );

  const createDataLoading = useSelector(
    (state: RootState) => state.vehicle.createStatus === "pending"
  );

  const handleServiceable = (event: any) => {
    setValue("isServiceable", event.target.checked);
  };

  const onSubmit = async (values: VehicleValues) => {
    const {
      vehicleNumber,
      vehicleType,
      model,
      isServiceable,
      platform,
      subunit,
    } = values;
    console.log(subunit, "===subunit");
    let suUni =
      subunit === null || undefined ? currentUser?.adminSubUnitId : subunit?.id;
    const createAction = await dispatch(
      createVehicle({
        vehicleNumber,
        model,
        isServiceable,
        vehicleType,
        platformId: platform?.id ?? -1,
        subUnitId: suUni,
      })
    );
    if (isFulfilled(createAction)) {
      navigate("/vehicles");
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

  console.log(currentUser, "==currentUser", currentRole);
  useEffect(() => {
    if (
      currentUser &&
      // @ts-ignore
      currentRole === AdminRoles.SUB_UNIT &&
      currentUser.adminSubUnitId
    )
      setValue("subunit", {
        id: currentUser.adminSubUnitId,
        name: currentUser?.adminSubUnit?.name ?? "N/A",
      });
    console.log(
      "hello",
      currentUser?.adminSubUnitId,
      currentUser?.adminSubUnit?.name
    );
  }, [currentRole, currentUser]);
  console.log(currentUser, "-------------------");
  useEffect(() => {
    setValue("isServiceable", false);
  }, [dispatch, setValue]);

  return (
    <Box sx={{ flexGrow: 1 }}>
      <h2 style={{ paddingLeft: 30 }}>Add New {entity}</h2>
      <FormProvider {...formMethods}>
        <form onSubmit={handleSubmit(onSubmit)}>
          <Grid container columns={{ xs: 4, sm: 8, md: 12 }}>
            <Grid item xs={12} md={6} sx={{ pl: 2, pr: 6, pt: 3 }}>
              <FormControl sx={{ width: "100%" }}>
                <TextField
                  label="Vehicle Number"
                  placeholder="Enter vehicle number"
                  {...register("vehicleNumber")}
                  required
                />
              </FormControl>
            </Grid>
            <Grid item xs={12} md={6} sx={{ pl: 2, pr: 6, pt: 3 }}>
              <FormControl sx={{ width: "100%" }}>
                <TextField
                  label="Model"
                  placeholder="Enter model"
                  {...register("model")}
                  required
                />
              </FormControl>
            </Grid>
            <Grid item xs={12} md={6} sx={{ pl: 2, pr: 6, pt: 3 }}>
              <VehicleTypeSelector required />
            </Grid>

            <Grid item xs={12} md={6} sx={{ pl: 2, pr: 6, pt: 3 }}>
              <VehiclesPlatformSelector required />
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
                    service={currentUser?.serviceId || -1}
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
                    command={currentUser?.commandId || -1}
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
                    base={currentUser?.baseAdminId ?? -1}
                  />
                </Grid>
              </>
            )}
            <Grid item xs={12} md={12} sx={{ pl: 2, pr: 6, pt: 3 }}>
              <FormControlLabel
                control={
                  <Switch
                    value={isServiceable}
                    onChange={handleServiceable}
                    color="primary"
                  />
                }
                label="Serviceable"
                labelPlacement="start"
              />
            </Grid>
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
                  onClick={() => navigate("/vehicles")}
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

export default AddVehicle;
