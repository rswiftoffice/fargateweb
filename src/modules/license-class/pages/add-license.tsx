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
import { LicenseValues } from "../types";
import { createLicenseClass } from "../licenseClassSlice";


const AddLicenseClass = () => {
  const entity = "License Class";
  const dispatch: AppDispatch = useDispatch();
  const { can } = usePermissions();
  const formMethods = useForm<LicenseValues>();
  const { handleSubmit, register } = formMethods;

  const createLicenseLoading = useSelector(
    (state: RootState) => state.licenseClass.createStatus === "pending"
  );

  useEffect(() => {
    dispatch(setPageTitle("Add New License Class"));
  }, [dispatch]);

  const onSubmitAddLicense = async (values: LicenseValues) => {
    const createAction = await dispatch(createLicenseClass(values));
    if (isFulfilled(createAction)) {
      navigate("/license-clases");
    }
  };


  const navigate = useNavigate();
  if (can(AccessTypes.CREATE, SettingsModules.LicenseClass)) {
    return (
      <Box sx={{ flexGrow: 1 }}>
        <h2 style={{ paddingLeft: 30 }}>Add New {entity}</h2>
        <FormProvider {...formMethods}>
          <form onSubmit={handleSubmit(onSubmitAddLicense)}>
            <Grid container columns={{ xs: 4, sm: 8, md: 12 }}>
              <Grid item xs={12} md={12} sx={{ pl: 2, pr: 6, pt: 3 }}>
                <FormControl sx={{ width: "100%" }} variant={"filled"}>
                  <TextField
                    label={entity}
                    placeholder={`Enter ${entity}`}
                    {...register("_class")}
                    required
                  />
                </FormControl>
              </Grid>

              <Grid item xs={12} md={12} sx={{ pl: 2, pr: 6, pt: 3 }}>
                <Box display="flex" justifyContent="flex-end" pt={2}>
                  <LoadingButton
                    variant="contained"
                    loading={createLicenseLoading}
                    disabled={createLicenseLoading}
                    type="submit"
                  >
                    {"Submit"}
                  </LoadingButton>
                  <Button
                    variant={"outlined"}
                    style={{ alignSelf: "end" }}
                    onClick={() => navigate("/license-clases")}
                    disabled={createLicenseLoading}
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
export default AddLicenseClass;