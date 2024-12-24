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
import AutorenewIcon from "@mui/icons-material/Autorenew";
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
import NoRecordSearching from "core/components/NoRecordSearching";
import { deleteSubunit, getSubUnits, transferSubunit } from "../subunitSlice";
import { useTransferModal } from "core/hooks/useTransferModal";
import { TransferSubUnitProps } from "../types";
import TransferSubUnitModal from "../components/TransferModal";

const entity = "SubUnits";
const entityName = "Sub Unit";

const SubUnits = () => {
  const { can } = usePermissions();
  const navigate = useNavigate();
  const dispatch: AppDispatch = useDispatch();
  const [search, setSearch] = useState("");
  const { limit, prevPage, currentPage, setCurrentPage, handleChangePage } =
    usePagination();

  const list = useSelector((state: RootState) => state.subUnit.subUnits);
  const count = useSelector((state: RootState) => state.subUnit.count);
  const listStatus = useSelector(
    (state: RootState) => state.subUnit.listStatus
  );

  useEffect(() => {
    dispatch(setPageTitle("SubUnits"));
  }, [dispatch]);

  useEffect(() => {
    dispatch(
      getSubUnits({
        limit: limit,
        offset: currentPage * limit,
        searchValue: search,
      })
    );
  }, [dispatch, currentPage, search, limit]);

  const onEdit = (id: number) => {
    navigate(`/subunits/edit/${id}`);
  };

  const searchSubmit = (search: string) => {
    setCurrentPage(0);
    setSearch(search);
  };

  const searchClear = () => {
    setCurrentPage(prevPage);
    setSearch("");
  };

  const deleteStatus = useSelector(
    (state: RootState) => state.subUnit.deleteStatus
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
      const action = await dispatch(deleteSubunit(selectedId));
      if (isFulfilled(action)) {
        setSelectedId(undefined);
        updateTheListAfterModifying();
        closeDeleteModal();
      }
    }
  };

  const updateTheListAfterModifying = () => {
    if (currentPage === 0) {
      dispatch(
        getSubUnits({
          limit,
          offset: 0,
          searchValue: search,
        })
      );
    }
    setCurrentPage(0);
  };

  const transferStatus = useSelector(
    (state: RootState) => state.subUnit.transferStatus
  );

  const {
    transferModal,
    transferData,
    setTransferData,
    closeTransferModal,
    onTransferPress,
  } = useTransferModal();

  const handleTransferConfirm = async (data: TransferSubUnitProps) => {
    if (data) {
      const action = await dispatch(transferSubunit(data));
      if (isFulfilled(action)) {
        closeTransferModal();
        setTransferData(null);
        updateTheListAfterModifying();
      }
    }
  };

  if (
    can(AccessTypes.READ, SettingsModules.SubUnits) ||
    can(AccessTypes.READ, SettingsModules.SubUnitsAdmin)
  )
    return (
      <div>
        <Box style={{ display: "flex", justifyContent: "end" }}>
          {can(AccessTypes.READ, SettingsModules.SubUnitsAdmin) && (
            <Button
              variant={"outlined"}
              style={{ alignSelf: "end", marginRight: 10 }}
              onClick={() => navigate("/subunit-admins")}
              disableElevation
            >
              {"Show SubUnit Admins"}
            </Button>
          )}
          {can(AccessTypes.CREATE, SettingsModules.SubUnits) && (
            <Button
              variant={"contained"}
              style={{ alignSelf: "end" }}
              startIcon={<AddIcon />}
              onClick={() => navigate("/subunits/add")}
              disableElevation
            >
              {"Add SubUnit"}
            </Button>
          )}
        </Box>
        {listStatus === "failed" && (
          <ErrorView
            title={`${entityName}s loading failed`}
            desc={`There has been a problem while getting ${entityName} list data from the database. Please contact the administration for further details.`}
          />
        )}
        {listStatus !== "failed" && (
          <Box>
            <h2>All {entityName}s</h2>
            <SearchInput
              entity={entityName}
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
                    <StyledTableCell align="left">Base</StyledTableCell>
                    {can(
                      AccessTypes.UPDATE,
                      SettingsModules[entity] ||
                        can(AccessTypes.DELETE, SettingsModules[entity])
                    ) && (
                      <StyledTableCell align="left">Actions</StyledTableCell>
                    )}
                  </TableRow>
                </TableHead>
                <TableBody>
                  {list?.map((record, key) => (
                    <TableRow
                      key={key}
                      sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                    >
                      <StyledTableCell component="th" scope="row">
                        {record.id}
                      </StyledTableCell>
                      <StyledTableCell component="th" scope="row">
                        {record.name ?? "N/A"}
                      </StyledTableCell>
                      <StyledTableCell align="left">
                        {record.description ?? "N/A"}
                      </StyledTableCell>

                      <StyledTableCell align="left">
                        {record?.base?.name ?? "N/A"}
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
                          {can(AccessTypes.DELETE, SettingsModules[entity]) && (
                            <IconButton
                              color={"error"}
                              onClick={() =>
                                onTransferPress({
                                  id: record.id,
                                  name: record.name,
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
              {!count && listStatus !== "pending" && (
                <NoRecordSearching search={search} entity={entityName} />
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
            <TransferSubUnitModal
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
  return <UnauthorizedContent />;
};

export default SubUnits;
