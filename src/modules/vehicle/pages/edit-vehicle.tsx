import { useEffect, useState } from "react";
import {
  AccessTypes,
  AdminRoles,
  SettingsModules,
} from "auth/permissions/enums";
import usePermissions from "auth/permissions/hooks/usePermissions";
import UnauthorizedContent from "core/components/UnauthorizedContent";
import { LoadingButton } from "@mui/lab";
import {
  Button,
  CircularProgress,
  FormControl,
  FormControlLabel,
  Grid,
  Switch,
  TextField,
} from "@mui/material";
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
import BaseSelector from "core/components/BaseSelector";
import { VehicleValues, Vehicle } from "../type";
import { getVehicleById, updateVehicle } from "../vehicleSlice";
import ErrorView from "core/components/ShowError";
import VehicleTypeSelector from "core/components/VehicleTypeSelector";
import VehiclesPlatformSelector from "core/components/VehiclePlatformSelector";
import SubUnitSelector from "core/components/SubUnitSelector";
import MakeVehicleAvailableModal from "../components/MakeVehicleAvailableModal";

const entity = "Vehicle";

const EditVehicle = () => {
  const params = useParams<"vehicleId">();
  const { can, is } = usePermissions();
  const dispatch: AppDispatch = useDispatch();

  useEffect(() => {
    dispatch(setPageTitle("Update Vehicle"));
  }, [dispatch]);

  if (can(AccessTypes.UPDATE, SettingsModules.Vehicle)) {
    return <EditVehicleForm vehicleId={+params.vehicleId!} />;
  }
  return <UnauthorizedContent />;
};

const EditVehicleForm = ({ vehicleId }: { vehicleId: number }) => {
  const dispatch: AppDispatch = useDispatch();
  const { can, is } = usePermissions();
  const navigate = useNavigate();

  const formMethods = useForm<VehicleValues>({
    defaultValues: {
      isServiceable: false,
    },
  });
  const { handleSubmit, register, setValue, watch } = formMethods;
  const selectedService = watch("service");
  const selectedCommand = watch("command");
  const selectedBase = watch("base");
  const isServiceable = watch("isServiceable");
  const vehicleNo = watch("vehicleNumber");

  const [showMakeVehicleAvailableModal, setShowMakeVehicleAvailableModal] =
    useState(false);
  const [details, setDetails] = useState<Vehicle>();

  const user = useSelector((state: RootState) => state.login.authenticatedUser);
  const currentRole = useSelector(
    (state: RootState) => state.login.currentRole
  );
  const currentUser = useSelector(
    (state: RootState) => state.login.authenticatedUser
  );

  const updateDataLoading = useSelector(
    (state: RootState) => state.vehicle.updateStatus === "pending"
  );
  const getDetailStatus = useSelector(
    (state: RootState) => state.vehicle.getDetailStatus
  );

  const onSubmit = async (values: VehicleValues) => {
    const {
      vehicleNumber,
      vehicleType,
      model,
      isServiceable,
      platform,
      subunit,
    } = values;
    if (vehicleId) {
      const action = await dispatch(
        updateVehicle({
          id: vehicleId,
          vehicleNumber,
          model,
          isServiceable,
          vehicleType,
          platformId: platform?.id ?? -1,
          subUnitId: subunit?.id ?? -1,
        })
      );
      if (isFulfilled(action)) {
        navigate("/vehicles");
      }
    }
  };

  const handleServiceable = (event: any) => {
    setValue("isServiceable", event.target.checked);
  };

  const setValues = useCallback(
    (record) => {
      if (!record) return;
      setValue("vehicleNumber", record.vehicleNumber);
      setValue("model", record.model);
      setValue("vehicleType", record.vehicleType);
      setValue("isServiceable", record.isServiceable);
      setValue("platform", {
        id: record.platforms.id,
        name: record.platforms.name,
      });
      setValue("service", {
        id: record.subUnit.base.command.service.id,
        name: record.subUnit.base.command.service.name,
      });
      setValue("command", {
        id: record.subUnit.base.command.id,
        name: record.subUnit.base.command.name,
      });
      setValue("base", {
        id: record.subUnit.base.id,
        name: record.subUnit.base.name,
      });
      setValue("subunit", { id: record.subUnitId, name: record.subUnit.name });
    },
    [setValue]
  );

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
    if (user && currentRole === AdminRoles.BASE && user.base?.id)
      setValue("base", { id: user.base?.id, name: user?.base?.name ?? "N/A" });
  }, [currentRole, user, setValue]);

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

  const onMakeVehicleAvailable = () => {
    setShowMakeVehicleAvailableModal(true);
  };

  const getVehicleDetail = useCallback(() => {
    if (vehicleId) {
      dispatch(getVehicleById(+vehicleId))
        .unwrap()
        .then((data) => {
          setValues(data);
          setDetails(data);
        });
    }
  }, [dispatch, vehicleId, setValues]);

  const handleCloseMakeVehicleAvailableModal = useCallback(
    (success?: boolean) => {
      setShowMakeVehicleAvailableModal(false);
      if (success) {
        getVehicleDetail();
      }
    },
    [getVehicleDetail, setShowMakeVehicleAvailableModal]
  );

  useEffect(() => {
    getVehicleDetail();
  }, [getVehicleDetail]);

  if (getDetailStatus === "failed")
    return (
      <ErrorView
        title={`Loading Failed!`}
        desc={`There has been a problem while getting ${entity} data from the database. Try again or Please contact administration!`}
      />
    );
  if (details) {
    return (
      <Box sx={{ flexGrow: 1 }}>
        <h2 style={{ paddingLeft: 30 }}>Edit {entity}</h2>
        <FormProvider {...formMethods}>
          <form onSubmit={handleSubmit(onSubmit)}>
            <Grid container columns={{ xs: 4, sm: 8, md: 12 }}>
              <Grid item xs={12} md={6} sx={{ pl: 2, pr: 6, pt: 3 }}>
                <FormControl sx={{ width: "100%" }} variant={"filled"}>
                  <TextField
                    label="Vehicle Number"
                    placeholder="Enter vehicle number"
                    InputLabelProps={{ shrink: true }}
                    {...register("vehicleNumber")}
                    required
                  />
                </FormControl>
              </Grid>
              <Grid item xs={12} md={6} sx={{ pl: 2, pr: 6, pt: 3 }}>
                <FormControl sx={{ width: "100%" }} variant={"filled"}>
                  <TextField
                    label="Model"
                    placeholder="Enter model"
                    InputLabelProps={{ shrink: true }}
                    {...register("model")}
                    required
                  />
                </FormControl>
              </Grid>
              <Grid item xs={12} md={6} sx={{ pl: 2, pr: 6, pt: 3 }}>
                <VehicleTypeSelector shrink required />
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
                    <CommandSelector required service={user?.serviceId || -1} />
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
                    <BaseSelector required command={user?.commandId || -1} />
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

              <Grid item xs={12} md={6} sx={{ pl: 2, pr: 6, pt: 3 }}>
                <FormControlLabel
                  control={
                    <Switch
                      checked={isServiceable}
                      onChange={handleServiceable}
                      color="primary"
                    />
                  }
                  label="Serviceable"
                  labelPlacement="start"
                />
              </Grid>

              {details?.currentTrip && (
                <Grid item xs={12} md={6} sx={{ pl: 2, pr: 6, pt: 3 }}>
                  <LoadingButton
                    variant="contained"
                    color="success"
                    onClick={onMakeVehicleAvailable}
                  >
                    Make Vehicle Available
                  </LoadingButton>
                </Grid>
              )}

              <Grid item xs={12} md={12} sx={{ pl: 2, pr: 6, pt: 3 }}>
                <Box display="flex" justifyContent="flex-end" pt={2}>
                  <LoadingButton
                    variant="contained"
                    loading={updateDataLoading}
                    disabled={updateDataLoading}
                    type="submit"
                  >
                    {"Update"}
                  </LoadingButton>
                  <Button
                    variant={"outlined"}
                    style={{ alignSelf: "end" }}
                    onClick={() => navigate("/vehicles")}
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
        {details?.currentTrip && (
          <MakeVehicleAvailableModal
            open={showMakeVehicleAvailableModal}
            trip={details.currentTrip}
            eLog={details.eLog}
            handleClose={handleCloseMakeVehicleAvailableModal}
          />
        )}
      </Box>
    );
  }
  return <></>;
};

export default EditVehicle;
