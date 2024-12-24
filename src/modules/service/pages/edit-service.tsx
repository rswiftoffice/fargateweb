import { useEffect } from "react";
import { AccessTypes, SettingsModules } from "../../../auth/permissions/enums";
import usePermissions from "../../../auth/permissions/hooks/usePermissions";
import UnauthorizedContent from "core/components/UnauthorizedContent";
import { LoadingButton } from "@mui/lab";
import { Button, FormControl, Grid, TextField } from "@mui/material";
import { Box } from "@mui/system";
import { FormProvider, useForm } from "react-hook-form";
import { useNavigate, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "store";
import { getServiceById, updateService } from "../serviceSlice";
import { setPageTitle } from "core/layouts/layoutSlice";
import { Service, ServiceValues } from "../type";
import { useCallback } from "react";
import { isFulfilled } from "@reduxjs/toolkit";

const entity = "Service";

const EditService = () => {
  const params = useParams<"serviceId">();
  const dispatch: AppDispatch = useDispatch();
  const { can } = usePermissions();
  const formMethods = useForm<ServiceValues>();
  const { handleSubmit, register, setValue } = formMethods;
  const navigate = useNavigate();

  const updateServiceLoading = useSelector(
    (state: RootState) => state.service.updateStatus === "pending"
  );

  const onSubmit = async (values: ServiceValues) => {
    const { name, description } = values;
    if (params.serviceId) {
      const action = await dispatch(
        updateService({ id: +params.serviceId, name, description })
      );
      if (isFulfilled(action)) {
        navigate("/services");
      }
    }
  };

  const setValues = useCallback(
    (record: Service) => {
      if (!record) return;
      setValue("name", record?.name ?? "");
      setValue("description", record?.description ?? "");
    },
    [setValue]
  );

  useEffect(() => {
    dispatch(setPageTitle("Update Service"));
  }, [dispatch]);

  useEffect(() => {
    if (params.serviceId) {
      dispatch(getServiceById(+params.serviceId))
        .unwrap()
        .then((data: Service) => {
          setValues(data);
        });
    }
  }, [dispatch, params.serviceId, setValues]);

  if (can(AccessTypes.CREATE, SettingsModules.Service)) {
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
              <Grid item xs={12} md={12} sx={{ pl: 2, pr: 6, pt: 3 }}>
                <Box display="flex" justifyContent="flex-end" pt={2}>
                  <LoadingButton
                    variant="contained"
                    loading={updateServiceLoading}
                    disabled={updateServiceLoading}
                    type="submit"
                  >
                    {"Update"}
                  </LoadingButton>
                  <Button
                    variant={"outlined"}
                    style={{ alignSelf: "end" }}
                    onClick={() => navigate("/services")}
                    disabled={updateServiceLoading}
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

export default EditService;
