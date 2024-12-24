export interface ElogBook {
    id: number,
    startTime: string,
    endTime: string,
    stationaryRunningTime: number,
    meterReading: number,
    totalDistance: number,
    fuelReceived: string,
    fuelType: string,
    remarks: string,
    POSONumber: number,
    requisitionerPurpose: string,
    destinationId: number,
    createdAt: string,
    updatedAt: string,
    destination: ElogBookDestination,
    bocTrip: BocTrip
}

export interface BocTrip {
    id: number,
    tripDate: string,
    requisitionerPurpose: string,
    currentMeterReading: number,
    eLogId: number,
    driverId: number,
    vehicleId: number,
    createdAt: string,
    updatedAt: string
}

export interface ElogBookDestination {
    id: number,
    requisitionerPurpose: string,
    to: string,
    tripStatus: string,
    trip: ElogBookTrip
}

export interface ElogBookTrip {
    vehicle: {
        id: number,
        vehicleNumber: number,
    },
    tripDate: string
    tripStatus: string,
    driver: {
        name: string
    },
    approvingOfficer: {
        name: string
    }
}
