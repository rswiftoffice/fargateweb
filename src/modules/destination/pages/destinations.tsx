import usePermissions from "auth/permissions/hooks/usePermissions";
import { AccessTypes, SettingsModules } from "auth/permissions/enums";
import { AppDispatch } from "store";
import { setPageTitle } from "core/layouts/layoutSlice";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import DestinationInfo from "../components/DestinationInfo";
import UnauthorizedContent from "core/components/UnauthorizedContent";

const Destinations = () => {
  const { can } = usePermissions();
  const dispatch: AppDispatch = useDispatch();

  useEffect(() => {
    dispatch(setPageTitle("All Destinations"));
  }, [dispatch]);

  if (can(AccessTypes.READ, SettingsModules.EditDestination))
    return (
      <div>
        <DestinationInfo />
      </div>
    );
  return <UnauthorizedContent />;
};

export default Destinations;
