import { Command } from "../command/type";

export interface Base {
  id: number;
  name: string;
  commandId: number;
  command?: Command;
  description: string;
}

export interface BaseValues {
  name: string;
  description: string;
  command: { id: number; name: string } | null;
  service: { id: number; name: string } | null;
}

export interface TransferBaseProps {
  currentBaseId: number;
  newBaseId: number;
}
