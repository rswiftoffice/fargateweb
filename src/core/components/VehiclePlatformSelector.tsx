import { Autocomplete, FormControl, TextField } from "@mui/material";
import { getRequest } from "api";
import { useDebounce } from "core/hooks/useDebounce";
import React, { useEffect, useState } from "react";
import { useFormContext } from "react-hook-form";
import toast from "react-hot-toast";
interface VehiclesPlatform {
  id: number;
  name: string;
}

interface Props {
  variant?: string;
  required?: boolean;
  multiple?: boolean;
  disabled?: boolean;
  fieldName?: string;
}

const VehiclesPlatformSelector = ({
  variant = "outlined",
  required = false,
  multiple,
  disabled = false,
  fieldName = "platform",
}: Props) => {
  const { setValue, watch } = useFormContext();
  const currentValue = watch(fieldName) || null;
  const [name, setName] = useState<string>("");
  const debouncedName: string = useDebounce<string>(name, 500);
  const [vehiclesPlatforms, setVehiclesPlatforms] = useState();
  const [isError, setError] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    getRequest("/vehicle-platforms", { searchValue: debouncedName })
      .then((response) => {
        setVehiclesPlatforms(response.data.records);
      })
      .catch((err) => setError(true))
      .finally(() => {
        setLoading(false);
      });
  }, [debouncedName]);

  useEffect(() => {
    if (isError) {
      toast.error(
        "There was an error while fetching Vehicles Platforms. Try reloading the page!"
      );
    }
  }, [isError]);

  const onSearch = (newInputValue: string): void => {
    setName(newInputValue);
  };

  const onChange = (newValue: VehiclesPlatform | VehiclesPlatform[] | null) => {
    setValue(fieldName, newValue);
  };

  return (
    <FormControl sx={{ width: "100%" }} variant={"standard"}>
      <Autocomplete
        renderInput={(params) => (
          <TextField
            {...params}
            variant={variant === "outlined" ? "outlined" : "filled"}
            label={`Vehicle Platform`}
            required
            placeholder={
              multiple
                ? "Select Vehicles Platforms"
                : "Select a Vehicles Platform"
            }
          />
        )}
        options={vehiclesPlatforms || []}
        getOptionLabel={(option) => option.name}
        isOptionEqualToValue={(option, value) => option.id === value.id}
        value={multiple && !currentValue ? [] : currentValue}
        filterOptions={(x) => x} // To disable built-in Autocomplete filtering feature as we want to fetch dynamic data from server as we type
        loading={loading}
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

export default VehiclesPlatformSelector;
