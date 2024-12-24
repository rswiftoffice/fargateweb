import React, { useEffect, useState } from "react";
import DeleteIcon from "@mui/icons-material/Delete";
import ModeEditIcon from "@mui/icons-material/ModeEdit";
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
  Typography,
} from "@mui/material";
import { Box } from "@mui/system";
import usePermissions from "../../../auth/permissions/hooks/usePermissions";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../../store";
import { AccessTypes, SettingsModules } from "../../../auth/permissions/enums";
import { deleteCommandAdmin, fetchCommandAdmins } from "../commandAdminSlice";
import ErrorView from "../../../core/components/ShowError";
import { setPageTitle } from "../../../core/layouts/layoutSlice";
import DeleteConfirmationModal from "../../../core/components/DeleteConfirmation";
import SearchInput from "../../../core/components/SearchInput";
import { usePagination } from "../../../core/hooks/usePagination";
import { useDeleteModal } from "../../../core/hooks/useDeleteModal";
import { StyledTableCell } from "../../../core/components/StyledTable";
import { useNavigate } from "react-router-dom";
import { isFulfilled } from "@reduxjs/toolkit";
import NoRecordSearching from "core/components/NoRecordSearching";

const entity = "Command Admin";
const entityKey = "CommandAdmin";

const CommandAdminInfo = () => {
  const { can } = usePermissions();
  const dispatch: AppDispatch = useDispatch();
  const navigate = useNavigate();
  const currentUser = useSelector(
    (state: RootState) => state.login.authenticatedUser
  );
  const [search, setSearch] = useState("");

  const onEdit = (id: number) => {
    if (!id) return;
    navigate("/command-admins/edit/" + id);
  };

  const { limit, prevPage, currentPage, setCurrentPage, handleChangePage } =
    usePagination();

  const listStatus = useSelector(
    (state: RootState) => state.commandAdmin.listStatus
  );
  const count = useSelector((state: RootState) => state.commandAdmin.count);
  const commandAdmins = useSelector(
    (state: RootState) => state.commandAdmin.commandAdmins
  );

  useEffect(() => {
    dispatch(setPageTitle("Command Admins"));
  }, [dispatch]);

  useEffect(() => {
    dispatch(
      fetchCommandAdmins({
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

  const {
    deleteModal,
    selectedId,
    setSelectedId,
    closeDeleteModal,
    onDeletePress,
  } = useDeleteModal();

  const deleteLoading = useSelector(
    (state: RootState) => state.commandAdmin.deleteStatus === "pending"
  );

  const onConfirmDelete = async () => {
    if (selectedId) {
      const action = await dispatch(deleteCommandAdmin(selectedId));
      if (isFulfilled(action)) {
        setSelectedId(undefined);
        if (currentPage === 0) {
          dispatch(fetchCommandAdmins({ limit: limit, offset: 0 }));
        }
        setCurrentPage(0);
        closeDeleteModal();
      }
    }
  };

  if (listStatus === "failed")
    return (
      <ErrorView
        title={`${entity}s loading failed`}
        desc={`There has been a problem while getting ${entity} list data from the database. Please contact the administration for further details.`}
      />
    );
  else
    return (
      <Box>
        <h2>All {entity}s</h2>
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
                <StyledTableCell align="left">Email</StyledTableCell>
                <StyledTableCell align="left">{"Command"}</StyledTableCell>
                {(can(AccessTypes.UPDATE, SettingsModules[entityKey]) ||
                  can(AccessTypes.DELETE, SettingsModules[entityKey])) && (
                  <StyledTableCell align="left">Actions</StyledTableCell>
                )}
              </TableRow>
            </TableHead>
            <TableBody>
              {commandAdmins &&
                commandAdmins.map((record, key) => (
                  <TableRow
                    key={key}
                    sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                  >
                    <StyledTableCell component="th" scope="row">
                      {record.id}
                    </StyledTableCell>
                    <StyledTableCell component="th" scope="row">
                      {record.email ?? "N/A"}
                    </StyledTableCell>
                    <StyledTableCell align="left">
                      {record?.command?.name ?? "N/A"}
                    </StyledTableCell>
                    <StyledTableCell align="left">
                      <Stack direction="row">
                        {can(
                          AccessTypes.UPDATE,
                          SettingsModules[entityKey]
                        ) && (
                          <IconButton
                            sx={{ mr: 1 }}
                            aria-label="edit"
                            onClick={() => onEdit(record.id)}
                          >
                            <ModeEditIcon />
                          </IconButton>
                        )}

                        {record.id !== currentUser?.id &&
                          can(
                            AccessTypes.DELETE,
                            SettingsModules[entityKey]
                          ) && (
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
          desc={`Are you sure you want to delete this ${entity}? This action is irreversible!`}
          loading={deleteLoading}
          handleClose={closeDeleteModal}
          handleConfirm={onConfirmDelete}
        />
      </Box>
    );
};

export default CommandAdminInfo;
