import React, { useEffect } from "react";
import { AccessTypes, SettingsModules } from "../../../auth/permissions/enums";
import usePermissions from "../../../auth/permissions/hooks/usePermissions";
import UnauthorizedContent from "core/components/UnauthorizedContent";
import { LoadingButton } from "@mui/lab";
import { Button, FormControl, Grid, TextField } from "@mui/material";
import { Box } from "@mui/system";
import { FormProvider, useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "store";
import { createService } from "../serviceSlice";
import { ServiceValues } from "../type";
import { isFulfilled } from "@reduxjs/toolkit";
import { setPageTitle } from "core/layouts/layoutSlice";

const entity = "Service";

const AddService = () => {
  const dispatch: AppDispatch = useDispatch();
  const { can } = usePermissions();
  const formMethods = useForm<ServiceValues>();
  const { handleSubmit, register } = formMethods;
  const navigate = useNavigate();

  const createServiceLoading = useSelector(
    (state: RootState) => state.service.createStatus === "pending"
  );

  const onSubmit = async (values: ServiceValues) => {
    const createAction = await dispatch(createService(values));
    if (isFulfilled(createAction)) {
      navigate("/services");
    }
  };

  useEffect(() => {
    dispatch(setPageTitle("Add New Service"));
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
                    label="Name"
                    placeholder="Enter name"
                    {...register("name")}
                    required
                  />
                </FormControl>
              </Grid>
              <Grid item xs={12} md={6} sx={{ pl: 2, pr: 6, pt: 3 }}>
                <FormControl sx={{ width: "100%" }} variant={"filled"}>
                  <TextField
                    label="Description"
                    placeholder="Enter description"
                    sx={{ width: "100%" }}
                    required
                    {...register("description")}
                  />
                </FormControl>
              </Grid>
              <Grid item xs={12} md={12} sx={{ pl: 2, pr: 6, pt: 3 }}>
                <Box display="flex" justifyContent="flex-end" pt={2}>
                  <LoadingButton
                    variant="contained"
                    loading={createServiceLoading}
                    disabled={createServiceLoading}
                    type="submit"
                  >
                    {"Submit"}
                  </LoadingButton>
                  <Button
                    variant={"outlined"}
                    style={{ alignSelf: "end" }}
                    onClick={() => navigate("/services")}
                    disabled={createServiceLoading}
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

export default AddService;
