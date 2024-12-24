import { GenericSelector } from "core/types/form";
import { Base } from "../base/type";

export interface SubUnit {
  id: number;
  name: string;
  baseId: number;
  base?: Base;
  description: string;
}
export interface TransferSubUnitProps {
  currentSubUnitId: number;
  newSubUnitId: number;
}

export interface SubUnitValues {
  name: string;
  description: string;
  base: GenericSelector | null;
  command: GenericSelector | null;
  service: GenericSelector | null;
}
