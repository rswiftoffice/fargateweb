import { GenericSelector } from "core/types/form";
import { SubUnit } from "modules/subunit/types";

export interface SubUnitAdmin {
  id: number;
  name: string;
  email: string;
  roles: string;
  adminSubUnit: SubUnit;
}

export interface SubUnitAdminValues {
  email: string;
  subunit: GenericSelector | null;
  service: GenericSelector | null;
  command: GenericSelector | null;
  base: GenericSelector | null;
}