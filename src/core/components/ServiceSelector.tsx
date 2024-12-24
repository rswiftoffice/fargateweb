import { Autocomplete, FormControl, TextField } from "@mui/material";
import { getRequest } from "api";
import { useEffect, useState } from "react";
import { useFormContext } from "react-hook-form";
import toast from "react-hot-toast";
import { useSelector } from "react-redux";
import { RootState } from "../../store";
import { useDebounce } from "../hooks/useDebounce";
export interface Service {
  description: string;
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

const ServiceSelector = ({
  variant = "outlined",
  required = false,
  multiple,
  disabled = false,
  fieldName = "service",
}: Props) => {
  const { setValue, watch } = useFormContext();

  const currentValue = watch(fieldName) || null;

  const [name, setName] = useState<string>("");

  const debouncedName: string = useDebounce<string>(name, 500);

  const [services, setService] = useState([]);
  const [isError, setError] = useState(false);

  useEffect(() => {
    getRequest("/services", { searchValue: debouncedName })
      .then((response) => {
        setService(response.data.records);
      })
      .catch((err) => {
        setError(true);
      });
  }, [debouncedName]);

  useEffect(() => {
    if (isError) {
      toast.error(
        "There was an error while fetching services. Try reloading the page!"
      );
    }
  }, [isError]);

  const onSearch = (newInputValue: string): void => {
    setName(newInputValue);
  };

  const onChange = (newValue: Service | Service[] | null) => {
    setValue(fieldName, newValue);
  };

  return (
    <FormControl
      sx={{ width: "100%" }}
      variant={"standard"}
      id="serviceSelector"
    >
      <Autocomplete
        renderInput={(params) => (
          <TextField
            {...params}
            key={params.id}
            variant={variant === "outlined" ? "outlined" : "filled"}
            label={`Service`}
            required
            placeholder={multiple ? "Select services" : "Select a service"}
          />
        )}
        options={services || []}
        getOptionLabel={(option) => option.name}
        isOptionEqualToValue={(option, value) => option.id === value.id}
        value={multiple && !currentValue ? [] : currentValue}
        filterOptions={(x) => x} // To disable built-in Autocomplete filtering feature as we want to fetch dynamic data from server as we type
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

export default ServiceSelector;
