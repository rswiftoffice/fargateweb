import React from "react";
import { Box } from "@mui/system";
import { Button } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import CommandAdminInfo from "../components/CommandAdminInfo";
import usePermissions from "../../../auth/permissions/hooks/usePermissions";
import { AccessTypes, SettingsModules } from "../../../auth/permissions/enums";
import { useNavigate } from "react-router-dom";
import UnauthorizedContent from "../../../core/components/UnauthorizedContent";

const CommandAdmins = () => {
  const navigate = useNavigate();
  const { can } = usePermissions();

  if (
    can(AccessTypes.READ, SettingsModules.Command) ||
    can(AccessTypes.READ, SettingsModules.CommandAdmin)
  ) {
    return (
      <div>
        <Box style={{ display: "flex", justifyContent: "end" }}>
          {can(AccessTypes.READ, SettingsModules.Command) && (
            <Button
              variant={"outlined"}
              style={{ alignSelf: "end", marginRight: 10 }}
              onClick={() => navigate("/commands")}
              disableElevation
            >
              {"Show Commands"}
            </Button>
          )}
          {can(AccessTypes.CREATE, SettingsModules.CommandAdmin) && (
            <Button
              variant={"contained"}
              style={{ alignSelf: "end" }}
              startIcon={<AddIcon />}
              onClick={() => navigate("add")}
              disableElevation
            >
              {"Add Command Admin"}
            </Button>
          )}
        </Box>
        <CommandAdminInfo />
      </div>
    );
  }
  return <UnauthorizedContent />;
};

export default CommandAdmins;
