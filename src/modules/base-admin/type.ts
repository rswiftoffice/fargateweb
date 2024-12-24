import { Base } from "modules/base/type";

export interface BaseAdmin {
  id: number;
  name: string;
  email: string;
  baseId: number;
  base: Base;
}

export interface BaseAdminValues {
  email: string;
  base: { id: number; name: string };
  command: { id: number; name: string } | null;
  service: { id: number; name: string } | null;
}
