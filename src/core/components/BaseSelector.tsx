import { Autocomplete, FormControl, TextField } from "@mui/material";
import { getRequest } from "api";
import React, { useEffect, useState } from "react";
import { useFormContext } from "react-hook-form";
import toast from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";
import { Base } from "../../modules/base/type";
import { RootState } from "../../store";
import { useDebounce } from "../hooks/useDebounce";

interface Props {
  required?: boolean;
  edit?: boolean;
  multiple?: boolean;
  disabled?: boolean;
  fieldName?: string;
  command?: number;
  variant?: string;
}

const BaseSelector = ({
  variant = "outlined",
  required = false,
  multiple = false,
  fieldName = "base",
  disabled = false,
  command,
  edit = false,
}: Props) => {
  const dispatch = useDispatch();
  const { setValue, watch } = useFormContext();

  const currentValue = watch(fieldName) || null;

  const [name, setName] = useState<string>("");
  const [bases, setBases] = useState([]);

  const debouncedName: string = useDebounce<string>(name, 500);

  const isLoading = useSelector(
    (state: RootState) => state.base.listStatus === "pending"
  );
  const isError = useSelector(
    (state: RootState) => state.base.listStatus === "failed"
  );

  useEffect(() => {
    getRequest("/base", {
      searchValue: edit ? "" : debouncedName,
      commandId: command,
    }).then((response) => {
      setBases(response.data.records);
    });
  }, [dispatch, debouncedName, command]);

  useEffect(() => {
    if (isError) {
      toast.error(
        "There was an error while fetching bases. Try reloading the page!"
      );
    }
  }, [isError]);

  const onSearch = (newInputValue: string): void => {
    setName(newInputValue);
  };

  const onChange = (newValue: Base | Base[] | null) => {
    setValue(fieldName, newValue);
  };

  return (
    <FormControl sx={{ width: "100%" }} variant={"outlined"} id="baseSelector">
      <Autocomplete
        renderInput={(params) => (
          <TextField
            {...params}
            key={params.id}
            label={`Base`}
            required={required}
            placeholder={multiple ? "Select bases" : "Select a base"}
            variant={variant === "outlined" ? "outlined" : "filled"}
          />
        )}
        options={bases || []}
        getOptionLabel={(option) => option.name}
        isOptionEqualToValue={(option, value) => option.id === value.id}
        value={multiple && !currentValue ? [] : currentValue}
        filterOptions={(x) => x} // To disable built-in Autocomplete filtering feature as we want to fetch dynamic data from server as we type
        loading={isLoading}
        disabled={isError || disabled}
        onInputChange={(_event, newInputValue) => {
          onSearch(newInputValue);
        }}
        onChange={(_event, newValue) => onChange(newValue)}
        multiple={multiple}
      />
    </FormControl>
  );
};

export default BaseSelector;
