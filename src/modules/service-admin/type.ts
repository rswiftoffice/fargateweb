import { Service } from "modules/service/type";


export interface ServiceAdmin {
  id: number;
  name: string;
  email: string;
  service: Service;
}

export interface ServiceAdminValues {
  email: string;
  service: Service;
}
