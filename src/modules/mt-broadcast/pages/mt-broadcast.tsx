import usePermissions from "auth/permissions/hooks/usePermissions";
import { AccessTypes, SettingsModules } from "auth/permissions/enums";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "store";
import { usePagination } from "core/hooks/usePagination";
import UnauthorizedContent from "core/components/UnauthorizedContent";
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
import { useEffect, useState } from "react";
import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";
import ErrorView from "core/components/ShowError";
import SearchInput from "core/components/SearchInput";
import { StyledTableCell } from "core/components/StyledTable";
import NoRecordSearching from "core/components/NoRecordSearching";
import DeleteConfirmationModal from "core/components/DeleteConfirmation";
import { useDeleteModal } from "core/hooks/useDeleteModal";
import { setPageTitle } from "core/layouts/layoutSlice";
import { getMtBroadCastList, deleteMTBroadcast } from "../mtBroadcastSlice";
import { isFulfilled } from "@reduxjs/toolkit";
import moment from "moment";

const MtBroadcast = () => {
  const { can } = usePermissions();
  const navigate = useNavigate();
  const dispatch: AppDispatch = useDispatch();
  const listStatus =  useSelector(
    (state: RootState) => state.mtBroadcast.listStatus
  );
  const entity = "MT Broadcast";
  const [search, setSearch] = useState('');
  const count = useSelector((state: RootState) => state.mtBroadcast.count);
  const listMTBroadcast = useSelector((state: RootState) => state.mtBroadcast.listMTBroadcast)
  const { limit, prevPage, currentPage, setCurrentPage, handleChangePage } =
    usePagination();
  
  const deleteStatus = useSelector(
    (state: RootState) => state.mtBroadcast.deleteStatus
  );

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

  useEffect(() => {
    dispatch(setPageTitle("MT Broadcast"));
  }, [dispatch]);

  const getListMTBroadcastWithPagination = (limitPage: number, offset: number, searchValue: string): void => {
    dispatch(
      getMtBroadCastList({
        limit: limitPage,
        offset,
        searchValue,
      })
    );
  }

  const onConfirmDelete = async () => {
    if (selectedId) {
      const action = await dispatch(deleteMTBroadcast(selectedId));
      if (isFulfilled(action)) {
        setSelectedId(undefined);
        closeDeleteModal();
        if (listMTBroadcast.length === 1 && currentPage) {
          const newCurrentPage = currentPage - 1;
          setCurrentPage(newCurrentPage)
        } else {
          getListMTBroadcastWithPagination(limit, currentPage * limit, search)
        }
      }
    }
  }

  useEffect(() => {
    getListMTBroadcastWithPagination(limit, currentPage * limit, search)
  }, [dispatch, currentPage, search, limit]);

  if (can(AccessTypes.READ, SettingsModules.MTBroadcast)) {
    return (
      <div>
        <Box style={{ display: "flex", justifyContent: "end" }}>
          {can(AccessTypes.CREATE, SettingsModules.MTBroadcast) && (
            <Button
              variant={"contained"}
              style={{ alignSelf: "end" }}
              startIcon={<AddIcon />}
              onClick={() => navigate("/mt-broadcast/add")}
              disableElevation
            >
              {"Add MT Broadcast"}
            </Button>
          )}
        </Box>

        {listStatus === "failed" && (
          <ErrorView
            title={`${entity}es loading failed`}
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
                    <StyledTableCell align="left">
                      Title
                    </StyledTableCell>
                    <StyledTableCell align="left">
                      File
                    </StyledTableCell>
                    <StyledTableCell align="left">
                      Date Created
                    </StyledTableCell>
                    {can(AccessTypes.DELETE, SettingsModules.MTBroadcast) && (
                      <StyledTableCell align="left">Actions</StyledTableCell>
                    )}
                  </TableRow>
                </TableHead>
                <TableBody>
                  {listMTBroadcast &&
                    listMTBroadcast.map((record, key) => (
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
                          {record.title}
                        </StyledTableCell>
                        <StyledTableCell component="th" scope="row">
                          {record.file}
                        </StyledTableCell>
                        <StyledTableCell component="th" scope="row">
                          {record?.createdAt
                          ? moment.utc(record.createdAt).local().format("DD MMM, YYYY (HH:mm)")
                          : "N/A"}
                        </StyledTableCell>
                        <StyledTableCell align="left">
                          <Stack direction="row">
                            {can(
                              AccessTypes.DELETE,
                              SettingsModules.MTBroadcast
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
    )
  }
  return <UnauthorizedContent />;
}
export default MtBroadcast;