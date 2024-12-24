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
import { SubUnitAdminValues } from "../type";
import { getSubUnitAdminById, updateSubUnitAdmin } from "../subUnitAdminSlice";
import SubUnitSelector from "core/components/SubUnitSelector";

const entity = "SubUnit Admin";

const EditSubUnitAdmin = () => {
  const params = useParams<"subUnitAdminId">();
  const dispatch: AppDispatch = useDispatch();
  const { can, is } = usePermissions();
  const formMethods = useForm<SubUnitAdminValues>();
  const { handleSubmit, register, setValue, watch } = formMethods;
  const navigate = useNavigate();
  const selectedService = watch("service");
  const selectedCommand = watch("command");
  const selectedBase = watch("base");
  const currentUser = useSelector(
    (state: RootState) => state.login.authenticatedUser
  );
  const currentRole = useSelector(
    (state: RootState) => state.login.currentRole
  );

  const updateSubUnitAdminLoading = useSelector(
    (state: RootState) => state.subUnitAdmin.updateStatus === "pending"
  );

  const onSubmit = async (values: SubUnitAdminValues) => {
    const { subunit } = values;
    if (params.subUnitAdminId && subunit?.id) {
      const action = await dispatch(
        updateSubUnitAdmin({
          userId: +params.subUnitAdminId,
          subUnitId: subunit.id,
        })
      );
      if (isFulfilled(action)) {
        navigate("/subUnit-admins");
      }
    }
  };

  const clearValues = useCallback(() => {
    setValue("service", null);
    setValue("command", null);
    setValue("base", null);
    setValue("subunit", null);
  }, [setValue]);

  const setValues = useCallback(
    (record) => {
      if (!record) return;
      setValue("email", record?.email ?? "");
      if (record?.adminSubUnit && record?.adminSubUnit.id)
        setValue("subunit", {
          id: record?.adminSubUnit.id,
          name: record?.adminSubUnit?.name,
        });
      if (record?.adminSubUnit?.base && record?.adminSubUnit.base.id)
        setValue("base", {
          id: record?.adminSubUnit?.base?.id,
          name: record?.adminSubUnit.base?.name,
        });
      if (
        record?.adminSubUnit?.base?.command &&
        record?.adminSubUnit?.base?.command?.id
      )
        setValue("command", {
          id: record?.adminSubUnit?.base?.command?.id,
          name: record?.adminSubUnit.base?.command?.name,
        });

      if (
        record?.adminSubUnit?.base?.command?.service &&
        record?.adminSubUnit.base.command?.service?.id
      )
        setValue("service", {
          id: record?.adminSubUnit?.base?.command?.service?.id,
          name: record?.adminSubUnit.base?.command?.service?.name,
        });
      else setValue("base", null);
    },
    [setValue]
  );

  useEffect(() => {
    if (!currentUser) return;
    // @ts-ignore
    if (currentRole === AdminRoles.SERVICES)
      setValue("base", {
        id: currentUser?.base?.id ?? -1,
        name: currentUser?.base?.name ?? "N/A",
      });
    else clearValues();
  }, [currentRole, setValue, currentUser, clearValues]);

  useEffect(() => {
    if (!selectedService) {
      setValue("command", null);
      setValue("base", null);
      setValue("subunit", null);
    }
  }, [selectedService, setValue]);

  useEffect(() => {
    if (!selectedCommand) {
      setValue("base", null);
      setValue("subunit", null);
    }
  }, [selectedCommand, setValue]);

  useEffect(() => {
    if (!selectedBase) {
      setValue("subunit", null);
    }
  }, [selectedBase, setValue]);

  useEffect(() => {
    dispatch(setPageTitle("Update Base Admin"));
  }, [dispatch]);

  useEffect(() => {
    if (params.subUnitAdminId) {
      dispatch(getSubUnitAdminById(+params.subUnitAdminId))
        .unwrap()
        .then((data) => {
          setValues(data);
        });
    }
  }, [dispatch, params.subUnitAdminId, setValues]);

  if (can(AccessTypes.UPDATE, SettingsModules.SubUnitsAdmin)) {
    return (
      <Box sx={{ flexGrow: 1 }}>
        <h2 style={{ paddingLeft: 30 }}>Update New {entity}</h2>
        <FormProvider {...formMethods}>
          <form onSubmit={handleSubmit(onSubmit)}>
            <Grid container columns={{ xs: 4, sm: 8, md: 12 }}>
              <Grid item xs={12} md={6} sx={{ pl: 2, pr: 6, pt: 3 }}>
                <FormControl sx={{ width: "100%" }} variant={"filled"}>
                  <TextField
                    label="Microsoft Email"
                    placeholder="Enter email"
                    type="email"
                    InputLabelProps={{ shrink: true }}
                    sx={{ width: "100%" }}
                    disabled
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
                    loading={updateSubUnitAdminLoading}
                    disabled={updateSubUnitAdminLoading}
                    type="submit"
                  >
                    {"Update"}
                  </LoadingButton>
                  <Button
                    variant={"outlined"}
                    style={{ alignSelf: "end" }}
                    onClick={() => navigate("/subUnit-admins")}
                    disabled={updateSubUnitAdminLoading}
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

export default EditSubUnitAdmin;
