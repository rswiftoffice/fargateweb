import usePermissions from "auth/permissions/hooks/usePermissions";
import {AccessTypes, ReportsModules, SettingsModules} from "auth/permissions/enums";
import { Box } from "@mui/system";
import {
  Button, CircularProgress, Collapse, FormControl, Grid, IconButton, InputLabel,
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
import {getMtracForms} from "../MtracFormSlice";
import SimCardDownloadSharpIcon from "@mui/icons-material/SimCardDownloadSharp";
import CustomDateRangePicker from "../../shared/components/CustomDateRangePicker";
import HighlightOffIcon from "@mui/icons-material/HighlightOff";
import FilterAltOutlinedIcon from "@mui/icons-material/FilterAltOutlined";
import CloseIcon from "@mui/icons-material/Close";
import {DatePicker, LocalizationProvider} from "@mui/lab";
import DateAdapterfns from "@mui/lab/AdapterDayjs";
import DriverSelector from "../../shared/selectors/DriverSelector";
import VehicleSelector from "../../shared/selectors/VehicleSelector";
import {useForm} from "react-hook-form";
import toast from "react-hot-toast";
import {postRequest} from "../../../api";
import fileDownload from "js-file-download";
// @ts-ignore
import { parse } from "json2csv";
import {DateRangePicker} from "@matharumanpreet00/react-daterange-picker";


export enum MTRACFormStatus {
  Review = "Review",
  Approved = "Approved",
  Deny = "Deny",
}

const entity = "MTRACForm";
interface PreviewProps {
  Id: number
  Over_All_Risk: string
  Despatch_Date: string
  Despatch_Time: string
  Release_Date: string
  Release_Time: string
  Status?: string
  Filled_By: string
  Personal_Pin: string
  Rank_And_Name: string
  Trip_Date: string
  AVI_Date: string
  Approving_Officer: string
  Driver: string
  Vehicle_Number: string
  Sub_Unit: string
  Base: string
  Command: string
  Service: string
  Driver_Risk_Assessment_Checklist: string | string[]
  Other_Risk_Assessment_Checklist?: string | string[]
  Quizzes: string | Quizzes[]
  Safety_Measures: string
  Created_At: string
  Updated_At?: string
}

interface Quizzes {
  question: string
  answer: string
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

const MtracForm = () => {
  const { can } = usePermissions();
  const navigate = useNavigate();
  const dispatch: AppDispatch = useDispatch();
  const [search, setSearch] = useState("");
  const { limit, prevPage, currentPage, setCurrentPage, handleChangePage } =
    usePagination();

  const currentUser = useSelector(
   (state: RootState) => state.login.authenticatedUser
  );
  const [tripDateRange, setTripDateRange] = useState<DateRangeProps | null>(null)
  const [openTripDateRange, setOpenTripDateRange] = useState(false)
  const toggleTripDateRangeOpen = () => setOpenTripDateRange(!openTripDateRange)

  const handleTripDateRangeSelect = (range: DateRangeProps) => {
    setTripDateRange(range)
    toggleTripDateRangeOpen()
  }

  const mtracForms = useSelector((state: RootState) => state.mtracForm.mtracForms);
  const count = useSelector((state: RootState) => state.mtracForm.count);
  const listStatus = useSelector((state: RootState) => state.mtracForm.listStatus);
  const [showData, setShowData] = useState(false)
  const [previewDataInfo, setPreviewDataInfo] = useState<PreviewProps | null>(null)

  const formMethods = useForm()
  const { register, handleSubmit, setValue } = formMethods
  const [filter, setFilter] = useState(false)
  const [despatchDate, setDespatchDate] = useState<Date | null>(null)
  const [releaseDate, setReleaseDate] = useState<Date | null>(null)
  const [selectedDriver, setSelectedDriver] = useState<Driver | null>(null)
  const [selectedVehicle, setSelectedVehicle] = useState<Vehicle | null>(null)
  const [approvalStatus, setApprovalStatus] = useState<MTRACFormStatus | string>("All")

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
        Over_All_Risk: data?.overAllRisk ?? "N/A",
        Despatch_Date: data?.dispatchDate
         ? moment.utc(data?.dispatchDate).local().format("DD MMM, YYYY") + "\t"
         : "N/A",
        Despatch_Time: data?.dispatchTime
         ? moment.utc(data?.dispatchTime).local().format("HH:mm")
         : "N/A",
        Release_Date: data?.releaseDate
         ? moment.utc(data?.releaseDate).local().format("DD MMM, YYYY") + "\t"
         : "N/A",
        Release_Time: data?.releaseTime
         ? moment.utc(data?.releaseTime).local().format("HH:mm")
         : "N/A",
        // Status: data.status as string,
        Filled_By: (data?.filledBy as string) ?? "N/A",
        Personal_Pin: data?.personalPin ?? "N/A",
        Rank_And_Name: data?.rankAndName ?? "N/A",
        Trip_Date: moment.utc(data.trip.tripDate).local().format("DD MMM, YYYY") + "\t",
        AVI_Date: data.trip?.aviDate
         ? moment.utc(data.trip.aviDate).local().format("DD MMM, YYYY") + "\t"
         : "N/a",
        Quizzes:
         data?.quizzes.length > 0
          ? data.quizzes.map((e: any, i: number) => `Q-${i + 1}:${e.question} (A-${i + 1}:${e.answer})`).join()
          : "N/A",
        Approving_Officer: data.trip?.approvingOfficer?.name ?? "N/A",
        Driver: data.trip?.driver?.name ?? "N/A",
        Vehicle_Number: data.trip?.vehicle?.vehicleNumber ?? "N/A",
        Driver_Risk_Assessment_Checklist:
         data?.driverRiskAssessmentChecklist.length > 0
          ? data.driverRiskAssessmentChecklist.map((e: any) => `${e}`).join()
          : "N/A",
        Sub_Unit: data.trip.vehicle.subUnit.name,
        Base: data.trip.vehicle.subUnit.base.name,
        Command: data.trip.vehicle.subUnit.base.command.name,
        Service: data.trip.vehicle.subUnit.base.command.service.name,
        Safety_Measures: (data?.safetyMeasures as string) ?? "N/A",
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
    const response = await postRequest("/mtrac-form/get-export-data", {
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
    setDespatchDate(null)
    setReleaseDate(null)
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

  const handleDespatchDateSelect = (param: any) => {
    console.log({ param })
    if (param !== null) {
      const date = new Date(param)
      if (!isNaN(date.getTime())) {
        setDespatchDate(date)
      }
    } else {
      setDespatchDate(null)
    }
  }
  const handleReleaseDateSelect = (param: any) => {
    if (param !== null) {
      const date = new Date(param)
      if (!isNaN(date.getTime())) {
        setReleaseDate(date)
      }
    } else {
      setReleaseDate(null)
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
    dispatch(setPageTitle("All Mtrac Forms"));
  }, [dispatch]);

  useEffect(() => {
    dispatch(
    getMtracForms({
        limit: limit,
        offset: currentPage * limit,
        searchValue: search,
        approvalStatus: approvalStatus,
        despatchDate: despatchDate,
        releaseDate: releaseDate,
        driverName: selectedDriver?.name,
        vehicleNumber: selectedVehicle?.vehicleNumber,
        tripDateRange: tripDateRange,
      })
    );
  }, [dispatch, currentPage, search, limit, approvalStatus, despatchDate, releaseDate, selectedDriver, selectedVehicle, tripDateRange]);

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
      Over_All_Risk: data?.overAllRisk ?? "N/A",
      Despatch_Date: data?.dispatchDate
       ? moment.utc(data?.dispatchDate).local().format("DD MMM, YYYY")
       : "N/A",
      Despatch_Time: data?.dispatchTime
       ? moment.utc(data?.dispatchTime).local().format("HH:mm")
       : "N/A",
      Release_Date: data?.releaseDate
       ? moment.utc(data?.releaseDate).local().format("DD MMM, YYYY")
       : "N/A",
      Release_Time: data?.releaseTime
       ? moment.utc(data?.releaseTime).local().format("HH:mm")
       : "N/A",
      // Status: data.status as string,
      Filled_By: (data?.filledBy as string) ?? "N/A",
      Personal_Pin: data?.personalPin ?? "N/A",
      Rank_And_Name: data?.rankAndName ?? "N/A",
      Trip_Date: moment.utc(data.trip.tripDate).local().format("DD MMM, YYYY"),
      AVI_Date: data.trip?.aviDate
       ? moment.utc(data.trip.aviDate).local().format("DD MMM, YYYY")
       : "N/a",
      Quizzes: data.quizzes,
      Approving_Officer: data.trip?.approvingOfficer?.name ?? "N/A",
      Driver: data.trip?.driver?.name ?? "N/A",
      Vehicle_Number: data.trip?.vehicle?.vehicleNumber ?? "N/A",
      Driver_Risk_Assessment_Checklist: data.driverRiskAssessmentChecklist,
      Other_Risk_Assessment_Checklist: data.otherRiskAssessmentChecklist,
      Sub_Unit: data.trip.vehicle.subUnit.name,
      Base: data.trip.vehicle.subUnit.base.name,
      Command: data.trip.vehicle.subUnit.base.command.name,
      Service: data.trip.vehicle.subUnit.base.command.service.name,
      Safety_Measures: data.safetyMeasures,
      Created_At: moment.utc(data.createdAt).local().format("DD MMM, YYYY (HH:mm)"),
    };
    handleShowData(myData)
  }

  if (
    can(AccessTypes.READ, ReportsModules.MTRACForm, 'reports')
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
            <h2>All MTRAC Forms</h2>
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
                <FormControl variant="filled" sx={{ m: 1, minWidth: 250 }}>
                  <InputLabel id="demo-simple-select-standard-label">Approval Status</InputLabel>
                  <Select
                   value={approvalStatus}
                   onChange={(event) =>
                    setApprovalStatus((event?.target?.value as MTRACFormStatus) ?? undefined)
                   }
                   label={"Maintenance Type"}
                  >
                    <MenuItem value={"All"}>{"All"}</MenuItem>
                    {Object.values(MTRACFormStatus).map((value, key) => (
                     <MenuItem key={key} value={value}>
                       {value}
                     </MenuItem>
                    ))}
                  </Select>
                </FormControl>
                <LocalizationProvider dateAdapter={DateAdapterfns}>
                  <DatePicker
                   label={"Despatch Date"}
                   value={despatchDate}
                   onChange={handleDespatchDateSelect}
                   maxDate={moment.utc().add(1, "days")}
                   renderInput={(params) => (
                    <TextField variant={"filled"} sx={{ m: 1, minWidth: 270 }} {...params} />
                   )}
                  />
                </LocalizationProvider>
                <LocalizationProvider dateAdapter={DateAdapterfns}>
                  <DatePicker
                   label={"Release Date"}
                   value={releaseDate}
                   onChange={handleReleaseDateSelect}
                   maxDate={moment()}
                   renderInput={(params) => (
                    <TextField sx={{ m: 1, minWidth: 250 }} variant={"filled"} {...params} />
                   )}
                  />
                </LocalizationProvider>

                <Box sx={{ m: 1, minWidth: 270 }}>
                  <DriverSelector handleDriverSelect={setSelectedDriver} />
                </Box>
                <Box sx={{ m: 1, minWidth: 270 }}>
                  <VehicleSelector handleSelect={setSelectedVehicle} />
                </Box>
                <Box sx={{ m: 1, minWidth: 250, height: 55 }}>
                  <Button
                   style={{
                     height: "100%",
                     fontSize: 14,
                     width: "100%",
                     backgroundColor: "#eee",
                     borderBottom: "2px solid #555",
                     borderBottomRightRadius: 0,
                     borderBottomLeftRadius: 0,
                   }}
                   variant={"text"}
                   onClick={toggleTripDateRangeOpen}
                  >
                    {tripDateRange
                     ? `${moment(tripDateRange.startDate).format("DD MMM, YYYY")} ➤ ${moment(
                      tripDateRange.endDate
                     ).format("DD MMM, YYYY")}`
                     : "Select Trip Date Range"}
                  </Button>
                  <div style={{ position: "absolute", zIndex: 1000 }}>
                    <DateRangePicker
                     open={openTripDateRange}
                     maxDate={new Date()}
                     // @ts-ignore
                     onChange={handleTripDateRangeSelect}
                    />
                  </div>
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
                    <StyledTableCell align="left">Date</StyledTableCell>
                    <StyledTableCell align="left">Driver</StyledTableCell>
                    <StyledTableCell align="left">Approval Status</StyledTableCell>
                    <StyledTableCell align="center" width={50}>
                      Actions
                    </StyledTableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {mtracForms &&
                    mtracForms.map((data, key) => (
                     <TableRow key={key} sx={{ "&:last-child td, &:last-child th": { border: 0 } }}>
                       <StyledTableCell component="th" scope="row">
                         {data.id}
                       </StyledTableCell>
                       <StyledTableCell component="th" scope="row">
                         {data?.trip?.vehicle?.vehicleNumber ?? "N/A"}
                       </StyledTableCell>
                       <StyledTableCell align="left">
                         {data?.createdAt
                          ? moment.utc(data.createdAt).local().format("DD MMM, YYYY")
                          : "N/A"}
                       </StyledTableCell>
                       <StyledTableCell align="left">
                         {data?.trip?.driver?.name ?? "N/A"}
                       </StyledTableCell>
                       <StyledTableCell align="left">{data?.status}</StyledTableCell>
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
export default MtracForm;
