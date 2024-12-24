export interface CheckOut {
    id: number,
    dateOut: string,
    speedoReading: string,
    swdReading: string,
    time: string,
    remark: string,
    attendedBy: string,
    workCenter: string,
    vehicleTakenOver: string,
    checkOutType: string,
    vehicleServicingId: number,
    createdAt: string,
    updatedAt: string,
    annualVehicleInspection: object,
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
    preventiveMaintenance: {
        id: number,
        nextServicingDate: string,
        nextServicingMileage: number,
        checkOutId: number,
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
