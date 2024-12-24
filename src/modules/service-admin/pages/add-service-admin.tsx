import UnauthorizedContent from "core/components/UnauthorizedContent";
import { AccessTypes, SettingsModules } from "auth/permissions/enums";
import usePermissions from "auth/permissions/hooks/usePermissions";
import { LoadingButton } from "@mui/lab";
import { Button, FormControl, Grid, TextField } from "@mui/material";
import { Box } from "@mui/system";
import { FormProvider, useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "store";
import { isFulfilled } from "@reduxjs/toolkit";
import { setPageTitle } from "core/layouts/layoutSlice";
import { ServiceAdminValues } from "../type";
import ServiceSelector from "core/components/ServiceSelector";
import { createServiceAdmin } from "../serviceAdminSlice";
import { useEffect } from "react";

const entity = "Service Admin";

const AddServiceAdmin = () => {
  const dispatch: AppDispatch = useDispatch();
  const { can } = usePermissions();
  const formMethods = useForm<ServiceAdminValues>();
  const { handleSubmit, register } = formMethods;
  const navigate = useNavigate();

  const createServiceAdminLoading = useSelector(
    (state: RootState) => state.serviceAdmin.createStatus === "pending"
  );

  const onSubmit = async (values: ServiceAdminValues) => {
    const { email, service } = values;
    const createAction = await dispatch(
      createServiceAdmin({ email, serviceId: service.id })
    );
    if (isFulfilled(createAction)) {
      navigate("/service-admins");
    }
  };

  useEffect(() => {
    dispatch(setPageTitle("Add New Service Admin"));
  }, [dispatch]);

  if (can(AccessTypes.CREATE, SettingsModules.Service)) {
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
              <Grid item xs={12} md={6} sx={{ pl: 2, pr: 6, pt: 3 }}>
                <ServiceSelector fieldName="service" required={true} />
              </Grid>
              <Grid item xs={12} md={12} sx={{ pl: 2, pr: 6, pt: 3 }}>
                <Box display="flex" justifyContent="flex-end" pt={2}>
                  <LoadingButton
                    variant="contained"
                    loading={createServiceAdminLoading}
                    disabled={createServiceAdminLoading}
                    type="submit"
                  >
                    {"Submit"}
                  </LoadingButton>
                  <Button
                    variant={"outlined"}
                    style={{ alignSelf: "end" }}
                    onClick={() => navigate("/service-admins")}
                    disabled={createServiceAdminLoading}
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

export default AddServiceAdmin;
