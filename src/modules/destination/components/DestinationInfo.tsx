import usePermissions from "auth/permissions/hooks/usePermissions";
import { Box } from "@mui/system";
import {
  Button,
  Collapse,
  IconButton,
  LinearProgress,
  Paper,
  Stack,
  Table,
  TableBody,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
  TextField,
} from "@mui/material";
import ModeEditIcon from "@mui/icons-material/ModeEdit";
import CloseIcon from "@mui/icons-material/Close";
import FilterAltOutlinedIcon from "@mui/icons-material/FilterAltOutlined";
import { useNavigate } from "react-router-dom";
import { AppDispatch, RootState } from "store";
import { usePagination } from "core/hooks/usePagination";
import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import SearchInput from "core/components/SearchInput";
import { StyledTableCell } from "core/components/StyledTable";
import ErrorView from "core/components/ShowError";
import NoRecordSearching from "core/components/NoRecordSearching";
import DateAdapterfns from "@mui/lab/AdapterDayjs";
import HighlightOffIcon from "@mui/icons-material/HighlightOff";
import { getFailSearchDescription } from "core/constants";
import { getDestinations } from "../destinationSlice";
import { LocalizationProvider, DatePicker } from "@mui/lab";
import moment from "moment";

const entity = "Destination";

const DestinationInfo = () => {
  const { can } = usePermissions();
  const navigate = useNavigate();
  const dispatch: AppDispatch = useDispatch();
  const [search, setSearch] = useState("");
  const { limit, prevPage, currentPage, setCurrentPage, handleChangePage } =
    usePagination();

  const list = useSelector((state: RootState) => state.destination.list);
  const count = useSelector((state: RootState) => state.destination.count);
  const listStatus = useSelector(
    (state: RootState) => state.destination.listStatus
  );

  const [filter, setFilter] = useState(false);
  const [tripDate, setTripDate] = useState<Date | null>(null);

  useEffect(() => {
    dispatch(
      getDestinations({
        limit: limit,
        offset: currentPage * limit,
        searchValue: search,
        tripDate,
      })
    );
  }, [dispatch, currentPage, search, limit, tripDate]);

  const onEdit = (id: number) => {
    navigate(`/destinations/edit/${id}`);
  };

  const searchSubmit = (search: string) => {
    setCurrentPage(0);
    setSearch(search);
  };

  const searchClear = () => {
    setCurrentPage(prevPage);
    setSearch("");
  };

  const hideFilter = () => {
    setFilter(false);
    clearFilter();
  };

  const clearFilter = () => {
    setTripDate(null);
  };

  const handleDateSelect = (param: any) => {
    if (param != null) {
      const date = new Date(param);
      if (!isNaN(date.getTime())) {
        setTripDate(date);
      }
    }
  };

  const handleFilterClick = () => {
    if (filter) {
      clearFilter();
    } else {
      showFilter();
    }
  };

  const showFilter = () => setFilter(true);

  if (listStatus === "failed") {
    return (
      <ErrorView
        title={`${entity}s loading failed`}
        desc={getFailSearchDescription(entity)}
      />
    );
  }

  return (
    <Box>
      <h2>{`All ${entity}s`}</h2>
      <SearchInput entity={entity} submit={searchSubmit} clear={searchClear} />
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
        <LocalizationProvider dateAdapter={DateAdapterfns}>
          <DatePicker
            label={"Trip Date"}
            value={tripDate}
            onChange={handleDateSelect}
            maxDate={moment.utc().add(1, "days")}
            renderInput={(params) => <TextField {...params} />}
          />
        </LocalizationProvider>
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
              <StyledTableCell align="left">
                Requisitioner Purpose
              </StyledTableCell>
              <StyledTableCell align="left">Trips Status</StyledTableCell>
              <StyledTableCell align="left">Start Time</StyledTableCell>
              <StyledTableCell align="left">End Time</StyledTableCell>
              <StyledTableCell align="left">Stationary Time</StyledTableCell>
              <StyledTableCell align="left">Meter Reading</StyledTableCell>
              <StyledTableCell align="left">
                Total Distance (Km/Miles){" "}
              </StyledTableCell>
              <StyledTableCell align="left">Driver Name</StyledTableCell>
              <StyledTableCell align="left">Approving Officer</StyledTableCell>
              <StyledTableCell align="center" width={50}>
                Actions
              </StyledTableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {list &&
              list.map((data, key) => (
                <TableRow
                  key={key}
                  sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                >
                  <StyledTableCell component="th" scope="row">
                    {data.id}
                  </StyledTableCell>
                  <StyledTableCell component="th" scope="row">
                    {data?.trip?.vehicle?.vehicleNumber ?? "N/A"}
                  </StyledTableCell>
                  <StyledTableCell component="th" scope="row">
                    {data?.trip?.tripDate
                      ? moment(data?.trip?.tripDate)
                          .utc()
                          .format("DD MMM, YYYY")
                      : "N/A"}
                  </StyledTableCell>
                  <StyledTableCell align="left">
                    {data?.to ?? "N/A"}
                  </StyledTableCell>
                  <StyledTableCell align="left">
                    {data?.requisitionerPurpose ?? "N/A"}
                  </StyledTableCell>
                  <StyledTableCell align="left">
                    {data?.trip?.tripStatus ?? "N/A"}
                  </StyledTableCell>
                  <StyledTableCell component="th" scope="row">
                    {data?.eLog?.startTime
                      ? moment.utc(data.eLog.startTime).local().format("HH:mm")
                      : "N/A"}
                  </StyledTableCell>
                  <StyledTableCell align="left">
                    {data?.eLog?.endTime
                      ? moment.utc(data.eLog.endTime).local().format("HH:mm")
                      : "N/A"}
                  </StyledTableCell>
                  <StyledTableCell align="left">
                    {data?.eLog?.stationaryRunningTime ?? "N/A"}
                  </StyledTableCell>
                  <StyledTableCell align="left">
                    {data?.eLog?.meterReading ?? "N/A"}
                  </StyledTableCell>
                  <StyledTableCell align="left">
                    {data?.eLog?.totalDistance ?? "N/A"}
                  </StyledTableCell>
                  <StyledTableCell align="left">
                    {data?.trip?.driver?.name ?? "N/A"}
                  </StyledTableCell>
                  <StyledTableCell align="left">
                    {data?.trip?.approvingOfficer?.name ?? "N/A"}
                  </StyledTableCell>
                  <StyledTableCell align="left">
                    {data?.eLog?.endTime && (
                      <Stack direction="row">
                        <IconButton
                          sx={{ mr: 1 }}
                          aria-label="edit"
                          onClick={() => onEdit(data.id)}
                        >
                          <ModeEditIcon />
                        </IconButton>
                      </Stack>
                    )}
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
    </Box>
  );
};

export default DestinationInfo;
