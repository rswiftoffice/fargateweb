import { useState } from "react";
import List from "@mui/material/List";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import InboxIcon from "@mui/icons-material/MoveToInbox";
import { Collapse, Divider, ListItemButton } from "@mui/material";
import ListItemLink from "./ListItemLink";
import { AccountBox, ExpandLess, ExpandMore } from "@mui/icons-material";
import usePermissions from "../../auth/permissions/hooks/usePermissions";
import {
  AccessTypes,
  ReportsModules,
  SettingsModules,
} from "../../auth/permissions/enums";

const MainMenu = () => {
  const [openSetting, setOpenSetting] = useState(false);
  const [openReport, setOpenReport] = useState(false);
  const { can } = usePermissions();
  const handleOpenSetting = () => {
    setOpenSetting(!openSetting);
  };
  const handleOpenReport = () => {
    setOpenReport(!openReport);
  };

  const SettingOptions = [
    {
      ...(can(AccessTypes.READ, SettingsModules.User)
        ? {
            name: "User",
            icon: <AccountBox />,
            href: "users",
          }
        : {}),
    },
    {
      ...(can(AccessTypes.READ, SettingsModules.Service)
        ? {
            name: "Service",
            icon: <AccountBox />,
            href: "services",
          }
        : {}),
    },
    {
      ...(can(AccessTypes.READ, SettingsModules.Command)
        ? {
            name: "Command",
            icon: <AccountBox />,
            href: "commands",
          }
        : {}),
    },
    {
      ...(can(AccessTypes.READ, SettingsModules.Base)
        ? {
            name: "Base",
            icon: <AccountBox />,
            href: "bases",
          }
        : {}),
    },
    {
      ...(can(AccessTypes.READ, SettingsModules.SubUnits)
        ? {
            name: "Sub Unit",
            icon: <AccountBox />,
            href: "subunits",
          }
        : {}),
    },
    {
      ...(can(AccessTypes.READ, SettingsModules.MaintenanceAdmin)
        ? {
            name: "Maintenance Admin",
            icon: <AccountBox />,
            href: "maintenance-admins",
          }
        : {}),
    },
    {
      ...(can(AccessTypes.READ, SettingsModules.AuditorAdmin)
        ? {
            name: "Auditor Admin",
            icon: <AccountBox />,
            href: "auditor-admins",
          }
        : {}),
    },
    {
      ...(can(AccessTypes.READ, SettingsModules.Vehicle)
        ? {
            name: "Vehicle",
            icon: <AccountBox />,
            href: "vehicles",
          }
        : {}),
    },
    {
      ...(can(AccessTypes.READ, SettingsModules.LicenseClass)
        ? {
            name: "License Class",
            icon: <AccountBox />,
            href: "license-clases",
          }
        : {}),
    },
    {
      ...(can(AccessTypes.READ, SettingsModules.VehiclePlatform)
        ? {
            name: "Vehicles Platform",
            icon: <AccountBox />,
            href: "vehicle-platform",
          }
        : {}),
    },
    {
      ...(can(AccessTypes.READ, SettingsModules.EditDestination)
        ? {
            name: "Edit Destination",
            icon: <AccountBox />,
            href: "destinations",
          }
        : {}),
    },
    // {
    //   ...(can(AccessTypes.READ, SettingsModules.MTRACForm)
    //     ? {
    //         name: "MTRAC Form",
    //         icon: <AccountBox />,
    //         href: Routes.EMTRACForm(),
    //       }
    //     : {}),
    // },

    {
      ...(can(AccessTypes.READ, SettingsModules.BOS_AOS_POL_DI_AHS)
        ? {
            name: "Edit BOS/AOS/POL/DI/AHS",
            icon: <AccountBox />,
            href: "e-boc-trip",
          }
        : {}),
    },
    {
      ...(can(AccessTypes.READ, SettingsModules.MTBroadcast)
        ? {
            name: "MT BroadCast",
            icon: <AccountBox />,
            href: "mt-broadcast",
          }
        : {}),
    },
  ];

  const ReportOptions = [
    {
      ...(can(AccessTypes.READ, ReportsModules.AuditLog, 'reports')
        ? {
            name: "Audit Log",
            icon: <AccountBox />,
            href: "auditlog",
          }
        : {}),
    },
    {
      ...(can(AccessTypes.READ, ReportsModules.ElogBook, 'reports')
        ? {
            name: "ELogBook",
            icon: <AccountBox />,
            href: '/elog-destination'
          }
        : {}),
    },

    {
      ...(can(AccessTypes.READ, ReportsModules.BOS_AOS_POL_DI_AHS, 'reports')
        ? {
            name: "BOS/AOS/POL/DI/AHS",
            icon: <AccountBox />,
            href: 'boc-trip'
          }
        : {}),
    },
    {
      ...(can(AccessTypes.READ, ReportsModules.MTRACForm, 'reports')
        ? {
            name: "MTRAC Form",
            icon: <AccountBox />,
            href: 'mtrac-form',
          }
        : {}),
    },
    {
      ...(can(AccessTypes.READ, ReportsModules.ServicingRecord, 'reports')
        ? {
            name: "Vehicle Servicing",
            icon: <AccountBox />,
            href: 'vehicle-servicing',
          }
        : {}),
    },
    {
      ...(can(AccessTypes.READ, ReportsModules.DriverMileage, 'reports')
        ? {
            name: "Driver Mileage",
            icon: <AccountBox />,
            href: 'driver-mileage',
          }
        : {}),
    },
    {
      ...(can(AccessTypes.READ, ReportsModules.CheckIn, 'reports')
        ? {
            name: "Check In",
            icon: <AccountBox />,
            href: 'check-in',
          }
        : {}),
    },
    {
      ...(can(AccessTypes.READ, ReportsModules.CheckOut, 'reports')
        ? {
            name: "Check Out",
            icon: <AccountBox />,
            href: 'check-out',
          }
        : {}),
    },
  ];

  return (
    <>
      <List>
        <ListItemButton onClick={handleOpenSetting}>
          <ListItemIcon>
            <InboxIcon />
          </ListItemIcon>
          <ListItemText primary="Settings" />
          {openSetting ? <ExpandLess /> : <ExpandMore />}
        </ListItemButton>
        <Collapse component="li" in={openSetting} timeout="auto" unmountOnExit>
          <List>
            {SettingOptions.map(
              (option, key) =>
                option?.href && (
                  <ListItemLink
                    key={key}
                    name={option.name}
                    icon={option.icon}
                    sx={{ pl: 3.5 }}
                    href={option.href}
                  />
                )
            )}
          </List>
        </Collapse>
      </List>
      <Divider />
      <List>
        <ListItemButton onClick={handleOpenReport}>
          <ListItemIcon>
            <InboxIcon />
          </ListItemIcon>
          <ListItemText primary="Report" />
          {openReport ? <ExpandLess /> : <ExpandMore />}
        </ListItemButton>
        <Collapse component="li" in={openReport} timeout="auto" unmountOnExit>
          <List>
            {ReportOptions.map(
              (option, key) =>
                option?.href && (
                  <ListItemLink
                    key={key}
                    name={option.name}
                    icon={option.icon}
                    sx={{ pl: 3.5 }}
                    href={option.href}
                  />
                )
            )}
          </List>
        </Collapse>
      </List>
    </>
  );
};

export default MainMenu;
