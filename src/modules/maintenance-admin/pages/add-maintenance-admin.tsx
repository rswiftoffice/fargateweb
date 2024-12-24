import { AccessTypes, SettingsModules } from "auth/permissions/enums";
import usePermissions from "auth/permissions/hooks/usePermissions";
import UnauthorizedContent from "core/components/UnauthorizedContent";
import { setPageTitle } from "core/layouts/layoutSlice";
import React, { useEffect } from "react";
import { useDispatch } from "react-redux";
import { AppDispatch } from "store";
import AddMaintenanceAdminForm from "../components/AddMaintenanceAdminForm";

const entityName = "Maintenance Admin";

const AddMaintenanceAdmin = () => {
  const { can } = usePermissions();
  const dispatch: AppDispatch = useDispatch();

  useEffect(() => {
    dispatch(setPageTitle(`Add New ${entityName}`));
  }, [dispatch]);

  if (can(AccessTypes.CREATE, SettingsModules.MaintenanceAdmin)) {
    return <AddMaintenanceAdminForm />;
  }

  return <UnauthorizedContent />;
};
export default AddMaintenanceAdmin;
