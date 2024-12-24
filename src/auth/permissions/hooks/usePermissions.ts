// @ts-nocheck
import { useCallback } from "react";
import { useSelector } from "react-redux";
import { Role } from "../../../core/types/db-enum";
import { RootState } from "../../../store";
import { accessControlMatrix } from "../access-control";
import {
  AccessTypes,
  ReportsModules,
  SettingsModules,
  AdminRoles,
} from "../enums";

const usePermissions = () => {
  const currentRole = useSelector(
    (state: RootState) => state.login.currentRole
  );

  const can = useCallback(
    (
      action: AccessTypes,
      module: SettingsModules | ReportsModules,
      targetModule = 'settings',
      logDebug = false
    ): boolean => {
      let accessControl: Role[] = [];
      if (targetModule === 'settings') {
        if (logDebug) {
          console.log('CHECK CASE 1');
        }
        accessControl =
          accessControlMatrix.Settings[module as SettingsModules][action];
      } else {
        if (logDebug) {
          console.log('CHECK CASE 2');
        }
        accessControl =
          accessControlMatrix.Reports[module as ReportsModules][action];
      }

      return accessControl.includes(currentRole as Role);
      // return false;
    },
    [currentRole]
  );

  const is = useCallback(
    (role: AdminRoles): boolean => {
      if (currentRole === role) return true;
      return false;
    },
    [currentRole]
  );

  return { can, is, currentRole };
};

export default usePermissions;
