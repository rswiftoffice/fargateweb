import { Autocomplete, FormControl, TextField } from "@mui/material";
import React, { useEffect, useState } from "react";
import { useFormContext } from "react-hook-form";
import toast from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";
import { getLicenseClasses } from "../../modules/license-class/licenseClassSlice";
import { LicenseClass } from "../../modules/license-class/types";
import { RootState } from "../../store";
import { useDebounce } from "../hooks/useDebounce";

interface Props {
  required?: boolean;
  multiple?: boolean;
  disabled?: boolean;
  fieldName?: string;
}

const LicenseClassSelector = ({
  required = false,
  multiple = false,
  fieldName = "licenseClass",
  disabled = false,
}: Props) => {
  const dispatch = useDispatch();
  const { setValue, watch } = useFormContext();

  const currentValue = watch(fieldName) || null;

  // const [searchedClass, setSearchedClass] = useState<string>("")

  // const debouncedClass: string = useDebounce<string>(searchedClass, 500)

  const licenseClasses = useSelector(
    (state: RootState) => state.licenseClass.licenseClasses
  );

  const isLoading = useSelector(
    (state: RootState) => state.licenseClass.listStatus === "pending"
  );
  const isError = useSelector(
    (state: RootState) => state.licenseClass.listStatus === "failed"
  );

  useEffect(() => {
    dispatch(getLicenseClasses());
  }, [dispatch]);

  useEffect(() => {
    if (isError) {
      toast.error(
        "There was an error while fetching licenses. Try reloading the page!"
      );
    }
  }, [isError]);

  // const onSearch = (newInputValue: string): void => {
  //   setSearchedClass(newInputValue);
  // };

  const onChange = (newValue: LicenseClass | LicenseClass[] | null) => {
    setValue(fieldName, newValue);
  };

  return (
    <FormControl sx={{ width: "100%" }} variant={"outlined"}>
      <Autocomplete
        renderInput={(params) => (
          <TextField
            {...params}
            label={`License Class`}
            required={required}
            placeholder={
              multiple ? "Select license classes" : "Select a license class"
            }
          />
        )}
        options={licenseClasses || []}
        getOptionLabel={(option) => option.class}
        isOptionEqualToValue={(option, value) => option.id === value.id}
        value={multiple && !currentValue ? [] : currentValue}
        // filterOptions={(x) => x} // To disable built-in Autocomplete filtering feature as we want to fetch dynamic data from server as we type
        loading={isLoading}
        disabled={isError || disabled}
        // onInputChange={(_event, newInputValue) => {
        //   onSearch(newInputValue);
        // }}
        onChange={(_event, newValue) => onChange(newValue)}
        multiple={multiple}
      />
    </FormControl>
  );
};

export default LicenseClassSelector;
