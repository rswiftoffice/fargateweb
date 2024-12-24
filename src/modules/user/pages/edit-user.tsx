import { useCallback, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { setPageTitle } from "../../../core/layouts/layoutSlice";
import { AppDispatch, RootState } from "../../../store";
import { UserDetail, UserValues } from "../type";
import { getUserById, updateUser } from "../userSlice";
import { LoadingButton } from "@mui/lab";
import {
  Button,
  Chip,
  FormControl,
  FormControlLabel,
  FormHelperText,
  Grid,
  InputLabel,
  MenuItem,
  Switch,
  TextField,
} from "@mui/material";
import Select from "@mui/material/Select";
import { Box } from "@mui/system";
import { useForm, FormProvider } from "react-hook-form";
import {
  AccessTypes,
  AdminRoles,
  SettingsModules,
} from "../../../auth/permissions/enums";
import { getRoleName } from "../../../core/utils/getRoleName";
import ServiceSelector from "../../../core/components/ServiceSelector";
import usePermissions from "../../../auth/permissions/hooks/usePermissions";
import CommandSelector from "../../../core/components/CommandSelector";
import BaseSelector from "../../../core/components/BaseSelector";
import SubUnitSelector from "../../../core/components/SubUnitSelector";
import LicenseClassSelector from "../../../core/components/LicenseClassSelector";
import ErrorView from "../../../core/components/ShowError";
import { AppRoles } from "../../../core/types/db-enum";
import { isFulfilled } from "@reduxjs/toolkit";
import UnauthorizedContent from "core/components/UnauthorizedContent";

const entity = "User";
const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 5 + ITEM_PADDING_TOP,
      width: 380,
    },
  },
};

const EditUser = () => {
  const { can } = usePermissions();
  const dispatch: AppDispatch = useDispatch();

  useEffect(() => {
    dispatch(setPageTitle("Update User"));
  }, [dispatch]);

  if (can(AccessTypes.UPDATE, SettingsModules.User)) {
    return <EditUserForm />;
  }

  return <UnauthorizedContent />;
};

const EditUserForm = () => {
  const params = useParams<"userId">();
  const dispatch: AppDispatch = useDispatch();
  const navigate = useNavigate();
  const { is, can } = usePermissions();
  const currentUser = useSelector(
    (state: RootState) => state.login.authenticatedUser
  );
  console.log(currentUser);
  const currentRole = useSelector(
    (state: RootState) => state.login.currentRole
  );
  const formMethods = useForm<UserValues>();
  const { handleSubmit, register, watch, setValue } = formMethods;

  const selectedRoles = watch("roles");
  const selectedService = watch("service");
  const selectedCommand = watch("command");
  const selectedBase = watch("base");

  const [setValuesError, valuesErrorSetter] = useState(false);
  const getUserStatus = useSelector(
    (state: RootState) => state.user.getDetailStatus
  );

  const setValues = useCallback(
    (record: UserDetail) => {
      if (!record) return;
      setValue("hasBaseLevelVehiclesAccess", record.hasBaseLevelVehiclesAccess);

      const rolesList = record?.roles?.map((role) => role.name);
      setValue("roles", rolesList);

      if (record?.subUnit) {
        const subUnit = record?.subUnit ?? undefined;
        const base = subUnit?.base ?? undefined;
        const command = base?.command ?? undefined;
        const service = command?.service ?? undefined;
        if (!subUnit || !base || !command || !service) {
          valuesErrorSetter(true);
          return;
        }

        const licenseClasses = record?.licenseClasses?.map((license) => ({
          id: +license.id,
          class: license.class as string,
        }));
        setValue("licenseClass", licenseClasses);

        service &&
          service?.id &&
          service?.name &&
          setValue("service", { id: service.id, name: service.name });
        command &&
          command?.id &&
          command?.name &&
          setValue("command", { id: command.id, name: command.name });
        base &&
          base?.id &&
          base?.name &&
          setValue("base", { id: base.id, name: base.name });
        subUnit &&
          subUnit?.id &&
          subUnit?.name &&
          setValue("subunit", { id: subUnit.id, name: subUnit.name });
      }
      setValue("name", record.name);
      setValue("email", record.email);
    },
    [setValue]
  );

  const updateStatus = useSelector(
    (state: RootState) => state.user.updateStatus
  );
  const updateUserLoading = updateStatus === "pending";
  const onSubmit = async (values: UserValues) => {
    const {
      email,
      name,
      roles,
      licenseClass,
      subunit,
      hasBaseLevelVehiclesAccess,
    } = values;

    const licenseList: number[] = [];
    if (licenseClass) {
      licenseClass.forEach((license) => {
        licenseList.push(+license.id);
      });
    }

    const action = await dispatch(
      updateUser({
        id: params.userId,
        email,
        name,
        roles,
        licenseClasses: licenseList,
        subUnitId: subunit?.id ?? -1,
        hasBaseLevelVehiclesAccess: true,
      })
    );

    if (isFulfilled(action)) {
      navigate("/users");
    }
  };

  useEffect(() => {
    if (params.userId) {
      dispatch(getUserById(+params.userId))
        .unwrap()
        .then((data: UserDetail) => {
          setValues(data);
        });
    }
  }, [dispatch, params.userId, setValues]);

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
    // @ts-ignore
    if (currentUser && currentRole && currentRole === AdminRoles.SUB_UNIT) {
      setValue("subunit", {
        id: currentUser?.adminSubUnit?.id ?? -1,
        name: currentUser?.adminSubUnit?.name ?? "N/A",
      });
    }
  }, [currentRole, currentUser, setValue]);

  if (getUserStatus === "failed" || setValuesError)
    return (
      <ErrorView
        title={"Loading Failed!"}
        desc={`There has been a problem while getting ${entity} data from the database. Try again or Please contact administration!`}
      />
    );

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
                  label="Microsoft Email"
                  placeholder="Enter email"
                  type="email"
                  sx={{ width: "100%" }}
                  InputLabelProps={{ shrink: true }}
                  required
                  {...register("email")}
                />
              </FormControl>
            </Grid>
            <Grid item xs={12} md={6} sx={{ pl: 2, pr: 6, pt: 3 }}>
              <FormControl sx={{ width: "100%" }} variant={"outlined"}>
                <InputLabel
                  id="roles-select"
                  style={{ background: "white", padding: "0 4px 0 2px" }}
                >
                  Roles &nbsp;*
                </InputLabel>
                <Select
                  labelId="roles-select"
                  multiple
                  value={selectedRoles || []}
                  renderValue={(selectedRoles) => (
                    <Box
                      sx={{
                        display: "flex",
                        flexWrap: "wrap",
                        gap: 1,
                        border: "none",
                      }}
                    >
                      {selectedRoles.map((role: string, id: number) => (
                        <Chip key={id} label={getRoleName(role)} />
                      ))}
                    </Box>
                  )}
                  MenuProps={MenuProps}
                  {...register("roles")}
                >
                  {Object.keys(AppRoles).map((role) => (
                    <MenuItem key={role} value={role}>
                      {getRoleName(role)}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            {is(AdminRoles.SUPER_ADMIN) && (
              <>
                {console.log("Super Admin block... -->>")}
                <Grid item xs={12} md={6} sx={{ pl: 2, pr: 6, pt: 3 }}>
                  <ServiceSelector fieldName="service" required />
                </Grid>
                <Grid item xs={12} md={6} sx={{ pl: 2, pr: 6, pt: 3 }}>
                  <CommandSelector required service={selectedService?.id} />
                </Grid>
                <Grid item xs={12} md={6} sx={{ pl: 2, pr: 6, pt: 3 }}>
                  <BaseSelector required command={selectedCommand?.id} />
                </Grid>
                <Grid item xs={12} md={6} sx={{ pl: 2, pr: 6, pt: 3 }}>
                  <SubUnitSelector required base={selectedBase?.id || -1} />
                </Grid>
              </>
            )}
            {is(AdminRoles.SERVICES) && (
              <>
                <Grid item xs={12} md={6} sx={{ pl: 2, pr: 6, pt: 3 }}>
                  <CommandSelector
                    required
                    service={currentUser?.serviceId || -1}
                  />
                </Grid>
                <Grid item xs={12} md={6} sx={{ pl: 2, pr: 6, pt: 3 }}>
                  <BaseSelector required command={selectedCommand?.id} />
                </Grid>
                <Grid item xs={12} md={6} sx={{ pl: 2, pr: 6, pt: 3 }}>
                  <SubUnitSelector required base={selectedBase?.id || -1} />
                </Grid>
              </>
            )}
            {is(AdminRoles.COMMAND) && (
              <>
                <Grid item xs={12} md={6} sx={{ pl: 2, pr: 6, pt: 3 }}>
                  <BaseSelector
                    required
                    command={currentUser?.commandId || -1}
                  />
                </Grid>
                <Grid item xs={12} md={6} sx={{ pl: 2, pr: 6, pt: 3 }}>
                  <SubUnitSelector required base={selectedBase?.id || -1} />
                </Grid>
              </>
            )}
            {is(AdminRoles.BASE) && (
              <>
                <Grid item xs={12} md={6} sx={{ pl: 2, pr: 6, pt: 3 }}>
                  <SubUnitSelector
                    edit={true}
                    required
                    base={currentUser?.base?.id || currentUser?.baseAdminId}
                  />
                </Grid>
              </>
            )}
            <>
              <Grid item xs={12} md={6} sx={{ pl: 2, pr: 6, pt: 3 }}>
                <LicenseClassSelector multiple />
              </Grid>
            </>
            <Grid item xs={12} md={12} sx={{ pl: 2, pr: 6, pt: 3 }}>
              <FormControlLabel
                control={
                  <Switch
                    color="primary"
                    {...register("hasBaseLevelVehiclesAccess")}
                    checked={watch("hasBaseLevelVehiclesAccess") || false}
                  />
                }
                label="Allow Base Level Vehicles Access"
                labelPlacement="start"
              />
              <FormHelperText>
                If switched on, the driver will be able to access all vehicles
                from its base instead of its sub unit.
              </FormHelperText>
            </Grid>
            <Grid item xs={12} md={12} sx={{ pl: 2, pr: 6, pt: 3 }}>
              <Box display="flex" justifyContent="flex-end" pt={2}>
                <LoadingButton
                  variant="contained"
                  loading={updateUserLoading}
                  disabled={updateUserLoading}
                  type="submit"
                >
                  {"Update"}
                </LoadingButton>
                <Button
                  variant={"outlined"}
                  style={{ alignSelf: "end" }}
                  onClick={() => navigate("/users")}
                  disabled={updateUserLoading}
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

export default EditUser;
