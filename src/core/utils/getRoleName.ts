export const getRoleName = (role: string): string => {
  switch (role) {
    case "SUPER_ADMIN":
      return "Super Admin";
    case "SERVICES":
      return "Service";
    case "COMMAND":
      return "Command";
    case "BASE":
      return "Base";
    case "SUB_UNIT":
      return "Sub Unit";
    case "MAINTENANCE":
      return "Maintenance";
    case "AUDITOR":
      return "Auditor";
    case "APPROVING_OFFICER":
      return "Approving Officer";
    case "DRIVER":
      return "Driver";
    case "MAC":
      return "MAC";
    case "PRE_APPROVED_DRIVER":
      return "Pre-Approved Driver";
    default:
      return role as string;
  }
};
