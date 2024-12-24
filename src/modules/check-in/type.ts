export interface CheckIn {
    id: number,
    workCenter: string,
    telephoneNo: string,
    dateIn: string,
    speedoReading: number,
    swdReading: string,
    expectedCheckoutDate: string,
    expectedCheckoutTime: string,
    handedBy: string,
    attender: string,
    checkInType: string,
    frontSensorTag: string,
    vehicleServicingId: number,
    createdAt: string,
    updatedAt: string,
    images: string[],
    annualVehicleInspection: string,
    basicIssueTools: [
        {
            id: number,
            name: string,
            quantity: number,
            checkInId: number,
            checkOutId: number,
            createdAt: string,
            updatedAt: string
        }
    ],
    correctiveMaintenance: object,
    preventiveMaintenance: {
        id: number,
        type: string,
        defect: string,
        checkinId: number,
        createdAt: string,
        updatedAt: string
    },
    vehicleServicing: {
        id: number,
        maintenanceType: string,
        status: string,
        createdAt: string,
        updatedAt: string,
        vehicleId: number
    }
}
