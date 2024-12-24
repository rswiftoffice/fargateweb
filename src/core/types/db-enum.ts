/* eslint-disable no-unused-vars */
export enum AppRoles {
  //App roles
  DRIVER = "DRIVER",
  PRE_APPROVED_DRIVER = "PRE_APPROVED_DRIVER",
  MAC = "MAC",
  APPROVING_OFFICER = "APPROVING_OFFICER",
}

export enum UserRoles {
  //Admin roles
  SUPER_ADMIN = "SUPER_ADMIN",
  SERVICES = "SERVICES",
  COMMAND = "COMMAND",
  BASE = "BASE",
  SUB_UNIT = "SUB_UNIT",
  MAINTENANCE = "MAINTENANCE",
  AUDITOR = "AUDITOR",
  //App roles
  DRIVER = "DRIVER",
  PRE_APPROVED_DRIVER = "PRE_APPROVED_DRIVER",
  MAC = "MAC",
  APPROVING_OFFICER = "APPROVING_OFFICER",
}

export enum TokenType {
  RESET_PASSWORD = "RESET_PASSWORD",
}

export enum Provider {
  LOCAL = "LOCAL",
  MICROSOFT = "MICROSOFT",
}

export enum ApprovalStatus {
  Approved = "Approved",
  Rejected = "Rejected",
  Pending = "Pending",
}

export enum DestinationStatus {
  Review = "Review",
  InProgress = "InProgress",
  Inactive = "Inactive",
  Completed = "Completed",
}

export enum TripStatus {
  Approved = "Approved",
  Rejected = "Rejected",
  Pending = "Pending",
  Cancelled = "Cancelled",
}

export enum MTRACFormStatus {
  Review = "Review",
  Approved = "Approved",
  Deny = "Deny",
}

export enum FrontSensorTag {
  Yes = "Yes",
  No = "No",
}

export enum CheckInOutType {
  Preventive = "Preventive",
  Corrective = "Corrective",
  AVI = "AVI",
}

export enum FuelType {
  Diesel = "Diesel",
  Petrol = "Petrol",
}

export enum VehicleType {
  Vehicle = "Vehicle",
  Motorcycle = "Motorcycle",
}

export enum LogAction {
  CREATE = "CREATED",
  UPDATE = "UPDATED",
  DELETE = "DELETED",
}

export enum RequesitionerPurpose {
  BOS = "BOS",
  AOS = "AOS",
  POL = "POL",
}
