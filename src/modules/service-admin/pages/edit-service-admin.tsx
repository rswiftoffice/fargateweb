import UnauthorizedContent from "core/components/UnauthorizedContent";
import { AccessTypes, SettingsModules } from "auth/permissions/enums";
import usePermissions from "auth/permissions/hooks/usePermissions";
import { LoadingButton } from "@mui/lab";
import { Button, FormControl, Grid, TextField } from "@mui/material";
import { Box } from "@mui/system";
import { FormProvider, useForm } from "react-hook-form";
import { useNavigate, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "store";
import { isFulfilled } from "@reduxjs/toolkit";
import { setPageTitle } from "core/layouts/layoutSlice";
import { ServiceAdmin, ServiceAdminValues } from "../type";
import ServiceSelector from "core/components/ServiceSelector";
import { getServiceAdminById, updateServiceAdmin } from "../serviceAdminSlice";
import { useCallback, useEffect,  } from "react";

const entity = "Service Admin";

const EditServiceAdmin = () => {
  const dispatch: AppDispatch = useDispatch();
  const { can } = usePermissions();
  const formMethods = useForm<ServiceAdminValues>();
  const { handleSubmit, register, setValue } = formMethods;
  const navigate = useNavigate();
  const params = useParams<"serviceAdminId">();

  const updateServiceAdminLoading = useSelector(
    (state: RootState) => state.serviceAdmin.updateStatus === "pending"
  );

  const onSubmit = async (values: ServiceAdminValues) => {
    const { service } = values;
    if (params.serviceAdminId) {
      const action = await dispatch(
        updateServiceAdmin({
          userId: +params.serviceAdminId,
          serviceId: service.id,
        })
      );
      if (isFulfilled(action)) {
        navigate("/service-admins");
      }
    }
  };

  const setValues = useCallback(
    (record: ServiceAdmin) => {
      if (!record) return;
      setValue("email", record.email ?? "");
      if (record?.service)
        setValue("service", {
          id: record.service.id,
          name: record.service.name,
          description: record?.service.description,
        });
    },
    [setValue]
  );

  useEffect(() => {
    dispatch(setPageTitle("Update Service Admin"));
  }, [dispatch]);

  useEffect(() => {
    if (params.serviceAdminId) {
      dispatch(getServiceAdminById(+params.serviceAdminId))
        .unwrap()
        .then((data: ServiceAdmin) => {
          setValues(data);
        });
    }
  }, [dispatch, params.serviceAdminId, setValues]);

  if (can(AccessTypes.UPDATE, SettingsModules.ServiceAdmin)) {
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
                    disabled
                    sx={{ width: "100%" }}
                    {...register("email")}
                  />
                </FormControl>
              </Grid>
              <Grid item xs={12} md={6} sx={{ pl: 2, pr: 6, pt: 3 }}>
                <ServiceSelector fieldName="service" required />
              </Grid>
              <Grid item xs={12} md={12} sx={{ pl: 2, pr: 6, pt: 3 }}>
                <Box display="flex" justifyContent="flex-end" pt={2}>
                  <LoadingButton
                    variant="contained"
                    loading={updateServiceAdminLoading}
                    disabled={updateServiceAdminLoading}
                    type="submit"
                  >
                    {"Update"}
                  </LoadingButton>
                  <Button
                    variant={"outlined"}
                    style={{ alignSelf: "end" }}
                    onClick={() => navigate("/service-admins")}
                    disabled={updateServiceAdminLoading}
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

export default EditServiceAdmin;
