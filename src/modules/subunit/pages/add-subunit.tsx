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
import { SubUnitValues } from "../types";
import { createSubunit } from "../subunitSlice";

const entity = "SubUnit";

const AddSubUnit = () => {
  const dispatch: AppDispatch = useDispatch();
  const { can, is } = usePermissions();
  const formMethods = useForm<SubUnitValues>();
  const { handleSubmit, register, watch } = formMethods;
  const selectedService = watch("service");
  const selectedCommand = watch("command");
  const navigate = useNavigate();
  const user = useSelector((state: RootState) => state.login.authenticatedUser);

  const createLoading = useSelector(
    (state: RootState) => state.subUnit.createStatus === "pending"
  );

  const onSubmit = async (values: SubUnitValues) => {
    const { name, description, base } = values;
    const createAction = await dispatch(
      createSubunit({ name, description, baseId: base?.id })
    );
    if (isFulfilled(createAction)) {
      navigate("/subunits");
    }
  };

  useEffect(() => {
    dispatch(setPageTitle("Add New SubUnit"));
  }, [dispatch]);

  if (can(AccessTypes.CREATE, SettingsModules.SubUnits)) {
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
              {/* {is(AdminRoles.SUPER_ADMIN) && (
              <Grid item xs={12} md={6} sx={{ pl: 2, pr: 6, pt: 3 }}>
                <BaseSelector fieldName="base" required />
              </Grid>
            )} */}

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
                    loading={createLoading}
                    disabled={createLoading}
                    type="submit"
                  >
                    {"Submit"}
                  </LoadingButton>
                  <Button
                    variant={"outlined"}
                    style={{ alignSelf: "end" }}
                    onClick={() => navigate("/subunits")}
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

export default AddSubUnit;
