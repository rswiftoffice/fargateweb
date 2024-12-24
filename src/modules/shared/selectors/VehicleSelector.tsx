import { Autocomplete, FormControl, TextField } from "@mui/material"
import React, { useEffect, useState } from "react"
import { useFormContext } from "react-hook-form"
import {getRequest} from "../../../api";

interface Vehicle {
  id: number
  vehicleNumber: string
}

interface Props {
  required?: boolean
  multiple?: boolean
  disabled?: boolean
  fieldName?: string
  handleSelect?: (vehicle: Vehicle | null) => void
  // subunit?: number
  variant?: string
}

const VehicleSelector = ({
  variant,
  required = false,
  multiple,
  handleSelect,
  fieldName = "vehicle",
  disabled = false,
}: // subunit,
Props) => {
  const [vehicles, setVehicles] = useState<Vehicle[]>([])
  const [currentValue, setCurrentValue] = useState<Vehicle | null>(null)
  const [isLoadingVehicle, setIsLoadingVehicle] = useState<boolean>(false)

  if (!isLoadingVehicle) {
    setIsLoadingVehicle(true)
    getRequest("/vehicles/all").then(response => {;
      const items = response.data.records;
      if (items.length) {
        let vehicleList = items.map((item: any) => {
          if (item.vehicleNumber) {
            return {
              id: item.id,
              vehicleNumber: item.vehicleNumber,
            }
          }
        })
        vehicleList = vehicleList.filter((item: any) => item !== undefined)
        setVehicles(vehicleList)
      }})
  }

  const [name, setName] = useState<string>("")

  const onSearch = (newInputValue: string): void => {
    setName(newInputValue)
  }

  const onChange = (newValue: Vehicle | null) => {
    handleSelect && handleSelect(newValue as Vehicle | null)
    setCurrentValue(newValue)
  }

  return (
    <FormControl sx={{ width: "100%" }}>
      <Autocomplete
        renderInput={(params) => (
          <TextField
            {...params}
            label={`Vehicle Number`}
            required={required}
            placeholder={multiple ? "Select vehicles" : "Select a vehicle number"}
            variant={variant === "outlined" ? "outlined" : "filled"}
          />
        )}
        options={vehicles || []}
        getOptionLabel={(option) => option.vehicleNumber}
        isOptionEqualToValue={(option, value) => option.id === value.id}
        value={currentValue}
        // filterOptions={(x) => x} // To disable built-in Autocomplete filtering feature as we want to fetch dynamic data from server as we type
        onInputChange={(_event, newInputValue) => {
          onSearch(newInputValue)
        }}
        onChange={(_event, newValue) => onChange(newValue)}
        multiple={false}
      />
    </FormControl>
  )
}

export default VehicleSelector
