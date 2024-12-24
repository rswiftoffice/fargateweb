import {configureStore} from '@reduxjs/toolkit';
import loginReducer from './modules/login/loginSlice';
import commandReducer from './modules/command/commandSlice';
import serviceReducer from './modules/service/serviceSlice';
import commandAdminReducer from "./modules/command-admin/commandAdminSlice";
import layoutReducer from "./core/layouts/layoutSlice";
import userReducer from "./modules/user/userSlice";
import baseReducer from "./modules/base/baseSlice";
import subUnitReducer from "./modules/subunit/subunitSlice";
import licenseClassSlice from "./modules/license-class/licenseClassSlice";
import serviceAdminSlice from "modules/service-admin/serviceAdminSlice";
import baseAdminSlice from "modules/base-admin/baseAdminSlice";
import subUnitAdminSlice from "modules/subunit-admin/subUnitAdminSlice";
import vehicleSlice from "modules/vehicle/vehicleSlice";
import auditorAdminSlice from "modules/auditor-admin/auditorAdminSlice";
import maintenanceAdminSlice from "modules/maintenance-admin/maintenanceAdminSlice";
import vehiclePlatformSlice from 'modules/vehicle-platform/vehiclePlatformSlice';
import mtBroadcastSlice from 'modules/mt-broadcast/mtBroadcastSlice';
import destinationSlice from "modules/destination/destinationSlice";
import bosSlice from 'modules/bos-all/bosSlice';
import auditLogReducer from "./modules/audit-logs/auditLogSlice";
import elogBookSlice from "./modules/elog-book/ElogBookSlice";
import bocTripSlice from "./modules/boc-trip/BocTripSlice";
import mtracFormSlice from "./modules/mtrac-form/MtracFormSlice";
import vehicleServicingSlice from "./modules/vehicle-servicing/VehicleServicingSlice";
import driverMileageSlice from "./modules/driver-mileages/DriverMileageSlice";
import checkInSlice from "./modules/check-in/CheckInSlice";
import checkOutSlice from "./modules/check-out/CheckOutSlice";

export const store = configureStore({
  reducer: {
    auditLog: auditLogReducer,
    login: loginReducer,
    command: commandReducer,
    service: serviceReducer,
    commandAdmin: commandAdminReducer,
    layout: layoutReducer,
    user: userReducer,
    base: baseReducer,
    subUnit: subUnitReducer,
    licenseClass: licenseClassSlice,
    serviceAdmin: serviceAdminSlice,
    baseAdmin: baseAdminSlice,
    subUnitAdmin: subUnitAdminSlice,
    vehicle: vehicleSlice,
    auditorAdmin: auditorAdminSlice,
    maintenanceAdmin: maintenanceAdminSlice,
    vehiclePlatform: vehiclePlatformSlice,
    mtBroadcast: mtBroadcastSlice,
    destination: destinationSlice,
    bos: bosSlice,
    elogBook: elogBookSlice,
    bocTrip: bocTripSlice,
    mtracForm: mtracFormSlice,
    vehicleServicing: vehicleServicingSlice,
    driverMileage: driverMileageSlice,
    checkIn: checkInSlice,
    checkOut: checkOutSlice
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
