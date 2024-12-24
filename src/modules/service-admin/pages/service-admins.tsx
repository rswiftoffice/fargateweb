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
  Typography,
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
import { deleteServiceAdmin, getServiceAdmins } from "../serviceAdminSlice";
import { StyledTableCell } from "core/components/StyledTable";
import DeleteConfirmationModal from "core/components/DeleteConfirmation";
import ErrorView from "core/components/ShowError";
import { isFulfilled } from "@reduxjs/toolkit";

const entity = "Service Admin";
const entityKey = "ServiceAdmin";

const ServiceAdmins = () => {
  const { can } = usePermissions();
  const navigate = useNavigate();
  const dispatch: AppDispatch = useDispatch();
  const currentUser = useSelector(
    (state: RootState) => state.login.authenticatedUser
  );
  const [search, setSearch] = useState("");
  const { limit, prevPage, currentPage, setCurrentPage, handleChangePage } =
    usePagination();

  const serviceAdmins = useSelector(
    (state: RootState) => state.serviceAdmin.list
  );
  const count = useSelector((state: RootState) => state.serviceAdmin.count);
  const listStatus = useSelector(
    (state: RootState) => state.serviceAdmin.listStatus
  );

  useEffect(() => {
    dispatch(setPageTitle("Service Admins"));
  }, [dispatch]);

  useEffect(() => {
    dispatch(
      getServiceAdmins({
        limit: limit,
        offset: currentPage * limit,
        searchValue: search,
      })
    );
  }, [dispatch, currentPage, search, limit]);

  const onEdit = (id: number) => {
    navigate(`/service-admins/edit/${id}`);
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
    (state: RootState) => state.serviceAdmin.deleteStatus
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
      const action = await dispatch(deleteServiceAdmin(selectedId));
      if (isFulfilled(action)) {
        setSelectedId(undefined);
        if (currentPage === 0) {
          dispatch(getServiceAdmins({ limit, offset: 0, searchValue: search }));
        }
        setCurrentPage(0);
        closeDeleteModal();
      }
    }
  };

  if (
    can(AccessTypes.READ, SettingsModules.Service) ||
    can(AccessTypes.READ, SettingsModules.ServiceAdmin)
  ) {
    return (
      <div>
        <Box style={{ display: "flex", justifyContent: "end" }}>
          {can(AccessTypes.READ, SettingsModules.Service) && (
            <Button
              variant={"outlined"}
              style={{ alignSelf: "end", marginRight: 10 }}
              onClick={() => {
                navigate("/services");
              }}
              disableElevation
            >
              {"Show Services"}
            </Button>
          )}
          {can(AccessTypes.CREATE, SettingsModules.ServiceAdmin) && (
            <Button
              variant={"contained"}
              style={{ alignSelf: "end" }}
              startIcon={<AddIcon />}
              onClick={() => {
                navigate("/service-admins/add");
              }}
              disableElevation
            >
              {"Add Service Admin"}
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
                    <StyledTableCell align="left">{"Service"}</StyledTableCell>
                    {(can(AccessTypes.UPDATE, SettingsModules[entityKey]) ||
                      can(AccessTypes.DELETE, SettingsModules[entityKey])) && (
                      <StyledTableCell align="left">Actions</StyledTableCell>
                    )}
                  </TableRow>
                </TableHead>
                <TableBody>
                  {serviceAdmins &&
                    serviceAdmins.map((serviceAdmin, key) => (
                      <TableRow
                        key={key}
                        sx={{
                          "&:last-child td, &:last-child th": { border: 0 },
                        }}
                      >
                        <StyledTableCell component="th" scope="row">
                          {serviceAdmin.id}
                        </StyledTableCell>
                        <StyledTableCell component="th" scope="row">
                          {serviceAdmin.email ?? "N/A"}
                        </StyledTableCell>
                        <StyledTableCell align="left">
                          {serviceAdmin?.service?.name ?? "N/A"}
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
                                onClick={() => onEdit(serviceAdmin.id)}
                              >
                                <ModeEditIcon />
                              </IconButton>
                            )}
                            {serviceAdmin.id !== currentUser?.id &&
                              can(
                                AccessTypes.DELETE,
                                SettingsModules[entityKey]
                              ) && (
                                <IconButton
                                  color={"error"}
                                  onClick={() => onDeletePress(serviceAdmin.id)}
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
                <Box justifyContent="center" padding="20px" textAlign="center">
                  {search ? (
                    <Typography variant="body2">
                      No records found with search term <b>{`'${search}'`}</b>.
                      Try searching with another term!
                    </Typography>
                  ) : (
                    <Typography variant="body2">No {entity}s Found</Typography>
                  )}
                </Box>
              )}
            </TableContainer>
            <TablePagination
              component="div"
              rowsPerPageOptions={[10]}
              count={count || 0}
              rowsPerPage={10}
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
        )}
      </div>
    );
  }
  return <UnauthorizedContent />;
};

export default ServiceAdmins;
