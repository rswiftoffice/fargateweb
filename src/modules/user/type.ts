import { Base } from "modules/base/type";
import { Command } from "modules/command/type";
import { Service } from "modules/service/type";
import { LicenseClass } from "../license-class/types";
import { SubUnit } from "../subunit/types";

export interface User {
  id: number;
  name: string;
  username: string;
  email: string;
  provider?: string;
  roles?: Role[];
  serviceId?: number;
  subUnitId?: number;
  commandId?: number;
  baseId?: number;
  licenseClasses?: { id: number }[];
  hasBaseLevelVehiclesAccess: boolean;
  adminSubUnitId?: number;
  adminSubUnit?: SubUnit;
  service?: Service;
  baseAdminId?: number;
  base?: Base;
  command?: Command;
}

export interface UserDetail extends User {
  subUnit?: SubUnit;
  licenseClasses?: LicenseClass[];
}

export interface Role {
  id: number;
  name: string;
}

export interface UserValues {
  email: string;
  name: string;
  roles: any;
  service: any;
  subunit: any;
  command: any;
  base: any;
  licenseClass?: LicenseClass[];
  hasBaseLevelVehiclesAccess: boolean;
}
