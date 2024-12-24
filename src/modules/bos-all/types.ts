import { FuelType } from "core/types/db-enum";

interface Driver {
  adminSubUnitId: null | number;
  baseAdminId: null | number;
  commandId: null | number;
  createdAt: string;
  email: string;
  hasBaseLevelVehiclesAccess: boolean;
  id: number;
  name: string
  password: null | string;
  provider: string;
  serviceId: null | number;
  subUnitId: number
  updatedAt: string;
  username: string;
}

interface Elog {
  startTime: string;
  endTime: string;
  stationaryRunningTime: number;
  meterReading: number;
  fuelType: string;
  fuelReceived: number;
}

export interface Bos {
  createdAt: string;
  currentMeterReading: number;
  driver: Driver;
  driverId: number;
  eLogId: number;
  id: number;
  requisitionerPurpose: string;
  tripDate: string;
  updatedAt: string;
  vehicle: {
    vehicleNumber: string;
  };
  eLog: Elog;
}

export interface BosUpdates {
  tripDate: string;
  startTime: string;
  endTime: string;
  meterReading: number;
  fuelRecieved: number;
  fuelType: FuelType;
}