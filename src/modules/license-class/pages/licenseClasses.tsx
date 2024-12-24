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
import { getLicenseClassesWithPagination, deleteLicenseClass } from "../licenseClassSlice";
import { isFulfilled } from "@reduxjs/toolkit";

const LicenseClasses = () => {
  const { can } = usePermissions();
  const navigate = useNavigate();
  const dispatch: AppDispatch = useDispatch();
  const getStatus = useSelector(
    (state: RootState) => state.licenseClass.getStatus
  );
  const entity = "License Class";
  const [search, setSearch] = useState('');
  const count = useSelector((state: RootState) => state.licenseClass.count);
  const licenseClassesWithPagination = useSelector((state: RootState) => state.licenseClass.licenseClassesWithPagination)
  const { limit, prevPage, currentPage, setCurrentPage, handleChangePage } =
    usePagination();
  
  const deleteStatus = useSelector(
    (state: RootState) => state.licenseClass.deleteStatus
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

  const onEdit = (licenseId: number): void => {
    navigate(`/license-clases/edit/${licenseId}`)
  }

  useEffect(() => {
    dispatch(setPageTitle("License Classes"));
  }, [dispatch]);

  const getListLicenseClasses = (limitPage: number, offset: number, searchValue: string): void => {
    dispatch(
      getLicenseClassesWithPagination({
        limit: limitPage,
        offset,
        searchValue,
      })
    );
  }

  const onConfirmDelete = async () => {
    if (selectedId) {
      const action = await dispatch(deleteLicenseClass(selectedId));
      if (isFulfilled(action)) {
        setSelectedId(undefined);
        closeDeleteModal();
        if (licenseClassesWithPagination.length === 1 && currentPage) {
          const newCurrentPage = currentPage - 1;
          setCurrentPage(newCurrentPage)
        } else {
          getListLicenseClasses(limit, currentPage * limit, search)
        }
      }
    }
  }

  useEffect(() => {
    getListLicenseClasses(limit, currentPage * limit, search)
  }, [dispatch, currentPage, search, limit]);


  if (can(AccessTypes.READ, SettingsModules.LicenseClass)) {
    return (
      <div>
        <Box style={{ display: "flex", justifyContent: "end" }}>
          {can(AccessTypes.CREATE, SettingsModules.LicenseClass) && (
            <Button
              variant={"contained"}
              style={{ alignSelf: "end" }}
              startIcon={<AddIcon />}
              onClick={() => navigate("/license-clases/add")}
              disableElevation
            >
              {"Add License Class"}
            </Button>
          )}
        </Box>

        {getStatus === "failed" && (
          <ErrorView
            title={`${entity}es loading failed`}
            desc={`There has been a problem while getting ${entity} list data from the database. Please contact the administration for further details.`}
          />
        )}

        {getStatus !== "failed" && (
          <Box>
            <h2>All {entity}es</h2>
            <SearchInput
              entity={entity}
              submit={searchSubmit}
              clear={searchClear}
            />
            <br />
            <TableContainer component={Paper}>
              {getStatus === "pending" && <LinearProgress />}
              <Table sx={{ minWidth: 650 }} aria-label="simple table">
                <TableHead>
                  <TableRow>
                    <StyledTableCell style={{ width: "35%" }} align="left">Id</StyledTableCell>
                    <StyledTableCell style={{ width: "55%" }} align="left">
                      Class
                    </StyledTableCell>
                    {can(
                      AccessTypes.UPDATE,
                      SettingsModules.LicenseClass ||
                        can(AccessTypes.DELETE, SettingsModules.LicenseClass)
                    ) && (
                      <StyledTableCell style={{ width: "10%" }} align="left">Actions</StyledTableCell>
                    )}
                  </TableRow>
                </TableHead>
                <TableBody>
                  {licenseClassesWithPagination &&
                    licenseClassesWithPagination.map((record, key) => (
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
                          {record.class}
                        </StyledTableCell>
                        <StyledTableCell align="left">
                          <Stack direction="row">
                            {can(
                              AccessTypes.UPDATE,
                              SettingsModules.LicenseClass
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
                              SettingsModules.LicenseClass
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
              {!count && getStatus !== "pending" && (
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

export default LicenseClasses;