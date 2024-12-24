import usePermissions from "auth/permissions/hooks/usePermissions";
import { AccessTypes, SettingsModules } from "auth/permissions/enums";
import { Box } from "@mui/system";
import {
  Button,
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
import { isFulfilled } from "@reduxjs/toolkit";
import { deleteBaseAdmin, getBaseAdmins } from "../baseAdminSlice";
import NoRecordSearching from "core/components/NoRecordSearching";

const entity = "Base Admin";
const entityKey = "BaseAdmin";

const BaseAdmins = () => {
  const { can } = usePermissions();
  const navigate = useNavigate();
  const dispatch: AppDispatch = useDispatch();
  const currentUser = useSelector(
    (state: RootState) => state.login.authenticatedUser
  );
  const [search, setSearch] = useState("");
  const { limit, prevPage, currentPage, setCurrentPage, handleChangePage } =
    usePagination();

  const list = useSelector((state: RootState) => state.baseAdmin.list);
  const count = useSelector((state: RootState) => state.baseAdmin.count);
  const listStatus = useSelector(
    (state: RootState) => state.baseAdmin.listStatus
  );

  useEffect(() => {
    dispatch(setPageTitle("Base Admins"));
  }, [dispatch]);

  useEffect(() => {
    dispatch(
      getBaseAdmins({
        limit: limit,
        offset: currentPage * limit,
        searchValue: search,
      })
    );
  }, [dispatch, currentPage, search, limit]);

  const onEdit = (id: number) => {
    navigate(`/base-admins/edit/${id}`);
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
    (state: RootState) => state.baseAdmin.deleteStatus
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
      const action = await dispatch(deleteBaseAdmin(selectedId));
      if (isFulfilled(action)) {
        setSelectedId(undefined);
        updateTheListAfterModifying();
        closeDeleteModal();
      }
    }
  };

  const updateTheListAfterModifying = () => {
    if (currentPage === 0) {
      dispatch(getBaseAdmins({ limit, offset: 0, searchValue: search }));
    }
    setCurrentPage(0);
  };

  if (
    can(AccessTypes.READ, SettingsModules.Base) ||
    can(AccessTypes.READ, SettingsModules.BaseAdmin)
  )
    return (
      <div>
        <Box style={{ display: "flex", justifyContent: "end" }}>
          {can(AccessTypes.READ, SettingsModules.Base) && (
            <Button
              variant={"outlined"}
              style={{ alignSelf: "end", marginRight: 10 }}
              onClick={() => navigate("/bases")}
              disableElevation
            >
              {"Show Bases"}
            </Button>
          )}
          {can(AccessTypes.CREATE, SettingsModules.BaseAdmin) && (
            <Button
              variant={"contained"}
              style={{ alignSelf: "end" }}
              startIcon={<AddIcon />}
              onClick={() => navigate("/base-admins/add")}
              disableElevation
            >
              {"Add Base Admin"}
            </Button>
          )}
        </Box>
        {listStatus === "failed" && (
          <ErrorView
            title={`${entity}s loading failed`}
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

            <TableContainer component={Paper}>
              {listStatus === "pending" && <LinearProgress />}
              <Table sx={{ minWidth: 650 }} aria-label="simple table">
                <TableHead>
                  <TableRow>
                    <StyledTableCell align="left">Id</StyledTableCell>
                    <StyledTableCell align="left">Email</StyledTableCell>
                    <StyledTableCell align="left">{"Base"}</StyledTableCell>
                    {(can(AccessTypes.UPDATE, SettingsModules[entityKey]) ||
                      can(AccessTypes.DELETE, SettingsModules[entityKey])) && (
                      <StyledTableCell align="left">Actions</StyledTableCell>
                    )}
                  </TableRow>
                </TableHead>
                <TableBody>
                  {list?.map((record, key) => (
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
                        {record.email ?? "N/A"}
                      </StyledTableCell>
                      <StyledTableCell align="left">
                        {record?.base?.name ?? "N/A"}
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
              desc={`Are you sure you want to delete this ${entity}? This will delete all the data that is linked with this ${entity}. This action is irreversible!`}
              loading={deleteStatus === "pending"}
              handleClose={closeDeleteModal}
              handleConfirm={onConfirmDelete}
            />
          </Box>
        )}
      </div>
    );
  return <UnauthorizedContent />;
};
export default BaseAdmins;
