import { useEffect } from "react";
import {
  AccessTypes,
  AdminRoles,
  SettingsModules,
} from "auth/permissions/enums";
import usePermissions from "auth/permissions/hooks/usePermissions";
import UnauthorizedContent from "core/components/UnauthorizedContent";
import { LoadingButton } from "@mui/lab";
import { Button, FormControl, Grid, TextField } from "@mui/material";
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
import { SubUnitValues } from "../types";
import { getSubunitById, updateSubunit } from "../subunitSlice";
import ErrorView from "core/components/ShowError";

const entity = "SubUnit";

const EditSubunit = () => {
  const params = useParams<"subunitId">();
  const dispatch: AppDispatch = useDispatch();
  const { can, is } = usePermissions();
  const formMethods = useForm<SubUnitValues>();
  const { handleSubmit, register, setValue, watch } = formMethods;
  const navigate = useNavigate();
  const selectedService = watch("service");
  const selectedCommand = watch("command");
  const user = useSelector((state: RootState) => state.login.authenticatedUser);
  const currentRole = useSelector(
    (state: RootState) => state.login.currentRole
  );

  const updateLoading = useSelector(
    (state: RootState) => state.subUnit.updateStatus === "pending"
  );

  const getDetailStatus = useSelector(
    (state: RootState) => state.subUnit.getDetailStatus
  );

  const onSubmit = async (values: SubUnitValues) => {
    const { name, description, base } = values;
    if (params.subunitId && base) {
      const action = await dispatch(
        updateSubunit({
          id: params.subunitId,
          name,
          description,
          baseId: base.id,
        })
      );
      if (isFulfilled(action)) {
        navigate("/subUnits");
      }
    }
  };

  const setValues = useCallback(
    (record) => {
      if (!record) return;
      setValue("name", record?.name ?? "");
      setValue("description", record?.description ?? "");
      if (record.base.command.service && record.base.command.service.id)
        setValue("service", {
          id: record?.base.command.service?.id,
          name: record?.base.command.service?.name,
        });
      if (record?.base.commandId && record.base.command.id)
        setValue("command", {
          id: record.base.command.id,
          name: record.base.command.name,
        });
      if (record?.baseId && record.base.id)
        setValue("base", { id: record.base.id, name: record.base.name });
    },
    [setValue]
  );

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

  useEffect(() => {
    dispatch(setPageTitle("Update Base Admin"));
  }, [dispatch]);

  useEffect(() => {
    if (params.subunitId) {
      dispatch(getSubunitById(+params.subunitId))
        .unwrap()
        .then((data) => {
          setValues(data);
        });
    }
  }, [dispatch, params.subunitId, setValues]);

  useEffect(() => {
    // @ts-ignore
    if (user && currentRole === AdminRoles.BASE && user.base)
      setValue("base", { id: user.base.id, name: user.base.name ?? "N/A" });
  }, [currentRole, user, setValue]);

  if (getDetailStatus === "failed")
    return (
      <ErrorView
        title={`Loading Failed!`}
        desc={`There has been a problem while getting ${entity} data from the database. Try again or Please contact administration!`}
      />
    );

  if (can(AccessTypes.UPDATE, SettingsModules.SubUnits)) {
    return (
      <Box sx={{ flexGrow: 1 }}>
        <h2 style={{ paddingLeft: 30 }}>Edit {entity}</h2>
        <FormProvider {...formMethods}>
          <form onSubmit={handleSubmit(onSubmit)}>
            <Grid container columns={{ xs: 4, sm: 8, md: 12 }}>
              <Grid item xs={12} md={6} sx={{ pl: 2, pr: 6, pt: 3 }}>
                <FormControl sx={{ width: "100%" }} variant={"filled"}>
                  <TextField
                    label="Name"
                    placeholder="Enter name"
                    {...register("name")}
                    InputLabelProps={{ shrink: true }}
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
                    InputLabelProps={{ shrink: true }}
                    required
                    {...register("description")}
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
                      service={selectedService?.id}
                    />
                  </Grid>
                  <Grid item xs={12} md={6} sx={{ pl: 2, pr: 6, pt: 3 }}>
                    <BaseSelector
                      fieldName="base"
                      command={selectedCommand?.id}
                      required
                    />
                  </Grid>

              <Grid item xs={12} md={12} sx={{ pl: 2, pr: 6, pt: 3 }}>
                <Box display="flex" justifyContent="flex-end" pt={2}>
                  <LoadingButton
                    variant="contained"
                    loading={updateLoading}
                    disabled={updateLoading}
                    type="submit"
                  >
                    {"Update"}
                  </LoadingButton>
                  <Button
                    variant={"outlined"}
                    style={{ alignSelf: "end" }}
                    onClick={() => navigate("/subunits")}
                    disabled={updateLoading}
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

export default EditSubunit;
