import { useEffect } from "react";
import {
  AccessTypes,
  SettingsModules,
  AdminRoles,
} from "auth/permissions/enums";
import usePermissions from "auth/permissions/hooks/usePermissions";
import UnauthorizedContent from "core/components/UnauthorizedContent";
import { LoadingButton } from "@mui/lab";
import { Button, FormControl, Grid, TextField } from "@mui/material";
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
import { SubUnitAdminValues } from "../type";
import SubUnitSelector from "core/components/SubUnitSelector";
import { createSubUnitAdmin } from "../subUnitAdminSlice";

const entity = "SubUnit Admin";

const AddSubUnitAdmin = () => {
  const dispatch: AppDispatch = useDispatch();
  const { can, is } = usePermissions();
  const formMethods = useForm<SubUnitAdminValues>();
  const { handleSubmit, register, watch } = formMethods;
  const selectedService = watch("service");
  const selectedCommand = watch("command");
  const selectedBase = watch("base");
  const navigate = useNavigate();
  const currentUser = useSelector(
    (state: RootState) => state.login.authenticatedUser
  );
  console.log(selectedService, selectedCommand, selectedBase);
  const createLoading = useSelector(
    (state: RootState) => state.subUnitAdmin.createStatus === "pending"
  );

  const onSubmit = async (values: SubUnitAdminValues) => {
    const { email, subunit } = values;
    const createAction = await dispatch(
      createSubUnitAdmin({ email, subUnitId: subunit?.id })
    );
    if (isFulfilled(createAction)) {
      navigate("/subUnit-admins");
    }
  };

  useEffect(() => {
    dispatch(setPageTitle("Add New SubUnit Admin"));
  }, [dispatch]);

  if (can(AccessTypes.CREATE, SettingsModules.SubUnitsAdmin)) {
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
                <ServiceSelector fieldName="service" required />
              </Grid>
              <Grid item xs={12} md={6} sx={{ pl: 2, pr: 6, pt: 3 }}>
                <CommandSelector
                  required
                  disabled={!selectedService}
                  service={selectedService?.id || -1}
                />
              </Grid>
              <Grid item xs={12} md={6} sx={{ pl: 2, pr: 6, pt: 3 }}>
                <BaseSelector
                  disabled={!selectedCommand}
                  command={selectedCommand?.id || -1}
                  fieldName="base"
                  required
                />
              </Grid>

              <Grid item xs={12} md={6} sx={{ pl: 2, pr: 6, pt: 3 }}>
                <CommandSelector
                  service={currentUser?.serviceId || -1}
                  required
                />
              </Grid>
              <Grid item xs={12} md={6} sx={{ pl: 2, pr: 6, pt: 3 }}>
                <BaseSelector
                  disabled={!selectedCommand}
                  command={selectedCommand?.id || -1}
                  fieldName="base"
                  required
                />
              </Grid>

              <Grid item xs={12} md={6} sx={{ pl: 2, pr: 6, pt: 3 }}>
                <BaseSelector
                  command={currentUser?.commandId || -1}
                  fieldName="base"
                  required
                />
              </Grid>

              <Grid item xs={12} md={6} sx={{ pl: 2, pr: 6, pt: 3 }}>
                <SubUnitSelector
                  required
                  disabled={!selectedBase}
                  base={selectedBase?.id}
                />
              </Grid>
              <Grid item xs={12} md={12} sx={{ pl: 2, pr: 6, pt: 3 }}>
                <Box display="flex" justifyContent="flex-end" pt={2}>
                  <LoadingButton
                    variant="contained"
                    loading={createLoading}
                    disabled={createLoading}
                    type="submit"
                  >
                    {"Submit"}
                  </LoadingButton>
                  <Button
                    variant={"outlined"}
                    style={{ alignSelf: "end" }}
                    onClick={() => navigate("/subUnit-admins")}
                    disabled={createLoading}
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

export default AddSubUnitAdmin;
