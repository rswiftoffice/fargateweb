import { useEffect, useState } from "react";
import usePermissions from "auth/permissions/hooks/usePermissions";
import { AccessTypes, SettingsModules } from "auth/permissions/enums";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "store";
import UnauthorizedContent from "core/components/UnauthorizedContent";
import { LoadingButton } from "@mui/lab";
import { Button, FormControl, Grid, TextField } from "@mui/material";
import { Box } from "@mui/system";
import { FormProvider, useForm } from "react-hook-form";
import { isFulfilled } from "@reduxjs/toolkit";
import { setPageTitle } from "core/layouts/layoutSlice";
import { MTBroadcastValues } from "../types";
import { createMtBroadCast } from "../mtBroadcastSlice";
import axios from "axios";

const AddMtBroadcast = () => {
  const entity = "MT Broadcast";
  const dispatch: AppDispatch = useDispatch();
  const { can } = usePermissions();
  const formMethods = useForm<MTBroadcastValues>();
  const { handleSubmit, register } = formMethods;

  const addMTBroadcastLoading = useSelector(
    (state: RootState) => state.mtBroadcast.createStatus === "pending"
  );

  const user = useSelector((state: RootState) => state.login.authenticatedUser);

  const [filePath, setFilePath] = useState<string>('');

  const navigate = useNavigate();

  useEffect(() => {
    dispatch(setPageTitle("Add New MT Broadcast"));
  }, [dispatch]);

  const onSubmitAddMTBroadcast = async (values: MTBroadcastValues) => {
    const dataAddMTBroadcast = {
      title: values.title,
      file: filePath,
      userId: user?.id,
      subUnitId: user?.subUnitId,
    }
    const createAction = await dispatch(createMtBroadCast(dataAddMTBroadcast));
    if (isFulfilled(createAction)) {
      navigate("/mt-broadcast");
    }
  };

  const handleChangeInputFile = async (event: any) => {
    if (event.target.files) {
      const currentFile = event.target.files[0]
      const body = new FormData()
      body.append("file", currentFile)
      body.append("filename", currentFile.name)
      const url = `${process.env.REACT_APP_API_URL}/upload`
      const result = await axios.post(url, body, {
        headers: {
          "Content-Type": "multipart/form-data",
          "Access-Control-Allow-Origin": "*",
        },
      })
      const { data } = result
      setFilePath(data[0].filename)
    }
  }

  if (can(AccessTypes.CREATE, SettingsModules.MTBroadcast)) {
    return (
      <Box sx={{ flexGrow: 1 }}>
        <h2 style={{ paddingLeft: 30 }}>Add New {entity}</h2>
        <FormProvider {...formMethods}>
          <form onSubmit={handleSubmit(onSubmitAddMTBroadcast)}>
            <Grid container columns={{ xs: 4, sm: 8, md: 12 }}>
              <Grid item xs={12} md={6} sx={{ pl: 2, pr: 6, pt: 3 }}>
                <FormControl sx={{ width: "100%" }} variant={"filled"}>
                  <TextField
                    label={entity}
                    placeholder={`Enter ${entity}`}
                    {...register("title")}
                    required
                  />
                </FormControl>
              </Grid>

              <Grid item xs={12} md={6} sx={{ pl: 2, pr: 6, pt: 3 }}>
                <Box display="flex" justifyContent="flex-end">
                  <Button sx={{ mr: 2 }} variant="contained" component="label">
                    Upload File
                    <input type="file" onChange={handleChangeInputFile} hidden />
                  </Button>
                  <TextField
                    required
                    aria-readonly
                    sx={{ flexGrow: 1 }}
                    value={filePath.replace("uploads/", "")}
                    defaultValue={filePath.replace("uploads/", "")}
                    label={`Selected file`}
                    placeholder={`File path url`}
                    {...register("file")}
                    style={{ pointerEvents: "none", opacity: "0.6" }}
                  />
                </Box>
              </Grid>

              <Grid item xs={12} md={12} sx={{ pl: 2, pr: 6, pt: 3 }}>
                <Box display="flex" justifyContent="flex-end" pt={2}>
                  <LoadingButton
                    variant="contained"
                    loading={addMTBroadcastLoading}
                    disabled={addMTBroadcastLoading}
                    type="submit"
                  >
                    {"Submit"}
                  </LoadingButton>
                  <Button
                    variant={"outlined"}
                    style={{ alignSelf: "end" }}
                    onClick={() => navigate("/mt-broadcast")}
                    disabled={addMTBroadcastLoading}
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
    )
  }
  return <UnauthorizedContent />;
}
export default AddMtBroadcast;
