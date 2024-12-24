export interface DriverMileage {
    id: number,
    name: string,
    email: string,
    username: string,
    password: string,
    hasBaseLevelVehiclesAccess: boolean,
    provider: string,
    subUnitId: number,
    adminSubUnitId: number,
    serviceId: number,
    commandId: number,
    baseAdminId: number,
    createdAt: string,
    updatedAt: string,
    licenseClasses: [
        {
            id: number,
            class: number,
            createdAt: string,
            updatedAt: string
        },
    ],
    roles: [
        {
            id: number,
            name: string,
            createdAt: string,
            updatedAt: string
        },
    ],
    subUnit: {
        id: number,
        name: string,
        description: string,
        baseId: number,
        createdAt: string,
        updatedAt: string,
        base: {
            id: number,
            name: string,
            description: string,
            commandId: number,
            createdAt: string,
            updatedAt: string,
            command: {
                id: number,
                name: string,
                description: string,
                createdAt: string,
                updatedAt: string,
                serviceId: number,
                service: {
                    id: number,
                    name: string,
                    description: string,
                    createdAt: string,
                    updatedAt: string
                }
            }
        }
    }
}
