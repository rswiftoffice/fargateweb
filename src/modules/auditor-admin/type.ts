import { GenericSelector } from "core/types/form";
import { SubUnit } from "modules/subunit/types";

export interface AuditorAdmin {
  id: number;
  name: string;
  description: string;
  email: string;
  subUnit: SubUnit;
  user: {
    id: number;
    name: string;
    email: string;
  };
}
export interface AuditorAdminValues {
  name: string;
  description: string;
  email: string;
  service: GenericSelector | null;
  command: GenericSelector | null;
  base: GenericSelector | null;
  subunit: GenericSelector | null;
}
