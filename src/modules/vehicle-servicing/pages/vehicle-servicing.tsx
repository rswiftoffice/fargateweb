import usePermissions from "auth/permissions/hooks/usePermissions";
import {AccessTypes, ReportsModules, SettingsModules} from "auth/permissions/enums";
import { Box } from "@mui/system";
import {
  Button, CircularProgress, Collapse, FormControl, IconButton, InputLabel,
  LinearProgress, MenuItem,
  Paper, Popover, Select,
  Stack,
  Table,
  TableBody,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow, TextField,
} from "@mui/material";
import VisibilityIcon from "@mui/icons-material/Visibility";
import UnauthorizedContent from "core/components/UnauthorizedContent";
import { useNavigate } from "react-router-dom";
import { AppDispatch, RootState } from "store";
import { usePagination } from "core/hooks/usePagination";
import { setPageTitle } from "core/layouts/layoutSlice";
import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import SearchInput from "core/components/SearchInput";
import { StyledTableCell } from "core/components/StyledTable";
import ErrorView from "core/components/ShowError";
import NoRecordSearching from "core/components/NoRecordSearching";
import moment from "moment";
import PreviewModal from "./PreviewModal";
import {getVehicleServicing} from "../VehicleServicingSlice";
import HighlightOffIcon from "@mui/icons-material/HighlightOff"
import SimCardDownloadSharpIcon from "@mui/icons-material/SimCardDownloadSharp";
import FilterAltOutlinedIcon from "@mui/icons-material/FilterAltOutlined"
import CloseIcon from "@mui/icons-material/Close"
import CustomDateRangePicker from "../../shared/components/CustomDateRangePicker";
import {useForm} from "react-hook-form";
import toast from "react-hot-toast";
import {postRequest} from "../../../api";
import fileDownload from "js-file-download";
// @ts-ignore
import { parse } from "json2csv";
import {DatePicker, LocalizationProvider} from "@mui/lab";
import DateAdapterfns from "@mui/lab/AdapterDayjs";

const entity = "ServicingRecord";
interface PreviewProps {
  Id: number
  Vehicle_Number: string
  Maintenance_Type: string
  Status: string
  Updates?: Updates[]
  Updates_Notes?: string
  Date: string
  Created_At: string
  Updated_At: string
}

interface Updates {
  updatedAt: string
  dateOfCompletion: string
  notes: string
  Updates: object[]
}

interface DateRangeProps {
  startDate: Date
  endDate: Date
}

export enum CheckInOutType {
  Preventive = "Preventive",
  Corrective = "Corrective",
  AVI = "AVI",
}

export enum DestinationStatus {
  Review = "Review",
  InProgress = "InProgress",
  Inactive = "Inactive",
  Completed = "Completed",
}

const VehicleServicing = () => {
  const { can } = usePermissions();
  const navigate = useNavigate();
  const dispatch: AppDispatch = useDispatch();
  const [search, setSearch] = useState("");
  const { limit, prevPage, currentPage, setCurrentPage, handleChangePage } =
    usePagination();

  const currentUser = useSelector(
   (state: RootState) => state.login.authenticatedUser
  );

  const vehicleServicing = useSelector((state: RootState) => state.vehicleServicing.vehicleServicing);
  const count = useSelector((state: RootState) => state.vehicleServicing.count);
  const listStatus = useSelector((state: RootState) => state.vehicleServicing.listStatus);
  const [maintenanceType, setMaintenanceType] = useState<CheckInOutType | string>("All")
  const [maintenanceStatus, setMaintenanceStatus] = useState<DestinationStatus | string>("All")
  const [showData, setShowData] = useState(false)
  const [previewDataInfo, setPreviewDataInfo] = useState<PreviewProps | null>(null)

  const formMethods = useForm()
  const { register, handleSubmit, setValue } = formMethods
  const [filter, setFilter] = useState(false)
  const [tripDate, setTripDate] = useState<Date | null>(null)

  const [dateRange, setDateRange] = useState<DateRangeProps>({
    startDate: new Date(),
    endDate: new Date(),
  })
  const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null)
  const [exportData, setExportData] = useState([]);
  const [exportDataLoading, setExportDataLoading] = useState(false);
  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget)
  }

  const open = Boolean(anchorEl)
  const id = open ? "simple-popover" : undefined

  const handleClose = () => {
    setAnchorEl(null)
  }

  const handleDateRangeChange = (range: DateRangeProps) => {
    const newRange = { ...range }
    const endDate = newRange.endDate
    endDate.setDate(endDate.getDate() + 1)
    newRange.endDate = endDate
    setDateRange(newRange)
  }

  const handleExportPress = async () => {
    toast.loading("Generating CSV!")
    handleClose()
    try {
      const list = await getExportData();
      const copyList: PreviewProps[] = list.map((data: any) => ({
        Id: data.id,
        Vehicle_Number: data?.vehicle?.vehicleNumber ?? "N/A",
        Maintenance_Type: data.maintenanceType,
        Updates_Notes:
         data.updates.length > 0 ? data.updates.map((update: any) => update.notes).join(", ") : "N/A",
        Status: data.status as string,
        Date: moment.utc(data.createdAt).local().format("DD MMM, YYYY (HH:mm)"),
        Created_At: moment.utc(data.createdAt).local().format("DD MMM, YYYY (HH:mm)"),
        Updated_At: moment.utc(data.updatedAt).local().format("DD MMM, YYYY (HH:mm)"),
      }))

      if (copyList && copyList.length > 0) {
        toast.dismiss()
        processData(copyList)
      } else {
        toast.dismiss()
        toast.error("No Data Found!")
      }
    } catch (error: any) {
      toast.dismiss()
      toast.error(error.message ?? `Unable to Export data. Please try again!`)
    }
  }

  const getExportData = async () => {
    const response = await postRequest("/vehicle-servicing/get-export-data", {
      currentRole: currentUser?.roles[0],
      serviceId: currentUser?.serviceId,
      commandId: currentUser?.commandId,
      baseAdminId: currentUser?.baseAdminId,
      adminSubUnitId: currentUser?.adminSubUnitId,
      subUnitId: currentUser?.subUnitId,
      fromDate: dateRange.startDate,
      toDate: dateRange.endDate,
    });

    return response.data.records;
  }

  const showFilter = () => setFilter(true)

  const hideFilter = () => {
    setFilter(false)
    clearFilter()
  }

  const clearFilter = () => {
    setTripDate(null)
    setValue("driver", null)
    setValue("vehicle", null)
  }

  const handleFilterClick = () => {
    if (filter) {
      clearFilter()
    } else {
      showFilter()
    }
  }

  const handleDateSelect = (param: any) => {
    if (param !== null) {
      const date = new Date(param)
      if (!isNaN(date.getTime())) {
        setTripDate(date)
      }
    } else {
      setTripDate(null)
    }
  }

  const handleClear = () => {
    setCurrentPage(prevPage)
    setValue("search", "")
  }

  const processData = (exportData: any) => {
    const labels = exportData[0]
    const fields = Object.keys(labels)
    const csv = parse(exportData, fields)
    toast.success("Data exported successfully!")
    fileDownload(csv, `download-${moment.utc().format("HH:mm:ss")}.csv`)
  }

  useEffect(() => {
    dispatch(setPageTitle("Servicing Record"));
  }, [dispatch]);

  useEffect(() => {
    dispatch(
    getVehicleServicing({
      limit: limit,
      offset: currentPage * limit,
      searchValue: search,
      tripDate: tripDate,
      maintenanceType: maintenanceType,
      maintenanceStatus: maintenanceStatus
    })
    );
  }, [dispatch, currentPage, search, limit, tripDate, maintenanceType, maintenanceStatus]);

  const searchSubmit = (search: string) => {
    setCurrentPage(0);
    setSearch(search);
  };

  const searchClear = (search: string) => {
    setCurrentPage(prevPage);
    setSearch("");
  };

  const handleShowData = (record: any) => {
    setPreviewDataInfo(record)
    setShowData(true)
  }

  const handleClosePreview = () => {
    setShowData(false)
    setTimeout(() => {
      setPreviewDataInfo(null)
    }, 100)
  }

  const handleRecordSelect = (data: any) => {
    const myData: PreviewProps = {
      Id: data.id,
      Vehicle_Number: data?.vehicle?.vehicleNumber ?? "N/A",
      Maintenance_Type: data.maintenanceType,
      Updates: data.updates,
      Status: data.status as string,
      Date: moment.utc(data.createdAt).local().format("DD MMM, YYYY (HH:mm)"),
      Created_At: moment.utc(data.createdAt).local().format("DD MMM, YYYY (HH:mm)"),
      Updated_At: moment.utc(data.updatedAt).local().format("DD MMM, YYYY (HH:mm)"),
    }
    handleShowData(myData)
  }

  if (
    can(AccessTypes.READ, ReportsModules.ServicingRecord, 'reports')
  )
    return (
      <div>
        {listStatus === "failed" && (
          <ErrorView
            title={`${entity}s loading failed`}
            desc={`There has been a problem while getting ${entity} list data from the database. Please contact the administration for further details.`}
          />
        )}

        <Box style={{ display: "flex", justifyContent: "end" }}>
          <Button
           variant={"contained"}
           style={{ alignSelf: "end" }}
           onClick={handleClick}
           startIcon={
             exportDataLoading ? (
              <CircularProgress size={16} style={{ color: "white" }} />
             ) : (
              <SimCardDownloadSharpIcon />
             )
           }
           disableElevation
          >
            {"Export"}
          </Button>
          <Popover
           id={id}
           open={open}
           anchorEl={anchorEl}
           onClose={handleClose}
           anchorOrigin={{
             vertical: "bottom",
             horizontal: "right",
           }}
           transformOrigin={{
             vertical: "top",
             horizontal: "right",
           }}
           anchorPosition={{ top: 100, left: 400 }}
          >
            <CustomDateRangePicker
             dateRange={dateRange}
             handleDateRangeChange={handleDateRangeChange}
             onExportPress={handleExportPress}
            />
          </Popover>
        </Box>

        {listStatus !== "failed" && (
          <Box>
            <h2>All Vehicle Servicing</h2>
            <SearchInput
              entity={entity}
              submit={searchSubmit}
              clear={searchClear}
            />
            <br />
            <Box style={{ display: "flex", justifyContent: "flex-end" }}>
              <Button
               variant={filter ? "contained" : "outlined"}
               startIcon={filter ? <HighlightOffIcon /> : <FilterAltOutlinedIcon />}
               onClick={filter ? handleClear : handleFilterClick}
              >
                {filter ? "Clear" : "Filter"}
              </Button>
              {filter && (
               <IconButton sx={{ ml: 2 }} onClick={hideFilter}>
                 <CloseIcon />
               </IconButton>
              )}
            </Box>
            <Collapse in={filter}>
              <div style={{ display: "flex", marginTop: 5, flexWrap: "wrap" }}>
                <FormControl variant="filled" sx={{ m: 1, minWidth: 270 }}>
                  <InputLabel id="demo-simple-select-standard-label">Maintenance Type</InputLabel>
                  <Select
                   value={maintenanceType}
                   onChange={(event) =>
                    setMaintenanceType((event?.target?.value as CheckInOutType) ?? undefined)
                   }
                   label={"Maintenance Type"}
                  >
                    <MenuItem value={"All"}>{"All"}</MenuItem>
                    {Object.values(CheckInOutType).map((value, key) => (
                     <MenuItem key={key} value={value}>
                       {value}
                     </MenuItem>
                    ))}
                  </Select>
                </FormControl>
                <FormControl variant="filled" sx={{ m: 1, minWidth: 270 }}>
                  <InputLabel id="demo-simple-select-standard-label">Maintenance Status</InputLabel>
                  <Select
                   value={maintenanceStatus}
                   onChange={(event) =>
                    setMaintenanceStatus((event?.target?.value as DestinationStatus) ?? undefined)
                   }
                   label={"Maintenance Status"}
                  >
                    <MenuItem value={"All"}>{"All"}</MenuItem>
                    {Object.values(DestinationStatus).map((value, key) => (
                     <MenuItem key={key} value={value}>
                       {value}
                     </MenuItem>
                    ))}
                  </Select>
                </FormControl>
                <Box sx={{ m: 1, minWidth: 270 }}>
                  <LocalizationProvider dateAdapter={DateAdapterfns}>
                    <DatePicker
                     label={"Date"}
                     value={tripDate}
                     onChange={handleDateSelect}
                     maxDate={moment.utc().add(1, "days")}
                     renderInput={(params) => <TextField variant={"filled"} {...params} />}
                    />
                  </LocalizationProvider>
                </Box>
              </div>
            </Collapse>
            <br />

            <TableContainer component={Paper}>
              {listStatus === "pending" && <LinearProgress />}
              <Table sx={{ minWidth: 650 }} aria-label="simple table">
                <TableHead>
                  <TableRow>
                    <StyledTableCell align="left">Id</StyledTableCell>
                    <StyledTableCell align="left">Vehicle Number</StyledTableCell>
                    <StyledTableCell align="left">Maintenance Type</StyledTableCell>
                    <StyledTableCell align="left">Maintenance Status</StyledTableCell>
                    <StyledTableCell align="left">Date</StyledTableCell>
                    <StyledTableCell align="center" width={50}>
                      Actions
                    </StyledTableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {vehicleServicing &&
                   vehicleServicing.map((data, key) => (
                    <TableRow key={key} sx={{ "&:last-child td, &:last-child th": { border: 0 } }}>
                      <StyledTableCell component="th" scope="row">
                        {data.id}
                      </StyledTableCell>
                      <StyledTableCell component="th" scope="row">
                        {data?.vehicle?.vehicleNumber ?? "N/A"}
                      </StyledTableCell>
                      <StyledTableCell component="th" scope="row">
                        {data.maintenanceType}
                      </StyledTableCell>
                      <StyledTableCell component="th" scope="row">
                        {data.status}
                      </StyledTableCell>
                      <StyledTableCell component="th" scope="row">
                        {moment.utc(data.createdAt).local().format("DD MMM, YYYY (HH:mm)")}
                      </StyledTableCell>
                      <StyledTableCell align="right" width={50}>
                        <Stack direction="row">
                          <Button
                           sx={{ px: 3 }}
                           startIcon={<VisibilityIcon />}
                           onClick={() => handleRecordSelect(data)}
                          >
                            View
                          </Button>
                        </Stack>
                      </StyledTableCell>
                    </TableRow>
                    ))}
                </TableBody>
              </Table>
              {!count && listStatus !== "pending" && (
                <NoRecordSearching search={search} entity={entity} />
              )}
            </TableContainer>
            <TablePagination
              component="div"
              rowsPerPageOptions={[limit]}
              count={count || 0}
              rowsPerPage={limit}
              page={currentPage}
              onPageChange={handleChangePage}
            />
            <PreviewModal open={showData} data={previewDataInfo} handleClose={handleClosePreview} />
          </Box>
        )}
      </div>
    );
  return <UnauthorizedContent />;
};
export default VehicleServicing;
