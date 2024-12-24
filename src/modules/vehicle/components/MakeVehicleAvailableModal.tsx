import { LoadingButton } from "@mui/lab";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Grid,
  FormControl,
  TextField,
} from "@mui/material";
// import { Destination, Trip } from "@prisma/client";
import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useForm } from "react-hook-form";
import moment from "moment";
import { Trip } from "../type";
import { AppDispatch } from "store";
import { useDispatch } from "react-redux";
import { makeVehicalAvailable } from "../vehicleSlice";

interface Props {
  open: boolean;
  trip: Trip;
  eLog: any;
  handleClose: (success?: boolean) => void;
}

const MakeVehicleAvailableModal = ({
  open,
  trip,
  eLog,
  handleClose,
}: Props) => {
  const dispatch: AppDispatch = useDispatch();
  const { register, handleSubmit, formState, setValue } = useForm();
  const [isLoading, setLoading] = useState(false);
  const [isError, setError] = useState(false);
  const [disabled, setDisabled] = useState(false);
  const [data, setData] = useState();
  const [totalDistance, setTotalDistance] = useState(0);
  // const [executeMakeVehicleAvailable, { isLoading, data, isError }] =
  //   useMutation(makeVehicleAvailable, {
  //     mutationKey: "makeVehicleAvailable",
  //   });

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const onSubmit = async (inputs: any) => {
    const formData = {
      ...inputs,
      totalDistance: totalDistance,
    };
    dispatch(
      makeVehicalAvailable({
        tripId: trip.id,
        endedAt: moment().utc().format(),
        hasNoInProgressDestinations: true,
        ...inputs,
        totalDistance: totalDistance,
      })
    )
      .then((res: any) => {
        if (res.payload.data) {
          handleClose(true);
        }
      })
      .catch(() => {
        setError(true);
      });

    // const payload = Object.keys(formData)).reduce((acc, key) => {
    //   if (formData[key] !== "" && !isNaN(formData[key])) {
    //     acc[key] = formData[key];
    //   }
    //   return acc;
    // }, {});
    // executeMakeVehicleAvailable({
    //   ...payload,
    //   tripId: trip.id,
    //   endTime: moment(moment(formData.endTime).format()).utc().format(),
    //   endedAt: moment().utc().format(),
    //   // eslint-disable-next-line @typescript-eslint/no-explicit-any
    // } as any);
  };

  const onSubmitWithoutPendingDestinations = (inputs: any) => {
    dispatch(
      makeVehicalAvailable({
        tripId: trip.id,
        endedAt: moment().utc().format(),
        hasNoInProgressDestinations: true,
        ...inputs,
        totalDistance: totalDistance,
      })
    )
      .then((res: any) => {
        if (res.payload.data) {
          handleClose(true);
        }
      })
      .catch(() => {
        setError(true);
      });
  };

  useEffect(() => {
    if (isError) {
      toast.error("Something went wrong while making vehicle available!");
    }
  }, [isError]);

  useEffect(() => {
    if (data) {
      toast.success("Vehicle is now available!");
      handleClose(true);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data]);

  const calculateTotalDistance = (
    meterReading: number,
    currentMeterReading: number
  ) => {
    const distance = meterReading - currentMeterReading;
    return distance < 0 ? 0 : distance;
  };

  const handleMeterReadingChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    // const meterReading = parseInt(e.target.value, 10);
    const meterReading = parseFloat(e.target.value);
    if (meterReading) {
      // Fetch the current meter reading.
      const currentMeterReading = trip.currentMeterReading;

      const distance = calculateTotalDistance(
        meterReading,
        currentMeterReading
      );
      setTotalDistance(distance);
      setValue("meterReading", meterReading, { shouldValidate: true });
    }
  };

  // Prevent negative input on key press
  const preventNegativeInput = (e: React.KeyboardEvent) => {
    if (e.key === "-" || e.key === "e" || e.key === "E") {
      e.preventDefault();
    }
  };

  // Prevent negative value on change
  const preventNegativeValue = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    if (parseInt(e.target.value, 10) < 0) {
      e.target.value = "0";
    }
  };

  // Prevent scroll from changing the value
  const preventScroll = (e: React.WheelEvent) => {
    (e.target as HTMLInputElement).blur();
  };

  // Prevent decrementing below 0 with arrow keys
  const handleKeyDown = (e: React.KeyboardEvent) => {
    const value = parseInt((e.target as HTMLInputElement).value, 10);
    if (
      (e.key === "ArrowDown" && value <= 0) ||
      (e.key === "ArrowUp" && value < 0)
    ) {
      e.preventDefault();
    }
  };

  useEffect(() => {
    if (trip !== null && trip.destinations.length > 0) {
      let inProgressData = trip?.destinations.filter(
        (key) => key.status === "InProgress"
      );
      if (inProgressData.length === 0) {
        let inActiveData = trip?.destinations.filter(
          (key) => key.status === "Inactive"
        );
        if (inActiveData.length > 0) {
          setValue("meterReading", trip.currentMeterReading);
          setTotalDistance(eLog.totalDistance);
          setDisabled(true);
        }
      }
    }
  }, [trip]);
  return (
    <Dialog
      open={open}
      onClose={(event, reason) => {
        if (reason !== "backdropClick") {
          handleClose();
        }
      }}
      maxWidth={"md"}
      disableEscapeKeyDown
      fullWidth
    >
      <DialogTitle>Make Vehicle Available</DialogTitle>
      <DialogContent dividers>
        {trip.destinations.length === 0 && (
          <p>
            All destinations have been completed but the trip status is still
            `In Progress`. Click `Make Vehicle Available` to mark the trip as
            `Completed` and make the vehicle available for another trip.
          </p>
        )}
        {trip.destinations.length > 0 && (
          <Grid container columns={{ xs: 4, sm: 8, md: 12 }}>
            <Grid item xs={12} md={6} sx={{ pl: 2, pr: 6, pt: 3 }}>
              <FormControl sx={{ width: "100%" }} variant={"filled"}>
                <TextField
                  label="Last Meter Reading"
                  placeholder="Enter Meter Reading"
                  InputLabelProps={{ shrink: true }}
                  sx={{ width: "100%" }}
                  type={"number"}
                  disabled={disabled}
                  {...register("meterReading", {
                    required: true,
                    min: 0,
                    valueAsNumber: true,
                  })}
                  inputProps={{ step: "0.01" }}
                  error={!!formState.errors.meterReading}
                  helperText={
                    formState.errors.meterReading
                      ? "Meter Reading is required and must be greater than 0!"
                      : ""
                  }
                  onKeyDown={(e) => {
                    preventNegativeInput(e);
                    handleKeyDown(e);
                  }}
                  onWheel={preventScroll}
                  onChange={(e) => {
                    preventNegativeValue(e);
                    handleMeterReadingChange(e);
                  }}
                />
              </FormControl>
            </Grid>

            <Grid item xs={12} md={6} sx={{ pl: 2, pr: 6, pt: 3 }}>
              <FormControl sx={{ width: "100%" }} variant={"filled"}>
                <TextField
                  label="End Time"
                  placeholder="Enter End Time"
                  InputLabelProps={{ shrink: true }}
                  sx={{ width: "100%" }}
                  type={"datetime-local"}
                  {...register("endTime", {
                    required: true,
                  })}
                  error={!!formState.errors.endTime}
                  helperText={
                    formState.errors.endTime ? "End Time is required" : ""
                  }
                />
              </FormControl>
            </Grid>

            <Grid item xs={12} md={6} sx={{ pl: 2, pr: 6, pt: 3 }}>
              <FormControl sx={{ width: "100%" }} variant={"filled"}>
                <TextField
                  label="Stationary Running Time"
                  placeholder="Enter Stationary Running Time"
                  InputLabelProps={{ shrink: true }}
                  sx={{ width: "100%" }}
                  {...register("stationaryRunningTime", {
                    min: 0,
                    valueAsNumber: true,
                  })}
                  type={"number"}
                  error={!!formState.errors.stationaryRunningTime}
                  helperText={
                    formState.errors.stationaryRunningTime
                      ? "Stationary Running Time must be positive!"
                      : ""
                  }
                  onKeyDown={(e) => {
                    preventNegativeInput(e);
                    handleKeyDown(e);
                  }}
                  onWheel={preventScroll}
                  onChange={(e) => {
                    preventNegativeValue(e);
                  }}
                />
              </FormControl>
            </Grid>

            <Grid item xs={12} md={6} sx={{ pl: 2, pr: 6, pt: 3 }}>
              <FormControl sx={{ width: "100%" }} variant={"filled"}>
                <TextField
                  label="Total Distance"
                  placeholder="Enter Total Distance"
                  InputLabelProps={{ shrink: true }}
                  sx={{ width: "100%" }}
                  type={"number"}
                  {...register("totalDistance")}
                  // {...register("totalDistance", {
                  //   min: 0,
                  //   required: true,
                  //   valueAsNumber: true,
                  // })}
                  // error={!!formState.errors.totalDistance}
                  helperText={
                    formState.errors.totalDistance
                      ? "Total Distance is required and should be positive!"
                      : ""
                  }
                  value={totalDistance}
                  disabled
                />
              </FormControl>
            </Grid>

            <Grid item xs={12} md={6} sx={{ pl: 2, pr: 6, pt: 3 }}>
              <FormControl sx={{ width: "100%" }} variant={"filled"}>
                <TextField
                  label="Remarks"
                  placeholder="Enter Remarks"
                  InputLabelProps={{ shrink: true }}
                  sx={{ width: "100%" }}
                  {...register("remarks")}
                />
              </FormControl>
            </Grid>
          </Grid>
        )}
      </DialogContent>
      <DialogActions>
        <Button
          size="small"
          autoFocus
          disabled={isLoading}
          onClick={() => handleClose()}
        >
          Cancel
        </Button>
        <LoadingButton
          size="small"
          color="success"
          disabled={isLoading}
          loading={isLoading}
          type={"submit"}
          onClick={
            trip.destinations.length > 0
              ? handleSubmit(onSubmit)
              : onSubmitWithoutPendingDestinations
          }
          autoFocus
        >
          Make Vehicle Available
        </LoadingButton>
      </DialogActions>
    </Dialog>
  );
};

export default MakeVehicleAvailableModal;
