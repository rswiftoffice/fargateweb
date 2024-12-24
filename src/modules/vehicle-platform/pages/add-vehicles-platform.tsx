import { useEffect } from "react";
import usePermissions from "auth/permissions/hooks/usePermissions";
import { AccessTypes, SettingsModules } from "auth/permissions/enums";
import { useNavigate } from "react-router-dom";
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
import { createVehiclesPlatform } from "../vehiclePlatformSlice";
import LicenseClassSelector from "core/components/LicenseClassSelector";

const AddVehiclesPlatform = () => {
  const entity = "Vehicles Platform";
  const dispatch: AppDispatch = useDispatch();
  const { can } = usePermissions();
  const formMethods = useForm<VehiclePlatform>();
  const { handleSubmit, register } = formMethods;

  const addPlatformLoading = useSelector(
    (state: RootState) => state.vehiclePlatform.addPlatformStatus === "pending"
  );

  const navigate = useNavigate();
  
  useEffect(() => {
    dispatch(setPageTitle("Add New Vehicles Platform"));
  }, [dispatch]);

  const onSubmitAddPlatform = async (values: VehiclePlatform) => {
    const dataAddPlatform = {
      name: values.name,
      licenseClassId: values.licenseClass.id,
    }
    const createAction = await dispatch(createVehiclesPlatform(dataAddPlatform));
    if (isFulfilled(createAction)) {
      navigate("/vehicle-platform");
    }
  };

  if (can(AccessTypes.CREATE, SettingsModules.VehiclePlatform)) {
    return (
      <Box sx={{ flexGrow: 1 }}>
        <h2 style={{ paddingLeft: 30 }}>Add New {entity}</h2>
        <FormProvider {...formMethods}>
          <form onSubmit={handleSubmit(onSubmitAddPlatform)}>
            <Grid container columns={{ xs: 4, sm: 8, md: 12 }}>
              <Grid item xs={12} md={6} sx={{ pl: 2, pr: 6, pt: 3 }}>
                <FormControl sx={{ width: "100%" }} variant={"filled"}>
                  <TextField
                    label={entity}
                    placeholder={`Enter ${entity}`}
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
                    loading={addPlatformLoading}
                    disabled={addPlatformLoading}
                    type="submit"
                  >
                    {"Submit"}
                  </LoadingButton>
                  <Button
                    variant={"outlined"}
                    style={{ alignSelf: "end" }}
                    onClick={() => navigate("/vehicle-platform")}
                    disabled={addPlatformLoading}
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
export default AddVehiclesPlatform;