import { Command } from "../command/type";

export interface AuditLog {
    addedBy: AuditLogAddedBy,
    createdAt: string,
    currentRole: string,
    description: string,
    id: number,
    name: string,
    updatedAt: string,
    userId: number,
}

export interface AuditLogAddedBy {
    adminSubUnitId: number,
    baseAdminId: number,
    commandId: number,
    createdAt: string,
    email: string,
    hasBaseLevelVehiclesAccess: boolean,
    id: number,
    name: string,
    password: string,
    provider: string,
    serviceId: number,
    subUnitId: number,
    updatedAt: string,
    username: string
}
