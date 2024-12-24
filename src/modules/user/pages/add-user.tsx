import {
  AccessTypes,
  AdminRoles,
  SettingsModules,
} from "../../../auth/permissions/enums";
import usePermissions from "../../../auth/permissions/hooks/usePermissions";
import UnauthorizedContent from "../../../core/components/UnauthorizedContent";
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
import ServiceSelector from "../../../core/components/ServiceSelector";
import CommandSelector from "../../../core/components/CommandSelector";
import { getRoleName } from "../../../core/utils/getRoleName";
import { AppRoles } from "../../../core/types/db-enum";
import BaseSelector from "../../../core/components/BaseSelector";
import SubUnitSelector from "../../../core/components/SubUnitSelector";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../../store";
import LicenseClassSelector from "../../../core/components/LicenseClassSelector";
import { createUser } from "../userSlice";
import { useNavigate } from "react-router-dom";
import { UserValues } from "../type";
import { useEffect } from "react";
import { setPageTitle } from "../../../core/layouts/layoutSlice";
import { isFulfilled } from "@reduxjs/toolkit";

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

const AddUser = () => {
  const dispatch: AppDispatch = useDispatch();
  const navigate = useNavigate();
  const { can, is } = usePermissions();
  const currentUser = useSelector(
    (state: RootState) => state.login.authenticatedUser
  );
  console.log(currentUser, "==currentUser");
  const formMethods = useForm<UserValues>();

  const { handleSubmit, register, watch } = formMethods;

  const selectedRoles = watch("roles");
  const selectedService = watch("service");
  const selectedCommand = watch("command");
  const selectedBase = watch("base");

  const createUserLoading = useSelector(
    (state: RootState) => state.user.createStatus === "pending"
  );
  const currentRole = useSelector(
    (state: RootState) => state.login.currentRole
  );
  const onSubmit = async (values: UserValues) => {
    const {
      email,
      name,
      roles,
      subunit,
      licenseClass,
      hasBaseLevelVehiclesAccess,
    } = values;
    const licenseList: number[] = [];
    licenseClass &&
      licenseClass.forEach((license) => {
        licenseList.push(license.id);
      });
    let sub =
      currentRole === "SUB_UNIT"
        ? currentUser?.subUnitId
        : subunit?.id ||
          (AdminRoles.SUB_UNIT && currentUser?.adminSubUnitId
            ? currentUser?.adminSubUnitId
            : -1);
    const action = await dispatch(
      createUser({
        name,
        email,
        roles,
        subUnitId: sub,
        licenseClasses: licenseList,
        hasBaseLevelVehiclesAccess: true,
      })
    );
    if (isFulfilled(action)) {
      navigate("/users");
    }
  };

  useEffect(() => {
    dispatch(setPageTitle("Add New User"));
  }, [dispatch]);

  if (can(AccessTypes.CREATE, SettingsModules.User)) {
    return (
      <Box sx={{ flexGrow: 1 }}>
        <h2 style={{ paddingLeft: 30 }}>Add New {entity}</h2>
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
                  <TextField
                    label="Microsoft Email"
                    placeholder="Enter email"
                    type="email"
                    sx={{ width: "100%" }}
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
                          gap: 0,
                          border: "none",
                        }}
                      >
                        {selectedRoles.map((role: string, id: any) => (
                          <Chip key={id} label={getRoleName(role)} />
                        ))}
                      </Box>
                    )}
                    MenuProps={MenuProps}
                    {...register("roles")}
                    required
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
                    <BaseSelector
                      required
                      disabled={!selectedCommand}
                      command={selectedCommand?.id}
                    />
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
                </>
              )}
              {console.log(currentUser)}
              {is(AdminRoles.BASE) ? (
                <>
                  <Grid item xs={12} md={6} sx={{ pl: 2, pr: 6, pt: 3 }}>
                    <SubUnitSelector
                      required
                      base={currentUser?.base?.id || currentUser?.baseAdminId}
                    />
                  </Grid>
                </>
              ) : !is(AdminRoles.SUB_UNIT) ? (
                <>
                  <Grid item xs={12} md={6} sx={{ pl: 2, pr: 6, pt: 3 }}>
                    <SubUnitSelector
                      required
                      disabled={!selectedBase}
                      base={selectedBase?.id}
                    />
                  </Grid>
                </>
              ) : null}
              <>
                <Grid item xs={12} md={6} sx={{ pl: 2, pr: 6, pt: 3 }}>
                  <LicenseClassSelector multiple required={false} />
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
                    loading={createUserLoading}
                    disabled={createUserLoading}
                    type="submit"
                  >
                    {"Submit"}
                  </LoadingButton>
                  <Button
                    variant={"outlined"}
                    style={{ alignSelf: "end" }}
                    onClick={() => navigate("/users")}
                    disabled={createUserLoading}
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

export default AddUser;
