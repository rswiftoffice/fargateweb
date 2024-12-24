import { IconButton, InputBase, Paper } from "@mui/material";
import ClearOutlinedIcon from "@mui/icons-material/ClearOutlined";
import { useForm } from "react-hook-form";
import { SeachInputFormValue } from "../types/form";
import { useState } from "react";
import SearchOutlinedIcon from "@mui/icons-material/SearchOutlined";

interface Props {
  entity: string;
  submit: (search: string) => void;
  clear: (search: string) => void;
}

const SearchInput = ({ entity, submit, clear }: Props) => {
  const { register, handleSubmit, setValue } = useForm<SeachInputFormValue>();
  const [search, setSearch] = useState("");

  const handleClear = () => {
    setSearch("");
    clear(search);
    setValue("search", "");
  };

  const onSubmit = async (values: SeachInputFormValue) => {
    const { search } = values;
    setSearch(search);
    submit(search);
  };
  const pluralText = entity === 'License Class' ? 'es' : 's';
  return (
    <Paper
      component="form"
      sx={{
        p: "2px 4px",
        display: "flex",
        alignItems: "center",
        width: "100%",
      }}
      onSubmit={handleSubmit(onSubmit)}
      onReset={() => setSearch("")}
    >
      <InputBase
        sx={{ ml: 1, flex: 1 }}
        placeholder={`Search ${entity}${pluralText}`}
        inputProps={{ "aria-label": `search ${entity}` }}
        {...register("search")}
      />
      {search && (
        <IconButton
          type="reset"
          sx={{ p: "10px" }}
          onClick={handleClear}
          aria-label="clear"
        >
          <ClearOutlinedIcon />
        </IconButton>
      )}
      <IconButton type="submit" sx={{ p: "10px" }} aria-label="search">
        <SearchOutlinedIcon />
      </IconButton>
    </Paper>
  );
};

export default SearchInput;
