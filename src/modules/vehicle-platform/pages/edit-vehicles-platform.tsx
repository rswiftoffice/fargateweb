import { useEffect } from "react";
import usePermissions from "auth/permissions/hooks/usePermissions";
import { AccessTypes, SettingsModules } from "auth/permissions/enums";
import { useNavigate, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "store";
import UnauthorizedContent from "core/components/UnauthorizedContent";
import { LoadingButton } from "@mui/lab";
import { Button, FormControl, Grid, TextField } from "@mui/material";
import { Box } from "@mui/system";
import { FormProvider, useForm } from "react-hook-form";
import { isFulfilled } from "@reduxjs/toolkit";
import { setPageTitle } from "core/layouts/layoutSlice";
import { VehiclePlatform } from "../types";
import { updateVehiclesPlatform, getVehiclePlatformById } from "../vehiclePlatformSlice";
import LicenseClassSelector from "core/components/LicenseClassSelector";
import ErrorView from "core/components/ShowError";

const EditVehiclesPlatform = () => {
  const entity = "Vehicles Platform";
  const {vehiclePlatformId} = useParams<"vehiclePlatformId">();
  const dispatch: AppDispatch = useDispatch();
  const { can } = usePermissions();
  const formMethods = useForm<VehiclePlatform>();
  const { handleSubmit, register, setValue } = formMethods;

  const updatePlatformLoading = useSelector(
    (state: RootState) => state.vehiclePlatform.updatePlatformStatus === "pending"
  );

  const detailPlatformStatus = useSelector(
    (state: RootState) => state.vehiclePlatform.detailPlatformStatus
  );

  const navigate = useNavigate();
  
  useEffect(() => {
    dispatch(setPageTitle("Edit Vehicles Platform"));
  }, [dispatch]);

  useEffect(() => {
    if (vehiclePlatformId) {
      dispatch(getVehiclePlatformById(+vehiclePlatformId))
        .unwrap()
        .then((data: VehiclePlatform) => {
          setValue("name", data.name);
          setValue("licenseClass", data.licenseClass);
        });
    }
  }, [vehiclePlatformId])

  const onSubmitUpdatePlatform = async (values: VehiclePlatform) => {
    if (vehiclePlatformId) {
      const dataUpdatePlatform = {
        name: values.name,
        licenseClassId: values.licenseClass.id,
        id: +vehiclePlatformId,
      }
      const createAction = await dispatch(updateVehiclesPlatform(dataUpdatePlatform));
      if (isFulfilled(createAction)) {
        navigate("/vehicle-platform");
      }
    }
  };

  if (detailPlatformStatus === "failed")
    return (
      <ErrorView
        title={`Loading Failed!`}
        desc={`There has been a problem while getting ${entity} data from the database. Try again or Please contact administration!`}
      />
    );
  if (can(AccessTypes.UPDATE, SettingsModules.VehiclePlatform)) {
    return (
      <Box sx={{ flexGrow: 1 }}>
        <h2 style={{ paddingLeft: 30 }}>Edit {entity}</h2>
        <FormProvider {...formMethods}>
          <form onSubmit={handleSubmit(onSubmitUpdatePlatform)}>
            <Grid container columns={{ xs: 4, sm: 8, md: 12 }}>
              <Grid item xs={12} md={6} sx={{ pl: 2, pr: 6, pt: 3 }}>
                <FormControl sx={{ width: "100%" }} variant={"filled"}>
                  <TextField
                    label={entity}
                    placeholder={`Enter ${entity}`}
                    InputLabelProps={{ shrink: true }}
                    {...register("name")}
                    required
                  />
                </FormControl>
              </Grid>

              <Grid item xs={12} md={6} sx={{ pl: 2, pr: 6, pt: 3 }}>
                <LicenseClassSelector required></LicenseClassSelector>
              </Grid>

              <Grid item xs={12} md={12} sx={{ pl: 2, pr: 6, pt: 3 }}>
                <Box display="flex" justifyContent="flex-end" pt={2}>
                  <LoadingButton
                    variant="contained"
                    loading={updatePlatformLoading}
                    disabled={updatePlatformLoading}
                    type="submit"
                  >
                    {"Update"}
                  </LoadingButton>
                  <Button
                    variant={"outlined"}
                    style={{ alignSelf: "end" }}
                    onClick={() => navigate("/vehicle-platform")}
                    disabled={updatePlatformLoading}
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
    )
  }
  return <UnauthorizedContent />;
}
export default EditVehiclesPlatform;