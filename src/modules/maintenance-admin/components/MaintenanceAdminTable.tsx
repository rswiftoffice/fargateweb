import usePermissions from "auth/permissions/hooks/usePermissions";
import { AccessTypes, SettingsModules } from "auth/permissions/enums";
import { Box } from "@mui/system";
import {
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
import ModeEditIcon from "@mui/icons-material/ModeEdit";
import DeleteIcon from "@mui/icons-material/Delete";
import { useNavigate } from "react-router-dom";
import { AppDispatch, RootState } from "store";
import { usePagination } from "core/hooks/usePagination";
import { useDeleteModal } from "core/hooks/useDeleteModal";
import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import SearchInput from "core/components/SearchInput";
import { StyledTableCell } from "core/components/StyledTable";
import DeleteConfirmationModal from "core/components/DeleteConfirmation";
import ErrorView from "core/components/ShowError";
import NoRecordSearching from "core/components/NoRecordSearching";
import { isFulfilled } from "@reduxjs/toolkit";
import {
  getDeleteDialogDescription,
  getFailSearchDescription,
} from "core/constants";
import {
  deleteMaintenanceAdmin,
  getMaintenanceAdmins,
} from "../maintenanceAdminSlice";
const entity = "MaintenanceAdmin";
const entityName = "Maintenance Admin";

const MaintenanceAdminTable = () => {
  const { can } = usePermissions();
  const navigate = useNavigate();
  const dispatch: AppDispatch = useDispatch();
  const [search, setSearch] = useState("");
  const { limit, prevPage, currentPage, setCurrentPage, handleChangePage } =
    usePagination();

  const list = useSelector((state: RootState) => state.maintenanceAdmin.list);
  const count = useSelector((state: RootState) => state.maintenanceAdmin.count);
  const listStatus = useSelector(
    (state: RootState) => state.maintenanceAdmin.listStatus
  );
  const deleteStatus = useSelector(
    (state: RootState) => state.maintenanceAdmin.deleteStatus
  );

  useEffect(() => {
    dispatch(
      getMaintenanceAdmins({
        limit: limit,
        offset: currentPage * limit,
        searchValue: search,
      })
    );
  }, [dispatch, currentPage, search, limit]);

  const onEdit = (id: number) => {
    navigate(`/maintenance-admins/edit/${id}`);
  };

  const searchSubmit = (search: string) => {
    setCurrentPage(0);
    setSearch(search);
  };

  const searchClear = () => {
    setCurrentPage(prevPage);
    setSearch("");
  };

  const {
    deleteModal,
    selectedId,
    setSelectedId,
    closeDeleteModal,
    onDeletePress,
  } = useDeleteModal();

  const onConfirmDelete = async () => {
    if (selectedId) {
      const action = await dispatch(deleteMaintenanceAdmin(selectedId));
      if (isFulfilled(action)) {
        setSelectedId(undefined);
        updateTheListAfterModifying();
        closeDeleteModal();
      }
    }
  };

  const updateTheListAfterModifying = () => {
    if (currentPage === 0) {
      dispatch(getMaintenanceAdmins({ limit, offset: 0, searchValue: search }));
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
      <h2>{`All ${entityName}s`}</h2>
      <SearchInput entity={entity} submit={searchSubmit} clear={searchClear} />
      <br />

      <TableContainer component={Paper}>
        {listStatus === "pending" && <LinearProgress />}
        <Table sx={{ minWidth: 650 }} aria-label="simple table">
          <TableHead>
            <TableRow>
              <StyledTableCell align="left">Id</StyledTableCell>
              <StyledTableCell align="left">Name</StyledTableCell>
              <StyledTableCell align="left">Description</StyledTableCell>
              <StyledTableCell align="left">Email</StyledTableCell>
              <StyledTableCell align="left">Base</StyledTableCell>
              {can(
                AccessTypes.UPDATE,
                SettingsModules[entity] ||
                  can(AccessTypes.DELETE, SettingsModules[entity])
              ) && <StyledTableCell align="left">Actions</StyledTableCell>}
            </TableRow>
          </TableHead>
          <TableBody>
            {list &&
              list.map((record, key) => (
                <TableRow
                  key={key}
                  sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                >
                  <StyledTableCell component="th" scope="row">
                    {record.id}
                  </StyledTableCell>
                  <StyledTableCell component="th" scope="row">
                    {record.name}
                  </StyledTableCell>
                  <StyledTableCell align="left">
                    {record.description}
                  </StyledTableCell>

                  <StyledTableCell align="left">
                    {record.user.email}
                  </StyledTableCell>
                  <StyledTableCell align="left">
                    {record.base.name}
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

export default MaintenanceAdminTable;
