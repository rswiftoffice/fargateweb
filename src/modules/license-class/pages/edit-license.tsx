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
import { LicenseValues, LicenseDetail } from "../types";
import { updateLicenseClass, getLicenseById } from "../licenseClassSlice";
import ErrorView from "core/components/ShowError";


const EditLicenseClass = () => {
  const entity = "License Class";
  const {licenseId} = useParams<"licenseId">();
  const dispatch: AppDispatch = useDispatch();
  const { can } = usePermissions();
  const formMethods = useForm<LicenseValues>();
  const { handleSubmit, register, setValue } = formMethods;

  const updateLicenseLoading = useSelector(
    (state: RootState) => state.licenseClass.updateStatus === "pending"
  );
  
  const detailStatus = useSelector(
    (state: RootState) => state.licenseClass.getDetailStatus
  );

  useEffect(() => {
    dispatch(setPageTitle("Edit License Class"));
  }, [dispatch]);

  const onSubmitUpdateLicense = async (values: LicenseValues) => {
    if (licenseId) {
      const dataUpdate = {
        id: parseInt(licenseId),
        _class: values._class
      };
      const updateLicenseAction = await dispatch(updateLicenseClass(dataUpdate));
      if (isFulfilled(updateLicenseAction)) {
        navigate("/license-clases");
      }
    };
  };

  useEffect(() => {
    if (licenseId) {
      dispatch(getLicenseById(parseInt(licenseId)))
        .unwrap()
        .then((data: LicenseDetail) => {
          setValue("_class", data.class);
        });
    }
  }, [dispatch, licenseId, setValue])


  const navigate = useNavigate();

  if (detailStatus === "failed")
    return (
      <ErrorView
        title={`Loading Failed!`}
        desc={`There has been a problem while getting ${entity} data from the database. Try again or Please contact administration!`}
      />
    );

  if (can(AccessTypes.UPDATE, SettingsModules.LicenseClass)) {
    return (
      <Box sx={{ flexGrow: 1 }}>
        <h2 style={{ paddingLeft: 30 }}>Edit {entity}</h2>
        <FormProvider {...formMethods}>
          <form onSubmit={handleSubmit(onSubmitUpdateLicense)}>
            <Grid container columns={{ xs: 4, sm: 8, md: 12 }}>
              <Grid item xs={12} md={12} sx={{ pl: 2, pr: 6, pt: 3 }}>
                <FormControl sx={{ width: "100%" }} variant={"filled"}>
                  <TextField
                    label='Class'
                    placeholder={`Enter ${entity}`}
                    InputLabelProps={{ shrink: true }}
                    {...register("_class")}
                    required
                  />
                </FormControl>
              </Grid>

              <Grid item xs={12} md={12} sx={{ pl: 2, pr: 6, pt: 3 }}>
                <Box display="flex" justifyContent="flex-end" pt={2}>
                  <LoadingButton
                    variant="contained"
                    loading={updateLicenseLoading}
                    disabled={updateLicenseLoading}
                    type="submit"
                  >
                    {"Update"}
                  </LoadingButton>
                  <Button
                    variant={"outlined"}
                    style={{ alignSelf: "end" }}
                    onClick={() => navigate("/license-clases")}
                    disabled={updateLicenseLoading}
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
export default EditLicenseClass;