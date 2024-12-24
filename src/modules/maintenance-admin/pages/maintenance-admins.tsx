import usePermissions from "auth/permissions/hooks/usePermissions";
import { AccessTypes, SettingsModules } from "auth/permissions/enums";
import { Box } from "@mui/system";
import { Button } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import { useNavigate } from "react-router-dom";
import { AppDispatch } from "store";
import { setPageTitle } from "core/layouts/layoutSlice";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import MaintenanceAdminTable from "../components/MaintenanceAdminTable";
import UnauthorizedContent from "core/components/UnauthorizedContent";

const MaintenanceAdmins = () => {
  const { can } = usePermissions();
  const navigate = useNavigate();
  const dispatch: AppDispatch = useDispatch();

  useEffect(() => {
    dispatch(setPageTitle("Maintenance Admins"));
  }, [dispatch]);

  if (can(AccessTypes.READ, SettingsModules.MaintenanceAdmin))
    return (
      <div>
        <Box style={{ display: "flex", justifyContent: "end" }}>
          {can(AccessTypes.CREATE, SettingsModules.MaintenanceAdmin) && (
            <Button
              variant={"contained"}
              style={{ alignSelf: "end" }}
              startIcon={<AddIcon />}
              onClick={() => navigate("/maintenance-admins/add")}
              disableElevation
            >
              {"Add Maintenance Admin"}
            </Button>
          )}
        </Box>
        <MaintenanceAdminTable />
      </div>
    );
  return <UnauthorizedContent />;
};

export default MaintenanceAdmins;
