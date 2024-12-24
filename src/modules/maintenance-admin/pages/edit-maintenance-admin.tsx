import { AccessTypes, SettingsModules } from "auth/permissions/enums";
import usePermissions from "auth/permissions/hooks/usePermissions";
import UnauthorizedContent from "core/components/UnauthorizedContent";
import { setPageTitle } from "core/layouts/layoutSlice";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { useParams } from "react-router-dom";
import { AppDispatch } from "store";
import EditMaintenanceAdminForm from "../components/EditMaintenanceAdminForm";

const EditMaintenanceAdmin = () => {
  const params = useParams<"maintenanceAdminId">();
  const { can } = usePermissions();
  const dispatch: AppDispatch = useDispatch();

  useEffect(() => {
    dispatch(setPageTitle("Update Maintenance Admin"));
  }, [dispatch]);

  if (can(AccessTypes.UPDATE, SettingsModules.MaintenanceAdmin)) {
    return <EditMaintenanceAdminForm id={+params.maintenanceAdminId!} />;
  }

  return <UnauthorizedContent />;
};

export default EditMaintenanceAdmin;
