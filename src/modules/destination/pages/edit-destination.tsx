import { AccessTypes, SettingsModules } from "auth/permissions/enums";
import usePermissions from "auth/permissions/hooks/usePermissions";
import UnauthorizedContent from "core/components/UnauthorizedContent";
import { setPageTitle } from "core/layouts/layoutSlice";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { useParams } from "react-router-dom";
import { AppDispatch } from "store";
import EditDestinationForm from "../components/EditDestinationForm";

const EditDestination = () => {
  const params = useParams<"destinationId">();
  const { can } = usePermissions();
  const dispatch: AppDispatch = useDispatch();

  useEffect(() => {
    dispatch(setPageTitle("Edit Destination"));
  }, [dispatch]);

  if (can(AccessTypes.UPDATE, SettingsModules.EditDestination)) {
    return <EditDestinationForm id={+params.destinationId!} />;
  }

  return <UnauthorizedContent />;
};

export default EditDestination;
