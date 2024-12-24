import usePermissions from "auth/permissions/hooks/usePermissions";
import { AccessTypes, SettingsModules } from "auth/permissions/enums";
import { Box } from "@mui/system";
import {
  Button,
  Chip,
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
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import ModeEditIcon from "@mui/icons-material/ModeEdit";
import DeleteIcon from "@mui/icons-material/Delete";
import UnauthorizedContent from "core/components/UnauthorizedContent";
import { useNavigate } from "react-router-dom";
import { AppDispatch, RootState } from "store";
import { usePagination } from "core/hooks/usePagination";
import { useDeleteModal } from "core/hooks/useDeleteModal";
import { setPageTitle } from "core/layouts/layoutSlice";
import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import SearchInput from "core/components/SearchInput";
import { StyledTableCell } from "core/components/StyledTable";
import DeleteConfirmationModal from "core/components/DeleteConfirmation";
import ErrorView from "core/components/ShowError";
import { deleteVehicle, getVehicles } from "../vehicleSlice";
import NoRecordSearching from "core/components/NoRecordSearching";
import { isFulfilled } from "@reduxjs/toolkit";
import {
  getDeleteDialogDescription,
  getFailSearchDescription,
} from "core/constants";

const entity = "Vehicle";

const Vehicles = () => {
  const { can } = usePermissions();
  const navigate = useNavigate();
  const dispatch: AppDispatch = useDispatch();

  useEffect(() => {
    dispatch(setPageTitle("Vehicles"));
  }, [dispatch]);

  if (can(AccessTypes.READ, SettingsModules.Vehicle))
    return (
      <div>
        <Box style={{ display: "flex", justifyContent: "end" }}>
          {can(AccessTypes.CREATE, SettingsModules.Vehicle) && (
            <Button
              variant={"contained"}
              style={{ alignSelf: "end" }}
              startIcon={<AddIcon />}
              onClick={() => navigate("/vehicles/add")}
              disableElevation
            >
              {"Add Vehicle"}
            </Button>
          )}
        </Box>
        <VehicleTable />
      </div>
    );
  return <UnauthorizedContent />;
};

const VehicleTable = () => {
  const { can } = usePermissions();
  const navigate = useNavigate();
  const dispatch: AppDispatch = useDispatch();
  const [search, setSearch] = useState("");
  const { limit, prevPage, currentPage, setCurrentPage, handleChangePage } =
    usePagination();

  const vehicles = useSelector((state: RootState) => state.vehicle.list);
  const count = useSelector((state: RootState) => state.vehicle.count);
  const listStatus = useSelector(
    (state: RootState) => state.vehicle.listStatus
  );

  useEffect(() => {
    dispatch(
      getVehicles({
        limit: limit,
        offset: currentPage * limit,
        searchValue: search,
      })
    );
  }, [dispatch, currentPage, search, limit]);

  const onEdit = (id: number) => {
    navigate(`/vehicles/edit/${id}`);
  };

  const searchSubmit = (search: string) => {
    setCurrentPage(0);
    setSearch(search);
  };

  const searchClear = (search: string) => {
    setCurrentPage(prevPage);
    setSearch("");
  };

  const deleteStatus = useSelector(
    (state: RootState) => state.vehicle.deleteStatus
  );
  const {
    deleteModal,
    selectedId,
    setSelectedId,
    closeDeleteModal,
    onDeletePress,
  } = useDeleteModal();

  const onConfirmDelete = async () => {
    if (selectedId) {
      const action = await dispatch(deleteVehicle(selectedId));
      if (isFulfilled(action)) {
        setSelectedId(undefined);
        updateTheListAfterModifying();
        closeDeleteModal();
      }
    }
  };

  const updateTheListAfterModifying = () => {
    if (currentPage === 0) {
      dispatch(getVehicles({ limit, offset: 0, searchValue: search }));
    }
    setCurrentPage(0);
  };

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
      <h2>All {entity}s</h2>
      <SearchInput entity={entity} submit={searchSubmit} clear={searchClear} />
      <br />
      <TableContainer component={Paper}>
        {listStatus === "pending" && <LinearProgress />}
        <Table sx={{ minWidth: 650 }} aria-label="simple table">
          <TableHead>
            <TableRow>
              <StyledTableCell align="left">Id</StyledTableCell>
              <StyledTableCell align="left">Vehicle Number</StyledTableCell>
              <StyledTableCell align="left">Model</StyledTableCell>
              <StyledTableCell align="left">Serviceable</StyledTableCell>
              <StyledTableCell align="left">Vehicle Type</StyledTableCell>
              <StyledTableCell align="left">Sub Unit</StyledTableCell>
              <StyledTableCell align="left">Vehicle Platform</StyledTableCell>
              <StyledTableCell align="left">Vehicle Status</StyledTableCell>
              {can(
                AccessTypes.UPDATE,
                SettingsModules[entity] ||
                  can(AccessTypes.DELETE, SettingsModules[entity])
              ) && <StyledTableCell align="left">Actions</StyledTableCell>}
            </TableRow>
          </TableHead>
          <TableBody>
            {vehicles &&
              vehicles.map((record, key) => (
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
                    {record.vehicleNumber}
                  </StyledTableCell>
                  <StyledTableCell align="left">{record.model}</StyledTableCell>

                  <StyledTableCell align="left">
                    {record.isServiceable ? "True" : "False"}
                  </StyledTableCell>
                  <StyledTableCell align="left">
                    {record.vehicleType}
                  </StyledTableCell>
                  <StyledTableCell align="left">
                    {record.subUnit.name}
                  </StyledTableCell>
                  <StyledTableCell align="left">
                    {record.platforms.name}
                  </StyledTableCell>
                  <StyledTableCell align="left">
                    <Chip
                      label={
                        record.currentTrip
                          ? `Busy in trip # ${record.currentTrip.id}`
                          : `Available`
                      }
                      color={record.currentTrip ? "warning" : "success"}
                    />
                  </StyledTableCell>
                  <StyledTableCell align="left">
                    <Stack direction="row">
                      {can(AccessTypes.UPDATE, SettingsModules[entity]) && (
                        <IconButton
                          sx={{ mr: 1 }}
                          aria-label="edit"
                          onClick={() => onEdit(record.id)}
                        >
                          <ModeEditIcon />
                        </IconButton>
                      )}
                      {can(AccessTypes.DELETE, SettingsModules[entity]) && (
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
  );
};
export default Vehicles;
