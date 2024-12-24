import React, { useEffect } from "react";
import AddIcon from "@mui/icons-material/Add";
import { Button } from "@mui/material";
import { Box } from "@mui/system";
import { AccessTypes, SettingsModules } from "auth/permissions/enums";
import UnauthorizedContent from "../../../core/components/UnauthorizedContent";
import usePermissions from "../../../auth/permissions/hooks/usePermissions";
import UserInfo from "../components/UserInfo";
import { useNavigate } from "react-router-dom";
import { setPageTitle } from "core/layouts/layoutSlice";
import { useDispatch } from "react-redux";
import { AppDispatch } from "store";

const Users = () => {
  const { can } = usePermissions();
  const navigate = useNavigate();
  const dispatch: AppDispatch = useDispatch();

  useEffect(() => {
    dispatch(setPageTitle("Users"));
  }, [dispatch]);

  if (can(AccessTypes.READ, SettingsModules.User)) {
    return (
      <div>
        <Box style={{ display: "flex", justifyContent: "end" }}>
          {can(AccessTypes.CREATE, SettingsModules.User) && (
            <Button
              variant={"contained"}
              style={{ alignSelf: "end" }}
              startIcon={<AddIcon />}
              onClick={() => navigate("/users/add")}
              disableElevation
            >
              {"Add User"}
            </Button>
          )}
        </Box>
        <UserInfo />
      </div>
    );
  }
  return <UnauthorizedContent />;
};
export default Users;
