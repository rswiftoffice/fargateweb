import React, { useEffect } from "react";
import {
  Box,
  Grid,
  FormControl,
  TextField,
  Button,
  Autocomplete,
} from "@mui/material";

import { FormProvider, useForm } from "react-hook-form";
import { LoadingButton } from "@mui/lab";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../../store";
import { addCommand } from "../commandSlice";
import { useNavigate } from "react-router-dom";
import { setPageTitle } from "../../../core/layouts/layoutSlice";

type ServiceOption = {
  name: string;
  id: number;
};

interface CommmandValues {
  name: string;
  description: string;
  service: ServiceOption;
}

function AddNewCommandLayout() {
  const formMethods = useForm<CommmandValues>();
  const { handleSubmit, register, setValue } = formMethods;
  const navigate = useNavigate();

  const services = useSelector((state: RootState) => {
    return state.service.list.map((item) => ({
      name: item.name,
      id: item.id,
    }));
  });

  const addCommandLoading = useSelector(
    (state: RootState) => state.command.addCommandLoading
  );

  const dispatch = useDispatch();
  const onSelectionServiceChange = (
    event: any,
    newValue: ServiceOption | null
  ) => {
    if (newValue) setValue("service", { ...newValue });
  };

  useEffect(() => {
    dispatch(setPageTitle("Add New Command"));
  }, [dispatch]);

  const onSubmit = (values: CommmandValues) => {
    const { name, description, service } = values;
    dispatch(addCommand({ name, description, serviceId: service.id }));
    navigate(-1);
  };

  const onCancelAddCommandClick = () => {
    navigate(-1);
  };

  return (
    <Box sx={{ flexGrow: 1 }}>
      <h2 style={{ paddingLeft: 30 }}>Add New Command</h2>
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
                <Autocomplete
                  disablePortal
                  id="combo-box-demo"
                  options={services}
                  sx={{ width: 300 }}
                  getOptionLabel={(option) => option.name}
                  onChange={onSelectionServiceChange}
                  renderInput={(params) => (
                    <TextField {...params} label="Service" required />
                  )}
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
                  loading={addCommandLoading === "pending"}
                  disabled={addCommandLoading === "pending"}
                  type="submit"
                >
                  {"Submit"}
                </LoadingButton>
                <Button
                  variant={"outlined"}
                  style={{ alignSelf: "end" }}
                  onClick={onCancelAddCommandClick}
                  disabled={addCommandLoading === "pending"}
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

export default AddNewCommandLayout;
