import usePermissions from "auth/permissions/hooks/usePermissions";
import {AccessTypes, ReportsModules, SettingsModules} from "auth/permissions/enums";
import { Box } from "@mui/system";
import {
  Button, CircularProgress,
  LinearProgress,
  Paper, Popover,
  Stack,
  Table,
  TableBody,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
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
import {getDriverMileages} from "../DriverMileageSlice";
import SimCardDownloadSharpIcon from "@mui/icons-material/SimCardDownloadSharp";
import CustomDateRangePicker from "../../shared/components/CustomDateRangePicker";
import {useForm} from "react-hook-form";
import toast from "react-hot-toast";
import {postRequest} from "../../../api";
import fileDownload from "js-file-download";
// @ts-ignore
import { parse } from "json2csv";
import DriverExportRangePicker from "./ExportRangePicker";

const entity = "DriverMileage";
interface PreviewProps {
  Id: number
  Driver_Name: string
  Service: string
  Command: string
  Base: string
  Sub_Unit: string
  License_Classes: string
  Roles: string
  Created_At: string
  Updated_At: string
}

interface DateRangeProps {
  startDate: Date
  endDate: Date
}
interface Driver {
  id: number
  name: string
}

const DriverMileage = () => {
  const { can } = usePermissions();
  const navigate = useNavigate();
  const dispatch: AppDispatch = useDispatch();
  const [search, setSearch] = useState("");
  const { limit, prevPage, currentPage, setCurrentPage, handleChangePage } =
    usePagination();

  const currentUser = useSelector(
   (state: RootState) => state.login.authenticatedUser
  );

  const driverMileages = useSelector((state: RootState) => state.driverMileage.driverMileages);
  const count = useSelector((state: RootState) => state.driverMileage.count);
  const listStatus = useSelector((state: RootState) => state.driverMileage.listStatus);
  const [showData, setShowData] = useState(false)
  const [previewDataInfo, setPreviewDataInfo] = useState<PreviewProps | null>(null)

  const formMethods = useForm()
  const { register, handleSubmit, setValue } = formMethods
  const [filter, setFilter] = useState(false)

  const [driver, setDriver] = useState<Driver | null>(null)
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

  const handleDriverSelect = (data: Driver | null) => {
    setDriver(data)
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
      const res = await getExportData()
      if (res.code === 1) {
        toast.dismiss()
        processData(res.content)
      } else {
        toast.dismiss()
        toast.error(res.message)
      }
    } catch (error: any) {
      toast.dismiss()
      toast.error(error.message ?? `Unable to Export data. Please try again!`)
    }
  }

  const getExportData = async () => {
    const response = await postRequest("/driver-mileage/get-export-data", {
      fromDate: dateRange.startDate,
      toDate: dateRange.endDate,
      driverId: driver?.id,
      verifiedBy: '',
    });

    return response.data;
  }

  const showFilter = () => setFilter(true)

  const hideFilter = () => {
    setFilter(false)
    clearFilter()
  }

  const clearFilter = () => {
    setValue("driver", null)
    setValue("vehicle", null)
  }

  const processData = (csv: any) => {
    toast.success("Data exported successfully!")
    fileDownload(csv, `download-${moment.utc().format("HH:mm:ss")}.csv`)
  }

  useEffect(() => {
    dispatch(setPageTitle("Driver Mileage"));
  }, [dispatch]);

  useEffect(() => {
    dispatch(
    getDriverMileages({
        limit: limit,
        offset: currentPage * limit,
        searchValue: search,
      })
    );
  }, [dispatch, currentPage, search, limit]);

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
      Driver_Name: data?.name ?? "N/A",
      Service: data?.subUnit?.base?.command?.service?.name ?? "N/A",
      Command: data?.subUnit?.base?.command?.name ?? "N/A",
      Base: data?.subUnit?.base?.name ?? "N/A",
      Sub_Unit: data?.subUnit?.name ?? "N/A",
      License_Classes: data.licenseClasses.length
       ? data.licenseClasses.map((e: any) => e.class).join(", ")
       : "N/A",
      Roles: data.roles.map((role: any) => role.name).join(", "),
      Created_At: moment.utc(data.createdAt).local().format("DD MMM, YYYY (HH:mm)"),
      Updated_At: moment.utc(data.updatedAt).local().format("DD MMM, YYYY (HH:mm)"),
    }
    handleShowData(myData)
  }

  if (
    can(AccessTypes.READ, ReportsModules.DriverMileage, 'reports')
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
            <DriverExportRangePicker
             dateRange={dateRange}
             handleDriverSelect={handleDriverSelect}
             handleDateRangeChange={handleDateRangeChange}
             onExportPress={handleExportPress}
            />
          </Popover>
        </Box>

        {listStatus !== "failed" && (
          <Box>
            <h2>All Driver Mileages</h2>
            <SearchInput
              entity={entity}
              submit={searchSubmit}
              clear={searchClear}
            />
            <br />

            <TableContainer component={Paper}>
              {listStatus === "pending" && <LinearProgress />}
              <Table sx={{ minWidth: 650 }} aria-label="simple table">
                <TableHead>
                  <TableRow>
                    <StyledTableCell align="left">Id</StyledTableCell>
                    <StyledTableCell align="left">Driver Number</StyledTableCell>
                    <StyledTableCell align="left">Service</StyledTableCell>
                    <StyledTableCell align="left">Command</StyledTableCell>
                    <StyledTableCell align="left">Base</StyledTableCell>
                    <StyledTableCell align="left">Sub unit</StyledTableCell>
                    <StyledTableCell align="center" width={50}>
                      Actions
                    </StyledTableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {driverMileages &&
                   driverMileages.map((data, key) => (
                    <TableRow key={key} sx={{ "&:last-child td, &:last-child th": { border: 0 } }}>
                      <StyledTableCell component="th" scope="row">
                        {data.id}
                      </StyledTableCell>
                      <StyledTableCell component="th" scope="row">
                        {data?.name ?? "N/A"}
                      </StyledTableCell>
                      <StyledTableCell component="th" scope="row">
                        {data?.subUnit?.base?.command?.service?.name ?? "N/A"}
                      </StyledTableCell>
                      <StyledTableCell component="th" scope="row">
                        {data?.subUnit?.base?.command?.name ?? "N/A"}
                      </StyledTableCell>
                      <StyledTableCell component="th" scope="row">
                        {data?.subUnit?.base?.name ?? "N/A"}
                      </StyledTableCell>
                      <StyledTableCell component="th" scope="row">
                        {data?.subUnit?.name ?? "N/A"}
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
export default DriverMileage;
