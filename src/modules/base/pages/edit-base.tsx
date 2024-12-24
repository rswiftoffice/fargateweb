import { useEffect } from "react";
import {
  AccessTypes,
  AdminRoles,
  SettingsModules,
} from "../../../auth/permissions/enums";
import usePermissions from "../../../auth/permissions/hooks/usePermissions";
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
import { Base, BaseValues } from "../type";
import { getBaseById, updateBase } from "../baseSlice";

const entity = "Base";

const EditBase = () => {
  const params = useParams<"baseId">();
  const dispatch: AppDispatch = useDispatch();
  const { can, is } = usePermissions();
  const formMethods = useForm<BaseValues>();
  const { handleSubmit, register, setValue, watch } = formMethods;
  const navigate = useNavigate();
  const user = useSelector((state: RootState) => state.login.authenticatedUser);
  const selectedService = watch("service");
  const currentUser = useSelector(
    (state: RootState) => state.login.authenticatedUser
  );

  const updateBaseLoading = useSelector(
    (state: RootState) => state.base.updateStatus === "pending"
  );

  const onSubmit = async (values: BaseValues) => {
    const { name, description, command } = values;
    if (params.baseId) {
      const action = await dispatch(
        updateBase({
          id: +params.baseId,
          name,
          description,
          commandId: command?.id,
        })
      );
      if (isFulfilled(action)) {
        navigate("/bases");
      }
    }
  };

  const setValues = useCallback(
    (record) => {
      if (!record) return;
      setValue("name", record?.name ?? "");
      setValue("description", record?.description ?? "");
      if (record?.commandId && record?.command?.name)
        setValue("command", {
          id: record?.command?.id,
          name: record?.command?.name,
        });
      if (record?.command.serviceId && record?.command?.service.name)
        setValue("service", {
          id: record.command.serviceId,
          name: record?.command?.service?.name ?? "N/A",
        });
      else {
        setValue("service", null);
        setValue("command", null);
      }
    },
    [setValue]
  );

  useEffect(() => {
    if (!selectedService) setValue("command", null);
  }, [selectedService, setValue]);

  useEffect(() => {
    dispatch(setPageTitle("Update Base"));
  }, [dispatch]);

  useEffect(() => {
    if (params.baseId) {
      dispatch(getBaseById(+params.baseId))
        .unwrap()
        .then((data: Base) => {
          setValues(data);
        });
    }
  }, [dispatch, params.baseId, setValues]);
  if (can(AccessTypes.UPDATE, SettingsModules.Base)) {
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
              {is(AdminRoles.SUPER_ADMIN) && (
                <>
                  <Grid item xs={12} md={6} sx={{ pl: 2, pr: 6, pt: 3 }}>
                    <ServiceSelector fieldName="service" required />
                  </Grid>
                  <Grid item xs={12} md={6} sx={{ pl: 2, pr: 6, pt: 3 }}>
                    <CommandSelector
                      fieldName="command"
                      edit={true}
                      service={selectedService?.id ?? currentUser?.serviceId}
                      required
                    />
                  </Grid>
                </>
              )}
              {is(AdminRoles.SERVICES) && (
                <>
                  <Grid item xs={12} md={6} sx={{ pl: 2, pr: 6, pt: 3 }}>
                    <CommandSelector
                      required
                      edit={true}
                      service={user?.serviceId ?? currentUser?.serviceId}
                    />
                  </Grid>
                </>
              )}
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
              <Grid item xs={12} md={12} sx={{ pl: 2, pr: 6, pt: 3 }}>
                <Box display="flex" justifyContent="flex-end" pt={2}>
                  <LoadingButton
                    variant="contained"
                    loading={updateBaseLoading}
                    disabled={updateBaseLoading}
                    type="submit"
                  >
                    {"Update"}
                  </LoadingButton>
                  <Button
                    variant={"outlined"}
                    style={{ alignSelf: "end" }}
                    onClick={() => navigate("/bases")}
                    disabled={updateBaseLoading}
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

export default EditBase;
