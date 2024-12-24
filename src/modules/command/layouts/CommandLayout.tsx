import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  Box,
  Stack,
  Button,
  Typography,
  TableContainer,
  Paper,
  LinearProgress,
  Table,
  IconButton,
  TableBody,
  TableHead,
  TablePagination,
  TableRow,
} from "@mui/material";
import { deleteCommand, getCommand, transferCommand } from "../commandSlice";
import { RootState } from "../../../store";
import DeleteIcon from "@mui/icons-material/Delete";
import ModeEditIcon from "@mui/icons-material/ModeEdit";
import AutorenewIcon from "@mui/icons-material/Autorenew";
import { useNavigate } from "react-router-dom";
import TransferCommandAlert from "./TransferCommandAlert";
import { getServices } from "../../service/serviceSlice";
import DeleteConfirmAlert from "./DeleteConfirmAlert";
import { setPageTitle } from "../../../core/layouts/layoutSlice";
import SearchInput from "core/components/SearchInput";
import { usePagination } from "core/hooks/usePagination";
import { StyledTableCell } from "core/components/StyledTable";

const entity = "Command";

function CommandLayout() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const commands = useSelector((state: RootState) => state.command.commands);
  const loading = useSelector((state: RootState) => state.command.loading);
  const count = useSelector((state: RootState) => state.command.count);
  const { limit, prevPage, currentPage, setCurrentPage, handleChangePage } =
    usePagination();
  const deleteCommandLoading = useSelector(
    (state: RootState) => state.command.deleteCommandLoading
  );
  const transferCommandLoading = useSelector(
    (state: RootState) => state.command.transferCommandLoading
  );
  const [search, setSearch] = useState("");
  const [showDeleteAlert, setShowDeleteAlert] = useState(false);
  const [showTransferAlert, setShowTransferAlert] = useState(false);
  const [currentCommand, setCurrentCommand] = useState<{
    id: number;
    name: string;
  } | null>(null);

  useEffect(() => {
    dispatch(setPageTitle("Command"));
    dispatch(getServices({}));
  }, [dispatch]);

  const onEdit = (command: { id: number; name: string }) => {
    navigate(`edit/${command.id}`);
  };

  const onDelete = (command: { id: number; name: string }) => {
    setShowDeleteAlert(true);
    setCurrentCommand(command);
  };

  const onTransferPress = (command: { id: number; name: string }) => {
    setCurrentCommand(command);
    setShowTransferAlert(true);
  };

  const onAddNewCommandClick = () => {
    navigate("add");
  };

  const onCloseDeleteAlert = () => {
    setShowDeleteAlert(false);
  };

  const onCloseTransferAlert = () => {
    setShowTransferAlert(false);
  };

  const onConfirmTransfer = (data: {
    currentCommandId: number;
    newCommandId: number;
  }) => {
    dispatch(transferCommand(data));
    setShowTransferAlert(false);
  };

  const onConfirmDelete = () => {
    if (currentCommand) {
      dispatch(deleteCommand(currentCommand.id));
      // dispatch(getCommand());
      setShowDeleteAlert(false);
      setCurrentCommand(null);
    }
  };

  const searchSubmit = (search: string) => {
    setCurrentPage(0);
    setSearch(search);
  };

  const searchClear = (search: string) => {
    setCurrentPage(prevPage);
    setSearch("");
  };

  useEffect(() => {
    dispatch(
      getCommand({
        limit: limit,
        offset: currentPage * limit,
        searchValue: search,
      })
    );
  }, [dispatch, currentPage, search, limit]);

  return (
    <Box>
      <Stack spacing={2} direction="row" justifyContent="flex-end">
        <Button
          variant="outlined"
          onClick={() => navigate("/command-admins", { replace: true })}
        >
          SHOW COMMAND ADMINS
        </Button>
        <Button variant="contained" onClick={onAddNewCommandClick}>
          + ADD COMMAND
        </Button>
      </Stack>
      <h2>{"All Commands"}</h2>
      <SearchInput entity={entity} submit={searchSubmit} clear={searchClear} />
      <br />
      <TableContainer component={Paper}>
        {loading === "pending" && <LinearProgress />}
        <Table sx={{ minWidth: 650 }} aria-label="simple table">
          <TableHead>
            <TableRow>
              <StyledTableCell align="left">Id</StyledTableCell>
              <StyledTableCell align="left">Name</StyledTableCell>
              <StyledTableCell align="left">Description</StyledTableCell>
              <StyledTableCell align="left">Service</StyledTableCell>
              <StyledTableCell align="left">Actions</StyledTableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {commands?.length > 0 &&
              commands.map((item, index) => (
                <TableRow
                  key={index}
                  sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                >
                  <StyledTableCell component="th" scope="row">
                    {item.id}
                  </StyledTableCell>
                  <StyledTableCell component="th" scope="row">
                    {item.name ?? "N/A"}
                  </StyledTableCell>
                  <StyledTableCell align="left">
                    {item.description ?? "N/A"}
                  </StyledTableCell>
                  <StyledTableCell align="left">
                    {item?.service?.name ?? "N/A"}
                  </StyledTableCell>
                  <StyledTableCell align="left">
                    <Stack direction="row">
                      <IconButton
                        sx={{ mr: 1 }}
                        aria-label="edit"
                        onClick={() => onEdit(item)}
                      >
                        <ModeEditIcon />
                      </IconButton>
                      <IconButton
                        color={"error"}
                        onClick={() => onDelete(item)}
                        aria-label="delete"
                      >
                        <DeleteIcon />
                      </IconButton>
                      <IconButton
                        color={"error"}
                        onClick={() => onTransferPress(item)}
                        aria-label="transfer"
                      >
                        <AutorenewIcon />
                      </IconButton>
                    </Stack>
                  </StyledTableCell>
                </TableRow>
              ))}
          </TableBody>
        </Table>
        {!commands?.length && loading !== "pending" && (
          <Box justifyContent="center" padding="20px" textAlign="center">
            {search ? (
              <Typography variant="body2">
                No records found with search term <b>{`'${search}'`}</b>. Try
                searching with another term!
              </Typography>
            ) : (
              <Typography variant="body2">No Commands Found</Typography>
            )}
          </Box>
        )}
      </TableContainer>
      <TablePagination
        component="div"
        rowsPerPageOptions={[limit]}
        count={count}
        rowsPerPage={limit}
        page={currentPage}
        onPageChange={handleChangePage}
      />
      <DeleteConfirmAlert
        open={showDeleteAlert}
        title={`Delete Command`}
        desc={`Are you sure you want to delete this command? This will delete all the data that is linked with this command. This action is irreversible!`}
        loading={deleteCommandLoading === "pending"}
        handleClose={onCloseDeleteAlert}
        handleConfirm={onConfirmDelete}
      />
      <TransferCommandAlert
        data={currentCommand}
        open={showTransferAlert}
        loading={transferCommandLoading === "pending"}
        handleClose={onCloseTransferAlert}
        handleConfirm={onConfirmTransfer}
      />
    </Box>
  );
}

export default CommandLayout;
