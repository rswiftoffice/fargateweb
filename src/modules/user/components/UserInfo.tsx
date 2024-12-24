import { useEffect, useState } from "react";
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
import { AccessTypes, SettingsModules } from "../../../auth/permissions/enums";
import usePermissions from "../../../auth/permissions/hooks/usePermissions";
import DeleteConfirmationModal from "../../../core/components/DeleteConfirmation";
import ErrorView from "../../../core/components/ShowError";
import { Role } from "../type";
import { useDispatch, useSelector } from "react-redux";
import { deleteUser, fetchUsers } from "../userSlice";
import { AppDispatch, RootState } from "../../../store";
import SearchInput from "../../../core/components/SearchInput";
import { usePagination } from "../../../core/hooks/usePagination";
import { useDeleteModal } from "../../../core/hooks/useDeleteModal";
import { StyledTableCell } from "../../../core/components/StyledTable";
import { getRoleName } from "../../../core/utils/getRoleName";
import { useNavigate } from "react-router-dom";
import { isFulfilled } from "@reduxjs/toolkit";

const entity = "User";
const entityKey = "User";

const UserInfo = () => {
  const currentUser = useSelector(
    (state: RootState) => state.login.authenticatedUser
  );
  const { can } = usePermissions();
  const dispatch: AppDispatch = useDispatch();
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const { limit, prevPage, currentPage, setCurrentPage, handleChangePage } =
    usePagination();

  const users = useSelector((state: RootState) => state.user.users);
  const count = useSelector((state: RootState) => state.user.count);
  const listStatus = useSelector((state: RootState) => state.user.listStatus);

  useEffect(() => {
    dispatch(
      fetchUsers({
        limit: limit,
        offset: currentPage * limit,
        searchValue: search,
      })
    );
  }, [dispatch, currentPage, search, limit]);

  const onEdit = (id: number) => {
    navigate(`/users/edit/${id}`);
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
    (state: RootState) => state.user.deleteStatus
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
      const action = await dispatch(deleteUser(selectedId));
      if (isFulfilled(action)) {
        setSelectedId(undefined);
        if (currentPage === 0) {
          dispatch(fetchUsers({ limit, offset: 0, searchValue: search }));
        }
        setCurrentPage(0);
        closeDeleteModal();
      }
    }
  };

  const getRoles = (roles: Role[] | undefined) => {
    if (!roles) return "N/A";
    return roles.map((role) => getRoleName(role.name)).join(", ");
  };

  if (listStatus === "failed")
    return (
      <ErrorView
        title={`${entity} loading failed`}
        desc={`There has been a problem while getting ${entity} list data from the database. Please contact the admins.`}
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
                <StyledTableCell align="left">Name</StyledTableCell>
                <StyledTableCell align="left">Username</StyledTableCell>
                <StyledTableCell align="left">Email</StyledTableCell>
                <StyledTableCell align="left">{"Role(s)"}</StyledTableCell>
                <StyledTableCell align="left">Provider</StyledTableCell>
                {(can(AccessTypes.UPDATE, SettingsModules.User) ||
                  can(AccessTypes.DELETE, SettingsModules.User)) && (
                  <StyledTableCell align="left">Actions</StyledTableCell>
                )}
              </TableRow>
            </TableHead>
            <TableBody>
              {users &&
                users.map((data, key) => (
                  <TableRow
                    key={key}
                    sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                  >
                    <StyledTableCell component="th" scope="row">
                      {data.id}
                    </StyledTableCell>
                    <StyledTableCell component="th" scope="row">
                      {data.name ?? "N/A"}
                    </StyledTableCell>
                    <StyledTableCell align="left">
                      {!!data.username ? data.username : data.email}
                    </StyledTableCell>
                    <StyledTableCell align="left">{data.email}</StyledTableCell>
                    <StyledTableCell align="left">
                      {getRoles(data.roles)}
                    </StyledTableCell>
                    <StyledTableCell align="left">
                      {data.provider}
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
                            onClick={() => onEdit(data.id)}
                          >
                            <ModeEditIcon />
                          </IconButton>
                        )}
                        {data.id !== currentUser?.id &&
                          can(
                            AccessTypes.DELETE,
                            SettingsModules[entityKey]
                          ) && (
                            <IconButton
                              color={"error"}
                              onClick={() => onDeletePress(data.id)}
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
          {users && !users.length && listStatus !== "pending" && (
            <Box justifyContent="center" padding="20px" textAlign="center">
              {search ? (
                <Typography variant="body2">
                  No records found with search term <b>{`'${search}'`}</b>. Try
                  searching with another term!
                </Typography>
              ) : (
                <Typography variant="body2">No {entity}s Found</Typography>
              )}
            </Box>
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
          loading={deleteStatus === "pending"}
          handleClose={closeDeleteModal}
          handleConfirm={onConfirmDelete}
        />
      </Box>
    );
};

export default UserInfo;
