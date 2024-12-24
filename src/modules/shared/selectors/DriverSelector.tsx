import { Autocomplete, FormControl, TextField } from "@mui/material"
import React, { useEffect, useState } from "react"
import { useFormContext } from "react-hook-form"
import {getRequest, postRequest} from "../../../api";
interface Driver {
  id: number
  name: string
}

interface Props {
  fieldName?: string
  variant?: string
  handleDriverSelect?: (driver: Driver | null) => void
}

const DriverSelector = ({ fieldName = "driver", variant, handleDriverSelect }: Props) => {
  const [drivers, setDrivers] = useState<Driver[]>([])
  const [isLoadingDriver, setIsLoadingDriver] = useState<boolean>(false)

  if (!isLoadingDriver) {
    setIsLoadingDriver(true)
    getRequest("/users/list-drivers").then(response => {;
      const items = response.data;
      if (items.length) {
        let driverList = items.map((item: any) => {
          if (item.name) {
            return {
              id: item.id,
              name: item.name,
            }
          }
        })
        driverList = driverList.filter((item: any) => item !== undefined)
        setDrivers(driverList)
    }})
  }

  const [currentValue, setCurrentValue] = useState<Driver | null>(null);

  const [name, setName] = useState<string>("")

  const onSearch = (newInputValue: string): void => {
    setName(newInputValue)
  }

  const onChange = (newValue: Driver | null) => {
    handleDriverSelect && handleDriverSelect(newValue)
    setCurrentValue(newValue)
  }

  return (
    <FormControl sx={{ width: "100%" }}>
      <Autocomplete
        style={{ backgroundColor: "white" }}
        renderInput={(params) => (
          <TextField
            {...params}
            variant={variant === "outlined" ? "outlined" : "filled"}
            label={`Driver Name`}
            required
            placeholder={"Select Driver"}
          />
        )}
        options={drivers || []}
        renderOption={(props, option) => {
          return (
            <li {...props} key={option.id}>
              {option.name}
            </li>
          );
        }}
        getOptionLabel={(option) => option.name}
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

export default DriverSelector
