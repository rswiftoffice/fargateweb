// @ts-nocheck
import { UserRoles as Role } from "../../../core/types/db-enum";
import { AccessTypes, ReportsModules } from "../enums";

export const reportsAccessControl = {
  [ReportsModules.AuditLog]: {
    [AccessTypes.READ]: [Role.SUPER_ADMIN],
  },
  [ReportsModules.ElogBook]: {
    [AccessTypes.READ]: [
      Role.SUPER_ADMIN,
      Role.COMMAND,
      Role.AUDITOR,
      Role.SUB_UNIT,
      Role.BASE,
      Role.SERVICES,
    ],
    [AccessTypes.CREATE]: [],
    [AccessTypes.UPDATE]: [],
    [AccessTypes.DELETE]: [],
  },
  [ReportsModules.BOS_AOS_POL_DI_AHS]: {
    [AccessTypes.READ]: [
      Role.SUPER_ADMIN,
      Role.COMMAND,
      Role.SUB_UNIT,
      Role.BASE,
      Role.SERVICES,
      Role.AUDITOR,
    ],
    [AccessTypes.CREATE]: [],
    [AccessTypes.UPDATE]: [],
    [AccessTypes.DELETE]: [],
  },
  [ReportsModules.MTRACForm]: {
    [AccessTypes.READ]: [
      Role.SUPER_ADMIN,
      Role.COMMAND,
      Role.SUB_UNIT,
      Role.BASE,
      Role.SERVICES,
      Role.AUDITOR,
    ],
    [AccessTypes.CREATE]: [],
    [AccessTypes.UPDATE]: [],
    [AccessTypes.DELETE]: [],
  },
  [ReportsModules.ServicingRecord]: {
    [AccessTypes.READ]: [
      Role.SUPER_ADMIN,
      Role.COMMAND,
      Role.MAINTENANCE,
      Role.SUB_UNIT,
      Role.BASE,
      Role.SERVICES,
    ],
    [AccessTypes.CREATE]: [],
    [AccessTypes.UPDATE]: [],
    [AccessTypes.DELETE]: [],
  },
  [ReportsModules.DriverMileage]: {
    [AccessTypes.READ]: [
      Role.SUPER_ADMIN,
      Role.COMMAND,
      Role.AUDITOR,
      Role.SUB_UNIT,
      Role.SERVICES,
      Role.BASE,
    ],
    [AccessTypes.CREATE]: [],
    [AccessTypes.UPDATE]: [],
    [AccessTypes.DELETE]: [],
  },
  [ReportsModules.CheckIn]: {
    [AccessTypes.READ]: [
      Role.SUPER_ADMIN,
      Role.COMMAND,
      Role.AUDITOR,
      Role.SUB_UNIT,
      Role.SERVICES,
      Role.BASE,
    ],
    [AccessTypes.CREATE]: [],
    [AccessTypes.UPDATE]: [],
    [AccessTypes.DELETE]: [],
  },
  [ReportsModules.CheckOut]: {
    [AccessTypes.READ]: [
      Role.SUPER_ADMIN,
      Role.COMMAND,
      Role.AUDITOR,
      Role.SUB_UNIT,
      Role.SERVICES,
      Role.BASE,
    ],
    [AccessTypes.CREATE]: [],
    [AccessTypes.UPDATE]: [],
    [AccessTypes.DELETE]: [],
  },
};
