import { VehicleType } from "core/types/db-enum";
import { GenericSelector } from "core/types/form";
import { SubUnit } from "modules/subunit/types";

interface BaseVehicle {
  vehicleNumber: string;
  model: string;
  vehicleType: string;
  vehiclesPlatformsId: string;
  subUnitId: number;
  isServiceable: boolean;
}

export interface Vehicle extends BaseVehicle {
  id: number;
  subUnit: SubUnit;
  platforms: {
    name: string;
  };
  currentTrip?: Trip;
  eLog?:any
}

export interface Trip {
  id: number;
  destinations: Destination[];
  currentMeterReading: number;
}

export interface Destination {
  id: number;
  status: string;
}

export interface VehicleValues {
  vehicleNumber: string;
  model: string;
  isServiceable: boolean;
  vehicleType: VehicleType;
  platform: GenericSelector | null;
  subunit: GenericSelector | null;
  service: GenericSelector | null;
  command: GenericSelector | null;
  base: GenericSelector | null;
}
