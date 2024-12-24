import { Box } from "@mui/system";
import { Button } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import usePermissions from "../../../auth/permissions/hooks/usePermissions";
import { AccessTypes, SettingsModules } from "../../../auth/permissions/enums";
import UnauthorizedContent from "../../../core/components/UnauthorizedContent";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import DeleteIcon from "@mui/icons-material/Delete";
import ModeEditIcon from "@mui/icons-material/ModeEdit";
import AutorenewIcon from "@mui/icons-material/Autorenew";
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
import DeleteConfirmationModal from "../../../core/components/DeleteConfirmation";
import ErrorView from "../../../core/components/ShowError";
import { useDispatch, useSelector } from "react-redux";
import SearchInput from "../../../core/components/SearchInput";
import { usePagination } from "../../../core/hooks/usePagination";
import { setPageTitle } from "../../../core/layouts/layoutSlice";
import { useDeleteModal } from "../../../core/hooks/useDeleteModal";
import { StyledTableCell } from "../../../core/components/StyledTable";
import { AppDispatch, RootState } from "../../../store";
import { getServices, deleteService, transferService } from "../serviceSlice";
import { TransferServiceProps } from "../type";
import TransferServiceModal from "../components/TransferModal";
import { useTransferModal } from "core/hooks/useTransferModal";
import { isFulfilled } from "@reduxjs/toolkit";

const entity = "Service";

const Services = () => {
  const { can } = usePermissions();
  const navigate = useNavigate();
  const dispatch: AppDispatch = useDispatch();
  const [search, setSearch] = useState("");
  const { limit, prevPage, currentPage, setCurrentPage, handleChangePage } =
    usePagination();

  const services = useSelector((state: RootState) => state.service.list);
  const count = useSelector((state: RootState) => state.service.count);
  const listStatus = useSelector(
    (state: RootState) => state.service.listStatus
  );

  useEffect(() => {
    dispatch(setPageTitle("Services"));
  }, [dispatch]);

  useEffect(() => {
    dispatch(
      getServices({
        limit: limit,
        offset: currentPage * limit,
        searchValue: search,
      })
    );
  }, [dispatch, currentPage, search, limit]);

  const onEdit = (id: number) => {
    navigate(`/services/edit/${id}`);
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
    (state: RootState) => state.service.deleteStatus
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
      const action = await dispatch(deleteService(selectedId))
      if(isFulfilled(action)) {
        updateTheListAfterModifying()
        setSelectedId(undefined);
        closeDeleteModal();
      }
    }
  };

  const transferStatus = useSelector(
    (state: RootState) => state.service.transferStatus
  );

  const {
    transferModal,
    transferData,
    setTransferData,
    closeTransferModal,
    onTransferPress,
  } = useTransferModal();

  const handleTransferConfirm = async (data: TransferServiceProps) => {
    if (data) {
      const action = await dispatch(transferService(data));
      if (isFulfilled(action)) {
        closeTransferModal();
        setTransferData(null);
        updateTheListAfterModifying()
      }
    }
  };

  const updateTheListAfterModifying = () => {
    if (currentPage === 0) {
      dispatch(getServices({ limit, offset: 0, searchValue: search }));
    }
    setCurrentPage(0);
  };

  if (
    can(AccessTypes.READ, SettingsModules.ServiceAdmin) ||
    can(AccessTypes.READ, SettingsModules.Service)
  ) {
    return (
      <div>
        <Box style={{ display: "flex", justifyContent: "end" }}>
          {can(AccessTypes.READ, SettingsModules.ServiceAdmin) && (
            <Button
              variant={"outlined"}
              style={{ alignSelf: "end", marginRight: 10 }}
              onClick={() => navigate("/service-admins")}
              disableElevation
            >
              {"Service Admin"}
            </Button>
          )}
          {can(AccessTypes.CREATE, SettingsModules.Service) && (
            <Button
              variant={"contained"}
              style={{ alignSelf: "end" }}
              startIcon={<AddIcon />}
              onClick={() => {
                navigate("/services/add");
              }}
              disableElevation
            >
              {"Add Service"}
            </Button>
          )}
        </Box>
        {listStatus === "failed" && (
          <ErrorView
            title={`${entity} loading failed`}
            desc={`There has been a problem while getting ${entity} list data from the database. Please contact the admins.`}
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
                    <StyledTableCell align="left">Name</StyledTableCell>
                    <StyledTableCell align="left">Description</StyledTableCell>
                    {(can(AccessTypes.UPDATE, SettingsModules.Service) ||
                      can(AccessTypes.DELETE, SettingsModules.Service)) && (
                      <StyledTableCell align="left">Actions</StyledTableCell>
                    )}
                  </TableRow>
                </TableHead>
                <TableBody>
                  {services &&
                    services.map((service, key) => (
                      <TableRow
                        key={key}
                        sx={{
                          "&:last-child td, &:last-child th": { border: 0 },
                        }}
                      >
                        <StyledTableCell component="th" scope="row">
                          {service.id}
                        </StyledTableCell>
                        <StyledTableCell component="th" scope="row">
                          {service.name ?? "N/A"}
                        </StyledTableCell>
                        <StyledTableCell align="left">
                          {service.description ?? "N/A"}
                        </StyledTableCell>
                        <StyledTableCell align="left">
                          <Stack direction="row">
                            {can(
                              AccessTypes.UPDATE,
                              SettingsModules[entity]
                            ) && (
                              <IconButton
                                sx={{ mr: 1 }}
                                aria-label="edit"
                                onClick={() => onEdit(service.id)}
                              >
                                <ModeEditIcon />
                              </IconButton>
                            )}
                            {can(
                              AccessTypes.DELETE,
                              SettingsModules[entity]
                            ) && (
                              <IconButton
                                color={"error"}
                                onClick={() => onDeletePress(service.id)}
                                aria-label="delete"
                              >
                                <DeleteIcon />
                              </IconButton>
                            )}
                            {can(
                              AccessTypes.DELETE,
                              SettingsModules[entity]
                            ) && (
                              <IconButton
                                color={"error"}
                                onClick={() =>
                                  onTransferPress({
                                    id: service.id,
                                    name: service.name,
                                  })
                                }
                                aria-label="transfer"
                              >
                                <AutorenewIcon />
                              </IconButton>
                            )}
                          </Stack>
                        </StyledTableCell>
                      </TableRow>
                    ))}
                </TableBody>
              </Table>
              {services && !services.length && listStatus !== "pending" && (
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
              desc={`Are you sure you want to delete this ${entity}? This will delete all the data that is linked with this ${entity}. This action is irreversible!`}
              loading={deleteStatus === "pending"}
              handleClose={closeDeleteModal}
              handleConfirm={onConfirmDelete}
            />
            <TransferServiceModal
              data={transferData}
              open={transferModal}
              loading={transferStatus === "pending"}
              handleClose={closeTransferModal}
              handleConfirm={handleTransferConfirm}
            />
          </Box>
        )}
      </div>
    );
  }
  return <UnauthorizedContent />;
};

export default Services;
