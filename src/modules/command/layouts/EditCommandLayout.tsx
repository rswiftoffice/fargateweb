import React, {ChangeEvent, useEffect, useState} from 'react';
import {LoadingButton} from '@mui/lab';
import {
  Autocomplete,
  Button,
  FormControl,
  Grid,
  TextField,
} from '@mui/material';
import {Box} from '@mui/system';
import {FormProvider, useForm} from 'react-hook-form';
import {useDispatch, useSelector} from 'react-redux';
import {RootState} from '../../../store';
import {useNavigate, useParams} from 'react-router-dom';
import { updateCommand } from "../commandSlice";
import { getRequest } from "../../../api";
import { AxiosResponse } from "axios";
import { setPageTitle } from "../../../core/layouts/layoutSlice";
import { Command } from "../type";

const entity = "Command";

interface Service {
  id: number;
  name: string;
}
interface ServiceValues {
  name: string;
  description: string;
  service: Service;
}

const EditCommand = () => {
  const services = useSelector((state: RootState) => {
    return state.service.list.map((item) => ({
      name: item.name,
      id: item.id,
    }));
  });

  const deleteCommandLoading = useSelector(
    (state: RootState) => state.command.deleteCommandLoading
  );

  const navigate = useNavigate();
  let params = useParams<"commandId">();
  const formMethods = useForm<ServiceValues>();
  const { handleSubmit, register } = formMethods;
  const [command, setCommand] = useState<any | null>(null);
  const [commandName, setCommandName] = useState("");
  const [commandDescription, setCommandDescription] = useState("");
  const [commandService, setCommandService] = useState<{
    name: string;
    id: number;
  } | null>(null);
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(setPageTitle("Edit Command"));
  }, [dispatch]);
  useEffect(() => {
    const getCommandById = async () => {
      const response: AxiosResponse<Command> = await getRequest(
        `/commands/${params.commandId}`
      );
      setCommand(response.data);
      setCommandName(response.data.name);
      setCommandDescription(response.data.description);
      setCommandService(response.data.service!);
    };
    getCommandById();
  }, [params.commandId]);

  const onCommandNameChange = (event: ChangeEvent<HTMLInputElement>) => {
    setCommandName(event.target.value);
  };

  const onCommandDescriptionChange = (event: ChangeEvent<HTMLInputElement>) => {
    setCommandDescription(event.target.value);
  };

  const onSubmit = async (values: ServiceValues) => {
    const newCommand = {
      id: command.id,
      name: commandName,
      description: commandDescription,
    };
    dispatch(updateCommand(newCommand));
    navigate(-1);
  };

  const onSelectionServiceChange = (event: any, newValue: Service | null) => {
    setCommandService(newValue);
  };

  const onCancelEditCommand = () => {
    navigate(-1);
  };
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
                  value={commandName}
                  onChange={onCommandNameChange}
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
                  value={commandDescription}
                  onChange={onCommandDescriptionChange}
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
                  value={commandService}
                  onChange={onSelectionServiceChange}
                  getOptionLabel={(option) => option.name}
                  renderInput={(params) => (
                    <TextField {...params} label="Service" required />
                  )}
                />
              </FormControl>
            </Grid>
            <Grid item xs={12} md={12} sx={{ pl: 2, pr: 6, pt: 3 }}>
              <Box display="flex" justifyContent="flex-end" pt={2}>
                <LoadingButton
                  variant="contained"
                  loading={deleteCommandLoading === "pending"}
                  disabled={deleteCommandLoading === "pending"}
                  type="submit"
                >
                  {"Update"}
                </LoadingButton>
                <Button
                  variant={"outlined"}
                  style={{ alignSelf: "end" }}
                  onClick={onCancelEditCommand}
                  disabled={deleteCommandLoading === "pending"}
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
};

export default EditCommand;
