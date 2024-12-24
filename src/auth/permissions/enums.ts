export enum AccessTypes {
  CREATE = "CREATE",
  READ = "READ",
  UPDATE = "UPDATE",
  DELETE = "DELETE",
}

export enum SettingsModules {
  AuditLog = "AuditLog",
  User = "User",
  Vehicle = "Vehicle",
  Service = "Service",
  ServiceAdmin = "ServiceAdmin",
  Command = "Command",
  CommandAdmin = "CommandAdmin",
  Base = "Base",
  BaseAdmin = "BaseAdmin",
  AuditorAdmin = "AuditorAdmin",
  SubUnits = "SubUnits",
  SubUnitsAdmin = "SubUnitsAdmin",
  MaintenanceAdmin = "MaintenanceAdmin",
  LicenseClass = "LicenseClass",
  VehiclePlatform = "VehiclePlatform",
  VehicleType = "VehicleType",
  EditDestination = "EditDestination",
  MTBroadcast = "MTBroadcast",
  BOS_AOS_POL_DI_AHS = "BOS_AOS_POL_DI_AHS",
  MTRACForm = "MTRACForm",
  ElogBook = "ElogBook",
}

export enum ReportsModules {
  AuditLog = "AuditLog",
  ElogBook = "ElogBook",
  BOS_AOS_POL_DI_AHS = "BOS/AOS/POL/DI/BOS_AOS_POL_DI_AHS",
  MTRACForm = "MTRACForm",
  ServicingRecord = "ServicingRecord",
  DriverMileage = "DriverMileage",
  CheckIn = "CheckIn",
  CheckOut = "CheckOut",
}

export enum AdminRoles {
  //Admin roles
  SUPER_ADMIN = "SUPER_ADMIN",
  SERVICES = "SERVICES",
  COMMAND = "COMMAND",
  BASE = "BASE",
  SUB_UNIT = "SUB_UNIT",
  MAINTENANCE = "MAINTENANCE",
  AUDITOR = "AUDITOR",
}
