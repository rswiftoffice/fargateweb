import { FormControl, InputLabel, MenuItem, Select } from "@mui/material";
import { VehicleType } from "core/types/db-enum";
import React from "react";
import { useFormContext } from "react-hook-form";

interface Props {
  required?: boolean;
  disabled?: boolean;
  fieldName?: string;
  shrink?: boolean;
}

const VehicleTypeSelector = ({
  required = false,
  fieldName = "vehicleType",
  disabled = false,
  shrink = false,
}: Props) => {
  const { setValue, watch } = useFormContext();

  const currentValue = watch(fieldName) || "";

  const onChange = (newValue: VehicleType | "") => {
    setValue(fieldName, newValue);
  };

  return (
    <FormControl sx={{ width: "100%" }} variant={"outlined"}>
      {shrink ? (
        <InputLabel
          shrink={true}
          style={{ background: "white", paddingLeft: 5, paddingRight: 5 }}
        >
          {"Vehicle Type *"}
        </InputLabel>
      ) : (
        <InputLabel>{"Vehicle Type"}</InputLabel>
      )}
      <Select
        value={currentValue}
        required={required}
        disabled={disabled}
        label={"Vehicle Type *"}
        onChange={(data) => onChange(data.target.value)}
      >
        {[VehicleType.Vehicle, VehicleType.Motorcycle].map((record, key) => (
          <MenuItem key={key} value={record}>
            {record}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
};

export default VehicleTypeSelector;
