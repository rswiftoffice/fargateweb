export interface VehicleServicing {
    id: number,
    maintenanceType: string,
    status: string,
    createdAt: string,
    updatedAt: string,
    vehicleId: number,
    vehicle: {
        id: number,
        vehicleNumber: number,
        model: string,
        isServiceable: boolean,
        vehicleType: string,
        subUnitId: number,
        vehiclesPlatformsId: number,
        createdAt: string,
        updatedAt: string
    },
    checkIn: {
        id: number,
        workCenter: number,
        telephoneNo: number,
        dateIn: string,
        speedoReading: number,
        swdReading: number,
        expectedCheckoutDate: string,
        expectedCheckoutTime: string,
        handedBy: string,
        attender: string,
        checkInType: string,
        frontSensorTag: string,
        vehicleServicingId: number,
        createdAt: string,
        updatedAt: string
    },
    checkOut: object,
    updates: string[]
}
