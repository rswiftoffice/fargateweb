import usePermissions from "auth/permissions/hooks/usePermissions";
import { AccessTypes, SettingsModules } from "auth/permissions/enums";
import { Box } from "@mui/system";
import {
  Button, CircularProgress,
  IconButton,
  LinearProgress,
  Paper, Popover,
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
import SimCardDownloadSharpIcon from "@mui/icons-material/SimCardDownloadSharp";
import VisibilityIcon from "@mui/icons-material/Visibility";
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
import { deleteBase, getAuditLogs, transferBase } from "../auditLogSlice";
import { useTransferModal } from "core/hooks/useTransferModal";
import { isFulfilled } from "@reduxjs/toolkit";
import NoRecordSearching from "core/components/NoRecordSearching";
import moment from "moment";
import PreviewModal from "./PreviewModal";
import CustomDateRangePicker from "modules/shared/components/CustomDateRangePicker";
import toast from "react-hot-toast";
import fileDownload from "js-file-download";
// @ts-ignore
import { parse } from "json2csv";
import {postRequest} from "../../../api";

const entity = "AuditLog";

interface PreviewProps {
    Id: number
    Name: string
    Description: string
    Current_Role: string
    Added_By: string
    Created_At: string
    Updated_At: string
}

interface DateRangeProps {
  startDate: Date
  endDate: Date
}

const AuditLog = () => {
  const { can } = usePermissions();
  const navigate = useNavigate();
  const dispatch: AppDispatch = useDispatch();
  const [search, setSearch] = useState("");
  const { limit, prevPage, currentPage, setCurrentPage, handleChangePage } =
    usePagination();

  const auditLogs = useSelector((state: RootState) => state.auditLog.auditLogs);
  const count = useSelector((state: RootState) => state.auditLog.count);
  const listStatus = useSelector((state: RootState) => state.auditLog.listStatus);
  const [showData, setShowData] = useState(false)
  const [previewDataInfo, setPreviewDataInfo] = useState<PreviewProps | null>(null)

  const [dateRange, setDateRange] = useState<DateRangeProps>({
    startDate: new Date(),
    endDate: new Date(),
  })
  const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null)
  const [exportData, setExportData] = useState([]);
  const [exportDataLoading, setExportDataLoading] = useState(false);
  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget)
  }

  const open = Boolean(anchorEl)
  const id = open ? "simple-popover" : undefined

  const handleClose = () => {
    setAnchorEl(null)
  }

  const handleDateRangeChange = (range: DateRangeProps) => {
    const newRange = { ...range }
    const endDate = newRange.endDate
    endDate.setDate(endDate.getDate() + 1)
    newRange.endDate = endDate
    setDateRange(newRange)
  }

  const handleExportPress = async () => {
    toast.loading("Generating CSV!")
    handleClose()
    try {
      const list = await getExportData();
      const copyList: PreviewProps[] = list.map((data: any) => ({
        Id: data.id,
        Name: data.name,
        Description: data.description,
        Current_Role: data.currentRole,
        Added_By: data.addedBy.email,
        Created_At: moment.utc(data.createdAt).local().format("DD MMM, YYYY (HH:mm)"),
        Updated_At: moment.utc(data.updatedAt).local().format("DD MMM, YYYY (HH:mm)"),
      }))

      if (copyList && copyList.length > 0) {
        toast.dismiss()
        processData(copyList)
      } else {
        toast.dismiss()
        toast.error("No Data Found!")
      }
    } catch (error: any) {
      toast.dismiss()
      toast.error(error.message ?? `Unable to Export data. Please try again!`)
    }
  }

  const getExportData = async () => {
    const response = await postRequest("/audit-log/get-export-data", {
      fromDate: dateRange.startDate,
      toDate: dateRange.endDate,
    });

    return response.data.records;
  }

  const processData = (exportData: any) => {
    const labels = exportData[0]
    const fields = Object.keys(labels)
    const csv = parse(exportData, fields)
    toast.success("Data exported successfully!")
    fileDownload(csv, `download-${moment.utc().format("HH:mm:ss")}.csv`)
  }

  useEffect(() => {
    dispatch(setPageTitle("Audit Logs"));
  }, [dispatch]);

  useEffect(() => {
    dispatch(
    getAuditLogs({
        limit: limit,
        offset: currentPage * limit,
        searchValue: search,
      })
    );
  }, [dispatch, currentPage, search, limit]);

  const onEdit = (id: number) => {
    navigate(`/bases/edit/${id}`);
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
    (state: RootState) => state.base.deleteStatus
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
      const action = await dispatch(deleteBase(selectedId));
      if (isFulfilled(action)) {
        setSelectedId(undefined);
        updateTheListAfterModifying();
        closeDeleteModal();
      }
    }
  };

  const transferStatus = useSelector(
    (state: RootState) => state.base.transferStatus
  );

  const {
    transferModal,
    transferData,
    setTransferData,
    closeTransferModal,
    onTransferPress,
  } = useTransferModal();

  const updateTheListAfterModifying = () => {
    if (currentPage === 0) {
      dispatch(getAuditLogs({ limit, offset: 0, searchValue: search }));
    }
    setCurrentPage(0);
  };

  const handleShowData = (record: any) => {
    setPreviewDataInfo(record)
    setShowData(true)
  }

  const handleClosePreview = () => {
    setShowData(false)
    setTimeout(() => {
      setPreviewDataInfo(null)
    }, 100)
  }

  const handleRecordSelect = (data: any) => {
    const myData: PreviewProps = {
        Id: data.id,
        Name: data.name,
        Description: data.description,
        Current_Role: data.currentRole,
        Added_By: data.addedBy.email,
        Created_At: moment.utc(data.createdAt).local().format("DD MMM, YYYY (HH:mm)"),
        Updated_At: moment.utc(data.updatedAt).local().format("DD MMM, YYYY (HH:mm)"),
    }
  handleShowData(myData)
}

  if (
    can(AccessTypes.READ, SettingsModules.AuditLog)
  )
    return (
      <div>
        {listStatus === "failed" && (
          <ErrorView
            title={`${entity}s loading failed`}
            desc={`There has been a problem while getting ${entity} list data from the database. Please contact the administration for further details.`}
          />
        )}

        <Box style={{ display: "flex", justifyContent: "end" }}>
          <Button
           variant={"contained"}
           style={{ alignSelf: "end" }}
           onClick={handleClick}
           startIcon={
             exportDataLoading ? (
              <CircularProgress size={16} style={{ color: "white" }} />
             ) : (
              <SimCardDownloadSharpIcon />
             )
           }
           disableElevation
          >
            {"Export"}
          </Button>
          <Popover
           id={id}
           open={open}
           anchorEl={anchorEl}
           onClose={handleClose}
           anchorOrigin={{
             vertical: "bottom",
             horizontal: "right",
           }}
           transformOrigin={{
             vertical: "top",
             horizontal: "right",
           }}
           anchorPosition={{ top: 100, left: 400 }}
          >
            <CustomDateRangePicker
             dateRange={dateRange}
             handleDateRangeChange={handleDateRangeChange}
             onExportPress={handleExportPress}
            />
          </Popover>
        </Box>

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
                    <StyledTableCell align="left">Added By</StyledTableCell>
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
                  {auditLogs &&
                    auditLogs.map((record, key) => (
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
                          {record.name ?? "N/A"}
                        </StyledTableCell>
                        <StyledTableCell align="left">
                          {record.description ?? "N/A"}
                        </StyledTableCell>
                        <StyledTableCell align="left">
                          {record?.addedBy?.name ?? "N/A"}
                        </StyledTableCell>
                        <StyledTableCell align="left">
                          <Stack direction="row">
                              <Button
                                  sx={{ px: 3 }}
                                  startIcon={<VisibilityIcon />}
                                  onClick={() => handleRecordSelect(record)}
                              >
                                  View
                              </Button>
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
            <PreviewModal open={showData} data={previewDataInfo} handleClose={handleClosePreview} />
          </Box>
        )}
      </div>
    );
  return <UnauthorizedContent />;
};
export default AuditLog;
