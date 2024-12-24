export interface CommandAdmin {
  id: number;
  name?: string;
  email?: string;
  command?: Command;
}

export interface Command {
  id: number;
  name: string;
}
export type ServiceOption = {
  name: string;
  id: number;
};
export interface CommandAdminValues {
  email: string;
  command: Command | null;
  service: ServiceOption | null;
}
