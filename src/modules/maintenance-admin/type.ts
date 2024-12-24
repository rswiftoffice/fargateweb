import { GenericSelector } from "core/types/form";
import { Base } from "modules/base/type";
import { User } from "modules/user/type";

export interface MaintenanceAdmin {
  id: number;
  name: string;
  description: string;
  email: string;
  user: User;
  base: Base;
}

export interface MaintenanceAdminValues {
  name: string;
  description: string;
  email: string;
  service: GenericSelector | null;
  command: GenericSelector | null;
  base: GenericSelector | null;
}
