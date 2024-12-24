import { reportsAccessControl } from "./reports"
import { settingsAccessControl } from "./settings"

export const accessControlMatrix = {
  Settings: settingsAccessControl,
  Reports: reportsAccessControl,
}
