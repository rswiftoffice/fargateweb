import { Autocomplete, FormControl, TextField } from "@mui/material";
import React, { useEffect, useState } from "react";
import { useFormContext } from "react-hook-form";
import toast from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";
import { getCommand } from "../../modules/command/commandSlice";
import { Command } from "../../modules/command/type";
import { RootState } from "../../store";
import { useDebounce } from "../hooks/useDebounce";

interface Props {
  required?: boolean;
  multiple?: boolean;
  disabled?: boolean;
  edit?: boolean;
  fieldName?: string;
  service?: number;
  variant?: string;
}

const CommandSelector = ({
  variant = "outlined",
  required = false,
  multiple = false,
  fieldName = "command",
  disabled = false,
  service,
  edit = false,
}: Props) => {
  const dispatch = useDispatch();
  const { setValue, watch } = useFormContext();

  const currentValue = watch(fieldName) || null;

  const [name, setName] = useState<string>("");

  const debouncedName: string = useDebounce<string>(name, 500);

  const isLoading = useSelector(
    (state: RootState) => state.command.loading === "pending"
  );
  const isError = useSelector(
    (state: RootState) => state.command.loading === "failed"
  );

  const commands = useSelector((state: RootState) =>
    state.command.commands.filter((c) => c.serviceId === service)
  );

  useEffect(() => {
    if (service) {
      dispatch(
        getCommand({
          serviceId: service,
          searchValue: edit ? "" : debouncedName,
        })
      );
    }
  }, [dispatch, service, debouncedName]);

  useEffect(() => {
    if (isError) {
      toast.error(
        "There was an error while fetching commands. Try reloading the page!"
      );
    }
  }, [isError]);

  const onSearch = (newInputValue: string): void => {
    setName(newInputValue);
  };

  const onChange = (newValue: Command | Command[] | null) => {
    setValue(fieldName, newValue);
  };

  return (
    <FormControl
      sx={{ width: "100%" }}
      variant={"outlined"}
      id="commandSelector"
    >
      <Autocomplete
        renderInput={(params) => (
          <TextField
            {...params}
            key={params.id}
            variant={variant === "outlined" ? "outlined" : "filled"}
            label={`Command`}
            required
            placeholder={multiple ? "Select commands" : "Select a command"}
          />
        )}
        options={commands || []}
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

export default CommandSelector;
