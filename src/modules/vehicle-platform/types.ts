export interface LicenseClass {
  class: string;
  createdAt: string;
  id: number;
  updatedAt: string;
} 
export interface VehiclePlatform {
  id: number;
  name: string;
  licenseClass: LicenseClass;
}

export interface VehiclePlatformValues {
  name: string;
  licenseClassId: number;
}