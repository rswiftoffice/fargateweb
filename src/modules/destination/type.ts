export interface Destination {
  id: number;
  trip?: {
    vehicle?: {
      vehicleNumber?: string;
    };
    tripDate: string;
    tripStatus: string;
    currentMeterReading: number;
    approvingOfficer?: {
      name?: string;
    };
    driver?: {
      name?: string;
    };
  };
  to?: string;
  requisitionerPurpose?: string;
  eLog?: {
    startTime?: string;
    endTime?: string;
    stationaryRunningTime?: number;
    meterReading?: number;
    totalDistance?: number;
    driver?: {
      name?: string;
    };
  };
}

export interface DestinationValues {
  to: string;
  meterReading: number;
  tripDate: string;
  totalDistance: number;
  endTime: string;
  startTime: string;
}