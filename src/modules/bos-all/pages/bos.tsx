import usePermissions from "auth/permissions/hooks/usePermissions";
import { AccessTypes, SettingsModules } from "auth/permissions/enums";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "store";
import { usePagination } from "core/hooks/usePagination";
import UnauthorizedContent from "core/components/UnauthorizedContent";
import ModeEditIcon from "@mui/icons-material/ModeEdit";
import { Box } from "@mui/system";
import {
  Button,
  IconButton,
  LinearProgress,
  Paper,
  Stack,
  Collapse,
  Table,
  TableBody,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
  TextField,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import { useEffect, useState } from "react";
import ErrorView from "core/components/ShowError";
import SearchInput from "core/components/SearchInput";
import { StyledTableCell } from "core/components/StyledTable";
import NoRecordSearching from "core/components/NoRecordSearching";
import { setPageTitle } from "core/layouts/layoutSlice";
import { deleteBos, getListBos } from "../bosSlice";
import { LocalizationProvider, DatePicker } from "@mui/lab";
import HighlightOffIcon from "@mui/icons-material/HighlightOff";
import FilterAltOutlinedIcon from "@mui/icons-material/FilterAltOutlined";
import CloseIcon from "@mui/icons-material/Close";
import DateAdapterfns from "@mui/lab/AdapterDayjs";
import moment from "moment";
import { useDeleteModal } from "core/hooks/useDeleteModal";
import DeleteConfirmationModal from "core/components/DeleteConfirmation";
import { getDeleteDialogDescription } from "core/constants";
import { isFulfilled } from "@reduxjs/toolkit";

const Bos = () => {
  const { can } = usePermissions();
  const navigate = useNavigate();
  const dispatch: AppDispatch = useDispatch();
  const listStatus =  useSelector(
    (state: RootState) => state.bos.listStatus
  );
  const entity = "BOS/AOS/POL/DI/AHS";
  const [search, setSearch] = useState('');
  const count = useSelector((state: RootState) => state.bos.count);
  const listBosTrip = useSelector((state: RootState) => state.bos.listBosTrip)
  const { limit, prevPage, currentPage, setCurrentPage, handleChangePage } =
    usePagination();

    const deleteStatus = useSelector(
      (state: RootState) => state.bos.deleteStatus
    );
    
  const [filter, setFilter] = useState(false);
  const [tripDate, setTripDate] = useState<Date | null>(null);

  const {
    deleteModal,
    selectedId,
    setSelectedId,
    closeDeleteModal,
    onDeletePress,
  } = useDeleteModal();
  
  const searchSubmit = (search: string): void => {
    setCurrentPage(0);
    setSearch(search);
  };

  const searchClear = (): void => {
    setCurrentPage(prevPage);
    setSearch("");
  };

  const onEdit = (idBos: number): void => {
    navigate(`/e-boc-trip/edit/${idBos}`)
  }

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

  const showFilter = () => setFilter(true);

  const handleFilterClick = () => {
    if (filter) {
      clearFilter();
    } else {
      showFilter();
    }
  };

  useEffect(() => {
    dispatch(setPageTitle("BOS/AOS/POL/DI/AHS"));
  }, [dispatch]);

  const getListBosWithPagination = (limitPage: number, offset: number, searchValue: string, date: Date | null): void => {
    dispatch(
      getListBos({
        limit: limitPage,
        offset,
        searchValue,
        tripDate: date
      })
    );
  }

  const onConfirmDelete = async () => {
    if (selectedId) {
      const action = await dispatch(deleteBos({id: selectedId}));
      if (isFulfilled(action)) {
        setSelectedId(undefined);
        updateTheListAfterModifying();
        closeDeleteModal();
      }
    }
  };

  const updateTheListAfterModifying = () => {
    if (currentPage === 0) {
      getListBosWithPagination(limit, currentPage * limit, search, tripDate)
    }
    setCurrentPage(0);
  };


 const timeDifference = (startDateTime: any, endDateTime: any) => {
  const startTime = new Date(moment.utc(startDateTime).local().format('YYYY/MM/DD HH:mm'));
  const endTime = new Date(moment.utc(endDateTime).local().format('YYYY/MM/DD HH:mm'));
  const minutes = endTime.getTime() < startTime.getTime() ? ((startTime.getTime() - endTime.getTime()) / 60000) : ((endTime.getTime() - startTime.getTime()) / 60000);
  return minutes;
 }
  useEffect(() => {
    getListBosWithPagination(limit, currentPage * limit, search, tripDate)
  }, [dispatch, currentPage, search, limit, tripDate]);

  if (can(AccessTypes.READ, SettingsModules.BOS_AOS_POL_DI_AHS)) {
    return (
      <div>
        {listStatus === "failed" && (
          <ErrorView
            title={`${entity} loading failed`}
            desc={`There has been a problem while getting ${entity} list data from the database. Please contact the administration for further details.`}
          />
        )}

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
                    <StyledTableCell align="left">Requisitioner Purpose</StyledTableCell>
                    <StyledTableCell align="left">Start Time</StyledTableCell>
                    <StyledTableCell align="left">End Time</StyledTableCell>
                    <StyledTableCell align="left">Stationary Time (Minutes)</StyledTableCell>
                    <StyledTableCell align="left">Meter Reading</StyledTableCell>
                    <StyledTableCell align="left">Fuel Type</StyledTableCell>
                    <StyledTableCell align="left">Fuel Received</StyledTableCell>
                    <StyledTableCell align="left">Driver Name</StyledTableCell>
                    {can(AccessTypes.UPDATE, SettingsModules.BOS_AOS_POL_DI_AHS) && (
                      <StyledTableCell align="left">Actions</StyledTableCell>
                    )}
                  </TableRow>
                </TableHead>
                <TableBody>
                  {listBosTrip &&
                    listBosTrip.map((record, key) => (
                      <TableRow
                        key={key}
                        sx={{
                          "&:last-child td, &:last-child th": { border: 0 },
                        }}
                      >
                        <StyledTableCell component="th" scope="row">
                          {record.id}
                        </StyledTableCell>
                        <StyledTableCell component="th" scope="row">
                          {record?.vehicle?.vehicleNumber ?? "N/A"}
                        </StyledTableCell>
                        <StyledTableCell component="th" scope="row">
                          {record?.tripDate
                            ? moment(record?.tripDate).utc().format("DD MMM, YYYY")
                            : "N/A"}
                        </StyledTableCell>
                        <StyledTableCell component="th" scope="row">
                          {(record?.requisitionerPurpose as string) ?? "N/A"}
                        </StyledTableCell>
                        <StyledTableCell component="th" scope="row">
                          {record?.eLog?.startTime
                            ? moment.utc(record.eLog.startTime).local().format("HH:mm")
                            : "N/A"}
                        </StyledTableCell>
                        <StyledTableCell align="left">
                          {record?.eLog?.endTime
                            ? moment.utc(record.eLog.endTime).local().format("HH:mm")
                            : "N/A"}
                        </StyledTableCell>
                        <StyledTableCell component="th" scope="row">
                          {record?.eLog?.startTime && record?.eLog?.endTime ? timeDifference(record.eLog.startTime, record.eLog.endTime) : "N/A"}
                        </StyledTableCell>
                        <StyledTableCell component="th" scope="row">
                          {record?.eLog?.meterReading ?? "N/A"}
                        </StyledTableCell>
                        <StyledTableCell component="th" scope="row">
                          {(record?.eLog?.fuelType as string) ?? "N/A"}
                        </StyledTableCell>
                        <StyledTableCell component="th" scope="row">
                          {record?.eLog?.fuelReceived ?? "N/A"}
                        </StyledTableCell>
                        <StyledTableCell component="th" scope="row">
                          {record?.driver?.name ?? "N/A"}
                        </StyledTableCell>
                        <StyledTableCell align="left">
                          <Stack direction="row">
                            {record?.eLog?.endTime && can(
                              AccessTypes.UPDATE,
                              SettingsModules.BOS_AOS_POL_DI_AHS
                            ) && (
                              <IconButton
                                sx={{ mr: 1 }}
                                aria-label="edit"
                                onClick={() => onEdit(record.id)}
                              >
                                <ModeEditIcon />
                              </IconButton>
                            )}
                            
                            {can(AccessTypes.DELETE, SettingsModules.BOS_AOS_POL_DI_AHS) && (
                              <IconButton
                                color={"error"}
                                onClick={() => onDeletePress(record.id)}
                                aria-label="delete"
                              >
                                <DeleteIcon />
                              </IconButton>
                            )}
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
            <DeleteConfirmationModal
                open={deleteModal}
                title={`Delete ${entity}`}
                desc={getDeleteDialogDescription(entity)}
                loading={deleteStatus === "pending"}
                handleClose={closeDeleteModal}
                handleConfirm={onConfirmDelete}
            />
          </Box>
        )}
      </div>
    )
  }
  return <UnauthorizedContent />;
}
export default Bos;