import { useEffect, useState } from "react";
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
import ErrorView from "core/components/ShowError";
import SubUnitSelector from "core/components/SubUnitSelector";
import { AuditorAdmin, AuditorAdminValues } from "../type";
import { getAuditorAdminById, updateAuditorAdmin } from "../auditorAdminSlice";

const entity = "Auditor Admin";

const EditAuditorAdmin = () => {
  const params = useParams<"auditorAdminId">();
  const { can } = usePermissions();
  const dispatch: AppDispatch = useDispatch();

  useEffect(() => {
    dispatch(setPageTitle("Update Auditor Admin"));
  }, [dispatch]);

  if (can(AccessTypes.UPDATE, SettingsModules.AuditorAdmin)) {
    return <EditAuditorAdminForm auditorAdminId={+params.auditorAdminId!} />;
  }

  return <UnauthorizedContent />;
};

const EditAuditorAdminForm = ({
  auditorAdminId,
}: {
  auditorAdminId: number;
}) => {
  const dispatch: AppDispatch = useDispatch();
  const { can, is } = usePermissions();
  const navigate = useNavigate();

  const formMethods = useForm<AuditorAdminValues>();
  const { handleSubmit, register, setValue, watch } = formMethods;
  const selectedService = watch("service");
  const selectedCommand = watch("command");
  const selectedBase = watch("base");
  const selectedSubunit = watch("subunit");

  const user = useSelector((state: RootState) => state.login.authenticatedUser);
  const currentRole = useSelector(
    (state: RootState) => state.login.currentRole
  );

  const [details, setDetails] = useState<AuditorAdmin>();
  const updateDataLoading = useSelector(
    (state: RootState) => state.auditorAdmin.updateStatus === "pending"
  );
  const getDetailStatus = useSelector(
    (state: RootState) => state.auditorAdmin.getDetailStatus
  );

  const onSubmit = async (values: AuditorAdminValues) => {
    const { name, description, subunit } = values;
    const action = await dispatch(
      updateAuditorAdmin({
        id: auditorAdminId,
        name,
        description,
        subUnitId: subunit?.id ?? -1,
      })
    );
    if (isFulfilled(action)) {
      navigate("/auditor-admins");
    }
  };

  const setValues = useCallback(
    (record: AuditorAdmin) => {
      if (!record) return;
      setValue("name", record.name);
      setValue("description", record.description);
      setValue("email", record.user.email);
      setValue("service", {
        id: record.subUnit?.base?.command?.service?.id ?? -1,
        name: record.subUnit?.base?.command?.service?.name ?? "N/A",
      });
      setValue("command", {
        id: record.subUnit?.base?.command?.id ?? -1,
        name: record.subUnit?.base?.command?.name ?? "N/A",
      });
      setValue("base", {
        id: record.subUnit?.base?.id ?? -1,
        name: record.subUnit?.base?.name ?? "N/A",
      });
      setValue("subunit", {
        id: record.subUnit?.id ?? -1,
        name: record.subUnit.name,
      });
    },
    [setValue]
  );

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
    details && setValues(details);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [details]);

  useEffect(() => {
    //@ts-ignore
    if (user && currentRole === AdminRoles.SUB_UNIT)
      setValue("subunit", {
        id: user?.adminSubUnit?.id ?? -1,
        name: user?.adminSubUnit?.name ?? "N/A",
      });
  }, [currentRole, user, setValue]);

  useEffect(() => {
    dispatch(getAuditorAdminById(auditorAdminId))
      .unwrap()
      .then((data: AuditorAdmin) => {
        setValues(data);
        setDetails(data);
      });
  }, [dispatch, auditorAdminId, setValues]);

  if (getDetailStatus === "failed")
    return (
      <ErrorView
        title={`Loading Failed!`}
        desc={`There has been a problem while getting ${entity} data from the database. Try again or Please contact administration!`}
      />
    );
  if (details) {
    return (
      <Box sx={{ flexGrow: 1 }}>
        <h2 style={{ paddingLeft: 30 }}>Edit {entity}</h2>
        <FormProvider {...formMethods}>
          <form onSubmit={handleSubmit(onSubmit)}>
            <Grid container columns={{ xs: 4, sm: 8, md: 12 }}>
              <Grid item xs={12} md={6} sx={{ pl: 2, pr: 6, pt: 3 }}>
                <FormControl sx={{ width: "100%" }}>
                  <TextField
                    label="Name"
                    placeholder="Enter name"
                    InputLabelProps={{ shrink: true }}
                    {...register("name")}
                    required
                  />
                </FormControl>
              </Grid>
              <Grid item xs={12} md={6} sx={{ pl: 2, pr: 6, pt: 3 }}>
                <FormControl sx={{ width: "100%" }}>
                  <TextField
                    label="Description"
                    placeholder="Enter description"
                    InputLabelProps={{ shrink: true }}
                    {...register("description")}
                    required
                  />
                </FormControl>
              </Grid>
              <Grid item xs={12} md={6} sx={{ pl: 2, pr: 6, pt: 3 }}>
                <FormControl sx={{ width: "100%" }}>
                  <TextField
                    label="Email"
                    placeholder="Enter Email"
                    InputLabelProps={{ shrink: true }}
                    {...register("email")}
                    required
                    disabled
                    type="email"
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
                    <SubUnitSelector
                      required
                      disabled={!selectedBase}
                      base={selectedBase?.id}
                    />
                  </Grid>
                </>
              )}
              {is(AdminRoles.SERVICES) && (
                <>
                  <Grid item xs={12} md={6} sx={{ pl: 2, pr: 6, pt: 3 }}>
                    <CommandSelector
                      required
                      service={user?.service?.id || -1}
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
                    <SubUnitSelector
                      required
                      disabled={!selectedBase}
                      base={selectedBase?.id}
                    />
                  </Grid>
                </>
              )}
              {is(AdminRoles.COMMAND) && (
                <>
                  <Grid item xs={12} md={6} sx={{ pl: 2, pr: 6, pt: 3 }}>
                    <BaseSelector required command={user?.command?.id || -1} />
                  </Grid>
                  <Grid item xs={12} md={6} sx={{ pl: 2, pr: 6, pt: 3 }}>
                    <SubUnitSelector
                      required
                      disabled={!selectedBase}
                      base={selectedBase?.id}
                    />
                  </Grid>
                </>
              )}
              {is(AdminRoles.BASE) && (
                <>
                  <Grid item xs={12} md={6} sx={{ pl: 2, pr: 6, pt: 3 }}>
                    <SubUnitSelector required base={user?.base?.id ?? -1} />
                  </Grid>
                </>
              )}

              <Grid item xs={12} md={12} sx={{ pl: 2, pr: 6, pt: 3 }}>
                <Box display="flex" justifyContent="flex-end" pt={2}>
                  <LoadingButton
                    variant="contained"
                    loading={updateDataLoading}
                    disabled={updateDataLoading || !selectedSubunit}
                    type="submit"
                  >
                    {"Update"}
                  </LoadingButton>
                  <Button
                    variant={"outlined"}
                    style={{ alignSelf: "end" }}
                    onClick={() => navigate("/auditor-admins")}
                    disabled={updateDataLoading}
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
  return <></>;
};

export default EditAuditorAdmin;
