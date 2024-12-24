import React from 'react';
import {ThemeProvider} from '@mui/material';
import {Routes, Route} from 'react-router-dom';
import {theme} from './theme';
import Login from './modules/login/Login';
import PrivateRoute from './components/PrivateRoute';
import Command from "./modules/command/Command";
import AddNewCommandLayout from "./modules/command/layouts/AddNewCommandLayout";
import { Toaster } from "react-hot-toast";
import EditCommandLayout from "./modules/command/layouts/EditCommandLayout";
import CommandAdmins from "./modules/command-admin/pages/command-admins";
import MainLayout from "./core/layouts/MainLayout";
import DashBoard from "./modules/dasboard/pages/dashboard";
import AddCommandAdmin from "./modules/command-admin/pages/add-command-admin";
import EditCommandAdmin from "./modules/command-admin/pages/edit-command-admin";
import Users from "./modules/user/pages/users";
import AddUser from "./modules/user/pages/add-user";
import EditUser from "./modules/user/pages/edit-user";
import Services from "./modules/service/pages/services";
import AddService from "modules/service/pages/add-service";
import EditService from "modules/service/pages/edit-service";
import ServiceAdmins from "modules/service-admin/pages/service-admins";
import AddServiceAdmin from "modules/service-admin/pages/add-service-admin";
import EditServiceAdmin from "modules/service-admin/pages/edit-service-admin";
import Bases from "modules/base/pages/bases";
import AddBase from "modules/base/pages/add-base";
import EditBase from "modules/base/pages/edit-base";
import BaseAdmins from "modules/base-admin/pages/base-admins";
import AddBaseAdmin from "modules/base-admin/pages/add-base-admin";
import EditBaseAdmin from "modules/base-admin/pages/edit-base-admin";
import SubUnits from "modules/subunit/pages/subunits";
import AddSubUnit from "modules/subunit/pages/add-subunit";
import EditSubunit from "modules/subunit/pages/edit-subunit";
import SubUnitAdmins from "modules/subunit-admin/pages/subUnit-admins";
import AddSubUnitAdmin from "modules/subunit-admin/pages/add-subUnit-admin";
import EditSubUnitAdmin from "modules/subunit-admin/pages/edit-subUnit-admin";
import Vehicles from "modules/vehicle/pages/vehicles";
import AddVehicle from "modules/vehicle/pages/add-vehicle";
import EditVehicle from "modules/vehicle/pages/edit-vehicle";
import AuditorAdmins from "modules/auditor-admin/pages/auditor-admins";
import AddAuditorAdmin from "modules/auditor-admin/pages/add-auditor-admin";
import EditAuditorAdmin from "modules/auditor-admin/pages/edit-auditor-admin";
import LicenseClasses from "modules/license-class/pages/licenseClasses";
import AddLicenseClass from "modules/license-class/pages/add-license";
import EditLicenseClass from 'modules/license-class/pages/edit-license';
import MaintenanceAdmins from "modules/maintenance-admin/pages/maintenance-admins";
import AddMaintenanceAdmin from "modules/maintenance-admin/pages/add-maintenance-admin";
import EditMaintenanceAdmin from "modules/maintenance-admin/pages/edit-maintenance-admin";
import VehiclesPlatform from 'modules/vehicle-platform/pages/vehicles-platform';
import AddVehiclesPlatform from 'modules/vehicle-platform/pages/add-vehicles-platform';
import EditVehiclesPlatform from 'modules/vehicle-platform/pages/edit-vehicles-platform';
import MtBroadcast from 'modules/mt-broadcast/pages/mt-broadcast';
import AddMtBroadcast from 'modules/mt-broadcast/pages/add-mt-broadcast';
import Destinations from "modules/destination/pages/destinations";
import EditDestination from "modules/destination/pages/edit-destination";
import Bos from 'modules/bos-all/pages/bos';
import EditBos from 'modules/bos-all/pages/edit-bos';
import AuditLog from "./modules/audit-logs/pages/audit-logs";
import ElogBook from "./modules/elog-book/pages/elog-book";
import BocTrip from "./modules/boc-trip/pages/boc-trip";
import MtracForm from "./modules/mtrac-form/pages/mtrac-form";
import VehicleServicing from "./modules/vehicle-servicing/pages/vehicle-servicing";
import DriverMileage from "./modules/driver-mileages/pages/driver-mileages";
import CheckIn from "./modules/check-in/pages/check-in";
import CheckOut from "./modules/check-out/pages/check-out";

function App() {
  return (
    <ThemeProvider theme={theme}>
      <Routes>
        <Route path="/login" element={<Login />} />

        <Route
          path="/"
          element={
            <PrivateRoute>
              <MainLayout />
            </PrivateRoute>
          }
        >
          <Route path="dashboard" element={<DashBoard />} />
          <Route path="commands" element={<Command />} />
          <Route path="commands/add" element={<AddNewCommandLayout />} />
          <Route
            path="commands/edit/:commandId"
            element={<EditCommandLayout />}
          />
          <Route path="command-admins" element={<CommandAdmins />} />
          <Route path="command-admins/add" element={<AddCommandAdmin />} />
          <Route
            path="command-admins/edit/:commandAdminId"
            element={<EditCommandAdmin />}
          />
          {/*AuditLog Module*/}
          <Route path="auditlog" element={<AuditLog />} />

          {/*User module*/}
          <Route path="users" element={<Users />} />
          <Route path="users/add" element={<AddUser />} />
          <Route path="users/edit/:userId" element={<EditUser />} />
          {/* Service module */}
          <Route path="services" element={<Services />} />
          <Route path="services/add" element={<AddService />} />
          <Route path="services/edit/:serviceId" element={<EditService />} />
          {/* Service Admin module */}
          <Route path="service-admins" element={<ServiceAdmins />} />
          <Route path="service-admins/add" element={<AddServiceAdmin />} />
          <Route
            path="service-admins/edit/:serviceAdminId"
            element={<EditServiceAdmin />}
          />
          {/* Base module */}
          <Route path="bases" element={<Bases />} />
          <Route path="bases/add" element={<AddBase />} />
          <Route path="bases/edit/:baseId" element={<EditBase />} />
          {/* Base admin module */}
          <Route path="base-admins" element={<BaseAdmins />} />
          <Route path="base-admins/add" element={<AddBaseAdmin />} />
          <Route
            path="base-admins/edit/:baseAdminId"
            element={<EditBaseAdmin />}
          />
          {/* Subunit module */}
          <Route path="subunits" element={<SubUnits />} />
          <Route path="subunits/add" element={<AddSubUnit />} />
          <Route path="subunits/edit/:subunitId" element={<EditSubunit />} />
          {/* Base admin module */}
          <Route path="subUnit-admins" element={<SubUnitAdmins />} />
          <Route path="subUnit-admins/add" element={<AddSubUnitAdmin />} />
          <Route
            path="subUnit-admins/edit/:subUnitAdminId"
            element={<EditSubUnitAdmin />}
          />
          {/* Vehicle module */}
          <Route path="vehicles" element={<Vehicles />} />
          <Route path="vehicles/add" element={<AddVehicle />} />
          <Route path="vehicles/edit/:vehicleId" element={<EditVehicle />} />
          {/* Auditor Admin module */}
          <Route path="auditor-admins" element={<AuditorAdmins />} />
          <Route path="auditor-admins/add" element={<AddAuditorAdmin />} />
          <Route
            path="auditor-admins/edit/:auditorAdminId"
            element={<EditAuditorAdmin />}
          />
          {/* License Classes */}
          <Route path="license-clases" element={<LicenseClasses />} />
          <Route path="/license-clases/add" element={<AddLicenseClass />} />
          <Route
            path="/license-clases/edit/:licenseId"
            element={<EditLicenseClass />}
          />
          {/* Maintenance Admin module */}
          <Route path="maintenance-admins" element={<MaintenanceAdmins />} />
          <Route
            path="maintenance-admins/add"
            element={<AddMaintenanceAdmin />}
          />
          <Route
            path="maintenance-admins/edit/:maintenanceAdminId"
            element={<EditMaintenanceAdmin />}
          />
          {/* Vehicle platform module */}
          <Route path="vehicle-platform" element={<VehiclesPlatform />} />
          <Route
            path="/vehicle-platform/add"
            element={<AddVehiclesPlatform />}
          />
          <Route
            path="/vehicle-platform/edit/:vehiclePlatformId"
            element={<EditVehiclesPlatform />}
          />
          {/* Mt broadcast module */}
          <Route path="mt-broadcast" element={<MtBroadcast />} />
          <Route path="/mt-broadcast/add" element={<AddMtBroadcast />} />
          <Route
            path="/vehicle-platform/add"
            element={<AddVehiclesPlatform />}
          />
          <Route
            path="/vehicle-platform/edit/:vehiclePlatformId"
            element={<EditVehiclesPlatform />}
          />
          {/* Destination module */}
          <Route path="destinations" element={<Destinations />} />
          <Route
            path="destinations/edit/:destinationId"
            element={<EditDestination />}
          />
          {/* BOS Module */}
          <Route path="e-boc-trip" element={<Bos />} />
          <Route path="e-boc-trip/edit/:bosId" element={<EditBos />} />

          <Route path="/auth/microsoft/success" element={<></>} />

          {/*Report Modules*/}
          <Route path="elog-destination" element={<ElogBook />} />
          <Route path="boc-trip" element={<BocTrip />} />
          <Route path="mtrac-form" element={<MtracForm />} />
          <Route path="vehicle-servicing" element={<VehicleServicing />} />
          <Route path="driver-mileage" element={<DriverMileage />} />
          <Route path="check-in" element={<CheckIn />} />
          <Route path="check-out" element={<CheckOut />} />
        </Route>
      </Routes>
      <Toaster />
    </ThemeProvider>
  );
}

export default App;
