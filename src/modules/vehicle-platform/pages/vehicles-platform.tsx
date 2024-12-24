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
import ModeEditIcon from "@mui/icons-material/ModeEdit";
import SearchInput from "core/components/SearchInput";
import { StyledTableCell } from "core/components/StyledTable";
import NoRecordSearching from "core/components/NoRecordSearching";
import DeleteConfirmationModal from "core/components/DeleteConfirmation";
import { useDeleteModal } from "core/hooks/useDeleteModal";
import { setPageTitle } from "core/layouts/layoutSlice";
import { getVehiclePlatforms, deleteVehiclePlatform } from "../vehiclePlatformSlice";
import { isFulfilled } from "@reduxjs/toolkit";

const VehiclesPlatform = () => {
  const { can } = usePermissions();
  const navigate = useNavigate();
  const dispatch: AppDispatch = useDispatch();
  const listStatus = useSelector(
    (state: RootState) => state.vehiclePlatform.listStatus
  );
  const entity = "Vehicle Platform";
  const [search, setSearch] = useState('');
  const count = useSelector((state: RootState) => state.vehiclePlatform.count);
  const listVehiclesPlatform = useSelector((state: RootState) => state.vehiclePlatform.list)
  const { limit, prevPage, currentPage, setCurrentPage, handleChangePage } =
    usePagination();
  
  const deleteStatus = useSelector(
    (state: RootState) => state.vehiclePlatform.deletePlatformStatus
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

  const onEdit = (platformId: number): void => {
    navigate(`/vehicle-platform/edit/${platformId}`)
  }

  useEffect(() => {
    dispatch(setPageTitle("Vehicles Platforms"));
  }, [dispatch]);

  const getListVehiclesPlatform = (limitPage: number, offset: number, searchValue: string): void => {
    dispatch(
      getVehiclePlatforms({
        limit: limitPage,
        offset,
        searchValue,
      })
    );
  }

  const onConfirmDelete = async () => {
    if (selectedId) {
      const action = await dispatch(deleteVehiclePlatform(selectedId));
      if (isFulfilled(action)) {
        setSelectedId(undefined);
        closeDeleteModal();
        if (listVehiclesPlatform.length === 1 && currentPage) {
          const newCurrentPage = currentPage - 1;
          setCurrentPage(newCurrentPage)
        } else {
          getListVehiclesPlatform(limit, currentPage * limit, search)
        }
      }
    }
  }

  useEffect(() => {
    getListVehiclesPlatform(limit, currentPage * limit, search)
  }, [dispatch, currentPage, search, limit]);


  if (can(AccessTypes.READ, SettingsModules.VehiclePlatform)) {
    return (
      <div>
        <Box style={{ display: "flex", justifyContent: "end" }}>
          {can(AccessTypes.CREATE, SettingsModules.VehiclePlatform) && (
            <Button
              variant={"contained"}
              style={{ alignSelf: "end" }}
              startIcon={<AddIcon />}
              onClick={() => navigate("/vehicle-platform/add")}
              disableElevation
            >
              {"Add Vehicle Platfrom"}
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
            <h2>All Vehicles Platforms</h2>
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
                      Name
                    </StyledTableCell>
                    <StyledTableCell align="left">
                      License Class
                    </StyledTableCell>
                    {can(
                      AccessTypes.UPDATE,
                      SettingsModules.VehiclePlatform ||
                        can(AccessTypes.DELETE, SettingsModules.VehiclePlatform)
                    ) && (
                      <StyledTableCell align="left">Actions</StyledTableCell>
                    )}
                  </TableRow>
                </TableHead>
                <TableBody>
                  {listVehiclesPlatform &&
                    listVehiclesPlatform.map((record, key) => (
                      <TableRow
                        key={key}
                        sx={{
                          "&:last-child td, &:last-child th": { border: 0 },
                        }}
                      >
                        <StyledTableCell style={{ width: "15%" }} component="th" scope="row">
                          {record.id}
                        </StyledTableCell>
                        <StyledTableCell style={{ width: "25%" }} component="th" scope="row">
                          {record.name}
                        </StyledTableCell>
                        <StyledTableCell style={{ width: "45%" }} component="th" scope="row">
                          {record.licenseClass.class}
                        </StyledTableCell>
                        <StyledTableCell style={{ width: "15%" }} align="left">
                          <Stack direction="row">
                            {can(
                              AccessTypes.UPDATE,
                              SettingsModules.VehiclePlatform
                            ) && (
                              <IconButton
                                sx={{ mr: 1 }}
                                aria-label="edit"
                                onClick={() => onEdit(record.id)}
                              >
                                <ModeEditIcon />
                              </IconButton>
                            )}
                            {can(
                              AccessTypes.DELETE,
                              SettingsModules.VehiclePlatform
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
export default VehiclesPlatform;