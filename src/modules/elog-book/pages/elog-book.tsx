import usePermissions from "auth/permissions/hooks/usePermissions";
import { AccessTypes, SettingsModules } from "auth/permissions/enums";
import { Box } from "@mui/system";
import {
  Button, CircularProgress, Collapse, Grid, IconButton,
  LinearProgress,
  Paper, Popover,
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
import {getElogBooks} from "../ElogBookSlice";
import SimCardDownloadSharpIcon from "@mui/icons-material/SimCardDownloadSharp";
import CustomDateRangePicker from "../../shared/components/CustomDateRangePicker";
import toast from "react-hot-toast";
import {postRequest} from "../../../api";
import fileDownload from "js-file-download";
// @ts-ignore
import { parse } from "json2csv";
import {useForm} from "react-hook-form";
import DateAdapterfns from "@mui/lab/AdapterDayjs"
import CloseIcon from "@mui/icons-material/Close"
import FilterAltOutlinedIcon from "@mui/icons-material/FilterAltOutlined"
import HighlightOffIcon from "@mui/icons-material/HighlightOff"
import {DatePicker, LocalizationProvider} from "@mui/lab";
import DriverSelector from "../../shared/selectors/DriverSelector";
import VehicleSelector from "../../shared/selectors/VehicleSelector";

const entity = "ElogBook";
interface PreviewProps {
    Id: number
    Vehicle_Number: string
    Trip_Date: string
    To_Destination: string
    Requisitioner_Purpose: string
    Start_Time: string
    End_Time: string
    Stationary_Running_Time: number | string
    End_Meter_Reading: number
    Total_Distance: number
    Driver_Name: string
    Approving_Officer: string
    Remarks: string
}

interface DateRangeProps {
  startDate: Date
  endDate: Date
}

interface Driver {
  id: number
  name: string
}
interface Vehicle {
  id: number
  vehicleNumber: string
}

const ElogBook = () => {
  const { can } = usePermissions();
  const navigate = useNavigate();
  const dispatch: AppDispatch = useDispatch();
  const [search, setSearch] = useState("");
  const { limit, prevPage, currentPage, setCurrentPage, handleChangePage } =
    usePagination();

  const currentUser = useSelector(
   (state: RootState) => state.login.authenticatedUser
  );

  const elogBooks = useSelector((state: RootState) => state.elogBook.eLogBooks);
  const count = useSelector((state: RootState) => state.elogBook.count);
  const listStatus = useSelector((state: RootState) => state.elogBook.listStatus);
  const [showData, setShowData] = useState(false)
  const [previewDataInfo, setPreviewDataInfo] = useState<PreviewProps | null>(null)

  const formMethods = useForm()
  const { register, handleSubmit, setValue } = formMethods
  const [filter, setFilter] = useState(false)
  const [tripDate, setTripDate] = useState<Date | null>(null)
  const [selectedDriver, setSelectedDriver] = useState<Driver | null>(null)
  const [selectedVehicle, setSelectedVehicle] = useState<Vehicle | null>(null)

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
        Vehicle_Number: data?.destination?.trip?.vehicle?.vehicleNumber ?? "N/A",
        Trip_Date: data?.destination?.trip?.tripDate
         ? moment.utc(data?.destination?.trip?.tripDate).local().format("DD MMM, YYYY") + "\t"
         : "N/A",
        To_Destination: data?.destination?.to ?? "N/A",
        // Destination_Status: data?.destination?.status ?? "N/A",
        Requisitioner_Purpose: data?.destination?.requisitionerPurpose ?? "N/A",
       	Start_Time: moment.utc(data.startTime).local().format("HH:mm"),
        End_Time: data?.endTime ? moment.utc(data?.endTime).local().format("HH:mm") : "N/A",
        Stationary_Running_Time: data?.stationaryRunningTime ?? "N/A",
        End_Meter_Reading: data.meterReading,
        Total_Distance: data.totalDistance,
        // Fuel_Received: data?.fuelReceived ?? "N/A",
        // Fuel_Type: (data?.fuelType as string) ?? "N/A",
        // POSO_Number: data?.POSONumber ?? "N/A",
        Driver_Name: data?.destination?.trip?.driver?.name ?? "N/A",
        Approving_Officer: data?.destination?.trip?.approvingOfficer?.name ?? "N/A",
        Remarks: data?.remarks ?? "N/A",
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
    const response = await postRequest("/elog-book/get-export-data", {
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
    setSelectedDriver(null)
    setSelectedVehicle(null)
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
    dispatch(setPageTitle("Elog Books"));
  }, [dispatch]);

  useEffect(() => {
    dispatch(
    getElogBooks({
        limit: limit,
        offset: currentPage * limit,
        searchValue: search,
        driverName: selectedDriver?.name,
        vehicleNumber: selectedVehicle?.vehicleNumber,
        tripDate: tripDate,
        currentRole: currentUser?.roles[0],
        serviceId: currentUser?.serviceId,
        commandId: currentUser?.commandId,
        baseAdminId: currentUser?.baseAdminId,
        adminSubUnitId: currentUser?.adminSubUnitId,
        subUnitId: currentUser?.subUnitId,
      })
    );
  }, [dispatch, currentPage, search, limit, tripDate, selectedDriver, selectedVehicle]);

  const onEdit = (id: number) => {
    navigate(`/bases/edit/${id}`);
  };

  const searchSubmit = (search: string) => {
    setCurrentPage(0);
    setSearch(search);
  };

  const searchClear = (search: string) => {
    setCurrentPage(prevPage);
    setSearch("");
    setSelectedDriver(null);
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
        Vehicle_Number: data?.destination?.trip?.vehicle?.vehicleNumber ?? "N/A",
        Trip_Date: data?.destination?.trip?.tripDate
            ? moment.utc(data?.destination?.trip?.tripDate).local().format("MMMM DD, YYYY")
            : "N/A",
        To_Destination: data?.destination?.to ?? "N/A",
        Requisitioner_Purpose: data?.requisitionerPurpose ?? "N/A",
        Start_Time: moment.utc(data.startTime).local().format("HH:mm"),
        End_Time: moment.utc(data?.endTime).local().format("HH:mm") ?? "N/A",
        Stationary_Running_Time: data?.stationaryRunningTime ?? "N/A",
        End_Meter_Reading: data.meterReading,
        Total_Distance: data.totalDistance,
        Driver_Name: data?.destination?.trip?.driver?.name ?? "N/A",
        Approving_Officer: data?.destination?.trip?.approvingOfficer?.name ?? "N/A",
        Remarks: data?.remarks ?? "N/A",
    }
    handleShowData(myData)
  }

  if (
    can(AccessTypes.READ, SettingsModules.ElogBook)
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
            <h2>All {entity}s</h2>
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
               onClick={handleFilterClick}
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
              <Grid container>
                <LocalizationProvider dateAdapter={DateAdapterfns}>
                  <DatePicker
                   label={"Trip Date"}
                   value={tripDate}
                   onChange={handleDateSelect}
                   maxDate={moment.utc().add(1, "days")}
                   renderInput={(params) => (
                    <TextField variant={"filled"} sx={{ m: 1, minWidth: 270 }} {...params} />
                   )}
                  />
                </LocalizationProvider>
                <Box sx={{ m: 1, minWidth: 270 }}>
                  <DriverSelector handleDriverSelect={setSelectedDriver} />
                </Box>
                <Box sx={{ m: 1, minWidth: 270 }}>
                  <VehicleSelector handleSelect={setSelectedVehicle} />
                </Box>
              </Grid>
            </Collapse>
            <br />
            <TableContainer component={Paper}>
              {listStatus === "pending" && <LinearProgress />}
              <Table sx={{ minWidth: 650 }} aria-label="simple table">
                <TableHead>
                  <TableRow>
                      <StyledTableCell align="left">Id</StyledTableCell>
                      <StyledTableCell align="left">Vehicle Number</StyledTableCell>
                      <StyledTableCell align="left">Trip Date</StyledTableCell>
                      <StyledTableCell align="left">Destination</StyledTableCell>
                      <StyledTableCell align="left">Requisitioner Purpose</StyledTableCell>
                      <StyledTableCell align="left">Trips Status</StyledTableCell>
                      <StyledTableCell align="left">Start Time</StyledTableCell>
                      <StyledTableCell align="left">End Time</StyledTableCell>
                      <StyledTableCell align="left">Stationary Time</StyledTableCell>
                      <StyledTableCell align="left">Meter Reading</StyledTableCell>
                      <StyledTableCell align="left">Total Distance (Km/Miles) </StyledTableCell>
                      <StyledTableCell align="left">Driver Name</StyledTableCell>
                      <StyledTableCell align="left">Approving Officer</StyledTableCell>
                    {can(
                      AccessTypes.UPDATE,
                      SettingsModules[entity] ||
                        can(AccessTypes.DELETE, SettingsModules[entity])
                    ) && (
                      <StyledTableCell align="left">Actions</StyledTableCell>
                    )}
                  </TableRow>
                </TableHead>
                <TableBody>
                  {elogBooks &&
                    elogBooks.map((data, key) => (
                        <TableRow
                            key={key}
                            sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                        >
                            <StyledTableCell component="th" scope="row">
                                {data.id}
                            </StyledTableCell>
                            <StyledTableCell component="th" scope="row">
                                {data?.destination?.trip?.vehicle?.vehicleNumber ?? "N/A"}
                            </StyledTableCell>
                            <StyledTableCell component="th" scope="row">
                                {data?.destination?.trip?.tripDate
                                    ? moment
                                        .utc(data?.destination?.trip?.tripDate)

                                        .local()
                                        .format("DD MMM, YYYY")
                                    : "N/A"}
                            </StyledTableCell>
                            <StyledTableCell align="left">
                                {data?.destination?.to ?? "N/A"}
                            </StyledTableCell>
                            <StyledTableCell align="left">
                                {data?.destination?.requisitionerPurpose ?? "N/A"}
                            </StyledTableCell>
                            <StyledTableCell align="left">
                                {data?.destination?.trip?.tripStatus ?? "N/A"}
                            </StyledTableCell>
                            <StyledTableCell component="th" scope="row">
                                {moment.utc(data.startTime).local().format("HH:mm")}
                            </StyledTableCell>
                            <StyledTableCell align="left">
                                {data?.endTime ? moment.utc(data.endTime).local().format("HH:mm") : "N/A"}
                            </StyledTableCell>
                            <StyledTableCell align="left">
                                {data?.stationaryRunningTime ?? "N/A"}
                            </StyledTableCell>
                            <StyledTableCell align="left">{data.meterReading}</StyledTableCell>
                            <StyledTableCell align="left">{data.totalDistance}</StyledTableCell>
                            <StyledTableCell align="left">
                                {data?.destination?.trip?.driver?.name ?? "N/A"}
                            </StyledTableCell>
                            <StyledTableCell align="left">
                                {data?.destination?.trip?.approvingOfficer?.name ?? "N/A"}
                            </StyledTableCell>
                            <StyledTableCell align="left">
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
export default ElogBook;
