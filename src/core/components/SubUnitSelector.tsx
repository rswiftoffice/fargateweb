import { Autocomplete, FormControl, TextField } from "@mui/material";
import { getRequest } from "api";
import { useEffect, useState } from "react";
import { useFormContext } from "react-hook-form";
import toast from "react-hot-toast";
import { SubUnit } from "../../modules/subunit/types";
import { useDebounce } from "../hooks/useDebounce";
import { RootState } from "../../store";
import { useDispatch, useSelector } from "react-redux";

interface Props {
  required?: boolean;
  multiple?: boolean;
  disabled?: boolean;
  fieldName?: string;
  base?: number;
  variant?: string;
  edit?: boolean;
}

const SubUnitSelector = ({
  variant = "outlined",
  required = false,
  multiple,
  fieldName = "subunit",
  disabled = false,
  base,
  edit = false,
}: Props) => {
  const dispatch = useDispatch();
  const { setValue, watch } = useFormContext();
  const currentValue = watch(fieldName) || null;
  const [name, setName] = useState<string>("");
  const debouncedName: string = useDebounce<string>(name, 500);
  const [subUnits, setSubUnits] = useState();

  const isLoading = useSelector(
    (state: RootState) => state.base.listStatus === "pending"
  );
  const isError = useSelector(
    (state: RootState) => state.base.listStatus === "failed"
  );

  useEffect(() => {
    getRequest("/subUnits", {
      searchValue: edit ? "" : debouncedName,
      baseId: base,
    }).then((response) => {
      setSubUnits(response.data.records);
    });
  }, [dispatch, debouncedName, base]);

  useEffect(() => {
    if (isError) {
      toast.error(
        "There was an error while fetching sub units. Try reloading the page!"
      );
    }
  }, [isError]);

  const onSearch = (newInputValue: string): void => {
    setName(newInputValue);
  };

  const onChange = (newValue: SubUnit | SubUnit[] | null) => {
    setValue(fieldName, newValue);
  };

  return (
    <FormControl
      sx={{ width: "100%" }}
      variant={"outlined"}
      id="subUnitSelector"
    >
      <Autocomplete
        renderInput={(params) => (
          <TextField
            {...params}
            key={params.id}
            label={`Sub Unit`}
            required={required}
            placeholder={multiple ? "Select sub units" : "Select a sub unit"}
            variant={variant === "outlined" ? "outlined" : "filled"}
          />
        )}
        options={subUnits || []}
        getOptionLabel={(option) => option.name}
        isOptionEqualToValue={(option, value) => option.id === value.id}
        value={currentValue}
        filterOptions={(x) => x} // To disable built-in Autocomplete filtering feature as we want to fetch dynamic data from server as we type
        loading={isLoading}
        disabled={isError || disabled}
        onInputChange={(_event, newInputValue) => {
          onSearch(newInputValue);
        }}
        onChange={(_event, newValue) => onChange(newValue)}
        multiple={multiple ? true : undefined}
      />
    </FormControl>
  );
};

export default SubUnitSelector;
